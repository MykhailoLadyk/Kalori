import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import Home from "./pages/Home";
import Nav from "./components/shared/Nav";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import Game from "./pages/Game";
import Shop from "./pages/Shop";
import DescribeAddMeal from "./pages/DescribeAddMeal";
import PhotoAddMeal from "./pages/PhotoAddMeal";
import ManualAddMeal from "./pages/ManualAddMeal";
import ConfirmMeal from "./pages/ConfirmMeal";
import Onboarding from "./pages/Onboarding";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Premium from "./pages/Premium";
import { UserProvider } from "./context/UserContext";
import { useUser } from "./hooks/useUser";
import { MealProvider } from "./context/MealContext";
import { GameProvider } from "./context/GameContext";
import { StatsProvider } from "./context/StatsContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";
import { FavoriteProvider } from "./context/FavoriteContext";
import { TutorialProvider } from "./context/TutorialContext";
import AppTutorial from "./components/shared/AppTutorial";
import ScrollToTop from "./components/shared/ScrollToTop";
import { C, alpha } from "./lib/constants";
import { useBackButton } from "./hooks/useBackButton";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";

// Root-level Android back button handler (priority 10 — fallback)
function BackButtonHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useBackButton(() => {
    const path = location.pathname;

    // Root / auth pages: minimize the app
    if (path === "/" || path === "/login" || path === "/onboarding") {
      if (Capacitor.isNativePlatform()) {
        CapApp.minimizeApp();
      }
      return;
    }

    // Confirm-meal: go back to the previous add-meal step
    if (path === "/add-meal/confirm") {
      const state = location.state;
      if (state?.description) {
        navigate("/add-meal/describe");
      } else if (state?.photoData) {
        navigate("/add-meal/photo");
      } else {
        navigate("/");
      }
      return;
    }

    // Other add-meal sub-pages: back to home
    if (path.startsWith("/add-meal/")) {
      navigate("/");
      return;
    }

    // All other pages (tabs, premium, terms, privacy, etc.): go to home
    navigate("/");
  }, 10);

  return null;
}

// Global loading screen component
function AuthLoader({ children }) {
  const { loading, user } = useUser();
  
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Simple Kalori loader */}
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          border: `2px solid ${alpha(C.accent, 30)}`,
          borderTopColor: C.accent,
          animation: "spin 1s linear infinite",
        }} />
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }
  
  return children;
}

// Public Route wrapper (redirects to home if already logged in)
function PublicRoute({ children }) {
  const { user } = useUser();
  if (user?.userAuth) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Onboarding Route wrapper (redirects to login if unauth, or home if already onboarded)
function OnboardingRoute({ children }) {
  const { user } = useUser();
  if (!user?.userAuth) {
    return <Navigate to="/login" replace />;
  }
  if (user?.completedOnboarding) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <>
      <NotificationProvider>
      <UserProvider>
        <ThemeProvider>
        <MealProvider>
          <FavoriteProvider>
          <StatsProvider>
          <GameProvider>
            <BrowserRouter>
              <ScrollToTop />
              <BackButtonHandler />
              <TutorialProvider>
              <AuthLoader>
                <AppTutorial />
                <Routes>
                  <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/onboarding" element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route element={<ProtectedRoute />}>
                    <Route element={<Nav />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/stats" element={<Stats />} />
                      <Route path="/game" element={<Game />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/settings" element={<Settings />} />
                    </Route>
                    <Route
                      path="/add-meal/describe"
                      element={<DescribeAddMeal />}
                    />
                    <Route path="/add-meal/photo" element={<PhotoAddMeal />} />
                    <Route path="/add-meal/manual" element={<ManualAddMeal />} />
                    <Route path="/add-meal/confirm" element={<ConfirmMeal />} />
                    <Route path="/premium" element={<Premium />} />
                  </Route>
                </Routes>
              </AuthLoader>
              </TutorialProvider>
            </BrowserRouter>
          </GameProvider>
          </StatsProvider>
          </FavoriteProvider>
         </MealProvider>
        </ThemeProvider>
      </UserProvider>
      </NotificationProvider>
    </>
  );
}

export default App;
