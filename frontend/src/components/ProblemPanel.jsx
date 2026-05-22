import React, { useState } from 'react';
import { BookOpen, ChevronLeft, Edit2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ProblemPanel = ({ problem, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#1e293b]/20 backdrop-blur-sm relative overflow-hidden group">
      <div className="px-5 py-4 border-b border-slate-800 bg-[#1e293b]/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-slate-200 font-bold text-sm uppercase tracking-widest">Problem</span>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-slate-800/80 text-slate-500 hover:text-white rounded-lg transition-all border border-transparent hover:border-slate-700/50 active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        {/* Title Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl shadow-xl space-y-4 group/card hover:border-blue-500/30 transition-all duration-300"
        >
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-bold text-white tracking-tight leading-tight group-hover/card:text-blue-400 transition-colors">
              {problem.title}
            </h2>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-xl transition-all border shadow-lg shrink-0 active:scale-90 ${
                isEditing 
                  ? 'bg-green-600/10 text-green-500 border-green-600/30 hover:bg-green-600/20 shadow-green-500/10' 
                  : 'bg-blue-600/10 text-blue-500 border-blue-600/30 hover:bg-blue-600/20 shadow-blue-500/10'
              }`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-bold text-green-500 uppercase tracking-[0.1em]">Easy</span>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Acceptance: 52.4%</span>
          </div>
        </motion.div>

        {/* Description Block */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-1">Description</h3>
          <div className="p-5 bg-slate-800/30 border border-slate-800/50 rounded-2xl">
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-medium opacity-90">
              {problem.description}
            </p>
          </div>
        </div>

        {/* Examples Block */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-1">Examples</h3>
          <div className="p-5 bg-slate-900/60 border-l-4 border-blue-500/50 rounded-2xl space-y-4 font-mono text-xs shadow-2xl shadow-black/20">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-1 h-1 rounded-full bg-blue-500" />
                <span className="uppercase font-bold tracking-wider">Input</span>
              </div>
              <p className="text-blue-300 pl-3">nums = [2,7,11,15], target = 9</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-1 h-1 rounded-full bg-green-500" />
                <span className="uppercase font-bold tracking-wider">Output</span>
              </div>
              <p className="text-green-400 pl-3">[0,1]</p>
            </div>
            <div className="pt-2 border-t border-slate-800/50">
              <p className="text-slate-500 italic text-[10px]">Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</p>
            </div>
          </div>
        </div>

        {/* Constraints Block */}
        <div className="space-y-3 pb-4">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-1">Constraints</h3>
          <div className="p-5 bg-slate-800/20 border border-slate-800 rounded-2xl">
            <ul className="space-y-3">
              {[
                "2 <= nums.length <= 104",
                "-109 <= nums[i] <= 109",
                "Only one valid answer exists."
              ].map((constraint, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-slate-400 font-medium group/item">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-600 group-hover/item:text-blue-500 transition-colors mt-0.5 shrink-0" />
                  <span className="group-hover/item:text-slate-200 transition-colors">{constraint}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPanel;
