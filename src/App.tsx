import "./App.css";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { QueryProvider } from "./providers/QueryProvider";
import CustomLoader from "./components/CustomLoader/page";
import { useTranslation } from "react-i18next";

// Lazy load all pages
const Home = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./pages/auth/login"));
const AuthCallback = lazy(() => import("./pages/auth/callback"));
const ProtectedRoute = lazy(() => import("./protectedRoute/ProtectedRoute"));
const AdminLoginPage = lazy(() => import("./pages/admin/auth/login"));
const AdminAuthCallback = lazy(() => import("./pages/admin/auth/callback"));
const AdminDashboardPage = lazy(() => import("./pages/admin/dashboard"));
const CheckoutPage = lazy(() => import("./pages/checkout"));
const DemoQuiz = lazy(() => import("./components/DemoQuiz"));
const EnhancedLandingPage = lazy(() => import("./pages"));
const AdminProtectedRoute = lazy(() => import("./protectedRoute/AdminProtectedRoute"));

// Language detection component
const LanguageDetector = () => {
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const languageParam = urlParams.get('lang');
    const supportedLanguages = ['en', 'es', 'zh-CN', 'fr', 'pt'];

    if (languageParam && supportedLanguages.includes(languageParam)) {
      if (i18n.language !== languageParam) {
        i18n.changeLanguage(languageParam);
      }
    } else {
      // No language in query params, redirect to default language
      const currentPath = location.pathname;
      const currentSearch = location.search;
      const newSearch = currentSearch ? `${currentSearch}&lang=en` : '?lang=en';
      window.location.replace(`${currentPath}${newSearch}`);
    }
  }, [location.search, i18n]);

  return null;
};

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <LanguageDetector />
        <Suspense fallback={<CustomLoader />}>
          <Routes>
            {/* All routes without language prefix */}
            <Route path="/*" element={<LanguageRoutes />} />
            {/* Redirect root to default language */}
            <Route path="/" element={<Navigate to="/?lang=en" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryProvider>
  );
}

// Main routes component (no longer language-specific)
const LanguageRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route index element={<EnhancedLandingPage />} />
      <Route path="auth/login" element={<LoginPage />} />
      <Route path="login" element={<Navigate to="auth/login" replace />} />
      <Route path="auth/callback" element={<AuthCallback />} />

      {/* Admin Routes */}
      <Route path="admin/auth/login" element={<AdminLoginPage />} />
      <Route path="admin/login" element={<Navigate to="admin/auth/login" replace />} />
      <Route path="admin/auth/callback" element={<AdminAuthCallback />} />
      <Route path="admin" element={<AdminProtectedRoute />}>
        <Route path="dashboard" index element={<AdminDashboardPage />} />
      </Route>

      {/* Protected User Routes */}
      <Route path="home" element={<ProtectedRoute />}>
        <Route index element={<Home />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="demo" element={<DemoQuiz />} />
      </Route>
    </Routes>
  );
};

export default App;
