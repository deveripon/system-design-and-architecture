'use client';

import { cn, toBn } from '@/lib/utils';
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
/* 1. Pattern বদলান, দেখুন কোন Row মেলে আর কোথায়                               */
/* ------------------------------------------------------------------------- */

/**
 * The real values from the sample database, plus one made-up list of phone
 * numbers typed the way people really type them.
 */
const DATASETS = {
    titles: {
        label: 'tours.title',
        column: 'title',
        from: 'tours',
        rows: [
            'Saint Martin Island Escape',
            "Cox's Bazar Beach Weekend",
            'Sundarbans Mangrove Cruise',
            'Sajek Valley Cloud Trip',
            'Bandarban Hill Trek',
            'Sylhet Tea Garden Tour',
            'Ratargul Swamp Boat Day',
            'Saint Martin Luxury Stay',
            "Cox's Bazar Family Package",
        ],
    },
    names: {
        label: 'customers.full_name',
        column: 'full_name',
        from: 'customers',
        rows: [
            'Rahim Uddin',
            'Nusrat Jahan',
            'Tanvir Ahmed',
            'Farhana Akter',
            'Sabbir Hossain',
            'Mitu Rahman',
            'Arif Chowdhury',
            'Sumaiya Islam',
            'Priya Sharma',
            'Aiman Zulkifli',
            'Oliver Bennett',
            'Kamal Hasan',
            'Shuvo Das',
            'Lamia Haque',
            'Imran Kabir',
        ],
    },
    comments: {
        label: 'reviews.comment',
        column: 'comment',
        from: 'reviews',
        rows: [
            'Crystal clear water and a very caring guide.',
            'Lovely trip, the ship back was crowded.',
            'Worth every taka.',
            'Saw a crocodile on the second day!',
            'The boat was two hours late.',
            'Sunrise above the clouds is unreal.',
            'Too much walking for me.',
            'Tea gardens were beautiful, food was average.',
        ],
    },
    phones: {
        label: 'হাতে লেখা ফোন নম্বর',
        column: 'typed',
        from: '(VALUES ...)',
        rows: [
            '01000-000101',
            '+880 1000 000102',
            '880-1000-000103',
            '(010) 0000 0104',
            '1000000105',
            '01000 00010',
            'call 01000-000107',
            '01000000108',
        ],
    },
} as const;

type DatasetKey = keyof typeof DATASETS;

/**
 * Only features that behave the same in the browser's engine and in
 * PostgreSQL: literals, ., classes, \d, \s, quantifiers, ^, $, groups and |.
 * Every count below was checked against PostgreSQL.
 */
const PRESETS = [
    { id: 'saint', pattern: 'Saint', insensitive: false, note: 'একটা সাধারণ শব্দ, লেখার যেকোনো জায়গায়' },
    { id: 'bazar-i', pattern: 'bazar', insensitive: true, note: '~* মানে বড় ছোট অক্ষর এক' },
    { id: 'start-s', pattern: '^S', insensitive: false, note: '^ মানে লেখার একদম শুরুতে' },
    { id: 'end-tour-trip', pattern: '(Tour|Trip)$', insensitive: false, note: 'দুটোর যেকোনো একটা, আর ঠিক শেষে' },
    { id: 'vowel-start', pattern: '^[AEIOU]', insensitive: false, note: 'বন্ধনীর ভেতরের যেকোনো একটা অক্ষর' },
    { id: 'boat-ship', pattern: '(boat|ship)', insensitive: true, note: 'মন্তব্যে নৌকা বা জাহাজের কথা' },
    { id: 'digit', pattern: '\\d', insensitive: false, note: 'কোথাও অন্তত একটা অঙ্ক' },
    { id: 'eleven', pattern: '^\\d{11}$', insensitive: false, note: 'শুধু অঙ্ক, ঠিক ১১টা, আর কিছু না' },
    { id: 'non-digit', pattern: '[^0-9]', insensitive: false, note: 'অঙ্ক নয় এমন কোনো একটা চিহ্ন' },
] as const;

type PresetId = (typeof PRESETS)[number]['id'];

function firstMatch(value: string, re: RegExp): [number, number] | null {
    const m = re.exec(value);
    if (!m) return null;
    return [m.index, m.index + m[0].length];
}

