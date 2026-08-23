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

export const youtubeContent: TopicData = {
    id: 'youtube',
    sections: [
        {
            id: 'why-complex',
            subHeader: { index: '001', title: 'Why This System' },
            title: (
                <SectionTitle>
                    Video Streaming কেন আলাদা?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-4'>
                            <ContentParagraph>
                                YouTube প্রতি মিনিটে{' '}
                                <strong className='text-foreground'>
                                    500 ঘণ্টার video upload
                                </strong>{' '}
                                হয়। Netflix-এর internet traffic-এর ১৫% শুধু
                                Netflix-এর। এই দুটো system-এ সবচেয়ে বড় challenge
                                হলো{' '}
                                <strong className='text-foreground'>
                                    video storage, processing, এবং delivery
                                </strong>{' '}
                                — এটা regular web app থেকে সম্পূর্ণ আলাদা।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '📌 Key Insight',
                    content: (
                        <p>
                            Video streaming ={' '}
                            <strong>massive storage</strong> +{' '}
                            <strong>video transcoding</strong> +{' '}
                            <strong>adaptive bitrate streaming</strong> +{' '}
                            <strong>global CDN</strong>। একটা 1-hour video কে
                            10+ different formats/qualities-এ encode করতে হয়।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
                            <div className='bg-muted/30 border border-border rounded-lg p-5'>
                                <p className='text-xs font-mono uppercase tracking-widest text-primary mb-3 font-bold'>
                                    📤 Upload Challenge
                                </p>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Creator uploads → raw storage → Kafka
                                    trigger → transcoding workers → multiple
                                    quality versions → CDN এ push।
                                </p>
                            </div>
                            <div className='bg-muted/30 border border-border rounded-lg p-5'>
                                <p className='text-xs font-mono uppercase tracking-widest text-primary mb-3 font-bold'>
                                    ▶️ Stream Challenge
                                </p>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    Viewer requests → API gets CDN URL →
                                    Viewer directly streams from nearest CDN
                                    edge node। API server video bits transmit
                                    করে না।
                                </p>
                            </div>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'requirements',
            subHeader: { index: '002', title: 'Requirements' },
            title: (
                <SectionTitle>Features কী কী?</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='bg-muted/30 border border-border rounded-lg p-5'>
                                <p className='text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-4 font-bold'>
                                    ✅ Functional Requirements
                                </p>
                                <ul className='space-y-2'>
                                    {[
                                        'Video upload করা',
                                        'Video stream করা (watch)',
                                        'Video search করা',
                                        'Like, comment, subscribe',
                                        'Video recommendations',
                                        'Resume from where left off',
                                        'Multiple quality (360p/720p/1080p/4K)',
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className='flex items-start gap-2 text-sm text-muted-foreground border-b border-border pb-2 last:border-0 last:pb-0'>
                                            <span className='text-muted-foreground mt-0.5 text-xs'>
                                                →
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className='bg-muted/30 border border-border rounded-lg p-5'>
                                <p className='text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-4 font-bold'>
                                    ⚡ Non-Functional Requirements
                                </p>
                                <ul className='space-y-2'>
                                    {[
                                        '2 billion+ monthly active users',
                                        'Video starts in < 2 seconds',
                                        'No buffering (smooth playback)',
                                        '99.9% availability',
                                        'Uploaded video available within 1 min',
                                        'Support any device (mobile/TV/web)',
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className='flex items-start gap-2 text-sm text-muted-foreground border-b border-border pb-2 last:border-0 last:pb-0'>
                                            <span className='text-muted-foreground mt-0.5 text-xs'>
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
            subHeader: { index: '003', title: 'Back-of-Envelope Estimation' },
            title: (
                <SectionTitle>YouTube-এর Numbers</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-3 mt-2'>
                            {[
                                { num: '500hrs', label: 'Video uploaded/min' },
                                { num: '2B', label: 'Monthly Active Users' },
                                { num: '1B hrs', label: 'Watched daily' },
                                {
                                    num: '10x',
                                    label: 'Storage multiplier (transcoding)',
                                },
                                {
                                    num: '~500MB',
                                    label: 'Per minute video (1080p)',
                                },
                                { num: '1 EB+', label: 'Total video storage' },
                            ].map((card, i) => (
                                <div
                                    key={i}
                                    className='bg-muted/30 border border-border rounded-lg p-4 text-center'>
                                    <span className='font-mono text-2xl font-bold text-primary block mb-1'>
                                        {card.num}
                                    </span>
                                    <span className='font-mono text-[10px] uppercase tracking-wide text-muted-foreground'>
                                        {card.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '🔢 Storage Calculation',
                    content: (
                        <p>
                            500 hrs/min × 60 min = 30,000 hrs/hr upload।
                            প্রতি ঘণ্টা video ≈ 1GB (compressed) × 10
                            formats = 10GB/hr of video। Daily: 30,000 × 24
                            × 10GB ={' '}
                            <strong>7.2 petabytes/day!</strong> এই scale-এ
                            dedicated storage infrastructure দরকার।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'architecture',
            subHeader: { index: '004', title: 'High Level Architecture' },
            title: (
                <SectionTitle>
                    YouTube-এর Two Flows
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            YouTube-এ দুটো completely আলাদা path:{' '}
                            <strong className='text-foreground'>
                                Upload path
                            </strong>{' '}
                            এবং{' '}
                            <strong className='text-foreground'>
                                Stream path
                            </strong>
                            ।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 text-center'>
                                YouTube Architecture — Upload &amp; Stream
                                Flows
                            </p>
                            <svg
                                width='700'
                                height='360'
                                viewBox='0 0 700 360'
                                className='max-w-full'>
                                <defs>
                                    <marker
                                        id='arr-yt'
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
                                        id='arrR-yt'
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
                                        id='arrG-yt'
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

                                {/* UPLOAD FLOW label */}
                                <text
                                    x='10'
                                    y='20'
                                    fill='#ef4444'
                                    fontFamily='monospace'
                                    fontSize='10'
                                    fontWeight='700'>
                                    ── UPLOAD FLOW ──
                                </text>

                                {/* Creator */}
                                <rect
                                    x='10'
                                    y='35'
                                    width='70'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#1e2d4a'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='45'
                                    y='53'
                                    textAnchor='middle'
                                    fill='#94a3b8'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    CREATOR
                                </text>
                                <text
                                    x='45'
                                    y='66'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Uploads
                                </text>

                                <path
                                    d='M 80 55 L 120 55'
                                    stroke='#ef4444'
                                    strokeWidth='1.5'
                                    markerEnd='url(#arrR-yt)'
                                />

                                {/* Upload API */}
                                <rect
                                    x='120'
                                    y='35'
                                    width='90'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#ef4444'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='165'
                                    y='53'
                                    textAnchor='middle'
                                    fill='#ef4444'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    UPLOAD
                                </text>
                                <text
                                    x='165'
                                    y='66'
                                    textAnchor='middle'
                                    fill='#ef4444'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    SERVICE
                                </text>

                                <path
                                    d='M 210 55 L 250 55'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr-yt)'
                                />

                                {/* Raw Storage */}
                                <rect
                                    x='250'
                                    y='35'
                                    width='90'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#eab308'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='295'
                                    y='53'
                                    textAnchor='middle'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    RAW
                                </text>
                                <text
                                    x='295'
                                    y='66'
                                    textAnchor='middle'
                                    fill='#eab308'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    BLOB STORE
                                </text>

                                <path
                                    d='M 340 55 L 380 55'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr-yt)'
                                />

                                {/* Kafka */}
                                <rect
                                    x='380'
                                    y='35'
                                    width='80'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#8b5cf6'
                                    strokeWidth='1.2'
                                />
                                <text
                                    x='420'
                                    y='53'
                                    textAnchor='middle'
                                    fill='#8b5cf6'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    KAFKA
                                </text>
                                <text
                                    x='420'
                                    y='66'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Queue
                                </text>

                                <path
                                    d='M 460 55 L 500 55'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr-yt)'
                                />

                                {/* Transcoding Workers */}
                                <rect
                                    x='500'
                                    y='25'
                                    width='100'
                                    height='60'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#f97316'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='550'
                                    y='48'
                                    textAnchor='middle'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    TRANSCODING
                                </text>
                                <text
                                    x='550'
                                    y='61'
                                    textAnchor='middle'
                                    fill='#f97316'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    WORKERS
                                </text>
                                <text
                                    x='550'
                                    y='74'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    360p/720p/1080p/4K
                                </text>

                                <path
                                    d='M 550 85 L 550 115'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr-yt)'
                                />

                                {/* Processed Storage */}
                                <rect
                                    x='500'
                                    y='115'
                                    width='100'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='550'
                                    y='133'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    PROCESSED
                                </text>
                                <text
                                    x='550'
                                    y='146'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    S3 Storage
                                </text>

                                <path
                                    d='M 550 155 L 550 185'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr-yt)'
                                />

                                {/* CDN */}
                                <rect
                                    x='460'
                                    y='185'
                                    width='180'
                                    height='50'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#1d9bf0'
                                    strokeWidth='2'
                                />
                                <text
                                    x='550'
                                    y='206'
                                    textAnchor='middle'
                                    fill='#1d9bf0'
                                    fontFamily='monospace'
                                    fontSize='10'
                                    fontWeight='700'>
                                    GLOBAL CDN
                                </text>
                                <text
                                    x='550'
                                    y='222'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    CloudFront / Akamai (150+ Edge Locations)
                                </text>

                                {/* STREAM FLOW label */}
                                <text
                                    x='10'
                                    y='275'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='10'
                                    fontWeight='700'>
                                    ── STREAM FLOW ──
                                </text>

                                {/* Viewer */}
                                <rect
                                    x='10'
                                    y='290'
                                    width='70'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#1e2d4a'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='45'
                                    y='308'
                                    textAnchor='middle'
                                    fill='#94a3b8'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    VIEWER
                                </text>
                                <text
                                    x='45'
                                    y='321'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Watches
                                </text>

                                <path
                                    d='M 80 310 L 120 310'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                    markerEnd='url(#arrG-yt)'
                                />

                                {/* API Server */}
                                <rect
                                    x='120'
                                    y='290'
                                    width='90'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='165'
                                    y='308'
                                    textAnchor='middle'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    API SERVER
                                </text>
                                <text
                                    x='165'
                                    y='321'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Get CDN URL
                                </text>

                                <path
                                    d='M 210 310 L 250 310'
                                    stroke='#64748b'
                                    strokeWidth='1.2'
                                    markerEnd='url(#arr-yt)'
                                />

                                {/* Metadata DB */}
                                <rect
                                    x='250'
                                    y='290'
                                    width='100'
                                    height='40'
                                    rx='4'
                                    fill='#1a1915'
                                    stroke='#cc6b45'
                                    strokeWidth='1.5'
                                />
                                <text
                                    x='300'
                                    y='308'
                                    textAnchor='middle'
                                    fill='#cc6b45'
                                    fontFamily='monospace'
                                    fontSize='9'>
                                    METADATA
                                </text>
                                <text
                                    x='300'
                                    y='321'
                                    textAnchor='middle'
                                    fill='#64748b'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    MySQL + Redis
                                </text>

                                {/* Direct CDN stream arrow */}
                                <path
                                    d='M 80 320 L 460 220'
                                    stroke='#10b981'
                                    strokeWidth='1.5'
                                    strokeDasharray='5,3'
                                    markerEnd='url(#arrG-yt)'
                                />
                                <text
                                    x='270'
                                    y='285'
                                    fill='#10b981'
                                    fontFamily='monospace'
                                    fontSize='8'>
                                    Direct CDN stream
                                </text>
                            </svg>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'video-pipeline',
            subHeader: { index: '005', title: 'Deep Dive' },
            title: (
                <SectionTitle>
                    Video Processing Pipeline
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-4'>
                            <h3 className='text-lg font-bold text-foreground'>
                                🎬 Transcoding — সবচেয়ে গুরুত্বপূর্ণ Step
                            </h3>
                            <p className='text-muted-foreground leading-relaxed'>
                                একটা raw video upload হলে সেটাকে অনেকগুলো
                                format-এ convert করতে হয়। এটাকে{' '}
                                <strong className='text-foreground'>
                                    transcoding
                                </strong>{' '}
                                বলে।
                            </p>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: [
                        'Output Format',
                        'Resolution',
                        'Bitrate',
                        'Use Case',
                    ],
                    rows: [
                        ['360p', '640×360', '~400 Kbps', 'Slow mobile/2G'],
                        ['480p', '854×480', '~700 Kbps', 'Mobile 3G'],
                        [
                            '720p HD',
                            '1280×720',
                            '~2.5 Mbps',
                            'Normal streaming',
                        ],
                        [
                            '1080p FHD',
                            '1920×1080',
                            '~5 Mbps',
                            'Good connection',
                        ],
                        [
                            '4K UHD',
                            '3840×2160',
                            '~20 Mbps',
                            'Netflix/Fast internet',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Adaptive Bitrate Streaming (ABR)',
                    content: (
                        <p>
                            Player automatically quality switch করে network
                            speed অনুযায়ী। Netflix/YouTube{' '}
                            <strong>HLS (HTTP Live Streaming)</strong> বা{' '}
                            <strong>DASH</strong> protocol use করে। Video
                            small chunks (2-10 sec) এ ভাগ হয়। Slow network
                            → 360p, Fast → 1080p auto switch।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'transcoding_worker.py',
                    code: `import subprocess
import boto3

def transcode_video(raw_video_path: str, video_id: str):
    qualities = [
        {"name": "360p",  "width": 640,  "height": 360,  "bitrate": "400k"},
        {"name": "720p",  "width": 1280, "height": 720,  "bitrate": "2500k"},
        {"name": "1080p", "width": 1920, "height": 1080, "bitrate": "5000k"},
    ]
    s3 = boto3.client('s3')
    output_files = []

    for q in qualities:
        output_path = f"/tmp/{video_id}_{q['name']}.mp4"
        # FFmpeg দিয়ে transcode করুন
        subprocess.run([
            "ffmpeg", "-i", raw_video_path,
            "-vf", f"scale={q['width']}:{q['height']}",
            "-b:v", q['bitrate'],
            "-c:v", "libx264", "-c:a", "aac",
            output_path
        ])
        # S3-এ upload করুন
        s3_key = f"videos/{video_id}/{q['name']}.mp4"
        s3.upload_file(output_path, "my-video-bucket", s3_key)
        output_files.append(s3_key)

    return output_files  # CDN-এ push করা হবে`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-lg font-bold text-foreground mt-4'>
                            📊 Video Chunking — HLS Protocol
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'hls',
                    filename: 'master.m3u8 (Playlist file)',
                    code: `# Master playlist — player এটা দেখে quality choose করে
#EXTM3U
#EXT-X-VERSION:3

# 360p stream
#EXT-X-STREAM-INF:BANDWIDTH=400000,RESOLUTION=640x360
https://cdn.youtube.com/video123/360p/playlist.m3u8

# 720p stream
#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720
https://cdn.youtube.com/video123/720p/playlist.m3u8

# 1080p stream
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
https://cdn.youtube.com/video123/1080p/playlist.m3u8

# Player automatically best quality select করে bandwidth অনুযায়ী`,
                },
            ],
        },
        {
            id: 'abr-cdn',
            subHeader: { index: '006', title: 'ABR & CDN Strategy' },
            title: (
                <SectionTitle>
                    Adaptive Bitrate &amp; CDN — Global Delivery
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            YouTube-এর streaming architecture-এর দুটো secret
                            weapon:{' '}
                            <strong className='text-foreground'>ABR</strong>{' '}
                            (buffer-free playback) এবং{' '}
                            <strong className='text-foreground'>CDN</strong>{' '}
                            (global fast delivery)।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='bg-muted/30 border border-border rounded-lg p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 text-center'>
                                ABR Streaming — How HLS/DASH Works
                            </p>
                            <div className='flex flex-col gap-4'>
                                <div className='flex flex-wrap items-center gap-2 justify-center'>
                                    {[
                                        {
                                            label: 'Video File',
                                            color: 'border-yellow-500 text-yellow-700 dark:text-yellow-400',
                                        },
                                        {
                                            label: '→',
                                            color: 'text-muted-foreground',
                                            plain: true,
                                        },
                                        {
                                            label: 'Segment into 4s Chunks',
                                            color: 'border-orange-500 text-orange-700 dark:text-orange-400',
                                        },
                                        {
                                            label: '→',
                                            color: 'text-muted-foreground',
                                            plain: true,
                                        },
                                        {
                                            label: 'm3u8 Playlist',
                                            color: 'border-purple-500 text-purple-700 dark:text-purple-400',
                                        },
                                        {
                                            label: '→',
                                            color: 'text-muted-foreground',
                                            plain: true,
                                        },
                                        {
                                            label: 'CDN Edge',
                                            color: 'border-blue-500 text-blue-700 dark:text-blue-400',
                                        },
                                        {
                                            label: '→',
                                            color: 'text-muted-foreground',
                                            plain: true,
                                        },
                                        {
                                            label: 'Player Auto-selects Quality',
                                            color: 'border-emerald-500 text-emerald-700 dark:text-emerald-400',
                                        },
                                    ].map((item, i) =>
                                        item.plain ? (
                                            <span
                                                key={i}
                                                className='text-muted-foreground font-mono'>
                                                →
                                            </span>
                                        ) : (
                                            <div
                                                key={i}
                                                className={`px-3 py-2 border rounded text-xs font-mono bg-card/50 ${item.color}`}>
                                                {item.label}
                                            </div>
                                        )
                                    )}
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mt-2'>
                                    <div className='bg-card/50 border border-border rounded p-3'>
                                        <p className='text-xs font-mono text-red-700 dark:text-red-400 font-bold mb-2'>
                                            🐌 Slow Network (≤ 1 Mbps)
                                        </p>
                                        <p className='text-xs text-muted-foreground'>
                                            Player switches to{' '}
                                            <span className='text-yellow-700 dark:text-yellow-400'>
                                                360p
                                            </span>
                                            । No buffering। Small chunk size।
                                        </p>
                                    </div>
                                    <div className='bg-card/50 border border-border rounded p-3'>
                                        <p className='text-xs font-mono text-yellow-700 dark:text-yellow-400 font-bold mb-2'>
                                            🚶 Normal Network (5 Mbps)
                                        </p>
                                        <p className='text-xs text-muted-foreground'>
                                            Player uses{' '}
                                            <span className='text-emerald-700 dark:text-emerald-400'>
                                                720p
                                            </span>
                                            । Balanced quality/buffer।
                                        </p>
                                    </div>
                                    <div className='bg-card/50 border border-border rounded p-3'>
                                        <p className='text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold mb-2'>
                                            🚀 Fast Network (20+ Mbps)
                                        </p>
                                        <p className='text-xs text-muted-foreground'>
                                            Player serves{' '}
                                            <span className='text-blue-700 dark:text-blue-400'>
                                                1080p / 4K
                                            </span>
                                            । Full quality।
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Protocol', 'Developer', 'Chunk Size', 'Supported By', 'Best For'],
                    rows: [
                        [
                            <span className='text-primary font-bold'>HLS</span>,
                            'Apple',
                            '2-10 sec',
                            'iOS, Safari, all',
                            'VOD + Live streaming',
                        ],
                        [
                            <span className='text-purple-700 dark:text-purple-400 font-bold'>DASH</span>,
                            'MPEG (ISO)',
                            '2-4 sec',
                            'Android, Chrome',
                            'Adaptive VOD',
                        ],
                        [
                            <span className='text-orange-700 dark:text-orange-400 font-bold'>RTMP</span>,
                            'Adobe',
                            'Real-time',
                            'Flash (legacy)',
                            'Live ingest only',
                        ],
                        [
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>WebRTC</span>,
                            'W3C/IETF',
                            'Sub-second',
                            'All browsers',
                            'Ultra-low latency',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: '💡 Netflix Open Connect',
                    content: (
                        <p>
                            Netflix Open Connect Appliance (OCA) —{' '}
                            <strong>Netflix নিজেই hardware box তৈরি</strong>{' '}
                            করে ISP-দের কাছে বিনামূল্যে দেয়। ISP
                            network-এর ভেতরে Netflix content cache থাকে।
                            Bandwidth cost কমে, speed বাড়ে। Bangladesh-এর
                            user India বা Singapore edge থেকে video পাবেন —
                            origin US server থেকে না। Latency 200ms থেকে
                            10ms-এ নামে।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'database',
            subHeader: { index: '007', title: 'Database Design' },
            title: (
                <SectionTitle>
                    Data কোথায় রাখবো?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Data', 'Database', 'Why?'],
                    rows: [
                        [
                            'Video metadata (title, desc)',
                            'MySQL + Redis cache',
                            'Structured, relational, cacheable',
                        ],
                        [
                            'Raw video files',
                            'Amazon S3 / Google Cloud Storage',
                            'Object storage, terabytes-scale',
                        ],
                        [
                            'Processed videos',
                            'S3 → CDN (CloudFront)',
                            'Edge delivery globally',
                        ],
                        [
                            'User watch history',
                            'Cassandra',
                            'Time-series, massive scale',
                        ],
                        [
                            'Video search index',
                            'Elasticsearch',
                            'Full-text search, tags',
                        ],
                        [
                            'Recommendations data',
                            'Neo4j / ML model store',
                            'Graph-based recommendations',
                        ],
                        [
                            'View counts, likes',
                            'Redis (counters)',
                            'Fast atomic increments',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: '⚠️ Never Store Videos in DB',
                    content: (
                        <p>
                            Database-এ video binary কখনো store করবেন না।
                            Database slow binary retrieval-এর জন্য। সর্বদা
                            Object Storage (S3) + CDN ব্যবহার করুন। DB শুধু{' '}
                            <strong>metadata</strong> রাখে।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'scaling',
            subHeader: { index: '008', title: 'Scaling Decisions' },
            title: (
                <SectionTitle>Scale করার উপায়</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-3'>
                            {[
                                {
                                    type: 'pro',
                                    label: 'Strategy',
                                    title: 'CDN is Everything',
                                    text: '95%+ video traffic CDN থেকে serve হয়। Origin server-এ কোনো load নেই। Netflix Open Connect — নিজেদের CDN boxes ISP-র কাছে রাখে।',
                                },
                                {
                                    type: 'pro',
                                    label: 'Strategy',
                                    title: 'Parallel Transcoding',
                                    text: 'একটা video কে segments-এ ভাগ করে parallel workers-এ transcode করুন। 1-hour video → 1 worker 1 hour লাগবে, 60 workers = 1 minute!',
                                },
                                {
                                    type: 'pro',
                                    label: 'Strategy',
                                    title: 'Pre-warm CDN',
                                    text: 'Popular video detect হলে immediately CDN edge locations-এ push করুন। Viral হওয়ার আগেই ready।',
                                },
                                {
                                    type: 'con',
                                    label: 'Trade-off',
                                    title: 'Storage Cost',
                                    text: '10x storage multiplication (multiple qualities)। Storage cheap কিন্তু at 1 exabyte scale expensive হয়। Cold storage (Glacier) use করুন old videos-এর জন্য।',
                                },
                                {
                                    type: 'con',
                                    label: 'Trade-off',
                                    title: 'Transcoding Time',
                                    text: '4K video transcode করতে সময় লাগে। User upload করার সাথে সাথে সব quality available হয় না — lower quality আগে, higher quality পরে।',
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className='flex gap-3 items-start'>
                                    <span
                                        className={`font-mono text-[11px] px-2 py-1 rounded flex-shrink-0 mt-0.5 ${
                                            item.type === 'pro'
                                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                                                : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20'
                                        }`}>
                                        {item.label}
                                    </span>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        <strong className='text-foreground'>
                                            {item.title}:
                                        </strong>{' '}
                                        {item.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'techstack',
            subHeader: { index: '009', title: 'Full Tech Stack' },
            title: (
                <SectionTitle>
                    YouTube/Netflix-এর Technologies
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <div>
                                <h3 className='text-sm font-mono font-bold uppercase tracking-widest text-muted-foreground mb-3'>
                                    Backend &amp; Processing
                                </h3>
                                <div className='flex flex-wrap gap-2'>
                                    {[
                                        {
                                            label: 'Python / Java',
                                            color: 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5',
                                        },
                                        {
                                            label: 'FFmpeg (Transcoding)',
                                            color: 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5',
                                        },
                                        {
                                            label: 'Kubernetes',
                                            color: 'border-purple-500/30 text-purple-700 dark:text-purple-400 bg-purple-500/5',
                                        },
                                        {
                                            label: 'Apache Kafka',
                                            color: 'border-orange-500/30 text-orange-700 dark:text-orange-400 bg-orange-500/5',
                                        },
                                    ].map((tag, i) => (
                                        <span
                                            key={i}
                                            className={`font-mono text-xs px-3 py-1.5 rounded border ${tag.color}`}>
                                            {tag.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className='text-sm font-mono font-bold uppercase tracking-widest text-muted-foreground mb-3'>
                                    Storage
                                </h3>
                                <div className='flex flex-wrap gap-2'>
                                    {[
                                        {
                                            label: 'Amazon S3 (Video Files)',
                                            color: 'border-primary/30 text-primary bg-primary/5',
                                        },
                                        {
                                            label: 'MySQL (Metadata)',
                                            color: 'border-primary/30 text-primary bg-primary/5',
                                        },
                                        {
                                            label: 'Redis (Cache + Counters)',
                                            color: 'border-yellow-500/30 text-yellow-700 dark:text-yellow-400 bg-yellow-500/5',
                                        },
                                        {
                                            label: 'Cassandra (Watch History)',
                                            color: 'border-primary/30 text-primary bg-primary/5',
                                        },
                                        {
                                            label: 'Elasticsearch (Search)',
                                            color: 'border-primary/30 text-primary bg-primary/5',
                                        },
                                    ].map((tag, i) => (
                                        <span
                                            key={i}
                                            className={`font-mono text-xs px-3 py-1.5 rounded border ${tag.color}`}>
                                            {tag.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className='text-sm font-mono font-bold uppercase tracking-widest text-muted-foreground mb-3'>
                                    Delivery &amp; Monitoring
                                </h3>
                                <div className='flex flex-wrap gap-2'>
                                    {[
                                        {
                                            label: 'CloudFront CDN',
                                            color: 'border-purple-500/30 text-purple-700 dark:text-purple-400 bg-purple-500/5',
                                        },
                                        {
                                            label: 'HLS / MPEG-DASH',
                                            color: 'border-purple-500/30 text-purple-700 dark:text-purple-400 bg-purple-500/5',
                                        },
                                        {
                                            label: 'Prometheus + Grafana',
                                            color: 'border-purple-500/30 text-purple-700 dark:text-purple-400 bg-purple-500/5',
                                        },
                                        {
                                            label: 'Apache Spark (Recommendations)',
                                            color: 'border-purple-500/30 text-purple-700 dark:text-purple-400 bg-purple-500/5',
                                        },
                                    ].map((tag, i) => (
                                        <span
                                            key={i}
                                            className={`font-mono text-xs px-3 py-1.5 rounded border ${tag.color}`}>
                                            {tag.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 'recommendations-interview',
            subHeader: { index: '010', title: 'Recommendations & Interview Tips' },
            title: (
                <SectionTitle>
                    Recommendations &amp; Interview Tips
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='bg-muted/30 border border-border rounded-lg p-5'>
                                <p className='text-xs font-mono uppercase tracking-widest text-primary mb-3 font-bold'>
                                    🤖 Recommendation System
                                </p>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    YouTube recommendation হলো ML-based।
                                    User watch history (Cassandra) + likes +
                                    search queries → collaborative filtering।
                                    Graph DB (Neo4j) দিয়ে similar users
                                    find করা হয়। Apache Spark large-scale
                                    batch processing করে।
                                </p>
                            </div>
                            <div className='bg-muted/30 border border-border rounded-lg p-5'>
                                <p className='text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-3 font-bold'>
                                    ✅ Interview Tips
                                </p>
                                <ul className='space-y-2 text-sm text-muted-foreground'>
                                    <li className='flex gap-2'>
                                        <span className='text-emerald-700 dark:text-emerald-400 flex-shrink-0'>
                                            →
                                        </span>
                                        <span>
                                            Upload path এবং stream path আলাদা করুন
                                        </span>
                                    </li>
                                    <li className='flex gap-2'>
                                        <span className='text-emerald-700 dark:text-emerald-400 flex-shrink-0'>
                                            →
                                        </span>
                                        <span>
                                            CDN-first strategy mention করুন
                                        </span>
                                    </li>
                                    <li className='flex gap-2'>
                                        <span className='text-emerald-700 dark:text-emerald-400 flex-shrink-0'>
                                            →
                                        </span>
                                        <span>
                                            Kafka দিয়ে async transcoding বলুন
                                        </span>
                                    </li>
                                    <li className='flex gap-2'>
                                        <span className='text-emerald-700 dark:text-emerald-400 flex-shrink-0'>
                                            →
                                        </span>
                                        <span>
                                            Never DB for video binary — S3 বলুন
                                        </span>
                                    </li>
                                    <li className='flex gap-2'>
                                        <span className='text-emerald-700 dark:text-emerald-400 flex-shrink-0'>
                                            →
                                        </span>
                                        <span>
                                            ABR / HLS explain করতে পারেন
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '🎯 Interview Must-Know: Viral Video Handling',
                    content: (
                        <p>
                            Viral video (suddenly 10M views in 1 hour) —{' '}
                            <strong>CDN automatically handle করে</strong>।
                            Viral video CDN edge servers globally cached।
                            10M concurrent viewers CDN থেকে serve হয়,
                            origin server-এ almost zero load। এজন্যই
                            YouTube viral videos-এও crash করে না।
                        </p>
                    ),
                },
            ],
        },
    ],
    summary: {
        headers: ['Challenge', 'Solution', 'Technology'],
        rows: [
            [
                <span className='font-bold text-primary'>
                    Video storage at scale
                </span>,
                'Object storage',
                'Amazon S3',
            ],
            [
                <span className='font-bold text-primary'>
                    Multiple quality formats
                </span>,
                'Transcoding pipeline',
                'FFmpeg + Workers',
            ],
            [
                <span className='font-bold text-primary'>
                    Global fast delivery
                </span>,
                'Edge CDN',
                'CloudFront/Akamai',
            ],
            [
                <span className='font-bold text-primary'>
                    Smooth streaming
                </span>,
                'Adaptive bitrate',
                'HLS / DASH',
            ],
            [
                <span className='font-bold text-primary'>
                    Async processing
                </span>,
                'Message queue',
                'Apache Kafka',
            ],
            [
                <span className='font-bold text-primary'>
                    Watch history
                </span>,
                'Time-series DB',
                'Cassandra',
            ],
            [
                <span className='font-bold text-primary'>
                    HLS (HTTP Live Streaming)
                </span>,
                '2-10s chunks, m3u8 playlist, ABR',
                'Apple / Industry standard',
            ],
            [
                <span className='font-bold text-primary'>
                    DASH (MPEG-DASH)
                </span>,
                '2-4s segments, ISO standard, codec-agnostic',
                'MPEG / Android / Chrome',
            ],
            [
                <span className='font-bold text-primary'>
                    RTMP
                </span>,
                'Real-time ingest for live streams',
                'Adobe (legacy ingest)',
            ],
            [
                <span className='font-bold text-primary'>
                    Netflix Open Connect
                </span>,
                'ISP-level CDN appliances',
                'Netflix proprietary CDN',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'একটি video upload হলে কতটি different format/quality-তে transcode করা হয় সাধারণত?',
                options: [
                    {
                        key: 'a',
                        text: 'শুধু 1 (original)',
                        isCorrect: false,
                        explanation: 'Original রাখলে শুধু একটা quality পানয়া যাবেন, different network speed-এ smooth playback সম্ভব হবে না।',
                    },
                    {
                        key: 'b',
                        text: '5-10 different qualities',
                        isCorrect: true,
                        explanation: 'সঠিক উত্তর: YouTube typically 360p, 480p, 720p, 1080p, 1440p, 4K + different codecs (H.264, VP9, AV1) + audio tracks = 5-10+ versions। এজন্য storage 10x multiply হয়।',
                    },
                    {
                        key: 'c',
                        text: '100+ formats',
                        isCorrect: false,
                        explanation: '100+ format করা impractical এবং storage cost অনেক বেশি হবে।',
                    },
                    {
                        key: 'd',
                        text: '2 (HD and SD)',
                        isCorrect: false,
                        explanation: 'শুধু 2টা quality দিয়ে সব network condition cover করা যায় না।',
                    },
                ],
            },
            {
                id: 2,
                text: 'Adaptive Bitrate Streaming (ABR) কী করে?',
                options: [
                    {
                        key: 'a',
                        text: 'Video compress করে',
                        isCorrect: false,
                        explanation: 'Video compression ABR এর কাজ নয় — এটা encoding সময় হয়।',
                    },
                    {
                        key: 'b',
                        text: 'Audio quality বাড়ায়',
                        isCorrect: false,
                        explanation: 'ABR audio quality নিয়ে কাজ করে না — এটা video bitrate নিয়ে কাজ করে।',
                    },
                    {
                        key: 'c',
                        text: 'Network speed অনুযায়ী automatically quality switch করে',
                        isCorrect: true,
                        explanation: 'সঠিক উত্তর: ABR player bandwidth monitor করে। Slow network = 360p switch, fast network = 1080p switch। HLS/DASH protocol এটা implement করে। এজন্যই YouTube-এ buffering কম হয়।',
                    },
                    {
                        key: 'd',
                        text: 'Video resolution permanently change করে',
                        isCorrect: false,
                        explanation: 'ABR dynamically switch করে — permanently change করে না।',
                    },
                ],
            },
            {
                id: 3,
                text: 'Video binary data কোথায় store করবেন?',
                options: [
                    {
                        key: 'a',
                        text: 'Amazon S3 বা Google Cloud Storage',
                        isCorrect: true,
                        explanation: 'সঠিক উত্তর: Object Storage (S3/GCS) videos-এর জন্য designed। Scalable to exabytes, cheap, durable, CDN integration। Database BLOB = terrible performance at scale। Local disk = no redundancy।',
                    },
                    {
                        key: 'b',
                        text: 'MySQL BLOB field',
                        isCorrect: false,
                        explanation: 'Database BLOB field video-র জন্য horrible performance। DB slow binary retrieval-এর জন্য।',
                    },
                    {
                        key: 'c',
                        text: 'Redis cache',
                        isCorrect: false,
                        explanation: 'Redis in-memory — video files store করার জন্য designed নয়, RAM expensive।',
                    },
                    {
                        key: 'd',
                        text: 'API Server local disk',
                        isCorrect: false,
                        explanation: 'Local disk-এ কোনো redundancy নেই, server fail করলেন সব হারাবে।',
                    },
                ],
            },
            {
                id: 4,
                text: 'CDN (Content Delivery Network) video streaming-এ কেন important?',
                options: [
                    {
                        key: 'a',
                        text: 'Video encode করতে',
                        isCorrect: false,
                        explanation: 'CDN video encode করে না — encoding transcoding workers করে।',
                    },
                    {
                        key: 'b',
                        text: 'User authentication করতে',
                        isCorrect: false,
                        explanation: 'Authentication CDN এর কাজ নয় — API server করে।',
                    },
                    {
                        key: 'c',
                        text: 'Database query করতে',
                        isCorrect: false,
                        explanation: 'CDN static content deliver করে — database query করে না।',
                    },
                    {
                        key: 'd',
                        text: 'User-এর কাছের server থেকে video deliver করে latency কমাতে',
                        isCorrect: true,
                        explanation: 'সঠিক উত্তর: CDN edge servers globally distributed। Bangladesh-এর user India বা Singapore edge থেকে video পাবেন — origin US server থেকে না। Latency 200ms থেকে 10ms-এ নামে। এটাই fast streaming-এর secret।',
                    },
                ],
            },
            {
                id: 5,
                text: 'Video transcoding speed বাড়াতে কোন approach best?',
                options: [
                    {
                        key: 'a',
                        text: 'একটা বড় server',
                        isCorrect: false,
                        explanation: 'Single server vertical scaling এর limit আছে এবং expensive।',
                    },
                    {
                        key: 'b',
                        text: 'Video segments-এ ভাগ করে parallel workers-এ process',
                        isCorrect: true,
                        explanation: 'সঠিক উত্তর: 1-hour video → 60 segments × parallel workers = drastically faster। YouTube DAG (Directed Acyclic Graph) দিয়ে transcoding pipeline manage করে। এটাই "embarrassingly parallel" problem।',
                    },
                    {
                        key: 'c',
                        text: 'User-কে wait করতে বলুন',
                        isCorrect: false,
                        explanation: 'YouTube-এ uploaded video 1 minute-এর মধ্যে available হওয়া দরকার।',
                    },
                    {
                        key: 'd',
                        text: 'কম quality transcode করুন',
                        isCorrect: false,
                        explanation: 'কম quality = poor user experience — এটা solution নয়।',
                    },
                ],
            },
            {
                id: 6,
                text: 'User-এর watch history (কোন video কতটুকু দেখেছে) store করতে কোন DB best?',
                options: [
                    {
                        key: 'a',
                        text: 'MySQL',
                        isCorrect: false,
                        explanation: 'MySQL billions of time-series events handle করতে struggle করবেন।',
                    },
                    {
                        key: 'b',
                        text: 'Redis',
                        isCorrect: false,
                        explanation: 'Redis in-memory — billions of watch history events store করতে RAM অনেক লাগবে।',
                    },
                    {
                        key: 'c',
                        text: 'Cassandra',
                        isCorrect: true,
                        explanation: 'সঠিক উত্তর: Watch history = time-series data। User_id দিয়ে partition, watched_at দিয়ে cluster। Massive write throughput (billions of events/day)। Cassandra time-series workload-এর জন্য perfect।',
                    },
                    {
                        key: 'd',
                        text: 'Elasticsearch',
                        isCorrect: false,
                        explanation: 'Elasticsearch search-এর জন্য ভালো — time-series watch history-র জন্য best নয়।',
                    },
                ],
            },
            {
                id: 7,
                text: '"Resume from where you left off" feature implement করবেন কীভাবে?',
                options: [
                    {
                        key: 'a',
                        text: 'User-এর last watch position DB-তে save, start করলেন সেখান থেকে',
                        isCorrect: true,
                        explanation: 'সঠিক উত্তর: Periodic position save করুন (every 10 seconds)। user_id + video_id → last_position_seconds। Video load হলে এই position থেকে HLS chunk request করুন। Simple but effective।',
                    },
                    {
                        key: 'b',
                        text: 'Browser cookie-তে রাখুন',
                        isCorrect: false,
                        explanation: 'Cookie শুধু same browser-এ কাজ করে — mobile app বা অন্য device-এ resume হবে না।',
                    },
                    {
                        key: 'c',
                        text: 'Video re-encode করুন',
                        isCorrect: false,
                        explanation: 'Video re-encoding resume feature-এর সাথে সম্পর্কহীন।',
                    },
                    {
                        key: 'd',
                        text: 'Possible না',
                        isCorrect: false,
                        explanation: 'YouTube এই feature implement করেছেনে — DB-তে position save করে।',
                    },
                ],
            },
            {
                id: 8,
                text: 'Netflix Open Connect কী?',
                options: [
                    {
                        key: 'a',
                        text: 'Netflix-এর API',
                        isCorrect: false,
                        explanation: 'Netflix Open Connect API নয় — এটা hardware CDN infrastructure।',
                    },
                    {
                        key: 'b',
                        text: 'Netflix-এর database',
                        isCorrect: false,
                        explanation: 'Netflix database এর জন্য Cassandra ব্যবহার করে।',
                    },
                    {
                        key: 'c',
                        text: 'Netflix-এর payment system',
                        isCorrect: false,
                        explanation: 'Netflix payment system Open Connect নয়।',
                    },
                    {
                        key: 'd',
                        text: 'Netflix-এর নিজস্ব CDN — ISP-দের কাছে servers রাখে',
                        isCorrect: true,
                        explanation: 'সঠিক উত্তর: Netflix Open Connect Appliance (OCA) — Netflix নিজেই hardware box তৈরি করে ISP-দের কাছে বিনামূল্যে দেয়। ISP network-এর ভেতরে Netflix content cache থাকে। Bandwidth cost কমে, speed বাড়ে।',
                    },
                ],
            },
            {
                id: 9,
                text: 'HLS (HTTP Live Streaming) কীভাবে কাজ করে?',
                options: [
                    {
                        key: 'a',
                        text: 'Entire video একসাথে download করে',
                        isCorrect: false,
                        explanation: 'Entire video download করলেন buffering হবে এবং শুরু হতে দেরি হবে।',
                    },
                    {
                        key: 'b',
                        text: 'Video small chunks (2-10 sec)-এ ভাগ করে HTTP-তে serve করে',
                        isCorrect: true,
                        explanation: 'সঠিক উত্তর: HLS video-কে 2-10 second chunks-এ ভাগ করে। .m3u8 playlist file এ chunk list থাকে। Player sequentially chunks download করে। Standard HTTP use করে তাই CDN-friendly। Apple-এর invention, এখন industry standard।',
                    },
                    {
                        key: 'c',
                        text: 'UDP দিয়ে stream করে',
                        isCorrect: false,
                        explanation: 'HLS HTTP/TCP use করে — UDP নয়। এজন্যই CDN-friendly।',
                    },
                    {
                        key: 'd',
                        text: 'Real-time encode করে',
                        isCorrect: false,
                        explanation: 'HLS pre-encoded chunks serve করে — real-time encoding নয়।',
                    },
                ],
            },
            {
                id: 10,
                text: 'Viral video (suddenly 10M views in 1 hour) — system কীভাবে handle করবেন?',
                options: [
                    {
                        key: 'a',
                        text: 'Server upgrade করুন',
                        isCorrect: false,
                        explanation: 'Vertical scaling reactive approach — viral হওয়ার পরে upgrade করলেন দেরি হবে।',
                    },
                    {
                        key: 'b',
                        text: 'Video temporarily block করুন',
                        isCorrect: false,
                        explanation: 'Video block করলেন user experience নষ্ট হবে এবং এটা কোনো solution নয়।',
                    },
                    {
                        key: 'c',
                        text: 'CDN automatically handle করে — edge servers cache থেকে serve',
                        isCorrect: true,
                        explanation: 'সঠিক উত্তর: CDN-এর beauty: viral video CDN edge servers globally cached। 10M concurrent viewers CDN থেকে serve হয়, origin server-এ almost zero load। এজন্যই YouTube viral videos-এও crash করে না।',
                    },
                    {
                        key: 'd',
                        text: 'Origin server direct serve করুন',
                        isCorrect: false,
                        explanation: 'Origin server direct serve করলেন 10M requests handle করতে পারবেন না — crash হবে।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'Video Streaming Platform ডিজাইন করুন',
        time: '৪-৫ ঘন্টা',
        difficulty: 'Advanced',
        tasks: [
            <span key='1'>
                <strong>Architecture Diagram:</strong> YouTube-এর complete
                system diagram আঁকুন। Upload path এবং Stream path আলাদা রঙে
                দেখাও। Components: Creator → Upload Service → Raw S3 → Kafka
                → Transcoding Workers → Processed S3 → CDN → Viewer।
            </span>,
            <span key='2'>
                <strong>Transcoding Pipeline:</strong> একটা 2-hour 4K movie
                upload হলে: (ক) কতগুলো output file তৈরি হবে? (খ) প্রতিটার
                approximate size? (গ) Total storage কত? (ঘ) 1 worker vs 120
                parallel workers — time difference কত?
            </span>,
            <span key='3'>
                <strong>HLS Playlist:</strong> নিজে একটা simple .m3u8 master
                playlist file লিখুন 3টা quality-র জন্য (360p, 720p, 1080p)।
                Format দেখে উপরের example থেকে।
            </span>,
            <span key='4'>
                <strong>CDN Strategy:</strong> Bangladesh-এর user যখন YouTube
                video দেখে, request কোথা থেকে serve হওয়া উচিত? CDN edge
                location কোথায় থাকলে best? Explain করুন।
            </span>,
            <span key='5'>
                <strong>Cost Analysis:</strong> যদি প্রতিদিন 1 petabyte video
                store করতে হয়, AWS S3 standard pricing (~$23/TB/month) এ
                monthly cost কত? Cold storage (Glacier, ~$4/TB/month) use
                করলেন পুরনো videos-এর জন্য কত save হবে?
            </span>,
        ],
        deliverables: [
            <span key='1'>
                YouTube architecture diagram (upload + stream paths)
            </span>,
            <span key='2'>Transcoding calculation table</span>,
            <span key='3'>Sample .m3u8 playlist file</span>,
            <span key='4'>
                CDN placement explanation + Cost analysis calculation
            </span>,
        ],
    },
    practicalLab: {
        title: 'Video Processing Pipeline',
        subtitle: 'FFmpeg + S3 + CloudFront',
        steps: [
            {
                title: 'FFmpeg + boto3 Setup করুন',
                description:
                    'Python environment-এ ffmpeg-python, boto3 install করুন। AWS credentials configure করুন। S3 bucket তৈরি করুন raw-videos এবং processed-videos-এর জন্য।',
            },
            {
                title: 'Upload Endpoint বানান',
                description:
                    'FastAPI দিয়ে /upload endpoint। Multipart file accept করুন। Raw S3 bucket-এ save করুন। Kafka-তে video_uploaded event publish করুন।',
            },
            {
                title: 'Transcoding Worker লিখুন',
                description:
                    'Kafka consumer যেটা video_uploaded event শুনবে। FFmpeg দিয়ে 360p, 720p, 1080p transcode করবেন। Processed S3-এ upload করবেন। Metadata DB update করবেন।',
            },
            {
                title: 'HLS Playlist Generate করুন',
                description:
                    'FFmpeg দিয়ে .ts segment files এবং .m3u8 playlist তৈরি করুন। master.m3u8 file-এ সব quality-র reference রাখুন। S3-এ upload করুন।',
            },
            {
                title: 'CloudFront CDN Connect করুন',
                description:
                    'S3 bucket-এ CloudFront distribution create করুন। CDN URL দিয়ে video serve করুন। Test করুন — বিভিন্ন quality switch করে দেখুন।',
            },
        ],
        codeBlock: {
            language: 'python',
            filename: 'video_upload_pipeline.py',
            code: `import subprocess
import boto3
import json
import uuid
from pathlib import Path

s3 = boto3.client('s3')
RAW_BUCKET = "yt-raw-videos"
PROCESSED_BUCKET = "yt-processed-videos"

def upload_raw_video(file_path: str, video_id: str) -> str:
    """Step 1: Raw video S3-এ upload করুন"""
    s3_key = f"raw/{video_id}/original.mp4"
    s3.upload_file(file_path, RAW_BUCKET, s3_key)
    print(f"✅ Raw video uploaded: s3://{RAW_BUCKET}/{s3_key}")
    return s3_key

def transcode_to_hls(raw_path: str, video_id: str) -> dict:
    """Step 2: FFmpeg দিয়ে HLS segments তৈরি করুন"""
    output_dir = f"/tmp/{video_id}"
    Path(output_dir).mkdir(exist_ok=True)

    qualities = [
        {"name": "360p",  "width": 640,  "height": 360,  "bitrate": "400k",  "maxrate": "428k",  "bufsize": "600k"},
        {"name": "720p",  "width": 1280, "height": 720,  "bitrate": "2800k", "maxrate": "2996k", "bufsize": "4200k"},
        {"name": "1080p", "width": 1920, "height": 1080, "bitrate": "5000k", "maxrate": "5350k", "bufsize": "7500k"},
    ]

    playlists = []
    for q in qualities:
        out_path = f"{output_dir}/{q['name']}"
        Path(out_path).mkdir(exist_ok=True)

        # FFmpeg HLS output তৈরি করুন
        subprocess.run([
            "ffmpeg", "-i", raw_path,
            "-vf", f"scale={q['width']}:{q['height']}",
            "-c:v", "libx264", "-crf", "20",
            "-b:v", q["bitrate"], "-maxrate", q["maxrate"], "-bufsize", q["bufsize"],
            "-c:a", "aac", "-b:a", "128k",
            "-hls_time", "6",               # 6 second chunks
            "-hls_playlist_type", "vod",
            "-hls_segment_filename", f"{out_path}/seg_%03d.ts",
            f"{out_path}/playlist.m3u8"
        ], check=True)

        # S3-এ upload করুন
        for file in Path(out_path).glob("*"):
            key = f"processed/{video_id}/{q['name']}/{file.name}"
            s3.upload_file(str(file), PROCESSED_BUCKET, key,
                          ExtraArgs={"ContentType": "application/x-mpegURL" if file.suffix == ".m3u8" else "video/MP2T"})

        cdn_playlist_url = f"https://cdn.example.com/processed/{video_id}/{q['name']}/playlist.m3u8"
        playlists.append({"name": q["name"], "bandwidth": q["bitrate"], "url": cdn_playlist_url})

    return playlists

def generate_master_playlist(video_id: str, playlists: list) -> str:
    """Step 3: Master m3u8 playlist তৈরি করুন"""
    bandwidth_map = {"360p": 400000, "720p": 2800000, "1080p": 5000000}
    resolution_map = {"360p": "640x360", "720p": "1280x720", "1080p": "1920x1080"}

    content = "#EXTM3U\\n#EXT-X-VERSION:3\\n\\n"
    for p in playlists:
        bw = bandwidth_map.get(p["name"], 1000000)
        res = resolution_map.get(p["name"], "1280x720")
        content += f"#EXT-X-STREAM-INF:BANDWIDTH={bw},RESOLUTION={res}\\n"
        content += f"{p['url']}\\n\\n"

    # Master playlist S3-এ save করুন
    master_key = f"processed/{video_id}/master.m3u8"
    s3.put_object(
        Bucket=PROCESSED_BUCKET, Key=master_key,
        Body=content.encode(), ContentType="application/x-mpegURL"
    )

    cdn_url = f"https://cdn.example.com/{master_key}"
    print(f"✅ Master playlist: {cdn_url}")
    return cdn_url

def process_video(local_file_path: str) -> dict:
    """Complete pipeline orchestrator"""
    video_id = str(uuid.uuid4())[:8]
    print(f"\\n🎬 Processing video: {video_id}")

    # Step 1: Upload raw
    upload_raw_video(local_file_path, video_id)

    # Step 2: Transcode to HLS
    playlists = transcode_to_hls(local_file_path, video_id)

    # Step 3: Master playlist
    master_url = generate_master_playlist(video_id, playlists)

    return {
        "video_id": video_id,
        "master_playlist": master_url,
        "qualities": [p["name"] for p in playlists],
        "status": "ready"
    }

# Usage
if __name__ == "__main__":
    result = process_video("/tmp/sample_video.mp4")
    print(json.dumps(result, indent=2))`,
        },
        tip: 'Real YouTube-এ Kafka consumer parallel workers-এ video process করে। একটা 2-hour video কে 60+ segments-এ ভাগ করে 60+ parallel workers দিয়ে transcode করে — total time 2 hours না হয়ে 2 minutes-এ নেমে আসে। এটাই "embarrassingly parallel" distributed computing-এর beauty।',
    },
};
