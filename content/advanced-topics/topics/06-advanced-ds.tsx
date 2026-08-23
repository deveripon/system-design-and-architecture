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

export const advancedDsContent: TopicData = {
    id: 'advanced-ds',
    sections: [
        // ─────────────────────────────────────────────────────────────────
        // Section 1 — Why Probabilistic Structures
        // ─────────────────────────────────────────────────────────────────
        {
            id: 'why-probabilistic',
            subHeader: { index: '001', title: 'Why Probabilistic Structures' },
            title: (
                <SectionTitle>
                    কেন এই &apos;Weird&apos; Data Structures দরকার?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-4'>
                            <div className='flex flex-wrap gap-3 mb-6'>
                                <span className='font-mono text-xs px-3 py-1 border border-primary/30 text-primary bg-primary/5 rounded'>
                                    ⏱ ৯০-১২০ মিনিট
                                </span>
                                <span className='font-mono text-xs px-3 py-1 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5 rounded'>
                                    📊 Expert Level
                                </span>
                                <span className='font-mono text-xs px-3 py-1 border border-purple-400/30 text-purple-700 dark:text-purple-400 bg-purple-400/5 rounded'>
                                    🧮 Probabilistic Algorithms
                                </span>
                                <span className='font-mono text-xs px-3 py-1 border border-yellow-400/30 text-yellow-700 dark:text-yellow-400 bg-yellow-400/5 rounded'>
                                    FINAL TOPIC 06 / 06
                                </span>
                            </div>
                            <ContentParagraph>
                                কল্পনা করুন ১ বিলিয়ন URL-এর একটা set রাখতে হবে।
                                Standard{' '}
                                <strong className='text-foreground'>
                                    HashSet
                                </strong>{' '}
                                use করলেন{' '}
                                <strong className='text-foreground'>
                                    ৫০+ GB memory
                                </strong>{' '}
                                লাগবে। একটা server-এ এটা রাখা impossible। কিন্তু
                                যদি{' '}
                                <strong className='text-foreground'>
                                    ৯৯%+ accuracy
                                </strong>{' '}
                                তে কাজ চলে — তাহলে মাত্র{' '}
                                <strong className='text-foreground'>
                                    ১ MB
                                </strong>
                                -তে সব কিছু রাখা সম্ভব।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {[
                                {
                                    title: '💾 Memory Problem',
                                    color: 'text-red-700 dark:text-red-400',
                                    border: 'border-red-500/20 bg-red-500/5',
                                    desc: '1 Billion URLs × 50 bytes = 50 GB। কোনো single server-এ এটা রাখা possible না। Distributed হলেও network overhead massive।',
                                    stat: 'HashSet: 50 GB',
                                    statColor: 'text-red-700 dark:text-red-400',
                                },
                                {
                                    title: '⚡ Speed Problem',
                                    color: 'text-yellow-700 dark:text-yellow-400',
                                    border: 'border-yellow-400/20 bg-yellow-400/5',
                                    desc: 'HashSet-এ lookup করতে হলে hash calculate করতে হয়, memory access করতে হয়। Billion-item set-এ cache miss হলে 100ns+ latency।',
                                    stat: 'Cache miss rate: 90%+',
                                    statColor: 'text-yellow-700 dark:text-yellow-400',
                                },
                                {
                                    title: '📈 Scale Problem',
                                    color: 'text-orange-700 dark:text-orange-400',
                                    border: 'border-orange-400/20 bg-orange-400/5',
                                    desc: 'Web crawlers প্রতি second লাখো URL check করে। Exact membership test এই throughput-এ scalable না।',
                                    stat: 'Throughput: 1M checks/sec needed',
                                    statColor: 'text-orange-700 dark:text-orange-400',
                                },
                                {
                                    title: '⚖️ The Trade-off',
                                    color: 'text-emerald-700 dark:text-emerald-400',
                                    border: 'border-emerald-500/20 bg-emerald-500/5',
                                    desc: 'Approximate answer accept করলেন — ৯৯%+ accurate হলে production-এ sufficient। False positive rate controllable।',
                                    stat: 'Bloom Filter: 1 MB (50,000x savings!)',
                                    statColor: 'text-emerald-700 dark:text-emerald-400',
                                },
                            ].map((card, i) => (
                                <div
                                    key={i}
                                    className={`border rounded-lg p-5 ${card.border}`}>
                                    <p
                                        className={`font-mono text-sm font-bold mb-2 ${card.color}`}>
                                        {card.title}
                                    </p>
                                    <p className='text-sm text-muted-foreground mb-3 leading-relaxed'>
                                        {card.desc}
                                    </p>
                                    <span
                                        className={`font-mono text-xs font-bold ${card.statColor}`}>
                                        {card.stat}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-5 mt-2'>
                            <p className='font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4'>
                                Memory Comparison — 1 Billion URLs
                            </p>
                            <div className='space-y-3'>
                                {[
                                    {
                                        label: 'HashSet (Java)',
                                        size: '~50 GB',
                                        bar: 100,
                                        color: 'bg-red-500',
                                    },
                                    {
                                        label: 'Sorted Array (binary search)',
                                        size: '~40 GB',
                                        bar: 80,
                                        color: 'bg-orange-500',
                                    },
                                    {
                                        label: 'HyperLogLog',
                                        size: '12 KB',
                                        bar: 1,
                                        color: 'bg-yellow-500',
                                    },
                                    {
                                        label: 'Bloom Filter',
                                        size: '~1 MB',
                                        bar: 2,
                                        color: 'bg-emerald-500',
                                    },
                                    {
                                        label: 'Count-Min Sketch',
                                        size: 'Configurable',
                                        bar: 3,
                                        color: 'bg-primary',
                                    },
                                ].map((item, i) => (
                                    <div key={i} className='space-y-1'>
                                        <div className='flex justify-between text-xs font-mono'>
                                            <span className='text-muted-foreground'>
                                                {item.label}
                                            </span>
                                            <span
                                                className={
                                                    item.bar > 50
                                                        ? 'text-red-700 dark:text-red-400 font-bold'
                                                        : 'text-emerald-700 dark:text-emerald-400 font-bold'
                                                }>
                                                {item.size}
                                            </span>
                                        </div>
                                        <div className='h-2 bg-muted rounded-full overflow-hidden'>
                                            <div
                                                className={`h-full rounded-full ${item.color}`}
                                                style={{
                                                    width: `${item.bar}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 Core Insight',
                    content: (
                        <p>
                            এই structures{' '}
                            <strong>exact answer দেয় না</strong> —{' '}
                            <strong>approximate answer দেয়</strong>। কিন্তু সেই
                            approximate answer production এ sufficient। Google
                            Chrome, Cassandra, Redis, LinkedIn — সবাই এই
                            structures production-এ use করে। &quot;আমি ৯৯%
                            confident এই URL আগে দেখিনি&quot; — এটাই web
                            crawling-এর জন্য যথেষ্ট।
                        </p>
                    ),
                },
            ],
        },

        // ─────────────────────────────────────────────────────────────────
        // Section 2 — Bloom Filter
        // ─────────────────────────────────────────────────────────────────
        {
            id: 'bloom-filter',
            subHeader: { index: '002', title: 'Bloom Filter' },
            title: (
                <SectionTitle>
                    Bloom Filter — &apos;আছে কিনা&apos; দ্রুত বলুন
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Bloom Filter একটা{' '}
                            <strong className='text-foreground'>
                                probabilistic data structure
                            </strong>{' '}
                            যা বলতে পারে: &quot;এই element definitely নেই&quot;
                            অথবা &quot;এই element probably আছে&quot;। কখনো false
                            negative দেয় না।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                Bloom Filter — Bit Array + Hash Functions
                            </p>
                            <svg
                                viewBox='0 0 620 280'
                                className='w-full max-w-2xl mx-auto'>
                                <defs>
                                    <marker
                                        id='bf-arr'
                                        markerWidth='8'
                                        markerHeight='8'
                                        refX='6'
                                        refY='3'
                                        orient='auto'>
                                        <path
                                            d='M0,0 L0,6 L8,3 z'
                                            fill='#64748b'
                                        />
                                    </marker>
                                    <marker
                                        id='bf-arrG'
                                        markerWidth='8'
                                        markerHeight='8'
                                        refX='6'
                                        refY='3'
                                        orient='auto'>
                                        <path
                                            d='M0,0 L0,6 L8,3 z'
                                            fill='#10b981'
                                        />
                                    </marker>
                                    <marker
                                        id='bf-arrP'
                                        markerWidth='8'
                                        markerHeight='8'
                                        refX='6'
                                        refY='3'
                                        orient='auto'>
                                        <path
                                            d='M0,0 L0,6 L8,3 z'
                                            fill='#8b5cf6'
                                        />
                                    </marker>
                                    <marker
                                        id='bf-arrO'
                                        markerWidth='8'
                                        markerHeight='8'
                                        refX='6'
                                        refY='3'
                                        orient='auto'>
                                        <path
                                            d='M0,0 L0,6 L8,3 z'
                                            fill='#f97316'
                                        />
                                    </marker>
                                </defs>
                                {/* Input */}
                                <rect
                                    x='10'
                                    y='100'
                                    width='110'
                                    height='40'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#06b6d4'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='65'
                                    y='116'
                                    textAnchor='middle'
                                    fill='#06b6d4'
                                    fontFamily='monospace'
                                    fontSize='9'
                                    fontWeight='bold'>
                                    &quot;google.com&quot;
                                </text>
                                <text
                                    x='65'
                                    y='130'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    INPUT STRING
                                </text>
                                {/* h1 */}
                                <path
                                    d='M 120 110 L 160 75'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                    markerEnd='url(#bf-arrG)'
                                />
                                <rect
                                    x='160'
                                    y='55'
                                    width='70'
                                    height='30'
                                    rx='3'
                                    fill='transparent'
                                    stroke='#10b981'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='195'
                                    y='65'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    h1(x) → 2
                                </text>
                                <text
                                    x='195'
                                    y='78'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    pos 2
                                </text>
                                {/* h2 */}
                                <path
                                    d='M 120 120 L 160 120'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                    markerEnd='url(#bf-arrP)'
                                />
                                <rect
                                    x='160'
                                    y='105'
                                    width='70'
                                    height='30'
                                    rx='3'
                                    fill='transparent'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='195'
                                    y='115'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    h2(x) → 5
                                </text>
                                <text
                                    x='195'
                                    y='128'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    pos 5
                                </text>
                                {/* h3 */}
                                <path
                                    d='M 120 130 L 160 165'
                                    stroke='#f97316'
                                    strokeWidth='1.5'
                                    markerEnd='url(#bf-arrO)'
                                />
                                <rect
                                    x='160'
                                    y='155'
                                    width='70'
                                    height='30'
                                    rx='3'
                                    fill='transparent'
                                    stroke='#f97316'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='195'
                                    y='165'
                                    textAnchor='middle'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    h3(x) → 9
                                </text>
                                <text
                                    x='195'
                                    y='178'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    pos 9
                                </text>
                                {/* Bit array */}
                                <text
                                    x='270'
                                    y='35'
                                    textAnchor='middle'
                                    fill='#94a3b8'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    BIT ARRAY (size=12)
                                </text>
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(
                                    i => {
                                        const x = 240 + i * 32;
                                        const isSet = [2, 5, 9].includes(i);
                                        return (
                                            <g key={i}>
                                                <rect
                                                    x={x - 14}
                                                    y={105}
                                                    width={28}
                                                    height={28}
                                                    rx={3}
                                                    fill={
                                                        isSet
                                                            ? 'rgba(16,185,129,0.2)'
                                                            : 'transparent'
                                                    }
                                                    stroke={
                                                        isSet
                                                            ? '#10b981'
                                                            : '#334155'
                                                    }
                                                    strokeWidth={
                                                        isSet ? 2 : 1
                                                    }
                                                />
                                                <text
                                                    x={x}
                                                    y={124}
                                                    textAnchor='middle'
                                                    fill={
                                                        isSet
                                                            ? '#10b981'
                                                            : '#475569'
                                                    }
                                                    fontFamily='monospace'
                                                    fontSize={
                                                        isSet ? '12' : '10'
                                                    }
                                                    fontWeight={
                                                        isSet ? 'bold' : 'normal'
                                                    }>
                                                    {isSet ? '1' : '0'}
                                                </text>
                                                <text
                                                    x={x}
                                                    y={148}
                                                    textAnchor='middle'
                                                    fill='#475569'
                                                    fontFamily='monospace'
                                                    fontSize='8'>
                                                    {i}
                                                </text>
                                            </g>
                                        );
                                    }
                                )}
                                {/* Arrows from hash functions to bit array */}
                                <path
                                    d='M 230 70 L 306 105'
                                    stroke='#10b981'
                                    strokeWidth='1.2'
                                    strokeDasharray='4,2'
                                    markerEnd='url(#bf-arrG)'
                                />
                                <path
                                    d='M 230 120 L 402 105'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.2'
                                    strokeDasharray='4,2'
                                    markerEnd='url(#bf-arrP)'
                                />
                                <path
                                    d='M 230 170 L 530 133'
                                    stroke='#f97316'
                                    strokeWidth='1.2'
                                    strokeDasharray='4,2'
                                    markerEnd='url(#bf-arrO)'
                                />
                                {/* Result boxes */}
                                <rect
                                    x='250'
                                    y='190'
                                    width='150'
                                    height='35'
                                    rx='4'
                                    fill='rgba(239,68,68,0.1)'
                                    stroke='#ef4444'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='325'
                                    y='205'
                                    textAnchor='middle'
                                    fill='#ef4444'
                                    fontFamily='monospace'
                                    fontSize='9'
                                    fontWeight='bold'>
                                    Definitely NOT exists
                                </text>
                                <text
                                    x='325'
                                    y='218'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    any bit = 0
                                </text>
                                <rect
                                    x='420'
                                    y='190'
                                    width='150'
                                    height='35'
                                    rx='4'
                                    fill='rgba(16,185,129,0.1)'
                                    stroke='#10b981'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='495'
                                    y='205'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='9'
                                    fontWeight='bold'>
                                    Probably exists
                                </text>
                                <text
                                    x='495'
                                    y='218'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    all bits = 1
                                </text>
                                {/* Footer */}
                                <text
                                    x='310'
                                    y='260'
                                    fill='#475569'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Set bits: pos 2, 5, 9 → &quot;google.com&quot;
                                    probably exists
                                </text>
                            </svg>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'bloom-filter.js — JavaScript Implementation from Scratch',
                    code: `class BloomFilter {
  constructor(size = 1000, hashCount = 3) {
    this.size = size;
    this.hashCount = hashCount;
    this.bitArray = new Uint8Array(size); // All zeros initially
  }

  // Multiple hash functions using different seeds
  _hash(item, seed) {
    let hash = seed;
    for (let i = 0; i < item.length; i++) {
      hash = (hash * 31 + item.charCodeAt(i)) % this.size;
    }
    return Math.abs(hash);
  }

  // Add an element (set bits)
  add(item) {
    for (let i = 0; i < this.hashCount; i++) {
      const pos = this._hash(item, i * 0xdeadbeef);
      this.bitArray[pos] = 1;
    }
  }

  // Check if element might exist
  mightContain(item) {
    for (let i = 0; i < this.hashCount; i++) {
      const pos = this._hash(item, i * 0xdeadbeef);
      if (this.bitArray[pos] === 0) {
        return false; // Definitely NOT in set (100% certain)
      }
    }
    return true; // Probably in set (might be false positive)
  }

  // Memory usage in bytes
  memoryBytes() {
    return this.bitArray.byteLength;
  }
}

// Real-world use: Username availability check
const usernameFilter = new BloomFilter(100_000, 5);

// Pre-populate with existing usernames
['alice', 'bob', 'charlie', 'devripon', 'system_admin'].forEach(u =>
  usernameFilter.add(u)
);

// Check new username — avoid DB query if definitely not exists
function checkUsername(username) {
  if (!usernameFilter.mightContain(username)) {
    // Definitely available — no DB query needed!
    return { available: true, checkedDB: false };
  }
  // Might exist — check DB to confirm (avoids false negative)
  const existsInDB = queryDatabase(username); // actual DB check
  return { available: !existsInDB, checkedDB: true };
}

// Example:
console.log(checkUsername('xyzabc123')); // { available: true, checkedDB: false }
console.log(checkUsername('alice'));      // { available: false, checkedDB: true }

// Stats: 1 billion URLs → HashSet ~50 GB vs Bloom Filter ~1 MB (50,000x savings)
console.log(\`Memory used: \${usernameFilter.memoryBytes()} bytes\`);`,
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Property',
                        'Value',
                        'Notes',
                    ],
                    rows: [
                        ['False negative rate', '0% (never)', 'If Bloom says "no" → definitely not in set'],
                        ['False positive rate', '~1% (configurable)', 'Bloom says "yes" but not actually in set'],
                        ['Memory (1B items)', '~1 MB', 'vs HashSet ~50 GB → 50,000x savings'],
                        ['Time complexity', 'O(k) — k = hash functions', 'Constant time regardless of set size'],
                        ['Supports delete?', 'No (basic)', 'Use Counting Bloom Filter for deletion'],
                        ['Use case', 'Membership test', 'Google Chrome malicious URL check'],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: '⚠️ False Positive কিন্তু False Negative কখনো না',
                    content: (
                        <div>
                            <p>
                                Bloom Filter এর{' '}
                                <strong>
                                    false negative হয় না
                                </strong>{' '}
                                — যদি বলে &quot;নেই&quot; তাহলে সত্যিই নেই। কিন্তু{' '}
                                <strong>
                                    false positive হতে পারে
                                </strong>{' '}
                                — বলতে পারে &quot;আছে&quot; কিন্তু আসলে নেই। এই
                                property-র কারণে web crawling, cache, username check-এ
                                perfect fit।
                            </p>
                            <br />
                            <p>
                                False positive rate কমাতে:{' '}
                                <strong>bit array size বাড়াও</strong> অথবা{' '}
                                <strong>hash function count বাড়াও</strong>।
                            </p>
                        </div>
                    ),
                },
            ],
        },

        // ─────────────────────────────────────────────────────────────────
        // Section 3 — HyperLogLog
        // ─────────────────────────────────────────────────────────────────
        {
            id: 'hyperloglog',
            subHeader: { index: '003', title: 'HyperLogLog' },
            title: (
                <SectionTitle>
                    HyperLogLog — Unique Count করুন, Memory তে নয়
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            YouTube-এ একটা video-তে ১ বিলিয়ন ইউনিক views count
                            করতে হবে। Exact counter রাখলে ১ বিলিয়ন entries।{' '}
                            <strong className='text-foreground'>
                                HyperLogLog
                            </strong>{' '}
                            মাত্র{' '}
                            <strong className='text-foreground'>
                                ১২ KB memory
                            </strong>{' '}
                            তে এটা করতে পারে — ৯৯%+ accuracy সহ।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6'>
                            <p className='font-mono text-xs uppercase tracking-widest text-muted-foreground mb-5 text-center'>
                                HyperLogLog — How It Works
                            </p>
                            <div className='space-y-4'>
                                {[
                                    {
                                        step: '01',
                                        title: 'Hash করুন',
                                        desc: 'প্রতিটা element hash করুন → uniform binary string পান। "user_123" → "0001101100110..."',
                                        color: 'text-primary border-primary/30 bg-primary/5',
                                    },
                                    {
                                        step: '02',
                                        title: 'Leading Zeros Count করুন',
                                        desc: 'Hash-এর শুরুতে কতটা 0 আছে সেটা track করুন। "0001101..." → 3 leading zeros।',
                                        color: 'text-purple-700 dark:text-purple-400 border-purple-400/30 bg-purple-400/5',
                                    },
                                    {
                                        step: '03',
                                        title: 'Maximum Track করুন',
                                        desc: 'সর্বোচ্চ leading zeros count রাখুন। Max leading zeros = k হলে → set-এ ≈ 2^k unique elements।',
                                        color: 'text-orange-700 dark:text-orange-400 border-orange-400/30 bg-orange-400/5',
                                    },
                                    {
                                        step: '04',
                                        title: 'Cardinality Estimate করুন',
                                        desc: 'Multiple sub-streams average করুন। Harmonic mean use করে accuracy improve করুন। Error rate: ~0.81%।',
                                        color: 'text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
                                    },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className='flex items-start gap-4'>
                                        <span
                                            className={`font-mono text-sm font-black px-3 py-2 border rounded flex-shrink-0 ${item.color}`}>
                                            {item.step}
                                        </span>
                                        <div>
                                            <p className='font-mono text-sm font-bold text-foreground mb-1'>
                                                {item.title}
                                            </p>
                                            <p className='text-sm text-muted-foreground'>
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'bash',
                    filename: 'redis-hyperloglog.sh — Redis HyperLogLog Commands',
                    code: `# Redis HyperLogLog — Track unique website visitors

# Add visitors (PFADD — Probabilistic Frequency ADD)
PFADD daily_visitors:2026-05-08 "user:1001"
PFADD daily_visitors:2026-05-08 "user:1002"
PFADD daily_visitors:2026-05-08 "user:1001"  # duplicate — ignored
PFADD daily_visitors:2026-05-08 "user:1003"

# Count unique visitors (PFCOUNT — Probabilistic Frequency COUNT)
PFCOUNT daily_visitors:2026-05-08
# Returns: 3 (not 4, because user:1001 was added twice)

# Merge multiple HyperLogLogs (e.g., weekly unique visitors)
PFMERGE weekly_visitors:2026-W19 \
  daily_visitors:2026-05-04 \
  daily_visitors:2026-05-05 \
  daily_visitors:2026-05-06 \
  daily_visitors:2026-05-07 \
  daily_visitors:2026-05-08

PFCOUNT weekly_visitors:2026-W19
# Returns: ~unique visitors for the whole week (12 KB memory!)

# ──────────────────────────────────────────────────────────
# Node.js example — YouTube view counter
# ──────────────────────────────────────────────────────────`,
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'hyperloglog-nodejs.js — YouTube Unique Views',
                    code: `const Redis = require('ioredis');
const redis = new Redis();

// Track unique video view
async function trackVideoView(videoId, userId) {
  const key = \`video:views:\${videoId}\`;

  // HyperLogLog — O(1) memory regardless of views count
  await redis.pfadd(key, userId);

  // Get approximate unique view count
  const uniqueViews = await redis.pfcount(key);
  return uniqueViews;
}

// Get daily active users (DAU)
async function getDailyActiveUsers(date) {
  const key = \`dau:\${date}\`;
  return redis.pfcount(key);
}

// Get weekly active users by merging daily HLLs
async function getWeeklyActiveUsers(weekDates) {
  const destKey = \`wau:week\`;
  const dailyKeys = weekDates.map(d => \`dau:\${d}\`);

  await redis.pfmerge(destKey, ...dailyKeys);
  return redis.pfcount(destKey);
}

// Usage:
// trackVideoView('v_abc123', 'user_456') → returns unique view count
// Memory: ~12 KB regardless of 1M or 1B unique viewers!

// Real-world stats:
// YouTube: uses HyperLogLog for unique views
// LinkedIn: unique visitor counts per post
// Redis itself: PFADD / PFCOUNT built-in`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                            {[
                                { num: '12 KB', label: 'Memory (any size)' },
                                { num: '~0.81%', label: 'Standard Error Rate' },
                                { num: '99.19%+', label: 'Accuracy' },
                                { num: 'O(1)', label: 'Time Complexity' },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className='bg-muted/30 border border-border rounded-lg p-4 text-center'>
                                    <span className='font-mono text-xl font-bold text-primary block mb-1'>
                                        {item.num}
                                    </span>
                                    <span className='font-mono text-xs text-muted-foreground uppercase tracking-wide'>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Redis তে Built-in HyperLogLog Support',
                    content: (
                        <p>
                            Redis নিজেই HyperLogLog support করে —{' '}
                            <strong className='font-mono'>PFADD</strong> দিয়ে
                            element add করুন,{' '}
                            <strong className='font-mono'>PFCOUNT</strong> দিয়ে
                            unique count পান,{' '}
                            <strong className='font-mono'>PFMERGE</strong> দিয়ে
                            multiple counters merge করুন। কোনো external library
                            দরকার নেই। Daily active users, unique video views,
                            unique page visitors — সব কিছু Redis দিয়েই করা যায়।
                        </p>
                    ),
                },
            ],
        },

        // ─────────────────────────────────────────────────────────────────
        // Section 4 — Count-Min Sketch
        // ─────────────────────────────────────────────────────────────────
        {
            id: 'count-min-sketch',
            subHeader: { index: '004', title: 'Count-Min Sketch' },
            title: (
                <SectionTitle>
                    Count-Min Sketch — Frequency Estimate করুন
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Twitter-এ trending topics বের করতে হলে প্রতিটা
                            word-এর count রাখতে হবে। কিন্তু ১ কোটি unique
                            word-এর exact counter রাখা অসম্ভব।{' '}
                            <strong className='text-foreground'>
                                Count-Min Sketch
                            </strong>{' '}
                            approximate frequency count করে — fixed memory-তে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6'>
                            <p className='font-mono text-xs uppercase tracking-widest text-muted-foreground mb-5 text-center'>
                                Count-Min Sketch — 2D Counter Array
                            </p>
                            <div className='space-y-4'>
                                <div className='overflow-x-auto'>
                                    <table className='w-full font-mono text-xs border-collapse'>
                                        <thead>
                                            <tr>
                                                <th className='text-muted-foreground text-left py-2 pr-4'>
                                                    Row
                                                </th>
                                                {[0, 1, 2, 3, 4, 5, 6, 7].map(
                                                    i => (
                                                        <th
                                                            key={i}
                                                            className='text-muted-foreground text-center py-2 px-3'>
                                                            {i}
                                                        </th>
                                                    )
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                {
                                                    label: 'h1(x)',
                                                    highlight: [2, 5],
                                                    values: [
                                                        0, 1, 3, 1, 0, 4, 0, 2,
                                                    ],
                                                    color: '#10b981',
                                                },
                                                {
                                                    label: 'h2(x)',
                                                    highlight: [1, 6],
                                                    values: [
                                                        2, 3, 0, 1, 2, 1, 4, 0,
                                                    ],
                                                    color: '#8b5cf6',
                                                },
                                                {
                                                    label: 'h3(x)',
                                                    highlight: [4, 7],
                                                    values: [
                                                        1, 0, 2, 3, 4, 0, 1, 4,
                                                    ],
                                                    color: '#f97316',
                                                },
                                            ].map((row, ri) => (
                                                <tr key={ri}>
                                                    <td
                                                        className='py-2 pr-4 font-bold'
                                                        style={{
                                                            color: row.color,
                                                        }}>
                                                        {row.label}
                                                    </td>
                                                    {row.values.map((v, ci) => (
                                                        <td
                                                            key={ci}
                                                            className='text-center py-2 px-3 rounded'
                                                            style={{
                                                                color: row.highlight.includes(
                                                                    ci
                                                                )
                                                                    ? row.color
                                                                    : '#64748b',
                                                                background:
                                                                    row.highlight.includes(
                                                                        ci
                                                                    )
                                                                        ? `${row.color}22`
                                                                        : 'transparent',
                                                                fontWeight:
                                                                    row.highlight.includes(
                                                                        ci
                                                                    )
                                                                        ? 'bold'
                                                                        : 'normal',
                                                            }}>
                                                            {v}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className='border-t border-border pt-3'>
                                    <p className='text-sm text-muted-foreground'>
                                        <strong className='text-foreground'>
                                            Query result = minimum
                                        </strong>{' '}
                                        of all hash positions। Overestimate হতে
                                        পারে, underestimate হয় না। Conservative
                                        update error কমায়।
                                    </p>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'count_min_sketch.py — Python Implementation',
                    code: `import hashlib

class CountMinSketch:
    def __init__(self, width=1000, depth=5):
        """
        width: columns (counter array size)
        depth: rows (number of hash functions)
        Higher width/depth = more accuracy but more memory
        """
        self.width = width
        self.depth = depth
        self.table = [[0] * width for _ in range(depth)]

    def _hash(self, item, seed):
        """Hash item with seed to get column index"""
        h = hashlib.md5(f"{seed}:{item}".encode()).hexdigest()
        return int(h, 16) % self.width

    def increment(self, item, count=1):
        """Add item occurrence"""
        for row in range(self.depth):
            col = self._hash(item, row)
            self.table[row][col] += count

    def estimate(self, item):
        """Get estimated frequency — returns minimum across all rows"""
        return min(
            self.table[row][self._hash(item, row)]
            for row in range(self.depth)
        )

    def memory_bytes(self):
        return self.width * self.depth * 4  # 4 bytes per int


# Twitter Trending Topics Example
cms = CountMinSketch(width=10_000, depth=7)

# Simulate tweet stream
tweets = [
    "Bangladesh", "Cricket", "Bangladesh", "ICC",
    "Bangladesh", "World Cup", "Cricket", "Bangladesh",
    "Dhaka", "Bangladesh", "Cricket"
]

for word in tweets:
    cms.increment(word)

# Query frequencies
words = ["Bangladesh", "Cricket", "World Cup", "Dhaka", "Football"]
for word in words:
    freq = cms.estimate(word)
    print(f"{word}: ~{freq} occurrences")

# Bangladesh: ~5
# Cricket: ~3
# World Cup: ~1
# Dhaka: ~1
# Football: ~0  ← not in stream

# Heavy hitter detection (trending)
def get_trending(cms, candidates, threshold=2):
    return [w for w in candidates if cms.estimate(w) >= threshold]

print(get_trending(cms, words))
# Output: ['Bangladesh', 'Cricket']

print(f"Memory: {cms.memory_bytes()} bytes vs exact dict: huge")`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 Conservative Update কীভাবে Error কমায়?',
                    content: (
                        <p>
                            Standard update: সব positions increment করুন।
                            Conservative update:{' '}
                            <strong>
                                শুধু minimum value-র positions increment করুন
                            </strong>
                            । এতে overcounting কমে এবং estimate আরো accurate হয়।
                            Twitter-এর trending algorithm, network traffic
                            analysis, এবং database query optimization-এ এই
                            technique use হয়।
                        </p>
                    ),
                },
            ],
        },

        // ─────────────────────────────────────────────────────────────────
        // Section 5 — Comparison Table
        // ─────────────────────────────────────────────────────────────────
        {
            id: 'comparison-table',
            subHeader: { index: '005', title: 'Comparison' },
            title: (
                <SectionTitle>
                    তিনটা Structure এর Comparison
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Structure',
                        'Memory',
                        'Accuracy',
                        'Use Case',
                        'Supports Delete?',
                        'Real Tool',
                    ],
                    rows: [
                        [
                            <span className='font-bold text-primary font-mono'>
                                Bloom Filter
                            </span>,
                            '~1 MB / 1B items',
                            '99%+ (0 false negative)',
                            'Membership test',
                            <span className='text-red-700 dark:text-red-400'>No</span>,
                            'Redis Bloom (BF.ADD)',
                        ],
                        [
                            <span className='font-bold text-purple-700 dark:text-purple-400 font-mono'>
                                HyperLogLog
                            </span>,
                            '12 KB (fixed!)',
                            '~99.19%',
                            'Unique count (cardinality)',
                            <span className='text-red-700 dark:text-red-400'>No</span>,
                            'Redis PFCOUNT',
                        ],
                        [
                            <span className='font-bold text-orange-700 dark:text-orange-400 font-mono'>
                                Count-Min Sketch
                            </span>,
                            'Configurable',
                            '~99%',
                            'Frequency estimation',
                            <span className='text-yellow-700 dark:text-yellow-400'>
                                Sort of (decay)
                            </span>,
                            'Redis CMS.QUERY',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 কোনটা কখন Use করবেন?',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong className='text-primary'>
                                    Bloom Filter:
                                </strong>{' '}
                                &quot;এটা set-এ আছে কিনা?&quot; — web crawl
                                dedup, username availability, cache miss
                                reduction।
                            </p>
                            <p>
                                <strong className='text-purple-700 dark:text-purple-400'>
                                    HyperLogLog:
                                </strong>{' '}
                                &quot;কতটা unique element?&quot; — unique
                                visitors, unique views, DAU/MAU counting।
                            </p>
                            <p>
                                <strong className='text-orange-700 dark:text-orange-400'>
                                    Count-Min Sketch:
                                </strong>{' '}
                                &quot;এটা কতবার দেখা গেছে?&quot; — trending
                                topics, heavy hitters, network traffic top-K।
                            </p>
                        </div>
                    ),
                },
            ],
        },

        // ─────────────────────────────────────────────────────────────────
        // Section 6 — Redis Production Use
        // ─────────────────────────────────────────────────────────────────
        {
            id: 'redis-production',
            subHeader: { index: '006', title: 'Redis Production Use' },
            title: (
                <SectionTitle>
                    Redis এ Production Use
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Redis Stack এই তিনটা probabilistic structure
                            built-in support করে। Production-এ কোনো custom
                            implementation দরকার নেই।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'bash',
                    filename: 'redis-probabilistic.sh — All Three Structures',
                    code: `# ═══════════════════════════════════════════════════════
# 1. BLOOM FILTER — BF commands (RedisBloom module)
# ═══════════════════════════════════════════════════════

# Create bloom filter (error rate 0.01 = 1%, capacity 1M items)
BF.RESERVE crawled_urls 0.01 1000000

# Add URLs
BF.ADD crawled_urls "https://google.com"
BF.ADD crawled_urls "https://facebook.com"

# Check if URL was crawled before
BF.EXISTS crawled_urls "https://google.com"   # → 1 (probably yes)
BF.EXISTS crawled_urls "https://unknown.com"  # → 0 (definitely no)

# Batch add/check
BF.MADD crawled_urls "https://a.com" "https://b.com" "https://c.com"
BF.MEXISTS crawled_urls "https://a.com" "https://xyz.com"
# → [1, 0]


# ═══════════════════════════════════════════════════════
# 2. HYPERLOGLOG — PF commands (built into Redis core)
# ═══════════════════════════════════════════════════════

PFADD unique_visitors:2026-05-08 "user:1001" "user:1002" "user:1003"
PFCOUNT unique_visitors:2026-05-08  # → ~3

# Merge for weekly count
PFMERGE weekly_visitors weekly_visitors:mon weekly_visitors:tue


# ═══════════════════════════════════════════════════════
# 3. COUNT-MIN SKETCH — CMS commands (RedisBloom module)
# ═══════════════════════════════════════════════════════

# Initialize CMS (width=2000, depth=7)
CMS.INITBYDIM trending_words 2000 7

# Increment word counts from tweet stream
CMS.INCRBY trending_words "Bangladesh" 1 "Cricket" 1 "Bangladesh" 1

# Query frequencies
CMS.QUERY trending_words "Bangladesh" "Cricket" "Football"
# → [2, 1, 0]`,
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'redis-client.js — Node.js Redis Client Usage',
                    code: `const Redis = require('ioredis');

// Redis Stack connection (includes RedisBloom module)
const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

// ─── Bloom Filter ─────────────────────────────────────────
async function setupCrawler() {
  // Create bloom filter: 1% error rate, 10M capacity
  await redis.call('BF.RESERVE', 'crawled', '0.01', '10000000');

  async function shouldCrawl(url) {
    const exists = await redis.call('BF.EXISTS', 'crawled', url);
    if (exists === 0) {
      await redis.call('BF.ADD', 'crawled', url);
      return true; // Definitely new URL — crawl it
    }
    return false; // Probably already crawled — skip
  }

  return { shouldCrawl };
}

// ─── HyperLogLog ──────────────────────────────────────────
async function trackPageView(pageId, userId) {
  const key = \`page:unique:\${pageId}\`;
  await redis.pfadd(key, userId);
  const uniqueViews = await redis.pfcount(key);
  return uniqueViews;
}

// ─── Count-Min Sketch ─────────────────────────────────────
async function trackHashtag(hashtag) {
  await redis.call('CMS.INCRBY', 'trending', hashtag, '1');
}

async function getHashtagFrequency(hashtag) {
  const result = await redis.call('CMS.QUERY', 'trending', hashtag);
  return result[0]; // Estimated count
}

// Usage:
// trackPageView('video_abc', 'user_123') → returns unique view count
// trackHashtag('#Bangladesh') → increments
// getHashtagFrequency('#Bangladesh') → returns ~frequency`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '🔴 RedisBloom Module Required',
                    content: (
                        <p>
                            <strong>BF.*</strong> এবং{' '}
                            <strong>CMS.*</strong> commands-এর জন্য{' '}
                            <strong>RedisBloom module</strong> (Redis Stack-এর
                            part) load করতে হবে।{' '}
                            <strong>PFADD / PFCOUNT</strong> Redis core-এ আছে —
                            extra module দরকার নেই। Production-এ Redis Stack
                            Docker image use করলেন সব automatically available।
                        </p>
                    ),
                },
            ],
        },

        // ─────────────────────────────────────────────────────────────────
        // Section 7 — Real World Big Tech Usage
        // ─────────────────────────────────────────────────────────────────
        {
            id: 'real-world',
            subHeader: { index: '007', title: 'Real World Usage' },
            title: (
                <SectionTitle>
                    Real World: Big Tech কোথায় Use করে?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Company', 'Use Case', 'Structure', 'Benefit'],
                    rows: [
                        [
                            <span className='font-bold text-primary'>
                                Google
                            </span>,
                            'Web crawl URL deduplication',
                            'Bloom Filter',
                            'Skip already-crawled URLs without DB query',
                        ],
                        [
                            <span className='font-bold text-primary'>
                                LinkedIn
                            </span>,
                            'Unique visitors per post/profile',
                            'HyperLogLog',
                            '12 KB per counter vs GB of exact data',
                        ],
                        [
                            <span className='font-bold text-primary'>
                                Twitter / X
                            </span>,
                            'Trending topics (hashtag frequency)',
                            'Count-Min Sketch',
                            'Real-time top-K without storing every tweet',
                        ],
                        [
                            <span className='font-bold text-primary'>
                                Cassandra
                            </span>,
                            'SSTable key existence check',
                            'Bloom Filter',
                            'Avoid disk read if key definitely not in SSTable',
                        ],
                        [
                            <span className='font-bold text-primary'>
                                Chrome Browser
                            </span>,
                            'Malicious URL check (Safe Browsing)',
                            'Bloom Filter',
                            'Client-side check without sending URL to server',
                        ],
                        [
                            <span className='font-bold text-primary'>
                                Akamai CDN
                            </span>,
                            'Cache hot objects identification',
                            'Count-Min Sketch',
                            'Detect frequently requested content for caching',
                        ],
                        [
                            <span className='font-bold text-primary'>
                                Redis
                            </span>,
                            'HyperLogLog (PFADD/PFCOUNT)',
                            'HyperLogLog',
                            'Built-in DAU / unique views at massive scale',
                        ],
                        [
                            <span className='font-bold text-primary'>
                                Amazon
                            </span>,
                            'Recently viewed items deduplication',
                            'Bloom Filter',
                            'Avoid showing already-seen recommendations',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 Cassandra এবং Bloom Filter',
                    content: (
                        <p>
                            Cassandra প্রতিটা SSTable-এর জন্য একটা Bloom
                            Filter maintain করে। Read request আসলে আগে Bloom
                            Filter check করে — &quot;এই key কি এই SSTable-এ
                            আছে?&quot; যদি &quot;definitely not&quot; হয় তাহলে
                            disk read skip করে। এতে{' '}
                            <strong>
                                unnecessary disk I/O ৬০-৮০% কমে যায়
                            </strong>
                            ।
                        </p>
                    ),
                },
            ],
        },

        // ─────────────────────────────────────────────────────────────────
        // Section 8 — Interview Tips
        // ─────────────────────────────────────────────────────────────────
        {
            id: 'interview-tips',
            subHeader: { index: '008', title: 'Interview Tips' },
            title: (
                <SectionTitle>
                    Interview Tips — Probabilistic Structures
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-4'>
                            <ContentParagraph>
                                System design interview-এ এই structures mention
                                করলেন{' '}
                                <strong className='text-foreground'>
                                    senior-level knowledge
                                </strong>{' '}
                                দেখা যায়। কিন্তু জানতে হবে কখন mention করতে হবে
                                এবং trade-off কীভাবে explain করতে হবে।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-3'>
                            <p className='font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4'>
                                Common Interview Questions
                            </p>
                            {[
                                {
                                    q: 'How would you design a web crawler that doesn\'t revisit URLs?',
                                    a: 'Bloom Filter দিয়ে already-visited URLs track করুন। HashSet-এর ৫০,০০০ গুণ কম memory-তে।',
                                    tag: 'Web Crawler',
                                    color: 'text-primary border-primary/20',
                                },
                                {
                                    q: 'How does YouTube count unique views efficiently?',
                                    a: 'HyperLogLog use করুন। ১ বিলিয়ন unique viewers-ও মাত্র ১২ KB memory-তে count করা যায়।',
                                    tag: 'Video Platform',
                                    color: 'text-purple-700 dark:text-purple-400 border-purple-400/20',
                                },
                                {
                                    q: 'How would you find trending topics on Twitter in real-time?',
                                    a: 'Count-Min Sketch দিয়ে hashtag frequency track করুন। Fixed memory-তে top-K find করুন।',
                                    tag: 'Social Media',
                                    color: 'text-orange-700 dark:text-orange-400 border-orange-400/20',
                                },
                                {
                                    q: 'How does Cassandra optimize read performance?',
                                    a: 'SSTable-এ Bloom Filter use করে unnecessary disk read এড়ায়। ৬০-৮০% I/O reduction।',
                                    tag: 'Database Internals',
                                    color: 'text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
                                },
                                {
                                    q: 'Design a username availability check at scale',
                                    a: 'Bloom Filter দিয়ে first check করুন। Definitely not taken → no DB query। Probably taken → DB confirm।',
                                    tag: 'User Service',
                                    color: 'text-yellow-700 dark:text-yellow-400 border-yellow-400/20',
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className='bg-muted/30 border border-border rounded-lg p-4'>
                                    <div className='flex items-start gap-3'>
                                        <span
                                            className={`font-mono text-xs px-2 py-1 border rounded flex-shrink-0 ${item.color}`}>
                                            {item.tag}
                                        </span>
                                        <div>
                                            <p className='text-sm font-semibold text-foreground mb-1'>
                                                Q: {item.q}
                                            </p>
                                            <p className='text-sm text-muted-foreground'>
                                                <strong className='text-foreground'>
                                                    A:
                                                </strong>{' '}
                                                {item.a}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Magic Phrase for Interviews',
                    content: (
                        <p>
                            Interview-এ সবসময় বলুন:{' '}
                            <strong>
                                &quot;If we can tolerate a small error rate,
                                probabilistic data structures give us huge
                                memory and speed gains.&quot;
                            </strong>{' '}
                            তারপর specific structure mention করুন। এই phrase
                            interviewer-কে বুঝিয়ে দেয় যে আপনি trade-off
                            consciously accept করছো — এটাই senior-level
                            thinking।
                        </p>
                    ),
                },
            ],
        },

        // ─────────────────────────────────────────────────────────────────
        // Section 9 — Phase Complete Banner + Next Learning Path
        // ─────────────────────────────────────────────────────────────────
        {
            id: 'phase-complete-banner',
            subHeader: { index: '009', title: 'Course Complete' },
            title: (
                <SectionTitle>
                    Course Complete — Next Learning Path
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-10'>
                            {/* ── Part A: Course Complete Celebration Banner ── */}
                            <div className='bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8 text-center'>
                                <div className='text-6xl mb-4'>🎉</div>
                                <h2 className='text-3xl font-black text-emerald-700 dark:text-emerald-400 mb-3'>
                                    অভিনন্দন!
                                </h2>
                                <p className='text-xl font-bold text-foreground mb-2'>
                                    System Design Mastery সম্পূর্ণ!
                                </p>
                                <p className='text-muted-foreground text-base mb-8 max-w-xl mx-auto leading-relaxed'>
                                    আপনি <strong className='text-emerald-700 dark:text-emerald-400'>৫টা Phase</strong> এবং{' '}
                                    <strong className='text-emerald-700 dark:text-emerald-400'>২৯টা Topic</strong> সম্পূর্ণ
                                    করেছেনো। আপনি এখন একজন{' '}
                                    <strong className='text-foreground'>System Design Expert</strong>।
                                </p>

                                {/* Stats grid — all phases */}
                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-8'>
                                    {[
                                        {
                                            phase: 'Phase 1',
                                            title: 'Foundations',
                                            topics: 4,
                                            color: 'border-emerald-500/40 bg-emerald-500/10',
                                            textColor: 'text-emerald-700 dark:text-emerald-400',
                                        },
                                        {
                                            phase: 'Phase 2',
                                            title: 'Core Components',
                                            topics: 6,
                                            color: 'border-emerald-500/40 bg-emerald-500/10',
                                            textColor: 'text-emerald-700 dark:text-emerald-400',
                                        },
                                        {
                                            phase: 'Phase 3',
                                            title: 'Distributed Systems',
                                            topics: 6,
                                            color: 'border-emerald-500/40 bg-emerald-500/10',
                                            textColor: 'text-emerald-700 dark:text-emerald-400',
                                        },
                                        {
                                            phase: 'Phase 4',
                                            title: 'Real-World Systems',
                                            topics: 7,
                                            color: 'border-emerald-500/40 bg-emerald-500/10',
                                            textColor: 'text-emerald-700 dark:text-emerald-400',
                                        },
                                        {
                                            phase: 'Phase 5',
                                            title: 'Advanced Topics',
                                            topics: 6,
                                            color: 'border-yellow-400/40 bg-yellow-400/10',
                                            textColor: 'text-yellow-700 dark:text-yellow-400',
                                        },
                                    ].map((p, i) => (
                                        <div
                                            key={i}
                                            className={`border rounded-lg p-4 text-center ${p.color}`}>
                                            <div className='text-2xl mb-1'>
                                                ✅
                                            </div>
                                            <p
                                                className={`font-mono text-xs font-bold mb-1 ${p.textColor}`}>
                                                {p.phase}
                                            </p>
                                            <p className='text-xs text-foreground font-semibold mb-1'>
                                                {p.title}
                                            </p>
                                            <p className='font-mono text-xs text-muted-foreground'>
                                                {p.topics} topics
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Motivational quote */}
                                <div className='border border-yellow-400/30 bg-yellow-400/5 rounded-lg p-5 max-w-lg mx-auto'>
                                    <p className='text-yellow-700 dark:text-yellow-400 font-bold text-base italic leading-relaxed'>
                                        &ldquo;জ্ঞান অর্জন করা শেষ হয় না — কিন্তু
                                        foundation গড়া শেষ হয়। আপনি সেই foundation
                                        গড়েছো। এখন আপনি যেকোনো system design
                                        challenge face করতে পারবেন।&rdquo;
                                    </p>
                                    <p className='text-muted-foreground text-xs mt-2 font-mono'>
                                        — System Design Mastery Course
                                    </p>
                                </div>
                            </div>

                            {/* ── Part B: Next Learning Path ── */}
                            <div>
                                <h3 className='text-2xl font-black text-foreground mb-2'>
                                    এখন কোথায় যাবেন?
                                </h3>
                                <p className='text-muted-foreground text-base mb-8'>
                                    Deep Mastery Roadmap — আপনার পরের পদক্ষেপ
                                </p>

                                {/* ── Subsection 1: Books ── */}
                                <div className='mb-10'>
                                    <div className='flex items-center gap-3 mb-5'>
                                        <span className='font-mono text-xs px-3 py-1 border border-primary/30 text-primary bg-primary/5 rounded'>
                                            📚 Must-Read Books
                                        </span>
                                        <p className='text-sm text-muted-foreground font-mono'>
                                            বইয়ের তালিকা — System Design
                                            Mastery-র জন্য
                                        </p>
                                    </div>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
                                        {[
                                            {
                                                title: 'Designing Data-Intensive Applications',
                                                author: 'Martin Kleppmann',
                                                desc: 'System design এর Bible। Distributed systems, data models, replication, partitioning — সব কিছু depth এ। এটা না পড়লে senior engineer হওয়া কঠিন।',
                                                level: 'Must Read',
                                                tag: 'THE BIBLE',
                                                levelColor:
                                                    'bg-red-500/10 text-red-700 dark:text-red-400',
                                                tagColor:
                                                    'bg-yellow-400/10 text-yellow-700 dark:text-yellow-400 border-yellow-400/30',
                                            },
                                            {
                                                title: 'System Design Interview Vol. 1 & 2',
                                                author: 'Alex Xu',
                                                desc: 'Interview preparation এর best resource। Real case studies, structured approach। TinyURL থেকে YouTube — সব covered।',
                                                level: 'Beginner-Intermediate',
                                                tag: 'INTERVIEW PREP',
                                                levelColor:
                                                    'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
                                                tagColor:
                                                    'bg-primary/10 text-primary border-primary/30',
                                            },
                                            {
                                                title: 'Designing Distributed Systems',
                                                author: 'Brendan Burns (Kubernetes Creator)',
                                                desc: 'Kubernetes creator লিখেছেন। Container patterns, distributed system patterns। Sidecar, Ambassador, Adapter patterns depth এ।',
                                                level: 'Intermediate',
                                                tag: 'DISTRIBUTED SYSTEMS',
                                                levelColor:
                                                    'bg-primary/10 text-primary',
                                                tagColor:
                                                    'bg-purple-400/10 text-purple-700 dark:text-purple-400 border-purple-400/30',
                                            },
                                            {
                                                title: 'Release It!',
                                                author: 'Michael T. Nygard',
                                                desc: 'Production system stability এর classic। Circuit breaker pattern-এর origin এই বইতে। Real outpost stories যেখান থেকে শেখা যায়।',
                                                level: 'Intermediate',
                                                tag: 'PRODUCTION',
                                                levelColor:
                                                    'bg-primary/10 text-primary',
                                                tagColor:
                                                    'bg-orange-400/10 text-orange-700 dark:text-orange-400 border-orange-400/30',
                                            },
                                            {
                                                title: 'Building Microservices',
                                                author: 'Sam Newman',
                                                desc: 'Microservices এর go-to book। Service design, decomposition, communication patterns। Real-world migration stories।',
                                                level: 'Intermediate',
                                                tag: 'MICROSERVICES',
                                                levelColor:
                                                    'bg-primary/10 text-primary',
                                                tagColor:
                                                    'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
                                            },
                                            {
                                                title: 'Site Reliability Engineering',
                                                author: 'Google SRE Team',
                                                desc: 'Google এর SRE practices। Error budgets, SLO/SLA, on-call, incident management। Production operations এর Bible।',
                                                level: 'Advanced',
                                                tag: 'SRE / OPS',
                                                levelColor:
                                                    'bg-red-500/10 text-red-700 dark:text-red-400',
                                                tagColor:
                                                    'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30',
                                            },
                                            {
                                                title: 'The Art of Scalability',
                                                author: 'Abbott & Fisher',
                                                desc: 'Scale cube model। How eBay, Apple scaled। Business + technical perspective একসাথে। AKF scale cube এর definitive guide।',
                                                level: 'Advanced',
                                                tag: 'SCALABILITY',
                                                levelColor:
                                                    'bg-red-500/10 text-red-700 dark:text-red-400',
                                                tagColor:
                                                    'bg-yellow-400/10 text-yellow-700 dark:text-yellow-400 border-yellow-400/30',
                                            },
                                            {
                                                title: 'Clean Architecture',
                                                author: 'Robert C. Martin',
                                                desc: 'Software architecture principles। SOLID, dependency rule, hexagonal architecture। Maintainable এবং testable system design।',
                                                level: 'Intermediate',
                                                tag: 'ARCHITECTURE',
                                                levelColor:
                                                    'bg-primary/10 text-primary',
                                                tagColor:
                                                    'bg-purple-400/10 text-purple-700 dark:text-purple-400 border-purple-400/30',
                                            },
                                        ].map((book, idx) => (
                                            <div
                                                key={idx}
                                                className='bg-muted/30 border border-border rounded-lg p-5 hover:border-primary/30 transition-colors'>
                                                <div className='flex items-start gap-3'>
                                                    <span className='font-mono text-2xl text-primary font-black flex-shrink-0'>
                                                        0{idx + 1}
                                                    </span>
                                                    <div>
                                                        <h4 className='font-bold text-foreground mb-1'>
                                                            {book.title}
                                                        </h4>
                                                        <p className='text-xs text-muted-foreground mb-2'>
                                                            — {book.author}
                                                        </p>
                                                        <p className='text-sm text-muted-foreground mb-3 leading-relaxed'>
                                                            {book.desc}
                                                        </p>
                                                        <div className='flex gap-2 flex-wrap'>
                                                            <span
                                                                className={`font-mono text-xs px-2 py-0.5 rounded ${book.levelColor}`}>
                                                                {book.level}
                                                            </span>
                                                            <span
                                                                className={`font-mono text-xs px-2 py-0.5 border rounded ${book.tagColor}`}>
                                                                {book.tag}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* ── Subsection 2: Practical Next Steps ── */}
                                <div className='mb-10'>
                                    <div className='flex items-center gap-3 mb-5'>
                                        <span className='font-mono text-xs px-3 py-1 border border-purple-400/30 text-purple-700 dark:text-purple-400 bg-purple-400/5 rounded'>
                                            🚀 Practical Next Steps
                                        </span>
                                        <p className='text-sm text-muted-foreground font-mono'>
                                            প্র্যাক্টিক্যাল পদক্ষেপ
                                        </p>
                                    </div>
                                    <div className='space-y-4'>
                                        {[
                                            {
                                                step: '01',
                                                title: 'Open Source Contribution',
                                                desc: 'Redis, Kafka, PostgreSQL, Kubernetes এর codebase পড়ো। Issues solve করুন। Real distributed systems বোঝার সেরা উপায় — real code দেখা।',
                                                tags: [
                                                    'Redis',
                                                    'Kafka',
                                                    'PostgreSQL',
                                                    'Kubernetes',
                                                ],
                                                tagColor:
                                                    'border-primary/30 text-primary bg-primary/5',
                                            },
                                            {
                                                step: '02',
                                                title: 'Production Project Build করুন',
                                                desc: 'একটা real system build করুন যেটায় এই course এর সব concepts use হয় — distributed, scalable, observable, secure। Portfolio project হিসেবেও কাজে আসবেন।',
                                                tags: [
                                                    'Docker',
                                                    'Kubernetes',
                                                    'Monitoring',
                                                    'CI/CD',
                                                ],
                                                tagColor:
                                                    'border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5',
                                            },
                                            {
                                                step: '03',
                                                title: 'Postmortem Study করুন',
                                                desc: 'Netflix, AWS, Cloudflare এর public postmortems পড়ো। Real incident থেকে শেখো — কেন system fail করে, কীভাবে recover করে।',
                                                tags: [
                                                    'Netflix Tech Blog',
                                                    'AWS Architecture',
                                                    'Cloudflare Blog',
                                                ],
                                                tagColor:
                                                    'border-orange-400/30 text-orange-700 dark:text-orange-400 bg-orange-400/5',
                                            },
                                            {
                                                step: '04',
                                                title: 'System Design Interview Practice',
                                                desc: 'প্রতি সপ্তাহে ২টা mock system design interview করুন। Excalidraw দিয়ে diagram আঁকুন। Time-box করুন — ৪৫ মিনিট।',
                                                tags: [
                                                    'Excalidraw',
                                                    'Mock Interview',
                                                    'FAANG Prep',
                                                ],
                                                tagColor:
                                                    'border-purple-400/30 text-purple-700 dark:text-purple-400 bg-purple-400/5',
                                            },
                                            {
                                                step: '05',
                                                title: 'Community তে Join করুন',
                                                desc: 'High Scalability blog, AWS Architecture blog, Engineering blogs (Netflix Tech, Uber Engineering) follow করুন। Community থেকে শেখা accelerate করে।',
                                                tags: [
                                                    'High Scalability',
                                                    'Uber Engineering',
                                                    'Netflix Tech',
                                                ],
                                                tagColor:
                                                    'border-yellow-400/30 text-yellow-700 dark:text-yellow-400 bg-yellow-400/5',
                                            },
                                        ].map((item, i) => (
                                            <div
                                                key={i}
                                                className='bg-muted/30 border border-border rounded-lg p-5 hover:border-primary/20 transition-colors'>
                                                <div className='flex items-start gap-4'>
                                                    <span className='font-mono text-3xl font-black text-primary/50 flex-shrink-0 leading-none'>
                                                        {item.step}
                                                    </span>
                                                    <div className='flex-1'>
                                                        <h4 className='font-bold text-foreground mb-2'>
                                                            {item.title}
                                                        </h4>
                                                        <p className='text-sm text-muted-foreground leading-relaxed mb-3'>
                                                            {item.desc}
                                                        </p>
                                                        <div className='flex flex-wrap gap-2'>
                                                            {item.tags.map(
                                                                (tag, ti) => (
                                                                    <span
                                                                        key={ti}
                                                                        className={`font-mono text-xs px-2 py-0.5 border rounded ${item.tagColor}`}>
                                                                        {tag}
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* ── Subsection 3: Interview Readiness Checklist ── */}
                                <div className='bg-yellow-400/5 border border-yellow-400/30 rounded-xl p-8'>
                                    <div className='flex items-center gap-3 mb-6'>
                                        <span className='text-3xl'>🎯</span>
                                        <div>
                                            <h3 className='text-xl font-black text-yellow-700 dark:text-yellow-400'>
                                                Interview Readiness Checklist
                                            </h3>
                                            <p className='text-sm text-muted-foreground'>
                                                আপনি এখন কী কী করতে পারেন
                                            </p>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                        {[
                                            'যেকোনো system design question এ structured approach নিতে পারেন (requirements → estimation → architecture → deep dive)',
                                            'CAP theorem ব্যাখ্যা করতে পারেন এবং real systems-এ apply করতে পারেন',
                                            'Database selection justify করতে পারেন (SQL vs NoSQL vs NewSQL — when and why)',
                                            'Scalability bottlenecks identify করতে পারেন এবং solutions propose করতে পারেন',
                                            'Distributed system trade-offs discuss করতে পারেন (consistency, availability, partition tolerance)',
                                            'Real-world systems (Uber, Twitter, YouTube, WhatsApp) design করতে পারেন',
                                            'Security, observability, deployment strategy confidently explain করতে পারেন',
                                            'Probabilistic data structures (Bloom Filter, HyperLogLog) কখন use করতে হয় জানেন',
                                            'Microservices vs monolith trade-offs discuss করতে পারেন',
                                            'FAANG level system design interview এ confident feel হচ্ছে ✨',
                                        ].map((item, i) => (
                                            <div
                                                key={i}
                                                className='flex items-start gap-3 bg-yellow-400/5 border border-yellow-400/20 rounded-lg p-3'>
                                                <span className='text-emerald-700 dark:text-emerald-400 font-bold text-lg flex-shrink-0 leading-none mt-0.5'>
                                                    ✓
                                                </span>
                                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                                    {item}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='mt-6 text-center'>
                                        <p className='text-yellow-700 dark:text-yellow-400 font-bold text-base'>
                                            আপনি এখন System Design-এ Expert।
                                        </p>
                                        <p className='text-muted-foreground text-sm mt-1'>
                                            এই journey শেষ নয় — এটা শুরু। Best of luck! 🚀
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
            ],
        },
    ],

    // ─────────────────────────────────────────────────────────────────────
    // Summary Table
    // ─────────────────────────────────────────────────────────────────────
    summary: {
        headers: [
            'Structure',
            'Memory',
            'Accuracy',
            'False Neg?',
            'Use Case',
            'Real Tool',
        ],
        rows: [
            [
                <span className='font-bold text-primary font-mono'>
                    Bloom Filter
                </span>,
                '~1 MB / 1B items',
                '99%+',
                <span className='text-emerald-700 dark:text-emerald-400 font-bold'>Never</span>,
                'Membership test (is URL crawled?)',
                'Redis BF.ADD',
            ],
            [
                <span className='font-bold text-purple-700 dark:text-purple-400 font-mono'>
                    HyperLogLog
                </span>,
                '12 KB (always)',
                '~99.19%',
                <span className='text-yellow-700 dark:text-yellow-400'>N/A</span>,
                'Unique count (DAU, unique views)',
                'Redis PFCOUNT',
            ],
            [
                <span className='font-bold text-orange-700 dark:text-orange-400 font-mono'>
                    Count-Min Sketch
                </span>,
                'Configurable',
                '~99%',
                <span className='text-yellow-700 dark:text-yellow-400'>N/A</span>,
                'Frequency estimate (trending topics)',
                'Redis CMS.QUERY',
            ],
            [
                <span className='font-bold text-muted-foreground font-mono'>
                    HashSet (exact)
                </span>,
                '50 GB / 1B items',
                '100%',
                <span className='text-emerald-700 dark:text-emerald-400 font-bold'>Never</span>,
                'When exactness is required',
                'Java HashSet',
            ],
        ],
    },

    // ─────────────────────────────────────────────────────────────────────
    // Knowledge Check — 10 MCQs
    // ─────────────────────────────────────────────────────────────────────
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'Bloom Filter কখন false negative দেয়?',
                options: [
                    {
                        key: 'a',
                        text: 'প্রতিটা query-তে',
                        isCorrect: false,
                        explanation:
                            'Bloom Filter প্রতিটা query-তে false negative দেয় না।',
                    },
                    {
                        key: 'b',
                        text: 'bit array full হলে',
                        isCorrect: false,
                        explanation:
                            'bit array full হলে false positive বাড়ে, কিন্তু false negative তখনও হয় না।',
                    },
                    {
                        key: 'c',
                        text: 'কখনো না',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Bloom Filter কখনো false negative দেয় না। যদি বলে "definitely not in set" — সেটা সত্যিই নেই। False positive হতে পারে (বলে "আছে" কিন্তু নেই) কিন্তু false negative কখনো না।',
                    },
                    {
                        key: 'd',
                        text: 'hash collision হলে',
                        isCorrect: false,
                        explanation:
                            'Hash collision false positive বাড়ায়, false negative তৈরি করে না।',
                    },
                ],
            },
            {
                id: 2,
                text: 'HyperLogLog এর memory usage কত?',
                options: [
                    {
                        key: 'a',
                        text: 'Input size এর সাথে linear বাড়ে',
                        isCorrect: false,
                        explanation:
                            'এটাই HyperLogLog-এর magic — memory linear না, constant।',
                    },
                    {
                        key: 'b',
                        text: '~12 KB regardless of input size',
                        isCorrect: true,
                        explanation:
                            'সঠিক। HyperLogLog ~12 KB constant memory use করে — ১ million বা ১ billion unique elements, same memory। এটাই এর superpower।',
                    },
                    {
                        key: 'c',
                        text: '১ MB per million elements',
                        isCorrect: false,
                        explanation:
                            'HyperLogLog-এর memory input size-এর সাথে বাড়ে না।',
                    },
                    {
                        key: 'd',
                        text: 'Depends on Redis version',
                        isCorrect: false,
                        explanation:
                            'Redis HyperLogLog সবসময় ~12 KB use করে।',
                    },
                ],
            },
            {
                id: 3,
                text: 'Count-Min Sketch এর query result কীভাবে পানয়া যায়?',
                options: [
                    {
                        key: 'a',
                        text: 'সব hash positions এর sum',
                        isCorrect: false,
                        explanation:
                            'Sum করলেন overcounting হবে কারণ collisions থাকে।',
                    },
                    {
                        key: 'b',
                        text: 'সব hash positions এর average',
                        isCorrect: false,
                        explanation:
                            'Average-ও accurate না কারণ collision-এ inflated values আসে।',
                    },
                    {
                        key: 'c',
                        text: 'সব hash positions এর minimum',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Count-Min Sketch-এ query = minimum of all hash positions। Minimum নেওয়া হয় কারণ collision inflate করে — minimum most accurate estimate দেয়।',
                    },
                    {
                        key: 'd',
                        text: 'শুধু প্রথম hash position-এর value',
                        isCorrect: false,
                        explanation:
                            'একটা position-এর value accurate না — multiple positions দরকার।',
                    },
                ],
            },
            {
                id: 4,
                text: 'Redis এ HyperLogLog এর command কোনটা?',
                options: [
                    {
                        key: 'a',
                        text: 'HLADD / HLCOUNT',
                        isCorrect: false,
                        explanation:
                            'Redis-এ HLADD কোনো command নেই।',
                    },
                    {
                        key: 'b',
                        text: 'BF.ADD / BF.EXISTS',
                        isCorrect: false,
                        explanation:
                            'BF.ADD / BF.EXISTS Bloom Filter-এর command।',
                    },
                    {
                        key: 'c',
                        text: 'PFADD / PFCOUNT',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Redis HyperLogLog commands: PFADD (add element), PFCOUNT (get unique count), PFMERGE (merge multiple HLLs)। PF = Philippe Flajolet, যিনি algorithm invent করেছেনিলেন।',
                    },
                    {
                        key: 'd',
                        text: 'CMS.INCRBY / CMS.QUERY',
                        isCorrect: false,
                        explanation:
                            'CMS.INCRBY / CMS.QUERY Count-Min Sketch-এর command।',
                    },
                ],
            },
            {
                id: 5,
                text: 'Bloom Filter এ element delete করা যায়?',
                options: [
                    {
                        key: 'a',
                        text: 'হ্যাঁ, সহজেই',
                        isCorrect: false,
                        explanation:
                            'Standard Bloom Filter-এ deletion সহজ না।',
                    },
                    {
                        key: 'b',
                        text: 'না (basic bloom filter তে)',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Basic Bloom Filter-এ deletion করা যায় না কারণ একটা bit multiple element share করতে পারে — delete করলেন অন্য elements-এর bits ভেঙে যাবেন। Counting Bloom Filter use করলেন deletion possible।',
                    },
                    {
                        key: 'c',
                        text: 'হ্যাঁ, কিন্তু performance কমে',
                        isCorrect: false,
                        explanation:
                            'Standard Bloom Filter-এ deletion করার mechanism নেই।',
                    },
                    {
                        key: 'd',
                        text: 'শুধু Redis Bloom-এ deletion possible',
                        isCorrect: false,
                        explanation:
                            'Redis Bloom Filter-ও standard Bloom Filter — deletion support করে না।',
                    },
                ],
            },
            {
                id: 6,
                text: 'Count-Min Sketch কোথায় use হয়?',
                options: [
                    {
                        key: 'a',
                        text: 'Exact membership test',
                        isCorrect: false,
                        explanation:
                            'Exact membership test = Bloom Filter। Count-Min Sketch frequency estimation-এর জন্য।',
                    },
                    {
                        key: 'b',
                        text: 'Unique element counting',
                        isCorrect: false,
                        explanation:
                            'Unique element counting = HyperLogLog। Count-Min Sketch frequency-র জন্য।',
                    },
                    {
                        key: 'c',
                        text: 'Frequency estimation, trending topics',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Count-Min Sketch frequency estimation-এ best — Twitter trending topics, network heavy hitters, database query frequency। Fixed memory-তে approximate frequency দেয়।',
                    },
                    {
                        key: 'd',
                        text: 'Sorting algorithm',
                        isCorrect: false,
                        explanation:
                            'Count-Min Sketch sorting-এর জন্য নয়।',
                    },
                ],
            },
            {
                id: 7,
                text: 'Bloom Filter এর false positive rate কমাতে কী করতে হয়?',
                options: [
                    {
                        key: 'a',
                        text: 'hash function speed বাড়াতে হবে',
                        isCorrect: false,
                        explanation:
                            'Hash function speed false positive rate affect করে না।',
                    },
                    {
                        key: 'b',
                        text: 'bit array বড় করতে হবে',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Bit array size বাড়ালে (এবং hash function count optimize করলেন) false positive rate কমে। Larger bit array = fewer collisions = lower false positive। Rule: প্রতি element ~10 bits use করলেন ~1% false positive rate পানয়া যায়।',
                    },
                    {
                        key: 'c',
                        text: 'element কম add করতে হবে',
                        isCorrect: false,
                        explanation:
                            'Element কম add করা practical solution নয়।',
                    },
                    {
                        key: 'd',
                        text: 'hash function count কমাতে হবে',
                        isCorrect: false,
                        explanation:
                            'Hash function count কমালে accuracy কমে — optimal count আছে।',
                    },
                ],
            },
            {
                id: 8,
                text: 'HyperLogLog এর error rate কত?',
                options: [
                    {
                        key: 'a',
                        text: '~10%',
                        isCorrect: false,
                        explanation:
                            '10% error rate অনেক বেশি — HyperLogLog অনেক accurate।',
                    },
                    {
                        key: 'b',
                        text: '~5%',
                        isCorrect: false,
                        explanation:
                            '5% error rate-ও HyperLogLog-এর actual error rate নয়।',
                    },
                    {
                        key: 'c',
                        text: '~0.81% standard error',
                        isCorrect: true,
                        explanation:
                            'সঠিক। HyperLogLog-এর standard error ≈ 0.81%। এর মানে ৯৯.১৯%+ accuracy। Production-এ DAU, unique views-এর জন্য এই accuracy সম্পূর্ণ sufficient।',
                    },
                    {
                        key: 'd',
                        text: '~0.01% (near perfect)',
                        isCorrect: false,
                        explanation:
                            '0.01% অনেক কম — HyperLogLog-এর actual error ~0.81%।',
                    },
                ],
            },
            {
                id: 9,
                text: 'Cassandra Bloom Filter কেন use করে?',
                options: [
                    {
                        key: 'a',
                        text: 'Data encryption-এর জন্য',
                        isCorrect: false,
                        explanation:
                            'Bloom Filter encryption-এর জন্য নয়।',
                    },
                    {
                        key: 'b',
                        text: 'Network compression-এর জন্য',
                        isCorrect: false,
                        explanation:
                            'Bloom Filter network compression করে না।',
                    },
                    {
                        key: 'c',
                        text: 'SSTable এ key আছে কিনা check করতে',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Cassandra প্রতিটা SSTable-এর জন্য Bloom Filter রাখে। Read request এলে আগে Bloom Filter check করে — "definitely not in this SSTable" হলে disk read skip করে। এতে ৬০-৮০% unnecessary I/O কমে।',
                    },
                    {
                        key: 'd',
                        text: 'Write throughput বাড়াতে',
                        isCorrect: false,
                        explanation:
                            'Bloom Filter write throughput optimize করে না — read optimization করে।',
                    },
                ],
            },
            {
                id: 10,
                text: 'Probabilistic data structures এর main trade-off কী?',
                options: [
                    {
                        key: 'a',
                        text: 'Latency vs Throughput',
                        isCorrect: false,
                        explanation:
                            'Latency vs Throughput probabilistic structures-এর primary trade-off নয়।',
                    },
                    {
                        key: 'b',
                        text: 'Availability vs Consistency',
                        isCorrect: false,
                        explanation:
                            'Availability vs Consistency CAP theorem-এর trade-off।',
                    },
                    {
                        key: 'c',
                        text: 'Exactness vs Memory/Speed',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Probabilistic structures-এর core trade-off হলো Exactness vs Memory/Speed। Exact answer-এর বদলে approximate answer accept করুন — বিনিময়ে ১০,০০০x কম memory এবং অনেক বেশি speed। Production-এ এই trade-off প্রায়ই worth it।',
                    },
                    {
                        key: 'd',
                        text: 'Read vs Write performance',
                        isCorrect: false,
                        explanation:
                            'Read vs Write trade-off database-এর, probabilistic structures-এর primary concern নয়।',
                    },
                ],
            },
        ],
    },

    // ─────────────────────────────────────────────────────────────────────
    // Assignment
    // ─────────────────────────────────────────────────────────────────────
    assignment: {
        title: 'Probabilistic Data Structure Implementation করুন',
        time: '৩-৪ ঘন্টা',
        difficulty: 'Expert',
        tasks: [
            <span>
                <strong>Bloom Filter from Scratch (JavaScript):</strong>{' '}
                BloomFilter class implement করুন — constructor(size, hashCount),
                _hash(item, seed), add(item), mightContain(item)। ১ লাখ random
                string add করুন। False positive rate measure করুন।
            </span>,
            <span>
                <strong>HyperLogLog with Redis:</strong> Node.js দিয়ে PFADD /
                PFCOUNT use করুন। ১ লাখ unique user visit simulate করুন। Exact
                count vs HyperLogLog estimate compare করুন। Memory difference
                measure করুন।
            </span>,
            <span>
                <strong>Count-Min Sketch Implementation:</strong> Python দিয়ে
                CountMinSketch class implement করুন। Twitter tweet stream
                simulate করুন (১০ লাখ tweets, ১০ হাজার unique words)। Top-10
                trending words বের করুন।
            </span>,
            <span>
                <strong>Performance Benchmarks vs HashSet:</strong> সব তিনটা
                structure-এর জন্য benchmark করুন — insert time, query time,
                memory usage। HashSet-এর সাথে compare করুন। Results table-এ
                present করুন।
            </span>,
        ],
        deliverables: [
            <span>
                Bloom Filter implementation + false positive rate test results
            </span>,
            <span>
                Redis HyperLogLog demo + exact vs approximate comparison
            </span>,
            <span>Count-Min Sketch + trending words output</span>,
            <span>
                Performance benchmark table (memory + speed vs HashSet)
            </span>,
        ],
    },

    // ─────────────────────────────────────────────────────────────────────
    // Practical Lab
    // ─────────────────────────────────────────────────────────────────────
    practicalLab: {
        title: 'Redis Bloom + HyperLogLog + Count-Min Sketch',
        subtitle: 'Redis Stack + Node.js + RedisBloom module',
        steps: [
            {
                title: 'Redis Stack Setup করুন',
                description:
                    'Docker দিয়ে Redis Stack run করুন: docker run -p 6379:6379 redis/redis-stack-server। Node.js ioredis install করুন। Connection verify করুন।',
            },
            {
                title: 'Bloom Filter — URL Deduplication',
                description:
                    'BF.RESERVE দিয়ে filter create করুন (1% error, 10M capacity)। ১০ লাখ URL add করুন। Query করুন — already-crawled URL skip হচ্ছে কিনা দেখুন।',
            },
            {
                title: 'HyperLogLog — Unique Visitor Counter',
                description:
                    'PFADD দিয়ে daily visitors track করুন। Duplicate users add করুন — count-এ effect হয় কিনা দেখুন। PFMERGE দিয়ে weekly count বের করুন।',
            },
            {
                title: 'Count-Min Sketch — Trending Topics',
                description:
                    'CMS.INITBYDIM দিয়ে sketch create করুন। Tweet stream simulate করুন। CMS.QUERY দিয়ে top hashtags বের করুন।',
            },
            {
                title: 'Memory Comparison করুন',
                description:
                    'Probabilistic structures-এর memory usage measure করুন। JavaScript Set দিয়ে same data রাখুন। Memory difference quantify করুন — কতগুণ কম?',
            },
        ],
        codeBlock: {
            language: 'javascript',
            filename: 'probabilistic-lab.js — Complete Lab Code',
            code: `const Redis = require('ioredis');
const redis = new Redis({ host: 'localhost', port: 6379 });

// ══════════════════════════════════════════════════════════
// LAB 1: BLOOM FILTER — URL Crawler Deduplication
// ══════════════════════════════════════════════════════════
async function bloomFilterLab() {
  console.log('\\n=== Bloom Filter Lab ===');

  // Create Bloom Filter: 1% error, 1M capacity
  try {
    await redis.call('BF.RESERVE', 'lab:crawled', '0.01', '1000000');
  } catch (e) {
    // Already exists
  }

  // Simulate crawling
  const urls = Array.from({ length: 100 }, (_, i) => \`https://site-\${i}.com\`);

  let crawled = 0, skipped = 0;
  for (const url of urls) {
    const exists = await redis.call('BF.EXISTS', 'lab:crawled', url);
    if (exists === 0) {
      await redis.call('BF.ADD', 'lab:crawled', url);
      crawled++;
    } else {
      skipped++;
    }
  }

  // Re-check same URLs (should all be "skipped" now)
  let falseNegatives = 0;
  for (const url of urls) {
    const exists = await redis.call('BF.EXISTS', 'lab:crawled', url);
    if (exists === 0) falseNegatives++;
  }

  console.log(\`Crawled: \${crawled}, Skipped: \${skipped}\`);
  console.log(\`False negatives: \${falseNegatives} (should be 0 always!)\`);
}


// ══════════════════════════════════════════════════════════
// LAB 2: HYPERLOGLOG — Daily Active Users
// ══════════════════════════════════════════════════════════
async function hyperLogLogLab() {
  console.log('\\n=== HyperLogLog Lab ===');

  const key = 'lab:dau:today';
  await redis.del(key);

  // Simulate 10,000 user visits (some duplicates)
  const exactSet = new Set();
  for (let i = 0; i < 10000; i++) {
    const userId = \`user:\${Math.floor(Math.random() * 8000)}\`; // ~8000 unique
    await redis.pfadd(key, userId);
    exactSet.add(userId);
  }

  const hllCount = await redis.pfcount(key);
  const exactCount = exactSet.size;
  const error = Math.abs(hllCount - exactCount) / exactCount * 100;

  console.log(\`Exact unique users: \${exactCount}\`);
  console.log(\`HyperLogLog estimate: \${hllCount}\`);
  console.log(\`Error rate: \${error.toFixed(2)}%\`);

  // Memory comparison
  const hllMemory = 12 * 1024; // ~12 KB
  const setMemory = exactCount * 50; // ~50 bytes per string
  console.log(\`HyperLogLog memory: ~12 KB\`);
  console.log(\`Exact Set memory: ~\${(setMemory / 1024).toFixed(0)} KB\`);
  console.log(\`Memory saved: \${(setMemory / hllMemory).toFixed(0)}x\`);
}


// ══════════════════════════════════════════════════════════
// LAB 3: COUNT-MIN SKETCH — Trending Hashtags
// ══════════════════════════════════════════════════════════
async function countMinSketchLab() {
  console.log('\\n=== Count-Min Sketch Lab ===');

  const key = 'lab:trending';
  try {
    await redis.call('CMS.INITBYDIM', key, '5000', '7');
  } catch (e) {
    // Already exists
  }

  // Simulate tweet stream
  const hashtags = [
    '#Bangladesh', '#Cricket', '#Bangladesh', '#ICCWorldCup',
    '#Bangladesh', '#Dhaka', '#Bangladesh', '#Cricket',
    '#Bangladesh', '#Bangladesh', '#Cricket', '#Tech'
  ];

  for (const tag of hashtags) {
    await redis.call('CMS.INCRBY', key, tag, '1');
  }

  // Query top hashtags
  const toCheck = ['#Bangladesh', '#Cricket', '#ICCWorldCup', '#Dhaka', '#Football'];
  console.log('\\nHashtag frequencies:');
  for (const tag of toCheck) {
    const count = await redis.call('CMS.QUERY', key, tag);
    console.log(\`  \${tag}: ~\${count[0]}\`);
  }
}


// Run all labs
(async () => {
  await bloomFilterLab();
  await hyperLogLogLab();
  await countMinSketchLab();
  redis.disconnect();
})();`,
        },
        tip: 'এই তিনটা structure একসাথে implement করলেন বুঝতে পারবেন কেন Big Tech এগুলো use করে। Bloom Filter false negative কখনো দেয় না — এটা practically verify করুন। HyperLogLog-এর 12 KB memory দেখে অবাক হবে। Redis Stack Docker container-এ সব commands ready আছে।',
    },

    // ─────────────────────────────────────────────────────────────────────
    // Phase Complete
    // ─────────────────────────────────────────────────────────────────────
    phaseComplete: {
        title: '🎉 System Design Mastery সম্পূর্ণ! সমগ্র Course Finished',
        description:
            'System Design Mastery সম্পূর্ণ! ৫টা Phase, ২৯টা Topic — আপনি এখন একজন System Design Expert।',
        topics: [
            { title: 'Security in System Design', id: 'security' },
            { title: 'Observability & Monitoring', id: 'observability' },
            { title: 'Cloud Architecture Patterns', id: 'cloud-arch' },
            {
                title: 'CQRS & Event Sourcing',
                id: 'cqrs-event-sourcing',
            },
            { title: 'Deployment Patterns', id: 'deployment-patterns' },
            {
                title: 'Advanced Data Structures',
                id: 'advanced-ds',
            },
        ],
        nextPhase: undefined,
    },
};
