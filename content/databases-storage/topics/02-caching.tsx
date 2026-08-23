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

export const cachingContent: TopicData = {
    id: 'caching',
    sections: [
        // ─────────────────────────────────────────────────────────────────────
        // 001 — Core Concept
        // ─────────────────────────────────────────────────────────────────────
        {
            id: 'core-concept',
            subHeader: { index: '001', title: 'Core Concept' },
            title: (
                <SectionTitle>
                    Cache কী এবং কেন দরকার?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                ধরুন আপনি প্রতিদিন অফিসে যান। রাস্তায় একটা
                                দোকান আছে যেখান থেকে চা কিনো। আপনি কি প্রতিদিন
                                দোকানদারকে নতুন করে বলুন &quot;আমি চা খাই, চিনি
                                কম দিও&quot;? না — সে মনে রাখে। এটাই{' '}
                                <strong className='text-foreground'>Cache</strong>{' '}
                                — frequently used data কে database এর বদলে
                                memory তে রেখে দ্রুত serve করা।
                            </ContentParagraph>
                            <ContentParagraph>
                                Technical ভাবে বলতে গেলে: Database থেকে data
                                আনতে{' '}
                                <strong className='text-foreground'>
                                    100-500ms
                                </strong>{' '}
                                লাগে। Cache থেকে আনতে লাগে{' '}
                                <strong className='text-emerald-700 dark:text-emerald-400'>1ms</strong>
                                এরও কম। পার্থক্যটা ৫০০ গুণ পর্যন্ত।
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
                            <strong>Cache</strong> হলো একটি high-speed data
                            storage layer যেখানে frequently accessed data
                            temporarily store করা হয়, যাতে পরবর্তীবার সেই
                            data এর request আসলে মূল database বা server এ না
                            গিয়ে সরাসরি cache থেকে serve করা যায়।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-8 mt-4'>
                            <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-6'>
                                Cache ছাড়া কী হয়?
                            </h3>
                            <ContentParagraph>
                                ধরুন একটা news website। প্রতি second এ ১০,০০০
                                user &quot;আজকের top news&quot; দেখতে চাইছে।
                                Cache ছাড়া = ১০,০০০ database queries প্রতি
                                second। Database crash। Site down।
                            </ContentParagraph>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-red-500' />
                                        WITHOUT CACHE
                                    </h4>
                                    <div className='space-y-2 text-sm text-muted-foreground font-mono'>
                                        <p>User → App Server → Database</p>
                                        <p>User → App Server → Database</p>
                                        <p>User → App Server → Database</p>
                                        <p className='text-red-700 dark:text-red-400 font-bold mt-3'>
                                            ১০,০০০ queries/sec → DB CRASH 💥
                                        </p>
                                    </div>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-emerald-500' />
                                        WITH CACHE
                                    </h4>
                                    <div className='space-y-2 text-sm text-muted-foreground font-mono'>
                                        <p>User → Cache HIT ✅ (1ms)</p>
                                        <p>User → Cache HIT ✅ (1ms)</p>
                                        <p>
                                            User → Cache MISS → DB (1st time)
                                        </p>
                                        <p className='text-emerald-700 dark:text-emerald-400 font-bold mt-3'>
                                            DB পায় মাত্র ১টা query 🚀
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
            ],
        },

        // ─────────────────────────────────────────────────────────────────────
        // 002 — Why It Matters
        // ─────────────────────────────────────────────────────────────────────
        {
            id: 'why-it-matters',
            subHeader: { index: '002', title: 'Why It Matters' },
            title: (
                <SectionTitle>কেন Cache জানা দরকার?</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                            <div className='p-8 border-r border-b border-border bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-blue-500' />
                                    PERFORMANCE
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Database query:{' '}
                                    <span className='text-red-700 dark:text-red-400 font-bold'>
                                        100–500ms
                                    </span>
                                    <br />
                                    Cache hit:{' '}
                                    <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                        &lt;1ms
                                    </span>
                                    <br />
                                    পার্থক্য ৫০০ গুণ। User দ্রুত response পায়,
                                    app fast মনে হয়।
                                </p>
                            </div>
                            <div className='p-8 border-b border-border bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-yellow-500' />
                                    COST SAVING
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Facebook cache ব্যবহার করে{' '}
                                    <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                        লক্ষ কোটি টাকা
                                    </span>{' '}
                                    বাঁচায়। Database server অনেক বেশি expensive।
                                    Cache server সস্তা এবং fast।
                                </p>
                            </div>
                            <div className='p-8 border-r border-border bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-purple-500' />
                                    SCALABILITY
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    DB scale করা কঠিন এবং ব্যয়বহুল। Cache
                                    layer add করলেন DB এর load{' '}
                                    <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                        ৯০%+ কমে
                                    </span>{' '}
                                    যায়। এতে কম DB server দিয়েই বেশি traffic
                                    handle করা যায়।
                                </p>
                            </div>
                            <div className='p-8 bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-emerald-500' />
                                    AVAILABILITY
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Database down হলেও cache থেকে serve করা
                                    যায়। User হয়তো একটু পুরনো data দেখবেন, কিন্তু{' '}
                                    <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                        site up থাকবেন
                                    </span>
                                    ।
                                </p>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: 'Real Numbers — বিশ্বাস না হলে এগুলো দেখুন',
                    content: (
                        <ul className='space-y-2 text-sm leading-relaxed'>
                            <li>
                                <strong>Twitter:</strong> প্রতি second এ ৬,০০০+
                                tweets। Cache ছাড়া সম্ভবই না।
                            </li>
                            <li>
                                <strong>Amazon:</strong> ১০০ms delay = ১%
                                sales drop। Cache মানে সরাসরি revenue।
                            </li>
                            <li>
                                <strong>Google:</strong> ৫০০ms slow = ২০% কম
                                searches। Speed = user retention।
                            </li>
                            <li>
                                <strong>Facebook Memcached:</strong> ট্রিলিয়ন
                                object cache করে প্রতিদিন। তাদের entire
                                infrastructure cache-first।
                            </li>
                        </ul>
                    ),
                },
            ],
        },

        // ─────────────────────────────────────────────────────────────────────
        // 003 — How It Works
        // ─────────────────────────────────────────────────────────────────────
        {
            id: 'how-it-works',
            subHeader: { index: '003', title: 'How It Works' },
            title: (
                <SectionTitle>Cache কীভাবে কাজ করে?</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-8'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-emerald-500' />
                                        CACHE HIT ✅
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed mb-4'>
                                        Request আসলো → Cache check করুন → Data
                                        পানয়া গেলো → সাথে সাথে return করুন।
                                        Database touch করার দরকারই নেই।
                                    </p>
                                    <p className='text-xs font-mono text-emerald-700 dark:text-emerald-400'>
                                        Response time: &lt;1ms
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-red-500' />
                                        CACHE MISS ❌
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed mb-4'>
                                        Request আসলো → Cache check করুন → Data
                                        নেই → Database থেকে আনো → Cache এ
                                        রাখুন → Return করুন।
                                    </p>
                                    <p className='text-xs font-mono text-red-700 dark:text-red-400'>
                                        Response time: 100-500ms (DB query)
                                    </p>
                                </div>
                            </div>
                            <ContentParagraph>
                                প্রথম request এ সবসময় cache miss হবে। কিন্তু
                                তারপর থেকে same data এর request আসলে cache
                                থেকে serve হবে। এই pattern টাই caching এর মূল
                                শক্তি।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-6 mt-8'>
                            Cache Eviction Policies — Cache পূর্ণ হলে কোনটা
                            বাদ দেবে?
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Policy', 'নাম', 'কীভাবে কাজ করে', 'কখন ব্যবহার করুন'],
                    rows: [
                        [
                            <span className='font-bold text-primary font-mono'>
                                LRU
                            </span>,
                            'Least Recently Used',
                            'সবচেয়ে পুরনো সময়ে access হওয়া item বাদ দিন',
                            <span className='text-emerald-700 dark:text-emerald-400'>
                                সবচেয়ে common — general purpose
                            </span>,
                        ],
                        [
                            <span className='font-bold text-primary font-mono'>
                                LFU
                            </span>,
                            'Least Frequently Used',
                            'সবচেয়ে কম বার access হওয়া item বাদ দিন',
                            'যখন popularity matter করে',
                        ],
                        [
                            <span className='font-bold text-primary font-mono'>
                                TTL
                            </span>,
                            'Time To Live',
                            'নির্দিষ্ট সময় পর automatically expire করুন',
                            'News, session, rate limiting',
                        ],
                        [
                            <span className='font-bold text-primary font-mono'>
                                FIFO
                            </span>,
                            'First In First Out',
                            'যেটা আগে এসেছে সেটা আগে বাদ দিন',
                            'Simple queue-like caching',
                        ],
                    ],
                },
            ],
        },

        // ─────────────────────────────────────────────────────────────────────
        // 004 — Cache Strategies
        // ─────────────────────────────────────────────────────────────────────
        {
            id: 'cache-strategies',
            subHeader: { index: '004', title: 'Cache Strategies' },
            title: (
                <SectionTitle>
                    ৪টি প্রধান Caching Pattern
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-10'>
                            {/* Cache-Aside */}
                            <div>
                                <h3 className='text-xl font-bold mb-3 flex items-center gap-3'>
                                    <span className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 bg-blue-400/10 px-3 py-1'>
                                        01
                                    </span>
                                    Cache-Aside (Lazy Loading)
                                </h3>
                                <ContentParagraph className='mb-4'>
                                    Application নিজেই cache manage করে। Read
                                    করার সময়: cache check → miss হলে DB থেকে
                                    আনো → cache এ রাখুন → return করুন। এটাই সবচেয়ে
                                    popular pattern। Redis সাথে এই pattern সবচেয়ে
                                    বেশি দেখা যায়।
                                </ContentParagraph>
                                <div className='font-mono text-xs text-muted-foreground bg-card/50 border border-border p-4 space-y-1'>
                                    <p>
                                        1. GET /user/123 →{' '}
                                        <span className='text-blue-700 dark:text-blue-400'>
                                            cache.get(&quot;user:123&quot;)
                                        </span>
                                    </p>
                                    <p>
                                        2. Cache MISS →{' '}
                                        <span className='text-yellow-700 dark:text-yellow-400'>
                                            db.query(&quot;SELECT * FROM users WHERE id=123&quot;)
                                        </span>
                                    </p>
                                    <p>
                                        3.{' '}
                                        <span className='text-emerald-700 dark:text-emerald-400'>
                                            cache.set(&quot;user:123&quot;, data, TTL=300)
                                        </span>
                                    </p>
                                    <p>
                                        4. Return data to user ✅
                                    </p>
                                </div>
                            </div>

                            {/* Write-Through */}
                            <div>
                                <h3 className='text-xl font-bold mb-3 flex items-center gap-3'>
                                    <span className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 bg-blue-400/10 px-3 py-1'>
                                        02
                                    </span>
                                    Write-Through
                                </h3>
                                <ContentParagraph>
                                    Data write করার সময় cache এবং database
                                    দুটোতেই একসাথে write করুন। Cache সবসময় DB
                                    এর সাথে sync থাকে। Write একটু slow কিন্তু
                                    data always consistent। Banking, payment
                                    system এর জন্য ideal।
                                </ContentParagraph>
                            </div>

                            {/* Write-Behind */}
                            <div>
                                <h3 className='text-xl font-bold mb-3 flex items-center gap-3'>
                                    <span className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 bg-blue-400/10 px-3 py-1'>
                                        03
                                    </span>
                                    Write-Behind (Write-Back)
                                </h3>
                                <ContentParagraph>
                                    Cache এ write করুন, DB তে পরে (asynchronously)
                                    write করুন। Write অনেক fast। কিন্তু cache
                                    crash হলে data loss হতে পারে। High-write
                                    throughput apps এর জন্য — gaming scores,
                                    analytics counters।
                                </ContentParagraph>
                            </div>

                            {/* Read-Through */}
                            <div>
                                <h3 className='text-xl font-bold mb-3 flex items-center gap-3'>
                                    <span className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 bg-blue-400/10 px-3 py-1'>
                                        04
                                    </span>
                                    Read-Through
                                </h3>
                                <ContentParagraph>
                                    Cache-Aside এর মতোই, কিন্তু এখানে cache
                                    নিজেই DB থেকে data load করে। Application
                                    শুধু cache কে জিজ্ঞেস করে। Cache miss হলে
                                    cache নিজেই DB থেকে আনে। Application code
                                    clean থাকে।
                                </ContentParagraph>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'কোনটা কখন ব্যবহার করবেন?',
                    content: (
                        <>
                            Interview এ বলুন:{' '}
                            <strong>Cache-Aside সবচেয়ে flexible</strong> —
                            read-heavy apps এর জন্য best। Write consistency
                            দরকার হলে Write-Through। Speed critical হলে
                            Write-Behind (data loss risk মাথায় রেখে)।
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Pattern',
                        'Read Speed',
                        'Write Speed',
                        'Consistency',
                        'Best For',
                    ],
                    rows: [
                        [
                            <span className='font-bold text-primary'>
                                Cache-Aside
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Fast
                            </span>,
                            'Normal',
                            'Eventual',
                            'General purpose, read-heavy',
                        ],
                        [
                            <span className='font-bold text-primary'>
                                Write-Through
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Fast
                            </span>,
                            <span className='text-red-700 dark:text-red-400'>Slow</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Strong
                            </span>,
                            'Banking, payment systems',
                        ],
                        [
                            <span className='font-bold text-primary'>
                                Write-Behind
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Fast
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Very Fast
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>Weak</span>,
                            'Gaming scores, analytics',
                        ],
                        [
                            <span className='font-bold text-primary'>
                                Read-Through
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Fast
                            </span>,
                            'Normal',
                            'Eventual',
                            'Clean code, ORM-like usage',
                        ],
                    ],
                },
            ],
        },

        // ─────────────────────────────────────────────────────────────────────
        // 005 — Redis Deep Dive
        // ─────────────────────────────────────────────────────────────────────
        {
            id: 'redis-deep-dive',
            subHeader: { index: '005', title: 'Redis Deep Dive' },
            title: (
                <SectionTitle>
                    Redis — এর ভেতরে কী আছে?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                Redis (Remote Dictionary Server) হলো world এর
                                most popular in-memory data store। এটা{' '}
                                <strong className='text-foreground'>
                                    single-threaded
                                </strong>{' '}
                                হওয়া সত্ত্বেও{' '}
                                <strong className='text-emerald-700 dark:text-emerald-400'>
                                    1 million+ operations/second
                                </strong>{' '}
                                handle করতে পারে। কারণ সব data RAM এ থাকে —
                                disk I/O নেই।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Redis কেন Special?',
                    content: (
                        <ul className='space-y-2 text-sm leading-relaxed'>
                            <li>
                                <strong>In-Memory:</strong> সব data RAM এ —
                                disk read নেই, তাই lightning fast
                            </li>
                            <li>
                                <strong>Rich Data Structures:</strong> শুধু
                                key-value না — String, Hash, List, Set, Sorted
                                Set, Stream
                            </li>
                            <li>
                                <strong>Persistence:</strong> RAM এ থাকলেও disk
                                এ backup রাখতে পারে (RDB/AOF)
                            </li>
                            <li>
                                <strong>Atomic Operations:</strong> Race
                                condition ছাড়াই counter বাড়াও, কমাও
                            </li>
                            <li>
                                <strong>Pub/Sub:</strong> Message broker হিসেবেও
                                কাজ করে
                            </li>
                            <li>
                                <strong>Lua Scripting:</strong> Complex atomic
                                operations লেখা যায়
                            </li>
                        </ul>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-6 mt-8'>
                            Redis Data Structures — প্রতিটার নিজস্ব use case
                            আছে
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Data Structure',
                        'Key Command',
                        'Use Case',
                    ],
                    rows: [
                        [
                            <span className='font-bold text-primary font-mono'>
                                String
                            </span>,
                            <span className='font-mono text-xs text-blue-700 dark:text-blue-400'>
                                GET, SET, INCR, DECR
                            </span>,
                            'Simple cache, counters, session tokens',
                        ],
                        [
                            <span className='font-bold text-primary font-mono'>
                                Hash
                            </span>,
                            <span className='font-mono text-xs text-blue-700 dark:text-blue-400'>
                                HSET, HGET, HGETALL
                            </span>,
                            'User profile, product details (object store)',
                        ],
                        [
                            <span className='font-bold text-primary font-mono'>
                                List
                            </span>,
                            <span className='font-mono text-xs text-blue-700 dark:text-blue-400'>
                                LPUSH, RPUSH, LRANGE
                            </span>,
                            'Queue, recent activity feed, job queue',
                        ],
                        [
                            <span className='font-bold text-primary font-mono'>
                                Set
                            </span>,
                            <span className='font-mono text-xs text-blue-700 dark:text-blue-400'>
                                SADD, SMEMBERS, SINTER
                            </span>,
                            'Unique visitors, tags, friend lists',
                        ],
                        [
                            <span className='font-bold text-primary font-mono'>
                                Sorted Set
                            </span>,
                            <span className='font-mono text-xs text-blue-700 dark:text-blue-400'>
                                ZADD, ZRANGE, ZRANK
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400'>
                                Leaderboard, priority queue, rate limiting
                            </span>,
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-6 mt-10'>
                                Redis Persistence — Data হারাবে না
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-blue-500' />
                                        RDB — Snapshot
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        নির্দিষ্ট interval এ (যেমন প্রতি ৫
                                        মিনিটে) পুরো memory এর snapshot disk
                                        এ save করুন। Fast restart। কিন্তু last
                                        snapshot এর পর এর data হারাতে পারে।{' '}
                                        <span className='text-yellow-700 dark:text-yellow-400'>
                                            Default Redis behavior।
                                        </span>
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-emerald-500' />
                                        AOF — Append Only File
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        প্রতিটা write operation log এ রাখুন।
                                        Crash হলে log replay করে data recover
                                        করুন। More durable কিন্তু file বড় হয়।{' '}
                                        <span className='text-emerald-700 dark:text-emerald-400'>
                                            Critical data এর জন্য best।
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-6 mt-10'>
                            Redis vs Memcached
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['বিষয়', 'Redis', 'Memcached'],
                    rows: [
                        [
                            'Data Structures',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                String, Hash, List, Set, Sorted Set, Stream
                            </span>,
                            <span className='text-red-700 dark:text-red-400'>
                                শুধু String (key-value)
                            </span>,
                        ],
                        [
                            'Persistence',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                আছে (RDB + AOF)
                            </span>,
                            <span className='text-red-700 dark:text-red-400'>নেই</span>,
                        ],
                        [
                            'Replication',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                আছে (Master-Replica)
                            </span>,
                            <span className='text-red-700 dark:text-red-400'>নেই</span>,
                        ],
                        [
                            'Pub/Sub',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                আছে
                            </span>,
                            <span className='text-red-700 dark:text-red-400'>নেই</span>,
                        ],
                        [
                            'Multi-threading',
                            'Single-threaded (I/O multi-threaded v6+)',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Multi-threaded
                            </span>,
                        ],
                        [
                            'কখন ব্যবহার করুন',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Almost always — more features
                            </span>,
                            'Simple cache, multi-thread দরকার হলে',
                        ],
                    ],
                },
            ],
        },

        // ─────────────────────────────────────────────────────────────────────
        // 006 — Code Examples
        // ─────────────────────────────────────────────────────────────────────
        {
            id: 'code-examples',
            subHeader: { index: '006', title: 'Code Examples' },
            title: (
                <SectionTitle>হাতে-কলমে Code</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Redis এর basic operations থেকে শুরু করে production-ready
                            Cache-Aside pattern এবং Rate Limiting পর্যন্ত — এই
                            তিনটা code snippet আপনার interview এবং real project
                            দুটোতেই কাজে আসবেন।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'redis_basics.py',
                    code: `import redis
import json

# Redis connection
r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

# ──────────────────────────────────────────────
# 1. STRING — Simple cache
# ──────────────────────────────────────────────
# Set with TTL (expires in 5 minutes)
r.set('user:123:name', 'Ripon Ahmed', ex=300)
name = r.get('user:123:name')   # 'Ripon Ahmed'

# ──────────────────────────────────────────────
# 2. HASH — Object store (User profile)
# ──────────────────────────────────────────────
r.hset('user:123', mapping={
    'name': 'Ripon Ahmed',
    'email': 'ripon@example.com',
    'age': '28'
})
user = r.hgetall('user:123')
# {'name': 'Ripon Ahmed', 'email': 'ripon@example.com', 'age': '28'}

# Single field পড়ো
email = r.hget('user:123', 'email')

# ──────────────────────────────────────────────
# 3. COUNTER — Atomic increment (race-condition safe)
# ──────────────────────────────────────────────
r.set('page:home:views', 0)
r.incr('page:home:views')   # 1
r.incr('page:home:views')   # 2
r.incrby('page:home:views', 10)  # 12

# ──────────────────────────────────────────────
# 4. SORTED SET — Leaderboard
# ──────────────────────────────────────────────
# Game leaderboard — player: score
r.zadd('leaderboard:game1', {
    'alice': 9500,
    'bob': 8700,
    'charlie': 9800,
    'diana': 7200
})

# Top 3 players (highest score first)
top3 = r.zrevrange('leaderboard:game1', 0, 2, withscores=True)
# [('charlie', 9800.0), ('alice', 9500.0), ('bob', 8700.0)]

# Alice এর rank (0-indexed)
rank = r.zrevrank('leaderboard:game1', 'alice')  # 1 (2nd place)`,
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'cacheService.js',
                    code: `const redis = require('redis');

// Redis client setup
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
client.connect();

// ──────────────────────────────────────────────────────────────
// Cache-Aside Pattern — Production-ready implementation
// ──────────────────────────────────────────────────────────────
class CacheService {
  constructor(defaultTTL = 300) {  // Default 5 minutes TTL
    this.defaultTTL = defaultTTL;
  }

  // Generic cache-aside method
  async getOrSet(key, fetchFn, ttl = this.defaultTTL) {
    try {
      // 1. Cache check করুন
      const cached = await client.get(key);
      if (cached) {
        console.log(\`Cache HIT: \${key}\`);
        return JSON.parse(cached);
      }

      // 2. Cache miss — DB থেকে আনো
      console.log(\`Cache MISS: \${key} — fetching from DB\`);
      const data = await fetchFn();

      // 3. Cache এ রাখুন
      await client.setEx(key, ttl, JSON.stringify(data));

      return data;
    } catch (err) {
      // Cache fail হলেও app চলবে — DB থেকে directly serve করুন
      console.error('Cache error:', err);
      return fetchFn();
    }
  }

  // Cache invalidation
  async invalidate(key) {
    await client.del(key);
    console.log(\`Cache invalidated: \${key}\`);
  }

  // Pattern-based invalidation (e.g., all user:* keys)
  async invalidatePattern(pattern) {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
      console.log(\`Invalidated \${keys.length} keys matching: \${pattern}\`);
    }
  }
}

// ──────────────────────────────────────────────────────────────
// Express.js route তে ব্যবহার
// ──────────────────────────────────────────────────────────────
const cache = new CacheService();

app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  const user = await cache.getOrSet(
    \`user:\${id}\`,
    () => db.query('SELECT * FROM users WHERE id = ?', [id]),
    600  // 10 minutes TTL
  );

  res.json(user);
});

// Write হলে cache invalidate করুন
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('UPDATE users SET ? WHERE id = ?', [req.body, id]);
  await cache.invalidate(\`user:\${id}\`);  // Stale cache মুছে দিন
  res.json({ success: true });
});`,
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'rateLimiter.js',
                    code: `// ──────────────────────────────────────────────────────────────
// Rate Limiting with Redis — Sliding Window Algorithm
// ──────────────────────────────────────────────────────────────
// Redis এর atomic INCR + EXPIRE ব্যবহার করে race-condition ছাড়াই
// rate limiting implement করা যায়

async function rateLimiter(userId, limit = 100, windowSeconds = 60) {
  const key = \`ratelimit:\${userId}:\${Math.floor(Date.now() / 1000 / windowSeconds)}\`;

  // Atomic increment + TTL set (Lua script দিয়ে atomic করা)
  const script = \`
    local current = redis.call('INCR', KEYS[1])
    if current == 1 then
      redis.call('EXPIRE', KEYS[1], ARGV[1])
    end
    return current
  \`;

  const count = await client.eval(script, {
    keys: [key],
    arguments: [windowSeconds.toString()]
  });

  const remaining = Math.max(0, limit - count);
  const allowed = count <= limit;

  return { allowed, count, remaining, limit };
}

// Express middleware হিসেবে ব্যবহার
const rateLimitMiddleware = (limit = 100, window = 60) => {
  return async (req, res, next) => {
    const userId = req.user?.id || req.ip;
    const { allowed, remaining } = await rateLimiter(userId, limit, window);

    // Standard rate limit headers set করুন
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);

    if (!allowed) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: \`Rate limit exceeded. Try again in \${window} seconds.\`
      });
    }

    next();
  };
};

// Route এ apply করুন
app.use('/api/', rateLimitMiddleware(100, 60));  // 100 req/min
app.use('/api/auth/', rateLimitMiddleware(5, 60));  // Login: 5 req/min`,
                },
            ],
        },

        // ─────────────────────────────────────────────────────────────────────
        // 007 — Real World Use Cases
        // ─────────────────────────────────────────────────────────────────────
        {
            id: 'real-world',
            subHeader: { index: '007', title: 'Real World' },
            title: (
                <SectionTitle>Real World Use Cases</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                            <div className='p-8 border-r border-b border-border bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-blue-500' />
                                    TWITTER — Timeline Cache
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    প্রতিটা user এর home timeline Redis এ cache
                                    করা আছে। যখন কেউ tweet করে, তখন তার
                                    followers এর cached timeline update হয়।
                                    এই{' '}
                                    <span className='text-blue-700 dark:text-blue-400 font-bold'>
                                        &quot;fan-out on write&quot;
                                    </span>{' '}
                                    approach ব্যবহার করে millisecond এ timeline
                                    serve করা হয়।
                                </p>
                            </div>
                            <div className='p-8 border-b border-border bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-yellow-500' />
                                    AMAZON — Product Cache
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Popular product details, prices, inventory
                                    সব cache এ থাকে। ১০০ms delay = ১% sales
                                    drop — তাই Amazon এর entire product catalog
                                    heavily cached।{' '}
                                    <span className='text-yellow-700 dark:text-yellow-400 font-bold'>
                                        Cache = direct revenue।
                                    </span>
                                </p>
                            </div>
                            <div className='p-8 border-r border-border bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-purple-500' />
                                    GAMING — Leaderboard
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Redis Sorted Set দিয়ে real-time leaderboard।
                                    লক্ষ player এর score ZADD দিয়ে update,
                                    ZREVRANGE দিয়ে top players।{' '}
                                    <span className='text-purple-700 dark:text-purple-400 font-bold'>
                                        O(log N) complexity
                                    </span>{' '}
                                    — ১ মিলিয়ন players হলেও fast।
                                </p>
                            </div>
                            <div className='p-8 bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-emerald-500' />
                                    AUTH — Session Store
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    JWT token blacklist, session data, OTP
                                    সব Redis এ। TTL দিয়ে auto-expire।{' '}
                                    <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                        Stateless servers
                                    </span>{' '}
                                    maintain করতে Redis session store অপরিহার্য।
                                </p>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: 'Cache Stampede (Thundering Herd Problem)',
                    content: (
                        <div className='space-y-3 text-sm leading-relaxed'>
                            <p>
                                <strong>কী হয়:</strong> একটা popular cache key
                                expire হলো। একই সময়ে ১০,০০০ request আসলো।
                                সবাই cache miss দেখলো। সবাই DB তে গেলো।
                                Database crash।
                            </p>
                            <p>
                                <strong>সমাধান:</strong>
                            </p>
                            <ul className='space-y-1 ml-4'>
                                <li>
                                    <strong>Mutex/Lock:</strong> প্রথম request
                                    DB থেকে আনবে, বাকিরা wait করবেন।
                                </li>
                                <li>
                                    <strong>Probabilistic Early Expiration:</strong>{' '}
                                    Expiry আসার আগেই randomly refresh।
                                </li>
                                <li>
                                    <strong>Stale-While-Revalidate:</strong>{' '}
                                    Expired data serve করুন, background এ
                                    refresh করুন।
                                </li>
                            </ul>
                        </div>
                    ),
                },
            ],
        },

        // ─────────────────────────────────────────────────────────────────────
        // 008 — Interview Prep
        // ─────────────────────────────────────────────────────────────────────
        {
            id: 'interview-prep',
            subHeader: { index: '008', title: 'Interview Prep' },
            title: (
                <SectionTitle>
                    Common Interview Questions
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q1: Cache Invalidation কীভাবে করবেন?',
                    content: (
                        <div className='space-y-2 text-sm leading-relaxed'>
                            <p className='font-bold text-foreground'>
                                এটাই caching এর সবচেয়ে কঠিন সমস্যা।
                            </p>
                            <ul className='space-y-1'>
                                <li>
                                    <strong>TTL (Time-To-Live):</strong>{' '}
                                    সবচেয়ে সহজ — নির্দিষ্ট সময় পর auto-expire।
                                    Stale data কিছুক্ষণ থাকতে পারে।
                                </li>
                                <li>
                                    <strong>Event-driven:</strong> Data update
                                    হলে সাথে সাথে cache delete করুন। Strong
                                    consistency কিন্তু extra code।
                                </li>
                                <li>
                                    <strong>Write-Through:</strong> Write এর
                                    সময় cache এবং DB দুটোই update — সবসময়
                                    consistent।
                                </li>
                            </ul>
                            <p className='text-muted-foreground italic mt-2'>
                                Interview তে বলুন: &quot;Use case ভেদে TTL +
                                event-driven combination ব্যবহার করবো।&quot;
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q2: Cache Hit Rate কীভাবে বাড়াবে?',
                    content: (
                        <div className='space-y-2 text-sm leading-relaxed'>
                            <p>
                                <strong>Cache Hit Rate</strong> = (Cache Hits /
                                Total Requests) × 100%। ভালো system এ ৯০%+
                                হওয়া উচিত।
                            </p>
                            <ul className='space-y-1'>
                                <li>
                                    ✅ TTL বাড়াও (কিন্তু staleness বাড়বে)
                                </li>
                                <li>✅ Cache size বাড়াও</li>
                                <li>
                                    ✅ Better eviction policy (LRU → LFU)
                                </li>
                                <li>
                                    ✅ Cache key design উন্নত করুন — coarse
                                    grained keys
                                </li>
                                <li>
                                    ✅ Hot data pre-warm করুন (app start এ
                                    popular data load করুন)
                                </li>
                            </ul>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q3: Redis single-threaded হয়েও কীভাবে এত fast?',
                    content: (
                        <div className='space-y-2 text-sm leading-relaxed'>
                            <p>
                                এটা একটা common trap question। Redis slow না
                                কারণ:
                            </p>
                            <ul className='space-y-1'>
                                <li>
                                    <strong>All in RAM:</strong> Disk I/O নেই
                                    — memory access nanosecond এ
                                </li>
                                <li>
                                    <strong>No locking overhead:</strong>{' '}
                                    Single thread মানে mutex/lock এর
                                    complexity নেই
                                </li>
                                <li>
                                    <strong>I/O Multiplexing:</strong> epoll/kqueue
                                    দিয়ে thousands of connections handle করে
                                </li>
                                <li>
                                    <strong>Simple operations:</strong> GET/SET
                                    O(1) — complex computation নেই
                                </li>
                            </ul>
                            <p className='text-muted-foreground italic'>
                                Redis v6+ এ I/O threading add হয়েছে — এখন
                                আরও fast।
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q4: Cache কোথায় রাখবে? (Cache Topology)',
                    content: (
                        <div className='space-y-2 text-sm leading-relaxed'>
                            <ul className='space-y-2'>
                                <li>
                                    <strong>Client-side Cache:</strong> Browser
                                    cache, local memory। Fastest কিন্তু per-user।
                                </li>
                                <li>
                                    <strong>CDN Cache:</strong> Static assets
                                    (images, JS, CSS) globally cache। Geographic
                                    latency কমায়।
                                </li>
                                <li>
                                    <strong>Application Cache:</strong> In-process
                                    memory (Node.js Map, Python dict)। Ultra
                                    fast কিন্তু server restart এ হারায়।
                                </li>
                                <li>
                                    <strong>Distributed Cache:</strong> Redis,
                                    Memcached। All servers share করে।{' '}
                                    <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                        Most common production choice।
                                    </span>
                                </li>
                                <li>
                                    <strong>Database Cache:</strong> Query
                                    result cache (MySQL query cache)। DB level
                                    এ।
                                </li>
                            </ul>
                        </div>
                    ),
                },
            ],
        },
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // Summary Table
    // ─────────────────────────────────────────────────────────────────────────
    summary: {
        headers: ['Concept', 'এক লাইনে'],
        rows: [
            [
                <span className='font-bold text-primary'>Cache</span>,
                'Frequently accessed data memory তে রেখে দ্রুত serve করার layer',
            ],
            [
                <span className='font-bold text-primary'>Cache Hit</span>,
                'Cache এ data পানয়া গেছে — DB তে যেতে হয়নি',
            ],
            [
                <span className='font-bold text-primary'>LRU</span>,
                'সবচেয়ে পুরনো সময়ে ব্যবহার করা item evict করে — most common policy',
            ],
            [
                <span className='font-bold text-primary'>Cache-Aside</span>,
                'Application নিজে cache manage করে — miss হলে DB থেকে আনে',
            ],
            [
                <span className='font-bold text-primary'>Write-Through</span>,
                'Cache ও DB একসাথে update — consistent কিন্তু write slow',
            ],
            [
                <span className='font-bold text-primary'>Redis</span>,
                'In-memory data store — 1M+ ops/sec, multiple data structures',
            ],
            [
                <span className='font-bold text-primary'>TTL</span>,
                'Time-To-Live — নির্দিষ্ট সময় পর cache auto-delete হয়',
            ],
            [
                <span className='font-bold text-primary'>Cache Stampede</span>,
                'Popular key expire হলে একসাথে অনেক request DB তে যায় — dangerous',
            ],
        ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Knowledge Check
    // ─────────────────────────────────────────────────────────────────────────
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'Cache Hit মানে কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Cache এ data নেই, DB থেকে আনতে হবে',
                        isCorrect: false,
                        explanation:
                            'এটা Cache Miss এর definition। Cache Miss মানে cache এ data না পানয়া।',
                    },
                    {
                        key: 'B',
                        text: 'Cache এ data পানয়া গেছে, DB তে যেতে হয়নি',
                        isCorrect: true,
                        explanation:
                            'Cache Hit মানে request করা data cache এ পানয়া গেছে। Database query করার দরকার নেই — এটাই caching এর লক্ষ্য।',
                    },
                    {
                        key: 'C',
                        text: 'Cache full হয়ে গেছে',
                        isCorrect: false,
                        explanation:
                            'Cache full হওয়া eviction trigger করে, এটা Cache Hit না।',
                    },
                    {
                        key: 'D',
                        text: 'Cache server crash করেছেনে',
                        isCorrect: false,
                        explanation: 'Cache crash এর সাথে Cache Hit এর কোনো সম্পর্ক নেই।',
                    },
                ],
            },
            {
                id: 2,
                text: 'LRU eviction policy কোনটাকে প্রথমে বাদ দেয়?',
                options: [
                    {
                        key: 'A',
                        text: 'সবচেয়ে কম বার ব্যবহার করা item',
                        isCorrect: false,
                        explanation:
                            'এটা LFU (Least Frequently Used) এর কাজ। LFU frequency count করে।',
                    },
                    {
                        key: 'B',
                        text: 'সবচেয়ে নতুন item',
                        isCorrect: false,
                        explanation:
                            'নতুন item বাদ দেওয়া LRU না — এটা MRU (Most Recently Used) policy।',
                    },
                    {
                        key: 'C',
                        text: 'সবচেয়ে পুরনো সময়ে ব্যবহার করা item',
                        isCorrect: true,
                        explanation:
                            'LRU = Least Recently Used। যে item সবচেয়ে পুরনো সময়ে access হয়েছে, সেটাই প্রথমে evict হয়। এটাই সবচেয়ে common eviction policy।',
                    },
                    {
                        key: 'D',
                        text: 'Random যেকোনো item',
                        isCorrect: false,
                        explanation:
                            'Random eviction একটা আলাদা policy — LRU না।',
                    },
                ],
            },
            {
                id: 3,
                text: 'Cache-Aside pattern এ cache miss হলে কে data আনে?',
                options: [
                    {
                        key: 'A',
                        text: 'Application নিজে DB থেকে আনে এবং cache এ রাখে',
                        isCorrect: true,
                        explanation:
                            'Cache-Aside তে application নিজেই cache manage করে। Miss হলে application DB query করে, data আনে, cache এ set করে, তারপর user কে return করে।',
                    },
                    {
                        key: 'B',
                        text: 'Cache নিজেই DB থেকে automatically আনে',
                        isCorrect: false,
                        explanation:
                            'এটা Read-Through pattern এর কাজ। Cache-Aside এ cache passive — application সব কিছু করে।',
                    },
                    {
                        key: 'C',
                        text: 'User কে error দেখানো হয়',
                        isCorrect: false,
                        explanation:
                            'Cache miss মানে error না — এটা normal flow। DB থেকে data আনা হয়।',
                    },
                    {
                        key: 'D',
                        text: 'অন্য cache server থেকে আনা হয়',
                        isCorrect: false,
                        explanation:
                            'Cache-Aside এ DB থেকে আনা হয়, অন্য cache থেকে না।',
                    },
                ],
            },
            {
                id: 4,
                text: 'Redis এর কোন data structure দিয়ে Leaderboard সবচেয়ে efficiently বানানো যায়?',
                options: [
                    {
                        key: 'A',
                        text: 'String',
                        isCorrect: false,
                        explanation:
                            'String দিয়ে leaderboard বানালেন sorting manually করতে হবে — অনেক কঠিন।',
                    },
                    {
                        key: 'B',
                        text: 'Hash',
                        isCorrect: false,
                        explanation:
                            'Hash score store করতে পারে কিন্তু ranking/sorting built-in নেই।',
                    },
                    {
                        key: 'C',
                        text: 'List',
                        isCorrect: false,
                        explanation:
                            'List ordered কিন্তু score-based sorting efficient না।',
                    },
                    {
                        key: 'D',
                        text: 'Sorted Set',
                        isCorrect: true,
                        explanation:
                            'Redis Sorted Set (ZSET) automatically score অনুযায়ী sorted রাখে। ZADD দিয়ে score update, ZREVRANGE দিয়ে top N পান — O(log N) complexity।',
                    },
                ],
            },
            {
                id: 5,
                text: 'Write-Through caching এর প্রধান disadvantage কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Data inconsistent হয়',
                        isCorrect: false,
                        explanation:
                            'Write-Through তে data সবসময় consistent — cache এবং DB একসাথে update হয়।',
                    },
                    {
                        key: 'B',
                        text: 'Write operation slow হয়',
                        isCorrect: true,
                        explanation:
                            'Write-Through এ প্রতিটা write এ cache এবং DB দুটোতেই লিখতে হয়। এতে write latency বাড়ে। Read fast কিন্তু write slow — এটাই main tradeoff।',
                    },
                    {
                        key: 'C',
                        text: 'Read operation slow হয়',
                        isCorrect: false,
                        explanation:
                            'Write-Through এ read fast — data always cache এ থাকে।',
                    },
                    {
                        key: 'D',
                        text: 'Cache সবসময় empty থাকে',
                        isCorrect: false,
                        explanation:
                            'Write-Through এ cache সবসময় data থাকে — empty থাকার প্রশ্নই আসে না।',
                    },
                ],
            },
            {
                id: 6,
                text: 'Redis এবং Memcached এর মধ্যে সবচেয়ে বড় পার্থক্য কোনটি?',
                options: [
                    {
                        key: 'A',
                        text: 'Redis বেশি slow',
                        isCorrect: false,
                        explanation:
                            'Redis এবং Memcached দুটোই in-memory এবং similar speed এ কাজ করে।',
                    },
                    {
                        key: 'B',
                        text: 'Memcached free, Redis paid',
                        isCorrect: false,
                        explanation:
                            'দুটোই open-source এবং free। এটা সত্য না।',
                    },
                    {
                        key: 'C',
                        text: 'Redis multiple data types support করে, Memcached শুধু String',
                        isCorrect: true,
                        explanation:
                            'এটাই সবচেয়ে বড় পার্থক্য। Redis এ String, Hash, List, Set, Sorted Set, Stream আছে। Memcached শুধু key-value (String)। এই জন্য Redis বেশি versatile।',
                    },
                    {
                        key: 'D',
                        text: 'Memcached Linux এ চলে না',
                        isCorrect: false,
                        explanation:
                            'Memcached Linux এ ভালোভাবেই চলে — এটা সত্য না।',
                    },
                ],
            },
            {
                id: 7,
                text: 'Redis এ TTL (Time-To-Live) কী করে?',
                options: [
                    {
                        key: 'A',
                        text: 'নির্দিষ্ট সময় পর key automatically delete হয়',
                        isCorrect: true,
                        explanation:
                            'TTL দিয়ে একটা key এর expiry time set করা যায়। সময় শেষে Redis automatically সেটা delete করে। Session management, OTP, rate limiting এ খুব useful।',
                    },
                    {
                        key: 'B',
                        text: 'Key কে permanent করে',
                        isCorrect: false,
                        explanation:
                            'TTL expire time set করে — permanent করে না। Permanent key এর জন্য TTL set না করলেনই হয়।',
                    },
                    {
                        key: 'C',
                        text: 'Key এর value encrypt করে',
                        isCorrect: false,
                        explanation: 'TTL encryption এর সাথে সম্পর্কিত না।',
                    },
                    {
                        key: 'D',
                        text: 'Key কে read-only করে',
                        isCorrect: false,
                        explanation: 'TTL read-only করে না — expire করে।',
                    },
                ],
            },
            {
                id: 8,
                text: 'Cache Stampede (Thundering Herd) কখন হয়?',
                options: [
                    {
                        key: 'A',
                        text: 'Cache server restart হলে',
                        isCorrect: false,
                        explanation:
                            'Restart এ সব cache clear হয় — এটা cold start problem, stampede না।',
                    },
                    {
                        key: 'B',
                        text: 'Cache তে অনেক বেশি data থাকলে',
                        isCorrect: false,
                        explanation:
                            'Cache full হওয়া stampede না — এটা eviction trigger করে।',
                    },
                    {
                        key: 'C',
                        text: 'Database slow হলে',
                        isCorrect: false,
                        explanation:
                            'Database slow থাকলে cache stampede এর effect আরও বেশি হয়, কিন্তু এটা root cause না।',
                    },
                    {
                        key: 'D',
                        text: 'Popular key expire হলে একসাথে অনেক request DB তে যায়',
                        isCorrect: true,
                        explanation:
                            'Cache Stampede হয় যখন একটা highly popular cache key expire হয় এবং সেই মুহূর্তে অনেক concurrent request আসে — সবাই cache miss দেখে DB তে যায়, DB overload হয়।',
                    },
                ],
            },
            {
                id: 9,
                text: 'Redis এ HSET command কোন data structure এ কাজ করে?',
                options: [
                    {
                        key: 'A',
                        text: 'List',
                        isCorrect: false,
                        explanation:
                            'List এর commands হলো LPUSH, RPUSH, LRANGE। HSET List এ কাজ করে না।',
                    },
                    {
                        key: 'B',
                        text: 'Hash',
                        isCorrect: true,
                        explanation:
                            'HSET (Hash SET) Hash data structure এ কাজ করে। HSET key field value দিয়ে একটা Hash field set করা যায়। User profile, object store এর জন্য perfect।',
                    },
                    {
                        key: 'C',
                        text: 'Sorted Set',
                        isCorrect: false,
                        explanation:
                            'Sorted Set এর commands হলো ZADD, ZRANGE, ZRANK। HSET এখানে কাজ করে না।',
                    },
                    {
                        key: 'D',
                        text: 'String',
                        isCorrect: false,
                        explanation:
                            'String এর command হলো GET/SET। HSET String data structure এর জন্য না।',
                    },
                ],
            },
            {
                id: 10,
                text: 'একটি banking app এর account balance cache করতে কোন strategy সবচেয়ে উপযুক্ত?',
                options: [
                    {
                        key: 'A',
                        text: 'Cache-Aside with long TTL',
                        isCorrect: false,
                        explanation:
                            'Long TTL মানে stale data বেশিক্ষণ থাকবেন। Banking এ এটা dangerous — user ভুল balance দেখতে পারে।',
                    },
                    {
                        key: 'B',
                        text: 'Write-Behind (Write-Back)',
                        isCorrect: false,
                        explanation:
                            'Write-Behind তে DB later update হয় — cash এ হলে data loss হতে পারে। Banking এর জন্য একেবারেই unsuitable।',
                    },
                    {
                        key: 'C',
                        text: 'Write-Through',
                        isCorrect: true,
                        explanation:
                            'Banking app এ data consistency সবচেয়ে important। Write-Through এ প্রতিটা transaction এ cache এবং DB একসাথে update হয় — কোনো stale data নেই। Write একটু slow কিন্তু financial data তে এটাই সঠিক choice।',
                    },
                    {
                        key: 'D',
                        text: 'No caching needed',
                        isCorrect: false,
                        explanation:
                            'Caching না করলেন performance অনেক কমে যাবেন। সঠিক strategy ব্যবহার করে banking এও cache করা যায়।',
                    },
                ],
            },
        ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Assignment
    // ─────────────────────────────────────────────────────────────────────────
    assignment: {
        title: 'Caching Strategy Assignment',
        time: '২-৩ ঘণ্টা',
        difficulty: 'Junior Level',
        tasks: [
            <span key='1'>
                <strong>Strategy Selection:</strong> নিচের ৩টা scenario তে
                কোন caching strategy ব্যবহার করবেন এবং কেন explain করুন: (ক)
                একটি news website এর homepage যেখানে content প্রতি ৫ মিনিটে
                update হয় (খ) একটি banking app এর account balance page (গ) একটি
                social media app এর user profile যেখানে user নিজেই তার profile
                update করতে পারে।
            </span>,
            <span key='2'>
                <strong>Redis CLI Exploration:</strong> Local machine এ Redis
                install করুন (redis.io/docs/getting-started)। CLI তে এই
                operations গুলো করুন: (ক) একটি user profile Hash তৈরি করুন (খ)
                একটি leaderboard Sorted Set তৈরি করুন ৫ জন player দিয়ে (গ)
                TTL সহ একটি OTP cache করুন এবং expire হতে দেখুন।
            </span>,
            <span key='3'>
                <strong>Code Writing:</strong> Node.js বা Python ব্যবহার করে
                একটি simple Cache-Aside implementation লিখুন। Requirements: (ক)
                getUser(id) function — Redis থেকে check, miss হলে mock DB থেকে
                আনো (খ) updateUser(id, data) — DB update এবং cache invalidate
                করুন (গ) Cache hit/miss log করুন।
            </span>,
            <span key='4'>
                <strong>Eviction Policy Analysis:</strong> LRU, LFU, এবং TTL
                — তিনটা policy এর জন্য নিচের scenario তে কোনটা best হবে বলুন
                এবং কারণ দিন: একটি e-commerce site এর product catalog cache।
                Products rarely update হয় কিন্তু popular products বেশি access
                হয়।
            </span>,
            <span key='5'>
                <strong>Research Task:</strong> Google করে বের করুন — (ক)
                Facebook Memcached architecture কীভাবে কাজ করে? (খ) Redis
                Cluster কী এবং কীভাবে শত শত GB data cache করা যায়? ৫-৭ লাইনে
                লিখুন।
            </span>,
        ],
        deliverables: [
            <span key='1'>
                Strategy selection এর written answers (কেন বেছেছো সহ)
            </span>,
            <span key='2'>Redis CLI commands এর screenshot বা output</span>,
            <span key='3'>Cache-Aside implementation code (GitHub link)</span>,
            <span key='4'>Eviction policy analysis (নিজের ভাষায়)</span>,
            <span key='5'>Facebook/Redis Cluster research summary</span>,
        ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Practical Lab
    // ─────────────────────────────────────────────────────────────────────────
    practicalLab: {
        title: 'Hands-On Project Task',
        subtitle: 'Redis Cache-Aside with Node.js',
        steps: [
            {
                title: 'Redis install করুন',
                description:
                    'Docker দিয়ে: docker run -d -p 6379:6379 redis:alpine। অথবা redis.io থেকে directly install করুন। redis-cli ping দিয়ে PONG পানয়া মানে ready।',
            },
            {
                title: 'Node.js project setup করুন',
                description:
                    'npm init -y && npm install redis express। একটা simple Express server বানান যেখানে /api/users/:id route আছে।',
            },
            {
                title: 'Mock database তৈরি করুন',
                description:
                    'Real DB ছাড়াই test করার জন্য একটা in-memory object তৈরি করুন যেখানে ১০ জন user এর data আছে। 200ms delay add করুন simulate করতে।',
            },
            {
                title: 'Cache-Aside logic implement করুন',
                description:
                    'Redis GET দিয়ে check করুন → miss হলে mock DB থেকে আনো → Redis SET দিয়ে cache করুন (TTL: 60s) → return করুন। Console.log দিয়ে hit/miss log করুন।',
            },
            {
                title: 'Test করুন',
                description:
                    'Browser বা Postman দিয়ে same user ID তে দুইবার request করুন। প্রথমবার ~200ms (DB), দ্বিতীয়বার ~2ms (Cache HIT) — পার্থক্যটা নিজে দেখুন।',
            },
            {
                title: 'Cache invalidation যোগ করুন',
                description:
                    'PUT /api/users/:id route বানান। Update হলে cache delete করুন। তারপর আবার GET করলেন fresh data আসে কিনা দেখুন।',
            },
        ],
        codeBlock: {
            language: 'javascript',
            filename: 'server.js',
            code: `const express = require('express');
const { createClient } = require('redis');

const app = express();
app.use(express.json());

// Redis client
const redis = createClient({ url: 'redis://localhost:6379' });
redis.connect();

// Mock database (200ms delay to simulate real DB)
const mockDB = {
  '1': { id: '1', name: 'Ripon Ahmed', email: 'ripon@example.com', role: 'admin' },
  '2': { id: '2', name: 'Farhan Islam', email: 'farhan@example.com', role: 'user' },
  '3': { id: '3', name: 'Nadia Akter', email: 'nadia@example.com', role: 'user' },
};

const dbQuery = (id) => new Promise((resolve) => {
  setTimeout(() => resolve(mockDB[id] || null), 200);
});

// GET user — Cache-Aside pattern
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const cacheKey = \`user:\${id}\`;

  // 1. Cache check
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log(\`✅ Cache HIT: \${cacheKey}\`);
    return res.json({ source: 'cache', data: JSON.parse(cached) });
  }

  // 2. DB query (cache miss)
  console.log(\`❌ Cache MISS: \${cacheKey} — querying DB\`);
  const user = await dbQuery(id);

  if (!user) return res.status(404).json({ error: 'User not found' });

  // 3. Cache করুন (60 seconds TTL)
  await redis.setEx(cacheKey, 60, JSON.stringify(user));

  res.json({ source: 'database', data: user });
});

// PUT user — Update + Cache Invalidation
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  // DB update (mock)
  if (mockDB[id]) {
    mockDB[id] = { ...mockDB[id], ...req.body };
  }

  // Cache invalidate করুন
  await redis.del(\`user:\${id}\`);
  console.log(\`🗑️  Cache invalidated: user:\${id}\`);

  res.json({ success: true, data: mockDB[id] });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));`,
        },
        tip: 'প্রথম request এ "Cache MISS" দেখবেন এবং ~200ms লাগবে। Same ID তে দ্বিতীয় request করলেন "Cache HIT" দেখবেন এবং ~2ms লাগবে। এই পার্থক্যটাই caching এর real power — শুধু theory না, নিজে দেখুন।',
    },
};
