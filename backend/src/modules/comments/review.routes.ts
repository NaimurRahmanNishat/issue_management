// src/modules/comments/review.routes.ts
import { Router } from "express";
import { createComment, deleteComment, editComment, getAllCommentsForAdmin, getCommentsByIssue, getReviewById, getReviewsByUser, replyToComment } from "./review.controller";
import { authorizeRole, isAuthenticated } from "../../middleware/auth.middleware";


const router = Router();

/* ====================== GET ALL COMMENTS ====================== */
router.get("/issue/:issueId", getCommentsByIssue);

/* ====================== GET SINGLE REVIEW ====================== */
router.get("/single/:reviewId", getReviewById);

/* ====================== CREATE COMMENT ====================== */
router.post("/:issueId", isAuthenticated, createComment);

/* ====================== REPLY TO COMMENT ====================== */
router.post("/reply/:reviewId", isAuthenticated, replyToComment);

/* ====================== EDIT COMMENT ====================== */
router.put("/:reviewId", isAuthenticated, editComment);

/* ====================== DELETE COMMENT ====================== */
router.delete("/:reviewId", isAuthenticated, deleteComment);

/* ====================== GET USER'S OWN REVIEWS ====================== */
router.get("/user/:userId", isAuthenticated, getReviewsByUser);

/* ====================== GET ALL COMMENTS FOR ADMIN (DASHBOARD) ====================== */
router.get( "/admin/all", isAuthenticated, authorizeRole("category-admin", "super-admin"), getAllCommentsForAdmin );

export const reviewRoutes = router; 