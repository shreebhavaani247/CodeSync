import React, { useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import TypingIndicator from './TypingIndicator';
import { useRoom } from '../state/RoomContext';

const Editor = () => {
  const { code, language, updateCode, typingUsers, user: currentUser, isLocked, role, setTyping } = useRoom();
  const debounceTimerRef = useRef(null);

  const handleEditorChange = (value) => {
    // Notify typing
    setTyping(currentUser);

    // Debounce updateCode (200ms)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      updateCode(value);
    }, 200);
  };

  // Find the first other user who is typing
  const otherTypingUser = typingUsers.find(u => u !== currentUser);

  return (
    <div className="h-full w-full bg-[#1e293b] relative group overflow-hidden">
      {/* Grid Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      {/* Top Controls Overlay */}
      <div className="absolute top-4 right-6 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-mono text-blue-400 font-bold uppercase tracking-widest backdrop-blur-md shadow-2xl">
          {language || 'javascript'}
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-20 pointer-events-none transition-all duration-500">
        <TypingIndicator user={otherTypingUser} />
      </div>

      <div className="relative z-10 h-full border border-slate-800/50 rounded-xl overflow-hidden shadow-inner">
        <MonacoEditor
          height="100%"
          width="100%"
          theme="vs-dark"
          language={language || 'javascript'}
          value={code}
          onChange={handleEditorChange}
          options={{
            fontSize: 14,
            fontFamily: 'Fira Code, monospace',
            minimap: { enabled: true },
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            renderLineHighlightOnlyWhenFocus: false,
            roundedSelection: true,
            scrollBeyondLastLine: false,
            readOnly: isLocked && role !== 'interviewer',
            cursorStyle: 'line',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            automaticLayout: true,
            padding: { top: 20, bottom: 20 },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
          }}
        />
      </div>

      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.3)] z-20" />
    </div>
  );
};

export default Editor;
