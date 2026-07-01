import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getTasksPaginated } from "@/services/taskService";
import { deleteTask } from "@/actions/taskActions";
import { Plus, Inbox, CheckCircle2, Circle, Pencil, Trash2, Search } from "lucide-react";

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

const statusStyle = {
    Completed: { fg: "#6ee7b7", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", icon: CheckCircle2 },
    Pending: { fg: "#fcd34d", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", icon: Circle },
};

export default async function TasksPage({ searchParams }) {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
        redirect("/dashboard/my-tasks");
    }

    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams?.page || 1);
    const searchTerm = (resolvedSearchParams?.search || "").toString().trim();
    const { tasks, total, totalPages, currentPage } = await getTasksPaginated({
        page,
        limit: 6,
        search: searchTerm,
    });
    const completedCount = tasks.filter((t) => t.status === "Completed").length;
    const pendingCount = tasks.length - completedCount;

    return (
        <div style={{ background: c.bg, minHeight: "100vh", color: c.text }}>
            <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "28px 20px 48px" }}>
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
                            DASHBOARD&nbsp;/&nbsp;<span style={{ color: "#c4b5fd" }}>TASKS</span>
                        </div>
                        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.01em", margin: "6px 0 0" }}>
                            All Tasks
                        </h1>
                        <p style={{ fontSize: "13px", color: c.textSecondary, marginTop: "4px" }}>
                            {searchTerm
                                ? `${total} match${total === 1 ? "" : "es"} for "${searchTerm}"`
                                : `${total} total · ${completedCount} completed · ${pendingCount} pending`}
                        </p>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
                        <form action="/dashboard/tasks" method="get" style={{ display: "flex", alignItems: "center", gap: "8px", background: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "7px 10px" }}>
                            <input
                                type="text"
                                name="search"
                                defaultValue={searchTerm}
                                placeholder="Search task title"
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    outline: "none",
                                    color: c.text,
                                    fontSize: "13px",
                                    minWidth: "180px",
                                }}
                            />
                            <input type="hidden" name="page" value="1" />
                            <button
                                type="submit"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "6px",
                                    border: "none",
                                    borderRadius: "8px",
                                    background: `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})`,
                                    color: "#fff",
                                    padding: "8px 10px",
                                    cursor: "pointer",
                                }}
                            >
                                <Search size={14} />
                            </button>
                        </form>

                        <Link
                            href="/dashboard/tasks/create"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "7px",
                                background: `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})`,
                                color: "#fff",
                                fontSize: "13px",
                                fontWeight: 600,
                                borderRadius: "9px",
                                padding: "10px 18px",
                                textDecoration: "none",
                                boxShadow: "0 8px 20px -8px rgba(124,58,237,0.5)",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <Plus size={15} /> Create Task
                        </Link>
                    </div>
                </div>

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
                            <p style={{ fontSize: "15px", fontWeight: 600, color: c.text, margin: 0 }}>
                                {searchTerm ? `No tasks match "${searchTerm}"` : "No tasks yet"}
                            </p>
                            <p style={{ fontSize: "13px", color: c.textSecondary, marginTop: "6px" }}>
                                {searchTerm ? "Try a different title or clear the filter." : "Create your first task to get the team moving."}
                            </p>
                            <Link
                                href="/dashboard/tasks/create"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    marginTop: "20px",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "#fff",
                                    background: `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})`,
                                    borderRadius: "9px",
                                    padding: "10px 18px",
                                    textDecoration: "none",
                                }}
                            >
                                <Plus size={14} /> Create Task
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="tasks-table-wrap" style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "640px" }}>
                                    <thead>
                                        <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                                            {["TASK", "ASSIGNEE", "STATUS", ""].map((h) => (
                                                <th
                                                    key={h}
                                                    style={{
                                                        textAlign: h === "" ? "right" : "left",
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
                                        {tasks.map((task, idx) => {
                                            const taskId = task._id?.toString();
                                            const ss = statusStyle[task.status] ?? statusStyle.Pending;
                                            const StatusIcon = ss.icon;
                                            return (
                                                <tr key={taskId || idx} style={{ borderBottom: `1px solid ${c.border}` }}>
                                                    <td style={{ padding: "16px 20px", fontSize: "14px", fontWeight: 600, color: c.text }}>
                                                        {task.title}
                                                    </td>
                                                    <td style={{ padding: "16px 20px", fontSize: "13px", color: c.textSecondary, whiteSpace: "nowrap" }}>
                                                        {task.assignedTo?.name || "Unassigned"}
                                                    </td>
                                                    <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                                                        <span
                                                            style={{
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                gap: "6px",
                                                                fontSize: "12px",
                                                                fontWeight: 700,
                                                                color: ss.fg,
                                                                background: ss.bg,
                                                                border: `1px solid ${ss.border}`,
                                                                borderRadius: "999px",
                                                                padding: "4px 12px",
                                                            }}
                                                        >
                                                            <StatusIcon size={12} /> {task.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: "16px 20px", textAlign: "right", whiteSpace: "nowrap" }}>
                                                        <div style={{ display: "inline-flex", gap: "8px" }}>
                                                            <Link
                                                                href={taskId ? `/dashboard/tasks/${taskId}/edit` : "/dashboard/tasks"}
                                                                style={{
                                                                    display: "inline-flex",
                                                                    alignItems: "center",
                                                                    gap: "5px",
                                                                    fontSize: "12px",
                                                                    fontWeight: 600,
                                                                    color: "#93c5fd",
                                                                    border: "1px solid rgba(147,197,253,0.3)",
                                                                    borderRadius: "8px",
                                                                    padding: "7px 12px",
                                                                    textDecoration: "none",
                                                                }}
                                                            >
                                                                <Pencil size={12} /> Edit
                                                            </Link>

                                                            <form action={deleteTask}>
                                                                <input type="hidden" name="id" value={taskId || ""} />
                                                                <button
                                                                    type="submit"
                                                                    style={{
                                                                        display: "inline-flex",
                                                                        alignItems: "center",
                                                                        gap: "5px",
                                                                        fontSize: "12px",
                                                                        fontWeight: 600,
                                                                        color: "#fca5a5",
                                                                        background: "rgba(239,68,68,0.1)",
                                                                        border: "1px solid rgba(239,68,68,0.3)",
                                                                        borderRadius: "8px",
                                                                        padding: "7px 12px",
                                                                        cursor: "pointer",
                                                                    }}
                                                                >
                                                                    <Trash2 size={12} /> Delete
                                                                </button>
                                                            </form>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="tasks-card-wrap">
                                {tasks.map((task, idx) => {
                                    const taskId = task._id?.toString();
                                    const ss = statusStyle[task.status] ?? statusStyle.Pending;
                                    const StatusIcon = ss.icon;
                                    return (
                                        <div
                                            key={taskId || idx}
                                            style={{
                                                padding: "16px 20px",
                                                borderBottom: idx === tasks.length - 1 ? "none" : `1px solid ${c.border}`,
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                                                <p style={{ fontSize: "14px", fontWeight: 600, color: c.text, margin: 0 }}>{task.title}</p>
                                                <span
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: "5px",
                                                        fontSize: "11px",
                                                        fontWeight: 700,
                                                        color: ss.fg,
                                                        background: ss.bg,
                                                        border: `1px solid ${ss.border}`,
                                                        borderRadius: "999px",
                                                        padding: "3px 10px",
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <StatusIcon size={11} /> {task.status}
                                                </span>
                                            </div>

                                            <p style={{ fontSize: "12px", color: c.textSecondary, margin: "4px 0 0" }}>
                                                Assigned to: {task.assignedTo?.name || "Unassigned"}
                                            </p>

                                            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                                                <Link
                                                    href={taskId ? `/dashboard/tasks/${taskId}/edit` : "/dashboard/tasks"}
                                                    style={{
                                                        flex: 1,
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: "5px",
                                                        fontSize: "12px",
                                                        fontWeight: 600,
                                                        color: "#93c5fd",
                                                        border: "1px solid rgba(147,197,253,0.3)",
                                                        borderRadius: "8px",
                                                        padding: "8px",
                                                        textDecoration: "none",
                                                    }}
                                                >
                                                    <Pencil size={12} /> Edit
                                                </Link>
                                                <form action={deleteTask} style={{ flex: 1 }}>
                                                    <input type="hidden" name="id" value={taskId || ""} />
                                                    <button
                                                        type="submit"
                                                        style={{
                                                            width: "100%",
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            gap: "5px",
                                                            fontSize: "12px",
                                                            fontWeight: 600,
                                                            color: "#fca5a5",
                                                            background: "rgba(239,68,68,0.1)",
                                                            border: "1px solid rgba(239,68,68,0.3)",
                                                            borderRadius: "8px",
                                                            padding: "8px",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <Trash2 size={12} /> Delete
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {totalPages > 1 && (
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "16px 20px 20px", borderTop: `1px solid ${c.border}` }}>
                        <div style={{ fontSize: "12px", color: c.textSecondary }}>
                            Page {currentPage} of {totalPages}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                            <Link
                                href={buildPageHref(searchTerm, Math.max(1, currentPage - 1))}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minWidth: "84px",
                                    borderRadius: "9px",
                                    border: `1px solid ${c.border}`,
                                    padding: "8px 12px",
                                    color: currentPage === 1 ? c.textMuted : c.text,
                                    textDecoration: "none",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    background: currentPage === 1 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.06)",
                                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                    pointerEvents: currentPage === 1 ? "none" : "auto",
                                }}
                            >
                                Previous
                            </Link>

                            {getVisiblePages(totalPages, currentPage).map((pageNumber, index) => {
                                if (pageNumber === "ellipsis") {
                                    return (
                                        <span key={`ellipsis-${index}`} style={{ color: c.textMuted, fontSize: "13px", padding: "0 2px" }}>
                                            ...
                                        </span>
                                    );
                                }

                                const isActive = pageNumber === currentPage;
                                return (
                                    <Link
                                        key={pageNumber}
                                        href={buildPageHref(searchTerm, pageNumber)}
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            minWidth: "36px",
                                            borderRadius: "9px",
                                            border: isActive ? `1px solid rgba(124,58,237,0.4)` : `1px solid ${c.border}`,
                                            padding: "8px 10px",
                                            color: isActive ? "#fff" : c.text,
                                            background: isActive ? `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})` : "rgba(255,255,255,0.05)",
                                            textDecoration: "none",
                                            fontSize: "13px",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {pageNumber}
                                    </Link>
                                );
                            })}

                            <Link
                                href={buildPageHref(searchTerm, Math.min(totalPages, currentPage + 1))}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minWidth: "72px",
                                    borderRadius: "9px",
                                    border: `1px solid ${c.border}`,
                                    padding: "8px 12px",
                                    color: currentPage === totalPages ? c.textMuted : c.text,
                                    textDecoration: "none",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    background: currentPage === totalPages ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.06)",
                                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                    pointerEvents: currentPage === totalPages ? "none" : "auto",
                                }}
                            >
                                Next
                            </Link>
                        </div>
                    </div>
                )}
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

function buildPageHref(searchTerm, pageNumber) {
    const params = new URLSearchParams();

    if (searchTerm) {
        params.set("search", searchTerm);
    }

    params.set("page", String(pageNumber));

    return `/dashboard/tasks?${params.toString()}`;
}

function getVisiblePages(totalPages, currentPage) {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = [];
    const visibleStart = Math.max(1, currentPage - 1);
    const visibleEnd = Math.min(totalPages, currentPage + 1);

    if (visibleStart > 1) {
        pages.push(1, "ellipsis");
    } else {
        pages.push(1);
    }

    for (let pageNumber = visibleStart; pageNumber <= visibleEnd; pageNumber += 1) {
        pages.push(pageNumber);
    }

    if (visibleEnd < totalPages) {
        pages.push("ellipsis", totalPages);
    }

    return pages.filter((pageNumber, index, array) => array.indexOf(pageNumber) === index);
}