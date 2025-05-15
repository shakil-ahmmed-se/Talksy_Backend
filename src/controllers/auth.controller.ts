import { Request, RequestHandler, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../config/stream";

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

   try {
    await upsertStreamUser({
      id: newUser._id,
      name: newUser.fullName,
      image: newUser.profilePic
    })
    console.log(`Stream user created ${newUser.fullName}`);
   } catch (error: any) {
    console.error("Error creating Stream user",error);
    
   }

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
    const isPasswordCorrect = await (user as any).matchPassword(password);
    if (!isPasswordCorrect) {
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
    console.log("Error login in controller", error);
    res.status(500).json({message: "Internal Server Error"})
  }
}

export const logout =(req: Request, res: Response) => {
  res.clearCookie("jwt");
  res.status(200).json({success: true, message: "Logout successful"})
}


export const onboard = async (req: any, res: any) => {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, locations } = req.body;

    if ( !fullName || !bio || !nativeLanguage || !learningLanguage || !locations) {
      return res.status(400).json({
        message: "All field are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !locations && "locations"
        ].filter(Boolean)
      })
    }

    const updatedUser = await User.findByIdAndUpdate(userId, {
      ...req.body,
      isOnboarded: true,
    }, {new: true})

    
    if(!updatedUser) return res.status(404).json({message: "User not found"});

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || ''        
      })
      console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`)
    } catch (error) {
      console.log(`Error updating stream onboarding`, error)
    }
    res.status(200).json({success: true, user: updatedUser})

  } catch (error: any) {
    console.log("Onboarding error", error);
    res.status(500).json({message: "Internal Server Error"});
  }
}