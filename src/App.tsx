import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {Suspense, lazy, useEffect, useState} from "react";
import { QueryProvider } from "./providers/QueryProvider";
import CustomLoader from "./components/CustomLoader/page";
import { isBeta } from "./flags";
import { getLangFromURLorStorage, loadUILabels, switchLang } from "./i18n";

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

function App() {
  
  const [lang, setLang] = useState<"en" | "es">(getLangFromURLorStorage());
  const showBilingual = isBeta();

  useEffect(() => {
    if (!showBilingual) return;
    loadUILabels(lang).catch(() => {});
  }, [lang, showBilingual]);

  const handleLangChange = (next: "en" | "es") => {
    setLang(next);
    switchLang(next);
  };
return (
    <QueryProvider>
      {/* Language toggle – only visible in beta mode (?beta=1) */}
      {showBilingual && (
        <div
          style={{ position: "fixed", top: 10, right: 10, zIndex: 9999, display: "flex", gap: "8px",
                   alignItems: "center", background: "rgba(0,0,0,0.6)", border: "1px solid #333",
                   padding: "6px 10px", borderRadius: "10px", backdropFilter: "blur(4px)" }}
        >
          <button onClick={() => handleLangChange("en")} aria-label="Switch to English">🇺🇸 EN</button>
          <span>|</span>
          <button onClick={() => handleLangChange("es")} aria-label="Cambiar a Español">🇪🇸 ES</button>
        </div>
      )}

      <BrowserRouter>
        <Suspense fallback={<CustomLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<EnhancedLandingPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/login" element={<Navigate to={"/auth/login"} />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Admin Routes */}
            <Route path="/admin/auth/login" element={<AdminLoginPage />} />
            <Route path="/admin/login" element={<Navigate to={"/admin/auth/login"} />} />

            <Route path="/admin/auth/callback" element={<AdminAuthCallback />} />
            <Route path="/admin" element={<AdminProtectedRoute />}>
              <Route path="dashboard" index element={<AdminDashboardPage />} />
            </Route>

            {/* Protected User Routes */}
            <Route path="home" element={<ProtectedRoute />}>
              <Route index element={<Home />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="demo" element={<DemoQuiz />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
