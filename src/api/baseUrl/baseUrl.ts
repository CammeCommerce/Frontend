import axios from "axios";

const productionDomain = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: productionDomain || "http://localhost:8080",
});

export default api;
