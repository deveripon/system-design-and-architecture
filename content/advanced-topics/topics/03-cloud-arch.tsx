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

export const cloudArchContent: TopicData = {
    id: 'cloud-arch',
    sections: [
        {
            id: 'why-cloud',
            subHeader: { index: '001', title: 'Why Cloud?' },
            title: (
                <SectionTitle>
                    Cloud কেন বদলে দিল সব কিছু?
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
                                    ☁️ Cloud Architecture
                                </span>
                                <span className='font-mono text-xs px-3 py-1 border border-orange-400/30 text-orange-700 dark:text-orange-400 bg-orange-400/5 rounded'>
                                    🔧 Advanced
                                </span>
                                <span className='font-mono text-xs px-3 py-1 border border-purple-400/30 text-purple-700 dark:text-purple-400 bg-purple-400/5 rounded'>
                                    TOPIC 03 / Phase 5
                                </span>
                            </div>
                            <ContentParagraph>
                                ২০০০-এর দশকের শুরুতে একটা startup শুরু করতে হলে
                                প্রথমে{' '}
                                <strong className='text-foreground'>
                                    physical server কিনতে হতো
                                </strong>
                                , data center rent করতে হতো, network configure
                                করতে হতো — software লেখার আগেই লাখ টাকা খরচ। Cloud
                                এই reality সম্পূর্ণ বদলে দিয়েছে।
                            </ContentParagraph>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                                <div className='bg-muted/30 border border-border rounded-lg p-5'>
                                    <p className='font-mono text-xs uppercase tracking-widest text-red-700 dark:text-red-400 mb-4'>
                                        ❌ Before Cloud — On-Premise
                                    </p>
                                    <ul className='space-y-2'>
                                        {[
                                            'Hardware কিনতে ৩-৬ মাস lead time',
                                            'Peak load-এর জন্য over-provision করতে হতো',
                                            'Hardware failure = downtime',
                                            'Capacity planning ভুল হলে ক্ষতি',
                                            'Global expansion = নতুন data center',
                                            'Ops team সার্বক্ষণিক রাখতে হতো',
                                            'CapEx (Capital Expenditure) বিশাল',
                                        ].map((item, i) => (
                                            <li
                                                key={i}
                                                className='text-sm text-muted-foreground flex items-start gap-2 py-1 border-b border-border last:border-0'>
                                                <span className='text-red-700 dark:text-red-400 mt-0.5'>
                                                    →
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className='bg-muted/30 border border-border rounded-lg p-5'>
                                    <p className='font-mono text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-4'>
                                        ✅ After Cloud — AWS / GCP / Azure
                                    </p>
                                    <ul className='space-y-2'>
                                        {[
                                            'Minutes-এ server spin up করুন',
                                            'Traffic বাড়লে auto-scale করুন',
                                            'AWS manages hardware failures',
                                            'Pay only what you use (OpEx)',
                                            '20+ global regions available',
                                            'Managed services (RDS, SQS, Lambda)',
                                            'Focus on product, not infrastructure',
                                        ].map((item, i) => (
                                            <li
                                                key={i}
                                                className='text-sm text-muted-foreground flex items-start gap-2 py-1 border-b border-border last:border-0'>
                                                <span className='text-emerald-700 dark:text-emerald-400 mt-0.5'>
                                                    →
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 Cloud এর ৩টা Model — IaaS, PaaS, SaaS',
                    content: (
                        <div className='space-y-3'>
                            <p>
                                <strong>IaaS (Infrastructure as a Service):</strong>{' '}
                                Raw infrastructure ভাড়া দেয়। আপনি OS, runtime,
                                application সব manage করুন। Example:{' '}
                                <strong>AWS EC2, GCP Compute Engine, Azure VM</strong>।
                                সবচেয়ে বেশি control, সবচেয়ে বেশি responsibility।
                            </p>
                            <p>
                                <strong>PaaS (Platform as a Service):</strong>{' '}
                                Platform দেয় — আপনি শুধু code deploy করুন।
                                OS, runtime, scaling সব managed। Example:{' '}
                                <strong>
                                    AWS Elastic Beanstalk, Heroku, Google App Engine
                                </strong>
                                । Developer productivity বেশি, কিন্তু কম control।
                            </p>
                            <p>
                                <strong>SaaS (Software as a Service):</strong>{' '}
                                Complete software subscription হিসেবে। কোনো
                                infrastructure manage করতে হয় না। Example:{' '}
                                <strong>Gmail, Slack, Salesforce, GitHub</strong>।
                                End-user software — just use it।
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Model', 'আপনি manage করুন', 'Provider manage করে', 'Example'],
                    rows: [
                        [
                            <span className='font-mono font-bold text-primary'>
                                IaaS
                            </span>,
                            'OS, Runtime, App, Data',
                            'Virtualization, Network, Storage, Hardware',
                            'EC2, Azure VM',
                        ],
                        [
                            <span className='font-mono font-bold text-orange-700 dark:text-orange-400'>
                                PaaS
                            </span>,
                            'App, Data',
                            'OS, Runtime, Middleware, Infra',
                            'Heroku, Beanstalk',
                        ],
                        [
                            <span className='font-mono font-bold text-emerald-700 dark:text-emerald-400'>
                                SaaS
                            </span>,
                            'শুধু use করুন',
                            'সব কিছু',
                            'Gmail, Slack',
                        ],
                    ],
                },
            ],
        },
        {
            id: 'aws-core',
            subHeader: { index: '002', title: 'AWS Core Services' },
            title: (
                <SectionTitle>
                    AWS Core Services — System Design View
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            AWS-এ ২০০+ services আছে। System design-এর জন্য মূল
                            services জানলেনই চলে। প্রতিটা service একটা specific
                            problem solve করে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                AWS Architecture — Core Services Overview
                            </p>
                            <svg
                                viewBox='0 0 720 380'
                                className='w-full max-w-3xl mx-auto'>
                                <defs>
                                    <marker
                                        id='arrA'
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
                                        id='arrAC'
                                        markerWidth='8'
                                        markerHeight='8'
                                        refX='6'
                                        refY='3'
                                        orient='auto'>
                                        <path
                                            d='M0,0 L0,6 L8,3 z'
                                            fill='#06b6d4'
                                        />
                                    </marker>
                                    <marker
                                        id='arrAG'
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
                                </defs>
                                {/* VPC boundary */}
                                <rect
                                    x='10'
                                    y='60'
                                    width='700'
                                    height='290'
                                    rx='8'
                                    fill='transparent'
                                    stroke='#1e3a5f'
                                    strokeWidth='2'
                                    strokeDasharray='6,3'
                                />
                                <text
                                    x='20'
                                    y='55'
                                    fill='#334155'
                                    fontFamily='monospace'
                                    fontSize='10'
                                    fontWeight='bold'>
                                    VPC — Virtual Private Cloud
                                </text>
                                {/* Internet / User */}
                                <rect
                                    x='300'
                                    y='8'
                                    width='120'
                                    height='40'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#64748b'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='360'
                                    y='24'
                                    textAnchor='middle'
                                    fill='#94a3b8'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    INTERNET
                                </text>
                                <text
                                    x='360'
                                    y='38'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Users / Clients
                                </text>
                                {/* CloudFront */}
                                <rect
                                    x='190'
                                    y='80'
                                    width='100'
                                    height='50'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#f97316'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='240'
                                    y='101'
                                    textAnchor='middle'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    CloudFront
                                </text>
                                <text
                                    x='240'
                                    y='115'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    CDN / Edge
                                </text>
                                {/* Route53 */}
                                <rect
                                    x='430'
                                    y='80'
                                    width='100'
                                    height='50'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#f97316'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='480'
                                    y='101'
                                    textAnchor='middle'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    Route 53
                                </text>
                                <text
                                    x='480'
                                    y='115'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    DNS / Routing
                                </text>
                                {/* EC2 */}
                                <rect
                                    x='80'
                                    y='175'
                                    width='110'
                                    height='55'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#06b6d4'
                                    strokeWidth='2'
                                />
                                <text
                                    x='135'
                                    y='197'
                                    textAnchor='middle'
                                    fill='#06b6d4'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    EC2
                                </text>
                                <text
                                    x='135'
                                    y='211'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Compute / Servers
                                </text>
                                <text
                                    x='135'
                                    y='222'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Auto Scaling Group
                                </text>
                                {/* Lambda */}
                                <rect
                                    x='220'
                                    y='175'
                                    width='110'
                                    height='55'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='275'
                                    y='197'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    Lambda
                                </text>
                                <text
                                    x='275'
                                    y='211'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Serverless / FaaS
                                </text>
                                <text
                                    x='275'
                                    y='222'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Event-driven
                                </text>
                                {/* RDS */}
                                <rect
                                    x='80'
                                    y='275'
                                    width='110'
                                    height='55'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='135'
                                    y='297'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    RDS
                                </text>
                                <text
                                    x='135'
                                    y='311'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Managed SQL DB
                                </text>
                                <text
                                    x='135'
                                    y='322'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    MySQL / Postgres
                                </text>
                                {/* S3 */}
                                <rect
                                    x='220'
                                    y='275'
                                    width='110'
                                    height='55'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#eab308'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='275'
                                    y='297'
                                    textAnchor='middle'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    S3
                                </text>
                                <text
                                    x='275'
                                    y='311'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Object Storage
                                </text>
                                <text
                                    x='275'
                                    y='322'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Unlimited scale
                                </text>
                                {/* SQS */}
                                <rect
                                    x='390'
                                    y='175'
                                    width='110'
                                    height='55'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#ec4899'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='445'
                                    y='197'
                                    textAnchor='middle'
                                    fill='#ec4899'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    SQS
                                </text>
                                <text
                                    x='445'
                                    y='211'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Message Queue
                                </text>
                                <text
                                    x='445'
                                    y='222'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Async decoupling
                                </text>
                                {/* DynamoDB */}
                                <rect
                                    x='530'
                                    y='175'
                                    width='110'
                                    height='55'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='585'
                                    y='197'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    DynamoDB
                                </text>
                                <text
                                    x='585'
                                    y='211'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    NoSQL / Key-Value
                                </text>
                                <text
                                    x='585'
                                    y='222'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Serverless DB
                                </text>
                                {/* ElastiCache */}
                                <rect
                                    x='390'
                                    y='275'
                                    width='110'
                                    height='55'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#ef4444'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='445'
                                    y='297'
                                    textAnchor='middle'
                                    fill='#ef4444'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    ElastiCache
                                </text>
                                <text
                                    x='445'
                                    y='311'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Redis / Memcached
                                </text>
                                <text
                                    x='445'
                                    y='322'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    In-memory cache
                                </text>
                                {/* Arrows */}
                                <path
                                    d='M 360 48 L 260 80'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arrA)'
                                />
                                <path
                                    d='M 360 48 L 460 80'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arrA)'
                                />
                                <path
                                    d='M 240 130 L 200 175'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arrA)'
                                />
                                <path
                                    d='M 260 130 L 275 175'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arrA)'
                                />
                                <path
                                    d='M 480 130 L 445 175'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arrA)'
                                />
                                <path
                                    d='M 480 130 L 560 175'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arrA)'
                                />
                                <path
                                    d='M 135 230 L 135 275'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arrA)'
                                />
                                <path
                                    d='M 275 230 L 275 275'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arrA)'
                                />
                                <path
                                    d='M 445 230 L 445 275'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arrA)'
                                />
                                {/* Footer */}
                                <text
                                    x='20'
                                    y='360'
                                    fill='#475569'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Public Subnet: EC2, Lambda, Load Balancer |
                                    Private Subnet: RDS, ElastiCache, DynamoDB
                                </text>
                            </svg>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Category', 'AWS Service', 'Use Case'],
                    rows: [
                        [
                            <span className='font-mono font-bold text-primary'>
                                Compute
                            </span>,
                            'EC2 / Lambda / ECS / EKS',
                            'Server, serverless function, container, Kubernetes',
                        ],
                        [
                            <span className='font-mono font-bold text-eab308'>
                                Storage
                            </span>,
                            'S3 / EBS / EFS',
                            'Object storage, block disk (EC2), shared file system',
                        ],
                        [
                            <span className='font-mono font-bold text-emerald-700 dark:text-emerald-400'>
                                Database
                            </span>,
                            'RDS / DynamoDB / ElastiCache',
                            'Managed SQL, NoSQL key-value, in-memory cache',
                        ],
                        [
                            <span className='font-mono font-bold text-orange-700 dark:text-orange-400'>
                                Network
                            </span>,
                            'VPC / CloudFront / Route53',
                            'Isolated network, CDN edge caching, DNS routing',
                        ],
                        [
                            <span className='font-mono font-bold text-pink-700 dark:text-pink-400'>
                                Queue/Event
                            </span>,
                            'SQS / SNS / EventBridge',
                            'Message queue, pub/sub notification, event bus',
                        ],
                        [
                            <span className='font-mono font-bold text-purple-700 dark:text-purple-400'>
                                Security
                            </span>,
                            'IAM / KMS / WAF',
                            'Identity management, encryption keys, firewall',
                        ],
                    ],
                },
            ],
        },
        {
            id: 'serverless',
            subHeader: { index: '003', title: 'Serverless Architecture' },
            title: (
                <SectionTitle>
                    Serverless Architecture — Lambda &amp; FaaS
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-4'>
                            <ContentParagraph>
                                <strong className='text-foreground'>
                                    Serverless
                                </strong>{' '}
                                মানে server নেই এমন না — মানে আপনি server manage
                                করুন না। AWS Lambda হলো সবচেয়ে popular FaaS
                                (Function as a Service)। আপনি শুধু function লিখুন,
                                AWS execution, scaling, patching সব করে।
                            </ContentParagraph>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                                {[
                                    {
                                        icon: '⚡',
                                        title: 'Event-driven',
                                        desc: 'HTTP request, S3 upload, SQS message, scheduled cron — যেকোনো event-এ trigger হয়',
                                        color: 'border-purple-500/30 text-purple-700 dark:text-purple-400',
                                    },
                                    {
                                        icon: '💰',
                                        title: 'Pay-per-use',
                                        desc: 'Function run করলেন তখনই charge। Idle থাকলে কোনো cost নেই। 1M free invocations/month',
                                        color: 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400',
                                    },
                                    {
                                        icon: '📈',
                                        title: 'Auto-scaling',
                                        desc: 'Concurrent invocations automatically scale। 1 request বা 1M request — same code',
                                        color: 'border-primary/30 text-primary',
                                    },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className={`bg-muted/30 border rounded-lg p-4 ${item.color}`}>
                                        <p className='text-lg mb-2'>
                                            {item.icon}
                                        </p>
                                        <p className='font-mono text-sm font-bold mb-2'>
                                            {item.title}
                                        </p>
                                        <p className='text-xs text-muted-foreground leading-relaxed'>
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'lambda_function.py — AWS Lambda Example',
                    code: `import json
import boto3

# AWS Lambda function — API Gateway থেকে triggered
def lambda_handler(event, context):
    """
    event: API Gateway request (HTTP method, path, body, headers)
    context: Lambda runtime info (timeout, memory, request_id)
    """

    http_method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    body = json.loads(event.get('body') or '{}')

    # DynamoDB client (Lambda-র IAM role থেকে auto-auth)
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('users')

    if http_method == 'POST' and path == '/users':
        # User create করুন
        user_id = body.get('user_id')
        name = body.get('name')

        table.put_item(Item={
            'user_id': user_id,
            'name': name,
            'created_at': str(__import__('datetime').datetime.utcnow())
        })

        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'message': 'User created', 'user_id': user_id})
        }

    elif http_method == 'GET' and path.startswith('/users/'):
        # User fetch করুন
        user_id = path.split('/')[-1]
        response = table.get_item(Key={'user_id': user_id})
        user = response.get('Item')

        if not user:
            return {'statusCode': 404, 'body': json.dumps({'error': 'Not found'})}

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps(user)
        }

    return {'statusCode': 400, 'body': json.dumps({'error': 'Bad request'})}

# Lambda-র সুবিধা:
# - Server manage করতে হয় না
# - Auto-scale (0 to 10000+ concurrent)
# - Pay only for execution time (100ms billing)
# - Max execution: 15 minutes, Max memory: 10GB`,
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    steps: [
                        {
                            number: '01',
                            title: 'Client — HTTP Request',
                            description:
                                'User app থেকে POST /api/users request আসে। DNS Route53-এ hit করে API Gateway-র endpoint resolve করে।',
                        },
                        {
                            number: '02',
                            title: 'API Gateway — Request Validation',
                            description:
                                'API Gateway request receive করে। Auth check (JWT/API key), rate limiting, request validation করে। Valid হলে Lambda invoke করে।',
                        },
                        {
                            number: '03',
                            title: 'AWS Lambda — Cold/Warm Start',
                            description:
                                'Lambda container spin up করে (cold start ~100-500ms) অথবা existing warm container reuse করে। Function execute হয়।',
                        },
                        {
                            number: '04',
                            title: 'DynamoDB — Data Persist',
                            description:
                                'Lambda DynamoDB-তে data write করে। IAM role automatically authentication handle করে। Serverless DB — no connection pool management।',
                        },
                        {
                            number: '05',
                            title: 'Response — API Gateway → Client',
                            description:
                                'Lambda response (statusCode, body) API Gateway-তে return করে। API Gateway HTTP response format করে client-এ পাঠায়।',
                        },
                    ],
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Feature', 'Serverless (Lambda)', 'Containers (ECS)', 'VMs (EC2)'],
                    rows: [
                        [
                            'Cost Model',
                            <span className='text-emerald-700 dark:text-emerald-400'>
                                Pay per request
                            </span>,
                            'Pay per container runtime',
                            'Pay per hour (even idle)',
                        ],
                        [
                            'Cold Start',
                            <span className='text-red-700 dark:text-red-400'>
                                100ms - 2s (issue)
                            </span>,
                            'Seconds (pre-warmed)',
                            'Minutes (rare)',
                        ],
                        [
                            'Scaling',
                            <span className='text-emerald-700 dark:text-emerald-400'>
                                Instant auto-scale
                            </span>,
                            'Minutes (ECS task)',
                            'Minutes (new EC2)',
                        ],
                        [
                            'Ops Overhead',
                            <span className='text-emerald-700 dark:text-emerald-400'>
                                Near zero
                            </span>,
                            'Medium (Dockerfile)',
                            <span className='text-red-700 dark:text-red-400'>
                                High (OS patches)
                            </span>,
                        ],
                        [
                            'Max Runtime',
                            '15 minutes',
                            'Unlimited',
                            'Unlimited',
                        ],
                        [
                            'Best For',
                            'Event processing, APIs',
                            'Long-running services',
                            'Legacy apps, full control',
                        ],
                    ],
                },
            ],
        },
        {
            id: 'iac-terraform',
            subHeader: { index: '004', title: 'Infrastructure as Code' },
            title: (
                <SectionTitle>
                    Infrastructure as Code — Terraform
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-4'>
                            <ContentParagraph>
                                Manual clicks দিয়ে AWS console-এ infrastructure
                                তৈরি করলেন{' '}
                                <strong className='text-foreground'>
                                    reproducibility নেই
                                </strong>
                                , version control নেই, team collaboration কঠিন।{' '}
                                <strong className='text-foreground'>
                                    Terraform
                                </strong>{' '}
                                দিয়ে infrastructure code হিসেবে define করলেন এই
                                সব সমস্যা solve হয়।
                            </ContentParagraph>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='bg-muted/30 border border-red-500/20 rounded-lg p-4'>
                                    <p className='font-mono text-xs text-red-700 dark:text-red-400 uppercase tracking-widest mb-3'>
                                        ❌ Manual Setup — Problems
                                    </p>
                                    <ul className='space-y-1.5 text-sm text-muted-foreground'>
                                        {[
                                            'Staging ≠ Production (drift)',
                                            'কে কী change করেছেনে — জানা নেই',
                                            'Disaster recovery কঠিন',
                                            'New region setup = manual redo',
                                            'Security misconfiguration সহজ',
                                        ].map((item, i) => (
                                            <li key={i} className='flex gap-2'>
                                                <span className='text-red-700 dark:text-red-400'>
                                                    ✗
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className='bg-muted/30 border border-emerald-500/20 rounded-lg p-4'>
                                    <p className='font-mono text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-3'>
                                        ✅ Terraform IaC — Benefits
                                    </p>
                                    <ul className='space-y-1.5 text-sm text-muted-foreground'>
                                        {[
                                            'Code = infrastructure (git versioned)',
                                            'terraform plan = preview changes',
                                            'Reproducible environments',
                                            'Multi-region = variable swap',
                                            'PR review = infra review',
                                        ].map((item, i) => (
                                            <li key={i} className='flex gap-2'>
                                                <span className='text-emerald-700 dark:text-emerald-400'>
                                                    ✓
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'hcl',
                    filename: 'main.tf — VPC + EC2 + RDS',
                    code: `# Provider configuration
provider "aws" {
  region = var.aws_region  # "ap-southeast-1" for Singapore
}

# ============================================================
# VPC — Isolated Network
# ============================================================
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "\${var.project_name}-vpc"
    Environment = var.environment
  }
}

# Public subnet (EC2, Load Balancer)
resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.\${count.index}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = { Name = "\${var.project_name}-public-\${count.index}" }
}

# Private subnet (RDS, ElastiCache)
resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.\${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = { Name = "\${var.project_name}-private-\${count.index}" }
}

# ============================================================
# EC2 — Application Server (Auto Scaling Group)
# ============================================================
resource "aws_launch_template" "app" {
  name_prefix   = "\${var.project_name}-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type  # "t3.medium"

  vpc_security_group_ids = [aws_security_group.app.id]

  user_data = base64encode(<<-EOF
    #!/bin/bash
    yum update -y
    yum install -y docker
    systemctl start docker
    docker run -d -p 80:8080 \${var.app_image}
  EOF
  )

  tag_specifications {
    resource_type = "instance"
    tags = { Name = "\${var.project_name}-app" }
  }
}

resource "aws_autoscaling_group" "app" {
  name                = "\${var.project_name}-asg"
  desired_capacity    = var.desired_capacity
  min_size            = var.min_capacity
  max_size            = var.max_capacity
  vpc_zone_identifier = aws_subnet.public[*].id

  launch_template {
    id      = aws_launch_template.app.id
    version = "\$Latest"
  }
}

# ============================================================
# RDS — Managed PostgreSQL
# ============================================================
resource "aws_db_subnet_group" "main" {
  name       = "\${var.project_name}-db-subnet"
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_db_instance" "postgres" {
  identifier           = "\${var.project_name}-db"
  engine               = "postgres"
  engine_version       = "15.3"
  instance_class       = "db.t3.medium"
  allocated_storage    = 100
  storage_encrypted    = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password  # Use AWS Secrets Manager in production!

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.db.id]

  multi_az            = true   # High availability — 2 AZ
  skip_final_snapshot = false
  deletion_protection = true

  tags = { Name = "\${var.project_name}-postgres" }
}

# Output: RDS endpoint (app config-এ use করুন)
output "db_endpoint" {
  value     = aws_db_instance.postgres.endpoint
  sensitive = true
}`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Terraform State Management — S3 Backend',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                Terraform একটা{' '}
                                <strong>state file (terraform.tfstate)</strong>{' '}
                                maintain করে — current infrastructure-এর snapshot।
                                Local machine-এ রাখলে team collaboration সমস্যা হয়।
                            </p>
                            <p>
                                <strong>Production solution:</strong> S3 backend
                                use করুন। State S3-এ store হয়, DynamoDB-তে locking
                                থাকে যেন দুজন একসাথে apply না করতে পারে:
                            </p>
                            <pre className='bg-background border border-border rounded p-3 text-xs font-mono text-muted-foreground mt-2'>
{`terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "ap-southeast-1"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}`}
                            </pre>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'multi-region',
            subHeader: { index: '005', title: 'Multi-Region Architecture' },
            title: (
                <SectionTitle>
                    Multi-Region Architecture
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Single region-এ থাকলে region outage হলে সব down হয়ে
                            যায়। Multi-region architecture দিয়ে{' '}
                            <strong className='text-foreground'>
                                higher availability
                            </strong>{' '}
                            এবং{' '}
                            <strong className='text-foreground'>
                                lower latency
                            </strong>{' '}
                            globally achieve করা যায়।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Feature', 'Active-Active', 'Active-Passive'],
                    rows: [
                        [
                            'Traffic Handling',
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>
                                সব regions live traffic serve করে
                            </span>,
                            'Primary region serve করে, secondary standby',
                        ],
                        [
                            'Failover Time',
                            <span className='text-emerald-700 dark:text-emerald-400'>
                                Instant (no failover needed)
                            </span>,
                            'Minutes (DNS TTL + failover)',
                        ],
                        [
                            'Cost',
                            <span className='text-red-700 dark:text-red-400'>
                                বেশি (দুটো full setup)
                            </span>,
                            'কম (secondary idle/minimal)',
                        ],
                        [
                            'Consistency',
                            <span className='text-red-700 dark:text-red-400'>
                                Complex — conflict resolution দরকার
                            </span>,
                            'Simpler — one write region',
                        ],
                        [
                            'Use Case',
                            'Global apps, low latency worldwide',
                            'DR (Disaster Recovery), compliance',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                Multi-Region Architecture — Active-Active
                            </p>
                            <svg
                                viewBox='0 0 680 300'
                                className='w-full max-w-2xl mx-auto'>
                                <defs>
                                    <marker
                                        id='arrMR'
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
                                        id='arrMRC'
                                        markerWidth='8'
                                        markerHeight='8'
                                        refX='6'
                                        refY='3'
                                        orient='auto'>
                                        <path
                                            d='M0,0 L0,6 L8,3 z'
                                            fill='#06b6d4'
                                        />
                                    </marker>
                                    <marker
                                        id='arrMRP'
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
                                {/* Route53 */}
                                <rect
                                    x='270'
                                    y='10'
                                    width='140'
                                    height='50'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#f97316'
                                    strokeWidth='2'
                                />
                                <text
                                    x='340'
                                    y='30'
                                    textAnchor='middle'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='10'
                                    fontWeight='bold'>
                                    Route 53
                                </text>
                                <text
                                    x='340'
                                    y='45'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Latency-based routing
                                </text>
                                {/* US-East Region */}
                                <rect
                                    x='30'
                                    y='100'
                                    width='180'
                                    height='160'
                                    rx='6'
                                    fill='transparent'
                                    stroke='#06b6d4'
                                    strokeWidth='1.5'
                                    strokeDasharray='4,2'
                                />
                                <text
                                    x='120'
                                    y='120'
                                    textAnchor='middle'
                                    fill='#06b6d4'
                                    fontFamily='monospace'
                                    fontSize='9'
                                    fontWeight='bold'>
                                    us-east-1
                                </text>
                                <rect
                                    x='50'
                                    y='130'
                                    width='140'
                                    height='35'
                                    rx='3'
                                    fill='transparent'
                                    stroke='#06b6d4'
                                    strokeWidth='1'
                                />
                                <text
                                    x='120'
                                    y='151'
                                    textAnchor='middle'
                                    fill='#94a3b8'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    EC2 (Auto Scaling)
                                </text>
                                <rect
                                    x='50'
                                    y='175'
                                    width='140'
                                    height='35'
                                    rx='3'
                                    fill='transparent'
                                    stroke='#10b981'
                                    strokeWidth='1'
                                />
                                <text
                                    x='120'
                                    y='196'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    RDS Primary
                                </text>
                                <rect
                                    x='50'
                                    y='220'
                                    width='140'
                                    height='28'
                                    rx='3'
                                    fill='transparent'
                                    stroke='#eab308'
                                    strokeWidth='1'
                                />
                                <text
                                    x='120'
                                    y='238'
                                    textAnchor='middle'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    S3 (Global bucket)
                                </text>
                                {/* AP-Southeast Region */}
                                <rect
                                    x='470'
                                    y='100'
                                    width='180'
                                    height='160'
                                    rx='6'
                                    fill='transparent'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                    strokeDasharray='4,2'
                                />
                                <text
                                    x='560'
                                    y='120'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='9'
                                    fontWeight='bold'>
                                    ap-southeast-1
                                </text>
                                <rect
                                    x='490'
                                    y='130'
                                    width='140'
                                    height='35'
                                    rx='3'
                                    fill='transparent'
                                    stroke='#8b5cf6'
                                    strokeWidth='1'
                                />
                                <text
                                    x='560'
                                    y='151'
                                    textAnchor='middle'
                                    fill='#94a3b8'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    EC2 (Auto Scaling)
                                </text>
                                <rect
                                    x='490'
                                    y='175'
                                    width='140'
                                    height='35'
                                    rx='3'
                                    fill='transparent'
                                    stroke='#10b981'
                                    strokeWidth='1'
                                />
                                <text
                                    x='560'
                                    y='196'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    RDS Read Replica
                                </text>
                                <rect
                                    x='490'
                                    y='220'
                                    width='140'
                                    height='28'
                                    rx='3'
                                    fill='transparent'
                                    stroke='#eab308'
                                    strokeWidth='1'
                                />
                                <text
                                    x='560'
                                    y='238'
                                    textAnchor='middle'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    S3 (Replicated)
                                </text>
                                {/* Route53 to regions */}
                                <path
                                    d='M 305 60 L 180 100'
                                    stroke='#06b6d4'
                                    strokeWidth='1.5'
                                    markerEnd='url(#arrMRC)'
                                />
                                <path
                                    d='M 375 60 L 510 100'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                    markerEnd='url(#arrMRP)'
                                />
                                {/* Cross-region replication */}
                                <path
                                    d='M 210 192 L 490 192'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                    strokeDasharray='5,3'
                                    markerEnd='url(#arrMR)'
                                />
                                <text
                                    x='340'
                                    y='185'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    DB Replication
                                </text>
                                {/* Labels */}
                                <text
                                    x='80'
                                    y='280'
                                    fill='#06b6d4'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    US users routed here
                                </text>
                                <text
                                    x='470'
                                    y='280'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Asia users routed here
                                </text>
                            </svg>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: '⚠️ Multi-Region এর Challenges',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>Data Sovereignty:</strong> কিছু দেশে
                                (Germany, India) user data দেশের বাইরে store করা
                                যায় না (GDPR, DPDP Act)। Multi-region design-এ
                                data residency compliance আগে verify করতে হবে।
                            </p>
                            <p>
                                <strong>Consistency Challenge:</strong> দুটো region-এ
                                একই data লিখলে conflict হতে পারে। Last-write-wins,
                                CRDT, বা single primary write region strategy choose
                                করতে হবে। CAP theorem-এ Partition tolerance নিশ্চিত
                                করতে হয়।
                            </p>
                            <p>
                                <strong>Latency Trade-off:</strong> Cross-region
                                replication-এ{' '}
                                <strong>asynchronous replication</strong> করলেন
                                RPO (Recovery Point Objective) কয়েক সেকেন্ড।
                                Synchronous হলে write latency বাড়ে।
                            </p>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'cost-optimization',
            subHeader: { index: '006', title: 'Cost Optimization' },
            title: (
                <SectionTitle>
                    Cloud Cost Optimization
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Cloud-এর সবচেয়ে বড় ভুল হলো{' '}
                            <strong className='text-foreground'>
                                cost optimize না করা
                            </strong>
                            । নতুন startups AWS bill দেখে চমকে যায়। সঠিক instance
                            type এবং pricing model বেছে নিলে{' '}
                            <strong className='text-foreground'>
                                ৫০-৭০% cost কমানো
                            </strong>{' '}
                            সম্ভব।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Pricing Model', 'Cost', 'Commitment', 'Best For'],
                    rows: [
                        [
                            <span className='font-mono font-bold text-red-700 dark:text-red-400'>
                                On-Demand
                            </span>,
                            'সবচেয়ে বেশি (baseline)',
                            'কোনো commitment নেই',
                            'Unpredictable, short-term workloads',
                        ],
                        [
                            <span className='font-mono font-bold text-emerald-700 dark:text-emerald-400'>
                                Reserved
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400'>
                                ৪০-৬০% সস্তা
                            </span>,
                            '1 or 3 year commitment',
                            'Steady-state production workloads',
                        ],
                        [
                            <span className='font-mono font-bold text-primary'>
                                Savings Plans
                            </span>,
                            <span className='text-primary'>
                                ৪০-৬৬% সস্তা
                            </span>,
                            '1 or 3 year (flexible)',
                            'Lambda, Fargate, EC2 — flexible',
                        ],
                        [
                            <span className='font-mono font-bold text-yellow-700 dark:text-yellow-400'>
                                Spot Instances
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>
                                ৭০-৯০% সস্তা
                            </span>,
                            'Interruptible (2-min notice)',
                            'Batch jobs, ML training, fault-tolerant',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-5 space-y-4'>
                            <p className='font-mono text-xs uppercase tracking-widest text-muted-foreground'>
                                Auto Scaling Strategy — Cost vs Performance
                            </p>
                            <div className='space-y-3'>
                                {[
                                    {
                                        label: 'Target Tracking',
                                        color: 'text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
                                        desc: 'CPU 60% target রাখুন। Traffic বাড়লে instance add, কমলে remove। Simplest approach।',
                                    },
                                    {
                                        label: 'Scheduled Scaling',
                                        color: 'text-primary border-primary/20',
                                        desc: 'Office hour-এ 10 instances, রাতে 2 instances। Predictable patterns-এ effective।',
                                    },
                                    {
                                        label: 'Step Scaling',
                                        color: 'text-orange-700 dark:text-orange-400 border-orange-400/20',
                                        desc: 'CPU 70% = +2 instances, CPU 90% = +5 instances। Graduated response।',
                                    },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className={`border rounded p-3 ${item.color}`}>
                                        <p className='font-mono text-xs font-bold mb-1'>
                                            {item.label}
                                        </p>
                                        <p className='text-xs text-muted-foreground'>
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'hcl',
                    filename: 'autoscaling.tf — Auto Scaling Policy',
                    code: `# Target Tracking Auto Scaling Policy
resource "aws_autoscaling_policy" "cpu_target" {
  name                   = "\${var.project_name}-cpu-target"
  autoscaling_group_name = aws_autoscaling_group.app.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    # CPU 60% target — over = scale out, under = scale in
    target_value = 60.0

    # Scale in cool-down: 300s (5 min) — sudden traffic drop-এ overreact না
    # Scale out cool-down: 60s (1 min) — traffic spike দ্রুত handle
    disable_scale_in = false
  }
}

# Scheduled Scaling — Office hours (predictable load)
resource "aws_autoscaling_schedule" "scale_up_morning" {
  scheduled_action_name  = "scale-up-morning"
  autoscaling_group_name = aws_autoscaling_group.app.name

  # Mon-Fri 9 AM UTC+6 = 3 AM UTC
  recurrence       = "0 3 * * MON-FRI"
  desired_capacity = 10
  min_size         = 5
  max_size         = 50
}

resource "aws_autoscaling_schedule" "scale_down_night" {
  scheduled_action_name  = "scale-down-night"
  autoscaling_group_name = aws_autoscaling_group.app.name

  # 11 PM UTC+6 = 5 PM UTC
  recurrence       = "0 17 * * MON-FRI"
  desired_capacity = 2
  min_size         = 2
  max_size         = 10
}

# CloudWatch Alarm — High CPU alert
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "\${var.project_name}-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 60
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "EC2 CPU over 80%"

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.app.name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]  # SNS → PagerDuty / Slack
}`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '🎯 Cost Monitoring — AWS Cost Explorer',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>AWS Cost Explorer</strong> দিয়ে daily/monthly
                                spend visualize করুন। Service-wise breakdown দেখুন —
                                কোন service সবচেয়ে বেশি charge করছে।
                            </p>
                            <p>
                                <strong>AWS Budgets:</strong> Monthly budget set করুন।
                                80% বা 100% reach করলেন email/SMS alert। Surprise bill
                                এড়ানোর সবচেয়ে সহজ উপায়।
                            </p>
                            <p>
                                <strong>Cost Anomaly Detection:</strong> Machine
                                learning দিয়ে unusual spend detect করে। কোনো
                                runaway process বা misconfiguration আগেই alert করে।
                            </p>
                            <p>
                                <strong>Quick wins:</strong> S3 Intelligent-Tiering
                                on, unused EBS volumes delete করুন, old snapshots clean
                                করুন, NAT Gateway traffic optimize করুন।
                            </p>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'cloud-patterns',
            subHeader: { index: '007', title: 'Cloud-Native Patterns' },
            title: (
                <SectionTitle>
                    Cloud-Native Design Patterns
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Cloud-native application design-এ কিছু proven patterns
                            আছে যা resilience, scalability, এবং maintainability
                            নিশ্চিত করে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    steps: [
                        {
                            number: '01',
                            title: 'Circuit Breaker Pattern',
                            description:
                                'Downstream service fail হলে বারবার retry করলেন cascade failure হয়। Circuit Breaker failure count track করে। Threshold পার হলে circuit "open" করে — সাথে সাথে fallback return করে। Timeout পর "half-open" state-এ test করে। Service recover হলে circuit "closed" করে।',
                        },
                        {
                            number: '02',
                            title: 'Retry with Exponential Backoff',
                            description:
                                'Transient failure-এ (network hiccup, throttling) retry করুন। কিন্তু immediate retry আবার overwhelm করতে পারে। Exponential backoff: 1s, 2s, 4s, 8s... + jitter (random delay) যেন সব clients একসাথে retry না করে।',
                        },
                        {
                            number: '03',
                            title: 'Bulkhead Pattern',
                            description:
                                'Ship-এর bulkhead যেমন hull breach isolate করে, software bulkhead resource pool isolate করে। Payment service-এর thread pool আলাদা রাখুন যেন user service slow হলে payment affect না হয়। AWS-এ: separate Lambda concurrency limits, separate SQS queues।',
                        },
                        {
                            number: '04',
                            title: 'Sidecar Pattern (Service Mesh)',
                            description:
                                'Application container-এর পাশে একটা sidecar proxy container চলে (Envoy)। Service discovery, load balancing, mTLS, circuit breaking — সব sidecar handle করে। App code একদম clean থাকে। Istio এই pattern use করে Kubernetes-এ।',
                        },
                    ],
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-5'>
                            <p className='font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4'>
                                12-Factor App Principles (Cloud-Native Foundation)
                            </p>
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                                {[
                                    {
                                        num: '1',
                                        title: 'Codebase',
                                        desc: 'One codebase, tracked in VCS',
                                    },
                                    {
                                        num: '2',
                                        title: 'Dependencies',
                                        desc: 'Explicitly declare & isolate',
                                    },
                                    {
                                        num: '3',
                                        title: 'Config',
                                        desc: 'Store in environment (not code)',
                                    },
                                    {
                                        num: '4',
                                        title: 'Backing Services',
                                        desc: 'Treat as attached resources',
                                    },
                                    {
                                        num: '5',
                                        title: 'Build/Release/Run',
                                        desc: 'Strictly separate stages',
                                    },
                                    {
                                        num: '6',
                                        title: 'Processes',
                                        desc: 'Stateless, share-nothing',
                                    },
                                    {
                                        num: '7',
                                        title: 'Port Binding',
                                        desc: 'Export services via port',
                                    },
                                    {
                                        num: '8',
                                        title: 'Concurrency',
                                        desc: 'Scale via process model',
                                    },
                                    {
                                        num: '9',
                                        title: 'Disposability',
                                        desc: 'Fast startup, graceful shutdown',
                                    },
                                    {
                                        num: '10',
                                        title: 'Dev/Prod Parity',
                                        desc: 'Keep environments similar',
                                    },
                                    {
                                        num: '11',
                                        title: 'Logs',
                                        desc: 'Treat as event streams',
                                    },
                                    {
                                        num: '12',
                                        title: 'Admin Processes',
                                        desc: 'Run as one-off processes',
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.num}
                                        className='bg-background border border-border rounded p-3'>
                                        <p className='font-mono text-xs text-primary font-bold mb-1'>
                                            {item.num}. {item.title}
                                        </p>
                                        <p className='text-xs text-muted-foreground'>
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'yaml',
                    filename: 'envoy-sidecar.yaml — Sidecar Pattern (Kubernetes)',
                    code: `# Kubernetes Pod-এ Application + Envoy Sidecar
apiVersion: v1
kind: Pod
metadata:
  name: payment-service
  labels:
    app: payment
    version: v1
spec:
  containers:
    # ─── Main Application Container ───────────────────────────────
    - name: payment-app
      image: myregistry/payment-service:latest
      ports:
        - containerPort: 8080
      env:
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: payment-secrets
              key: db-host
      # App code শুধু business logic — networking concern নেই

    # ─── Envoy Sidecar Proxy (Service Mesh) ──────────────────────
    - name: envoy-proxy
      image: envoyproxy/envoy:v1.28
      ports:
        - containerPort: 9901   # Admin port
        - containerPort: 15001  # Outbound proxy
        - containerPort: 15006  # Inbound proxy
      # Sidecar এর দায়িত্ব:
      # ✓ mTLS (mutual TLS) — service-to-service encryption
      # ✓ Circuit breaking — downstream failure isolation
      # ✓ Retry + timeout — configurable per-route
      # ✓ Load balancing — across upstream pods
      # ✓ Observability — metrics, traces automatically
      volumeMounts:
        - name: envoy-config
          mountPath: /etc/envoy

  volumes:
    - name: envoy-config
      configMap:
        name: envoy-config

# Istio আপনার সব pods-এ automatically এই sidecar inject করে
# আপনার app code change করতে হয় না!`,
                },
            ],
        },
        {
            id: 'interview-tips',
            subHeader: { index: '008', title: 'Interview Tips' },
            title: (
                <SectionTitle>
                    Cloud Architecture Interview Tips
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            System design interview-এ cloud নিয়ে জিজ্ঞেস করলেন
                            সঠিক service choose করাটা important। কোন situation-এ
                            কোন AWS service use করবেন — এটা clearly বলতে পারলেন
                            interviewer impress হবে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Scenario', 'Choose This', 'কেন?'],
                    rows: [
                        [
                            'Short, event-driven function (&lt; 15 min)',
                            <span className='font-mono font-bold text-purple-700 dark:text-purple-400'>
                                Lambda
                            </span>,
                            'Serverless, pay-per-use, zero ops',
                        ],
                        [
                            'Long-running containerized service',
                            <span className='font-mono font-bold text-primary'>
                                ECS / EKS
                            </span>,
                            'Docker containers, managed orchestration',
                        ],
                        [
                            'Traditional VM, full OS control',
                            <span className='font-mono font-bold text-emerald-700 dark:text-emerald-400'>
                                EC2
                            </span>,
                            'IaaS, any workload, legacy app',
                        ],
                        [
                            'Managed SQL database',
                            <span className='font-mono font-bold text-emerald-700 dark:text-emerald-400'>
                                RDS / Aurora
                            </span>,
                            'PostgreSQL/MySQL managed, Multi-AZ',
                        ],
                        [
                            'Key-value NoSQL, massive scale',
                            <span className='font-mono font-bold text-emerald-700 dark:text-emerald-400'>
                                DynamoDB
                            </span>,
                            'Serverless DB, single-digit ms, unlimited scale',
                        ],
                        [
                            'In-memory caching layer',
                            <span className='font-mono font-bold text-red-700 dark:text-red-400'>
                                ElastiCache (Redis)
                            </span>,
                            'Microsecond reads, session store, rate limiting',
                        ],
                        [
                            'Async task queue / decoupling',
                            <span className='font-mono font-bold text-pink-700 dark:text-pink-400'>
                                SQS
                            </span>,
                            'At-least-once delivery, decouple services',
                        ],
                        [
                            'Pub/sub fan-out notification',
                            <span className='font-mono font-bold text-orange-700 dark:text-orange-400'>
                                SNS
                            </span>,
                            'Topic → multiple subscribers simultaneously',
                        ],
                        [
                            'Static files / media / backups',
                            <span className='font-mono font-bold text-yellow-700 dark:text-yellow-400'>
                                S3
                            </span>,
                            'Unlimited object storage, 99.999999999% durability',
                        ],
                        [
                            'Global CDN / edge caching',
                            <span className='font-mono font-bold text-orange-700 dark:text-orange-400'>
                                CloudFront
                            </span>,
                            '450+ PoP worldwide, reduces origin load',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-5 space-y-4'>
                            <p className='font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3'>
                                Common Cloud Architecture Patterns — Interview Scenarios
                            </p>
                            <div className='space-y-3'>
                                {[
                                    {
                                        scenario: 'E-commerce checkout surge',
                                        solution:
                                            'SQS queue + Lambda consumer। Checkout request → SQS। Lambda asynchronously process করে। Queue absorbs burst traffic। Database overwhelm হয় না।',
                                        services: ['SQS', 'Lambda', 'RDS'],
                                        color: 'border-purple-500/20 text-purple-700 dark:text-purple-400',
                                    },
                                    {
                                        scenario: 'Image upload + resize',
                                        solution:
                                            'S3 PUT → S3 Event Notification → Lambda trigger। Lambda image resize করে processed/ folder-এ save করে। CloudFront দিয়ে serve।',
                                        services: ['S3', 'Lambda', 'CloudFront'],
                                        color: 'border-orange-400/20 text-orange-700 dark:text-orange-400',
                                    },
                                    {
                                        scenario: 'Microservices communication',
                                        solution:
                                            'Synchronous: API Gateway + Lambda/ECS। Asynchronous: EventBridge/SNS fan-out। Service mesh: ECS + App Mesh (Envoy)।',
                                        services: ['API GW', 'EventBridge', 'App Mesh'],
                                        color: 'border-emerald-500/20 text-emerald-700 dark:text-emerald-400',
                                    },
                                    {
                                        scenario: 'Multi-region disaster recovery',
                                        solution:
                                            'Route53 health check + failover routing। Primary region down → automatic DNS failover to secondary। RDS read replica promote করুন। RPO: minutes, RTO: minutes।',
                                        services: ['Route53', 'RDS', 'S3 Replication'],
                                        color: 'border-primary/20 text-primary',
                                    },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className={`border rounded-lg p-4 ${item.color}`}>
                                        <p className='font-mono text-xs font-bold mb-2'>
                                            Scenario: {item.scenario}
                                        </p>
                                        <p className='text-sm text-muted-foreground mb-3 leading-relaxed'>
                                            {item.solution}
                                        </p>
                                        <div className='flex flex-wrap gap-1.5'>
                                            {item.services.map((s, j) => (
                                                <span
                                                    key={j}
                                                    className='font-mono text-xs px-2 py-0.5 bg-background border border-border rounded'>
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 System Design Interview-এ Cloud নিয়ে কথা বলার উপায়',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>1) Service choice justify করুন:</strong>{' '}
                                শুধু &quot;S3 use করব&quot; বলুন না — বলুন
                                &quot;Object storage-এর জন্য S3 use করব কারণ
                                unlimited scale, 11 nine durability, এবং CloudFront
                                integration।&quot;
                            </p>
                            <p>
                                <strong>2) Managed vs Self-managed trade-off:</strong>{' '}
                                RDS vs self-hosted PostgreSQL on EC2 — RDS বেশি
                                expensive কিন্তু automated backups, Multi-AZ,
                                patching। Ops team ছোট হলে RDS worth it।
                            </p>
                            <p>
                                <strong>3) Cost awareness দেখাও:</strong>{' '}
                                On-demand vs Reserved instance বলুন। Spot instance
                                কখন viable সেটা বলুন। Cost-conscious architect
                                valuable।
                            </p>
                            <p>
                                <strong>4) Security layer mention করুন:</strong>{' '}
                                IAM roles for services, VPC private subnets for
                                databases, KMS encryption at rest, WAF for API
                                protection।
                            </p>
                            <p>
                                <strong>5) Avoid cloud-specific lock-in concern:</strong>{' '}
                                Interviewer জিজ্ঞেস করতে পারে vendor lock-in নিয়ে।
                                বলুন: abstraction layer (Terraform, Kubernetes) use
                                করলেন migration easier।
                            </p>
                        </div>
                    ),
                },
            ],
        },
    ],
    summary: {
        headers: [
            'Topic',
            'Key Concept',
            'AWS Service',
            'Interview Point',
        ],
        rows: [
            [
                <span className='font-bold text-primary font-mono'>
                    Cloud Models
                </span>,
                'IaaS / PaaS / SaaS — control vs abstraction tradeoff',
                'EC2 / Beanstalk / Gmail',
                'Model সঠিকভাবে explain করতে পারা',
            ],
            [
                <span className='font-bold text-purple-700 dark:text-purple-400 font-mono'>
                    Serverless
                </span>,
                'Event-driven, pay-per-use, no server management',
                'Lambda + API Gateway + DynamoDB',
                'Cold start limitation জানা জরুরি',
            ],
            [
                <span className='font-bold text-emerald-700 dark:text-emerald-400 font-mono'>
                    IaC
                </span>,
                'Infrastructure = code, reproducible, version controlled',
                'Terraform + S3 state backend',
                'terraform plan/apply workflow জানেন',
            ],
            [
                <span className='font-bold text-orange-700 dark:text-orange-400 font-mono'>
                    Multi-Region
                </span>,
                'Active-Active vs Active-Passive, data sovereignty',
                'Route53 + RDS Replica + S3 Replication',
                'Consistency challenge বলতে পারা',
            ],
            [
                <span className='font-bold text-yellow-700 dark:text-yellow-400 font-mono'>
                    Cost
                </span>,
                'On-Demand vs Reserved vs Spot instances',
                'Cost Explorer + Budgets + Auto Scaling',
                'Spot instance use case — batch/ML',
            ],
            [
                <span className='font-bold text-pink-700 dark:text-pink-400 font-mono'>
                    Patterns
                </span>,
                'Circuit Breaker, Bulkhead, Sidecar, 12-Factor',
                'SQS + Lambda + Envoy/Istio',
                'Resilience patterns confident ভাবে বলা',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'IaaS এবং PaaS এর পার্থক্য কী?',
                options: [
                    {
                        key: 'a',
                        text: 'IaaS = raw infrastructure ভাড়া, PaaS = platform managed (OS/runtime provider-এ)',
                        isCorrect: true,
                        explanation:
                            'সঠিক। IaaS (EC2): আপনি OS, runtime, app সব manage করুন — শুধু hardware virtualized। PaaS (Heroku, Beanstalk): আপনি শুধু app code deploy করুন, বাকি সব provider manage করে। IaaS = বেশি control কিন্তু বেশি responsibility। PaaS = কম control কিন্তু productivity বেশি।',
                    },
                    {
                        key: 'b',
                        text: 'IaaS = সফটওয়্যার সার্ভিস, PaaS = hardware service',
                        isCorrect: false,
                        explanation:
                            'উল্টো। SaaS = software service, IaaS = infrastructure service।',
                    },
                    {
                        key: 'c',
                        text: 'কোনো পার্থক্য নেই — একই জিনিস',
                        isCorrect: false,
                        explanation:
                            'পার্থক্য আছে — IaaS আর PaaS এর abstraction level আলাদা।',
                    },
                    {
                        key: 'd',
                        text: 'IaaS = free, PaaS = paid',
                        isCorrect: false,
                        explanation:
                            'Pricing model এই definition নয়। দুটোই paid service।',
                    },
                ],
            },
            {
                id: 2,
                text: 'AWS Lambda তে কোন limitation সবচেয়ে গুরুত্বপূর্ণ?',
                options: [
                    {
                        key: 'a',
                        text: 'শুধু Python support করে',
                        isCorrect: false,
                        explanation:
                            'Lambda Python, Node.js, Java, Go, Ruby, .NET — অনেক language support করে।',
                    },
                    {
                        key: 'b',
                        text: 'Cold start latency — first invocation-এ container spin-up time',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Cold start হলো সবচেয়ে important limitation। নতুন execution environment তৈরি করতে 100ms-2s লাগে। Real-time APIs-এ এটা user experience affect করে। Mitigation: Provisioned Concurrency (pre-warm), smaller package size, keep-alive patterns।',
                    },
                    {
                        key: 'c',
                        text: 'Maximum 1MB memory limit',
                        isCorrect: false,
                        explanation:
                            'Lambda 128MB থেকে 10GB পর্যন্ত memory support করে।',
                    },
                    {
                        key: 'd',
                        text: 'Only 10 requests per second',
                        isCorrect: false,
                        explanation:
                            'Lambda default 1000 concurrent invocations support করে, এবং increase করা যায়।',
                    },
                ],
            },
            {
                id: 3,
                text: 'Terraform তে `state` কী?',
                options: [
                    {
                        key: 'a',
                        text: 'AWS region configuration',
                        isCorrect: false,
                        explanation:
                            'Region configuration provider block-এ থাকে, state-এ নয়।',
                    },
                    {
                        key: 'b',
                        text: 'Current infrastructure এর snapshot — Terraform যা manage করছে তার record',
                        isCorrect: true,
                        explanation:
                            'সঠিক। terraform.tfstate file-এ current infrastructure-এর সব resource-এর record থাকে। terraform apply করার পর state update হয়। Terraform পরবর্তী plan-এ state vs desired config compare করে কী change করতে হবে বের করে। S3 backend-এ store করলেন team collaboration safe।',
                    },
                    {
                        key: 'c',
                        text: 'Application এর runtime state',
                        isCorrect: false,
                        explanation:
                            'Terraform infrastructure provision করে, application runtime manage করে না।',
                    },
                    {
                        key: 'd',
                        text: 'Error log file',
                        isCorrect: false,
                        explanation:
                            'State file infrastructure snapshot, error log নয়।',
                    },
                ],
            },
            {
                id: 4,
                text: 'S3 কোন ধরনের storage?',
                options: [
                    {
                        key: 'a',
                        text: 'Block storage (like hard disk)',
                        isCorrect: false,
                        explanation:
                            'Block storage = EBS (EC2 attached disk)। S3 block storage নয়।',
                    },
                    {
                        key: 'b',
                        text: 'File storage (like NFS)',
                        isCorrect: false,
                        explanation:
                            'File storage = EFS। S3 file system নয়।',
                    },
                    {
                        key: 'c',
                        text: 'Object storage — flat namespace, unique key দিয়ে access',
                        isCorrect: true,
                        explanation:
                            'সঠিক। S3 = object storage। প্রতিটা file (object) unique key দিয়ে store হয়। Directory structure নেই (prefix দিয়ে simulate করা যায়)। Unlimited scale, 99.999999999% durability। Images, videos, backups, static websites — সব S3-এ রাখা যায়।',
                    },
                    {
                        key: 'd',
                        text: 'In-memory cache storage',
                        isCorrect: false,
                        explanation:
                            'In-memory = ElastiCache (Redis)। S3 persistent storage।',
                    },
                ],
            },
            {
                id: 5,
                text: 'Auto scaling কখন trigger হয়?',
                options: [
                    {
                        key: 'a',
                        text: 'শুধু manually admin trigger করলেন',
                        isCorrect: false,
                        explanation:
                            'Auto scaling মানেই automatic — manual trigger optional।',
                    },
                    {
                        key: 'b',
                        text: 'CPU/memory metrics threshold অতিক্রম করলেন বা scheduled time-এ',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Target Tracking: CPU 60% target এ রাখুন — বেশি হলে scale out, কমলে scale in। Step Scaling: threshold অনুযায়ী graduated response। Scheduled: office hour-এ বেশি instance, রাতে কম। CloudWatch metrics (CPU, memory, custom) দিয়ে trigger হয়।',
                    },
                    {
                        key: 'c',
                        text: 'Shudhu database error হলে',
                        isCorrect: false,
                        explanation:
                            'Database error auto scaling trigger করে না।',
                    },
                    {
                        key: 'd',
                        text: 'Region change হলে',
                        isCorrect: false,
                        explanation:
                            'Region change auto scaling condition নয়।',
                    },
                ],
            },
            {
                id: 6,
                text: 'Active-Active multi-region মানে কী?',
                options: [
                    {
                        key: 'a',
                        text: 'একটা region active, অন্যটা standby',
                        isCorrect: false,
                        explanation:
                            'এটা Active-Passive। Active-Active-এ সব regions traffic serve করে।',
                    },
                    {
                        key: 'b',
                        text: 'সব regions একসাথে live traffic handle করে — no failover needed',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Active-Active = সব regions simultaneously traffic serve করে। Route53 latency-based routing দিয়ে user তার কাছের region-এ যায়। একটা region down হলেও বাকি regions চলতে থাকে — automatic failover-এর দরকার নেই। Cost বেশি কিন্তু highest availability।',
                    },
                    {
                        key: 'c',
                        text: 'Active-Active = Backup only',
                        isCorrect: false,
                        explanation:
                            'Backup-only হলো cold standby, Active-Active নয়।',
                    },
                    {
                        key: 'd',
                        text: 'শুধু database replication',
                        isCorrect: false,
                        explanation:
                            'Active-Active full stack — compute, database, network সব।',
                    },
                ],
            },
            {
                id: 7,
                text: 'Spot instances কেন সস্তা?',
                options: [
                    {
                        key: 'a',
                        text: 'কম powerful hardware',
                        isCorrect: false,
                        explanation:
                            'Spot instances same hardware — শুধু pricing model আলাদা।',
                    },
                    {
                        key: 'b',
                        text: 'AWS এর unused capacity ব্যবহার করে — interrupt হতে পারে (2-min notice)',
                        isCorrect: true,
                        explanation:
                            'সঠিক। AWS এর unused EC2 capacity spot market-এ বেচে। Demand বাড়লে AWS 2-minute notice দিয়ে instance terminate করতে পারে। তাই ৭০-৯০% সস্তা। Fault-tolerant workloads-এ ideal: ML training, batch processing, video rendering, Big Data। Stateless, checkpoint-able workloads-এ use করুন।',
                    },
                    {
                        key: 'c',
                        text: 'ছোট memory দেয়',
                        isCorrect: false,
                        explanation:
                            'Spot instance-এ full memory available — pricing model-এ পার্থক্য।',
                    },
                    {
                        key: 'd',
                        text: 'শুধু test environment-এর জন্য',
                        isCorrect: false,
                        explanation:
                            'Production-এও use হয় (fault-tolerant workloads)।',
                    },
                ],
            },
            {
                id: 8,
                text: 'CDN কী করে?',
                options: [
                    {
                        key: 'a',
                        text: 'Database backup নেয়',
                        isCorrect: false,
                        explanation:
                            'CDN content delivery করে, database backup নয়।',
                    },
                    {
                        key: 'b',
                        text: 'Code compile করে',
                        isCorrect: false,
                        explanation: 'CDN content cache করে, compile নয়।',
                    },
                    {
                        key: 'c',
                        text: 'Edge location-এ content cache করে — user-এর কাছে থেকে serve করে',
                        isCorrect: true,
                        explanation:
                            'সঠিক। CDN (CloudFront) globally ৪৫০+ edge location-এ content cache করে। User request closest edge-এ যায় — origin server hit করতে হয় না। Latency কমে, origin load কমে। Images, JS, CSS, videos — সব cacheable। Cache-Control headers দিয়ে TTL control করুন।',
                    },
                    {
                        key: 'd',
                        text: 'Load balancing করে EC2-এর মধ্যে',
                        isCorrect: false,
                        explanation:
                            'EC2 load balancing = ALB/NLB। CDN edge caching।',
                    },
                ],
            },
            {
                id: 9,
                text: 'Serverless এর সবচেয়ে বড় সুবিধা কী?',
                options: [
                    {
                        key: 'a',
                        text: 'সবচেয়ে fast execution',
                        isCorrect: false,
                        explanation:
                            'Serverless সবচেয়ে fast নয় — cold start latency একটা issue।',
                    },
                    {
                        key: 'b',
                        text: 'No server management + pay-per-use + automatic scaling',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Serverless-এর তিনটা core benefit: (১) Server, OS, patching — কিছুই manage করতে হয় না। (২) Function execute না হলে কোনো cost নেই — 1M free invocations/month। (৩) 0 থেকে thousands of concurrent executions automatic। Small team-এর জন্য game changer।',
                    },
                    {
                        key: 'c',
                        text: 'Unlimited execution time',
                        isCorrect: false,
                        explanation:
                            'Lambda maximum 15 minutes execution limit আছে।',
                    },
                    {
                        key: 'd',
                        text: 'Cheapest option always',
                        isCorrect: false,
                        explanation:
                            'High-traffic continuous workloads-এ Reserved EC2 সস্তা হতে পারে।',
                    },
                ],
            },
            {
                id: 10,
                text: 'VPC কী?',
                options: [
                    {
                        key: 'a',
                        text: 'Very Private Compute — একটা server type',
                        isCorrect: false,
                        explanation:
                            'VPC server type নয় — networking concept।',
                    },
                    {
                        key: 'b',
                        text: 'Virtual Private Cloud — AWS-এ আপনার isolated private network',
                        isCorrect: true,
                        explanation:
                            'সঠিক। VPC = AWS-এর মধ্যে আপনার নিজের isolated network। আপনি IP range (CIDR) define করুন, subnets (public/private) তৈরি করুন, routing rules set করুন। Public subnet: internet accessible (EC2, ALB)। Private subnet: internet থেকে hidden (RDS, ElastiCache)। Security Groups = instance-level firewall।',
                    },
                    {
                        key: 'c',
                        text: 'Database service',
                        isCorrect: false,
                        explanation:
                            'VPC database নয় — network infrastructure।',
                    },
                    {
                        key: 'd',
                        text: 'CDN service',
                        isCorrect: false,
                        explanation:
                            'CDN = CloudFront। VPC = isolated network।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'AWS Multi-tier Architecture ডিজাইন করুন',
        time: '৪-৫ ঘন্টা',
        difficulty: 'Advanced',
        tasks: [
            <span>
                <strong>VPC Design:</strong> একটা production-grade VPC design
                করুন। Public subnets (2 AZ)-এ ALB + EC2 Auto Scaling Group।
                Private subnets (2 AZ)-এ RDS Multi-AZ + ElastiCache। Internet
                Gateway, NAT Gateway (private subnets-এর outbound), Security
                Groups সব include করুন।
            </span>,
            <span>
                <strong>Full Stack Architecture:</strong> EC2 + RDS PostgreSQL +
                ElastiCache Redis + S3 (static assets) + CloudFront (CDN) দিয়ে
                একটা e-commerce-এর architecture diagram আঁকুন। প্রতিটা
                component-এর role এবং connection explain করুন।
            </span>,
            <span>
                <strong>Terraform Code:</strong> উপরের architecture-এর Terraform
                code লিখুন। কমপক্ষে: VPC, subnets, security groups, EC2 launch
                template, RDS instance। S3 backend দিয়ে state manage করুন।
            </span>,
            <span>
                <strong>Auto Scaling Policy:</strong> Target tracking policy
                define করুন (CPU 60% target)। Scheduled scaling: weekday 9am-6pm
                higher capacity। CloudWatch alarm: CPU 80%+ হলে SNS notification।
            </span>,
            <span>
                <strong>Cost Estimation:</strong> AWS Pricing Calculator use করে
                এই architecture-এর monthly cost estimate করুন। On-Demand vs
                Reserved (1-year) cost compare করুন। Spot instances কোথায় use
                করা যায় suggest করুন।
            </span>,
        ],
        deliverables: [
            <span>VPC architecture diagram (subnets, security groups, gateways)</span>,
            <span>Full multi-tier architecture diagram with service labels</span>,
            <span>Terraform code (VPC + EC2 + RDS minimum)</span>,
            <span>Cost comparison table (On-Demand vs Reserved vs hybrid)</span>,
        ],
    },
    practicalLab: {
        title: 'Terraform + AWS Multi-tier Setup',
        subtitle: 'Terraform + AWS (EC2, RDS, S3, CloudFront)',
        steps: [
            {
                title: 'Terraform Install + AWS Configure করুন',
                description:
                    'Terraform install করুন (terraform.io/downloads)। AWS CLI install করুন। aws configure দিয়ে access key + region set করুন। terraform version দিয়ে verify করুন।',
            },
            {
                title: 'VPC + Networking Terraform Code লিখুন',
                description:
                    'main.tf-এ provider + VPC + subnets + internet gateway + route tables define করুন। terraform init → terraform plan → terraform apply করুন। AWS console-এ VPC দেখুন।',
            },
            {
                title: 'EC2 Auto Scaling Group Add করুন',
                description:
                    'launch_template + autoscaling_group resource add করুন। user_data script-এ simple web server (nginx) install করুন। terraform apply করলেন EC2 instance চলে কিনা check করুন।',
            },
            {
                title: 'RDS PostgreSQL Add করুন',
                description:
                    'aws_db_subnet_group + aws_db_instance resource define করুন। Private subnet-এ রাখুন। Security group শুধু EC2 থেকে 5432 port allow করুন। terraform apply করুন।',
            },
            {
                title: 'S3 + CloudFront Static Hosting Setup করুন',
                description:
                    'S3 bucket create করুন (website hosting enable)। CloudFront distribution create করুন (S3 origin)। একটা HTML file upload করুন। CloudFront URL দিয়ে access করুন।',
            },
        ],
        codeBlock: {
            language: 'hcl',
            filename: 'complete_infra.tf — Multi-tier AWS Setup',
            code: `# ============================================================
# Complete Multi-tier Infrastructure — Terraform
# ============================================================

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # State in S3 (team collaboration)
  backend "s3" {
    bucket         = "my-terraform-state-bucket"
    key            = "prod/terraform.tfstate"
    region         = "ap-southeast-1"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}

provider "aws" {
  region = "ap-southeast-1"  # Singapore
}

# ─── Variables ────────────────────────────────────────────────────
variable "project" { default = "myapp" }
variable "env"     { default = "prod" }

locals {
  common_tags = {
    Project     = var.project
    Environment = var.env
    ManagedBy   = "Terraform"
  }
}

# ─── VPC ──────────────────────────────────────────────────────────
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = merge(local.common_tags, { Name = "\${var.project}-vpc" })
}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.\${count.index}.0/24"
  availability_zone       = data.aws_availability_zones.az.names[count.index]
  map_public_ip_on_launch = true
  tags = merge(local.common_tags, { Name = "\${var.project}-pub-\${count.index}" })
}

resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.\${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.az.names[count.index]
  tags = merge(local.common_tags, { Name = "\${var.project}-priv-\${count.index}" })
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags   = merge(local.common_tags, { Name = "\${var.project}-igw" })
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# ─── S3 Bucket (Static Assets) ────────────────────────────────────
resource "aws_s3_bucket" "assets" {
  bucket = "\${var.project}-assets-\${random_id.bucket_id.hex}"
  tags   = local.common_tags
}

resource "random_id" "bucket_id" {
  byte_length = 4
}

resource "aws_s3_bucket_versioning" "assets" {
  bucket = aws_s3_bucket.assets.id
  versioning_configuration { status = "Enabled" }
}

# ─── CloudFront (CDN) ─────────────────────────────────────────────
resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  default_root_object = "index.html"

  origin {
    domain_name              = aws_s3_bucket.assets.bucket_regional_domain_name
    origin_id                = "S3Origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3Origin"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    min_ttl     = 0
    default_ttl = 3600   # 1 hour cache
    max_ttl     = 86400  # 24 hours max
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = local.common_tags
}

resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "\${var.project}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ─── Outputs ──────────────────────────────────────────────────────
output "cloudfront_domain" {
  value       = aws_cloudfront_distribution.cdn.domain_name
  description = "CloudFront URL — static assets serve হবে এখান থেকে"
}

output "vpc_id" {
  value = aws_vpc.main.id
}

data "aws_availability_zones" "az" {
  state = "available"
}`,
        },
        tip: 'Terraform দিয়ে infrastructure manage করলেন সবচেয়ে বড় সুবিধা হলো terraform destroy দিয়ে সব মুছে ফেলা যায় — AWS bill এড়ানো যায়। Practice শেষ হলে অবশ্যই terraform destroy করুন।',
    },
};
