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

export const consensusContent: TopicData = {
    id: 'consensus',
    sections: [
        {
            id: 'intro-concept',
            subHeader: { index: '001', title: 'Why It Matters' },
            title: (
                <SectionTitle>
                    Distributed Consensus কেন শিখতে হবে?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                ৩টা server আছে — Server A, B, C। সবাই একই data
                                রাখে। কিন্তু হঠাৎ network problem — A এবং B
                                একটা value দেখছে, C আরেকটা। এখন কোনটা সত্য?
                                কে decide করবেন?
                            </ContentParagraph>
                            <ContentParagraph>
                                এই সমস্যার নাম{' '}
                                <strong className='text-foreground'>
                                    Distributed Consensus Problem
                                </strong>
                                । Multiple nodes কীভাবে একটা single agreed
                                value তে পৌঁছাবে — এটাই consensus। Kubernetes,
                                etcd, Kafka, CockroachDB — সব জায়গায় এটা
                                ব্যবহার হয়।
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
                            <strong>Distributed Consensus</strong> হলো একটা
                            process যেখানে একটা distributed system এর সব nodes
                            একটা single value বা decision এ{' '}
                            <em>agree</em> করে — এমনকি যখন কিছু nodes fail
                            করে বা network partition হয়।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'core-problem',
            subHeader: { index: '002', title: 'The Core Problem' },
            title: (
                <SectionTitle>সমস্যাটা কী?</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                ধরুন আপনি একটা bank এ কাজ করুন। Account balance
                                হলো ১০,০০০ টাকা। ৩টা server এই data replicate
                                করে রাখে। এখন একসাথে দুটো transaction আসলো:
                            </ContentParagraph>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-red-500' />
                                        <span className='text-red-700 dark:text-red-400'>
                                            ❌ Without Consensus
                                        </span>
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        TX1: Debit ৫,০০০ → Server A
                                        <br />
                                        TX2: Debit ৮,০০০ → Server B
                                        <br />
                                        উভয় approve হলো! Balance হলো -৩,০০০!
                                        💸
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-emerald-500' />
                                        <span className='text-emerald-700 dark:text-emerald-400'>
                                            ✅ With Consensus
                                        </span>
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        TX1 এবং TX2 একটা order এ agree করতে
                                        হবে। একটা process হবে, তারপর অন্যটা।
                                        Overdraft impossible।
                                    </p>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mt-16 mb-6'>
                            Byzantine Generals Problem
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Distributed Consensus এর classic problem। কয়েকজন
                            general একটা city attack করবেন — সবাইকে একসাথে
                            attack বা retreat করতে হবে। কিন্তু messenger
                            unreliable, কিছু general traitor হতে পারে। কীভাবে
                            সবাই agree করবেন?
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: 'THE TWO KEY CHALLENGES',
                    content: (
                        <>
                            <strong>1. Fault Tolerance:</strong> কিছু nodes
                            fail করলেনও system চলতে থাকবেন।
                            <br />
                            <strong>2. Consistency:</strong> সব nodes একই data
                            দেখবেন একই সময়ে।
                            <br />
                            <br />
                            CAP Theorem মনে আছে? Distributed system এ
                            Consistency এবং Availability দুটো একসাথে fully
                            পানয়া যায় না। Consensus algorithms এই trade-off
                            manage করে।
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-yellow-700 dark:text-yellow-400 mb-10 mt-20'>
                                QUORUM: Majority Wins
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-yellow-500' />
                                        QUORUM FORMULA
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Quorum = (N / 2) + 1
                                        <br />
                                        ৩ nodes → need 2/3 to agree
                                        <br />
                                        ৫ nodes → need 3/5 to agree
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-blue-500' />
                                        TOLERABLE FAILURES
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Formula: N = 2f + 1
                                        <br />
                                        f = tolerable failures
                                        <br />
                                        ৩ nodes → ১টা fail করলেনও চলবে
                                    </p>
                                </div>
                            </div>
                        </>
                    ),
                },
            ],
        },
        {
            id: 'raft',
            subHeader: { index: '003', title: 'Raft Algorithm' },
            title: (
                <SectionTitle>
                    Raft — Understandable Consensus
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <p className='text-muted-foreground leading-relaxed mb-10 text-lg'>
                            Paxos (পুরনো algorithm) বোঝা খুব কঠিন ছিল। ২০১৪
                            সালে Stanford এর Diego Ongaro এবং John Ousterhout
                            Raft design করলেনন — same guarantees, কিন্তু অনেক
                            বেশি understandable।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-10 mt-4'>
                            Raft এর তিনটা Core Concept
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                            <div className='p-8 border-r border-b border-border bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-yellow-500' />
                                    <span className='text-yellow-700 dark:text-yellow-400'>
                                        👑 Leader Election
                                    </span>
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Cluster এ একটাই Leader থাকে। Leader সব
                                    writes handle করে। Leader fail করলেন নতুন
                                    election হয়।
                                </p>
                            </div>
                            <div className='p-8 border-b border-border bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-blue-500' />
                                    <span className='text-blue-700 dark:text-blue-400'>
                                        📋 Log Replication
                                    </span>
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Leader সব entries তার log এ লেখে। তারপর
                                    Followers কে replicate করে। Majority
                                    acknowledge করলেনই committed।
                                </p>
                            </div>
                            <div className='p-8 border-r border-border bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-emerald-500' />
                                    <span className='text-emerald-700 dark:text-emerald-400'>
                                        🔒 Safety
                                    </span>
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Committed entries কখনো lost হয় না। New
                                    leader এর কাছে সব committed entries
                                    থাকবেনই। Strong guarantee।
                                </p>
                            </div>
                            <div className='p-8 bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-purple-500' />
                                    <span className='text-purple-700 dark:text-purple-400'>
                                        ⏰ Term
                                    </span>
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Raft logical time &quot;Term&quot; ব্যবহার
                                    করে। প্রতিটা election নতুন term শুরু করে।
                                    Stale leader detect করতে term ব্যবহার হয়।
                                </p>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mt-16 mb-6'>
                            Leader Election Process
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    steps: [
                        {
                            title: (
                                <span className='text-blue-700 dark:text-blue-400'>FOLLOWER</span>
                            ),
                            description:
                                'Heartbeat timeout expired → election শুরু করে',
                        },
                        {
                            title: (
                                <span className='text-yellow-700 dark:text-yellow-400'>
                                    CANDIDATE
                                </span>
                            ),
                            description:
                                'নিজেকে vote দেয় এবং অন্য nodes এর কাছে vote request পাঠায়',
                        },
                        {
                            title: (
                                <span className='text-emerald-700 dark:text-emerald-400'>
                                    MAJORITY VOTE
                                </span>
                            ),
                            description:
                                '2/3 nodes "YES" বললে quorum reached — decision confirmed',
                        },
                        {
                            title: (
                                <span className='text-yellow-700 dark:text-yellow-400'>
                                    LEADER 👑
                                </span>
                            ),
                            description:
                                'Heartbeat পাঠায় followers কে। সব writes handle করে।',
                        },
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'HEARTBEAT MECHANISM',
                    content: (
                        <>
                            Leader প্রতি few milliseconds এ Followers কে
                            heartbeat পাঠায়। Follower যদি একটা নির্দিষ্ট সময়ের
                            মধ্যে heartbeat না পায়, সে ধরে নেয় Leader dead।
                            তখন election শুরু হয়। এই timeout হলো{' '}
                            <strong>election timeout</strong> (150ms–300ms)।
                        </>
                    ),
                },
            ],
        },
        {
            id: 'zookeeper',
            subHeader: { index: '004', title: 'ZooKeeper' },
            title: (
                <SectionTitle>
                    Apache ZooKeeper — Coordination Service
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <p className='text-muted-foreground leading-relaxed mb-10 text-lg'>
                            ZooKeeper হলো Apache এর একটা distributed
                            coordination service। এটা নিজে Zab (ZooKeeper
                            Atomic Broadcast) protocol ব্যবহার করে — Raft এর
                            মতোই একটা consensus algorithm।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-10 mt-4'>
                            ZooKeeper কী কী করে?
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                            <div className='p-8 border-r border-b border-border bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-blue-500' />
                                    <span className='text-blue-700 dark:text-blue-400'>
                                        🔐 Distributed Locking
                                    </span>
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Multiple servers এর মধ্যে lock coordinate
                                    করুন। একটাই server কোনো resource access
                                    করবেন।
                                </p>
                            </div>
                            <div className='p-8 border-b border-border bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-purple-500' />
                                    <span className='text-purple-700 dark:text-purple-400'>
                                        📋 Configuration Management
                                    </span>
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    সব services এর config ZooKeeper এ রাখুন।
                                    Config change হলে সব services automatically
                                    update পাবেন।
                                </p>
                            </div>
                            <div className='p-8 border-r border-border bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-yellow-500' />
                                    <span className='text-yellow-700 dark:text-yellow-400'>
                                        🏃 Leader Election
                                    </span>
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Kafka, HBase তাদের leader election
                                    ZooKeeper দিয়ে করে (পুরনো version)।
                                </p>
                            </div>
                            <div className='p-8 bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-emerald-500' />
                                    <span className='text-emerald-700 dark:text-emerald-400'>
                                        📡 Service Registry
                                    </span>
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Services তাদের health status ZooKeeper এ
                                    register করে। Service down হলে automatically
                                    remove।
                                </p>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: 'ZOOKEEPER VS ETCD VS CONSUL',
                    content: (
                        <>
                            <strong>ZooKeeper:</strong> Kafka এর পুরনো setup এ,
                            Java-based, complex
                            <br />
                            <strong>etcd:</strong> Kubernetes এর brain। Raft
                            ব্যবহার করে। Simple key-value store। Modern choice।
                            <br />
                            <strong>Consul:</strong> Service discovery + health
                            checking + KV store। HashiCorp এর product।
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Feature', 'ZooKeeper', 'etcd', 'Consul'],
                    rows: [
                        ['Algorithm', 'Zab (Paxos-like)', 'Raft', 'Raft'],
                        ['Language', 'Java', 'Go', 'Go'],
                        [
                            'Use in',
                            'Kafka (old), HBase',
                            'Kubernetes',
                            'HashiCorp stack',
                        ],
                        [
                            'Complexity',
                            <span className='text-red-700 dark:text-red-400'>High</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Low
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>Medium</span>,
                        ],
                        [
                            'Watch/Events',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Yes
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Yes
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Yes
                            </span>,
                        ],
                        [
                            'Production 2024',
                            <span className='text-yellow-700 dark:text-yellow-400'>Legacy</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Preferred
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Preferred
                            </span>,
                        ],
                    ],
                },
            ],
        },
        {
            id: 'code',
            subHeader: { index: '005', title: 'Code Examples' },
            title: (
                <SectionTitle>Practical Code</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mb-6'>
                            Python: Raft Concept Simulation
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'raft_simulation.py',
                    code: `import random
import time
from enum import Enum

class NodeState(Enum):
    FOLLOWER = "follower"
    CANDIDATE = "candidate"
    LEADER = "leader"

class RaftNode:
    def __init__(self, node_id, cluster_size):
        self.node_id = node_id
        self.state = NodeState.FOLLOWER
        self.current_term = 0
        self.voted_for = None
        self.log = []  # List of (term, value) tuples
        self.commit_index = -1
        self.cluster_size = cluster_size
        self.votes_received = 0

    def start_election(self):
        """Follower timeout হলে election শুরু করে"""
        self.state = NodeState.CANDIDATE
        self.current_term += 1
        self.voted_for = self.node_id  # নিজেকে vote
        self.votes_received = 1
        print(f"Node {self.node_id}: Starting election for term {self.current_term}")

    def receive_vote(self, from_node, term, vote_granted):
        if term == self.current_term and self.state == NodeState.CANDIDATE:
            if vote_granted:
                self.votes_received += 1
                quorum = (self.cluster_size // 2) + 1
                if self.votes_received >= quorum:
                    self.become_leader()

    def become_leader(self):
        self.state = NodeState.LEADER
        print(f"✅ Node {self.node_id}: Became LEADER for term {self.current_term}")
        print(f"   Votes: {self.votes_received}/{self.cluster_size}")

    def append_entry(self, value):
        """Leader শুধু এটা call করতে পারে"""
        if self.state != NodeState.LEADER:
            raise Exception("Only leader can append entries")
        self.log.append((self.current_term, value))
        print(f"Leader Node {self.node_id}: Appended '{value}' to log")

# Simulation
nodes = [RaftNode(i, 5) for i in range(5)]

# Node 2 starts election
nodes[2].start_election()

# 3 nodes vote yes (quorum = 3/5)
nodes[2].receive_vote(0, 1, True)
nodes[2].receive_vote(1, 1, True)
nodes[2].receive_vote(3, 1, True)  # This triggers becoming leader

# Leader now writes
nodes[2].append_entry("balance=10000")
nodes[2].append_entry("transfer=5000")`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mt-16 mb-6'>
                            Node.js: etcd দিয়ে Distributed Lock
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'distributed_lock.js',
                    code: `// npm install etcd3
const { Etcd3 } = require('etcd3');

const client = new Etcd3({ hosts: 'localhost:2379' });

async function processOrderWithLock(orderId) {
    // Distributed lock — শুধু একটা server এই order process করবেন
    const lock = client.lock(\`order/\${orderId}\`);

    try {
        await lock.acquire();
        console.log(\`🔒 Lock acquired for order \${orderId}\`);

        // Critical section — duplicate processing impossible
        const existing = await client.get(\`processed/\${orderId}\`);
        if (existing) {
            console.log(\`⚠️ Order \${orderId} already processed!\`);
            return;
        }

        // Process the order
        console.log(\`✅ Processing order \${orderId}...\`);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mark as processed
        await client.put(\`processed/\${orderId}\`).value('true');
        console.log(\`🎉 Order \${orderId} processed successfully!\`);

    } finally {
        await lock.release();
        console.log(\`🔓 Lock released for order \${orderId}\`);
    }
}

// Multiple services try to process same order simultaneously
// Only ONE will succeed due to distributed lock
Promise.all([
    processOrderWithLock('order-123'),
    processOrderWithLock('order-123'),  // Duplicate — will be blocked
    processOrderWithLock('order-123'),  // Duplicate — will be blocked
]);`,
                },
            ],
        },
        {
            id: 'realworld',
            subHeader: { index: '006', title: 'Real World' },
            title: (
                <SectionTitle>
                    Real World <span className='italic'>Use Cases</span>
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                            <div className='space-y-4'>
                                <h3 className='text-lg font-bold flex items-center gap-2'>
                                    ☸️ Kubernetes (etcd)
                                </h3>
                                <p className='text-muted-foreground leading-relaxed italic'>
                                    Kubernetes এর সব cluster state etcd তে
                                    থাকে। Raft দিয়ে 3-5 etcd nodes consensus
                                    maintain করে। etcd down হলে K8s cluster
                                    কাজ করে না।
                                </p>
                            </div>
                            <div className='space-y-4'>
                                <h3 className='text-lg font-bold flex items-center gap-2'>
                                    📨 Apache Kafka
                                </h3>
                                <p className='text-muted-foreground leading-relaxed italic'>
                                    KRaft mode এ Kafka নিজেই Raft ব্যবহার করে।
                                    আগে ZooKeeper লাগতো। Kafka 3.3+ এ
                                    ZooKeeper deprecated।
                                </p>
                            </div>
                            <div className='space-y-4'>
                                <h3 className='text-lg font-bold flex items-center gap-2'>
                                    🗄️ CockroachDB
                                </h3>
                                <p className='text-muted-foreground leading-relaxed italic'>
                                    Distributed SQL database। প্রতিটা range এর
                                    জন্য Raft group। Globally distributed
                                    consistency। Google Spanner এর open source
                                    alternative।
                                </p>
                            </div>
                            <div className='space-y-4'>
                                <h3 className='text-lg font-bold flex items-center gap-2'>
                                    🔐 HashiCorp Vault
                                </h3>
                                <p className='text-muted-foreground leading-relaxed italic'>
                                    Secrets management। Raft storage backend।
                                    HA mode এ একটা Vault cluster এর সব nodes
                                    consensus maintain করে।
                                </p>
                            </div>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'interview',
            subHeader: { index: '007', title: 'Interview Preparation' },
            title: (
                <SectionTitle>
                    Common Interview Questions
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '🎯 Q1: Raft এবং Paxos এর পার্থক্য কী?',
                    content: (
                        <>
                            <strong>Answer:</strong> উভয়ই consensus algorithms।
                            Paxos theoretically proven কিন্তু implement করা
                            কঠিন। Raft explicitly understandability এর জন্য
                            designed — Leader, Log, Safety তিনটা clearly
                            defined sub-problem। Production এ Raft বেশি ব্যবহার
                            হয় (etcd, CockroachDB, TiKV)।
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '🎯 Q2: Quorum কী? ৩ nodes এ কতটা fail করলেন চলবে?',
                    content: (
                        <>
                            <strong>Answer:</strong> Quorum = majority = (N/2) +
                            1। ৩ nodes এ quorum = 2। মানে ১টা fail করলেনও
                            চলবে। ৫ nodes এ quorum = 3, মানে ২টা fail করলেনও
                            চলবে। ফর্মুলা: N = 2f + 1, যেখানে f = tolerable
                            failures।
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '🎯 Q3: Split Brain কী?',
                    content: (
                        <>
                            <strong>Answer:</strong> Network partition হলে
                            cluster দুই ভাগে ভাগ হয়ে দুটো আলাদা leader elect
                            করতে পারে। এটাই Split Brain। Raft এটা prevent করে
                            quorum requirement দিয়ে — minority partition কোনো
                            decision নিতে পারে না।
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: 'INTERVIEW এ এটা বলুন',
                    content: (
                        <>
                            &quot;Distributed system design এ আমি consensus এর
                            জন্য etcd prefer করি কারণ এটা Raft-based, simple,
                            এবং production-proven। Kubernetes এর brain হিসেবে
                            etcd এর reliability proven। ZooKeeper legacy choice
                            এখন।&quot; — এটাই সঠিক industry approach।
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
                <span className='font-bold text-primary'>Consensus</span>,
                'Distributed nodes এর agreement on single value',
            ],
            [
                <span className='font-bold text-primary'>Raft</span>,
                'Understandable consensus — Leader, Log, Safety',
            ],
            [
                <span className='font-bold text-primary'>Quorum</span>,
                'Majority (N/2 + 1) agree করলেনই committed',
            ],
            [
                <span className='font-bold text-primary'>
                    Leader Election
                </span>,
                'Timeout → Candidate → Vote → Leader',
            ],
            [
                <span className='font-bold text-primary'>etcd</span>,
                'Kubernetes এর brain, Raft-based KV store',
            ],
            [
                <span className='font-bold text-primary'>ZooKeeper</span>,
                'Legacy coordination service, Kafka এ ছিল',
            ],
            [
                <span className='font-bold text-primary'>Split Brain</span>,
                'Quorum দিয়ে prevent করা হয়',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'Distributed Consensus এর মূল সমস্যা কোনটি?',
                options: [
                    {
                        key: 'A',
                        text: 'Database query optimize করা',
                        isCorrect: false,
                        explanation:
                            'Database query optimization consensus এর সাথে সম্পর্কিত নয়।',
                    },
                    {
                        key: 'B',
                        text: 'Multiple nodes একটা single agreed value তে পৌঁছানো',
                        isCorrect: true,
                        explanation:
                            'Consensus মানে agreement। Distributed system এ কিছু nodes fail করতে পারে, network partition হতে পারে — তবুও সব nodes একটা value এ agree করবেন। এটাই fundamental challenge।',
                    },
                    {
                        key: 'C',
                        text: 'Network bandwidth বাড়ানো',
                        isCorrect: false,
                        explanation:
                            'Network bandwidth বাড়ানো consensus এর problem নয়।',
                    },
                    {
                        key: 'D',
                        text: 'CPU usage কমানো',
                        isCorrect: false,
                        explanation: 'CPU usage কমানো performance optimization।',
                    },
                ],
            },
            {
                id: 2,
                text: '৫টা nodes এর একটা Raft cluster এ Quorum কত?',
                options: [
                    {
                        key: 'A',
                        text: '২',
                        isCorrect: false,
                        explanation:
                            '২ হলো minority — ৫ nodes এ এটা quorum নয়।',
                    },
                    {
                        key: 'B',
                        text: '২.৫',
                        isCorrect: false,
                        explanation: 'Quorum সবসময় integer হয়।',
                    },
                    {
                        key: 'C',
                        text: '৩',
                        isCorrect: true,
                        explanation:
                            'Quorum = (N/2) + 1 = (5/2) + 1 = 2.5 + 1 = 3.5 → floor = 3। ৫ nodes এ ৩টা agree করলেনই quorum। মানে ২টা fail করলেনও cluster চলবে।',
                    },
                    {
                        key: 'D',
                        text: '৫',
                        isCorrect: false,
                        explanation:
                            'সবাইকে agree করতে হলে fault tolerance থাকে না।',
                    },
                ],
            },
            {
                id: 3,
                text: 'Raft এ Leader কীভাবে তার authority maintain করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Regular heartbeat messages পাঠিয়ে followers কে alive জানায়',
                        isCorrect: true,
                        explanation:
                            'Leader প্রতি few milliseconds এ heartbeat পাঠায়। Follower নির্দিষ্ট সময়ের মধ্যে heartbeat না পেলে leader dead ধরে election শুরু করে।',
                    },
                    {
                        key: 'B',
                        text: 'প্রতি second এ নতুন election করে',
                        isCorrect: false,
                        explanation:
                            'Election শুধু leader fail হলে হয়, প্রতি second এ নয়।',
                    },
                    {
                        key: 'C',
                        text: 'Database এ leader flag set করে',
                        isCorrect: false,
                        explanation:
                            'Raft এ database flag নেই — heartbeat mechanism ব্যবহার হয়।',
                    },
                    {
                        key: 'D',
                        text: 'Followers কে lock করে রাখে',
                        isCorrect: false,
                        explanation:
                            'Followers কে lock করা হয় না — heartbeat দিয়ে alive জানায়।',
                    },
                ],
            },
            {
                id: 4,
                text: 'Kubernetes কোন consensus tool ব্যবহার করে?',
                options: [
                    {
                        key: 'A',
                        text: 'ZooKeeper',
                        isCorrect: false,
                        explanation:
                            'ZooKeeper Kafka এ ব্যবহার হতো (পুরনো version), Kubernetes এ নয়।',
                    },
                    {
                        key: 'B',
                        text: 'Consul',
                        isCorrect: false,
                        explanation:
                            'Consul HashiCorp stack এ ব্যবহার হয়, Kubernetes এ নয়।',
                    },
                    {
                        key: 'C',
                        text: 'Redis',
                        isCorrect: false,
                        explanation:
                            'Redis caching এর জন্য, consensus এর জন্য নয়।',
                    },
                    {
                        key: 'D',
                        text: 'etcd',
                        isCorrect: true,
                        explanation:
                            'etcd হলো Kubernetes এর core data store। সব cluster state (pods, deployments, services) etcd তে থাকে। etcd Raft algorithm ব্যবহার করে।',
                    },
                ],
            },
            {
                id: 5,
                text: 'Split Brain problem কখন হয়?',
                options: [
                    {
                        key: 'A',
                        text: 'Server এর CPU overload হলে',
                        isCorrect: false,
                        explanation:
                            'CPU overload split brain তৈরি করে না।',
                    },
                    {
                        key: 'B',
                        text: 'Network partition এ cluster দুই ভাগে ভাগ হয়ে দুটো leader elect করলেন',
                        isCorrect: true,
                        explanation:
                            'Split Brain = একটা cluster দুটো ভাগে ভাগ হয়ে দুটো আলাদা leader। দুটো inconsistent decision নেয়। Raft quorum requirement দিয়ে এটা prevent করে — minority partition কোনো decision নিতে পারে না।',
                    },
                    {
                        key: 'C',
                        text: 'Database corrupt হলে',
                        isCorrect: false,
                        explanation:
                            'Database corruption আলাদা সমস্যা।',
                    },
                    {
                        key: 'D',
                        text: 'Memory full হলে',
                        isCorrect: false,
                        explanation: 'Memory full হওয়া আলাদা সমস্যা।',
                    },
                ],
            },
            {
                id: 6,
                text: 'Raft কে Paxos এর চেয়ে বেশি ব্যবহার করা হয় কেন?',
                options: [
                    {
                        key: 'A',
                        text: 'Raft faster',
                        isCorrect: false,
                        explanation:
                            'Speed পার্থক্য মূল কারণ নয়।',
                    },
                    {
                        key: 'B',
                        text: 'Raft less storage use করে',
                        isCorrect: false,
                        explanation: 'Storage পার্থক্য মূল কারণ নয়।',
                    },
                    {
                        key: 'C',
                        text: 'Raft বোঝা এবং implement করা অনেক সহজ',
                        isCorrect: true,
                        explanation:
                            'Raft explicitly understandability এর জন্য designed। Paxos theoretically sound কিন্তু notoriously difficult to implement correctly। "Raft: In Search of an Understandable Consensus Algorithm" — এটাই paper এর title ছিল।',
                    },
                    {
                        key: 'D',
                        text: 'Raft কম bandwidth use করে',
                        isCorrect: false,
                        explanation: 'Bandwidth পার্থক্য মূল কারণ নয়।',
                    },
                ],
            },
            {
                id: 7,
                text: 'Distributed Lock কেন দরকার?',
                options: [
                    {
                        key: 'A',
                        text: 'Multiple servers যাতে একই resource simultaneously access না করে',
                        isCorrect: true,
                        explanation:
                            'Payment processing তে একটা order দুইবার process হওয়া রোধ করতে distributed lock ব্যবহার হয়। Single server এ thread lock যা করে, distributed এ etcd/Redis lock সেটা করে।',
                    },
                    {
                        key: 'B',
                        text: 'Database connection pool manage করতে',
                        isCorrect: false,
                        explanation:
                            'Connection pool management আলাদা concept।',
                    },
                    {
                        key: 'C',
                        text: 'Network traffic কমাতে',
                        isCorrect: false,
                        explanation: 'Traffic reduction distributed lock এর উদ্দেশ্য নয়।',
                    },
                    {
                        key: 'D',
                        text: 'File compression করতে',
                        isCorrect: false,
                        explanation: 'File compression এর সাথে সম্পর্ক নেই।',
                    },
                ],
            },
            {
                id: 8,
                text: 'Raft এ "Term" কী represent করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Server এর uptime',
                        isCorrect: false,
                        explanation: 'Uptime এর সাথে term এর সম্পর্ক নেই।',
                    },
                    {
                        key: 'B',
                        text: 'Transaction count',
                        isCorrect: false,
                        explanation: 'Transaction count term নয়।',
                    },
                    {
                        key: 'C',
                        text: 'Data size',
                        isCorrect: false,
                        explanation: 'Data size term নয়।',
                    },
                    {
                        key: 'D',
                        text: 'Logical time — প্রতিটা election নতুন term শুরু করে',
                        isCorrect: true,
                        explanation:
                            'Term হলো Raft এর logical clock। প্রতিটা election একটা নতুন term শুরু করে। Stale leader কে detect করতে term ব্যবহার হয় — lower term এর message reject হয়।',
                    },
                ],
            },
            {
                id: 9,
                text: 'Kafka এর নতুন version (3.3+) এ ZooKeeper replace করা হয়েছে কী দিয়ে?',
                options: [
                    {
                        key: 'A',
                        text: 'etcd',
                        isCorrect: false,
                        explanation: 'etcd Kubernetes ব্যবহার করে, Kafka নয়।',
                    },
                    {
                        key: 'B',
                        text: "KRaft (Kafka's own Raft implementation)",
                        isCorrect: true,
                        explanation:
                            'Kafka KIP-500 এ ZooKeeper dependency remove করা হয়েছে। KRaft (Kafka Raft) mode এ Kafka নিজেই Raft implement করে। এটা simpler, faster, এবং ZooKeeper dependency ছাড়া।',
                    },
                    {
                        key: 'C',
                        text: 'Consul',
                        isCorrect: false,
                        explanation: 'Consul HashiCorp stack এ ব্যবহার হয়।',
                    },
                    {
                        key: 'D',
                        text: 'Redis',
                        isCorrect: false,
                        explanation: 'Redis caching এর জন্য ব্যবহার হয়।',
                    },
                ],
            },
            {
                id: 10,
                text: 'একটা ৩-node cluster এ কতটা node fail হলেও system available থাকবেন?',
                options: [
                    {
                        key: 'A',
                        text: '০টা',
                        isCorrect: false,
                        explanation:
                            '০টা fail মানে সব nodes চালু — quorum সহজেই পূরণ হয়, কিন্তু এটা tolerance নয়।',
                    },
                    {
                        key: 'B',
                        text: '২টা',
                        isCorrect: false,
                        explanation:
                            '২টা fail হলে শুধু ১টা বাকি — quorum = 2, তাই system unavailable।',
                    },
                    {
                        key: 'C',
                        text: '১টা',
                        isCorrect: true,
                        explanation:
                            '৩-node cluster এ quorum = 2। ১টা fail হলে ২টা বাকি থাকে যা quorum পূরণ করে। ২টা fail হলে শুধু ১টা থাকে — quorum পূরণ হয় না, system unavailable। Formula: tolerable failures = (N-1)/2 = 1।',
                    },
                    {
                        key: 'D',
                        text: '৩টা',
                        isCorrect: false,
                        explanation: '৩টাই fail হলে কোনো node নেই — cluster dead।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'Consensus Analysis & Implementation',
        time: '২-৩ ঘণ্টা',
        difficulty: 'Junior Level',
        tasks: [
            <span key='1'>
                <strong>Quorum Calculation:</strong> নিচের cluster sizes এর
                জন্য quorum, tolerable failures, এবং minimum odd nodes
                calculate করুন: ৩, ৫, ৭, ৯, ১১। Table আকারে লিখুন।
            </span>,
            <span key='2'>
                <strong>Raft Visualization:</strong> raft.github.io website এ
                গিয়ে interactive Raft simulation দেখুন। Leader fail করুন, নতুন
                election observe করুন। কী দেখলে ৫ লাইনে লিখুন।
            </span>,
            <span key='3'>
                <strong>Code Extension:</strong> দেওয়া Python Raft simulation
                তে একটা <code>handle_leader_failure()</code> method যোগ করুন
                যেটা leader fail হলে নতুন election trigger করবেন।
            </span>,
            <span key='4'>
                <strong>Research:</strong> CockroachDB documentation পড়ো —
                তারা কীভাবে Raft use করে। ৩-৪ লাইনে summary লিখুন।
            </span>,
            <span key='5'>
                <strong>Comparison:</strong> আপনি যদি একটা payment system
                design করুন তাহলে etcd, Consul, বা ZooKeeper — কোনটা use করবেন
                এবং কেন? Justify করুন।
            </span>,
        ],
        deliverables: [
            <span key='1'>Quorum calculation table</span>,
            <span key='2'>Raft simulation observation notes</span>,
            <span key='3'>
                Extended Python code with leader failure handling
            </span>,
            <span key='4'>CockroachDB research summary</span>,
            <span key='5'>Tool selection justification</span>,
        ],
    },
    practicalLab: {
        title: 'Hands-On Project Task',
        subtitle: 'etcd Distributed Config Store',
        steps: [
            {
                title: 'etcd single node চালাও',
                description: (
                    <>
                        <code>
                            docker run -d --name etcd -p 2379:2379
                            bitnami/etcd:latest
                        </code>
                    </>
                ),
            },
            {
                title: 'Config values set করুন',
                description: (
                    <>
                        <code>
                            docker exec etcd etcdctl put /config/db_host
                            &quot;localhost&quot;
                        </code>{' '}
                        এবং আরো কিছু config set করুন।
                    </>
                ),
            },
            {
                title: 'Python দিয়ে watch করুন',
                description:
                    'etcd3 Python library দিয়ে config changes watch করার script লিখুন।',
            },
            {
                title: 'Config change করুন',
                description:
                    'etcdctl দিয়ে একটা config change করুন — Python watcher automatically detect করবেন কিনা দেখুন।',
            },
            {
                title: 'Bonus: 3-node cluster',
                description:
                    'docker-compose দিয়ে ৩-node etcd cluster চালাও। একটা node kill করুন — cluster চলে কিনা দেখুন।',
            },
        ],
        codeBlock: {
            language: 'python',
            filename: 'etcd_watcher.py',
            code: `# pip install etcd3
import etcd3

client = etcd3.client(host='localhost', port=2379)

# Config set করুন
client.put('/config/db_host', 'localhost')
client.put('/config/db_port', '5432')
client.put('/config/cache_ttl', '300')

print("✅ Config values set করা হয়েছে")

# সব config read করুন
for value, metadata in client.get_prefix('/config/'):
    print(f"Key: {metadata.key.decode()}, Value: {value.decode()}")

# Watch করুন — config change হলে automatically notify হবে
print("\\n👀 Watching for config changes...")

events_iterator, cancel = client.watch_prefix('/config/')
for event in events_iterator:
    print(f"🔔 Config changed!")
    print(f"   Key: {event.key.decode()}")
    print(f"   New Value: {event.value.decode()}")
    # এখানে app এর config reload করুন
    break  # Demo তে একটা event দেখেই বন্ধ করুন`,
        },
        tip: 'Theoretical না — actually দেখবেন etcd কীভাবে distributed config store হিসেবে কাজ করে। Real Kubernetes cluster এর brain কীভাবে কাজ করে সেটা বুঝবেন।',
    },
};
