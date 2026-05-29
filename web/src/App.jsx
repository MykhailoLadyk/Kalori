import { useState } from "react";
import Home from "./pages/Home";
import Nav from "./components/shared/Nav";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import Game from "./pages/Game";
import Shop from "./pages/Shop";
import { UserProvider } from "./context/UserContext";
function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <>
      {/* <UserProvider> */}
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
      {/* </UserProvider> */}
    </>
  );
}

export default App;
