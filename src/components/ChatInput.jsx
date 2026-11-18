import React, { useRef, useEffect } from 'react';
import { ArrowUp, Square, Sparkles } from 'lucide-react';
import { isArabicScript } from '../utils/textUtils';

export default function ChatInput({
  input,
  setInput,
  onSendMessage,
  onStopGeneration,
  isStreaming,
  disabled
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      // Cap at 200px max height
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && input.trim()) {
        onSendMessage();
      }
    }
  };

  const isInputRtl = isArabicScript(input);

  return (
    <div className="p-4 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent shrink-0">
      <div className="max-w-3xl mx-auto">
        {/* Main Input Box */}
        <div className="relative rounded-2xl bg-slate-900/90 border border-slate-700/80 focus-within:border-emerald-500/80 focus-within:ring-2 focus-within:ring-emerald-500/20 shadow-xl transition-all duration-200">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            dir={isInputRtl ? 'rtl' : 'ltr'}
            placeholder="سلیمانی، اردو یا انگریزی ٹی کُجھ جست کن... (Ask in Balochi, Urdu, or English)"
            className={`w-full py-3.5 pl-4 pr-12 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none resize-none text-sm max-h-48 overflow-y-auto ${
              isInputRtl ? 'font-balochi text-base pr-4 pl-12 text-right' : 'font-sans text-left'
            }`}
          />

          {/* Action Button: Send or Stop */}
          <div className={`absolute bottom-2.5 ${isInputRtl ? 'left-2.5' : 'right-2.5'}`}>
            {isStreaming ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="w-8 h-8 rounded-xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition shadow-md shadow-red-950/50"
                title="Stop generation"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (input.trim()) onSendMessage();
                }}
                disabled={!input.trim() || disabled}
                className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white flex items-center justify-center transition shadow-md shadow-emerald-950/50"
                title="Send message (Enter)"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>

        {/* Footer info & hotkey notice */}
        <div className="flex items-center justify-between px-2 pt-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 font-balochi text-slate-400">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>سلیمانی بلوچی اے آئی — خلوص، میار ءُ دود</span>
          </div>

          <div className="hidden sm:inline font-mono text-[10px] text-slate-500">
            Shift + Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}
