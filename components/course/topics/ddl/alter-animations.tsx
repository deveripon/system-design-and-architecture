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
/* 1. কোন ALTER কত দামি: Lock আর কাজের ধরন                                       */
/* ------------------------------------------------------------------------- */

type Work = 'catalog' | 'scan' | 'rewrite' | 'index';
type LockMode = 'AccessExclusiveLock' | 'ShareRowExclusiveLock' | 'ShareUpdateExclusiveLock';

interface AlterOp {
    id: string;
    label: string;
    sql: string;
    lock: LockMode;
    /** A second lock taken on the same table, as pg_locks lists it. */
    extraLock?: string;
    work: Work;
    note: string;
}

// Every lock below was read from pg_locks inside BEGIN ... ROLLBACK, and every
// "catalog" or "rewrite" was checked with pg_relation_filenode before and
// after, on PostgreSQL 18.
const OPS: AlterOp[] = [
    {
        id: 'add-null',
        label: 'ADD COLUMN, Default ছাড়া',
        sql: 'ALTER TABLE alter_customers ADD COLUMN whatsapp text;',
        lock: 'AccessExclusiveLock',
        work: 'catalog',
        note: 'Catalog এ একটা নতুন লাইন। পুরনো Row গুলোতে কিছু লেখা হয় না, পড়ার সময় PostgreSQL নিজেই NULL দেখায়।',
    },
    {
        id: 'add-const',
        label: "ADD COLUMN ... DEFAULT 'easy'",
        sql: 'ALTER TABLE alter_customers ADD COLUMN vip boolean NOT NULL DEFAULT false;',
        lock: 'AccessExclusiveLock',
        work: 'catalog',
        note: 'PostgreSQL 11 থেকে ধ্রুব Default টা Catalog এই জমা থাকে, পুরনো প্রতিটা Row পড়ার সময় সেটা পায়। দশ কোটি Row তেও এক মুহূর্ত।',
    },
    {
        id: 'add-now',
        label: 'ADD COLUMN ... DEFAULT now()',
        sql: 'ALTER TABLE alter_customers ADD COLUMN added_at timestamptz NOT NULL DEFAULT now();',
        lock: 'AccessExclusiveLock',
        work: 'catalog',
        note: 'now() একটা Transaction এর ভেতরে একটাই মান দেয়, তাই এটাও ধ্রুবের মতো আচরণ করে: Rewrite নেই, আর সব পুরনো Row ঠিক একই সময় পায়।',
    },
    {
        id: 'add-volatile',
        label: 'ADD COLUMN ... DEFAULT gen_random_uuid()',
        sql: 'ALTER TABLE alter_customers ADD COLUMN token uuid NOT NULL DEFAULT gen_random_uuid();',
        lock: 'AccessExclusiveLock',
        extraLock: 'ShareLock',
        work: 'rewrite',
        note: 'প্রতিটা Row এর আলাদা মান চাই, Catalog এ একটা মান রেখে সেটা হয় না। তাই পুরো Table নতুন File এ লেখা হয়, পুরো সময় Lock ধরে।',
    },
    {
        id: 'drop',
        label: 'DROP COLUMN',
        sql: 'ALTER TABLE alter_customers DROP COLUMN whatsapp;',
        lock: 'AccessExclusiveLock',
        work: 'catalog',
        note: 'Column টা শুধু মুছে ফেলা হিসেবে চিহ্নিত হয়, Data File এ মানগুলো পড়ে থাকে। জায়গা ফেরত আসে পরের কোনো Rewrite এ। Data আর ফেরত পাওয়া যায় না।',
    },
    {
        id: 'rename',
        label: 'RENAME COLUMN, RENAME TO',
        sql: 'ALTER TABLE alter_customers RENAME COLUMN whatsapp TO whatsapp_no;',
        lock: 'AccessExclusiveLock',
        work: 'catalog',
        note: 'শুধু নামটা বদলায়। Database এর ভেতরে সব ঠিক থাকে, বিপদ বাইরে: পুরনো নামে লেখা App এর কোড।',
    },
    {
        id: 'type-widen',
        label: 'smallint থেকে integer',
        sql: 'ALTER TABLE alter_rw ALTER COLUMN seats TYPE integer;',
        lock: 'AccessExclusiveLock',
        extraLock: 'ShareLock',
        work: 'rewrite',
        note: 'Disk এ smallint দুই Byte, integer চার Byte। প্রতিটা Row এর আকার বদলায়, তাই পুরো Table নতুন করে লেখা, সাথে ওই Column এর সব Index ও।',
    },
    {
        id: 'type-varchar-up',
        label: 'varchar(40) থেকে varchar(60) বা text',
        sql: 'ALTER TABLE alter_customers ALTER COLUMN city TYPE varchar(60);',
        lock: 'AccessExclusiveLock',
        work: 'catalog',
        note: 'সীমা শুধু বাড়ছে, পুরনো কোনো মান ভাঙে না, Disk এ লেখার ধরনও একই। PostgreSQL এটা জানে, তাই শুধু Catalog বদলায়।',
    },
    {
        id: 'type-varchar-down',
        label: 'text থেকে varchar(40)',
        sql: 'ALTER TABLE alter_customers ALTER COLUMN city TYPE varchar(40);',
        lock: 'AccessExclusiveLock',
        extraLock: 'ShareLock',
        work: 'rewrite',
        note: 'সীমা নতুন করে বসছে, তাই প্রতিটা মান যাচাই করে পুরো Table আবার লেখা হয়। একটা মানও ৪০ অক্ষরের বেশি হলে পুরো ALTER বাতিল।',
    },
    {
        id: 'set-default',
        label: 'SET DEFAULT, DROP DEFAULT',
        sql: "ALTER TABLE alter_customers ALTER COLUMN city SET DEFAULT 'Dhaka';",
        lock: 'AccessExclusiveLock',
        work: 'catalog',
        note: 'শুধু ভবিষ্যতের INSERT এর জন্য নিয়ম। আগে থেকে থাকা কোনো Row ছোঁয়া হয় না।',
    },
    {
        id: 'set-not-null',
        label: 'SET NOT NULL',
        sql: 'ALTER TABLE alter_customers ALTER COLUMN full_name SET NOT NULL;',
        lock: 'AccessExclusiveLock',
        work: 'scan',
        note: 'একটা NULL ও নেই, এটা প্রমাণ করতে প্রতিটা Row পড়ে, পুরো সময় কড়া Lock ধরে। আগে থেকে VALIDATE করা CHECK (col IS NOT NULL) থাকলে এই Scan বাদ যায়।',
    },
    {
        id: 'add-check',
        label: 'ADD CONSTRAINT ... CHECK',
        sql: 'ALTER TABLE alter_customers ADD CONSTRAINT alter_customers_city_check CHECK (length(city) > 1);',
        lock: 'AccessExclusiveLock',
        work: 'scan',
        note: 'প্রতিটা পুরনো Row শর্ত মানে কিনা দেখে। বড় Table এ এই পুরো সময়টা SELECT পর্যন্ত আটকে থাকে।',
    },
    {
        id: 'add-check-nv',
        label: 'ADD CONSTRAINT ... CHECK ... NOT VALID',
        sql: 'ALTER TABLE alter_prices ADD CONSTRAINT alter_prices_min_check CHECK (price_bdt >= 500) NOT VALID;',
        lock: 'AccessExclusiveLock',
        work: 'catalog',
        note: 'Lock একই কড়া, কিন্তু এক মুহূর্তের জন্য: পুরনো Row পড়াই হয় না। এখন থেকে নতুন আর বদলানো Row পাহারায়।',
    },
    {
        id: 'validate',
        label: 'VALIDATE CONSTRAINT',
        sql: 'ALTER TABLE alter_prices VALIDATE CONSTRAINT alter_prices_min_check;',
        lock: 'ShareUpdateExclusiveLock',
        work: 'scan',
        note: 'পুরো Table পড়ে ঠিকই, কিন্তু হালকা Lock নিয়ে: সাইটের পড়া আর লেখা চলতেই থাকে।',
    },
    {
        id: 'add-fk',
        label: 'ADD FOREIGN KEY',
        sql: 'ALTER TABLE alter_feedback ADD CONSTRAINT alter_feedback_tour_fk FOREIGN KEY (tour_id) REFERENCES tours (tour_id);',
        lock: 'ShareRowExclusiveLock',
        work: 'scan',
        note: 'দুই Table এই একই Lock, tours এ ও। প্রতিটা Row এর tour_id আছে কিনা মিলিয়ে দেখে। পড়া চলে, দুই Table এই লেখা থামে।',
    },
    {
        id: 'add-unique',
        label: 'ADD UNIQUE, ADD PRIMARY KEY',
        sql: 'ALTER TABLE alter_customers ADD CONSTRAINT alter_customers_email_key UNIQUE (email);',
        lock: 'AccessExclusiveLock',
        extraLock: 'ShareLock',
        work: 'index',
        note: 'পুরো Table পড়ে একটা নতুন Index বানায়, দুটো মান একই পেলে Error। UNIQUE কে NOT VALID করা যায় না।',
    },
];

