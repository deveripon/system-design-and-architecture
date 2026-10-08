/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import { PropagationClocksLab } from "../../../components/course/topics/dns/propagation-animations";
import {
  CheckOrderDiagram,
  PropagationMythSplit,
  WaitTableDiagram,
} from "../../../components/course/topics/dns/propagation-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const dnsPropagationContent: TopicData = {
  id: "dns-propagation",
  introduction: {
    badge: "MODULE 04 · LESSON 08",
    title: <SectionTitle>বদলালাম, তবু সবাই দেখছে না কেন</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আপনি DNS এ একটা Record বদলালেন। নিজের ফোনে সাইট নতুন জায়গা থেকে খুলছে,
          কিন্তু ল্যাপটপে এখনো পুরনোটা। বন্ধুকে জিজ্ঞেস করলেন, তাঁর কাছেও পুরনোটা।
          Hosting এর সহায়তায় লিখলেন, উত্তর এলো, DNS Propagation এ ২৪ থেকে ৪৮ ঘণ্টা
          লাগতে পারে, অপেক্ষা করুন।
        </ContentParagraph>
        <ContentParagraph>
          এই বাক্যটা DNS নিয়ে সবচেয়ে বেশি বলা কথা, আর সবচেয়ে কম বোঝা কথাও। কী
          ছড়ায়? কোথায় ছড়ায়? ৪৮ ঘণ্টাই কেন? আর সত্যিই কি বসে থাকা ছাড়া কিছু করার
          নেই? ভালো খবর হলো, এই প্রশ্নগুলোর উত্তর আপনি আগের চার লেসনে ইতিমধ্যে
          শিখে ফেলেছেন, শুধু জোড়া লাগানো বাকি।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন Propagation আসলে কী, কোন বদলে কতক্ষণ লাগে আর
          কেন, বদলটা ঠিক হয়েছে কি না কীভাবে নিশ্চিত হবেন, অপেক্ষার সময় কী কী করা
          যায়, আর কোনটা সত্যিই অপেক্ষার ব্যাপার আর কোনটা আসলে একটা ভুল যা অপেক্ষা
          করলে কখনো ঠিক হবে না।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আপনি দোকানের সাইনবোর্ডে নতুন ফোন নম্বর লিখলেন। কিন্তু যাদের ফোনে পুরনো নম্বরটা সেভ করা, তারা সাইনবোর্ড আবার না দেখা পর্যন্ত পুরনো নম্বরেই ফোন করবে। সাইনবোর্ড কাউকে খবর দেয় না।",
      author: "DNS",
      role: "Lesson 08",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "myth",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Propagation নামটাই একটু ভুল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Propagation শব্দের মানে ছড়িয়ে পড়া। শুনে মনে হয়, আপনি Save চাপলে
                নতুন Record টা একটা ঢেউয়ের মতো পৃথিবীর এক প্রান্ত থেকে আরেক
                প্রান্তে ছড়াতে থাকে, আর সেই ঢেউ সব জায়গায় পৌঁছাতে দুই দিন লাগে।
                ছবিটা সুন্দর, কিন্তু ভুল।
              </ContentParagraph>
              <ContentParagraph>
                DNS এ কেউ কাউকে কিছু ঠেলে পাঠায় না। আপনার Authoritative server
                শুধু বসে থাকে, আর কেউ জিজ্ঞেস করলে উত্তর দেয়। আপনি Save চাপার
                কয়েক সেকেন্ডের মধ্যে সে নতুন উত্তরটা দিতে শুরু করে। তাহলে দেরিটা
                কোথায়? দেরিটা হলো, কেউ তাকে জিজ্ঞেসই করছে না, কারণ সবার কাছে
                পুরনো উত্তরটা এখনো Cache এ আছে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PropagationMythSplit /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Propagation মানে আসলে পুরনো Cache মরার অপেক্ষা",
          content: (
            <p>
              পুরো লেসনটা এই এক লাইনে। নতুন তথ্য ছড়ানোর জন্য আপনি অপেক্ষা করছেন
              না, আপনি অপেক্ষা করছেন পুরনো তথ্যের মেয়াদ ফুরানোর জন্য। এই দুইটা
              শুনতে একই মনে হলেও তফাতটা বিশাল। প্রথমটা হলে আপনার কিছুই করার থাকত
              না। দ্বিতীয়টা সত্যি বলেই আপনি আগে থেকে মেয়াদ ছোট করে রাখতে পারেন,
              হিসাব করে বলতে পারেন ঠিক কতক্ষণ লাগবে, আর বুঝতে পারেন কখন অপেক্ষা
              করে লাভ নেই।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "clocks",
      subHeader: { index: "002", title: "Many Clocks" },
      title: <SectionTitle>সবার ঘড়ি আলাদা, তাই সবাই আলাদা সময়ে পায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Resolver এর লেসনে দেখেছিলেন, আপনার পর্যটকরা হাজারটা আলাদা Resolver
                দিয়ে আসেন, আর প্রত্যেকের খাতা আলাদা। এবার তার সাথে TTL এর লেসন
                জুড়ুন। প্রতিটা Resolver আপনার নামটা শিখেছিল আলাদা মুহূর্তে, তাই
                প্রত্যেকের মেয়াদের ঘড়ি চালু হয়েছিল আলাদা সময়ে।
              </ContentParagraph>
              <ContentParagraph>
                ধরুন TTL এক ঘণ্টা। একটা Resolver নামটা শিখেছিল ৫৮ মিনিট আগে, তার
                মেয়াদ আর ২ মিনিট বাকি। আরেকটা শিখেছিল ৫ মিনিট আগে, তার বাকি ৫৫
                মিনিট। আপনি এখন IP বদলালে প্রথমজন ২ মিনিট পরেই নতুনটা পাবে,
                দ্বিতীয়জন ৫৫ মিনিট পরে। এই কারণেই একজনের কাছে খোলে আর আরেকজনের
                কাছে খোলে না। নিচে ছয়টা Resolver নিয়ে নিজে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PropagationClocksLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "বদলের ঠিক আগে নিজে দেখে নেওয়াটাই আপনাকে শেষে ফেলে",
          content: (
            <p>
              Lab এ খেয়াল করেছেন, সবার শেষে নতুন উত্তর পায় আপনার নিজের Resolver।
              এটা কাকতালীয় নয়, এটা প্রায় সবার সাথেই ঘটে। বদলের আগে মানুষ স্বাভাবিকভাবে
              একবার সাইটটা খুলে দেখে নেয় সব ঠিক আছে কি না। ঠিক সেই মুহূর্তে তার
              Resolver পুরনো উত্তরটা নতুন করে পুরো মেয়াদ নিয়ে খাতায় তুলে রাখে।
              ফলে পৃথিবীর বাকি সবাই নতুন সাইট দেখছে, আর আপনি একা পুরনোটা দেখে
              ভাবছেন কিছুই কাজ করেনি। তাই নিজের Browser কখনো প্রমাণ নয়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "how-long",
      subHeader: { index: "003", title: "How Long" },
      title: <SectionTitle>কোন বদলে কতক্ষণ, আর ৪৮ ঘণ্টা এলো কোথা থেকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এখন যেহেতু জানেন অপেক্ষাটা আসলে Cache এর মেয়াদ, কতক্ষণ লাগবে সেটা
              আর আন্দাজের ব্যাপার নয়, হিসাবের ব্যাপার। প্রশ্ন একটাই, আপনি যা
              বদলালেন তার পুরনো রূপটা মানুষের Cache এ কত মেয়াদ নিয়ে বসে আছে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WaitTableDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>চালু Record বদল:</strong> সর্বোচ্চ অপেক্ষা সেই Record
                  এর <em>আগের</em> TTL। নতুন TTL নয়, আগেরটা, কারণ মানুষের Cache এ
                  যে নকলটা আছে সেটা আগের মেয়াদ নিয়ে বসে আছে। TTL ৩০০ হলে পাঁচ
                  মিনিট, ৮৬৪০০ হলে পুরো এক দিন।
                </ListItem>
                <ListItem>
                  <strong>নতুন নাম যোগ:</strong> যে নাম আগে ছিলই না, তার কোনো
                  পুরনো নকল কারো কাছে নেই। তাই প্রথম যে জিজ্ঞেস করবে সে সোজা
                  নতুন উত্তর পাবে। অপেক্ষা প্রায় শূন্য।
                </ListItem>
                <ListItem>
                  <strong>নতুন নাম, কিন্তু আগে কেউ দেখে ফেলেছিল:</strong> এটা সেই
                  Negative Cache এর ফাঁদ। Record বসানোর আগেই নামটা খুললে Resolver
                  নেই উত্তরটা মনে রাখে। তখন অপেক্ষা SOA তে লেখা Negative TTL
                  পর্যন্ত, যা সাধারণত কয়েক মিনিট থেকে এক ঘণ্টা।
                </ListItem>
                <ListItem>
                  <strong>Record মোছা:</strong> মুছে ফেললেও যাদের Cache এ আছে তারা
                  TTL শেষ না হওয়া পর্যন্ত পুরনো উত্তর পেতেই থাকে।
                </ListItem>
                <ListItem>
                  <strong>Name Server বদল:</strong> এটাই সেই বিখ্যাত ৪৮ ঘণ্টা।
                  কোন Name Server আপনার Domain এর দায়িত্বে, এই তথ্যটা থাকে TLD
                  server এ, আর তার TTL ঠিক করে TLD, আপনি নন। .com এর জন্য এটা
                  ১৭২৮০০ সেকেন্ড, মানে ঠিক দুই দিন। তার উপর Registrar নিজে বদলটা
                  TLD তে পৌঁছাতে কয়েক মিনিট থেকে কয়েক ঘণ্টা নেয়।
                </ListItem>
                <ListItem>
                  <strong>Proxied Record এর পেছনের সার্ভার বদল:</strong> আগের
                  লেসনে দেখেছেন, বাইরের দুনিয়া দেখে Cloudflare এর IP, যা বদলায়ই
                  না। তাই এখানে DNS এর কোনো অপেক্ষা নেই।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তাহলে সবাই সব কিছুতে ২৪ থেকে ৪৮ ঘণ্টা বলে কেন? কারণ এটা সবচেয়ে
                খারাপ ক্ষেত্রের সংখ্যা, আর সহায়তা কর্মীরা নিরাপদ থাকতে সবচেয়ে
                বড় সংখ্যাটাই বলে দেন। একটা সাধারণ A Record বদলে, যার TTL পাঁচ
                মিনিট, দুই দিন অপেক্ষা করার কোনো কারণ নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "হিসাবের বাইরে যে তিনটা জিনিস একটু বাড়তি দেরি করায়",
          content: (
            <p>
              হিসাব বলে TTL শেষ হলেই সবাই নতুন উত্তর পাবে। বাস্তবে তিনটা জিনিস
              একটু বাড়তি সময় নিতে পারে। এক, কিছু Resolver খুব ছোট TTL মানে না,
              নিজে একটা ন্যূনতম সময় ধরে রাখে। দুই, Browser আর Operating System
              এর নিজের Cache, যা আগের লেসনের চার স্তরের উপরের দুইটা। তিন, Browser
              পুরনো সার্ভারের সাথে একটা সংযোগ খোলা রেখে দেয়, আর DNS বদলালেও সেই
              খোলা সংযোগ দিয়েই কথা বলতে থাকে, যতক্ষণ না Tab বন্ধ করা হয়। তাই
              হিসাবের সময়ের সাথে কয়েক মিনিট হাতে রাখুন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "check",
      subHeader: { index: "004", title: "Checking" },
      title: <SectionTitle>হাতে কলমে, বদলটা ঠিক হয়েছে তো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              বদলের পর সবচেয়ে জরুরি প্রশ্ন একটাই, এটা কি অপেক্ষার ব্যাপার, নাকি
              আমি ভুল করেছি? উত্তর বের করার একটা নির্দিষ্ট ক্রম আছে, আর ক্রমটাই
              আসল। সবসময় উৎস থেকে শুরু করুন, নিজের Browser থেকে নয়।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CheckOrderDiagram /> },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "check-propagation.sh",
          code: `D=islandtours.example

# ধাপ ১: উৎসকে সরাসরি জিজ্ঞেস। আগে Name Server এর নাম বের করুন
dig +short NS $D
dig +short A $D @ns1.dnshost.example        # উপরের একটা নাম বসান
#   নতুন IP এলে আপনার কাজ নিখুঁত, এরপর শুধু অপেক্ষা।
#   পুরনো IP এলে অপেক্ষা করে লাভ নেই, Record টাই বদলায়নি বা ভুল জায়গায় বদলেছেন।

# সব Name Server একই উত্তর দিচ্ছে তো?
for NS in $(dig +short NS $D); do
  echo "$NS -> $(dig +short A $D @$NS)"
done

# ধাপ ২: বড় Public Resolver রা কী জানে
for R in 1.1.1.1 8.8.8.8 9.9.9.9; do
  echo "$R -> $(dig +short A $D @$R)"
done

# ধাপ ৩: নিজের Resolver
dig +short A $D

# কোনো Resolver এ পুরনো উত্তর থাকলে, তার মেয়াদ আর কত বাকি
dig +noall +answer A $D @8.8.8.8
#   islandtours.example.   1840   IN   A   103.94.135.2
#                          ^^^^ আর ১৮৪০ সেকেন্ড, মানে প্রায় ৩১ মিনিট পর সে নতুনটা নেবে`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষ কমান্ডটা এই লেসনের সবচেয়ে কাজের কৌশল। Resolver যখন Cache থেকে
                উত্তর দেয়, TTL এর জায়গায় সে পুরো মেয়াদ দেখায় না, দেখায় আর কত
                সেকেন্ড বাকি। মানে আপনি আর আন্দাজ করছেন না, ঘড়িটা নিজের চোখে
                দেখছেন। কাউকে বলতে পারেন, আর ৩১ মিনিট, ৪৮ ঘণ্টা নয়।
              </ContentParagraph>
              <ContentParagraph>
                পৃথিবীর নানা দেশ থেকে একসাথে দেখতে চাইলে কিছু Website আছে, যারা
                বিভিন্ন শহরের Resolver কে একই প্রশ্ন করে ফলটা একটা মানচিত্রে
                দেখায়। সবচেয়ে চেনা দুইটা whatsmydns.net আর dnschecker.org।
                Domain লিখে Record এর ধরন বেছে Search চাপুন। সবুজ টিক মানে সেই
                শহরের Resolver উত্তর পেয়েছে, পাশে লেখা IP টা দেখে বুঝবেন সেটা
                নতুন না পুরনো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "মানচিত্রের সব সবুজ মানেই সবাই পেয়ে গেছে, তা নয়",
          content: (
            <p>
              এই সাইটগুলো বিশ থেকে ত্রিশটা Resolver পরীক্ষা করে, অথচ পৃথিবীতে
              Resolver আছে লক্ষ লক্ষ। সব সবুজ দেখালে বোঝা যায় বদলটা ভালোভাবে
              এগোচ্ছে, কিন্তু আপনার কোনো নির্দিষ্ট পর্যটকের ISP র Resolver হয়তো
              সেই তালিকায় নেই। উল্টোটাও সত্যি, দুই একটা লাল দেখলে ঘাবড়াবেন না,
              সেই Resolver টা হয়তো শুধু একটু পরে নতুনটা নেবে। মানচিত্রটা একটা
              নমুনা, পুরো ছবি নয়। পুরো নিশ্চয়তা দেয় শুধু হিসাব, আগের TTL পার
              হয়ে গেলে সবার পাওয়ার কথা।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "wait-or-wrong",
      subHeader: { index: "005", title: "Wait or Wrong" },
      title: <SectionTitle>অপেক্ষা, নাকি ভুল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Propagation কথাটার সবচেয়ে বড় ক্ষতি হলো, এটা যেকোনো DNS ভুলের
                একটা সহজ অজুহাত হয়ে দাঁড়ায়। মানুষ একটা ভুল Record বসিয়ে দুই দিন
                বসে থাকে, ভাবে ছড়াচ্ছে। অথচ ভুল জিনিস যত দিনই অপেক্ষা করুন ঠিক
                হয় না। তাই এই দুইটাকে আলাদা করতে শেখাই আসল দক্ষতা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>এটা অপেক্ষা:</strong> Authoritative server নতুন উত্তর
                  দিচ্ছে, কিন্তু কিছু Resolver পুরনোটা দিচ্ছে, আর তাদের TTL এর
                  সংখ্যাটা কমছে। কিছু করার দরকার নেই, সময় নিজেই ঠিক করবে।
                </ListItem>
                <ListItem>
                  <strong>এটা ভুল, Record বদলায়নি:</strong> Authoritative নিজেই
                  পুরনো উত্তর দিচ্ছে। হয় Save হয়নি, নয়তো ভুল Record বদলেছেন।
                </ListItem>
                <ListItem>
                  <strong>এটা ভুল, ভুল জায়গায় বদলেছেন:</strong> আপনি যে পাতায়
                  Record বদলেছেন, Domain এর Name Server সেখানে নয়। dig +short NS
                  যা দেখায়, বদল হতে হবে সেখানেই।
                </ListItem>
                <ListItem>
                  <strong>এটা ভুল, Name Server গুলো একমত নয়:</strong> একটা Name
                  Server নতুন উত্তর দিচ্ছে, আরেকটা পুরনো। তখন ফলটা এলোমেলো হয়,
                  কখনো খোলে কখনো খোলে না, আর এটা অপেক্ষায় সারে না।
                </ListItem>
                <ListItem>
                  <strong>এটা ভুল, পুরনো Record রয়ে গেছে:</strong> নতুন A Record
                  বসিয়েছেন কিন্তু পুরনোটা মোছেননি। এখন একই নামে দুইটা IP, আর
                  অর্ধেক মানুষ চিরকাল পুরনো সার্ভারে যাবে।
                </ListItem>
                <ListItem>
                  <strong>এটা DNS ই নয়:</strong> dig সব জায়গায় নতুন IP দিচ্ছে,
                  তবু সাইট পুরনো দেখাচ্ছে। তাহলে সমস্যা Browser এর Cache, CDN এর
                  Cache, অথবা নতুন সার্ভারেই পুরনো কোড।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "এক কমান্ডে সিদ্ধান্ত",
          content: (
            <p>
              পুরো সিদ্ধান্তটা একটা পরীক্ষায় নেমে আসে, Authoritative server কে
              সরাসরি জিজ্ঞেস করা। সে নতুন উত্তর দিলে আপনি ঠিক করেছেন, এখন শুধু
              ঘড়ি দেখুন। সে পুরনো উত্তর দিলে আপনি ভুল করেছেন, অপেক্ষা থামিয়ে
              Record টা ঠিক করুন। কাউকে অপেক্ষা করতে বলার আগে এই পরীক্ষাটা না করে
              কখনো বলবেন না। দশ সেকেন্ডের এই পরীক্ষা দুই দিনের অকারণ অপেক্ষা
              বাঁচায়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "while-waiting",
      subHeader: { index: "006", title: "While Waiting" },
      title: <SectionTitle>হাতে কলমে, অপেক্ষার সময় যা যা করা যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অপেক্ষা মানে হাত গুটিয়ে বসে থাকা নয়। পৃথিবীর সব Resolver এর Cache
                আপনি মুছতে পারবেন না, কিন্তু চারটা কাজ আপনার হাতে আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>নতুন সার্ভারটা এখনই পরীক্ষা করুন, DNS এর অপেক্ষা
                  ছাড়াই:</strong> নিজের যন্ত্রকে জোর করে নতুন IP তে পাঠানো যায়,
                  পুরো DNS পাশ কাটিয়ে। এতে পর্যটকরা পৌঁছানোর আগেই আপনি জেনে যান
                  নতুন সার্ভার ঠিকঠাক চলছে কি না।
                </ListItem>
                <ListItem>
                  <strong>নিজের Cache মুছুন:</strong> নিজের Browser আর Operating
                  System এর Cache মুছলে অন্তত আপনি নিজে নতুনটা দেখতে পাবেন।
                  কমান্ডগুলো Cache এর লেসনে আছে।
                </ListItem>
                <ListItem>
                  <strong>বড় Public Resolver এর Cache মুছতে বলুন:</strong> Google
                  আর Cloudflare দুইজনেই একটা পাতা রেখেছে, যেখানে Domain এর নাম
                  দিলে তারা নিজেদের Cache থেকে সেটা মুছে দেয়। এই দুইটা Resolver
                  পৃথিবীর বিশাল সংখ্যক মানুষ ব্যবহার করে, তাই এতে সত্যিই কাজ হয়।
                </ListItem>
                <ListItem>
                  <strong>পুরনো সার্ভারটা চালু রাখুন:</strong> এটাই সবচেয়ে জরুরি।
                  যতক্ষণ কিছু মানুষ পুরনো IP তে যাচ্ছে, ততক্ষণ সেখানে একটা চালু
                  সাইট থাকা চাই।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "while-waiting.sh",
          code: `# ১. নতুন সার্ভার পরীক্ষা, DNS পাশ কাটিয়ে (শুধু এই একটা কমান্ডের জন্য)
curl -sI --resolve islandtours.example:443:45.120.8.9 https://islandtours.example
#    --resolve বলে: এই নামের জন্য DNS জিজ্ঞেস করবেন না, এই IP তে যান।
#    HTTP/2 200 এলে নতুন সার্ভার ঠিক আছে, সার্টিফিকেট সহ।

# ২. Browser এও নতুন সার্ভার দেখতে চাইলে, hosts ফাইলে এক লাইন
#    macOS, Linux:  sudo nano /etc/hosts
#    Windows:       Notepad কে Administrator হিসেবে খুলে
#                   C:\\Windows\\System32\\drivers\\etc\\hosts
45.120.8.9   islandtours.example www.islandtours.example
#    পরীক্ষা শেষে এই লাইনটা অবশ্যই মুছে ফেলুন। ভুলে রেখে দিলে
#    ছয় মাস পর সার্ভার বদলালে শুধু আপনার যন্ত্রেই সাইট খুলবে না।

# ৩. নিজের যন্ত্রের Cache মোছা
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder   # macOS
ipconfig /flushdns                                               # Windows
sudo resolvectl flush-caches                                     # Linux

# ৪. Public Resolver এর Cache মোছার পাতা (Browser এ খুলুন)
#    Google:      https://developers.google.com/speed/public-dns/cache
#    Cloudflare:  https://one.one.one.one/purge-cache/`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "অস্থির হয়ে বারবার বদলাবেন না",
          content: (
            <p>
              কাজ হচ্ছে না ভেবে মানুষ সবচেয়ে ক্ষতিকর যে কাজটা করে, তা হলো Record
              টা বারবার বদলানো, একবার এই IP, একবার ওই IP, একবার TTL কমানো, একবার
              বাড়ানো। প্রতিটা বদল পৃথিবীর কিছু Resolver এর Cache এ একটা করে
              আলাদা উত্তর রেখে যায়। ফলে এক ঘণ্টা পর কেউ পাচ্ছে প্রথম IP, কেউ
              দ্বিতীয়, কেউ তৃতীয়, আর আপনি আর বুঝতেই পারছেন না কোনটা থেকে কী
              হচ্ছে। একবার বদলান, উৎসে যাচাই করুন, তারপর হাত সরিয়ে নিন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "plan",
      subHeader: { index: "007", title: "Planning Ahead" },
      title: <SectionTitle>অপেক্ষাটাই কমিয়ে ফেলা, আগে থেকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সবচেয়ে ভালো Propagation হলো যেটা টেরই পাওয়া যায় না। সেটা সম্ভব,
              যদি বদলের আগে থেকে পরিকল্পনা করেন। Cache এর লেসনে TTL কমানোর কৌশলটা
              দেখেছেন। এখানে সেটাকে একটা পুরো তালিকায় সাজাই, যেটা যেকোনো বড় বদলের
              আগে মিলিয়ে নেবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "এখনকার TTL জানুন",
              description:
                "Authoritative server কে সরাসরি জিজ্ঞেস করে Record এর পুরো TTL দেখুন। ধরুন ৮৬৪০০, মানে এক দিন। এই সংখ্যাটাই ঠিক করে আপনাকে কত আগে থেকে প্রস্তুতি শুরু করতে হবে।",
            },
            {
              title: "বদলের অন্তত সেই পরিমাণ সময় আগে TTL কমান",
              description:
                "TTL কমিয়ে ৩০০ করুন, কিন্তু IP ছোঁবেন না। তারপর পুরনো TTL এর সমান সময়, মানে এখানে এক দিন, অপেক্ষা করুন। এই সময়ের মধ্যে সবার Cache এ পুরনো লম্বা মেয়াদের নকলটা মরে গিয়ে নতুন ছোট মেয়াদের নকল বসবে।",
            },
            {
              title: "নতুন সার্ভার আগে থেকে তৈরি আর পরীক্ষা করা রাখুন",
              description:
                "নতুন সার্ভারে সাইট বসান, সার্টিফিকেট বসান, আর curl এর --resolve দিয়ে পরীক্ষা করুন। DNS বদলের মুহূর্তে নতুন সার্ভার পুরো তৈরি থাকা চাই।",
            },
            {
              title: "কম ভিড়ের সময়ে বদলান",
              description:
                "Record এর IP বদলান এমন সময়ে যখন সাইটে সবচেয়ে কম মানুষ থাকে। TTL এখন পাঁচ মিনিট, তাই পাঁচ মিনিটের মধ্যে প্রায় সবাই নতুন সার্ভারে চলে আসবে।",
            },
            {
              title: "উৎসে যাচাই করুন, তারপর দুই সার্ভারই নজরে রাখুন",
              description:
                "Authoritative কে জিজ্ঞেস করে নিশ্চিত হোন নতুন IP দিচ্ছে। তারপর পুরনো সার্ভারের Log দেখুন। সেখানে Request আসা কমতে কমতে শূন্যের কাছে নামলে বুঝবেন সবাই সরে গেছে।",
            },
            {
              title: "পুরনো সার্ভার বন্ধ করুন, TTL আবার বাড়ান",
              description:
                "পুরনো সার্ভারে এক দুই দিন আর কোনো Request না এলে সেটা বন্ধ করুন। সব স্থির হলে TTL আবার বাড়িয়ে ৩৬০০ বা তার বেশি করুন, যাতে Resolver দের বারবার জিজ্ঞেস করতে না হয়।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ফিরে যাওয়ার পথটাও এতে খোলা থাকে",
          content: (
            <p>
              ছোট TTL এর আরেকটা বড় সুবিধা, ভুল হলে দ্রুত ফেরা যায়। নতুন সার্ভারে
              কোনো সমস্যা ধরা পড়লে Record টা আবার পুরনো IP তে ফিরিয়ে দিন, আর পাঁচ
              মিনিটে সবাই আবার পুরনো, চালু সার্ভারে। TTL এক দিন থাকলে একই ভুল
              শোধরাতে এক দিন লাগত। তাই বড় বদলের আগে TTL কমানো শুধু গতির জন্য নয়,
              এটা আপনার নিরাপত্তার জাল।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "project",
      subHeader: { index: "008", title: "Project Example" },
      title: <SectionTitle>Island Tours এর সার্ভার বদলের রাত</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours বড় হয়েছে, পুরনো সার্ভারে আর কুলাচ্ছে না। আপনি একটা
                বড় সার্ভারে সরবেন। ব্যবসার জন্য এই বদলের সময় দুইটা জিনিস কিছুতেই
                হতে দেওয়া যাবে না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>কোনো পর্যটক যেন বন্ধ সাইট না দেখেন:</strong> তাই পুরনো
                  সার্ভার চালু থাকবে যতক্ষণ একজনও সেখানে আসছেন। দুই সার্ভারেই
                  একই সাইট।
                </ListItem>
                <ListItem>
                  <strong>কোনো বুকিং যেন হারিয়ে না যায়:</strong> এটা সূক্ষ্ম
                  কিন্তু সবচেয়ে জরুরি। বদলের সময় কিছু পর্যটক পুরনো সার্ভারে বুকিং
                  করছেন, কিছু নতুনটায়। দুই সার্ভারের যদি আলাদা Database থাকে,
                  তাহলে পুরনোটায় হওয়া বুকিং নতুনটায় থাকবে না, আর একই নৌকার একই
                  আসন দুইজনের কাছে বিক্রি হতে পারে। তাই দুই সার্ভারই একই Database
                  ব্যবহার করবে। DNS বদলের পরিকল্পনা শুধু DNS এর নয়, তথ্যেরও।
                </ListItem>
                <ListItem>
                  <strong>সময়:</strong> মঙ্গলবার রাত তিনটা, যখন বুকিং সবচেয়ে কম।
                  ছুটির মৌসুমের আগের সপ্তাহে নয়।
                </ListItem>
                <ListItem>
                  <strong>পর্যটককে কী বলবেন:</strong> কেউ অভিযোগ করলে ৪৮ ঘণ্টা
                  অপেক্ষা করুন বলবেন না। উৎস যাচাই করুন, তাঁর Resolver এ বাকি
                  মেয়াদ দেখুন, আর একটা আসল সংখ্যা বলুন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "request-flow",
      subHeader: { index: "009", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা বদলের প্রথম এক ঘণ্টা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনি রাত তিনটায় A Record এর IP বদলালেন। আগের TTL পাঁচ মিনিট। এরপর
              কী কী ঘটে, সময় ধরে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "০ সেকেন্ড, আপনি Save চাপলেন",
              description:
                "DNS সেবা নতুন Record টা তার সব Authoritative server এ বসাল। কয়েক সেকেন্ডের মধ্যে প্রতিটা Name Server নতুন IP দিতে শুরু করল। আপনার কাজ এখানেই শেষ।",
            },
            {
              title: "১০ সেকেন্ড, যার Cache এ কিছু ছিল না",
              description:
                "একজন নতুন পর্যটক, যাঁর Resolver আগে কখনো নামটা খোঁজেনি, সাইট খুললেন। তাঁর Resolver সোজা Authoritative এ গিয়ে নতুন IP পেল। তিনি প্রথম মানুষ যিনি নতুন সার্ভারে এলেন।",
            },
            {
              title: "১ থেকে ৫ মিনিট, ঘড়িগুলো একে একে ফুরায়",
              description:
                "যেসব Resolver পুরনো উত্তর ধরে ছিল, তাদের মেয়াদ একটা একটা করে শেষ হচ্ছে। প্রতিটা শেষ হওয়ার পর পরের প্রশ্নেই সে নতুন IP নিচ্ছে। পুরনো সার্ভারে Request কমছে, নতুনটায় বাড়ছে।",
            },
            {
              title: "৫ মিনিট, প্রায় সবাই সরে গেছে",
              description:
                "আগের TTL পার হয়ে গেছে। নিয়ম মানা প্রতিটা Resolver এখন নতুন IP জানে। হিসাব অনুযায়ী বদল সম্পূর্ণ।",
            },
            {
              title: "৫ থেকে ৩০ মিনিট, লেজের অংশ",
              description:
                "পুরনো সার্ভারে এখনো দুই একটা Request আসছে। এরা সেই Resolver যারা ছোট TTL মানে না, আর সেই Browser যারা পুরনো সংযোগ খোলা রেখেছে। তাই পুরনো সার্ভার এখনো চালু।",
            },
            {
              title: "১ ঘণ্টা, শান্ত",
              description:
                "পুরনো সার্ভারের Log প্রায় নীরব। আপনি আরও এক দিন সেটা চালু রেখে তারপর বন্ধ করবেন, আর TTL আবার বাড়িয়ে দেবেন।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "resources",
      subHeader: { index: "010", title: "Best Resources" },
      title: <SectionTitle>আরও দেখতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>নিজে ঘড়িটা দেখুন</strong>, নিচের Lab এ একটা Resolver এর
                Cache এ মেয়াদ কমতে দেখবেন, সেকেন্ড ধরে। এটা একবার দেখলে
                Propagation আর রহস্য থাকে না।
              </ListItem>
              <ListItem>
                <strong>whatsmydns.net</strong>, পৃথিবীর নানা শহরের Resolver এ
                একটা Record এর এখনকার উত্তর, মানচিত্রে।{" "}
                <a
                  href="https://www.whatsmydns.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  whatsmydns.net
                </a>
              </ListItem>
              <ListItem>
                <strong>Google Public DNS, Flush Cache</strong>, 8.8.8.8 এর Cache
                থেকে একটা নাম মুছতে বলার পাতা।{" "}
                <a
                  href="https://developers.google.com/speed/public-dns/cache"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  developers.google.com/speed/public-dns/cache
                </a>
              </ListItem>
              <ListItem>
                <strong>Cloudflare, Purge Cache</strong>, 1.1.1.1 এর জন্য একই
                কাজ।{" "}
                <a
                  href="https://one.one.one.one/purge-cache/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  one.one.one.one/purge-cache
                </a>
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "recap",
      subHeader: { index: "011", title: "Recap" },
      title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Propagation</strong> মানে কিছু ছড়ানো নয়। DNS কাউকে কিছু
                ঠেলে পাঠায় না। এটা আসলে পুরনো Cache এর মেয়াদ ফুরানোর অপেক্ষা।
              </ListItem>
              <ListItem>
                প্রতিটা Resolver নামটা আলাদা সময়ে শিখেছে, তাই প্রত্যেকের ঘড়ি
                আলাদা। এই কারণে একজনের কাছে খোলে, আরেকজনের কাছে খোলে না।
              </ListItem>
              <ListItem>
                চালু Record বদলে সর্বোচ্চ অপেক্ষা তার <strong>আগের</strong> TTL।
                নতুন নামে প্রায় শূন্য। Name Server বদলে দুই দিন পর্যন্ত, কারণ সেই
                TTL ঠিক করে TLD।
              </ListItem>
              <ListItem>
                যাচাই করুন উৎস থেকে নিজের দিকে। আগে Authoritative, তারপর Public
                Resolver, সবশেষে Browser। নিজের Browser কখনো প্রমাণ নয়।
              </ListItem>
              <ListItem>
                Authoritative নতুন উত্তর দিলে এটা অপেক্ষা। পুরনো উত্তর দিলে এটা
                ভুল, আর ভুল অপেক্ষায় সারে না।
              </ListItem>
              <ListItem>
                dig এর উত্তরে Resolver এর TTL আসলে বাকি মেয়াদ। সেটা দেখে একটা
                আসল সংখ্যা বলা যায়।
              </ListItem>
              <ListItem>
                অপেক্ষার সময়: curl --resolve বা hosts ফাইলে নতুন সার্ভার পরীক্ষা,
                নিজের Cache মোছা, Google আর Cloudflare এর Cache মুছতে বলা, আর
                পুরনো সার্ভার চালু রাখা।
              </ListItem>
              <ListItem>
                বড় বদলের আগে TTL কমান, পুরনো TTL এর সমান সময় অপেক্ষা করুন, তারপর
                বদলান। ছোট TTL মানে দ্রুত বদল আর দ্রুত ফেরা।
              </ListItem>
              <ListItem>
                পরের লেসন: পুরো মডিউল এক সুতায়, নাম লেখা থেকে IP পাওয়া পর্যন্ত
                সম্পূর্ণ DNS Journey।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      [
        <span className="font-bold text-primary">Propagation</span>,
        "পুরনো Cache এর মেয়াদ ফুরানোর অপেক্ষা, কিছু ছড়ানো নয়",
      ],
      [
        <span className="font-bold text-primary">Record বদল</span>,
        "সর্বোচ্চ অপেক্ষা সেই Record এর আগের TTL",
      ],
      [
        <span className="font-bold text-primary">নতুন নাম</span>,
        "প্রায় সাথে সাথে, কারণ কারো Cache এ কিছু নেই",
      ],
      [
        <span className="font-bold text-primary">Name Server বদল</span>,
        "দুই দিন পর্যন্ত, TLD এর NS এর TTL অনুযায়ী",
      ],
      [
        <span className="font-bold text-primary">উৎসে যাচাই</span>,
        "dig @Authoritative, নতুন উত্তর এলে আপনার কাজ শেষ",
      ],
      [
        <span className="font-bold text-primary">বাকি মেয়াদ</span>,
        "dig @Resolver এর উত্তরে TTL এর সংখ্যাটা, যা কমতে থাকে",
      ],
      [
        <span className="font-bold text-primary">curl --resolve</span>,
        "DNS পাশ কাটিয়ে নতুন সার্ভার পরীক্ষা করা",
      ],
      [
        <span className="font-bold text-primary">hosts ফাইল</span>,
        "নিজের যন্ত্রে একটা নামকে জোর করে একটা IP তে পাঠানো",
      ],
      [
        <span className="font-bold text-primary">Cache মোছার পাতা</span>,
        "Google আর Cloudflare কে তাদের Cache মুছতে বলা",
      ],
      [
        <span className="font-bold text-primary">আগে TTL কমানো</span>,
        "বদল দ্রুত পৌঁছায়, আর ভুল হলে দ্রুত ফেরা যায়",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "DNS Propagation আসলে কী?",
        options: [
          {
            key: "A",
            text: "আপনার DNS নতুন Record টা পৃথিবীর সব Resolver এ ঠেলে পাঠায়",
            isCorrect: false,
            explanation:
              "DNS কাউকে কিছু পাঠায় না। সে শুধু জিজ্ঞেস করলে উত্তর দেয়।",
          },
          {
            key: "B",
            text: "Resolver দের Cache এ থাকা পুরনো উত্তরের মেয়াদ ফুরানোর অপেক্ষা",
            isCorrect: true,
            explanation:
              "ঠিক। যার মেয়াদ যখন ফুরায়, সে তখন নিজে এসে নতুন উত্তর নেয়। তাই সবাই আলাদা সময়ে পায়।",
          },
          {
            key: "C",
            text: "Registrar এর অনুমোদনের অপেক্ষা",
            isCorrect: false,
            explanation: "সাধারণ Record বদলে Registrar এর কোনো ভূমিকাই নেই।",
          },
        ],
      },
      {
        id: 2,
        text: "একটা A Record এর TTL ছিল ৩৬০০। আপনি IP বদলালেন আর একই সাথে TTL করলেন ৬০। সবার কাছে নতুন IP পৌঁছাতে সর্বোচ্চ কতক্ষণ?",
        options: [
          {
            key: "A",
            text: "৬০ সেকেন্ড",
            isCorrect: false,
            explanation:
              "নতুন TTL শুধু এরপর থেকে নেওয়া নকলে খাটে। আগের নকলগুলো ৩৬০০ নিয়েই বসে আছে।",
          },
          {
            key: "B",
            text: "প্রায় ১ ঘণ্টা, আগের TTL অনুযায়ী",
            isCorrect: true,
            explanation:
              "ঠিক। অপেক্ষা ঠিক করে আগের TTL। এই কারণেই TTL কমাতে হয় বদলের আগে, বদলের সাথে নয়।",
          },
          {
            key: "C",
            text: "৪৮ ঘণ্টা",
            isCorrect: false,
            explanation: "৪৮ ঘণ্টা শুধু Name Server বদলের সবচেয়ে খারাপ ক্ষেত্র।",
          },
        ],
      },
      {
        id: 3,
        text: "Name Server বদলে ৪৮ ঘণ্টা পর্যন্ত লাগতে পারে কেন?",
        options: [
          {
            key: "A",
            text: "Name Server এর তথ্য TLD server এ থাকে, আর তার TTL সাধারণত দুই দিন, যা আপনার হাতে নয়",
            isCorrect: true,
            explanation:
              "ঠিক। যেসব Resolver পুরনো Name Server এর ঠিকানা Cache করেছে, তারা দুই দিন পর্যন্ত সেখানেই জিজ্ঞেস করবে।",
          },
          {
            key: "B",
            text: "Internet ধীর বলে",
            isCorrect: false,
            explanation: "গতির সাথে সম্পর্ক নেই, এটা Cache এর মেয়াদ।",
          },
          {
            key: "C",
            text: "নিয়ম অনুযায়ী সব DNS বদলে ৪৮ ঘণ্টা লাগে",
            isCorrect: false,
            explanation: "না। পাঁচ মিনিট TTL এর Record পাঁচ মিনিটেই বদলায়।",
          },
        ],
      },
      {
        id: 4,
        text: "বদলের এক ঘণ্টা পরেও আপনার Browser এ পুরনো সাইট। প্রথমে কী করবেন?",
        options: [
          {
            key: "A",
            text: "আরও ৪৮ ঘণ্টা অপেক্ষা",
            isCorrect: false,
            explanation: "ভুল হয়ে থাকলে অপেক্ষায় কখনো সারবে না। আগে যাচাই করুন।",
          },
          {
            key: "B",
            text: "Authoritative server কে সরাসরি dig করে দেখবেন সে নতুন উত্তর দিচ্ছে কি না",
            isCorrect: true,
            explanation:
              "ঠিক। সে নতুন উত্তর দিলে এটা শুধু Cache, অপেক্ষার ব্যাপার। পুরনো দিলে Record টাই ভুল।",
          },
          {
            key: "C",
            text: "Record টা আবার বদলে দেখবেন",
            isCorrect: false,
            explanation: "বারবার বদলালে নানা Resolver এ নানা উত্তর জমে গোলমাল বাড়ে।",
          },
        ],
      },
      {
        id: 5,
        text: "dig @8.8.8.8 এর উত্তরে TTL এর জায়গায় 1840 দেখাচ্ছে, যদিও Record এর TTL 3600। এই 1840 কী?",
        options: [
          {
            key: "A",
            text: "Google এর Cache এ এই উত্তরের বাকি মেয়াদ, সেকেন্ডে",
            isCorrect: true,
            explanation:
              "ঠিক। ১৮৪০ সেকেন্ড পরে Google এই নকলটা ফেলে দিয়ে নতুন করে জিজ্ঞেস করবে। আবার চালালে সংখ্যাটা আরও কম দেখবেন।",
          },
          {
            key: "B",
            text: "একটা ভুল, Google TTL ঠিকমতো পড়তে পারেনি",
            isCorrect: false,
            explanation: "ভুল নয়, Cache থেকে দেওয়া উত্তরে এটাই স্বাভাবিক।",
          },
          {
            key: "C",
            text: "উত্তর আসতে যত মিলিসেকেন্ড লেগেছে",
            isCorrect: false,
            explanation: "সেটা Query time, আলাদা একটা লাইন।",
          },
        ],
      },
      {
        id: 6,
        text: "DNS এর অপেক্ষা ছাড়াই নতুন সার্ভার ঠিকঠাক চলছে কি না পরীক্ষা করার উপায় কোনটা?",
        options: [
          {
            key: "A",
            text: "curl এর --resolve, অথবা hosts ফাইলে নামটাকে নতুন IP তে দেখানো",
            isCorrect: true,
            explanation:
              "ঠিক। দুইটাই DNS পাশ কাটিয়ে আপনার যন্ত্রকে সরাসরি নতুন IP তে পাঠায়। hosts ফাইলের লাইনটা পরে মুছতে ভুলবেন না।",
          },
          {
            key: "B",
            text: "TTL বাড়িয়ে দেওয়া",
            isCorrect: false,
            explanation: "এতে পুরনো উত্তর বরং আরও বেশিক্ষণ থাকবে।",
          },
          {
            key: "C",
            text: "উপায় নেই, অপেক্ষা করতেই হবে",
            isCorrect: false,
            explanation: "আছে, আর বদলের আগেই এই পরীক্ষা করে নেওয়া উচিত।",
          },
        ],
      },
      {
        id: 7,
        text: "IP বদলের পর পুরনো সার্ভারটা কিছুদিন চালু রাখা জরুরি কেন?",
        options: [
          {
            key: "A",
            text: "যাদের Resolver এ পুরনো উত্তর এখনো Cache এ, তারা পুরনো সার্ভারেই আসবে",
            isCorrect: true,
            explanation:
              "ঠিক। সেখানে চালু সাইট না থাকলে তারা বন্ধ সাইট দেখবে। পুরনো সার্ভারের Log নীরব হলে তবেই বন্ধ করুন।",
          },
          {
            key: "B",
            text: "DNS এর নিয়মে দুইটা সার্ভার থাকতেই হয়",
            isCorrect: false,
            explanation: "এমন কোনো নিয়ম নেই।",
          },
          {
            key: "C",
            text: "দরকার নেই, সাথে সাথে বন্ধ করাই ভালো",
            isCorrect: false,
            explanation: "সাথে সাথে বন্ধ করলে কিছু মানুষের জন্য সাইট বন্ধ হয়ে যাবে।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "Cache এর ঘড়িটা নিজের চোখে দেখুন",
    subtitle: "Terminal এ পাঁচটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "মেয়াদ কমতে দেখা",
        description:
          "একটা Resolver কে একই প্রশ্ন কয়েক সেকেন্ড পরপর করে TTL এর সংখ্যাটা কমতে দেখুন।",
      },
      {
        title: "উৎস আর নকলের তফাত",
        description:
          "Authoritative এর উত্তরের TTL আর Resolver এর উত্তরের TTL পাশাপাশি রেখে তফাতটা বুঝুন।",
      },
      {
        title: "সব Name Server একমত তো",
        description:
          "একটা Domain এর প্রতিটা Name Server কে আলাদা করে জিজ্ঞেস করে উত্তর মিলিয়ে দেখুন।",
      },
      {
        title: "Name Server এর দুই দিনের মেয়াদ",
        description:
          "TLD server কে জিজ্ঞেস করে দেখুন একটা Domain এর NS এর TTL আসলে কত।",
      },
      {
        title: "DNS পাশ কাটিয়ে একটা সার্ভারে যাওয়া",
        description:
          "curl এর --resolve দিয়ে একটা নামকে নিজের বেছে নেওয়া IP তে পাঠান।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-watch-ttl.sh",
        language: "bash",
        code: `# পাঁচ সেকেন্ড পরপর পাঁচবার, TTL এর সংখ্যাটা দেখুন
for i in 1 2 3 4 5; do
  dig +noall +answer A wikipedia.org @8.8.8.8
  sleep 5
done
# দ্বিতীয় ঘরের সংখ্যাটা প্রতিবার প্রায় ৫ করে কমছে।
# এটাই সেই ঘড়ি। শূন্যে নামলে Resolver আবার নতুন করে জিজ্ঞেস করবে,
# আর সংখ্যাটা লাফ দিয়ে পুরো TTL এ ফিরে যাবে।
# (মাঝে মাঝে সংখ্যা লাফ দিলে ঘাবড়াবেন না, 8.8.8.8 এর পেছনে অনেক
#  সার্ভার, প্রত্যেকের খাতা আলাদা।)`,
      },
      {
        filename: "2-source-vs-copy.sh",
        language: "bash",
        code: `D=wikipedia.org
NS=$(dig +short NS $D | head -1)

echo "উৎস ($NS):"
dig +noall +answer A $D @$NS
echo "নকল (1.1.1.1):"
dig +noall +answer A $D @1.1.1.1

# উৎস সবসময় পুরো TTL দেখায়, যতবারই জিজ্ঞেস করুন।
# নকল দেখায় বাকি মেয়াদ, যা কমতে থাকে।
# পুরো TTL জানতে তাই সবসময় উৎসকে জিজ্ঞেস করুন।`,
      },
      {
        filename: "3-all-ns-agree.sh",
        language: "bash",
        code: `D=github.com
for NS in $(dig +short NS $D); do
  echo "$NS -> $(dig +short A $D @$NS | sort | tr '\\n' ' ')"
done
# প্রতিটা লাইনে একই IP থাকা চাই।
# নিজের Domain এ এই পরীক্ষায় দুই রকম উত্তর এলে সেটা একটা আসল সমস্যা,
# Propagation নয়।

# SOA এর সংস্করণ নম্বরও মিলিয়ে দেখা যায়
dig +nssearch $D`,
      },
      {
        filename: "4-ns-ttl.sh",
        language: "bash",
        code: `# .com এর TLD server কে সরাসরি জিজ্ঞেস
dig +noall +authority NS github.com @a.gtld-servers.net
#   github.com.   172800   IN   NS   ns-520.awsdns-01.net.
#                 ^^^^^^ ১৭২৮০০ সেকেন্ড = ৪৮ ঘণ্টা

# এটাই সেই বিখ্যাত ৪৮ ঘণ্টার উৎস। এই সংখ্যা ঠিক করে .com এর Registry,
# Domain এর মালিক নয়। তাই Name Server বদলে TTL কমিয়ে রাখার উপায় নেই।`,
      },
      {
        filename: "5-bypass-dns.sh",
        language: "bash",
        code: `# আগে স্বাভাবিকভাবে, DNS যা বলে
curl -sI https://example.com | head -1

# এবার DNS কে জিজ্ঞেসই না করে, নিজে বলে দেওয়া IP তে
IP=$(dig +short A example.com | head -1)
curl -sI --resolve example.com:443:$IP https://example.com | head -1

# দুইটাই একই উত্তর দেবে, কারণ IP টা একই।
# কিন্তু দ্বিতীয়টায় আপনি চাইলে যেকোনো IP বসাতে পারতেন।
# নতুন সার্ভার চালু করার আগে ঠিক এভাবেই তাকে পরীক্ষা করা হয়।

# -v দিলে দেখবেন curl কোন IP তে গেল
curl -sIv --resolve example.com:443:$IP https://example.com 2>&1 | grep -i "connected to"`,
      },
    ],
    tip: "এক নম্বর পরীক্ষাটা দিয়ে শুরু করুন আর মন দিয়ে দেখুন। TTL এর সংখ্যাটা সেকেন্ডে সেকেন্ডে কমছে, এটাই Propagation, আর কিছু নয়। পৃথিবীর প্রতিটা Resolver এ এরকম একটা করে ঘড়ি চলছে, প্রতিটা আলাদা জায়গা থেকে। আপনি Record বদলালে কিছুই ছড়ায় না, শুধু এই ঘড়িগুলো একটা একটা করে শূন্যে নামে। এরপর যখনই কেউ বলবে DNS ছড়াতে সময় লাগছে, আপনি জানবেন আসলে কী ঘটছে, আর কোন কমান্ডে সেটা দেখা যায়।",
  },
  assignment: {
    title: "Mini Project: একটা সার্ভার বদলের রানবুক",
    time: "৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>ঘড়ি মাপুন:</strong> তিনটা সাইট বেছে নিন। প্রতিটার A Record এর
        পুরো TTL (উৎস থেকে) আর 8.8.8.8 এ বাকি মেয়াদ একটা ছকে লিখুন। আজ এই তিন
        সাইটের IP বদলালে কোনটায় সবচেয়ে বেশি অপেক্ষা করতে হতো?
      </span>,
      <span key="2">
        <strong>হিসাব করুন:</strong> নিচের চারটা বদলের প্রতিটায় সর্বোচ্চ কতক্ষণ
        অপেক্ষা, আর কেন, লিখুন। (ক) TTL ৮৬৪০০ এর একটা A Record এর IP বদল। (খ)
        blog নামে একটা একদম নতুন উপনাম যোগ। (গ) Name Server বদলে অন্য DNS সেবায়
        যাওয়া। (ঘ) TTL ৩০০ এর একটা MX Record বদল।
      </span>,
      <span key="3">
        <strong>রানবুক লিখুন:</strong> Island Tours এর সার্ভার বদলের জন্য সময় ধরে
        একটা তালিকা বানান। বদলের দুই দিন আগে, এক ঘণ্টা আগে, বদলের মুহূর্তে, পাঁচ
        মিনিট পরে, এক দিন পরে, প্রতিটায় কী করবেন আর কোন কমান্ড দিয়ে যাচাই করবেন।
        কিছু ভুল হলে ফিরে যাওয়ার ধাপটাও লিখুন।
      </span>,
      <span key="4">
        <strong>অপেক্ষা না ভুল:</strong> চারটা অবস্থা দেওয়া হলো। প্রতিটা অপেক্ষার
        ব্যাপার নাকি ভুল, আর কেন, লিখুন। (ক) Authoritative নতুন IP দিচ্ছে, 8.8.8.8
        পুরনো। (খ) Authoritative নিজেই পুরনো IP দিচ্ছে। (গ) দুই Name Server দুই
        রকম উত্তর দিচ্ছে। (ঘ) সব জায়গায় নতুন IP, তবু Browser এ পুরনো পাতা।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় লিখুন (৬ লাইন):</strong> একজন গ্রাহক রেগে লিখেছেন,
        আপনি বললেন বদল হয়ে গেছে, অথচ আমার কাছে এখনো পুরনো সাইট। তাঁকে ভদ্রভাবে
        বোঝান কী ঘটছে, কতক্ষণ লাগবে তা আপনি কীভাবে জানলেন, আর তিনি এখনই নতুন সাইট
        দেখতে চাইলে কী করতে পারেন।
      </span>,
    ],
    deliverables: [
      <span key="1">তিন সাইটের পুরো TTL আর বাকি মেয়াদের ছক</span>,
      <span key="2">চার বদলের সর্বোচ্চ অপেক্ষা আর কারণ</span>,
      <span key="3">সময় ধরে সাজানো রানবুক, যাচাইয়ের কমান্ড আর ফেরার ধাপ সহ</span>,
      <span key="4">চার অবস্থার রায়, অপেক্ষা না ভুল</span>,
      <span key="5">গ্রাহকের জন্য উত্তর, ৬ লাইনে</span>,
    ],
  },
};
