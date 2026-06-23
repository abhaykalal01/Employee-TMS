import User from "@/models/User";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {

    try {

        await connectDB();

        const body =
            await request.json();

        const {
            name,
            email,
            password
        } = body;

        const existingUser =
            await User.findOne({
                email
            });

        if (existingUser) {

            return Response.json(
                {
                    message:
                        "User already exists"
                },
                {
                    status: 400
                }
            );

        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        const user =
            await User.create({
                name,
                email,

                password:
                    hashedPassword,

                role:
                    "admin"

            });

        return Response.json(
            user,
            {
                status: 201
            }
        );

    }
    catch (error) {

        return Response.json(
            {
                message:
                    error.message
            },
            {
                status: 500
            }
        );

    }

}