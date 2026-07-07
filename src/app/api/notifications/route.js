import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getUserNotifications, markNotificationsAsRead } from "@/lib/notifications";

export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await getUserNotifications(user._id);

    return NextResponse.json({ notifications });
}

export async function POST(request) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (body?.markAllRead) {
        await markNotificationsAsRead(user._id);
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false });
}
