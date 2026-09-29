import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js"
import jwt from "jsonwebtoken";
import { testUserIds } from "./setup.js";
import { registerTestUser } from "./helper.js";


// let testUserIds = [];

const uniqueEmail = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;



describe("GET /", () => {
  it("should return API information", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Repo2Post API");
  });
});

describe("GET /api/health", () => {
  it("should return API information", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.message).toBe("Repo2Post API is running");
  });
});

describe("POST /api/auth/register", () => {
  it("should register a new user", async () => {
    const email = uniqueEmail('vitest')
    const response = await registerTestUser(
      "Vitest User",
      email, testUserIds
    );
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toContain("@example.com");
  });
});

describe("POST /api/auth/login", () => {
  it("should login an existing user", async () => {
    const email = uniqueEmail('login');
    await registerTestUser("Login Test", email, testUserIds);

    const response = await request(app).post("/api/auth/login").send({
      email,
      password: "Test@12345",
    });
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.headers["set-cookie"]).toBeDefined();

    const accessToken = response.body.accessToken;
    const profileResponse = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.user.email).toBe(email);
  });
  it("should reject an incorrect password", async () => {
    const email = uniqueEmail('wrong-password');
    await registerTestUser("login test 2", email, testUserIds);

    const response = await request(app).post("/api/auth/login").send({
      email,
      password: "WrongPassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(" Invalid email or password");
  });
  it("should reject unauthenticated requests", async () => {
    const response = await request(app).get("/api/users/me");
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("AUTHENTICATION REQUIRED");
  });
  it("should reject an invalid access token", async () => {
    const response = await request(app)
      .get("/api/users/me")
      .set("Authorization", "Bearer invalid-token");
    expect(response.status).toBe(401);
  });
  it("should refresh the access token", async () => {
    const agent = request.agent(app);
    const email = uniqueEmail('refresh');
    const registerResponse = await agent.post("/api/auth/register").send({
      name: "Refresh Test",
      email,
      password: "Test@12345",
    });
    testUserIds.push(registerResponse.body.user._id);
    const loginResponse = await agent.post("/api/auth/login").send({
      email,
      password: "Test@12345",
    });
    expect(loginResponse.status).toBe(200);
    const refreshResponse = await agent.post("/api/auth/refresh");
    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body.accessToken).toBeDefined();
  });
  it("should logout the user", async () => {
    const agent = request.agent(app);
    const email = uniqueEmail('logout');
    const registerResponse = await agent.post("/api/auth/register").send({
      name: "Logout test",
      email,
      password: "Test@12345",
    });
    testUserIds.push(registerResponse.body.user._id);
    const loginResponse = await agent.post("/api/auth/login").send({
      email,
      password: "Test@12345",
    });
    expect(loginResponse.status).toBe(200);
    const logoutResponse = await agent.post("/api/auth/logout");
    expect(logoutResponse.status).toBe(200);
    const refreshResponse = await agent.post("/api/auth/refresh");
    expect(refreshResponse.status).toBe(401);
  });
});