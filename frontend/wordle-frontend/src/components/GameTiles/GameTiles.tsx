import Row from "../Row/Row";
import Tile from "../Tile/Tile";
import styles from "./GameTiles.module.css";

type GameTilesProps = {
  data: Array<Array<[string, "present" | "absent" | "correct" | null]>>;
  wrongRow: number;
};
const GameTitles = ({ data, wrongRow }: GameTilesProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.gameBoard}>
        {data.map((row, index) => (
          <Row data={row} isWrong={wrongRow === index} />
        ))}
      </div>
    </div>
  );
};

export default GameTitles;
