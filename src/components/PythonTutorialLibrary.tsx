import React, { useState } from 'react';

export interface TutorialLesson {
  id: string;
  category: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'AI Engineering';
  summary: string;
  notes: string[];
  codeExample: string;
  commonMistake: string;
  exercise: {
    question: string;
    hint: string;
    solutionCode: string;
  };
}

export const TUTORIAL_LESSONS: TutorialLesson[] = [
  {
    id: 'tut-basics',
    category: '1. Fundamentals',
    title: 'Python Basics, Print & Variables',
    level: 'Beginner',
    summary: 'Variables are named storage containers for data. Python is dynamically typed, meaning you do not need to declare types manually.',
    notes: [
      'Variable names are case-sensitive and must start with a letter or underscore.',
      'Use descriptive snake_case for variable and function names (PEP 8).',
      'The print() function outputs data to stdout; multiple items can be separated by commas.',
      'Comments start with # and are ignored during execution.'
    ],
    codeExample: `# Python Basics & Dynamic Typing
user_name = "Alex"
age = 24
gpa = 3.85
is_enrolled = True

print(f"Learner: {user_name}, Age: {age}, GPA: {gpa}")
print(f"Type of age: {type(age).__name__}")
print(f"Type of gpa: {type(gpa).__name__}")

# Type conversion (casting)
age_in_5_years = age + int("5")
print(f"Age in 5 years: {age_in_5_years}")`,
    commonMistake: 'Trying to concatenate a string and a number with + like "Age: " + 25 causes a TypeError. Use f-strings instead: f"Age: {25}".',
    exercise: {
      question: 'Create variables for item_price (float) and quantity (int), calculate the total cost, and print it formatted as currency.',
      hint: 'Multiply price by quantity and use f-string f"${total:.2f}".',
      solutionCode: `item_price = 19.99\nquantity = 3\ntotal_cost = item_price * quantity\nprint(f"Total: \${total_cost:.2f}")`
    }
  },
  {
    id: 'tut-conditionals',
    category: '2. Control Flow',
    title: 'Conditionals (if, elif, else) & Logic',
    level: 'Beginner',
    summary: 'Branch your program logic based on boolean expressions. Python uses indentation to define code blocks.',
    notes: [
      'Every condition ends with a colon (:).',
      'Logical operators are plain English words: and, or, not.',
      'Comparison operators: == (equal), != (not equal), >, <, >=, <=.',
      'Truthy vs Falsy: 0, None, "", [], and {} are considered False.'
    ],
    codeExample: `# Conditionals & Decision Making
score = 88

if score >= 90:
    grade = "A+ (Excellent)"
elif score >= 80:
    grade = "A (Good)"
elif score >= 70:
    grade = "B (Satisfactory)"
else:
    grade = "Needs Improvement"

print(f"Final Score: {score} -> Grade: {grade}")

# Ternary operator (one-line if-else)
status = "Passed" if score >= 70 else "Failed"
print(f"Course Status: {status}")`,
    commonMistake: 'Using a single = (assignment) instead of == (comparison) inside an if condition.',
    exercise: {
      question: 'Write a condition checking if a number is positive, negative, or zero.',
      hint: 'Use if num > 0: ... elif num < 0: ... else: ...',
      solutionCode: `num = -7\nif num > 0:\n    print("Positive")\nelif num < 0:\n    print("Negative")\nelse:\n    print("Zero")`
    }
  },
  {
    id: 'tut-loops',
    category: '3. Repetition',
    title: 'Loops (for, while, enumerate & range)',
    level: 'Beginner',
    summary: 'Loops automate repeating tasks. Use for loops when you know the sequence length, and while loops when waiting for a condition.',
    notes: [
      'range(start, stop, step) generates numbers up to, but NOT including, stop.',
      'enumerate(iterable, start=0) gives you both the index and value together.',
      'zip(list_a, list_b) iterates through two or more lists in parallel.',
      'break exits the loop immediately; continue skips to the next iteration.'
    ],
    codeExample: `# For loop with range and step
print("Countdown:")
for i in range(5, 0, -1):
    print(f"T-minus {i}")
print("Liftoff! 🚀\n")

# Enumerate with fruits
technologies = ["Python", "PyTorch", "Transformers", "LangChain"]
for rank, tech in enumerate(technologies, start=1):
    print(f"{rank}. {tech}")

# While loop with safety limit
counter = 1
while counter <= 3:
    print(f"Ping #{counter} - Server Healthy")
    counter += 1`,
    commonMistake: 'Remember range(5) yields 0, 1, 2, 3, 4 (5 numbers, stopping before 5)!',
    exercise: {
      question: 'Sum all numbers from 1 to 50 using a for loop with range().',
      hint: 'Initialize total = 0 and add each number.',
      solutionCode: `total = 0\nfor n in range(1, 51):\n    total += n\nprint("Sum 1..50:", total)  # 1275`
    }
  },
  {
    id: 'tut-lists',
    category: '4. Data Structures',
    title: 'Lists, Slicing & Comprehensions',
    level: 'Beginner',
    summary: 'Lists are ordered, mutable collections of items. List comprehensions provide an elegant syntax for transforming and filtering sequences.',
    notes: [
      'Negative indexing: list[-1] gets the last element.',
      'Slicing: list[start:stop:step]. list[::-1] reverses a list.',
      'Common methods: .append(), .extend(), .pop(), .insert(), .sort().',
      'List Comprehension: [expression for item in iterable if condition].'
    ],
    codeExample: `# Lists & Slicing
tokens = ["User", "Prompt", "Embedding", "Vector", "Response"]

print("First token:", tokens[0])
print("Last token:", tokens[-1])
print("Middle slice:", tokens[1:4])
print("Reversed:", tokens[::-1])

# List Comprehension for Data Filtering
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_squares = [n ** 2 for n in numbers if n % 2 == 0]
print("Even Squares:", even_squares)`,
    commonMistake: 'Using list.append(another_list) adds the whole list as a single nested item. Use list.extend() or the + operator to merge lists.',
    exercise: {
      question: 'Given words = ["cat", "elephant", "dog", "hippopotamus"], create a list containing only words longer than 3 characters converted to UPPERCASE.',
      hint: 'Use [w.upper() for w in words if len(w) > 3].',
      solutionCode: `words = ["cat", "elephant", "dog", "hippopotamus"]\nlong_upper = [w.upper() for w in words if len(w) > 3]\nprint(long_upper)  # ['ELEPHANT', 'HIPPOPOTAMUS']`
    }
  },
  {
    id: 'tut-dicts',
    category: '4. Data Structures',
    title: 'Dictionaries & Key-Value Stores',
    level: 'Beginner',
    summary: 'Dictionaries are hash maps that store key-value pairs with O(1) average lookup time. Crucial for JSON data and AI metadata.',
    notes: [
      'Keys must be immutable (strings, numbers, tuples).',
      'Always prefer dict.get(key, default) to avoid KeyError crashes.',
      'Iterate keys: for k in d: ... Iterate key-values: for k, v in d.items(): ...',
      'Dictionary comprehension: {k: v for k, v in ...}'
    ],
    codeExample: `# Dictionaries in Python
model_config = {
    "model_name": "gemini-3.1-flash",
    "temperature": 0.7,
    "max_tokens": 2048,
    "tools_enabled": True
}

# Accessing safely
print("Model:", model_config["model_name"])
print("Timeout:", model_config.get("timeout_seconds", 30))  # Default 30s

# Modifying and iterating
model_config["temperature"] = 0.4
print("\nConfiguration settings:")
for key, value in model_config.items():
    print(f"  {key}: {value}")`,
    commonMistake: 'Assuming dictionaries are indexed by position like d[0]. Dictionaries are indexed by their exact keys!',
    exercise: {
      question: 'Count the frequency of each character in the string "machinelearning" using a dictionary.',
      hint: 'Loop over chars: counts[c] = counts.get(c, 0) + 1.',
      solutionCode: `text = "machinelearning"\ncounts = {}\nfor ch in text:\n    counts[ch] = counts.get(ch, 0) + 1\nprint(counts)`
    }
  },
  {
    id: 'tut-functions',
    category: '5. Modular Code',
    title: 'Functions, Default Args & *args/**kwargs',
    level: 'Intermediate',
    summary: 'Functions encapsulate reusable logic. Python supports positional arguments, default values, arbitrary arguments (*args), and keyword arguments (**kwargs).',
    notes: [
      'Functions are declared with def name(parameters):.',
      'Use return to send values back to the caller; default return is None.',
      '*args collects extra positional arguments into a tuple.',
      '**kwargs collects extra keyword arguments into a dictionary.',
      'Use type hints like def add(a: int, b: int) -> int: for clarity.'
    ],
    codeExample: `# Functions & Variable Arguments
def normalize_vector(vector: list[float], precision: int = 4) -> list[float]:
    """Normalizes vector so elements sum to 1.0 (Softmax style)."""
    total = sum(vector)
    if total == 0:
        return vector
    return [round(x / total, precision) for x in vector]

# Function with *args and **kwargs
def log_ai_inference(model: str, *inputs, **metadata):
    print(f"[AI Log] Model: {model}")
    print(f"  Inputs count: {len(inputs)}")
    for k, v in metadata.items():
        print(f"  {k}: {v}")

print("Normalized:", normalize_vector([10.0, 20.0, 70.0]))
log_ai_inference("Gemini 3.1 Flash", "prompt1", "prompt2", latency_ms=180, cost=0.0002)`,
    commonMistake: 'Never use mutable default arguments like def append_to(item, target_list=[]):. Python reuses the same list across calls!',
    exercise: {
      question: 'Write a function is_prime(n: int) -> bool that returns True if a number is prime and False otherwise.',
      hint: 'If n < 2, return False. Check divisors up to int(n**0.5) + 1.',
      solutionCode: `def is_prime(n: int) -> bool:\n    if n < 2:\n        return False\n    for d in range(2, int(n ** 0.5) + 1):\n        if n % d == 0:\n            return False\n    return True\n\nprint("Is 17 prime?", is_prime(17))  # True\nprint("Is 20 prime?", is_prime(20))  # False`
    }
  },
  {
    id: 'tut-exceptions',
    category: '6. Robustness',
    title: 'Exception Handling (try, except, finally)',
    level: 'Intermediate',
    summary: 'Defensive programming prevents crashes by gracefully capturing errors and cleaning up resources.',
    notes: [
      'try contains code that might raise an exception.',
      'except SpecificError as e: catches the error without terminating the program.',
      'else runs ONLY if no error occurred in try.',
      'finally runs unconditionally, ideal for closing files and network connections.'
    ],
    codeExample: `# Robust Exception Handling
def safe_parse_int(value_str: str) -> int | None:
    try:
        result = int(value_str)
        print(f"Successfully parsed: {result}")
        return result
    except ValueError as err:
        print(f"Parse error: '{value_str}' is not a valid integer. ({err})")
        return None
    finally:
        print("--- Completed parse attempt ---")

print("Valid test:", safe_parse_int("42"))
print("Invalid test:", safe_parse_int("not_a_number"))`,
    commonMistake: 'Using a bare "except:" clause without specifying error types. This can hide keyboard interrupts and syntax bugs!',
    exercise: {
      question: 'Write a function safe_divide(a, b) that returns a / b or a warning message when division by zero occurs.',
      hint: 'Catch ZeroDivisionError.',
      solutionCode: `def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return "Error: Cannot divide by zero!"\n\nprint(safe_divide(10, 2))\nprint(safe_divide(5, 0))`
    }
  },
  {
    id: 'tut-oop',
    category: '7. OOP & Data Classes',
    title: 'Object-Oriented Programming & Classes',
    level: 'Intermediate',
    summary: 'OOP organizes code into reusable blueprints (classes) containing state (attributes) and behavior (methods).',
    notes: [
      '__init__(self, ...) is the constructor method called when creating an instance.',
      'self refers to the current object instance.',
      'Encapsulation groups variables and logic together.',
      'Inheritance allows subclassing to extend and customize behavior.'
    ],
    codeExample: `# Object-Oriented Programming
class AITextClassifier:
    def __init__(self, model_name: str, threshold: float = 0.5):
        self.model_name = model_name
        self.threshold = threshold
        self.classes = ["Negative", "Neutral", "Positive"]
        self.predictions_count = 0

    def predict(self, text: str) -> dict:
        self.predictions_count += 1
        # Simple simulated sentiment scoring
        score = 0.8 if "great" in text.lower() or "good" in text.lower() else 0.3
        label = "Positive" if score >= self.threshold else "Negative"
        return {"text": text, "label": label, "confidence": score}

classifier = AITextClassifier("SentimentMini-v1")
res = classifier.predict("This Python tutor is really great!")
print("Result:", res)
print(f"Total inference calls made: {classifier.predictions_count}")`,
    commonMistake: 'Forgetting self as the first parameter of instance methods.',
    exercise: {
      question: 'Create a BankAccount class with balance, deposit(amount), and withdraw(amount) methods.',
      hint: 'Ensure withdraw checks if amount <= self.balance.',
      solutionCode: `class BankAccount:\n    def __init__(self, initial_balance=0.0):\n        self.balance = initial_balance\n    def deposit(self, amt):\n        self.balance += amt\n    def withdraw(self, amt):\n        if amt <= self.balance:\n            self.balance -= amt\n            return True\n        return False\n\nacct = BankAccount(100)\nacct.deposit(50)\nacct.withdraw(30)\nprint("Balance:", acct.balance)  # 120.0`
    }
  },
  {
    id: 'tut-ai-numpy',
    category: '8. AI Engineering',
    title: 'NumPy Vectorization & Dot Products',
    level: 'AI Engineering',
    summary: 'NumPy provides high-performance multi-dimensional arrays and vectorized linear algebra operations for Machine Learning.',
    notes: [
      'Vectorization replaces slow Python for-loops with optimized C/BLAS array operations.',
      'Dot products compute similarity and matrix multiplications in neural networks.',
      'Array broadcasting automatically expands dimensions for arithmetic operations.'
    ],
    codeExample: `# Vectorized Math & Cosine Similarity
import math

def dot_product(v1, v2):
    return sum(a * b for a, b in zip(v1, v2))

def vector_magnitude(v):
    return math.sqrt(sum(a * a for a in v))

def cosine_similarity(v1, v2):
    dot = dot_product(v1, v2)
    mag1 = vector_magnitude(v1)
    mag2 = vector_magnitude(v2)
    if mag1 == 0 or mag2 == 0:
        return 0.0
    return round(dot / (mag1 * mag2), 4)

query_embedding = [0.82, -0.15, 0.55]
doc_a_embedding = [0.80, -0.12, 0.58]  # Very relevant
doc_b_embedding = [-0.70, 0.40, -0.10] # Irrelevant

print("Cosine Similarity (Query <-> Doc A):", cosine_similarity(query_embedding, doc_a_embedding))
print("Cosine Similarity (Query <-> Doc B):", cosine_similarity(query_embedding, doc_b_embedding))`,
    commonMistake: 'Looping over array elements manually instead of using vectorized operations.',
    exercise: {
      question: 'Write a function compute_l2_norm(vector) calculating Euclidean distance from origin.',
      hint: 'Square each element, sum them, and take the square root.',
      solutionCode: `import math\ndef compute_l2_norm(vec):\n    return math.sqrt(sum(x ** 2 for x in vec))\n\nprint("L2 norm of [3, 4]:", compute_l2_norm([3, 4]))  # 5.0`
    }
  }
];

