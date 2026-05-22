import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, ArrowRight, Terminal, Users, MessageSquare, MousePointer2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const LandingPage = () => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [role, setRole] = useState("candidate");
  const [typedCode, setTypedCode] = useState('');
  const navigate = useNavigate();

  const codeSnippet = "> const room = createRoom();\n> user.join(room);\n> collaborativeCoding.start();";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedCode(codeSnippet.slice(0, i));
      i++;
      if (i > codeSnippet.length) i = 0;
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = async () => {
    if (!username || username.trim() === "") {
      alert("Enter username");
      return;
    }
    const randomId = Math.random().toString(36).substring(2, 9).toUpperCase();
    
    try {
      await setDoc(doc(db, "rooms", randomId), { 
        roomId: randomId, 
        createdBy: username.trim(), 
        createdAt: Date.now(), 
        code: "", 
        language: "javascript" 
      });
    } catch (err) {
      console.error("Firestore error creating room:", err);
    }

    navigate(`/room/${randomId}`, { 
      state: { username: username.trim(), role } 
    });
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!username || username.trim() === "") {
      alert("Enter username");
      return;
    }
    if (!roomId || roomId.trim() === "") {
      alert("Enter room ID");
      return;
    }
    navigate(`/room/${roomId.toUpperCase()}`, { 
      state: { username: username.trim(), role } 
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center bg-[#0f172a] overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 pt-20 overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl w-full text-center space-y-10 relative z-10"
        >
          <div className="flex justify-center mb-6">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-5 bg-blue-500/10 rounded-3xl border border-blue-500/20 shadow-2xl shadow-blue-500/10 backdrop-blur-sm"
            >
              <Code2 className="w-16 h-16 text-blue-500 animate-pulse" />
            </motion.div>
          </div>
          
          <div className="relative inline-block">
            <h1 className="text-7xl font-extrabold tracking-tight text-white sm:text-8xl">
              Code<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Sync</span>
            </h1>
            <div className="absolute -inset-1 bg-blue-500/20 blur-2xl -z-10 rounded-full animate-pulse" />
          </div>
          
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-xl text-slate-400 leading-relaxed font-medium">
              Experience the future of technical interviews and pair programming. 
              Real-time synchronization meets premium developer experience.
            </p>

            {/* Fake Typing Snippet */}
            <div className="inline-block p-4 px-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md">
              <pre className="text-blue-400 font-mono text-sm text-left">
                <code>{typedCode}<span className="animate-ping">|</span></code>
              </pre>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-6 pt-8">
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
              <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 px-7 py-5 bg-slate-900/60 border border-slate-700 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-white outline-none transition-all backdrop-blur-md"
              />
              <div className="flex gap-4">
                {["candidate", "interviewer"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`px-6 py-5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border ${
                      role === r 
                      ? "bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-lg shadow-blue-500/10" 
                      : "bg-slate-900/60 border-slate-700 text-slate-500 hover:bg-slate-800/60"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-2xl">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(37, 99, 235, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateRoom}
                className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-500/20"
              >
                Create New Room
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <div className="relative flex-1 group w-full">
                <form onSubmit={handleJoinRoom} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Enter Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="w-full px-7 py-5 bg-slate-900/60 border border-slate-700 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-white outline-none transition-all pr-36 backdrop-blur-md"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl text-sm font-bold transition-all border border-slate-700 hover:border-blue-500/30 shadow-lg active:scale-95"
                  >
                    Join Room
                  </button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Live Collaboration Preview Section */}
      <section className="w-full max-w-6xl px-6 py-24 relative">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold text-white tracking-tight">Live Collaboration Preview</h2>
          <p className="text-slate-400 font-medium">Built for high-performance team sync</p>
        </div>

        <div className="relative bg-slate-900/50 border border-slate-800 rounded-[32px] p-8 shadow-3xl backdrop-blur-xl overflow-hidden group">
          {/* Editor Header */}
          <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
            <div className="ml-4 text-xs font-mono text-slate-500">collaborative-session.js</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
            {/* Live Typing Simulation */}
            <div className="space-y-4 font-mono text-sm leading-relaxed relative">
              <div className="text-slate-500 flex items-start gap-4">
                <span>1</span>
                <span className="text-blue-400">function</span>
                <span className="text-amber-400">CodeSync</span>
                <span>() {'{'}</span>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-slate-500">2</span>
                <div className="pl-6 text-slate-300 relative">
                  const collaborate = true;
                  <motion.div 
                    animate={{ x: [0, 100, 50, 200, 150] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1 left-0 flex flex-col items-start gap-1 z-20"
                  >
                    <MousePointer2 className="w-4 h-4 text-pink-500 fill-pink-500" />
                    <span className="px-2 py-0.5 bg-pink-500 text-white text-[10px] font-bold rounded-md shadow-lg whitespace-nowrap">Sarah typing...</span>
                  </motion.div>
                </div>
              </div>
              <div className="text-slate-500 flex items-start gap-4">
                <span>3</span>
                <div className="pl-6 text-slate-400">
                  return sync(collaborate);
                </div>
              </div>
              <div className="text-slate-500 flex items-start gap-4">
                <span>4</span>
                <span>{'}'}</span>
              </div>
              
              {/* Second Cursor */}
              <motion.div 
                animate={{ x: [300, 150, 400, 200], y: [0, 20, -10, 30] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-0 flex flex-col items-start gap-1 z-20 pointer-events-none"
              >
                <MousePointer2 className="w-4 h-4 text-indigo-500 fill-indigo-500" />
                <span className="px-2 py-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded-md shadow-lg whitespace-nowrap">James reviewing</span>
              </motion.div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 gap-4">
              <PreviewFeatureCard 
                icon={<Terminal className="w-5 h-5" />}
                title="Low Latency"
                description="Synchronized state under 50ms for seamless pair coding."
              />
              <PreviewFeatureCard 
                icon={<Users className="w-5 h-5" />}
                title="Rich Presence"
                description="See who is active, typing, or reviewing in real-time."
              />
              <PreviewFeatureCard 
                icon={<MessageSquare className="w-5 h-5" />}
                title="Integrated Chat"
                description="Context-aware communication right inside the editor."
              />
            </div>
          </div>
          
          {/* Inner Glow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent pointer-events-none rounded-[32px]" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-6xl px-6 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Terminal className="w-6 h-6" />}
            title="Monaco Editor"
            description="The same power behind VS Code. Multi-language support, intellisense, and high performance."
          />
          <FeatureCard 
            icon={<Users className="w-6 h-6" />}
            title="Real-time Presence"
            description="Visual cursors and typing indicators make remote collaboration feel like sitting next to each other."
          />
          <FeatureCard 
            icon={<MessageSquare className="w-6 h-6" />}
            title="Version Snapshots"
            description="Save milestones effortlessly. Revert or compare code versions with one click."
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -10, scale: 1.02, backgroundColor: "rgba(30, 41, 59, 0.8)" }}
    className="p-8 bg-slate-900/40 border border-slate-800 rounded-3xl text-left transition-all duration-300 backdrop-blur-sm group hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5"
  >
    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed font-medium">{description}</p>
  </motion.div>
);

const PreviewFeatureCard = ({ icon, title, description }) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-800/40 transition-colors border border-transparent hover:border-slate-800">
    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default LandingPage;
