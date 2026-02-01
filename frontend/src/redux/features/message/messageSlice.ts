// src/redux/features/message/messageSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  _id: string;
  sender: string;
  senderName: string;
  category: string;
  message: string;
  createdAt: string;
}

interface MessageState {
  messages: Message[];
  unreadCount: number;
  lastChecked: string | null;
}

const initialState: MessageState = {
  messages: [],
  unreadCount: 0,
  lastChecked: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    // Set unread message count
    setUnreadMessageCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },

    // Increment unread count (when new message arrives)
    incrementUnreadMessages: (state) => {
      state.unreadCount += 1;
    },

    // Reset unread count (when user views messages)
    resetUnreadMessages: (state) => {
      state.unreadCount = 0;
      state.lastChecked = new Date().toISOString();
    },

    // Set messages list
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },

    // Add new message to list
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.unshift(action.payload);
      state.unreadCount += 1;
    },

    // Clear all messages
    clearMessages: (state) => {
      state.messages = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  setUnreadMessageCount,
  incrementUnreadMessages,
  resetUnreadMessages,
  setMessages,
  addMessage,
  clearMessages,
} = messageSlice.actions;

export default messageSlice.reducer;