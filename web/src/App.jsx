import { useState } from "react";
import Home from "./pages/Home";
import Nav from "./components/shared/Nav";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import Game from "./pages/Game";
import Shop from "./pages/Shop";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <>
      {currentPage === "home" && <Home />}
      {currentPage === "stats" && <Stats />}
      {currentPage === "game" && <Game />}
      {currentPage === "shop" && <Shop />}
      {currentPage === "settings" && <Settings />}

      <Nav
        active={currentPage}
        setPage={setCurrentPage}
        onAddMeal={setCurrentPage}
      />
    </>
  );
}

export default App;
