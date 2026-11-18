import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  KeyRound, 
  Settings2, 
  Moon, 
  Sun, 
  Sparkles, 
  X, 
  Edit3, 
  Check, 
  Languages,
  ShieldCheck,
  Github
} from 'lucide-react';

export default function Sidebar({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  onClearAllSessions,
  apiKey,
  onOpenApiKeyModal,
  scriptMode,
  onChangeScriptMode,
  theme,
  onToggleTheme
}) {
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const startRename = (session, e) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditingTitle(session.title);
  };

  const saveRename = (sessionId, e) => {
    e?.stopPropagation();
    if (editingTitle.trim()) {
      onRenameSession(sessionId, editingTitle.trim());
    }
    setEditingSessionId(null);
  };

  const handleKeyDown = (sessionId, e) => {
    if (e.key === 'Enter') {
      saveRename(sessionId, e);
    } else if (e.key === 'Escape') {
      setEditingSessionId(null);
    }
  };

  const maskedKey = apiKey ? `${apiKey.slice(0, 7)}...${apiKey.slice(-4)}` : 'No Key Set';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col w-72 md:w-80 bg-slate-900 border-r border-slate-800 text-slate-200 transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header / App Branding */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Balochi Mountain Logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-0.5 shadow-md shadow-emerald-950/50 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                </svg>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-base tracking-tight text-white">SuleimaniGPT</h1>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-medium">v1.0</span>
              </div>
              <p className="text-xs text-emerald-400/90 font-balochi">
                سلیمانی بلوچی اے آئی
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition shadow-sm flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span>نوکیں گپ (New Chat)</span>
            </div>
            <span className="text-[11px] opacity-75 font-mono bg-emerald-700/50 px-1.5 py-0.5 rounded">
              Ctrl+K
            </span>
          </button>
        </div>

        {/* Script Mode Selector */}
        <div className="px-3 pb-2">
          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium px-1 mb-1.5">
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <span>Script Mode / رسم الخط</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-[11px]">
              <button
                onClick={() => onChangeScriptMode('auto')}
                className={`py-1.5 px-1 rounded-lg text-center font-medium transition ${
                  scriptMode === 'auto'
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
                title="Automatically match the user input script"
              >
                Auto (خودکار)
              </button>
              <button
                onClick={() => onChangeScriptMode('arabic')}
                className={`py-1.5 px-1 rounded-lg text-center font-medium transition font-balochi ${
                  scriptMode === 'arabic'
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
                title="Strict Perso-Arabic Balochi script"
              >
                بلوچی رسم الخط
              </button>
              <button
                onClick={() => onChangeScriptMode('roman')}
                className={`py-1.5 px-1 rounded-lg text-center font-medium transition ${
                  scriptMode === 'roman'
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
                title="Strict Roman Balochi script"
              >
                Roman
              </button>
            </div>
          </div>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          <div className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase px-2 mb-1.5">
            Previous Conversations
          </div>

          {sessions.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-slate-500">
              No saved conversations yet.
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === currentSessionId;
              const isEditing = editingSessionId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition ${
                    isActive
                      ? 'bg-slate-800 text-white font-medium border border-slate-700/80 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-1">
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={(e) => saveRename(session.id, e)}
                        onKeyDown={(e) => handleKeyDown(session.id, e)}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                        className="bg-slate-950 text-white px-2 py-0.5 rounded text-xs w-full border border-emerald-500 focus:outline-none"
                      />
                    ) : (
                      <span className="truncate">{session.title || 'سلیمانی گپ'}</span>
                    )}
                  </div>

                  {/* Actions on hover */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isEditing ? (
                      <button
                        onClick={(e) => saveRename(session.id, e)}
                        className="p-1 hover:text-emerald-400 text-slate-400"
                        title="Save title"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={(e) => startRename(session, e)}
                          className="p-1 hover:text-slate-200 text-slate-500"
                          title="Rename"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(session.id);
                          }}
                          className="p-1 hover:text-red-400 text-slate-500"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Panel: API Key Status & Actions */}
        <div className="p-3 border-t border-slate-800 space-y-2 bg-slate-950/40">
          {/* API Key Box */}
          <div 
            onClick={onOpenApiKeyModal}
            className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                apiKey ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
              }`}>
                <KeyRound className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                  <span>Gemini Key</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${apiKey ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate">
                  {maskedKey}
                </div>
              </div>
            </div>
            <Settings2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
          </div>

          {/* Quick Controls: Clear, Theme, GitHub */}
          <div className="flex items-center justify-between text-xs px-1 text-slate-400">
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 hover:text-slate-200 transition py-1"
              title="Toggle Dark/Light Mode"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px]">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[11px]">Dark</span>
                </>
              )}
            </button>

            {sessions.length > 0 && (
              <button
                onClick={onClearAllSessions}
                className="text-[11px] hover:text-red-400 text-slate-500 transition py-1"
              >
                Clear all chats
              </button>
            )}

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-200 transition p-1"
              title="GitHub Open Source"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
