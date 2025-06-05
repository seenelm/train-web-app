// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";
import { UserResponse } from "@seenelm/train-core";

const mockUserResponse: UserResponse = {
  userId: "1",
  accessToken: "mock-access-token",
  refreshToken: "mock-refresh-token",
  username: "testuser",
  name: "New User",
};

export const handlers = [
  http.post("http://localhost:3000/api/user/login", async ({ request }) => {
    return HttpResponse.json(mockUserResponse);
  }),
  http.post("http://localhost:3000/api/user/register", async ({ request }) => {
    console.log("MSW: Registering user");
    const body = await request.json();
    console.log("MSW: Registration request body:", body);
    return HttpResponse.json(mockUserResponse);
  }),
  http.post("http://localhost:3000/api/user/logout", async ({ request }) => {
    console.log("MSW: Logging out user");
    return HttpResponse.json({ message: "Logged out successfully" });
  }),
  http.post(
    "http://localhost:3000/api/user/request-password-reset",
    async ({ request }) => {
      console.log("MSW: Requesting password reset");
      return HttpResponse.json({ message: "Password reset request sent" });
    }
  ),
  http.post(
    "http://localhost:3000/api/user/reset-password-with-code",
    async ({ request }) => {
      console.log("MSW: Requesting reset password with code");
      return HttpResponse.json({ message: "Password reset successful" });
    }
  ),
];
