// src/redux/features/users/userApi.ts

import { baseApi } from "@/redux/api/baseApi";
import type { DeleteCategoryAdminRoleResponse, EditProfileByIdPayload, EditProfileByIdResponse, GetAllCategoryAdminsResponse, GetAllUsersResponse, GetProfileByIdResponse, PaginationParams, UpdateCategoryAdminRolePayload, UpdateCategoryAdminRoleResponse } from "@/types/authType";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. edit profile by id
    editProfileById: builder.mutation< EditProfileByIdResponse, EditProfileByIdPayload >({
      query: ({ formData }) => ({
        url: `/users/edit-profile`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    // 2. get profile by id
    getProfileById: builder.query<GetProfileByIdResponse, void>({
      query: () => ({
        url: `/users/me`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // 3. get all normal users
    getAllUsers: builder.query<GetAllUsersResponse, PaginationParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.cursor) queryParams.append("cursor", params.cursor);
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.sortOrder)
          queryParams.append("sortOrder", params.sortOrder);

        const queryString = queryParams.toString();
        return {
          url: `/users/all-users${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "User" as const,
                id: _id,
              })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    // 4. get all category admins
    getAllCategoryAdmins: builder.query< GetAllCategoryAdminsResponse, PaginationParams | void >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.cursor) queryParams.append("cursor", params.cursor);
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.sortOrder)
          queryParams.append("sortOrder", params.sortOrder);

        const queryString = queryParams.toString();
        return {
          url: `/users/all-category-admins${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "User" as const,
                id: _id,
              })),
              { type: "User", id: "ADMIN_LIST" },
            ]
          : [{ type: "User", id: "ADMIN_LIST" }],
    }),

    // 5. update category admin role
    updateCategoryAdminRole: builder.mutation< UpdateCategoryAdminRoleResponse, UpdateCategoryAdminRolePayload >({
      query: ({ id, ...data }) => ({
        url: `/users/update-category-admin/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "User", id: arg.id },
        { type: "User", id: "ADMIN_LIST" },
      ],
    }),

    // 6. delete category admin
    deleteCategoryAdminById: builder.mutation< DeleteCategoryAdminRoleResponse, string >({
      query: (id) => ({
        url: `/users/delete-category-admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "User", id },
        { type: "User", id: "ADMIN_LIST" },
      ],
    }),
  }),
});


export const {
  useEditProfileByIdMutation, 
  useGetProfileByIdQuery, 
  useGetAllUsersQuery, 
  useGetAllCategoryAdminsQuery, 
  useUpdateCategoryAdminRoleMutation, 
  useDeleteCategoryAdminByIdMutation 
} = userApi;