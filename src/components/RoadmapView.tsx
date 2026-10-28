import React from 'react';
import type { LearningTopic } from '../types/index.ts';

interface RoadmapViewProps {
  topics: LearningTopic[];
  onSelectTopic: (topic: LearningTopic) => void;
  activeTrack: string;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  topics,
  onSelectTopic,
  activeTrack
}) => {
  const filteredTopics = activeTrack
    ? topics.filter((t) => t.category === activeTrack)
    : topics;

  const totalTopics = topics.length;
  const completedTopics = topics.filter((t) => t.isCompleted).length;
  const overallMastery = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-6xl mx-auto">
      {/* Top Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#171f33] via-[#1a253e] to-[#131b2e] border border-[#2d3449] p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#4edea3]/20 text-[#4edea3]">
              <span className="material-symbols-outlined text-[20px]">alt_route</span>
            </span>
            <h2 className="font-display text-xl md:text-2xl font-bold text-white">
              AI Engineering Learning Roadmap
            </h2>
          </div>
          <p className="text-sm text-[#9aa99f] max-w-xl">
            A comprehensive, step-by-step curriculum taking you from fundamental Python syntax to neural network backprop, production RAG pipelines, and autonomous LLM agents.
          </p>
        </div>

        {/* Global Progress Gauge */}
        <div className="flex items-center gap-4 bg-[#060e20]/80 rounded-2xl p-4 border border-[#222a3d] shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-xs font-mono text-[#9aa99f]">Track Completion</span>
            <span className="text-2xl font-display font-bold text-[#4edea3]">{overallMastery}%</span>
            <span className="text-[11px] font-mono text-[#4cd7f6]">{completedTopics} of {totalTopics} Modules</span>
          </div>
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#222a3d]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#4edea3]"
                strokeDasharray={`${overallMastery}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-mono font-bold text-white">{completedTopics}</span>
          </div>
        </div>
      </div>

      {/* Grid of Topics for Current Track */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
            <span>{activeTrack} Modules</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#222a3d] text-[#c0c1ff]">
              {filteredTopics.length} Lessons
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTopics.map((topic) => {
            const isDone = topic.isCompleted;
            return (
              <div
                key={topic.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-all ${
                  isDone
                    ? 'bg-[#171f33]/90 border-[#4edea3]/40 shadow-sm'
                    : 'bg-[#131b2e] border-[#222a3d] hover:border-[#3c4a63]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#26296b] text-[#c0c1ff]">
                      {topic.difficulty}
                    </span>
                    <span className="font-mono text-xs text-[#9aa99f] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">schedule</span>
                      <span>{topic.estimatedTime}</span>
                    </span>
                  </div>

                  <h4 className="font-display text-base font-semibold text-white">
                    {topic.title}
                  </h4>

                  <p className="text-xs text-[#9aa99f] leading-relaxed">
                    {topic.description}
                  </p>

                  {/* Key Concepts Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {topic.keyConcepts.map((concept, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-[#222a3d] px-2 py-0.5 font-mono text-[10px] text-[#dae2fd]"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#222a3d]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#9aa99f]">Mastery:</span>
                    <span className="font-mono text-xs font-bold text-[#4edea3]">
                      {topic.masteryPercent}%
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectTopic(topic)}
                    className="flex items-center gap-1.5 rounded-xl bg-[#4edea3] px-3.5 py-1.5 font-mono text-xs font-bold text-[#003824] hover:bg-[#3ecb90] active:scale-95 transition-all shadow-sm"
                  >
                    <span>{isDone ? 'Review Lesson' : 'Start Session'}</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
