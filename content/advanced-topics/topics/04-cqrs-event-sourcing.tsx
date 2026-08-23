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

export const cqrsEventSourcingContent: TopicData = {
    id: 'cqrs-event-sourcing',
    sections: [
        {
            id: 'crud-problem',
            subHeader: { index: '001', title: 'CRUD এর সমস্যা' },
            title: (
                <SectionTitle>
                    Traditional CRUD এর সমস্যা কোথায়?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-4'>
                            <div className='flex flex-wrap gap-3 mb-6'>
                                <span className='font-mono text-xs px-3 py-1 border border-primary/30 text-primary bg-primary/5 rounded'>
                                    ⏱ ১২০-১৫০ মিনিট
                                </span>
                                <span className='font-mono text-xs px-3 py-1 border border-red-400/30 text-red-700 dark:text-red-400 bg-red-400/5 rounded'>
                                    🔴 Expert Level
                                </span>
                                <span className='font-mono text-xs px-3 py-1 border border-orange-400/30 text-orange-700 dark:text-orange-400 bg-orange-400/5 rounded'>
                                    ⚡ Advanced Patterns
                                </span>
                                <span className='font-mono text-xs px-3 py-1 border border-purple-400/30 text-purple-700 dark:text-purple-400 bg-purple-400/5 rounded'>
                                    TOPIC 04 / Phase 5
                                </span>
                            </div>
                            <ContentParagraph>
                                Traditional CRUD (Create, Read, Update, Delete) সহজ ও সুন্দর —
                                কিন্তু complex domain-এ এটি{' '}
                                <strong className='text-foreground'>
                                    চারটি মৌলিক সমস্যা
                                </strong>{' '}
                                তৈরি করে। একটা banking system বা e-commerce platform
                                যখন scale করতে চায়, তখন এই সমস্যাগুলো তীব্র হয়ে ওঠে।
                            </ContentParagraph>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                                {[
                                    {
                                        num: '01',
                                        title: 'Read/Write Mismatch',
                                        desc: 'Read model ও Write model এর structure প্রায়ই আলাদা। Write: normalized tables। Read: denormalized, joined views। Same DB schema উভয়কে efficiently serve করতে পারে না।',
                                        color: 'border-red-500/30 text-red-700 dark:text-red-400',
                                    },
                                    {
                                        num: '02',
                                        title: 'Lock Contention',
                                        desc: 'Same row-এ Read ও Write একসাথে হলে database lock। High traffic-এ read query write-কে block করে, write query read-কে block করে। Performance bottleneck।',
                                        color: 'border-orange-400/30 text-orange-700 dark:text-orange-400',
                                    },
                                    {
                                        num: '03',
                                        title: 'No Audit Trail',
                                        desc: 'UPDATE করলেন পুরনো value চলে যায়। "Account balance কাল কত ছিল?" — CRUD system জানে না। History track করতে পারে না।',
                                        color: 'border-yellow-400/30 text-yellow-700 dark:text-yellow-400',
                                    },
                                    {
                                        num: '04',
                                        title: 'Time Travel Impossible',
                                        desc: '"৩ মাস আগের state দেখাও" — CRUD-এ অসম্ভব। Data মুছে যায়, overwrite হয়। Past state reconstruct করার উপায় নেই।',
                                        color: 'border-purple-400/30 text-purple-700 dark:text-purple-400',
                                    },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className={`bg-muted/30 border rounded-lg p-5 ${item.color.split(' ')[0]}`}>
                                        <div className='flex items-center gap-3 mb-3'>
                                            <span
                                                className={`font-mono text-xs px-2 py-0.5 border rounded ${item.color} bg-muted/30`}>
                                                {item.num}
                                            </span>
                                            <span
                                                className={`font-mono text-sm font-bold ${item.color.split(' ')[1]}`}>
                                                {item.title}
                                            </span>
                                        </div>
                                        <p className='text-sm text-muted-foreground leading-relaxed'>
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 Solution: CQRS + Event Sourcing',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>CQRS = Read ও Write কে আলাদা করুন।</strong>{' '}
                                Command (write) আলাদা model, Query (read) আলাদা model।
                                প্রতিটা তার নিজের কাজ optimally করে।
                            </p>
                            <p>
                                <strong>Event Sourcing = State নয়, Events store করুন।</strong>{' '}
                                "Balance = 5000 টাকা" না রেখে রাখুন: "Deposited 10000,
                                Withdrawn 5000"। Events replay করলেন যেকোনো সময়ের state পানয়া যায়।
                            </p>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'cqrs-pattern',
            subHeader: { index: '002', title: 'CQRS Pattern' },
            title: (
                <SectionTitle>
                    CQRS — Command Query Responsibility Segregation
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            CQRS একটি architectural pattern যেখানে{' '}
                            <strong className='text-foreground'>Command</strong> (data
                            পরিবর্তন করে) এবং{' '}
                            <strong className='text-foreground'>Query</strong> (data পড়ে) —
                            এই দুটি দায়িত্ব সম্পূর্ণ আলাদা করা হয়। আলাদা model, আলাদা database,
                            আলাদা service।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                CQRS Architecture — Command Side + Query Side
                            </p>
                            <svg
                                viewBox='0 0 700 320'
                                className='w-full max-w-2xl mx-auto'>
                                <defs>
                                    <marker
                                        id='cqrs-arr'
                                        markerWidth='8'
                                        markerHeight='8'
                                        refX='6'
                                        refY='3'
                                        orient='auto'>
                                        <path d='M0,0 L0,6 L8,3 z' fill='#64748b' />
                                    </marker>
                                    <marker
                                        id='cqrs-arrC'
                                        markerWidth='8'
                                        markerHeight='8'
                                        refX='6'
                                        refY='3'
                                        orient='auto'>
                                        <path d='M0,0 L0,6 L8,3 z' fill='#06b6d4' />
                                    </marker>
                                    <marker
                                        id='cqrs-arrG'
                                        markerWidth='8'
                                        markerHeight='8'
                                        refX='6'
                                        refY='3'
                                        orient='auto'>
                                        <path d='M0,0 L0,6 L8,3 z' fill='#10b981' />
                                    </marker>
                                    <marker
                                        id='cqrs-arrO'
                                        markerWidth='8'
                                        markerHeight='8'
                                        refX='6'
                                        refY='3'
                                        orient='auto'>
                                        <path d='M0,0 L0,6 L8,3 z' fill='#f97316' />
                                    </marker>
                                </defs>

                                {/* Client */}
                                <rect x='10' y='130' width='80' height='50' rx='4'
                                    fill='transparent' stroke='#8b5cf6' strokeWidth='1.5' />
                                <text x='50' y='152' textAnchor='middle' fill='#8b5cf6'
                                    fontFamily='monospace' fontSize='9'>CLIENT</text>
                                <text x='50' y='166' textAnchor='middle' fill='#64748b'
                                    fontFamily='monospace' fontSize='8'>App / API</text>

                                {/* Command side arrow */}
                                <path d='M 90 145 L 145 100' stroke='#f97316'
                                    strokeWidth='1.5' markerEnd='url(#cqrs-arrO)' />
                                <text x='100' y='118' fill='#f97316' fontFamily='monospace' fontSize='8'>Command</text>

                                {/* Query side arrow */}
                                <path d='M 90 165 L 145 210' stroke='#10b981'
                                    strokeWidth='1.5' markerEnd='url(#cqrs-arrG)' />
                                <text x='100' y='198' fill='#10b981' fontFamily='monospace' fontSize='8'>Query</text>

                                {/* Command Handler */}
                                <rect x='145' y='60' width='130' height='55' rx='4'
                                    fill='transparent' stroke='#f97316' strokeWidth='2' />
                                <text x='210' y='83' textAnchor='middle' fill='#f97316'
                                    fontFamily='monospace' fontSize='9' fontWeight='bold'>COMMAND HANDLER</text>
                                <text x='210' y='97' textAnchor='middle' fill='#64748b'
                                    fontFamily='monospace' fontSize='8'>Validate + Execute</text>
                                <text x='210' y='108' textAnchor='middle' fill='#64748b'
                                    fontFamily='monospace' fontSize='7'>returns void</text>

                                {/* Write DB */}
                                <rect x='320' y='45' width='120' height='60' rx='4'
                                    fill='transparent' stroke='#f97316' strokeWidth='1.5' />
                                <text x='380' y='70' textAnchor='middle' fill='#f97316'
                                    fontFamily='monospace' fontSize='9'>WRITE DB</text>
                                <text x='380' y='84' textAnchor='middle' fill='#64748b'
                                    fontFamily='monospace' fontSize='8'>PostgreSQL</text>
                                <text x='380' y='97' textAnchor='middle' fill='#475569'
                                    fontFamily='monospace' fontSize='7'>Normalized</text>
                                <path d='M 275 87 L 320 75' stroke='#f97316'
                                    strokeWidth='1.5' markerEnd='url(#cqrs-arrO)' />

                                {/* Event Bus */}
                                <rect x='460' y='130' width='120' height='55' rx='4'
                                    fill='transparent' stroke='#06b6d4' strokeWidth='2' />
                                <text x='520' y='153' textAnchor='middle' fill='#06b6d4'
                                    fontFamily='monospace' fontSize='9' fontWeight='bold'>EVENT BUS</text>
                                <text x='520' y='167' textAnchor='middle' fill='#64748b'
                                    fontFamily='monospace' fontSize='8'>Apache Kafka</text>
                                <text x='520' y='178' textAnchor='middle' fill='#475569'
                                    fontFamily='monospace' fontSize='7'>Async publish</text>
                                <path d='M 440 75 L 520 130' stroke='#64748b'
                                    strokeWidth='1.2' strokeDasharray='4,2' markerEnd='url(#cqrs-arr)' />
                                <text x='472' y='100' fill='#475569' fontFamily='monospace' fontSize='7'>publishes event</text>

                                {/* Query Handler */}
                                <rect x='145' y='195' width='130' height='55' rx='4'
                                    fill='transparent' stroke='#10b981' strokeWidth='2' />
                                <text x='210' y='218' textAnchor='middle' fill='#10b981'
                                    fontFamily='monospace' fontSize='9' fontWeight='bold'>QUERY HANDLER</text>
                                <text x='210' y='232' textAnchor='middle' fill='#64748b'
                                    fontFamily='monospace' fontSize='8'>Read Optimized</text>
                                <text x='210' y='243' textAnchor='middle' fill='#64748b'
                                    fontFamily='monospace' fontSize='7'>returns data</text>

                                {/* Read DB */}
                                <rect x='320' y='200' width='120' height='60' rx='4'
                                    fill='transparent' stroke='#10b981' strokeWidth='1.5' />
                                <text x='380' y='225' textAnchor='middle' fill='#10b981'
                                    fontFamily='monospace' fontSize='9'>READ DB</text>
                                <text x='380' y='239' textAnchor='middle' fill='#64748b'
                                    fontFamily='monospace' fontSize='8'>Elasticsearch</text>
                                <text x='380' y='252' textAnchor='middle' fill='#475569'
                                    fontFamily='monospace' fontSize='7'>Denormalized</text>
                                <path d='M 275 222 L 320 230' stroke='#10b981'
                                    strokeWidth='1.5' markerEnd='url(#cqrs-arrG)' />

                                {/* Event Bus to Read DB sync */}
                                <path d='M 520 185 L 440 230' stroke='#06b6d4'
                                    strokeWidth='1.2' strokeDasharray='4,2' markerEnd='url(#cqrs-arrC)' />
                                <text x='468' y='220' fill='#475569' fontFamily='monospace' fontSize='7'>sync projection</text>

                                {/* Return arrow from Query */}
                                <path d='M 145 240 L 90 185' stroke='#10b981'
                                    strokeWidth='1.2' strokeDasharray='3,2' markerEnd='url(#cqrs-arrG)' />
                                <text x='92' y='225' fill='#10b981' fontFamily='monospace' fontSize='7'>result</text>

                                {/* Labels */}
                                <rect x='10' y='285' width='12' height='8' fill='#f97316' opacity='0.7' rx='1' />
                                <text x='26' y='293' fill='#94a3b8' fontFamily='monospace' fontSize='8'>Command Side (Write)</text>
                                <rect x='200' y='285' width='12' height='8' fill='#10b981' opacity='0.7' rx='1' />
                                <text x='216' y='293' fill='#94a3b8' fontFamily='monospace' fontSize='8'>Query Side (Read)</text>
                                <rect x='390' y='285' width='12' height='8' fill='#06b6d4' opacity='0.7' rx='1' />
                                <text x='406' y='293' fill='#94a3b8' fontFamily='monospace' fontSize='8'>Event Bus (Kafka)</text>
                            </svg>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['বৈশিষ্ট্য', 'Command (Write)', 'Query (Read)'],
                    rows: [
                        ['কাজ', 'State পরিবর্তন করে', 'State পড়ে'],
                        [
                            'Return',
                            <span className='font-mono text-orange-700 dark:text-orange-400'>void / success-failure</span>,
                            <span className='font-mono text-emerald-700 dark:text-emerald-400'>DTO / data</span>,
                        ],
                        ['উদাহরণ', 'PlaceOrder, CancelOrder', 'GetOrderById, ListOrders'],
                        [
                            'Database',
                            <span className='text-orange-700 dark:text-orange-400 font-semibold'>PostgreSQL (normalized)</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>Elasticsearch / Redis</span>,
                        ],
                        ['Consistency', 'Strong (ACID)', 'Eventual (async sync)'],
                        ['Scale', 'Write-optimized', 'Read-optimized'],
                    ],
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'typescript',
                    filename: 'cqrs-commands-queries.ts',
                    code: `// ============================================================
// COMMAND SIDE — Write Model
// ============================================================

interface PlaceOrderCommand {
    type: 'PLACE_ORDER';
    customerId: string;
    items: { productId: string; quantity: number; price: number }[];
    shippingAddress: string;
}

class PlaceOrderCommandHandler {
    constructor(
        private readonly orderRepository: OrderWriteRepository,
        private readonly eventBus: EventBus
    ) {}

    async handle(command: PlaceOrderCommand): Promise<void> {
        // Validate command
        if (command.items.length === 0) {
            throw new Error('Order must have at least one item');
        }

        // Create aggregate and persist to Write DB (PostgreSQL)
        const order = Order.create({
            customerId: command.customerId,
            items: command.items,
            shippingAddress: command.shippingAddress,
        });

        await this.orderRepository.save(order);

        // Publish domain event to Kafka — Query side reads this
        await this.eventBus.publish({
            type: 'OrderPlaced',
            orderId: order.id,
            customerId: order.customerId,
            totalAmount: order.totalAmount,
            timestamp: new Date().toISOString(),
        });

        // Command handler returns void — no data back
    }
}

// ============================================================
// QUERY SIDE — Read Model
// ============================================================

interface GetOrderQuery {
    orderId: string;
}

interface OrderReadModel {
    orderId: string;
    customerName: string;   // Denormalized — no JOIN needed
    customerEmail: string;  // Denormalized — no JOIN needed
    items: { productName: string; quantity: number; price: number }[];
    totalAmount: number;
    status: string;
    createdAt: string;
}

class GetOrderQueryHandler {
    constructor(
        private readonly orderReadRepository: OrderReadRepository // Elasticsearch
    ) {}

    async handle(query: GetOrderQuery): Promise<OrderReadModel> {
        // Read from optimized Read DB — super fast, no JOIN
        const order = await this.orderReadRepository.findById(query.orderId);

        if (!order) {
            throw new Error(\`Order \${query.orderId} not found\`);
        }

        return order; // Returns full data object
    }
}`,
                },
            ],
        },
        {
            id: 'event-sourcing',
            subHeader: { index: '003', title: 'Event Sourcing' },
            title: (
                <SectionTitle>
                    Event Sourcing — State নয়, Events Store করুন
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Traditional CRUD-এ{' '}
                            <strong className='text-foreground'>শুধু current state</strong>{' '}
                            store হয়। Event Sourcing-এ{' '}
                            <strong className='text-foreground'>
                                সব events (যা ঘটেছে) store হয়
                            </strong>
                            । Current state = সব events replay করার ফলাফল।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='bg-muted/30 border border-red-500/20 rounded-lg p-5'>
                                <p className='font-mono text-xs uppercase tracking-widest text-red-700 dark:text-red-400 mb-4'>
                                    ❌ CRUD Approach — Current State Only
                                </p>
                                <div className='space-y-2 font-mono text-sm'>
                                    <div className='bg-muted/50 border border-border rounded p-3'>
                                        <p className='text-xs text-muted-foreground mb-2'>accounts table:</p>
                                        <table className='w-full text-xs'>
                                            <thead>
                                                <tr className='border-b border-border'>
                                                    <th className='text-left pb-1 text-muted-foreground'>id</th>
                                                    <th className='text-right pb-1 text-muted-foreground'>balance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className='pt-2 text-primary'>ACC-001</td>
                                                    <td className='pt-2 text-right text-emerald-700 dark:text-emerald-400'>৳ 5,000</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className='text-xs text-red-700 dark:text-red-400 mt-3'>
                                        ❌ Balance কীভাবে 5000 হলো? অজানা।
                                    </p>
                                    <p className='text-xs text-red-700 dark:text-red-400'>
                                        ❌ ৩ দিন আগে balance কত ছিল? অজানা।
                                    </p>
                                    <p className='text-xs text-red-700 dark:text-red-400'>
                                        ❌ কে টাকা তুলেছে? Audit trail নেই।
                                    </p>
                                </div>
                            </div>
                            <div className='bg-muted/30 border border-emerald-500/20 rounded-lg p-5'>
                                <p className='font-mono text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-4'>
                                    ✅ Event Sourcing — Full History
                                </p>
                                <div className='space-y-2'>
                                    {[
                                        { type: 'AccountOpened', amount: '+৳ 0', time: 'Jan 1', color: 'text-primary' },
                                        { type: 'MoneyDeposited', amount: '+৳ 10,000', time: 'Jan 2', color: 'text-emerald-700 dark:text-emerald-400' },
                                        { type: 'MoneyWithdrawn', amount: '-৳ 3,000', time: 'Jan 3', color: 'text-red-700 dark:text-red-400' },
                                        { type: 'MoneyDeposited', amount: '+৳ 2,000', time: 'Jan 5', color: 'text-emerald-700 dark:text-emerald-400' },
                                        { type: 'MoneyWithdrawn', amount: '-৳ 4,000', time: 'Jan 7', color: 'text-red-700 dark:text-red-400' },
                                    ].map((ev, i) => (
                                        <div key={i} className='flex items-center justify-between py-1.5 border-b border-border last:border-0'>
                                            <div className='flex items-center gap-2'>
                                                <span className='font-mono text-xs text-muted-foreground w-12'>{ev.time}</span>
                                                <span className='font-mono text-xs text-foreground'>{ev.type}</span>
                                            </div>
                                            <span className={`font-mono text-xs font-bold ${ev.color}`}>{ev.amount}</span>
                                        </div>
                                    ))}
                                    <p className='text-xs text-emerald-700 dark:text-emerald-400 mt-2'>
                                        ✅ Balance = Replay → ৳ 5,000
                                    </p>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                Event Timeline — Bank Account
                            </p>
                            <svg viewBox='0 0 660 160' className='w-full max-w-2xl mx-auto'>
                                <defs>
                                    <marker id='es-arr' markerWidth='8' markerHeight='8' refX='6' refY='3' orient='auto'>
                                        <path d='M0,0 L0,6 L8,3 z' fill='#06b6d4' />
                                    </marker>
                                </defs>

                                {/* Timeline line */}
                                <line x1='40' y1='80' x2='620' y2='80' stroke='#334155' strokeWidth='2' />

                                {/* Events */}
                                {[
                                    { x: 80, label: 'AccountOpened', sub: 'Jan 1', amount: '₹ 0', color: '#8b5cf6' },
                                    { x: 210, label: 'MoneyDeposited', sub: 'Jan 2', amount: '+10,000', color: '#10b981' },
                                    { x: 340, label: 'MoneyWithdrawn', sub: 'Jan 3', amount: '-3,000', color: '#ef4444' },
                                    { x: 470, label: 'MoneyDeposited', sub: 'Jan 5', amount: '+2,000', color: '#10b981' },
                                    { x: 590, label: 'MoneyWithdrawn', sub: 'Jan 7', amount: '-4,000', color: '#ef4444' },
                                ].map((ev, i) => (
                                    <g key={i}>
                                        <circle cx={ev.x} cy={80} r={12} fill='transparent' stroke={ev.color} strokeWidth='2' />
                                        <text x={ev.x} y={84} textAnchor='middle' fill={ev.color} fontFamily='monospace' fontSize='9' fontWeight='bold'>
                                            {i + 1}
                                        </text>
                                        <text x={ev.x} y={35} textAnchor='middle' fill={ev.color} fontFamily='monospace' fontSize='8'>
                                            {ev.label}
                                        </text>
                                        <text x={ev.x} y={48} textAnchor='middle' fill='#475569' fontFamily='monospace' fontSize='7'>
                                            {ev.sub}
                                        </text>
                                        <text x={ev.x} y={112} textAnchor='middle' fill={ev.color} fontFamily='monospace' fontSize='9' fontWeight='bold'>
                                            {ev.amount}
                                        </text>
                                        {i < 4 && (
                                            <path d={`M ${ev.x + 12} 80 L ${ev.x + 118} 80`} stroke='#06b6d4' strokeWidth='1.5' markerEnd='url(#es-arr)' />
                                        )}
                                    </g>
                                ))}

                                {/* Final state */}
                                <text x='330' y='145' textAnchor='middle' fill='#10b981' fontFamily='monospace' fontSize='9'>
                                    Replay all → Current Balance = ৳ 5,000
                                </text>
                            </svg>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'typescript',
                    filename: 'event-sourcing-aggregate.ts',
                    code: `// ============================================================
// Domain Events
// ============================================================
interface AccountOpened {
    type: 'AccountOpened';
    accountId: string;
    ownerId: string;
    timestamp: string;
}

interface MoneyDeposited {
    type: 'MoneyDeposited';
    accountId: string;
    amount: number;
    timestamp: string;
}

interface MoneyWithdrawn {
    type: 'MoneyWithdrawn';
    accountId: string;
    amount: number;
    timestamp: string;
}

type BankAccountEvent = AccountOpened | MoneyDeposited | MoneyWithdrawn;

// ============================================================
// Aggregate — Events apply করে state manage করে
// ============================================================
class BankAccountAggregate {
    private accountId: string = '';
    private balance: number = 0;
    private ownerId: string = '';
    private isOpen: boolean = false;
    private uncommittedEvents: BankAccountEvent[] = [];

    // Reconstruct state from event history (replay)
    static rehydrate(events: BankAccountEvent[]): BankAccountAggregate {
        const account = new BankAccountAggregate();
        for (const event of events) {
            account.apply(event);  // Apply each event in order
        }
        return account;
    }

    // Command: Open account
    openAccount(accountId: string, ownerId: string): void {
        if (this.isOpen) throw new Error('Account already open');
        const event: AccountOpened = {
            type: 'AccountOpened',
            accountId, ownerId,
            timestamp: new Date().toISOString(),
        };
        this.apply(event);
        this.uncommittedEvents.push(event);
    }

    // Command: Deposit money
    deposit(amount: number): void {
        if (!this.isOpen) throw new Error('Account is closed');
        if (amount <= 0) throw new Error('Amount must be positive');
        const event: MoneyDeposited = {
            type: 'MoneyDeposited',
            accountId: this.accountId, amount,
            timestamp: new Date().toISOString(),
        };
        this.apply(event);
        this.uncommittedEvents.push(event);
    }

    // Command: Withdraw money
    withdraw(amount: number): void {
        if (!this.isOpen) throw new Error('Account is closed');
        if (amount > this.balance) throw new Error('Insufficient funds');
        const event: MoneyWithdrawn = {
            type: 'MoneyWithdrawn',
            accountId: this.accountId, amount,
            timestamp: new Date().toISOString(),
        };
        this.apply(event);
        this.uncommittedEvents.push(event);
    }

    // Internal: apply event to update in-memory state
    private apply(event: BankAccountEvent): void {
        switch (event.type) {
            case 'AccountOpened':
                this.accountId = event.accountId;
                this.ownerId = event.ownerId;
                this.isOpen = true;
                break;
            case 'MoneyDeposited':
                this.balance += event.amount;
                break;
            case 'MoneyWithdrawn':
                this.balance -= event.amount;
                break;
        }
    }

    getBalance(): number { return this.balance; }
    getUncommittedEvents(): BankAccountEvent[] { return this.uncommittedEvents; }
    clearUncommittedEvents(): void { this.uncommittedEvents = []; }
}`,
                },
            ],
        },
        {
            id: 'event-store',
            subHeader: { index: '004', title: 'Event Store Design' },
            title: (
                <SectionTitle>
                    Event Store Design
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Event Store হলো একটি{' '}
                            <strong className='text-foreground'>append-only log</strong>{' '}
                            — events শুধু যোগ হয়, কখনো update বা delete হয় না। এটি
                            traditional database থেকে মৌলিকভাবে আলাদা।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['বৈশিষ্ট্য', 'Event Store', 'Regular DB'],
                    rows: [
                        [
                            'Mutability',
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>Immutable (append-only)</span>,
                            <span className='text-orange-700 dark:text-orange-400'>Mutable (UPDATE/DELETE)</span>,
                        ],
                        ['Query Style', 'aggregateId দিয়ে events পড়ো', 'Any column দিয়ে query'],
                        ['History', 'Complete history preserved', 'Overwrite হয়ে যায়'],
                        ['Undo', 'Compensating event তৈরি করুন', 'Previous value নেই'],
                        ['Schema', 'Flexible (JSON payload)', 'Fixed columns'],
                        ['Time Travel', 'যেকোনো past state পানয়া যায়', 'অসম্ভব'],
                    ],
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'typescript',
                    filename: 'event-store-schema.ts',
                    code: `// ============================================================
// Event Store Schema (PostgreSQL — append-only table)
// ============================================================

/*
CREATE TABLE event_store (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_id  VARCHAR(255) NOT NULL,      -- e.g., "ACC-001"
    aggregate_type VARCHAR(100) NOT NULL,     -- e.g., "BankAccount"
    event_type    VARCHAR(100) NOT NULL,      -- e.g., "MoneyDeposited"
    event_data    JSONB NOT NULL,             -- Serialized event payload
    version       INT NOT NULL,              -- Optimistic concurrency control
    metadata      JSONB,                     -- correlation_id, user_id, etc.
    timestamp     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Ensure version is sequential per aggregate
    UNIQUE(aggregate_id, version)
);

-- Index for loading events of a specific aggregate
CREATE INDEX idx_event_store_aggregate ON event_store(aggregate_id, version ASC);
*/

// ============================================================
// Event Store Implementation
// ============================================================
interface StoredEvent {
    id: string;
    aggregateId: string;
    aggregateType: string;
    eventType: string;
    eventData: unknown;
    version: number;
    metadata?: Record<string, unknown>;
    timestamp: string;
}

class EventStore {
    constructor(private readonly db: Database) {}

    // Save new events — append-only, never update
    async appendEvents(
        aggregateId: string,
        aggregateType: string,
        events: BankAccountEvent[],
        expectedVersion: number   // Optimistic concurrency
    ): Promise<void> {
        await this.db.transaction(async (tx) => {
            // Check for concurrent modification
            const currentVersion = await tx.query<{ max: number }>(
                'SELECT MAX(version) as max FROM event_store WHERE aggregate_id = $1',
                [aggregateId]
            );
            const latestVersion = currentVersion.rows[0]?.max ?? -1;

            if (latestVersion !== expectedVersion) {
                throw new ConcurrencyError(
                    \`Expected version \${expectedVersion}, got \${latestVersion}\`
                );
            }

            // Append each event
            for (let i = 0; i < events.length; i++) {
                await tx.query(
                    \`INSERT INTO event_store
                     (aggregate_id, aggregate_type, event_type, event_data, version)
                     VALUES ($1, $2, $3, $4, $5)\`,
                    [aggregateId, aggregateType, events[i].type,
                     JSON.stringify(events[i]), expectedVersion + i + 1]
                );
            }
        });
    }

    // Load all events for an aggregate (to reconstruct state)
    async loadEvents(aggregateId: string): Promise<StoredEvent[]> {
        const result = await this.db.query<StoredEvent>(
            \`SELECT * FROM event_store
             WHERE aggregate_id = $1
             ORDER BY version ASC\`,
            [aggregateId]
        );
        return result.rows;
    }

    // Time travel: load events up to a specific point in time
    async loadEventsUntil(aggregateId: string, until: Date): Promise<StoredEvent[]> {
        const result = await this.db.query<StoredEvent>(
            \`SELECT * FROM event_store
             WHERE aggregate_id = $1 AND timestamp <= $2
             ORDER BY version ASC\`,
            [aggregateId, until.toISOString()]
        );
        return result.rows;
    }
}`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '🔒 Event Immutability — সবচেয়ে গুরুত্বপূর্ণ নিয়ম',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>Events কখনো DELETE বা UPDATE করা যাবেন না।</strong>{' '}
                                একবার store হলে সেটা চিরকালের জন্য সেখানে থাকে।
                                এই immutability-ই Event Sourcing-এর সমস্ত সুবিধার ভিত্তি।
                            </p>
                            <p>
                                ভুল হলে করতে হয়:{' '}
                                <strong>Compensating Event</strong> — নতুন event যোগ করুন
                                যা পুরনো event-এর effect উল্টে দেয়। যেমন ভুল withdrawal-এর
                                জন্য <span className='font-mono text-primary'>WithdrawalReversed</span>{' '}
                                event।
                            </p>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'projections',
            subHeader: { index: '005', title: 'Projections' },
            title: (
                <SectionTitle>
                    Projections — Events থেকে Views তৈরি করুন
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Event Store-এ raw events আছে — কিন্তু UI দ্রুত data দেখাতে
                            হবে। Projection হলো সেই mechanism যা events শুনে{' '}
                            <strong className='text-foreground'>
                                optimized read models (views) তৈরি করে
                            </strong>
                            । একই events থেকে multiple projections তৈরি করা যায়।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6'>
                            <p className='font-mono text-xs uppercase tracking-widest text-muted-foreground mb-5 text-center'>
                                একই Events → Multiple Projections
                            </p>
                            <div className='flex flex-col gap-4'>
                                <div className='bg-muted/50 border border-primary/20 rounded p-4 text-center'>
                                    <p className='font-mono text-sm text-primary font-bold'>Event Store</p>
                                    <p className='font-mono text-xs text-muted-foreground mt-1'>
                                        OrderPlaced, OrderShipped, OrderDelivered, PaymentReceived...
                                    </p>
                                </div>
                                <div className='flex flex-col md:flex-row gap-3 justify-center'>
                                    {[
                                        {
                                            title: 'Order Status View',
                                            desc: 'orderId → current status, ETA',
                                            color: 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400',
                                        },
                                        {
                                            title: 'Customer Order History',
                                            desc: 'customerId → all past orders',
                                            color: 'border-orange-400/30 text-orange-700 dark:text-orange-400',
                                        },
                                        {
                                            title: 'Inventory View',
                                            desc: 'productId → sold qty, remaining stock',
                                            color: 'border-purple-400/30 text-purple-700 dark:text-purple-400',
                                        },
                                        {
                                            title: 'Revenue Dashboard',
                                            desc: 'date → total revenue, order count',
                                            color: 'border-cyan-400/30 text-cyan-700 dark:text-cyan-400',
                                        },
                                    ].map((proj, i) => (
                                        <div key={i} className={`bg-muted/30 border rounded p-3 flex-1 ${proj.color.split(' ')[0]}`}>
                                            <p className={`font-mono text-xs font-bold ${proj.color.split(' ')[1]}`}>{proj.title}</p>
                                            <p className='font-mono text-xs text-muted-foreground mt-1'>{proj.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'typescript',
                    filename: 'order-projection.ts',
                    code: `// ============================================================
// Projection: Order Status View
// Listens to events → builds denormalized read model
// ============================================================

interface OrderStatusReadModel {
    orderId: string;
    customerId: string;
    customerName: string;       // Denormalized
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    totalAmount: number;
    itemCount: number;
    shippingAddress: string;
    placedAt: string;
    shippedAt?: string;
    deliveredAt?: string;
    lastUpdated: string;
}

class OrderStatusProjection {
    constructor(
        private readonly readDb: ReadDatabase  // Elasticsearch or PostgreSQL read replica
    ) {}

    // Handles OrderPlaced event
    async onOrderPlaced(event: {
        orderId: string;
        customerId: string;
        customerName: string;
        items: { productId: string; quantity: number; price: number }[];
        shippingAddress: string;
        timestamp: string;
    }): Promise<void> {
        const totalAmount = event.items.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        // Build and upsert the read model
        const readModel: OrderStatusReadModel = {
            orderId: event.orderId,
            customerId: event.customerId,
            customerName: event.customerName,  // Already denormalized in event
            status: 'pending',
            totalAmount,
            itemCount: event.items.length,
            shippingAddress: event.shippingAddress,
            placedAt: event.timestamp,
            lastUpdated: event.timestamp,
        };

        await this.readDb.upsert('order_status_view', event.orderId, readModel);
    }

    // Handles OrderShipped event
    async onOrderShipped(event: {
        orderId: string;
        trackingNumber: string;
        timestamp: string;
    }): Promise<void> {
        await this.readDb.update('order_status_view', event.orderId, {
            status: 'shipped',
            shippedAt: event.timestamp,
            lastUpdated: event.timestamp,
        });
    }

    // Handles OrderDelivered event
    async onOrderDelivered(event: {
        orderId: string;
        timestamp: string;
    }): Promise<void> {
        await this.readDb.update('order_status_view', event.orderId, {
            status: 'delivered',
            deliveredAt: event.timestamp,
            lastUpdated: event.timestamp,
        });
    }
}

// ============================================================
// Projection: Inventory View — same events, different read model
// ============================================================

class InventoryProjection {
    async onOrderPlaced(event: {
        items: { productId: string; quantity: number }[];
    }): Promise<void> {
        // Decrement available stock for each item
        for (const item of event.items) {
            await this.readDb.increment(
                'inventory_view',
                item.productId,
                { reserved_qty: item.quantity }
            );
        }
    }

    async onOrderDelivered(event: {
        items: { productId: string; quantity: number }[];
    }): Promise<void> {
        for (const item of event.items) {
            await this.readDb.increment(
                'inventory_view',
                item.productId,
                { sold_qty: item.quantity, reserved_qty: -item.quantity }
            );
        }
    }
}`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Projection Rebuild করা যায়',
                    content: (
                        <p>
                            Read model corrupt হয়ে গেলে বা নতুন view দরকার হলে —
                            Event Store থেকে সব events শুরু থেকে replay করে projection rebuild করুন।
                            এটাই Event Sourcing-এর অন্যতম সুবিধা:{' '}
                            <strong>Read model কখনো হারিয়ে যায় না</strong>, events
                            থেকে যেকোনো সময় নতুন করে তৈরি করা যায়।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'cqrs-es-combined',
            subHeader: { index: '006', title: 'CQRS + ES Combined' },
            title: (
                <SectionTitle>
                    CQRS + Event Sourcing Together
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            CQRS এবং Event Sourcing আলাদাভাবেও ব্যবহার করা যায়, কিন্তু একসাথে
                            ব্যবহার করলেন এরা{' '}
                            <strong className='text-foreground'>
                                একে অপরকে complement করে
                            </strong>
                            । Event Sourcing CQRS-এর Write side-এর natural implementation,
                            এবং events সরাসরি Query side-এ push করতে পারে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    steps: [
                        {
                            title: (
                                <span className='font-mono text-purple-700 dark:text-purple-400'>
                                    Step 1 — User sends Command
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    User একটা action নেয় (PlaceOrder, TransferMoney)।
                                    Application Command object তৈরি করে Command Bus-এ পাঠায়।
                                    Command Bus সঠিক Command Handler-এ route করে।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-orange-700 dark:text-orange-400'>
                                    Step 2 — Command Handler Validates
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Command Handler business rules validate করে।
                                    Invalid হলে error return করে (void নয়, exception)।
                                    Valid হলে Event Store থেকে Aggregate load করে।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-primary'>
                                    Step 3 — Aggregate Applies Event
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Aggregate (domain object) command execute করে domain event তৈরি করে।
                                    Event apply করে নিজের in-memory state update করে।
                                    Uncommitted events list-এ রাখে।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-cyan-700 dark:text-cyan-400'>
                                    Step 4 — Event Stored
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Command Handler Aggregate থেকে uncommitted events নিয়ে
                                    Event Store-এ append করে। Optimistic concurrency check করে।
                                    Events immutably persist হয়।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-yellow-700 dark:text-yellow-400'>
                                    Step 5 — Event Published to Bus
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Events Kafka-তে publish হয়। Multiple consumers
                                    (Projections, Notification Service, Analytics) এই events
                                    subscribe করে নিজেদের কাজ করে।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-emerald-700 dark:text-emerald-400'>
                                    Step 6 — Projections Update Read DB
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Projection handlers events consume করে Read DB (Elasticsearch/Redis)
                                    update করে। Read models denormalized ও query-optimized।
                                    Eventual consistency — Write হওয়ার কিছুক্ষণ পর Read-এ reflect হয়।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-emerald-700 dark:text-emerald-400'>
                                    Step 7 — Query Handler Reads
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    User data দেখতে চাইলে Query Handler সরাসরি Read DB থেকে পড়ে।
                                    No JOIN, no complex SQL। Pre-built view return করে milliseconds-এ।
                                    Write side-এর কোনো load নেই।
                                </span>
                            ),
                        },
                    ],
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'typescript',
                    filename: 'cqrs-es-full-flow.ts',
                    code: `// ============================================================
// Complete CQRS + Event Sourcing Flow
// ============================================================

// 1. Command arrives
const command: PlaceOrderCommand = {
    type: 'PLACE_ORDER',
    customerId: 'CUST-001',
    items: [
        { productId: 'PROD-A', quantity: 2, price: 500 },
        { productId: 'PROD-B', quantity: 1, price: 1200 },
    ],
    shippingAddress: 'Dhaka, Bangladesh',
};

// 2. Command Handler orchestrates everything
class PlaceOrderCommandHandler {
    constructor(
        private eventStore: EventStore,
        private eventBus: EventBus
    ) {}

    async handle(cmd: PlaceOrderCommand): Promise<void> {
        // Load Aggregate from Event Store (rehydrate from history)
        const pastEvents = await this.eventStore.loadEvents(\`ORDER-\${cmd.customerId}\`);
        const order = OrderAggregate.rehydrate(pastEvents);

        // Execute command on aggregate — raises domain events
        order.placeOrder({
            customerId: cmd.customerId,
            items: cmd.items,
            shippingAddress: cmd.shippingAddress,
        });

        // Persist new events to Event Store (append-only)
        const newEvents = order.getUncommittedEvents();
        await this.eventStore.appendEvents(
            order.id,
            'Order',
            newEvents,
            order.version - newEvents.length  // optimistic concurrency
        );

        // Publish to Kafka — Projections will consume
        for (const event of newEvents) {
            await this.eventBus.publish('order-events', event);
        }

        // Return void — command has no return value
    }
}

// 3. Projection consumes event → updates Read DB
class OrderProjectionConsumer {
    async consume(event: DomainEvent): Promise<void> {
        switch (event.type) {
            case 'OrderPlaced':
                await this.readDb.upsert('orders_view', {
                    orderId: event.orderId,
                    customerId: event.customerId,
                    status: 'PENDING',
                    totalAmount: event.totalAmount,
                    placedAt: event.timestamp,
                });
                break;
            case 'OrderShipped':
                await this.readDb.update('orders_view', event.orderId, {
                    status: 'SHIPPED',
                    shippedAt: event.timestamp,
                });
                break;
        }
    }
}

// 4. Query Handler reads from optimized Read DB
class GetOrderQueryHandler {
    async handle(query: { orderId: string }) {
        // Instant read — no JOIN, pre-built view
        return await this.readDb.findById('orders_view', query.orderId);
    }
}`,
                },
            ],
        },
        {
            id: 'tradeoffs',
            subHeader: { index: '007', title: 'Trade-offs' },
            title: (
                <SectionTitle>
                    Trade-offs ও কখন Use করবেন?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            CQRS ও Event Sourcing powerful — কিন্তু সব জায়গায় use করলেন
                            unnecessary complexity তৈরি হয়। কখন use করবেন, কখন করবেন না —
                            এটা বোঝাটাই সত্যিকারের দক্ষতা।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['পরিস্থিতি', 'CQRS/ES Use করুন', 'CQRS/ES এড়াও'],
                    rows: [
                        [
                            'Read/Write Load',
                            <span className='text-emerald-700 dark:text-emerald-400'>Read ও Write load অনেক আলাদা</span>,
                            <span className='text-red-700 dark:text-red-400'>Similar load, simple CRUD</span>,
                        ],
                        [
                            'Audit Requirement',
                            <span className='text-emerald-700 dark:text-emerald-400'>Banking, Healthcare, Legal</span>,
                            <span className='text-red-700 dark:text-red-400'>No audit needed (e.g., temp data)</span>,
                        ],
                        [
                            'Domain Complexity',
                            <span className='text-emerald-700 dark:text-emerald-400'>Complex business rules, DDD</span>,
                            <span className='text-red-700 dark:text-red-400'>Simple CRUD app, small team</span>,
                        ],
                        [
                            'Team Size',
                            <span className='text-emerald-700 dark:text-emerald-400'>Large team, multiple services</span>,
                            <span className='text-red-700 dark:text-red-400'>Small team, tight deadline</span>,
                        ],
                        [
                            'Scalability',
                            <span className='text-emerald-700 dark:text-emerald-400'>10M+ users, high throughput</span>,
                            <span className='text-red-700 dark:text-red-400'>Early-stage startup, MVP</span>,
                        ],
                        [
                            'Time Travel',
                            <span className='text-emerald-700 dark:text-emerald-400'>Past state query দরকার</span>,
                            <span className='text-red-700 dark:text-red-400'>Current state-ই যথেষ্ট</span>,
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: '⚠️ Eventual Consistency — সবচেয়ে বড় চ্যালেঞ্জ',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                CQRS-এ Write DB-তে data যানয়ার পর Kafka-র মাধ্যমে
                                Read DB-তে sync হতে{' '}
                                <strong>কিছু milliseconds বা seconds লাগে</strong>।
                                এই সময়ে user নতুন data দেখবেন না।
                            </p>
                            <p>
                                <strong>Problem scenario:</strong> User order দিল (Write)।
                                সাথে সাথে "My Orders" দেখতে গেল (Read) — নতুন order
                                নাও দেখাতে পারে কারণ projection এখনো update হয়নি।
                            </p>
                            <p>
                                <strong>Solutions:</strong> (১) UI-তে optimistic update
                                দেখাও, (২) Command-এর পরে short delay করুন, (৩) User-কে
                                "Processing..." দেখাও sync হওয়া পর্যন্ত।
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Pragmatic Advice — Simple দিয়ে শুরু করুন',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>Rule of thumb:</strong> যদি নিশ্চিত না হও,
                                Event Sourcing ছাড়া শুধু CQRS দিয়ে শুরু করুন।
                                Command ও Query model আলাদা করুন, কিন্তু same database-এ।
                                পরে যখন event history দরকার হবে, তখন Event Sourcing যোগ করুন।
                            </p>
                            <p>
                                <strong>Cost:</strong> Event Sourcing যোগ করলেন codebase
                                complexity 2-3x বাড়ে। Debugging কঠিন হয়।
                                Snapshot strategy দরকার হয় (replay করতে বেশি সময় লাগলে)।
                                শুধু clear business value থাকলে use করুন।
                            </p>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'real-world',
            subHeader: { index: '008', title: 'Real World Usage' },
            title: (
                <SectionTitle>
                    Real World: কোথায় Use করে?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            CQRS ও Event Sourcing real production systems-এ ব্যাপকভাবে
                            ব্যবহৃত হয়। বিশেষত যেসব domain-এ{' '}
                            <strong className='text-foreground'>audit trail critical</strong>
                            , ইতিহাস হারানো যাবেন না।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {[
                                {
                                    domain: 'Banking & Finance',
                                    icon: '🏦',
                                    why: 'Audit trail — কোন transaction কখন, কে করেছেনে সব track করতে হবে। Regulatory compliance।',
                                    example: 'Account transactions, Fund transfers, Loan processing',
                                    color: 'border-emerald-500/30',
                                    textColor: 'text-emerald-700 dark:text-emerald-400',
                                },
                                {
                                    domain: 'E-commerce Orders',
                                    icon: '🛒',
                                    why: 'Order lifecycle — Placed, Confirmed, Packed, Shipped, Delivered, Returned। প্রতিটা state transition event।',
                                    example: 'Amazon, Daraz order management',
                                    color: 'border-orange-400/30',
                                    textColor: 'text-orange-700 dark:text-orange-400',
                                },
                                {
                                    domain: 'Gaming',
                                    icon: '🎮',
                                    why: 'Score history, achievement unlocks, inventory changes — সব replayable হওয়া দরকার। Anti-cheat audit।',
                                    example: 'Player stats, Match history, Leaderboards',
                                    color: 'border-purple-400/30',
                                    textColor: 'text-purple-700 dark:text-purple-400',
                                },
                                {
                                    domain: 'Collaboration Tools',
                                    icon: '📝',
                                    why: 'Google Docs-এর প্রতিটা keystroke একটা event। Undo/Redo, version history, conflict resolution সব event-based।',
                                    example: 'Google Docs, Figma, Notion',
                                    color: 'border-cyan-400/30',
                                    textColor: 'text-cyan-700 dark:text-cyan-400',
                                },
                            ].map((item, i) => (
                                <div key={i} className={`bg-muted/30 border rounded-lg p-5 ${item.color}`}>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <span className='text-2xl'>{item.icon}</span>
                                        <span className={`font-mono text-sm font-bold ${item.textColor}`}>
                                            {item.domain}
                                        </span>
                                    </div>
                                    <p className='text-sm text-muted-foreground leading-relaxed mb-3'>
                                        {item.why}
                                    </p>
                                    <p className={`font-mono text-xs ${item.textColor} opacity-80`}>
                                        → {item.example}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Company / System', 'Pattern', 'Why CQRS/ES?'],
                    rows: [
                        [
                            <span className='font-bold text-foreground'>Microsoft Azure</span>,
                            'CQRS + ES',
                            'EventStoreDB তৈরি করেছেনে, internal services-এ ব্যবহার',
                        ],
                        [
                            <span className='font-bold text-foreground'>LinkedIn</span>,
                            'Event Sourcing',
                            'Activity feed, notifications — Kafka-based event log',
                        ],
                        [
                            <span className='font-bold text-foreground'>Netflix</span>,
                            'CQRS',
                            'Streaming data read/write separation, playback history',
                        ],
                        [
                            <span className='font-bold text-foreground'>Airbnb</span>,
                            'Event Sourcing',
                            'Booking state machine — 15+ states, full audit trail',
                        ],
                        [
                            <span className='font-bold text-foreground'>Axon Framework</span>,
                            'CQRS + ES',
                            'Java-র সবচেয়ে popular CQRS/ES framework',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '🎯 Interview Tips — CQRS/ES প্রশ্নের জন্য',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>1)</strong> CQRS explain করার সময় বলুন:{' '}
                                <strong>"Read ও Write load different — আলাদা করলেন
                                    প্রতিটা independently scale করা যায়।"</strong>
                            </p>
                            <p>
                                <strong>2)</strong> Event Sourcing-এর key insight:{' '}
                                <strong>"Current state নয়, facts (events) store করুন।
                                    Facts কখনো মিথ্যা হয় না।"</strong>
                            </p>
                            <p>
                                <strong>3)</strong> Eventual consistency-র trade-off
                                নিজে থেকে mention করুন — interviewer impressed হবে।
                            </p>
                            <p>
                                <strong>4)</strong> Projection rebuild capability mention
                                করুন — "যেকোনো সময় নতুন read model তৈরি করা যায়।"
                            </p>
                            <p>
                                <strong>5)</strong> কখন use করবেন না সেটাও বলুন —
                                simple CRUD app-এ overkill। Maturity দেখায়।
                            </p>
                        </div>
                    ),
                },
            ],
        },
    ],
    summary: {
        headers: ['Pattern', 'মূল ধারণা', 'সুবিধা', 'চ্যালেঞ্জ', 'ব্যবহার'],
        rows: [
            [
                <span className='font-bold text-primary font-mono'>CQRS</span>,
                'Read ও Write আলাদা model',
                'Independent scaling, optimized queries',
                'Eventual consistency, two codebases',
                'High read/write disparity',
            ],
            [
                <span className='font-bold text-emerald-700 dark:text-emerald-400 font-mono'>Event Sourcing</span>,
                'State নয়, Events store করুন',
                'Full audit trail, time travel, replay',
                'Complex querying, event schema evolution',
                'Banking, audit-heavy domains',
            ],
            [
                <span className='font-bold text-cyan-700 dark:text-cyan-400 font-mono'>CQRS + ES</span>,
                'উপরের দুটো একসাথে',
                'Maximum flexibility, full history',
                'High complexity, steep learning curve',
                'Complex domains, large teams',
            ],
            [
                <span className='font-bold text-orange-700 dark:text-orange-400 font-mono'>Projection</span>,
                'Events → Read models',
                'Multiple views, rebuild anytime',
                'Async lag, projection failures',
                'Dashboard, reporting views',
            ],
            [
                <span className='font-bold text-purple-700 dark:text-purple-400 font-mono'>Event Store</span>,
                'Append-only event log',
                'Immutable history, time travel',
                'Storage growth, snapshot needed',
                'All Event Sourcing systems',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'CQRS এর পূর্ণ নাম কী?',
                options: [
                    {
                        key: 'a',
                        text: 'Command Query Responsibility Segregation',
                        isCorrect: true,
                        explanation:
                            'সঠিক। CQRS = Command Query Responsibility Segregation। Command (write) ও Query (read) এর দায়িত্ব আলাদা করা হয়। প্রতিটার আলাদা model, আলাদা database, এবং আলাদা optimized implementation।',
                    },
                    {
                        key: 'b',
                        text: 'Concurrent Queue Request System',
                        isCorrect: false,
                        explanation: 'এটা CQRS এর সঠিক সংজ্ঞা নয়।',
                    },
                    {
                        key: 'c',
                        text: 'Cache Query Resolution Strategy',
                        isCorrect: false,
                        explanation: 'এটা CQRS এর সঠিক সংজ্ঞা নয়।',
                    },
                    {
                        key: 'd',
                        text: 'Command Queue Registry Service',
                        isCorrect: false,
                        explanation: 'এটা CQRS এর সঠিক সংজ্ঞা নয়।',
                    },
                ],
            },
            {
                id: 2,
                text: 'Event Sourcing এ কোনটা store হয়?',
                options: [
                    {
                        key: 'a',
                        text: 'শুধু current state',
                        isCorrect: false,
                        explanation:
                            'Current state store করা CRUD এর পদ্ধতি। Event Sourcing-এ events store হয়।',
                    },
                    {
                        key: 'b',
                        text: 'Events, current state নয়',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Event Sourcing-এ "কী ঘটেছে" সেটা (events) store হয়, "এখন কী অবস্থা" সেটা নয়। Current state = সব past events replay করার ফলাফল। এটাই পুরো approach-এর core insight।',
                    },
                    {
                        key: 'c',
                        text: 'শুধু error logs',
                        isCorrect: false,
                        explanation:
                            'Event Sourcing শুধু error log নয় — সব domain events store করে।',
                    },
                    {
                        key: 'd',
                        text: 'Database snapshots',
                        isCorrect: false,
                        explanation:
                            'Snapshot Event Sourcing-এর optimization technique, core concept নয়।',
                    },
                ],
            },
            {
                id: 3,
                text: 'CQRS তে Command handler কী return করে?',
                options: [
                    {
                        key: 'a',
                        text: 'Updated entity object',
                        isCorrect: false,
                        explanation:
                            'Command handler entity return করে না — এটা Query handler এর কাজ।',
                    },
                    {
                        key: 'b',
                        text: 'Database row',
                        isCorrect: false,
                        explanation:
                            'Database row return করা Query side এর responsibility।',
                    },
                    {
                        key: 'c',
                        text: 'void / success-failure',
                        isCorrect: true,
                        explanation:
                            'সঠিক। CQRS-এর golden rule: Command handler void return করে (অথবা শুধু success/failure indication)। Data return করা Query-এর কাজ। এই separation-ই CQRS এর মূল নীতি — Command ও Query এর concerns পুরোপুরি আলাদা।',
                    },
                    {
                        key: 'd',
                        text: 'Event list',
                        isCorrect: false,
                        explanation:
                            'Events Event Store-এ যায়, Command handler caller-কে event list return করে না।',
                    },
                ],
            },
            {
                id: 4,
                text: 'Projection কী?',
                options: [
                    {
                        key: 'a',
                        text: 'Database index',
                        isCorrect: false,
                        explanation: 'Projection database index নয় — events থেকে view তৈরি করার mechanism।',
                    },
                    {
                        key: 'b',
                        text: 'Events থেকে read model তৈরি করে',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Projection event stream consume করে এবং query-optimized read models (views) তৈরি করে। Same events থেকে multiple projections তৈরি করা যায় — প্রতিটা আলাদা use case-এর জন্য। Projection rebuild করলেন read model নতুনভাবে তৈরি হয়।',
                    },
                    {
                        key: 'c',
                        text: 'Write model এর copy',
                        isCorrect: false,
                        explanation:
                            'Projection write model এর simple copy নয় — events থেকে নতুন, optimized structure তৈরি করে।',
                    },
                    {
                        key: 'd',
                        text: 'Cache layer',
                        isCorrect: false,
                        explanation: 'Projection cache নয় — event-driven read model builder।',
                    },
                ],
            },
            {
                id: 5,
                text: 'Event Sourcing এর সবচেয়ে বড় সুবিধা কী?',
                options: [
                    {
                        key: 'a',
                        text: 'Faster write performance',
                        isCorrect: false,
                        explanation:
                            'Event Sourcing append-only write করে, কিন্তু এটার primary benefit performance নয়।',
                    },
                    {
                        key: 'b',
                        text: 'Less storage needed',
                        isCorrect: false,
                        explanation:
                            'Event Sourcing-এ storage বেশি লাগে (সব events রাখতে হয়)।',
                    },
                    {
                        key: 'c',
                        text: 'Complete audit trail',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Event Sourcing-এর সবচেয়ে বড় সুবিধা হলো complete, immutable audit trail। "কে, কখন, কী করেছেনে" সব সময়ের জন্য preserved। Banking regulation, healthcare compliance, legal audit — এই সব domain-এ এটা invaluable। Time travel capability (past state reconstruction) এরই extension।',
                    },
                    {
                        key: 'd',
                        text: 'Simpler codebase',
                        isCorrect: false,
                        explanation:
                            'Event Sourcing codebase সাধারণত complex করে — simplicity এর trade-off আছে।',
                    },
                ],
            },
            {
                id: 6,
                text: 'CQRS তে eventual consistency কোথায় হয়?',
                options: [
                    {
                        key: 'a',
                        text: 'Command Handler-এ',
                        isCorrect: false,
                        explanation: 'Command Handler নিজে eventual consistency তৈরি করে না।',
                    },
                    {
                        key: 'b',
                        text: 'Write DB থেকে Read DB sync এ',
                        isCorrect: true,
                        explanation:
                            'সঠিক। CQRS-এ Write DB (PostgreSQL)-তে data যায়, তারপর Kafka-র মাধ্যমে asynchronously Read DB (Elasticsearch)-তে sync হয়। এই async sync-এর কারণে কিছু milliseconds বা seconds এর delay থাকে — এটাই eventual consistency। User এই সময়ে stale data দেখতে পারে।',
                    },
                    {
                        key: 'c',
                        text: 'Event Store-এ',
                        isCorrect: false,
                        explanation: 'Event Store নিজে eventually consistent নয় — এটা append করে।',
                    },
                    {
                        key: 'd',
                        text: 'User Interface-এ',
                        isCorrect: false,
                        explanation: 'UI-তে eventual consistency দেখা যায়, কিন্তু এটা cause নয় — effect।',
                    },
                ],
            },
            {
                id: 7,
                text: 'Event Store কী ধরনের database?',
                options: [
                    {
                        key: 'a',
                        text: 'Relational (with UPDATE/DELETE)',
                        isCorrect: false,
                        explanation:
                            'Event Store relational structure use করতে পারে, কিন্তু UPDATE/DELETE করে না।',
                    },
                    {
                        key: 'b',
                        text: 'Key-Value store',
                        isCorrect: false,
                        explanation: 'Event Store key-value store নয়, sequential event log।',
                    },
                    {
                        key: 'c',
                        text: 'Append-only log',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Event Store হলো append-only log। Events শুধু যোগ হয়, কখনো update বা delete হয় না। এই immutability-ই audit trail ও time travel সম্ভব করে। EventStoreDB, Apache Kafka-ও fundamentally এই concept-এ কাজ করে।',
                    },
                    {
                        key: 'd',
                        text: 'Graph database',
                        isCorrect: false,
                        explanation: 'Event Store graph database নয়।',
                    },
                ],
            },
            {
                id: 8,
                text: 'Aggregate কী?',
                options: [
                    {
                        key: 'a',
                        text: 'SQL GROUP BY এর মতো',
                        isCorrect: false,
                        explanation: 'DDD Aggregate SQL aggregation function নয়।',
                    },
                    {
                        key: 'b',
                        text: 'Database table',
                        isCorrect: false,
                        explanation: 'Aggregate database table নয় — domain object।',
                    },
                    {
                        key: 'c',
                        text: 'Domain object যেটা events apply করে state manage করে',
                        isCorrect: true,
                        explanation:
                            'সঠিক। DDD Aggregate হলো domain object (BankAccount, Order) যেটা: (১) Commands receive করে, (২) Business rules validate করে, (৩) Domain events raise করে, (৪) Events apply করে নিজের state update করে। Event Sourcing-এ Aggregate events থেকে rehydrate হয়।',
                    },
                    {
                        key: 'd',
                        text: 'Message queue',
                        isCorrect: false,
                        explanation: 'Aggregate message queue নয় — domain entity।',
                    },
                ],
            },
            {
                id: 9,
                text: 'কোন type এর system এ CQRS সবচেয়ে beneficial?',
                options: [
                    {
                        key: 'a',
                        text: 'Equal read/write load',
                        isCorrect: false,
                        explanation:
                            'Equal load হলে CQRS-এর বাড়তি complexity justify হয় না।',
                    },
                    {
                        key: 'b',
                        text: 'High read/write ratio disparity',
                        isCorrect: true,
                        explanation:
                            'সঠিক। CQRS সবচেয়ে beneficial যখন Read ও Write load অনেক আলাদা। যেমন: 100x বেশি read হলে Read DB আলাদা করে scale করা যায়। Write side normalized DB use করে consistency নিশ্চিত করে। Read side denormalized, fast — Elasticsearch-এর মতো। দুটো independently scale।',
                    },
                    {
                        key: 'c',
                        text: 'Single user application',
                        isCorrect: false,
                        explanation:
                            'Single user app-এ CQRS overkill — complexity ছাড়া কোনো benefit নেই।',
                    },
                    {
                        key: 'd',
                        text: 'Static content website',
                        isCorrect: false,
                        explanation:
                            'Static website-এ CQRS relevant নয়।',
                    },
                ],
            },
            {
                id: 10,
                text: 'Event Sourcing এ "time travel" মানে কী?',
                options: [
                    {
                        key: 'a',
                        text: 'Server time zone change করা',
                        isCorrect: false,
                        explanation: 'Time travel মানে timezone manipulation নয়।',
                    },
                    {
                        key: 'b',
                        text: 'Cache invalidate করা',
                        isCorrect: false,
                        explanation: 'Time travel cache invalidation নয়।',
                    },
                    {
                        key: 'c',
                        text: 'Past state replay করা',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Event Sourcing-এ "time travel" মানে past state reconstruct করতে পারা। "৩ মাস আগে account balance কত ছিল?" — সব events January 1 থেকে March 1 পর্যন্ত replay করলেন সেই সময়ের state পানয়া যায়। EventStore.loadEventsUntil(accountId, date) করে Aggregate rehydrate করুন।',
                    },
                    {
                        key: 'd',
                        text: 'Future prediction করা',
                        isCorrect: false,
                        explanation: 'Time travel ভবিষ্যৎ predict করে না — past reconstruct করে।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'Banking System CQRS + Event Sourcing দিয়ে ডিজাইন করুন',
        time: '৪-৫ ঘন্টা',
        difficulty: 'Expert',
        tasks: [
            <span>
                <strong>Account Aggregate:</strong> BankAccount aggregate implement করুন।
                Events: AccountOpened, MoneyDeposited, MoneyWithdrawn, AccountFrozen।
                প্রতিটা event-এ apply() method লিখুন। Rehydrate করুন Event Store থেকে।
                Test: freeze করা account-এ withdraw করলেন error।
            </span>,
            <span>
                <strong>Command & Query Handlers:</strong> OpenAccountCommand,
                DepositMoneyCommand, WithdrawMoneyCommand handler লিখুন।
                Query: GetAccountBalance, GetTransactionHistory, GetAccountStatement।
                Command: void return। Query: DTO return।
            </span>,
            <span>
                <strong>Event Store Implementation:</strong> PostgreSQL দিয়ে append-only
                event store তৈরি করুন। appendEvents() (optimistic concurrency সহ),
                loadEvents(), loadEventsUntil() implement করুন।
                Test: same version-এ দুটো concurrent write করলেন ConcurrencyError।
            </span>,
            <span>
                <strong>Projection for Balance View:</strong> AccountBalanceProjection তৈরি করুন।
                Events consume করে balance_view table update করুন।
                GetAccountBalance query এই view থেকে পড়বে — Event Store থেকে নয়।
                Compare করুন: projection থেকে read vs event replay — কোনটা fast?
            </span>,
        ],
        deliverables: [
            <span>BankAccount Aggregate + all event types</span>,
            <span>Command/Query handlers with TypeScript types</span>,
            <span>Event Store implementation (PostgreSQL)</span>,
            <span>AccountBalance Projection + read performance comparison</span>,
        ],
    },
    practicalLab: {
        title: 'TypeScript CQRS + EventStore',
        subtitle: 'TypeScript + EventStoreDB + PostgreSQL (read side)',
        steps: [
            {
                title: 'EventStoreDB Setup করুন',
                description: (
                    <span className='text-muted-foreground'>
                        Docker দিয়ে EventStoreDB run করুন:{' '}
                        <span className='font-mono text-primary'>
                            docker run --name esdb -p 2113:2113 -p 1113:1113
                            eventstore/eventstore:latest --insecure
                        </span>
                        । Admin UI: http://localhost:2113। @eventstore/db-client npm package install করুন।
                    </span>
                ),
            },
            {
                title: 'Domain Events ও Aggregate লিখুন',
                description: (
                    <span className='text-muted-foreground'>
                        BankAccountAggregate class তৈরি করুন। Events: AccountOpened,
                        MoneyDeposited, MoneyWithdrawn। apply() method প্রতিটা event handle করবেন।
                        rehydrate() static method events থেকে aggregate rebuild করবেন।
                    </span>
                ),
            },
            {
                title: 'EventStoreDB তে Events Save করুন',
                description: (
                    <span className='text-muted-foreground'>
                        @eventstore/db-client দিয়ে appendToStream() call করুন।
                        Stream name: "BankAccount-ACC-001"।
                        EventData format: type, data (JSON), metadata।
                        readStream() দিয়ে events load করুন।
                    </span>
                ),
            },
            {
                title: 'PostgreSQL Read Model (Projection) তৈরি করুন',
                description: (
                    <span className='text-muted-foreground'>
                        account_balance_view table তৈরি করুন।
                        EventStoreDB subscription দিয়ে events listen করুন।
                        MoneyDeposited → balance বাড়াও। MoneyWithdrawn → কমাও।
                        Query: SELECT balance FROM account_balance_view WHERE account_id = $1।
                    </span>
                ),
            },
            {
                title: 'Time Travel Test করুন',
                description: (
                    <span className='text-muted-foreground'>
                        10টা transaction করুন। তারপর 5th transaction পর্যন্ত events replay করুন।
                        সেই সময়ের balance compare করুন current balance-এর সাথে।
                        loadEventsUntil(accountId, timestamp) implement করুন।
                    </span>
                ),
            },
        ],
        codeBlock: {
            language: 'typescript',
            filename: 'eventstore-bank-account.ts',
            code: `import { EventStoreDBClient, jsonEvent, START } from '@eventstore/db-client';
import { Pool } from 'pg';

// ============================================================
// Domain Events
// ============================================================
type BankEvent =
    | { type: 'AccountOpened';   data: { accountId: string; ownerId: string } }
    | { type: 'MoneyDeposited';  data: { accountId: string; amount: number } }
    | { type: 'MoneyWithdrawn';  data: { accountId: string; amount: number } };

// ============================================================
// Aggregate
// ============================================================
class BankAccountAggregate {
    id: string = '';
    balance: number = 0;
    version: number = -1;
    private uncommitted: BankEvent[] = [];

    static rehydrate(events: BankEvent[]): BankAccountAggregate {
        const acc = new BankAccountAggregate();
        events.forEach((e, i) => { acc.apply(e); acc.version = i; });
        return acc;
    }

    openAccount(accountId: string, ownerId: string) {
        const e: BankEvent = { type: 'AccountOpened', data: { accountId, ownerId } };
        this.apply(e); this.uncommitted.push(e);
    }

    deposit(amount: number) {
        if (amount <= 0) throw new Error('Amount must be positive');
        const e: BankEvent = { type: 'MoneyDeposited', data: { accountId: this.id, amount } };
        this.apply(e); this.uncommitted.push(e);
    }

    withdraw(amount: number) {
        if (amount > this.balance) throw new Error('Insufficient funds');
        const e: BankEvent = { type: 'MoneyWithdrawn', data: { accountId: this.id, amount } };
        this.apply(e); this.uncommitted.push(e);
    }

    private apply(event: BankEvent) {
        switch (event.type) {
            case 'AccountOpened': this.id = event.data.accountId; break;
            case 'MoneyDeposited': this.balance += event.data.amount; break;
            case 'MoneyWithdrawn': this.balance -= event.data.amount; break;
        }
    }

    popUncommitted(): BankEvent[] {
        const events = [...this.uncommitted];
        this.uncommitted = [];
        return events;
    }
}

// ============================================================
// EventStoreDB Repository
// ============================================================
const esdb = EventStoreDBClient.connectionString('esdb://localhost:2113?tls=false');
const pg   = new Pool({ connectionString: 'postgres://localhost/bank_read' });

async function saveAccount(account: BankAccountAggregate): Promise<void> {
    const streamName = \`BankAccount-\${account.id}\`;
    const newEvents = account.popUncommitted().map(e =>
        jsonEvent({ type: e.type, data: e.data })
    );
    await esdb.appendToStream(streamName, newEvents);
}

async function loadAccount(accountId: string): Promise<BankAccountAggregate> {
    const streamName = \`BankAccount-\${accountId}\`;
    const events: BankEvent[] = [];
    const stream = esdb.readStream(streamName, { fromRevision: START, direction: 'forwards' });
    for await (const { event } of stream) {
        if (event) events.push({ type: event.type, data: event.data } as BankEvent);
    }
    return BankAccountAggregate.rehydrate(events);
}

// ============================================================
// Command Handlers
// ============================================================
async function openAccountHandler(accountId: string, ownerId: string): Promise<void> {
    const account = new BankAccountAggregate();
    account.openAccount(accountId, ownerId);
    await saveAccount(account);
    console.log(\`Account \${accountId} opened\`);
}

async function depositHandler(accountId: string, amount: number): Promise<void> {
    const account = await loadAccount(accountId);
    account.deposit(amount);
    await saveAccount(account);
    // Update read model projection
    await pg.query(
        'INSERT INTO account_balance_view (account_id, balance) VALUES ($1, $2) ON CONFLICT (account_id) DO UPDATE SET balance = $2',
        [accountId, account.balance]
    );
}

// ============================================================
// Query Handler — reads from PostgreSQL projection (fast!)
// ============================================================
async function getBalanceQuery(accountId: string): Promise<number> {
    const { rows } = await pg.query(
        'SELECT balance FROM account_balance_view WHERE account_id = $1',
        [accountId]
    );
    return rows[0]?.balance ?? 0;
}

// ============================================================
// Demo: Full CQRS + Event Sourcing flow
// ============================================================
async function demo() {
    // Commands — write side
    await openAccountHandler('ACC-001', 'USER-42');
    await depositHandler('ACC-001', 10000);
    await depositHandler('ACC-001', 5000);

    // Query — read side (from projection, not event store!)
    const balance = await getBalanceQuery('ACC-001');
    console.log(\`Balance from Read DB: ৳ \${balance}\`);  // ৳ 15000

    // Time travel — reconstruct from event store directly
    const account = await loadAccount('ACC-001');
    console.log(\`Balance from Event Replay: ৳ \${account.balance}\`);  // ৳ 15000
}

demo().catch(console.error);`,
        },
        tip: 'EventStoreDB Admin UI-তে streams দেখুন। BankAccount-ACC-001 stream-এ সব events visible। JSON payload দেখুন। এটা practically দেখলে Event Sourcing এর power বোঝা যায় — এটাই immutable, queryable audit log।',
    },
};
