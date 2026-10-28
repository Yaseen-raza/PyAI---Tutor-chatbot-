import React from 'react';
import type { User } from '../types/index.ts';

interface HeaderProps {
  user: User | null;
  activeTrack: string;
  onSelectTrack: (track: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
}

const TRACKS = [
  'Python Fundamentals',
  'ML & Neural Nets',
  'RAG & LLMs',
  'Agentic AI'
];

export const Header: React.FC<HeaderProps> = ({
  user,
  activeTrack,
  onSelectTrack,
  isDark,
  onToggleTheme,
  onOpenSearch,
  onOpenSettings
}) => {
  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-[#0b1326]/85 backdrop-blur-xl z-40 border-b border-[#1f293d] px-4 md:px-6 flex items-center justify-between">
      {/* Left: Mobile Title & Track Nav */}
      <div className="flex items-center gap-3 md:gap-5 overflow-x-auto no-scrollbar py-1">
        {/* Mobile Applet Logo */}
        <div className="flex lg:hidden items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#10b981]/20 flex items-center justify-center text-[#4edea3] font-bold text-base">
            Py
          </div>
          <span className="font-display font-semibold text-white tracking-tight">PyAI</span>
        </div>

        {/* Desktop Branding Badge */}
        <div className="hidden lg:flex items-center gap-2.5">
          <span className="font-display text-base font-semibold text-[#dae2fd]">PyAI Tutor</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#4edea3] font-semibold border border-[#4edea3]/30">
            Gemini 3.1 Flash (Ultra-Fast)
          </span>
        </div>

        <div className="hidden xl:block h-4 w-[1px] bg-[#2d3449]"></div>

        {/* Track Pills */}
        <nav className="flex items-center gap-1">
          {TRACKS.map((track) => {
            const isActive = activeTrack === track;
            return (
              <button
                key={track}
                onClick={() => onSelectTrack(track)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#222a3d] text-white font-semibold shadow-sm border border-[#343e57]'
                    : 'text-[#9aa99f] hover:text-[#dae2fd] hover:bg-[#171f33]'
                }`}
              >
                {track}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {/* Search Bar Button */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#131b2e] border border-[#222a3d] text-[#9aa99f] hover:text-[#dae2fd] hover:border-[#3c4a63] transition-colors text-xs"
        >
          <span className="material-symbols-outlined text-[16px]">search</span>
          <span className="hidden md:inline">Search modules, syntax...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#222a3d] text-[10px] font-mono text-[#dae2fd]">⌘K</kbd>
        </button>

        {/* API Connected Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#131b2e] border border-[#1f293d]">
          <span className="h-2 w-2 rounded-full bg-[#4edea3] animate-pulse"></span>
          <span className="text-xs text-[#dae2fd] font-medium hidden md:inline">API Connected</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          aria-label="Toggle Theme"
          className="p-1.5 rounded-lg text-[#9aa99f] hover:text-[#dae2fd] hover:bg-[#171f33] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isDark ? 'dark_mode' : 'light_mode'}
          </span>
        </button>

        {/* User Level & Profile */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 pl-1 hover:opacity-85 transition-opacity text-left"
        >
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-semibold text-white">{user?.level || 'Level 2 Apprentice'}</span>
            <span className="text-[11px] font-mono text-[#4cd7f6]">{user?.xp ? `${user.xp.toLocaleString()} XP` : '1,420 XP'}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#10b981] to-[#4edea3] text-[#003824] flex items-center justify-center font-bold text-xs ring-2 ring-[#4edea3]/30">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
        </button>
      </div>
    </header>
  );
};
