import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-slate-950 text-slate-100">
            <Sidebar role={user.role} />
            <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8 transition duration-200 ease-out">
                <div className="min-h-[calc(100vh-5rem)]">{children}</div>
            </main>
        </div>
    );
}
