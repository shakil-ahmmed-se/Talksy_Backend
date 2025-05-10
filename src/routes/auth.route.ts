import express from "express";
import { login, logout, signup} from "../controllers/auth.controller";

const router = express.Router();

router.post("/auth/signup", signup);

router.post("/auth/login", login)

router.post("/auth/logout", logout)

export default router;