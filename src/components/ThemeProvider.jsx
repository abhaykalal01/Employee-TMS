"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        try {
            const storedTheme = window.localStorage.getItem("employee-tms-theme");
            const initialTheme = storedTheme === "light" ? "light" : "dark";
            setTheme(initialTheme);
            document.documentElement.setAttribute("data-theme", initialTheme);
            document.documentElement.style.colorScheme = initialTheme;
            window.localStorage.setItem("employee-tms-theme", initialTheme);
            document.cookie = `employee-tms-theme=${initialTheme}; path=/; max-age=31536000; SameSite=Lax`;
        } catch (error) {
            console.warn("Theme initialization failed", error);
        } finally {
            setMounted(true);
        }
    }, []);

    useEffect(() => {
        if (!mounted) {
            return;
        }

        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.style.colorScheme = theme;
        window.localStorage.setItem("employee-tms-theme", theme);
        document.cookie = `employee-tms-theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
    }, [mounted, theme]);

    const value = useMemo(() => ({ theme, setTheme }), [theme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used inside a ThemeProvider");
    }

    return context;
}
