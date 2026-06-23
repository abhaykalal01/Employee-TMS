import Task from "@/models/Task";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

export async function getTasks() {
    await connectDB();

    const tasks = await Task.find().lean().select("_id title status createdAt updatedAt");

    return tasks.map((task) => ({
        ...task,
        _id: task._id.toString(),
    }));
}

export async function getTaskById(id) {

    await connectDB();

    if (!mongoose.isValidObjectId(id)) {
        return null;
    }

    const task = await Task.findById(id).lean().select("_id title status createdAt updatedAt");

    if (!task) {
        return null;
    }

    return {
        ...task,
        _id: task._id.toString(),
    };
}