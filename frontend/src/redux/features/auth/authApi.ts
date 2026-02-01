// src/redux/features/auth/authApi.ts

import { baseApi } from "@/redux/api/baseApi";
import type { ActivateUserPayload, ActivateUserResponse, ForgotPasswordPayload, ForgotPasswordResponse, LoginResponse, LogoutResponse, RegisterResponse, ResetPasswordPayload, ResetPasswordResponse, UserLoginPayload, UserRegisterPayload } from "@/types/authType";


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Register user (Super admin creates category-admin, or regular user registration)
    register: builder.mutation<RegisterResponse, UserRegisterPayload>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),

    // 2. Activate user account
    activateUser: builder.mutation<ActivateUserResponse, ActivateUserPayload>({
      query: (data) => ({
        url: "/auth/activate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // 3. Login user
    login: builder.mutation<LoginResponse, UserLoginPayload>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    // 4. Logout user
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    // 5. forgot password (Send OTP)
    forgetPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordPayload>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // 6. reset password
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordPayload>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useRegisterMutation, useActivateUserMutation, useLoginMutation, useLogoutMutation, useForgetPasswordMutation, useResetPasswordMutation } = authApi;
