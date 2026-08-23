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

export const resilienceContent: TopicData = {
    id: 'resilience',
    sections: [
        {
            id: 'intro-concept',
            subHeader: { index: '001', title: 'Why It Matters' },
            title: (
                <SectionTitle>
                    Resilience কেন শিখতে হবে?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                আপনার e-commerce app এ Payment service কাজ করছে
                                না। কিন্তু Payment service down থাকলেই কি পুরো
                                app down হওয়া উচিত? User কি product browse করতে
                                পারবেন না?
                            </ContentParagraph>
                            <ContentParagraph>
                                Distributed system এ{' '}
                                <strong className='text-foreground'>
                                    Cascading Failure
                                </strong>{' '}
                                সবচেয়ে ভয়ানক সমস্যা। একটা service slow হলে
                                সেটা অন্য services কে block করে — সব collapse
                                করে। Circuit Breaker এই cascade থামায়।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: 'Real Incident',
                    content: (
                        <p>
                            Amazon Prime Day 2018 এ প্রথম ঘণ্টায় checkout down
                            ছিল। একটা downstream service timeout করছিল এবং সেই
                            timeout অন্য services কে block করছিল। Circuit
                            Breaker থাকলে এটা prevent করা যেত।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'DEFINITION',
                    content: (
                        <p>
                            <strong>Circuit Breaker</strong> কাজ করে electrical
                            circuit breaker এর মতো। যখন কোনো service এ অনেক
                            বেশি failure হয়, circuit breaker সেই service এ call
                            করা বন্ধ করে দেয় — fast failure দেয়, cascade রোধ
                            করে, fallback response দেয়।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'cb-states',
            subHeader: { index: '002', title: 'Circuit Breaker States' },
            title: (
                <SectionTitle>
                    তিনটা State — বুঝে রাখুন
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-emerald-500' />
                                        STATE{' '}
                                        <span className='text-emerald-700 dark:text-emerald-400'>
                                            🟢 CLOSED
                                        </span>
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Normal operation। সব requests pass।
                                        Failure count track হচ্ছে। Threshold
                                        পার হলে OPEN।
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-red-500' />
                                        STATE{' '}
                                        <span className='text-red-700 dark:text-red-400'>
                                            🔴 OPEN
                                        </span>
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Circuit broken। কোনো request downstream
                                        যাচ্ছে না। Fast fail + fallback।
                                        Timeout পরে HALF-OPEN।
                                    </p>
                                </div>
                            </div>
                            <div className='grid grid-cols-1 gap-0 border border-t-0 border-border'>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-yellow-500' />
                                        STATE{' '}
                                        <span className='text-yellow-700 dark:text-yellow-400'>
                                            🟡 HALF-OPEN
                                        </span>
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Test phase। কিছু requests allow। Success
                                        → CLOSED। Failure → OPEN আবার।
                                    </p>
                                </div>
                            </div>
                            <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-6 mt-16'>
                                Typical Thresholds &amp; Fast Fail Benefits
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-blue-500' />
                                        Typical Thresholds
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        ৫ seconds এ ৫০% failure rate → OPEN।
                                        ৩০ seconds পর → HALF-OPEN। ৩টা success
                                        → CLOSED। এগুলো configurable।
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-purple-500' />
                                        Fast Fail Benefits
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        OPEN state এ thread waste হয় না।
                                        Downstream এ load পড়ে না। User কে
                                        instant response দেওয়া যায়। System
                                        recover করার সুযোগ পায়।
                                    </p>
                                </div>
                            </div>
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['State', 'অবস্থা', 'পরবর্তী Transition'],
                    rows: [
                        [
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                🟢 CLOSED
                            </span>,
                            'Normal — সব requests pass',
                            'Failure threshold exceed → OPEN',
                        ],
                        [
                            <span className='text-red-700 dark:text-red-400 font-bold'>
                                🔴 OPEN
                            </span>,
                            'Broken — fast fail, fallback',
                            'Recovery timeout পর → HALF-OPEN',
                        ],
                        [
                            <span className='text-yellow-700 dark:text-yellow-400 font-bold'>
                                🟡 HALF-OPEN
                            </span>,
                            'Testing — probe requests',
                            'Success → CLOSED | Fail → OPEN',
                        ],
                    ],
                },
            ],
        },
        {
            id: 'resilience-patterns',
            subHeader: { index: '003', title: 'Resilience Patterns' },
            title: (
                <SectionTitle>
                    Circuit Breaker ছাড়াও আরো Patterns
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xl font-bold mb-4'>
                                1. Retry Pattern — Transient Failure Handle করুন
                            </h3>
                            <p className='text-muted-foreground leading-relaxed mb-6 text-lg'>
                                Network blip, temporary overload — এই ধরনের
                                transient failure এ একবার fail করলেনই দিয়ে দেওয়া
                                ঠিক না। কয়েকবার try করুন।
                            </p>
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: 'Retry Storm Problem',
                    content: (
                        <p>
                            সব clients একসাথে retry করলেন failing service এ আরো
                            বেশি load পড়ে। সমাধান:{' '}
                            <strong>Exponential Backoff + Jitter</strong> —
                            প্রতিটা retry তে wait time বাড়াও (100ms → 200ms →
                            400ms) এবং random jitter যোগ করুন।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xl font-bold mt-12 mb-4'>
                                2. Bulkhead Pattern — Isolate করুন
                            </h3>
                            <p className='text-muted-foreground leading-relaxed mb-6 text-lg'>
                                জাহাজের watertight compartment এর মতো। Thread
                                pools, connection pools কে isolate করুন। Payment
                                thread pool full হলেও Search pool available
                                থাকে।
                            </p>
                            <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-purple-700 dark:text-purple-400 mb-6 mt-8'>
                                Bulkhead: Isolated Thread Pools
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-red-500' />
                                        Payment Pool (10 threads)
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                            3/10 busy ✅
                                        </span>{' '}
                                        — Isolated, safe।
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-emerald-500' />
                                        Search Pool (8 threads)
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                            1/8 busy ✅
                                        </span>{' '}
                                        — Completely unaffected!
                                    </p>
                                </div>
                            </div>
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xl font-bold mt-12 mb-4'>
                                3. Timeout Pattern — Forever Block করুন না
                            </h3>
                            <p className='text-muted-foreground leading-relaxed mb-6 text-lg'>
                                Service response এর জন্য কতক্ষণ wait করবেন
                                define করুন। ৩০ seconds thread block করা
                                catastrophic। Typical values: ৫০০ms–২০০০ms।
                                SLA এর ৩x হওয়া উচিত।
                            </p>
                            <h3 className='text-xl font-bold mt-12 mb-4'>
                                4. Fallback Pattern — Graceful Degradation
                            </h3>
                            <p className='text-muted-foreground leading-relaxed mb-6 text-lg'>
                                Service fail করলেন alternative response দিন।
                                Recommendation service down? Popular products
                                দেখাও। Search down? Cached results দেখাও।
                                এটাই graceful degradation।
                            </p>
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                            <div className='p-8 border-r border-border bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-red-500' />
                                    Netflix Fallback
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Recommendation service down → &quot;Popular
                                    in your area&quot; দেখায়। User experience
                                    maintain হয়। Service recover হলে
                                    personalized আবার শুরু।
                                </p>
                            </div>
                            <div className='p-8 bg-card/30'>
                                <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                    <span className='w-1.5 h-1.5 bg-blue-500' />
                                    Amazon Fallback
                                </h4>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Review service down → Cached reviews
                                    দেখায়। Inventory service slow → Stale
                                    stock count দেখায়। Order process চলতে
                                    থাকে।
                                </p>
                            </div>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'code-examples',
            subHeader: { index: '004', title: 'Code Examples' },
            title: (
                <SectionTitle>Practical Code</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mb-6'>
                            Python: Circuit Breaker Class
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'circuit_breaker.py',
                    code: `import time
from enum import Enum

class State(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

class CircuitBreaker:
    def __init__(self, failure_threshold=5, recovery_timeout=30):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.state = State.CLOSED
        self.failure_count = 0
        self.success_count = 0
        self.last_failure_time = None

    def call(self, func, *args, fallback=None, **kwargs):
        # OPEN state check
        if self.state == State.OPEN:
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = State.HALF_OPEN
                print("🟡 HALF-OPEN: Testing service...")
            else:
                print("🔴 OPEN: Fast fail!")
                return fallback() if fallback else None

        try:
            result = func(*args, **kwargs)
            self._handle_success()
            return result
        except Exception as e:
            self._handle_failure()
            return fallback() if fallback else None

    def _handle_success(self):
        if self.state == State.HALF_OPEN:
            self.success_count += 1
            if self.success_count >= 2:
                self.state = State.CLOSED
                self.failure_count = self.success_count = 0
                print("🟢 CLOSED: Service recovered!")

    def _handle_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        if self.failure_count >= self.failure_threshold:
            self.state = State.OPEN
            print(f"🔴 OPEN: {self.failure_count} failures!")

# Usage
cb = CircuitBreaker(failure_threshold=3)

def payment_call():
    raise Exception("Payment down!")

def fallback():
    return {"status": "pending", "msg": "Processing soon"}

for i in range(5):
    result = cb.call(payment_call, fallback=fallback)
    print(f"Attempt {i+1}:", result)`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mt-12 mb-6'>
                            Node.js: Retry with Exponential Backoff + Jitter
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'retry_backoff.js',
                    code: `async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 100) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            if (attempt === maxRetries) throw err;
            // Exponential Backoff: 100 → 200 → 400ms
            const delay = baseDelay * Math.pow(2, attempt - 1);
            // Jitter: random 0-100ms extra (prevent thundering herd)
            const jitter = Math.random() * 100;
            console.log(\`❌ Attempt \${attempt} failed. Wait \${(delay+jitter).toFixed(0)}ms...\`);
            await new Promise(r => setTimeout(r, delay + jitter));
        }
    }
}

// Usage: wrap any async service call
const result = await retryWithBackoff(async () => {
    const res = await fetch('http://payment-service/charge', {
        method: 'POST',
        signal: AbortSignal.timeout(2000)  // 2s timeout
    });
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return res.json();
}, 3, 200);`,
                },
            ],
        },
        {
            id: 'tools-comparison',
            subHeader: { index: '005', title: 'Real World' },
            title: (
                <SectionTitle>Tools Comparison</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <p className='text-muted-foreground leading-relaxed mb-8 text-lg'>
                            Real world এ Circuit Breaker manually implement করতে
                            হয় না — battle-tested libraries ও tools আছে।
                            নিচের table দেখুন কোন language/platform এ কোনটা
                            ব্যবহার করবেন।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Tool', 'Language', 'Type', 'Best For'],
                    rows: [
                        [
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Resilience4j
                            </span>,
                            'Java',
                            'Library',
                            'Spring Boot microservices (Hystrix replacement)',
                        ],
                        [
                            <span className='text-red-700 dark:text-red-400'>Hystrix</span>,
                            'Java',
                            'Library',
                            'Legacy Netflix stack (deprecated 2018)',
                        ],
                        [
                            <span className='text-blue-700 dark:text-blue-400 font-bold'>
                                Polly
                            </span>,
                            '.NET',
                            'Library',
                            '.NET microservices — retry, CB, bulkhead',
                        ],
                        [
                            <span className='text-yellow-700 dark:text-yellow-400 font-bold'>
                                opossum
                            </span>,
                            'Node.js',
                            'Library',
                            'Node.js service calls',
                        ],
                        [
                            <span className='text-purple-700 dark:text-purple-400 font-bold'>
                                pybreaker
                            </span>,
                            'Python',
                            'Library',
                            'Python microservices',
                        ],
                        [
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Istio
                            </span>,
                            'Any',
                            'Service Mesh',
                            'K8s level — infrastructure, no code change',
                        ],
                    ],
                },
            ],
        },
        {
            id: 'interview-prep',
            subHeader: { index: '006', title: 'Interview Preparation' },
            title: (
                <SectionTitle>
                    Common Interview Questions
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q1: Circuit Breaker আর Retry এর পার্থক্য কী?',
                    content: (
                        <p>
                            <strong>Retry:</strong> Transient failure এ কয়েকবার
                            try করুন। Short-term optimism।
                            <br />
                            <strong>Circuit Breaker:</strong> Ongoing failure
                            detect করে fast fail দেয়। Long-term protection।
                            <br />
                            <strong>Best practice:</strong> দুটো একসাথে ব্যবহার
                            করুন — Retry + Circuit Breaker।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q2: Cascading Failure কীভাবে prevent করবেন?',
                    content: (
                        <p>
                            একটা service failure অন্য services কে block করে
                            domino effect হয়। Prevention toolkit:{' '}
                            <strong>Circuit Breaker</strong> (fast fail),{' '}
                            <strong>Bulkhead</strong> (isolation),{' '}
                            <strong>Timeout</strong> (don&apos;t wait forever),{' '}
                            <strong>Fallback</strong> (graceful degradation)।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Q3: Fallback এর real example দিন',
                    content: (
                        <p>
                            Spotify recommendation down → Most popular songs।
                            Netflix personalization down → Generic popular
                            content। Payment service timeout → &quot;Will
                            process in background&quot;। Search down → Cached
                            results from 5 minutes ago।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: 'Interview এ এটা বলুন',
                    content: (
                        <>
                            &quot;Resilience pattern গুলো layered — Timeout দিয়ে
                            শুরু, তারপর Retry with Backoff, তারপর Circuit
                            Breaker, তারপর Fallback। এই চারটা একসাথে থাকলে
                            system কখনো completely down হয় না।&quot; — এটাই
                            senior engineer এর answer।
                        </>
                    ),
                },
            ],
        },
        {
            id: 'istio-config',
            subHeader: { index: '007', title: 'Infrastructure Level' },
            title: (
                <SectionTitle>
                    Istio দিয়ে Circuit Breaker — Code ছাড়াই
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <p className='text-muted-foreground leading-relaxed mb-8 text-lg'>
                            Istio Service Mesh ব্যবহার করলেন application code
                            change ছাড়াই infrastructure level এ Circuit Breaker
                            configure করা যায়। Kubernetes এ DestinationRule YAML
                            এ লিখলেই হয়।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'yaml',
                    filename: 'istio-circuit-breaker.yaml',
                    code: `apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: payment-circuit-breaker
spec:
  host: payment-service
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100        # Max TCP connections
      http:
        http1MaxPendingRequests: 10  # Bulkhead: max pending
        maxRequestsPerConnection: 2
    outlierDetection:
      # Circuit Breaker: 50% error rate → eject
      consecutiveGatewayErrors: 5   # 5 consecutive errors → OPEN
      interval: 10s                 # Check every 10 seconds
      baseEjectionTime: 30s         # OPEN for 30 seconds
      maxEjectionPercent: 100       # Eject all bad instances
      minHealthPercent: 0`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'Istio এর সুবিধা',
                    content: (
                        <>
                            Application code change লাগে না। যেকোনো language এ
                            লেখা service এ কাজ করে। Kubernetes এ YAML deploy
                            করলেনই হয়।{' '}
                            <strong>Language-agnostic circuit breaking।</strong>
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
                <span className='font-bold text-primary'>Circuit Breaker</span>,
                'Failing service এ fast fail — cascade রোধ করে',
            ],
            [
                <span className='font-bold text-primary'>
                    CLOSED → OPEN
                </span>,
                'Failure threshold exceed করলেন',
            ],
            [
                <span className='font-bold text-primary'>
                    OPEN → HALF-OPEN
                </span>,
                'Recovery timeout পরে probe করে',
            ],
            [
                <span className='font-bold text-primary'>
                    Retry + Backoff
                </span>,
                'Transient failure handle, retry storm prevent',
            ],
            [
                <span className='font-bold text-primary'>Bulkhead</span>,
                'Thread pool isolate — একটার failure সব থামায় না',
            ],
            [
                <span className='font-bold text-primary'>Timeout</span>,
                'Forever wait করুন না — ৫০০ms–২s',
            ],
            [
                <span className='font-bold text-primary'>Fallback</span>,
                'Graceful degradation — কিছু দিন, কিছু না থেকে',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'Circuit Breaker OPEN state এ কী করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Requests queue করে রাখে',
                        isCorrect: false,
                        explanation:
                            'OPEN state এ queue করা হয় না — এটা করলেন memory exhaust হবে এবং cascade আরো খারাপ হবে।',
                    },
                    {
                        key: 'B',
                        text: 'Requests ৫ বার retry করে',
                        isCorrect: false,
                        explanation:
                            'OPEN state এ retry করা হয় না — service already broken, retry করলেন আরো চাপ পড়বে।',
                    },
                    {
                        key: 'C',
                        text: 'Downstream call না করে immediately fail করে fallback দেয়',
                        isCorrect: true,
                        explanation:
                            'সঠিক! OPEN state = circuit broken। কোনো request downstream যায় না। Fast fail করে fallback response দেয়। Threads block হয় না, cascade হয় না। Service recover করার সুযোগ পায়।',
                    },
                    {
                        key: 'D',
                        text: 'নতুন server spawn করে',
                        isCorrect: false,
                        explanation:
                            'Circuit Breaker নতুন server spawn করে না — এটা auto-scaling এর কাজ।',
                    },
                ],
            },
            {
                id: 2,
                text: 'Cascading Failure কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Server এ হাজারো request আসা',
                        isCorrect: false,
                        explanation:
                            'অনেক request আসা হলো DDoS বা traffic spike — cascading failure আলাদা জিনিস।',
                    },
                    {
                        key: 'B',
                        text: 'একটা service failure অন্য services কে ব্লক করে পুরো system collapse করা',
                        isCorrect: true,
                        explanation:
                            'সঠিক! Cascading: Service A calls B (slow) → A এর threads block → A ও slow → C calls A → C ও block → পুরো system। Domino effect। Circuit Breaker এই chain ভাঙে।',
                    },
                    {
                        key: 'C',
                        text: 'Database connection leak',
                        isCorrect: false,
                        explanation:
                            'Connection leak হলো resource management সমস্যা — cascading failure এর একটা cause হতে পারে কিন্তু এটাই না।',
                    },
                    {
                        key: 'D',
                        text: 'Memory overflow',
                        isCorrect: false,
                        explanation:
                            'Memory overflow এর কারণে cascade হতে পারে কিন্তু cascading failure এর definition এটা না।',
                    },
                ],
            },
            {
                id: 3,
                text: 'Bulkhead Pattern কোন analogy থেকে এসেছে?',
                options: [
                    {
                        key: 'A',
                        text: 'Electrical circuit',
                        isCorrect: false,
                        explanation:
                            'Electrical circuit analogy হলো Circuit Breaker pattern এর — Bulkhead এর না।',
                    },
                    {
                        key: 'B',
                        text: 'Traffic light',
                        isCorrect: false,
                        explanation:
                            'Traffic light analogy rate limiting এ ব্যবহার হয়।',
                    },
                    {
                        key: 'C',
                        text: 'Computer firewall',
                        isCorrect: false,
                        explanation:
                            'Firewall security pattern — Bulkhead isolation pattern।',
                    },
                    {
                        key: 'D',
                        text: 'জাহাজের watertight compartment — একটা flood হলে বাকিগুলো safe',
                        isCorrect: true,
                        explanation:
                            'সঠিক! Bulkhead এর নাম জাহাজের watertight compartment থেকে। Thread pools isolate করুন — Payment pool full হলেও Search pool available থাকে। Failure isolation।',
                    },
                ],
            },
            {
                id: 4,
                text: 'Exponential Backoff + Jitter কেন দরকার?',
                options: [
                    {
                        key: 'A',
                        text: 'সব clients একসাথে retry করলেন failing service আরো overload হয় — Backoff+Jitter এটা prevent করে',
                        isCorrect: true,
                        explanation:
                            'সঠিক! Thundering Herd / Retry Storm: সব clients একসাথে retry → failing service আরো চাপে পড়ে। Exponential Backoff: wait বাড়াও (100→200→400ms)। Jitter: random delay যোগ করুন। Load spread হয়।',
                    },
                    {
                        key: 'B',
                        text: 'Database query fast করতে',
                        isCorrect: false,
                        explanation:
                            'Backoff+Jitter database optimization এর জন্য না — এটা retry pattern এর অংশ।',
                    },
                    {
                        key: 'C',
                        text: 'Encryption করতে',
                        isCorrect: false,
                        explanation:
                            'Encryption এর সাথে backoff এর কোনো সম্পর্ক নেই।',
                    },
                    {
                        key: 'D',
                        text: 'Cache warm করতে',
                        isCorrect: false,
                        explanation:
                            'Cache warming আলাদা concept — backoff jitter retry storm prevent করার জন্য।',
                    },
                ],
            },
            {
                id: 5,
                text: 'HALF-OPEN state এ কী হয়?',
                options: [
                    {
                        key: 'A',
                        text: 'সব requests block',
                        isCorrect: false,
                        explanation:
                            'সব block হলে সেটা OPEN state — HALF-OPEN এ কিছু probe requests allow হয়।',
                    },
                    {
                        key: 'B',
                        text: 'সব requests pass',
                        isCorrect: false,
                        explanation:
                            'সব pass হলে সেটা CLOSED state — HALF-OPEN এ limited probe requests।',
                    },
                    {
                        key: 'C',
                        text: 'Limited probe requests allow — success হলে CLOSED, fail হলে OPEN',
                        isCorrect: true,
                        explanation:
                            'সঠিক! HALF-OPEN = probe state। Recovery timeout পরে কিছু test requests allow হয়। Service recover করেছেনে? Success → CLOSED। এখনো fail? → OPEN আবার।',
                    },
                    {
                        key: 'D',
                        text: 'New election trigger',
                        isCorrect: false,
                        explanation:
                            'Election distributed consensus এর concept — Circuit Breaker state এর সাথে সম্পর্ক নেই।',
                    },
                ],
            },
            {
                id: 6,
                text: 'Graceful Degradation মানে কী?',
                options: [
                    {
                        key: 'A',
                        text: 'System বন্ধ করে দেওয়া',
                        isCorrect: false,
                        explanation:
                            'System বন্ধ করা graceful degradation না — এটা বরং এর বিপরীত।',
                    },
                    {
                        key: 'B',
                        text: 'Service fail হলেও reduced functionality দিয়ে চলতে থাকা',
                        isCorrect: true,
                        explanation:
                            'সঠিক! Graceful Degradation: Recommendation service down হলেও Netflix চলে (generic content দেখায়)। Full service না হলেও কিছুটা functionality দেওয়া। "Partially working is better than completely broken।"',
                    },
                    {
                        key: 'C',
                        text: 'Database delete করা',
                        isCorrect: false,
                        explanation:
                            'Database delete করা graceful degradation নয় — এটা destructive action।',
                    },
                    {
                        key: 'D',
                        text: 'Server restart করা',
                        isCorrect: false,
                        explanation:
                            'Server restart হলো recovery step — graceful degradation হলো service চলতে থাকা অবস্থায় কম feature দেওয়া।',
                    },
                ],
            },
            {
                id: 7,
                text: 'Timeout কত হওয়া উচিত?',
                options: [
                    {
                        key: 'A',
                        text: 'Unlimited',
                        isCorrect: false,
                        explanation:
                            'Unlimited timeout মানে forever block — thread exhaust হবে, resources waste হবে। এটা করা যাবেন না।',
                    },
                    {
                        key: 'B',
                        text: '৫ minutes',
                        isCorrect: false,
                        explanation:
                            '৫ minutes অনেক বেশি — user অপেক্ষা করবেন না এবং threads block থাকবেন।',
                    },
                    {
                        key: 'C',
                        text: '১ second সবসময়',
                        isCorrect: false,
                        explanation:
                            'সবসময় ১ second ঠিক না — ব্যবহারের উপর নির্ভর করে। P99 latency measure করে set করতে হয়।',
                    },
                    {
                        key: 'D',
                        text: 'P99 latency এর ৩-৫x — usually ৫০০ms–২০০০ms',
                        isCorrect: true,
                        explanation:
                            'সঠিক! Timeout অনেক বেশি → threads block, resources waste। অনেক কম → unnecessary failures। Best practice: P99 latency measure করুন, তার ৩-৫x set করুন। Critical paths: ৫০০ms। Non-critical: ২০০০ms।',
                    },
                ],
            },
            {
                id: 8,
                text: 'Istio তে Circuit Breaker configure করার সুবিধা কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Application code change ছাড়াই infrastructure level এ circuit breaking পানয়া যায়',
                        isCorrect: true,
                        explanation:
                            'সঠিক! Istio (Service Mesh) infrastructure level এ circuit breaking করে। প্রতিটা service এ library import না করেও পানয়া যায়। DestinationRule YAML এ configure করুন। Language-agnostic।',
                    },
                    {
                        key: 'B',
                        text: 'Database faster হয়',
                        isCorrect: false,
                        explanation:
                            'Istio database performance optimize করে না — এটা service-to-service communication manage করে।',
                    },
                    {
                        key: 'C',
                        text: 'UI design করা যায়',
                        isCorrect: false,
                        explanation:
                            'Istio UI design এর জন্য না — এটা service mesh এবং infrastructure tool।',
                    },
                    {
                        key: 'D',
                        text: 'Code automatically লেখা হয়',
                        isCorrect: false,
                        explanation:
                            'Code automatically লেখা হয় না — Istio YAML configuration দিয়ে infrastructure configure করা হয়।',
                    },
                ],
            },
            {
                id: 9,
                text: 'Circuit Breaker pattern টা কোথা থেকে inspired?',
                options: [
                    {
                        key: 'A',
                        text: 'Computer network',
                        isCorrect: false,
                        explanation:
                            'Computer network থেকে না — এটা electrical engineering থেকে।',
                    },
                    {
                        key: 'B',
                        text: 'Database transaction',
                        isCorrect: false,
                        explanation:
                            'Database transaction ACID property নিয়ে — Circuit Breaker এর analogy আলাদা।',
                    },
                    {
                        key: 'C',
                        text: 'Electrical circuit breaker — overload এ power cut করে damage prevent করে',
                        isCorrect: true,
                        explanation:
                            'সঠিক! Electrical circuit breaker overload বা short circuit এ circuit open করে দেয় — equipment damage prevent করে। Software circuit breaker ঠিক একইভাবে failing service এ calls বন্ধ করে cascade prevent করে।',
                    },
                    {
                        key: 'D',
                        text: 'Traffic light system',
                        isCorrect: false,
                        explanation:
                            'Traffic light rate limiting এর analogy — Circuit Breaker electrical breaker থেকে।',
                    },
                ],
            },
            {
                id: 10,
                text: 'আপনি একটা microservices app বানাচ্ছো। Payment service কে call করতে গিয়ে timeout হলে user কে কী দেওয়া উচিত?',
                options: [
                    {
                        key: 'A',
                        text: '500 Internal Server Error এবং app crash',
                        isCorrect: false,
                        explanation:
                            '500 error দেওয়া এবং crash করা worst practice — user experience নষ্ট হয় এবং cascade হওয়ার সম্ভাবনা থাকে।',
                    },
                    {
                        key: 'B',
                        text: 'Friendly message: "Payment being processed, we\'ll notify you" — order pending রাখুন',
                        isCorrect: true,
                        explanation:
                            'সঠিক! Fallback Pattern + Graceful Degradation। Payment timeout হলে order pending রাখুন, async process করুন, user কে notify করুন। User experience maintain করুন।',
                    },
                    {
                        key: 'C',
                        text: 'User কে ৩০ seconds wait করাও',
                        isCorrect: false,
                        explanation:
                            '৩০ seconds wait করানো — user চলে যাবেন। Timeout define করুন এবং fast fail দিয়ে fallback response দিন।',
                    },
                    {
                        key: 'D',
                        text: 'Database এ rollback করুন সব কিছু',
                        isCorrect: false,
                        explanation:
                            'Rollback করলেন order হারিয়ে যাবেন — এটা user এর জন্য আরো খারাপ। Pending state রেখে পরে process করা ভালো।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'Resilience Design & Analysis',
        time: '২-৩ ঘণ্টা',
        difficulty: 'Junior Level',
        tasks: [
            <span key='1'>
                <strong>State Diagram:</strong> একটা ride-sharing app (যেমন
                Pathao) এর জন্য Circuit Breaker design করুন। কোন services এ CB
                লাগাবে? Threshold কত হবে? Fallback কী হবে? সব লিখুন — Driver
                location service, Payment service, Notification service প্রতিটার
                জন্য আলাদা করে।
            </span>,
            <span key='2'>
                <strong>Code Fix:</strong> উপরের Python CircuitBreaker code
                পড়ো। যদি service intermittently fail করে (প্রতি ২য় call fail)
                তাহলে কি CB কখনো OPEN হবে? কেন বা কেন না explain করুন।
                Threshold কীভাবে কাজ করে বুঝিয়ে লিখুন।
            </span>,
            <span key='3'>
                <strong>Resilience Audit:</strong> আপনার পরিচিত বা কাজ করা
                কোনো project এ কতটা resilience pattern আছে? (Timeout আছে? Retry
                আছে? Fallback আছে? Circuit Breaker আছে?) ৫ লাইনে বর্ণনা করুন
                এবং কী improve করা যায় suggest করুন।
            </span>,
            <span key='4'>
                <strong>Comparison:</strong> Resilience4j এবং Istio Circuit
                Breaker — দুটোর approach এর পার্থক্য লিখুন। কোন situation এ
                কোনটা নেবে? (hint: small team vs platform team, monolith vs
                K8s)।
            </span>,
            <span key='5'>
                <strong>Bonus Code:</strong> দেওয়া{' '}
                <code>retryWithBackoff</code> function এ একটা{' '}
                <code>shouldRetry(error)</code> callback যোগ করুন — শুধু network
                errors এ retry করবেন, 4xx business errors এ retry করবেন না।
            </span>,
        ],
        deliverables: [
            <span key='1'>
                Ride-sharing app Circuit Breaker design (3 services)
            </span>,
            <span key='2'>Code analysis answer (intermittent failure)</span>,
            <span key='3'>Resilience audit of known project</span>,
            <span key='4'>Resilience4j vs Istio comparison</span>,
            <span key='5'>
                Extended retry function with error filtering
            </span>,
        ],
    },
    practicalLab: {
        title: 'Hands-On Project Task',
        subtitle: 'Resilient Microservice Demo (Python)',
        steps: [
            {
                title: 'Flaky Service বানান',
                description:
                    'একটা FastAPI endpoint যেটা random ৫০% time 500 error দেয়। Real unreliable service simulate করবেন।',
            },
            {
                title: 'Retry logic যোগ করুন',
                description:
                    'Exponential backoff সহ retry wrapper লিখুন। ৩ attempts, 100ms base delay। উপরের retryWithBackoff এর Python version।',
            },
            {
                title: 'Circuit Breaker wrap করুন',
                description:
                    'উপরের CircuitBreaker class ব্যবহার করুন। ৫ failures → OPEN, ১০s পর HALF-OPEN। State transitions console এ log করুন।',
            },
            {
                title: 'Fallback implement করুন',
                description:
                    'Service OPEN state এ cached/static response দেবে। User experience maintain হবে — "Payment processing, check back later"।',
            },
            {
                title: 'Test করুন',
                description:
                    '১০০টা requests পাঠাও। Success rate দেখুন। Circuit state transitions log করুন — CLOSED → OPEN → HALF-OPEN → CLOSED চক্র দেখুন।',
            },
        ],
        codeBlock: {
            language: 'python',
            filename: 'flaky_service.py',
            code: `import random
import time
from fastapi import FastAPI, HTTPException

app = FastAPI()

# Flaky external service simulation
@app.get("/payment")
async def payment_service():
    # 50% time fail করে
    if random.random() < 0.5:
        raise HTTPException(status_code=500, detail="Payment service down!")
    return {"status": "success", "transaction_id": "TXN_" + str(int(time.time()))}

# --- Client side with Circuit Breaker ---
cb = CircuitBreaker(failure_threshold=5, recovery_timeout=10)

def fallback_response():
    return {"status": "pending", "msg": "Payment being processed, we'll notify you"}

async def charge_payment(amount: float):
    def make_payment():
        import httpx
        res = httpx.get("http://localhost:8000/payment", timeout=2.0)
        res.raise_for_status()
        return res.json()

    result = cb.call(make_payment, fallback=fallback_response)
    return result

# Test: 100 requests পাঠাও, circuit state দেখুন
import asyncio

async def run_test():
    for i in range(100):
        result = await charge_payment(99.99)
        print(f"Request {i+1}: {result} | CB State: {cb.state.value}")
        await asyncio.sleep(0.1)

asyncio.run(run_test())`,
        },
        tip: 'Theory নয় — actually দেখবেন OPEN state fast fail কীভাবে কাজ করে, retry storm কীভাবে prevent হয়, এবং fallback user কে কীভাবে protect করে। Circuit state CLOSED → OPEN → HALF-OPEN → CLOSED এই পুরো চক্র নিজে চোখে দেখুন।',
    },
};
