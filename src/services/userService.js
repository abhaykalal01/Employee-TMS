import mongoose from "mongoose";
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

export async function getEmployeeById(id) {

    if (!mongoose.isValidObjectId(id)) {
        return null;
    }

    await connectDB();

    const user = await User.findById(id).select("_id name email role").lean();

    if (!user) {
        return null;
    }

    return {
        ...user,
        _id: user._id.toString(),
        role: (user.role || "employee").toLowerCase(),
    };

}

export async function getEmployees() {

    await connectDB();

    const employees = await User.find({ role: "employee" })
        .select("_id name email role")
        .sort({ name: 1 })
        .lean();

    return employees.map((employee) => ({
        ...employee,
        _id: employee._id.toString(),
    }));

}

export async function getEmployeeCount() {

    await connectDB();

    return User.countDocuments({ role: "employee" });

}