/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import { useLazyGetAllIssuesQuery, useUpdateIssueStatusMutation, useDeleteIssueMutation } from "@/redux/features/issues/issueApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import type { Issue, IssueStatus } from "@/types/issueType";
import type { CategoryType, Division } from "@/types/authType";
import { AuroraText } from "@/components/ui/aurora-text";

const AdminStatusManagement = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // State management
  const [issues, setIssues] = useState<Issue[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [newStatus, setNewStatus] = useState<IssueStatus>("pending");

  // Filters
  const [statusFilter, setStatusFilter] = useState<IssueStatus | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<CategoryType | undefined>(undefined);
  const [divisionFilter, setDivisionFilter] = useState<Division | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  // Refs
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastIssueRef = useRef<HTMLTableRowElement | null>(null);
  const isInitialMount = useRef(true);

  // API hooks
  const [triggerGetIssues, { isLoading, isFetching }] = useLazyGetAllIssuesQuery();
  const [updateIssueStatus, { isLoading: updating }] = useUpdateIssueStatusMutation();
  const [deleteIssue, { isLoading: deleting }] = useDeleteIssueMutation();

  // Only fetch assigned category if category-admin
  const queryCategory = user?.role === "category-admin" ? user.category : categoryFilter;

  // Create a stable filter key to detect filter changes
  const filterKey = useMemo(
    () => JSON.stringify({ statusFilter, queryCategory, divisionFilter, searchQuery }),
    [statusFilter, queryCategory, divisionFilter, searchQuery]
  );

  // Effect for initial load and filter changes
  useEffect(() => {
    let isMounted = true;

    const fetchIssues = async () => {
      if (!isMounted) return;

      try {
        const result = await triggerGetIssues({
          cursor: undefined,
          limit: 10,
          sortOrder: "desc",
          status: statusFilter,
          category: queryCategory,
          division: divisionFilter,
          search: searchQuery || undefined,
        }).unwrap();

        if (!isMounted) return;

        if (result.success) {
          setIssues(result.data);
          setCursor(result.meta.nextCursor || undefined);
          setHasMore(result.meta.hasNextPage);
        }
      } catch (error: any) {
        if (!isMounted) return;
        console.error("Failed to fetch issues:", error);
        toast.error("Failed to load issues");
      }
    };

    // Skip on initial mount if needed
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
    fetchIssues();
    return () => {
      isMounted = false;
    };
  }, [filterKey, triggerGetIssues]); 

  // Effect for infinite scroll
  useEffect(() => {
    if (isLoading || isFetching || !hasMore || !cursor) {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      return;
    }

    const loadMore = async () => {
      try {
        const result = await triggerGetIssues({
          cursor,
          limit: 10,
          sortOrder: "desc",
          status: statusFilter,
          category: queryCategory,
          division: divisionFilter,
          search: searchQuery || undefined,
        }).unwrap();

        if (result.success) {
          setIssues((prev) => [...prev, ...result.data]);
          setCursor(result.meta.nextCursor || undefined);
          setHasMore(result.meta.hasNextPage);
        }
      } catch (error: any) {
        console.error("Failed to fetch more issues:", error);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );
    observerRef.current = observer;
    if (lastIssueRef.current) {
      observer.observe(lastIssueRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [cursor, hasMore, isFetching, isLoading, statusFilter, queryCategory, divisionFilter, searchQuery, triggerGetIssues]);

  // Modal handlers
  const openModal = (issue: Issue) => {
    setSelectedIssue(issue);
    setNewStatus(issue.status);
  };

  const closeModal = () => setSelectedIssue(null);

  // Update Status
  const handleUpdateStatus = async () => {
    if (!selectedIssue) return;

    try {
      const result = await updateIssueStatus({
        issueId: selectedIssue._id,
        status: newStatus,
      }).unwrap();

      if (result.success) {
        toast.success(result.message || "Issue status updated!");
        closeModal();

        // Update local state
        setIssues((prev) =>
          prev.map((issue) =>
            issue._id === selectedIssue._id ? { ...issue, ...result.data } : issue
          )
        );
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status!");
      console.error(error);
    }
  };

  // Delete Issue
  const handleDeleteIssue = async (issueId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this issue?");
    if (!confirmDelete) return;

    try {
      const result = await deleteIssue(issueId).unwrap();

      if (result.success) {
        toast.success(result.message || "Issue deleted successfully!");
        setIssues((prev) => prev.filter((issue) => issue._id !== issueId));
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Delete failed!");
      console.error(error);
    }
  };

  // Status badge color
  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "approved":
        return "bg-blue-500";
      case "in-progress":
        return "bg-purple-500";
      case "resolved":
        return "bg-green-600";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="p-6"
    >
      <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white text-center">
        <AuroraText>Issue Status Management</AuroraText>
      </h1>

      {/* ===== FILTERS ===== */}
      <div className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              value={statusFilter || ""}
              onChange={(e) =>
                setStatusFilter((e.target.value as IssueStatus) || undefined)
              }
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Category Filter (Only for super-admin) */}
          {user?.role === "super-admin" && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                value={categoryFilter || ""}
                onChange={(e) =>
                  setCategoryFilter((e.target.value as CategoryType) || undefined)
                }
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Categories</option>
                <option value="broken_road">Broken Road</option>
                <option value="water">Water</option>
                <option value="gas">Gas</option>
                <option value="electricity">Electricity</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          {/* Division Filter */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Division
            </label>
            <select
              value={divisionFilter || ""}
              onChange={(e) =>
                setDivisionFilter((e.target.value as Division) || undefined)
              }
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Divisions</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chattogram">Chattogram</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Khulna">Khulna</option>
              <option value="Barishal">Barishal</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Rangpur">Rangpur</option>
              <option value="Mymensingh">Mymensingh</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Search
            </label>
            <input
              type="text"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Division
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {issues.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No issues found
                  </td>
                </tr>
              ) : (
                issues.map((issue, index) => (
                  <tr
                    key={issue._id}
                    ref={index === issues.length - 1 ? lastIssueRef : null}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={issue.author?.avatar?.url || "https://via.placeholder.com/40"}
                            alt={issue.author?.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {issue.author?.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {issue.author?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{issue.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {issue.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                        {issue.category.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white capitalize ${getStatusColor(
                          issue.status
                        )}`}
                      >
                        {issue.status.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {issue.division}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openModal(issue)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteIssue(issue._id)}
                          disabled={deleting}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Loading indicator */}
        {(isFetching || isLoading) && (
          <div className="py-4 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}

        {/* No more data indicator */}
        {!hasMore && issues.length > 0 && (
          <div className="py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            No more issues to load
          </div>
        )}
      </div>

      {/* ===== UPDATE STATUS MODAL ===== */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Update Status – {selectedIssue.title}
            </h2>

            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Select Status
              </label>
              <select
                className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as IssueStatus)}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {updating ? "Updating..." : "Update"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminStatusManagement;