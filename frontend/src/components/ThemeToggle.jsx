import React from "react";
import useDarkMode from "../Hooks/userDarkMode";

export default function ThemeToggle() {
    const [isDark, toggleDark] = useDarkMode();

    return (
        <button
            onClick={toggleDark}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
            {isDark ? "Switch to Light" : "Switch to Dark"}
        </button>
    );
}
