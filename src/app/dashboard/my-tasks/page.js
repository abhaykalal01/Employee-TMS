import Link from "next/link";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import { getTasksForUser } from "@/services/taskService";
import { CheckSquare, Inbox } from "lucide-react";
import TaskStatusForm from "./TaskStatusForm";

const c = {
    bg: "var(--app-bg)",
    surface: "var(--app-surface)",
    border: "var(--app-border)",
    text: "var(--app-text)",
    textSecondary: "var(--app-text-secondary)",
    textMuted: "var(--app-text-muted)",
};

export default async function MyTasksPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const tasks = await getTasksForUser(user);
    const isAdmin = user.role === "admin";

    const pending = tasks.filter((t) => t.status === "Pending").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const completed = tasks.filter((t) => t.status === "Completed").length;

    return (
        <div style={{ background: c.bg, minHeight: "100vh", color: c.text }}>
            <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "28px 20px 64px" }}>
                <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: c.textMuted }}>
                        DASHBOARD&nbsp;/&nbsp;<span style={{ color: "#c4b5fd" }}>{isAdmin ? "ALL TASKS" : "MY TASKS"}</span>
                    </div>
                    <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "6px 0 0" }}>
                        {isAdmin ? "All Tasks" : "My Tasks"}
                    </h1>
                    <p style={{ fontSize: "13px", color: c.textSecondary, marginTop: "4px" }}>
                        {tasks.length} total · {pending} pending · {inProgress} in progress · {completed} completed
                    </p>
                </div>

                {isAdmin && (
                    <div style={{ marginBottom: "16px" }}>
                        <Link
                            href="/dashboard/tasks/create"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "7px",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#fff",
                                background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                                borderRadius: "9px",
                                padding: "10px 16px",
                                textDecoration: "none",
                            }}
                        >
                            <CheckSquare size={15} /> Create & Assign Task
                        </Link>
                    </div>
                )}

                <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: "14px", overflow: "hidden" }}>
                    {tasks.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "64px 24px" }}>
                            <div
                                style={{
                                    width: "52px",
                                    height: "52px",
                                    borderRadius: "14px",
                                    background: "rgba(255,255,255,0.05)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 16px",
                                }}
                            >
                                <Inbox size={22} color={c.textMuted} />
                            </div>
                            <p style={{ fontSize: "15px", fontWeight: 600, margin: 0 }}>
                                {isAdmin ? "No tasks in the system" : "No tasks assigned to you"}
                            </p>
                            <p style={{ fontSize: "13px", color: c.textSecondary, marginTop: "6px" }}>
                                {isAdmin
                                    ? "Create a task and assign it to an employee."
                                    : "Your admin will assign tasks to you here."}
                            </p>
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "640px" }}>
                                <thead>
                                    <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                                        {["TASK", ...(isAdmin ? ["ASSIGNEE"] : []), "STATUS", "UPDATE STATUS"].map((h) => (
                                            <th
                                                key={h}
                                                style={{
                                                    textAlign: "left",
                                                    fontSize: "11px",
                                                    fontWeight: 700,
                                                    letterSpacing: "0.06em",
                                                    color: c.textMuted,
                                                    padding: "14px 20px",
                                                }}
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((task) => (
                                        <tr key={task._id} style={{ borderBottom: `1px solid ${c.border}` }}>
                                            <td style={{ padding: "14px 20px", fontSize: "14px", fontWeight: 600 }}>
                                                {task.title}
                                            </td>
                                            {isAdmin && (
                                                <td style={{ padding: "14px 20px", fontSize: "13px", color: c.textSecondary }}>
                                                    {task.assignedTo?.name || "Unassigned"}
                                                </td>
                                            )}
                                            <td style={{ padding: "14px 20px", fontSize: "13px", color: c.textSecondary }}>
                                                {task.status}
                                            </td>
                                            <td style={{ padding: "14px 20px" }}>
                                                <TaskStatusForm
                                                    taskId={task._id}
                                                    currentStatus={task.status}
                                                    canEdit
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
