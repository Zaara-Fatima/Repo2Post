import { generateAIResponse } from "../clients/ai.client.js";
import { createPost } from "../repositories/post.repository.js";
import { findRepositoryById } from "../repositories/repository.repository.js";
import AppError from "../utils/AppError.js";
import { buildPostPrompt } from "../utils/buildPostPrompt.js";
import { generatedPostSchema } from "../validators/post.validator.js";

export const generatePost = async (repositoryId, userId) => {
  const repository = await findRepositoryById(repositoryId, userId);
  if (!repository) {
    throw new AppError("REPO NOT FOUND", 404);
  }

  const prompt = buildPostPrompt(repository);
  const response = await generateAIResponse(prompt);
  console.log("AI RESPONSE:", response);

  if (!response || typeof response !== "string") {
    throw new AppError("AI service failed to generate a valid text response", 500);
  }

const cleanedResponse = response
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

let parsedResponse;
  try {
    parsedResponse = JSON.parse(cleanedResponse);
  } catch (err) {
    console.error("Failed to parse JSON from AI response:", cleanedResponse);
    throw new AppError("Invalid JSON structure returned by AI", 500);
  }

  const validatePost = generatedPostSchema.parse(parsedResponse);

  // return validatePost
  const post = await createPost({
    userId,
    repositoryId,
    hook: validatePost.hook,
    content: validatePost.content,
    hashtags: validatePost.hashtags,
    cta: validatePost.cta,
  });

  return post;
};
