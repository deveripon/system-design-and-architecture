import { BorderCross } from '@/components/course/border-cross';
import { DevopsRoadmap } from '@/components/course/devops-roadmap';
import { SubHeader } from '@/components/course/sub-header';
import { ExploreButton } from '@/components/explore-button';
import { ModeToggle } from '@/components/mode-toggle';
import { devopsCourseData, devopsLessons, devopsTrack } from '@/lib/devops-course-data';
import { toBn } from '@/lib/utils';
import type { Metadata } from 'next';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

const lessonCount = devopsLessons.length;
const moduleCount = devopsCourseData.length;

export const metadata: Metadata = {
    title: `${devopsTrack.title} — ${devopsTrack.subtitle}`,
    description: `Browser থেকে Production Infrastructure — ${lessonCount}টি লেসনে DNS, TCP/IP, HTTP, Linux, Docker, Reverse Proxy, CI/CD আর Cloud Infrastructure। বাংলায় সম্পূর্ণ DevOps কারিকুলাম।`,
    alternates: { canonical: '/devops' },
    openGraph: {
        title: `${devopsTrack.title} — ${devopsTrack.subtitle}`,
        description: `${lessonCount} lessons covering the internet, networking, Linux, Docker, reverse proxies, CI/CD and production infrastructure.`,
        url: '/devops',
        type: 'website',
        images: [
            {
                url: '/og-default.png',
                width: 1200,
                height: 630,
                alt: devopsTrack.title,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${devopsTrack.title} — ${devopsTrack.subtitle}`,
        description: `${lessonCount} lessons from browser to production infrastructure.`,
        images: ['/og-default.png'],
    },
};

export default function DevopsTrackPage() {
    return (
        <div className='min-h-screen bg-background relative overflow-clip'>
            {/* Blueprint grid background */}
            <div
                className='fixed inset-0 pointer-events-none opacity-30 dark:opacity-20'
                style={{
                    backgroundImage: `linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`,
                    backgroundSize: '48px 48px',
                }}
            />

            <main className='max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-6 xl:px-10 pt-10 md:pt-16 pb-10 relative z-10'>
                <Link
                    href='/'
                    className='inline-flex items-center gap-2 mb-10 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors'>
                    <ArrowLeft className='w-3 h-3' />
                    All Tracks
                </Link>

                {/* Hero */}
                <BorderCross className='bg-primary/5 dark:bg-black/60 py-16 md:py-28 overflow-hidden'>
                    <div className='absolute inset-0 animate-stars' />
                    <div className='absolute inset-0 animate-stars-slow' />
                    <div className='absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent' />

                    <div className='relative max-w-4xl mx-auto text-center px-4 md:px-6'>
                        <SubHeader
                            index='001'
                            title={devopsTrack.badge}
                            className='justify-center mb-10'
                        />

                        <h1 className='text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.85]'>
                            DevOps &amp;{' '}
                            <span className='text-primary italic'>
                                Internet
                            </span>{' '}
                            <br />
                            From Scratch
                        </h1>

                        <p className='text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium'>
                            {devopsTrack.subtitle} — {toBn(lessonCount)}টি
                            লেসন, {toBn(moduleCount)}টি মডিউল।
                        </p>

                        <div className='mt-14'>
                            <ExploreButton />
                        </div>
                    </div>
                </BorderCross>

                {/* Why this track */}
                <section className='mt-20 md:mt-32'>
                    <div className='mb-10 md:mb-14 px-2 md:px-5'>
                        <SubHeader
                            index='002'
                            title='The Goal'
                            className='mb-4'
                        />
                        <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                            শেষ করলে কী পারবে
                        </h2>
                    </div>

                    <BorderCross>
                        <div className='p-6 md:p-10 border border-border bg-card/50 mb-px'>
                            <p className='text-base md:text-lg leading-relaxed text-muted-foreground font-medium max-w-4xl'>
                                {devopsTrack.description}
                            </p>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 border-t border-l border-border'>
                            {devopsTrack.goals.map(goal => (
                                <div
                                    key={goal}
                                    className='flex items-start gap-4 p-6 md:p-8 border-r border-b border-border bg-muted/5 hover:bg-primary/5 dark:hover:bg-white/2 transition-colors'>
                                    <Check className='w-4 h-4 text-primary shrink-0 mt-1' />
                                    <p className='text-sm leading-relaxed font-medium'>
                                        {goal}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </BorderCross>
                </section>

                {/* How a lesson is structured */}
                <section className='mt-20 md:mt-32'>
                    <div className='mb-10 md:mb-14 px-2 md:px-5'>
                        <SubHeader
                            index='003'
                            title='Learning Method'
                            className='mb-4'
                        />
                        <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                            প্রতিটি লেসনের ৮টি ধাপ
                        </h2>
                    </div>

                    <BorderCross>
                        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 border-t border-l border-border'>
                            {devopsTrack.lessonSteps.map((step, idx) => (
                                <div
                                    key={step.title}
                                    className='p-6 md:p-8 border-r border-b border-border bg-card hover:bg-primary/5 dark:hover:bg-white/2 transition-colors group'>
                                    <span className='font-mono text-[10px] text-muted-foreground/50 font-black block mb-5'>
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <h3 className='text-sm font-black uppercase tracking-widest text-primary mb-3 group-hover:text-foreground transition-colors'>
                                        {step.title}
                                    </h3>
                                    <p className='text-xs md:text-sm text-muted-foreground leading-relaxed font-medium'>
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </BorderCross>
                </section>

                {/* What every lesson ships with */}
                <section className='mt-20 md:mt-32'>
                    <div className='mb-10 md:mb-14 px-2 md:px-5'>
                        <SubHeader
                            index='004'
                            title='Every Lesson Ships With'
                            className='mb-4'
                        />
                        <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                            প্রতিটি লেসনে যা যা থাকবে
                        </h2>
                        <p className='mt-4 max-w-3xl text-sm md:text-base text-muted-foreground leading-relaxed font-medium'>
                            কোনো Topic মুখস্থ করার জন্য নয়। প্রতিটি লেসন শুরু হবে
                            গল্প দিয়ে, এমনভাবে লেখা হবে যাতে বিষয়টা সম্পর্কে
                            আগে কিছুই না জানলেও পরিষ্কার বোঝা যায়।
                        </p>
                    </div>

                    <BorderCross>
                        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 border-t border-l border-border'>
                            {devopsTrack.lessonDeliverables.map(item => (
                                <div
                                    key={item}
                                    className='flex items-start gap-4 p-6 md:p-8 border-r border-b border-border bg-card hover:bg-primary/5 dark:hover:bg-white/2 transition-colors'>
                                    <Check className='w-4 h-4 text-accent shrink-0 mt-1' />
                                    <p className='text-sm leading-relaxed font-medium'>
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </BorderCross>
                </section>

                {/* Curriculum */}
                <section id='roadmap' className='mt-20 md:mt-32'>
                    <div className='mb-10 md:mb-14 px-2 md:px-5'>
                        <SubHeader
                            index='005'
                            title='Full Curriculum'
                            className='mb-4'
                        />
                        <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                            {toBn(moduleCount)}টি মডিউল, {toBn(lessonCount)}টি
                            লেসন
                        </h2>
                    </div>
                    <BorderCross>
                        <DevopsRoadmap />
                    </BorderCross>
                </section>

                {/* Outcome */}
                <section className='mt-20 md:mt-32'>
                    <div className='mb-10 md:mb-14 px-2 md:px-5'>
                        <SubHeader
                            index='006'
                            title='Final Outcome'
                            className='mb-4'
                        />
                        <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                            যেখানে গিয়ে দাঁড়াবে
                        </h2>
                    </div>
                    <BorderCross>
                        <div className='grid grid-cols-1 md:grid-cols-2 border-t border-l border-border'>
                            {devopsTrack.outcomes.map((outcome, idx) => (
                                <div
                                    key={outcome}
                                    className='flex items-start gap-4 p-6 md:p-10 border-r border-b border-border bg-muted/5'>
                                    <span className='font-mono text-[10px] font-black text-primary mt-1'>
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <p className='text-sm md:text-base leading-relaxed font-medium'>
                                        {outcome}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </BorderCross>
                </section>

                <BorderCross>
                    <footer className='py-10 border-t border-border mt-20'>
                        <div className='flex items-center'>
                            <ModeToggle />
                            <p className='flex-1 text-center font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]'>
                                © 2026{' '}
                                <a
                                    href='https://github.com/Deveripon'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-primary hover:text-foreground transition-colors'>
                                    devripon
                                </a>{' '}
                                · Build for Scale
                            </p>
                            <div className='w-8' />
                        </div>
                    </footer>
                </BorderCross>
            </main>
        </div>
    );
}
