// // src/hooks/useNotifications.ts

// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setUnreadMessageCount, setMessages } from "@/redux/features/message/messageSlice";
// import { setUnreadIssueCount, setIssueNotifications } from "@/redux/features/issues/issueSlice";
// import { useGetNotificationsQuery } from "@/redux/features/notification/notificationApi";
// import { useGetAllMessagesQuery } from "@/redux/features/message/messageApi";

// export const useNotifications = () => {
//   const dispatch = useDispatch();
  
//   // Fetch messages
//   const { data: messagesData } = useGetAllMessagesQuery({ limit: 10, unread: true });
  
//   // Fetch issue notifications
//   const { data: notificationsData } = useGetNotificationsQuery({ limit: 10, unread: true });

//   useEffect(() => {
//     if (messagesData) {
//       dispatch(setMessages(messagesData.messages || []));
//       dispatch(setUnreadMessageCount(messagesData.unreadCount || 0));
//     }
//   }, [messagesData, dispatch]);

//   useEffect(() => {
//     if (notificationsData) {
//       dispatch(setIssueNotifications(notificationsData.notifications || []));
//       dispatch(setUnreadIssueCount(notificationsData.unreadCount || 0));
//     }
//   }, [notificationsData, dispatch]);
// };