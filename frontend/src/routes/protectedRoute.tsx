// src/routes/protectedRoute.tsx

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "@/redux/store";
import type { Role } from "@/types/authType";


type Props = {
  children: React.ReactNode;
  role?: Role | Role[];
};


const ProtectedRoute = ({ children, role }: Props) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

if (role) {
  if (Array.isArray(role)) {
    if (!role.includes(user?.role as Role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  } 
  else {
    if (user?.role !== role) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
}


  return <>{children}</>;
};

export default ProtectedRoute;
