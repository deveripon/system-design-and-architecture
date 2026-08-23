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

export const microservicesContent: TopicData = {
    id: 'microservices',
    sections: [
        {
            id: 'intro-concept',
            subHeader: { index: '001', title: 'Why It Matters' },
            title: (
                <SectionTitle>
                    Microservices কেন শিখতে হবে?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                আপনি একটা বড় e-commerce app বানাচ্ছো। User
                                login, product catalog, payment, order tracking,
                                notification — সব একটা codebase এ। এক জায়গায়
                                bug হলে পুরো system down। Team বড় হলে merge
                                conflict। Deploy করতে পুরো app restart।
                            </ContentParagraph>
                            <ContentParagraph>
                                এই সমস্যার সমাধান হলো{' '}
                                <strong className='text-foreground'>
                                    Microservices Architecture
                                </strong>
                                । আজকাল Amazon, Netflix, Uber, Spotify সহ প্রায়
                                সব বড় company এই approach ব্যবহার করে।
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
                            <strong>Microservices</strong> হলো একটা architectural
                            style যেখানে একটা বড় application কে ছোট ছোট
                            independent services এ ভাগ করা হয়। প্রতিটা service
                            তার নিজের কাজ করে, নিজের database রাখে, এবং network
                            (HTTP/gRPC) এর মাধ্যমে অন্য services এর সাথে
                            communicate করে।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'monolith-vs-microservices',
            subHeader: { index: '002', title: 'Monolith vs Microservices' },
            title: (
                <SectionTitle>
                    আগে কী ছিল, এখন কী হয়েছে?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            দুটো approach এর মূল পার্থক্য বোঝা দরকার — কারণ
                            interview তে এই comparison প্রায়ই আসে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='my-6 rounded-lg border border-border bg-card/30 p-6 overflow-x-auto'>
                            <svg
                                viewBox='0 0 700 320'
                                xmlns='http://www.w3.org/2000/svg'
                                className='max-w-full'
                            >
                                {/* Monolith side */}
                                <text
                                    x='160'
                                    y='28'
                                    fill='#94a3b8'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='12'
                                    textAnchor='middle'
                                    fontWeight='700'
                                >
                                    MONOLITH
                                </text>
                                <rect
                                    x='60'
                                    y='40'
                                    width='200'
                                    height='220'
                                    rx='8'
                                    fill='#1a1915'
                                    stroke='#1e2d4a'
                                    strokeWidth='1.5'
                                />
                                <rect
                                    x='75'
                                    y='55'
                                    width='170'
                                    height='30'
                                    rx='4'
                                    fill='#162035'
                                    stroke='#1e2d4a'
                                />
                                <text
                                    x='160'
                                    y='75'
                                    fill='#93c5fd'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                >
                                    User Service
                                </text>
                                <rect
                                    x='75'
                                    y='93'
                                    width='170'
                                    height='30'
                                    rx='4'
                                    fill='#162035'
                                    stroke='#1e2d4a'
                                />
                                <text
                                    x='160'
                                    y='113'
                                    fill='#93c5fd'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                >
                                    Product Service
                                </text>
                                <rect
                                    x='75'
                                    y='131'
                                    width='170'
                                    height='30'
                                    rx='4'
                                    fill='#162035'
                                    stroke='#1e2d4a'
                                />
                                <text
                                    x='160'
                                    y='151'
                                    fill='#93c5fd'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                >
                                    Order Service
                                </text>
                                <rect
                                    x='75'
                                    y='169'
                                    width='170'
                                    height='30'
                                    rx='4'
                                    fill='#162035'
                                    stroke='#1e2d4a'
                                />
                                <text
                                    x='160'
                                    y='189'
                                    fill='#93c5fd'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                >
                                    Payment Service
                                </text>
                                <rect
                                    x='75'
                                    y='207'
                                    width='170'
                                    height='30'
                                    rx='4'
                                    fill='#162035'
                                    stroke='#1e2d4a'
                                />
                                <text
                                    x='160'
                                    y='227'
                                    fill='#93c5fd'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                >
                                    Notification Service
                                </text>
                                {/* Single DB */}
                                <rect
                                    x='110'
                                    y='270'
                                    width='100'
                                    height='28'
                                    rx='4'
                                    fill='#1e2d4a'
                                    stroke='#cc6b45'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='160'
                                    y='288'
                                    fill='#cc6b45'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                >
                                    Single DB
                                </text>
                                <line
                                    x1='160'
                                    y1='260'
                                    x2='160'
                                    y2='270'
                                    stroke='#cc6b45'
                                    strokeWidth='1'
                                    strokeDasharray='4'
                                />
                                {/* Arrow divider */}
                                <text
                                    x='350'
                                    y='170'
                                    fill='#f97316'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='22'
                                    textAnchor='middle'
                                >
                                    →
                                </text>
                                {/* Microservices side */}
                                <text
                                    x='540'
                                    y='28'
                                    fill='#94a3b8'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='12'
                                    textAnchor='middle'
                                    fontWeight='700'
                                >
                                    MICROSERVICES
                                </text>
                                <rect
                                    x='430'
                                    y='40'
                                    width='90'
                                    height='50'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='475'
                                    y='60'
                                    fill='#c4b5fd'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    User
                                </text>
                                <text
                                    x='475'
                                    y='75'
                                    fill='#c4b5fd'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    Service
                                </text>
                                <rect
                                    x='540'
                                    y='40'
                                    width='90'
                                    height='50'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='585'
                                    y='60'
                                    fill='#c4b5fd'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    Product
                                </text>
                                <text
                                    x='585'
                                    y='75'
                                    fill='#c4b5fd'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    Service
                                </text>
                                <rect
                                    x='430'
                                    y='115'
                                    width='90'
                                    height='50'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='475'
                                    y='135'
                                    fill='#6ee7b7'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    Order
                                </text>
                                <text
                                    x='475'
                                    y='150'
                                    fill='#6ee7b7'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    Service
                                </text>
                                <rect
                                    x='540'
                                    y='115'
                                    width='90'
                                    height='50'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='585'
                                    y='135'
                                    fill='#6ee7b7'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    Payment
                                </text>
                                <text
                                    x='585'
                                    y='150'
                                    fill='#6ee7b7'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    Service
                                </text>
                                <rect
                                    x='485'
                                    y='190'
                                    width='90'
                                    height='50'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#f97316'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='530'
                                    y='210'
                                    fill='#fdba74'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    Notification
                                </text>
                                <text
                                    x='530'
                                    y='225'
                                    fill='#fdba74'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    Service
                                </text>
                                {/* Individual DBs */}
                                <rect
                                    x='435'
                                    y='258'
                                    width='40'
                                    height='18'
                                    rx='3'
                                    fill='#1e2d4a'
                                    stroke='#8b5cf6'
                                    strokeWidth='1'
                                />
                                <text
                                    x='455'
                                    y='271'
                                    fill='#8b5cf6'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    DB
                                </text>
                                <rect
                                    x='546'
                                    y='258'
                                    width='40'
                                    height='18'
                                    rx='3'
                                    fill='#1e2d4a'
                                    stroke='#8b5cf6'
                                    strokeWidth='1'
                                />
                                <text
                                    x='566'
                                    y='271'
                                    fill='#8b5cf6'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    DB
                                </text>
                                <rect
                                    x='435'
                                    y='285'
                                    width='40'
                                    height='18'
                                    rx='3'
                                    fill='#1e2d4a'
                                    stroke='#10b981'
                                    strokeWidth='1'
                                />
                                <text
                                    x='455'
                                    y='298'
                                    fill='#10b981'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    DB
                                </text>
                                <rect
                                    x='546'
                                    y='285'
                                    width='40'
                                    height='18'
                                    rx='3'
                                    fill='#1e2d4a'
                                    stroke='#10b981'
                                    strokeWidth='1'
                                />
                                <text
                                    x='566'
                                    y='298'
                                    fill='#10b981'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    DB
                                </text>
                                {/* Lines from services to DBs */}
                                <line
                                    x1='475'
                                    y1='165'
                                    x2='455'
                                    y2='285'
                                    stroke='#10b981'
                                    strokeWidth='1'
                                    strokeDasharray='3'
                                />
                                <line
                                    x1='585'
                                    y1='165'
                                    x2='566'
                                    y2='285'
                                    stroke='#10b981'
                                    strokeWidth='1'
                                    strokeDasharray='3'
                                />
                                <line
                                    x1='475'
                                    y1='90'
                                    x2='455'
                                    y2='258'
                                    stroke='#8b5cf6'
                                    strokeWidth='1'
                                    strokeDasharray='3'
                                />
                                <line
                                    x1='585'
                                    y1='90'
                                    x2='566'
                                    y2='258'
                                    stroke='#8b5cf6'
                                    strokeWidth='1'
                                    strokeDasharray='3'
                                />
                            </svg>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['বিষয়', 'Monolith', 'Microservices'],
                    rows: [
                        [
                            'Deploy',
                            'পুরো app একসাথে',
                            'প্রতিটা service আলাদা',
                        ],
                        [
                            'Scale',
                            'পুরো app scale করতে হয়',
                            'শুধু দরকারী service scale করুন',
                        ],
                        [
                            'Team',
                            'একটা team সব কাজ করে',
                            'প্রতিটা service এর আলাদা team',
                        ],
                        [
                            'Technology',
                            'একটাই language/framework',
                            'প্রতিটা service ভিন্ন tech',
                        ],
                        [
                            'Failure',
                            'একটা bug সব ভাঙে',
                            'একটা service fail হলে বাকিগুলো চলে',
                        ],
                        [
                            'Database',
                            'Shared single database',
                            'প্রতিটার নিজের database',
                        ],
                        [
                            'Complexity',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Simple
                            </span>,
                            <span className='text-red-700 dark:text-red-400'>
                                High (Network, tracing)
                            </span>,
                        ],
                        [
                            'Startup',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Ideal for small teams
                            </span>,
                            <span className='text-red-700 dark:text-red-400'>
                                Overkill for small apps
                            </span>,
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: 'IMPORTANT',
                    content: (
                        <p className='text-lg leading-relaxed'>
                            Microservices মানে এই না যে সবসময় ভালো। Small
                            startup এ monolith দিয়ে শুরু করা অনেক বেশি
                            sensible। System জটিল হলে, team বড় হলে, তখন
                            microservices এ migrate করুন। Amazon নিজেও monolith
                            দিয়ে শুরু করেছেনিল!
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'how-it-works',
            subHeader: { index: '003', title: 'How It Works' },
            title: (
                <SectionTitle>
                    Microservices কীভাবে কাজ করে?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            একটা real e-commerce order flow দেখি — user order
                            দিলে কী হয়:
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='my-6 rounded-lg border border-border bg-card/30 p-6 overflow-x-auto'>
                            <svg
                                viewBox='0 0 700 260'
                                xmlns='http://www.w3.org/2000/svg'
                                className='max-w-full'
                            >
                                <defs>
                                    <marker
                                        id='arr-ms'
                                        markerWidth='8'
                                        markerHeight='6'
                                        refX='8'
                                        refY='3'
                                        orient='auto'
                                    >
                                        <polygon
                                            points='0 0, 8 3, 0 6'
                                            fill='#cc6b45'
                                        />
                                    </marker>
                                    <marker
                                        id='arr2-ms'
                                        markerWidth='8'
                                        markerHeight='6'
                                        refX='8'
                                        refY='3'
                                        orient='auto'
                                    >
                                        <polygon
                                            points='0 0, 8 3, 0 6'
                                            fill='#8b5cf6'
                                        />
                                    </marker>
                                    <marker
                                        id='arr3-ms'
                                        markerWidth='8'
                                        markerHeight='6'
                                        refX='8'
                                        refY='3'
                                        orient='auto'
                                    >
                                        <polygon
                                            points='0 0, 8 3, 0 6'
                                            fill='#10b981'
                                        />
                                    </marker>
                                </defs>
                                {/* Client */}
                                <rect
                                    x='10'
                                    y='100'
                                    width='80'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#cc6b45'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='50'
                                    y='124'
                                    fill='#93c5fd'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                >
                                    Client
                                </text>
                                {/* Arrow to API Gateway */}
                                <line
                                    x1='90'
                                    y1='120'
                                    x2='130'
                                    y2='120'
                                    stroke='#cc6b45'
                                    strokeWidth='1.5'
                                    markerEnd='url(#arr-ms)'
                                />
                                {/* API Gateway */}
                                <rect
                                    x='130'
                                    y='90'
                                    width='100'
                                    height='60'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#eab308'
                                    strokeWidth='2'
                                />
                                <text
                                    x='180'
                                    y='115'
                                    fill='#fcd34d'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                    fontWeight='700'
                                >
                                    API
                                </text>
                                <text
                                    x='180'
                                    y='130'
                                    fill='#fcd34d'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                    fontWeight='700'
                                >
                                    Gateway
                                </text>
                                {/* Arrows to services */}
                                <line
                                    x1='230'
                                    y1='105'
                                    x2='290'
                                    y2='65'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                    markerEnd='url(#arr2-ms)'
                                />
                                <line
                                    x1='230'
                                    y1='120'
                                    x2='290'
                                    y2='120'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                    markerEnd='url(#arr2-ms)'
                                />
                                <line
                                    x1='230'
                                    y1='135'
                                    x2='290'
                                    y2='175'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                    markerEnd='url(#arr2-ms)'
                                />
                                {/* Order Service */}
                                <rect
                                    x='290'
                                    y='40'
                                    width='110'
                                    height='50'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='345'
                                    y='60'
                                    fill='#c4b5fd'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                >
                                    Order
                                </text>
                                <text
                                    x='345'
                                    y='75'
                                    fill='#c4b5fd'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                >
                                    Service
                                </text>
                                {/* Inventory Service */}
                                <rect
                                    x='290'
                                    y='95'
                                    width='110'
                                    height='50'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='345'
                                    y='115'
                                    fill='#c4b5fd'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                >
                                    Inventory
                                </text>
                                <text
                                    x='345'
                                    y='130'
                                    fill='#c4b5fd'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                >
                                    Service
                                </text>
                                {/* Payment Service */}
                                <rect
                                    x='290'
                                    y='150'
                                    width='110'
                                    height='50'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='345'
                                    y='170'
                                    fill='#c4b5fd'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                >
                                    Payment
                                </text>
                                <text
                                    x='345'
                                    y='185'
                                    fill='#c4b5fd'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                >
                                    Service
                                </text>
                                {/* Message Bus */}
                                <rect
                                    x='430'
                                    y='90'
                                    width='120'
                                    height='60'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#f97316'
                                    strokeWidth='2'
                                />
                                <text
                                    x='490'
                                    y='115'
                                    fill='#fdba74'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                >
                                    Message Bus
                                </text>
                                <text
                                    x='490'
                                    y='130'
                                    fill='#fdba74'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    (Kafka/RabbitMQ)
                                </text>
                                {/* Arrows to bus */}
                                <line
                                    x1='400'
                                    y1='65'
                                    x2='430'
                                    y2='105'
                                    stroke='#f97316'
                                    strokeWidth='1'
                                    strokeDasharray='4'
                                />
                                <line
                                    x1='400'
                                    y1='120'
                                    x2='430'
                                    y2='120'
                                    stroke='#f97316'
                                    strokeWidth='1'
                                    strokeDasharray='4'
                                />
                                <line
                                    x1='400'
                                    y1='175'
                                    x2='430'
                                    y2='135'
                                    stroke='#f97316'
                                    strokeWidth='1'
                                    strokeDasharray='4'
                                />
                                {/* Notification */}
                                <rect
                                    x='580'
                                    y='90'
                                    width='110'
                                    height='50'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='635'
                                    y='110'
                                    fill='#6ee7b7'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                >
                                    Notification
                                </text>
                                <text
                                    x='635'
                                    y='125'
                                    fill='#6ee7b7'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                >
                                    Service
                                </text>
                                <line
                                    x1='550'
                                    y1='120'
                                    x2='580'
                                    y2='115'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                    markerEnd='url(#arr3-ms)'
                                />
                                {/* Flow labels */}
                                <text
                                    x='110'
                                    y='108'
                                    fill='#64748b'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    1. Request
                                </text>
                                <text
                                    x='265'
                                    y='85'
                                    fill='#64748b'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    2. Route
                                </text>
                                <text
                                    x='420'
                                    y='80'
                                    fill='#64748b'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    3. Event
                                </text>
                                <text
                                    x='562'
                                    y='108'
                                    fill='#64748b'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    4. Notify
                                </text>
                            </svg>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-10 mt-20'>
                                Key Components
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-yellow-500' />
                                        API GATEWAY
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Single entry point। Client সব request
                                        এখানে পাঠায়। Rate limiting, auth,
                                        routing সব এখানে handle হয়। (Kong, AWS
                                        API Gateway, Nginx)
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-orange-500' />
                                        MESSAGE BUS
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Services এর মধ্যে async communication।
                                        Direct call না করে event publish করুন।
                                        (Kafka, RabbitMQ, AWS SQS)
                                    </p>
                                </div>
                                <div className='p-8 border-r border-t border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-purple-500' />
                                        SERVICE REGISTRY
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        কোন service কোথায় আছে তার directory।
                                        Services নিজেদের register করে। (Consul,
                                        Eureka, Kubernetes DNS)
                                    </p>
                                </div>
                                <div className='p-8 border-t border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-blue-500' />
                                        DISTRIBUTED TRACING
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Request কোন কোন service এ গেছে track
                                        করা। একটা request এর পুরো journey দেখা।
                                        (Jaeger, Zipkin, Datadog)
                                    </p>
                                </div>
                            </div>
                        </>
                    ),
                },
            ],
        },
        {
            id: 'design-patterns',
            subHeader: { index: '004', title: 'Design Patterns' },
            title: (
                <SectionTitle>
                    Microservices Design Patterns
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mb-6'>
                            1. Database per Service Pattern
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            প্রতিটা service এর নিজের database থাকবেন। কোনো
                            service অন্য service এর database সরাসরি access
                            করবেন না। এতে loose coupling নিশ্চিত হয়।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'WHY IT\'S GOOD',
                    content: (
                        <>
                            User service PostgreSQL use করতে পারে, Product
                            service MongoDB use করতে পারে, Cart service Redis
                            use করতে পারে — প্রতিটা service তার কাজের জন্য
                            best database choose করতে পারে।
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mt-16 mb-6'>
                            2. Saga Pattern (Short Overview)
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Multiple services এ একটা transaction। Order service
                            → Payment service → Inventory service। কোনো step
                            fail করলেন rollback। Topic 6 এ বিস্তারিত।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mt-16 mb-6'>
                            3. CQRS (Command Query Responsibility Segregation)
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Read এবং Write এর জন্য আলাদা model। Write
                            operations যায় Command side এ, Read operations
                            যায় Query side এ। High traffic systems এ খুব
                            useful।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='my-6 rounded-lg border border-border bg-card/30 p-6 overflow-x-auto'>
                            <svg
                                viewBox='0 0 620 180'
                                xmlns='http://www.w3.org/2000/svg'
                                className='max-w-full'
                            >
                                <text
                                    x='310'
                                    y='20'
                                    fill='#94a3b8'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='11'
                                    textAnchor='middle'
                                >
                                    CQRS PATTERN
                                </text>
                                {/* Client */}
                                <rect
                                    x='10'
                                    y='65'
                                    width='80'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#cc6b45'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='50'
                                    y='89'
                                    fill='#93c5fd'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                >
                                    Client
                                </text>
                                {/* Command */}
                                <line
                                    x1='90'
                                    y1='75'
                                    x2='140'
                                    y2='55'
                                    stroke='#f97316'
                                    strokeWidth='1.5'
                                />
                                <rect
                                    x='140'
                                    y='35'
                                    width='120'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#f97316'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='200'
                                    y='58'
                                    fill='#fdba74'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                >
                                    Command Handler
                                </text>
                                {/* Query */}
                                <line
                                    x1='90'
                                    y1='95'
                                    x2='140'
                                    y2='115'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                />
                                <rect
                                    x='140'
                                    y='95'
                                    width='120'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='200'
                                    y='118'
                                    fill='#c4b5fd'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                >
                                    Query Handler
                                </text>
                                {/* Write DB */}
                                <line
                                    x1='260'
                                    y1='55'
                                    x2='330'
                                    y2='55'
                                    stroke='#f97316'
                                    strokeWidth='1.5'
                                />
                                <rect
                                    x='330'
                                    y='35'
                                    width='110'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#f97316'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='385'
                                    y='58'
                                    fill='#fdba74'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    Write DB (SQL)
                                </text>
                                {/* Read DB */}
                                <line
                                    x1='260'
                                    y1='115'
                                    x2='330'
                                    y2='115'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                />
                                <rect
                                    x='330'
                                    y='95'
                                    width='110'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='385'
                                    y='118'
                                    fill='#c4b5fd'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    Read DB (Redis)
                                </text>
                                {/* Sync arrow */}
                                <line
                                    x1='440'
                                    y1='55'
                                    x2='490'
                                    y2='85'
                                    stroke='#10b981'
                                    strokeWidth='1'
                                    strokeDasharray='4'
                                />
                                <line
                                    x1='440'
                                    y1='115'
                                    x2='490'
                                    y2='95'
                                    stroke='#10b981'
                                    strokeWidth='1'
                                    strokeDasharray='4'
                                />
                                <rect
                                    x='490'
                                    y='65'
                                    width='110'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='545'
                                    y='85'
                                    fill='#6ee7b7'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    Event Bus Sync
                                </text>
                                <text
                                    x='95'
                                    y='55'
                                    fill='#f97316'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='8'
                                >
                                    Write
                                </text>
                                <text
                                    x='95'
                                    y='110'
                                    fill='#8b5cf6'
                                    fontFamily='JetBrains Mono, monospace'
                                    fontSize='8'
                                >
                                    Read
                                </text>
                            </svg>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'code-examples',
            subHeader: { index: '005', title: 'Code Examples' },
            title: (
                <SectionTitle>
                    Practical Code — Python &amp; Node.js
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mb-6'>
                            Python: FastAPI দিয়ে Order Microservice
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'order_service/main.py',
                    code: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx  # অন্য service কে call করার জন্য
import asyncio

app = FastAPI(title="Order Service")

# অন্য services এর URL — real এ এটা env variable থেকে আসবেন
PAYMENT_SERVICE_URL = "http://payment-service:8001"
INVENTORY_SERVICE_URL = "http://inventory-service:8002"

class OrderRequest(BaseModel):
    user_id: int
    product_id: int
    quantity: int
    total_amount: float

# In-memory DB (real এ PostgreSQL হবে)
orders_db = {}
order_counter = 1

@app.post("/orders")
async def create_order(order: OrderRequest):
    global order_counter
    async with httpx.AsyncClient() as client:
        # Step 1: Inventory check করুন
        inv_response = await client.get(
            f"{INVENTORY_SERVICE_URL}/check/{order.product_id}/{order.quantity}"
        )
        if inv_response.status_code != 200:
            raise HTTPException(400, "Insufficient inventory")

        # Step 2: Payment process করুন
        pay_response = await client.post(
            f"{PAYMENT_SERVICE_URL}/charge",
            json={"user_id": order.user_id, "amount": order.total_amount}
        )
        if pay_response.status_code != 200:
            raise HTTPException(402, "Payment failed")

    # Step 3: Order save করুন
    order_id = order_counter
    orders_db[order_id] = {"id": order_id, "status": "confirmed", **order.dict()}
    order_counter += 1

    return {"order_id": order_id, "status": "confirmed"}

@app.get("/orders/{order_id}")
async def get_order(order_id: int):
    order = orders_db.get(order_id)
    if not order:
        raise HTTPException(404, "Order not found")
    return order`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mt-16 mb-6'>
                            Node.js: Express দিয়ে Payment Microservice
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'payment_service/index.js',
                    code: `const express = require('express');
const app = express();
app.use(express.json());

// Mock payment processor
const payments = new Map();

app.post('/charge', async (req, res) => {
    const { user_id, amount } = req.body;

    // Simulate payment processing
    if (amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    const payment_id = \`pay_\${Date.now()}\`;
    payments.set(payment_id, {
        user_id,
        amount,
        status: 'success',
        timestamp: new Date().toISOString()
    });

    // Real এ এখানে Stripe/bKash API call হবে
    res.json({
        payment_id,
        status: 'success',
        message: \`Payment of ৳\${amount} processed\`
    });
});

app.get('/payment/:id', (req, res) => {
    const payment = payments.get(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Not found' });
    res.json(payment);
});

app.listen(8001, () => console.log('Payment service running on :8001'));`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mt-16 mb-6'>
                            Docker Compose: Services একসাথে চালানো
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'yaml',
                    filename: 'docker-compose.yml',
                    code: `version: '3.8'
services:
  api-gateway:
    image: nginx:alpine
    ports: ["80:80"]
    volumes: ["./nginx.conf:/etc/nginx/nginx.conf"]
    depends_on: [order-service, payment-service, inventory-service]

  order-service:
    build: ./order_service
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL=postgresql://user:pass@order-db:5432/orders
    depends_on: [order-db, kafka]

  payment-service:
    build: ./payment_service
    ports: ["8001:8001"]

  inventory-service:
    build: ./inventory_service
    ports: ["8002:8002"]

  order-db:
    image: postgres:15
    environment:
      POSTGRES_DB: orders
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass

  kafka:
    image: confluentinc/cp-kafka:latest
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181`,
                },
            ],
        },
        {
            id: 'realworld',
            subHeader: { index: '006', title: 'Real World Use Cases' },
            title: (
                <SectionTitle>
                    বাস্তব জীবনে <span className='italic'>Microservices</span>
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                            <div className='space-y-4'>
                                <h3 className='text-lg font-bold flex items-center gap-2'>
                                    Netflix
                                </h3>
                                <p className='text-muted-foreground leading-relaxed italic'>
                                    ৫০০+ microservices। প্রতিটা Netflix feature
                                    আলাদা service। Recommendation, streaming,
                                    billing সব আলাদা। প্রতি মাসে ১ billion+ API
                                    calls।
                                </p>
                            </div>
                            <div className='space-y-4'>
                                <h3 className='text-lg font-bold flex items-center gap-2'>
                                    Amazon
                                </h3>
                                <p className='text-muted-foreground leading-relaxed italic'>
                                    2-pizza rule: প্রতিটা team এত ছোট হবে যে
                                    দুটো pizza তে খাওয়া যাবেন। প্রতিটা team তার
                                    service নিজেই deploy করে।
                                </p>
                            </div>
                            <div className='space-y-4'>
                                <h3 className='text-lg font-bold flex items-center gap-2'>
                                    Uber
                                </h3>
                                <p className='text-muted-foreground leading-relaxed italic'>
                                    Monolith থেকে migrate করেছেনে। Rider, Driver,
                                    Maps, Payment সব আলাদা service। Peak hour
                                    এ শুধু Matching service scale করে।
                                </p>
                            </div>
                            <div className='space-y-4'>
                                <h3 className='text-lg font-bold flex items-center gap-2'>
                                    Spotify
                                </h3>
                                <p className='text-muted-foreground leading-relaxed italic'>
                                    Squads system — প্রতিটা Squad একটা service
                                    own করে। Search, Playlist, Social সব
                                    আলাদা। ৩০+ countries এ simultaneously
                                    deploy।
                                </p>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mt-16 mb-6'>
                            Tools Comparison
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Tool/Platform',
                        'Type',
                        'Best For',
                        'বাংলাদেশে ব্যবহার',
                    ],
                    rows: [
                        [
                            'Kubernetes (K8s)',
                            'Orchestration',
                            'Production microservices',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Growing
                            </span>,
                        ],
                        [
                            'Docker Compose',
                            'Local Dev',
                            'Development ও testing',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Very Common
                            </span>,
                        ],
                        [
                            'AWS ECS/EKS',
                            'Managed',
                            'Cloud deployment',
                            <span className='text-yellow-700 dark:text-yellow-400'>Medium</span>,
                        ],
                        [
                            'Kong / NGINX',
                            'API Gateway',
                            'Request routing',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Common
                            </span>,
                        ],
                        [
                            'Kafka',
                            'Message Queue',
                            'Async communication',
                            <span className='text-yellow-700 dark:text-yellow-400'>Growing</span>,
                        ],
                        [
                            'Jaeger / Zipkin',
                            'Tracing',
                            'Debugging distributed calls',
                            <span className='text-red-700 dark:text-red-400'>Rare</span>,
                        ],
                    ],
                },
            ],
        },
        {
            id: 'interview',
            subHeader: { index: '007', title: 'Interview Preparation' },
            title: (
                <SectionTitle>
                    Common Interview Questions
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q1: Monolith vs Microservices কখন কোনটা choose করবেন?',
                    content: (
                        <>
                            <strong>Answer:</strong> Small team, early startup,
                            simple domain — Monolith দিয়ে শুরু করুন। Complex
                            domain, multiple teams, different scaling needs,
                            independent deployments দরকার হলে Microservices।
                            &quot;Don&apos;t start with microservices&quot; —
                            Martin Fowler এর বিখ্যাত পরামর্শ।
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q2: Microservices এ inter-service communication কীভাবে হয়?',
                    content: (
                        <>
                            <strong>Synchronous:</strong> REST (HTTP), gRPC।
                            Real-time response দরকার হলে।
                            <br />
                            <strong>Asynchronous:</strong> Message Queue (Kafka,
                            RabbitMQ)। Event-driven, decoupled। Payment
                            notification, email পাঠানো এ ধরনের কাজে।
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q3: Service কতটা ছোট হওয়া উচিত?',
                    content: (
                        <>
                            <strong>Answer:</strong> Single Responsibility
                            Principle follow করুন। একটা service একটা business
                            capability handle করবেন। &quot;Microservice&quot;
                            মানে code এর size না — responsibility এর size। User
                            management একটা service, Payment একটা service।
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q4: Distributed system এ data consistency কীভাবে manage করুন?',
                    content: (
                        <>
                            <strong>Answer:</strong> Eventual consistency।
                            Strong consistency সব সময় possible না distributed
                            এ। Saga pattern, event sourcing, compensating
                            transactions ব্যবহার করুন। CAP theorem মনে রাখুন।
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
                <span className='font-bold text-primary'>Microservices</span>,
                'বড় app কে ছোট independent services এ ভাগ করুন',
            ],
            [
                <span className='font-bold text-primary'>API Gateway</span>,
                'Single entry point, routing, auth, rate limiting',
            ],
            [
                <span className='font-bold text-primary'>DB per Service</span>,
                'প্রতিটা service এর নিজের DB — loose coupling',
            ],
            [
                <span className='font-bold text-primary'>
                    Sync Communication
                </span>,
                'REST/gRPC — real-time response দরকার হলে',
            ],
            [
                <span className='font-bold text-primary'>
                    Async Communication
                </span>,
                'Kafka/RabbitMQ — decoupled event-driven',
            ],
            [
                <span className='font-bold text-primary'>CQRS</span>,
                'Read ও Write আলাদা করুন — performance boost',
            ],
            [
                <span className='font-bold text-primary'>When to use</span>,
                'Large teams, complex domain, independent scaling দরকার হলে',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'Microservices Architecture এর সবচেয়ে বড় সুবিধা কোনটি?',
                options: [
                    {
                        key: 'A',
                        text: 'Code লেখা অনেক সহজ হয়ে যায়',
                        isCorrect: false,
                        explanation:
                            'Microservices এ code লেখা বরং বেশি complex — distributed system manage করতে হয়।',
                    },
                    {
                        key: 'B',
                        text: 'Database query faster হয়',
                        isCorrect: false,
                        explanation:
                            'Database query speed microservices architecture এর সরাসরি সুবিধা না।',
                    },
                    {
                        key: 'C',
                        text: 'Independent deployment এবং scaling করা যায়',
                        isCorrect: true,
                        explanation:
                            'Microservices এর core benefit হলো প্রতিটা service independently deploy এবং scale করা যায়। Payment service suddenly slow হলে শুধু সেটাই scale করুন, পুরো system না।',
                    },
                    {
                        key: 'D',
                        text: 'Server cost কমে যায়',
                        isCorrect: false,
                        explanation:
                            'Microservices এ বরং infrastructure cost বেশি হতে পারে — অনেক services manage করতে হয়।',
                    },
                ],
            },
            {
                id: 2,
                text: 'Database per Service pattern কেন ব্যবহার করা হয়?',
                options: [
                    {
                        key: 'A',
                        text: 'Database storage কম লাগে',
                        isCorrect: false,
                        explanation:
                            'আলাদা database থাকলে storage বরং বেশি লাগতে পারে।',
                    },
                    {
                        key: 'B',
                        text: 'Services এর মধ্যে loose coupling নিশ্চিত করতে',
                        isCorrect: true,
                        explanation:
                            'Shared database থাকলে services tightly coupled হয়। একটা service এর schema change করলেন অন্যটা ভাঙে। Separate DB দিলে প্রতিটা service independent থাকে।',
                    },
                    {
                        key: 'C',
                        text: 'SQL query faster হয়',
                        isCorrect: false,
                        explanation:
                            'Query speed আলাদা database এর সরাসরি সুবিধা না।',
                    },
                    {
                        key: 'D',
                        text: 'Backup নেওয়া সহজ হয়',
                        isCorrect: false,
                        explanation:
                            'আলাদা database থাকলে backup আরও বেশি complex হতে পারে।',
                    },
                ],
            },
            {
                id: 3,
                text: 'API Gateway এর primary responsibility কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Single entry point হিসেবে request route করা এবং cross-cutting concerns handle করা',
                        isCorrect: true,
                        explanation:
                            'API Gateway হলো microservices এর front door। Authentication, rate limiting, SSL termination, logging — সব cross-cutting concerns এখানে handle হয়। Client কে জানতে হয় না কোন service কোথায়।',
                    },
                    {
                        key: 'B',
                        text: 'Database queries optimize করা',
                        isCorrect: false,
                        explanation:
                            'API Gateway database queries নিয়ে কাজ করে না।',
                    },
                    {
                        key: 'C',
                        text: 'Code compilation করা',
                        isCorrect: false,
                        explanation:
                            'API Gateway runtime component — code compile করে না।',
                    },
                    {
                        key: 'D',
                        text: 'Static files serve করা',
                        isCorrect: false,
                        explanation:
                            'Static files CDN বা dedicated server serve করে, API Gateway না।',
                    },
                ],
            },
            {
                id: 4,
                text: 'Microservices এ services এর মধ্যে Asynchronous communication এর জন্য কোনটা ব্যবহার করা হয়?',
                options: [
                    {
                        key: 'A',
                        text: 'REST API direct call',
                        isCorrect: false,
                        explanation:
                            'REST API synchronous — caller block হয়ে response এর জন্য অপেক্ষা করে।',
                    },
                    {
                        key: 'B',
                        text: 'gRPC',
                        isCorrect: false,
                        explanation:
                            'gRPC primarily synchronous RPC framework, async communication এর জন্য উপযুক্ত না।',
                    },
                    {
                        key: 'C',
                        text: 'WebSocket',
                        isCorrect: false,
                        explanation:
                            'WebSocket real-time client-server communication এর জন্য, service-to-service async messaging এর জন্য না।',
                    },
                    {
                        key: 'D',
                        text: 'Message Queue (Kafka/RabbitMQ)',
                        isCorrect: true,
                        explanation:
                            'Async communication এর জন্য Message Queue best। Order placed → event publish → Payment service subscribe করে process করে। Services decoupled থাকে, একটা slow হলে অন্যটা block হয় না।',
                    },
                ],
            },
            {
                id: 5,
                text: 'Netflix, Amazon এর মতো companies Microservices কেন use করে?',
                options: [
                    {
                        key: 'A',
                        text: 'কারণ এটা নতুন technology',
                        isCorrect: false,
                        explanation:
                            'Technology নতুন বলে ব্যবহার করা কোনো কারণ না। তারা business need এর জন্য ব্যবহার করে।',
                    },
                    {
                        key: 'B',
                        text: 'Independent team autonomy, fault isolation, এবং massive scale handle করতে',
                        isCorrect: true,
                        explanation:
                            'Netflix এর ৫০০+ teams প্রতিটা আলাদা service own করে এবং independently deploy করে। একটা service fail করলেন বাকিগুলো চলে। এই scale এ monolith কাজ করে না।',
                    },
                    {
                        key: 'C',
                        text: 'কারণ monolith কাজ করে না',
                        isCorrect: false,
                        explanation:
                            'Monolith কাজ করে — Stack Overflow আজও monolith। Scale এবং team size অনুযায়ী decision নিতে হয়।',
                    },
                    {
                        key: 'D',
                        text: 'Cost কমানোর জন্য',
                        isCorrect: false,
                        explanation:
                            'Microservices এ infrastructure cost সাধারণত বেশি হয়। Operational efficiency এর জন্য ব্যবহার করা হয়, cost কমানোর জন্য না।',
                    },
                ],
            },
            {
                id: 6,
                text: 'CQRS pattern এ Command এবং Query এর পার্থক্য কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Command মানে SQL, Query মানে NoSQL',
                        isCorrect: false,
                        explanation:
                            'Command/Query database technology এর সাথে সম্পর্কিত না।',
                    },
                    {
                        key: 'B',
                        text: 'Command fast, Query slow',
                        isCorrect: false,
                        explanation:
                            'CQRS এর উদ্দেশ্য speed differentiation না — responsibility separation।',
                    },
                    {
                        key: 'C',
                        text: 'Command data change করে (Write), Query data পড়ে (Read)',
                        isCorrect: true,
                        explanation:
                            'CQRS এ Write operations (Create/Update/Delete) Command side এ যায়, Read operations Query side এ যায়। Read এর জন্য optimized cache/replica DB ব্যবহার করা যায়।',
                    },
                    {
                        key: 'D',
                        text: 'Command sync, Query async',
                        isCorrect: false,
                        explanation:
                            'CQRS synchronous/asynchronous execution নির্ধারণ করে না।',
                    },
                ],
            },
            {
                id: 7,
                text: 'একটা Startup এ নতুন product launch করছো। Microservices দিয়ে শুরু করবেন কি?',
                options: [
                    {
                        key: 'A',
                        text: 'না, Monolith দিয়ে শুরু করুন — team ছোট, domain বোঝা যাচ্ছে না এখনো',
                        isCorrect: true,
                        explanation:
                            'Martin Fowler বলেন: "Don\'t start with microservices." শুরুতে domain ভালো না বুঝলে ভুল boundaries তৈরি হবে। Monolith থেকে শুরু করুন, প্রয়োজনে পরে migrate করুন।',
                    },
                    {
                        key: 'B',
                        text: 'হ্যাঁ, সবসময় Microservices best',
                        isCorrect: false,
                        explanation:
                            '"Always Microservices" ভুল approach। Context বুঝে decide করতে হয়।',
                    },
                    {
                        key: 'C',
                        text: 'হ্যাঁ, কারণ Netflix এটা করে',
                        isCorrect: false,
                        explanation:
                            'Netflix ও শুরুতে monolith ছিল। আপনার context Netflix এর মতো না।',
                    },
                    {
                        key: 'D',
                        text: 'না, serverless use করুন',
                        isCorrect: false,
                        explanation:
                            'Serverless একটা ভালো option কিন্তু এটা microservices এর alternative না — এবং startup এ complexity যোগ করতে পারে।',
                    },
                ],
            },
            {
                id: 8,
                text: 'Distributed tracing কেন দরকার?',
                options: [
                    {
                        key: 'A',
                        text: 'Database optimize করতে',
                        isCorrect: false,
                        explanation:
                            'Database optimization আলাদা concern — tracing এর কাজ না।',
                    },
                    {
                        key: 'B',
                        text: 'Code compile করতে',
                        isCorrect: false,
                        explanation:
                            'Tracing runtime এ কাজ করে, compile time এ না।',
                    },
                    {
                        key: 'C',
                        text: 'Server cost কমাতে',
                        isCorrect: false,
                        explanation:
                            'Tracing observability এর জন্য, cost optimization এর জন্য না।',
                    },
                    {
                        key: 'D',
                        text: 'একটা request কোন কোন service এ গেছে এবং কোথায় slow হয়েছে সেটা দেখতে',
                        isCorrect: true,
                        explanation:
                            'Microservices এ একটা request ১০টা service এ যেতে পারে। User complain করলো "slow" — কোন service এ সমস্যা? Jaeger/Zipkin দিয়ে পুরো journey trace করা যায়।',
                    },
                ],
            },
            {
                id: 9,
                text: 'Service Mesh কী কাজ করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Database connection manage করে',
                        isCorrect: false,
                        explanation:
                            'Service Mesh database connection নিয়ে কাজ করে না।',
                    },
                    {
                        key: 'B',
                        text: 'Service-to-service communication, load balancing, security, observability manage করে',
                        isCorrect: true,
                        explanation:
                            'Service Mesh (Istio, Linkerd) প্রতিটা service এর পাশে sidecar proxy রাখে। Service গুলো জানে না কীভাবে communicate হচ্ছে — mesh সব handle করে। mTLS, retries, circuit breaking automatic।',
                    },
                    {
                        key: 'C',
                        text: 'Frontend render করে',
                        isCorrect: false,
                        explanation:
                            'Service Mesh backend infrastructure level এ কাজ করে, frontend rendering এ না।',
                    },
                    {
                        key: 'D',
                        text: 'Container build করে',
                        isCorrect: false,
                        explanation:
                            'Container build Docker করে। Service Mesh runtime networking layer।',
                    },
                ],
            },
            {
                id: 10,
                text: 'একটা e-commerce app design করছো। Payment সম্পন্ন হলে Email notification পাঠাতে হবে। কোন approach সবচেয়ে ভালো?',
                options: [
                    {
                        key: 'A',
                        text: 'Payment service সরাসরি Email service কে HTTP call করবেন',
                        isCorrect: false,
                        explanation:
                            'Direct HTTP call করলেন Payment service Email service এর উপর dependent হয়ে যায়। Email service down থাকলে payment ও fail করবেন।',
                    },
                    {
                        key: 'B',
                        text: 'Payment service এ email sending code লিখবো',
                        isCorrect: false,
                        explanation:
                            'Payment service এ email code লেখা Single Responsibility Principle ভাঙে। Payment service এর কাজ payment process করা, email পাঠানো না।',
                    },
                    {
                        key: 'C',
                        text: 'Payment service একটা "payment.completed" event publish করবেন, Notification service সেটা consume করবেন',
                        isCorrect: true,
                        explanation:
                            'Event-driven approach সবচেয়ে ভালো। Payment service জানে না Notification service আছে কিনা। Event publish করে দিন — যে সে consume করবেন। এটাই microservices এর spirit: loose coupling।',
                    },
                    {
                        key: 'D',
                        text: 'Client side থেকে দুটো আলাদা API call করবো',
                        isCorrect: false,
                        explanation:
                            'Client side থেকে business logic handle করা bad practice। Network issue এ email miss হতে পারে।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'Microservices Design & Analysis',
        time: '২-৩ ঘণ্টা',
        difficulty: 'Junior Level',
        tasks: [
            <span key='1'>
                <strong>Decomposition Exercise:</strong> একটা food delivery app
                (যেমন Pathao Food) কে microservices এ decompose করুন। কমপক্ষে
                ৬টা service চিহ্নিত করুন এবং প্রতিটার responsibility লিখুন।
            </span>,
            <span key='2'>
                <strong>Communication Design:</strong> উপরের services গুলো
                কীভাবে communicate করবেন সেটা design করুন। কোনটা sync
                (REST/gRPC), কোনটা async (Kafka) হবে এবং কেন — সেটা explain
                করুন।
            </span>,
            <span key='3'>
                <strong>Code Reading:</strong> উপরে দেওয়া FastAPI Order
                service এর code পড়ো। যদি Inventory service down থাকে তাহলে কী
                হবে? Error handling কীভাবে improve করবেন?
            </span>,
            <span key='4'>
                <strong>Diagram:</strong> excalidraw.com বা draw.io তে একটা
                Microservices architecture diagram আঁকুন — API Gateway, কমপক্ষে
                ৩টা service, Message Bus, এবং databases সহ।
            </span>,
            <span key='5'>
                <strong>Trade-off Analysis:</strong> আপনার পরিচিত বা কাজ করা
                কোনো project — সেটা Monolith দিয়ে শুরু করা কি ঠিক হবে নাকি
                Microservices? ৫-৭ লাইনে justify করুন।
            </span>,
        ],
        deliverables: [
            <span key='1'>
                Food delivery app decomposition (লিখিত)
            </span>,
            <span key='2'>
                Communication design (sync/async decisions)
            </span>,
            <span key='3'>
                Improved error handling code snippet
            </span>,
            <span key='4'>
                Architecture diagram (screenshot বা file)
            </span>,
            <span key='5'>Personal trade-off analysis</span>,
        ],
    },
    practicalLab: {
        title: 'Hands-On Project Task',
        subtitle: 'Mini E-Commerce Microservices (Docker)',
        steps: [
            {
                title: 'Project structure তৈরি করুন',
                description:
                    'user_service/, product_service/, order_service/, nginx/ folders বানান।',
            },
            {
                title: 'প্রতিটা service এ simple FastAPI app বানান',
                description:
                    'User service: GET /users, POST /users। Product: GET /products। Order: POST /orders (user ও product validate করে)।',
            },
            {
                title: 'Nginx API Gateway configure করুন',
                description:
                    '/api/users → user_service, /api/products → product_service, /api/orders → order_service।',
            },
            {
                title: 'docker-compose.yml লিখুন এবং চালাও',
                description:
                    'docker-compose up --build দিয়ে সব service একসাথে চালাও।',
            },
            {
                title: 'Postman/curl দিয়ে test করুন',
                description:
                    'localhost/api/users, localhost/api/products, localhost/api/orders — তিনটাই কাজ করছে কিনা check করুন।',
            },
            {
                title: 'Bonus: একটা service বন্ধ করুন',
                description:
                    'Product service stop করুন। Order service কীভাবে handle করে? Graceful error দেখুন।',
            },
        ],
        codeBlock: {
            language: 'yaml',
            filename: 'docker-compose.yml',
            code: `version: '3.8'
services:
  api-gateway:
    image: nginx:alpine
    ports: ["80:80"]
    volumes: ["./nginx/nginx.conf:/etc/nginx/nginx.conf"]
    depends_on: [user-service, product-service, order-service]

  user-service:
    build: ./user_service
    ports: ["8000:8000"]
    environment:
      SERVER_NAME: "User-Service"

  product-service:
    build: ./product_service
    ports: ["8001:8001"]
    environment:
      SERVER_NAME: "Product-Service"

  order-service:
    build: ./order_service
    ports: ["8002:8002"]
    environment:
      SERVER_NAME: "Order-Service"
      USER_SERVICE_URL: "http://user-service:8000"
      PRODUCT_SERVICE_URL: "http://product-service:8001"`,
        },
        tip: 'Microservices theory না — practically দেখবেন কীভাবে services আলাদাভাবে চলে, কীভাবে communicate করে, এবং একটা fail হলে কী হয়। এটাই real-world microservices এর foundation।',
    },
};
