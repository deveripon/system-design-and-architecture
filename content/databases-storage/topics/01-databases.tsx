import React from 'react';
/* eslint-disable react/jsx-key */
import {
    ACIDDiagram,
    DBReplicationDiagram,
    IndexingDiagram,
} from '../../../components/course/topics/databases/diagrams';
import {
    SectionTitle,
    ContentParagraph,
    FeatureGrid,
    FeatureCard,
    GradientText,
} from '../../../components/course/content-components';
import {
    CONTENT_TYPES,
    INFO_BOX_VARIANTS,
    TopicData,
} from '../../../types/content';

export const databasesContent: TopicData = {
    id: 'databases',
    sections: [
        {
            id: 'concept',
            subHeader: { index: '001', title: 'Why It Matters' },
            title: (
                <SectionTitle>
                    Database কেন এত গুরুত্বপূর্ণ?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                একটা system এর performance এর ৮০% নির্ভর করে
                                database design এর উপর। ভুল database choose
                                করলেন, index না দিলে, বা wrong schema করলেন — ১০০
                                জন user এলেই সব crash করে।
                            </ContentParagraph>
                            <ContentParagraph>
                                Interview এ &quot;Design Instagram&quot; বললে —
                                কোন database? SQL নাকি NoSQL? Photos কোথায়?
                                Follow relationship কীভাবে? Feed কীভাবে fast? —
                                সব database question।{' '}
                                <em className='text-foreground'>
                                    Database choice ই system এর সবচেয়ে critical
                                    decision।
                                </em>
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'DEFINITION',
                    content: (
                        <p>
                            <strong>Database</strong> হলো organized data storage
                            system। শুধু store নয় — efficiently retrieve,
                            update, delete এবং manage করাই database এর কাজ। একই
                            query milliseconds এ return করবেন নাকি seconds এ —
                            সেটা নির্ভর করে database design এর উপর।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'sql-nosql',
            subHeader: { index: '002', title: 'SQL vs NoSQL' },
            title: (
                <SectionTitle>
                    SQL vs NoSQL — সবচেয়ে বড় decision
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <p className='text-muted-foreground leading-relaxed mb-10 text-lg'>
                            প্রতিটি project এর শুরুতে এই decision নিতে হয়। কোনো
                            একটা &quot;সবসময় better&quot; না — use case বুঝে
                            decide করতে হয়।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border mb-12'>
                            <div className='p-8 border-r border-border bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-blue-500' />
                                    📊 SQL — Relational
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Structured data, ACID transactions, complex
                                    JOINs। Fixed schema। Banking, e-commerce
                                    orders, user accounts এর জন্য best।
                                </p>
                            </div>
                            <div className='p-8 bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-emerald-500' />
                                    🌊 NoSQL — Non-Relational
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Flexible schema, horizontal scaling, high
                                    throughput। Social feed, caching, IoT,
                                    product catalog এর জন্য best।
                                </p>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['বিষয়', 'SQL', 'NoSQL'],
                    rows: [
                        [
                            'Schema',
                            'Fixed (ALTER TABLE লাগে)',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-tight'>
                                Flexible
                            </span>,
                        ],
                        [
                            'Scaling',
                            <span className='text-yellow-700 dark:text-yellow-400'>
                                Vertical (harder horizontal)
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-tight'>
                                Horizontal (সহজ)
                            </span>,
                        ],
                        [
                            'ACID',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-tight'>
                                Full ACID support
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>
                                Eventual consistency
                            </span>,
                        ],
                        [
                            'JOIN',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-tight'>
                                Complex JOINs সহজ
                            </span>,
                            <span className='text-red-700 dark:text-red-400 font-bold uppercase tracking-tight'>
                                JOIN কঠিন বা অসম্ভব
                            </span>,
                        ],
                        [
                            'Query Language',
                            'Standard SQL (সব DB তে একই)',
                            'Database-specific API',
                        ],
                        [
                            'Best For',
                            'Banking, Orders, Auth, Reporting',
                            'Feed, Cache, IoT, Search',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mt-16 mb-6'>
                            NoSQL এর ৪টি Type — কোনটা কী কাজে
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Type', 'Database', 'Best For'],
                    rows: [
                        [
                            'Key-Value',
                            'Redis, DynamoDB',
                            'Caching, Sessions, Shopping cart, Rate limiting',
                        ],
                        [
                            'Document',
                            'MongoDB, Firestore',
                            'User profiles, Product catalog, Blog posts',
                        ],
                        [
                            'Column-family',
                            'Cassandra, HBase',
                            'Time-series, IoT sensor data, Analytics',
                        ],
                        [
                            'Graph',
                            'Neo4j, Amazon Neptune',
                            'Social network, Fraud detection, Recommendation',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '🎯 Interview এ এটা বলুন',
                    content: (
                        <p>
                            &quot;আমি SQL দিয়ে শুরু করবো কারণ ACID guarantee
                            এবং mature tooling। Data model unclear বা massive
                            write scale দরকার হলে NoSQL consider করবো। Real
                            production systems এ সাধারণত দুটোই use হয় —
                            Polyglot Persistence।&quot; এটাই industry standard
                            answer।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'acid',
            subHeader: { index: '003', title: 'ACID Properties' },
            title: (
                <SectionTitle>
                    ACID — Transaction এর ৪টি Guarantee
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <p className='text-muted-foreground leading-relaxed mb-10 text-lg'>
                            ACID মানে Atomicity, Consistency, Isolation,
                            Durability। Bank transfer ভাবুন — টাকা একটা account
                            থেকে কাটলে অবশ্যই অন্যটায় যোগ হতে হবে। এই guarantee
                            দেয় ACID।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.CUSTOM,
                    component: <ACIDDiagram />,
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'sql',
                    filename: 'bank-transfer.sql',
                    code: `-- Bank Transfer — ACID transaction এর classic example
BEGIN TRANSACTION;

-- Step 1: Sender থেকে টাকা কাটো
UPDATE accounts SET balance = balance - 5000
WHERE account_id = 101;

-- Step 2: Balance negative হলে সব undo — Atomicity!
IF (SELECT balance FROM accounts WHERE account_id = 101) < 0 THEN
    ROLLBACK;  -- দুটো UPDATE এর কোনোটাই হবে না
    RAISE EXCEPTION 'Insufficient balance';
END IF;

-- Step 3: Receiver এ টাকা যোগ করুন
UPDATE accounts SET balance = balance + 5000
WHERE account_id = 202;

-- Step 4: Audit log রাখুন
INSERT INTO transfer_log (from_id, to_id, amount, created_at)
VALUES (101, 202, 5000, NOW());

COMMIT;  -- সব ঠিক থাকলে permanent save — Durability!`,
                },
            ],
        },
        {
            id: 'indexing',
            subHeader: { index: '004', title: 'Indexing' },
            title: (
                <SectionTitle>
                    Indexing — Database এর Superpower
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <p className='text-muted-foreground leading-relaxed mb-10 text-lg'>
                            Index হলো book এর index page এর মতো। পুরো book না
                            পড়ে সরাসরি page এ যানয়া যায়। Database এ index না
                            থাকলে প্রতিটি query তে পুরো table scan করতে হয় — ১০
                            লক্ষ row এ এটা অনেক slow।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.CUSTOM,
                    component: <IndexingDiagram />,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border mb-12'>
                            <div className='p-8 border-r border-border bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-emerald-500' />
                                    ✅ Index দিন যখন
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    WHERE clause এ frequently query হয়। High
                                    cardinality column (email, phone)। Foreign
                                    key columns। Read-heavy workload।
                                </p>
                            </div>
                            <div className='p-8 bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-red-500' />
                                    ❌ Index এড়াও যখন
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Write-heavy table (INSERT/UPDATE slow হয়)।
                                    ১০০০ row এর কম small table। Low cardinality
                                    (true/false, status)। Rarely queried
                                    columns।
                                </p>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'sql',
                    filename: 'indexing-examples.sql',
                    code: `-- 1. Basic index — single column
CREATE INDEX idx_users_email ON users(email);

-- 2. Composite index — দুটো column একসাথে filter করলেন
--    WHERE email = ? AND created_at > ?
CREATE INDEX idx_users_email_date ON users(email, created_at);

-- 3. Partial index — শুধু active users (ছোট এবং fast)
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';

-- 4. Query plan দেখুন — index use হচ্ছে কি?
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'test@example.com';
-- "Index Scan" → ভালো ✅  |  "Seq Scan" → index নেই ⚠️`,
                },
            ],
        },
        {
            id: 'scaling',
            subHeader: { index: '005', title: 'Database Scaling' },
            title: (
                <SectionTitle>Sharding এবং Replication</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <h3 className='text-xl font-bold mt-8 mb-4'>
                                Read Replica — Read Load কমাও
                            </h3>
                            <ContentParagraph>
                                সব database operation এর ৮০-৯০% হলো READ।
                                Primary database এর copy (Replica) রাখুন — Read
                                requests Replica তে পাঠাও। Primary শুধু Write
                                handle করবেন। এভাবে Primary এর load অনেক কমে।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CUSTOM,
                    component: <DBReplicationDiagram />,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <h3 className='text-xl font-bold mt-12 mb-4'>
                                Sharding — Write Load ভাগ করুন
                            </h3>
                            <ContentParagraph>
                                একটা বড় table কে multiple databases এ ভাগ করা।
                                User ID 1-1M → DB1, 1M-2M → DB2। প্রতিটি shard
                                আলাদাভাবে serve করতে পারে।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Approach', 'কীভাবে কাজ করে', 'কখন ব্যবহার করুন'],
                    rows: [
                        [
                            'Read Replica',
                            'Primary → Replica async sync। Read → Replica',
                            'Read-heavy app (80%+ read)',
                        ],
                        [
                            'Vertical Sharding',
                            'আলাদা table → আলাদা DB (users DB, orders DB)',
                            'Microservices separation',
                        ],
                        [
                            'Horizontal Sharding',
                            'একই table rows ভাগ করে multiple DB তে',
                            'Billions of rows, write scale',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: '⚠️ Sharding এর সমস্যা',
                    content: (
                        <p>
                            Cross-shard JOIN কঠিন — User A Shard 1 এ, User B
                            Shard 3 এ, এদের data JOIN করতে application layer এ
                            করতে হয়। Resharding complex। Hotspot shard হতে
                            পারে। তাই Sharding সবচেয়ে শেষে করুন — আগে Read
                            Replica, Caching, Query optimization দিয়ে দেখুন।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'practical-impl',
            subHeader: { index: '006', title: 'Practical Implementation' },
            title: (
                <SectionTitle>DB Pool & Caching Pattern</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <p className='text-muted-foreground leading-relaxed mb-6 text-lg'>
                            Backend এ database handle করার সময় connection pool
                            এবং caching strategy (Cache-aside) ব্যবহার করা
                            industry standard। Connection বারবার create করা অনেক
                            expensive, তাই pool ব্যবহার করা হয়।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'db-pool-cache.js',
                    code: `const { Pool } = require('pg');
const redis = require('redis');

// Connection Pool — connection বারবার create করা expensive!
const primaryDB = new Pool({ host: 'primary-db', max: 20 });
const replicaDB = new Pool({ host: 'replica-db', max: 40 });
const cache = redis.createClient();

// Cache-aside Pattern — সবচেয়ে common caching strategy
async function getUser(userId) {
  const cacheKey = \`user:\${userId}\`;

  // 1. Cache check করুন
  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);  // Cache HIT ✅

  // 2. Cache miss — Replica থেকে read (Primary এ load দিও না)
  const result = await replicaDB.query(
    'SELECT * FROM users WHERE id = $1', [userId]
  );
  const user = result.rows[0];

  // 3. Cache এ store করুন (TTL: 1 hour)
  await cache.setEx(cacheKey, 3600, JSON.stringify(user));

  return user;
}

// Write — Primary তে
async function updateUser(userId, data) {
  await primaryDB.query('UPDATE users SET name=$1 WHERE id=$2', [data.name, userId]);
  await cache.del(\`user:\${userId}\`);  // Cache invalidate করুন!
}`,
                },
            ],
        },
        {
            id: 'tools',
            subHeader: { index: '007', title: 'Tools Comparison' },
            title: (
                <SectionTitle>
                    Database Tools — কোনটা কখন ব্যবহার করবেন
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Database', 'Type', 'ACID', 'Scale', 'Best For'],
                    rows: [
                        [
                            'PostgreSQL',
                            'SQL',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                ✅ Full
                            </span>,
                            'Vertical + Read Replica',
                            'Complex queries, JSON, GIS',
                        ],
                        [
                            'MySQL',
                            'SQL',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                ✅ Full
                            </span>,
                            'Master-slave replication',
                            'Web apps, E-commerce',
                        ],
                        [
                            'MongoDB',
                            'Document NoSQL',
                            <span className='text-yellow-700 dark:text-yellow-400'>⚠️ Partial</span>,
                            'Horizontal sharding',
                            'Flexible schema, JSON docs',
                        ],
                        [
                            'Redis',
                            'Key-Value NoSQL',
                            <span className='text-red-700 dark:text-red-400'>❌ No</span>,
                            'Cluster mode',
                            'Caching, Sessions, Pub/Sub',
                        ],
                        [
                            'Cassandra',
                            'Column NoSQL',
                            <span className='text-yellow-700 dark:text-yellow-400'>
                                ⚠️ Eventual
                            </span>,
                            'Linear horizontal',
                            'Time-series, IoT, High write',
                        ],
                    ],
                },
            ],
        },
        {
            id: 'real-world',
            subHeader: { index: '008', title: 'Real World Examples' },
            title: (
                <SectionTitle>
                    বড় কোম্পানিগুলো কীভাবে করেছেনে
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-10'>
                            <div>
                                <h3 className='text-xl font-bold mb-4 flex items-center gap-3'>
                                    <span className='text-2xl'>📱</span>{' '}
                                    Instagram এর Database Journey
                                </h3>
                                <p className='text-muted-foreground leading-relaxed'>
                                    Instagram শুরু করেছেনিল PostgreSQL দিয়ে। User
                                    base ১০M থেকে ১B+ হওয়ার সময় PostgreSQL
                                    sharding করে। User ID based consistent
                                    hashing দিয়ে ১০০০+ shards। Photos (media
                                    files) আলাদাভাবে S3 (object storage) তে রাখে
                                    — database তে শুধু metadata। Django ORM এর
                                    উপরে custom sharding layer।
                                </p>
                            </div>

                            <div>
                                <h3 className='text-xl font-bold mb-4 flex items-center gap-3'>
                                    <span className='text-2xl'>🏦</span> bKash /
                                    Banking — ACID Critical
                                </h3>
                                <p className='text-muted-foreground leading-relaxed'>
                                    Financial systems এ SQL database অপরিহার্য।
                                    Transaction isolation level
                                    &quot;SERIALIZABLE&quot; রাখতে হয়।
                                    Double-spending prevent করতে database-level
                                    locks। Audit log সব transactions এর। Strong
                                    consistency mandatory — কোনো eventual
                                    consistency চলবে না।
                                </p>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'Polyglot Persistence',
                    content: (
                        <>
                            Real production systems এ এক ধরনের database দিয়ে সব
                            হয় না। Instagram: PostgreSQL (users/follow) +
                            Cassandra (activity feed) + Redis (session/cache) +
                            S3 (photos)। প্রতিটির আলাদা strength কে কাজে লাগানো
                            হয়। এটাই Polyglot Persistence।
                        </>
                    ),
                },
            ],
        },
    ],
    summary: {
        headers: ['Concept', 'এক লাইনে'],
        rows: [
            [
                <span className='font-bold text-primary'>SQL vs NoSQL</span>,
                'SQL = ACID, structured। NoSQL = flexible, scale। Use case দেখে choose করুন',
            ],
            [
                <span className='font-bold text-primary'>ACID</span>,
                'Atomicity (all/nothing), Consistency, Isolation, Durability',
            ],
            [
                <span className='font-bold text-primary'>Index</span>,
                'B-Tree দিয়ে O(n) → O(log n)। Read fast, Write slow হয়',
            ],
            [
                <span className='font-bold text-primary'>Read Replica</span>,
                'Read → Replica, Write → Primary। Read load কমে',
            ],
            [
                <span className='font-bold text-primary'>Sharding</span>,
                'Table rows ভাগ করুন। Write scale করুন। Cross-shard JOIN কঠিন',
            ],
            [
                <span className='font-bold text-primary'>N+1 Problem</span>,
                'Loop এ query করুন না। JOIN বা eager loading ব্যবহার করুন',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'ACID এ "I" — Isolation মানে কি?',
                options: [
                    { key: 'A', text: 'Index optimization', isCorrect: false },
                    {
                        key: 'B',
                        text: 'Data integrity maintenance',
                        isCorrect: false,
                    },
                    {
                        key: 'C',
                        text: 'Concurrent transactions একে অন্যকে affect করে না',
                        isCorrect: true,
                        explanation:
                            'Isolation মানে প্রতিটি transaction মনে করে সে একা কাজ করছে। Race condition prevent করে।',
                    },
                    { key: 'D', text: 'Data encryption', isCorrect: false },
                ],
            },
            {
                id: 2,
                text: 'Database Index এর internal data structure সাধারণত কোনটি?',
                options: [
                    { key: 'A', text: 'Linked List', isCorrect: false },
                    {
                        key: 'B',
                        text: 'B-Tree (Balanced Tree)',
                        isCorrect: true,
                        explanation:
                            'বেশিরভাগ databases B-Tree বা B+Tree use করে। Balanced tree তে O(log n) search, insert, delete।',
                    },
                    { key: 'C', text: 'Stack', isCorrect: false },
                    { key: 'D', text: 'Array', isCorrect: false },
                ],
            },
        ],
    },
    assignment: {
        title: 'Database Analysis & Strategy',
        time: '৩-৪ ঘণ্টা',
        difficulty: 'Junior Level',
        tasks: [
            <span key='1'>
                <strong>Index Benchmark:</strong> PostgreSQL এ ১ million fake
                user insert করুন। <code>email</code> column এ index ছাড়া এবং
                index সহ query time measure করুন।
            </span>,
            <span key='2'>
                <strong>ACID Transaction:</strong> Node.js দিয়ে একটা Bank
                Transfer system তৈরি করুন। BEGIN/COMMIT/ROLLBACK দিয়ে
                transaction implement করুন।
            </span>,
            <span key='3'>
                <strong>Database Choice:</strong> bKash, Facebook feed, Uber
                driver location, Amazon product catalog — কোনটির জন্য কোন DB
                choose করবেন এবং কেন লিখুন।
            </span>,
        ],
        deliverables: [
            <span key='1'>Index benchmark comparison report</span>,
            <span key='2'>Bank transfer code সহ ACID demonstration</span>,
            <span key='3'>Database choice justification (written)</span>,
        ],
    },
    practicalLab: {
        title: 'Hands-On Database Project',
        subtitle: 'Multi-database E-commerce Backend (Docker)',
        steps: [
            {
                title: 'Docker Setup',
                description:
                    'PostgreSQL, MongoDB, Redis — তিনটা service একসাথে docker-compose up দিয়ে চালাও।',
            },
            {
                title: 'PostgreSQL — Users & Orders',
                description:
                    'ACID transaction দিয়ে order place করুন। Index যোগ করুন।',
            },
            {
                title: 'MongoDB — Products',
                description:
                    'Products collection তৈরি করুন — flexible schema (Phone আলাদা, T-shirt আলাদা)।',
            },
            {
                title: 'Redis — Shopping Cart',
                description: 'HASH দিয়ে cart implement করুন। TTL = 1 hour।',
            },
        ],
        codeBlock: {
            language: 'yaml',
            filename: 'docker-compose.yml',
            code: `version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ecommerce
      POSTGRES_PASSWORD: secret
    ports: ["5432:5432"]

  mongodb:
    image: mongo:6
    ports: ["27017:27017"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]`,
        },
        tip: 'Theoretical না — actually দেখবেন PostgreSQL এ ACID transaction কীভাবে checkout handle করে এবং Redis কেন cart এ better।',
    },
};

