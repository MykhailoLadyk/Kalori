import { useState } from "react";

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
  const [currentPage, setCurrentPage] = useState("home");
  const [confirmResult, setConfirmResult] = useState(null);
  const [confirmPhoto, setConfirmPhoto] = useState(null);
  const [isAlbum, setIsAlbum] = useState(false);

  const confirmMeal = (meal, photoData = null, isAlbum = false) => {
    setConfirmResult(meal);
    setConfirmPhoto(photoData);
    setIsAlbum(isAlbum);
    setCurrentPage("confirm");
  };
  return (
    <>
      {/* <UserProvider> */}
      {currentPage === "home" && (
        <Home setCurrentPage={setCurrentPage} setMealConfirm={confirmMeal} />
      )}
      {currentPage === "stats" && <Stats />}
      {currentPage === "game" && <Game />}
      {currentPage === "shop" && <Shop />}
      {currentPage === "settings" && <Settings />}
      {currentPage === "photo" && (
        <PhotoAddMeal
          onBack={() => setCurrentPage("home")}
          setMealConfirm={confirmMeal}
        />
      )}
      {currentPage === "describe" && (
        <DescribeAddMeal
          onBack={() => setCurrentPage("home")}
          setMealConfirm={confirmMeal}
        />
      )}
      {currentPage === "manual" && (
        <ManualAddMeal
          onBack={() => setCurrentPage("home")}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === "confirm" && (
        <ConfirmMeal
          result={confirmResult}
          onBack={() => setCurrentPage("home")}
          photo={confirmPhoto}
          onRetake={() => {
            setCurrentPage("photo");
          }}
          isAlbum={isAlbum}
        />
      )}

      {currentPage !== "describe" &&
        currentPage !== "photo" &&
        currentPage !== "manual" &&
        currentPage !== "confirm" && (
          <Nav
            active={currentPage}
            setPage={setCurrentPage}
            onAddMeal={setCurrentPage}
          />
        )}

      {/* </UserProvider> */}
    </>
  );
}

export default App;
