// src/redux/features/comments/commentApi.ts

import { baseApi } from "@/redux/api/baseApi";
import type {
  ICreateCommentRequest,
  ICreateCommentResponse,
  IReplyToCommentRequest,
  IReplyToCommentResponse,
  IEditCommentRequest,
  IEditCommentResponse,
  IDeleteCommentRequest,
  IDeleteCommentResponse,
  IGetAllCommentsForAdminRequest,
  IGetAllCommentsForAdminResponse,
  IGetCommentsByIssueRequest,
  IGetCommentsByIssueResponse,
  IGetReviewByIdRequest,
  IGetReviewByIdResponse,
  IGetReviewsByUserRequest,
  IGetReviewsByUserResponse,
} from "@/types/commentType";

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // 1. Create Comment
    createComment: builder.mutation<ICreateCommentResponse, ICreateCommentRequest>({
      query: ({ issueId, data }) => ({
        url: `/reviews/${issueId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Comments", id: arg.issueId },
        { type: "Comments", id: "LIST" },
      ],
    }),

    // 2. Reply to Comment
    replyToComment: builder.mutation<IReplyToCommentResponse, IReplyToCommentRequest>({
      query: ({ reviewId, data }) => ({
        url: `/reviews/reply/${reviewId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Comments", id: arg.reviewId },
        { type: "Comments", id: "LIST" },
      ],
    }),

    // 3. Edit Comment
    editComment: builder.mutation<IEditCommentResponse, IEditCommentRequest>({
      query: ({ reviewId, data }) => ({
        url: `/reviews/${reviewId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Comments", id: arg.reviewId },
        { type: "Comments", id: "LIST" },
      ],
    }),

    // 4. Delete Comment
    deleteComment: builder.mutation<IDeleteCommentResponse, IDeleteCommentRequest>({
      query: ({ reviewId, data }) => ({
        url: `/reviews/${reviewId}`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: [
        { type: "Comments", id: "LIST" },
      ],
    }), 

    // 5. Get All Comments for Admin (Cursor Pagination)
    getAllCommentsForAdmin: builder.query<IGetAllCommentsForAdminResponse, IGetAllCommentsForAdminRequest>({
      query: ({ cursor, limit = 10, sortOrder = "desc" }) => {
        const params = new URLSearchParams();
        if (cursor) params.append("cursor", cursor);
        params.append("limit", limit.toString());
        params.append("sortOrder", sortOrder);

        return {
          url: `/reviews/admin/all?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "Comments", id: "ADMIN_LIST" }],
    }),

    // 6. Get Comments by Issue ID (Cursor Pagination)
    getCommentsByIssue: builder.query<IGetCommentsByIssueResponse, IGetCommentsByIssueRequest>({
      query: ({ issueId, cursor, limit = 10, sortOrder = "desc" }) => {
        const params = new URLSearchParams();
        if (cursor) params.append("cursor", cursor);
        params.append("limit", limit.toString());
        params.append("sortOrder", sortOrder);

        return {
          url: `/reviews/issue/${issueId}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, arg) => [
        { type: "Comments", id: arg.issueId },
      ],
    }),

    // 7. Get Single Review by ID
    getReviewById: builder.query<IGetReviewByIdResponse, IGetReviewByIdRequest>({
      query: ({ reviewId }) => ({
        url: `/reviews/single/${reviewId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, arg) => [
        { type: "Comments", id: arg.reviewId },
      ],
    }),

    // 8. Get Reviews by User ID (Cursor Pagination)
    getReviewsByUser: builder.query<IGetReviewsByUserResponse, IGetReviewsByUserRequest>({
      query: ({ userId, cursor, limit = 10, sortOrder = "desc" }) => {
        const params = new URLSearchParams();
        if (cursor) params.append("cursor", cursor);
        params.append("limit", limit.toString());
        params.append("sortOrder", sortOrder);

        return {
          url: `/reviews/user/${userId}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, arg) => [
        { type: "Comments", id: `USER_${arg.userId}` },
      ],
    }),

  }),
});

export const {
  useCreateCommentMutation,
  useReplyToCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
  useGetAllCommentsForAdminQuery,
  useGetCommentsByIssueQuery,
  useGetReviewByIdQuery,
  useGetReviewsByUserQuery,
} = commentApi;
