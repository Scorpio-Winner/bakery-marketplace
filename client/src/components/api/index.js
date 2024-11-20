import axios from "axios";

const accessToken = localStorage.getItem("accessToken");

axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

const host = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export { host };
