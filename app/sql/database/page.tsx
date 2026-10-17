import { BorderCross } from '@/components/course/border-cross';
import { CodeBlock } from '@/components/course/code-block';
import { SqlPlayground } from '@/components/course/sql/sql-playground';
import { SubHeader } from '@/components/course/sub-header';
import { IslandToursDatabaseDiagram } from '@/components/course/topics/island-tours/database-diagram';
import { Reveal } from '@/components/motion/reveal';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { ISLAND_TOURS_TABLES } from '@/lib/sql/island-tours-schema';
import { SAMPLE_DATABASE_PATH } from '@/lib/sql/playground-config';
import { toBn } from '@/lib/utils';
import type { Metadata } from 'next';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'The Island Tours Database',
    description:
        'SQL ট্র্যাকের প্রতিটা উদাহরণ যে Sample Database এ চলে: আটটা Table, তাদের সম্পর্ক, প্রতিটা Column এর মানে, আর নিজের PostgreSQL এ Load করার উপায়।',
    alternates: { canonical: '/sql/database' },
    openGraph: {
        title: 'The Island Tours Database',
        description:
            'The sample PostgreSQL database every SQL lesson runs on: eight tables, their relationships, and how to load it.',
        url: '/sql/database',
        type: 'article',
        images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Island Tours Database' }],
    },
};

/** The odd cases planted in the data on purpose, and where each one teaches something. */
const PLANTED = [
    {
        what: 'Imran Kabir এখনো কিছু বুক করেননি',
        why: 'LEFT JOIN আর NOT EXISTS এ দেখবেন, কোন Customer এর একটাও Booking নেই।',
        where: 'Module 06',
    },
    {
        what: 'Kuakata তে কোনো ট্যুর নেই',
        why: 'যে Destination এর সাথে কিছুই মেলে না, INNER JOIN তাকে হারিয়ে ফেলে, LEFT JOIN রাখে।',
        where: 'Module 06',
    },
    {
        what: 'Ratargul Swamp Boat Day এর Guide নেই',
        why: 'guide_id হলো NULL। NULL এর সাথে তুলনা কেন অদ্ভুত আচরণ করে, সেটা এখানেই ধরা পড়ে।',
        where: 'Module 03',
    },
    {
        what: 'Cox\'s Bazar Family Package এর কোনো তারিখ নেই',
        why: 'বিক্রির জন্য আছে, কিন্তু Departure নেই। Data তে ফাঁক খোঁজার অনুশীলন।',
        where: 'Module 07',
    },
    {
        what: 'Saint Martin Luxury Stay বন্ধ, তবু একটা তারিখ আছে',
        why: 'is_active false। শুধু চালু ট্যুর দেখাতে ভুলে গেলে Report কীভাবে ভুল হয়।',
        where: 'Module 03',
    },
    {
        what: 'তিনটা Booking cancelled, চারটা pending',
        why: 'আয়ের হিসাবে কোনটা গুনবেন আর কোনটা না, Conditional Aggregation এর আসল প্রশ্ন।',
        where: 'Module 05',
    },
    {
        what: 'একটা Payment refunded, একটা failed',
        why: 'Booking আর Payment এর হিসাব মেলানো, আর টাকার Table কেন কখনো মুছে ফেলা হয় না।',
        where: 'Module 10',
    },
    {
        what: 'পাঁচজন Customer এর ফোন নম্বর নেই, দুটো Review এ মন্তব্য নেই',
        why: 'COALESCE দিয়ে খালি জায়গায় বিকল্প লেখা বসানো।',
        where: 'Module 04',
    },
];

