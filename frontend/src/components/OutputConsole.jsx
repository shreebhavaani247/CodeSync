import React from 'react';
import { Terminal as TerminalIcon, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OutputConsole = ({ output }) => {
  return (
    <div className="h-full w-full bg-[#0a0f1d] overflow-hidden group relative">
      {/* Terminal Grid Background */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="h-full overflow-y-auto p-6 font-mono text-sm scroll-smooth custom-scrollbar relative z-10">
        <div className="flex flex-col gap-4">
          {/* Initial Prompt */}
          <div className="flex items-center gap-3 text-slate-600 font-bold uppercase tracking-[0.2em] text-[10px]">
            <TerminalIcon className="w-3 h-3" />
            Terminal Session Initialized
          </div>

          <div className="flex gap-3">
            <span className="text-blue-500 font-bold select-none shrink-0 tracking-tighter">codesync@cli:~$</span>
            <div className="flex-1 space-y-4">
              <AnimatePresence mode="wait">
                {output ? (
                  <motion.div 
                    key="output"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-blue-400/60 text-[10px] font-black uppercase tracking-widest animate-pulse">
                        <div className="w-1 h-1 rounded-full bg-blue-400" />
                        Executing...
                      </div>
                      <p className="text-slate-200 leading-relaxed whitespace-pre-wrap font-medium border-l-2 border-slate-800/50 pl-4 py-1">
                        {output || "Run code to see output..."}
                      </p>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-2 text-green-500 font-black uppercase tracking-[0.2em] text-[10px] bg-green-500/5 w-fit px-3 py-1 rounded-lg border border-green-500/10"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Process Finished
                    </motion.div>
                    
                    {/* New Prompt Line */}
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-blue-500 font-bold select-none tracking-tighter">codesync@cli:~$</span>
                      <motion.div 
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="w-2 h-4 bg-blue-500/80 rounded-sm"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="idle"
                    className="flex flex-col items-center justify-center py-12 text-slate-700 opacity-40 group-hover:opacity-70 transition-all duration-500"
                  >
                    <div className="p-6 bg-slate-800/20 rounded-[32px] border border-slate-800/40 mb-4 transform group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                      <TerminalIcon className="w-12 h-12" />
                    </div>
                    <div className="flex flex-col items-center gap-2 text-center">
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-500/50">Ready for Input</span>
                      <p className="text-[10px] font-bold max-w-[180px] leading-relaxed">Run your code to see the execution results here</p>
                    </div>
                    
                    {/* Idle Blinking Cursor */}
                    <div className="flex items-center gap-2 mt-8 opacity-40">
                      <span className="text-blue-500 font-bold select-none text-xs tracking-tighter">codesync@cli:~$</span>
                      <motion.div 
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-4 bg-blue-500/60 rounded-sm shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      {/* Terminal Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/[0.01] to-transparent h-2 w-full animate-scanline z-20" />
    </div>
  );
};

export default OutputConsole;
