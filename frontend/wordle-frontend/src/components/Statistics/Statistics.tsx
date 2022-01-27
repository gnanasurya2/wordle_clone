import axios from "../../helpers/axios";
import { useEffect, useState } from "react";
import Stat from "../Stat/Stat";
import styles from "./Statistics.module.css";
type StatisticsProps = {
  onClose: () => void;
};
type StatsResponse = {
  played: number;
  winPercentage: number;
  currentStreak: number;
  maxStreak: number;
  completed: number;
  guessDistribution: string[];
};
const Statistics = ({ onClose }: StatisticsProps) => {
  const [data, setData] = useState<StatsResponse | null>(null);
  useEffect(() => {
    axios
      .get("/stats")
      .then((res) => {
        console.log("data", res);
        setData(res.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {data ? (
          <>
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className={styles.contentWrapper}>
              <h3 className={styles.title}>Statistics</h3>
              <div className={styles.percentageWrapper}>
                <Stat number={data.played} title="Played" />
                <Stat number={data.winPercentage} title="Win%" />
                <Stat number={data.currentStreak} title="Current Streak" />
                <Stat number={data.maxStreak} title="Max Streak" />
              </div>
            </div>
            <h2 className={styles.title}>guess distribution</h2>
            {data.guessDistribution.map((ele, index) => (
              <div className={styles.guessWrapper} key={`guess-${index}`}>
                <p>{index + 1}</p>
                {+ele ? (
                  <div
                    className={styles.bar}
                    style={{
                      width: `${Math.round((+ele / data.completed) * 100)}%`,
                    }}
                  >
                    <p>{ele}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Statistics;
