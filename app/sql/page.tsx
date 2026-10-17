import { BorderCross } from '@/components/course/border-cross';
import { Reveal } from '@/components/motion/reveal';
import { SqlRoadmap } from '@/components/course/sql-roadmap';
import { SubHeader } from '@/components/course/sub-header';
import { ExploreButton } from '@/components/explore-button';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { sqlCourseData, sqlLessons, sqlTrack } from '@/lib/sql-course-data';
import { toBn } from '@/lib/utils';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Check, Database } from 'lucide-react';
import Link from 'next/link';

const lessonCount = sqlLessons.length;
const moduleCount = sqlCourseData.length;

export const metadata: Metadata = {
    title: `${sqlTrack.title}: ${sqlTrack.subtitle}`,
    description: `শূন্য থেকে Production Database পর্যন্ত। ${lessonCount}টি লেসনে SELECT, Join, Database Design, Transaction, Index, Security আর Scaling। PostgreSQL দিয়ে, MySQL এর পার্থক্যসহ, বাংলায়।`,
    alternates: { canonical: '/sql' },
    openGraph: {
        title: `${sqlTrack.title}: ${sqlTrack.subtitle}`,
        description: `${lessonCount} lessons from your first SELECT to production PostgreSQL: joins, design, transactions, indexes, security and scaling.`,
        url: '/sql',
        type: 'website',
        images: [
            {
                url: '/og-default.png',
                width: 1200,
                height: 630,
                alt: sqlTrack.title,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${sqlTrack.title}: ${sqlTrack.subtitle}`,
        description: `${lessonCount} lessons from zero to production databases.`,
        images: ['/og-default.png'],
    },
};

export default function SqlTrackPage() {
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

            <SiteHeader />

            <main className='max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-6 xl:px-10 pt-10 md:pt-16 pb-10 relative z-10'>
                <Link
                    href='/'
                    className='inline-flex items-center gap-2 mb-10 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors'>
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
                            title={sqlTrack.badge}
                            className='justify-center mb-10'
                        />

                        <h1 className='text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.85]'>
                            SQL &amp;{' '}
                            <span className='text-primary italic'>
                                Database
                            </span>{' '}
                            <br />
                            Mastery
                        </h1>

                        <p className='text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium'>
                            {sqlTrack.subtitle}। {toBn(lessonCount)}টি
                            লেসন, {toBn(moduleCount)}টি মডিউল।
                        </p>

                        <div className='mt-14'>
                            <ExploreButton />
                        </div>
                    </div>
                </BorderCross>

                {/* The project this track is built around */}
                <Reveal>
                <section className='mt-16 md:mt-24'>
                    <BorderCross>
                        <Link
                            href='/sql/database'
                            className='group flex flex-col md:flex-row md:items-center gap-5 md:gap-8 p-6 md:p-10 border border-border bg-card hover:bg-primary/5 dark:hover:bg-white/2 transition-colors'>
                            <span className='w-12 h-12 border border-border bg-background flex items-center justify-center shrink-0'>
                                <Database className='w-6 h-6 text-primary' />
                            </span>
                            <span className='flex-1'>
                                <span className='block font-mono text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-primary mb-2'>
                                    The Sample Database
                                </span>
                                <span className='block text-lg md:text-xl font-black uppercase tracking-tighter mb-2 group-hover:text-primary transition-colors'>
                                    Island Tours Database
                                </span>
                                <span className='block text-sm text-muted-foreground leading-relaxed max-w-2xl'>
                                    পুরো ট্র্যাকের প্রতিটা Query একটা ট্যুর বুকিং
                                    ব্যবসার Database এ চলে: আটটা Table, Customer
                                    থেকে Payment পর্যন্ত। এখানে দেখুন কোন Table এ
                                    কী আছে, আর এখনই প্রথম Query চালিয়ে দেখুন।
                                </span>
                            </span>
                            <ArrowRight className='w-4 h-4 text-primary shrink-0 group-hover:translate-x-0.5 transition-transform' />
                        </Link>
                    </BorderCross>
                </section>
                </Reveal>

                {/* Why this track */}
                <Reveal>
                <section className='mt-20 md:mt-32'>
                    <div className='mb-10 md:mb-14 px-2 md:px-5'>
                        <SubHeader
                            index='002'
                            title='The Goal'
                            className='mb-4'
                        />
                        <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                            শেষ করলে কী পারবেন
                        </h2>
                    </div>

                    <BorderCross>
                        <div className='p-6 md:p-10 border border-border bg-card/50 mb-px'>
                            <p className='text-base md:text-lg leading-relaxed text-muted-foreground font-medium max-w-4xl'>
                                {sqlTrack.description}
                            </p>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 border-t border-l border-border'>
                            {sqlTrack.goals.map(goal => (
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
                </Reveal>

                {/* How a lesson is structured */}
                <Reveal>
                <section className='mt-20 md:mt-32'>
                    <div className='mb-10 md:mb-14 px-2 md:px-5'>
                        <SubHeader
                            index='003'
                            title='How You Practise'
                            className='mb-4'
                        />
                        <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                            কীভাবে হাতে কলমে শিখবেন
                        </h2>
                    </div>

                    <BorderCross>
                        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 border-t border-l border-border'>
                            {sqlTrack.practice.map((step, idx) => (
                                <div
                                    key={step.title}
                                    className='p-6 md:p-8 border-r border-b border-border bg-card hover:bg-primary/5 dark:hover:bg-white/2 transition-colors group'>
                                    <span className='font-mono text-[0.625rem] text-muted-foreground/50 font-black block mb-5'>
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
                </Reveal>

                {/* Curriculum */}
                <Reveal>
                <section id='roadmap' className='mt-20 md:mt-32'>
                    <div className='mb-10 md:mb-14 px-2 md:px-5'>
                        <SubHeader
                            index='004'
                            title='Full Curriculum'
                            className='mb-4'
                        />
                        <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                            {toBn(moduleCount)}টি মডিউল, {toBn(lessonCount)}টি
                            লেসন
                        </h2>
                    </div>
                    <BorderCross>
                        <SqlRoadmap />
                    </BorderCross>
                </section>
                </Reveal>

                {/* Outcome */}
                <Reveal>
                <section className='mt-20 md:mt-32'>
                    <div className='mb-10 md:mb-14 px-2 md:px-5'>
                        <SubHeader
                            index='005'
                            title='Final Outcome'
                            className='mb-4'
                        />
                        <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                            যেখানে গিয়ে দাঁড়াবেন
                        </h2>
                    </div>
                    <BorderCross>
                        <div className='grid grid-cols-1 md:grid-cols-2 border-t border-l border-border'>
                            {sqlTrack.outcomes.map((outcome, idx) => (
                                <div
                                    key={outcome}
                                    className='flex items-start gap-4 p-6 md:p-10 border-r border-b border-border bg-muted/5'>
                                    <span className='font-mono text-[0.625rem] font-black text-primary mt-1'>
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
                </Reveal>

            </main>

            <SiteFooter />
        </div>
    );
}
