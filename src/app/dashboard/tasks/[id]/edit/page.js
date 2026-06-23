import { getTaskById } from "@/services/taskService";
import { updateTask } from "@/actions/taskActions";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";

export default async function EditPage({ params }) {
    const { id } = await params;

    const task = await getTaskById(id);
    if (!task || !task._id) {
        return (
            <div className="p-6">
                <h2 className="text-xl font-semibold text-white">Task not found</h2>
                <p className="mt-2 text-slate-400">No task found for id: {id}</p>
                <Link href="/dashboard/tasks" className="text-blue-400 mt-4 inline-block">Back to tasks</Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-xl">
            <div className="mb-8 rounded-3xl bg-slate-900/80 p-6 shadow-lg border border-slate-800">
                <h1 className="text-3xl font-bold text-white mb-2">Edit Task</h1>
                <p className="text-slate-400">Update the task details and status to keep the board current.</p>
            </div>
            <form action={updateTask} className="space-y-6 rounded-3xl bg-slate-900/80 p-8 shadow-xl border border-slate-800">

                <input
                    type="hidden"
                    name="id"
                    value={task._id?.toString() ?? ""}
                />

                <label className="block text-slate-200 font-medium">
                    Task title
                    <input
                        name="title"
                        defaultValue={task.title}
                        className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-blue-500 focus:outline-none"
                        required
                    />
                </label>

                <label className="block text-slate-200 font-medium">
                    Status
                    <select
                        name="status"
                        defaultValue={task.status}
                        className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-blue-500 focus:outline-none"
                    >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                    </select>
                </label>

                <SubmitButton text="Update Task" loadingText="Updating..." />

            </form>
        </div>
    );
}