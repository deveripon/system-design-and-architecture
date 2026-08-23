import React from 'react';
/* eslint-disable react/jsx-key */
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

export const dbShardingContent: TopicData = {
    id: 'db-sharding',
    sections: [
        {
            id: 'db-scaling-problem',
            subHeader: { index: '001', title: 'Core Concept' },
            title: (
                <SectionTitle>Database Scaling সমস্যা</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            একটা single database server এ ১ কোটি user এর data
                            রাখা যায়। কিন্তু ১০ কোটি user হলে? Query slow হয়,
                            disk full হয়, single server overload হয়। এই সমস্যা
                            solve করার দুটো প্রধান উপায় হলো{' '}
                            <strong className='text-foreground'>
                                Replication
                            </strong>{' '}
                            এবং{' '}
                            <strong className='text-foreground'>Sharding</strong>
                            ।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'দুটো Concept',
                    content: (
                        <p>
                            <strong>Replication:</strong> Same data কে multiple
                            servers এ copy করা। Read performance বাড়ায়,
                            availability বাড়ায়।
                            <br />
                            <strong>
                                Sharding (Horizontal Partitioning):
                            </strong>{' '}
                            Data কে multiple servers এ ভাগ করে রাখা। প্রতিটা
                            shard শুধু data এর একটা অংশ রাখে। Storage এবং write
                            performance বাড়ায়।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'replication',
            subHeader: { index: '002', title: 'Replication' },
            title: (
                <SectionTitle>Database Replication</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Replication মানে same data multiple servers এ রাখা।
                            Primary (Master) server এ write হয়, Replica (Slave)
                            servers এ copy propagate হয়।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-card border border-border rounded-lg p-6 my-4 overflow-x-auto'>
                            <svg
                                width='620'
                                height='160'
                                viewBox='0 0 620 160'
                                className='max-w-full'
                            >
                                <rect
                                    x='10'
                                    y='50'
                                    width='100'
                                    height='60'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#cc6b45'
                                />
                                <text
                                    x='60'
                                    y='76'
                                    fill='#cc6b45'
                                    fontFamily='monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    App Server
                                </text>
                                <text
                                    x='60'
                                    y='92'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    Reads &amp; Writes
                                </text>
                                <line
                                    x1='110'
                                    y1='70'
                                    x2='185'
                                    y2='80'
                                    stroke='#f97316'
                                    strokeWidth='2'
                                />
                                <text
                                    x='147'
                                    y='65'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='8'
                                >
                                    WRITE
                                </text>
                                <rect
                                    x='185'
                                    y='40'
                                    width='110'
                                    height='60'
                                    rx='4'
                                    fill='rgba(249,115,22,0.1)'
                                    stroke='#f97316'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='240'
                                    y='67'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                    fontWeight='700'
                                >
                                    Primary
                                </text>
                                <text
                                    x='240'
                                    y='82'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    (Master)
                                </text>
                                <text
                                    x='240'
                                    y='96'
                                    fill='#fcd34d'
                                    fontFamily='monospace'
                                    fontSize='7'
                                    textAnchor='middle'
                                >
                                    All writes here
                                </text>
                                <line
                                    x1='295'
                                    y1='65'
                                    x2='370'
                                    y2='40'
                                    stroke='#10b981'
                                    strokeWidth='1'
                                    strokeDasharray='4'
                                />
                                <line
                                    x1='295'
                                    y1='80'
                                    x2='370'
                                    y2='90'
                                    stroke='#10b981'
                                    strokeWidth='1'
                                    strokeDasharray='4'
                                />
                                <line
                                    x1='295'
                                    y1='90'
                                    x2='370'
                                    y2='140'
                                    stroke='#10b981'
                                    strokeWidth='1'
                                    strokeDasharray='4'
                                />
                                <text
                                    x='330'
                                    y='58'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='7'
                                >
                                    async copy
                                </text>
                                <rect
                                    x='370'
                                    y='20'
                                    width='100'
                                    height='34'
                                    rx='3'
                                    fill='transparent'
                                    stroke='#10b981'
                                />
                                <text
                                    x='420'
                                    y='42'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    Replica 1
                                </text>
                                <rect
                                    x='370'
                                    y='72'
                                    width='100'
                                    height='34'
                                    rx='3'
                                    fill='transparent'
                                    stroke='#10b981'
                                />
                                <text
                                    x='420'
                                    y='94'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    Replica 2
                                </text>
                                <rect
                                    x='370'
                                    y='124'
                                    width='100'
                                    height='34'
                                    rx='3'
                                    fill='transparent'
                                    stroke='#10b981'
                                />
                                <text
                                    x='420'
                                    y='146'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    Replica 3
                                </text>
                                <line
                                    x1='110'
                                    y1='90'
                                    x2='370'
                                    y2='89'
                                    stroke='#cc6b45'
                                    strokeWidth='1'
                                    strokeDasharray='3'
                                />
                                <text
                                    x='240'
                                    y='115'
                                    fill='#cc6b45'
                                    fontFamily='monospace'
                                    fontSize='7'
                                    textAnchor='middle'
                                >
                                    READ from replicas
                                </text>
                            </svg>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                            <div className='p-8 border-r border-border bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-emerald-500' />
                                    <span className='text-emerald-700 dark:text-emerald-400'>
                                        Replication সুবিধা
                                    </span>
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Read scaling (replicas থেকে read করুন), High
                                    availability (Primary fail → Replica promote
                                    হয়), Read-heavy apps এর জন্য excellent।
                                </p>
                            </div>
                            <div className='p-8 bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-yellow-500' />
                                    <span className='text-yellow-700 dark:text-yellow-400'>
                                        Replication সীমাবদ্ধতা
                                    </span>
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Replication lag: Primary তে write হওয়ার পর
                                    Replica তে sync হতে সময় লাগে। Write
                                    bottleneck: সব write primary তে যায়।
                                    Storage: সব servers এ same data।
                                </p>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Type', 'কীভাবে কাজ করে', 'Use Case', 'Tradeoff'],
                    rows: [
                        [
                            'Synchronous',
                            'Primary AND all replicas acknowledge করলেন write complete',
                            'Strong consistency needed',
                            <span className='text-red-700 dark:text-red-400'>Slow writes</span>,
                        ],
                        [
                            'Asynchronous',
                            'Primary acknowledge করলেনই write complete, replicas background এ sync',
                            'High write throughput',
                            <span className='text-yellow-700 dark:text-yellow-400'>
                                Possible data lag
                            </span>,
                        ],
                        [
                            'Semi-sync',
                            'কমপক্ষে ১টা replica acknowledge করলেন complete',
                            'Balance between both',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Good compromise
                            </span>,
                        ],
                    ],
                },
            ],
        },
        {
            id: 'sharding',
            subHeader: { index: '003', title: 'Sharding' },
            title: (
                <SectionTitle>Database Sharding</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Sharding মানে data কে multiple database servers এ
                            ভাগ করে রাখা। প্রতিটা server (shard) data এর একটা
                            subset রাখে। ১ কোটি users থাকলে, Shard 1 এ প্রথম ৩৩
                            লাখ, Shard 2 এ পরের ৩৩ লাখ, Shard 3 এ বাকি ৩৪ লাখ।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-card border border-border rounded-lg p-6 my-4 overflow-x-auto'>
                            <svg
                                width='640'
                                height='170'
                                viewBox='0 0 640 170'
                                className='max-w-full'
                            >
                                <rect
                                    x='10'
                                    y='65'
                                    width='100'
                                    height='40'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#cc6b45'
                                />
                                <text
                                    x='60'
                                    y='85'
                                    fill='#cc6b45'
                                    fontFamily='monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    App Server
                                </text>
                                <line
                                    x1='110'
                                    y1='85'
                                    x2='180'
                                    y2='85'
                                    stroke='#cc6b45'
                                    strokeWidth='1.5'
                                />
                                <rect
                                    x='180'
                                    y='50'
                                    width='110'
                                    height='70'
                                    rx='4'
                                    fill='rgba(234,179,8,0.08)'
                                    stroke='#eab308'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='235'
                                    y='78'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                    fontWeight='700'
                                >
                                    Shard Router
                                </text>
                                <text
                                    x='235'
                                    y='94'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    &quot;Which shard
                                </text>
                                <text
                                    x='235'
                                    y='108'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    for user_id=500?&quot;
                                </text>
                                <line
                                    x1='290'
                                    y1='70'
                                    x2='380'
                                    y2='30'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <line
                                    x1='290'
                                    y1='85'
                                    x2='380'
                                    y2='85'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <line
                                    x1='290'
                                    y1='100'
                                    x2='380'
                                    y2='140'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <rect
                                    x='380'
                                    y='8'
                                    width='150'
                                    height='46'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#10b981'
                                />
                                <text
                                    x='455'
                                    y='28'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    Shard 1
                                </text>
                                <text
                                    x='455'
                                    y='44'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    user_id: 1 → 3,333,333
                                </text>
                                <rect
                                    x='380'
                                    y='62'
                                    width='150'
                                    height='46'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#10b981'
                                />
                                <text
                                    x='455'
                                    y='82'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    Shard 2
                                </text>
                                <text
                                    x='455'
                                    y='98'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'
                                    textAnchor='middle'
                                >
                                    user_id: 3,333,334 → 6,666,666
                                </text>
                                <rect
                                    x='380'
                                    y='116'
                                    width='150'
                                    height='46'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#10b981'
                                />
                                <text
                                    x='455'
                                    y='136'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    Shard 3
                                </text>
                                <text
                                    x='455'
                                    y='152'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'
                                    textAnchor='middle'
                                >
                                    user_id: 6,666,667 → 10,000,000
                                </text>
                            </svg>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'strategies',
            subHeader: { index: '004', title: 'Shard Strategies' },
            title: (
                <SectionTitle>Sharding Strategies</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-6'>
                                1. Range-based Sharding
                            </h3>
                            <ContentParagraph>
                                Data কে value range অনুযায়ী ভাগ করা। সহজ কিন্তু
                                hotspot হতে পারে (নতুন users সবাই একই shard এ
                                যায়)।
                            </ContentParagraph>
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: 'Range Sharding Problem',
                    content: (
                        <p>
                            user_id 1-1M → Shard 1, 1M-2M → Shard 2। কিন্তু
                            নতুন users সবসময় Shard 2 এ যাবেন। Shard 1 idle, Shard
                            2 overloaded — uneven distribution।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-6 mt-10'>
                                2. Hash-based Sharding
                            </h3>
                            <ContentParagraph>
                                Shard key hash করে shard select করা। Even
                                distribution দেয়। সবচেয়ে popular।
                            </ContentParagraph>
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'hash_sharding.py',
                    code: `import hashlib

def get_shard(user_id: int, num_shards: int = 3) -> int:
    # user_id hash করে shard number বের করুন
    hash_val = int(hashlib.md5(str(user_id).encode()).hexdigest(), 16)
    return hash_val % num_shards

# Consistent Hashing — shard add/remove এ data movement কমায়
import bisect

class ConsistentHashRing:
    def __init__(self, replicas=100):
        self.replicas = replicas
        self.ring = {}
        self.sorted_keys = []

    def add_shard(self, shard_name):
        for i in range(self.replicas):
            key = hash(f"{shard_name}:{i}")
            self.ring[key] = shard_name
            bisect.insort(self.sorted_keys, key)

    def get_shard(self, key):
        if not self.ring: return None
        h = hash(key)
        idx = bisect.bisect(self.sorted_keys, h) % len(self.sorted_keys)
        return self.ring[self.sorted_keys[idx]]

ring = ConsistentHashRing()
ring.add_shard("shard-1")
ring.add_shard("shard-2")
ring.add_shard("shard-3")

print(ring.get_shard("user:12345"))   # → shard-2
print(ring.get_shard("user:67890"))   # → shard-1`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-6 mt-10'>
                                3. Directory-based Sharding
                            </h3>
                            <ContentParagraph>
                                একটা lookup table রাখা হয় — কোন key কোন shard
                                এ আছে। Flexible কিন্তু lookup table নিজেই
                                bottleneck হতে পারে।
                            </ContentParagraph>
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Strategy',
                        'Distribution',
                        'Resharding',
                        'Query',
                        'Best For',
                    ],
                    rows: [
                        [
                            'Range',
                            <span className='text-red-700 dark:text-red-400'>
                                Uneven (hotspot)
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Easy
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Range queries easy
                            </span>,
                            'Time-series data',
                        ],
                        [
                            'Hash',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Even
                            </span>,
                            <span className='text-red-700 dark:text-red-400'>
                                Hard (data moves)
                            </span>,
                            <span className='text-red-700 dark:text-red-400'>
                                Range queries hard
                            </span>,
                            'User data, general',
                        ],
                        [
                            'Consistent Hash',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Even
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Minimal movement
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>OK</span>,
                            'Dynamic scaling',
                        ],
                        [
                            'Directory',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Flexible
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Easy
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>
                                Lookup overhead
                            </span>,
                            'Custom rules',
                        ],
                    ],
                },
            ],
        },
        {
            id: 'sharding-problems',
            subHeader: { index: '005', title: 'Common Problems' },
            title: (
                <SectionTitle>Sharding এর সমস্যা</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: 'Cross-Shard Queries',
                    content: (
                        <p>
                            &quot;সব users যাদের age &gt; 25 দেখাও&quot; — এটা
                            সব shards এ query করতে হবে এবং results merge করতে
                            হবে। এটা complex এবং slow। Shard key দিয়ে query
                            হলে সহজ, cross-shard হলে কঠিন।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: 'Cross-Shard Transactions',
                    content: (
                        <p>
                            User A Shard 1 এ, User B Shard 2 এ। A থেকে B তে
                            money transfer — এটা distributed transaction।
                            Two-Phase Commit লাগে। Complex, slow, আর potential
                            deadlock।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: 'Resharding Problem',
                    content: (
                        <p>
                            ৩টা shard থেকে ৪টা shard এ move করলেন data
                            redistribute করতে হবে। Application downtime
                            possible। Consistent hashing এই pain কমায়।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'Best Practice',
                    content: (
                        <p>
                            Shard key choose করা সবচেয়ে important decision।
                            User-based query pattern analyze করুন। user_id
                            সাধারণত good shard key — queries mostly per-user।
                            Avoid sharding by যে field এ cross-shard query বেশি
                            হবে।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'code-examples',
            subHeader: { index: '006', title: 'Code Examples' },
            title: (
                <SectionTitle>Code Examples</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-6'>
                            Node.js — Read/Write Splitting
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'db_routing.js',
                    code: `const { Pool } = require('pg');

// Primary (write) database
const primary = new Pool({ connectionString: process.env.DB_PRIMARY_URL });

// Read replicas — multiple
const replicas = [
  new Pool({ connectionString: process.env.DB_REPLICA1_URL }),
  new Pool({ connectionString: process.env.DB_REPLICA2_URL }),
];
let replicaIndex = 0;

// Round-robin replica selection
function getReadPool() {
  const pool = replicas[replicaIndex % replicas.length];
  replicaIndex++;
  return pool;
}

// Use primary for writes
async function writeQuery(sql, params) {
  console.log('✍️ Writing to PRIMARY');
  return primary.query(sql, params);
}

// Use replica for reads
async function readQuery(sql, params) {
  console.log('📖 Reading from REPLICA');
  return getReadPool().query(sql, params);
}

// Usage
await writeQuery('INSERT INTO users...', [name, email]);
await readQuery('SELECT * FROM users WHERE id=$1', [userId]);`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-6 mt-10'>
                            Python — Shard Router
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'shard_router.py',
                    code: `import psycopg2

SHARD_CONFIGS = {
    0: {'host': 'shard0.db.com', 'dbname': 'users_0'},
    1: {'host': 'shard1.db.com', 'dbname': 'users_1'},
    2: {'host': 'shard2.db.com', 'dbname': 'users_2'},
}

def get_connection(user_id: int):
    shard_num = user_id % len(SHARD_CONFIGS)
    config = SHARD_CONFIGS[shard_num]
    print(f"User {user_id} → Shard {shard_num}")
    return psycopg2.connect(**config)

def get_user(user_id: int):
    with get_connection(user_id) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE id=%s", (user_id,))
            return cur.fetchone()

print(get_user(12345))   # User 12345 → Shard 0 (12345 % 3 = 0)
print(get_user(12346))   # User 12346 → Shard 1 (12346 % 3 = 1)`,
                },
            ],
        },
        {
            id: 'interview-prep',
            subHeader: { index: '007', title: 'Interview Prep' },
            title: (
                <SectionTitle>
                    Common Interview Questions
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q1: Sharding vs Replication পার্থক্য?',
                    content: (
                        <p>
                            <strong>উত্তর:</strong> Replication = same data,
                            multiple servers (read scaling, availability)।
                            Sharding = different data, multiple servers (write
                            scaling, storage scaling)। Real systems এ দুটো
                            একসাথে use হয়: প্রতিটা shard এর নিজস্ব replica
                            থাকে।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q2: Consistent Hashing কীভাবে কাজ করে?',
                    content: (
                        <p>
                            <strong>উত্তর:</strong> Regular hash (user_id %
                            n_shards) এ n বাড়লে প্রায় সব keys এর shard বদলায়
                            — massive data movement। Consistent hashing এ n
                            বাড়লে শুধু k/n keys move হয় (k = total keys, n =
                            shards)। Virtual nodes দিয়ে even distribution।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q3: Shard key কীভাবে select করবেন?',
                    content: (
                        <p>
                            <strong>উত্তর:</strong> Good shard key: High
                            cardinality (unique values অনেক), Even distribution,
                            Queries mostly এই key এ, Cross-shard queries কম।
                            Bad shard key: Gender (only 2 values → hotspot),
                            Created_at (new data all in same shard)। user_id
                            সাধারণত excellent shard key।
                        </p>
                    ),
                },
            ],
        },
    ],
    summary: {
        headers: ['Concept', 'এক লাইনে'],
        rows: [
            [
                <span className='font-bold text-primary'>Replication</span>,
                'Same data, multiple servers — read scaling + availability',
            ],
            [
                <span className='font-bold text-primary'>Sharding</span>,
                'Different data, multiple servers — write/storage scaling',
            ],
            [
                <span className='font-bold text-primary'>Hash Sharding</span>,
                'Even distribution, good for user data',
            ],
            [
                <span className='font-bold text-primary'>Range Sharding</span>,
                'Range queries সহজ, hotspot ঝুঁকি আছে',
            ],
            [
                <span className='font-bold text-primary'>
                    Consistent Hashing
                </span>,
                'New shard add এ minimal data movement',
            ],
            [
                <span className='font-bold text-primary'>
                    Read/Write Split
                </span>,
                'Write → Primary, Read → Replica',
            ],
            [
                <span className='font-bold text-primary'>
                    Cross-shard Problem
                </span>,
                'Sharding এর সবচেয়ে বড় challenge',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'Database Replication এর primary সুবিধা কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Write performance বাড়ায়',
                        isCorrect: false,
                        explanation:
                            'Replication write performance বাড়ায় না — সব writes primary তেই যায়।',
                    },
                    {
                        key: 'B',
                        text: 'Read performance বাড়ায় এবং availability improve করে',
                        isCorrect: true,
                        explanation:
                            'Replication এ same data multiple servers এ থাকে। Reads distribute হয় replicas এ → faster read। Primary fail হলে replica promote হয় → high availability।',
                    },
                    {
                        key: 'C',
                        text: 'Storage কমায়',
                        isCorrect: false,
                        explanation:
                            'Replication এ same data copies করা হয় তাই storage বাড়ে, কমে না।',
                    },
                    {
                        key: 'D',
                        text: 'Query complexity কমায়',
                        isCorrect: false,
                        explanation:
                            'Replication query complexity কমায় না, এটা data availability নিয়ে কাজ করে।',
                    },
                ],
            },
            {
                id: 2,
                text: 'Sharding এর সাথে Replication এর পার্থক্য কী?',
                options: [
                    {
                        key: 'A',
                        text: 'একই জিনিস, শুধু নাম আলাদা',
                        isCorrect: false,
                        explanation:
                            'এগুলো সম্পূর্ণ আলাদা concept — একটা copy করে, অন্যটা partition করে।',
                    },
                    {
                        key: 'B',
                        text: 'Replication faster, Sharding slower',
                        isCorrect: false,
                        explanation:
                            'Speed comparison এভাবে সঠিক না — দুটো আলাদা উদ্দেশ্যে কাজ করে।',
                    },
                    {
                        key: 'C',
                        text: 'Replication = same data multiple servers; Sharding = different data split across servers',
                        isCorrect: true,
                        explanation:
                            'Core difference: Replication copies, Sharding partitions। Real systems এ usually দুটোই একসাথে — প্রতিটা shard replicated।',
                    },
                    {
                        key: 'D',
                        text: 'Sharding শুধু NoSQL এ হয়',
                        isCorrect: false,
                        explanation:
                            'Sharding SQL এবং NoSQL উভয় databases এ করা যায়।',
                    },
                ],
            },
            {
                id: 3,
                text: 'Hash-based sharding এর সবচেয়ে বড় সুবিধা কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Even data distribution — hotspot এর ঝুঁকি কম',
                        isCorrect: true,
                        explanation:
                            'Hash function consistent random-looking values দেয়, তাই data evenly distribute হয়। Range sharding এর মতো hotspot (একটা shard এ বেশি load) হয় না।',
                    },
                    {
                        key: 'B',
                        text: 'Range queries সহজ',
                        isCorrect: false,
                        explanation:
                            'Hash sharding এ range queries কঠিন — এটা range sharding এর সুবিধা।',
                    },
                    {
                        key: 'C',
                        text: 'Resharding করা সহজ',
                        isCorrect: false,
                        explanation:
                            'Hash sharding এ resharding কঠিন কারণ প্রায় সব data move করতে হয়।',
                    },
                    {
                        key: 'D',
                        text: 'Setup করা সহজ',
                        isCorrect: false,
                        explanation:
                            'Hash sharding এ setup মোটামুটি, কিন্তু এটা এর প্রধান সুবিধা না।',
                    },
                ],
            },
            {
                id: 4,
                text: 'Replication Lag কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Database slow হয়ে যানয়া',
                        isCorrect: false,
                        explanation:
                            'Database slow হওয়া আলাদা সমস্যা, replication lag নয়।',
                    },
                    {
                        key: 'B',
                        text: 'Primary server slow query',
                        isCorrect: false,
                        explanation: 'Slow query আলাদা সমস্যা।',
                    },
                    {
                        key: 'C',
                        text: 'Network latency',
                        isCorrect: false,
                        explanation:
                            'Network latency এর সাথে সম্পর্কিত হলেও replication lag আলাদা concept।',
                    },
                    {
                        key: 'D',
                        text: 'Primary তে write হওয়ার পর Replica তে sync হতে delay',
                        isCorrect: true,
                        explanation:
                            'Async replication এ Primary তে data লেখার পর Replica তে propagate হতে কিছু সময় লাগে। এই সময়ে replica থেকে read করলেন stale data পানয়া যেতে পারে।',
                    },
                ],
            },
            {
                id: 5,
                text: 'একটা social media app এ posts table sharding করতে কোন shard key সবচেয়ে ভালো?',
                options: [
                    {
                        key: 'A',
                        text: 'post_category (sports, news, etc.)',
                        isCorrect: false,
                        explanation:
                            'post_category তে low cardinality — hotspot হবে।',
                    },
                    {
                        key: 'B',
                        text: 'user_id (post owner)',
                        isCorrect: true,
                        explanation:
                            'user_id ভালো shard key কারণ: High cardinality, queries mostly "show me my posts" (same user_id), Even distribution possible। post_date এ নতুন posts সব same shard এ যাবেন।',
                    },
                    {
                        key: 'C',
                        text: 'post_date',
                        isCorrect: false,
                        explanation:
                            'post_date দিয়ে shard করলেন নতুন posts সব একই shard এ যাবেন — hotspot।',
                    },
                    {
                        key: 'D',
                        text: 'likes_count',
                        isCorrect: false,
                        explanation:
                            'likes_count dynamic value, shard key হিসেবে ভালো না।',
                    },
                ],
            },
            {
                id: 6,
                text: 'Consistent Hashing কোন সমস্যা solve করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Database slow query',
                        isCorrect: false,
                        explanation:
                            'Consistent Hashing slow query solve করে না।',
                    },
                    {
                        key: 'B',
                        text: 'Replication lag',
                        isCorrect: false,
                        explanation:
                            'Consistent Hashing replication lag এর সাথে সম্পর্কিত না।',
                    },
                    {
                        key: 'C',
                        text: 'নতুন shard add করলেন minimal data movement — regular hash এ সব data move করতে হয়',
                        isCorrect: true,
                        explanation:
                            'Regular hash (key % n) এ n বাড়লে প্রায় সব keys এর mapping বদলায়। Consistent hashing এ শুধু k/n portion এর data move হয়। Amazon DynamoDB, Cassandra এটা use করে।',
                    },
                    {
                        key: 'D',
                        text: 'Cross-shard queries',
                        isCorrect: false,
                        explanation:
                            'Consistent Hashing cross-shard queries solve করে না।',
                    },
                ],
            },
            {
                id: 7,
                text: 'Read/Write Splitting কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Writes primary তে, Reads replicas থেকে — load distribute করে',
                        isCorrect: true,
                        explanation:
                            'Read/Write Splitting: Write operations → Primary DB। Read operations → Replica DB। এতে Primary এর load কমে, Read throughput বাড়ে। বেশিরভাগ apps এ reads >> writes।',
                    },
                    {
                        key: 'B',
                        text: 'Read এবং write আলাদা database এ রাখা',
                        isCorrect: false,
                        explanation:
                            'Replication এ same database, শুধু roles আলাদা।',
                    },
                    {
                        key: 'C',
                        text: 'Database backup strategy',
                        isCorrect: false,
                        explanation:
                            'Read/Write Splitting backup strategy নয়।',
                    },
                    {
                        key: 'D',
                        text: 'Sharding strategy',
                        isCorrect: false,
                        explanation: 'এটা replication এর pattern, sharding নয়।',
                    },
                ],
            },
            {
                id: 8,
                text: 'Sharding এর সবচেয়ে বড় challenge কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Initial setup কঠিন',
                        isCorrect: false,
                        explanation:
                            'Setup কঠিন হলেও এটা সবচেয়ে বড় ongoing challenge নয়।',
                    },
                    {
                        key: 'B',
                        text: 'Storage cost বেশি',
                        isCorrect: false,
                        explanation:
                            'Storage cost বাড়ে কিন্তু এটা সবচেয়ে বড় challenge না।',
                    },
                    {
                        key: 'C',
                        text: 'Performance কমে',
                        isCorrect: false,
                        explanation:
                            'Sharding সাধারণত performance বাড়ায়, কমায় না।',
                    },
                    {
                        key: 'D',
                        text: 'Cross-shard queries এবং transactions — multiple shards এ query করা complex ও slow',
                        isCorrect: true,
                        explanation:
                            'Cross-shard query মানে সব shards এ query করে merge করতে হয়। Cross-shard transactions এ distributed transactions লাগে (2-Phase Commit) — complex এবং potential deadlock।',
                    },
                ],
            },
            {
                id: 9,
                text: 'কোন situation এ Sharding এর বদলে শুধু Replication যথেষ্ট?',
                options: [
                    {
                        key: 'A',
                        text: '১ billion users আছে',
                        isCorrect: false,
                        explanation:
                            '১ billion users এ storage এবং write bottleneck হবে, replication alone যথেষ্ট না।',
                    },
                    {
                        key: 'B',
                        text: 'App mostly read-heavy, write কম, data একটা server এ fit করে',
                        isCorrect: true,
                        explanation:
                            'Read-heavy app এ replicas থেকে reads distribute করলেনই কাজ হয়। Storage যদি একটা server এ fit করে এবং write bottleneck না থাকে, sharding এর complexity নেওয়ার দরকার নেই।',
                    },
                    {
                        key: 'C',
                        text: 'Write performance বাড়াতে হবে',
                        isCorrect: false,
                        explanation:
                            'Write performance বাড়াতে sharding দরকার — replication শুধু read বাড়ায়।',
                    },
                    {
                        key: 'D',
                        text: 'Storage সমস্যা আছে',
                        isCorrect: false,
                        explanation:
                            'Storage সমস্যার জন্য sharding দরকার, replication আরও বেশি storage নেয়।',
                    },
                ],
            },
            {
                id: 10,
                text: 'Instagram কীভাবে ৫০+ billion photos store করে?',
                options: [
                    {
                        key: 'A',
                        text: 'একটা বড় database server',
                        isCorrect: false,
                        explanation:
                            'একটা server এ এত data সম্ভব না।',
                    },
                    {
                        key: 'B',
                        text: 'শুধু replication',
                        isCorrect: false,
                        explanation:
                            'Replication alone এত বিশাল data handle করতে পারে না।',
                    },
                    {
                        key: 'C',
                        text: 'Sharding + Object Storage (S3-like) + CDN combination',
                        isCorrect: true,
                        explanation:
                            'Photos actual files → Object Storage (S3)। Metadata (user_id, caption, likes) → Sharded PostgreSQL। Photos globally serve করতে → CDN। এটাই modern large-scale storage architecture।',
                    },
                    {
                        key: 'D',
                        text: 'Compression only',
                        isCorrect: false,
                        explanation:
                            'Compression সাহায্য করে কিন্তু এটাই একমাত্র solution না।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'Sharding & Replication Assignment',
        time: '২-৩ ঘণ্টা',
        difficulty: 'Junior Level',
        tasks: [
            <span key='1'>
                <strong>Sharding Strategy Selection:</strong> নিচের scenarios
                এর জন্য shard key এবং strategy choose করুন: (ক) Twitter-like
                app — 500M users, tweets store করবেন (খ) E-commerce — orders
                store করবেন (গ) IoT sensor data — প্রতি second millions of
                readings।
            </span>,
            <span key='2'>
                <strong>Consistent Hashing Simulate:</strong> উপরে দেওয়া
                ConsistentHashRing Python code চালাও। 3টা shard add করুন, 100টা
                random user_id তে কোন shard gets কত% request count করুন। 4th
                shard add করার পর আবার count করুন।
            </span>,
            <span key='3'>
                <strong>Diagram:</strong> একটা Instagram-like app এর complete
                database architecture diagram বানান: User profiles, Posts
                metadata, Comments, Likes — কোনটা কীভাবে sharded? Replicas
                কোথায়?
            </span>,
            <span key='4'>
                <strong>Read/Write Splitting Code:</strong> উপরে দেওয়া Node.js
                Read/Write splitting code extend করুন: 3টা replica add করুন,
                write failure হলে retry করুন, read failure হলে অন্য replica try
                করুন।
            </span>,
            <span key='5'>
                <strong>Research:</strong> Discord কীভাবে trillions of messages
                store করে? তারা Cassandra থেকে ScyllaDB migrate করলো কেন? ৬-৮
                লাইনে।
            </span>,
        ],
        deliverables: [
            <span key='1'>Sharding strategy decisions (৩ scenario)</span>,
            <span key='2'>Consistent hashing distribution analysis</span>,
            <span key='3'>Instagram DB architecture diagram</span>,
            <span key='4'>Extended read/write split code</span>,
            <span key='5'>Discord research summary</span>,
        ],
    },
    practicalLab: {
        title: 'Hands-On Project Task',
        subtitle: 'Shard Router Simulation',
        steps: [
            {
                title: 'ShardRouter class বানান',
                description:
                    '৩টা virtual shard, hash-based routing, add_shard() method।',
            },
            {
                title: 'Distribution test করুন',
                description:
                    '১০,০০০ random user_ids দিয়ে কতটা per shard যাচ্ছে count করুন। Even distribution হচ্ছে?',
            },
            {
                title: '4th shard add করুন',
                description:
                    'Regular hash vs Consistent hash — কতটা data move হলো? Compare করুন।',
            },
            {
                title: 'In-memory storage add করুন',
                description:
                    'প্রতিটা shard এর জন্য Python dict। set_user(), get_user() implement করুন।',
            },
            {
                title: 'Cross-shard query simulate করুন',
                description:
                    '"সব users যাদের age > 25" query সব shards এ run করে results merge করুন।',
            },
        ],
        tip: 'Hash routing practically implement করবেন। Consistent hashing এর power দেখবেন — 4th shard add এ কত কম data move হলো। Cross-shard query এর complexity feel করবেন।',
    },
};
