import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3443",
});
instance.interceptors.request.use((config) => {
  config.headers["Authorization"] =
    `Bearer ${localStorage.getItem("token")}` || "";
  config.headers["Cache-Control"] = "no-store";
  console.log("config", config);
  return config;
});

export default instance;
