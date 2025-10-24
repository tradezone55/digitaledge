import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAdminStore } from "../stores/admin";
import CustomLoader from "../components/CustomLoader/page";
import { useLanguageNavigation } from "../utils/navigation";


const AdminProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdminStore();
  const { getLanguagePath } = useLanguageNavigation();

  console.log(isAuthenticated, "isAuthenticated");

  if (isLoading) {
    return <CustomLoader />;
  }

  // Redirect to admin login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={getLanguagePath("admin/login")} replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
