// routes/emergency.route.ts       
import { Router } from "express";
import { deleteMessage, getAllMessagesReceived, getUnreadMessagesCount, markAllMessagesAsReadByAdmin, markMessageAsReadByAdmin, snedMessage, updateMessageById } from "./message.controller";
import { isAuthenticated } from "../../middleware/auth.middleware";


const router = Router();

/* ====================== SEND MESSAGE ====================== */
router.post("/send", isAuthenticated, snedMessage);

/* ====================== GET ALL MESSAGES ====================== */
router.get("/receive", isAuthenticated, getAllMessagesReceived);

/* ====================== UPDATE STATUS ====================== */
router.patch("/:id", isAuthenticated, updateMessageById);

/* ====================== DELETE MESSAGE ====================== */
router.delete("/:id", isAuthenticated, deleteMessage);

/* ====================== GET UNREAD MESSAGES COUNT ====================== */
router.get("/admin/unread-count", getUnreadMessagesCount);

/* ====================== MARK MESSAGE AS READ ====================== */
router.patch("/admin/mark-read/:messageId", isAuthenticated, markMessageAsReadByAdmin);

/* ====================== MARK ALL MESSAGES AS READ ====================== */
router.patch("/admin/mark-all-read", isAuthenticated, markAllMessagesAsReadByAdmin);

export const messageRoutes = router;