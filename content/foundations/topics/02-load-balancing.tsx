/* eslint-disable react/jsx-key */
import {
    ContentImage,
    ContentParagraph,
    SectionTitle,
} from '../../../components/course/content-components';
import {
    CONTENT_TYPES,
    INFO_BOX_VARIANTS,
    TopicData,
} from '../../../types/content';

export const loadBalancingContent: TopicData = {
    id: 'load-balancing',
    sections: [
        {
            id: 'core-concept',
            subHeader: { index: '001', title: 'Core Concept' },
            title: <SectionTitle>Load Balancer কী?</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                ধরুন একটা bank এ ১০টা counter আছে, কিন্তু সবাই
                                একটা counter এ গিয়ে দাঁড়াচ্ছে। বাকি ৯টা
                                counter খালি পড়ে আছে। এটা কি বোকামি না?
                            </ContentParagraph>
                            <ContentParagraph>
                                <strong className='text-foreground'>
                                    Load Balancer
                                </strong>{' '}
                                হলো সেই manager যে দরজায় দাঁড়িয়ে বলে —
                                &quot;আপনি counter 3 এ যান, আপনি counter 7 এ
                                যান।&quot; প্রতিটা counter সমান কাজ পায়, কেউ
                                overwhelmed না।
                            </ContentParagraph>
                            <ContentImage
                                src='/topics/load-balancer/load-balancer-bank.png'
                                alt='Load Balancer'
                            />
                            <ContentParagraph>
                                এপ্লিকেশনের ক্ষেত্রেও সেম ঘটনা ঘটে।
                                <br /> <br />
                                ১. বিশ্বের বিভিন্ন প্রান্ত থেকে বিভিন্ন ইউজাররা
                                অনেক অনেক রিকুয়েস্ট করে, প্রতিটা রিকুয়েস্ট
                                সরাসরি সার্ভারের কাছে যায়না। রিকুয়েস্টগুলো
                                সর্বপ্রথম লোড ব্যালেন্সার এর কাছে যায় ।
                                <br /> <br />
                                ২. লোড ব্যালেন্সার সর্বপ্রথম রিকুয়েস্টগুলো রিসিভ
                                করে এবং সে ডিসিশন নেয় কোন রিকুয়েস্ট কোন সার্ভারে
                                পাঠাবে এবং কোন সার্ভার রিকুয়েস্টা রিসিভ করার
                                জন্য উপযুক্ত। তারপর সে রেকুয়েস্ট গুলোকে যথাযথ
                                সার্ভারের কাছে ফরোয়ার্ড করে। (এই কাজটা লোড
                                ব্যালেন্সার বিভিন্ন ওয়েতে করে থাকে, সেগুলোর
                                ব্যাপারে আমরা পরে জানবো)
                                <br /> <br />
                                ৩. সার্ভার কাজ শেষ করে রেসপন্সটা আবার লোড
                                ব্যালেন্সারের কাছেই ফেরত পাঠায়, এবং লোড
                                ব্যালেন্সার সেটা ইউজারের কাছে পৌঁছে দেয়। ইউজার
                                কখনো জানতে পারে না যে ভেতরে একাধিক সার্ভার কাজ
                                করছে, সে শুধু লোড ব্যালেন্সারকেই চেনে।
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
                            <strong>Load Balancer</strong> হলো এমন একটি
                            component যা incoming network traffic কে multiple
                            servers এর মধ্যে distribute করে। এটা নিশ্চিত করে যে
                            কোনো একটা server অতিরিক্ত load এ overwhelmed না হয়।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'Load Balancer এর Benefits',
                    content: (
                        <ul className='space-y-2'>
                            <li>
                                <strong className='text-emerald-700 dark:text-emerald-400'>
                                    High Availability:
                                </strong>{' '}
                                একটা server down হলেও app চলতে থাকে
                            </li>
                            <li>
                                <strong className='text-emerald-700 dark:text-emerald-400'>
                                    Scalability:
                                </strong>{' '}
                                নতুন server যোগ করে traffic handle করা সহজ
                            </li>
                            <li>
                                <strong className='text-emerald-700 dark:text-emerald-400'>
                                    Performance:
                                </strong>{' '}
                                Load সমান ভাগ হওয়ায় response time কমে
                            </li>
                            <li>
                                <strong className='text-emerald-700 dark:text-emerald-400'>
                                    Zero-downtime deployment:
                                </strong>{' '}
                                একে একে server update করা যায়, app বন্ধ হয় না
                            </li>
                        </ul>
                    ),
                },
            ],
        },
        {
            id: 'how-load-balancer-works',
            subHeader: { index: '002', title: 'How Load Balancer Works' },
            title: <SectionTitle>Load Balancer কীভাবে কাজ করে?</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                আমরা তো জানলাম যে লোড ব্যালেন্সার একটা
                                রিকোয়েস্ট রিসিভ করে সেটাকে
                                &quot;ফরোয়ার্ড&quot; করে দেয় সার্ভারের কাছে।
                                কিন্তু কাজটা কি আসলে এতই সহজ? মোটেও না!
                                <br />
                                <br />
                                ধরুন, &quot;আপনার ১০টা সার্ভার আছে। এখন প্রথম
                                ইউজার আসলে তাকে কোন সার্ভারে পাঠাবেন? প্রথমটায়
                                নাকি শেষটায়?&quot;এই ডিসিশনটাই বা কিভাবে নিবেন?
                                এই ডিসিশন নেওয়ার জন্যই লোড ব্যালেন্সারের কিছু
                                নিয়ম বা অ্যালগরিদম সেট করা থাকে। নিচে এর মধ্যে
                                সবচেয়ে জনপ্রিয় কিছু অ্যালগরিদম নিয়ে আমরা
                                বিস্তারিত জানবো।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    stepName: 'ALGORITHM',
                    steps: [
                        {
                            title: 'Round Robin ',
                            description:
                                'অ্যালগরিদম অনুযায়ী লোড ব্যালেন্সার ক্রমান্বয়ে প্রতিটি সার্ভারে রিকোয়েস্ট পাঠায়। প্রথম রিকোয়েস্ট যাবে সার্ভার ১-এ, দ্বিতীয়টি সার্ভার ২-এ, তৃতীয়টি সার্ভার ৩-এ এবং এভাবে চলতেই থাকবে। সার্ভারের সংখ্যা শেষ হলে আবার প্রথম সার্ভার থেকে শুরু হয়।',
                        },
                        {
                            title: 'Weighted Round Robin',
                            description:
                                'এই পদ্ধতিতে প্রতিটি সার্ভারকে একটি নির্দিষ্ট Weight বা গুরুত্ব অনুযায়ী রিকোয়েস্ট পাঠানো হয়। যে সার্ভারের Weight যত বেশি, সে তত বেশি রিকোয়েস্ট পায়।',
                        },
                        {
                            title: 'Least Connection',
                            description:
                                'যে সার্ভারে বর্তমানে সবচেয়ে কম কানেকশন আছে, লোড ব্যালেন্সার নতুন রিকোয়েস্টটি সেই সার্ভারে পাঠায়। এটি রাউন্ড রবিন থেকে ভালো, কারণ এটি সার্ভারের লোড ব্যালেন্স করে।',
                        },
                        {
                            title: 'Least Response Time',
                            description:
                                'যে সার্ভার সবচেয়ে কম সময়ে উত্তর দেয় (Least Response Time), লোড ব্যালেন্সার নতুন রিকোয়েস্টটি সেই সার্ভারে পাঠায়। এটি সার্ভারগুলোর পারফরম্যান্সের উপর ভিত্তি করে লোড ভাগ করে দেয়।',
                        },
                        {
                            title: 'Least Bandwidth',
                            description:
                                'যে সার্ভারে সবচেয়ে কম bandwidth ব্যবহার হচ্ছে (Least Bandwidth), লোড ব্যালেন্সার নতুন রিকোয়েস্টটি সেই সার্ভারে পাঠায়। এটি সার্ভারগুলোর পারফরম্যান্সের উপর ভিত্তি করে লোড ভাগ করে দেয়।',
                        },
                        {
                            title: 'IP Hash',
                            description:
                                'এই পদ্ধতিতে ইউজার আইপি (IP) অ্যাড্রেসকে Hash করে একটি নির্দিষ্ট সার্ভারে ম্যাপ করা হয়। ফলে, একই আইপি থেকে বারবার আসলে একই সার্ভারে রিকোয়েস্ট যায়, যা সেশন স্টিকিনেস (Session Stickiness) বজায় রাখতে সাহায্য করে।',
                        },
                    ],
                },
            ],
        },
        {
            id: 'round-robin',
            subHeader: { index: '02.1', title: 'Round Robin' },
            title: (
                <SectionTitle className='text-[30px]!'>
                    Round Robin
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>{''}</ContentParagraph>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'weighted-round-robin',
            subHeader: { index: '02.2', title: 'Weighted Round Robin' },
            title: (
                <SectionTitle className='text-[30px]!'>
                    Weighted Round Robin
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>{''}</ContentParagraph>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'least-connection',
            subHeader: { index: '02.3', title: 'Least Connection' },
            title: (
                <SectionTitle className='text-[30px]!'>
                    Least Connection
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>{''}</ContentParagraph>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'least-response-time',
            subHeader: { index: '02.4', title: 'Least Response Time' },
            title: (
                <SectionTitle className='text-[30px]!'>
                    Least Response Time
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>{''}</ContentParagraph>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'least-bandwidth',
            subHeader: { index: '02.5', title: 'Least Bandwidth' },
            title: (
                <SectionTitle className='text-[30px]!'>
                    Least Bandwidth
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>{''}</ContentParagraph>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'ip-hash',
            subHeader: { index: '02.6', title: 'IP Hash' },
            title: (
                <SectionTitle className='text-[30px]!'>
                    IP Hash
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>{''}</ContentParagraph>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'l4-vs-l7',
            subHeader: { index: '002', title: 'L4 vs L7' },
            title: <SectionTitle>L4 vs L7 Load Balancing</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-blue-500' />
                                        LAYER 4{' '}
                                        <span className='text-blue-700 dark:text-blue-400'>
                                            Transport Layer
                                        </span>
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        শুধু IP address + Port দেখে routing করে।
                                        HTTP content দেখে না। অনেক fast কারণ
                                        packet inspect করে না। কিন্তু
                                        content-aware না — URL বা header দেখে
                                        decision নিতে পারে না।
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-emerald-500' />
                                        LAYER 7{' '}
                                        <span className='text-emerald-700 dark:text-emerald-400'>
                                            Application Layer
                                        </span>
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        পুরো HTTP request পড়তে পারে — URL,
                                        headers, cookies, body। Smart routing
                                        করতে পারে। যেমন <code>/api/*</code> →
                                        API servers, <code>/static/*</code> →
                                        CDN।
                                    </p>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Feature', 'Layer 4', 'Layer 7'],
                    rows: [
                        [
                            'OSI Layer',
                            <span className='text-blue-700 dark:text-blue-400'>
                                Transport (L4)
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400'>
                                Application (L7)
                            </span>,
                        ],
                        [
                            'Speed',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                অনেক Fast
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>
                                Slightly Slower
                            </span>,
                        ],
                        [
                            'Content Awareness',
                            <span className='text-red-700 dark:text-red-400'>
                                না — IP+Port only
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                হ্যাঁ — URL, Header, Cookie
                            </span>,
                        ],
                        [
                            'SSL Termination',
                            <span className='text-red-700 dark:text-red-400'>না</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                হ্যাঁ
                            </span>,
                        ],
                        [
                            'Path-based Routing',
                            <span className='text-red-700 dark:text-red-400'>না</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                হ্যাঁ
                            </span>,
                        ],
                        [
                            'Best For',
                            'Ultra-low latency, TCP/UDP',
                            'HTTP apps, Microservices',
                        ],
                        [
                            'Tools',
                            'AWS NLB, HAProxy (TCP mode)',
                            'Nginx, AWS ALB, Traefik',
                        ],
                    ],
                },
            ],
        },
        {
            id: 'algorithms',
            subHeader: { index: '003', title: 'Algorithms' },
            title: <SectionTitle>Load Balancing Algorithms</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-8'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-b border-border bg-card/30'>
                                    <h4 className='font-mono uppercase tracking-[0.3em] text-[10px] text-yellow-700 dark:text-yellow-400 mb-3'>
                                        Round Robin
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        সব server কে sequentially request পাঠাও।
                                        Server 1 → Server 2 → Server 3 → Server
                                        1 → ... Simple এবং equal distribution।
                                        সব server একই capacity হলে ভালো।
                                    </p>
                                </div>
                                <div className='p-8 border-b border-border bg-card/30'>
                                    <h4 className='font-mono uppercase tracking-[0.3em] text-[10px] text-blue-700 dark:text-blue-400 mb-3'>
                                        Weighted Round Robin
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Server এর capacity অনুযায়ী weight
                                        assign করুন। Server A (weight=3) →
                                        Server B (weight=1)। বড় server বেশি
                                        traffic পাবেন। Mixed hardware এ ভালো।
                                    </p>
                                </div>
                                <div className='p-8 border-r border-b border-border bg-card/30'>
                                    <h4 className='font-mono uppercase tracking-[0.3em] text-[10px] text-emerald-700 dark:text-emerald-400 mb-3'>
                                        Least Connections
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        যে server এর active connections সবচেয়ে
                                        কম, তাকে request পাঠাও। Long-lived
                                        connections (WebSocket, database) এর
                                        জন্য সবচেয়ে ভালো। Variable request
                                        duration handle করে।
                                    </p>
                                </div>
                                <div className='p-8 border-b border-border bg-card/30'>
                                    <h4 className='font-mono uppercase tracking-[0.3em] text-[10px] text-purple-700 dark:text-purple-400 mb-3'>
                                        IP Hash
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Client এর IP address hash করে always
                                        same server এ পাঠাও। Session persistence
                                        এর জন্য দরকার। Same user সবসময় same
                                        server এ যাবেন।
                                    </p>
                                </div>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-mono uppercase tracking-[0.3em] text-[10px] text-red-700 dark:text-red-400 mb-3'>
                                        Random
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Randomly একটা server select করুন। Simple
                                        কিন্তু uneven distribution হতে পারে।
                                        Production এ rarely ব্যবহার হয়।
                                    </p>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Algorithm',
                        'কীভাবে কাজ করে',
                        'Best For',
                        'Problem',
                    ],
                    rows: [
                        [
                            <span className='font-bold text-yellow-700 dark:text-yellow-400'>
                                Round Robin
                            </span>,
                            'Sequential rotation',
                            'Equal capacity servers',
                            'Load consider করে না',
                        ],
                        [
                            <span className='font-bold text-blue-700 dark:text-blue-400'>
                                Weighted RR
                            </span>,
                            'Capacity-based weight',
                            'Mixed hardware',
                            'Static weight, dynamic load না',
                        ],
                        [
                            <span className='font-bold text-emerald-700 dark:text-emerald-400'>
                                Least Connections
                            </span>,
                            'Lowest active connections',
                            'Long-lived connections',
                            'Connection count != actual load',
                        ],
                        [
                            <span className='font-bold text-purple-700 dark:text-purple-400'>
                                IP Hash
                            </span>,
                            'IP → same server',
                            'Session persistence',
                            'Uneven distribution possible',
                        ],
                        [
                            <span className='font-bold text-red-700 dark:text-red-400'>
                                Random
                            </span>,
                            'Random selection',
                            'Simple testing',
                            'Production এ unpredictable',
                        ],
                    ],
                },
            ],
        },
        {
            id: 'health-check',
            subHeader: { index: '004', title: 'Health Check' },
            title: <SectionTitle>Health Check ও Failover</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Load Balancer periodically সব servers কে ping করে
                            দেখে তারা alive আছে কিনা। কোনো server respond না
                            করলেন সেটাকে automatically rotation থেকে বাদ দেয়।
                            Server ঠিক হলে আবার যোগ করে নেয়। এটাই{' '}
                            <strong className='text-foreground'>
                                Automatic Failover
                            </strong>
                            ।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: 'Health Check এর ধরন',
                    content: (
                        <ul className='space-y-3'>
                            <li>
                                <strong className='text-yellow-700 dark:text-yellow-400'>
                                    TCP Check:
                                </strong>{' '}
                                শুধু port open আছে কিনা check করে। দ্রুত কিন্তু
                                app actually কাজ করছে কিনা বলে না।
                            </li>
                            <li>
                                <strong className='text-yellow-700 dark:text-yellow-400'>
                                    HTTP Check:
                                </strong>{' '}
                                নির্দিষ্ট URL এ request পাঠিয়ে 200 OK আশা করে।
                                App level check — বেশি reliable।
                            </li>
                            <li>
                                <strong className='text-yellow-700 dark:text-yellow-400'>
                                    Custom Script:
                                </strong>{' '}
                                Database connection, disk space ইত্যাদি check
                                করতে পারে। সাধারণত <code>/health</code> বা{' '}
                                <code>/ping</code> endpoint ব্যবহার করুন।
                            </li>
                        </ul>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'nginx',
                    filename: 'nginx-health-check.conf',
                    code: `upstream backend {
    # Least connections algorithm
    least_conn;

    # Weighted servers — server1 বেশি powerful
    server 192.168.1.10:3000 weight=3;
    server 192.168.1.11:3000 weight=1;
    server 192.168.1.12:3000 weight=1;

    # Health check settings
    # max_fails: এতবার fail হলে server বাদ দিন
    # fail_timeout: এই সময়ের মধ্যে fail হলে count করুন
    server 192.168.1.13:3000 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;

    location / {
        proxy_pass http://backend;
        proxy_connect_timeout 5s;
        proxy_read_timeout 30s;

        # Health check endpoint
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Active health check (Nginx Plus feature)
    # location /health {
    #     health_check interval=5s fails=3 passes=2;
    # }
}`,
                },
            ],
        },
        {
            id: 'tools-comparison',
            subHeader: { index: '005', title: 'Tools' },
            title: <SectionTitle>Popular Load Balancers — তুলনা</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Tool',
                        'Type',
                        'Layer',
                        'Performance',
                        'কখন ব্যবহার',
                    ],
                    rows: [
                        [
                            <span className='font-bold text-emerald-700 dark:text-emerald-400'>
                                Nginx
                            </span>,
                            'Open Source',
                            'L7',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Excellent
                            </span>,
                            'বেশিরভাগ web apps, reverse proxy',
                        ],
                        [
                            <span className='font-bold text-blue-700 dark:text-blue-400'>
                                HAProxy
                            </span>,
                            'Open Source',
                            'L4+L7',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Industry Best
                            </span>,
                            'High performance TCP, financial systems',
                        ],
                        [
                            <span className='font-bold text-yellow-700 dark:text-yellow-400'>
                                AWS ALB
                            </span>,
                            'Managed Cloud',
                            'L7',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Excellent
                            </span>,
                            'AWS microservices, containers',
                        ],
                        [
                            <span className='font-bold text-yellow-700 dark:text-yellow-400'>
                                AWS NLB
                            </span>,
                            'Managed Cloud',
                            'L4',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Ultra Fast
                            </span>,
                            'Ultra-low latency, video streaming',
                        ],
                        [
                            <span className='font-bold text-orange-700 dark:text-orange-400'>
                                Cloudflare LB
                            </span>,
                            'CDN+LB',
                            'L7',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Global
                            </span>,
                            'Global apps, DDoS protection দরকার',
                        ],
                        [
                            <span className='font-bold text-purple-700 dark:text-purple-400'>
                                Traefik
                            </span>,
                            'Open Source',
                            'L7',
                            <span className='text-yellow-700 dark:text-yellow-400'>Good</span>,
                            'Kubernetes, Docker environments',
                        ],
                    ],
                },
            ],
        },
        {
            id: 'code-examples',
            subHeader: { index: '006', title: 'Code Examples' },
            title: (
                <SectionTitle>Load Balancer Code Implementation</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Concept বোঝার জন্য নিজে implement করে দেখা সবচেয়ে
                            ভালো। নিচে Python এবং Node.js এ Load Balancer
                            algorithms দেওয়া হলো।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'load_balancer.py',
                    code: `import itertools
import requests
import threading
import time

class RoundRobinLoadBalancer:
    def __init__(self, servers: list[str]):
        self.servers = servers
        self.healthy_servers = list(servers)
        self._cycle = itertools.cycle(self.healthy_servers)
        self._lock = threading.Lock()

    def get_next_server(self) -> str | None:
        """Round Robin: পরবর্তী healthy server return করুন"""
        with self._lock:
            if not self.healthy_servers:
                return None  # সব server down!
            return next(self._cycle)

    def health_check(self):
        """প্রতি 5 সেকেন্ডে সব server check করুন"""
        while True:
            for server in self.servers:
                try:
                    response = requests.get(f"{server}/health", timeout=2)
                    if response.status_code == 200:
                        if server not in self.healthy_servers:
                            self.healthy_servers.append(server)
                            self._cycle = itertools.cycle(self.healthy_servers)
                            print(f"✅ {server} back online")
                except Exception:
                    if server in self.healthy_servers:
                        self.healthy_servers.remove(server)
                        self._cycle = itertools.cycle(self.healthy_servers)
                        print(f"❌ {server} removed — unhealthy")
            time.sleep(5)

    def forward_request(self, request_data: dict) -> dict:
        """Request কে next available server এ forward করুন"""
        server = self.get_next_server()
        if not server:
            return {"error": "No healthy servers available", "status": 503}
        try:
            response = requests.post(f"{server}/handle", json=request_data, timeout=10)
            return response.json()
        except Exception as e:
            return {"error": str(e), "status": 500}


# Usage
lb = RoundRobinLoadBalancer([
    "http://server1:3000",
    "http://server2:3000",
    "http://server3:3000",
])

# Background এ health check চালাও
health_thread = threading.Thread(target=lb.health_check, daemon=True)
health_thread.start()

# Request handle করুন
result = lb.forward_request({"user_id": 123, "action": "get_profile"})`,
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'leastConnections.js',
                    code: `class LeastConnectionsLB {
    constructor(servers) {
        // প্রতিটা server এর active connection count track করুন
        this.servers = servers.map(server => ({
            url: server,
            connections: 0,
            healthy: true,
        }));
    }

    getServer() {
        // শুধু healthy servers এর মধ্যে least connections ওয়ালাটা নাও
        const healthyServers = this.servers.filter(s => s.healthy);

        if (healthyServers.length === 0) {
            throw new Error('No healthy servers available');
        }

        // Least connections server খুঁজুন
        return healthyServers.reduce((min, server) =>
            server.connections < min.connections ? server : min
        );
    }

    async handleRequest(requestData) {
        const server = this.getServer();

        // Connection শুরু হলে count বাড়াও
        server.connections++;
        console.log(\`Routing to \${server.url} (connections: \${server.connections})\`);

        try {
            const response = await fetch(\`\${server.url}/handle\`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });
            return await response.json();
        } finally {
            // Request শেষ হলে count কমাও (success বা fail উভয় ক্ষেত্রে)
            server.connections--;
        }
    }

    markUnhealthy(serverUrl) {
        const server = this.servers.find(s => s.url === serverUrl);
        if (server) {
            server.healthy = false;
            console.log(\`❌ \${serverUrl} marked as unhealthy\`);
        }
    }

    markHealthy(serverUrl) {
        const server = this.servers.find(s => s.url === serverUrl);
        if (server) {
            server.healthy = true;
            server.connections = 0;
            console.log(\`✅ \${serverUrl} back online\`);
        }
    }
}

// Usage
const lb = new LeastConnectionsLB([
    'http://server1:3000',
    'http://server2:3000',
    'http://server3:3000',
]);

// Multiple concurrent requests — সবচেয়ে কম busy server পাবেন প্রতিটা
Promise.all([
    lb.handleRequest({ userId: 1 }),
    lb.handleRequest({ userId: 2 }),
    lb.handleRequest({ userId: 3 }),
]).then(results => console.log('All done:', results));`,
                },
            ],
        },
        {
            id: 'real-world',
            subHeader: { index: '007', title: 'Real World' },
            title: (
                <SectionTitle>
                    Real World <span className='italic'>Use Cases</span>
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                            <div className='p-8 border-r border-b border-border bg-card/30'>
                                <h4 className='font-mono uppercase tracking-[0.3em] text-[10px] text-emerald-700 dark:text-emerald-400 mb-4'>
                                    🎵 Spotify
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    AWS ALB (L7) ব্যবহার করে microservices
                                    routing এর জন্য। <code>/stream/*</code> →
                                    Streaming service, <code>/search/*</code> →
                                    Search service। Path-based routing দিয়ে
                                    হাজারো microservice manage করে।
                                </p>
                            </div>
                            <div className='p-8 border-b border-border bg-card/30'>
                                <h4 className='font-mono uppercase tracking-[0.3em] text-[10px] text-yellow-700 dark:text-yellow-400 mb-4'>
                                    🛍️ Shopify
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Nginx + HAProxy combination। Black Friday তে
                                    traffic ১০x বাড়ে। HAProxy L4 দিয়ে initial
                                    connection, Nginx L7 দিয়ে content routing।
                                    Weighted Round Robin দিয়ে traffic ভাগ করে।
                                </p>
                            </div>
                            <div className='p-8 border-r border-border bg-card/30'>
                                <h4 className='font-mono uppercase tracking-[0.3em] text-[10px] text-red-700 dark:text-red-400 mb-4'>
                                    🎬 Netflix
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Video streaming এর জন্য AWS NLB (L4) —
                                    ultra-low latency দরকার। API requests এর
                                    জন্য AWS ALB (L7)। দুটো আলাদা use case এর
                                    জন্য দুটো আলাদা Load Balancer।
                                </p>
                            </div>
                            <div className='p-8 bg-card/30'>
                                <h4 className='font-mono uppercase tracking-[0.3em] text-[10px] text-blue-700 dark:text-blue-400 mb-4'>
                                    🏦 Banks
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    IP Hash algorithm ব্যবহার করে session
                                    persistence এর জন্য। একবার login করলেন same
                                    server এ থাকো — session data consistent
                                    থাকে। Security এবং compliance এর জন্য
                                    critical।
                                </p>
                            </div>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'interview-prep',
            subHeader: { index: '008', title: 'Interview Prep' },
            title: <SectionTitle>Interview এ যা জিজ্ঞেস করে</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q1: L4 vs L7 — কখন কোনটা?',
                    content: (
                        <>
                            <strong className='text-emerald-700 dark:text-emerald-400'>
                                L4 ব্যবহার করুন যখন:
                            </strong>{' '}
                            Ultra-low latency দরকার (gaming, video streaming,
                            financial trading)। HTTP content inspect করার দরকার
                            নেই। Non-HTTP protocols (TCP/UDP) handle করতে হবে।
                            <br />
                            <br />
                            <strong className='text-blue-700 dark:text-blue-400'>
                                L7 ব্যবহার করুন যখন:
                            </strong>{' '}
                            Path-based routing দরকার (<code>/api</code> vs{' '}
                            <code>/web</code>)। SSL termination করতে হবে।
                            Microservices architecture। Cookie/header based
                            routing।
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q2: Sticky Session কী এবং কেন problem?',
                    content: (
                        <>
                            <strong>Sticky Session</strong> (বা Session
                            Affinity) মানে একই user কে সবসময় same server এ
                            route করা। IP Hash algorithm এটা করে।
                            <br />
                            <br />
                            <strong className='text-red-700 dark:text-red-400'>
                                সমস্যা হলো:
                            </strong>{' '}
                            (১) Uneven load distribution — একটা server এ সব
                            heavy users গেলে সে overloaded। (২) ঐ server down
                            হলে user এর session হারিয়ে যায়। (৩) Horizontal
                            scaling এর benefit কমে।
                            <br />
                            <br />
                            <strong className='text-emerald-700 dark:text-emerald-400'>
                                Better solution:
                            </strong>{' '}
                            Session data Redis এ রাখুন — যেকোনো server request
                            handle করতে পারবেন।
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q3: Load Balancer নিজে Single Point of Failure না?',
                    content: (
                        <>
                            হ্যাঁ, এটা একটা valid concern। Solution হলো Load
                            Balancer কেও redundant করা।
                            <br />
                            <br />
                            <strong className='text-emerald-700 dark:text-emerald-400'>
                                Active-Active:
                            </strong>{' '}
                            দুটো LB একসাথে কাজ করে, traffic ভাগ করে নেয়। একটা
                            down হলে অন্যটা সব traffic নেয়।
                            <br />
                            <br />
                            <strong className='text-blue-700 dark:text-blue-400'>
                                Active-Passive:
                            </strong>{' '}
                            একটা primary, একটা standby। Primary down হলে
                            automatically failover। AWS ALB/NLB এগুলো
                            automatically managed — আপনাকে চিন্তা করতে হয় না।
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
                <span className='font-bold text-primary'>Load Balancer</span>,
                'Traffic multiple servers এ distribute করে',
            ],
            [
                <span className='font-bold text-primary'>L4 LB</span>,
                'IP+Port দেখে route করে, ultra-fast কিন্তু content-blind',
            ],
            [
                <span className='font-bold text-primary'>L7 LB</span>,
                'HTTP content পড়ে smart routing করে, SSL terminate করে',
            ],
            [
                <span className='font-bold text-primary'>Round Robin</span>,
                'Sequential server rotation — equal capacity এর জন্য',
            ],
            [
                <span className='font-bold text-primary'>
                    Least Connections
                </span>,
                'সবচেয়ে কম busy server কে request দিন',
            ],
            [
                <span className='font-bold text-primary'>IP Hash</span>,
                'Same client IP → Same server (session persistence)',
            ],
            [
                <span className='font-bold text-primary'>Health Check</span>,
                'Unhealthy server automatically বাদ, ঠিক হলে ফিরিয়ে আনে',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'L7 Load Balancer এর সবচেয়ে বড় advantage কোনটি?',
                options: [
                    {
                        key: 'A',
                        text: 'L4 এর চেয়ে অনেক faster',
                        isCorrect: false,
                        explanation:
                            'আসলে L7 slightly slower কারণ এটা HTTP content inspect করে।',
                    },
                    {
                        key: 'B',
                        text: 'শুধু TCP connection handle করতে পারে',
                        isCorrect: false,
                        explanation:
                            'শুধু TCP connection handle করা L4 এর কাজ।',
                    },
                    {
                        key: 'C',
                        text: 'URL, header, cookie দেখে intelligent routing করতে পারে',
                        isCorrect: true,
                        explanation:
                            'L7 পুরো HTTP request inspect করতে পারে তাই path-based routing, cookie-based routing সব সম্ভব।',
                    },
                    {
                        key: 'D',
                        text: 'শুধু একটা server এ সব traffic পাঠায়',
                        isCorrect: false,
                        explanation: 'এটা Load Balancer এর concept এর বিপরীত।',
                    },
                ],
            },
            {
                id: 2,
                text: 'Round Robin algorithm এর সবচেয়ে বড় limitation কী?',
                options: [
                    {
                        key: 'A',
                        text: 'এটা implement করা অনেক কঠিন',
                        isCorrect: false,
                        explanation:
                            'Round Robin সবচেয়ে simple algorithm গুলোর একটি।',
                    },
                    {
                        key: 'B',
                        text: 'Server এর actual load consider করে না',
                        isCorrect: true,
                        explanation:
                            'Round Robin sequentially route করে — একটা server হয়তো ১০টা heavy request handle করছে, অন্যটা ১০টা light request। কিন্তু Round Robin সমান ভাগ করে।',
                    },
                    {
                        key: 'C',
                        text: 'শুধু ২টা server support করে',
                        isCorrect: false,
                        explanation:
                            'Round Robin যেকোনো সংখ্যক server support করে।',
                    },
                    {
                        key: 'D',
                        text: 'Health check করতে পারে না',
                        isCorrect: false,
                        explanation:
                            'Health check algorithm এর সাথে সম্পর্কিত নয়, এটা আলাদা feature।',
                    },
                ],
            },
            {
                id: 3,
                text: 'Session persistence বা sticky session এর জন্য কোন algorithm সবচেয়ে উপযুক্ত?',
                options: [
                    {
                        key: 'A',
                        text: 'IP Hash',
                        isCorrect: true,
                        explanation:
                            'IP Hash client এর IP address hash করে always same server এ route করে — এটাই session persistence নিশ্চিত করে।',
                    },
                    {
                        key: 'B',
                        text: 'Round Robin',
                        isCorrect: false,
                        explanation:
                            'Round Robin প্রতিটা request আলাদা server এ পাঠায়, session persistence হয় না।',
                    },
                    {
                        key: 'C',
                        text: 'Least Connections',
                        isCorrect: false,
                        explanation:
                            'Least Connections load based routing করে, session persistence নয়।',
                    },
                    {
                        key: 'D',
                        text: 'Random',
                        isCorrect: false,
                        explanation:
                            'Random algorithm randomly server select করে — session persistence হয় না।',
                    },
                ],
            },
            {
                id: 4,
                text: 'Least Connections algorithm কোন scenario তে সবচেয়ে ভালো কাজ করে?',
                options: [
                    {
                        key: 'A',
                        text: 'সব request একই সময়ে complete হয়',
                        isCorrect: false,
                        explanation:
                            'সব request same duration হলে Least Connections এবং Round Robin একই ফলাফল দেবে।',
                    },
                    {
                        key: 'B',
                        text: 'Static file serving',
                        isCorrect: false,
                        explanation:
                            'Static file serving এ requests সাধারণত খুব দ্রুত complete হয়।',
                    },
                    {
                        key: 'C',
                        text: 'সব server identical hardware এ',
                        isCorrect: false,
                        explanation:
                            'Identical hardware এ Round Robin ই sufficient।',
                    },
                    {
                        key: 'D',
                        text: 'Variable request duration (কেউ দ্রুত, কেউ ধীর)',
                        isCorrect: true,
                        explanation:
                            'Least Connections তখনই shine করে যখন request duration আলাদা হয় — database queries, file uploads, long polling।',
                    },
                ],
            },
            {
                id: 5,
                text: 'Load Balancer এর Health Check কী করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Server এর CPU usage optimize করে',
                        isCorrect: false,
                        explanation: 'Health check CPU optimize করে না।',
                    },
                    {
                        key: 'B',
                        text: 'Server alive কিনা check করে, unhealthy হলে rotation থেকে বাদ দেয়',
                        isCorrect: true,
                        explanation:
                            'Health check periodically servers কে ping করে। কোনো server respond না করলেন সেটাকে বাদ দেয়, ঠিক হলে আবার যোগ করে।',
                    },
                    {
                        key: 'C',
                        text: 'Server এর code deploy করে',
                        isCorrect: false,
                        explanation: 'Health check deployment করে না।',
                    },
                    {
                        key: 'D',
                        text: 'Traffic encrypt করে',
                        isCorrect: false,
                        explanation:
                            'Encryption SSL/TLS এর কাজ, health check এর নয়।',
                    },
                ],
            },
            {
                id: 6,
                text: 'SSL Termination কোন layer এ হয়?',
                options: [
                    {
                        key: 'A',
                        text: 'Layer 2 (Data Link)',
                        isCorrect: false,
                        explanation: 'Layer 2 MAC address নিয়ে কাজ করে।',
                    },
                    {
                        key: 'B',
                        text: 'Layer 4 (Transport)',
                        isCorrect: false,
                        explanation:
                            'L4 Load Balancer SSL terminate করতে পারে না কারণ এটা HTTP content দেখে না।',
                    },
                    {
                        key: 'C',
                        text: 'Layer 7 (Application)',
                        isCorrect: true,
                        explanation:
                            'L7 Load Balancer SSL terminate করে — client এর সাথে HTTPS, backend servers এর সাথে HTTP। এতে backend servers এর load কমে।',
                    },
                    {
                        key: 'D',
                        text: 'Layer 3 (Network)',
                        isCorrect: false,
                        explanation: 'Layer 3 IP routing নিয়ে কাজ করে।',
                    },
                ],
            },
            {
                id: 7,
                text: 'Load Balancer নিজে Single Point of Failure হওয়া থেকে বাঁচানোর সবচেয়ে ভালো solution কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Active-Active বা Active-Passive redundant LB setup',
                        isCorrect: true,
                        explanation:
                            'Multiple Load Balancer চালালে একটা down হলেও system চলে। Active-Active এ দুটোই কাজ করে, Active-Passive এ একটা standby থাকে।',
                    },
                    {
                        key: 'B',
                        text: 'Load Balancer এর RAM বাড়াও',
                        isCorrect: false,
                        explanation:
                            'RAM বাড়ালে single point of failure সমস্যা সমাধান হয় না।',
                    },
                    {
                        key: 'C',
                        text: 'শুধু একটা server ব্যবহার করুন',
                        isCorrect: false,
                        explanation:
                            'একটা server মানেই single point of failure।',
                    },
                    {
                        key: 'D',
                        text: 'Load Balancer ব্যবহার বন্ধ করুন',
                        isCorrect: false,
                        explanation: 'LB না থাকলে horizontal scaling সম্ভব না।',
                    },
                ],
            },
            {
                id: 8,
                text: 'Ultra-low latency video streaming এর জন্য কোন Load Balancer সবচেয়ে উপযুক্ত?',
                options: [
                    {
                        key: 'A',
                        text: 'Nginx (L7)',
                        isCorrect: false,
                        explanation:
                            'Nginx ভালো কিন্তু ultra-low latency streaming এর জন্য L4 বেশি efficient।',
                    },
                    {
                        key: 'B',
                        text: 'Traefik (L7)',
                        isCorrect: false,
                        explanation:
                            'Traefik L7, containers/Kubernetes এর জন্য ভালো কিন্তু ultra-low latency streaming এর জন্য নয়।',
                    },
                    {
                        key: 'C',
                        text: 'AWS ALB (L7)',
                        isCorrect: false,
                        explanation:
                            'AWS ALB microservices এর জন্য excellent কিন্তু video streaming এ NLB better।',
                    },
                    {
                        key: 'D',
                        text: 'AWS NLB (L4)',
                        isCorrect: true,
                        explanation:
                            'AWS NLB L4 Load Balancer যা ultra-fast। HTTP inspect করে না তাই latency minimum। Netflix এর মতো streaming platform এটা ব্যবহার করে।',
                    },
                ],
            },
            {
                id: 9,
                text: 'Weighted Round Robin এ Server A (weight=3) এবং Server B (weight=1) থাকলে প্রথম 4টা request কীভাবে distribute হবে?',
                options: [
                    {
                        key: 'A',
                        text: 'A=2, B=2 (সমান ভাগ)',
                        isCorrect: false,
                        explanation:
                            'Weighted Round Robin weight অনুযায়ী distribute করে, সমান নয়।',
                    },
                    {
                        key: 'B',
                        text: 'A=3, B=1',
                        isCorrect: true,
                        explanation:
                            'Weight এর ratio 3:1 তাই 4টা request এ A পাবেন 3টা এবং B পাবেন 1টা। A বেশি powerful তাই বেশি load নেয়।',
                    },
                    {
                        key: 'C',
                        text: 'A=4, B=0',
                        isCorrect: false,
                        explanation: 'B এর weight 1 তাই B কিছু request পাবেনই।',
                    },
                    {
                        key: 'D',
                        text: 'A=1, B=3',
                        isCorrect: false,
                        explanation:
                            'A এর weight বেশি তাই A বেশি request পাবেন।',
                    },
                ],
            },
            {
                id: 10,
                text: 'Microservices architecture এ path-based routing (/api/users → User Service, /api/orders → Order Service) কোনটা দিয়ে করা যাবেন?',
                options: [
                    {
                        key: 'A',
                        text: 'L4 Load Balancer',
                        isCorrect: false,
                        explanation:
                            'L4 LB HTTP URL দেখতে পারে না, শুধু IP+Port দেখে।',
                    },
                    {
                        key: 'B',
                        text: 'DNS Round Robin',
                        isCorrect: false,
                        explanation:
                            'DNS Round Robin path-based routing করতে পারে না।',
                    },
                    {
                        key: 'C',
                        text: 'L7 Load Balancer',
                        isCorrect: true,
                        explanation:
                            'L7 LB HTTP request পড়তে পারে তাই URL path দেখে আলাদা service এ route করা সম্ভব। AWS ALB, Nginx এই কাজ করে।',
                    },
                    {
                        key: 'D',
                        text: 'IP Hash algorithm',
                        isCorrect: false,
                        explanation:
                            'IP Hash session persistence এর জন্য, path-based routing এর জন্য নয়।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'Load Balancing Assignment',
        time: '২-৩ ঘণ্টা',
        difficulty: 'Junior Level',
        tasks: [
            <span key='1'>
                <strong>Algorithm Selection:</strong> নিচের ৩টা scenario তে কোন
                Load Balancing algorithm ব্যবহার করবেন এবং কেন: (ক) একটি chat
                application যেখানে WebSocket connections long-lived — প্রতিটা
                connection ঘণ্টার পর ঘণ্টা active থাকে। (খ) একটি e-commerce site
                যেখানে ৩টা server আছে: 32-core, 16-core, 8-core। (গ) একটি
                banking app যেখানে user এর transaction history শুধু নির্দিষ্ট
                server এ আছে।
            </span>,
            <span key='2'>
                <strong>Nginx Config লিখুন:</strong> একটা Nginx configuration
                লিখুন যেখানে: ৩টা backend server (192.168.1.10, .11, .12 সব port
                3000), Least Connections algorithm, Health check — 3 fails এর পর
                বাদ দিন, Weighted — প্রথম server এর weight 2, বাকি দুটো 1।
            </span>,
            <span key='3'>
                <strong>Diagram বানান:</strong> Excalidraw বা draw.io তে একটা
                diagram আঁকুন যেখানে দেখাবে: Users → L7 Load Balancer → [Web
                Server 1, 2, 3] → [Redis Cache] → [Database Primary → Database
                Replica]। Label দিন প্রতিটা component এ।
            </span>,
            <span key='4'>
                <strong>AWS Pricing Research:</strong> AWS console বা calculator
                তে দেখুন AWS ALB এবং NLB এর pricing কীভাবে আলাদা। কোনটা কখন
                cost-effective সেটা ৩-৪ লাইনে লিখুন।
            </span>,
            <span key='5'>
                <strong>Code পড়ো:</strong> উপরের Python RoundRobinLoadBalancer
                code পড়ো এবং explain করুন: (ক) <code>itertools.cycle</code> কী
                করে? (খ) <code>threading.Lock()</code> কেন দরকার? (গ) Server
                down হলে কী হয় এবং কীভাবে handle করা হয়েছে?
            </span>,
        ],
        deliverables: [
            <span key='1'>Algorithm selection এর written justification</span>,
            <span key='2'>Nginx config file</span>,
            <span key='3'>Architecture diagram (screenshot বা file)</span>,
            <span key='4'>AWS pricing comparison summary</span>,
            <span key='5'>Code explanation (নিজের ভাষায়)</span>,
        ],
    },
    practicalLab: {
        title: 'Hands-On Project Task',
        subtitle: 'Docker + Nginx Load Balancer',
        steps: [
            {
                title: 'Node.js server বানান artificial delay দিয়ে',
                description:
                    'server.js এ random delay যোগ করুন (100ms - 2000ms) যাতে Least Connections এর পার্থক্য বোঝা যায়। Response এ server name এবং active connections count দেখাও।',
            },
            {
                title: 'Round Robin config করুন',
                description:
                    'nginx.conf এ upstream block এ শুধু server list দিন (default round robin)। Browser এ বারবার refresh করুন এবং দেখুন কোন server respond করছে।',
            },
            {
                title: 'Least Connections config করুন',
                description:
                    'upstream block এ least_conn; যোগ করুন। একই requests পাঠাও। দেখুন এবার কীভাবে distribution আলাদা — ধীর server কম request পাচ্ছে।',
            },
            {
                title: 'Health check test করুন',
                description:
                    'docker stop দিয়ে একটা server বন্ধ করুন। Nginx log দেখুন — server automatically বাদ গেছে কিনা। তারপর আবার start করুন এবং দেখুন automatically ফিরে আসে কিনা।',
            },
            {
                title: 'Comparison report বানান',
                description:
                    'Round Robin এবং Least Connections — দুটোতে ১০০টা request পাঠিয়ে distribution record করুন। কোন server কতটা request পেলো এবং average response time কত — সেটা compare করুন।',
            },
        ],
        codeBlock: {
            language: 'yaml',
            filename: 'docker-compose.yml',
            code: `version: '3'
services:
  nginx:
    image: nginx:alpine
    ports: ["80:80"]
    volumes: ["./nginx.conf:/etc/nginx/nginx.conf"]
    depends_on: [app1, app2, app3]

  app1:
    build: .
    environment:
      SERVER_NAME: "Server-1"
      MIN_DELAY_MS: "100"
      MAX_DELAY_MS: "500"

  app2:
    build: .
    environment:
      SERVER_NAME: "Server-2"
      MIN_DELAY_MS: "500"
      MAX_DELAY_MS: "1500"

  app3:
    build: .
    environment:
      SERVER_NAME: "Server-3"
      MIN_DELAY_MS: "100"
      MAX_DELAY_MS: "200"`,
        },
        tip: 'Artificial delay দিয়ে দেখবেন Least Connections কতটা smart। Server-2 ধীর তাই সে কম request পাবেন — Round Robin এ সে সমান পেতো। এটাই real world এ Least Connections এর power।',
    },
};






