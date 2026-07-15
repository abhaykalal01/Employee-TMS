import mongoose from "mongoose";

const taskCommentSchema = new mongoose.Schema(
    {
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        userRole: {
            type: String,
            enum: ["admin", "employee"],
            required: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        readBy: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                readAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
taskCommentSchema.index({ taskId: 1, createdAt: -1 });
taskCommentSchema.index({ userId: 1 });

export default mongoose.models.TaskComment || mongoose.model("TaskComment", taskCommentSchema);
