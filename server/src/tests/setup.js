import dotenv from "dotenv"
import mongoose from "mongoose"
 import {  expect, beforeAll,  afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
// import { beforeAll, afterAll } from "vitest"
import { registerTestUser } from "./helper.js"
import User from "../models/User.js";
import Session from "../models/Session.js";
import Post from "../models/Post.js";
import Repository from "../models/Repository.js";


dotenv.config()

export const test_connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.TEST_MONGO_URI)
        console.log(`✅ MongoDB Connected: ${connect.connection.host}`)
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

export let accessToken 
let testUserId;
export let testUserIds = [];

beforeAll(async()=>{
    await test_connectDB()
    const email = `integration-${Date.now()}@example.com`;
      await registerTestUser("Integration Test", email, testUserIds);
    
      const loginResponse = await request(app).post("/api/auth/login").send({
        email,
        password: "Test@12345",
      });
    
      console.log(loginResponse.body);
      accessToken = loginResponse.body.accessToken;
      const profileResponse = await request(app)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${accessToken}`);
      testUserId = profileResponse.body.user._id;
      expect(accessToken).toBeDefined();
})

afterAll(async()=>{
    await Repository.deleteMany({ userId: testUserId });
      await User.findByIdAndDelete(testUserId);
      await Session.deleteMany({
        userId: { $in: [...testUserIds, testUserId] },
      });
      await User.deleteMany({
        _id: { $in: testUserIds },
      });
      await Post.deleteMany({
        userId: { $in: [...testUserIds, testUserId] },
      });
    await mongoose.connection.close()
})
