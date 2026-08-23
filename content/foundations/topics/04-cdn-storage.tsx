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

export const cdnStorageContent: TopicData = {
    id: 'cdn-storage',
    sections: [
        {
            id: 'concept',
            subHeader: { index: '001', title: 'Core Concept' },
            title: (
                <SectionTitle>CDN ও Object Storage কী?</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                ধরুন আপনি ঢাকায় বসে Netflix এ একটা movie দেখছো।
                                সেই movie র file কি USA এর server থেকে আসছে? না!
                                Netflix CDN এর মাধ্যমে সেই file টা আপনার
                                কাছাকাছি একটা server এ (হয়তো Singapore বা
                                Mumbai তে) cache করে রাখে। আপনি সেখান থেকেই
                                পাচ্ছেন —{' '}
                                <strong className='text-foreground'>
                                    ১০x faster
                                </strong>
                                ।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'দুটো Key Concept',
                    content: (
                        <div className='space-y-3'>
                            <p>
                                <strong>CDN (Content Delivery Network):</strong>{' '}
                                বিশ্বের বিভিন্ন স্থানে PoP (Point of Presence)
                                servers রেখে static content (images, videos,
                                CSS, JS) কাছে থেকে serve করে। Latency কমায়।
                            </p>
                            <p>
                                <strong>Object Storage (S3-like):</strong>{' '}
                                Files, images, videos কে key-value store এ রাখা।
                                Unlimited storage, highly durable (99.999999999%
                                — 11 nines!), cheap। Database এর মতো query করা
                                যায় না কিন্তু files store এর জন্য perfect।
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: 'CDN ছাড়া vs CDN সহ',
                    content: (
                        <p>
                            ঢাকা → USA server:{' '}
                            <strong className='text-red-700 dark:text-red-400'>
                                ~200-300ms latency
                            </strong>
                            । ঢাকা → Singapore CDN PoP:{' '}
                            <strong className='text-emerald-700 dark:text-emerald-400'>
                                ~30-50ms latency
                            </strong>
                            । ৫-১০x faster! Netflix, YouTube, Facebook সবাই CDN
                            use করে। CDN ছাড়া global scale impossible।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'cdn-how-it-works',
            subHeader: { index: '002', title: 'CDN How it Works' },
            title: <SectionTitle>CDN কীভাবে কাজ করে?</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            CDN এর মূল concept হলো{' '}
                            <strong className='text-foreground'>
                                Edge Caching
                            </strong>
                            । User এর request প্রথমে nearest CDN edge server এ
                            যায়। Cache hit হলে সেখান থেকেই response। Miss হলে
                            origin server থেকে content fetch করে cache করে রাখে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='border border-border bg-card/30 rounded-sm p-6 my-4 overflow-x-auto'>
                            <p className='font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-4'>
                                CDN GLOBAL ARCHITECTURE
                            </p>
                            <div className='flex flex-col items-center gap-4'>
                                {/* Origin Server */}
                                <div className='border border-orange-500/40 bg-orange-500/10 rounded px-6 py-3 text-center'>
                                    <p className='font-mono text-xs font-bold text-orange-700 dark:text-orange-400'>
                                        🏢 Origin Server
                                    </p>
                                    <p className='font-mono text-[10px] text-muted-foreground'>
                                        USA (us-east-1)
                                    </p>
                                </div>
                                {/* Dashed lines */}
                                <div className='flex items-center gap-1'>
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className='w-3 h-px bg-orange-500/50'
                                        />
                                    ))}
                                    <span className='font-mono text-[9px] text-muted-foreground mx-2'>
                                        distributes to PoPs
                                    </span>
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className='w-3 h-px bg-orange-500/50'
                                        />
                                    ))}
                                </div>
                                {/* PoP Grid */}
                                <div className='grid grid-cols-2 md:grid-cols-5 gap-3 w-full'>
                                    {[
                                        {
                                            city: 'London',
                                            users: 'EU users ~10ms',
                                        },
                                        {
                                            city: 'Singapore',
                                            users: 'BD users ~35ms',
                                        },
                                        {
                                            city: 'Mumbai',
                                            users: 'IN users ~5ms',
                                        },
                                        {
                                            city: 'Tokyo',
                                            users: 'JP users ~5ms',
                                        },
                                        {
                                            city: 'New York',
                                            users: 'US users ~5ms',
                                        },
                                    ].map(pop => (
                                        <div
                                            key={pop.city}
                                            className='border border-emerald-500/40 bg-emerald-500/10 rounded px-3 py-2 text-center'>
                                            <p className='font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-400'>
                                                ⚡ PoP: {pop.city}
                                            </p>
                                            <p className='font-mono text-[9px] text-muted-foreground'>
                                                {pop.users}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <p className='font-mono text-[10px] text-blue-700 dark:text-blue-400 text-center'>
                                    BD User → Singapore PoP: ~35ms ✓
                                    &nbsp;|&nbsp; Without CDN (USA): ~250ms ✗
                                </p>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-4 mt-10'>
                                CDN Cache Control
                            </h3>
                            <ContentParagraph className='mb-4'>
                                কতক্ষণ CDN এ cache থাকবেন সেটা{' '}
                                <strong className='text-foreground'>
                                    Cache-Control header
                                </strong>{' '}
                                দিয়ে control করা যায়।
                            </ContentParagraph>
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'http',
                    filename: 'cache-control.txt',
                    code: `# Static assets — দীর্ঘ সময় cache করুন
Cache-Control: public, max-age=31536000, immutable
# ১ বছর cache (হ্যাশ-based filename use করুন)

# HTML pages — কম সময়
Cache-Control: public, max-age=3600
# ১ ঘণ্টা cache

# Private (user-specific) — CDN cache করবেন না
Cache-Control: private, no-cache
# Browser cache করতে পারে, CDN পারবেন না

# Never cache করুন না
Cache-Control: no-store
# Real-time data, sensitive information`,
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'CDN Provider',
                        'Global PoPs',
                        'Best For',
                        'Price',
                        'DDoS Protection',
                    ],
                    rows: [
                        [
                            'Cloudflare',
                            '300+',
                            'DDoS protection, global sites',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Free tier available
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400'>
                                ✅ Built-in
                            </span>,
                        ],
                        [
                            'AWS CloudFront',
                            '450+',
                            'AWS ecosystem integration',
                            <span className='text-yellow-700 dark:text-yellow-400'>
                                Pay per use
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400'>
                                ✅ WAF Integration
                            </span>,
                        ],
                        [
                            'Fastly',
                            '100+',
                            'Programmable CDN, edge compute',
                            <span className='text-red-700 dark:text-red-400'>Expensive</span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>✅ Add-on</span>,
                        ],
                        [
                            'Akamai',
                            '4000+',
                            'Enterprise, largest network',
                            <span className='text-red-700 dark:text-red-400'>
                                Very expensive
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400'>
                                ✅ Enterprise-grade
                            </span>,
                        ],
                    ],
                },
            ],
        },
        {
            id: 'object-storage-s3',
            subHeader: { index: '003', title: 'Object Storage (S3)' },
            title: (
                <SectionTitle>AWS S3 — Object Storage</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            S3 (Simple Storage Service) হলো AWS এর object
                            storage। File upload করুন, একটা URL পান — ব্যস।
                            Database এর মতো complex না, শুধু key-value:{' '}
                            <strong className='text-foreground'>
                                key = file path, value = file content
                            </strong>
                            ।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'S3 Core Concepts',
                    content: (
                        <div className='space-y-1'>
                            <p>
                                <strong>Bucket:</strong> Files এর container
                                (folder এর মতো)। Globally unique name।
                            </p>
                            <p>
                                <strong>Object:</strong> একটা file + metadata।
                            </p>
                            <p>
                                <strong>Key:</strong> Object এর path/name।
                            </p>
                            <p>
                                <strong>Storage Class:</strong> Standard
                                (frequent access), Glacier (archival, cheap),
                                Intelligent-Tiering (auto)।
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-6 mt-8'>
                                কখন S3 ব্যবহার করবো এবং করবো না
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-emerald-500' />
                                        <span className='text-emerald-700 dark:text-emerald-400'>
                                            ✅ S3 ব্যবহার করুন
                                        </span>
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        User uploaded files (images, videos,
                                        documents), Static website hosting,
                                        Backup and archive, Application logs, ML
                                        training data।
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-red-500' />
                                        <span className='text-red-700 dark:text-red-400'>
                                            ❌ S3 ব্যবহার করুন না
                                        </span>
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Frequently updated structured data
                                        (database use করুন), Real-time queries
                                        needed, Strong consistency needed, File
                                        system operations (rename, move costly)।
                                    </p>
                                </div>
                            </div>
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-4 mt-12'>
                            S3 Storage Classes
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Class', 'Access', 'Cost', 'Use Case'],
                    rows: [
                        [
                            'S3 Standard',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Instant
                            </span>,
                            <span className='text-red-700 dark:text-red-400'>Highest</span>,
                            'Frequently accessed — profile photos, app assets',
                        ],
                        [
                            'S3 Standard-IA',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Instant
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>
                                30% cheaper
                            </span>,
                            'Infrequent access — backups, older files',
                        ],
                        [
                            'S3 Glacier',
                            <span className='text-red-700 dark:text-red-400'>Minutes/hours</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Very cheap
                            </span>,
                            'Long-term archive — compliance, audit logs',
                        ],
                        [
                            'Glacier Deep Archive',
                            <span className='text-red-700 dark:text-red-400'>12 hours</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Cheapest
                            </span>,
                            '7-10 year retention, rarely accessed',
                        ],
                        [
                            'Intelligent-Tiering',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Instant
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>
                                Auto-optimize
                            </span>,
                            'Unknown access pattern — auto moves between tiers',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'Cost Saving Tip — Lifecycle Policy',
                    content: (
                        <p>
                            S3 Lifecycle Policy দিয়ে auto-transition করুন: প্রথম
                            ৩০ দিন Standard, ৩০-৯০ দিন S3-IA, ৯০+ দিন Glacier।
                            এতে automatically cost কমে। Instagram এই approach এ
                            petabytes of photos manage করে।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'cloudfront',
            subHeader: { index: '004', title: 'CloudFront' },
            title: <SectionTitle>AWS CloudFront — CDN</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            CloudFront হলো AWS এর CDN। S3 এর সাথে perfectly
                            integrate হয়। S3 bucket কে origin set করুন,
                            CloudFront globally distribute করবেন।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='border border-border bg-card/30 rounded-sm p-6 my-4 overflow-x-auto'>
                            <p className='font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-6'>
                                S3 + CLOUDFRONT INTEGRATION
                            </p>
                            <div className='flex flex-col md:flex-row items-center justify-center gap-0'>
                                {/* User */}
                                <div className='border border-blue-500/40 bg-blue-500/10 rounded px-4 py-3 text-center min-w-[100px]'>
                                    <p className='font-mono text-xs font-bold text-blue-700 dark:text-blue-400'>
                                        👤 User
                                    </p>
                                    <p className='font-mono text-[9px] text-muted-foreground'>
                                        Bangladesh
                                    </p>
                                </div>
                                {/* Arrow */}
                                <div className='flex flex-col items-center px-2'>
                                    <div className='h-px w-12 md:w-8 bg-blue-500/50 hidden md:block' />
                                    <p className='font-mono text-[8px] text-muted-foreground text-center'>
                                        DNS lookup
                                    </p>
                                    <div className='h-px w-12 md:w-8 bg-blue-500/50 hidden md:block' />
                                </div>
                                {/* CloudFront */}
                                <div className='border border-yellow-500/40 bg-yellow-500/10 rounded px-4 py-3 text-center min-w-[140px]'>
                                    <p className='font-mono text-xs font-bold text-yellow-700 dark:text-yellow-400'>
                                        ☁️ CloudFront
                                    </p>
                                    <p className='font-mono text-[9px] text-muted-foreground'>
                                        Edge: Singapore PoP
                                    </p>
                                    <p className='font-mono text-[9px] text-emerald-700 dark:text-emerald-400 mt-1'>
                                        Cache HIT → serve ✓
                                    </p>
                                    <p className='font-mono text-[9px] text-orange-700 dark:text-orange-400'>
                                        Cache MISS → fetch origin
                                    </p>
                                </div>
                                {/* Dashed Arrow */}
                                <div className='flex flex-col items-center px-2'>
                                    <div className='h-px w-12 md:w-8 bg-orange-500/50 border-dashed hidden md:block' />
                                    <p className='font-mono text-[8px] text-muted-foreground text-center'>
                                        on miss only
                                    </p>
                                    <div className='h-px w-12 md:w-8 bg-orange-500/50 hidden md:block' />
                                </div>
                                {/* S3 Origin */}
                                <div className='border border-orange-500/40 bg-orange-500/10 rounded px-4 py-3 text-center min-w-[120px]'>
                                    <p className='font-mono text-xs font-bold text-orange-700 dark:text-orange-400'>
                                        🗂️ S3 Origin
                                    </p>
                                    <p className='font-mono text-[9px] text-muted-foreground'>
                                        us-east-1
                                    </p>
                                    <p className='font-mono text-[9px] text-muted-foreground'>
                                        images/, videos/
                                    </p>
                                    <p className='font-mono text-[9px] text-muted-foreground'>
                                        static assets
                                    </p>
                                </div>
                            </div>
                            <p className='font-mono text-[10px] text-emerald-700 dark:text-emerald-400 text-center mt-4'>
                                95%+ requests served from edge — origin barely
                                touched
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'CloudFront Key Features',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>Origin Shield:</strong> Origin এর সামনে
                                extra caching layer — origin এ আরো কম requests।
                            </p>
                            <p>
                                <strong>Lambda@Edge:</strong> CDN edge এ code
                                run করুন — geolocation, A/B testing, auth।
                            </p>
                            <p>
                                <strong>Signed URLs:</strong> Private content এ
                                time-limited access।
                            </p>
                            <p>
                                <strong>WAF Integration:</strong> DDoS এবং bot
                                protection।
                            </p>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'complete-architecture',
            subHeader: { index: '005', title: 'Full Architecture' },
            title: (
                <SectionTitle>
                    Production-Ready Media Upload Architecture
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            একটা social media app এ user photo upload করলেন
                            কীভাবে S3 + CloudFront কাজ করে:
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='border border-border bg-card/30 rounded-sm p-6 my-4 overflow-x-auto'>
                            <p className='font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-1'>
                                Presigned URL: Direct S3 upload (API server
                                bandwidth save হয়)
                            </p>
                            <p className='font-mono text-[9px] text-blue-700 dark:text-blue-400 mb-6'>
                                UPLOAD FLOW DIAGRAM
                            </p>
                            {/* Step flow as horizontal diagram */}
                            <div className='flex flex-col gap-3'>
                                {/* Row 1 */}
                                <div className='flex flex-col md:flex-row items-start md:items-center gap-3'>
                                    <div className='border border-blue-500/40 bg-blue-500/10 rounded px-4 py-2 text-center min-w-[90px]'>
                                        <p className='font-mono text-xs font-bold text-blue-700 dark:text-blue-400'>
                                            📱 User
                                        </p>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <p className='font-mono text-[9px] text-muted-foreground'>
                                            1. Request upload URL →
                                        </p>
                                    </div>
                                    <div className='border border-purple-500/40 bg-purple-500/10 rounded px-4 py-2 text-center min-w-[110px]'>
                                        <p className='font-mono text-xs font-bold text-purple-700 dark:text-purple-400'>
                                            🔌 API Server
                                        </p>
                                        <p className='font-mono text-[9px] text-muted-foreground'>
                                            generate presigned URL
                                        </p>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <p className='font-mono text-[9px] text-purple-700 dark:text-purple-400'>
                                            ← 2. presigned URL
                                        </p>
                                    </div>
                                </div>
                                {/* Row 2 */}
                                <div className='flex flex-col md:flex-row items-start md:items-center gap-3 ml-0 md:ml-4'>
                                    <div className='border border-blue-500/40 bg-blue-500/10 rounded px-4 py-2 text-center min-w-[90px]'>
                                        <p className='font-mono text-xs font-bold text-blue-700 dark:text-blue-400'>
                                            📱 User
                                        </p>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <p className='font-mono text-[9px] text-orange-700 dark:text-orange-400'>
                                            3. Direct upload to S3 (no server!)
                                            →
                                        </p>
                                    </div>
                                    <div className='border border-orange-500/40 bg-orange-500/10 rounded px-4 py-2 text-center min-w-[90px]'>
                                        <p className='font-mono text-xs font-bold text-orange-700 dark:text-orange-400'>
                                            🗂️ S3
                                        </p>
                                        <p className='font-mono text-[9px] text-muted-foreground'>
                                            raw-uploads/
                                        </p>
                                    </div>
                                </div>
                                {/* Row 3 */}
                                <div className='flex flex-col md:flex-row items-start md:items-center gap-3 ml-0 md:ml-[calc(4px+90px+110px)]'>
                                    <div className='border border-yellow-500/40 bg-yellow-500/10 rounded px-4 py-2 text-center min-w-[90px]'>
                                        <p className='font-mono text-[9px] text-yellow-700 dark:text-yellow-400'>
                                            4. S3 Event →
                                        </p>
                                        <p className='font-mono text-xs font-bold text-yellow-700 dark:text-yellow-400'>
                                            ⚡ Lambda
                                        </p>
                                        <p className='font-mono text-[9px] text-muted-foreground'>
                                            resize: 800px, 400px, thumbnail
                                        </p>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <p className='font-mono text-[9px] text-emerald-700 dark:text-emerald-400'>
                                            5. Store processed →
                                        </p>
                                    </div>
                                    <div className='border border-emerald-500/40 bg-emerald-500/10 rounded px-4 py-2 text-center min-w-[120px]'>
                                        <p className='font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400'>
                                            S3 + CloudFront
                                        </p>
                                        <p className='font-mono text-[9px] text-muted-foreground'>
                                            cdn.app.com/
                                        </p>
                                        <p className='font-mono text-[9px] text-muted-foreground'>
                                            photo_800.webp
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'Presigned URL — কেন Important?',
                    content: (
                        <p>
                            User file upload করলেন API server এর bandwidth waste
                            হবে। Presigned URL দিলে user সরাসরি S3 তে upload
                            করে। API server শুধু temporary signed URL generate
                            করে — নিজে file handle করে না।{' '}
                            <strong>
                                Security maintained, bandwidth saved।
                            </strong>
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'code-examples',
            subHeader: { index: '006', title: 'Code Examples' },
            title: <SectionTitle>হাতে-কলমে Code</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-4'>
                            Python — S3 Upload & Presigned URL
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 's3_operations.py',
                    code: `import boto3
from botocore.exceptions import NoCredentialsError

s3 = boto3.client(
    's3',
    aws_access_key_id='YOUR_KEY',
    aws_secret_access_key='YOUR_SECRET',
    region_name='ap-southeast-1'  # Singapore
)

# ── File Upload ────────────────────────────────
def upload_file(local_path, bucket, s3_key):
    try:
        s3.upload_file(
            local_path, bucket, s3_key,
            ExtraArgs={
                'ContentType': 'image/webp',
                'CacheControl': 'public, max-age=31536000',
                'ACL': 'public-read'
            }
        )
        print(f"✅ Uploaded to s3://{bucket}/{s3_key}")
        return f"https://cdn.myapp.com/{s3_key}"
    except NoCredentialsError:
        raise Exception("AWS credentials not found")

# ── Presigned URL — Direct Browser Upload ──────
def generate_presigned_url(bucket, s3_key, expiry=3600):
    url = s3.generate_presigned_url(
        ClientMethod='put_object',
        Params={
            'Bucket': bucket,
            'Key': s3_key,
            'ContentType': 'image/jpeg'
        },
        ExpiresIn=expiry  # 1 hour
    )
    print(f"⏰ Presigned URL expires in {expiry}s")
    return url

# ── Lifecycle Policy — Auto archive ────────────
s3.put_bucket_lifecycle_configuration(
    Bucket='my-app-uploads',
    LifecycleConfiguration={
        'Rules': [{
            'ID': 'auto-archive',
            'Status': 'Enabled',
            'Transitions': [
                {'Days': 30, 'StorageClass': 'STANDARD_IA'},
                {'Days': 90, 'StorageClass': 'GLACIER'},
            ]
        }]
    }
)`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-4 mt-10'>
                            Node.js — Express + S3 Upload API
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'upload_api.js',
                    code: `const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');

const s3 = new S3Client({ region: 'ap-southeast-1' });

// Generate presigned URL for direct browser upload
app.post('/api/upload-url', async (req, res) => {
  const { fileType, fileName } = req.body;

  // Unique key prevent overwrite
  const key = \`uploads/\${uuidv4()}-\${fileName}\`;

  const command = new PutObjectCommand({
    Bucket: 'my-app-bucket',
    Key: key,
    ContentType: fileType,
  });

  // URL expires in 15 minutes
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 900 });
  const publicUrl = \`https://cdn.myapp.com/\${key}\`;

  res.json({ uploadUrl, publicUrl, key });
  // Frontend: PUT uploadUrl সরাসরি, তারপর publicUrl save করুন
});`,
                },
            ],
        },
        {
            id: 'interview-prep',
            subHeader: { index: '007', title: 'Interview Prep' },
            title: (
                <SectionTitle>Common Interview Questions</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q1: CDN ব্যবহার না করলেন কী হবে?',
                    content: (
                        <p>
                            <strong>উত্তর:</strong> Global users কে origin
                            server থেকে serve করতে হবে। USA → Bangladesh: ~250ms
                            latency। CDN সহ: Singapore PoP → ~35ms। ৭x slow।
                            Large files (videos) এ এটা catastrophic। Origin
                            server এ extra load।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q2: CDN Cache Invalidation কীভাবে করবেন?',
                    content: (
                        <p>
                            <strong>উত্তর:</strong> ৩টা approach: (১) Versioned
                            filenames — logo.v2.png (সবচেয়ে reliable)। (২)
                            CloudFront Invalidation API — নির্দিষ্ট paths
                            invalidate করুন (কিছুটা delay)। (৩) Short TTL —
                            frequent updates এর files এ কম TTL দিন।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q3: S3 vs Database — কখন কোনটা?',
                    content: (
                        <p>
                            <strong>উত্তর:</strong> <strong>S3</strong> — Binary
                            files (images, video, PDF), Large objects, No
                            complex queries, High durability cheap।{' '}
                            <strong>Database</strong> — Structured data, Complex
                            queries (JOIN, filter), Transactions needed,
                            Frequently updated। Instagram: Photos → S3, User
                            data/likes/comments → PostgreSQL।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q4: Presigned URL কেন ব্যবহার করবেন?',
                    content: (
                        <p>
                            <strong>উত্তর:</strong> File upload এ API server কে
                            bypass করা। Client সরাসরি S3 এ upload করে → API
                            server এর bandwidth ও CPU save। Time-limited URL (15
                            mins expire) → secure। Server scaling করতে হয় না
                            শুধু uploads এর জন্য।
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
                <span className='font-bold text-primary'>CDN</span>,
                'Edge servers এ content cache — globally fast delivery',
            ],
            [
                <span className='font-bold text-primary'>
                    Object Storage (S3)
                </span>,
                'Files/images/videos store করুন — unlimited, cheap, durable',
            ],
            [
                <span className='font-bold text-primary'>CloudFront</span>,
                'AWS CDN — S3 + CloudFront = globally fast static content',
            ],
            [
                <span className='font-bold text-primary'>Presigned URL</span>,
                'Client সরাসরি S3 তে upload — API server bypass',
            ],
            [
                <span className='font-bold text-primary'>Cache-Control</span>,
                'CDN কতক্ষণ cache রাখবে সেটা control করুন',
            ],
            [
                <span className='font-bold text-primary'>S3 Lifecycle</span>,
                'Auto-archive পুরানো files — cost save',
            ],
            [
                <span className='font-bold text-primary'>PoP</span>,
                'CDN এর edge location — users এর কাছাকাছি',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'CDN ব্যবহারের প্রধান সুবিধা কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Database query fast হয়',
                        isCorrect: false,
                        explanation:
                            'CDN database query কে affect করে না — এটা static content delivery এর জন্য।',
                    },
                    {
                        key: 'B',
                        text: 'Users এর কাছাকাছি edge server থেকে content serve হয় — latency কমে',
                        isCorrect: true,
                        explanation:
                            'CDN এর মূল কাজ হলো geographically distributed edge servers এ content cache করা। ঢাকার user Singapore PoP থেকে content পাবেন (~35ms), USA origin থেকে নয় (~250ms)।',
                    },
                    {
                        key: 'C',
                        text: 'Server এর CPU কমে',
                        isCorrect: false,
                        explanation:
                            'CDN origin server এর load কমায় ঠিকই, কিন্তু মূল উদ্দেশ্য latency কমানো।',
                    },
                    {
                        key: 'D',
                        text: 'Code execution faster হয়',
                        isCorrect: false,
                        explanation:
                            'CDN code execution এ কোনো প্রভাব ফেলে না।',
                    },
                ],
            },
            {
                id: 2,
                text: 'S3 Object Storage কোন ধরনের data store এর জন্য সবচেয়ে উপযুক্ত?',
                options: [
                    {
                        key: 'A',
                        text: 'User profile data (name, email, age)',
                        isCorrect: false,
                        explanation:
                            'Structured data এর জন্য relational database ব্যবহার করুন।',
                    },
                    {
                        key: 'B',
                        text: 'Real-time transaction data',
                        isCorrect: false,
                        explanation:
                            'Transactions এর জন্য database দরকার — S3 এ complex queries করা যায় না।',
                    },
                    {
                        key: 'C',
                        text: 'Images, videos, documents, backups',
                        isCorrect: true,
                        explanation:
                            'S3 binary files এর জন্য perfect: unlimited storage, highly durable, cheap। Complex queries করা যায় না, কিন্তু files store এবং serve এর জন্য ideal।',
                    },
                    {
                        key: 'D',
                        text: 'Session data',
                        isCorrect: false,
                        explanation:
                            'Session data এর জন্য Redis বা database ব্যবহার করুন।',
                    },
                ],
            },
            {
                id: 3,
                text: 'CDN Cache-Control: max-age=31536000 মানে কী?',
                options: [
                    {
                        key: 'A',
                        text: '১ বছর (31,536,000 seconds) CDN এ cache থাকবেন',
                        isCorrect: true,
                        explanation:
                            'max-age value seconds এ। 31,536,000 = 365 days = 1 year। Static assets (CSS, JS, images) এ এটা common — কিন্তু তখন file এর নামে hash দিতে হয় (app.abc123.js) যাতে update করলেন নতুন URL হয়।',
                    },
                    {
                        key: 'B',
                        text: '৩১ দিন cache থাকবেন',
                        isCorrect: false,
                        explanation:
                            '৩১ দিন = 2,678,400 seconds — 31,536,000 নয়।',
                    },
                    {
                        key: 'C',
                        text: '৩১ মিলিয়ন requests serve করবেন',
                        isCorrect: false,
                        explanation:
                            'max-age time এর সাথে related, request count এর সাথে নয়।',
                    },
                    {
                        key: 'D',
                        text: '৩১ MB পর্যন্ত file cache হবে',
                        isCorrect: false,
                        explanation:
                            'max-age file size এর সাথে related নয়, duration এর সাথে।',
                    },
                ],
            },
            {
                id: 4,
                text: 'Presigned URL কেন ব্যবহার করা হয়?',
                options: [
                    {
                        key: 'A',
                        text: 'Files encrypt করতে',
                        isCorrect: false,
                        explanation:
                            'Presigned URL encryption এর জন্য নয় — S3 নিজেই at-rest encryption করে।',
                    },
                    {
                        key: 'B',
                        text: 'URL shorten করতে',
                        isCorrect: false,
                        explanation:
                            'Presigned URL আসলে অনেক লম্বা URL generate করে।',
                    },
                    {
                        key: 'C',
                        text: 'CDN bypass করতে',
                        isCorrect: false,
                        explanation: 'Presigned URL CDN এর সাথে সম্পর্কিত নয়।',
                    },
                    {
                        key: 'D',
                        text: 'Client সরাসরি S3 এ upload করতে পারে — API server bandwidth waste হয় না',
                        isCorrect: true,
                        explanation:
                            'Presigned URL একটা temporary signed URL যা client কে সরাসরি S3 এ upload করতে দেয়। API server টা শুধু URL generate করে — file দেখে না। API server এর bandwidth ও scaling সমস্যা কমে।',
                    },
                ],
            },
            {
                id: 5,
                text: 'S3 Glacier কোন use case এর জন্য?',
                options: [
                    {
                        key: 'A',
                        text: 'Frequently accessed images',
                        isCorrect: false,
                        explanation:
                            'Frequently accessed files এর জন্য S3 Standard ব্যবহার করুন।',
                    },
                    {
                        key: 'B',
                        text: 'Long-term archival data যেখানে retrieval time কোনো ব্যাপার না',
                        isCorrect: true,
                        explanation:
                            'S3 Glacier archival storage। Retrieval time minutes to hours। কিন্তু Standard এর তুলনায় ৮০%+ সস্তা। Compliance logs, old backups, audit records এর জন্য perfect।',
                    },
                    {
                        key: 'C',
                        text: 'Real-time video streaming',
                        isCorrect: false,
                        explanation:
                            'Real-time streaming এর জন্য S3 Standard + CloudFront ব্যবহার করুন।',
                    },
                    {
                        key: 'D',
                        text: 'Session storage',
                        isCorrect: false,
                        explanation:
                            'Session storage এর জন্য Redis ব্যবহার করুন।',
                    },
                ],
            },
            {
                id: 6,
                text: 'CDN এ cache করা content update করতে হলে কী করবেন?',
                options: [
                    {
                        key: 'A',
                        text: 'CDN server restart করবেন',
                        isCorrect: false,
                        explanation:
                            'CDN server restart করা সম্ভব নয় এবং তা করলেন সব users affected হবে।',
                    },
                    {
                        key: 'B',
                        text: 'কিছু করতে হবে না, auto update হয়',
                        isCorrect: false,
                        explanation:
                            'TTL expire না হলে CDN পুরানো content serve করতেই থাকবেন।',
                    },
                    {
                        key: 'C',
                        text: 'Cache invalidation করবেন অথবা নতুন filename/version use করবেন',
                        isCorrect: true,
                        explanation:
                            'Cache invalidation approach: CloudFront Invalidation API দিয়ে specific paths purge করুন। অথবা file এ version/hash add করুন (logo.v2.png) — নতুন URL মানে CDN এ নতুন entry।',
                    },
                    {
                        key: 'D',
                        text: 'User কে browser cache clear করতে বলবে',
                        isCorrect: false,
                        explanation:
                            'এটা terrible UX — users এর কাছে এটা expect করা যায় না।',
                    },
                ],
            },
            {
                id: 7,
                text: 'একটা video streaming app এ 4K videos globally fast serve করতে কোন architecture?',
                options: [
                    {
                        key: 'A',
                        text: 'S3 (storage) + CloudFront/CDN (global distribution)',
                        isCorrect: true,
                        explanation:
                            'S3 এ videos store (durable, cheap, unlimited), CloudFront globally cache করে serve করে (low latency)। এটাই Netflix, YouTube এর approach। Database এ binary large objects রাখা terrible idea।',
                    },
                    {
                        key: 'B',
                        text: 'Single server এ সব videos রাখুন',
                        isCorrect: false,
                        explanation:
                            'Single server global users কে fast serve করতে পারবেন না এবং single point of failure।',
                    },
                    {
                        key: 'C',
                        text: 'Database এ video store করুন',
                        isCorrect: false,
                        explanation:
                            'Database এ binary large objects (BLOB) store করা terrible idea — expensive, slow, unscalable।',
                    },
                    {
                        key: 'D',
                        text: 'FTP server use করুন',
                        isCorrect: false,
                        explanation:
                            'FTP server modern scalable video streaming এর জন্য উপযুক্ত নয়।',
                    },
                ],
            },
            {
                id: 8,
                text: 'Cache-Control: private মানে কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Encrypted content',
                        isCorrect: false,
                        explanation:
                            'private cache-control encryption এর সাথে সম্পর্কিত নয়।',
                    },
                    {
                        key: 'B',
                        text: 'শুধু admin access',
                        isCorrect: false,
                        explanation:
                            'Cache-Control access control এর জন্য নয়।',
                    },
                    {
                        key: 'C',
                        text: 'Content delete হবে',
                        isCorrect: false,
                        explanation: 'private মানে content delete নয়।',
                    },
                    {
                        key: 'D',
                        text: 'Browser cache করতে পারবেন কিন্তু CDN/proxy cache করবেন না',
                        isCorrect: true,
                        explanation:
                            'private মানে শুধু end-user এর browser cache করতে পারবেন। CDN বা shared proxy cache করবেন না। User-specific content (dashboard, account info) এর জন্য use করুন।',
                    },
                ],
            },
            {
                id: 9,
                text: 'S3 Lifecycle Policy কেন ব্যবহার করবেন?',
                options: [
                    {
                        key: 'A',
                        text: 'Files encrypt করতে',
                        isCorrect: false,
                        explanation:
                            'Lifecycle Policy encryption এর জন্য নয় — S3 Server-Side Encryption আলাদা feature।',
                    },
                    {
                        key: 'B',
                        text: 'পুরানো files automatically সস্তা storage class এ move করে cost কমাতে',
                        isCorrect: true,
                        explanation:
                            'Lifecycle Policy auto-transition করে: 30 days → Standard-IA, 90 days → Glacier। এতে manual কিছু করতে হয় না এবং storage cost automatically কমে। Old photos, logs, backups এর জন্য excellent।',
                    },
                    {
                        key: 'C',
                        text: 'CDN cache invalidate করতে',
                        isCorrect: false,
                        explanation:
                            'CDN cache invalidation CloudFront Invalidation API দিয়ে করতে হয়, S3 Lifecycle Policy দিয়ে নয়।',
                    },
                    {
                        key: 'D',
                        text: 'Files backup করতে',
                        isCorrect: false,
                        explanation:
                            'Backup এর জন্য S3 Cross-Region Replication বা Versioning ব্যবহার করুন।',
                    },
                ],
            },
            {
                id: 10,
                text: 'Instagram এ user profile photo কোথায় store হয় এবং কীভাবে serve হয়?',
                options: [
                    {
                        key: 'A',
                        text: 'PostgreSQL database এ',
                        isCorrect: false,
                        explanation:
                            'Database এ শুধু photo URL এবং metadata থাকে, actual photo file থাকে না।',
                    },
                    {
                        key: 'B',
                        text: 'Instagram এর নিজস্ব server এ',
                        isCorrect: false,
                        explanation:
                            'Instagram (Facebook) object storage system (Haystack/f4) ব্যবহার করে।',
                    },
                    {
                        key: 'C',
                        text: 'Object Storage (S3-like) এ store, CDN দিয়ে globally serve',
                        isCorrect: true,
                        explanation:
                            'Instagram photos → Facebook এর object storage (Haystack/f4)। CDN globally cache করে serve করে। Database এ শুধু photo URL এবং metadata (user_id, caption, timestamp) থাকে।',
                    },
                    {
                        key: 'D',
                        text: 'Redis cache এ',
                        isCorrect: false,
                        explanation:
                            'Redis in-memory cache — large binary files store এর জন্য উপযুক্ত নয়।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'CDN & S3 Architecture Assignment',
        time: '২-৩ ঘণ্টা',
        difficulty: 'Junior Level',
        tasks: [
            <span key='1'>
                <strong>CDN Strategy Design:</strong> একটা Bangladeshi news
                portal design করুন যেখানে content ঢাকা থেকে publish হয় কিন্তু
                global audience (USA, UK, Middle East) আছে। CDN PoP selection,
                cache TTL, invalidation strategy — সব explain করুন।
            </span>,
            <span key='2'>
                <strong>AWS S3 Explore করুন:</strong> AWS Free Tier account
                বানান। একটা S3 bucket create করুন। একটা image upload করুন। Public
                access দিন। Browser থেকে URL দিয়ে access করুন। Screenshot নাও।
            </span>,
            <span key='3'>
                <strong>Cache-Control Headers:</strong> নিচের resources এর জন্য
                সঠিক Cache-Control header লিখুন: (ক) React app এর CSS bundle
                (hash filename আছে) (খ) News article HTML page (গ) User
                dashboard (private) (ঘ) API response (JSON)।
            </span>,
            <span key='4'>
                <strong>Architecture Diagram:</strong> E-commerce site এর media
                architecture diagram বানান: User product image upload → Resize →
                CDN serve। S3, Lambda, CloudFront সব include করুন।
            </span>,
            <span key='5'>
                <strong>Cost Calculation:</strong> AWS S3 pricing calculator
                ব্যবহার করুন। ১০০ GB storage + ১ TB data transfer per month এ
                monthly cost কত? Standard vs Glacier compare করুন।
            </span>,
        ],
        deliverables: [
            <span key='1'>CDN strategy document for BD news portal</span>,
            <span key='2'>
                S3 bucket screenshot (uploaded image accessible)
            </span>,
            <span key='3'>Cache-Control header answers (৪টা)</span>,
            <span key='4'>E-commerce media architecture diagram</span>,
            <span key='5'>S3 cost comparison (Standard vs Glacier)</span>,
        ],
    },
    practicalLab: {
        title: 'Hands-On Project Task',
        subtitle: 'Image Upload API with S3 + Presigned URLs',
        steps: [
            {
                title: 'AWS Setup',
                description:
                    'S3 bucket create করুন। IAM user create করুন (S3 access only)। Credentials local এ configure করুন।',
            },
            {
                title: 'Presigned URL API',
                description:
                    'POST /api/upload → presigned URL return করবেন। Frontend সরাসরি S3 তে PUT করবেন।',
            },
            {
                title: 'Simple Frontend',
                description:
                    'HTML form: file input → fetch presigned URL → PUT to S3 → show uploaded image URL।',
            },
            {
                title: 'CloudFront Setup (Optional)',
                description:
                    'S3 bucket কে CloudFront origin set করুন। CDN URL দিয়ে same image access করুন।',
            },
            {
                title: 'Direct vs CDN Compare করুন',
                description:
                    'S3 direct URL এবং CloudFront URL — browser Dev Tools Network tab এ response time compare করুন।',
            },
        ],
        tip: 'AWS S3 practically use করবেন। Presigned URL এর power বুঝবেন। CDN এর latency difference নিজে measure করবেন। Portfolio এ "AWS S3 + CloudFront integration" লিখতে পারবেন।',
    },
    phaseComplete: {
        title: 'Phase 2 সম্পন্ন!',
        description:
            'আপনি System Design Mastery Course এর Phase 2 — Core Components সম্পন্ন করেছেনো! ৬টা critical topic master করেছেনো যেগুলো প্রতিটা large-scale system এ use হয়।',
        topics: [
            { title: 'Caching Strategy & Redis', id: 'caching' },
            { title: 'Load Balancing (L4/L7)', id: 'load-balancing' },
            {
                title: 'Message Queues (Kafka, RabbitMQ)',
                id: 'message-queues',
            },
            {
                title: 'API Design (REST, GraphQL, gRPC)',
                id: 'api-design',
            },
            {
                title: 'Database Sharding & Replication',
                id: 'db-sharding',
            },
            { title: 'CDN & Object Storage (S3)', id: 'cdn-storage' },
        ],
        nextPhase: {
            title: 'System Design Patterns',
            topics: [
                'Circuit Breaker',
                'CQRS',
                'Event Sourcing',
                'Saga Pattern',
            ],
        },
    },
};

