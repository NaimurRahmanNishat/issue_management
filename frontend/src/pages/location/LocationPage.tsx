// src/pages/location/LocationPage.tsx

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Loading from "@/components/shared/Loading";
import IssueCard from "@/components/shared/IssueCard";
import { AuroraText } from "@/components/ui/aurora-text";
import { Button } from "@/components/ui/button";
import { useGetAllIssuesQuery } from "@/redux/features/issues/issueApi";
import type { Issue } from "@/types/issueType";
import { ArrowLeft } from "lucide-react";
import type { Division } from "@/types/authType";

const LocationPage = () => {
  const { division } = useParams<{ division: Division }>();
  const navigate = useNavigate();
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [allIssues, setAllIssues] = useState<Issue[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  
  const limit = 10;
  const sortOrder = "desc";
  
  // infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);

  // detect division changes without effect
  const divisionKey = useMemo(() => division, [division]);
  
  // Reset state when division changes (using key in useMemo)
  useEffect(() => {
    setCursor(undefined);
    setAllIssues([]);
    setHasMoreData(true);
  }, [divisionKey]);

  const { data, isLoading, isFetching, isError, error } = useGetAllIssuesQuery({
    division: division || undefined,
      cursor,
      limit,
      sortOrder,
    },
  { skip: !division });

  // Use ref to track if this is initial load or append
  const isInitialLoad = useRef(true);

  // Data handling - properly structured to avoid cascading
  useEffect(() => {
    if (!data?.data) return;

    // Use functional update to avoid dependency on cursor
    setAllIssues((prevIssues) => {
      // If no cursor, it's a fresh load
      if (cursor === undefined) {
        isInitialLoad.current = false;
        return data.data;
      }
      // Append new data
      const newIssues = data.data.filter(
        (newIssue) => !prevIssues.some((existingIssue) => existingIssue._id === newIssue._id)
      );
      return [...prevIssues, ...newIssues];
    });
    setHasMoreData(data.meta.hasMore);
  }, [data]); 

  // Infinite scroll observer
  const lastIssueCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetching) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMoreData && data?.meta?.nextCursor) {
            console.log("Loading more issues...");
            setCursor(data.meta.nextCursor);
          }
        },
        { threshold: 0.5 }
      );
      if (node) observerRef.current.observe(node);
    },
    [isFetching, hasMoreData, data]
  );

  // Cleanup observer
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

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

  if (!division) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">
          <p>Please select a division to view issues.</p>
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
      <div className="flex items-center justify-between mb-8">
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

      <AuroraText className="text-3xl font-bold text-center mb-8">
        Issues in {division}
      </AuroraText>

      {allIssues.length > 0 ? (
        <>
          {/* Issue list with infinite scroll */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {allIssues.map((issue, index) => {
              if (allIssues.length === index + 1) {
                return (
                  <div key={issue._id} ref={lastIssueCallback}>
                    <IssueCard issue={issue} />
                  </div>
                );
              } else {
                return (
                  <div key={issue._id}>
                    <IssueCard issue={issue} />
                  </div>
                );
              }
            })}
          </div>

          {/* Loading indicator */}
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
              No issues found in {division}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPage;