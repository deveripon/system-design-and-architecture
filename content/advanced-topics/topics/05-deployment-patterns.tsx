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

export const deploymentPatternsContent: TopicData = {
    id: 'deployment-patterns',
    sections: [
        {
            id: 'downtime-problem',
            subHeader: { index: '001', title: 'Naive Deployment এর সমস্যা' },
            title: (
                <SectionTitle>
                    Naive Deployment এর ভয়ংকর পরিণতি
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
                                <span className='font-mono text-xs px-3 py-1 border border-orange-400/30 text-orange-700 dark:text-orange-400 bg-orange-400/5 rounded'>
                                    🚀 Deployment Engineering
                                </span>
                                <span className='font-mono text-xs px-3 py-1 border border-purple-400/30 text-purple-700 dark:text-purple-400 bg-purple-400/5 rounded'>
                                    TOPIC 05 / 07
                                </span>
                            </div>
                            <ContentParagraph>
                                একজন junior developer production-এ code deploy
                                করতে চায়। সে যা করে:{' '}
                                <strong className='text-foreground'>
                                    server বন্ধ করুন → নতুন code দিন → server চালু
                                    করুন
                                </strong>
                                । এই সময়টায় হাজারো user error দেখে।
                                Production-এ এটা অগ্রহণযোগ্য।
                            </ContentParagraph>
                            <div className='bg-muted/30 border border-border rounded-lg p-5'>
                                <p className='font-mono text-xs uppercase tracking-widest text-red-700 dark:text-red-400 mb-4'>
                                    Naive Deploy Flow — ভয়ংকর পরিণতি
                                </p>
                                <div className='flex flex-wrap items-center gap-3 font-mono text-sm'>
                                    <div className='px-4 py-2 border border-emerald-500/50 rounded text-emerald-700 dark:text-emerald-400 bg-emerald-500/5'>
                                        Server Running ✓
                                    </div>
                                    <span className='text-muted-foreground'>→</span>
                                    <div className='px-4 py-2 border border-red-500/50 rounded text-red-700 dark:text-red-400 bg-red-500/5'>
                                        Server STOP ✗
                                    </div>
                                    <span className='text-muted-foreground'>→</span>
                                    <div className='px-4 py-2 border border-yellow-400/50 rounded text-yellow-700 dark:text-yellow-400 bg-yellow-400/5'>
                                        Deploy Code
                                    </div>
                                    <span className='text-muted-foreground'>→</span>
                                    <div className='px-4 py-2 border border-red-500/50 rounded text-red-700 dark:text-red-400 bg-red-500/5'>
                                        Restart ⟳
                                    </div>
                                    <span className='text-muted-foreground'>→</span>
                                    <div className='px-4 py-2 border border-emerald-500/50 rounded text-emerald-700 dark:text-emerald-400 bg-emerald-500/5'>
                                        Server Running ✓
                                    </div>
                                </div>
                                <p className='text-xs text-red-700 dark:text-red-400 font-mono mt-3'>
                                    ↑ এই মাঝখানের সময়টা = DOWNTIME = users দেখে &quot;Service Unavailable&quot;
                                </p>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {[
                                {
                                    num: '01',
                                    color: 'text-red-700 dark:text-red-400',
                                    borderColor: 'border-red-500/30',
                                    bgColor: 'bg-red-500/5',
                                    title: 'Downtime = টাকা নষ্ট',
                                    desc: 'Amazon-এর হিসাবে ১ মিনিট downtime ≈ $৪৬০,০০০ ক্ষতি। ছোট কোম্পানির জন্যও প্রতিটা মিনিট মানে customer হারানো।',
                                },
                                {
                                    num: '02',
                                    color: 'text-orange-700 dark:text-orange-400',
                                    borderColor: 'border-orange-400/30',
                                    bgColor: 'bg-orange-400/5',
                                    title: 'Bug in Production',
                                    desc: 'নতুন code-এ bug থাকলে পুরো server down। Rollback করতে আবার downtime। Users frustrate হয়ে চলে যায়।',
                                },
                                {
                                    num: '03',
                                    color: 'text-yellow-700 dark:text-yellow-400',
                                    borderColor: 'border-yellow-400/30',
                                    bgColor: 'bg-yellow-400/5',
                                    title: 'Big Bang Release',
                                    desc: 'একবারে সব features deploy করলেন কোনো bug কোথা থেকে এলো বোঝা কঠিন। ছোট ছোট releases best practice।',
                                },
                                {
                                    num: '04',
                                    color: 'text-purple-700 dark:text-purple-400',
                                    borderColor: 'border-purple-400/30',
                                    bgColor: 'bg-purple-400/5',
                                    title: 'Fear of Deployment',
                                    desc: 'Team deploy করতে ভয় পায়। তাই weeks ধরে deploy করে না। Backlog জমে। Release আরও বড় আরও risky হয়।',
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className={`border ${item.borderColor} ${item.bgColor} rounded-lg p-4`}>
                                    <div className='flex items-center gap-3 mb-2'>
                                        <span
                                            className={`font-mono text-xl font-bold ${item.color}`}>
                                            {item.num}
                                        </span>
                                        <span
                                            className={`font-mono text-sm font-semibold ${item.color}`}>
                                            {item.title}
                                        </span>
                                    </div>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 লক্ষ্য কী হওয়া উচিত?',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                Modern deployment-এর ৪টা core goal:
                            </p>
                            <ul className='space-y-1 mt-2'>
                                <li className='flex items-start gap-2'>
                                    <span className='text-emerald-700 dark:text-emerald-400 font-mono mt-0.5'>✓</span>
                                    <span>
                                        <strong>Zero Downtime</strong> — users
                                        কোনো interruption ছাড়াই service পাবেন
                                    </span>
                                </li>
                                <li className='flex items-start gap-2'>
                                    <span className='text-emerald-700 dark:text-emerald-400 font-mono mt-0.5'>✓</span>
                                    <span>
                                        <strong>Instant Rollback</strong> — bug
                                        পেলে মুহূর্তে আগের version-এ ফিরে যানয়া
                                    </span>
                                </li>
                                <li className='flex items-start gap-2'>
                                    <span className='text-emerald-700 dark:text-emerald-400 font-mono mt-0.5'>✓</span>
                                    <span>
                                        <strong>Gradual Traffic Shift</strong> —
                                        ধীরে ধীরে নতুন version-এ traffic পাঠানো
                                    </span>
                                </li>
                                <li className='flex items-start gap-2'>
                                    <span className='text-emerald-700 dark:text-emerald-400 font-mono mt-0.5'>✓</span>
                                    <span>
                                        <strong>Deployment Confidence</strong> —
                                        team যেন ভয় না পেয়ে frequently deploy
                                        করতে পারে
                                    </span>
                                </li>
                            </ul>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'blue-green',
            subHeader: { index: '002', title: 'Blue-Green Deployment' },
            title: (
                <SectionTitle>
                    Blue-Green Deployment — দুটো Environment রাখুন
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Blue-Green deployment-এ সবসময় দুটো identical
                            production environment থাকে —{' '}
                            <strong className='text-blue-700 dark:text-blue-400'>Blue</strong>{' '}
                            (current live) এবং{' '}
                            <strong className='text-emerald-700 dark:text-emerald-400'>Green</strong>{' '}
                            (new version)। Traffic switch করে deployment হয়।
                            Downtime zero।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                Blue-Green Deployment — ৩টি Step
                            </p>
                            <svg
                                viewBox='0 0 680 280'
                                className='w-full max-w-2xl mx-auto'>
                                <defs>
                                    <marker
                                        id='bg-arr'
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
                                        id='bg-arrG'
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
                                        id='bg-arrB'
                                        markerWidth='8'
                                        markerHeight='8'
                                        refX='6'
                                        refY='3'
                                        orient='auto'>
                                        <path
                                            d='M0,0 L0,6 L8,3 z'
                                            fill='#cc6b45'
                                        />
                                    </marker>
                                </defs>

                                {/* Step labels */}
                                <text x='80' y='20' textAnchor='middle' fill='#64748b' fontFamily='monospace' fontSize='9' fontWeight='bold'>STEP 1</text>
                                <text x='340' y='20' textAnchor='middle' fill='#64748b' fontFamily='monospace' fontSize='9' fontWeight='bold'>STEP 2</text>
                                <text x='590' y='20' textAnchor='middle' fill='#64748b' fontFamily='monospace' fontSize='9' fontWeight='bold'>STEP 3</text>

                                {/* Step 1: Blue live */}
                                <rect x='20' y='35' width='120' height='40' rx='4' fill='transparent' stroke='#475569' strokeWidth='1.2' />
                                <text x='80' y='52' textAnchor='middle' fill='#94a3b8' fontFamily='monospace' fontSize='9'>LOAD BALANCER</text>
                                <text x='80' y='65' textAnchor='middle' fill='#64748b' fontFamily='monospace' fontSize='8'>100% traffic →</text>

                                <path d='M 80 75 L 80 100' stroke='#cc6b45' strokeWidth='1.5' markerEnd='url(#bg-arrB)' />

                                <rect x='20' y='100' width='120' height='45' rx='4' fill='rgba(204,107,69,0.1)' stroke='#cc6b45' strokeWidth='2' />
                                <text x='80' y='120' textAnchor='middle' fill='#cc6b45' fontFamily='monospace' fontSize='10' fontWeight='bold'>BLUE (v1)</text>
                                <text x='80' y='135' textAnchor='middle' fill='#64748b' fontFamily='monospace' fontSize='8'>LIVE ✓</text>

                                <rect x='20' y='175' width='120' height='45' rx='4' fill='transparent' stroke='#334155' strokeWidth='1.2' strokeDasharray='4,3' />
                                <text x='80' y='195' textAnchor='middle' fill='#475569' fontFamily='monospace' fontSize='10'>GREEN (v2)</text>
                                <text x='80' y='208' textAnchor='middle' fill='#475569' fontFamily='monospace' fontSize='8'>IDLE</text>

                                {/* Divider */}
                                <line x1='165' y1='30' x2='165' y2='260' stroke='#1e293b' strokeWidth='1' strokeDasharray='3,3' />

                                {/* Step 2: Deploy to Green */}
                                <rect x='270' y='35' width='120' height='40' rx='4' fill='transparent' stroke='#475569' strokeWidth='1.2' />
                                <text x='330' y='52' textAnchor='middle' fill='#94a3b8' fontFamily='monospace' fontSize='9'>LOAD BALANCER</text>
                                <text x='330' y='65' textAnchor='middle' fill='#64748b' fontFamily='monospace' fontSize='8'>100% traffic →</text>

                                <path d='M 310 75 L 295 100' stroke='#cc6b45' strokeWidth='1.5' markerEnd='url(#bg-arrB)' />

                                <rect x='270' y='100' width='120' height='45' rx='4' fill='rgba(204,107,69,0.1)' stroke='#cc6b45' strokeWidth='1.5' />
                                <text x='330' y='120' textAnchor='middle' fill='#cc6b45' fontFamily='monospace' fontSize='10'>BLUE (v1)</text>
                                <text x='330' y='135' textAnchor='middle' fill='#64748b' fontFamily='monospace' fontSize='8'>STILL LIVE</text>

                                <text x='330' y='165' textAnchor='middle' fill='#f97316' fontFamily='monospace' fontSize='8'>⬇ deploying...</text>

                                <rect x='270' y='175' width='120' height='45' rx='4' fill='rgba(16,185,129,0.1)' stroke='#10b981' strokeWidth='2' />
                                <text x='330' y='195' textAnchor='middle' fill='#10b981' fontFamily='monospace' fontSize='10' fontWeight='bold'>GREEN (v2)</text>
                                <text x='330' y='208' textAnchor='middle' fill='#10b981' fontFamily='monospace' fontSize='8'>DEPLOYING ⟳</text>

                                {/* Divider */}
                                <line x1='415' y1='30' x2='415' y2='260' stroke='#1e293b' strokeWidth='1' strokeDasharray='3,3' />

                                {/* Step 3: Switch traffic */}
                                <rect x='520' y='35' width='140' height='40' rx='4' fill='transparent' stroke='#10b981' strokeWidth='1.5' />
                                <text x='590' y='52' textAnchor='middle' fill='#10b981' fontFamily='monospace' fontSize='9'>LOAD BALANCER</text>
                                <text x='590' y='65' textAnchor='middle' fill='#10b981' fontFamily='monospace' fontSize='8'>switch → GREEN</text>

                                <path d='M 575 75 L 555 100' stroke='#475569' strokeWidth='1' strokeDasharray='3,2' markerEnd='url(#bg-arr)' />

                                <rect x='520' y='100' width='140' height='45' rx='4' fill='transparent' stroke='#334155' strokeWidth='1.2' strokeDasharray='4,3' />
                                <text x='590' y='120' textAnchor='middle' fill='#475569' fontFamily='monospace' fontSize='10'>BLUE (v1)</text>
                                <text x='590' y='135' textAnchor='middle' fill='#475569' fontFamily='monospace' fontSize='8'>STANDBY (rollback ready)</text>

                                <path d='M 605 75 L 620 100' stroke='#10b981' strokeWidth='2' markerEnd='url(#bg-arrG)' />

                                <rect x='520' y='175' width='140' height='45' rx='4' fill='rgba(16,185,129,0.15)' stroke='#10b981' strokeWidth='2.5' />
                                <text x='590' y='195' textAnchor='middle' fill='#10b981' fontFamily='monospace' fontSize='10' fontWeight='bold'>GREEN (v2)</text>
                                <text x='590' y='210' textAnchor='middle' fill='#10b981' fontFamily='monospace' fontSize='8'>LIVE ✓ 100% traffic</text>

                                {/* Bottom labels */}
                                <text x='80' y='260' textAnchor='middle' fill='#475569' fontFamily='monospace' fontSize='8'>Blue = production</text>
                                <text x='330' y='260' textAnchor='middle' fill='#475569' fontFamily='monospace' fontSize='8'>Green ready, Blue untouched</text>
                                <text x='590' y='260' textAnchor='middle' fill='#475569' fontFamily='monospace' fontSize='8'>Instant switch, zero downtime</text>
                            </svg>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'yaml',
                    filename: 'kubernetes-blue-green.yaml',
                    code: `# Blue Deployment (current live — v1)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-blue
  labels:
    app: myapp
    version: blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: blue
  template:
    metadata:
      labels:
        app: myapp
        version: blue
    spec:
      containers:
      - name: app
        image: myapp:v1.0.0   # Current stable version
        ports:
        - containerPort: 8080
---
# Green Deployment (new version — v2)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-green
  labels:
    app: myapp
    version: green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: green
  template:
    metadata:
      labels:
        app: myapp
        version: green
    spec:
      containers:
      - name: app
        image: myapp:v2.0.0   # New version (deployed silently)
        ports:
        - containerPort: 8080
---
# Service — Traffic কোথায় যাবেন সেটা নিয়ন্ত্রণ করে
apiVersion: v1
kind: Service
metadata:
  name: app-service
spec:
  selector:
    app: myapp
    version: blue   # ← শুধু এই একটা line change করলেনই switch!
    # version: green  ← Green-এ switch করতে এটা uncomment করুন
  ports:
  - port: 80
    targetPort: 8080`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Instant Rollback — মাত্র ১ লাইন পরিবর্তন',
                    content: (
                        <p>
                            Green-এ কোনো problem দেখলে Service selector-এ{' '}
                            <strong className='font-mono'>
                                version: blue
                            </strong>{' '}
                            ফিরিয়ে দিন। Blue environment এখনো চালু আছে। Traffic
                            মুহূর্তে ফিরে যাবেন।{' '}
                            <strong>Rollback time: seconds।</strong> কোনো
                            re-deploy দরকার নেই।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: '⚠️ Blue-Green এর সমস্যাসমূহ',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>Double Infrastructure Cost:</strong>{' '}
                                সবসময় দুটো full environment চালু রাখতে হয়। Cloud
                                cost দ্বিগুণ হতে পারে।
                            </p>
                            <p>
                                <strong>Database Migration Complexity:</strong>{' '}
                                v1 এবং v2 একই database use করলেন schema migration
                                সাবধানে করতে হয়। v1 compatible migration
                                আগে, তারপর switch, তারপর cleanup।
                            </p>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'canary',
            subHeader: { index: '003', title: 'Canary Release' },
            title: (
                <SectionTitle>
                    Canary Release — ধীরে ধীরে Traffic বাড়াও
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Coal mine-এ canary পাখি ব্যবহার করা হতো বিপদ
                            detect করতে। Software-এ{' '}
                            <strong className='text-foreground'>
                                Canary Release
                            </strong>{' '}
                            মানে নতুন version-এ প্রথমে মাত্র ৫% traffic পাঠাও।
                            Problem না হলে আস্তে আস্তে বাড়াও।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                Canary Traffic Split — Monitoring সহ
                            </p>
                            <svg
                                viewBox='0 0 620 240'
                                className='w-full max-w-2xl mx-auto'>
                                <defs>
                                    <marker id='cn-arr' markerWidth='8' markerHeight='8' refX='6' refY='3' orient='auto'>
                                        <path d='M0,0 L0,6 L8,3 z' fill='#64748b' />
                                    </marker>
                                    <marker id='cn-arrG' markerWidth='8' markerHeight='8' refX='6' refY='3' orient='auto'>
                                        <path d='M0,0 L0,6 L8,3 z' fill='#10b981' />
                                    </marker>
                                    <marker id='cn-arrY' markerWidth='8' markerHeight='8' refX='6' refY='3' orient='auto'>
                                        <path d='M0,0 L0,6 L8,3 z' fill='#eab308' />
                                    </marker>
                                    <marker id='cn-arrR' markerWidth='8' markerHeight='8' refX='6' refY='3' orient='auto'>
                                        <path d='M0,0 L0,6 L8,3 z' fill='#ef4444' />
                                    </marker>
                                </defs>

                                {/* Users */}
                                <rect x='10' y='90' width='100' height='50' rx='4' fill='transparent' stroke='#475569' strokeWidth='1.5' />
                                <text x='60' y='112' textAnchor='middle' fill='#94a3b8' fontFamily='monospace' fontSize='10' fontWeight='bold'>USERS</text>
                                <text x='60' y='127' textAnchor='middle' fill='#64748b' fontFamily='monospace' fontSize='8'>100% requests</text>

                                {/* Load Balancer */}
                                <path d='M 110 115 L 175 115' stroke='#64748b' strokeWidth='1.5' markerEnd='url(#cn-arr)' />

                                <rect x='175' y='90' width='110' height='50' rx='4' fill='transparent' stroke='#8b5cf6' strokeWidth='1.5' />
                                <text x='230' y='112' textAnchor='middle' fill='#8b5cf6' fontFamily='monospace' fontSize='9'>LOAD</text>
                                <text x='230' y='125' textAnchor='middle' fill='#8b5cf6' fontFamily='monospace' fontSize='9'>BALANCER</text>
                                <text x='230' y='136' textAnchor='middle' fill='#64748b' fontFamily='monospace' fontSize='7'>traffic split logic</text>

                                {/* 95% to Stable */}
                                <path d='M 285 100 L 360 75' stroke='#10b981' strokeWidth='2' markerEnd='url(#cn-arrG)' />
                                <text x='318' y='83' fill='#10b981' fontFamily='monospace' fontSize='9' fontWeight='bold'>95%</text>

                                <rect x='360' y='45' width='130' height='55' rx='4' fill='rgba(16,185,129,0.1)' stroke='#10b981' strokeWidth='2' />
                                <text x='425' y='68' textAnchor='middle' fill='#10b981' fontFamily='monospace' fontSize='10' fontWeight='bold'>STABLE (v1)</text>
                                <text x='425' y='82' textAnchor='middle' fill='#64748b' fontFamily='monospace' fontSize='8'>Production pods</text>
                                <text x='425' y='93' textAnchor='middle' fill='#64748b' fontFamily='monospace' fontSize='7'>Known good version</text>

                                {/* 5% to Canary */}
                                <path d='M 285 130 L 360 155' stroke='#eab308' strokeWidth='2' markerEnd='url(#cn-arrY)' />
                                <text x='318' y='153' fill='#eab308' fontFamily='monospace' fontSize='9' fontWeight='bold'>5%</text>

                                <rect x='360' y='135' width='130' height='55' rx='4' fill='rgba(234,179,8,0.1)' stroke='#eab308' strokeWidth='2' />
                                <text x='425' y='158' textAnchor='middle' fill='#eab308' fontFamily='monospace' fontSize='10' fontWeight='bold'>CANARY (v2)</text>
                                <text x='425' y='172' textAnchor='middle' fill='#64748b' fontFamily='monospace' fontSize='8'>New version pods</text>
                                <text x='425' y='183' textAnchor='middle' fill='#64748b' fontFamily='monospace' fontSize='7'>Under observation</text>

                                {/* Monitoring */}
                                <path d='M 490 165 L 550 165' stroke='#64748b' strokeWidth='1.2' markerEnd='url(#cn-arr)' />
                                <rect x='550' y='140' width='60' height='50' rx='4' fill='transparent' stroke='#ef4444' strokeWidth='1.2' />
                                <text x='580' y='162' textAnchor='middle' fill='#ef4444' fontFamily='monospace' fontSize='8'>MONITOR</text>
                                <text x='580' y='175' textAnchor='middle' fill='#64748b' fontFamily='monospace' fontSize='7'>errors</text>
                                <text x='580' y='185' textAnchor='middle' fill='#64748b' fontFamily='monospace' fontSize='7'>latency</text>

                                {/* Rollback arrow */}
                                <path d='M 580 140 Q 580 110 490 95' stroke='#ef4444' strokeWidth='1' strokeDasharray='4,2' markerEnd='url(#cn-arrR)' />
                                <text x='545' y='115' fill='#ef4444' fontFamily='monospace' fontSize='7'>rollback if</text>
                                <text x='545' y='124' fill='#ef4444' fontFamily='monospace' fontSize='7'>errors spike</text>

                                {/* Bottom annotation */}
                                <text x='10' y='230' fill='#475569' fontFamily='monospace' fontSize='8'>Progressive Delivery: 5% → 25% → 50% → 100% (প্রতিটা step-এ monitoring)</text>
                            </svg>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'yaml',
                    filename: 'kubernetes-canary.yaml',
                    code: `# Stable deployment (19 replicas = 95% traffic)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-stable
spec:
  replicas: 19          # 95% of total pods
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        track: stable
    spec:
      containers:
      - name: app
        image: myapp:v1.0.0
---
# Canary deployment (1 replica = 5% traffic)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-canary
spec:
  replicas: 1           # 5% of total pods
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        track: canary
    spec:
      containers:
      - name: app
        image: myapp:v2.0.0
---
# Single Service — উভয় deployment-এ route করে (label: app=myapp)
apiVersion: v1
kind: Service
metadata:
  name: app-service
spec:
  selector:
    app: myapp    # উভয় stable + canary pods match করে
  ports:
  - port: 80
    targetPort: 8080
# Traffic split proportional to replica count:
# 19 stable + 1 canary = 20 total → 95% / 5% split`,
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    steps: [
                        {
                            title: (
                                <span className='font-mono text-yellow-700 dark:text-yellow-400'>
                                    Step 1 — ৫% Traffic (Initial Canary)
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    ১টা canary pod deploy করুন। মাত্র ৫% users
                                    নতুন version দেখবেন। Error rate, latency,
                                    business metrics monitor করুন।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-yellow-700 dark:text-yellow-400'>
                                    Step 2 — Monitor করুন (৩০ মিনিট - ১ ঘন্টা)
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Prometheus/Grafana-তে error rate দেখুন।
                                    Baseline-এর চেয়ে বেশি হলে automatic rollback।
                                    সব ঠিক থাকলে পরের step।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-orange-700 dark:text-orange-400'>
                                    Step 3 — ২৫% Traffic
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Canary replicas বাড়িয়ে ২৫%। আবার monitor।
                                    এখন বেশি users নতুন version দেখছে —
                                    patterns আরও clear।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-orange-700 dark:text-orange-400'>
                                    Step 4 — ৫০% Traffic
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Half-half split। Performance comparison
                                    সবচেয়ে accurate এখানে। A/B testing-এর
                                    মতো।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-emerald-700 dark:text-emerald-400'>
                                    Step 5 — ১০০% Traffic (Full Rollout)
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    সব pods নতুন version-এ। Old pods সরিয়ে দিন।
                                    Deployment সম্পন্ন — কোনো downtime ছাড়া।
                                </span>
                            ),
                        },
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Progressive Delivery with Metrics Gates',
                    content: (
                        <p>
                            Modern tools (Argo Rollouts, Flagger) automatically
                            পরের step-এ যায় যদি metrics threshold pass হয়।
                            Error rate &gt; 1%? Automatic rollback। এটাই{' '}
                            <strong>Progressive Delivery</strong> — human
                            intervention ছাড়াই safe deployment।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'rolling-update',
            subHeader: { index: '004', title: 'Rolling Update' },
            title: (
                <SectionTitle>
                    Rolling Update — একটা একটা করে Replace করুন
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Rolling update-এ একবারে সব pods replace করা হয় না।
                            একটা একটা করে (বা batch-এ) নতুন version দিয়ে replace
                            করা হয়। সবসময় কিছু পুরনো আর কিছু নতুন pod চালু থাকে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                Rolling Update — Pod একটা একটা করে Replace
                            </p>
                            <svg
                                viewBox='0 0 640 200'
                                className='w-full max-w-2xl mx-auto'>
                                {/* Phase labels */}
                                {['Start', 'Phase 1', 'Phase 2', 'Phase 3', 'Complete'].map((label, i) => (
                                    <text key={i} x={30 + i * 150} y='18' textAnchor='middle' fill='#64748b' fontFamily='monospace' fontSize='8' fontWeight='bold'>
                                        {label}
                                    </text>
                                ))}

                                {/* Phase 0: All old pods (4 blue) */}
                                {[0, 1, 2, 3].map(j => (
                                    <rect key={j} x={10 + j * 22} y='30' width='18' height='30' rx='3' fill='rgba(204,107,69,0.2)' stroke='#cc6b45' strokeWidth='1.5' />
                                ))}
                                {[0, 1, 2, 3].map(j => (
                                    <text key={j} x={19 + j * 22} y='50' textAnchor='middle' fill='#cc6b45' fontFamily='monospace' fontSize='7'>v1</text>
                                ))}
                                <text x='48' y='80' textAnchor='middle' fill='#64748b' fontFamily='monospace' fontSize='7'>4×v1</text>

                                {/* Arrow */}
                                <text x='125' y='50' textAnchor='middle' fill='#475569' fontFamily='monospace' fontSize='14'>→</text>

                                {/* Phase 1: 3 old + 1 new */}
                                {[0, 1, 2].map(j => (
                                    <rect key={j} x={155 + j * 22} y='30' width='18' height='30' rx='3' fill='rgba(204,107,69,0.2)' stroke='#cc6b45' strokeWidth='1.5' />
                                ))}
                                {[0, 1, 2].map(j => (
                                    <text key={j} x={164 + j * 22} y='50' textAnchor='middle' fill='#cc6b45' fontFamily='monospace' fontSize='7'>v1</text>
                                ))}
                                <rect x='221' y='30' width='18' height='30' rx='3' fill='rgba(16,185,129,0.2)' stroke='#10b981' strokeWidth='1.5' />
                                <text x='230' y='50' textAnchor='middle' fill='#10b981' fontFamily='monospace' fontSize='7'>v2</text>
                                <text x='198' y='80' textAnchor='middle' fill='#64748b' fontFamily='monospace' fontSize='7'>3×v1 + 1×v2</text>

                                {/* Arrow */}
                                <text x='275' y='50' textAnchor='middle' fill='#475569' fontFamily='monospace' fontSize='14'>→</text>

                                {/* Phase 2: 2 old + 2 new */}
                                {[0, 1].map(j => (
                                    <rect key={j} x={305 + j * 22} y='30' width='18' height='30' rx='3' fill='rgba(204,107,69,0.2)' stroke='#cc6b45' strokeWidth='1.5' />
                                ))}
                                {[0, 1].map(j => (
                                    <text key={j} x={314 + j * 22} y='50' textAnchor='middle' fill='#cc6b45' fontFamily='monospace' fontSize='7'>v1</text>
                                ))}
                                {[0, 1].map(j => (
                                    <rect key={j} x={349 + j * 22} y='30' width='18' height='30' rx='3' fill='rgba(16,185,129,0.2)' stroke='#10b981' strokeWidth='1.5' />
                                ))}
                                {[0, 1].map(j => (
                                    <text key={j} x={358 + j * 22} y='50' textAnchor='middle' fill='#10b981' fontFamily='monospace' fontSize='7'>v2</text>
                                ))}
                                <text x='348' y='80' textAnchor='middle' fill='#64748b' fontFamily='monospace' fontSize='7'>2×v1 + 2×v2</text>

                                {/* Arrow */}
                                <text x='420' y='50' textAnchor='middle' fill='#475569' fontFamily='monospace' fontSize='14'>→</text>

                                {/* Phase 3: 1 old + 3 new */}
                                <rect x='445' y='30' width='18' height='30' rx='3' fill='rgba(204,107,69,0.2)' stroke='#cc6b45' strokeWidth='1.5' />
                                <text x='454' y='50' textAnchor='middle' fill='#cc6b45' fontFamily='monospace' fontSize='7'>v1</text>
                                {[0, 1, 2].map(j => (
                                    <rect key={j} x={467 + j * 22} y='30' width='18' height='30' rx='3' fill='rgba(16,185,129,0.2)' stroke='#10b981' strokeWidth='1.5' />
                                ))}
                                {[0, 1, 2].map(j => (
                                    <text key={j} x={476 + j * 22} y='50' textAnchor='middle' fill='#10b981' fontFamily='monospace' fontSize='7'>v2</text>
                                ))}
                                <text x='498' y='80' textAnchor='middle' fill='#64748b' fontFamily='monospace' fontSize='7'>1×v1 + 3×v2</text>

                                {/* Arrow */}
                                <text x='570' y='50' textAnchor='middle' fill='#475569' fontFamily='monospace' fontSize='14'>→</text>

                                {/* Phase 4: All new pods */}
                                {[0, 1, 2, 3].map(j => (
                                    <rect key={j} x={590 + j * 22} y='30' width='18' height='30' rx='3' fill='rgba(16,185,129,0.2)' stroke='#10b981' strokeWidth='1.5' />
                                ))}
                                {[0, 1, 2, 3].map(j => (
                                    <text key={j} x={599 + j * 22} y='50' textAnchor='middle' fill='#10b981' fontFamily='monospace' fontSize='7'>v2</text>
                                ))}
                                <text x='634' y='80' textAnchor='middle' fill='#10b981' fontFamily='monospace' fontSize='7'>4×v2 ✓</text>

                                {/* Legend */}
                                <rect x='10' y='110' width='14' height='12' rx='2' fill='rgba(204,107,69,0.2)' stroke='#cc6b45' strokeWidth='1.2' />
                                <text x='30' y='121' fill='#94a3b8' fontFamily='monospace' fontSize='9'>v1 (old)</text>
                                <rect x='100' y='110' width='14' height='12' rx='2' fill='rgba(16,185,129,0.2)' stroke='#10b981' strokeWidth='1.2' />
                                <text x='120' y='121' fill='#94a3b8' fontFamily='monospace' fontSize='9'>v2 (new)</text>
                                <text x='10' y='145' fill='#475569' fontFamily='monospace' fontSize='8'>maxUnavailable = 1 → একবারে ১টা pod নামায়, capacity সবসময় ≥ 75%</text>
                                <text x='10' y='160' fill='#475569' fontFamily='monospace' fontSize='8'>maxSurge = 1 → temporarily extra pod তুলতে পারে (5 pods momentarily)</text>
                            </svg>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'yaml',
                    filename: 'kubernetes-rolling-update.yaml',
                    code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1         # Extra pods: temporarily 5 pods চলতে পারে
      maxUnavailable: 1   # একবারে max ১টা pod down থাকতে পারে
                          # maxUnavailable: 0 → zero downtime guarantee
                          # maxSurge: 25%  → percentage ব্যবহার করা যায়
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: myapp:v2.0.0    # ← শুধু এটা পরিবর্তন করলেনই rolling update শুরু
        readinessProbe:         # নতুন pod ready না হলে পুরনো pod নামাবে না
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 3
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 10`,
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Pattern', 'Cost', 'Rollback Speed', 'Complexity', 'Risk'],
                    rows: [
                        [
                            <span className='text-blue-700 dark:text-blue-400 font-semibold font-mono'>Blue-Green</span>,
                            <span className='text-red-700 dark:text-red-400'>High (2× infra)</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>Instant</span>,
                            'Medium',
                            <span className='text-emerald-700 dark:text-emerald-400'>Low</span>,
                        ],
                        [
                            <span className='text-yellow-700 dark:text-yellow-400 font-semibold font-mono'>Canary</span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>Medium</span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>Slow (gradual)</span>,
                            'High',
                            <span className='text-yellow-700 dark:text-yellow-400'>Very Low</span>,
                        ],
                        [
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold font-mono'>Rolling Update</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>Low</span>,
                            'Medium',
                            <span className='text-emerald-700 dark:text-emerald-400'>Low</span>,
                            'Medium',
                        ],
                    ],
                },
            ],
        },
        {
            id: 'feature-flags',
            subHeader: { index: '005', title: 'Feature Flags' },
            title: (
                <SectionTitle>
                    Feature Flags — Code Deploy করুন, Feature আলাদা রাখুন
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-4'>
                            <ContentParagraph>
                                Feature Flag (বা Feature Toggle) হলো code-এর মধ্যে
                                একটা on/off switch।{' '}
                                <strong className='text-foreground'>
                                    New feature code production-এ deploy করুন
                                </strong>
                                , কিন্তু flag off রাখুন। যখন চাও তখন flag on করুন।
                                Deployment আর Release আলাদা।
                            </ContentParagraph>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='bg-muted/30 border border-border rounded-lg p-4'>
                                    <p className='font-mono text-xs text-red-700 dark:text-red-400 uppercase tracking-widest mb-3'>
                                        পুরনো উপায় (Without Flags)
                                    </p>
                                    <div className='space-y-1 text-sm text-muted-foreground font-mono'>
                                        <div>1. Feature develop করুন</div>
                                        <div>2. কয়েক সপ্তাহ branch-এ রাখুন</div>
                                        <div>3. বড় merge = conflicts 😱</div>
                                        <div>4. Deploy করলেনই সবাই দেখে</div>
                                        <div className='text-red-700 dark:text-red-400'>5. Bug = পুরো rollback</div>
                                    </div>
                                </div>
                                <div className='bg-muted/30 border border-border rounded-lg p-4'>
                                    <p className='font-mono text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-3'>
                                        Feature Flags দিয়ে
                                    </p>
                                    <div className='space-y-1 text-sm text-muted-foreground font-mono'>
                                        <div>1. Feature develop করুন</div>
                                        <div>2. Flag off দিয়ে main-এ merge</div>
                                        <div>3. Deploy (flag off = hidden)</div>
                                        <div>4. ৫% users-এ flag on করুন</div>
                                        <div className='text-emerald-700 dark:text-emerald-400'>5. Problem = flag off! ✓</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'typescript',
                    filename: 'feature-flag-service.ts',
                    code: `// Feature Flag Service — TypeScript implementation
interface FeatureFlag {
    name: string;
    enabled: boolean;
    rolloutPercentage: number;   // 0-100: কতজন user দেখবেন
    allowedUserIds?: string[];   // Specific users (beta testers)
    allowedGroups?: string[];    // User groups ('premium', 'internal')
}

class FeatureFlagService {
    private flags: Map<string, FeatureFlag>;

    constructor() {
        // LaunchDarkly / ConfigCat / custom config থেকে load হয়
        this.flags = new Map([
            ['new-checkout-flow', {
                name: 'new-checkout-flow',
                enabled: true,
                rolloutPercentage: 5,       // মাত্র ৫% users দেখবেন
                allowedUserIds: ['user_beta_001', 'user_beta_002'],
            }],
            ['ai-recommendations', {
                name: 'ai-recommendations',
                enabled: false,             // সম্পূর্ণ বন্ধ
                rolloutPercentage: 0,
            }],
            ['dark-mode-v2', {
                name: 'dark-mode-v2',
                enabled: true,
                rolloutPercentage: 100,     // সবাই পাচ্ছে
            }],
        ]);
    }

    // User-এর জন্য flag enabled কিনা check করুন
    isEnabled(flagName: string, userId: string): boolean {
        const flag = this.flags.get(flagName);
        if (!flag || !flag.enabled) return false;

        // Specific users override
        if (flag.allowedUserIds?.includes(userId)) return true;

        // Percentage-based rollout: userId hash করে consistent bucketing
        const bucket = this.getUserBucket(userId);
        return bucket < flag.rolloutPercentage;
    }

    // User ID থেকে consistent 0-100 bucket বের করুন
    private getUserBucket(userId: string): number {
        let hash = 0;
        for (const char of userId) {
            hash = (hash * 31 + char.charCodeAt(0)) % 100;
        }
        return hash;
    }

    // Runtime-এ flag update করুন (deploy ছাড়াই!)
    updateFlag(flagName: string, updates: Partial<FeatureFlag>): void {
        const existing = this.flags.get(flagName);
        if (existing) {
            this.flags.set(flagName, { ...existing, ...updates });
        }
    }
}

// Usage in application code:
const flags = new FeatureFlagService();

async function handleCheckout(userId: string, cart: Cart) {
    if (flags.isEnabled('new-checkout-flow', userId)) {
        // নতুন checkout flow (৫% users)
        return await newCheckoutService.process(cart);
    } else {
        // পুরনো checkout flow (৯৫% users)
        return await legacyCheckoutService.process(cart);
    }
}`,
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    steps: [
                        {
                            title: (
                                <span className='font-mono text-primary'>
                                    Deploy — Feature Code, Flag OFF
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    নতুন feature code production-এ deploy করুন।
                                    Flag off থাকায় কোনো user দেখবেন না। Code live
                                    কিন্তু hidden।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-yellow-700 dark:text-yellow-400'>
                                    Verify — Internal Team Test করুন
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Team-এর specific user IDs-এ flag on করুন।
                                    Production-এ real environment-এ test।
                                    কোনো bug থাকলে এখনই ধরা পড়বে।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-yellow-700 dark:text-yellow-400'>
                                    Flag ON — ৫% Users
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Rollout percentage ৫% করুন। Real users-এর
                                    ছোট একটা group দেখবেন। Metrics দেখুন।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-orange-700 dark:text-orange-400'>
                                    Monitor — Business Metrics দেখুন
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Conversion rate, error rate, session
                                    duration — সব metric flag group vs control
                                    group-এ compare করুন।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-emerald-700 dark:text-emerald-400'>
                                    Full Rollout — ১০০% Users
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    সব ঠিক থাকলে ১০০%-এ নিয়ে যান। পরে পুরনো
                                    code path সরিয়ে flag cleanup করুন।
                                </span>
                            ),
                        },
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 Feature Flags — Deployment থেকে Release আলাদা',
                    content: (
                        <p>
                            এটাই feature flags-এর সবচেয়ে বড় insight:{' '}
                            <strong>
                                &quot;Deploy&quot; এবং &quot;Release&quot; এক
                                জিনিস না।
                            </strong>{' '}
                            Deploy = code server-এ যানয়া। Release = users-এর কাছে
                            feature পৌঁছানো। Feature flags এই দুটোকে সম্পূর্ণ
                            আলাদা করে দেয়। Facebook, Google-এর মতো কোম্পানি
                            প্রতিদিন deploy করে কিন্তু release আলাদাভাবে control
                            করে।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'comparison',
            subHeader: { index: '006', title: 'কোনটা কখন Use করবো?' },
            title: (
                <SectionTitle>
                    কোনটা কখন Use করবো?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            প্রতিটা deployment pattern-এর আলাদা tradeoff আছে।
                            Context বুঝে সঠিক pattern বেছে নেওয়া একজন senior
                            engineer-এর দক্ষতা।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Pattern',
                        'Cost',
                        'Rollback Speed',
                        'Risk Level',
                        'Best For',
                    ],
                    rows: [
                        [
                            <span className='text-blue-700 dark:text-blue-400 font-semibold font-mono'>Blue-Green</span>,
                            <span className='text-red-700 dark:text-red-400'>High (2× infra)</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>Instant (&lt;1 min)</span>,
                            <span className='text-emerald-700 dark:text-emerald-400'>Low</span>,
                            'Major releases, database migrations',
                        ],
                        [
                            <span className='text-yellow-700 dark:text-yellow-400 font-semibold font-mono'>Canary</span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>Medium</span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>Slow (gradual)</span>,
                            <span className='text-emerald-700 dark:text-emerald-400'>Very Low</span>,
                            'Risky features, experimental changes',
                        ],
                        [
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold font-mono'>Rolling Update</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>Low</span>,
                            'Medium (re-deploy old)',
                            <span className='text-yellow-700 dark:text-yellow-400'>Medium</span>,
                            'Routine updates, bug fixes',
                        ],
                        [
                            <span className='text-purple-700 dark:text-purple-400 font-semibold font-mono'>Feature Flags</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>Lowest</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>Instant (config)</span>,
                            <span className='text-emerald-700 dark:text-emerald-400'>Lowest</span>,
                            'All use cases, A/B testing',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-3 mt-2'>
                            <p className='font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3'>
                                Real-World Decision Guide
                            </p>
                            {[
                                {
                                    scenario: 'E-commerce checkout redesign',
                                    pattern: 'Canary + Feature Flags',
                                    color: 'text-yellow-700 dark:text-yellow-400',
                                    reason: 'High business risk। ৫% দিয়ে শুরু, conversion rate monitor করুন। Flag দিয়ে instant rollback।',
                                },
                                {
                                    scenario: 'Critical security patch',
                                    pattern: 'Rolling Update',
                                    color: 'text-emerald-700 dark:text-emerald-400',
                                    reason: 'Fast deployment দরকার। Complex strategy-র সময় নেই। maxUnavailable: 0 দিয়ে zero downtime।',
                                },
                                {
                                    scenario: 'Database schema migration',
                                    pattern: 'Blue-Green',
                                    color: 'text-blue-700 dark:text-blue-400',
                                    reason: 'Atomic switch দরকার। Old version-কে compatible রাখুন। Problem হলে selector বদলে instant rollback।',
                                },
                                {
                                    scenario: 'New AI feature (beta)',
                                    pattern: 'Feature Flags',
                                    color: 'text-purple-700 dark:text-purple-400',
                                    reason: 'Deploy now, release later। Internal team-এ test, তারপর ধীরে ধীরে rollout। A/B test করুন।',
                                },
                            ].map((item, i) => (
                                <div key={i} className='flex gap-4 items-start p-3 bg-muted/20 border border-border rounded-lg'>
                                    <div className='min-w-0 flex-1'>
                                        <p className='text-sm font-semibold text-foreground mb-0.5'>
                                            {item.scenario}
                                        </p>
                                        <p className={`font-mono text-xs ${item.color} mb-1`}>
                                            → {item.pattern}
                                        </p>
                                        <p className='text-xs text-muted-foreground'>
                                            {item.reason}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: '⚠️ Feature Flag Tech Debt — পুরনো Flags পরিষ্কার করুন',
                    content: (
                        <p>
                            Feature flags শক্তিশালী কিন্তু বিপজ্জনকও।
                            Rollout সম্পন্ন হলে পুরনো flag এবং dead code সরাও।
                            Netflix-এর একটা incident হয়েছিল stale flag-এর কারণে
                            যেটা ৩ বছর ধরে ছিল।{' '}
                            <strong>
                                Flag lifecycle manage করুন — create, rollout,
                                cleanup।
                            </strong>{' '}
                            একটা flag maximum ৩ মাসের বেশি রাখা উচিত না।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'interview-tips',
            subHeader: { index: '007', title: 'Interview Tips' },
            title: (
                <SectionTitle>
                    Deployment Patterns Interview Tips
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-4'>
                            <ContentParagraph>
                                System design interview-এ deployment strategy
                                নিয়ে প্রশ্ন এখন common। সঠিক pattern propose
                                করতে পারা senior-level thinking দেখায়।
                            </ContentParagraph>
                            <div className='bg-muted/30 border border-border rounded-lg p-5'>
                                <p className='font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4'>
                                    Common Interview প্রশ্ন
                                </p>
                                <ul className='space-y-3'>
                                    {[
                                        '"How would you deploy a new version without downtime?"',
                                        '"What happens if your new deployment has a critical bug?"',
                                        '"How do you deploy to a subset of users first?"',
                                        '"Explain blue-green deployment and its trade-offs."',
                                        '"How does Netflix/Facebook deploy thousands of times a day?"',
                                        '"What is progressive delivery?"',
                                    ].map((q, i) => (
                                        <li
                                            key={i}
                                            className='text-sm text-muted-foreground flex items-start gap-2 py-2 border-b border-border last:border-0'>
                                            <span className='text-primary font-mono mt-0.5'>Q:</span>
                                            <span className='italic'>{q}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-5'>
                            <p className='font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4'>
                                System Design Interview-এ Deployment Strategy ব্যাখ্যা
                            </p>
                            <div className='space-y-4'>
                                <div className='flex gap-3 items-start'>
                                    <span className='font-mono text-xs px-2 py-1 border border-red-500/30 text-red-700 dark:text-red-400 bg-red-500/5 rounded flex-shrink-0'>
                                        ✗ Weak Answer
                                    </span>
                                    <p className='text-sm text-muted-foreground leading-relaxed italic'>
                                        &quot;আমরা server restart করে deploy করবো।&quot;
                                    </p>
                                </div>
                                <div className='flex gap-3 items-start'>
                                    <span className='font-mono text-xs px-2 py-1 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5 rounded flex-shrink-0'>
                                        ✓ Strong Answer
                                    </span>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        &quot;Zero-downtime deployment-এর জন্য আমি{' '}
                                        <strong className='text-foreground'>
                                            Blue-Green deployment
                                        </strong>{' '}
                                        recommend করবো। দুটো identical environment
                                        থাকবেন। New version Green-এ deploy হবে, Blue
                                        live থাকবেন। Test pass হলে Load Balancer-এর
                                        selector Green-এ switch। Bug হলে Blue-তে
                                        instant rollback। Database migration-এর জন্য
                                        backward-compatible schema change আগে apply করবো।&quot;
                                    </p>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 সবসময় Rollback Strategy উল্লেখ করুন',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                Interview-এ deployment propose করলেন সাথে সাথে
                                rollback plan বলুন:{' '}
                                <strong>
                                    &quot;এবং যদি কোনো issue হয় তাহলে...&quot;
                                </strong>
                            </p>
                            <ul className='space-y-1 mt-2 text-sm'>
                                <li className='flex items-start gap-2'>
                                    <span className='text-blue-700 dark:text-blue-400 font-mono mt-0.5'>→</span>
                                    <span>Blue-Green: selector পরিবর্তন — seconds-এ rollback</span>
                                </li>
                                <li className='flex items-start gap-2'>
                                    <span className='text-yellow-700 dark:text-yellow-400 font-mono mt-0.5'>→</span>
                                    <span>Canary: error threshold → automatic rollback to 0%</span>
                                </li>
                                <li className='flex items-start gap-2'>
                                    <span className='text-emerald-700 dark:text-emerald-400 font-mono mt-0.5'>→</span>
                                    <span>Rolling: kubectl rollout undo deployment/myapp</span>
                                </li>
                                <li className='flex items-start gap-2'>
                                    <span className='text-purple-700 dark:text-purple-400 font-mono mt-0.5'>→</span>
                                    <span>Feature Flags: flag off — deploy ছাড়াই instant</span>
                                </li>
                            </ul>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-5'>
                            <p className='font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4'>
                                Real World — Netflix, Google, Facebook কীভাবে Deploy করে
                            </p>
                            <div className='space-y-4'>
                                {[
                                    {
                                        company: 'Netflix',
                                        color: 'text-red-700 dark:text-red-400',
                                        borderColor: 'border-red-500/30',
                                        bgColor: 'bg-red-500/5',
                                        details: [
                                            'Spinnaker CI/CD platform নিজেরা তৈরি করেছেনে',
                                            'Red/Black deployment (Blue-Green-এর variant)',
                                            'Automated canary analysis (ACA) — metrics-based auto rollback',
                                            'Chaos Engineering (Chaos Monkey) — production-এ জোর করে failure inject',
                                        ],
                                    },
                                    {
                                        company: 'Google',
                                        color: 'text-blue-700 dark:text-blue-400',
                                        borderColor: 'border-blue-500/30',
                                        bgColor: 'bg-blue-500/5',
                                        details: [
                                            'Production Traffic Split — Gmail, Search-এ canary',
                                            'Borg → Kubernetes (নিজেরাই তৈরি করেছেনে)',
                                            'SRE team defines SLO → deployment blocked যদি SLO miss করে',
                                            'Launch checklists — feature flag-এর strict governance',
                                        ],
                                    },
                                    {
                                        company: 'Facebook / Meta',
                                        color: 'text-primary',
                                        borderColor: 'border-primary/30',
                                        bgColor: 'bg-primary/5',
                                        details: [
                                            'Gatekeeper system — feature flags at massive scale',
                                            'প্রতিদিন ১,০০০+ engineers deploy করে simultaneously',
                                            'Tupperware (internal Kubernetes) — container orchestration',
                                            '"2-week release train" → batch commits, canary, then full rollout',
                                        ],
                                    },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className={`border ${item.borderColor} ${item.bgColor} rounded-lg p-4`}>
                                        <p className={`font-mono text-sm font-bold ${item.color} mb-2`}>
                                            {item.company}
                                        </p>
                                        <ul className='space-y-1'>
                                            {item.details.map((d, j) => (
                                                <li
                                                    key={j}
                                                    className='text-sm text-muted-foreground flex items-start gap-2'>
                                                    <span className='text-muted-foreground mt-0.5'>→</span>
                                                    {d}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                },
            ],
        },
    ],
    summary: {
        headers: ['Pattern', 'Key Benefit', 'Main Trade-off', 'Best For'],
        rows: [
            ['Blue-Green', 'Instant rollback', '2× infrastructure cost', 'Zero-downtime critical releases'],
            ['Canary', 'Gradual risk mitigation', 'Complex monitoring needed', 'Risky feature rollouts'],
            ['Rolling Update', 'কম cost — no extra infra', 'Slower rollback, version mix', 'Resource-constrained environments'],
            ['Feature Flags', 'Runtime flexibility', 'Code complexity বাড়ে', 'Dark launches & A/B testing'],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'Blue-Green deployment এ traffic switch কীভাবে হয়?',
                options: [
                    {
                        key: 'a',
                        text: 'নতুন server কিনে পুরনোটা বন্ধ করা হয়',
                        isCorrect: false,
                        explanation:
                            'Server কেনার দরকার নেই — দুটো environment আগে থেকেই আছে।',
                    },
                    {
                        key: 'b',
                        text: 'Load balancer routing পরিবর্তন করে (selector switch)',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Blue-Green-এ Load Balancer বা Kubernetes Service selector পরিবর্তন করলেনই traffic switch হয়। Blue থেকে Green-এ যেতে seconds লাগে। Blue environment standby-তে থাকে rollback-এর জন্য।',
                    },
                    {
                        key: 'c',
                        text: 'Database migration দিয়ে switch হয়',
                        isCorrect: false,
                        explanation:
                            'Database migration আলাদা process। Traffic switch শুধু routing layer-এ।',
                    },
                    {
                        key: 'd',
                        text: 'DNS TTL পরিবর্তন করে switch হয়',
                        isCorrect: false,
                        explanation:
                            'DNS propagation slow — minutes লাগে। Load balancer selector instant।',
                    },
                ],
            },
            {
                id: 2,
                text: 'Canary release এর নামের উৎস কী?',
                options: [
                    {
                        key: 'a',
                        text: 'Canary Islands থেকে এসেছে',
                        isCorrect: false,
                        explanation:
                            'Canary Islands সম্পর্কিত নয়।',
                    },
                    {
                        key: 'b',
                        text: 'Software testing-এর canary test থেকে',
                        isCorrect: false,
                        explanation:
                            'এটা correct direction কিন্তু পুরো answer নয়।',
                    },
                    {
                        key: 'c',
                        text: 'Coal mine-এ canary পাখি ব্যবহার করে বিষাক্ত গ্যাস detect করা হতো',
                        isCorrect: true,
                        explanation:
                            'সঠিক। ঐতিহাসিকভাবে coal mine-এ canary পাখি রাখা হতো — বিষাক্ত গ্যাস থাকলে পাখি আগে মারা যেত, miners সতর্ক হতো। Software-এ canary release-এ ছোট subset of users আগে নতুন version পায় — production-এ কোনো "বিষ" (bug) থাকলে আগেই ধরা পড়ে।',
                    },
                    {
                        key: 'd',
                        text: 'Google-এর একজন engineer-এর নাম',
                        isCorrect: false,
                        explanation:
                            'এটা সত্য নয়।',
                    },
                ],
            },
            {
                id: 3,
                text: 'Rolling update এ maxUnavailable = 0 মানে কী?',
                options: [
                    {
                        key: 'a',
                        text: 'কোনো pod update হবে না',
                        isCorrect: false,
                        explanation:
                            'maxUnavailable = 0 মানে update বন্ধ নয়।',
                    },
                    {
                        key: 'b',
                        text: 'সব pod একসাথে update হবে',
                        isCorrect: false,
                        explanation:
                            'সব একসাথে update হলে সেটা Big Bang deployment।',
                    },
                    {
                        key: 'c',
                        text: 'কোনো pod down না করে update করতে হবে — zero downtime guarantee',
                        isCorrect: true,
                        explanation:
                            'সঠিক। maxUnavailable = 0 মানে rolling update-এর সময় কোনো pod unavailable রাখা যাবেন না। নতুন pod ready হলে তবেই পুরনো pod নামবে। এটা zero downtime নিশ্চিত করে। Tradeoff: maxSurge থাকতে হবে extra capacity-র জন্য।',
                    },
                    {
                        key: 'd',
                        text: 'Update 0 বার হবে',
                        isCorrect: false,
                        explanation:
                            'এটা correct interpretation নয়।',
                    },
                ],
            },
            {
                id: 4,
                text: 'Feature flags এর সবচেয়ে বড় সুবিধা কী?',
                options: [
                    {
                        key: 'a',
                        text: 'Code faster deploy হয়',
                        isCorrect: false,
                        explanation:
                            'Deployment speed feature flag-এর primary advantage নয়।',
                    },
                    {
                        key: 'b',
                        text: 'Deployment থেকে release আলাদা করা যায়',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Feature flags-এর সবচেয়ে বড় insight হলো "Deploy" ≠ "Release"। Code production-এ deploy করা যায় (flag off), users দেখবেন না। যখন চাও তখন flag on করে release করুন। Instant rollback, A/B testing, gradual rollout — সবকিছু deploy ছাড়াই।',
                    },
                    {
                        key: 'c',
                        text: 'Database automatically scale হয়',
                        isCorrect: false,
                        explanation:
                            'Feature flags database scaling-এর সাথে সম্পর্কিত নয়।',
                    },
                    {
                        key: 'd',
                        text: 'Code automatically test হয়',
                        isCorrect: false,
                        explanation:
                            'Feature flags automated testing নয়।',
                    },
                ],
            },
            {
                id: 5,
                text: 'Blue-Green এর সবচেয়ে বড় সমস্যা কী?',
                options: [
                    {
                        key: 'a',
                        text: 'Rollback করা কঠিন',
                        isCorrect: false,
                        explanation:
                            'Blue-Green-এ rollback সবচেয়ে easy — instant selector switch।',
                    },
                    {
                        key: 'b',
                        text: 'দ্বিগুণ infrastructure cost',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Blue-Green-এ সবসময় দুটো full production environment চালু রাখতে হয়। Cloud cost দ্বিগুণ। Small startup-এর জন্য এটা prohibitive হতে পারে। Solution: spot instances use করা, বা deployment সময় Green spin up → switch → Blue tear down।',
                    },
                    {
                        key: 'c',
                        text: 'Zero downtime নিশ্চিত করা যায় না',
                        isCorrect: false,
                        explanation:
                            'Blue-Green actually zero downtime-এর জন্যই ব্যবহার হয়।',
                    },
                    {
                        key: 'd',
                        text: 'Kubernetes-এ কাজ করে না',
                        isCorrect: false,
                        explanation:
                            'Blue-Green Kubernetes-এ Service selector দিয়ে perfectly কাজ করে।',
                    },
                ],
            },
            {
                id: 6,
                text: 'Canary release এ কতটুকু traffic দিয়ে শুরু করা ভালো?',
                options: [
                    {
                        key: 'a',
                        text: '৫০%',
                        isCorrect: false,
                        explanation:
                            '৫০% দিয়ে শুরু করা risky — বড় bug হলে অর্ধেক users affected।',
                    },
                    {
                        key: 'b',
                        text: '২৫%',
                        isCorrect: false,
                        explanation:
                            '২৫% দিয়ে শুরু করাও অনেক বেশি — conservative approach better।',
                    },
                    {
                        key: 'c',
                        text: '১-৫%',
                        isCorrect: true,
                        explanation:
                            'সঠিক। ১-৫% দিয়ে canary শুরু করা best practice। Minimal blast radius। Bug হলে ৯৫-৯৯% users unaffected। Internal team এবং beta users প্রথম। Metrics stable থাকলে gradually বাড়াও: 5% → 25% → 50% → 100%।',
                    },
                    {
                        key: 'd',
                        text: '১০০%',
                        isCorrect: false,
                        explanation:
                            '১০০% দিলে canary-র কোনো মানে নেই — সেটা full rollout।',
                    },
                ],
            },
            {
                id: 7,
                text: 'Zero-downtime deployment এর জন্য কোনটা সবচেয়ে simple?',
                options: [
                    {
                        key: 'a',
                        text: 'Blue-Green',
                        isCorrect: false,
                        explanation:
                            'Blue-Green effective কিন্তু দুটো environment manage করা complex।',
                    },
                    {
                        key: 'b',
                        text: 'Canary',
                        isCorrect: false,
                        explanation:
                            'Canary traffic split, monitoring, gradual rollout — complex।',
                    },
                    {
                        key: 'c',
                        text: 'Rolling update',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Rolling update Kubernetes-এ built-in। শুধু image tag পরিবর্তন করুন, বাকিটা Kubernetes করে। maxUnavailable: 0 দিলে zero downtime। Extra infrastructure দরকার নেই, complex configuration নেই। Simplest zero-downtime option।',
                    },
                    {
                        key: 'd',
                        text: 'Feature Flags',
                        isCorrect: false,
                        explanation:
                            'Feature flags deployment pattern নয়, release management tool।',
                    },
                ],
            },
            {
                id: 8,
                text: 'Feature flags কোথায় store করা উচিত?',
                options: [
                    {
                        key: 'a',
                        text: 'Code-এর মধ্যে hardcoded করে',
                        isCorrect: false,
                        explanation:
                            'Hardcoded flags change করতে redeploy লাগবে — flags-এর purpose নষ্ট।',
                    },
                    {
                        key: 'b',
                        text: 'Environment variable-এ',
                        isCorrect: false,
                        explanation:
                            'Env variable change করতেও restart লাগে, real-time control নেই।',
                    },
                    {
                        key: 'c',
                        text: 'Centralized config service (LaunchDarkly, ConfigCat, বা custom)',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Feature flags centralized config service-এ store করা উচিত। LaunchDarkly, ConfigCat, AWS AppConfig, বা নিজের Redis-based solution। Advantages: real-time update (no restart), audit log, percentage rollout, user targeting, A/B testing support।',
                    },
                    {
                        key: 'd',
                        text: 'S3 bucket-এ JSON file হিসেবে',
                        isCorrect: false,
                        explanation:
                            'S3 possible কিন্তু real-time update, SDK, audit trail নেই।',
                    },
                ],
            },
            {
                id: 9,
                text: 'Kubernetes এ Blue-Green switch করা হয় কীভাবে?',
                options: [
                    {
                        key: 'a',
                        text: 'নতুন Cluster তৈরি করে',
                        isCorrect: false,
                        explanation:
                            'Cluster তৈরি করতে অনেক সময় লাগে — instant switch-এর জন্য unnecessary।',
                    },
                    {
                        key: 'b',
                        text: 'DNS record পরিবর্তন করে',
                        isCorrect: false,
                        explanation:
                            'DNS propagation slow (TTL minutes) — instant switch-এর জন্য suitable নয়।',
                    },
                    {
                        key: 'c',
                        text: 'Service selector পরিবর্তন করে',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Kubernetes Service-এ selector field আছে। Blue deployment-এ selector: version: blue। Switch করতে শুধু selector: version: green করুন। Kubernetes তাৎক্ষণিকভাবে traffic route পরিবর্তন করে। kubectl patch service app-service -p \'{"spec":{"selector":{"version":"green"}}}\'।',
                    },
                    {
                        key: 'd',
                        text: 'ConfigMap update করে',
                        isCorrect: false,
                        explanation:
                            'ConfigMap environment config-এর জন্য — traffic routing-এর জন্য নয়।',
                    },
                ],
            },
            {
                id: 10,
                text: 'Canary deployment এ automatic rollback কখন হয়?',
                options: [
                    {
                        key: 'a',
                        text: 'প্রতি ৫ মিনিটে scheduled rollback হয়',
                        isCorrect: false,
                        explanation:
                            'Scheduled rollback canary-র concept নয়।',
                    },
                    {
                        key: 'b',
                        text: 'কোনো engineer manually trigger করলেন',
                        isCorrect: false,
                        explanation:
                            'Manual rollback possible কিন্তু automatic rollback-ই modern approach।',
                    },
                    {
                        key: 'c',
                        text: 'Error rate threshold exceed করলেন (যেমন baseline-এর চেয়ে ২× বেশি error)',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Argo Rollouts, Flagger-এর মতো tools metrics monitor করে। Error rate, latency, business metrics-এর জন্য threshold define করা হয়। Canary-র error rate baseline-এর চেয়ে বেশি হলে automatic rollback — percentage 0-এ নামিয়ে দেয়। Human intervention ছাড়াই safe।',
                    },
                    {
                        key: 'd',
                        text: 'নতুন version deploy হলে',
                        isCorrect: false,
                        explanation:
                            'নতুন deployment trigger করলেন নতুন canary cycle শুরু হয়।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'Zero-Downtime Deployment Pipeline Design করুন',
        time: '৩-৪ ঘন্টা',
        difficulty: 'Intermediate',
        tasks: [
            <span>
                <strong>Blue-Green Kubernetes Setup:</strong> একটা simple web
                app-এর জন্য Blue এবং Green deployment YAML লিখুন। Service
                selector দিয়ে traffic switch করুন। Blue → Green → Blue rollback
                test করুন। Kubectl commands document করুন।
            </span>,
            <span>
                <strong>Canary with Nginx:</strong> Nginx upstream-এ দুটো
                backend configure করুন (stable: 95%, canary: 5%)। Nginx
                configuration লিখুন। Apache Bench (ab) দিয়ে ১০০০ request পাঠাও,
                কতটা canary-তে গেল দেখুন।
            </span>,
            <span>
                <strong>Feature Flag Implementation:</strong> TypeScript/Python-এ
                simple feature flag service বানান। User ID দিয়ে consistent
                bucketing implement করুন (hash function)। ৩টা flag তৈরি করুন:
                একটা off, একটা 5%, একটা 100%। Test করুন।
            </span>,
            <span>
                <strong>Monitoring Integration:</strong> Canary deployment-এ
                Prometheus metrics add করুন। Error rate counter এবং request
                latency histogram। ৫% error rate threshold-এ alert define করুন।
                Grafana dashboard তৈরি করুন।
            </span>,
        ],
        deliverables: [
            <span>Blue-Green YAML files + switch script</span>,
            <span>Nginx canary config + traffic split test results</span>,
            <span>Feature flag service code + unit tests</span>,
            <span>Prometheus metrics + Grafana dashboard screenshot</span>,
        ],
    },
    practicalLab: {
        title: 'Kubernetes Blue-Green + Canary Deployment',
        subtitle: 'Kubernetes + Nginx Ingress + Prometheus',
        steps: [
            {
                title: 'Local Kubernetes Cluster Setup করুন',
                description:
                    'minikube বা kind দিয়ে local cluster তৈরি করুন। kubectl install করুন। একটা simple Node.js/Python app Docker image বানান — v1 এবং v2 (v2-তে response-এ "v2" mention করুন)।',
            },
            {
                title: 'Blue-Green Deployment Deploy করুন',
                description:
                    'blue-deployment.yaml এবং green-deployment.yaml apply করুন। app-service.yaml দিয়ে Service তৈরি করুন (initially selector: version: blue)। kubectl port-forward দিয়ে test করুন — Blue serve করছে কিনা।',
            },
            {
                title: 'Traffic Switch করুন (Blue → Green)',
                description:
                    'kubectl patch command দিয়ে Service selector green-এ switch করুন। আবার test — এখন Green serve করছে। Blue pod এখনো চালু আছে কিনা confirm করুন।',
            },
            {
                title: 'Canary Setup করুন',
                description:
                    'stable-deployment.yaml (3 replicas v1) এবং canary-deployment.yaml (1 replica v2) deploy করুন। একই Service label-এ দুটোই match করবেন। 100টা curl request পাঠাও — roughly 25% canary-তে যাবেন।',
            },
            {
                title: 'Prometheus Metrics যোগ করুন',
                description:
                    'App-এ /metrics endpoint যোগ করুন। http_requests_total counter এবং http_request_duration_seconds histogram। Prometheus-এ scrape config করুন। Error rate query লিখুন।',
            },
        ],
        codeBlock: {
            language: 'bash',
            filename: 'blue-green-switch.sh',
            code: `#!/bin/bash
# Blue-Green Traffic Switch Script

NAMESPACE="default"
SERVICE="app-service"

# Current version check করুন
current=$(kubectl get service $SERVICE -n $NAMESPACE \
  -o jsonpath='{.spec.selector.version}')
echo "Current active: $current"

# Switch করুন
if [ "$current" == "blue" ]; then
    new_version="green"
else
    new_version="blue"
fi

echo "Switching to: $new_version..."

kubectl patch service $SERVICE -n $NAMESPACE \
  -p "{\"spec\":{\"selector\":{\"version\":\"$new_version\"}}}"

# Verify switch
sleep 2
active=$(kubectl get service $SERVICE -n $NAMESPACE \
  -o jsonpath='{.spec.selector.version}')
echo "Now active: $active"

# Health check
echo "Running health check..."
for i in {1..5}; do
    response=$(curl -s http://localhost:8080/health)
    echo "Request $i: $response"
    sleep 1
done

echo "Switch complete! Rollback: run this script again."`,
        },
        tip: 'Blue-Green switch শুধু একটা YAML field পরিবর্তন — এটা practically করে দেখলে পুরো concept clear হয়ে যায়। minikube-তে করতে পারলেন production Kubernetes-এও same principle কাজ করবেন।',
    },
};
