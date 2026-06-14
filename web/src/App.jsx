import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/shared/Login";
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
import { UserProvider } from "./context/UserContext";
function App() {
  return (
    <>
      {/* <UserProvider> */}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Nav />}>
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/game" element={<Game />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="/add-meal/describe" element={<DescribeAddMeal />} />
            <Route path="/add-meal/photo" element={<PhotoAddMeal />} />
            <Route path="/add-meal/manual" element={<ManualAddMeal />} />
            <Route path="/add-meal/confirm" element={<ConfirmMeal />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* </UserProvider> */}
    </>
  );
}

export default App;
