// src/routes/router.tsx

import App from "@/App";
import ErrorPage from "@/components/shared/ErrorPage";
import DetailsPage from "@/pages/[id]/DetailsPage";
import ElectricityPage from "@/pages/electricity/ElectricityPage";
import ForgotPassword from "@/pages/forgot-password/ForgotPassword";
import ResetPassword from "@/pages/forgot-password/ResetPassword";
import Gas from "@/pages/gas/Gas";
import Home from "@/pages/home/Home";
import LocationPage from "@/pages/location/LocationPage";
import Login from "@/pages/login/Login";
import Others from "@/pages/others/Others";
import ActivateUser from "@/pages/register/ActivateUser";
import Register from "@/pages/register/Register";
import Road from "@/pages/road/Road";
import Water from "@/pages/water/Water";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import UserDashboardMain from "@/pages/dashboard/user/dashboard/UserDashboardMain";
import CreateIssue from "@/pages/dashboard/user/create-issue/CreateIssue";
import MyIssues from "@/pages/dashboard/user/my-issues/MyIssues";
import ProfileSettings from "@/pages/dashboard/user/profile-settings/Profile";
import EmergencyMessage from "@/pages/dashboard/user/sendMessage/SendMessage";
import CategoryAdminDashboardMain from "@/pages/dashboard/categoryadmin/dashboard/CategoryAdminDashboardMain";
import CategoryAdminProfile from "@/pages/dashboard/categoryadmin/profile/CategoryAdminProfile";
import ReceiveMessage from "@/pages/dashboard/categoryadmin/receive-message/ReceiveMessage";
import AdminDashboardMain from "@/pages/dashboard/admin/dashboard/AdminDashboardMain";
import VendorManagement from "@/pages/dashboard/admin/vendor-management/VendorManagement";
import Settings from "@/pages/dashboard/admin/settings/Settings";
import UserUpdateProfile from "@/pages/dashboard/user/update-profile/UserUpdateProfile";
import StatusManagementCommon from "@/components/pages/dashboard/shared/StatusManagementCommon";
import UserManagementCommon from "@/components/pages/dashboard/shared/UserManagementCommon";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/electricity",
        element: <ElectricityPage />,
      },
      {
        path: "/gas",
        element: <Gas />,
      },
      {
        path: "/road",
        element: <Road />,
      },
      {
        path: "/water",
        element: <Water />,
      },
      {
        path: "/others",
        element: <Others />,
      },
      {
        path: "/:issueId",
        element: <DetailsPage />,
      },
      {
        path: "/divisions/:division",
        element: <LocationPage />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/register-otp",
    element: <ActivateUser />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // user routes
      {
        path: "user", // children relative path
        element: <UserDashboardMain />,
      },
      {
        path: "create-issue", // children relative path
        element: <CreateIssue />,
      },
      {
        path: "my-issues", // children relative path
        element: <MyIssues />,
      },
      {
        path: "update-profile", // children relative path
        element: <UserUpdateProfile />,
      },
      {
        path: "emergency", // children relative path
        element: <EmergencyMessage />,
      },
      {
        path: "profile-settings", // children relative path
        element: <ProfileSettings />,
      },

      // category admin routes
      {
        path: "category-admin", // children relative path
        element: (
          <ProtectedRoute role="category-admin">
            <CategoryAdminDashboardMain />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile-settings", // children relative path
        element: (
          <ProtectedRoute role="category-admin">
            <CategoryAdminProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "receive-message", // children relative path
        element: (
          <ProtectedRoute role={["category-admin", "super-admin"]}>
            <ReceiveMessage />
          </ProtectedRoute>
        ),
      },
      {
        path: "user-management", // children relative path
        element: (
          <ProtectedRoute role={["category-admin", "super-admin"]}>
            <UserManagementCommon />
          </ProtectedRoute>
        ),
      },
      {
        path: "status-management", // children relative path
        element: (
          <ProtectedRoute role={["category-admin", "super-admin"]}>
            <StatusManagementCommon />
          </ProtectedRoute>
        ),
      },

      // admin routes
      {
        path: "super-admin", // children relative path
        element: (
          <ProtectedRoute role="super-admin">
            <AdminDashboardMain />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-management", // children relative path
        element: (
          <ProtectedRoute role="super-admin">
            <VendorManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile-settings", // children relative path
        element: (
          <ProtectedRoute role="super-admin">
            <Settings />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
