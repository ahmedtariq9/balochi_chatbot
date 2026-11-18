import { getSystemInstruction } from '../constants/systemInstruction';

const MODEL_NAME = 'gemini-3.8-flash';
const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Validates a user's Google AI Studio Gemini API Key with a lightweight ping.
 * @param {string} apiKey 
 * @returns {Promise<{ valid: boolean, error?: string }>}
 */
export async function verifyApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    return { valid: false, error: 'Please enter a valid Google AI Studio API key.' };
  }

  // Sanitize: strip quotes, spaces, newlines
  const trimmedKey = apiKey.replace(/["'\s]/g, '');

  if (!trimmedKey.startsWith('AIzaSy')) {
    return { 
      valid: false, 
      error: 'Invalid key format. A valid Gemini API key usually starts with "AIzaSy". Get a free key at https://aistudio.google.com/app/apikey' 
    };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/models/${MODEL_NAME}:generateContent?key=${trimmedKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: 'Ping' }]
            }
          ],
          generationConfig: {
            maxOutputTokens: 2,
            temperature: 0.1
          }
        })
      }
    );

    if (response.ok) {
      return { valid: true };
    }

    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `HTTP ${response.status}: Failed to authenticate key.`;
    
    if (response.status === 400 || response.status === 403) {
      return { 
        valid: false, 
        error: 'Invalid API key or insufficient permissions. Please verify the key at aistudio.google.com.' 
      };
    }

    return { valid: false, error: message };
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : 'Network error verifying API key. Please check your connection.'
    };
  }
}

/**
 * Streams chat completion from Gemini 2.5 Flash using Server-Sent Events (SSE).
 * 
 * @param {Object} options
 * @param {string} options.apiKey
 * @param {Array<{ role: 'user' | 'assistant', content: string }>} options.messages
 * @param {'auto' | 'arabic' | 'roman'} [options.scriptMode='auto']
 * @param {(chunk: string, fullText: string) => void} options.onChunk
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<string>} Full assembled text
 */
export async function streamChatResponse({ apiKey, messages, scriptMode = 'auto', onChunk, signal }) {
  if (!apiKey) {
    throw new Error('Google Gemini API Key is required. Please set it in Settings.');
  }

  const systemInstructionText = getSystemInstruction(scriptMode);

  // Format messages into Gemini API structure
  // Gemini expects roles 'user' and 'model'
  const contents = messages
    .filter(m => m.content && m.content.trim().length > 0)
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

  if (contents.length === 0) {
    throw new Error('Cannot send an empty message payload.');
  }

  // Ensure first message is from 'user' (Gemini requirement)
  while (contents.length > 0 && contents[0].role !== 'user') {
    contents.shift();
  }

  const requestBody = {
    system_instruction: {
      parts: [{ text: systemInstructionText }]
    },
    contents,
    generationConfig: {
      temperature: 0.3, // Accurate, authentic linguistic focus
      maxOutputTokens: 4096,
      topP: 0.95
    }
  };

  const url = `${API_BASE_URL}/models/${MODEL_NAME}:streamGenerateContent?alt=sse&key=${apiKey.trim()}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody),
    signal
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    const errorMsg = errorJson?.error?.message || `Gemini API Error (HTTP ${response.status})`;
    throw new Error(errorMsg);
  }

  if (!response.body) {
    throw new Error('ReadableStream not supported in this browser.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let accumulatedText = '';
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      // Keep unfinished line in buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        const jsonStr = trimmed.slice(6).trim();
        if (!jsonStr || jsonStr === '[DONE]') continue;

        try {
          const parsed = JSON.parse(jsonStr);
          const candidates = parsed?.candidates;
          if (Array.isArray(candidates) && candidates.length > 0) {
            const parts = candidates[0]?.content?.parts;
            if (Array.isArray(parts)) {
              for (const part of parts) {
                if (part.text) {
                  accumulatedText += part.text;
                  if (typeof onChunk === 'function') {
                    onChunk(part.text, accumulatedText);
                  }
                }
              }
            }
          }
        } catch {
          // In case of incomplete JSON chunk in SSE, continue buffering
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return accumulatedText;
}
