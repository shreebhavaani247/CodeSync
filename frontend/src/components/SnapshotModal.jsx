import React from 'react';
import { X, Save, Clock, Trash2, Search, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoom } from '../state/RoomContext';

const SnapshotModal = ({ isOpen, onClose, snapshots }) => {
  const { loadSnapshot, role, saveSnapshot } = useRoom();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xl bg-slate-950/60 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#1e293b] border border-slate-700/50 w-full max-w-2xl rounded-3xl shadow-2xl shadow-blue-500/10 flex flex-col overflow-hidden max-h-[80vh]"
      >
        <div className="px-8 py-6 border-b border-slate-700/50 flex items-center justify-between shrink-0 bg-[#1e293b]/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/10">
              <Save className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-white tracking-tight leading-none mb-1">Code Snapshots</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-none">Version History Management</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 text-slate-400 hover:text-white rounded-xl transition-all border border-transparent hover:border-slate-700/50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/50 pb-2">Recent Versions</h3>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-xl group transition-all focus-within:border-blue-500/50">
                <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-xs text-slate-300 w-32 placeholder:text-slate-600" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {snapshots.map((snapshot, idx) => (
                <div key={idx} className="group flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-blue-500/30 transition-all hover:bg-slate-900 shadow-xl shadow-slate-950/20 active:scale-[0.99]">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-lg shadow-blue-500/5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white leading-none mb-1.5 group-hover:text-blue-400 transition-colors capitalize">
                        {snapshot.language} Snapshot
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Saved</span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(snapshot.savedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {role === 'interviewer' && (
                      <button 
                        onClick={() => {
                          loadSnapshot(snapshot);
                          onClose();
                        }}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {snapshots.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-slate-800 rounded-2xl">
                  <p className="text-slate-500 text-sm font-medium">No snapshots saved yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-[#1e293b]/50 border-t border-slate-700/50 flex items-center justify-between shrink-0">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total: {snapshots.length} Versions</p>
          <button 
            onClick={saveSnapshot}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Create New Snapshot
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SnapshotModal;
