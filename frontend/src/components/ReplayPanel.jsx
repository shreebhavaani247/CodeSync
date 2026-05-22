import React from 'react';
import { Play, Square, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRoom } from '../state/RoomContext';
import { motion } from 'framer-motion';

const ReplayPanel = () => {
  const { 
    events, 
    isReplaying, 
    timelineIndex, 
    playReplay, 
    stopReplay, 
    scrubTimeline 
  } = useRoom();

  if (events.length === 0) return null;

  return (
    <div className="px-6 py-4 bg-[#1e293b]/80 backdrop-blur-xl border-t border-slate-800 flex items-center gap-6 shrink-0 z-40">
      <div className="flex items-center gap-3 shrink-0">
        <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
          <History className="w-5 h-5 text-indigo-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white uppercase tracking-wider leading-none mb-1">Session Timeline</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
            {events.length} Recorded Actions
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center gap-4">
        <button
          onClick={isReplaying ? stopReplay : playReplay}
          className={`p-3 rounded-2xl transition-all shadow-xl active:scale-95 ${
            isReplaying 
            ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' 
            : 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20'
          }`}
        >
          {isReplaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
        </button>

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {timelineIndex >= 0 ? `Step ${timelineIndex + 1}` : 'Start'}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              End
            </span>
          </div>
          <input
            type="range"
            min="-1"
            max={events.length - 1}
            value={timelineIndex}
            onChange={(e) => scrubTimeline(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button 
          disabled={timelineIndex <= -1}
          onClick={() => scrubTimeline(timelineIndex - 1)}
          className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg border border-slate-700 text-slate-400 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          disabled={timelineIndex >= events.length - 1}
          onClick={() => scrubTimeline(timelineIndex + 1)}
          className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg border border-slate-700 text-slate-400 transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {isReplaying && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-600/20 animate-pulse"
        >
          REPLAYING...
        </motion.div>
      )}
    </div>
  );
};

export default ReplayPanel;
