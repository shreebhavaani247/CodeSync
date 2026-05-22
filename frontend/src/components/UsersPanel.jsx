import React from 'react';
import { Users as UsersIcon, UserMinus } from 'lucide-react';
import { useRoom } from '../state/RoomContext';
import { motion } from 'framer-motion';

const UsersPanel = () => {
  const { users, user: currentUser, role, removeUser } = useRoom();
  return (
    <div className="flex flex-col h-full bg-[#1e293b]/20 backdrop-blur-sm border-b border-slate-800">
      <div className="px-5 py-4 border-b border-slate-800 bg-[#1e293b]/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <UsersIcon className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-slate-200 font-bold text-sm uppercase tracking-widest">Participants</span>
        </div>
        <div className="px-2.5 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full text-[10px] font-bold text-blue-400 uppercase">
          {users.length} Active
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {users.map((user, idx) => (
          <motion.div 
            key={user.id || idx} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between group p-3 bg-slate-900/30 hover:bg-slate-800/50 rounded-2xl transition-all border border-slate-800/50 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-2xl transition-transform group-hover:scale-105 duration-300 ${
                  user.role === 'interviewer' ? 'bg-gradient-to-br from-indigo-600 to-blue-600' : 'bg-gradient-to-br from-slate-700 to-slate-800'
                }`}>
                  {user.name[0]}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-[3px] border-[#0f172a] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                  {user.name || 'Unknown'} {user.name === currentUser && '(You)'}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                    user.role === 'interviewer' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
                  }`}>
                    {user.role || 'member'}
                  </span>
                </div>
              </div>
            </div>
            
            {role === 'interviewer' && user.name !== currentUser && (
              <button 
                onClick={() => removeUser(user.id)}
                title="Remove Participant"
                className="p-2 text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 active:scale-90"
              >
                <UserMinus className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UsersPanel;
