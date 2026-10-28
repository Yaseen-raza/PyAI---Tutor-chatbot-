import React, { useState, useRef, useEffect } from 'react';
import type { TutorMode } from '../types/index.ts';

interface ComposerProps {
  onSendMessage: (text: string, mode: TutorMode) => void;
  isLoading: boolean;
  tutorMode: TutorMode;
  onChangeTutorMode: (mode: TutorMode) => void;
}

export const Composer: React.FC<ComposerProps> = ({
  onSendMessage,
  isLoading,
  tutorMode,
  onChangeTutorMode
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim(), tutorMode);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertSuggestion = (prompt: string) => {
    setInput(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  return (
    <div className="sticky bottom-4 z-30 flex flex-col gap-3 rounded-2xl bg-[#131b2e]/95 backdrop-blur-md border border-[#1f293d] p-3.5 md:p-4 shadow-2xl">
      {/* Suggestions Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] text-[#9aa99f]">Suggestions:</span>
        <button
          onClick={() => insertSuggestion('Show me a real-world data science example with Pandas')}
          className="rounded-full bg-[#171f33] border border-[#2d3449] px-2.5 py-1 font-mono text-xs text-[#dae2fd] hover:border-[#4edea3] hover:text-[#4edea3] transition-colors"
        >
          Pandas pipeline example
        </button>
        <button
          onClick={() => insertSuggestion('Give me a practice exercise with unit tests for list comprehensions')}
          className="rounded-full bg-[#171f33] border border-[#2d3449] px-2.5 py-1 font-mono text-xs text-[#dae2fd] hover:border-[#4edea3] hover:text-[#4edea3] transition-colors"
        >
          Practice exercise with tests
        </button>
        <button
          onClick={() => insertSuggestion('How does sys.getsizeof() measure nested Python objects in memory?')}
          className="rounded-full bg-[#171f33] border border-[#2d3449] px-2.5 py-1 font-mono text-xs text-[#dae2fd] hover:border-[#4edea3] hover:text-[#4edea3] transition-colors"
        >
          sys.getsizeof() mechanics
        </button>
      </div>

      {/* Mode Selectors & Token Count */}
      <div className="flex items-center justify-between pt-0.5">
        <div className="flex items-center gap-1 rounded-xl bg-[#060e20] p-1 border border-[#222a3d]">
          <button
            onClick={() => onChangeTutorMode('tutor')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs transition-all ${
              tutorMode === 'tutor'
                ? 'bg-[#c0c1ff] text-[#1000a9] font-bold shadow-sm'
                : 'text-[#9aa99f] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">school</span>
            <span>Tutor Mode</span>
          </button>

          <button
            onClick={() => onChangeTutorMode('reviewer')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs transition-all ${
              tutorMode === 'reviewer'
                ? 'bg-[#c0c1ff] text-[#1000a9] font-bold shadow-sm'
                : 'text-[#9aa99f] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">rate_review</span>
            <span>Code Reviewer</span>
          </button>

          <button
            onClick={() => onChangeTutorMode('debug')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs transition-all ${
              tutorMode === 'debug'
                ? 'bg-[#c0c1ff] text-[#1000a9] font-bold shadow-sm'
                : 'text-[#9aa99f] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">bug_report</span>
            <span>Debug Mode</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#9aa99f]">
          <span className="h-2 w-2 rounded-full bg-[#4edea3] animate-pulse"></span>
          <span>Gemini 3.1 Flash: Ultra-Fast Active</span>
        </div>
      </div>

      {/* Textarea Input & Send Trigger */}
      <div className="relative flex items-end gap-2 rounded-xl bg-[#060e20] border border-[#222a3d] p-2 focus-within:border-[#4edea3]/60 transition-colors">
        <button
          onClick={() => {
            const sampleSnippet = `\n\`\`\`python\n# Paste your error or code here:\ndef calculate_loss(y_true, y_pred):\n    return sum((y_t - y_p) ** 2 for y_t, y_p in zip(y_true, y_pred))\n\`\`\``;
            setInput((prev) => prev + sampleSnippet);
          }}
          className="flex h-10 w-10 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg text-[#9aa99f] hover:bg-[#171f33] hover:text-white transition-colors"
          title="Insert code block template"
        >
          <span className="material-symbols-outlined text-[19px]">data_object</span>
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask PyAI Tutor anything about Python, NumPy, PyTorch, RAG, or paste your code error..."
          rows={2}
          className="w-full resize-none bg-transparent p-1.5 text-base sm:text-sm text-white placeholder:text-[#9aa99f]/60 focus:outline-none leading-relaxed"
        />

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden md:inline font-mono text-[10px] text-[#9aa99f] select-none">
            ⌘↵
          </span>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4edea3] text-[#003824] hover:bg-[#3ecb90] active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-md shadow-[#4edea3]/20"
            title="Send question"
          >
            {isLoading ? (
              <span className="material-symbols-outlined text-[19px] animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-[19px]">send</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
