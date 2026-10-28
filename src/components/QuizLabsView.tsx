import React, { useState } from 'react';
import type { QuizAttempt } from '../types/index.ts';
import confetti from 'canvas-confetti';

interface QuizLabsViewProps {
  quizAttempts: QuizAttempt[];
  onTriggerPracticeQuiz: (topicName: string) => void;
  onAnswerQuestion: (question: string, option: string, isCorrect: boolean, xp: number) => void;
}

const PRACTICE_QUESTIONS = [
  {
    id: 'pq_1',
    topic: 'Memory & Generators',
    question: 'Why is `sys.getsizeof((x for x in range(1_000_000)))` only ~104 bytes in CPython?',
    options: [
      { id: 'A', text: 'Because Python compresses the range into a ZIP stream', isCorrect: false },
      { id: 'B', text: 'Because a generator object holds only its execution frame and state machine, not items', isCorrect: true },
      { id: 'C', text: 'Because the range is held by the operating system page cache', isCorrect: false }
    ],
    explanation: 'Generators store code object references, current frame bytecode instruction pointer, and yield values one at a time.'
  },
  {
    id: 'pq_2',
    topic: 'RAG & Vector Search',
    question: 'When chunking text for an embedding model, what is the purpose of chunk overlap (e.g. 50 tokens)?',
    options: [
      { id: 'A', text: 'To preserve contextual semantics across sentence splits and boundaries', isCorrect: true },
      { id: 'B', text: 'To increase the vector embedding dimensionality', isCorrect: false },
      { id: 'C', text: 'To encrypt proprietary data before storing in vector database', isCorrect: false }
    ],
    explanation: 'Overlap ensures ideas that span across token split boundaries remain coherent and retrievable.'
  },
  {
    id: 'pq_3',
    topic: 'PyTorch & Neural Nets',
    question: 'Why is `optimizer.zero_grad()` called before `loss.backward()` in a PyTorch training step?',
    options: [
      { id: 'A', text: 'To reset the learning rate schedule', isCorrect: false },
      { id: 'B', text: 'Because PyTorch accumulates gradients across backward passes by default', isCorrect: true },
      { id: 'C', text: 'To clear GPU driver cache memory', isCorrect: false }
    ],
    explanation: 'In PyTorch, gradients accumulate (+ tensor.grad) unless zeroed out, which is useful for gradient accumulation over small batches.'
  }
];

export const QuizLabsView: React.FC<QuizLabsViewProps> = ({
  quizAttempts,
  onTriggerPracticeQuiz,
  onAnswerQuestion
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const handleSelect = (qId: string, optId: string, q: typeof PRACTICE_QUESTIONS[0]) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optId }));
    const opt = q.options.find((o) => o.id === optId);
    const isCorrect = opt ? opt.isCorrect : false;
    onAnswerQuestion(q.question, optId, isCorrect, isCorrect ? 50 : 0);

    if (isCorrect) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4edea3', '#4cd7f6', '#c0c1ff']
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#171f33] via-[#1a253e] to-[#131b2e] border border-[#2d3449] p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#4cd7f6]/20 text-[#4cd7f6]">
              <span className="material-symbols-outlined text-[20px]">science</span>
            </span>
            <h2 className="font-display text-xl md:text-2xl font-bold text-white">
              Interactive Socratic Quiz &amp; Verification Labs
            </h2>
          </div>
          <p className="text-sm text-[#9aa99f]">
            Solve conceptual checks and real-world AI coding scenarios. Gain XP and elevate your mastery level.
          </p>
        </div>

        <button
          onClick={() => onTriggerPracticeQuiz('Python & AI Engineering')}
          className="flex items-center gap-2 rounded-xl bg-[#4edea3] px-4 py-2.5 font-mono text-xs font-bold text-[#003824] hover:bg-[#3ecb90] active:scale-95 transition-all shadow-md shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add_task</span>
          <span>Ask Tutor for Fresh Quiz</span>
        </button>
      </div>

      {/* Practice Questions */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-bold text-white">Active Conceptual Challenges</h3>
        <div className="space-y-4">
          {PRACTICE_QUESTIONS.map((q) => {
            const selectedOpt = selectedAnswers[q.id];
            return (
              <div
                key={q.id}
                className="rounded-2xl bg-[#171f33] border border-[#2d3449] p-5 space-y-3.5 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#26296b] text-[#c0c1ff]">
                    {q.topic}
                  </span>
                  <span className="font-mono text-xs text-[#4edea3] font-bold">+50 XP</span>
                </div>

                <h4 className="font-mono text-sm md:text-base font-semibold text-white">
                  {q.question}
                </h4>

                <div className="flex flex-col gap-2 pt-1">
                  {q.options.map((opt) => {
                    const isSelected = selectedOpt === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelect(q.id, opt.id, q)}
                        className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-left text-xs md:text-sm transition-all border ${
                          isSelected
                            ? opt.isCorrect
                              ? 'bg-[#131b2e] border-[#4edea3] text-white shadow-sm'
                              : 'bg-[#131b2e] border-[#ffb4ab] text-white'
                            : 'bg-[#131b2e] border-[#222a3d] text-[#dae2fd] hover:bg-[#1f293d]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full font-mono text-xs font-bold ${
                              isSelected && opt.isCorrect
                                ? 'bg-[#4edea3] text-[#003824]'
                                : 'bg-[#222a3d] text-white'
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span>{opt.text}</span>
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

                {selectedOpt && (
                  <div className="rounded-xl bg-[#060e20] p-3 text-xs text-[#dae2fd] border border-[#222a3d] flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#4cd7f6] shrink-0 pt-0.5">
                      info
                    </span>
                    <span className="leading-relaxed">{q.explanation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiz History */}
      {quizAttempts.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-[#222a3d]">
          <h3 className="font-display text-base font-bold text-white">Your Quiz Attempt History</h3>
          <div className="space-y-2">
            {quizAttempts.map((attempt) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between rounded-xl bg-[#131b2e] border border-[#222a3d] p-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-3">
                  <span
                    className={`material-symbols-outlined text-[18px] shrink-0 ${
                      attempt.isCorrect ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                    }`}
                  >
                    {attempt.isCorrect ? 'check_circle' : 'cancel'}
                  </span>
                  <span className="truncate text-white font-medium">{attempt.question}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-[#4edea3] font-semibold">
                    +{attempt.xpEarned} XP
                  </span>
                  <span className="font-mono text-[#9aa99f]">
                    {new Date(attempt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
