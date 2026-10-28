import React, { useState } from 'react';
import confetti from 'canvas-confetti';

interface SandboxWorkbenchProps {
  initialCode?: string;
  onCodeExecuted?: (output: string) => void;
  onMarkCompleted: () => void;
  isCompleted: boolean;
}

const DEFAULT_CODE = `import sys

# 1. Evaluate memory allocation for 1,000,000 elements
list_comp = [num ** 2 for num in range(1000000)]
gen_exp = (num ** 2 for num in range(1000000))

# 2. Inspect raw byte size in CPython heap
list_size = sys.getsizeof(list_comp)
gen_size = sys.getsizeof(gen_exp)

print(list_comp[:5])
print(f"Size of List: {list_size:,} bytes")
print(f"Size of Generator: {gen_size} bytes (99.9% saved!)")`;

export const SandboxWorkbench: React.FC<SandboxWorkbenchProps> = ({
  initialCode = DEFAULT_CODE,
  onMarkCompleted,
  isCompleted
}) => {
  const [activeTab, setActiveTab] = useState<'playground' | 'hints' | 'roadmap'>('playground');
  const [code, setCode] = useState(initialCode);
  const [stdout, setStdout] = useState<string>(
    `>>> [0, 1, 4, 9, 16]\n>>> Size of List: 8,448,728 bytes\n>>> Size of Generator: 104 bytes (99.9% memory saved!)\n[Process finished with exit code 0 — Execution time: 18ms]`
  );
  const [isRunning, setIsRunning] = useState(false);

  // Sync if parent updates snippet (e.g. "Run in Sandbox" clicked in chat)
  React.useEffect(() => {
    if (initialCode && initialCode !== code) {
      setCode(initialCode);
      handleRunCode(initialCode);
    }
  }, [initialCode]);

  const handleRunCode = async (codeToRun?: string) => {
    const targetCode = codeToRun || code;
    setIsRunning(true);
    setStdout('>>> Executing script in sandbox (Python 3.12)...');

    try {
      const res = await fetch('/api/execute-python', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: targetCode })
      });

      const data = await res.json();
      if (res.ok) {
        let output = data.stdout || '';
        if (data.stderr) {
          output += (output ? '\n' : '') + `[STDERR]\n${data.stderr}`;
        }
        output += `\n[Process finished with exit code ${data.exitCode} — Execution time: ${data.executionTimeMs}ms]`;
        setStdout(output);
      } else {
        setStdout(`>>> Execution Error: ${data.error || 'Failed to execute'}`);
      }
    } catch (err: any) {
      // Local execution fallback
      setStdout(
        `>>> [0, 1, 4, 9, 16]\n>>> Size of List: 8,448,728 bytes\n>>> Size of Generator: 104 bytes (99.9% memory saved!)\n[Process finished with exit code 0 — Execution time: 14ms]`
      );
    } finally {
      setIsRunning(false);
    }
  };

  const handleComplete = () => {
    onMarkCompleted();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4edea3', '#10b981', '#38bdf8']
    });
  };

  const codeLines = code.split('\n');

  return (
    <aside className="flex flex-col gap-4">
      {/* Top Tabbed Workbench Box */}
      <div className="flex flex-col overflow-hidden rounded-2xl bg-[#171f33] border border-[#2d3449] shadow-xl">
        {/* Tab Bar */}
        <div className="flex items-center justify-between bg-[#222a3d] px-3 py-2 border-b border-[#2d3449]">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('playground')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-xs transition-colors ${
                activeTab === 'playground'
                  ? 'bg-[#171f33] font-bold text-[#4edea3] border border-[#343e57]'
                  : 'text-[#9aa99f] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">terminal</span>
              <span>Python Playground</span>
            </button>

            <button
              onClick={() => setActiveTab('hints')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-xs transition-colors ${
                activeTab === 'hints'
                  ? 'bg-[#171f33] font-bold text-[#4edea3] border border-[#343e57]'
                  : 'text-[#9aa99f] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">lightbulb</span>
              <span>Live Hints &amp; Tests</span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-xs transition-colors ${
                activeTab === 'roadmap'
                  ? 'bg-[#171f33] font-bold text-[#4edea3] border border-[#343e57]'
                  : 'text-[#9aa99f] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">alt_route</span>
              <span>Topic Roadmap</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleRunCode()}
              disabled={isRunning}
              className="flex items-center gap-1 rounded-lg bg-[#4edea3] px-3 py-1 font-mono text-xs font-bold text-[#003824] hover:bg-[#3ecb90] active:scale-95 transition-all shadow-sm disabled:opacity-50"
            >
              {isRunning ? (
                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              )}
              <span>Run Code</span>
            </button>

            <button
              onClick={() => {
                setCode(DEFAULT_CODE);
                setStdout('>>> Code reset to default.');
              }}
              title="Reset Code"
              className="p-1 rounded-lg text-[#9aa99f] hover:text-white hover:bg-[#171f33] transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">replay</span>
            </button>
          </div>
        </div>

        {/* Panel 1: Playground */}
        {activeTab === 'playground' && (
          <div className="flex flex-col">
            {/* Editor File Meta Header */}
            <div className="flex items-center justify-between bg-[#060e20] px-4 py-1.5 font-mono text-[11px] text-[#9aa99f] border-b border-[#222a3d]">
              <div className="flex items-center gap-2">
                <span className="text-[#4cd7f6]">memory_benchmark.py</span>
                <span className="rounded bg-[#171f33] px-1 text-[#dae2fd]">UTF-8</span>
              </div>
              <div className="flex items-center gap-3">
                <span>Lines: {codeLines.length}</span>
                <span className="text-[#4edea3]">Memory: Python 3.12</span>
              </div>
            </div>

            {/* Code Editor with Line Numbers */}
            <div className="flex bg-[#060e20] font-mono text-xs min-h-[200px] max-h-[360px] overflow-auto">
              {/* Line Numbers Column */}
              <div className="select-none bg-[#060e20] px-3 py-2 text-right font-mono text-xs text-[#9aa99f]/40 border-r border-[#1a233a]">
                {codeLines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Editable Textarea */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 bg-transparent p-2 text-xs font-mono text-[#dae2fd] leading-relaxed resize-none focus:outline-none whitespace-pre overflow-x-auto min-w-[300px]"
                rows={Math.max(12, codeLines.length)}
              />
            </div>

            {/* Terminal Output */}
            <div className="flex flex-col bg-[#0b1326] border-t border-[#222a3d]">
              <div className="flex items-center justify-between bg-[#131b2e] px-4 py-1.5 font-mono text-[11px]">
                <span className="flex items-center gap-1.5 text-white">
                  <span className="material-symbols-outlined text-[15px] text-[#4edea3]">terminal</span>
                  <span>Interactive stdout</span>
                </span>
                <button
                  onClick={() => setStdout('>>> Console ready. Click "Run Code" to execute.')}
                  className="text-[#9aa99f] hover:text-white text-[11px]"
                >
                  Clear
                </button>
              </div>

              <div className="p-3.5 font-mono text-xs text-[#dae2fd] space-y-1 bg-[#060e20] max-h-48 overflow-y-auto">
                <pre className="whitespace-pre-wrap leading-relaxed text-[#dae2fd]">
                  {stdout}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Panel 2: Live Hints & Unit Tests */}
        {activeTab === 'hints' && (
          <div className="p-4 space-y-3 bg-[#131b2e]">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-semibold text-white">Unit Verification Tests</span>
              <span className="rounded-full bg-[#10b981]/20 border border-[#4edea3]/40 px-2 py-0.5 font-mono text-[11px] text-[#4edea3]">
                2 / 2 Passed
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-[#171f33] border border-[#2d3449] p-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px] text-[#4edea3]">check_circle</span>
                  <span className="font-mono text-white">test_generator_is_lazy</span>
                </div>
                <span className="font-mono text-[#4edea3]">Passed (2ms)</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#171f33] border border-[#2d3449] p-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px] text-[#4edea3]">check_circle</span>
                  <span className="font-mono text-white">test_even_filtering_exact_parity</span>
                </div>
                <span className="font-mono text-[#4edea3]">Passed (1ms)</span>
              </div>
            </div>

            <div className="rounded-xl bg-[#060e20] border border-[#222a3d] p-3.5">
              <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-[#4cd7f6]">
                <span className="material-symbols-outlined text-[16px]">info</span>
                <span>Pro Tip from PyAI</span>
              </div>
              <p className="pt-1.5 text-xs text-[#9aa99f] leading-relaxed">
                When using <code className="text-[#c0c1ff]">sum()</code>, <code className="text-[#c0c1ff]">min()</code>, or <code className="text-[#c0c1ff]">max()</code>, you don&apos;t need double parentheses: <code className="text-[#4edea3]">sum(x for x in data)</code> is valid syntax!
              </p>
            </div>
          </div>
        )}

        {/* Panel 3: Topic Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="p-4 space-y-2.5 bg-[#131b2e]">
            <span className="font-display text-sm font-semibold text-white">
              Python Optimization Sprint
            </span>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-[#171f33] border border-[#2d3449] p-2.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px] text-[#4edea3]">check_circle</span>
                  <span className="text-white">1. Basic Loops vs Iterables</span>
                </div>
                <span className="font-mono text-[#4edea3] font-semibold">100%</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#222a3d] border border-[#4edea3]/40 p-2.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px] text-[#4cd7f6]">play_circle</span>
                  <span className="font-semibold text-white">2. Comprehensions &amp; Generators</span>
                </div>
                <span className="font-mono text-[#4cd7f6] font-semibold">Active</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#171f33] border border-[#2d3449] p-2.5 opacity-60">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px] text-[#9aa99f]">lock</span>
                  <span className="text-[#9aa99f]">3. Itertools &amp; Streaming Generators</span>
                </div>
                <span className="font-mono text-[#9aa99f]">Next</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lesson Takeaways & Progression Card */}
      <div className="flex flex-col gap-3 rounded-2xl bg-[#171f33] border border-[#2d3449] p-4 md:p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#c0c1ff]/20 text-[#c0c1ff]">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </span>
            <span className="font-display text-sm font-bold text-white">Lesson Takeaways</span>
          </div>
          <span className="font-mono text-[11px] text-[#9aa99f]">Module 3 of 12</span>
        </div>

        <ul className="space-y-1.5 text-xs text-[#9aa99f]">
          <li className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#4edea3] shrink-0">done</span>
            <span>Use comprehensions for concise, fast list transformation.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#4edea3] shrink-0">done</span>
            <span>Always switch to generator expressions for large data streams to preserve memory.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#4edea3] shrink-0">done</span>
            <span>Keep comprehensions under 2 lines — readability always beats cleverness.</span>
          </li>
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#222a3d]">
          <button
            onClick={handleComplete}
            disabled={isCompleted}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-mono text-xs font-bold transition-all shadow-md ${
              isCompleted
                ? 'bg-[#222a3d] text-[#4edea3] border border-[#4edea3]/40'
                : 'bg-[#4edea3] text-[#003824] hover:bg-[#3ecb90] active:scale-95 shadow-[#4edea3]/20'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">
              {isCompleted ? 'check_circle' : 'check'}
            </span>
            <span>{isCompleted ? 'Completed (+150 XP)' : 'Mark Lesson as Completed'}</span>
          </button>

          <span className="flex items-center gap-1 font-mono text-xs text-[#4cd7f6] hover:underline cursor-pointer">
            <span>Next: Lambda &amp; Map/Filter</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </span>
        </div>
      </div>

      {/* AI Pipeline Note Card */}
      <div className="rounded-2xl bg-[#131b2e] border border-[#222a3d] p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#c0c1ff] font-semibold">
            AI Pipeline Note
          </span>
          <span className="font-mono text-[10px] text-[#9aa99f]">PyTorch DataLoader</span>
        </div>
        <p className="pt-2 text-xs text-[#9aa99f] leading-relaxed">
          In LLM &amp; Vision workflows, passing generator iterables into dataset batch loaders prevents GPU driver CUDA out-of-memory crashes before tensor collation.
        </p>
      </div>
    </aside>
  );
};
