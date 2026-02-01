// frontend/src/pages/dashboard/categoryadmin/receive-message/ReceiveMessage.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useCallback } from 'react';
import { useEmergencyListener } from '@/hooks/useSocket';
import { Loader2, AlertCircle, Clock, User, Mail, MessageSquare } from 'lucide-react';
import { useGetAllMessagesQuery } from '@/redux/features/message/messageApi';
import type { SocketNewEmergency } from '@/types/message';
import { IssueCategory } from "@/constants/divisions";
import type { CategoryType } from '@/types/authType';

interface MessageListProps {
  userRole?: 'user' | 'category-admin' | 'super-admin';
  userCategory?: CategoryType;
}

const ReceiveMessage = ({ userRole, userCategory }: MessageListProps) => {
  const [cursor, setCursor] = React.useState<string | undefined>(undefined);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetAllMessagesQuery({
    cursor,
    limit: 10,
    sortOrder: 'desc',
  });

  // Socket listener for real-time updates (for category-admin)
  useEmergencyListener(
    userRole === 'category-admin' ? userCategory : undefined,
    useCallback((newEmergency: SocketNewEmergency) => {
      console.log('🚨 New emergency message:', newEmergency);
      refetch();
    }, [refetch])
  );

  // Infinite scroll observer
  useEffect(() => {
    if (isLoading || isFetching || !data?.meta.hasMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && data?.meta.nextCursor) {
          setCursor(data.meta.nextCursor);
        }
      },
      { threshold: 1.0 }
    );
    
    if (lastMessageRef.current) {
      observerRef.current.observe(lastMessageRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [data, isLoading, isFetching]);

  const categoryLabels: Record<CategoryType, string> = {
    [IssueCategory.BROKEN_ROAD]: '🛣️ Broken-Road',
    [IssueCategory.WATER]: '💧 Water',
    [IssueCategory.GAS]: '🔥 Gas',
    [IssueCategory.ELECTRICITY]: '⚡ Electricity',
    [IssueCategory.OTHER]: '📌 Others',
  };

  const getCategoryColor = (category: CategoryType): string => {
    const colors: Record<CategoryType, string> = {
      [IssueCategory.BROKEN_ROAD]: 'bg-orange-100 text-orange-800 border-orange-200',
      [IssueCategory.WATER]: 'bg-blue-100 text-blue-800 border-blue-200',
      [IssueCategory.GAS]: 'bg-red-100 text-red-800 border-red-200',
      [IssueCategory.ELECTRICITY]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [IssueCategory.OTHER]: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[category];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <div>
            <p className="font-medium">Something went wrong!</p>
            <p className="text-sm mt-1">
              {(error as any)?.data?.message || 'Failed to fetch messages.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const messages = data?.data || [];

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              {userRole === 'category-admin' ? 'Emergency Messages' : 'All Messages'}
            </h2>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 border border-amber-300 rounded-full">
            <span className="text-sm font-medium text-amber-800">
              Total: {messages.length}
            </span>
          </div>
        </div>

        {/* Messages List */}
        <div className="divide-y divide-gray-200">
          {messages.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No messages found!</p>
              <p className="text-sm mt-2">Messages will appear here when they are sent.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={msg._id}
                ref={index === messages.length - 1 ? lastMessageRef : null}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex gap-4">
                  {/* User Avatar */}
                  <div className="shrink-0">
                    <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {msg.senderName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 space-y-3">
                    {/* Sender Info - Always show */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        {/* Sender Name */}
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-gray-900">
                            {msg.senderName || 'Unknown User'}
                          </span>
                        </div>
                        
                        {/* Sender Email */}
                        {msg.senderEmail && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {msg.senderEmail}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {formatDate(msg.createdAt)}
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(msg.category)}`}
                      >
                        {categoryLabels[msg.category]}
                      </span>
                    </div>

                    {/* Message Text */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Loading More */}
          {isFetching && (
            <div className="p-6 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading more...</span>
            </div>
          )}

          {/* End of Messages */}
          {!data?.meta.hasMore && messages.length > 0 && (
            <div className="p-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                <AlertCircle className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">You have seen all messages</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiveMessage;