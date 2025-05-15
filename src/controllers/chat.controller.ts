import { generateStreamToken } from "../config/stream";

export const getStreamToken = async (req: any, res: any) => {
    try {
        const token = await generateStreamToken(req.user.id);
        res.status(200).json(token);
    } catch (error) {
        console.log("Error getting stream token", error);
        res.status(500).json({ message: "Internal server error" });
    }   
}