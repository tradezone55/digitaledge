import "./App.css";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { QueryProvider } from "./providers/QueryProvider";
import CustomLoader from "./components/CustomLoader/page";
import { useTranslation } from "react-i18next";
import supabase from "./supabase";
import { useUserStore } from "./stores";

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
      // No language in query params, set default language without redirect
      if (i18n.language !== 'en') {
        i18n.changeLanguage('en');
      }
    }
  }, [location.search, i18n]);

  return null;
};

// Auth state listener component
const AuthStateListener = () => {
  const { clearUser } = useUserStore();

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);

        // Handle Outlook-specific authentication issues
        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in successfully:', session.user?.email);

          // Check if this is from a magic link callback
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          if (hashParams.has('access_token') || hashParams.has('refresh_token')) {
            console.log('Magic link authentication detected, processing...');
          }
        }

        if (event === 'SIGNED_OUT' || !session) {
          clearUser();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [clearUser]);

  return null;
};

function App() {
  console.log('App component rendering');
  return (
    <QueryProvider>
      <BrowserRouter>
        <AuthStateListener />
        <LanguageDetector />
        <Suspense fallback={<CustomLoader />}>
          <div>
            <Routes>
              {/* All routes including root */}
              <Route path="/*" element={<LanguageRoutes />} />
            </Routes>
          </div>
        </Suspense>
      </BrowserRouter>
    </QueryProvider>
  );
}

// Main routes component (no longer language-specific)
const LanguageRoutes = () => {
  console.log('LanguageRoutes rendering');
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<EnhancedLandingPage />} />
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
