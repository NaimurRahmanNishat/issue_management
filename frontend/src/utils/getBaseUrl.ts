// src/utils/getBaseUrl.ts
export const getBaseUrl = () => {
    return import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
}


// // src/utils/getBaseUrl.ts

// export const getBaseUrl = (): string => {
//   // Production URL
//   if (import.meta.env.PROD) {
//     return import.meta.env.VITE_API_URL || 'https://your-production-api.com';
//   }
  
//   // Development URL
//   return import.meta.env.VITE_API_URL || 'http://localhost:8000';
// };