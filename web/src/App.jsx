// App will have all context providers. will also have all the pages and currentPage state. navbar always visible at the bottom
import { useState } from "react";
import "./App.css";
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
