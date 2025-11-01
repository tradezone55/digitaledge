import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { QueryProvider } from "./providers/QueryProvider";
import CustomLoader from "./components/CustomLoader/page";
import { useTranslation } from "react-i18next";

// Lazy load all pages
const Home = lazy(() => import("./pages/Home"));
const DemoQuiz = lazy(() => import("./components/DemoQuiz"));
const EnhancedLandingPage = lazy(() => import("./pages"));

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


function App() {
  console.log('App component rendering');
  return (
    <QueryProvider>
      <BrowserRouter>
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
      <Route path="home" element={<Home />} />
      <Route path="home/demo" element={<DemoQuiz />} />
    </Routes>
  );
};

export default App;
