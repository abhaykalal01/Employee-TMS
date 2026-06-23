import Link from "next/link";

const statusStyles = {
    Completed: "bg-emerald-500/10 text-emerald-200",
    "In Progress": "bg-blue-500/10 text-blue-200",
    Pending: "bg-amber-500/10 text-amber-200",
};

export default function TaskCard({ task }) {
    return (
        <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{task.status === "Completed" ? "✅" : task.status === "In Progress" ? "⏳" : "📌"}</span>
                        <h2 className="text-xl font-semibold text-white">{task.title}</h2>
                    </div>
                    <p className="text-sm text-slate-400">{task.description ?? "No description available."}</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                        <span className={`rounded-full px-3 py-1 font-semibold ${statusStyles[task.status] ?? statusStyles.Pending}`}>{task.status}</span>
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-400">{task.priority ?? "Medium"}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href={`/dashboard/tasks/${task._id}/edit`} className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-blue-500 hover:bg-slate-900">
                        Edit
                    </Link>
                </div>
            </div>
        </article>
    );
}
