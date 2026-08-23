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

export const uberContent: TopicData = {
    id: 'uber',
    sections: [
        {
            id: 'why-uber',
            subHeader: { index: '001', title: 'Why This System' },
            title: (
                <SectionTitle>
                    Uber কেন Unique? Real-Time Geospatial Challenge
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
                                <span className='font-mono text-xs px-3 py-1 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5 rounded'>
                                    📊 Junior Level
                                </span>
                                <span className='font-mono text-xs px-3 py-1 border border-orange-400/30 text-orange-700 dark:text-orange-400 bg-orange-400/5 rounded'>
                                    🗺️ Geospatial Systems
                                </span>
                                <span className='font-mono text-xs px-3 py-1 border border-purple-400/30 text-purple-700 dark:text-purple-400 bg-purple-400/5 rounded'>
                                    FINAL SYSTEM 07 / 07
                                </span>
                            </div>
                            <ContentParagraph>
                                Uber-এ সবচেয়ে কঠিন সমস্যা হলো{' '}
                                <strong className='text-foreground'>
                                    real-time geospatial matching
                                </strong>{' '}
                                — কোটি কোটি moving drivers-এর location track করুন
                                এবং milliseconds-এ কাছের driver-কে rider-এর সাথে
                                match করুন। এটা regular database problem না — এটা{' '}
                                <strong className='text-foreground'>
                                    location-aware computing
                                </strong>
                                ।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 Core Challenge',
                    content: (
                        <p>
                            <strong>Geospatial Problem:</strong> Driver location
                            প্রতি 4 sec update হয়। Rider request করলেন 5km
                            radius-এর মধ্যে available drivers খুঁজতে হবে।
                            Standard SQL database-এ lat/lng দিয়ে এই query করা
                            impractical। Special data structure দরকার —{' '}
                            <strong>Geohash</strong> বা{' '}
                            <strong>QuadTree</strong>।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                Uber Architecture Overview — High Level Flow
                            </p>
                            <svg
                                viewBox='0 0 680 330'
                                className='w-full max-w-2xl mx-auto'>
                                <defs>
                                    <marker
                                        id='arr'
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
                                        id='arrC'
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
                                    <marker
                                        id='arrG'
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
                                {/* Driver */}
                                <rect
                                    x='10'
                                    y='30'
                                    width='80'
                                    height='50'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='50'
                                    y='52'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    DRIVER
                                </text>
                                <text
                                    x='50'
                                    y='65'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    GPS update
                                </text>
                                <text
                                    x='50'
                                    y='76'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    every 4s
                                </text>
                                <path
                                    d='M 90 55 L 145 55'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                    markerEnd='url(#arrG)'
                                />
                                {/* Location Service */}
                                <rect
                                    x='145'
                                    y='30'
                                    width='110'
                                    height='50'
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
                                    LOCATION
                                </text>
                                <text
                                    x='200'
                                    y='65'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    SERVICE
                                </text>
                                <text
                                    x='200'
                                    y='76'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Update driver pos
                                </text>
                                <path
                                    d='M 255 55 L 310 55'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr)'
                                />
                                {/* Geospatial Index */}
                                <rect
                                    x='310'
                                    y='20'
                                    width='120'
                                    height='70'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#06b6d4'
                                    strokeWidth='2'
                                />
                                <text
                                    x='370'
                                    y='44'
                                    textAnchor='middle'
                                    fill='#06b6d4'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    GEOSPATIAL
                                </text>
                                <text
                                    x='370'
                                    y='57'
                                    textAnchor='middle'
                                    fill='#06b6d4'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    INDEX
                                </text>
                                <text
                                    x='370'
                                    y='70'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Geohash / QuadTree
                                </text>
                                <text
                                    x='370'
                                    y='82'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    Redis GEO
                                </text>
                                {/* Rider */}
                                <rect
                                    x='10'
                                    y='160'
                                    width='80'
                                    height='50'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#06b6d4'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='50'
                                    y='182'
                                    textAnchor='middle'
                                    fill='#06b6d4'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    RIDER
                                </text>
                                <text
                                    x='50'
                                    y='195'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Requests ride
                                </text>
                                <text
                                    x='50'
                                    y='206'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    location: A
                                </text>
                                <path
                                    d='M 90 185 L 145 185'
                                    stroke='#06b6d4'
                                    strokeWidth='1.5'
                                    markerEnd='url(#arrC)'
                                />
                                {/* Trip Service */}
                                <rect
                                    x='145'
                                    y='160'
                                    width='110'
                                    height='50'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='200'
                                    y='182'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    TRIP
                                </text>
                                <text
                                    x='200'
                                    y='195'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    SERVICE
                                </text>
                                <text
                                    x='200'
                                    y='206'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Manage trips
                                </text>
                                <path
                                    d='M 255 185 L 310 100'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr)'
                                />
                                <text
                                    x='290'
                                    y='145'
                                    fill='#475569'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    find nearby
                                </text>
                                {/* Matching Service */}
                                <rect
                                    x='470'
                                    y='85'
                                    width='120'
                                    height='60'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#f97316'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='530'
                                    y='108'
                                    textAnchor='middle'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    MATCHING
                                </text>
                                <text
                                    x='530'
                                    y='121'
                                    textAnchor='middle'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    SERVICE
                                </text>
                                <text
                                    x='530'
                                    y='135'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Score + select
                                </text>
                                <path
                                    d='M 430 55 L 470 110'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr)'
                                />
                                <path
                                    d='M 255 195 L 470 130'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr)'
                                />
                                {/* Surge Pricing */}
                                <rect
                                    x='470'
                                    y='170'
                                    width='120'
                                    height='50'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#eab308'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='530'
                                    y='192'
                                    textAnchor='middle'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    SURGE PRICING
                                </text>
                                <text
                                    x='530'
                                    y='207'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Supply/Demand
                                </text>
                                {/* Notification / WebSocket */}
                                <rect
                                    x='470'
                                    y='240'
                                    width='120'
                                    height='50'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#25d366'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='530'
                                    y='262'
                                    textAnchor='middle'
                                    fill='#25d366'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    NOTIFICATION
                                </text>
                                <text
                                    x='530'
                                    y='275'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    WebSocket push
                                </text>
                                {/* Payment */}
                                <rect
                                    x='145'
                                    y='250'
                                    width='110'
                                    height='50'
                                    rx='4'
                                    fill='transparent'
                                    stroke='#ef4444'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='200'
                                    y='272'
                                    textAnchor='middle'
                                    fill='#ef4444'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    PAYMENT
                                </text>
                                <text
                                    x='200'
                                    y='285'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Stripe / Braintree
                                </text>
                                {/* Arrows */}
                                <path
                                    d='M 530 145 L 530 170'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr)'
                                />
                                <path
                                    d='M 530 220 L 530 240'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr)'
                                />
                                <path
                                    d='M 200 210 L 200 250'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr)'
                                />
                                {/* Footer label */}
                                <text
                                    x='10'
                                    y='320'
                                    fill='#475569'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Trip complete → Payment service charges
                                    rider, pays driver
                                </text>
                            </svg>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'requirements',
            subHeader: { index: '002', title: 'Requirements' },
            title: <SectionTitle>Features কী কী?</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='bg-muted/30 border border-border rounded-lg p-5'>
                                <p className='font-mono text-xs uppercase tracking-widest text-primary mb-4'>
                                    ✅ Functional Requirements
                                </p>
                                <ul className='space-y-2'>
                                    {[
                                        'Rider: ride request করা',
                                        'Driver: nearby riders দেখা',
                                        'Real-time location tracking',
                                        'Driver-Rider matching',
                                        'Fare calculation',
                                        'Surge pricing',
                                        'Trip history',
                                        'Payment processing',
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className='text-sm text-muted-foreground flex items-start gap-2 py-1 border-b border-border last:border-0'>
                                            <span className='text-muted-foreground mt-0.5'>
                                                →
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className='bg-muted/30 border border-border rounded-lg p-5'>
                                <p className='font-mono text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-4'>
                                    ⚡ Non-Functional Requirements
                                </p>
                                <ul className='space-y-2'>
                                    {[
                                        '10M+ daily active users',
                                        'Location update every 4 sec',
                                        'Match within 1 minute',
                                        '1km precision',
                                        'Low latency (< 200ms match)',
                                        '99.99% availability',
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className='text-sm text-muted-foreground flex items-start gap-2 py-1 border-b border-border last:border-0'>
                                            <span className='text-muted-foreground mt-0.5'>
                                                →
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'estimation',
            subHeader: { index: '003', title: 'Capacity Estimation' },
            title: (
                <SectionTitle>
                    Uber-এর Numbers — Back-of-Envelope
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                            {[
                                { num: '5M', label: 'Active Drivers' },
                                { num: '10M', label: 'Daily Active Users' },
                                { num: '1.25M', label: 'Loc updates/sec' },
                                { num: '~14M', label: 'Trips/day' },
                                { num: '63', label: 'Countries' },
                                {
                                    num: '4 sec',
                                    label: 'Driver location interval',
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className='bg-muted/30 border border-border rounded-lg p-4 text-center'>
                                    <span className='font-mono text-2xl font-bold text-primary block mb-1'>
                                        {item.num}
                                    </span>
                                    <span className='font-mono text-xs text-muted-foreground uppercase tracking-wide'>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '🔢 Location Update Load',
                    content: (
                        <p>
                            5M active drivers × 1 update/4sec ={' '}
                            <strong>
                                1.25 million location updates/second
                            </strong>
                            । এটা massive write throughput। Standard relational
                            DB handle করতে পারবেন না। Specialized time-series
                            storage দরকার।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-5'>
                            <p className='font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4'>
                                Storage Calculation
                            </p>
                            <div className='space-y-2 text-sm text-muted-foreground font-mono'>
                                <div className='flex justify-between py-2 border-b border-border'>
                                    <span>Driver location record size</span>
                                    <span className='text-primary'>
                                        ~50 bytes
                                    </span>
                                </div>
                                <div className='flex justify-between py-2 border-b border-border'>
                                    <span>5M drivers × 50 bytes</span>
                                    <span className='text-primary'>
                                        ~250 MB (in-memory)
                                    </span>
                                </div>
                                <div className='flex justify-between py-2 border-b border-border'>
                                    <span>14M trips/day × 500 bytes</span>
                                    <span className='text-primary'>
                                        ~7 GB/day (trip history)
                                    </span>
                                </div>
                                <div className='flex justify-between py-2'>
                                    <span>5 years trip history</span>
                                    <span className='text-primary'>
                                        ~12.7 TB
                                    </span>
                                </div>
                            </div>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'architecture',
            subHeader: { index: '004', title: 'High-Level Architecture' },
            title: (
                <SectionTitle>
                    Uber Architecture — Services Breakdown
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Uber microservices-এ built। প্রতিটা core function
                            আলাদা service। Key services হলো: Location Service,
                            Geospatial Index, Trip Service, Matching Service,
                            Surge Pricing, Notification, এবং Payment।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    steps: [
                        {
                            title: (
                                <span className='font-mono text-emerald-700 dark:text-emerald-400'>
                                    Driver App — GPS Update (প্রতি 4 sec)
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Driver app WebSocket connection maintain
                                    করে। প্রতি 4 second এ lat/lng Location
                                    Service-এ push করে। Location Service Redis
                                    GEO-তে update করে।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-primary'>
                                    Rider App — Ride Request
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Rider pickup/destination enter করে। Trip
                                    Service request receive করে। Geospatial
                                    Index query করে 5km radius-এর available
                                    drivers খোঁজে।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-orange-700 dark:text-orange-400'>
                                    Matching Service — Best Driver Select
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Nearby drivers-এর list থেকে multi-factor
                                    scoring করে best driver বেছে নেয়। Distance,
                                    rating, acceptance rate — সব factor consider
                                    করে। WebSocket দিয়ে driver-কে request push।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-purple-700 dark:text-purple-400'>
                                    Driver Response — Accept/Decline (15 sec
                                    window)
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Driver 15 sec-এর মধ্যে accept/decline করে।
                                    Accept = trip starts। Decline/timeout = next
                                    best driver try। Driver acceptance rate
                                    track হয় future matching-এ।
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-emerald-700 dark:text-emerald-400'>
                                    Trip in Progress — Real-time Tracking
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Trip active থাকলে driver location rider
                                    app-এ real-time দেখায়। Surge pricing
                                    continuously calculate হয়। Trip complete
                                    হলে Payment service charge করে।
                                </span>
                            ),
                        },
                    ],
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-3 mt-2'>
                            <p className='font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3'>
                                Tech Stack
                            </p>
                            <div className='space-y-3'>
                                <div>
                                    <p className='text-xs font-mono text-muted-foreground mb-2'>
                                        Core Services
                                    </p>
                                    <div className='flex flex-wrap gap-2'>
                                        {[
                                            {
                                                label: 'Go (Location/Matching)',
                                                color: 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5',
                                            },
                                            {
                                                label: 'Python (ML/Surge)',
                                                color: 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5',
                                            },
                                            {
                                                label: 'Node.js (API)',
                                                color: 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5',
                                            },
                                            {
                                                label: 'Kubernetes',
                                                color: 'border-purple-400/30 text-purple-700 dark:text-purple-400 bg-purple-400/5',
                                            },
                                        ].map((tag, i) => (
                                            <span
                                                key={i}
                                                className={`font-mono text-xs px-3 py-1.5 border rounded ${tag.color}`}>
                                                {tag.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className='text-xs font-mono text-muted-foreground mb-2'>
                                        Geospatial & Data
                                    </p>
                                    <div className='flex flex-wrap gap-2'>
                                        {[
                                            {
                                                label: 'Redis GEO (Driver locations)',
                                                color: 'border-yellow-400/30 text-yellow-700 dark:text-yellow-400 bg-yellow-400/5',
                                            },
                                            {
                                                label: 'Cassandra (Trip history)',
                                                color: 'border-primary/30 text-primary bg-primary/5',
                                            },
                                            {
                                                label: 'PostgreSQL (Users/Payments)',
                                                color: 'border-primary/30 text-primary bg-primary/5',
                                            },
                                            {
                                                label: 'H3 Hexagonal Grid (Custom Geohash)',
                                                color: 'border-primary/30 text-primary bg-primary/5',
                                            },
                                        ].map((tag, i) => (
                                            <span
                                                key={i}
                                                className={`font-mono text-xs px-3 py-1.5 border rounded ${tag.color}`}>
                                                {tag.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className='text-xs font-mono text-muted-foreground mb-2'>
                                        Real-time & Analytics
                                    </p>
                                    <div className='flex flex-wrap gap-2'>
                                        {[
                                            {
                                                label: 'WebSocket (Driver-Rider)',
                                                color: 'border-purple-400/30 text-purple-700 dark:text-purple-400 bg-purple-400/5',
                                            },
                                            {
                                                label: 'Apache Kafka',
                                                color: 'border-orange-400/30 text-orange-700 dark:text-orange-400 bg-orange-400/5',
                                            },
                                            {
                                                label: 'Apache Flink (Stream processing)',
                                                color: 'border-purple-400/30 text-purple-700 dark:text-purple-400 bg-purple-400/5',
                                            },
                                            {
                                                label: 'Hadoop + Spark (ML training)',
                                                color: 'border-purple-400/30 text-purple-700 dark:text-purple-400 bg-purple-400/5',
                                            },
                                        ].map((tag, i) => (
                                            <span
                                                key={i}
                                                className={`font-mono text-xs px-3 py-1.5 border rounded ${tag.color}`}>
                                                {tag.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'geospatial',
            subHeader: { index: '005', title: 'Geospatial Indexing' },
            title: (
                <SectionTitle>
                    Geohash — Location Encode করার উপায়
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            পৃথিবীর যেকোনো location-কে একটা string-এ encode করা
                            যায় — এটাই{' '}
                            <strong className='text-foreground'>Geohash</strong>
                            । Geohash-এর length precision নির্ধারণ করে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Geohash Length',
                        'Cell Size (approx)',
                        'Use Case',
                    ],
                    rows: [
                        ['1 character', '5000 × 5000 km', 'Country level'],
                        ['4 characters', '40 × 20 km', 'City level'],
                        [
                            '6 characters',
                            '1.2 × 0.6 km',
                            <span className='text-primary font-semibold'>
                                Neighborhood (Uber uses ~6)
                            </span>,
                        ],
                        ['8 characters', '38 × 19 meters', 'Street level'],
                        ['12 characters', '~3.7 cm', 'Exact location'],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 Geohash Magic',
                    content: (
                        <p>
                            Dhaka-র একটা location:{' '}
                            <strong className='font-mono'>hsgtn4</strong>। কাছের
                            locations-এর geohash প্রায় same prefix হয়।
                            &quot;hsgtn&quot; prefix-এর সব drivers = Dhaka-র ওই
                            neighborhood-এ। Database-এ string prefix query করলেনই
                            nearby drivers পানয়া যায়।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'geospatial_service.py — Redis GEO',
                    code: `import redis

r = redis.Redis()

# Driver location update (প্রতি 4 sec)
def update_driver_location(driver_id: str, lat: float, lng: float):
    # Redis GEO: GEOADD key longitude latitude member
    r.geoadd("drivers:active", {driver_id: (lng, lat)})
    # Driver status update
    r.hset(f"driver:{driver_id}", mapping={
        "lat": lat, "lng": lng,
        "status": "available",
        "updated_at": now()
    })

# Rider request — nearby drivers খুঁজুন
def find_nearby_drivers(rider_lat: float, rider_lng: float, radius_km: float = 5):
    # Redis GEORADIUS: center থেকে radius-এর মধ্যে সব drivers
    nearby = r.georadius(
        "drivers:active",
        rider_lng, rider_lat,
        radius_km,
        unit='km',
        withcoord=True,
        withdist=True,
        sort='ASC',  # Closest first
        count=10     # Top 10 closest
    )
    return [
        {"driver_id": d[0], "distance_km": d[1], "location": d[2]}
        for d in nearby
    ]

# Example output:
# [{"driver_id": "D123", "distance_km": 0.8, "location": (90.4, 23.8)},
#  {"driver_id": "D456", "distance_km": 1.2, ...}]`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 QuadTree vs Geohash',
                    content: (
                        <div>
                            <p>
                                <strong>QuadTree:</strong> Map-কে 4 quadrants-এ
                                ভাগ করুন, প্রতিটাকে আবার 4 ভাগ। Dense area =
                                deeper split। Driver খুঁজতে tree traverse করুন।
                            </p>
                            <br />
                            <p>
                                <strong>Geohash:</strong> Location string-এ
                                encode করুন। Prefix = neighborhood। Simpler
                                implementation।
                            </p>
                            <br />
                            <p>
                                Uber internally custom Geohash-based system (
                                <strong>H3</strong>) use করে।
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                Geohash Visualization — Dhaka City
                            </p>
                            <svg
                                viewBox='0 0 500 280'
                                className='w-full max-w-xl mx-auto'>
                                {/* Background grid cells */}
                                {[0, 1, 2, 3, 4].map(col =>
                                    [0, 1, 2, 3].map(row => (
                                        <rect
                                            key={`${col}-${row}`}
                                            x={50 + col * 80}
                                            y={30 + row * 55}
                                            width='78'
                                            height='53'
                                            fill='transparent'
                                            stroke='#1e2d4a'
                                            strokeWidth='1'
                                        />
                                    ))
                                )}
                                {/* Highlighted cell — Rider location */}
                                <rect
                                    x='210'
                                    y='85'
                                    width='78'
                                    height='53'
                                    fill='rgba(6,182,212,0.1)'
                                    stroke='#06b6d4'
                                    strokeWidth='2'
                                />
                                <text
                                    x='249'
                                    y='107'
                                    textAnchor='middle'
                                    fill='#06b6d4'
                                    fontFamily='monospace'
                                    fontSize='8'
                                    fontWeight='bold'>
                                    hsgtn4
                                </text>
                                <text
                                    x='249'
                                    y='120'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    RIDER
                                </text>
                                {/* Adjacent cells — neighbor drivers */}
                                <rect
                                    x='130'
                                    y='85'
                                    width='78'
                                    height='53'
                                    fill='rgba(16,185,129,0.07)'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='169'
                                    y='112'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    hsgtn3
                                </text>
                                <rect
                                    x='290'
                                    y='85'
                                    width='78'
                                    height='53'
                                    fill='rgba(16,185,129,0.07)'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='329'
                                    y='112'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    hsgtn6
                                </text>
                                <rect
                                    x='210'
                                    y='30'
                                    width='78'
                                    height='53'
                                    fill='rgba(16,185,129,0.07)'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='249'
                                    y='57'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    hsgtn1
                                </text>
                                <rect
                                    x='210'
                                    y='140'
                                    width='78'
                                    height='53'
                                    fill='rgba(16,185,129,0.07)'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='249'
                                    y='167'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    hsgtn7
                                </text>
                                {/* Driver dots */}
                                <circle
                                    cx='185'
                                    cy='108'
                                    r='6'
                                    fill='#10b981'
                                />
                                <text
                                    x='185'
                                    y='125'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='6'>
                                    D1
                                </text>
                                <circle
                                    cx='315'
                                    cy='100'
                                    r='6'
                                    fill='#10b981'
                                />
                                <text
                                    x='315'
                                    y='117'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='6'>
                                    D2
                                </text>
                                <circle cx='245' cy='50' r='6' fill='#10b981' />
                                <text
                                    x='245'
                                    y='67'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='6'>
                                    D3
                                </text>
                                {/* Rider dot */}
                                <circle
                                    cx='249'
                                    cy='112'
                                    r='7'
                                    fill='#06b6d4'
                                />
                                <text
                                    x='249'
                                    y='132'
                                    textAnchor='middle'
                                    fill='#06b6d4'
                                    fontFamily='monospace'
                                    fontSize='7'>
                                    RIDER
                                </text>
                                {/* Legend */}
                                <circle cx='70' cy='245' r='5' fill='#06b6d4' />
                                <text
                                    x='82'
                                    y='249'
                                    fill='#94a3b8'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    Rider location (hsgtn4)
                                </text>
                                <circle cx='70' cy='265' r='5' fill='#10b981' />
                                <text
                                    x='82'
                                    y='269'
                                    fill='#94a3b8'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    Available drivers (hsgtn prefix)
                                </text>
                                <text
                                    x='300'
                                    y='249'
                                    fill='#475569'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    ~1.2km × 0.6km per cell
                                </text>
                                <text
                                    x='300'
                                    y='262'
                                    fill='#475569'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    6-char geohash = neighborhood
                                </text>
                            </svg>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'matching',
            subHeader: {
                index: '006',
                title: 'Driver Matching & Surge Pricing',
            },
            title: (
                <SectionTitle>
                    Driver কীভাবে Select করা হয়?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            শুধু কাছের driver খুঁজলেই হবে না — সেরা driver বেছে
                            নিতে হবে। Uber matching algorithm multiple factors
                            consider করে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Factor', 'Weight', 'কেন?'],
                    rows: [
                        [
                            'Distance to rider',
                            <span className='text-primary font-semibold'>
                                Most important
                            </span>,
                            'Faster pickup',
                        ],
                        ['Driver rating', 'High', 'Quality assurance'],
                        [
                            'Car type match',
                            <span className='text-red-700 dark:text-red-400 font-semibold'>
                                Critical
                            </span>,
                            'UberX vs UberXL',
                        ],
                        [
                            'Driver acceptance rate',
                            'Medium',
                            'Reliable drivers first',
                        ],
                        ['ETA accuracy', 'Medium', 'Historical performance'],
                    ],
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'matching_service.py',
                    code: `def match_driver(rider_request, nearby_drivers):
    def score_driver(driver):
        # Multi-factor scoring
        distance_score = 1.0 / (driver["distance_km"] + 0.1)
        rating_score = driver["rating"] / 5.0
        acceptance_score = driver["acceptance_rate"] / 100.0

        # Weighted final score
        return (
            distance_score   * 0.5 +  # 50% weight — distance most important
            rating_score     * 0.3 +  # 30% weight
            acceptance_score * 0.2    # 20% weight
        )

    # Car type filter করুন আগে
    compatible = [
        d for d in nearby_drivers
        if d["car_type"] == rider_request["ride_type"]
    ]

    if not compatible:
        raise NoDriverAvailable()

    # Best score = best match
    best_driver = max(compatible, key=score_driver)

    # Driver-কে request push করুন (WebSocket)
    websocket.push(best_driver["driver_id"], {
        "type": "RIDE_REQUEST",
        "rider": rider_request,
        "expires_in": 15  # 15 seconds to accept
    })
    return best_driver`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: '⚠️ Surge Pricing Formula',
                    content: (
                        <p>
                            Surge multiplier = f(demand / supply)। একটা geohash
                            cell-এ{' '}
                            <strong>open_requests / available_drivers</strong>।
                            Ratio বেশি = high surge। Dhaka rush hour-এ 2x-3x
                            surge হতে পারে।
                            <br />
                            <br />
                            Price বাড়লে: (ক) More drivers come → supply বাড়ে,
                            (খ) Some riders wait → demand কমে। Equilibrium
                            achieve হয়।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'realtime-tracking',
            subHeader: { index: '007', title: 'Real-Time Location Tracking' },
            title: (
                <SectionTitle>
                    WebSocket + Kafka — Real-time Communication
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Uber-এর core real-time infrastructure দুটো
                            technology-র উপর নির্ভর করে:{' '}
                            <strong className='text-foreground'>
                                WebSocket
                            </strong>{' '}
                            (bidirectional communication) এবং{' '}
                            <strong className='text-foreground'>
                                Apache Kafka
                            </strong>{' '}
                            (event streaming)।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='border border-border rounded-lg bg-card/30 p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                Real-Time Data Flow — Location Updates
                            </p>
                            <div className='flex flex-col gap-4'>
                                {/* Driver side */}
                                <div className='flex flex-wrap items-center gap-3'>
                                    <div className='px-4 py-3 border border-emerald-500 bg-card rounded text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold'>
                                        Driver App
                                    </div>
                                    <span className='text-muted-foreground font-mono text-xs'>
                                        WebSocket →
                                    </span>
                                    <div className='px-4 py-3 border border-emerald-500/50 bg-card rounded text-xs font-mono text-emerald-700 dark:text-emerald-400'>
                                        Location Service
                                    </div>
                                    <span className='text-muted-foreground font-mono text-xs'>
                                        Kafka →
                                    </span>
                                    <div className='px-4 py-3 border border-primary bg-card rounded text-xs font-mono text-primary font-bold'>
                                        Redis GEO
                                    </div>
                                    <span className='text-xs text-muted-foreground font-mono'>
                                        (GEOADD)
                                    </span>
                                </div>
                                <div className='h-px bg-border w-full' />
                                {/* Rider side */}
                                <div className='flex flex-wrap items-center gap-3'>
                                    <div className='px-4 py-3 border border-primary bg-card rounded text-xs font-mono text-primary font-bold'>
                                        Rider App
                                    </div>
                                    <span className='text-muted-foreground font-mono text-xs'>
                                        HTTP →
                                    </span>
                                    <div className='px-4 py-3 border border-purple-500/50 bg-card rounded text-xs font-mono text-purple-700 dark:text-purple-400'>
                                        Trip Service
                                    </div>
                                    <span className='text-muted-foreground font-mono text-xs'>
                                        → query →
                                    </span>
                                    <div className='px-4 py-3 border border-primary bg-card rounded text-xs font-mono text-primary'>
                                        Redis GEORADIUS
                                    </div>
                                    <span className='text-muted-foreground font-mono text-xs'>
                                        →
                                    </span>
                                    <div className='px-4 py-3 border border-orange-400/50 bg-card rounded text-xs font-mono text-orange-700 dark:text-orange-400'>
                                        Matching Service
                                    </div>
                                </div>
                                <div className='h-px bg-border w-full' />
                                {/* Notification side */}
                                <div className='flex flex-wrap items-center gap-3'>
                                    <div className='px-4 py-3 border border-orange-400/50 bg-card rounded text-xs font-mono text-orange-700 dark:text-orange-400'>
                                        Matching Service
                                    </div>
                                    <span className='text-muted-foreground font-mono text-xs'>
                                        WebSocket PUSH →
                                    </span>
                                    <div className='px-4 py-3 border border-emerald-500 bg-card rounded text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold'>
                                        Driver App
                                    </div>
                                    <span className='text-xs text-muted-foreground'>
                                        (15 sec to accept)
                                    </span>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 WebSocket কেন HTTP Polling নয়?',
                    content: (
                        <p>
                            HTTP Polling: Driver app প্রতি second check করলেন =
                            5M drivers × 1 req/sec ={' '}
                            <strong>5M unnecessary requests/sec</strong>।
                            <br />
                            <br />
                            WebSocket: Server যখন দরকার push করে। Driver app
                            persistent connection রাখে।{' '}
                            <strong>
                                Zero polling overhead, instant delivery
                            </strong>
                            ।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Kafka কোথায় ব্যবহার হয়?',
                    content: (
                        <p>
                            Location updates Kafka topic-এ publish হয়। Multiple
                            consumers: (১) Redis GEO update করে, (২) Analytics
                            pipeline-এ যায়, (৩) Surge pricing calculation
                            service listen করে।{' '}
                            <strong>
                                Decoupled, scalable, replay করা যায়
                            </strong>
                            ।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'database-scaling',
            subHeader: { index: '008', title: 'Database & Scaling' },
            title: (
                <SectionTitle>
                    কোন Data কোথায়? Scale করার উপায়
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Data', 'Database', 'Why?'],
                    rows: [
                        [
                            'Driver real-time location',
                            <span className='text-yellow-700 dark:text-yellow-400 font-semibold font-mono'>
                                Redis GEO
                            </span>,
                            'In-memory, GEO commands, fast update',
                        ],
                        [
                            'Trip data (active)',
                            <span className='font-mono text-muted-foreground'>
                                Redis / Cassandra
                            </span>,
                            'Hot data, fast access',
                        ],
                        [
                            'Trip history',
                            <span className='text-primary font-semibold font-mono'>
                                Cassandra
                            </span>,
                            'Time-series, append-only, massive scale',
                        ],
                        [
                            'User/Driver profiles',
                            <span className='font-mono text-muted-foreground'>
                                PostgreSQL
                            </span>,
                            'Structured, ACID',
                        ],
                        [
                            'Payments',
                            <span className='font-mono text-muted-foreground'>
                                PostgreSQL
                            </span>,
                            'Financial, ACID',
                        ],
                        [
                            'Maps/Routes',
                            <span className='font-mono text-muted-foreground'>
                                Google Maps API
                            </span>,
                            'External service',
                        ],
                        [
                            'Analytics/ML',
                            <span className='font-mono text-muted-foreground'>
                                Hadoop + Spark
                            </span>,
                            'Batch processing, model training',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-3 mt-4'>
                            <p className='font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4'>
                                Scaling Strategies
                            </p>
                            {[
                                {
                                    type: 'strategy',
                                    color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                                    label: 'Strategy',
                                    title: 'City-based Sharding',
                                    desc: 'Uber globally 63 countries-এ। প্রতিটা city আলাদাভাবে shard করুন। Dhaka-র requests Dhaka shard-এ যায়, London-এর London-এ। Cross-city matching needed না।',
                                },
                                {
                                    type: 'strategy',
                                    color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                                    label: 'Strategy',
                                    title: 'Redis GEO for Location',
                                    desc: '5M drivers × 1 update/4sec = 1.25M writes/sec। Redis in-memory, millisecond writes, GEO commands built-in। Perfect fit।',
                                },
                                {
                                    type: 'strategy',
                                    color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                                    label: 'Strategy',
                                    title: 'WebSocket for Real-time',
                                    desc: 'Driver app-এ persistent WebSocket connection। Ride request, matching notification, trip updates — সব push। Polling impractical।',
                                },
                                {
                                    type: 'tradeoff',
                                    color: 'text-red-700 dark:text-red-400 bg-red-500/10 border-red-500/20',
                                    label: 'Trade-off',
                                    title: 'ETA Accuracy',
                                    desc: 'Real-time traffic data + historical patterns। Google Maps API expensive at scale। Uber নিজেই map data build করেছেনে (Uber Movement)।',
                                },
                                {
                                    type: 'tradeoff',
                                    color: 'text-red-700 dark:text-red-400 bg-red-500/10 border-red-500/20',
                                    label: 'Trade-off',
                                    title: 'Driver Ghosting',
                                    desc: 'Driver accept করে তারপর না গেলে? Timeout + automatic reassign। Penalty system। Acceptance rate track করুন matching algorithm-এ।',
                                },
                            ].map((item, i) => (
                                <div key={i} className='flex gap-3 items-start'>
                                    <span
                                        className={`font-mono text-xs px-2 py-1 border rounded flex-shrink-0 ${item.color}`}>
                                        {item.label}
                                    </span>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        <strong className='text-foreground'>
                                            {item.title}:
                                        </strong>{' '}
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '🎯 Interview Tips — Uber System Design',
                    content: (
                        <div className='space-y-2'>
                            <p>
                                <strong>1)</strong> সবার আগে বলুন:{' '}
                                <strong>
                                    &quot;This is a geospatial problem&quot;
                                </strong>{' '}
                                — interviewer impress হবে।
                            </p>
                            <p>
                                <strong>2)</strong> Redis GEO এর GEOADD এবং
                                GEORADIUS command mention করুন।
                            </p>
                            <p>
                                <strong>3)</strong> City-based sharding
                                naturally আসে — explain করুন কেন cross-city data
                                join দরকার নেই।
                            </p>
                            <p>
                                <strong>4)</strong> Driver ghosting problem এবং
                                solution mention করলেন senior-level knowledge
                                দেখা যায়।
                            </p>
                            <p>
                                <strong>5)</strong> Surge pricing formula
                                (demand/supply ratio) confidently explain করুন।
                            </p>
                        </div>
                    ),
                },
            ],
        },
    ],
    summary: {
        headers: [
            'Geospatial Approach',
            'কীভাবে কাজ করে',
            'Uber Use Case',
            'Pros',
            'Cons',
        ],
        rows: [
            [
                <span className='font-bold text-primary font-mono'>
                    Geohash
                </span>,
                'lat/lng → string encode। Prefix = proximity',
                <span className='text-primary'>
                    6-char ≈ 1.2km cell। Prefix query করুন।
                </span>,
                'Simple, string DB query, Redis built-in',
                'Boundary problem — edge cases',
            ],
            [
                <span className='font-bold text-primary font-mono'>
                    QuadTree
                </span>,
                'Map → 4 quadrants recursively। Dense = deeper।',
                'Alternative to Geohash। Tree traverse।',
                'Adaptive density, dynamic split',
                'Complex implementation, rebalancing',
            ],
            [
                <span className='font-bold text-primary font-mono'>
                    S2 Cells (Google)
                </span>,
                'Sphere → 2D projection → hierarchical cells',
                'Used by Google Maps, ridesharing',
                'Uniform coverage, great for global',
                'Complex math, library dependency',
            ],
            [
                <span className='font-bold text-emerald-700 dark:text-emerald-400 font-mono'>
                    H3 (Uber custom)
                </span>,
                'Hexagonal grid। Equal area hexagons।',
                <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>
                    Uber-এর actual system। Surge pricing।
                </span>,
                'Uniform neighbor distance, no corner distortion',
                'Uber-specific, learning curve',
            ],
            [
                <span className='font-bold text-primary font-mono'>
                    Redis GEO
                </span>,
                'Geohash internally। GEOADD/GEORADIUS commands।',
                <span className='text-primary'>
                    1.25M writes/sec। In-memory। Production use।
                </span>,
                'Built-in commands, millisecond latency',
                'Memory cost, single node limit',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'Driver location update কোথায় store করবেন?',
                options: [
                    {
                        key: 'a',
                        text: 'MySQL',
                        isCorrect: false,
                        explanation:
                            'MySQL disk-based। 1.25M writes/sec handle করতে পারবেন না।',
                    },
                    {
                        key: 'b',
                        text: 'Cassandra',
                        isCorrect: false,
                        explanation:
                            'Cassandra trip history-র জন্য ভালো, কিন্তু real-time location-এর জন্য Redis GEO better।',
                    },
                    {
                        key: 'c',
                        text: 'Redis GEO (in-memory)',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Redis GEO in-memory, millisecond writes, built-in geospatial commands (GEOADD, GEORADIUS)। 1.25M updates/sec হ্যান্ডেল করতে পারে। MySQL/Cassandra disk-based — এই throughput handle করবেন না।',
                    },
                    {
                        key: 'd',
                        text: 'S3',
                        isCorrect: false,
                        explanation:
                            'S3 object storage — real-time location updates-এর জন্য সম্পূর্ণ অনুপযুক্ত।',
                    },
                ],
            },
            {
                id: 2,
                text: 'Geohash কী কাজ করে?',
                options: [
                    {
                        key: 'a',
                        text: 'GPS signal encrypt করে',
                        isCorrect: false,
                        explanation:
                            'Geohash encryption নয় — location encoding।',
                    },
                    {
                        key: 'b',
                        text: 'lat/lng কে একটা string-এ encode করে, nearby locations-এ similar prefix থাকে',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Geohash = location string। "hsgtn4" = Dhaka-র একটা cell। String prefix = proximity। "hsgtn" prefix match = same neighborhood। Database string prefix query করলেন nearby locations পানয়া যায়।',
                    },
                    {
                        key: 'c',
                        text: 'Maps download করে',
                        isCorrect: false,
                        explanation: 'Geohash map download করে না।',
                    },
                    {
                        key: 'd',
                        text: 'Driver identity verify করে',
                        isCorrect: false,
                        explanation: 'Geohash identity verification নয়।',
                    },
                ],
            },
            {
                id: 3,
                text: 'Surge pricing কীভাবে calculate করবেন?',
                options: [
                    {
                        key: 'a',
                        text: 'একটা area-তে demand/supply ratio — বেশি হলে বেশি surge',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Surge = f(open requests / available drivers) in a geohash cell। Ratio বাড়লে surge বাড়ে। Higher price → more drivers come (supply ↑), some riders wait (demand ↓) → natural equilibrium। Real-time streaming analytics দিয়ে calculate হয়।',
                    },
                    {
                        key: 'b',
                        text: 'Random multiplier',
                        isCorrect: false,
                        explanation:
                            'Surge pricing random নয় — mathematical formula।',
                    },
                    {
                        key: 'c',
                        text: 'Time of day based (fixed)',
                        isCorrect: false,
                        explanation:
                            'Fixed time-based নয় — dynamic supply/demand based।',
                    },
                    {
                        key: 'd',
                        text: 'Weather condition',
                        isCorrect: false,
                        explanation:
                            'Weather একটা factor হতে পারে কিন্তু primary formula supply/demand ratio।',
                    },
                ],
            },
            {
                id: 4,
                text: 'Uber globally scale করতে কোন sharding strategy best?',
                options: [
                    {
                        key: 'a',
                        text: 'User ID দিয়ে shard',
                        isCorrect: false,
                        explanation:
                            'User ID sharding ride sharing-এ sense করে না — geographically nearby drivers দরকার।',
                    },
                    {
                        key: 'b',
                        text: 'Alphabetically shard',
                        isCorrect: false,
                        explanation:
                            'Alphabetical sharding geospatial problem-এ অকার্যকর।',
                    },
                    {
                        key: 'c',
                        text: 'Random shard',
                        isCorrect: false,
                        explanation:
                            'Random sharding-এ nearby drivers একই shard-এ থাকবেন না।',
                    },
                    {
                        key: 'd',
                        text: 'City/Region দিয়ে shard',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Ride sharing = local problem। Dhaka-র rider Dhaka-র driver ছাড়া অন্য city-র driver চাই না। City-based sharding natural। Cross-city data join needed না। Dhaka cluster, Chittagong cluster — independently scale করা যায়।',
                    },
                ],
            },
            {
                id: 5,
                text: 'Driver app-এ real-time ride request notification কোন protocol?',
                options: [
                    {
                        key: 'a',
                        text: 'HTTP polling প্রতি second',
                        isCorrect: false,
                        explanation:
                            '5M drivers × 1 req/sec = 5M unnecessary requests/sec। Impractical।',
                    },
                    {
                        key: 'b',
                        text: 'WebSocket (persistent bidirectional)',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Driver app persistent WebSocket connection রাখে। Server যেকোনো সময় push করতে পারে — new ride request, updates। 15 second timeout-এ server decision নিতে পারে। Polling impractical।',
                    },
                    {
                        key: 'c',
                        text: 'SMS',
                        isCorrect: false,
                        explanation:
                            'SMS latency অনেক বেশি — ride matching-এ impractical।',
                    },
                    {
                        key: 'd',
                        text: 'Email',
                        isCorrect: false,
                        explanation:
                            'Email real-time notification-এর জন্য অনুপযুক্ত।',
                    },
                ],
            },
            {
                id: 6,
                text: 'Trip history (completed rides) কোন database-এ রাখবে?',
                options: [
                    {
                        key: 'a',
                        text: 'Redis',
                        isCorrect: false,
                        explanation:
                            'Redis in-memory — পুরনো trip history-র জন্য persistent storage দরকার।',
                    },
                    {
                        key: 'b',
                        text: 'MySQL',
                        isCorrect: false,
                        explanation:
                            'MySQL single node-এ 14M trips/day write handle করবেন না।',
                    },
                    {
                        key: 'c',
                        text: 'Cassandra',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Trip history = time-series, append-only। Driver_id দিয়ে partition, trip_time দিয়ে cluster। 14M trips/day = massive write volume। Cassandra horizontally scale করে, time-range queries efficient।',
                    },
                    {
                        key: 'd',
                        text: 'Elasticsearch',
                        isCorrect: false,
                        explanation:
                            'Elasticsearch search-এর জন্য ভালো কিন্তু primary trip storage-এর জন্য Cassandra better।',
                    },
                ],
            },
            {
                id: 7,
                text: 'Redis GEORADIUS command কী করে?',
                options: [
                    {
                        key: 'a',
                        text: 'একটা center point থেকে নির্দিষ্ট radius-এর মধ্যে সব locations return করে',
                        isCorrect: true,
                        explanation:
                            'সঠিক। GEORADIUS key longitude latitude radius unit। Redis internally geohash use করে locations store করে। Radius query milliseconds-এ। Distance, coordinates সহ return করতে পারে। Uber-এর find_nearby_drivers exactly এটা use করে।',
                    },
                    {
                        key: 'b',
                        text: 'Two points-এর মধ্যে route calculate করে',
                        isCorrect: false,
                        explanation:
                            'GEORADIUS route calculate করে না — nearby points খোঁজে।',
                    },
                    {
                        key: 'c',
                        text: 'Location encrypt করে',
                        isCorrect: false,
                        explanation: 'GEORADIUS encryption command নয়।',
                    },
                    {
                        key: 'd',
                        text: 'Map render করে',
                        isCorrect: false,
                        explanation: 'Redis map render করে না।',
                    },
                ],
            },
            {
                id: 8,
                text: 'Geohash precision level 6 (6 characters) কতটুকু area?',
                options: [
                    {
                        key: 'a',
                        text: '1 cm × 1 cm',
                        isCorrect: false,
                        explanation:
                            '12-char geohash ≈ 3.7cm। 6-char অনেক বড়।',
                    },
                    {
                        key: 'b',
                        text: '40 km × 20 km',
                        isCorrect: false,
                        explanation:
                            '40 × 20 km = 4-char geohash (city level)।',
                    },
                    {
                        key: 'c',
                        text: '38 m × 19 m',
                        isCorrect: false,
                        explanation:
                            '38 × 19 meters = 8-char geohash (street level)।',
                    },
                    {
                        key: 'd',
                        text: '~1.2 km × 0.6 km (Neighborhood level)',
                        isCorrect: true,
                        explanation:
                            'সঠিক। 6-character geohash ≈ 1.2km × 0.6km। Uber neighborhood/zone level-এর জন্য perfect। এই size-এ একটা cell-এ multiple drivers থাকবেন। Too small = too many cells। Too large = too many irrelevant drivers। 6 characters = sweet spot।',
                    },
                ],
            },
            {
                id: 9,
                text: 'Driver accept না করলেন (timeout) কী হবে?',
                options: [
                    {
                        key: 'a',
                        text: 'Rider-কে error দিন',
                        isCorrect: false,
                        explanation:
                            'Rider experience নষ্ট হবে। Uber এটা করে না — automatically retry।',
                    },
                    {
                        key: 'b',
                        text: '15 sec timeout → automatically next best driver-কে try',
                        isCorrect: true,
                        explanation:
                            'সঠিক। 15 second window। Accept না করলেন → mark as "skipped" → next driver in the ranking। Multiple drivers serially try করুন। Driver acceptance rate track করুন — low acceptance = lower priority in future matching।',
                    },
                    {
                        key: 'c',
                        text: 'Same driver-কে infinite retry',
                        isCorrect: false,
                        explanation:
                            'Infinite retry করলেন rider অনেকক্ষণ wait করবেন।',
                    },
                    {
                        key: 'd',
                        text: 'Rider-কে refund দিন',
                        isCorrect: false,
                        explanation:
                            'Refund দেওয়ার কিছু নেই — ride এখনো শুরু হয়নি।',
                    },
                ],
            },
            {
                id: 10,
                text: 'Uber-এর H3 hexagonal grid standard Geohash থেকে কোন সুবিধা দেয়?',
                options: [
                    {
                        key: 'a',
                        text: 'More colorful',
                        isCorrect: false,
                        explanation: 'Color technical advantage নয়।',
                    },
                    {
                        key: 'b',
                        text: 'Faster encoding',
                        isCorrect: false,
                        explanation:
                            'H3-এর primary advantage encoding speed নয়।',
                    },
                    {
                        key: 'c',
                        text: 'Equal area hexagons — edge distortion কম, neighbor distance uniform',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Standard Geohash rectangular cells — polar region-এ distortion বেশি। H3 hexagonal: প্রতিটা cell equal area। Hexagon-এর সব 6 neighbors সমান distance। Surge pricing, driver distribution analysis-এ uniform analysis possible।',
                    },
                    {
                        key: 'd',
                        text: 'Works without GPS',
                        isCorrect: false,
                        explanation: 'H3 hexagonal grid GPS ছাড়া কাজ করে না।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'Ride Sharing System ডিজাইন করুন',
        time: '৪-৫ ঘন্টা',
        difficulty: 'Advanced',
        tasks: [
            <span>
                <strong>Architecture Diagram:</strong> Uber-এর complete system
                diagram আঁকুন। Driver location update flow (Driver → Location
                Service → Redis GEO), Rider request flow (Rider → Trip Service →
                Geospatial Index → Matching Service → Driver WebSocket), Payment
                flow আলাদা দেখাও।
            </span>,
            <span>
                <strong>Geohash Hands-on:</strong> Online Geohash tool
                (geohash.org) use করে: (ক) আপনার বাসার location-এর 6-character
                geohash বের করুন, (খ) 1 km দূরের একটা location-এর geohash কতটুকু
                same? (গ) Precision 4 vs 6 vs 8 — area size compare করুন।
            </span>,
            <span>
                <strong>Matching Algorithm:</strong> নিচের 3 জন driver-এর মধ্যে
                কাকে select করবেন? Rider location থেকে: Driver A: 0.5km, rating
                4.2, acceptance 90%; Driver B: 1.2km, rating 4.8, acceptance
                95%; Driver C: 0.8km, rating 4.5, acceptance 70%। আমার scoring
                formula দিয়ে calculate করুন।
            </span>,
            <span>
                <strong>Surge Pricing Calculation:</strong> একটা geohash cell-এ:
                15 open requests, 3 available drivers। Surge multiplier কত হবে?
                উপায়: ratio = 15/3 = 5। Surge formula design করুন (min surge
                1.0x, max 4.0x)।
            </span>,
            <span>
                <strong>Phase 4 System Comparison:</strong> সব 7টা system-এর
                জন্য একটা comparison table বানান। Columns: System Name, Core
                Challenge, Key Database, Key Algorithm/Pattern, Unique Insight।
            </span>,
        ],
        deliverables: [
            <span>Uber architecture diagram + flow diagrams</span>,
            <span>Geohash hands-on results (3 precision levels)</span>,
            <span>Driver scoring calculation + winner explanation</span>,
            <span>Surge pricing formula + example calculation</span>,
        ],
    },
    practicalLab: {
        title: 'Uber Location Tracking Service',
        subtitle: 'Geohash + WebSocket + Redis',
        steps: [
            {
                title: 'Redis GEO Setup করুন',
                description:
                    'Redis install করুন। Python redis-py library দিয়ে GEOADD এবং GEORADIUS commands test করুন। 5টা mock driver location add করুন।',
            },
            {
                title: 'Driver Location Update Service বানান',
                description:
                    'FastAPI endpoint: POST /driver/{id}/location। Body: lat, lng। Redis-এ GEOADD করুন। Driver status hash update করুন।',
            },
            {
                title: 'Nearby Drivers Search বানান',
                description:
                    'GET /drivers/nearby?lat=23.8&lng=90.4&radius=5। GEORADIUS query করুন। Distance সহ sorted list return করুন।',
            },
            {
                title: 'Matching Algorithm Implement করুন',
                description:
                    'Nearby drivers list থেকে score_driver() function লিখুন। Distance 50%, rating 30%, acceptance_rate 20%। Best score = winner।',
            },
            {
                title: 'WebSocket Notification Test করুন',
                description:
                    'FastAPI WebSocket endpoint বানান। Driver connection maintain করুন। Match হলে WebSocket push করুন। 15 second timeout implement করুন।',
            },
        ],
        codeBlock: {
            language: 'python',
            filename: 'uber_location_service.py',
            code: `import redis
from fastapi import FastAPI, WebSocket
from typing import Optional
import asyncio, json, time

app = FastAPI()
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

# Active WebSocket connections: driver_id -> WebSocket
driver_connections: dict = {}

# ============================================================
# 1. Driver Location Update (প্রতি 4 sec driver এটা call করে)
# ============================================================
@app.post("/driver/{driver_id}/location")
async def update_location(driver_id: str, lat: float, lng: float):
    # Redis GEO store: longitude first!
    r.geoadd("drivers:active", {driver_id: (lng, lat)})

    # Driver metadata update
    r.hset(f"driver:{driver_id}", mapping={
        "lat": str(lat),
        "lng": str(lng),
        "status": "available",
        "updated_at": str(time.time()),
        "rating": "4.5",           # In production: from DB
        "acceptance_rate": "90",   # In production: from DB
        "car_type": "uberx"
    })

    # Mark as "active" — expire after 30 sec (stale driver cleanup)
    r.expire(f"driver:{driver_id}", 30)

    return {"status": "ok", "geohash": get_geohash(lat, lng)}


# ============================================================
# 2. Find Nearby Drivers (Rider request করলেন)
# ============================================================
@app.get("/drivers/nearby")
async def find_nearby(lat: float, lng: float, radius_km: float = 5.0):
    # GEORADIUS: (lng, lat) order! Sorted by distance ASC
    nearby = r.georadius(
        "drivers:active",
        lng, lat,
        radius_km,
        unit='km',
        withcoord=True,
        withdist=True,
        sort='ASC',
        count=10
    )

    drivers = []
    for driver_id, distance, (d_lng, d_lat) in nearby:
        meta = r.hgetall(f"driver:{driver_id}")
        if meta.get("status") == "available":
            drivers.append({
                "driver_id": driver_id,
                "distance_km": round(float(distance), 2),
                "lat": float(d_lat),
                "lng": float(d_lng),
                "rating": float(meta.get("rating", "4.0")),
                "acceptance_rate": float(meta.get("acceptance_rate", "80")),
                "car_type": meta.get("car_type", "uberx")
            })

    return {"nearby_drivers": drivers, "count": len(drivers)}


# ============================================================
# 3. Matching Algorithm (Best driver select করুন)
# ============================================================
def score_driver(driver: dict) -> float:
    """Multi-factor scoring: Distance 50%, Rating 30%, Acceptance 20%"""
    distance_score = 1.0 / (driver["distance_km"] + 0.1)  # Closer = higher
    rating_score = driver["rating"] / 5.0
    acceptance_score = driver["acceptance_rate"] / 100.0

    return (distance_score * 0.5 + rating_score * 0.3 + acceptance_score * 0.2)


@app.post("/match")
async def match_driver(rider_lat: float, rider_lng: float, ride_type: str = "uberx"):
    # Step 1: Find nearby drivers
    nearby_response = await find_nearby(rider_lat, rider_lng, radius_km=5.0)
    nearby = nearby_response["nearby_drivers"]

    # Step 2: Filter by car type
    compatible = [d for d in nearby if d["car_type"] == ride_type]

    if not compatible:
        return {"status": "no_driver", "message": "No available drivers nearby"}

    # Step 3: Score and pick best
    best_driver = max(compatible, key=score_driver)

    # Step 4: Push notification via WebSocket
    await notify_driver(best_driver["driver_id"], {
        "type": "RIDE_REQUEST",
        "rider_lat": rider_lat,
        "rider_lng": rider_lng,
        "expires_in": 15
    })

    return {
        "status": "matching",
        "driver_id": best_driver["driver_id"],
        "eta_minutes": round(best_driver["distance_km"] / 0.5),  # ~30 km/h
        "score": round(score_driver(best_driver), 3)
    }


# ============================================================
# 4. WebSocket — Driver connection maintain
# ============================================================
@app.websocket("/ws/driver/{driver_id}")
async def driver_websocket(websocket: WebSocket, driver_id: str):
    await websocket.accept()
    driver_connections[driver_id] = websocket
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            if msg.get("type") == "LOCATION_UPDATE":
                await update_location(driver_id, msg["lat"], msg["lng"])
    except Exception:
        driver_connections.pop(driver_id, None)


async def notify_driver(driver_id: str, message: dict):
    ws = driver_connections.get(driver_id)
    if ws:
        await ws.send_text(json.dumps(message))


# Utility: Simple geohash (conceptual)
def get_geohash(lat: float, lng: float, precision: int = 6) -> str:
    """Returns ~6 char geohash for the location"""
    try:
        import geohash2
        return geohash2.encode(lat, lng, precision)
    except ImportError:
        return f"gh_{lat:.3f}_{lng:.3f}"`,
        },
        tip: 'Redis-এর GEORADIUS command হলো Uber-এর "find nearby drivers"-এর backbone। একবার এটা practically test করলেন Geohash theory আর confusing লাগবে না। Live demo-তে দেখবেন 5M drivers simulation করলেনও Redis milliseconds-এ respond করে।',
    },
    phaseComplete: {
        title: '🎉 Phase 4 সম্পন্ন! Real-World Systems Mastered',
        description:
            'আপনি ৭টি বড় real-world system design সম্পন্ন করেছেনো। এগুলো সবচেয়ে popular interview questions।',
        topics: [
            { title: 'URL Shortener (TinyURL)', id: 'tinyurl' },
            { title: 'Design Twitter/X', id: 'twitter' },
            { title: 'Design YouTube/Netflix', id: 'youtube' },
            { title: 'Design WhatsApp', id: 'whatsapp' },
            { title: 'Design Amazon', id: 'amazon' },
            { title: 'Search Engine & Typeahead', id: 'search-engine' },
            { title: 'Design Uber/Ride Sharing', id: 'uber' },
        ],
        nextPhase: {
            title: 'Phase 5: Advanced Topics',
            topics: [
                'Security in System Design',
                'Observability & Monitoring',
                'CI/CD & DevOps',
                'Cost Optimization',
                'Multi-Region Architecture',
                'Performance Engineering',
            ],
        },
    },
};

