import React, { useState } from 'react';
import type { Bookmark } from '../types/index.ts';

interface BookmarksViewProps {
  bookmarks: Bookmark[];
  onDeleteBookmark: (id: string) => void;
  onSendToPlayground: (code: string) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarks,
  onDeleteBookmark,
  onSendToPlayground
}) => {
  const [filterTag, setFilterTag] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const tags = ['all', ...Array.from(new Set(bookmarks.map((b) => b.topicTag)))];

  const filtered = filterTag === 'all'
    ? bookmarks
    : bookmarks.filter((b) => b.topicTag === filterTag);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#171f33] via-[#1a253e] to-[#131b2e] border border-[#2d3449] p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#c0c1ff]/20 text-[#c0c1ff]">
              <span className="material-symbols-outlined text-[20px]">bookmark</span>
            </span>
            <h2 className="font-display text-xl md:text-2xl font-bold text-white">
              Saved Snippets &amp; Pedagogical Notes
            </h2>
          </div>
          <p className="text-sm text-[#9aa99f]">
            Quickly reference your bookmarked code templates, algorithmic tricks, and memory optimization formulas.
          </p>
        </div>

        <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#222a3d] text-[#dae2fd] border border-[#343e57] shrink-0">
          {bookmarks.length} Saved Snippets
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilterTag(tag)}
            className={`capitalize px-3 py-1.5 rounded-xl font-mono text-xs transition-colors ${
              filterTag === tag
                ? 'bg-[#4edea3] text-[#003824] font-bold shadow-sm'
                : 'bg-[#171f33] text-[#9aa99f] hover:text-white border border-[#2d3449]'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Bookmarks List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-[#131b2e] border border-[#222a3d] p-10 text-center space-y-2">
          <span className="material-symbols-outlined text-4xl text-[#9aa99f]">bookmark_border</span>
          <h4 className="font-display text-base font-bold text-white">No Bookmarks Saved Yet</h4>
          <p className="text-xs text-[#9aa99f] max-w-sm mx-auto">
            Click the bookmark icon on any explanation or code block during your chat sessions to save it here for fast revision.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl bg-[#171f33] border border-[#2d3449] p-5 flex flex-col gap-3 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#26296b] text-[#c0c1ff]">
                    {b.topicTag}
                  </span>
                  <h4 className="font-display text-base font-semibold text-white">
                    {b.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  {b.snippet && (
                    <button
                      onClick={() => handleCopy(b.id, b.snippet!)}
                      className="flex items-center gap-1 rounded-lg bg-[#131b2e] px-2.5 py-1 font-mono text-xs text-[#dae2fd] hover:text-white border border-[#222a3d]"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {copiedId === b.id ? 'check' : 'content_copy'}
                      </span>
                      <span>{copiedId === b.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}

                  {b.snippet && (
                    <button
                      onClick={() => onSendToPlayground(b.snippet!)}
                      className="flex items-center gap-1 rounded-lg bg-[#4edea3] px-2.5 py-1 font-mono text-xs font-bold text-[#003824] hover:bg-[#3ecb90]"
                    >
                      <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                      <span>Sandbox</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteBookmark(b.id)}
                    title="Remove Bookmark"
                    className="p-1 rounded-lg text-[#9aa99f] hover:text-[#ffb4ab] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>

              {b.note && (
                <p className="text-xs text-[#9aa99f] bg-[#131b2e] p-2.5 rounded-xl border border-[#222a3d]">
                  💡 <strong>Note:</strong> {b.note}
                </p>
              )}

              {b.snippet && (
                <div className="overflow-x-auto rounded-xl bg-[#060e20] p-3 font-mono text-xs text-[#dae2fd] border border-[#222a3d]">
                  <pre>
                    <code>{b.snippet}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
