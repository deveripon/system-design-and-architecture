import type { Metadata } from 'next';
import { BorderCross } from '@/components/course/border-cross';
import { Reveal } from '@/components/motion/reveal';
import { Roadmap } from '@/components/course/roadmap';
import { SubHeader } from '@/components/course/sub-header';
import { TrackGrid } from '@/components/course/track-grid';
import { ExploreButton } from '@/components/explore-button';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';

export const metadata: Metadata = {
    title: 'System Design Mastery: Master the Architecture of Scale',
    description:
        'A free, battle-tested system design curriculum in Bengali. Learn scalability, distributed systems, cloud architecture, microservices, and crack any system design interview. 29 in-depth topics.',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'System Design Mastery: Master the Architecture of Scale',
        description:
            'A free, battle-tested system design curriculum. 29 deep-dive topics covering scalability, cloud, microservices, and real-world system design case studies.',
        url: '/',
        type: 'website',
        images: [
            {
                url: '/og-default.png',
                width: 1200,
                height: 630,
                alt: 'System Design Mastery',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'System Design Mastery: Master the Architecture of Scale',
        description:
            'A free, battle-tested system design curriculum. 29 deep-dive topics covering scalability, cloud, microservices, and real-world system design case studies.',
        images: ['/og-default.png'],
    },
};

export default function Home() {
    return (
        <div className='min-h-screen bg-background relative overflow-clip'>
            {/* Grid background */}
            <div
                className='fixed inset-0 pointer-events-none opacity-30 dark:opacity-20'
                style={{
                    backgroundImage: `linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`,
                    backgroundSize: '48px 48px',
                }}
            />

            <SiteHeader />

            <main className='max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-6 xl:px-10 pt-16 md:pt-24 pb-10 relative z-10'>
                {/* Cool Hero Section with Stars */}
                <BorderCross className='bg-primary/5 dark:bg-black/60 py-16 md:py-32 overflow-hidden'>
                    <div className='absolute inset-0 animate-stars' />
                    <div className='absolute inset-0 animate-stars-slow' />
                    <div className='absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent' />

                    <div className='relative max-w-4xl mx-auto text-center px-4 md:px-6'>
                        <SubHeader
                            index='001'
                            title='System Design Mastery'
                            className='justify-center mb-10'
                        />

                        <h1 className='text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 md:mb-10 leading-[0.85] text-foreground dark:text-white'>
                            Master the <br />
                            <span className='text-primary italic'>
                                Architecture
                            </span>{' '}
                            <br />
                            of Scale
                        </h1>

                        <p className='text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium'>
                            A battle-tested curriculum designed for engineers to
                            build distributed systems that never fail.
                        </p>

                        <div className='mt-16'>
                            <ExploreButton />
                        </div>
                    </div>
                </BorderCross>

                {/* Tracks */}
                <Reveal>
                <section className='mt-24 md:mt-40'>
                    <div className='mb-10 md:mb-16 px-2 md:px-5'>
                        <SubHeader
                            index='002'
                            title='Curriculum Tracks'
                            className='mb-4'
                        />
                        <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                            Pick Your Path
                        </h2>
                    </div>
                    <BorderCross>
                        <TrackGrid />
                    </BorderCross>
                </section>
                </Reveal>

                {/* Curriculum Section */}
                <Reveal>
                <section id='roadmap' className='mb-24 md:mb-40 mt-24 md:mt-40'>
                    <div className='mb-10 md:mb-16 px-2 md:px-5'>
                        <SubHeader
                            index='003'
                            title='Full Curriculum'
                            className='mb-4'
                        />
                        <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                            The Learning Path
                        </h2>
                    </div>
                    <BorderCross>
                        <Roadmap />
                    </BorderCross>
                </section>
                </Reveal>

                {/* Interview Section */}
                <Reveal>
                <section className='mb-24 md:mb-40'>
                    <div className='mb-10 md:mb-16 px-2 md:px-5'>
                        <SubHeader
                            index='004'
                            title='Interview Framework'
                            className='mb-4'
                        />
                        <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                            How to Crack Any Interview
                        </h2>
                    </div>
                    <BorderCross>
                        <div className='grid grid-cols-1 md:grid-cols-3'>
                            {[
                                {
                                    title: 'Requirements First',
                                    desc: "Don't jump to architecture. Clarify functional and non-functional requirements in the first 5 minutes.",
                                },
                                {
                                    title: 'Trade-off Analysis',
                                    desc: 'Every design choice has a cost. Discuss CAP theorem, latency vs consistency, and cost vs scale.',
                                },
                                {
                                    title: 'Iterative Approach',
                                    desc: 'Start with a simple monolith, then scale specific components as bottlenecks are identified.',
                                },
                            ].map((tip, idx) => (
                                <div
                                    key={tip.title}
                                    className='p-6 md:p-12 border-r border-b border-border bg-muted/5 hover:bg-primary/5 dark:hover:bg-white/2 transition-colors last:border-r-0 md:even:border-r-border'>
                                    <span className='font-mono text-[10px] text-muted-foreground/40 mb-6 block font-black'>
                                        0{idx + 1}
                                    </span>
                                    <h3 className='text-sm font-black uppercase tracking-widest text-primary mb-4'>
                                        {tip.title}
                                    </h3>
                                    <p className='text-sm text-muted-foreground leading-relaxed font-medium'>
                                        {tip.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </BorderCross>
                </section>
                </Reveal>
            </main>

            <SiteFooter />
        </div>
    );
}

