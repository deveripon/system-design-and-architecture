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

export const observabilityContent: TopicData = {
    id: 'observability',
    sections: [
        // ─────────────────────────────────────────────────
        // 001 — Why Observability
        // ─────────────────────────────────────────────────
        {
            id: 'why-observability',
            subHeader: { index: '001', title: 'Why Observability' },
            title: (
                <SectionTitle>
                    Production এ যখন কিছু ভাঙে... রাত ৩টায় Alert
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
                                    🔭 Advanced Level
                                </span>
                                <span className='font-mono text-xs px-3 py-1 border border-orange-400/30 text-orange-700 dark:text-orange-400 bg-orange-400/5 rounded'>
                                    📊 Observability
                                </span>
                                <span className='font-mono text-xs px-3 py-1 border border-purple-400/30 text-purple-700 dark:text-purple-400 bg-purple-400/5 rounded'>
                                    TOPIC 02 / Phase 5
                                </span>
                            </div>
                            <ContentParagraph>
                                কল্পনা করুন রাত ৩টা। হঠাৎ PagerDuty alert:{' '}
                                <strong className='text-foreground'>
                                    Payment service down
                                </strong>
                                । Users transaction করতে পারছে না। আপনার কাছে দুটো
                                option:
                            </ContentParagraph>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                                <div className='bg-red-500/5 border border-red-500/20 rounded-lg p-5'>
                                    <p className='font-mono text-xs uppercase tracking-widest text-red-700 dark:text-red-400 mb-3'>
                                        ❌ Without Observability
                                    </p>
                                    <ul className='space-y-2'>
                                        {[
                                            'কোন service fail করেছেনে জানেন না',
                                            'SSH করে manually log grep করুন',
                                            'কোন machine-এ সমস্যা বুঝতে ঘণ্টার পর ঘণ্টা',
                                            '"আমার machine-এ তো কাজ করে!"',
                                            'MTTR (Mean Time To Recovery) = ঘণ্টা',
                                            'Customer ইতিমধ্যে চলে গেছে',
                                        ].map((item, i) => (
                                            <li
                                                key={i}
                                                className='text-sm text-muted-foreground flex items-start gap-2'>
                                                <span className='text-red-700 dark:text-red-400 mt-0.5 flex-shrink-0'>
                                                    →
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className='bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-5'>
                                    <p className='font-mono text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-3'>
                                        ✅ With Observability
                                    </p>
                                    <ul className='space-y-2'>
                                        {[
                                            'Dashboard এ দেখুন: payment-svc error rate 45%',
                                            'Trace ID দিয়ে exact failed request খুঁজুন',
                                            'DB connection pool exhausted — log-এ স্পষ্ট',
                                            'Grafana: latency spike ঠিক কখন শুরু হয়েছে',
                                            'Root cause 5 মিনিটে: DB slow query',
                                            'MTTR = মিনিট, customer impact কম',
                                        ].map((item, i) => (
                                            <li
                                                key={i}
                                                className='text-sm text-muted-foreground flex items-start gap-2'>
                                                <span className='text-emerald-700 dark:text-emerald-400 mt-0.5 flex-shrink-0'>
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
                    title: '📌 Observability কী?',
                    content: (
                        <p>
                            <strong>Observability</strong> মানে system এর
                            internal state বোঝা external outputs থেকে।{' '}
                            <strong>Monitoring</strong> বলে{' '}
                            <em>&quot;কী হচ্ছে&quot;</em>, Observability বলে{' '}
                            <em>&quot;কেন হচ্ছে&quot;</em>। আপনি যদি system-এর
                            যেকোনো অজানা প্রশ্নের উত্তর data দিয়ে বের করতে
                            পারেন — সেই system observable। এটা achieve করতে
                            দরকার ৩টা pillar:{' '}
                            <strong>Metrics, Logs, এবং Traces</strong>।
                        </p>
                    ),
                },
            ],
        },

        // ─────────────────────────────────────────────────
        // 002 — Three Pillars
        // ─────────────────────────────────────────────────
        {
            id: 'three-pillars',
            subHeader: { index: '002', title: 'Three Pillars' },
            title: (
                <SectionTitle>
                    Observability এর ৩টা Pillar — Metrics, Logs, Traces
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                একটা Request এর পুরো Observability Flow
                            </p>
                            <svg
                                viewBox='0 0 700 260'
                                className='w-full max-w-2xl mx-auto'>
                                <defs>
                                    <marker
                                        id='obs-arr'
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
                                        id='obs-arrC'
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
                                </defs>
                                {/* User */}
                                <rect
                                    x='10'
                                    y='100'
                                    width='70'
                                    height='40'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#94a3b8'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='45'
                                    y='118'
                                    textAnchor='middle'
                                    fill='#94a3b8'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    USER
                                </text>
                                <text
                                    x='45'
                                    y='131'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Request
                                </text>
                                <path
                                    d='M 80 120 L 115 120'
                                    stroke='#64748b'
                                    strokeWidth='1.5'
                                    markerEnd='url(#obs-arr)'
                                />
                                {/* API Gateway */}
                                <rect
                                    x='115'
                                    y='95'
                                    width='90'
                                    height='50'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#06b6d4'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='160'
                                    y='116'
                                    textAnchor='middle'
                                    fill='#06b6d4'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    API GATEWAY
                                </text>
                                <text
                                    x='160'
                                    y='129'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    trace_id inject
                                </text>
                                <path
                                    d='M 205 120 L 240 120'
                                    stroke='#64748b'
                                    strokeWidth='1.5'
                                    markerEnd='url(#obs-arr)'
                                />
                                {/* Order Service */}
                                <rect
                                    x='240'
                                    y='95'
                                    width='95'
                                    height='50'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='287'
                                    y='116'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    ORDER SVC
                                </text>
                                <text
                                    x='287'
                                    y='129'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    span: 45ms
                                </text>
                                <path
                                    d='M 335 120 L 370 120'
                                    stroke='#64748b'
                                    strokeWidth='1.5'
                                    markerEnd='url(#obs-arr)'
                                />
                                {/* Payment Service */}
                                <rect
                                    x='370'
                                    y='95'
                                    width='100'
                                    height='50'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#f97316'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='420'
                                    y='116'
                                    textAnchor='middle'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    PAYMENT SVC
                                </text>
                                <text
                                    x='420'
                                    y='129'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    span: 120ms
                                </text>
                                <path
                                    d='M 470 120 L 505 120'
                                    stroke='#64748b'
                                    strokeWidth='1.5'
                                    markerEnd='url(#obs-arr)'
                                />
                                {/* DB */}
                                <rect
                                    x='505'
                                    y='95'
                                    width='75'
                                    height='50'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='542'
                                    y='116'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    DATABASE
                                </text>
                                <text
                                    x='542'
                                    y='129'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    span: 80ms
                                </text>
                                {/* Metrics label */}
                                <text
                                    x='45'
                                    y='25'
                                    textAnchor='middle'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    fontWeight='bold'>
                                    METRICS
                                </text>
                                <path
                                    d='M 160 95 L 160 55'
                                    stroke='#eab308'
                                    strokeWidth='1'
                                    strokeDasharray='4 2'
                                    markerEnd='url(#obs-arr)'
                                />
                                <text
                                    x='160'
                                    y='44'
                                    textAnchor='middle'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    req_count, latency
                                </text>
                                {/* Logs label */}
                                <path
                                    d='M 287 95 L 287 55'
                                    stroke='#06b6d4'
                                    strokeWidth='1'
                                    strokeDasharray='4 2'
                                    markerEnd='url(#obs-arr)'
                                />
                                <text
                                    x='287'
                                    y='44'
                                    textAnchor='middle'
                                    fill='#06b6d4'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    fontWeight='bold'>
                                    LOGS
                                </text>
                                <text
                                    x='287'
                                    y='31'
                                    textAnchor='middle'
                                    fill='#06b6d4'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    structured JSON
                                </text>
                                {/* Traces label */}
                                <path
                                    d='M 420 95 L 420 55'
                                    stroke='#8b5cf6'
                                    strokeWidth='1'
                                    strokeDasharray='4 2'
                                    markerEnd='url(#obs-arr)'
                                />
                                <text
                                    x='420'
                                    y='44'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    fontWeight='bold'>
                                    TRACES
                                </text>
                                <text
                                    x='420'
                                    y='31'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    distributed spans
                                </text>
                                {/* Bottom total time */}
                                <line
                                    x1='115'
                                    y1='200'
                                    x2='580'
                                    y2='200'
                                    stroke='#475569'
                                    strokeWidth='1'
                                />
                                <text
                                    x='347'
                                    y='220'
                                    textAnchor='middle'
                                    fill='#94a3b8'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    Total trace duration: 245ms (trace_id:
                                    abc-123)
                                </text>
                                <line
                                    x1='115'
                                    y1='196'
                                    x2='115'
                                    y2='204'
                                    stroke='#475569'
                                    strokeWidth='1'
                                />
                                <line
                                    x1='580'
                                    y1='196'
                                    x2='580'
                                    y2='204'
                                    stroke='#475569'
                                    strokeWidth='1'
                                />
                                <text
                                    x='160'
                                    y='250'
                                    fill='#475569'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Metrics = aggregate numbers | Logs = event
                                    details | Traces = request journey
                                </text>
                            </svg>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            {[
                                {
                                    icon: '📊',
                                    title: 'Metrics',
                                    color: 'border-yellow-400/30 text-yellow-700 dark:text-yellow-400 bg-yellow-400/5',
                                    borderColor: 'border-yellow-400/20',
                                    items: [
                                        'Aggregated numbers',
                                        'CPU, memory, request count',
                                        'Time-series data',
                                        'Tool: Prometheus',
                                        'Alert threshold set করা যায়',
                                    ],
                                },
                                {
                                    icon: '📝',
                                    title: 'Logs',
                                    color: 'border-primary/30 text-primary bg-primary/5',
                                    borderColor: 'border-primary/20',
                                    items: [
                                        'Event-by-event records',
                                        'Error messages, stack traces',
                                        'Structured JSON format',
                                        'Tool: ELK Stack',
                                        'Full context per event',
                                    ],
                                },
                                {
                                    icon: '🔍',
                                    title: 'Traces',
                                    color: 'border-purple-400/30 text-purple-700 dark:text-purple-400 bg-purple-400/5',
                                    borderColor: 'border-purple-400/20',
                                    items: [
                                        'Request journey tracking',
                                        'Service A → B → C latency',
                                        'Distributed span tree',
                                        'Tool: Jaeger / Zipkin',
                                        'Root cause analysis',
                                    ],
                                },
                            ].map((pillar, i) => (
                                <div
                                    key={i}
                                    className={`bg-muted/30 border ${pillar.borderColor} rounded-lg p-5`}>
                                    <p
                                        className={`font-mono text-xs uppercase tracking-widest mb-4 ${pillar.color.split(' ')[1]}`}>
                                        {pillar.icon} {pillar.title}
                                    </p>
                                    <ul className='space-y-1.5'>
                                        {pillar.items.map((item, j) => (
                                            <li
                                                key={j}
                                                className='text-sm text-muted-foreground flex items-start gap-2'>
                                                <span className='text-muted-foreground mt-0.5'>
                                                    →
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['বৈশিষ্ট্য', 'Metrics', 'Logs', 'Traces'],
                    rows: [
                        ['কী?', 'Numeric aggregates', 'Text event records', 'Request flow map'],
                        ['Tool', 'Prometheus + Grafana', 'ELK Stack / Loki', 'Jaeger / Zipkin'],
                        ['Granularity', 'Low (aggregate)', 'Medium (per event)', 'High (per request)'],
                        ['Storage cost', 'Low', 'High', 'Medium'],
                        ['Use case', 'Alerting, dashboards', 'Debugging errors', 'Latency analysis'],
                        ['Query', 'PromQL', 'KQL / Lucene', 'Trace ID search'],
                    ],
                },
            ],
        },

        // ─────────────────────────────────────────────────
        // 003 — Prometheus
        // ─────────────────────────────────────────────────
        {
            id: 'prometheus',
            subHeader: { index: '003', title: 'Prometheus — Metrics' },
            title: (
                <SectionTitle>
                    Prometheus — Metrics Collection এবং PromQL
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            <strong className='text-foreground'>
                                Prometheus
                            </strong>{' '}
                            হলো open-source metrics system। এটা{' '}
                            <strong className='text-foreground'>pull model</strong>{' '}
                            use করে — services-এর{' '}
                            <code className='font-mono text-xs bg-muted/50 px-1 rounded'>
                                /metrics
                            </code>{' '}
                            endpoint থেকে নিজে data collect করে। এরপর
                            AlertManager দিয়ে alert এবং Grafana দিয়ে
                            visualize করা হয়।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                Prometheus Architecture — Pull Model
                            </p>
                            <svg
                                viewBox='0 0 680 280'
                                className='w-full max-w-2xl mx-auto'>
                                <defs>
                                    <marker
                                        id='prom-arr'
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
                                        id='prom-arrO'
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
                                {/* Services column */}
                                {[
                                    { y: 20, label: 'API Service', sub: '/metrics' },
                                    { y: 90, label: 'Order Service', sub: '/metrics' },
                                    { y: 160, label: 'Payment Service', sub: '/metrics' },
                                    { y: 230, label: 'DB Exporter', sub: '/metrics' },
                                ].map((svc, i) => (
                                    <g key={i}>
                                        <rect
                                            x='10'
                                            y={svc.y}
                                            width='115'
                                            height='45'
                                            rx='4'
                                            fill='transparent'
                                            stroke='#475569'
                                            strokeWidth='1.2'
                                        />
                                        <text
                                            x='67'
                                            y={svc.y + 18}
                                            textAnchor='middle'
                                            fill='#94a3b8'
                                            fontFamily='monospace'
                                            fontSize='8'>
                                            {svc.label}
                                        </text>
                                        <text
                                            x='67'
                                            y={svc.y + 32}
                                            textAnchor='middle'
                                            fill='#475569'
                                            fontFamily='monospace'
                                            fontSize='8'>
                                            {svc.sub}
                                        </text>
                                    </g>
                                ))}
                                {/* Pull arrows */}
                                {[42, 112, 182, 252].map((y, i) => (
                                    <path
                                        key={i}
                                        d={`M 125 ${y} L 210 ${y}`}
                                        stroke='#f97316'
                                        strokeWidth='1.2'
                                        strokeDasharray='5 3'
                                        markerEnd='url(#prom-arrO)'
                                    />
                                ))}
                                <text
                                    x='167'
                                    y='150'
                                    textAnchor='middle'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    PULL
                                </text>
                                <text
                                    x='167'
                                    y='161'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='6'>
                                    every 15s
                                </text>
                                {/* Prometheus */}
                                <rect
                                    x='210'
                                    y='100'
                                    width='130'
                                    height='75'
                                    rx='6'
                                    fill='transparent'
                                    stroke='#f97316'
                                    strokeWidth='2'
                                />
                                <text
                                    x='275'
                                    y='130'
                                    textAnchor='middle'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='10'
                                    fontWeight='bold'>
                                    PROMETHEUS
                                </text>
                                <text
                                    x='275'
                                    y='145'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    TSDB Storage
                                </text>
                                <text
                                    x='275'
                                    y='158'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    PromQL Engine
                                </text>
                                {/* Arrow to AlertManager */}
                                <path
                                    d='M 340 125 L 420 80'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#prom-arr)'
                                />
                                {/* AlertManager */}
                                <rect
                                    x='420'
                                    y='45'
                                    width='120'
                                    height='55'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#ef4444'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='480'
                                    y='68'
                                    textAnchor='middle'
                                    fill='#ef4444'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    ALERTMANAGER
                                </text>
                                <text
                                    x='480'
                                    y='82'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    PagerDuty / Slack
                                </text>
                                {/* Arrow to Grafana */}
                                <path
                                    d='M 340 155 L 420 185'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#prom-arr)'
                                />
                                {/* Grafana */}
                                <rect
                                    x='420'
                                    y='155'
                                    width='120'
                                    height='55'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#f97316'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='480'
                                    y='178'
                                    textAnchor='middle'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    GRAFANA
                                </text>
                                <text
                                    x='480'
                                    y='192'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Dashboards
                                </text>
                                {/* Legend */}
                                <line
                                    x1='210'
                                    y1='260'
                                    x2='240'
                                    y2='260'
                                    stroke='#f97316'
                                    strokeWidth='1.5'
                                    strokeDasharray='5 3'
                                />
                                <text
                                    x='248'
                                    y='264'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Prometheus scrapes /metrics endpoint
                                </text>
                            </svg>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Metric Type', 'কী করে', 'Example', 'কখন ব্যবহার'],
                    rows: [
                        [
                            <span className='text-primary font-mono font-semibold'>Counter</span>,
                            'শুধু বাড়ে, কমে না',
                            'http_requests_total',
                            'Request count, error count',
                        ],
                        [
                            <span className='text-emerald-700 dark:text-emerald-400 font-mono font-semibold'>Gauge</span>,
                            'বাড়ে এবং কমে উভয়',
                            'memory_usage_bytes',
                            'CPU, memory, active connections',
                        ],
                        [
                            <span className='text-yellow-700 dark:text-yellow-400 font-mono font-semibold'>Histogram</span>,
                            'Bucketed observations',
                            'http_request_duration_seconds',
                            'Latency percentiles (P99)',
                        ],
                        [
                            <span className='text-purple-700 dark:text-purple-400 font-mono font-semibold'>Summary</span>,
                            'Pre-calculated quantiles',
                            'rpc_duration_seconds',
                            'Client-side percentile calculation',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'promql',
                    filename: 'promql-examples.txt — PromQL Queries',
                    code: `# Error Rate — শেষ ৫ মিনিটে error percentage
rate(http_requests_total{status=~"5.."}[5m])
  /
rate(http_requests_total[5m]) * 100

# P99 Latency — ৯৯% requests এর latency
histogram_quantile(0.99,
  rate(http_request_duration_seconds_bucket[5m])
)

# Request Rate by Service — প্রতিটা service-এর RPS
sum(rate(http_requests_total[1m])) by (service)

# Active Connections per Pod
sum(tcp_connections_active) by (pod)

# Memory Usage Percentage
(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes)
  / node_memory_MemTotal_bytes * 100

# ───────────── Alert Rule Example ─────────────
# prometheus_rules.yml
groups:
  - name: payment-alerts
    rules:
      - alert: HighErrorRate
        expr: |
          rate(http_requests_total{service="payment",status=~"5.."}[5m])
          /
          rate(http_requests_total{service="payment"}[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Payment service error rate > 5%"
          description: "Error rate: {{ $value | humanizePercentage }}"`,
                },
            ],
        },

        // ─────────────────────────────────────────────────
        // 004 — Grafana
        // ─────────────────────────────────────────────────
        {
            id: 'grafana',
            subHeader: { index: '004', title: 'Grafana — Visualization' },
            title: (
                <SectionTitle>
                    Grafana — Dashboards এবং SLI/SLO/SLA
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            <strong className='text-foreground'>Grafana</strong>{' '}
                            হলো open-source visualization platform। এটা নিজে
                            data store করে না — বরং Prometheus, Loki, Tempo,
                            Elasticsearch সহ ৫০+ data source-এ connect করে
                            beautiful dashboards বানায়।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='bg-muted/30 border border-border rounded-lg p-5'>
                                <p className='font-mono text-xs uppercase tracking-widest text-orange-700 dark:text-orange-400 mb-4'>
                                    📊 Grafana Data Sources
                                </p>
                                <ul className='space-y-2'>
                                    {[
                                        'Prometheus → Metrics dashboards',
                                        'Loki → Log visualization',
                                        'Tempo / Jaeger → Trace viewer',
                                        'Elasticsearch → Log search',
                                        'MySQL / PostgreSQL → DB metrics',
                                        'CloudWatch → AWS metrics',
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className='text-sm text-muted-foreground flex items-start gap-2'>
                                            <span className='text-orange-700 dark:text-orange-400 mt-0.5'>
                                                →
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className='bg-muted/30 border border-border rounded-lg p-5'>
                                <p className='font-mono text-xs uppercase tracking-widest text-primary mb-4'>
                                    🎛️ Dashboard Panel Types
                                </p>
                                <ul className='space-y-2'>
                                    {[
                                        'Time series → latency trends',
                                        'Stat → current error rate %',
                                        'Gauge → CPU / memory fill',
                                        'Table → per-service summary',
                                        'Heatmap → request distribution',
                                        'Alert list → active incidents',
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className='text-sm text-muted-foreground flex items-start gap-2'>
                                            <span className='text-primary mt-0.5'>
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
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'json',
                    filename: 'grafana-dashboard-panel.json — Dashboard Config',
                    code: `{
  "title": "Payment Service — SLO Dashboard",
  "panels": [
    {
      "title": "Error Rate (5m)",
      "type": "stat",
      "datasource": "Prometheus",
      "targets": [
        {
          "expr": "sum(rate(http_requests_total{service='payment',status=~'5..'}[5m])) / sum(rate(http_requests_total{service='payment'}[5m])) * 100",
          "legendFormat": "Error %"
        }
      ],
      "thresholds": {
        "steps": [
          { "color": "green", "value": null },
          { "color": "yellow", "value": 1 },
          { "color": "red", "value": 5 }
        ]
      }
    },
    {
      "title": "P99 Latency",
      "type": "timeseries",
      "datasource": "Prometheus",
      "targets": [
        {
          "expr": "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket{service='payment'}[5m]))",
          "legendFormat": "P99"
        },
        {
          "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{service='payment'}[5m]))",
          "legendFormat": "P95"
        }
      ]
    },
    {
      "title": "Request Rate (RPS)",
      "type": "timeseries",
      "targets": [
        {
          "expr": "sum(rate(http_requests_total{service='payment'}[1m])) by (status_code)",
          "legendFormat": "{{ status_code }}"
        }
      ]
    }
  ]
}`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 SLI, SLO, SLA — পার্থক্য কী?',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>SLI (Service Level Indicator):</strong>{' '}
                                Actual measured metric। যেমন: payment service-এর
                                current availability = 99.87%।
                            </p>
                            <p>
                                <strong>SLO (Service Level Objective):</strong>{' '}
                                Internal target। যেমন: আমরা 99.9% availability
                                maintain করতে চাই। এটা team-এর goal।
                            </p>
                            <p>
                                <strong>SLA (Service Level Agreement):</strong>{' '}
                                External contract with customers। যেমন: আমরা
                                99.5% guarantee করি। Miss করলেন refund/penalty।
                                SLO &gt; SLA — buffer রাখুন।
                            </p>
                        </div>
                    ),
                },
            ],
        },

        // ─────────────────────────────────────────────────
        // 005 — Jaeger Tracing
        // ─────────────────────────────────────────────────
        {
            id: 'jaeger-tracing',
            subHeader: { index: '005', title: 'Jaeger — Distributed Tracing' },
            title: (
                <SectionTitle>
                    Distributed Tracing — Jaeger দিয়ে Request Journey Track করুন
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Microservices-এ একটা request ১০টা service পার করে।
                            কোন service-এ কতটুকু সময় গেছে?{' '}
                            <strong className='text-foreground'>
                                Distributed tracing
                            </strong>{' '}
                            এই question-এর উত্তর দেয়। প্রতিটা request-এর জন্য
                            একটা{' '}
                            <strong className='text-foreground'>trace</strong>{' '}
                            তৈরি হয়, প্রতিটা service call হলো একটা{' '}
                            <strong className='text-foreground'>span</strong>।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                Trace Waterfall — trace_id: abc-xyz-789
                            </p>
                            <svg
                                viewBox='0 0 660 260'
                                className='w-full max-w-2xl mx-auto'>
                                {/* Timeline header */}
                                <text
                                    x='180'
                                    y='18'
                                    fill='#475569'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    0ms
                                </text>
                                <text
                                    x='310'
                                    y='18'
                                    fill='#475569'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    100ms
                                </text>
                                <text
                                    x='440'
                                    y='18'
                                    fill='#475569'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    200ms
                                </text>
                                <text
                                    x='570'
                                    y='18'
                                    fill='#475569'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    300ms
                                </text>
                                {/* Grid lines */}
                                {[180, 310, 440, 570].map((x, i) => (
                                    <line
                                        key={i}
                                        x1={x}
                                        y1='22'
                                        x2={x}
                                        y2='250'
                                        stroke='#1e293b'
                                        strokeWidth='1'
                                        strokeDasharray='2 4'
                                    />
                                ))}
                                {/* Span: API Gateway — 0-280ms total */}
                                <text
                                    x='5'
                                    y='48'
                                    fill='#06b6d4'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    API Gateway
                                </text>
                                <rect
                                    x='180'
                                    y='35'
                                    width='364'
                                    height='18'
                                    rx='2'
                                    fill='rgba(6,182,212,0.25)'
                                    stroke='#06b6d4'
                                    strokeWidth='1'
                                />
                                <text
                                    x='362'
                                    y='47'
                                    textAnchor='middle'
                                    fill='#06b6d4'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    280ms
                                </text>
                                {/* Span: Order Service — 10-160ms */}
                                <text
                                    x='15'
                                    y='80'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    Order Svc
                                </text>
                                <rect
                                    x='193'
                                    y='67'
                                    width='195'
                                    height='18'
                                    rx='2'
                                    fill='rgba(139,92,246,0.2)'
                                    stroke='#8b5cf6'
                                    strokeWidth='1'
                                />
                                <text
                                    x='290'
                                    y='79'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    150ms
                                </text>
                                {/* Span: DB Query — 20-100ms */}
                                <text
                                    x='25'
                                    y='112'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    DB Query
                                </text>
                                <rect
                                    x='206'
                                    y='99'
                                    width='104'
                                    height='18'
                                    rx='2'
                                    fill='rgba(16,185,129,0.2)'
                                    stroke='#10b981'
                                    strokeWidth='1'
                                />
                                <text
                                    x='258'
                                    y='111'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    80ms
                                </text>
                                {/* Span: Payment Service — 165-270ms */}
                                <text
                                    x='15'
                                    y='144'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    Payment Svc
                                </text>
                                <rect
                                    x='394'
                                    y='131'
                                    width='130'
                                    height='18'
                                    rx='2'
                                    fill='rgba(249,115,22,0.2)'
                                    stroke='#f97316'
                                    strokeWidth='1'
                                />
                                <text
                                    x='459'
                                    y='143'
                                    textAnchor='middle'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    100ms
                                </text>
                                {/* Span: Payment DB — 170-250ms */}
                                <text
                                    x='25'
                                    y='176'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Payment DB
                                </text>
                                <rect
                                    x='406'
                                    y='163'
                                    width='104'
                                    height='18'
                                    rx='2'
                                    fill='rgba(234,179,8,0.2)'
                                    stroke='#eab308'
                                    strokeWidth='1'
                                />
                                <text
                                    x='458'
                                    y='175'
                                    textAnchor='middle'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    80ms
                                </text>
                                {/* Legend */}
                                <text
                                    x='180'
                                    y='240'
                                    fill='#475569'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Trace = একটা request-এর পুরো journey।
                                    Span = প্রতিটা service call।
                                </text>
                                <text
                                    x='180'
                                    y='253'
                                    fill='#475569'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Bottleneck দেখা যাচ্ছে: Payment DB 80ms
                                    — optimize করার জায়গা।
                                </text>
                            </svg>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'opentelemetry_tracing.py — OpenTelemetry Instrumentation',
                    code: `from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from fastapi import FastAPI, Request
import httpx

# ──── Setup: Jaeger Exporter ────
jaeger_exporter = JaegerExporter(
    agent_host_name="jaeger",  # Docker service name
    agent_port=6831,
)

provider = TracerProvider()
provider.add_span_processor(BatchSpanProcessor(jaeger_exporter))
trace.set_tracer_provider(provider)

tracer = trace.get_tracer("order-service")

app = FastAPI()
FastAPIInstrumentor.instrument_app(app)  # Auto-instrument all routes

# ──── Manual Span: Custom business logic ────
@app.post("/order")
async def create_order(request: Request, item_id: str, quantity: int):
    # trace_id is automatically injected by FastAPIInstrumentor
    with tracer.start_as_current_span("validate-inventory") as span:
        span.set_attribute("item_id", item_id)
        span.set_attribute("quantity", quantity)

        # Check inventory — nested span
        with tracer.start_as_current_span("db-query-inventory"):
            available = await check_inventory(item_id)
            if available < quantity:
                span.set_status(trace.StatusCode.ERROR, "insufficient stock")
                return {"error": "out of stock"}

    # Call Payment Service — trace_id propagates via HTTP header
    with tracer.start_as_current_span("call-payment-service") as pay_span:
        pay_span.set_attribute("amount", quantity * 100)
        async with httpx.AsyncClient() as client:
            # OpenTelemetry automatically injects traceparent header
            response = await client.post(
                "http://payment-svc/charge",
                json={"item_id": item_id, "quantity": quantity},
                headers=get_trace_headers()  # Propagate context
            )

    return {"order_id": "ord-123", "status": "confirmed"}


# ──── Trace Context Propagation ────
def get_trace_headers() -> dict:
    """Extract current trace context as HTTP headers for downstream services"""
    from opentelemetry.propagate import inject
    headers = {}
    inject(headers)  # Adds 'traceparent' header: 00-{trace_id}-{span_id}-01
    return headers

# traceparent example:
# traceparent: 00-abc123def456-789abc-01
#              ver  trace_id    span_id flags`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 OpenTelemetry কী?',
                    content: (
                        <p>
                            <strong>OpenTelemetry (OTel)</strong> হলো
                            vendor-neutral observability framework। এটা CNCF
                            project। একবার instrument করুন, যেকোনো backend-এ
                            export করুন — Jaeger, Zipkin, Datadog, New Relic।
                            Trace ID HTTP header{' '}
                            <code className='font-mono text-xs bg-muted/50 px-1 rounded'>
                                traceparent
                            </code>{' '}
                            হিসেবে propagate হয়। প্রতিটা downstream service
                            এই header read করে parent span-এ attach করে।
                        </p>
                    ),
                },
            ],
        },

        // ─────────────────────────────────────────────────
        // 006 — ELK Stack
        // ─────────────────────────────────────────────────
        {
            id: 'elk-stack',
            subHeader: { index: '006', title: 'ELK Stack — Centralized Logging' },
            title: (
                <SectionTitle>
                    ELK Stack — Elasticsearch, Logstash, Kibana দিয়ে Log Management
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Hundreds of services-এর logs আলাদা আলাদা machine-এ
                            থাকলে debug করা nightmare।{' '}
                            <strong className='text-foreground'>ELK Stack</strong>{' '}
                            সব logs এক জায়গায় এনে searchable করে তোলে।
                            Elasticsearch + Logstash + Kibana + Beats (Filebeat)
                            মিলে complete log pipeline তৈরি করে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                ELK Log Pipeline — App থেকে Kibana পর্যন্ত
                            </p>
                            <svg
                                viewBox='0 0 680 180'
                                className='w-full max-w-2xl mx-auto'>
                                <defs>
                                    <marker
                                        id='elk-arr'
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
                                </defs>
                                {/* App */}
                                <rect
                                    x='10'
                                    y='65'
                                    width='85'
                                    height='50'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#94a3b8'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='52'
                                    y='87'
                                    textAnchor='middle'
                                    fill='#94a3b8'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    Application
                                </text>
                                <text
                                    x='52'
                                    y='100'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    writes logs
                                </text>
                                <text
                                    x='52'
                                    y='113'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    /var/log/*.log
                                </text>
                                <path
                                    d='M 95 90 L 125 90'
                                    stroke='#64748b'
                                    strokeWidth='1.5'
                                    markerEnd='url(#elk-arr)'
                                />
                                {/* Filebeat */}
                                <rect
                                    x='125'
                                    y='65'
                                    width='90'
                                    height='50'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='170'
                                    y='87'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    FILEBEAT
                                </text>
                                <text
                                    x='170'
                                    y='100'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    tail log file
                                </text>
                                <text
                                    x='170'
                                    y='113'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    lightweight agent
                                </text>
                                <path
                                    d='M 215 90 L 245 90'
                                    stroke='#64748b'
                                    strokeWidth='1.5'
                                    markerEnd='url(#elk-arr)'
                                />
                                {/* Logstash */}
                                <rect
                                    x='245'
                                    y='55'
                                    width='100'
                                    height='70'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#f97316'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='295'
                                    y='79'
                                    textAnchor='middle'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    LOGSTASH
                                </text>
                                <text
                                    x='295'
                                    y='93'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Parse &amp; filter
                                </text>
                                <text
                                    x='295'
                                    y='107'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Transform
                                </text>
                                <text
                                    x='295'
                                    y='119'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Enrich metadata
                                </text>
                                <path
                                    d='M 345 90 L 375 90'
                                    stroke='#64748b'
                                    strokeWidth='1.5'
                                    markerEnd='url(#elk-arr)'
                                />
                                {/* Elasticsearch */}
                                <rect
                                    x='375'
                                    y='55'
                                    width='120'
                                    height='70'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#eab308'
                                    strokeWidth='2'
                                />
                                <text
                                    x='435'
                                    y='79'
                                    textAnchor='middle'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    ELASTICSEARCH
                                </text>
                                <text
                                    x='435'
                                    y='93'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Index &amp; store
                                </text>
                                <text
                                    x='435'
                                    y='107'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Full-text search
                                </text>
                                <text
                                    x='435'
                                    y='119'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Inverted index
                                </text>
                                <path
                                    d='M 495 90 L 525 90'
                                    stroke='#64748b'
                                    strokeWidth='1.5'
                                    markerEnd='url(#elk-arr)'
                                />
                                {/* Kibana */}
                                <rect
                                    x='525'
                                    y='65'
                                    width='90'
                                    height='50'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#ef4444'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='570'
                                    y='87'
                                    textAnchor='middle'
                                    fill='#ef4444'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    KIBANA
                                </text>
                                <text
                                    x='570'
                                    y='100'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Search UI
                                </text>
                                <text
                                    x='570'
                                    y='113'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Dashboards
                                </text>
                                {/* Bottom labels */}
                                <text
                                    x='52'
                                    y='160'
                                    textAnchor='middle'
                                    fill='#475569'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Service
                                </text>
                                <text
                                    x='170'
                                    y='160'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Beats family
                                </text>
                                <text
                                    x='295'
                                    y='160'
                                    textAnchor='middle'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Pipeline
                                </text>
                                <text
                                    x='435'
                                    y='160'
                                    textAnchor='middle'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Storage + Search
                                </text>
                                <text
                                    x='570'
                                    y='160'
                                    textAnchor='middle'
                                    fill='#ef4444'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Visualization
                                </text>
                            </svg>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'structured_logging.py — JSON Structured Log Format',
                    code: `import logging
import json
import time
import uuid
from contextvars import ContextVar

# Correlation ID — request-এর পুরো journey track করতে
_correlation_id: ContextVar[str] = ContextVar('correlation_id', default='')

class StructuredLogger:
    def __init__(self, service_name: str):
        self.service = service_name

    def _log(self, level: str, message: str, **extra):
        record = {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime()),
            "level": level,
            "service": self.service,
            "correlation_id": _correlation_id.get(),  # Track across services
            "message": message,
            **extra  # Additional context fields
        }
        print(json.dumps(record))  # ELK collects stdout

    def info(self, msg: str, **kw): self._log("INFO", msg, **kw)
    def error(self, msg: str, **kw): self._log("ERROR", msg, **kw)
    def warn(self, msg: str, **kw): self._log("WARN", msg, **kw)


# Usage example
logger = StructuredLogger("payment-service")

def process_payment(user_id: str, amount: float, request_id: str):
    _correlation_id.set(request_id)  # Set for this request lifecycle

    logger.info("payment_started",
        user_id=user_id,
        amount=amount,
        currency="BDT"
    )

    try:
        result = charge_card(user_id, amount)
        logger.info("payment_success",
            user_id=user_id,
            amount=amount,
            transaction_id=result.txn_id,
            duration_ms=result.duration
        )
        return result
    except Exception as e:
        logger.error("payment_failed",
            user_id=user_id,
            amount=amount,
            error=str(e),
            error_type=type(e).__name__
        )
        raise

# Output (ELK ingests this JSON):
# {"timestamp":"2026-05-08T03:15:22.000Z","level":"ERROR",
#  "service":"payment-service","correlation_id":"req-abc-123",
#  "message":"payment_failed","user_id":"u-456","amount":1500.0,
#  "error":"DB connection timeout","error_type":"TimeoutError"}`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: '⚠️ Log Cardinality এবং Log Levels',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>Log Cardinality সমস্যা:</strong> User ID,
                                Order ID, Trace ID — এগুলো log field হিসেবে
                                ঠিক আছে। কিন্তু IP address বা timestamp কে
                                field key বানালেন Elasticsearch-এর mapping
                                explosion হয়। High cardinality fields value-এ
                                রাখুন, key-তে নয়।
                            </p>
                            <p>
                                <strong>Log Levels:</strong> Production-এ{' '}
                                <code className='font-mono text-xs bg-muted/50 px-1 rounded'>
                                    INFO
                                </code>{' '}
                                বা{' '}
                                <code className='font-mono text-xs bg-muted/50 px-1 rounded'>
                                    WARN
                                </code>{' '}
                                রাখুন।{' '}
                                <code className='font-mono text-xs bg-muted/50 px-1 rounded'>
                                    DEBUG
                                </code>{' '}
                                log production-এ enable থাকলে storage cost
                                ১০x বাড়তে পারে। Sampling strategy use করুন।
                            </p>
                        </div>
                    ),
                },
            ],
        },

        // ─────────────────────────────────────────────────
        // 007 — Code Examples
        // ─────────────────────────────────────────────────
        {
            id: 'code-examples',
            subHeader: { index: '007', title: 'Production Code Examples' },
            title: (
                <SectionTitle>
                    Production Code — Metrics + Logs + Traces একসাথে
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Real production code-এ তিনটা pillar একসাথে থাকে।
                            নিচের example-এ Node.js service-এ Prometheus
                            metrics, structured logging, এবং OpenTelemetry
                            trace — সবই একই request handling-এ integrate করা
                            হয়েছে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'orderService.js — Node.js Full Observability',
                    code: `const express = require('express');
const { MeterProvider } = require('@opentelemetry/sdk-metrics');
const { trace, context } = require('@opentelemetry/api');
const promClient = require('prom-client');

const app = express();

// ─── 1. METRICS — Prometheus ───
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

const httpLatency = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

// ─── 2. STRUCTURED LOGGING ───
function log(level, message, fields = {}) {
  const span = trace.getActiveSpan();
  const spanCtx = span?.spanContext();

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    service: 'order-service',
    message,
    trace_id: spanCtx?.traceId || '',   // Link log to trace
    span_id: spanCtx?.spanId || '',
    ...fields,
  };
  console.log(JSON.stringify(entry));   // ELK / Loki ingests stdout
}

// ─── 3. TRACES — OpenTelemetry ───
const tracer = trace.getTracer('order-service', '1.0.0');

// ─── Request Handler ───
app.post('/orders', async (req, res) => {
  const startTime = Date.now();
  const { userId, items } = req.body;

  // Span: entire request
  return tracer.startActiveSpan('create-order', async (span) => {
    try {
      span.setAttributes({
        'user.id': userId,
        'order.item_count': items.length,
      });

      log('INFO', 'order_request_received', {
        user_id: userId,
        item_count: items.length,
      });

      // Nested span: validate
      const inventory = await tracer.startActiveSpan('validate-inventory',
        async (invSpan) => {
          const result = await checkInventory(items);
          invSpan.setAttributes({ 'inventory.available': result.available });
          invSpan.end();
          return result;
        }
      );

      if (!inventory.available) {
        span.setStatus({ code: 2, message: 'out_of_stock' });
        log('WARN', 'order_rejected', { reason: 'out_of_stock', user_id: userId });
        res.status(400).json({ error: 'out_of_stock' });
        return;
      }

      // Nested span: save to DB
      const order = await tracer.startActiveSpan('save-order-db',
        async (dbSpan) => {
          const saved = await db.save({ userId, items, status: 'pending' });
          dbSpan.setAttribute('db.order_id', saved.id);
          dbSpan.end();
          return saved;
        }
      );

      const durationMs = Date.now() - startTime;
      log('INFO', 'order_created', {
        user_id: userId,
        order_id: order.id,
        duration_ms: durationMs,
      });

      // Record metrics
      httpRequestCounter.inc({ method: 'POST', route: '/orders', status_code: 201 });
      httpLatency.observe({ method: 'POST', route: '/orders' }, durationMs / 1000);

      span.setStatus({ code: 1 });
      res.status(201).json({ orderId: order.id });

    } catch (err) {
      span.recordException(err);
      span.setStatus({ code: 2, message: err.message });

      log('ERROR', 'order_creation_failed', {
        user_id: userId,
        error: err.message,
        stack: err.stack,
      });

      httpRequestCounter.inc({ method: 'POST', route: '/orders', status_code: 500 });
      res.status(500).json({ error: 'internal_error' });
    } finally {
      span.end();
    }
  });
});

// ─── Prometheus scrape endpoint ───
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(3000);`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Correlation ID — ৩টা Pillar Connect করার চাবিকাঠি',
                    content: (
                        <p>
                            Log-এ{' '}
                            <code className='font-mono text-xs bg-muted/50 px-1 rounded'>
                                trace_id
                            </code>{' '}
                            include করলেন Kibana-তে log দেখতে দেখতে সরাসরি
                            Jaeger-এ trace jump করা যায়। Grafana-তে latency
                            spike দেখলে সেই exact timestamp-এর trace খুঁজুন —
                            কোন span সবচেয়ে বেশি সময় নিয়েছে বোঝা যাবেন।
                            এটাই observability-র real power।
                        </p>
                    ),
                },
            ],
        },

        // ─────────────────────────────────────────────────
        // 008 — Real World & Interview
        // ─────────────────────────────────────────────────
        {
            id: 'real-world-interview',
            subHeader: { index: '008', title: 'Real World & Interview Tips' },
            title: (
                <SectionTitle>
                    Real World Use Cases এবং Interview Tips
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Company', 'Metrics', 'Logs', 'Tracing', 'বিশেষত্ব'],
                    rows: [
                        [
                            <span className='text-red-700 dark:text-red-400 font-semibold'>Netflix</span>,
                            'Atlas (custom)',
                            'Elasticsearch',
                            'Zipkin',
                            'Chaos engineering + observability integrated',
                        ],
                        [
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>Uber</span>,
                            'M3 (custom)',
                            'ELK Stack',
                            'Jaeger (created by Uber)',
                            'Jaeger open-sourced করেছেনে Uber',
                        ],
                        [
                            <span className='text-primary font-semibold'>Google</span>,
                            'Monarch',
                            'Cloud Logging',
                            'Dapper (invented tracing)',
                            'Dapper paper — distributed tracing এর origin',
                        ],
                        [
                            <span className='text-yellow-700 dark:text-yellow-400 font-semibold'>Facebook</span>,
                            'ODS',
                            'Scribe',
                            'Canopy',
                            'Billions of events/sec log processing',
                        ],
                        [
                            <span className='text-orange-700 dark:text-orange-400 font-semibold'>Airbnb</span>,
                            'Prometheus',
                            'ELK',
                            'Jaeger',
                            'Standard OSS stack, heavily customized',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    steps: [
                        {
                            title: (
                                <span className='font-mono text-primary'>
                                    Interview Question: &quot;System কীভাবে monitor করবেন?&quot;
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    সবার আগে বলুন: &quot;Observability এর ৩টা pillar
                                    দিয়ে approach করবো — Metrics, Logs, Traces।&quot;
                                    তারপর প্রতিটা layer explain করুন। এই structure
                                    দেখলে interviewer বুঝবেন আপনি production experience
                                    আছে।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-emerald-700 dark:text-emerald-400'>
                                    Metrics প্রথমে — &quot;কী হচ্ছে&quot; জানেন
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Prometheus + Grafana। Key metrics mention করুন:
                                    error rate, P99 latency, RPS, CPU/memory। Golden
                                    Signals: Latency, Traffic, Errors, Saturation
                                    (LETS) বলুন — Google SRE book থেকে।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-yellow-700 dark:text-yellow-400'>
                                    Logs দিয়ে &quot;কেন হচ্ছে&quot; বোঝো
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    ELK Stack। Structured logging (JSON) এর গুরুত্ব
                                    explain করুন। Correlation ID দিয়ে request trace
                                    করার কথা বলুন।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-purple-700 dark:text-purple-400'>
                                    Traces দিয়ে &quot;কোথায় হচ্ছে&quot; নির্দিষ্ট করুন
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Jaeger + OpenTelemetry। Distributed system-এ
                                    কোন service bottleneck সেটা trace waterfall দিয়ে
                                    দেখা যায়। P99 latency অনেক বেশি হলে trace দেখুন।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-orange-700 dark:text-orange-400'>
                                    Alerting Strategy — Symptoms-based Alert
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Alert on symptoms, not causes। &quot;Error rate &gt; 5%&quot;
                                    alert করুন, &quot;CPU &gt; 80%&quot; নয়। CPU high হওয়া
                                    মানে user impact নেই, কিন্তু error rate high মানে
                                    users ক্ষতিগ্রস্ত।
                                </span>
                            ),
                        },
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Alerting Best Practices',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>Alert on symptoms, not causes:</strong>{' '}
                                &quot;Payment error rate &gt; 5%&quot; alert করুন।
                                &quot;DB CPU &gt; 90%&quot; alert করুন না — DB CPU
                                high হতে পারে কিন্তু users affect না হতেও পারে।
                            </p>
                            <p>
                                <strong>Alert fatigue এড়াও:</strong> বেশি alert
                                = কম attention। Critical alert-এ সাড়া দেওয়ার
                                culture নষ্ট হয়। প্রতিটা alert actionable হতে
                                হবে।
                            </p>
                            <p>
                                <strong>Error Budget:</strong> SLO miss করলেন
                                alert। যেমন: 99.9% availability = month-এ
                                মাত্র ৪৩ মিনিট downtime budget। এই budget শেষ
                                হলে feature deployment বন্ধ করুন।
                            </p>
                            <p>
                                <strong>Runbook link:</strong> প্রতিটা alert-এ
                                runbook link রাখুন। রাত ৩টায় alert পেলে কী
                                করতে হবে — step-by-step documented।
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-5 mt-2'>
                            <p className='font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4'>
                                Observability Stack — Quick Reference
                            </p>
                            <div className='space-y-3'>
                                {[
                                    {
                                        category: 'Metrics',
                                        tools: ['Prometheus', 'Grafana', 'Thanos (long-term)'],
                                        color: 'text-yellow-700 dark:text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
                                    },
                                    {
                                        category: 'Logs',
                                        tools: ['Elasticsearch', 'Logstash', 'Kibana', 'Filebeat', 'Loki (lightweight)'],
                                        color: 'text-primary border-primary/30 bg-primary/5',
                                    },
                                    {
                                        category: 'Traces',
                                        tools: ['Jaeger', 'Zipkin', 'Tempo', 'OpenTelemetry SDK'],
                                        color: 'text-purple-700 dark:text-purple-400 border-purple-400/30 bg-purple-400/5',
                                    },
                                    {
                                        category: 'Alerting',
                                        tools: ['AlertManager', 'PagerDuty', 'OpsGenie', 'Slack'],
                                        color: 'text-red-700 dark:text-red-400 border-red-400/30 bg-red-400/5',
                                    },
                                ].map((row, i) => (
                                    <div key={i} className='flex flex-wrap items-center gap-3'>
                                        <span
                                            className={`font-mono text-xs px-3 py-1 border rounded w-24 text-center flex-shrink-0 ${row.color}`}>
                                            {row.category}
                                        </span>
                                        <div className='flex flex-wrap gap-2'>
                                            {row.tools.map((tool, j) => (
                                                <span
                                                    key={j}
                                                    className='font-mono text-xs px-2 py-1 border border-border text-muted-foreground rounded'>
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                },
            ],
        },
    ],

    summary: {
        headers: ['Pillar', 'Tool', 'কী জানায়', 'Query Language', 'সেরা Use Case'],
        rows: [
            [
                <span className='font-bold text-yellow-700 dark:text-yellow-400 font-mono'>Metrics</span>,
                'Prometheus + Grafana',
                'Aggregated numbers over time',
                'PromQL',
                'Alerting, SLO tracking, capacity planning',
            ],
            [
                <span className='font-bold text-primary font-mono'>Logs</span>,
                'ELK Stack / Loki',
                'Detailed event records',
                'KQL / LogQL',
                'Error debugging, audit trail',
            ],
            [
                <span className='font-bold text-purple-700 dark:text-purple-400 font-mono'>Traces</span>,
                'Jaeger + OpenTelemetry',
                'Request journey across services',
                'Trace ID search',
                'Latency bottleneck, microservice debugging',
            ],
            [
                <span className='font-bold text-orange-700 dark:text-orange-400 font-mono'>Alerting</span>,
                'AlertManager + PagerDuty',
                'Proactive incident notification',
                'Alert rules (YAML)',
                'On-call, incident response',
            ],
        ],
    },

    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'Observability এর ৩টা pillar কী?',
                options: [
                    {
                        key: 'a',
                        text: 'CPU, Memory, Disk',
                        isCorrect: false,
                        explanation:
                            'এগুলো infrastructure metrics — observability pillars নয়।',
                    },
                    {
                        key: 'b',
                        text: 'Metrics, Logs, Traces',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Metrics = aggregated numbers (Prometheus), Logs = event records (ELK), Traces = request journey (Jaeger)। এই তিনটা মিলে system-এর full picture দেয়।',
                    },
                    {
                        key: 'c',
                        text: 'Grafana, Kibana, Jaeger',
                        isCorrect: false,
                        explanation:
                            'এগুলো tools — pillars নয়। Grafana = visualization tool।',
                    },
                    {
                        key: 'd',
                        text: 'Alerts, Dashboards, Reports',
                        isCorrect: false,
                        explanation:
                            'এগুলো outputs — core observability pillars নয়।',
                    },
                ],
            },
            {
                id: 2,
                text: 'Prometheus metrics কীভাবে collect করে?',
                options: [
                    {
                        key: 'a',
                        text: 'Services Prometheus-কে push করে',
                        isCorrect: false,
                        explanation:
                            'Push model Graphite বা InfluxDB-র জন্য। Prometheus pull model use করে।',
                    },
                    {
                        key: 'b',
                        text: 'Pull model — Prometheus নিজে /metrics endpoint scrape করে',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Prometheus pull model use করে। প্রতি ১৫ সেকেন্ডে configured services-এর /metrics endpoint থেকে data নিয়ে আসে। এটা simpler — service শুধু expose করে, push করতে হয় না।',
                    },
                    {
                        key: 'c',
                        text: 'Message queue থেকে consume করে',
                        isCorrect: false,
                        explanation:
                            'Prometheus message queue নয় — time series database with pull scraping।',
                    },
                    {
                        key: 'd',
                        text: 'Agent install করে প্রতিটা server-এ',
                        isCorrect: false,
                        explanation:
                            'Node Exporter agent আছে কিন্তু Prometheus-এর core mechanism হলো pull/scrape।',
                    },
                ],
            },
            {
                id: 3,
                text: 'P99 latency মানে কী?',
                options: [
                    {
                        key: 'a',
                        text: 'Average latency',
                        isCorrect: false,
                        explanation:
                            'Average latency P50 (median) এর কাছাকাছি। P99 ভিন্ন concept।',
                    },
                    {
                        key: 'b',
                        text: 'সবচেয়ে slow request এর latency',
                        isCorrect: false,
                        explanation:
                            'সবচেয়ে slow = P100 বা max। P99 হলো ৯৯th percentile।',
                    },
                    {
                        key: 'c',
                        text: '৯৯% requests এর latency এর নিচে যে value',
                        isCorrect: true,
                        explanation:
                            'সঠিক। P99 = ৯৯th percentile। মানে ১০০০টা request-এর মধ্যে ৯৯০টা এই latency-র মধ্যে complete হয়েছে। Worst 1% বাদে বাকি সবার experience। SLO তে P99 < 200ms মানে ৯৯% users fast experience পাচ্ছে।',
                    },
                    {
                        key: 'd',
                        text: '৯৯% server uptime',
                        isCorrect: false,
                        explanation:
                            'Uptime percentage আলাদা metric। P99 latency percentile।',
                    },
                ],
            },
            {
                id: 4,
                text: 'Jaeger কোন ধরনের observability এর জন্য?',
                options: [
                    {
                        key: 'a',
                        text: 'Metrics collection',
                        isCorrect: false,
                        explanation:
                            'Metrics collection হলো Prometheus-এর কাজ। Jaeger traces করে।',
                    },
                    {
                        key: 'b',
                        text: 'Log aggregation',
                        isCorrect: false,
                        explanation:
                            'Log aggregation ELK Stack-এর কাজ। Jaeger distributed tracing।',
                    },
                    {
                        key: 'c',
                        text: 'Distributed tracing',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Jaeger distributed tracing system — Uber তৈরি করেছেনে, পরে open-source। Microservices-এ একটা request কোন service-এ কতক্ষণ, কোথায় error হয়েছে — trace waterfall দিয়ে দেখা যায়।',
                    },
                    {
                        key: 'd',
                        text: 'Dashboard visualization',
                        isCorrect: false,
                        explanation:
                            'Dashboard visualization Grafana-র কাজ। Jaeger trace viewer।',
                    },
                ],
            },
            {
                id: 5,
                text: 'Logstash কী করে?',
                options: [
                    {
                        key: 'a',
                        text: 'Log file search করে',
                        isCorrect: false,
                        explanation:
                            'Search করা Elasticsearch-এর কাজ। Logstash pipeline।',
                    },
                    {
                        key: 'b',
                        text: 'Log parse ও transform করে',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Logstash হলো data processing pipeline। Input (Filebeat/Kafka) থেকে log নিয়ে parse করে, filter করে, enrich করে, তারপর Elasticsearch-এ output দেয়। grok pattern দিয়ে unstructured log থেকে fields extract করে।',
                    },
                    {
                        key: 'c',
                        text: 'Log dashboard তৈরি করে',
                        isCorrect: false,
                        explanation: 'Dashboard তৈরি Kibana-র কাজ।',
                    },
                    {
                        key: 'd',
                        text: 'Log store করে',
                        isCorrect: false,
                        explanation:
                            'Storage Elasticsearch-এর কাজ। Logstash processing pipeline।',
                    },
                ],
            },
            {
                id: 6,
                text: 'Counter metric কখন reset হয়?',
                options: [
                    {
                        key: 'a',
                        text: 'প্রতি মিনিটে',
                        isCorrect: false,
                        explanation:
                            'Counter time-based reset হয় না — শুধু বাড়তে থাকে।',
                    },
                    {
                        key: 'b',
                        text: 'Midnight-এ',
                        isCorrect: false,
                        explanation:
                            'Counter midnight reset হয় না। Service lifecycle follow করে।',
                    },
                    {
                        key: 'c',
                        text: 'Service restart এ',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Counter শুধু বাড়ে, কমে না। Service restart হলে 0 থেকে শুরু হয়। এজন্য PromQL-এ rate() বা increase() function use করুন — restart handle করে। http_requests_total deploy-এর পর reset হয়ে যায়।',
                    },
                    {
                        key: 'd',
                        text: 'কখনো reset হয় না',
                        isCorrect: false,
                        explanation:
                            'Service restart-এ reset হয়। Counter in-memory state।',
                    },
                ],
            },
            {
                id: 7,
                text: 'OpenTelemetry কী?',
                options: [
                    {
                        key: 'a',
                        text: 'Google-এর proprietary monitoring tool',
                        isCorrect: false,
                        explanation:
                            'OpenTelemetry CNCF project — vendor-neutral, open-source।',
                    },
                    {
                        key: 'b',
                        text: 'Only for Python applications',
                        isCorrect: false,
                        explanation:
                            'OpenTelemetry multi-language — Python, Java, Go, Node.js, .NET সব support করে।',
                    },
                    {
                        key: 'c',
                        text: 'Vendor-neutral observability framework',
                        isCorrect: true,
                        explanation:
                            'সঠিক। OpenTelemetry (OTel) হলো CNCF-এর vendor-neutral standard। Metrics, Logs, Traces তিনটার জন্যই SDK আছে। একবার instrument করলেন Jaeger, Zipkin, Datadog, New Relic — যেকোনো backend-এ export করা যায়।',
                    },
                    {
                        key: 'd',
                        text: 'Jaeger-এর old name',
                        isCorrect: false,
                        explanation:
                            'Jaeger আলাদা tool। OpenTelemetry পৃথক framework যা Jaeger-এ export করতে পারে।',
                    },
                ],
            },
            {
                id: 8,
                text: 'ELK এর "K" মানে কী?',
                options: [
                    {
                        key: 'a',
                        text: 'Kafka',
                        isCorrect: false,
                        explanation:
                            'Kafka ELK stack-এর core part নয় — optional input source হতে পারে।',
                    },
                    {
                        key: 'b',
                        text: 'Kubernetes',
                        isCorrect: false,
                        explanation:
                            'Kubernetes আলাদা platform। ELK-এর K হলো Kibana।',
                    },
                    {
                        key: 'c',
                        text: 'Kibana',
                        isCorrect: true,
                        explanation:
                            'সঠিক। ELK = Elasticsearch (storage + search) + Logstash (pipeline) + Kibana (visualization)। Kibana হলো web UI — log search, dashboards, visualizations।',
                    },
                    {
                        key: 'd',
                        text: 'Kinesis',
                        isCorrect: false,
                        explanation:
                            'AWS Kinesis আলাদা streaming service। ELK-এর K = Kibana।',
                    },
                ],
            },
            {
                id: 9,
                text: 'SLO এবং SLA এর পার্থক্য কী?',
                options: [
                    {
                        key: 'a',
                        text: 'Same thing, different names',
                        isCorrect: false,
                        explanation:
                            'SLO এবং SLA distinctly different concepts।',
                    },
                    {
                        key: 'b',
                        text: 'SLO internal target, SLA external contract with customers',
                        isCorrect: true,
                        explanation:
                            'সঠিক। SLO = team-এর internal goal (যেমন 99.9% availability)। SLA = customer-এর সাথে contract (যেমন 99.5% guarantee)। SLO > SLA রাখুন — buffer দরকার। SLO miss করলেন শুধু team জানে, SLA miss করলেন customer penalty claim করতে পারে।',
                    },
                    {
                        key: 'c',
                        text: 'SLA internal, SLO external',
                        isCorrect: false,
                        explanation:
                            'উল্টো। SLO = internal objective, SLA = external agreement।',
                    },
                    {
                        key: 'd',
                        text: 'SLO শুধু latency, SLA শুধু availability',
                        isCorrect: false,
                        explanation:
                            'উভয়ই latency, availability, error rate — যেকোনো metric cover করতে পারে।',
                    },
                ],
            },
            {
                id: 10,
                text: 'Trace ID কেন propagate করা দরকার?',
                options: [
                    {
                        key: 'a',
                        text: 'Authentication এর জন্য',
                        isCorrect: false,
                        explanation:
                            'Trace ID authentication-এর জন্য নয় — request tracking-এর জন্য।',
                    },
                    {
                        key: 'b',
                        text: 'Database query optimize করতে',
                        isCorrect: false,
                        explanation:
                            'Trace ID query optimization করে না — observability-র জন্য।',
                    },
                    {
                        key: 'c',
                        text: 'Distributed services এ request track করতে — সব service-এর span এক trace-এ link করতে',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Service A → B → C → D একটা request process করে। Trace ID না থাকলে প্রতিটার span আলাদা, request-এর full journey বোঝা যায় না। Trace ID HTTP header (traceparent) দিয়ে propagate হলে Jaeger-এ একটাই waterfall diagram-এ পুরো journey দেখা যায়।',
                    },
                    {
                        key: 'd',
                        text: 'Load balancing improve করতে',
                        isCorrect: false,
                        explanation:
                            'Load balancing আলাদা concern। Trace ID observability-র জন্য।',
                    },
                ],
            },
        ],
    },

    assignment: {
        title: 'Observability Stack Setup করুন',
        time: '৩-৪ ঘন্টা',
        difficulty: 'Advanced',
        tasks: [
            <span>
                <strong>Prometheus + Grafana Setup:</strong> Docker Compose দিয়ে
                Prometheus এবং Grafana চালু করুন। একটা simple Node.js/Python
                service-এ prom-client/prometheus_client দিয়ে custom Counter এবং
                Histogram metric expose করুন। Grafana-তে error rate এবং P99 latency
                dashboard বানান।
            </span>,
            <span>
                <strong>Structured Logging:</strong> Python বা Node.js-এ JSON
                structured logger লিখুন। প্রতিটা log entry-তে timestamp, level,
                service, correlation_id, এবং custom fields থাকবেন। Error
                scenario-তে error_type এবং stack trace include করুন।
            </span>,
            <span>
                <strong>Jaeger Tracing with OpenTelemetry:</strong> Docker-এ
                Jaeger চালু করুন। FastAPI বা Express app-এ OpenTelemetry SDK
                integrate করুন। দুটো service-এর মধ্যে HTTP call-এ trace context
                propagate করুন। Jaeger UI-তে trace waterfall দেখুন।
            </span>,
            <span>
                <strong>Alert Rule লিখুন:</strong> Prometheus alert rule তৈরি
                করুন: (ক) Error rate &gt; 5% for 2 minutes, (খ) P99 latency &gt;
                500ms for 5 minutes। AlertManager-এ Slack webhook configure করুন।
            </span>,
            <span>
                <strong>SLO Dashboard:</strong> একটা service-এর জন্য SLO
                define করুন (99.9% availability, P99 &lt; 200ms)। Grafana-তে
                current SLI vs SLO target compare করার dashboard বানান।
            </span>,
        ],
        deliverables: [
            <span>Docker Compose file (Prometheus + Grafana + Jaeger)</span>,
            <span>Grafana dashboard screenshot (error rate + latency panels)</span>,
            <span>Structured log output example (JSON format)</span>,
            <span>Jaeger trace waterfall screenshot (2+ services)</span>,
        ],
    },

    practicalLab: {
        title: 'Prometheus + Grafana + Jaeger Stack',
        subtitle: 'Docker Compose + Node.js + OpenTelemetry',
        steps: [
            {
                title: 'Docker Compose Stack চালু করুন',
                description:
                    'Prometheus (port 9090), Grafana (port 3000), Jaeger (port 16686) সহ complete observability stack Docker Compose-এ define করুন।',
            },
            {
                title: 'Node.js Service Instrument করুন',
                description:
                    'prom-client দিয়ে /metrics endpoint তৈরি করুন। Counter, Histogram add করুন। OpenTelemetry SDK setup করুন Jaeger exporter সহ।',
            },
            {
                title: 'Prometheus Scrape Config লিখুন',
                description:
                    'prometheus.yml-এ scrape_configs-এ service endpoint add করুন। Prometheus UI-তে targets up কিনা verify করুন।',
            },
            {
                title: 'Grafana Dashboard বানান',
                description:
                    'Prometheus data source add করুন। Error rate, P99 latency, RPS — তিনটা panel সহ dashboard বানান।',
            },
            {
                title: 'Trace Context দুটো Service এ Propagate করুন',
                description:
                    'Service A থেকে Service B-কে HTTP call করুন। OpenTelemetry inject/extract করুন। Jaeger UI-তে দুটো service-এর span একই trace-এ দেখুন।',
            },
        ],
        codeBlock: {
            language: 'yaml',
            filename: 'docker-compose.observability.yml',
            code: `version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.retention.time=15d'

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus

  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686"   # Jaeger UI
      - "6831:6831/udp" # Jaeger agent (UDP)
      - "4317:4317"     # OTLP gRPC
    environment:
      - COLLECTOR_OTLP_ENABLED=true

  # Your app service
  order-service:
    build: ./order-service
    ports:
      - "8080:8080"
    environment:
      - OTEL_SERVICE_NAME=order-service
      - OTEL_EXPORTER_JAEGER_AGENT_HOST=jaeger
      - PROMETHEUS_PORT=9100
    depends_on:
      - jaeger

volumes:
  grafana_data:

---
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'order-service'
    static_configs:
      - targets: ['order-service:9100']

  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']`,
        },
        tip: 'Jaeger UI (localhost:16686) এ গিয়ে "Find Traces" এ service select করুন। প্রথমবার trace দেখলে বুঝবেন কেন distributed tracing এত powerful — কোন service slow সেটা one glance-এ স্পষ্ট।',
    },
};
