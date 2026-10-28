import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { User, Conversation, Message, Bookmark, QuizAttempt, UserPreference, LearningTopic } from '../types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbDir = path.resolve(__dirname, '../../data');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'pyai.db');
export const db = new Database(dbPath);

// Enable foreign keys and WAL mode for high performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT,
      xp INTEGER DEFAULT 1420,
      level TEXT DEFAULT 'Level 2 Apprentice',
      streak_days INTEGER DEFAULT 6,
      last_active_date TEXT,
      execution_quota_used INTEGER DEFAULT 64,
      execution_quota_max INTEGER DEFAULT 100,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      topic_tag TEXT NOT NULL,
      is_pinned INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
    CREATE INDEX IF NOT EXISTS idx_conversations_created ON conversations(created_at);

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      role TEXT CHECK(role IN ('user', 'assistant')) NOT NULL,
      content TEXT NOT NULL,
      metadata TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);

    CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      conversation_id TEXT,
      message_id TEXT,
      title TEXT NOT NULL,
      snippet TEXT,
      note TEXT,
      topic_tag TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);

    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      quiz_id TEXT,
      question TEXT NOT NULL,
      selected_option TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      xp_earned INTEGER DEFAULT 0,
      explanation TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_quizzes_user ON quiz_attempts(user_id);

    CREATE TABLE IF NOT EXISTS learning_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      category TEXT NOT NULL,
      topic_id TEXT NOT NULL,
      topic_title TEXT NOT NULL,
      mastery_percent INTEGER DEFAULT 0,
      is_completed INTEGER DEFAULT 0,
      completed_at TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, topic_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_preferences (
      user_id TEXT PRIMARY KEY,
      tutor_mode TEXT DEFAULT 'tutor',
      language_pref TEXT DEFAULT 'english',
      theme TEXT DEFAULT 'dark',
      font_size TEXT DEFAULT 'md',
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  seedInitialData();
}

