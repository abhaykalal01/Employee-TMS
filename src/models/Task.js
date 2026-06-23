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
                default: "Pending",
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