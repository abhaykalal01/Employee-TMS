import TaskComment from "@/models/TaskComment";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

export async function getTaskComments(taskId) {
    await connectDB();

    if (!mongoose.isValidObjectId(taskId)) {
        return [];
    }

    const comments = await TaskComment.find({ taskId })
        .sort({ createdAt: 1 }) // Oldest first for chat
        .lean();

    return comments.map((comment) => ({
        ...comment,
        _id: comment._id.toString(),
        taskId: comment.taskId.toString(),
        userId: comment.userId.toString(),
        readBy: comment.readBy?.map((r) => ({
            userId: r.userId.toString(),
            readAt: r.readAt,
        })) || [],
    }));
}

export async function createTaskComment({ taskId, userId, userName, userRole, message }) {
    await connectDB();

    if (!mongoose.isValidObjectId(taskId) || !mongoose.isValidObjectId(userId)) {
        throw new Error("Invalid IDs provided");
    }

    const comment = await TaskComment.create({
        taskId,
        userId,
        userName,
        userRole,
        message,
        readBy: [{ userId, readAt: new Date() }], // Sender marks as read
    });

    return {
        ...comment.toObject(),
        _id: comment._id.toString(),
        taskId: comment.taskId.toString(),
        userId: comment.userId.toString(),
        readBy: comment.readBy.map((r) => ({
            userId: r.userId.toString(),
            readAt: r.readAt,
        })),
    };
}

export async function markCommentAsRead({ commentId, userId }) {
    await connectDB();

    if (!mongoose.isValidObjectId(commentId) || !mongoose.isValidObjectId(userId)) {
        return null;
    }

    const comment = await TaskComment.findById(commentId);

    if (!comment) {
        return null;
    }

    // Check if already marked as read by this user
    const alreadyRead = comment.readBy.some((r) => r.userId.toString() === userId);

    if (!alreadyRead) {
        comment.readBy.push({ userId, readAt: new Date() });
        await comment.save();
    }

    return {
        ...comment.toObject(),
        _id: comment._id.toString(),
        taskId: comment.taskId.toString(),
        userId: comment.userId.toString(),
        readBy: comment.readBy.map((r) => ({
            userId: r.userId.toString(),
            readAt: r.readAt,
        })),
    };
}

export async function deleteTaskComment({ commentId, userId, userRole }) {
    await connectDB();

    if (!mongoose.isValidObjectId(commentId) || !mongoose.isValidObjectId(userId)) {
        throw new Error("Invalid IDs provided");
    }

    const comment = await TaskComment.findById(commentId);

    if (!comment) {
        throw new Error("Comment not found");
    }

    // Admin can delete any comment, users can only delete their own
    if (userRole !== "admin" && comment.userId.toString() !== userId) {
        throw new Error("Unauthorized to delete this comment");
    }

    await TaskComment.deleteOne({ _id: commentId });

    return { success: true, commentId: commentId.toString() };
}
