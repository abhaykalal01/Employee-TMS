import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata = {
    title: "Employee TMS | Premium Task Operations",
    description: "A premium dark UI task management platform for teams that need clarity, velocity, and control.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="min-h-screen" style={{ background: "var(--app-bg)", color: "var(--app-text)" }}>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function () {
                                try {
                                    const storedTheme = localStorage.getItem('employee-tms-theme');
                                    const theme = storedTheme === 'light' ? 'light' : 'dark';
                                    document.documentElement.setAttribute('data-theme', theme);
                                    document.documentElement.style.colorScheme = theme;
                                } catch (error) {}
                            })();
                        `,
                    }}
                />
                <ThemeProvider>
                    <Navbar />
                    <div className="pt-16">
                        {children}
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}