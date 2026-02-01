// src/middleware/csrf.middleware.ts
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const csrfProtection = ( req: Request, res: Response, next: NextFunction ) => {
  const csrfCookie = req.cookies?.csrfToken;
  const csrfHeader = req.headers["x-csrf-token"];

  if (!csrfCookie || typeof csrfHeader !== "string") {
    return res.status(403).json({
      success: false,
      message: "CSRF token missing",
    });
  }

  // timing safe compare
  const cookieBuffer = Buffer.from(csrfCookie);
  const headerBuffer = Buffer.from(csrfHeader);

  if (
    cookieBuffer.length !== headerBuffer.length ||
    !crypto.timingSafeEqual(cookieBuffer, headerBuffer)
  ) {
    return res.status(403).json({
      success: false,
      message: "Invalid CSRF token",
    });
  }
  next();
};

