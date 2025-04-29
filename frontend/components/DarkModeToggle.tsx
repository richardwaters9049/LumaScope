// frontend/components/DarkModeToggle.tsx
"use client";

import { useState, useEffect } from 'react';

const DarkModeToggle = () => {
    // Check the user's system preference initially
    const [darkMode, setDarkMode] = useState<boolean>(false);

    useEffect(() => {
        // If the user has previously set their preference, use it
        const savedPreference = localStorage.getItem('darkMode');
        if (savedPreference) {
            setDarkMode(JSON.parse(savedPreference));
        } else {
            setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
    }, []);

    useEffect(() => {
        // Update the document class based on the darkMode state
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    }, [darkMode]);

    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-gray-200 rounded-full dark:bg-gray-700 transition-all duration-300"
        >
            {darkMode ? (
                <span role="img" aria-label="light mode">🌤️</span>
            ) : (
                <span role="img" aria-label="dark mode">🌜</span>
            )}
        </button>
    );
};

export default DarkModeToggle;
