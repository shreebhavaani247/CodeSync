import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  setDoc, 
  doc,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore"; 
import { db } from "../firebase";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  // State
  const [roomId, setRoomId] = useState('');
  const [user, setUser] = useState('');
  const [role, setRole] = useState('');
  const [users, setUsers] = useState([]);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('collab');
  const [isLocked, setIsLocked] = useState(false);
  const [snapshots, setSnapshots] = useState([]);
  const [events, setEvents] = useState([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const [timelineIndex, setTimelineIndex] = useState(-1);
  const [aiOutput, setAiOutput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Socket management
  const { socket, isConnected, connectSocket, disconnectSocket } = useSocket();
  const listenersSetupRef = useRef(false);
  const codeSaveTimeoutRef = useRef(null);

  /**
   * Effect to handle real-time session events and snapshots from Firestore
   */
  useEffect(() => {
    if (!roomId) return;

    console.log("Setting up real-time listeners for room:", roomId);

    // 1. Real-time Session Events Listener
    const eventsQuery = query(
      collection(db, "rooms", roomId, "events"),
      orderBy("timestamp", "asc")
    );
    
    const unsubscribeEvents = onSnapshot(eventsQuery, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => doc.data());
      console.log("Real-time events sync:", eventsData.length);
      setEvents(eventsData);
    }, (error) => {
      console.error("Firestore events listener error:", error);
    });

    // 2. Real-time Snapshots Listener
    const snapshotsQuery = query(
      collection(db, "rooms", roomId, "snapshots"),
      orderBy("savedAt", "desc")
    );
    
    const unsubscribeSnapshots = onSnapshot(snapshotsQuery, (snapshot) => {
      const snapshotsData = snapshot.docs.map(doc => doc.data());
      setSnapshots(snapshotsData);
    });

    // 3. Real-time Messages Listener
    const messagesQuery = query(
      collection(db, "rooms", roomId, "messages"),
      orderBy("timestamp", "asc")
    );
    
    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => doc.data());
      setMessages(messagesData);
    });

    return () => {
      console.log("Unsubscribing from real-time listeners for room:", roomId);
      unsubscribeEvents();
      unsubscribeSnapshots();
      unsubscribeMessages();
    };
  }, [roomId]);

  /**
   * Join a room with user info
   */
  const joinRoom = useCallback(
    async (newRoomId, newUser, newRole) => {
      setRoomId(newRoomId);
      setUser(newUser);
      setRole(newRole);

      // Load room data from Firestore
      try {
        const docSnap = await getDoc(doc(db, "rooms", newRoomId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.code) setCode(data.code);
          if (data.language) setLanguage(data.language);
        }
      } catch (err) {
        console.error("Firestore error loading room data:", err);
      }

      connectSocket();
    },
    [connectSocket]
  );

  /**
   * Effect to handle emitting join-room ONLY AFTER socket is connected
   */
  useEffect(() => {
    if (isConnected && socket && roomId && user) {
      console.log("Emitting join-room", roomId, user);
      socket.emit('join-room', {
        roomId,
        username: user,
        role
      });

      // Save user join to Firestore
      const saveUserJoin = async () => {
        try {
          await addDoc(collection(db, "rooms", roomId, "users"), { 
            username: user, 
            role, 
            joinedAt: Date.now() 
          });
        } catch (err) {
          console.error("Firestore error saving user join:", err);
        }
      };
      saveUserJoin();
    }
  }, [isConnected, socket, roomId, user, role]);

  /**
   * Leave the current room
   */
  const leaveRoom = useCallback(() => {
    if (socket && roomId) {
      socket.emit('leave-room', { roomId });
      console.log('Leaving room:', roomId);
    }
    // disconnectSocket(); // Removed to prevent immediate disconnect/reconnect loop
    setRoomId('');
    setUser('');
    setRole('');
    setUsers([]);
    setCode('');
    setMessages([]);
    setTypingUsers([]);
    setOutput('');
  }, [socket, roomId]);

  /**
   * Update code and emit to server
   */
  const updateCode = useCallback(
    (newCode) => {
      if (isLocked && role !== 'interviewer') {
        return;
      }
      
      setCode(newCode);

      // DO NOT emit or record if replaying
      if (isReplaying) return;

      if (socket && roomId) {
        socket.emit('code-change', {
          roomId,
          code: newCode
        });

        // Debounced save to Firestore (500ms)
        if (codeSaveTimeoutRef.current) clearTimeout(codeSaveTimeoutRef.current);
        codeSaveTimeoutRef.current = setTimeout(async () => {
          try {
            await setDoc(doc(db, "rooms", roomId), { code: newCode }, { merge: true });
            
            // Record event
            await addDoc(collection(db, "rooms", roomId, "events"), {
              type: "code",
              value: newCode,
              timestamp: Date.now()
            });
          } catch (err) {
            console.error("Firestore error saving code/event:", err);
          }
        }, 500);
      }
    },
    [socket, roomId, isLocked, role, isReplaying]
  );

  /**
   * Update language and emit to server
   */
  const updateLanguage = useCallback(
    async (newLanguage) => {
      console.log("Mode:", mode);
      console.log("Role:", role);
      
      if (mode === "interview" && role !== 'interviewer') {
        console.warn("Only interviewer can change language in interview mode");
        return;
      }
      
      setLanguage(newLanguage);

      // DO NOT emit or record if replaying
      if (isReplaying) return;

      if (socket && roomId) {
        socket.emit('language-change', {
          roomId,
          language: newLanguage
        });

        // Save language to Firestore
        try {
          await setDoc(doc(db, "rooms", roomId), { language: newLanguage }, { merge: true });
          
          // Record event
          await addDoc(collection(db, "rooms", roomId, "events"), {
            type: "language",
            value: newLanguage,
            timestamp: Date.now()
          });
        } catch (err) {
          console.error("Firestore error saving language/event:", err);
        }
      }
    },
    [socket, roomId, role, mode, isReplaying]
  );

  /**
   * Send a chat message
   */
  const sendMessage = useCallback(
    async (messageText) => {
      if (isReplaying) return;

      if (socket && roomId && user) {
        console.log("Sending:", messageText);
        const messageData = {
          roomId,
          message: messageText,
          username: user,
          timestamp: Date.now()
        };

        socket.emit('send-message', messageData);

        // Save message to Firestore
        try {
          await addDoc(collection(db, "rooms", roomId, "messages"), {
            username: user,
            message: messageText,
            timestamp: messageData.timestamp
          });

          // Record event
          await addDoc(collection(db, "rooms", roomId, "events"), {
            type: "chat",
            value: messageText,
            username: user,
            timestamp: messageData.timestamp
          });
        } catch (err) {
          console.error("Firestore error saving message/event:", err);
        }
      }
    },
    [socket, roomId, user, isReplaying]
  );

  /**
   * Run the current code on the backend
   */
  const runCode = useCallback(() => {
    if (mode === 'interview' && role !== 'interviewer') {
      console.warn("Only interviewer can run code in interview mode");
      return;
    }
    
    if (socket && roomId && code) {
      console.log("Sending to backend:", { roomId, code, language });
      socket.emit('run-code', {
        roomId,
        code,
        language
      });
    }
  }, [socket, roomId, code, language]);

  /**
   * Notify that user is typing
   */
  const setTyping = useCallback(
    (typingUser) => {
      if (socket && roomId) {
        socket.emit('typing', {
          roomId,
          user: typingUser
        });
      }
    },
    [socket, roomId]
  );

  /**
   * Toggle editor lock (interviewer only)
   */
  const toggleLock = useCallback(
    (locked) => {
      if (socket && roomId && role === 'interviewer') {
        socket.emit('toggle-lock', { roomId, locked });
      }
    },
    [socket, roomId, role]
  );

  /**
   * Remove a user (interviewer only)
   */
  const removeUser = useCallback(
    (targetSocketId) => {
      if (socket && roomId && role === 'interviewer') {
        socket.emit('remove-user', { roomId, targetSocketId });
      }
    },
    [socket, roomId, role]
  );

  /**
   * Save a snapshot of the current code
   */
  const saveSnapshot = useCallback(
    async () => {
      if (socket && roomId && code) {
        try {
          const newSnapshot = {
            code,
            language,
            savedAt: Date.now()
          };
          await addDoc(collection(db, "rooms", roomId, "snapshots"), newSnapshot);
          setSnapshots(prev => [newSnapshot, ...prev]);
        } catch (err) {
          console.error("Firestore error saving snapshot:", err);
        }
      }
    },
    [socket, roomId, code, language]
  );

  /**
   * Load a snapshot's code and language
   */
  const loadSnapshot = useCallback(
    (snapshot) => {
      if (role !== 'interviewer') {
        console.warn("Only interviewer can load snapshots");
        return;
      }
      if (snapshot.code !== undefined) {
        updateCode(snapshot.code);
      }
      if (snapshot.language !== undefined) {
        updateLanguage(snapshot.language);
      }
    },
    [role, updateCode, updateLanguage]
  );

  /**
   * Apply a specific event (LOCAL ONLY)
   */
  const applyEvent = useCallback((event) => {
    if (event.type === "code") setCode(event.value);
    if (event.type === "language") setLanguage(event.value);
    if (event.type === "chat") {
      setMessages((prev) => {
        const newMessage = {
          username: event.username || 'System',
          message: event.value,
          timestamp: event.timestamp
        };
        // Check if message already exists to avoid duplicates during timeline scrub
        const exists = prev.some(m => m.timestamp === event.timestamp && m.message === event.value);
        if (exists) return prev;
        return [...prev, newMessage].sort((a, b) => a.timestamp - b.timestamp);
      });
    }
  }, []);

  /**
   * Play the session replay
   */
  const playReplay = useCallback(() => {
    if (events.length === 0) return;
    
    setIsReplaying(true);
    let i = timelineIndex >= 0 ? timelineIndex : 0;

    const interval = setInterval(() => {
      if (i >= events.length) {
        clearInterval(interval);
        setIsReplaying(false);
        return;
      }

      applyEvent(events[i]);
      setTimelineIndex(i);
      i++;
    }, 400);

    return () => clearInterval(interval);
  }, [events, timelineIndex, applyEvent]);

  /**
   * Scrub the timeline to a specific index
   */
  const scrubTimeline = useCallback((index) => {
    setTimelineIndex(index);
    if (index === -1) {
      // Reset to current room state (optional, could reload from Firestore)
      return;
    }

    // Apply all events up to index
    // Clear chat for clean scrub
    setMessages([]);
    for (let i = 0; i <= index; i++) {
      applyEvent(events[i]);
    }
  }, [events, applyEvent]);

  /**
   * Stop replay and return to live
   */
  const stopReplay = useCallback(() => {
    setIsReplaying(false);
    // Optionally reload latest state from Firestore or wait for next socket update
  }, []);

  /**
   * Request AI code analysis
   */
  const analyzeCodeWithAI = useCallback(() => {
    console.log("AI button clicked");
    if (socket && roomId && code) {
      console.log("AI event emitted");
      setIsAiLoading(true);
      setAiOutput('');
      socket.emit('ai-analyze', {
        roomId,
        code,
        language
      });
    } else {
      console.error("Socket or required data not available", { socket: !!socket, roomId, code: !!code });
    }
  }, [socket, roomId, code, language]);

  /**
   * Setup socket listeners (called once)
   */
  useEffect(() => {
    if (!socket || !isConnected || listenersSetupRef.current) {
      return;
    }

    listenersSetupRef.current = true;
    console.log('Setting up socket listeners');

    /**
     * Listen for code updates from other users
     */
    const handleCodeUpdate = (incomingCode) => {
      setCode((prevCode) => {
        if (prevCode === incomingCode) {
          return prevCode;
        }
        return incomingCode;
      });
    };

    /**
     * Listen for language updates
     */
    const handleLanguageUpdate = (lang) => {
      setLanguage(lang);
    };

    /**
     * Listen for incoming messages
     */
    const handleReceiveMessage = (data) => {
      console.log("Received:", data);
      if (!data || !data.message) return;
      setMessages((prevMessages) => {
        const safeMessages = Array.isArray(prevMessages) ? prevMessages : [];
        return [...safeMessages, data];
      });
    };

    /**
     * Listen for full users list (initial sync)
     */
    const handleRoomUsers = (users) => {
      console.log("Users received:", users);
      setUsers(users || []);
    };

    /**
     * Listen for code execution output
     */
    const handleCodeOutput = (result) => {
      console.log("RECEIVED OUTPUT:", result);
      setOutput(result || '');
    };

    /**
     * Listen for room mode changes
     */
    const handleRoomMode = (newMode) => {
      console.log("Mode update:", newMode);
      setMode(newMode);
    };

    /**
     * Listen for lock updates
     */
    const handleLockUpdate = (locked) => {
      console.log("Lock update:", locked);
      setIsLocked(locked);
    };

    /**
     * Listen for typing indicators
     */
    const handleUserTyping = (typingUser) => {
      setTypingUsers((prev) => {
        if (prev.includes(typingUser)) return prev;
        return [...prev, typingUser];
      });

      // Clear typing indicator after 2 seconds
      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u !== typingUser));
      }, 2000);
    };

    /**
     * Listen for AI response
     */
    const handleAiResponse = (response) => {
      console.log("AI RESPONSE RECEIVED:", response);
      setAiOutput(response);
      setIsAiLoading(false);
    };

    // Attach listeners
    socket.on('code-update', handleCodeUpdate);
    socket.on('language-update', handleLanguageUpdate);
    socket.on('receive-message', handleReceiveMessage);
    socket.on('room-users', handleRoomUsers);
    socket.on('code-output', handleCodeOutput);
    socket.on('room-mode', handleRoomMode);
    socket.on('lock-update', handleLockUpdate);
    socket.on('user-typing', handleUserTyping);
    socket.on('ai-response', handleAiResponse);

    /**
     * Cleanup: Remove listeners on unmount
     */
    return () => {
      socket.off('code-update', handleCodeUpdate);
      socket.off('language-update', handleLanguageUpdate);
      socket.off('receive-message', handleReceiveMessage);
      socket.off('room-users', handleRoomUsers);
      socket.off('code-output', handleCodeOutput);
      socket.off('room-mode', handleRoomMode);
      socket.off('lock-update', handleLockUpdate);
      socket.off('user-typing', handleUserTyping);
      socket.off('ai-response', handleAiResponse);
      listenersSetupRef.current = false;
      console.log('Cleaned up socket listeners');
    };
  }, [socket, isConnected]);

  const value = {
    // State
    roomId,
    user,
    role,
    users,
    code,
    language,
    messages,
    typingUsers,
    output,
    mode,
    isLocked,
    snapshots,
    events,
    isReplaying,
    timelineIndex,
    aiOutput,
    isAiLoading,
    isConnected,
    socket,

    // Actions
    joinRoom,
    leaveRoom,
    updateCode,
    updateLanguage,
    sendMessage,
    runCode,
    setTyping,
    toggleLock,
    removeUser,
    saveSnapshot,
    loadSnapshot,
    playReplay,
    stopReplay,
    scrubTimeline,
    analyzeCodeWithAI
  };

  return (
    <RoomContext.Provider value={value}>{children}</RoomContext.Provider>
  );
};

/**
 * Custom hook to use room context
 */
export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};

export default RoomContext;
