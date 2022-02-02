import axios from "../../helpers/axios";
import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import GameTiles from "../GameTiles/GameTiles";
import Keyboard from "../Keyboard/Keyboard";
import Toast from "../Toast/Toast";
import { gameStateType, possibleTileState } from "../../types";

const TOAST_VALUES = [
  "phenomenal",
  "Awesome",
  "Splendid",
  "Great",
  "Good",
  "Phew!",
];
const GameBoard = () => {
  const [data, setData] = useState<gameStateType | null>(null);
  const [initialFetch, setInitialFetch] = useState(false);
  const currentRow = useRef(0);
  const [wrongRow, setWrongRow] = useState(10);
  const [keyboardValues, setKeyboardValues] = useState(
    new Map<string, possibleTileState>()
  );
  const [toastText, setToastText] = useState("");
  useEffect(() => {
    axios
      .get("/users/state")
      .then((res) => {
        console.log("res", res.data);
        const gameState: gameStateType = res.data.gameState;
        setData(gameState);
        currentRow.current = res.data.currentRow + 1;
        const keyMap = new Map<string, possibleTileState>();
        for (let col = 0; col <= res.data.currentRow; col++) {
          for (let row = 0; row < 5; row++) {
            keyMap.set(
              gameState.columns[col][row].key.toUpperCase(),
              gameState.columns[col][row].state
            );
          }
        }
        if (res.data.isComplete) {
          setToastText(TOAST_VALUES[res.data.currentRow]);
          currentRow.current = 10;
        }
        setKeyboardValues(keyMap);
        console.log("keyboard", keyMap);
        setInitialFetch(true);
      })
      .catch((err) => console.log("base err", err));
  }, []);

  useEffect(() => {
    if (toastText) {
      setTimeout(() => setToastText(""), 1000);
    }
  }, [toastText]);

  const validateRow = () => {
    if (!data || currentRow.current === 10) {
      return;
    }
    const newData = { ...data },
      row = currentRow.current,
      word = newData.columns[row]
        .map((ele) => ele.key)
        .join("")
        .toLowerCase();
    const map = new Map<string, possibleTileState>();
    axios
      .post("/words/validateWord", { word, row })
      .then((res) => {
        console.log("response", res.data);
        const rowValidator: { key: string; state: possibleTileState }[] =
          res.data.res;
        if (!res.data.isPresent) {
          setWrongRow(row);
          setToastText("Not in word list");
          return;
        } else {
          setWrongRow(10);
        }
        for (let i = 0; i < 5; i++) {
          newData.columns[row][i] = {
            ...newData.columns[row][i],
            state: rowValidator[i].state,
          };
          //change it to objects
          map.set(newData.columns[row][i].key, rowValidator[i].state);
        }
        setKeyboardValues(map);
        setData(newData);
        if (res.data.isComplete) {
          setToastText(TOAST_VALUES[row]);
          currentRow.current = 10;
        }
        if (row <= 4) {
          currentRow.current = row + 1;
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  function keyDownHandler(this: HTMLElement | void, event: any) {
    if (data === null) {
      return;
    }
    const key: string = event.key;
    const newData = { ...data };
    const col = currentRow.current;
    if (/^[a-z]{1}$/i.test(key)) {
      for (let row = 0; row < 5; row++) {
        if (newData.columns[col][row].key === "") {
          newData.columns[col][row].key = key.toUpperCase();
          break;
        }
      }
    } else if (key === "Backspace") {
      for (let row = 4; row >= 0; row--) {
        if (newData.columns[col][row].key !== "") {
          newData.columns[col][row].key = "";
          break;
        }
      }
    } else if (key === "Enter") {
      let isComplete = true;
      for (let row = 0; row < 5; row++) {
        isComplete = newData.columns[col][row].key !== "";
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
      //learn about queue microtask
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
      <Toast text={toastText} />
    </div>
  );
};
export default GameBoard;
