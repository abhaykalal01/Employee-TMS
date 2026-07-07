"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { io } from "socket.io-client";
import { usePathname } from "next/navigation";

function readUserId() {
    if (typeof document === "undefined") {
        return null;
    }

    const cookies = document.cookie.split(";").map((item) => item.trim());
    const userIdCookie = cookies.find((item) => item.startsWith("userId="));

    return userIdCookie ? decodeURIComponent(userIdCookie.split("=")[1]) : null;
}

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const dropdownRef = useRef(null);

    // Socket.IO connection and notification loading
    useEffect(() => {
        setMounted(true);

        const userId = readUserId();

        if (!userId) {
            return;
        }

        async function loadNotifications() {
            const res = await fetch("/api/notifications");
            const data = await res.json();
            setNotifications(data.notifications || []);
            setUnreadCount((data.notifications || []).filter((item) => !item.isRead).length);
        }

        loadNotifications();

        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000", { transports: ["websocket"] });
        socket.on("connect", () => {
            socket.emit("authenticate", { userId });
        });

        socket.on("notification:new", (notification) => {
            setNotifications((prev) => [notification, ...prev]);
            setUnreadCount((prev) => prev + 1);
        });

        return () => {
            socket.disconnect();
        };
    }, [pathname]);

    // Click outside to close dropdown
    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        // Small delay to prevent immediate closing from the click that opened it
        const timer = setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
        }, 0);

        return () => {
            clearTimeout(timer);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    // Escape key to close dropdown
    useEffect(() => {
        if (!open) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [open]);

    const formatTime = (value) => {
        const date = new Date(value);
        const diff = Math.max(1, Math.round((Date.now() - date.getTime()) / 60000));
        if (diff < 60) return `${diff} min ago`;
        const hours = Math.round(diff / 60);
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        const days = Math.round(hours / 24);
        return `${days} day${days > 1 ? "s" : ""} ago`;
    };

    const markAllRead = async () => {
        await fetch("/api/notifications", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ markAllRead: true }),
        });
        setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
        setUnreadCount(0);
    };

    const visibleNotifications = useMemo(() => notifications.slice(0, 8), [notifications]);

    return (
        <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Open notifications"
                aria-expanded={open}
                aria-haspopup="true"
                style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "44px",
                    height: "44px",
                    borderRadius: "999px",
                    border: "1px solid var(--app-border)",
                    background: "var(--app-surface)",
                    color: "var(--app-text)",
                    cursor: "pointer",
                }}
            >
                <Bell size={18} />
                {mounted && unreadCount > 0 && (
                    <span
                        style={{
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            minWidth: "18px",
                            height: "18px",
                            padding: "0 5px",
                            borderRadius: "999px",
                            background: "linear-gradient(135deg, var(--accent-from), var(--accent-to))",
                            color: "#fff",
                            fontSize: "10px",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {unreadCount}
                    </span>
                )}
            </button>

            {mounted && open && (
                <div
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "calc(100% + 8px)",
                        width: "320px",
                        maxHeight: "420px",
                        overflowY: "auto",
                        background: "var(--app-surface)",
                        border: "1px solid var(--app-border)",
                        borderRadius: "16px",
                        boxShadow: "0 16px 40px -20px var(--shadow-soft)",
                        zIndex: 1000,
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderBottom: "1px solid var(--app-border)" }}>
                        <strong style={{ color: "var(--app-text)" }}>Notifications</strong>
                        <button type="button" onClick={markAllRead} style={{ color: "var(--app-text-secondary)", background: "transparent", border: "none", cursor: "pointer", fontSize: "12px" }}>
                            Mark all read
                        </button>
                    </div>
                    {visibleNotifications.length === 0 ? (
                        <div style={{ padding: "16px", color: "var(--app-text-muted)", fontSize: "13px" }}>No notifications yet.</div>
                    ) : (
                        visibleNotifications.map((item) => (
                            <div key={item._id} style={{ padding: "12px 14px", borderBottom: "1px solid var(--app-border)", background: item.isRead ? "transparent" : "rgba(37, 99, 235, 0.08)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                                    <strong style={{ fontSize: "13px", color: "var(--app-text)" }}>{item.senderName}</strong>
                                    <span style={{ fontSize: "11px", color: "var(--app-text-muted)" }}>{formatTime(item.createdAt)}</span>
                                </div>
                                <p style={{ margin: "6px 0 0", fontSize: "13px", color: "var(--app-text-secondary)" }}>{item.message}</p>
                                <div style={{ marginTop: "8px", fontSize: "11px", color: item.isRead ? "var(--app-text-muted)" : "#60a5fa" }}>
                                    {item.isRead ? "Read" : "Unread"}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