export function RegexTesterLab() {
    const [dataset, setDataset] = useState<DatasetKey>('titles');
    const [presetId, setPresetId] = useState<PresetId>('saint');
    const preset = PRESETS.find(p => p.id === presetId) ?? PRESETS[0];
    const data = DATASETS[dataset];
    const re = new RegExp(preset.pattern, preset.insensitive ? 'i' : '');
    const results = data.rows.map(value => ({ value, span: firstMatch(value, re) }));
    const count = results.filter(r => r.span).length;
    const op = preset.insensitive ? '~*' : '~';

    return (
        <Panel
            label='Regex Lab'
            title='Pattern বেছে নিন, দেখুন কোন Row মেলে আর ঠিক কোন অংশটা'
            footer={
                <>
                    হাইলাইট করা অংশটা হলো প্রথম যে জায়গায় Pattern মিলেছে। Regex পুরো লেখা মেলায় না,
                    লেখার ভেতরে একটা মিল খুঁজে পেলেই true। প্রতিটা গোনা PostgreSQL এ একই Pattern
                    চালিয়ে মিলিয়ে দেখা, তাই এখানে যা দেখছেন, নিচের Query বক্সেও তাই পাবেন। শেষ
                    তালিকাটা Database এর না, মানুষ যেভাবে ফোন নম্বর লেখে তার নমুনা।
                </>
            }>
            <div className='space-y-5'>
                <div>
                    <p className='mb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        কোন Column এ খুঁজবেন
                    </p>
                    <div className='flex flex-wrap gap-2'>
                        {(Object.keys(DATASETS) as DatasetKey[]).map(key => (
                            <button
                                key={key}
                                type='button'
                                data-dataset={key}
                                onClick={() => setDataset(key)}
                                className={cn(BTN, 'font-mono', dataset === key ? BTN_ON : BTN_OFF)}>
                                {DATASETS[key].label}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <p className='mb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground'>
                        Pattern
                    </p>
                    <div className='flex flex-wrap gap-2'>
                        {PRESETS.map(p => (
                            <button
                                key={p.id}
                                type='button'
                                data-preset={p.id}
                                onClick={() => setPresetId(p.id)}
                                className={cn(BTN, 'font-mono', presetId === p.id ? BTN_ON : BTN_OFF)}>
                                {p.insensitive ? '~* ' : '~ '}
                                {p.pattern}
                            </button>
                        ))}
                    </div>
                    <p className='mt-2 text-[0.8125rem] text-muted-foreground'>{preset.note}</p>
                </div>

                <pre className='overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.8125rem] text-foreground'>
                    {`SELECT ${data.column}\nFROM ${data.from}\nWHERE ${data.column} ${op} '${preset.pattern}';`}
                </pre>

                <ul className='divide-y divide-border/60 border border-border' data-count={count}>
                    {results.map(({ value, span }) => (
                        <li
                            key={value}
                            className={cn(
                                'flex items-center justify-between gap-3 px-4 py-2 font-mono text-[0.75rem]',
                                span ? 'bg-primary/5' : ''
                            )}>
                            <span className='min-w-0 break-words'>
                                {span ? (
                                    <>
                                        {value.slice(0, span[0])}
                                        <mark className='bg-primary/25 text-foreground px-0.5'>
                                            {value.slice(span[0], span[1])}
                                        </mark>
                                        {value.slice(span[1])}
                                    </>
                                ) : (
                                    <span className='text-muted-foreground'>{value}</span>
                                )}
                            </span>
                            <span
                                className={cn(
                                    'shrink-0 text-[0.625rem] font-bold uppercase tracking-[0.12em]',
                                    span ? 'text-primary' : 'text-muted-foreground/60'
                                )}>
                                {span ? 'true' : 'false'}
                            </span>
                        </li>
                    ))}
                </ul>
                <p className='font-mono text-[0.75rem] text-foreground'>
                    {toBn(data.rows.length)}টা Row এর মধ্যে মিলেছে {toBn(count)}টা।
                </p>
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. একটা এলোমেলো ফোন নম্বর, তিন ধাপে পরিষ্কার                                */
/* ------------------------------------------------------------------------- */

const MESSY = [
    '01000-000101',
    '+880 1000 000102',
    '880-1000-000103',
    '(010) 0000 0104',
    '1000000105',
    '01000 00010',
    'call 01000-000107',
];

export function CleanupStepsLab() {
    const [typed, setTyped] = useState(MESSY[0]);
    const [step, setStep] = useState(0);

    const digits = typed.replace(/\D/g, '');
    const valid = /^(880|0)1\d{9}$/.test(digits);
    const normalized = `+880${digits.slice(-10)}`;

    const steps = [
        {
            title: 'অঙ্ক ছাড়া সব মুছে ফেলুন',
            sql: `regexp_replace(typed, '\\D', '', 'g')`,
            result: digits,
            note: '\\D মানে অঙ্ক নয় এমন যেকোনো চিহ্ন। g Flag দিলে প্রথমটা না, প্রতিটাই মোছে। Space, Dash, বন্ধনী, + আর লেখা সব চলে যায়।',
        },
        {
            title: 'আকারটা ঠিক আছে কিনা দেখুন',
            sql: `digits ~ '^(880|0)1\\d{9}$'`,
            result: valid ? 'true' : 'false',
            note: valid
                ? 'শুরুতে 880 বা 0, তারপর 1, তারপর ঠিক নয়টা অঙ্ক। এই নম্বরটা সেই আকারে আছে।'
                : 'আকারটা মেলেনি: হয় শুরুতে 880 বা 0 নেই, নয়তো অঙ্ক কম বা বেশি। এখানেই থামতে হবে, এই নম্বর আন্দাজে ঠিক করা যায় না।',
        },
        {
            title: 'একটাই আকারে লিখুন',
            sql: `'+880' || right(digits, 10)`,
            result: valid ? normalized : 'বাদ',
            note: valid
                ? 'শেষের দশটা অঙ্ক সবসময় একই, শুরু যেভাবেই লেখা হোক। তার আগে +880 বসালেই সব নম্বর এক চেহারার।'
                : 'আগের ধাপে আকার মেলেনি, তাই এই নম্বর Report এ যাবে না। পরে কাউকে দিয়ে হাতে যাচাই করানোই ঠিক।',
        },
    ];

    return (
        <Panel
            label='Cleanup Lab'
            title='মানুষের লেখা ফোন নম্বর, তিন ধাপে এক চেহারায়'
            footer={
                <>
                    প্রতিটা ধাপের ফল PostgreSQL এ একই Expression চালিয়ে মিলিয়ে দেখা। ধাপ দুই সবচেয়ে
                    জরুরি: আকার না মিললে নম্বরটা বদলাবেন না, আলাদা করে রাখবেন। ভুল নম্বর সুন্দর করে
                    লিখলেও ভুলই থাকে।
                </>
            }>
            <div className='space-y-5'>
                <div className='flex flex-wrap gap-2'>
                    {MESSY.map(value => (
                        <button
                            key={value}
                            type='button'
                            data-typed={value}
                            onClick={() => {
                                setTyped(value);
                                setStep(0);
                            }}
                            className={cn(BTN, 'font-mono', typed === value ? BTN_ON : BTN_OFF)}>
                            {value}
                        </button>
                    ))}
                </div>

                <ol className='space-y-3' data-valid={valid ? 'yes' : 'no'}>
                    {steps.map((s, i) => {
                        const shown = i <= step;
                        return (
                            <li
                                key={s.title}
                                className={cn(
                                    'border px-4 py-3 transition-colors',
                                    shown ? 'border-primary/50 bg-primary/5' : 'border-border opacity-50'
                                )}>
                                <p className='font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-primary'>
                                    ধাপ {toBn(i + 1)}: {s.title}
                                </p>
                                <p className='mt-1 font-mono text-[0.75rem] text-muted-foreground'>{s.sql}</p>
                                {shown && (
                                    <>
                                        <p className='mt-2 font-mono text-[0.875rem] font-bold text-foreground'>{s.result}</p>
                                        <p className='mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground'>{s.note}</p>
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ol>

                <div className='flex flex-wrap gap-2'>
                    <button
                        type='button'
                        data-action='next'
                        disabled={step >= steps.length - 1}
                        onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
                        className={cn(BTN, BTN_OFF, 'disabled:opacity-40')}>
                        পরের ধাপ
                    </button>
                    <button
                        type='button'
                        data-action='restart'
                        onClick={() => setStep(0)}
                        className={cn(BTN, BTN_OFF)}>
                        আবার শুরু
                    </button>
                </div>
            </div>
        </Panel>
    );
}
