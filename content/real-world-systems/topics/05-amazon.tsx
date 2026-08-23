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

export const amazonContent: TopicData = {
    id: 'amazon',
    sections: [
        {
            id: 'intro-complexity',
            subHeader: { index: '001', title: 'Why This System' },
            title: (
                <SectionTitle>Amazon কেন Complex?</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-4'>
                            <ContentParagraph>
                                Amazon-এ প্রতি second হাজারো orders হয়। Black
                                Friday-তে traffic ১০০x spike করে। এখানে সবচেয়ে
                                কঠিন problem হলো{' '}
                                <strong className='text-foreground'>
                                    inventory management + order processing +
                                    payment
                                </strong>{' '}
                                — এই তিনটা atomic হতে হবে। একই সময়ে 1000 user
                                একটা শেষ item কিনতে চাইলে কী হবে?
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 Core Challenge',
                    content: (
                        <p>
                            <strong>Overselling Problem:</strong> Stock = 1,
                            কিন্তু 100 user একই সময়ে "Buy Now" click করল। Race
                            condition prevent করতে না পারলেন 100 জনের order
                            accept হবে কিন্তু deliver করা যাবেন না।
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
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
                            {/* Functional Requirements */}
                            <div className='bg-card border border-border rounded-lg p-5'>
                                <p className='font-mono text-[11px] uppercase tracking-[0.15em] text-primary mb-4 font-bold'>
                                    ✅ Functional Requirements
                                </p>
                                <ul className='space-y-0'>
                                    {[
                                        'Product catalog (search, browse)',
                                        'Shopping cart',
                                        'Order placement + payment',
                                        'Inventory management',
                                        'Order tracking',
                                        'Product reviews and ratings',
                                        'Seller dashboard',
                                        'Recommendations',
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className='text-sm text-muted-foreground py-[5px] border-b border-border last:border-b-0 pl-5 relative'>
                                            <span className='absolute left-0 text-muted-foreground text-xs'>
                                                →
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* Non-Functional Requirements */}
                            <div className='bg-card border border-border rounded-lg p-5'>
                                <p className='font-mono text-[11px] uppercase tracking-[0.15em] text-purple-700 dark:text-purple-400 mb-4 font-bold'>
                                    ⚡ Non-Functional Requirements
                                </p>
                                <ul className='space-y-0'>
                                    {[
                                        '300M+ active users',
                                        'Product search < 200ms',
                                        'Payment ACID guarantees',
                                        'No overselling inventory',
                                        '99.99% checkout availability',
                                        'Black Friday 100x traffic spike',
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className='text-sm text-muted-foreground py-[5px] border-b border-border last:border-b-0 pl-5 relative'>
                                            <span className='absolute left-0 text-muted-foreground text-xs'>
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
                <SectionTitle>Amazon Scale</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-3 mt-2'>
                            {[
                                { num: '300M', label: 'Active Users' },
                                { num: '12M', label: 'Orders/Day' },
                                { num: '140', label: 'Orders/sec (avg)' },
                                { num: '1400+', label: 'Orders/sec (peak)' },
                                { num: '350M+', label: 'Products in catalog' },
                                { num: '$1.29M', label: 'Revenue/min' },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className='bg-card border border-border rounded-lg p-4 text-center'>
                                    <span className='font-mono text-2xl font-bold text-primary block mb-1'>
                                        {item.num}
                                    </span>
                                    <span className='font-mono text-[10px] text-muted-foreground uppercase tracking-wider'>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '🔢 Black Friday Calculation',
                    content: (
                        <p>
                            Normal: 140 orders/sec। Black Friday 10x = 1400
                            orders/sec। Prime Day আরো বেশি। System-কে এই spike
                            handle করতে auto-scaling দরকার।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'architecture',
            subHeader: { index: '004', title: 'High Level Architecture' },
            title: (
                <SectionTitle>Microservices Architecture</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Amazon early 2000s-এ monolith থেকে microservices-এ
                            migrate করেছেনিল। এখন thousands of microservices।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-card border border-border rounded-lg p-6 mt-4 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                Amazon Microservices Architecture
                            </p>
                            <svg
                                width='700'
                                height='340'
                                viewBox='0 0 700 340'
                                className='max-w-full mx-auto'>
                                <defs>
                                    <marker
                                        id='arr'
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
                                        id='arrA'
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

                                {/* Client */}
                                <rect
                                    x='10'
                                    y='140'
                                    width='70'
                                    height='40'
                                    rx='4'
                                    fill='hsl(var(--card))'
                                    stroke='hsl(var(--border))'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='45'
                                    y='157'
                                    textAnchor='middle'
                                    fill='hsl(var(--muted-foreground))'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    CLIENT
                                </text>
                                <text
                                    x='45'
                                    y='170'
                                    textAnchor='middle'
                                    fill='hsl(var(--muted-foreground))'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Browser/App
                                </text>
                                <path
                                    d='M 80 160 L 115 160'
                                    stroke='hsl(var(--primary))'
                                    strokeWidth='1.5'
                                    markerEnd='url(#arrA)'
                                />

                                {/* API Gateway */}
                                <rect
                                    x='115'
                                    y='130'
                                    width='90'
                                    height='60'
                                    rx='4'
                                    fill='hsl(var(--card))'
                                    stroke='hsl(var(--primary))'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='160'
                                    y='152'
                                    textAnchor='middle'
                                    fill='hsl(var(--primary))'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    API
                                </text>
                                <text
                                    x='160'
                                    y='165'
                                    textAnchor='middle'
                                    fill='hsl(var(--primary))'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    GATEWAY
                                </text>
                                <text
                                    x='160'
                                    y='182'
                                    textAnchor='middle'
                                    fill='hsl(var(--muted-foreground))'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Auth+Rate Limit
                                </text>

                                {/* Lines from Gateway to Services */}
                                <path
                                    d='M 205 148 L 250 80'
                                    stroke='hsl(var(--muted-foreground))'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr)'
                                />
                                <path
                                    d='M 205 155 L 250 130'
                                    stroke='hsl(var(--muted-foreground))'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr)'
                                />
                                <path
                                    d='M 205 162 L 250 180'
                                    stroke='hsl(var(--muted-foreground))'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr)'
                                />
                                <path
                                    d='M 205 169 L 250 230'
                                    stroke='hsl(var(--muted-foreground))'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr)'
                                />
                                <path
                                    d='M 205 175 L 250 280'
                                    stroke='hsl(var(--muted-foreground))'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr)'
                                />

                                {/* Product Service */}
                                <rect
                                    x='250'
                                    y='60'
                                    width='110'
                                    height='40'
                                    rx='4'
                                    fill='hsl(var(--card))'
                                    stroke='#cc6b45'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='305'
                                    y='78'
                                    textAnchor='middle'
                                    fill='#cc6b45'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    PRODUCT
                                </text>
                                <text
                                    x='305'
                                    y='91'
                                    textAnchor='middle'
                                    fill='hsl(var(--muted-foreground))'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    DynamoDB + ES
                                </text>

                                {/* Cart Service */}
                                <rect
                                    x='250'
                                    y='110'
                                    width='110'
                                    height='40'
                                    rx='4'
                                    fill='hsl(var(--card))'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='305'
                                    y='128'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    CART
                                </text>
                                <text
                                    x='305'
                                    y='141'
                                    textAnchor='middle'
                                    fill='hsl(var(--muted-foreground))'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Redis
                                </text>

                                {/* Order Service */}
                                <rect
                                    x='250'
                                    y='160'
                                    width='110'
                                    height='40'
                                    rx='4'
                                    fill='hsl(var(--card))'
                                    stroke='hsl(var(--primary))'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='305'
                                    y='178'
                                    textAnchor='middle'
                                    fill='hsl(var(--primary))'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    ORDER
                                </text>
                                <text
                                    x='305'
                                    y='191'
                                    textAnchor='middle'
                                    fill='hsl(var(--muted-foreground))'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    PostgreSQL
                                </text>

                                {/* Payment Service */}
                                <rect
                                    x='250'
                                    y='210'
                                    width='110'
                                    height='40'
                                    rx='4'
                                    fill='hsl(var(--card))'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='305'
                                    y='228'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    PAYMENT
                                </text>
                                <text
                                    x='305'
                                    y='241'
                                    textAnchor='middle'
                                    fill='hsl(var(--muted-foreground))'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Stripe / Internal
                                </text>

                                {/* Inventory Service */}
                                <rect
                                    x='250'
                                    y='260'
                                    width='110'
                                    height='40'
                                    rx='4'
                                    fill='hsl(var(--card))'
                                    stroke='#ef4444'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='305'
                                    y='278'
                                    textAnchor='middle'
                                    fill='#ef4444'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    INVENTORY
                                </text>
                                <text
                                    x='305'
                                    y='291'
                                    textAnchor='middle'
                                    fill='hsl(var(--muted-foreground))'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    MySQL + Redis
                                </text>

                                {/* Event Bus */}
                                <rect
                                    x='420'
                                    y='155'
                                    width='100'
                                    height='50'
                                    rx='4'
                                    fill='hsl(var(--card))'
                                    stroke='#eab308'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='470'
                                    y='175'
                                    textAnchor='middle'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    EVENT BUS
                                </text>
                                <text
                                    x='470'
                                    y='188'
                                    textAnchor='middle'
                                    fill='hsl(var(--muted-foreground))'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Kafka / SQS
                                </text>
                                <path
                                    d='M 360 180 L 420 180'
                                    stroke='hsl(var(--muted-foreground))'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr)'
                                />
                                <path
                                    d='M 360 230 L 420 185'
                                    stroke='hsl(var(--muted-foreground))'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr)'
                                />
                                <path
                                    d='M 360 280 L 420 190'
                                    stroke='hsl(var(--muted-foreground))'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr)'
                                />

                                {/* Notification Service */}
                                <rect
                                    x='560'
                                    y='90'
                                    width='110'
                                    height='40'
                                    rx='4'
                                    fill='hsl(var(--card))'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='615'
                                    y='108'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    NOTIFICATION
                                </text>
                                <text
                                    x='615'
                                    y='121'
                                    textAnchor='middle'
                                    fill='hsl(var(--muted-foreground))'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Email/SMS/Push
                                </text>
                                <path
                                    d='M 520 165 L 560 115'
                                    stroke='hsl(var(--muted-foreground))'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr)'
                                />

                                {/* Fulfillment Service */}
                                <rect
                                    x='560'
                                    y='155'
                                    width='110'
                                    height='40'
                                    rx='4'
                                    fill='hsl(var(--card))'
                                    stroke='#10b981'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='615'
                                    y='173'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    FULFILLMENT
                                </text>
                                <text
                                    x='615'
                                    y='186'
                                    textAnchor='middle'
                                    fill='hsl(var(--muted-foreground))'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Warehouse system
                                </text>
                                <path
                                    d='M 520 175 L 560 175'
                                    stroke='hsl(var(--muted-foreground))'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr)'
                                />

                                {/* Recommendation Service */}
                                <rect
                                    x='560'
                                    y='220'
                                    width='110'
                                    height='40'
                                    rx='4'
                                    fill='hsl(var(--card))'
                                    stroke='#f97316'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='615'
                                    y='238'
                                    textAnchor='middle'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    RECOMMEND
                                </text>
                                <text
                                    x='615'
                                    y='251'
                                    textAnchor='middle'
                                    fill='hsl(var(--muted-foreground))'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    ML Models
                                </text>
                                <path
                                    d='M 520 185 L 560 235'
                                    stroke='hsl(var(--muted-foreground))'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr)'
                                />
                            </svg>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'product-catalog-search',
            subHeader: { index: '005', title: 'Product Catalog & Search' },
            title: (
                <SectionTitle>
                    Product Catalog এবং Search
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Amazon-এ 350M+ products আছে। User যখন "wireless
                            headphones" search করে তখন milliseconds-এ relevant
                            results দেখাতে হবে। এজন্য দরকার সঠিক database
                            strategy।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '🔍 Elasticsearch — Full-Text Search',
                    content: (
                        <p>
                            Elasticsearch{' '}
                            <strong>inverted index</strong> দিয়ে full-text search
                            করে। 350M products-এ keyword search milliseconds-এ।
                            Faceted search (filter by brand, price, rating), fuzzy
                            matching, relevance scoring — সব Elasticsearch করে।
                            DynamoDB product catalog store করে,{' '}
                            <strong>Elasticsearch search index</strong> হিসেবে
                            কাজ করে।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Data', 'Database', 'Why?'],
                    rows: [
                        [
                            'Products catalog',
                            'DynamoDB + Elasticsearch',
                            'Flexible schema, search',
                        ],
                        [
                            'Orders (critical)',
                            'Aurora/PostgreSQL',
                            'ACID, financial data',
                        ],
                        [
                            'Inventory',
                            'MySQL (with row locking)',
                            'Atomic updates, locking',
                        ],
                        ['Shopping cart', 'Redis', 'Ephemeral, fast, TTL'],
                        ['User sessions', 'Redis', 'Fast auth check'],
                        [
                            'Product images',
                            'S3 + CloudFront',
                            'Object storage + CDN',
                        ],
                        [
                            'Reviews/ratings',
                            'Cassandra',
                            'High write volume',
                        ],
                        [
                            'Analytics/clickstream',
                            'Redshift/Snowflake',
                            'OLAP, data warehouse',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Orders DB-তে কেন ACID?',
                    content: (
                        <p>
                            Order = financial transaction। Double charge, lost
                            orders = real money loss। ACID গ্যারান্টি দেয়
                            partial writes হবে না। PostgreSQL/Aurora প্রতিটা
                            financial transaction-এর জন্য industry standard।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'inventory-flash-sales',
            subHeader: {
                index: '006',
                title: 'Inventory Management & Flash Sales',
            },
            title: (
                <SectionTitle>
                    Inventory Management এবং Flash Sales
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: '⚠️ Inventory Race Condition',
                    content: (
                        <p>
                            Stock = 1, user A ও B একই সময়ে checkout করছে।
                            Step 2-তে যদি proper locking না থাকে দুজনই "stock
                            available" দেখবেন। Solution:{' '}
                            <strong>Optimistic Locking</strong> বা{' '}
                            <strong>Database row lock</strong> with version
                            check।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'inventory_service.py — Optimistic Locking',
                    code: `def reserve_inventory(product_id, quantity, db):
    while True:
        # Current stock এবং version পড়ো
        product = db.get(f"SELECT id, stock, version FROM products WHERE id={product_id}")

        if product.stock < quantity:
            raise InsufficientStockError("Out of stock")

        # Version check দিয়ে atomic update
        rows_updated = db.execute("""
            UPDATE products
            SET stock = stock - %s, version = version + 1
            WHERE id = %s AND version = %s AND stock >= %s
        """, (quantity, product_id, product.version, quantity))

        if rows_updated == 1:
            # Success! কেউ আগে update করেনি
            return "Reserved"
        else:
            # Conflict! কেউ আগে stock নিয়ে গেছে, retry করুন
            continue  # বা raise error`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-4 mt-4'>
                            <h3 className='text-lg font-bold text-foreground'>
                                Flash Sale Strategy
                            </h3>
                            <p className='text-muted-foreground leading-relaxed'>
                                Flash sale: 100 units, 10,000 requests একসাথে।
                                Database-এ directly পাঠালে DB crash করবেন।
                                Solution: Redis atomic counter ব্যবহার করুন।
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Redis DECR — Flash Sale Solution',
                    content: (
                        <p>
                            Redis <strong>DECR atomic operation</strong>। Counter
                            = 1000। DECR → 999, 998... → 0। 0-এর নিচে গেলে
                            reject। DB-তে 1M requests পাঠানো মানে DB crash।
                            Redis in-memory তাই 1M req/sec handle করতে পারে।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'order-processing-saga',
            subHeader: { index: '007', title: 'Order Processing — Saga Pattern' },
            title: (
                <SectionTitle>
                    Order Placement — সবচেয়ে Critical Flow
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div>
                            <h3 className='text-lg font-bold text-foreground mb-4'>
                                🛒 Checkout Flow — Step by Step
                            </h3>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Step', 'Action', 'Service', 'Critical?'],
                    rows: [
                        [
                            '1. Cart Review',
                            'Items এবং prices confirm',
                            'Cart Service',
                            <span className='text-yellow-700 dark:text-yellow-400'>Medium</span>,
                        ],
                        [
                            '2. Lock Inventory',
                            'Stock reserve করুন (soft lock)',
                            'Inventory Service',
                            <span className='text-red-700 dark:text-red-400'>⚠️ Very Critical</span>,
                        ],
                        [
                            '3. Payment',
                            'Card charge করুন',
                            'Payment Service',
                            <span className='text-red-700 dark:text-red-400'>⚠️ Most Critical</span>,
                        ],
                        [
                            '4. Confirm Order',
                            'Order create করুন DB-তে',
                            'Order Service',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>Critical</span>,
                        ],
                        [
                            '5. Reduce Inventory',
                            'Actual stock deduct করুন',
                            'Inventory Service',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>Critical</span>,
                        ],
                        [
                            '6. Notify',
                            'Email/SMS পাঠাও',
                            'Notification Service',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>Low (async)</span>,
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '🎯 SAGA Pattern',
                    content: (
                        <p>
                            Distributed systems-এ traditional ACID transaction
                            নেই।{' '}
                            <strong>SAGA Pattern</strong> use করুন: প্রতিটা step
                            এর জন্য compensating transaction define করুন। Payment
                            fail হলে → inventory unlock করুন → cart restore করুন।
                            Chain of events with rollback।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    steps: [
                        {
                            title: (
                                <span className='font-mono text-emerald-700 dark:text-emerald-400'>
                                    Step 1 — Reserve Inventory
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Inventory Service-এ stock soft-lock করুন।
                                    Compensation:{' '}
                                    <span className='text-yellow-700 dark:text-yellow-400'>
                                        inventory.release(cart.items)
                                    </span>
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-emerald-700 dark:text-emerald-400'>
                                    Step 2 — Process Payment
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Payment Service-এ card charge করুন।
                                    Compensation:{' '}
                                    <span className='text-yellow-700 dark:text-yellow-400'>
                                        payment.refund(payment_id)
                                    </span>
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-emerald-700 dark:text-emerald-400'>
                                    Step 3 — Create Order
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Order Service DB-তে order create করুন।
                                    Compensation:{' '}
                                    <span className='text-yellow-700 dark:text-yellow-400'>
                                        order.cancel(order_id)
                                    </span>
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-blue-700 dark:text-blue-400'>
                                    Step 4 — Async Notifications (Kafka)
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Event publish করুন — Notification, Fulfillment
                                    service async consume করবেন।{' '}
                                    <span className='text-emerald-700 dark:text-emerald-400'>
                                        Non-blocking ✓
                                    </span>
                                </span>
                            ),
                        },
                    ],
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'order_saga.py — SAGA Pattern',
                    code: `class PlaceOrderSaga:
    def execute(self, cart, payment_info):
        steps_completed = []
        try:
            # Step 1: Reserve inventory
            self.inventory.reserve(cart.items)
            steps_completed.append('inventory')

            # Step 2: Process payment
            payment_id = self.payment.charge(payment_info, cart.total)
            steps_completed.append('payment')

            # Step 3: Create order
            order = self.order.create(cart, payment_id)
            steps_completed.append('order')

            # Step 4: Async notifications (Kafka)
            self.events.publish("order.placed", order)
            return order

        except Exception as e:
            # Compensating transactions (rollback)
            if 'payment' in steps_completed:
                self.payment.refund(payment_id)
            if 'inventory' in steps_completed:
                self.inventory.release(cart.items)
            raise e`,
                },
            ],
        },
        {
            id: 'scaling-tech-stack',
            subHeader: {
                index: '008',
                title: 'Scaling & Tech Stack',
            },
            title: (
                <SectionTitle>
                    Black Friday Scaling এবং Tech Stack
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-3 mt-2'>
                            <h3 className='text-lg font-bold text-foreground mb-4'>
                                Scaling Decisions
                            </h3>
                            {[
                                {
                                    type: 'pro',
                                    label: 'Strategy',
                                    text: (
                                        <>
                                            <strong className='text-foreground'>
                                                Auto-scaling:
                                            </strong>{' '}
                                            AWS Auto Scaling Groups। Traffic
                                            বাড়লে automatically EC2 instances
                                            add হয়। Black Friday-তে 10x scale
                                            up, afterward scale down।
                                        </>
                                    ),
                                },
                                {
                                    type: 'pro',
                                    label: 'Strategy',
                                    text: (
                                        <>
                                            <strong className='text-foreground'>
                                                Product Cache:
                                            </strong>{' '}
                                            Popular products Redis-এ cache করুন।
                                            80% product views cached। DB load
                                            drastically কমে।
                                        </>
                                    ),
                                },
                                {
                                    type: 'pro',
                                    label: 'Strategy',
                                    text: (
                                        <>
                                            <strong className='text-foreground'>
                                                Queue-based Order Processing:
                                            </strong>{' '}
                                            Order requests Kafka queue-তে নাও।
                                            Backend async process করে। User
                                            immediately "Order Received" দেখে।
                                        </>
                                    ),
                                },
                                {
                                    type: 'con',
                                    label: 'Trade-off',
                                    text: (
                                        <>
                                            <strong className='text-foreground'>
                                                Flash Sale Problem:
                                            </strong>{' '}
                                            100 units, 10,000 requests একসাথে।
                                            Redis SETNX দিয়ে atomic reservation।
                                            DB overload prevent করে কিন্তু Redis
                                            সত্য থেকে diverge হতে পারে।
                                        </>
                                    ),
                                },
                                {
                                    type: 'con',
                                    label: 'Trade-off',
                                    text: (
                                        <>
                                            <strong className='text-foreground'>
                                                Read Replicas:
                                            </strong>{' '}
                                            Product reads অনেক বেশি। Read
                                            replicas দিয়ে scale করুন কিন্তু
                                            replication lag এ newly added
                                            products কিছুক্ষণ দেখা না-ও যেতে
                                            পারে।
                                        </>
                                    ),
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className='flex gap-3 items-start'>
                                    <span
                                        className={`font-mono text-[11px] px-2.5 py-[3px] rounded flex-shrink-0 border ${
                                            item.type === 'pro'
                                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                                                : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
                                        }`}>
                                        {item.label}
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
                        <div className='mt-8 space-y-6'>
                            <h3 className='text-lg font-bold text-foreground'>
                                Amazon-এর Tech Stack
                            </h3>
                            {[
                                {
                                    label: 'Backend Services',
                                    tags: [
                                        {
                                            text: 'Java / Kotlin',
                                            color: 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5',
                                        },
                                        {
                                            text: 'Python (ML/Recommendations)',
                                            color: 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5',
                                        },
                                        {
                                            text: 'AWS ECS / Kubernetes',
                                            color: 'border-purple-500/30 text-purple-700 dark:text-purple-400 bg-purple-500/5',
                                        },
                                        {
                                            text: 'AWS API Gateway',
                                            color: 'border-purple-500/30 text-purple-700 dark:text-purple-400 bg-purple-500/5',
                                        },
                                    ],
                                },
                                {
                                    label: 'Databases',
                                    tags: [
                                        {
                                            text: 'DynamoDB (Product Catalog)',
                                            color: 'border-primary/30 text-primary bg-primary/5',
                                        },
                                        {
                                            text: 'Aurora PostgreSQL (Orders)',
                                            color: 'border-primary/30 text-primary bg-primary/5',
                                        },
                                        {
                                            text: 'Redis (Cart + Cache)',
                                            color: 'border-yellow-500/30 text-yellow-700 dark:text-yellow-400 bg-yellow-500/5',
                                        },
                                        {
                                            text: 'Elasticsearch (Search)',
                                            color: 'border-primary/30 text-primary bg-primary/5',
                                        },
                                        {
                                            text: 'Redshift (Analytics)',
                                            color: 'border-primary/30 text-primary bg-primary/5',
                                        },
                                    ],
                                },
                                {
                                    label: 'Infrastructure',
                                    tags: [
                                        {
                                            text: 'Amazon SQS / Kafka',
                                            color: 'border-orange-500/30 text-orange-700 dark:text-orange-400 bg-orange-500/5',
                                        },
                                        {
                                            text: 'CloudFront CDN',
                                            color: 'border-purple-500/30 text-purple-700 dark:text-purple-400 bg-purple-500/5',
                                        },
                                        {
                                            text: 'AWS S3 (Images)',
                                            color: 'border-purple-500/30 text-purple-700 dark:text-purple-400 bg-purple-500/5',
                                        },
                                        {
                                            text: 'Amazon SageMaker (ML)',
                                            color: 'border-purple-500/30 text-purple-700 dark:text-purple-400 bg-purple-500/5',
                                        },
                                    ],
                                },
                            ].map((section, i) => (
                                <div key={i}>
                                    <h4 className='text-sm font-bold text-muted-foreground mb-3'>
                                        {section.label}
                                    </h4>
                                    <div className='flex flex-wrap gap-2'>
                                        {section.tags.map((tag, j) => (
                                            <span
                                                key={j}
                                                className={`font-mono text-xs px-3 py-1.5 rounded border ${tag.color}`}>
                                                {tag.text}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='mt-8'>
                            <h3 className='text-lg font-bold text-foreground mb-4'>
                                Payment এবং Recommendations
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='bg-card border border-border rounded-lg p-5'>
                                    <h4 className='font-mono text-[11px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold mb-3'>
                                        💳 Payment System
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Payment = most critical path। Stripe বা
                                        Internal payment processor। Idempotency
                                        key দিয়ে double charge prevent করুন।
                                        PCI DSS compliance mandatory।
                                        Synchronous flow — user wait করে।
                                    </p>
                                </div>
                                <div className='bg-card border border-border rounded-lg p-5'>
                                    <h4 className='font-mono text-[11px] uppercase tracking-widest text-orange-700 dark:text-orange-400 font-bold mb-3'>
                                        🤖 Recommendations
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Collaborative filtering ML model + offline
                                        batch computation। "User A এবং User B
                                        একই products কিনেছে" — pattern থেকে
                                        suggest করুন। Offline job (Spark) daily
                                        compute। Real-time serving Redis থেকে।
                                    </p>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '🎯 Interview Tips — Amazon System Design',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>1)</strong> সবসময় overselling problem
                                mention করুন এবং Optimistic Locking solution দিন।
                            </p>
                            <p>
                                <strong>2)</strong> Order processing-এ SAGA
                                pattern explain করুন — distributed transaction
                                problem জানাও।
                            </p>
                            <p>
                                <strong>3)</strong> Database choices justify
                                করুন: Orders → PostgreSQL (ACID), Cart → Redis
                                (ephemeral), Search → Elasticsearch।
                            </p>
                            <p>
                                <strong>4)</strong> Black Friday spike-এর জন্য
                                Auto-scaling + Queue-based processing mention
                                করুন।
                            </p>
                            <p>
                                <strong>5)</strong> Notification async (Kafka)
                                — checkout speed বাড়ানোর জন্য।
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
                <span className='font-bold text-primary'>Overselling</span>,
                'Optimistic locking',
                'MySQL version check',
            ],
            [
                <span className='font-bold text-primary'>
                    Distributed transactions
                </span>,
                'SAGA pattern',
                'Kafka events',
            ],
            [
                <span className='font-bold text-primary'>Product search</span>,
                'Inverted index',
                'Elasticsearch',
            ],
            [
                <span className='font-bold text-primary'>Traffic spikes</span>,
                'Auto-scaling',
                'AWS Auto Scaling',
            ],
            [
                <span className='font-bold text-primary'>
                    Async processing
                </span>,
                'Event-driven',
                'Kafka / SQS',
            ],
            [
                <span className='font-bold text-primary'>Flash sale</span>,
                'Atomic counter',
                'Redis DECR',
            ],
            [
                <span className='font-bold text-primary'>Shopping cart</span>,
                'In-memory storage',
                'Redis (TTL)',
            ],
            [
                <span className='font-bold text-primary'>
                    Financial orders
                </span>,
                'ACID transactions',
                'PostgreSQL/Aurora',
            ],
            [
                <span className='font-bold text-primary'>
                    Product images
                </span>,
                'CDN + Object storage',
                'S3 + CloudFront',
            ],
            [
                <span className='font-bold text-primary'>Recommendations</span>,
                'Collaborative filtering',
                'ML + Redis serving',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'Stock = 1, 100 user একই সময়ে order দিল। Overselling prevent করবেন কীভাবে?',
                options: [
                    {
                        key: 'a',
                        text: 'শুধু প্রথম request accept করুন',
                        isCorrect: false,
                        explanation:
                            'প্রথম request detect করা distributed system-এ practically impossible — race condition তৈরি হয়।',
                    },
                    {
                        key: 'b',
                        text: 'Queue-তে রাখুন, একে একে process করুন',
                        isCorrect: false,
                        explanation:
                            'Queue slow হবে এবং guarantee করে না যে stock check atomic হবে।',
                    },
                    {
                        key: 'c',
                        text: 'Database row-level lock + version check (Optimistic Locking)',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Optimistic Locking: UPDATE stock WHERE version=X। শুধু একটা transaction succeed করবেন, বাকিগুলো retry করবেন বা fail পাবেন। Race condition perfectly handle করে। Production-grade solution।',
                    },
                    {
                        key: 'd',
                        text: 'Redis-এ counter রাখুন',
                        isCorrect: false,
                        explanation:
                            'Redis counter flash sale-এ ভালো কিন্তু full order flow-এর জন্য DB-level locking standard solution।',
                    },
                ],
            },
            {
                id: 2,
                text: 'Shopping cart কোন database-এ রাখবে এবং কেন?',
                options: [
                    {
                        key: 'a',
                        text: 'MySQL — persistent রাখতে',
                        isCorrect: false,
                        explanation:
                            'Cart data rarely needs complex queries — MySQL overkill। TTL support নেই naturally।',
                    },
                    {
                        key: 'b',
                        text: 'Redis — fast, ephemeral, TTL support',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Cart data temporary, fast access দরকার, TTL দিয়ে abandoned cart expire করুন। Redis in-memory তাই sub-millisecond read/write। Cart rarely needs complex queries — simple key-value perfect।',
                    },
                    {
                        key: 'c',
                        text: 'Cassandra — massive scale',
                        isCorrect: false,
                        explanation:
                            'Cassandra write-heavy use case-এর জন্য ভালো কিন্তু cart-এর জন্য Redis বেশি appropriate।',
                    },
                    {
                        key: 'd',
                        text: 'File system',
                        isCorrect: false,
                        explanation:
                            'File system production e-commerce-এর জন্য suitable নয়।',
                    },
                ],
            },
            {
                id: 3,
                text: 'Order data কোন database-এ রাখা উচিত?',
                options: [
                    {
                        key: 'a',
                        text: 'PostgreSQL/Aurora — ACID transactions',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Orders = financial data। ACID গ্যারান্টি mandatory। Partial order write হলে money lost হবে। PostgreSQL/Aurora strong consistency, transactions, foreign keys support করে। এটা non-negotiable।',
                    },
                    {
                        key: 'b',
                        text: 'Redis — fast',
                        isCorrect: false,
                        explanation:
                            'Redis ephemeral — Redis restart হলে orders হারিয়ে যাবেন। Financial data Redis-এ রাখা dangerous।',
                    },
                    {
                        key: 'c',
                        text: 'Cassandra — scale',
                        isCorrect: false,
                        explanation:
                            'Cassandra eventual consistency — order double write বা lost write হতে পারে। Financial data-র জন্য ACID দরকার।',
                    },
                    {
                        key: 'd',
                        text: 'Elasticsearch — search',
                        isCorrect: false,
                        explanation:
                            'Elasticsearch search engine, transactional database নয়। Orders Elasticsearch-এ রাখা যাবেন না।',
                    },
                ],
            },
            {
                id: 4,
                text: 'SAGA Pattern কী এবং কেন দরকার?',
                options: [
                    {
                        key: 'a',
                        text: 'Database optimization technique',
                        isCorrect: false,
                        explanation:
                            'SAGA Pattern database optimization নয়।',
                    },
                    {
                        key: 'b',
                        text: 'Caching strategy',
                        isCorrect: false,
                        explanation: 'SAGA Pattern caching-এর সাথে সম্পর্কিত নয়।',
                    },
                    {
                        key: 'c',
                        text: 'Load balancing algorithm',
                        isCorrect: false,
                        explanation:
                            'Load balancing আলাদা concept — SAGA Pattern এটা নয়।',
                    },
                    {
                        key: 'd',
                        text: 'Distributed transaction pattern with compensating rollbacks',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Microservices-এ single ACID transaction নেই। SAGA: প্রতিটা step-এর জন্য compensating action define করুন। Payment fail → inventory release, order cancel। Eventual consistency with rollback capability।',
                    },
                ],
            },
            {
                id: 5,
                text: 'Product search (keyword search) implement করতে কোন database?',
                options: [
                    {
                        key: 'a',
                        text: 'MySQL LIKE query',
                        isCorrect: false,
                        explanation:
                            'MySQL LIKE query full table scan করে — 350M products-এ extremely slow।',
                    },
                    {
                        key: 'b',
                        text: 'Elasticsearch',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Elasticsearch inverted index দিয়ে full-text search করে। 350M products-এ "wireless headphones" search milliseconds-এ। Faceted search (filter by brand, price), fuzzy matching, relevance scoring — সব Elasticsearch করে।',
                    },
                    {
                        key: 'c',
                        text: 'Redis',
                        isCorrect: false,
                        explanation:
                            'Redis key-value store — full-text search-এর জন্য designed নয়।',
                    },
                    {
                        key: 'd',
                        text: 'DynamoDB scan',
                        isCorrect: false,
                        explanation:
                            'DynamoDB scan expensive এবং full-text search support করে না properly।',
                    },
                ],
            },
            {
                id: 6,
                text: 'Black Friday-তে 10x traffic spike handle করার best approach?',
                options: [
                    {
                        key: 'a',
                        text: 'সারা বছর 10x capacity রাখুন',
                        isCorrect: false,
                        explanation:
                            'সারা বছর 10x capacity = massive waste of money। Cost-inefficient।',
                    },
                    {
                        key: 'b',
                        text: 'Traffic limit করুন',
                        isCorrect: false,
                        explanation:
                            'Traffic limit করলেন users চলে যাবেন — revenue loss।',
                    },
                    {
                        key: 'c',
                        text: 'Auto-scaling + queue-based order processing',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Auto-scaling: demand বাড়লে automatically servers add হয়, কমলে remove। Queue-based: orders Kafka-তে নাও, backend async process করে — user waiting দেখে না। এই combination 100x spike handle করে।',
                    },
                    {
                        key: 'd',
                        text: 'Single mega server',
                        isCorrect: false,
                        explanation:
                            'Single server = single point of failure। Horizontal scaling ছাড়া 10x spike handle করা impossible।',
                    },
                ],
            },
            {
                id: 7,
                text: 'Microservices-এ services-এর মধ্যে async communication কীভাবে করবেন?',
                options: [
                    {
                        key: 'a',
                        text: 'Message Queue (Kafka/SQS) — event-driven',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Event-driven: Order placed → Kafka event publish → Notification service, Fulfillment service, Inventory service সব independently consume করে। Loose coupling, fault-tolerant। Direct HTTP call = tight coupling + cascade failure risk।',
                    },
                    {
                        key: 'b',
                        text: 'Direct HTTP call',
                        isCorrect: false,
                        explanation:
                            'Direct HTTP call synchronous — tight coupling। একটা service down হলে chain fail করে।',
                    },
                    {
                        key: 'c',
                        text: 'Shared database',
                        isCorrect: false,
                        explanation:
                            'Shared database microservices anti-pattern — services আলাদা DB রাখবে।',
                    },
                    {
                        key: 'd',
                        text: 'File sharing',
                        isCorrect: false,
                        explanation:
                            'File sharing production microservices-এ use করা হয় না।',
                    },
                ],
            },
            {
                id: 8,
                text: 'Product recommendations ("Customers also bought") কীভাবে implement করবেন?',
                options: [
                    {
                        key: 'a',
                        text: 'Random products দেখাও',
                        isCorrect: false,
                        explanation:
                            'Random products irrelevant — conversion rate শূন্য।',
                    },
                    {
                        key: 'b',
                        text: 'Most popular products সবসময়',
                        isCorrect: false,
                        explanation:
                            'Same popular products সবাইকে দেখানো personalized নয় — suboptimal।',
                    },
                    {
                        key: 'c',
                        text: 'Seller manually set করবেন',
                        isCorrect: false,
                        explanation:
                            'Manual setting scalable নয় — 350M products-এ impossible।',
                    },
                    {
                        key: 'd',
                        text: 'Collaborative filtering ML model + offline batch computation',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Collaborative filtering: "User A এবং User B একই products কিনেছে, User A যা কিনেছে সেটা User B-কে recommend করুন।" Offline batch job (Spark) প্রতিদিন compute করে। Real-time serving Redis থেকে।',
                    },
                ],
            },
            {
                id: 9,
                text: 'Flash sale (1000 items, 1 million users) efficiently handle করবেন কীভাবে?',
                options: [
                    {
                        key: 'a',
                        text: 'সব requests DB-তে পাঠাও',
                        isCorrect: false,
                        explanation:
                            'DB-তে 1M requests পাঠানো মানে DB crash। Database এই load handle করতে পারবেন না।',
                    },
                    {
                        key: 'b',
                        text: 'Redis-এ stock counter, DECR atomic করুন। Zero হলে reject।',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Redis DECR atomic operation। Counter = 1000। DECR → 999, 998... → 0। 0-এর নিচে গেলে reject। DB-তে 1M requests পাঠানো মানে DB crash। Redis in-memory তাই 1M req/sec handle করতে পারে।',
                    },
                    {
                        key: 'c',
                        text: 'Lottery system',
                        isCorrect: false,
                        explanation:
                            'Lottery fair মনে হলেও first-come-first-served এর চেয়ে complex এবং user experience খারাপ।',
                    },
                    {
                        key: 'd',
                        text: 'Queue-তে সবাইকে রাখুন',
                        isCorrect: false,
                        explanation:
                            '1M users queue-তে রাখলে memory issue হবে এবং most users কখনো served হবে না।',
                    },
                ],
            },
            {
                id: 10,
                text: 'Order confirmation email কখন পাঠাবে — synchronously নাকি asynchronously?',
                options: [
                    {
                        key: 'a',
                        text: 'Synchronously — payment এর সাথে সাথে',
                        isCorrect: false,
                        explanation:
                            'Email sending slow হতে পারে (SMTP server lag)। Checkout flow-এ block করলেন user experience খারাপ হবে।',
                    },
                    {
                        key: 'b',
                        text: 'User manually request করলেন',
                        isCorrect: false,
                        explanation:
                            'User manually request করা practical নয় — automatic notification দরকার।',
                    },
                    {
                        key: 'c',
                        text: 'Asynchronously via Kafka — checkout speed বাড়ানোর জন্য',
                        isCorrect: true,
                        explanation:
                            'সঠিক উত্তর। Email sending slow হতে পারে (SMTP server lag)। Checkout flow-এ block করা যাবেন না। Kafka event publish করুন → notification service async-ভাবে email পাঠাবে। User fast checkout পাবেন, email কিছু সেকেন্ড পরে আসবেন।',
                    },
                    {
                        key: 'd',
                        text: 'প্রতিদিন batch-এ',
                        isCorrect: false,
                        explanation:
                            'Batch email পরের দিন পাঠানো unacceptable — user সাথে সাথে confirmation চায়।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'E-commerce Platform ডিজাইন করুন',
        time: '৫-৬ ঘন্টা',
        difficulty: 'Advanced',
        tasks: [
            <span key='1'>
                <strong>Architecture Diagram:</strong> Amazon-এর complete
                microservices diagram আঁকুন। Services: API Gateway, Product
                Service, Cart Service, Order Service, Payment Service, Inventory
                Service, Notification Service। Event Bus (Kafka) দিয়ে async
                connections দেখাও।
            </span>,
            <span key='2'>
                <strong>Inventory Race Condition:</strong> 5 users একই সময়ে
                last 1 item buy করতে চাইছে। Step-by-step trace করুন Optimistic
                Locking কীভাবে handle করে। কে জিতবে, বাকিরা কী পাবেন?
            </span>,
            <span key='3'>
                <strong>SAGA Implementation:</strong> Order placement SAGA-এর
                steps লিখুন (Reserve Inventory → Charge Payment → Create Order)।
                প্রতিটা step fail হলে compensating action কী? Table বানান।
            </span>,
            <span key='4'>
                <strong>Database Selection:</strong> নিচের প্রতিটা data-এর জন্য
                database choose করুন এবং reason দিন: (ক) Product details, (খ)
                Orders, (গ) Shopping cart, (ঘ) Product search index, (ঙ) User
                session।
            </span>,
            <span key='5'>
                <strong>Flash Sale Design:</strong> 100 items, 1 million users
                প্রথম 1 minute-এ buy করতে চাইছে। Redis দিয়ে কীভাবে handle
                করবেন? Pseudo-code লিখুন।
            </span>,
        ],
        deliverables: [
            <span key='1'>Microservices architecture diagram</span>,
            <span key='2'>Race condition trace with Optimistic Locking</span>,
            <span key='3'>SAGA compensating actions table</span>,
            <span key='4'>
                Database selection with reasons (৫টা data type)
            </span>,
        ],
    },
    practicalLab: {
        title: 'Amazon-style Order System',
        subtitle: 'Inventory + Saga + Payment',
        steps: [
            {
                title: '৩টা Mock Service বানান',
                description:
                    'Order Service (:8000), Payment Service (:8001), Inventory Service (:8002) — প্রতিটায় reserve/release/charge/refund endpoints।',
            },
            {
                title: 'Optimistic Locking Implement করুন',
                description:
                    'Inventory service-এ version column যোগ করুন। UPDATE stock WHERE version=X — concurrent requests test করুন।',
            },
            {
                title: 'SAGA Orchestrator লিখুন',
                description:
                    'PlaceOrderSaga class: Reserve Inventory → Charge Payment → Create Order। Failure-এ backward compensation চালাও।',
            },
            {
                title: 'Flash Sale Simulate করুন',
                description:
                    'Redis-এ stock counter set করুন (e.g., 10)। 100 concurrent requests পাঠাও — DECR atomic করুন। শুধু 10 জন succeed করবেন।',
            },
            {
                title: 'End-to-End Test করুন',
                description:
                    'Happy path: order complete। Failure path: inventory out of stock → payment refund → order cancel। State transitions verify করুন।',
            },
        ],
        codeBlock: {
            language: 'python',
            filename: 'amazon_order_system.py',
            code: `import redis
import threading
import sqlite3
import uuid

# Redis client for flash sale
r = redis.Redis(host='localhost', port=6379, db=0)

# ─── OPTIMISTIC LOCKING: Inventory Service ───────────────────────────────────
def reserve_inventory(product_id: str, quantity: int, conn) -> bool:
    """Prevent overselling with optimistic locking + version check"""
    cursor = conn.cursor()
    max_retries = 3

    for attempt in range(max_retries):
        # Read current stock and version
        cursor.execute(
            "SELECT stock, version FROM inventory WHERE product_id = ?",
            (product_id,)
        )
        row = cursor.fetchone()
        if not row:
            raise ValueError(f"Product {product_id} not found")

        stock, version = row
        if stock < quantity:
            raise Exception("Insufficient stock")

        # Atomic update with version check — only one thread wins!
        cursor.execute("""
            UPDATE inventory
            SET stock = stock - ?, version = version + 1
            WHERE product_id = ? AND version = ? AND stock >= ?
        """, (quantity, product_id, version, quantity))

        conn.commit()

        if cursor.rowcount == 1:
            print(f"  ✅ Reserved {quantity} units of {product_id} (attempt {attempt+1})")
            return True
        else:
            # Another thread updated first — retry
            print(f"  ⚡ Conflict on attempt {attempt+1}, retrying...")
            conn.rollback()

    raise Exception("Max retries exceeded — could not reserve inventory")


# ─── SAGA ORCHESTRATOR: Order Placement ──────────────────────────────────────
class PlaceOrderSaga:
    """
    Distributed transaction via SAGA pattern.
    Each step has a compensating action for rollback.
    """

    def __init__(self, inventory_conn):
        self.inventory_conn = inventory_conn

    def execute(self, user_id: str, product_id: str, amount: float) -> dict:
        saga_id = str(uuid.uuid4())[:8]
        steps_completed = []
        payment_id = None
        order_id = None

        print(f"\\n🚀 SAGA {saga_id} started")

        try:
            # T1: Reserve inventory (with optimistic locking)
            reserve_inventory(product_id, 1, self.inventory_conn)
            steps_completed.append('inventory')
            print(f"  ✅ T1: Inventory reserved")

            # T2: Process payment (simulate)
            if amount > 50000:
                raise Exception("Payment declined — amount too high")
            payment_id = f"pay_{uuid.uuid4().hex[:8]}"
            steps_completed.append('payment')
            print(f"  ✅ T2: Payment charged — {payment_id}")

            # T3: Create order record
            order_id = f"ord_{uuid.uuid4().hex[:8]}"
            steps_completed.append('order')
            print(f"  ✅ T3: Order created — {order_id}")

            # T4: Async notification (Kafka publish — simulated)
            print(f"  📨 T4: Event published → order.placed (async)")

            print(f"  🎉 SAGA {saga_id} COMPLETED!")
            return {"status": "success", "order_id": order_id, "saga_id": saga_id}

        except Exception as e:
            print(f"  ❌ SAGA {saga_id} FAILED: {e}")
            print(f"  ↩️  Compensating {steps_completed[::-1]}...")

            # Compensate in reverse order
            if 'payment' in steps_completed and payment_id:
                print(f"  ↩️  C2: Payment {payment_id} refunded")
            if 'inventory' in steps_completed:
                # Release inventory
                cursor = self.inventory_conn.cursor()
                cursor.execute(
                    "UPDATE inventory SET stock = stock + 1 WHERE product_id = ?",
                    (product_id,)
                )
                self.inventory_conn.commit()
                print(f"  ↩️  C1: Inventory released for {product_id}")

            return {"status": "failed", "reason": str(e), "saga_id": saga_id}


# ─── FLASH SALE: Redis Atomic Counter ────────────────────────────────────────
def setup_flash_sale(product_id: str, stock: int):
    """Initialize flash sale counter in Redis"""
    r.set(f"flash_sale:{product_id}", stock)
    print(f"⚡ Flash sale started: {stock} units of {product_id}")

def attempt_flash_purchase(user_id: str, product_id: str) -> bool:
    """
    Atomic DECR — only one thread decrements at a time.
    Returns True if purchase successful, False if sold out.
    """
    remaining = r.decr(f"flash_sale:{product_id}")
    if remaining >= 0:
        print(f"  ✅ User {user_id} got item! Remaining: {remaining}")
        return True
    else:
        # Restore counter (don't go below zero indefinitely)
        r.incr(f"flash_sale:{product_id}")
        print(f"  ❌ User {user_id} — SOLD OUT!")
        return False


# ─── TEST ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    # Setup SQLite for inventory
    conn = sqlite3.connect(":memory:")
    conn.execute("""
        CREATE TABLE inventory (
            product_id TEXT PRIMARY KEY,
            stock INTEGER NOT NULL,
            version INTEGER NOT NULL DEFAULT 0
        )
    """)
    conn.execute("INSERT INTO inventory VALUES ('PROD-001', 5, 0)")
    conn.commit()

    saga = PlaceOrderSaga(conn)

    print("=== Test 1: Happy Path ===")
    saga.execute("user1", "PROD-001", 2999.0)

    print("\\n=== Test 2: Payment Failure — Compensation ===")
    saga.execute("user2", "PROD-001", 999999.0)  # Too high → payment fail

    print("\\n=== Test 3: Flash Sale (10 items, 15 users) ===")
    setup_flash_sale("FLASH-PROD", 10)
    threads = []
    for i in range(15):
        t = threading.Thread(
            target=attempt_flash_purchase,
            args=(f"user{i}", "FLASH-PROD")
        )
        threads.append(t)
    for t in threads:
        t.start()
    for t in threads:
        t.join()`,
        },
        tip: 'Optimistic Locking, SAGA Pattern, এবং Redis atomic counter — এই তিনটা concept Amazon-style e-commerce-এর core। Interview-তে এগুলো confidently explain করতে পারলেন senior engineer-level knowledge প্রমাণ হয়।',
    },
};
