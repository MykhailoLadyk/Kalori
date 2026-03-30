// App will have all context providers. will also have all the pages and currentPage state. navbar always visible at the bottom
import { useState } from "react";
import "./App.css";
import Home from "./pages/Home";
function App() {
  return (
    <>
      <Home />
    </>
  );
}

export default App;
