/* eslint-disable react/jsx-key */
import {
    ContentList,
    ContentParagraph,
    ListItem,
    SectionTitle,
} from '../../../components/course/content-components';
import { IslandToursBrief } from '../../../components/course/topics/island-tours/project-brief';
import {
    FileLookupLab,
    SeekRaceLab,
} from '../../../components/course/topics/storage/animations';
import {
    FilesystemTreeDiagram,
    HddVsSsdDiagram,
    SequentialVsRandomDiagram,
} from '../../../components/course/topics/storage/diagrams';
import {
    CONTENT_TYPES,
    INFO_BOX_VARIANTS,
    TopicData,
} from '../../../types/content';

export const storageBasicsContent: TopicData = {
    id: 'storage-basics',
    introduction: {
        badge: 'MODULE 01 · LESSON 04',
        title: <SectionTitle>আলমারির ভেতরের গল্প</SectionTitle>,
        description: (
            <div className='space-y-4'>
                <ContentParagraph>
                    আগের লেসনে সেই দর্জির দোকানে আমরা টেবিলের উপর কাজ করেছি।
                    আজ আমরা দেয়ালের আলমারিটা খুলব।
                </ContentParagraph>
                <ContentParagraph>
                    পুরনো দিনের আলমারিটা ছিল এমন: একটা বড় ঘুরন্ত চাকার সাথে
                    সব তাক লাগানো। কিছু আনতে হলে দর্জিকে অপেক্ষা করতে হতো যতক্ষণ
                    না সঠিক তাকটা সামনে এসে থামে। কাছের জিনিস দ্রুত পাওয়া যেত,
                    কিন্তু এক তাক থেকে আরেক তাকে যেতে গেলে ওই চাকা আবার ঘুরত।
                    এই আলমারির নাম <strong>HDD</strong>।
                </ContentParagraph>
                <ContentParagraph>
                    নতুন আলমারিটা একদম আলাদা। সেখানে দেয়াল জুড়ে সংখ্যা লেখা
                    হাজারটা ছোট বাক্স, আর যে বাক্সটা দরকার সেটা সাথে সাথেই খোলা
                    যায়। কিছুই ঘোরে না, কিছুই নড়ে না। এর নাম{' '}
                    <strong>SSD</strong>।
                </ContentParagraph>
                <ContentParagraph>
                    কিন্তু দুইটা আলমারিরই একটা সমস্যা আছে। বাক্স তো অনেক, কোন
                    জিনিস কোন বাক্সে আছে সেটা মনে রাখবে কে? এই হিসাব রাখার
                    খাতাটার নাম <strong>Filesystem</strong>, আর আজকের লেসনের
                    সবচেয়ে মজার অংশটা ওখানেই।
                </ContentParagraph>
            </div>
        ),
        quote: {
            text: 'RAM মনে রাখে যতক্ষণ বিদ্যুৎ আছে। Disk মনে রাখে যতক্ষণ আপনি মুছে না দেন।',
            author: 'Computer Fundamentals',
            role: 'Lesson 04',
        },
    },
    sections: [
        /* ---------------------------------------------------------------- 1 */
        {
            id: 'theory',
            subHeader: { index: '001', title: 'Theory' },
            title: <SectionTitle>দুই রকম আলমারি</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                HDD এর পুরো নাম Hard Disk Drive। এর ভেতরে সত্যিই
                                একটা ধাতুর থালা ঘোরে, যাকে বলে Platter, আর সেটা
                                মিনিটে পাঁচ হাজার থেকে সাত হাজার বার ঘোরে। Platter
                                এর উপরে একটা সরু হাত থাকে, যার নাম Head। ওই Head
                                টা ঠিক জায়গায় সরে যায়, তারপর অপেক্ষা করে কখন
                                দরকারি অংশটা ঘুরে তার নিচে আসবে।
                            </ContentParagraph>
                            <ContentParagraph>
                                এই দুইটা অপেক্ষার নাম আছে। Head সরতে যে সময় লাগে
                                তার নাম <strong>Seek Time</strong>, আর Platter ঘুরে
                                সঠিক জায়গা আসতে যে সময় লাগে তার নাম{' '}
                                <strong>Rotational Latency</strong>। দুইটা মিলে
                                সাধারণত ৮ থেকে ১২ মিলিসেকেন্ড। CPU এর হিসাবে এটা
                                অনন্তকাল, কারণ এই সময়ে CPU কোটি কোটি ধাপ চালাতে
                                পারত।
                            </ContentParagraph>
                            <ContentParagraph>
                                SSD এর পুরো নাম Solid State Drive। Solid State
                                মানে এখানে কোনো নড়া অংশ নেই। ডেটা থাকে বিদ্যুতের
                                ছোট ছোট Cell এ, আর যেকোনো Cell এ সরাসরি পৌঁছানো
                                যায়। তাই Random Read এও SSD প্রায় একই গতিতে চলে।
                            </ContentParagraph>
                        </div>
                    ),
                },
                { type: CONTENT_TYPES.CUSTOM, component: <HddVsSsdDiagram /> },
                { type: CONTENT_TYPES.CUSTOM, component: <SeekRaceLab /> },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: 'SSD এর নিজের দুর্বলতা',
                    content: (
                        <p>
                            SSD এর Cell গুলোতে বারবার Write করলে সেগুলো ক্ষয়ে যায়।
                            প্রতিটা Cell এ নির্দিষ্ট সংখ্যক বার Write করা যায়,
                            তারপর সেটা আর ধরে রাখতে পারে না। আরেকটা কথা, SSD এ
                            পুরনো ডেটার উপরে সরাসরি নতুন Write করা যায় না, আগে
                            পুরো একটা Block Erase করতে হয়। এই কারণেই SSD ভরে গেলে ধীর হয়ে যায়, আর এই
                            কারণেই Database এর মতো যে কাজ অবিরাম লেখে, তার জন্য
                            ভালো মানের SSD দরকার হয়।
                        </p>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 2 */
        {
            id: 'sequential',
            subHeader: { index: '002', title: 'The Big Idea' },
            title: (
                <SectionTitle>Sequential Read আর Random Read</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                এই লেসনের সবচেয়ে দামি কথাটা এখানে। Disk এর গতি
                                একটা সংখ্যা নয়, দুইটা। কারণ Disk থেকে Read করার
                                দুইটা ধরন আছে।
                            </ContentParagraph>
                            <ContentParagraph>
                                একটা বই সামনের পাতা থেকে পেছনের দিকে পড়ে যাওয়া
                                সহজ। এটাকে বলে <strong>Sequential Read</strong>। আর
                                অভিধান থেকে এলোমেলোভাবে দশটা শব্দ খোঁজা কঠিন,
                                কারণ প্রতিবার নতুন জায়গায় যেতে হয়। এটাকে বলে{' '}
                                <strong>Random Read</strong>।
                            </ContentParagraph>
                            <ContentParagraph>
                                HDD এর ক্ষেত্রে এই তফাতটা ভয়ংকর, কারণ প্রতিটা
                                Random Read এ Head টাকে নতুন করে সরতে হয়। SSD এর
                                ক্ষেত্রেও তফাত আছে, তবে অনেক কম।
                            </ContentParagraph>
                        </div>
                    ),
                },
                { type: CONTENT_TYPES.CUSTOM, component: <SequentialVsRandomDiagram /> },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: 'এই এক কথায় অনেক ডিজাইন সিদ্ধান্ত লুকানো',
                    content: (
                        <p>
                            Log ফাইল কেন এত দ্রুত লেখা যায়? কারণ Log শুধু শেষে
                            যোগ হয়, তাই সেটা Sequential Write। Database কেন Index
                            বানায়? কারণ Index ছাড়া তাকে পুরো Table এ Random Read
                            করতে হয়। Backup কেন এক বড় ফাইলে নেওয়া হয়? কারণ
                            হাজারটা ছোট ফাইলের চেয়ে একটা বড় ফাইলে Write করা
                            অনেক দ্রুত। পরের মডিউলগুলোতে এই তিনটা কথাই আবার আসবে।
                        </p>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 3 */
        {
            id: 'filesystem',
            subHeader: { index: '003', title: 'Filesystem' },
            title: <SectionTitle>হিসাবের খাতা: Filesystem</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                Disk নিজে ফাইল চেনে না। Disk চেনে শুধু নম্বর দেওয়া
                                ছোট ছোট ঘর, যাদের বলে <strong>Block</strong>।
                                সাধারণত একটা Block ৪ KB। ফাইল, ফোল্ডার, নাম, এই
                                ধারণাগুলো Disk এর নয়, এগুলো Filesystem এর তৈরি।
                            </ContentParagraph>
                            <ContentParagraph>
                                Filesystem তিনটা জিনিস আলাদা রাখে। ফাইলের{' '}
                                <strong>নাম</strong> থাকে ফোল্ডারের তালিকায়। ফাইলের{' '}
                                <strong>খবর</strong>, মানে সাইজ, মালিক, অনুমতি আর
                                কোন Block গুলোতে ডেটা আছে, সেটা থাকে একটা আলাদা
                                জায়গায় যার নাম <strong>inode</strong>। আর আসল{' '}
                                <strong>ডেটা</strong> থাকে ওই Block গুলোতে।
                            </ContentParagraph>
                        </div>
                    ),
                },
                { type: CONTENT_TYPES.CUSTOM, component: <FilesystemTreeDiagram /> },
                { type: CONTENT_TYPES.CUSTOM, component: <FileLookupLab /> },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                এই আলাদা রাখার কারণে কয়েকটা জিনিস ব্যাখ্যা হয়ে
                                যায়, যেগুলো আগে হয়তো অদ্ভুত লাগত।
                            </ContentParagraph>
                            <ContentList>
                                <ListItem>
                                    <strong>২ GB ফাইল Delete করতে সময় লাগে না।</strong>{' '}
                                    কারণ শুধু ফোল্ডারের একটা লাইন মুছে যায়। ডেটা
                                    Block গুলোতে পড়েই থাকে, শুধু জায়গাটা এখন ফাঁকা
                                    বলে ধরা হয়।
                                </ListItem>
                                <ListItem>
                                    <strong>মুছে ফেলা ফাইল ফেরত আনা যায়।</strong>{' '}
                                    যতক্ষণ ওই Block গুলোর উপরে নতুন কিছু লেখা হয়নি,
                                    ততক্ষণ ডেটা ওখানেই আছে।
                                </ListItem>
                                <ListItem>
                                    <strong>একই ফাইলের দুইটা নাম থাকতে পারে।</strong>{' '}
                                    দুইটা নাম একই inode কে দেখাতে পারে, যাকে বলে
                                    Hard Link। একটা নাম মুছলেও ফাইল থাকে, কারণ inode
                                    এর গোনা তখনো শূন্য হয়নি।
                                </ListItem>
                                <ListItem>
                                    <strong>Disk এ জায়গা আছে, তবু লেখা যাচ্ছে না।</strong>{' '}
                                    কারণ inode এর সংখ্যাও নির্দিষ্ট। লক্ষ লক্ষ ছোট
                                    ফাইল বানালে জায়গা শেষ হওয়ার আগেই inode শেষ হয়ে
                                    যেতে পারে।
                                </ListItem>
                            </ContentList>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'Save করা মানেই Disk এ পৌঁছে যাওয়া নয়',
                    content: (
                        <p>
                            আপনার প্রোগ্রাম যখন Write করে, তখন সাধারণত ডেটা প্রথমে RAM
                            এর একটা Cache এ বসে, আর OS পরে সুযোগ মতো সেটা Disk এ
                            পাঠায়। এতে Write অনেক দ্রুত হয়, কিন্তু ঠিক ওই সময়ে
                            বিদ্যুৎ গেলে ডেটা হারায়। তাই Database যখন বলে লেনদেন
                            নিশ্চিত হয়েছে, তার আগে সে আলাদা করে Disk কে বলে
                            সবকিছু এখনই লিখে ফেলো। এই আদেশটার নাম{' '}
                            <strong>fsync</strong>, আর এই একটা কারণেই Database এর
                            লেখা তুলনামূলক ধীর।
                        </p>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 4 */
        {
            id: 'project-example',
            subHeader: { index: '004', title: 'Project Example' },
            title: <SectionTitle>Island Tours এ Disk কোথায় কাঁদায়</SectionTitle>,
            blocks: [
                { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                VPS টার Disk ৫০ GB, আর সেটা SSD। শুনতে অনেক মনে
                                হয়, কিন্তু Disk ভরে যাওয়ার গল্পগুলো সবচেয়ে
                                বিরক্তিকর, কারণ সেগুলো সাধারণত রাত তিনটায় ঘটে।
                            </ContentParagraph>
                            <ContentList>
                                <ListItem>
                                    <strong>PostgreSQL কেন SSD চায়:</strong>{' '}
                                    Database এর কাজ পুরোটাই Random Read আর Random Write।
                                    HDD তে এই কাজ করতে গেলে প্রতিটা Query তে ওই
                                    Head এর নড়াচড়া যোগ হতো।
                                </ListItem>
                                <ListItem>
                                    <strong>Log ফাইল সবচেয়ে বড় ফাঁদ:</strong>{' '}
                                    Log সবসময় Sequential Write, তাই সেটা দ্রুত হয়
                                    আর কেউ টের পায় না। তারপর একদিন দেখা যায় ৪০ GB Log
                                    জমে Disk ভরে গেছে, আর Database আর কিছু লিখতে
                                    পারছে না। এই কারণেই Log Rotation লাগে।
                                </ListItem>
                                <ListItem>
                                    <strong>Docker Volume:</strong> Container মুছে
                                    গেলে তার ভেতরের ফাইল চলে যায়, কিন্তু Volume
                                    এ রাখা ডেটা থাকে। তাই PostgreSQL এর ডেটা
                                    Volume এ রাখা হয়। এটা না করলে Container
                                    আবার চালু করলেই সব Booking উধাও।
                                </ListItem>
                                <ListItem>
                                    <strong>ছবি কেন Disk এ রাখা হয় না:</strong>{' '}
                                    ট্যুরের ছবিগুলো Object Storage এ যায়। কারণ
                                    ছবি বাড়তেই থাকে, আর VPS এর Disk বাড়ানো
                                    মানে পুরো সার্ভার বদলানো।
                                </ListItem>
                                <ListItem>
                                    <strong>Backup:</strong> Backup ও Sequential Write,
                                    তাই এটা দ্রুত হয়। কিন্তু Backup যদি একই
                                    Disk এ থাকে, তাহলে Disk নষ্ট হলে Backup ও
                                    যায়। তাই সেটা অন্য জায়গায় পাঠাতে হয়।
                                </ListItem>
                            </ContentList>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['কী Write হচ্ছে', 'ধরন', 'কোথায় রাখা ভালো'],
                    rows: [
                        [
                            <span className='font-bold'>Database</span>,
                            'Random Read আর Random Write',
                            'SSD, আর Docker Volume এ',
                        ],
                        [
                            <span className='font-bold'>Log</span>,
                            'Sequential Write',
                            'আলাদা জায়গা, সাথে Rotation আর মেয়াদ',
                        ],
                        [
                            <span className='font-bold'>ট্যুরের ছবি</span>,
                            'একবার Write, বহুবার Read',
                            'Object Storage, সামনে CDN',
                        ],
                        [
                            <span className='font-bold'>Backup</span>,
                            'Sequential Write, বড় ফাইল',
                            'অন্য সার্ভার বা অন্য জায়গা',
                        ],
                    ],
                },
            ],
        },
        /* ---------------------------------------------------------------- 5 */
        {
            id: 'request-flow',
            subHeader: { index: '005', title: 'Step-by-step Flow' },
            title: (
                <SectionTitle>একটা ফাইল Save করলে কী কী হয়</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            আপনার কোড লিখল{' '}
                            <strong className='font-mono'>
                                fs.writeFile(&apos;logo.png&apos;, data)
                            </strong>
                            । ফাইলটা Disk এ পৌঁছাতে যে ধাপগুলো লাগে, সেটাই নিচে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    stepName: 'STEP',
                    steps: [
                        {
                            title: 'প্রোগ্রাম OS কে বলল',
                            description:
                                'আপনার কোড সরাসরি Disk এ Write করে না। সে OS কে একটা System Call দিয়ে অনুরোধ করে, কারণ Disk এর দায়িত্ব OS এর।',
                        },
                        {
                            title: 'নাম আর inode তৈরি হলো',
                            description:
                                'Filesystem ফোল্ডারের তালিকায় logo.png নামটা যোগ করল, আর ফাইলের খবর রাখার জন্য একটা inode নিল।',
                        },
                        {
                            title: 'ডেটা গেল RAM এর Cache এ',
                            description:
                                'Write এখনো Disk এ যায়নি, RAM এর Page Cache এ বসে আছে। এই কারণেই Write এত দ্রুত মনে হয়।',
                        },
                        {
                            title: 'OS সুযোগ মতো Disk এ পাঠাল',
                            description:
                                'কিছুক্ষণ পর OS ওই Cache এর ডেটা Block গুলোতে লিখে দিল, আর inode এ Block এর তালিকা বসাল।',
                        },
                        {
                            title: 'fsync চাইলে এখনই',
                            description:
                                'প্রোগ্রাম যদি নিশ্চয়তা চায়, সে fsync ডাকে। তখন OS অপেক্ষা করে যতক্ষণ Disk সত্যিই Write শেষ না করে।',
                        },
                        {
                            title: 'এখন এটা টিকে থাকবে',
                            description:
                                'এই ধাপের পর বিদ্যুৎ গেলেও ফাইলটা থাকবে। এর আগে গেলে থাকত না।',
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
                                <strong>Branch Education</strong>, তাঁদের
                                ভিডিওতে SSD আর HDD এর ভেতরটা থ্রিডি অ্যানিমেশনে
                                খুলে দেখানো হয়। Search করুন: How do SSDs work,
                                আর How does a hard drive work.{' '}
                                <a
                                    href='https://www.youtube.com/@BranchEducation'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-primary underline underline-offset-4'>
                                    youtube.com/@BranchEducation
                                </a>
                            </ListItem>
                            <ListItem>
                                <strong>Computerphile</strong>, Search করুন:
                                Filesystems, আর Solid State Drives.{' '}
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
                                Episode 19 (Memory and Storage)।{' '}
                                <a
                                    href='https://www.youtube.com/@crashcourse'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-primary underline underline-offset-4'>
                                    youtube.com/@crashcourse
                                </a>
                            </ListItem>
                            <ListItem>
                                <strong>পড়ার জন্য</strong>, Wikipedia এর inode
                                আর Write amplification পাতা দুইটা। ছোট, কিন্তু
                                কাজের।
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
                                HDD তে Platter ঘোরে আর Head সরে, তাই প্রতিটা Random
                                Read এ ৮ থেকে ১২ মিলিসেকেন্ড যায়। SSD তে কিছুই
                                নড়ে না, তাই সেটা প্রায় ১০০ গুণ দ্রুত।
                            </ListItem>
                            <ListItem>
                                Disk এর গতি একটা সংখ্যা নয়। Sequential Read দ্রুত,
                                Random Read ধীর, আর HDD তে এই তফাতটা ভয়ংকর।
                            </ListItem>
                            <ListItem>
                                SSD এর Cell ক্ষয়ে যায়, আর পুরনো ডেটার উপরে সরাসরি
                                Write করা যায় না, আগে Block Erase করতে হয়।
                            </ListItem>
                            <ListItem>
                                Disk শুধু নম্বর দেওয়া Block চেনে। ফাইল আর ফোল্ডার
                                Filesystem এর তৈরি ধারণা।
                            </ListItem>
                            <ListItem>
                                নাম থাকে ফোল্ডারে, খবর থাকে inode এ, আর ডেটা থাকে
                                Block এ। এই তিনটা আলাদা।
                            </ListItem>
                            <ListItem>
                                Delete করলে শুধু নামটা যায়, তাই বড় ফাইল মুছতেও
                                সময় লাগে না আর মুছে ফেলা ফাইল ফেরত আনা যায়।
                            </ListItem>
                            <ListItem>
                                জায়গা থাকলেও inode শেষ হয়ে যেতে পারে। তখন Disk
                                খালি দেখায়, কিন্তু নতুন ফাইল বানানো যায় না।
                            </ListItem>
                            <ListItem>
                                লেখা প্রথমে RAM এর Cache এ বসে। fsync ছাড়া সেটা
                                সত্যিই টিকে থাকার নিশ্চয়তা নেই।
                            </ListItem>
                            <ListItem>
                                পরের লেসন: এই সব কিছু যে সামলায়, মানে Operating
                                System আসলে কী কাজ করে।
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
                <span className='font-bold text-primary'>HDD</span>,
                'ঘুরন্ত Platter আর নড়া Head, তাই Random Read ধীর',
            ],
            [
                <span className='font-bold text-primary'>SSD</span>,
                'নড়ার কিছু নেই, যেকোনো Cell এ সরাসরি পৌঁছানো যায়',
            ],
            [
                <span className='font-bold text-primary'>Seek Time</span>,
                'HDD এর Head সঠিক জায়গায় সরতে যে সময় নেয়',
            ],
            [
                <span className='font-bold text-primary'>Sequential I/O</span>,
                'পরপর Read বা Write, যেমন Log আর Backup',
            ],
            [
                <span className='font-bold text-primary'>Random I/O</span>,
                'এলোমেলো জায়গা থেকে Read, যেমন Database এর Query',
            ],
            [
                <span className='font-bold text-primary'>Block</span>,
                'Disk এর সবচেয়ে ছোট ঘর, সাধারণত ৪ KB',
            ],
            [
                <span className='font-bold text-primary'>inode</span>,
                'ফাইলের সব খবর আর Block তালিকা যেখানে থাকে',
            ],
            [
                <span className='font-bold text-primary'>fsync</span>,
                'Disk কে বলা, এখনই সত্যিই লিখে ফেলো',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: '২ GB এর একটা ফাইল Delete করলে কাজটা সাথে সাথে শেষ হয়ে যায় কেন?',
                options: [
                    {
                        key: 'A',
                        text: 'SSD খুব দ্রুত, তাই ২ GB মুছতে সময় লাগে না',
                        isCorrect: false,
                        explanation:
                            'সত্যিই ২ GB মুছতে হলে SSD তেও সময় লাগত। আসল কারণ হলো মোছাই হয় না।',
                    },
                    {
                        key: 'B',
                        text: 'শুধু ফোল্ডারের নামের লাইনটা মুছে যায়, ডেটা Block এ পড়ে থাকে',
                        isCorrect: true,
                        explanation:
                            'এই কারণেই মুছে ফেলা ফাইল অনেক সময় ফেরত আনা যায়, যতক্ষণ ওই জায়গায় নতুন কিছু লেখা হয়নি।',
                    },
                    {
                        key: 'C',
                        text: 'ফাইলটা আসলে Recycle Bin এ যায়',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 2,
                text: 'একই ডেটা HDD থেকে Read করার দুইটা উপায়। কোনটা অনেক দ্রুত?',
                options: [
                    {
                        key: 'A',
                        text: 'ছোট ছোট টুকরো করে Random Read',
                        isCorrect: false,
                        explanation:
                            'প্রতিটা টুকরোর জন্য Head সরাতে হয়, তাই এটাই সবচেয়ে ধীর।',
                    },
                    {
                        key: 'B',
                        text: 'Sequential Read',
                        isCorrect: true,
                        explanation:
                            'Head একবার জায়গায় গেলে বাকিটা সহজে Read করা যায়। এই কারণেই Log আর Backup HDD তেও ভালো চলে।',
                    },
                    {
                        key: 'C',
                        text: 'দুইটাতেই একই সময় লাগে',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 3,
                text: 'df -h বলছে Disk এ ৩০ GB খালি, তবু নতুন ফাইল বানানো যাচ্ছে না। সম্ভাব্য কারণ কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Disk নষ্ট হয়ে গেছে',
                        isCorrect: false,
                    },
                    {
                        key: 'B',
                        text: 'inode শেষ হয়ে গেছে, কারণ অনেক ছোট ফাইল জমেছে',
                        isCorrect: true,
                        explanation:
                            'df -i দিয়ে দেখা যায়। Session বা Cache এর লক্ষ লক্ষ ছোট ফাইল থাকলে এটা হয়।',
                    },
                    {
                        key: 'C',
                        text: 'RAM শেষ হয়ে গেছে',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 4,
                text: 'একটা Database লেখার পর fsync ডাকে কেন?',
                options: [
                    {
                        key: 'A',
                        text: 'লেখাটা দ্রুত করার জন্য',
                        isCorrect: false,
                        explanation:
                            'উল্টো, fsync লেখাকে ধীর করে। সে অপেক্ষা করে যতক্ষণ Disk শেষ না করে।',
                    },
                    {
                        key: 'B',
                        text: 'বিদ্যুৎ গেলেও ডেটা টিকে থাকবে সেটা নিশ্চিত করার জন্য',
                        isCorrect: true,
                        explanation:
                            'fsync ছাড়া লেখা RAM এর Cache এ বসে থাকতে পারে, আর তখন বিদ্যুৎ গেলে সেটা হারায়।',
                    },
                    {
                        key: 'C',
                        text: 'ফাইলের নাম ঠিক করার জন্য',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 5,
                text: 'PostgreSQL এর ডেটা Docker Volume এ না রেখে Container এর ভেতরে রাখলে কী হবে?',
                options: [
                    {
                        key: 'A',
                        text: 'কিছুই হবে না, একই জিনিস',
                        isCorrect: false,
                    },
                    {
                        key: 'B',
                        text: 'Container মুছে নতুন করে চালালে সব ডেটা চলে যাবে',
                        isCorrect: true,
                        explanation:
                            'Container এর নিজের ফাইল তার সাথেই যায়। এই কারণেই Database এর ডেটা সবসময় Volume এ রাখা হয়।',
                    },
                    {
                        key: 'C',
                        text: 'Database ধীর হয়ে যাবে, কিন্তু ডেটা থাকবে',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 6,
                text: 'রাত তিনটায় Alert এলো, Database আর কিছু লিখতে পারছে না। df -h বলছে Disk ১০০ শতাংশ ভরা। সবচেয়ে সম্ভাব্য অপরাধী কে?',
                options: [
                    {
                        key: 'A',
                        text: 'জমে থাকা Log ফাইল',
                        isCorrect: true,
                        explanation:
                            'Log Sequential Write, তাই কেউ টের পায় না, আর Rotation না থাকলে সেটা মাসের পর মাস বাড়ে।',
                    },
                    {
                        key: 'B',
                        text: 'হঠাৎ অনেক ইউজার আসা',
                        isCorrect: false,
                        explanation:
                            'তাতে CPU আর Memory এ চাপ পড়ে, Disk হঠাৎ ভরে না।',
                    },
                    {
                        key: 'C',
                        text: 'SSD ক্ষয়ে যাওয়া',
                        isCorrect: false,
                        explanation:
                            'ক্ষয় হলে অন্য লক্ষণ দেখা যায়, আর সেটা কয়েক বছরের ব্যাপার।',
                    },
                ],
            },
        ],
    },
    practicalLab: {
        title: 'নিজের Disk খুলে দেখুন',
        subtitle: 'Terminal এ চারটা পরীক্ষা',
        stepName: 'LAB',
        steps: [
            {
                title: 'কত জায়গা আর কত inode আছে দেখুন',
                description:
                    'df -h আর df -i দুইটাই চালান। দুইটার হিসাব আলাদা, আর Production এ দুইটাই ফুরাতে পারে।',
            },
            {
                title: 'জায়গা কে খেয়েছে বের করুন',
                description:
                    'du দিয়ে সবচেয়ে বড় ফোল্ডারগুলো খুঁজে বের করুন। Disk ভরে গেলে সবার আগে এই কমান্ডটাই লাগে।',
            },
            {
                title: 'inode আর Hard Link দেখুন',
                description:
                    'একটা ফাইল বানিয়ে তার inode নম্বর দেখুন, তারপর একটা Hard Link বানিয়ে দেখুন দুইটা নামের inode একই।',
            },
            {
                title: 'Sequential আর Random Write এর তফাত মাপুন',
                description:
                    'একই পরিমাণ ডেটা একবার এক ফাইলে, আরেকবার হাজারটা ছোট ফাইলে লিখে সময় মিলিয়ে দেখুন।',
            },
        ],
        codeBlocks: [
            {
                filename: '1-space-and-inodes.sh',
                language: 'bash',
                code: `# কত জায়গা খালি
df -h

# কত inode খালি, এটা অনেকেই দেখতে ভুলে যান
df -i

# কোন Disk আর কোন Partition কোথায় লাগানো
lsblk
mount | grep -E '^/dev' | column -t

# macOS এ
df -h
diskutil list`,
            },
            {
                filename: '2-who-ate-the-disk.sh',
                language: 'bash',
                code: `# এই ফোল্ডারের ভেতরে সবচেয়ে বড় দশটা জিনিস
du -sh * 2>/dev/null | sort -rh | head -10

# পুরো সার্ভারে সবচেয়ে বড় ফোল্ডারগুলো
sudo du -h --max-depth=2 / 2>/dev/null | sort -rh | head -15

# ১০০ MB এর চেয়ে বড় ফাইলগুলো
sudo find / -type f -size +100M 2>/dev/null | head -20

# Log সাধারণত এখানে জমে
sudo du -sh /var/log/*  2>/dev/null | sort -rh | head`,
            },
            {
                filename: '3-inode-and-links.sh',
                language: 'bash',
                code: `# একটা ফাইল বানানো হলো
echo 'tour data' > original.txt

# ফাইলের সব খবর, inode নম্বর সহ
stat original.txt

# শুধু inode নম্বর
ls -i original.txt

# একই inode এর দ্বিতীয় নাম
ln original.txt second-name.txt
ls -i original.txt second-name.txt
# দুইটার inode নম্বর একই, মানে ফাইল একটাই

stat original.txt | grep Links
# Links: 2   ← দুইটা নাম এই inode কে দেখাচ্ছে

# একটা নাম মুছে দিলেও ডেটা থাকে
rm original.txt
cat second-name.txt        # tour data, এখনো আছে

rm second-name.txt         # এবার গোনা শূন্য, এখন সত্যিই গেল`,
            },
            {
                filename: '4-one-big-vs-many-small.sh',
                language: 'bash',
                code: `mkdir -p /tmp/io-test && cd /tmp/io-test

# ১০০ MB Sequential Write, এক ফাইলে
time dd if=/dev/zero of=big.bin bs=1M count=100 2>/dev/null

# একই ১০০ MB, কিন্তু ১০০০ টুকরায়
time sh -c 'for i in $(seq 1 1000); do dd if=/dev/zero of=small-$i.bin bs=100K count=1 2>/dev/null; done'

# Sequential Read
time cat big.bin > /dev/null

# Random Read
time cat small-*.bin > /dev/null

# পরিষ্কার করে ফেলুন
cd /tmp && rm -rf io-test

# একই পরিমাণ ডেটা, কিন্তু সময় আলাদা।
# তফাতটা ডেটার পরিমাণে নয়, কতবার আলাদা করে যেতে হলো তাতে।`,
            },
        ],
        tip: 'df -i টা মনে রাখবেন। Disk ভরে যাওয়ার Alert এলে সবাই df -h দেখে, কিন্তু জায়গা খালি থাকা সত্ত্বেও লেখা আটকে গেলে সমস্যাটা inode এ, আর সেটা ধরতে অনেকের ঘণ্টা চলে যায়।',
    },
    assignment: {
        title: 'Mini Project: Disk Report',
        time: '১ - ২ ঘণ্টা',
        difficulty: 'Beginner Friendly',
        tasks: [
            <span key='1'>
                <strong>বর্তমান অবস্থা লিখুন:</strong> আপনার মেশিনে বা VPS এ কত
                জায়গা আর কত inode ব্যবহার হয়েছে, দুইটাই শতাংশে লিখে রাখুন।
            </span>,
            <span key='2'>
                <strong>সবচেয়ে বড় দশটা খুঁজুন:</strong> du দিয়ে সবচেয়ে বড়
                দশটা ফোল্ডার বের করুন। এর মধ্যে কোনটা মুছে ফেলা নিরাপদ আর কোনটা
                নয়, সেটাও লিখুন।
            </span>,
            <span key='3'>
                <strong>গতি মাপুন:</strong> Lab এর চার নম্বর পরীক্ষাটা চালিয়ে
                Sequential আর Random Write এর সময় লিখে রাখুন। কত গুণ তফাত হলো
                সেটা হিসাব করুন।
            </span>,
            <span key='4'>
                <strong>পরিকল্পনা লিখুন (৫ লাইন):</strong> আপনার my-tours এর জন্য
                Log Rotation এর নিয়ম কী হবে, Database এর ডেটা কোথায় থাকবে, আর
                ছবি কোথায় যাবে? প্রতিটার পেছনে কারণ লিখুন।
            </span>,
        ],
        deliverables: [
            <span key='1'>জায়গা আর inode এর বর্তমান হিসাব</span>,
            <span key='2'>সবচেয়ে বড় দশটা ফোল্ডারের তালিকা আর মন্তব্য</span>,
            <span key='3'>Sequential আর Random Write এর সময়ের তুলনা</span>,
            <span key='4'>Log, Database আর ছবির জন্য ৫ লাইনের পরিকল্পনা</span>,
        ],
    },
};
