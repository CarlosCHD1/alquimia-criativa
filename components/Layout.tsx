import React from 'react';
import Sidebar from './Sidebar';
import { AppMode } from '../types';

interface LayoutProps {
    children: React.ReactNode;
    mode: AppMode;
    setMode: (mode: AppMode) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, mode, setMode }) => {
    return (
        <div className="flex h-screen bg-transparent text-white overflow-hidden selection:bg-neon selection:text-black">
            <Sidebar currentMode={mode} setMode={setMode} />

            <main className="flex-1 overflow-y-auto bg-transparent relative">
                <div className="relative z-10 p-4 md:p-6 min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
