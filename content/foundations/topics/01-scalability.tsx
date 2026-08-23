/* eslint-disable react/jsx-key */
import {
    ConceptHeading,
    ContentImage,
    ContentList,
    ContentParagraph,
    ListItem,
    SectionTitle,
} from '../../../components/course/content-components';
import {
    HorizontalScalingDiagram,
    VerticalScalingDiagram,
} from '../../../components/course/topics/scalability/diagrams';
import { CollapsibleCodeExample } from '../../../components/course/collapsible-code-example';
import {
    CONTENT_TYPES,
    INFO_BOX_VARIANTS,
    TopicData,
} from '../../../types/content';

export const scalabilityContent: TopicData = {
    id: 'scalability',
    sections: [
        {
            id: 'intro-concept',
            subHeader: { index: '001', title: 'Introduction' },
            title: <SectionTitle>SCALABILITY আসলে কি?</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                ধরুন আপনি একটা দারুণ অ্যাপ বানালেন। এবং আপনার
                                বাড়িতে থাকা একটা ল্যাপটপকেই সার্ভার বানিয়ে
                                অ্যাপটা লাইভ করে দিলেন। শুরুতে ১০০ ইউজার, সব
                                চমৎকার চলছে। কিন্তু অ্যাপটি জনপ্রিয় হতেই শুরু
                                হলো বিপদ! ইউজাররা কমপ্লেইন করছে অ্যাপ নাকি
                                কচ্ছপের গতিতে চলে। চেক করে দেখলেন যে আপনার
                                সার্ভারের র‍্যাম আর সিপিইউ ১০০% ছুঁয়েছে,
                                ল্যাপটপের ফ্যান হেলিকপ্টারের মতো শব্দ করছে মনে
                                হচ্ছে এই এখনি মনে হয় ল্যাপটপ পুড়ে গলে যাবে।
                            </ContentParagraph>
                            <ContentImage
                                src='/topics/scalability/stressed_laptop.png'
                                alt='Stressed server illustration'
                                caption='সার্ভার যখন লোড সামলাতে হিমশিম খায়'
                            />
                            <ContentParagraph>
                                তখনি আপনি বুঝতে পারলেন যে আপনার ল্যাপটপের পক্ষে
                                এই এত ইউজারের লোড সামলানো সম্ভব না । তাই আপনি
                                চিন্তা করলেন যে ল্যাপটপ দিয়ে হবেনা, তাই আপনি
                                একটি বিশাল কনফিগারেশর কম্পিউটার কিনে আনলেন এবং
                                সেটাতে সার্ভার সেটআপ করলেন।
                            </ContentParagraph>
                            <ContentParagraph>
                                এইযে আপনি বাড়তি ইউজারের লোড সামলাতে আপনার
                                সিস্টেমের ক্ষমতা বাড়ালেন, এইটাই মূলত স্কেল করা।
                            </ContentParagraph>

                            <ContentParagraph>
                                সিস্টেম যখন বাড়তে থাকা ইউজারের চাপ আর সামলাতে
                                পারে না, তখনই দরকার হয়{' '}
                                <strong>Scalability</strong>। সহজ কথায়, বাড়তি
                                লোড হ্যান্ডেল করার জন্য সিস্টেমকে বড় করার
                                ক্ষমতাই হলো স্কেলেবিলিটি।
                            </ContentParagraph>

                            <ContentParagraph>
                                এই যে স্কেল করার ব্যাপারটা, এইটাকে মূলত দুইভাবে
                                ভাগ করা হয়,{' '}
                                <strong className='text-foreground'>
                                    Vertical Scaling
                                </strong>{' '}
                                এবং{' '}
                                <strong className='text-foreground'>
                                    Horizontal Scaling
                                </strong>
                                ।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'DEFINITION',
                    content: (
                        <p>
                            <strong>Scalability</strong> হলো একটা system এর
                            ক্ষমতা — বাড়তি load (users, data, requests) handle
                            করার জন্য পারফরম্যান্স ঠিক রেখে নিজেকে বড় করার
                            ক্ষমতা।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'vertical',
            subHeader: { index: '002', title: 'Vertical Scaling' },
            title: <SectionTitle>Vertical Scaling (Scaling Up)</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                যখন আপনার সার্ভার স্লো হয়ে যায়, তখন সবচেয়ে সহজ
                                সমাধান কী? বাজার থেকে বেশি RAM বা ভালো প্রসেসর
                                কিনে আপনার ওই একটা কম্পিউটারকেই শক্তিশালী
                                বানানো। এটাকে বলা হয়{' '}
                                <strong className='text-foreground'>
                                    Vertical Scaling
                                </strong>{' '}
                                বা{' '}
                                <strong className='text-foreground'>
                                    Scaling Up
                                </strong>
                                ।
                            </ContentParagraph>
                            <ContentImage
                                src='/topics/scalability/beast_pc.png'
                                alt='Powerful workstation illustration'
                                caption='ভার্টিক্যাল স্কেলিং: একটি শক্তিশালী দানব পিসি'
                                maxWidth='max-w-lg'
                                aspectRatio='aspect-square'
                            />
                            <ContentParagraph>
                                অনেকটা আপনার পুরোনো ল্যাপটপ ফেলে দিয়ে একটা বিশাল
                                কনফিগারেশনের দানব পিসি কিনে আনার মতো। শুরুতে এটা
                                বেশ কার্যকর মনে হয় এবং ১০০০-৫০০০ ইউজার পর্যন্ত
                                হয়তো ভালোই সার্ভিস দেয়। কিন্তু এই দানব
                                পিসিটারওতো একটা সীমা আছে, তাইনা?
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CUSTOM,
                    component: <VerticalScalingDiagram />,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <ContentParagraph>
                                চলুন Vertical Scaling এর সুবিধা এবং অসুবিধাগুলো
                                জেনে নেওয়া যাক:
                            </ContentParagraph>

                            <ConceptHeading color='emerald'>
                                সুবিধাসমূহ
                            </ConceptHeading>
                            <ContentList>
                                <ListItem icon='✓' iconColor='text-emerald-700 dark:text-emerald-400'>
                                    সেটআপ করা খুব সহজ। বাজার থেকে RAM কিনে এনে
                                    লাগিয়ে দিলেই হলো।
                                </ListItem>
                                <ListItem icon='✓' iconColor='text-emerald-700 dark:text-emerald-400'>
                                    মেইনটেইন করা সহজ কারণ আপনার সার্ভার একটাই।
                                </ListItem>
                                <ListItem icon='✓' iconColor='text-emerald-700 dark:text-emerald-400'>
                                    অ্যাপের কোডে বড় কোনো পরিবর্তন ছাড়াই
                                    হার্ডওয়্যার আপগ্রেড করে পারফরম্যান্স বাড়ানো
                                    যায়।
                                </ListItem>
                            </ContentList>

                            <ConceptHeading color='primary'>
                                অসুবিধাসমূহ
                            </ConceptHeading>
                            <ContentList>
                                <ListItem icon='✕' iconColor='text-red-700 dark:text-red-400'>
                                    <strong>হার্ডওয়্যার লিমিট:</strong> একটা
                                    কম্পিউটারের ক্ষমতা অসীম নয়। মাদারবোর্ডের
                                    একটা শেষ সীমানা আছে।
                                </ListItem>
                                <ListItem icon='✕' iconColor='text-red-700 dark:text-red-400'>
                                    <strong>অতিরিক্ত খরচ:</strong> হাই-এন্ড
                                    হার্ডওয়্যারের দাম জ্যামিতিক হারে
                                    (Exponentially) বাড়ে।
                                </ListItem>
                                <ListItem icon='✕' iconColor='text-red-700 dark:text-red-400'>
                                    <strong>Single Point of Failure:</strong> ওই
                                    একটা সার্ভার নষ্ট হলে পুরো অ্যাপ বন্ধ হয়ে
                                    যাবে।
                                </ListItem>
                            </ContentList>
                        </>
                    ),
                },
            ],
        },
        {
            id: 'horizontal',
            subHeader: { index: '003', title: 'Horizontal Scaling' },
            title: (
                <SectionTitle>Horizontal Scaling (Scaling Out)</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                আপনি যখন আপনার ল্যাপটপটিকে ফেলে একটা বিশাল
                                কম্পিটার কিনে আনলেন তখন শুরুতে তা কয়েক হাজার
                                ইউজার পর্যন্ত ভালোই সার্ভিস দিচ্ছিল, কিন্তু যখন
                                ইউজার সংখ্যা আরো বাড়তে শুরু করলো তখন কিন্তু
                                আপনার বিশাল কম্পিটারও ইউজারের চাপে হাঁপিয়ে ওঠে,
                                তখন আপনি বুঝতে পারবেন যে হার্ডওয়্যার আপগ্রেড করে
                                আপনি আর এই সমস্যার সমাধান করতে পারবেন না,কেননা
                                আপনি যতই আপগ্রেড করেন না কেন সেটাও একটা সময় আর
                                ইউজারের চাপ সামলাতে পারবেনা। কারণ তারও তো একটা
                                সীমা আছে। তাই এই সমস্যার সমাধান করতে হলে আপনাকে{' '}
                                <strong>স্ট্র্যাটেজিতে</strong> পরিবর্তন আনতে
                                হবে।
                            </ContentParagraph>
                            <ContentParagraph>
                                তখন আপনি যেটা করতে পারেন আপনার ওই বিশাল
                                কম্পিউটারটাকে বার বার আপগ্রেড না করে, আপনি ছোট
                                ছোট কিছু সাধারণ কম্পিউটার কিনে পাশাপাশি বসিয়ে
                                দিতে পারেন। এবং অ্যাপের লোড সবার মধ্যে ভাগ করে
                                দিতে পারেন। এইযে লোডকে একটা কপিঊটারে না রেখে
                                অনেকগুলো কম্পিউটারে (সার্ভারে) ভাগ করে দেওয়ার
                                প্রক্রিয়াটাকেই{' '}
                                <strong>Horizontal Scaling</strong> বা{' '}
                                <strong>Scaling Out</strong> বলা হয়।
                            </ContentParagraph>
                            <ContentImage
                                src='/topics/scalability/horizontail_vs_vertical.png'
                                alt='Server cluster illustration'
                                caption='ভারটিকাল স্কেলিং: একটি শক্তিশালী কম্পিউটারে লোড হ্যান্ডলিং, হরাইজন্টাল স্কেলিং: অনেকগুলো সার্ভার মিলে কাজ করছে'
                            />
                            <ContentParagraph>
                                একটা কম্পিউটারের ক্ষমতা না বাড়িয়ে, পাশাপাশি নতুন
                                আরও কয়েকটা সাধারণ কম্পিউটার (সার্ভার) বসিয়ে
                                দেওয়া এবং কাজের লোড সবার মধ্যে ভাগ করে দেওয়াকে
                                বলা হয় <strong>Horizontal Scaling</strong> বা{' '}
                                <strong>Scaling Out</strong>।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.CUSTOM,
                    component: <HorizontalScalingDiagram />,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <ContentParagraph>
                                চলুন Horizontal Scaling এর সুবিধা এবং
                                অসুবিধাগুলো জেনে নেওয়া যাক:
                            </ContentParagraph>

                            <ConceptHeading color='emerald'>
                                সুবিধাসমূহ
                            </ConceptHeading>
                            <ContentList>
                                <ListItem icon='✓' iconColor='text-emerald-700 dark:text-emerald-400'>
                                    <strong>আনলিমিটেড পাওয়ার:</strong>{' '}
                                    তাত্ত্বিকভাবে আপনি যত খুশি সার্ভার যোগ করতে
                                    পারবেন।
                                </ListItem>
                                <ListItem icon='✓' iconColor='text-emerald-700 dark:text-emerald-400'>
                                    <strong>Fault Tolerance:</strong> একটা
                                    সার্ভার নষ্ট হলেও বাকিগুলো ব্যাকআপ দেয়,
                                    ইউজার টেরও পাবে না।
                                </ListItem>
                                <ListItem icon='✓' iconColor='text-emerald-700 dark:text-emerald-400'>
                                    <strong>সহজ আপগ্রেড:</strong> লাইভ সিস্টেমেই
                                    নতুন সার্ভার যুক্ত করা যায়।
                                </ListItem>
                            </ContentList>

                            <ConceptHeading color='primary'>
                                অসুবিধাসমূহ
                            </ConceptHeading>
                            <ContentList>
                                <ListItem icon='✕' iconColor='text-red-700 dark:text-red-400'>
                                    <strong>আর্কিটেকচারাল জটিলতা:</strong>{' '}
                                    সিস্টেম মেইনটেইন করা এবং ট্রাফিককে বিভিন্ন
                                    সার্ভারে ভাগ করা কঠিন।
                                </ListItem>
                                <ListItem icon='✕' iconColor='text-red-700 dark:text-red-400'>
                                    <strong>ডিস্ট্রিবিউটেড ডাটাবেজ:</strong>{' '}
                                    অনেকগুলো সার্ভারের মধ্যে ডেটা সিঙ্ক করা বেশ
                                    জটিল।
                                </ListItem>
                            </ContentList>
                            <ContentParagraph>
                                সুধু তাই না <strong>Horizontal Scaling</strong>{' '}
                                করতে হলে আপনাকে load balancer, Stateless
                                architecture, database replication, data
                                partitioning, caching ইত্যাদি বিষয়গুলো সম্পর্কেও
                                জানতে হবে। নাহলে আপনি বুজতে পারবেন না যে ট্রাফিক
                                কিভাবে মাল্টিপল সার্ভারে ভাগ করবেন, এবং ডাটা
                                কিভাবে মাল্টিপল সার্ভারে সিঙ্ক করবেন।
                            </ContentParagraph>
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'Key Insight',
                    content: (
                        <>
                            Google, Facebook বা Netflix-এর মতো জায়ান্টরা এভাবেই
                            কাজ করে। তাদের লক্ষ লক্ষ ছোট ছোট সার্ভার মিলে একটা
                            বিশাল সুপার সিস্টেম হিসেবে কাজ করে।
                        </>
                    ),
                },
            ],
        },
        {
            id: 'stateless',
            subHeader: { index: '004', title: 'Architecture' },
            title: (
                <span className='font-heading'>
                    Stateless Architecture — কেন এটি জরুরি?
                </span>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                হরাইজন্টাল স্কেলিং-এ একটা বড় প্রশ্ন হলো—{' '}
                                <span className='italic'>
                                    &quot;১০টা কম্পিউটার থাকলে ইউজারের রিকোয়েস্ট
                                    কোন কম্পিউটারের কাছে যাবে?&quot;
                                </span>{' '}
                                এবং সব কম্পিউটার কি একই ডেটা জানবে?
                            </ContentParagraph>
                            <ContentParagraph>
                                এর সমাধান হলো আপনার সার্ভারকে{' '}
                                <strong>Stateless</strong> বানানো। অর্থাৎ,
                                সার্ভার তার নিজের মেমরিতে কোনো সেশন ডেটা রাখবে
                                না। ফলে যেকোনো সার্ভার যেকোনো রিকোয়েস্ট
                                হ্যান্ডেল করতে পারবে।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['বিষয়', 'Stateless ✅', 'Stateful ❌'],
                    rows: [
                        [
                            'Session data',
                            'Redis/DB তে রাখুন',
                            'Server memory তে রাখুন',
                        ],
                        [
                            'Scale করা যায়?',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-tight'>
                                সহজেই যায়
                            </span>,
                            <span className='text-red-700 dark:text-red-400 uppercase tracking-tight'>
                                কঠিন, সেশন সিঙ্ক লাগে
                            </span>,
                        ],
                        [
                            'Server crash হলে?',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-tight'>
                                অন্য সার্ভার সামলায়
                            </span>,
                            <span className='text-red-700 dark:text-red-400 uppercase tracking-tight'>
                                ইউজার সেশন হারিয়ে যায়
                            </span>,
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'stateless-auth.js',
                    code: `// ❌ STATEFUL — এটা স্কেলিং-এ সমস্যা করে
const sessions = {}; // মেমরিতে ডেটা রাখা মানেই ওই সার্ভারের ওপর নির্ভরশীলতা

app.post('/login', (req, res) => {
  sessions[userId] = { loggedIn: true };
  // ইউজার পরের রিকোয়েস্ট অন্য সার্ভারে পাঠালে সেশন খুঁজে পাবে না!
});

// ✅ STATELESS — এটি স্কেলেবল সিস্টেমের জন্য আদর্শ
const redis = require('redis');

app.post('/login', async (req, res) => {
  // ডেটা সেন্ট্রাল ডেটাবেজ বা Redis-এ রাখুন
  await redis.set(\`session:\${userId}\`, JSON.stringify(sessionData));
});`,
                },
            ],
        },
        {
            id: 'patterns',
            subHeader: { index: '005', title: 'Comparison' },
            title: (
                <span className='font-heading'>
                    Vertical vs Horizontal — সম্পূর্ণ তুলনা
                </span>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['বিষয়', 'Vertical Scaling', 'Horizontal Scaling'],
                    rows: [
                        ['সংজ্ঞা', 'একটা মেশিন বড় করুন', 'বেশি মেশিন যোগ করুন'],
                        [
                            'Cost',
                            <span className='text-red-700 dark:text-red-400'>
                                জ্যামিতিক হারে বাড়ে
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                সরল রেখায় বাড়ে
                            </span>,
                        ],
                        [
                            'Limit',
                            <span className='text-red-700 dark:text-red-400'>
                                হার্ডওয়্যার লিমিট আছে
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                লিমিট নেই
                            </span>,
                        ],
                        [
                            'Downtime',
                            <span className='text-red-700 dark:text-red-400'>
                                আপগ্রেড করতে ডাউনটাইম লাগে
                            </span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                লাইভ সিস্টেমেই বাড়ানো যায়
                            </span>,
                        ],
                        [
                            'Fault Tolerance',
                            <span className='text-red-700 dark:text-red-400'>নেই</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                চমৎকার
                            </span>,
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: 'ইন্ডাস্ট্রি টিপস',
                    content: (
                        <>
                            সাধারণত শুরুতে Vertical Scaling দিয়ে কাজ চালানো হয়
                            কারণ এটি সহজ। কিন্তু যখন ইউজার সংখ্যা বাড়ে বা
                            হাই-অ্যাভেইলেবিলিটি দরকার হয়, তখন Horizontal Scaling
                            ছাড়া গতি নেই।
                        </>
                    ),
                },
            ],
        },
        {
            id: 'practical-node-lab',
            subHeader: { index: '006', title: 'Hands-on Lab' },
            title: (
                <SectionTitle>
                    Node.js Multi-Server + Load Balancer Setup
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            থিয়োরি তো জানলাম, এবার চলুন একটি কাস্টম Node.js Load Balancer
                            এবং একাধিক সার্ভার সেটআপ করে দেখি। নিচে ধাপে ধাপে
                            কোড দেওয়া হলো:
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.CUSTOM,
                    component: (
                        <CollapsibleCodeExample
                            title='Practical Implementation Guide'
                            subtitle='Node.js Multi-Server & Load Balancing'
                            examples={[
                                {
                                    filename: 'server.js',
                                    language: 'javascript',
                                    description:
                                        'এটি একটি সাধারণ Node.js সার্ভার যা তার নিজস্ব ID এবং Port রিটার্ন করে।',
                                    code: `const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const SERVER_ID = process.env.SERVER_ID || 'S1';

app.get('/', (req, res) => {
  res.json({
    message: \`Hello from \${SERVER_ID}\`,
    pid: process.pid,
    port: PORT
  });
});

app.listen(PORT, () => {
  console.log(\`[\${SERVER_ID}] Running on port \${PORT}\`);
});`,
                                },
                                {
                                    filename: 'start-all.js',
                                    language: 'javascript',
                                    description:
                                        'এখন এই একটা Node.js Application ব্যবহার করে একসাথে ৩টি সার্ভার আলাদা আলাদা পোর্টে (৩০০১, ৩০০২, ৩০০৩) রান করি',
                                    code: `const { spawn } = require('child_process');

const servers = [
  { id: 'S1', port: 3001 },
  { id: 'S2', port: 3002 },
  { id: 'S3', port: 3003 },
];

servers.forEach(({ id, port }) => {
  const proc = spawn('node', ['server.js'], {
    env: { ...process.env, PORT: port, SERVER_ID: id },
    stdio: 'inherit'
  });

  proc.on('exit', (code) => {
    console.log(\`\${id} exited with code \${code}\`);
  });
});`,
                                },
                                {
                                    filename: 'load-balancer.js',
                                    language: 'javascript',
                                    description:
                                        'Round-robin অ্যালগরিদম ব্যবহার করে একটি কাস্টম Load Balancer বানাই। এটি ৮০৮০ পোর্টে চলবে।',
                                    code: `const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const servers = [
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
];

let currentIndex = 0;

function getNextServer() {
  const server = servers[currentIndex];
  currentIndex = (currentIndex + 1) % servers.length;
  return server;
}

app.use('/', (req, res, next) => {
  const target = getNextServer();
  console.log(\`→ Routing to: \${target}\`);

  createProxyMiddleware({ target, changeOrigin: true })(req, res, next);
});

app.listen(8080, () => {
  console.log('Load Balancer running on port 8080');
});`,
                                },
                                {
                                    filename: 'cluster.js',
                                    language: 'javascript',
                                    description:
                                        'Node.js-এর built-in cluster মডিউল ব্যবহার করে এক পোর্টে মাল্টিপল কোর ব্যবহার করা দেখি চলুন ।',
                                    code: `const cluster = require('cluster');
const os = require('os');
const express = require('express');

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(\`Primary PID: \${process.pid}, forking \${numCPUs} workers...\`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(\`Worker \${worker.process.pid} died → Restarting...\`);
    cluster.fork();
  });

} else {
  const app = express();
  app.get('/', (req, res) => {
    res.json({ worker: process.pid });
  });
  app.listen(3000);
}`,
                                },
                                {
                                    filename: 'Terminal Test',
                                    language: 'bash',
                                    description:
                                        'সার্ভারগুলো রান করার পর যেভাবে টেস্ট করবেন।',
                                    code: `# Terminal 1: সার্ভারগুলো চালু করুন
node start-all.js

# Terminal 2: Load balancer চালু করুন
node load-balancer.js

# Terminal 3: বারবার রিকোয়েস্ট পাঠিয়ে চেক করুন
curl http://localhost:8080`,
                                },
                                {
                                    filename: 'smart-load-balancer.js',
                                    language: 'javascript',
                                    description:
                                        'আগের সেটআপে একটা সার্ভার ডাউন হলে Load Balancer ভুল করে সেখানে ট্র্যাফিক পাঠাচ্ছিলো। এটি সলভ করার জন্য চলুন একটি Health Check মেকানিজম যোগ করা যাক।',
                                    code: `const servers = [
  { url: 'http://localhost:3001', alive: true },
  { url: 'http://localhost:3002', alive: true },
  { url: 'http://localhost:3003', alive: true },
];

let currentIndex = 0;

setInterval(async () => {
  for (const server of servers) {
    try {
      await fetch(server.url + '/health');
      server.alive = true;
    } catch {
      server.alive = false;
      console.log(\`❌ \${server.url} is DOWN\`);
    }
  }
}, 5000);

function getNextServer() {
  const alive = servers.filter(s => s.alive);
  if (!alive.length) throw new Error('All servers down!');
  return alive[currentIndex % alive.length].url;
}`,
                                },
                            ]}
                        />
                    ),
                },
            ],
        },
    ],
    summary: {
        headers: ['Concept', 'এক লাইনে'],
        rows: [
            [
                <span className='font-bold text-primary'>Scalability</span>,
                'বাড়তি লোড হ্যান্ডেল করার ক্ষমতা',
            ],
            [
                <span className='font-bold text-primary'>
                    Vertical Scaling
                </span>,
                'সার্ভারের হার্ডওয়্যার আপগ্রেড করা (Scaling Up)',
            ],
            [
                <span className='font-bold text-primary'>
                    Horizontal Scaling
                </span>,
                'একাধিক সার্ভার যুক্ত করা (Scaling Out)',
            ],
            [
                <span className='font-bold text-primary'>Stateless</span>,
                'সার্ভার মেমরিতে কোনো স্টেট রাখবে না',
            ],
            [
                <span className='font-bold text-primary'>Load Balancer</span>,
                'ট্রাফিক সব সার্ভারে ভাগ করে দেয়',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'একটি ই-কমার্স অ্যাপের ডাটাবেস সার্ভার স্লো হয়ে গেছে। দ্রুত পারফরম্যান্স বাড়ানোর জন্য আপনি কোনটি সাজেস্ট করবেন?',
                options: [
                    {
                        key: 'A',
                        text: 'আরও ৫টা ওয়েব সার্ভার যোগ করা',
                        isCorrect: false,
                        explanation: 'এতে ডাটাবেসের ওপর লোড আরও বাড়বে।',
                    },
                    {
                        key: 'B',
                        text: 'ডাটাবেস সার্ভারে র‍্যাম ও সিপিইউ বাড়ানো (Vertical Scaling)',
                        isCorrect: true,
                        explanation:
                            'ডাটাবেসের জন্য ভার্টিক্যাল স্কেলিং দ্রুততম সমাধান।',
                    },
                    {
                        key: 'C',
                        text: 'পুরো কোড নতুন করে লেখা',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 2,
                text: 'Horizontal Scaling এর সবচেয়ে বড় সুবিধা কী?',
                options: [
                    {
                        key: 'A',
                        text: 'সেটআপ করা সহজ',
                        isCorrect: false,
                    },
                    {
                        key: 'B',
                        text: 'ফল্ট টলারেন্স বা উচ্চ নিশ্চয়তা',
                        isCorrect: true,
                        explanation: 'একটি সার্ভার ডাউন হলেও সিস্টেম সচল থাকে।',
                    },
                    {
                        key: 'C',
                        text: 'খরচ জ্যামিতিক হারে বাড়ে',
                        isCorrect: false,
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'Scaling Strategy Planning',
        time: '২ ঘণ্টা',
        difficulty: 'Beginner Friendly',
        tasks: [
            <span key='1'>
                <strong>Scenario Analysis:</strong> একটি লাইভ স্পোর্টস অ্যাপের
                জন্য কোন ধরনের স্কেলিং উপযুক্ত এবং কেন? ৪-৫ লাইনে ব্যাখ্যা করুন।
            </span>,
            <span key='2'>
                <strong>Diagram:</strong> ৩টি ওয়েব সার্ভার এবং ১টি লোড
                ব্যালেন্সারের একটি সিম্পল কানেকশন ডায়াগ্রাম আঁকুন।
            </span>,
        ],
        deliverables: [
            <span key='1'>বিশ্লেষণমূলক লিখিত উত্তর</span>,
            <span key='2'>আর্কিটেকচার ডায়াগ্রাম</span>,
        ],
    },
    practicalLab: {
        title: 'Node.js Multi-Server & Load Balancer',
        subtitle: 'Practical Implementation of Horizontal Scaling',
        steps: [
            {
                title: 'Project Structure',
                description: 'server.js, start-all.js, এবং load-balancer.js ফাইলগুলো তৈরি করুন।',
            },
            {
                title: 'Server Setup',
                description:
                    'একাধিক পোর্টে সার্ভার রান করে চেক করুন রিকোয়েস্ট ভাগ হচ্ছে কিনা।',
            },
            {
                title: 'Health Check',
                description:
                    'স্মার্ট লোড ব্যালেন্সার ব্যবহার করে সার্ভার ডাউন হলে তা হ্যান্ডেল করুন।',
            },
        ],
        tip: 'বাস্তবে কোড লিখে রান করার মাধ্যমে আপনি ডিস্ট্রিবিউটেড সিস্টেমের আসল চ্যালেঞ্জগুলো বুঝতে পারবেন।',
    },
};





