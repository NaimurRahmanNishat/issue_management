// src/components/review/CommentSection.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Loading from "../shared/Loading";
import userIcon from "../../assets/user.png";
import CommentItem from "./CommentItem";
import { useCreateCommentMutation, useGetCommentsByIssueQuery } from "@/redux/features/comments/commentApi";

interface CommentSectionProps {
  issueId: string;
}

const CommentSection = ({ issueId }: CommentSectionProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [newComment, setNewComment] = useState("");
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [loadedPages, setLoadedPages] = useState<Map<string, any[]>>(new Map());
  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch comments with cursor pagination
  const { data, isLoading, isFetching, isError, refetch } = useGetCommentsByIssueQuery(
    {
      issueId,
      cursor,
      limit: 10,
      sortOrder: "desc",
    }
  );

  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();

  // Flatten all comment pages - derived state
  const allComments = useMemo(() => {
    const pages = Array.from(loadedPages.values());
    return pages.flat();
  }, [loadedPages]);

  // Compute pagination state from data
  const hasMore = data?.meta?.hasNextPage ?? true;
  const nextCursor = data?.meta?.nextCursor;
  const totalComments = data?.meta?.total ?? allComments.length;

  // Update loaded pages when new data arrives
  const pageKey = cursor || "initial";
  const currentPageData = data?.data;
  const isNewPage = currentPageData && !loadedPages.has(pageKey);

  if (isNewPage) {
    const newPages = new Map(loadedPages);
    newPages.set(pageKey, currentPageData);
    if (loadedPages !== newPages) {
      setLoadedPages(newPages);
    }
  }

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || isFetching || !nextCursor) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCursor(nextCursor);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isFetching, nextCursor]);

  // Handle submit new comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to comment!");
      return;
    }

    if (!newComment.trim() || newComment.trim().length < 3) {
      toast.warning("Comment must be at least 3 characters long!");
      return;
    }

    if (newComment.trim().length > 500) {
      toast.warning("Comment cannot exceed 500 characters!");
      return;
    }

    try {
      const result = await createComment({
        issueId,
        data: { comment: newComment.trim() },
      }).unwrap();

      toast.success("Comment added successfully!");
      setNewComment("");

      // Optimistically add new comment to the top
      if (result.data) {
        setLoadedPages((prev) => {
          const newPages = new Map(prev);
          const firstPageKey = "initial";
          const firstPage = newPages.get(firstPageKey) || [];
          newPages.set(firstPageKey, [result.data, ...firstPage]);
          return newPages;
        });
      }
    } catch (error: any) {
      console.error("Error creating comment:", error);
      toast.error(error?.data?.message || "Failed to add comment");
    }
  };

  // Handle retry on error
  const handleRetry = useCallback(() => {
    setLoadedPages(new Map());
    setCursor(undefined);
    refetch();
  }, [refetch]);

  // Initial loading state
  if (isLoading && allComments.length === 0) {
    return <Loading />;
  }

  // Error state
  if (isError && allComments.length === 0) {
    return (
      <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600 font-semibold mb-2">Failed to load comments</p>
        <p className="text-sm text-gray-600 mb-4">
          Please check if the backend server is running
        </p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">
          💬 Comments ({totalComments})
        </h3>
      </div>

      {/* Add Comment Form */}
      {user ? (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
        >
          <div className="flex gap-3">
            <img
              src={user.avatar?.url || userIcon}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                maxLength={500}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  {newComment.length}/500 characters
                </p>
                <button
                  type="submit"
                  disabled={
                    isCreating ||
                    !newComment.trim() ||
                    newComment.trim().length < 3
                  }
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    isCreating ||
                    !newComment.trim() ||
                    newComment.trim().length < 3
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {isCreating ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </motion.form>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-gray-700">
            Please <span className="font-semibold text-blue-600">login</span> to add a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {allComments.length === 0 && !isLoading ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">
              💬 No comments yet. Be the first to comment!
            </p>
          </div>
        ) : (
          <>
            {allComments.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index < 10 ? index * 0.05 : 0 }}
              >
                <CommentItem review={review} issueId={issueId} />
              </motion.div>
            ))}

            {/* Infinite Scroll Trigger */}
            {hasMore && (
              <div ref={observerTarget} className="flex justify-center py-4">
                {isFetching && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading more comments...</span>
                  </div>
                )}
              </div>
            )}

            {/* End of comments message */}
            {!hasMore && allComments.length > 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">
                  🎉 You've reached the end of comments
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentSection;

