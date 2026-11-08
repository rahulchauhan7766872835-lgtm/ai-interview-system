import { Flashcard } from '../types';

export const FLASHCARD_DRILLS: Flashcard[] = [
  {
    id: 'fc-1',
    track: 'frontend',
    topic: 'React',
    front: 'What is the main difference between useMemo and useCallback in React?',
    back: 'useMemo caches the result of a calculation (the returned value), while useCallback caches a function definition itself between renders.',
    keyKeywords: ['memoize value', 'cache function definition', 'referential equality', 'unnecessary re-renders']
  },
  {
    id: 'fc-2',
    track: 'frontend',
    topic: 'Web Performance',
    front: 'What does INP (Interaction to Next Paint) measure and what is a good target?',
    back: 'INP measures page responsiveness by tracking the latency of all user interactions (clicks, taps, key presses) throughout the entire session. A good INP score is under 200 milliseconds.',
    keyKeywords: ['responsiveness', 'all interactions', '<200ms', 'Core Web Vital']
  },
  {
    id: 'fc-3',
    track: 'backend',
    topic: 'Databases',
    front: 'What are the 4 ACID properties in relational database transactions?',
    back: 'Atomicity (all or nothing), Consistency (preserves schema constraints), Isolation (concurrent transactions don\'t interfere), Durability (committed changes persist despite crash).',
    keyKeywords: ['Atomicity', 'Consistency', 'Isolation', 'Durability', 'transactions']
  },
  {
    id: 'fc-4',
    track: 'backend',
    topic: 'Caching',
    front: 'What is the difference between Cache-Aside and Write-Through caching patterns?',
    back: 'Cache-Aside: The application checks the cache first; on a miss, it loads from DB and writes to cache. Write-Through: The app writes to cache and cache synchronously writes to DB before returning.',
    keyKeywords: ['cache miss', 'synchronous write', 'lazy loading', 'read heavy']
  },
  {
    id: 'fc-5',
    track: 'system-design',
    topic: 'Distributed Systems',
    front: 'What does the CAP Theorem state?',
    back: 'A distributed data store can guarantee at most two of the three: Consistency (every read gets latest write), Availability (every non-failing node returns a response), and Partition Tolerance (system continues operating despite network message drops). In practice, since network partitions are inevitable (P), you must choose between CP and AP.',
    keyKeywords: ['Consistency', 'Availability', 'Partition Tolerance', 'network split', 'tradeoff']
  },
  {
    id: 'fc-6',
    track: 'system-design',
    topic: 'Load Balancing',
    front: 'What is Consistent Hashing and why is it used?',
    back: 'Consistent Hashing maps both keys and servers to a circular hash ring. When a server node is added or removed, only k/N keys need to be remapped on average, preventing massive cache thrashing.',
    keyKeywords: ['hash ring', 'minimal remapping', 'distributed cache', 'virtual nodes']
  },
  {
    id: 'fc-7',
    track: 'ai-ml',
    topic: 'LLMs & RAG',
    front: 'What is the difference between Dense Retrieval and Sparse Retrieval in RAG?',
    back: 'Dense retrieval uses continuous semantic vector embeddings (e.g. cosine similarity) to capture conceptual meaning. Sparse retrieval (e.g. BM25) uses term frequencies to match exact words, acronyms, and codes. Combining both is Hybrid Search.',
    keyKeywords: ['embeddings', 'BM25', 'semantic vs lexical', 'hybrid search']
  },
  {
    id: 'fc-8',
    track: 'behavioral',
    topic: 'STAR Method',
    front: 'What does the STAR framework stand for and how should time be allocated?',
    back: 'S: Situation (15-20%), T: Task (10%), A: Action (50-60% - your specific contributions), R: Result (15-20% - quantifiable metrics and impact).',
    keyKeywords: ['Situation', 'Task', 'Action', 'Result', 'quantifiable metrics']
  }
];
