import { server } from "./mocks/server";
import { beforeAll, afterAll, afterEach } from "vitest";
import "@testing-library/jest-dom";

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
