import axios from "axios";
import { refreshToken } from "./slices/authSlice";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

// Delay store import to prevent circular dependency
const getStore = () => require("./store").default;

API.interceptors.request.use((config) => {
  const { auth } = getStore().getState();
  if (auth.accessToken) {
    config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await getStore().dispatch(refreshToken());
        const { auth } = getStore().getState();
        error.config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
        return axios(error.config);
      } catch (err) {
        console.error("Token refresh failed:", err);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
