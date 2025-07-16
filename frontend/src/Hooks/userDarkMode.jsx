import { useState, useEffect, useCallback } from "react";

export default function useDarkMode() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const stored = localStorage.getItem("theme");
        if (stored) return stored === "dark";
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    const toggleDarkMode = useCallback(() => {
        setIsDarkMode(prev => {
            const next = !prev;
            document.documentElement.classList.toggle("dark", next);
            localStorage.setItem("theme", next ? "dark" : "light");
            return next;
        });
    }, []);

    // Apply theme class on mount & updates
    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);

    return [isDarkMode, toggleDarkMode];
}