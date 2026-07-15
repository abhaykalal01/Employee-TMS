"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Bell, X, Trash2, Check, CheckCheck } from "lucide-react";
import { io } from "socket.io-client";
import { usePathname, useRouter } from "next/navigation";

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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const dropdownRef = useRef(null);

    // Socket.IO connection and notification loading
    useEffect(() => {
        const userId = readUserId();

        // Set mounted only if user is authenticated
        if (!userId) {
            setIsAuthenticated(false);
            setMounted(false);
            return;
        }

        setIsAuthenticated(true);
        setMounted(true);

        async function loadNotifications() {
            try {
                const res = await fetch("/api/notifications");
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount((data.notifications || []).filter((item) => !item.isRead).length);
            } catch (error) {
                console.error("Failed to load notifications:", error);
            }
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

    const formatFullDate = (value) => {
        const date = new Date(value);
        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const markAllRead = async () => {
        await fetch("/api/notifications", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ markAllRead: true }),
        });
        setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true, readAt: new Date() })));
        setUnreadCount(0);
    };

    const markAsRead = async (notificationId) => {
        await fetch("/api/notifications", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action: "mark-read", notificationId }),
        });
        setNotifications((prev) =>
            prev.map((item) =>
                item._id === notificationId ? { ...item, isRead: true, readAt: new Date() } : item
            )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const deleteNotification = async (notificationId, event) => {
        event.stopPropagation();
        await fetch("/api/notifications", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action: "delete", notificationId }),
        });
        setNotifications((prev) => prev.filter((item) => item._id !== notificationId));
        setUnreadCount((prev) => {
            const notification = notifications.find((n) => n._id === notificationId);
            return notification && !notification.isRead ? Math.max(0, prev - 1) : prev;
        });
    };

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification._id);
        }
        if (notification.taskId) {
            setOpen(false);
            router.push(`/dashboard/tasks/${notification.taskId}`);
        }
    };

    const visibleNotifications = useMemo(() => notifications.slice(0, 15), [notifications]);

    // Don't render anything until we know authentication status
    if (!mounted || !isAuthenticated) {
        return null;
    }

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
                {unreadCount > 0 && (
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
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "calc(100% + 8px)",
                        width: "380px",
                        maxHeight: "500px",
                        overflowY: "auto",
                        background: "var(--app-surface)",
                        border: "1px solid var(--app-border)",
                        borderRadius: "16px",
                        boxShadow: "0 16px 40px -20px var(--shadow-soft)",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "14px 16px",
                            borderBottom: "1px solid var(--app-border)",
                            position: "sticky",
                            top: 0,
                            background: "var(--app-surface)",
                            zIndex: 1,
                        }}
                    >
                        <strong style={{ color: "var(--app-text)", fontSize: "15px" }}>Notifications</strong>
                        <button
                            type="button"
                            onClick={markAllRead}
                            disabled={unreadCount === 0}
                            style={{
                                color: unreadCount === 0 ? "var(--app-text-muted)" : "#a78bfa",
                                background: "transparent",
                                border: "none",
                                cursor: unreadCount === 0 ? "not-allowed" : "pointer",
                                fontSize: "12px",
                                fontWeight: 600,
                            }}
                        >
                            Mark all read
                        </button>
                    </div>
                    {visibleNotifications.length === 0 ? (
                        <div style={{ padding: "32px 16px", color: "var(--app-text-muted)", fontSize: "13px", textAlign: "center" }}>
                            No notifications yet.
                        </div>
                    ) : (
                        visibleNotifications.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => handleNotificationClick(item)}
                                style={{
                                    padding: "14px 16px",
                                    borderBottom: "1px solid var(--app-border)",
                                    background: item.isRead ? "transparent" : "rgba(37, 99, 235, 0.06)",
                                    cursor: item.taskId ? "pointer" : "default",
                                    position: "relative",
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "6px" }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                                            <strong style={{ fontSize: "13px", color: "var(--app-text)" }}>
                                                {item.senderName}
                                            </strong>
                                            {!item.isRead && (
                                                <span
                                                    style={{
                                                        width: "8px",
                                                        height: "8px",
                                                        borderRadius: "50%",
                                                        background: "#60a5fa",
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <p style={{ margin: "0 0 6px", fontSize: "13px", color: "var(--app-text-secondary)", lineHeight: 1.5 }}>
                                            {item.message}
                                        </p>
                                        {item.taskTitle && (
                                            <div
                                                style={{
                                                    fontSize: "11px",
                                                    color: "#c4b5fd",
                                                    background: "rgba(124, 58, 237, 0.1)",
                                                    padding: "3px 8px",
                                                    borderRadius: "6px",
                                                    display: "inline-block",
                                                    marginBottom: "6px",
                                                }}
                                            >
                                                Task: {item.taskTitle}
                                            </div>
                                        )}
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                                            <span style={{ fontSize: "11px", color: "var(--app-text-muted)" }}>
                                                {formatFullDate(item.createdAt)}
                                            </span>
                                            <span style={{ fontSize: "11px", color: item.isRead ? "#6ee7b7" : "var(--app-text-muted)", display: "flex", alignItems: "center", gap: "2px" }}>
                                                {item.isRead ? (
                                                    <>
                                                        <CheckCheck size={12} style={{ color: "#60a5fa" }} /> Read
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check size={12} /> Sent
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => deleteNotification(item._id, e)}
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            color: "var(--app-text-muted)",
                                            cursor: "pointer",
                                            padding: "4px",
                                            display: "flex",
                                            alignItems: "center",
                                            flexShrink: 0,
                                        }}
                                        aria-label="Delete notification"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
