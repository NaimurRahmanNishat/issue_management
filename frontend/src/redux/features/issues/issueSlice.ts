// src/redux/features/issues/issueSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type IssueStatus =  "pending" | "approved" | "in-progress" | "resolved" | "rejected";

export interface IssueNotification {
  _id: string;
  issueId: string;
  title: string;
  status: IssueStatus;
  type: "status_change" | "comment" | "approval" | "rejection";
  message: string;
  createdAt: string;
  read: boolean;
}

interface IssueNotificationState {
  notifications: IssueNotification[];
  unreadCount: number;
  lastChecked: string | null;
}

const initialState: IssueNotificationState = {
  notifications: [],
  unreadCount: 0,
  lastChecked: null,
};

const issueSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    // Set unread notification count
    setUnreadIssueCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },

    // Increment unread count (when new notification arrives)
    incrementUnreadIssues: (state) => {
      state.unreadCount += 1;
    },

    // Reset unread count (when user views notifications)
    resetUnreadIssues: (state) => {
      state.unreadCount = 0;
      state.lastChecked = new Date().toISOString();
      // Mark all as read
      state.notifications = state.notifications.map(notif => ({
        ...notif,
        read: true
      }));
    },

    // Set notifications list
    setIssueNotifications: (state, action: PayloadAction<IssueNotification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.read).length;
    },

    // Add new notification
    addIssueNotification: (state, action: PayloadAction<IssueNotification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },

    // Mark single notification as read
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n._id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    // Clear all notifications
    clearIssueNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  setUnreadIssueCount,
  incrementUnreadIssues,
  resetUnreadIssues,
  setIssueNotifications,
  addIssueNotification,
  markNotificationAsRead,
  clearIssueNotifications,
} = issueSlice.actions;

export default issueSlice.reducer;