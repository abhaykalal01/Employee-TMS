"use client";

import Link from "next/link";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CheckSquare,
    PlusCircle,
    User,
    Users,
    BarChart3,
    Settings,
    X,
} from "lucide-react";
import { getSidebarItems } from "@/lib/getSidebarItems";

const iconMap = {
    LayoutDashboard,
    CheckSquare,
    PlusCircle,
    User,
    Users,
    BarChart3,
    Settings,
};

const colors = {
    bg: "var(--app-surface)",
    border: "var(--app-border)",
    textPrimary: "var(--app-text)",
    textSecondary: "var(--app-text-secondary)",
    textMuted: "var(--app-text-muted)",
    activeBg: "linear-gradient(135deg, #7c3aed, #2563eb)",
    hoverBg: "color-mix(in srgb, var(--accent-from) 12%, transparent)",
};

const Sidebar = memo(function Sidebar({ role = "employee" }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const navItems = useMemo(() => getSidebarItems(role), [role]);

    useEffect(() => {
        const handleToggle = () => setIsOpen((open) => !open);
        window.addEventListener("sidebar-toggle", handleToggle);
        return () => window.removeEventListener("sidebar-toggle", handleToggle);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const closeSidebar = useCallback(() => setIsOpen(false), []);

    const navLinks = useMemo(
        () =>
            navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = iconMap[item.icon] || LayoutDashboard;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeSidebar}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "11px 14px",
                            borderRadius: "10px",
                            fontSize: "14px",
                            fontWeight: isActive ? 600 : 500,
                            color: isActive ? "#fff" : colors.textSecondary,
                            background: isActive ? colors.activeBg : "transparent",
                            boxShadow: isActive ? "0 6px 16px -4px rgba(124,58,237,0.45)" : "none",
                            transition: "background-color 0.15s, color 0.15s",
                            textDecoration: "none",
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive) e.currentTarget.style.background = colors.hoverBg;
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive) e.currentTarget.style.background = "transparent";
                        }}
                    >
                        <Icon size={17} strokeWidth={2} style={{ flexShrink: 0 }} />
                        <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
                    </Link>
                );
            }),
        [closeSidebar, navItems, pathname]
    );

    return (
        <>
            <aside
                className={`fixed inset-y-16 left-0 z-50 w-72 max-w-xs transform overflow-y-auto transition-transform duration-300 ease-in-out md:static md:top-0 md:left-0 md:w-64 md:max-w-none md:h-[calc(100vh-4rem)] md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                style={{
                    background: colors.bg,
                    borderRight: `1px solid ${colors.border}`,
                    boxShadow: isOpen ? "20px 0 40px -20px rgba(0,0,0,0.5)" : "none",
                }}
            >
                <div style={{ padding: "24px 16px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h2
                        style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            color: colors.textMuted,
                            margin: 0,
                        }}
                    >
                        MENU
                    </h2>
                    <button
                        onClick={closeSidebar}
                        className="md:hidden"
                        style={{
                            color: colors.textMuted,
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            display: "flex",
                        }}
                        aria-label="Close menu"
                    >
                        <X size={18} />
                    </button>
                </div>

                <nav style={{ display: "flex", flexDirection: "column", gap: "3px", padding: "0 12px" }}>
                    {navLinks}
                </nav>

                <div
                    style={{
                        margin: "20px 16px 16px",
                        paddingTop: "16px",
                        borderTop: `1px solid ${colors.border}`,
                    }}
                >
                    <p style={{ fontSize: "11px", color: colors.textMuted, margin: 0 }}>
                        Employee TMS · v1.0
                    </p>
                    <p style={{ fontSize: "10px", color: colors.textMuted, margin: "4px 0 0", textTransform: "capitalize" }}>
                        Role: {role}
                    </p>
                </div>
            </aside>

            {isOpen && (
                <div
                    className="fixed inset-0 z-40 md:hidden"
                    style={{ background: "rgba(5,5,10,0.7)", backdropFilter: "blur(4px)" }}
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}
        </>
    );
});

export default Sidebar;