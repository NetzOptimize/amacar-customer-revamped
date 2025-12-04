/**
 * OpenAI Service for NLP Parameter Extraction
 * Extracts vehicle search parameters from natural language on the frontend
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPEN_AI_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Extract vehicle search parameters from natural language query
 * @param {string} query - User's natural language search query
 * @returns {Promise<Object>} Extracted parameters
 */
export async function extractVehicleParams(query) {
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not configured');
    throw new Error('OpenAI API key not configured');
  }

  if (!query || query.trim().length < 2) {
    return {};
  }

  const systemPrompt = `You are a vehicle search assistant. Extract vehicle search parameters from user queries.
Return ONLY a valid JSON object with the following structure. Use null for missing values:
{
  "make": "string or null",
  "model": "string or null",
  "year": "integer or null",
  "min_price": "number or null",
  "max_price": "number or null",
  "body": "string or null",
  "transmission": "string or null",
  "fuel": "string or null",
  "exterior_color": "string or null",
  "min_year": "integer or null",
  "max_year": "integer or null",
  "new_used": "N or U or null",
  "certified": "boolean or null",
  "min_odometer": "integer or null",
  "max_odometer": "integer or null"
}

Examples:
- "I want a 2020 Toyota Camry" -> {"make":"Toyota","model":"Camry","year":2020}
- "SUV under 30000" -> {"body":"SUV","max_price":30000}
- "red sedan" -> {"exterior_color":"red","body":"sedan"}
- "used car" -> {"new_used":"U"}
- "certified vehicle" -> {"certified":true}
- "2025 mazda, honda under 25000" -> {"make":"Mazda","max_price":25000} or handle multiple makes`;

  const userPrompt = `Extract vehicle search parameters from: ${query}`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 300,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Invalid response from OpenAI');
    }

    const extracted = JSON.parse(content);

    // Sanitize and validate extracted parameters
    return sanitizeParams(extracted);
  } catch (error) {
    console.error('OpenAI extraction error:', error);
    throw error;
  }
}

/**
 * Sanitize and validate extracted parameters
 * @param {Object} params - Raw extracted parameters
 * @returns {Object} Sanitized parameters
 */
function sanitizeParams(params) {
  const sanitized = {};

  // String fields
  const stringFields = ['make', 'model', 'body', 'transmission', 'fuel', 'exterior_color'];
  stringFields.forEach(field => {
    if (params[field] && typeof params[field] === 'string') {
      sanitized[field] = params[field].trim();
    }
  });

  // Integer fields
  const intFields = ['year', 'min_year', 'max_year', 'min_odometer', 'max_odometer'];
  intFields.forEach(field => {
    if (params[field] !== null && params[field] !== undefined) {
      const value = parseInt(params[field], 10);
      if (!isNaN(value) && value > 0) {
        sanitized[field] = value;
      }
    }
  });

  // Price fields
  if (params.min_price !== null && params.min_price !== undefined) {
    const value = parseFloat(params.min_price);
    if (!isNaN(value) && value >= 0) {
      sanitized.min_price = value;
    }
  }
  if (params.max_price !== null && params.max_price !== undefined) {
    const value = parseFloat(params.max_price);
    if (!isNaN(value) && value >= 0) {
      sanitized.max_price = value;
    }
  }

  // Boolean fields
  if (typeof params.certified === 'boolean') {
    sanitized.certified = params.certified;
  }

  // Enum fields
  if (params.new_used === 'N' || params.new_used === 'U') {
    sanitized.new_used = params.new_used;
  }

  return sanitized;
}

