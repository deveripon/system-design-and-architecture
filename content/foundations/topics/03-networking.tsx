import React from 'react';
/* eslint-disable react/jsx-key */
import {
    DNSLookupDiagram,
    LoadBalancingDiagram,
    OSIModeDiagram,
    TCPHandshakeDiagram,
} from '../../../components/course/topics/networking/diagrams';
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

export const networkingContent: TopicData = {
    id: 'networking',
    sections: [
        {
            id: 'concept',
            subHeader: { index: '001', title: 'Why It Matters' },
            title: (
                <span className='font-heading uppercase'>
                    Networking কেন শিখতে হবে?
                </span>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                আপনি একটা API লিখলে। Production এ গিয়ে হঠাৎ
                                slow হয়ে গেলো। Logs দেখলে কিছু বুঝছো না।
                                Problem কোথায়? — Network layer এ। Networking না
                                জানলেন এই debug করা impossible।
                            </ContentParagraph>
                            <ContentParagraph>
                                System Design interview এ &quot;Design
                                Twitter&quot; বললে — Load balancer কোথায় বসবে?
                                CDN কেন লাগবে? TCP নাকি UDP? HTTP/2 কেন better?
                                — এই সব answer দিতে হবে।{' '}
                                <em>
                                    Networking হলো System Design এর backbone।
                                </em>
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
                            <strong>Networking</strong> হলো computers এর মধ্যে
                            data exchange করার system। আপনি যখন{' '}
                            <code>google.com</code> type করুন — DNS lookup, TCP
                            connection, HTTP request, TLS encryption — সব
                            মিলিয়ে মাত্র ১০০ms এ response আসে। এই পুরো journey
                            টাই networking।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'osi',
            subHeader: { index: '002', title: 'OSI Model' },
            title: (
                <span className='font-heading uppercase'>
                    OSI Model — ৭টি Layer বোঝো
                </span>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                OSI (Open Systems Interconnection) Model হলো
                                networking এর conceptual framework। ৭টি layer এ
                                কাজ ভাগ করা হয়। প্রতিটি layer শুধু নিচের layer
                                এর সাথে কথা বলে।
                            </ContentParagraph>
                            <p className='text-muted-foreground leading-relaxed text-lg italic'>
                                মনে রাখার trick:{' '}
                                <strong>
                                    &quot;Please Do Not Throw Sausage Pizza
                                    Away&quot;
                                </strong>{' '}
                                — Physical, Data Link, Network, Transport,
                                Session, Presentation, Application।
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CUSTOM,
                    component: <OSIModeDiagram />,
                },
                {
                    type: 'info-box',
                    variant: 'tip',
                    title: 'INTERVIEW এ মনে রাখুন',
                    content: (
                        <p>
                            System Design এ সবচেয়ে বেশি Layer 4 (TCP/UDP) এবং
                            Layer 7 (HTTP) নিয়ে কথা হয়। &quot;Layer 7 Load
                            Balancer&quot; মানে HTTP header, URL path দেখে
                            routing করে। &quot;Layer 4 Load Balancer&quot; মানে
                            শুধু IP:Port দেখে route করে।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'tcp-udp',
            subHeader: { index: '003', title: 'Transport Layer' },
            title: (
                <span className='font-heading uppercase'>
                    TCP vs UDP — সবচেয়ে গুরুত্বপূর্ণ পার্থক্য
                </span>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <h3 className='text-xl font-bold mt-8 mb-4'>
                                TCP — 3-Way Handshake দিয়ে Connection
                            </h3>
                            <ContentParagraph>
                                TCP connection শুরু হওয়ার আগে তিনটা step এ
                                handshake করে। তারপর reliable data transfer হয়।
                                প্রতিটি packet এর acknowledgement (ACK) পাঠানো
                                হয়।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CUSTOM,
                    component: <TCPHandshakeDiagram />,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <h3 className='text-xl font-bold mt-12 mb-4'>
                                UDP — Fire and Forget
                            </h3>
                            <ContentParagraph>
                                UDP তে কোনো handshake নেই। Data পাঠিয়ে দিন —
                                পৌঁছালো কিনা দেখুন না। Overhead কম, তাই speed
                                বেশি। Real-time applications এর জন্য perfect।
                            </ContentParagraph>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border mt-8'>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-blue-500' />
                                        USE CASE{' '}
                                        <span className='text-emerald-700 dark:text-emerald-400'>
                                            ✅ TCP use করুন যখন
                                        </span>
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Data integrity critical। File transfer,
                                        Email, Banking, Database, Web pages
                                        (HTTP)। কোনো packet হারানো চলবে না।
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-blue-500' />
                                        USE CASE{' '}
                                        <span className='text-emerald-700 dark:text-emerald-400'>
                                            ✅ UDP use করুন যখন
                                        </span>
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Speed critical, কিছু packet loss
                                        acceptable। Online gaming, Video call,
                                        Live streaming, DNS। Latency সবচেয়ে
                                        গুরুত্বপূর্ণ।
                                    </p>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['বিষয়', 'TCP', 'UDP'],
                    rows: [
                        [
                            'Connection',
                            'Connection-oriented (handshake)',
                            'Connectionless',
                        ],
                        [
                            'Reliability',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-tight'>
                                ✅ Guaranteed delivery
                            </span>,
                            <span className='text-red-700 dark:text-red-400 uppercase tracking-tight'>
                                ❌ Best-effort, no guarantee
                            </span>,
                        ],
                        [
                            'Order',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-tight'>
                                ✅ In-order delivery
                            </span>,
                            <span className='text-red-700 dark:text-red-400 uppercase tracking-tight'>
                                ❌ No ordering
                            </span>,
                        ],
                        [
                            'Speed',
                            <span className='text-yellow-700 dark:text-yellow-400 uppercase tracking-tight'>
                                ⚠️ Slower (overhead বেশি)
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-tight'>
                                ✅ Faster (overhead কম)
                            </span>,
                        ],
                        ['Header size', '20 bytes', '8 bytes'],
                        [
                            'Use case',
                            'HTTP, FTP, Email, SSH, Banking',
                            'DNS, Gaming, Video call, IoT',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'tcp-vs-udp.js',
                    code: `const net = require('net');      // TCP
const dgram = require('dgram');  // UDP

// TCP Server — reliable, connection-oriented
const tcpServer = net.createServer((socket) => {
  socket.on('data', (data) => {
    socket.write(\`Echo: \${data}\`);  // ACK পাঠায়
  });
});
tcpServer.listen(3000);

// UDP Server — fast, connectionless, fire and forget
const udpServer = dgram.createSocket('udp4');
udpServer.on('message', (msg, rinfo) => {
  // No ACK! Just process and move on
  console.log(\`From \${rinfo.address}: \${msg}\`);
});
udpServer.bind(4000);`,
                },
            ],
        },
        {
            id: 'http',
            subHeader: { index: '004', title: 'Application Layer' },
            title: (
                <span className='font-heading uppercase'>
                    HTTP এবং DNS — প্রতিদিনের কাজ
                </span>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <h3 className='text-xl font-bold mt-8 mb-4'>
                                DNS — Internet এর Phone Book
                            </h3>
                            <ContentParagraph>
                                আপনি <code>facebook.com</code> type করুন — কিন্তু
                                computer বোঝে IP address। DNS এই translation
                                করে। DNS lookup সবসময় cache থেকে শুরু হয়।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CUSTOM,
                    component: <DNSLookupDiagram />,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mt-12 mb-4'>
                            HTTP/1.1 vs HTTP/2 vs HTTP/3
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Feature', 'HTTP/1.1', 'HTTP/2', 'HTTP/3'],
                    rows: [
                        ['Year', '1997', '2015', '2022'],
                        [
                            'Multiplexing',
                            <span className='text-red-700 dark:text-red-400 uppercase tracking-tight'>
                                ❌ নেই
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-tight'>
                                ✅ আছে
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-tight'>
                                ✅ আছে
                            </span>,
                        ],
                        ['Transport', 'TCP', 'TCP', 'QUIC (UDP)'],
                        [
                            'Header Compression',
                            <span className='text-red-700 dark:text-red-400 uppercase tracking-tight'>
                                ❌ নেই
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-tight'>
                                ✅ HPACK
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-tight'>
                                ✅ QPACK
                            </span>,
                        ],
                        [
                            'Head-of-Line Blocking',
                            <span className='text-red-700 dark:text-red-400 uppercase tracking-tight'>
                                ❌ আছে
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400 uppercase tracking-tight'>
                                ⚠️ TCP level এ
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-tight'>
                                ✅ সমাধান
                            </span>,
                        ],
                        [
                            'Use',
                            'Legacy',
                            'বেশিরভাগ sites',
                            'Google, Cloudflare',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: 'Head-of-Line Blocking কি?',
                    content: (
                        <p>
                            HTTP/1.1 এ একটি slow request পুরো queue block করে।
                            ৫টা resource লোড হচ্ছে — একটা slow হলে বাকি ৪টা wait
                            করে। HTTP/2 Multiplexing দিয়ে এটা fix করে — সব
                            resource parallel এ আসে একই connection এ।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'lb',
            subHeader: { index: '005', title: 'Load Balancing' },
            title: (
                <span className='font-heading uppercase'>
                    Load Balancing — Traffic কীভাবে ভাগ হয়
                </span>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <p className='text-muted-foreground leading-relaxed mb-10 text-lg'>
                            যখন একটা server handle করতে পারছে না, load balancer
                            multiple servers এ traffic distribute করে। Server
                            healthy আছে কিনা health check দিয়ে monitor করে —
                            down হলে automatically বাদ দেয়।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.CUSTOM,
                    component: <LoadBalancingDiagram />,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mt-12 mb-4'>
                            Load Balancing Algorithms
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Algorithm', 'কীভাবে কাজ করে', 'Best For'],
                    rows: [
                        [
                            'Round Robin',
                            'একে একে প্রতিটি server এ পাঠায় (1→2→3→1→2→3)',
                            'Stateless apps, equal servers',
                        ],
                        [
                            'Least Connections',
                            'সবচেয়ে কম active connection আছে সেখানে পাঠায়',
                            'Variable request duration',
                        ],
                        [
                            'IP Hash',
                            'Client IP hash করে same server এ পাঠায়',
                            'Session persistence দরকার',
                        ],
                        [
                            'Weighted RR',
                            'Powerful server বেশি traffic পায় (weight অনুযায়ী)',
                            'Heterogeneous servers',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'nginx',
                    filename: 'nginx-lb.conf',
                    code: `# Layer 7 Load Balancer — URL দেখে intelligent routing
upstream api_backend {
    least_conn;  # Algorithm: least connections
    server 192.168.1.10:3000 weight=3;  # বেশি powerful server
    server 192.168.1.11:3000 weight=2;
    server 192.168.1.12:3000 weight=1;
}

server {
    listen 80;
    # API requests → backend
    location /api/ {
        proxy_pass http://api_backend;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_connect_timeout 5s;
    }
    # Static files → CDN / local cache
    location /static/ {
        root /var/www/static;
        expires 30d;
    }
}`,
                },
            ],
        },
        {
            id: 'realworld',
            subHeader: { index: '006', title: 'Real World Examples' },
            title: (
                <span className='font-heading uppercase'>
                    বড় কোম্পানিগুলো কীভাবে করেছেনে
                </span>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                            <div className='space-y-4'>
                                <h3 className='text-lg font-bold flex items-center gap-2'>
                                    📺 Netflix — UDP দিয়ে Streaming
                                </h3>
                                <p className='text-muted-foreground leading-relaxed italic'>
                                    Netflix শুরুতে TCP দিয়ে streaming করতো।
                                    Problem ছিল TCP এর head-of-line blocking —
                                    একটা packet miss হলে video stutter করতো।
                                    তারা HTTP/3 (QUIC) তে migrate করে যা
                                    UDP-based। QUIC এ individual stream গুলো
                                    independent — একটা packet miss হলে শুধু সেই
                                    stream affected, বাকিগুলো চলে। Result:
                                    buffering উল্লেখযোগ্যভাবে কমে।
                                </p>
                            </div>
                            <div className='space-y-4'>
                                <h3 className='text-lg font-bold flex items-center gap-2'>
                                    🎮 PUBG / Online Gaming — UDP এর ব্যবহার
                                </h3>
                                <p className='text-muted-foreground leading-relaxed italic'>
                                    Game position updates UDP তে পাঠায় — প্রতি
                                    60ms এ। কিছু packet miss হলেও problem নেই,
                                    পরের frame এ নতুন position আসবেন। কিন্তু
                                    in-game purchase TCP তে — এখানে reliability
                                    দরকার।{' '}
                                    <strong>
                                        এটাই হলো real-world mixed protocol
                                        approach।
                                    </strong>
                                </p>
                            </div>
                        </div>
                    ),
                },
                {
                    type: 'info-box',
                    variant: 'tip',
                    title: 'CDN — Content Delivery Network',
                    content: (
                        <p>
                            CDN globally distributed servers এ content cache
                            করে। Bangladesh এর user Singapore CDN থেকে content
                            পায় — ৩০০ms এর বদলে ৩০ms latency। Static assets
                            (images, CSS, JS, videos) CDN এ দিলে app ১০x faster
                            মনে হয়। Cloudflare, AWS CloudFront, Akamai popular
                            CDN।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'websocket-chat.js',
                    code: `const WebSocket = require('ws');
const http = require('http');

// WebSocket — HTTP upgrade করে persistent bidirectional connection
// REST API তে server প্রথমে push করতে পারে না — WebSocket পারে!
const server = http.createServer();
const wss = new WebSocket.Server({ server });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.on('message', (msg) => {
    // Server push করছে — সব connected clients এ broadcast
    clients.forEach((c) => {
      if (c.readyState === WebSocket.OPEN) c.send(\`\${msg}\`);
    });
  });
  ws.on('close', () => clients.delete(ws));
});
server.listen(3000);
// Use: Chat apps, Live feeds, Notifications, Collaborative tools`,
                },
            ],
        },
        {
            id: 'tools',
            subHeader: { index: '007', title: 'Tools Comparison' },
            title: (
                <span className='font-heading uppercase'>
                    Networking Tools — কোনটা কখন ব্যবহার করবেন
                </span>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Tool',
                        'Type',
                        'Best For',
                        'Protocol',
                        'কে ব্যবহার করে',
                    ],
                    rows: [
                        [
                            'Nginx',
                            'Reverse Proxy / LB',
                            'HTTP traffic, static files',
                            'HTTP/1.1, HTTP/2',
                            'Instagram, Dropbox',
                        ],
                        [
                            'HAProxy',
                            'Load Balancer',
                            'High-perf TCP/HTTP LB',
                            'TCP, HTTP',
                            'GitHub, Reddit',
                        ],
                        [
                            'AWS ALB',
                            'App Load Balancer',
                            'AWS, microservices',
                            'HTTP/2, WebSocket',
                            'Netflix, Airbnb',
                        ],
                        [
                            'Cloudflare',
                            'CDN + DNS + DDoS',
                            'Global distribution',
                            'HTTP/3, QUIC',
                            'Discord, Canva',
                        ],
                        [
                            'WebSocket',
                            'Protocol',
                            'Real-time bidirectional',
                            'TCP upgrade',
                            'Slack, WhatsApp Web',
                        ],
                        [
                            'gRPC',
                            'RPC Framework',
                            'Microservice communication',
                            'HTTP/2',
                            'Google, Netflix',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '🎯 Interview এ এটা বলুন',
                    content: (
                        <p>
                            &quot;Real-time features এর জন্য WebSocket use করবো।
                            Static assets CDN এ রাখবো। Load balancing এর জন্য
                            Layer 7 (Nginx/ALB) ব্যবহার করবো যাতে URL-based
                            routing করতে পারি। Microservices communication এ
                            gRPC কারণ HTTP/2 এ binary protocol faster।&quot; —
                            এই কথাগুলো interviewer কে impress করে।
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
                'OSI Model',
                '৭ layer — Physical থেকে Application, প্রতিটির আলাদা role',
            ],
            [
                'TCP',
                'Reliable, connection-oriented — HTTP, banking, file transfer',
            ],
            ['UDP', 'Fast, no guarantee — gaming, video call, DNS'],
            ['DNS', 'Domain → IP translation, cache hierarchy দিয়ে fast'],
            [
                'HTTP/2',
                'Multiplexing — একই connection এ multiple parallel requests',
            ],
            ['Load Balancer L4', 'IP:Port দেখে route — fast, simple'],
            [
                'Load Balancer L7',
                'URL/Header দেখে route — intelligent, flexible',
            ],
            ['WebSocket', 'Persistent bidirectional — server push করতে পারে'],
            ['CDN', 'User এর কাছে content cache = অনেক কম latency'],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'TCP এর 3-way handshake এর সঠিক sequence কোনটি?',
                options: [
                    {
                        key: 'A',
                        text: 'ACK → SYN → SYN-ACK',
                        isCorrect: false,
                        explanation: 'ভুল sequence',
                    },
                    {
                        key: 'B',
                        text: 'SYN → SYN-ACK → ACK',
                        isCorrect: true,
                        explanation:
                            'Client প্রথমে SYN পাঠায়, Server SYN-ACK দিয়ে respond করে, তারপর Client ACK পাঠিয়ে confirm করে।',
                    },
                    {
                        key: 'C',
                        text: 'SYN → ACK → SYN-ACK',
                        isCorrect: false,
                        explanation: 'ভুল sequence',
                    },
                    {
                        key: 'D',
                        text: 'CONNECT → ACCEPT → CONFIRM',
                        isCorrect: false,
                        explanation: 'ভুল sequence',
                    },
                ],
            },
            {
                id: 2,
                text: 'Online gaming এর জন্য কোন protocol বেশি উপযুক্ত?',
                options: [
                    {
                        key: 'A',
                        text: 'TCP — কারণ reliable delivery দরকার',
                        isCorrect: false,
                        explanation:
                            'Gaming এ latency reliability এর চেয়ে গুরুত্বপূর্ণ।',
                    },
                    {
                        key: 'B',
                        text: 'HTTP/2 — কারণ multiplexing আছে',
                        isCorrect: false,
                        explanation: 'HTTP level এ gaming suitable না।',
                    },
                    {
                        key: 'C',
                        text: 'UDP — low latency দরকার, কিছু packet loss acceptable',
                        isCorrect: true,
                        explanation:
                            'Gaming এ পুরোনো data useless, তাই packet loss সহনীয় কিন্তু lag অসহনীয়।',
                    },
                    {
                        key: 'D',
                        text: 'WebSocket — bidirectional বলে',
                        isCorrect: false,
                        explanation:
                            'WebSocket TCP এর উপর built, latency থাকতে পারে।',
                    },
                ],
            },
            {
                id: 3,
                text: 'DNS resolution এর সঠিক order কোনটি?',
                options: [
                    {
                        key: 'A',
                        text: 'Root NS → TLD NS → Browser Cache',
                        isCorrect: false,
                        explanation: 'ভুল order',
                    },
                    {
                        key: 'B',
                        text: 'Authoritative NS → Root NS → Browser',
                        isCorrect: false,
                        explanation: 'ভুল order',
                    },
                    {
                        key: 'C',
                        text: 'ISP DNS → Root NS → OS Cache',
                        isCorrect: false,
                        explanation: 'ভুল order',
                    },
                    {
                        key: 'D',
                        text: 'Browser Cache → OS Cache → Recursive Resolver → Root NS → TLD NS → Authoritative NS',
                        isCorrect: true,
                        explanation:
                            'DNS resolution সবসময় local cache থেকে শুরু হয়ে root পর্যন্ত যায়।',
                    },
                ],
            },
            {
                id: 4,
                text: 'HTTP/2 এর সবচেয়ে বড় advantage কোনটি?',
                options: [
                    {
                        key: 'A',
                        text: 'UDP transport ব্যবহার করে',
                        isCorrect: false,
                        explanation:
                            'HTTP/3 UDP ব্যবহার করে, HTTP/2 TCP ই থাকে।',
                    },
                    {
                        key: 'B',
                        text: 'Multiplexing — একই connection এ multiple parallel requests পাঠানো যায়',
                        isCorrect: true,
                        explanation:
                            'এটাই HTTP/2 এর মূল বৈশিষ্ট্য যা page load fast করে।',
                    },
                    {
                        key: 'C',
                        text: 'Built-in end-to-end encryption',
                        isCorrect: false,
                        explanation: 'TLS আলাদা layer এ থাকে।',
                    },
                    {
                        key: 'D',
                        text: 'Server-side sessions maintain করে',
                        isCorrect: false,
                        explanation: 'HTTP stateless.',
                    },
                ],
            },
            {
                id: 5,
                text: 'Layer 7 Load Balancer কি দেখে traffic route করে?',
                options: [
                    {
                        key: 'A',
                        text: 'HTTP headers, URL path, cookies — application content',
                        isCorrect: true,
                        explanation:
                            'L7 Application layer এ কাজ করে বলে content বুঝতে পারে।',
                    },
                    {
                        key: 'B',
                        text: 'শুধু IP address এবং Port number',
                        isCorrect: false,
                        explanation: 'এটা L4 Load Balancer এর কাজ।',
                    },
                    {
                        key: 'C',
                        text: 'MAC address',
                        isCorrect: false,
                        explanation: 'এটা Layer 2 এর কাজ।',
                    },
                    {
                        key: 'D',
                        text: 'DNS records',
                        isCorrect: false,
                        explanation: 'Load balancer DNS record দেখে না।',
                    },
                ],
            },
            {
                id: 6,
                text: 'HTTPS এর default port number কত?',
                options: [
                    {
                        key: 'A',
                        text: '80',
                        isCorrect: false,
                        explanation: '80 হলো HTTP এর port.',
                    },
                    {
                        key: 'B',
                        text: '8080',
                        isCorrect: false,
                        explanation: '8080 common dev port.',
                    },
                    {
                        key: 'C',
                        text: '443',
                        isCorrect: true,
                        explanation: 'HTTPS port 443 ব্যবহার করে।',
                    },
                    {
                        key: 'D',
                        text: '22',
                        isCorrect: false,
                        explanation: '22 হলো SSH port.',
                    },
                ],
            },
            {
                id: 7,
                text: 'CDN এর primary purpose কি?',
                options: [
                    {
                        key: 'A',
                        text: 'Database queries speed up করা',
                        isCorrect: false,
                        explanation: 'Database scaling আলাদা topic.',
                    },
                    {
                        key: 'B',
                        text: 'User এর কাছের server থেকে content serve করে latency কমানো',
                        isCorrect: true,
                        explanation: 'Global distribution ই CDN এর মূল কাজ।',
                    },
                    {
                        key: 'C',
                        text: 'Server-side rendering করা',
                        isCorrect: false,
                        explanation: 'এটা Application server এর কাজ।',
                    },
                    {
                        key: 'D',
                        text: 'User authentication handle করা',
                        isCorrect: false,
                        explanation: 'এটা Auth service এর কাজ।',
                    },
                ],
            },
            {
                id: 8,
                text: 'WebSocket HTTP থেকে মূলত কীভাবে আলাদা?',
                options: [
                    {
                        key: 'A',
                        text: 'WebSocket UDP ব্যবহার করে',
                        isCorrect: false,
                        explanation: 'WebSocket TCP ব্যবহার করে।',
                    },
                    {
                        key: 'B',
                        text: 'WebSocket এ encryption নেই',
                        isCorrect: false,
                        explanation: 'WSS encrypted.',
                    },
                    {
                        key: 'C',
                        text: 'WebSocket শুধু server থেকে client এ যায়',
                        isCorrect: false,
                        explanation: 'এটা bidirectional.',
                    },
                    {
                        key: 'D',
                        text: 'WebSocket persistent bidirectional — server যেকোনো সময় push করতে পারে',
                        isCorrect: true,
                        explanation:
                            'Full-duplex communication ই এর স্পেশালিটি।',
                    },
                ],
            },
            {
                id: 9,
                text: 'Reverse Proxy কি করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Client এর সামনে backend servers hide করে, SSL termination ও load balancing করে',
                        isCorrect: true,
                        explanation:
                            'Backend কে protect করা এবং load distribute করা এর কাজ।',
                    },
                    {
                        key: 'B',
                        text: 'Client এর identity hide করে (VPN এর মতো)',
                        isCorrect: false,
                        explanation: 'এটা Forward Proxy এর কাজ।',
                    },
                    {
                        key: 'C',
                        text: 'শুধু DNS queries handle করে',
                        isCorrect: false,
                        explanation: 'এটা Nameserver এর কাজ।',
                    },
                    {
                        key: 'D',
                        text: 'Database connection pool manage করে',
                        isCorrect: false,
                        explanation: 'এটা DB driver এর কাজ।',
                    },
                ],
            },
            {
                id: 10,
                text: 'HTTP/3 কোন transport protocol ব্যবহার করে এবং কেন?',
                options: [
                    {
                        key: 'A',
                        text: 'TCP — backward compatible বলে',
                        isCorrect: false,
                        explanation: 'ভুল',
                    },
                    {
                        key: 'B',
                        text: 'TCP + TLS — security বলে',
                        isCorrect: false,
                        explanation: 'ভুল',
                    },
                    {
                        key: 'C',
                        text: 'QUIC (UDP-based) — TCP এর head-of-line blocking solve করতে',
                        isCorrect: true,
                        explanation:
                            'UDP এর উপর built QUIC protocol ই HTTP/3 এর ভিত্তি।',
                    },
                    {
                        key: 'D',
                        text: 'Raw UDP — সবচেয়ে fast বলে',
                        isCorrect: false,
                        explanation:
                            'Raw UDP unreliable, QUIC reliability add করে।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'Networking Analysis & Practice',
        time: '২-৩ ঘণ্টা',
        difficulty: 'Junior Level',
        tasks: [
            <span key='1'>
                <strong>HTTP Headers Analysis:</strong> Browser DevTools (F12 →
                Network tab) খোলো। আপনার পছন্দের ৩টা website visit করুন। প্রতিটির
                জন্য note করুন — HTTP version কত? Server header কি? Cache-Control
                কি বলছে? কোনো WebSocket connection আছে? Screenshot সহ report
                লিখুন।
            </span>,
            <span key='2'>
                <strong>DNS Lookup Practice:</strong> Terminal এ{' '}
                <code>nslookup google.com</code> এবং{' '}
                <code>dig google.com +trace</code> command run করুন। Output
                বিশ্লেষণ করুন — কোন nameserver use হলো? A record, CNAME record
                চেনো। TTL value কত? ৩টা আলাদা domain এ চেষ্টা করুন।
            </span>,
            <span key='3'>
                <strong>Protocol Scenario Design:</strong> একটা live cricket
                score app design করুন। লিখুন — score update real-time পাঠাতে
                WebSocket নাকি HTTP polling? Player statistics API এ TCP নাকি
                UDP? Video highlights CDN থেকে নাকি origin? প্রতিটি decision
                justify করুন।
            </span>,
            <span key='4'>
                <strong>TCP vs UDP Decision Table:</strong> নিচের ৫টি use case
                এর জন্য TCP বা UDP choose করুন এবং কারণ লিখুন: (ক) Gmail পাঠানো
                (খ) YouTube Live stream দেখা (গ) bKash mobile banking (ঘ) Online
                PUBG game (ঙ) ৫GB file download।
            </span>,
            <span key='5'>
                <strong>Latency Measurement:</strong> Terminal এ{' '}
                <code>
                    curl -w &quot;\nConnect: %{'{time_connect}'}s\nTTFB: %
                    {'{time_starttransfer}'}s\nTotal: %{'{time_total}'}s\n&quot;
                    -o /dev/null -s https://google.com
                </code>{' '}
                run করুন। ৫টা আলাদা site measure করুন এবং CDN আছে কিনা অনুমান করুন।
            </span>,
        ],
        deliverables: [
            <span key='1'>DevTools screenshot সহ HTTP headers analysis</span>,
            <span key='2'>DNS lookup output এর বাংলায় ব্যাখ্যা</span>,
            <span key='3'>Cricket app networking design (diagram সহ)</span>,
            <span key='4'>TCP vs UDP decision table with justification</span>,
            <span key='5'>Latency benchmark result comparison</span>,
        ],
    },
    practicalLab: {
        title: 'Hands-On Project Task',
        subtitle: 'Real-time Chat with WebSocket + Nginx LB',
        steps: [
            {
                title: 'Node.js WebSocket Server — দুটো instance',
                description:
                    'ws library দিয়ে port 3001 এবং 3002 তে দুটো server বানান। Message এলে সব connected clients এ broadcast করবেন।',
            },
            {
                title: 'Nginx IP Hash — WebSocket Sticky Session',
                description:
                    'WebSocket এ sticky session দরকার। ip_hash algorithm configure করুন — একই client সবসময় একই server এ যাবেন।',
            },
            {
                title: 'HTML Client বানান',
                description:
                    'Browser এ WebSocket connect করবেন। Chat input এবং message display। কোন server handle করছে সেটা দেখাও।',
            },
            {
                title: 'Docker Compose দিয়ে Run করুন',
                description:
                    '২টা Node.js service + ১টা Nginx service। docker-compose up দিলেই সব চলবে।',
            },
            {
                title: 'DevTools এ WebSocket দেখুন',
                description:
                    'F12 → Network → WS filter। WebSocket frames দেখুন। HTTP Upgrade header observe করুন।',
            },
            {
                title: 'Bonus — একটা server kill করুন',
                description:
                    'docker stop দিয়ে একটা server বন্ধ করুন। IP Hash এর কারণে কি ঘটে? Reconnect কি হয়?',
            },
        ],
        codeBlock: {
            language: 'javascript',
            filename: 'ws-server.js',
            code: `const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 3001;
const NAME = process.env.SERVER_NAME || 'Server-1';

const server = http.createServer();
const wss = new WebSocket.Server({ server });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  // Server কোনটা handle করছে সেটা client কে জানাও
  ws.send(JSON.stringify({ type: 'info', server: NAME }));

  ws.on('message', (msg) => {
    // সব clients এ broadcast করুন
    clients.forEach((c) => {
      if (c.readyState === WebSocket.OPEN)
        c.send(JSON.stringify({ type: 'msg', text: \`\${msg}\`, from: NAME }));
    });
  });
  ws.on('close', () => clients.delete(ws));
});

server.listen(PORT, () => console.log(\`\${NAME} on :\${PORT}\`));`,
        },
        tip: (
            <>
                DevTools এ WebSocket connection দেখবেন কীভাবে HTTP থেকে upgrade
                হয়। IP Hash কেন WebSocket এ দরকার সেটা practically বুঝবেন। একটা
                server kill করলেন কী ঘটে — এটাই real production challenge।
            </>
        ),
    },
};

