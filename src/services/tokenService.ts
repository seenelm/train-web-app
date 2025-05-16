import { v4 as uuidv4 } from "uuid";

export const tokenService = {
  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  getAccessToken() {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken() {
    return localStorage.getItem("refreshToken");
  },

  clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  getDeviceId() {
    const deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      return generateDeviceId();
    }
    return deviceId;
  }
}

function generateDeviceId(): string {
  const deviceId = uuidv4();
  localStorage.setItem("deviceId", deviceId);
  return deviceId;
}
