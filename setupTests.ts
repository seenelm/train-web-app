import { server } from "./src/common/mocks/server";
import { beforeAll, afterAll, afterEach } from "vitest";
import "@testing-library/jest-dom";
import { vi } from "vitest";

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
  server.events.on("request:start", ({ request }) => {
    console.log("Outgoing request:", request.method, request.url);
  });
});

afterAll(() => {
  server.close();
});

afterEach(() => {
  server.resetHandlers();
});
