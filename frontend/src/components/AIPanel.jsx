import React from 'react';
import { Sparkles, BrainCircuit, MessageCircle, AlertCircle, Loader2, Send, Quote } from 'lucide-react';
import { useRoom } from '../state/RoomContext';
import { motion, AnimatePresence } from 'framer-motion';

const AIPanel = ({ onClose }) => {
  const { aiOutput, isAiLoading, analyzeCodeWithAI, socket, roomId, code, language } = useRoom();

  return (
    <div className="flex flex-col h-full bg-[#0f172a] border-l border-slate-800">
      <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-slate-200 font-bold text-sm uppercase tracking-widest">AI Interviewer</span>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-500 hover:text-white rounded-lg transition-all"
          >
            <AlertCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        {!aiOutput && !isAiLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-4">
            <div className="p-4 bg-purple-500/5 rounded-full border border-purple-500/10">
              <BrainCircuit className="w-12 h-12 text-slate-700" />
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-bold">Ready to analyze?</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Get instant feedback on your code, optimization tips, and potential interview questions.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                console.log("AI button clicked");
                if (!socket) {
                  console.error("Socket not available");
                  return;
                }
                analyzeCodeWithAI();
              }}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-purple-600/20 active:scale-95"
            >
              Analyze Code
            </button>
          </div>
        ) : isAiLoading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-white uppercase tracking-widest">Analyzing Code...</p>
              <p className="text-[10px] text-slate-500 font-medium">Gemini AI is reviewing your solution</p>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] px-1">
                <Quote className="w-3 h-3" />
                Interviewer Feedback
              </div>
              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl prose prose-invert prose-sm max-w-none prose-headings:text-purple-400 prose-headings:font-bold prose-headings:text-sm prose-p:text-slate-300 prose-strong:text-white prose-ul:text-slate-400">
                <div className="whitespace-pre-wrap font-medium text-sm text-slate-300 leading-relaxed">
                  {aiOutput}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/50">
              <button
                type="button"
                onClick={() => {
                  console.log("AI button clicked");
                  if (!socket) {
                    console.error("Socket not available");
                    return;
                  }
                  analyzeCodeWithAI();
                }}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all border border-slate-700 hover:border-purple-500/30 flex items-center justify-center gap-2 group"
              >
                <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                Get Fresh Analysis
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIPanel;
