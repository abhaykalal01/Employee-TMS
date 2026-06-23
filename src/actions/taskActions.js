"use server";

import Task from "@/models/Task";
import { connectDB } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTask(
    formData
) {
    try {
        await connectDB();
        const title =
            formData.get("title");

        const status =
            formData.get("status");

        if (!title) {
            throw new Error(
                "Title Required"
            );
        }

        await Task.create({
            title,
            status,
        });
        revalidatePath("/dashboard/tasks");
        redirect("/dashboard/tasks");
        console.log("Task Created");
    } catch (error) {
        console.error("Create task error:", error);
        throw error;
    }
}

export async function deleteTask(formData) {

    try {
        await connectDB();

        const id = formData.get("id");

        await Task.findByIdAndDelete(id);

        // Refresh task list
        revalidatePath("/dashboard/tasks");
    } catch (error) {
        console.error("Delete task error:", error);
        throw error;
    }
}

export async function updateTask(
    formData
) {

    try {
        await connectDB();

        const id =
            formData.get("id");

        const title =
            formData.get("title");

        const status =
            formData.get("status");

        if (!title) {
            throw new Error("Title is required");
        }

        await Task.findByIdAndUpdate(
            id,
            {
                title,
                status
            }
        );

        revalidatePath(
            "/dashboard/tasks"
        );

        redirect(
            "/dashboard/tasks"
        );
    } catch (error) {
        console.error("Update task error:", error);
        throw error;
    }

}