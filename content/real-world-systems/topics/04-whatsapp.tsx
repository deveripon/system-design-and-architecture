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

export const whatsappContent: TopicData = {
    id: 'whatsapp',
    sections: [
        {
            id: 'intro-challenge',
            subHeader: { index: '001', title: 'Why This System' },
            title: (
                <SectionTitle>
                    Chat System-এর Unique Challenges
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                WhatsApp-এ প্রতিদিন{' '}
                                <strong className='text-foreground'>
                                    100 billion messages
                                </strong>{' '}
                                send হয়। এই system-এ সবচেয়ে কঠিন সমস্যা হলো{' '}
                                <strong className='text-foreground'>
                                    real-time delivery
                                </strong>{' '}
                                — message পাঠানো সাথে সাথে receiver পাবেন, এমনকি
                                receiver offline থাকলেও পরে পাবেন।
                            </ContentParagraph>

                            {/* Architecture Overview Diagram */}
                            <div className='border border-border rounded-lg bg-card/50 p-6 overflow-x-auto'>
                                <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                    WHATSAPP — Message Flow Overview
                                </p>
                                <svg
                                    width='100%'
                                    viewBox='0 0 680 320'
                                    className='max-w-full'>
                                    <defs>
                                        <marker
                                            id='arrW'
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
                                            id='arrWG'
                                            markerWidth='8'
                                            markerHeight='8'
                                            refX='6'
                                            refY='3'
                                            orient='auto'>
                                            <path
                                                d='M0,0 L0,6 L8,3 z'
                                                fill='#25d366'
                                            />
                                        </marker>
                                        <marker
                                            id='arrWB'
                                            markerWidth='8'
                                            markerHeight='8'
                                            refX='6'
                                            refY='3'
                                            orient='auto'>
                                            <path
                                                d='M0,0 L0,6 L8,3 z'
                                                fill='#cc6b45'
                                            />
                                        </marker>
                                    </defs>
                                    {/* User A */}
                                    <rect
                                        x='10'
                                        y='120'
                                        width='70'
                                        height='50'
                                        rx='4'
                                        fill='#1a1915'
                                        stroke='#25d366'
                                        strokeWidth='1.5'
                                    />
                                    <text
                                        x='45'
                                        y='140'
                                        textAnchor='middle'
                                        fill='#25d366'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        USER A
                                    </text>
                                    <text
                                        x='45'
                                        y='153'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        Online
                                    </text>
                                    <text
                                        x='45'
                                        y='163'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='7'>
                                        WebSocket
                                    </text>
                                    {/* WS arrow */}
                                    <path
                                        d='M 80 145 L 120 145'
                                        stroke='#25d366'
                                        strokeWidth='2'
                                        markerEnd='url(#arrWG)'
                                    />
                                    <text
                                        x='100'
                                        y='140'
                                        textAnchor='middle'
                                        fill='#25d366'
                                        fontFamily='monospace'
                                        fontSize='7'>
                                        WS
                                    </text>
                                    {/* Chat Server 1 */}
                                    <rect
                                        x='120'
                                        y='100'
                                        width='100'
                                        height='90'
                                        rx='4'
                                        fill='#1a1915'
                                        stroke='#25d366'
                                        strokeWidth='1.5'
                                    />
                                    <text
                                        x='170'
                                        y='125'
                                        textAnchor='middle'
                                        fill='#25d366'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        CHAT
                                    </text>
                                    <text
                                        x='170'
                                        y='138'
                                        textAnchor='middle'
                                        fill='#25d366'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        SERVER 1
                                    </text>
                                    <text
                                        x='170'
                                        y='155'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        Holds User A&apos;s
                                    </text>
                                    <text
                                        x='170'
                                        y='166'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        WS connection
                                    </text>
                                    <text
                                        x='170'
                                        y='180'
                                        textAnchor='middle'
                                        fill='#475569'
                                        fontFamily='monospace'
                                        fontSize='7'>
                                        Erlang/Go
                                    </text>
                                    {/* Arrow CS1 to MQ */}
                                    <path
                                        d='M 220 145 L 260 145'
                                        stroke='#64748b'
                                        strokeWidth='1.2'
                                        markerEnd='url(#arrW)'
                                    />
                                    {/* Message Queue */}
                                    <rect
                                        x='260'
                                        y='115'
                                        width='100'
                                        height='60'
                                        rx='4'
                                        fill='#1a1915'
                                        stroke='#eab308'
                                        strokeWidth='1.5'
                                    />
                                    <text
                                        x='310'
                                        y='138'
                                        textAnchor='middle'
                                        fill='#eab308'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        MESSAGE
                                    </text>
                                    <text
                                        x='310'
                                        y='151'
                                        textAnchor='middle'
                                        fill='#eab308'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        QUEUE
                                    </text>
                                    <text
                                        x='310'
                                        y='167'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        Kafka / RabbitMQ
                                    </text>
                                    {/* Arrow MQ to CS2 */}
                                    <path
                                        d='M 360 145 L 400 145'
                                        stroke='#64748b'
                                        strokeWidth='1.2'
                                        markerEnd='url(#arrW)'
                                    />
                                    {/* Chat Server 2 */}
                                    <rect
                                        x='400'
                                        y='100'
                                        width='100'
                                        height='90'
                                        rx='4'
                                        fill='#1a1915'
                                        stroke='#cc6b45'
                                        strokeWidth='1.5'
                                    />
                                    <text
                                        x='450'
                                        y='125'
                                        textAnchor='middle'
                                        fill='#cc6b45'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        CHAT
                                    </text>
                                    <text
                                        x='450'
                                        y='138'
                                        textAnchor='middle'
                                        fill='#cc6b45'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        SERVER 2
                                    </text>
                                    <text
                                        x='450'
                                        y='155'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        Holds User B&apos;s
                                    </text>
                                    <text
                                        x='450'
                                        y='166'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        WS connection
                                    </text>
                                    <text
                                        x='450'
                                        y='180'
                                        textAnchor='middle'
                                        fill='#475569'
                                        fontFamily='monospace'
                                        fontSize='7'>
                                        Erlang/Go
                                    </text>
                                    {/* Arrow CS2 to User B */}
                                    <path
                                        d='M 500 145 L 540 145'
                                        stroke='#cc6b45'
                                        strokeWidth='2'
                                        markerEnd='url(#arrWB)'
                                    />
                                    <text
                                        x='520'
                                        y='140'
                                        textAnchor='middle'
                                        fill='#cc6b45'
                                        fontFamily='monospace'
                                        fontSize='7'>
                                        WS
                                    </text>
                                    {/* User B (online) */}
                                    <rect
                                        x='540'
                                        y='120'
                                        width='70'
                                        height='50'
                                        rx='4'
                                        fill='#1a1915'
                                        stroke='#cc6b45'
                                        strokeWidth='1.5'
                                    />
                                    <text
                                        x='575'
                                        y='140'
                                        textAnchor='middle'
                                        fill='#cc6b45'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        USER B
                                    </text>
                                    <text
                                        x='575'
                                        y='153'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        Online
                                    </text>
                                    <text
                                        x='575'
                                        y='163'
                                        textAnchor='middle'
                                        fill='#25d366'
                                        fontFamily='monospace'
                                        fontSize='7'>
                                        Gets msg!
                                    </text>
                                    {/* User C (offline) */}
                                    <rect
                                        x='540'
                                        y='220'
                                        width='70'
                                        height='50'
                                        rx='4'
                                        fill='#1a1915'
                                        stroke='#64748b'
                                        strokeWidth='1.5'
                                    />
                                    <text
                                        x='575'
                                        y='240'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        USER C
                                    </text>
                                    <text
                                        x='575'
                                        y='253'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        Offline
                                    </text>
                                    {/* Message DB */}
                                    <rect
                                        x='260'
                                        y='230'
                                        width='100'
                                        height='50'
                                        rx='4'
                                        fill='#1a1915'
                                        stroke='#cc6b45'
                                        strokeWidth='1.5'
                                    />
                                    <text
                                        x='310'
                                        y='252'
                                        textAnchor='middle'
                                        fill='#cc6b45'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        MSG DB
                                    </text>
                                    <text
                                        x='310'
                                        y='268'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        Cassandra
                                    </text>
                                    {/* Arrow MQ to DB */}
                                    <path
                                        d='M 310 175 L 310 230'
                                        stroke='#64748b'
                                        strokeWidth='1.2'
                                        markerEnd='url(#arrW)'
                                    />
                                    <text
                                        x='325'
                                        y='205'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        persist
                                    </text>
                                    {/* Presence Service */}
                                    <rect
                                        x='120'
                                        y='240'
                                        width='100'
                                        height='40'
                                        rx='4'
                                        fill='#1a1915'
                                        stroke='#8b5cf6'
                                        strokeWidth='1.2'
                                    />
                                    <text
                                        x='170'
                                        y='258'
                                        textAnchor='middle'
                                        fill='#8b5cf6'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        PRESENCE
                                    </text>
                                    <text
                                        x='170'
                                        y='271'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        Online status (Redis)
                                    </text>
                                    {/* Connection Service */}
                                    <rect
                                        x='10'
                                        y='240'
                                        width='100'
                                        height='40'
                                        rx='4'
                                        fill='#1a1915'
                                        stroke='#f97316'
                                        strokeWidth='1.2'
                                    />
                                    <text
                                        x='60'
                                        y='258'
                                        textAnchor='middle'
                                        fill='#f97316'
                                        fontFamily='monospace'
                                        fontSize='9'>
                                        CONNECTION
                                    </text>
                                    <text
                                        x='60'
                                        y='271'
                                        textAnchor='middle'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        Zookeeper/Redis
                                    </text>
                                    <text
                                        x='10'
                                        y='310'
                                        fill='#64748b'
                                        fontFamily='monospace'
                                        fontSize='8'>
                                        User C offline → msg DB stored → online
                                        হলে fetch
                                    </text>
                                </svg>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 Core Challenge',
                    content: (
                        <p>
                            <strong>Push vs Pull:</strong> Traditional HTTP
                            request-response কাজ করে না real-time messaging-এ।
                            Receiver সব সময় &quot;নতুন message আছে?&quot;
                            জিজ্ঞেস করতে পারে না। Server-ই push করতে হবে। এই
                            জন্য{' '}
                            <strong>WebSocket</strong> দরকার।
                        </p>
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
                            <div className='border border-border rounded-lg bg-card/50 p-5'>
                                <p className='font-mono text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-4 font-bold'>
                                    Functional Requirements
                                </p>
                                <ul className='space-y-2'>
                                    {[
                                        '1-to-1 messaging',
                                        'Group messaging (max 1000 members)',
                                        'Online/offline status',
                                        'Message delivery status (✓ ✓✓ 🔵)',
                                        'Media sharing (image, video, file)',
                                        'End-to-end encryption',
                                        'Last seen timestamp',
                                        'Message history',
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className='flex items-start gap-2 text-sm text-muted-foreground border-b border-border pb-2 last:border-0 last:pb-0'>
                                            <span className='text-muted-foreground mt-0.5 shrink-0'>
                                                →
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className='border border-border rounded-lg bg-card/50 p-5'>
                                <p className='font-mono text-xs uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-4 font-bold'>
                                    Non-Functional Requirements
                                </p>
                                <ul className='space-y-2'>
                                    {[
                                        '2 billion+ users',
                                        'Message delivery < 500ms',
                                        'No message loss ever',
                                        'Offline message delivery (when comes online)',
                                        'High availability 99.99%',
                                        'End-to-end encrypted',
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className='flex items-start gap-2 text-sm text-muted-foreground border-b border-border pb-2 last:border-0 last:pb-0'>
                                            <span className='text-muted-foreground mt-0.5 shrink-0'>
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
        {
            id: 'estimation',
            subHeader: { index: '003', title: 'Back-of-Envelope Estimation' },
            title: (
                <SectionTitle>WhatsApp Scale</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                            {[
                                { num: '2B', label: 'Total Users' },
                                { num: '100B', label: 'Messages/Day' },
                                { num: '1.15M', label: 'Messages/sec' },
                                { num: '500M', label: 'Daily Active Users' },
                                { num: '~100M', label: 'WebSocket Connections' },
                                { num: '~1KB', label: 'Avg Message Size' },
                            ].map((card, i) => (
                                <div
                                    key={i}
                                    className='border border-border rounded-lg bg-card/50 p-4 text-center'>
                                    <span className='font-mono text-2xl font-bold text-primary block mb-1'>
                                        {card.num}
                                    </span>
                                    <span className='font-mono text-[10px] text-muted-foreground uppercase tracking-widest'>
                                        {card.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='mt-4 space-y-3'>
                            <h3 className='text-base font-bold text-foreground'>
                                Storage Estimation
                            </h3>
                            <div className='border border-border rounded-lg bg-card/50 p-4 font-mono text-sm space-y-2'>
                                <p className='text-muted-foreground'>
                                    <span className='text-primary'>
                                        Daily storage:
                                    </span>{' '}
                                    100B messages × 1KB = 100TB/day
                                </p>
                                <p className='text-muted-foreground'>
                                    <span className='text-primary'>
                                        5-year storage:
                                    </span>{' '}
                                    100TB × 365 × 5 = ~182 PB
                                </p>
                                <p className='text-muted-foreground'>
                                    <span className='text-primary'>
                                        Write throughput:
                                    </span>{' '}
                                    1.15M msg/sec × 1KB = 1.15 GB/sec
                                </p>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '🔢 Interesting Fact',
                    content: (
                        <p>
                            WhatsApp মাত্র{' '}
                            <strong>50 engineers</strong> দিয়ে{' '}
                            <strong>450M users</strong> serve করত (2014 সালে)।{' '}
                            <strong>Erlang</strong> language use করত —
                            concurrent connections-এর জন্য world-class। এরপর
                            Facebook{' '}
                            <strong>$19 billion</strong>-এ কিনে নেয়।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'architecture',
            subHeader: { index: '004', title: 'High Level Architecture' },
            title: (
                <SectionTitle>Chat System Architecture</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <p className='text-muted-foreground leading-relaxed'>
                                WhatsApp-এর architecture-এর core হলো{' '}
                                <strong className='text-foreground'>
                                    Chat Servers
                                </strong>{' '}
                                যেগুলো user-দের WebSocket connections maintain
                                করে। Users different servers-এ connected থাকে,
                                তাই cross-server routing-এর জন্য Kafka use
                                করা হয়।
                            </p>
                            {/* Detailed Architecture Diagram */}
                            <div className='border border-border rounded-lg bg-card/50 p-6 overflow-x-auto'>
                                <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 text-center'>
                                    WHATSAPP — Full System Architecture
                                </p>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                    {/* Client Layer */}
                                    <div className='border border-emerald-500/30 rounded-lg bg-emerald-500/5 p-4'>
                                        <p className='font-mono text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-3 font-bold'>
                                            Client Layer
                                        </p>
                                        <div className='space-y-2'>
                                            {[
                                                'Mobile App (iOS/Android)',
                                                'Desktop App',
                                                'Web Client',
                                            ].map((c, i) => (
                                                <div
                                                    key={i}
                                                    className='px-3 py-2 border border-emerald-500/30 rounded text-xs font-mono text-emerald-700 dark:text-emerald-300 bg-card/50'>
                                                    {c}
                                                </div>
                                            ))}
                                            <p className='text-[10px] text-muted-foreground mt-2'>
                                                WebSocket persistent connection
                                            </p>
                                        </div>
                                    </div>
                                    {/* Server Layer */}
                                    <div className='border border-yellow-500/30 rounded-lg bg-yellow-500/5 p-4'>
                                        <p className='font-mono text-xs text-yellow-700 dark:text-yellow-400 uppercase tracking-widest mb-3 font-bold'>
                                            Server Layer
                                        </p>
                                        <div className='space-y-2'>
                                            {[
                                                'Load Balancer (HAProxy)',
                                                'Chat Servers (Erlang)',
                                                'API Gateway',
                                                'Kafka (Message Queue)',
                                                'Zookeeper (Service Discovery)',
                                            ].map((s, i) => (
                                                <div
                                                    key={i}
                                                    className='px-3 py-2 border border-yellow-500/30 rounded text-xs font-mono text-yellow-700 dark:text-yellow-300 bg-card/50'>
                                                    {s}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Storage Layer */}
                                    <div className='border border-blue-500/30 rounded-lg bg-blue-500/5 p-4'>
                                        <p className='font-mono text-xs text-blue-700 dark:text-blue-400 uppercase tracking-widest mb-3 font-bold'>
                                            Storage Layer
                                        </p>
                                        <div className='space-y-2'>
                                            {[
                                                'Cassandra (Messages)',
                                                'MySQL (User Profiles)',
                                                'Redis (Presence + Routing)',
                                                'S3 + CDN (Media)',
                                                'Elasticsearch (Search)',
                                            ].map((s, i) => (
                                                <div
                                                    key={i}
                                                    className='px-3 py-2 border border-blue-500/30 rounded text-xs font-mono text-blue-700 dark:text-blue-300 bg-card/50'>
                                                    {s}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    steps: [
                        {
                            title: (
                                <span className='font-mono text-emerald-700 dark:text-emerald-400'>
                                    Step 1 — User A connects via WebSocket
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    App open করলেন Chat Server-এ persistent
                                    WebSocket connection establish হয়। Redis-এ
                                    user_id → server_id mapping save হয়।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-emerald-700 dark:text-emerald-400'>
                                    Step 2 — Message Send করা হয়
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    User A message পাঠায়। Chat Server 1 message
                                    receive করে, Cassandra-তে persist করে (durability
                                    ensure করতে)।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-yellow-700 dark:text-yellow-400'>
                                    Step 3 — Cross-server routing (যদি দরকার হয়)
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Redis check করে User B কোন server-এ। Same
                                    server হলে direct push। Different server হলে
                                    Kafka-তে route করুন।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-blue-700 dark:text-blue-400'>
                                    Step 4 — User B-তে Deliver
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Chat Server 2 Kafka থেকে message consume
                                    করে User B-এর WebSocket-এ push করে। Double
                                    tick (✓✓) send হয়।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-purple-700 dark:text-purple-400'>
                                    Step 5 — Offline handling
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    User C offline থাকলে message Cassandra-তে
                                    stored থাকে। Online হলে pending messages
                                    fetch করে push করা হয়।
                                </span>
                            ),
                        },
                    ],
                },
            ],
        },
        {
            id: 'websocket-management',
            subHeader: { index: '005', title: 'Deep Dive' },
            title: (
                <SectionTitle>
                    WebSocket Connection Management
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            HTTP request-response model real-time chat-এর জন্য
                            suitable না। WebSocket একটা{' '}
                            <strong className='text-foreground'>
                                persistent bidirectional connection
                            </strong>{' '}
                            রাখে — server যেকোনো সময় client-কে push করতে
                            পারে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Protocol',
                        'Connection',
                        'Direction',
                        'Latency',
                        'Chat Use?',
                    ],
                    rows: [
                        [
                            <span className='font-mono'>HTTP Polling</span>,
                            'New each time',
                            'Client → Server only',
                            <span className='text-red-700 dark:text-red-400 font-bold'>
                                High (500ms+)
                            </span>,
                            <span className='text-red-700 dark:text-red-400'>Terrible</span>,
                        ],
                        [
                            <span className='font-mono'>Long Polling</span>,
                            'Held open',
                            'Server can respond',
                            <span className='text-yellow-700 dark:text-yellow-400'>Medium</span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>Okay</span>,
                        ],
                        [
                            <span className='font-mono'>
                                Server-Sent Events
                            </span>,
                            'Persistent',
                            'Server → Client only',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Low
                            </span>,
                            <span className='text-red-700 dark:text-red-400'>One-way only</span>,
                        ],
                        [
                            <span className='font-mono font-bold text-primary'>
                                WebSocket
                            </span>,
                            'Persistent',
                            'Both directions',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Very Low (&lt; 50ms)
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                ✓ Perfect
                            </span>,
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'chat_server.py',
                    code: `import asyncio
import websockets
import json

# Active connections: user_id → websocket
connections = {}

async def handle_connection(websocket, path):
    user_id = await authenticate(websocket)

    # Connection register করুন
    connections[user_id] = websocket
    await redis.set(f"user:{user_id}:server", SERVER_ID)
    await redis.set(f"user:{user_id}:online", "true")

    try:
        async for raw_msg in websocket:
            msg = json.loads(raw_msg)
            await send_message(
                sender_id=user_id,
                receiver_id=msg['to'],
                content=msg['content']
            )
    finally:
        # Disconnect হলে cleanup
        del connections[user_id]
        await redis.set(f"user:{user_id}:online", "false")
        await redis.set(f"user:{user_id}:last_seen", now())

async def send_message(sender_id, receiver_id, content):
    msg_id = generate_unique_id()

    # 1. DB-তে persist করুন আগে
    await db.save_message(msg_id, sender_id, receiver_id, content)

    # 2. Receiver কোন server-এ? Redis check করুন
    receiver_server = await redis.get(f"user:{receiver_id}:server")

    if receiver_server == SERVER_ID:
        # Same server-এ আছে → direct push
        ws = connections.get(receiver_id)
        if ws:
            await ws.send(json.dumps({"msg_id": msg_id, "content": content}))
    else:
        # Different server → Kafka-তে route করুন
        await kafka.publish(f"chat:{receiver_server}", {
            "receiver_id": receiver_id, "msg_id": msg_id
        })`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Heartbeat Mechanism',
                    content: (
                        <p>
                            WebSocket connection alive রাখতে{' '}
                            <strong>ping/pong heartbeat</strong> দরকার।
                            Client প্রতি 30 sec ping পাঠায়, server pong দেয়।
                            Redis-এ user online key refresh হয়। 60 sec কোনো
                            response না পেলে connection dead — user
                            &quot;offline&quot; mark করুন।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'message-storage-delivery',
            subHeader: { index: '006', title: 'Message Storage & Delivery' },
            title: (
                <SectionTitle>
                    Message Storage এবং Delivery Receipts
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-4'>
                            <h3 className='text-lg font-bold text-foreground'>
                                Message Delivery Status — ✓ ✓✓ 🔵
                            </h3>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Status', 'Meaning', 'When?'],
                    rows: [
                        [
                            <span className='font-mono text-muted-foreground'>
                                ✓ (single tick)
                            </span>,
                            'Server received',
                            'Message DB-তে save হলে',
                        ],
                        [
                            <span className='font-mono text-muted-foreground'>
                                ✓✓ (double tick)
                            </span>,
                            'Delivered to device',
                            "Receiver-এর phone-এ পৌঁছালে",
                        ],
                        [
                            <span className='font-mono text-blue-700 dark:text-blue-400'>
                                🔵 (blue tick)
                            </span>,
                            'Read',
                            'Receiver message open করলেন',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-4 mt-4'>
                            <h3 className='text-lg font-bold text-foreground'>
                                Cassandra Message Schema
                            </h3>
                            <p className='text-muted-foreground leading-relaxed'>
                                Messages time-series data। Cassandra-তে{' '}
                                <strong className='text-foreground'>
                                    partition key = chat_id
                                </strong>
                                , clustering key ={' '}
                                <strong className='text-foreground'>
                                    message_id DESC
                                </strong>
                                — latest messages সামনে আসে, pagination সহজ।
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'sql',
                    filename: 'cassandra_schema.cql',
                    code: `-- 1-to-1 Messages Table
CREATE TABLE messages (
    chat_id      UUID,
    message_id   TIMEUUID,     -- Time-ordered UUID
    sender_id    UUID,
    receiver_id  UUID,
    content      TEXT,
    msg_type     TEXT,         -- 'text', 'image', 'video'
    status       TEXT,         -- 'sent', 'delivered', 'read'
    created_at   TIMESTAMP,
    PRIMARY KEY (chat_id, message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);
-- Partition by chat_id = same conversation একই partition-এ
-- Latest messages DESC = pagination efficient

-- Group Messages (1 copy per message, not per user)
CREATE TABLE group_messages (
    group_id     UUID,
    message_id   TIMEUUID,
    sender_id    UUID,
    content      TEXT,
    sent_at      TIMESTAMP,
    PRIMARY KEY (group_id, message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);

-- Per-user delivery tracking (NOT message copy)
CREATE TABLE message_receipts (
    message_id   UUID,
    user_id      UUID,
    delivered_at TIMESTAMP,
    read_at      TIMESTAMP,
    PRIMARY KEY (message_id, user_id)
);
-- 1000 member group = 1 msg + 999 receipt rows (not 1000 msg copies)`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '💡 Message Schema in Cassandra',
                    content: (
                        <p>
                            Partition key ={' '}
                            <strong>(chat_id)</strong>, Clustering key ={' '}
                            <strong>(message_id DESC)</strong>। এতে latest
                            messages সামনে আসে। Pagination করা সহজ।
                            Time-ordered messages efficiently store হয়।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'group-chat-pubsub',
            subHeader: { index: '007', title: 'Group Chat & Pub/Sub' },
            title: (
                <SectionTitle>
                    Group Chat Architecture এবং Pub/Sub
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: '⚠️ Group Chat Fanout Problem',
                    content: (
                        <p>
                            1000 member group-এ 1 message →{' '}
                            <strong>999 users-এ deliver</strong> করতে হবে।
                            Fan-out problem! Solution: Message DB-তে{' '}
                            <strong>1 copy</strong> রাখুন, per-user read status
                            track করুন। Message copy করুন না — pointer রাখুন।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'sql',
                    filename: 'schema.sql — Group Chat',
                    code: `-- Group messages: 1 row per message (not per user)
CREATE TABLE group_messages (
    msg_id       UUID PRIMARY KEY,
    group_id     UUID,
    sender_id    UUID,
    content      TEXT,
    sent_at      TIMESTAMP
);

-- Per-user delivery tracking (not message copy)
CREATE TABLE message_receipts (
    msg_id       UUID,
    user_id      UUID,
    delivered_at TIMESTAMP,
    read_at      TIMESTAMP,
    PRIMARY KEY (msg_id, user_id)
);
-- 1000 member group = 1 msg + 999 receipt rows (not 1000 msg copies)`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-4'>
                            <h3 className='text-lg font-bold text-foreground mt-2'>
                                Kafka Pub/Sub — Cross-server Message Routing
                            </h3>
                            <p className='text-muted-foreground leading-relaxed'>
                                প্রতিটা Chat Server-এর জন্য একটা Kafka topic
                                থাকে। User A (Server 1) → User B (Server 5)
                                পাঠাতে হলে, Server 1 Kafka topic
                                &quot;server-5&quot;-এ publish করে। Server 5
                                সেই topic consume করে User B-কে push করে।
                            </p>
                            <div className='border border-border rounded-lg bg-card/50 p-5 overflow-x-auto'>
                                <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 text-center'>
                                    KAFKA — Cross-Server Routing Flow
                                </p>
                                <div className='flex flex-wrap items-center gap-3 justify-center'>
                                    <div className='px-4 py-3 border border-emerald-500/50 rounded bg-emerald-500/10 text-xs font-mono text-emerald-700 dark:text-emerald-300 text-center'>
                                        <p className='font-bold mb-1'>
                                            Chat Server 1
                                        </p>
                                        <p className='text-[10px] text-muted-foreground'>
                                            User A connected
                                        </p>
                                    </div>
                                    <span className='text-muted-foreground font-mono text-lg'>
                                        →
                                    </span>
                                    <div className='px-4 py-3 border border-yellow-500/50 rounded bg-yellow-500/10 text-xs font-mono text-yellow-700 dark:text-yellow-300 text-center'>
                                        <p className='font-bold mb-1'>
                                            Kafka Topic
                                        </p>
                                        <p className='text-[10px] text-muted-foreground'>
                                            &quot;chat:server-5&quot;
                                        </p>
                                    </div>
                                    <span className='text-muted-foreground font-mono text-lg'>
                                        →
                                    </span>
                                    <div className='px-4 py-3 border border-blue-500/50 rounded bg-blue-500/10 text-xs font-mono text-blue-700 dark:text-blue-300 text-center'>
                                        <p className='font-bold mb-1'>
                                            Chat Server 5
                                        </p>
                                        <p className='text-[10px] text-muted-foreground'>
                                            User B connected
                                        </p>
                                    </div>
                                    <span className='text-muted-foreground font-mono text-lg'>
                                        →
                                    </span>
                                    <div className='px-4 py-3 border border-purple-500/50 rounded bg-purple-500/10 text-xs font-mono text-purple-700 dark:text-purple-300 text-center'>
                                        <p className='font-bold mb-1'>
                                            User B
                                        </p>
                                        <p className='text-[10px] text-emerald-700 dark:text-emerald-400'>
                                            Gets message!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'advanced-features',
            subHeader: { index: '008', title: 'Advanced Features' },
            title: (
                <SectionTitle>
                    Push Notifications, Presence, Encryption এবং Interview Tips
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <h3 className='text-base font-bold text-foreground'>
                                Push Notifications — Offline Users-এর জন্য
                            </h3>
                            <p className='text-muted-foreground leading-relaxed'>
                                User offline থাকলে WebSocket নেই। Message DB-তে
                                store হওয়ার পর{' '}
                                <strong className='text-foreground'>
                                    FCM (Firebase Cloud Messaging) / APNs
                                    (Apple Push Notification Service)
                                </strong>{' '}
                                দিয়ে device-এ push notification পাঠানো হয়।
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {/* Online Presence */}
                            <div className='border border-border rounded-lg bg-card/50 p-4'>
                                <p className='font-mono text-xs text-purple-700 dark:text-purple-400 uppercase tracking-widest mb-3 font-bold'>
                                    Online Presence System
                                </p>
                                <ul className='space-y-2 text-sm text-muted-foreground'>
                                    <li className='flex gap-2'>
                                        <span className='text-primary shrink-0'>
                                            →
                                        </span>
                                        User online হলে Redis-এ{' '}
                                        <code className='font-mono text-xs bg-muted/30 px-1 rounded'>
                                            user:ID:online = true
                                        </code>
                                    </li>
                                    <li className='flex gap-2'>
                                        <span className='text-primary shrink-0'>
                                            →
                                        </span>
                                        TTL: 60 seconds — heartbeat দিয়ে
                                        refresh
                                    </li>
                                    <li className='flex gap-2'>
                                        <span className='text-primary shrink-0'>
                                            →
                                        </span>
                                        Disconnect হলে TTL expire →
                                        automatically &quot;offline&quot;
                                    </li>
                                    <li className='flex gap-2'>
                                        <span className='text-primary shrink-0'>
                                            →
                                        </span>
                                        Last seen timestamp Redis-এ store
                                    </li>
                                </ul>
                            </div>
                            {/* E2E Encryption */}
                            <div className='border border-border rounded-lg bg-card/50 p-4'>
                                <p className='font-mono text-xs text-orange-700 dark:text-orange-400 uppercase tracking-widest mb-3 font-bold'>
                                    End-to-End Encryption
                                </p>
                                <ul className='space-y-2 text-sm text-muted-foreground'>
                                    <li className='flex gap-2'>
                                        <span className='text-primary shrink-0'>
                                            →
                                        </span>
                                        Signal Protocol use করে WhatsApp
                                    </li>
                                    <li className='flex gap-2'>
                                        <span className='text-primary shrink-0'>
                                            →
                                        </span>
                                        Server শুধু ciphertext দেখে
                                    </li>
                                    <li className='flex gap-2'>
                                        <span className='text-primary shrink-0'>
                                            →
                                        </span>
                                        শুধু sender ও receiver decrypt করতে
                                        পারে
                                    </li>
                                    <li className='flex gap-2'>
                                        <span className='text-primary shrink-0'>
                                            →
                                        </span>
                                        Trade-off: spam detection impossible
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-4 mt-2'>
                            <h3 className='text-base font-bold text-foreground'>
                                Scaling Strategies
                            </h3>
                            <div className='space-y-3'>
                                {[
                                    {
                                        type: 'pro',
                                        color: 'emerald',
                                        label: 'Strategy',
                                        text: (
                                            <>
                                                <strong className='text-foreground'>
                                                    Horizontal Chat Servers:
                                                </strong>{' '}
                                                লক্ষ লক্ষ WebSocket connections
                                                ধরে রাখতে অনেক Chat servers।
                                                Load balancer user-কে consistent
                                                server-এ route করে (sticky
                                                sessions)।
                                            </>
                                        ),
                                    },
                                    {
                                        type: 'pro',
                                        color: 'emerald',
                                        label: 'Strategy',
                                        text: (
                                            <>
                                                <strong className='text-foreground'>
                                                    Service Discovery via
                                                    Zookeeper:
                                                </strong>{' '}
                                                প্রতিটা Chat server register হয়
                                                Zookeeper-এ। User কোন server-এ
                                                connected তা Redis-এ cache
                                                থাকে।
                                            </>
                                        ),
                                    },
                                    {
                                        type: 'pro',
                                        color: 'emerald',
                                        label: 'Strategy',
                                        text: (
                                            <>
                                                <strong className='text-foreground'>
                                                    Kafka for Cross-server
                                                    Routing:
                                                </strong>{' '}
                                                User A (Server 1) → User B
                                                (Server 5)। Kafka topic per
                                                server। Server 5-এর Kafka
                                                topic-এ message publish → Server
                                                5 consume করে User B-কে push।
                                            </>
                                        ),
                                    },
                                    {
                                        type: 'con',
                                        color: 'red',
                                        label: 'Trade-off',
                                        text: (
                                            <>
                                                <strong className='text-foreground'>
                                                    End-to-End Encryption:
                                                </strong>{' '}
                                                E2E encryption মানে server
                                                message decrypt করতে পারে না।
                                                Spam detection, moderation
                                                কঠিন হয়। Privacy vs Safety
                                                trade-off।
                                            </>
                                        ),
                                    },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className='flex gap-3 items-start'>
                                        <span
                                            className={`font-mono text-xs px-2 py-1 rounded shrink-0 border ${
                                                item.type === 'pro'
                                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                                                    : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30'
                                            }`}>
                                            {item.label}
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
                        <div className='space-y-4 mt-4'>
                            <h3 className='text-base font-bold text-foreground'>
                                Full Tech Stack
                            </h3>
                            <div className='space-y-4'>
                                <div>
                                    <p className='text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2'>
                                        Backend
                                    </p>
                                    <div className='flex flex-wrap gap-2'>
                                        {[
                                            {
                                                label: 'Erlang (Chat Servers)',
                                                color: 'emerald',
                                            },
                                            {
                                                label: 'Go (API Services)',
                                                color: 'emerald',
                                            },
                                            {
                                                label: 'WebSocket (Real-time)',
                                                color: 'purple',
                                            },
                                            {
                                                label: 'Nginx + HAProxy',
                                                color: 'purple',
                                            },
                                        ].map((t, i) => (
                                            <span
                                                key={i}
                                                className={`font-mono text-xs px-3 py-1.5 rounded border ${
                                                    t.color === 'emerald'
                                                        ? 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10'
                                                        : 'border-purple-500/30 text-purple-700 dark:text-purple-400 bg-purple-500/10'
                                                }`}>
                                                {t.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className='text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2'>
                                        Data
                                    </p>
                                    <div className='flex flex-wrap gap-2'>
                                        {[
                                            {
                                                label: 'Cassandra (Messages)',
                                                color: 'blue',
                                            },
                                            {
                                                label: 'MySQL (Users)',
                                                color: 'blue',
                                            },
                                            {
                                                label: 'Redis (Presence + Routing)',
                                                color: 'yellow',
                                            },
                                            {
                                                label: 'S3 (Media)',
                                                color: 'blue',
                                            },
                                        ].map((t, i) => (
                                            <span
                                                key={i}
                                                className={`font-mono text-xs px-3 py-1.5 rounded border ${
                                                    t.color === 'blue'
                                                        ? 'border-blue-500/30 text-blue-700 dark:text-blue-400 bg-blue-500/10'
                                                        : 'border-yellow-500/30 text-yellow-700 dark:text-yellow-400 bg-yellow-500/10'
                                                }`}>
                                                {t.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className='text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2'>
                                        Infrastructure
                                    </p>
                                    <div className='flex flex-wrap gap-2'>
                                        {[
                                            {
                                                label: 'Apache Kafka',
                                                color: 'orange',
                                            },
                                            {
                                                label: 'Zookeeper (Service Discovery)',
                                                color: 'purple',
                                            },
                                            {
                                                label: 'Signal Protocol (E2E Encryption)',
                                                color: 'purple',
                                            },
                                            {
                                                label: 'Kubernetes',
                                                color: 'purple',
                                            },
                                        ].map((t, i) => (
                                            <span
                                                key={i}
                                                className={`font-mono text-xs px-3 py-1.5 rounded border ${
                                                    t.color === 'orange'
                                                        ? 'border-orange-500/30 text-orange-700 dark:text-orange-400 bg-orange-500/10'
                                                        : 'border-purple-500/30 text-purple-700 dark:text-purple-400 bg-purple-500/10'
                                                }`}>
                                                {t.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-4 mt-4'>
                            <h3 className='text-base font-bold text-foreground'>
                                Database Choice — কোন Database কিসের জন্য?
                            </h3>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Data', 'Database', 'Why?'],
                    rows: [
                        [
                            'Messages',
                            <span className='font-mono text-primary'>
                                Cassandra (HBase/Scylla)
                            </span>,
                            'Append-only, time-series, massive scale',
                        ],
                        [
                            'User profiles',
                            <span className='font-mono text-primary'>
                                MySQL
                            </span>,
                            'Structured, ACID',
                        ],
                        [
                            'Online status',
                            <span className='font-mono text-yellow-700 dark:text-yellow-400'>
                                Redis (TTL)
                            </span>,
                            'In-memory, fast, TTL for "last seen"',
                        ],
                        [
                            'User-server mapping',
                            <span className='font-mono text-yellow-700 dark:text-yellow-400'>
                                Redis
                            </span>,
                            "Which server holds user's connection",
                        ],
                        [
                            'Media files',
                            <span className='font-mono text-primary'>
                                S3 + CDN
                            </span>,
                            'Object storage',
                        ],
                        [
                            'Message search',
                            <span className='font-mono text-orange-700 dark:text-orange-400'>
                                Elasticsearch
                            </span>,
                            'Full-text search in chat history',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '🎯 Interview Tips — WhatsApp Design',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>1)</strong> সবার আগে বলুন:{' '}
                                <strong>
                                    &quot;WebSocket দরকার real-time-এর জন্য,
                                    HTTP polling কাজ করবেন না।&quot;
                                </strong>
                            </p>
                            <p>
                                <strong>2)</strong> Cross-server routing explain
                                করুন: Redis (user → server mapping) + Kafka
                                (message routing)।
                            </p>
                            <p>
                                <strong>3)</strong> Group chat fanout problem
                                mention করুন: 1 message copy + receipts table।
                            </p>
                            <p>
                                <strong>4)</strong> Offline delivery: Cassandra
                                persist + online হলে push।
                            </p>
                            <p>
                                <strong>5)</strong> Erlang mention করলেন bonus
                                points — massive concurrent connections।
                            </p>
                        </div>
                    ),
                },
            ],
        },
    ],
    summary: {
        headers: ['Challenge', 'Solution', 'Technology'],
        rows: [
            [
                <span className='font-bold text-primary'>
                    Real-time delivery
                </span>,
                'Persistent WebSocket',
                <span className='font-mono text-muted-foreground'>
                    Erlang/Go
                </span>,
            ],
            [
                <span className='font-bold text-primary'>
                    Cross-server routing
                </span>,
                'Pub/sub messaging',
                <span className='font-mono text-muted-foreground'>Kafka</span>,
            ],
            [
                <span className='font-bold text-primary'>
                    Offline delivery
                </span>,
                'Persist + deliver on reconnect',
                <span className='font-mono text-muted-foreground'>
                    Cassandra
                </span>,
            ],
            [
                <span className='font-bold text-primary'>Online presence</span>,
                'Redis TTL + heartbeat',
                <span className='font-mono text-muted-foreground'>Redis</span>,
            ],
            [
                <span className='font-bold text-primary'>
                    Group chat storage
                </span>,
                '1 message + receipt table',
                <span className='font-mono text-muted-foreground'>
                    Cassandra
                </span>,
            ],
            [
                <span className='font-bold text-primary'>Privacy</span>,
                'End-to-end encryption',
                <span className='font-mono text-muted-foreground'>
                    Signal Protocol
                </span>,
            ],
            [
                <span className='font-bold text-primary'>
                    HTTP vs WebSocket
                </span>,
                'WebSocket = persistent, bidirectional',
                <span className='font-mono text-muted-foreground'>
                    &lt; 50ms latency
                </span>,
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'Real-time chat-এর জন্য HTTP polling কেন খারাপ?',
                options: [
                    {
                        key: 'a',
                        text: 'HTTP too slow',
                        isCorrect: false,
                        explanation: 'HTTP protocol speed সমস্যা নয়।',
                    },
                    {
                        key: 'b',
                        text: 'HTTP text support করে না',
                        isCorrect: false,
                        explanation: 'HTTP text support করে।',
                    },
                    {
                        key: 'c',
                        text: 'HTTP too expensive',
                        isCorrect: false,
                        explanation: 'Cost HTTP polling-এর মূল সমস্যা নয়।',
                    },
                    {
                        key: 'd',
                        text: 'প্রতিবার নতুন connection, high latency, server-side push নেই',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Polling-এ client বারবার "নতুন message আছে?" জিজ্ঞেস করে। প্রতিবার TCP connection = overhead। Message আসলেও পরের poll পর্যন্ত wait। WebSocket একটা persistent connection রাখে — message আসলেই server push করে।',
                    },
                ],
            },
            {
                id: 2,
                text: 'User A (Chat Server 1) → User B (Chat Server 5) message পাঠাবে কীভাবে?',
                options: [
                    {
                        key: 'a',
                        text: 'Direct HTTP call Server 1 → Server 5',
                        isCorrect: false,
                        explanation:
                            'Direct HTTP call tight coupling তৈরি করে।',
                    },
                    {
                        key: 'b',
                        text: 'Kafka/Message Queue দিয়ে route করুন',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Kafka topic per server। Server 1 → Kafka topic "server-5" → Server 5 consume করে → User B-কে push। এই pub/sub pattern দিয়ে cross-server messaging হয়।',
                    },
                    {
                        key: 'c',
                        text: 'Database write করুন, Server 5 poll করবেন',
                        isCorrect: false,
                        explanation: 'DB polling আবার latency সমস্যা তৈরি করে।',
                    },
                    {
                        key: 'd',
                        text: 'Impossible — একই server-এ থাকতে হবে',
                        isCorrect: false,
                        explanation:
                            'Cross-server routing সম্ভব — Kafka দিয়ে।',
                    },
                ],
            },
            {
                id: 3,
                text: "User-এর online/offline status কোথায় store করবেন?",
                options: [
                    {
                        key: 'a',
                        text: 'Redis (with TTL)',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Redis in-memory, millisecond read। TTL set করুন — user disconnect হলে TTL expire হলে automatically "offline"। Heartbeat: every 30 sec Redis key refresh করুন।',
                    },
                    {
                        key: 'b',
                        text: 'MySQL',
                        isCorrect: false,
                        explanation:
                            'MySQL-এ too many writes, too slow for presence.',
                    },
                    {
                        key: 'c',
                        text: 'Cassandra',
                        isCorrect: false,
                        explanation:
                            'Cassandra presence tracking-এর জন্য optimal নয়।',
                    },
                    {
                        key: 'd',
                        text: 'File system',
                        isCorrect: false,
                        explanation: 'File system distributed presence-এর জন্য unsuitable।',
                    },
                ],
            },
            {
                id: 4,
                text: 'User offline থাকলে তাকে message deliver করবেন কীভাবে?',
                options: [
                    {
                        key: 'a',
                        text: 'Message drop করে দিন',
                        isCorrect: false,
                        explanation: 'Message loss কখনো acceptable নয়।',
                    },
                    {
                        key: 'b',
                        text: 'Sender-কে error দিন',
                        isCorrect: false,
                        explanation:
                            'Error দেওয়া user experience নষ্ট করে।',
                    },
                    {
                        key: 'c',
                        text: 'Message DB-তে store, online হলে fetch করে push',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Persistent message store। User comes online → Chat server checks undelivered messages → pushes all pending। এটাই "offline message delivery"।',
                    },
                    {
                        key: 'd',
                        text: 'SMS পাঠাও',
                        isCorrect: false,
                        explanation: 'SMS fallback primary solution নয়।',
                    },
                ],
            },
            {
                id: 5,
                text: '1000 member group chat-এ message store কীভাবে করবেন?',
                options: [
                    {
                        key: 'a',
                        text: '1000 copies — প্রতি user-এর জন্য',
                        isCorrect: false,
                        explanation:
                            '1000 copies = massive storage waste।',
                    },
                    {
                        key: 'b',
                        text: 'শুধু sender-এর কাছে',
                        isCorrect: false,
                        explanation:
                            'শুধু sender-এর কাছে রাখলে others-এর delivery হবে না।',
                    },
                    {
                        key: 'c',
                        text: 'Broadcast করুন, store করুন না',
                        isCorrect: false,
                        explanation:
                            'Store না করলেন offline users message পাবেন না।',
                    },
                    {
                        key: 'd',
                        text: '1 copy + per-user delivery receipt table',
                        isCorrect: true,
                        explanation:
                            'সঠিক। 1 message copy in group_messages table। 999 receipt rows in message_receipts table। এতে storage 1000x less। WhatsApp এই approach use করে।',
                    },
                ],
            },
            {
                id: 6,
                text: 'WhatsApp Messages store করার জন্য কোন database best?',
                options: [
                    {
                        key: 'a',
                        text: 'MySQL',
                        isCorrect: false,
                        explanation:
                            'MySQL massive message scale-এ bottleneck হয়।',
                    },
                    {
                        key: 'b',
                        text: 'Cassandra',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Messages = append-only time-series data। Cassandra partition by chat_id, cluster by message_id desc। Massive write throughput। Facebook Messenger এবং WhatsApp দুটোই HBase/Cassandra use করে।',
                    },
                    {
                        key: 'c',
                        text: 'Redis',
                        isCorrect: false,
                        explanation:
                            'Redis in-memory — persistent message store-এর জন্য নয়।',
                    },
                    {
                        key: 'd',
                        text: 'MongoDB',
                        isCorrect: false,
                        explanation:
                            'MongoDB viable কিন্তু Cassandra time-series-এ better।',
                    },
                ],
            },
            {
                id: 7,
                text: 'WhatsApp কোন programming language-এ Chat Servers build করেছেনিল?',
                options: [
                    {
                        key: 'a',
                        text: 'Erlang',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Erlang massive concurrent connections-এর জন্য designed। Lightweight processes (actors), fault-tolerant। WhatsApp 50 engineers দিয়ে 450M users serve করত Erlang-এর কারণে।',
                    },
                    {
                        key: 'b',
                        text: 'Java',
                        isCorrect: false,
                        explanation: 'Java WhatsApp chat servers-এর জন্য use হয়নি।',
                    },
                    {
                        key: 'c',
                        text: 'C++',
                        isCorrect: false,
                        explanation: 'C++ WhatsApp-এর primary language ছিল না।',
                    },
                    {
                        key: 'd',
                        text: 'Python',
                        isCorrect: false,
                        explanation: 'Python WhatsApp chat servers-এর language নয়।',
                    },
                ],
            },
            {
                id: 8,
                text: "WhatsApp-এর End-to-End Encryption-এর trade-off কী?",
                options: [
                    {
                        key: 'a',
                        text: 'Messages slow হয়',
                        isCorrect: false,
                        explanation: 'E2E encryption latency negligible।',
                    },
                    {
                        key: 'b',
                        text: 'Messages deliver হয় না',
                        isCorrect: false,
                        explanation: 'E2E encryption delivery affect করে না।',
                    },
                    {
                        key: 'c',
                        text: 'Server message read করতে পারে না, spam detection কঠিন',
                        isCorrect: true,
                        explanation:
                            'সঠিক। E2E encryption মানে শুধু sender ও receiver decrypt করতে পারে। Server ciphertext দেখে। এতে user privacy বাড়ে কিন্তু spam, child abuse content detection impossible।',
                    },
                    {
                        key: 'd',
                        text: 'Battery বেশি খরচ হয়',
                        isCorrect: false,
                        explanation: 'Battery E2E encryption-এর primary trade-off নয়।',
                    },
                ],
            },
            {
                id: 9,
                text: 'Zookeeper Chat System-এ কী কাজে ব্যবহার হয়?',
                options: [
                    {
                        key: 'a',
                        text: 'Message storage',
                        isCorrect: false,
                        explanation: 'Zookeeper message storage করে না।',
                    },
                    {
                        key: 'b',
                        text: 'User authentication',
                        isCorrect: false,
                        explanation: 'Zookeeper authentication-এর জন্য নয়।',
                    },
                    {
                        key: 'c',
                        text: 'Video processing',
                        isCorrect: false,
                        explanation: 'Zookeeper video processing করে না।',
                    },
                    {
                        key: 'd',
                        text: 'Service discovery — কোন Chat server available তা track করা',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Zookeeper distributed coordination service। Chat servers register করে। Load balancer জানে কোন servers available। Server down হলে automatically deregister। Kafka-ও internally Zookeeper use করে।',
                    },
                ],
            },
            {
                id: 10,
                text: 'WebSocket connection কতক্ষণ open থাকে?',
                options: [
                    {
                        key: 'a',
                        text: 'শুধু message send/receive-এর সময়',
                        isCorrect: false,
                        explanation:
                            'WebSocket শুধু message-এর সময় নয়, সবসময় open থাকে।',
                    },
                    {
                        key: 'b',
                        text: 'App open থেকে close পর্যন্ত সবসময়',
                        isCorrect: true,
                        explanation:
                            'সঠিক। WhatsApp open থাকলে persistent WebSocket connection। Heartbeat ping/pong প্রতি 30 sec। এই connection দিয়েই messages, delivery receipts, online status update সব push হয়। App close → connection close → Redis "offline"।',
                    },
                    {
                        key: 'c',
                        text: 'প্রতি 1 minute',
                        isCorrect: false,
                        explanation:
                            'WebSocket per-minute reconnect করে না।',
                    },
                    {
                        key: 'd',
                        text: 'শুধু network available হলে',
                        isCorrect: false,
                        explanation:
                            'Network available থাকলে সবসময় open — specific condition নয়।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'Real-time Chat System ডিজাইন করুন',
        time: '৪-৫ ঘন্টা',
        difficulty: 'Intermediate',
        tasks: [
            <span>
                <strong>Architecture Diagram:</strong> WhatsApp-এর complete
                system diagram আঁকুন। User A → Chat Server 1 → Kafka → Chat
                Server 2 → User B (online path) AND User C (offline path: DB
                store → online হলে deliver)। WebSocket connections দেখাও।
            </span>,
            <span>
                <strong>Message Schema:</strong> Cassandra-তে 1-to-1 chat এবং
                group chat-এর জন্য message schema design করুন। Partition key ও
                clustering key specify করুন এবং কেন সেটা chose করলেন explain
                করুন।
            </span>,
            <span>
                <strong>Delivery Status Flow:</strong> &quot;✓ ✓✓ 🔵&quot; —
                তিনটা status-এর জন্য exactly কোন event-এ কী হয়, flow diagram
                বানান।
            </span>,
            <span>
                <strong>Group Chat Calculation:</strong> 1000 member group-এ 1
                message। (ক) &quot;1000 copies&quot; approach-এ storage কত? (খ)
                &quot;1 copy + receipts&quot; approach-এ storage কত? প্রতি
                message 1KB ধরুন।
            </span>,
            <span>
                <strong>Presence System Design:</strong> User online/offline
                detection কীভাবে করবেন? Heartbeat interval কত রাখবে? User
                disconnect হলে কখন &quot;offline&quot; mark করবেন? Redis TTL
                কীভাবে use করবেন explain করুন।
            </span>,
        ],
        deliverables: [
            <span>WhatsApp architecture diagram (online + offline paths)</span>,
            <span>Message schema (1-to-1 + group) with partition key justification</span>,
            <span>Delivery status flow diagram (✓ ✓✓ 🔵)</span>,
            <span>Group storage comparison calculation</span>,
        ],
    },
    practicalLab: {
        title: 'WhatsApp Chat Service',
        subtitle: 'WebSocket + Cassandra + Redis',
        steps: [
            {
                title: 'WebSocket Chat Server Setup',
                description:
                    'Python asyncio + websockets দিয়ে basic chat server। connections dict-এ user_id → websocket map করুন।',
            },
            {
                title: 'Redis Integration',
                description:
                    'User online status Redis-এ store করুন (TTL: 60s)। User-server mapping রাখুন। Heartbeat প্রতি 30 sec refresh করুন।',
            },
            {
                title: 'Message Persistence',
                description:
                    'Send করার আগে Cassandra-তে message save করুন। chat_id partition key, TIMEUUID clustering key use করুন।',
            },
            {
                title: 'Cross-server Routing',
                description:
                    'Kafka producer/consumer setup। Different server-এ থাকা user-এর জন্য Kafka topic-এ publish করুন।',
            },
            {
                title: 'Delivery Receipt System',
                description:
                    'Message deliver হলে sender-কে ✓✓ notification পাঠাও। Read হলে 🔵 update করুন। message_receipts table update করুন।',
            },
        ],
        codeBlock: {
            language: 'python',
            filename: 'websocket_chat_server.py',
            code: `import asyncio
import websockets
import json
import redis.asyncio as aioredis
import uuid
from datetime import datetime

# In-memory connections: user_id → websocket
connections = {}
SERVER_ID = "server-1"

# Redis client
redis_client = aioredis.from_url("redis://localhost:6379")

async def authenticate(websocket) -> str:
    """First message should be auth token — return user_id"""
    auth_msg = await websocket.recv()
    data = json.loads(auth_msg)
    return data["user_id"]  # Simplified — real: validate JWT token

async def handle_connection(websocket, path):
    """Handle a single WebSocket connection"""
    user_id = await authenticate(websocket)
    connections[user_id] = websocket

    # Mark user online in Redis (TTL: 60 seconds)
    await redis_client.setex(f"user:{user_id}:online", 60, "true")
    await redis_client.set(f"user:{user_id}:server", SERVER_ID)

    print(f"[+] User {user_id} connected to {SERVER_ID}")

    # Send pending messages
    await deliver_pending_messages(user_id, websocket)

    try:
        async for raw_msg in websocket:
            data = json.loads(raw_msg)

            if data["type"] == "message":
                await process_message(
                    sender_id=user_id,
                    receiver_id=data["to"],
                    content=data["content"],
                    msg_type=data.get("msg_type", "text")
                )
            elif data["type"] == "heartbeat":
                # Refresh Redis TTL on heartbeat
                await redis_client.expire(f"user:{user_id}:online", 60)
                await websocket.send(json.dumps({"type": "heartbeat_ack"}))
            elif data["type"] == "read_receipt":
                await update_read_status(data["msg_id"], user_id)

    except websockets.ConnectionClosed:
        pass
    finally:
        # Cleanup on disconnect
        del connections[user_id]
        await redis_client.set(f"user:{user_id}:online", "false")
        await redis_client.set(
            f"user:{user_id}:last_seen",
            datetime.utcnow().isoformat()
        )
        print(f"[-] User {user_id} disconnected")

async def process_message(sender_id: str, receiver_id: str,
                           content: str, msg_type: str):
    """Process and route a message"""
    msg_id = str(uuid.uuid4())

    # 1. Determine chat_id (sorted tuple for consistency)
    users = sorted([sender_id, receiver_id])
    chat_id = f"{users[0]}:{users[1]}"

    # 2. Persist to Cassandra FIRST (durability)
    await save_to_cassandra(msg_id, chat_id, sender_id, receiver_id, content)

    # 3. Send single-tick ✓ to sender (server received)
    sender_ws = connections.get(sender_id)
    if sender_ws:
        await sender_ws.send(json.dumps({
            "type": "delivery_status",
            "msg_id": msg_id,
            "status": "sent"  # ✓
        }))

    # 4. Find receiver's server
    receiver_server = await redis_client.get(f"user:{receiver_id}:server")
    receiver_online = await redis_client.get(f"user:{receiver_id}:online")

    if receiver_online == b"true":
        if receiver_server and receiver_server.decode() == SERVER_ID:
            # Same server — direct push
            await push_to_receiver(receiver_id, msg_id, sender_id, content)
        else:
            # Different server — route via Kafka
            await route_via_kafka(receiver_server.decode(), {
                "msg_id": msg_id,
                "sender_id": sender_id,
                "receiver_id": receiver_id,
                "content": content
            })
    # If offline: message already in Cassandra, will be delivered on reconnect

async def push_to_receiver(receiver_id: str, msg_id: str,
                            sender_id: str, content: str):
    """Push message directly to receiver on this server"""
    receiver_ws = connections.get(receiver_id)
    if receiver_ws:
        await receiver_ws.send(json.dumps({
            "type": "message",
            "msg_id": msg_id,
            "from": sender_id,
            "content": content
        }))
        # Update delivery status: double tick ✓✓
        await mark_delivered(msg_id, receiver_id)

async def deliver_pending_messages(user_id: str, websocket):
    """Deliver unread messages when user comes online"""
    # Query Cassandra for undelivered messages
    # In real implementation: query message_receipts for null delivered_at
    pending = await get_undelivered_messages(user_id)
    for msg in pending:
        await websocket.send(json.dumps({
            "type": "message",
            "msg_id": msg["msg_id"],
            "from": msg["sender_id"],
            "content": msg["content"]
        }))

async def save_to_cassandra(msg_id, chat_id, sender_id, receiver_id, content):
    """Save message to Cassandra — stub for demo"""
    print(f"[DB] Saving msg {msg_id} in chat {chat_id}")

async def get_undelivered_messages(user_id):
    """Get undelivered messages from Cassandra — stub"""
    return []  # Real: SELECT * FROM messages WHERE receiver_id=? AND delivered=false

async def mark_delivered(msg_id, user_id):
    """Update delivery receipt — stub"""
    print(f"[DB] Marking msg {msg_id} delivered to {user_id}")

async def update_read_status(msg_id, user_id):
    """Mark message as read (blue tick 🔵) — stub"""
    print(f"[DB] Marking msg {msg_id} read by {user_id}")

async def route_via_kafka(target_server, message):
    """Publish to Kafka topic for target server — stub"""
    print(f"[Kafka] Routing to topic chat:{target_server}")

# Start server
start_server = websockets.serve(handle_connection, "0.0.0.0", 8765)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()`,
        },
        tip: 'এই implementation-এ Cassandra এবং Kafka stub করা আছে। Real project-এ cassandra-driver এবং confluent-kafka-python library use করুন। Redis TTL heartbeat mechanism টা সবচেয়ে important — এটাই online presence-এর core।',
    },
};
