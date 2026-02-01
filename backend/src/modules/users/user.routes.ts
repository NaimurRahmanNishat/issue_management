// src/modules/users/user.routes.ts
import { Router } from "express";
import { deleteCategoryAdminRole, editProfileById, getAllCategoryAdmins, getAllUsers, getProfileById, updateCategoryAdminRole } from "./user.controller";
import { authorizeRole, isAuthenticated } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/multer";


const router = Router();

/* ====================== EDIT PROFILE ====================== */
router.put( "/edit-profile", isAuthenticated, upload.fields([{ name: "avatar", maxCount: 1 },{ name: "nidPic", maxCount: 2 }]), editProfileById);

/* ====================== GET PROFILE ====================== */
router.get("/me", isAuthenticated, getProfileById);

/* ====================== GET ALL USERS ====================== */
router.get("/all-users", isAuthenticated, authorizeRole("super-admin", "category-admin"), getAllUsers);

/* ====================== GET ALL CATEGORY ADMINS ====================== */
router.get("/all-category-admins", isAuthenticated, authorizeRole("super-admin"), getAllCategoryAdmins);

/* ====================== UPDATE CATEGORY ADMIN ====================== */
router.put("/update-category-admin/:id", isAuthenticated, authorizeRole("super-admin"), updateCategoryAdminRole);

/* ====================== DELETE CATEGORY ADMIN ====================== */
router.delete("/delete-category-admin/:id", isAuthenticated, authorizeRole("super-admin"), deleteCategoryAdminRole);

export const userRoutes = router;