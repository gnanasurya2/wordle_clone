import { useEffect, useState } from "react";
import styles from "./App.module.css";
import GameBoard from "./components/GameBoard/GameBoard";
import Header from "./components/Header/Header";
import Instructions from "./components/Instructions/Instructions";
import Overlay from "./components/Overlay/Overlay";
import Settings from "./components/Settings/Settings";

function App() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [contrastMode, setContrastMode] = useState("normal");

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
    setContrastMode(mode);
  }, []);

  const contrastChangeHandler = (state: boolean) => {
    let val = state ? "contrast" : "normal";
    localStorage.setItem("contrastMode", val);
    setContrastMode(val);
  };

  const themeChangeHandler = (state: boolean) => {
    let theme = state ? "dark" : "light";
    localStorage.setItem("theme", theme);
    document.body.setAttribute("data-theme", theme);
  };
  return (
    <div className="App">
      <div className={styles.wrapper} data-theme={contrastMode}>
        <Header
          onSettingOpen={() => setIsOverlayOpen((state) => !state)}
          onInstructionsOpen={() => setIsInstructionsOpen((state) => !state)}
        />
        <GameBoard />
        <Overlay
          isOpen={isOverlayOpen}
          onClose={() => setIsOverlayOpen(false)}
          title="settings"
        >
          <Settings
            onThemeChange={themeChangeHandler}
            onContrastChange={contrastChangeHandler}
          />
        </Overlay>
        <Overlay
          isOpen={isInstructionsOpen}
          title="how to play"
          onClose={() => setIsInstructionsOpen(false)}
        >
          <Instructions />
        </Overlay>
      </div>
    </div>
  );
}

export default App;
