import { getCurrentUser } from "@/lib/getCurrentUser";
import { User, Mail, ShieldCheck, BadgeCheck, Clock } from "lucide-react";

const c = {
    bg: "var(--app-bg)",
    surface: "var(--app-surface)",
    field: "color-mix(in srgb, var(--app-surface) 94%, var(--app-bg) 6%)",
    border: "var(--app-border)",
    text: "var(--app-text)",
    textSecondary: "var(--app-text-secondary)",
    textMuted: "var(--app-text-muted)",
    accentFrom: "var(--accent-from)",
    accentTo: "var(--accent-to)",
};

const roleTone = {
    admin: { fg: "#c4b5fd", bg: "rgba(124,58,237,0.14)", border: "rgba(124,58,237,0.35)" },
    employee: { fg: "#93c5fd", bg: "rgba(37,99,235,0.14)", border: "rgba(37,99,235,0.35)" },
};

export default async function ProfilePage() {
    const user = await getCurrentUser();
    const roleKey = (user?.role || "employee").toLowerCase();
    const tone = roleTone[roleKey] ?? roleTone.employee;
    const initials = (user?.name || "?")
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div style={{ background: c.bg, minHeight: "100vh", color: c.text }}>
            <div style={{ maxWidth: "760px", margin: "0 auto", padding: "28px 20px 64px" }}>

                {/* Breadcrumb */}
                <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: c.textMuted, marginBottom: "12px" }}>
                    DASHBOARD&nbsp;/&nbsp;<span style={{ color: "#c4b5fd" }}>PROFILE</span>
                </div>

                {/* Header */}
                <div style={{ marginBottom: "24px" }}>
                    <h1 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.01em", margin: 0 }}>
                        My Profile
                    </h1>
                    <p style={{ fontSize: "13px", color: c.textSecondary, marginTop: "4px" }}>
                        Your account information and access level.
                    </p>
                </div>

                {/* Identity card */}
                <div
                    style={{
                        background: c.surface,
                        border: `1px solid ${c.border}`,
                        borderRadius: "16px",
                        overflow: "hidden",
                        marginBottom: "20px",
                    }}
                >
                    <div
                        style={{
                            padding: "28px 24px",
                            display: "flex",
                            alignItems: "center",
                            gap: "18px",
                            flexWrap: "wrap",
                            borderBottom: `1px solid ${c.border}`,
                        }}
                    >
                        <div
                            style={{
                                width: "64px",
                                height: "64px",
                                borderRadius: "16px",
                                background: `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "22px",
                                fontWeight: 700,
                                color: "#fff",
                                flexShrink: 0,
                                boxShadow: "0 10px 26px -10px rgba(124,58,237,0.55)",
                            }}
                        >
                            {initials}
                        </div>

                        <div style={{ minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0, color: c.text }}>
                                    {user?.name}
                                </h2>
                                <BadgeCheck size={16} color="#60a5fa" />
                            </div>
                            <p style={{ fontSize: "13px", color: c.textSecondary, marginTop: "3px" }}>
                                {user?.email}
                            </p>
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    letterSpacing: "0.03em",
                                    color: tone.fg,
                                    background: tone.bg,
                                    border: `1px solid ${tone.border}`,
                                    borderRadius: "999px",
                                    padding: "4px 12px",
                                    marginTop: "10px",
                                }}
                            >
                                <ShieldCheck size={12} /> {user?.role}
                            </span>
                        </div>
                    </div>

                    {/* Details grid */}
                    <div className="profile-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1px", background: c.border }}>
                        <DetailRow icon={User} label="Full Name" value={user?.name} />
                        <DetailRow icon={Mail} label="Work Email" value={user?.email} />
                        <DetailRow icon={ShieldCheck} label="Role" value={user?.role} />
                    </div>
                </div>

                {/* Account meta */}
                <div
                    style={{
                        background: c.surface,
                        border: `1px solid ${c.border}`,
                        borderRadius: "16px",
                        padding: "18px 24px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <Clock size={16} color={c.textMuted} />
                    <p style={{ fontSize: "12px", color: c.textMuted, margin: 0 }}>
                        Profile details are managed by your organization's administrator.
                    </p>
                </div>
            </div>

            <style>{`
        @media (min-width: 640px) {
          .profile-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
        </div>
    );
}

function DetailRow({ icon: Icon, label, value }) {
    return (
        <div style={{ background: "var(--app-surface)", padding: "18px 24px" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: "var(--app-text-muted)",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                }}
            >
                <Icon size={12} /> {label}
            </div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--app-text)", margin: 0, wordBreak: "break-word" }}>
                {value}
            </p>
        </div>
    );
}