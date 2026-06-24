import Link from "next/link";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import { getTasks, getTaskStatsForUser, getTasksForUser } from "@/services/taskService";
import { getEmployeeCount } from "@/services/userService";
import {
    Users,
    ListChecks,
    Clock,
    CheckCircle2,
    CircleDot,
    Circle,
    Plus,
    ArrowUpRight,
} from "lucide-react";

const c = {
    bg: "#0a0a12",
    surface: "#13131e",
    border: "rgba(255,255,255,0.07)",
    text: "#f3f4f6",
    textSecondary: "#9295a3",
    textMuted: "#54565f",
    accentFrom: "#7c3aed",
    accentTo: "#2563eb",
};

export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    if (user.role === "admin") {
        return <AdminDashboard />;
    }

    return <EmployeeDashboard user={user} />;
}

async function AdminDashboard() {
    const [tasks, employeeCount] = await Promise.all([
        getTasks(),
        getEmployeeCount(),
    ]);

    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
    const completedTasks = tasks.filter((t) => t.status === "Completed").length;
    const recentTasks = tasks.slice(0, 5);

    return (
        <div style={{ background: c.bg, minHeight: "100vh", color: c.text }}>
            <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "28px 20px 64px" }}>
                <Header
                    title="Admin Dashboard"
                    subtitle="Company-wide HR and task operations overview"
                    actions={
                        <>
                            <HeaderLink href="/dashboard/employees" label="Employees" />
                            <HeaderLink href="/dashboard/reports" label="Reports" />
                            <PrimaryLink href="/dashboard/tasks/create" label="Create Task" icon={Plus} />
                        </>
                    }
                />

                <div
                    className="kpi-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "1px",
                        background: c.border,
                        border: `1px solid ${c.border}`,
                        borderRadius: "14px",
                        overflow: "hidden",
                        marginBottom: "24px",
                    }}
                >
                    <Kpi icon={Users} label="Total Employees" value={employeeCount} tone="#c4b5fd" />
                    <Kpi icon={ListChecks} label="Total Tasks" value={totalTasks} tone={c.text} />
                    <Kpi icon={Clock} label="Pending Tasks" value={pendingTasks} tone="#fcd34d" />
                    <Kpi icon={CheckCircle2} label="Completed Tasks" value={completedTasks} tone="#6ee7b7" />
                </div>

                <Panel title="Recent Tasks" action={<PanelLink href="/dashboard/tasks" label="View all" />}>
                    {recentTasks.length === 0 ? (
                        <EmptyState message="No tasks created yet." />
                    ) : (
                        <TaskTable tasks={recentTasks} showAssignee showActions />
                    )}
                </Panel>
            </div>

            <style>{`
                @media (min-width: 640px) {
                    .kpi-grid { grid-template-columns: repeat(4, 1fr) !important; }
                }
            `}</style>
        </div>
    );
}

async function EmployeeDashboard({ user }) {
    const [stats, myTasks] = await Promise.all([
        getTaskStatsForUser(user),
        getTasksForUser(user),
    ]);
    const recentTasks = myTasks.slice(0, 5);

    return (
        <div style={{ background: c.bg, minHeight: "100vh", color: c.text }}>
            <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "28px 20px 64px" }}>
                <Header
                    title="My Dashboard"
                    subtitle={`Welcome back, ${user.name}`}
                    actions={<HeaderLink href="/dashboard/my-tasks" label="My Tasks" />}
                />

                <div
                    className="kpi-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "1px",
                        background: c.border,
                        border: `1px solid ${c.border}`,
                        borderRadius: "14px",
                        overflow: "hidden",
                        marginBottom: "24px",
                    }}
                >
                    <Kpi icon={ListChecks} label="My Total Tasks" value={stats.total} tone={c.text} />
                    <Kpi icon={Circle} label="Pending Tasks" value={stats.pending} tone="#fcd34d" />
                    <Kpi icon={CircleDot} label="In Progress Tasks" value={stats.inProgress} tone="#93c5fd" />
                    <Kpi icon={CheckCircle2} label="Completed Tasks" value={stats.completed} tone="#6ee7b7" />
                </div>

                <Panel title="My Recent Tasks" action={<PanelLink href="/dashboard/my-tasks" label="View all" />}>
                    {recentTasks.length === 0 ? (
                        <EmptyState message="No tasks assigned to you yet." />
                    ) : (
                        <TaskTable tasks={recentTasks} showAssignee={false} showActions={false} />
                    )}
                </Panel>
            </div>

            <style>{`
                @media (min-width: 640px) {
                    .kpi-grid { grid-template-columns: repeat(4, 1fr) !important; }
                }
            `}</style>
        </div>
    );
}

