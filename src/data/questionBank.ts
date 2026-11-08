import { Question } from '../types';

export const QUESTION_BANK: Question[] = [
  // ==========================================
  // FRONTEND QUESTIONS
  // ==========================================
  {
    id: 'fe-01',
    track: 'frontend',
    level: 'mid',
    category: 'React & Virtual DOM',
    title: 'Explain React Reconciliation & Fiber Architecture',
    prompt: 'How does React determine when and how to re-render components? Explain how the Virtual DOM diffing algorithm works, the role of Fiber architecture in scheduling, and why the "key" prop is crucial in lists.',
    rubric: {
      keyPoints: [
        'Virtual DOM as an in-memory representation of real DOM',
        'Diffing heuristic: O(n) complexity via element type comparison and key tracking',
        'Fiber architecture: Incremental rendering, work interruption, priority-based scheduling via requestIdleCallback/MessageChannel',
        'Key prop enables React to match children across renders rather than unmounting and recreating DOM nodes',
        'Pitfalls of using index as key in dynamic lists (state corruption, unnecessary re-renders)'
      ],
      commonPitfalls: [
        'Claiming Virtual DOM is inherently faster than direct DOM manipulation without context',
        'Believing keys are passed as props to child components',
        'Not explaining how Fiber splits reconciliation into render and commit phases'
      ]
    },
    sampleAnswer: 'React uses a reconciliation algorithm to synchronize its in-memory Virtual DOM with the real browser DOM. Before Fiber, reconciliation was synchronous (stack reconciler), which could block the main thread during heavy updates. The Fiber architecture introduced incremental rendering, breaking work into units called "fiber nodes". It divides updates into two phases: the asynchronous Render/Reconciliation phase (which can be paused or aborted based on priority lanes) and the synchronous Commit phase (where actual DOM mutations take place). When diffing lists, the "key" prop gives each element a persistent identity across renders so React can reuse existing DOM nodes through moves and re-ordering instead of tearing down and rebuilding subtrees. Using array indices as keys is dangerous if items are inserted, deleted, or re-sorted, as React may associate old state with the wrong item.',
    hints: [
      'Think about the difference between the Render phase and Commit phase.',
      'What happens when you delete an item from the beginning of an array if the key is the array index?'
    ],
    suggestedDurationSeconds: 180
  },
  {
    id: 'fe-02',
    track: 'frontend',
    level: 'senior',
    category: 'Performance & Web Vitals',
    title: 'Optimizing Core Web Vitals for High-Traffic Web Apps',
    prompt: 'A critical e-commerce product page has poor Core Web Vitals: LCP is 4.8s, INP is 380ms, and CLS is 0.28. Walk me through your diagnosis strategy and specific engineering remedies to bring all three metrics into the "Good" threshold.',
    rubric: {
      keyPoints: [
        'LCP (Largest Contentful Paint) < 2.5s: Priority hints (fetchpriority="high"), preloading hero image, CDN caching, server-side rendering or edge streaming, critical CSS inlining',
        'INP (Interaction to Next Paint) < 200ms: Yielding to main thread (scheduler.yield / requestIdleCallback), debouncing/throttling event handlers, splitting large JS bundles, avoiding long tasks (>50ms)',
        'CLS (Cumulative Layout Shift) < 0.1: Setting explicit width/height or aspect-ratio on images & embeds, font-display: optional or size-adjust font fallback, reserving layout space for dynamic ads/banners',
        'Tooling: Chrome DevTools Performance panel, Web Vitals Chrome extension, Lighthouse, Real User Monitoring (RUM) field data'
      ],
      commonPitfalls: [
        'Confusing FID with INP (INP measures all interactions throughout the full page lifecycle, not just the first input)',
        'Optimizing JavaScript bundles to fix CLS (CLS is layout-specific, not CPU-bound)',
        'Not differentiating lab data from RUM (field) data'
      ]
    },
    sampleAnswer: 'To tackle LCP (4.8s -> <2.5s), I first locate the LCP element (typically the hero product image or heading). I eliminate render-blocking CSS/JS, apply fetchpriority="high" and rel="preload" to the hero asset, ensure modern formats (AVIF/WebP) with responsive srcset, and enable edge CDN caching with brotli compression. For INP (380ms -> <200ms), which tracks latency of user interactions across the entire session, I profile Long Tasks (>50ms) in DevTools. I break up monolithic React state updates using startTransition or scheduler.yield(), offload heavy client filtering or calculation to Web Workers, and eliminate synchronous reflows caused by reading layout properties right after modifying classes. For CLS (0.28 -> <0.1), I ensure all product images, carousels, and promotional banners have explicit aspect-ratio or width/height CSS declarations so the browser reserves space before network downloads finish. Furthermore, I implement font-display: optional with fallback font metric overrides (size-adjust) to avoid layout shifts when custom web fonts swap in.',
    hints: [
      'Focus on the 3 distinct browser rendering bottlenecks: Network/Resource loading (LCP), Main Thread JS Execution (INP), and Geometry/Reflow stability (CLS).'
    ],
    suggestedDurationSeconds: 240
  },
  {
    id: 'fe-03',
    track: 'frontend',
    level: 'mid',
    category: 'Coding & React Hooks',
    title: 'Build a Debounced Search Input with Cancellation',
    prompt: 'Implement a custom React hook `useDebounce` or build a search component that triggers an asynchronous API search after the user stops typing for 300ms, properly handling race conditions and component unmounting.',
    rubric: {
      keyPoints: [
        'Proper use of useEffect with setTimeout and cleanup clearTimeout',
        'Race condition handling using AbortController (fetch cancellation) or active boolean flag',
        'Handling edge cases: rapid typing, clear query, empty state, unmounted component',
        'Clean TypeScript typing with generic type parameters'
      ],
      commonPitfalls: [
        'Forgetting the cleanup return function in useEffect, leading to memory leaks and stale timers',
        'Ignoring out-of-order API responses where a slower earlier request overrides a newer faster request',
        'Hardcoding delay instead of allowing customizable debounce intervals'
      ]
    },
    sampleAnswer: 'Here is an idiomatic solution combining a debounce hook with AbortController for clean network cancellation:\n\n```tsx\nimport { useState, useEffect } from "react";\n\nexport function useDebounce<T>(value: T, delayMs: number = 300): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n\n  useEffect(() => {\n    const timer = setTimeout(() => setDebouncedValue(value), delayMs);\n    return () => clearTimeout(timer);\n  }, [value, delayMs]);\n\n  return debouncedValue;\n}\n\n// Usage with race-condition safe fetch:\nexport function SearchComponent() {\n  const [query, setQuery] = useState("");\n  const debouncedQuery = useDebounce(query, 300);\n  const [results, setResults] = useState<string[]>([]);\n  const [loading, setLoading] = useState(false);\n\n  useEffect(() => {\n    if (!debouncedQuery.trim()) {\n      setResults([]);\n      return;\n    }\n    const controller = new AbortController();\n    setLoading(true);\n\n    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, { signal: controller.signal })\n      .then(res => res.json())\n      .then(data => setResults(data))\n      .catch(err => { if (err.name !== "AbortError") console.error(err); })\n      .finally(() => setLoading(false));\n\n    return () => controller.abort();\n  }, [debouncedQuery]);\n\n  return <input value={query} onChange={e => setQuery(e.target.value)} />;\n}\n```',
    starterCode: `import React, { useState, useEffect } from 'react';

// Implement useDebounce hook and search handler
export function useDebounce<T>(value: T, delay: number): T {
  // TODO: implement
  return value;
}

export function SearchBox() {
  const [searchTerm, setSearchTerm] = useState('');
  // TODO: connect debounced search logic
  return (
    <div>
      <input type="text" placeholder="Search..." />
    </div>
  );
}`,
    hints: [
      'Remember that React useEffect cleanup executes before the next effect run and on unmount.',
      'How do you prevent a stale network response from overwriting a newer query result?'
    ],
    suggestedDurationSeconds: 200
  },

  // ==========================================
  // BACKEND QUESTIONS
  // ==========================================
  {
    id: 'be-01',
    track: 'backend',
    level: 'senior',
    category: 'Databases & Concurrency',
    title: 'Preventing Double-Spending and Race Conditions in Financial Transactions',
    prompt: 'You are designing an account debit and transfer service handling 10,000 req/sec. How do you prevent double-spending, negative balances, and deadlocks under concurrent requests? Compare pessimistic locking, optimistic locking, and distributed locks.',
    rubric: {
      keyPoints: [
        'ACID transactions & Isolation levels (Serializable vs Read Committed with row-level locks)',
        'Pessimistic locking (SELECT FOR UPDATE) vs Optimistic locking (version/timestamp checks with retry loops)',
        'Idempotency keys (UUID passed by client stored in Redis/DB with unique constraint)',
        'Deadlock prevention: deterministic lock ordering (always lock account with smaller ID first)',
        'Distributed lock caveats (Redlock, lease TTLs, clock drift, GC pauses)'
      ],
      commonPitfalls: [
        'Relying solely on application-level checks (e.g., if (balance >= amount) in Node.js) which fail under concurrent requests',
        'Not establishing an ordering for multi-account locks, causing circular deadlocks (Account A -> B while B -> A)',
        'Failing to handle idempotency on client network timeouts/retries'
      ]
    },
    sampleAnswer: 'To guarantee transactional integrity, application-level checks are insufficient due to race conditions. At the relational database layer, for high-contention accounts, we use ACID transactions with pessimistic row-level locking: `SELECT balance FROM accounts WHERE id = ? FOR UPDATE`. To prevent deadlocks when transferring money between two accounts (A and B), we enforce deterministic locking order by always acquiring locks in ascending order of account IDs (`min(A, B)` first, then `max(A, B)`). For idempotency across retries, every transaction request requires an `idempotency_key` header; we insert this key with an in-progress state into an idempotency table or Redis key with a lease before processing. In low-contention scenarios, optimistic locking with a `version` column (`UPDATE accounts SET balance = balance - ?, version = version + 1 WHERE id = ? AND version = ? AND balance >= ?`) yields higher throughput without locking overhead, falling back to exponential backoff retries on conflict. In distributed microservice settings, we pair the Saga pattern with outbox messaging to ensure eventual consistency without two-phase commit overhead.',
    hints: [
      'What happens if two users simultaneously transfer money to each other at the exact same millisecond?',
      'How does an idempotency key prevent double-charging when a network timeout occurs?'
    ],
    suggestedDurationSeconds: 240
  },
  {
    id: 'be-02',
    track: 'backend',
    level: 'mid',
    category: 'Caching & Resiliency',
    title: 'Cache Stampede, Cache Penetration, and Cache Avalanche',
    prompt: 'Explain Cache Avalanche, Cache Breakdown (Stampede), and Cache Penetration. What are the production strategies and patterns used to mitigate each one?',
    rubric: {
      keyPoints: [
        'Cache Avalanche: Massive number of keys expiring simultaneously; Fix: Add randomized jitter to TTLs, cluster Redis',
        'Cache Breakdown / Stampede: A single hot key expires, and thousands of concurrent requests hit the DB at once; Fix: Mutex lock (single-flight pattern), background async refresh before expiry',
        'Cache Penetration: Requests for non-existent data querying DB repeatedly; Fix: Bloom filters, caching null values with short TTL',
        'Cache invalidation strategies: Cache-aside, Write-through, Write-back'
      ],
      commonPitfalls: [
        'Treating all cache failures identically without diagnosing the root cause',
        'Setting identical TTLs on bulk-cached entities',
        'Not using Bloom filters or null caching for non-existent IDs'
      ]
    },
    sampleAnswer: 'These are three distinct failure modes in distributed caching:\n1. Cache Avalanche occurs when a huge batch of cached keys expire simultaneously or the cache cluster crashes, causing an overwhelming deluge of traffic directly to the database. Fix: Add random jitter to key TTLs (e.g., base TTL + random(0, 300)s) and deploy Redis Sentinel or Redis Cluster with read replicas.\n2. Cache Breakdown (Stampede) happens when an intensely popular "hot key" expires, and thousands of concurrent requests find a cache miss and all execute the heavy DB query simultaneously. Fix: Use a mutex / distributed lock (or Golang singleflight / Node.js promise sharing) so only the first request queries the DB while others wait, or implement a proactive background cron that refreshes the hot key before its TTL expires.\n3. Cache Penetration happens when malicious or frequent queries request IDs that do not exist in both cache and DB, bypassing the cache every time. Fix: Implement a Bloom Filter at the gateway to quickly reject non-existent keys in O(1) time, or cache the empty/null result with a short TTL (e.g., 60 seconds).',
    hints: [
      'Think about random TTL jitter for avalanche.',
      'How do singleflight locks prevent dogpiling on a single hot item?'
    ],
    suggestedDurationSeconds: 200
  },

  // ==========================================
  // SYSTEM DESIGN QUESTIONS
  // ==========================================
  {
    id: 'sd-01',
    track: 'system-design',
    level: 'senior',
    category: 'Distributed Systems & Rate Limiting',
    title: 'Design a Distributed API Rate Limiter at 1 Million RPS',
    prompt: 'Design a distributed rate-limiting service capable of evaluating 1,000,000 requests per second across a global multi-region fleet. Discuss algorithms (Token Bucket, Leaky Bucket, Sliding Window Counter), data storage, synchronization latency, and failure modes.',
    rubric: {
      keyPoints: [
        'Requirements & Scale: 1M RPS, <5ms latency overhead, high availability, graceful degradation',
        'Algorithm tradeoffs: Token Bucket (supports bursts, low memory) vs Sliding Window Counter (accurate, low memory footprint)',
        'Storage: Redis cluster with Lua scripts for atomic increments and TTL updates',
        'Distributed synchronization: Local in-memory token buckets with periodic batch synchronization to reduce cross-region network round-trips',
        'Failure modes (Fail-open vs Fail-closed policy for rate limiters)',
        'HTTP Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, 429 Too Many Requests with Retry-After'
      ],
      commonPitfalls: [
        'Proposing a single centralized database or relational DB which bottlenecks at 10k RPS',
        'Doing multiple round-trips to Redis per API request without Lua scripts (causing race conditions and latency)',
        'Choosing Fail-Closed for rate limiting during outages (which brings down entire company services)'
      ]
    },
    sampleAnswer: 'For 1M RPS, our primary constraint is low latency (<3ms) and high availability.\n\n1. Algorithm: I choose the Sliding Window Counter algorithm or Token Bucket. Sliding window counter avoids token bursts at boundary edges while requiring minimal storage (only counters for current and previous time buckets).\n\n2. Architecture: Placing the rate limiter as an API Gateway plugin / sidecar (Envoy/Kong) closest to the client. Instead of querying a central Redis instance on every single request (which would create 1M network hops), we adopt a two-tier hybrid model: each gateway node maintains an in-memory local bucket for high-speed checks, and syncs asynchronously via batching (e.g., every 50ms) to a regional Redis Cluster using atomic Lua scripts.\n\n3. Redis Lua Script: The script atomically reads the counter, compares against the threshold, increments, and sets expiry in one round trip.\n\n4. Resilience & Failure Modes: We enforce a "Fail-Open" policy—if the rate limiter cluster fails or encounters timeouts, the API request is allowed through while triggering high-priority PagerDuty alerts, ensuring user-facing availability is never compromised by the rate limiter itself. Responses return standard headers: `X-RateLimit-Remaining` and `Retry-After` on HTTP 429.',
    hints: [
      'Calculate the network latency of a Redis round-trip across regions vs local caching.',
      'Why is Fail-Open preferred for business-critical APIs?'
    ],
    suggestedDurationSeconds: 300
  },
  {
    id: 'sd-02',
    track: 'system-design',
    level: 'senior',
    category: 'Storage & Architecture',
    title: 'Design a Scalable URL Shortener (TinyURL) with Analytics',
    prompt: 'Design a scalable TinyURL service handling 100M new URLs per month and 10B read clicks per month. Address short URL generation (base62 encoding vs hashing), storage schema, caching strategy, and real-time click analytics.',
    rubric: {
      keyPoints: [
        'Capacity estimation: 100M writes/month (~40 writes/sec), 10B reads/month (~4,000 reads/sec, 100:1 read-to-write ratio)',
        'Storage calculation: 100M * 500 bytes = 50GB/month, 3TB over 5 years',
        'Unique ID Generation: Distributed ID generator (Snowflake / ZooKeeper range allocator) converted to Base62 (6-7 chars: 62^7 = 3.5 trillion combos)',
        'Database selection: NoSQL Key-Value store (DynamoDB / Cassandra) or partitioned PostgreSQL with Redis cache for top 20% URLs (80-20 Pareto rule)',
        'Analytics pipeline: Asynchronous Kafka event stream -> Flink / ClickHouse for real-time aggregations without blocking URL redirect latency (301 vs 302 HTTP status)'
      ],
      commonPitfalls: [
        'Using MD5/SHA256 and truncating without handling hash collisions',
        'Using HTTP 301 Moved Permanently when click analytics are required (browsers cache 301, bypassing servers for subsequent clicks; HTTP 302 or 307 is required for accurate tracking)',
        'Synchronously recording analytics in the critical redirect path, adding database write latency'
      ]
    },
    sampleAnswer: '1. Scale & Math: 100M writes/month (~40 RPS write), 10B reads/month (~4,000 RPS read). 100:1 read-heavy ratio. Over 5 years, we store 6B URLs. With 7 Base62 characters ([a-zA-Z0-9]), 62^7 gives ~3.52 trillion unique combinations, plenty for our needs.\n\n2. Key Generation: Instead of hashing long URLs (which creates collision handling complexity), we use a distributed ID generator (Twitter Snowflake or Range Allocator with Zookeeper) to generate unique 64-bit integer IDs, then convert the integer into Base62.\n\n3. Storage & Redirects: Key-Value database (DynamoDB or Cassandra) where partition key is `short_code`. Since 20% of URLs generate 80% of read traffic, we maintain a Redis cache with LRU eviction storing the top 20% URLs, achieving a ~90% cache hit rate. For redirects, we return HTTP 302 (Found) so browsers re-query our server each time, enabling accurate analytics.\n\n4. Click Analytics Pipeline: Recording clicks cannot block the redirect latency. When a redirect occurs, the service emits an event to an Apache Kafka topic. Downstream consumer workers batch write the raw events into ClickHouse or Amazon Timestream, powering real-time dashboard analytics with zero impact on the end-user redirect path.',
    hints: [
      'Why would HTTP 301 hurt click tracking compared to HTTP 302?',
      'How does Base62 conversion of an auto-incrementing range prevent collision lookups?'
    ],
    suggestedDurationSeconds: 280
  },

  // ==========================================
  // BEHAVIORAL & LEADERSHIP (STAR)
  // ==========================================
  {
    id: 'beh-01',
    track: 'behavioral',
    level: 'senior',
    category: 'Conflict Resolution & Leadership',
    title: 'Navigating Architectural Disagreements on a Tight Deadline',
    prompt: 'Tell me about a time when you had a strong technical disagreement with a team member or tech lead regarding an architecture or product decision, especially when facing a critical delivery deadline. How did you handle it and what was the outcome?',
    rubric: {
      keyPoints: [
        'Clear STAR structure: Situation, Task, Action, Result',
        'Focus on data, benchmarks, and customer impact rather than personal opinions or ego',
        'Willingness to "Disagree and Commit" or find a pragmatic phase-1 compromise',
        'Tangible quantifiable outcome (e.g., delivered on time, 99.99% uptime, reduced latency by 40%)',
        'Retrospective reflection: What was learned from the other person\'s perspective'
      ],
      starCriteria: {
        situation: 'Contextualize the project, deadline, and the core architectural controversy.',
        task: 'Define your role and responsibility in reaching consensus quickly without derailing the launch.',
        action: 'Detail the objective steps taken: running spikes/proof-of-concepts, metric comparison, scheduling a time-boxed review.',
        result: 'Share the launch outcome, technical performance metrics, and positive long-term team relationship.'
      },
      commonPitfalls: [
        'Portraying oneself as entirely right and the teammate as incompetent',
        'Escalating immediately to management without attempting peer-to-peer alignment',
        'Failing to mention the business outcome or metrics'
      ]
    },
    sampleAnswer: 'Situation: At my previous company, we were 4 weeks away from launching our real-time notification engine. Our senior architect proposed migrating from our current Redis pub/sub to Apache Kafka, arguing Kafka had better durability. However, our deadline was tight and the team had zero Kafka operational experience in production.\n\nTask: As the tech lead for the initiative, I needed to ensure we met the customer launch date while preventing future data loss or scalability bottlenecks.\n\nAction: Instead of debating theoretical points, I organized a 2-day time-boxed spike. I benchmarked Redis Streams against our throughput requirements (25,000 notifications/sec) and demonstrated that Redis Streams provided consumer groups and disk persistence (AOF everysec) without requiring a multi-node ZooKeeper/Kafka cluster setup. I presented the findings in an architectural review: we agreed to proceed with Redis Streams for Phase 1 to launch on time, while architecting clean message interfaces so we could swap in Kafka later if message retention exceeded 7 days.\n\nResult: We launched two days ahead of schedule with zero downtime. During our Black Friday spike, the engine handled 35,000 events/sec at sub-10ms delivery latency. Most importantly, the architect and I built strong mutual trust because the decision was driven by empirical benchmarks rather than ego.',
    hints: [
      'Structure your response: Situation (20%), Task (10%), Action (50%), Result (20%).',
      'Mention how you maintained team cohesion during and after the debate.'
    ],
    suggestedDurationSeconds: 220
  },
  {
    id: 'beh-02',
    track: 'behavioral',
    level: 'mid',
    category: 'Ownership & Failure Retrospective',
    title: 'A Critical Mistake or Production Outage You Caused',
    prompt: 'Tell me about a significant mistake you made or a production incident you contributed to. What happened, how did you respond in the moment, how did you communicate with stakeholders, and what systemic safeguards did you introduce?',
    rubric: {
      keyPoints: [
        'Radical ownership: No blame shifting to junior engineers or third-party libraries',
        'Rapid triage and mitigation prioritized over finding fault',
        'Transparent stakeholder communication and blameless post-mortem',
        'Long-term preventative fixes: CI/CD validation, automated canary deploys, database rollback guardrails'
      ],
      starCriteria: {
        situation: 'Describe the production incident and its severity without defensiveness.',
        task: 'Identify your responsibility in stabilizing the service and communicating impact.',
        action: 'Immediate mitigation (rollback/hotfix) + conducting a blameless post-mortem.',
        result: 'Service recovery time and long-term automated safety guards implemented.'
      },
      commonPitfalls: [
        'Choosing a trivial "fake" mistake like "I worked too hard"',
        'Blaming someone else for missing the bug in code review',
        'Failing to implement automated preventative tests or guards'
      ]
    },
    sampleAnswer: 'Situation: Two years ago, while optimizing a database migration for our user billing service, I executed a script that unintentionally acquired an exclusive table lock on the `subscriptions` table. This blocked incoming checkout queries, causing a 12-minute partial checkout outage affecting approximately 450 transactions.\n\nTask: My primary duty was immediate triage to restore revenue flow, followed by blameless communication and root-cause remediation.\n\nAction: I immediately recognized the symptom in our Datadog APM dashboard. Instead of trying to debug the live query, I aborted the migration transaction and terminated the blocking PID, which instantly freed connection pool threads and brought latency back to baseline in under 3 minutes. I promptly posted an update in our incident response channel detailing the exact root cause. The next day, I led a blameless post-mortem: rather than attributing it to "human error", we audited our deploy tooling. I integrated `pg-safe-validate` and automated linting in our GitHub Actions pipeline to reject migrations that attempt table locks without a strict lock timeout, and established a rule that all schema modifications run via zero-downtime blue-green canary stages.\n\nResult: We successfully refunded and re-processed all affected customer transactions within two hours. Over the subsequent 18 months, our team completed over 80 production migrations with zero lock-related outages.',
    hints: [
      'The best answers showcase extreme ownership and focus on systemic improvements, not self-flagellation.'
    ],
    suggestedDurationSeconds: 200
  },

  // ==========================================
  // AI & MACHINE LEARNING
  // ==========================================
  {
    id: 'ai-01',
    track: 'ai-ml',
    level: 'senior',
    category: 'LLMs & RAG Architectures',
    title: 'Production RAG: Combating Hallucinations, Chunking & Latency',
    prompt: 'You are architecting an enterprise Retrieval-Augmented Generation (RAG) system for a knowledge base of 500,000 technical manuals. How do you design chunking, embedding retrieval, re-ranking, and hallucination guardrails while keeping end-to-end response latency under 1.5 seconds?',
    rubric: {
      keyPoints: [
        'Chunking strategies: Semantic chunking / recursive character chunking with parent-document retriever or contextual headers',
        'Hybrid Search: Combining dense semantic embeddings (cosine similarity) with sparse keyword search (BM25) via Reciprocal Rank Fusion (RRF)',
        'Re-ranking: Cross-encoder (Cohere Rerank / BGE-reranker) to score top 50 candidates down to top 5',
        'Hallucination prevention: Strict citation prompts, confidence thresholding, self-consistency checks, guardrail frameworks (NeMo Guardrails)',
        'Latency optimization: Async streaming responses, vector index quantization (HNSW with SQ8/PQ), embedding caching'
      ],
      commonPitfalls: [
        'Relying solely on naive fixed-size chunking (e.g. 500 tokens) which cuts sentences and context in half',
        'Assuming vector search alone solves acronyms and exact keyword matching (BM25 is necessary for technical terms)',
        'Failing to stream the LLM token response, leading to perceived slow latency'
      ]
    },
    sampleAnswer: 'To deliver sub-1.5s latency across 500,000 manuals with high factual precision, I design a multi-stage hybrid RAG pipeline:\n\n1. Ingestion & Chunking: Naive token splitting breaks technical tables and code snippets. We implement semantic chunking with a Parent-Document approach: documents are broken into small child chunks (150 tokens) for precise vector matching, while retaining references to parent chunks (800 tokens) with document metadata to inject into the LLM context window.\n\n2. Hybrid Retrieval: Pure dense embeddings fail on part numbers and exact error codes. We execute a parallel hybrid search: dense vector retrieval (HNSW index in Qdrant/Pinecone) + sparse lexical search (BM25 in Elasticsearch). We fuse results using Reciprocal Rank Fusion (RRF) to retrieve the top 30 candidates within 40ms.\n\n3. Re-ranking: A lightweight cross-encoder model (e.g., BGE-Reranker-Large or Cohere) scores semantic relevance between user query and retrieved passages, distilling down to the top 4 most pertinent contexts (taking ~80ms).\n\n4. Generation & Guardrails: We prompt the LLM with strict grounding instructions: "Only answer using provided citations. If ambiguous, respond with \'Insufficient technical documentation\'". We stream the tokens via Server-Sent Events (SSE) so Time-To-First-Token (TTFT) is under 400ms. Finally, an asynchronous validator checks that generated citations match retrieved chunk IDs.',
    hints: [
      'Why does combining BM25 and vector search perform vastly better on technical manuals than vector search alone?',
      'How does streaming tokens solve perceived latency issues?'
    ],
    suggestedDurationSeconds: 260
  },

  // ==========================================
  // FULLSTACK & DEVOPS
  // ==========================================
  {
    id: 'fs-01',
    track: 'fullstack',
    level: 'mid',
    category: 'Authentication & Security',
    title: 'Architecting Secure JWT Authentication with Refresh Tokens',
    prompt: 'Explain the security lifecycle of JWT authentication. Where should tokens be stored on the client (localStorage vs httpOnly cookies)? How do you handle token revocation, CSRF protection, and silent refresh without interrupting the user experience?',
    rubric: {
      keyPoints: [
        'Storage tradeoffs: localStorage is vulnerable to XSS; httpOnly, secure, SameSite cookies protect against script access',
        'CSRF defense: SameSite=Lax/Strict cookies + anti-CSRF double-submit tokens',
        'Access vs Refresh Token lifecycle: Short-lived access token (5-15 mins in memory or cookie), longer-lived refresh token (7-30 days) stored in DB/Redis with rotation',
        'Token revocation: Refresh token rotation where old token is invalidated upon use; token family blacklisting if an expired refresh token is reused (indicating theft)',
        'Silent refresh: Interceptors (Axios / Fetch) catching 401 and queuing requests while fetching a fresh access token'
      ],
      commonPitfalls: [
        'Storing sensitive JWTs in localStorage and claiming it is safe against XSS',
        'Not having a mechanism to revoke JWTs prior to their natural expiration',
        'Infinite 401 retry loops in frontend HTTP interceptors'
      ]
    },
    sampleAnswer: 'A robust JWT architecture balances security against XSS and CSRF while providing seamless session continuity:\n\n1. Token Storage: Access tokens should be short-lived (5-15 minutes) and kept in client application memory. Refresh tokens should have a longer lifespan (e.g., 7 days) and must be stored in an `httpOnly`, `Secure`, `SameSite=Lax` cookie. This makes the refresh token inaccessible to malicious JavaScript injections (XSS mitigation).\n\n2. CSRF Mitigation: While SameSite cookies mitigate cross-origin requests, for sensitive POST/DELETE operations, we also supply an anti-CSRF token in a custom header (`X-CSRF-Token`) validated by server middleware.\n\n3. Refresh Token Rotation & Family Revocation: Each time the refresh token is exchanged, the server issues a new refresh token and invalidates the previous one in Redis. If a revoked refresh token is presented again (indicating token theft), the server immediately invalidates the entire token family, forcing a re-login.\n\n4. Frontend Interceptor: In the frontend, an Axios/Fetch response interceptor catches 401 Unauthorized errors, pauses pending requests in a queue, silently calls `/api/auth/refresh`, and then replays the queued requests with the updated access token.',
    hints: [
      'Contrast localStorage XSS vulnerability with cookie CSRF vulnerability.',
      'What happens when a stolen refresh token is used after the legitimate user already rotated it?'
    ],
    suggestedDurationSeconds: 220
  }
];

export function getQuestionsByTrack(track: string, level?: string): Question[] {
  let list = QUESTION_BANK.filter(q => q.track === track);
  if (list.length === 0) {
    list = QUESTION_BANK; // fallback
  }
  if (level) {
    const levelFiltered = list.filter(q => q.level === level);
    if (levelFiltered.length > 0) return levelFiltered;
  }
  return list;
}
