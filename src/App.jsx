import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import ApiKeyModal from './components/ApiKeyModal';
import { streamChatResponse } from './services/gemini';
import { truncateTitle } from './utils/textUtils';

const STORAGE_KEY_API_KEY = 'suleimani_gemini_api_key';
const STORAGE_KEY_SESSIONS = 'suleimani_chat_sessions';
const STORAGE_KEY_SCRIPT_MODE = 'suleimani_script_mode';
const STORAGE_KEY_THEME = 'suleimani_theme';

export default function App() {
  // 1. BYOK API Key State
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_API_KEY) || '';
  });
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // 2. Script Mode: 'auto' | 'arabic' | 'roman'
  const [scriptMode, setScriptMode] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_SCRIPT_MODE) || 'auto';
  });

  // 3. Theme: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
  });

  // 4. Chat Sessions
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    const initialId = 'session_' + Date.now();
    return [{
      id: initialId,
      title: 'نوکیں گپ (New Chat)',
      createdAt: Date.now(),
      messages: []
    }];
  });

  const [currentSessionId, setCurrentSessionId] = useState(() => sessions[0]?.id);

  // 5. Input & Streaming State
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Abort controller reference for stopping streaming
  const abortControllerRef = useRef(null);

  // Sync theme with HTML class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  // Sync Script Mode
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SCRIPT_MODE, scriptMode);
  }, [scriptMode]);

  // Sync Sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch {
      // Handle quota exceeded if any
    }
  }, [sessions]);

  // If no API key on mount, show setup modal
  useEffect(() => {
    if (!apiKey) {
      setIsApiKeyModalOpen(true);
    }
  }, [apiKey]);

  // Global Keyboard Shortcuts (Ctrl+K / Cmd+K for new chat)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentSession = sessions.find((s) => s.id === currentSessionId) || sessions[0];
  const messages = currentSession?.messages || [];

  // Save API key
  const handleSaveApiKey = (key) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem(STORAGE_KEY_API_KEY, key);
    } else {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
    }
    setError(null);
  };

  // Create New Chat
  const handleNewChat = () => {
    if (isStreaming) handleStopGeneration();

    const newSession = {
      id: 'session_' + Date.now(),
      title: 'نوکیں گپ (New Chat)',
      createdAt: Date.now(),
      messages: []
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setInput('');
    setError(null);
  };

  // Delete a session
  const handleDeleteSession = (sessionId) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionId);
      if (filtered.length === 0) {
        const fresh = {
          id: 'session_' + Date.now(),
          title: 'نوکیں گپ (New Chat)',
          createdAt: Date.now(),
          messages: []
        };
        setCurrentSessionId(fresh.id);
        return [fresh];
      }
      if (currentSessionId === sessionId) {
        setCurrentSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  // Rename a session
  const handleRenameSession = (sessionId, newTitle) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, title: newTitle } : s))
    );
  };

  // Clear all sessions
  const handleClearAllSessions = () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      const fresh = {
        id: 'session_' + Date.now(),
        title: 'نوکیں گپ (New Chat)',
        createdAt: Date.now(),
        messages: []
      };
      setSessions([fresh]);
      setCurrentSessionId(fresh.id);
    }
  };

  // Stop active generation
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  // Send message
  const handleSendMessage = async (overridePrompt) => {
    const textToSend = (overridePrompt || input).trim();
    if (!textToSend || isStreaming) return;

    if (!apiKey) {
      setIsApiKeyModalOpen(true);
      return;
    }

    setError(null);
    setInput('');

    const userMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: Date.now()
    };

    const assistantPlaceholder = {
      id: 'msg_' + (Date.now() + 1),
      role: 'assistant',
      content: '',
      timestamp: Date.now() + 1
    };

    const isFirstUserMessage = messages.length === 0;
    const newTitle = isFirstUserMessage ? truncateTitle(textToSend) : currentSession.title;

    // Append to messages state
    const updatedMessages = [...messages, userMessage, assistantPlaceholder];

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            title: newTitle,
            messages: updatedMessages
          };
        }
        return s;
      })
    );

    setIsStreaming(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Build message history to send to Gemini (excluding the empty placeholder)
      const historyToSend = [...messages, userMessage];

      await streamChatResponse({
        apiKey,
        messages: historyToSend,
        scriptMode,
        signal: controller.signal,
        onChunk: (_chunk, accumulated) => {
          setSessions((prev) =>
            prev.map((s) => {
              if (s.id === currentSessionId) {
                const sMessages = [...s.messages];
                if (sMessages.length > 0) {
                  const lastIdx = sMessages.length - 1;
                  sMessages[lastIdx] = {
                    ...sMessages[lastIdx],
                    content: accumulated
                  };
                }
                return { ...s, messages: sMessages };
              }
              return s;
            })
          );
        }
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(errorMsg);

        // Remove the empty assistant message if nothing was streamed
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === currentSessionId) {
              const lastMsg = s.messages[s.messages.length - 1];
              if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.content) {
                return { ...s, messages: s.messages.slice(0, -1) };
              }
            }
            return s;
          })
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  // Regenerate last assistant response
  const handleRegenerate = async () => {
    if (isStreaming || messages.length === 0) return;

    // Find the last assistant message
    const lastMsg = messages[messages.length - 1];
    let baseHistory = [...messages];

    if (lastMsg.role === 'assistant') {
      baseHistory.pop(); // remove assistant message
    }

    if (baseHistory.length === 0) return;

    const assistantPlaceholder = {
      id: 'msg_' + Date.now(),
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    };

    const newMessages = [...baseHistory, assistantPlaceholder];

    setSessions((prev) =>
      prev.map((s) => (s.id === currentSessionId ? { ...s, messages: newMessages } : s))
    );

    setIsStreaming(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await streamChatResponse({
        apiKey,
        messages: baseHistory,
        scriptMode,
        signal: controller.signal,
        onChunk: (_chunk, accumulated) => {
          setSessions((prev) =>
            prev.map((s) => {
              if (s.id === currentSessionId) {
                const sMessages = [...s.messages];
                const lastIdx = sMessages.length - 1;
                sMessages[lastIdx] = {
                  ...sMessages[lastIdx],
                  content: accumulated
                };
                return { ...s, messages: sMessages };
              }
              return s;
            })
          );
        }
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err instanceof Error ? err.message : 'Error regenerating response.');
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onClearAllSessions={handleClearAllSessions}
        apiKey={apiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        scriptMode={scriptMode}
        onChangeScriptMode={setScriptMode}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />

      {/* Main Chat View */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNewChat={handleNewChat}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          apiKey={apiKey}
          scriptMode={scriptMode}
        />

        <ChatArea
          messages={messages}
          isStreaming={isStreaming}
          onSendMessage={handleSendMessage}
          onRegenerate={handleRegenerate}
          scriptMode={scriptMode}
          error={error}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        />

        <ChatInput
          input={input}
          setInput={setInput}
          onSendMessage={() => handleSendMessage()}
          onStopGeneration={handleStopGeneration}
          isStreaming={isStreaming}
          disabled={false}
        />
      </div>

      {/* BYOK Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentKey={apiKey}
        onSaveKey={handleSaveApiKey}
      />
    </div>
  );
}
