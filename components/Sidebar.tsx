import React, { useEffect } from 'react';
import { AppMode } from '../types';
import ThemeToggle from './ThemeToggle';
import { Icons } from './Icons';
import { creditService } from '../services/creditService';
import PricingModal from './PricingModal';
import { useTutorial } from './TutorialContext';

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode, isOpen, onClose }) => {
  const { startTour } = useTutorial();
  const menuItems = [
    { mode: AppMode.GENERATOR, label: 'Gerador de Prompts', icon: Icons.Wand },
    { mode: AppMode.PRODUCT_STUDIO, label: 'Laboratório Criativo', icon: Icons.Briefcase },
    { mode: AppMode.AGENT_BUILDER, label: 'Arquiteto de Agentes', icon: Icons.Agent },
    { mode: AppMode.BRAND_STUDIO, label: 'Studio de Marca', icon: Icons.Layout },
    { mode: AppMode.REVERSE_ENGINEER, label: 'Engenharia Reversa', icon: Icons.Aperture },
    { mode: AppMode.SEQUENCER, label: 'Sequenciador Narrativo', icon: Icons.Megaphone },
    { mode: AppMode.LIBRARY, label: 'Biblioteca de Prompts', icon: Icons.Book },
    { mode: AppMode.LEARNING_CENTER, label: 'Centro de Aprendizado', icon: Icons.School },
    { mode: AppMode.PRD_GENERATOR, label: 'Gerador de PRD', icon: Icons.FileText },
    { mode: AppMode.HISTORY, label: 'Histórico', icon: Icons.History },
  ];

  const [credits, setCredits] = React.useState<number | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Close menu when clicking outside (User Dropdown)
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close Sidebar when clicking outside (Mobile Overlay handled in Layout or here check)
  // Actually simpler to handle "click outside sidebar content" if overlay is part of Layout
  // But standard way is sidebar itself has overlay or parent does. 
  // Let's rely on Layout passing an overlay or handling it, OR handle it here if we want self-contained.
  // The plan said Layout would have the overlay.

  React.useEffect(() => {
    // Initial fetch
    creditService.getCredits().then(setCredits);

    const init = async () => {
      const { data: { user } } = await import('../services/supabaseClient').then(m => m.supabase.auth.getUser());
      if (user) {
        if (user.email === 'carloshenriquedionisio@gmail.com') {
          setIsAdmin(true);
        }

        creditService.subscribeToCredits(user.id, (newBalance) => {
          setCredits(newBalance);
        });

        // Fetch Avatar
        const { data: profile } = await import('../services/supabaseClient').then(m => m.supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single()
        );
        if (profile?.avatar_url) {
          setAvatarUrl(profile.avatar_url);
        }
      }
    };
    init();
  }, []);

  const [isPricingOpen, setIsPricingOpen] = React.useState(false);

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col items-stretch py-4 transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:w-64 md:flex
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 flex justify-between items-center">
          <div>
            <img src="/logo-white.jpg" alt="Alquimia Criativa" className="h-12 w-auto mb-2 object-contain" />
            <p className="text-xs text-neutral-400 pl-1">AI Engineering Suite</p>
          </div>
          {/* Mobile Close Button (Optional, can just click outside) */}
          <button onClick={onClose} className="md:hidden text-neutral-400 hover:text-white">
            <Icons.X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-2 px-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = currentMode === item.mode;
            const Icon = item.icon;
            return (
              <button
                key={item.mode}
                onClick={() => {
                  setMode(item.mode);
                  onClose(); // Auto close on mobile selection
                }}
                className={`
                  group flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 shrink-0
                  ${isActive
                    ? 'bg-neon text-black border border-neon shadow-[0_0_15px_rgba(255,95,0,0.5)] font-bold scale-[1.02]'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-black' : 'group-hover:text-neon transition-colors'}`} />
                <span className="block font-medium text-sm text-left">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-base-border relative" ref={userMenuRef}>
          {/* Credits Display */}
          <div className="mb-4 bg-neutral-900/50 rounded-lg p-3 border border-neutral-800 text-center">
            <div className="text-[10px] uppercase text-neutral-500 font-bold mb-1">Créditos Disponíveis</div>
            <div className="text-xl font-bold text-neon flex items-center justify-center gap-1">
              <Icons.Zap className="w-4 h-4" />
              {credits !== null ? credits : '...'}
            </div>
            <button
              onClick={() => setIsPricingOpen(true)}
              className="text-[10px] text-neutral-400 underline mt-1 hover:text-white cursor-pointer"
            >
              Adicionar Créditos
            </button>
          </div>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-base-card border border-base-border rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 z-50">
              {isAdmin && (
                <button
                  onClick={() => { setMode(AppMode.ADMIN); setIsUserMenuOpen(false); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neon hover:text-white hover:bg-neon/10 transition-colors text-left border-b border-white/5 font-bold"
                >
                  <Icons.Lock className="w-4 h-4" /> Admin Dashboard
                </button>
              )}
              <button
                onClick={() => { startTour(currentMode); setIsUserMenuOpen(false); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-300 hover:text-white hover:bg-white/5 transition-colors text-left"
              >
                <Icons.Help className="w-4 h-4 text-neon" /> Tutorial Guiado
              </button>
              <button
                onClick={() => { setMode(AppMode.SETTINGS); setIsUserMenuOpen(false); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-300 hover:text-white hover:bg-white/5 transition-colors text-left"
              >
                <Icons.Settings className="w-4 h-4 text-neon" /> Configurações
              </button>
              <button
                onClick={() => { setMode(AppMode.HELP_CENTER); setIsUserMenuOpen(false); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-300 hover:text-white hover:bg-white/5 transition-colors text-left border-t border-white/5"
              >
                <Icons.Help className="w-4 h-4 text-neon" /> Suporte & Ajuda
              </button>
              <button
                onClick={async () => {
                  const { supabase } = await import('../services/supabaseClient');
                  await supabase.auth.signOut();
                  window.location.reload();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left border-t border-white/5"
              >
                <Icons.LogOut className="w-4 h-4" /> Sair
              </button>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 flex-1 hover:bg-white/5 rounded-lg p-2 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden border border-neutral-700">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <Icons.User className="w-4 h-4" />
                )}
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-medium text-white">Usuário</span>
                <span className="text-xs text-neutral-500">Pro Plan</span>
              </div>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div >

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </>
  );
};

export default Sidebar;
