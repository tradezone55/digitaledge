
import CustomLoader from "@/components/CustomLoader/page";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useUserStatusCheck } from "@/hooks/useUserStatusCheck";
import { Navigate, Outlet } from "react-router";
import { useLanguageNavigation } from "@/utils/navigation";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading, currentUser } = useCurrentUser();
  const { getLanguagePath } = useLanguageNavigation();

  // Check user status periodically and handle automatic logout
  useUserStatusCheck();

  // Show loading while validating
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CustomLoader />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !currentUser) {
    return <Navigate to={getLanguagePath("auth/login")} replace />;
  }

  return <Outlet />
};

export default ProtectedRoute;
