'use client';

import { EASE } from '@/components/motion/reveal';
import { cn, toBn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import {
    ENGLISH_GUIDE_IDS,
    GUIDES,
    inList,
    LISTS,
    notInList,
    type Op,
    OPS,
    type Quant,
    QUANTS,
    quantify,
    TOUR_GUIDE_IDS,
    TOURS,
    type Tri,
} from './anyall-data';

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

/** TRUE, FALSE or NULL, the way PostgreSQL prints a boolean. */
function triLabel(v: Tri) {
    if (v === null) return 'NULL';
    return v ? 'TRUE' : 'FALSE';
}

function TriBadge({ value }: { value: Tri }) {
    return (
        <span
            className={cn(
                'inline-block min-w-[3.25rem] px-1.5 py-0.5 border text-center font-mono text-[0.625rem] font-bold',
                value === true && 'border-primary bg-primary/10 text-primary',
                value === false && 'border-border text-muted-foreground',
                value === null && 'border-dashed border-primary/60 text-primary/80'
            )}>
            {triLabel(value)}
        </span>
    );
}

/* ------------------------------------------------------------------------- */
/* 1. ANY আর ALL: অপারেটর, শব্দ আর তালিকা বদলে দেখুন                           */
/* ------------------------------------------------------------------------- */

/**
 * Pick an operator, ANY or ALL, and a list (two real destinations, an empty
 * one, and one with a NULL). Every tour shows its comparison with each value
 * and the final TRUE, FALSE or NULL. All 32 combinations match PostgreSQL.
 */
export function QuantifierLab() {
    const reduce = useReducedMotion();
    const [op, setOp] = useState<Op>('>');
    const [quant, setQuant] = useState<Quant>('ALL');
    const [listKey, setListKey] = useState(LISTS[0].key);
    const list = LISTS.find(l => l.key === listKey)!;

    const rows = TOURS.map(t => ({ tour: t, ...quantify(t.price, op, quant, list.values) }));
    const kept = rows.filter(r => r.result === true).length;
    const unknown = rows.filter(r => r.result === null).length;

    return (
        <Panel
            label='Interactive'
            title='ANY আর ALL: প্রতিটা ট্যুর, প্রতিটা তুলনা'
            footer={
                <>
                    প্রতিটা ট্যুরের দাম তালিকার প্রতিটা মানের সাথে একবার তুলনা হয়। ANY: একটা TRUE পেলেই TRUE, তালিকা খালি হলে
                    FALSE। ALL: একটা FALSE পেলেই FALSE, তালিকা খালি হলে TRUE। কোনো সিদ্ধান্ত না হলে আর একটা NULL থাকলে উত্তর
                    NULL, আর WHERE সেটা বাদ দেয়। সব সংখ্যা Sample Database এর আসল দাম, আর ৩২টা জোড়ার প্রতিটার ফলাফল
                    PostgreSQL এর সাথে মিলিয়ে দেখা।
                </>
            }>
            <div className='space-y-4 mb-6'>
                <div className='flex flex-wrap items-center gap-2'>
                    <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground w-24'>
                        অপারেটর
                    </span>
                    {OPS.map(o => (
                        <button
                            key={o}
                            type='button'
                            data-op={o}
                            onClick={() => setOp(o)}
                            className={cn(BTN, 'font-mono', op === o ? BTN_ON : BTN_OFF)}>
                            {o}
                        </button>
                    ))}
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                    <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground w-24'>
                        শব্দ
                    </span>
                    {QUANTS.map(q => (
                        <button
                            key={q}
                            type='button'
                            data-quant={q}
                            onClick={() => setQuant(q)}
                            className={cn(BTN, 'font-mono', quant === q ? BTN_ON : BTN_OFF)}>
                            {q}
                        </button>
                    ))}
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                    <span className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground w-24'>
                        তালিকা
                    </span>
                    {LISTS.map(l => (
                        <button
                            key={l.key}
                            type='button'
                            data-list={l.key}
                            onClick={() => setListKey(l.key)}
                            className={cn(BTN, listKey === l.key ? BTN_ON : BTN_OFF)}>
                            {l.label}
                        </button>
                    ))}
                </div>
            </div>

            <pre className='mb-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                {`SELECT title, price_bdt\nFROM tours\nWHERE price_bdt ${op} ${quant} (${list.sql});`}
            </pre>

            <p className='mb-3 font-mono text-[0.6875rem] text-muted-foreground'>
                তালিকার মান:{' '}
                {list.values.length === 0
                    ? '(খালি, একটাও Row নেই)'
                    : list.values.map(v => (v === null ? 'NULL' : String(v))).join(', ')}
            </p>

            <div className='overflow-x-auto border border-border'>
                <table className='w-full border-collapse text-[0.75rem]' data-kept={kept}>
                    <thead>
                        <tr className='bg-muted/40 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-muted-foreground'>
                            <th className='px-3 py-2 text-left'>ট্যুর</th>
                            <th className='px-3 py-2 text-right'>price_bdt</th>
                            <th className='px-3 py-2 text-left'>প্রতিটা তুলনা</th>
                            <th className='px-3 py-2 text-left'>{quant}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(r => (
                            <motion.tr
                                key={`${r.tour.id}-${op}-${quant}-${listKey}`}
                                initial={reduce ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.25, ease: EASE }}
                                className={cn(
                                    'border-t border-border/60',
                                    r.result === true ? 'bg-primary/5' : 'opacity-70'
                                )}>
                                <td className='px-3 py-1.5'>{r.tour.title}</td>
                                <td className='px-3 py-1.5 text-right font-mono'>{r.tour.price}</td>
                                <td className='px-3 py-1.5'>
                                    <span className='flex flex-wrap gap-1'>
                                        {r.each.length === 0 ? (
                                            <span className='font-mono text-[0.625rem] text-muted-foreground'>তুলনা নেই</span>
                                        ) : (
                                            r.each.map((e, i) => <TriBadge key={i} value={e} />)
                                        )}
                                    </span>
                                </td>
                                <td className='px-3 py-1.5'>
                                    <TriBadge value={r.result} />
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className='mt-4 text-sm leading-relaxed' data-result-count={kept}>
                <strong className='text-primary'>{toBn(kept)}টা</strong> ট্যুর ফলাফলে আসে
                {unknown > 0 && <>, আর {toBn(unknown)}টা ট্যুরের উত্তর NULL, তাই সেগুলোও বাদ</>}।
            </p>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. NULL দুই দিক থেকে: তালিকার ভেতরে আর তুলনার বাঁ দিকে                       */
/* ------------------------------------------------------------------------- */

type Scenario = 'outer' | 'inner';

/**
 * Two faces of the same rule on the real data. "outer": Ratargul's NULL
 * guide_id is in neither the IN half nor the NOT IN half, so 4 + 4 is not 9.
 * "inner": Ratargul's NULL inside the list makes NOT IN drop Nazmul Karim, who
 * has no tour. A switch applies the fix for each and the counts move.
 */
export function NullHalvesLab() {
    const [scenario, setScenario] = useState<Scenario>('outer');
    const [fixed, setFixed] = useState(false);

    const outerRows = TOURS.map(t => {
        const inside = inList(t.guide, ENGLISH_GUIDE_IDS);
        const outside = notInList(t.guide, ENGLISH_GUIDE_IDS);
        return { key: t.id, label: t.title, guide: t.guide, inside, outside: fixed && t.guide === null ? true : outside };
    });
    const inCount = outerRows.filter(r => r.inside === true).length;
    const notInCount = outerRows.filter(r => r.outside === true).length;

    const list = fixed ? TOUR_GUIDE_IDS.filter(v => v !== null) : TOUR_GUIDE_IDS;
    const innerRows = GUIDES.map(g => ({ key: g.id, label: g.name, result: notInList(g.id, list) }));
    const kept = innerRows.filter(r => r.result === true).length;

    const choose = (s: Scenario) => {
        setScenario(s);
        setFixed(false);
    };

    return (
        <Panel
            label='Interactive'
            title='NULL দুই দিক থেকে: বাইরে আর ভেতরে'
            footer={
                <>
                    বাঁ দিকের মান NULL হলে IN আর NOT IN দুটোই NULL দেয়, তাই Ratargul কোনো অর্ধেকেই পড়ে না। তালিকার ভেতরে
                    একটা NULL থাকলে NOT IN কখনো TRUE দিতে পারে না, তাই Nazmul Karim হারিয়ে যান। দুটো ঘটনাই আসল Sample Data
                    থেকে, আর প্রতিটা Row এর মান PostgreSQL এর সাথে মিলিয়ে দেখা।
                </>
            }>
            <div className='flex flex-wrap gap-2 mb-4'>
                <button
                    type='button'
                    data-scenario='outer'
                    onClick={() => choose('outer')}
                    className={cn(BTN, scenario === 'outer' ? BTN_ON : BTN_OFF)}>
                    বাইরে NULL: tours এর guide_id
                </button>
                <button
                    type='button'
                    data-scenario='inner'
                    onClick={() => choose('inner')}
                    className={cn(BTN, scenario === 'inner' ? BTN_ON : BTN_OFF)}>
                    ভেতরে NULL: tours থেকে বানানো তালিকা
                </button>
                <button
                    type='button'
                    data-action='fix'
                    aria-pressed={fixed}
                    onClick={() => setFixed(f => !f)}
                    className={cn(BTN, fixed ? BTN_ON : BTN_OFF)}>
                    {fixed ? 'সমাধান চালু' : 'সমাধান বসান'}
                </button>
            </div>

            <pre className='mb-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                {scenario === 'outer'
                    ? `-- ইংরেজিভাষী Guide এর ট্যুর\nSELECT count(*) FROM tours\nWHERE guide_id IN (SELECT guide_id FROM guides WHERE language = 'English');\n\n-- বাকিগুলো\nSELECT count(*) FROM tours\nWHERE guide_id NOT IN (SELECT guide_id FROM guides WHERE language = 'English')${fixed ? '\n   OR guide_id IS NULL' : ''};`
                    : `SELECT full_name FROM guides\nWHERE guide_id NOT IN (SELECT guide_id FROM tours${fixed ? '\n                       WHERE guide_id IS NOT NULL' : ''});`}
            </pre>

            {scenario === 'outer' ? (
                <>
                    <div className='overflow-x-auto border border-border'>
                        <table className='w-full border-collapse text-[0.75rem]'>
                            <thead>
                                <tr className='bg-muted/40 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-muted-foreground'>
                                    <th className='px-3 py-2 text-left'>ট্যুর</th>
                                    <th className='px-3 py-2 text-left'>guide_id</th>
                                    <th className='px-3 py-2 text-left'>IN</th>
                                    <th className='px-3 py-2 text-left'>{fixed ? 'NOT IN OR IS NULL' : 'NOT IN'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {outerRows.map(r => (
                                    <tr key={r.key} className={cn('border-t border-border/60', r.guide === null && 'bg-primary/5')}>
                                        <td className='px-3 py-1.5'>{r.label}</td>
                                        <td className='px-3 py-1.5 font-mono'>{r.guide === null ? 'NULL' : r.guide}</td>
                                        <td className='px-3 py-1.5'>
                                            <TriBadge value={r.inside} />
                                        </td>
                                        <td className='px-3 py-1.5'>
                                            <TriBadge value={r.outside} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className='mt-4 text-sm leading-relaxed' data-sum={inCount + notInCount}>
                        IN পেল <strong className='text-primary'>{toBn(inCount)}টা</strong>, {fixed ? 'বাকি অর্ধেক' : 'NOT IN'} পেল{' '}
                        <strong className='text-primary'>{toBn(notInCount)}টা</strong>, মোট {toBn(inCount + notInCount)}টা, অথচ ট্যুর
                        আছে {toBn(TOURS.length)}টা।{' '}
                        {inCount + notInCount === TOURS.length
                            ? 'এবার দুই অর্ধেক মিলে পুরোটা।'
                            : 'Ratargul কোনো অর্ধেকেই নেই, কারণ তার guide_id NULL।'}
                    </p>
                </>
            ) : (
                <>
                    <p className='mb-3 font-mono text-[0.6875rem] text-muted-foreground'>
                        তালিকা: {list.map(v => (v === null ? 'NULL' : String(v))).join(', ')}
                    </p>
                    <div className='overflow-x-auto border border-border'>
                        <table className='w-full border-collapse text-[0.75rem]'>
                            <thead>
                                <tr className='bg-muted/40 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-muted-foreground'>
                                    <th className='px-3 py-2 text-left'>Guide</th>
                                    <th className='px-3 py-2 text-left'>guide_id NOT IN (তালিকা)</th>
                                    <th className='px-3 py-2 text-left'>WHERE এর পর</th>
                                </tr>
                            </thead>
                            <tbody>
                                {innerRows.map(r => (
                                    <tr key={r.key} className={cn('border-t border-border/60', r.result === true && 'bg-primary/5')}>
                                        <td className='px-3 py-1.5'>
                                            {r.key}: {r.label}
                                        </td>
                                        <td className='px-3 py-1.5'>
                                            <TriBadge value={r.result} />
                                        </td>
                                        <td className='px-3 py-1.5 font-mono text-[0.6875rem]'>{r.result === true ? 'রাখা' : 'বাদ'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className='mt-4 text-sm leading-relaxed' data-kept={kept}>
                        ফলাফলে <strong className='text-primary'>{toBn(kept)}টা</strong> Row।{' '}
                        {kept === 0
                            ? 'Nazmul Karim এর কোনো ট্যুর নেই, তবু তাঁর উত্তর NULL, কারণ তালিকায় একটা NULL আছে।'
                            : 'NULL সরিয়ে দিতেই Nazmul Karim ফিরে এলেন, একমাত্র Guide যাঁর কোনো ট্যুর নেই।'}
                    </p>
                </>
            )}
        </Panel>
    );
}
