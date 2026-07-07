"use client";

import { useState } from "react";
import { Mail, Send, Check, AlertCircle, Loader2 } from "lucide-react";

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

const emailTypes = [
    {
        id: "connection",
        name: "Connection Test",
        description: "Test basic SMTP connectivity",
        icon: "🔌",
    },
    {
        id: "welcome",
        name: "Welcome Email",
        description: "Sent when a new employee is created",
        icon: "👋",
    },
    {
        id: "taskAssigned",
        name: "Task Assigned",
        description: "Sent when admin assigns a task to an employee",
        icon: "📋",
    },
    {
        id: "taskStatusChanged",
        name: "Task Status Changed",
        description: "Sent when task status is updated",
        icon: "🔄",
    },
    {
        id: "passwordReset",
        name: "Password Reset",
        description: "Sent when user requests password reset",
        icon: "🔑",
    },
    {
        id: "roleChanged",
        name: "Role Changed",
        description: "Sent when admin changes an employee's role",
        icon: "👤",
    },
];

export default function EmailTestPage() {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState({});
    const [email, setEmail] = useState("");

    async function testEmail(type) {
        setLoading(true);
        setResults((prev) => ({ ...prev, [type]: { status: "loading" } }));

        try {
            const response = await fetch("/api/test-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, email: email || undefined }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setResults((prev) => ({
                    ...prev,
                    [type]: { status: "success", message: data.message },
                }));
            } else {
                setResults((prev) => ({
                    ...prev,
                    [type]: { status: "error", message: data.error || data.message },
                }));
            }
        } catch (error) {
            setResults((prev) => ({
                ...prev,
                [type]: { status: "error", message: "Network error occurred" },
            }));
        } finally {
            setLoading(false);
        }
    }

    async function testAllEmails() {
        setLoading(true);
        setResults({});

        for (const emailType of emailTypes) {
            await testEmail(emailType.id);
            // Small delay between emails to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 500));
        }

        setLoading(false);
    }

    return (
        <div style={{ background: c.bg, minHeight: "100vh", color: c.text }}>
            <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "28px 20px 48px" }}>
                {/* Header */}
                <div style={{ marginBottom: "24px" }}>
                    <div
                        style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            color: c.textMuted,
                        }}
                    >
                        SETTINGS&nbsp;/&nbsp;<span style={{ color: "#c4b5fd" }}>EMAIL TEST</span>
                    </div>
                    <h1
                        style={{
                            fontSize: "24px",
                            fontWeight: 700,
                            letterSpacing: "-0.01em",
                            margin: "6px 0 0",
                        }}
                    >
                        Email System Test
                    </h1>
                    <p style={{ fontSize: "13px", color: c.textSecondary, marginTop: "4px" }}>
                        Test your SMTP configuration and email templates
                    </p>
                </div>

                {/* Email Input & Test All Button */}
                <div
                    style={{
                        background: c.surface,
                        border: `1px solid ${c.border}`,
                        borderRadius: "14px",
                        padding: "20px",
                        marginBottom: "20px",
                    }}
                >
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-end" }}>
                        <div style={{ flex: "1 1 300px" }}>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    color: c.textSecondary,
                                    marginBottom: "8px",
                                }}
                            >
                                Test Email Recipient (optional)
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Leave empty to use your account email"
                                style={{
                                    width: "100%",
                                    padding: "10px 14px",
                                    borderRadius: "10px",
                                    border: `1px solid ${c.border}`,
                                    background: c.bg,
                                    color: c.text,
                                    fontSize: "13px",
                                    outline: "none",
                                }}
                            />
                        </div>
                        <button
                            onClick={testAllEmails}
                            disabled={loading}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "10px 20px",
                                borderRadius: "10px",
                                border: "none",
                                background: `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})`,
                                color: "#fff",
                                fontSize: "13px",
                                fontWeight: 600,
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.6 : 1,
                                boxShadow: "0 8px 20px -8px rgba(124, 58, 237, 0.5)",
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Testing...
                                </>
                            ) : (
                                <>
                                    <Send size={16} /> Test All Emails
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Email Test Cards */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                        gap: "16px",
                    }}
                >
                    {emailTypes.map((emailType) => {
                        const result = results[emailType.id];
                        const isLoading = result?.status === "loading";
                        const isSuccess = result?.status === "success";
                        const isError = result?.status === "error";

                        return (
                            <div
                                key={emailType.id}
                                style={{
                                    background: c.surface,
                                    border: `1px solid ${c.border}`,
                                    borderRadius: "14px",
                                    padding: "20px",
                                    position: "relative",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        marginBottom: "12px",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <div
                                            style={{
                                                fontSize: "24px",
                                                width: "40px",
                                                height: "40px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                background: "rgba(255, 255, 255, 0.05)",
                                                borderRadius: "10px",
                                            }}
                                        >
                                            {emailType.icon}
                                        </div>
                                        <div>
                                            <h3
                                                style={{
                                                    fontSize: "14px",
                                                    fontWeight: 700,
                                                    color: c.text,
                                                    margin: 0,
                                                }}
                                            >
                                                {emailType.name}
                                            </h3>
                                        </div>
                                    </div>
                                    {isSuccess && <Check size={20} color="#6ee7b7" />}
                                    {isError && <AlertCircle size={20} color="#fca5a5" />}
                                    {isLoading && <Loader2 size={20} color="#c4b5fd" className="animate-spin" />}
                                </div>

                                <p
                                    style={{
                                        fontSize: "12px",
                                        color: c.textSecondary,
                                        margin: "0 0 16px",
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {emailType.description}
                                </p>

                                {result?.message && (
                                    <div
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: "8px",
                                            fontSize: "11px",
                                            marginBottom: "12px",
                                            background: isSuccess
                                                ? "rgba(52, 211, 153, 0.1)"
                                                : "rgba(239, 68, 68, 0.1)",
                                            color: isSuccess ? "#6ee7b7" : "#fca5a5",
                                            border: `1px solid ${
                                                isSuccess ? "rgba(52, 211, 153, 0.25)" : "rgba(239, 68, 68, 0.25)"
                                            }`,
                                        }}
                                    >
                                        {result.message}
                                    </div>
                                )}

                                <button
                                    onClick={() => testEmail(emailType.id)}
                                    disabled={loading}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "8px",
                                        border: `1px solid ${c.border}`,
                                        background: "rgba(255, 255, 255, 0.05)",
                                        color: c.text,
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        cursor: loading ? "not-allowed" : "pointer",
                                        opacity: loading ? 0.6 : 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "6px",
                                    }}
                                >
                                    <Mail size={14} /> Test This Email
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Configuration Info */}
                <div
                    style={{
                        marginTop: "32px",
                        background: c.surface,
                        border: `1px solid ${c.border}`,
                        borderRadius: "14px",
                        padding: "20px",
                    }}
                >
                    <h3 style={{ fontSize: "14px", fontWeight: 700, color: c.text, marginBottom: "12px" }}>
                        📋 SMTP Configuration
                    </h3>
                    <p style={{ fontSize: "12px", color: c.textSecondary, margin: "0 0 12px" }}>
                        Make sure these environment variables are set in your <code>.env.local</code> file:
                    </p>
                    <ul
                        style={{
                            fontSize: "12px",
                            color: c.textSecondary,
                            margin: 0,
                            paddingLeft: "20px",
                            lineHeight: 1.8,
                        }}
                    >
                        <li>
                            <code style={{ color: "#c4b5fd" }}>SMTP_HOST</code> - Your SMTP server (e.g., smtp.gmail.com)
                        </li>
                        <li>
                            <code style={{ color: "#c4b5fd" }}>SMTP_PORT</code> - SMTP port (usually 587)
                        </li>
                        <li>
                            <code style={{ color: "#c4b5fd" }}>SMTP_USER</code> - Your email address
                        </li>
                        <li>
                            <code style={{ color: "#c4b5fd" }}>SMTP_PASS</code> - Your email password or app-specific password
                        </li>
                        <li>
                            <code style={{ color: "#c4b5fd" }}>SMTP_FROM_EMAIL</code> - Sender email address
                        </li>
                        <li>
                            <code style={{ color: "#c4b5fd" }}>SMTP_FROM_NAME</code> - Sender name (optional)
                        </li>
                    </ul>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
}
