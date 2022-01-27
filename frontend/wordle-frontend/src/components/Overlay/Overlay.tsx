import { useEffect, useState } from "react";
import Toggle from "../Toggle/Toggle";
import styles from "./Overlay.module.css";

type OverlayProps = {
  children: React.ReactNode;
  isOpen: boolean;
  title?: string;
  onClose?: () => void;
  header?: boolean;
};
const Overlay = ({
  children,
  isOpen,
  onClose,
  title,
  header = true,
}: OverlayProps) => {
  return (
    <div
      className={`${styles.wrapper} ${
        isOpen ? styles.animateIn : styles.closedWrapper
      }`}
      style={
        header
          ? { backgroundColor: "var(--background-color)" }
          : { backgroundColor: "transparent" }
      }
    >
      {header ? (
        <div className={styles.headerWrapper}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.iconWrapper} onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={styles.icon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : null}

      {children}
    </div>
  );
};

export default Overlay;
