import axios from "axios";

export const api = axios.create({
  baseURL: "https://caus-backend.onrender.com/api",
  withCredentials: true,
});
