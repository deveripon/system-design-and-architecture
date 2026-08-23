/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    IconBrandAmazon,
    IconBrandGoogleHome,
    IconBrandWhatsapp,
    IconBrandX,
    IconBrandYoutube,
} from '@tabler/icons-react';
import {
    BarChart3,
    Box,
    Car,
    Cloud,
    CloudUpload,
    Cpu,
    Database,
    Globe,
    Link,
    Lock,
    Mail,
    Network,
    Puzzle,
    Radar,
    RefreshCw,
    Repeat,
    Scale,
    Search,
    Server,
    ShieldAlert,
    Waves,
    Workflow,
    Zap,
} from 'lucide-react';

export interface Topic {
    id: string;
    title: string;
    icon?: any;
    tag?: string;
    time?: string;
    level?: string;
    type?: string;
    summary?: string;
    details?: string;
    useCases?: string[];
    practice?: string[];
    tools?: string[];
}

export interface CoursePhase {
    id: string;
    title: string;
    /** Bengali name, kept separate so no dash is needed to join them. */
    subtitle?: string;
    duration: string;
    topics: Topic[];
}

export const courseData: CoursePhase[] = [
    {
        id: 'phase-0',
        title: 'Introduction',
        subtitle: 'ভূমিকা',
        duration: '10 মিনিট',
        topics: [
            {
                id: 'introduction',
                title: 'Introduction of System Design',
                icon: IconBrandGoogleHome,
                tag: 'INTRODUCTION',
                time: '৮-১০ মিনিট',
                level: 'Beginner',
                type: 'Theory',
                summary:
                    'সিস্টেম ডিজাইন কী, কেন শিখবেন এবং এর মূল ভিত্তিগুলো নিয়ে আলোচনা।',
                details:
                    'সিস্টেম ডিজাইনের প্রয়োজনীয়তা, স্ক্যালিং এর ধারণা এবং আধুনিক সফটওয়্যার আর্কিটেকচারের মূল উপাদানসমূহ।',
                useCases: [
                    'বড় অ্যাপ তৈরি: স্কেলেবিলিটির গুরুত্ব',
                    'ইন্টারভিউ প্রস্তুতি: সিস্টেম ডিজাইন রাউন্ড',
                    'স্কেলেবল সলিউশন: আর্কিটেকচার প্ল্যানিং',
                ],
                practice: [
                    'সিস্টেম ডায়াগ্রাম আঁকা শিখুন',
                    'রিয়েল-ওয়ার্ল্ড কেস স্টাডি এনালাইসিস',
                    'বেসিক আর্কিটেকচার ডিজাইন',
                ],
            },
        ],
    },
    {
        id: 'phase-1',
        title: 'Foundations',
        subtitle: 'ভিত্তি তৈরি',
        duration: '৪-৬ সপ্তাহ',
        topics: [
            {
                id: 'scalability',
                title: 'Scalability Fundamentals',
                icon: Zap,
                tag: 'CORE',
                time: '৩০-৪৫ মিনিট',
                level: 'Intermediate',
                type: 'Theory & Practice',
                summary:
                    'Vertical vs Horizontal Scaling, এর পার্থক্য, কখন কোনটা ব্যবহার করবেন।',
                details:
                    'Vertical scaling (বড় মেশিন) vs Horizontal scaling (বেশি মেশিন)। Load balancer দিয়ে ট্র্যাফিক ভাগ করা। Stateless vs Stateful আর্কিটেকচার।',
                useCases: [
                    'Startup stage: vertical scaling শুরু করুন',
                    '১০ লক্ষ+ user হলে: horizontal scaling',
                    'Database bottleneck: vertical first',
                ],
                practice: [
                    'একটি সিম্পল Node.js API বানান',
                    'Nginx দিয়ে load balance করুন',
                    'Multiple instances run করুন',
                ],
            },
            {
                id: 'load-balancing',
                title: 'Load Balancing',
                icon: Scale,
                tag: 'HIGH IMPACT',
                time: '৩০-৪৫ মিনিট',
                level: 'Intermediate',
                type: 'Traffic Management',
                summary:
                    'Traffic কীভাবে distribute করবেন: algorithms, health checks, sticky sessions।',
                details:
                    'Round Robin, Least Connections algorithms। L4 vs L7 balancing। Health checks এবং SSL termination।',
                tools: ['Nginx', 'HAProxy', 'AWS ALB'],
                useCases: [
                    'Equal spec servers: Round Robin',
                    'Variable spec: Weighted RR',
                    'Sticky sessions: IP Hash',
                ],
            },
            {
                id: 'networking',
                title: 'Networking Basics for Engineers',
                icon: Network,
                tag: 'CORE',
                time: '৪৫-৬০ মিনিট',
                level: 'Beginner',
                type: 'Foundations',
                summary:
                    'TCP/IP, DNS, HTTP/HTTPS, WebSocket। সিস্টেম ডিজাইনের জন্য যা জানা মাস্ট।',
                details:
                    'DNS resolution কীভাবে কাজ করে। TCP vs UDP কখন কোনটা। HTTP/2 vs HTTP/3 সুবিধা। WebSocket দিয়ে real-time communication।',
                tools: ['Wireshark', 'curl', 'Postman'],
                useCases: [
                    'Chat app: WebSocket',
                    'Video stream: UDP/QUIC',
                    'REST API: HTTP/2',
                ],
            },
            {
                id: 'cdn-storage',
                title: 'CDN & Object Storage',
                icon: Cloud,
                tag: 'PRACTICAL',
                time: '৩০-৪৫ মিনিট',
                level: 'Beginner',
                type: 'Static Assets',
                summary:
                    'Static assets, images, videos globally fast serve করার জন্য। S3, CloudFront মাস্ট।',
                details:
                    'Edge caching, Cache-Control headers। S3 buckets, presigned URLs, and lifecycle policies।',
                tools: ['AWS S3', 'CloudFront', 'Cloudflare'],
                useCases: [
                    'Global image serving: CDN',
                    'File storage: S3',
                    'Video streaming: HLS/CDN',
                ],
            },
        ],
    },
    {
        id: 'phase-2',
        title: 'Databases & Storage',
        subtitle: 'ডেটাবেস এবং স্টোরেজ',
        duration: '৬-৮ সপ্তাহ',
        topics: [
            {
                id: 'databases',
                title: 'Database Fundamentals',
                icon: Database,
                tag: 'CORE',
                time: '৬০-৯০ মিনিট',
                level: 'Intermediate',
                type: 'Theory & Labs',
                summary:
                    'SQL vs NoSQL, ACID properties, indexes, transactions। সবকিছু ক্লিয়ার করুন।',
                details:
                    'Relational vs Unstructured data। PostgreSQL, MongoDB, Redis এর পার্থক্য। Indexing এবং Query optimization এর গুরুত্ব।',
                tools: ['PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch'],
                useCases: [
                    'Relational data: PostgreSQL',
                    'Flexible schema: MongoDB',
                    'Fast lookup: Redis',
                ],
            },
            {
                id: 'caching',
                title: 'Caching Strategy',
                icon: Cpu,
                tag: 'HIGH IMPACT',
                time: '৪৫-৬০ মিনিট',
                level: 'Intermediate',
                type: 'Performance Optimization',
                summary:
                    'Cache এর সঠিক ব্যবহারে system ১০-১০০x ফাস্ট হয়। এটা না জানলে চলবে না।',
                details:
                    'Cache-Aside, Write-Through, Write-Back patterns। LRU/LFU eviction policies। Cache stampede এবং avalanche problems।',
                tools: ['Redis', 'Memcached', 'CloudFront'],
                useCases: [
                    'Read-heavy apps: Caching',
                    'Session storage: Redis',
                    'Global assets: CDN',
                ],
            },
            {
                id: 'db-sharding',
                title: 'Database Sharding & Replication',
                icon: Server,
                tag: 'ADVANCED',
                time: '৬০-৯০ মিনিট',
                level: 'Advanced',
                type: 'Database Scaling',
                summary:
                    'Large-scale database management, horizontal partitioning এবং data redundancy।',
                details:
                    'Range-based, Hash-based, Consistent hashing strategies। Master-Slave এবং Multi-region replication।',
                useCases: [
                    'Viral content handling: Sharding',
                    'High availability: Replication',
                    'Global low latency: Geo-sharding',
                ],
            },
            {
                id: 'cap-theorem',
                title: 'CAP Theorem & Consistency',
                icon: Box,
                tag: 'THEORY',
                time: '৩০-৪৫ মিনিট',
                level: 'Advanced',
                type: 'Architectural Theory',
                summary:
                    'Consistency, Availability, Partition Tolerance: distributed system এর মূল ত্রিভুজ।',
                details:
                    'তিনটার মধ্যে দুটো choose করতে হয়। CA vs CP vs AP। Eventual vs Strong consistency। Distributed systems এ trade-offs বোঝার মূল মন্ত্র।',
                useCases: [
                    'Bank transfer: Strong consistency (CP)',
                    'Social media likes: Eventual consistency (AP)',
                    'DNS: Eventual consistency',
                ],
            },
        ],
    },
    {
        id: 'phase-3',
        title: 'Distributed Systems',
        subtitle: 'ডিস্ট্রিবিউটেড সিস্টেম',
        duration: '৬-৮ সপ্তাহ',
        topics: [
            {
                id: 'message-queues',
                title: 'Message Queues & Event Streaming',
                icon: Mail,
                tag: 'MUST KNOW',
                time: '৬০-৯০ মিনিট',
                level: 'Intermediate',
                type: 'Async Systems',
                summary:
                    'Async communication, decoupling services: modern distributed system এর মেরুদণ্ড।',
                details:
                    'Queue vs Stream। RabbitMQ vs Kafka। Event sourcing and Pub/Sub patterns। Dead letter queues (DLQ)।',
                tools: ['Kafka', 'RabbitMQ', 'AWS SQS'],
                useCases: [
                    'Background jobs: RabbitMQ',
                    'Real-time analytics: Kafka',
                    'Email notifications: SQS',
                ],
            },
            {
                id: 'api-design',
                title: 'API Design & Gateway',
                icon: Globe,
                tag: 'MUST KNOW',
                time: '৪৫-৬০ মিনিট',
                level: 'Intermediate',
                type: 'System Integration',
                summary:
                    'REST vs GraphQL vs gRPC, API versioning, rate limiting, API Gateway pattern।',
                details:
                    'Authentication, Rate Limiting, SSL Termination, Request routing। API gateway pattern এর সুবিধা।',
                tools: ['Kong', 'Apollo GraphQL', 'gRPC'],
                useCases: [
                    'General purpose: REST',
                    'Flexible client: GraphQL',
                    'Service-to-service: gRPC',
                ],
            },
            {
                id: 'microservices',
                title: 'Microservices Architecture',
                icon: Puzzle,
                tag: 'ARCHITECTURE',
                time: '৬০-৯০ মিনিট',
                level: 'Intermediate',
                type: 'Architecture Strategy',
                summary:
                    'Monolith থেকে Microservices এ যানয়ার পথ, trade-offs, service mesh।',
                details:
                    'Independent deployment, technology diversity, organization scaling। Service-to-service communication strategies।',
                tools: ['Docker', 'Kubernetes', 'Istio'],
                useCases: [
                    'Scaling large teams: Microservices',
                    'Independent deployments: Containers',
                    'Polyglot tech stack',
                ],
            },
            {
                id: 'consensus',
                title: 'Distributed Consensus & Coordination',
                icon: Lock,
                tag: 'DEEP',
                time: '৯০-১২০ মিনিট',
                level: 'Advanced',
                type: 'Deep Theory',
                summary:
                    'Raft, Paxos, leader election: distributed system এ agreement কীভাবে হয়।',
                details:
                    'Leader election algorithms, distributed locking, and coordination in distributed clusters।',
                tools: ['Zookeeper', 'etcd', 'Consul'],
                useCases: [
                    'Service discovery: Consul',
                    'Configuration management: etcd',
                    'Cluster state: Zookeeper',
                ],
            },
            {
                id: 'resilience',
                title: 'Circuit Breaker & Resilience',
                icon: RefreshCw,
                tag: 'RELIABILITY',
                time: '৪৫-৬০ মিনিট',
                level: 'Intermediate',
                type: 'System Reliability',
                summary:
                    'Cascading failures থামানো। Circuit Breaker, Retry, Timeout patterns।',
                details:
                    'Implementing fault tolerance to prevent one service failure from bringing down the entire system।',
                tools: ['Resilience4j', 'Hystrix', 'Polly'],
                useCases: [
                    'Protecting downstream services: Circuit Breaker',
                    'Handling temporary faults: Retry',
                    'Service protection: Bulkhead',
                ],
            },
            {
                id: 'throttling',
                title: 'Rate Limiting & Throttling',
                icon: Waves,
                tag: 'SECURITY',
                time: '৩০-৪৫ মিনিট',
                level: 'Intermediate',
                type: 'Resource Protection',
                summary:
                    'DDoS protection, fair usage। Token Bucket, Sliding Window algorithms।',
                details:
                    'Implementing global and per-user limits to protect system resources and prevent abuse।',
                tools: ['Redis', 'Kong', 'Cloudflare WAF'],
                useCases: [
                    'DDoS protection: Throttling',
                    'SaaS API limits: Rate Limiting',
                    'Fair resource usage',
                ],
            },
            {
                id: 'service-discovery',
                title: 'Service Discovery & Registry',
                icon: Radar,
                tag: 'MICROSERVICES',
                time: '৪৫-৬০ মিনিট',
                level: 'Intermediate',
                type: 'Service Mesh',
                summary:
                    'Microservices এ services কীভাবে একে অপরকে খুঁজে পায়। Client-side, Server-side discovery।',
                details:
                    'Service registry patterns, health checking, DNS-based vs API-based discovery। Consul, etcd, Eureka তুলনা।',
                tools: ['Consul', 'Eureka', 'etcd', 'Kubernetes DNS'],
                useCases: [
                    'Dynamic service location: Client-side discovery',
                    'Load balancer integration: Server-side discovery',
                    'K8s services: DNS-based',
                ],
            },
            {
                id: 'saga-pattern',
                title: 'Saga Pattern & Distributed Transactions',
                icon: Workflow,
                tag: 'ADVANCED',
                time: '৬০-৯০ মিনিট',
                level: 'Advanced',
                type: 'Transaction Management',
                summary:
                    'Distributed transaction সমস্যার সমাধান, Choreography vs Orchestration Saga।',
                details:
                    'Long-running transactions across services, compensating transactions, and eventual consistency patterns।',
                tools: ['Kafka', 'Temporal', 'Axon Framework'],
                useCases: [
                    'Order processing: Choreography Saga',
                    'Complex workflows: Orchestration Saga',
                    'Financial transactions: Compensating actions',
                ],
            },
        ],
    },
    {
        id: 'phase-4',
        title: 'Real-World Systems',
        subtitle: 'বাস্তব সিস্টেম ডিজাইন',
        duration: '৬-৮ সপ্তাহ',
        topics: [
            {
                id: 'twitter',
                title: 'Design Twitter/X',
                icon: IconBrandX,
                tag: 'INTERVIEW FAV',
                time: '৯০-১২০ মিনিট',
                level: 'Advanced',
                type: 'System Design Case',
                summary:
                    '১০০M+ user, tweets, timeline, notifications: popular interview question।',
                details:
                    'Timeline generation, Fanout models, Celebrity problems, and Real-time notifications architecture।',
                tools: ['Cassandra', 'Redis', 'Kafka'],
                useCases: [
                    'Social media timeline: Fanout',
                    'Celebrity tweets: Hybrid model',
                    'Real-time feeds: WebSocket',
                ],
            },
            {
                id: 'youtube',
                title: 'Design YouTube/Netflix',
                icon: IconBrandYoutube,
                tag: 'INTERVIEW FAV',
                time: '৯০-১২০ মিনিট',
                level: 'Advanced',
                type: 'System Design Case',
                summary:
                    'Video upload, encoding, streaming, CDN: media system এর জটিলতা।',
                details:
                    'Video processing pipelines, Adaptive bitrate streaming (ABR), and global CDN distribution strategies।',
                tools: ['FFmpeg', 'S3', 'CloudFront'],
                useCases: [
                    'Massive video storage: S3',
                    'Global streaming: CDN',
                    'Multi-resolution support: Transcoding',
                ],
            },
            {
                id: 'tinyurl',
                title: 'Design URL Shortener (TinyURL)',
                icon: Link,
                tag: 'BEGINNER',
                time: '৪৫-৬০ মিনিট',
                level: 'Beginner',
                type: 'System Design Case',
                summary:
                    'Simple কিন্তু tricky: hash collision, redirect latency, analytics।',
                details:
                    'Key generation service (KGS), Base62 encoding, and designing for extremely high read traffic।',
                useCases: [
                    'Marketing links: Tracking',
                    'Social sharing: Short links',
                    'Redirect performance',
                ],
            },
            {
                id: 'whatsapp',
                title: 'Design WhatsApp/Chat System',
                icon: IconBrandWhatsapp,
                tag: 'INTERVIEW FAV',
                time: '৬০-৯০ মিনিট',
                level: 'Intermediate',
                type: 'System Design Case',
                summary:
                    'Real-time messaging, message storage, group chat, delivery receipts।',
                details:
                    'WebSocket persistence, Push notifications, Message sequence IDs, and End-to-end encryption architecture।',
                tools: ['Cassandra', 'WebSockets', 'Signal Protocol'],
                useCases: [
                    'Instant messaging: WebSockets',
                    'Group chats: Pub/Sub',
                    'Message history: NoSQL',
                ],
            },
            {
                id: 'amazon',
                title: 'Design Amazon/E-commerce',
                icon: IconBrandAmazon,
                tag: 'COMPLEX',
                time: '৯০-১২০ মিনিট',
                level: 'Advanced',
                type: 'System Design Case',
                summary:
                    'Product catalog, inventory, orders, payment। পুরো e-commerce।',
                details:
                    'Distributed transactions, Inventory management during flash sales, and Search/Recommendation systems।',
                useCases: [
                    'Flash sales: Inventory lock',
                    'Massive catalog: Search',
                    'Order processing: Saga pattern',
                ],
            },
            {
                id: 'search-engine',
                title: 'Design Search Engine (Typeahead)',
                icon: Search,
                tag: 'DATA INTENSIVE',
                time: '৬০-৯০ মিনিট',
                level: 'Advanced',
                type: 'System Design Case',
                summary:
                    'Auto-complete, search ranking, indexing। Google Search এর পেছনে।',
                details:
                    'Trie data structure for suggestions, Crawling, Indexing, and Search ranking algorithms at scale।',
                tools: ['Elasticsearch', 'Redis', 'Trie'],
                useCases: [
                    'Auto-complete: Trie',
                    'Full-text search: Inverted Index',
                    'Global search ranking',
                ],
            },
            {
                id: 'uber',
                title: 'Design Uber/Ride Sharing',
                icon: Car,
                tag: 'INTERVIEW FAV',
                time: '৯০-১২০ মিনিট',
                level: 'Advanced',
                type: 'System Design Case',
                summary:
                    'Real-time location tracking, driver matching, surge pricing: geo-distributed system।',
                details:
                    'Geospatial indexing, Driver-Rider matching algorithms, Real-time tracking with WebSockets, and dynamic pricing।',
                tools: ['Kafka', 'Redis', 'PostGIS'],
                useCases: [
                    'Driver matching: Geohash/QuadTree',
                    'Real-time tracking: WebSocket',
                    'Surge pricing: Dynamic algorithm',
                ],
            },
        ],
    },
    {
        id: 'phase-5',
        title: 'Advanced Topics',
        subtitle: 'Expert Level',
        duration: '৪-৬ সপ্তাহ',
        topics: [
            {
                id: 'security',
                title: 'Security in System Design',
                icon: ShieldAlert,
                tag: 'CRITICAL',
                time: '৬০-৯০ মিনিট',
                level: 'Advanced',
                type: 'System Security',
                summary:
                    'Authentication, Authorization, Encryption, OWASP: secure system design।',
                details:
                    'Zero Trust architecture, JWT/OAuth2, mTLS, Secret management, and DDoS mitigation strategies।',
                tools: ['Vault', 'Keycloak', 'IAM'],
                useCases: [
                    'Internal security: mTLS',
                    'User identity: OAuth2',
                    'Credential safety: Vault',
                ],
            },
            {
                id: 'observability',
                title: 'Observability: Logging, Metrics, Tracing',
                icon: BarChart3,
                tag: 'PRODUCTION',
                time: '৬০-৯০ মিনিট',
                level: 'Advanced',
                type: 'Ops & Monitoring',
                summary:
                    'Distributed system এ কী হচ্ছে বোঝার জন্য, 3 pillars of observability।',
                details:
                    'Centralized logging, Infrastructure/Application metrics, and Distributed request tracing across services।',
                tools: ['Prometheus', 'Grafana', 'Jaeger', 'ELK Stack'],
                useCases: [
                    'Debugging issues: Jaeger Tracing',
                    'Health monitoring: Prometheus/Grafana',
                    'Audit/Analysis: ELK Stack',
                ],
            },
            {
                id: 'cloud-arch',
                title: 'Cloud Architecture & IaC (AWS, Terraform, Serverless)',
                icon: CloudUpload,
                tag: 'MODERN',
                time: '৯০-১২০ মিনিট',
                level: 'Advanced',
                type: 'Cloud Engineering',
                summary:
                    'AWS/GCP/Azure, serverless, Infrastructure as Code: modern deployment।',
                details:
                    'Cloud-native design patterns, Serverless vs Containers, and Automating infrastructure with code।',
                tools: ['Terraform', 'CDK', 'AWS'],
                useCases: [
                    'Automated scaling: Cloud',
                    'Consistent infra: Terraform',
                    'Rapid deployment: Serverless',
                ],
            },
            {
                id: 'cqrs-event-sourcing',
                title: 'CQRS & Event Sourcing',
                icon: Repeat,
                tag: 'ADVANCED',
                time: '৯০-১২০ মিনিট',
                level: 'Expert',
                type: 'Enterprise Patterns',
                summary:
                    'CQRS, Event Sourcing: enterprise pattern for complex domains।',
                details:
                    'Decoupling Read and Write models, Event sourcing for audit trails, and designing complex domain state machines।',
                useCases: [
                    'Financial systems: Event Sourcing',
                    'High-performance reads: CQRS',
                    'Audit trails: Event Store',
                ],
            },
            {
                id: 'deployment-patterns',
                title: 'Deployment Patterns (Blue-Green, Canary, Rolling)',
                icon: RefreshCw,
                tag: 'DEVOPS',
                time: '৪৫-৬০ মিনিট',
                level: 'Intermediate',
                type: 'DevOps Strategy',
                summary:
                    'Zero-downtime deployment strategies and managing release risks।',
                details:
                    'Implementing Blue-Green for safe rollbacks, Canary for risk mitigation, and Rolling updates for scale।',
                tools: ['Kubernetes', 'ArgoCD', 'Spinnaker'],
                useCases: [
                    'Zero downtime updates: Blue-Green',
                    'Testing with live traffic: Canary',
                    'Gradual rollout: Rolling',
                ],
            },
            {
                id: 'advanced-ds',
                title: 'Advanced Data Structures (Bloom Filter, HyperLogLog, Count-Min Sketch)',
                icon: Database,
                tag: 'EXPERT',
                time: '৯০-১২০ মিনিট',
                level: 'Expert',
                type: 'Algorithms at Scale',
                summary:
                    'Probabilistic data structures for massive scale and low memory footprint।',
                details:
                    'Bloom Filters for fast membership testing, HyperLogLog for unique counts, Count-Min Sketch for frequency at massive scale।',
                tools: ['RedisBloom', 'Apache DataSketches'],
                useCases: [
                    'Username availability: Bloom Filter',
                    'Unique daily visitors: HyperLogLog',
                    'Trending topics: Count-Min Sketch',
                ],
            },
        ],
    },
];
