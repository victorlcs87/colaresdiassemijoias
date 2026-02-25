"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    // We need to wait for component to mount to avoid hydration mismatch
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#1e362a] shadow-sm">
                <span className="sr-only">Carregando tema</span>
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#1e362a] hover:bg-slate-100 dark:hover:bg-[#2a4538] transition-colors shadow-sm text-slate-900 dark:text-slate-100"
            aria-label="Alternar tema"
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
    );
}
