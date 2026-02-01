// src/components/SearchFilter.tsx 

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGetAllIssuesQuery } from "@/redux/features/issues/issueApi";
import type { Issue } from "@/types/issueType";

const SearchFilter = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  
  // Backend returns { data: [], meta: {} } structure
  const { data, isLoading, isError, refetch } = useGetAllIssuesQuery(
    query.trim().length > 0 
      ? { search: query.trim(), limit: 20 } // limit for search results
      : { limit: 0 }, // Don't fetch if no query
    { skip: !isOpen || query.trim().length === 0 } // Only fetch when modal open AND has query
  );

  useEffect(() => {
    if (query.trim().length > 0) {
      const timeout = setTimeout(() => {
        refetch();
      }, 400); // debounce effect for 400ms
      return () => clearTimeout(timeout);
    }
  }, [query, refetch]);

  const issues = data?.data || [];

  const handleRowClick = (issueId: string) => {
    navigate(`/${issueId}`); 
    setIsOpen(false);
    setQuery(""); 
  };

  // Close modal and reset on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setQuery("");
      }
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Reset query when closing modal
  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative">
      {/* Search Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-700 cursor-pointer pt-1 hover:text-[#239c47] transition"
        aria-label="Open search"
      >
        <Search size={22} />
      </button>
      {/* Search Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background Blur */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            {/* Centered Search Box */}
            <motion.div
              className="fixed top-1/6 left-1/2 -translate-x-1/2 -translate-y-1/6 
                          w-[95%] sm:w-125 md:w-162.5 lg:w-187.5
                          bg-white rounded-2xl shadow-2xl z-50 p-6 border border-gray-200"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Search Issues
                </h2>
                <button 
                  onClick={handleClose}
                  aria-label="Close search"
                >
                  <X
                    size={22}
                    className="text-gray-600 cursor-pointer hover:text-red-500 transition"
                  />
                </button>
              </div>
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title, category, or division..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md 
                              focus:outline-none focus:ring-2 focus:ring-[#239c47]"
                  autoFocus
                />
                <Search
                  size={18}
                  className="absolute right-3 top-2.5 text-gray-500 pointer-events-none"
                />
              </div>
              {/* Results */}
              <div className="mt-5 max-h-100 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#239c47]"></div>
                    <p className="text-gray-500 text-sm ml-3">
                      Searching...
                    </p>
                  </div>
                ) : isError ? (
                  <p className="text-red-500 text-sm text-center mt-4">
                    Failed to load data. Please try again.
                  </p>
                ) : query.trim().length === 0 ? (
                  <div className="text-center py-8">
                    <Search size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">
                      Start typing to search issues...
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      Search by title, category, or division
                    </p>
                  </div>
                ) : issues.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-3">
                      Found {issues.length} result{issues.length !== 1 ? 's' : ''}
                    </p>
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b text-gray-600 bg-gray-50">
                          <th className="py-2 px-3">Title</th>
                          <th className="py-2 px-3">Category</th>
                          <th className="py-2 px-3">Division</th>
                          <th className="py-2 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {issues.map((item: Issue) => (
                          <tr
                            key={item._id}
                            className="hover:bg-gray-50 border-b transition cursor-pointer"
                            onClick={() => handleRowClick(item._id)}
                          >
                            <td className="py-3 px-3 font-medium text-gray-800">
                              {item.title}
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                                {item.category.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-gray-600">
                              {item.division}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                                item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                item.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-5xl mb-3">🔍</div>
                    <p className="text-gray-500 text-sm">
                      No results found for "{query}"
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      Try different keywords or check spelling
                    </p>
                  </div>
                )}
              </div>
              {/* Footer hint */}
              {query.trim().length > 0 && issues.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500">
                    Click on any row to view issue details
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchFilter;