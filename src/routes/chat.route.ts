import express from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import { get } from "http";
import { getStreamToken } from "../controllers/chat.controller";


const router = express.Router();

router.get("/token", protectedRoute, getStreamToken);

export default router;