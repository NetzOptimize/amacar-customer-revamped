import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini AI client
const ai = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GEMINI_API_KEY 
});

const textModel = 'gemini-2.5-flash';

/**
 * Analyzes an image for vehicle damage using Gemini AI
 * @param {string} base64 - Base64-encoded image (without data URI prefix)
 * @param {string} mimeType - Image MIME type (default: 'image/jpeg')
 * @returns {Promise<Object>} DamageAnalysisResult with hasDamage, damages array, and color
 */
export const analyzeImageForDamage = async (base64, mimeType = 'image/jpeg') => {
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
      mimeType: mimeType,
      data: base64
    }
  };

  const contents = [{
    parts: [{ text: prompt }, imagePart]
  }];

  try {
    const response = await ai.models.generateContent({
      model: textModel,
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hasDamage: { type: Type.BOOLEAN },
            color: { 
              type: Type.STRING, 
              description: "The primary exterior color of the vehicle." 
            },
            damages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { 
                    type: Type.STRING, 
                    description: "A detailed description of the identified damage." 
                  },
                  boundingBox: {
                    type: Type.OBJECT,
                    description: "An object with {x, y, width, height} properties for the damage bounding box. Coordinates are normalized from 0.0 to 1.0.",
                    properties: {
                      x: { 
                        type: Type.NUMBER, 
                        description: "Normalized x-coordinate of the top-left corner." 
                      },
                      y: { 
                        type: Type.NUMBER, 
                        description: "Normalized y-coordinate of the top-left corner." 
                      },
                      width: { 
                        type: Type.NUMBER, 
                        description: "Normalized width of the box." 
                      },
                      height: { 
                        type: Type.NUMBER, 
                        description: "Normalized height of the box." 
                      },
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
      return result;
    } catch(e) {
      console.error("Failed to parse damage analysis response as JSON:", jsonStr);
      throw new Error("Received an invalid response from the damage analysis service.");
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(error.message || "Failed to analyze image for damage");
  }
};

/**
 * Converts a File object to base64 string
 * @param {File} file - Image file
 * @returns {Promise<string>} Base64 string without data URI prefix
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      // Remove data URI prefix (e.g., "data:image/jpeg;base64,")
      const base64 = dataUrl.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

