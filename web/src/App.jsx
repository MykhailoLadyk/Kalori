import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
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
import { UserProvider } from "./context/UserContext";
import { useUser } from "./hooks/useUser";
import { MealProvider } from "./context/MealContext";
import { GameProvider } from "./context/GameContext";
import { StatsProvider } from "./context/StatsContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";
import { C, alpha } from "./lib/constans";

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

function App() {
  return (
    <>
      <NotificationProvider>
      <UserProvider>
        <ThemeProvider>
        <MealProvider>
          <StatsProvider>
          <GameProvider>
            <BrowserRouter>
              <AuthLoader>
                <Routes>
                  <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                  <Route path="/onboarding" element={<Onboarding />} />
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
                  </Route>
                </Routes>
              </AuthLoader>
            </BrowserRouter>
          </GameProvider>
          </StatsProvider>
         </MealProvider>
        </ThemeProvider>
      </UserProvider>
      </NotificationProvider>
    </>
  );
}

export default App;
