import express from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import { getMyFriends, recommendedUsers } from "../controllers/user.controller";


const router = express.Router();

// apply middleware to all routes
router.use(protectedRoute)

router.get("/", recommendedUsers);

router.get("/friends", getMyFriends);


export default router;