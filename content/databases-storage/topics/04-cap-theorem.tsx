import React from 'react';
/* eslint-disable react/jsx-key */
import {
    CAPTriangleDiagram,
    PartitionSimulationDiagram,
} from '../../../components/course/topics/cap/diagrams';
import {
    SectionTitle,
    ContentParagraph,
    FeatureGrid,
    FeatureCard,
    GradientText,
    ProConGrid,
    ProConItem,
} from '../../../components/course/content-components';
import {
    CONTENT_TYPES,
    INFO_BOX_VARIANTS,
    TopicData,
} from '../../../types/content';

export const capContent: TopicData = {
    id: 'cap-theorem',
    sections: [
        {
            id: 'concept',
            subHeader: { index: '001', title: 'Concept' },
            title: (
                <SectionTitle>CAP Theorem কেন শিখতে হবে?</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                আপনি একটা distributed system design করছো।
                                Interview এ জিজ্ঞেস করলো — &quot;আপনার system এ
                                network failure হলে কী হবে? User কি wrong data
                                দেখবেন নাকি error পাবেন?&quot; — এই question এর
                                answer হলো CAP Theorem।
                            </ContentParagraph>
                            <ContentParagraph>
                                Cassandra vs MongoDB vs PostgreSQL কোনটা choose
                                করবেন — এই decision এর পেছনে CAP আছে।{' '}
                                <em className='text-foreground'>
                                    Senior engineer হতে হলে এই trade-off বুঝতেই
                                    হবে।
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
                            <strong>CAP Theorem</strong> বলে: একটা distributed
                            system এ সর্বোচ্চ দুটো guarantee দেওয়া সম্ভব —
                            Consistency, Availability, Partition Tolerance এর
                            মধ্যে। তিনটা একসাথে impossible। Eric Brewer 2000
                            সালে propose করেন, 2002 সালে formally prove হয়।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'cap-deep',
            subHeader: { index: '002', title: 'C, A, P Deep Dive' },
            title: (
                <SectionTitle>C, A, P — তিনটা কি মানে?</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.CUSTOM,
                    component: <CAPTriangleDiagram />,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                            <ProConGrid className='mb-12'>
                                <ProConItem title='C — Consistency' badge=''>
                                    সব nodes এ same time এ same data। Write করার
                                    পর যেকোনো node থেকে read করলেন latest value
                                    পানয়া যাবেন। &quot;All nodes see the same
                                    data simultaneously।&quot;
                                </ProConItem>
                                <ProConItem title='A — Availability' badge='' isLast type='positive'>
                                    প্রতিটি request এর response আসবেনই — error
                                    নয়, timeout নয়। কিছু nodes down থাকলেও
                                    system respond করবেন। তবে response টা stale
                                    হতে পারে।
                                </ProConItem>
                            </ProConGrid>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                            <ProConGrid className='mb-12'>
                                <ProConItem title='P — Partition Tolerance' badge='' type='positive'>
                                    Network partition (nodes এর communication
                                    বিচ্ছিন্ন) হলেও system কাজ করতে থাকে।
                                    Distributed system এ P সবসময় দরকার —
                                    network কখনো ১০০% reliable না।
                                </ProConItem>
                                <ProConItem title='💡 Real Choice' badge='' isLast type='positive'>
                                    Distributed system এ P বাদ দেওয়া যায় না।
                                    তাই real choice হলো:{' '}
                                    <strong>CP নাকি AP?</strong> Network
                                    partition হলে কোনটা sacrifice করবো —
                                    Consistency নাকি Availability?
                                </ProConItem>
                            </ProConGrid>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '🎯 Interview এ এটা বলুন',
                    content: (
                        <p>
                            &quot;CAP এ P সবসময় থাকবেন কারণ network failure real
                            world এ inevitable। তাই practical choice হলো CP বা
                            AP। Financial systems এ CP — wrong data
                            catastrophic। Social media তে AP — stale data কয়েক
                            seconds acceptable।&quot;
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'cp-ap',
            subHeader: { index: '003', title: 'Network Partition' },
            title: (
                <SectionTitle>
                    Network Partition হলে কি হয়?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.CUSTOM,
                    component: <PartitionSimulationDiagram />,
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Use Case', 'CP নাকি AP?', 'কারণ'],
                    rows: [
                        [
                            'Bank balance',
                            <span className='text-blue-700 dark:text-blue-400 font-bold uppercase'>
                                CP
                            </span>,
                            'Wrong balance দেখালে double-spending হবে',
                        ],
                        [
                            'Facebook likes',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold uppercase'>
                                AP
                            </span>,
                            'কয়েক seconds stale count দেখানো acceptable',
                        ],
                        [
                            'Online booking',
                            <span className='text-blue-700 dark:text-blue-400 font-bold uppercase'>
                                CP
                            </span>,
                            'Double-booking prevent করতে হবে',
                        ],
                        [
                            'DNS records',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold uppercase'>
                                AP
                            </span>,
                            'Always available, propagation delay acceptable',
                        ],
                        [
                            'Shopping cart',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold uppercase'>
                                AP
                            </span>,
                            'Cart lock হলে sale হারাবে, stale cart acceptable',
                        ],
                        [
                            'Leader election',
                            <span className='text-blue-700 dark:text-blue-400 font-bold uppercase'>
                                CP
                            </span>,
                            'Split-brain হলে catastrophic',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-12'>
                            <div className='p-6 bg-card border border-border'>
                                <h4 className='font-bold text-primary mb-3 uppercase tracking-widest text-xs'>
                                    CP Systems — Consistency Priority
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Partition হলে কিছু requests reject করে।
                                    Wrong data দেবে না। Banking, coordination
                                    (Zookeeper), configuration management এর
                                    জন্য।
                                </p>
                            </div>
                            <div className='p-6 bg-card border border-border'>
                                <h4 className='font-bold text-emerald-700 dark:text-emerald-400 mb-3 uppercase tracking-widest text-xs'>
                                    AP Systems — Availability Priority
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Partition হলেও respond করে, কিন্তু stale
                                    data দিতে পারে। Eventually consistent।
                                    Social feeds, caching, DNS, shopping cart এর
                                    জন্য।
                                </p>
                            </div>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'consistency-levels',
            subHeader: { index: '004', title: 'Consistency Levels' },
            title: (
                <SectionTitle>
                    Consistency — Strong থেকে Eventual
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Level', 'মানে কি', 'Real Example'],
                    rows: [
                        [
                            'Strong',
                            'Write এর পর সব nodes এ latest value। Slowest',
                            'Bank balance, Stock inventory',
                        ],
                        [
                            'Linearizable',
                            'Real-time order maintain। Operations globally ordered',
                            'Zookeeper, etcd',
                        ],
                        [
                            'Causal',
                            'Causally related operations ordered। Reply এর আগে post দেখা যাবেন',
                            'Chat apps, Comments',
                        ],
                        [
                            'Read-your-writes',
                            'আপনি নিজের write সবসময় দেখবেন। অন্যরা হয়তো দেখবেন না',
                            'Instagram — নিজের post দেখা',
                        ],
                        [
                            'Eventual',
                            'Eventually সব nodes same data। কখন হবে guarantee নেই',
                            'DNS, YouTube view count, Likes',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Eventual Consistency Example',
                    content: (
                        <p>
                            DNS update করলেন সারা বিশ্বে propagate হতে ২৪-৪৮
                            ঘণ্টা লাগতে পারে। এই সময় কেউ old IP দেখছে, কেউ new
                            IP। এটাই Eventual Consistency।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'sql',
                    filename: 'tunable-consistency.cql',
                    code: `-- Cassandra তে per-query consistency level configure করা যায়!
-- এটাই practical CAP flexibility

-- QUORUM: majority nodes (N/2+1) agree করলেন success
-- 3 nodes থাকলে QUORUM = 2 nodes agree করতে হবে
INSERT INTO accounts (id, balance)
VALUES (uuid(), 10000)
USING CONSISTENCY QUORUM;   -- Strong-ish, balanced

-- ONE: শুধু একটা node respond করলেনই success (fastest)
SELECT * FROM user_activity WHERE user_id = 101
CONSISTENCY ONE;            -- Fast, eventually consistent

-- ALL: সব nodes confirm করতে হবে (strongest, slowest)
UPDATE accounts SET balance = balance - 5000
WHERE account_id = 101
CONSISTENCY ALL;            -- Critical financial op`,
                },
            ],
        },
        {
            id: 'pacelc',
            subHeader: { index: '005', title: 'PACELC Theorem' },
            title: (
                <SectionTitle>PACELC — CAP এর Extension</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <p className='text-muted-foreground leading-relaxed mb-6 text-lg'>
                            CAP শুধু partition সময়ের কথা বলে। কিন্তু normal
                            operation এও trade-off আছে। Daniel Abadi 2012 সালে
                            PACELC propose করেন।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 PACELC মানে',
                    content: (
                        <p>
                            <strong>P</strong>artition থাকলে <strong>A</strong>
                            vailability vs <strong>C</strong>onsistency;{' '}
                            <strong>E</strong>lse (normal এ) <strong>L</strong>
                            atency vs <strong>C</strong>onsistency। যত বেশি
                            nodes এ replicate করবেন, তত বেশি consistent কিন্তু তত
                            বেশি latency।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Database',
                        'Partition Time',
                        'Normal Operation',
                        'সহজ কথায়',
                    ],
                    rows: [
                        [
                            'DynamoDB',
                            <span className='text-emerald-700 dark:text-emerald-400'>
                                PA (available)
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400'>
                                EL (low latency)
                            </span>,
                            'Fast, eventual consistency',
                        ],
                        [
                            'Cassandra',
                            <span className='text-emerald-700 dark:text-emerald-400'>
                                PA (available)
                            </span>,
                            <span className='text-blue-700 dark:text-blue-400'>
                                EL (configurable)
                            </span>,
                            'Tunable, default fast',
                        ],
                        [
                            'MongoDB',
                            <span className='text-blue-700 dark:text-blue-400'>
                                PC (consistent)
                            </span>,
                            <span className='text-blue-700 dark:text-blue-400'>
                                EC (some latency)
                            </span>,
                            'Strong consistency',
                        ],
                        [
                            'PostgreSQL',
                            <span className='text-blue-700 dark:text-blue-400'>
                                PC (consistent)
                            </span>,
                            <span className='text-blue-700 dark:text-blue-400'>
                                EC (ACID overhead)
                            </span>,
                            'Full ACID, slower',
                        ],
                    ],
                },
            ],
        },
        {
            id: 'real-world',
            subHeader: { index: '006', title: 'Real World Examples' },
            title: (
                <SectionTitle>
                    বড় কোম্পানিগুলো কীভাবে করেছেনে
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-12'>
                            <div>
                                <h3 className='text-xl font-bold mb-4 flex items-center gap-3'>
                                    <span className='text-2xl'>📦</span> Amazon
                                    DynamoDB — AP by Design
                                </h3>
                                <p className='text-muted-foreground leading-relaxed'>
                                    Amazonconsciously AP choose করেছেনে।
                                    &quot;Always available&quot; guarantee।
                                    Werner Vogels (Amazon CTO): &quot;Network
                                    partition হলে আপনাকে পুরোনো cart দেখাবো
                                    কিন্তু cart lock করবো না।&quot; Availability
                                    থেকে Consistency বেশি important — cart lock
                                    হলে sale হারাবে। তবে checkout এ CP enforce
                                    হয়।
                                </p>
                            </div>
                            <div>
                                <h3 className='text-xl font-bold mb-4 flex items-center gap-3'>
                                    <span className='text-2xl'>🔒</span> Apache
                                    Zookeeper — CP by Design
                                </h3>
                                <p className='text-muted-foreground leading-relaxed'>
                                    Distributed coordination service — CP
                                    choice। Leader election, distributed locks,
                                    config management। Wrong value এখানে
                                    catastrophic — দুটো nodes যদি একসাথে leader
                                    মনে করে, split-brain problem হয়। Partition
                                    এ কিছু clients reject হলেও correct data
                                    দেওয়া জরুরি। Kafka broker coordination,
                                    HDFS এ Zookeeper use হয়।
                                </p>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Split-brain কি?',
                    content: (
                        <p>
                            Network partition এ দুটো partition নিজেকেই primary
                            মনে করে — conflicting states তৈরি হয়। Solution:
                            Quorum (majority voting) — ছোট partition writes
                            accept করে না। Zookeeper, etcd এভাবে handle করে।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'eventual-consistency-sim.py',
                    code: `import asyncio, time, random

class Node:
    def __init__(self, node_id):
        self.node_id = node_id
        self.data = {}       # Local state
        self.peers = []

    async def write(self, key, value):
        # AP: Local write, async sync — fire and forget
        self.data[key] = {'value': value, 'ts': time.time()}
        print(f"[{self.node_id}] Wrote {key}={value} (local)")
        asyncio.create_task(self._propagate(key))  # Async!

    async def read(self, key):
        # May return stale data!
        entry = self.data.get(key)
        val = entry['value'] if entry else None
        print(f"[{self.node_id}] Read {key}={val}")
        return val

    async def _propagate(self, key):
        # Simulate network delay (0.5-3 seconds)
        await asyncio.sleep(random.uniform(0.5, 3.0))
        for peer in self.peers:
            await peer._sync(key, self.data[key])

    async def _sync(self, key, entry):
        # Last-Write-Wins conflict resolution
        existing = self.data.get(key)
        if not existing or existing['ts'] < entry['ts']:
            self.data[key] = entry
            print(f"[{self.node_id}] Synced {key}={entry['value']}")

async def demo():
    a, b = Node("A"), Node("B")
    a.peers = [b]; b.peers = [a]

    await a.write("likes", 100)
    await b.read("likes")    # None! Not synced yet
    await asyncio.sleep(4)  # Wait for propagation
    await b.read("likes")    # 100 — eventually consistent!

asyncio.run(demo())`,
                },
            ],
        },
        {
            id: 'tools',
            subHeader: { index: '007', title: 'Tools Classification' },
            title: (
                <SectionTitle>
                    Database CAP Classification
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Database',
                        'CAP Type',
                        'Consistency',
                        'Availability',
                        'Best For',
                    ],
                    rows: [
                        [
                            'Zookeeper',
                            <span className='text-blue-700 dark:text-blue-400 font-bold'>CP</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Strong
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>
                                Partition = reject
                            </span>,
                            'Leader election, locks',
                        ],
                        [
                            'HBase',
                            <span className='text-blue-700 dark:text-blue-400 font-bold'>CP</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Strong
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>
                                Partition = reject
                            </span>,
                            'Big data analytics',
                        ],
                        [
                            'MongoDB',
                            <span className='text-blue-700 dark:text-blue-400 font-bold'>CP</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Strong (default)
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>
                                Primary must respond
                            </span>,
                            'Content, catalogs',
                        ],
                        [
                            'Cassandra',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                AP (tunable)
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>
                                Tunable ONE→ALL
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Always responds
                            </span>,
                            'Social, IoT, logging',
                        ],
                        [
                            'DynamoDB',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                AP (default)
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>
                                Eventually/Strong
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                99.999% SLA
                            </span>,
                            'E-commerce, gaming',
                        ],
                        [
                            'CouchDB',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                AP
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>Eventual</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Always available
                            </span>,
                            'Offline-first apps',
                        ],
                        [
                            'PostgreSQL',
                            <span className='text-blue-700 dark:text-blue-400 font-bold'>CP</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Strong (ACID)
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>
                                Single-node limit
                            </span>,
                            'Finance, e-commerce',
                        ],
                    ],
                },
            ],
        },
    ],
    summary: {
        headers: ['Concept', 'এক লাইনে'],
        rows: [
            [
                <span className='font-bold text-primary'>CAP Theorem</span>,
                'C + A + P একসাথে impossible। P সবসময় থাকে, তাই CP বা AP choose করুন',
            ],
            [
                <span className='font-bold text-primary'>CP Systems</span>,
                'Consistency priority — Banking, Zookeeper',
            ],
            [
                <span className='font-bold text-primary'>AP Systems</span>,
                'Availability priority — Social, DNS, Cache',
            ],
            [
                <span className='font-bold text-primary'>
                    Eventual Consistency
                </span>,
                'Eventually সব nodes same, latency কম',
            ],
            [
                <span className='font-bold text-primary'>PACELC</span>,
                'Normal operation এ Latency vs Consistency trade-off',
            ],
            [
                <span className='font-bold text-primary'>QUORUM</span>,
                'Majority (N/2+1) nodes agreement',
            ],
            [
                <span className='font-bold text-primary'>Split-brain</span>,
                'Partition এ দুটো leaders — Quorum দিয়ে prevent করুন',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'CAP Theorem এ Distributed System এ কোনটা sacrifice করা যায় না?',
                options: [
                    {
                        key: 'A',
                        text: 'Consistency — stale data কয়েক seconds চলে',
                        isCorrect: false,
                    },
                    {
                        key: 'B',
                        text: 'Availability — কিছু errors চলে',
                        isCorrect: false,
                    },
                    {
                        key: 'C',
                        text: 'Partition Tolerance — network failure সবসময় হবে',
                        isCorrect: true,
                        explanation:
                            'Distributed system এ network partition inevitable — prevent করা যায় না। তাই P বাদ দেওয়া impossible।',
                    },
                    {
                        key: 'D',
                        text: 'সবগুলোই sacrifice করা যায়',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 2,
                text: 'Cassandra default কোন CAP type?',
                options: [
                    {
                        key: 'A',
                        text: 'CP — always strongly consistent',
                        isCorrect: false,
                    },
                    {
                        key: 'B',
                        text: 'AP — available, eventually consistent (tunable)',
                        isCorrect: true,
                        explanation:
                            'Cassandra default AP। Partition হলেও available থাকে, stale data দিতে পারে। কিন্তু QUORUM বা ALL consistency level দিলে CP এর কাছাকাছি হয়।',
                    },
                    {
                        key: 'C',
                        text: 'CA — consistent and available',
                        isCorrect: false,
                    },
                    { key: 'D', text: 'তিনটোই', isCorrect: false },
                ],
            },
            {
                id: 3,
                text: 'Bank account balance update এর জন্য কোন consistency model choose করবেন?',
                options: [
                    {
                        key: 'A',
                        text: 'Eventual Consistency — fast enough',
                        isCorrect: false,
                    },
                    {
                        key: 'B',
                        text: 'Read-your-writes — নিজে দেখলেই হবে',
                        isCorrect: false,
                    },
                    {
                        key: 'C',
                        text: 'Causal Consistency — causally ordered',
                        isCorrect: false,
                    },
                    {
                        key: 'D',
                        text: 'Strong Consistency — সবাই সবসময় correct balance দেখবেন',
                        isCorrect: true,
                        explanation:
                            'Financial systems এ Strong Consistency mandatory। Double-spending prevent করতে সব nodes এ latest balance দেখাতে হবে।',
                    },
                ],
            },
            {
                id: 4,
                text: 'YouTube এর view counter এর জন্য কোন consistency best?',
                options: [
                    {
                        key: 'A',
                        text: 'Eventual Consistency — approximate count acceptable',
                        isCorrect: true,
                        explanation:
                            '"Approximately 1.2M views" দেখানোই যথেষ্ট। Strong Consistency হলে প্রতিটি view তে সব nodes sync করতে হবে — billions of views এ impossible।',
                    },
                    {
                        key: 'B',
                        text: 'Strong Consistency — exact real-time count দরকার',
                        isCorrect: false,
                    },
                    {
                        key: 'C',
                        text: 'Linearizability — real-time ordering দরকার',
                        isCorrect: false,
                    },
                    {
                        key: 'D',
                        text: 'ACID transaction — atomicity দরকার',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 5,
                text: 'PACELC Theorem CAP এর উপর কি extra add করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Security considerations',
                        isCorrect: false,
                    },
                    { key: 'B', text: 'Storage trade-offs', isCorrect: false },
                    {
                        key: 'C',
                        text: 'Normal operation এও Latency vs Consistency trade-off আছে',
                        isCorrect: true,
                        explanation:
                            'CAP শুধু partition সময়। PACELC বলে partition না হলেও (Else) Latency vs Consistency trade-off থাকে।',
                    },
                    {
                        key: 'D',
                        text: 'Database indexing strategy',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 6,
                text: 'Split-brain problem কি?',
                options: [
                    {
                        key: 'A',
                        text: 'Database index corruption',
                        isCorrect: false,
                    },
                    {
                        key: 'B',
                        text: 'Partition এ দুটো nodes নিজেকে primary মনে করে conflicting state তৈরি করে',
                        isCorrect: true,
                        explanation:
                            'Split-brain: partition হলে দুটো side নিজেকে leader মনে করে আলাদাভাবে write accept করে। Partition heal হলে conflicting state থাকে।',
                    },
                    {
                        key: 'C',
                        text: 'Memory overflow এ process crash',
                        isCorrect: false,
                    },
                    {
                        key: 'D',
                        text: 'CPU bottleneck এ slow queries',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 7,
                text: 'Cassandra তে QUORUM consistency মানে কি?',
                options: [
                    {
                        key: 'A',
                        text: 'শুধু একটা node respond করলেনই হবে',
                        isCorrect: false,
                    },
                    {
                        key: 'B',
                        text: 'সব nodes respond করতে হবে',
                        isCorrect: false,
                    },
                    {
                        key: 'C',
                        text: 'যেকোনো দুটো node respond করলেনই হবে',
                        isCorrect: false,
                    },
                    {
                        key: 'D',
                        text: 'Majority nodes (N/2 + 1) respond করতে হবে',
                        isCorrect: true,
                        explanation:
                            'QUORUM = floor(N/2) + 1। 3 nodes এ QUORUM = 2। একটা node down থাকলেও কাজ করে কিন্তু majority এর agreement নেওয়া হয়।',
                    },
                ],
            },
            {
                id: 8,
                text: 'Read-your-writes consistency কি guarantee করে?',
                options: [
                    {
                        key: 'A',
                        text: 'আপনি নিজের write সবসময় দেখবেন, অন্যরা হয়তো দেখবেন না',
                        isCorrect: true,
                        explanation:
                            'আপনি post করলেন নিজের feed এ সাথে সাথে দেখবেন। কিন্তু friends হয়তো কয়েক seconds পরে দেখবেন। Instagram, Twitter এই model follow করে।',
                    },
                    {
                        key: 'B',
                        text: 'সবাই সবার write সবসময় দেখবেন',
                        isCorrect: false,
                    },
                    {
                        key: 'C',
                        text: 'Write এর আগে read করা যাবেন না',
                        isCorrect: false,
                    },
                    {
                        key: 'D',
                        text: 'Writes automatically rollback হবে',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 9,
                text: 'Eventual Consistency তে conflict resolution এর common strategy?',
                options: [
                    {
                        key: 'A',
                        text: 'First-Write-Wins (FWW)',
                        isCorrect: false,
                    },
                    { key: 'B', text: 'Random selection', isCorrect: false },
                    {
                        key: 'C',
                        text: 'Last-Write-Wins (LWW) based on timestamp',
                        isCorrect: true,
                        explanation:
                            'Last-Write-Wins (LWW): latest timestamp এর value জেতে। Simple কিন্তু clock skew problem আছে।',
                    },
                    {
                        key: 'D',
                        text: 'Alphabetical ordering',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 10,
                text: 'DNS system কোন CAP type?',
                options: [
                    {
                        key: 'A',
                        text: 'CP — always shows latest IP',
                        isCorrect: false,
                    },
                    {
                        key: 'B',
                        text: 'AP — always available, eventually consistent',
                        isCorrect: true,
                        explanation:
                            'DNS classic AP example। Domain update হলে সারা বিশ্বে propagate হতে ২৪-৪৮ ঘণ্টা লাগে। এই সময় কেউ old IP দেখে, কেউ new IP।',
                    },
                    {
                        key: 'C',
                        text: 'CA — consistent and available, no partition',
                        isCorrect: false,
                    },
                    { key: 'D', text: 'CAP এর বাইরে', isCorrect: false },
                ],
            },
        ],
    },
    assignment: {
        title: 'CAP Analysis & Simulation',
        time: '২-৩ ঘণ্টা',
        difficulty: 'Junior Level',
        tasks: [
            <span key='1'>
                <strong>CAP Classification Research:</strong> ৫টি popular
                databases (Redis, MongoDB, DynamoDB, Cassandra, CockroachDB) এর
                official documentation পড়ো। প্রতিটির CAP classification,
                default consistency level, tuning options table আকারে document
                করুন।
            </span>,
            <span key='2'>
                <strong>Scenario Decision Exercise:</strong> নিচের ৫টি systems
                এর জন্য CP নাকি AP choose করবেন এবং কেন লিখুন: (ক) bKash mobile
                payment (খ) Facebook post like count (গ) Online exam seat
                booking (ঘ) Live cricket score update (ঙ) Hospital patient
                records।
            </span>,
            <span key='3'>
                <strong>Eventual Consistency Simulator:</strong> Python বা
                Node.js দিয়ে ৩-node distributed key-value store তৈরি করুন। Write
                করলেন local এ save হবে, background এ peers এ sync হবে (random
                delay)। Last-Write-Wins implement করুন।
            </span>,
            <span key='4'>
                <strong>Cassandra Consistency Test:</strong> Docker এ Cassandra
                run করুন। ONE, QUORUM, ALL consistency level এ same query এর
                response time measure করুন। Latency vs Consistency trade-off
                চার্ট আকারে দেখাও।
            </span>,
            <span key='5'>
                <strong>Phase 1 Reflection:</strong> Scalability, Networking,
                Databases, CAP — এই ৪টা topic থেকে সবচেয়ে important ৫টা concept
                বাছো এবং real-world scenario দিয়ে explain করুন। নিজের ভাষায়।
            </span>,
        ],
        deliverables: [
            <span key='1'>Database CAP classification comparison table</span>,
            <span key='2'>Scenario decisions সহ justification (written)</span>,
            <span key='3'>Eventual Consistency simulator code</span>,
            <span key='4'>Consistency level latency benchmark chart</span>,
            <span key='5'>Phase 1 personal reflection note</span>,
        ],
    },
    practicalLab: {
        title: 'Final Phase Project',
        subtitle: 'Tunable Consistency KV Store',
        steps: [
            {
                title: 'Server Setup',
                description:
                    '৩টা Node.js server (Port 3001, 3002, 3003) তৈরি করুন।',
            },
            {
                title: 'Consistency Level API',
                description: 'PUT /key?consistency=QUORUM implement করুন।',
            },
            {
                title: 'Partition Simulate',
                description: 'একটা node disconnect করে CP vs AP behavior দেখুন।',
            },
        ],
        codeBlock: {
            language: 'javascript',
            filename: 'distributed-node.js',
            code: `app.put('/:key', async (req, res) => {
  const { key } = req.params;
  const consistency = req.query.consistency || 'QUORUM';
  const entry = { value: req.body.value, ts: Date.now() };

  store.set(key, entry);  // Local write
  const needed = { ONE: 0, QUORUM: 1, ALL: PEERS.length }[consistency];
  const acks = await replicateToPeers(key, entry, needed);

  if (acks < needed) return res.status(503).json({ error: 'Insufficient acks' });
  res.json({ ok: true, acks: acks + 1 });
});`,
        },
        tip: 'Actually measure করে দেখুন ONE vs ALL এ latency কতটা difference হয়। এটাই trade-off।',
    },
    phaseComplete: {
        title: 'Phase 1 — Foundations Complete!',
        description:
            'আপনি System Design Mastery Course এর Phase 1 সম্পূর্ণ করেছেনো। চারটি fundamental topic এ solid foundation তৈরি হয়েছে।',
        topics: [
            { title: 'Topic 1: Scalability', id: 'scalability' },
            { title: 'Topic 2: Networking', id: 'networking' },
            { title: 'Topic 3: Databases', id: 'databases' },
            { title: 'Topic 4: CAP Theorem', id: 'cap-theorem' },
        ],
        nextPhase: {
            title: 'PHASE 2 — Next Topics:',
            topics: [
                'Caching Strategies',
                'Message Queues',
                'API Design',
                'Microservices',
                'Rate Limiting',
                'System Design Case Studies',
            ],
        },
    },
};

