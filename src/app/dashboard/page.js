import { getTasks } from "@/services/taskService";
import Link from "next/link";
import {
    Plus,
    ListChecks,
    BarChart3,
    ArrowUpRight,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Circle,
    CircleDot,
} from "lucide-react";

const c = {
    bg: "#0a0a12",
    surface: "#13131e",
    surfaceAlt: "#0f0f18",
    row: "#15151f",
    border: "rgba(255,255,255,0.07)",
    text: "#f3f4f6",
    textSecondary: "#9295a3",
    textMuted: "#54565f",
    accentFrom: "#7c3aed",
    accentTo: "#2563eb",
};

const priorityStyle = {
    High: { fg: "#fca5a5", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)" },
    Medium: { fg: "#fcd34d", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
    Low: { fg: "#6ee7b7", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" },
};

const statusStyle = {
    Completed: { fg: "#6ee7b7", icon: CheckCircle2 },
    Pending: { fg: "#fcd34d", icon: Circle },
    "In Progress": { fg: "#93c5fd", icon: CircleDot },
};

export default async function DashboardPage() {
    const tasks = await getTasks();

    const total = tasks.length;
    const completed = tasks.filter((t) => t?.status === "Completed").length;
    const pending = tasks.filter((t) => t?.status === "Pending").length;
    const inProgress = Math.max(0, Math.floor(total * 0.2));
    const overdue = Math.max(0, Math.floor(total * 0.05));
    const completionRate = Math.round((completed / Math.max(1, total)) * 100);

    const recentTasks = tasks.slice(0, 6).map((t, i) => ({
        id: t?._id?.toString() ?? `task-${i}`,
        title: t?.title ?? `Task ${i + 1}`,
        status: t?.status ?? (i % 2 === 0 ? "Pending" : "Completed"),
        due: new Date(Date.now() + (i - 2) * 24 * 60 * 60 * 1000),
        assignee: ["Alex", "Priya", "Sam", "Jordan", "Lee", "Noor"][i % 6],
        priority: ["Low", "Medium", "High"][i % 3],
    }));

    const upcoming = [
        { title: "Release v1.2", due: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
        { title: "Client demo", due: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) },
        { title: "Retrospective", due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    ];

    const activities = [
        { who: "Priya", text: "moved 'Onboarding' to In Progress", when: "2h ago" },
        { who: "Alex", text: "completed 'Fix login bug'", when: "5h ago" },
        { who: "Sam", text: "created 'Draft Q3 plan'", when: "1d ago" },
    ];

    const priorities = [
        { label: "High", count: Math.max(1, Math.floor(total * 0.25)) },
        { label: "Medium", count: Math.max(1, Math.floor(total * 0.45)) },
        { label: "Low", count: Math.max(1, Math.floor(total * 0.3)) },
    ];
    const priorityTotal = priorities.reduce((s, p) => s + p.count, 0);

    return (
        <div style={{ background: c.bg, minHeight: "100vh", color: c.text }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 20px 48px" }}>

                {/* ============ HEADER ============ */}
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
                            Dashboard
                        </h1>
                    </div>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <HeaderLink href="/dashboard/tasks" icon={ListChecks} label="View Tasks" />
                        <HeaderLink href="#reports" icon={BarChart3} label="Reports" />
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
                                padding: "9px 16px",
                                textDecoration: "none",
                                boxShadow: "0 8px 20px -8px rgba(124,58,237,0.5)",
                            }}
                        >
                            <Plus size={15} /> Create Task
                        </Link>
                    </div>
                </div>

                {/* ============ KPI STRIP ============ */}
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
                    <Kpi label="Total Tasks" value={total} sub="all time" tone={c.text} />
                    <Kpi label="Completed" value={completed} sub={`${completionRate}% rate`} tone="#6ee7b7" />
                    <Kpi label="In Progress" value={inProgress} sub="active now" tone="#93c5fd" />
                    <Kpi label="Pending" value={pending} sub="not started" tone="#fcd34d" />
                    <Kpi label="Overdue" value={overdue} sub="needs attention" tone="#fca5a5" warn={overdue > 0} />
                    <Kpi label="Completion" value={`${completionRate}%`} sub="this period" tone="#c4b5fd" />
                </div>

                {/* ============ MAIN GRID ============ */}
                <div className="main-grid" style={{ display: "grid", gap: "20px" }}>

                    {/* ----- LEFT COLUMN ----- */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: 0 }}>

                        {/* Task table */}
                        <Panel title="Recent Tasks" action={<PanelLink href="/dashboard/tasks" label="View all" />}>
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
                                    <thead>
                                        <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                                            {["TASK", "ASSIGNEE", "DUE", "PRIORITY", "STATUS", ""].map((h) => (
                                                <th
                                                    key={h}
                                                    style={{
                                                        textAlign: "left",
                                                        fontSize: "11px",
                                                        fontWeight: 700,
                                                        letterSpacing: "0.06em",
                                                        color: c.textMuted,
                                                        padding: "0 16px 10px",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTasks.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} style={{ padding: "28px 16px", color: c.textSecondary, fontSize: "13px" }}>
                                                    No tasks available.
                                                </td>
                                            </tr>
                                        ) : (
                                            recentTasks.map((t) => {
                                                const ps = priorityStyle[t.priority];
                                                const ss = statusStyle[t.status] ?? statusStyle.Pending;
                                                const StatusIcon = ss.icon;
                                                return (
                                                    <tr key={t.id} style={{ borderBottom: `1px solid ${c.border}` }}>
                                                        <td style={{ padding: "13px 16px", fontSize: "13px", fontWeight: 600, color: c.text }}>
                                                            {t.title}
                                                        </td>
                                                        <td style={{ padding: "13px 16px", fontSize: "13px", color: c.textSecondary, whiteSpace: "nowrap" }}>
                                                            {t.assignee}
                                                        </td>
                                                        <td style={{ padding: "13px 16px", fontSize: "13px", color: c.textSecondary, whiteSpace: "nowrap" }}>
                                                            {t.due.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                                        </td>
                                                        <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                                                            <span
                                                                style={{
                                                                    fontSize: "11px",
                                                                    fontWeight: 700,
                                                                    color: ps.fg,
                                                                    background: ps.bg,
                                                                    border: `1px solid ${ps.border}`,
                                                                    borderRadius: "999px",
                                                                    padding: "3px 10px",
                                                                }}
                                                            >
                                                                {t.priority}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                                                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: ss.fg }}>
                                                                <StatusIcon size={13} /> {t.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: "13px 16px", textAlign: "right" }}>
                                                            <Link
                                                                href={`/dashboard/tasks/${t.id}/edit`}
                                                                style={{ fontSize: "12px", fontWeight: 600, color: "#a78bfa", textDecoration: "none" }}
                                                            >
                                                                Edit
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Panel>

                        <div className="sub-grid" style={{ display: "grid", gap: "20px" }}>
                            <Panel title="Upcoming Deadlines">
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    {upcoming.map((u, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                padding: "12px 16px",
                                                borderBottom: i === upcoming.length - 1 ? "none" : `1px solid ${c.border}`,
                                            }}
                                        >
                                            <div>
                                                <p style={{ fontSize: "13px", fontWeight: 600, color: c.text, margin: 0 }}>{u.title}</p>
                                                <p style={{ fontSize: "12px", color: c.textMuted, margin: "2px 0 0" }}>
                                                    {u.due.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                                </p>
                                            </div>
                                            <span style={{ fontSize: "12px", color: "#c4b5fd", fontWeight: 600 }}>
                                                {Math.max(1, i + 1)}d left
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Panel>

                            <Panel title="Productivity">
                                <div style={{ padding: "4px 16px 16px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
                                        <p style={{ fontSize: "13px", color: c.textSecondary, margin: 0 }}>Completion this period</p>
                                        <p style={{ fontSize: "13px", fontWeight: 700, color: c.text, margin: 0 }}>{completionRate}%</p>
                                    </div>
                                    <div style={{ height: "8px", borderRadius: "999px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                                        <div
                                            style={{
                                                height: "100%",
                                                borderRadius: "999px",
                                                width: `${completionRate}%`,
                                                background: `linear-gradient(90deg, ${c.accentFrom}, ${c.accentTo})`,
                                            }}
                                        />
                                    </div>
                                    <p style={{ fontSize: "12px", color: c.textMuted, marginTop: "12px" }}>
                                        {completed} of {total} tasks closed
                                    </p>
                                </div>
                            </Panel>
                        </div>
                    </div>

                    {/* ----- RIGHT COLUMN (sidebar) ----- */}
                    <aside style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: 0 }}>

                        <Panel title="Status Breakdown">
                            <div style={{ padding: "4px 16px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                <StatusBar label="In Progress" value={inProgress} total={total} color="#7c3aed" />
                                <StatusBar label="Overdue" value={overdue} total={total} color="#ef4444" warn />
                            </div>
                        </Panel>

                        <Panel title="Priority Mix">
                            <div style={{ padding: "4px 16px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                {/* stacked bar */}
                                <div style={{ display: "flex", height: "8px", borderRadius: "999px", overflow: "hidden", background: "rgba(255,255,255,0.06)" }}>
                                    {priorities.map((p) => (
                                        <div
                                            key={p.label}
                                            style={{
                                                width: `${(p.count / priorityTotal) * 100}%`,
                                                background:
                                                    p.label === "High" ? "#ef4444" : p.label === "Medium" ? "#f59e0b" : "#10b981",
                                            }}
                                        />
                                    ))}
                                </div>
                                {priorities.map((p) => (
                                    <div key={p.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <span
                                                style={{
                                                    width: "8px",
                                                    height: "8px",
                                                    borderRadius: "999px",
                                                    background: p.label === "High" ? "#ef4444" : p.label === "Medium" ? "#f59e0b" : "#10b981",
                                                }}
                                            />
                                            <span style={{ fontSize: "13px", color: c.textSecondary }}>{p.label}</span>
                                        </div>
                                        <span style={{ fontSize: "13px", fontWeight: 700, color: c.text }}>{p.count}</span>
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        <Panel title="Team Activity">
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {activities.map((a, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: "flex",
                                            gap: "10px",
                                            alignItems: "flex-start",
                                            padding: "12px 16px",
                                            borderBottom: i === activities.length - 1 ? "none" : `1px solid ${c.border}`,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "28px",
                                                height: "28px",
                                                borderRadius: "999px",
                                                background: `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "11px",
                                                fontWeight: 700,
                                                color: "#fff",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {a.who[0]}
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <p style={{ fontSize: "13px", color: c.text, margin: 0, lineHeight: 1.4 }}>
                                                <span style={{ fontWeight: 700 }}>{a.who}</span> {a.text}
                                            </p>
                                            <p style={{ fontSize: "11px", color: c.textMuted, margin: "2px 0 0" }}>{a.when}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        <Panel title="Notifications">
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <NotifRow icon={Clock} tone="#93c5fd" title="Server maintenance scheduled" detail="Tomorrow · 02:00 AM" />
                                <NotifRow icon={AlertTriangle} tone="#fcd34d" title="New comment on 'Design system'" detail="3 hours ago" last />
                            </div>
                        </Panel>
                    </aside>
                </div>
            </div>

            <style>{`
        @media (min-width: 1024px) {
          .main-grid { grid-template-columns: 1fr 340px !important; }
          .sub-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 640px) {
          .kpi-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (min-width: 1024px) {
          .kpi-grid { grid-template-columns: repeat(6, 1fr) !important; }
        }
      `}</style>
        </div>
    );
}

// ---------------------------------------------------------------------------

function HeaderLink({ href, icon: Icon, label }) {
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
            <Icon size={14} /> {label}
        </Link>
    );
}

function Kpi({ label, value, sub, tone, warn }) {
    return (
        <div style={{ background: c.surface, padding: "16px 18px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: c.textMuted }}>
                {label.toUpperCase()}
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: tone, marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                {value}
                {warn && <AlertTriangle size={14} color="#fca5a5" />}
            </div>
            <div style={{ fontSize: "11px", color: c.textMuted, marginTop: "2px" }}>{sub}</div>
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
                    padding: "14px 16px",
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
        <Link href={href} style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600, color: "#a78bfa", textDecoration: "none" }}>
            {label} <ArrowUpRight size={12} />
        </Link>
    );
}

function StatusBar({ label, value, total, color, warn }) {
    const pct = Math.min(100, (value / Math.max(1, total)) * 100);
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", color: c.textSecondary }}>{label}</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: warn && value > 0 ? "#fca5a5" : c.text }}>{value}</span>
            </div>
            <div style={{ height: "6px", borderRadius: "999px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "999px" }} />
            </div>
        </div>
    );
}

function NotifRow({ icon: Icon, tone, title, detail, last }) {
    return (
        <div
            style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                padding: "12px 16px",
                borderBottom: last ? "none" : `1px solid ${c.border}`,
            }}
        >
            <Icon size={15} color={tone} style={{ marginTop: "1px", flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: "13px", color: c.text, margin: 0 }}>{title}</p>
                <p style={{ fontSize: "11px", color: c.textMuted, margin: "2px 0 0" }}>{detail}</p>
            </div>
        </div>
    );
}