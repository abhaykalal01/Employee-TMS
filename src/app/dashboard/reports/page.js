import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getTasks } from "@/services/taskService";
import { getUsers, getEmployeeCount } from "@/services/userService";
import { Users, ListChecks, Clock, CheckCircle2, BarChart3 } from "lucide-react";

const c = {
    bg: "var(--app-bg)",
    surface: "var(--app-surface)",
    border: "var(--app-border)",
    text: "var(--app-text)",
    textSecondary: "var(--app-text-secondary)",
    textMuted: "var(--app-text-muted)",
};

export default async function ReportsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    if (user.role !== "admin") {
        redirect("/dashboard");
    }

    const [tasks, users, employeeCount] = await Promise.all([
        getTasks(),
        getUsers(),
        getEmployeeCount(),
    ]);

    const adminCount = users.filter((u) => u.role === "admin").length;
    const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
    const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
    const completedTasks = tasks.filter((t) => t.status === "Completed").length;
    const unassignedTasks = tasks.filter((t) => !t.assignedTo).length;
    const completionRate = Math.round((completedTasks / Math.max(1, tasks.length)) * 100);

    return (
        <div style={{ background: c.bg, minHeight: "100vh", color: c.text }}>
            <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "28px 20px 64px" }}>
                <div style={{ marginBottom: "24px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: c.textMuted }}>
                        DASHBOARD&nbsp;/&nbsp;<span style={{ color: "#c4b5fd" }}>REPORTS</span>
                    </div>
                    <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "6px 0 0" }}>HR Reports</h1>
                    <p style={{ fontSize: "13px", color: c.textSecondary, marginTop: "4px" }}>
                        Workforce and task performance summary
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "16px",
                        marginBottom: "24px",
                    }}
                >
                    <ReportCard icon={Users} label="Total Employees" value={employeeCount} tone="#c4b5fd" />
                    <ReportCard icon={Users} label="Admins" value={adminCount} tone="#a78bfa" />
                    <ReportCard icon={ListChecks} label="Total Tasks" value={tasks.length} tone={c.text} />
                    <ReportCard icon={Clock} label="Pending" value={pendingTasks} tone="#fcd34d" />
                    <ReportCard icon={BarChart3} label="In Progress" value={inProgressTasks} tone="#93c5fd" />
                    <ReportCard icon={CheckCircle2} label="Completed" value={completedTasks} tone="#6ee7b7" />
                </div>

                <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                    <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: "14px", padding: "24px" }}>
                        <h2 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 16px" }}>Task Completion Rate</h2>
                        <div style={{ fontSize: "36px", fontWeight: 700, color: "#6ee7b7" }}>{completionRate}%</div>
                        <p style={{ fontSize: "13px", color: c.textSecondary, marginTop: "8px" }}>
                            {completedTasks} of {tasks.length} tasks completed
                        </p>
                        <div style={{ height: "8px", borderRadius: "999px", background: "rgba(255,255,255,0.06)", marginTop: "16px", overflow: "hidden" }}>
                            <div
                                style={{
                                    height: "100%",
                                    width: `${completionRate}%`,
                                    background: "linear-gradient(90deg, #7c3aed, #2563eb)",
                                    borderRadius: "999px",
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: "14px", padding: "24px" }}>
                        <h2 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 16px" }}>Assignment Overview</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <Row label="Assigned tasks" value={tasks.length - unassignedTasks} />
                            <Row label="Unassigned tasks" value={unassignedTasks} warn={unassignedTasks > 0} />
                            <Row label="Active employees" value={employeeCount} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ReportCard({ icon: Icon, label, value, tone }) {
    return (
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: "14px", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <Icon size={16} color={tone} />
                <span style={{ fontSize: "11px", fontWeight: 700, color: c.textMuted, letterSpacing: "0.05em" }}>
                    {label.toUpperCase()}
                </span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: 700, color: tone }}>{value}</div>
        </div>
    );
}

function Row({ label, value, warn }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: c.textSecondary }}>{label}</span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: warn ? "#fca5a5" : c.text }}>{value}</span>
        </div>
    );
}
