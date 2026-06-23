import User from "@/models/User";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {

    try {

        await connectDB();

        const body =
            await request.json();

        const {
            email,
            password
        } = body;

        const existingUser =
            await User.findOne({
                email
            });

        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
            role: "admin",
        });

        return NextResponse.json(
            {
                _id: user._id.toString(),
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json({ message: error?.message ?? "Internal Server Error" }, { status: 500 });
    }
}
