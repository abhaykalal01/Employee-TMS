import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getCurrentUser";

export default async function NotificationsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div style={{ minHeight: "100vh", background: "#0a0a12", color: "#f3f4f6", padding: "28px 20px 64px" }}>
            <div style={{ maxWidth: "760px", margin: "0 auto" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: "#54565f", marginBottom: "12px" }}>
                    DASHBOARD / <span style={{ color: "#c4b5fd" }}>NOTIFICATIONS</span>
                </div>
                <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 8px" }}>Notifications</h1>
                <p style={{ fontSize: "13px", color: "#9295a3", margin: 0 }}>
                    Notification preferences will appear here soon.
                </p>
            </div>
        </div>
    );
}
