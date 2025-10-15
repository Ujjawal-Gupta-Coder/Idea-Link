"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative cursor-pointer inline-flex h-12 w-24 items-center rounded-full bg-gray-300 dark:bg-gray-700 p-1 transition-colors duration-300 hover:ring-2 hover:ring-indigo-500"
    >
      {/* Sliding circle */}
      <span
        className={"absolute left-1 h-10 w-10 rounded-full bg-white shadow-md transform transition-transform duration-300 dark:translate-x-12 dark:bg-gray-900"}
      />

      {/* Sun & Moon icons */} 
      <span className="absolute left-2 text-yellow-400 text-lg">{"☀️"}</span>
      <span className="absolute right-2 text-gray-800 dark:text-gray-200 text-lg">{"🌙"}</span>
    </button>
  );
}
