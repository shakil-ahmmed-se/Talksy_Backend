import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";
import { NextFunction, Request, Response } from "express";

export const protectedRoute = async (req :any, res: any, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;

        if (!token){
            return res.status(401).json({message: "Unauthorized - No token provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!)

        if(!decoded){
            return res.status(401).json({message: "Unauthorized - Invalid token"})
        }

        const user = await User.findById((decoded as JwtPayload).userId).select("-password")
        
        if(!user){
            return res.status(401).json({message: "Unauthorized - User not found"})
        }

        req.user = user;
        next();

    } catch (error : any) {
        console.log("Error processing protected route",error);
        return res.status(500).json({message: "Internal server error"})
    }
}