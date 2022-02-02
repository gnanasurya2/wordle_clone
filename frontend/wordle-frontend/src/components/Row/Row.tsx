import styles from "./Row.module.css";
import Tile from "../Tile/Tile";
import { useEffect, useState } from "react";
import { possibleTileState } from "../../types";
type RowProps = {
  data: Array<{
    key: string;
    state: possibleTileState;
  }>;
  isWrong: boolean;
};
const Row = ({ data, isWrong }: RowProps) => {
  return (
    <div className={styles.row} data-state={isWrong ? "wrong" : "right"}>
      {data.map((ele, index) => (
        <Tile
          letter={ele.key}
          state={ele.state}
          index={index}
          key={`tile-${index}`}
        />
      ))}
    </div>
  );
};

export default Row;
