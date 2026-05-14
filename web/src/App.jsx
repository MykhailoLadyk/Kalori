import { useState } from "react";
import Home from "./pages/Home";
import Nav from "./components/shared/Nav";
import Stats from "./pages/Stats";
function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <>
      {currentPage === "home" && <Home />}
      {currentPage === "stats" && <Stats />}
      <Nav
        active={currentPage}
        setPage={setCurrentPage}
        onAddMeal={setCurrentPage}
      />
    </>
  );
}

export default App;
