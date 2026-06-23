"use server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginUser(formData) {

    await connectDB();

    const email = formData.get("email");
    const password = formData.get("password");

    // Find User
    const user = await User.findOne({
        email
    });

    if (!user) {
        throw new Error(
            "User not found"
        );
    }

    // Compare Password
    const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isMatch) {
        throw new Error(
            "Invalid Password"
        );
    }

    // Generate Token
    const token = jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    // Save Cookie
    const cookieStore =
        await cookies();

    cookieStore.set(
        "token",
        token,
        {
            httpOnly: true
        }
    );

    redirect("/dashboard");
}

export async function logoutUser() {

    const cookieStore =
        await cookies();

    cookieStore.delete(
        "token"
    );

    redirect("/login");

}