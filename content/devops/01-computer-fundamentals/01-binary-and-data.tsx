/* eslint-disable react/jsx-key */
import {
    ContentList,
    ContentParagraph,
    ListItem,
    SectionTitle,
} from '../../../components/course/content-components';
import {
    BitSwitchLab,
    ByteScaleVisual,
    KeypressToBitsStory,
} from '../../../components/course/topics/binary/animations';
import { IslandToursBrief } from '../../../components/course/topics/island-tours/project-brief';
import {
    ByteAnatomyDiagram,
    HexBridgeDiagram,
    NameToBytesDiagram,
    SwitchDoublingDiagram,
} from '../../../components/course/topics/binary/diagrams';
import {
    CONTENT_TYPES,
    INFO_BOX_VARIANTS,
    TopicData,
} from '../../../types/content';

export const binaryAndDataContent: TopicData = {
    id: 'binary-and-data',
    introduction: {
        badge: 'MODULE 01 · LESSON 01',
        title: <SectionTitle>কম্পিউটার আসলে কী দিয়ে ভাবে?</SectionTitle>,
        description: (
            <div className='space-y-4'>
                <ContentParagraph>
                    রাতে ঘরে ঢুকে তুমি সুইচ টিপে বাতি জ্বালাও। ওই সুইচটা মাত্র
                    দুইটা জিনিস জানে: চালু আর বন্ধ। এর মাঝখানে কিছু নেই।
                    সুইচকে যদি জিজ্ঞেস করো আজকের তারিখ কত, সে বলতে পারবে না।
                    কারণ তার ভাষায় মাত্র দুইটা শব্দ আছে।
                </ContentParagraph>
                <ContentParagraph>
                    এখন একটা অদ্ভুত কথা বলি। তোমার হাতের ফোনটার ভেতরে এমন সুইচ
                    আছে কয়েক <strong>বিলিয়ন</strong>। প্রতিটার ভাষায় ওই একই
                    দুইটা শব্দ, চালু আর বন্ধ। এই বিলিয়ন সুইচ মিলে তোমার
                    ছবি রাখে, গান বাজায়, ভিডিও কলে বন্ধুর মুখ দেখায়।
                </ContentParagraph>
                <ContentParagraph>
                    প্রশ্নটা তাহলে খুব সহজ, কিন্তু উত্তরটা পুরো Computer Science
                    এর ভিত্তি, <strong>শুধু চালু আর বন্ধ দিয়ে কীভাবে
                    সবকিছু বলা সম্ভব?</strong> আজকের লেসনে আমরা সেটাই হাতে-কলমে
                    দেখব।
                </ContentParagraph>
            </div>
        ),
        quote: {
            text: 'কম্পিউটার বুদ্ধিমান না। সে শুধু এত দ্রুত হ্যাঁ-না গুনতে পারে যে আমাদের কাছে সেটা বুদ্ধি মনে হয়।',
            author: 'Computer Fundamentals',
            role: 'Lesson 01',
        },
    },
    sections: [
        /* ---------------------------------------------------------------- 1 */
        {
            id: 'theory',
            subHeader: { index: '001', title: 'Theory' },
            title: <SectionTitle>কেন শুধু ০ আর ১?</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                একটা কথা ভেবে দেখো। আমরা মানুষ ১০টা সংখ্যা
                                ব্যবহার করি, ০ থেকে ৯। কেন ১০টা? কারণ আমাদের
                                হাতে ১০টা আঙুল। ছোটবেলায় আঙুল গুনে যোগ শেখা,
                                সেখান থেকেই আমাদের গোটা সংখ্যাব্যবস্থা।
                            </ContentParagraph>
                            <ContentParagraph>
                                কম্পিউটারের আঙুল নেই। তার আছে বিদ্যুৎ। আর
                                বিদ্যুৎ দিয়ে সবচেয়ে নির্ভরযোগ্যভাবে বলা যায়
                                মাত্র দুইটা কথা, <strong>আছে</strong> বা{' '}
                                <strong>নেই</strong>।
                            </ContentParagraph>
                            <ContentParagraph>
                                এখানে একটা প্রশ্ন আসা স্বাভাবিক: বিদ্যুৎ দিয়ে
                                তো ১০টা আলাদা মাত্রা বানানো যেত, একটু বিদ্যুৎ
                                মানে ১, একটু বেশি মানে ২, আরও বেশি মানে ৩। তাহলে
                                বানানো হলো না কেন?
                            </ContentParagraph>
                            <ContentParagraph>
                                কারণ বাস্তব দুনিয়া নোংরা। তার গরম হয়, ভোল্টেজ
                                একটু ওঠানামা করে, পাশের তার থেকে সামান্য
                                হস্তক্ষেপ আসে। তখন ৩ নম্বর মাত্রা আর ৪ নম্বর
                                মাত্রার তফাত বোঝা কঠিন হয়ে যায়, একটা ভুল পড়া
                                মানে তোমার ব্যাংক ব্যালেন্স বদলে যাওয়া। কিন্তু{' '}
                                <strong>আছে</strong> আর <strong>নেই</strong> এর
                                মধ্যে গুলিয়ে ফেলা প্রায় অসম্ভব। ভোল্টেজ একটু
                                কমে গেলেও শূন্য আর অশূন্যের পার্থক্য স্পষ্ট
                                থাকে।
                            </ContentParagraph>
                            <ContentParagraph>
                                তাই কম্পিউটার নির্ভুলতা বেছে নিয়েছে, বৈচিত্র্য
                                নয়। মাত্র দুইটা অবস্থা, কিন্তু কখনো ভুল হয় না।
                                এই দুইটা অবস্থার নাম আমরা লিখি{' '}
                                <strong>০</strong> আর <strong>১</strong>।
                            </ContentParagraph>
                            <ContentParagraph>
                                আর মজার কথা হলো, কম দিয়ে বেশি বলার একটা পুরনো
                                কৌশল আমরা সবাই জানি। একটা সুইচ দুইটা কথা বলতে
                                পারে। দুইটা সুইচ পাশে রাখলে চারটা: বন্ধ-বন্ধ,
                                বন্ধ-চালু, চালু-বন্ধ, চালু-চালু। তিনটা সুইচে
                                আটটা। প্রতিটা নতুন সুইচ সম্ভাবনা{' '}
                                <strong>দ্বিগুণ</strong> করে দেয়।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CUSTOM,
                    component: <SwitchDoublingDiagram />,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'এখন সংজ্ঞাগুলো পড়া যাক',
                    content: (
                        <div className='space-y-3'>
                            <p>
                                <strong>Bit</strong> মানে একটা সুইচ। মান হয় ০, নয়
                                ১। Binary Digit এর সংক্ষেপ। এর চেয়ে ছোট কোনো
                                তথ্য কম্পিউটারে নেই।
                            </p>
                            <p>
                                <strong>Byte</strong> মানে পাশাপাশি ৮টা Bit। মান ০
                                থেকে ২৫৫ পর্যন্ত, মোট ২৫৬টা সম্ভাবনা। ফাইলের
                                সাইজ, RAM, ইন্টারনেট খরচ। সব হিসাব হয় Byte-এ।
                            </p>
                            <p>
                                <strong>Binary</strong> মানে শুধু ০ আর ১ দিয়ে
                                সংখ্যা লেখার পদ্ধতি। আমাদের দশমিক পদ্ধতিতে ঘর
                                বাড়ে ১০ গুণ করে (১, ১০, ১০০), Binary-তে বাড়ে ২
                                গুণ করে (১, ২, ৪, ৮, ১৬)।
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
            title: <SectionTitle>চোখে দেখে বোঝা যাক</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            একটা Byte-এর ভেতরটা আসলে কেমন? আটটা ঘর, প্রতিটা
                            ঘরের একটা নির্দিষ্ট দাম আছে। ডান দিক থেকে শুরু করে
                            প্রতি ঘরে দাম দ্বিগুণ হয়। যে ঘরগুলো চালু, শুধু
                            তাদের দাম যোগ করলেই সংখ্যাটা পাওয়া যায়, আর কিছু
                            করতে হয় না।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.CUSTOM,
                    component: <ByteAnatomyDiagram />,
                },
                {
                    type: CONTENT_TYPES.CUSTOM,
                    component: <BitSwitchLab />,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            উপরের সুইচগুলো নিয়ে একটু খেলো। সব চালু করে দেখো
                            সংখ্যাটা ২৫৫ হয়, এর চেয়ে বড় সংখ্যা এক Byte-এ
                            রাখা যায় না। এবার নিচের গল্পটা চালিয়ে দেখো, তুমি
                            Keyboard-এ একটা অক্ষর চাপলে ভেতরে ঠিক কী ঘটে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.CUSTOM,
                    component: <KeypressToBitsStory />,
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'মনে রাখার সহজ নিয়ম',
                    content: (
                        <p>
                            Binary থেকে দশমিকে যেতে চাইলে হিসাব করতে হয় না, শুধু
                            চালু ঘরগুলোর দাম যোগ করো। আর দশমিক থেকে Binary-তে
                            যেতে চাইলে উল্টো দিক থেকে ভাবো: ১২৮ কি নেওয়া যায়?
                            না গেলে ০, গেলে ১ লিখে বাকিটা নিয়ে এগোও।
                        </p>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 3 */
        {
            id: 'real-example',
            subHeader: { index: '003', title: 'Real Example' },
            title: <SectionTitle>বাস্তব জীবনে এটা কোথায়?</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                তিনটা ঘটনা বলি, যেগুলো তুমি হয়তো আগেও খেয়াল
                                করেছ কিন্তু কারণটা জানতে না।
                            </ContentParagraph>
                            <ContentParagraph>
                                <strong>এক।</strong> বন্ধুকে SMS পাঠাতে গিয়ে
                                দেখেছ, ইংরেজিতে লিখলে ১৬০ অক্ষর যায়, কিন্তু
                                বাংলায় লিখলে অনেক কম অক্ষরেই একটা SMS শেষ হয়ে
                                যায়। কারণ ইংরেজি একটা অক্ষর সাধারণত ১ Byte, আর
                                বাংলা একটা অক্ষর UTF-8 এ ৩ Byte। জায়গা তিন গুণ
                                লাগে, তাই অক্ষর কমে যায়।
                            </ContentParagraph>
                            <ContentParagraph>
                                <strong>দুই।</strong> মোবাইলে ১ GB ডেটা প্যাক
                                কিনে সারা মাস চালাতে পারো, কিন্তু একটা HD সিনেমা
                                নামাতে গেলেই শেষ। কারণ অক্ষর সস্তা আর ছবি-ভিডিও
                                দামি। এক পাতা লেখা মোটে কয়েক হাজার Byte, আর এক
                                সেকেন্ডের HD ভিডিও কয়েক লাখ Byte।
                            </ContentParagraph>
                            <ContentParagraph>
                                <strong>তিন।</strong> পুরনো গেমে দেখেছ স্কোর
                                ২৫৫ ছাড়ায় না, বা টাকা ৬৫,৫৩৫-এ আটকে যায়?
                                কারণ প্রোগ্রামার ওই সংখ্যার জন্য ১ Byte (২৫৬টা
                                সম্ভাবনা) বা ২ Byte (৬৫,৫৩৬টা সম্ভাবনা) বরাদ্দ
                                করেছিলেন। ঘর শেষ, তাই গোনাও শেষ।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CUSTOM,
                    component: <NameToBytesDiagram />,
                },
                {
                    type: CONTENT_TYPES.CUSTOM,
                    component: <ByteScaleVisual />,
                },
            ],
        },
        /* ---------------------------------------------------------------- 4 */
        {
            id: 'project-example',
            subHeader: { index: '004', title: 'Project Example' },
            title: (
                <SectionTitle>Island Tours-এ এটা কোথায় ঘটছে?</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.CUSTOM,
                    component: <IslandToursBrief />,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                একজন ইউজার Island Tours-এ একটা ট্যুর বুক করল।
                                পর্দায় সে দেখল শুধু একটা সবুজ Success বার্তা।
                                কিন্তু ভেতরে যা গেল, তার সবটাই Byte।
                            </ContentParagraph>
                            <ContentList>
                                <ListItem>
                                    <strong>Booking Request:</strong> Frontend
                                    থেকে যাওয়া JSON টা প্রায় ৪০০ Byte। মানে
                                    ৩,২০০টা সুইচ চালু-বন্ধ হয়ে তারের ভেতর দিয়ে
                                    গেল।
                                </ListItem>
                                <ListItem>
                                    <strong>Tour ছবি:</strong> একটা ছবি ২ MB
                                    মানে ২০ লাখ Byte। ওই এক ছবির খরচ পাঁচ হাজার
                                    Booking Request-এর সমান। এই কারণেই ছবি CDN
                                    থেকে আসে, আর API আসে সার্ভার থেকে।
                                </ListItem>
                                <ListItem>
                                    <strong>Database column:</strong> ট্যুরের
                                    নামের জন্য যদি ৫০ অক্ষরের জায়গা রাখো, বাংলা
                                    নাম দিলে ১৬-১৭ অক্ষরেই সেটা ভরে যাবে। এই ভুলে
                                    Production-এ নাম কেটে যাওয়া খুব সাধারণ ঘটনা।
                                </ListItem>
                                <ListItem>
                                    <strong>Booking ID:</strong> ID যদি ১ Byte
                                    রাখো, ২৫৫টার পর আর নতুন Booking নেওয়া যাবে
                                    না। তাই ID সাধারণত ৪ বা ৮ Byte হয়।
                                </ListItem>
                            </ContentList>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['কী পাঠানো হচ্ছে', 'সাইজ', 'কেন এটা জরুরি'],
                    rows: [
                        [
                            <span className='font-bold'>Booking JSON</span>,
                            '~৪০০ Byte',
                            'ছোট, তাই API দ্রুত। প্রতি Request-এ বাড়তি Field যোগ করলেই এটা বাড়বে।',
                        ],
                        [
                            <span className='font-bold'>JWT Token</span>,
                            '~৫০০ Byte',
                            'প্রতিটা Request-এর Header-এ যায়। বড় Token মানে সব Request ভারী।',
                        ],
                        [
                            <span className='font-bold'>Tour ছবি</span>,
                            '~২ MB',
                            'API নয়, CDN-এর কাজ। নাহলে সার্ভারের Bandwidth শেষ।',
                        ],
                        [
                            <span className='font-bold'>Tour list (২০টা)</span>,
                            '~২৫ KB',
                            'Pagination না দিলে ২০০০টা ট্যুরে এটা ২.৫ MB হয়ে যাবে।',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: 'এই লেসনের আসল দাম এখানেই',
                    content: (
                        <p>
                            Byte বোঝা মানে মুখস্থ করা নয়। Byte বোঝা মানে তুমি
                            এখন থেকে প্রশ্ন করতে পারবে: এই Response টা কত বড়,
                            এটা কি ছোট করা যায়, এই Column-এ বাংলা লেখা ধরবে
                            তো? পরের প্রতিটা লেসনে এই প্রশ্নগুলোই ফিরে আসবে।
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
                <SectionTitle>
                    Search Box-এ ঢাকা লিখলে কী কী ঘটে
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Island Tours-এর Search Box-এ তুমি লিখলে{' '}
                            <strong>ঢাকা</strong>। চার অক্ষরের এই শব্দটা সার্ভার
                            পর্যন্ত পৌঁছাতে যে ধাপগুলো পার হয়, সেটাই নিচে।
                            এখন সবটা না বুঝলেও অসুবিধা নেই, পরের লেসনগুলোতে
                            প্রতিটা ধাপ আলাদা করে খোলা হবে।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    stepName: 'STEP',
                    steps: [
                        {
                            title: 'Keyboard চাপা হলো',
                            description:
                                'Keyboard শুধু বলে কোন Key চাপা হয়েছে। এখনো কোনো অক্ষর তৈরি হয়নি, শুধু একটা সংকেত গেছে।',
                        },
                        {
                            title: 'অক্ষর → নম্বর',
                            description:
                                'ঢাকা শব্দের প্রতিটা অক্ষরের একটা Unicode নম্বর আছে। ঢ এর নম্বর ২৫৩৮ (U+09A2)।',
                        },
                        {
                            title: 'নম্বর → Byte (UTF-8)',
                            description:
                                'ওই নম্বর ১ Byte-এ ধরে না, তাই UTF-8 সেটাকে ৩ Byte-এ ভাগ করে লেখে। চার অক্ষরের ঢাকা হয়ে যায় ১২ Byte।',
                        },
                        {
                            title: 'Byte → Packet',
                            description:
                                'ওই Byte গুলো HTTP Request-এর ভেতর বসে, তারপর TCP সেটাকে Packet-এ ভরে। Module 4-এ এটাই বিস্তারিত দেখব।',
                        },
                        {
                            title: 'Packet → বিদ্যুৎ ও আলো',
                            description:
                                'তারের ভেতর Bit গুলো বিদ্যুতের চালু-বন্ধ হয়ে যায়, Fiber-এ আলোর ঝলক হয়ে যায়। Wi-Fi হলে রেডিও তরঙ্গ।',
                        },
                        {
                            title: 'সার্ভার উল্টো হিসাব করে',
                            description:
                                'সার্ভার একই UTF-8 নিয়ম জানে, তাই ১২ Byte থেকে আবার ঢাকা বানায় আর Database-এ খোঁজে। দুই পক্ষ একই নিয়ম মানে, তাই কেউ ভুল বোঝে না।',
                        },
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: 'যে ভুলটা সবার হয়',
                    content: (
                        <p>
                            কখনো Website-এ বাংলা লেখার জায়গায় উদ্ভট চিহ্ন দেখেছ?
                            ওটা হয় যখন এক পক্ষ UTF-8 নিয়মে Byte লিখেছে আর অন্য
                            পক্ষ অন্য নিয়মে পড়ার চেষ্টা করেছে। Byte গুলো ঠিকই
                            আছে, শুধু পড়ার নিয়ম মেলেনি। এই কারণেই Database,
                            Header আর File, সব জায়গায় Encoding এক রাখতে হয়।
                        </p>
                    ),
                },
            ],
        },
        /* ---------------------------------------------------------------- 6 */
        {
            id: 'hex',
            subHeader: { index: '006', title: 'Going Deeper' },
            title: <SectionTitle>Hex, ডেভেলপারদের শর্টকাট</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                একটা Byte লিখতে ৮টা অক্ষর লাগে, 01000001।
                                হাজারটা Byte লিখতে গেলে চোখ ধাঁধিয়ে যায়। তাই
                                ডেভেলপাররা একটা শর্টকাট ব্যবহার করে:{' '}
                                <strong>Hexadecimal</strong>, সংক্ষেপে Hex।
                            </ContentParagraph>
                            <ContentParagraph>
                                নিয়মটা সুন্দর। ৪টা Bit এর সম্ভাবনা ১৬টা, আর
                                Hex-এ অঙ্ক আছে ঠিক ১৬টা (০-৯ এর পর A B C D E
                                F)। তাই ৪ Bit ঠিক ১টা Hex অঙ্কে বসে যায়, আর
                                পুরো Byte বসে ২টা অঙ্কে।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CUSTOM,
                    component: <HexBridgeDiagram />,
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['যেটা দেখো', 'আসলে কী', 'কত Byte'],
                    rows: [
                        [
                            <span className='font-mono font-bold'>#FF5733</span>,
                            'তিনটা রঙের মাত্রা, লাল, সবুজ, নীল',
                            '৩ Byte',
                        ],
                        [
                            <span className='font-mono font-bold'>
                                192.168.0.1
                            </span>,
                            'IPv4 Address, চারটা সংখ্যা',
                            '৪ Byte',
                        ],
                        [
                            <span className='font-mono font-bold'>
                                A3:F1:9B:2C:41:07
                            </span>,
                            'MAC Address, ছয়টা সংখ্যা',
                            '৬ Byte',
                        ],
                        [
                            <span className='font-mono font-bold'>
                                ২৫৫ কেন সীমা
                            </span>,
                            'এক Byte-এ ২৫৬টা সম্ভাবনা, শুরু ০ থেকে',
                            '১ Byte',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'এই একটা তথ্য এখনই কাজে লাগবে',
                    content: (
                        <p>
                            IP Address-এর প্রতিটা ঘর কেন সর্বোচ্চ ২৫৫? কারণ
                            প্রতিটা ঘর ঠিক ১ Byte। Module 2-এ IP পড়ার সময়
                            এই কথাটা মনে করলে আর মুখস্থ করতে হবে না।
                        </p>
                    ),
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
                        <div className='space-y-6'>
                            <ContentParagraph>
                                নিচের চ্যানেল আর সাইটগুলো এই বিষয়ে সবচেয়ে
                                ভালো। ভিডিওর নাম দেওয়া আছে, চ্যানেলে গিয়ে
                                Search করে নিলেই পেয়ে যাবে।
                            </ContentParagraph>
                            <ContentList>
                                <ListItem>
                                    <strong>Crash Course Computer Science</strong>{' '}, Episode 4: Binary, আর Episode 5:
                                    Representing Numbers and Letters. শুরু করার
                                    জন্য সবচেয়ে ভালো।{' '}
                                    <a
                                        href='https://www.youtube.com/@crashcourse'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-primary underline underline-offset-4'>
                                        youtube.com/@crashcourse
                                    </a>
                                </ListItem>
                                <ListItem>
                                    <strong>Computerphile</strong>, Search করো:
                                    Characters, Symbols and the Unicode Miracle।
                                    UTF-8 কেন এত সুন্দর একটা ডিজাইন, সেটা এই
                                    ভিডিওর চেয়ে ভালো কেউ বলেনি।{' '}
                                    <a
                                        href='https://www.youtube.com/@Computerphile'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-primary underline underline-offset-4'>
                                        youtube.com/@Computerphile
                                    </a>
                                </ListItem>
                                <ListItem>
                                    <strong>Khan Academy</strong>, Computers
                                    and the Internet কোর্সের Digital
                                    Information অংশ। ধীরে, ধাপে ধাপে।{' '}
                                    <a
                                        href='https://www.khanacademy.org/computing/computers-and-internet'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-primary underline underline-offset-4'>
                                        khanacademy.org
                                    </a>
                                </ListItem>
                                <ListItem>
                                    <strong>পড়ার জন্য</strong>, Wikipedia-র
                                    Binary number, ASCII আর UTF-8 পাতা তিনটা।
                                    ছোট, নির্ভরযোগ্য, আর টেবিলগুলো কাজের।
                                </ListItem>
                            </ContentList>
                        </div>
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
                                কম্পিউটারের ভাষায় দুইটা শব্দ, বিদ্যুৎ আছে (১)
                                আর নেই (০)। বেশি মাত্রা বানানো যেত, কিন্তু ভুল
                                পড়ার ঝুঁকি থাকত।
                            </ListItem>
                            <ListItem>
                                একটা সুইচ = ১ Bit। আটটা সুইচ = ১ Byte = ২৫৬টা
                                সম্ভাবনা (০ থেকে ২৫৫)।
                            </ListItem>
                            <ListItem>
                                প্রতিটা ঘরের দাম ডান থেকে বাঁয়ে দ্বিগুণ হয়:
                                ১, ২, ৪, ৮, ১৬, ৩২, ৬৪, ১২৮। চালু ঘরের দাম যোগ
                                করলেই মান।
                            </ListItem>
                            <ListItem>
                                অক্ষর মানে আসলে নম্বর। A মানে ৬৫। এই তালিকার নাম
                                ASCII, আর সব ভাষার জন্য বড় তালিকার নাম Unicode।
                            </ListItem>
                            <ListItem>
                                ইংরেজি অক্ষর সাধারণত ১ Byte, বাংলা অক্ষর UTF-8
                                এ ৩ Byte। তাই বাংলা লেখা জায়গা বেশি নেয়।
                            </ListItem>
                            <ListItem>
                                Hex হলো Byte লেখার শর্টকাট, ২ অঙ্কে ১ Byte।
                                রঙের কোড, IP, MAC Address সবই এভাবে লেখা।
                            </ListItem>
                            <ListItem>
                                পরের লেসন: এই Bit গুলো নিয়ে CPU আসলে কী করে।
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
                <span className='font-bold text-primary'>Bit</span>,
                'একটা সুইচ: ০ বা ১, সবচেয়ে ছোট তথ্য',
            ],
            [
                <span className='font-bold text-primary'>Byte</span>,
                '৮টা Bit একসাথে, মোট ২৫৬টা সম্ভাবনা',
            ],
            [
                <span className='font-bold text-primary'>Binary</span>,
                'শুধু ০ আর ১ দিয়ে সংখ্যা লেখার পদ্ধতি',
            ],
            [
                <span className='font-bold text-primary'>ASCII</span>,
                'ইংরেজি অক্ষরের নম্বর তালিকা, যেখানে A মানে ৬৫',
            ],
            [
                <span className='font-bold text-primary'>Unicode / UTF-8</span>,
                'সব ভাষার অক্ষরের তালিকা, যেখানে বাংলা অক্ষর ৩ Byte',
            ],
            [
                <span className='font-bold text-primary'>Hex</span>,
                '১ Byte কে ২ অঙ্কে লেখার শর্টকাট, যেমন 0x41 মানে ৬৫',
            ],
            [
                <span className='font-bold text-primary'>MSB / LSB</span>,
                'সবচেয়ে দামি ঘর (বাঁয়ে) আর সবচেয়ে কম দামি ঘর (ডানে)',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'এক Byte-এ সর্বোচ্চ কত পর্যন্ত গোনা যায়?',
                options: [
                    {
                        key: 'A',
                        text: '১২৮',
                        isCorrect: false,
                        explanation:
                            '১২৮ শুধু সবচেয়ে বাঁ দিকের ঘরটার দাম, পুরো Byte-এর সীমা নয়।',
                    },
                    {
                        key: 'B',
                        text: '২৫৫',
                        isCorrect: true,
                        explanation:
                            '২৫৬টা সম্ভাবনা, কিন্তু গোনা শুরু ০ থেকে। তাই সর্বোচ্চ ২৫৫।',
                    },
                    {
                        key: 'C',
                        text: '২৫৬',
                        isCorrect: false,
                        explanation:
                            'সম্ভাবনা ২৫৬টা ঠিকই, কিন্তু ০ও একটা মান। তাই শেষ সংখ্যা ২৫৫।',
                    },
                    {
                        key: 'D',
                        text: '১০০০',
                        isCorrect: false,
                        explanation: 'এর জন্য অন্তত ২ Byte দরকার হবে।',
                    },
                ],
            },
            {
                id: 2,
                text: 'কম্পিউটার দশটা আলাদা ভোল্টেজ মাত্রা ব্যবহার করে না কেন?',
                options: [
                    {
                        key: 'A',
                        text: 'দশটা মাত্রা বানানো অসম্ভব',
                        isCorrect: false,
                        explanation:
                            'বানানো সম্ভব। সমস্যা বানানো নয়, নির্ভুলভাবে পড়া।',
                    },
                    {
                        key: 'B',
                        text: 'ভোল্টেজ একটু ওঠানামা করলেই পাশের মাত্রার সাথে গুলিয়ে যেতে পারে',
                        isCorrect: true,
                        explanation:
                            'দুইটা অবস্থা হলে গুলিয়ে ফেলা প্রায় অসম্ভব। নির্ভুলতাই আসল কারণ।',
                    },
                    {
                        key: 'C',
                        text: 'দশটা মাত্রায় বিদ্যুৎ বেশি লাগে',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 3,
                text: 'Binary 00001010 এর দশমিক মান কত?',
                options: [
                    {
                        key: 'A',
                        text: '৮',
                        isCorrect: false,
                        explanation: 'শুধু ৮ এর ঘর ধরলে ১০১০ নয়, ১০০০ হতো।',
                    },
                    {
                        key: 'B',
                        text: '১০',
                        isCorrect: true,
                        explanation: '৮ এর ঘর আর ২ এর ঘর চালু, ৮ + ২ = ১০।',
                    },
                    {
                        key: 'C',
                        text: '১২',
                        isCorrect: false,
                        explanation: '১২ পেতে ৮ আর ৪ এর ঘর চালু থাকতে হবে।',
                    },
                    {
                        key: 'D',
                        text: '১০১০',
                        isCorrect: false,
                        explanation:
                            'Binary কে দশমিকের মতো পড়া যায় না, ঘরের দাম যোগ করতে হয়।',
                    },
                ],
            },
            {
                id: 4,
                text: 'একটা বাংলা অক্ষর UTF-8 এ সাধারণত কত Byte নেয়?',
                options: [
                    {
                        key: 'A',
                        text: '১ Byte',
                        isCorrect: false,
                        explanation:
                            '১ Byte-এ মাত্র ২৫৬টা সম্ভাবনা, পৃথিবীর সব ভাষার অক্ষর সেখানে ধরে না।',
                    },
                    {
                        key: 'B',
                        text: '৩ Byte',
                        isCorrect: true,
                        explanation:
                            'তাই বাংলা লেখা ইংরেজির চেয়ে বেশি জায়গা নেয়, Database column size ঠিক করার সময় এটা মনে রাখতে হয়।',
                    },
                    {
                        key: 'C',
                        text: 'সব ভাষার সব অক্ষরই ১ Byte',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 5,
                text: 'IPv4 Address-এর প্রতিটা ঘর ২৫৫ এর বেশি হয় না কেন?',
                options: [
                    {
                        key: 'A',
                        text: 'কেউ নিয়ম করে দিয়েছে, কারণ নেই',
                        isCorrect: false,
                        explanation: 'কারণ আছে, আর কারণটা এই লেসনেই আছে।',
                    },
                    {
                        key: 'B',
                        text: 'প্রতিটা ঘর ঠিক ১ Byte, আর ১ Byte-এর সর্বোচ্চ মান ২৫৫',
                        isCorrect: true,
                        explanation:
                            '৪টা ঘর মানে ৪ Byte, মোট ৩২ Bit। Module 2-এ এটা আবার আসবে।',
                    },
                    {
                        key: 'C',
                        text: 'Router ২৫৫ এর বেশি বুঝতে পারে না',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 6,
                text: 'Website-এ বাংলা লেখার জায়গায় উদ্ভট চিহ্ন দেখা গেলে সাধারণত সমস্যাটা কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Byte গুলো নষ্ট হয়ে গেছে',
                        isCorrect: false,
                        explanation:
                            'বেশিরভাগ ক্ষেত্রেই Byte ঠিকই থাকে, শুধু পড়ার নিয়ম ভুল হয়।',
                    },
                    {
                        key: 'B',
                        text: 'লেখার সময় এক Encoding, পড়ার সময় অন্য Encoding ব্যবহার হয়েছে',
                        isCorrect: true,
                        explanation:
                            'দুই পক্ষের নিয়ম না মিললেই এটা হয়। তাই সব জায়গায় UTF-8 এক রাখতে হয়।',
                    },
                    {
                        key: 'C',
                        text: 'Font ইনস্টল করা নেই',
                        isCorrect: false,
                        explanation:
                            'Font সমস্যায় সাধারণত বাক্স দেখা যায়, উদ্ভট অক্ষর নয়।',
                    },
                ],
            },
        ],
    },
    practicalLab: {
        title: 'নিজের হাতে Byte দেখা',
        subtitle: 'Terminal-এ ৫টা ছোট কাজ',
        stepName: 'LAB',
        steps: [
            {
                title: 'নিজের নাম Byte-এ দেখো',
                description:
                    'Terminal খুলে নিচের প্রথম কমান্ডটা চালাও। নিজের নাম ইংরেজিতে আর বাংলায় লিখে সাইজের তফাত দেখো।',
            },
            {
                title: 'অক্ষরের নম্বর বের করো',
                description:
                    'Node.js দিয়ে যেকোনো অক্ষরের ASCII বা Unicode নম্বর আর তার Binary রূপ বের করো।',
            },
            {
                title: 'উল্টো কাজটা করো',
                description:
                    'একটা Binary স্ট্রিং থেকে আবার অক্ষরে ফিরে যাও। মিলে গেলে বুঝবে নিয়মটা ধরতে পেরেছ।',
            },
            {
                title: 'ফাইলের ভেতর উঁকি দাও',
                description:
                    'একটা ছোট Text File বানিয়ে xxd দিয়ে তার Byte গুলো নিজের চোখে দেখো।',
            },
        ],
        codeBlocks: [
            {
                filename: '1-size.sh',
                language: 'bash',
                code: `# ইংরেজি নাম কত Byte?
echo -n "Ripon" | wc -c
# ফলাফল: 5

# একই নাম বাংলায় কত Byte?
echo -n "রিপন" | wc -c
# ফলাফল: 12   ← চার অক্ষর, প্রতিটা ৩ Byte

# একটা ইমোজি কত Byte?
echo -n "🚀" | wc -c
# ফলাফল: 4`,
            },
            {
                filename: '2-char-to-binary.js',
                language: 'javascript',
                code: `// অক্ষর → নম্বর → Binary
const text = 'A';

const code = text.charCodeAt(0);          // 65
const binary = code.toString(2);          // '1000001'
const padded = binary.padStart(8, '0');   // '01000001'

console.log(text, '→', code, '→', padded);

// পুরো একটা শব্দের জন্য
for (const ch of 'Hi!') {
  const n = ch.charCodeAt(0);
  console.log(ch, n, n.toString(2).padStart(8, '0'), '0x' + n.toString(16));
}

// বাংলা অক্ষর আসলে কয় Byte, নিজে দেখো
console.log([...Buffer.from('অ')]);       // [ 224, 166, 133 ]  → ৩ Byte
console.log(Buffer.from('A').length);     // 1
console.log(Buffer.from('অ').length);     // 3`,
            },
            {
                filename: '3-binary-to-char.js',
                language: 'javascript',
                code: `// Binary → অক্ষর (উল্টো যাত্রা)
const bits = '01001000 01100101 01101100 01101100 01101111';

const text = bits
  .split(' ')
  .map(b => String.fromCharCode(parseInt(b, 2)))
  .join('');

console.log(text);   // Hello

// নিজে চেষ্টা করো: এটা কী লেখা আছে?
// 01000010 01111001 01110100 01100101`,
            },
            {
                filename: '4-inside-a-file.sh',
                language: 'bash',
                code: `# একটা ছোট ফাইল বানাও
printf 'Hi' > tiny.txt

# ফাইলের ভেতরের Byte গুলো দেখো
xxd tiny.txt
# আউটপুট:  00000000: 4869    Hi
# 48 হলো Hex, মানে 72, মানে অক্ষর H
# 69 হলো Hex, মানে 105, মানে অক্ষর i

# Binary আকারে দেখতে চাইলে
xxd -b tiny.txt
# 00000000: 01001000 01101001

# এবার বাংলা লিখে একই কাজ করো, Byte কত বাড়ল দেখো
printf 'হাই' > tiny-bn.txt
xxd tiny-bn.txt
wc -c tiny-bn.txt`,
            },
        ],
        tip: 'xxd না থাকলে od -A x -t x1z tiny.txt ব্যবহার করো, একই কাজ করবে। Windows-এ WSL বা Git Bash হলে সবগুলোই চলবে।',
    },
    assignment: {
        title: 'Mini Project, Binary Translator',
        time: '১ - ২ ঘণ্টা',
        difficulty: 'Beginner Friendly',
        tasks: [
            <span key='1'>
                <strong>Encoder:</strong> একটা ছোট Script লেখো যেটা যেকোনো
                লেখা নিয়ে প্রতিটা অক্ষরের পাশে তার নম্বর, ৮ Bit Binary আর Hex
                দেখাবে, টেবিলের মতো সাজিয়ে।
            </span>,
            <span key='2'>
                <strong>Decoder:</strong> উল্টোটাও লেখো, Binary স্ট্রিং দিলে
                আবার লেখা ফিরিয়ে দেবে। নিজের নাম Encode করে, সেটাই Decode করে
                মিলিয়ে দেখো।
            </span>,
            <span key='3'>
                <strong>Size Report:</strong> Script-টা শেষে বলবে লেখাটা কত
                Byte আর কত Bit হলো। একই বাক্য ইংরেজি আর বাংলায় লিখে দুইটা
                রিপোর্ট তুলনা করো।
            </span>,
            <span key='4'>
                <strong>ভেবে লেখো (৫ লাইন):</strong> Island Tours-এর Database-এ
                ট্যুরের নামের জন্য কত জায়গা রাখবে, আর কেন? বাংলা নাম ধরলে হিসাব
                কীভাবে বদলায়?
            </span>,
        ],
        deliverables: [
            <span key='1'>encoder আর decoder, দুইটা কাজ করা Script</span>,
            <span key='2'>
                একই বাক্যের ইংরেজি ও বাংলা Size Report এর Screenshot
            </span>,
            <span key='3'>Database column size নিয়ে ৫ লাইনের যুক্তি</span>,
        ],
    },
};
