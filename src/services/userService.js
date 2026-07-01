import mongoose from "mongoose";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function getUsers() {
    await connectDB();

    const users = await User.find();

    return users.map((user) => ({
        ...user.toObject(),
        _id: user._id.toString(),
    }));
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

export async function getUsersPaginated({ page = 1, limit = 10, search = "" } = {}) {
    await connectDB();

    const normalizedPage = Math.max(1, Number(page) || 1);
    const normalizedLimit = Math.max(1, Number(limit) || 10);
    const normalizedSearch = search.toString().trim();

    const query = normalizedSearch
        ? {
            $or: [
                { name: { $regex: normalizedSearch, $options: "i" } },
                { email: { $regex: normalizedSearch, $options: "i" } },
            ],
        }
        : {};

    const skip = (normalizedPage - 1) * normalizedLimit;

    const [users, total] = await Promise.all([
        User.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(normalizedLimit)
            .lean(),
        User.countDocuments(query),
    ]);

    return {
        users: users.map((user) => ({
            ...user,
            _id: user._id.toString(),
        })),
        total,
        totalPages: Math.max(1, Math.ceil(total / normalizedLimit)),
        currentPage: normalizedPage,
        limit: normalizedLimit,
        search: normalizedSearch,
    };
}

export async function getUserPaginated(args) {
    return getUsersPaginated(args);
}