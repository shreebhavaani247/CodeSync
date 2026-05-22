import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, LogOut, Save, ChevronDown, UserCircle2, Lock, Unlock, Users, Sparkles } from 'lucide-react';
import { useRoom } from '../state/RoomContext';

const Navbar = ({ roomId, onOpenSnapshots, onSaveSnapshot, onToggleAI, isAiOpen }) => {
  const navigate = useNavigate();
  const { language, updateLanguage, role, leaveRoom, isLocked, toggleLock, mode } = useRoom();

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/');
  };

  const languages = ['javascript', 'python', 'java', 'cpp', 'go'];

  return (
    <nav className="h-14 border-b border-slate-800 bg-[#1e293b]/50 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
            <Code2 className="w-6 h-6 text-blue-500" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">CodeSync</span>
        </div>
        
        <div className="h-6 w-[1px] bg-slate-700/50 mx-2" />
        
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Room ID</span>
          <div className="px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700 text-sm font-mono text-blue-400 font-bold shadow-lg shadow-blue-500/5">
            {roomId}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Role Toggle (Demo Only) */}
        <button 
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 text-xs font-bold text-slate-400 hover:text-white transition-all group"
          title="Current role"
        >
          <UserCircle2 className="w-4 h-4 group-hover:text-blue-400" />
          Role: <span className="text-blue-400 uppercase tracking-wider">{role || 'guest'}</span>
        </button>

        {role === 'interviewer' && (
          <button 
            onClick={() => toggleLock(!isLocked)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs font-bold ${
              isLocked 
              ? "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20" 
              : "bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20"
            }`}
            title={isLocked ? "Unlock Editor" : "Lock Editor"}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            {isLocked ? "LOCKED" : "UNLOCKED"}
          </button>
        )}

        <div className={`relative group/lang ${mode === 'interview' && role !== 'interviewer' ? 'pointer-events-none opacity-80' : ''}`}>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 cursor-pointer transition-colors group">
            <span className="text-sm font-medium text-slate-300 group-hover:text-white capitalize">{language || 'javascript'}</span>
            {(mode !== 'interview' || role === 'interviewer') && <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />}
          </div>
          {(mode !== 'interview' || role === 'interviewer') && (
            <div className="absolute top-full right-0 mt-2 w-40 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all py-2 z-50">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => updateLanguage(lang)}
                  className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-blue-400 transition-colors font-medium capitalize"
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={onToggleAI}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-lg active:scale-95 ${
            isAiOpen 
            ? "bg-purple-600 text-white shadow-purple-500/20" 
            : "bg-slate-800 hover:bg-slate-700 text-purple-400 border border-slate-700 shadow-blue-500/5"
          }`}
        >
          <Sparkles className={`w-4 h-4 ${isAiOpen ? "text-white" : "text-purple-400"}`} />
          AI Assist
        </button>

        <button 
          onClick={onSaveSnapshot}
          className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Save className="w-4 h-4" />
          Save Snapshot
        </button>

        <button 
          onClick={onOpenSnapshots}
          className="flex items-center gap-2 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-500/5 active:scale-95"
        >
          <Users className="w-4 h-4" />
          View Snapshots
        </button>

        <button 
          onClick={handleLeaveRoom}
          className="flex items-center gap-2 px-4 py-1.5 bg-slate-800 hover:bg-red-500/10 text-slate-300 hover:text-red-500 border border-slate-700 hover:border-red-500/30 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-red-500/5 active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          Leave
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
