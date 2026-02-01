// src/components/pages/dashboard/shared/UserManagementCommon.tsx

import UserManagement from "@/pages/dashboard/admin/user-management/UserManagement";
import UserCategoryAdmin from "@/pages/dashboard/categoryadmin/user-management/UserCategoryAdmin";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const UserManagementCommon = () => {
  const {user} = useSelector((state: RootState) => state.auth);

  if (user?.role === "category-admin") {
    return (
      <>
        <UserCategoryAdmin/>
      </>
    );
  }

  if (user?.role === "super-admin") {
    return (
      <>
        <UserManagement/>
      </>
    );
  }

  return null;
}

export default UserManagementCommon;