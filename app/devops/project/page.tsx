import { BorderCross } from '@/components/course/border-cross';
import { SubHeader } from '@/components/course/sub-header';
import { IslandToursArchitecture } from '@/components/course/topics/island-tours/architecture';
import { ModeToggle } from '@/components/mode-toggle';
import type { Metadata } from 'next';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'The Project: Island Tours',
    description:
        'পুরো DevOps ট্র্যাকে যে প্রজেক্টটাকে উদাহরণ হিসেবে ব্যবহার করা হয়। Island Tours কী, তার Architecture কেমন, আর তুমি নিজের ভার্সন কীভাবে বানাবে।',
    alternates: { canonical: '/devops/project' },
    openGraph: {
        title: 'The Project: Island Tours',
        description:
            'The real production app this track dissects, and the spec you rebuild alongside it.',
        url: '/devops/project',
        type: 'article',
        images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Island Tours' }],
    },
};

const COMPONENTS = [
    {
        name: 'Cloudflare',
        why: 'Domain এর DNS এখানে। ছবি আর Static ফাইল Edge থেকে সার্ভ হয়, তাই ইউজারের কাছে দ্রুত পৌঁছায়।',
        module: 'Module 03, 09',
    },
    {
        name: 'Vercel',
        why: 'Next.js Frontend এখানে চলে। Build, Preview আর Rollback একদম সহজ।',
        module: 'Module 09',
    },
    {
        name: 'Hostinger VPS',
        why: 'Backend নিজের হাতে চালানোর জায়গা। Linux, Firewall, SSH সব এখানেই শেখা হয়।',
        module: 'Module 06',
    },
    {
        name: 'Caddy',
        why: 'বাইরের Request প্রথমে এখানে আসে। HTTPS Certificate নিজে থেকে নিয়ে আসে আর নবীকরণ করে।',
        module: 'Module 08',
    },
    {
        name: 'Docker',
        why: 'API, Database আর Cache আলাদা Container-এ চলে, তাই একটার সমস্যায় অন্যটা ভাঙে না।',
        module: 'Module 07',
    },
    {
        name: 'NestJS API',
        why: 'Booking, Payment আর Auth এর সব লজিক এখানে। Frontend শুধু এই API-র সাথে কথা বলে।',
        module: 'Module 09 (Backend Architecture)',
    },
    {
        name: 'PostgreSQL',
        why: 'Tour, Booking আর User এর আসল Data এখানে জমা থাকে।',
        module: 'Module 14',
    },
    {
        name: 'Redis',
        why: 'বারবার লাগে এমন Data (Tour list, Session) এখানে রাখা হয়, তাই Database-এ চাপ কমে।',
        module: 'Module 14',
    },
    {
        name: 'GitHub Actions',
        why: 'main-এ Push করলে নিজে থেকে Build হয়, Image তৈরি হয় আর VPS-এ Deploy হয়।',
        module: 'Module 15',
    },
];

const MILESTONES = [
    {
        module: 'Module 01 থেকে 05',
        build: 'কিছু বানানোর দরকার নেই। শুধু Browser এর Network tab খুলে দেখো তোমার প্রিয় সাইটে কী কী Request যায়।',
    },
    {
        module: 'Module 06',
        build: 'একটা VPS নাও (সবচেয়ে ছোটটাই যথেষ্ট)। SSH Key দিয়ে ঢোকো, Firewall চালু করো, একটা নতুন User বানাও।',
    },
    {
        module: 'Module 07',
        build: 'তোমার my-tours API টা Docker-এ চালাও। সাথে PostgreSQL আর Redis Container যোগ করো।',
    },
    {
        module: 'Module 08',
        build: 'Caddy বসাও, নিজের একটা Domain কিনে HTTPS চালু করো। এখন তোমার API ইন্টারনেটে লাইভ।',
    },
    {
        module: 'Module 09 থেকে 11',
        build: 'Frontend Vercel-এ Deploy করো, ছবি Object Storage-এ রাখো, Auth আর Booking Endpoint লেখো।',
    },
    {
        module: 'Module 15, 16',
        build: 'GitHub Actions দিয়ে Deploy অটোমেট করো, তারপর Log আর Metric বসাও।',
    },
    {
        module: 'Module 17',
        build: 'Island Tours-এর পুরো Architecture এর সাথে নিজের বানানো ভার্সন মিলিয়ে দেখো, কোথায় কী আলাদা করেছ আর কেন।',
    },
];

