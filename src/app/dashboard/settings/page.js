import { logoutUser } from "@/actions/authActions";
import ThemeToggle from "@/components/ThemeToggle";
import {
    User,
    Lock,
    Moon,
    Bell,
    LogOut,
    ChevronRight,
} from "lucide-react";

// Every visual property lives in inline `style` objects below.
// Tailwind classes are used ONLY for layout primitives (flex, gap, width)
// that have no visual ambiguity — never for color, so a misconfigured
// Tailwind build can't silently drop the design again.

const colors = {
    bg: "var(--app-bg)",
    card: "var(--app-surface)",
    cardHover: "color-mix(in srgb, var(--app-surface) 90%, white 10%)",
    border: "var(--app-border)",
    textPrimary: "var(--app-text)",
    textSecondary: "var(--app-text-secondary)",
    textMuted: "var(--app-text-muted)",
    accentText: "#c4b5fd",
};

const iconStyles = [
    { bg: "linear-gradient(135deg, #8b5cf6, #6366f1)", glow: "rgba(139,92,246,0.35)" },
    { bg: "linear-gradient(135deg, #f59e0b, #ea580c)", glow: "rgba(245,158,11,0.3)" },
    { bg: "linear-gradient(135deg, #6366f1, #3b82f6)", glow: "rgba(99,102,241,0.3)" },
    { bg: "linear-gradient(135deg, #10b981, #059669)", glow: "rgba(16,185,129,0.3)" },
];

export default function SettingsPage() {
    return (
        <div style={{ background: colors.bg, minHeight: "100vh", width: "100%" }}>
            <div
                style={{
                    maxWidth: "768px",
                    margin: "0 auto",
                    padding: "32px 16px 64px",
                }}
            >
                {/* Breadcrumb */}
                <div
                    style={{
                        fontSize: "12px",
                        letterSpacing: "0.06em",
                        color: colors.textMuted,
                        marginBottom: "12px",
                        textAlign: "left",
                    }}
                >
                    DASHBOARD&nbsp;/&nbsp;<span style={{ color: colors.accentText }}>SETTINGS</span>
                </div>

                {/* Header */}
                <div style={{ marginBottom: "32px", textAlign: "left" }}>
                    <h1
                        style={{
                            fontSize: "28px",
                            fontWeight: 700,
                            color: colors.textPrimary,
                            letterSpacing: "-0.01em",
                            margin: 0,
                        }}
                    >
                        Settings
                    </h1>
                    <p style={{ fontSize: "14px", color: colors.textSecondary, marginTop: "6px" }}>
                        Manage your account, security, and preferences.
                    </p>
                </div>

                {/* Settings group */}
                <div
                    style={{
                        border: `1px solid ${colors.border}`,
                        borderRadius: "16px",
                        overflow: "hidden",
                        marginBottom: "24px",
                        background: colors.card,
                    }}
                >
                    <SettingRow
                        icon={<User size={18} color="#fff" />}
                        iconStyle={iconStyles[0]}
                        title="Profile"
                        description="View and update your account information."
                    />
                    <SettingRow
                        icon={<Lock size={18} color="#fff" />}
                        iconStyle={iconStyles[1]}
                        title="Change Password"
                        description="Update your account password securely."
                    />
                    <SettingRow
                        icon={<Moon size={18} color="#fff" />}
                        iconStyle={iconStyles[2]}
                        title="Theme"
                        description="Switch between dark and light mode."
                        trailing={<ThemeToggle />}
                    />
                    <SettingRow
                        icon={<Bell size={18} color="#fff" />}
                        iconStyle={iconStyles[3]}
                        title="Notifications"
                        description="Manage email and system notifications."
                        last
                    />
                </div>

                {/* Danger zone */}
                <div
                    style={{
                        background: "rgba(239,68,68,0.05)",
                        border: "1px solid rgba(239,68,68,0.22)",
                        borderRadius: "16px",
                        padding: "20px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "16px",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", textAlign: "left" }}>
                            <div
                                style={{
                                    background: "rgba(239,68,68,0.14)",
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <LogOut size={18} color="#f87171" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#fca5a5", margin: 0, textAlign: "left" }}>
                                    Sign Out
                                </h2>
                                <p style={{ fontSize: "13px", color: colors.textSecondary, marginTop: "4px", textAlign: "left" }}>
                                    You&apos;ll be returned to the login screen on this device.
                                </p>
                            </div>
                        </div>

                        <form action={logoutUser}>
                            <button
                                type="submit"
                                style={{
                                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                                    border: "none",
                                    color: "#fff",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    padding: "11px 24px",
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                    boxShadow: "0 6px 16px -4px rgba(239,68,68,0.5)",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Logout
                            </button>
                        </form>
                    </div>
                </div>

                <p
                    style={{
                        fontSize: "12px",
                        color: colors.textMuted,
                        marginTop: "28px",
                        textAlign: "left",
                    }}
                >
                    Employee TMS · Premium Ops · v1.0
                </p>
            </div>
        </div>
    );
}

function SettingRow({ icon, iconStyle, title, description, trailing, last }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "18px 20px",
                borderBottom: last ? "none" : `1px solid ${colors.border}`,
                cursor: "pointer",
            }}
        >
            <div
                style={{
                    background: iconStyle.bg,
                    width: "40px",
                    height: "40px",
                    borderRadius: "11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: `0 4px 14px -2px ${iconStyle.glow}`,
                }}
            >
                {icon}
            </div>

            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                <h2
                    style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: colors.textPrimary,
                        margin: 0,
                        textAlign: "left",
                    }}
                >
                    {title}
                </h2>
                <p
                    style={{
                        fontSize: "13px",
                        color: colors.textSecondary,
                        marginTop: "2px",
                        textAlign: "left",
                    }}
                >
                    {description}
                </p>
            </div>

            <div style={{ flexShrink: 0 }}>
                {trailing ?? <ChevronRight size={18} color={colors.textMuted} />}
            </div>
        </div>
    );
}

