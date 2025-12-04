# Damage Detection Implementation Summary

## Overview
Successfully implemented AI-powered vehicle damage detection functionality that analyzes images before upload and saves damage data to WordPress postmeta.

## What Was Implemented

### 1. Gemini AI Service (`src/services/geminiService.js`)
- Created JavaScript service for damage detection using Google Gemini AI
- Functions:
  - `analyzeImageForDamage(base64, mimeType)` - Analyzes image for vehicle damage
  - `fileToBase64(file)` - Converts File object to base64 string
- Uses `gemini-2.5-flash` model for image analysis
- Returns structured JSON with:
  - `hasDamage`: boolean
  - `damages`: array of damage objects with descriptions and bounding boxes
  - `color`: detected vehicle color

### 2. WordPress API Endpoint (`class-offer-controller.php`)
- Added new REST API endpoint: `POST /wp-json/car-dealer/v1/vehicle/save-damage-data`
- Validates product ownership and attachment relationship
- Saves damage data to:
  - Attachment meta: `damage_detection_data` (on attachment post)
  - Product meta: `image_damage_{attachment_id}` (on product post)
- Includes validation function `validate_damage_data()` for data structure validation

### 3. Frontend Integration (`src/Pages/ExteriorPhotos.jsx`)
- Integrated damage detection into image upload flow
- Flow:
  1. User selects image
  2. **NEW**: Image is analyzed for damage (shows "Analyzing damage..." indicator)
  3. Image is uploaded to WordPress
  4. **NEW**: Damage data is saved to postmeta after successful upload
- Added `analyzingMap` state to track damage analysis progress
- Shows visual feedback during damage analysis (blue spinner)
- Handles errors gracefully - upload continues even if damage analysis fails

### 4. Package Dependencies
- Added `@google/genai@^1.11.0` to `package.json`

## Database Structure

### Attachment Meta
- **Meta Key**: `damage_detection_data`
- **Location**: Attachment post meta (wp_postmeta table)
- **Structure**:
```json
{
  "hasDamage": true,
  "color": "Silver",
  "damages": [
    {
      "description": "Scratch on driver side door",
      "boundingBox": {
        "x": 0.2,
        "y": 0.3,
        "width": 0.15,
        "height": 0.1
      }
    }
  ]
}
```

### Product Meta
- **Meta Key**: `image_damage_{attachment_id}`
- **Location**: Product post meta (wp_postmeta table)
- **Structure**: Same as attachment meta
- **Purpose**: Easy querying of all damage data for a product

## Environment Variables Required

Add to your `.env` file:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get API key from: [Google AI Studio](https://makersuite.google.com/app/apikey)

## Installation Steps

1. **Install npm package**:
```bash
cd amacar-customer-revamped
npm install
```

2. **Set environment variable**:
   - Add `VITE_GEMINI_API_KEY` to your `.env` file

3. **WordPress plugin is already updated** - no additional steps needed

## How It Works

1. **User uploads image** in ExteriorPhotos.jsx
2. **Damage detection runs**:
   - Image is converted to base64
   - Sent to Gemini AI for analysis
   - Returns damage data with bounding boxes
3. **Image uploads** to WordPress as normal
4. **Damage data saves** to postmeta after successful upload
5. **User sees feedback**:
   - "Analyzing damage..." during analysis
   - Toast notification with damage count
   - "Uploading..." during upload

## Error Handling

- If damage analysis fails, upload continues normally
- Error messages are logged to console
- User-friendly toast notifications for success/failure
- Database operations are wrapped in try-catch blocks

## Security Considerations

1. **Product Ownership Validation**: Only product owners can save damage data
2. **Attachment Validation**: Ensures attachment belongs to the product
3. **Data Sanitization**: All user input is sanitized before saving
4. **API Key Security**: Gemini API key should be kept secure (consider backend proxy in production)

## Next Steps (Optional Enhancements)

1. **Display Damage Overlays**: Use BoundingBox component to show damage areas on images
2. **Damage Summary View**: Show all detected damages in a summary section
3. **Dealer View**: Display damage data on dealer portal for appraisal
4. **Damage History**: Track damage detection over time
5. **Backend Proxy**: Move Gemini API calls to backend for better security

## Testing Checklist

- [ ] Install @google/genai package: `npm install`
- [ ] Set VITE_GEMINI_API_KEY in .env
- [ ] Upload an image and verify damage analysis runs
- [ ] Check WordPress postmeta for saved damage data
- [ ] Verify error handling when API key is missing
- [ ] Test with images that have damage
- [ ] Test with images that have no damage

## Files Modified

1. `amacar-customer-revamped/src/services/geminiService.js` (NEW)
2. `amacar-customer-revamped/src/Pages/ExteriorPhotos.jsx` (MODIFIED)
3. `amacar-customer-revamped/package.json` (MODIFIED)
4. `wordpress/wp-content/plugins/car-dealer-auth/includes/controllers/class-offer-controller.php` (MODIFIED)

## Notes

- Damage detection happens **before** upload to provide immediate feedback
- Damage data is saved **after** upload to ensure attachment exists
- The implementation follows WordPress database best practices
- All data is properly sanitized and validated before saving

