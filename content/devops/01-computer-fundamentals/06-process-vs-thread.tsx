/* eslint-disable react/jsx-key */
import {
    ContentList,
    ContentParagraph,
    ListItem,
    SectionTitle,
} from '../../../components/course/content-components';
import { IslandToursBrief } from '../../../components/course/topics/island-tours/project-brief';
import {
    BlockingVsAsyncLab,
    RaceConditionLab,
} from '../../../components/course/topics/process/animations';
import {
    ConcurrencyVsParallelismDiagram,
    ProcessVsThreadDiagram,
    RaceConditionDiagram,
} from '../../../components/course/topics/process/diagrams';
import {
    CONTENT_TYPES,
    INFO_BOX_VARIANTS,
    TopicData,
} from '../../../types/content';

export const processVsThreadContent: TopicData = {
    id: 'process-vs-thread',
    introduction: {
        badge: 'MODULE 01 · LESSON 06',
        title: <SectionTitle>এক রান্নাঘর, নাকি অনেকগুলো?</SectionTitle>,
        description: (
            <div className='space-y-4'>
                <ContentParagraph>
                    আগের লেসনে দেখেছেন Kernel এক Core কে ভাগ করে অনেকগুলো কাজের
                    মধ্যে বিলিয়ে দেয়। কিন্তু ওই কাজগুলো আসলে কী? Kernel ঠিক
                    কাকে গিয়ে বলে যে এবার তার পালা?
                </ContentParagraph>
                <ContentParagraph>
                    একটা রেস্টুরেন্টের কথা ভাবুন। সেখানে যদি দুইটা আলাদা
                    রান্নাঘর থাকে, প্রতিটার নিজের চুলা, নিজের ফ্রিজ আর নিজের
                    বাসনপত্র, তাহলে এক রান্নাঘরে আগুন লাগলেও অন্যটায় রান্না
                    চলতে থাকে। কিন্তু একজনের লবণ শেষ হলে সে অন্য রান্নাঘর থেকে
                    চেয়ে নিতে পারে না, দরজা দিয়ে বলে পাঠাতে হয়।
                </ContentParagraph>
                <ContentParagraph>
                    আবার একটা রান্নাঘরে যদি তিনজন রাঁধুনি থাকেন, তাঁরা একই ফ্রিজ
                    আর একই টেবিল ব্যবহার করেন। জিনিস ভাগ করা এখানে অসম্ভব সহজ।
                    কিন্তু দুইজন যদি একই সময়ে একই হাঁড়িতে হাত দেন, তখন যা হয়
                    সেটাই আজকের লেসনের সবচেয়ে জরুরি অংশ।
                </ContentParagraph>
                <ContentParagraph>
                    আলাদা রান্নাঘরের নাম <strong>Process</strong>, আর এক
                    রান্নাঘরের রাঁধুনিদের নাম <strong>Thread</strong>।
                </ContentParagraph>
            </div>
        ),
        quote: {
            text: 'Process আলাদা থাকে বলে নিরাপদ। Thread ভাগ করে বলে দ্রুত। এই একটা বাক্যেই দুইটার পুরো তফাত।',
            author: 'Computer Fundamentals',
            role: 'Lesson 06',
        },
    },
    sections: [
        /* ---------------------------------------------------------------- 1 */
        {
            id: 'theory',
            subHeader: { index: '001', title: 'Theory' },
            title: <SectionTitle>Process আর Thread</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                একটা <strong>Process</strong> মানে চলতে থাকা
                                একটা Program। তার নিজের Virtual Memory আছে,
                                নিজের খোলা ফাইলের তালিকা আছে, আর Kernel এর কাছে
                                তার নিজের একটা নম্বর আছে, যাকে বলে PID।
                            </ContentParagraph>
                            <ContentParagraph>
                                একটা <strong>Thread</strong> হলো ওই Process এর
                                ভেতরে চলতে থাকা একটা কাজের ধারা। প্রতিটা Thread
                                এর নিজের একটা Stack থাকে, কারণ প্রত্যেকে আলাদা
                                ফাংশনের ভেতরে থাকতে পারে। কিন্তু Heap, খোলা
                                ফাইল আর বাকি সব কিছু তারা ভাগ করে নেয়।
                            </ContentParagraph>
                            <ContentParagraph>
                                এই ভাগ করে নেওয়াটাই Thread এর সবচেয়ে বড় সুবিধা,
                                আর সবচেয়ে বড় বিপদ। সুবিধা, কারণ এক Thread এর
                                বানানো জিনিস অন্য Thread সাথে সাথেই ব্যবহার করতে
                                পারে। বিপদ, কারণ দুইজন একসাথে একই জিনিস বদলাতে
                                গেলে হিসাব গুলিয়ে যায়।
                            </ContentParagraph>
                        </div>
                    ),
                },
                { type: CONTENT_TYPES.CUSTOM, component: <ProcessVsThreadDiagram /> },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['', 'Process', 'Thread'],
                    rows: [
                        [
                            <span className='font-bold'>Memory</span>,
                            'নিজের আলাদা Memory',
                            'একই Memory ভাগ করে নেয়',
                        ],
                        [
                            <span className='font-bold'>তৈরি করার খরচ</span>,
                            'বেশি, নতুন করে সব সাজাতে হয়',
                            'অনেক কম, ভেতরেই আরেকটা ধারা',
                        ],
                        [
                            <span className='font-bold'>একটা Crash করলে</span>,
                            'শুধু ওই Process মরে',
                            'পুরো Process নিয়ে মরে',
                        ],
                        [
                            <span className='font-bold'>ডেটা ভাগ করা</span>,
                            'আলাদা ব্যবস্থা লাগে, যেমন Socket বা Pipe',
                            'সরাসরি, একই Variable',
                        ],
                        [
                            <span className='font-bold'>ঝুঁকি</span>,
                            'কম, কারণ কেউ কারো জায়গায় নেই',
                            'Race Condition, কারণ সবাই একই জায়গায়',
                        ],
                    ],
                },
            ],
        },
        /* ---------------------------------------------------------------- 2 */
        {
            id: 'concurrency',
            subHeader: { index: '002', title: 'The Distinction' },
            title: (
                <SectionTitle>Concurrency আর Parallelism</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                এই দুইটা শব্দ প্রায় সবাই গুলিয়ে ফেলেন, অথচ
                                তফাতটা খুব সহজ।
                            </ContentParagraph>
                            <ContentParagraph>
                                <strong>Concurrency</strong> মানে একজন রাঁধুনি
                                একসাথে অনেকগুলো রান্না সামলাচ্ছেন। ভাত বসিয়ে
                                দিয়ে তিনি ডাল ধরেন, ডাল ফুটতে দিয়ে ভাতে ফেরেন।
                                এক সময়ে তাঁর হাত একটা কাজেই থাকে, কিন্তু কোনো
                                রান্না অপেক্ষায় থেমে থাকে না।
                            </ContentParagraph>
                            <ContentParagraph>
                                <strong>Parallelism</strong> মানে সত্যিই দুইজন
                                রাঁধুনি দুইটা চুলায় একসাথে রান্না করছেন। এটা
                                করতে হলে সত্যিকারের একাধিক Core লাগে।
                            </ContentParagraph>
                            <ContentParagraph>
                                এক Core এও Concurrency সম্ভব, কারণ অপেক্ষার
                                সময়টা অন্য কাজে লাগানো যায়। কিন্তু Parallelism
                                এর জন্য একাধিক Core ছাড়া উপায় নেই।
                            </ContentParagraph>
                        </div>
                    ),
                },
                { type: CONTENT_TYPES.CUSTOM, component: <ConcurrencyVsParallelismDiagram /> },
                { type: CONTENT_TYPES.CUSTOM, component: <BlockingVsAsyncLab /> },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'Node.js এক Thread এ এত Request সামলায় কীভাবে',
                    content: (
                        <p>
                            একটা সাধারণ API এর সময়ের বেশিরভাগটাই অপেক্ষা,
                            Database এর উত্তর বা অন্য কোনো Service এর জবাবের
                            অপেক্ষা। ওই অপেক্ষার সময় CPU এর কোনো কাজ নেই। Node
                            সেই সময়টা খালি না রেখে পরের Request ধরে, আর উত্তর
                            এলে আগেরটায় ফিরে যায়। এটাই Concurrency। কিন্তু
                            একটা ভারী হিসাব, যেমন ছবি Resize করা, ওই এক Thread
                            কেই আটকে রাখে, আর তখন বাকি সব Request দাঁড়িয়ে
                            থাকে।
                        </p>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 3 */
        {
            id: 'race',
            subHeader: { index: '003', title: 'Race Condition' },
            title: <SectionTitle>একই Seat দুইজনকে বিক্রি</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                এবার সেই বিপদের কথা বলি, যেটা Thread ভাগ করে
                                নেওয়ার কারণে হয়।
                            </ContentParagraph>
                            <ContentParagraph>
                                একটা ট্যুরে শেষ Seat টা বাকি আছে। ঠিক একই
                                মুহূর্তে দুইজন ইউজার Book বোতাম চাপলেন। কোডটা
                                খুব সহজ: কয়টা Seat বাকি আছে সেটা Read করা, এক
                                কমানো, তারপর আবার Write করা।
                            </ContentParagraph>
                            <ContentParagraph>
                                সমস্যা হলো, এই তিনটা ধাপ একসাথে ঘটে না। পড়া আর
                                লেখার মাঝখানে অন্য কেউ ঢুকে পড়তে পারে। আর ঠিক
                                সেটাই ঘটলে দুইজনই দেখেন একটা Seat খালি, আর
                                দুইজনই বুক করে ফেলেন।
                            </ContentParagraph>
                        </div>
                    ),
                },
                { type: CONTENT_TYPES.CUSTOM, component: <RaceConditionDiagram /> },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            নিচের গল্পটা চালিয়ে দেখুন। প্রথমে Lock ছাড়া চালান,
                            আর দেখুন Booking কীভাবে দুইটা হয়ে যায়। তারপর Lock
                            চালু করে একই গল্প আবার দেখুন।
                        </ContentParagraph>
                    ),
                },
                { type: CONTENT_TYPES.CUSTOM, component: <RaceConditionLab /> },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: 'Lock এর নিজের দুইটা বিপদ',
                    content: (
                        <div className='space-y-3'>
                            <p>
                                <strong>Contention।</strong> একই Lock এর জন্য
                                যত বেশি Thread লাইনে দাঁড়ায়, তত বেশি সময় নষ্ট
                                হয়। তখন Thread বাড়ালেও কাজ দ্রুত হয় না, বরং
                                ধীর হয়।
                            </p>
                            <p>
                                <strong>Deadlock।</strong> Thread A হাঁড়ি ধরে
                                হাতা চায়, আর Thread B হাতা ধরে হাঁড়ি চায়।
                                দুইজনই অপেক্ষা করে, আর কেউ কখনো এগোয় না। এটা
                                এড়ানোর সবচেয়ে সহজ নিয়ম হলো, সবাই সবসময় একই
                                ক্রমে Lock নেবে।
                            </p>
                        </div>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 4 */
        {
            id: 'project-example',
            subHeader: { index: '004', title: 'Project Example' },
            title: <SectionTitle>Island Tours এ এই ঝুঁকিগুলো কোথায়</SectionTitle>,
            blocks: [
                { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                উপরের Seat এর গল্পটা কাল্পনিক নয়। ট্যুর বুকিং
                                অ্যাপে এটাই সবচেয়ে বাস্তব ঝুঁকি, আর সিজনের
                                সময় ঠিক এভাবেই ডাবল বুকিং হয়।
                            </ContentParagraph>
                            <ContentList>
                                <ListItem>
                                    <strong>Double Booking এর আসল সমাধান:</strong>{' '}
                                    Node এক Thread এ চলে বলে অনেকে ভাবেন Race
                                    Condition হবে না। কিন্তু await এর প্রতিটা
                                    জায়গায় অন্য Request ঢুকে পড়তে পারে, আর
                                    দুইটা আলাদা Process বা Instance থাকলে তো
                                    কথাই নেই। তাই আসল সমাধান Database এ, যেমন
                                    Transaction এর ভেতরে SELECT FOR UPDATE, বা
                                    Seat এর উপরে একটা শর্ত দেওয়া যাতে শূন্যের
                                    নিচে নামতে না পারে।
                                </ListItem>
                                <ListItem>
                                    <strong>দুইটা vCPU কাজে লাগানো:</strong> একটা
                                    Node Process এক Core এর বেশি ব্যবহার করে না।
                                    তাই Cluster বা PM2 দিয়ে দুইটা Process চালানো
                                    হয়, আর দুইটাই একই Port এ Request নেয়। এটা
                                    Thread নয়, আলাদা Process, তাই একটা মরলে
                                    অন্যটা চলতে থাকে।
                                </ListItem>
                                <ListItem>
                                    <strong>ছবি Resize আর Worker Thread:</strong>{' '}
                                    ছবির কাজ পুরোটাই CPU এর, তাই সেটা মূল Thread
                                    এ করলে পুরো API থেমে যায়। এই কাজ হয় Worker
                                    Thread এ যায়, নয়তো Queue তে গিয়ে আলাদা
                                    Process এ হয়।
                                </ListItem>
                                <ListItem>
                                    <strong>PostgreSQL এর মডেল আলাদা:</strong>{' '}
                                    Postgres প্রতিটা Connection এর জন্য একটা
                                    আলাদা Process খোলে। Process তৈরি করা দামি,
                                    তাই হাজারটা Connection খুললে সার্ভার বসে
                                    যায়। এই কারণেই Connection Pool লাগে, যেটা
                                    Module 14 এ বিস্তারিত দেখব।
                                </ListItem>
                            </ContentList>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: 'মনে রাখার মতো একটা লাইন',
                    content: (
                        <p>
                            Race Condition কোড পড়ে ধরা যায় না, কারণ কোডটা
                            দেখতে একদম ঠিক। ধরা পড়ে তখনই, যখন দুইজন ঠিক একই
                            মুহূর্তে একই জিনিস ছোঁয়। তাই ভাগ করা যেকোনো জিনিস
                            বদলানোর আগে প্রশ্ন করুন, ঠিক এই লাইনে যদি অন্য কেউ
                            ঢুকে পড়ে, তাহলে কী হবে?
                        </p>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 5 */
        {
            id: 'request-flow',
            subHeader: { index: '005', title: 'Step-by-step Flow' },
            title: (
                <SectionTitle>দুইটা Request একসাথে এলে কী হয়</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            ঠিক একই সেকেন্ডে দুইজন ইউজার একই ট্যুরের শেষ Seat
                            টা বুক করতে চাইলেন। Node এর এক Thread এ ধাপগুলো ঠিক
                            এভাবে ঘটে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    stepName: 'STEP',
                    steps: [
                        {
                            title: 'Request A এলো',
                            description:
                                'Thread টা A এর কোড চালাতে শুরু করল, আর Database কে জিজ্ঞেস করল কয়টা Seat বাকি আছে।',
                        },
                        {
                            title: 'A অপেক্ষায় গেল',
                            description:
                                'Database এর উত্তর আসতে কয়েক মিলিসেকেন্ড লাগবে। Thread টা এখানে দাঁড়িয়ে থাকে না, সে অন্য কাজ ধরার জন্য মুক্ত হয়ে যায়।',
                        },
                        {
                            title: 'Request B ঢুকে পড়ল',
                            description:
                                'ঠিক এই ফাঁকে B এর কোড চলা শুরু হলো, আর সেও Database কে একই প্রশ্ন করল। এখানেই দুইজনের হিসাব মিশে যাওয়ার সুযোগ তৈরি হয়।',
                        },
                        {
                            title: 'দুইজনই উত্তর পেল: ১টা Seat বাকি',
                            description:
                                'A এর লেখা তখনো হয়নি, তাই B ও পুরনো সংখ্যাটাই দেখল। কোড দুইটাই ঠিক, কিন্তু দুইজনের কাছেই তথ্যটা পুরনো।',
                        },
                        {
                            title: 'দুইটা Booking লেখা হলো',
                            description:
                                'দুইজনই Seat এক কমিয়ে লিখে দিল। ফল হলো একটা Seat এর বিপরীতে দুইটা Booking।',
                        },
                        {
                            title: 'সমাধান Database এ',
                            description:
                                'Transaction এর ভেতরে Row টা Lock করে রাখলে B কে অপেক্ষা করতে হতো, আর সে আসল সংখ্যাটা দেখে না বলে দিত।',
                        },
                    ],
                },
            ],
        },
        /* ---------------------------------------------------------------- 6 */
        {
            id: 'resources',
            subHeader: { index: '006', title: 'Best Resources' },
            title: <SectionTitle>আরও দেখতে চাইলে</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentList>
                            <ListItem>
                                <strong>Rob Pike, Concurrency is not
                                Parallelism</strong>। এই বিষয়ে সবচেয়ে বিখ্যাত
                                আলোচনা, আর আজও সবচেয়ে পরিষ্কার। YouTube এ এই
                                নামেই খুঁজে পাবেন।
                            </ListItem>
                            <ListItem>
                                <strong>Computerphile</strong>, Search করুন:
                                Threads, আর Deadlock.{' '}
                                <a
                                    href='https://www.youtube.com/@Computerphile'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-primary underline underline-offset-4'>
                                    youtube.com/@Computerphile
                                </a>
                            </ListItem>
                            <ListItem>
                                <strong>পড়ার জন্য</strong>, MDN এর Node.js Event
                                Loop পাতা, আর Node ডকুমেন্টেশনের worker_threads
                                অংশ। Module 08 এ আমরা এই দুইটাতেই গভীরে যাব।
                            </ListItem>
                        </ContentList>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 7 */
        {
            id: 'recap',
            subHeader: { index: '007', title: 'Recap' },
            title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentList>
                            <ListItem>
                                Process মানে আলাদা রান্নাঘর, নিজের Memory আর
                                নিজের ফাইল নিয়ে। Thread মানে একই রান্নাঘরের
                                রাঁধুনি, সব ভাগ করে নেওয়া।
                            </ListItem>
                            <ListItem>
                                Process আলাদা বলে নিরাপদ কিন্তু দামি। Thread ভাগ
                                করে বলে সস্তা কিন্তু ঝুঁকিপূর্ণ।
                            </ListItem>
                            <ListItem>
                                Concurrency মানে অপেক্ষার সময় কাজে লাগানো, যেটা
                                এক Core এও হয়। Parallelism মানে সত্যিই একসাথে
                                চলা, যেটার জন্য একাধিক Core লাগে।
                            </ListItem>
                            <ListItem>
                                Race Condition হয় যখন পড়া আর লেখার মাঝখানে অন্য
                                কেউ ঢুকে পড়ে। কোড দেখতে ঠিকই থাকে, তবু ফল ভুল
                                হয়।
                            </ListItem>
                            <ListItem>
                                Lock ফল ঠিক করে, কিন্তু অপেক্ষা তৈরি করে। বেশি
                                Contention মানে বেশি ধীর, আর ভুল ক্রমে Lock নিলে
                                Deadlock।
                            </ListItem>
                            <ListItem>
                                Node এক Thread এ চলে বলেই Race Condition এড়ানো
                                যায় না, কারণ প্রতিটা await এ অন্য Request ঢুকতে
                                পারে।
                            </ListItem>
                            <ListItem>
                                Booking এর মতো কাজে আসল রক্ষাকবচ Database এর
                                Transaction আর Lock।
                            </ListItem>
                            <ListItem>
                                পরের লেসন: এই সবকিছু মিলিয়ে একটা Program শুরু
                                থেকে শেষ পর্যন্ত কীভাবে চলে।
                            </ListItem>
                        </ContentList>
                    ),
                },
            ],
        },
    ],
    summary: {
        headers: ['শব্দ', 'এক লাইনে'],
        rows: [
            [
                <span className='font-bold text-primary'>Process</span>,
                'চলতে থাকা একটা Program, নিজের Memory নিয়ে',
            ],
            [
                <span className='font-bold text-primary'>Thread</span>,
                'একটা Process এর ভেতরের একটা কাজের ধারা',
            ],
            [
                <span className='font-bold text-primary'>Concurrency</span>,
                'একজনই অনেক কাজ সামলানো, অপেক্ষা কাজে লাগিয়ে',
            ],
            [
                <span className='font-bold text-primary'>Parallelism</span>,
                'সত্যিই একসাথে চলা, একাধিক Core এ',
            ],
            [
                <span className='font-bold text-primary'>Race Condition</span>,
                'পড়া আর লেখার মাঝখানে অন্য কেউ ঢুকে পড়া',
            ],
            [
                <span className='font-bold text-primary'>Lock</span>,
                'একসাথে একজনই ঢুকতে পারবে, এই নিয়ম',
            ],
            [
                <span className='font-bold text-primary'>Deadlock</span>,
                'দুইজন একে অন্যের জিনিসের অপেক্ষায় চিরকাল আটকে থাকা',
            ],
            [
                <span className='font-bold text-primary'>Worker Thread</span>,
                'ভারী CPU এর কাজ মূল Thread থেকে সরিয়ে দেওয়া',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'একটা Thread Crash করলে কী হয়?',
                options: [
                    {
                        key: 'A',
                        text: 'শুধু ওই Thread মরে, বাকিরা চলতে থাকে',
                        isCorrect: false,
                        explanation:
                            'এটা Process এর ক্ষেত্রে সত্যি। Thread রা একই Memory ভাগ করে বলে ঝুঁকিটা সবার।',
                    },
                    {
                        key: 'B',
                        text: 'সাধারণত পুরো Process নিয়েই মরে',
                        isCorrect: true,
                        explanation:
                            'একই Memory ভাগ করার দাম এটাই। এই কারণেই আলাদা রাখতে চাইলে Process ব্যবহার করা হয়।',
                    },
                    {
                        key: 'C',
                        text: 'Kernel সেটাকে আবার চালু করে দেয়',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 2,
                text: 'এক Core এর মেশিনে Concurrency সম্ভব?',
                options: [
                    {
                        key: 'A',
                        text: 'না, এক Core এ একটার বেশি কিছু হয় না',
                        isCorrect: false,
                        explanation:
                            'সত্যিকারের একসাথে চলা হয় না, কিন্তু অপেক্ষার সময় অন্য কাজ ধরা যায়।',
                    },
                    {
                        key: 'B',
                        text: 'হ্যাঁ, কারণ অপেক্ষার সময়টা অন্য কাজে লাগানো যায়',
                        isCorrect: true,
                        explanation:
                            'এটাই Concurrency আর Parallelism এর মূল তফাত। Parallelism এর জন্যই শুধু একাধিক Core লাগে।',
                    },
                    {
                        key: 'C',
                        text: 'শুধু Thread থাকলে সম্ভব',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 3,
                text: 'Node.js এক Thread এ চলে, তাই আপনার Booking কোডে Race Condition হতে পারে না। কথাটা কি ঠিক?',
                options: [
                    {
                        key: 'A',
                        text: 'ঠিক, এক Thread মানে একসাথে দুইজন ঢুকতে পারে না',
                        isCorrect: false,
                        explanation:
                            'প্রতিটা await এ Thread টা অন্য Request ধরতে পারে, তাই ঠিক ওই ফাঁকেই অন্যজন ঢুকে পড়ে।',
                    },
                    {
                        key: 'B',
                        text: 'ভুল, কারণ প্রতিটা await এ অন্য Request ঢুকে পড়তে পারে',
                        isCorrect: true,
                        explanation:
                            'তার উপর Cluster বা একাধিক Instance থাকলে সত্যিকারের সমান্তরাল Request ও থাকে। তাই রক্ষাকবচ Database এ রাখতে হয়।',
                    },
                    {
                        key: 'C',
                        text: 'ঠিক, যদি async ব্যবহার না করেন',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 4,
                text: 'Thread A হাঁড়ি ধরে হাতা চাইছে, Thread B হাতা ধরে হাঁড়ি চাইছে। এটাকে কী বলে?',
                options: [
                    {
                        key: 'A',
                        text: 'Race Condition',
                        isCorrect: false,
                        explanation:
                            'Race Condition এ ফল ভুল হয়। এখানে ফলই আসে না, দুইজন চিরকাল দাঁড়িয়ে থাকে।',
                    },
                    {
                        key: 'B',
                        text: 'Deadlock',
                        isCorrect: true,
                        explanation:
                            'এড়ানোর সহজ নিয়ম হলো, সবাই সবসময় একই ক্রমে Lock নেবে।',
                    },
                    {
                        key: 'C',
                        text: 'Context Switch',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 5,
                text: 'আপনার API তে ছবি Resize করার কাজটা মূল Thread এ চলছে। ফল কী হবে?',
                options: [
                    {
                        key: 'A',
                        text: 'শুধু ওই Request ধীর হবে, বাকিরা ঠিক থাকবে',
                        isCorrect: false,
                        explanation:
                            'এটা অপেক্ষার কাজ হলে সত্যি হতো। কিন্তু এটা CPU এর কাজ, তাই Thread টা পুরো আটকে থাকে।',
                    },
                    {
                        key: 'B',
                        text: 'ওই সময়টা পুরো API থেমে থাকবে, সব Request দাঁড়িয়ে যাবে',
                        isCorrect: true,
                        explanation:
                            'তাই এই কাজ Worker Thread এ বা Queue দিয়ে আলাদা Process এ পাঠানো হয়।',
                    },
                    {
                        key: 'C',
                        text: 'Node নিজে থেকেই আরেকটা Thread বানিয়ে নেবে',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 6,
                text: 'PostgreSQL এ হাজারটা Connection খুললে সার্ভার বসে যায় কেন?',
                options: [
                    {
                        key: 'A',
                        text: 'Postgres প্রতিটা Connection এর জন্য আলাদা Process খোলে, আর Process দামি',
                        isCorrect: true,
                        explanation:
                            'প্রতিটা Process এর নিজের Memory লাগে, আর এত Process এর মধ্যে Context Switch ও বেড়ে যায়। সমাধান Connection Pool।',
                    },
                    {
                        key: 'B',
                        text: 'Postgres একসাথে একটার বেশি Query চালাতে পারে না',
                        isCorrect: false,
                    },
                    {
                        key: 'C',
                        text: 'Network এর সীমা শেষ হয়ে যায়',
                        isCorrect: false,
                    },
                ],
            },
        ],
    },
    practicalLab: {
        title: 'Thread আর Race নিজে দেখুন',
        subtitle: 'Terminal এ চারটা পরীক্ষা',
        stepName: 'LAB',
        steps: [
            {
                title: 'কোন Process এর কয়টা Thread আছে দেখুন',
                description:
                    'আপনার মেশিনে চলতে থাকা Process গুলোর Thread সংখ্যা বের করুন। Browser আর Node এর তফাত দেখলে অবাক হবেন।',
            },
            {
                title: 'এক Thread কে আটকে দিন',
                description:
                    'একটা ছোট সার্ভার চালিয়ে তাকে ভারী CPU এর কাজ দিন, আর দেখুন বাকি Request গুলোর কী হয়।',
            },
            {
                title: 'সত্যিকারের Race Condition বানান',
                description:
                    'Worker Thread আর SharedArrayBuffer দিয়ে একটা সংখ্যা একসাথে বাড়ান, আর দেখুন যোগফল মেলে না।',
            },
            {
                title: 'দুইটা Core কাজে লাগান',
                description:
                    'Cluster দিয়ে একই Port এ দুইটা Process চালান, আর দেখুন Request গুলো ভাগ হয়ে যাচ্ছে।',
            },
        ],
        codeBlocks: [
            {
                filename: '1-count-threads.sh',
                language: 'bash',
                code: `# Linux এ প্রতিটা Process এর Thread সংখ্যা
ps -eo pid,nlwp,comm --sort=-nlwp | head -12
# nlwp মানে number of light weight processes, অর্থাৎ Thread

# একটা নির্দিষ্ট Process এর সব Thread
ps -eLf | grep node | head

# htop এ H চাপলে Thread গুলো আলাদা করে দেখা যায়

# macOS এ
ps -M <PID>

# খেয়াল করুন, একটা Node Process এও কয়েকটা Thread থাকে।
# আপনার কোড একটাতে চলে, বাকিগুলো libuv এর, ফাইল আর DNS এর কাজ করে।`,
            },
            {
                filename: '2-blocking-server.js',
                language: 'javascript',
                code: `// এক Thread কে আটকে দিলে কী হয়, নিজে দেখুন
const http = require('http');

function heavyWork() {                 // CPU এর কাজ, থামানো যায় না
  const end = Date.now() + 5000;
  while (Date.now() < end) {}
  return 'শেষ';
}

http.createServer((req, res) => {
  if (req.url === '/heavy') {
    heavyWork();
    res.end('ভারী কাজ শেষ\\n');
  } else {
    res.end('আমি দ্রুত উত্তর দেই\\n');
  }
}).listen(3000, () => console.log('http://localhost:3000'));

// দুইটা Terminal খুলে পরীক্ষা করুন:
//   Terminal 1:  curl localhost:3000/heavy
//   Terminal 2:  curl localhost:3000/         ← সাথে সাথেই চালান
//
// দ্বিতীয়টা উত্তর পেতে পাঁচ সেকেন্ড অপেক্ষা করবে।
// একটাই Thread, আর সেটা ভারী কাজে আটকে আছে।`,
            },
            {
                filename: '3-real-race.js',
                language: 'javascript',
                code: `// সত্যিকারের Race Condition, সত্যিকারের Thread দিয়ে
const { Worker, isMainThread, workerData } = require('worker_threads');

const TIMES = 100000;

if (isMainThread) {
  const shared = new SharedArrayBuffer(4);
  const counter = new Int32Array(shared);

  const workers = [0, 1].map(() =>
    new Worker(__filename, { workerData: shared })
  );

  Promise.all(workers.map(w => new Promise(r => w.on('exit', r))))
    .then(() => {
      console.log('হওয়া উচিত ছিল:', 2 * TIMES);
      console.log('আসলে হলো:     ', counter[0]);
      console.log('তফাতটাই হারিয়ে যাওয়া হিসাব।');
    });
} else {
  const counter = new Int32Array(workerData);
  for (let i = 0; i < TIMES; i++) {
    counter[0] = counter[0] + 1;        // পড়া, যোগ, লেখা: তিনটা আলাদা ধাপ
    // Atomics.add(counter, 0, 1);      // এই লাইনটা ব্যবহার করলে হিসাব মিলবে
  }
}

// প্রথমে চালিয়ে দেখুন, তারপর উপরের দুইটা লাইন বদলে আবার চালান।`,
            },
            {
                filename: '4-use-both-cores.js',
                language: 'javascript',
                code: `// এক Node Process এক Core। দুইটা Core চাইলে দুইটা Process।
const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isPrimary) {
  const cores = os.cpus().length;
  console.log('Core:', cores, '| Primary PID:', process.pid);

  for (let i = 0; i < Math.min(cores, 2); i++) cluster.fork();

  cluster.on('exit', worker => {
    console.log('Worker', worker.process.pid, 'মারা গেল, নতুন একটা দিচ্ছি');
    cluster.fork();                    // একটা মরলেও সেবা চলতে থাকে
  });
} else {
  http.createServer((req, res) => {
    res.end('উত্তর দিল PID: ' + process.pid + '\\n');
  }).listen(3000);
}

// বারবার চালান: curl localhost:3000
// PID বদলাতে দেখবেন, কারণ Request দুইটা Process এ ভাগ হচ্ছে।`,
            },
        ],
        tip: 'তিন নম্বর Script টা কয়েকবার চালান। প্রতিবার আলাদা ভুল সংখ্যা আসবে, আর কোনোবারই ঠিকটা আসবে না। এই অনিশ্চয়তাটাই Race Condition কে এত বিপজ্জনক করে তোলে, কারণ Test এ ধরা পড়ে না, ধরা পড়ে Production এ ভিড়ের সময়।',
    },
    assignment: {
        title: 'Mini Project: Double Booking ঠেকান',
        time: '১ - ২ ঘণ্টা',
        difficulty: 'Beginner Friendly',
        tasks: [
            <span key='1'>
                <strong>ভাঙা অবস্থাটা দেখুন:</strong> Lab এর তিন নম্বর Script
                পাঁচবার চালিয়ে প্রতিবারের ফল লিখে রাখুন। কোনো দুইটা কি মিলল?
            </span>,
            <span key='2'>
                <strong>ঠিক করুন:</strong> Atomics.add ব্যবহার করে আবার চালান,
                আর দেখুন এবার প্রতিবার সঠিক সংখ্যাটাই আসছে।
            </span>,
            <span key='3'>
                <strong>আপনার API তে:</strong> my-tours এ একটা Booking Endpoint
                লিখুন, যেটা Transaction ব্যবহার করে Seat কমায়। তারপর একই সাথে
                দুইটা Request পাঠিয়ে দেখুন দ্বিতীয়টা ঠিকভাবে না বলছে কিনা।
            </span>,
            <span key='4'>
                <strong>লিখে রাখুন (৫ লাইন):</strong> আপনার API তে আর কোন কোন
                জায়গায় দুইজন একসাথে একই জিনিস বদলাতে পারে? প্রতিটার জন্য কী
                করবেন?
            </span>,
        ],
        deliverables: [
            <span key='1'>পাঁচবার চালানোর পাঁচটা আলাদা ফল</span>,
            <span key='2'>Atomics দিয়ে ঠিক করা Script</span>,
            <span key='3'>Transaction সহ Booking Endpoint</span>,
            <span key='4'>ঝুঁকিপূর্ণ জায়গাগুলোর তালিকা আর পরিকল্পনা</span>,
        ],
    },
};
