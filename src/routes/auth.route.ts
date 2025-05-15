import express from "express";
import { login, logout, onboard, signup} from "../controllers/auth.controller";
import { protectedRoute } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/auth/signup", signup);

router.post("/auth/login", login)

router.post("/auth/logout", logout);

router.post("/onboarding", protectedRoute, onboard);

router.get("/me", protectedRoute, (req: any, res: any) => {
    res.status(200).json({success: true, user: req.user})
})

export default router;