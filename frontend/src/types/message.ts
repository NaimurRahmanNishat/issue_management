// src/types/message.ts

import type { CategoryType } from "./authType";

// ==================== Main Message Interface ====================
export interface IMessage {
  _id: string;
  sender: string;
  senderName?: string;
  senderEmail?: string;
  category: CategoryType;
  message: string;
  isRead?: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt?: string;
}

// ==================== Pagination Meta ====================
export interface MessageMeta {
  limit: number;
  hasMore: boolean;
  nextCursor: string | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
  unreadCount?: number;
}

// ==================== API Response Types ====================

// ==================== 1. Single Message Response (for send, update) ====================
export interface SingleMessageResponse {
  success: boolean;
  message: string;
  data: IMessage;
}

// ==================== 2. Get Messages Response (with pagination) ====================
export interface MessageResponse {
  success: boolean;
  message: string;
  data: IMessage[];
  meta: MessageMeta;
}

// ==================== 3. Update Message Response ====================
export interface UpdateMessageResponse {
  success: boolean;
  message: string;
  data: IMessage;
}

// ==================== 4. Delete Message Response ====================
export interface DeleteMessageResponse {
  success: boolean;
  message: string;
}

// ==================== // 5. Unread Count Response ====================
export interface UnreadCountResponse {
  success: boolean;
  message: string;
  count: number;
}

// ==================== 6. Mark as Read Response ====================
export interface MarkAsReadResponse {
  success: boolean;
  message: string;
  data: IMessage;
}

// ==================== 7. Mark All as Read Response ====================
export interface MarkAllAsReadResponse {
  success: boolean;
  message: string;
  modifiedCount: number;
}

// API Request Types

// 1. Send Message Request
export interface SendMessageRequest {
  message: string;
  category: CategoryType;
}

// 2. Get Messages Params
export interface GetMessagesParams {
  cursor?: string;
  limit?: number;
  sortOrder?: "asc" | "desc";
  unread?: boolean;
}

// 3. Update Message Request
export interface UpdateMessageRequest {
  messageId: string;
  message: string;
}

// Socket Event Types

// New Emergency Event
export interface SocketNewEmergency {
  _id: string;
  sender: string;
  senderName?: string;
  senderEmail?: string;
  message: string;
  category: CategoryType;
  createdAt: string;
}

// Message Updated Event
export interface SocketMessageUpdated {
  _id: string;
  message: string;
  category: CategoryType;
  updatedAt: string;
}

// Unread Count Update Event
export interface SocketUnreadCountUpdate {
  category: CategoryType;
  type: 'message';
  count: number;
}

// Form Types for Components

// Send Message Form
export interface SendMessageFormData {
  message: string;
  category: CategoryType;
}

// Update Message Form
export interface UpdateMessageFormData {
  message: string;
}

// Filter Options
export interface MessageFilterOptions {
  category?: CategoryType;
  isRead?: boolean;
  sortOrder?: "asc" | "desc";
}

// Utility Types

// Message with optional fields
export type PartialMessage = Partial<IMessage> & Pick<IMessage, '_id' | 'message' | 'category'>;

// Message for display
export interface MessageDisplay extends IMessage {
  formattedDate?: string;
  timeAgo?: string;
}