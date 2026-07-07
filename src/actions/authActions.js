"use server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginUser(prevState, formData) {
    try {
        await connectDB();

        const email = formData.get("email");
        const password = formData.get("password");

        // Find User
        const user = await User.findOne({
            email
        });

        if (!user) {
            return {
                error: "User not found",
                field: "email"
            };
        }

        // Compare Password
        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {
            return {
                error: "Invalid password",
                field: "password"
            };
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
                httpOnly: true,
                sameSite: "lax",
                path: "/",
            }
        );

        cookieStore.set("userId", user._id.toString(), {
            httpOnly: false,
            sameSite: "lax",
            path: "/",
        });

        cookieStore.set("userName", user.name || user.email, {
            httpOnly: false,
            sameSite: "lax",
            path: "/",
        });

        cookieStore.set("userRole", user.role, {
            httpOnly: false,
            sameSite: "lax",
            path: "/",
        });

        redirect("/dashboard");
    } catch (error) {
        // Catch redirect (which throws) and re-throw it
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        
        // Return other errors as validation messages
        return {
            error: error.message || "An error occurred during login",
            field: "general"
        };
    }
}

export async function logoutUser() {

    const cookieStore =
        await cookies();

    cookieStore.delete(
        "token"
    );
    cookieStore.delete("userId");
    cookieStore.delete("userName");
    cookieStore.delete("userRole");

    redirect("/login");

}