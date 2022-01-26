import axios from "axios";

const token = localStorage.getItem("token");
axios.defaults.baseURL = "http://localhost:3443";
axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

export default axios;