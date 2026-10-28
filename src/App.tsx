/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { TopicBar } from './components/TopicBar.tsx';
import { ChatStream } from './components/ChatStream.tsx';
import { Composer } from './components/Composer.tsx';
import { SandboxWorkbench } from './components/SandboxWorkbench.tsx';
import { RoadmapView } from './components/RoadmapView.tsx';
import { QuizLabsView } from './components/QuizLabsView.tsx';
import { BookmarksView } from './components/BookmarksView.tsx';
import { PythonTutorialLibrary } from './components/PythonTutorialLibrary.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import type {
  User,
  Conversation,
  Message,
  LearningTopic,
  Bookmark,
  QuizAttempt,
  TutorMode,
  LanguagePref
} from './types/index.ts';

export default function App() {
  // Application State
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [curriculumTopics, setCurriculumTopics] = useState<LearningTopic[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

  // Navigation & View Mode
  const [currentTab, setCurrentTab] = useState<'chat' | 'tutorials' | 'roadmap' | 'quiz' | 'bookmarks'>('chat');
  const [mobilePane, setMobilePane] = useState<'chat' | 'sandbox'>('chat');
  const [activeTrack, setActiveTrack] = useState<string>('Python Fundamentals');
  const [tutorMode, setTutorMode] = useState<TutorMode>('tutor');
  const [languagePref, setLanguagePref] = useState<LanguagePref>('english');
  const [isDark, setIsDark] = useState<boolean>(true);

  // Modals & Drawers
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Workbench State
  const [playgroundCode, setPlaygroundCode] = useState<string>(`import sys

# 1. Evaluate memory allocation for 1,000,000 elements
list_comp = [num ** 2 for num in range(1000000)]
gen_exp = (num ** 2 for num in range(1000000))

# 2. Inspect raw byte size in CPython heap
list_size = sys.getsizeof(list_comp)
gen_size = sys.getsizeof(gen_exp)

print(list_comp[:5])
print(f"Size of List: {list_size:,} bytes")
print(f"Size of Generator: {gen_size} bytes (99.9% saved!)")`);
  const [isLessonCompleted, setIsLessonCompleted] = useState<boolean>(false);

  // Load User, Preferences, Conversations, and Curriculum
  const loadInitialData = useCallback(async () => {
    try {
      // 1. Load User
      const userRes = await fetch('/api/user');
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
        if (userData.preferences) {
          setTutorMode(userData.preferences.tutorMode || 'tutor');
          setLanguagePref(userData.preferences.languagePref || 'english');
        }
      }

      // 2. Load Conversations
      const convRes = await fetch('/api/conversations');
      if (convRes.ok) {
        const { conversations: convList } = await convRes.json();
        setConversations(convList);
        if (convList.length > 0) {
          const firstId = convList[0].id;
          setActiveConversationId(firstId);
          loadConversationMessages(firstId);
        }
      }

      // 3. Load Curriculum
      const currRes = await fetch('/api/curriculum');
      if (currRes.ok) {
        const { topics } = await currRes.json();
        setCurriculumTopics(topics);
      }

      // 4. Load Bookmarks
      const bmRes = await fetch('/api/bookmarks');
      if (bmRes.ok) {
        const { bookmarks: bmList } = await bmRes.json();
        setBookmarks(bmList);
      }

      // 5. Load Quiz Attempts
      const quizRes = await fetch('/api/quizzes');
      if (quizRes.ok) {
        const { attempts } = await quizRes.json();
        setQuizAttempts(attempts);
      }
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Load Messages for a specific conversation
  const loadConversationMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/conversations/${convId}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentConversation(data.conversation);
        setMessages(data.messages);

        // If the message has code, update playground
        const lastWithCode = [...data.messages].reverse().find((m: Message) => m.metadata?.codeSnippet?.code);
        if (lastWithCode?.metadata?.codeSnippet?.code) {
          setPlaygroundCode(lastWithCode.metadata.codeSnippet.code);
        }
      }
    } catch (err) {
      console.error('Error loading conversation messages:', err);
    }
  };

  // Keyboard shortcut for Search ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Theme Sync
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Handlers for Conversations CRUD
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    loadConversationMessages(id);
  };

  const handleNewConversation = async () => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Python Tutorial Session',
          topicTag: 'Core Python'
        })
      });

      if (res.ok) {
        const newConv = await res.json();
        setConversations((prev) => [newConv, ...prev]);
        setActiveConversationId(newConv.id);
        setCurrentConversation(newConv);
        setMessages([
          {
            id: `msg_welcome_${Date.now()}`,
            conversationId: newConv.id,
            role: 'assistant',
            content: `👋 **Welcome to your personal Python & AI Engineering Tutor!**\n\nI am here to guide you step-by-step from zero to building practical Python programs and AI models.\n\n### 🚀 Quick Ways to Start:\n- Ask any question: *"How do variables and data types work in Python?"*\n- Ask for an explanation with everyday analogies: *"Explain loops like I am 10 years old"*\n- Request practice: *"Give me an exercise to practice lists and dictionaries"*\n- Or explore the **"Python Notes & Lessons"** tab to run structured tutorials directly in the sandbox!`,
            createdAt: new Date().toISOString()
          }
        ]);
        setCurrentTab('chat');
        setMobilePane('chat');
      }
    } catch (err) {
      console.error('Error creating conversation:', err);
    }
  };

  const handleRenameConversation = async (id: string, newTitle: string) => {
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
      });

      if (res.ok) {
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
        );
        if (currentConversation?.id === id) {
          setCurrentConversation((prev) => (prev ? { ...prev, title: newTitle } : null));
        }
      }
    } catch (err) {
      console.error('Error renaming conversation:', err);
    }
  };

  const handleTogglePinConversation = async (id: string, currentPin: boolean) => {
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !currentPin })
      });

      if (res.ok) {
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isPinned: !currentPin } : c))
        );
      }
    } catch (err) {
      console.error('Error toggling pin:', err);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        const remaining = conversations.filter((c) => c.id !== id);
        setConversations(remaining);
        if (activeConversationId === id) {
          if (remaining.length > 0) {
            setActiveConversationId(remaining[0].id);
            loadConversationMessages(remaining[0].id);
          } else {
            handleNewConversation();
          }
        }
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
    }
  };

  // Handlers for Messaging
  const handleSendMessage = async (text: string, mode: TutorMode) => {
    if (!text.trim() || isLoading) return;

    setIsLoading(true);

    // Optimistically add user message
    const tempUserMsg: Message = {
      id: `temp_${Date.now()}`,
      conversationId: activeConversationId || 'pending',
      role: 'user',
      content: text,
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversationId,
          prompt: text,
          tutorMode: mode,
          languagePref,
          topicTag: currentConversation?.topicTag || 'Core Python'
        })
      });

      if (res.ok) {
        const data = await res.json();

        if (!activeConversationId) {
          setActiveConversationId(data.conversationId);
        }

        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMsg.id),
          data.userMessage,
          data.assistantMessage
        ]);

        if (data.userXp && user) {
          setUser((prev) => (prev ? { ...prev, xp: data.userXp } : null));
        }

        // Auto load code into playground if present
        if (data.assistantMessage?.metadata?.codeSnippet?.code) {
          setPlaygroundCode(data.assistantMessage.metadata.codeSnippet.code);
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMessage = async (msgId: string, newContent: string) => {
    if (!activeConversationId) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/conversations/${activeConversationId}/messages/${msgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent })
      });

      if (res.ok) {
        const data = await res.json();
        loadConversationMessages(activeConversationId);
        if (data.assistantMessage?.metadata?.codeSnippet?.code) {
          setPlaygroundCode(data.assistantMessage.metadata.codeSnippet.code);
        }
      }
    } catch (err) {
      console.error('Error editing message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Action Buttons
  const handleExplainRomanUrdu = () => {
    handleSendMessage('Please explain this Python concept in Roman Urdu / Hinglish with simple everyday analogies.', tutorMode);
  };

  const handleGenerateExercise = () => {
    handleSendMessage('Give me a hands-on Python coding challenge with starter code and expected outputs to practice this.', tutorMode);
  };

  const handleBookmarkSnippet = async (title: string, code: string, topicTag: string) => {
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          snippet: code,
          topicTag
        })
      });

      if (res.ok) {
        const newBm = await res.json();
        setBookmarks((prev) => [newBm, ...prev]);
        alert('Code snippet bookmarked to your Saved Snippets!');
      }
    } catch (err) {
      console.error('Error saving bookmark:', err);
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    try {
      const res = await fetch(`/api/bookmarks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error('Error deleting bookmark:', err);
    }
  };

  const handleMarkLessonComplete = async () => {
    const topicId = 'py-comprehensions';
    try {
      const res = await fetch('/api/progress/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId })
      });

      if (res.ok) {
        const data = await res.json();
        setIsLessonCompleted(true);
        if (user && data.userXp) {
          setUser((prev) => (prev ? { ...prev, xp: data.userXp } : null));
        }
      }
    } catch (err) {
      console.error('Error marking lesson complete:', err);
    }
  };

  const handleQuizAnswerSubmit = async (
    quizId: string,
    optionId: string,
    isCorrect: boolean,
    explanation: string
  ) => {
    try {
      const res = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId,
          question: 'What will sum(x for x in range(1_000_000)) do compared to sum([x for x in range(1_000_000)])?',
          selectedOption: optionId,
          isCorrect,
          explanation,
          xpAward: 50
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.totalXp && user) {
          setUser((prev) => (prev ? { ...prev, xp: data.totalXp } : null));
        }
      }
    } catch (err) {
      console.error('Error submitting quiz answer:', err);
    }
  };

  const handleSelectCurriculumTopic = (topic: LearningTopic) => {
    setActiveTrack(topic.category);
    if (topic.defaultCode) {
      setPlaygroundCode(topic.defaultCode);
    }
    handleSendMessage(topic.starterPrompt, tutorMode);
    setCurrentTab('chat');
    setMobilePane('chat');
  };

  const handleDeleteAccount = async () => {
    try {
      await fetch('/api/user/account', { method: 'DELETE' });
      window.location.reload();
    } catch (err) {
      console.error('Error wiping user data:', err);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b1326] text-[#dae2fd]">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onRenameConversation={handleRenameConversation}
        onTogglePinConversation={handleTogglePinConversation}
        onDeleteConversation={handleDeleteConversation}
        user={user}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          user={user}
          activeTrack={activeTrack}
          onSelectTrack={(t) => {
            setActiveTrack(t);
            setCurrentTab('roadmap');
          }}
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto pt-16 flex flex-col bg-[#0b1326]">
          {currentTab === 'chat' && (
            <div className="flex flex-col w-full h-full">
              {/* Topic Overview & Metadata Status Bar */}
              <TopicBar
                title={currentConversation?.title ? `Topic: ${currentConversation.title}` : 'Topic: Mastering List Comprehensions & Generator Expressions in Python'}
                difficulty="Beginner-Intermediate"
                topicTag={currentConversation?.topicTag || 'Core Python'}
                runtimeCost="Estimated runtime cost: O(N) vs O(1) Memory"
                environmentStatus="Lab Environment Ready (Python 3.12.3)"
                masteryPercent={68}
                isBookmarked={bookmarks.length > 0}
                onToggleBookmark={() => {
                  if (bookmarks.length > 0) {
                    handleDeleteBookmark(bookmarks[0].id);
                  } else {
                    handleBookmarkSnippet('List Comprehensions vs Gen', playgroundCode, 'Python Core');
                  }
                }}
                onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
              />

              {/* Responsive Device Switcher for Phones and Tablets (< xl) */}
              <div className="xl:hidden flex items-center justify-between p-2.5 bg-[#131b2e] border-b border-[#1f293d] px-4">
                <div className="flex items-center gap-1.5 rounded-xl bg-[#060e20] p-1 border border-[#222a3d] w-full">
                  <button
                    onClick={() => setMobilePane('chat')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      mobilePane === 'chat'
                        ? 'bg-[#4edea3] text-[#003824] shadow-sm'
                        : 'text-[#9aa99f] hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span>Tutor Chat</span>
                  </button>

                  <button
                    onClick={() => setMobilePane('sandbox')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      mobilePane === 'sandbox'
                        ? 'bg-[#4edea3] text-[#003824] shadow-sm'
                        : 'text-[#9aa99f] hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">terminal</span>
                    <span>Code Sandbox</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('tutorials')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-[#c0c1ff] hover:text-white hover:bg-[#171f33]"
                  >
                    <span className="material-symbols-outlined text-[16px]">menu_book</span>
                    <span>Notes</span>
                  </button>
                </div>
              </div>

              {/* Main Workspace: Split-screen on desktop (xl:), tabbed on mobile/tablet */}
              <div className="grid w-full grid-cols-1 gap-4 p-3 sm:p-4 md:p-6 xl:grid-cols-12 flex-1 pb-16 xl:pb-6">
                {/* Left: Chat Stream & Composer */}
                <section
                  className={`flex flex-col gap-4 xl:col-span-7 ${
                    mobilePane === 'chat' ? 'flex' : 'hidden xl:flex'
                  }`}
                >
                  <ChatStream
                    messages={messages}
                    isLoading={isLoading}
                    onRunSnippetInSandbox={(code) => {
                      setPlaygroundCode(code);
                      setMobilePane('sandbox');
                    }}
                    onExplainRomanUrdu={handleExplainRomanUrdu}
                    onGenerateExercise={handleGenerateExercise}
                    onBookmarkSnippet={handleBookmarkSnippet}
                    onRegenerate={() => {
                      const lastUser = [...messages].reverse().find((m) => m.role === 'user');
                      if (lastUser) {
                        handleSendMessage(lastUser.content, tutorMode);
                      }
                    }}
                    onEditMessage={handleEditMessage}
                    onQuizAnswerSubmit={handleQuizAnswerSubmit}
                  />

                  {/* Bottom Composer */}
                  <Composer
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    tutorMode={tutorMode}
                    onChangeTutorMode={setTutorMode}
                  />
                </section>

                {/* Right: Sandbox, Hints, Tests & Takeaways */}
                <div
                  className={`xl:col-span-5 flex flex-col gap-4 ${
                    mobilePane === 'sandbox' ? 'flex' : 'hidden xl:flex'
                  }`}
                >
                  <SandboxWorkbench
                    initialCode={playgroundCode}
                    onMarkCompleted={handleMarkLessonComplete}
                    isCompleted={isLessonCompleted}
                  />
                </div>
              </div>
            </div>
          )}

          {currentTab === 'tutorials' && (
            <PythonTutorialLibrary
              onLoadCodeIntoPlayground={(code) => {
                setPlaygroundCode(code);
                setCurrentTab('chat');
                setMobilePane('sandbox');
              }}
              onAskTutorAboutTopic={(prompt) => {
                handleSendMessage(prompt, tutorMode);
                setCurrentTab('chat');
                setMobilePane('chat');
              }}
            />
          )}

          {currentTab === 'roadmap' && (
            <RoadmapView
              topics={curriculumTopics}
              onSelectTopic={handleSelectCurriculumTopic}
              activeTrack={activeTrack}
            />
          )}

          {currentTab === 'quiz' && (
            <QuizLabsView
              quizAttempts={quizAttempts}
              onTriggerPracticeQuiz={(topic) => {
                handleSendMessage(`Generate a high-yield conceptual quiz question for: ${topic}`, tutorMode);
                setCurrentTab('chat');
              }}
              onAnswerQuestion={(question, opt, isCorrect, xp) => {
                handleQuizAnswerSubmit('practice', opt, isCorrect, 'Verification completed');
              }}
            />
          )}

          {currentTab === 'bookmarks' && (
            <BookmarksView
              bookmarks={bookmarks}
              onDeleteBookmark={handleDeleteBookmark}
              onSendToPlayground={(code) => {
                setPlaygroundCode(code);
                setCurrentTab('chat');
                setMobilePane('sandbox');
              }}
            />
          )}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        tutorMode={tutorMode}
        onChangeTutorMode={setTutorMode}
        languagePref={languagePref}
        onChangeLanguagePref={setLanguagePref}
        onDeleteAccount={handleDeleteAccount}
      />

      {/* Search Modal (⌘K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        conversations={conversations}
        topics={curriculumTopics}
        onSelectConversation={(id) => {
          handleSelectConversation(id);
          setCurrentTab('chat');
        }}
        onSelectTopic={handleSelectCurriculumTopic}
      />
    </div>
  );
}
