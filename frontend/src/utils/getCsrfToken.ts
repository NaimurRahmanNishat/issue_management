// src/utils/getCsrfToken.ts

export const getCsrfToken = (): string | null => {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find(row => row.startsWith("csrfToken="));

  return match ? decodeURIComponent(match.split("=")[1]) : null;
};