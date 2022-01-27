import styles from "./Row.module.css";
import Tile from "../Tile/Tile";
import { useEffect, useState } from "react";
type RowProps = {
  data: Array<[string, "present" | "absent" | "correct" | null]>;
  isWrong: boolean;
};
const Row = ({ data, isWrong }: RowProps) => {
  return (
    <div className={styles.row} data-state={isWrong ? "wrong" : "right"}>
      {data.map((ele, index) => (
        <Tile
          letter={ele[0]}
          state={ele[1]}
          index={index}
          key={`tile-${index}`}
        />
      ))}
    </div>
  );
};

export default Row;
