import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import { MealProvider } from "./context/MealContext";
import { GameProvider } from "./context/GameContext";
import { StatsProvider } from "./context/StatsContext";
import { NotificationProvider } from "./context/NotificationContext";
function App() {
  return (
    <>
      <NotificationProvider>
      <UserProvider>
        <MealProvider>
          <StatsProvider>
          <GameProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
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
            </BrowserRouter>
          </GameProvider>
          </StatsProvider>
        </MealProvider>
      </UserProvider>
      </NotificationProvider>
    </>
  );
}

export default App;
