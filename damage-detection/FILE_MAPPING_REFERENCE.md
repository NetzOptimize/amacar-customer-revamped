# File Mapping Reference - Damage Detection Integration
## Frontend React (JavaScript) Implementation

## 📁 Files to Copy from This Project

### ✅ Essential Files (Must Copy & Convert to JavaScript)

| Source File | Convert To | Purpose | Conversion Notes |
|------------|------------|---------|------------------|
| `services/geminiService.ts` (lines 37-111) | `services/geminiService.js` | Core `analyzeImageForDamage()` function | **Remove TypeScript types, keep logic** |
| `components/BoundingBox.tsx` | `components/BoundingBox.jsx` | Red circle/square overlay with hover tooltip | **Remove TypeScript, convert to JSX** |
| `types.ts` (lines 10-31) | Reference only | Type definitions | **Use as reference for data structure** |

---

## 🔑 Key Functions to Extract

### 1. `analyzeImageForDamage()` Function

**Location**: `services/geminiService.ts` (lines 37-111)

**What it does**:
- Takes base64-encoded image
- Sends to Gemini API with damage detection prompt
- Returns structured JSON with damage data

**Key Components to Copy**:

```typescript
// Lines 38-53: Prompt (COPY EXACTLY)
const prompt = `Act as a vehicle damage detection expert...`

// Lines 66-101: API Call Configuration
const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [...],
    config: {
        responseMimeType: "application/json",
        responseSchema: {...}  // COPY THIS SCHEMA
    }
});
```

**JavaScript Conversion**:
- Remove `: Promise<DamageAnalysisResult>` type annotations
- Remove `import type` statements
- Keep all logic exactly the same
- Change `const ai = new GoogleGenAI(...)` to use `process.env.REACT_APP_GEMINI_API_KEY`

---

### 2. BoundingBox Component

**Location**: `components/BoundingBox.tsx` (full file)

**What it does**:
- Displays red circle/square on damage area
- Shows number badge
- Shows description tooltip on hover

**Key Code to Copy**:

```typescript
// Lines 15-24: Coordinate conversion (COPY)
const left = box.x * imageDims.width;
const top = box.y * imageDims.height;
const width = box.width * imageDims.width;
const height = box.height * imageDims.height;

// Lines 15-24: Box styling (COPY)
const boxStyle = {
    position: 'absolute',
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
    border: '3px solid #ef4444', // Red
    // ...
};

// Lines 44-47: Tooltip (COPY)
<div className="... group-hover:opacity-100 ...">
    {description}
</div>
```

**JavaScript Conversion**:
- Remove `interface BoundingBoxProps` → Use JSDoc comments
- Remove `React.FC<BoundingBoxProps>` → Use regular function
- Remove `import type` → Use regular imports
- Keep all JSX and styling exactly the same

---

### 3. Type Definitions (Reference Only)

**Location**: `types.ts` (lines 10-31)

**Use as Reference for Data Structure**:

```typescript
// Damage structure
{
    description: string;
    boundingBox: { x, y, width, height }; // normalized 0-1
}

// DamageAnalysisResult structure
{
    hasDamage: boolean;
    damages: Damage[];
    color?: string;
}
```

**JavaScript Equivalent** (no types needed, just structure):
```javascript
// Just use plain objects - no types needed
{
    description: "minor scratch on passenger front door",
    boundingBox: { x: 0.2, y: 0.3, width: 0.15, height: 0.1 }
}
```

---

## 📦 Dependencies

### From `package.json`:

```json
{
  "dependencies": {
    "@google/genai": "^1.11.0"  // ← REQUIRED - Install in your React app
  }
}
```

**Install in your React project**:
```bash
npm install @google/genai@^1.11.0
```

---

## 🔄 Integration Flow

### Current Project Flow:
```
Image Upload → Base64 → analyzeImageForDamage() → Gemini API → DamageAnalysisResult
```

### Your WooCommerce React Flow:
```
User uploads image in React
    ↓
Image saved to WordPress Media
    ↓
React: Convert image to base64
    ↓
React: Call analyzeImageForDamage() (from geminiService.js)
    ↓
Gemini API returns damage data
    ↓
React: Save to WordPress via AJAX (saveDamageAnalysis)
    ↓
WordPress: Store in postmeta
    ↓
Dealer views: React loads damage data from postmeta
    ↓
React: Display with BoundingBox components
    ↓
React: Show descriptions at bottom
```

