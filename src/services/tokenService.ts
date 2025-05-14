import { v4 as uuidv4 } from "uuid";

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

export function getDeviceId() {
  const deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    return generateDeviceId();
  }
  return deviceId;
}

function generateDeviceId(): string {
  const deviceId = uuidv4();
  localStorage.setItem("deviceId", deviceId);
  return deviceId;
}
