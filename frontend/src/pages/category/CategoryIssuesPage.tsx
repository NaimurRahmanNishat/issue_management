// src/pages/category/CategoryIssuesPage.tsx

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/shared/Loading";
import IssueCard from "@/components/shared/IssueCard";
import { AuroraText } from "@/components/ui/aurora-text";
import { Button } from "@/components/ui/button";
import { useGetAllIssuesQuery } from "@/redux/features/issues/issueApi";
import type { Issue } from "@/types/issueType";
import { ArrowLeft } from "lucide-react";

interface CategoryIssuesPageProps {
  category: string;
  title: string;
  description?: string;
}

const CategoryIssuesPage = ({ category, title, description }: CategoryIssuesPageProps) => {
  const navigate = useNavigate();
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [allIssues, setAllIssues] = useState<Issue[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  
  const limit = 10;
  const sortOrder = "desc";
  
  // Use useMemo for stable category reference
  const categoryKey = useMemo(() => category, [category]);
  
  // Reset state when category changes
  useEffect(() => {
    setCursor(undefined);
    setAllIssues([]);
    setHasMoreData(true);
  }, [categoryKey]);

  // API call with cursor pagination
  const { data, isLoading, isFetching, isError, error } = useGetAllIssuesQuery({
    category,
    cursor,
    limit,
    sortOrder,
  });

  // Data handling
  useEffect(() => {
    if (!data?.data) return;

    setAllIssues((prevIssues) => {
      if (cursor === undefined) {
        return data.data;
      }

      const newIssues = data.data.filter(
        (newIssue) => !prevIssues.some((existingIssue) => existingIssue._id === newIssue._id)
      );
      return [...prevIssues, ...newIssues];
    });
    
    setHasMoreData(data.meta.hasMore);
  }, [data]);

  // Infinite scroll - load more when user scrolls to bottom
  useEffect(() => {
    if (isFetching || !hasMoreData) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      // When user scrolls to 80% of the page
      if (scrollTop + clientHeight >= scrollHeight * 0.8 && data?.meta?.nextCursor) {
        console.log("Loading more issues...");
        setCursor(data.meta.nextCursor);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, hasMoreData, data]);

  // Reset handler
  const handleReset = useCallback(() => {
    setCursor(undefined);
    setAllIssues([]);
    setHasMoreData(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Back to home handler
  const handleBackToHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  // First load
  if (isLoading && allIssues.length === 0) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p className="text-xl font-semibold">Failed to load issues.</p>
          <p className="mt-2">{String((error as any)?.data?.message || "Something went wrong")}</p>
          <Button onClick={handleBackToHome} className="mt-4">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={handleBackToHome}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
        
        {allIssues.length > 0 && (
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <AuroraText className="text-3xl font-bold mb-2">
          {title}
        </AuroraText>
        {description && (
          <p className="text-gray-600 text-sm">{description}</p>
        )}
      </div>

      {allIssues.length > 0 ? (
        <>
          {/* Issue list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {allIssues.map((issue) => (
              <div key={issue._id}>
                <IssueCard issue={issue} />
              </div>
            ))}
          </div>

          {/* Loading indicator for infinite scroll */}
          {isFetching && (
            <div className="flex justify-center items-center py-8">
              <div className="flex flex-col items-center gap-3">
                <Loading />
                <p className="text-sm text-gray-500">Loading more issues...</p>
              </div>
            </div>
          )}

          {/* No more data indicator */}
          {!hasMoreData && !isFetching && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                🎉 You've reached the end! No more issues to load.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <svg
              className="w-24 h-24 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500 text-lg">
              No {title.toLowerCase()} found
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryIssuesPage;