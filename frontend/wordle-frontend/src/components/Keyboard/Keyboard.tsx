import { useEffect, useState } from "react";
import styles from "./Keyboard.module.css";

const DATA = [
  [
    ["Q", ""],
    ["W", ""],
    ["E", ""],
    ["R", ""],
    ["T", ""],
    ["Y", ""],
    ["U", ""],
    ["I", ""],
    ["O", ""],
    ["P", ""],
  ],
  [
    ["A", ""],
    ["S", ""],
    ["D", ""],
    ["F", ""],
    ["G", ""],
    ["H", ""],
    ["J", ""],
    ["K", ""],
    ["L", ""],
  ],
  [
    ["enter", ""],
    ["Z", ""],
    ["X", ""],
    ["C", ""],
    ["V", ""],
    ["B", ""],
    ["N", ""],
    ["M", ""],
    ["back", ""],
  ],
];
type KeyboardProps = {
  map: Map<string, string>;
  currentRow: number;
  onChange: (first: null, event: any) => void;
};
const Keyboard = ({ map, currentRow, onChange }: KeyboardProps) => {
  const [data, setData] = useState(DATA);
  useEffect(() => {
    const newData = data.map((row) =>
      row.map((ele) => {
        if (map.has(ele[0])) {
          return [ele[0], map.get(ele[0]) || ""];
        } else return ele;
      })
    );
    console.log("new data", newData);
    setTimeout(() => {
      setData(newData);
    }, 3000);
  }, [currentRow]);
  return (
    <div className={styles.keyboard}>
      {data.map((row, index) => (
        <div className={styles.row} key={row[0][0]}>
          {index === 1 ? <div className={styles.half}></div> : null}
          {row.map((ele) => (
            <button
              className={styles.key}
              key={ele[0]}
              data-state={ele[1]}
              onClick={() => {
                let key = ele[0].toLowerCase();
                if (key === "enter") {
                  key = "Enter";
                } else if (key === "back") {
                  key = "Backspace";
                }
                onChange(null, { key });
              }}
            >
              {ele[0]}
            </button>
          ))}
          {index === 1 ? <div className={styles.half}></div> : null}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
