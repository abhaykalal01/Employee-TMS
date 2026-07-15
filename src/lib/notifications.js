import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { emitNotification as emitSocketNotification } from "@/lib/socket";

export async function createNotification({ senderId, receiverId, senderName, message, type, taskId = null, taskTitle = null }) {
    if (!senderId || !receiverId) {
        return null;
    }

    await connectDB();

    const notification = await Notification.create({
        senderId,
        receiverId,
        senderName,
        message,
        type,
        taskId,
        taskTitle,
    });

    return notification;
}

export async function getUserNotifications(userId) {
    await connectDB();

    const notifications = await Notification.find({ receiverId: userId })
        .sort({ createdAt: -1 })
        .lean();

    return notifications.map((item) => ({
        ...item,
        _id: item._id.toString(),
        senderId: item.senderId?.toString(),
        receiverId: item.receiverId?.toString(),
        taskId: item.taskId?.toString() || null,
    }));
}

export async function markNotificationAsRead(notificationId, userId) {
    await connectDB();

    const notification = await Notification.findOne({ _id: notificationId, receiverId: userId });

    if (!notification) {
        return null;
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    return notification;
}

export async function markNotificationsAsRead(userId) {
    await connectDB();

    return Notification.updateMany(
        { receiverId: userId, isRead: false },
        { isRead: true, readAt: new Date() }
    );
}

export async function deleteNotification(notificationId, userId) {
    await connectDB();

    return Notification.deleteOne({ _id: notificationId, receiverId: userId });
}

export async function getUnreadCount(userId) {
    await connectDB();

    return Notification.countDocuments({ receiverId: userId, isRead: false });
}

export async function getNotificationRecipients(task, actor, action) {
    const actorRole = actor?.role || "employee";

    if (action === "admin_task") {
        if (task?.assignedTo) {
            return [{ userId: task.assignedTo.toString(), role: "employee" }];
        }
        return [];
    }

    if (action === "employee_activity") {
        const admins = await User.find({ role: "admin" }).select("_id");
        return admins.map((admin) => ({ userId: admin._id.toString(), role: "admin" }));
    }

    return [];
}

export function emitNotification({ userId, notification }) {
    emitSocketNotification({ userId, notification });
}
