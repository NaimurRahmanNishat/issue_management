// src/redux/api/baseApi.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { logout, setAccessToken } from "../features/auth/authSlice";
import type { RootState } from "../store";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { getCsrfToken } from "@/utils/getCsrfToken";


// Step 1: Base Query Configuration
const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/v1`,
  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    // Access token (your custom header)
    if (state.auth?.accessToken) {
      headers.set("token", state.auth.accessToken);
    }

    // CSRF TOKEN HEADER (MANDATORY)
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers.set("x-csrf-token", csrfToken);
    }
    return headers;
  },
});

// Step 2: Auto Refresh Logic with Proper Error Handling
export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs,unknown,FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      { url: '/auth/refresh-token', method: 'POST' },
      api,
      extraOptions
    );
    if (refreshResult.data) {
      const newAccessToken = (refreshResult.data as any).data.accessToken;
      api.dispatch(setAccessToken(newAccessToken));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};


// Step 3: Create RTK Query API
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "User", "Comments", "Review", "Issue", "Stats", "Message"],
  endpoints: () => ({}),
});
