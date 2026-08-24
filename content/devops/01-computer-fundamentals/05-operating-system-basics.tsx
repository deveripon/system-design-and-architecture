/* eslint-disable react/jsx-key */
import {
    ContentList,
    ContentParagraph,
    ListItem,
    SectionTitle,
} from '../../../components/course/content-components';
import { IslandToursBrief } from '../../../components/course/topics/island-tours/project-brief';
import {
    SchedulerLab,
    SyscallLab,
} from '../../../components/course/topics/os/animations';
import {
    KernelUserSpaceDiagram,
    SchedulerTimelineDiagram,
    VirtualMemoryDiagram,
} from '../../../components/course/topics/os/diagrams';
import {
    CONTENT_TYPES,
    INFO_BOX_VARIANTS,
    TopicData,
} from '../../../types/content';

export const operatingSystemBasicsContent: TopicData = {
    id: 'operating-system-basics',
    introduction: {
        badge: 'MODULE 01 · LESSON 05',
        title: <SectionTitle>যে ম্যানেজার সবকিছু সামলায়</SectionTitle>,
        description: (
            <div className='space-y-4'>
                <ContentParagraph>
                    গত তিনটা লেসনে আমরা তিনটা জিনিস চিনেছি। একজন অসম্ভব দ্রুত
                    কিন্তু বোকা কর্মী, যার নাম CPU। একটা কাজের টেবিল, যার নাম
                    RAM। আর একটা আলমারি, যার নাম Disk।
                </ContentParagraph>
                <ContentParagraph>
                    এখন একটা অফিসের কথা ভাবুন, যেখানে এই তিনটাই আছে কিন্তু কর্মী
                    আছেন মাত্র একজন। এদিকে কাজ চাইছে দশটা প্রজেক্ট। সবাই যদি
                    নিজের ইচ্ছামতো ওই কর্মীকে টানাটানি করে, টেবিলে যে যেখানে খুশি
                    জিনিস রাখে, আর আলমারির চাবি সবার পকেটে থাকে, তাহলে অফিসটা এক
                    ঘণ্টাও চলবে না।
                </ContentParagraph>
                <ContentParagraph>
                    তাই একজন ম্যানেজার দরকার। তিনি ঠিক করেন কে কখন কর্মীকে পাবে,
                    কার জন্য টেবিলের কোন অংশ, আর আলমারি কে খুলতে পারবে। কেউ
                    সরাসরি কিছু ছোঁয় না, সবাই ম্যানেজারের কাছে চায়।
                </ContentParagraph>
                <ContentParagraph>
                    এই ম্যানেজারের নাম <strong>Operating System</strong>। আজ
                    আমরা দেখব তিনি ঠিক কী কী করেন, আর কেন আপনার লেখা কোড তাঁকে
                    এড়িয়ে এক পাও এগোতে পারে না।
                </ContentParagraph>
            </div>
        ),
        quote: {
            text: 'আপনার Program কখনো Disk বা Network ছোঁয় না। সে শুধু OS কে অনুরোধ করে, আর OS সিদ্ধান্ত নেয়।',
            author: 'Computer Fundamentals',
            role: 'Lesson 05',
        },
    },
    sections: [
        /* ---------------------------------------------------------------- 1 */
        {
            id: 'theory',
            subHeader: { index: '001', title: 'Theory' },
            title: <SectionTitle>দুইটা ঘর আর একটা দরজা</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                OS এর সবচেয়ে গুরুত্বপূর্ণ অংশটার নাম{' '}
                                <strong>Kernel</strong>। Kernel হলো সেই ম্যানেজার
                                নিজে। আর পুরো মেশিনটা দুইটা ভাগে ভাগ করা থাকে।
                            </ContentParagraph>
                            <ContentParagraph>
                                আপনার লেখা কোড চলে <strong>User Space</strong> এ।
                                এখানে থাকা কোনো Program সরাসরি Disk এ লিখতে পারে
                                না, Network Card ছুঁতে পারে না, অন্য Program এর
                                Memory পড়তে পারে না। CPU নিজেই এই নিয়ম মানতে বাধ্য
                                করে।
                            </ContentParagraph>
                            <ContentParagraph>
                                Kernel চলে <strong>Kernel Space</strong> এ, আর
                                সেখানে সব কিছু করার ক্ষমতা তার আছে। দুই ঘরের
                                মাঝখানে একটাই দরজা, যার নাম{' '}
                                <strong>System Call</strong>। আপনি যখন একটা ফাইল
                                Save করেন, একটা API Request পাঠান, বা শুধু সময়
                                জানতে চান, প্রতিবারই ওই দরজা দিয়ে একটা অনুরোধ
                                যায়।
                            </ContentParagraph>
                        </div>
                    ),
                },
                { type: CONTENT_TYPES.CUSTOM, component: <KernelUserSpaceDiagram /> },
                { type: CONTENT_TYPES.CUSTOM, component: <SyscallLab /> },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'কেন এই দেয়ালটা এত জরুরি',
                    content: (
                        <div className='space-y-3'>
                            <p>
                                <strong>নিরাপত্তা।</strong> একটা Program চাইলেই
                                অন্য Program এর পাসওয়ার্ড Memory থেকে পড়ে ফেলতে
                                পারত। Kernel সেটা হতে দেয় না।
                            </p>
                            <p>
                                <strong>স্থিতিশীলতা।</strong> একটা Program ভেঙে
                                পড়লে শুধু সেটাই মরে। বাকি সব চলতে থাকে, কারণ কেউ
                                কারো জায়গায় হাত দিতে পারেনি।
                            </p>
                            <p>
                                <strong>ন্যায্যতা।</strong> একটা Program পুরো CPU
                                দখল করে বসে থাকতে পারে না, কারণ Kernel জোর করে
                                তার হাত থেকে CPU কেড়ে নিতে পারে।
                            </p>
                        </div>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 2 */
        {
            id: 'scheduler',
            subHeader: { index: '002', title: 'The Scheduler' },
            title: <SectionTitle>এক Core, দশটা কাজ</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                আপনার ল্যাপটপে এই মুহূর্তে হয়তো দুইশ Process
                                চলছে, অথচ Core আছে চার বা আটটা। তাহলে সবাই একসাথে
                                চলছে কীভাবে?
                            </ContentParagraph>
                            <ContentParagraph>
                                উত্তরটা হলো, চলছে না। Kernel এর যে অংশটা এই
                                সিদ্ধান্ত নেয় তার নাম <strong>Scheduler</strong>।
                                সে প্রতিটা Process কে কয়েক মিলিসেকেন্ডের জন্য
                                Core দেয়, তারপর কেড়ে নিয়ে পরেরজনকে দেয়। এই
                                কেড়ে নেওয়ার ক্ষমতাটার নাম{' '}
                                <strong>Preemption</strong>, আর প্রতিটা হাত
                                বদলের নাম <strong>Context Switch</strong>।
                            </ContentParagraph>
                            <ContentParagraph>
                                এত দ্রুত এই অদলবদল হয় যে আমাদের চোখে সব একসাথে
                                চলছে মনে হয়। কিন্তু প্রতিটা Context Switch এ
                                Kernel কে আগের Process এর অবস্থা মনে রাখতে হয় আর
                                নতুনটার অবস্থা ফিরিয়ে আনতে হয়, তাই প্রতিবারই
                                অল্প একটু সময় নষ্ট হয়।
                            </ContentParagraph>
                        </div>
                    ),
                },
                { type: CONTENT_TYPES.CUSTOM, component: <SchedulerTimelineDiagram /> },
                { type: CONTENT_TYPES.CUSTOM, component: <SchedulerLab /> },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'Load Average আসলে কী বলে',
                    content: (
                        <p>
                            htop বা uptime এ যে তিনটা সংখ্যা দেখা যায়, সেটা CPU
                            এর শতাংশ নয়। ওটা বলে গড়ে কতগুলো Process চলছে বা
                            চলার জন্য লাইনে দাঁড়িয়ে আছে। ৪ Core এর মেশিনে Load
                            Average ৪ মানে ঠিক ভরা, ৮ মানে প্রতিটা Process কে
                            তার পালার জন্য অপেক্ষা করতে হচ্ছে। এই কারণেই Load
                            Average দেখার আগে Core সংখ্যাটা জানা লাগে।
                        </p>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 3 */
        {
            id: 'memory',
            subHeader: { index: '003', title: 'Memory Management' },
            title: (
                <SectionTitle>সবাই ভাবে পুরো RAM তার একার</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                আগের লেসনে আমরা RAM এর Address নিয়ে কথা বলেছি।
                                এখন একটা মজার সত্যি বলি। আপনার Program যে
                                Address গুলো দেখে, সেগুলো আসল নয়।
                            </ContentParagraph>
                            <ContentParagraph>
                                Kernel প্রতিটা Process কে একটা নিজস্ব কাল্পনিক
                                Memory দেয়, যার নাম{' '}
                                <strong>Virtual Memory</strong>। প্রতিটা Process
                                ভাবে সে শূন্য থেকে শুরু করে পুরো Memory একাই
                                পেয়েছে। বাস্তবে তার Page গুলো RAM এর এলোমেলো
                                জায়গায় ছড়িয়ে আছে, আর কিছু Page হয়তো Disk এ
                                সরিয়ে রাখা হয়েছে।
                            </ContentParagraph>
                            <ContentParagraph>
                                এই অনুবাদটা করে Kernel, আর CPU এর ভেতরের একটা
                                অংশ তাকে সাহায্য করে। এর ফলেই একটা Process অন্য
                                Process এর Memory ছুঁতে পারে না। ঠিকানাটাই আলাদা
                                দুনিয়ার।
                            </ContentParagraph>
                        </div>
                    ),
                },
                { type: CONTENT_TYPES.CUSTOM, component: <VirtualMemoryDiagram /> },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: 'RAM শেষ হলে Kernel কী করে',
                    content: (
                        <p>
                            RAM ফুরিয়ে এলে Kernel প্রথমে কম ব্যবহৃত Page গুলো
                            Disk এ সরিয়ে রাখে, যাকে বলে <strong>Swap</strong>।
                            এতে Process বেঁচে যায়, কিন্তু ভয়ংকর ধীর হয়ে যায়,
                            কারণ RAM এর বদলে এখন Disk থেকে Read করতে হচ্ছে।
                            তাতেও না কুলালে Kernel সবচেয়ে বেশি Memory খাওয়া
                            Process টাকে বেছে নিয়ে মেরে ফেলে। এই অংশটার নাম OOM
                            Killer, আর তার কাজের চিহ্নই সেই exit code 137, যেটা
                            লেসন ০৩ এ দেখেছিলেন।
                        </p>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 4 */
        {
            id: 'project-example',
            subHeader: { index: '004', title: 'Project Example' },
            title: <SectionTitle>Island Tours এ OS রোজ কী করে</SectionTitle>,
            blocks: [
                { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                VPS টা চলে Ubuntu Linux এ। আমরা সরাসরি Kernel এর
                                সাথে কথা বলি না, কিন্তু প্রতিদিনের কাজগুলোর
                                পেছনে সে ঠিকই আছে।
                            </ContentParagraph>
                            <ContentList>
                                <ListItem>
                                    <strong>systemd API কে বাঁচিয়ে রাখে:</strong>{' '}
                                    সার্ভার Reboot হলে API নিজে থেকে চালু হয়,
                                    আর Crash করলে আবার চালু হয়। এই কাজটা করে
                                    systemd, যেটা Linux এর প্রথম Process আর বাকি
                                    সব Process এর অভিভাবক।
                                </ListItem>
                                <ListItem>
                                    <strong>Deploy এর সময় SIGTERM:</strong> নতুন
                                    Version নামানোর সময় পুরনো Process কে প্রথমে
                                    SIGTERM পাঠানো হয়, যার মানে গুছিয়ে বন্ধ হও।
                                    কোড যদি ওই Signal ধরে চলতি Request গুলো শেষ
                                    করে, তাহলে কোনো ইউজার Error দেখে না। না ধরলে
                                    কিছুক্ষণ পর SIGKILL আসে, আর সেটা ধরার কোনো
                                    উপায় নেই।
                                </ListItem>
                                <ListItem>
                                    <strong>Too many open files:</strong> প্রতিটা
                                    খোলা Connection আর ফাইল একটা করে File
                                    Descriptor খরচ করে, আর প্রতিটা Process এর
                                    একটা সীমা আছে। Connection ঠিকমতো বন্ধ না হলে
                                    ওই সীমা ভরে যায়, আর হঠাৎ কোনো নতুন Request
                                    নেওয়া যায় না।
                                </ListItem>
                                <ListItem>
                                    <strong>Container আসলে OS এর কারসাজি:</strong>{' '}
                                    Docker কোনো ছোট Virtual Machine নয়। ওটা
                                    Kernel এর দুইটা সুবিধা ব্যবহার করে: Namespace
                                    দিয়ে Process কে আলাদা দুনিয়া দেখানো, আর
                                    cgroup দিয়ে CPU আর Memory এর সীমা বেঁধে
                                    দেওয়া। Module 10 এ এটাই খুলে দেখব।
                                </ListItem>
                                <ListItem>
                                    <strong>API root হয়ে চলে না:</strong> আলাদা
                                    একটা User বানিয়ে তাকে দিয়ে API চালানো হয়।
                                    কারণ ওই Process কোনোভাবে দখল হয়ে গেলেও সে
                                    পুরো সার্ভারের মালিক হতে পারবে না।
                                </ListItem>
                            </ContentList>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: 'Deploy এর সময় যে ভুলটা সবচেয়ে বেশি হয়',
                    content: (
                        <p>
                            SIGTERM না ধরা। তখন প্রতিটা Deploy এ চলতি Request
                            গুলো মাঝপথে কেটে যায়। ইউজার দেখে হঠাৎ একটা Error,
                            আর লগে কিছুই থাকে না, তাই কারণটা খুঁজে পাওয়া কঠিন।
                            নিচের Lab এ আপনি নিজেই একটা Process কে SIGTERM
                            পাঠিয়ে দেখবেন, ধরা আর না ধরার তফাতটা কী।
                        </p>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 5 */
        {
            id: 'request-flow',
            subHeader: { index: '005', title: 'Step-by-step Flow' },
            title: <SectionTitle>node server.js লিখলে কী কী হয়</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Terminal এ আপনি লিখলেন{' '}
                            <strong className='font-mono'>node server.js</strong>{' '}
                            আর Enter চাপলেন। এর পরের কয়েক মিলিসেকেন্ডে OS যা যা
                            করে, সেটাই নিচে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    stepName: 'STEP',
                    steps: [
                        {
                            title: 'Shell নিজের একটা কপি বানাল',
                            description:
                                'fork() System Call দিয়ে Shell নিজের হুবহু একটা কপি তৈরি করে। এই নতুন Process টাই আপনার Program হবে।',
                        },
                        {
                            title: 'কপিটা Node হয়ে গেল',
                            description:
                                'exec() System Call ওই কপির ভেতরের সব কিছু মুছে সেখানে node Program টা বসিয়ে দেয়। Process এর নম্বর একই থাকে, কিন্তু ভেতরের বাসিন্দা বদলে যায়।',
                        },
                        {
                            title: 'Kernel Memory সাজিয়ে দিল',
                            description:
                                'নতুন Process এর জন্য Virtual Memory তৈরি হলো, Code আর Stack বসল, আর Disk থেকে দরকারি অংশগুলো ধীরে ধীরে আনা শুরু হলো।',
                        },
                        {
                            title: 'Scheduler লাইনে দাঁড় করাল',
                            description:
                                'Process এখন চলার জন্য প্রস্তুত, কিন্তু সাথে সাথে চলে না। সে অপেক্ষা করে কখন Scheduler তাকে একটা Core দেবে।',
                        },
                        {
                            title: 'Program চলল, আর বারবার Kernel এ ফিরল',
                            description:
                                'ফাইল খোলা, Port এ Listen করা, প্রতিটা Request পড়া, সব কিছুর জন্যই আলাদা করে System Call লাগে।',
                        },
                        {
                            title: 'শেষ হলে অভিভাবক জানল',
                            description:
                                'Process শেষ হলে সে একটা Exit Code রেখে যায়, আর তার অভিভাবক সেটা পড়ে বোঝে কাজটা ঠিকমতো হয়েছিল কিনা।',
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
                                <strong>Computerphile</strong>, Search করুন:
                                What is a Kernel, আর Operating Systems.{' '}
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
                                Episode 18 (Operating Systems)।{' '}
                                <a
                                    href='https://www.youtube.com/@crashcourse'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-primary underline underline-offset-4'>
                                    youtube.com/@crashcourse
                                </a>
                            </ListItem>
                            <ListItem>
                                <strong>পড়ার জন্য</strong>, Operating Systems:
                                Three Easy Pieces বইটা পুরো ফ্রি আর অনলাইনে
                                আছে। Virtualization অধ্যায়ের প্রথম কয়েকটা পাতা
                                এই লেসনের ঠিক পরের ধাপ।{' '}
                                <a
                                    href='https://pages.cs.wisc.edu/~remzi/OSTEP/'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-primary underline underline-offset-4'>
                                    pages.cs.wisc.edu/~remzi/OSTEP
                                </a>
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
                                OS হলো সেই ম্যানেজার, যিনি CPU, RAM, Disk আর
                                Network কে অনেকগুলো Program এর মধ্যে ভাগ করে
                                দেন।
                            </ListItem>
                            <ListItem>
                                মেশিন দুই ভাগে বিভক্ত। আপনার কোড থাকে User Space
                                এ, Kernel থাকে Kernel Space এ, আর মাঝখানে একটাই
                                দরজা, System Call।
                            </ListItem>
                            <ListItem>
                                এই দেয়ালটাই নিরাপত্তা, স্থিতিশীলতা আর ন্যায্যতা
                                তিনটাই দেয়।
                            </ListItem>
                            <ListItem>
                                Scheduler প্রতিটা Process কে কয়েক মিলিসেকেন্ডের
                                টুকরো দেয়, আর জোর করে কেড়েও নিতে পারে।
                            </ListItem>
                            <ListItem>
                                Load Average মানে CPU এর শতাংশ নয়, ওটা লাইনের
                                দৈর্ঘ্য। বোঝার জন্য Core সংখ্যা জানা লাগে।
                            </ListItem>
                            <ListItem>
                                প্রতিটা Process ভাবে পুরো RAM তার। Kernel
                                Virtual Memory দিয়ে এই বিভ্রম তৈরি করে, আর তাতেই
                                একে অন্যের থেকে আলাদা থাকে।
                            </ListItem>
                            <ListItem>
                                RAM ফুরালে আগে Swap, তারপর OOM Killer, আর সেটাই
                                exit code 137।
                            </ListItem>
                            <ListItem>
                                Deploy এ SIGTERM ধরা মানে ইউজার কোনো Error দেখে
                                না। না ধরলে SIGKILL আসে, আর সেটা ধরা যায় না।
                            </ListItem>
                            <ListItem>
                                পরের লেসন: এই Process গুলোর ভেতরে ঢুকব, মানে
                                Process, Thread আর Concurrency।
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
                <span className='font-bold text-primary'>Kernel</span>,
                'OS এর মূল অংশ, যার সব কিছু করার ক্ষমতা আছে',
            ],
            [
                <span className='font-bold text-primary'>User Space</span>,
                'আপনার কোড যেখানে চলে, হার্ডওয়্যার থেকে দূরে',
            ],
            [
                <span className='font-bold text-primary'>System Call</span>,
                'User Space থেকে Kernel এ যাওয়ার একমাত্র দরজা',
            ],
            [
                <span className='font-bold text-primary'>Scheduler</span>,
                'কে কখন কত সময়ের জন্য Core পাবে সেটা ঠিক করে',
            ],
            [
                <span className='font-bold text-primary'>Context Switch</span>,
                'এক Process থেকে আরেকটায় হাত বদল, প্রতিবারই একটু খরচ',
            ],
            [
                <span className='font-bold text-primary'>Virtual Memory</span>,
                'প্রতিটা Process এর নিজস্ব কাল্পনিক Memory',
            ],
            [
                <span className='font-bold text-primary'>Swap</span>,
                'RAM কম পড়লে Page গুলো Disk এ সরিয়ে রাখা',
            ],
            [
                <span className='font-bold text-primary'>SIGTERM</span>,
                'গুছিয়ে বন্ধ হওয়ার অনুরোধ, যেটা ধরা যায়',
            ],
            [
                <span className='font-bold text-primary'>SIGKILL</span>,
                'সাথে সাথে মেরে ফেলা, যেটা ধরার কোনো উপায় নেই',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'আপনার Node.js কোড সরাসরি Disk এ Write করতে পারে না কেন?',
                options: [
                    {
                        key: 'A',
                        text: 'JavaScript ভাষার সীমাবদ্ধতা',
                        isCorrect: false,
                        explanation:
                            'C দিয়ে লিখলেও একই নিয়ম। এটা ভাষার ব্যাপার নয়, মেশিনের ব্যাপার।',
                    },
                    {
                        key: 'B',
                        text: 'কোড চলে User Space এ, আর হার্ডওয়্যার ছোঁয়ার ক্ষমতা শুধু Kernel এর',
                        isCorrect: true,
                        explanation:
                            'তাই প্রতিবার System Call দিয়ে Kernel এর কাছে অনুরোধ করতে হয়।',
                    },
                    {
                        key: 'C',
                        text: 'Disk খুব ধীর, তাই সরাসরি লেখা নিষিদ্ধ',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 2,
                text: '৪ Core এর সার্ভারে Load Average দেখাচ্ছে ৮। এর মানে কী?',
                options: [
                    {
                        key: 'A',
                        text: 'CPU ৮ শতাংশ ব্যবহার হচ্ছে',
                        isCorrect: false,
                        explanation:
                            'Load Average শতাংশ নয়। এটা গড়ে কতগুলো Process চলছে বা লাইনে আছে সেই সংখ্যা।',
                    },
                    {
                        key: 'B',
                        text: 'Core এর তুলনায় দ্বিগুণ কাজ জমেছে, তাই সবাইকে অপেক্ষা করতে হচ্ছে',
                        isCorrect: true,
                        explanation:
                            '৪ Core এ Load ৪ মানে ঠিক ভরা। ৮ মানে প্রতিটা Process গড়ে অর্ধেক সময় লাইনে দাঁড়িয়ে থাকছে।',
                    },
                    {
                        key: 'C',
                        text: 'সার্ভার একদম খালি',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 3,
                text: 'একটা Process অন্য Process এর Memory পড়তে পারে না কেন?',
                options: [
                    {
                        key: 'A',
                        text: 'RAM এ যথেষ্ট জায়গা নেই',
                        isCorrect: false,
                    },
                    {
                        key: 'B',
                        text: 'প্রতিটা Process এর নিজস্ব Virtual Memory আছে, তাই ঠিকানাগুলোই আলাদা দুনিয়ার',
                        isCorrect: true,
                        explanation:
                            'Kernel এর ম্যাপ ছাড়া একটা Virtual ঠিকানা RAM এর কোথায় বসে সেটা জানারই উপায় নেই।',
                    },
                    {
                        key: 'C',
                        text: 'Program গুলো ভদ্রভাবে নিজেদের সীমা মেনে চলে',
                        isCorrect: false,
                        explanation:
                            'ভদ্রতার উপর ছেড়ে দিলে যেকোনো খারাপ Program সব পড়ে ফেলত। এটা জোর করে আটকানো হয়।',
                    },
                ],
            },
            {
                id: 4,
                text: 'Deploy এর সময় পুরনো Process কে SIGTERM পাঠানো হলো, কিন্তু কোড সেটা ধরে না। কী হবে?',
                options: [
                    {
                        key: 'A',
                        text: 'Process টা চলতেই থাকবে, কিছু হবে না',
                        isCorrect: false,
                        explanation:
                            'কিছুক্ষণ পর SIGKILL আসে, আর তখন আর বাঁচার উপায় থাকে না।',
                    },
                    {
                        key: 'B',
                        text: 'কিছুক্ষণ পর SIGKILL আসবে আর চলতি Request গুলো মাঝপথে কেটে যাবে',
                        isCorrect: true,
                        explanation:
                            'এই কারণেই SIGTERM ধরে চলতি কাজ শেষ করার সুযোগ নেওয়া উচিত। একেই বলে Graceful Shutdown।',
                    },
                    {
                        key: 'C',
                        text: 'সার্ভার Reboot হয়ে যাবে',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 5,
                text: 'Docker Container আসলে কী?',
                options: [
                    {
                        key: 'A',
                        text: 'একটা ছোট Virtual Machine, যার নিজের Kernel আছে',
                        isCorrect: false,
                        explanation:
                            'Container এর নিজের Kernel নেই। সে হোস্টের Kernel ই ব্যবহার করে, আর এই কারণেই সে এত হালকা।',
                    },
                    {
                        key: 'B',
                        text: 'সাধারণ একটা Process, যাকে Namespace আর cgroup দিয়ে আলাদা করে রাখা হয়েছে',
                        isCorrect: true,
                        explanation:
                            'Namespace তাকে আলাদা দুনিয়া দেখায়, আর cgroup তার CPU আর Memory এর সীমা বেঁধে দেয়। দুইটাই Kernel এর সুবিধা।',
                    },
                    {
                        key: 'C',
                        text: 'একটা বিশেষ ধরনের Filesystem',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 6,
                text: 'সার্ভার হঠাৎ ভয়ংকর ধীর, CPU ব্যবহার কম, কিন্তু Disk অবিরাম ব্যস্ত। প্রথমে কী সন্দেহ করবেন?',
                options: [
                    {
                        key: 'A',
                        text: 'Network সমস্যা',
                        isCorrect: false,
                    },
                    {
                        key: 'B',
                        text: 'RAM ফুরিয়ে গেছে, তাই Swap চলছে',
                        isCorrect: true,
                        explanation:
                            'Swap মানে RAM এর কাজ Disk দিয়ে করানো, আর সেটা কয়েক হাজার গুণ ধীর। free -h দিয়ে সাথে সাথে যাচাই করা যায়।',
                    },
                    {
                        key: 'C',
                        text: 'CPU নষ্ট হয়ে গেছে',
                        isCorrect: false,
                    },
                ],
            },
        ],
    },
    practicalLab: {
        title: 'Kernel এর সাথে পরিচয়',
        subtitle: 'Terminal এ চারটা পরীক্ষা',
        stepName: 'LAB',
        steps: [
            {
                title: 'System Call নিজের চোখে দেখুন',
                description:
                    'strace দিয়ে দেখুন একটা সাধারণ কমান্ড চালাতে কতগুলো System Call লাগে। এই একটা কমান্ড পুরো লেসনটা চোখের সামনে এনে দেয়।',
            },
            {
                title: 'কে কত CPU নিচ্ছে দেখুন',
                description:
                    'Load Average আর প্রতি Process এর অবস্থা দেখুন, আর মিলিয়ে নিন সংখ্যাগুলো কী বলছে।',
            },
            {
                title: 'SIGTERM ধরে দেখুন',
                description:
                    'একটা ছোট Node Script চালিয়ে তাকে SIGTERM পাঠান, আর দেখুন গুছিয়ে বন্ধ হওয়া আর হঠাৎ মরে যাওয়ার তফাত।',
            },
            {
                title: 'সীমাগুলো দেখে নিন',
                description:
                    'একটা Process সর্বোচ্চ কতগুলো ফাইল খুলতে পারে, আর এখন কতগুলো খোলা আছে সেটা বের করুন।',
            },
        ],
        codeBlocks: [
            {
                filename: '1-see-syscalls.sh',
                language: 'bash',
                code: `# Linux এ: একটা ls চালাতে কী কী System Call লাগে
strace ls 2>&1 | head -30

# গুনে দেখুন কোন Call কতবার হলো
strace -c ls

# একটা চলতে থাকা Process এ উঁকি দিন
sudo strace -p <PID> -c

# macOS এ strace নেই, বদলে
sudo dtruss ls 2>&1 | head -30

# খেয়াল করুন: openat, read, write, close, mmap।
# আপনার কোড কিছুই সরাসরি করেনি, সব Kernel কে দিয়ে করিয়েছে।`,
            },
            {
                filename: '2-who-wants-the-cpu.sh',
                language: 'bash',
                code: `# Load Average, তিনটা সংখ্যা: ১, ৫ আর ১৫ মিনিটের গড়
uptime

# কয়টা Core আছে, মিলিয়ে দেখার জন্য
nproc                    # macOS এ: sysctl -n hw.ncpu

# CPU অনুযায়ী সাজানো Process
ps -eo pid,comm,%cpu,%mem,stat --sort=-%cpu | head -10

# stat কলামের মানে
#   R = চলছে, S = অপেক্ষায় ঘুমাচ্ছে
#   D = Disk এর অপেক্ষায় আটকে আছে, Z = Zombie

# Linux এ একটা Process এর সব খবর
cat /proc/$$/status | head -20`,
            },
            {
                filename: '3-graceful-shutdown.js',
                language: 'javascript',
                code: `// একটা সার্ভার নকল করা হলো, যার হাতে চলতি কাজ আছে
let inFlight = 0;
let shuttingDown = false;

setInterval(() => {
  if (!shuttingDown) {
    inFlight++;
    setTimeout(() => inFlight--, 3000);   // প্রতিটা Request ৩ সেকেন্ড নেয়
  }
}, 500);

console.log('PID:', process.pid, '| থামাতে: kill -TERM', process.pid);

process.on('SIGTERM', () => {
  shuttingDown = true;
  console.log('SIGTERM পেলাম। নতুন Request নেওয়া বন্ধ।');
  console.log('চলতি Request:', inFlight, 'টা, শেষ হওয়া পর্যন্ত অপেক্ষা করছি।');

  const timer = setInterval(() => {
    if (inFlight === 0) {
      clearInterval(timer);
      console.log('সব শেষ। এখন গুছিয়ে বিদায় নিলাম।');
      process.exit(0);
    }
  }, 200);
});

// অন্য Terminal থেকে চালিয়ে দেখুন:
//   kill -TERM <PID>    ← গুছিয়ে বন্ধ হবে
//   kill -KILL <PID>    ← সাথে সাথে মরে যাবে, উপরের কোনো কোড চলবে না`,
            },
            {
                filename: '4-limits.sh',
                language: 'bash',
                code: `# একটা Process সর্বোচ্চ কতগুলো ফাইল খুলতে পারে
ulimit -n

# সব সীমা একসাথে
ulimit -a

# একটা Process এখন কতগুলো ফাইল আর Connection খুলে রেখেছে
lsof -p <PID> | wc -l

# সার্ভারে সবচেয়ে বেশি ফাইল খুলে রাখা Process গুলো
sudo lsof | awk '{print $2}' | sort | uniq -c | sort -rn | head

# Connection যদি বন্ধ না হয়, এই সংখ্যাটা বাড়তেই থাকে,
# আর একদিন Too many open files এসে সব থামিয়ে দেয়।`,
            },
        ],
        tip: 'strace -c ls টা অন্তত একবার চালান। ডানদিকের গোনাটা দেখলে বোঝা যায়, এত ছোট একটা কমান্ডও কয়েকশ বার Kernel এর দরজায় কড়া নেড়েছে। এই একটা আউটপুট User Space আর Kernel Space এর পুরো ধারণাটা বাস্তব করে দেয়।',
    },
    assignment: {
        title: 'Mini Project: Graceful Shutdown',
        time: '১ - ২ ঘণ্টা',
        difficulty: 'Beginner Friendly',
        tasks: [
            <span key='1'>
                <strong>Syscall গুনুন:</strong> strace -c দিয়ে ls আর node -e
                &quot;1&quot; দুইটার System Call গুনে তুলনা করুন। কোনটা কতগুলো,
                আর কেন এত তফাত?
            </span>,
            <span key='2'>
                <strong>দুইভাবে মারুন:</strong> Lab এর Script টা চালিয়ে একবার
                SIGTERM আর একবার SIGKILL পাঠান। দুইবারের আউটপুট পাশাপাশি লিখুন।
            </span>,
            <span key='3'>
                <strong>নিজের API তে যোগ করুন:</strong> আপনার my-tours API এ
                SIGTERM Handler লিখুন, যেটা নতুন Request নেওয়া বন্ধ করবে, চলতি
                কাজ শেষ করবে, তারপর Database Connection বন্ধ করে বিদায় নেবে।
            </span>,
            <span key='4'>
                <strong>লিখে রাখুন (৫ লাইন):</strong> Deploy এর সময় Graceful
                Shutdown না থাকলে ইউজারের অভিজ্ঞতা ঠিক কেমন হয়? আর আপনি কত
                সেকেন্ড অপেক্ষা করাবেন, কেন?
            </span>,
        ],
        deliverables: [
            <span key='1'>দুইটা কমান্ডের System Call গোনার তুলনা</span>,
            <span key='2'>SIGTERM আর SIGKILL এর আউটপুট পাশাপাশি</span>,
            <span key='3'>my-tours এর কাজ করা SIGTERM Handler</span>,
            <span key='4'>অপেক্ষার সময় নিয়ে ৫ লাইনের যুক্তি</span>,
        ],
    },
};
