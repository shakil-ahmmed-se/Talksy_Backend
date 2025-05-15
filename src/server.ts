import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route"
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4051

app.get("/", (req, res) =>{
    res.send("Hello world")
})


app.use(express.json())
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
    connectDB();
})