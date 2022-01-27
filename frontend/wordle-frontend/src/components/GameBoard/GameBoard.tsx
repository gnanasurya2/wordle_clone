import axios from "../../helpers/axios";
import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import GameTiles from "../GameTiles/GameTiles";
import Keyboard from "../Keyboard/Keyboard";
type stateType = Array<
  Array<[string, "present" | "absent" | "correct" | null]>
>;

const GameBoard = () => {
  const [data, setData] = useState<stateType | null>(null);
  const [initialFetch, setInitialFetch] = useState(false);
  const currentRow = useRef(0);
  const [wrongRow, setWrongRow] = useState(10);
  const [keyboardValues, setKeyboardValues] = useState(
    new Map<string, string>()
  );
  useEffect(() => {
    axios
      .get("/stats/gameState")
      .then((res) => {
        console.log("res", res.data);
        setData(res.data.gameState);
        currentRow.current = res.data.currentRow + 1;
        setInitialFetch(true);
      })
      .catch((err) => console.log("base err", err));
  }, []);
  const validateRow = () => {
    if (!data) {
      return;
    }
    const newData = [...data],
      row = currentRow.current,
      word = newData[row]
        .map((ele) => ele[0])
        .join("")
        .toLowerCase();
    const map = new Map<string, string>();
    axios
      .post("/words/validateWord", { word, row })
      .then((res) => {
        console.log("response", res.data);
        const rowValidator = res.data.res;
        if (!res.data.isPresent) {
          setWrongRow(row);
          return;
        } else {
          setWrongRow(10);
        }
        for (let i = 0; i < 5; i++) {
          newData[row][i][1] = rowValidator[i][1];
          map.set(newData[row][i][0], rowValidator[i][1]);
        }
        setKeyboardValues(map);
        if (row <= 4) {
          currentRow.current = row + 1;
        }
        setData(newData);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  function keyDownHandler(this: HTMLElement | void, event: any) {
    const key: string = event.key;
    const newData = data ? [...data] : [];

    if (/^[a-z]{1}$/i.test(key)) {
      for (let i = 0; i < 5; i++) {
        if (newData[currentRow.current][i][0] === "") {
          newData[currentRow.current][i][0] = key.toUpperCase();
          break;
        }
      }
    } else if (key === "Backspace") {
      for (let i = 4; i >= 0; i--) {
        if (newData[currentRow.current][i][0] !== "") {
          newData[currentRow.current][i][0] = "";
          break;
        }
      }
    } else if (key === "Enter") {
      let isComplete = true;
      for (let i = 0; i < 5; i++) {
        isComplete = newData[currentRow.current][i][0] !== "";
      }
      if (isComplete) {
        console.log("completed");
        validateRow();
      }
    }
    setData(newData);
  }
  useEffect(() => {
    if (wrongRow !== 10) {
      setTimeout(() => setWrongRow(10), 600);
    }
  }, [wrongRow]);
  useEffect(() => {
    if (initialFetch) {
      console.log("key down handler");
      document?.addEventListener("keydown", keyDownHandler);
    }

    return () => {
      document?.removeEventListener("keydown", keyDownHandler);
    };
  }, [initialFetch]);
  return (
    <div>
      {data ? <GameTiles data={data} wrongRow={wrongRow} /> : null}
      <Keyboard
        currentRow={currentRow.current}
        map={keyboardValues}
        onChange={(first, event) => {
          keyDownHandler(event);
        }}
      />
    </div>
  );
};
export default GameBoard;
