import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getTaskComments, createTaskComment, markCommentAsRead, deleteTaskComment } from "@/services/taskCommentService";
import { getTaskById } from "@/services/taskService";
import { emitTaskComment, emitCommentDeleted, emitMessageRead } from "@/lib/socket";
import { createNotification, emitNotification } from "@/lib/notifications";

export async function GET(request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const taskId = searchParams.get("taskId");

        if (!taskId) {
            return NextResponse.json({ error: "Task ID required" }, { status: 400 });
        }

        // Verify user has access to this task
        const task = await getTaskById(taskId);

        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        // Only admin or assigned employee can view comments
        if (user.role !== "admin" && task.assignedTo?._id !== user._id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const comments = await getTaskComments(taskId);

        return NextResponse.json({ comments });
    } catch (error) {
        console.error("GET /api/task-comments error:", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { taskId, message, action, commentId } = body;

        // Handle different actions
        if (action === "mark-read" && commentId) {
            const updatedComment = await markCommentAsRead({
                commentId,
                userId: user._id,
            });

            if (updatedComment) {
                emitMessageRead({
                    taskId,
                    commentId,
                    userId: user._id,
                });
            }

            return NextResponse.json({ success: true, comment: updatedComment });
        }

        if (action === "delete" && commentId) {
            const result = await deleteTaskComment({
                commentId,
                userId: user._id,
                userRole: user.role,
            });

            emitCommentDeleted({
                taskId,
                commentId,
            });

            return NextResponse.json(result);
        }

        // Default: Create new comment
        if (!taskId || !message) {
            return NextResponse.json({ error: "Task ID and message required" }, { status: 400 });
        }

        // Verify user has access to this task
        const task = await getTaskById(taskId);

        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        // Only admin or assigned employee can comment
        if (user.role !== "admin" && task.assignedTo?._id !== user._id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const comment = await createTaskComment({
            taskId,
            userId: user._id,
            userName: user.name,
            userRole: user.role,
            message: message.trim(),
        });

        // Emit real-time comment to task room
        emitTaskComment({
            taskId,
            comment,
        });

        // Send notification to other party
        const recipientId = user.role === "admin" ? task.assignedTo?._id : task.assignedTo?._id;

        if (recipientId && recipientId !== user._id) {
            const notification = await createNotification({
                senderId: user._id,
                receiverId: recipientId,
                senderName: user.name,
                message: `New comment on task: ${task.title}`,
                type: "task_comment",
                taskId: task._id,
                taskTitle: task.title,
            });

            if (notification) {
                emitNotification({
                    userId: recipientId,
                    notification: {
                        ...notification.toObject(),
                        _id: notification._id.toString(),
                        senderId: notification.senderId.toString(),
                        receiverId: notification.receiverId.toString(),
                        taskId: notification.taskId?.toString() || null,
                    },
                });
            }
        }

        return NextResponse.json({ success: true, comment });
    } catch (error) {
        console.error("POST /api/task-comments error:", error);
        return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
    }
}
