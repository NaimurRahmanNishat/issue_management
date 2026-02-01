// src/hooks/useSocket.ts 

import { useEffect, useState, useMemo, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { getBaseUrl } from '@/utils/getBaseUrl';
import type { SocketNewEmergency } from '@/types/message';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
}

export const useSocket = (): UseSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);

  // Create socket instance using useMemo (only once)
  const socket = useMemo(() => {
    return io(getBaseUrl(), {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });
  }, []);

  // Setup socket listeners
  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [socket]);

  const joinRoom = useCallback((room: string) => {
    if (socket) {
      socket.emit('join', room);
      console.log(`👥 Joined room: ${room}`);
    }
  }, [socket]);

  const leaveRoom = useCallback((room: string) => {
    if (socket) {
      socket.emit('leave', room);
      console.log(`👋 Left room: ${room}`);
    }
  }, [socket]);

  return { socket, isConnected, joinRoom, leaveRoom };
};

// Hook for listening to new emergency messages
export const useEmergencyListener = (category: string | undefined,onNewEmergency: (data: SocketNewEmergency) => void) => {
  const { socket, isConnected, joinRoom, leaveRoom } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected || !category) return;
    const room = `category-admin:${category}`;
    joinRoom(room);
    // Listen for new emergency events
    const handleNewEmergency = (data: SocketNewEmergency) => {
      console.log('🚨 New emergency received:', data);
      onNewEmergency(data);
    };
    socket.on('newEmergency', handleNewEmergency);
    return () => {
      socket.off('newEmergency', handleNewEmergency);
      leaveRoom(room);
    };
  }, [socket, isConnected, category, onNewEmergency, joinRoom, leaveRoom]);
  return { socket, isConnected };
};