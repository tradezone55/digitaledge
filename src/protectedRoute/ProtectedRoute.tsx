
import { Navigate, Outlet } from "react-router";
import CustomLoader from "../components/CustomLoader/page";
import useCurrentUser from "../hooks/useCurrentUser";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading, currentUser } = useCurrentUser();

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
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
