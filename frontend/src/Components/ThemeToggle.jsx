import React from "react";
import useDarkMode from "../Hooks/userDarkMode";

export default function ThemeToggle() {
    const [isDark, toggleDark] = useDarkMode();

    return (
        <button
            onClick={toggleDark}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-blue-500 dark:text-gray-200 shadow transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
            {isDark ? (
                // Sun icon for light mode
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" className="text-blue-400" />
                    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07 7.07l-1.42-1.42M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" />
                </svg>
            ) : (
                // Moon icon for dark mode
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
            )}
        </button>
    );
}
