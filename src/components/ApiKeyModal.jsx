import React, { useState } from 'react';
import { KeyRound, ExternalLink, CheckCircle2, AlertCircle, Eye, EyeOff, Sparkles, ShieldCheck, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { verifyApiKey } from '../services/gemini';

export default function ApiKeyModal({ isOpen, onClose, currentKey, onSaveKey }) {
  const [apiKeyInput, setApiKeyInput] = useState(currentKey || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleVerifyAndSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      setErrorMsg('Please enter your Google AI Studio API key.');
      return;
    }

    setIsVerifying(true);
    const result = await verifyApiKey(trimmed);
    setIsVerifying(false);

    if (result.valid) {
      setSuccessMsg('API Key successfully verified with Gemini 3.8 Flash!');
      
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // Confetti is purely decorative
      }

      setTimeout(() => {
        onSaveKey(trimmed);
        onClose();
      }, 700);
    } else {
      setErrorMsg(result.error || 'Failed to authenticate key. Please check your key and try again.');
    }
  };

  const handleClearKey = () => {
    if (window.confirm('Are you sure you want to remove your saved API key from localStorage?')) {
      onSaveKey('');
      setApiKeyInput('');
      setSuccessMsg('API key removed from localStorage.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Balochi gradient */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Google AI Studio API Key
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                  BYOK
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-balochi">
                سلیمانی بلوچی اے آئی جوڑ کنغ ءِ واستہ وتی کی (Key) داخل کنے
              </p>
            </div>
          </div>

          {currentKey && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Quick Guide */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 text-xs space-y-2.5">
            <div className="flex items-center justify-between font-semibold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                How to get your free Gemini API key:
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 hover:underline"
              >
                Open AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400 pl-1 leading-relaxed">
              <li>Click the link above and sign in with your Google account.</li>
              <li>Click <strong className="text-slate-200">"Create API Key"</strong> (Select or create any Google Cloud project).</li>
              <li>Copy your key, paste it below, and click <strong className="text-emerald-400">Verify & Start Chatting</strong>.</li>
            </ol>
            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/80 shrink-0" />
              <span>Zero-Backend: Your key never leaves your browser and is stored strictly in your local device.</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleVerifyAndSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={apiKeyInput}
                  onChange={(e) => {
                    setApiKeyInput(e.target.value);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  placeholder="AIzaSy..."
                  autoComplete="off"
                  spellCheck="false"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 pr-11 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start gap-2.5 text-xs text-red-300 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="leading-snug">{errorMsg}</div>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>{successMsg}</div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isVerifying || !apiKeyInput.trim()}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-medium rounded-xl text-sm transition shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Pinging Gemini 3.8 Flash...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Start Chatting</span>
                  </>
                )}
              </button>

              {currentKey && (
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-red-950/50 hover:text-red-300 hover:border-red-800/60 border border-slate-700 rounded-xl text-xs text-slate-300 transition"
                >
                  Clear Key
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Model: <code className="text-emerald-400">gemini-3.8-flash</code></span>
          <span>Suleimani Dialect Engine v1.0</span>
        </div>
      </div>
    </div>
  );
}
