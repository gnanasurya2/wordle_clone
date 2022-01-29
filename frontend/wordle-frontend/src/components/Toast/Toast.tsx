import { useEffect, useState } from "react";
import styles from "./Toast.module.css";

const Toast = ({ text }: { text: string }) => {
  const [className, setClassName] = useState("");
  const [content, setContent] = useState("");
  useEffect(() => {
    if (text) {
      setContent(text);
      setClassName(styles.visible);
    } else {
      setClassName(styles.hidden);
    }
  }, [text]);
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.container} ${className} `}>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Toast;
