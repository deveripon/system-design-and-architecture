import { ImageResponse } from 'next/og';
import { courseData } from '@/lib/course-data';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: topicId } = await params;
    const phase = courseData.find(p => p.topics.some(t => t.id === topicId));
    const topic = phase?.topics.find(t => t.id === topicId);

    const title = topic?.title ?? 'System Design Mastery';
    const phaseLabel = phase?.title ?? 'System Design';
    const tag = topic?.tag ?? 'LEARN';
    const level = topic?.level ?? 'Intermediate';

    return new ImageResponse(
        (
            <div
                style={{
                    width: '1200px',
                    height: '630px',
                    background: '#12110e',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    fontFamily: 'monospace',
                    overflow: 'hidden',
                }}
            >
                {/* Grid overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage:
                            'linear-gradient(rgba(224,138,94,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(224,138,94,0.05) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />

                {/* Stars - random static dots to match hero */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: i % 3 === 0 ? '2px' : '1px',
                            height: i % 3 === 0 ? '2px' : '1px',
                            background: i % 5 === 0 ? '#e08a5e' : '#fff',
                            opacity: 0.3,
                            borderRadius: '50%',
                        }}
                    />
                ))}

                {/* Top border accent */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background:
                            'linear-gradient(90deg, transparent, #e08a5e, transparent)',
                    }}
                />

                {/* Corner brackets */}
                <div
                    style={{
                        position: 'absolute',
                        top: '40px',
                        left: '60px',
                        width: '32px',
                        height: '32px',
                        borderTop: '2px solid #e08a5e',
                        borderLeft: '2px solid #e08a5e',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: '40px',
                        right: '60px',
                        width: '32px',
                        height: '32px',
                        borderTop: '2px solid #e08a5e',
                        borderRight: '2px solid #e08a5e',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '60px',
                        width: '32px',
                        height: '32px',
                        borderBottom: '2px solid #e08a5e',
                        borderLeft: '2px solid #e08a5e',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        right: '60px',
                        width: '32px',
                        height: '32px',
                        borderBottom: '2px solid #e08a5e',
                        borderRight: '2px solid #e08a5e',
                    }}
                />

                {/* Content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '80px 100px',
                        height: '100%',
                        gap: 0,
                    }}
                >
                    {/* Top label row */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            marginBottom: '32px',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '11px',
                                letterSpacing: '0.25em',
                                textTransform: 'uppercase',
                                color: '#e08a5e',
                                border: '1px solid rgba(224,138,94,0.3)',
                                padding: '4px 12px',
                                background: 'rgba(224,138,94,0.05)',
                            }}
                        >
                            {tag}
                        </span>
                        <span
                            style={{
                                fontSize: '11px',
                                letterSpacing: '0.25em',
                                textTransform: 'uppercase',
                                color: '#64748b',
                                border: '1px solid rgba(100,116,139,0.2)',
                                padding: '4px 12px',
                            }}
                        >
                            {level}
                        </span>
                    </div>

                    {/* Phase breadcrumb */}
                    <div
                        style={{
                            fontSize: '13px',
                            color: '#475569',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            marginBottom: '20px',
                        }}
                    >
                        {phaseLabel}
                    </div>

                    {/* Main title */}
                    <div
                        style={{
                            fontSize: title.length > 40 ? '44px' : '56px',
                            fontWeight: 900,
                            color: '#f8fafc',
                            lineHeight: 1.05,
                            letterSpacing: '-0.02em',
                            textTransform: 'uppercase',
                            flex: 1,
                        }}
                    >
                        {title}
                    </div>

                    {/* Bottom bar */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                            paddingTop: '24px',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '13px',
                                color: '#e08a5e',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                fontWeight: 700,
                            }}
                        >
                            System Design Mastery
                        </span>
                        <span
                            style={{
                                fontSize: '12px',
                                color: '#334155',
                                letterSpacing: '0.1em',
                            }}
                        >
                            /topic/{topicId}
                        </span>
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}

export async function generateStaticParams() {
    const paths = courseData.flatMap(phase =>
        phase.topics.map(topic => ({
            id: topic.id,
        }))
    );
    return paths;
}
