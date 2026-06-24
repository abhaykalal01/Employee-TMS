import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "./db";

export async function getCurrentUser() {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return null;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return null;
        }

        return {
            ...user.toObject(),
            _id: user._id.toString(),
            role: user.role || "employee",
        };
    } catch {
        return null;
    }
}
