// src/components/pages/dashboard/shared/StatusManagementCommon.tsx

import AdminStatusManagement from "@/pages/dashboard/admin/admin-status/AdminStatusManagement";
import StatusManagement from "@/pages/dashboard/categoryadmin/status-management/StatusManagement";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";


const StatusManagementCommon = () => {
  const {user} = useSelector((state: RootState) => state.auth);

  if (user?.role === "category-admin") {
    return (
      <>
        <StatusManagement/>
      </>
    );
  }
  
  if (user?.role === "super-admin") {
    return (
      <>
        <AdminStatusManagement/>
      </>
    );
  }
  console.log(user?.role);

  return null;
}

export default StatusManagementCommon;

