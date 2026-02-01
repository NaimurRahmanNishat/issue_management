// src/components/pages/dashboard/header/MessageDropdown.tsx

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/redux/store";
import { resetUnreadMessages } from "@/redux/features/message/messageSlice";
import { useEffect, useRef } from "react";

interface MessageDropdownProps {
  onClose: () => void;
}

const MessageDropdown = ({ onClose }: MessageDropdownProps) => {
  const { messages, unreadCount } = useSelector((state: RootState) => state.message);
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
    dispatch(resetUnreadMessages());
    navigate("/dashboard/messages");
    onClose();
  };

  const handleMessageClick = (messageId: string) => {
    dispatch(resetUnreadMessages());
    navigate(`/dashboard/messages/${messageId}`);
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-800 dark:text-white">Messages</h3>
        {unreadCount > 0 && (
          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
            {unreadCount} new
          </span>
        )}
      </div>

      {/* Message List */}
      <div className="max-h-96 overflow-y-auto">
        {messages.length > 0 ? (
          messages.slice(0, 5).map((message) => (
            <div
              key={message._id}
              onClick={() => handleMessageClick(message._id)}
              className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 transition"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-blue-600 dark:text-blue-300 font-semibold">
                    {message.senderName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 dark:text-white truncate">
                    {message.senderName}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {message.message}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
            No messages yet
          </div>
        )}
      </div>

      {/* Footer */}
      {messages.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleViewAll}
            className="w-full text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition"
          >
            View All Messages
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageDropdown;
