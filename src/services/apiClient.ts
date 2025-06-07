import axios from "axios";
import { tokenService } from "./tokenService";
import { RefreshTokenResponse } from "@seenelm/train-core";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = tokenService.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// TODO: FIX THIS
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && tokenService.getRefreshToken()) {
      try {
        const res = await axios.post<RefreshTokenResponse>(
          `${API_URL}/user/refresh`,
          {
            refreshToken: tokenService.getRefreshToken(),
            deviceId: tokenService.getDeviceId(),
          }
        );
        // tokenService.setTokens(
        //   res.data.accessToken,
        //   res.data.refreshToken,
        //   res.data.userId,
        //   res.data.username,
        //   res.data.name
        // );
        tokenService.setAccessToken(res.data.accessToken);
        tokenService.setRefreshToken(res.data.refreshToken);
        err.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return axios(err.config);
      } catch (refreshError: any) {
        if (refreshError.response?.status === 403) {
          // Handle refresh token failure (expired or invalid)
          tokenService.clearTokens();

          // Redirect to login page
          window.location.href = "/login?expired=true";

          // Return a rejected promise to stop further processing
          return Promise.reject(refreshError);
        } else {
          throw refreshError;
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;
