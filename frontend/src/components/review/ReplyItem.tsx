// // src/components/review/ReplyItem.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import type { IReply } from "@/types/commentType";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "@/utils/dateFormatter";
import { useDeleteCommentMutation, useEditCommentMutation, useReplyToCommentMutation } from "@/redux/features/comments/commentApi";
import userIcon from "../../assets/user.png";

interface ReplyItemProps {
  reply: IReply;
  reviewId: string;
  parentReplyId?: string;
}

const ReplyItem = ({ reply, reviewId }: ReplyItemProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.comment);

  const [replyToComment, { isLoading: isReplying }] = useReplyToCommentMutation();
  const [editComment, { isLoading: isUpdating }] = useEditCommentMutation();
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

  const isAuthor = user?._id && reply.author?._id 
    ? user._id === reply.author._id 
    : false;

  if (!reply.author) {
    return (
      <div className="bg-gray-100 rounded-lg p-3 text-center">
        <p className="text-gray-500 text-xs">
          ⚠️ Reply author information is missing
        </p>
      </div>
    );
  }

  // Handle Nested Reply
  const handleNestedReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyText.trim() || replyText.trim().length < 3) {
      toast.warning("Reply must be at least 3 characters long!");
      return;
    }

    try {
      await replyToComment({
        reviewId: reviewId,
        data: {
          comment: replyText.trim(),
          parentReplyId: reply._id.toString(),
        },
      }).unwrap();

      toast.success("Reply added successfully!");
      setReplyText("");
      setShowReplyForm(false);
    } catch (error: any) {
      console.error("Error replying:", error);
      toast.error(error?.data?.message || "Failed to add reply");
    }
  };

  // Handle Edit Reply
  const handleEdit = async () => {
    if (!editText.trim() || editText.trim().length < 3) {
      toast.warning("Reply must be at least 3 characters long!");
      return;
    }

    try {
      await editComment({
        reviewId: reviewId,
        data: {
          comment: editText.trim(),
          replyId: reply._id.toString(),
        },
      }).unwrap();

      toast.success("Reply updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error editing:", error);
      toast.error(error?.data?.message || "Failed to update reply");
    }
  };

  // Handle Delete Reply
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this reply?")) {
      return;
    }

    try {
      await deleteComment({
        reviewId: reviewId,
        data: { replyId: reply._id.toString() },
      }).unwrap();

      toast.success("Reply deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting:", error);
      toast.error(error?.data?.message || "Failed to delete reply");
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex items-start gap-3">
        <img
          src={reply.author.avatar?.url || userIcon}
          alt={reply.author.name || "User"}
          className="w-8 h-8 rounded-full object-cover"
        />

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h5 className="font-semibold text-gray-800 text-sm">
                {reply.author.name || "Unknown User"}
              </h5>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(reply.createdAt!), {
                  addSuffix: true,
                })}
                {reply.createdAt !== reply.updatedAt && " (edited)"}
              </p>
            </div>

            {/* Actions */}
            {isAuthor && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-500 hover:text-red-700 text-xs font-medium"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>

          {/* Reply Body */}
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleEdit}
                  disabled={isUpdating}
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(reply.comment);
                  }}
                  className="px-3 py-1 bg-gray-300 text-xs rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-gray-700 text-sm whitespace-pre-wrap">
              {reply.comment}
            </p>
          )}

          {/* Reply Button */}
          {user && !isEditing && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="mt-2 text-blue-500 hover:text-blue-700 text-xs font-medium"
            >
              💬 Reply
            </button>
          )}

          {/* Nested Reply Form */}
          {showReplyForm && (
            <form onSubmit={handleNestedReply} className="mt-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  disabled={isReplying}
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                >
                  {isReplying ? "Posting..." : "Post Reply"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyText("");
                  }}
                  className="px-3 py-1 bg-gray-300 text-xs rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Recursive Nested Replies */}
          {reply.replies && reply.replies.length > 0 && (
            <div className="mt-3 space-y-2 pl-3 border-l-2 border-gray-300">
              {reply.replies.map((nestedReply) => (
                <ReplyItem
                  key={nestedReply._id}
                  reply={nestedReply}
                  reviewId={reviewId}
                  parentReplyId={reply._id.toString()}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReplyItem;