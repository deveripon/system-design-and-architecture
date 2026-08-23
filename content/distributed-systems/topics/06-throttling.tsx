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

export const throttlingContent: TopicData = {
    id: 'throttling',
    sections: [
        {
            id: 'intro-concept',
            subHeader: { index: '001', title: 'Why It Matters' },
            title: (
                <SectionTitle>
                    Rate Limiting কেন শিখতে হবে?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                আপনার API তে একজন user প্রতি second এ ১০,০০০
                                request পাঠাচ্ছে। হয় DDoS attack, নাহয় তার
                                buggy code এ infinite loop। Server overload —
                                অন্য সব users blocked।
                            </ContentParagraph>
                            <ContentParagraph>
                                <strong className='text-foreground'>
                                    Rate Limiting
                                </strong>{' '}
                                হলো সমাধান — একটা user বা client কতটা request
                                করতে পারবেন সেটা restrict করুন। এটা ছাড়া কোনো
                                production API চালানো উচিত না।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Rate Limiting vs Throttling',
                    content: (
                        <p>
                            <strong>Rate Limiting:</strong> নির্দিষ্ট time
                            window তে max request count। Limit exceed → reject।
                            <br />
                            <strong>Throttling:</strong> Request reject না করে
                            slow করুন বা queue করুন — more graceful।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-10 mt-20'>
                                কেন দরকার? — ৪টা কারণ
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-b border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-blue-500' />
                                        SECURITY
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Brute force attacks রোধ। Login এ ৫ বার
                                        fail → block। DDoS mitigation করুন।
                                    </p>
                                </div>
                                <div className='p-8 border-b border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-emerald-500' />
                                        BUSINESS
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Free tier: ১০০ req/day। Paid: ১০,০০০
                                        req/day। API monetization এর basis।
                                    </p>
                                </div>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-yellow-500' />
                                        FAIRNESS
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        একজন user সব resources নিতে পারবেন না।
                                        সব users fair share পাবেন।
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-purple-500' />
                                        STABILITY
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        System overload prevent। Buggy client
                                        থেকে server protect। SLA maintain।
                                    </p>
                                </div>
                            </div>
                        </>
                    ),
                },
            ],
        },
        {
            id: 'algorithms',
            subHeader: { index: '002', title: 'Algorithms' },
            title: (
                <SectionTitle>৪টা Rate Limiting Algorithm</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-10'>
                                Algorithm Overview
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-b border-border bg-card/30'>
                                    <h4 className='font-bold text-emerald-700 dark:text-emerald-400 mb-3 font-mono uppercase tracking-widest text-[11px]'>
                                        Token Bucket
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed mb-3'>
                                        একটা bucket এ tokens। প্রতি request এ
                                        ১টা token consume। Constant rate এ
                                        refill। Bucket full হলে tokens overflow
                                        হয়।
                                    </p>
                                    <p className='text-xs text-emerald-700 dark:text-emerald-400'>
                                        ✅ Burst traffic handle করতে পারে
                                    </p>
                                    <p className='text-xs text-red-700 dark:text-red-400'>
                                        ❌ Implementation কিছুটা complex
                                    </p>
                                </div>
                                <div className='p-8 border-b border-border bg-card/30'>
                                    <h4 className='font-bold text-blue-700 dark:text-blue-400 mb-3 font-mono uppercase tracking-widest text-[11px]'>
                                        Leaky Bucket
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed mb-3'>
                                        Queue এর মতো। Requests constant rate এ
                                        &quot;leak&quot; হয়। Queue full হলে reject। Output
                                        সবসময় smooth।
                                    </p>
                                    <p className='text-xs text-emerald-700 dark:text-emerald-400'>
                                        ✅ Consistent output rate
                                    </p>
                                    <p className='text-xs text-red-700 dark:text-red-400'>
                                        ❌ Burst requests drop হতে পারে
                                    </p>
                                </div>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-yellow-700 dark:text-yellow-400 mb-3 font-mono uppercase tracking-widest text-[11px]'>
                                        Fixed Window
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed mb-3'>
                                        Fixed time window (১ min) এ count।
                                        Window শেষে reset। সবচেয়ে simple
                                        algorithm।
                                    </p>
                                    <p className='text-xs text-emerald-700 dark:text-emerald-400'>
                                        ✅ সহজ implement করা
                                    </p>
                                    <p className='text-xs text-red-700 dark:text-red-400'>
                                        ❌ Window boundary তে ২x spike possible
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-purple-700 dark:text-purple-400 mb-3 font-mono uppercase tracking-widest text-[11px]'>
                                        Sliding Window
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed mb-3'>
                                        প্রতিটা request এর timestamp রাখুন।
                                        Window এর বাইরেরগুলো drop। যেকোনো
                                        moment এ last N minutes check।
                                    </p>
                                    <p className='text-xs text-emerald-700 dark:text-emerald-400'>
                                        ✅ Most accurate, no boundary issue
                                    </p>
                                    <p className='text-xs text-red-700 dark:text-red-400'>
                                        ❌ High memory — প্রতি request store
                                    </p>
                                </div>
                            </div>
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mt-16 mb-6'>
                            Token Bucket — সবচেয়ে Popular
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'Token Bucket কীভাবে কাজ করে',
                    content: (
                        <p className='text-lg leading-relaxed'>
                            Rate: 10 tokens/sec, Capacity: 20। User ২ seconds
                            idle থাকলে ২০ tokens জমে। একসাথে ২০ requests করতে
                            পারবেন (burst)। এরপর rate limit শুরু। Token না
                            থাকলে{' '}
                            <strong className='text-foreground'>
                                429 Too Many Requests
                            </strong>{' '}
                            return করুন।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: 'Fixed Window Boundary Problem',
                    content: (
                        <p className='text-lg leading-relaxed'>
                            Limit: ১০ req/minute। User 12:00:59 তে ১০টা
                            পাঠালো, তারপর 12:01:01 তে আরো ১০টা। মাত্র ২
                            seconds এ ২০ requests! Fixed Window এটা allow করে
                            কারণ দুটো আলাদা window। Sliding Window এটা prevent
                            করে।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'distributed',
            subHeader: { index: '003', title: 'Distributed Rate Limiting' },
            title: (
                <SectionTitle>
                    Multiple Servers এ কীভাবে করবেন?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                Single server এ in-memory counter সহজ। কিন্তু
                                ১০টা API server থাকলে? প্রতিটার আলাদা counter
                                থাকলে user ১০x request করতে পারবেন। সমাধান:{' '}
                                <strong className='text-foreground'>
                                    Shared Redis counter।
                                </strong>
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-10 mt-10'>
                                Architecture: Client → LB → API Servers → Redis
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-red-500' />
                                        PROBLEM — Local Counter
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        API Server 1 এর counter: user→47। API
                                        Server 2 এর counter: user→52। সব মিলিয়ে
                                        ৯৯ requests, কিন্তু প্রতিটা server
                                        আলাদাভাবে limit enforce করছে। User ১০x
                                        request করতে পারছে!
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-emerald-500' />
                                        SOLUTION — Redis Shared Counter
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Redis এ একটাই counter:{' '}
                                        <code>rate:user123 → 47</code>। সব API
                                        servers এই একই counter INCR করে। Limit:
                                        100/min। সব servers একই counter দেখে —
                                        consistent enforcement।
                                    </p>
                                </div>
                            </div>
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'Redis INCR + EXPIRE — Atomic Operation',
                    content: (
                        <>
                            <code>
                                INCR rate_limit:user123:202401011430
                            </code>{' '}
                            — atomic, sub-millisecond।
                            <br />
                            প্রথমবার INCR করলেন key নেই → value 1 তৈরি হয়।
                            তারপর EXPIRE দিয়ে TTL set করুন। Race condition নেই
                            কারণ INCR atomic।
                        </>
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
                            Python: Token Bucket + FastAPI Middleware
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'rate_limiter.py',
                    code: `import time, threading
from collections import defaultdict
from fastapi import FastAPI, Request, HTTPException

class TokenBucket:
    def __init__(self, rate: float, capacity: int):
        self.rate = rate           # tokens/second
        self.capacity = capacity   # max tokens (burst size)
        self.tokens = capacity     # start full
        self.last_refill = time.monotonic()
        self.lock = threading.Lock()

    def consume(self) -> bool:
        with self.lock:
            now = time.monotonic()
            # Add new tokens based on elapsed time
            elapsed = now - self.last_refill
            self.tokens = min(self.capacity, self.tokens + elapsed * self.rate)
            self.last_refill = now

            if self.tokens >= 1:
                self.tokens -= 1
                return True   # allowed
            return False      # rate limited

app = FastAPI()

# প্রতি user/API-key এর জন্য আলাদা bucket
# Free: 5/sec, Paid: 50/sec
TIERS = {
    "free": {"rate": 5, "capacity": 10},
    "paid": {"rate": 50, "capacity": 100},
}
buckets = {}

@app.middleware("http")
async def rate_limit(request: Request, call_next):
    api_key = request.headers.get("X-API-Key", "anonymous")
    tier = "paid" if api_key.startswith("paid_") else "free"

    if api_key not in buckets:
        cfg = TIERS[tier]
        buckets[api_key] = TokenBucket(cfg["rate"], cfg["capacity"])

    bucket = buckets[api_key]
    if not bucket.consume():
        raise HTTPException(
            status_code=429,
            detail={"error": "Too Many Requests", "tier": tier},
            headers={"Retry-After": "1",
                     "X-RateLimit-Limit": str(TIERS[tier]["rate"]),
                     "X-RateLimit-Remaining": "0"}
        )

    response = await call_next(request)
    response.headers["X-RateLimit-Remaining"] = str(int(bucket.tokens))
    return response

@app.get("/api/data")
async def get_data():
    return {"data": "success"}`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mt-16 mb-6'>
                            Node.js: Redis Sliding Window Rate Limiter
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'redis_rate_limiter.js',
                    code: `const Redis = require('ioredis');
const redis = new Redis();

async function isRateLimited(userId, limit = 100, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;
    const key = \`rl:\${userId}\`;

    // Atomic pipeline — all 4 ops run together
    const [[, count]] = await redis
        .pipeline()
        .zremrangebyscore(key, 0, windowStart)   // remove old
        .zadd(key, now, \`\${now}\`)               // add current
        .zcard(key)                               // get count
        .pexpire(key, windowMs)                   // set TTL
        .exec()
        .then(r => r.slice(2, 3));

    return { limited: count > limit, remaining: Math.max(0, limit - count) };
}

// Express middleware
const rateLimit = (limit, windowMs) => async (req, res, next) => {
    const key = req.headers['x-user-id'] || req.ip;
    const { limited, remaining } = await isRateLimited(key, limit, windowMs);

    res.set('X-RateLimit-Limit', limit);
    res.set('X-RateLimit-Remaining', remaining);

    if (limited) return res.status(429).json({
        error: 'Too Many Requests',
        retry_after: Math.ceil(windowMs / 1000)
    });
    next();
};

// Different limits for different endpoints
app.use('/api/login', rateLimit(5, 300000));   // 5 per 5 min
app.use('/api/search', rateLimit(30, 60000));  // 30 per min
app.use('/api/', rateLimit(100, 60000));       // 100 per min`,
                },
            ],
        },
        {
            id: 'realworld',
            subHeader: { index: '005', title: 'Real World' },
            title: (
                <SectionTitle>Real World Rate Limits</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'API / Service',
                        'Limit',
                        'Algorithm',
                        '429 Response',
                    ],
                    rows: [
                        [
                            'GitHub API',
                            '৬০ req/hr (unauth), ৫০০০ (auth)',
                            'Fixed Window',
                            '403 + X-RateLimit headers',
                        ],
                        [
                            'Twitter API v2',
                            '১৫ req/15 min (basic)',
                            'Sliding Window',
                            '429 + Retry-After',
                        ],
                        [
                            'Stripe',
                            '১০০ req/sec',
                            'Token Bucket',
                            '429 + retry suggestion',
                        ],
                        [
                            'OpenAI',
                            'RPM + TPM (tier based)',
                            'Token Bucket',
                            '429 + error.type',
                        ],
                        [
                            'AWS API Gateway',
                            '১০,০০০ req/sec default',
                            'Token Bucket',
                            '429 ThrottlingException',
                        ],
                        [
                            'Cloudflare WAF',
                            'Custom rules',
                            'Token Bucket',
                            'Block / Challenge / Log',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-10 mt-16'>
                                Production Headers & Tools
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-blue-500' />
                                        STANDARD HEADERS
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed font-mono'>
                                        X-RateLimit-Limit: 100
                                        <br />
                                        X-RateLimit-Remaining: 47
                                        <br />
                                        X-RateLimit-Reset: 1706000000
                                        <br />
                                        Retry-After: 30
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-emerald-500' />
                                        PRODUCTION TOOLS
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        <strong>nginx:</strong>{' '}
                                        limit_req_zone module
                                        <br />
                                        <strong>Kong:</strong> Rate Limiting
                                        plugin
                                        <br />
                                        <strong>AWS WAF:</strong> Rate-based
                                        rules
                                        <br />
                                        <strong>Traefik:</strong> RateLimit
                                        middleware
                                    </p>
                                </div>
                            </div>
                        </>
                    ),
                },
            ],
        },
        {
            id: 'interview',
            subHeader: { index: '006', title: 'Interview Preparation' },
            title: (
                <SectionTitle>Common Interview Questions</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title:
                        'Q1: "Design a Rate Limiter" — কীভাবে approach করবেন?',
                    content: (
                        <p>
                            <strong>1)</strong> Requirements clarify: per user?
                            per IP? per API key? <strong>2)</strong> Single
                            server নাকি distributed? <strong>3)</strong>{' '}
                            Algorithm: Token Bucket (versatile)।{' '}
                            <strong>4)</strong> Storage: Redis (atomic INCR){' '}
                            <strong>5)</strong> Response: 429 + Retry-After +
                            X-RateLimit headers। <strong>6)</strong> Edge cases:
                            distributed clocks, Redis failure।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title:
                        'Q2: Fixed Window এর boundary problem কী? কীভাবে solve করবেন?',
                    content: (
                        <p>
                            Window শেষে ও শুরুতে burst possible। User ২ seconds
                            এ ২x limit use করতে পারে। Solution: Sliding Window
                            Log (exact timestamps) অথবা Sliding Window Counter
                            (approximate but fast)।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title:
                        'Q3: Rate Limiting কোথায় implement করা উচিত?',
                    content: (
                        <p>
                            <strong>Best:</strong> API Gateway বা Load Balancer
                            এ — upstream এ। Backend services পর্যন্ত excess
                            traffic পৌঁছায় না। <strong>Also:</strong>{' '}
                            Per-service level এ different limits।{' '}
                            <strong>Avoid:</strong> Client side (bypass করা
                            যায়)।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: 'Interview এ এটা বলুন',
                    content: (
                        <>
                            &quot;আমি Token Bucket algorithm ব্যবহার করবো কারণ
                            এটা burst traffic handle করতে পারে। Distributed
                            system এ Redis INCR দিয়ে atomic shared counter
                            রাখবো। API Gateway তে implement করবো যাতে backend
                            সুরক্ষিত থাকে। 429 + Retry-After header সবসময়
                            দেবো।&quot;
                        </>
                    ),
                },
            ],
        },
        {
            id: 'nginx-config',
            subHeader: { index: '007', title: 'Nginx Rate Limiting' },
            title: (
                <SectionTitle>
                    Nginx দিয়ে Rate Limiting Setup
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <p className='text-muted-foreground leading-relaxed mb-10 text-lg'>
                            Production এ সবচেয়ে common approach হলো Nginx এ
                            rate limiting configure করা।{' '}
                            <code>limit_req_zone</code> এবং{' '}
                            <code>limit_req</code> directive ব্যবহার করে সহজেই
                            endpoint-specific limits দেওয়া যায়।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'nginx',
                    filename: 'nginx_rate_limit.conf',
                    code: `# Rate limit zones define করুন (http block এ)
http {
    # Zone 1: login endpoint — per IP, 5 req/5min
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/m;

    # Zone 2: API — per user (X-User-Id header), 100/min
    limit_req_zone $http_x_user_id zone=api:20m rate=100r/m;

    # Zone 3: search — 30/min per IP
    limit_req_zone $binary_remote_addr zone=search:10m rate=30r/m;

    server {
        listen 80;

        # Login: strict — 5 per 5min, no burst
        location /api/login {
            limit_req zone=login burst=5 nodelay;
            limit_req_status 429;
            proxy_pass http://backend;
        }

        # Search: moderate burst allowed
        location /api/search {
            limit_req zone=search burst=10;
            limit_req_status 429;
            proxy_pass http://backend;
        }

        # General API: 100/min, burst of 20
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            limit_req_status 429;
            # Custom 429 response
            error_page 429 /rate_limit.json;
            proxy_pass http://backend;
        }

        location = /rate_limit.json {
            internal;
            default_type application/json;
            return 429 '{"error":"Too Many Requests","retry_after":60}';
        }
    }
}`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'Nginx Rate Limiting Tips',
                    content: (
                        <p>
                            <strong>burst</strong> মানে temporary spike allow।
                            burst=20 মানে extra ২০টা request queue এ রাখা যাবেন।{' '}
                            <strong>nodelay</strong> মানে burst requests queue
                            না করে immediately process করুন। Login এ burst কম
                            রাখুন, general API তে বেশি রাখুন।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'tiered-limits',
            subHeader: { index: '008', title: 'Tiered API Limits' },
            title: (
                <SectionTitle>
                    Tiered Rate Limiting — API Monetization
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <p className='text-muted-foreground leading-relaxed mb-10 text-lg'>
                            Real world API তে different users different limits
                            পায়। Free, Basic, Premium — প্রতিটা tier এর আলাদা
                            rate limit। এটাই API monetization এর মূল ভিত্তি।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Tier', 'Rate Limit', 'Burst', 'Price'],
                    rows: [
                        [
                            <span className='text-muted-foreground font-mono'>
                                Free
                            </span>,
                            '১০০ req/day',
                            '5 req burst',
                            'বিনামূল্যে',
                        ],
                        [
                            <span className='text-blue-700 dark:text-blue-400 font-bold font-mono'>
                                Basic
                            </span>,
                            '১০,০০০ req/day',
                            '50 req burst',
                            <span className='text-emerald-700 dark:text-emerald-400'>$9/month</span>,
                        ],
                        [
                            <span className='text-yellow-700 dark:text-yellow-400 font-bold font-mono'>
                                Premium
                            </span>,
                            '১,০০,০০০ req/day',
                            '200 req burst',
                            <span className='text-emerald-700 dark:text-emerald-400'>$99/month</span>,
                        ],
                        [
                            <span className='text-purple-700 dark:text-purple-400 font-bold font-mono'>
                                Enterprise
                            </span>,
                            'Unlimited',
                            'Custom',
                            <span className='text-yellow-700 dark:text-yellow-400'>Custom pricing</span>,
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'Implementation Pattern',
                    content: (
                        <p>
                            <strong>1)</strong> X-API-Key header থেকে tier
                            identify করুন (JWT claim বা DB lookup)।{' '}
                            <strong>2)</strong> Redis key:{' '}
                            <code>rate_limit:{'{'}api_key{'}'}</code> →{' '}
                            tier-specific limit apply।{' '}
                            <strong>3)</strong> Response headers এ remaining
                            count ও reset time জানাও। Stripe, OpenAI, GitHub
                            সবাই এই pattern follow করে।
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
                <span className='font-bold text-primary'>Rate Limiting</span>,
                'Time window এ max request — reject exceed করলেন',
            ],
            [
                <span className='font-bold text-primary'>Token Bucket</span>,
                'Burst allow — API তে সবচেয়ে popular',
            ],
            [
                <span className='font-bold text-primary'>Leaky Bucket</span>,
                'Constant output — smooth traffic',
            ],
            [
                <span className='font-bold text-primary'>Fixed Window</span>,
                'Simple কিন্তু boundary spike problem',
            ],
            [
                <span className='font-bold text-primary'>Sliding Window</span>,
                'Accurate কিন্তু memory intensive',
            ],
            [
                <span className='font-bold text-primary'>Redis INCR</span>,
                'Distributed shared counter — atomic',
            ],
            [
                <span className='font-bold text-primary'>
                    429 + Retry-After
                </span>,
                'Standard rate limit response',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'Token Bucket এ "burst" allow করার মানে কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Server crash করা',
                        isCorrect: false,
                        explanation:
                            'Server crash rate limiting এর সাথে সম্পর্কিত না।',
                    },
                    {
                        key: 'B',
                        text: 'Idle time এ জমা হওয়া tokens একসাথে use করে temporarily high rate এ request করা',
                        isCorrect: true,
                        explanation:
                            'Token Bucket এর beauty: user কিছুক্ষণ request না করলেন tokens জমে যায়। পরে একসাথে সেই tokens use করে burst করতে পারে। Rate: 10/sec, Capacity: 20 → user 2 seconds idle থাকলে 20 tokens, একসাথে 20 requests করতে পারবেন।',
                    },
                    {
                        key: 'C',
                        text: 'Unlimited requests করা',
                        isCorrect: false,
                        explanation:
                            'Burst মানে unlimited না — capacity দ্বারা সীমাবদ্ধ।',
                    },
                    {
                        key: 'D',
                        text: 'Database overflow করা',
                        isCorrect: false,
                        explanation:
                            'Database overflow rate limiting এর সাথে সম্পর্কিত না।',
                    },
                ],
            },
            {
                id: 2,
                text: 'Distributed rate limiting এ Redis কেন ব্যবহার করা হয়?',
                options: [
                    {
                        key: 'A',
                        text: 'Redis সস্তা বলে',
                        isCorrect: false,
                        explanation:
                            'Cost এখানে primary কারণ না।',
                    },
                    {
                        key: 'B',
                        text: 'Redis SQL support করে',
                        isCorrect: false,
                        explanation:
                            'Redis SQL database না — এটা in-memory data store।',
                    },
                    {
                        key: 'C',
                        text: 'Redis শুধু caching এর জন্য',
                        isCorrect: false,
                        explanation:
                            'Redis caching ছাড়াও অনেক কাজে ব্যবহার হয়।',
                    },
                    {
                        key: 'D',
                        text: 'Atomic INCR দিয়ে race condition ছাড়া shared counter maintain করা যায়',
                        isCorrect: true,
                        explanation:
                            'Multiple API servers এ আলাদা in-memory counter থাকলে user ১০x request করতে পারে। Redis centralized shared counter দেয়। INCR atomic — race condition নেই। Sub-millisecond latency।',
                    },
                ],
            },
            {
                id: 3,
                text: 'Rate limit exceed হলে কোন HTTP status code দেওয়া standard?',
                options: [
                    {
                        key: 'A',
                        text: '429 Too Many Requests',
                        isCorrect: true,
                        explanation:
                            '429 Too Many Requests হলো RFC 6585 standard। সাথে Retry-After header দিন। 403 মানে permission denied, 503 মানে service down — দুটোই ভুল context।',
                    },
                    {
                        key: 'B',
                        text: '403 Forbidden',
                        isCorrect: false,
                        explanation:
                            '403 মানে permission denied — rate limit এর জন্য সঠিক না।',
                    },
                    {
                        key: 'C',
                        text: '503 Service Unavailable',
                        isCorrect: false,
                        explanation:
                            '503 মানে service down — rate limit এ এটা ব্যবহার করা ভুল।',
                    },
                    {
                        key: 'D',
                        text: '400 Bad Request',
                        isCorrect: false,
                        explanation:
                            '400 মানে invalid request format — rate limit এর context নয়।',
                    },
                ],
            },
            {
                id: 4,
                text: 'Fixed Window এর boundary problem কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Memory বেশি লাগে',
                        isCorrect: false,
                        explanation:
                            'Fixed Window এ memory কম লাগে — শুধু count রাখতে হয়।',
                    },
                    {
                        key: 'B',
                        text: 'Redis দরকার হয়',
                        isCorrect: false,
                        explanation:
                            'Fixed Window single server এ in-memory counter দিয়ে কাজ করে।',
                    },
                    {
                        key: 'C',
                        text: 'Window শেষে ও শুরুতে ২x burst possible — ২ seconds এ limit দ্বিগুণ use করা যায়',
                        isCorrect: true,
                        explanation:
                            'Limit 10/min। 12:00:59 তে ১০টা + 12:01:01 তে ১০টা = 2 seconds এ ২০ requests। দুটো আলাদা window তাই allowed। Sliding Window এটা prevent করে — যেকোনো ১ minute window তে maximum ১০।',
                    },
                    {
                        key: 'D',
                        text: 'Implementation কঠিন',
                        isCorrect: false,
                        explanation:
                            'Fixed Window সবচেয়ে সহজ implementation — এটাই এর সুবিধা।',
                    },
                ],
            },
            {
                id: 5,
                text: 'Login endpoint এ কোন rate limit strategy best?',
                options: [
                    {
                        key: 'A',
                        text: 'কোনো limit দরকার নেই',
                        isCorrect: false,
                        explanation:
                            'Login limit ছাড়া brute force attack সম্ভব।',
                    },
                    {
                        key: 'B',
                        text: 'Per IP + Per user account: ৫ attempts/5 minutes — brute force prevent করতে',
                        isCorrect: true,
                        explanation:
                            'Login এ strict limit দরকার। Per IP এবং Per account — দুটোই। কেউ VPN change করলেনও per-account limit কাজ করবেন। Failed attempts এ exponential backoff apply করুন।',
                    },
                    {
                        key: 'C',
                        text: '১০০০ req/min allow করুন',
                        isCorrect: false,
                        explanation:
                            '১০০০ req/min login এ অনেক বেশি — brute force attack এ সহায়ক।',
                    },
                    {
                        key: 'D',
                        text: 'শুধু IP based limit',
                        isCorrect: false,
                        explanation:
                            'শুধু IP based হলে VPN change করে bypass করা যায়।',
                    },
                ],
            },
            {
                id: 6,
                text: 'Leaky Bucket এবং Token Bucket এর পার্থক্য কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Leaky Bucket faster',
                        isCorrect: false,
                        explanation:
                            'Speed দুটোর similar — পার্থক্য behavior এ।',
                    },
                    {
                        key: 'B',
                        text: 'Token Bucket শুধু single server এ কাজ করে',
                        isCorrect: false,
                        explanation:
                            'Token Bucket distributed system এও কাজ করে।',
                    },
                    {
                        key: 'C',
                        text: 'Leaky Bucket বেশি popular',
                        isCorrect: false,
                        explanation:
                            'Token Bucket বেশি popular কারণ burst support করে।',
                    },
                    {
                        key: 'D',
                        text: 'Token Bucket burst allow করে, Leaky Bucket constant outflow enforce করে',
                        isCorrect: true,
                        explanation:
                            'Token Bucket burst possible। Leaky Bucket: queue থেকে constant rate এ leak — output always smooth। API তে Token Bucket prefer কারণ legitimate users দের occasional burst allow করা ভালো experience দেয়।',
                    },
                ],
            },
            {
                id: 7,
                text: 'Retry-After header কী কাজ করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Client কে জানায় কত seconds পরে retry করলেন rate limit reset হবে',
                        isCorrect: true,
                        explanation:
                            'Retry-After: 30 মানে ৩০ seconds পরে retry করুন। Good clients এটা respect করে thundering herd prevent হয়। GitHub, Stripe, Twitter সবাই এটা use করে। Best practice: সবসময় 429 এর সাথে দিন।',
                    },
                    {
                        key: 'B',
                        text: 'Server restart করে',
                        isCorrect: false,
                        explanation:
                            'Retry-After header শুধু client কে information দেয়, server restart করে না।',
                    },
                    {
                        key: 'C',
                        text: 'Database cache clear করে',
                        isCorrect: false,
                        explanation:
                            'Retry-After header server-side কোনো action নেয় না।',
                    },
                    {
                        key: 'D',
                        text: 'New server spawn করে',
                        isCorrect: false,
                        explanation:
                            'Retry-After header auto-scaling এর সাথে সম্পর্কিত না।',
                    },
                ],
            },
            {
                id: 8,
                text: 'Rate Limiting কোন layer এ implement করা best?',
                options: [
                    {
                        key: 'A',
                        text: 'Database layer',
                        isCorrect: false,
                        explanation:
                            'Database তে rate limiting করলেন excess traffic ইতিমধ্যে backend এ পৌঁছে যায়।',
                    },
                    {
                        key: 'B',
                        text: 'Frontend JavaScript',
                        isCorrect: false,
                        explanation:
                            'Client side rate limiting সহজে bypass করা যায়।',
                    },
                    {
                        key: 'C',
                        text: 'API Gateway বা Load Balancer — সব traffic এর entry point এ',
                        isCorrect: true,
                        explanation:
                            'API Gateway তে করলেন excess traffic backend পর্যন্ত পৌঁছায় না। Centralized policy। প্রতিটা service এ duplicate code নেই। Kong, AWS API Gateway, Nginx — সবই এটা support করে।',
                    },
                    {
                        key: 'D',
                        text: 'Mobile app',
                        isCorrect: false,
                        explanation:
                            'Mobile app এ rate limiting bypass করা trivial।',
                    },
                ],
            },
            {
                id: 9,
                text: 'Sliding Window Log এর সবচেয়ে বড় disadvantage কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Inaccurate',
                        isCorrect: false,
                        explanation:
                            'Sliding Window Log সবচেয়ে accurate — এটা সুবিধা, অসুবিধা না।',
                    },
                    {
                        key: 'B',
                        text: 'High memory usage — প্রতিটা request এর timestamp store করতে হয়',
                        isCorrect: true,
                        explanation:
                            'Sliding Window Log সবচেয়ে accurate কিন্তু প্রতিটা request এর timestamp store করতে হয়। ১ million users এ huge memory। Solution: Sliding Window Counter — approximate কিন্তু memory efficient।',
                    },
                    {
                        key: 'C',
                        text: 'Burst allow করে না',
                        isCorrect: false,
                        explanation:
                            'Sliding Window Log burst এর ক্ষেত্রে Token Bucket এর মতো behavior করে।',
                    },
                    {
                        key: 'D',
                        text: 'Redis support নেই',
                        isCorrect: false,
                        explanation:
                            'Redis Sorted Set দিয়ে Sliding Window Log efficiently implement করা যায়।',
                    },
                ],
            },
            {
                id: 10,
                text: 'আপনার API তে Free (১০০/day) ও Paid (১০,০০০/day) tier আছে। কীভাবে implement করবেন?',
                options: [
                    {
                        key: 'A',
                        text: 'সবাইকে same limit',
                        isCorrect: false,
                        explanation:
                            'Same limit দিলে paid users এর value নেই।',
                    },
                    {
                        key: 'B',
                        text: 'IP based শুধু',
                        isCorrect: false,
                        explanation:
                            'IP based শুধু হলে tier distinction করা যায় না।',
                    },
                    {
                        key: 'C',
                        text: 'প্রতিটা request এ database check করুন',
                        isCorrect: false,
                        explanation:
                            'প্রতিটা request এ DB hit করলেন performance problem হবে — Redis cache ব্যবহার করুন।',
                    },
                    {
                        key: 'D',
                        text: 'API Key দিয়ে tier identify, Redis এ tier-specific counter, JWT/DB থেকে tier lookup',
                        isCorrect: true,
                        explanation:
                            'API Key → tier lookup (JWT claim বা DB) → Redis counter: rate_limit:{api_key}:{date} → tier অনুযায়ী limit apply। এটাই production API monetization এর standard approach। Stripe, OpenAI, GitHub সবাই এটা করে।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'Rate Limiting Design & Implementation',
        time: '২-৩ ঘণ্টা',
        difficulty: 'Junior Level',
        tasks: [
            <span key='1'>
                <strong>Algorithm Comparison Table:</strong> Token Bucket, Leaky
                Bucket, Fixed Window, Sliding Window — ৪টার জন্য Memory usage,
                Burst support, Accuracy, Complexity, Best use case তুলনামূলক
                table বানান।
            </span>,
            <span key='2'>
                <strong>API Design:</strong> একটা Weather API design করুন। Free:
                ১০০ req/day, Basic ($9): ১০,০০০ req/day, Premium ($99):
                unlimited। Rate limit headers ও error response format design
                করুন।
            </span>,
            <span key='3'>
                <strong>Code Challenge:</strong> দেওয়া TokenBucket class এ{' '}
                <code>get_wait_time()</code> method যোগ করুন যেটা পরবর্তী request
                করতে কত seconds অপেক্ষা করতে হবে সেটা return করে।
            </span>,
            <span key='4'>
                <strong>Real API Exploration:</strong> GitHub Personal Access
                Token নিয়ে curl করুন। X-RateLimit headers observe করুন।
                Unauthenticated (৬০/hr) vs Authenticated (৫০০০/hr) compare
                করুন।
            </span>,
            <span key='5'>
                <strong>Nginx Config:</strong> /api/login endpoint এ 5 req/5min
                rate limit দিন —{' '}
                <code>limit_req_zone</code> এবং <code>limit_req</code> directive
                ব্যবহার করে।
            </span>,
        ],
        deliverables: [
            <span key='1'>Algorithm comparison table</span>,
            <span key='2'>
                Weather API rate limit design document
            </span>,
            <span key='3'>
                TokenBucket class with get_wait_time()
            </span>,
            <span key='4'>
                GitHub API headers screenshot + analysis
            </span>,
            <span key='5'>Nginx rate limiting config file</span>,
        ],
    },
    practicalLab: {
        title: 'Hands-On Project Task',
        subtitle: 'Tiered Rate-Limited API Server',
        steps: [
            {
                title: 'Redis চালাও',
                description: (
                    <span>
                        <code>docker run -d -p 6379:6379 redis:alpine</code>
                    </span>
                ),
            },
            {
                title: 'FastAPI + Redis rate limiter লিখুন',
                description:
                    'Sliding Window algorithm দিয়ে Redis based rate limiter implement করুন।',
            },
            {
                title: 'Tiered limits যোগ করুন',
                description:
                    'X-API-Key header দিয়ে tier determine। Free: ১০/min, Paid: ১০০/min, Admin: unlimited।',
            },
            {
                title: 'Proper headers add করুন',
                description:
                    'X-RateLimit-Limit, Remaining, Reset, এবং Retry-After সব responses এ।',
            },
            {
                title: 'Rapid fire test করুন',
                description:
                    'Python loop দিয়ে ৫০টা requests পাঠাও। কোনটায় 429 আসে note করুন।',
            },
        ],
        codeBlock: {
            language: 'python',
            filename: 'tiered_api.py',
            code: `import redis
import time
from fastapi import FastAPI, Request, HTTPException, Header
from typing import Optional

r = redis.Redis(host='localhost', port=6379, decode_responses=True)
app = FastAPI()

TIERS = {
    "free":    {"limit": 10,  "window": 60},   # 10/min
    "paid":    {"limit": 100, "window": 60},   # 100/min
    "admin":   {"limit": -1,  "window": 60},   # unlimited
}

def get_tier(api_key: str) -> str:
    if api_key.startswith("admin_"): return "admin"
    if api_key.startswith("paid_"):  return "paid"
    return "free"

def sliding_window_check(key: str, limit: int, window: int):
    if limit == -1:
        return True, 999999   # unlimited
    now = time.time()
    pipe = r.pipeline()
    pipe.zremrangebyscore(key, 0, now - window)
    pipe.zadd(key, {str(now): now})
    pipe.zcard(key)
    pipe.expire(key, window)
    results = pipe.execute()
    count = results[2]
    return count <= limit, max(0, limit - count)

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    api_key = request.headers.get("X-API-Key", "anonymous")
    tier = get_tier(api_key)
    cfg = TIERS[tier]
    key = f"rl:{api_key}"
    allowed, remaining = sliding_window_check(key, cfg["limit"], cfg["window"])

    if not allowed:
        raise HTTPException(
            status_code=429,
            detail={"error": "Too Many Requests", "tier": tier},
            headers={
                "X-RateLimit-Limit": str(cfg["limit"]),
                "X-RateLimit-Remaining": "0",
                "Retry-After": str(cfg["window"]),
            }
        )
    response = await call_next(request)
    response.headers["X-RateLimit-Limit"] = str(cfg["limit"])
    response.headers["X-RateLimit-Remaining"] = str(remaining)
    response.headers["X-RateLimit-Tier"] = tier
    return response

@app.get("/api/data")
async def get_data():
    return {"status": "ok", "data": "your data here"}

# Test script
# for i in range(50):
#     r = requests.get("http://localhost:8000/api/data",
#                      headers={"X-API-Key": "free_test"})
#     print(f"{i+1}: {r.status_code} remaining={r.headers.get('X-RateLimit-Remaining')}")`,
        },
        tip: 'Token Bucket burst behavior practically দেখবেন। Redis atomic counter কীভাবে race condition prevent করে বুঝবেন। Production API এর rate limiting headers নিজে লিখবে। Free tier এ ১০টার বেশি request পাঠালে 429 দেখবেন — এটাই real rate limiting!',
    },
};
