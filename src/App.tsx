import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryProvider } from "./providers/QueryProvider";
import Home from "./pages/Home";
import LoginPage from "./pages/auth/login";
import SignupPage from "./pages/auth/sign-up";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import AdminLoginPage from "./pages/admin/auth/login";
import AdminDashboardPage from "./pages/admin/dashboard";
import CheckoutPage from "./pages/checkout";
import DemoQuiz from "./components/DemoQuiz";
import EnhancedLandingPage from "./pages";
import AdminProtectedRoute from "./protectedRoute/AdminProtectedRoute";

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<EnhancedLandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
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
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
