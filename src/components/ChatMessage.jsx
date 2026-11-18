import React, { useState } from 'react';
import { Copy, Check, RotateCw, User, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { getTextDirection, isArabicScript } from '../utils/textUtils';

/**
 * Lightweight, robust markdown formatter for chat responses
 */
function FormattedContent({ text, isRtl }) {
  if (!text) return null;

  // Split into code blocks and normal text blocks
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`space-y-3 ${isRtl ? 'font-balochi text-base leading-loose' : 'font-sans text-sm leading-relaxed'}`}>
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const firstLine = lines[0].trim();
          const language = /^[a-zA-Z0-9_-]+$/.test(firstLine) ? firstLine : '';
          const codeBody = language ? lines.slice(1).join('\n') : lines.join('\n');

          return <CodeBlock key={index} code={codeBody} language={language} />;
        }

        // Render formatted text paragraphs
        return (
          <div key={index} className="space-y-2">
            {part.split(/\n\n+/).map((para, pIdx) => {
              const trimmed = para.trim();
              if (!trimmed) return null;

              // Unordered list
              if (trimmed.split('\n').every(line => /^\s*[-*•]\s+/.test(line))) {
                return (
                  <ul key={pIdx} className={`list-disc space-y-1 my-2 ${isRtl ? 'pr-5' : 'pl-5'}`}>
                    {trimmed.split('\n').map((li, liIdx) => (
                      <li key={liIdx}>
                        {renderInlineFormatting(li.replace(/^\s*[-*•]\s+/, ''))}
                      </li>
                    ))}
                  </ul>
                );
              }

              // Numbered list
              if (trimmed.split('\n').every(line => /^\s*\d+[.)]\s+/.test(line))) {
                return (
                  <ol key={pIdx} className={`list-decimal space-y-1 my-2 ${isRtl ? 'pr-5' : 'pl-5'}`}>
                    {trimmed.split('\n').map((li, liIdx) => (
                      <li key={liIdx}>
                        {renderInlineFormatting(li.replace(/^\s*\d+[.)]\s+/, ''))}
                      </li>
                    ))}
                  </ol>
                );
              }

              // Blockquote
              if (trimmed.startsWith('>')) {
                return (
                  <blockquote
                    key={pIdx}
                    className={`p-2.5 my-2 rounded-lg bg-slate-800/40 border-slate-700 text-slate-300 italic ${
                      isRtl ? 'border-r-4 pr-3 pl-2' : 'border-l-4 pl-3 pr-2'
                    }`}
                  >
                    {renderInlineFormatting(trimmed.replace(/^>\s*/gm, ''))}
                  </blockquote>
                );
              }

              // Normal paragraph with line breaks
              return (
                <p key={pIdx} className="break-words">
                  {para.split('\n').map((line, lIdx, arr) => (
                    <React.Fragment key={lIdx}>
                      {renderInlineFormatting(line)}
                      {lIdx < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Handles inline code `code`, bold **text**, and emphasis *text*
 */
function renderInlineFormatting(line) {
  const parts = line.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((seg, idx) => {
    if (seg.startsWith('`') && seg.endsWith('`') && seg.length > 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-800 text-emerald-300 font-mono text-[0.88em] border border-slate-700/60"
        >
          {seg.slice(1, -1)}
        </code>
      );
    }
    if (seg.startsWith('**') && seg.endsWith('**') && seg.length > 4) {
      return <strong key={idx} className="font-bold text-white">{seg.slice(2, -2)}</strong>;
    }
    if (seg.startsWith('*') && seg.endsWith('*') && seg.length > 2) {
      return <em key={idx} className="italic text-slate-200">{seg.slice(1, -1)}</em>;
    }
    return seg;
  });
}

/**
 * Clean Code Block with copy button
 */
function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs shadow-md" dir="ltr">
      <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800 text-slate-400">
        <span className="uppercase text-[10px] font-semibold text-emerald-400 tracking-wider">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-slate-200 leading-relaxed scrollbar-thin">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function ChatMessage({
  message,
  isLatestAssistant,
  isStreaming,
  onRegenerate,
  scriptMode
}) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { dir, align, fontClass } = getTextDirection(message.content, scriptMode);
  const isArabic = isArabicScript(message.content);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className={`py-5 px-4 sm:px-6 transition-colors animate-message ${
        isUser ? 'bg-transparent' : 'bg-slate-900/40 border-y border-slate-800/40'
      }`}
    >
      <div className="max-w-3xl mx-auto flex gap-4 sm:gap-5 items-start">
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shadow-sm">
              <User className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-md shadow-emerald-950/40 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          )}
        </div>

        {/* Content Box */}
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200">
                {isUser ? 'You' : 'SuleimaniGPT'}
              </span>
              {!isUser && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-balochi">
                  سلیمانی بلوچی
                </span>
              )}
              {isArabic && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                  رسم الخط
                </span>
              )}
            </div>

            {/* Actions for Assistant */}
            {!isUser && (
              <div className="flex items-center gap-1 text-slate-400">
                <button
                  onClick={handleSpeech}
                  className="p-1 rounded-md hover:bg-slate-800 hover:text-white transition"
                  title={isSpeaking ? 'Stop reading' : 'Read aloud'}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleCopyMessage}
                  className="p-1 rounded-md hover:bg-slate-800 hover:text-white transition"
                  title="Copy full message"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                {isLatestAssistant && !isStreaming && (
                  <button
                    onClick={onRegenerate}
                    className="p-1 rounded-md hover:bg-slate-800 hover:text-white transition"
                    title="Regenerate response"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Message Text with RTL/LTR attributes */}
          <div dir={dir} className={`${align} ${fontClass} text-slate-100`}>
            {message.content ? (
              <FormattedContent text={message.content} isRtl={dir === 'rtl'} />
            ) : isStreaming ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400/90 py-1 font-balochi" dir="rtl">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>سلیمانی بلوچی ٹی نبشتہ کنغ انت... (Composing in Suleimani Balochi)</span>
              </div>
            ) : null}

            {/* Streaming cursor */}
            {isStreaming && isLatestAssistant && (
              <span className="cursor-blink text-emerald-400" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
