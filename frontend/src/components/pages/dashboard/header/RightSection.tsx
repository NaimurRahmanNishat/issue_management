// src/components/pages/dashboard/header/RightSection.tsx
import { useDispatch, useSelector } from "react-redux";
import userIcon from "../../../../assets/user.png";
import type { RootState } from "@/redux/store";
import { useState } from "react";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "@/redux/features/auth/authSlice";
import ProfileCard from "./ProfileCard";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiMessengerLine } from "react-icons/ri";
import NotificationBadge from "./NotificationBadge";

const RightSection = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { unreadCount: messageCount } = useSelector((state: RootState) => state.message);
  const { unreadCount: issueCount } = useSelector((state: RootState) => state.issue);
  
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [logoutUser] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Handle Message Icon Click based on Role
  const handleMessageClick = () => {
    if (user?.role === "user") {
      navigate("/dashboard/emergency");
    } else if (user?.role === "super-admin" || user?.role === "category-admin") {
      navigate("/dashboard/receive-message");
    }
  };

  // Handle Issue/Notification Icon Click based on Role
  const handleNotificationClick = () => {
    if (user?.role === "user") {
      navigate("/dashboard/my-issues");
    } else if (user?.role === "super-admin" || user?.role === "category-admin") {
      navigate("/dashboard/status-management");
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      const res = await logoutUser().unwrap();
      if (res.success) {
        dispatch(logout());
        navigate("/", { state: { isLogout: true }, replace: true });
        toast.success(res.message || "Logged out successfully!");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-end gap-4 relative">
      {/* Message Notification */}
      <div className="relative">
        <RiMessengerLine
          onClick={handleMessageClick}
          className="w-8 h-8 cursor-pointer hover:text-blue-500 transition"
          title={user?.role === "user" ? "Send Emergency Message" : "View Received Messages"}
        />
        {messageCount > 0 && <NotificationBadge count={messageCount} />}
      </div>

      {/* Issue Notification */}
      <div className="relative">
        <IoMdNotificationsOutline
          onClick={handleNotificationClick}
          className="w-8 h-8 cursor-pointer hover:text-blue-500 transition"
          title={user?.role === "user" ? "My Issues" : "All Issues"}
        />
        {issueCount > 0 && <NotificationBadge count={issueCount} />}
      </div>

      {/* User Profile */}
      {user && (
        <div className="relative">
          <img
            src={user.avatar?.url || userIcon}
            alt="User avatar"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 rounded-full cursor-pointer border border-gray-300 dark:border-gray-600 hover:ring-2 hover:ring-blue-400 transition"
          />
          
          {/* Dropdown Menu */}
          {menuOpen && (
            <div
              onMouseLeave={() => setMenuOpen(false)}
              className="absolute right-0 mt-3 hidden md:block w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 transition-all"
            >
              <ProfileCard setMenuOpen={setMenuOpen} />
              <button
                onClick={handleLogout}
                className="w-full text-red-500 font-semibold text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RightSection;