const ENTITIES = [
    { name: 'Tour', fields: 'title, slug, description, price, images, seats, location' },
    { name: 'Booking', fields: 'tourId, userId, date, seats, status, amount' },
    { name: 'User', fields: 'name, email, passwordHash, role' },
    { name: 'Payment', fields: 'bookingId, provider, providerRef, amount, status' },
];

export default function IslandToursProjectPage() {
    return (
        <div className='min-h-screen bg-background relative overflow-clip'>
            <div
                className='fixed inset-0 pointer-events-none opacity-30 dark:opacity-20'
                style={{
                    backgroundImage: `linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`,
                    backgroundSize: '48px 48px',
                }}
            />

            <main className='max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-6 xl:px-10 pt-10 md:pt-16 pb-10 relative z-10'>
                <Link
                    href='/devops'
                    className='inline-flex items-center gap-2 mb-10 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors'>
                    <ArrowLeft className='w-3 h-3' />
                    Back to Track
                </Link>

                <BorderCross className='py-12 md:py-20 px-4 md:px-10 bg-primary/5 dark:bg-black/40'>
                    <SubHeader index='000' title='The Project' className='mb-8' />
                    <h1 className='text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[1.05] break-words mb-8'>
                        Island Tours
                    </h1>
                    <div className='max-w-3xl space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed font-medium'>
                        <p>
                            এই ট্র্যাকের প্রতিটা লেসনে একটা প্রশ্ন ফিরে আসবে,
                            বাস্তবে এটা কোথায় লাগে? সেই উত্তরটা দেওয়ার জন্যই একটা
                            সত্যিকারের প্রজেক্ট দরকার। Island Tours হলো সেই
                            প্রজেক্ট।
                        </p>
                        <p>
                            এটা একটা ট্যুর বুকিং অ্যাপ। ইউজার সাইটে ঢুকে ট্যুর
                            খোঁজে, একটা পছন্দ করে, তারিখ দিয়ে সিট বুক করে, তারপর
                            পেমেন্ট করে। শুনতে সাধারণ, কিন্তু এই সাধারণ কাজটা
                            ঠিকঠাক চালাতে গিয়ে DNS থেকে Database পর্যন্ত পুরো
                            Infrastructure দরকার হয়।
                        </p>
                        <p className='text-foreground'>
                            গুরুত্বপূর্ণ কথা: এটা আমাদের নিজেদের একটা লাইভ
                            প্রজেক্ট, তাই এর Code তোমার হাতে থাকবে না। আমরা এর
                            Architecture পড়ব, সিদ্ধান্তগুলো বুঝব, আর তুমি একই
                            জিনিসের নিজের একটা ভার্সন বানাবে। নাম দাও{' '}
                            <strong className='font-mono'>my-tours</strong>।
                        </p>
                    </div>
                </BorderCross>

                {/* Architecture */}
                <section className='mt-20 md:mt-28'>
                    <div className='mb-8 px-2 md:px-5'>
                        <SubHeader index='001' title='Architecture' className='mb-4' />
                        <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                            একটা Request কোথায় কোথায় যায়
                        </h2>
                    </div>
                    <BorderCross className='px-2 md:px-6'>
                        <IslandToursArchitecture />
                    </BorderCross>
                </section>

                {/* Why each box */}
                <section className='mt-20 md:mt-28'>
                    <div className='mb-8 px-2 md:px-5'>
                        <SubHeader index='002' title='Every Component' className='mb-4' />
                        <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                            এই Component টা কেন এখানে
                        </h2>
                        <p className='mt-4 max-w-3xl text-sm md:text-base text-muted-foreground leading-relaxed'>
                            Architecture Diagram মুখস্থ করার জিনিস না। প্রতিটা
                            বাক্স একটা নির্দিষ্ট সমস্যার উত্তর। ডান পাশে লেখা আছে
                            কোন মডিউলে সেই সমস্যাটা নিয়ে বসব।
                        </p>
                    </div>
                    <BorderCross>
                        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 border-t border-l border-border'>
                            {COMPONENTS.map(c => (
                                <div
                                    key={c.name}
                                    className='p-6 md:p-8 border-r border-b border-border bg-card hover:bg-primary/5 dark:hover:bg-white/2 transition-colors'>
                                    <h3 className='font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-primary mb-3'>
                                        {c.name}
                                    </h3>
                                    <p className='text-sm text-muted-foreground leading-relaxed mb-4'>
                                        {c.why}
                                    </p>
                                    <span className='font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60'>
                                        {c.module}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </BorderCross>
                </section>

                {/* Your version */}
                <section className='mt-20 md:mt-28'>
                    <div className='mb-8 px-2 md:px-5'>
                        <SubHeader index='003' title='Your Version' className='mb-4' />
                        <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                            my-tours: তুমি যেটা বানাবে
                        </h2>
                        <p className='mt-4 max-w-3xl text-sm md:text-base text-muted-foreground leading-relaxed'>
                            পড়া আর করা এক জিনিস না। তাই ট্র্যাক জুড়ে প্রতিটা
                            Assignment তোমার নিজের প্রজেক্টের একটা অংশ বানাবে।
                            শেষে তোমার হাতে একটা সত্যিকারের Deploy করা System
                            থাকবে, শুধু কিছু নোট নয়।
                        </p>
                    </div>

                    <BorderCross>
                        <div className='border-t border-l border-border'>
                            {MILESTONES.map(m => (
                                <div
                                    key={m.module}
                                    className='grid grid-cols-1 md:grid-cols-[13rem_1fr] border-r border-b border-border'>
                                    <div className='px-6 py-4 bg-muted/30 border-b md:border-b-0 md:border-r border-border'>
                                        <span className='font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-primary'>
                                            {m.module}
                                        </span>
                                    </div>
                                    <div className='px-6 py-4 flex items-start gap-3 bg-card'>
                                        <Check className='w-4 h-4 text-accent shrink-0 mt-0.5' />
                                        <p className='text-sm text-muted-foreground leading-relaxed'>
                                            {m.build}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </BorderCross>
                </section>

                {/* Data model */}
                <section className='mt-20 md:mt-28'>
                    <div className='mb-8 px-2 md:px-5'>
                        <SubHeader index='004' title='The Spec' className='mb-4' />
                        <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                            চারটা Table দিয়েই শুরু হয়
                        </h2>
                    </div>
                    <BorderCross>
                        <div className='border-t border-l border-border'>
                            {ENTITIES.map(e => (
                                <div
                                    key={e.name}
                                    className='grid grid-cols-1 md:grid-cols-[10rem_1fr] border-r border-b border-border'>
                                    <div className='px-6 py-4 bg-muted/30 border-b md:border-b-0 md:border-r border-border'>
                                        <span className='font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-primary'>
                                            {e.name}
                                        </span>
                                    </div>
                                    <div className='px-6 py-4 bg-card'>
                                        <code className='font-mono text-xs text-muted-foreground break-words'>
                                            {e.fields}
                                        </code>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </BorderCross>
                    <p className='mt-6 px-2 md:px-5 text-sm text-muted-foreground leading-relaxed max-w-3xl'>
                        এর বেশি কিছু শুরুতে দরকার নেই। Review, Coupon, Wishlist
                        সব পরে যোগ করা যাবে। আগে এই চারটা দিয়ে একটা Booking
                        সম্পূর্ণ করে দেখাও।
                    </p>
                </section>

                <BorderCross>
                    <footer className='py-10 border-t border-border mt-20'>
                        <div className='flex items-center'>
                            <ModeToggle />
                            <p className='flex-1 text-center font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]'>
                                <Link
                                    href='/devops'
                                    className='text-primary hover:text-foreground transition-colors'>
                                    Back to the track
                                </Link>
                            </p>
                            <div className='w-8' />
                        </div>
                    </footer>
                </BorderCross>
            </main>
        </div>
    );
}
