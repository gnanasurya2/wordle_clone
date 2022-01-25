import { useState } from "react";
import Stat from "../Stat/Stat";
import styles from "./Statistics.module.css";
type StatisticsProps = {
  onClose: () => void;
};
const Statistics = ({ onClose }: StatisticsProps) => {
  const [guess, setGuess] = useState([0, 0, 0, 0, 0, 6]);
  const [total, setTotal] = useState(6);
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div>
          <button className={styles.iconWrapper} onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={styles.icon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className={styles.contentWrapper}>
          <h3 className={styles.title}>Statistics</h3>
          <div className={styles.percentageWrapper}>
            <Stat number={0} title="Played" />
            <Stat number={0} title="Win%" />
            <Stat number={0} title="Current Streak" />
            <Stat number={0} title="Max Streak" />
          </div>
        </div>
        <h2 className={styles.title}>guess distribution</h2>
        {guess.map((ele, index) => (
          <div className={styles.guessWrapper}>
            <p>{index + 1}</p>
            {ele ? (
              <div
                className={styles.bar}
                style={{ width: `${Math.round((ele / total) * 100)}%` }}
              >
                <p>{ele}</p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics;
