import Link from "next/link";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import { getTasksForUserPaginated, getTaskStatsForUser } from "@/services/taskService";
import { CheckSquare, Inbox, Filter } from "lucide-react";
import TaskStatusForm from "./TaskStatusForm";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";

const c = {
    bg: "var(--app-bg)",
    surface: "var(--app-surface)",
    border: "var(--app-border)",
    text: "var(--app-text)",
    textSecondary: "var(--app-text-secondary)",
    textMuted: "var(--app-text-muted)",
    accentFrom: "var(--accent-from)",
    accentTo: "var(--accent-to)",
};

const statusColors = {
    Pending: { fg: "#fcd34d", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
    "In Progress": { fg: "#60a5fa", bg: "rgba(37,99,235,0.12)", border: "rgba(37,99,235,0.3)" },
    Completed: { fg: "#6ee7b7", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" },
};

export default async function MyTasksPage({ searchParams }) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams?.page || 1);
    const statusFilter = (resolvedSearchParams?.status || "").toString().trim();

    const { tasks, total, totalPages, currentPage } = await getTasksForUserPaginated({
        user,
        page,
        limit: 8,
        statusFilter,
    });

    const stats = await getTaskStatsForUser(user);
    const isAdmin = user.role === "admin";

    return (
        <div style={{ background: c.bg, minHeight: "100vh", color: c.text }}>
            <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "28px 20px 64px" }}>
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        gap: "16px",
                        marginBottom: "20px",
                    }}
                >
                    <div>
                        <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: c.textMuted }}>
                            DASHBOARD&nbsp;/&nbsp;<span style={{ color: "#c4b5fd" }}>{isAdmin ? "ALL TASKS" : "MY TASKS"}</span>
                        </div>
                        <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "6px 0 0" }}>
                            {isAdmin ? "All Tasks" : "My Tasks"}
                        </h1>
                        <p style={{ fontSize: "13px", color: c.textSecondary, marginTop: "4px" }}>
                            {statusFilter
                                ? `${total} ${statusFilter.toLowerCase()} task${total === 1 ? "" : "s"}`
                                : `${stats.total} total · ${stats.pending} pending · ${stats.inProgress} in progress · ${stats.completed} completed`}
                        </p>
                    </div>

                    {isAdmin && (
                        <Link
                            href="/dashboard/tasks/create"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "7px",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#fff",
                                background: `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})`,
                                borderRadius: "9px",
                                padding: "10px 16px",
                                textDecoration: "none",
                                boxShadow: "0 8px 20px -8px rgba(124,58,237,0.5)",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <CheckSquare size={15} /> Create Task
                        </Link>
                    )}
                </div>

                {/* Status Filter */}
                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "20px",
                        flexWrap: "wrap",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            color: c.textMuted,
                        }}
                    >
                        <Filter size={12} /> FILTER:
                    </div>
                    {["", "Pending", "In Progress", "Completed"].map((status) => {
                        const isActive = statusFilter === status;
                        const label = status || "All";
                        return (
                            <Link
                                key={label}
                                href={buildFilterHref(status)}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    color: isActive ? "#fff" : c.text,
                                    background: isActive
                                        ? `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})`
                                        : "rgba(255,255,255,0.05)",
                                    border: `1px solid ${isActive ? "rgba(124,58,237,0.4)" : c.border}`,
                                    borderRadius: "8px",
                                    padding: "6px 12px",
                                    textDecoration: "none",
                                    transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                    }
                                }}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </div>

                {/* Tasks Table/List */}
                <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: "14px", overflow: "hidden" }}>
                    {tasks.length === 0 ? (
                        <EmptyState
                            icon={Inbox}
                            title={
                                statusFilter
                                    ? `No ${statusFilter.toLowerCase()} tasks`
                                    : isAdmin
                                    ? "No tasks in the system"
                                    : "No tasks assigned to you"
                            }
                            description={
                                statusFilter
                                    ? "Try selecting a different filter to see more tasks."
                                    : isAdmin
                                    ? "Create a task and assign it to an employee to get started."
                                    : "Your admin will assign tasks to you here."
                            }
                            action={
                                isAdmin && !statusFilter
                                    ? {
                                          label: "Create Task",
                                          href: "/dashboard/tasks/create",
                                          icon: CheckSquare,
                                      }
                                    : undefined
                            }
                        />
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="tasks-table-wrap" style={{ overflowX: "auto" }}>
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
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map((task) => {
                                            const statusStyle = statusColors[task.status] || statusColors.Pending;
                                            return (
                                                <tr key={task._id} style={{ borderBottom: `1px solid ${c.border}` }}>
                                                    <td style={{ padding: "14px 20px" }}>
                                                        <Link
                                                            href={`/dashboard/tasks/${task._id}`}
                                                            style={{
                                                                fontSize: "14px",
                                                                fontWeight: 600,
                                                                color: c.text,
                                                                textDecoration: "none",
                                                                transition: "color 0.2s ease",
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.color = "#a78bfa";
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.color = c.text;
                                                            }}
                                                        >
                                                            {task.title}
                                                        </Link>
                                                    </td>
                                                    {isAdmin && (
                                                        <td style={{ padding: "14px 20px", fontSize: "13px", color: c.textSecondary }}>
                                                            {task.assignedTo?.name || "Unassigned"}
                                                        </td>
                                                    )}
                                                    <td style={{ padding: "14px 20px" }}>
                                                        <span
                                                            style={{
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                fontSize: "12px",
                                                                fontWeight: 700,
                                                                color: statusStyle.fg,
                                                                background: statusStyle.bg,
                                                                border: `1px solid ${statusStyle.border}`,
                                                                borderRadius: "999px",
                                                                padding: "4px 12px",
                                                            }}
                                                        >
                                                            {task.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: "14px 20px" }}>
                                                        <TaskStatusForm taskId={task._id} currentStatus={task.status} canEdit />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="tasks-card-wrap">
                                {tasks.map((task, idx) => {
                                    const statusStyle = statusColors[task.status] || statusColors.Pending;
                                    return (
                                        <div
                                            key={task._id}
                                            style={{
                                                padding: "16px 20px",
                                                borderBottom: idx === tasks.length - 1 ? "none" : `1px solid ${c.border}`,
                                            }}
                                        >
                                            <div style={{ marginBottom: "12px" }}>
                                                <Link
                                                    href={`/dashboard/tasks/${task._id}`}
                                                    style={{
                                                        fontSize: "14px",
                                                        fontWeight: 600,
                                                        color: c.text,
                                                        textDecoration: "none",
                                                        display: "block",
                                                        marginBottom: "6px",
                                                    }}
                                                >
                                                    {task.title}
                                                </Link>
                                                {isAdmin && (
                                                    <p style={{ fontSize: "12px", color: c.textSecondary, margin: "0 0 8px" }}>
                                                        Assigned to: {task.assignedTo?.name || "Unassigned"}
                                                    </p>
                                                )}
                                                <span
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        fontSize: "11px",
                                                        fontWeight: 700,
                                                        color: statusStyle.fg,
                                                        background: statusStyle.bg,
                                                        border: `1px solid ${statusStyle.border}`,
                                                        borderRadius: "999px",
                                                        padding: "3px 10px",
                                                    }}
                                                >
                                                    {task.status}
                                                </span>
                                            </div>
                                            <TaskStatusForm taskId={task._id} currentStatus={task.status} canEdit />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Pagination currentPage={currentPage} totalPages={totalPages} buildHref={(page) => buildPageHref(statusFilter, page)} />
                            )}
                        </>
                    )}
                </div>
            </div>

            <style>{`
                .tasks-card-wrap { display: block; }
                .tasks-table-wrap { display: none; }
                @media (min-width: 640px) {
                    .tasks-card-wrap { display: none; }
                    .tasks-table-wrap { display: block; }
                }
            `}</style>
        </div>
    );
}

function buildPageHref(statusFilter, pageNumber) {
    const params = new URLSearchParams();

    if (statusFilter) {
        params.set("status", statusFilter);
    }

    params.set("page", String(pageNumber));

    return `/dashboard/my-tasks?${params.toString()}`;
}

function buildFilterHref(status) {
    const params = new URLSearchParams();

    if (status) {
        params.set("status", status);
    }

    params.set("page", "1"); // Reset to page 1 when filtering

    return `/dashboard/my-tasks?${params.toString()}`;
}
