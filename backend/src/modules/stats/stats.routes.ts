// src/modules/stats/stats.routes.ts
import { Router } from "express";
import { adminStats, categoryAdminStats, userStats } from "./stats.controller";
import { authorizeRole, isAuthenticated } from "../../middleware/auth.middleware";


const router = Router();

/* ====================== USER STATS ====================== */
router.get("/user-stats", isAuthenticated, userStats);

/* ====================== SUPER ADMIN STATS ====================== */
router.get("/admin-stats", isAuthenticated, authorizeRole("super-admin"), adminStats);

/* ====================== CATEGORY ADMIN STATS ====================== */
router.get("/category-admin-stats", isAuthenticated, authorizeRole("category-admin"), categoryAdminStats);

export const statsRoutes = router;