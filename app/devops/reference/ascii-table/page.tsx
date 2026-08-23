import { AsciiTable } from '@/components/course/ascii-table';
import { BorderCross } from '@/components/course/border-cross';
import { Reveal } from '@/components/motion/reveal';
import { InfoBox } from '@/components/course/info-box';
import { SubHeader } from '@/components/course/sub-header';
import { ModeToggle } from '@/components/mode-toggle';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Full ASCII Table',
    description:
        'সম্পূর্ণ ASCII টেবিল, ০ থেকে ১২৭। প্রতিটা কোডের Decimal, Hex, Binary আর অক্ষর, সাথে Control Character গুলো কী কাজ করে।',
    alternates: { canonical: '/devops/reference/ascii-table' },
    openGraph: {
        title: 'Full ASCII Table',
        description:
            'All 128 ASCII codes with decimal, hex, binary and what each control character actually does.',
        url: '/devops/reference/ascii-table',
        type: 'article',
        images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'ASCII Table' }],
    },
};

export default function AsciiTablePage() {
    return (
        <div className='min-h-screen bg-background relative overflow-clip'>
            <div
                className='fixed inset-0 pointer-events-none opacity-30 dark:opacity-20'
                style={{
                    backgroundImage: `linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`,
                    backgroundSize: '48px 48px',
                }}
            />

            <main className='max-w-6xl mx-auto px-4 md:px-6 xl:px-10 pt-10 md:pt-16 pb-10 relative z-10'>
                <Link
                    href='/devops/topic/binary-and-data'
                    className='inline-flex items-center gap-2 mb-10 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors'>
                    <ArrowLeft className='w-3 h-3' />
                    Binary, Bit and Byte
                </Link>

                <BorderCross className='py-12 md:py-16 px-4 md:px-10 bg-primary/5 dark:bg-black/40'>
                    <SubHeader index='REF' title='Reference' className='mb-8' />
                    <h1 className='text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-[1.05] break-words mb-6'>
                        Full ASCII Table
                    </h1>
                    <div className='max-w-3xl space-y-4 text-base text-muted-foreground leading-relaxed font-medium'>
                        <p>
                            কম্পিউটার অক্ষর চেনে না, সংখ্যা চেনে। তাই একদিন সবাই
                            মিলে ঠিক করা হলো কোন অক্ষরের নম্বর কত হবে। সেই
                            তালিকার নাম ASCII, আর তাতে আছে মোট ১২৮টা কোড।
                        </p>
                        <p>
                            নিচে পুরো তালিকাটা আছে। উপরের ঘরে অক্ষর লিখে, বা
                            সংখ্যা লিখে, বা Hex লিখে খুঁজতে পারেন। যেমন{' '}
                            <strong className='font-mono text-foreground'>A</strong>{' '}
                            লিখলেই দেখবেন তার নম্বর ৬৫।
                        </p>
                    </div>
                </BorderCross>

                <Reveal>
                <section className='mt-16'>
                    <div className='mb-6 px-2 md:px-5'>
                        <SubHeader index='001' title='The Table' className='mb-4' />
                        <h2 className='text-2xl md:text-3xl font-black uppercase tracking-tighter'>
                            ১২৮টা কোড, একসাথে
                        </h2>
                    </div>
                    <BorderCross className='px-3 md:px-8 py-2'>
                        <AsciiTable />
                    </BorderCross>
                </section>
                </Reveal>

                <Reveal>
                <section className='mt-16'>
                    <div className='mb-6 px-2 md:px-5'>
                        <SubHeader index='002' title='Reading It' className='mb-4' />
                        <h2 className='text-2xl md:text-3xl font-black uppercase tracking-tighter'>
                            টেবিলটা দেখে যা যা বোঝা যায়
                        </h2>
                    </div>

                    <div className='px-2 md:px-5 space-y-2'>
                        <InfoBox variant='concept' title='অঙ্কগুলো সাজানো আছে'>
                            <p>
                                অক্ষর ০ এর কোড ৪৮, ১ এর ৪৯, এভাবে ৯ পর্যন্ত।
                                তাই কোনো অঙ্কের কোড থেকে ৪৮ বিয়োগ করলেই আসল
                                সংখ্যাটা পাওয়া যায়। পুরনো কোডে এই কাজটা হাতেই
                                করা হতো।
                            </p>
                        </InfoBox>

                        <InfoBox variant='tip' title='বড় হাতের আর ছোট হাতের তফাত মাত্র ৩২'>
                            <p>
                                A হলো ৬৫, a হলো ৯৭। তফাত ঠিক ৩২, মানে Binary-তে
                                একটাই Bit আলাদা (01000001 আর 01100001)। তাই
                                পুরনো দিনে ছোট হাতের করা মানে ছিল শুধু একটা Bit
                                চালু করে দেওয়া।
                            </p>
                        </InfoBox>

                        <InfoBox variant='warning' title='Control Code গুলো এখনো বেঁচে আছে'>
                            <p>
                                শুরুর ৩২টা কোড ছাপার জন্য না, আদেশ দেওয়ার জন্য।
                                এদের মধ্যে ১০ (LF) আর ১৩ (CR) আজও ঝামেলা করে:
                                Linux নতুন লাইনের জন্য শুধু LF লেখে, Windows লেখে
                                CR আর LF দুইটাই। এই একটা তফাতের কারণেই Git-এ
                                ফাইল বদলে গেছে দেখায়, আর Script চালাতে গিয়ে
                                অদ্ভুত Error আসে।
                            </p>
                        </InfoBox>

                        <InfoBox variant='important' title='১২৭ এর পরে কী'>
                            <p>
                                ASCII শেষ হয় ১২৭-এ, কারণ পুরো তালিকাটা ৭ Bit-এ
                                ধরানোর জন্য বানানো হয়েছিল। বাংলা, চীনা, আরবি বা
                                ইমোজির জায়গা এখানে নেই। সেগুলোর জন্য এসেছে
                                Unicode, আর UTF-8 সেই বড় নম্বরগুলোকে একের বেশি
                                Byte-এ লেখে। তাই বাংলা একটা অক্ষর ৩ Byte নেয়,
                                আর ইমোজি ৪ Byte।
                            </p>
                        </InfoBox>
                    </div>
                </section>
                </Reveal>

                <BorderCross>
                    <div className='mt-16 border border-border bg-card'>
                        <Link
                            href='/devops/topic/binary-and-data'
                            className='group flex items-center gap-5 p-6 md:p-8 hover:bg-primary/5 dark:hover:bg-white/2 transition-colors'>
                            <span className='flex-1'>
                                <span className='block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-primary mb-2'>
                                    Back to the lesson
                                </span>
                                <span className='block text-lg font-black uppercase tracking-tighter group-hover:text-primary transition-colors'>
                                    Binary, Bit and Byte
                                </span>
                            </span>
                            <ArrowRight className='w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform' />
                        </Link>
                    </div>
                </BorderCross>

                <BorderCross>
                    <footer className='py-10 border-t border-border mt-16'>
                        <div className='flex items-center'>
                            <ModeToggle />
                            <p className='flex-1 text-center font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]'>
                                <Link
                                    href='/devops'
                                    className='text-primary hover:text-foreground transition-colors'>
                                    DevOps &amp; Internet From Scratch
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
