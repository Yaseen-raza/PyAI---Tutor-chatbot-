import React from 'react';

interface TopicBarProps {
  title: string;
  difficulty?: string;
  topicTag?: string;
  runtimeCost?: string;
  environmentStatus?: string;
  masteryPercent: number;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onOpenMobileMenu: () => void;
}

export const TopicBar: React.FC<TopicBarProps> = ({
  title,
  difficulty = 'Beginner-Intermediate',
  topicTag = 'Core Python',
  runtimeCost = 'Estimated runtime cost: O(N) vs O(1) Memory',
  environmentStatus = 'Lab Environment Ready (Python 3.12.3)',
  masteryPercent,
  isBookmarked,
  onToggleBookmark,
  onOpenMobileMenu
}) => {
  return (
    <div className="w-full bg-[#131b2e] border-b border-[#1f293d] px-4 md:px-6 py-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Hamburger (mobile) + Icon + Title + Meta badges */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-1.5 rounded-lg bg-[#171f33] text-[#dae2fd] border border-[#2d3449]"
            aria-label="Open Navigation"
          >
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>

          <div className="flex items-center gap-3 min-w-0">
            <div className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#222a3d] text-[#4edea3] border border-[#343e57]">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-sm md:text-base font-semibold text-white truncate max-w-xl">
                  {title}
                </h1>
                <span className="rounded-full bg-[#26296b]/80 border border-[#3b3db5]/50 px-2 py-0.5 font-mono text-[10px] md:text-xs text-[#c0c1ff] shrink-0">
                  {difficulty}
                </span>
              </div>

              {/* Sub-meta tags */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] font-mono text-[#9aa99f]">
                <span className="flex items-center gap-1 text-[#4cd7f6]">
                  <span className="material-symbols-outlined text-[13px]">code_blocks</span>
                  <span>{topicTag}</span>
                </span>
                <span className="h-1 w-1 rounded-full bg-[#3c4a63] hidden sm:inline"></span>
                <span className="hidden sm:inline">{runtimeCost}</span>
                <span className="h-1 w-1 rounded-full bg-[#3c4a63] hidden md:inline"></span>
                <span className="flex items-center gap-1 text-[#4edea3] hidden md:flex">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                  <span>{environmentStatus}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Bookmark + Mastery Badge */}
        <div className="flex items-center gap-2.5 shrink-0 ml-auto sm:ml-0">
          <button
            onClick={onToggleBookmark}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-mono transition-all border ${
              isBookmarked
                ? 'bg-[#10b981]/20 border-[#4edea3]/40 text-[#4edea3]'
                : 'bg-[#171f33] border-[#2d3449] text-[#9aa99f] hover:text-white hover:border-[#3c4a63]'
            }`}
          >
            <span className={`material-symbols-outlined text-[16px] ${isBookmarked ? 'fill' : ''}`}>
              {isBookmarked ? 'bookmark' : 'bookmark_border'}
            </span>
            <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark Topic'}</span>
          </button>

          <div className="flex items-center gap-1.5 rounded-xl bg-[#171f33] border border-[#2d3449] px-2.5 py-1.5">
            <span className="text-[11px] font-mono text-[#9aa99f]">Session Mastery:</span>
            <span className="text-xs font-mono font-bold text-[#4edea3]">{masteryPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
