import { useState, useEffect, useCallback } from 'react';
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// Single socket instance created outside React
let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      autoConnect: false,
    });

    socket.on("connect", () => {
      console.log("Socket Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket Disconnected");
    });
  }
  return socket;
};

export const useSocket = () => {
  const currentSocket = getSocket();
  const [isConnected, setIsConnected] = useState(currentSocket.connected);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    currentSocket.on("connect", onConnect);
    currentSocket.on("disconnect", onDisconnect);

    return () => {
      currentSocket.off("connect", onConnect);
      currentSocket.off("disconnect", onDisconnect);
    };
  }, [currentSocket]);

  const connectSocket = useCallback(() => {
    if (!currentSocket.connected) {
      currentSocket.connect();
    }
  }, [currentSocket]);

  const disconnectSocket = useCallback(() => {
    // Keeping the function but we will avoid calling it in component cleanups
    if (currentSocket.connected) {
      currentSocket.disconnect();
    }
  }, [currentSocket]);

  return {
    socket: currentSocket,
    isConnected,
    connectSocket,
    disconnectSocket
  };
};
