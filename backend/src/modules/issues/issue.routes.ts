// src/modules/issues/issue.routes.ts
import { Router } from "express";
import { upload } from "../../middleware/multer";
import { createIssue, deleteIssueById, getAllIssues, getIssueById, getIssueByUser, getUnreadIssuesCount, markAllIssuesAsRead, markIssueAsRead, updateIssueById } from "./issue.controller";
import { authorizeRole, isAuthenticated, optionalAuth } from "../../middleware/auth.middleware";


const router = Router();

/* ====================== CREATE ISSUE ====================== */
router.post( "/create-issue", isAuthenticated, upload.fields([{ name: "images", maxCount: 3 }]), createIssue );

/* ====================== GET ALL ISSUES ====================== */
router.get("/", optionalAuth,  getAllIssues);

/* ====================== GET SINGLE ISSUE ====================== */
router.get("/:issueId",  getIssueById);

/* ====================== UPDATE STATUS ====================== */
router.put("/update-status/:issueId", isAuthenticated, authorizeRole("category-admin", "super-admin"), updateIssueById);

/* ====================== DELETE ISSUE ====================== */
router.delete("/:id", isAuthenticated, authorizeRole("category-admin", "super-admin"), deleteIssueById);

/* ====================== GET ISSUES BY USER ====================== */
router.get("/user-issues/:userId", isAuthenticated, getIssueByUser);

/* ====================== GET UNREAD ISSUES COUNT ====================== */
router.get("/admin/unread-count", isAuthenticated, authorizeRole("category-admin", "super-admin"), getUnreadIssuesCount);

/* ====================== MARK ISSUE AS READ ====================== */
router.patch("/admin/mark-read/:issueId", isAuthenticated, authorizeRole("category-admin", "super-admin"), markIssueAsRead);

/* ====================== MARK ALL ISSUES AS READ ====================== */
router.patch("/admin/mark-all-read", isAuthenticated, authorizeRole("category-admin", "super-admin"), markAllIssuesAsRead);


export const issueRoutes = router;