const LOCK_EFFECT: Record<LockMode, { select: boolean; write: boolean; plain: string }> = {
    AccessExclusiveLock: { select: false, write: false, plain: 'সবচেয়ে কড়া Lock। সাধারণ SELECT ও অপেক্ষা করে।' },
    ShareRowExclusiveLock: { select: true, write: false, plain: 'পড়া চলে, INSERT, UPDATE, DELETE অপেক্ষা করে।' },
    ShareUpdateExclusiveLock: { select: true, write: true, plain: 'পড়া আর লেখা দুটোই চলে। শুধু আরেকটা ALTER বা VACUUM অপেক্ষা করে।' },
};

const WORK_LABEL: Record<Work, string> = {
    catalog: 'শুধু Catalog',
    scan: 'পুরো Table পড়া',
    rewrite: 'পুরো Table নতুন করে লেখা',
    index: 'পুরো Table পড়া, নতুন Index লেখা',
};

const ROWS = 12;

function WorkPicture({ work, reduce }: { work: Work; reduce: boolean }) {
    const cell = 'h-4 w-5 border';
    if (work === 'catalog') {
        return (
            <div className='space-y-3'>
                <motion.div
                    initial={reduce ? false : { opacity: 0.3, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className='inline-block border border-primary bg-primary/10 px-3 py-1.5 font-mono text-[0.6875rem] text-primary'>
                    Catalog এ একটা লাইন বদলাল
                </motion.div>
                <div className='flex flex-wrap gap-1'>
                    {Array.from({ length: ROWS }, (_, i) => (
                        <span key={i} className={cn(cell, 'border-border bg-muted/40')} />
                    ))}
                </div>
                <p className='text-[0.6875rem] text-muted-foreground'>Data এর একটা Row ও ছোঁয়া হয়নি</p>
            </div>
        );
    }
    if (work === 'scan') {
        return (
            <div className='space-y-3'>
                <div className='flex flex-wrap gap-1'>
                    {Array.from({ length: ROWS }, (_, i) => (
                        <span key={i} className={cn(cell, 'border-primary/60')}>
                            <motion.span
                                initial={reduce ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: reduce ? 0 : i * 0.12, duration: 0.2 }}
                                className='block h-full w-full bg-primary/30'
                            />
                        </span>
                    ))}
                </div>
                <p className='text-[0.6875rem] text-muted-foreground'>প্রতিটা Row একবার পড়া হলো, File একই আছে</p>
            </div>
        );
    }
    return (
        <div className='space-y-2'>
            <p className='font-mono text-[0.625rem] text-muted-foreground'>পুরনো File</p>
            <div className='flex flex-wrap gap-1'>
                {Array.from({ length: ROWS }, (_, i) => (
                    <span key={i} className={cn(cell, 'border-border bg-muted/40')} />
                ))}
            </div>
            <p className='font-mono text-[0.625rem] text-primary'>{work === 'index' ? 'নতুন Index' : 'নতুন File'}</p>
            <div className='flex flex-wrap gap-1'>
                {Array.from({ length: ROWS }, (_, i) => (
                    <motion.span
                        key={i}
                        initial={reduce ? false : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: reduce ? 0 : i * 0.12, duration: 0.25, ease: EASE }}
                        className={cn(cell, 'border-primary bg-primary/30')}
                    />
                ))}
            </div>
            <p className='text-[0.6875rem] text-muted-foreground'>
                {work === 'index'
                    ? 'Table এর File একই, কিন্তু প্রতিটা Row পড়ে পাশে একটা নতুন Index File লেখা হলো'
                    : 'প্রতিটা Row নতুন File এ লেখা হলো, শেষ হলে পুরনো File মোছা হয়'}
            </p>
        </div>
    );
}

