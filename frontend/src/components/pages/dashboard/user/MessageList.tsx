// frontend/src/components/messages/MessageList.tsx

import { useRef, useEffect, useState } from "react";
import { Loader2, ChevronDown, Edit2, Trash2, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { IMessage } from "@/types/message";
import type { CategoryType } from "@/types/authType";
import { IssueCategory } from "@/constants/divisions";

interface MessageListProps {
  messages: IMessage[];
  isLoading: boolean;
  isFetching: boolean;
  hasMore: boolean;
  nextCursor: string | null;
  onLoadMore: () => void;
  onDelete: (messageId: string) => void;
  onUpdate: (messageId: string, message: string) => void;
  isUpdating?: boolean;
}

const MessageList = ({
  messages,
  isLoading,
  isFetching,
  hasMore,
  nextCursor,
  onLoadMore,
  onDelete,
  onUpdate,
  isUpdating = false,
}: MessageListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const observerRef = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching && nextCursor) {
          onLoadMore();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, isFetching, nextCursor, onLoadMore]);

  const handleEdit = (messageId: string, currentMessage: string) => {
    setEditingId(messageId);
    setEditMessage(currentMessage);
  };

  const handleUpdate = async (messageId: string) => {
    if (!editMessage.trim() || editMessage.trim().length < 2) return;

    await onUpdate(messageId, editMessage.trim());
    setEditingId(null);
    setEditMessage("");
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    await onDelete(messageId);
  };

  const categoryLabels: Record<CategoryType, string> = {
    [IssueCategory.WATER]: "💧 Water",
    [IssueCategory.BROKEN_ROAD]: "🛣️ Broken Road",
    [IssueCategory.GAS]: "🔥 Gas",
    [IssueCategory.ELECTRICITY]: "⚡ Electricity",
    [IssueCategory.OTHER]: "📌 Others",
  };

  const getCategoryColor = (cat: CategoryType) => {
    const colors = {
      [IssueCategory.WATER]: "bg-blue-100 text-blue-800 border-blue-200",
      [IssueCategory.BROKEN_ROAD]:
        "bg-orange-100 text-orange-800 border-orange-200",
      [IssueCategory.GAS]: "bg-red-100 text-red-800 border-red-200",
      [IssueCategory.ELECTRICITY]:
        "bg-yellow-100 text-yellow-800 border-yellow-200",
      [IssueCategory.OTHER]: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[cat] || colors[IssueCategory.OTHER];
  };

  if (isLoading && !messages.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <Send className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-lg font-medium">No messages yet</p>
        <p className="text-sm">Send your first emergency message below</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Load More Indicator (at top) */}
      {hasMore && (
        <div ref={observerRef} className="flex justify-center py-2">
          {isFetching ? (
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          ) : (
            <button
              onClick={onLoadMore}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
            >
              <ChevronDown className="w-4 h-4" />
              Load older messages
            </button>
          )}
        </div>
      )}

      {/* Messages */}
      {messages.map((msg) => (
        <div
          key={msg._id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                {msg.senderName?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {msg.senderName || "Unknown User"}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(msg.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full border ${getCategoryColor(
                  msg.category
                )}`}
              >
                {categoryLabels[msg.category]}
              </span>
            </div>
          </div>

          {/* Message Content */}
          {editingId === msg._id ? (
            <div className="space-y-2">
              <textarea
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(msg._id)}
                  disabled={isUpdating || editMessage.trim().length < 2}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isUpdating ? "Updating..." : "Update"}
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditMessage("");
                  }}
                  className="px-3 py-1.5 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-800 text-sm leading-relaxed mb-3">
                {msg.message}
              </p>

              {/* Updated At */}
              {msg.updatedAt && msg.updatedAt !== msg.createdAt && (
                <p className="text-xs text-gray-400 italic mb-2">
                  Edited{" "}
                  {formatDistanceToNow(new Date(msg.updatedAt), {
                    addSuffix: true,
                  })}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(msg._id, msg.message)}
                  className="flex items-center gap-1 px-3 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="flex items-center gap-1 px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </>
          )}

          {/* Read Status */}
          {msg.isRead && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="font-semibold">✓✓</span>
                Read{" "}
                {msg.readAt &&
                  `• ${formatDistanceToNow(new Date(msg.readAt), {
                    addSuffix: true,
                  })}`}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
