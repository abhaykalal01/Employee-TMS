import Task from "@/models/Task";
import { connectDB } from "@/lib/db";

export async function getTasks() {

    await connectDB();

    const tasks = await Task.find();

    return tasks.map(task => ({
        ...task.toObject(),
        _id: task._id.toString(),
    }));
}
export async function POST(request) {

    await connectDB();

    const body = await request.json();

    const task = await Task.create({
        title: body.title,
        status: body.status
    });

    return Response.json(task);
}