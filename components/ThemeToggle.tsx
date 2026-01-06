
import React, { useEffect, useState } from 'react';
import { Icons } from './Icons';

const ThemeToggle: React.FC = () => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Initialize based on HTML class or system pref
        if (document.documentElement.classList.contains('dark')) {
            setIsDark(true);
        } else {
            setIsDark(false);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-neutral-800"
            title={isDark ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
        >
            {isDark ? (
                <Icons.Sun className="w-5 h-5" />
            ) : (
                <Icons.Moon className="w-5 h-5 text-neon" />
            )}
        </button>
    );
};

export default ThemeToggle;
