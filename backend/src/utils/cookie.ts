// src/utils/cookie.ts
import { Response, CookieOptions } from "express";
import config from "../config";
import { generateCsrfToken } from "./csrf";

const isProduction = config.nodeEnv === "production";

const sameSiteOption: CookieOptions["sameSite"] = isProduction ? "none" : "strict";

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: sameSiteOption,
  path: "/",
};

const setCookie = (
  res: Response,
  name: string,
  token: string,
  maxAge: number,
  httpOnly = true
) => {
  const options: CookieOptions = {
    ...baseCookieOptions,
    httpOnly,
    maxAge,
  };
  res.cookie(name, token, options);
};
  
export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  setCookie(res, "accessToken", accessToken, 10 * 60 * 1000); // 10m
  setCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000);

  const csrfToken = generateCsrfToken();
  setCookie(res, "csrfToken", csrfToken, 24 * 60 * 60 * 1000, false);

  return csrfToken;
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken", baseCookieOptions);
  res.clearCookie("refreshToken", baseCookieOptions);
  res.clearCookie("csrfToken", { ...baseCookieOptions, httpOnly: false });
};




































// // src/utils/cookie.ts

// import { Response } from "express";
// import config from "../config";

// const isProduction = config.nodeEnv === "production";

// const setCookie = ( res: Response, name: string, token: string, maxAge: number ) => {
//   const cookieOptions: any = {
//     httpOnly: true,
//     secure: isProduction,
//     sameSite: isProduction ? "none" : "strict",
//     maxAge,
//     path: "/",
//   };
//   res.cookie(name, token, cookieOptions);
// };

// export const setAuthCookies = ( res: Response, accessToken: string, refreshToken: string ) => {
//   setCookie(res, "accessToken", accessToken, 10 * 60 * 1000); // 10 minutes
//   setCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000); // 7 days

// };


// // Clear cookies
// export const clearAuthCookies = (res: Response) => {
//   res.clearCookie("accessToken", {
//     httpOnly: true,
//     secure: isProduction,
//     sameSite: isProduction ? "none" : "strict",
//     path: "/",
//   });

//   res.clearCookie("refreshToken", {
//     httpOnly: true,
//     secure: isProduction,
//     sameSite: isProduction ? "none" : "strict",
//     path: "/",
//   });
// };











