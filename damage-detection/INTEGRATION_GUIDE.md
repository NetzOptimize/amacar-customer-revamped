# AI Vehicle Damage Detection - Integration Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [How It Works](#how-it-works)
3. [Technology Stack](#technology-stack)
4. [Required Dependencies](#required-dependencies)
5. [Core Components](#core-components)
6. [Step-by-Step Integration](#step-by-step-integration)
7. [Usage Examples](#usage-examples)
8. [Customization](#customization)
9. [API Reference](#api-reference)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This guide explains how to integrate **AI-powered vehicle damage detection** into your application. The system uses Google's Gemini AI to:

- **Detect vehicle damage** (scratches, dents, dings, scuffs, windshield cracks, rust)
- **Draw bounding boxes** around detected damage areas
- **Provide descriptions** for each damage instance
- **Identify vehicle color** (bonus feature)

### Key Features
- ✅ Real-time image analysis
- ✅ Visual bounding box overlays
- ✅ Normalized coordinates (works with any image size)
- ✅ Detailed damage descriptions
- ✅ Hover tooltips for damage details
- ✅ Handles multiple damage instances per image

---

## 🔍 How It Works

### Architecture Flow

```
User uploads image
    ↓
Convert to Base64
    ↓
Send to Gemini AI API
    ↓
AI analyzes image for damage
    ↓
Returns JSON with:
  - hasDamage: boolean
  - damages: Array of {
      description: string
      boundingBox: { x, y, width, height } // normalized 0-1
    }
  - color: string (optional)
    ↓
Calculate pixel coordinates from normalized values
    ↓
Render bounding boxes over image
```

### Coordinate System

The AI returns **normalized coordinates** (0.0 to 1.0):
- `x`: Left position (0.0 = left edge, 1.0 = right edge)
- `y`: Top position (0.0 = top edge, 1.0 = bottom edge)
- `width`: Box width as fraction of image width
- `height`: Box height as fraction of image height

These are converted to pixel coordinates based on the actual displayed image dimensions.

---

## 🛠 Technology Stack

### Core Technologies
- **React 19.1.0**: UI framework
- **TypeScript 5.8.2**: Type safety
- **Google Gemini AI** (`@google/genai` v1.11.0): AI image analysis
- **Tailwind CSS**: Styling (optional, can be replaced)

### AI Model
- **Model**: `gemini-2.5-flash`
- **Capabilities**: Vision + structured JSON output
- **Response Format**: JSON with schema validation

---

## 📦 Required Dependencies

### Install via npm:

```bash
npm install @google/genai@^1.11.0
```

### For React/TypeScript projects:

```bash
npm install react@^19.1.0 react-dom@^19.1.0
npm install -D typescript@~5.8.2
```

### Optional (for styling):

```bash
npm install -D tailwindcss
# OR use CDN (see examples below)
```

---

## 🧩 Core Components

### 1. Type Definitions

Create `damageDetectionTypes.ts`:

```typescript
export interface ImageDimensions {
    width: number;
    height: number;
}

export interface Damage {
    description: string;
    boundingBox: { 
        x: number;      // Normalized 0-1
        y: number;      // Normalized 0-1
        width: number;  // Normalized 0-1
        height: number; // Normalized 0-1
    };
}

export interface DamageAnalysisResult {
    hasDamage: boolean;
    damages: Damage[];
    color?: string; // Vehicle color (optional)
}
```

### 2. AI Service

Create `damageDetectionService.ts`:

```typescript
import { GoogleGenAI, Type } from "@google/genai";
import { DamageAnalysisResult } from "./damageDetectionTypes";

// Initialize Gemini AI client
const ai = new GoogleGenAI({ 
    apiKey: import.meta.env.VITE_GEMINI_API_KEY // or process.env.GEMINI_API_KEY
});

const MODEL = 'gemini-2.5-flash';

/**
 * Analyzes an image for vehicle damage
 * @param base64 - Base64-encoded image (without data URI prefix)
 * @param mimeType - Image MIME type (default: 'image/jpeg')
 * @returns Promise<DamageAnalysisResult>
 */
export const analyzeImageForDamage = async (
    base64: string, 
    mimeType: string = 'image/jpeg'
): Promise<DamageAnalysisResult> => {
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

    const response = await ai.models.generateContent({
        model: MODEL,
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
        return result as DamageAnalysisResult;
    } catch(e) {
        console.error("Failed to parse damage analysis response as JSON:", jsonStr);
        throw new Error("Received an invalid response from the damage analysis service.");
    }
};
```

### 3. Bounding Box Component

Create `BoundingBox.tsx`:

```typescript
import React from 'react';
import { Damage, ImageDimensions } from './damageDetectionTypes';

interface BoundingBoxProps {
    box: Damage['boundingBox'];
    imageDims: ImageDimensions;
    index: number;
    description: string;
    color?: string; // Optional: customize box color
}

export const BoundingBox: React.FC<BoundingBoxProps> = ({ 
    box, 
    imageDims, 
    index, 
    description,
    color = '#ef4444' // Default red
}) => {
    if (!imageDims.width || !imageDims.height) return null;

    // Convert normalized coordinates to pixels
    const left = box.x * imageDims.width;
    const top = box.y * imageDims.height;
    const width = box.width * imageDims.width;
    const height = box.height * imageDims.height;

    const boxStyle: React.CSSProperties = {
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        border: `3px solid ${color}`,
        boxShadow: `0 0 15px ${color}80`, // 80 = 50% opacity in hex
        pointerEvents: 'none',
        zIndex: 10,
    };
    
    const labelStyle: React.CSSProperties = {
        position: 'absolute',
        top: '-1.8rem',
        left: '0',
        pointerEvents: 'auto',
    };

    return (
        <div style={boxStyle}>
            <div className="relative group" style={labelStyle}>
                {/* Number Badge */}
                <span 
                    style={{
                        backgroundColor: color,
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '1.5rem',
                        height: '1.5rem',
                        textShadow: '1px 1px 1px rgba(0, 0, 0, 0.6)'
                    }}
                >
                    {index + 1}
                </span>

                {/* Tooltip with Description */}
                <div 
                    style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '0',
                        marginBottom: '0.5rem',
                        width: 'max-content',
                        maxWidth: '18rem',
                        backgroundColor: '#111827',
                        color: 'white',
                        fontSize: '0.875rem',
                        borderRadius: '0.375rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        padding: '0.5rem',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        pointerEvents: 'none',
                        zIndex: 30,
                    }}
                    className="group-hover:opacity-100"
                >
                    {description}
                </div>
            </div>
        </div>
    );
};
```

### 4. Image Upload Component (Example)

Create `DamageDetectionImage.tsx`:

```typescript
import React, { useState, useCallback } from 'react';
import { analyzeImageForDamage } from './damageDetectionService';
import { BoundingBox } from './BoundingBox';
import { DamageAnalysisResult, ImageDimensions } from './damageDetectionTypes';

interface DamageDetectionImageProps {
    onAnalysisComplete?: (result: DamageAnalysisResult) => void;
    onError?: (error: Error) => void;
}

export const DamageDetectionImage: React.FC<DamageDetectionImageProps> = ({
    onAnalysisComplete,
    onError
}) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [base64, setBase64] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<DamageAnalysisResult | null>(null);
    const [imageDims, setImageDims] = useState<ImageDimensions | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        // Read file as base64
        const reader = new FileReader();
        reader.onload = async (event) => {
            const dataUrl = event.target?.result as string;
            const base64Data = dataUrl.split(',')[1]; // Remove data URI prefix
            
            setImageSrc(dataUrl);
            setBase64(base64Data);
            setAnalysis(null);
            setError(null);
            setIsAnalyzing(true);

            try {
                const result = await analyzeImageForDamage(base64Data, file.type);
                setAnalysis(result);
                setIsAnalyzing(false);
                onAnalysisComplete?.(result);
            } catch (err: any) {
                console.error('Analysis failed:', err);
                setError(err.message || 'Failed to analyze image');
                setIsAnalyzing(false);
                onError?.(err);
            }
        };
        reader.readAsDataURL(file);
    }, [onAnalysisComplete, onError]);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        setImageDims({
            width: img.clientWidth,
            height: img.clientHeight
        });
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="mb-4">
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-green-50 file:text-green-700
                        hover:file:bg-green-100"
                />
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {imageSrc && (
                <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                    <img
                        src={imageSrc}
                        alt="Vehicle"
                        className="w-full h-auto"
                        onLoad={handleImageLoad}
                    />
                    
                    {/* Loading Overlay */}
                    {isAnalyzing && (
                        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                            <span className="text-white font-semibold">Analyzing damage...</span>
                        </div>
                    )}

                    {/* Bounding Boxes */}
                    {analysis && imageDims && analysis.damages.map((damage, index) => (
                        <BoundingBox
                            key={index}
                            box={damage.boundingBox}
                            imageDims={imageDims}
                            index={index}
                            description={damage.description}
                        />
                    ))}

                    {/* Results Summary */}
                    {analysis && !isAnalyzing && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="font-bold">
                                        {analysis.hasDamage 
                                            ? `${analysis.damages.length} damage(s) detected`
                                            : 'No damage detected'
                                        }
                                    </span>
                                    {analysis.color && (
                                        <span className="ml-4 text-sm">Color: {analysis.color}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
```

---

## 🚀 Step-by-Step Integration

### Step 1: Install Dependencies

```bash
npm install @google/genai@^1.11.0
```

### Step 2: Set Up Environment Variables

Create a `.env` file:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

**Get API Key**: [Google AI Studio](https://makersuite.google.com/app/apikey)

### Step 3: Copy Core Files

Copy these files to your project:
- `damageDetectionTypes.ts` (type definitions)
- `damageDetectionService.ts` (AI service)
- `BoundingBox.tsx` (visualization component)

### Step 4: Configure API Key Access

**For Vite projects:**
```typescript
// In damageDetectionService.ts
const ai = new GoogleGenAI({ 
    apiKey: import.meta.env.VITE_GEMINI_API_KEY 
});
```

**For Create React App:**
```typescript
const ai = new GoogleGenAI({ 
    apiKey: process.env.REACT_APP_GEMINI_API_KEY 
});
```

**For Next.js:**
```typescript
const ai = new GoogleGenAI({ 
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY 
});
```

**For Backend/Node.js:**
```typescript
const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY 
});
```

### Step 5: Use in Your App

```typescript
import { DamageDetectionImage } from './components/DamageDetectionImage';

function App() {
    const handleAnalysis = (result) => {
        console.log('Damage detected:', result);
        // Save to database, show notification, etc.
    };

    return (
        <div>
            <h1>Vehicle Damage Detection</h1>
            <DamageDetectionImage onAnalysisComplete={handleAnalysis} />
        </div>
    );
}
```

---

## 💡 Usage Examples

### Example 1: Basic Integration

```typescript
import { analyzeImageForDamage } from './services/damageDetectionService';

// Convert file to base64
const file = event.target.files[0];
const reader = new FileReader();
reader.onload = async (e) => {
    const base64 = e.target.result.split(',')[1];
    
    try {
        const result = await analyzeImageForDamage(base64);
        console.log('Has damage:', result.hasDamage);
        console.log('Damages:', result.damages);
        console.log('Color:', result.color);
    } catch (error) {
        console.error('Analysis failed:', error);
    }
};
reader.readAsDataURL(file);
```

### Example 2: With Image Preview

```typescript
import React, { useState } from 'react';
import { analyzeImageForDamage } from './services/damageDetectionService';
import { BoundingBox } from './components/BoundingBox';

function ImageAnalyzer() {
    const [image, setImage] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState(null);
    const [dims, setDims] = useState({ width: 0, height: 0 });

    const handleUpload = async (file: File) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64 = e.target.result.split(',')[1];
            setImage(e.target.result);
            
            const result = await analyzeImageForDamage(base64);
            setAnalysis(result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
            {image && (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img 
                        src={image} 
                        onLoad={(e) => setDims({
                            width: e.currentTarget.clientWidth,
                            height: e.currentTarget.clientHeight
                        })}
                    />
                    {analysis?.damages.map((damage, i) => (
                        <BoundingBox
                            key={i}
                            box={damage.boundingBox}
                            imageDims={dims}
                            index={i}
                            description={damage.description}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
```

### Example 3: Backend API Endpoint

```typescript
// Express.js example
import express from 'express';
import { analyzeImageForDamage } from './services/damageDetectionService';

const app = express();
app.use(express.json({ limit: '50mb' }));

app.post('/api/analyze-damage', async (req, res) => {
    try {
        const { base64, mimeType } = req.body;
        const result = await analyzeImageForDamage(base64, mimeType);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

### Example 4: Batch Processing

```typescript
const analyzeMultipleImages = async (images: string[]) => {
    const results = await Promise.all(
        images.map(base64 => analyzeImageForDamage(base64))
    );
    return results;
};
```

---

## 🎨 Customization

### Customize Damage Detection Prompt

Edit the prompt in `damageDetectionService.ts`:

```typescript
const prompt = `
    Act as a vehicle damage detection expert. Analyze the provided image.
    
    // Add your custom requirements:
    - Focus on specific damage types
    - Set severity levels
    - Include repair cost estimates
    - Detect specific parts (bumper, door, etc.)
    
    // ... rest of prompt
`;
```

### Customize Bounding Box Appearance

```typescript
<BoundingBox
    box={damage.boundingBox}
    imageDims={imageDims}
    index={index}
    description={damage.description}
    color="#3b82f6" // Blue instead of red
/>
```

### Customize Response Schema

Modify the schema in `damageDetectionService.ts` to include additional fields:

```typescript
responseSchema: {
    type: Type.OBJECT,
    properties: {
        hasDamage: { type: Type.BOOLEAN },
        damages: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    description: { type: Type.STRING },
                    boundingBox: { /* ... */ },
                    severity: { 
                        type: Type.STRING,
                        enum: ['minor', 'moderate', 'severe']
                    },
                    estimatedRepairCost: { type: Type.NUMBER },
                    // Add more fields as needed
                }
            }
        }
    }
}
```

### Styling Without Tailwind

Replace Tailwind classes with inline styles or CSS:

```typescript
// Instead of className="bg-red-500"
style={{ backgroundColor: '#ef4444' }}

// Instead of className="text-white"
style={{ color: 'white' }}
```

---

## 📚 API Reference

### `analyzeImageForDamage(base64, mimeType?)`

Analyzes an image for vehicle damage.

**Parameters:**
- `base64` (string, required): Base64-encoded image data (without `data:image/...` prefix)
- `mimeType` (string, optional): Image MIME type (default: `'image/jpeg'`)

**Returns:** `Promise<DamageAnalysisResult>`

**Example:**
```typescript
const result = await analyzeImageForDamage(base64String, 'image/png');
// {
//   hasDamage: true,
//   damages: [
//     {
//       description: "Large scratch on driver side door",
//       boundingBox: { x: 0.2, y: 0.3, width: 0.15, height: 0.1 }
//     }
//   ],
//   color: "Silver"
// }
```

### `BoundingBox` Component

Renders a visual bounding box overlay on an image.

**Props:**
- `box` (object): Normalized bounding box coordinates `{ x, y, width, height }`
- `imageDims` (object): Image dimensions `{ width, height }` in pixels
- `index` (number): Damage index (for numbering)
- `description` (string): Damage description text
- `color` (string, optional): Box color (default: `'#ef4444'`)

---

## 🐛 Troubleshooting

### Issue: "API key not valid"

**Solution:**
- Verify `.env` file exists with correct variable name
- Ensure API key is valid and has proper permissions
- Restart dev server after changing `.env`
- Check that environment variable is exposed to client (use `VITE_` prefix for Vite)

### Issue: Images not analyzing

**Solution:**
- Check browser console for errors
- Verify base64 string doesn't include `data:image/...` prefix
- Ensure image file size is reasonable (< 10MB recommended)
- Verify API key is correctly configured

### Issue: Bounding boxes not displaying

**Solution:**
- Ensure `imageDims` is set after image loads
- Check that image container has `position: relative`
- Verify bounding box coordinates are valid (0-1 range)
- Check z-index if boxes are hidden behind other elements

### Issue: "Failed to parse JSON"

**Solution:**
- This usually means AI returned unexpected format
- Check the raw response in console
- Verify prompt is clear and schema is correct
- Try with a different image

### Issue: Slow analysis

**Solution:**
- Image size affects processing time
- Compress images before sending (recommended: max 2000px width)
- Show loading indicators to users
- Consider caching results for same images

### Performance Tips

1. **Compress images before analysis:**
```typescript
const compressImage = (file: File, maxWidth: number = 2000): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scale = Math.min(maxWidth / img.width, maxWidth / img.height, 1);
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.8).split(',')[1]);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
};
```

2. **Add request timeout:**
```typescript
const analyzeWithTimeout = async (base64: string, timeout: number = 30000) => {
    return Promise.race([
        analyzeImageForDamage(base64),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
    ]);
};
```

---

## 🔒 Security Best Practices

1. **Never expose API keys in client-side code** (if possible, use backend proxy)
2. **Validate image files** before processing
3. **Implement rate limiting** to prevent abuse
4. **Sanitize user inputs** and file names
5. **Use HTTPS** for all API calls
6. **Set file size limits** to prevent DoS attacks

### Backend Proxy Pattern (Recommended)

Instead of calling Gemini API directly from frontend:

```typescript
// Frontend
const analyzeImage = async (base64: string) => {
    const response = await fetch('/api/analyze-damage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64 })
    });
    return response.json();
};

// Backend (keeps API key secret)
app.post('/api/analyze-damage', async (req, res) => {
    const { base64 } = req.body;
    const result = await analyzeImageForDamage(base64);
    res.json(result);
});
```

---

## 📊 Response Format

### Success Response

```json
{
  "hasDamage": true,
  "damages": [
    {
      "description": "Deep scratch on front bumper, approximately 12 inches long",
      "boundingBox": {
        "x": 0.15,
        "y": 0.45,
        "width": 0.25,
        "height": 0.05
      }
    },
    {
      "description": "Small dent on driver side door",
      "boundingBox": {
        "x": 0.60,
        "y": 0.35,
        "width": 0.10,
        "height": 0.12
      }
    }
  ],
  "color": "Metallic Silver"
}
```

### No Damage Response

```json
{
  "hasDamage": false,
  "damages": [],
  "color": "Pearl White"
}
```

---

## 🎓 Advanced Usage

### Custom Damage Types

Modify the prompt to detect specific damage types:

```typescript
const prompt = `
    Detect only the following damage types:
    - Windshield cracks and chips
    - Body panel dents
    - Paint scratches
    
    Ignore minor cosmetic issues.
    // ... rest of prompt
`;
```

### Multi-Image Analysis

```typescript
const analyzeVehicle = async (images: string[]) => {
    const results = await Promise.all(
        images.map(img => analyzeImageForDamage(img))
    );
    
    const allDamages = results.flatMap(r => r.damages);
    const hasAnyDamage = results.some(r => r.hasDamage);
    
    return {
        hasDamage: hasAnyDamage,
        totalDamages: allDamages.length,
        damages: allDamages,
        imagesAnalyzed: results.length
    };
};
```

---

## 📝 License & Credits

- **AI Model**: Google Gemini 2.5 Flash
- **API**: Google Generative AI SDK
- **Integration Guide**: Created for vehicle damage detection

---

**Need Help?** Check the troubleshooting section or review the code examples above.

**Last Updated**: 2024
