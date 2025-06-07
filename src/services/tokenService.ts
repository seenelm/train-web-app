import { v4 as uuidv4 } from "uuid";

export const tokenService = {
  setTokens(
    accessToken: string,
    refreshToken: string,
    userId: string,
    username: string,
    name: string
  ) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem(
      "user",
      JSON.stringify({
        userId,
        username,
        name,
      })
    );
  },

  setAccessToken(accessToken: string) {
    localStorage.setItem("accessToken", accessToken);
  },

  setRefreshToken(refreshToken: string) {
    localStorage.setItem("refreshToken", refreshToken);
  },

  getAccessToken() {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken() {
    return localStorage.getItem("refreshToken");
  },

  getDeviceId() {
    const deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      return this.generateDeviceId();
    }
    return deviceId;
  },

  getUser() {
    return localStorage.getItem("user");
  },

  clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("deviceId");
    localStorage.removeItem("user");
  },

  generateDeviceId(): string {
    const deviceId = uuidv4();
    localStorage.setItem("deviceId", deviceId);
    return deviceId;
  },
};