// Curriculum repository
export const CURRICULUM_TOPICS: LearningTopic[] = [
  // 1. Python Fundamentals
  {
    id: 'py-comprehensions',
    category: 'Python Fundamentals',
    title: 'Mastering List Comprehensions & Generator Expressions',
    difficulty: 'Beginner-Intermediate',
    description: 'Understand bytecode optimization, declarative syntax, and lazy evaluation with O(1) memory generator expressions.',
    estimatedTime: '20 mins',
    masteryPercent: 68,
    isCompleted: false,
    starterPrompt: 'Can you explain why using a list comprehension is better than a regular for loop with .append() ? And when should I switch to a generator expression instead?',
    defaultCode: `import sys\n\n# 1. Evaluate memory allocation for 1,000,000 elements\nlist_comp = [num ** 2 for num in range(1000000)]\ngen_exp = (num ** 2 for num in range(1000000))\n\n# 2. Inspect raw byte size in CPython heap\nlist_size = sys.getsizeof(list_comp)\ngen_size = sys.getsizeof(gen_exp)\n\nprint(list_comp[:5])\nprint(f"Size of List: {list_size:,} bytes")\nprint(f"Size of Generator: {gen_size} bytes (99.9% saved!)")`,
    keyConcepts: ['List Comprehensions', 'Generators & Yield', 'sys.getsizeof()', 'Bytecode LIST_APPEND', 'Lazy Evaluation']
  },
  {
    id: 'py-exceptions',
    category: 'Python Fundamentals',
    title: 'Defensive Programming & Exception Handling',
    difficulty: 'Beginner',
    description: 'Structure robust error handling with try/except/else/finally blocks and custom Python exceptions.',
    estimatedTime: '15 mins',
    masteryPercent: 100,
    isCompleted: true,
    starterPrompt: 'How do I handle ZeroDivisionError and write custom exception classes in Python?',
    defaultCode: `def safe_divide(numerator: float, denominator: float) -> float:\n    try:\n        return numerator / denominator\n    except ZeroDivisionError:\n        print("Warning: Attempted division by zero! Returning NaN.")\n        return float('nan')\n\nprint("Result:", safe_divide(10, 2))\nprint("Result:", safe_divide(10, 0))`,
    keyConcepts: ['try/except/finally', 'ZeroDivisionError', 'Custom Exceptions', 'Tracebacks']
  },
  {
    id: 'py-oop',
    category: 'Python Fundamentals',
    title: 'Object-Oriented Programming & Dataclasses',
    difficulty: 'Intermediate',
    description: 'Design modular Python classes, encapsulation, inheritance, and modern @dataclass syntax for AI engineering.',
    estimatedTime: '25 mins',
    masteryPercent: 40,
    isCompleted: false,
    starterPrompt: 'Explain how dataclasses work in Python 3.12 and how they simplify writing data containers.',
    defaultCode: `from dataclasses import dataclass\n\n@dataclass\nclass EmbeddingNode:\n    text: string\n    vector: list[float]\n    token_count: int\n\nnode = EmbeddingNode("Attention is all you need", [0.12, -0.45, 0.88], 6)\nprint(node)`,
    keyConcepts: ['@dataclass', '__repr__ & __eq__', 'Inheritance', 'Type Hinting']
  },

  // 2. ML & Neural Nets
  {
    id: 'ml-backprop',
    category: 'ML & Neural Nets',
    title: 'NumPy Vectorization & Backpropagation',
    difficulty: 'Intermediate',
    description: 'Implement forward propagation, cross-entropy loss, and gradient calculation purely using matrix dot products.',
    estimatedTime: '35 mins',
    masteryPercent: 55,
    isCompleted: false,
    starterPrompt: 'Walk me step-by-step through calculating the backward pass gradients of a 2-layer MLP in NumPy.',
    defaultCode: `import math\n\ndef sigmoid(x):\n    return 1.0 / (1.0 + math.exp(-x))\n\n# Forward pass simulation\nw = 0.5\nx = 2.0\nb = -0.2\nz = w * x + b\na = sigmoid(z)\nprint(f"Activation: {a:.4f}")`,
    keyConcepts: ['Matrix Multiplication', 'Activation Functions', 'Loss Gradients', 'Chain Rule']
  },
  {
    id: 'ml-feature-eng',
    category: 'ML & Neural Nets',
    title: 'Data Preparation & Feature Normalization',
    difficulty: 'Beginner-Intermediate',
    description: 'Clean missing data, apply MinMax and Standard scaling, and avoid data leakage in ML training pipelines.',
    estimatedTime: '20 mins',
    masteryPercent: 30,
    isCompleted: false,
    starterPrompt: 'Why is standard scaling important before passing tabular data to gradient-based models?',
    defaultCode: `data = [12.0, 15.0, 24.0, 30.0, 19.0]\nmean = sum(data) / len(data)\nvariance = sum((x - mean) ** 2 for x in data) / len(data)\nstd = variance ** 0.5\n\nnormalized = [(x - mean) / std for x in data]\nprint("Z-score scaled:", [round(x, 2) for x in normalized])`,
    keyConcepts: ['StandardScaler', 'Outlier Detection', 'Data Leakage', 'Train/Val Split']
  },

  // 3. RAG & LLMs
  {
    id: 'rag-vector-db',
    category: 'RAG & LLMs',
    title: 'Building a Production RAG Pipeline',
    difficulty: 'Intermediate',
    description: 'Chunk documents, generate vector embeddings, compute cosine similarity, and ground LLM answers with retrieved context.',
    estimatedTime: '30 mins',
    masteryPercent: 75,
    isCompleted: false,
    starterPrompt: 'How do semantic search and cosine similarity work in a Retrieval-Augmented Generation (RAG) system?',
    defaultCode: `def cosine_similarity(v1, v2):\n    dot = sum(a * b for a, b in zip(v1, v2))\n    norm1 = sum(a * a for a in v1) ** 0.5\n    norm2 = sum(b * b for b in v2) ** 0.5\n    return dot / (norm1 * norm2)\n\nquery_emb = [0.2, 0.8, -0.1]\ndoc1_emb = [0.25, 0.75, -0.05]\ndoc2_emb = [-0.6, 0.1, 0.9]\n\nprint("Doc 1 similarity:", round(cosine_similarity(query_emb, doc1_emb), 4))\nprint("Doc 2 similarity:", round(cosine_similarity(query_emb, doc2_emb), 4))`,
    keyConcepts: ['Cosine Similarity', 'Vector Embeddings', 'Chunking Strategies', 'Grounding & Hallucination Defense']
  },

  // 4. Agentic AI
  {
    id: 'agentic-tool-calling',
    category: 'Agentic AI',
    title: 'Autonomous Tool Calling & ReAct Loops',
    difficulty: 'Advanced',
    description: 'Implement reasoning, action planning, tool execution schemas, and multi-turn reflection in AI agents.',
    estimatedTime: '40 mins',
    masteryPercent: 20,
    isCompleted: false,
    starterPrompt: 'How do LLM agents use function declarations and JSON schemas to interact with external APIs?',
    defaultCode: `tools = [\n    {\n        "name": "search_database",\n        "description": "Look up student records",\n        "parameters": {"type": "object", "properties": {"student_id": {"type": "string"}}}\n    }\n]\nprint("Agent initialized with tools:", [t["name"] for t in tools])`,
    keyConcepts: ['ReAct Pattern', 'Tool Declarations', 'State Machines', 'Safety Boundaries']
  }
];