function Header({ title, subtitle, actions }) {
    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "16px",
                marginBottom: "24px",
            }}
        >
            <div>
                <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: c.textMuted }}>
                    OVERVIEW
                </div>
                <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.01em", margin: "4px 0 0" }}>
                    {title}
                </h1>
                <p style={{ fontSize: "13px", color: c.textSecondary, marginTop: "4px" }}>{subtitle}</p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>{actions}</div>
        </div>
    );
}

function Kpi({ icon: Icon, label, value, tone }) {
    return (
        <div style={{ background: c.surface, padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div
                style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                <Icon size={18} color={tone} />
            </div>
            <div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: tone }}>{value}</div>
                <div style={{ fontSize: "11px", color: c.textMuted, marginTop: "2px" }}>{label}</div>
            </div>
        </div>
    );
}

function Panel({ title, action, children }) {
    return (
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: "14px", overflow: "hidden" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 20px",
                    borderBottom: `1px solid ${c.border}`,
                }}
            >
                <h2 style={{ fontSize: "14px", fontWeight: 700, color: c.text, margin: 0 }}>{title}</h2>
                {action}
            </div>
            {children}
        </div>
    );
}

function PanelLink({ href, label }) {
    return (
        <Link
            href={href}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#a78bfa",
                textDecoration: "none",
            }}
        >
            {label} <ArrowUpRight size={12} />
        </Link>
    );
}

function HeaderLink({ href, label }) {
    return (
        <Link
            href={href}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#d1d2da",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "9px",
                padding: "9px 14px",
                textDecoration: "none",
            }}
        >
            {label}
        </Link>
    );
}

function PrimaryLink({ href, label, icon: Icon }) {
    return (
        <Link
            href={href}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                background: `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})`,
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                borderRadius: "9px",
                padding: "9px 16px",
                textDecoration: "none",
                boxShadow: "0 8px 20px -8px rgba(124,58,237,0.5)",
            }}
        >
            <Icon size={15} /> {label}
        </Link>
    );
}

function EmptyState({ message }) {
    return (
        <p style={{ padding: "32px 20px", fontSize: "13px", color: c.textSecondary, margin: 0 }}>
            {message}
        </p>
    );
}

function TaskTable({ tasks, showAssignee, showActions }) {
    const statusColors = {
        Completed: "#6ee7b7",
        Pending: "#fcd34d",
        "In Progress": "#93c5fd",
    };

    return (
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "480px" }}>
                <thead>
                    <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                        {["TASK", ...(showAssignee ? ["ASSIGNEE"] : []), "STATUS", ...(showActions ? [""] : [])].map((h) => (
                            <th
                                key={h || "actions"}
                                style={{
                                    textAlign: h === "" ? "right" : "left",
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    letterSpacing: "0.06em",
                                    color: c.textMuted,
                                    padding: "12px 20px",
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
                            <td style={{ padding: "13px 20px", fontSize: "13px", fontWeight: 600, color: c.text }}>
                                {task.title}
                            </td>
                            {showAssignee && (
                                <td style={{ padding: "13px 20px", fontSize: "13px", color: c.textSecondary }}>
                                    {task.assignedTo?.name || "Unassigned"}
                                </td>
                            )}
                            <td style={{ padding: "13px 20px" }}>
                                <span style={{ fontSize: "12px", fontWeight: 600, color: statusColors[task.status] || c.textSecondary }}>
                                    {task.status}
                                </span>
                            </td>
                            {showActions && (
                                <td style={{ padding: "13px 20px", textAlign: "right" }}>
                                    <Link
                                        href={`/dashboard/tasks/${task._id}/edit`}
                                        style={{ fontSize: "12px", fontWeight: 600, color: "#a78bfa", textDecoration: "none" }}
                                    >
                                        Edit
                                    </Link>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
