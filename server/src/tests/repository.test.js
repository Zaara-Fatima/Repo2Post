import { describe, it, expect ,vi } from "vitest";
import request from "supertest";
import app from "../app.js"
// import Repository from "../models/Repository.js";
import { accessToken } from "./setup.js";
import { githubApi } from "../clients/github.client.js";
// import jwt from "jsonwebtoken";

describe("POST /api/repositories/analyze", () => {
  it("should analyze a valid GitHub repository", async () => {
    const response = await request(app)
      .post("/api/repositories/analyze")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        url: "https://github.com/expressjs/express",
      });
    console.log(response.body);
    expect(response.status).toBe(201);
  });
  it("should reject a non-existent GitHub repository", async () => {
    const response = await request(app)
      .post("/api/repositories/analyze")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        url: "https://github.com/expressjs/this-repository-does-not-exist",
      });
    expect(response.status).toBe(404);
  });
  it("should reject invalid repository input", async () => {
    const response = await request(app)
      .post("/api/repositories/analyze")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        url: "not-a-github-url",
      });
    expect(response.status).toBe(400);
    console.log(response.body);
  });
  it("should handle GitHub server failure", async () => {
    const githubSpy = vi.spyOn(githubApi, "get").mockRejectedValue({
      response: {
        status: 500,
      },
    });
    const response = await request(app)
      .post("/api/repositories/analyze")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        url: "https://github.com/expressjs/express",
      });
    expect(response.status).toBe(503);
    githubSpy.mockRestore();
  });
});