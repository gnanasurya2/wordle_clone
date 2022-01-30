import Row from "../Row/Row";
import styles from "./Instructions.module.css";
const Instructions = () => {
  return (
    <div>
      <div className={styles.section}>
        <p>Guess the WORDLE in 6 tries.</p>
        <p>
          Each guess must be a valid 5 letter word. Hit the enter button to
          submit.
        </p>
        <p>
          After each guess, the color of the tiles will change to show how close
          your guess was to the word.
        </p>
      </div>
      <div className={styles.section}>
        <strong>Examples</strong>
        <div className={styles.rowsData}>
          <Row
            data={[
              ["G", "correct"],
              ["N", "absent"],
              ["A", "absent"],
              ["N", "absent"],
              ["A", "correct"],
            ]}
            isWrong={false}
          />
        </div>
        <p>
          The letter <strong>G</strong> is in the word and in the correct spot.
        </p>
        <div className={styles.rowsData}>
          <Row
            data={[
              ["S", "absent"],
              ["U", "absent"],
              ["R", "present"],
              ["Y", "absent"],
              ["A", "absent"],
            ]}
            isWrong={false}
          />
        </div>
        <p>
          The letter <strong>R</strong> is in the word but in the wrong spot.
        </p>
        <div className={styles.rowsData}>
          <Row
            data={[
              ["G", "absent"],
              ["N", "absent"],
              ["A", "present"],
              ["N", "absent"],
              ["A", "correct"],
            ]}
            isWrong={false}
          />
        </div>
        <p>
          The letter <strong>N</strong> is not in the word in any spot.
        </p>
      </div>
      <p style={{ marginTop: "10px" }}>
        A new <strong>WORDLE</strong> will be available each day!
      </p>
    </div>
  );
};

export default Instructions;
