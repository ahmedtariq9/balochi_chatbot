import React, { useRef, useEffect, useState } from 'react';
import { ArrowDown, AlertTriangle, KeyRound } from 'lucide-react';
import ChatMessage from './ChatMessage';
import StarterCards from './StarterCards';

export default function ChatArea({
  messages,
  isStreaming,
  onSendMessage,
  onRegenerate,
  scriptMode,
  error,
  onOpenApiKeyModal
}) {
  const bottomRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Auto-scroll when messages change or while streaming
  useEffect(() => {
    if (!showScrollBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming, showScrollBottom]);

  // Handle scroll detection
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollBottom(!isNearBottom);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollBottom(false);
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto relative scroll-smooth flex flex-col"
    >
      {/* If empty chat, show starter cards */}
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center my-auto">
          <StarterCards onSelectPrompt={onSendMessage} />
        </div>
      ) : (
        <div className="flex-1 pb-4">
          {messages.map((msg, index) => {
            const isLatest = index === messages.length - 1;
            const isLatestAssistant = !isLatest && msg.role === 'assistant';
            const isLastMessageAssistant = isLatest && msg.role === 'assistant';

            return (
              <ChatMessage
                key={msg.id || index}
                message={msg}
                isLatestAssistant={isLastMessageAssistant || isLatestAssistant}
                isStreaming={isStreaming && isLatest}
                onRegenerate={onRegenerate}
                scriptMode={scriptMode}
              />
            );
          })}

          {/* Error Banner */}
          {error && (
            <div className="max-w-3xl mx-auto px-4 py-3 my-3">
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-start justify-between gap-3 animate-fade-in">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-0.5">Error generating Suleimani Balochi response</div>
                    <div className="text-red-300/90 leading-relaxed">{error}</div>
                  </div>
                </div>

                <button
                  onClick={onOpenApiKeyModal}
                  className="px-3 py-1.5 rounded-lg bg-red-900/50 hover:bg-red-800/60 text-white font-medium border border-red-700/60 flex items-center gap-1.5 shrink-0 transition"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Check Key</span>
                </button>
              </div>
            </div>
          )}

          <div ref={bottomRef} className="h-4" />
        </div>
      )}

      {/* Floating Scroll to Bottom button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-24 right-6 sm:right-10 z-20 p-2.5 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-white shadow-xl backdrop-blur-md transition-all hover:scale-110"
          title="Scroll to bottom"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
