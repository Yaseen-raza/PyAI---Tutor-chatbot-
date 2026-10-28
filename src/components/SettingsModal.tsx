import React, { useState } from 'react';
import type { User, TutorMode, LanguagePref } from '../types/index.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  tutorMode: TutorMode;
  onChangeTutorMode: (mode: TutorMode) => void;
  languagePref: LanguagePref;
  onChangeLanguagePref: (lang: LanguagePref) => void;
  onDeleteAccount: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  tutorMode,
  onChangeTutorMode,
  languagePref,
  onChangeLanguagePref,
  onDeleteAccount
}) => {
  const [activeTab, setActiveTab] = useState<'preferences' | 'profile' | 'privacy'>('preferences');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-2xl bg-[#171f33] border border-[#2d3449] shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#222a3d] bg-[#131b2e]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-[#4edea3]">settings</span>
            <h3 className="font-display text-base font-bold text-white">
              Tutor Preferences &amp; Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#9aa99f] hover:text-white hover:bg-[#222a3d]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-[#222a3d] bg-[#060e20] px-5 pt-2 gap-4">
          <button
            onClick={() => setActiveTab('preferences')}
            className={`pb-2.5 font-mono text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'preferences'
                ? 'border-[#4edea3] text-[#4edea3]'
                : 'border-transparent text-[#9aa99f] hover:text-white'
            }`}
          >
            Learning Mode
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 font-mono text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-[#4edea3] text-[#4edea3]'
                : 'border-transparent text-[#9aa99f] hover:text-white'
            }`}
          >
            Learner Profile
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 font-mono text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'privacy'
                ? 'border-[#4edea3] text-[#4edea3]'
                : 'border-transparent text-[#9aa99f] hover:text-white'
            }`}
          >
            Security &amp; Privacy
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'preferences' && (
            <div className="space-y-5">
              {/* Tutor Mode */}
              <div className="space-y-2">
                <label className="font-display text-xs font-bold uppercase tracking-wider text-[#dae2fd]">
                  Pedagogical Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => onChangeTutorMode('tutor')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      tutorMode === 'tutor'
                        ? 'bg-[#131b2e] border-[#4edea3] text-white shadow-sm'
                        : 'bg-[#060e20] border-[#222a3d] text-[#9aa99f] hover:bg-[#131b2e]'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold text-[#4edea3]">Tutor Mode</span>
                    <span className="text-[11px] leading-tight">Socratic, conceptual, and step-by-step guidance.</span>
                  </button>

                  <button
                    onClick={() => onChangeTutorMode('reviewer')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      tutorMode === 'reviewer'
                        ? 'bg-[#131b2e] border-[#4edea3] text-white shadow-sm'
                        : 'bg-[#060e20] border-[#222a3d] text-[#9aa99f] hover:bg-[#131b2e]'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold text-[#4cd7f6]">Code Reviewer</span>
                    <span className="text-[11px] leading-tight">Focuses on PEP 8, types, and time complexity.</span>
                  </button>

                  <button
                    onClick={() => onChangeTutorMode('debug')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      tutorMode === 'debug'
                        ? 'bg-[#131b2e] border-[#4edea3] text-white shadow-sm'
                        : 'bg-[#060e20] border-[#222a3d] text-[#9aa99f] hover:bg-[#131b2e]'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold text-[#c0c1ff]">Debug Mode</span>
                    <span className="text-[11px] leading-tight">Pinpoints stack trace root causes &amp; fixes.</span>
                  </button>
                </div>
              </div>

              {/* Language Preference */}
              <div className="space-y-2">
                <label className="font-display text-xs font-bold uppercase tracking-wider text-[#dae2fd]">
                  Explanation Language
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onChangeLanguagePref('english')}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      languagePref === 'english'
                        ? 'bg-[#131b2e] border-[#4edea3] text-white'
                        : 'bg-[#060e20] border-[#222a3d] text-[#9aa99f]'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold">Standard English</span>
                      <span className="text-[11px] text-[#9aa99f]">Clean pedagogical clarity</span>
                    </div>
                    {languagePref === 'english' && (
                      <span className="material-symbols-outlined text-[18px] text-[#4edea3]">check</span>
                    )}
                  </button>

                  <button
                    onClick={() => onChangeLanguagePref('roman-urdu')}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      languagePref === 'roman-urdu'
                        ? 'bg-[#131b2e] border-[#4edea3] text-white'
                        : 'bg-[#060e20] border-[#222a3d] text-[#9aa99f]'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold">Roman Urdu</span>
                      <span className="text-[11px] text-[#9aa99f]">Hinglish / Roman Urdu</span>
                    </div>
                    {languagePref === 'roman-urdu' && (
                      <span className="material-symbols-outlined text-[18px] text-[#4edea3]">check</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#131b2e] border border-[#222a3d]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#10b981] to-[#4edea3] text-[#003824] flex items-center justify-center font-bold text-lg">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="flex flex-col">
                  <h4 className="font-display font-semibold text-white">{user?.name}</h4>
                  <span className="font-mono text-xs text-[#9aa99f]">{user?.email}</span>
                  <span className="font-mono text-xs text-[#4edea3] font-bold mt-1">
                    {user?.level} • {user?.xp} XP
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#060e20] border border-[#222a3d] space-y-1">
                  <span className="font-mono text-[11px] text-[#9aa99f]">Learning Streak</span>
                  <div className="font-display text-lg font-bold text-white flex items-center gap-1.5">
                    <span>🔥</span>
                    <span>{user?.streakDays || 6} Days</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#060e20] border border-[#222a3d] space-y-1">
                  <span className="font-mono text-[11px] text-[#9aa99f]">Sandbox Quota</span>
                  <div className="font-display text-lg font-bold text-white">
                    {user?.executionQuotaUsed ?? 64} / {user?.executionQuotaMax ?? 100}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4 text-xs text-[#9aa99f] leading-relaxed">
              <div className="p-4 rounded-xl bg-[#131b2e] border border-[#222a3d] space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold font-mono">
                  <span className="material-symbols-outlined text-[18px] text-[#4edea3]">security</span>
                  <span>Data Protection &amp; AI Privacy</span>
                </div>
                <p>
                  Conversations, code snippets, bookmarks, and quiz scores are securely persisted on the application server. Prompts are processed using Google Gemini via secure server-side API proxy.
                </p>
                <p className="text-[#ffb4ab]">
                  Important: Avoid pasting confidential production credentials, cloud secrets, or private customer records into code snippets.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/40 space-y-3">
                <div className="flex items-center gap-2 text-[#ffb4ab] font-bold font-mono">
                  <span className="material-symbols-outlined text-[18px]">warning</span>
                  <span>Danger Zone: Account &amp; Data Deletion</span>
                </div>
                <p className="text-white">
                  Permanently delete all conversations, bookmarks, and learning records. This operation is immediate and irreversible.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Are you absolutely certain? This will delete all your conversations, bookmarks, and learning stats.')) {
                      onDeleteAccount();
                      onClose();
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#ef4444] text-white font-mono font-bold hover:bg-[#dc2626] transition-colors"
                >
                  Delete Account &amp; Wipe Data
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#131b2e] border-t border-[#222a3d] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#4edea3] text-[#003824] font-mono text-xs font-bold hover:bg-[#3ecb90]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
