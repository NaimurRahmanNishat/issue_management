// src/types/authType.ts

// ==================== Common Types ====================
export type Role = "user" | "category-admin" | "super-admin";
export type CategoryType = "broken_road" | "water" | "gas" | "electricity" | "other";
export type Division = "Dhaka" | "Chattogram" | "Rajshahi" | "Khulna" | "Barishal" | "Sylhet" | "Rangpur" | "Mymensingh";
export type ImageType = { public_id: string; url: string };

// ==================== Main User Interface ====================
export interface TAuthUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  nid?: string;
  isVerified: boolean;
  role: Role;
  category?: CategoryType;
  division?: Division;
  avatar?: ImageType;
  nidPic?: ImageType[];
  refreshToken?: string | null;
  refreshTokenExpiry?: Date | null;
  activationCode?: string | null;
  activationCodeExpiry?: Date | null;
  lastActivationCodeSentAt?: Date | null;
  resetPasswordOtp?: string | null;
  resetPasswordOtpExpiry?: Date | null;
  profession?: string;
  zipCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Pagination ====================
export interface PaginationParams {
  cursor?: string;    
  limit?: number;
  sortOrder?: "asc" | "desc";
}

export interface PaginationMeta {
  nextCursor: string | null;
  hasNextPage: boolean;
  total: number;
}

// ==================== 1. Register API ====================
export interface UserRegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  nid: string;
  role?: "user" | "category-admin"; 
  category?: CategoryType; 
  division?: Division; 
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id?: string; 
    email: string;
    name?: string; 
    role?: string; 
    category?: CategoryType; 
    expiresIn?: string; 
  };
}

// ==================== 2. Activate User API ====================
export interface ActivateUserPayload {
  email: string;
  activationCode: string;
}

export interface ActivateUserResponse {
  success: boolean;
  message: string;
  data: TAuthUser; 
}

// ==================== 3. Login API ====================
export interface UserLoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: TAuthUser;
    accessToken: string;
  };
}

// ==================== 4. Refresh Token API ====================
export interface RefreshTokenResponse {
  success: boolean;
  message: string;
}

// ==================== 5. Logout API ====================
export interface LogoutResponse {
  success: boolean;
  message: string;
}

// ==================== 6. Forgot Password API ====================
export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
    expiresIn: string;
  };
}

// ==================== 7. Reset Password API ====================
export interface ResetPasswordPayload {
  otp: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// ==================== 8. Edit Profile API ====================
export interface EditProfileByIdPayload {
  id: string;
  formData: FormData; 
}

export interface EditProfileByIdResponse {
  success: boolean;
  message: string;
  data: TAuthUser;
}

// ==================== 9. Get Profile API ====================
export interface GetProfileByIdResponse {
  success: boolean;
  message: string;
  data: TAuthUser;
}

// ==================== 10. Get All Users API ====================
export interface GetAllUsersResponse {
  success: boolean;
  message: string;
  data: TAuthUser[];
  meta: PaginationMeta;
}

// ==================== 11. Get All Category Admins API ====================
export interface GetAllCategoryAdminsResponse {
  success: boolean;
  message: string;
  data: TAuthUser[];
  meta: PaginationMeta; // ✅ Backend returns pagination meta
}

// ==================== 12. Update Category Admin API ====================
export interface UpdateCategoryAdminRolePayload {
  id: string;
  category?: CategoryType; // ✅ Optional
  division?: Division; // ✅ Optional
}

export interface UpdateCategoryAdminRoleResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    category?: CategoryType;
    division?: Division;
  };
}

// ==================== 13. Delete Category Admin API ====================
export interface DeleteCategoryAdminRoleResponse {
  success: boolean;
  message: string;
}