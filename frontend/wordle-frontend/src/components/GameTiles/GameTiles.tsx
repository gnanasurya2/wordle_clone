import { gameStateType } from "../../types";
import Row from "../Row/Row";
import Tile from "../Tile/Tile";
import styles from "./GameTiles.module.css";

type GameTilesProps = {
  data: gameStateType;
  wrongRow: number;
};
const GameTitles = ({ data, wrongRow }: GameTilesProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.gameBoard}>
        {Object.keys(data.columns).map((col, index) => (
          <Row
            data={data.columns[col]}
            isWrong={wrongRow === index}
            key={col}
          />
        ))}
      </div>
    </div>
  );
};

export default GameTitles;
