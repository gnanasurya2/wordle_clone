import styles from "./Row.module.css";
import Tile from "../Tile/Tile";
import { useEffect, useState } from "react";
type RowProps = {
  data: Array<[string, "present" | "absent" | "correct" | null]>;
  isWrong: boolean;
};
const Row = ({ data, isWrong }: RowProps) => {
  const [wrong, setWrong] = useState(isWrong);
  useEffect(() => {
    if (isWrong) {
      setTimeout(() => setWrong(false), 600);
    }
    setWrong(isWrong);
  }, [isWrong]);
  return (
    <div className={styles.row} data-state={wrong ? "wrong" : "right"}>
      {data.map((ele, index) => (
        <Tile letter={ele[0]} state={ele[1]} index={index} />
      ))}
    </div>
  );
};

export default Row;
