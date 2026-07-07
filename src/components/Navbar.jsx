"use client";

import { memo, useCallback } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/NotificationBell";

const Navbar = memo(function Navbar() {
    const openSidebar = useCallback(() => {
        if (typeof window === "undefined") return;
        window.dispatchEvent(new CustomEvent("sidebar-toggle"));
    }, []);

    return (
        <nav
            className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl shadow-sm"
            style={{
                borderColor: "var(--app-border)",
                background: "color-mix(in srgb, var(--app-surface) 90%, transparent)",
                color: "var(--app-text)",
                boxShadow: "0 8px 24px -18px var(--shadow-soft)",
            }}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-fuchsia-500 text-base font-bold text-white shadow-lg shadow-slate-900/20">
                        E
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-base font-semibold" style={{ color: "var(--app-text)" }}>Employee TMS</span>
                        <span className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--app-text-muted)" }}>Premium Ops</span>
                    </div>
                </Link>

                <div className="hidden items-center gap-4 md:flex">
                    <Link href="/" className="text-sm font-medium" style={{ color: "var(--app-text-secondary)" }}>Home</Link>
                    <Link href="/dashboard" className="text-sm font-medium" style={{ color: "var(--app-text-secondary)" }}>Dashboard</Link>
                    <NotificationBell />
                    <ThemeToggle />
                    <Link
                        href="/login"
                        className="rounded-full border px-4 py-2 text-sm font-semibold text-white"
                        style={{
                            borderColor: "var(--app-border)",
                            background: "linear-gradient(135deg, var(--accent-from), var(--accent-to))",
                            color: "#fff",
                            boxShadow: "0 10px 24px -12px rgba(37, 99, 235, 0.32)",
                        }}
                    >
                        Sign In
                    </Link>
                </div>

                <div className="flex items-center gap-2 md:hidden">
                    <NotificationBell />
                    <ThemeToggle />
                    <button
                        aria-label="Open sidebar"
                        onClick={openSidebar}
                        className="rounded-full border p-2 shadow-sm"
                        style={{
                            borderColor: "var(--app-border)",
                            background: "var(--app-surface)",
                            color: "var(--app-text)",
                        }}
                    >
                        ☰
                    </button>
                </div>
            </div>
        </nav>
    );
});

export default Navbar;
