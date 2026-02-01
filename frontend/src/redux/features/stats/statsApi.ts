import { baseApi } from "@/redux/api/baseApi";
import type { AdminStatsResponse, CategoryAdminStatsResponse, UserStatsResponse } from "@/types/statsType";


const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get user stats 
    getUserStats: builder.query<UserStatsResponse, void>({
      query: () => ({
        url: "/stats/user-stats",
        method: "GET",
      }),
      providesTags: ["Stats"],
    }),

    // 2. Get admin stats (no args)
    getAdminStats: builder.query<AdminStatsResponse, void>({
      query: () => ({
        url: "/stats/admin-stats",
        method: "GET",
      }),
      providesTags: ["Stats"],
    }),

    // 3. Get category admin stats (no args)
    getCategoryAdminStats: builder.query<CategoryAdminStatsResponse, void>({
      query: () => ({
        url: "/stats/category-admin-stats",
        method: "GET",
      }),
      providesTags: ["Stats"],
    }),
  }),
});

export const { useGetAdminStatsQuery, useGetUserStatsQuery, useGetCategoryAdminStatsQuery } = statsApi;
export default statsApi;
