

import { GoogleGenAI, Type } from "@google/genai";
import { FormData, AppraisalResultData, DamageAnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const textModel = 'gemini-2.5-flash';
const imageModel = 'imagen-3.0-generate-002';


export const generateVehicleImage = async (make: string, model: string, year: number): Promise<string> => {
    const prompt = `Generate a high-quality, photorealistic studio shot of a vehicle.
    - Vehicle: ${year} ${make} ${model}
    - Color: Metallic Silver
    - Shot type: Front three-quarter view
    - Background: Plain, light gray studio background with soft, professional lighting.
    - Style: Clean, automotive advertisement style.
    Do not include any text, logos, or people in the image.`;

    const response = await ai.models.generateImages({
        model: imageModel,
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '16:9',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error('Image generation failed to produce an image.');
    }
    return response.generatedImages[0].image.imageBytes;
};


export const analyzeImageForDamage = async (base64: string): Promise<DamageAnalysisResult> => {
    const prompt = `
        Act as a vehicle damage detection expert. Analyze the provided image of a car.
        Your task is to identify and precisely outline any visible damages.
        Focus on detecting: scratches, dents, dings, scuffs, windshield cracks, and significant rust.
        
        Also, identify the primary exterior color of the vehicle.

        For each detected damage, you must provide a description and a boundingBox.
        The boundingBox object should contain normalized x, y, width, and height coordinates (from 0.0 to 1.0), relative to the image size.

        Respond with ONLY a valid JSON object. Do not include any text before or after the JSON.
        The JSON object must match the schema provided.

        If no damage is detected, return:
        { "hasDamage": false, "damages": [], "color": "detected_color" }
    `;

    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64
        }
    };

    const contents = [{
        parts: [{ text: prompt }, imagePart]
    }];

    const response = await ai.models.generateContent({
        model: textModel,
        contents: contents,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    hasDamage: { type: Type.BOOLEAN },
                    color: { type: Type.STRING, description: "The primary exterior color of the vehicle." },
                    damages: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                description: { type: Type.STRING, description: "A detailed description of the identified damage." },
                                boundingBox: {
                                    type: Type.OBJECT,
                                    description: "An object with {x, y, width, height} properties for the damage bounding box. Coordinates are normalized from 0.0 to 1.0.",
                                    properties: {
                                        x: { type: Type.NUMBER, description: "Normalized x-coordinate of the top-left corner." },
                                        y: { type: Type.NUMBER, description: "Normalized y-coordinate of the top-left corner." },
                                        width: { type: Type.NUMBER, description: "Normalized width of the box." },
                                        height: { type: Type.NUMBER, description: "Normalized height of the box." },
                                    },
                                    required: ["x", "y", "width", "height"]
                                }
                            },
                             required: ["description", "boundingBox"],
                        }
                    }
                },
                required: ["hasDamage", "damages"]
            }
        }
    });
    
    const jsonStr = response.text.trim();
    try {
        const result = JSON.parse(jsonStr);
        return result as DamageAnalysisResult;
    } catch(e) {
        console.error("Failed to parse damage analysis response as JSON:", jsonStr);
        throw new Error("Received an invalid response from the damage analysis service.");
    }
};

export const getAppraisal = async (formData: FormData): Promise<AppraisalResultData> => {
    const damageNotes = Object.entries(formData.photos)
        .filter(([, photo]) => photo?.analysis?.hasDamage)
        .map(([key, photo]) => {
            const photoLabel = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            const descriptions = photo!.analysis!.damages.map(d => `- ${d.description}`).join('\n');
            return `\n**${photoLabel}:**\n${descriptions}`;
        })
        .join('');

    const textPrompt = `
      Act as an expert vehicle appraiser. Based on the following vehicle details and provided images, provide an estimated market value appraisal in USD.

      **Vehicle Details:**
      - Make: ${formData.make}
      - Model: ${formData.model}
      - Year: ${formData.year}
      - Mileage: ${formData.mileage.toLocaleString()} miles
      - VIN: ${formData.vin || 'Not provided'}
      - Detected Color: ${formData.color || 'Not specified'}
      - Exterior Condition: ${formData.exteriorCondition}
      - Interior Condition: ${formData.interiorCondition}
      - Disclosed Mechanical Issues: ${formData.mechanicalIssues || 'None disclosed'}
      - Accident History: ${formData.hasAccidents ? 'Yes' : 'No'}

      **AI-Detected Damage Notes:**
      ${damageNotes || 'No specific damage detected by AI analysis.'}

      Analyze the images for any visible damage, wear and tear, cleanliness, and special features that might affect the value. Consider the AI-detected damage notes. Provide a fair market value range (min and max). Return ONLY a valid JSON object matching the requested schema.
    `;
    
    const imageParts = Object.values(formData.photos)
      .filter(photo => photo !== null)
      .map(photo => {
        if (!photo) throw new Error("Invalid photo object");
        return {
          inlineData: {
            mimeType: 'image/jpeg',
            data: photo.base64,
          },
        };
      });

    const contents = [{
        parts: [{ text: textPrompt }, ...imageParts]
    }];
    
    const response = await ai.models.generateContent({
        model: textModel,
        contents: contents,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    estimatedValueMin: { 
                        type: Type.NUMBER, 
                        description: "The lower end of the estimated value range in USD. Do not include currency symbols or formatting." 
                    },
                    estimatedValueMax: { 
                        type: Type.NUMBER, 
                        description: "The upper end of the estimated value range in USD. Do not include currency symbols or formatting."
                    }
                },
                required: ["estimatedValueMin", "estimatedValueMax"],
            },
        }
    });

    const jsonStr = response.text.trim();
    try {
        const result = JSON.parse(jsonStr);
        return result as AppraisalResultData;
    } catch (e) {
        console.error("Failed to parse Gemini response as JSON:", jsonStr);
        throw new Error("Received an invalid response from the appraisal service.");
    }
};
