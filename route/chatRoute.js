import express from "express";
import { chatWithAI } from "../controller/chatController.js";
import authenToken from "../utils/authMiddleware.js";

const chatRouter = express.Router();

// Every chatbot request requires a valid login token.
chatRouter.post("/api/chat", authenToken, chatWithAI);

export default chatRouter;