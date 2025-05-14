import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  getDeviceId,
} from "./tokenService";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && getRefreshToken()) {
      try {
        const res = await axios.post(`${API_URL}/user/refresh`, {
          refreshToken: getRefreshToken(),
          deviceId: getDeviceId(),
        });
        setTokens(res.data.accessToken, res.data.refreshToken);
        err.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return axios(err.config);
      } catch {
        // What happens if refresh token is invalid?
        // redirect to login
      }
    }
    return Promise.reject(err);
  }
);

export default api;
