"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

const c = {
    bg: "var(--app-bg)",
    surface: "var(--app-surface)",
    border: "var(--app-border)",
    text: "var(--app-text)",
    textSecondary: "var(--app-text-secondary)",
    accentFrom: "var(--accent-from)",
    accentTo: "var(--accent-to)",
};

export default function EmployeesError({ error, reset }) {
    useEffect(() => {
        console.error("Employees page error:", error);
    }, [error]);

    return (
        <div style={{ background: c.bg, minHeight: "100vh", color: c.text }}>
            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 20px" }}>
                <div
                    style={{
                        background: c.surface,
                        border: `1px solid ${c.border}`,
                        borderRadius: "16px",
                        padding: "48px 32px",
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "16px",
                            background: "rgba(239,68,68,0.1)",
                            border: "1px solid rgba(239,68,68,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 20px",
                        }}
                    >
                        <AlertCircle size={32} color="#fca5a5" />
                    </div>

                    <h2
                        style={{
                            fontSize: "20px",
                            fontWeight: 700,
                            color: c.text,
                            margin: "0 0 8px",
                        }}
                    >
                        Failed to load employees
                    </h2>

                    <p
                        style={{
                            fontSize: "14px",
                            color: c.textSecondary,
                            margin: "0 0 24px",
                            maxWidth: "400px",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        We couldn&apos;t load the employee directory. Please try again or check back later.
                    </p>

                    {process.env.NODE_ENV === "development" && error?.message && (
                        <div
                            style={{
                                background: "rgba(239,68,68,0.05)",
                                border: "1px solid rgba(239,68,68,0.2)",
                                borderRadius: "8px",
                                padding: "12px 16px",
                                marginBottom: "24px",
                                textAlign: "left",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    color: "#fca5a5",
                                    margin: "0 0 6px",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                ERROR DETAILS (DEV ONLY)
                            </p>
                            <p
                                style={{
                                    fontSize: "12px",
                                    color: c.textSecondary,
                                    margin: 0,
                                    fontFamily: "monospace",
                                    wordBreak: "break-word",
                                }}
                            >
                                {error.message}
                            </p>
                        </div>
                    )}

                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            justifyContent: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <button
                            onClick={reset}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#fff",
                                background: `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})`,
                                border: "none",
                                borderRadius: "10px",
                                padding: "12px 20px",
                                cursor: "pointer",
                                boxShadow: "0 8px 20px -8px rgba(124,58,237,0.5)",
                                transition: "transform 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-1px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            <RefreshCw size={16} />
                            Try Again
                        </button>

                        <Link
                            href="/dashboard"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                fontSize: "14px",
                                fontWeight: 600,
                                color: c.text,
                                background: "transparent",
                                border: `1px solid ${c.border}`,
                                borderRadius: "10px",
                                padding: "12px 20px",
                                textDecoration: "none",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                            }}
                        >
                            <Home size={16} />
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
