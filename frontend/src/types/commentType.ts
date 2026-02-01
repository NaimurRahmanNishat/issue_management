// src/types/commentType.ts

export interface IAuthor {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    url: string;
    public_id: string;
  };
}

export interface IReply {
  _id: string;
  author: IAuthor;
  comment: string;
  replies?: IReply[];
  createdAt: string;
  updatedAt: string;
}

export interface IIssueBasic {
  _id: string;
  title: string;
  category: string;
  status: string;
}

export interface IComment {
  _id: string;
  issue: string | IIssueBasic;
  author: IAuthor;
  comment: string;
  commentType: string;
  replies: IReply[];
  createdAt: string;
  updatedAt: string;
}

// Cursor Pagination Meta
export interface ICursorPaginationMeta {
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
  total?: number;
  hasNextPage?: boolean;
}


// ============================================ 1. Create Comment ============================================
export interface ICreateCommentRequest {
  issueId: string;
  data: {
    comment: string;
  };
}

export interface ICreateCommentResponse {
  success: boolean;
  message: string;
  data: IComment;
}


// ============================================ 2. Reply to Comment ============================================
export interface IReplyToCommentRequest {
  reviewId: string;
  data: {
    comment: string;
    parentReplyId?: string;
  };
}

export interface IReplyToCommentResponse {
  success: boolean;
  message: string;
  data: IComment;
}


// ============================================ 3. Edit Comment ============================================
export interface IEditCommentRequest {
  reviewId: string;
  data: {
    comment: string;
    replyId?: string;
  };
}

export interface IEditCommentResponse {
  success: boolean;
  message: string;
  data: IComment;
}


// ============================================ 4. Delete Comment ============================================
export interface IDeleteCommentRequest {
  reviewId: string;
  data?: {
    replyId?: string;
  };
}

export interface IDeleteCommentResponse {
  success: boolean;
  message: string;
}


// ============================================ 5. Get All Comments for Admin (Cursor Pagination) ============================================
export interface IGetAllCommentsForAdminRequest {
  cursor?: string;
  limit?: number;
  sortOrder?: "asc" | "desc";
}

export interface IGetAllCommentsForAdminResponse {
  success: boolean;
  message: string;
  data: IComment[];
  meta: ICursorPaginationMeta;
}

// ============================================ 6. Get Comments by Issue ID (Cursor Pagination) ============================================
export interface IGetCommentsByIssueRequest {
  issueId: string;
  cursor?: string;
  limit?: number;
  sortOrder?: "asc" | "desc";
}

export interface IGetCommentsByIssueResponse {
  success: boolean;
  message: string;
  data: IComment[];
  meta: ICursorPaginationMeta;
}


// ============================================ 7. Get Single Review by ID ============================================
export interface IGetReviewByIdRequest {
  reviewId: string;
}

export interface IGetReviewByIdResponse {
  success: boolean;
  message: string;
  data: IComment;
}

// ============================================ 8. Get Reviews by User ID (Cursor Pagination) ============================================
export interface IGetReviewsByUserRequest {
  userId: string;
  cursor?: string;
  limit?: number;
  sortOrder?: "asc" | "desc";
}

export interface IGetReviewsByUserResponse {
  success: boolean;
  message: string;
  data: IComment[];
  meta: ICursorPaginationMeta;
}

