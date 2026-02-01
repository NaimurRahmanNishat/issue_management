// src/types/statsType.ts


export interface MonthlyIssue {
  month: number;
  count: number;
}
export interface AdminStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalIssues: number;
    pendingIssues: number;
    approvedIssues: number;
    inProgressIssues: number;
    resolvedIssues: number;
    rejectedIssues: number;
    monthlyIssues: MonthlyIssue[];
  };
}

// User Stats Response
export interface UserStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalIssues: number;
    totalReviewAndComment: number;
    totalPending: number;
    totalApproved: number;
    totalInProgress: number;
    totalResolved: number;
    totalRejected: number;
    totalSolved: number; 
    monthlyIssues: MonthlyIssue[]; 
  };
}

// Category Admin Stats Response
export interface CategoryAdminStatsResponse {
  success: boolean;
  message: string;
  data: {
    category: string;
    totalIssues: number;
    pendingIssues: number;
    approvedIssues: number;
    inProgressIssues: number;
    resolvedIssues: number;
    rejectedIssues: number;
    monthlyPostIssue: MonthlyIssue[];
  };
}
