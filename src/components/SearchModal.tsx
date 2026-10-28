import React, { useState, useEffect } from 'react';
import type { Conversation, LearningTopic } from '../types/index.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  topics: LearningTopic[];
  onSelectConversation: (id: string) => void;
  onSelectTopic: (topic: LearningTopic) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  conversations,
  topics,
  onSelectConversation,
  onSelectTopic
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open handled by parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedConversations = q
    ? conversations.filter(
        (c) => c.title.toLowerCase().includes(q) || c.topicTag.toLowerCase().includes(q)
      )
    : conversations.slice(0, 4);

  const matchedTopics = q
    ? topics.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.keyConcepts.some((c) => c.toLowerCase().includes(q))
      )
    : topics.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose}></div>

      {/* Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl bg-[#171f33] border border-[#2d3449] shadow-2xl z-10 overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#131b2e] border-b border-[#222a3d]">
          <span className="material-symbols-outlined text-[20px] text-[#4edea3]">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search learning topics, sessions, syntax, or concepts..."
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder:text-[#9aa99f] focus:outline-none font-mono"
          />
          <kbd className="px-2 py-0.5 rounded bg-[#222a3d] font-mono text-[10px] text-[#9aa99f]">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-4">
          {/* Topics */}
          {matchedTopics.length > 0 && (
            <div className="space-y-1">
              <span className="px-2 text-[10px] font-mono uppercase tracking-wider text-[#9aa99f]">
                Curriculum Modules
              </span>
              {matchedTopics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onSelectTopic(t);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-[#131b2e] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#4edea3]">
                      menu_book
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white">{t.title}</span>
                      <span className="text-[10px] font-mono text-[#4cd7f6]">{t.category}</span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#222a3d] text-[#c0c1ff]">
                    {t.difficulty}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Conversations */}
          {matchedConversations.length > 0 && (
            <div className="space-y-1">
              <span className="px-2 text-[10px] font-mono uppercase tracking-wider text-[#9aa99f]">
                Recent Learning Sessions
              </span>
              {matchedConversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectConversation(c.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-[#131b2e] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#c0c1ff]">
                      chat_bubble
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white">{c.title}</span>
                      <span className="text-[10px] font-mono text-[#9aa99f]">{c.topicTag}</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-[#9aa99f]">
                    arrow_forward
                  </span>
                </button>
              ))}
            </div>
          )}

          {matchedTopics.length === 0 && matchedConversations.length === 0 && (
            <div className="p-6 text-center text-xs text-[#9aa99f]">
              No matching modules or conversations found for &quot;{query}&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
