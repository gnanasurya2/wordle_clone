import styles from "./Tile.module.css";
type TileProps = {
  letter: string;
  state?: "absent" | "correct" | "present" | null;
  index: number;
};
const Tile = ({ letter, state = null, index }: TileProps) => {
  return (
    <div className={styles.wrapper} data-element={letter ? "true" : "false"}>
      <div className={styles.content} data-state={state} data-index={index}>
        <div className={`${styles.card} ${styles.front}`}>
          <p>{letter}</p>
        </div>
        <div className={`${styles.card} ${styles.back}`} data-state={state}>
          <p>{letter}</p>
        </div>
      </div>
    </div>
  );
};

export default Tile;
