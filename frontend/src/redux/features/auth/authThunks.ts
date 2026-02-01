// // src/redux/features/auth/authThunks.ts
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { setUser, logout, setLoading } from "./authSlice";
// import { getBaseUrl } from "@/utils/getBaseUrl";

// export const silentRefresh = createAsyncThunk(
//   "auth/silentRefresh",
//   async (_, { dispatch }) => {
//     try {
//       dispatch(setLoading(true));
//       const response = await fetch(`${getBaseUrl()}/api/v1/auth/refresh-token`, {
//         method: "POST",
//         credentials: "include", // secure httpOnly cookie
//       });

//       if (!response.ok) throw new Error("Refresh failed");

//       const data = await response.json();

//       // Only store safe user info in Redux
//       if (data?.user) {
//         dispatch(setUser(data.user));
//       } else {
//         dispatch(logout());
//       }
//     } catch {
//       dispatch(logout());
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }
// );
