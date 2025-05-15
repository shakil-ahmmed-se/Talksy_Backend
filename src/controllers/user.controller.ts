import { Request, Response } from "express";
import User from "../models/User";


export const recommendedUsers = async (req: Request, res: Response) => {
    return res.status(200).json({message: "Hello Users"})
    
}

export const getMyFriends = async (req: any, res: any) =>{

}