import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { AppMode } from '../types';
import { Icons } from './Icons';

interface LayoutProps {
    children: React.ReactNode;
    mode: AppMode;
    setMode: (mode: AppMode) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, mode, setMode }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-transparent text-white overflow-hidden selection:bg-neon selection:text-black">
            <Sidebar
                currentMode={mode}
                setMode={setMode}
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            <main className="flex-1 overflow-y-auto bg-transparent relative flex flex-col">
                {/* Mobile Header for Menu Toggle */}
                <div className="md:hidden p-4 pb-0 flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 bg-neutral-900/50 border border-white/10 rounded-lg text-white hover:bg-white/10 active:scale-95 transition-all"
                        >
                            <Icons.Menu className="w-6 h-6" />
                        </button>
                        <img src="/logo-white.jpg" alt="Alquimia" className="h-8 ml-4 object-contain" />
                    </div>
                </div>

                <div className="relative z-10 p-4 md:p-6 min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
