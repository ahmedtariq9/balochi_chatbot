import { getSystemInstruction } from '../constants/systemInstruction';

const MODEL_NAME = 'gemini-3.8-flash';
const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Validates Google AI Studio Gemini API Key from React Native
 */
export async function verifyApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    return { valid: false, error: 'Please enter a valid API key.' };
  }

  const cleanKey = apiKey.replace(/["'\s]/g, '');

  if (!cleanKey.startsWith('AIzaSy') && !cleanKey.startsWith('AQ.')) {
    return { valid: false, error: 'Gemini API keys typically start with "AIzaSy" or "AQ.".' };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/models/${MODEL_NAME}:generateContent?key=${cleanKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Ping' }] }],
          generationConfig: { maxOutputTokens: 2, temperature: 0.1 }
        })
      }
    );

    if (response.ok) {
      return { valid: true };
    }

    const data = await response.json().catch(() => ({}));
    return { valid: false, error: data?.error?.message || `HTTP ${response.status}: Failed to authenticate.` };
  } catch (err) {
    return { valid: false, error: 'Network error: ' + (err.message || 'Check your internet connection.') };
  }
}

/**
 * Generates Suleimani Balochi response
 */
export async function generateChatResponse({ apiKey, messages, scriptMode = 'auto' }) {
  const cleanKey = (apiKey || '').replace(/["'\s]/g, '');
  if (!cleanKey) {
    throw new Error('API key is missing.');
  }

  const systemInstructionText = getSystemInstruction(scriptMode);

  const contents = messages
    .filter(m => m.content && m.content.trim().length > 0)
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

  while (contents.length > 0 && contents[0].role !== 'user') {
    contents.shift();
  }

  const response = await fetch(
    `${API_BASE_URL}/models/${MODEL_NAME}:generateContent?key=${cleanKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstructionText }] },
        contents,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4096
        }
      })
    }
  );

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(errorJson?.error?.message || `API error HTTP ${response.status}`);
  }

  const json = await response.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response received from Suleimani Balochi engine.');
  }

  return text;
}