interface PythonTutorialLibraryProps {
  onLoadCodeIntoPlayground: (code: string) => void;
  onAskTutorAboutTopic: (prompt: string) => void;
}

export const PythonTutorialLibrary: React.FC<PythonTutorialLibraryProps> = ({
  onLoadCodeIntoPlayground,
  onAskTutorAboutTopic
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(TUTORIAL_LESSONS[0].id);
  const [showSolutionId, setShowSolutionId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const currentLesson = TUTORIAL_LESSONS.find((l) => l.id === selectedLessonId) || TUTORIAL_LESSONS[0];

  const filteredLessons = searchFilter.trim()
    ? TUTORIAL_LESSONS.filter(
        (l) =>
          l.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
          l.summary.toLowerCase().includes(searchFilter.toLowerCase()) ||
          l.category.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : TUTORIAL_LESSONS;

  return (
    <div className="flex flex-col lg:flex-row gap-5 p-4 md:p-6 max-w-7xl mx-auto w-full">
      {/* Left List of Chapters */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-3">
        <div className="p-4 rounded-2xl bg-[#131b2e] border border-[#222a3d] space-y-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#4edea3]">menu_book</span>
            <h3 className="font-display font-bold text-sm text-white">Python Tutorials &amp; Notes</h3>
          </div>
          <p className="text-xs text-[#9aa99f]">
            Structured step-by-step notes with runnable examples and practice exercises.
          </p>

          <div className="relative pt-1">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search chapters &amp; syntax..."
              className="w-full bg-[#060e20] border border-[#222a3d] rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-[#9aa99f] focus:outline-none focus:border-[#4edea3]"
            />
          </div>
        </div>

        {/* Chapters Navigation */}
        <div className="flex flex-col gap-1 max-h-[500px] overflow-y-auto pr-1">
          {filteredLessons.map((lesson) => {
            const isSelected = lesson.id === selectedLessonId;
            return (
              <button
                key={lesson.id}
                onClick={() => {
                  setSelectedLessonId(lesson.id);
                  setShowSolutionId(null);
                }}
                className={`flex flex-col text-left p-3 rounded-xl transition-all border ${
                  isSelected
                    ? 'bg-[#171f33] border-[#4edea3] text-white shadow-md'
                    : 'bg-[#131b2e]/70 border-[#222a3d] text-[#dae2fd] hover:bg-[#171f33]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#4cd7f6]">{lesson.category}</span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                      lesson.level === 'Beginner'
                        ? 'bg-[#10b981]/20 text-[#4edea3]'
                        : lesson.level === 'Intermediate'
                        ? 'bg-[#3b82f6]/20 text-[#60a5fa]'
                        : 'bg-[#8b5cf6]/20 text-[#c084fc]'
                    }`}
                  >
                    {lesson.level}
                  </span>
                </div>
                <span className="text-xs font-semibold mt-1 truncate">{lesson.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Lesson Detail Area */}
      <div className="flex-1 flex flex-col gap-5 min-w-0">
        <div className="rounded-2xl bg-[#171f33] border border-[#2d3449] p-5 md:p-6 shadow-xl space-y-5">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#222a3d] pb-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#4cd7f6]">{currentLesson.category}</span>
              <h2 className="font-display text-lg md:text-xl font-bold text-white">
                {currentLesson.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onLoadCodeIntoPlayground(currentLesson.codeExample)}
                className="flex items-center gap-1.5 rounded-xl bg-[#4edea3] px-3.5 py-2 font-mono text-xs font-bold text-[#003824] hover:bg-[#3ecb90] active:scale-95 transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                <span>Run in Playground</span>
              </button>

              <button
                onClick={() =>
                  onAskTutorAboutTopic(
                    `Can you explain '${currentLesson.title}' with more examples, practice challenges, and AI engineering use-cases?`
                  )
                }
                className="flex items-center gap-1.5 rounded-xl bg-[#222a3d] px-3.5 py-2 font-mono text-xs font-semibold text-white hover:bg-[#2d3449] transition-all border border-[#343e57]"
              >
                <span className="material-symbols-outlined text-[16px] text-[#4edea3]">smart_toy</span>
                <span>Ask AI Tutor</span>
              </button>
            </div>
          </div>

          {/* Overview */}
          <p className="text-sm text-[#dae2fd] leading-relaxed">
            {currentLesson.summary}
          </p>

          {/* Tutorial Notes */}
          <div className="rounded-xl bg-[#131b2e] border border-[#222a3d] p-4 space-y-2">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#4edea3] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">notes</span>
              <span>Key Tutorial Notes &amp; Rules</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-[#9aa99f]">
              {currentLesson.notes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#4edea3] font-bold">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Code Example Block */}
          <div className="overflow-hidden rounded-xl bg-[#060e20] border border-[#222a3d]">
            <div className="flex items-center justify-between bg-[#222a3d] px-4 py-2 border-b border-[#2d3449]">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]"></span>
                <span className="pl-2 font-mono text-xs text-white">example.py</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentLesson.codeExample);
                  alert('Code copied to clipboard!');
                }}
                className="flex items-center gap-1 text-xs font-mono text-[#9aa99f] hover:text-white"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                <span>Copy</span>
              </button>
            </div>

            <pre className="overflow-x-auto p-4 font-mono text-xs md:text-sm text-[#dae2fd] leading-relaxed">
              <code>{currentLesson.codeExample}</code>
            </pre>
          </div>

          {/* Common Mistake Alert */}
          <div className="rounded-xl bg-[#93000a]/15 border border-[#ffb4ab]/30 p-3.5 flex items-start gap-2.5 text-xs text-[#ffb4ab]">
            <span className="material-symbols-outlined text-[18px] shrink-0">warning</span>
            <div>
              <strong className="font-mono">Common Beginner Trap: </strong>
              <span>{currentLesson.commonMistake}</span>
            </div>
          </div>

          {/* Interactive Practice Challenge */}
          <div className="rounded-xl bg-[#131b2e] border border-[#222a3d] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#4cd7f6] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">task_alt</span>
                <span>Hands-On Practice Challenge</span>
              </h4>
              <span className="font-mono text-xs text-[#4edea3] font-bold">+50 XP</span>
            </div>

            <p className="text-xs text-white leading-relaxed">
              {currentLesson.exercise.question}
            </p>

            <div className="text-[11px] text-[#9aa99f] bg-[#060e20] p-2.5 rounded-lg border border-[#222a3d]">
              💡 <strong>Hint:</strong> {currentLesson.exercise.hint}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() =>
                  setShowSolutionId((prev) => (prev === currentLesson.id ? null : currentLesson.id))
                }
                className="text-xs font-mono text-[#c0c1ff] hover:underline flex items-center gap-1"
              >
                <span>{showSolutionId === currentLesson.id ? 'Hide Solution' : 'Reveal Solution'}</span>
                <span className="material-symbols-outlined text-[15px]">
                  {showSolutionId === currentLesson.id ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              <button
                onClick={() => onLoadCodeIntoPlayground(currentLesson.exercise.solutionCode)}
                className="text-xs font-mono text-[#4edea3] hover:underline flex items-center gap-1"
              >
                <span>Try Solution in Playground</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>

            {showSolutionId === currentLesson.id && (
              <div className="rounded-xl bg-[#060e20] p-3 font-mono text-xs text-[#dae2fd] border border-[#222a3d] overflow-x-auto">
                <pre>
                  <code>{currentLesson.exercise.solutionCode}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
