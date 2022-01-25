import styles from "./Stat.module.css";

type StatProp = {
  number: number;
  title: string;
};
const Stat = ({ number, title }: StatProp) => {
  return (
    <div className={styles.wrapper}>
      <h1>{number}</h1>
      <p>{title}</p>
    </div>
  );
};

export default Stat;
