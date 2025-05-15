import express from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import {
  acceptFriendRequest,
  getFriendsRequest,
  getMyFriends,
  getOutgoingFriendRequests,
  getRecommendedUsers,
  sendFriendRequest,
} from "../controllers/user.controller";

const router = express.Router();

// apply middleware to all routes
router.use(protectedRoute);

router.get("/", getRecommendedUsers);

router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);

router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/freiend-request", getFriendsRequest);

router.get("/outgoing-friend-requests", getOutgoingFriendRequests);

export default router;
