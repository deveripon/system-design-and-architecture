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

export const securityContent: TopicData = {
    id: 'security',
    sections: [
        {
            id: 'why-security',
            subHeader: { index: '001', title: 'Why Security Matters' },
            title: (
                <SectionTitle>
                    Security কেন Critical? System Design-এ Security First
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-4'>
                            <div className='flex flex-wrap gap-3 mb-6'>
                                <span className='font-mono text-xs px-3 py-1 border border-primary/30 text-primary bg-primary/5 rounded'>
                                    ⏱ ৯০-১২০ মিনিট
                                </span>
                                <span className='font-mono text-xs px-3 py-1 border border-red-500/30 text-red-700 dark:text-red-400 bg-red-500/5 rounded'>
                                    🔐 Advanced Security
                                </span>
                                <span className='font-mono text-xs px-3 py-1 border border-orange-400/30 text-orange-700 dark:text-orange-400 bg-orange-400/5 rounded'>
                                    🛡️ Phase 5 — Topic 1
                                </span>
                            </div>
                            <ContentParagraph>
                                System Design interview-এ security একটা
                                overlooked topic — কিন্তু senior engineers
                                সবসময়{' '}
                                <strong className='text-foreground'>
                                    security-first mindset
                                </strong>{' '}
                                নিয়ে চিন্তা করেন। Data breach, unauthorized
                                access, বা injection attack — এগুলো শুধু
                                technical problem নয়,{' '}
                                <strong className='text-foreground'>
                                    business existential threat
                                </strong>
                                ।
                            </ContentParagraph>
                            <p className='text-muted-foreground leading-relaxed'>
                                Facebook-এর Cambridge Analytica scandal, Equifax
                                data breach (147M users), বা Bangladesh Bank
                                heist ($81M) — সব ক্ষেত্রেই security oversight
                                ছিল। একজন system designer হিসেবে আপনাকে attack
                                surface বুঝতে হবে এবং{' '}
                                <strong className='text-foreground'>
                                    defence in depth
                                </strong>{' '}
                                apply করতে হবে।
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 CIA Triad — Security-এর তিন স্তম্ভ',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>Confidentiality (গোপনীয়তা):</strong>{' '}
                                শুধু authorized users data access করতে পারবেন।
                                Encryption, access control।
                            </p>
                            <p>
                                <strong>Integrity (অখণ্ডতা):</strong> Data
                                unauthorized ভাবে modify হয়নি। Hash, digital
                                signature।
                            </p>
                            <p>
                                <strong>Availability (প্রাপ্যতা):</strong>{' '}
                                Authorized users সবসময় service পাবেন। DDoS
                                protection, redundancy।
                            </p>
                            <p className='mt-2 text-xs font-mono text-muted-foreground'>
                                → সব security decision এই তিনটির trade-off।
                                Over-encryption করলেন availability কমে।
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                Attack Surface — System Design Security Overview
                            </p>
                            <svg
                                viewBox='0 0 680 340'
                                className='w-full max-w-2xl mx-auto'>
                                <defs>
                                    <marker
                                        id='arrSec'
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
                                        id='arrRed'
                                        markerWidth='8'
                                        markerHeight='8'
                                        refX='6'
                                        refY='3'
                                        orient='auto'>
                                        <path
                                            d='M0,0 L0,6 L8,3 z'
                                            fill='#ef4444'
                                        />
                                    </marker>
                                    <marker
                                        id='arrGreen'
                                        markerWidth='8'
                                        markerHeight='8'
                                        refX='6'
                                        refY='3'
                                        orient='auto'>
                                        <path
                                            d='M0,0 L0,6 L8,3 z'
                                            fill='#10b981'
                                        />
                                    </marker>
                                </defs>

                                {/* Internet / Attacker */}
                                <rect
                                    x='10'
                                    y='130'
                                    width='90'
                                    height='50'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#ef4444'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='55'
                                    y='150'
                                    textAnchor='middle'
                                    fill='#ef4444'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    ATTACKER
                                </text>
                                <text
                                    x='55'
                                    y='163'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Internet
                                </text>
                                <path
                                    d='M 100 155 L 145 155'
                                    stroke='#ef4444'
                                    strokeWidth='1.5'
                                    strokeDasharray='4,3'
                                    markerEnd='url(#arrRed)'
                                />

                                {/* API Gateway */}
                                <rect
                                    x='145'
                                    y='120'
                                    width='110'
                                    height='70'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#06b6d4'
                                    strokeWidth='2'
                                />
                                <text
                                    x='200'
                                    y='143'
                                    textAnchor='middle'
                                    fill='#06b6d4'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    API GATEWAY
                                </text>
                                <text
                                    x='200'
                                    y='157'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Auth + Rate Limit
                                </text>
                                <text
                                    x='200'
                                    y='170'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    TLS termination
                                </text>
                                <text
                                    x='200'
                                    y='182'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    WAF / DDoS
                                </text>
                                <path
                                    d='M 255 155 L 300 155'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                    markerEnd='url(#arrGreen)'
                                />

                                {/* Services */}
                                <rect
                                    x='300'
                                    y='90'
                                    width='100'
                                    height='45'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='350'
                                    y='110'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    USER SERVICE
                                </text>
                                <text
                                    x='350'
                                    y='125'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    mTLS between services
                                </text>

                                <rect
                                    x='300'
                                    y='155'
                                    width='100'
                                    height='45'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='350'
                                    y='175'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    ORDER SERVICE
                                </text>
                                <text
                                    x='350'
                                    y='190'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    RBAC / ABAC
                                </text>

                                <rect
                                    x='300'
                                    y='220'
                                    width='100'
                                    height='45'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='350'
                                    y='240'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    PAY SERVICE
                                </text>
                                <text
                                    x='350'
                                    y='255'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    PCI DSS + Encryption
                                </text>

                                {/* Arrows from gateway to services */}
                                <path
                                    d='M 300 130 L 285 112'
                                    stroke='#64748b'
                                    strokeWidth='1'
                                    markerEnd='url(#arrSec)'
                                />
                                <path
                                    d='M 300 155 L 300 155'
                                    stroke='#64748b'
                                    strokeWidth='1'
                                />
                                <path
                                    d='M 300 200 L 285 230'
                                    stroke='#64748b'
                                    strokeWidth='1'
                                    markerEnd='url(#arrSec)'
                                />

                                {/* Database */}
                                <rect
                                    x='450'
                                    y='130'
                                    width='100'
                                    height='55'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#eab308'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='500'
                                    y='152'
                                    textAnchor='middle'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    DATABASE
                                </text>
                                <text
                                    x='500'
                                    y='166'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Encryption at rest
                                </text>
                                <text
                                    x='500'
                                    y='178'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Secrets via Vault
                                </text>
                                <path
                                    d='M 400 155 L 450 155'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arrSec)'
                                />

                                {/* Secrets Manager */}
                                <rect
                                    x='450'
                                    y='220'
                                    width='100'
                                    height='50'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#f97316'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='500'
                                    y='240'
                                    textAnchor='middle'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    VAULT
                                </text>
                                <text
                                    x='500'
                                    y='254'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Dynamic Secrets
                                </text>
                                <text
                                    x='500'
                                    y='264'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Rotation
                                </text>

                                {/* Auth Server */}
                                <rect
                                    x='145'
                                    y='30'
                                    width='110'
                                    height='55'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='200'
                                    y='52'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    AUTH SERVER
                                </text>
                                <text
                                    x='200'
                                    y='65'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    JWT / OAuth2
                                </text>
                                <text
                                    x='200'
                                    y='77'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    OpenID Connect
                                </text>
                                <path
                                    d='M 200 85 L 200 120'
                                    stroke='#10b981'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arrGreen)'
                                />

                                {/* Legend */}
                                <line
                                    x1='10'
                                    y1='300'
                                    x2='35'
                                    y2='300'
                                    stroke='#ef4444'
                                    strokeWidth='1.5'
                                    strokeDasharray='4,3'
                                />
                                <text
                                    x='40'
                                    y='304'
                                    fill='#94a3b8'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Attack vector
                                </text>
                                <line
                                    x1='150'
                                    y1='300'
                                    x2='175'
                                    y2='300'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='180'
                                    y='304'
                                    fill='#94a3b8'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Secured channel
                                </text>
                                <line
                                    x1='320'
                                    y1='300'
                                    x2='345'
                                    y2='300'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='350'
                                    y='304'
                                    fill='#94a3b8'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Internal communication
                                </text>
                            </svg>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'authentication',
            subHeader: { index: '002', title: 'Authentication' },
            title: (
                <SectionTitle>
                    Authentication — আপনি কে? JWT থেকে OAuth2
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Authentication মানে{' '}
                            <strong className='text-foreground'>
                                identity verification
                            </strong>{' '}
                            — আপনি কে তা prove করুন। Modern systems-এ তিনটি
                            major approach:{' '}
                            <strong className='text-foreground'>
                                Session-based, JWT (JSON Web Token),
                            </strong>{' '}
                            এবং{' '}
                            <strong className='text-foreground'>OAuth2</strong>।
                            প্রতিটার নিজস্ব use case আছে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-5'>
                            <p className='font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4'>
                                JWT Structure — header.payload.signature
                            </p>
                            <div className='flex flex-wrap gap-2 mb-4'>
                                <span className='font-mono text-xs px-3 py-2 border border-red-400/40 text-red-700 dark:text-red-400 bg-red-400/5 rounded'>
                                    eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9
                                </span>
                                <span className='font-mono text-xs text-muted-foreground self-center'>
                                    .
                                </span>
                                <span className='font-mono text-xs px-3 py-2 border border-purple-400/40 text-purple-700 dark:text-purple-400 bg-purple-400/5 rounded'>
                                    eyJzdWIiOiJ1c2VyXzEyMyIsInJvbGUiOiJhZG1pbiJ9
                                </span>
                                <span className='font-mono text-xs text-muted-foreground self-center'>
                                    .
                                </span>
                                <span className='font-mono text-xs px-3 py-2 border border-emerald-400/40 text-emerald-700 dark:text-emerald-400 bg-emerald-400/5 rounded'>
                                    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
                                </span>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-3 text-xs'>
                                <div className='border border-red-400/20 rounded p-3 bg-red-400/5'>
                                    <p className='text-red-700 dark:text-red-400 font-mono font-bold mb-1'>
                                        HEADER
                                    </p>
                                    <p className='text-muted-foreground font-mono'>
                                        alg: RS256
                                    </p>
                                    <p className='text-muted-foreground font-mono'>
                                        typ: JWT
                                    </p>
                                    <p className='text-muted-foreground mt-1'>
                                        Algorithm + token type
                                    </p>
                                </div>
                                <div className='border border-purple-400/20 rounded p-3 bg-purple-400/5'>
                                    <p className='text-purple-700 dark:text-purple-400 font-mono font-bold mb-1'>
                                        PAYLOAD
                                    </p>
                                    <p className='text-muted-foreground font-mono'>
                                        sub: user_123
                                    </p>
                                    <p className='text-muted-foreground font-mono'>
                                        role: admin
                                    </p>
                                    <p className='text-muted-foreground font-mono'>
                                        exp: 1735689600
                                    </p>
                                    <p className='text-muted-foreground mt-1'>
                                        Claims — user data
                                    </p>
                                </div>
                                <div className='border border-emerald-400/20 rounded p-3 bg-emerald-400/5'>
                                    <p className='text-emerald-700 dark:text-emerald-400 font-mono font-bold mb-1'>
                                        SIGNATURE
                                    </p>
                                    <p className='text-muted-foreground font-mono text-xs'>
                                        HMAC_SHA256(
                                    </p>
                                    <p className='text-muted-foreground font-mono text-xs pl-2'>
                                        base64(header) +
                                    </p>
                                    <p className='text-muted-foreground font-mono text-xs pl-2'>
                                        &quot;.&quot; +
                                    </p>
                                    <p className='text-muted-foreground font-mono text-xs pl-2'>
                                        base64(payload),
                                    </p>
                                    <p className='text-muted-foreground font-mono text-xs pl-2'>
                                        secret
                                    </p>
                                    <p className='text-muted-foreground font-mono text-xs'>
                                        )
                                    </p>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'typescript',
                    filename: 'auth.ts — JWT generation & verification',
                    code: `import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;

// ─────────────────────────────────────────────
// JWT Token Generate করুন
// ─────────────────────────────────────────────
export function generateTokens(userId: string, role: string) {
    // Access token — short-lived (15 minutes)
    const accessToken = jwt.sign(
        { sub: userId, role, type: 'access' },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m', algorithm: 'RS256' }
    );

    // Refresh token — long-lived (7 days), stored in DB
    const refreshToken = jwt.sign(
        { sub: userId, type: 'refresh' },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d', algorithm: 'RS256' }
    );

    return { accessToken, refreshToken };
}

// ─────────────────────────────────────────────
// JWT Middleware — Request verify করুন
// ─────────────────────────────────────────────
export function authenticate(req: Request, res: Response, next: NextFunction) {
    // Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as {
            sub: string;
            role: string;
            exp: number;
        };

        // Attach user info to request
        (req as any).user = { id: payload.sub, role: payload.role };
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// ─────────────────────────────────────────────
// Python equivalent (FastAPI)
// ─────────────────────────────────────────────
/*
from jose import JWTError, jwt
from datetime import datetime, timedelta

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "RS256"

def create_access_token(user_id: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(minutes=15),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
*/`,
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Approach',
                        'কীভাবে কাজ করে',
                        'Scalability',
                        'Best For',
                        'Downside',
                    ],
                    rows: [
                        [
                            <span className='font-mono font-bold text-primary'>
                                Session-based
                            </span>,
                            'Server-side session store। Cookie-তে session ID।',
                            'Sticky session দরকার বা shared Redis',
                            'Monolith, server-rendered apps',
                            'Stateful — horizontal scaling কঠিন',
                        ],
                        [
                            <span className='font-mono font-bold text-purple-700 dark:text-purple-400'>
                                JWT
                            </span>,
                            'Self-contained token। Server-side storage নেই।',
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>
                                Excellent — stateless
                            </span>,
                            'Microservices, SPA, mobile apps',
                            'Token revocation কঠিন। Size বড়।',
                        ],
                        [
                            <span className='font-mono font-bold text-orange-700 dark:text-orange-400'>
                                OAuth2
                            </span>,
                            'Third-party authorization। Delegation protocol।',
                            'Delegated auth — scalable',
                            '"Login with Google" type flows',
                            'Complex flow, setup overhead',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: '⚠️ JWT Token কোথায় Store করবেন?',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>localStorage — AVOID:</strong> XSS
                                attack-এ easily steal করা যায়। JavaScript দিয়ে
                                access।
                            </p>
                            <p>
                                <strong>HttpOnly Cookie — RECOMMENDED:</strong>{' '}
                                JavaScript access করতে পারে না। CSRF protection
                                দরকার (SameSite=Strict)।
                            </p>
                            <p>
                                <strong>Memory (React state) — OK:</strong>{' '}
                                Page refresh-এ logout। Refresh token HttpOnly
                                cookie-তে রাখুন।
                            </p>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'oauth2-flow',
            subHeader: { index: '003', title: 'OAuth2 & OIDC' },
            title: (
                <SectionTitle>
                    OAuth2 & OpenID Connect — Delegated Authorization
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            OAuth2 হলো{' '}
                            <strong className='text-foreground'>
                                authorization framework
                            </strong>{' '}
                            — আপনি কাউকে আপনার হয়ে কিছু করার permission দিচ্ছ।
                            &quot;Login with Google&quot; বা GitHub OAuth —
                            এগুলো OAuth2। OpenID Connect (OIDC) হলো OAuth2-এর
                            উপর{' '}
                            <strong className='text-foreground'>
                                identity layer
                            </strong>{' '}
                            — authentication add করে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    steps: [
                        {
                            title: (
                                <span className='font-mono text-primary'>
                                    Step 1 — User clicks &quot;Login with
                                    Google&quot;
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    App (Client) user-কে Google-এর Authorization
                                    Server-এ redirect করে। URL-এ থাকে:{' '}
                                    <code className='font-mono text-xs bg-muted/50 px-1 rounded'>
                                        client_id, redirect_uri, scope, state,
                                        response_type=code
                                    </code>
                                    । State parameter CSRF prevent করে।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-emerald-700 dark:text-emerald-400'>
                                    Step 2 — User Google-এ Login করে Consent দেয়
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Google user-কে authenticate করে এবং permission
                                    চায় (email, profile access)। User consent
                                    করলেন Google একটা{' '}
                                    <strong>authorization code</strong> generate
                                    করে।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-purple-700 dark:text-purple-400'>
                                    Step 3 — Authorization Code App-এ Redirect হয়
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Google আমাদের app-এর{' '}
                                    <code className='font-mono text-xs bg-muted/50 px-1 rounded'>
                                        redirect_uri?code=AUTH_CODE&state=xyz
                                    </code>{' '}
                                    এ redirect করে। এই code short-lived (~10 min)।
                                    Exposed হলেও একবার use করা যায়।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-orange-700 dark:text-orange-400'>
                                    Step 4 — Backend Code দিয়ে Token Exchange করে
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    App backend Google-এ POST করে: code +
                                    client_secret দিয়ে। Google দেয়:
                                    access_token, id_token (JWT), refresh_token।
                                    এটা server-side — client secret exposed হয়
                                    না।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-emerald-700 dark:text-emerald-400'>
                                    Step 5 — Access Token দিয়ে Resource Access করুন
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Access token দিয়ে Google APIs call করুন
                                    (email, calendar)। id_token (OIDC) দিয়ে user
                                    identity verify করুন। Token expire হলে refresh
                                    token দিয়ে নতুন access token নাও।
                                </span>
                            ),
                        },
                    ],
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Grant Type',
                        'কখন Use করবেন',
                        'Security Level',
                        'Example',
                    ],
                    rows: [
                        [
                            <span className='font-mono text-primary font-semibold'>
                                Authorization Code
                            </span>,
                            'Web apps — server-side code exchange',
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>
                                Highest
                            </span>,
                            '"Login with Google" — web app',
                        ],
                        [
                            <span className='font-mono text-purple-700 dark:text-purple-400 font-semibold'>
                                Authorization Code + PKCE
                            </span>,
                            'SPA, Mobile apps — no client secret',
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>
                                High
                            </span>,
                            'React SPA, iOS/Android app',
                        ],
                        [
                            <span className='font-mono text-orange-700 dark:text-orange-400 font-semibold'>
                                Client Credentials
                            </span>,
                            'Machine-to-machine, no user involved',
                            'Medium',
                            'Microservice A calls Microservice B',
                        ],
                        [
                            <span className='font-mono text-red-700 dark:text-red-400 font-semibold'>
                                Resource Owner Password
                            </span>,
                            'Legacy — highly trusted first-party apps',
                            <span className='text-red-700 dark:text-red-400 font-semibold'>
                                Low — AVOID
                            </span>,
                            'Deprecated — direct username/password',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 OAuth2 vs OpenID Connect পার্থক্য',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>OAuth2:</strong> Authorization protocol —
                                &quot;এই app-কে আমার Gmail read করতে দিন।&quot;
                                Access control, delegation।
                            </p>
                            <p>
                                <strong>OpenID Connect:</strong> OAuth2-এর উপর
                                authentication layer — &quot;এই user কে?&quot;
                                id_token (JWT) দেয় যাতে user info থাকে।
                            </p>
                            <p className='font-mono text-xs text-muted-foreground mt-1'>
                                → Rule: OAuth2 = Authorization। OIDC =
                                Authentication। Login flow-এ OIDC use করুন।
                            </p>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'authorization',
            subHeader: { index: '004', title: 'Authorization' },
            title: (
                <SectionTitle>
                    Authorization — আপনি কী করতে পারবেন? RBAC vs ABAC
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Authentication verify করে{' '}
                            <strong className='text-foreground'>
                                &quot;আপনি কে&quot;
                            </strong>
                            , Authorization decide করে{' '}
                            <strong className='text-foreground'>
                                &quot;আপনি কী করতে পারবেন&quot;
                            </strong>
                            । দুটো major model:{' '}
                            <strong className='text-foreground'>RBAC</strong>{' '}
                            (Role-Based Access Control) এবং{' '}
                            <strong className='text-foreground'>ABAC</strong>{' '}
                            (Attribute-Based Access Control)।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Feature',
                        'RBAC',
                        'ABAC',
                        'কোনটা কখন?',
                    ],
                    rows: [
                        [
                            'Definition',
                            'Role দিয়ে access। admin, user, moderator।',
                            'Attributes দিয়ে access। department, time, location।',
                            '—',
                        ],
                        [
                            'Granularity',
                            'Coarse-grained — role level',
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>
                                Fine-grained — attribute level
                            </span>,
                            'Complex rules = ABAC',
                        ],
                        [
                            'Complexity',
                            <span className='text-emerald-700 dark:text-emerald-400'>
                                Simple to implement
                            </span>,
                            'Policy-based, complex rules',
                            'Simple teams = RBAC',
                        ],
                        [
                            'Example',
                            'admin পারে delete করতে, user পারে না',
                            'Finance dept + working hours + own documents',
                            'Banks, healthcare = ABAC',
                        ],
                        [
                            'Performance',
                            <span className='text-emerald-700 dark:text-emerald-400'>
                                Fast — role check
                            </span>,
                            'Slower — multiple attribute evaluation',
                            'High traffic = RBAC preferred',
                        ],
                        [
                            'Real-world use',
                            'GitHub (owner/member/outside), AWS IAM roles',
                            'AWS IAM policies, Google Cloud IAM conditions',
                            'Most systems = hybrid',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'typescript',
                    filename: 'authorization-middleware.ts',
                    code: `import { Request, Response, NextFunction } from 'express';

// ─────────────────────────────────────────────
// RBAC — Role-Based Authorization Middleware
// ─────────────────────────────────────────────
export function requireRole(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({ error: 'Unauthenticated' });
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({
                error: 'Forbidden',
                required: roles,
                current: user.role,
            });
        }

        next();
    };
}

// Usage:
// app.delete('/posts/:id', authenticate, requireRole('admin', 'moderator'), deletePost);
// app.get('/reports', authenticate, requireRole('admin'), getReports);

// ─────────────────────────────────────────────
// ABAC — Attribute-Based Authorization
// ─────────────────────────────────────────────
interface Policy {
    action: string;
    condition: (user: any, resource: any, env: any) => boolean;
}

const policies: Policy[] = [
    {
        action: 'document:read',
        condition: (user, resource, env) =>
            // User নিজের department-এর document read করতে পারবেন
            // অথবা admin সবসময় পারবেন
            user.department === resource.department || user.role === 'admin',
    },
    {
        action: 'document:write',
        condition: (user, resource, env) =>
            // শুধু working hours-এ এবং নিজের document
            user.id === resource.ownerId &&
            env.hour >= 9 &&
            env.hour <= 18,
    },
    {
        action: 'report:export',
        condition: (user, resource, env) =>
            // Finance dept + senior level + weekday only
            user.department === 'finance' &&
            user.level >= 3 &&
            env.dayOfWeek >= 1 && env.dayOfWeek <= 5,
    },
];

export function checkPolicy(action: string, resource: any) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        const env = {
            hour: new Date().getHours(),
            dayOfWeek: new Date().getDay(),
            ip: req.ip,
        };

        const policy = policies.find(p => p.action === action);
        if (!policy || !policy.condition(user, resource, env)) {
            return res.status(403).json({ error: 'Policy denied' });
        }
        next();
    };
}`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Principle of Least Privilege',
                    content: (
                        <p>
                            সবসময় minimum permission দিন। একটা microservice
                            শুধু সেটাই access করতে পারবেন যা তার কাজে দরকার।
                            Database service account-এর শুধু SELECT permission,
                            না সব tables-এ full access। এটা breach হলে damage
                            কমে।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'encryption',
            subHeader: { index: '005', title: 'Encryption & TLS' },
            title: (
                <SectionTitle>
                    Encryption & TLS/mTLS — Data Protect করুন
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Encryption দুই ধরনের:{' '}
                            <strong className='text-foreground'>
                                Encryption in Transit
                            </strong>{' '}
                            (data move করার সময়) এবং{' '}
                            <strong className='text-foreground'>
                                Encryption at Rest
                            </strong>{' '}
                            (storage-এ)। TLS handle করে transit encryption।
                            mTLS microservices-এর মধ্যে mutual authentication
                            নিশ্চিত করে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Type',
                        'Symmetric',
                        'Asymmetric',
                    ],
                    rows: [
                        [
                            'Key',
                            'একটাই key — encrypt ও decrypt',
                            'Public key (encrypt) + Private key (decrypt)',
                        ],
                        [
                            'Speed',
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>
                                Fast — bulk data জন্য ideal
                            </span>,
                            'Slow — key exchange জন্য use করুন',
                        ],
                        [
                            'Algorithm',
                            'AES-256, ChaCha20',
                            'RSA-2048, ECDSA, Ed25519',
                        ],
                        [
                            'Problem',
                            'Key distribution — কীভাবে share করবেন?',
                            'Computationally expensive',
                        ],
                        [
                            'HTTPS-এ ব্যবহার',
                            'Data transfer phase — AES session key',
                            'TLS Handshake — key exchange',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                TLS Handshake Flow — HTTPS Connection
                            </p>
                            <svg
                                viewBox='0 0 620 310'
                                className='w-full max-w-2xl mx-auto'>
                                <defs>
                                    <marker
                                        id='arrTls'
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
                                        id='arrTlsG'
                                        markerWidth='8'
                                        markerHeight='8'
                                        refX='6'
                                        refY='3'
                                        orient='auto'>
                                        <path
                                            d='M0,0 L0,6 L8,3 z'
                                            fill='#10b981'
                                        />
                                    </marker>
                                    <marker
                                        id='arrTlsB'
                                        markerWidth='8'
                                        markerHeight='8'
                                        refX='6'
                                        refY='3'
                                        orient='auto'>
                                        <path
                                            d='M0,0 L0,6 L8,3 z'
                                            fill='#06b6d4'
                                        />
                                    </marker>
                                </defs>

                                {/* Column headers */}
                                <rect
                                    x='60'
                                    y='15'
                                    width='120'
                                    height='35'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#06b6d4'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='120'
                                    y='37'
                                    textAnchor='middle'
                                    fill='#06b6d4'
                                    fontFamily='monospace'
                                    fontSize='10'
                                    fontWeight='bold'>
                                    CLIENT
                                </text>
                                <rect
                                    x='440'
                                    y='15'
                                    width='120'
                                    height='35'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='500'
                                    y='37'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='10'
                                    fontWeight='bold'>
                                    SERVER
                                </text>

                                {/* Vertical timelines */}
                                <line
                                    x1='120'
                                    y1='50'
                                    x2='120'
                                    y2='295'
                                    stroke='#1e3a5f'
                                    strokeWidth='1'
                                    strokeDasharray='3,2'
                                />
                                <line
                                    x1='500'
                                    y1='50'
                                    x2='500'
                                    y2='295'
                                    stroke='#1e3a5f'
                                    strokeWidth='1'
                                    strokeDasharray='3,2'
                                />

                                {/* Step 1: ClientHello */}
                                <path
                                    d='M 120 75 L 500 75'
                                    stroke='#06b6d4'
                                    strokeWidth='1.5'
                                    markerEnd='url(#arrTlsB)'
                                />
                                <text
                                    x='310'
                                    y='68'
                                    textAnchor='middle'
                                    fill='#06b6d4'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    ClientHello (TLS version, cipher suites, random)
                                </text>

                                {/* Step 2: ServerHello + Certificate */}
                                <path
                                    d='M 500 105 L 120 105'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                    markerEnd='url(#arrTlsG)'
                                />
                                <text
                                    x='310'
                                    y='98'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    ServerHello + Certificate (Public Key)
                                </text>

                                {/* Step 3: Pre-master secret */}
                                <path
                                    d='M 120 140 L 500 140'
                                    stroke='#06b6d4'
                                    strokeWidth='1.5'
                                    markerEnd='url(#arrTlsB)'
                                />
                                <text
                                    x='310'
                                    y='133'
                                    textAnchor='middle'
                                    fill='#06b6d4'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Pre-master Secret (encrypted with Server Public Key)
                                </text>

                                {/* Step 4: Session keys derived */}
                                <text
                                    x='120'
                                    y='170'
                                    textAnchor='middle'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    ↓ derive session keys
                                </text>
                                <text
                                    x='500'
                                    y='170'
                                    textAnchor='middle'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    ↓ derive session keys
                                </text>

                                {/* Step 5: Finished */}
                                <path
                                    d='M 120 195 L 500 195'
                                    stroke='#06b6d4'
                                    strokeWidth='1.5'
                                    markerEnd='url(#arrTlsB)'
                                />
                                <text
                                    x='310'
                                    y='188'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Finished (MAC verify)
                                </text>
                                <path
                                    d='M 500 215 L 120 215'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                    markerEnd='url(#arrTlsG)'
                                />
                                <text
                                    x='310'
                                    y='208'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Finished (MAC verify)
                                </text>

                                {/* Step 6: Encrypted data */}
                                <path
                                    d='M 120 255 L 500 255'
                                    stroke='#8b5cf6'
                                    strokeWidth='2'
                                    markerEnd='url(#arrTls)'
                                />
                                <text
                                    x='310'
                                    y='248'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='9'
                                    fontWeight='bold'>
                                    Application Data (AES-256 symmetric encryption)
                                </text>

                                {/* Labels on the side */}
                                <text
                                    x='8'
                                    y='115'
                                    fill='#475569'
                                    fontFamily='monospace'
                                    fontSize='7'
                                    transform='rotate(-90, 8, 115)'>
                                    ASYMMETRIC (key exchange)
                                </text>
                                <text
                                    x='8'
                                    y='260'
                                    fill='#475569'
                                    fontFamily='monospace'
                                    fontSize='7'
                                    transform='rotate(-90, 8, 260)'>
                                    SYMMETRIC (data)
                                </text>

                                {/* Footer */}
                                <text
                                    x='10'
                                    y='296'
                                    fill='#475569'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    TLS 1.3 — 1-RTT handshake। TLS 1.2 — 2-RTT
                                </text>
                            </svg>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 mTLS — Mutual TLS (Service-to-Service)',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                Regular TLS-এ শুধু server certificate present
                                করে। mTLS-এ{' '}
                                <strong>
                                    client ও server উভয়ই certificate present
                                </strong>{' '}
                                করে — mutual authentication।
                            </p>
                            <p>
                                Microservices-এ Order Service কি সত্যিই Payment
                                Service? mTLS নিশ্চিত করে। Service mesh (Istio,
                                Linkerd) automatically mTLS handle করে।
                            </p>
                            <p className='font-mono text-xs text-muted-foreground'>
                                → Zero Trust Architecture-এর core component।
                                Internal network-ও trust করুন না।
                            </p>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'zero-trust',
            subHeader: { index: '006', title: 'Zero Trust Architecture' },
            title: (
                <SectionTitle>
                    Zero Trust — &quot;Never Trust, Always Verify&quot;
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Traditional security model বলতো:{' '}
                            <strong className='text-foreground'>
                                &quot;Castle and Moat&quot;
                            </strong>{' '}
                            — ভেতরে যা আছে সব trusted। Zero Trust বলে:{' '}
                            <strong className='text-foreground'>
                                &quot;Never trust, always verify&quot;
                            </strong>{' '}
                            — internal network-ও trust করুন না। প্রতিটা request
                            verify করুন।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                Perimeter Security vs Zero Trust
                            </p>
                            <svg
                                viewBox='0 0 640 260'
                                className='w-full max-w-2xl mx-auto'>
                                {/* LEFT: Perimeter Security */}
                                <text
                                    x='150'
                                    y='18'
                                    textAnchor='middle'
                                    fill='#ef4444'
                                    fontFamily='monospace'
                                    fontSize='9'
                                    fontWeight='bold'>
                                    PERIMETER SECURITY (OLD)
                                </text>
                                {/* Outer wall */}
                                <rect
                                    x='20'
                                    y='25'
                                    width='260'
                                    height='190'
                                    rx='6'
                                    fill='transparent'
                                    stroke='#ef4444'
                                    strokeWidth='2'
                                    strokeDasharray='6,3'
                                />
                                <text
                                    x='150'
                                    y='40'
                                    textAnchor='middle'
                                    fill='#ef4444'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Firewall / VPN
                                </text>
                                {/* Trusted inside */}
                                <rect
                                    x='55'
                                    y='55'
                                    width='80'
                                    height='40'
                                    rx='3'
                                    fill='rgba(16,185,129,0.1)'
                                    stroke='#10b981'
                                    strokeWidth='1'
                                />
                                <text
                                    x='95'
                                    y='77'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Service A
                                </text>
                                <rect
                                    x='165'
                                    y='55'
                                    width='80'
                                    height='40'
                                    rx='3'
                                    fill='rgba(16,185,129,0.1)'
                                    stroke='#10b981'
                                    strokeWidth='1'
                                />
                                <text
                                    x='205'
                                    y='77'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Service B
                                </text>
                                <rect
                                    x='55'
                                    y='120'
                                    width='80'
                                    height='40'
                                    rx='3'
                                    fill='rgba(16,185,129,0.1)'
                                    stroke='#10b981'
                                    strokeWidth='1'
                                />
                                <text
                                    x='95'
                                    y='142'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Database
                                </text>
                                <rect
                                    x='165'
                                    y='120'
                                    width='80'
                                    height='40'
                                    rx='3'
                                    fill='rgba(16,185,129,0.1)'
                                    stroke='#10b981'
                                    strokeWidth='1'
                                />
                                <text
                                    x='205'
                                    y='142'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Admin Panel
                                </text>
                                <text
                                    x='150'
                                    y='200'
                                    textAnchor='middle'
                                    fill='#94a3b8'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    ভেতরে সব trusted — attacker ঢুকলে সব access
                                </text>
                                <text
                                    x='150'
                                    y='212'
                                    textAnchor='middle'
                                    fill='#ef4444'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    ✗ Lateral movement possible
                                </text>

                                {/* RIGHT: Zero Trust */}
                                <text
                                    x='490'
                                    y='18'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='9'
                                    fontWeight='bold'>
                                    ZERO TRUST (NEW)
                                </text>
                                {/* Each service has its own boundary */}
                                <rect
                                    x='355'
                                    y='35'
                                    width='80'
                                    height='60'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#06b6d4'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='395'
                                    y='57'
                                    textAnchor='middle'
                                    fill='#06b6d4'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Service A
                                </text>
                                <text
                                    x='395'
                                    y='70'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='6'>
                                    mTLS + JWT
                                </text>
                                <text
                                    x='395'
                                    y='83'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='6'>
                                    verify every req
                                </text>

                                <rect
                                    x='465'
                                    y='35'
                                    width='80'
                                    height='60'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#06b6d4'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='505'
                                    y='57'
                                    textAnchor='middle'
                                    fill='#06b6d4'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Service B
                                </text>
                                <text
                                    x='505'
                                    y='70'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='6'>
                                    mTLS + JWT
                                </text>
                                <text
                                    x='505'
                                    y='83'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='6'>
                                    verify every req
                                </text>

                                <rect
                                    x='355'
                                    y='120'
                                    width='80'
                                    height='60'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='395'
                                    y='142'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Database
                                </text>
                                <text
                                    x='395'
                                    y='155'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='6'>
                                    Least privilege
                                </text>
                                <text
                                    x='395'
                                    y='168'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='6'>
                                    Dynamic creds
                                </text>

                                <rect
                                    x='465'
                                    y='120'
                                    width='80'
                                    height='60'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='505'
                                    y='142'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Admin Panel
                                </text>
                                <text
                                    x='505'
                                    y='155'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='6'>
                                    MFA required
                                </text>
                                <text
                                    x='505'
                                    y='168'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='6'>
                                    audit log
                                </text>

                                <text
                                    x='490'
                                    y='200'
                                    textAnchor='middle'
                                    fill='#94a3b8'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    প্রতিটা service isolated — breach confined
                                </text>
                                <text
                                    x='490'
                                    y='212'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    ✓ Lateral movement blocked
                                </text>

                                {/* Divider */}
                                <line
                                    x1='320'
                                    y1='20'
                                    x2='320'
                                    y2='230'
                                    stroke='#1e293b'
                                    strokeWidth='1.5'
                                />
                            </svg>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-5'>
                            <p className='font-mono text-xs uppercase tracking-widest text-primary mb-4'>
                                ✅ Zero Trust Implementation Checklist
                            </p>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                {[
                                    'প্রতিটা service request-এ identity verify করুন (mTLS)',
                                    'Least privilege — minimum necessary access',
                                    'Network segment করুন — microservice isolation',
                                    'সব traffic encrypt করুন (internal ও external)',
                                    'Continuous monitoring — anomaly detection',
                                    'Dynamic credentials — Vault secrets rotation',
                                    'Multi-Factor Authentication সব admin access-এ',
                                    'Audit log — সব action trackable হতে হবে',
                                    'Device health check — endpoint security',
                                    'Just-in-time access — temporary elevated privileges',
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className='flex items-start gap-2 text-sm text-muted-foreground py-1.5 border-b border-border/50 last:border-0'>
                                        <span className='text-primary mt-0.5 flex-shrink-0'>
                                            →
                                        </span>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '🎯 Zero Trust in Interview',
                    content: (
                        <p>
                            Interview-এ বলুন:{' '}
                            <strong>
                                &quot;আমি assume করি network already
                                compromised&quot;
                            </strong>{' '}
                            — এটা Zero Trust mindset। Internal service calls-এ
                            mTLS, JWT validation, এবং Vault-based credential
                            rotation mention করলেন senior-level approach দেখা
                            যায়।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'secrets-management',
            subHeader: { index: '007', title: 'Secrets Management' },
            title: (
                <SectionTitle>
                    Secrets Management — HashiCorp Vault & AWS Secrets Manager
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Database passwords, API keys, TLS certificates —
                            এগুলো{' '}
                            <strong className='text-foreground'>secrets</strong>।
                            Production systems-এ secrets hardcode করা বা .env
                            file-এ রাখা catastrophic হতে পারে। Dedicated secrets
                            management tools দরকার:{' '}
                            <strong className='text-foreground'>
                                HashiCorp Vault
                            </strong>{' '}
                            এবং{' '}
                            <strong className='text-foreground'>
                                AWS Secrets Manager
                            </strong>
                            ।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: '⚠️ Hardcoded Credentials — Never Do This!',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>GitHub-এ secret leak</strong> হলে
                                automated bots minutes-এর মধ্যে exploit করে।
                                2023-এ Toyota-র AWS key GitHub-এ ছিল — লক্ষ
                                customer data exposed।
                            </p>
                            <p className='font-mono text-xs bg-red-500/10 border border-red-500/20 rounded p-2 text-red-700 dark:text-red-400'>
                                {`// ❌ NEVER DO THIS`}
                                <br />
                                {`const DB_PASSWORD = "super_secret_123";`}
                                <br />
                                {`const API_KEY = "sk-prod-abc123xyz";`}
                            </p>
                            <p>
                                Git history-তে থাকলেও danger — secret
                                rotate করতে হবে।{' '}
                                <strong>
                                    git-secrets বা truffleHog দিয়ে scan করুন।
                                </strong>
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'typescript',
                    filename: 'vault-secrets.ts — Dynamic Secret Rotation',
                    code: `import axios from 'axios';
import { Pool } from 'pg';

const VAULT_ADDR = process.env.VAULT_ADDR!;
const VAULT_TOKEN = process.env.VAULT_TOKEN!; // Service token (short-lived)

// ─────────────────────────────────────────────
// HashiCorp Vault — Dynamic Database Credentials
// ─────────────────────────────────────────────
interface VaultDBCreds {
    username: string;
    password: string;
    lease_duration: number; // seconds
    lease_id: string;
}

async function getDynamicDBCredentials(): Promise<VaultDBCreds> {
    // Vault generates temporary DB credentials on demand
    const response = await axios.get(
        \`\${VAULT_ADDR}/v1/database/creds/my-role\`,
        { headers: { 'X-Vault-Token': VAULT_TOKEN } }
    );

    return {
        username: response.data.data.username,   // e.g., "v-service-xYz123"
        password: response.data.data.password,
        lease_duration: response.data.lease_duration, // e.g., 3600 (1 hour)
        lease_id: response.data.lease_id,
    };
}

// ─────────────────────────────────────────────
// Auto-Rotating DB Connection Pool
// ─────────────────────────────────────────────
class ManagedDBPool {
    private pool: Pool | null = null;
    private leaseExpiry: number = 0;
    private leaseId: string = '';

    async getPool(): Promise<Pool> {
        const now = Math.floor(Date.now() / 1000);

        // Renew credentials 5 minutes before expiry
        if (!this.pool || now >= this.leaseExpiry - 300) {
            await this.rotateCredentials();
        }

        return this.pool!;
    }

    private async rotateCredentials() {
        console.log('[Vault] Fetching new DB credentials...');

        // Revoke old lease first
        if (this.leaseId) {
            await axios.put(
                \`\${VAULT_ADDR}/v1/sys/leases/revoke\`,
                { lease_id: this.leaseId },
                { headers: { 'X-Vault-Token': VAULT_TOKEN } }
            );
        }

        const creds = await getDynamicDBCredentials();
        this.leaseId = creds.lease_id;
        this.leaseExpiry = Math.floor(Date.now() / 1000) + creds.lease_duration;

        // Destroy old pool gracefully
        if (this.pool) {
            await this.pool.end();
        }

        this.pool = new Pool({
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: creds.username,    // Vault-generated temp user
            password: creds.password, // Vault-generated temp password
            port: 5432,
            ssl: { rejectUnauthorized: true },
        });

        console.log(\`[Vault] DB creds rotated. Expires in \${creds.lease_duration}s\`);
    }
}

// ─────────────────────────────────────────────
// AWS Secrets Manager Alternative
// ─────────────────────────────────────────────
import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

const secretsClient = new SecretsManagerClient({ region: 'ap-southeast-1' });

async function getSecret(secretName: string): Promise<Record<string, string>> {
    const cmd = new GetSecretValueCommand({ SecretId: secretName });
    const response = await secretsClient.send(cmd);

    if (!response.SecretString) throw new Error('Secret not found');
    return JSON.parse(response.SecretString);
}

// Usage:
// const dbCreds = await getSecret('prod/myapp/db');
// const { username, password, host } = dbCreds;`,
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Feature',
                        'HashiCorp Vault',
                        'AWS Secrets Manager',
                        'GCP Secret Manager',
                    ],
                    rows: [
                        [
                            'Dynamic Secrets',
                            <span className='text-emerald-700 dark:text-emerald-400'>
                                ✓ DB, SSH, PKI
                            </span>,
                            <span className='text-orange-700 dark:text-orange-400'>
                                Limited (RDS only)
                            </span>,
                            '✗ Static only',
                        ],
                        [
                            'Auto Rotation',
                            <span className='text-emerald-700 dark:text-emerald-400'>✓ Built-in</span>,
                            <span className='text-emerald-700 dark:text-emerald-400'>✓ Lambda-based</span>,
                            '✓ Cloud Functions',
                        ],
                        [
                            'Multi-cloud',
                            <span className='text-emerald-700 dark:text-emerald-400'>
                                ✓ Any cloud / on-prem
                            </span>,
                            'AWS only',
                            'GCP only',
                        ],
                        [
                            'Pricing',
                            'Open source + Enterprise',
                            '$0.40/secret/month',
                            '$0.06/10K access',
                        ],
                        [
                            'Best For',
                            <span className='text-primary font-semibold'>
                                Complex multi-cloud setups
                            </span>,
                            'AWS-native apps',
                            'GCP-native apps',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Secret Scanning — Prevent Leaks Early',
                    content: (
                        <p>
                            Git pre-commit hook-এ{' '}
                            <strong>git-secrets</strong> বা{' '}
                            <strong>detect-secrets</strong> run করুন। CI/CD
                            pipeline-এ <strong>TruffleHog</strong> বা{' '}
                            <strong>GitLeaks</strong> add করুন। GitHub Advanced
                            Security automatically secret scan করে। একবার push
                            হলে history-তে থাকে — rotate করতে হবে।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'owasp-interview',
            subHeader: { index: '008', title: 'OWASP & Interview Tips' },
            title: (
                <SectionTitle>
                    OWASP Top 10 & Security Interview Tips
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            OWASP (Open Web Application Security Project) প্রতি
                            কয়েক বছরে web security-র top risks publish করে।
                            System design interview-এ এগুলো জানা থাকলে
                            security discussion অনেক productive হয়।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        '#',
                        'Vulnerability',
                        'কী হয়?',
                        'Mitigation',
                        'Real Example',
                    ],
                    rows: [
                        [
                            <span className='font-mono font-bold text-red-700 dark:text-red-400'>
                                #1
                            </span>,
                            'Broken Access Control',
                            'Unauthorized user অন্যের data access করতে পারে',
                            'RBAC/ABAC, server-side check, JWT validation',
                            'IDOR — /users/123 → /users/456',
                        ],
                        [
                            <span className='font-mono font-bold text-red-700 dark:text-red-400'>
                                #2
                            </span>,
                            'Cryptographic Failures',
                            'Weak/no encryption — data exposed',
                            'TLS everywhere, AES-256, bcrypt passwords',
                            'MD5 password hash, HTTP instead of HTTPS',
                        ],
                        [
                            <span className='font-mono font-bold text-orange-700 dark:text-orange-400'>
                                #3
                            </span>,
                            'Injection (SQL, NoSQL, LDAP)',
                            'Malicious input database execute করে',
                            'Prepared statements, parameterized queries, ORM',
                            `SELECT * FROM users WHERE id='1 OR 1=1'`,
                        ],
                        [
                            <span className='font-mono font-bold text-orange-700 dark:text-orange-400'>
                                #4
                            </span>,
                            'Insecure Design',
                            'Security design-এ না থাকলে পরে fix কঠিন',
                            'Threat modeling, security by design, code review',
                            'Rate limiting না থাকলে brute force possible',
                        ],
                        [
                            <span className='font-mono font-bold text-yellow-700 dark:text-yellow-400'>
                                #7
                            </span>,
                            'XSS (Cross-Site Scripting)',
                            'Malicious JS inject করে victim browser-এ run হয়',
                            'Output encoding, CSP headers, HttpOnly cookies',
                            `Stored XSS: comment box এ <script>steal()</script>`,
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-5'>
                            <p className='font-mono text-xs uppercase tracking-widest text-primary mb-4'>
                                🎯 Security Interview Questions — Pattern Guide
                            </p>
                            <div className='space-y-4'>
                                {[
                                    {
                                        q: 'আপনি API design করার সময় কোন security layer গুলো add করবেন?',
                                        a: 'API Gateway তে: TLS termination, rate limiting, JWT validation, WAF। Service level এ: mTLS, RBAC, input validation। DB level এ: encryption at rest, Vault credentials।',
                                    },
                                    {
                                        q: 'User password কীভাবে store করবেন?',
                                        a: 'Never plaintext। bcrypt বা Argon2 দিয়ে hash করুন (cost factor ≥ 12)। Salt automatically added। Rainbow table attack defend হয়। MD5/SHA-1 avoid করুন।',
                                    },
                                    {
                                        q: 'Microservices এ service-to-service auth কীভাবে করবেন?',
                                        a: 'mTLS (mutual TLS) — service mesh (Istio) automatically handle করে। অথবা OAuth2 Client Credentials flow — service identity।',
                                    },
                                    {
                                        q: 'Rate limiting কেন দরকার এবং কোথায় implement করবেন?',
                                        a: 'Brute force, DDoS, credential stuffing prevent করতে। API Gateway-এ (per IP, per user)। Redis দিয়ে sliding window counter। 429 Too Many Requests।',
                                    },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className='border border-border rounded p-4'>
                                        <p className='text-sm font-semibold text-foreground mb-2'>
                                            Q: {item.q}
                                        </p>
                                        <p className='text-sm text-muted-foreground leading-relaxed'>
                                            <span className='text-primary font-mono text-xs mr-1'>
                                                A:
                                            </span>
                                            {item.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Security Interview-এর Common Patterns',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>1. Defence in Depth:</strong> একটা layer
                                fail হলেও অন্যগুলো protect করে। TLS + JWT +
                                RBAC + audit log।
                            </p>
                            <p>
                                <strong>2. Threat Modeling:</strong> &quot;এই
                                system-এ কে attack করতে পারে?&quot; — external
                                attacker, malicious insider, compromised service।
                            </p>
                            <p>
                                <strong>3. Security != Complexity:</strong>{' '}
                                Simple এবং correct better than complex এবং
                                insecure।
                            </p>
                            <p>
                                <strong>4. Zero Trust Mindset:</strong> &quot;আমি
                                internal network trust করি না&quot; — mTLS,
                                service identity।
                            </p>
                            <p>
                                <strong>5. Fail Secure:</strong> System fail
                                হলে secure state-এ যাবেন — deny by default।
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                            {[
                                {
                                    label: 'CIA Triad',
                                    desc: 'Security foundation',
                                    color: 'border-primary/30 text-primary bg-primary/5',
                                },
                                {
                                    label: 'JWT + mTLS',
                                    desc: 'Auth stack',
                                    color: 'border-purple-400/30 text-purple-700 dark:text-purple-400 bg-purple-400/5',
                                },
                                {
                                    label: 'Zero Trust',
                                    desc: 'Architecture model',
                                    color: 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5',
                                },
                                {
                                    label: 'Vault',
                                    desc: 'Secrets management',
                                    color: 'border-orange-400/30 text-orange-700 dark:text-orange-400 bg-orange-400/5',
                                },
                                {
                                    label: 'OWASP Top 10',
                                    desc: 'Vulnerability catalog',
                                    color: 'border-red-400/30 text-red-700 dark:text-red-400 bg-red-400/5',
                                },
                                {
                                    label: 'RBAC/ABAC',
                                    desc: 'Authorization models',
                                    color: 'border-primary/30 text-primary bg-primary/5',
                                },
                                {
                                    label: 'TLS 1.3',
                                    desc: 'Transit encryption',
                                    color: 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5',
                                },
                                {
                                    label: 'AES-256',
                                    desc: 'Data encryption',
                                    color: 'border-purple-400/30 text-purple-700 dark:text-purple-400 bg-purple-400/5',
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className={`border rounded-lg p-3 text-center ${item.color}`}>
                                    <p className='font-mono text-xs font-bold mb-1'>
                                        {item.label}
                                    </p>
                                    <p className='font-mono text-xs text-muted-foreground'>
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ),
                },
            ],
        },
    ],
    summary: {
        headers: [
            'Concept',
            'কী করে',
            'Key Tool/Protocol',
            'Interview Relevance',
        ],
        rows: [
            [
                <span className='font-mono font-bold text-primary'>JWT</span>,
                'Stateless authentication token। Self-contained claims।',
                'RS256 signature, HttpOnly cookie',
                <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>
                    Very High — every API design
                </span>,
            ],
            [
                <span className='font-mono font-bold text-purple-700 dark:text-purple-400'>
                    OAuth2 / OIDC
                </span>,
                'Delegated authorization + authentication।',
                'Authorization Code + PKCE',
                'High — third-party integration',
            ],
            [
                <span className='font-mono font-bold text-orange-700 dark:text-orange-400'>
                    mTLS
                </span>,
                'Mutual authentication — client + server both verify।',
                'Istio service mesh, certificates',
                <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>
                    High — microservices security
                </span>,
            ],
            [
                <span className='font-mono font-bold text-primary'>
                    RBAC / ABAC
                </span>,
                'Who can do what। Role or attribute-based।',
                'Middleware, Policy engine',
                'High — authorization design',
            ],
            [
                <span className='font-mono font-bold text-emerald-700 dark:text-emerald-400'>
                    Zero Trust
                </span>,
                'Never trust, always verify। Internal ও external।',
                'mTLS + identity-aware proxy',
                'High — architecture principle',
            ],
            [
                <span className='font-mono font-bold text-orange-700 dark:text-orange-400'>
                    Vault
                </span>,
                'Dynamic secrets, auto-rotation। No hardcoded creds।',
                'HashiCorp Vault, AWS Secrets Manager',
                'Medium-High — production systems',
            ],
            [
                <span className='font-mono font-bold text-red-700 dark:text-red-400'>
                    OWASP Top 10
                </span>,
                'Common vulnerabilities catalog। Mitigation guide।',
                'Input validation, prepared statements, CSP',
                'High — security interview staple',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'JWT এর কোন part টা signature করা হয়?',
                options: [
                    {
                        key: 'a',
                        text: 'শুধু payload',
                        isCorrect: false,
                        explanation:
                            'শুধু payload signature করলেন header tamper হতে পারে।',
                    },
                    {
                        key: 'b',
                        text: 'শুধু header',
                        isCorrect: false,
                        explanation:
                            'শুধু header signature করা হয় না — payload ও include করতে হয়।',
                    },
                    {
                        key: 'c',
                        text: 'Header + Payload উভয়ই',
                        isCorrect: true,
                        explanation:
                            'সঠিক। HMAC_SHA256(base64(header) + "." + base64(payload), secret) — উভয়ই signature-এ include হয়। তাই header বা payload কোনোটা tamper করলেন signature mismatch হবে।',
                    },
                    {
                        key: 'd',
                        text: 'কিছুই না — JWT unsigned',
                        isCorrect: false,
                        explanation:
                            'JWT-এর third part হলো signature — তাই এটা signed।',
                    },
                ],
            },
            {
                id: 2,
                text: 'OAuth2 এ Authorization Code Flow কোথায় use হয়?',
                options: [
                    {
                        key: 'a',
                        text: 'Machine-to-machine (no user)',
                        isCorrect: false,
                        explanation:
                            'Machine-to-machine-এর জন্য Client Credentials Flow use হয়।',
                    },
                    {
                        key: 'b',
                        text: 'Server-side web apps এবং SPA (with PKCE)',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Authorization Code Flow web apps-এর জন্য — server-side code exchange secure। SPA-তে PKCE extension add করুন (client secret নেই)। এটাই most secure flow।',
                    },
                    {
                        key: 'c',
                        text: 'Direct username/password exchange',
                        isCorrect: false,
                        explanation:
                            'Username/password direct exchange = Resource Owner Password Credentials — deprecated।',
                    },
                    {
                        key: 'd',
                        text: 'IoT devices শুধু',
                        isCorrect: false,
                        explanation:
                            'IoT devices Device Code Flow use করে, Authorization Code নয়।',
                    },
                ],
            },
            {
                id: 3,
                text: 'mTLS এবং TLS এর পার্থক্য কী?',
                options: [
                    {
                        key: 'a',
                        text: 'mTLS faster than TLS',
                        isCorrect: false,
                        explanation:
                            'mTLS আসলে TLS-এর চেয়ে কিছুটা slower — extra certificate verification।',
                    },
                    {
                        key: 'b',
                        text: 'mTLS তে client ও server উভয়ই certificate present করে',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Regular TLS-এ শুধু server certificate দেয়। mTLS (mutual TLS) তে client ও certificate present করে। Microservices-এ service identity verify করতে mTLS use হয়।',
                    },
                    {
                        key: 'c',
                        text: 'mTLS শুধু HTTP/2 তে কাজ করে',
                        isCorrect: false,
                        explanation:
                            'mTLS HTTP version-এর উপর dependent নয় — TLS layer-এ কাজ করে।',
                    },
                    {
                        key: 'd',
                        text: 'mTLS symmetric encryption use করে',
                        isCorrect: false,
                        explanation:
                            'TLS এবং mTLS উভয়ই handshake-এ asymmetric, data transfer-এ symmetric encryption use করে।',
                    },
                ],
            },
            {
                id: 4,
                text: 'RBAC এবং ABAC এর মধ্যে কোনটা more granular?',
                options: [
                    {
                        key: 'a',
                        text: 'RBAC — কারণ roles define করা আছে',
                        isCorrect: false,
                        explanation:
                            'RBAC coarse-grained — role level পর্যন্ত। More granular control নয়।',
                    },
                    {
                        key: 'b',
                        text: 'দুটো সমান granular',
                        isCorrect: false,
                        explanation:
                            'ABAC অনেক বেশি granular — multiple attributes, conditions, time, location।',
                    },
                    {
                        key: 'c',
                        text: 'ABAC — attributes, context, conditions দিয়ে fine-grained control',
                        isCorrect: true,
                        explanation:
                            'সঠিক। ABAC = Attribute-Based। User department + resource owner + time of day + location — সব combine করে fine-grained policy। RBAC শুধু role check করে। Banks, healthcare ABAC use করে।',
                    },
                    {
                        key: 'd',
                        text: 'Neither — দুটোই coarse-grained',
                        isCorrect: false,
                        explanation:
                            'ABAC definitely fine-grained। RBAC coarse-grained।',
                    },
                ],
            },
            {
                id: 5,
                text: 'Zero Trust এর মূল principle কী?',
                options: [
                    {
                        key: 'a',
                        text: 'সব traffic block করুন',
                        isCorrect: false,
                        explanation:
                            'Zero Trust সব block করে না — verify করে তারপর allow।',
                    },
                    {
                        key: 'b',
                        text: 'Internal network trust করুন, external করুন না',
                        isCorrect: false,
                        explanation:
                            'এটাই পুরনো perimeter security model। Zero Trust internal network-ও trust করে না।',
                    },
                    {
                        key: 'c',
                        text: 'Never trust, always verify — internal network ও trusted নয়',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Zero Trust assume করে network already compromised হতে পারে। প্রতিটা request verify করুন — internal হলেও। mTLS, identity-aware proxy, least privilege — সব মিলে Zero Trust architecture।',
                    },
                    {
                        key: 'd',
                        text: 'VPN use করুন সবসময়',
                        isCorrect: false,
                        explanation:
                            'VPN Zero Trust-এর পরিবর্তে ব্যবহার হয় না — VPN implicit trust দেয়।',
                    },
                ],
            },
            {
                id: 6,
                text: 'HashiCorp Vault কী কাজ করে?',
                options: [
                    {
                        key: 'a',
                        text: 'Static passwords শুধু store করে',
                        isCorrect: false,
                        explanation:
                            'Vault static store করতে পারে কিন্তু এর main feature হলো dynamic secrets।',
                    },
                    {
                        key: 'b',
                        text: 'Dynamic secrets generate করে, auto-rotation করে, credentials manage করে',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Vault dynamic DB credentials generate করে (প্রতি service-এ আলাদা temp user)। Lease expire হলে automatically revoke। Hardcoded credentials eliminate হয়। AWS Secrets Manager alternative।',
                    },
                    {
                        key: 'c',
                        text: 'শুধু AWS secrets manage করে',
                        isCorrect: false,
                        explanation:
                            'Vault multi-cloud — AWS, GCP, Azure, on-prem সব জায়গায় কাজ করে।',
                    },
                    {
                        key: 'd',
                        text: 'File system encrypt করে',
                        isCorrect: false,
                        explanation:
                            'Vault file system encryption করে না — secrets management করে।',
                    },
                ],
            },
            {
                id: 7,
                text: 'SQL Injection OWASP 2021 এর কত নম্বর?',
                options: [
                    {
                        key: 'a',
                        text: '#1',
                        isCorrect: false,
                        explanation:
                            'OWASP 2021 তে #1 হলো Broken Access Control।',
                    },
                    {
                        key: 'b',
                        text: '#2',
                        isCorrect: false,
                        explanation: '#2 হলো Cryptographic Failures।',
                    },
                    {
                        key: 'c',
                        text: '#3 (Injection)',
                        isCorrect: true,
                        explanation:
                            'সঠিক। OWASP 2021-এ Injection (#3) — SQL injection, NoSQL injection, LDAP injection সব include। Mitigation: parameterized queries / prepared statements। ORM use করুন। Input validate করুন।',
                    },
                    {
                        key: 'd',
                        text: '#5',
                        isCorrect: false,
                        explanation: '#5 হলো Security Misconfiguration।',
                    },
                ],
            },
            {
                id: 8,
                text: 'JWT token কোথায় store করা উচিত browser-এ?',
                options: [
                    {
                        key: 'a',
                        text: 'localStorage',
                        isCorrect: false,
                        explanation:
                            'localStorage JavaScript দিয়ে accessible — XSS attack-এ easily steal হয়। Avoid করুন।',
                    },
                    {
                        key: 'b',
                        text: 'sessionStorage',
                        isCorrect: false,
                        explanation:
                            'sessionStorage-ও JavaScript accessible — XSS vulnerable।',
                    },
                    {
                        key: 'c',
                        text: 'HttpOnly Cookie (with SameSite=Strict)',
                        isCorrect: true,
                        explanation:
                            'সঠিক। HttpOnly cookie JavaScript দিয়ে read করা যায় না — XSS proof। SameSite=Strict CSRF prevent করে। Secure flag HTTPS only নিশ্চিত করে। Best practice: access token memory-তে + refresh token HttpOnly cookie।',
                    },
                    {
                        key: 'd',
                        text: 'URL parameter-এ',
                        isCorrect: false,
                        explanation:
                            'URL parameter-এ token = server logs-এ, browser history-তে expose হয়।',
                    },
                ],
            },
            {
                id: 9,
                text: 'HTTPS এ কোন encryption algorithm use হয়?',
                options: [
                    {
                        key: 'a',
                        text: 'শুধু Symmetric (AES)',
                        isCorrect: false,
                        explanation:
                            'Handshake-এ asymmetric use হয় — শুধু symmetric নয়।',
                    },
                    {
                        key: 'b',
                        text: 'শুধু Asymmetric (RSA)',
                        isCorrect: false,
                        explanation:
                            'RSA slow — সব data asymmetric-এ encrypt করা impractical।',
                    },
                    {
                        key: 'c',
                        text: 'Asymmetric for handshake (key exchange), Symmetric for data transfer',
                        isCorrect: true,
                        explanation:
                            'সঠিক। TLS Handshake: RSA/ECDH দিয়ে session key exchange (asymmetric)। Data Transfer: AES-256 দিয়ে encrypt (symmetric — fast)। Best of both worlds — security of asymmetric, speed of symmetric।',
                    },
                    {
                        key: 'd',
                        text: 'MD5 hash শুধু',
                        isCorrect: false,
                        explanation:
                            'MD5 broken — HTTPS তে use হয় না। MD5 hash, encryption নয়।',
                    },
                ],
            },
            {
                id: 10,
                text: 'Service mesh এ service-to-service authentication এর জন্য কী use করে?',
                options: [
                    {
                        key: 'a',
                        text: 'API keys',
                        isCorrect: false,
                        explanation:
                            'API keys static — rotation কঠিন। Service mesh-এ better solution আছে।',
                    },
                    {
                        key: 'b',
                        text: 'Username/password',
                        isCorrect: false,
                        explanation:
                            'Username/password service-to-service auth-এর জন্য inappropriate।',
                    },
                    {
                        key: 'c',
                        text: 'mTLS (Mutual TLS) — certificate-based identity',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Istio, Linkerd — service mesh automatically প্রতিটা service-এ sidecar proxy inject করে। mTLS automatically handle হয়। Service-A কি সত্যিই Order Service? Certificate verify করুন। SPIFFE/SPIRE standard use হয় identity জন্য।',
                    },
                    {
                        key: 'd',
                        text: 'IP whitelist',
                        isCorrect: false,
                        explanation:
                            'IP whitelist Kubernetes-এ dynamic pod IPs-এর সাথে কাজ করে না।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'Secure API Gateway ডিজাইন করুন',
        time: '৩-৪ ঘন্টা',
        difficulty: 'Advanced',
        tasks: [
            <span>
                <strong>OAuth2 Integration:</strong> একটা web app-এ &quot;Login
                with Google&quot; implement করুন। Authorization Code Flow + PKCE
                use করুন। id_token verify করুন। User session তৈরি করুন।
            </span>,
            <span>
                <strong>JWT Validation Middleware:</strong> Express/FastAPI-তে
                authentication middleware লিখুন। RS256 algorithm use করুন।
                Token expiry check করুন। Role extract করুন claims থেকে।
            </span>,
            <span>
                <strong>RBAC Implementation:</strong> তিনটা role define করুন —
                admin, user, readonly। requireRole() middleware লিখুন।
                Protected routes-এ apply করুন। 403 responses handle করুন।
            </span>,
            <span>
                <strong>Rate Limiting:</strong> Redis sliding window counter দিয়ে
                rate limiting implement করুন। Per-IP এবং per-user limits।
                429 Too Many Requests response। Exponential backoff headers।
            </span>,
            <span>
                <strong>Secrets Management:</strong> AWS Secrets Manager বা
                HashiCorp Vault SDK দিয়ে DB credentials fetch করুন।
                Hardcoded secrets replace করুন। Auto-rotation setup করুন।
            </span>,
            <span>
                <strong>mTLS Configuration:</strong> Two services-এর মধ্যে
                mTLS configure করুন। Self-signed certificates generate করুন।
                Node.js tls module বা nginx দিয়ে implement করুন।
            </span>,
        ],
        deliverables: [
            <span>OAuth2 login flow — working demo with Google</span>,
            <span>JWT middleware code with role extraction</span>,
            <span>Rate limiting implementation with Redis</span>,
            <span>Secrets management — no hardcoded credentials</span>,
        ],
    },
    practicalLab: {
        title: 'JWT + OAuth2 + Vault Integration',
        subtitle: 'Node.js + Keycloak + HashiCorp Vault',
        steps: [
            {
                title: 'Keycloak Setup করুন (Local OAuth2 Server)',
                description:
                    'Docker দিয়ে Keycloak run করুন। একটা Realm তৈরি করুন। Client configure করুন (client_id, redirect_uri)। Test user add করুন।',
            },
            {
                title: 'OAuth2 Authorization Code Flow Implement করুন',
                description:
                    'Express app-এ /auth/login route — Keycloak-এ redirect। /auth/callback — code exchange করুন। id_token verify করুন। Session store করুন।',
            },
            {
                title: 'JWT Middleware লিখুন',
                description:
                    'Keycloak-এর public key fetch করুন (JWKS endpoint)। jsonwebtoken দিয়ে verify করুন। User info request-এ attach করুন। Role-based route protection add করুন।',
            },
            {
                title: 'HashiCorp Vault Setup করুন',
                description:
                    'Vault dev server start করুন। Database secrets engine enable করুন। Dynamic PostgreSQL credentials configure করুন। Service policy তৈরি করুন।',
            },
            {
                title: 'Vault Dynamic Credentials Integrate করুন',
                description:
                    'App startup-এ Vault থেকে DB credentials fetch করুন। Lease renewal timer set করুন। Credentials expire হওয়ার আগে rotate করুন। Connection pool rebuild করুন।',
            },
        ],
        codeBlock: {
            language: 'typescript',
            filename: 'secure-api-gateway.ts — Complete Integration',
            code: `import express from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { createClient } from 'redis';
import axios from 'axios';

const app = express();
const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

// ─────────────────────────────────────────────
// 1. JWKS Client — Keycloak public keys
// ─────────────────────────────────────────────
const jwks = jwksClient({
    jwksUri: \`\${process.env.KEYCLOAK_URL}/realms/myrealm/protocol/openid-connect/certs\`,
    cache: true,
    rateLimit: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 600000, // 10 minutes
});

async function getPublicKey(kid: string): Promise<string> {
    const key = await jwks.getSigningKey(kid);
    return key.getPublicKey();
}

// ─────────────────────────────────────────────
// 2. JWT Verification Middleware
// ─────────────────────────────────────────────
async function authenticate(req: any, res: any, next: any) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    try {
        // Decode header to get kid
        const decoded = jwt.decode(token, { complete: true });
        const kid = (decoded?.header as any)?.kid;
        if (!kid) return res.status(401).json({ error: 'Invalid token format' });

        const publicKey = await getPublicKey(kid);
        const payload = jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
            issuer: \`\${process.env.KEYCLOAK_URL}/realms/myrealm\`,
        }) as any;

        req.user = {
            id: payload.sub,
            email: payload.email,
            roles: payload.realm_access?.roles ?? [],
        };
        next();
    } catch (err: any) {
        const code = err instanceof jwt.TokenExpiredError ? 401 : 403;
        return res.status(code).json({ error: err.message });
    }
}

// ─────────────────────────────────────────────
// 3. RBAC Middleware
// ─────────────────────────────────────────────
function requireRole(...roles: string[]) {
    return (req: any, res: any, next: any) => {
        const hasRole = roles.some(r => req.user?.roles.includes(r));
        if (!hasRole) {
            return res.status(403).json({
                error: 'Insufficient permissions',
                required: roles,
            });
        }
        next();
    };
}

// ─────────────────────────────────────────────
// 4. Rate Limiting — Sliding Window (Redis)
// ─────────────────────────────────────────────
async function rateLimit(
    key: string,
    limit: number,
    windowSeconds: number
): Promise<boolean> {
    const now = Date.now();
    const windowStart = now - windowSeconds * 1000;

    const pipeline = redis.multi();
    pipeline.zRemRangeByScore(key, '-inf', windowStart.toString());
    pipeline.zAdd(key, [{ score: now, value: now.toString() }]);
    pipeline.zCard(key);
    pipeline.expire(key, windowSeconds);

    const results = await pipeline.exec();
    const count = results[2] as number;
    return count <= limit;
}

async function rateLimitMiddleware(req: any, res: any, next: any) {
    const ip = req.ip;
    const userId = req.user?.id ?? 'anonymous';

    // Per-IP: 100 req/minute
    const ipAllowed = await rateLimit(\`rl:ip:\${ip}\`, 100, 60);
    // Per-User: 50 req/minute (stricter)
    const userAllowed = await rateLimit(\`rl:user:\${userId}\`, 50, 60);

    if (!ipAllowed || !userAllowed) {
        res.set({
            'Retry-After': '60',
            'X-RateLimit-Limit': '50',
            'X-RateLimit-Remaining': '0',
        });
        return res.status(429).json({ error: 'Too many requests' });
    }
    next();
}

// ─────────────────────────────────────────────
// 5. Vault — Dynamic DB Credentials
// ─────────────────────────────────────────────
let vaultToken: string | null = null;

async function getVaultToken(): Promise<string> {
    if (vaultToken) return vaultToken;

    // Authenticate via AppRole
    const response = await axios.post(
        \`\${process.env.VAULT_ADDR}/v1/auth/approle/login\`,
        {
            role_id: process.env.VAULT_ROLE_ID,
            secret_id: process.env.VAULT_SECRET_ID,
        }
    );
    vaultToken = response.data.auth.client_token;
    return vaultToken!;
}

async function getDBCredentials() {
    const token = await getVaultToken();
    const response = await axios.get(
        \`\${process.env.VAULT_ADDR}/v1/database/creds/app-role\`,
        { headers: { 'X-Vault-Token': token } }
    );
    return response.data.data; // { username, password }
}

// ─────────────────────────────────────────────
// 6. Routes
// ─────────────────────────────────────────────
// Public
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Authenticated
app.get('/profile', authenticate, rateLimitMiddleware, (req: any, res) => {
    res.json({ user: req.user });
});

// Admin only
app.delete('/users/:id',
    authenticate,
    requireRole('admin'),
    rateLimitMiddleware,
    async (req: any, res) => {
        // Admin action — use dynamic Vault credentials
        const creds = await getDBCredentials();
        // Use creds to connect to DB...
        res.json({ deleted: req.params.id });
    }
);

app.listen(3000, () => console.log('Secure API Gateway running on :3000'));`,
        },
        tip: 'Keycloak local-এ run করে full OAuth2 flow practice করুন। JWT decode করতে jwt.io use করুন। Vault dev mode-এ dynamic credentials test করুন — আসল system-এ যখন credentials automatically rotate হতে দেখবেন, security design অনেক clear হয়ে যাবেন।',
    },
};
