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

export const tinyurlContent: TopicData = {
    id: 'tinyurl',
    sections: [
        {
            id: 'why-url-shortener',
            subHeader: { index: '001', title: 'Why This System' },
            title: (
                <SectionTitle>
                    URL Shortener কেন শিখবো?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-4'>
                            <ContentParagraph>
                                TinyURL, bit.ly — এই সিস্টেমগুলো দেখতে simple মনে হয়, কিন্তু এটা design
                                করতে গেলে অনেক interesting problem আসে। Interview-তে এটা সবচেয়ে common
                                system design question।
                            </ContentParagraph>
                            <ContentParagraph>
                                <strong className='text-foreground'>
                                    https://www.amazon.com/dp/B0893CFLMS/ref=sr_1_1?keywords=...
                                </strong>{' '}
                                এই long URL কে{' '}
                                <strong className='text-foreground'>
                                    https://tinyurl.com/y4dz9b
                                </strong>{' '}
                                বানানো — এই simple কাজের পেছনে অনেক complexity।
                            </ContentParagraph>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mt-6'>
                                {[
                                    { num: '100M', label: 'Daily URL Creations' },
                                    { num: '10B', label: 'Daily Redirects' },
                                    { num: '100:1', label: 'Read/Write Ratio' },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className='bg-muted/30 border border-border rounded-lg p-4 text-center'>
                                        <span className='block font-mono text-2xl font-bold text-primary mb-1'>
                                            {item.num}
                                        </span>
                                        <span className='font-mono text-xs text-muted-foreground uppercase tracking-wider'>
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 Core Problem',
                    content: (
                        <p>
                            একটা long URL নিয়ে একটা unique short code generate করুন। সেই code দিয়ে
                            request আসলে original URL-এ redirect করুন। এটাকে{' '}
                            <strong>URL Redirection Service</strong> বলে।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'requirements',
            subHeader: { index: '002', title: 'Requirements' },
            title: (
                <SectionTitle>কী কী লাগবে?</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='bg-muted/30 border border-border rounded-lg p-5'>
                                <p className='font-mono text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-4 font-bold'>
                                    ✅ Functional Requirements
                                </p>
                                <ul className='space-y-2'>
                                    {[
                                        'Long URL দিলে short URL generate করবেন',
                                        'Short URL click করলেন original URL-এ redirect হবে',
                                        'User custom alias দিতে পারবেন (optional)',
                                        'URL expiration time set করা যাবেন',
                                        'Analytics: কতবার click হলো দেখা যাবেন',
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className='flex items-start gap-2 text-sm text-muted-foreground border-b border-border pb-2 last:border-0 last:pb-0'>
                                            <span className='text-muted-foreground mt-0.5 font-mono text-xs'>→</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className='bg-muted/30 border border-border rounded-lg p-5'>
                                <p className='font-mono text-xs uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-4 font-bold'>
                                    ⚡ Non-Functional Requirements
                                </p>
                                <ul className='space-y-2'>
                                    {[
                                        'High availability — 99.9% uptime',
                                        'Low latency redirect — 100ms এর কম',
                                        'Scalable — 100M+ URLs handle করবেন',
                                        'Short URL predictable না হওয়া (security)',
                                        'Durability — URL কখনো হারাবে না',
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className='flex items-start gap-2 text-sm text-muted-foreground border-b border-border pb-2 last:border-0 last:pb-0'>
                                            <span className='text-muted-foreground mt-0.5 font-mono text-xs'>→</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Interview Tip',
                    content: (
                        <p>
                            Interview-তে সবার আগে Functional vs Non-functional requirements পরিষ্কার করুন।
                            এটা দেখায় যে আপনি problem systematically ভাবুন।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'capacity-estimation',
            subHeader: { index: '003', title: 'Back-of-Envelope Estimation' },
            title: (
                <SectionTitle>Numbers এর হিসাব</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            System design-এ numbers জানা দরকার। এটা না জানলেন সঠিক architecture করা যায় না।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-3 my-4'>
                            {[
                                { num: '100M', label: 'Daily URL Creations' },
                                { num: '10B', label: 'Daily Redirects (reads)' },
                                { num: '100:1', label: 'Read/Write Ratio' },
                                { num: '1,160', label: 'Writes/sec' },
                                { num: '115K', label: 'Reads/sec (redirects)' },
                                { num: '36TB', label: 'Storage/year' },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className='bg-muted/30 border border-border rounded-lg p-4 text-center'>
                                    <span className='block font-mono text-2xl font-bold text-primary mb-1'>
                                        {item.num}
                                    </span>
                                    <span className='font-mono text-[10px] text-muted-foreground uppercase tracking-wider'>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '🔢 Calculation',
                    content: (
                        <div className='space-y-1 text-sm'>
                            <p><strong>Writes:</strong> 100M / 86400 ≈ 1,160 req/sec</p>
                            <p><strong>Reads:</strong> 10B / 86400 ≈ 115,000 req/sec</p>
                            <p><strong>Storage:</strong> প্রতি URL ~500 bytes → 100M × 500B × 365 days ≈ 18TB/year</p>
                            <p><strong>Cache:</strong> Hot URLs top 20% → 20% of 10B reads = 2B → cache these</p>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'high-level-design',
            subHeader: { index: '004', title: 'High Level Architecture' },
            title: (
                <SectionTitle>System এর Big Picture</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            এই system-এ দুটো main flow আছে: (1) URL creation flow এবং (2) URL redirect flow।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6 my-4 overflow-x-auto'>
                            <p className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                URL SHORTENER — SYSTEM ARCHITECTURE
                            </p>
                            <svg
                                width='680'
                                height='340'
                                viewBox='0 0 680 340'
                                className='max-w-full mx-auto'>
                                <defs>
                                    <marker
                                        id='arr-tinyurl'
                                        markerWidth='8'
                                        markerHeight='8'
                                        refX='6'
                                        refY='3'
                                        orient='auto'>
                                        <path d='M0,0 L0,6 L8,3 z' fill='#64748b' />
                                    </marker>
                                    <marker
                                        id='arrO-tinyurl'
                                        markerWidth='8'
                                        markerHeight='8'
                                        refX='6'
                                        refY='3'
                                        orient='auto'>
                                        <path d='M0,0 L0,6 L8,3 z' fill='#f97316' />
                                    </marker>
                                </defs>

                                {/* Client */}
                                <rect x='10' y='140' width='80' height='50' rx='4' fill='transparent' stroke='#334155' strokeWidth='1.5' />
                                <text x='50' y='162' textAnchor='middle' fill='#94a3b8' fontFamily='JetBrains Mono, monospace' fontSize='9'>CLIENT</text>
                                <text x='50' y='178' textAnchor='middle' fill='#64748b' fontFamily='JetBrains Mono, monospace' fontSize='8'>Browser/App</text>

                                {/* Arrow Client to LB */}
                                <path d='M 90 165 L 130 165' stroke='#f97316' strokeWidth='1.5' markerEnd='url(#arrO-tinyurl)' />

                                {/* Load Balancer */}
                                <rect x='130' y='140' width='90' height='50' rx='4' fill='transparent' stroke='#f97316' strokeWidth='1.5' />
                                <text x='175' y='162' textAnchor='middle' fill='#f97316' fontFamily='JetBrains Mono, monospace' fontSize='9'>LOAD</text>
                                <text x='175' y='175' textAnchor='middle' fill='#f97316' fontFamily='JetBrains Mono, monospace' fontSize='9'>BALANCER</text>

                                {/* Arrows LB to API Servers */}
                                <path d='M 220 155 L 280 120' stroke='#64748b' strokeWidth='1.2' markerEnd='url(#arr-tinyurl)' />
                                <path d='M 220 165 L 280 165' stroke='#64748b' strokeWidth='1.2' markerEnd='url(#arr-tinyurl)' />
                                <path d='M 220 175 L 280 210' stroke='#64748b' strokeWidth='1.2' markerEnd='url(#arr-tinyurl)' />

                                {/* API Server 1 */}
                                <rect x='280' y='100' width='100' height='40' rx='4' fill='transparent' stroke='#10b981' strokeWidth='1.2' />
                                <text x='330' y='118' textAnchor='middle' fill='#10b981' fontFamily='JetBrains Mono, monospace' fontSize='9'>API Server 1</text>
                                <text x='330' y='131' textAnchor='middle' fill='#64748b' fontFamily='JetBrains Mono, monospace' fontSize='8'>Go / Python</text>

                                {/* API Server 2 */}
                                <rect x='280' y='145' width='100' height='40' rx='4' fill='transparent' stroke='#10b981' strokeWidth='1.2' />
                                <text x='330' y='163' textAnchor='middle' fill='#10b981' fontFamily='JetBrains Mono, monospace' fontSize='9'>API Server 2</text>
                                <text x='330' y='176' textAnchor='middle' fill='#64748b' fontFamily='JetBrains Mono, monospace' fontSize='8'>Go / Python</text>

                                {/* API Server 3 */}
                                <rect x='280' y='190' width='100' height='40' rx='4' fill='transparent' stroke='#10b981' strokeWidth='1.2' />
                                <text x='330' y='208' textAnchor='middle' fill='#10b981' fontFamily='JetBrains Mono, monospace' fontSize='9'>API Server 3</text>
                                <text x='330' y='221' textAnchor='middle' fill='#64748b' fontFamily='JetBrains Mono, monospace' fontSize='8'>Go / Python</text>

                                {/* Arrows API to Cache */}
                                <path d='M 380 120 L 430 100' stroke='#64748b' strokeWidth='1.2' markerEnd='url(#arr-tinyurl)' />
                                <path d='M 380 165 L 430 100' stroke='#64748b' strokeWidth='1.2' markerEnd='url(#arr-tinyurl)' />
                                <path d='M 380 210 L 430 100' stroke='#64748b' strokeWidth='1.2' markerEnd='url(#arr-tinyurl)' />

                                {/* Cache */}
                                <rect x='430' y='70' width='100' height='50' rx='4' fill='transparent' stroke='#eab308' strokeWidth='1.5' />
                                <text x='480' y='90' textAnchor='middle' fill='#eab308' fontFamily='JetBrains Mono, monospace' fontSize='9'>CACHE</text>
                                <text x='480' y='105' textAnchor='middle' fill='#64748b' fontFamily='JetBrains Mono, monospace' fontSize='8'>Redis Cluster</text>

                                {/* Arrow API to DB */}
                                <path d='M 380 165 L 430 220' stroke='#64748b' strokeWidth='1.2' markerEnd='url(#arr-tinyurl)' />

                                {/* Database */}
                                <rect x='430' y='200' width='100' height='50' rx='4' fill='transparent' stroke='#cc6b45' strokeWidth='1.5' />
                                <text x='480' y='222' textAnchor='middle' fill='#cc6b45' fontFamily='JetBrains Mono, monospace' fontSize='9'>DATABASE</text>
                                <text x='480' y='238' textAnchor='middle' fill='#64748b' fontFamily='JetBrains Mono, monospace' fontSize='8'>MySQL/Cassandra</text>

                                {/* Arrow DB to Replica */}
                                <path d='M 530 225 L 570 225' stroke='#64748b' strokeWidth='1.2' markerEnd='url(#arr-tinyurl)' />

                                {/* DB Replica */}
                                <rect x='570' y='200' width='100' height='50' rx='4' fill='transparent' stroke='#475569' strokeWidth='1.2' />
                                <text x='620' y='222' textAnchor='middle' fill='#64748b' fontFamily='JetBrains Mono, monospace' fontSize='9'>DB REPLICA</text>
                                <text x='620' y='238' textAnchor='middle' fill='#475569' fontFamily='JetBrains Mono, monospace' fontSize='8'>Read Replicas</text>

                                {/* Analytics Service */}
                                <rect x='430' y='290' width='100' height='40' rx='4' fill='transparent' stroke='#8b5cf6' strokeWidth='1.2' />
                                <text x='480' y='308' textAnchor='middle' fill='#8b5cf6' fontFamily='JetBrains Mono, monospace' fontSize='9'>ANALYTICS</text>
                                <text x='480' y='322' textAnchor='middle' fill='#64748b' fontFamily='JetBrains Mono, monospace' fontSize='8'>Kafka + ClickHouse</text>

                                {/* Legend */}
                                <text x='10' y='300' fill='#64748b' fontFamily='JetBrains Mono, monospace' fontSize='9'>● CREATE flow: Client → LB → API → DB (write)</text>
                                <text x='10' y='318' fill='#64748b' fontFamily='JetBrains Mono, monospace' fontSize='9'>● REDIRECT flow: Client → LB → API → Cache → DB (read)</text>
                            </svg>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
                            <div className='bg-muted/30 border border-border rounded-lg p-5'>
                                <p className='font-mono text-xs uppercase tracking-widest text-primary mb-3 font-bold'>
                                    📝 URL Creation Flow
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                    User long URL পাঠায় → API Server short code generate করে → Database-এ
                                    save করে → Short URL return করে।
                                </p>
                            </div>
                            <div className='bg-muted/30 border border-border rounded-lg p-5'>
                                <p className='font-mono text-xs uppercase tracking-widest text-primary mb-3 font-bold'>
                                    🔀 Redirect Flow
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                    User short URL click করে → API Server cache check করে → Cache miss হলে
                                    DB থেকে নেয় → 301/302 redirect পাঠায়।
                                </p>
                            </div>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'key-generation',
            subHeader: { index: '005', title: 'Deep Dive' },
            title: (
                <SectionTitle>Core Components বিস্তারিত</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-3'>
                            <h3 className='text-lg font-bold text-foreground'>
                                🔑 Short Code Generation Algorithm
                            </h3>
                            <p className='text-muted-foreground leading-relaxed'>
                                এটাই সবচেয়ে interesting part। Long URL → 6-7 character short code কীভাবে বানাবো?
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Approach', 'কীভাবে কাজ করে', 'Problem', 'Production Use?'],
                    rows: [
                        [
                            'Random String',
                            '6 random chars generate করুন',
                            'Collision check দরকার, DB round trip',
                            <span className='text-yellow-700 dark:text-yellow-400 font-medium'>মাঝামাঝি</span>,
                        ],
                        [
                            'MD5/SHA256 Hash',
                            'URL hash করুন, first 7 chars নাও',
                            'Collision possible, predictable',
                            <span className='text-red-700 dark:text-red-400'>সাধারণত না</span>,
                        ],
                        [
                            'Base62 Encoding',
                            'Auto-increment ID → Base62 convert',
                            'Sequential, predictable',
                            <span className='text-yellow-700 dark:text-yellow-400 font-medium'>কখনো কখনো</span>,
                        ],
                        [
                            'Snowflake ID + Base62',
                            'Distributed unique ID → Base62',
                            'Slightly complex setup',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>✓ Best Practice</span>,
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '💡 Base62 কী?',
                    content: (
                        <p>
                            Base62 = 0-9 (10) + a-z (26) + A-Z (26) = 62 characters। 7 characters দিয়ে
                            62⁷ = 3.5 trillion unique URLs possible। TinyURL এবং bit.ly এই approach use করে।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'url_generator.py',
                    code: `# Base62 encoding for URL shortening
BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

def encode_base62(num: int) -> str:
    """Auto-increment ID কে Base62 string এ convert করুন"""
    if num == 0:
        return BASE62[0]
    result = ""
    while num > 0:
        result = BASE62[num % 62] + result
        num //= 62
    return result.zfill(7)  # always 7 chars

# Example: ID 125 → "0000020", ID 3521614606208 → "abcdefg"
def create_short_url(long_url: str, db, cache) -> str:
    # 1. DB-তে save করুন, auto-increment ID পান
    url_id = db.insert({"long_url": long_url, "created_at": now()})

    # 2. ID কে Base62 encode করুন
    short_code = encode_base62(url_id)

    # 3. DB update করুন short_code দিয়ে
    db.update(url_id, {"short_code": short_code})

    # 4. Cache-এ রাখুন future reads এর জন্য
    cache.set(short_code, long_url, ttl=86400)

    return f"https://tinyurl.com/{short_code}"`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-lg font-bold text-foreground mt-4'>
                            🔀 301 vs 302 Redirect — গুরুত্বপূর্ণ Trade-off
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Type', 'Meaning', 'Browser Cache?', 'Analytics?', 'Use Case'],
                    rows: [
                        [
                            '301 Permanent',
                            'URL চিরতরে move হয়েছে',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>হ্যাঁ, cache করে</span>,
                            <span className='text-red-700 dark:text-red-400'>কম accurate</span>,
                            'Server load কমাতে',
                        ],
                        [
                            '302 Temporary',
                            'এই moment এ redirect',
                            <span className='text-red-700 dark:text-red-400'>না করে</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>Accurate tracking</span>,
                            'Analytics দরকার হলে',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: '⚠️ Decision',
                    content: (
                        <p>
                            Analytics চাইলে <strong>302</strong> use করুন — প্রতিটা click track হবে।
                            Server load কমাতে চাইলে <strong>301</strong> — browser cache করে রাখবে।
                            TinyURL analytics offer করে তাই 302।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'database-schema',
            subHeader: { index: '006', title: 'Database Choice' },
            title: (
                <SectionTitle>কোন Database, কেন?</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Database', 'Pros', 'Cons', 'Fit?'],
                    rows: [
                        [
                            'MySQL (SQL)',
                            'ACID, familiar, strong consistency',
                            'Scaling কঠিন, single point',
                            <span className='text-yellow-700 dark:text-yellow-400'>Okay for small</span>,
                        ],
                        [
                            'PostgreSQL',
                            'ACID, better performance',
                            'Horizontal scaling কঠিন',
                            <span className='text-yellow-700 dark:text-yellow-400'>Medium scale</span>,
                        ],
                        [
                            'Cassandra (NoSQL)',
                            'Massive scale, fault tolerant',
                            'No ACID, complex queries কঠিন',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>✓ Large scale</span>,
                        ],
                        [
                            'DynamoDB',
                            'Managed, auto-scale, low latency',
                            'Expensive, vendor lock-in',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>✓ AWS setup</span>,
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-lg font-bold text-foreground mt-2 mb-1'>
                            Schema Design
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'sql',
                    filename: 'schema.sql',
                    code: `CREATE TABLE urls (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  short_code   VARCHAR(10) UNIQUE NOT NULL,
  long_url     TEXT NOT NULL,
  user_id      BIGINT,           -- who created it
  created_at   TIMESTAMP DEFAULT NOW(),
  expires_at   TIMESTAMP,        -- NULL = never expires
  click_count  BIGINT DEFAULT 0
);

-- short_code এ index — সবচেয়ে বেশি query এখানে
CREATE INDEX idx_short_code ON urls (short_code);

-- Analytics table (separate)
CREATE TABLE url_clicks (
  id         BIGINT PRIMARY KEY,
  short_code VARCHAR(10),
  clicked_at TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT
);`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Cache Strategy',
                    content: (
                        <p>
                            <strong>Redis</strong> use করুন hot URLs cache করতে। Top 20% URLs = 80%
                            traffic (Pareto principle)। Redis এ TTL set করুন, LRU eviction policy।
                            Cache hit rate 80%+ হওয়া উচিত।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'scaling',
            subHeader: { index: '007', title: 'Scaling Decisions' },
            title: (
                <SectionTitle>Scale করার পরিকল্পনা</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-4'>
                            <h3 className='text-lg font-bold text-foreground'>
                                📈 Read Heavy System — Cache is King
                            </h3>
                            <p className='text-muted-foreground leading-relaxed'>
                                URL Shortener 100:1 read/write ratio। মানে mostly read। তাই cache দিয়েই
                                বেশিরভাগ load handle করা যায়।
                            </p>
                            <div className='space-y-3'>
                                {[
                                    {
                                        type: 'pro',
                                        text: 'Redis cache দিয়ে redirect latency 1-2ms এ নামানো যায়। Database-এ hit প্রায় শূন্যে নামবে।',
                                    },
                                    {
                                        type: 'con',
                                        text: 'Cache invalidation কঠিন। URL expire করলেন cache-ও clear করতে হবে। Stale data risk আছে।',
                                    },
                                    {
                                        type: 'pro',
                                        text: 'Database read replicas দিয়ে read scale করা যায়। Write শুধু master-এ যাবেন।',
                                    },
                                    {
                                        type: 'con',
                                        text: 'Replication lag এর কারণে newly created URL কিছুক্ষণ read replica-তে না-ও থাকতে পারে।',
                                    },
                                ].map((item, i) => (
                                    <div key={i} className='flex gap-3 items-start'>
                                        <span
                                            className={`font-mono text-xs px-2 py-1 rounded border flex-shrink-0 ${
                                                item.type === 'pro'
                                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                                                    : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
                                            }`}>
                                            {item.type === 'pro' ? 'Pro' : 'Con'}
                                        </span>
                                        <p className='text-sm text-muted-foreground leading-relaxed'>
                                            {item.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-lg font-bold text-foreground mt-4 mb-2'>
                            🌍 Global Scale — CDN + Multiple Regions
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Problem', 'Solution', 'Result'],
                    rows: [
                        [
                            'High redirect latency globally',
                            'CDN edge servers এ popular URLs cache',
                            'Redirect 10ms এ নামে',
                        ],
                        [
                            'Single region failure',
                            'Multi-region deployment (Active-Active)',
                            '99.99% availability',
                        ],
                        [
                            'DB write bottleneck',
                            'Sharding by short_code first char',
                            'Write throughput বাড়ে',
                        ],
                        [
                            'Hot keys in cache',
                            'Consistent hashing + replica',
                            'Cache hotspot নেই',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '🎯 Key Trade-off: Consistency vs Availability',
                    content: (
                        <p>
                            URL shortener এ <strong>Eventual Consistency</strong> acceptable। নতুন URL
                            তৈরি হলে 1-2 second পরে সব regions এ পানয়া গেলেই হবে। Strong consistency
                            এর জন্য performance sacrifice করা worth না।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'tech-stack',
            subHeader: { index: '008', title: 'Full Tech Stack' },
            title: (
                <SectionTitle>কোন Technology ব্যবহার করবো?</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <div>
                                <h3 className='text-sm font-mono font-bold uppercase tracking-widest text-muted-foreground mb-3'>
                                    Backend
                                </h3>
                                <div className='flex flex-wrap gap-2'>
                                    {[
                                        { label: 'Go (Golang)', color: 'text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5' },
                                        { label: 'Python (FastAPI)', color: 'text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5' },
                                        { label: 'Nginx Load Balancer', color: 'text-purple-700 dark:text-purple-400 border-purple-500/30 bg-purple-500/5' },
                                        { label: 'Docker + Kubernetes', color: 'text-purple-700 dark:text-purple-400 border-purple-500/30 bg-purple-500/5' },
                                    ].map((tag, i) => (
                                        <span
                                            key={i}
                                            className={`font-mono text-xs px-3 py-1.5 rounded border ${tag.color}`}>
                                            {tag.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className='text-sm font-mono font-bold uppercase tracking-widest text-muted-foreground mb-3'>
                                    Database &amp; Cache
                                </h3>
                                <div className='flex flex-wrap gap-2'>
                                    {[
                                        { label: 'MySQL 8 (Write Master)', color: 'text-blue-700 dark:text-blue-400 border-blue-500/30 bg-blue-500/5' },
                                        { label: 'MySQL Replica (Read)', color: 'text-blue-700 dark:text-blue-400 border-blue-500/30 bg-blue-500/5' },
                                        { label: 'Redis Cluster', color: 'text-yellow-700 dark:text-yellow-400 border-yellow-500/30 bg-yellow-500/5' },
                                        { label: 'Cassandra (High Scale)', color: 'text-blue-700 dark:text-blue-400 border-blue-500/30 bg-blue-500/5' },
                                    ].map((tag, i) => (
                                        <span
                                            key={i}
                                            className={`font-mono text-xs px-3 py-1.5 rounded border ${tag.color}`}>
                                            {tag.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className='text-sm font-mono font-bold uppercase tracking-widest text-muted-foreground mb-3'>
                                    Infrastructure &amp; Analytics
                                </h3>
                                <div className='flex flex-wrap gap-2'>
                                    {[
                                        { label: 'AWS / GCP / Azure', color: 'text-purple-700 dark:text-purple-400 border-purple-500/30 bg-purple-500/5' },
                                        { label: 'CloudFront CDN', color: 'text-purple-700 dark:text-purple-400 border-purple-500/30 bg-purple-500/5' },
                                        { label: 'Apache Kafka', color: 'text-orange-700 dark:text-orange-400 border-orange-500/30 bg-orange-500/5' },
                                        { label: 'ClickHouse (Analytics)', color: 'text-blue-700 dark:text-blue-400 border-blue-500/30 bg-blue-500/5' },
                                        { label: 'Prometheus + Grafana', color: 'text-purple-700 dark:text-purple-400 border-purple-500/30 bg-purple-500/5' },
                                    ].map((tag, i) => (
                                        <span
                                            key={i}
                                            className={`font-mono text-xs px-3 py-1.5 rounded border ${tag.color}`}>
                                            {tag.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Component', 'Choice', 'Why?'],
                    rows: [
                        ['API Language', 'Go', 'High concurrency, low latency, compiled language'],
                        ['Primary DB', 'MySQL + Replication', 'Familiar, ACID, strong ecosystem'],
                        ['Cache', 'Redis', 'In-memory, blazing fast, TTL support'],
                        ['Analytics', 'Kafka + ClickHouse', 'Real-time streaming + OLAP queries'],
                        ['CDN', 'CloudFront', 'Global edge, S3 integration'],
                    ],
                },
            ],
        },
        {
            id: 'interview-tips',
            subHeader: { index: '009', title: 'Interview Preparation' },
            title: (
                <SectionTitle>Interview Tips ও Common Mistakes</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    steps: [
                        {
                            title: (
                                <span className='font-mono text-primary'>
                                    Requirements Clarify করুন আগে
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Directly design এ না গিয়ে জিজ্ঞেস করুন — custom alias দরকার?
                                    analytics চাই? expiration দরকার? কত users? এটাই interviewer দেখতে চায়।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-primary'>
                                    Capacity Estimation দেখাও
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    100M daily URLs, 100:1 read/write ratio, 115K reads/sec — এই numbers
                                    মুখস্থ রাখুন এবং calculation করে দেখাও।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-primary'>
                                    Base62 vs Hash — পার্থক্য জানেন
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Hash collision possible। Base62 + auto-increment ID collision-free।
                                    Snowflake ID দিয়ে distributed unique ID generate করা best practice।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-primary'>
                                    301 vs 302 Trade-off বলুন
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    এই question প্রায় সব interview তে আসে। 302 = analytics, 301 = server
                                    load কম। TinyURL analytics করে তাই 302।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-emerald-700 dark:text-emerald-400'>
                                    Cache + DB Architecture বলুন
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Read-heavy system। Redis cache → LRU eviction → DB read replica।
                                    Cache miss হলেই DB hit। Cache hit rate 80%+ target।
                                </span>
                            ),
                        },
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: '⚠️ Common Mistakes to Avoid',
                    content: (
                        <div className='space-y-2 text-sm'>
                            <p>
                                <strong>Mistake 1:</strong> MD5 hash directly use করা — collision possible,
                                truncation আরও বেশি collision ঘটায়।
                            </p>
                            <p>
                                <strong>Mistake 2:</strong> Analytics এর জন্য 301 use করা — browser
                                cache করে রাখে, server আর জানে না।
                            </p>
                            <p>
                                <strong>Mistake 3:</strong> Custom alias এর race condition ignore করা —
                                DB UNIQUE constraint ছাড়া duplicate হবে।
                            </p>
                            <p>
                                <strong>Mistake 4:</strong> Cache invalidation না ভাবা — URL expire
                                হলে Redis TTL + background cleanup দরকার।
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Bonus Points in Interview',
                    content: (
                        <div className='space-y-1 text-sm'>
                            <p>
                                <strong>Mention করুন:</strong> Eventual consistency acceptable কারণ URL
                                shortener তে 1-2s lag কোনো problem না।
                            </p>
                            <p>
                                <strong>Mention করুন:</strong> Analytics async হওয়া উচিত (Kafka) —
                                redirect path block করা উচিত না।
                            </p>
                            <p>
                                <strong>Mention করুন:</strong> Sharding strategy — short_code এর first
                                char দিয়ে shard করা যায়।
                            </p>
                        </div>
                    ),
                },
            ],
        },
    ],
    summary: {
        headers: ['Concept', 'Decision', 'Why'],
        rows: [
            [
                <span className='font-bold text-primary'>Short Code Gen</span>,
                'Base62 + Auto-increment ID',
                'Collision-free, compact',
            ],
            [
                <span className='font-bold text-primary'>Redirect Type</span>,
                '302 (analytics চাইলে)',
                'Server-side tracking',
            ],
            [
                <span className='font-bold text-primary'>Primary DB</span>,
                'MySQL → Cassandra (scale)',
                'Start simple, scale later',
            ],
            [
                <span className='font-bold text-primary'>Cache</span>,
                'Redis (LRU eviction)',
                '100:1 read ratio handle',
            ],
            [
                <span className='font-bold text-primary'>Consistency</span>,
                'Eventual Consistency',
                'Availability > Consistency',
            ],
            [
                <span className='font-bold text-primary'>Analytics</span>,
                'Async via Kafka',
                "Don't block redirect path",
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'TinyURL system-এ Read/Write ratio কত হওয়া স্বাভাবিক?',
                options: [
                    {
                        key: 'a',
                        text: '1:1 (সমান)',
                        isCorrect: false,
                        explanation: 'URL তৈরি এবং access সমান হয় না।',
                    },
                    {
                        key: 'b',
                        text: '100:1 (Read বেশি)',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। URL তৈরি হয় একবার, কিন্তু click হয় শতশতবার। তাই read operation অনেক বেশি। এই 100:1 ratio জানা দরকার কারণ এটা architecture decision influence করে — cache heavy system বানাতে হবে।',
                    },
                    {
                        key: 'c',
                        text: '1:100 (Write বেশি)',
                        isCorrect: false,
                        explanation: 'Write বেশি হওয়ার কোনো কারণ নেই — URL click করা read operation।',
                    },
                    {
                        key: 'd',
                        text: '10:1 (Read সামান্য বেশি)',
                        isCorrect: false,
                        explanation: '10:1 underestimate — বাস্তবে 100:1 বা তারও বেশি।',
                    },
                ],
            },
            {
                id: 2,
                text: 'Base62 encoding-এ 7 characters দিয়ে কতটি unique URL বানানো সম্ভব?',
                options: [
                    {
                        key: 'a',
                        text: '62 million',
                        isCorrect: false,
                        explanation: '62 million অনেক কম — এতে URL শেষ হয়ে যাবেন।',
                    },
                    {
                        key: 'b',
                        text: '62 billion',
                        isCorrect: false,
                        explanation: '62 billion এও পর্যাপ্ত নয়।',
                    },
                    {
                        key: 'c',
                        text: '3.5 trillion',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। 62⁷ = 3,521,614,606,208 ≈ 3.5 trillion। Base62 = 62 characters (0-9, a-z, A-Z)। 7 character দিয়ে trillions of unique codes possible — যা কোনো URL shortener এর জন্য যথেষ্ট।',
                    },
                    {
                        key: 'd',
                        text: '1 billion',
                        isCorrect: false,
                        explanation: '1 billion সঠিক নয়।',
                    },
                ],
            },
            {
                id: 3,
                text: 'Analytics track করতে চাইলে 301 নাকি 302 redirect use করবেন?',
                options: [
                    {
                        key: 'a',
                        text: '302 Temporary Redirect',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। 302 Temporary redirect প্রতিবার server-এ আসে, তাই প্রতিটা click track করা যায়। 301 browser cache করে রাখে, ফলে পরের requests server-এ আসে না — analytics miss হয়।',
                    },
                    {
                        key: 'b',
                        text: '301 Permanent Redirect',
                        isCorrect: false,
                        explanation: '301 browser cache করে — analytics miss হয়।',
                    },
                    {
                        key: 'c',
                        text: '200 OK with meta refresh',
                        isCorrect: false,
                        explanation: 'Meta refresh URL shortener এ use করা হয় না।',
                    },
                    {
                        key: 'd',
                        text: '307 Strict Redirect',
                        isCorrect: false,
                        explanation: '307 analytics এর জন্য standard choice নয়।',
                    },
                ],
            },
            {
                id: 4,
                text: 'URL Shortener এ cache eviction policy হিসেবে কোনটা best?',
                options: [
                    {
                        key: 'a',
                        text: 'FIFO (First In First Out)',
                        isCorrect: false,
                        explanation: 'FIFO popular URLs evict করতে পারে।',
                    },
                    {
                        key: 'b',
                        text: 'Random Eviction',
                        isCorrect: false,
                        explanation: 'Random eviction hot URLs remove করতে পারে।',
                    },
                    {
                        key: 'c',
                        text: 'LIFO (Last In First Out)',
                        isCorrect: false,
                        explanation: 'LIFO URL shortener এর জন্য appropriate নয়।',
                    },
                    {
                        key: 'd',
                        text: 'LRU (Least Recently Used)',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। LRU সবচেয়ে কম recent access হওয়া URLs remove করে। URL click pattern typically hot URLs বারবার access হয়। LRU এই hot URLs cache-এ রাখে, cold ones remove করে — perfect for URL shortener।',
                    },
                ],
            },
            {
                id: 5,
                text: 'URL Shortener এ database কোনটা সবচেয়ে বেশি scale করতে পারবেন?',
                options: [
                    {
                        key: 'a',
                        text: 'SQLite',
                        isCorrect: false,
                        explanation: 'SQLite single-file database — production এ use করা হয় না।',
                    },
                    {
                        key: 'b',
                        text: 'Cassandra',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Cassandra একটি distributed NoSQL database। Horizontal scaling করা যায় সহজে, fault tolerant, high write throughput। Billions of URLs store করতে ideal। SQLite single-file, Redis volatile — production এ এককভাবে suitable না।',
                    },
                    {
                        key: 'c',
                        text: 'Microsoft Access',
                        isCorrect: false,
                        explanation: 'Microsoft Access production system এ use করা হয় না।',
                    },
                    {
                        key: 'd',
                        text: 'Redis alone',
                        isCorrect: false,
                        explanation: 'Redis in-memory — persistence এর জন্য primary DB হিসেবে যথেষ্ট নয়।',
                    },
                ],
            },
            {
                id: 6,
                text: 'URL Shortener system-এ single point of failure (SPOF) কোনটা?',
                options: [
                    {
                        key: 'a',
                        text: 'API Server (stateless)',
                        isCorrect: false,
                        explanation: 'Stateless API server SPOF নয় — multiple instances থাকে।',
                    },
                    {
                        key: 'b',
                        text: 'CDN',
                        isCorrect: false,
                        explanation: 'CDN distributed — SPOF নয়।',
                    },
                    {
                        key: 'c',
                        text: 'Database Master (single)',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Single Database Master down হলে writes বন্ধ হয়ে যাবেন। Solution: Master-Slave replication + automatic failover (using tools like Orchestrator বা AWS RDS Multi-AZ)। API servers stateless তাই SPOF না।',
                    },
                    {
                        key: 'd',
                        text: 'Redis Cache',
                        isCorrect: false,
                        explanation: 'Redis Cluster fail হলে DB থেকে fallback হয়।',
                    },
                ],
            },
            {
                id: 7,
                text: 'Custom alias feature-এ race condition কীভাবে prevent করবেন?',
                options: [
                    {
                        key: 'a',
                        text: 'Database UNIQUE constraint + transaction',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Application level check safe না — দুটো request একই সময়ে check করলেন দুটোই "not exists" দেখবেন। Database UNIQUE constraint atomic — শুধুমাত্র একটা insert succeed করবেন, অন্যটা error পাবেন। এটাই correct approach।',
                    },
                    {
                        key: 'b',
                        text: 'Application level check (if exists)',
                        isCorrect: false,
                        explanation: 'Application level check race condition safe নয়।',
                    },
                    {
                        key: 'c',
                        text: 'Timestamp comparison',
                        isCorrect: false,
                        explanation: 'Timestamp comparison race condition prevent করে না।',
                    },
                    {
                        key: 'd',
                        text: 'Single threaded server use করুন',
                        isCorrect: false,
                        explanation: 'Single threaded server scale করা যায় না।',
                    },
                ],
            },
            {
                id: 8,
                text: 'URL expiration implement করার সবচেয়ে efficient উপায় কোনটা?',
                options: [
                    {
                        key: 'a',
                        text: 'Every request-এ DB query করুন',
                        isCorrect: false,
                        explanation: 'Every request এ DB query করলেন latency বাড়বে।',
                    },
                    {
                        key: 'b',
                        text: 'Cron job প্রতি second-এ run করুন',
                        isCorrect: false,
                        explanation: 'প্রতি second এ cron job database এ load বাড়াবে।',
                    },
                    {
                        key: 'c',
                        text: 'User manually delete করবেন',
                        isCorrect: false,
                        explanation: 'User manually delete করা reliable নয়।',
                    },
                    {
                        key: 'd',
                        text: 'Redis TTL + background cleanup job',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Redis TTL set করলেন cache automatically expire হবে। DB তে expires_at column থাকবেন। Background job (daily/hourly) expired URLs delete করবেন। Every request-এ expiry check করলেন latency বাড়বে।',
                    },
                ],
            },
            {
                id: 9,
                text: 'প্রতিদিন 100M URL create করলেন 1 বছরে storage কত লাগবে (প্রতি URL ~500 bytes)?',
                options: [
                    {
                        key: 'a',
                        text: '1.8 GB',
                        isCorrect: false,
                        explanation: 'অনেক কম estimate।',
                    },
                    {
                        key: 'b',
                        text: '18 TB',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। 100M × 500B = 50GB/day × 365 days = 18.25 TB/year। এই calculation interview-তে দেখানো important। 18TB manage করতে distributed DB বা cloud storage দরকার।',
                    },
                    {
                        key: 'c',
                        text: '18 GB',
                        isCorrect: false,
                        explanation: '18 GB calculation ভুল।',
                    },
                    {
                        key: 'd',
                        text: '180 TB',
                        isCorrect: false,
                        explanation: '180 TB অনেক বেশি estimate।',
                    },
                ],
            },
            {
                id: 10,
                text: 'URL Shortener design-এ Consistency vs Availability — কোনটা prioritize করবেন?',
                options: [
                    {
                        key: 'a',
                        text: 'Strong Consistency — সব regions এ instantly same data',
                        isCorrect: false,
                        explanation: 'Strong consistency তে performance sacrifice হয়।',
                    },
                    {
                        key: 'b',
                        text: 'Partition Tolerance ছাড়া কোনোটাই না',
                        isCorrect: false,
                        explanation: 'এটা CAP theorem এর ভুল interpretation।',
                    },
                    {
                        key: 'c',
                        text: 'Availability + Eventual Consistency',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। URL Shortener-এ 1-2 second lag acceptable। নতুন URL সব regions-এ instantly propagate না হলেও চলে। Availability বেশি important — system down থাকলে সব redirects fail করবেন। Eventual consistency দিয়ে performance + availability দুটোই পানয়া যায়।',
                    },
                    {
                        key: 'd',
                        text: 'ACID transactions সব জায়গায়',
                        isCorrect: false,
                        explanation: 'Distributed system এ সব জায়গায় ACID practical নয়।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'URL Shortener সিস্টেম তৈরি করুন',
        time: '৩-৪ ঘন্টা',
        difficulty: 'Intermediate',
        tasks: [
            <span key='1'>
                <strong>System Diagram:</strong> Excalidraw বা draw.io তে URL Shortener-এর complete
                architecture diagram আঁকুন। Include করুন: Client → Load Balancer → API Servers → Cache
                (Redis) → Database (Master + Replica)। প্রতিটা component-এ label দিন।
            </span>,
            <span key='2'>
                <strong>Estimation Exercise:</strong> যদি আপনার system প্রতিদিন 500M URL create করে
                (Twitter scale), তাহলে: (ক) writes/sec কত? (খ) reads/sec কত (1000:1 ratio)? (গ) 5 বছরে
                storage কত (প্রতি URL 1KB)?
            </span>,
            <span key='3'>
                <strong>Code এ Base62:</strong> Python বা JavaScript-এ Base62 encode/decode function লিখুন।
                Test করুন: encode(125) কত দেয়? decode সেটা আবার 125 দেয় কিনা।
            </span>,
            <span key='4'>
                <strong>Trade-off Analysis:</strong> আপনি কি MySQL নাকি Cassandra choose করবেন যদি: (ক)
                শুধু 1M users, (খ) 1 billion users? প্রতিটার জন্য reason দিন।
            </span>,
            <span key='5'>
                <strong>Cache Strategy:</strong> Redis-এ URL cache করলেন TTL কত রাখবে এবং কেন? যদি URL
                expire হয়ে যায়, cache invalidate করার process describe করুন।
            </span>,
        ],
        deliverables: [
            <span key='1'>Architecture diagram (screenshot/file)</span>,
            <span key='2'>Estimation calculation (written) + Base62 encode/decode code</span>,
            <span key='3'>Database trade-off comparison (MySQL vs Cassandra)</span>,
            <span key='4'>Cache strategy explanation with TTL decision</span>,
        ],
    },
    practicalLab: {
        title: 'TinyURL Implementation',
        subtitle: 'Base62 + Redis + Node.js',
        steps: [
            {
                title: 'Project Setup করুন',
                description:
                    'Node.js project initialize করুন। Dependencies install করুন: express, redis, uuid। MongoDB বা SQLite use করুন persistent storage এর জন্য।',
            },
            {
                title: 'Base62 Encoder লিখুন',
                description:
                    'encode(num) এবং decode(str) function লিখুন। Test করুন: encode(1) → "0000001", decode("0000001") → 1। Edge cases handle করুন।',
            },
            {
                title: 'Redis Cache Setup করুন',
                description:
                    'Redis connect করুন। short_code → long_url mapping cache করুন TTL=86400 (1 day) দিয়ে। Cache miss হলে DB থেকে fetch করুন।',
            },
            {
                title: 'API Endpoints বানান',
                description:
                    'POST /shorten (long_url নিয়ে short_url return করে) এবং GET /:shortCode (redirect করে) endpoints implement করুন।',
            },
            {
                title: 'Test ও Benchmark করুন',
                description:
                    'curl বা Postman দিয়ে test করুন। Cache hit vs miss latency compare করুন। 1000 requests এ average response time measure করুন।',
            },
        ],
        codeBlock: {
            language: 'javascript',
            filename: 'tinyurl-server.js',
            code: `const express = require('express');
const redis = require('redis');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// Redis client setup
const redisClient = redis.createClient({ url: 'redis://localhost:6379' });
redisClient.connect();

// In-memory DB simulation (use MySQL/Cassandra in production)
const urlDatabase = new Map();
let idCounter = 1;

// Base62 encoding
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function encodeBase62(num) {
    if (num === 0) return BASE62[0];
    let result = '';
    while (num > 0) {
        result = BASE62[num % 62] + result;
        num = Math.floor(num / 62);
    }
    return result.padStart(7, '0');
}

// POST /shorten — URL shortening endpoint
app.post('/shorten', async (req, res) => {
    const { longUrl, customAlias, expiresIn } = req.body;
    if (!longUrl) return res.status(400).json({ error: 'longUrl required' });

    // Check custom alias uniqueness
    const shortCode = customAlias || encodeBase62(idCounter++);
    if (urlDatabase.has(shortCode)) {
        return res.status(409).json({ error: 'Alias already taken' });
    }

    const expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : null;
    urlDatabase.set(shortCode, { longUrl, expiresAt, clicks: 0 });

    // Cache in Redis with TTL
    const ttl = expiresIn || 86400; // default 24h
    await redisClient.setEx(shortCode, ttl, longUrl);

    res.json({
        shortUrl: \`http://localhost:3000/\${shortCode}\`,
        shortCode,
        longUrl,
    });
});

// GET /:shortCode — Redirect endpoint
app.get('/:shortCode', async (req, res) => {
    const { shortCode } = req.params;

    // 1. Cache check first
    const cachedUrl = await redisClient.get(shortCode);
    if (cachedUrl) {
        console.log(\`Cache HIT: \${shortCode}\`);
        // Track click asynchronously (don't block redirect)
        setImmediate(() => trackClick(shortCode));
        return res.redirect(302, cachedUrl); // 302 for analytics
    }

    // 2. DB fallback on cache miss
    console.log(\`Cache MISS: \${shortCode} — checking DB\`);
    const record = urlDatabase.get(shortCode);
    if (!record) return res.status(404).json({ error: 'URL not found' });

    // Check expiration
    if (record.expiresAt && Date.now() > record.expiresAt) {
        urlDatabase.delete(shortCode);
        return res.status(410).json({ error: 'URL expired' });
    }

    // Re-populate cache
    await redisClient.setEx(shortCode, 3600, record.longUrl);
    setImmediate(() => trackClick(shortCode));
    res.redirect(302, record.longUrl);
});

function trackClick(shortCode) {
    const record = urlDatabase.get(shortCode);
    if (record) record.clicks = (record.clicks || 0) + 1;
    // In production: publish to Kafka for analytics pipeline
}

app.listen(3000, () => console.log('TinyURL server running on port 3000'));`,
        },
        tip: 'Redis cache hit এবং DB fallback latency compare করুন। Cache hit 1-2ms, DB fallback 10-50ms হওয়া উচিত। এটাই 100:1 read/write ratio এর power — cache দিয়েই 99%+ traffic handle করা যায়।',
    },
};
