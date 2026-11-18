/**
 * Detects whether text primarily uses Perso-Arabic characters (Balochi, Urdu, Arabic).
 * @param {string} text 
 * @returns {boolean}
 */
export function isArabicScript(text) {
  if (!text || typeof text !== 'string') return false;
  
  // Strip code blocks and markdown before detecting
  const cleaned = text.replace(/```[\s\S]*?```/g, '').replace(/`.*?`/g, '').trim();
  if (!cleaned) return false;

  // Perso-Arabic Unicode range: \u0600-\u06FF, \u0750-\u077F, \uFB50-\uFDFF, \uFE70-\uFEFF
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
  const matches = cleaned.match(arabicRegex) || [];
  
  // Consider total non-whitespace alphabetical chars
  const latinMatches = cleaned.match(/[a-zA-Z]/g) || [];
  
  return matches.length >= latinMatches.length && matches.length > 0;
}

/**
 * Returns directional attributes based on script detection or explicit preference.
 * @param {string} text 
 * @param {'auto' | 'arabic' | 'roman'} overrideMode 
 * @returns {{ dir: 'rtl' | 'ltr', align: string, fontClass: string }}
 */
export function getTextDirection(text, overrideMode = 'auto') {
  if (overrideMode === 'arabic') {
    return { dir: 'rtl', align: 'text-right', fontClass: 'font-balochi' };
  }
  if (overrideMode === 'roman') {
    return { dir: 'ltr', align: 'text-left', fontClass: 'font-sans' };
  }
  
  const isRtl = isArabicScript(text);
  return {
    dir: isRtl ? 'rtl' : 'ltr',
    align: isRtl ? 'text-right' : 'text-left',
    fontClass: isRtl ? 'font-balochi' : 'font-sans'
  };
}

/**
 * Truncates a string safely for chat titles.
 * @param {string} str 
 * @param {number} maxLen 
 * @returns {string}
 */
export function truncateTitle(str, maxLen = 32) {
  if (!str) return 'سلیمانی گپ (New Chat)';
  const singleLine = str.replace(/\s+/g, ' ').trim();
  if (singleLine.length <= maxLen) return singleLine;
  return singleLine.slice(0, maxLen) + '...';
}

/**
 * Formats a timestamp into a friendly human-readable label.
 * @param {number|string} timestamp 
 * @returns {string}
 */
export function formatChatTimestamp(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
