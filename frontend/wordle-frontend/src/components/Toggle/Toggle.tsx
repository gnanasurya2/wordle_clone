import { useEffect, useState } from "react";
import styles from "./Toggle.module.css";

type ToggleProps = {
    onChange: (state:boolean) => void;
    initialValue?: boolean
}
const Toggle = ({onChange , initialValue = false}:ToggleProps) => {
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
      setIsActive(initialValue);
  },[initialValue])
  return (
    <label className={styles.switch}>
      <input type="checkbox" checked={isActive} onChange={(event) => {
          let val = event.target.checked;
          setIsActive(val);
          onChange(val);
      }}/>
      <span className={`${styles.slider} ${styles.round}`}></span>
    </label>
  );
};

export default Toggle