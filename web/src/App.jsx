import { useState } from "react";
import Home from "./pages/Home";
import Nav from "./components/shared/Nav";
function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <>
      {currentPage === "home" && <Home />}
      <Nav
        active={currentPage}
        setPage={setCurrentPage}
        onAddMeal={setCurrentPage}
      />
    </>
  );
}

export default App;
