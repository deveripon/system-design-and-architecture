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

type V = 'T' | 'F' | 'U';
const NAME: Record<V, string> = { T: 'TRUE', F: 'FALSE', U: 'UNKNOWN' };
const SQL_LITERAL: Record<V, string> = { T: 'true', F: 'false', U: 'NULL::boolean' };

function and(a: V, b: V): V {
    if (a === 'F' || b === 'F') return 'F';
    if (a === 'U' || b === 'U') return 'U';
    return 'T';
}
function or(a: V, b: V): V {
    if (a === 'T' || b === 'T') return 'T';
    if (a === 'U' || b === 'U') return 'U';
    return 'F';
}
function not(a: V): V {
    return a === 'T' ? 'F' : a === 'F' ? 'T' : 'U';
}

function Badge({ v }: { v: V }) {
    return (
        <span
            className={cn(
                'inline-block border px-2 py-0.5 font-mono text-[0.6875rem] font-bold',
                v === 'T' && 'border-primary bg-primary/15 text-primary',
                v === 'F' && 'border-border bg-muted/40 text-muted-foreground',
                v === 'U' && 'border-dashed border-primary/70 text-primary'
            )}>
            {NAME[v]}
        </span>
    );
}

/* ------------------------------------------------------------------------- */
/* 1. তিন মানের যুক্তি নিজে হাতে                                                 */
/* ------------------------------------------------------------------------- */

type Op = 'AND' | 'OR' | 'NOT';

/**
 * Pick two truth values and an operator. The lab also runs the substitution
 * trick: put TRUE, then FALSE, in place of every UNKNOWN. If both answers
 * agree, that is the answer; if they differ, the answer is UNKNOWN.
 */
