import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import GameTiles from "../GameTiles/GameTiles";
import Keyboard from "../Keyboard/Keyboard";
type stateType = [string, null];
const GameBoard = () => {
  const [data, setData] = useState<
    Array<Array<[string, "present" | "absent" | "correct" | null]>>
  >([
    [
      ["", null],
      ["", null],
      ["", null],
      ["", null],
      ["", null],
    ],
    [
      ["", null],
      ["", null],
      ["", null],
      ["", null],
      ["", null],
    ],
    [
      ["", null],
      ["", null],
      ["", null],
      ["", null],
      ["", null],
    ],
    [
      ["", null],
      ["", null],
      ["", null],
      ["", null],
      ["", null],
    ],
    [
      ["", null],
      ["", null],
      ["", null],
      ["", null],
      ["", null],
    ],
    [
      ["", null],
      ["", null],
      ["", null],
      ["", null],
      ["", null],
    ],
  ]);
  const currentRow = useRef(0);
  const [wrongRow, setWrongRow] = useState(10);
  const [keyboardValues, setKeyboardValues] = useState(
    new Map<string, string>()
  );
  const validateRow = () => {
    if (Math.random() < 0.6) {
      setWrongRow(currentRow.current);
      return;
    } else {
      setWrongRow(10);
    }
    const newData = [...data],
      row = currentRow.current;
    console.log("current row", newData[row]);
    const map = new Map<string, string>();
    for (let i = 0; i < 5; i++) {
      const rand = Math.random();

      if (rand < 0.3) {
        newData[row][i][1] = "absent";
        map.set(newData[row][i][0], "absent");
      } else if (rand > 0.3 && rand < 0.6) {
        newData[row][i][1] = "present";
        map.set(newData[row][i][0], "present");
      } else {
        newData[row][i][1] = "correct";
        map.set(newData[row][i][0], "correct");
      }
    }
    setKeyboardValues(map);
    if (row < 4) {
      currentRow.current = row + 1;
    }
    setData(newData);
  };
  function keyDownHandler(this: HTMLElement | void, event: any) {
    console.log(event);
    const key: string = event.key;
    const newData = [...data];
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
    document?.addEventListener("keydown", keyDownHandler);
    return () => {
      document?.removeEventListener("keydown", keyDownHandler);
    };
  }, []);
  return (
    <div>
      <GameTiles data={data} wrongRow={wrongRow} />
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
