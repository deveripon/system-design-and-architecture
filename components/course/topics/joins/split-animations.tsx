'use client';

import { EASE } from '@/components/motion/reveal';
import { cn, toBn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

function Panel({
    label,
    title,
    children,
    footer,
}: {
    label: string;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}) {
    return (
        <figure className='my-10 border border-border bg-card'>
            <figcaption className='flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-3 border-b border-border bg-muted/30'>
                <span className='font-mono text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-primary'>
                    {label}
                </span>
                <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                    {title}
                </span>
            </figcaption>
            <div className='p-5 md:p-8'>{children}</div>
            {footer && (
                <div className='px-5 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground leading-relaxed'>
                    {footer}
                </div>
            )}
        </figure>
    );
}

const BTN = 'px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors text-left';
const BTN_ON = 'border-primary bg-primary/10 text-primary';
const BTN_OFF = 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40';

/* ------------------------------------------------------------------------- */
/* 1. প্রশ্ন থেকে Table এর পথ                                                   */
/* ------------------------------------------------------------------------- */

const TABLES = [
    'customers',
    'bookings',
    'payments',
    'reviews',
    'departures',
    'tours',
    'destinations',
    'guides',
] as const;

type TableName = (typeof TABLES)[number];

interface PathQuestion {
    id: string;
    question: string;
    /** Tables in the order the keys are followed. */
    path: TableName[];
    /** One join condition per hop, in the same order. */
    links: string[];
    why: string;
}

const QUESTIONS: PathQuestion[] = [
    {
        id: 'customer',
        question: 'Booking 13 কে করেছেন?',
        path: ['bookings', 'customers'],
        links: ['bookings.customer_id = customers.customer_id'],
        why: 'নাম থাকে customers এ, Booking এ থাকে শুধু customer_id। একটা তীরই যথেষ্ট।',
    },
    {
        id: 'tour',
        question: 'Booking 13 কোন ট্যুরের?',
        path: ['bookings', 'departures', 'tours'],
        links: ['bookings.departure_id = departures.departure_id', 'departures.tour_id = tours.tour_id'],
        why: 'Booking সরাসরি ট্যুরকে চেনে না, চেনে একটা নির্দিষ্ট তারিখকে। তারিখ চেনে ট্যুরকে। তাই দুই ধাপ।',
    },
    {
        id: 'place',
        question: 'Booking 13 এর যাত্রী কোথায় যাবেন?',
        path: ['bookings', 'departures', 'tours', 'destinations'],
        links: [
            'bookings.departure_id = departures.departure_id',
            'departures.tour_id = tours.tour_id',
            'tours.destination_id = destinations.destination_id',
        ],
        why: 'জায়গার নাম থাকে destinations এ। Booking থেকে সেখানে পৌঁছাতে তিনটা তীর পার হতে হয়।',
    },
    {
        id: 'payer',
        question: 'Payment 5 কার টাকা?',
        path: ['payments', 'bookings', 'customers'],
        links: ['payments.booking_id = bookings.booking_id', 'bookings.customer_id = customers.customer_id'],
        why: 'Payment চেনে Booking কে, Booking চেনে Customer কে। মাঝের Table টা বাদ দেওয়া যায় না।',
    },
    {
        id: 'guide',
        question: 'Review 7 কোন Guide এর ট্যুরের?',
        path: ['reviews', 'bookings', 'departures', 'tours', 'guides'],
        links: [
            'reviews.booking_id = bookings.booking_id',
            'bookings.departure_id = departures.departure_id',
            'departures.tour_id = tours.tour_id',
            'tours.guide_id = guides.guide_id',
        ],
        why: 'সবচেয়ে লম্বা পথ: Review থেকে Guide পর্যন্ত চারটা তীর, পাঁচটা Table।',
    },
    {
        id: 'tour-place',
        question: 'Ratargul Swamp Boat Day কোন জায়গায়?',
        path: ['tours', 'destinations'],
        links: ['tours.destination_id = destinations.destination_id'],
        why: 'প্রশ্নটা Booking এর না, ট্যুরের। তাই bookings Table এর এখানে কোনো কাজ নেই।',
    },
];

/**
 * Planning a join before writing it: pick a question and see which tables it
 * needs, in which order, and which key pair links each step. The links are the
 * seven real foreign keys of the sample database.
 */
export function JoinPathLab() {
    const reduce = useReducedMotion();
    const [active, setActive] = useState(QUESTIONS[0].id);
    const current = QUESTIONS.find(q => q.id === active) ?? QUESTIONS[0];

    return (
        <Panel
            label='Interactive'
            title='প্রশ্ন থেকে Table এর পথ'
            footer='সবগুলো তীর Sample Database এর আসল সাতটা Foreign Key থেকে নেওয়া। একটা প্রশ্নের জন্য কয়টা Table লাগবে, সেটা ঠিক হয় উত্তরটা কোন Table এ আছে আর প্রশ্নটা কোন Table থেকে শুরু, তার মাঝের পথ দিয়ে। এই লেসনে আপনি শুধু প্রথম ধাপটা লিখবেন, দুই Table; লম্বা পথ লেখার কৌশল Lesson 07 এ।'>
            <div className='flex flex-wrap gap-2 mb-6'>
                {QUESTIONS.map(q => (
                    <button
                        key={q.id}
                        type='button'
                        data-question={q.id}
                        aria-pressed={q.id === active}
                        onClick={() => setActive(q.id)}
                        className={cn(BTN, q.id === active ? BTN_ON : BTN_OFF)}>
                        {q.question}
                    </button>
                ))}
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6' data-path={current.path.join('>')}>
                {TABLES.map(name => {
                    const step = current.path.indexOf(name);
                    const on = step >= 0;
                    return (
                        <div
                            key={name}
                            className={cn(
                                'flex items-center gap-2 border px-3 py-2 font-mono text-[0.75rem] transition-colors duration-300',
                                on ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground/60'
                            )}>
                            <span
                                className={cn(
                                    'inline-flex h-5 w-5 shrink-0 items-center justify-center border text-[0.625rem] font-bold',
                                    on ? 'border-primary text-primary' : 'border-border/60 text-transparent'
                                )}>
                                {on ? step + 1 : '·'}
                            </span>
                            {name}
                        </div>
                    );
                })}
            </div>

            <motion.div
                key={current.id}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className='space-y-4'>
                <p className='text-sm leading-relaxed text-foreground'>
                    <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-primary mr-2'>
                        {toBn(current.path.length)}টা Table, {toBn(current.links.length)}টা তীর
                    </span>
                    {current.why}
                </p>
                <ol className='space-y-1.5'>
                    {current.links.map((link, i) => (
                        <li key={link} className='flex gap-3 font-mono text-[0.75rem] text-foreground/90'>
                            <span className='text-primary'>{i + 1}.</span>
                            {link}
                        </li>
                    ))}
                </ol>
            </motion.div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. Row জোড়া লাগানো, একটা একটা করে                                           */
/* ------------------------------------------------------------------------- */

/** The 15 real customers, id and name. */
const CUSTOMERS: { id: number; name: string }[] = [
    { id: 1, name: 'Rahim Uddin' },
    { id: 2, name: 'Nusrat Jahan' },
    { id: 3, name: 'Tanvir Ahmed' },
    { id: 4, name: 'Farhana Akter' },
    { id: 5, name: 'Sabbir Hossain' },
    { id: 6, name: 'Mitu Rahman' },
    { id: 7, name: 'Arif Chowdhury' },
    { id: 8, name: 'Sumaiya Islam' },
    { id: 9, name: 'Priya Sharma' },
    { id: 10, name: 'Aiman Zulkifli' },
    { id: 11, name: 'Oliver Bennett' },
    { id: 12, name: 'Kamal Hasan' },
    { id: 13, name: 'Shuvo Das' },
    { id: 14, name: 'Lamia Haque' },
    { id: 15, name: 'Imran Kabir' },
];

/** The 24 real bookings: booking_id and the customer_id stored in it. */
const BOOKINGS: { id: number; customer: number }[] = [
    { id: 1, customer: 1 },
    { id: 2, customer: 2 },
    { id: 3, customer: 3 },
    { id: 4, customer: 4 },
    { id: 5, customer: 5 },
    { id: 6, customer: 6 },
    { id: 7, customer: 7 },
    { id: 8, customer: 1 },
    { id: 9, customer: 8 },
    { id: 10, customer: 9 },
    { id: 11, customer: 10 },
    { id: 12, customer: 11 },
    { id: 13, customer: 2 },
    { id: 14, customer: 12 },
    { id: 15, customer: 13 },
    { id: 16, customer: 14 },
    { id: 17, customer: 1 },
    { id: 18, customer: 6 },
    { id: 19, customer: 11 },
    { id: 20, customer: 9 },
    { id: 21, customer: 4 },
    { id: 22, customer: 3 },
    { id: 23, customer: 8 },
    { id: 24, customer: 13 },
];

type PairMode = 'right' | 'wrong';

const MODES: { key: PairMode; label: string; on: string }[] = [
    { key: 'right', label: 'ঠিক ON', on: 'c.customer_id = b.customer_id' },
    { key: 'wrong', label: 'ভুল ON', on: 'c.customer_id = b.booking_id' },
];

/** The customer a booking pairs with under each condition, or none. */
function partnerOf(mode: PairMode, booking: { id: number; customer: number }) {
    const key = mode === 'right' ? booking.customer : booking.id;
    return CUSTOMERS.find(c => c.id === key) ?? null;
}

/**
 * The join done by hand, one booking at a time: for each booking row the
 * database looks for the customer row whose key equals the number in the ON
 * condition, and every match becomes one row of the result. Switching to the
 * wrong ON pairs booking 1 with customer 1, booking 2 with customer 2 and so on,
 * which runs without any error and gives a silently wrong answer.
 */
export function PairingLab() {
    const [mode, setMode] = useState<PairMode>('right');
    const [step, setStep] = useState(0);

    const done = BOOKINGS.slice(0, step);
    const current = step > 0 ? BOOKINGS[step - 1] : null;
    const partner = current ? partnerOf(mode, current) : null;
    const pairs = done
        .map(b => ({ booking: b, customer: partnerOf(mode, b) }))
        .filter((p): p is { booking: { id: number; customer: number }; customer: { id: number; name: string } } => p.customer !== null);
    const finished = step === BOOKINGS.length;
    const matchedCustomers = new Set(pairs.map(p => p.customer.id));
    const condition = MODES.find(m => m.key === mode)!.on;

    const switchMode = (next: PairMode) => {
        setMode(next);
        setStep(0);
    };

    return (
        <Panel
            label='Interactive'
            title='Join এর ভেতরে: Row জোড়া লাগানো'
            footer='Data আসল: bookings এর ২৪টা Row আর customers এর ১৫টা Row। ঠিক ON এ প্রতিটা Booking ঠিক একজন Customer পায়, তাই ২৪টা জোড়া; চোদ্দজন Customer অন্তত একবার জোড়া পান, আর Imran Kabir একবারও না। ভুল ON এ Database কোনো Error দেয় না, শুধু Booking এর নিজের নম্বরকে Customer এর নম্বর ভেবে জোড়া লাগায়: ১৫টা ভুল জোড়া, আর Booking 16 থেকে 24 কোনো জোড়াই পায় না।'>
            <div className='flex flex-wrap items-center gap-2 mb-5'>
                {MODES.map(m => (
                    <button
                        key={m.key}
                        type='button'
                        data-mode={m.key}
                        aria-pressed={mode === m.key}
                        onClick={() => switchMode(m.key)}
                        className={cn(BTN, mode === m.key ? BTN_ON : BTN_OFF)}>
                        {m.label}
                    </button>
                ))}
                <span className='mx-1 h-5 w-px bg-border' aria-hidden />
                <button
                    type='button'
                    data-action='next'
                    disabled={finished}
                    onClick={() => setStep(s => Math.min(BOOKINGS.length, s + 1))}
                    className={cn(BTN, BTN_OFF, 'disabled:opacity-40')}>
                    পরের Booking
                </button>
                <button
                    type='button'
                    data-action='all'
                    disabled={finished}
                    onClick={() => setStep(BOOKINGS.length)}
                    className={cn(BTN, BTN_OFF, 'disabled:opacity-40')}>
                    বাকি সব
                </button>
                <button
                    type='button'
                    data-action='reset'
                    onClick={() => setStep(0)}
                    className={cn(BTN, BTN_OFF)}>
                    আবার শুরু
                </button>
            </div>

            <pre className='mb-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                {`SELECT b.booking_id, c.full_name\nFROM bookings b\nJOIN customers c ON ${condition};`}
            </pre>

            <div className='grid gap-5 lg:grid-cols-[1fr_1fr_1.2fr]' data-step={step} data-pairs={pairs.length}>
                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        bookings (booking_id → customer_id)
                    </p>
                    <div className='grid grid-cols-4 gap-1'>
                        {BOOKINGS.map((b, i) => {
                            const isCurrent = current?.id === b.id;
                            const seen = i < step;
                            const orphan = seen && partnerOf(mode, b) === null;
                            return (
                                <div
                                    key={b.id}
                                    className={cn(
                                        'border px-1.5 py-1 font-mono text-[0.625rem] transition-colors duration-300',
                                        isCurrent
                                            ? 'border-primary bg-primary/15 text-primary'
                                            : orphan
                                              ? 'border-destructive/40 text-destructive/80'
                                              : seen
                                                ? 'border-border bg-muted/40 text-foreground/80'
                                                : 'border-border text-muted-foreground/70'
                                    )}>
                                    {b.id}→{b.customer}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        customers (customer_id)
                    </p>
                    <div className='space-y-1'>
                        {CUSTOMERS.map(c => {
                            const isPartner = partner?.id === c.id;
                            const used = matchedCustomers.has(c.id);
                            const lonely = finished && !used;
                            return (
                                <div
                                    key={c.id}
                                    className={cn(
                                        'flex justify-between border px-2 py-0.5 font-mono text-[0.625rem] transition-colors duration-300',
                                        isPartner
                                            ? 'border-primary bg-primary/15 text-primary'
                                            : lonely
                                              ? 'border-dashed border-border text-muted-foreground/60'
                                              : used
                                                ? 'border-border bg-muted/40 text-foreground/80'
                                                : 'border-border text-muted-foreground/70'
                                    )}>
                                    <span>{c.id}</span>
                                    <span className='truncate pl-2'>{c.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        ফলাফল: {toBn(pairs.length)}টা জোড়া
                    </p>
                    <div className='max-h-80 overflow-y-auto border border-border'>
                        <table className='w-full border-collapse font-mono text-[0.6875rem]'>
                            <thead>
                                <tr className='bg-muted/40'>
                                    <th className='border-b border-border px-2 py-1 text-left'>booking_id</th>
                                    <th className='border-b border-border px-2 py-1 text-left'>full_name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pairs.map(p => (
                                    <tr
                                        key={p.booking.id}
                                        className={cn(
                                            'border-b border-border/50 last:border-b-0',
                                            current?.id === p.booking.id && 'bg-primary/10'
                                        )}>
                                        <td className='px-2 py-0.5'>{p.booking.id}</td>
                                        <td className='px-2 py-0.5'>{p.customer.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <p className='mt-5 text-sm leading-relaxed text-muted-foreground min-h-12' aria-live='polite'>
                {!current && 'পরের Booking চাপুন। Database প্রতিটা Booking এর জন্য ON এর শর্ত মেলে এমন Customer খুঁজবে।'}
                {current && partner && !finished && (
                    <>
                        Booking {current.id} এর জন্য শর্ত{' '}
                        <span className='font-mono text-foreground'>{condition}</span> মেলে Customer {partner.id} এ:{' '}
                        <span className='text-foreground'>{partner.name}</span>। একটা জোড়া তৈরি হলো।
                    </>
                )}
                {current && !partner && !finished && (
                    <>
                        Booking {current.id} এর জন্য শর্ত মেলে এমন কোনো Customer নেই, কারণ {current.id} নম্বরের কোনো
                        Customer নেই। এই Booking ফলাফলে আসবে না।
                    </>
                )}
                {finished &&
                    (mode === 'right'
                        ? `শেষ। ২৪টা Booking, ২৪টা জোড়া। ১৪ জন Customer জোড়া পেয়েছেন, Imran Kabir (15) একবারও না, কারণ কোনো Booking এ customer_id 15 নেই। তাঁর কী হয়, সেটা Lesson 02 আর 03 এর গল্প।`
                        : `শেষ। কোনো Error নেই, তবু ফলাফল ভুল: ১৫টা জোড়া, প্রতিটায় Booking এর নম্বর আর Customer এর নম্বর সমান। Booking 13 এখানে Shuvo Das এর নামে, অথচ আসলে Nusrat Jahan এর। Booking 16 থেকে 24 কোনো জোড়াই পায়নি।`)}
            </p>
        </Panel>
    );
}
