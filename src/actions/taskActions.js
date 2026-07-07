"use server";

import mongoose from "mongoose";
import Task from "@/models/Task";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { createNotification, emitNotification } from "@/lib/notifications";
import { queueEmail } from "@/lib/mail";
import { taskAssignedEmailTemplate, taskStatusChangedEmailTemplate } from "@/lib/emailTemplates";

const VALID_STATUSES = ["Pending", "In Progress", "Completed"];

async function notifyRecipients({ actor, recipients, message, type }) {
    for (const recipient of recipients) {
        if (!recipient?.userId || recipient.userId === actor?._id) {
            continue;
        }

        const notification = await createNotification({
            senderId: actor._id,
            receiverId: recipient.userId,
            senderName: actor.name || (actor.role === "admin" ? "Admin" : "Employee"),
            message,
            type,
        });

        if (notification) {
            const payload = notification.toObject();
            payload._id = notification._id.toString();
            payload.senderId = notification.senderId.toString();
            payload.receiverId = notification.receiverId.toString();
            emitNotification({ userId: recipient.userId, notification: payload });
        }
    }
}

export async function createTask(formData) {
    try {
        const actor = await requireAdmin();
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

        const task = await Task.create(taskData);

        if (task.assignedTo) {
            await notifyRecipients({
                actor,
                recipients: [{ userId: task.assignedTo.toString() }],
                message: `${actor.name || "Admin"} assigned you a new task: ${task.title}`,
                type: "task_assigned",
            });

            const employee = await User.findById(task.assignedTo);
            if (employee && employee.email) {
                queueEmail({
                    to: employee.email,
                    ...taskAssignedEmailTemplate({
                        employeeName: employee.name,
                        taskTitle: task.title,
                        creatorName: actor.name || "Admin",
                    }),
                });
            }
        }

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
        const actor = await requireAdmin();
        await connectDB();

        const id = (formData.get("id") || "").toString();
        const task = await Task.findById(id);

        await Task.findByIdAndDelete(id);

        if (task?.assignedTo) {
            await notifyRecipients({
                actor,
                recipients: [{ userId: task.assignedTo.toString() }],
                message: `${actor.name || "Admin"} deleted task: ${task.title}`,
                type: "task_deleted",
            });
        }

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
        const actor = await requireAdmin();
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

        const previousTask = await Task.findById(id);
        const task = await Task.findByIdAndUpdate(id, updateData, { new: true });

        if (task?.assignedTo) {
            await notifyRecipients({
                actor,
                recipients: [{ userId: task.assignedTo.toString() }],
                message: `${actor.name || "Admin"} updated task: ${task.title}`,
                type: "task_updated",
            });

            if (task.assignedTo.toString() !== previousTask?.assignedTo?.toString()) {
                const employee = await User.findById(task.assignedTo);
                if (employee && employee.email) {
                    queueEmail({
                        to: employee.email,
                        ...taskAssignedEmailTemplate({
                            employeeName: employee.name,
                            taskTitle: task.title,
                            creatorName: actor.name || "Admin",
                        }),
                    });
                }
            } else if (previousTask && previousTask.status !== status) {
                const employee = await User.findById(task.assignedTo);
                if (employee && employee.email) {
                    queueEmail({
                        to: employee.email,
                        ...taskStatusChangedEmailTemplate({
                            recipientName: employee.name,
                            taskTitle: task.title,
                            oldStatus: previousTask.status,
                            newStatus: status,
                            actorName: actor.name || "Admin",
                        }),
                    });
                }
            }
        } else if (previousTask?.assignedTo && !task?.assignedTo) {
            await notifyRecipients({
                actor,
                recipients: [{ userId: previousTask.assignedTo.toString() }],
                message: `${actor.name || "Admin"} removed you from task: ${task?.title || "a task"}`,
                type: "task_updated",
            });
        }

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

        const updatedTask = await Task.findByIdAndUpdate(id, { status }, { new: true });

        if (user.role === "admin" && updatedTask?.assignedTo) {
            await notifyRecipients({
                actor: user,
                recipients: [{ userId: updatedTask.assignedTo.toString() }],
                message: `${user.name || "Admin"} changed task status to ${status}: ${updatedTask.title}`,
                type: "task_status_updated",
            });
        }

        if (user.role !== "admin") {
            const admins = await mongoose.model("User").find({ role: "admin" }).select("_id");
            await notifyRecipients({
                actor: user,
                recipients: admins.map((admin) => ({ userId: admin._id.toString() })),
                message: `${user.name || "Employee"} marked task '${updatedTask.title}' as ${status}.`,
                type: "task_status_updated",
            });
        }

        if (task.status !== status) {
            if (user.role === "admin" && updatedTask?.assignedTo) {
                const employee = await User.findById(updatedTask.assignedTo);
                if (employee && employee.email) {
                    queueEmail({
                        to: employee.email,
                        ...taskStatusChangedEmailTemplate({
                            recipientName: employee.name,
                            taskTitle: updatedTask.title,
                            oldStatus: task.status,
                            newStatus: status,
                            actorName: user.name || "Admin",
                        }),
                    });
                }
            } else if (user.role !== "admin") {
                const admins = await User.find({ role: "admin" }).select("name email");
                for (const admin of admins) {
                    if (admin.email) {
                        queueEmail({
                            to: admin.email,
                            ...taskStatusChangedEmailTemplate({
                                recipientName: admin.name,
                                taskTitle: updatedTask.title,
                                oldStatus: task.status,
                                newStatus: status,
                                actorName: user.name || "Employee",
                            }),
                        });
                    }
                }
            }
        }

        revalidatePath("/dashboard/my-tasks");
        revalidatePath("/dashboard/tasks");
        revalidatePath("/dashboard");
    } catch (error) {
        console.error("Update task status error:", error);
        throw error;
    }
}
