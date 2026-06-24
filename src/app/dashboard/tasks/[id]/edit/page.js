import { getTaskById } from "@/services/taskService";
import { updateTask } from "@/actions/taskActions";
import { getEmployees } from "@/services/userService";
import { getCurrentUser } from "@/lib/getCurrentUser";
import Link from "next/link";
import { redirect } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";

export default async function EditPage({ params }) {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
        redirect("/dashboard");
    }

    const { id } = await params;
    const [task, employees] = await Promise.all([
        getTaskById(id),
        getEmployees(),
    ]);

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
                <p className="text-slate-400">Update task details, assignment, and status.</p>
            </div>
            <form action={updateTask} className="space-y-6 rounded-3xl bg-slate-900/80 p-8 shadow-xl border border-slate-800">
                <input type="hidden" name="id" value={task._id} />

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
                    Assign to employee
                    <select
                        name="assignedTo"
                        defaultValue={task.assignedTo?._id || ""}
                        className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">Unassigned</option>
                        {employees.map((employee) => (
                            <option key={employee._id} value={employee._id}>
                                {employee.name} ({employee.email})
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block text-slate-200 font-medium">
                    Status
                    <select
                        name="status"
                        defaultValue={task.status}
                        className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-blue-500 focus:outline-none"
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </label>

                <SubmitButton text="Update Task" loadingText="Updating..." />
            </form>
        </div>
    );
}
