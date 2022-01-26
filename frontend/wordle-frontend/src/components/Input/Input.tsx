import Button from "../Button/Button";
import styles from "./Input.module.css";
type InputProps = {
  field: string;
  fieldText: string;
  type?: string;
  required?: boolean;
};
const Input = ({ field, fieldText, type = "text", required }: InputProps) => {
  return (
    <div className={styles.wrapper}>
      <label htmlFor={field} className={styles.label}>
        {fieldText}:
      </label>
      <input
        type={type}
        name={field}
        id={field}
        className={styles.input}
        required={required}
      />
    </div>
  );
};

export default Input;
