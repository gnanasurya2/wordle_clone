import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import styles from "./App.module.css";
import GameScreen from "./containers/GameScreen";
import LoginScreen from "./containers/LoginScreen/LoginScreen";
import SignUpScreen from "./containers/SignUpScreen/SignUpScreen";

function App() {
  useEffect(() => {
    let theme = localStorage.getItem("theme");
    if (theme === null) {
      localStorage.setItem("theme", "dark");
      theme = "dark";
    }
    document.body.setAttribute("data-theme", theme);
    let mode = localStorage.getItem("contrastMode");
    if (mode === null) {
      localStorage.setItem("contrastMode", "normal");
      mode = "normal";
    }
  }, []);
  return (
    <div>
      <Routes>
        <Route path="/" element={<GameScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
      </Routes>
    </div>
  );
}

export default App;
