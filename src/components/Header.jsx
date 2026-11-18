import React from 'react';
import { Menu, Plus, KeyRound, Sparkles, Languages } from 'lucide-react';

export default function Header({
  onToggleSidebar,
  onNewChat,
  onOpenApiKeyModal,
  apiKey,
  scriptMode
}) {
  const scriptLabels = {
    auto: 'Auto Script',
    arabic: 'بلوچی رسم الخط',
    roman: 'Roman Balochi'
  };

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-4 flex items-center justify-between z-30 shrink-0">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-white hidden sm:inline">
            SuleimaniGPT
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-xs font-balochi text-emerald-400 font-medium">
            سلیمانی بلوچی اے آئی
          </span>
        </div>
      </div>

      {/* Center Badges */}
      <div className="hidden md:flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-emerald-400">gemini-3.8-flash</span>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400">
          <Languages className="w-3 h-3 text-slate-400" />
          <span>{scriptLabels[scriptMode] || 'Auto'}</span>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenApiKeyModal}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
            apiKey
              ? 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
          }`}
          title="Google AI Studio API Key"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{apiKey ? 'API Key Configured' : 'Set API Key'}</span>
        </button>

        <button
          onClick={onNewChat}
          className="p-2 sm:px-3 sm:py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition shadow-sm"
          title="Start a new chat"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>
    </header>
  );
}
