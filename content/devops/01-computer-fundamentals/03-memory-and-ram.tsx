/* eslint-disable react/jsx-key */
import {
    ContentList,
    ContentParagraph,
    ListItem,
    SectionTitle,
} from '../../../components/course/content-components';
import { IslandToursBrief } from '../../../components/course/topics/island-tours/project-brief';
import {
    HeapLeakLab,
    StackPlayLab,
} from '../../../components/course/topics/memory/animations';
import {
    MemoryMapDiagram,
    StackFramesDiagram,
    ValueVsReferenceDiagram,
} from '../../../components/course/topics/memory/diagrams';
import {
    CONTENT_TYPES,
    INFO_BOX_VARIANTS,
    TopicData,
} from '../../../types/content';

export const memoryAndRamContent: TopicData = {
    id: 'memory-and-ram',
    introduction: {
        badge: 'MODULE 01 · LESSON 03',
        title: <SectionTitle>কাজের টেবিল আর আলমারি</SectionTitle>,
        description: (
            <div className='space-y-4'>
                <ContentParagraph>
                    একজন দর্জির কথা ভাবুন। তাঁর দোকানে একটা কাজের টেবিল আছে, আর
                    দেয়ালে একটা বড় আলমারি। এখন যে জামাটা তিনি সেলাই করছেন,
                    সেটার কাপড়, ফিতা আর কাঁচি সব টেবিলের উপরে ছড়ানো। হাত
                    বাড়ালেই পাওয়া যায়।
                </ContentParagraph>
                <ContentParagraph>
                    আলমারিতে আছে গত ছয় মাসের সব মাপ আর বাকি কাপড়। সেখান থেকে
                    কিছু আনতে হলে দর্জিকে উঠতে হয়, আলমারি খুলতে হয়, খুঁজতে
                    হয়। সময় লাগে, কিন্তু জিনিস হারায় না।
                </ContentParagraph>
                <ContentParagraph>
                    আর দিন শেষে? দোকান বন্ধ করার সময় টেবিলটা পুরো খালি করে
                    দেওয়া হয়। আলমারি যেমন ছিল তেমনই থাকে।
                </ContentParagraph>
                <ContentParagraph>
                    এই টেবিলটার নাম <strong>RAM</strong>, আলমারিটার নাম{' '}
                    <strong>Disk</strong>। আজ আমরা টেবিলের উপরেই থাকব, কারণ ওই
                    টেবিলের ভেতরেও দুইটা আলাদা জায়গা আছে, আর সেই দুইটার নাম
                    Stack আর Heap।
                </ContentParagraph>
            </div>
        ),
        quote: {
            text: 'RAM হলো কম্পিউটারের কাজের টেবিল। দ্রুত, কিন্তু দিন শেষে পুরো খালি।',
            author: 'Computer Fundamentals',
            role: 'Lesson 03',
        },
    },
    sections: [
        /* ---------------------------------------------------------------- 1 */
        {
            id: 'theory',
            subHeader: { index: '001', title: 'Theory' },
            title: <SectionTitle>RAM আসলে কী রাখে</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                আগের লেসনে দেখেছেন CPU এর সবচেয়ে বড় শত্রু
                                অপেক্ষা। ডেটা দূরে থাকলে CPU বসে থাকে। সেই
                                অপেক্ষা কমানোর জন্যই RAM এর জন্ম।
                            </ContentParagraph>
                            <ContentParagraph>
                                RAM এর পুরো নাম Random Access Memory। নামের{' '}
                                <strong>Random Access</strong> অংশটা গুরুত্বপূর্ণ।
                                এর মানে হলো, RAM এর যেকোনো জায়গা থেকে ডেটা আনতে
                                প্রায় একই সময় লাগে। ক্যাসেট ফিতার মতো শুরু থেকে
                                টেনে আসতে হয় না।
                            </ContentParagraph>
                            <ContentParagraph>
                                কীভাবে সম্ভব? কারণ RAM এর প্রতিটা ঘরের একটা
                                নম্বর আছে, যাকে বলে <strong>Address</strong>।
                                প্রোগ্রাম যখন কোনো মান চায়, সে ঠিকানা বলে দেয়,
                                আর RAM সেই ঠিকানা থেকে সরাসরি মানটা তুলে দেয়।
                                অনেকটা বাড়ির নম্বর ধরে চিঠি পৌঁছানোর মতো।
                            </ContentParagraph>
                            <ContentParagraph>
                                কিন্তু RAM এর একটা বড় দুর্বলতা আছে। বিদ্যুৎ চলে
                                গেলে RAM এর সব কিছু মুছে যায়। এক ফোঁটাও থাকে না।
                                এই কারণেই লেখা শেষ করে Save করতে হয়, আর Save
                                মানে RAM থেকে Disk এ লিখে রাখা।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['', 'RAM', 'Disk (SSD)'],
                    rows: [
                        [
                            <span className='font-bold'>গতি</span>,
                            'খুব দ্রুত, ন্যানোসেকেন্ডের হিসাবে',
                            'অনেক ধীর, মাইক্রোসেকেন্ডের হিসাবে',
                        ],
                        [
                            <span className='font-bold'>বিদ্যুৎ গেলে</span>,
                            'সব মুছে যায়',
                            'সব থেকে যায়',
                        ],
                        [
                            <span className='font-bold'>আকার</span>,
                            'ছোট, ৮ থেকে ৩২ GB সাধারণ',
                            'বড়, কয়েকশ GB থেকে TB',
                        ],
                        [
                            <span className='font-bold'>দাম</span>,
                            'প্রতি GB অনেক বেশি',
                            'প্রতি GB অনেক কম',
                        ],
                        [
                            <span className='font-bold'>কাজ</span>,
                            'এখন যা চলছে তার সব কিছু',
                            'যা পরেও দরকার হবে',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'একটা Program চললে RAM এ কী কী থাকে',
                    content: (
                        <div className='space-y-3'>
                            <p>
                                <strong>Code</strong> মানে আপনার প্রোগ্রামের
                                নির্দেশগুলো নিজেই। CPU এখান থেকেই Instruction
                                পড়ে।
                            </p>
                            <p>
                                <strong>Stack</strong> মানে ফাংশনের কাজের জায়গা।
                                ছোট, দ্রুত, আর নিজে নিজে পরিষ্কার হয়।
                            </p>
                            <p>
                                <strong>Heap</strong> মানে বড় জিনিস রাখার খোলা
                                মাঠ। Object, Array, ছবির Buffer, সব এখানে যায়।
                            </p>
                        </div>
                    ),
                },
                { type: CONTENT_TYPES.CUSTOM, component: <MemoryMapDiagram /> },
            ],
        },
        /* ---------------------------------------------------------------- 2 */
        {
            id: 'stack',
            subHeader: { index: '002', title: 'The Stack' },
            title: <SectionTitle>Stack: থালার স্তূপের মতো</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                বিয়ের অনুষ্ঠানে ধোয়া থালা একটার উপর একটা রাখা
                                হয়। নতুন থালা উপরে বসে, আর কেউ থালা নিতে গেলে
                                উপরের থালাটাই নেয়। নিচের থালা টানতে গেলে পুরো
                                স্তূপ পড়ে যাবে।
                            </ContentParagraph>
                            <ContentParagraph>
                                Stack ঠিক এভাবে কাজ করে। একটা ফাংশন ডাকা হলে তার
                                জন্য একটুকরো জায়গা উপরে বসে, যাকে বলে{' '}
                                <strong>Stack Frame</strong>। ওই Frame এর ভেতরে
                                থাকে ফাংশনের Local Variable আর ফাংশন শেষ হলে কোথায়
                                ফিরতে হবে সেই ঠিকানা।
                            </ContentParagraph>
                            <ContentParagraph>
                                সবচেয়ে সুন্দর ব্যাপারটা হলো পরিষ্কার করা।
                                ফাংশন শেষ হওয়া মাত্র তার Frame উপর থেকে সরে
                                যায়, আর ওই জায়গা সাথে সাথে আবার ব্যবহারের জন্য
                                খালি হয়ে যায়। কাউকে হাতে কিছু করতে হয় না।
                            </ContentParagraph>
                        </div>
                    ),
                },
                { type: CONTENT_TYPES.CUSTOM, component: <StackFramesDiagram /> },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            নিচের গল্পটা চালিয়ে দেখুন। তিনটা ফাংশন একটা আরেকটাকে
                            ডাকে, আর আপনি দেখতে পাবেন Frame গুলো কীভাবে জমে,
                            তারপর উল্টো দিক থেকে মুছে যায়।
                        </ContentParagraph>
                    ),
                },
                { type: CONTENT_TYPES.CUSTOM, component: <StackPlayLab /> },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: 'Stack Overflow আসলে কী',
                    content: (
                        <p>
                            Stack এর জায়গা নির্দিষ্ট, সাধারণত কয়েক MB মাত্র।
                            এখন একটা ফাংশন যদি নিজেকেই ডাকতে থাকে আর কখনো থামার
                            শর্ত না পায়, তাহলে প্রতিবার একটা নতুন Frame জমে।
                            কয়েক হাজার বার পর জায়গা শেষ, আর প্রোগ্রাম থেমে
                            যায়। এই ঘটনাটার নামেই ওই বিখ্যাত ওয়েবসাইটের নাম।
                        </p>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 3 */
        {
            id: 'heap',
            subHeader: { index: '003', title: 'The Heap' },
            title: <SectionTitle>Heap: খোলা মাঠ আর ঠিকানার চিরকুট</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                Stack এ সব কিছু রাখা যায় না। একটা কারণ হলো আকার:
                                Stack ছোট। আরেকটা কারণ হলো আয়ু। ফাংশন শেষ হলে
                                Stack এর জিনিস মুছে যায়, কিন্তু অনেক সময় আমরা
                                চাই জিনিসটা ফাংশনের পরেও বেঁচে থাকুক।
                            </ContentParagraph>
                            <ContentParagraph>
                                তাই বড় আর দীর্ঘজীবী জিনিসগুলো যায় Heap এ। Heap
                                একটা খোলা মাঠের মতো, যেখানে যেখানে জায়গা আছে
                                সেখানে জিনিস বসিয়ে দেওয়া হয়। আর Stack এ থাকে
                                শুধু একটা ছোট চিরকুট, যাতে লেখা থাকে জিনিসটা
                                মাঠের কোন জায়গায় আছে। ওই চিরকুটের নাম{' '}
                                <strong>Reference</strong>, বা C এর ভাষায়
                                Pointer।
                            </ContentParagraph>
                            <ContentParagraph>
                                এই এক জায়গায় নতুন প্রোগ্রামাররা সবচেয়ে বেশি
                                হোঁচট খান। সংখ্যা কপি হয়, কিন্তু Object কপি হয়
                                না। নিচের ছবিটা দেখলে ব্যাপারটা আর ভুল হবে না।
                            </ContentParagraph>
                        </div>
                    ),
                },
                { type: CONTENT_TYPES.CUSTOM, component: <ValueVsReferenceDiagram /> },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'copy-vs-share.js',
                    code: `// সংখ্যা: আলাদা কপি
let a = 5;
let b = a;
b = 10;
console.log(a, b);        // 5 10   ← a ঠিক আছে

// Object: একই জিনিস, দুইটা নাম
const x = { name: 'Ripon' };
const y = x;
y.name = 'Shahadat';
console.log(x.name);     // Shahadat   ← x ও বদলে গেছে

// সত্যিকারের কপি চাইলে নতুন Object বানাতে হয়
const z = { ...x };
z.name = 'অন্য কেউ';
console.log(x.name);     // Shahadat   ← এবার x অটুট`,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'Garbage Collector কে, আর কী করে',
                    content: (
                        <p>
                            Heap এ রাখা জিনিস নিজে থেকে যায় না। C এর মতো ভাষায়
                            প্রোগ্রামারকে নিজে হাতে জায়গা ফেরত দিতে হয়।
                            JavaScript, Java বা Go তে একটা আলাদা অংশ এই কাজটা
                            করে, যার নাম Garbage Collector। সে মাঝে মাঝে ঘুরে
                            দেখে কোন জিনিসের দিকে আর কোনো চিরকুট নেই, আর সেগুলোর
                            জায়গা ফেরত নিয়ে নেয়। কিন্তু আপনি যদি ভুল করে একটা
                            চিরকুট ধরে রাখেন, সে ধরে নেয় জিনিসটা এখনো দরকার, আর
                            সেটা কখনো মুছবে না। এটাই Memory Leak।
                        </p>
                    ),
                },
                { type: CONTENT_TYPES.CUSTOM, component: <HeapLeakLab /> },
            ],
        },
        /* ---------------------------------------------------------------- 4 */
        {
            id: 'compare',
            subHeader: { index: '004', title: 'Side by Side' },
            title: <SectionTitle>কোনটা কোথায় যায়</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['', 'Stack', 'Heap'],
                    rows: [
                        [
                            <span className='font-bold'>কী থাকে</span>,
                            'ফাংশনের Local Variable, ছোট সংখ্যা, Reference',
                            'Object, Array, String, বড় Buffer',
                        ],
                        [
                            <span className='font-bold'>আকার</span>,
                            'ছোট, কয়েক MB',
                            'বড়, RAM যতটা দেয়',
                        ],
                        [
                            <span className='font-bold'>গতি</span>,
                            'সবচেয়ে দ্রুত, শুধু উপরে বসানো আর সরানো',
                            'একটু ধীর, জায়গা খুঁজে বের করতে হয়',
                        ],
                        [
                            <span className='font-bold'>কে পরিষ্কার করে</span>,
                            'নিজে নিজে, ফাংশন শেষ হলেই',
                            'Garbage Collector, বা প্রোগ্রামার নিজে',
                        ],
                        [
                            <span className='font-bold'>শেষ হলে কী হয়</span>,
                            'Stack Overflow',
                            'Out of Memory',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            একটা কথা মনে রাখলে সব সহজ হয়ে যায়। Stack জানে জিনিসটা
                            কখন যাবে, কারণ ফাংশন শেষ হলেই যাবে। Heap সেটা জানে না,
                            তাই কাউকে বলে দিতে হয় কখন ছেড়ে দেওয়া যাবে।
                        </ContentParagraph>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 5 */
        {
            id: 'project-example',
            subHeader: { index: '005', title: 'Project Example' },
            title: <SectionTitle>Island Tours এ Memory কোথায় ফুরায়</SectionTitle>,
            blocks: [
                { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                Island Tours এর API একটা Docker Container এ চলে,
                                আর তাকে দেওয়া আছে ৫১২ MB Memory। এই সীমার ভেতরেই
                                সব সামলাতে হয়। কোথায় Memory যায় সেটা দেখা যাক।
                            </ContentParagraph>
                            <ContentList>
                                <ListItem>
                                    <strong>ছবি Upload:</strong> ২ MB এর ছবি যদি
                                    পুরোটা একবারে Memory তে নেওয়া হয়, তাহলে ১০
                                    জন একসাথে Upload করলেই ২০ MB চলে গেল। তাই ছবি
                                    Stream করে লেখা হয়, পুরোটা ধরে রাখা হয় না।
                                </ListItem>
                                <ListItem>
                                    <strong>Tour তালিকা Cache:</strong> জনপ্রিয়
                                    ট্যুরের তালিকা Memory তে রাখলে API দ্রুত হয়।
                                    কিন্তু ওই Cache এ যদি সীমা আর মেয়াদ না থাকে,
                                    তাহলে সেটা দিন দিন বাড়তেই থাকে। এই কারণেই
                                    Cache এর কাজটা Redis কে দেওয়া হয়েছে, যার
                                    নিজের মেয়াদ আর সীমা আছে।
                                </ListItem>
                                <ListItem>
                                    <strong>Database এর উত্তর:</strong> Pagination
                                    ছাড়া ২০০০ ট্যুর একবারে আনলে পুরো তালিকাটা
                                    Heap এ বসে। একটা Request এ ২.৫ MB মানে ৫০টা
                                    Request এ ১২৫ MB।
                                </ListItem>
                                <ListItem>
                                    <strong>Container মরে যাওয়া:</strong> সীমা
                                    ছাড়িয়ে গেলে Linux নিজেই Process টা মেরে
                                    দেয়। লগে দেখা যায় exit code 137, আর সেটার
                                    মানে হলো Memory শেষ। এটা Bug এর মতো দেখায় না,
                                    তাই ধরতে সময় লাগে।
                                </ListItem>
                            </ContentList>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: 'Leak আর ভারী কাজ এক জিনিস নয়',
                    content: (
                        <p>
                            একটা Request যদি অনেক Memory নেয় আর শেষে ছেড়ে দেয়,
                            সেটা ভারী কাজ। Memory গ্রাফ উঠবে, তারপর নামবে। কিন্তু
                            যদি প্রতিটা Request একটু একটু রেখে যায় আর কখনো ছাড়ে
                            না, সেটা Leak। Leak এর গ্রাফ শুধু উপরে ওঠে, কখনো নামে
                            না। এই দুইটার সমাধান সম্পূর্ণ আলাদা, তাই আগে গ্রাফটা
                            দেখা জরুরি।
                        </p>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 6 */
        {
            id: 'request-flow',
            subHeader: { index: '006', title: 'Step-by-step Flow' },
            title: (
                <SectionTitle>একটা Object তৈরি হলে ভেতরে কী হয়</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            একটা ফাংশনের ভেতরে আপনি লিখলেন{' '}
                            <strong className='font-mono'>
                                const user = {'{'} name: &apos;Ripon&apos; {'}'}
                            </strong>
                            । এই এক লাইনে Stack আর Heap দুইটাই কাজ করে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    stepName: 'STEP',
                    steps: [
                        {
                            title: 'ফাংশন ডাকা হলো',
                            description:
                                'Stack এ একটা নতুন Frame বসল। এই Frame এ ওই ফাংশনের সব Local Variable এর জায়গা আছে।',
                        },
                        {
                            title: 'Heap এ জায়গা চাওয়া হলো',
                            description:
                                'Object টা Stack এ বসে না, তাই Runtime Heap এ যতটুকু জায়গা লাগে সেটা খুঁজে বের করে।',
                        },
                        {
                            title: 'Object বসল Heap এ',
                            description:
                                'name এর মান সহ পুরো Object টা Heap এর একটা নির্দিষ্ট ঠিকানায় লেখা হলো।',
                        },
                        {
                            title: 'ঠিকানা গেল Stack এ',
                            description:
                                'user নামের ভেরিয়েবলটা আসল Object ধরে রাখে না, শুধু ঠিকানাটা ধরে রাখে।',
                        },
                        {
                            title: 'ফাংশন শেষ হলো',
                            description:
                                'Frame মুছে গেল, তাই ঠিকানার চিরকুটটাও চলে গেল। কিন্তু Heap এর Object টা এখনো ওখানেই আছে।',
                        },
                        {
                            title: 'Garbage Collector আসল',
                            description:
                                'সে দেখল এই Object এর দিকে আর কোনো চিরকুট নেই, তাই জায়গাটা ফেরত নিয়ে নিল। কিন্তু আপনি যদি ঠিকানাটা কোথাও রেখে দিতেন, তাহলে সে হাত দিত না।',
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
                                <strong>Computerphile</strong>, এই বিষয়ে সবচেয়ে
                                পরিষ্কার ব্যাখ্যা। Search করুন: Garbage
                                Collection, আর Stack vs Heap.{' '}
                                <a
                                    href='https://www.youtube.com/@Computerphile'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-primary underline underline-offset-4'>
                                    youtube.com/@Computerphile
                                </a>
                            </ListItem>
                            <ListItem>
                                <strong>Crash Course Computer Science</strong>,
                                Episode 6 (Registers and RAM)।{' '}
                                <a
                                    href='https://www.youtube.com/@crashcourse'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-primary underline underline-offset-4'>
                                    youtube.com/@crashcourse
                                </a>
                            </ListItem>
                            <ListItem>
                                <strong>পড়ার জন্য</strong>, MDN এর Memory
                                Management পাতা। JavaScript এ Heap আর Garbage
                                Collection কীভাবে কাজ করে, সেটা সংক্ষেপে ভালোভাবে
                                লেখা আছে।{' '}
                                <a
                                    href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-primary underline underline-offset-4'>
                                    developer.mozilla.org
                                </a>
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
                                RAM হলো কাজের টেবিল, Disk হলো আলমারি। বিদ্যুৎ গেলে
                                টেবিল পুরো খালি হয়ে যায়।
                            </ListItem>
                            <ListItem>
                                RAM এর প্রতিটা ঘরের একটা Address আছে, তাই যেকোনো
                                জায়গা থেকে আনতে প্রায় একই সময় লাগে।
                            </ListItem>
                            <ListItem>
                                Stack ফাংশনের কাজের জায়গা। থালার স্তূপের মতো
                                উপরে জমে, উপর থেকেই যায়, আর নিজে নিজে পরিষ্কার
                                হয়।
                            </ListItem>
                            <ListItem>
                                Heap বড় জিনিসের জায়গা। Stack এ শুধু ঠিকানার
                                চিরকুট থাকে, আসল Object থাকে Heap এ।
                            </ListItem>
                            <ListItem>
                                সংখ্যা কপি হয়, Object কপি হয় না। দুইটা নাম একই
                                Object দেখাতে পারে।
                            </ListItem>
                            <ListItem>
                                Stack শেষ হলে Stack Overflow, Heap শেষ হলে Out of
                                Memory। Docker এ সেটা exit code 137 হয়ে দেখা
                                দেয়।
                            </ListItem>
                            <ListItem>
                                Leak এর গ্রাফ শুধু ওঠে, নামে না। ভারী কাজের গ্রাফ
                                ওঠে আর নামে। দুইটা আলাদা সমস্যা।
                            </ListItem>
                            <ListItem>
                                পরের লেসন: এই টেবিল আর আলমারির পেছনের গল্প, মানে
                                Storage, HDD, SSD আর Filesystem।
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
                <span className='font-bold text-primary'>RAM</span>,
                'কাজের টেবিল, দ্রুত কিন্তু বিদ্যুৎ গেলে খালি',
            ],
            [
                <span className='font-bold text-primary'>Address</span>,
                'RAM এর প্রতিটা ঘরের নম্বর, যা দিয়ে সরাসরি পৌঁছানো যায়',
            ],
            [
                <span className='font-bold text-primary'>Stack</span>,
                'ফাংশনের জায়গা, উপরে জমে উপর থেকে যায়, নিজে পরিষ্কার হয়',
            ],
            [
                <span className='font-bold text-primary'>Stack Frame</span>,
                'এক ফাংশনের Local Variable আর ফেরার ঠিকানা',
            ],
            [
                <span className='font-bold text-primary'>Heap</span>,
                'বড় আর দীর্ঘজীবী জিনিসের খোলা মাঠ',
            ],
            [
                <span className='font-bold text-primary'>Reference</span>,
                'Heap এর জিনিসের ঠিকানা লেখা চিরকুট',
            ],
            [
                <span className='font-bold text-primary'>Garbage Collector</span>,
                'যার দিকে আর চিরকুট নেই, তার জায়গা ফেরত নেয়',
            ],
            [
                <span className='font-bold text-primary'>Memory Leak</span>,
                'ভুল করে চিরকুট ধরে রাখা, তাই জায়গা কখনো ফেরত যায় না',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'কম্পিউটার বন্ধ হয়ে গেলে RAM এর ডেটার কী হয়?',
                options: [
                    {
                        key: 'A',
                        text: 'Disk এ নিজে থেকে জমা হয়ে যায়',
                        isCorrect: false,
                        explanation:
                            'এমন হলে Save বোতামের দরকারই হতো না। RAM নিজে কিছু জমিয়ে রাখে না।',
                    },
                    {
                        key: 'B',
                        text: 'পুরোটা মুছে যায়',
                        isCorrect: true,
                        explanation:
                            'RAM ধরে রাখতে বিদ্যুৎ লাগে। এই কারণেই কাজ শেষে Disk এ লিখে রাখতে হয়।',
                    },
                    {
                        key: 'C',
                        text: 'কিছুক্ষণ থাকে, তারপর মুছে যায়',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 2,
                text: 'একটা ফাংশন শেষ হলে তার Local Variable গুলোর কী হয়?',
                options: [
                    {
                        key: 'A',
                        text: 'Heap এ চলে যায়',
                        isCorrect: false,
                        explanation:
                            'উল্টো। Stack এর জিনিস Heap এ যায় না, বরং তার Frame টাই মুছে যায়।',
                    },
                    {
                        key: 'B',
                        text: 'Frame এর সাথে মুছে যায়, জায়গা সাথে সাথে ফেরত যায়',
                        isCorrect: true,
                        explanation:
                            'এই স্বয়ংক্রিয় পরিষ্কারটাই Stack এর সবচেয়ে বড় সুবিধা।',
                    },
                    {
                        key: 'C',
                        text: 'Garbage Collector এসে সরায়',
                        isCorrect: false,
                        explanation:
                            'Garbage Collector Heap নিয়ে কাজ করে, Stack নিয়ে নয়।',
                    },
                ],
            },
            {
                id: 3,
                text: 'const y = x; লিখে y.name বদলালে x.name ও বদলে গেল। কারণ কী?',
                options: [
                    {
                        key: 'A',
                        text: 'JavaScript এর Bug',
                        isCorrect: false,
                    },
                    {
                        key: 'B',
                        text: 'x আর y একই Heap Object এর ঠিকানা ধরে আছে',
                        isCorrect: true,
                        explanation:
                            'Object কপি হয়নি, শুধু ঠিকানাটা কপি হয়েছে। সত্যিকারের কপি চাইলে নতুন Object বানাতে হয়।',
                    },
                    {
                        key: 'C',
                        text: 'const ব্যবহার করার কারণে',
                        isCorrect: false,
                        explanation:
                            'const শুধু নামটা আবার বসাতে দেয় না, ভেতরের মান বদলানো আটকায় না।',
                    },
                ],
            },
            {
                id: 4,
                text: 'একটা ফাংশন নিজেকে ডাকতেই থাকল, থামার শর্ত নেই। কী হবে?',
                options: [
                    {
                        key: 'A',
                        text: 'Out of Memory',
                        isCorrect: false,
                        explanation:
                            'Heap শেষ হলে সেটা হয়। এখানে Frame জমছে, তাই সমস্যাটা Stack এ।',
                    },
                    {
                        key: 'B',
                        text: 'Stack Overflow',
                        isCorrect: true,
                        explanation:
                            'প্রতিবার একটা নতুন Frame জমে, আর Stack এর জায়গা কয়েক MB মাত্র।',
                    },
                    {
                        key: 'C',
                        text: 'প্রোগ্রাম ধীর হবে, কিন্তু চলবে',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 5,
                text: 'আপনার API এর Memory গ্রাফ কয়েক দিন ধরে শুধু উপরে উঠছে, কখনো নামছে না। এটা কীসের লক্ষণ?',
                options: [
                    {
                        key: 'A',
                        text: 'ভারী কাজ চলছে',
                        isCorrect: false,
                        explanation:
                            'ভারী কাজের গ্রাফ ওঠে, তারপর নামে। না নামা মানে অন্য কিছু।',
                    },
                    {
                        key: 'B',
                        text: 'Memory Leak',
                        isCorrect: true,
                        explanation:
                            'কোথাও এমন কিছু জমছে যার ঠিকানা কেউ ছাড়ছে না, তাই Garbage Collector হাত দিতে পারছে না।',
                    },
                    {
                        key: 'C',
                        text: 'RAM কম',
                        isCorrect: false,
                        explanation:
                            'RAM বাড়ালে দিনটা পিছিয়ে যাবে, কিন্তু গ্রাফ একইভাবে উঠতেই থাকবে।',
                    },
                ],
            },
            {
                id: 6,
                text: 'Docker Container টা মরে গেল আর লগে exit code 137 দেখা যাচ্ছে। সবচেয়ে সম্ভাব্য কারণ কী?',
                options: [
                    {
                        key: 'A',
                        text: 'কোডে একটা Exception ছিল',
                        isCorrect: false,
                        explanation:
                            'Exception হলে সাধারণত Stack Trace থাকে আর exit code আলাদা হয়।',
                    },
                    {
                        key: 'B',
                        text: 'Memory সীমা ছাড়িয়ে যাওয়ায় Linux Process টা মেরে দিয়েছে',
                        isCorrect: true,
                        explanation:
                            '137 মানে বাইরে থেকে মেরে ফেলা হয়েছে, আর Container এ সেটার সবচেয়ে সাধারণ কারণ Memory সীমা।',
                    },
                    {
                        key: 'C',
                        text: 'Port দখল হয়ে ছিল',
                        isCorrect: false,
                    },
                ],
            },
        ],
    },
    practicalLab: {
        title: 'নিজের Memory মেপে দেখুন',
        subtitle: 'Terminal এ চারটা পরীক্ষা',
        stepName: 'LAB',
        steps: [
            {
                title: 'মেশিনে কত RAM আছে দেখুন',
                description:
                    'প্রথম কমান্ডগুলো চালিয়ে দেখুন মোট কত RAM, কতটুকু ব্যবহার হচ্ছে, আর কতটুকু Cache এ আছে।',
            },
            {
                title: 'Node এর নিজের হিসাব দেখুন',
                description:
                    'process.memoryUsage() দিয়ে rss, heapTotal আর heapUsed এর পার্থক্য নিজের চোখে দেখুন।',
            },
            {
                title: 'Stack ভেঙে ফেলুন',
                description:
                    'ইচ্ছা করে একটা অসীম Recursion চালিয়ে Stack Overflow এর আসল Error টা পড়ুন।',
            },
            {
                title: 'একটা Leak বানিয়ে, তারপর সারিয়ে ফেলুন',
                description:
                    'একই Script দুইবার চালান, একবার Leak সহ আর একবার Leak ছাড়া। Memory এর তফাত দেখুন।',
            },
        ],
        codeBlocks: [
            {
                filename: '1-how-much-ram.sh',
                language: 'bash',
                code: `# মোট, ব্যবহৃত আর ফাঁকা RAM
free -h

# macOS এ
vm_stat | head -5
sysctl -n hw.memsize      # Byte এ, ১০৭৩৭৪১৮২৪ দিয়ে ভাগ করলে GB

# কোন Process কত Memory নিচ্ছে, উপরের দশটা
ps -eo pid,comm,rss --sort=-rss | head -11
# rss এর হিসাব KB তে

# htop এ Memory বার টা দেখুন, Cache আলাদা রঙে দেখা যায়`,
            },
            {
                filename: '2-node-memory.js',
                language: 'javascript',
                code: `// Node নিজে যা যা জানে
const mb = (n) => (n / 1024 / 1024).toFixed(1) + ' MB';

function report(label) {
  const m = process.memoryUsage();
  console.log(label.padEnd(18), 'rss:', mb(m.rss).padStart(9),
              '| heapUsed:', mb(m.heapUsed));
}

report('শুরুতে');

const big = [];
for (let i = 0; i < 1_000_000; i++) big.push({ id: i, name: 'tour ' + i });
report('১০ লাখ Object');

big.length = 0;                       // ঠিকানা ছেড়ে দিলাম
global.gc?.();                        // node --expose-gc দিয়ে চালালে কাজ করবে
report('ছেড়ে দেওয়ার পর');

// rss মানে পুরো Process যত RAM নিয়েছে
// heapUsed মানে তার ভেতরে আপনার Object গুলো কতটুকু নিয়েছে`,
            },
            {
                filename: '3-stack-overflow.js',
                language: 'javascript',
                code: `// Stack এর সীমা কোথায়, নিজে দেখুন
let depth = 0;

function goDeeper() {
  depth++;
  goDeeper();           // থামার কোনো শর্ত নেই
}

try {
  goDeeper();
} catch (err) {
  console.log('Error:', err.message);
  console.log('কত তলা পর্যন্ত গেল:', depth.toLocaleString('bn-BD'));
}

// প্রতিটা Frame এ অল্প একটু জায়গা লাগে, তাই সংখ্যাটা কয়েক হাজার হয়।
// একই কোড আবার চালালে সংখ্যাটা একটু এদিক ওদিক হবে, সেটাই স্বাভাবিক।`,
            },
            {
                filename: '4-leak-and-fix.js',
                language: 'javascript',
                code: `// একটা সার্ভার নকল করা হলো, যেখানে প্রতিটা Request কিছু রেখে যায়

const LEAK = process.argv[2] !== 'fixed';   // node 4-leak-and-fix.js fixed
const cache = new Map();
const mb = (n) => (n / 1024 / 1024).toFixed(1);

function handleRequest(i) {
  const payload = { id: i, data: 'x'.repeat(10_000) };

  if (LEAK) {
    cache.set(i, payload);                  // কখনো মুছি না, এটাই Leak
  } else {
    cache.set(i, payload);
    if (cache.size > 100) {                 // সীমা বেঁধে দিলাম
      const oldest = cache.keys().next().value;
      cache.delete(oldest);
    }
  }
}

for (let i = 1; i <= 50_000; i++) {
  handleRequest(i);
  if (i % 10_000 === 0) {
    console.log('Request', i,
                '| heapUsed', mb(process.memoryUsage().heapUsed), 'MB',
                '| cache', cache.size);
  }
}

// দুইবার চালিয়ে তুলনা করুন:
//   node 4-leak-and-fix.js          ← Memory বাড়তেই থাকে
//   node 4-leak-and-fix.js fixed    ← Memory একই জায়গায় থামে`,
            },
        ],
        tip: 'rss আর heapUsed এর পার্থক্যটা খেয়াল করুন। heapUsed শুধু আপনার Object গুলোর হিসাব, আর rss হলো পুরো Process যত RAM দখল করেছে, যার ভেতরে Node নিজে, Buffer আর Code সবই আছে। Production এ সীমা ঠিক করার সময় rss ই দেখা হয়।',
    },
    assignment: {
        title: 'Mini Project: Memory Report',
        time: '১ - ২ ঘণ্টা',
        difficulty: 'Beginner Friendly',
        tasks: [
            <span key='1'>
                <strong>বেসলাইন মাপুন:</strong> একটা খালি Node Script এর rss কত,
                সেটা লিখে রাখুন। এটাই আপনার শুরুর বিন্দু।
            </span>,
            <span key='2'>
                <strong>এক Object এর দাম বের করুন:</strong> ১০ লাখ ছোট Object
                বানিয়ে আবার মাপুন, তারপর হিসাব করুন প্রতিটা Object এ আনুমানিক
                কত Byte গেল। সংখ্যাটা দেখে অবাক হবেন।
            </span>,
            <span key='3'>
                <strong>Leak ধরুন:</strong> Lab এর চার নম্বর Script টা নিয়ে
                Leak সহ আর Leak ছাড়া দুইবার চালান। দুইটার Memory এর গ্রাফ পাশাপাশি
                লিখুন।
            </span>,
            <span key='4'>
                <strong>সিদ্ধান্ত নিন (৫ লাইন):</strong> আপনার my-tours API এ
                কোন কোন জিনিস Memory তে রাখবেন, কোনগুলো Redis এ পাঠাবেন, আর
                Container এ কত Memory সীমা দেবেন? যুক্তি দিয়ে লিখুন।
            </span>,
        ],
        deliverables: [
            <span key='1'>বেসলাইন আর ১০ লাখ Object এর পরের পরিমাপ</span>,
            <span key='2'>প্রতি Object এ কত Byte, তার হিসাব</span>,
            <span key='3'>Leak আর Fix করা Script এর তুলনা</span>,
            <span key='4'>Memory সীমা নিয়ে ৫ লাইনের যুক্তি</span>,
        ],
    },
};
