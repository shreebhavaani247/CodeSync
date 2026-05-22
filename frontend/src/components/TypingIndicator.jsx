import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard } from 'lucide-react';

const TypingIndicator = ({ user }) => {
  if (!user) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.9 }}
        className="flex items-center gap-4 px-6 py-3 bg-[#1e293b]/90 backdrop-blur-xl border border-blue-500/20 rounded-2xl shadow-2xl shadow-blue-500/10 pointer-events-none group"
      >
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-500">
            {user[0]}
          </div>
          <div className="absolute -bottom-1 -right-1 p-1 bg-green-500 rounded-full border-2 border-[#1e293b] shadow-lg shadow-green-500/20" />
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-bold text-blue-400 leading-none mb-1 group-hover:text-blue-300 transition-colors">
            {user}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
              Typing...
            </span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 1, 0.4] 
                  }}
                  transition={{ 
                    duration: 0.6, 
                    repeat: Infinity, 
                    delay: i * 0.1 
                  }}
                  className="w-1 h-1 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="ml-2 w-8 h-8 bg-slate-800/50 rounded-lg flex items-center justify-center text-slate-500 border border-slate-700/50 group-hover:border-blue-500/30 transition-all duration-500">
          <Keyboard className="w-4 h-4" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TypingIndicator;
