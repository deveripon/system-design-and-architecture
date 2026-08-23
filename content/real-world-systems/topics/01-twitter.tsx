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

export const twitterContent: TopicData = {
    id: 'twitter',
    sections: [
        // ─── Section 001 ─── Why Twitter is Hard
        {
            id: 'why-twitter',
            subHeader: { index: '001', title: 'Why This System' },
            title: (
                <SectionTitle>
                    Twitter কেন Design শেখা দরকার?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-5'>
                            <ContentParagraph>
                                Twitter/X হলো সবচেয়ে complex social media system
                                design interview question গুলোর একটা। এখানে{' '}
                                <strong className='text-foreground'>
                                    News Feed generation
                                </strong>
                                ,{' '}
                                <strong className='text-foreground'>
                                    follower/following graph
                                </strong>
                                ,{' '}
                                <strong className='text-foreground'>
                                    real-time trending
                                </strong>{' '}
                                — এই তিনটা hard problem একসাথে solve করতে হয়।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 Core Challenges',
                    content: (
                        <p>
                            <strong>Fanout Problem:</strong> একজন celebrity যখন
                            tweet করে (Elon Musk: 150M followers), তখন সেই tweet
                            150M user-এর feed-এ push করতে হবে। এটাই Twitter-এর
                            সবচেয়ে কঠিন scaling problem।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='rounded-lg border border-border bg-muted/30 p-5 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5 text-center'>
                                TWITTER FANOUT ARCHITECTURE — Overview
                            </p>
                            <svg
                                width='100%'
                                viewBox='0 0 700 380'
                                className='max-w-full'>
                                <defs>
                                    <marker
                                        id='tw-arr'
                                        markerWidth='8'
                                        markerHeight='8'
                                        refX='6'
                                        refY='3'
                                        orient='auto'>
                                        <path
                                            d='M0,0 L0,6 L8,3 z'
                                            fill='currentColor'
                                            className='text-muted-foreground'
                                        />
                                    </marker>
                                    <marker
                                        id='tw-arrB'
                                        markerWidth='8'
                                        markerHeight='8'
                                        refX='6'
                                        refY='3'
                                        orient='auto'>
                                        <path
                                            d='M0,0 L0,6 L8,3 z'
                                            fill='#1d9bf0'
                                        />
                                    </marker>
                                </defs>
                                {/* Client */}
                                <rect
                                    x='10'
                                    y='160'
                                    width='70'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#1e2d4a'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='45'
                                    y='177'
                                    textAnchor='middle'
                                    fill='#94a3b8'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    CLIENT
                                </text>
                                <text
                                    x='45'
                                    y='191'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Web/App
                                </text>
                                <path
                                    d='M 80 180 L 115 180'
                                    stroke='#1d9bf0'
                                    strokeWidth='1.5'
                                    markerEnd='url(#tw-arrB)'
                                />
                                {/* API Gateway */}
                                <rect
                                    x='115'
                                    y='155'
                                    width='90'
                                    height='50'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#1d9bf0'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='160'
                                    y='175'
                                    textAnchor='middle'
                                    fill='#1d9bf0'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    API
                                </text>
                                <text
                                    x='160'
                                    y='188'
                                    textAnchor='middle'
                                    fill='#1d9bf0'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    GATEWAY
                                </text>
                                <text
                                    x='160'
                                    y='218'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Auth + Rate Limit
                                </text>
                                {/* Tweet Service */}
                                <path
                                    d='M 205 170 L 240 130'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#tw-arr)'
                                />
                                <rect
                                    x='240'
                                    y='110'
                                    width='100'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#10b981'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='290'
                                    y='128'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    TWEET
                                </text>
                                <text
                                    x='290'
                                    y='141'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    SERVICE
                                </text>
                                {/* User Service */}
                                <path
                                    d='M 205 180 L 240 180'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#tw-arr)'
                                />
                                <rect
                                    x='240'
                                    y='160'
                                    width='100'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='290'
                                    y='178'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    USER
                                </text>
                                <text
                                    x='290'
                                    y='191'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    SERVICE
                                </text>
                                {/* Timeline Service */}
                                <path
                                    d='M 205 190 L 240 230'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#tw-arr)'
                                />
                                <rect
                                    x='240'
                                    y='210'
                                    width='100'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#f97316'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='290'
                                    y='228'
                                    textAnchor='middle'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    TIMELINE
                                </text>
                                <text
                                    x='290'
                                    y='241'
                                    textAnchor='middle'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    SERVICE
                                </text>
                                {/* Fanout Service */}
                                <path
                                    d='M 340 130 L 380 130'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#tw-arr)'
                                />
                                <rect
                                    x='380'
                                    y='110'
                                    width='100'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#eab308'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='430'
                                    y='128'
                                    textAnchor='middle'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    FANOUT
                                </text>
                                <text
                                    x='430'
                                    y='141'
                                    textAnchor='middle'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    SERVICE
                                </text>
                                {/* Kafka Queue */}
                                <path
                                    d='M 480 130 L 520 130'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#tw-arr)'
                                />
                                <rect
                                    x='520'
                                    y='110'
                                    width='90'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='565'
                                    y='128'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    KAFKA
                                </text>
                                <text
                                    x='565'
                                    y='141'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    QUEUE
                                </text>
                                {/* Tweet DB */}
                                <path
                                    d='M 340 130 L 380 200'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#tw-arr)'
                                />
                                <rect
                                    x='380'
                                    y='185'
                                    width='100'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#cc6b45'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='430'
                                    y='203'
                                    textAnchor='middle'
                                    fill='#cc6b45'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    TWEET DB
                                </text>
                                <text
                                    x='430'
                                    y='216'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Cassandra
                                </text>
                                {/* Timeline Cache */}
                                <path
                                    d='M 340 230 L 380 270'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#tw-arr)'
                                />
                                <rect
                                    x='380'
                                    y='255'
                                    width='100'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#eab308'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='430'
                                    y='273'
                                    textAnchor='middle'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    TIMELINE
                                </text>
                                <text
                                    x='430'
                                    y='286'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Redis Cache
                                </text>
                                {/* Graph DB */}
                                <path
                                    d='M 340 180 L 520 220'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#tw-arr)'
                                />
                                <rect
                                    x='520'
                                    y='205'
                                    width='100'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='570'
                                    y='223'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    GRAPH DB
                                </text>
                                <text
                                    x='570'
                                    y='236'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Follow graph
                                </text>
                                {/* Media Storage */}
                                <rect
                                    x='520'
                                    y='300'
                                    width='100'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#10b981'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='570'
                                    y='318'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    MEDIA
                                </text>
                                <text
                                    x='570'
                                    y='331'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    S3 + CDN
                                </text>
                                {/* Search */}
                                <rect
                                    x='10'
                                    y='300'
                                    width='100'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#1d9bf0'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='60'
                                    y='318'
                                    textAnchor='middle'
                                    fill='#1d9bf0'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    SEARCH
                                </text>
                                <text
                                    x='60'
                                    y='331'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Elasticsearch
                                </text>
                            </svg>
                        </div>
                    ),
                },
            ],
        },

        // ─── Section 002 ─── Requirements
        {
            id: 'requirements',
            subHeader: { index: '002', title: 'Requirements' },
            title: (
                <SectionTitle>কী কী Features লাগবে?</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {/* Functional */}
                            <div className='rounded-lg border border-border bg-card/50 p-5'>
                                <p className='font-mono text-[11px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-4 font-bold'>
                                    ✅ Functional Requirements
                                </p>
                                <ul className='space-y-2'>
                                    {[
                                        'Tweet post করা (text, image, video)',
                                        'Follow / Unfollow করা',
                                        'Home timeline (following-দের tweets)',
                                        'User timeline (নির্দিষ্ট user-এর tweets)',
                                        'Like, Retweet, Reply',
                                        'Search tweets ও users',
                                        'Trending hashtags',
                                        'Notification system',
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className='flex items-start gap-2 text-sm text-muted-foreground'>
                                            <span className='text-muted-foreground font-mono mt-0.5'>
                                                →
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* Non-Functional */}
                            <div className='rounded-lg border border-border bg-card/50 p-5'>
                                <p className='font-mono text-[11px] uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-4 font-bold'>
                                    ⚡ Non-Functional Requirements
                                </p>
                                <ul className='space-y-2'>
                                    {[
                                        '500M+ daily active users',
                                        'Timeline load < 200ms',
                                        'Tweet post < 500ms',
                                        'High availability (99.99%)',
                                        'Eventual consistency acceptable',
                                        'Tweets never lost (durability)',
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className='flex items-start gap-2 text-sm text-muted-foreground'>
                                            <span className='text-muted-foreground font-mono mt-0.5'>
                                                →
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ),
                },
            ],
        },

        // ─── Section 003 ─── Capacity Estimation
        {
            id: 'estimation',
            subHeader: { index: '003', title: 'Capacity Estimation' },
            title: (
                <SectionTitle>Twitter Scale বোঝা</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                            {[
                                { num: '500M', label: 'Daily Active Users' },
                                { num: '200M', label: 'Tweets/Day' },
                                { num: '2300', label: 'Tweets/sec' },
                                { num: '300K', label: 'Timeline reads/sec' },
                                {
                                    num: '150M',
                                    label: 'Max Followers (celebrity)',
                                },
                                { num: '100TB', label: 'Daily Media Storage' },
                            ].map((card, i) => (
                                <div
                                    key={i}
                                    className='rounded-lg border border-border bg-card/50 p-4 text-center'>
                                    <span className='font-mono text-2xl font-bold text-primary block mb-1'>
                                        {card.num}
                                    </span>
                                    <span className='font-mono text-[10px] text-muted-foreground uppercase tracking-wide'>
                                        {card.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '🔢 Fanout Calculation',
                    content: (
                        <p>
                            প্রতিটা tweet average 200 followers → fanout = 200 ×
                            2300 ={' '}
                            <strong>460K writes/sec</strong> শুধু timeline
                            update-এর জন্য। Celebrity tweet হলে 150M × 1 ={' '}
                            <strong>150M instant writes!</strong> এটাই
                            &ldquo;thundering herd&rdquo; problem।
                        </p>
                    ),
                },
            ],
        },

        // ─── Section 004 ─── High-Level Architecture
        {
            id: 'architecture',
            subHeader: { index: '004', title: 'High-Level Architecture' },
            title: (
                <SectionTitle>
                    Twitter-এর Big Picture Components
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Twitter একটা{' '}
                            <strong className='text-foreground'>
                                microservices architecture
                            </strong>{' '}
                            follow করে। প্রতিটা service আলাদা responsibility
                            নিয়ে কাজ করে এবং একে অপরের সাথে communicate করে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    steps: [
                        {
                            title: (
                                <span className='font-mono text-blue-700 dark:text-blue-400'>
                                    API Gateway — Entry Point
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Authentication, rate limiting, request
                                    routing। সব client requests এখান দিয়ে আসে।
                                    Nginx + Envoy Proxy use হয়।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-emerald-700 dark:text-emerald-400'>
                                    Tweet Service — Content Storage
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Tweet create, read, delete। Cassandra-তে
                                    immutable tweet data store করে। Media
                                    S3-এ upload করে।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-yellow-700 dark:text-yellow-400'>
                                    Fanout Service — Distribution Engine
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    নতুন tweet হলে follower-দের timeline update
                                    করে। Kafka queue থেকে consume করে async
                                    fanout।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-orange-700 dark:text-orange-400'>
                                    Timeline Service — Feed Generation
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    User-এর home timeline serve করে। Redis
                                    cache থেকে pre-built timeline return করে।
                                    Celebrity tweets merge করে।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-purple-700 dark:text-purple-400'>
                                    User Service — Social Graph
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Follow/unfollow manage করে। Follower list,
                                    following list। Redis Sorted Set এ graph
                                    store।
                                </span>
                            ),
                        },
                    ],
                },
            ],
        },

        // ─── Section 005 ─── Fanout Problem
        {
            id: 'fanout',
            subHeader: { index: '005', title: 'Deep Dive — Fanout' },
            title: (
                <SectionTitle>
                    Fanout Problem — Twitter-এর Hardest Part
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            যখন কেউ tweet করে, সেই tweet তার সব followers-এর home
                            timeline-এ দেখা যায়। এটা করার দুটো approach আছে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Approach',
                        'কীভাবে কাজ করে',
                        'Write Cost',
                        'Read Cost',
                        'Problem',
                    ],
                    rows: [
                        [
                            <span className='font-mono text-foreground'>
                                Fan-out on Write (Push)
                            </span>,
                            'Tweet করলেনই সব followers-এর cache update',
                            <span className='text-red-700 dark:text-red-400 font-semibold'>
                                High (150M writes)
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>
                                Low (cache hit)
                            </span>,
                            'Celebrity problem',
                        ],
                        [
                            <span className='font-mono text-foreground'>
                                Fan-out on Read (Pull)
                            </span>,
                            'Timeline load করলেন following-দের tweets pull',
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>
                                Low
                            </span>,
                            <span className='text-red-700 dark:text-red-400 font-semibold'>
                                High (DB joins)
                            </span>,
                            'Slow timeline',
                        ],
                        [
                            <span className='font-mono text-foreground'>
                                Hybrid (Twitter&apos;s approach)
                            </span>,
                            'Normal users: push, Celebrity: pull on read',
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>
                                Balanced
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>
                                Balanced
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>
                                Best of both
                            </span>,
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Twitter-এর Real Solution',
                    content: (
                        <p>
                            Twitter threshold ≈ <strong>10,000 followers</strong>
                            । এর কম followers হলে{' '}
                            <strong>fan-out on write</strong> (push to all)।
                            বেশি হলে <strong>fan-out on read</strong> (pull at
                            read time)। এই hybrid approach-ই production-এ use
                            হয়।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='rounded-lg border border-border bg-muted/30 p-5 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 text-center'>
                                FANOUT DECISION FLOW
                            </p>
                            <div className='flex flex-col items-center gap-4'>
                                <div className='px-6 py-3 border-2 border-primary bg-primary/5 rounded-lg text-sm font-mono text-primary font-bold'>
                                    New Tweet Posted
                                </div>
                                <div className='w-px h-6 bg-border' />
                                <div className='px-6 py-3 border border-yellow-500/50 bg-yellow-500/5 rounded-lg text-sm font-mono text-yellow-700 dark:text-yellow-400'>
                                    followers &lt; 10,000?
                                </div>
                                <div className='flex gap-12 items-start'>
                                    <div className='flex flex-col items-center gap-2'>
                                        <span className='text-xs font-mono text-emerald-700 dark:text-emerald-400'>
                                            YES ✓
                                        </span>
                                        <div className='px-4 py-3 border border-emerald-500/50 bg-emerald-500/5 rounded-lg text-xs font-mono text-emerald-700 dark:text-emerald-400 text-center'>
                                            Fan-out on Write
                                            <br />
                                            Push to all
                                            <br />
                                            Redis caches
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-center gap-2'>
                                        <span className='text-xs font-mono text-orange-700 dark:text-orange-400'>
                                            NO (celebrity)
                                        </span>
                                        <div className='px-4 py-3 border border-orange-500/50 bg-orange-500/5 rounded-lg text-xs font-mono text-orange-700 dark:text-orange-400 text-center'>
                                            Kafka Queue
                                            <br />
                                            Pull at read
                                            <br />
                                            time only
                                        </div>
                                    </div>
                                </div>
                                <div className='w-px h-6 bg-border' />
                                <div className='px-6 py-3 border border-blue-500/50 bg-blue-500/5 rounded-lg text-sm font-mono text-blue-700 dark:text-blue-400 font-bold'>
                                    Timeline: merge regular + celebrity tweets
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'fanout_service.py',
                    code: `async def fanout_tweet(tweet_id, author_id, db, cache, queue):
    # Author-এর follower list নাও
    followers = await db.get_followers(author_id)

    # Hybrid Fanout Logic
    if len(followers) < 10_000:
        # Normal user: push to all followers' timeline cache
        for follower_id in followers:
            cache.lpush(f"timeline:{follower_id}", tweet_id)
            cache.ltrim(f"timeline:{follower_id}", 0, 799)  # last 800 tweets
    else:
        # Celebrity: push to Kafka, workers will process async
        # At read time, celebrity tweets are fetched separately
        await queue.publish("celebrity-fanout", {
            "tweet_id": tweet_id,
            "author_id": author_id
        })

    # Tweet always saved to Tweet DB
    await db.save_tweet(tweet_id, author_id)`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mt-8 mb-4 text-foreground'>
                            📰 Home Timeline — Read Path
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'timeline_service.py',
                    code: `async def get_home_timeline(user_id, db, cache):
    # Step 1: User-এর pre-built timeline cache থেকে নাও
    cached = cache.lrange(f"timeline:{user_id}", 0, 19)

    # Step 2: Celebrity following list check
    celebrities = cache.smembers(f"following_celebrities:{user_id}")

    # Step 3: Celebrity tweets আলাদাভাবে fetch করুন
    celebrity_tweets = []
    for celeb_id in celebrities:
        tweets = await db.get_recent_tweets(celeb_id, limit=5)
        celebrity_tweets.extend(tweets)

    # Step 4: Merge করুন, sort by timestamp
    all_tweet_ids = cached + [t.id for t in celebrity_tweets]
    all_tweet_ids.sort(key=lambda x: x.created_at, reverse=True)

    return all_tweet_ids[:20]  # Top 20 tweets`,
                },
            ],
        },

        // ─── Section 006 ─── Celebrity Problem / Hybrid Model
        {
            id: 'celebrity-problem',
            subHeader: { index: '006', title: 'Celebrity Problem' },
            title: (
                <SectionTitle>
                    Celebrity Problem ও Hybrid Model
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Elon Musk (150M followers) যখন একটা tweet করেন, শুধু
                            সেই একটা tweet-এর জন্য{' '}
                            <strong className='text-foreground'>
                                150 million cache writes
                            </strong>{' '}
                            দরকার হয়। এটা milliseconds-এ করা impossible। Twitter
                            এই problem solve করেছেনে hybrid approach দিয়ে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: '⚠️ Thundering Herd Problem',
                    content: (
                        <p>
                            একজন celebrity tweet করলেন লক্ষ লক্ষ users একসাথে
                            timeline refresh করে। প্রতিটা request database-এ hit
                            করলেন server crash হবে।{' '}
                            <strong>Solution:</strong> Celebrity tweets কে আলাদা
                            করুন — read time-এ pull করুন, write time-এ push করুন
                            না।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='rounded-lg border border-border bg-muted/30 p-5'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5 text-center'>
                                HYBRID MODEL — Normal User vs Celebrity
                            </p>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='p-4 border border-emerald-500/40 bg-emerald-500/5 rounded-lg'>
                                    <p className='text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold mb-3 uppercase tracking-wide'>
                                        Normal User (&lt;10K followers)
                                    </p>
                                    <div className='space-y-2 text-sm text-muted-foreground'>
                                        <p>1. Tweet post হয়</p>
                                        <p>
                                            2. Fanout service সব followers-এর
                                            Redis List-এ tweet_id push করে
                                        </p>
                                        <p>
                                            3. Timeline load = Redis cache থেকে
                                            instant read
                                        </p>
                                        <p className='text-emerald-700 dark:text-emerald-400 font-mono text-xs'>
                                            ✓ Write: High, Read: O(1) fast
                                        </p>
                                    </div>
                                </div>
                                <div className='p-4 border border-orange-500/40 bg-orange-500/5 rounded-lg'>
                                    <p className='text-xs font-mono text-orange-700 dark:text-orange-400 font-bold mb-3 uppercase tracking-wide'>
                                        Celebrity (&gt;10K followers)
                                    </p>
                                    <div className='space-y-2 text-sm text-muted-foreground'>
                                        <p>1. Tweet post হয় → Kafka-তে push</p>
                                        <p>
                                            2. Cache update হয় না (150M skipped)
                                        </p>
                                        <p>
                                            3. Timeline load-এ celebrity tweets
                                            আলাদাভাবে DB থেকে pull করে merge
                                        </p>
                                        <p className='text-orange-700 dark:text-orange-400 font-mono text-xs'>
                                            ✓ Write: Low, Read: pull+merge
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '⭐ Interview-এ যা বলবে',
                    content: (
                        <p>
                            &ldquo;Twitter hybrid fanout use করে। 10K follower
                            threshold-এর নিচে fan-out on write, উপরে fan-out on
                            read। Timeline-এ দুটো merge করা হয়। এই approach-এ
                            write overhead কমে এবং read latency acceptable থাকে।
                            Trade-off হলো celebrity tweets-এ slight delay হতে
                            পারে।&rdquo;
                        </p>
                    ),
                },
            ],
        },

        // ─── Section 007 ─── Database Choices
        {
            id: 'database',
            subHeader: { index: '007', title: 'Database Choices' },
            title: (
                <SectionTitle>
                    Multiple Databases — কোনটা কিসের জন্য?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Twitter-এ single database দিয়ে হয় না। Different use
                            cases-এর জন্য different databases।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Data Type', 'Database', 'Why?'],
                    rows: [
                        [
                            <span className='font-mono text-foreground'>
                                Tweets (immutable)
                            </span>,
                            <span className='text-blue-700 dark:text-blue-400 font-semibold'>
                                Cassandra
                            </span>,
                            'Append-only, time-series, massive scale',
                        ],
                        [
                            <span className='font-mono text-foreground'>
                                User profiles
                            </span>,
                            <span className='text-blue-700 dark:text-blue-400 font-semibold'>
                                PostgreSQL
                            </span>,
                            'ACID, relational, profile updates',
                        ],
                        [
                            <span className='font-mono text-foreground'>
                                Follow graph
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400 font-semibold'>
                                Redis (sorted set) / Neo4j
                            </span>,
                            'Graph traversal, follower counts',
                        ],
                        [
                            <span className='font-mono text-foreground'>
                                Home timeline
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400 font-semibold'>
                                Redis (list)
                            </span>,
                            'Fast reads, pre-computed, in-memory',
                        ],
                        [
                            <span className='font-mono text-foreground'>
                                Search index
                            </span>,
                            <span className='text-blue-700 dark:text-blue-400 font-semibold'>
                                Elasticsearch
                            </span>,
                            'Full-text search, hashtag search',
                        ],
                        [
                            <span className='font-mono text-foreground'>
                                Media files
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>
                                Amazon S3 + CloudFront
                            </span>,
                            'Object storage, CDN delivery',
                        ],
                        [
                            <span className='font-mono text-foreground'>
                                Analytics
                            </span>,
                            <span className='text-purple-700 dark:text-purple-400 font-semibold'>
                                Hadoop/Spark + Hive
                            </span>,
                            'Batch processing, trend analysis',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: '⚠️ Tweet Schema Design — Cassandra',
                    content: (
                        <p>
                            Tweets-এ <strong>created_at</strong> দিয়ে partition
                            করুন Cassandra-তে।{' '}
                            <strong>Time-series data</strong> — নতুন tweets
                            সবসময় write, পুরনো tweets rarely read। Cassandra-র
                            time-based partitioning perfect fit।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'sql',
                    filename: 'cassandra_schema.cql',
                    code: `-- Tweet Table — Cassandra Schema
CREATE TABLE tweets (
    tweet_id    TIMEUUID,
    user_id     UUID,
    content     TEXT,
    media_url   TEXT,
    like_count  COUNTER,
    created_at  TIMESTAMP,
    PRIMARY KEY ((user_id), created_at, tweet_id)
) WITH CLUSTERING ORDER BY (created_at DESC);

-- Follow Graph — Redis Sorted Set
-- Key: "followers:{user_id}" → Value: follower_id, Score: follow_timestamp
ZADD followers:user123 1700000000 "follower_id_456"

-- Timeline Cache — Redis List
-- Key: "timeline:{user_id}" → Values: tweet_ids (most recent first)
LPUSH timeline:user123 "tweet_id_789"
LTRIM timeline:user123 0 799   -- Keep last 800 tweets only`,
                },
            ],
        },

        // ─── Section 008 ─── Scaling + Real-time + WebSocket + Interview Tips
        {
            id: 'scaling-realtime',
            subHeader: {
                index: '008',
                title: 'Scaling + Real-time + Interview Tips',
            },
            title: (
                <SectionTitle>
                    Scaling Strategies, Real-time Notifications ও Interview Tips
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mb-4 text-foreground'>
                            Scaling Decisions
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-3'>
                            {[
                                {
                                    type: 'Strategy',
                                    color: 'emerald',
                                    text: (
                                        <>
                                            <strong className='text-foreground'>
                                                Timeline Caching:
                                            </strong>{' '}
                                            প্রতিটা user-এর last 800 tweets
                                            Redis-এ store। 99% reads cache hit
                                            → DB আসে না।
                                        </>
                                    ),
                                },
                                {
                                    type: 'Strategy',
                                    color: 'emerald',
                                    text: (
                                        <>
                                            <strong className='text-foreground'>
                                                Async Fanout via Kafka:
                                            </strong>{' '}
                                            Tweet POST করলেন immediately return।
                                            Background-এ Kafka workers fanout
                                            করে। User experience fast রাখে।
                                        </>
                                    ),
                                },
                                {
                                    type: 'Strategy',
                                    color: 'emerald',
                                    text: (
                                        <>
                                            <strong className='text-foreground'>
                                                Read Replicas:
                                            </strong>{' '}
                                            Tweet DB-তে 1 master + 5 replicas।
                                            সব reads replica থেকে → master
                                            শুধু writes।
                                        </>
                                    ),
                                },
                                {
                                    type: 'Trade-off',
                                    color: 'red',
                                    text: (
                                        <>
                                            <strong className='text-foreground'>
                                                Eventual Consistency:
                                            </strong>{' '}
                                            Celebrity tweet হলে সবার
                                            timeline-এ 1-2 sec delay হতে
                                            পারে। Acceptable trade-off।
                                        </>
                                    ),
                                },
                                {
                                    type: 'Trade-off',
                                    color: 'red',
                                    text: (
                                        <>
                                            <strong className='text-foreground'>
                                                Storage Cost:
                                            </strong>{' '}
                                            প্রতিটা tweet 800 user-এর cache-এ
                                            store মানে 800x storage। Memory
                                            expensive কিন্তু latency দিয়ে pay
                                            করা worth।
                                        </>
                                    ),
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className='flex gap-3 items-start'>
                                    <span
                                        className={`font-mono text-[11px] px-2 py-1 rounded flex-shrink-0 mt-0.5 ${
                                            item.color === 'emerald'
                                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                                                : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20'
                                        }`}>
                                        {item.type}
                                    </span>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        {item.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mt-8 mb-4 text-foreground'>
                            Real-time Notifications — WebSocket
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '🔔 Real-time Notification System',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                Twitter real-time notifications-এর জন্য{' '}
                                <strong>WebSocket</strong> use করে। User app
                                open করলেন server-এর সাথে persistent connection
                                maintain হয়।
                            </p>
                            <p>
                                কেউ follow করলেন, like করলেন, reply করলেন —
                                Notification Service Kafka থেকে event consume
                                করে WebSocket দিয়ে push করে।
                            </p>
                            <p>
                                <strong>Trending Topics:</strong> Redis Sorted
                                Set-এ hashtag counts রাখুন। ZINCRBY দিয়ে
                                increment করুন। ZREVRANGE দিয়ে top 10 trending
                                পান। Sliding window (last 1 hour) use করুন।
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'trending_service.py',
                    code: `import redis
import time

r = redis.Redis()

def record_hashtag(hashtag: str):
    """Tweet post হলে hashtag count increment করুন"""
    current_hour = int(time.time() // 3600)  # sliding window key
    key = f"trending:{current_hour}"

    # Atomic increment
    r.zincrby(key, 1, hashtag)

    # Expire after 2 hours (sliding window)
    r.expire(key, 7200)

def get_trending(top_n: int = 10) -> list:
    """Last 1 hour-এর top trending hashtags"""
    current_hour = int(time.time() // 3600)
    prev_hour = current_hour - 1

    # Merge last 2 windows for sliding effect
    r.zunionstore(
        "trending:current",
        [f"trending:{current_hour}", f"trending:{prev_hour}"]
    )

    # Top N descending by score
    return r.zrevrange("trending:current", 0, top_n - 1, withscores=True)

def like_tweet_atomic(tweet_id: str):
    """Race condition ছাড়া like count increment"""
    # Redis INCR is atomic — no race condition!
    r.incr(f"likes:{tweet_id}")
    return r.get(f"likes:{tweet_id}")`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mt-8 mb-4 text-foreground'>
                            Twitter-এর Real Tech Stack
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-5'>
                            <div>
                                <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3'>
                                    Backend Services
                                </p>
                                <div className='flex flex-wrap gap-2'>
                                    {[
                                        {
                                            label: 'Scala / Java',
                                            color: 'text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
                                        },
                                        {
                                            label: 'Python (ML/Recommendations)',
                                            color: 'text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
                                        },
                                        {
                                            label: 'Kubernetes',
                                            color: 'text-purple-700 dark:text-purple-400 border-purple-500/30 bg-purple-500/5',
                                        },
                                        {
                                            label: 'Nginx + Envoy Proxy',
                                            color: 'text-purple-700 dark:text-purple-400 border-purple-500/30 bg-purple-500/5',
                                        },
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
                                <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3'>
                                    Data Storage
                                </p>
                                <div className='flex flex-wrap gap-2'>
                                    {[
                                        {
                                            label: 'Cassandra (Tweets)',
                                            color: 'text-blue-700 dark:text-blue-400 border-blue-500/30 bg-blue-500/5',
                                        },
                                        {
                                            label: 'PostgreSQL (Users)',
                                            color: 'text-blue-700 dark:text-blue-400 border-blue-500/30 bg-blue-500/5',
                                        },
                                        {
                                            label: 'Redis Cluster (Timeline)',
                                            color: 'text-yellow-700 dark:text-yellow-400 border-yellow-500/30 bg-yellow-500/5',
                                        },
                                        {
                                            label: 'Elasticsearch (Search)',
                                            color: 'text-blue-700 dark:text-blue-400 border-blue-500/30 bg-blue-500/5',
                                        },
                                        {
                                            label: "Manhattan (Twitter's own KV store)",
                                            color: 'text-blue-700 dark:text-blue-400 border-blue-500/30 bg-blue-500/5',
                                        },
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
                                <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3'>
                                    Messaging &amp; Analytics
                                </p>
                                <div className='flex flex-wrap gap-2'>
                                    {[
                                        {
                                            label: 'Apache Kafka (Fanout)',
                                            color: 'text-orange-700 dark:text-orange-400 border-orange-500/30 bg-orange-500/5',
                                        },
                                        {
                                            label: 'Amazon S3 (Media)',
                                            color: 'text-purple-700 dark:text-purple-400 border-purple-500/30 bg-purple-500/5',
                                        },
                                        {
                                            label: 'CloudFront CDN',
                                            color: 'text-purple-700 dark:text-purple-400 border-purple-500/30 bg-purple-500/5',
                                        },
                                        {
                                            label: 'Hadoop + Spark (Analytics)',
                                            color: 'text-blue-700 dark:text-blue-400 border-blue-500/30 bg-blue-500/5',
                                        },
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
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '🎯 Interview Tips — Twitter Design-এ যা মনে রাখবে',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>1)</strong> সবসময় fanout problem
                                দিয়ে শুরু করুন — interviewer এটা expect করে।
                            </p>
                            <p>
                                <strong>2)</strong> &ldquo;Why not fan-out on
                                write for everyone?&rdquo; — celebrity problem
                                explain করুন।
                            </p>
                            <p>
                                <strong>3)</strong> Database choices justify
                                করুন: Cassandra = immutable time-series,
                                Redis = speed, Elasticsearch = search।
                            </p>
                            <p>
                                <strong>4)</strong> Eventual consistency
                                explicitly mention করুন — Twitter-এ strong
                                consistency দরকার নেই।
                            </p>
                            <p>
                                <strong>5)</strong> Kafka = async decoupling।
                                Tweet POST fast return → background fanout।
                            </p>
                        </div>
                    ),
                },
            ],
        },
    ],

    // ─── Summary Table ───
    summary: {
        headers: [
            'Challenge',
            <span className='font-bold text-primary'>Solution</span>,
            'Technology',
        ],
        rows: [
            [
                <span className='font-bold text-primary'>
                    Celebrity fanout
                </span>,
                'Hybrid: push+pull',
                'Kafka + Redis',
            ],
            [
                <span className='font-bold text-primary'>
                    Fast timeline reads
                </span>,
                'Pre-computed cache',
                'Redis List',
            ],
            [
                <span className='font-bold text-primary'>
                    Tweet storage at scale
                </span>,
                'Time-series immutable',
                'Cassandra',
            ],
            [
                <span className='font-bold text-primary'>Hashtag search</span>,
                'Inverted index',
                'Elasticsearch',
            ],
            [
                <span className='font-bold text-primary'>Media delivery</span>,
                'Object store + CDN',
                'S3 + CloudFront',
            ],
            [
                <span className='font-bold text-primary'>Follow graph</span>,
                'Graph traversal',
                'Redis Sorted Set',
            ],
            [
                <span className='font-bold text-primary'>
                    Fanout on Write
                </span>,
                'Push tweet_id to each follower cache on write',
                'Redis LPUSH + LTRIM',
            ],
            [
                <span className='font-bold text-primary'>
                    Fanout on Read
                </span>,
                'Pull following tweets at timeline load time',
                'Cassandra read + merge',
            ],
        ],
    },

    // ─── Knowledge Check — 10 MCQs ───
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'Elon Musk (150M followers) tweet করলেন "Fanout on Write" approach-এ কতটা writes হবে?',
                options: [
                    {
                        key: 'a',
                        text: '1 write (শুধু tweet save)',
                        isCorrect: false,
                        explanation:
                            'Fan-out on write মানে প্রতিটা follower-এর timeline cache update করুন।',
                    },
                    {
                        key: 'b',
                        text: '1000 writes',
                        isCorrect: false,
                        explanation:
                            'এটা অনেক কম। Celebrity-র ক্ষেত্রে followers সংখ্যা দেখুন।',
                    },
                    {
                        key: 'c',
                        text: '150 million writes',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Fan-out on write মানে প্রতিটা follower-এর timeline cache update করুন। 150M followers → 150M cache writes। এটাই "celebrity problem" বা "thundering herd" — তাই Twitter hybrid approach use করে।',
                    },
                    {
                        key: 'd',
                        text: '150 thousand writes',
                        isCorrect: false,
                        explanation:
                            'এটা সঠিক নয়। Elon Musk-এর 150 million followers আছে।',
                    },
                ],
            },
            {
                id: 2,
                text: 'Twitter-এর Hybrid Fanout approach-এ celebrity threshold কত followers?',
                options: [
                    {
                        key: 'a',
                        text: '1,000 followers',
                        isCorrect: false,
                        explanation:
                            'এটা অনেক কম। Twitter-এর actual threshold বেশি।',
                    },
                    {
                        key: 'b',
                        text: '10,000 followers',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Twitter-এর actual threshold ≈ 10,000 followers। এর কম = fan-out on write (push)। বেশি = fan-out on read (pull at timeline load time)। এই number exact নয়, কিন্তু concept টা interview-এ গুরুত্বপূর্ণ।',
                    },
                    {
                        key: 'c',
                        text: '1 million followers',
                        isCorrect: false,
                        explanation:
                            'এটা অনেক বেশি। Twitter অনেক আগেই hybrid switch করে।',
                    },
                    {
                        key: 'd',
                        text: '100,000 followers',
                        isCorrect: false,
                        explanation:
                            'এটা সঠিক নয়। Twitter-এর threshold ≈ 10,000।',
                    },
                ],
            },
            {
                id: 3,
                text: 'Home Timeline-এর জন্য Redis-এ কোন data structure সবচেয়ে appropriate?',
                options: [
                    {
                        key: 'a',
                        text: 'List (LPUSH + LTRIM)',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Redis List-এ LPUSH দিয়ে নতুন tweet সামনে add করুন, LTRIM দিয়ে last 800 রাখুন। Ordered by insertion time — timeline-এর জন্য perfect। LRANGE দিয়ে pagination করা যায়।',
                    },
                    {
                        key: 'b',
                        text: 'Hash Map',
                        isCorrect: false,
                        explanation:
                            'Hash Map ordered নয় — timeline ordering দরকার।',
                    },
                    {
                        key: 'c',
                        text: 'Set',
                        isCorrect: false,
                        explanation:
                            'Set unordered — timeline-এ order দরকার।',
                    },
                    {
                        key: 'd',
                        text: 'String',
                        isCorrect: false,
                        explanation:
                            'String দিয়ে multiple tweet ids efficiently store করা যায় না।',
                    },
                ],
            },
            {
                id: 4,
                text: 'Tweet data store করার জন্য সবচেয়ে suitable database কোনটা এবং কেন?',
                options: [
                    {
                        key: 'a',
                        text: 'MySQL — ACID transactions দরকার',
                        isCorrect: false,
                        explanation:
                            'Tweets immutable — ACID transactions দরকার নেই। MySQL Twitter scale-এ horizontal scale করা কঠিন।',
                    },
                    {
                        key: 'b',
                        text: 'MongoDB — flexible schema',
                        isCorrect: false,
                        explanation:
                            'MongoDB একটা বিকল্প হতে পারে কিন্তু Twitter specifically Cassandra use করে।',
                    },
                    {
                        key: 'c',
                        text: 'SQLite — simple and fast',
                        isCorrect: false,
                        explanation:
                            'SQLite single-file database — distributed system-এ use করা যায় না।',
                    },
                    {
                        key: 'd',
                        text: 'Cassandra — immutable, time-series, massive write scale',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Tweets are immutable (একবার post, rarely edit) এবং time-series (by created_at)। Cassandra partition by time, massive write throughput। Twitter নিজে Cassandra use করে tweet storage-এর জন্য।',
                    },
                ],
            },
            {
                id: 5,
                text: 'Hashtag search (#Python) implement করতে কোন database best?',
                options: [
                    {
                        key: 'a',
                        text: 'Redis',
                        isCorrect: false,
                        explanation:
                            'Redis full-text search-এর জন্য designed নয়।',
                    },
                    {
                        key: 'b',
                        text: 'Elasticsearch',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Elasticsearch full-text search-এর জন্য designed। Inverted index দিয়ে hashtag search milliseconds-এ হয়। PostgreSQL LIKE query O(n) — 200M tweets-এ অনেক slow। Twitter Elasticsearch use করে search feature-এ।',
                    },
                    {
                        key: 'c',
                        text: 'Cassandra',
                        isCorrect: false,
                        explanation:
                            'Cassandra full-text search support করে না।',
                    },
                    {
                        key: 'd',
                        text: 'PostgreSQL LIKE query',
                        isCorrect: false,
                        explanation:
                            'PostgreSQL LIKE query O(n) — 200M tweets-এ অনেক slow হবে।',
                    },
                ],
            },
            {
                id: 6,
                text: 'Twitter-এ Follow graph (কে কাকে follow করে) store করার জন্য কোনটা ভালো?',
                options: [
                    {
                        key: 'a',
                        text: 'MySQL table',
                        isCorrect: false,
                        explanation:
                            'MySQL follow graph-এর জন্য efficient নয় — billions of edges handle করতে পারবেন না।',
                    },
                    {
                        key: 'b',
                        text: 'File system',
                        isCorrect: false,
                        explanation:
                            'File system database-এর replacement হতে পারে না।',
                    },
                    {
                        key: 'c',
                        text: 'Redis Sorted Set / Graph DB',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Follow graph = social graph। Redis Sorted Set-এ user_id → follower_ids store করুন। Follower count, mutual follows efficiently query করা যায়। Large scale-এ Neo4j বা FlockDB (Twitter\'s own graph DB) use হয়।',
                    },
                    {
                        key: 'd',
                        text: 'Array in memory',
                        isCorrect: false,
                        explanation:
                            'Memory-তে array persistent নয় — server restart-এ সব হারিয়ে যাবেন।',
                    },
                ],
            },
            {
                id: 7,
                text: 'Tweet image/video কোথায় store করবেন?',
                options: [
                    {
                        key: 'a',
                        text: 'Amazon S3 + CloudFront CDN',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Binary files (images, videos) object storage-এ রাখুন। S3 reliable, cheap, scalable। CDN (CloudFront) globally distribute করে — user-এর কাছের edge server থেকে fast delivery। Database-এ BLOB = terrible idea for scale।',
                    },
                    {
                        key: 'b',
                        text: 'Database BLOB field',
                        isCorrect: false,
                        explanation:
                            'Database-এ binary files store করা terrible idea — database slow হয়ে যায়।',
                    },
                    {
                        key: 'c',
                        text: 'API Server local disk',
                        isCorrect: false,
                        explanation:
                            'Local disk single point of failure — server crash হলে সব media হারিয়ে যাবেন।',
                    },
                    {
                        key: 'd',
                        text: 'Redis cache',
                        isCorrect: false,
                        explanation:
                            'Redis memory-based — large media files store করলেন expensive এবং volatile।',
                    },
                ],
            },
            {
                id: 8,
                text: 'Real-time Trending Topics (#Trending) কীভাবে implement করবেন?',
                options: [
                    {
                        key: 'a',
                        text: 'প্রতি second DB scan করুন',
                        isCorrect: false,
                        explanation:
                            'প্রতি second full DB scan করা অত্যন্ত expensive এবং impractical।',
                    },
                    {
                        key: 'b',
                        text: 'User vote করবেন',
                        isCorrect: false,
                        explanation:
                            'User voting trending algorithm-এর সঠিক approach নয়।',
                    },
                    {
                        key: 'c',
                        text: 'Daily batch job',
                        isCorrect: false,
                        explanation:
                            'Daily batch job real-time trending-এর জন্য কাজ করে না — too slow।',
                    },
                    {
                        key: 'd',
                        text: 'Redis Sorted Set + sliding window count',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Redis Sorted Set-এ hashtag → last 1 hour count রাখুন। নতুন tweet → ZINCRBY করুন। ZREVRANGE দিয়ে top trending পান। Sliding window (last 1 hour) দিয়ে stale trends avoid করুন।',
                    },
                ],
            },
            {
                id: 9,
                text: 'Twitter-এর Like count millions হলে race condition prevent করবেন কীভাবে?',
                options: [
                    {
                        key: 'a',
                        text: 'Single thread-এ সব process করুন',
                        isCorrect: false,
                        explanation:
                            'Single thread bottleneck তৈরি করে — scale করা যায় না।',
                    },
                    {
                        key: 'b',
                        text: 'Redis INCR (atomic operation)',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Redis INCR atomic operation — concurrent requests-এ race condition নেই। DB-তে SELECT FOR UPDATE lock expensive। Redis INCR lightning fast, atomic, perfect for counters।',
                    },
                    {
                        key: 'c',
                        text: 'DB transaction lock করুন',
                        isCorrect: false,
                        explanation:
                            'DB lock expensive এবং slow — high concurrency-তে bottleneck।',
                    },
                    {
                        key: 'd',
                        text: 'Like count approximate রাখুন',
                        isCorrect: false,
                        explanation:
                            'Approximate count acceptable হতে পারে কিন্তু Redis INCR exact এবং atomic — better solution।',
                    },
                ],
            },
            {
                id: 10,
                text: 'Twitter-এ Kafka use করার primary reason কী?',
                options: [
                    {
                        key: 'a',
                        text: 'Primary database হিসেবে',
                        isCorrect: false,
                        explanation:
                            'Kafka message queue — database নয়। Persistent storage-এর জন্য Cassandra use হয়।',
                    },
                    {
                        key: 'b',
                        text: 'User authentication-এর জন্য',
                        isCorrect: false,
                        explanation:
                            'Authentication Kafka-এর কাজ নয়।',
                    },
                    {
                        key: 'c',
                        text: 'Async fanout — tweet post-এর পরে background-এ distribute করতে',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Tweet POST request immediately return করে। Kafka queue-তে tweet_id push হয়। Background consumers async-ভাবে follower timelines update করে। এই decoupling দিয়ে write latency কমে এবং system resilient হয়।',
                    },
                    {
                        key: 'd',
                        text: 'Image compression-এর জন্য',
                        isCorrect: false,
                        explanation:
                            'Image compression Kafka-এর কাজ নয়।',
                    },
                ],
            },
        ],
    },

    // ─── Assignment ───
    assignment: {
        title: 'Twitter Feed System ডিজাইন করুন',
        time: '৪-৫ ঘন্টা',
        difficulty: 'Advanced',
        tasks: [
            <span key='1'>
                <strong>Full Architecture Diagram:</strong> Excalidraw বা
                draw.io-তে Twitter-এর complete system diagram আঁকুন। Include:
                Client, API Gateway, Tweet Service, Fanout Service, Timeline
                Service, Kafka, Cassandra (Tweet DB), Redis (Timeline Cache),
                Elasticsearch, S3+CDN। Arrows দিয়ে data flow দেখাও।
            </span>,
            <span key='2'>
                <strong>Fanout Comparison:</strong> একটা table বানান —
                Fan-out on Write vs Fan-out on Read। প্রতিটার জন্য: Write
                cost, Read latency, Storage cost, Celebrity problem, Normal
                user experience। আপনি কোনটা choose করতে এবং কেন?
            </span>,
            <span key='3'>
                <strong>Data Model Design:</strong> Tweet, User, এবং Follow
                tables-এর schema লিখুন (Cassandra format)। Partition key,
                clustering key কী হবে explain করুন।
            </span>,
            <span key='4'>
                <strong>Trending Hashtags Algorithm:</strong> Redis Sorted
                Set ব্যবহার করে &ldquo;last 1 hour trending hashtags&rdquo;
                কীভাবে implement করবেন pseudo-code লিখুন।
            </span>,
            <span key='5'>
                <strong>Scaling Question:</strong> Twitter-এ World Cup final
                চলছে — প্রতি second 100,000 tweets হচ্ছে #WorldCupFinal
                নিয়ে। আপনার system কীভাবে এই sudden spike handle করবেন?
                ৩-৫ লাইন লিখুন।
            </span>,
        ],
        deliverables: [
            <span key='1'>Full Twitter architecture diagram (Excalidraw/draw.io)</span>,
            <span key='2'>Fanout on Write vs Read comparison table with justification</span>,
            <span key='3'>Cassandra data model schema with partition key explanation</span>,
            <span key='4'>Trending hashtag Redis pseudo-code implementation</span>,
        ],
    },

    // ─── Practical Lab ───
    practicalLab: {
        title: 'Twitter Timeline Service',
        subtitle: 'Fanout + Redis + Cassandra',
        steps: [
            {
                title: 'Redis Timeline Cache Setup করুন',
                description:
                    'Docker দিয়ে Redis চালাও। Python redis client দিয়ে timeline:user_id key-এ LPUSH করুন। LTRIM দিয়ে last 800 tweets রাখুন।',
            },
            {
                title: 'Fanout Service লিখুন',
                description:
                    'Python function লিখুন যেটা followers list নিয়ে hybrid fanout করে। <10K followers → Redis push, ≥10K → Kafka queue।',
            },
            {
                title: 'Timeline Read Path Implement করুন',
                description:
                    'get_home_timeline() function লিখুন। Redis cache থেকে regular timeline পড়ো। Celebrity list থেকে আলাদাভাবে fetch করুন। Merge করে sort করুন।',
            },
            {
                title: 'Trending Hashtags যোগ করুন',
                description:
                    'ZINCRBY দিয়ে hashtag counts update করুন। ZREVRANGE দিয়ে top 10 trending return করুন। Sliding window (per hour key) implement করুন।',
            },
            {
                title: 'Load Test করুন',
                description:
                    'locust বা wrk দিয়ে timeline endpoint-এ load দিন। Cache miss vs cache hit latency compare করুন। Celebrity vs normal user fanout time measure করুন।',
            },
        ],
        codeBlock: {
            language: 'python',
            filename: 'twitter_timeline_fanout.py',
            code: `import redis
import time
import asyncio
from dataclasses import dataclass, field
from typing import List, Optional

r = redis.Redis(host='localhost', port=6379, decode_responses=True)

CELEBRITY_THRESHOLD = 10_000
TIMELINE_MAX_SIZE = 800

# ─── Fanout Service ───
async def fanout_tweet(tweet_id: str, author_id: str, follower_ids: List[str]):
    """Hybrid fanout: push for normal users, Kafka for celebrities"""
    follower_count = len(follower_ids)

    if follower_count < CELEBRITY_THRESHOLD:
        # Fan-out on write: push tweet_id to each follower's timeline
        pipe = r.pipeline()
        for follower_id in follower_ids:
            pipe.lpush(f"timeline:{follower_id}", tweet_id)
            pipe.ltrim(f"timeline:{follower_id}", 0, TIMELINE_MAX_SIZE - 1)
        pipe.execute()
        print(f"[PUSH] Fanned out tweet {tweet_id} to {follower_count} followers")
    else:
        # Fan-out on read: just mark as celebrity tweet, pull at read time
        r.sadd(f"celebrity_tweets:{author_id}", tweet_id)
        r.expire(f"celebrity_tweets:{author_id}", 86400)  # 24hr TTL
        print(f"[PULL] Celebrity {author_id}: tweet queued for read-time pull")

    # Always persist tweet metadata
    r.hset(f"tweet:{tweet_id}", mapping={
        "author_id": author_id,
        "created_at": str(time.time()),
        "tweet_id": tweet_id,
    })

# ─── Timeline Read Service ───
def get_home_timeline(user_id: str, page: int = 0, limit: int = 20) -> List[dict]:
    """
    Returns merged timeline: pre-computed cache + celebrity tweets
    """
    start = page * limit
    end = start + limit - 1

    # Step 1: Pre-built timeline from Redis cache (normal users)
    cached_ids = r.lrange(f"timeline:{user_id}", start, end)

    # Step 2: Get celebrities this user follows
    celebrity_ids = r.smembers(f"following_celebrities:{user_id}")

    # Step 3: Pull recent tweets from celebrities (fan-out on read)
    celebrity_tweet_ids = []
    for celeb_id in celebrity_ids:
        recent = r.smembers(f"celebrity_tweets:{celeb_id}")
        celebrity_tweet_ids.extend(list(recent)[:5])  # last 5 per celeb

    # Step 4: Merge + deduplicate + sort by created_at
    all_ids = list(set(cached_ids + celebrity_tweet_ids))

    # Fetch tweet metadata and sort
    tweets = []
    for tid in all_ids:
        data = r.hgetall(f"tweet:{tid}")
        if data:
            tweets.append(data)

    tweets.sort(key=lambda t: float(t.get("created_at", 0)), reverse=True)
    return tweets[:limit]

# ─── Trending Hashtags ───
def record_hashtag(hashtag: str):
    current_hour = int(time.time() // 3600)
    key = f"trending:{current_hour}"
    r.zincrby(key, 1, hashtag.lower())
    r.expire(key, 7200)  # keep for 2 hours

def get_trending_hashtags(top_n: int = 10) -> list:
    current_hour = int(time.time() // 3600)
    prev_hour = current_hour - 1
    # Sliding window: merge current + previous hour
    dest = f"trending:merged:{current_hour}"
    r.zunionstore(dest, [f"trending:{current_hour}", f"trending:{prev_hour}"])
    r.expire(dest, 3600)
    return r.zrevrange(dest, 0, top_n - 1, withscores=True)

# ─── Like Counter (atomic) ───
def like_tweet(tweet_id: str, user_id: str) -> int:
    like_key = f"likes:{tweet_id}"
    user_likes_key = f"user_liked:{user_id}"

    # Idempotent like: check if already liked
    if r.sismember(user_likes_key, tweet_id):
        return int(r.get(like_key) or 0)

    pipe = r.pipeline()
    pipe.incr(like_key)          # atomic increment
    pipe.sadd(user_likes_key, tweet_id)
    results = pipe.execute()
    return results[0]

# ─── Demo ───
if __name__ == "__main__":
    # Simulate fanout for normal user
    asyncio.run(fanout_tweet(
        tweet_id="tweet_001",
        author_id="user_normal",
        follower_ids=[f"follower_{i}" for i in range(500)]
    ))

    # Simulate fanout for celebrity
    asyncio.run(fanout_tweet(
        tweet_id="tweet_002",
        author_id="user_celebrity",
        follower_ids=[f"follower_{i}" for i in range(50_000)]
    ))

    # Record some hashtags
    for tag in ["#Python", "#Python", "#SystemDesign", "#Python", "#Redis"]:
        record_hashtag(tag)

    print("Trending:", get_trending_hashtags(5))

    # Like a tweet
    count = like_tweet("tweet_001", "user_fan_1")
    print(f"Likes on tweet_001: {count}")`,
        },
        tip: (
            <span>
                Fanout theory নয় — practically দেখবেন Redis List-এ timeline
                কীভাবে build হয়, celebrity vs normal user-এর fanout path
                কীভাবে আলাদা হয়, এবং sliding window trending কীভাবে কাজ
                করে। এই patterns interview-এ{' '}
                <strong className='text-foreground'>
                    senior engineer level
                </strong>{' '}
                discussion-এ কাজে আসবেন।
            </span>
        ),
    },
};
