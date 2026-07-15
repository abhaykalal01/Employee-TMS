import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getUserNotifications, markNotificationsAsRead, markNotificationAsRead, deleteNotification } from "@/lib/notifications";

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ notifications: [] }, { status: 200 });
        }

        const notifications = await getUserNotifications(user._id);

        return NextResponse.json({ notifications });
    } catch (error) {
        console.error("GET /api/notifications error:", error);
        return NextResponse.json({ notifications: [] }, { status: 200 });
    }
}

export async function POST(request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { markAllRead, notificationId, action } = body;

        // Mark all as read
        if (markAllRead) {
            await markNotificationsAsRead(user._id);
            return NextResponse.json({ success: true });
        }

        // Mark single notification as read
        if (action === "mark-read" && notificationId) {
            const notification = await markNotificationAsRead(notificationId, user._id);
            return NextResponse.json({ success: true, notification });
        }

        // Delete notification
        if (action === "delete" && notificationId) {
            await deleteNotification(notificationId, user._id);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("POST /api/notifications error:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}
