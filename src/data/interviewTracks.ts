import { CareerTrack, ExperienceLevel, InterviewerPersona } from '../types';

export interface TrackMetadata {
  id: CareerTrack;
  title: string;
  badge: string;
  iconName: string;
  description: string;
  popularRoles: string[];
  gradient: string;
  coreSkills: string[];
}

export const CAREER_TRACKS: TrackMetadata[] = [
  {
    id: 'frontend',
    title: 'Frontend Engineering',
    badge: 'High Demand',
    iconName: 'Layout',
    description: 'React, TypeScript, CSS architecture, browser internals, performance tuning, and DOM rendering lifecycle.',
    popularRoles: ['React Developer', 'Senior Frontend Engineer', 'UI/UX Engineer', 'Web Architect'],
    gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    coreSkills: ['React & Next.js', 'State Management', 'Web Vitals', 'CSS/Tailwind', 'SSR & Hydration', 'TypeScript']
  },
  {
    id: 'backend',
    title: 'Backend Engineering',
    badge: 'Core Tech',
    iconName: 'Server',
    description: 'Distributed services, microservices, REST/gRPC/GraphQL, relational and NoSQL databases, caching, and concurrency.',
    popularRoles: ['Backend Software Engineer', 'Node.js / Go Engineer', 'Platform Engineer', 'Database Specialist'],
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    coreSkills: ['API Architecture', 'PostgreSQL / Mongo', 'Redis Caching', 'Concurrency & Locks', 'Message Queues', 'Security']
  },
  {
    id: 'fullstack',
    title: 'Full Stack Engineering',
    badge: 'Versatile',
    iconName: 'Layers',
    description: 'End-to-end product engineering from modern reactive frontends to robust cloud backends, auth, and CI/CD.',
    popularRoles: ['Full Stack Developer', 'Founding Engineer', 'Tech Lead', 'Application Developer'],
    gradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
    coreSkills: ['Full Stack Arch', 'Auth (JWT/OAuth)', 'REST & GraphQL', 'State & DB Sync', 'CI/CD Pipelines', 'Testing']
  },
  {
    id: 'system-design',
    title: 'System Design & Scalability',
    badge: 'Senior & Staff',
    iconName: 'Network',
    description: 'Large-scale distributed systems, high availability, rate limiting, sharding, consensus protocols, and fault tolerance.',
    popularRoles: ['Staff Engineer', 'Solutions Architect', 'Distributed Systems Specialist', 'Principal Engineer'],
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    coreSkills: ['CAP Theorem', 'Sharding & Replication', 'Rate Limiting', 'CDN & Edge', 'Event-Driven Pub/Sub', 'Capacity Planning']
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    badge: 'Trending',
    iconName: 'Sparkles',
    description: 'LLMs, Prompt Engineering, RAG architectures, model fine-tuning, embeddings, PyTorch, and MLOps deployment.',
    popularRoles: ['AI Application Engineer', 'MLOps Engineer', 'Data Scientist', 'LLM Architect'],
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    coreSkills: ['RAG Architectures', 'Vector Embeddings', 'Fine-tuning & LoRA', 'Evaluation Metrics', 'Latency Optimization', 'MLOps']
  },
  {
    id: 'behavioral',
    title: 'Behavioral & Leadership (STAR)',
    badge: 'Universal',
    iconName: 'Users',
    description: 'FAANG behavioral scenarios, conflict resolution, ownership, cross-functional influence, and failure retrospectives.',
    popularRoles: ['All Roles', 'Engineering Manager', 'Team Lead', 'Senior Individual Contributor'],
    gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
    coreSkills: ['STAR Technique', 'Conflict Resolution', 'Ambiguity Management', 'Ownership Mindset', 'Delivering Under Pressure']
  },
  {
    id: 'product-management',
    title: 'Product Management',
    badge: 'Strategy',
    iconName: 'Briefcase',
    description: 'Product sense, prioritization frameworks (RICE, Kano), metric definition, execution tradeoffs, and user empathy.',
    popularRoles: ['Product Manager', 'Associate PM', 'Group PM', 'Technical PM'],
    gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
    coreSkills: ['Product Sense', 'North Star Metrics', 'Feature Prioritization', 'A/B Testing', 'Stakeholder Alignment']
  },
  {
    id: 'devops-cloud',
    title: 'DevOps & Cloud Engineering',
    badge: 'Infrastructure',
    iconName: 'Cloud',
    description: 'Kubernetes, Docker containerization, Terraform IaC, AWS/GCP, observability (Prometheus/Grafana), and reliability.',
    popularRoles: ['DevOps Engineer', 'SRE (Site Reliability Engineer)', 'Cloud Architect', 'Platform Engineer'],
    gradient: 'from-sky-500/20 via-teal-500/10 to-transparent',
    coreSkills: ['Kubernetes & Helm', 'Docker Workflows', 'Terraform (IaC)', 'CI/CD Automation', 'SLIs/SLOs & Incident Mgmt']
  }
];

export const PERSONA_CONFIGS: Record<InterviewerPersona, { name: string; title: string; style: string; tone: string; avatarBg: string }> = {
  'friendly-mentor': {
    name: 'Sarah Chen',
    title: 'Senior Engineering Mentor',
    style: 'Encouraging, supportive, provides subtle hints when stuck, focuses on thought process.',
    tone: 'Conversational and welcoming',
    avatarBg: 'from-emerald-500 to-teal-600'
  },
  'strict-bar-raiser': {
    name: 'Marcus Vance',
    title: 'FAANG Principal Bar Raiser',
    style: 'Demanding, tests edge cases, presses for rigorous time/space complexity and STAR specifics.',
    tone: 'Crisp, professional, rigorous',
    avatarBg: 'from-rose-500 to-indigo-700'
  },
  'analytical-architect': {
    name: 'Dr. Evelyn Reed',
    title: 'Chief Systems Architect',
    style: 'Deeply technical, probes bottlenecks, explores trade-offs, questions architectural assumptions.',
    tone: 'Analytical and detail-oriented',
    avatarBg: 'from-blue-600 to-indigo-900'
  }
};
