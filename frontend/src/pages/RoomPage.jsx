import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Navbar from '../components/Navbar';
import ProblemPanel from '../components/ProblemPanel';
import Editor from '../components/Editor';
import ChatPanel from '../components/ChatPanel';
import UsersPanel from '../components/UsersPanel';
import OutputConsole from '../components/OutputConsole';
import SnapshotModal from '../components/SnapshotModal';
import ReplayPanel from '../components/ReplayPanel';
import AIPanel from '../components/AIPanel';
import { useRoom } from '../state/RoomContext';
import { room as mockRoomData } from '../state/roomState';
import { Clock, ShieldCheck, Terminal as TerminalIcon } from 'lucide-react';

const RoomPage = () => {
  const { roomId: urlRoomId } = useParams();
  const location = useLocation();
  const { roomId, user, role, users, code, language, messages, output, mode, isLocked, snapshots, joinRoom, leaveRoom, runCode, saveSnapshot } = useRoom();

  // Safe username retrieval: state -> localStorage -> Guest
  const username = 
    location.state?.username || 
    localStorage.getItem("username") || 
    "Guest";
    
  const userRole = 
    location.state?.role || 
    localStorage.getItem("role") || 
    "candidate";

  // Debug logs for troubleshooting
  useEffect(() => {
    console.log("Username:", username);
    console.log("Location state:", location.state);
  }, [username, location.state]);

  // Store user info for persistence on refresh
  useEffect(() => {
    if (username) {
      localStorage.setItem("username", username);
    }
    if (userRole) {
      localStorage.setItem("role", userRole);
    }
  }, [username, userRole]);

  const joinedRef = useRef(false);

  // Join room on mount, leave on unmount
  useEffect(() => {
    if (urlRoomId && username && !joinedRef.current) {
      console.log("Joining Room", urlRoomId);
      joinRoom(urlRoomId, username, userRole);
      joinedRef.current = true;
    }
    return () => {
      // We don't call leaveRoom() or disconnect here to maintain stable connection
      // especially during React StrictMode double-mounts
    };
  }, [urlRoomId, joinRoom, username, userRole]);

  // Prevent rendering or joining if basic data is missing
  if (!username) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0f172a] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium animate-pulse">Initializing session...</span>
        </div>
      </div>
    );
  }

  const [isProblemPanelOpen, setIsProblemPanelOpen] = useState(true);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);

  const handleRunCode = () => {
    console.log("RUN CLICKED");
    runCode();
  };

  return (
    <MainLayout>
      <Navbar 
        roomId={roomId || urlRoomId} 
        onOpenSnapshots={() => setIsSnapshotModalOpen(true)} 
        onSaveSnapshot={saveSnapshot}
        onToggleAI={() => setIsAiPanelOpen(!isAiPanelOpen)}
        isAiOpen={isAiPanelOpen}
      />
      
      <div className="flex-1 flex overflow-x-auto overflow-y-hidden custom-scrollbar">
        {/* Left: Problem Panel */}
        {isProblemPanelOpen && (
          <div className="w-80 border-r border-slate-800 bg-[#0f172a] flex flex-col shrink-0">
            <ProblemPanel problem={mockRoomData.problem} onClose={() => setIsProblemPanelOpen(false)} />
          </div>
        )}

        {/* Center: Editor & Output */}
        <div className="flex-1 flex flex-col bg-[#0f172a] relative">
          {!isProblemPanelOpen && (
            <button 
              onClick={() => setIsProblemPanelOpen(true)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-slate-800 hover:bg-slate-700 text-slate-300 p-1 rounded-r-lg border border-l-0 border-slate-700"
            >
              <div className="writing-vertical text-xs font-medium py-2">PROBLEM</div>
            </button>
          )}
          
          <div className="flex-1 overflow-hidden">
            <Editor />
          </div>

          <div className="h-64 border-t border-slate-800 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-[#1e293b]/50 border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-300 font-medium text-sm">
                <TerminalIcon className="w-4 h-4" />
                Console Output
              </div>
              <button 
                onClick={handleRunCode}
                disabled={mode === 'interview' && role !== 'interviewer'}
                className={`px-4 py-1 text-white text-sm font-medium rounded-lg transition-colors shadow-lg ${
                  mode === 'interview' && role !== 'interviewer'
                  ? 'bg-slate-700 cursor-not-allowed opacity-50'
                  : 'bg-green-600 hover:bg-green-500 shadow-green-500/20'
                }`}
              >
                {mode === 'interview' && role !== 'interviewer' ? 'Interviewer Only' : 'Run Code'}
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <OutputConsole output={output} />
            </div>
          </div>
        </div>

        {/* Right: Side Panels */}
        <div className="w-80 border-l border-slate-800 bg-[#0f172a] flex flex-col shrink-0">
          <div className="flex-1 overflow-hidden border-b border-slate-800">
            <UsersPanel />
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatPanel />
          </div>
        </div>

        {/* AI Panel (Collapsible) */}
        {isAiPanelOpen && (
          <div className="w-80 border-l border-slate-800 bg-[#0f172a] flex flex-col shrink-0">
            <AIPanel onClose={() => setIsAiPanelOpen(false)} />
          </div>
        )}
      </div>

      <ReplayPanel />

      {/* Footer */}
      <footer className="h-12 border-t border-slate-800 bg-[#1e293b]/30 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Clock className="w-4 h-4 text-blue-500" />
            Time remaining: <span className="font-mono text-white font-semibold">{mockRoomData.timer}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            Mode: <span className="text-white font-semibold capitalize">{mode}</span>
          </div>
          {isLocked && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <Clock className="w-4 h-4" />
              Editor: <span className="font-semibold uppercase">Locked by Interviewer</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 uppercase tracking-widest font-bold">Acting as:</span>
            <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
              role === 'interviewer' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-700 text-slate-400'
            }`}>
              {role || 'guest'}
            </span>
          </div>
          
          {mode === 'interview' && role === 'interviewer' && (
            <button className="px-4 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg text-sm font-medium transition-all">
              Give Hint
            </button>
          )}
        </div>
      </footer>

      <SnapshotModal 
        isOpen={isSnapshotModalOpen} 
        onClose={() => setIsSnapshotModalOpen(false)} 
        snapshots={snapshots} 
      />
    </MainLayout>
  );
};

export default RoomPage;
