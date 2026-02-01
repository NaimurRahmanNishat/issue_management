// src/types/issueType.ts
import type { CategoryType, Division, ImageType } from "./authType";

// ==================== Enums ====================
export type IssueStatus = "pending" | "approved" | "in-progress" | "resolved" | "rejected";

// ==================== Author Types ====================
export interface IssueAuthor {
  _id: string;
  name: string;
  email: string;
  avatar?: ImageType;
}

export interface IssueApprovedBy {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: ImageType;
}

// ==================== Review Types ====================
export interface ReviewAuthor {
  _id: string;
  name: string;
  email: string;
  avatar?: ImageType;
}

export interface ReviewReply {
  _id: string;
  author: ReviewAuthor;
  content: string;
  createdAt: Date;
}

export interface IssueReview {
  _id: string;
  author: ReviewAuthor;
  content: string;
  replies?: ReviewReply[];
  createdAt: Date;
  updatedAt?: Date;
}

// ==================== Main Issue Interface ====================
export interface Issue {
  _id: string;
  title: string;
  category: CategoryType;
  description: string;
  images: ImageType[];
  location: string;
  division: Division;
  status: IssueStatus;
  author: IssueAuthor;
  reviews?: IssueReview[];
  date: Date;
  approvedBy?: IssueApprovedBy;
  approvedAt?: Date;
  isReadByAdmin?: boolean;
  readByAdminAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Pagination Meta ====================
export interface IssuePaginationMeta {
  limit?: number;
  total?: number;
  hasMore: boolean;
  hasNextPage: boolean;
  nextCursor: string | null;
}

// ==================== 1. Create Issue ====================
export interface CreateIssuePayload {
  title: string;
  category: CategoryType;
  description: string;
  location: string;
  division: Division;
  date?: Date | string;
  images?: string[]; 
}

export interface CreateIssueResponse {
  success: boolean;
  message: string;
  data: Issue;
}

// ==================== 2. Get All Issues ====================
export interface GetIssuesParams {
  cursor?: string;
  limit?: number;
  sortOrder?: "asc" | "desc";
  status?: IssueStatus;
  division?: Division;
  category?: CategoryType | string;
  search?: string;
}

export interface IssuesResponse {
  success: boolean;
  message: string;
  data: Issue[];
  meta: IssuePaginationMeta;

}

// ==================== 3. Get Single Issue ====================
export interface GetSingleIssueResponse {
  success: boolean;
  message: string;
  data: Issue;
}

// ==================== 4. Update Issue Status ====================
export interface UpdateIssueStatusPayload {
  issueId: string;
  status: IssueStatus;
}

export interface UpdateIssueStatusResponse {
  success: boolean;
  message: string;
  data: Issue;
}

// ==================== 5. Delete Issue ====================
export interface DeleteIssueResponse {
  success: boolean;
  message: string;
}

// ==================== 6. Get User Issues ====================
export interface GetUserIssuesParams {
  userId: string ;
  cursor?: string;
  limit?: number;
  sortOrder?: "asc" | "desc";
  status?: IssueStatus | string;
}

export interface UserIssuesPaginationMeta extends IssuePaginationMeta {
  status: string | null;
}

export interface UserIssuesResponse {
  success: boolean;
  message: string;
  data: Issue[];
  meta: UserIssuesPaginationMeta;
}

// ==================== 7. Get Unread Issues Count ====================
export interface UnreadIssuesCountResponse {
  success: boolean;
  message: string;
  count: number;
}

// ==================== 8. Mark Issue as Read ====================
export interface MarkIssueAsReadResponse {
  success: boolean;
  message: string;
  data: Issue;
}

// ==================== 9. Mark All Issues as Read ====================
export interface MarkAllIssuesAsReadResponse {
  success: boolean;
  message: string;
  modifiedCount: number;
}