import {  expect } from "vitest";
import request from "supertest";
import app from "../app";



export const registerTestUser=async(name, email, testUserIds)=> {
  const response = await request(app).post("/api/auth/register").send({
    name,
    email,
    password: "Test@12345",
  });
  expect(response.status).toBe(201);
  testUserIds.push(response.body.user._id);
  return response;
}