/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/src/pages/dashboard/user/sendMessage/SendMessage.tsx

import { useState, useEffect, useRef } from "react";
import { AlertCircle, Send, Loader2, Trash2, Edit2, ChevronDown } from "lucide-react";
import type { CategoryType } from "@/types/authType";
import { 
  useSendMessageMutation, 
  useGetAllMessagesQuery,
  useDeleteMessageMutation,
  useUpdateMessageMutation
} from "@/redux/features/message/messageApi";
import { IssueCategory } from "@/constants/divisions";
import { formatDistanceToNow } from "date-fns";

const SendMessage = () => {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<CategoryType>(IssueCategory.WATER);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  // API Hooks
  const [sendMessage, { isLoading: isSending, isSuccess, isError, error }] =
    useSendMessageMutation();
  
  const { data: messagesData, isLoading: isLoadingMessages, isFetching } = 
    useGetAllMessagesQuery({
      cursor,
      limit: 10,
      sortOrder: "desc",
    });

  const [deleteMessage] = useDeleteMessageMutation();
  const [updateMessage, { isLoading: isUpdating }] = useUpdateMessageMutation();

  // Auto scroll to bottom on new message
  useEffect(() => {
    if (isSuccess) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isSuccess]);

  // Infinite scroll observer
  useEffect(() => {
    if (!observerRef.current || !messagesData?.meta.hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching && messagesData?.meta.nextCursor) {
          setCursor(messagesData.meta.nextCursor);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [messagesData, isFetching]);

  const handleSubmit = async () => {
    if (!message.trim() || message.trim().length < 2) {
      return;
    }

    try {
      await sendMessage({ message: message.trim(), category }).unwrap();
      setMessage("");
      setCursor(undefined); // Reset pagination
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      await deleteMessage(messageId).unwrap();
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const handleEdit = (messageId: string, currentMessage: string) => {
    setEditingId(messageId);
    setEditMessage(currentMessage);
  };

  const handleUpdate = async (messageId: string) => {
    if (!editMessage.trim() || editMessage.trim().length < 2) return;

    try {
      await updateMessage({ messageId, message: editMessage.trim() }).unwrap();
      setEditingId(null);
      setEditMessage("");
    } catch (err) {
      console.error("Failed to update message:", err);
    }
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
      [IssueCategory.BROKEN_ROAD]: "bg-orange-100 text-orange-800 border-orange-200",
      [IssueCategory.GAS]: "bg-red-100 text-red-800 border-red-200",
      [IssueCategory.ELECTRICITY]: "bg-yellow-100 text-yellow-800 border-yellow-200",
      [IssueCategory.OTHER]: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[cat] || colors[IssueCategory.OTHER];
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] lg:h-[calc(100vh-150px)]">
      {/* Messages List Section */}
      <div className="flex-1 overflow-y-auto mb-4 rounded-lg p-4 space-y-3">
        {/* Loading State */}
        {isLoadingMessages && !messagesData ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : messagesData?.data && messagesData.data.length > 0 ? (
          <>
            {/* Load More Indicator (at top) */}
            {messagesData.meta.hasMore && (
              <div ref={observerRef} className="flex justify-center py-2">
                {isFetching ? (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                ) : (
                  <button
                    onClick={() => setCursor(messagesData.meta.nextCursor || undefined)}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <ChevronDown className="w-4 h-4" />
                    Load older messages
                  </button>
                )}
              </div>
            )}

            {/* Messages */}
            {messagesData.data.map((msg) => (
              <div
                key={msg._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                      {msg.senderName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {msg.senderName || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(msg._id)}
                        disabled={isUpdating || editMessage.trim().length < 2}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isUpdating ? "Updating..." : "Update"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditMessage("");
                        }}
                        className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400"
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
                    <p className="text-xs text-green-600">
                      ✓ Read {msg.readAt && `at ${new Date(msg.readAt).toLocaleString()}`}
                    </p>
                  </div>
                )}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Send className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Send your first emergency message below</p>
          </div>
        )}
      </div>

      {/* Send Message Form - Fixed at Bottom */}
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-600">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (at least 2 characters)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the emergency in detail..."
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {isError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-sm">
                {(error as any)?.data?.message || "Message sending failed!"}
              </p>
            </div>
          )}

          {isSuccess && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-sm">Message sent successfully!</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSending || message.trim().length < 2}
            className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {isSending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Message
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendMessage;