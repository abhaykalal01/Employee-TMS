import mongoose from "mongoose"; 

const taskSchema =
    new mongoose.Schema(
        {
            title: {
                type: String,
                required: true,
            },

            status: {
                type: String,
                enum: ["Pending", "In Progress", "Completed"],
                default: "Pending",
            },

            assignedTo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null,
            },
        },
        {
            timestamps: true,
        }
    );

export default
    mongoose.models.Task ||
    mongoose.model(
        "Task",
        taskSchema
    );