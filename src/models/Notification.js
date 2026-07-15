import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        senderName: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["task_assigned", "task_updated", "task_deleted", "task_status_updated", "task_comment"],
            default: "task_assigned",
        },
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            default: null,
        },
        taskTitle: {
            type: String,
            default: null,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        readAt: {
            type: Date,
            default: null,
        },
        // TTL index - auto-delete after 2 days
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
            index: { expires: 0 },
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for efficient queries
notificationSchema.index({ receiverId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ receiverId: 1, createdAt: -1 });

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