export function ThreeValuedLab() {
    const reduce = useReducedMotion();
    const [a, setA] = useState<V>('U');
    const [op, setOp] = useState<Op>('AND');
    const [b, setB] = useState<V>('F');

    const apply = (x: V, y: V): V => (op === 'AND' ? and(x, y) : op === 'OR' ? or(x, y) : not(x));
    const result = apply(a, b);
    const hasUnknown = a === 'U' || (op !== 'NOT' && b === 'U');
    const sub = (v: V, to: V): V => (v === 'U' ? to : v);
    const asTrue = apply(sub(a, 'T'), sub(b, 'T'));
    const asFalse = apply(sub(a, 'F'), sub(b, 'F'));
    const sql = op === 'NOT' ? `SELECT NOT ${SQL_LITERAL[a]};` : `SELECT ${SQL_LITERAL[a]} ${op} ${SQL_LITERAL[b]};`;

    const picker = (value: V, set: (v: V) => void, name: string) => (
        <div className='flex flex-wrap gap-2'>
            {(['T', 'F', 'U'] as V[]).map(v => (
                <button
                    key={v}
                    type='button'
                    data-pick={`${name}-${v}`}
                    aria-pressed={value === v}
                    onClick={() => set(v)}
                    className={cn(BTN, value === v ? BTN_ON : BTN_OFF)}>
                    {NAME[v]}
                </button>
            ))}
        </div>
    );

    return (
        <Panel
            label='Interactive'
            title='TRUE, FALSE, UNKNOWN নিয়ে খেলা'
            footer='UNKNOWN এর জায়গায় একবার TRUE আর একবার FALSE বসিয়ে দেখুন। দুইবারই একই উত্তর এলে অজানা মানটা কিছুই বদলাতে পারে না, তাই সেটাই উত্তর। দুইবার আলাদা এলে উত্তর নির্ভর করছে অজানা মানের উপর, তাই উত্তরও UNKNOWN।'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-6'>
                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>প্রথম মান</p>
                    {picker(a, setA, 'a')}
                </div>
                <div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>Operator</p>
                    <div className='flex flex-wrap gap-2'>
                        {(['AND', 'OR', 'NOT'] as Op[]).map(o => (
                            <button
                                key={o}
                                type='button'
                                data-op={o}
                                aria-pressed={op === o}
                                onClick={() => setOp(o)}
                                className={cn(BTN, op === o ? BTN_ON : BTN_OFF)}>
                                {o}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={cn(op === 'NOT' && 'opacity-40 pointer-events-none')}>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2'>
                        দ্বিতীয় মান {op === 'NOT' && '(NOT এ লাগে না)'}
                    </p>
                    {picker(b, setB, 'b')}
                </div>
            </div>

            <motion.div
                key={`${a}${op}${b}`}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className='border border-border bg-background p-4 md:p-5 space-y-4'
                data-result={NAME[result]}>
                <div className='flex flex-wrap items-center gap-3'>
                    {op === 'NOT' ? (
                        <>
                            <span className='font-mono text-sm font-bold'>NOT</span>
                            <Badge v={a} />
                        </>
                    ) : (
                        <>
                            <Badge v={a} />
                            <span className='font-mono text-sm font-bold'>{op}</span>
                            <Badge v={b} />
                        </>
                    )}
                    <span className='font-mono text-sm text-muted-foreground'>=</span>
                    <Badge v={result} />
                </div>
                {hasUnknown ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        <div className='border border-border p-3 text-[0.8125rem] leading-relaxed text-muted-foreground'>
                            UNKNOWN কে TRUE ধরলে উত্তর <Badge v={asTrue} />
                        </div>
                        <div className='border border-border p-3 text-[0.8125rem] leading-relaxed text-muted-foreground'>
                            UNKNOWN কে FALSE ধরলে উত্তর <Badge v={asFalse} />
                        </div>
                        <p className='sm:col-span-2 text-sm leading-relaxed text-foreground'>
                            {asTrue === asFalse
                                ? 'দুইবারই একই উত্তর। অজানা মানটা যা-ই হোক, ফলাফল বদলায় না, তাই PostgreSQL নিশ্চিত হয়ে এই উত্তরটাই দেয়।'
                                : 'দুইবার দুই রকম উত্তর। ফলাফল পুরোটাই নির্ভর করছে অজানা মানের উপর, তাই PostgreSQL সৎভাবে বলে: জানি না, UNKNOWN।'}
                        </p>
                    </div>
                ) : (
                    <p className='text-sm leading-relaxed text-foreground'>
                        এখানে কোনো অজানা মান নেই, তাই এটা সাধারণ দুই মানের যুক্তি, যা আপনি আগে থেকেই জানেন।
                    </p>
                )}
                <pre className='overflow-x-auto border-t border-border pt-3 font-mono text-[0.75rem] text-muted-foreground'>
                    {sql}
                </pre>
            </motion.div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. প্রতিটা Row এর জন্য WHERE এর রায়                                          */
/* ------------------------------------------------------------------------- */

const RAHIM = '+8801000000101';

/** The 15 customers of the sample database: who has a phone and who does not. */
const CUSTOMERS: { id: number; name: string; phone: string | null }[] = [
    { id: 1, name: 'Rahim Uddin', phone: '+8801000000101' },
    { id: 2, name: 'Nusrat Jahan', phone: '+8801000000102' },
    { id: 3, name: 'Tanvir Ahmed', phone: null },
    { id: 4, name: 'Farhana Akter', phone: '+8801000000104' },
    { id: 5, name: 'Sabbir Hossain', phone: '+8801000000105' },
    { id: 6, name: 'Mitu Rahman', phone: null },
    { id: 7, name: 'Arif Chowdhury', phone: '+8801000000107' },
    { id: 8, name: 'Sumaiya Islam', phone: '+8801000000108' },
    { id: 9, name: 'Priya Sharma', phone: null },
    { id: 10, name: 'Aiman Zulkifli', phone: null },
    { id: 11, name: 'Oliver Bennett', phone: null },
    { id: 12, name: 'Kamal Hasan', phone: '+8801000000112' },
    { id: 13, name: 'Shuvo Das', phone: '+8801000000113' },
    { id: 14, name: 'Lamia Haque', phone: '+8801000000114' },
    { id: 15, name: 'Imran Kabir', phone: '+8801000000115' },
];

const eq = (phone: string | null, value: string): V => (phone === null ? 'U' : phone === value ? 'T' : 'F');

const CONDITIONS: { id: string; sql: string; judge: (phone: string | null) => V; note: string }[] = [
    {
        id: 'eq',
        sql: `phone = '${RAHIM}'`,
        judge: p => eq(p, RAHIM),
        note: 'নম্বর আছে এমন ১০ জনের জন্য উত্তর জানা: একজন TRUE, বাকিরা FALSE। নম্বর নেই এমন ৫ জনের জন্য উত্তর UNKNOWN।',
    },
    {
        id: 'neq',
        sql: `phone <> '${RAHIM}'`,
        judge: p => not(eq(p, RAHIM)),
        note: 'উল্টো প্রশ্ন, কিন্তু UNKNOWN উল্টালেও UNKNOWN। তাই নম্বরহীন ৫ জন এবারও বাদ। দুই Query মিলে ১০ জন, ১৫ না।',
    },
    {
        id: 'eq-null',
        sql: 'phone = NULL',
        judge: () => 'U',
        note: 'NULL এর সাথে = মানে অজানার সাথে তুলনা। কারো জন্যই উত্তর TRUE হয় না, এমনকি যাঁদের নম্বর সত্যিই নেই তাঁদের জন্যও না। ফলাফল শূন্য Row।',
    },
    {
        id: 'is-null',
        sql: 'phone IS NULL',
        judge: p => (p === null ? 'T' : 'F'),
        note: 'IS NULL কখনো UNKNOWN দেয় না, সবসময় TRUE বা FALSE। নম্বরহীন ৫ জনকে ঠিকঠাক খুঁজে পাওয়ার একমাত্র সোজা রাস্তা।',
    },
    {
        id: 'neq-or-null',
        sql: `phone <> '${RAHIM}' OR phone IS NULL`,
        judge: p => or(not(eq(p, RAHIM)), p === null ? 'T' : 'F'),
        note: 'প্রথম অংশ UNKNOWN হলেও দ্বিতীয় অংশ TRUE, আর UNKNOWN OR TRUE হলো TRUE। Rahim ছাড়া সবাই, ১৪ জন।',
    },
    {
        id: 'distinct',
        sql: `phone IS DISTINCT FROM '${RAHIM}'`,
        judge: p => (p === RAHIM ? 'F' : 'T'),
        note: 'IS DISTINCT FROM NULL কে একটা সাধারণ মানের মতো তুলনা করে, তাই কখনো UNKNOWN দেয় না। আগের Query এর মতোই ১৪ জন, এক কথায়।',
    },
];

export function WhereVerdictLab() {
    const [conditionId, setConditionId] = useState('neq');
    const condition = CONDITIONS.find(c => c.id === conditionId) ?? CONDITIONS[0];
    const verdicts = CUSTOMERS.map(c => ({ ...c, v: condition.judge(c.phone) }));
    const kept = verdicts.filter(r => r.v === 'T').length;
    const unknown = verdicts.filter(r => r.v === 'U').length;
    const falsy = verdicts.filter(r => r.v === 'F').length;

    return (
        <Panel
            label='Interactive'
            title='প্রতিটা Customer এর জন্য WHERE এর রায়'
            footer='তালিকাটা Sample Database এর সেই ১৫ জন Customer। WHERE প্রতিটা Row এর জন্য একটা রায় দেয়, আর শুধু TRUE পাওয়া Row ফলাফলে যায়। শর্ত বদলে দেখুন কোন শর্তে UNKNOWN জন্মায় আর কোনটায় জন্মায় না।'>
            <div className='flex flex-wrap gap-2 mb-5'>
                {CONDITIONS.map(c => (
                    <button
                        key={c.id}
                        type='button'
                        data-condition={c.id}
                        aria-pressed={c.id === conditionId}
                        onClick={() => setConditionId(c.id)}
                        className={cn(BTN, 'font-mono', c.id === conditionId ? BTN_ON : BTN_OFF)}>
                        {c.sql}
                    </button>
                ))}
            </div>

            <div className='flex flex-wrap gap-3 mb-4 font-mono text-[0.75rem]' data-kept={kept}>
                <span className='border border-primary bg-primary/10 px-2.5 py-1 text-primary font-bold'>
                    TRUE, ফলাফলে: {toBn(kept)}
                </span>
                <span className='border border-border px-2.5 py-1 text-muted-foreground'>FALSE, বাদ: {toBn(falsy)}</span>
                <span className='border border-dashed border-primary/70 px-2.5 py-1 text-primary'>
                    UNKNOWN, বাদ: {toBn(unknown)}
                </span>
            </div>

            <p className='mb-5 text-sm leading-relaxed text-foreground'>{condition.note}</p>

            <div className='overflow-x-auto border border-border'>
                <table className='w-full border-collapse font-mono text-[0.75rem]'>
                    <thead>
                        <tr className='bg-muted/40'>
                            <th className='border-b border-border px-3 py-2 text-left'>customer_id</th>
                            <th className='border-b border-border px-3 py-2 text-left'>full_name</th>
                            <th className='border-b border-border px-3 py-2 text-left'>phone</th>
                            <th className='border-b border-border px-3 py-2 text-left'>WHERE এর রায়</th>
                        </tr>
                    </thead>
                    <tbody>
                        {verdicts.map(r => (
                            <tr
                                key={r.id}
                                className={cn(
                                    'border-b border-border/60 last:border-b-0 transition-colors',
                                    r.v === 'T' ? 'bg-primary/5' : 'opacity-60'
                                )}>
                                <td className='px-3 py-1.5'>{r.id}</td>
                                <td className='px-3 py-1.5'>{r.name}</td>
                                <td className={cn('px-3 py-1.5', r.phone === null && 'italic text-muted-foreground')}>
                                    {r.phone ?? 'NULL'}
                                </td>
                                <td className='px-3 py-1.5'>
                                    <Badge v={r.v} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Panel>
    );
}
