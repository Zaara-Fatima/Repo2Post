import { describe, it, expect ,vi } from "vitest";
import request from "supertest";
import app from "../app.js"
import jwt from "jsonwebtoken";
import Repository from "../models/Repository.js";
import { accessToken } from "./setup.js";
import { ai } from "../clients/ai.client.js";

describe("POST /api/posts/generate", () => {
  it("should generate a valid post", async () => {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    const repository = await Repository.create({
      userId: decoded.sub,
      name: "test-repository",
      owner: "test-owner",
      description: "A repository for AI testing",
      stars: 10,
      topics: ["react", "node"],
      languages: {
        JavaScript: 5000,
        HTML: 1000,
      },
      readme: "This is a test README",
      files: ["package.json", "src/index.js"],
      url: "https://github.com/test-owner/test-repository",
    });
    const aiSpy = vi.spyOn(ai.models, "generateContent").mockResolvedValue({
      text: JSON.stringify({
        hook: "I built a project with React and Node.js",
        content: "This is my test project.",
        hashtags: ["#React", "#NodeJS"],
        cta: "What do you think?",
      }),
    });
    const response = await request(app)
      .post("/api/posts/generate")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        repositoryId: repository._id,
      });
    expect(response.status).toBe(201);
    expect(response.body.post).toBeDefined();
    expect(response.body.post.hook).toBe(
      "I built a project with React and Node.js",
    );
    aiSpy.mockRestore();
  });
  it("should respond with ai failiure", async () => {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    const repository = await Repository.create({
      userId: decoded.sub,
      name: "ai-failure-test-repository",
      owner: "vitest-user",
      description: "A mock repository for testing AI failures",
      stars: 5,
      topics: ["testing", "vitest", "nodejs"],
      languages: {
        JavaScript: 3000,
        HTML: 500,
      },
      readme: "Mock README used for testing AI service failure handling.",
      files: ["package.json", "src/app.js"],
      url: "https://github.com/vitest-user/ai-failure-test-repository",
    });
    const aiSpy = vi.spyOn(ai.models, "generateContent").mockRejectedValue({
      response: {
        status: 500,
      },
    });
    const response = await request(app)
      .post("/api/posts/generate")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        repositoryId: repository._id,
      });
    expect(response.status).toBe(503);
    expect(response.body.message).toBe("AI service is temporarily unavailable");
    aiSpy.mockRestore();
  });
  it("shoud throw a timeout Error", async () => {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    const repository = await Repository.create({
      userId: decoded.sub,
      name: "ai-timeout-test-repository",
      owner: "vitest-userTimeout",
      description: "A mock repository for testing AI timeouts",
      stars: 5,
      topics: ["testing", "vitest", "nodejs"],
      languages: {
        JavaScript: 3000,
        HTML: 500,
      },
      readme: "Mock README used for testing AI service timeout handling.",
      files: ["package.json", "src/app.js"],
      url: "https://github.com/vitest-user/ai-timeout-test-repository",
    });
    const aiSpy = vi.spyOn(ai.models, "generateContent").mockRejectedValue(
      Object.assign(new Error("The operation was aborted"), {
        name: "AbortError",
      }),
    );
    const response = await request(app)
      .post("/api/posts/generate")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        repositoryId: repository._id,
      });
    expect(response.status).toBe(504);
    expect(response.body.message).toBe("AI request timed out");
    aiSpy.mockRestore();
  });
  it("should return 500 when Gemini returns invalid JSON", async () => {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    const repository = await Repository.create({
      userId: decoded.sub,
      name: "ai-invalidJson-test-repository",
      owner: "vitest-userinvalidJson",
      description: "A mock repository for testing AI invalidJsons",
      stars: 5,
      topics: ["testing", "vitest", "nodejs"],
      languages: {
        JavaScript: 3000,
        HTML: 500,
      },
      readme: "Mock README used for testing AI service invalidJson handling.",
      files: ["package.json", "src/app.js"],
      url: "https://github.com/vitest-user/ai-invalidJson-test-repository",
    });
    const aiSpy = vi.spyOn(ai.models, "generateContent").mockResolvedValue({
      text: "this is not valid JSON",
    });

    const response = await request(app)
      .post("/api/posts/generate")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        repositoryId: repository._id,
      });
    expect(response.status).toBe(500);
    expect(response.body.status).toBe("error");
  });
});