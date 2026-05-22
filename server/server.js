import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { exec } from 'child_process';
import fs from 'fs';
import dotenv from 'dotenv';
import { analyzeCode } from './services/aiService.js';

dotenv.config();

console.log("GEMINI KEY:", process.env.GEMINI_API_KEY ? "LOADED" : "MISSING");

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST"]
}));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const users = {}; // socket.id -> { username, role, roomId }
const roomStates = {}; // roomId -> { isLocked: boolean }

function getMode(roomUsers) {
  const interviewerExists = roomUsers.some(u => u.role === "interviewer");
  if (interviewerExists) return "interview";
  return "collab";
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ roomId, username, role }) => {
    socket.join(roomId);
    users[socket.id] = { username, role, roomId };
    console.log(`${username} (${role}) joined ${roomId}`);

    // Get list of all clients in the room with their info
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    const roomUsers = clients.map(id => ({
      id,
      name: users[id]?.username || 'User',
      role: users[id]?.role || 'candidate'
    }));

    io.to(roomId).emit("room-users", roomUsers);
    io.to(roomId).emit("room-mode", getMode(roomUsers));
    
    // Send current lock state
    if (roomStates[roomId]) {
      socket.emit("lock-update", roomStates[roomId].isLocked);
    }
  });

  socket.on("toggle-lock", ({ roomId, locked }) => {
    if (!roomStates[roomId]) roomStates[roomId] = {};
    roomStates[roomId].isLocked = locked;
    io.to(roomId).emit("lock-update", locked);
  });

  socket.on("remove-user", ({ roomId, targetSocketId }) => {
    const user = users[socket.id];
    if (user && user.role === "interviewer") {
      io.sockets.sockets.get(targetSocketId)?.disconnect();
    }
  });

  socket.on("typing", ({ roomId, user }) => {
    socket.to(roomId).emit("user-typing", user);
  });

  socket.on("ai-analyze", async (data) => {
    console.log("AI REQUEST RECEIVED:", data);
    const { roomId, code, language } = data;
    
    try {
      const result = await analyzeCode(code, language);
      io.to(roomId).emit("ai-response", result);
    } catch (err) {
      console.error("AI analysis error:", err);
      io.to(roomId).emit("ai-response", "AI error occurred");
    }
  });

  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("code-update", code);
  });

  socket.on("language-change", ({ roomId, language }) => {
    socket.to(roomId).emit("language-update", language);
  });

  socket.on("send-message", ({ roomId, message, username }) => {
    io.to(roomId).emit("receive-message", { 
      message, 
      username,
      timestamp: Date.now()
    });
  });

  socket.on("run-code", async ({ roomId, code, language }) => {
    console.log("RUN:", language);
    
    //----------------------------------- 
    // JAVASCRIPT EXECUTION 
    //----------------------------------- 
    if (language === "javascript") {
      let output = "";

      try {
        const logs = [];
        const originalLog = console.log;

        // Redirect console.log to capture output
        console.log = (...args) => {
          logs.push(args.join(" "));
        };

        const result = eval(code);
        
        // Restore console.log
        console.log = originalLog;

        const evalResult = result !== undefined ? result.toString() : "";
        output = logs.join("\n") || evalResult || "No output";
      } catch (err) {
        output = err.message;
      }

      console.log("OUTPUT:", output);
      io.to(roomId).emit("code-output", output);
      return;
    }

    //----------------------------------- 
    // PYTHON EXECUTION 
    //----------------------------------- 
    if (language === "python") {
      const filePath = "./temp.py";
      fs.writeFileSync(filePath, code);

      exec(`python ${filePath}`, (error, stdout, stderr) => {
        let output = "";
        if (error) output = error.message;
        else if (stderr) output = stderr;
        else output = stdout;

        console.log("OUTPUT:", output);
        io.to(roomId).emit("code-output", output || "No output");

        // Cleanup
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      return;
    }

    //----------------------------------- 
    // FALLBACK 
    //----------------------------------- 
    io.to(roomId).emit("code-output", "Only JS & Python supported");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    const user = users[socket.id];
    if (user) {
      const roomId = user.roomId;
      delete users[socket.id];
      
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
      const roomUsers = clients.map(id => ({
        id,
        name: users[id]?.username || 'User',
        role: users[id]?.role || 'candidate'
      }));
      io.to(roomId).emit("room-users", roomUsers);
      io.to(roomId).emit("room-mode", getMode(roomUsers));
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
