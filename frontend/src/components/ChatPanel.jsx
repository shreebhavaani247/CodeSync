import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useRoom } from '../state/RoomContext';
import { motion, AnimatePresence } from 'framer-motion';

const ChatPanel = () => {
  const { messages, sendMessage, user: currentUser } = useRoom();
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage || newMessage.trim() === "") return;
    
    sendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-[#1e293b]/20 backdrop-blur-sm relative">
      <div className="px-5 py-4 border-b border-slate-800 bg-[#1e293b]/40 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-slate-200 font-bold text-sm uppercase tracking-widest">Chat</span>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          <span className="text-[10px] font-bold text-green-500 uppercase">Live</span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {Array.isArray(messages) && messages.map((msg, idx) => {
            const isMe = msg.username === currentUser;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex flex-col gap-1.5 ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex items-center gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg ${
                    isMe ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {msg.username ? msg.username[0] : '?'}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-bold tracking-wide ${isMe ? 'text-blue-400 text-right' : 'text-slate-400'}`}>
                      {msg.username || 'Unknown'}
                    </span>
                  </div>
                </div>
                
                <div className="group relative max-w-[85%]">
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed transition-all duration-300 hover:shadow-2xl ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/10' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none shadow-lg shadow-black/20'
                  }`}>
                    {msg.message}
                  </div>
                  <span className={`absolute -bottom-5 text-[9px] text-slate-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${
                    isMe ? 'right-0' : 'left-0'
                  }`}>
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="p-5 bg-[#1e293b]/40 border-t border-slate-800/50 shrink-0">
        <form onSubmit={handleSendMessage} className="relative group">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full px-5 py-3.5 bg-slate-900/80 border border-slate-700 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm text-white outline-none transition-all pr-14 shadow-2xl backdrop-blur-md"
          />
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 group-focus-within:opacity-100 group-focus-within:scale-105"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
