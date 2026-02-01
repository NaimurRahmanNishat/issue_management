/* eslint-disable @typescript-eslint/no-unused-vars */
// src/redux/api/messageApi.ts

import { baseApi } from "@/redux/api/baseApi";
import type { 
  DeleteMessageResponse, 
  GetMessagesParams, 
  MessageResponse,
  SingleMessageResponse, 
  SendMessageRequest, 
  UpdateMessageRequest, 
  UpdateMessageResponse,
  UnreadCountResponse,
  MarkAsReadResponse,
  MarkAllAsReadResponse
} from "@/types/message";

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Send Message (User → Category Admin)
    sendMessage: builder.mutation<SingleMessageResponse, SendMessageRequest>({
      query: (formData) => ({
        url: `/messages/send`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [
        { type: 'Message', id: 'LIST' },
        { type: 'Message', id: 'UNREAD_COUNT' }
      ],
    }),

    // 2. Get All Messages (with Cursor Pagination)
    getAllMessages: builder.query<MessageResponse, GetMessagesParams>({
      query: ({ cursor, limit = 10, sortOrder = "desc", unread }) => {
        const params = new URLSearchParams();
        if (cursor) params.append("cursor", cursor);
        params.append("limit", limit.toString());
        params.append("sortOrder", sortOrder);
        if (unread !== undefined) params.append("unread", unread.toString());

        return {
          url: `/messages/receive?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((item) => ({
                type: "Message" as const,
                id: item._id,
              })),
              { type: "Message", id: "LIST" },
            ]
          : [{ type: "Message", id: "LIST" }],
      
      // Serialize query args for cursor pagination
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        // Create unique cache key excluding cursor
        const { cursor, ...rest } = queryArgs;
        return `${endpointName}(${JSON.stringify(rest)})`;
      },

      // Merge cursor pagination results
      merge: (currentCache, newItems, { arg }) => {
        if (!arg.cursor) {
          // First page, replace cache
          return newItems;
        }
        // Append new items for pagination
        return {
          ...newItems,
          data: [...currentCache.data, ...newItems.data],
        };
      },

      // Force refetch when cursor changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.cursor !== previousArg?.cursor;
      },
    }),

    // 3. Update Message by ID
    updateMessage: builder.mutation<UpdateMessageResponse, UpdateMessageRequest>({
      query: ({ messageId, message }) => ({
        url: `/messages/${messageId}`,
        method: "PATCH",
        body: { message },
      }),
      invalidatesTags: (_result, _error, { messageId }) => [
        { type: "Message", id: messageId },
        { type: "Message", id: "LIST" },
      ],
      
      // Optimistic update
      async onQueryStarted({ messageId, message }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          messageApi.util.updateQueryData(
            "getAllMessages",
            { limit: 10 },
            (draft) => {
              const messageToUpdate = draft.data.find((msg) => msg._id === messageId);
              if (messageToUpdate) {
                messageToUpdate.message = message;
                messageToUpdate.updatedAt = new Date().toISOString();
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // 4. Delete Message by ID
    deleteMessage: builder.mutation<DeleteMessageResponse, string>({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, messageId) => [
        { type: "Message", id: messageId },
        { type: "Message", id: "LIST" },
        { type: "Message", id: "UNREAD_COUNT" }
      ],
      
      // Optimistic update
      async onQueryStarted(messageId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          messageApi.util.updateQueryData(
            "getAllMessages",
            { limit: 10 },
            (draft) => {
              draft.data = draft.data.filter((msg) => msg._id !== messageId);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // 5. Get Unread Messages Count (Admin Only)
    getUnreadMessagesCount: builder.query<UnreadCountResponse, void>({
      query: () => ({
        url: `/messages/admin/unread-count`,
        method: "GET",
      }),
      providesTags: [{ type: "Message", id: "UNREAD_COUNT" }],
    }),

    // 6. Mark Single Message as Read (Admin Only)
    markMessageAsRead: builder.mutation<MarkAsReadResponse, string>({
      query: (messageId) => ({
        url: `/messages/admin/mark-read/${messageId}`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, messageId) => [
        { type: "Message", id: messageId },
        { type: "Message", id: "LIST" },
        { type: "Message", id: "UNREAD_COUNT" }
      ],
      
      // Optimistic update
      async onQueryStarted(messageId, { dispatch, queryFulfilled }) {
        // Update message list
        const patchResult = dispatch(
          messageApi.util.updateQueryData(
            "getAllMessages",
            { limit: 10 },
            (draft) => {
              const message = draft.data.find((msg) => msg._id === messageId);
              if (message) {
                message.isRead = true;
                message.readAt = new Date().toISOString();
              }
            }
          )
        );

        // Update unread count
        const countPatchResult = dispatch(
          messageApi.util.updateQueryData(
            "getUnreadMessagesCount",
            undefined,
            (draft) => {
              if (draft.count > 0) {
                draft.count -= 1;
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          countPatchResult.undo();
        }
      },
    }),

    // 7. Mark All Messages as Read (Admin Only)
    markAllMessagesAsRead: builder.mutation<MarkAllAsReadResponse, void>({
      query: () => ({
        url: `/messages/admin/mark-all-read`,
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "Message", id: "LIST" },
        { type: "Message", id: "UNREAD_COUNT" }
      ],
      
      // Optimistic update
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        // Update all messages in list
        const patchResult = dispatch(
          messageApi.util.updateQueryData(
            "getAllMessages",
            { limit: 10 },
            (draft) => {
              draft.data.forEach((message) => {
                message.isRead = true;
                message.readAt = new Date().toISOString();
              });
            }
          )
        );

        // Update unread count to 0
        const countPatchResult = dispatch(
          messageApi.util.updateQueryData(
            "getUnreadMessagesCount",
            undefined,
            (draft) => {
              draft.count = 0;
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          countPatchResult.undo();
        }
      },
    }),
  }),
});

export const { 
  useSendMessageMutation,
  useGetAllMessagesQuery,
  useLazyGetAllMessagesQuery,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
  useGetUnreadMessagesCountQuery,
  useLazyGetUnreadMessagesCountQuery,
  useMarkMessageAsReadMutation,
  useMarkAllMessagesAsReadMutation
} = messageApi;