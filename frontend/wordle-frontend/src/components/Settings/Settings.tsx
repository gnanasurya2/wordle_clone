import { useState, useEffect } from "react";
import styles from "./Settings.module.css";
import Toggle from "../Toggle/Toggle";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
type SettingsProps = {
  onContrastChange: (state: boolean) => void;
  onThemeChange: (state: boolean) => void;
};
const Settings = ({ onContrastChange, onThemeChange }: SettingsProps) => {
  const [initialContrastValue, setInitialContrastValue] = useState(true);
  const [initialThemeValuse, setInitialThemeValue] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const theme = localStorage.getItem("theme"),
      contrast = localStorage.getItem("contrastMode");
    console.log(theme, contrast);
    setInitialThemeValue(theme === "dark");
    setInitialContrastValue(contrast === "contrast");
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
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
      <div className={styles.item}>
        <h3>Logout</h3>
        <div>
          <Button onClick={logoutHandler}>Logout</Button>
        </div>
      </div>
    </>
  );
};

export default Settings;
