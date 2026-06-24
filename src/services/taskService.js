import Task from "@/models/Task";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

function serializeTask(task) {
    const assignedTo = task.assignedTo;

    return {
        ...task,
        _id: task._id.toString(),
        assignedTo: assignedTo
            ? {
                _id: assignedTo._id?.toString?.() ?? String(assignedTo._id ?? assignedTo),
                name: assignedTo.name ?? null,
                email: assignedTo.email ?? null,
            }
            : null,
    };
}

export async function getTasks() {
    await connectDB();

    const tasks = await Task.find()
        .populate("assignedTo", "name email")
        .lean()
        .select("_id title status assignedTo createdAt updatedAt")
        .sort({ createdAt: -1 });

    return tasks.map(serializeTask);
}

export async function getTasksForUser(user) {
    await connectDB();

    const query =
        user.role === "admin"
            ? {}
            : { assignedTo: user._id };

    const tasks = await Task.find(query)
        .populate("assignedTo", "name email")
        .lean()
        .select("_id title status assignedTo createdAt updatedAt")
        .sort({ createdAt: -1 });

    return tasks.map(serializeTask);
}

export async function getTaskById(id) {
    await connectDB();

    if (!mongoose.isValidObjectId(id)) {
        return null;
    }

    const task = await Task.findById(id)
        .populate("assignedTo", "name email")
        .lean()
        .select("_id title status assignedTo createdAt updatedAt");

    if (!task) {
        return null;
    }

    return serializeTask(task);
}

export async function getTaskStatsForUser(user) {
    const tasks = await getTasksForUser(user);

    return {
        total: tasks.length,
        pending: tasks.filter((t) => t.status === "Pending").length,
        inProgress: tasks.filter((t) => t.status === "In Progress").length,
        completed: tasks.filter((t) => t.status === "Completed").length,
    };
}
