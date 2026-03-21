// App will have all context providers. will also have all the pages and currentPage state. navbar always visible at the bottom
import { useState } from "react";
import gameProvider from "./context/gameContext";
import Game from "./pages/Game.jsx";
import HomePage from "./pages/HomePage.jsx";
import SettingsPage from "./pages/Settings.jsx";
import ProfilePage from "./pages/Profile.jsx";
import Nav from "./components/shared/Nav.jsx";
import "./App.css";
function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const pages = {
    home: <HomePage />,
    settings: <SettingsPage />,
    profile: <ProfilePage />,
  };
  return (
    <gameProvider>
      <h1>Kalori</h1>
      {pages[currentPage]}
      <Nav />
    </gameProvider>
  );
}

export default App;
