import React, { useState } from 'react';
import type { Message } from '../types/index.ts';
import confetti from 'canvas-confetti';

interface ChatStreamProps {
  messages: Message[];
  isLoading: boolean;
  onRunSnippetInSandbox: (code: string) => void;
  onExplainRomanUrdu: () => void;
  onGenerateExercise: () => void;
  onBookmarkSnippet: (title: string, code: string, topicTag: string) => void;
  onRegenerate: () => void;
  onEditMessage: (msgId: string, newContent: string) => void;
  onQuizAnswerSubmit: (quizId: string, optionId: string, isCorrect: boolean, explanation: string) => void;
}

export const ChatStream: React.FC<ChatStreamProps> = ({
  messages,
  isLoading,
  onRunSnippetInSandbox,
  onExplainRomanUrdu,
  onGenerateExercise,
  onBookmarkSnippet,
  onRegenerate,
  onEditMessage,
  onQuizAnswerSubmit
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openBreakdownIds, setOpenBreakdownIds] = useState<Record<string, boolean>>({
    default: true
  });
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, string>>({
    quiz_comp_1: 'B' // pre-selected in mockup
  });
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const toggleBreakdown = (msgId: string) => {
    setOpenBreakdownIds((prev) => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const handleSelectQuiz = (quizId: string, optionId: string, isCorrect: boolean, explanation: string) => {
    setSelectedQuizAnswers((prev) => ({ ...prev, [quizId]: optionId }));
    onQuizAnswerSubmit(quizId, optionId, isCorrect, explanation);

    if (isCorrect) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#4edea3', '#4cd7f6', '#c0c1ff']
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-6">
      {messages.map((msg) => {
        if (msg.role === 'user') {
          return (
            <div key={msg.id} className="flex justify-end">
              <div className="flex max-w-[90%] md:max-w-[80%] flex-col gap-1.5">
                <div className="flex items-center justify-end gap-2 text-[11px] font-mono text-[#9aa99f]">
                  <span>You (Apprentice)</span>
                  <span>•</span>
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="group relative rounded-2xl rounded-tr-none bg-[#222a3d] border border-[#343e57] p-4 text-[#dae2fd] shadow-md">
                  {editingMsgId === msg.id ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        className="w-full bg-[#131b2e] p-2.5 rounded-lg text-sm text-white border border-[#4edea3] focus:outline-none resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingMsgId(null)}
                          className="px-2.5 py-1 text-xs text-[#9aa99f] hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (editPrompt.trim()) {
                              onEditMessage(msg.id, editPrompt.trim());
                              setEditingMsgId(null);
                            }
                          }}
                          className="px-3 py-1 bg-[#4edea3] text-[#003824] rounded-lg text-xs font-semibold"
                        >
                          Save &amp; Re-run
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      <button
                        onClick={() => {
                          setEditingMsgId(msg.id);
                          setEditPrompt(msg.content);
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-[#9aa99f] hover:text-white transition-opacity"
                        title="Edit question"
                      >
                        <span className="material-symbols-outlined text-[15px]">edit</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        }

        // Assistant Message Card
        const meta = msg.metadata || {};
        const codeSnippet = meta.codeSnippet;
        const quiz = meta.quiz;
        const memory = meta.memoryAnalysis;
        const cards = meta.pedagogicalCards || [];
        const isBreakdownOpen = openBreakdownIds[msg.id] ?? true;

        return (
          <div key={msg.id} className="flex w-full flex-col gap-2">
            {/* Header info bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#9aa99f]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4edea3] text-[#003824] font-bold">
                  <span className="material-symbols-outlined text-[13px]">smart_toy</span>
                </span>
                <span className="font-semibold text-[#4edea3]">PyAI Tutor</span>
                <span className="rounded bg-[#26296b] px-1.5 py-0.5 text-[10px] text-[#c0c1ff] font-medium border border-[#3b3db5]/40">
                  {meta.model || 'Gemini 3.8 Flash'}
                </span>
                <span>•</span>
                <span>Just now</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-mono text-[#9aa99f]">
                <span className="material-symbols-outlined text-[14px] text-[#4edea3]">bolt</span>
                <span>{meta.tokenCount || 312} tokens</span>
              </div>
            </div>

            {/* Main Tutor Card */}
            <div className="flex flex-col gap-4 rounded-2xl bg-[#171f33] border border-[#2d3449] p-5 md:p-6 text-[#dae2fd] shadow-lg">
              {/* Narrative Content */}
              <div className="text-sm md:text-base leading-relaxed space-y-3">
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* 3 Pedagogical Concept Cards */}
                {cards.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2">
                    {cards.map((card, idx) => {
                      const colorClass =
                        card.variant === 'tertiary'
                          ? 'text-[#4cd7f6]'
                          : card.variant === 'secondary'
                          ? 'text-[#c0c1ff]'
                          : 'text-[#4edea3]';
                      return (
                        <div key={idx} className="rounded-xl bg-[#131b2e] border border-[#222a3d] p-3">
                          <div className={`flex items-center gap-1.5 font-mono text-xs font-semibold ${colorClass}`}>
                            <span className="material-symbols-outlined text-[16px]">{card.icon}</span>
                            <span>{card.title}</span>
                          </div>
                          <p className="pt-1.5 text-xs text-[#9aa99f] leading-normal">
                            {card.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Code Snippet Box */}
              {codeSnippet && (
                <div className="overflow-hidden rounded-xl bg-[#060e20] border border-[#222a3d]">
                  <div className="flex items-center justify-between bg-[#222a3d] px-4 py-2 border-b border-[#2d3449]">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]"></span>
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]"></span>
                      <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]"></span>
                      <span className="pl-2 font-mono text-xs text-white">
                        {codeSnippet.filename}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.id, codeSnippet.code)}
                        className="flex items-center gap-1 rounded-lg bg-[#171f33] px-2.5 py-1 font-mono text-xs text-[#dae2fd] hover:text-white hover:bg-[#2d3449] transition-colors border border-[#343e57]"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {copiedId === msg.id ? 'check' : 'content_copy'}
                        </span>
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={() => onRunSnippetInSandbox(codeSnippet.code)}
                        className="flex items-center gap-1 rounded-lg bg-[#4edea3] px-3 py-1 font-mono text-xs font-semibold text-[#003824] hover:bg-[#3ecb90] active:scale-[0.98] transition-all shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                        <span>Run in Sandbox</span>
                      </button>
                    </div>
                  </div>

                  {/* Code View */}
                  <div className="overflow-x-auto p-4 font-mono text-xs md:text-sm leading-relaxed text-[#dae2fd]">
                    <pre>
                      <code>{codeSnippet.code}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Collapsible Line-by-Line Breakdown */}
              {meta.lineBreakdown && meta.lineBreakdown.length > 0 && (
                <div className="rounded-xl bg-[#131b2e] border border-[#222a3d] p-3.5">
                  <button
                    onClick={() => toggleBreakdown(msg.id)}
                    className="flex w-full items-center justify-between text-left font-mono text-xs text-white hover:text-[#4edea3] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">
                        account_tree
                      </span>
                      <span className="font-semibold">Line-by-Line Syntax Anatomy</span>
                    </span>
                    <span
                      className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${
                        isBreakdownOpen ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>

                  {isBreakdownOpen && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-[#222a3d] text-xs text-[#9aa99f]">
                      {meta.lineBreakdown.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                          <code className="rounded bg-[#222a3d] px-2 py-0.5 font-mono text-[#4edea3] shrink-0 font-medium">
                            {item.code}
                          </code>
                          <span className="pt-0.5">{item.explanation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Memory Analysis Visual Meter */}
              {memory && (
                <div className="flex flex-col gap-2 rounded-xl bg-[#131b2e] border border-[#222a3d] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-white">
                      <span className="material-symbols-outlined text-[18px] text-[#4edea3]">
                        analytics
                      </span>
                      <span>Memory Analysis: List vs Generator Evaluation</span>
                    </span>
                    <span className="rounded-full bg-[#10b981]/20 border border-[#4edea3]/30 px-2 py-0.5 font-mono text-[11px] text-[#4edea3] font-semibold">
                      {memory.percentageSaved} Memory Reduction
                    </span>
                  </div>

                  <p className="text-xs text-[#9aa99f] leading-normal">{memory.summary}</p>

                  {/* Visual RAM Meter */}
                  <div className="space-y-1.5 pt-1.5">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="text-[#9aa99f]">
                        {memory.leftLabel}: <strong className="text-[#ffb4ab]">{memory.leftSize}</strong>
                      </span>
                      <span className="text-[#9aa99f]">
                        {memory.rightLabel}: <strong className="text-[#4edea3]">{memory.rightSize}</strong>
                      </span>
                    </div>

                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#222a3d]">
                      <div className="h-full bg-gradient-to-r from-[#ef4444] to-[#f87171] w-full"></div>
                      <div className="absolute left-0 top-0 h-full bg-[#4edea3] w-[0.2%] min-w-[5px]"></div>
                    </div>

                    <div className="flex justify-between font-mono text-[10px] text-[#9aa99f]">
                      <span>Full RAM Consumption (List)</span>
                      <span className="text-[#4edea3] font-semibold">Constant Footprint (Generator)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Socratic MCQ Quiz Widget */}
              {quiz && (
                <div className="flex flex-col gap-3 rounded-xl bg-[#060e20] border border-[#2d3449] p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-white">
                      <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">quiz</span>
                      <span>Quick Check: Socratic Verification</span>
                    </span>
                    <span className="rounded bg-[#10b981]/20 border border-[#4edea3]/30 px-2 py-0.5 font-mono text-[11px] text-[#4edea3] font-bold">
                      +{quiz.xpAward} XP
                    </span>
                  </div>

                  <p className="font-mono text-xs md:text-sm text-white">{quiz.question}</p>

                  {/* Options */}
                  <div className="flex flex-col gap-2 pt-1">
                    {quiz.options.map((opt) => {
                      const isSelected = selectedQuizAnswers[quiz.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectQuiz(quiz.id, opt.id, opt.isCorrect, quiz.explanation)}
                          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-all border ${
                            isSelected
                              ? opt.isCorrect
                                ? 'bg-[#171f33] border-[#4edea3] text-white shadow-sm'
                                : 'bg-[#171f33] border-[#ffb4ab] text-white'
                              : 'bg-[#131b2e] border-[#222a3d] text-[#dae2fd] hover:bg-[#171f33]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-full font-mono text-xs font-bold ${
                                isSelected && opt.isCorrect
                                  ? 'bg-[#4edea3] text-[#003824]'
                                  : 'bg-[#222a3d] text-white'
                              }`}
                            >
                              {opt.label}
                            </span>
                            <span className="text-xs md:text-sm">{opt.text}</span>
                          </div>

                          {isSelected && (
                            <span
                              className={`material-symbols-outlined text-[18px] ${
                                opt.isCorrect ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                              }`}
                            >
                              {opt.isCorrect ? 'check_circle' : 'cancel'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Banner */}
                  {selectedQuizAnswers[quiz.id] && (
                    <div
                      className={`flex items-center gap-2 rounded-xl p-3 border ${
                        quiz.options.find((o) => o.id === selectedQuizAnswers[quiz.id])?.isCorrect
                          ? 'bg-[#10b981]/15 border-[#4edea3]/30 text-[#4edea3]'
                          : 'bg-[#ef4444]/15 border-[#ffb4ab]/30 text-[#ffb4ab]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {quiz.options.find((o) => o.id === selectedQuizAnswers[quiz.id])?.isCorrect
                          ? 'verified'
                          : 'info'}
                      </span>
                      <span className="text-xs font-medium">{quiz.explanation}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#222a3d]">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={onExplainRomanUrdu}
                    className="flex items-center gap-1.5 rounded-lg bg-[#131b2e] border border-[#222a3d] px-3 py-1.5 font-mono text-xs text-[#9aa99f] hover:text-white hover:border-[#3c4a63] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">translate</span>
                    <span>Explain in Roman Urdu</span>
                  </button>

                  <button
                    onClick={onGenerateExercise}
                    className="flex items-center gap-1.5 rounded-lg bg-[#131b2e] border border-[#222a3d] px-3 py-1.5 font-mono text-xs text-[#9aa99f] hover:text-white hover:border-[#3c4a63] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">exercise</span>
                    <span>Generate Coding Exercise</span>
                  </button>

                  {codeSnippet && (
                    <button
                      onClick={() => handleCopy(msg.id, codeSnippet.code)}
                      className="flex items-center gap-1.5 rounded-lg bg-[#131b2e] border border-[#222a3d] px-3 py-1.5 font-mono text-xs text-[#9aa99f] hover:text-white hover:border-[#3c4a63] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[15px]">content_copy</span>
                      <span>Copy Code</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      if (codeSnippet) {
                        onBookmarkSnippet('List Comprehension vs Generator Memory', codeSnippet.code, 'Python Core');
                      }
                    }}
                    title="Bookmark Explanation"
                    className="p-1.5 rounded-lg text-[#9aa99f] hover:text-white hover:bg-[#131b2e] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">bookmark</span>
                  </button>

                  <button
                    onClick={onRegenerate}
                    title="Regenerate with Alternative Context"
                    className="p-1.5 rounded-lg text-[#9aa99f] hover:text-white hover:bg-[#131b2e] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Loading state indicator */}
      {isLoading && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#171f33] border border-[#2d3449] text-[#dae2fd]">
          <div className="flex space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-[#4edea3] animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 rounded-full bg-[#c0c1ff] animate-bounce [animation-delay:-0.3s]"></div>
          </div>
          <span className="font-mono text-xs text-[#9aa99f]">
            PyAI Tutor is generating detailed pedagogical breakdown &amp; code analysis...
          </span>
        </div>
      )}
    </div>
  );
};
