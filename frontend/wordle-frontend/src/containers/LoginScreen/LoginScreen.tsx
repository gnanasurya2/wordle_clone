import axios from "../../helpers/axios";
import React, { useEffect, useState } from "react";
import styles from "./LoginScreen.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { Link, useNavigate } from "react-router-dom";

const LoginScreen = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const submiHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
    };
    console.log("values", target.email.value, target.password.value);
    axios
      .post("http://localhost:3443/auth/login", {
        email: target.email.value,
        password: target.password.value,
      })
      .then((res) => {
        console.log("success", res.data);
        localStorage.setItem("token", res.data.access_token);
        setError("");
        navigate("/");
      })
      .catch((err) => {
        console.log("error", err);
        setError("Enter valid data");
      });
  };
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>WORDLE</h1>
      <p>Login Screen</p>
      <form className={styles.form} onSubmit={submiHandler}>
        <Input field="email" fieldText="Email" required />
        <Input field="password" type="password" fieldText="Password" required />
        <p className={styles.errorText}>{error}</p>
        <Button type="submit">Submit</Button>
      </form>
      <Link
        to="/signup"
        style={{
          textDecoration: "none",
          color: "var(--color)",
          marginTop: "20px",
        }}
      >
        <p>new user? Signup</p>
      </Link>
    </div>
  );
};

export default LoginScreen;
