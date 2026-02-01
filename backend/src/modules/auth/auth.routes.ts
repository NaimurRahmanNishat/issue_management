import { Router } from "express";
import { activateUser, forgetPassword, login, logout, refreshToken, register, resetPassword } from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";
import { activateUserSchema, loginUserSchema, registerUserSchema } from "./auth.validation";
import { isAuthenticated, optionalAuth } from "../../middleware/auth.middleware";
import { authLimiter } from "../../middleware/rateLimiter";
import { csrfProtection } from "../../middleware/csrf.middleware";


const router = Router();

// ==================== Public Routes ====================

// 1. Register (public for regular users, authenticated for category-admin creation)
router.post("/register", optionalAuth,  validate(registerUserSchema), register);

// 2. Activate user account
router.post("/activate", validate(activateUserSchema), activateUser);

// 3. Login
router.post("/login", authLimiter, validate(loginUserSchema), login);

// 4. Refresh access token
router.post("/refresh-token", csrfProtection, refreshToken);

// 5. Logout (requires authentication)
router.post("/logout", isAuthenticated, logout);

// 5. Forgot password (send OTP)
router.post("/forgot-password", forgetPassword);

// 5. Reset password (verify OTP and set new password)
router.post("/reset-password", resetPassword);

export const authRoutes = router; 