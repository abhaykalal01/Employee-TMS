"use client";

import { memo, useCallback } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = memo(function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const toggleTheme = useCallback(() => {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
    }, [setTheme]);

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
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
                boxShadow: "0 6px 16px -8px var(--shadow-soft)",
            }}
        >
            {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
    );
});

export default ThemeToggle;
