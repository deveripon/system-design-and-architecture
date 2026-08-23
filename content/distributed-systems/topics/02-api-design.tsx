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

export const apiDesignContent: TopicData = {
    id: 'api-design',
    sections: [
        {
            id: 'concept',
            subHeader: { index: '001', title: 'Core Concept' },
            title: (
                <SectionTitle>
                    API Design কী এবং কেন Design Matter করে?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                API (Application Programming Interface) হলো দুটো
                                system এর মধ্যে communication এর চুক্তি। ধরুন
                                একটা restaurant এর menu — আপনি menu দেখে order
                                করুন, kitchen কীভাবে বানায় সেটা আপনাকে জানতে
                                হয় না। API ও ঠিক তাই — client কী চাইতে পারে
                                এবং server কী দেবে সেটা define করে।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'API Design কেন গুরুত্বপূর্ণ',
                    content: (
                        <p>
                            ভালো API design মানে developer-friendly,
                            predictable, consistent। খারাপ API মানে confusion,
                            bugs, maintenance nightmare। Twitter এর API v1 থেকে
                            v2 migration developers দের কাঁদিয়েছে। Good design
                            upfront সেই pain বাঁচায়।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='border border-border bg-card/30 p-8 overflow-x-auto'>
                            <svg
                                width='600'
                                height='110'
                                viewBox='0 0 600 110'
                                className='max-w-full'
                            >
                                <rect
                                    x='10'
                                    y='30'
                                    width='100'
                                    height='50'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#cc6b45'
                                />
                                <text
                                    x='60'
                                    y='52'
                                    fill='#cc6b45'
                                    fontFamily='monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    Client
                                </text>
                                <text
                                    x='60'
                                    y='65'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    Browser/App
                                </text>
                                <line
                                    x1='110'
                                    y1='55'
                                    x2='200'
                                    y2='55'
                                    stroke='#cc6b45'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='155'
                                    y='48'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'
                                >
                                    Request
                                </text>
                                <rect
                                    x='200'
                                    y='20'
                                    width='140'
                                    height='70'
                                    rx='4'
                                    fill='rgba(204,107,69,0.1)'
                                    stroke='#cc6b45'
                                    strokeWidth='2'
                                />
                                <text
                                    x='270'
                                    y='48'
                                    fill='#cc6b45'
                                    fontFamily='monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                    fontWeight='700'
                                >
                                    API
                                </text>
                                <text
                                    x='270'
                                    y='64'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    REST / GraphQL
                                </text>
                                <text
                                    x='270'
                                    y='78'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    gRPC / WebSocket
                                </text>
                                <line
                                    x1='340'
                                    y1='55'
                                    x2='420'
                                    y2='55'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='380'
                                    y='48'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'
                                >
                                    Response
                                </text>
                                <rect
                                    x='420'
                                    y='30'
                                    width='150'
                                    height='50'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#10b981'
                                />
                                <text
                                    x='495'
                                    y='52'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='9'
                                    textAnchor='middle'
                                >
                                    Backend Services
                                </text>
                                <text
                                    x='495'
                                    y='65'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    DB, Cache, Queue...
                                </text>
                            </svg>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'rest',
            subHeader: { index: '002', title: 'REST API' },
            title: (
                <SectionTitle>
                    REST — Representational State Transfer
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <p className='text-muted-foreground leading-relaxed mb-10 text-lg'>
                            REST হলো সবচেয়ে popular API style। HTTP methods
                            ব্যবহার করে resources manipulate করে। Stateless,
                            cacheable, uniform interface — এই principles এ কাজ
                            করে।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-6 mt-4'>
                            REST HTTP Methods
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Method', 'Action', 'Example URL', 'Body?'],
                    rows: [
                        [
                            'GET',
                            'Read data',
                            'GET /users/123',
                            <span className='text-red-700 dark:text-red-400'>No</span>,
                        ],
                        [
                            'POST',
                            'Create new',
                            'POST /users',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Yes
                            </span>,
                        ],
                        [
                            'PUT',
                            'Replace full',
                            'PUT /users/123',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Yes
                            </span>,
                        ],
                        [
                            'PATCH',
                            'Partial update',
                            'PATCH /users/123',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Yes
                            </span>,
                        ],
                        [
                            'DELETE',
                            'Delete',
                            'DELETE /users/123',
                            <span className='text-red-700 dark:text-red-400'>No</span>,
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-6 mt-10'>
                            HTTP Status Codes
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Status Code', 'মানে', 'কখন'],
                    rows: [
                        ['200 OK', 'Success', 'GET, PUT, PATCH success'],
                        [
                            '201 Created',
                            'New resource created',
                            'POST success',
                        ],
                        ['400 Bad Request', 'Client error', 'Invalid input'],
                        [
                            '401 Unauthorized',
                            'Auth required',
                            'No/invalid token',
                        ],
                        [
                            '403 Forbidden',
                            'Permission denied',
                            'Valid token but no access',
                        ],
                        [
                            '404 Not Found',
                            'Resource missing',
                            'User/product not exist',
                        ],
                        [
                            '429 Too Many Requests',
                            'Rate limit exceeded',
                            'Too many API calls',
                        ],
                        [
                            '500 Server Error',
                            'Server bug',
                            'Unexpected crash',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'REST Design Rules',
                    content: (
                        <p>
                            Nouns use করুন, verbs না:{' '}
                            <code className='font-mono text-sm bg-card px-1.5 py-0.5 border border-border text-blue-700 dark:text-blue-400'>
                                /users
                            </code>{' '}
                            ভালো,{' '}
                            <code className='font-mono text-sm bg-card px-1.5 py-0.5 border border-border text-blue-700 dark:text-blue-400'>
                                /getUsers
                            </code>{' '}
                            খারাপ। Plural use করুন:{' '}
                            <code className='font-mono text-sm bg-card px-1.5 py-0.5 border border-border text-blue-700 dark:text-blue-400'>
                                /users
                            </code>
                            ,{' '}
                            <code className='font-mono text-sm bg-card px-1.5 py-0.5 border border-border text-blue-700 dark:text-blue-400'>
                                /products
                            </code>
                            । Nesting:{' '}
                            <code className='font-mono text-sm bg-card px-1.5 py-0.5 border border-border text-blue-700 dark:text-blue-400'>
                                /users/123/orders
                            </code>
                            । Versioning:{' '}
                            <code className='font-mono text-sm bg-card px-1.5 py-0.5 border border-border text-blue-700 dark:text-blue-400'>
                                /api/v1/users
                            </code>
                            । HTTP status codes সঠিকভাবে use করুন।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'graphql',
            subHeader: { index: '003', title: 'GraphQL' },
            title: (
                <SectionTitle>
                    GraphQL — Query Language for APIs
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <p className='text-muted-foreground leading-relaxed mb-10 text-lg'>
                            Facebook তৈরি করেছেনে। Client exactly যেটুকু data
                            চায় সেটুকুই request করতে পারে — over-fetching বা
                            under-fetching নেই। একটা endpoint, flexible queries।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                            <div className='p-8 border-r border-border bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-red-500' />
                                    <span className='text-red-700 dark:text-red-400'>
                                        REST Problem
                                    </span>
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    User profile page এ name, avatar দরকার। GET
                                    /users/123 → পুরো object আসে (email, phone,
                                    address সব)। Over-fetching! আবার, posts ও
                                    দরকার হলে আরেকটা request। Under-fetching!
                                </p>
                            </div>
                            <div className='p-8 bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-emerald-500' />
                                    <span className='text-emerald-700 dark:text-emerald-400'>
                                        GraphQL Solution
                                    </span>
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    একটা query তে exactly যা দরকার:{' '}
                                    <code className='font-mono text-xs bg-card px-1 py-0.5 border border-border text-blue-700 dark:text-blue-400'>
                                        {
                                            '{ user(id: 123) { name avatar posts { title } } }'
                                        }
                                    </code>{' '}
                                    — শুধু name, avatar, এবং post titles আসবেন।
                                    একটা request এ সব।
                                </p>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'graphql',
                    filename: 'query.graphql',
                    code: `# REST এ এটার জন্য 3টা API call লাগতো
# GraphQL এ একটাই
query GetUserDashboard {
  user(id: "123") {
    name
    avatar
    posts(first: 5) {
      title
      createdAt
    }
    followers {
      count
    }
  }
}

# Mutation — data change করতে
mutation UpdateProfile($name: String!, $bio: String) {
  updateUser(input: { name: $name, bio: $bio }) {
    id
    name
    updatedAt
  }
}`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: 'GraphQL এর Downside',
                    content: (
                        <p>
                            Caching complex (REST এর মতো URL-based cache কাজ
                            করে না)। N+1 query problem (DataLoader দিয়ে solve
                            করতে হয়)। Simple CRUD apps এ overkill। REST এর মতো
                            HTTP cache/CDN সুবিধা নেই।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'grpc',
            subHeader: { index: '004', title: 'gRPC' },
            title: (
                <SectionTitle>gRPC — High Performance RPC</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <p className='text-muted-foreground leading-relaxed mb-10 text-lg'>
                            Google তৈরি করেছেনে। Protocol Buffers (protobuf) দিয়ে
                            data serialize করে — JSON এর চেয়ে ৫-১০x faster।
                            Strongly typed, code generation, bidirectional
                            streaming। Microservices internal communication এর
                            জন্য ideal।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'protobuf',
                    filename: 'user.proto',
                    code: `// Service definition
syntax = "proto3";

service UserService {
  rpc GetUser (UserRequest) returns (UserResponse);
  rpc ListUsers (ListRequest) returns (stream UserResponse);
}

message UserRequest {
  string user_id = 1;
}

message UserResponse {
  string id = 1;
  string name = 2;
  string email = 3;
  int32  age = 4;
}
// protoc দিয়ে Python/Go/Java/Node code generate হবে`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-6 mt-10'>
                            REST vs GraphQL vs gRPC — তুলনা
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Feature', 'REST', 'GraphQL', 'gRPC'],
                    rows: [
                        [
                            'Protocol',
                            'HTTP/1.1',
                            'HTTP/1.1',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                HTTP/2
                            </span>,
                        ],
                        [
                            'Data Format',
                            'JSON',
                            'JSON',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Binary (Protobuf)
                            </span>,
                        ],
                        [
                            'Performance',
                            <span className='text-yellow-700 dark:text-yellow-400'>Good</span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>Good</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Excellent
                            </span>,
                        ],
                        [
                            'Over-fetching',
                            <span className='text-red-700 dark:text-red-400'>Yes</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                No
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                No (typed)
                            </span>,
                        ],
                        [
                            'Browser Support',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Native
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Native
                            </span>,
                            <span className='text-red-700 dark:text-red-400'>
                                Limited (grpc-web)
                            </span>,
                        ],
                        [
                            'Best For',
                            'Public APIs, CRUD',
                            'Complex data, mobile',
                            'Microservices, low-latency',
                        ],
                        [
                            'Learning Curve',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Easy
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>Medium</span>,
                            <span className='text-red-700 dark:text-red-400'>Hard</span>,
                        ],
                    ],
                },
            ],
        },
        {
            id: 'gateway',
            subHeader: { index: '005', title: 'API Gateway' },
            title: (
                <SectionTitle>
                    API Gateway — Single Entry Point
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <p className='text-muted-foreground leading-relaxed mb-10 text-lg'>
                            Microservices architecture এ ৫০টা service আছে।
                            Client কি ৫০টা আলাদা URL জানবেন? না।{' '}
                            <strong className='text-foreground'>
                                API Gateway
                            </strong>{' '}
                            হলো single entry point — সব requests এখান দিয়ে
                            ঢোকে, Gateway সঠিক service এ route করে।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='border border-border bg-card/30 p-8 overflow-x-auto'>
                            <svg
                                width='640'
                                height='170'
                                viewBox='0 0 640 170'
                                className='max-w-full'
                            >
                                <rect
                                    x='10'
                                    y='65'
                                    width='80'
                                    height='40'
                                    rx='3'
                                    fill='#1a1915'
                                    stroke='#cc6b45'
                                />
                                <text
                                    x='50'
                                    y='85'
                                    fill='#cc6b45'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    Mobile App
                                </text>
                                <rect
                                    x='10'
                                    y='112'
                                    width='80'
                                    height='40'
                                    rx='3'
                                    fill='#1a1915'
                                    stroke='#cc6b45'
                                />
                                <text
                                    x='50'
                                    y='132'
                                    fill='#cc6b45'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    Web Browser
                                </text>
                                <line
                                    x1='90'
                                    y1='85'
                                    x2='160'
                                    y2='95'
                                    stroke='#cc6b45'
                                    strokeWidth='1'
                                />
                                <line
                                    x1='90'
                                    y1='132'
                                    x2='160'
                                    y2='105'
                                    stroke='#cc6b45'
                                    strokeWidth='1'
                                />
                                <rect
                                    x='160'
                                    y='40'
                                    width='130'
                                    height='100'
                                    rx='5'
                                    fill='rgba(234,179,8,0.08)'
                                    stroke='#eab308'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='225'
                                    y='70'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='10'
                                    textAnchor='middle'
                                    fontWeight='700'
                                >
                                    API Gateway
                                </text>
                                <text
                                    x='225'
                                    y='86'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'
                                    textAnchor='middle'
                                >
                                    • Auth/JWT Verify
                                </text>
                                <text
                                    x='225'
                                    y='99'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'
                                    textAnchor='middle'
                                >
                                    • Rate Limiting
                                </text>
                                <text
                                    x='225'
                                    y='112'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'
                                    textAnchor='middle'
                                >
                                    • Request Routing
                                </text>
                                <text
                                    x='225'
                                    y='125'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'
                                    textAnchor='middle'
                                >
                                    • SSL Termination
                                </text>
                                <text
                                    x='225'
                                    y='132'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'
                                    textAnchor='middle'
                                >
                                    • Logging/Monitoring
                                </text>
                                <line
                                    x1='290'
                                    y1='75'
                                    x2='380'
                                    y2='40'
                                    stroke='#10b981'
                                    strokeWidth='1.2'
                                />
                                <line
                                    x1='290'
                                    y1='90'
                                    x2='380'
                                    y2='90'
                                    stroke='#10b981'
                                    strokeWidth='1.2'
                                />
                                <line
                                    x1='290'
                                    y1='105'
                                    x2='380'
                                    y2='140'
                                    stroke='#10b981'
                                    strokeWidth='1.2'
                                />
                                <rect
                                    x='380'
                                    y='22'
                                    width='120'
                                    height='30'
                                    rx='3'
                                    fill='#1a1915'
                                    stroke='#10b981'
                                />
                                <text
                                    x='440'
                                    y='40'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    User Service
                                </text>
                                <rect
                                    x='380'
                                    y='75'
                                    width='120'
                                    height='30'
                                    rx='3'
                                    fill='#1a1915'
                                    stroke='#10b981'
                                />
                                <text
                                    x='440'
                                    y='93'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    Order Service
                                </text>
                                <rect
                                    x='380'
                                    y='128'
                                    width='120'
                                    height='30'
                                    rx='3'
                                    fill='#1a1915'
                                    stroke='#10b981'
                                />
                                <text
                                    x='440'
                                    y='146'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    textAnchor='middle'
                                >
                                    Payment Service
                                </text>
                            </svg>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'API Gateway Features',
                    content: (
                        <p>
                            <strong>Authentication:</strong> JWT token verify
                            করে, backend services কে auth চিন্তা করতে হয় না।{' '}
                            <strong>Rate Limiting:</strong> প্রতি user/IP কতটা
                            request করতে পারবেন limit করে।{' '}
                            <strong>Request Transformation:</strong>{' '}
                            Request/response format modify করতে পারে।{' '}
                            <strong>Circuit Breaking:</strong> Backend service
                            fail হলে fast-fail করে। Popular tools: AWS API
                            Gateway, Kong, Nginx, Traefik।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'code',
            subHeader: { index: '006', title: 'Code Examples' },
            title: <SectionTitle>Code Examples</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-6'>
                            Node.js — REST API with Express
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'rest_api.js',
                    code: `const express = require('express');
const app = express();
app.use(express.json());

// GET /api/v1/users/:id
app.get('/api/v1/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({
      error: 'User not found', code: 'USER_NOT_FOUND'
    });
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/users — create user
app.post('/api/v1/users', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email) return res.status(400).json({
    error: 'name and email required'
  });
  const user = await User.create({ name, email, password });
  res.status(201).json({ data: user });
});

// PATCH /api/v1/users/:id — partial update
app.patch('/api/v1/users/:id', async (req, res) => {
  const updated = await User.findByIdAndUpdate(
    req.params.id, req.body, { new: true }
  );
  res.json({ data: updated });
});`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-6 mt-10'>
                            Rate Limiting Middleware
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'rateLimit.js',
                    code: `const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

// API Rate limit: 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,
  standardHeaders: true,
  store: new RedisStore({ client: redisClient }),
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.ceil(res.getHeader('Retry-After'))
    });
  }
});

app.use('/api/', apiLimiter);`,
                },
            ],
        },
        {
            id: 'interview',
            subHeader: { index: '007', title: 'Interview Prep' },
            title: (
                <SectionTitle>
                    Interview Preparation — Common Questions
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q1: REST vs GraphQL কখন ব্যবহার করবেন?',
                    content: (
                        <p>
                            <strong>উত্তর:</strong> &quot;Better&quot; নির্ভর
                            করে use case এ। REST — simple CRUD, public API,
                            caching important। GraphQL — complex data
                            requirements, mobile app (bandwidth sensitive),
                            multiple clients different data চাই। Interview এ
                            দুটোর trade-off বলুন।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q2: Rate Limiting কীভাবে implement করবেন?',
                    content: (
                        <p>
                            <strong>উত্তর:</strong> Token Bucket বা Sliding
                            Window algorithm ব্যবহার করি। Redis এ per-user
                            counter রাখি। Express এ{' '}
                            <code className='font-mono text-sm bg-card px-1.5 py-0.5 border border-border text-blue-700 dark:text-blue-400'>
                                express-rate-limit
                            </code>{' '}
                            + RedisStore। Limit exceed হলে 429 Too Many Requests
                            return করি, Retry-After header সহ। API Gateway
                            level এ (Kong/AWS) করলেন service কে বিরক্ত করতে হয়
                            না।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q3: API versioning কীভাবে করবেন?',
                    content: (
                        <p>
                            <strong>উত্তর:</strong> ৩টা approach: URL
                            versioning (
                            <code className='font-mono text-sm bg-card px-1.5 py-0.5 border border-border text-blue-700 dark:text-blue-400'>
                                /api/v1/
                            </code>{' '}
                            → সবচেয়ে common, visible)। Header versioning (
                            <code className='font-mono text-sm bg-card px-1.5 py-0.5 border border-border text-blue-700 dark:text-blue-400'>
                                Accept: application/vnd.api+json;version=1
                            </code>{' '}
                            → cleaner URLs)। Query param (
                            <code className='font-mono text-sm bg-card px-1.5 py-0.5 border border-border text-blue-700 dark:text-blue-400'>
                                ?version=1
                            </code>{' '}
                            → easy but messy)। URL versioning সবচেয়ে popular
                            কারণ explicit এবং debuggable।
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
                <span className='font-bold text-primary'>REST</span>,
                'HTTP methods + nouns. Stateless, cacheable, widely supported',
            ],
            [
                <span className='font-bold text-primary'>GraphQL</span>,
                'Client decides what data it needs. No over/under-fetching',
            ],
            [
                <span className='font-bold text-primary'>gRPC</span>,
                'Binary, fast, typed. Internal microservices এর জন্য best',
            ],
            [
                <span className='font-bold text-primary'>API Gateway</span>,
                'Single entry point. Auth, rate limit, routing centralized',
            ],
            [
                <span className='font-bold text-primary'>Rate Limiting</span>,
                'Abuse prevent করুন, 429 Too Many Requests দিন',
            ],
            [
                <span className='font-bold text-primary'>Status Codes</span>,
                '2xx success, 4xx client error, 5xx server error',
            ],
            [
                <span className='font-bold text-primary'>
                    API Versioning
                </span>,
                'URL path versioning (/api/v1/) সবচেয়ে popular এবং explicit',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'REST API তে নতুন resource create করতে কোন HTTP method use করবেন?',
                options: [
                    {
                        key: 'A',
                        text: 'GET',
                        isCorrect: false,
                        explanation:
                            'GET শুধু data read করে, create করে না।',
                    },
                    {
                        key: 'B',
                        text: 'POST',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর: B — POST নতুন resource create করে এবং 201 Created return করে। PUT পুরো resource replace করে (existing হলে)। PATCH partial update।',
                    },
                    {
                        key: 'C',
                        text: 'PUT',
                        isCorrect: false,
                        explanation:
                            'PUT পুরো resource replace করে, নতুন create করে না।',
                    },
                    {
                        key: 'D',
                        text: 'PATCH',
                        isCorrect: false,
                        explanation:
                            'PATCH partial update করে, নতুন resource create করে না।',
                    },
                ],
            },
            {
                id: 2,
                text: 'GraphQL এর সবচেয়ে বড় advantage REST এর উপর কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Faster than REST',
                        isCorrect: false,
                        explanation:
                            'GraphQL necessarily faster না — এটার primary benefit data flexibility।',
                    },
                    {
                        key: 'B',
                        text: 'Better security',
                        isCorrect: false,
                        explanation:
                            'GraphQL এর security REST থেকে inherently better না।',
                    },
                    {
                        key: 'C',
                        text: 'Client exactly যেটুকু data চায় সেটুকুই request করতে পারে — no over/under-fetching',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর: C — GraphQL এর core benefit হলো flexible queries। Client ঠিক করে কোন fields দরকার। এতে over-fetching (extra data) এবং under-fetching (multiple requests) দুটোই avoid হয়।',
                    },
                    {
                        key: 'D',
                        text: 'Easier to implement',
                        isCorrect: false,
                        explanation:
                            'GraphQL implement করা REST এর চেয়ে সাধারণত বেশি complex।',
                    },
                ],
            },
            {
                id: 3,
                text: 'HTTP 401 vs 403 — পার্থক্য কী?',
                options: [
                    {
                        key: 'A',
                        text: 'দুটো একই — authentication error',
                        isCorrect: false,
                        explanation:
                            'দুটো আলাদা — 401 authentication, 403 authorization।',
                    },
                    {
                        key: 'B',
                        text: '401 server error, 403 client error',
                        isCorrect: false,
                        explanation:
                            'দুটোই client error (4xx range)।',
                    },
                    {
                        key: 'C',
                        text: '401 more severe than 403',
                        isCorrect: false,
                        explanation:
                            'Severity এর ব্যাপার না — দুটোর meaning আলাদা।',
                    },
                    {
                        key: 'D',
                        text: '401 = unauthenticated (login করুননি), 403 = unauthorized (login করেছেনো কিন্তু permission নেই)',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর: D — 401: Token নেই বা invalid। "Who are you?" 403: Token valid কিন্তু এই resource access করার permission নেই। "I know you, but you can\'t enter here."',
                    },
                ],
            },
            {
                id: 4,
                text: 'API Gateway এর primary কাজ কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Single entry point হিসেবে কাজ করে, auth, rate limiting, routing করে',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর: A — API Gateway microservices architecture এর front door। সব requests এখান দিয়ে যায়। Auth verify করে, rate limit check করে, সঠিক service এ route করে।',
                    },
                    {
                        key: 'B',
                        text: 'Database connection manage করে',
                        isCorrect: false,
                        explanation:
                            'Database connection manage করা API Gateway এর কাজ না।',
                    },
                    {
                        key: 'C',
                        text: 'Frontend code serve করে',
                        isCorrect: false,
                        explanation:
                            'Frontend serving CDN বা static file server করে।',
                    },
                    {
                        key: 'D',
                        text: 'Message queue manage করে',
                        isCorrect: false,
                        explanation:
                            'Message queue আলাদা component (RabbitMQ, Kafka)।',
                    },
                ],
            },
            {
                id: 5,
                text: 'gRPC কোন data format ব্যবহার করে?',
                options: [
                    {
                        key: 'A',
                        text: 'JSON',
                        isCorrect: false,
                        explanation:
                            'JSON REST এবং GraphQL এর format। gRPC binary format ব্যবহার করে।',
                    },
                    {
                        key: 'B',
                        text: 'Protocol Buffers (Protobuf) — Binary',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর: B — gRPC Protocol Buffers (protobuf) ব্যবহার করে। Binary format বলে JSON এর চেয়ে ৫-১০x smaller এবং faster serialize/deserialize হয়। Strongly typed schema।',
                    },
                    {
                        key: 'C',
                        text: 'XML',
                        isCorrect: false,
                        explanation:
                            'XML SOAP API তে ব্যবহার হয়, gRPC তে না।',
                    },
                    {
                        key: 'D',
                        text: 'YAML',
                        isCorrect: false,
                        explanation:
                            'YAML configuration files এ ব্যবহার হয়, API data format হিসেবে না।',
                    },
                ],
            },
            {
                id: 6,
                text: 'REST API versioning এর সবচেয়ে popular approach কোনটা?',
                options: [
                    {
                        key: 'A',
                        text: 'Query parameter: /users?version=2',
                        isCorrect: false,
                        explanation:
                            'Query param versioning কাজ করে কিন্তু messy এবং popular না।',
                    },
                    {
                        key: 'B',
                        text: 'Header: Accept-Version: v2',
                        isCorrect: false,
                        explanation:
                            'Header versioning cleaner URLs দেয় কিন্তু less visible।',
                    },
                    {
                        key: 'C',
                        text: 'URL path: /api/v2/users',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর: C — URL path versioning (/api/v1/, /api/v2/) সবচেয়ে common। Explicit, visible, easy to debug, browser friendly। Twitter, Stripe, GitHub সবাই এটা use করে।',
                    },
                    {
                        key: 'D',
                        text: 'Subdomain: v2.api.example.com',
                        isCorrect: false,
                        explanation:
                            'Subdomain versioning uncommon এবং DNS management complex করে।',
                    },
                ],
            },
            {
                id: 7,
                text: 'REST এ /getUsers endpoint বানানো কেন ভালো practice নয়?',
                options: [
                    {
                        key: 'A',
                        text: 'Get method এ capital letter ব্যবহার করা যায় না',
                        isCorrect: false,
                        explanation:
                            'Capital letter URL এ allowed, এটা issue না।',
                    },
                    {
                        key: 'B',
                        text: 'URL এ underscore ব্যবহার করা যায় না',
                        isCorrect: false,
                        explanation:
                            'Underscore URL এ allowed, এটা মূল সমস্যা না।',
                    },
                    {
                        key: 'C',
                        text: 'Too long URL',
                        isCorrect: false,
                        explanation: 'URL length এখানে issue না।',
                    },
                    {
                        key: 'D',
                        text: 'REST এ URL এ verbs নয়, nouns use করা উচিত। সঠিক: GET /users',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর: D — REST best practice হলো URL এ nouns (resources): /users, /products, /orders। Action/verb টা HTTP method দিয়ে express করুন: GET (read), POST (create), DELETE (remove)।',
                    },
                ],
            },
            {
                id: 8,
                text: 'Rate Limiting কী করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Per user/IP request limit করে — abuse এবং DDoS থেকে protect করে',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর: A — Rate Limiting প্রতি user বা IP কে নির্দিষ্ট সময়ে নির্দিষ্ট requests করতে দেয়। Excess হলে 429 Too Many Requests। Abuse prevention, DDoS protection, fair usage নিশ্চিত করে।',
                    },
                    {
                        key: 'B',
                        text: 'API response slow করে দেয়',
                        isCorrect: false,
                        explanation:
                            'Rate Limiting response slow করে না, বরং excess requests block করে।',
                    },
                    {
                        key: 'C',
                        text: 'Database query কমায়',
                        isCorrect: false,
                        explanation:
                            'Database query কমানো caching এর কাজ।',
                    },
                    {
                        key: 'D',
                        text: 'Large responses reject করে',
                        isCorrect: false,
                        explanation:
                            'Large response reject করা rate limiting এর কাজ না।',
                    },
                ],
            },
            {
                id: 9,
                text: 'Mobile app এর জন্য কোন API style সবচেয়ে efficient?',
                options: [
                    {
                        key: 'A',
                        text: 'REST — সবচেয়ে popular',
                        isCorrect: false,
                        explanation:
                            'REST popular কিন্তু mobile এ over-fetching bandwidth waste করে।',
                    },
                    {
                        key: 'B',
                        text: 'gRPC — fastest',
                        isCorrect: false,
                        explanation:
                            'gRPC browser support limited, mobile এ direct use কঠিন।',
                    },
                    {
                        key: 'C',
                        text: 'GraphQL — client exactly needed data request করতে পারে, bandwidth save হয়',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর: C — Mobile এ bandwidth valuable। GraphQL এ client শুধু দরকারী fields request করে — over-fetching নেই। আর একটা query তে nested data পানয়া যায় — multiple round trips নেই।',
                    },
                    {
                        key: 'D',
                        text: 'SOAP — most reliable',
                        isCorrect: false,
                        explanation:
                            'SOAP legacy technology, modern mobile apps এ ব্যবহার হয় না।',
                    },
                ],
            },
            {
                id: 10,
                text: 'একটা fintech startup এর internal microservices communication এর জন্য কোনটা সবচেয়ে suitable?',
                options: [
                    {
                        key: 'A',
                        text: 'REST — সবচেয়ে familiar',
                        isCorrect: false,
                        explanation:
                            'REST familiar কিন্তু internal microservices এ gRPC এর performance advantage আছে।',
                    },
                    {
                        key: 'B',
                        text: 'gRPC — high performance, strongly typed, internal services এর জন্য ideal',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর: B — Internal microservices communication এ gRPC excellent: binary protocol (fast), strongly typed contract (safe), HTTP/2 (multiplexing), code generation (less boilerplate)। Browser থেকে call করতে হয় না বলে browser limitation relevant না।',
                    },
                    {
                        key: 'C',
                        text: 'GraphQL — flexible queries',
                        isCorrect: false,
                        explanation:
                            'GraphQL internal service-to-service communication এর জন্য designed না।',
                    },
                    {
                        key: 'D',
                        text: 'WebSocket — real-time',
                        isCorrect: false,
                        explanation:
                            'WebSocket real-time bidirectional communication এর জন্য, general microservices RPC এর জন্য না।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'API Design & Implementation',
        time: '২-৩ ঘণ্টা',
        difficulty: 'Junior Level',
        tasks: [
            <span key='1'>
                <strong>API Design করুন:</strong> একটা Blog platform এর REST API
                design করুন। Endpoints define করুন: posts (CRUD), comments (CRUD),
                users (CRUD), likes। Proper HTTP methods, status codes, URL
                structure use করুন।
            </span>,
            <span key='2'>
                <strong>REST vs GraphQL Analysis:</strong> Instagram এর
                &quot;User Profile&quot; page এ দরকার: username, avatar, posts
                count, followers count, latest 9 posts (thumbnail only)। REST এ
                কতটা API call লাগবে? GraphQL এ কীভাবে একটাতেই হবে? লিখুন।
            </span>,
            <span key='3'>
                <strong>Status Code Practice:</strong> নিচের ৮টা scenario তে
                সঠিক HTTP status code বলুন: (ক) Login successful (খ) Wrong
                password (গ) Admin-only page, regular user access করলেন (ঘ)
                Product ID 9999 নেই (ঙ) Server database connection failed (চ)
                New order created (ছ) Rate limit exceeded (জ) Request body এ
                required field নেই।
            </span>,
            <span key='4'>
                <strong>API Gateway Design:</strong> একটা E-commerce এর API
                Gateway design করুন। কোন routes কোন service এ যাবেন? Auth কোথায়
                check হবে? Rate limit কীভাবে apply হবে? Diagram বানান।
            </span>,
            <span key='5'>
                <strong>Code:</strong> উপরে দেওয়া Express.js REST API starter
                code extend করুন: DELETE endpoint add করুন, input validation add
                করুন (name minimum 2 chars, valid email), proper error messages
                return করুন।
            </span>,
        ],
        deliverables: [
            <span key='1'>
                Blog API endpoint list (HTTP method + URL + description)
            </span>,
            <span key='2'>
                REST vs GraphQL comparison for Instagram
            </span>,
            <span key='3'>HTTP status code answers (৮টা)</span>,
            <span key='4'>API Gateway architecture diagram</span>,
            <span key='5'>Extended Express.js code</span>,
        ],
    },
    practicalLab: {
        title: 'Hands-On Project Task',
        subtitle: 'Full REST API with Auth & Rate Limiting',
        steps: [
            {
                title: 'Setup করুন',
                description: (
                    <>
                        <code className='font-mono text-xs bg-card px-1.5 py-0.5 border border-border text-blue-700 dark:text-blue-400'>
                            npm install express jsonwebtoken bcrypt
                            express-rate-limit
                        </code>
                    </>
                ),
            },
            {
                title: 'Auth endpoints',
                description:
                    'POST /auth/register (bcrypt password hash), POST /auth/login (JWT token return)।',
            },
            {
                title: 'Protected Todo CRUD',
                description:
                    'GET/POST/PATCH/DELETE /todos — JWT middleware দিয়ে protect করুন। শুধু owner তার নিজের todos দেখতে পারবেন।',
            },
            {
                title: 'Rate Limiting যোগ করুন',
                description:
                    'Login endpoint এ 5 requests per minute limit। General API তে 100 requests per 15 minutes।',
            },
            {
                title: 'Postman দিয়ে test করুন',
                description:
                    'সব endpoints test করুন। Rate limit test করুন — ৬ বার rapid login করুন।',
            },
        ],
        tip: 'JWT authentication implement করবেন। REST best practices follow করবেন। Rate limiting practically দেখবেন। এটা portfolio তে রাখার মতো project।',
    },
};
