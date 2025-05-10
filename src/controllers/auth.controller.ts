import { Request, RequestHandler, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

export const signup = async (req : Request , res: any)=> {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({
          message: "Email already exists, Please use a different email",
        });
    }

    const idx = Math.floor(Math.random() * 100) + 1; // Generate a random number between 1 and 100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    // crate newUser

    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePic: randomAvatar,
    });

    // TODO: CREATE USER IN STREAM AS WELL

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("jwt", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.log("Error in singup", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const login = async(req: Request, res: any) => {
  const {email, password} = req.body;

  try {
    if (!email || !password){
        return res.status(400).json({message: "All field are required"});

    }
    const user = await User.findOne({email});
    if(!user) {
        return res.status(401).json({message: "Invalid email or password"})
    }
    const isPassowrdCorrect = await user.matchPassword(password);
    if (!isPassowrdCorrect) {
        return res.status(401).json({message: "Invalid email or password"})
    }
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY!, {
        expiresIn: "1d"
    })
    res.cookie("jwt", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    })
    res.status(200).json({
        success: true,
        user
    })
  } catch (error) {  
    console.log
  }
}

export const logout =(req: Request, res: Response) => {
  res.send("Logout page");
}
