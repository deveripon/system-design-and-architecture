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

export const messageQueuesContent: TopicData = {
    id: 'message-queues',
    sections: [
        {
            id: 'core-concept',
            subHeader: { index: '001', title: 'Core Concept' },
            title: (
                <SectionTitle>Message Queue কী?</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                ধরুন আপনি Swiggy তে খাবার order দিলে। তৎক্ষণাৎ
                                screen এ আসে &quot;Order Confirmed!&quot; — আপনি
                                phone রেখে দিলে। কিন্তু পেছনে কী হচ্ছে? Restaurant
                                কে notification গেলো, delivery partner assign হলো,
                                payment process হলো, invoice তৈরি হলো। এই সব কাজ
                                আপনার জন্য wait করছে না।
                            </ContentParagraph>
                            <ContentParagraph>
                                এটাই{' '}
                                <strong className='text-foreground'>
                                    Async Messaging
                                </strong>
                                । Sync মানে — আপনি কাজ দিলে, সে শেষ করলেন, তারপর
                                next step। Async মানে — আপনি কাজ দিলে, সে নিজের
                                সময়ে করবেন, আপনি এগিয়ে যান।
                            </ContentParagraph>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-red-500' />
                                        SYNC{' '}
                                        <span className='text-red-700 dark:text-red-400'>
                                            ❌ ব্লকিং
                                        </span>
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Order দিন → Email পাঠাও (wait) → SMS পাঠাও
                                        (wait) → Inventory update (wait) → Response।
                                        সব শেষ না হওয়া পর্যন্ত user আটকে।
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-emerald-500' />
                                        ASYNC{' '}
                                        <span className='text-emerald-700 dark:text-emerald-400'>
                                            ✅ নন-ব্লকিং
                                        </span>
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Order দিন → Queue তে message রাখুন →
                                        &quot;Order Confirmed!&quot; return। Background
                                        এ Email, SMS, Inventory সব parallel হয়।
                                    </p>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'DEFINITION — Message Queue কী?',
                    content: (
                        <ul className='space-y-2 text-sm leading-relaxed'>
                            <li>
                                <strong>Message Queue</strong> হলো একটা middleware
                                — দুটো service এর মাঝখানে buffer হিসেবে কাজ করে।
                            </li>
                            <li>
                                <strong>Producer</strong> — message পাঠায় (যে কাজ
                                দেয়)।
                            </li>
                            <li>
                                <strong>Queue</strong> — message গুলো সংরক্ষণ করে
                                (buffer/storage)।
                            </li>
                            <li>
                                <strong>Consumer</strong> — queue থেকে message নেয়
                                এবং নিজের গতিতে process করে।
                            </li>
                            <li>
                                <strong>Decoupled</strong> — Producer আর Consumer
                                একে অপরকে চেনে না, সরাসরি কথা বলে না।
                            </li>
                        </ul>
                    ),
                },
            ],
        },
        {
            id: 'why-async',
            subHeader: { index: '002', title: 'Why Async?' },
            title: (
                <SectionTitle>
                    কেন Async Messaging দরকার?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                            <div className='p-8 border-r border-b border-border bg-card/30'>
                                <h4 className='font-mono uppercase tracking-widest text-[10px] text-blue-700 dark:text-blue-400 font-bold mb-3'>
                                    1. DECOUPLING
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Service B down হলেও Service A চলতে পারে।
                                    Message queue তে জমা থাকবেন, B উঠলে process
                                    করবেন। Services একে অপরের উপর directly
                                    depend করে না।
                                </p>
                            </div>
                            <div className='p-8 border-b border-border bg-card/30'>
                                <h4 className='font-mono uppercase tracking-widest text-[10px] text-blue-700 dark:text-blue-400 font-bold mb-3'>
                                    2. TRAFFIC SPIKE BUFFER
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    হঠাৎ ১০,০০০ order আসলে queue buffer হিসেবে
                                    কাজ করে। Consumer নিজের গতিতে process করে।
                                    System overload হয় না।
                                </p>
                            </div>
                            <div className='p-8 border-r border-border bg-card/30'>
                                <h4 className='font-mono uppercase tracking-widest text-[10px] text-blue-700 dark:text-blue-400 font-bold mb-3'>
                                    3. RETRY LOGIC
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Consumer fail করলেন message queue তে থাকে।
                                    Retry করা যায় — data loss নেই। Email service
                                    crash হলেও email টা পরে পাঠানো সম্ভব।
                                </p>
                            </div>
                            <div className='p-8 bg-card/30'>
                                <h4 className='font-mono uppercase tracking-widest text-[10px] text-blue-700 dark:text-blue-400 font-bold mb-3'>
                                    4. MICROSERVICES
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Microservices architecture এ services
                                    loosely coupled থাকে। Queue হলো তাদের
                                    communication bridge — directly call না করে
                                    message দিয়ে কথা বলে।
                                </p>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: 'Real Example — E-Commerce Order Flow',
                    content: (
                        <div className='space-y-3 text-sm leading-relaxed'>
                            <p>
                                User checkout করলো → Payment Service payment
                                নিলো → Queue তে{' '}
                                <code className='bg-muted px-1.5 py-0.5 rounded text-xs font-mono'>
                                    order_placed
                                </code>{' '}
                                event publish করলো।
                            </p>
                            <p>
                                Queue থেকে <strong>parallel এ</strong> চারটা
                                service কাজ শুরু করলো:
                            </p>
                            <ul className='space-y-1 ml-4'>
                                <li>
                                    📧 <strong>Email Service</strong> —
                                    confirmation email পাঠালো
                                </li>
                                <li>
                                    📱 <strong>SMS Service</strong> — OTP/update
                                    পাঠালো
                                </li>
                                <li>
                                    📦 <strong>Inventory Service</strong> —
                                    stock কমালো
                                </li>
                                <li>
                                    📊 <strong>Analytics Service</strong> —
                                    event log করলো
                                </li>
                            </ul>
                            <p className='text-muted-foreground'>
                                User কে শুধু Payment Service এর response দরকার।
                                বাকি সব async — user দেখে না, জানে না, অপেক্ষা
                                করে না।
                            </p>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'mq-patterns',
            subHeader: { index: '003', title: 'MQ Patterns' },
            title: (
                <SectionTitle>Message Queue Patterns</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-12'>
                            <div>
                                <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-6'>
                                    Pattern 1 — Point-to-Point (Queue Model)
                                </h3>
                                <p className='text-muted-foreground leading-relaxed mb-6 text-lg'>
                                    একটা message শুধু <strong>একজন</strong>{' '}
                                    consumer পায়। Task queue এর মতো — কেউ একজন
                                    কাজটা নিয়ে করে।
                                </p>
                                <div className='border border-border bg-card/20 p-6 font-mono text-sm'>
                                    <div className='space-y-2 text-muted-foreground'>
                                        <div className='flex items-center gap-3'>
                                            <span className='text-blue-700 dark:text-blue-400 font-bold'>
                                                Producer
                                            </span>
                                            <span className='text-border'>
                                                ─────────►
                                            </span>
                                            <span className='border border-yellow-500/50 px-3 py-1 text-yellow-700 dark:text-yellow-400'>
                                                Queue
                                            </span>
                                            <span className='text-border'>
                                                ─────────►
                                            </span>
                                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                                Consumer A
                                            </span>
                                            <span className='text-muted-foreground text-xs italic'>
                                                (শুধু একজন পাবেন)
                                            </span>
                                        </div>
                                        <div className='ml-[calc(theme(spacing.6)+theme(spacing.3)+80px+theme(spacing.3)+20px)] text-xs text-muted-foreground/60'>
                                            Consumer B, C — পাবেন না
                                        </div>
                                    </div>
                                    <p className='mt-4 text-xs text-muted-foreground/70'>
                                        উদাহরণ: Image resize task queue — ১টা
                                        worker একটা image নেয়, process করে, next।
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-6'>
                                    Pattern 2 — Publish-Subscribe (Topic / Fan-out)
                                </h3>
                                <p className='text-muted-foreground leading-relaxed mb-6 text-lg'>
                                    একটা message <strong>সব subscribers</strong>{' '}
                                    পায়। এটা broadcast — একজন বলে, সবাই শোনে।
                                </p>
                                <div className='border border-border bg-card/20 p-6 font-mono text-sm'>
                                    <div className='space-y-3 text-muted-foreground'>
                                        <div className='flex items-center gap-3'>
                                            <span className='text-blue-700 dark:text-blue-400 font-bold'>
                                                Producer
                                            </span>
                                            <span className='text-border'>
                                                ──►
                                            </span>
                                            <span className='border border-purple-500/50 px-3 py-1 text-purple-700 dark:text-purple-400'>
                                                Topic: order_placed
                                            </span>
                                        </div>
                                        <div className='ml-16 space-y-1 border-l border-border pl-4'>
                                            <div className='flex items-center gap-2'>
                                                <span className='text-border'>
                                                    ├──►
                                                </span>
                                                <span className='text-emerald-700 dark:text-emerald-400'>
                                                    Email Service
                                                </span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <span className='text-border'>
                                                    ├──►
                                                </span>
                                                <span className='text-emerald-700 dark:text-emerald-400'>
                                                    SMS Service
                                                </span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <span className='text-border'>
                                                    └──►
                                                </span>
                                                <span className='text-emerald-700 dark:text-emerald-400'>
                                                    Analytics Service
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className='mt-4 text-xs text-muted-foreground/70'>
                                        উদাহরণ: Kafka topic — সব Consumer Group
                                        independently same message পড়তে পারে।
                                    </p>
                                </div>
                            </div>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'kafka',
            subHeader: { index: '004', title: 'Kafka Deep Dive' },
            title: (
                <SectionTitle>
                    Apache Kafka — <span className='italic'>Event Streaming Platform</span>
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <p className='text-muted-foreground leading-relaxed mb-10 text-lg'>
                            LinkedIn এ তৈরি, এখন Uber, Netflix, Airbnb সহ
                            হাজারো company ব্যবহার করে। প্রতিদিন{' '}
                            <strong className='text-foreground'>
                                trillions of events
                            </strong>{' '}
                            process করে। Kafka শুধু message queue না — এটা
                            distributed event streaming platform।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Kafka Key Terms — জানতেই হবে',
                    content: (
                        <ul className='space-y-2 text-sm leading-relaxed'>
                            <li>
                                <strong>Topic</strong> — message এর category।
                                যেমন &quot;order_placed&quot;, &quot;user_signup&quot;।
                            </li>
                            <li>
                                <strong>Partition</strong> — Topic কে parallel
                                শাখায় ভাগ করে। বেশি partition = বেশি throughput।
                            </li>
                            <li>
                                <strong>Offset</strong> — Partition এর প্রতিটা
                                message এর unique index। Consumer এখানে থেকে পড়ে।
                            </li>
                            <li>
                                <strong>Producer</strong> — Topic এ message লেখে।
                            </li>
                            <li>
                                <strong>Consumer Group</strong> — একদল consumer
                                মিলে একটা topic process করে। প্রতিটা partition একজন
                                consumer এ যায়।
                            </li>
                            <li>
                                <strong>Broker</strong> — Kafka server। Cluster
                                এ অনেক broker থাকে।
                            </li>
                            <li>
                                <strong>Replication Factor</strong> — প্রতিটা
                                partition কতটা broker এ copy থাকবেন (fault
                                tolerance)।
                            </li>
                        </ul>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-6 mt-12'>
                                Kafka Architecture
                            </h3>
                            <div className='border border-border bg-card/20 p-6 font-mono text-sm'>
                                <div className='space-y-4 text-muted-foreground'>
                                    <div className='flex items-center gap-4 flex-wrap'>
                                        <div className='space-y-1'>
                                            <div className='text-blue-700 dark:text-blue-400 font-bold text-xs'>
                                                PRODUCERS
                                            </div>
                                            <div className='border border-blue-500/40 px-3 py-2 text-xs space-y-1'>
                                                <div>Order Service</div>
                                                <div>Payment Service</div>
                                                <div>User Service</div>
                                            </div>
                                        </div>
                                        <span className='text-2xl text-border'>
                                            ──►
                                        </span>
                                        <div className='space-y-1'>
                                            <div className='text-yellow-700 dark:text-yellow-400 font-bold text-xs'>
                                                KAFKA BROKER
                                            </div>
                                            <div className='border border-yellow-500/40 px-3 py-2 text-xs space-y-1'>
                                                <div>
                                                    Topic: order_placed
                                                    [P0][P1][P2]
                                                </div>
                                                <div>
                                                    Topic: payment_done
                                                    [P0][P1]
                                                </div>
                                            </div>
                                        </div>
                                        <span className='text-2xl text-border'>
                                            ──►
                                        </span>
                                        <div className='space-y-1'>
                                            <div className='text-emerald-700 dark:text-emerald-400 font-bold text-xs'>
                                                CONSUMER GROUPS
                                            </div>
                                            <div className='border border-emerald-500/40 px-3 py-2 text-xs space-y-1'>
                                                <div>
                                                    Email Group [C1][C2]
                                                </div>
                                                <div>
                                                    Analytics Group [C1][C2][C3]
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: "Kafka's Unique Power — এটাই পার্থক্য",
                    content: (
                        <ul className='space-y-2 text-sm leading-relaxed'>
                            <li>
                                <strong>Message Replay</strong> — পুরনো message
                                আবার পড়া যায়। Consumer নতুন আসলেও পুরো history
                                process করতে পারে।
                            </li>
                            <li>
                                <strong>Multiple Consumer Groups</strong> — একই
                                topic থেকে Email service আর Analytics service
                                independently পড়তে পারে — একজন আরেকজনকে affect
                                করে না।
                            </li>
                            <li>
                                <strong>Durable Storage</strong> — Message
                                disk এ থাকে, days/weeks পর্যন্ত। Consumer down
                                থাকলেও data নষ্ট হয় না।
                            </li>
                        </ul>
                    ),
                },
            ],
        },
        {
            id: 'rabbitmq',
            subHeader: { index: '005', title: 'RabbitMQ' },
            title: (
                <SectionTitle>
                    RabbitMQ — Traditional Message Broker
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <p className='text-muted-foreground leading-relaxed mb-10 text-lg'>
                            AMQP protocol ব্যবহার করে। Complex routing, explicit
                            acknowledgment, Dead Letter Queue — এগুলো RabbitMQ
                            এর specialty। Push-based model — broker consumer কে
                            message push করে।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'RabbitMQ Key Concepts',
                    content: (
                        <ul className='space-y-2 text-sm leading-relaxed'>
                            <li>
                                <strong>Exchange</strong> — Message কোন queue তে
                                যাবেন তা decide করে। Types: Direct, Topic,
                                Fanout, Headers।
                            </li>
                            <li>
                                <strong>Queue</strong> — Message store করে।
                                Consumer এখান থেকে নেয়।
                            </li>
                            <li>
                                <strong>Binding</strong> — Exchange আর Queue এর
                                মধ্যে connection rule।
                            </li>
                            <li>
                                <strong>ACK (Acknowledgment)</strong> — Consumer
                                message সফলভাবে process করলেন broker কে জানায় →
                                broker message delete করে।
                            </li>
                            <li>
                                <strong>NACK + DLQ (Dead Letter Queue)</strong>{' '}
                                — Consumer fail করলেন NACK পাঠায় → বারবার fail
                                হলে message Dead Letter Queue তে যায়।
                            </li>
                        </ul>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Feature', 'Kafka', 'RabbitMQ'],
                    rows: [
                        [
                            'Model',
                            'Event Log (Pull-based)',
                            'Message Queue (Push-based)',
                        ],
                        [
                            'Message Retention',
                            <span className='text-emerald-700 dark:text-emerald-400'>
                                Days/weeks — replay সম্ভব
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>
                                ACK এর পর delete
                            </span>,
                        ],
                        [
                            'Throughput',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Millions/sec
                            </span>,
                            'Thousands/sec',
                        ],
                        [
                            'Message Replay',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                হ্যাঁ ✓
                            </span>,
                            <span className='text-red-700 dark:text-red-400'>না ✗</span>,
                        ],
                        [
                            'Complex Routing',
                            'Topic/Partition based',
                            <span className='text-emerald-700 dark:text-emerald-400'>
                                Exchange types (flexible)
                            </span>,
                        ],
                        [
                            'ACK/NACK + DLQ',
                            'Offset commit',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Explicit ACK/NACK + DLQ
                            </span>,
                        ],
                        [
                            'Best For',
                            'Real-time streaming, analytics',
                            'Task queues, job processing',
                        ],
                    ],
                },
            ],
        },
        {
            id: 'code-examples',
            subHeader: { index: '006', title: 'Code Examples' },
            title: (
                <SectionTitle>
                    Code Examples — হাতে-কলমে দেখুন
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-4'>
                            Kafka — Python Producer &amp; Consumer
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'kafka_example.py',
                    code: `from kafka import KafkaProducer, KafkaConsumer
import json

# ── PRODUCER: Order Service ──────────────────────────────────────────────
producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def place_order(order_id, user_id, items):
    event = {
        "order_id": order_id,
        "user_id": user_id,
        "items": items,
        "status": "placed"
    }
    # topic: "order_placed" এ message publish করুন
    producer.send('order_placed', value=event)
    producer.flush()
    print(f"✅ Order {order_id} event published to Kafka")

place_order("ORD-001", "USR-42", [{"item": "Biryani", "qty": 2}])


# ── CONSUMER: Email Service ───────────────────────────────────────────────
consumer = KafkaConsumer(
    'order_placed',
    bootstrap_servers='localhost:9092',
    group_id='email-service-group',       # Consumer Group ID
    auto_offset_reset='earliest',
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

print("📧 Email Service listening for order events...")
for message in consumer:
    order = message.value
    print(f"Sending confirmation email for order: {order['order_id']}")
    # send_email(order['user_id'], order['order_id'])
    # offset automatically commit হয় — message processed হলে`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-4 mt-12'>
                            RabbitMQ — Node.js Publisher &amp; Worker
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'rabbitmq_worker.js',
                    code: `const amqp = require('amqplib');

// ── PUBLISHER ────────────────────────────────────────────────────────────
async function publishImageTask(imageUrl) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queue = 'image_resize';
  await channel.assertQueue(queue, { durable: true }); // queue crash এ survive করে

  const task = JSON.stringify({ imageUrl, width: 800, height: 600 });
  channel.sendToQueue(queue, Buffer.from(task), { persistent: true });

  console.log("📤 Task queued:", imageUrl);
  await channel.close();
  await connection.close();
}

publishImageTask('https://cdn.example.com/photo-001.jpg');


// ── WORKER (Consumer) ─────────────────────────────────────────────────────
async function startWorker() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queue = 'image_resize';
  await channel.assertQueue(queue, { durable: true });
  channel.prefetch(1); // একটা message process শেষ না হলে পরেরটা নেবে না

  console.log("🔧 Worker listening for image tasks...");

  channel.consume(queue, async (msg) => {
    const task = JSON.parse(msg.content.toString());

    try {
      console.log(\`Processing: \${task.imageUrl}\`);
      await resizeImage(task.imageUrl, task.width, task.height); // actual work
      channel.ack(msg);          // ✅ সফল → broker কে জানাও, message delete হবে
      console.log("✅ Image processed successfully");
    } catch (error) {
      console.error("❌ Failed:", error.message);
      channel.nack(msg, false, false); // ❌ fail → requeue: false → DLQ তে যাবেন
    }
  });
}

startWorker();`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-4 mt-12'>
                            Dead Letter Queue Setup
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'dlq_setup.js',
                    code: `const amqp = require('amqplib');

async function setupDLQ() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  // 1. Dead Letter Exchange তৈরি করুন
  await channel.assertExchange('dlx_exchange', 'direct', { durable: true });

  // 2. Dead Letter Queue তৈরি করুন
  await channel.assertQueue('dead_letter_queue', { durable: true });
  await channel.bindQueue('dead_letter_queue', 'dlx_exchange', 'failed');

  // 3. Main queue — DLX config সহ
  await channel.assertQueue('image_resize', {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': 'dlx_exchange',  // fail হলে এখানে যাবেন
      'x-dead-letter-routing-key': 'failed',
      'x-message-ttl': 30000,                    // 30 sec এর মধ্যে process না হলে DLQ
    }
  });

  console.log("✅ DLQ setup complete");
  // এখন যেকোনো nack(msg, false, false) → dlx_exchange → dead_letter_queue
  await connection.close();
}

setupDLQ();`,
                },
            ],
        },
        {
            id: 'comparison',
            subHeader: { index: '007', title: 'Full Comparison' },
            title: (
                <SectionTitle>
                    Kafka vs RabbitMQ vs AWS SQS — কোনটা কখন?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Tool', 'Best For', 'Throughput', 'Complexity', 'Managed?'],
                    rows: [
                        [
                            <span className='font-bold text-yellow-700 dark:text-yellow-400'>
                                Apache Kafka
                            </span>,
                            'Real-time analytics, event streaming',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Millions/sec
                            </span>,
                            <span className='text-red-700 dark:text-red-400'>High</span>,
                            'Self-hosted / Confluent Cloud',
                        ],
                        [
                            <span className='font-bold text-orange-700 dark:text-orange-400'>
                                RabbitMQ
                            </span>,
                            'Task queues, complex routing',
                            'Thousands/sec',
                            <span className='text-yellow-700 dark:text-yellow-400'>Medium</span>,
                            'Self-hosted',
                        ],
                        [
                            <span className='font-bold text-blue-700 dark:text-blue-400'>
                                AWS SQS
                            </span>,
                            'Simple task queue, decoupling',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                High
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400'>Low</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Fully managed ✓
                            </span>,
                        ],
                        [
                            <span className='font-bold text-purple-700 dark:text-purple-400'>
                                AWS SNS
                            </span>,
                            'Pub/Sub fan-out notifications',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                High
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400'>Low</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Fully managed ✓
                            </span>,
                        ],
                        [
                            <span className='font-bold text-red-700 dark:text-red-400'>
                                Redis Streams
                            </span>,
                            'Lightweight streaming, low latency',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                High
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400'>Low</span>,
                            'Self-hosted',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'Quick Decision Guide',
                    content: (
                        <ul className='space-y-2 text-sm leading-relaxed'>
                            <li>
                                <strong>Kafka বেছে নাও</strong> যখন — real-time
                                analytics, event replay দরকার, millions of
                                events/sec, multiple teams same data consume করবেন।
                            </li>
                            <li>
                                <strong>RabbitMQ বেছে নাও</strong> যখন — complex
                                routing logic, task queue, ACK/retry behavior
                                দরকার, throughput কম কিন্তু reliability বেশি।
                            </li>
                            <li>
                                <strong>AWS SQS বেছে নাও</strong> যখন — AWS
                                already ব্যবহার করছো, simple decoupling দরকার,
                                infrastructure manage করতে চাও না।
                            </li>
                            <li>
                                <strong>Redis Streams বেছে নাও</strong> যখন —
                                already Redis আছে, lightweight streaming, low
                                latency দরকার।
                            </li>
                        </ul>
                    ),
                },
            ],
        },
        {
            id: 'interview-prep',
            subHeader: { index: '008', title: 'Interview Prep' },
            title: (
                <SectionTitle>
                    Interview Prep — এই প্রশ্নগুলো আসবেনই
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q1: Kafka At-Least-Once vs Exactly-Once Delivery কী?',
                    content: (
                        <ul className='space-y-2 text-sm leading-relaxed'>
                            <li>
                                <strong>At-Least-Once</strong> — Message কমপক্ষে
                                একবার deliver হবে। Consumer crash করে re-process
                                করলেন duplicate হতে পারে। Default behavior।
                            </li>
                            <li>
                                <strong>At-Most-Once</strong> — Message হয়তো পাবেন,
                                হয়তো পাবেন না। Data loss সম্ভব।
                            </li>
                            <li>
                                <strong>Exactly-Once</strong> — Message exactly
                                একবার deliver হবে। Idempotent producer +
                                transactional consumer দিয়ে achieve করা যায়।
                                Performance overhead আছে।
                            </li>
                            <li className='text-muted-foreground'>
                                Interview answer:{' '}
                                <em>
                                    &quot;Production এ আমি at-least-once ব্যবহার
                                    করি এবং consumer কে idempotent বানাই —
                                    duplicate message আসলেও same result হয়।&quot;
                                </em>
                            </li>
                        </ul>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q2: Kafka Partition কীভাবে Throughput বাড়ায়?',
                    content: (
                        <ul className='space-y-2 text-sm leading-relaxed'>
                            <li>
                                একটা Topic কে N টা Partition এ ভাগ করলেন N টা
                                Consumer Group member parallel এ পড়তে পারে।
                            </li>
                            <li>
                                Partition = Parallelism unit। 10 partition → 10
                                consumer same topic এ parallel কাজ করতে পারে।
                            </li>
                            <li>
                                Key-based partitioning — same order_id এর সব event
                                একই partition এ → ordering guarantee।
                            </li>
                            <li className='text-muted-foreground'>
                                Rule: Consumer Group এ Consumer সংখ্যা ≤ Partition
                                সংখ্যা। বেশি consumer থাকলে idle থাকবেন।
                            </li>
                        </ul>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q3: Message Queue vs Direct API Call — কখন কোনটা?',
                    content: (
                        <div className='space-y-3 text-sm leading-relaxed'>
                            <div>
                                <strong>Direct API Call ব্যবহার করুন</strong> যখন:
                                <ul className='mt-1 space-y-0.5 ml-4 text-muted-foreground'>
                                    <li>— Immediate response দরকার (payment confirmation)</li>
                                    <li>— Strong consistency দরকার</li>
                                    <li>— Simple request-response pattern</li>
                                </ul>
                            </div>
                            <div>
                                <strong>Message Queue ব্যবহার করুন</strong> যখন:
                                <ul className='mt-1 space-y-0.5 ml-4 text-muted-foreground'>
                                    <li>— Result immediately দরকার নেই (email, notification)</li>
                                    <li>— Service গুলো independent থাকুক</li>
                                    <li>— Traffic spike handle করতে হবে</li>
                                    <li>— Retry/fault tolerance দরকার</li>
                                </ul>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q4: Dead Letter Queue কী কাজ করে?',
                    content: (
                        <ul className='space-y-2 text-sm leading-relaxed'>
                            <li>
                                যে message বারবার process করতে গিয়ে fail হয় —
                                সেটা main queue থেকে সরিয়ে Dead Letter Queue
                                (DLQ) তে রাখা হয়।
                            </li>
                            <li>
                                DLQ তে message থাকলে engineer manually investigate
                                করতে পারে — কেন fail হলো।
                            </li>
                            <li>
                                &quot;Poison message&quot; problem সলভ করে — একটা
                                bad message পুরো queue আটকে না রাখে।
                            </li>
                            <li className='text-muted-foreground'>
                                Real use case: Invalid payment data → 3 বার retry →
                                DLQ → Alert → Manual fix → Reprocess।
                            </li>
                        </ul>
                    ),
                },
            ],
        },
    ],
    summary: {
        headers: ['Concept', 'এক লাইনে'],
        rows: [
            [
                <span className='font-bold text-primary'>Message Queue</span>,
                'Services এর মাঝখানে async buffer — decoupling এর হাতিয়ার',
            ],
            [
                <span className='font-bold text-primary'>Point-to-Point</span>,
                'একটা message শুধু একজন consumer পায় — task queue',
            ],
            [
                <span className='font-bold text-primary'>Pub/Sub</span>,
                'একটা message সব subscribers পায় — broadcast / fan-out',
            ],
            [
                <span className='font-bold text-primary'>Kafka</span>,
                'Event streaming, replay সম্ভব, millions/sec, multiple Consumer Groups',
            ],
            [
                <span className='font-bold text-primary'>RabbitMQ</span>,
                'Traditional broker, complex routing, ACK/NACK, DLQ support',
            ],
            [
                <span className='font-bold text-primary'>Dead Letter Queue</span>,
                'Repeatedly fail message আলাদা রাখে — investigate করা যায়',
            ],
            [
                <span className='font-bold text-primary'>Consumer Group</span>,
                'Multiple consumers coordinate করে একটা topic parallel process করে',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'Message Queue এর সবচেয়ে বড় সুবিধা কোনটি?',
                options: [
                    {
                        key: 'A',
                        text: 'Database query fast করে',
                        isCorrect: false,
                        explanation:
                            'Message Queue database এর সাথে সরাসরি সম্পর্কিত না।',
                    },
                    {
                        key: 'B',
                        text: 'Services decoupled থাকে — একটা down হলে অন্যটা চলে',
                        isCorrect: true,
                        explanation:
                            'Decoupling হলো Message Queue এর core benefit। Producer আর Consumer একে অপরের উপর directly depend করে না।',
                    },
                    {
                        key: 'C',
                        text: 'Code লেখা সহজ হয়',
                        isCorrect: false,
                        explanation:
                            'আসলে Message Queue add করলেন complexity বাড়ে।',
                    },
                    {
                        key: 'D',
                        text: 'Server কম লাগে',
                        isCorrect: false,
                        explanation:
                            'Queue broker নিজেই একটা additional component।',
                    },
                ],
            },
            {
                id: 2,
                text: 'Kafka Partition কী করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Message encrypt করে',
                        isCorrect: false,
                        explanation: 'Partition encryption এর সাথে সম্পর্কিত না।',
                    },
                    {
                        key: 'B',
                        text: 'Consumer গুলোকে একে অপর থেকে আলাদা রাখে',
                        isCorrect: false,
                        explanation: 'এটা Consumer Group এর কাজ।',
                    },
                    {
                        key: 'C',
                        text: 'Topic কে parallel শাখায় ভাগ করে — বেশি consumer parallel কাজ করতে পারে',
                        isCorrect: true,
                        explanation:
                            'Partition হলো Kafka এর parallelism unit। N partition = N consumer same topic এ একসাথে কাজ করতে পারে।',
                    },
                    {
                        key: 'D',
                        text: 'Message duplicate হওয়া থেকে বাঁচায়',
                        isCorrect: false,
                        explanation: 'এটা idempotency/exactly-once এর কাজ।',
                    },
                ],
            },
            {
                id: 3,
                text: 'RabbitMQ তে ACK মানে কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Consumer সফলভাবে process করলেন broker কে জানায় — broker message delete করে',
                        isCorrect: true,
                        explanation:
                            'ACK (Acknowledgment) হলো consumer এর confirmation। ACK ছাড়া broker মনে করে message এখনও process হয়নি।',
                    },
                    {
                        key: 'B',
                        text: 'Producer message পাঠানো confirm করে',
                        isCorrect: false,
                        explanation:
                            'ACK consumer side থেকে আসে, producer থেকে না।',
                    },
                    {
                        key: 'C',
                        text: 'Message encrypt হওয়ার signal',
                        isCorrect: false,
                        explanation: 'ACK encryption এর সাথে সম্পর্কিত না।',
                    },
                    {
                        key: 'D',
                        text: 'Queue full হওয়ার notification',
                        isCorrect: false,
                        explanation:
                            'এটা backpressure/flow control এর বিষয়, ACK না।',
                    },
                ],
            },
            {
                id: 4,
                text: 'Kafka তে message replay কীভাবে কাজ করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Producer আবার same message পাঠায়',
                        isCorrect: false,
                        explanation:
                            'Replay এ Producer কিছু করে না — Consumer নিজে offset reset করে।',
                    },
                    {
                        key: 'B',
                        text: 'Broker automatically retry করে',
                        isCorrect: false,
                        explanation:
                            'Kafka pull-based — broker push করে না, consumer নিজে নেয়।',
                    },
                    {
                        key: 'C',
                        text: 'Message backup থেকে restore হয়',
                        isCorrect: false,
                        explanation:
                            'Kafka তে message disk এ থাকে — separate backup দরকার নেই।',
                    },
                    {
                        key: 'D',
                        text: 'Consumer পুরানো offset থেকে আবার consume করতে পারে',
                        isCorrect: true,
                        explanation:
                            'Kafka message disk এ retain করে। Consumer offset reset করলেন পুরনো message থেকে আবার পড়া যায়। এটাই Kafka এর unique power।',
                    },
                ],
            },
            {
                id: 5,
                text: 'Pub/Sub pattern এ কী হয়?',
                options: [
                    {
                        key: 'A',
                        text: 'একটা message শুধু একজন consumer পায়',
                        isCorrect: false,
                        explanation:
                            'এটা Point-to-Point pattern। Pub/Sub তে সবাই পায়।',
                    },
                    {
                        key: 'B',
                        text: 'একটা message সব subscribers পায়',
                        isCorrect: true,
                        explanation:
                            'Pub/Sub হলো broadcast model। Publisher topic এ message দেয়, সব subscribers সেটা পায়।',
                    },
                    {
                        key: 'C',
                        text: 'Consumer নিজে message request করে',
                        isCorrect: false,
                        explanation:
                            'এটা pull model এর বর্ণনা, Pub/Sub pattern এর না।',
                    },
                    {
                        key: 'D',
                        text: 'Message শুধু একবার পাঠানো যায়',
                        isCorrect: false,
                        explanation:
                            'Pub/Sub এ একই message multiple subscribers পাবেন।',
                    },
                ],
            },
            {
                id: 6,
                text: 'Dead Letter Queue কী কাজ করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Queue এর oldest message delete করে',
                        isCorrect: false,
                        explanation:
                            'এটা TTL (Time-to-Live) এর কাজ, DLQ এর না।',
                    },
                    {
                        key: 'B',
                        text: 'Message গুলো encrypt করে রাখে',
                        isCorrect: false,
                        explanation: 'DLQ encryption এর সাথে সম্পর্কিত না।',
                    },
                    {
                        key: 'C',
                        text: 'Repeatedly fail হওয়া message গুলো আলাদা রাখে — investigate করা যায়',
                        isCorrect: true,
                        explanation:
                            'DLQ হলো safety net। Poison message main queue কে block করতে পারে না — DLQ তে গিয়ে পড়ে থাকে। Engineer পরে দেখতে পারে।',
                    },
                    {
                        key: 'D',
                        text: 'Consumer এর error log রাখে',
                        isCorrect: false,
                        explanation:
                            'DLQ actual message রাখে, শুধু log না।',
                    },
                ],
            },
            {
                id: 7,
                text: 'Real-time analytics এর জন্য Kafka vs RabbitMQ — কোনটা বেছে নেবে?',
                options: [
                    {
                        key: 'A',
                        text: 'Kafka — কারণ millions/sec throughput, message replay, multiple Consumer Groups',
                        isCorrect: true,
                        explanation:
                            'Real-time analytics এ Kafka perfect — high throughput, replay করে historical analysis, আলাদা team আলাদা Consumer Group দিয়ে same data ব্যবহার করতে পারে।',
                    },
                    {
                        key: 'B',
                        text: 'RabbitMQ — কারণ complex routing support করে',
                        isCorrect: false,
                        explanation:
                            'RabbitMQ routing ভালো, কিন্তু analytics এর জন্য throughput আর replay দরকার — Kafka এগিয়ে।',
                    },
                    {
                        key: 'C',
                        text: 'দুটো একসাথে ব্যবহার করতে হবে',
                        isCorrect: false,
                        explanation:
                            'Analytics use case এ Kafka একাই যথেষ্ট।',
                    },
                    {
                        key: 'D',
                        text: 'Redis Streams — সবচেয়ে fast',
                        isCorrect: false,
                        explanation:
                            'Redis Streams lightweight, কিন্তু large-scale analytics এর জন্য Kafka বেশি উপযুক্ত।',
                    },
                ],
            },
            {
                id: 8,
                text: 'Kafka Consumer Group এর কাজ কী?',
                options: [
                    {
                        key: 'A',
                        text: 'একই message সব consumer এ পাঠায়',
                        isCorrect: false,
                        explanation:
                            'এটা Pub/Sub বা multiple Consumer Groups এর behavior। একটা Consumer Group এর ভেতরে প্রতিটা message একজন consumer পায়।',
                    },
                    {
                        key: 'B',
                        text: 'Consumer গুলোকে authenticate করে',
                        isCorrect: false,
                        explanation:
                            'Authentication Consumer Group এর কাজ না।',
                    },
                    {
                        key: 'C',
                        text: 'Message এর order maintain করে',
                        isCorrect: false,
                        explanation:
                            'Order maintain হয় partition level এ, Consumer Group দিয়ে না।',
                    },
                    {
                        key: 'D',
                        text: 'Multiple consumers coordinate করে একটা topic parallel process করে',
                        isCorrect: true,
                        explanation:
                            'Consumer Group এ প্রতিটা partition একজন consumer পায়। Group মিলে topic এর সব partition cover করে — parallel processing।',
                    },
                ],
            },
            {
                id: 9,
                text: 'E-commerce এ order place হলে email, SMS, inventory update — কোন approach best?',
                options: [
                    {
                        key: 'A',
                        text: 'Synchronously একে একে সব করুন — user wait করুক',
                        isCorrect: false,
                        explanation:
                            'Synchronous করলেন user অনেকক্ষণ wait করবেন। Email/SMS slow হলে order response delayed হবে।',
                    },
                    {
                        key: 'B',
                        text: 'Queue তে event publish করুন, সব service async parallel process করুক',
                        isCorrect: true,
                        explanation:
                            'Queue event publish → user তৎক্ষণাৎ confirmation পায়। Email, SMS, Inventory parallel background এ হয়। Fast, decoupled, fault-tolerant।',
                    },
                    {
                        key: 'C',
                        text: 'শুধু email পাঠাও, বাকি skip করুন',
                        isCorrect: false,
                        explanation:
                            'সব service দরকার। Skip করলেন business logic ভাঙবে।',
                    },
                    {
                        key: 'D',
                        text: 'Cron job দিয়ে ৫ মিনিট পর পর process করুন',
                        isCorrect: false,
                        explanation:
                            'Cron দিয়ে ৫ মিনিট delay হবে — user এর real-time experience খারাপ হবে।',
                    },
                ],
            },
            {
                id: 10,
                text: 'RabbitMQ তে channel.prefetch(1) কী করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Worker শুধু ১টা message receive করতে পারে সারাজীবন',
                        isCorrect: false,
                        explanation:
                            'prefetch(1) মানে একসাথে ১টা — এটা limit, total না।',
                    },
                    {
                        key: 'B',
                        text: 'Queue তে সর্বোচ্চ ১টা message রাখতে পারবেন',
                        isCorrect: false,
                        explanation:
                            'prefetch queue size limit করে না, worker এর concurrent processing limit করে।',
                    },
                    {
                        key: 'C',
                        text: 'Worker একটা message process করে ACK দেয়, তারপর পরেরটা নেয়',
                        isCorrect: true,
                        explanation:
                            'prefetch(1) মানে worker একসাথে শুধু ১টা unacked message রাখতে পারবেন। Process → ACK → তারপর নতুনটা। এতে fair dispatch নিশ্চিত হয়।',
                    },
                    {
                        key: 'D',
                        text: 'Message ১ সেকেন্ড পর auto-expire হয়',
                        isCorrect: false,
                        explanation:
                            'Expiry হয় x-message-ttl দিয়ে, prefetch দিয়ে না।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'Message Queue Design & Implementation',
        time: '৩-৪ ঘণ্টা',
        difficulty: 'Junior-Mid Level',
        tasks: [
            <span key='1'>
                <strong>Scenario Analysis:</strong> নিচের ৩টা system এর জন্য
                বলুন Kafka নাকি RabbitMQ উপযুক্ত এবং কেন: (ক) একটি ride-sharing
                app এর real-time location tracking ও trip analytics (খ) একটি
                e-commerce এর image resize background job — ছবি upload হলে
                thumbnail তৈরি করা (গ) একটি news site যেখানে article publish
                হলে Email newsletter, push notification, social media auto-post
                হবে।
            </span>,
            <span key='2'>
                <strong>Kafka vs RabbitMQ Decision:</strong> আপনার team একটা
                food delivery app বানাচ্ছে। Order placed event থেকে: Email,
                SMS, Inventory, Driver notification, Analytics — সব হবে।
                আপনি কোনটা বেছে নেবে? কেন? ৫-৭ লাইনে justify করুন।
            </span>,
            <span key='3'>
                <strong>Flow Diagram:</strong> Excalidraw বা draw.io দিয়ে Food
                Delivery async order flow diagram আঁকুন: User → Order Service →
                Message Queue → [Email Worker | SMS Worker | Inventory Worker |
                Driver Service]। প্রতিটা arrow তে কী হচ্ছে label দিন।
            </span>,
            <span key='4'>
                <strong>Code Practice:</strong> উপরের RabbitMQ worker code
                পড়ো এবং modify করুন — prefetch(1) কে prefetch(3) করলেন কী
                পরিবর্তন হবে? Consumer একটা fail করলেন কী হবে? Code comment
                আকারে explain করুন।
            </span>,
            <span key='5'>
                <strong>Research:</strong> Uber এর Kafka use case research করুন।
                তারা কীভাবে Kafka ব্যবহার করে, কতটা data process করে, কোন
                problem solve করেছেনে — ৪-৫ লাইনে লিখুন।
            </span>,
        ],
        deliverables: [
            <span key='1'>Scenario analysis — written answers with justification</span>,
            <span key='2'>Kafka vs RabbitMQ decision with reasoning</span>,
            <span key='3'>Async order flow diagram (screenshot বা file)</span>,
            <span key='4'>Modified code with comments explaining changes</span>,
            <span key='5'>Uber Kafka research summary</span>,
        ],
    },
    practicalLab: {
        title: 'Hands-On Project Task',
        subtitle: 'Async Order Processing System',
        steps: [
            {
                title: 'RabbitMQ Docker এ চালাও',
                description:
                    'docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management দিয়ে RabbitMQ start করুন। Management UI পাবেন localhost:15672 এ (guest/guest)।',
            },
            {
                title: 'Order API বানান',
                description:
                    'Express.js দিয়ে POST /order endpoint তৈরি করুন। Order receive করলেন RabbitMQ queue তে message publish করবেন এবং তৎক্ষণাৎ { status: "Order Confirmed!" } return করবেন।',
            },
            {
                title: '৩টা Worker তৈরি করুন',
                description:
                    'তিনটা আলাদা worker process: email-worker.js, sms-worker.js, inventory-worker.js। প্রতিটা queue থেকে message নেবে, কাজ করবেন (console.log), ACK দেবে।',
            },
            {
                title: 'System Test করুন',
                description:
                    'Postman বা curl দিয়ে POST /order call করুন। দেখুন তিনটা worker terminal এ একসাথে message process করছে কিনা। Order response instant আসছে কিনা।',
            },
            {
                title: 'Failure Test করুন',
                description:
                    'email-worker বন্ধ করুন, Order দিন, আবার email-worker চালাও। দেখুন queue তে জমে থাকা message automatically process হচ্ছে কিনা — এটাই async এর power।',
            },
            {
                title: 'Management UI দেখুন',
                description:
                    'localhost:15672 এ লগইন করুন। Queue statistics, message rates, consumer count সব visualize করুন। একটা worker বন্ধ রেখে message পাঠাও — queue তে বাড়তে দেখবেন।',
            },
        ],
        codeBlock: {
            language: 'javascript',
            filename: 'order-service.js',
            code: `const express = require('express');
const amqp = require('amqplib');

const app = express();
app.use(express.json());

let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect('amqp://localhost');
  channel = await connection.createChannel();
  await channel.assertQueue('order_queue', { durable: true });
  console.log('✅ Connected to RabbitMQ');
}

app.post('/order', async (req, res) => {
  const order = {
    id: \`ORD-\${Date.now()}\`,
    user: req.body.user,
    items: req.body.items,
    timestamp: new Date().toISOString()
  };

  // Queue তে message রাখুন — async, non-blocking
  channel.sendToQueue(
    'order_queue',
    Buffer.from(JSON.stringify(order)),
    { persistent: true }
  );

  // User কে তৎক্ষণাৎ response দিন — processing wait করুন না
  res.json({
    status: 'Order Confirmed! ✅',
    orderId: order.id,
    message: 'Email, SMS, Inventory update background এ হচ্ছে'
  });
});

connectRabbitMQ().then(() => {
  app.listen(3000, () => console.log('🚀 Order Service running on :3000'));
});`,
        },
        tip: 'Failure test টা সবচেয়ে important — একটা worker বন্ধ করুন, ১০টা order দিন, তারপর worker চালাও। দেখবেন সব order automatically process হবে। এটাই Message Queue এর real power — data loss নেই, service down হলেও কাজ আটকায় না।',
    },
};
