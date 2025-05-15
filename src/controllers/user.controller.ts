import { Request, Response } from "express";
import User from "../models/User";
import FriendRequest from "../models/FriendsRequest";

export const getRecommendedUsers = async (req: any, res: any) => {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUser = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { $id: { $nin: currentUser.friends } },
        { isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUser);
  } catch (error) {
    console.log(" Error getting recommended users", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyFriends = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );
    res.status(200).json(user?.friends);
  } catch (error) {
    console.log("Error getting my friends", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendFriendRequest = async (req: any, res: any) => {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);

    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // check if user already exist friends
    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }

    // check if user already sent a friend request
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You have already sent a friend request to this user",
      });
    }

    // create a new friend request
    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(200).json(friendRequest);
  } catch (error) {
    console.log("Error sending friend request", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptFriendRequest = async (req: any, res: any) => {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    // verify  current user it the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({
          message: " You are not authorized to accept this friend request",
        });
    }

    friendRequest.status === "accepted";
    await friendRequest.save();

    // add earch other user to each other friends

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error accepting friend request", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFriendsRequest = async (req: any, res: any) => {
  try {
    const incommingsReq = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    const acceptedReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic ");

    res.status(200).json({
      incommingsReq,
      acceptedReqs,
    });
  } catch (error) {
    console.log("Error getting friends request", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOutgoingFriendRequests = async (req: any, res: any) => {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error getting outgoing friend requests", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