function seedInitialData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count > 0) return;

  const demoUserId = 'usr_default_apprentice';
  const now = new Date().toISOString();

  // 1. Create Default User
  db.prepare(`
    INSERT INTO users (id, email, name, avatar, xp, level, streak_days, last_active_date, execution_quota_used, execution_quota_max)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    demoUserId,
    'sarizvi71@gmail.com',
    'Syed Ali (Apprentice)',
    'https://lh3.googleusercontent.com/aida/AEtjO1W9KLOVukg_lagERgOCXs6jaQp6wwJQ6Vo4GPy8bCzv3F-ExguOnFvrXN4j1oIGoAN9CUMFJkYDABP6KQpsGgam264W8phI-URQEr_KociyQONjq9QMvYcS45GzU_1QKtsPdESeVkqbIN7ZgwrTOockmW9-qDUV2UPgRTGoiE-CW2FrbCZHXgY7D1pxj6gT0fnyDkh1IQej6D8I_y-Dof7cAWc0h4khM9QleX4xVj-7DGg99Ooxm3MQhSs',
    1420,
    'Level 2 Apprentice',
    6,
    now,
    64,
    100
  );

  // 2. Default Preferences
  db.prepare(`
    INSERT INTO user_preferences (user_id, tutor_mode, language_pref, theme, font_size)
    VALUES (?, ?, ?, ?, ?)
  `).run(demoUserId, 'tutor', 'english', 'dark', 'md');

  // 3. Four Initial Mockup Sessions
  const conv1Id = 'conv_list_comprehensions';
  const conv2Id = 'conv_rag_pipeline';
  const conv3Id = 'conv_backprop_numpy';
  const conv4Id = 'conv_debugging_zero';

  const insertConv = db.prepare(`
    INSERT INTO conversations (id, user_id, title, topic_tag, is_pinned, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertConv.run(conv1Id, demoUserId, 'List Comprehensions vs Gen', 'Python Core', 1, now, now);
  insertConv.run(conv2Id, demoUserId, 'Building RAG Pipeline', 'Vector DB', 0, now, now);
  insertConv.run(conv3Id, demoUserId, 'Backpropagation NumPy', 'Neural Nets', 0, now, now);
  insertConv.run(conv4Id, demoUserId, 'Debugging ZeroDivision', 'Exceptions', 0, now, now);

  // 4. Populate Session 1 (Exact match with Image_1_671c388a.png and Image_2_1c723973.html)
  const insertMsg = db.prepare(`
    INSERT INTO messages (id, conversation_id, role, content, metadata, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // User question
  insertMsg.run(
    'msg_1_user',
    conv1Id,
    'user',
    'Can you explain why using a list comprehension is better than a regular for loop with .append() ? And when should I switch to a generator expression instead?',
    JSON.stringify({}),
    new Date(Date.now() - 1000 * 60 * 12).toISOString()
  );

  // Tutor response
  const tutorMetadata = {
    tokenCount: 312,
    model: 'Gemini Pro 2.5',
    topicTag: 'Core Python',
    difficulty: 'Beginner-Intermediate',
    runtimeCost: 'O(N) vs O(1) Memory',
    environmentStatus: 'Lab Environment Ready (Python 3.12.3)',
    pedagogicalCards: [
      {
        title: 'Bytecode Speed',
        description: "Avoids overhead of repeated LIST_APPEND function calls and attribute lookups in Python's VM.",
        icon: 'speed',
        variant: 'primary'
      },
      {
        title: 'High Readability',
        description: 'Declares what the list contains declaratively in one readable pass rather than imperative state mutations.',
        icon: 'visibility',
        variant: 'tertiary'
      },
      {
        title: 'Generator Shift',
        description: 'Switch to generator expressions (...) when data streams exceed RAM or when iterating only once.',
        icon: 'memory',
        variant: 'secondary'
      }
    ],
    codeSnippet: {
      filename: 'comprehensions_comparison.py',
      language: 'python',
      code: `# Example: Squaring even numbers\n# Method 1: Traditional Loop\neven_squares = []\nfor num in range(10):\n    if num % 2 == 0:\n        even_squares.append(num ** 2)\n\n# Method 2: Pythonic List Comprehension (Faster, cleaner)\neven_squares = [num ** 2 for num in range(10) if num % 2 == 0]\nprint(even_squares)  # Output: [0, 4, 16, 36, 64]`
    },
    lineBreakdown: [
      {
        code: 'num ** 2',
        explanation: 'Expression: What gets evaluated and added to the resulting collection.'
      },
      {
        code: 'for num in range(10)',
        explanation: 'Iteration: The sequence or iterable generator driving the loop.'
      },
      {
        code: 'if num % 2 == 0',
        explanation: 'Predicate Filter: Optional conditional filter executed before expression evaluation.'
      }
    ],
    memoryAnalysis: {
      summary: 'Lists instantiate and hold all values in RAM at once (O(N) memory footprint). A Generator Expression uses lazy iteration via the iterator protocol (O(1) space).',
      leftLabel: 'List [x for x in 1M]',
      leftSize: '~9.0 MB',
      rightLabel: 'Generator (x for x in 1M)',
      rightSize: '104 Bytes',
      percentageSaved: '99.9%'
    },
    quiz: {
      id: 'quiz_comp_1',
      question: 'What will sum(x for x in range(1_000_000)) do compared to sum([x for x in range(1_000_000)])?',
      options: [
        {
          id: 'A',
          label: 'A',
          text: 'It will run 10x slower because Python cannot optimize parentheses',
          isCorrect: false
        },
        {
          id: 'B',
          label: 'B',
          text: 'It uses O(1) memory by yielding items lazily without creating a massive list in RAM',
          isCorrect: true
        },
        {
          id: 'C',
          label: 'C',
          text: 'It causes a TypeError in Python 3 because generators cannot be passed to sum()',
          isCorrect: false
        }
      ],
      explanation: 'Correct! Excellent intuition for AI data pipelines — never buffer what you can stream!',
      xpAward: 50
    },
    lessonTakeaways: [
      'Use comprehensions for concise, fast list transformation.',
      'Always switch to generator expressions for large data streams to preserve memory.',
      'Keep comprehensions under 2 lines — readability always beats cleverness.'
    ],
    aiPipelineNote: {
      title: 'PyTorch DataLoader',
      tag: 'AI PIPELINE NOTE',
      content: 'In LLM & Vision workflows, passing generator iterables into dataset batch loaders prevents GPU driver CUDA out-of-memory crashes before tensor collation.'
    }
  };

  insertMsg.run(
    'msg_1_assistant',
    conv1Id,
    'assistant',
    `Great question! While both yield the identical result, Python handles them fundamentally differently under the hood across three major axes: readability, C-level bytecode speed, and allocation ergonomics.`,
    JSON.stringify(tutorMetadata),
    new Date(Date.now() - 1000 * 60 * 10).toISOString()
  );

  // Populate other mock sessions
  insertMsg.run(
    'msg_2_user',
    conv2Id,
    'user',
    'How do I calculate cosine similarity for document chunks in a RAG pipeline?',
    JSON.stringify({}),
    new Date(Date.now() - 1000 * 60 * 60).toISOString()
  );
  insertMsg.run(
    'msg_2_assistant',
    conv2Id,
    'assistant',
    'In RAG pipelines, cosine similarity measures the angle between query embedding vector A and document vector B, yielding a score between -1 and 1 regardless of vector magnitudes.',
    JSON.stringify({
      tokenCount: 245,
      model: 'Gemini Pro 2.5',
      topicTag: 'Vector DB',
      difficulty: 'Intermediate',
      codeSnippet: {
        filename: 'rag_similarity.py',
        language: 'python',
        code: `import numpy as np\n\ndef cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:\n    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))\n\nquery = np.array([0.1, 0.8, -0.3])\ndoc = np.array([0.12, 0.77, -0.25])\nprint("Relevance Score:", round(cosine_similarity(query, doc), 4))`
      }
    }),
    new Date(Date.now() - 1000 * 60 * 55).toISOString()
  );

  // 5. Initialize Curriculum Progress records
  const insertProg = db.prepare(`
    INSERT INTO learning_progress (id, user_id, category, topic_id, topic_title, mastery_percent, is_completed, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const topic of CURRICULUM_TOPICS) {
    insertProg.run(
      `prog_${demoUserId}_${topic.id}`,
      demoUserId,
      topic.category,
      topic.id,
      topic.title,
      topic.masteryPercent,
      topic.isCompleted ? 1 : 0,
      topic.isCompleted ? now : null
    );
  }

  // 6. Initial Bookmark
  db.prepare(`
    INSERT INTO bookmarks (id, user_id, conversation_id, message_id, title, snippet, note, topic_tag, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'bm_1',
    demoUserId,
    conv1Id,
    'msg_1_assistant',
    'Generator Expression vs List Memory Formula',
    'gen_exp = (num ** 2 for num in range(1000000))\nsys.getsizeof(gen_exp) # 104 Bytes',
    'Crucial for large AI datasets: always pass generators to batch streaming loaders.',
    'Python Core',
    now
  );

  // 7. Initial Quiz attempt
  db.prepare(`
    INSERT INTO quiz_attempts (id, user_id, quiz_id, question, selected_option, is_correct, xp_earned, explanation, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'qa_1',
    demoUserId,
    'quiz_comp_1',
    'What will sum(x for x in range(1_000_000)) do compared to sum([x for x in range(1_000_000)])?',
    'B',
    1,
    50,
    'Used O(1) memory by yielding items lazily without buffering in RAM.',
    now
  );
}
