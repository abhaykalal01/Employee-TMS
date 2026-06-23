import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function getUsers() {

    await connectDB();

    const users =
        await User.find();

    return users.map(
        user => ({
            ...user.toObject(),

            _id:
                user._id.toString()
        })
    );

}