// src/components/pages/dashboard/header/IssueNotificationDropdown.tsx

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/redux/store";
import { resetUnreadIssues, markNotificationAsRead } from "@/redux/features/issues/issueSlice";
import { useEffect, useRef } from "react";

interface IssueNotificationDropdownProps {
  onClose: () => void;
}

const IssueNotificationDropdown = ({ onClose }: IssueNotificationDropdownProps) => {
  const { notifications, unreadCount } = useSelector((state: RootState) => state.issue);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleViewAll = () => {
    dispatch(resetUnreadIssues());
    navigate("/dashboard/notifications");
    onClose();
  };

  const handleNotificationClick = (notificationId: string, issueId: string) => {
    dispatch(markNotificationAsRead(notificationId));
    navigate(`/dashboard/issues/${issueId}`);
    onClose();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "status_change":
        return "🔄";
      case "comment":
        return "💬";
      case "approval":
        return "✅";
      case "rejection":
        return "❌";
      default:
        return "🔔";
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
        {unreadCount > 0 && (
          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
            {unreadCount} new
          </span>
        )}
      </div>

      {/* Notification List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.slice(0, 5).map((notification) => (
            <div
              key={notification._id}
              onClick={() => handleNotificationClick(notification._id, notification.issueId)}
              className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 transition ${
                !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 dark:text-white truncate">
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      notification.status === "resolved"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : notification.status === "rejected"
                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}>
                      {notification.status}
                    </span>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1"></div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
            No notifications yet
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleViewAll}
            className="w-full text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition"
          >
            View All Notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default IssueNotificationDropdown;