export default function SqlDatabasePage() {
    return (
        <div className='min-h-screen bg-background relative overflow-clip'>
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
                    href='/sql'
                    className='inline-flex items-center gap-2 mb-10 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors'>
                    <ArrowLeft className='w-3 h-3' />
                    SQL Track
                </Link>

                <BorderCross className='p-6 md:p-12'>
                    <SubHeader index='REF' title='Sample Database' className='mb-8' />
                    <h1 className='text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-[0.95]'>
                        The Island Tours <span className='text-primary italic'>Database</span>
                    </h1>
                    <p className='max-w-3xl text-base md:text-lg text-muted-foreground leading-relaxed'>
                        Island Tours বাংলাদেশের একটা ট্যুর বুকিং কোম্পানি। Customer
                        Website এ এসে একটা ট্যুর বেছে নেন, একটা তারিখে সিট বুক করেন,
                        bKash বা Card এ টাকা দেন, আর ঘুরে এসে Review লেখেন। এই ছোট
                        ব্যবসাটা চালাতে যে Data লাগে, সেটাই এই Database। এই ট্র্যাকের
                        প্রতিটা উদাহরণ, প্রতিটা Query বক্স আর প্রতিটা Assignment এই
                        Data তেই চলে, তাই একবার চিনে নিলে আর কখনো নতুন করে চিনতে হবে না।
                    </p>
                    <p className='mt-4 max-w-3xl text-sm text-muted-foreground leading-relaxed'>
                        সব নাম, Email আর ফোন নম্বর বানানো। Email গুলো <code className='font-mono'>mail.example</code> এর,
                        যেটা কখনো সত্যিকারের ঠিকানা হতে পারে না।
                    </p>
                </BorderCross>

                <Reveal>
                    <section className='mt-16 md:mt-24'>
                        <div className='mb-6 px-2 md:px-5'>
                            <SubHeader index='001' title='The Tables' className='mb-4' />
                            <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                                {toBn(ISLAND_TOURS_TABLES.length)}টা Table, একটা ব্যবসা
                            </h2>
                        </div>
                        <IslandToursDatabaseDiagram />
                    </section>
                </Reveal>

                <Reveal>
                    <section className='mt-16 md:mt-24'>
                        <div className='mb-6 px-2 md:px-5'>
                            <SubHeader index='002' title='Try It' className='mb-4' />
                            <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                                এখনই একটা Query চালান
                            </h2>
                            <p className='mt-4 max-w-3xl text-sm md:text-base text-muted-foreground leading-relaxed'>
                                নিচের বক্সে আসল PostgreSQL চলছে, আপনার Browser এর ভেতরেই।
                                Run চাপলে সবচেয়ে দামি তিনটা ট্যুর দেখতে পাবেন। Table এর নাম
                                বদলে <code className='font-mono'>customers</code> বা{' '}
                                <code className='font-mono'>bookings</code> লিখে দেখুন।
                            </p>
                        </div>
                        <SqlPlayground
                            title='Island Tours'
                            query={`SELECT title, price_bdt, duration_days
FROM tours
ORDER BY price_bdt DESC
LIMIT 3;`}
                        />
                    </section>
                </Reveal>

                <Reveal>
                    <section className='mt-16 md:mt-24'>
                        <div className='mb-6 px-2 md:px-5'>
                            <SubHeader index='003' title='Every Column' className='mb-4' />
                            <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                                প্রতিটা Column এর মানে
                            </h2>
                        </div>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-px bg-border border border-border'>
                            {ISLAND_TOURS_TABLES.map(table => (
                                <div key={table.name} id={`table-${table.name}`} className='bg-card p-5 md:p-7 scroll-mt-24'>
                                    <h3 className='font-mono text-sm font-bold text-primary mb-2'>{table.name}</h3>
                                    <p className='text-sm text-muted-foreground leading-relaxed mb-4'>{table.about}</p>
                                    <dl className='divide-y divide-border/60 border-t border-border/60'>
                                        {table.columns.map(column => (
                                            <div key={column.name} className='grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-3 py-2'>
                                                <dt className='min-w-0'>
                                                    <span className='block font-mono text-[0.75rem] text-foreground break-words'>
                                                        {column.name}
                                                    </span>
                                                    <span className='block font-mono text-[0.625rem] text-muted-foreground'>
                                                        {column.type}
                                                        {column.key && <span className='ml-1.5 text-primary font-bold'>{column.key}</span>}
                                                    </span>
                                                </dt>
                                                <dd className='text-[0.8125rem] text-muted-foreground leading-relaxed'>
                                                    {column.note}
                                                    {column.references && (
                                                        <a href={`#table-${column.references}`} className='ml-1 font-mono text-[0.6875rem] text-primary hover:underline'>
                                                            → {column.references}
                                                        </a>
                                                    )}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            ))}
                        </div>
                    </section>
                </Reveal>

                <Reveal>
                    <section className='mt-16 md:mt-24'>
                        <div className='mb-6 px-2 md:px-5'>
                            <SubHeader index='004' title='Planted on Purpose' className='mb-4' />
                            <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                                ইচ্ছা করে রাখা অদ্ভুত Data
                            </h2>
                            <p className='mt-4 max-w-3xl text-sm md:text-base text-muted-foreground leading-relaxed'>
                                সত্যিকারের Database কখনো পরিপাটি থাকে না। তাই এই Data তে কিছু
                                অসম্পূর্ণ আর বেমানান Row ইচ্ছা করে রাখা হয়েছে। প্রতিটা একটা
                                নির্দিষ্ট ভুল ধরিয়ে দেওয়ার জন্য, যে ভুল বাস্তবে Report কে চুপচাপ
                                ভুল করে দেয়।
                            </p>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border'>
                            {PLANTED.map(item => (
                                <div key={item.what} className='bg-card p-5 md:p-6'>
                                    <span className='font-mono text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-primary'>
                                        {item.where}
                                    </span>
                                    <p className='mt-2 text-sm font-bold'>{item.what}</p>
                                    <p className='mt-1 text-sm text-muted-foreground leading-relaxed'>{item.why}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </Reveal>

                <Reveal>
                    <section className='mt-16 md:mt-24'>
                        <div className='mb-6 px-2 md:px-5'>
                            <SubHeader index='005' title='Load It Yourself' className='mb-4' />
                            <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter'>
                                নিজের PostgreSQL এ Load করা
                            </h2>
                            <p className='mt-4 max-w-3xl text-sm md:text-base text-muted-foreground leading-relaxed'>
                                পুরো Database একটা ফাইলে: আগে সব Table মুছে নতুন করে বানায়,
                                তারপর Data ঢোকায়। তাই যতবার খুশি আবার চালাতে পারবেন, প্রতিবার
                                একদম শুরুর অবস্থায় ফিরে যাবে। PostgreSQL ইনস্টল করা Module 02 তে
                                ধাপে ধাপে দেখানো আছে। ইনস্টল হয়ে গেলে Terminal এ এই দুটো লাইন
                                চালান।
                            </p>
                        </div>
                        <BorderCross className='p-5 md:p-8'>
                            <a
                                href={SAMPLE_DATABASE_PATH}
                                download
                                className='inline-flex items-center gap-2 border border-primary bg-primary px-4 py-2.5 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-primary-foreground hover:opacity-90 transition-opacity'>
                                <Download className='h-4 w-4' />
                                island-tours.sql
                            </a>
                            <CodeBlock
                                language='bash'
                                filename='terminal'
                                code={`createdb island_tours
psql -d island_tours -f island-tours.sql`}
                            />
                            <p className='text-sm text-muted-foreground leading-relaxed'>
                                ফাইলটা PostgreSQL এর জন্য লেখা। MySQL এ কয়েকটা Type আর লেখার
                                নিয়ম আলাদা, তাই হুবহু চলবে না। MySQL এ কীভাবে চালাবেন, সেটা
                                Module 02 এর MySQL লেসনে দেখানো হবে।
                            </p>
                        </BorderCross>
                    </section>
                </Reveal>
            </main>

            <SiteFooter />
        </div>
    );
}
