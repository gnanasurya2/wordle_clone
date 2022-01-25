import { useState, useEffect } from "react";
import styles from "./Settings.module.css";
import Toggle from "../Toggle/Toggle";
type SettingsProps = {
  onContrastChange: (state: boolean) => void;
  onThemeChange: (state: boolean) => void;
};
const Settings = ({ onContrastChange, onThemeChange }: SettingsProps) => {
  const [initialContrastValue, setInitialContrastValue] = useState(true);
  const [initialThemeValuse, setInitialThemeValue] = useState(true);
  useEffect(() => {
    const theme = localStorage.getItem("theme"),
      contrast = localStorage.getItem("contrastMode");
    console.log(theme, contrast);
    setInitialThemeValue(theme === "dark");
    setInitialContrastValue(contrast === "contrast");
  }, []);
  return (
    <>
      <div className={styles.item}>
        <h3>Dark Theme</h3>
        <Toggle onChange={onThemeChange} initialValue={initialThemeValuse} />
      </div>
      <div className={styles.item}>
        <div>
          <h3>Colour Blind Mode</h3>
          <p>High contrast colours</p>
        </div>

        <Toggle
          onChange={onContrastChange}
          initialValue={initialContrastValue}
        />
      </div>
    </>
  );
};

export default Settings;
