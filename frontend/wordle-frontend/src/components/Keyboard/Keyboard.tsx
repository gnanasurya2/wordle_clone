import { useEffect, useState } from "react";
import styles from "./Keyboard.module.css";

const DATA = {
  rows: {
    "0": [
      {
        key: "Q",
        state: "",
      },
      {
        key: "W",
        state: "",
      },
      {
        key: "E",
        state: "",
      },
      {
        key: "R",
        state: "",
      },
      {
        key: "T",
        state: "",
      },
      {
        key: "Y",
        state: "",
      },
      {
        key: "U",
        state: "",
      },
      {
        key: "I",
        state: "",
      },
      {
        key: "O",
        state: "",
      },
      {
        key: "P",
        state: "",
      },
    ],
    "1": [
      {
        key: "A",
        state: "",
      },
      {
        key: "S",
        state: "",
      },
      {
        key: "D",
        state: "",
      },
      {
        key: "F",
        state: "",
      },
      {
        key: "G",
        state: "",
      },
      {
        key: "H",
        state: "",
      },
      {
        key: "J",
        state: "",
      },
      {
        key: "K",
        state: "",
      },
      {
        key: "L",
        state: "",
      },
    ],
    "2": [
      {
        key: "enter",
        state: "",
      },
      {
        key: "Z",
        state: "",
      },
      {
        key: "X",
        state: "",
      },
      {
        key: "C",
        state: "",
      },
      {
        key: "V",
        state: "",
      },
      {
        key: "B",
        state: "",
      },
      {
        key: "N",
        state: "",
      },
      {
        key: "M",
        state: "",
      },
      {
        key: "back",
        state: "",
      },
    ],
  },
};

type KeyboardProps = {
  map: Map<string, string>;
  currentRow: number;
  onChange: (first: null, event: any) => void;
};
type KeyboardState = {
  rows: {
    [key: string]: { key: string; state: string }[];
  };
};
const Keyboard = ({ map, currentRow, onChange }: KeyboardProps) => {
  const [data, setData] = useState<KeyboardState>(DATA);
  useEffect(() => {
    const newData = { ...data };
    for (let row in newData.rows) {
      newData.rows[row] = newData.rows[row].map((ele) => {
        if (map.has(ele.key)) {
          return { key: ele.key, state: map.get(ele.key) || "" };
        } else {
          return { ...ele };
        }
      });
    }
    setTimeout(() => {
      setData(newData);
    }, 3000);
  }, [currentRow, map]);
  return (
    <div className={styles.keyboard}>
      {Object.keys(data.rows).map((row, index) => (
        <div className={styles.row} key={row}>
          {index === 1 ? <div className={styles.half}></div> : null}
          {data.rows[row].map((ele) => (
            <button
              className={styles.key}
              key={ele.key}
              data-state={ele.state}
              onClick={() => {
                let key = ele.key.toLowerCase();
                if (key === "enter") {
                  key = "Enter";
                } else if (key === "back") {
                  key = "Backspace";
                }
                onChange(null, { key });
              }}
            >
              {ele.key}
            </button>
          ))}
          {index === 1 ? <div className={styles.half}></div> : null}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
