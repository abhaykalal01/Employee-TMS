import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
    title: "Employee TMS | Premium Task Operations",
    description: "A premium dark UI task management platform for teams that need clarity, velocity, and control.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-slate-950 text-slate-100 min-h-screen">
                <Navbar />
                <div className="pt-16">
                    {children}
                </div>
            </body>
        </html>
    );
}