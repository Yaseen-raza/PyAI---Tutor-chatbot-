import React, { useState } from 'react';
import type { Conversation, User } from '../types/index.ts';

interface SidebarProps {
  currentTab: 'chat' | 'tutorials' | 'roadmap' | 'quiz' | 'bookmarks';
  onSelectTab: (tab: 'chat' | 'tutorials' | 'roadmap' | 'quiz' | 'bookmarks') => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onTogglePinConversation: (id: string, currentPin: boolean) => void;
  onDeleteConversation: (id: string) => void;
  user: User | null;
  onOpenSettings: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onRenameConversation,
  onTogglePinConversation,
  onDeleteConversation,
  user,
  onOpenSettings,
  isOpenMobile,
  onCloseMobile
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const startEditing = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const submitEdit = (id: string) => {
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const getTagColorClass = (tag: string) => {
    if (tag.includes('Core') || tag.includes('Python')) return 'text-[#4edea3]';
    if (tag.includes('Vector') || tag.includes('RAG')) return 'text-[#4cd7f6]';
    if (tag.includes('Neural') || tag.includes('ML')) return 'text-[#c0c1ff]';
    if (tag.includes('Exception') || tag.includes('Error')) return 'text-[#ffb4ab]';
    return 'text-[#bbcabf]';
  };

  const content = (
    <div className="flex flex-col h-full bg-[#131b2e] border-r border-[#1f293d] text-[#dae2fd]">
      {/* Top Header Logo */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#10b981]/25 border border-[#4edea3]/40 flex items-center justify-center text-[#4edea3] font-bold text-base shadow-sm">
            <span className="material-symbols-outlined text-[20px]">psychology</span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white">PyAI</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#2d3449] text-[#4cd7f6] border border-[#3c4a63]">
            v2.5
          </span>
          {isOpenMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-[#9aa99f] hover:text-white"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Action: New Learning Chat */}
      <div className="px-4 py-2">
        <button
          onClick={() => {
            onNewConversation();
            onSelectTab('chat');
            if (isOpenMobile) onCloseMobile();
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#4edea3] text-[#003824] font-semibold text-sm hover:bg-[#3ecb90] active:scale-[0.99] transition-all shadow-md shadow-[#4edea3]/10"
        >
          <span className="material-symbols-outlined text-[19px]">add</span>
          <span>New Learning Chat</span>
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="px-4 pt-3 pb-1">
        <span className="px-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#9aa99f]">
          Curriculum
        </span>
      </div>

      <nav className="px-3 flex flex-col gap-1">
        <button
          onClick={() => {
            onSelectTab('chat');
            if (isOpenMobile) onCloseMobile();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition-colors ${
            currentTab === 'chat'
              ? 'bg-[#10b981]/20 text-[#4edea3] font-semibold border border-[#4edea3]/30'
              : 'text-[#bbcabf] hover:text-white hover:bg-[#171f33]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">terminal</span>
          <span>Chat Tutor</span>
        </button>

        <button
          onClick={() => {
            onSelectTab('tutorials');
            if (isOpenMobile) onCloseMobile();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition-colors ${
            currentTab === 'tutorials'
              ? 'bg-[#10b981]/20 text-[#4edea3] font-semibold border border-[#4edea3]/30'
              : 'text-[#bbcabf] hover:text-white hover:bg-[#171f33]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">menu_book</span>
          <span>Python Notes &amp; Lessons</span>
        </button>

        <button
          onClick={() => {
            onSelectTab('roadmap');
            if (isOpenMobile) onCloseMobile();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition-colors ${
            currentTab === 'roadmap'
              ? 'bg-[#10b981]/20 text-[#4edea3] font-semibold border border-[#4edea3]/30'
              : 'text-[#bbcabf] hover:text-white hover:bg-[#171f33]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">alt_route</span>
          <span>Roadmap &amp; Progress</span>
        </button>

        <button
          onClick={() => {
            onSelectTab('quiz');
            if (isOpenMobile) onCloseMobile();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition-colors ${
            currentTab === 'quiz'
              ? 'bg-[#10b981]/20 text-[#4edea3] font-semibold border border-[#4edea3]/30'
              : 'text-[#bbcabf] hover:text-white hover:bg-[#171f33]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">science</span>
          <span>Interactive Quiz &amp; Labs</span>
        </button>

        <button
          onClick={() => {
            onSelectTab('bookmarks');
            if (isOpenMobile) onCloseMobile();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition-colors ${
            currentTab === 'bookmarks'
              ? 'bg-[#10b981]/20 text-[#4edea3] font-semibold border border-[#4edea3]/30'
              : 'text-[#bbcabf] hover:text-white hover:bg-[#171f33]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">bookmark</span>
          <span>Saved Snippets &amp; Bookmarks</span>
        </button>
      </nav>

      {/* Recent Sessions List */}
      <div className="px-5 pt-5 pb-2 flex items-center justify-between">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#9aa99f]">
          Recent Sessions
        </span>
        <span className="text-[11px] font-mono text-[#9aa99f]">
          {conversations.length} Active
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        {conversations.map((conv) => {
          const isSelected = conv.id === activeConversationId && currentTab === 'chat';
          const isEditing = editingId === conv.id;

          return (
            <div
              key={conv.id}
              onClick={() => {
                onSelectConversation(conv.id);
                onSelectTab('chat');
                if (isOpenMobile) onCloseMobile();
              }}
              className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#171f33] border border-[#2d3449] text-white'
                  : 'hover:bg-[#171f33]/70 text-[#dae2fd]'
              }`}
            >
              <div className="flex flex-col min-w-0 pr-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') submitEdit(conv.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    onBlur={() => submitEdit(conv.id)}
                    autoFocus
                    className="bg-[#0b1326] px-1.5 py-0.5 rounded text-white text-xs border border-[#4edea3] focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div className="flex items-center gap-1.5">
                    {conv.isPinned && (
                      <span className="material-symbols-outlined text-[13px] text-[#4edea3]">push_pin</span>
                    )}
                    <span className="truncate font-medium text-[13px] text-white">
                      {conv.title}
                    </span>
                  </div>
                )}
                <span className={`text-[11px] font-mono pt-0.5 ${getTagColorClass(conv.topicTag)}`}>
                  {conv.topicTag}
                </span>
              </div>

              {/* Action Buttons on Hover */}
              <div className="hidden group-hover:flex items-center gap-1 shrink-0 text-[#9aa99f]">
                <button
                  title={conv.isPinned ? 'Unpin session' : 'Pin session'}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePinConversation(conv.id, conv.isPinned);
                  }}
                  className="hover:text-white p-1"
                >
                  <span className={`material-symbols-outlined text-[15px] ${conv.isPinned ? 'text-[#4edea3]' : ''}`}>
                    push_pin
                  </span>
                </button>
                <button
                  title="Rename"
                  onClick={(e) => startEditing(conv, e)}
                  className="hover:text-white p-1"
                >
                  <span className="material-symbols-outlined text-[15px]">edit</span>
                </button>
                <button
                  title="Delete Session"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete conversation "${conv.title}"?`)) {
                      onDeleteConversation(conv.id);
                    }
                  }}
                  className="hover:text-[#ffb4ab] p-1"
                >
                  <span className="material-symbols-outlined text-[15px]">delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom User Stats & Execution Quota */}
      <div className="p-4 bg-[#060e20]/80 border-t border-[#1f293d] flex flex-col gap-3">
        {/* Streak & XP */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🔥</span>
            <span className="text-xs font-semibold text-white">
              {user?.streakDays || 6} Days Streak
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#4edea3] font-semibold">
            +250 XP Today
          </span>
        </div>

        {/* Quota Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-mono text-[#9aa99f]">
            <span>Execution Quota</span>
            <span>
              {user?.executionQuotaUsed ?? 64} / {user?.executionQuotaMax ?? 100} Runs
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#222a3d] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#10b981] to-[#4edea3] rounded-full transition-all"
              style={{
                width: `${Math.min(
                  100,
                  (((user?.executionQuotaUsed ?? 64) / (user?.executionQuotaMax ?? 100)) * 100)
                )}%`
              }}
            ></div>
          </div>
        </div>

        {/* Quick Settings & Docs */}
        <div className="pt-1 flex items-center justify-between text-xs text-[#9aa99f]">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[17px]">settings</span>
            <span>Settings</span>
          </button>
          <button
            onClick={() => {
              alert('PyAI Tutor v2.5 Architecture:\n- Gemini 3.8 Flash Engine\n- CPython & WebAssembly Sandbox\n- SQLite Local Storage\n- Multi-turn Socratic Guidance');
            }}
            className="hover:text-white font-mono text-[11px] transition-colors"
          >
            API Docs
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 z-50 flex-col shadow-2xl">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          ></div>
          <div className="relative w-80 max-w-full h-full z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
