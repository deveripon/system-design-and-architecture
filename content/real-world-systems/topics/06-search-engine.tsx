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

export const searchEngineContent: TopicData = {
    id: 'search-engine',
    sections: [
        {
            id: 'intro-why-search',
            subHeader: { index: '001', title: 'Why This System' },
            title: (
                <SectionTitle>
                    Search কেন Hard?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                Google প্রতিদিন <strong className='text-foreground'>8.5 billion searches</strong> process
                                করে। Typeahead-এ প্রতিটা keypress-এ suggestions দেখাতে হয় —{' '}
                                <strong className='text-foreground'>100ms-এর মধ্যে</strong>।
                                এই system-এ দুটো আলাদা challenge:{' '}
                                <strong className='text-foreground'>Full-text search</strong> এবং{' '}
                                <strong className='text-foreground'>real-time autocomplete</strong>।
                            </ContentParagraph>

                            {/* Architecture Overview SVG */}
                            <div className='bg-card/50 border border-border rounded-lg p-6 overflow-x-auto'>
                                <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                    SEARCH ENGINE — High Level Overview
                                </p>
                                <svg
                                    width='680'
                                    height='320'
                                    viewBox='0 0 680 320'
                                    className='max-w-full'>
                                    <defs>
                                        <marker
                                            id='arr-s'
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
                                            id='arrP-s'
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
                                    </defs>

                                    {/* Data Sources */}
                                    <rect
                                        x='10'
                                        y='30'
                                        width='100'
                                        height='35'
                                        rx='4'
                                        className='fill-card stroke-border'
                                        strokeWidth='1.5'
                                    />
                                    <text
                                        x='60'
                                        y='48'
                                        textAnchor='middle'
                                        className='fill-muted-foreground'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        WEB CRAWLER
                                    </text>
                                    <text
                                        x='60'
                                        y='60'
                                        textAnchor='middle'
                                        className='fill-muted-foreground'
                                        fontFamily='monospace'
                                        fontSize='8'
                                        opacity='0.7'>
                                        HTML pages
                                    </text>

                                    <rect
                                        x='10'
                                        y='80'
                                        width='100'
                                        height='35'
                                        rx='4'
                                        className='fill-card stroke-border'
                                        strokeWidth='1.5'
                                    />
                                    <text
                                        x='60'
                                        y='98'
                                        textAnchor='middle'
                                        className='fill-muted-foreground'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        DB CONNECTOR
                                    </text>
                                    <text
                                        x='60'
                                        y='110'
                                        textAnchor='middle'
                                        className='fill-muted-foreground'
                                        fontFamily='monospace'
                                        fontSize='8'
                                        opacity='0.7'>
                                        Products, articles
                                    </text>

                                    {/* Arrows to Doc Processor */}
                                    <path
                                        d='M 110 47 L 160 100'
                                        stroke='#64748b'
                                        strokeWidth='1.2'
                                        markerEnd='url(#arr-s)'
                                    />
                                    <path
                                        d='M 110 97 L 160 105'
                                        stroke='#64748b'
                                        strokeWidth='1.2'
                                        markerEnd='url(#arr-s)'
                                    />

                                    {/* Doc Processor */}
                                    <rect
                                        x='160'
                                        y='75'
                                        width='110'
                                        height='55'
                                        rx='4'
                                        fill='rgba(139,92,246,0.08)'
                                        stroke='#8b5cf6'
                                        strokeWidth='1.5'
                                    />
                                    <text
                                        x='215'
                                        y='98'
                                        textAnchor='middle'
                                        fill='#8b5cf6'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        DOCUMENT
                                    </text>
                                    <text
                                        x='215'
                                        y='111'
                                        textAnchor='middle'
                                        fill='#8b5cf6'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        PROCESSOR
                                    </text>
                                    <text
                                        x='215'
                                        y='124'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        Tokenize, Normalize
                                    </text>

                                    {/* Arrow to Inverted Index Builder */}
                                    <path
                                        d='M 270 102 L 330 102'
                                        stroke='#64748b'
                                        strokeWidth='1.2'
                                        markerEnd='url(#arr-s)'
                                    />

                                    {/* Inverted Index Builder */}
                                    <rect
                                        x='330'
                                        y='75'
                                        width='120'
                                        height='55'
                                        rx='4'
                                        fill='rgba(16,185,129,0.08)'
                                        stroke='#10b981'
                                        strokeWidth='1.5'
                                    />
                                    <text
                                        x='390'
                                        y='98'
                                        textAnchor='middle'
                                        fill='#10b981'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        INVERTED INDEX
                                    </text>
                                    <text
                                        x='390'
                                        y='111'
                                        textAnchor='middle'
                                        fill='#10b981'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        BUILDER
                                    </text>
                                    <text
                                        x='390'
                                        y='124'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        Elasticsearch
                                    </text>

                                    {/* Arrow to Search Index */}
                                    <path
                                        d='M 450 102 L 510 102'
                                        stroke='#64748b'
                                        strokeWidth='1.2'
                                        markerEnd='url(#arr-s)'
                                    />

                                    {/* Search Index */}
                                    <rect
                                        x='510'
                                        y='75'
                                        width='110'
                                        height='55'
                                        rx='4'
                                        fill='rgba(234,179,8,0.08)'
                                        stroke='#eab308'
                                        strokeWidth='1.5'
                                    />
                                    <text
                                        x='565'
                                        y='95'
                                        textAnchor='middle'
                                        fill='#eab308'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        SEARCH
                                    </text>
                                    <text
                                        x='565'
                                        y='108'
                                        textAnchor='middle'
                                        fill='#eab308'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        INDEX
                                    </text>
                                    <text
                                        x='565'
                                        y='121'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        Sharded replicas
                                    </text>

                                    {/* Divider lines */}
                                    <line
                                        x1='0'
                                        y1='155'
                                        x2='680'
                                        y2='155'
                                        stroke='#1e2d4a'
                                        strokeWidth='1'
                                        strokeDasharray='4,4'
                                    />
                                    <text
                                        x='340'
                                        y='148'
                                        textAnchor='middle'
                                        fill='#475569'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        ── INDEXING PIPELINE (offline) ──
                                    </text>
                                    <text
                                        x='340'
                                        y='175'
                                        textAnchor='middle'
                                        fill='#475569'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        ── QUERY PIPELINE (online) ──
                                    </text>

                                    {/* User */}
                                    <rect
                                        x='10'
                                        y='190'
                                        width='70'
                                        height='40'
                                        rx='4'
                                        className='fill-card stroke-border'
                                        strokeWidth='1.5'
                                    />
                                    <text
                                        x='45'
                                        y='208'
                                        textAnchor='middle'
                                        className='fill-muted-foreground'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        USER
                                    </text>
                                    <text
                                        x='45'
                                        y='221'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        Types query
                                    </text>
                                    <path
                                        d='M 80 210 L 120 210'
                                        stroke='#8b5cf6'
                                        strokeWidth='1.5'
                                        markerEnd='url(#arrP-s)'
                                    />

                                    {/* Query Processor */}
                                    <rect
                                        x='120'
                                        y='185'
                                        width='110'
                                        height='55'
                                        rx='4'
                                        fill='rgba(139,92,246,0.08)'
                                        stroke='#8b5cf6'
                                        strokeWidth='1.5'
                                    />
                                    <text
                                        x='175'
                                        y='208'
                                        textAnchor='middle'
                                        fill='#8b5cf6'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        QUERY
                                    </text>
                                    <text
                                        x='175'
                                        y='221'
                                        textAnchor='middle'
                                        fill='#8b5cf6'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        PROCESSOR
                                    </text>
                                    <text
                                        x='175'
                                        y='234'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        Parse, Analyze
                                    </text>

                                    {/* Cache Check */}
                                    <path
                                        d='M 230 210 L 270 210'
                                        stroke='#64748b'
                                        strokeWidth='1.2'
                                        markerEnd='url(#arr-s)'
                                    />
                                    <rect
                                        x='270'
                                        y='185'
                                        width='90'
                                        height='55'
                                        rx='4'
                                        fill='rgba(249,115,22,0.08)'
                                        stroke='#f97316'
                                        strokeWidth='1.5'
                                    />
                                    <text
                                        x='315'
                                        y='208'
                                        textAnchor='middle'
                                        fill='#f97316'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        CACHE
                                    </text>
                                    <text
                                        x='315'
                                        y='221'
                                        textAnchor='middle'
                                        fill='#f97316'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        CHECK
                                    </text>
                                    <text
                                        x='315'
                                        y='234'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        Redis
                                    </text>

                                    {/* Search Engine */}
                                    <path
                                        d='M 360 210 L 400 210'
                                        stroke='#64748b'
                                        strokeWidth='1.2'
                                        markerEnd='url(#arr-s)'
                                    />
                                    <rect
                                        x='400'
                                        y='185'
                                        width='120'
                                        height='55'
                                        rx='4'
                                        fill='rgba(16,185,129,0.08)'
                                        stroke='#10b981'
                                        strokeWidth='1.5'
                                    />
                                    <text
                                        x='460'
                                        y='208'
                                        textAnchor='middle'
                                        fill='#10b981'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        SEARCH ENGINE
                                    </text>
                                    <text
                                        x='460'
                                        y='221'
                                        textAnchor='middle'
                                        fill='#10b981'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        QUERY EXECUTOR
                                    </text>
                                    <text
                                        x='460'
                                        y='234'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        Hits inverted index
                                    </text>

                                    {/* Ranker */}
                                    <path
                                        d='M 520 210 L 560 210'
                                        stroke='#64748b'
                                        strokeWidth='1.2'
                                        markerEnd='url(#arr-s)'
                                    />
                                    <rect
                                        x='560'
                                        y='185'
                                        width='100'
                                        height='55'
                                        rx='4'
                                        fill='rgba(234,179,8,0.08)'
                                        stroke='#eab308'
                                        strokeWidth='1.5'
                                    />
                                    <text
                                        x='610'
                                        y='208'
                                        textAnchor='middle'
                                        fill='#eab308'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        RANKER
                                    </text>
                                    <text
                                        x='610'
                                        y='221'
                                        textAnchor='middle'
                                        fill='#eab308'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        &amp; RESULTS
                                    </text>
                                    <text
                                        x='610'
                                        y='234'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        TF-IDF, PageRank
                                    </text>

                                    {/* Arrow back to user */}
                                    <path
                                        d='M 610 240 L 610 285 L 45 285 L 45 230'
                                        stroke='#64748b'
                                        strokeWidth='1.2'
                                        strokeDasharray='4,3'
                                        markerEnd='url(#arr-s)'
                                    />
                                    <text
                                        x='330'
                                        y='300'
                                        textAnchor='middle'
                                        fill='#475569'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        Results returned to user
                                    </text>
                                </svg>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 Two Different Problems',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>Search:</strong> "wireless headphones"
                                type করলেন relevant results দেখাও (relevance,
                                ranking)।
                            </p>
                            <p>
                                <strong>Typeahead/Autocomplete:</strong> "wire"
                                type করতেই "wireless headphones", "wireless
                                mouse" suggestions দেখাও (speed, prefix
                                matching)।
                            </p>
                            <p>
                                দুটো problem আলাদা — আলাদা data structure এবং
                                approach দরকার।
                            </p>
                        </div>
                    ),
                },
            ],
        },

        {
            id: 'requirements',
            subHeader: { index: '002', title: 'Requirements' },
            title: (
                <SectionTitle>Features কী কী?</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {/* Functional Requirements */}
                            <div className='bg-card/50 border border-primary/20 rounded-lg p-5'>
                                <p className='font-mono text-xs uppercase tracking-widest text-primary mb-4 font-bold'>
                                    ✅ Functional Requirements
                                </p>
                                <ul className='space-y-2'>
                                    {[
                                        'Full-text search (keyword)',
                                        'Typeahead/autocomplete',
                                        'Fuzzy matching (typo tolerance)',
                                        'Faceted search (filter by category)',
                                        'Relevance ranking',
                                        'Search suggestions (trending)',
                                        'Personalized suggestions',
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className='text-sm text-muted-foreground flex items-start gap-2 border-b border-border pb-2 last:border-0'>
                                            <span className='text-muted-foreground font-mono mt-0.5'>
                                                →
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Non-Functional Requirements */}
                            <div className='bg-card/50 border border-emerald-500/20 rounded-lg p-5'>
                                <p className='font-mono text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-4 font-bold'>
                                    ⚡ Non-Functional Requirements
                                </p>
                                <ul className='space-y-2'>
                                    {[
                                        'Typeahead < 100ms latency',
                                        'Search results < 500ms',
                                        'Billions of documents indexed',
                                        'High availability 99.99%',
                                        'New content indexed within minutes',
                                        'Support 100K+ queries/sec',
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className='text-sm text-muted-foreground flex items-start gap-2 border-b border-border pb-2 last:border-0'>
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
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div>
                            <p className='font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4'>
                                Back-of-Envelope — Google-এর Scale
                            </p>
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                                {[
                                    { num: '8.5B', label: 'Daily Searches' },
                                    { num: '99K', label: 'Searches/sec' },
                                    { num: '100B+', label: 'Indexed Web Pages' },
                                    { num: '15%', label: 'New queries daily' },
                                    { num: '~20', label: 'Characters avg query' },
                                    { num: '~5', label: 'Keystrokes per typeahead' },
                                ].map((card, i) => (
                                    <div
                                        key={i}
                                        className='bg-card/50 border border-border rounded-lg p-4 text-center'>
                                        <span className='font-mono text-2xl font-bold text-primary block mb-1'>
                                            {card.num}
                                        </span>
                                        <span className='font-mono text-[10px] text-muted-foreground uppercase tracking-wide'>
                                            {card.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '🔢 Typeahead Requests',
                    content: (
                        <p>
                            User "apple" type করলেন: <code>a → ap → app → appl → apple</code> = 5 requests।{' '}
                            99K searches/sec × 5 ={' '}
                            <strong>~500K typeahead requests/sec</strong>।
                            Typeahead traffic search-এর চেয়ে অনেক বেশি! তাই{' '}
                            <strong>extreme optimization</strong> দরকার।
                        </p>
                    ),
                },
            ],
        },

        {
            id: 'typeahead-trie',
            subHeader: { index: '003', title: 'Typeahead / Autocomplete' },
            title: (
                <SectionTitle>Trie Data Structure</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Typeahead-এর জন্য{' '}
                            <strong className='text-foreground'>Trie</strong>{' '}
                            (Prefix Tree) সবচেয়ে natural data structure। প্রতিটা
                            node একটা character represent করে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-card/50 border border-border rounded-lg p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 text-center'>
                                TRIE VISUALIZATION — Prefix Tree
                            </p>
                            <svg
                                width='600'
                                height='270'
                                viewBox='0 0 600 270'
                                className='max-w-full mx-auto block'>
                                {/* Root */}
                                <circle
                                    cx='300'
                                    cy='30'
                                    r='18'
                                    fill='rgba(139,92,246,0.15)'
                                    stroke='#8b5cf6'
                                    strokeWidth='2'
                                />
                                <text
                                    x='300'
                                    y='36'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='12'
                                    fontWeight='700'>
                                    *
                                </text>
                                <text
                                    x='300'
                                    y='14'
                                    textAnchor='middle'
                                    fill='#475569'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    root
                                </text>

                                {/* Level 1: a */}
                                <line
                                    x1='300'
                                    y1='48'
                                    x2='140'
                                    y2='82'
                                    stroke='#1e2d4a'
                                    strokeWidth='1.5'
                                />
                                <circle
                                    cx='140'
                                    cy='100'
                                    r='18'
                                    fill='rgba(139,92,246,0.1)'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='140'
                                    y='106'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='13'
                                    fontWeight='700'>
                                    a
                                </text>

                                {/* Level 1: w */}
                                <line
                                    x1='300'
                                    y1='48'
                                    x2='460'
                                    y2='82'
                                    stroke='#1e2d4a'
                                    strokeWidth='1.5'
                                />
                                <circle
                                    cx='460'
                                    cy='100'
                                    r='18'
                                    fill='rgba(100,116,139,0.1)'
                                    stroke='#64748b'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='460'
                                    y='106'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='13'>
                                    w
                                </text>

                                {/* Level 2 from a: p */}
                                <line
                                    x1='140'
                                    y1='118'
                                    x2='80'
                                    y2='152'
                                    stroke='#1e2d4a'
                                    strokeWidth='1.5'
                                />
                                <circle
                                    cx='80'
                                    cy='170'
                                    r='18'
                                    fill='rgba(139,92,246,0.1)'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='80'
                                    y='176'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='13'
                                    fontWeight='700'>
                                    p
                                </text>

                                {/* Level 2 from a: r */}
                                <line
                                    x1='140'
                                    y1='118'
                                    x2='200'
                                    y2='152'
                                    stroke='#1e2d4a'
                                    strokeWidth='1.5'
                                />
                                <circle
                                    cx='200'
                                    cy='170'
                                    r='18'
                                    fill='rgba(100,116,139,0.1)'
                                    stroke='#64748b'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='200'
                                    y='176'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='13'>
                                    r
                                </text>

                                {/* Level 3 from ap: p (→ app) */}
                                <line
                                    x1='80'
                                    y1='188'
                                    x2='50'
                                    y2='220'
                                    stroke='#1e2d4a'
                                    strokeWidth='1.5'
                                />
                                <circle
                                    cx='50'
                                    cy='238'
                                    r='18'
                                    fill='rgba(16,185,129,0.15)'
                                    stroke='#10b981'
                                    strokeWidth='2'
                                />
                                <text
                                    x='50'
                                    y='244'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='12'
                                    fontWeight='700'>
                                    p
                                </text>
                                <text
                                    x='50'
                                    y='260'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    *end
                                </text>

                                {/* Level 3 from ap: i (→ api) */}
                                <line
                                    x1='80'
                                    y1='188'
                                    x2='110'
                                    y2='220'
                                    stroke='#1e2d4a'
                                    strokeWidth='1.5'
                                />
                                <circle
                                    cx='110'
                                    cy='238'
                                    r='18'
                                    fill='rgba(16,185,129,0.15)'
                                    stroke='#10b981'
                                    strokeWidth='2'
                                />
                                <text
                                    x='110'
                                    y='244'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='12'
                                    fontWeight='700'>
                                    i
                                </text>
                                <text
                                    x='110'
                                    y='260'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    *end
                                </text>

                                {/* Level 2 from w: i */}
                                <line
                                    x1='460'
                                    y1='118'
                                    x2='420'
                                    y2='152'
                                    stroke='#1e2d4a'
                                    strokeWidth='1.5'
                                />
                                <circle
                                    cx='420'
                                    cy='170'
                                    r='18'
                                    fill='rgba(100,116,139,0.1)'
                                    stroke='#64748b'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='420'
                                    y='176'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='13'>
                                    i
                                </text>

                                {/* Level 2 from w: o */}
                                <line
                                    x1='460'
                                    y1='118'
                                    x2='500'
                                    y2='152'
                                    stroke='#1e2d4a'
                                    strokeWidth='1.5'
                                />
                                <circle
                                    cx='500'
                                    cy='170'
                                    r='18'
                                    fill='rgba(100,116,139,0.1)'
                                    stroke='#64748b'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='500'
                                    y='176'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='13'>
                                    o
                                </text>

                                {/* Labels */}
                                <text
                                    x='340'
                                    y='90'
                                    fill='#475569'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    prefix "w..."
                                </text>
                                <text
                                    x='10'
                                    y='90'
                                    fill='#475569'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    prefix "a..."
                                </text>

                                {/* Callout box */}
                                <rect
                                    x='220'
                                    y='10'
                                    width='200'
                                    height='60'
                                    rx='4'
                                    fill='rgba(139,92,246,0.08)'
                                    stroke='rgba(139,92,246,0.3)'
                                    strokeWidth='1'
                                />
                                <text
                                    x='320'
                                    y='32'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='10'
                                    fontWeight='700'>
                                    User types "ap"
                                </text>
                                <text
                                    x='320'
                                    y='48'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    → app, api সাজেস্ট হবে
                                </text>
                                <text
                                    x='320'
                                    y='62'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    (green nodes = words)
                                </text>
                            </svg>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'trie.py — Typeahead Implementation',
                    code: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.frequency = 0  # কতবার search হয়েছে

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str, freq: int = 1):
        node = self.root
        for char in word.lower():
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
        node.frequency = freq

    def autocomplete(self, prefix: str, limit: int = 5) -> list:
        # Prefix node খুঁজে বের করুন
        node = self.root
        for char in prefix.lower():
            if char not in node.children:
                return []  # কোনো match নেই
            node = node.children[char]

        # Prefix node থেকে সব words collect করুন
        results = []
        self._dfs(node, prefix, results)

        # Frequency দিয়ে sort করুন (popular first)
        results.sort(key=lambda x: x[1], reverse=True)
        return [word for word, _ in results[:limit]]

    def _dfs(self, node, current, results):
        if node.is_end:
            results.append((current, node.frequency))
        for char, child in node.children.items():
            self._dfs(child, current + char, results)

# Usage example:
trie = Trie()
trie.insert("apple", freq=1000000)
trie.insert("application", freq=500000)
trie.insert("apply", freq=200000)

print(trie.autocomplete("app"))
# → ["apple", "application", "apply"]  (by frequency)`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: '⚠️ Trie at Scale Problem',
                    content: (
                        <p>
                            Billions of search queries-এর Trie memory-তে রাখা
                            possible না। Solution:{' '}
                            <strong>Top-K suggestions per node</strong> store
                            করুন। প্রতিটা prefix node-এ top 5-10 most popular
                            completions pre-computed রাখুন। DFS করতে হবে না —{' '}
                            <strong>O(1) lookup</strong>।
                        </p>
                    ),
                },
            ],
        },

        {
            id: 'web-crawling',
            subHeader: { index: '004', title: 'Web Crawling Architecture' },
            title: (
                <SectionTitle>
                    Web Crawler — Internet কীভাবে Index হয়?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Search engine index তৈরি করতে প্রথমে web থেকে
                            documents collect করতে হয়। এই কাজ করে{' '}
                            <strong className='text-foreground'>
                                Web Crawler
                            </strong>{' '}
                            (বা Spider)। Google প্রতিদিন billions of pages crawl
                            করে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    steps: [
                        {
                            title: (
                                <span className='font-mono text-primary'>
                                    Seed URLs — শুরুর URLs
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    কিছু popular domains দিয়ে শুরু করুন (wikipedia,
                                    news sites)। এগুলো queue-এ add করুন।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-primary'>
                                    URL Frontier (Priority Queue)
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Crawl করার pending URLs এর queue। Priority
                                    দিয়ে important pages আগে crawl করুন।
                                    Politeness policy — same domain বারবার hit
                                    না করা।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-primary'>
                                    HTML Fetcher &amp; Parser
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    HTTP request করে HTML নামাও। Links extract
                                    করুন। Robots.txt respect করুন। Content
                                    Document Processor-এ পাঠাও।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-primary'>
                                    Duplicate Detection
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    একই content বা URL আবার crawl করা waste।
                                    URL fingerprint (hash) store করুন। Already
                                    seen? Skip করুন।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-emerald-700 dark:text-emerald-400'>
                                    Document Store + Indexing Pipeline
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Crawled content S3/HDFS-এ store করুন।
                                    Indexing pipeline-এ পাঠাও। New links
                                    queue-এ add করুন।{' '}
                                    <span className='text-emerald-700 dark:text-emerald-400'>
                                        Repeat ✓
                                    </span>
                                </span>
                            ),
                        },
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Distributed Crawling',
                    content: (
                        <p>
                            Single crawler billions of pages handle করতে পারবেন
                            না। Distributed crawler cluster use করুন।{' '}
                            <strong>Consistent hashing</strong> দিয়ে URLs
                            different crawler nodes-এ assign করুন। Same domain
                            same node-এ যায় — politeness enforce সহজ।
                        </p>
                    ),
                },
            ],
        },

        {
            id: 'inverted-index',
            subHeader: { index: '005', title: 'Deep Dive — Full-Text Search' },
            title: (
                <SectionTitle>
                    Inverted Index — Search-এর Core
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Search engine-এর সবচেয়ে important data structure
                            হলো{' '}
                            <strong className='text-foreground'>
                                Inverted Index
                            </strong>
                            । এটা basically একটা dictionary যেখানে{' '}
                            <strong className='text-foreground'>
                                word → document list
                            </strong>{' '}
                            map করা থাকে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 Inverted Index কীভাবে কাজ করে',
                    content: (
                        <p>
                            <strong>Forward index:</strong> Document → Words।{' '}
                            <strong>Inverted index:</strong> Word → Documents।
                            "apple" search করলেন directly "apple" key look up
                            করুন → সব relevant documents পানয়া যায়। Sequential
                            scan দরকার নেই।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'inverted_index_example.py',
                    code: `# 3টা document আছে:
# Doc 1: "apple iphone review"
# Doc 2: "apple macbook laptop"
# Doc 3: "samsung galaxy review"

# Inverted Index (simplified):
inverted_index = {
    "apple":   [1, 2],       # Doc 1 এবং 2 এ আছে
    "iphone":  [1],          # শুধু Doc 1 এ
    "review":  [1, 3],       # Doc 1 এবং 3 এ
    "macbook": [2],          # শুধু Doc 2 এ
    "samsung": [3],          # শুধু Doc 3 এ
    "galaxy":  [3],          # শুধু Doc 3 এ
}

# Search "apple review" করলেন:
# apple → [1, 2]
# review → [1, 3]
# Intersection → [1] ← Most relevant!

def search(query: str) -> list:
    words = query.lower().split()
    # প্রতিটা word-এর document list নাও
    doc_lists = [set(inverted_index.get(w, [])) for w in words]
    # Intersection করুন (সব word আছে এমন docs)
    result = doc_lists[0].intersection(*doc_lists[1:])
    return sorted(result)`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-lg font-bold mt-2 mb-1 text-foreground'>
                            📊 TF-IDF — Relevance Ranking
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <p className='text-muted-foreground leading-relaxed'>
                            সব documents-এ word থাকলেই হবে না — কোনটা সবচেয়ে
                            relevant সেটা rank করতে হবে।{' '}
                            <strong className='text-foreground'>TF-IDF</strong>{' '}
                            (Term Frequency × Inverse Document Frequency) এটা
                            calculate করে।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Metric', 'Formula', 'মানে কী'],
                    rows: [
                        [
                            'TF (Term Frequency)',
                            <code className='font-mono text-xs'>
                                word count / total words
                            </code>,
                            'Document-এ word কতবার আছে',
                        ],
                        [
                            'IDF (Inverse Doc Freq)',
                            <code className='font-mono text-xs'>
                                log(total docs / docs with word)
                            </code>,
                            'Word কতটা rare/unique',
                        ],
                        [
                            'TF-IDF Score',
                            <code className='font-mono text-xs'>TF × IDF</code>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>
                                Higher = more relevant
                            </span>,
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Simple Example',
                    content: (
                        <p>
                            "the" শব্দটা সব document-এ থাকে → IDF low → Score
                            low। "Elasticsearch" rare word, শুধু কিছু docs-এ →
                            IDF high। এই doc-এ "Elasticsearch" অনেকবার → TF
                            high → Score very high। তাই "Elasticsearch tutorial"
                            search করলেন এই document আগে আসবেন।
                        </p>
                    ),
                },
            ],
        },

        {
            id: 'search-ranking',
            subHeader: { index: '006', title: 'Search Ranking' },
            title: (
                <SectionTitle>
                    Search Ranking Algorithms
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            TF-IDF দিয়ে basic relevance বোঝা যায়, কিন্তু
                            modern search engines আরও অনেক signal use করে।
                            Google-এর ranking{' '}
                            <strong className='text-foreground'>200+</strong>{' '}
                            factors consider করে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Ranking Signal', 'কী দেখে', 'Weight'],
                    rows: [
                        [
                            'TF-IDF',
                            'Word frequency & rarity',
                            <span className='text-yellow-700 dark:text-yellow-400'>Medium</span>,
                        ],
                        [
                            'PageRank',
                            'কতটা important sites link করেছেনে',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                High
                            </span>,
                        ],
                        [
                            'Click-through Rate',
                            'Users কতবার result click করে',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                High
                            </span>,
                        ],
                        [
                            'Freshness',
                            'Content কতটা নতুন',
                            <span className='text-yellow-700 dark:text-yellow-400'>Medium</span>,
                        ],
                        [
                            'User Location',
                            'Local results prioritize',
                            'Context-based',
                        ],
                        [
                            'ML Models (BERT)',
                            'Query intent বোঝা',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Very High
                            </span>,
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 PageRank — Link Graph Analysis',
                    content: (
                        <p>
                            Larry Page এবং Sergey Brin-এর original algorithm।
                            Web pages একটা directed graph। যে page-এ বেশি
                            important sites link করেছেনে, সেটার PageRank বেশি।{' '}
                            <strong>Iterative calculation</strong> — সব pages-এর
                            score calculate হওয়ার পর converge করে। আজও Google-এর
                            core ranking signal।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Modern: Learning to Rank (LTR)',
                    content: (
                        <p>
                            Traditional signals এর বাইরে আজকাল{' '}
                            <strong>Machine Learning</strong> use করা হয়। BERT
                            দিয়ে query intent বোঝো। User behavior (clicks,
                            dwell time) থেকে learn করুন। LambdaMART, RankNet
                            — ML-based ranking models। Google BERT 2019 থেকে
                            use করছে।
                        </p>
                    ),
                },
            ],
        },

        {
            id: 'database-storage',
            subHeader: { index: '007', title: 'Database Choice' },
            title: (
                <SectionTitle>কোন Data কোথায়?</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Data', 'Storage', 'Why?'],
                    rows: [
                        [
                            'Search index (inverted)',
                            <span className='text-primary font-mono text-sm'>
                                Elasticsearch / Lucene
                            </span>,
                            'Purpose-built for full-text search',
                        ],
                        [
                            'Typeahead Trie',
                            <span className='text-yellow-700 dark:text-yellow-400 font-mono text-sm'>
                                Redis (Sorted Sets) / In-memory
                            </span>,
                            'Sub-millisecond prefix lookup',
                        ],
                        [
                            'Popular queries',
                            <span className='text-yellow-700 dark:text-yellow-400 font-mono text-sm'>
                                Redis Sorted Set (ZADD score)
                            </span>,
                            'Rank by search frequency',
                        ],
                        [
                            'Search analytics',
                            <span className='text-orange-700 dark:text-orange-400 font-mono text-sm'>
                                Kafka → Hadoop/Spark
                            </span>,
                            'Stream processing for trending',
                        ],
                        [
                            'Document store',
                            <span className='text-emerald-700 dark:text-emerald-400 font-mono text-sm'>
                                Elasticsearch + S3
                            </span>,
                            'Original content + index',
                        ],
                        [
                            'Query cache',
                            <span className='text-yellow-700 dark:text-yellow-400 font-mono text-sm'>
                                Redis (TTL 1 hr)
                            </span>,
                            'Popular searches cached',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Redis Sorted Set for Typeahead',
                    content: (
                        <p>
                            <code>Redis ZADD "queries" &lt;frequency&gt; "apple"</code>।{' '}
                            ZRANGEBYSCORE দিয়ে top queries পান।{' '}
                            Prefix matching-এর জন্য ZRANGEBYLEX command।
                            Real-time frequency update করা যায়।{' '}
                            <strong>
                                Production-grade typeahead শুধু Redis দিয়েই
                                possible।
                            </strong>
                        </p>
                    ),
                },
            ],
        },

        {
            id: 'scalability',
            subHeader: { index: '008', title: 'Scaling Decisions' },
            title: (
                <SectionTitle>
                    Search Scale করার উপায়
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-4'>
                            {[
                                {
                                    type: 'Strategy',
                                    color: 'emerald',
                                    content: (
                                        <span className='text-sm text-muted-foreground leading-relaxed'>
                                            <strong className='text-foreground'>
                                                Index Sharding:
                                            </strong>{' '}
                                            Billions of documents single
                                            index-এ রাখা যাবেন না। Document ID
                                            বা alphabetically shard করুন। Query
                                            সব shards-এ যায়, results merge হয়।
                                        </span>
                                    ),
                                },
                                {
                                    type: 'Strategy',
                                    color: 'emerald',
                                    content: (
                                        <span className='text-sm text-muted-foreground leading-relaxed'>
                                            <strong className='text-foreground'>
                                                Query Cache:
                                            </strong>{' '}
                                            Popular queries (যেমন "iphone 15")
                                            result cache করুন Redis-এ। 80%
                                            queries repeat হয়। Cache hit হলে
                                            index touch করতে হয় না।
                                        </span>
                                    ),
                                },
                                {
                                    type: 'Strategy',
                                    color: 'emerald',
                                    content: (
                                        <span className='text-sm text-muted-foreground leading-relaxed'>
                                            <strong className='text-foreground'>
                                                Typeahead CDN:
                                            </strong>{' '}
                                            Popular prefixes ("app", "goo",
                                            "you") static JSON file হিসেবে
                                            CDN-এ serve করুন। Server hit হয় না।
                                        </span>
                                    ),
                                },
                                {
                                    type: 'Trade-off',
                                    color: 'red',
                                    content: (
                                        <span className='text-sm text-muted-foreground leading-relaxed'>
                                            <strong className='text-foreground'>
                                                Index Freshness vs Speed:
                                            </strong>{' '}
                                            Real-time indexing করলেন latency
                                            বাড়ে। Batch indexing করলেন নতুন
                                            content দেখাতে দেরি হয়। Google
                                            15-minute crawl lag normal।
                                        </span>
                                    ),
                                },
                                {
                                    type: 'Trade-off',
                                    color: 'red',
                                    content: (
                                        <span className='text-sm text-muted-foreground leading-relaxed'>
                                            <strong className='text-foreground'>
                                                Fuzzy Search Cost:
                                            </strong>{' '}
                                            Typo tolerance (fuzzy matching)
                                            expensive। Edit distance
                                            computation করতে হয়। Solution:
                                            Pre-compute common typos, phonetic
                                            matching।
                                        </span>
                                    ),
                                },
                            ].map((row, i) => (
                                <div
                                    key={i}
                                    className='flex gap-3 items-start'>
                                    <span
                                        className={`font-mono text-xs px-2 py-1 rounded flex-shrink-0 mt-0.5 ${
                                            row.color === 'emerald'
                                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                                                : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20'
                                        }`}>
                                        {row.type}
                                    </span>
                                    <div>{row.content}</div>
                                </div>
                            ))}
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='mt-6'>
                            <h3 className='text-sm font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4'>
                                Tech Stack
                            </h3>
                            <div className='space-y-4'>
                                <div>
                                    <p className='text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider'>
                                        Core Search
                                    </p>
                                    <div className='flex flex-wrap gap-2'>
                                        {[
                                            {
                                                label: 'Elasticsearch',
                                                color: 'text-primary border-primary/30 bg-primary/5',
                                            },
                                            {
                                                label: 'Apache Lucene (underlying)',
                                                color: 'text-primary border-primary/30 bg-primary/5',
                                            },
                                            {
                                                label: 'Apache Solr',
                                                color: 'text-primary border-primary/30 bg-primary/5',
                                            },
                                            {
                                                label: 'Java / Go',
                                                color: 'text-emerald-700 dark:text-emerald-400 border-emerald-400/30 bg-emerald-500/5',
                                            },
                                        ].map((t, i) => (
                                            <span
                                                key={i}
                                                className={`font-mono text-xs px-3 py-1.5 rounded border ${t.color}`}>
                                                {t.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className='text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider'>
                                        Typeahead
                                    </p>
                                    <div className='flex flex-wrap gap-2'>
                                        {[
                                            {
                                                label: 'Redis Sorted Sets',
                                                color: 'text-yellow-700 dark:text-yellow-400 border-yellow-400/30 bg-yellow-500/5',
                                            },
                                            {
                                                label: 'In-memory Trie',
                                                color: 'text-yellow-700 dark:text-yellow-400 border-yellow-400/30 bg-yellow-500/5',
                                            },
                                            {
                                                label: 'CDN (static prefix cache)',
                                                color: 'text-orange-700 dark:text-orange-400 border-orange-400/30 bg-orange-500/5',
                                            },
                                        ].map((t, i) => (
                                            <span
                                                key={i}
                                                className={`font-mono text-xs px-3 py-1.5 rounded border ${t.color}`}>
                                                {t.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className='text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider'>
                                        Data Pipeline
                                    </p>
                                    <div className='flex flex-wrap gap-2'>
                                        {[
                                            {
                                                label: 'Apache Kafka',
                                                color: 'text-red-700 dark:text-red-400 border-red-400/30 bg-red-500/5',
                                            },
                                            {
                                                label: 'Apache Spark (batch)',
                                                color: 'text-orange-700 dark:text-orange-400 border-orange-400/30 bg-orange-500/5',
                                            },
                                            {
                                                label: 'Flink (stream processing)',
                                                color: 'text-orange-700 dark:text-orange-400 border-orange-400/30 bg-orange-500/5',
                                            },
                                            {
                                                label: 'Hadoop HDFS',
                                                color: 'text-orange-700 dark:text-orange-400 border-orange-400/30 bg-orange-500/5',
                                            },
                                        ].map((t, i) => (
                                            <span
                                                key={i}
                                                className={`font-mono text-xs px-3 py-1.5 rounded border ${t.color}`}>
                                                {t.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
            ],
        },

        {
            id: 'interview-tips',
            subHeader: { index: '009', title: 'Interview Tips' },
            title: (
                <SectionTitle>
                    Interview-এ কী জিজ্ঞেস করা হয়?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '🎯 Q1: Search এবং Typeahead-এর পার্থক্য কী?',
                    content: (
                        <p>
                            <strong>Search:</strong> Full-text query নিয়ে
                            relevant documents return করে। Inverted index use
                            করে। 500ms পর্যন্ত acceptable।
                            <br />
                            <strong>Typeahead:</strong> Prefix দিয়ে suggestions
                            দেয়। Trie / Redis Sorted Set use করে। 100ms limit।
                            দুটো আলাদা system — আলাদা optimize করতে হয়।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '🎯 Q2: Elasticsearch vs Regular Database কেন?',
                    content: (
                        <p>
                            <strong>Regular DB (Postgres LIKE %word%):</strong>{' '}
                            Full table scan, slow, no ranking। Billions of
                            rows-এ impractical।
                            <br />
                            <strong>Elasticsearch (Inverted Index):</strong>{' '}
                            O(1) lookup per word, TF-IDF scoring built-in,
                            distributed sharding, fuzzy search support।
                            Purpose-built tool always wins।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '🎯 Q3: Typeahead কীভাবে scale করবেন?',
                    content: (
                        <p>
                            <strong>1)</strong> In-memory Trie — single server।{' '}
                            <strong>2)</strong> Redis Sorted Set — distributed,
                            real-time frequency update।{' '}
                            <strong>3)</strong> Top-K per prefix node — DFS
                            avoid করুন।{' '}
                            <strong>4)</strong> Popular prefixes CDN-এ cache।{' '}
                            <strong>5)</strong> Debounce — user থামলে তবেই
                            request (300ms wait)।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '🎯 Q4: Typo Tolerance কীভাবে implement করবেন?',
                    content: (
                        <p>
                            <strong>Levenshtein distance:</strong> দুটো
                            string-এর মধ্যে minimum edit operations।{' '}
                            "appel" → "apple" = 1 edit। Elasticsearch
                            fuzziness parameter দিয়ে configure করা যায়।
                            Distance ≤ 2 হলে match। Cost বেশি বলে{' '}
                            <strong>
                                common typos pre-compute করে cache
                            </strong>{' '}
                            করুন।
                        </p>
                    ),
                },
            ],
        },
    ],

    summary: {
        headers: ['Challenge', 'Solution', 'Technology'],
        rows: [
            [
                <span className='font-bold text-primary'>Full-text search</span>,
                'Inverted index',
                'Elasticsearch/Lucene',
            ],
            [
                <span className='font-bold text-primary'>Autocomplete</span>,
                'Trie + frequency',
                'Redis Sorted Set',
            ],
            [
                <span className='font-bold text-primary'>Relevance ranking</span>,
                'TF-IDF scoring',
                'Elasticsearch scoring',
            ],
            [
                <span className='font-bold text-primary'>Scale index</span>,
                'Sharding',
                'Elasticsearch shards',
            ],
            [
                <span className='font-bold text-primary'>Trending queries</span>,
                'Stream processing',
                'Kafka + Flink',
            ],
            [
                <span className='font-bold text-primary'>Typo tolerance</span>,
                'Edit distance',
                'Elasticsearch fuzziness',
            ],
        ],
    },

    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'Inverted Index-এ কী store থাকে?',
                options: [
                    {
                        key: 'a',
                        text: 'Document → শব্দের list',
                        isCorrect: false,
                        explanation:
                            'এটা Forward Index — Inverted Index নয়।',
                    },
                    {
                        key: 'b',
                        text: 'শব্দ → document list (word to docs mapping)',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Inverted Index: word → [doc1, doc2, doc3...]। "apple" search করলেন directly এই list lookup করুন। Sequential scan করতে হয় না। এই structure-এর জন্যই Google milliseconds-এ billions of pages search করতে পারে।',
                    },
                    {
                        key: 'c',
                        text: 'Document → popularity score',
                        isCorrect: false,
                        explanation:
                            'Popularity score আলাদাভাবে store হয়, Inverted Index-এ নয়।',
                    },
                    {
                        key: 'd',
                        text: 'শব্দ → definition',
                        isCorrect: false,
                        explanation:
                            'শব্দের definition dictionary-তে থাকে, Inverted Index-এ নয়।',
                    },
                ],
            },
            {
                id: 2,
                text: 'Typeahead/Autocomplete-এর জন্য কোন data structure সবচেয়ে উপযুক্ত?',
                options: [
                    {
                        key: 'a',
                        text: 'HashMap',
                        isCorrect: false,
                        explanation:
                            'HashMap দিয়ে prefix matching efficient হয় না — exact key match করে শুধু।',
                    },
                    {
                        key: 'b',
                        text: 'Binary Search Tree',
                        isCorrect: false,
                        explanation:
                            'BST prefix-based autocomplete-এর জন্য optimal নয়।',
                    },
                    {
                        key: 'c',
                        text: 'Trie (Prefix Tree)',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Trie prefix-based lookup-এর জন্য designed। "app" type করলেন a → p → p node-এ যান, সেই subtree-এর সব words = suggestions। O(prefix length) time।',
                    },
                    {
                        key: 'd',
                        text: 'Linked List',
                        isCorrect: false,
                        explanation:
                            'Linked List-এ prefix matching O(n*m) — অনেক slow।',
                    },
                ],
            },
            {
                id: 3,
                text: 'TF-IDF-এ "the" শব্দের score কম কেন?',
                options: [
                    {
                        key: 'a',
                        text: 'সব documents-এ আছে তাই IDF কম',
                        isCorrect: true,
                        explanation:
                            'সঠিক। IDF = log(total docs / docs containing word)। "the" প্রায় সব documents-এ থাকে → denominator বড় → IDF ≈ log(1) = 0। Score = TF × 0 ≈ 0। এই কারণে common words ("stop words") search relevance-এ contribute করে না।',
                    },
                    {
                        key: 'b',
                        text: 'ছোট শব্দ তাই',
                        isCorrect: false,
                        explanation:
                            'শব্দের length TF-IDF score-এ directly সম্পর্কিত নয়।',
                    },
                    {
                        key: 'c',
                        text: 'কোনো meaning নেই',
                        isCorrect: false,
                        explanation:
                            'Semantic meaning TF-IDF বোঝে না — শুধু frequency দেখে।',
                    },
                    {
                        key: 'd',
                        text: 'Manually blacklisted',
                        isCorrect: false,
                        explanation:
                            'Stop words manually filter করা হয় separately — TF-IDF formula-তে automatically কম score পায়।',
                    },
                ],
            },
            {
                id: 4,
                text: 'Typeahead-এ popular suggestions আগে দেখানোর জন্য কী track করতে হবে?',
                options: [
                    {
                        key: 'a',
                        text: 'Alphabetical order',
                        isCorrect: false,
                        explanation:
                            'Alphabetical order popularity reflect করে না।',
                    },
                    {
                        key: 'b',
                        text: 'Document creation time',
                        isCorrect: false,
                        explanation:
                            'Document age typeahead popularity-র সাথে সম্পর্কিত নয়।',
                    },
                    {
                        key: 'c',
                        text: 'Random order',
                        isCorrect: false,
                        explanation:
                            'Random order useful suggestions দেবে না।',
                    },
                    {
                        key: 'd',
                        text: 'Search frequency (কতবার search হয়েছে)',
                        isCorrect: true,
                        explanation:
                            'সঠিক। প্রতিটা query log করুন। "apple" কতবার searched? Trie node-এ frequency store করুন। High frequency = সামনে দেখাও। Redis Sorted Set ZADD দিয়ে score update করুন। Trending searches automatically উপরে আসে।',
                    },
                ],
            },
            {
                id: 5,
                text: 'Search query cache করলেন কী সুবিধা?',
                options: [
                    {
                        key: 'a',
                        text: 'Search results better হয়',
                        isCorrect: false,
                        explanation:
                            'Cache result quality improve করে না — same result faster দেয়।',
                    },
                    {
                        key: 'b',
                        text: 'Popular queries index hit করে না — latency কমে, cost কমে',
                        isCorrect: true,
                        explanation:
                            'সঠিক। 80% queries repeat। "iphone 15 price" প্রতিদিন millions বার search হয়। Redis cache-এ result রাখুন (TTL 1 hr)। Cache hit → Elasticsearch touch করতে হয় না। Massive cost saving + lower latency।',
                    },
                    {
                        key: 'c',
                        text: 'New documents faster index হয়',
                        isCorrect: false,
                        explanation:
                            'Query cache indexing speed-এর সাথে সম্পর্কিত নয়।',
                    },
                    {
                        key: 'd',
                        text: 'Storage কমে',
                        isCorrect: false,
                        explanation:
                            'Query cache উল্টো storage বাড়ায় (cache data store করতে হয়)।',
                    },
                ],
            },
            {
                id: 6,
                text: 'Elasticsearch internally কোন data structure use করে indexing-এর জন্য?',
                options: [
                    {
                        key: 'a',
                        text: 'B-Tree',
                        isCorrect: false,
                        explanation:
                            'B-Tree relational databases use করে range queries-এর জন্য।',
                    },
                    {
                        key: 'b',
                        text: 'Hash Table',
                        isCorrect: false,
                        explanation:
                            'Hash table exact match করে — full-text search-এর জন্য উপযুক্ত নয়।',
                    },
                    {
                        key: 'c',
                        text: 'Inverted Index (Apache Lucene)',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Elasticsearch under the hood Apache Lucene use করে। Lucene inverted index-based search engine। Elasticsearch Lucene-এর উপরে distributed layer, REST API, JSON support add করেছেনে। Core search logic = inverted index।',
                    },
                    {
                        key: 'd',
                        text: 'Red-Black Tree',
                        isCorrect: false,
                        explanation:
                            'Red-Black Tree in-memory sorted data-এর জন্য — full-text search নয়।',
                    },
                ],
            },
            {
                id: 7,
                text: 'Billions of documents-এর index scale করতে কী করবেন?',
                options: [
                    {
                        key: 'a',
                        text: 'Index sharding — multiple nodes-এ ভাগ করুন',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Elasticsearch natively sharding support করে। প্রতিটা shard একটা Lucene instance। Query সব shards-এ parallel যায়, results merge হয়। 100 shards = 100x parallel search capability।',
                    },
                    {
                        key: 'b',
                        text: 'Single large server',
                        isCorrect: false,
                        explanation:
                            'Single server vertical scaling-এ limit আছে এবং single point of failure।',
                    },
                    {
                        key: 'c',
                        text: 'Compress the index',
                        isCorrect: false,
                        explanation:
                            'Compression search performance improve করে না significantly।',
                    },
                    {
                        key: 'd',
                        text: 'Old documents delete করুন',
                        isCorrect: false,
                        explanation:
                            'Data delete করা scalability solution নয়।',
                    },
                ],
            },
            {
                id: 8,
                text: 'Typo tolerance ("appel" → "apple") কীভাবে implement করবেন?',
                options: [
                    {
                        key: 'a',
                        text: 'User-কে ঠিক করতে বলুন',
                        isCorrect: false,
                        explanation:
                            'Poor UX — search engine নিজেই correct করবেন।',
                    },
                    {
                        key: 'b',
                        text: 'All possible typos store করুন',
                        isCorrect: false,
                        explanation:
                            'Infinite typos possible — feasible নয়।',
                    },
                    {
                        key: 'c',
                        text: 'Regex matching',
                        isCorrect: false,
                        explanation:
                            'Regex typo tolerance-এর জন্য practical নয়।',
                    },
                    {
                        key: 'd',
                        text: 'Edit distance (Levenshtein distance) algorithm',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Levenshtein distance: দুটো string-এর মধ্যে minimum edit operations (insert/delete/substitute)। "appel" → "apple" = 1 edit। Elasticsearch fuzziness parameter দিয়ে এটা configure করা যায়। Distance ≤ 2 হলে match।',
                    },
                ],
            },
            {
                id: 9,
                text: 'Typeahead request কেন search request-এর চেয়ে বেশি হয়?',
                options: [
                    {
                        key: 'a',
                        text: 'Users বেশি click করে',
                        isCorrect: false,
                        explanation:
                            'Clicks typeahead request volume বাড়ায় না।',
                    },
                    {
                        key: 'b',
                        text: 'প্রতিটা keypress একটা request — 1 search = 5-10 typeahead requests',
                        isCorrect: true,
                        explanation:
                            'সঠিক। "apple" type করলেন: a, ap, app, appl, apple = 5 typeahead requests, 1 search request। 5x বেশি। Google-এ 99K searches/sec মানে ~500K typeahead req/sec। তাই typeahead ultra-optimized হতে হবে।',
                    },
                    {
                        key: 'c',
                        text: 'Typeahead আলাদা users',
                        isCorrect: false,
                        explanation:
                            'Same users typeahead এবং search দুটোই use করে।',
                    },
                    {
                        key: 'd',
                        text: 'Error বেশি হয়',
                        isCorrect: false,
                        explanation:
                            'Error rate typeahead volume-এর কারণ নয়।',
                    },
                ],
            },
            {
                id: 10,
                text: 'Trending search suggestions ("iphone 16 release date" suddenly popular) কীভাবে real-time update করবেন?',
                options: [
                    {
                        key: 'a',
                        text: 'Manual update daily',
                        isCorrect: false,
                        explanation:
                            'Manual update real-time trending handle করতে পারবেন না।',
                    },
                    {
                        key: 'b',
                        text: 'Weekly batch job',
                        isCorrect: false,
                        explanation:
                            'Weekly batch job real-time trending-এর জন্য অনেক slow।',
                    },
                    {
                        key: 'c',
                        text: 'Kafka stream → real-time frequency counter update in Redis',
                        isCorrect: true,
                        explanation:
                            'সঠিক। প্রতিটা search event Kafka-তে publish হয়। Stream processor (Flink/Spark) consume করে Redis ZADD দিয়ে frequency update করে। Sliding window (last 1 hour) দিয়ে trending detect করে। Real-time Trie update হয় না — Redis Sorted Set-ই serve করে।',
                    },
                    {
                        key: 'd',
                        text: 'ML model monthly retrain',
                        isCorrect: false,
                        explanation:
                            'Monthly ML retrain real-time trending handle করতে পারবেন না।',
                    },
                ],
            },
        ],
    },

    assignment: {
        title: 'Search Engine System ডিজাইন করুন',
        time: '৪-৫ ঘন্টা',
        difficulty: 'Advanced',
        tasks: [
            <span key='1'>
                <strong>Inverted Index Build করুন:</strong> নিচের 4টা sentence
                দিয়ে manually inverted index তৈরি করুন। তারপর "system design"
                search করলেন কোন documents আসবেন? "System design is important",
                "Design patterns matter", "Search system architecture", "System
                architecture review"।
            </span>,
            <span key='2'>
                <strong>Trie Implement করুন:</strong> Python-এ একটা simple Trie
                implement করুন যেটা: <code>insert(word, frequency)</code>,{' '}
                <code>autocomplete(prefix, top_k=5)</code> support করে। Test
                করুন: insert "apple"(1M), "application"(500K), "apply"(200K),
                "apt"(50K)। autocomplete("app") → কী আসবেন?
            </span>,
            <span key='3'>
                <strong>Architecture Diagram:</strong> Search system-এর complete
                diagram আঁকুন। Indexing pipeline (Crawler → Processor → Index
                Builder → Elasticsearch) এবং Query pipeline (User → Query
                Processor → Cache → Search Engine → Ranker → Results) আলাদা
                দেখাও।
            </span>,
            <span key='4'>
                <strong>Redis Typeahead:</strong> Redis Sorted Set দিয়ে
                typeahead কীভাবে implement করবেন explain করুন। ZADD, ZINCRBY,
                ZREVRANGEBYSCORE commands কীভাবে use করবেন? "ap" prefix-এর top
                5 suggestions কীভাবে পাবেন?
            </span>,
            <span key='5'>
                <strong>Scaling Plan:</strong> Google-এর 100B pages-এর index
                Elasticsearch-এ রাখতে: কতটা shards দরকার? Replication factor
                কত রাখবে? কেন?
            </span>,
        ],
        deliverables: [
            <span key='1'>Manual inverted index table (4 documents)</span>,
            <span key='2'>
                Trie Python implementation with frequency sorting
            </span>,
            <span key='3'>
                Search architecture diagram (indexing + query pipelines)
            </span>,
            <span key='4'>Redis typeahead explanation with commands</span>,
        ],
    },

    practicalLab: {
        title: 'Typeahead Search System',
        subtitle: 'Trie + Redis + Elasticsearch',
        steps: [
            {
                title: 'Trie Data Structure Implement করুন',
                description:
                    'Python-এ TrieNode এবং Trie class লিখুন। insert(word, frequency) এবং autocomplete(prefix, limit=5) method যোগ করুন। Frequency দিয়ে sort করুন।',
            },
            {
                title: 'Redis Sorted Set দিয়ে Typeahead',
                description:
                    'Redis ZADD দিয়ে query frequency track করুন। ZRANGEBYLEX দিয়ে prefix matching করুন। Real-time frequency update করুন ZINCRBY দিয়ে।',
            },
            {
                title: 'Elasticsearch Index Setup করুন',
                description:
                    'Elasticsearch-এ index create করুন। Analyzer configure করুন (tokenize, lowercase, remove stop words)। Sample documents index করুন।',
            },
            {
                title: 'Query Pipeline Build করুন',
                description:
                    'User query নাও → Cache check (Redis) → Cache miss হলে Elasticsearch query করুন → TF-IDF score দিয়ে sort করুন → Result return করুন।',
            },
            {
                title: 'Performance Test করুন',
                description:
                    'locust বা k6 দিয়ে load test করুন। Typeahead 100ms-এর মধ্যে respond করছে কিনা দেখুন। Search 500ms-এর মধ্যে respond করছে কিনা verify করুন।',
            },
        ],
        codeBlock: {
            language: 'python',
            filename: 'typeahead_service.py',
            code: `import redis
from dataclasses import dataclass, field
from typing import List

# Redis connection
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

# ===== TRIE IMPLEMENTATION =====
@dataclass
class TrieNode:
    children: dict = field(default_factory=dict)
    is_end: bool = False
    frequency: int = 0
    top_k: List[tuple] = field(default_factory=list)  # Pre-computed top-K

class Trie:
    def __init__(self, k: int = 5):
        self.root = TrieNode()
        self.k = k

    def insert(self, word: str, freq: int = 1):
        node = self.root
        for char in word.lower():
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
        node.frequency = freq
        # Update top-K along the path
        self._update_top_k(word, freq)

    def _update_top_k(self, word: str, freq: int):
        """Update top-K at each node along the path"""
        node = self.root
        for char in word.lower():
            node = node.children[char]
            # Add to top-K and keep only k items
            node.top_k.append((word, freq))
            node.top_k.sort(key=lambda x: x[1], reverse=True)
            node.top_k = node.top_k[:self.k]

    def autocomplete(self, prefix: str) -> List[str]:
        """O(prefix_len) lookup using pre-computed top-K"""
        node = self.root
        for char in prefix.lower():
            if char not in node.children:
                return []
            node = node.children[char]
        # Return pre-computed top-K — no DFS needed!
        return [word for word, _ in node.top_k]

# ===== REDIS SORTED SET FOR TYPEAHEAD =====
class RedisTypeahead:
    QUERY_KEY = "typeahead:queries"

    def record_search(self, query: str):
        """Record a search query — increment frequency"""
        r.zincrby(self.QUERY_KEY, 1, query.lower())

    def get_suggestions(self, prefix: str, limit: int = 5) -> List[str]:
        """Get top suggestions for a prefix using ZRANGEBYLEX"""
        # Redis ZRANGEBYLEX trick: store all queries with score=0
        # Use separate key for prefix matching
        results = []
        # Get top-scored queries that start with prefix
        all_top = r.zrevrangebyscore(
            self.QUERY_KEY, '+inf', '-inf',
            start=0, num=100, withscores=True
        )
        for query, score in all_top:
            if query.startswith(prefix.lower()):
                results.append(query)
            if len(results) >= limit:
                break
        return results

    def get_trending(self, limit: int = 10) -> List[str]:
        """Get currently trending searches"""
        return r.zrevrange(self.QUERY_KEY, 0, limit - 1)

# ===== USAGE =====
trie = Trie(k=5)
# Pre-load popular queries
queries = [
    ("apple", 1_000_000),
    ("application", 500_000),
    ("apply", 200_000),
    ("apt", 50_000),
    ("app store", 800_000),
]
for word, freq in queries:
    trie.insert(word, freq)

# Typeahead from Trie
print("Trie suggestions for 'app':", trie.autocomplete("app"))
# → ['app store', 'apple', 'application', 'apply', 'apt']

# Redis-based typeahead
redis_typeahead = RedisTypeahead()
redis_typeahead.record_search("apple iphone 15")
redis_typeahead.record_search("apple macbook")
suggestions = redis_typeahead.get_suggestions("apple")
print("Redis suggestions:", suggestions)`,
        },
        tip: 'Production-এ Trie এবং Redis দুটোই use করুন। Trie in-memory fast lookups-এর জন্য। Redis distributed state এবং real-time trending-এর জন্য। CDN-এ popular prefixes cache করুন — server hit আরও কমে। এটাই Google-scale typeahead architecture।',
    },

};
