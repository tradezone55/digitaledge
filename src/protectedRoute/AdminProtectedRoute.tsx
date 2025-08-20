import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAdminStore } from "../stores/admin";
import CustomLoader from "../components/CustomLoader/page";


const AdminProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdminStore();

  console.log(isAuthenticated, "isAuthenticated");

  if (isLoading) {
    return <CustomLoader />;
  }

  // Redirect to admin login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
