 
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  ConnectOutcomeLab,
  HandshakeCostLab,
  HandshakeStepLab,
} from "../../../components/course/topics/tcp/handshake-animations";
import {
  HandshakeLadderDiagram,
  HandshakeStatesDiagram,
  SynOptionsDiagram,
  TwoHandshakesDiagram,
  TwoQueuesDiagram,
  WhyThreeSplit,
} from "../../../components/course/topics/tcp/handshake-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const threeWayHandshakeContent: TopicData = {
  id: "three-way-handshake",
  introduction: {
    badge: "MODULE 05 · LESSON 05",
    title: <SectionTitle>আগে হাত মেলানো, তারপর কথা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          রাত দুইটা। Island Tours এ একটা নতুন Version Deploy হয়েছে, আর আপনার
          ফোনে একটা বার্তা এলো, সাইট খুলছে না। আপনি Terminal খুলে একটা কমান্ড
          চালালেন। উত্তর এলো Connection refused। পাঁচ মিনিট পর আরেকজন লিখলেন,
          তাঁর কাছে লেখা আসছে Connection timed out। দুইটাই মানে সংযোগ হয়নি,
          কিন্তু দুইটার কারণ সম্পূর্ণ আলাদা, খোঁজার জায়গা আলাদা, আর সমাধানও
          আলাদা। যিনি এই তফাতটা জানেন, তিনি দুই মিনিটে সমস্যার জায়গাটা ধরে
          ফেলেন। যিনি জানেন না, তিনি এক ঘণ্টা ভুল জায়গায় খোঁজেন।
        </ContentParagraph>
        <ContentParagraph>
          এই তফাতটা বোঝার চাবি হলো তিনটা ছোট্ট বার্তা, যেগুলো প্রতিটা TCP
          Connection এর একদম শুরুতে আদান প্রদান হয়। এদের নাম SYN, SYN-ACK আর
          ACK, আর পুরো ব্যাপারটাকে বলে Three-way Handshake। TCP Deep Dive
          লেসনে আপনি দেখেছেন TCP কীভাবে Sequence Number আর ACK দিয়ে নিশ্চিত
          করে যে একটা Byte ও হারায় না। কিন্তু সেই গোনাগুনতি শুরু হওয়ার আগে
          দুই পক্ষকে একটা জায়গায় একমত হতে হয়। আজকের লেসন সেই প্রথম
          মুহূর্তটুকু নিয়ে।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন Handshake কেন লাগে, তিনটা বার্তার প্রতিটায়
          ঠিক কী লেখা থাকে, ধাপ কেন তিনটা আর দুইটা বা চারটা নয়, এই তিন ধাপের
          দাম কত আর সেটা কীভাবে বাঁচানো হয়, Connection না হলে কোন বার্তার মানে
          কী, Server এর ভেতরে অপেক্ষার লাইনগুলো কীভাবে কাজ করে, আর কেউ এই
          নিয়মটাকেই অস্ত্র বানিয়ে আক্রমণ করলে কী ঘটে। প্রতিটা জিনিস আপনি
          নিজের Terminal এ চালিয়ে দেখবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "ফোন তুলেই কেউ আসল কথা শুরু করে না। আগে বলে হ্যালো, শুনতে পাচ্ছেন? ওপাশ থেকে আসে হ্যাঁ পাচ্ছি, আপনি পাচ্ছেন? তারপর আসে হ্যাঁ পাচ্ছি। এই তিনটা বাক্যের আগে বলা যেকোনো কথা বাতাসে হারিয়ে যেতে পারে।",
      author: "TCP",
      role: "Lesson 05",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-handshake",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>কথা শুরুর আগে চারটা প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের লেসনে UDP দেখেছেন। UDP র স্বভাব হলো চিঠি ফেলে দেওয়া। ঠিকানা
                লিখে ডাকবাক্সে ফেললেন, ওপাশে কেউ আছে কি না, চিঠি পৌঁছাল কি না,
                কিছুই জানলেন না। এতে কোনো প্রস্তুতি লাগে না, তাই UDP দ্রুত। TCP
                র স্বভাব হলো ফোন করা। ফোনে আপনি নম্বর টিপেই কথা শুরু করেন না।
                আগে রিং হয়, ওপাশে কেউ ধরেন, দুইজনই নিশ্চিত হন লাইনটা দুই দিকেই
                পরিষ্কার, তারপর আসল কথা।
              </ContentParagraph>
              <ContentParagraph>
                TCP কেন এই বাড়তি ভদ্রতা করে? কারণ TCP আপনাকে কয়েকটা বড় কথা
                দিয়েছে। TCP Deep Dive লেসনে দেখেছেন, সে কথা দেয় প্রতিটা Byte
                পৌঁছাবে, ঠিক ক্রমে পৌঁছাবে, আর একটাও দুইবার গোনা হবে না। এই
                কথাগুলো রাখতে গেলে দুই পক্ষকেই কিছু জিনিস মনে রাখতে হয়, কত
                পর্যন্ত পাঠিয়েছি, কত পর্যন্ত পেয়েছি, ওপাশে কতটা জায়গা আছে।
                এই মনে রাখার খাতাটাকেই বলে Connection। আর খাতা খোলার আগে দুই
                পক্ষের চারটা প্রশ্নের উত্তর জানা চাই।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ওপাশে কি কেউ আছে, আর সে কি কথা বলতে রাজি?</strong> ওই
                  IP তে হয়তো কোনো যন্ত্রই নেই। থাকলেও হয়তো ওই Port এ কোনো
                  Program বসে নেই। না জেনে Data পাঠানো মানে ফাঁকা ঘরে চিৎকার।
                </ListItem>
                <ListItem>
                  <strong>রাস্তাটা কি দুই দিকেই খোলা?</strong> আমার কথা ওপাশে
                  পৌঁছায়, এটা এক জিনিস। ওপাশের কথা আমার কাছে ফেরে, এটা আলাদা
                  জিনিস। How Data Travels লেসনে দেখেছেন, যাওয়ার পথ আর ফেরার
                  পথ একই হওয়ার কোনো বাধ্যবাধকতা নেই। একটা দিক বন্ধ থাকলে TCP
                  কাজই করবে না, কারণ ACK ফিরতে পারবে না।
                </ListItem>
                <ListItem>
                  <strong>গোনা কোথা থেকে শুরু হবে?</strong> Sequence Number দিয়ে
                  প্রতিটা Byte গোনা হয়, এটা আপনি জানেন। কিন্তু প্রথম Byte এর
                  নম্বর কত? এটা শূন্য নয়, প্রতিটা Connection এ আলাদা একটা সংখ্যা,
                  যাকে বলে Initial Sequence Number, ছোট করে ISN। দুই পক্ষের দুইটা
                  আলাদা ISN, কারণ দুই দিকের Data আলাদা করে গোনা হয়। আর দুইজনকেই
                  অপরজনের ISN জানতে হবে, নইলে কে কোন Byte এর কথা বলছে বোঝা যাবে
                  না।
                </ListItem>
                <ListItem>
                  <strong>কার কী সামর্থ্য?</strong> এক টুকরোয় সর্বোচ্চ কত Byte
                  নিতে পারি, কত বড় Window সামলাতে পারি, হারানো টুকরোর আলাদা
                  হিসাব দিতে পারি কি না। এগুলো শুরুতেই ঠিক না করলে পরে আর বদলানো
                  যায় না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই চার প্রশ্নের উত্তর জোগাড় করার সবচেয়ে ছোট উপায়টাই Three-way
                Handshake। তিনটা বার্তা, যাদের একটাতেও আপনার আসল Data নেই, শুধু
                প্রস্তুতি। Handshake শব্দের মানে করমর্দন, দুইজন মানুষ কাজ
                শুরুর আগে হাত মেলান, সেই ছবিটা থেকেই নামটা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Connection কোনো তার নয়, দুই প্রান্তের দুইটা খাতা",
          content: (
            <p>
              এই কথাটা এখনই পরিষ্কার করে নিন, পুরো লেসনে এটা কাজে লাগবে। TCP
              Connection বললে মনে হয় দুই যন্ত্রের মাঝে একটা তার বা সুড়ঙ্গ তৈরি
              হলো। আসলে মাঝখানে কিছুই তৈরি হয় না। পথের Router গুলো জানেই না
              কোনো Connection আছে, তারা আগের মতোই একটা একটা Packet এগিয়ে দেয়।
              Connection হলো শুধু দুই প্রান্তের Kernel এর Memory তে রাখা দুইটা
              খাতা, যেখানে লেখা কার সাথে কথা হচ্ছে, কোন নম্বর পর্যন্ত গোনা
              হয়েছে, আর এখন কোন অবস্থা। Handshake মানে এই দুইটা খাতা একসাথে
              খোলা আর শুরুর সংখ্যাগুলো মিলিয়ে নেওয়া। এক প্রান্তের যন্ত্র হঠাৎ
              বন্ধ হয়ে গেলে অন্য প্রান্তের খাতাটা তাই খোলাই পড়ে থাকে, যতক্ষণ না
              সে নিজে টের পায়। এই গল্পটা Connection Close লেসনের।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "three-messages",
      subHeader: { index: "002", title: "Three Messages" },
      title: <SectionTitle>SYN, SYN-ACK, ACK: তিনটা বার্তা, তিনটা নাম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নামগুলো আগে ভেঙে নিই, কারণ নাম বুঝলে অর্ধেক মুখস্থ করার দরকার
                পড়ে না। TCP Deep Dive লেসনে TCP Header এর ঘরগুলো দেখেছেন। সেখানে
                কয়েকটা এক Bit এর ঘর ছিল, যাদের বলে Flag। Flag মানে পতাকা, একটা
                Bit যা চালু থাকলে একটা বিশেষ কথা বোঝায়। Handshake এ কাজে লাগে
                তার দুইটা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>SYN</strong>, পুরো শব্দ Synchronize, মানে মিলিয়ে
                  নেওয়া। এই Flag চালু থাকলে বার্তাটা বলছে, আমি একটা Connection
                  শুরু করতে চাই, আর এই বার্তার Sequence Number এর ঘরে যে সংখ্যাটা
                  আছে সেটাই আমার শুরুর সংখ্যা, আপনার খাতায় লিখে নিন। মিলিয়ে
                  নেওয়া হচ্ছে গোনার শুরুটা।
                </ListItem>
                <ListItem>
                  <strong>ACK</strong>, পুরো শব্দ Acknowledge, মানে প্রাপ্তি
                  স্বীকার। এই Flag চালু থাকলে বার্তাটা বলছে, Acknowledgment
                  Number এর ঘরে যে সংখ্যাটা আছে, তার আগ পর্যন্ত সব আমি পেয়েছি,
                  এরপর ওই নম্বরটা চাই।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার তিনটা বার্তা। প্রথমটায় শুধু SYN Flag চালু, তাই তার নাম SYN।
                দ্বিতীয়টায় SYN আর ACK দুইটাই চালু, তাই নাম SYN-ACK। তৃতীয়টায়
                শুধু ACK চালু, তাই নাম ACK। এই তিনটা আলাদা ধরনের Packet নয়, তিনটাই
                সাধারণ TCP Segment, শুধু Header এর দুইটা Bit আলাদা আলাদা ভাবে
                চালু। আর তিনটার কোনোটাতেই সাধারণত কোনো Data থাকে না, শুধু Header।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HandshakeLadderDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবিটা মানুষের ভাষায় পড়লে এরকম দাঁড়ায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ফোন বলল (SYN):</strong> আমি 192.168.1.20 এর Port
                  51514 থেকে বলছি। আপনার Port 443 এর সাথে কথা বলতে চাই। আমি আমার
                  Byte গোনা শুরু করব ১০০০ থেকে।
                </ListItem>
                <ListItem>
                  <strong>Server বলল (SYN-ACK):</strong> শুনেছি। আপনার ১০০০ আমি
                  পেয়েছি, এরপর আপনার কাছ থেকে ১০০১ নম্বরটা আশা করছি। আমিও
                  রাজি। আমি আমার Byte গোনা শুরু করব ৫০০০ থেকে।
                </ListItem>
                <ListItem>
                  <strong>ফোন বলল (ACK):</strong> আপনার ৫০০০ আমি পেয়েছি, এরপর
                  আপনার কাছ থেকে ৫০০১ আশা করছি। চলুন শুরু করি।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                যে পক্ষ প্রথম SYN পাঠায় তাকে বলে Client, আর এই কাজটাকে বলে
                Active Open, মানে নিজে এগিয়ে গিয়ে খোলা। যে পক্ষ বসে অপেক্ষা
                করে তাকে বলে Server, আর তার কাজটাকে বলে Passive Open। Client
                Server ISP লেসনে শিখেছিলেন Client আর Server কোনো যন্ত্রের নাম
                নয়, ভূমিকার নাম। এখানে সেই ভূমিকা ঠিক হয় একটাই প্রশ্নে, প্রথম
                SYN টা কে পাঠাল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "tcpdump আর Wireshark এ Flag গুলো যেভাবে লেখা থাকে",
          content: (
            <p>
              tcpdump নামের টুলটা তারে যাওয়া Packet গুলো এক লাইন করে দেখায়, আর
              সেখানে Flag লেখা থাকে এক অক্ষরে। SYN হলো <code>[S]</code>, SYN-ACK
              হলো <code>[S.]</code>, আর শুধু ACK হলো <code>[.]</code>। ফোঁটাটাই
              ACK। সামনে আরও দেখবেন <code>[R]</code> মানে RST,{" "}
              <code>[F.]</code> মানে FIN, আর <code>[P.]</code> মানে PSH, যা Data
              বহন করা Segment এ থাকে। Wireshark এ একই জিনিস পুরো নামে লেখা
              থাকে, [SYN], [SYN, ACK], [ACK]। এই ছয়টা চিহ্ন চিনলে যেকোনো Packet
              Capture এর অর্ধেক পড়া হয়ে যায়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "numbers",
      subHeader: { index: "003", title: "The Numbers" },
      title: <SectionTitle>সংখ্যাগুলো ধরে ধরে, কে কখন কী জানল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবিতে চারটা সংখ্যা ছিল, ১০০০, ১০০১, ৫০০০ আর ৫০০১। এগুলো মুখস্থ
                করার জিনিস নয়, এগুলোর পেছনে একটাই নিয়ম। ACK এর সংখ্যা সব সময়
                বলে, এরপর আমি কোন নম্বরটা চাই। TCP Deep Dive লেসনে এটাকে
                Cumulative ACK নামে চিনেছেন। ফোন পাঠাল seq 1000, তাই Server
                বলল এরপর 1001 চাই। Server পাঠাল seq 5000, তাই ফোন বলল এরপর
                5001 চাই।
              </ContentParagraph>
              <ContentParagraph>
                এখানে একটা সূক্ষ্ম প্রশ্ন ওঠে। SYN এ তো কোনো Data ছিল না, শূন্য
                Byte। তাহলে সংখ্যা এক বাড়ল কেন? ১০০০ পেয়ে তো বলার কথা এরপর
                ১০০০ ই চাই। উত্তর হলো, TCP র নিয়মে SYN Flag টা নিজে একটা Byte
                এর জায়গা নেয়, যদিও সত্যিকারের কোনো Byte সে বহন করে না। কারণটা
                সুন্দর। TCP তে নিশ্চিতভাবে পৌঁছানোর একটাই কৌশল আছে, জিনিসটাকে একটা নম্বর দেওয়া, আর ওপাশ থেকে সেই নম্বরের ACK না আসা পর্যন্ত আবার পাঠাতে থাকা। SYN টাও তো হারাতে পারে, তাই তারও পৌঁছানোর
                নিশ্চয়তা চাই। তাকে একটা নম্বর দিলেই পুরনো কৌশলটা তার বেলায়ও
                খেটে যায়, আলাদা কোনো নিয়ম বানাতে হয় না। FIN এর বেলায়ও ঠিক একই
                কাজ হয়, সেটা Connection Close লেসনে দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                এবার নিচের Lab এ এক ধাপ করে এগোন। উপরে দেখবেন তারে কোন বার্তা
                যাচ্ছে আর দুই পক্ষের State কী। নিচের ছকে দেখবেন প্রথম সেকশনের
                চারটা প্রশ্নের মধ্যে কে কয়টার উত্তর পেয়ে গেছে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HandshakeStepLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lab থেকে তিনটা জিনিস তুলে রাখুন। প্রথমত, ফোনের দিকে Connection
                তৈরি হয়ে যায় দ্বিতীয় বার্তা পেয়েই। তাই ফোন তৃতীয় বার্তা
                পাঠানোর সাথে সাথেই, এমনকি একই Segment এ, তার প্রথম Data পাঠাতে
                পারে। Server কে অপেক্ষা করতে হয় তৃতীয় বার্তা পর্যন্ত। দ্বিতীয়ত,
                Handshake শেষে ফোনের পরের Byte এর নম্বর ১০০১ আর Server এর ৫০০১।
                এরপর থেকে প্রতিটা Data Byte এই দুই সংখ্যা থেকে গোনা শুরু।
                তৃতীয়ত, তিনটা বার্তার প্রতিটা আগেরটার প্রাপ্তি স্বীকার করে, শুধু
                শেষটার কোনো স্বীকৃতি নেই। শেষ ACK টা হারালে কী হয়, সেটা একটু
                পরেই দেখব।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "১০০০ আর ৫০০০ শেখার সুবিধার জন্য, আসল সংখ্যা এরকম নয়",
          content: (
            <p>
              বাস্তবে ISN একটা ৩২ Bit এর সংখ্যা, শূন্য থেকে প্রায় চারশ ত্রিশ
              কোটির মধ্যে যেকোনো কিছু, আর Kernel প্রতিটা Connection এ এমন একটা
              বেছে নেয় যা বাইরে থেকে অনুমান করা যায় না। তাই আসল Capture এ
              দেখবেন seq 2817345001 এর মতো বিশাল সংখ্যা। পড়তে কষ্ট হয় বলে
              tcpdump আর Wireshark নিজে থেকেই হিসাবটা সহজ করে দেয়। তারা প্রথম
              বার্তায় আসল সংখ্যা দেখায়, আর এরপর থেকে ISN কে শূন্য ধরে দেখায়,
              যাকে বলে Relative Sequence Number। তাই Handshake এর তৃতীয় লাইনে
              প্রায়ই শুধু ack 1 লেখা দেখবেন। ওটা ভুল নয়, ওটা ISN বাদ দিয়ে
              দেখানো। আসল সংখ্যা দেখতে চাইলে tcpdump এ -S যোগ করুন। সংখ্যা
              অনুমান করা কঠিন রাখা কেন জরুরি, সেটা নিরাপত্তার সেকশনে আসছে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "why-three",
      subHeader: { index: "004", title: "Why Three" },
      title: <SectionTitle>কেন তিন, দুই নয়, চারও নয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই প্রশ্নটা Interview তে সবচেয়ে বেশি আসে, আর কাউকে শেখাতে গেলে
                এটাই প্রথম জিজ্ঞেস করা হয়। উত্তরটা তিন ভাগে ভাবুন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>চার কেন নয়।</strong> যুক্তি দিয়ে ভাবলে আসলে চারটা কাজ
                আছে। ফোন তার সংখ্যা জানায়, Server সেটার প্রাপ্তি স্বীকার করে,
                Server তার সংখ্যা জানায়, ফোন সেটার প্রাপ্তি স্বীকার করে। চারটা
                কাজ, চারটা বার্তা হওয়ার কথা। কিন্তু মাঝের দুইটা কাজ একই পক্ষ
                একই মুহূর্তে করে, দুইটাই Server থেকে ফোনের দিকে যায়। আলাদা
                দুইটা Packet পাঠিয়ে লাভ নেই, একটা Packet এ দুইটা Flag চালু করে
                দিলেই হয়। SYN-ACK নামটাই বলছে এটা দুইটা বার্তার জোড়া। তাই চার
                কমে তিন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>দুই কেন নয়, প্রথম কারণ।</strong> দুই ধাপে থামলে Server
                কখনো জানত না তার নিজের শুরুর সংখ্যাটা ফোনের কাছে পৌঁছেছে কি
                না। Lab এ এটাই দেখেছেন, তৃতীয় বার্তার আগে Server এর একটা ঘর
                ফাঁকা। TCP তে Data দুই দিকেই যায়। Server যদি নিশ্চিত না হয় যে
                ফোন তার গোনার শুরুটা জানে, তাহলে Server থেকে ফোনের দিকে
                নির্ভরযোগ্যভাবে কিছু পাঠানোই সম্ভব নয়। আর Island Tours এর
                বেলায় আসল জিনিসটা, মানে নৌকার তালিকা, তো ওই দিকেই যায়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>দুই কেন নয়, দ্বিতীয় কারণ।</strong> এটা একটু সূক্ষ্ম,
                আর TCP র নকশাকাররা আসলে এটার জন্যই তিন ধাপ রেখেছিলেন। Packet
                Latency Bandwidth লেসনে দেখেছেন, Packet পথে দেরি করতে পারে, এমনকি
                এত দেরি যে পাঠানো পক্ষ হাল ছেড়ে আবার পাঠিয়ে দেয়। তখন Network
                এ একই বার্তার দুইটা নকল ঘুরছে। ধরুন ফোনের একটা পুরনো SYN পথে
                কোথাও আটকে ছিল, আর সেই Connection অনেক আগেই শেষ হয়ে গেছে। এখন
                হঠাৎ সেই পুরনো SYN টা Server এ এসে পৌঁছাল। কী হবে?
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WhyThreeSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তৃতীয় ধাপটা তাই Server এর জন্য একটা প্রমাণপত্র। Server SYN
                পেয়ে শুধু বলে, আচ্ছা, আপনি যদি সত্যিই এই মুহূর্তে কথা বলতে চান
                তাহলে আমার এই সংখ্যাটা ফিরিয়ে বলুন। যে ফোন সত্যিই এখন কথা বলতে
                চায়, সে ঠিক সংখ্যাটা ফিরিয়ে দেয়। পুরনো ভূতুড়ে SYN এর পেছনে
                কোনো আগ্রহী ফোন নেই, তাই হয় কোনো উত্তর আসে না, নয়তো ফোন RST
                পাঠিয়ে সোজা না বলে দেয়। RST মানে Reset, এই Flag টা বলে এই
                Connection টা আমি চিনি না, বাতিল করুন।
              </ContentParagraph>
              <ContentParagraph>
                এক বাক্যে সারাংশটা এরকম। দুই দিকেই Data যাবে বলে দুই পক্ষেরই
                শুরুর সংখ্যা জানানো আর স্বীকার করানো দরকার, তাতে চারটা কাজ।
                মাঝের দুইটা এক বার্তায় জোড়া লাগে বলে বার্তা তিনটা। আর তিনের
                কম হলে এক পক্ষ কখনো নিশ্চিত হতে পারে না যে অপর পক্ষ সত্যিই
                এখন, এই Connection এর জন্য, কথা বলছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "কাউকে শেখানোর সময় যে ভুল উত্তরটা শুধরে দেবেন",
          content: (
            <p>
              অনেকে বলেন, তিন ধাপ লাগে কারণ এতে দুই পক্ষই নিশ্চিত হয় যে অপর
              পক্ষ পাঠাতে আর পেতে পারে। কথাটা ভুল নয়, কিন্তু অর্ধেক। আসল কথা
              হলো শুরুর সংখ্যা। রাস্তা খোলা আছে কি না সেটা জানার জন্য যেকোনো
              দুইটা বার্তাই যথেষ্ট হতো। তিন ধাপ লাগে কারণ দুইটা আলাদা সংখ্যা
              দুই দিকে পাঠাতে হয় আর দুইটারই প্রাপ্তি স্বীকার লাগে, আর সেই
              স্বীকৃতিই পুরনো নকল SYN থেকে আসল SYN কে আলাদা করে। তাই SYN এর
              পুরো নাম Synchronize, হ্যালো নয়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "options",
      subHeader: { index: "005", title: "Options" },
      title: <SectionTitle>হাত মেলানোর ফাঁকে একটা ছোট দরদাম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম সেকশনের চতুর্থ প্রশ্নটা ছিল, কার কী সামর্থ্য। এর উত্তর যায়
                SYN আর SYN-ACK এর পেটের ভেতর, Header এর শেষে একটা বাড়তি অংশে,
                যার নাম Options। TCP Deep Dive লেসনে এই ঘরটার নাম দেখেছেন, আজ
                দেখুন সেখানে আসলে কী লেখা থাকে। দুইজন মানুষ একসাথে কাজ শুরুর
                আগে যেমন ঠিক করে নেন কে কোন ভাষায় লিখবেন আর এক পাতায় কতটা
                লিখবেন, এটা সেরকম।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SynOptionsDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>MSS, Maximum Segment Size:</strong> এক Segment এ আমি
                  সর্বোচ্চ কত Byte Data নিতে পারি। সবচেয়ে বেশি যে সংখ্যাটা
                  দেখবেন তা হলো 1460। এটা এলো কোথা থেকে? সাধারণ Network এ একটা
                  Frame সর্বোচ্চ 1500 Byte বইতে পারে, যাকে বলে MTU। তার থেকে IP
                  Header এর 20 আর TCP Header এর 20 বাদ দিলে থাকে 1460। পুরো
                  হিসাবটা পরের লেসন Packet, Segment, and Frame এ ভেঙে দেখবেন।
                  এখন শুধু জানুন, প্রত্যেক পক্ষ নিজের সীমা জানায় আর অপর পক্ষ
                  তার বেশি বড় টুকরো পাঠায় না। VPN এ থাকলে সংখ্যাটা ছোট দেখবেন,
                  কারণ VPN নিজের মোড়কের জন্য কিছু জায়গা নিয়ে নেয়।
                </ListItem>
                <ListItem>
                  <strong>Window Scale:</strong> TCP Header এ Window এর ঘরটা ১৬
                  Bit এর, তাই সেখানে সর্বোচ্চ লেখা যায় 65,535। ১৯৮১ সালে এটা
                  বিশাল ছিল, আজকের দ্রুত লাইনে এটা হাস্যকর রকম ছোট। ঘরটা বড় করা
                  যায়নি, কারণ তাতে পুরনো সব যন্ত্র ভেঙে যেত। তাই একটা কৌশল করা
                  হলো। Handshake এ দুই পক্ষ একটা গুণক ঠিক করে নেয়, আর এরপর
                  Window এর ঘরের সংখ্যাটাকে সেই গুণক দিয়ে গুণ করে পড়া হয়।
                  wscale 7 মানে ২ এর ঘাত ৭, অর্থাৎ ১২৮ গুণ। এই Option না মিললে
                  Connection চলবে, কিন্তু বড় File নামানো অনেক ধীর হবে।
                </ListItem>
                <ListItem>
                  <strong>SACK Permitted:</strong> SACK মানে Selective
                  Acknowledgment। সাধারণ ACK শুধু বলতে পারে এই পর্যন্ত টানা
                  পেয়েছি। মাঝের একটা টুকরো হারালে তার পরের টুকরোগুলো পৌঁছালেও
                  সে সেটা জানাতে পারে না। SACK থাকলে গ্রাহক বলতে পারে, ৩ নম্বরটা
                  পাইনি কিন্তু ৪, ৫, ৬ পেয়েছি, শুধু ৩ টা আবার দিন। Handshake এ
                  দুই পক্ষ শুধু জানায় তারা এই ভাষাটা বোঝে, আসল ব্যবহার হয় পরে।
                </ListItem>
                <ListItem>
                  <strong>Timestamps:</strong> প্রতিটা Segment এ একটা সময়ের ছাপ
                  যায়, আর ওপাশ সেটা ফিরিয়ে দেয়। এতে পাঠানো পক্ষ খুব নিখুঁতভাবে
                  মাপতে পারে এক Round Trip এ কত সময় লাগছে, আর সেই মাপ থেকেই
                  ঠিক হয় কতক্ষণ অপেক্ষার পর আবার পাঠাতে হবে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই দরদামের সবচেয়ে জরুরি নিয়মটা হলো সময়। এই কথাগুলো শুধু SYN
                আর SYN-ACK এই বলা যায়। Connection একবার তৈরি হয়ে গেলে আর কিছু
                যোগ করা বা বদলানো যায় না। তাই মাঝপথের কোনো পুরনো Firewall যদি
                SYN থেকে অচেনা Option গুলো কেটে ফেলে দেয়, Connection ঠিকই তৈরি
                হয়, কিন্তু পুরো সময়টা খোঁড়া হয়ে চলে, আর কারণটা খুঁজে পাওয়া
                কঠিন হয়। এরকম রহস্যময় ধীরগতির তদন্তে অভিজ্ঞরা তাই প্রথমে SYN
                এর Option গুলো দেখেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "tcpdump এ একটা Handshake",
          code: `# tcpdump এ একটা Handshake দেখতে এরকম। সংখ্যাগুলো এই লেসনের গল্পের সাথে
# মিলিয়ে বসানো, আপনার যন্ত্রে IP, Port আর seq আলাদা হবে।
# কমান্ডটা নিচের Lab এ আছে, চালাতে sudo লাগে।

IP 192.168.1.20.51514 > 103.94.135.2.443: Flags [S], seq 1000, win 65535,
   options [mss 1460,nop,wscale 6,nop,nop,TS val 811 ecr 0,sackOK,eol], length 0

IP 103.94.135.2.443 > 192.168.1.20.51514: Flags [S.], seq 5000, ack 1001, win 65160,
   options [mss 1460,sackOK,TS val 4402 ecr 811,nop,wscale 7], length 0

IP 192.168.1.20.51514 > 103.94.135.2.443: Flags [.], ack 5001, win 2058,
   options [nop,nop,TS val 823 ecr 4402], length 0

# যা যা খেয়াল করবেন
#   [S]  [S.]  [.]      তিনটা Flag, ঠিক এই ক্রমে
#   length 0            তিনটার কোনোটায় Data নেই
#   mss, wscale, sackOK শুধু প্রথম দুই লাইনে, তৃতীয়টায় নেই
#   nop                 কিছু নয়, শুধু ফাঁকা জায়গা ভরার জন্য
#   ecr 811             Server ফোনের সময়ের ছাপটা ফিরিয়ে দিয়েছে`,
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "states",
      subHeader: { index: "006", title: "States" },
      title: <SectionTitle>খাতায় লেখা অবস্থা: LISTEN থেকে ESTABLISHED</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম সেকশনে বলেছি Connection মানে দুই প্রান্তের দুইটা খাতা।
                খাতার একটা ঘরে লেখা থাকে Connection টা এই মুহূর্তে কোন ধাপে
                আছে। এই ঘরটার নাম State। একটা Order এর কথা ভাবুন, তার অবস্থা
                হতে পারে গৃহীত, রান্না হচ্ছে, পথে আছে, পৌঁছে গেছে। TCP
                Connection এরও এরকম কয়েকটা অবস্থা আছে, আর Handshake এর সময়
                কাজে লাগে তার পাঁচটা।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HandshakeStatesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>CLOSED:</strong> কিছুই নেই। খাতাই খোলা হয়নি। এটা আসলে
                  কোনো অবস্থা নয়, অবস্থা না থাকার নাম।
                </ListItem>
                <ListItem>
                  <strong>LISTEN:</strong> শুধু Server এর। একটা Program Kernel
                  কে বলে রেখেছে, এই Port এ কেউ SYN পাঠালে আমাকে জানাবেন। OS
                  Networking লেসনের ভাষায়, ফ্ল্যাটে কেউ আছেন আর দরজায় কান
                  পেতে আছেন। একটা LISTEN এ থাকা Socket কোনো একজনের সাথে যুক্ত
                  নয়, সে সবার জন্য খোলা দরজা।
                </ListItem>
                <ListItem>
                  <strong>SYN_SENT:</strong> শুধু Client এর। SYN পাঠিয়েছি, উত্তরের
                  অপেক্ষায় আছি।
                </ListItem>
                <ListItem>
                  <strong>SYN_RCVD:</strong> শুধু Server এর। পুরো নাম SYN
                  Received। SYN পেয়েছি, SYN-ACK পাঠিয়েছি, তৃতীয় বার্তার
                  অপেক্ষায় আছি। এই অবস্থার Connection কে বলে Half-open, মানে
                  অর্ধেক খোলা। Linux এর টুলে এটা লেখা থাকে SYN-RECV।
                </ListItem>
                <ListItem>
                  <strong>ESTABLISHED:</strong> দুই পক্ষেরই। Handshake শেষ, Data
                  চলতে পারে। একটা সুস্থ Connection তার জীবনের প্রায় পুরোটা এই
                  অবস্থাতেই কাটায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই নামগুলো শুধু বইয়ের জিনিস নয়, আপনার যন্ত্র এই মুহূর্তে এগুলো
                দেখাতে পারে। netstat কমান্ডটা Kernel এর খাতার পাতাগুলো ছাপিয়ে
                দেয়। নিচে আমার যন্ত্রে এই লেসন লেখার সময় যা এসেছিল তা থেকে
                কয়েকটা লাইন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "netstat এ State দেখা",
          code: `# macOS আর Linux দুই জায়গাতেই চলে
netstat -an -p tcp | head -8

# Proto Recv-Q Send-Q  Local Address          Foreign Address        (state)
# tcp4       0      0  192.168.0.103.57229    172.66.147.243.443     ESTABLISHED
# tcp4       0      0  127.0.0.1.5432         *.*                    LISTEN
# tcp4       0      0  *.27121                *.*                    LISTEN
#
# প্রথম লাইনটা একটা চালু Connection, দুই পাশের IP আর Port সহ।
# পরের দুইটা LISTEN, তাদের Foreign Address ফাঁকা (*.*),
# কারণ তারা এখনো কারো সাথে যুক্ত নয়।
# 127.0.0.1.5432 মানে শুধু নিজের যন্ত্র থেকে শোনা হচ্ছে,
# *.27121 মানে সব ঠিকানা থেকে। এই তফাতটা Port & Socket লেসনের বিষয়।

# কোন State এ কয়টা Connection, এক নজরে
netstat -an -p tcp | awk 'NR>2 {print $6}' | sort | uniq -c
#   80 ESTABLISHED
#   22 LISTEN
#   25 TIME_WAIT
#    6 LAST_ACK
#    1 CLOSE_WAIT

# Linux এ আধুনিক টুল ss, একই তথ্য আরও দ্রুত
ss -tan            # সব TCP Connection, State সহ
ss -tan state syn-sent
ss -tan state syn-recv`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "SYN_SENT বা SYN_RCVD অনেকক্ষণ দেখা মানে কিছু একটা হারাচ্ছে",
          content: (
            <p>
              উপরের তালিকায় খেয়াল করুন, SYN_SENT আর SYN_RCVD একটাও নেই। সুস্থ
              যন্ত্রে এটাই স্বাভাবিক, কারণ এই দুই অবস্থা টেকে মাত্র কয়েক
              মিলিসেকেন্ড, চোখে পড়ার আগেই পেরিয়ে যায়। তাই এদের দেখতে পাওয়াটাই
              একটা সংকেত। আপনার App এর যন্ত্রে অনেক SYN_SENT জমে থাকলে বুঝবেন,
              আপনার App কোথাও সংযোগ করতে চাইছে কিন্তু উত্তর পাচ্ছে না, খুব
              সম্ভবত একটা Firewall মাঝখানে SYN ফেলে দিচ্ছে। Server এ অনেক
              SYN_RCVD জমে থাকলে বুঝবেন, SYN আসছে, SYN-ACK যাচ্ছে, কিন্তু শেষ
              ACK ফিরছে না। হয় ফেরার পথে সমস্যা, নয়তো কেউ ইচ্ছা করে নকল SYN
              পাঠাচ্ছে। TIME_WAIT, LAST_ACK আর CLOSE_WAIT বন্ধ হওয়ার সময়ের
              অবস্থা, ওগুলো Connection Close লেসনে চিনবেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "your-code",
      subHeader: { index: "007", title: "Your Code" },
      title: <SectionTitle>আপনার Code এর কোন লাইনে Handshake ঘটে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনি হয়তো বহুবার Server বানিয়েছেন আর fetch দিয়ে Request
                পাঠিয়েছেন, অথচ কখনো SYN বা ACK লেখেননি। কারণ এই কাজটা আপনার
                Code করে না, করে Kernel। OS Networking লেসনে দেখেছেন, Program
                Kernel কে অনুরোধ করে System Call দিয়ে, আর Network এর আসল কাজ
                Kernel এর ভেতরে হয়। Handshake এর বেলায় তিনটা System Call
                জড়িত।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>listen():</strong> Server Program এটা ডাকে একবার,
                  শুরুতে। Kernel ওই Port এর জন্য একটা LISTEN Socket বানায়। Node
                  এ আপনি যখন <code>server.listen(port)</code> লেখেন, ভেতরে এটাই
                  ঘটে। এরপর থেকে যত SYN আসে, তার উত্তরে SYN-ACK পাঠানো আর শেষ
                  ACK এর অপেক্ষা করা, পুরোটা Kernel নিজে করে। আপনার Program তখন
                  হয়তো অন্য কাজে ব্যস্ত, এমনকি আটকে থাকলেও Handshake ঠিকই শেষ
                  হয়।
                </ListItem>
                <ListItem>
                  <strong>accept():</strong> Handshake শেষ হলে Kernel তৈরি
                  Connection টা একটা লাইনে রেখে দেয়। Server Program accept()
                  ডেকে সেখান থেকে একটা তুলে নেয়, আর হাতে পায় একটা নতুন Socket,
                  যেটা শুধু ওই একজন Client এর জন্য। Node এ এটা আপনি দেখেন{" "}
                  <code>connection</code> Event হিসেবে, অথবা HTTP Server এ
                  সরাসরি একটা Request হিসেবে। মানে আপনার Code যখন প্রথম খবর পায়,
                  Handshake তখন অতীত।
                </ListItem>
                <ListItem>
                  <strong>connect():</strong> Client Program এটা ডাকে। Kernel
                  একটা Ephemeral Port বেছে নেয়, SYN পাঠায়, SYN-ACK এর অপেক্ষা
                  করে, ACK পাঠায়, তারপর আপনার Program কে জানায় হয়ে গেছে। না
                  হলে একটা Error ফেরত দেয়। <code>fetch</code>,{" "}
                  <code>axios</code>, Database Driver, সবাই ভেতরে এটাই ডাকে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের ছোট Program টা শুধু connect() করে আর ফলাফল ছাপায়। কোথায়
                যাবে আর কতক্ষণ অপেক্ষা করবে, সবটাই আসে Environment Variable
                থেকে, আর কোনোটা না থাকলে সে চুপচাপ একটা মান ধরে না নিয়ে
                পরিষ্কার বলে দিয়ে থেমে যায়। সামনের সেকশনগুলোতে এই Program টাই
                আপনার পরীক্ষার যন্ত্র।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "connect-check.mjs",
          code: `import net from "node:net";

const host = process.env.CHECK_HOST;
const port = Number(process.env.CHECK_PORT);
const timeoutMs = Number(process.env.CONNECT_TIMEOUT_MS);

if (!host || !Number.isInteger(port) || !Number.isInteger(timeoutMs)) {
  console.error("CHECK_HOST, CHECK_PORT, CONNECT_TIMEOUT_MS are required");
  process.exit(1);
}

const started = performance.now();
const ms = () => (performance.now() - started).toFixed(1) + " ms";

// এই এক লাইনে Kernel SYN পাঠায়। বাকি দুই ধাপও সে নিজেই সারে।
const socket = net.connect({ host, port });
socket.setTimeout(timeoutMs);

// SYN-ACK এসেছে, ACK গেছে। আমাদের দিকে State এখন ESTABLISHED।
socket.on("connect", () => {
  console.log("ESTABLISHED in", ms());
  console.log("local ", socket.localAddress + ":" + socket.localPort);
  console.log("remote", socket.remoteAddress + ":" + socket.remotePort);
  socket.end();
});

// কেউ হ্যাঁ বলেনি, কেউ না ও বলেনি। আমরা নিজেই হাল ছাড়লাম।
socket.on("timeout", () => {
  console.log("NO ANSWER after", ms(), "(SYN dropped somewhere)");
  socket.destroy();
});

// কেউ সক্রিয়ভাবে না বলেছে, যেমন ECONNREFUSED।
socket.on("error", (err) => {
  console.log(err.code, "after", ms());
});`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "চালিয়ে দেখুন",
          code: `CHECK_HOST=example.com CHECK_PORT=443 CONNECT_TIMEOUT_MS=3000 node connect-check.mjs
# ESTABLISHED in 12.0 ms
# local  192.168.0.103:57229
# remote 172.66.147.243:443

# local এর Port টা প্রতিবার আলাদা হবে। ওটাই Kernel এর বেছে নেওয়া
# Ephemeral Port, ঠিক যেমন গল্পের ফোনের 51514।
# 12 ms এর মধ্যে DNS খোঁজার সময়ও আছে, শুধু Handshake নয়।

# কোনো Variable না দিলে সে অনুমান করে না, থেমে যায়
node connect-check.mjs
# CHECK_HOST, CHECK_PORT, CONNECT_TIMEOUT_MS are required`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Port খোলা মানে App সুস্থ, এমন নয়",
          content: (
            <p>
              Handshake যেহেতু Kernel সারে, একটা মজার আর বিপজ্জনক ব্যাপার ঘটে।
              আপনার App হয়তো একটা অসীম Loop এ আটকে আছে, কোনো Request এরই উত্তর
              দিচ্ছে না। তবুও বাইরে থেকে কেউ সংযোগ করলে Handshake নিখুঁতভাবে
              শেষ হবে, কারণ Kernel তো ঠিকই আছে। তাই Port খোলা আছে কি না, এই
              পরীক্ষা শুধু বলে একটা Program LISTEN ডেকেছিল আর এখনো বেঁচে আছে।
              App কাজ করছে কি না জানতে হলে তাকে একটা আসল প্রশ্ন করে উত্তর
              দেখতে হয়। এই কারণেই Load Balancer এর Health Check দুই রকম হয়,
              TCP Check যা শুধু Handshake করে দেখে, আর HTTP Check যা একটা URL
              এ Request পাঠিয়ে উত্তর মিলিয়ে দেখে। দ্বিতীয়টাই বেশি ভরসার।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "cost",
      subHeader: { index: "008", title: "The Cost" },
      title: <SectionTitle>Handshake এর দাম: এক Round Trip</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তিনটা ছোট বার্তা, Data ও নেই, তাহলে দাম আর কত? Byte এর হিসাবে
                সত্যিই প্রায় কিছুই নয়। দামটা সময়ে। Packet Latency Bandwidth
                লেসনে শিখেছেন, একটা বার্তা গিয়ে তার উত্তর ফিরে আসতে যে সময়
                লাগে তাকে বলে Round Trip Time, ছোট করে RTT। Handshake এ ফোনকে
                SYN পাঠিয়ে SYN-ACK এর জন্য অপেক্ষা করতেই হয়, তার আগে সে একটা
                Byte ও পাঠাতে পারে না। তাই প্রতিটা নতুন TCP Connection এর
                শুরুতে পুরো এক RTT খরচ হয়, কিছু কাজ হওয়ার আগেই। তৃতীয় বার্তাটা
                বাড়তি সময় নেয় না, কারণ ফোন ACK পাঠিয়েই পেছন পেছন Data পাঠিয়ে
                দিতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                এক RTT শুনতে কম, কিন্তু সংখ্যাটা দূরত্বের উপর নির্ভর করে, আপনার
                Internet এর গতির উপর নয়। একই শহরে এটা কয়েক মিলিসেকেন্ড। ঢাকা
                থেকে আমেরিকার একটা Server এ এটা সিকি সেকেন্ড পর্যন্ত হতে পারে।
                আর HTTPS এ Handshake এখানেই শেষ নয়। TCP র উপরে TLS নামে আরেকটা
                স্তর আছে, যা সংযোগটাকে গোপন রাখে, আর তার নিজের আলাদা Handshake
                আছে, যাতে আরও অন্তত এক RTT যায়। TLS পরের Module এর বিষয়, এখন
                শুধু জানুন সে TCP Handshake এর পরে বসে আর দামটা যোগ হয়।
              </ContentParagraph>
              <ContentParagraph>
                এই সময়গুলো আন্দাজ করার দরকার নেই, curl মেপে দিতে পারে। নিচের
                কমান্ডে curl কে বলা হচ্ছে পাতাটা ফেলে দিতে আর শুধু সময়গুলো
                ছাপাতে। আমার যন্ত্রে পরপর দুইবার চালিয়ে যা এসেছিল তা ই রাখলাম।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "curl দিয়ে Handshake এর সময় মাপা",
          code: `curl -o /dev/null -s -w "dns %{time_namelookup}  connect %{time_connect}  tls %{time_appconnect}  first-byte %{time_starttransfer}  total %{time_total}\\n" https://example.com

# প্রথমবার
# dns 0.057062  connect 0.061109  tls 0.071180  first-byte 0.079366  total 0.079480
# দ্বিতীয়বার
# dns 0.002351  connect 0.006448  tls 0.015217  first-byte 0.022460  total 0.022526

# প্রতিটা সংখ্যা শুরু থেকে মোট কত সেকেন্ড পেরিয়েছে, তাই বিয়োগ করে পড়তে হয়।
# দ্বিতীয় লাইনটা ধরুন:
#   dns      0.0024   নাম থেকে IP (Cache থেকে এসেছে, তাই এত কম)
#   connect  0.0064   এখানে TCP Handshake শেষ
#            0.0064 - 0.0024 = 0.0040 সেকেন্ড = 4 ms, এটাই TCP Handshake
#   tls      0.0152   এখানে TLS Handshake শেষ, লেগেছে আরও 9 ms
#   first-byte 0.0225 এখানে উত্তরের প্রথম Byte এলো

# এবার একই Server কে ping করে RTT দেখুন
ping -c 3 example.com
# round-trip min/avg/max/stddev = 3.577/3.963/4.451/0.364 ms

# RTT 4 ms, আর TCP Handshake এও লেগেছে 4 ms। হুবহু এক Round Trip।
# প্রথমবারে DNS এ 57 ms গিয়েছিল, কারণ তখন নামটা Cache এ ছিল না।
# ওটা DNS Module এর গল্প, Handshake এর নয়।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আমার যন্ত্র থেকে example.com খুব কাছে, কারণ সেটা একটা CDN এর পেছনে
              আর তার একটা Server আমার শহরেই আছে। তাই ৪ মিলিসেকেন্ড। দূরত্ব বাড়লে
              কী হয়, আর একই Connection বারবার ব্যবহার করলে কতটা বাঁচে, নিচের
              Lab এ নিজে বদলে দেখুন।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HandshakeCostLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এই এক হিসাব থেকে চারটা পরিচিত পরামর্শ বেরিয়ে আসে",
          content: (
            <p>
              Lab এর দুইটা সারির তফাতটা বুঝলে Performance নিয়ে শোনা অনেক
              পরামর্শের কারণ নিজেই বলে দিতে পারবেন। Server ব্যবহারকারীর কাছের
              Region এ রাখুন, কারণ RTT কমলে Handshake এর দাম কমে। CDN ব্যবহার
              করুন, কারণ তখন পর্যটকের Handshake হয় তাঁর শহরের একটা Server এর
              সাথে, সমুদ্রের ওপারের সাথে নয়। Keep-Alive চালু রাখুন, কারণ তাতে
              পরের Request গুলো পুরনো Connection দিয়েই যায়। আর Database এর
              জন্য Connection Pool ব্যবহার করুন, কারণ প্রতিটা Query র আগে
              নতুন করে হাত মেলানো মানে প্রতিটা Query তে একটা বাড়তি Round Trip।
              শেষ দুইটা নিয়ে একটু পরেই আলাদা সেকশন আছে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "failures",
      subHeader: { index: "009", title: "Three Failures" },
      title: <SectionTitle>Connection হলো না: তিনটা আলাদা ছবি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার লেসনের শুরুর সেই রাত দুইটার প্রশ্নে ফিরি। এই সেকশনটা পুরো
                লেসনের সবচেয়ে কাজের অংশ, কারণ এটা আপনি প্রায় প্রতি সপ্তাহে
                ব্যবহার করবেন। ভাবুন আপনি একটা বাড়িতে গিয়ে কলিং বেল টিপলেন।
                তিন রকম ঘটনা ঘটতে পারে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>দারোয়ান সাথে সাথে বললেন, ওই ফ্ল্যাটে কেউ থাকেন
                  না।</strong>{" "}
                  আপনি ঠিক বিল্ডিং এ এসেছেন, বিল্ডিং এ লোক আছে, শুধু ওই ফ্ল্যাটটা
                  ফাঁকা। এটা Connection refused।
                </ListItem>
                <ListItem>
                  <strong>বেল টিপলেন, কোনো সাড়া নেই। আবার টিপলেন। দাঁড়িয়েই
                  রইলেন।</strong>{" "}
                  হয়তো বিল্ডিং টাই ফাঁকা, হয়তো গেটে এমন একজন আছেন যাঁকে বলা
                  হয়েছে অচেনা কাউকে উত্তরই না দিতে। আপনি জানেন না কোনটা। এটা
                  Connection timed out।
                </ListItem>
                <ListItem>
                  <strong>রাস্তার মোড়েই একজন বললেন, ওই ঠিকানায় যাওয়ার কোনো
                  রাস্তা নেই।</strong>{" "}
                  আপনি বিল্ডিং পর্যন্ত পৌঁছাতেই পারেননি। এটা No route to host বা
                  Network is unreachable।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তিনটাতেই আপনি ভেতরে ঢুকতে পারেননি, কিন্তু তিনটায় আপনি আলাদা
                তথ্য পেয়েছেন। TCP তে ঠিক এটাই ঘটে, আর তফাতটা তৈরি হয় আপনার SYN
                এর উত্তরে কী ফিরে আসে তা দিয়ে। নিচের Lab এ চারটা অবস্থা বেছে
                বেছে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ConnectOutcomeLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>Connection refused এর পেছনের যন্ত্রটা।</strong> SYN
                একটা চালু যন্ত্রে পৌঁছেছে, কিন্তু ওই Port এ কোনো LISTEN Socket
                নেই। তখন Kernel নিজেই একটা RST পাঠিয়ে দেয়। কোনো Program এতে
                জড়িত নয়, কারণ Program টাই তো নেই। RST পাওয়া মাত্র আপনার Kernel
                চেষ্টা থামিয়ে আপনার Program কে Error দেয়। Node এ এই Error এর
                Code হলো <code>ECONNREFUSED</code>, অন্য ভাষাতেও নামটা প্রায়
                একই, কারণ নামটা Kernel এর দেওয়া। সবচেয়ে বড় চিহ্ন হলো গতি, না
                টা আসে চোখের পলকে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Timeout এর পেছনের যন্ত্রটা।</strong> SYN এর কোনো উত্তরই
                আসেনি। এর পেছনে সবচেয়ে সাধারণ কারণ একটা Firewall। Firewall হলো
                একটা পাহারাদার, যে নিয়মের তালিকা দেখে ঠিক করে কোন Packet ঢুকবে
                আর কোনটা নয়। না করার তার দুইটা ধরন আছে। একটার নাম REJECT, যেখানে
                সে ভদ্রভাবে একটা না পাঠিয়ে দেয়। অন্যটার নাম DROP, যেখানে সে
                Packet টা নীরবে ফেলে দেয়, কোনো উত্তরই দেয় না। Cloud এর Security
                Group আর বেশিরভাগ Firewall DROP ই করে, কারণ উত্তর না দিলে
                আক্রমণকারী জানতেই পারে না ওখানে কিছু আছে কি না। ফলটা হলো আপনার
                Kernel অপেক্ষা করে, আবার SYN পাঠায়, আবার অপেক্ষা করে। কতবার আর
                কতক্ষণ, সেটা পরের সেকশনে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Unreachable এর পেছনের যন্ত্রটা।</strong> এখানে না টা
                আসে পথের কোনো Router থেকে, অথবা আপনার নিজের Kernel থেকে। পথের
                Router যদি দেখে গন্তব্যে যাওয়ার কোনো রাস্তা তার জানা নেই, সে
                ICMP নামের একটা আলাদা Protocol এ একটা বার্তা ফেরত পাঠায়,
                Destination Unreachable। ICMP হলো Network এর নিজের খবরাখবরের
                ভাষা, ping ও এটাই ব্যবহার করে। আর আপনার নিজের যন্ত্রের যদি কোনো
                Gateway ই না থাকে, যেমন Wi-Fi বন্ধ, তাহলে Kernel SYN পাঠানোর
                আগেই বলে দেয় Network is unreachable।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "তিনটা ছবি, নিজের Terminal এ",
          code: `# nc (netcat) একটা ছোট টুল যা শুধু একটা TCP Connection খোলার চেষ্টা করে।
# -v মানে কী ঘটল বলুন, -z মানে Connection হলেই বন্ধ করে দিন, কিছু পাঠাবেন না।

# ১. সব ঠিক: Port 443 এ একটা Web Server শুনছে
nc -vz example.com 443
# Connection to example.com port 443 [tcp/https] succeeded!

# ২. Refused: নিজের যন্ত্র চালু, কিন্তু Port 9 এ কেউ শুনছে না
nc -vz 127.0.0.1 9
# nc: connectx to 127.0.0.1 port 9 (tcp) failed: Connection refused
# উত্তরটা এসেছে সাথে সাথে।

# ৩. Timeout: Port 81 এর SYN পথে কোথাও ফেলে দেওয়া হচ্ছে
#    macOS এ অপেক্ষার সীমা -G দিয়ে, Linux এ -w দিয়ে
nc -vz -G 3 example.com 81        # macOS
nc -vz -w 3 example.com 81        # Linux
# nc: connectx to example.com port 81 (tcp) failed: Operation timed out
# এবার পুরো ৩ সেকেন্ড ঝুলে থেকে তারপর ব্যর্থ।
# (example.com এর দুইটা IP থাকায় আমার যন্ত্রে লাইনটা দুইবার এসেছিল,
#  মোট ৬ সেকেন্ড। nc একটা IP তে না পেরে পরেরটায় চেষ্টা করেছে।)

# একই তিনটা ছবি curl এর ভাষায়
curl -sS -o /dev/null http://127.0.0.1:9/
# curl: (7) Failed to connect to 127.0.0.1 port 9 after 0 ms: Couldn't connect to server
curl -sS -o /dev/null --connect-timeout 3 http://example.com:81/
# curl: (28) Failed to connect to example.com port 81 after 3005 ms: Timeout was reached

# আর আগের সেকশনের Program এ
CHECK_HOST=127.0.0.1 CHECK_PORT=9 CONNECT_TIMEOUT_MS=3000 node connect-check.mjs
# ECONNREFUSED after 1.7 ms
CHECK_HOST=example.com CHECK_PORT=81 CONNECT_TIMEOUT_MS=3000 node connect-check.mjs
# NO ANSWER after 3006.6 ms (SYN dropped somewhere)`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "মনে রাখার নিয়ম: দ্রুত না মানে কেউ আছে, ধীর না মানে নীরবতা",
          content: (
            <p>
              উপরের output এ সময়গুলো দেখুন, 1.7 মিলিসেকেন্ড আর 3006
              মিলিসেকেন্ড। এই একটা তফাত দিয়েই বেশিরভাগ ক্ষেত্রে রোগ ধরা যায়।
              Refused এলে Network নিয়ে আর ভাবার দরকার নেই, পথ খোলা, যন্ত্র
              চালু। সোজা Server এ ঢুকে দেখুন App চলছে কি না আর কোন ঠিকানার কোন
              Port এ শুনছে। Timeout এলে উল্টো, App এর দিকে তাকিয়ে লাভ নেই,
              কারণ আপনার SYN তার কাছে পৌঁছায়ইনি। দেখুন Security Group,
              Firewall, IP ঠিক আছে কি না, যন্ত্রটা চালু কি না। একটা ব্যতিক্রম
              মনে রাখবেন। কিছু Firewall কে REJECT করতে বলা থাকে, তখন সে নিজেই
              একটা RST বানিয়ে পাঠায়, আর আপনি refused দেখেন যদিও পেছনে App
              ঠিকই চলছে। তাই refused দেখে App এ কিছু না পেলে একবার Firewall এর
              নিয়মগুলোও দেখে নিন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "retries",
      subHeader: { index: "010", title: "Retries and Timeouts" },
      title: <SectionTitle>উত্তর না এলে Kernel কতক্ষণ অপেক্ষা করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                SYN পাঠিয়ে উত্তর না পেলে Kernel প্রথমেই ধরে নেয় না যে ওপাশে
                কেউ নেই। TCP র পুরো দর্শনটাই হলো, Packet হারাতে পারে, তাই আবার চেষ্টা করতে হবে। SYN এর বেলাতেও একই। সে কিছুক্ষণ অপেক্ষা করে আবার
                SYN পাঠায়। আবার উত্তর না এলে আরও বেশিক্ষণ অপেক্ষা করে আবার
                পাঠায়। প্রতিবার অপেক্ষার সময় দ্বিগুণ হয়। এই কৌশলের নাম
                Exponential Backoff। কারণটা ভদ্রতা। যদি ওপাশের যন্ত্র বা পথটা
                চাপে থাকে বলেই উত্তর না আসে, তাহলে ঘন ঘন আবার পাঠালে চাপ আরও
                বাড়বে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Linux এ:</strong> প্রথম অপেক্ষা ১ সেকেন্ড, তারপর ২, ৪,
                  ৮, ১৬, ৩২। কতবার আবার পাঠাবে তা ঠিক করে{" "}
                  <code>net.ipv4.tcp_syn_retries</code>, যার সাধারণ মান ৬। সব
                  যোগ করলে প্রায় ১২৭ সেকেন্ড, মানে দুই মিনিটের একটু বেশি,
                  তারপর Kernel হাল ছেড়ে <code>ETIMEDOUT</code> দেয়।
                </ListItem>
                <ListItem>
                  <strong>macOS এ:</strong> মোট সীমাটা একটা সংখ্যায় লেখা,{" "}
                  <code>net.inet.tcp.keepinit</code>। আমার যন্ত্রে এটা 75000,
                  মানে ৭৫ সেকেন্ড।
                </ListItem>
                <ListItem>
                  <strong>Server এর দিকেও একই নিয়ম:</strong> SYN-ACK পাঠিয়ে
                  শেষ ACK না পেলে Server ও SYN-ACK আবার পাঠায়, কয়েকবার, তারপর
                  অর্ধেক খোলা Connection টা খাতা থেকে মুছে ফেলে। Linux এ এটা
                  ঠিক করে <code>net.ipv4.tcp_synack_retries</code>।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার ভাবুন এর ফল কী। Island Tours এর Backend একটা Payment
                সেবার সাথে কথা বলে। একদিন সেই সেবার সামনের Firewall এ একটা
                নিয়ম বদলে গেল, আর আপনার SYN গুলো নীরবে হারাতে লাগল। আপনার Code
                এ যদি কোনো Timeout বসানো না থাকে, তাহলে প্রতিটা বুকিং Request
                দুই মিনিট ঝুলে থাকবে, তারপর ব্যর্থ হবে। এই দুই মিনিটে পর্যটক
                পাতা বন্ধ করে চলে গেছেন, আর আপনার Server এ শত শত ঝুলন্ত Request
                জমে গিয়ে সুস্থ অংশগুলোকেও আটকে দিয়েছে। একটা বাইরের সেবার
                সমস্যা আপনার পুরো সাইট নামিয়ে দিল।
              </ContentParagraph>
              <ContentParagraph>
                তাই নিয়মটা সোজা। আপনার Code যেখানেই বাইরে কোথাও সংযোগ করে,
                সেখানে নিজে একটা Connect Timeout বসান, আর সেটা ছোট রাখুন,
                সাধারণত কয়েক সেকেন্ড। সুস্থ অবস্থায় Handshake শেষ হয়
                মিলিসেকেন্ডে। তিন সেকেন্ডেও না হলে তিরিশ সেকেন্ডেও হবে না।
                আগের Program এ <code>socket.setTimeout</code> ঠিক এই কাজটাই
                করছিল, আর মানটা এসেছিল Environment Variable থেকে, কারণ এই
                সংখ্যা পরিবেশ ভেদে বদলাতে হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "অপেক্ষার সীমাগুলো দেখা",
          code: `# macOS: নতুন Connection এর জন্য মোট কতক্ষণ চেষ্টা, মিলিসেকেন্ডে
sysctl net.inet.tcp.keepinit
# net.inet.tcp.keepinit: 75000

# Linux: SYN কতবার আবার পাঠানো হবে, আর SYN-ACK কতবার
sysctl net.ipv4.tcp_syn_retries net.ipv4.tcp_synack_retries

# curl এ Connect Timeout আলাদা করে বসানো যায়
#   --connect-timeout  শুধু সংযোগ তৈরির সীমা (DNS, TCP, TLS)
#   --max-time         পুরো Request এর সীমা
curl --connect-timeout 3 --max-time 10 -sS -o /dev/null https://example.com`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Connect Timeout আর Read Timeout দুইটা আলাদা জিনিস",
          content: (
            <p>
              প্রায় সব HTTP Client আর Database Driver এ অন্তত দুইটা আলাদা
              Timeout থাকে, আর নতুনরা প্রায়ই একটাকে আরেকটা ভাবেন। Connect
              Timeout হলো Handshake শেষ হওয়ার জন্য কতক্ষণ অপেক্ষা করব। এটা ছোট
              রাখা নিরাপদ, কারণ Handshake এ Server এর কোনো ভাবার কাজ নেই। Read
              Timeout, যাকে কোথাও Response Timeout বা Socket Timeout বলে, হলো
              সংযোগ হওয়ার পর উত্তরের জন্য কতক্ষণ অপেক্ষা করব। এটা কাজ ভেদে বড়
              হতে পারে, কারণ একটা ভারী Report বানাতে Server এর সত্যিই সময়
              লাগে। দুইটাকে এক সংখ্যায় বসালে হয় সুস্থ ধীর কাজ কেটে যায়, নয়তো
              মরা Server এর জন্য অকারণে অনেকক্ষণ অপেক্ষা হয়। Library টার
              কাগজপত্রে দুইটার নাম আলাদা করে খুঁজে নিন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "queues",
      subHeader: { index: "011", title: "Two Queues" },
      title: <SectionTitle>Server এর ভেতরে দুইটা অপেক্ষার লাইন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা জনপ্রিয় রেস্তোরাঁর কথা ভাবুন। দরজায় একজন আছেন যিনি নাম
                লিখে নেন। কেউ ফোন করে বললেন আসছি, তাঁর নাম একটা তালিকায় উঠল,
                এটা আসার কথা দেওয়া মানুষদের তালিকা। তিনি সত্যিই এসে পৌঁছালে
                তাঁর নাম দ্বিতীয় তালিকায় যায়, যাঁরা এসে গেছেন আর টেবিলের
                অপেক্ষায় দাঁড়িয়ে আছেন। তারপর ওয়েটার একজন একজন করে ডেকে টেবিলে
                বসান। Server এর Kernel ঠিক এই দুই তালিকা রাখে, প্রতিটা LISTEN
                Socket এর জন্য আলাদা করে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TwoQueuesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>SYN Queue:</strong> এখানে থাকে SYN_RCVD অবস্থার
                  অর্ধেক খোলা Connection গুলো। স্বাভাবিক সময়ে একটা Connection
                  এখানে থাকে এক RTT, মানে কয়েক মিলিসেকেন্ড। Queue মানে লাইন,
                  সারি।
                </ListItem>
                <ListItem>
                  <strong>Accept Queue:</strong> এখানে থাকে পুরো তৈরি হওয়া,
                  ESTABLISHED অবস্থার Connection, যেগুলো এখনো Application তুলে
                  নেয়নি। স্বাভাবিক সময়ে এটা প্রায় ফাঁকা থাকে, কারণ সুস্থ App
                  মুহূর্তের মধ্যে accept() ডাকে।
                </ListItem>
                <ListItem>
                  <strong>Backlog:</strong> Accept Queue তে সর্বোচ্চ কয়টা
                  Connection অপেক্ষা করতে পারবে, সেই সীমা। এটা আপনি listen()
                  ডাকার সময় বলে দেন। Node এ{" "}
                  <code>server.listen(port, host, backlog)</code>, আর না বললে
                  Node নিজে 511 চায়। কিন্তু Kernel এর নিজেরও একটা ছাদ আছে, আর
                  দুইটার মধ্যে ছোটটাই কার্যকর হয়। Linux এ ছাদটা{" "}
                  <code>net.core.somaxconn</code>, macOS এ{" "}
                  <code>kern.ipc.somaxconn</code>।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার আসল প্রশ্ন, লাইন ভরে গেলে কী হয়। আপনার App যদি কোনো ভারী
                কাজে আটকে থাকে আর accept() ডাকতে না পারে, Accept Queue ভরতে
                থাকে। ভরে গেলে Kernel নতুন Connection এর শেষ ধাপটা আর সম্পূর্ণ
                করে না, নতুন SYN ও ফেলে দিতে শুরু করে। Client এর দিক থেকে এটা
                দেখায় ঠিক Firewall এর মতো, সংযোগ খুব ধীর হয়, তারপর Timeout।
                Server এর CPU হয়তো তখন মাত্র কুড়ি শতাংশ ব্যস্ত, Memory ফাঁকা,
                অথচ পর্যটকরা ঢুকতে পারছেন না। এই ধাঁধাটা অনেক অভিজ্ঞ মানুষকেও
                ঘণ্টার পর ঘণ্টা ভুগিয়েছে, কারণ Application এর Log এ কিছুই লেখা
                থাকে না। App তো ওই Connection গুলো কখনো দেখেইনি।
              </ContentParagraph>
              <ContentParagraph>
                ধরার উপায় হলো Kernel কে সরাসরি জিজ্ঞেস করা। সে গুনে রাখে লাইন
                কতবার উপচে পড়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "লাইন দুইটা নিজের চোখে",
          code: `# macOS: প্রতিটা LISTEN Socket এর লাইনের অবস্থা
netstat -Lan | head -6
# Current listen queue sizes (qlen/incqlen/maxqlen)
# Listen         Local Address
# 0/0/128        127.0.0.1.5432
# 0/0/128        *.27121
#
# তিনটা সংখ্যার মানে:
#   qlen     Accept Queue তে এখন কয়টা তৈরি Connection অপেক্ষায়
#   incqlen  কয়টা অর্ধেক খোলা Connection (SYN Queue)
#   maxqlen  সীমা, মানে Backlog
# সুস্থ অবস্থায় প্রথম দুইটা শূন্য।

# Kernel এর ছাদ
sysctl kern.ipc.somaxconn              # macOS, আমার যন্ত্রে 128
sysctl net.core.somaxconn              # Linux

# Linux: LISTEN Socket গুলো, লাইন সহ
ss -ltn
# State   Recv-Q  Send-Q  Local Address:Port
# LISTEN  0       511     0.0.0.0:3000
#   LISTEN এর বেলায় Recv-Q = Accept Queue তে এখন কয়টা
#                   Send-Q = সীমা (Backlog)

# Linux: লাইন কতবার উপচে পড়েছে
netstat -s | grep -i -E "listen|SYNs to LISTEN"
#   ... times the listen queue of a socket overflowed
#   ... SYNs to LISTEN sockets dropped
# এই সংখ্যা দুইটা বাড়তে থাকলে নিশ্চিত, Accept Queue ভরে যাচ্ছে।`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Backlog বাড়ানো সমাধান নয়, সময় কেনা",
          content: (
            <p>
              লাইন উপচে পড়তে দেখলে প্রথম ঝোঁক হয় সীমাটা বাড়িয়ে দেওয়া। হঠাৎ
              আসা একটা ভিড় সামলাতে এটা সত্যিই কাজে লাগে, আর Nginx বা Node এর
              সামনে ব্যস্ত Server এ somaxconn বাড়ানো একটা সাধারণ Tuning। কিন্তু
              লাইন লম্বা করলে রেস্তোরাঁর রান্না দ্রুত হয় না। App যদি স্থায়ীভাবে
              যত Connection আসছে তার চেয়ে ধীরে তুলে নেয়, বড় লাইন শুধু ব্যর্থ
              হওয়ার আগে অপেক্ষাটা লম্বা করে। আসল প্রশ্ন সব সময় একটাই, App
              accept() ডাকতে পারছে না কেন। Node এ এর সবচেয়ে সাধারণ কারণ Event
              Loop আটকে থাকা, মানে একটা লম্বা Synchronous কাজ বাকি সব কিছুকে
              থামিয়ে রেখেছে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "security",
      subHeader: { index: "012", title: "Security" },
      title: <SectionTitle>SYN Flood, SYN Cookie আর অনুমান করা যায় না এমন সংখ্যা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের সেকশনে দেখলেন, প্রতিটা SYN এর জন্য Server কিছু Memory রাখে
                আর শেষ ACK এর অপেক্ষা করে। এই ভদ্রতাটাকেই অস্ত্র বানানো যায়।
                রেস্তোরাঁর উদাহরণে ভাবুন, কেউ একজন হাজারটা ভুয়া নামে ফোন করে
                বলল আসছি। দরজার তালিকা ভরে গেল। কেউ আসল না। এদিকে সত্যিকারের
                অতিথি ফোন করলে শোনেন, দুঃখিত, তালিকায় আর জায়গা নেই।
              </ContentParagraph>
              <ContentParagraph>
                এই আক্রমণের নাম <strong>SYN Flood</strong>। আক্রমণকারী সেকেন্ডে
                হাজার হাজার SYN পাঠায়, আর প্রতিটায় Source IP হিসেবে একটা নকল
                ঠিকানা বসায়। নকল ঠিকানা বসানোকে বলে Spoofing। Server প্রতিটার
                জন্য SYN Queue তে জায়গা রাখে আর SYN-ACK পাঠায় সেই নকল
                ঠিকানায়। সেখানে হয় কেউ নেই, নয়তো যে আছে সে এই Connection চেনে
                না। শেষ ACK কখনো আসে না। SYN Queue ভরে যায় অর্ধেক খোলা
                Connection এ, আর আসল পর্যটকের SYN ফেলে দেওয়া হয়। আক্রমণকারীর
                খরচ প্রায় শূন্য, কারণ তাকে কিছুই মনে রাখতে হয় না, শুধু ছোট
                ছোট Packet ছুড়তে হয়। এটা DDoS আক্রমণের সবচেয়ে পুরনো আর
                পরিচিত রূপগুলোর একটা। UDP লেসনে দেখেছিলেন, নকল ঠিকানা দিয়ে
                পাঠানো সম্ভব কারণ প্রথম Packet এ কেউ ঠিকানা যাচাই করে না। SYN
                ও একটা প্রথম Packet।
              </ContentParagraph>
              <ContentParagraph>
                প্রতিরোধটা চমৎকার একটা বুদ্ধি, নাম <strong>SYN Cookie</strong>।
                সমস্যাটা ছিল, Server কে SYN পেয়েই কিছু মনে রাখতে হচ্ছে। সমাধান
                হলো, কিছুই মনে না রাখা। Server SYN পেয়ে খাতায় কিছু লেখে না।
                বদলে সে SYN-ACK এ নিজের ISN হিসেবে এমন একটা সংখ্যা পাঠায় যা
                এলোমেলো নয়, বরং Client এর IP, Port, সময় আর Server এর একটা
                গোপন চাবি দিয়ে হিসাব করে বানানো। তারপর সে ব্যাপারটা ভুলে যায়।
                সত্যিকারের Client শেষ ACK এ ওই সংখ্যার পরেরটা ফিরিয়ে দেয়।
                Server তখন একই হিসাবটা আবার করে মিলিয়ে দেখে। মিললে সে বোঝে
                এই Client সত্যিই তার SYN-ACK পেয়েছিল, মানে ঠিকানাটা আসল, আর
                তখনই প্রথমবার খাতায় নাম তোলে। নকল ঠিকানার আক্রমণকারী কখনো
                SYN-ACK পায়ই না, তাই ঠিক সংখ্যাটা ফিরিয়ে দিতে পারে না। রেস্তোরাঁর
                ভাষায়, তালিকায় নাম না লিখে একটা টোকেন দিয়ে দেওয়া, যা নকল করা
                যায় না, আর যে সত্যিই টোকেন হাতে এসে দাঁড়ায় শুধু তাকেই ভেতরে
                নেওয়া।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Linux এ এটা আগে থেকেই আছে:</strong>{" "}
                  <code>net.ipv4.tcp_syncookies</code> এর সাধারণ মান 1, যার মানে
                  SYN Queue ভরে গেলে তবেই Cookie চালু হয়। সব সময় চালু রাখা হয়
                  না, কারণ Cookie র ছোট্ট জায়গায় Handshake এর সব Option ধরে
                  না, তাই কিছু সুবিধা হারাতে হয়।
                </ListItem>
                <ListItem>
                  <strong>বড় আক্রমণ Server পর্যন্ত আসতে দেওয়াই উচিত
                  নয়:</strong>{" "}
                  Cloudflare DNS লেসনে Proxy চালু রাখার কথা পড়েছেন। Proxy চালু
                  থাকলে আক্রমণকারীর SYN গুলো পৌঁছায় Cloudflare এর বিশাল
                  Network এ, আপনার ছোট Server এ নয়। Cloud এর Load Balancer ও
                  একই ঢাল দেয়। এই কারণেই আসল Server এর IP গোপন রাখতে বলা হয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                <strong>এবার ISN এর এলোমেলো হওয়ার কারণ।</strong> তৃতীয় সেকশনে
                বলেছিলাম শুরুর সংখ্যা অনুমান করা যায় না এমন হতে হয়। কেন, সেটা
                এখন বোঝা সহজ। TCP একটা Segment কে আসল বলে মেনে নেয় যদি তার IP,
                Port আর Sequence Number ঠিক জায়গায় পড়ে। আক্রমণকারী IP আর Port
                নকল করতে পারে। বাকি থাকে শুধু সংখ্যাটা। আগের দিনে কিছু System এ
                ISN একটা ঘড়ির মতো নিয়ম মেনে বাড়ত, তাই একটা Connection দেখে
                পরেরটার সংখ্যা আন্দাজ করা যেত। তখন আক্রমণকারী SYN-ACK না
                দেখেই, শুধু আন্দাজ করা সংখ্যা দিয়ে তৃতীয় ACK পাঠিয়ে অন্য কারো
                নামে একটা Connection খুলে ফেলতে পারত, অথবা চালু Connection এর
                ভেতরে নিজের Data ঢুকিয়ে দিতে পারত। আজকের Kernel প্রতিটা
                Connection এর ISN বানায় একটা গোপন চাবি মিশিয়ে, যাতে বাইরে থেকে
                পরের সংখ্যা অনুমান করা না যায়। খেয়াল করুন, SYN Cookie আর
                এলোমেলো ISN আসলে একই ভাবনার দুই রূপ। শুরুর সংখ্যাটা শুধু গোনার
                শুরু নয়, এটা একটা ছোট গোপন কথাও, যা ফিরিয়ে বলতে পারাই প্রমাণ
                যে আপনি সত্যিই ওপাশে আছেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "এই অংশটা বোঝার জন্য, কারো উপর চালানোর জন্য নয়",
          content: (
            <p>
              SYN Flood কীভাবে কাজ করে তা জানা দরকার যাতে আপনি নিজের Server কে
              রক্ষা করতে পারেন আর Dashboard এ half-open connections বা SYN
              backlog এর মতো শব্দ দেখলে বুঝতে পারেন কী ঘটছে। অন্য কারো Server
              এ এরকম Traffic পাঠানো প্রায় সব দেশে অপরাধ, আর Cloud সেবাদাতারা
              এটা ধরা পড়লে Account বন্ধ করে দেয়। নিজের Server এর সহনশীলতা
              পরীক্ষা করতে চাইলেও সেবাদাতার নিয়ম আগে পড়ে নিন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "reuse",
      subHeader: { index: "013", title: "Reuse" },
      title: <SectionTitle>সবচেয়ে সস্তা Handshake হলো যেটা করতেই হয় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Handshake কে আর ছোট করা কঠিন, তিন ধাপের কম সম্ভব নয় তা তো
                দেখলেনই। তাই বাস্তবে গতি বাড়ানোর আসল কৌশল হলো Handshake কম
                বার করা। একবার হাত মেলানো হয়ে গেলে সেই Connection টাকে বাঁচিয়ে
                রাখা আর পরের কাজগুলো তার উপর দিয়েই সারা। একজন পরিচিত মানুষের
                সাথে একই বৈঠকে দশটা কথা বলার সময় আপনি প্রতিটা কথার আগে নতুন
                করে পরিচয় দেন না। এই একটা ভাবনার চারটা চেহারা আপনি বারবার
                দেখবেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>HTTP Keep-Alive:</strong> শুরুর দিকের HTTP তে প্রতিটা
                  File এর জন্য নতুন Connection খোলা হতো, File নামলেই বন্ধ। একটা
                  পাতায় পঞ্চাশটা ছবি মানে পঞ্চাশটা Handshake। HTTP/1.1 থেকে
                  নিয়ম উল্টে গেল, Connection খোলাই থাকে আর একটার পর একটা
                  Request তার উপর দিয়ে যায়। এটাকেই বলে Keep-Alive বা
                  Persistent Connection। বিস্তারিত পরের Module এ।
                </ListItem>
                <ListItem>
                  <strong>HTTP/2:</strong> আরও এক ধাপ এগিয়ে, একটাই Connection
                  এর উপর দিয়ে অনেক Request একসাথে পাশাপাশি চলে। একটা সাইটের
                  জন্য সাধারণত একটাই Handshake।
                </ListItem>
                <ListItem>
                  <strong>Connection Pool:</strong> আপনার Backend আর Database
                  এর মাঝে এটাই Keep-Alive এর রূপ। App চালু হওয়ার সময় কয়েকটা
                  Connection খুলে একটা ঝুড়িতে রেখে দেয়। Query দরকার হলে
                  ঝুড়ি থেকে একটা নেয়, কাজ সেরে ফেরত রাখে, বন্ধ করে না। Pool
                  ছাড়া প্রতিটা Query র আগে TCP Handshake, তার উপর Database এর
                  নিজের পরিচয় যাচাই, যা Query টার চেয়েও বেশি সময় নিতে পারে।
                  Pool size, max connections, idle timeout, এই শব্দগুলো যেখানে
                  দেখবেন, জানবেন সেখানে এই ঝুড়িটার কথা হচ্ছে।
                </ListItem>
                <ListItem>
                  <strong>Proxy আর পেছনের App এর মাঝে:</strong> Nginx বা একটা
                  Load Balancer ও পেছনের App এর সাথে Connection গুলো খোলা রেখে
                  আবার ব্যবহার করতে পারে। এটাকে প্রায়ই Upstream Keep-Alive বলা
                  হয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তফাতটা নিজের যন্ত্রে মাপা যায়। নিচের Program টা একই ঠিকানায়
                পরপর কয়েকটা Request পাঠায়, একবার প্রতিটার জন্য নতুন
                Connection খুলে, আরেকবার একটাই Connection আবার ব্যবহার করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "reuse.mjs",
          code: `import https from "node:https";

const url = process.env.TARGET_URL;
const rounds = Number(process.env.ROUNDS);

if (!url || !Number.isInteger(rounds)) {
  console.error("TARGET_URL and ROUNDS are required");
  process.exit(1);
}

function get(agent) {
  return new Promise((resolve, reject) => {
    const started = performance.now();
    https
      .get(url, { agent }, (res) => {
        res.resume();
        res.on("end", () => resolve(performance.now() - started));
      })
      .on("error", reject);
  });
}

async function run(label, agent) {
  const times = [];
  for (let i = 0; i < rounds; i++) times.push((await get(agent)).toFixed(0));
  console.log(label.padEnd(22), times.join("  "), "ms");
  agent.destroy();
}

// keepAlive: false হলে প্রতিটা Request শেষে Connection বন্ধ, পরেরটায় নতুন Handshake
await run("new connection each", new https.Agent({ keepAlive: false }));

// keepAlive: true হলে প্রথম Request এ খোলা Connection টাই বাকিগুলো বয়ে নেয়
await run("one connection reused", new https.Agent({ keepAlive: true, maxSockets: 1 }));`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "চালিয়ে তুলনা",
          code: `TARGET_URL=https://example.com/ ROUNDS=5 node reuse.mjs
# new connection each    62  22  23  24  23 ms
# one connection reused  22  7  33  9  9 ms

# প্রথম সারিতে প্রতিটা Request প্রায় 22 ms, কারণ প্রতিবার TCP আর TLS Handshake।
# (একদম প্রথমটা 62, তাতে DNS খোঁজার সময়ও আছে।)
# দ্বিতীয় সারিতে প্রথমটা 22 ms, কারণ তাকে হাত মেলাতে হয়েছে।
# এরপর 7, 9, 9, কারণ আর কোনো Handshake নেই, শুধু Request আর Response।
# মাঝের 33 টা Network এর স্বাভাবিক ওঠানামা, প্রতিবার সংখ্যা একটু আলাদা আসবে।

# curl ও একই কাজ করে, এক কমান্ডে দুইটা URL দিলে
curl -s -o /dev/null -o /dev/null -w "connect %{time_connect}  tls %{time_appconnect}  total %{time_total}\\n" https://example.com https://example.com
# connect 0.007209  tls 0.016927  total 0.026779
# connect 0.000000  tls 0.000000  total 0.010347
# দ্বিতীয় লাইনে connect আর tls শূন্য। curl আগের Connection টাই ব্যবহার করেছে।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>আর প্রথম Handshake টাকেই ছোট করার চেষ্টা?</strong> সেটাও
                হয়েছে, নাম TCP Fast Open, ছোট করে TFO। ভাবনাটা এরকম। প্রথমবার
                স্বাভাবিক Handshake হয়, আর Server সেই ফাঁকে Client কে একটা
                ছোট টোকেন দিয়ে দেয়, যার নামও Cookie। পরের বার Client SYN এর
                সাথেই টোকেনটা আর তার প্রথম Data পাঠিয়ে দেয়। Server টোকেন
                মিলিয়ে দেখে এই Client আগে একবার নিজেকে প্রমাণ করেছে, তাই শেষ
                ACK এর অপেক্ষা না করেই Data টা App কে দিয়ে দেয়। এক পুরো RTT
                বেঁচে যায়।
              </ContentParagraph>
              <ContentParagraph>
                শুনতে দারুণ, কিন্তু বাস্তবে TFO খুব কম ব্যবহার হয়, আর কারণটা
                শিক্ষণীয়। পথের অনেক পুরনো Firewall আর NAT যন্ত্র SYN এর ভেতর
                Data দেখে অভ্যস্ত নয়, তারা এমন Packet ফেলে দেয় বা নষ্ট করে।
                ফলে TFO চালু করলে কিছু ব্যবহারকারীর সংযোগ আগের চেয়েও ধীর হয়ে
                যায়। তার উপর, SYN আবার পাঠানো হলে একই Data দুইবার পৌঁছাতে
                পারে, যা সব ধরনের Request এর জন্য নিরাপদ নয়। শেষ পর্যন্ত এই
                সমস্যার আসল সমাধান এসেছে অন্য দিক থেকে। QUIC, যা UDP র উপর
                বানানো আর HTTP/3 এর ভিত্তি, সংযোগ তৈরি আর গোপনীয়তার দরদাম এক
                সাথে এক Round Trip এ সারে, আর চেনা Server এর বেলায় শূন্য Round
                Trip এ। UDP লেসনে QUIC এর নাম দেখেছেন, আর এখন জানেন সে কোন
                সমস্যার উত্তর।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "খোলা রাখারও দাম আছে, আর একটা ফাঁদও",
          content: (
            <p>
              Connection খোলা রাখা বিনা পয়সার নয়। প্রতিটা খোলা Connection দুই
              প্রান্তেই কিছু Memory আর একটা File Descriptor ধরে রাখে, আর
              Database প্রায়ই মোট Connection এর একটা শক্ত সীমা দেয়। তাই Pool
              এর আকার ভেবে ঠিক করতে হয়, যত বড় তত ভালো নয়। আর ফাঁদটা হলো
              নীরবে মরে যাওয়া Connection। আপনি একটা Connection Pool এ রেখে
              দিলেন, দশ মিনিট কেউ ব্যবহার করল না, এর মধ্যে মাঝের একটা NAT বা
              Load Balancer তার খাতা থেকে সেটা মুছে ফেলল। আপনার App জানে না।
              পরের Request টা ওই মরা Connection দিয়ে পাঠাতেই Error। এই কারণেই
              Pool গুলোতে idle timeout আর Connection যাচাইয়ের ব্যবস্থা থাকে।
              পুরো গল্পটা Connection Close লেসনে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "in-the-middle",
      subHeader: { index: "014", title: "In the Middle" },
      title: <SectionTitle>পথে যারা দাঁড়িয়ে: NAT, Firewall আর Proxy</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ ছবিতে শুধু দুইটা পক্ষ ছিল। বাস্তবে ফোন আর Server এর মাঝে
                কয়েকজন দাঁড়িয়ে থাকে, আর তাদের প্রত্যেকের কাছে প্রথম SYN টা
                একটা বিশেষ মুহূর্ত। আগের Module গুলোর তিনটা জিনিস এখানে এসে
                Handshake এর সাথে জোড়া লাগে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>NAT Router।</strong> NAT আর PAT লেসনে দেখেছিলেন, বাসার
                Router ভেতরের IP আর Port বদলে নিজের Public IP বসায়, আর একটা
                ছকে লিখে রাখে কোন বাইরের Port কোন ভেতরের যন্ত্রের। তখন একটা
                প্রশ্ন বাকি ছিল, Router ছকে নতুন লাইনটা লেখে কখন? উত্তর, ঠিক
                যখন সে ভেতর থেকে বাইরের দিকে যাওয়া একটা SYN দেখে। আমাদের গল্পে
                ফোনের SYN যায় 192.168.1.20:51514 থেকে। Router সেটাকে বানায়
                203.0.113.25 এর কোনো একটা Port, আর ছকে লিখে রাখে। SYN-ACK
                ফিরলে ছক দেখে সেটা ফোনের কাছে পৌঁছে দেয়। এখান থেকে একটা জিনিস
                পরিষ্কার হয়। বাইরে থেকে কেউ আপনার বাসার যন্ত্রে SYN পাঠালে
                Router এর ছকে কোনো লাইন মেলে না, তাই সে SYN টা ফেলে দেয়। বাইরে
                থেকে ভেতরে সংযোগ করা যায় না, এই কথাটার আসল মানে এটাই, আর Port
                Forwarding মানে হাতে করে ছকে একটা স্থায়ী লাইন লিখে দেওয়া।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Stateful Firewall।</strong> আধুনিক Firewall শুধু
                প্রতিটা Packet আলাদা করে দেখে না, সে Connection মনে রাখে।
                Stateful শব্দের মানে এটাই, অবস্থা মনে রাখে এমন। নিয়মটা সাধারণত
                এরকম হয়, নতুন Connection শুরু করতে পারবে শুধু অনুমতি থাকা
                দিক থেকে আর অনুমতি থাকা Port এ, আর একবার শুরু হয়ে গেলে সেই
                Connection এর বাকি সব Packet দুই দিকেই যেতে পারবে। নতুন
                Connection সে চেনে SYN দেখে। এই কারণেই Cloud এর Security Group
                এ আপনি শুধু বলেন Inbound এ Port 443 খোলা, আর উত্তরগুলো ফেরত
                যাওয়ার জন্য আলাদা নিয়ম লিখতে হয় না। আর এই কারণেই একটা Port
                বন্ধ থাকলে আপনি Timeout দেখেন, কারণ ফেলে দেওয়া হয় প্রথম SYN
                টাই।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Proxy আর Load Balancer।</strong> এরা আগের দুইজনের থেকে
                মৌলিকভাবে আলাদা। NAT আর Firewall SYN টাকে এগিয়ে দেয় বা ফেলে
                দেয়, কিন্তু নিজে উত্তর দেয় না। Proxy নিজেই SYN-ACK পাঠায়। সে
                Connection এর একটা সত্যিকারের প্রান্ত।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TwoHandshakesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই ছবি থেকে কয়েকটা জিনিস বেরোয়, যেগুলো পরের Module গুলোতে
                বারবার ফিরে আসবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>App আসল পর্যটকের IP দেখে না।</strong> App এর কাছে
                  Connection এসেছে Proxy র কাছ থেকে, তাই সে Proxy র IP দেখে। এই
                  কারণেই <code>X-Forwarded-For</code> নামের একটা HTTP Header
                  আছে, যেখানে Proxy আসল IP টা লিখে দেয়। HTTP Headers লেসনে এটা
                  আসবে।
                </ListItem>
                <ListItem>
                  <strong>502 আর 504 এর মানে।</strong> পর্যটকের সাথে Proxy র
                  Handshake হয়ে গেছে, কিন্তু Proxy পেছনের App এর সাথে কথা বলতে
                  পারেনি। পেছনের দিকে refused পেলে Proxy সাধারণত 502 Bad
                  Gateway দেখায়, আর Timeout হলে 504 Gateway Timeout। মানে এই
                  দুইটা সংখ্যা আসলে এই লেসনের দুইটা ব্যর্থতার ছবি, শুধু এক ধাপ
                  পেছনে ঘটেছে আর HTTP র ভাষায় অনুবাদ হয়ে এসেছে।
                </ListItem>
                <ListItem>
                  <strong>Layer 4 আর Layer 7 Load Balancer।</strong> OSI Model
                  লেসনে এই দুইটা নাম দেখেছেন। তফাতটা এখন ধরতে পারবেন। Layer 7
                  Load Balancer উপরের ছবির মতো, সে Handshake নিজে শেষ করে,
                  HTTP Request টা পড়ে, তারপর ঠিক করে কোন App এ পাঠাবে। Layer 4
                  Load Balancer HTTP পড়ে না, শুধু IP আর Port দেখে সিদ্ধান্ত
                  নেয়, আর কিছু ধরনের Layer 4 Load Balancer Handshake নিজে না
                  করে SYN টাকেই পেছনের একটা Server এ এগিয়ে দেয়।
                </ListItem>
                <ListItem>
                  <strong>Cloudflare এর Proxy চালু থাকলে।</strong> Cloudflare
                  DNS লেসনের কমলা মেঘ মনে আছে? সেটা চালু থাকলে পর্যটকের
                  Handshake হয় Cloudflare এর কাছের একটা Server এর সাথে, তাই
                  RTT ছোট, আর আপনার আসল Server এর সাথে Cloudflare আলাদা
                  Connection রাখে যা সে আবার ব্যবহার করে। আগের সেকশনের দুইটা
                  পরামর্শ, কাছে থাকা আর Connection আবার ব্যবহার, একসাথে পাওয়া
                  যায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ping চলে কিন্তু সংযোগ হয় না, অথবা উল্টোটা",
          content: (
            <p>
              এই দুইটা অবস্থা নতুনদের খুব বিভ্রান্ত করে, অথচ এখন ব্যাখ্যাটা
              সহজ। ping ব্যবহার করে ICMP, যার কোনো Port ই নেই, আর TCP Handshake
              যায় একটা নির্দিষ্ট Port এ। Firewall এই দুইটাকে আলাদা নিয়মে
              সামলায়। তাই ping চলা মানে শুধু যন্ত্রটা চালু আর পথ খোলা, Port
              443 খোলা তার প্রমাণ নয়। আবার অনেক Server আর Cloud সেবা ICMP
              পুরোপুরি বন্ধ রাখে, তখন ping ব্যর্থ হয় অথচ সাইট দিব্যি চলে।
              তাই একটা সেবা চালু আছে কি না জানতে ping নয়, ওই Port এ একটা TCP
              সংযোগের চেষ্টা করুন, যেমন nc -vz দিয়ে। আপনি যে প্রশ্নের উত্তর
              চান, পরীক্ষাটা সেই প্রশ্নেরই হওয়া চাই।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours এ Handshake কোথায় কোথায় ঘটে</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একজন পর্যটক একটা বুকিং করলে মনে হয় একটাই সংযোগ হলো। আসলে সেই
                এক বুকিং এর পেছনে কয়েকটা আলাদা TCP Connection কাজ করে, আর
                প্রতিটার নিজের Handshake আছে। কোনটা কত ঘন ঘন হয় আর কোনটা
                ব্যর্থ হলে কী দেখা যায়, এটা জানা থাকলে রাতের বেলার সমস্যা
                অনেক দ্রুত ধরা পড়ে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>পর্যটকের ফোন থেকে Edge:</strong> ফোন 192.168.1.20 এর
                  Port 51514 থেকে SYN পাঠায় Port 443 এ। বাসার Router এটাকে
                  203.0.113.25 বানিয়ে বাইরে ছাড়ে। এই Handshake পর্যটকের
                  Network এর উপর নির্ভর করে, আর এখানেই দূরত্বের দাম সবচেয়ে
                  বেশি। তাই Island Tours এর সামনে একটা CDN আছে, যাতে কক্সবাজারের
                  একজন পর্যটকের SYN কাছের একটা Server এই থামে।
                </ListItem>
                <ListItem>
                  <strong>Reverse Proxy থেকে App:</strong> Server 103.94.135.2
                  তে Port 443 এ শুনছে একটা Reverse Proxy, আর App নিজে শুনছে
                  Port 3000 এ। Proxy প্রতিটা Request এ App এর সাথে নতুন
                  Handshake করে না, কয়েকটা Connection খোলা রাখে। Deploy এর
                  সময় App কয়েক সেকেন্ড বন্ধ থাকলে ঠিক এই Handshake টাই refused
                  পায়, আর পর্যটক দেখেন 502। লেসনের শুরুর রাত দুইটার ঘটনাটা
                  এটাই ছিল।
                </ListItem>
                <ListItem>
                  <strong>App থেকে Database:</strong> App চালু হওয়ার সময় একটা
                  Connection Pool বানায়। এখানে Handshake হয় শুধু শুরুতে আর
                  মাঝে মাঝে পুরনো Connection বদলানোর সময়। Database এর Port
                  বাইরের দুনিয়ার জন্য বন্ধ, শুধু App এর Network থেকে খোলা।
                  বাইরে থেকে কেউ চেষ্টা করলে Timeout পাবে, আর সেটাই চাওয়া।
                </ListItem>
                <ListItem>
                  <strong>App থেকে বাইরের সেবা:</strong> Payment, SMS, Email।
                  এগুলো অন্যের Server, তাই এখানে Connect Timeout সবচেয়ে জরুরি।
                  মান আসে Environment Variable থেকে, Code এ লেখা থাকে না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার সেই রাতের দুইটা অভিযোগ মিলিয়ে দেখুন। আপনি নিজের যন্ত্র
                থেকে Port 3000 এ সরাসরি চেষ্টা করে refused পেয়েছিলেন। মানে
                Server চালু, পথ খোলা, কিন্তু নতুন Version এর App টা ওঠেনি।
                Log দেখলেই কারণ পাওয়া যাবে, হয়তো একটা Environment Variable
                বাদ পড়েছে আর App শুরুতেই থেমে গেছে। আর যিনি timed out
                পেয়েছিলেন, তিনি চেষ্টা করছিলেন অফিসের Network থেকে, যেখানকার
                Firewall বাইরের দিকে Port 3000 যেতেই দেয় না। দ্বিতীয়টা আপনার
                সমস্যাই নয়। দুইটা বার্তা, দুইটা সম্পূর্ণ আলাদা গল্প, আর আপনি
                সেটা বুঝলেন কোনো Log না খুলেই, শুধু শব্দ দুইটা পড়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "নিজের my-tours এ এখনই যা করতে পারেন",
          content: (
            <p>
              আপনার my-tours প্রকল্পে তিনটা ছোট অভ্যাস এখন থেকেই গড়ে নিন।
              প্রতিটা বাইরের সংযোগে একটা Connect Timeout বসান আর মানটা
              Environment Variable থেকে পড়ুন, না থাকলে App শুরুতেই থেমে যাক।
              Database এর জন্য Pool ব্যবহার করুন, প্রতিটা Request এ নতুন
              সংযোগ নয়। আর App চালু আছে কি না দেখার জন্য একটা Health Check
              রাখুন যা শুধু Port নয়, একটা সত্যিকারের উত্তর যাচাই করে। এই তিনটাই
              সরাসরি আজকের লেসন থেকে আসা।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "request-flow",
      subHeader: { index: "016", title: "Step-by-step Flow" },
      title: <SectionTitle>এক Handshake, শুরু থেকে শেষ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো ঘটনাটা এবার এক সুতোয়, পর্যটকের আঙুলের ছোঁয়া থেকে প্রথম Data
              Byte পর্যন্ত। প্রতিটা ধাপ আপনি এই লেসনে বা আগের কোনো লেসনে
              দেখেছেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Server আগে থেকে LISTEN এ",
              description:
                "Island Tours এর Reverse Proxy চালু হওয়ার সময় listen() ডেকেছিল। Kernel এ Port 443 এর জন্য একটা LISTEN Socket আর তার দুইটা লাইন তৈরি আছে।",
            },
            {
              title: "নাম থেকে IP",
              description:
                "পর্যটক islandtours.example খোলেন। ফোন DNS থেকে পায় 103.94.135.2। Handshake এর জন্য IP লাগে, নাম নয়। এটা পুরো Module 04 এর গল্প।",
            },
            {
              title: "Browser connect() ডাকে",
              description:
                "ফোনের Kernel একটা Ephemeral Port বেছে নেয়, 51514, আর একটা ISN বেছে নেয়, আমাদের গল্পে ১০০০। খাতায় State হয় SYN_SENT।",
            },
            {
              title: "SYN বেরোয়, Router ঠিকানা বদলায়",
              description:
                "SYN এ থাকে seq 1000 আর Option গুলো (mss, wscale, sackOK)। বাসার Router Source কে 203.0.113.25 বানায় আর NAT ছকে একটা লাইন লেখে।",
            },
            {
              title: "Server SYN পায়",
              description:
                "Firewall Port 443 এর SYN ঢুকতে দেয়। Server এর Kernel নিজের ISN বেছে নেয়, ৫০০০, Connection টাকে SYN Queue তে রাখে, State হয় SYN_RCVD।",
            },
            {
              title: "SYN-ACK ফেরে",
              description:
                "Server পাঠায় seq 5000, ack 1001, সাথে নিজের Option। Router ছক দেখে এটা ফোনের কাছে পৌঁছে দেয়।",
            },
            {
              title: "ফোন ESTABLISHED",
              description:
                "ফোন ack 1001 দেখে বোঝে তার SYN পৌঁছেছে। তার State হয় ESTABLISHED, আর connect() সফল হয়ে ফেরে। এখন পর্যন্ত ঠিক এক Round Trip গেছে।",
            },
            {
              title: "ACK যায়, Server ESTABLISHED",
              description:
                "ফোন পাঠায় seq 1001, ack 5001। Server এটা পেয়ে Connection টাকে SYN Queue থেকে Accept Queue তে সরায়। State হয় ESTABLISHED।",
            },
            {
              title: "App তুলে নেয়",
              description:
                "Proxy accept() ডেকে Connection টা হাতে পায়, একটা নতুন Socket হিসেবে, শুধু এই পর্যটকের জন্য। LISTEN Socket টা আগের মতোই পরের জনের অপেক্ষায় থাকে।",
            },
            {
              title: "প্রথম Data",
              description:
                "ফোন তার প্রথম Data পাঠায়, Byte নম্বর ১০০১ থেকে। HTTPS বলে এটা আসলে TLS Handshake এর শুরু। আসল Request যায় তারও পরে।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও দেখতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>নিজের চোখে তিনটা Packet</strong>, নিচের Lab এর পাঁচ
                নম্বর পরীক্ষায় tcpdump দিয়ে আপনার নিজের যন্ত্রের একটা Handshake
                ধরবেন। [S], [S.], [.] এই তিন লাইন একবার নিজের Terminal এ দেখলে
                আর কখনো ভুলবেন না।
              </ListItem>
              <ListItem>
                <strong>Wireshark</strong>, একই জিনিস ছবির মতো করে, প্রতিটা
                Header এর ঘর খুলে খুলে দেখার টুল। Filter এর ঘরে{" "}
                <code>tcp.flags.syn == 1</code> লিখলে শুধু Handshake এর Packet
                গুলো থাকে।{" "}
                <a
                  href="https://www.wireshark.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  wireshark.org
                </a>
              </ListItem>
              <ListItem>
                <strong>High Performance Browser Networking, Building Blocks of
                TCP</strong>, Handshake এর দাম, Slow Start আর Connection আবার
                ব্যবহার নিয়ে সবচেয়ে পরিষ্কার লেখাগুলোর একটা, বিনা পয়সায় পড়া
                যায়।{" "}
                <a
                  href="https://hpbn.co/building-blocks-of-tcp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  hpbn.co/building-blocks-of-tcp
                </a>
              </ListItem>
              <ListItem>
                <strong>Cloudflare, SYN Flood Attack</strong>, আক্রমণটা আর তার
                প্রতিরোধের সহজ ব্যাখ্যা, ছবি সহ।{" "}
                <a
                  href="https://www.cloudflare.com/learning/ddos/syn-flood-ddos-attack/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  cloudflare.com/learning/ddos/syn-flood-ddos-attack
                </a>
              </ListItem>
              <ListItem>
                <strong>Cloudflare Blog, SYN packet handling in the wild</strong>
                , SYN Queue আর Accept Queue Linux এ আসলে কীভাবে কাজ করে তার
                গভীর বিবরণ। এই লেসন একবার ভালো করে বুঝে তারপর পড়ুন।{" "}
                <a
                  href="https://blog.cloudflare.com/syn-packet-handling-in-the-wild/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  blog.cloudflare.com/syn-packet-handling-in-the-wild
                </a>
              </ListItem>
              <ListItem>
                <strong>RFC 9293</strong>, TCP র বর্তমান আনুষ্ঠানিক নিয়মের
                দলিল। পুরোটা পড়ার দরকার নেই, কিন্তু Connection Establishment
                অংশটা একবার চোখ বুলিয়ে দেখুন, এই লেসনের প্রতিটা কথা সেখানে
                পাবেন।{" "}
                <a
                  href="https://www.rfc-editor.org/rfc/rfc9293"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  rfc-editor.org/rfc/rfc9293
                </a>
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 18 */
    {
      id: "recap",
      subHeader: { index: "018", title: "Recap" },
      title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>Handshake কেন:</strong> TCP কে নির্ভরযোগ্য হতে হলে দুই
                  প্রান্তে দুইটা খাতা লাগে। খাতা খোলার আগে জানতে হয় ওপাশে কেউ
                  আছে কি না, রাস্তা দুই দিকে খোলা কি না, গোনা কোথা থেকে শুরু,
                  আর কার কী সামর্থ্য।
                </ListItem>
                <ListItem>
                  <strong>তিনটা বার্তা:</strong> SYN (আমার শুরু ১০০০), SYN-ACK
                  (পেয়েছি, ১০০১ চাই, আমার শুরু ৫০০০), ACK (পেয়েছি, ৫০০১ চাই)।
                  SYN নিজে একটা নম্বর খরচ করে, তাই ack এক বেশি।
                </ListItem>
                <ListItem>
                  <strong>কেন তিন:</strong> দুইটা সংখ্যা জানানো আর দুইটার
                  স্বীকৃতি, চারটা কাজ। মাঝের দুইটা এক বার্তায় জোড়া লাগে, তাই
                  তিন। তিনের কম হলে Server পুরনো নকল SYN থেকে আসল টা আলাদা
                  করতে পারে না।
                </ListItem>
                <ListItem>
                  <strong>Option:</strong> MSS, Window Scale, SACK Permitted,
                  Timestamps। শুধু SYN আর SYN-ACK এই ঠিক করা যায়।
                </ListItem>
                <ListItem>
                  <strong>State:</strong> Client এর CLOSED, SYN_SENT,
                  ESTABLISHED। Server এর LISTEN, SYN_RCVD, ESTABLISHED। মাঝের
                  দুইটা অনেকক্ষণ দেখা মানে কিছু একটা হারাচ্ছে।
                </ListItem>
                <ListItem>
                  <strong>কে করে:</strong> Kernel। আপনার Code শুধু listen(),
                  accept() আর connect() ডাকে। তাই Port খোলা মানেই App সুস্থ
                  নয়।
                </ListItem>
                <ListItem>
                  <strong>দাম:</strong> এক Round Trip, যা দূরত্বের সাথে বাড়ে।
                  HTTPS এ তার উপর TLS। কমানোর উপায় কাছে থাকা আর Connection
                  আবার ব্যবহার করা (Keep-Alive, Pool)।
                </ListItem>
                <ListItem>
                  <strong>তিনটা ব্যর্থতা:</strong> refused মানে RST এসেছে, যন্ত্র
                  চালু কিন্তু Port এ কেউ শুনছে না, App দেখুন। timed out মানে
                  নীরবতা, SYN ফেলে দেওয়া হচ্ছে, Firewall দেখুন। unreachable
                  মানে পথই নেই, Routing দেখুন।
                </ListItem>
                <ListItem>
                  <strong>দুইটা লাইন:</strong> SYN Queue অর্ধেক খোলাদের জন্য,
                  Accept Queue তৈরি হওয়াদের জন্য। দ্বিতীয়টার সীমা Backlog।
                  ভরে গেলে নতুনরা ঢুকতে পারে না, অথচ App এর Log চুপ।
                </ListItem>
                <ListItem>
                  <strong>নিরাপত্তা:</strong> SYN Flood নকল SYN দিয়ে প্রথম
                  লাইনটা ভরে দেয়। SYN Cookie কিছু মনে না রেখে ISN এর ভেতরেই
                  প্রমাণটা রাখে। ISN এলোমেলো, যাতে কেউ অনুমান করে ঢুকে পড়তে না
                  পারে।
                </ListItem>
                <ListItem>
                  <strong>মাঝের জনেরা:</strong> NAT আর Firewall SYN দেখে নতুন
                  Connection চেনে। Proxy নিজে Handshake শেষ করে, তাই Handshake
                  হয় দুইটা, আর পেছনেরটা ব্যর্থ হলে পর্যটক দেখেন 502 বা 504।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আপনি এখন জানেন Connection কীভাবে শুরু হয়। কিন্তু এই পুরো লেসনে
                একটা জিনিস আমরা ধরে নিয়েছি। বলেছি SYN একটা TCP Segment, সেটা
                যায় একটা IP Packet এর ভেতরে, আর Router পার হওয়ার সময় ঠিকানা
                বদলায়। বলেছি MSS 1460 আসে 1500 থেকে 40 বাদ দিয়ে। Segment,
                Packet, Frame, এই তিনটা নাম আসলে কীসের, একটা আরেকটার ভেতরে
                কীভাবে ঢোকে, আর পথে কোনটা বদলায় আর কোনটা অক্ষত থাকে, সেটাই
                পরের লেসনের বিষয়, <strong>Packet, Segment, and Frame</strong>।
                সেখানে আজকের এই SYN টাকেই খুলে স্তরে স্তরে দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে", "কোথায় দেখবেন"],
    rows: [
      [
        "SYN",
        "Connection শুরুর অনুরোধ, সাথে নিজের শুরুর সংখ্যা (ISN) আর Option",
        "tcpdump এ Flags [S]",
      ],
      [
        "SYN-ACK",
        "Client এর সংখ্যার স্বীকৃতি আর Server এর নিজের সংখ্যা, এক বার্তায়",
        "tcpdump এ Flags [S.]",
      ],
      [
        "ACK",
        "Server এর সংখ্যার স্বীকৃতি, এরপরই Data যেতে পারে",
        "tcpdump এ Flags [.]",
      ],
      [
        "ISN",
        "প্রতিটা Connection এর জন্য আলাদা, অনুমান করা যায় না এমন শুরুর সংখ্যা",
        "tcpdump -S দিলে আসল সংখ্যা",
      ],
      [
        "Option",
        "MSS, Window Scale, SACK Permitted, Timestamps, শুধু Handshake এ ঠিক হয়",
        "SYN আর SYN-ACK এর options [...]",
      ],
      [
        "State",
        "LISTEN, SYN_SENT, SYN_RCVD, ESTABLISHED",
        "netstat -an, Linux এ ss -tan",
      ],
      [
        "দাম",
        "এক Round Trip, HTTPS এ তার উপর TLS",
        "curl -w এর time_connect থেকে time_namelookup বাদ",
      ],
      [
        "Connection refused",
        "RST এসেছে, যন্ত্র চালু কিন্তু Port এ কেউ শুনছে না",
        "ECONNREFUSED, সাথে সাথে আসে",
      ],
      [
        "Connection timed out",
        "কোনো উত্তর নেই, SYN পথে ফেলে দেওয়া হচ্ছে",
        "ETIMEDOUT, অনেকক্ষণ ঝুলে থেকে আসে",
      ],
      [
        "SYN Queue, Accept Queue",
        "অর্ধেক খোলা আর তৈরি Connection এর দুই লাইন, সীমার নাম Backlog",
        "netstat -Lan, Linux এ ss -ltn",
      ],
      [
        "SYN Flood, SYN Cookie",
        "নকল SYN এ লাইন ভরানো, আর কিছু মনে না রেখে তা ঠেকানো",
        "net.ipv4.tcp_syncookies",
      ],
      [
        "Connection Reuse",
        "Keep-Alive, HTTP/2, Connection Pool, সবই Handshake এড়ানোর উপায়",
        "curl এ দ্বিতীয় URL এর time_connect শূন্য",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "ফোন SYN পাঠাল seq=1000 দিয়ে, আর তাতে কোনো Data নেই। Server এর SYN-ACK এ ack এর মান কত হবে, আর কেন?",
        options: [
          {
            key: "A",
            text: "1000, কারণ SYN এ কোনো Data ছিল না",
            isCorrect: false,
            explanation:
              "Data না থাকলেও SYN Flag নিজে একটা Sequence Number খরচ করে, যাতে তারও পৌঁছানোর নিশ্চয়তা দেওয়া যায়।",
          },
          {
            key: "B",
            text: "1001, কারণ SYN নিজে একটা নম্বরের জায়গা নেয়, আর ack সব সময় বলে এরপর কোনটা চাই",
            isCorrect: true,
            explanation:
              "ঠিক। ack মানে এরপর আমি এই নম্বরটা আশা করছি। SYN একটা নম্বর খরচ করেছে, তাই পরেরটা 1001।",
          },
          {
            key: "C",
            text: "5000, কারণ ওটা Server এর শুরুর সংখ্যা",
            isCorrect: false,
            explanation:
              "5000 থাকে seq এর ঘরে, ack এর ঘরে নয়। ack সব সময় অপর পক্ষের সংখ্যা নিয়ে কথা বলে।",
          },
        ],
      },
      {
        id: 2,
        text: "Handshake এ ধাপ দুইটা না হয়ে তিনটা কেন, সবচেয়ে সঠিক কারণ কোনটা?",
        options: [
          {
            key: "A",
            text: "তিনবার বললে Packet হারানোর সম্ভাবনা কমে",
            isCorrect: false,
            explanation:
              "তিনটা বার্তা একই কথার পুনরাবৃত্তি নয়, প্রতিটা আলাদা কাজ করে। হারালে আবার পাঠানোর ব্যবস্থা আলাদা।",
          },
          {
            key: "B",
            text: "দুই পক্ষের দুইটা শুরুর সংখ্যা জানানো আর স্বীকার করানো লাগে, আর তৃতীয় বার্তা ছাড়া Server জানে না তার সংখ্যা পৌঁছেছে কি না বা SYN টা আসল কি না",
            isCorrect: true,
            explanation:
              "ঠিক। চারটা কাজ, মাঝের দুইটা এক বার্তায় জোড়া লাগে বলে তিন। তৃতীয়টা Server এর জন্য প্রমাণ যে ওপাশে সত্যিই কেউ এখন কথা বলতে চায়।",
          },
          {
            key: "C",
            text: "তৃতীয় বার্তায় TLS এর চাবি পাঠানো হয়",
            isCorrect: false,
            explanation:
              "TLS পুরোপুরি আলাদা একটা Handshake, যা TCP Handshake শেষ হওয়ার পরে শুরু হয়।",
          },
        ],
      },
      {
        id: 3,
        text: "আপনি nc -vz দিয়ে একটা Server এর Port 3000 এ চেষ্টা করলেন আর এক মুহূর্তে উত্তর এলো Connection refused। এ থেকে কী নিশ্চিত বলা যায়?",
        options: [
          {
            key: "A",
            text: "Server যন্ত্রটা বন্ধ",
            isCorrect: false,
            explanation:
              "যন্ত্র বন্ধ থাকলে কোনো উত্তরই আসত না, আপনি Timeout দেখতেন। RST পাঠিয়েছে একটা চালু Kernel।",
          },
          {
            key: "B",
            text: "আপনার SYN একটা চালু যন্ত্রে পৌঁছেছে, কিন্তু ওই Port এ কোনো Program শুনছে না (অথবা একটা Firewall সক্রিয়ভাবে না বলেছে)",
            isCorrect: true,
            explanation:
              "ঠিক। দ্রুত না মানে কেউ সক্রিয়ভাবে RST পাঠিয়েছে। পথ খোলা, তাই এবার দেখুন App চালু কি না আর কোন ঠিকানার কোন Port এ শুনছে।",
          },
          {
            key: "C",
            text: "Security Group এ Port 3000 বন্ধ",
            isCorrect: false,
            explanation:
              "Security Group সাধারণত নীরবে ফেলে দেয়, তখন আপনি অনেকক্ষণ ঝুলে থেকে Timeout দেখতেন।",
          },
        ],
      },
      {
        id: 4,
        text: "curl এর output এ time_namelookup 0.002 আর time_connect 0.062। TCP Handshake এ কত সময় গেছে, আর এই সংখ্যাটা মূলত কীসের উপর নির্ভর করে?",
        options: [
          {
            key: "A",
            text: "প্রায় 60 মিলিসেকেন্ড, আর এটা নির্ভর করে Server পর্যন্ত Round Trip Time এর উপর",
            isCorrect: true,
            explanation:
              "ঠিক। সংখ্যাগুলো শুরু থেকে মোট সময়, তাই বিয়োগ করতে হয়। Handshake এ এক Round Trip লাগে, যা দূরত্ব দিয়ে ঠিক হয়।",
          },
          {
            key: "B",
            text: "62 মিলিসেকেন্ড, আর এটা নির্ভর করে Bandwidth এর উপর",
            isCorrect: false,
            explanation:
              "62 এর মধ্যে DNS এর সময়ও আছে। আর তিনটা ছোট Packet এ Bandwidth এর কোনো ভূমিকা নেই, এটা Latency র ব্যাপার।",
          },
          {
            key: "C",
            text: "2 মিলিসেকেন্ড, আর এটা নির্ভর করে DNS এর উপর",
            isCorrect: false,
            explanation: "2 মিলিসেকেন্ড শুধু নাম থেকে IP বের করার সময়, Handshake এর নয়।",
          },
        ],
      },
      {
        id: 5,
        text: "Island Tours এর Server এ CPU মাত্র ২০ শতাংশ ব্যস্ত, Memory ফাঁকা, App এর Log এ কোনো Error নেই, অথচ নতুন পর্যটকরা Connection timed out পাচ্ছেন। সবচেয়ে সম্ভাব্য কারণ কোনটা?",
        options: [
          {
            key: "A",
            text: "App accept() ডাকতে পারছে না, তাই Accept Queue ভরে গেছে আর Kernel নতুন Connection ফেলে দিচ্ছে",
            isCorrect: true,
            explanation:
              "ঠিক। App ওই Connection গুলো কখনো দেখেইনি, তাই Log চুপ। netstat -Lan বা ss -ltn এ লাইনের অবস্থা আর netstat -s এ overflow এর সংখ্যা দেখলেই ধরা পড়বে।",
          },
          {
            key: "B",
            text: "DNS এর TTL খুব বেশি",
            isCorrect: false,
            explanation: "TTL বেশি হলে পুরনো IP তে যাওয়ার সমস্যা হয়, চালু Server এ Timeout হয় না।",
          },
          {
            key: "C",
            text: "ISN যথেষ্ট এলোমেলো নয়",
            isCorrect: false,
            explanation: "সেটা একটা নিরাপত্তার বিষয়, সংযোগ ধীর হওয়ার কারণ নয়।",
          },
        ],
      },
      {
        id: 6,
        text: "SYN Cookie ঠিক কোন সমস্যার সমাধান করে, আর কীভাবে?",
        options: [
          {
            key: "A",
            text: "SYN Flood এ SYN Queue ভরে যাওয়া। Server কিছু মনে না রেখে ISN এর ভেতরেই হিসাব করা একটা প্রমাণ পাঠায়, আর শেষ ACK এ সেটা মিললে তবেই খাতা খোলে",
            isCorrect: true,
            explanation:
              "ঠিক। নকল ঠিকানার আক্রমণকারী SYN-ACK পায়ই না, তাই ঠিক সংখ্যা ফিরিয়ে দিতে পারে না, আর Server এর Memory ও খরচ হয় না।",
          },
          {
            key: "B",
            text: "Browser এ Login মনে রাখা",
            isCorrect: false,
            explanation:
              "ওটা HTTP Cookie, সম্পূর্ণ আলাদা জিনিস, শুধু নামটা এক। HTTP Cookie পরের Module এ আসবে।",
          },
          {
            key: "C",
            text: "Handshake এর সময় এক Round Trip কমানো",
            isCorrect: false,
            explanation: "সেটার চেষ্টা TCP Fast Open। SYN Cookie গতি বাড়ায় না, আক্রমণ ঠেকায়।",
          },
        ],
      },
      {
        id: 7,
        text: "আপনার Backend প্রতিটা Query র আগে Database এ নতুন Connection খুলছে আর Query শেষে বন্ধ করছে। সবচেয়ে বড় ক্ষতিটা কী, আর সমাধান কী?",
        options: [
          {
            key: "A",
            text: "প্রতিটা Query তে নতুন Handshake এর বাড়তি Round Trip যোগ হচ্ছে। সমাধান Connection Pool, যেখানে Connection খোলা রেখে আবার ব্যবহার করা হয়",
            isCorrect: true,
            explanation:
              "ঠিক। TCP Handshake এর উপর Database এর নিজের পরিচয় যাচাইও প্রতিবার হচ্ছে। Pool এই খরচটা একবারে নামিয়ে আনে।",
          },
          {
            key: "B",
            text: "Sequence Number ফুরিয়ে যাবে। সমাধান Window Scale বাড়ানো",
            isCorrect: false,
            explanation: "প্রতিটা Connection নিজের নতুন ISN দিয়ে শুরু করে, ফুরানোর কিছু নেই।",
          },
          {
            key: "C",
            text: "কোনো ক্ষতি নেই, এটাই সবচেয়ে নিরাপদ উপায়",
            isCorrect: false,
            explanation: "ব্যস্ত সময়ে এটা App কে অকারণে ধীর করে আর Database এর উপর চাপ বাড়ায়।",
          },
        ],
      },
      {
        id: 8,
        text: "পর্যটক Browser এ 502 Bad Gateway দেখছেন। Handshake এর ভাষায় সবচেয়ে সম্ভাব্য ঘটনা কোনটা?",
        options: [
          {
            key: "A",
            text: "পর্যটকের ফোন আর Proxy র মাঝের Handshake ব্যর্থ হয়েছে",
            isCorrect: false,
            explanation:
              "সেটা ব্যর্থ হলে Browser কোনো HTTP উত্তরই পেত না, দেখাত সাইটে পৌঁছানো যাচ্ছে না। 502 একটা HTTP উত্তর, যা Proxy পাঠিয়েছে।",
          },
          {
            key: "B",
            text: "পর্যটকের সাথে Proxy র Handshake সফল, কিন্তু Proxy পেছনের App এর সাথে সংযোগ করতে গিয়ে ব্যর্থ, সম্ভবত refused",
            isCorrect: true,
            explanation:
              "ঠিক। মাঝখানে Proxy থাকলে Handshake দুইটা। 502 মানে দ্বিতীয়টায় সমস্যা। App চালু আছে কি না আর ঠিক Port এ শুনছে কি না দেখুন।",
          },
          {
            key: "C",
            text: "DNS ভুল IP দিয়েছে",
            isCorrect: false,
            explanation: "ভুল IP হলে পর্যটক আপনার Proxy পর্যন্ত পৌঁছাতেনই না, আর Proxy র পাঠানো 502 ও দেখতেন না।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "Handshake নিজের হাতে ধরুন",
    subtitle: "Terminal এ ছয়টা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "Handshake এর সময় মাপা",
        description:
          "curl দিয়ে কাছের আর দূরের দুইটা সাইটে TCP Handshake এর সময় বের করুন, আর ping এর RTT র সাথে মিলিয়ে দেখুন।",
      },
      {
        title: "তিনটা ছবি তৈরি করা",
        description:
          "nc দিয়ে নিজে সফল, refused আর timed out, তিনটা ফলাফলই ঘটান আর প্রতিটার সময় খেয়াল করুন।",
      },
      {
        title: "নিজের Code থেকে দেখা",
        description:
          "connect-check.mjs চালিয়ে একই তিনটা ফলাফল Node এর Error Code হিসেবে দেখুন।",
      },
      {
        title: "State আর লাইন পড়া",
        description:
          "netstat দিয়ে নিজের যন্ত্রের LISTEN আর ESTABLISHED Connection গুলো আর তাদের অপেক্ষার লাইন দেখুন।",
      },
      {
        title: "তারে তিনটা Packet ধরা",
        description:
          "tcpdump দিয়ে নিজের একটা Handshake ধরুন আর [S], [S.], [.] তিনটা লাইন চিনে নিন।",
      },
      {
        title: "আবার ব্যবহারের লাভ মাপা",
        description:
          "reuse.mjs আর curl দিয়ে নতুন Connection আর পুরনো Connection এর সময়ের তফাত দেখুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-handshake-time.sh",
        language: "bash",
        code: `# একটা সাহায্যকারী: শুধু সময়গুলো ছাপায়
T() {
  curl -o /dev/null -s -w "dns %{time_namelookup}  connect %{time_connect}  tls %{time_appconnect}  total %{time_total}\\n" "$1"
}

T https://example.com
T https://example.com
# dns 0.057062  connect 0.061109  tls 0.071180  total 0.079480
# dns 0.002351  connect 0.006448  tls 0.015217  total 0.022526

# TCP Handshake = connect বিয়োগ dns
# দ্বিতীয় লাইনে: 0.006448 - 0.002351 = প্রায় 4 ms

# এবার RTT মাপুন আর মিলিয়ে দেখুন
ping -c 3 example.com
# round-trip min/avg/max/stddev = 3.577/3.963/4.451/0.364 ms

# এরপর একটা দূরের সাইট দিয়ে একই কাজ করুন, যেমন wikipedia.org।
# আপনার সংখ্যা আলাদা হবে, কিন্তু নিয়মটা মিলবে:
# connect বিয়োগ dns প্রায় ping এর RTT র সমান।
# কিছু Server ping এর উত্তর দেয় না, তখন শুধু curl এর সংখ্যাটাই ভরসা।`,
      },
      {
        filename: "2-three-outcomes.sh",
        language: "bash",
        code: `# সফল
nc -vz example.com 443
# Connection to example.com port 443 [tcp/https] succeeded!

# Refused: নিজের যন্ত্রে এমন Port যেখানে কেউ শুনছে না
time nc -vz 127.0.0.1 9
# nc: connectx to 127.0.0.1 port 9 (tcp) failed: Connection refused
# সময়: প্রায় শূন্য

# Timeout: এমন Port যার SYN পথে ফেলে দেওয়া হয়
time nc -vz -G 3 1.1.1.1 81       # macOS
time nc -vz -w 3 1.1.1.1 81       # Linux
# nc: connectx to 1.1.1.1 port 81 (tcp) failed: Operation timed out
# সময়: পুরো ৩ সেকেন্ড

# এবার নিজে একটা Refused কে সফল বানান।
# এক Terminal এ একটা Listener চালু করুন:
nc -l 9000
# আরেক Terminal থেকে:
nc -vz 127.0.0.1 9000
# এবার succeeded। Listener বন্ধ করে আবার চেষ্টা করুন, আবার refused।
# একই Port, একই যন্ত্র, তফাত শুধু কেউ LISTEN এ আছে কি না।`,
      },
      {
        filename: "3-from-code.sh",
        language: "bash",
        code: `# সেকশন ৭ এর connect-check.mjs ফাইলটা বানিয়ে নিন, তারপর:

CHECK_HOST=example.com CHECK_PORT=443 CONNECT_TIMEOUT_MS=3000 node connect-check.mjs
# ESTABLISHED in 12.0 ms
# local  192.168.0.103:57229
# remote 172.66.147.243:443

CHECK_HOST=127.0.0.1 CHECK_PORT=9 CONNECT_TIMEOUT_MS=3000 node connect-check.mjs
# ECONNREFUSED after 1.7 ms

CHECK_HOST=example.com CHECK_PORT=81 CONNECT_TIMEOUT_MS=3000 node connect-check.mjs
# NO ANSWER after 3006.6 ms (SYN dropped somewhere)

# প্রথমটা কয়েকবার চালান আর local এর Port টা দেখুন।
# প্রতিবার আলাদা, কারণ প্রতিবার Kernel নতুন একটা Ephemeral Port দিচ্ছে।

# CONNECT_TIMEOUT_MS বদলে 500 করে তৃতীয়টা আবার চালান।
# এবার আধা সেকেন্ডেই হাল ছাড়বে। সীমাটা আপনার হাতে, Kernel এর দুই মিনিটের নয়।`,
      },
      {
        filename: "4-states-and-queues.sh",
        language: "bash",
        code: `# কোন State এ কয়টা Connection
netstat -an -p tcp | awk 'NR>2 {print $6}' | sort | uniq -c
#   80 ESTABLISHED
#   22 LISTEN
#   25 TIME_WAIT
#    6 LAST_ACK
#    1 CLOSE_WAIT

# কারা LISTEN এ আছে
netstat -an -p tcp | grep LISTEN | head -5

# macOS: প্রতিটা LISTEN Socket এর লাইন (qlen/incqlen/maxqlen)
netstat -Lan | head -6
# 0/0/128        127.0.0.1.5432
# 0/0/128        *.27121

# Kernel এর ছাদ
sysctl kern.ipc.somaxconn          # macOS, আমার যন্ত্রে 128

# Linux এ একই তথ্য
ss -ltn                            # LISTEN Socket, Send-Q ঘরে Backlog
ss -tan state syn-recv             # অর্ধেক খোলা Connection
sysctl net.core.somaxconn net.ipv4.tcp_max_syn_backlog net.ipv4.tcp_syncookies

# আগের পরীক্ষার nc -l 9000 চালু রেখে netstat -Lan আবার চালান।
# তালিকায় *.9000 নামে একটা নতুন লাইন দেখবেন।`,
      },
      {
        filename: "5-capture-handshake.sh",
        language: "bash",
        code: `# tcpdump তারে যাওয়া Packet দেখায়, তাই sudo লাগে।
# Filter টা বলছে: শুধু সেই TCP Packet যাদের SYN Flag চালু,
# অর্থাৎ SYN আর SYN-ACK। (শেষ ACK দেখতে নিচের দ্বিতীয় কমান্ড।)

# এক Terminal এ:
sudo tcpdump -n -i any 'tcp[tcpflags] & tcp-syn != 0 and host example.com'

# আরেক Terminal এ:
curl -s -o /dev/null https://example.com

# প্রথম Terminal এ দুইটা লাইন আসবে, এই আকারে:
# IP <আপনার IP>.<Port> > <Server IP>.443: Flags [S], seq ..., win ..., options [mss 1460,...], length 0
# IP <Server IP>.443 > <আপনার IP>.<Port>: Flags [S.], seq ..., ack ..., win ..., options [mss ...], length 0

# তিনটা Packet ই দেখতে, আর আসল Sequence Number সহ:
sudo tcpdump -n -S -c 3 -i any 'host example.com and tcp port 443'
#   -S  Relative নয়, আসল সংখ্যা দেখান
#   -c 3 তিনটা Packet দেখিয়ে থামুন

# মিলিয়ে দেখুন:
#   দ্বিতীয় লাইনের ack = প্রথম লাইনের seq + 1
#   তৃতীয় লাইনের ack = দ্বিতীয় লাইনের seq + 1
#   mss আর wscale শুধু প্রথম দুই লাইনে

# কাজ শেষে Ctrl+C দিয়ে tcpdump বন্ধ করুন।`,
      },
      {
        filename: "6-reuse.sh",
        language: "bash",
        code: `# সেকশন ১৩ এর reuse.mjs ফাইলটা বানিয়ে নিন, তারপর:
TARGET_URL=https://example.com/ ROUNDS=5 node reuse.mjs
# new connection each    62  22  23  24  23 ms
# one connection reused  22  7  33  9  9 ms

# curl দিয়ে একই প্রমাণ, এক কমান্ডে দুইটা URL
curl -s -o /dev/null -o /dev/null -w "connect %{time_connect}  tls %{time_appconnect}  total %{time_total}\\n" https://example.com https://example.com
# connect 0.007209  tls 0.016927  total 0.026779
# connect 0.000000  tls 0.000000  total 0.010347

# দ্বিতীয় লাইনে connect শূন্য। কোনো Handshake হয়নি।

# -v দিলে curl নিজেই বলে দেয়
curl -sv -o /dev/null -o /dev/null https://example.com https://example.com 2>&1 | grep -i -E "connected to|re-us"
# প্রথম Request এ Connected to ..., দ্বিতীয়টায় পুরনো Connection আবার ব্যবহারের লাইন।`,
      },
    ],
    tip: "দুই নম্বর পরীক্ষার শেষ অংশটা বাদ দেবেন না, যেখানে আপনি নিজে nc -l দিয়ে একটা Listener চালু আর বন্ধ করছেন। একই Port এ একবার succeeded আর একবার refused, আর তফাতটা তৈরি করছেন আপনি নিজে। এই এক মিনিটের অভিজ্ঞতাটা Connection refused শব্দটাকে চিরদিনের জন্য পরিষ্কার করে দেয়, আর কাউকে শেখানোর সময় এর চেয়ে ভালো প্রদর্শনী আর নেই। পাঁচ নম্বর পরীক্ষায় sudo না থাকলে চিন্তা করবেন না, বাকি পাঁচটা পরীক্ষা তা ছাড়াই চলে, আর লেসনের সেকশন পাঁচে একই output এর একটা নমুনা দেওয়া আছে।",
  },
  assignment: {
    title: "Mini Project: Connection এর ডাক্তারি খাতা",
    time: "৭৫ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>দূরত্বের ছক:</strong> পাঁচটা সাইট বেছে নিন, যার অন্তত দুইটা
        আপনার দেশের আর দুইটা অন্য মহাদেশের। প্রতিটার জন্য curl দিয়ে DNS,
        TCP Handshake আর TLS Handshake এর সময় আলাদা করে বের করুন আর একটা ছকে
        লিখুন। কোন সাইটের Handshake সবচেয়ে সস্তা, আর আপনার ধারণায় কেন?
      </span>,
      <span key="2">
        <strong>তিন ছবির প্রমাণ:</strong> নিজের যন্ত্রে সফল, refused আর timed
        out, তিনটা ফলাফলই ঘটান, nc আর connect-check.mjs দুইটা দিয়েই। প্রতিটার
        বার্তা, লাগা সময় আর আপনার ব্যাখ্যা লিখুন। তারপর nc -l দিয়ে একটা
        refused কে সফল বানান আর দেখান কোন একটা জিনিস বদলানোয় ফল বদলাল।
      </span>,
      <span key="3">
        <strong>সংখ্যা মেলানো:</strong> নিচের তিন লাইন একটা Handshake এর।
        ফাঁকা জায়গাগুলো ভরুন আর প্রতিটার কারণ এক লাইনে লিখুন। (ক) Flags [S],
        seq 7300। (খ) Flags [S.], seq 42000, ack ফাঁকা। (গ) Flags [.], ack
        ফাঁকা। এরপর ফোন ১০০ Byte Data পাঠালে তার প্রথম Byte এর নম্বর কত, আর
        Server এর ACK এ কোন সংখ্যা থাকবে?
      </span>,
      <span key="4">
        <strong>রোগ নির্ণয়:</strong> চারটা অভিযোগ দেওয়া হলো। প্রতিটায় লিখুন
        তারে সম্ভবত কী ঘটছে, প্রথম কোন কমান্ড চালাবেন, আর কোথায় খুঁজবেন। (ক)
        Deploy এর পর পর্যটকরা 502 দেখছেন। (খ) নতুন Server এ App চলছে, নিজে
        Server এর ভেতর থেকে খুলতে পারছেন, বাইরে থেকে timed out। (গ) Payment
        সেবা ধীর হলে পুরো সাইট ঝুলে যায়। (ঘ) ব্যস্ত সময়ে কিছু পর্যটক ঢুকতে
        পারেন না, অথচ CPU ফাঁকা আর Log চুপ।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> একজন বন্ধু, যিনি সবে
        Programming শিখছেন, জিজ্ঞেস করলেন, Connection refused আর Connection
        timed out তো একই কথা, তাই না? তাঁকে একটা দৈনন্দিন উদাহরণ দিয়ে তফাতটা
        বোঝান, তিন ধাপের Handshake এর কোন ধাপে কোনটা ঘটে তা বলুন, আর প্রতিটা
        দেখলে তিনি প্রথমে কী পরীক্ষা করবেন তা লিখে দিন।
      </span>,
    ],
    deliverables: [
      <span key="1">পাঁচ সাইটের DNS, TCP আর TLS সময়ের ছক, ব্যাখ্যা সহ</span>,
      <span key="2">তিন ফলাফলের বার্তা, সময় আর ব্যাখ্যা, আর refused থেকে সফল হওয়ার প্রমাণ</span>,
      <span key="3">ভরা তিন লাইন, কারণ সহ, আর পরের Data র দুইটা সংখ্যা</span>,
      <span key="4">চার অভিযোগের রোগ নির্ণয়, প্রথম কমান্ড সহ</span>,
      <span key="5">বন্ধুর জন্য ব্যাখ্যা, ১০ লাইনে</span>,
    ],
  },
};
