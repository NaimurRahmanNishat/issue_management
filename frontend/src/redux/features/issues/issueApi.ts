// src/redux/features/issues/issueApi.ts

import { baseApi } from "@/redux/api/baseApi";
import type { CreateIssuePayload, CreateIssueResponse, DeleteIssueResponse, GetIssuesParams, GetSingleIssueResponse, GetUserIssuesParams, IssuesResponse, MarkAllIssuesAsReadResponse, MarkIssueAsReadResponse, UnreadIssuesCountResponse, UpdateIssueStatusPayload, UpdateIssueStatusResponse, UserIssuesResponse } from "@/types/issueType";

export const issueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Create Issue (with file upload support)
    createIssue: builder.mutation<CreateIssueResponse, FormData | CreateIssuePayload>({
      query: (body) => ({
        url: "/issues/create-issue",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Issue", id: "LIST" },{ type: "Stats", id: "USER" }],
    }),

    // 2. Get All Issues (with filters & cursor pagination)
    getAllIssues: builder.query<IssuesResponse, GetIssuesParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params?.cursor) queryParams.append("cursor", params.cursor);
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);
        if (params?.status) queryParams.append("status", params.status);
        if (params?.division) queryParams.append("division", params.division);
        if (params?.category) queryParams.append("category", params.category);
        if (params?.search) queryParams.append("search", params.search);

        const queryString = queryParams.toString();
        return {
          url: `/issues${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data ? [
            ...result.data.map(({ _id }) => ({
              type: "Issue" as const,
              id: _id,
            })),
            { type: "Issue", id: "LIST" },
          ]
        : [{ type: "Issue", id: "LIST" }],
    }),

    // 3. Get Issue by ID (with full details)
    getIssueById: builder.query<GetSingleIssueResponse, string>({
      query: (issueId) => ({
        url: `/issues/${issueId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, issueId) => [{ type: "Issue", id: issueId }],
    }),

    // 4. Update Issue Status (Admin only)
    updateIssueStatus: builder.mutation<UpdateIssueStatusResponse, UpdateIssueStatusPayload>({
      query: ({ issueId, status }) => ({
        url: `/issues/update-status/${issueId}`,
        method: "PUT",
        body: { status }, 
      }),
      invalidatesTags: (_result, _error, { issueId }) => [
        { type: "Issue", id: issueId },
        { type: "Issue", id: "LIST" },
        { type: "Stats", id: "USER" },
        { type: "Stats", id: "CATEGORY" },
      ],
    }), 

    // 5. Delete Issue (Admin only)
    deleteIssue: builder.mutation<DeleteIssueResponse, string>({
      query: (id) => ({
        url: `/issues/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Issue", id },
        { type: "Issue", id: "LIST" },
        { type: "Stats", id: "USER" },
        { type: "Stats", id: "CATEGORY" },
      ],
    }),

    // 6. Get User Issues (user's own issues)
    getUserIssues: builder.query<UserIssuesResponse, GetUserIssuesParams>({
      query: ({ userId, cursor, limit = 10, sortOrder = "desc", status }) => {
        // Skip if userId is empty
        if (!userId) {
          throw new Error("User ID is required");
        }

        const queryParams = new URLSearchParams();
        
        if (cursor) queryParams.append("cursor", cursor);
        queryParams.append("limit", limit.toString());
        queryParams.append("sortOrder", sortOrder);
        if (status) queryParams.append("status", status);

        const queryString = queryParams.toString();
        return {
          url: `/issues/user-issues/${userId}${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Issue" as const,
                id: _id,
              })),
              { type: "Issue", id: "USER_LIST" },
            ]
          : [{ type: "Issue", id: "USER_LIST" }],
    }),

    // 7. Get Unread Issues Count (Admin only)
    getUnreadIssuesCount: builder.query<UnreadIssuesCountResponse, void>({
      query: () => ({
        url: "/issues/admin/unread-count",
        method: "GET",
      }),
      providesTags: [{ type: "Issue", id: "UNREAD_COUNT" }],
    }),

    // 8. Mark Single Issue as Read (Admin only)
    markIssueAsRead: builder.mutation<MarkIssueAsReadResponse, string>({
      query: (issueId) => ({
        url: `/issues/admin/mark-read/${issueId}`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, issueId) => [
        { type: "Issue", id: issueId },
        { type: "Issue", id: "LIST" },
        { type: "Issue", id: "UNREAD_COUNT" },
      ],
    }),

    // 9. Mark All Issues as Read (Admin only)
    markAllIssuesAsRead: builder.mutation<MarkAllIssuesAsReadResponse, void>({
      query: () => ({
        url: "/issues/admin/mark-all-read",
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "Issue", id: "LIST" },
        { type: "Issue", id: "UNREAD_COUNT" },
      ],
    }),

  }),
});

export const { 
  useCreateIssueMutation,
  useGetAllIssuesQuery,
  useLazyGetAllIssuesQuery,
  useGetIssueByIdQuery,
  useLazyGetIssueByIdQuery,
  useUpdateIssueStatusMutation,
  useDeleteIssueMutation,
  useGetUserIssuesQuery,
  useLazyGetUserIssuesQuery,
  useGetUnreadIssuesCountQuery,
  useLazyGetUnreadIssuesCountQuery,
  useMarkIssueAsReadMutation,
  useMarkAllIssuesAsReadMutation,
 } = issueApi;