---

## 📝 Code Snippets to Copy Exactly

### 1. Gemini API Prompt (Exact Copy)
**From**: `services/geminiService.ts` (lines 38-53)

```javascript
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
```

**Use this exact prompt** - it's optimized for damage detection.

### 2. Response Schema (Exact Copy)
**From**: `services/geminiService.ts` (lines 71-99)

```javascript
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
```

**Copy this schema exactly** - it defines the response structure.

### 3. BoundingBox Coordinate Conversion (Exact Copy)
**From**: `components/BoundingBox.tsx` (lines 17-20)

```javascript
// Convert normalized coordinates (0-1) to pixel coordinates
const left = box.x * imageDims.width;
const top = box.y * imageDims.height;
const width = box.width * imageDims.width;
const height = box.height * imageDims.height;
```

**This is the key calculation** - converts normalized 0-1 coordinates to actual pixels.

---

## 🎯 Quick Start Checklist

- [ ] Copy `services/geminiService.ts` → Convert to `services/geminiService.js` (remove TypeScript)
- [ ] Copy `components/BoundingBox.tsx` → Convert to `components/BoundingBox.jsx` (remove TypeScript)
- [ ] Extract Gemini API prompt (lines 38-53 from geminiService.ts)
- [ ] Extract response schema (lines 71-99 from geminiService.ts)
- [ ] Install `@google/genai@^1.11.0` in your React project
- [ ] Set up Gemini API key in environment variable
- [ ] Create WordPress AJAX endpoints (PHP) for saving/loading damage data
- [ ] Create React service for WordPress AJAX calls
- [ ] Create VehicleImageWithDamage component
- [ ] Create DamageDescriptions component
- [ ] Test: Upload → Analyze → Save → Display flow

---

## 🔄 TypeScript to JavaScript Conversion Guide

### Function Signatures

**TypeScript**:
```typescript
export const analyzeImageForDamage = async (
    base64: string, 
    mimeType: string = 'image/jpeg'
): Promise<DamageAnalysisResult> => {
```

**JavaScript**:
```javascript
/**
 * @param {string} base64 - Base64-encoded image
 * @param {string} mimeType - Image MIME type (default: 'image/jpeg')
 * @returns {Promise<Object>} DamageAnalysisResult
 */
export const analyzeImageForDamage = async (base64, mimeType = 'image/jpeg') => {
```

### Component Props

**TypeScript**:
```typescript
interface BoundingBoxProps {
    box: Damage['boundingBox'];
    imageDims: ImageDimensions;
    index: number;
    description: string;
}

const BoundingBox: React.FC<BoundingBoxProps> = ({ box, imageDims, index, description }) => {
```

**JavaScript**:
```javascript
/**
 * @param {Object} props
 * @param {Object} props.box - Bounding box {x, y, width, height}
 * @param {Object} props.imageDims - Image dimensions {width, height}
 * @param {number} props.index - Damage index
 * @param {string} props.description - Damage description
 */
const BoundingBox = ({ box, imageDims, index, description }) => {
```

### Imports

**TypeScript**:
```typescript
import type { Damage, ImageDimensions } from '../types';
```

**JavaScript**:
```javascript
// No type imports needed - just remove the import
// Types are only for reference
```

---

## 📚 Additional Reference Files

| File | Purpose |
|------|---------|
| `INTEGRATION_GUIDE.md` | Complete integration guide with examples |
| `components/Step3PhotoUpload.tsx` | Example of using BoundingBox in image upload |
| `components/Step4Review.tsx` | Example of displaying damage analysis results |

---

## 🎨 UI Requirements from Client

✅ **Red circles or squares** on specific damage areas  
✅ **Hover to show note** (e.g., "minor scratch on passenger front door")  
✅ **Descriptions displayed at bottom** of vehicle portfolio/info  
✅ **For appraisal purposes** - dealer side only  

**Implementation**:
- `BoundingBox.jsx` → Red circles/squares with hover tooltips
- `DamageDescriptions.jsx` → Bottom descriptions list
- Both components use data from WordPress postmeta

---

**Note**: You don't need the backend PHP service - just the AJAX endpoints to save/load data from WordPress postmeta. All damage detection happens in the React frontend.
