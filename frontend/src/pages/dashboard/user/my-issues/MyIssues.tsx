// src/pages/dashboard/user/my-issues/MyIssues.tsx

import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { RootState } from "@/redux/store";
import { useGetUserIssuesQuery } from "@/redux/features/issues/issueApi";
import type { Issue } from "@/types/issueType";
import Loading from "@/components/shared/Loading";

const MyIssues = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [allIssues, setAllIssues] = useState<Issue[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [statusFilter] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const limit = 8;

  // Use getUserIssues with proper skip condition
  const { data, isLoading, error, isFetching } = useGetUserIssuesQuery(
    {
      userId: user?._id as string,
      cursor,
      limit, 
      sortOrder: "desc",
      status: statusFilter,
    },
    {
      skip: !user?._id,
    }
  );

  const observerTarget = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef<boolean>(true);

  // Load more data when new data arrives
  useEffect(() => {
    if (data?.data) {
      setAllIssues((prev) => {
        if (isFirstLoad.current) {
          isFirstLoad.current = false;
          return data.data;
        }
        // Subsequent loads - append new data
        const existingIds = new Set(prev.map((issue) => issue._id));
        const newIssues = data.data.filter((issue) => !existingIds.has(issue._id));
        return [...prev, ...newIssues];
      });
      // Update pagination state
      setHasMore(data.meta.hasNextPage);
    }
  }, [data]);

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (
        target.isIntersecting &&
        hasMore &&
        !isFetching &&
        data?.meta.nextCursor
      ) {
        setCursor(data.meta.nextCursor);
      }
    },
    [hasMore, isFetching, data]
  );

  useEffect(() => {
    const element = observerTarget.current;
    const option = { threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  if (isLoading && allIssues.length === 0) return <Loading />;
  
  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p className="text-xl font-semibold">Failed to fetch your issues</p>
        <p className="text-sm mt-2">Please try again later</p>
      </div>
    );
  }

  if (!user?._id) {
    return (
      <div className="text-center text-gray-500 mt-10">
        <p className="text-xl font-semibold">Please login to view your issues</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="md:p-10"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
            My Issues
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Track and manage all your reported issues
          </p>
        </div>
        <div className="flex items-center gap-3">
          <h3 className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm md:text-base font-medium shadow-md">
            Total: {allIssues.length}
          </h3>
        </div>
      </div>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allIssues.length === 0 && !isLoading ? (
          <div className="col-span-full text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-24 w-24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              {statusFilter
                ? `No ${statusFilter} issues found`
                : "You haven't reported any issues yet"}
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              Start by reporting an issue in your area
            </p>
            <Link
              to="/dashboard/report-issue"
              className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
            >
              Report an Issue
            </Link>
          </div>
        ) : (
          allIssues.map((issue, index) => (
            <motion.div
              key={`${issue._id}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Image */}
              <div className="w-full h-40 md:h-48 overflow-hidden relative">
                <img
                  src={issue?.images?.[0]?.url || "/placeholder.jpg"}
                  alt={issue.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {/* Status Badge */}
                <span
                  className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full shadow-md ${
                    issue.status === "pending"
                      ? "bg-yellow-500 text-white"
                      : issue.status === "approved"
                      ? "bg-green-500 text-white"
                      : issue.status === "in-progress"
                      ? "bg-blue-500 text-white"
                      : issue.status === "resolved"
                      ? "bg-teal-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {issue.status === "in-progress"
                    ? "In Progress"
                    : issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-1">
                  {issue.title}
                </h3>

                {/* Category */}
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                    issue.category === "water"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                      : issue.category === "electricity"
                      ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
                      : issue.category === "gas"
                      ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                      : issue.category === "broken_road"
                      ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                  }`}
                >
                  {issue.category === "broken_road" ? "Broken Road" : issue.category}
                </span>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                  {issue.description}
                </p>

                {/* Info */}
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <p className="flex items-center gap-1">
                    <span>📍</span>
                    <strong>Location:</strong>
                    <span className="line-clamp-1">{issue.location}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <span>🗺️</span>
                    <strong>Division:</strong>
                    <span className="capitalize">{issue.division}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <span>📅</span>
                    <strong>Date:</strong>
                    <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Loading Indicator for Infinite Scroll */}
      {isFetching && allIssues.length > 0 && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-600 dark:text-gray-400">Loading more...</p>
        </div>
      )}

      {/* Observer Target */}
      <div ref={observerTarget} className="h-10" />

      {/* End Message */}
      {!hasMore && allIssues.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            🎉 You've reached the end! No more issues to load.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default MyIssues;