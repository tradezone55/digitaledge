import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { QueryProvider } from "./providers/QueryProvider";
import CustomLoader from "./components/CustomLoader/page";

// Lazy load all pages
const Home = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./pages/auth/login"));
const AuthCallback = lazy(() => import("./pages/auth/callback"));
const ProfileSetupPage = lazy(() => import("./pages/profile-setup"));
const ProtectedRoute = lazy(() => import("./protectedRoute/ProtectedRoute"));
const AdminLoginPage = lazy(() => import("./pages/admin/auth/login"));
const AdminAuthCallback = lazy(() => import("./pages/admin/auth/callback"));
const AdminDashboardPage = lazy(() => import("./pages/admin/dashboard"));
const CheckoutPage = lazy(() => import("./pages/checkout"));
const DemoQuiz = lazy(() => import("./components/DemoQuiz"));
const EnhancedLandingPage = lazy(() => import("./pages"));
const AdminProtectedRoute = lazy(() => import("./protectedRoute/AdminProtectedRoute"));

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Suspense fallback={<CustomLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<EnhancedLandingPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Admin Routes */}
            <Route path="/admin/auth/login" element={<AdminLoginPage />} />
            <Route path="/admin/auth/callback" element={<AdminAuthCallback />} />
            <Route path="/admin" element={<AdminProtectedRoute />}>
              <Route path="dashboard" index element={<AdminDashboardPage />} />
            </Route>

            {/* Protected User Routes */}
            <Route path="home" element={<ProtectedRoute />}>
              <Route index element={<Home />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="demo" element={<DemoQuiz />} />
              <Route path="profile-setup" element={<ProfileSetupPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
