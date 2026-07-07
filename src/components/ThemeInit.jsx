"use client";

import { useEffect } from "react";

export default function ThemeInit() {
    useEffect(() => {
        try {
            const storedTheme = window.localStorage.getItem("employee-tms-theme");
            const theme = storedTheme === "light" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", theme);
            document.documentElement.style.colorScheme = theme;
        } catch (error) {
            console.warn("Theme init failed", error);
        }
    }, []);

    return null;
}
