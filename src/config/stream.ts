import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.STREAM_API_KEY ;
const apiSecret = process.env.STREAM_API_SECRAT ;

if (!apiKey || !apiSecret) {
    throw new Error("STREAM_API_KEY and STREAM_API_SECRET must be set");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async(userData : any) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData
    } catch (error) {
        console.error("Error upserting Stream user",error);
    }
}

// todo: do later

export const generateStreamToken = async(userId : string) => {
    try {
        const token = streamClient.createToken(userId);
        return token
    } catch (error) {
        console.error("Error generating Stream token",error);
    }
}