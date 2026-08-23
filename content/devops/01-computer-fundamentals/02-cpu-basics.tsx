/* eslint-disable react/jsx-key */
import {
    ContentList,
    ContentParagraph,
    ListItem,
    SectionTitle,
} from '../../../components/course/content-components';
import {
    ClockCycleLab,
    LatencyScaleLab,
} from '../../../components/course/topics/cpu/animations';
import {
    CoresDiagram,
    FetchDecodeExecuteDiagram,
    MemoryLadderDiagram,
} from '../../../components/course/topics/cpu/diagrams';
import { IslandToursBrief } from '../../../components/course/topics/island-tours/project-brief';
import {
    CONTENT_TYPES,
    INFO_BOX_VARIANTS,
    TopicData,
} from '../../../types/content';

export const cpuBasicsContent: TopicData = {
    id: 'cpu-basics',
    introduction: {
        badge: 'MODULE 01 · LESSON 02',
        title: <SectionTitle>CPU আসলে কতটা বোকা?</SectionTitle>,
        description: (
            <div className='space-y-4'>
                <ContentParagraph>
                    একটা রান্নাঘরের কথা ভাবুন। সেখানে একজন রাঁধুনি আছেন, যিনি
                    নিজে থেকে কিছুই ভাবতে পারেন না। তাকে কাগজে লিখে দিতে হয়:
                    হাঁড়ি নিতে হবে, পানি ঢালতে হবে, চুলা জ্বালাতে হবে, দুই মিনিট অপেক্ষা করতে হবে।
                    একটা লাইন পড়েন, সেটা করেন, তারপর পরের লাইনে যান। এর বাইরে
                    তিনি এক পা এগোন না।
                </ContentParagraph>
                <ContentParagraph>
                    শুনে মনে হচ্ছে অকেজো, তাই না? কিন্তু এই রাঁধুনির একটা গুণ
                    আছে। তিনি এত দ্রুত কাজ করেন যে সেকেন্ডে <strong>৩০০ কোটি</strong>{' '}
                    লাইন পড়ে ফেলতে পারেন।
                </ContentParagraph>
                <ContentParagraph>
                    এই রাঁধুনির নাম CPU। আজ আমরা দেখব সে ঠিক কী কী করতে পারে,
                    কীভাবে করে, আর কেন এত দ্রুত হয়েও সে বেশিরভাগ সময় বসে
                    থাকে।
                </ContentParagraph>
            </div>
        ),
        quote: {
            text: 'CPU একটা কাজই খুব ভালো পারে: খুব সাধারণ কাজ, অবিশ্বাস্য দ্রুত, লক্ষ কোটি বার।',
            author: 'Computer Fundamentals',
            role: 'Lesson 02',
        },
    },
    sections: [
        /* ---------------------------------------------------------------- 1 */
        {
            id: 'theory',
            subHeader: { index: '001', title: 'Theory' },
            title: <SectionTitle>CPU আসলে কী কী পারে?</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                আগের লেসনে দেখেছেন কম্পিউটার সব কিছু ০ আর ১
                                দিয়ে রাখে। এখন প্রশ্ন হলো, ওই ০ আর ১ নিয়ে
                                আসলে কাজটা কে করে? উত্তর হলো CPU, পুরো নাম
                                Central Processing Unit।
                            </ContentParagraph>
                            <ContentParagraph>
                                অনেকের ধারণা CPU খুব বুদ্ধিমান। বাস্তবে উল্টো।
                                CPU যে কাজগুলো পারে তার তালিকা হাতে গোনা:
                            </ContentParagraph>
                            <ContentList>
                                <ListItem>
                                    দুইটা সংখ্যা যোগ বা বিয়োগ করা
                                </ListItem>
                                <ListItem>
                                    দুইটা সংখ্যা তুলনা করা, কোনটা বড় সেটা বলা
                                </ListItem>
                                <ListItem>
                                    Memory থেকে একটা মান আনা, বা Memory-তে একটা
                                    মান রাখা
                                </ListItem>
                                <ListItem>
                                    একটা শর্ত মিললে অন্য লাইনে লাফ দেওয়া
                                </ListItem>
                            </ContentList>
                            <ContentParagraph>
                                ব্যাস, এতটুকুই। আপনার Instagram Reels, ব্যাংকের
                                লেনদেন, গেমের গ্রাফিক্স, সব এই কয়েকটা কাজের
                                কোটি কোটি পুনরাবৃত্তি। এটাই CPU এর আসল জাদু:
                                বুদ্ধি নয়, গতি।
                            </ContentParagraph>
                            <ContentParagraph>
                                আর CPU এই কাজগুলো কীভাবে জানে কোনটা কখন করবে?
                                তাকে একটা তালিকা দেওয়া থাকে। ওই তালিকার প্রতিটা
                                লাইনকে বলে <strong>Instruction</strong>, আর পুরো
                                তালিকাটাই আপনার <strong>Program</strong>।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'তিনটা শব্দ, যেগুলো বারবার আসবে',
                    content: (
                        <div className='space-y-3'>
                            <p>
                                <strong>Instruction</strong> মানে CPU এর জন্য
                                একটা আদেশ। যেমন: এই দুইটা যোগ করা। এর চেয়ে ছোট
                                কাজ CPU এর কাছে নেই।
                            </p>
                            <p>
                                <strong>Register</strong> মানে CPU এর নিজের হাতের
                                মধ্যে থাকা কয়েকটা ছোট খোপ। এখানে মাত্র কয়েকটা
                                সংখ্যা রাখা যায়, কিন্তু এখান থেকে পড়া সবচেয়ে
                                দ্রুত।
                            </p>
                            <p>
                                <strong>Clock</strong> মানে CPU এর ঘড়ি। প্রতিটা
                                টিক-টক এ CPU এক ধাপ এগোয়। 3 GHz মানে সেকেন্ডে
                                ৩০০ কোটি টিক।
                            </p>
                        </div>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 2 */
        {
            id: 'visual',
            subHeader: { index: '002', title: 'Visual Explanation' },
            title: <SectionTitle>চারটা ধাপের অসীম চক্র</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            CPU যা করে তার পুরোটা মাত্র চারটা ধাপে ধরা যায়, আর
                            এই চারটা ধাপ সে থামে না। কম্পিউটার চালু থাকা মানে এই
                            চক্র ঘুরতে থাকা।
                        </ContentParagraph>
                    ),
                },
                { type: CONTENT_TYPES.CUSTOM, component: <FetchDecodeExecuteDiagram /> },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            লেখা পড়ে বোঝার চেয়ে চোখে দেখা সহজ। নিচের Program
                            টা তিন লাইনের। Play চাপুন, আর দেখুন প্রতিটা লাইন চার
                            ধাপে কীভাবে শেষ হয়। ধীর গতিতে শুরু করুন, তারপর দ্রুত
                            করে দেখুন।
                        </ContentParagraph>
                    ),
                },
                { type: CONTENT_TYPES.CUSTOM, component: <ClockCycleLab /> },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'GHz সংখ্যাটা আসলে কী বলে',
                    content: (
                        <p>
                            3 GHz মানে সেকেন্ডে ৩০০ কোটি টিক। কিন্তু একটা
                            Instruction শেষ হতে একটার বেশি টিক লাগতে পারে, আর
                            আধুনিক CPU একসাথে কয়েকটা Instruction নিয়ে কাজ করে।
                            তাই বেশি GHz মানে সবসময় বেশি গতি নয়। দুইটা CPU
                            তুলনা করার সময় শুধু GHz দেখে সিদ্ধান্ত নিলে ভুল হয়।
                        </p>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 3 */
        {
            id: 'waiting',
            subHeader: { index: '003', title: 'The Real Story' },
            title: <SectionTitle>এত দ্রুত, তবু বসে থাকে কেন?</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                এখানে সবচেয়ে গুরুত্বপূর্ণ কথাটা আসে। CPU
                                সেকেন্ডে ৩০০ কোটি ধাপ চালাতে পারে, কিন্তু কাজ
                                করার জন্য তার ডেটা দরকার। আর সেই ডেটা আনতে যে
                                সময় লাগে, CPU এর হিসাবে সেটা অনন্তকাল।
                            </ContentParagraph>
                            <ContentParagraph>
                                ব্যাপারটা এভাবে ভাবুন। আপনি একটা টেবিলে বসে কাজ
                                করছেন। হাতের কাগজ থেকে তথ্য নিতে এক সেকেন্ড।
                                পাশের ড্রয়ার থেকে নিতে তিন সেকেন্ড। ঘরের অন্য
                                কোণের ফাইল থেকে নিতে পাঁচ মিনিট। আর অন্য শহর
                                থেকে কুরিয়ারে আনতে ছয় দিন। আপনি যত দ্রুতই কাজ
                                করুন, ওই ছয় দিন তো বসেই থাকতে হবে।
                            </ContentParagraph>
                            <ContentParagraph>
                                CPU এর জীবনটাও ঠিক এমন। তাই তার চারপাশে ধাপে ধাপে
                                Memory সাজানো থাকে, সবচেয়ে দ্রুতটা সবচেয়ে
                                কাছে।
                            </ContentParagraph>
                        </div>
                    ),
                },
                { type: CONTENT_TYPES.CUSTOM, component: <MemoryLadderDiagram /> },
                { type: CONTENT_TYPES.CUSTOM, component: <LatencyScaleLab /> },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: 'পুরো ট্র্যাকের অর্ধেক এই এক লাইনে',
                    content: (
                        <p>
                            Cache, Redis, CDN, Connection Pool, Read Replica, এই
                            সবগুলো জিনিস একই সমস্যার উত্তর: ডেটা দূরে থাকলে
                            অপেক্ষা করতে হয়, তাই ডেটাকে কাছে আনো। পরের মডিউলগুলোতে
                            যখন এই নামগুলো আসবে, এই সিঁড়ির ছবিটা মনে করবেন।
                        </p>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 4 */
        {
            id: 'cores',
            subHeader: { index: '004', title: 'Cores' },
            title: <SectionTitle>Core বেশি মানে কি দ্রুত?</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                একটা CPU এর ভেতরে একাধিক রাঁধুনি থাকতে পারে।
                                প্রতিটা রাঁধুনি একটা <strong>Core</strong>। চার
                                Core মানে সত্যিই চারটা কাজ একসাথে চলতে পারে।
                            </ContentParagraph>
                            <ContentParagraph>
                                কিন্তু এক Core থাকলেও আপনার কম্পিউটারে একসাথে গান,
                                ব্রাউজার আর কোড এডিটর চলে। কীভাবে? OS প্রতিটা কাজকে
                                অল্প সময়ের জন্য Core দেয়, তারপর কেড়ে নিয়ে
                                পরেরটাকে দেয়। এত দ্রুত অদলবদল হয় যে আমাদের চোখে
                                সব একসাথে চলছে মনে হয়। এই অদলবদলের নাম Context
                                Switch, আর এটা Module 01 এর শেষ দিকে আলাদা করে
                                দেখব।
                            </ContentParagraph>
                        </div>
                    ),
                },
                { type: CONTENT_TYPES.CUSTOM, component: <CoresDiagram /> },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['কাজের ধরন', 'বেশি Core কি সাহায্য করে', 'কারণ'],
                    rows: [
                        [
                            <span className='font-bold'>ছবি Resize করা</span>,
                            'হ্যাঁ, অনেক',
                            'প্রতিটা ছবি আলাদা করে করা যায়, তাই ভাগ করে দেওয়া সহজ।',
                        ],
                        [
                            <span className='font-bold'>Password Hash করা</span>,
                            'একসাথে অনেক ইউজার হলে হ্যাঁ',
                            'একটা Hash ভাগ করা যায় না, কিন্তু আলাদা ইউজারের Hash আলাদা Core-এ চলে।',
                        ],
                        [
                            <span className='font-bold'>Database এর উত্তরের অপেক্ষা</span>,
                            'না',
                            'এখানে CPU কাজ করছে না, শুধু বসে আছে। Core বাড়ালে অপেক্ষা কমে না।',
                        ],
                        [
                            <span className='font-bold'>একটা লম্বা হিসাব</span>,
                            'না',
                            'পরের ধাপ আগের ধাপের ফলের উপর নির্ভর করে, তাই ভাগ করা যায় না।',
                        ],
                    ],
                },
            ],
        },
        /* ---------------------------------------------------------------- 5 */
        {
            id: 'project-example',
            subHeader: { index: '005', title: 'Project Example' },
            title: <SectionTitle>Island Tours-এ CPU কোথায় ফুরিয়ে যায়</SectionTitle>,
            blocks: [
                { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                Island Tours এর VPS-এ মাত্র ২টা vCPU। এই দুইটা
                                রাঁধুনি দিয়েই সব সামলাতে হয়। তাই কোন কাজ CPU
                                খেয়ে ফেলে সেটা জানা খুব দরকার।
                            </ContentParagraph>
                            <ContentList>
                                <ListItem>
                                    <strong>Password Hash:</strong> Login আর
                                    Signup এ bcrypt চলে, আর bcrypt ইচ্ছা করেই
                                    ধীর বানানো হয়েছে যাতে আক্রমণকারী সহজে
                                    পাসওয়ার্ড ভাঙতে না পারে। একটা Hash এ ১০০
                                    মিলিসেকেন্ড মানে ওই সময়টা একটা Core পুরো
                                    আটকে থাকে।
                                </ListItem>
                                <ListItem>
                                    <strong>ছবি Resize:</strong> ২ MB এর ছবি থেকে
                                    Thumbnail বানানো পুরোপুরি CPU এর কাজ। এটা
                                    Request এর মধ্যে করলে ওই সময় অন্য কেউ উত্তর
                                    পায় না। তাই এই কাজ Queue-তে পাঠানো হয়,
                                    যেটা Module 09 এ দেখব।
                                </ListItem>
                                <ListItem>
                                    <strong>JSON Parse:</strong> ছোট Payload এ
                                    ধরার মতো কিছু না, কিন্তু ২০০০ ট্যুরের তালিকা
                                    একসাথে পাঠালে এটাও গোনায় আসে।
                                </ListItem>
                                <ListItem>
                                    <strong>Database এর অপেক্ষা:</strong> এটা CPU
                                    এর কাজ নয়। Query চলার সময় CPU খালি বসে
                                    থাকে, আর সেই ফাঁকে অন্য Request এর কাজ করতে
                                    পারে। এই কারণেই Node.js এক Thread দিয়েও এত
                                    Request সামলাতে পারে।
                                </ListItem>
                            </ContentList>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: 'এই ভুলটা Production-এ সবচেয়ে বেশি হয়',
                    content: (
                        <p>
                            CPU এর কাজ আর অপেক্ষার কাজ গুলিয়ে ফেলা। সার্ভার
                            ধীর হলে অনেকে আরও Instance যোগ করেন, কিন্তু সমস্যা
                            যদি একটা ভারী CPU কাজ হয়ে থাকে তাহলে Instance
                            বাড়িয়ে টাকা যায়, সমাধান আসে না। আগে দেখতে হবে CPU
                            আসলে ব্যস্ত, নাকি অপেক্ষা করছে। নিচের Lab এ ঠিক এটাই
                            নিজের চোখে দেখবেন।
                        </p>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 6 */
        {
            id: 'request-flow',
            subHeader: { index: '006', title: 'Step-by-step Flow' },
            title: <SectionTitle>২ + ৩ লিখলে ভেতরে কী হয়</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            আপনি কোডে লিখলেন{' '}
                            <strong className='font-mono'>const x = 2 + 3</strong>
                            । এই এক লাইন CPU পর্যন্ত পৌঁছাতে যে ধাপগুলো পার হয়,
                            সেটাই নিচে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    stepName: 'STEP',
                    steps: [
                        {
                            title: 'আপনার লেখা কোড',
                            description:
                                'const x = 2 + 3 লাইনটা আপনার আর আমার জন্য। CPU এই ভাষা চেনে না।',
                        },
                        {
                            title: 'Machine Instruction এ অনুবাদ',
                            description:
                                'Compiler বা Interpreter এটাকে CPU এর ভাষায় ভাঙে: একটা মান Register-এ আনা, আরেকটা আনা, যোগ করা, তারপর ফল রাখা।',
                        },
                        {
                            title: 'Instruction Memory-তে বসে',
                            description:
                                'ওই ছোট ছোট আদেশগুলো Memory-তে সাজানো থাকে, আর Program Counter মনে রাখে কোনটা পরের।',
                        },
                        {
                            title: 'FETCH',
                            description:
                                'CPU পরের Instruction টা Memory থেকে নিয়ে আসে। ভাগ্য ভালো হলে সেটা Cache-এ পাওয়া যায়, নাহলে অপেক্ষা।',
                        },
                        {
                            title: 'DECODE আর EXECUTE',
                            description:
                                'CPU বোঝে এটা যোগের আদেশ, তারপর ALU নামের অংশটা আসল যোগটা করে। এখানেই ২ আর ৩ মিলে ৫ হয়।',
                        },
                        {
                            title: 'ফল Register-এ, তারপর Memory-তে',
                            description:
                                '৫ প্রথমে Register-এ থাকে। দরকার হলে Memory-তে লেখা হয়, আর তখনই আপনার x এর মান তৈরি হয়।',
                        },
                    ],
                },
            ],
        },
        /* ---------------------------------------------------------------- 7 */
        {
            id: 'resources',
            subHeader: { index: '007', title: 'Best Resources' },
            title: <SectionTitle>আরও দেখতে চাইলে</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentList>
                            <ListItem>
                                <strong>Ben Eater</strong>, এই বিষয়ে সবচেয়ে
                                ভালো জায়গা। তিনি breadboard-এ হাতে একটা ৮ Bit
                                কম্পিউটার বানান, আর Fetch Decode Execute চক্রটা
                                তারে তারে দেখান। Search করুন: Building an 8-bit
                                breadboard computer.{' '}
                                <a
                                    href='https://www.youtube.com/@BenEater'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-primary underline underline-offset-4'>
                                    youtube.com/@BenEater
                                </a>
                            </ListItem>
                            <ListItem>
                                <strong>Crash Course Computer Science</strong>,
                                Episode 7 (The Central Processing Unit) আর
                                Episode 8 (Instructions and Programs)।{' '}
                                <a
                                    href='https://www.youtube.com/@crashcourse'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-primary underline underline-offset-4'>
                                    youtube.com/@crashcourse
                                </a>
                            </ListItem>
                            <ListItem>
                                <strong>Computerphile</strong>, Search করুন: CPU
                                Caches, আর Why is my computer slow.{' '}
                                <a
                                    href='https://www.youtube.com/@Computerphile'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-primary underline underline-offset-4'>
                                    youtube.com/@Computerphile
                                </a>
                            </ListItem>
                            <ListItem>
                                <strong>পড়ার জন্য</strong>, Wikipedia-র
                                Instruction cycle আর CPU cache পাতা দুইটা।
                            </ListItem>
                        </ContentList>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 8 */
        {
            id: 'recap',
            subHeader: { index: '008', title: 'Recap' },
            title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentList>
                            <ListItem>
                                CPU বুদ্ধিমান না। সে যোগ, তুলনা, আনা-নেওয়া আর
                                লাফ দেওয়া, এই কয়েকটা কাজই পারে। তার শক্তি গতিতে।
                            </ListItem>
                            <ListItem>
                                সে একটা চক্রে ঘোরে: FETCH, DECODE, EXECUTE, STORE।
                                Program Counter মনে রাখে পরের Instruction কোথায়।
                            </ListItem>
                            <ListItem>
                                3 GHz মানে সেকেন্ডে ৩০০ কোটি টিক, কিন্তু বেশি GHz
                                মানেই বেশি গতি নয়।
                            </ListItem>
                            <ListItem>
                                Register সবচেয়ে দ্রুত, তারপর Cache, তারপর RAM,
                                তারপর Disk, সবার শেষে Network। ব্যবধান কয়েক গুণ
                                নয়, কয়েক কোটি গুণ।
                            </ListItem>
                            <ListItem>
                                তাই CPU এর বড় শত্রু অপেক্ষা। Cache, Redis আর CDN
                                সবই ডেটাকে কাছে আনার চেষ্টা।
                            </ListItem>
                            <ListItem>
                                Core বেশি মানে সত্যিই একসাথে বেশি কাজ, কিন্তু যে
                                কাজ ভাগ করা যায় না সেটা Core বাড়িয়ে দ্রুত হয়
                                না।
                            </ListItem>
                            <ListItem>
                                CPU ব্যস্ত থাকা আর CPU অপেক্ষা করা দুইটা আলাদা
                                সমস্যা, আর সমাধানও আলাদা।
                            </ListItem>
                            <ListItem>
                                পরের লেসন: এই ডেটা যেখানে রাখা হয়, মানে RAM,
                                Stack আর Heap।
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
                <span className='font-bold text-primary'>CPU</span>,
                'যে অংশটা আসল কাজগুলো করে, খুব সাধারণ কাজ খুব দ্রুত',
            ],
            [
                <span className='font-bold text-primary'>Instruction</span>,
                'CPU এর জন্য একটা ছোট আদেশ, যেমন দুইটা সংখ্যা যোগ করা',
            ],
            [
                <span className='font-bold text-primary'>Clock / GHz</span>,
                'সেকেন্ডে কত টিক, 3 GHz মানে ৩০০ কোটি',
            ],
            [
                <span className='font-bold text-primary'>Register</span>,
                'CPU এর হাতের মধ্যে থাকা কয়েকটা খোপ, সবচেয়ে দ্রুত',
            ],
            [
                <span className='font-bold text-primary'>Cache</span>,
                'RAM এর চেয়ে ছোট আর অনেক দ্রুত, CPU এর পাশে বসানো',
            ],
            [
                <span className='font-bold text-primary'>Core</span>,
                'একটা CPU এর ভেতরের একজন রাঁধুনি, চার Core মানে চারটা কাজ একসাথে',
            ],
            [
                <span className='font-bold text-primary'>Context Switch</span>,
                'এক Core দিয়ে অনেক কাজ চালাতে দ্রুত অদলবদল করা',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'CPU এর মূল শক্তি কোনটা?',
                options: [
                    {
                        key: 'A',
                        text: 'সে খুব জটিল সিদ্ধান্ত নিতে পারে',
                        isCorrect: false,
                        explanation:
                            'উল্টো। CPU খুব সাধারণ কাজই পারে, জটিলতা আসে ওই কাজগুলো কোটি কোটি বার সাজিয়ে করানো থেকে।',
                    },
                    {
                        key: 'B',
                        text: 'সে সাধারণ কাজ অবিশ্বাস্য দ্রুত করতে পারে',
                        isCorrect: true,
                        explanation:
                            'ঠিক। যোগ, তুলনা, আনা-নেওয়া, লাফ, এই কয়েকটা কাজ সেকেন্ডে কোটি কোটি বার।',
                    },
                    {
                        key: 'C',
                        text: 'সে নিজে নিজে Program লিখতে পারে',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 2,
                text: 'Program Counter এর কাজ কী?',
                options: [
                    {
                        key: 'A',
                        text: 'কতগুলো Program চলছে সেটা গোনা',
                        isCorrect: false,
                        explanation:
                            'নাম শুনে এমন মনে হয়, কিন্তু কাজটা আলাদা।',
                    },
                    {
                        key: 'B',
                        text: 'পরের Instruction টা কোথায় আছে সেটা মনে রাখা',
                        isCorrect: true,
                        explanation:
                            'এই কারণেই CPU জানে চক্রের পরের ঘুরে কোন লাইনটা আনতে হবে।',
                    },
                    {
                        key: 'C',
                        text: 'Clock এর টিক গোনা',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 3,
                text: 'RAM থেকে ডেটা আনতে যদি ১০০ ন্যানোসেকেন্ড লাগে, তাহলে CPU এর হিসাবে এটা কেমন?',
                options: [
                    {
                        key: 'A',
                        text: 'প্রায় সাথে সাথেই পাওয়া যায়',
                        isCorrect: false,
                        explanation:
                            'আমাদের কাছে ১০০ ন্যানোসেকেন্ড কিছুই না, কিন্তু CPU এই সময়ে শত শত ধাপ চালাতে পারত।',
                    },
                    {
                        key: 'B',
                        text: 'অনেক লম্বা অপেক্ষা, এই সময়ে সে অন্য কাজ করতে পারত',
                        isCorrect: true,
                        explanation:
                            'CPU এর এক ধাপ যদি ১ সেকেন্ড হতো, RAM থেকে আনতে লাগত প্রায় ৫ মিনিট।',
                    },
                    {
                        key: 'C',
                        text: 'RAM আর Register এর গতি একই',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 4,
                text: 'একটা লম্বা হিসাব, যেখানে প্রতিটা ধাপ আগের ধাপের ফলের উপর নির্ভর করে। Core ২ থেকে ৮ করলে কী হবে?',
                options: [
                    {
                        key: 'A',
                        text: 'চার গুণ দ্রুত হবে',
                        isCorrect: false,
                        explanation:
                            'ভাগ করা গেলে হতো। কিন্তু পরের ধাপ আগেরটার জন্য অপেক্ষা করলে ভাগ করার উপায় নেই।',
                    },
                    {
                        key: 'B',
                        text: 'প্রায় একই সময় লাগবে',
                        isCorrect: true,
                        explanation:
                            'এই কারণেই Core বাড়ানোর আগে দেখতে হয় কাজটা ভাগ করা যায় কিনা।',
                    },
                    {
                        key: 'C',
                        text: 'ধীর হয়ে যাবে',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 5,
                text: 'আপনার API ধীর, আর htop এ দেখা যাচ্ছে CPU ব্যবহার ৫ শতাংশ। সবচেয়ে সম্ভাব্য কারণ কী?',
                options: [
                    {
                        key: 'A',
                        text: 'CPU দুর্বল, বড় CPU লাগবে',
                        isCorrect: false,
                        explanation:
                            'CPU তো বসেই আছে। এখানে বড় CPU কিনে টাকা যাবে, সমস্যা থাকবে।',
                    },
                    {
                        key: 'B',
                        text: 'কোথাও অপেক্ষা হচ্ছে, যেমন Database বা Network',
                        isCorrect: true,
                        explanation:
                            'কম CPU ব্যবহার আর ধীর উত্তর একসাথে মানে প্রায় সবসময়ই অপেক্ষার সমস্যা।',
                    },
                    {
                        key: 'C',
                        text: 'RAM শেষ হয়ে গেছে',
                        isCorrect: false,
                        explanation:
                            'হতে পারে, কিন্তু তখন সাধারণত Swap আর Disk ব্যবহারেও লক্ষণ দেখা যায়।',
                    },
                ],
            },
            {
                id: 6,
                text: 'bcrypt ইচ্ছা করে ধীর বানানো হয়েছে কেন?',
                options: [
                    {
                        key: 'A',
                        text: 'যাতে সার্ভারের CPU গরম না হয়',
                        isCorrect: false,
                    },
                    {
                        key: 'B',
                        text: 'যাতে আক্রমণকারী দ্রুত অসংখ্য পাসওয়ার্ড পরীক্ষা করতে না পারে',
                        isCorrect: true,
                        explanation:
                            'ধীর মানে আক্রমণও ধীর। এই কারণেই এটা CPU খরচ করে, আর Login Endpoint এ এই খরচটা হিসাব করে রাখতে হয়।',
                    },
                    {
                        key: 'C',
                        text: 'কারণ পাসওয়ার্ড লম্বা হয়',
                        isCorrect: false,
                    },
                ],
            },
        ],
    },
    practicalLab: {
        title: 'নিজের CPU কে কাজে লাগান',
        subtitle: 'Terminal-এ চারটা ছোট পরীক্ষা',
        stepName: 'LAB',
        steps: [
            {
                title: 'কয়টা Core আছে দেখুন',
                description:
                    'প্রথম কমান্ডটা চালিয়ে দেখুন আপনার মেশিনে কয়টা Core, আর Cache কত বড়।',
            },
            {
                title: 'একটা Core পুরো আটকে দিন',
                description:
                    'একটা অসীম লুপ চালিয়ে htop এ দেখুন ঠিক একটা Core ১০০ শতাংশে চলে গেছে, বাকিগুলো খালি।',
            },
            {
                title: 'CPU এর কাজ আর অপেক্ষার কাজ আলাদা করে দেখুন',
                description:
                    'দুইটা Script চালান। একটা হিসাব করে, আরেকটা শুধু অপেক্ষা করে। CPU ব্যবহারের তফাত নিজের চোখে দেখুন।',
            },
            {
                title: 'Cache এর প্রভাব মেপে দেখুন',
                description:
                    'একই পরিমাণ ডেটা কাছাকাছি পড়া আর ছড়িয়ে ছিটিয়ে পড়া, সময়ের তফাতটা দেখুন।',
            },
        ],
        codeBlocks: [
            {
                filename: '1-cpu-info.sh',
                language: 'bash',
                code: `# কয়টা Core?
nproc

# বিস্তারিত: model, Core, Cache এর সাইজ
lscpu | grep -Ei 'model name|^cpu\\(s\\)|core|cache'

# macOS এ
sysctl -n machdep.cpu.brand_string
sysctl -n hw.ncpu

# চলতে থাকা কাজ আর প্রতি Core এর লোড দেখতে
htop     # না থাকলে: top`,
            },
            {
                filename: '2-burn-one-core.js',
                language: 'javascript',
                code: `// একটা Core পুরো দখল করে রাখে। অন্য Terminal এ htop খুলে দেখুন।
// থামাতে Ctrl + C

let x = 0;
const started = Date.now();

while (true) {
  x = Math.sqrt(x + 1);            // ছোট কিন্তু থামে না
  if (Date.now() - started > 15000) break;   // ১৫ সেকেন্ড পর নিজেই থামবে
}

console.log('শেষ। এতক্ষণ একটা Core পুরো ব্যস্ত ছিল।');`,
            },
            {
                filename: '3-cpu-vs-waiting.js',
                language: 'javascript',
                code: `// দুই ধরনের ধীর কাজ, দুইটা একদম আলাদা সমস্যা

function cpuWork() {                 // CPU সত্যিই খাটছে
  const t = Date.now();
  let n = 0;
  for (let i = 0; i < 5e8; i++) n += i % 7;
  return \`CPU কাজ: \${Date.now() - t} ms (এই সময় Core ব্যস্ত ছিল)\`;
}

async function waiting() {           // CPU শুধু বসে আছে
  const t = Date.now();
  await new Promise(r => setTimeout(r, 2000));
  return \`অপেক্ষা: \${Date.now() - t} ms (এই সময় Core খালি ছিল)\`;
}

(async () => {
  console.log(cpuWork());
  console.log(await waiting());
})();

// দুইটা চালানোর সময় htop দেখুন। প্রথমটায় Core লাফ দেয়, দ্বিতীয়টায় কিছুই হয় না।`,
            },
            {
                filename: '4-cache-matters.js',
                language: 'javascript',
                code: `// একই সংখ্যক পড়া, কিন্তু একবার পাশে পাশে আর একবার ছড়িয়ে

const SIZE = 20_000_000;
const data = new Int32Array(SIZE).fill(1);

function sequential() {            // পাশাপাশি, Cache খুশি
  const t = Date.now();
  let sum = 0;
  for (let i = 0; i < SIZE; i++) sum += data[i];
  return Date.now() - t;
}

function scattered() {             // ছড়ানো, Cache প্রতিবার মিস
  const t = Date.now();
  let sum = 0;
  for (let i = 0; i < SIZE; i += 16) sum += data[i];
  for (let i = 1; i < SIZE; i += 16) sum += data[i];
  return Date.now() - t;
}

console.log('পাশাপাশি পড়া:', sequential(), 'ms');
console.log('ছড়িয়ে পড়া:  ', scattered(), 'ms');
// একই সংখ্যক যোগ, কিন্তু সময় আলাদা। পার্থক্যটা Cache এর।`,
            },
        ],
        tip: 'htop এ প্রতিটা Core আলাদা বার হিসেবে দেখা যায়। ২ নম্বর Script চালিয়ে দেখুন ঠিক একটা বার ভরে যায়, বাকিগুলো শান্ত। এই একটা দৃশ্য দেখলে Core আর Thread এর পার্থক্য আর ভুলবেন না।',
    },
    assignment: {
        title: 'Mini Project: CPU Budget Report',
        time: '১ - ২ ঘণ্টা',
        difficulty: 'Beginner Friendly',
        tasks: [
            <span key='1'>
                <strong>Benchmark:</strong> একটা Script লিখুন যেটা মেপে বলবে
                আপনার মেশিন সেকেন্ডে কত বার সাধারণ যোগ করতে পারে। সংখ্যাটা লিখে
                রাখুন।
            </span>,
            <span key='2'>
                <strong>bcrypt এর দাম:</strong> bcrypt দিয়ে cost 8, 10 আর 12 এ
                একটা পাসওয়ার্ড Hash করে সময় মাপুন। প্রতিবার সময় কত গুণ বাড়ছে
                দেখুন।
            </span>,
            <span key='3'>
                <strong>হিসাব করুন:</strong> ২টা Core এর VPS এ, cost 12 হলে
                সেকেন্ডে সর্বোচ্চ কতগুলো Login সামলানো যাবে? গণনা দেখিয়ে লিখুন।
            </span>,
            <span key='4'>
                <strong>সিদ্ধান্ত (৫ লাইন):</strong> আপনার my-tours প্রজেক্টে কোন
                cost বেছে নেবেন আর কেন? নিরাপত্তা আর গতির মধ্যে আপনি কোথায় লাইন
                টানলেন সেটা যুক্তি দিয়ে লিখুন।
            </span>,
        ],
        deliverables: [
            <span key='1'>Benchmark Script আর তার আউটপুট</span>,
            <span key='2'>তিনটা cost এর সময়ের তুলনা</span>,
            <span key='3'>Login ক্ষমতার হিসাব, গণনা সহ</span>,
            <span key='4'>cost বেছে নেওয়ার ৫ লাইনের যুক্তি</span>,
        ],
    },
};
