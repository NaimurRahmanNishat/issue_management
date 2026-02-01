// src/modules/users/user.routes.ts

import { Router } from "express";
import { deleteCategoryAdminRole, editProfileById, getAllCategoryAdmins, getAllUsers, getProfileById, updateCategoryAdminRole } from "./user.controller";
import { validate } from "../../middleware/validate.middleware";
import { authorizeRole, isAuthenticated, optionalAuth } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/multer";
import { authLimiter } from "../../middleware/rateLimiter";


const router = Router();

// // ==================== Public Routes ====================




// // ==================== Protected Routes ====================




// 8. Edit profile 
router.put( "/edit-profile", isAuthenticated, upload.fields([{ name: "avatar", maxCount: 1 },{ name: "nidPic", maxCount: 2 }]), editProfileById);

// 9. Get own profile 
router.get("/me", isAuthenticated, getProfileById);

// ==================== Admin Routes ====================

// 10. Get all normal users (category-admin & super-admin only)
router.get("/all-users", isAuthenticated, authorizeRole("super-admin", "category-admin"), getAllUsers);

// 11. Get all category admins (super-admin only)
router.get("/all-category-admins", isAuthenticated, authorizeRole("super-admin"), getAllCategoryAdmins);

// 12. Update category admin role (super-admin only)
router.put("/update-category-admin/:id", isAuthenticated, authorizeRole("super-admin"), updateCategoryAdminRole);

// 13. Delete category admin (super-admin only)
router.delete("/delete-category-admin/:id", isAuthenticated, authorizeRole("super-admin"), deleteCategoryAdminRole);

export const userRoutes = router;