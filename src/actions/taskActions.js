"use server";

import mongoose from "mongoose";
import Task from "@/models/Task";
import { connectDB } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireAuth } from "@/lib/auth";

const VALID_STATUSES = ["Pending", "In Progress", "Completed"];

export async function createTask(formData) {
    try {
        await requireAdmin();
        await connectDB();

        const title = (formData.get("title") || "").toString().trim();
        const status = (formData.get("status") || "Pending").toString();
        const assignedTo = (formData.get("assignedTo") || "").toString().trim();

        if (!title) {
            throw new Error("Title is required.");
        }

        if (!VALID_STATUSES.includes(status)) {
            throw new Error("Invalid status.");
        }

        const taskData = { title, status };

        if (assignedTo) {
            if (!mongoose.isValidObjectId(assignedTo)) {
                throw new Error("Invalid employee selected.");
            }
            taskData.assignedTo = assignedTo;
        }

        await Task.create(taskData);

        revalidatePath("/dashboard/tasks");
        revalidatePath("/dashboard/my-tasks");
        revalidatePath("/dashboard");
        redirect("/dashboard/tasks");
    } catch (error) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        console.error("Create task error:", error);
        throw error;
    }
}

export async function deleteTask(formData) {
    try {
        await requireAdmin();
        await connectDB();

        const id = (formData.get("id") || "").toString();

        await Task.findByIdAndDelete(id);

        revalidatePath("/dashboard/tasks");
        revalidatePath("/dashboard/my-tasks");
        revalidatePath("/dashboard");
    } catch (error) {
        console.error("Delete task error:", error);
        throw error;
    }
}

export async function updateTask(formData) {
    try {
        await requireAdmin();
        await connectDB();

        const id = (formData.get("id") || "").toString();
        const title = (formData.get("title") || "").toString().trim();
        const status = (formData.get("status") || "Pending").toString();
        const assignedTo = (formData.get("assignedTo") || "").toString().trim();

        if (!title) {
            throw new Error("Title is required.");
        }

        if (!VALID_STATUSES.includes(status)) {
            throw new Error("Invalid status.");
        }

        const updateData = { title, status };

        if (assignedTo) {
            if (!mongoose.isValidObjectId(assignedTo)) {
                throw new Error("Invalid employee selected.");
            }
            updateData.assignedTo = assignedTo;
        } else {
            updateData.assignedTo = null;
        }

        await Task.findByIdAndUpdate(id, updateData);

        revalidatePath("/dashboard/tasks");
        revalidatePath("/dashboard/my-tasks");
        revalidatePath("/dashboard");

        redirect("/dashboard/tasks");
    } catch (error) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        console.error("Update task error:", error);
        throw error;
    }
}

export async function updateTaskStatus(formData) {
    try {
        const user = await requireAuth();
        await connectDB();

        const id = (formData.get("id") || "").toString();
        const status = (formData.get("status") || "").toString();

        if (!id || !mongoose.isValidObjectId(id)) {
            throw new Error("Invalid task id.");
        }

        if (!VALID_STATUSES.includes(status)) {
            throw new Error("Invalid status.");
        }

        const task = await Task.findById(id);

        if (!task) {
            throw new Error("Task not found.");
        }

        if (user.role !== "admin") {
            if (!task.assignedTo || task.assignedTo.toString() !== user._id) {
                throw new Error("You can only update tasks assigned to you.");
            }
        }

        await Task.findByIdAndUpdate(id, { status });

        revalidatePath("/dashboard/my-tasks");
        revalidatePath("/dashboard/tasks");
        revalidatePath("/dashboard");
    } catch (error) {
        console.error("Update task status error:", error);
        throw error;
    }
}
