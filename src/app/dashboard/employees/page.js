import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getUsers } from "@/services/userService";
import { deleteEmployee } from "@/actions/employeeActions";
import { UserPlus, Users, ShieldCheck, Pencil, Mail, Trash2 } from "lucide-react";

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

const roleTone = {
    admin: { fg: "#c4b5fd", bg: "rgba(124,58,237,0.14)", border: "rgba(124,58,237,0.35)" },
    employee: { fg: "#93c5fd", bg: "rgba(37,99,235,0.14)", border: "rgba(37,99,235,0.35)" },
};

function initialsOf(name) {
    return (name || "?")
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export default async function EmployeesPage() {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
        redirect("/dashboard");
    }

    const users = await getUsers();
    const adminCount = users.filter((u) => (u.role || "").toLowerCase() === "admin").length;
    const employeeCount = users.length - adminCount;

    return (
        <div style={{ background: c.bg, minHeight: "100vh", color: c.text }}>
            <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "28px 20px 64px" }}>

                {/* ============ HEADER ============ */}
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
                            DASHBOARD&nbsp;/&nbsp;<span style={{ color: "#c4b5fd" }}>EMPLOYEES</span>
                        </div>
                        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.01em", margin: "6px 0 0" }}>
                            Employees
                        </h1>
                        <p style={{ fontSize: "13px", color: c.textSecondary, marginTop: "4px" }}>
                            {users.length} total · {adminCount} admin · {employeeCount} employee
                        </p>
                    </div>

                    <Link
                        href="/dashboard/employees/create"
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
                        <UserPlus size={15} /> Add Employee
                    </Link>
                </div>

                {/* ============ STAT STRIP ============ */}
                <div
                    className="stat-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "1px",
                        background: c.border,
                        border: `1px solid ${c.border}`,
                        borderRadius: "14px",
                        overflow: "hidden",
                        marginBottom: "20px",
                    }}
                >
                    <Stat icon={Users} label="Total Employees" value={users.length} tone={c.text} />
                    <Stat icon={ShieldCheck} label="Admins" value={adminCount} tone="#c4b5fd" />
                </div>

                {/* ============ DIRECTORY PANEL ============ */}
                <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: "14px", overflow: "hidden" }}>
                    {users.length === 0 ? (
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
                                <Users size={22} color={c.textMuted} />
                            </div>
                            <p style={{ fontSize: "15px", fontWeight: 600, color: c.text, margin: 0 }}>No employees yet</p>
                            <p style={{ fontSize: "13px", color: c.textSecondary, marginTop: "6px" }}>
                                Add your first team member to start assigning work.
                            </p>
                            <Link
                                href="/dashboard/employees/create"
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
                                <UserPlus size={14} /> Add Employee
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* ---- Desktop: table ---- */}
                            <div className="emp-table-wrap" style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
                                    <thead>
                                        <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                                            {["EMPLOYEE", "EMAIL", "ROLE", ""].map((h) => (
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
                                        {users.map((user) => {
                                            const tone = roleTone[(user.role || "").toLowerCase()] ?? roleTone.employee;
                                            return (
                                                <tr key={user._id} style={{ borderBottom: `1px solid ${c.border}` }}>
                                                    <td style={{ padding: "14px 20px" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                            <div
                                                                style={{
                                                                    width: "34px",
                                                                    height: "34px",
                                                                    borderRadius: "10px",
                                                                    background: `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})`,
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    fontSize: "12px",
                                                                    fontWeight: 700,
                                                                    color: "#fff",
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                {initialsOf(user.name)}
                                                            </div>
                                                            <span style={{ fontSize: "14px", fontWeight: 600, color: c.text }}>{user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: "14px 20px", fontSize: "13px", color: c.textSecondary, whiteSpace: "nowrap" }}>
                                                        {user.email}
                                                    </td>
                                                    <td style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
                                                        <span
                                                            style={{
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                gap: "6px",
                                                                fontSize: "11px",
                                                                fontWeight: 700,
                                                                color: tone.fg,
                                                                background: tone.bg,
                                                                border: `1px solid ${tone.border}`,
                                                                borderRadius: "999px",
                                                                padding: "4px 12px",
                                                            }}
                                                        >
                                                            <ShieldCheck size={11} /> {user.role}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: "14px 20px", textAlign: "right", whiteSpace: "nowrap" }}>
                                                        <div style={{ display: "inline-flex", gap: "8px" }}>
                                                            <Link
                                                                href={`/dashboard/employees/${user._id}/edit`}
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

                                                            <form action={deleteEmployee}>
                                                                <input type="hidden" name="id" value={user._id} />
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

                            {/* ---- Mobile: cards ---- */}
                            <div className="emp-card-wrap">
                                {users.map((user, idx) => {
                                    const tone = roleTone[(user.role || "").toLowerCase()] ?? roleTone.employee;
                                    return (
                                        <div
                                            key={user._id}
                                            style={{
                                                padding: "16px 20px",
                                                borderBottom: idx === users.length - 1 ? "none" : `1px solid ${c.border}`,
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <div
                                                    style={{
                                                        width: "38px",
                                                        height: "38px",
                                                        borderRadius: "11px",
                                                        background: `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})`,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "13px",
                                                        fontWeight: 700,
                                                        color: "#fff",
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {initialsOf(user.name)}
                                                </div>
                                                <div style={{ minWidth: 0, flex: 1 }}>
                                                    <p style={{ fontSize: "14px", fontWeight: 600, color: c.text, margin: 0 }}>{user.name}</p>
                                                    <p style={{ fontSize: "12px", color: c.textSecondary, margin: "2px 0 0", display: "flex", alignItems: "center", gap: "5px" }}>
                                                        <Mail size={11} /> {user.email}
                                                    </p>
                                                </div>
                                                <span
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: "5px",
                                                        fontSize: "11px",
                                                        fontWeight: 700,
                                                        color: tone.fg,
                                                        background: tone.bg,
                                                        border: `1px solid ${tone.border}`,
                                                        borderRadius: "999px",
                                                        padding: "3px 10px",
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {user.role}
                                                </span>
                                            </div>

                                            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                                                <Link
                                                    href={`/dashboard/employees/${user._id}/edit`}
                                                    style={{
                                                        flex: 1,
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: "6px",
                                                        fontSize: "12px",
                                                        fontWeight: 600,
                                                        color: "#93c5fd",
                                                        border: "1px solid rgba(147,197,253,0.3)",
                                                        borderRadius: "8px",
                                                        padding: "9px",
                                                        textDecoration: "none",
                                                    }}
                                                >
                                                    <Pencil size={12} /> Edit
                                                </Link>
                                                <form action={deleteEmployee} style={{ flex: 1 }}>
                                                    <input type="hidden" name="id" value={user._id} />
                                                    <button
                                                        type="submit"
                                                        style={{
                                                            width: "100%",
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            gap: "6px",
                                                            fontSize: "12px",
                                                            fontWeight: 600,
                                                            color: "#fca5a5",
                                                            background: "rgba(239,68,68,0.1)",
                                                            border: "1px solid rgba(239,68,68,0.3)",
                                                            borderRadius: "8px",
                                                            padding: "9px",
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
            </div>

            <style>{`
        .emp-card-wrap { display: block; }
        .emp-table-wrap { display: none; }
        @media (min-width: 640px) {
          .emp-card-wrap { display: none; }
          .emp-table-wrap { display: block; }
          .stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
        </div>
    );
}

function Stat({ icon: Icon, label, value, tone }) {
    return (
        <div style={{ background: c.surface, padding: "16px 18px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div
                style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                <Icon size={16} color={tone} />
            </div>
            <div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: tone }}>{value}</div>
                <div style={{ fontSize: "11px", color: c.textMuted, marginTop: "1px" }}>{label}</div>
            </div>
        </div>
    );
}