function Allowed({ ok, label }: { ok: boolean; label: string }) {
    return (
        <div className={cn('border px-3 py-2', ok ? 'border-primary/50 bg-primary/5' : 'border-destructive/50 bg-destructive/5')}>
            <p className='font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>{label}</p>
            <p className={cn('text-sm font-bold', ok ? 'text-primary' : 'text-destructive')}>{ok ? 'চলে' : 'অপেক্ষা করে'}</p>
        </div>
    );
}

/**
 * Pick an ALTER TABLE action and see the lock it takes, who has to wait while
 * it runs, and whether it touches the catalog only, reads every row, or writes
 * every row again.
 */
export function AlterCostLab() {
    const reduce = useReducedMotion() ?? false;
    const [id, setId] = useState(OPS[0].id);
    const op = OPS.find(o => o.id === id) ?? OPS[0];
    const effect = LOCK_EFFECT[op.lock];

    return (
        <Panel
            label='Lab'
            title='কোন ALTER কত দামি'
            footer={
                <>
                    {toBn(OPS.length)}টা Action এর প্রতিটার Lock এই লেসনের লেখার সময় PostgreSQL 18 এর pg_locks থেকে পড়া, BEGIN আর ROLLBACK
                    এর ভেতরে। Catalog আর Rewrite এর পার্থক্য pg_relation_filenode দিয়ে মাপা: Rewrite হলে Table এর File নম্বর বদলে যায়।
                    এক মুহূর্তের Catalog বদলও কড়া Lock পাওয়ার জন্য লাইনে দাঁড়ায়, সেই বিপদ পরের Lab এ।
                </>
            }>
            <div className='grid gap-6 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]'>
                <div className='flex flex-col gap-1.5'>
                    {OPS.map(o => (
                        <button key={o.id} type='button' onClick={() => setId(o.id)} className={cn(BTN, o.id === id ? BTN_ON : BTN_OFF)}>
                            {o.label}
                        </button>
                    ))}
                </div>
                <div className='min-w-0 space-y-5'>
                    <pre className='overflow-x-auto border border-border bg-muted/30 px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                        {op.sql}
                    </pre>
                    <div className='flex flex-wrap items-center gap-2'>
                        <span className='border border-border bg-muted/40 px-2 py-1 font-mono text-[0.6875rem] text-foreground'>{op.lock}</span>
                        {op.extraLock && (
                            <span className='border border-border bg-muted/40 px-2 py-1 font-mono text-[0.6875rem] text-muted-foreground'>
                                + {op.extraLock}
                            </span>
                        )}
                        <span
                            className={cn(
                                'border px-2 py-1 font-mono text-[0.6875rem] font-bold',
                                op.work === 'catalog' ? 'border-primary/60 text-primary' : 'border-destructive/60 text-destructive'
                            )}>
                            {WORK_LABEL[op.work]}
                        </span>
                    </div>
                    <p className='text-sm text-muted-foreground'>{effect.plain}</p>
                    <div className='grid grid-cols-2 gap-2 sm:max-w-md'>
                        <Allowed ok={effect.select} label='SELECT' />
                        <Allowed ok={effect.write} label='INSERT, UPDATE, DELETE' />
                    </div>
                    <div key={op.id}>
                        <WorkPicture work={op.work} reduce={reduce} />
                    </div>
                    <p className='text-sm leading-relaxed text-foreground'>{op.note}</p>
                </div>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. Lock এর লাইন: একটা ALTER কীভাবে পুরো সাইট থামায়                              */
/* ------------------------------------------------------------------------- */

type LaneStatus = 'idle' | 'granted' | 'waiting' | 'failed' | 'done';

interface LaneState {
    status: LaneStatus;
    note: string;
}

interface QueueStep {
    time: string;
    explain: string;
    lanes: [LaneState, LaneState, LaneState, LaneState];
}

const LANES = [
    { who: 'Session A', sql: 'রিপোর্ট: BEGIN; SELECT ... FROM alter_busy; (১২ সেকেন্ড)' },
    { who: 'Session B', sql: 'ALTER TABLE alter_busy ADD COLUMN note text;' },
    { who: 'Session C', sql: 'Website: SELECT count(*) FROM alter_busy;' },
    { who: 'Session D', sql: 'Website: আরেকটা SELECT, আরেকজন Customer' },
];

const IDLE: LaneState = { status: 'idle', note: 'এখনো আসেনি' };

const WITHOUT_TIMEOUT: QueueStep[] = [
    {
        time: '০ সেকেন্ড',
        explain: 'শারমিন আপার মাসিক রিপোর্ট একটা Transaction এর ভেতরে alter_busy পড়ছে। পড়ার জন্য AccessShareLock, যেটা প্রায় কাউকেই আটকায় না।',
        lanes: [{ status: 'granted', note: 'AccessShareLock পেয়েছে' }, IDLE, IDLE, IDLE],
    },
    {
        time: '১ সেকেন্ড',
        explain: 'তানিম ALTER চালালেন। ALTER চায় AccessExclusiveLock, যেটা A এর Lock এর সাথে মেলে না। তাই B লাইনে দাঁড়াল। কাজটা নিজে এক মুহূর্তের, কিন্তু শুরুই করতে পারছে না।',
        lanes: [{ status: 'granted', note: 'পড়ছে' }, { status: 'waiting', note: 'AccessExclusiveLock এর অপেক্ষায়' }, IDLE, IDLE],
    },
    {
        time: '২ সেকেন্ড',
        explain: 'একজন Customer সাইট খুললেন। তাঁর SELECT চায় AccessShareLock, যেটা A এর সাথে দিব্যি মেলে। তবু সে অপেক্ষা করে, কারণ লাইনে তার আগে B দাঁড়িয়ে। PostgreSQL পরে আসা কাউকে লাইন ভেঙে আগে যেতে দেয় না।',
        lanes: [{ status: 'granted', note: 'পড়ছে' }, { status: 'waiting', note: 'অপেক্ষায়' }, { status: 'waiting', note: 'B এর পেছনে লাইনে' }, IDLE],
    },
    {
        time: '৩ সেকেন্ড',
        explain: 'আরও Customer, আরও SELECT, সবাই লাইনে। বাইরে থেকে মনে হয় সাইট বন্ধ। অথচ কেউ কিছু ভাঙেনি, শুধু একটা রিপোর্ট আর একটা ছোট ALTER।',
        lanes: [{ status: 'granted', note: 'পড়ছে' }, { status: 'waiting', note: 'অপেক্ষায়' }, { status: 'waiting', note: 'অপেক্ষায়' }, { status: 'waiting', note: 'লাইনে' }],
    },
    {
        time: '১২ সেকেন্ড',
        explain: 'রিপোর্ট শেষ, A এর Lock ছাড়া পেল। এবার B Lock পেল, কাজ শেষ করল চোখের পলকে।',
        lanes: [{ status: 'done', note: 'শেষ' }, { status: 'done', note: 'ALTER TABLE' }, { status: 'waiting', note: 'অপেক্ষায়' }, { status: 'waiting', note: 'লাইনে' }],
    },
    {
        time: '১২ সেকেন্ড',
        explain: 'B এর পরে লাইনের সবাই একসাথে ঢুকল। ২৪ Row এর একটা Table এ একটা count(*) অপেক্ষা করেছে প্রায় দশ সেকেন্ড।',
        lanes: [{ status: 'done', note: 'শেষ' }, { status: 'done', note: 'ALTER TABLE' }, { status: 'done', note: 'উত্তর পেল, দেরিতে' }, { status: 'done', note: 'উত্তর পেল, দেরিতে' }],
    },
];

const WITH_TIMEOUT: QueueStep[] = [
    WITHOUT_TIMEOUT[0],
    {
        time: '১ সেকেন্ড',
        explain: "এবার তানিম আগে লিখলেন SET lock_timeout = '2s'। ALTER আগের মতোই লাইনে দাঁড়াল, কিন্তু এবার তার হাতে একটা দুই সেকেন্ডের ঘড়ি।",
        lanes: [{ status: 'granted', note: 'পড়ছে' }, { status: 'waiting', note: 'অপেক্ষায়, ঘড়ি চলছে' }, IDLE, IDLE],
    },
    {
        time: '২ সেকেন্ড',
        explain: 'Customer এর SELECT এসে আগের মতোই B এর পেছনে দাঁড়াল। এখনো সমস্যা আছে, তবে তার মেয়াদ বড়জোর আর এক সেকেন্ড।',
        lanes: [{ status: 'granted', note: 'পড়ছে' }, { status: 'waiting', note: 'অপেক্ষায়' }, { status: 'waiting', note: 'B এর পেছনে লাইনে' }, IDLE],
    },
    {
        time: '৩ সেকেন্ড',
        explain: 'দুই সেকেন্ড শেষ। B নিজে থেকে হাল ছেড়ে দিল: ERROR: canceling statement due to lock timeout। লাইন থেকে সে সরতেই পেছনের সবাই ঢুকে গেল। সাইট থেমেছিল দুই সেকেন্ড, দশ না।',
        lanes: [
            { status: 'granted', note: 'পড়ছে' },
            { status: 'failed', note: 'lock timeout, কিছুই বদলায়নি' },
            { status: 'done', note: 'উত্তর পেল' },
            { status: 'done', note: 'সাথে সাথে উত্তর' },
        ],
    },
    {
        time: '১৩ সেকেন্ড',
        explain: 'রিপোর্ট শেষ হওয়ার পরে তানিম একই ALTER আবার চালালেন। এবার লাইনে কেউ নেই, এক মুহূর্তে শেষ। ভালো Migration Script এই চেষ্টা নিজেই কয়েকবার করে।',
        lanes: [
            { status: 'done', note: 'শেষ' },
            { status: 'done', note: 'দ্বিতীয় চেষ্টায় ALTER TABLE' },
            { status: 'done', note: 'উত্তর পেয়েছে' },
            { status: 'done', note: 'উত্তর পেয়েছে' },
        ],
    },
];

const STATUS_STYLE: Record<LaneStatus, string> = {
    idle: 'border-border text-muted-foreground',
    granted: 'border-primary bg-primary/10 text-primary',
    waiting: 'border-amber-500/70 bg-amber-500/10 text-amber-700 dark:text-amber-400',
    failed: 'border-destructive bg-destructive/10 text-destructive',
    done: 'border-border bg-muted/40 text-foreground',
};

const STATUS_LABEL: Record<LaneStatus, string> = {
    idle: 'নেই',
    granted: 'চলছে',
    waiting: 'অপেক্ষা',
    failed: 'বাতিল',
    done: 'শেষ',
};

/**
 * The lock queue: a long report holds a weak lock, an ALTER waits for a strong
 * one, and every query after it waits behind the ALTER. With lock_timeout the
 * ALTER gives up after two seconds instead and the queue drains.
 */
export function LockQueueLab() {
    const reduce = useReducedMotion() ?? false;
    const [withTimeout, setWithTimeout] = useState(false);
    const [step, setStep] = useState(0);
    const steps = withTimeout ? WITH_TIMEOUT : WITHOUT_TIMEOUT;
    const current = steps[Math.min(step, steps.length - 1)];

    const choose = (value: boolean) => {
        setWithTimeout(value);
        setStep(0);
    };

    return (
        <Panel
            label='Lab'
            title='Lock এর লাইন'
            footer={
                <>
                    এই গল্পটা বানানো না। লেখার সময় postgres:18 Container এ চারটা psql Session দিয়ে হুবহু এটা চালানো হয়েছে: lock_timeout
                    দেওয়া ALTER দুই সেকেন্ডে বাতিল হয়েছে, lock_timeout ছাড়া ALTER অপেক্ষা করেছে ৮.১৮ সেকেন্ড, আর তার পেছনের count(*)
                    অপেক্ষা করেছে ৭.৬৯ সেকেন্ড, মাত্র ২৪ Row এর Table এ। সেই psql Output নিচে আছে।
                </>
            }>
            <div className='flex flex-wrap gap-2'>
                <button type='button' onClick={() => choose(false)} className={cn(BTN, !withTimeout ? BTN_ON : BTN_OFF)}>
                    lock_timeout ছাড়া
                </button>
                <button type='button' onClick={() => choose(true)} className={cn(BTN, withTimeout ? BTN_ON : BTN_OFF)}>
                    {"SET lock_timeout = '2s' দিয়ে"}
                </button>
            </div>

            <div className='mt-6 flex flex-wrap items-center gap-3'>
                <button
                    type='button'
                    onClick={() => setStep(s => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className={cn(BTN, BTN_OFF, 'disabled:opacity-40')}>
                    আগের ধাপ
                </button>
                <button
                    type='button'
                    onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
                    disabled={step >= steps.length - 1}
                    className={cn(BTN, BTN_ON, 'disabled:opacity-40')}>
                    পরের ধাপ
                </button>
                <span className='font-mono text-[0.6875rem] text-muted-foreground'>
                    ধাপ {toBn(step + 1)} / {toBn(steps.length)} · {current.time}
                </span>
            </div>

            <div className='mt-6 space-y-2'>
                {LANES.map((lane, i) => {
                    const state = current.lanes[i];
                    return (
                        <div key={lane.who} className='grid items-center gap-2 border border-border px-3 py-2 sm:grid-cols-[6rem_minmax(0,1fr)_minmax(0,14rem)]'>
                            <span className='font-mono text-[0.6875rem] font-bold text-foreground'>{lane.who}</span>
                            <span className='min-w-0 truncate font-mono text-[0.6875rem] text-muted-foreground' title={lane.sql}>
                                {lane.sql}
                            </span>
                            <motion.span
                                key={`${withTimeout}-${step}-${i}-${state.status}`}
                                initial={reduce ? false : { opacity: 0.4, x: 6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, ease: EASE }}
                                className={cn('border px-2 py-1 text-[0.6875rem] font-bold', STATUS_STYLE[state.status])}>
                                {STATUS_LABEL[state.status]}: {state.note}
                            </motion.span>
                        </div>
                    );
                })}
            </div>

            <motion.p
                key={`${withTimeout}-${step}`}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, ease: EASE }}
                className='mt-5 text-sm leading-relaxed text-foreground'>
                {current.explain}
            </motion.p>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. NOT VALID থেকে VALIDATE, ধাপে ধাপে                                          */
/* ------------------------------------------------------------------------- */

interface PriceRow {
    id: number;
    title: string;
    price: string;
}

interface ValidStep {
    sql: string;
    result: string;
    error?: string;
    detail?: string;
    constraint: 'none' | 'not-valid' | 'valid';
    rows: PriceRow[];
    explain: string;
}

const START_ROWS: PriceRow[] = [
    { id: 1, title: 'Old promo trip', price: '0.00' },
    { id: 2, title: 'Sajek weekend', price: '9500.00' },
    { id: 3, title: 'Free city walk', price: '0.00' },
    { id: 4, title: 'Sundarbans 3 days', price: '18000.00' },
];

const FIXED_ROWS: PriceRow[] = START_ROWS.map(row => (row.price === '0.00' ? { ...row, price: '500.00' } : row));

// Each result and error below is copied from PostgreSQL 18 running these
// statements one after another on the same table.
const VALID_STEPS: ValidStep[] = [
    {
        sql: 'ALTER TABLE alter_prices\n  ADD CONSTRAINT alter_prices_min_check CHECK (price_bdt >= 500);',
        result: '',
        error: 'check constraint "alter_prices_min_check" of relation "alter_prices" is violated by some row',
        constraint: 'none',
        rows: START_ROWS,
        explain: 'সাধারণ ADD CONSTRAINT সব পুরনো Row পরীক্ষা করে, দুটো 0 দামের Row পেয়ে পুরো কাজ বাতিল করে। Constraint যোগই হয়নি।',
    },
    {
        sql: 'ALTER TABLE alter_prices\n  ADD CONSTRAINT alter_prices_min_check CHECK (price_bdt >= 500) NOT VALID;',
        result: 'ALTER TABLE',
        constraint: 'not-valid',
        rows: START_ROWS,
        explain: 'NOT VALID শব্দটা PostgreSQL কে জানাল যে পুরনো Row এখন পরীক্ষা করার দরকার নেই। Constraint যোগ হলো, কিন্তু convalidated = false। দুটো পুরনো ভুল Row আগের মতোই আছে।',
    },
    {
        sql: "INSERT INTO alter_prices VALUES (5, 'New free trip', 0);",
        result: '',
        error: 'new row for relation "alter_prices" violates check constraint "alter_prices_min_check"',
        detail: 'Failing row contains (5, New free trip, 0.00).',
        constraint: 'not-valid',
        rows: START_ROWS,
        explain: 'নতুন Row এর জন্য Constraint পুরোপুরি চালু। আজ থেকে আর কোনো 0 দামের ট্যুর ঢুকতে পারবে না।',
    },
    {
        sql: "UPDATE alter_prices\n  SET title = 'Old promo trip (2024)'\n  WHERE trip_id = 1;",
        result: '',
        error: 'new row for relation "alter_prices" violates check constraint "alter_prices_min_check"',
        detail: 'Failing row contains (1, Old promo trip (2024), 0.00).',
        constraint: 'not-valid',
        rows: START_ROWS,
        explain: 'ফাঁদটা এখানে। শুধু নাম বদলাচ্ছিলেন, দাম না। কিন্তু UPDATE পুরো নতুন Row টা পরীক্ষা করে, আর সেই Row এ দাম এখনো 0। পুরনো ভুল Row গুলো ঠিক না করা পর্যন্ত সেগুলোর কিছুই বদলানো যাবে না।',
    },
    {
        sql: 'UPDATE alter_prices\n  SET price_bdt = 500\n  WHERE price_bdt < 500;',
        result: 'UPDATE 2',
        constraint: 'not-valid',
        rows: FIXED_ROWS,
        explain: 'দুটো পুরনো Row ঠিক হলো। বড় Table এ এই কাজ ছোট ছোট ভাগে করা হয়, সাইট চালু রেখেই।',
    },
    {
        sql: 'ALTER TABLE alter_prices\n  VALIDATE CONSTRAINT alter_prices_min_check;',
        result: 'ALTER TABLE',
        constraint: 'valid',
        rows: FIXED_ROWS,
        explain: 'এবার পুরো Table পড়ে একটাও ভুল পাওয়া গেল না, convalidated = true। পড়ার সময় Lock ছিল ShareUpdateExclusiveLock, তাই সাইট এক মুহূর্তও থামেনি।',
    },
];

const CONSTRAINT_BADGE: Record<ValidStep['constraint'], { text: string; style: string }> = {
    none: { text: 'Constraint নেই', style: 'border-border text-muted-foreground' },
    'not-valid': { text: 'আছে, NOT VALID (convalidated = false)', style: 'border-amber-500/70 bg-amber-500/10 text-amber-700 dark:text-amber-400' },
    valid: { text: 'আছে, VALID (convalidated = true)', style: 'border-primary bg-primary/10 text-primary' },
};

/**
 * Six statements on one small table: the plain ADD CONSTRAINT that fails, the
 * NOT VALID that succeeds, a new bad row rejected, the update trap on an old
 * bad row, the fix, and the VALIDATE that finishes the job.
 */
export function NotValidLab() {
    const reduce = useReducedMotion() ?? false;
    const [step, setStep] = useState(0);
    const current = VALID_STEPS[step];
    const badge = CONSTRAINT_BADGE[current.constraint];

    return (
        <Panel
            label='Lab'
            title='NOT VALID থেকে VALIDATE'
            footer='প্রতিটা Result আর Error হুবহু PostgreSQL 18 থেকে নেওয়া, এই ছয়টা Statement একটার পর একটা একই Table এ চালিয়ে। নিচের Query Box এ আপনি নিজে একই কাজ করবেন।'>
            <div className='flex flex-wrap gap-1.5'>
                {VALID_STEPS.map((s, i) => (
                    <button key={s.sql} type='button' onClick={() => setStep(i)} className={cn(BTN, i === step ? BTN_ON : BTN_OFF)}>
                        ধাপ {toBn(i + 1)}
                    </button>
                ))}
            </div>

            <div className='mt-6 grid gap-6 lg:grid-cols-2'>
                <div className='min-w-0 space-y-3'>
                    <pre className='overflow-x-auto border border-border bg-muted/30 px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground'>
                        {current.sql}
                    </pre>
                    <motion.div
                        key={step}
                        initial={reduce ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}>
                        {current.error ? (
                            <div className='border border-destructive/40 bg-destructive/5 px-4 py-3 font-mono text-[0.75rem] leading-relaxed'>
                                <p className='font-bold text-destructive'>ERROR: {current.error}</p>
                                {current.detail && <p className='mt-1 text-muted-foreground'>DETAIL: {current.detail}</p>}
                            </div>
                        ) : (
                            <p className='border border-primary/40 bg-primary/5 px-4 py-3 font-mono text-[0.75rem] font-bold text-primary'>
                                {current.result}
                            </p>
                        )}
                    </motion.div>
                    <p className='text-sm leading-relaxed text-foreground'>{current.explain}</p>
                </div>
                <div className='min-w-0 space-y-3'>
                    <span className={cn('inline-block border px-2 py-1 text-[0.6875rem] font-bold', badge.style)}>{badge.text}</span>
                    <table className='w-full border border-border font-mono text-[0.75rem]'>
                        <thead className='bg-muted/40 text-left text-muted-foreground'>
                            <tr>
                                <th className='px-3 py-2 font-normal'>trip_id</th>
                                <th className='px-3 py-2 font-normal'>title</th>
                                <th className='px-3 py-2 text-right font-normal'>price_bdt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {current.rows.map(row => {
                                const bad = row.price === '0.00';
                                return (
                                    <tr key={row.id} className={cn('border-t border-border', bad && 'bg-destructive/5')}>
                                        <td className='px-3 py-2'>{row.id}</td>
                                        <td className='px-3 py-2'>{row.title}</td>
                                        <td className={cn('px-3 py-2 text-right', bad && 'font-bold text-destructive')}>{row.price}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <p className='text-[0.6875rem] text-muted-foreground'>লাল Row মানে শর্ত (price_bdt &gt;= 500) ভাঙছে।</p>
                </div>
            </div>
        </Panel>
    );
}
