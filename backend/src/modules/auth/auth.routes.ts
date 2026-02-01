// src/modules/auth/auth.routes.ts
import { Router } from "express";
import { activateUser, forgetPassword, login, logout, refreshToken, register, resetPassword } from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";
import { activateUserSchema, loginUserSchema, registerUserSchema } from "./auth.validation";
import { isAuthenticated, optionalAuth } from "../../middleware/auth.middleware";
import { authLimiter } from "../../middleware/rateLimiter";
import { csrfProtection } from "../../middleware/csrf.middleware";


const router = Router();

/* ====================== REGISTER USER ====================== */
router.post("/register", optionalAuth,  validate(registerUserSchema), register);

/* ====================== AUTHENTICATE USER ====================== */
router.post("/activate", validate(activateUserSchema), activateUser);

/* ====================== LOGIN USER ====================== */
router.post("/login", authLimiter, validate(loginUserSchema), login);

/* ====================== REFRESH TOKEN ====================== */
router.post("/refresh-token", csrfProtection, refreshToken);

/* ====================== LOGOUT ====================== */
router.post("/logout", isAuthenticated, logout);

/* ====================== FORGOT PASSWORD ====================== */
router.post("/forgot-password", forgetPassword);

/* ====================== RESET PASSWORD ====================== */
router.post("/reset-password", resetPassword);

export const authRoutes = router; 