 
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  CloseStepLab,
  CloseSymptomLab,
  IdleTimeoutLab,
} from "../../../components/course/topics/tcp/close-animations";
import {
  CloseSequenceDiagram,
  FinVsRstSplit,
  IdleTimeoutRaceDiagram,
  ModuleStoryDiagram,
  TimeWaitReasonsSplit,
} from "../../../components/course/topics/tcp/close-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const connectionCloseContent: TopicData = {
  id: "connection-close",
  introduction: {
    badge: "MODULE 05 · LESSON 08",
    title: <SectionTitle>কথা শেষ, এবার ফোনটা রাখবেন কীভাবে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          পর্যটক Island Tours এ নৌকার আসন বুক করলেন, পর্দায় নিশ্চিতকরণ এলো, তিনি
          Browser বন্ধ করে দিলেন। গল্পটা এখানে শেষ মনে হয়। কিন্তু তাঁর ফোন আর
          Island Tours এর Server এর মাঝে যে Connection টা Three-way Handshake
          দিয়ে খোলা হয়েছিল, সেটার কী হলো? সেটা কি নিজে থেকে মিলিয়ে গেল? কেউ কি
          কাউকে জানাল যে কথা শেষ?
        </ContentParagraph>
        <ContentParagraph>
          Connection খোলার গল্প সবাই জানে, বন্ধ করার গল্প প্রায় কেউ জানে না। অথচ
          Production এ যত অদ্ভুত Error আপনাকে রাতে জাগিয়ে রাখবে, তার বড় অংশ এই
          বন্ধ করা থেকেই আসে। ECONNRESET, Broken pipe, socket hang up, Address
          already in use, মাঝে মাঝে একটা 502, Deploy এর সময় কয়েকটা Request
          হারিয়ে যাওয়া, এদের সবার শিকড় এক জায়গায়।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন একটা Connection ভদ্রভাবে কীভাবে বন্ধ হয়, FIN
          আর ACK এর চার ধাপে দুই পাশে কী কী State বদলায়, TIME_WAIT নামের অপেক্ষাটা
          কেন আছে, RST কখন আসে আর তার মানে কী, CLOSE_WAIT জমলে দোষটা কার, চুপচাপ
          পড়ে থাকা Connection কে মাঝপথে কারা মেরে ফেলে, আর একটা Server কে কীভাবে
          থামালে একজন পর্যটকের বুকিং ও নষ্ট হয় না। আর যেহেতু এটা এই Module এর
          শেষ লেসন, একদম শেষে আট লেসনকে একটা গল্পে জোড়া লাগাব।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "ফোনে কথা শেষ হলে আমরা হঠাৎ লাইন কেটে দিই না। একজন বলেন, আচ্ছা রাখি তাহলে। অন্যজন বলেন, ঠিক আছে, আমারও একটা কথা ছিল, সেটা বলে নিই। তারপর তিনিও বলেন রাখি। দুইজনই জানেন কথা শেষ, কারো কোনো কথা মাঝপথে আটকে নেই।",
      author: "TCP",
      role: "Lesson 08",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-close",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Connection আসলে কোথায় থাকে, আর বন্ধ করা মানে কী</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথমে একটা ভুল ছবি মাথা থেকে সরাই। Connection শব্দটা শুনলে মনে হয়
                ফোন আর Server এর মাঝে একটা তার টানা আছে, আর বন্ধ করা মানে সেই
                তারটা কেটে দেওয়া। এমন কোনো তার নেই। Module 02 তে দেখেছেন, মাঝের
                Router গুলো শুধু একটা একটা Packet হাতে নেয় আর পরের জনকে দেয়। কোন
                Packet কোন Connection এর, সেটা তারা জানেও না, মনেও রাখে না।
              </ContentParagraph>
              <ContentParagraph>
                তাহলে Connection টা আছে কোথায়? আছে শুধু দুই প্রান্তের দুই Kernel এর
                খাতায়। Three-way Handshake এর লেসনে দেখেছেন, Handshake শেষে ফোনের
                Kernel একটা পাতা খোলে আর Server এর Kernel আরেকটা। সেই পাতায় লেখা
                থাকে চারটা সংখ্যা (কার IP, কার Port, ওপাশের IP, ওপাশের Port),
                এখন পর্যন্ত কত Byte পাঠানো হয়েছে, কত Byte পাওয়া গেছে, Window কত
                বড়, আর Connection টা এখন কোন অবস্থায়। এই অবস্থাটার নামই{" "}
                <strong>State</strong>। এতক্ষণ State ছিল ESTABLISHED, মানে খোলা আর
                চালু।
              </ContentParagraph>
              <ContentParagraph>
                তাই Connection বন্ধ করা মানে কোনো তার কাটা নয়। মানে হলো, দুই
                Kernel ই একমত হয়ে নিজের নিজের খাতা থেকে পাতাটা ছিঁড়ে ফেলা। সমস্যাটা
                এই একমত হওয়াতেই। দুইজন দুই দেশে, মাঝের রাস্তায় Packet হারায়, দেরি
                করে। একজন পাতা ছিঁড়ে ফেলল আর অন্যজন জানলই না, তখন কী হবে? একজনের
                কথা তখনো পথে, আর অন্যজন কান বন্ধ করে ফেলল, তখন?
              </ContentParagraph>
              <ContentParagraph>
                TCP এই পুরো ব্যাপারটার জন্য একটা নিয়ম বেঁধে দিয়েছে, ঠিক যেমন
                খোলার জন্য Handshake বেঁধে দিয়েছিল। খোলার সময় তিনটা Segment লাগে,
                বন্ধের সময় সাধারণত চারটা। আর খোলার চেয়ে বন্ধ করাটা একটু বেশি
                সূক্ষ্ম, কারণ খোলার সময় কারো কাছে হারানোর মতো কিছু থাকে না, কিন্তু
                বন্ধের সময় পথে তথ্য থাকতে পারে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "বন্ধ করার দুইটা লক্ষ্য, দুইটাই মনে রাখুন",
          content: (
            <p>
              এক, কারো কোনো কথা যেন মাঝপথে হারিয়ে না যায়। যা পাঠানো হয়েছে তার সবটা
              পৌঁছাবে, তারপর বন্ধ। দুই, দুই পাশই যেন নিশ্চিতভাবে জানে যে বন্ধ
              হয়েছে, যাতে কেউ একটা মরা Connection কে জীবিত ভেবে বসে না থাকে। এই
              লেসনের প্রতিটা নিয়ম, প্রতিটা State আর প্রতিটা Error এই দুই লক্ষ্যের
              কোনো একটার সাথে জড়িত। যখনই কিছু জটিল মনে হবে, নিজেকে জিজ্ঞেস করুন,
              এটা এই দুইটার কোনটা রক্ষা করছে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "two-directions",
      subHeader: { index: "002", title: "Two Directions" },
      title: <SectionTitle>একটা Connection আসলে দুইটা একমুখী রাস্তা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বন্ধ করতে চারটা Segment কেন লাগে, সেটা বুঝতে একটা জিনিস পরিষ্কার
                হওয়া দরকার। TCP Deep Dive লেসনে দেখেছেন, ফোন যা পাঠায় তার একটা
                আলাদা Sequence Number এর ধারা আছে, আর Server যা পাঠায় তার আরেকটা।
                দুইটা ধারা একে অপরের উপর নির্ভর করে না। মানে একটা TCP Connection
                আসলে পাশাপাশি দুইটা একমুখী রাস্তা। একটা দিয়ে তথ্য যায় ফোন থেকে
                Server এ, অন্যটা দিয়ে Server থেকে ফোনে।
              </ContentParagraph>
              <ContentParagraph>
                দুইটা রাস্তা যেহেতু আলাদা, দুইটা আলাদাভাবে বন্ধও করা যায়। আর
                প্রতিটা রাস্তা বন্ধ করতে দুইটা Segment লাগে। একজন বলে আমার পাঠানো
                শেষ, অন্যজন বলে শুনেছি। দুই রাস্তা, প্রতিটায় দুই Segment, মোট চার।
                হিসাবটা এতটুকুই।
              </ContentParagraph>
              <ContentParagraph>
                আমার পাঠানো শেষ, এই কথাটা বলার জন্য TCP Header এ একটা Flag আছে,
                তার নাম <strong>FIN</strong>, Finish এর ছোট রূপ। FIN এর মানেটা খুব
                নির্দিষ্ট, আর এটা প্রায় সবাই ভুল বোঝে। FIN মানে Connection বন্ধ
                করুন নয়। FIN মানে শুধু এটুকু: <em>আমার দিক থেকে আর কোনো তথ্য
                আসবে না</em>। যে FIN পাঠাল সে এখনো শুনতে পারে, আর অন্য পাশ এখনো
                পাঠাতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                একটা রাস্তা বন্ধ আর অন্যটা খোলা, এই অবস্থার নাম{" "}
                <strong>Half Close</strong>, মানে অর্ধেক বন্ধ। ফোনের কথায় ফিরলে,
                এটা সেই মুহূর্ত যখন আপনি বললেন আমার বলা শেষ, আপনি বলুন আমি শুনছি।
                বাস্তবে এটা কাজে লাগে। একটা Program পুরো একটা ফাইল পাঠিয়ে FIN দেয়,
                যার মানে ফাইল এখানেই শেষ। অন্য পাশ এই FIN দেখেই বোঝে পুরোটা এসে
                গেছে, তারপর সে ফলাফল ফেরত পাঠায় সেই এখনো খোলা রাস্তাটা দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "আপনার Program FIN কে কী নামে দেখে",
          content: (
            <p>
              আপনার Code কখনো FIN শব্দটা দেখে না, কারণ FIN Kernel এর ব্যাপার।
              Program এর কাছে এটা পৌঁছায় অন্য নামে। অন্য পাশের FIN এলে একটা Read
              শূন্য Byte ফেরত দেয়, যাকে বলে <strong>EOF</strong>, End of File, মানে
              পড়ার আর কিছু নেই। Node এ এটাই Socket এর <code>end</code> ঘটনা। আর
              আপনি নিজে FIN পাঠান <code>socket.end()</code> ডেকে। তাই মনে রাখার
              সহজ উপায়: end মানে FIN। Node এ এরপর <code>close</code> নামে আরেকটা
              ঘটনা আসে, সেটা মানে দুই রাস্তাই বন্ধ আর Socket টা পুরোপুরি শেষ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "four-steps",
      subHeader: { index: "003", title: "FIN and ACK" },
      title: <SectionTitle>চার ধাপ, আসল সংখ্যা দিয়ে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার পুরো Module এর সেই একই দৃশ্যে ফিরি। পর্যটকের ফোন{" "}
                <code>192.168.1.20</code>, Port <code>51514</code>। Island Tours এর
                Server <code>103.94.135.2</code>, Port <code>443</code>। বুকিং
                হয়ে গেছে, ফোনের আর কিছু চাওয়ার নেই। ধরুন এই মুহূর্ত পর্যন্ত ফোন
                মোট ৫০০০ Byte পাঠিয়েছে, তাই তার পরের Sequence Number 5001। Server
                পাঠিয়েছে ৯০০০ Byte, তার পরেরটা 9001।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CloseSequenceDiagram /> },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "ফোন পাঠায় FIN, seq=5001",
              description:
                "Browser ঠিক করল এই Connection আর লাগবে না, তাই Kernel কে বলল বন্ধ করতে। Kernel একটা Segment পাঠাল যার FIN Flag জ্বালানো। মানে, ৫০০০ Byte পর্যন্ত আমার যা বলার ছিল বলেছি, এরপর আর কিছু আসবে না। FIN নিজে কোনো তথ্য বহন না করলেও একটা Sequence Number খরচ করে, ঠিক যেমন Handshake এ SYN করেছিল। এই কারণেই পরের ধাপের সংখ্যাটা এক বাড়ে।",
            },
            {
              title: "Server পাঠায় ACK, ack=5002",
              description:
                "Server এর Kernel FIN টা পেয়ে সাথে সাথে ACK ফেরত দিল। ack=5002 মানে, 5001 পর্যন্ত সব পেয়েছি, যার মধ্যে আপনার FIN ও আছে। এই ACK টা Kernel নিজেই দেয়, Server এর Program কে জিজ্ঞেস করে না। একই সাথে Kernel Program কে জানায়, ওপাশ থেকে আর কিছু আসবে না। এখন ফোন থেকে Server এর দিকের রাস্তাটা বন্ধ।",
            },
            {
              title: "Server পাঠায় তার নিজের FIN, seq=9001",
              description:
                "Server এর Program এর যদি আরও কিছু পাঠানোর থাকে, সে এখন সেটা পাঠিয়ে নেয়। সব শেষ হলে সে নিজে বন্ধ করতে বলে, আর তখন তার Kernel নিজের FIN পাঠায়। দ্বিতীয় আর তৃতীয় ধাপের মাঝের এই ফাঁকটাই Half Close। ফাঁকটা এক মিলিসেকেন্ডের কম হতে পারে, আবার Program ভুলে গেলে অনন্তকালও হতে পারে।",
            },
            {
              title: "ফোন পাঠায় শেষ ACK, ack=9002",
              description:
                "ফোনের Kernel Server এর FIN পেয়ে শেষ ACK টা পাঠায়। Server এই ACK পেয়েই Connection টা খাতা থেকে মুছে ফেলে। কিন্তু ফোন মোছে না। সে কিছুক্ষণ অপেক্ষা করে, যে অপেক্ষার নাম TIME_WAIT। কেন, সেটা পাঁচ নম্বর সেকশনে।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখানে একটা প্রশ্ন আসা স্বাভাবিক। Handshake এ তো Server তার SYN আর
                ACK একটা Segment এ জুড়ে পাঠিয়েছিল, তাই তিন ধাপে হয়ে গিয়েছিল। এখানে
                দ্বিতীয় আর তৃতীয় ধাপ জুড়ে তিন ধাপে হয় না কেন? উত্তর হলো, হয়,
                যখন সম্ভব। খোলার সময় Server এর কিছু ভাবার ছিল না, তাই সে দুইটা এক
                সাথে পাঠাতে পেরেছিল। বন্ধের সময় ACK দেয় Kernel, সাথে সাথে। কিন্তু
                FIN পাঠানো যাবে কি না সেটা ঠিক করে Program, কারণ শুধু Program ই
                জানে তার আরও কিছু পাঠানোর আছে কি না। Program যদি খুব দ্রুত বন্ধ
                করতে বলে, Kernel ACK আর FIN এক Segment এ জুড়ে দেয়। তখন তারে আপনি
                দেখবেন তিনটা Segment: FIN, তারপর FIN আর ACK একসাথে, তারপর ACK।
                দুই ছবিই ঠিক, দুইটাই একই চার ধাপ।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা বিরল ক্ষেত্র আছে, নামটা জেনে রাখা ভালো। দুই পাশই যদি
                একদম একই মুহূর্তে FIN পাঠায়, একে বলে Simultaneous Close। তখন দুই
                পাশই একটা CLOSING নামের State পার হয়, আর দুইজনই শেষে TIME_WAIT এ
                যায়। বাস্তবে এটা খুব কম দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "কে আগে বিদায় বলে, তার একটা নাম আছে",
          content: (
            <p>
              যে পাশ আগে FIN পাঠায় তাকে বলে <strong>Active Closer</strong>, আর
              অন্য পাশকে বলে <strong>Passive Closer</strong>। এটা Client আর
              Server এর সাথে বাঁধা নয়। Client আগে বন্ধ করতে পারে, Server ও পারে।
              HTTP তে কে আগে বন্ধ করবে তা নির্ভর করে পরিস্থিতির উপর। Keep-Alive
              চালু থাকলে যার Idle Timeout আগে ফুরায় সে আগে বন্ধ করে। আর Response
              এ <code>Connection: close</code> থাকলে সাধারণত Server উত্তর দিয়েই
              বন্ধ করে। এই নাম দুইটা মনে রাখুন, কারণ TIME_WAIT কার ঘাড়ে পড়বে
              সেটা ঠিক হয় কে Active Closer তা দিয়ে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "states",
      subHeader: { index: "004", title: "States" },
      title: <SectionTitle>ছয়টা State, যেগুলো আপনি Terminal এ দেখবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                চার ধাপের প্রতিটার পর দুই পাশের খাতায় State এর নাম বদলায়। এই
                নামগুলো মুখস্থ করার জিনিস নয়, কিন্তু চেনার জিনিস। কারণ{" "}
                <code>netstat</code> বা <code>ss</code> চালালে আপনি ঠিক এই
                নামগুলোই দেখবেন, আর কোন নাম বেশি জমে আছে সেটা দেখেই বলে দেওয়া যায়
                সমস্যাটা কোথায়। নিচের Lab এ এক ধাপ করে এগিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CloseStepLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা নামের মানে নামের মধ্যেই লেখা আছে, শুধু একটু ভেঙে পড়তে
                হয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>FIN_WAIT_1</strong> (Active Closer): আমি FIN পাঠিয়েছি,
                  তার ACK এর অপেক্ষায় আছি। সাধারণত চোখের পলকে পার হয়ে যায়।
                </ListItem>
                <ListItem>
                  <strong>FIN_WAIT_2</strong> (Active Closer): আমার FIN এর ACK
                  পেয়েছি, এবার ওপাশের FIN এর অপেক্ষায়। ওপাশের Program যতক্ষণ না
                  বন্ধ করে, আমি এখানেই বসে থাকি।
                </ListItem>
                <ListItem>
                  <strong>CLOSE_WAIT</strong> (Passive Closer): ওপাশ FIN পাঠিয়েছে,
                  আমার Kernel ACK ও দিয়েছে, এখন আমার নিজের Program কখন close ডাকবে
                  তার অপেক্ষা। নামের মানে, Close এর জন্য Wait। এই State এ অপেক্ষাটা
                  Network এর জন্য নয়, নিজের Code এর জন্য। এটা মনে রাখুন, দশ নম্বর
                  সেকশনে এটাই একটা Bug এর চিহ্ন হয়ে ফিরবে।
                </ListItem>
                <ListItem>
                  <strong>LAST_ACK</strong> (Passive Closer): আমিও FIN পাঠিয়েছি,
                  এখন শেষ ACK টার অপেক্ষায়। পেলেই আমি শেষ।
                </ListItem>
                <ListItem>
                  <strong>TIME_WAIT</strong> (Active Closer): সব Segment এর আদান
                  প্রদান শেষ, তবু আমি কিছুক্ষণ পাতাটা রেখে দিচ্ছি। শুধু Active
                  Closer এই State এ যায়।
                </ListItem>
                <ListItem>
                  <strong>CLOSED</strong>: খাতায় আর কোনো পাতা নেই। এটা আসলে কোনো
                  State নয়, State না থাকার নাম। তাই Terminal এ CLOSED লেখা কোনো
                  লাইন দেখবেন না, লাইনটাই থাকবে না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আপনার নিজের যন্ত্রেই এই মুহূর্তে এগুলোর কয়েকটা আছে। নিচের কমান্ডটা
                সব TCP Connection কে State অনুযায়ী গুনে দেখায়। নিচের সংখ্যাগুলো
                এই লেসন লেখার সময় একটা Mac এ পাওয়া, আপনার যন্ত্রে সংখ্যা আলাদা
                হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "count-states.sh",
          code: `# macOS: সব TCP Connection, State অনুযায়ী গোনা
netstat -an -p tcp | awk '/^tcp/ {print $6}' | sort | uniq -c
#   1 CLOSE_WAIT
#  81 ESTABLISHED
#   7 LAST_ACK
#  25 LISTEN
#  23 TIME_WAIT

# Linux: একই কাজ ss দিয়ে
ss -tan | awk 'NR>1 {print $1}' | sort | uniq -c
# Linux এ নামগুলো একটু আলাদা বানানে আসে:
#   ESTAB, LISTEN, TIME-WAIT, CLOSE-WAIT, FIN-WAIT-1, FIN-WAIT-2, LAST-ACK`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এই তালিকা দেখে প্রথমে কী খুঁজবেন",
          content: (
            <p>
              ESTABLISHED আর LISTEN স্বাভাবিক। কয়েকটা TIME_WAIT ও সম্পূর্ণ স্বাভাবিক,
              এর মানে শুধু এই যে কিছু Connection এইমাত্র ভদ্রভাবে বন্ধ হয়েছে।
              FIN_WAIT_1 আর LAST_ACK খুব অল্প সময় থাকে, তাই এগুলো কম দেখবেন। নজর
              রাখার জিনিস দুইটা। CLOSE_WAIT এর সংখ্যা যদি বড় হয় আর বাড়তেই থাকে,
              আপনার নিজের Program এ একটা ফুটো আছে। আর TIME_WAIT যদি হাজার হাজার
              হয়, কেউ প্রতি Request এ নতুন Connection খুলছে। এই দুইটার আলাদা
              সেকশন সামনে আছে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "time-wait",
      subHeader: { index: "005", title: "TIME_WAIT" },
      title: <SectionTitle>TIME_WAIT, সব শেষ হওয়ার পরেও কেন দাঁড়িয়ে থাকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                চার ধাপের পর Passive Closer সোজা CLOSED হয়ে যায়, অথচ Active Closer
                দাঁড়িয়ে থাকে। প্রথম দেখায় এটা অপচয় মনে হয়। সব কথা তো শেষ, আর
                অপেক্ষা কীসের? অপেক্ষাটা একটা ছোট্ট কিন্তু গভীর সমস্যার জন্য:
                শেষ ACK টা যে পাঠাল, সে কোনোদিন জানতে পারে না ওটা পৌঁছাল কি না।
                কারণ ACK এর আবার ACK হয় না। হলে সেই ACK এরও ACK লাগত, আর এভাবে
                কোনোদিন শেষ হতো না।
              </ContentParagraph>
              <ContentParagraph>
                তাই শেষ ACK পাঠানোর পর Active Closer একটা নিরাপদ পথ নেয়। সে বলে,
                আমি পাতাটা এখনই ছিঁড়ছি না, কিছুক্ষণ রেখে দিচ্ছি, যদি কিছু গোলমাল
                হয়ে থাকে তাহলে যেন সামলাতে পারি। এই রেখে দেওয়াটা দুইটা আলাদা
                বিপদ ঠেকায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TimeWaitReasonsSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>কারণ এক, শেষ ACK হারালে ভদ্রভাবে আবার দেওয়া।</strong>{" "}
                  ধরুন ফোনের শেষ ACK টা পথে হারাল। Server তখন LAST_ACK এ বসে আছে,
                  ACK পায়নি। TCP Deep Dive লেসনের নিয়ম অনুযায়ী সে কিছুক্ষণ পর FIN
                  টা আবার পাঠাবে। এখন ফোন যদি ইতিমধ্যে পাতা ছিঁড়ে ফেলে থাকে, তার
                  Kernel এই FIN দেখে চিনতেই পারবে না এটা কোন Connection এর, আর
                  অচেনা Segment এর জবাবে যা দেওয়ার নিয়ম তাই দেবে, একটা RST। Server
                  তখন একটা ভদ্র বিদায়ের বদলে একটা Error পাবে। TIME_WAIT এ পাতাটা
                  থাকে বলেই ফোন FIN টা চেনে আর আবার ACK দেয়।
                </ListItem>
                <ListItem>
                  <strong>কারণ দুই, পুরনো Segment যেন নতুন Connection এ না ঢোকে।</strong>{" "}
                  Port & Socket লেসনে দেখেছেন, একটা Connection এর পরিচয় চারটা
                  সংখ্যা। ধরুন পুরনো Connection এর একটা Segment কোনো Router এ
                  আটকে থেকে দেরিতে আসছে। এর মধ্যে ফোন যদি ঠিক একই Port 51514 থেকে
                  ঠিক একই Server এ নতুন একটা Connection খোলে, চার সংখ্যা হুবহু
                  মিলে যাবে। তখন সেই দেরি করা পুরনো Segment টা নতুন Connection এর
                  তথ্যের মধ্যে ঢুকে পড়তে পারে। একটা বুকিং এর তথ্যের মাঝে আগের
                  বুকিং এর কয়েকটা Byte। TIME_WAIT ওই চার সংখ্যার জোড়াটাকে ততক্ষণ
                  তালা মেরে রাখে, যতক্ষণ না পথের সব পুরনো Segment নিশ্চিতভাবে মরে
                  গেছে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                কতক্ষণ অপেক্ষা করলে নিশ্চিত হওয়া যায়? এর জন্য একটা সংখ্যা ধরে
                নেওয়া হয়, যার নাম <strong>MSL</strong>, Maximum Segment Lifetime।
                মানে একটা Segment Internet এ সর্বোচ্চ কতক্ষণ বেঁচে থাকতে পারে।
                TIME_WAIT এর দৈর্ঘ্য হলো এর দ্বিগুণ, তাই একে লেখা হয়{" "}
                <strong>2MSL</strong>। দ্বিগুণ কেন? এক MSL হারানো ACK টার যাওয়ার
                সর্বোচ্চ সময়, আরেক MSL তার জবাবে আবার পাঠানো FIN এর ফিরে আসার
                সর্বোচ্চ সময়।
              </ContentParagraph>
              <ContentParagraph>
                মূল নিয়মের কাগজে MSL ধরা হয়েছিল দুই মিনিট, মানে TIME_WAIT চার
                মিনিট। আজকের Operating System গুলো এর চেয়ে অনেক ছোট সংখ্যা ব্যবহার
                করে। Linux এ TIME_WAIT ৬০ সেকেন্ড, আর এটা Kernel এর ভেতরে বাঁধা,
                কোনো Setting দিয়ে বদলানো যায় না। macOS এ MSL ১৫ সেকেন্ড, তাই
                TIME_WAIT ৩০ সেকেন্ড। নিচের পরীক্ষাটা এই লেসন লেখার সময় একটা Mac
                এ চালানো, আর ফলাফল এসেছিল ৩১ সেকেন্ড, হিসাবের সাথে মিলে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "see-time-wait.sh",
          code: `# macOS এ MSL কত, মিলিসেকেন্ডে
sysctl net.inet.tcp.msl
# net.inet.tcp.msl: 15000        (১৫ সেকেন্ড, তাই TIME_WAIT = ৩০ সেকেন্ড)

# একটা Connection খুলে নিজে আগে বন্ধ করুন, তারপর দেখুন
curl -s -o /dev/null https://example.com
netstat -an -p tcp | grep TIME_WAIT
# tcp4   0   0  192.168.0.103.60188   104.20.23.154.443   TIME_WAIT
#               ^ নিজের IP আর Port     ^ ওপাশের IP আর Port
# (সংখ্যাগুলো যে যন্ত্রে চালানো হয়েছিল তার, আপনার যন্ত্রে আলাদা হবে)
# আধা মিনিট পরে আবার চালান, লাইনটা আর থাকবে না।

# Linux এ
ss -tan state time-wait`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "TIME_WAIT কী আটকে রাখে, আর কী রাখে না",
          content: (
            <p>
              এটা ঠিকঠাক বোঝা জরুরি, কারণ পরের দুই সেকশন এর উপর দাঁড়িয়ে। TIME_WAIT
              একটা পুরো Port আটকে রাখে না। আটকে রাখে চার সংখ্যার একটা নির্দিষ্ট
              জোড়া। উপরের উদাহরণে তালা পড়েছে শুধু এই সমন্বয়ে: এই IP, Port 51514,
              ওই Server, Port 443। ফোন চাইলে এই মুহূর্তেই Port 51515 থেকে একই
              Server এ নতুন Connection খুলতে পারে। এমনকি 51514 থেকেই অন্য কোনো
              Server এও খুলতে পারে। আর খরচের দিক থেকে একটা TIME_WAIT পাতা Kernel
              এর স্মৃতির সামান্য একটু জায়গা নেয়, কোনো CPU নেয় না। তাই কয়েকশো
              TIME_WAIT দেখে ঘাবড়ানোর কিছু নেই।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "address-in-use",
      subHeader: { index: "006", title: "Address Already in Use" },
      title: <SectionTitle>Server Restart করলাম, বলছে Address already in use</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                TIME_WAIT এর সাথে একজন Developer এর প্রথম দেখা হয় সাধারণত এই
                Error দিয়ে। আপনি Server টা থামালেন, এক সেকেন্ড পর আবার চালালেন,
                আর সে বলল <code>Address already in use</code>, Node এ যার নাম{" "}
                <code>EADDRINUSE</code>। আপনি দেখলেন ওই Port এ কোনো Process নেই।
                তাহলে ব্যবহার করছে কে?
              </ContentParagraph>
              <ContentParagraph>
                Port & Socket লেসনে এই Error এর একটা কারণ দেখেছেন: ওই Port এ
                সত্যিই আরেকটা Process বসে আছে। এখানে দ্বিতীয় কারণটা। Server টা
                থামার সময় তার খোলা Connection গুলো সে নিজেই আগে বন্ধ করেছে, তাই
                সে Active Closer, আর সেই Connection গুলো এখন TIME_WAIT এ। এদের
                প্রত্যেকটার চার সংখ্যার মধ্যে আপনার Server এর Port টা আছে। এখন
                নতুন Process এসে ওই Port এ বসতে চাইলে Kernel পুরনো নিয়মে সাবধান
                হয়ে বলে, এই Port এর কিছু পুরনো হিসাব এখনো মেটেনি, অপেক্ষা করুন।
              </ContentParagraph>
              <ContentParagraph>
                Kernel এর এই সাবধানতাটা একটু বেশি কড়া। কারণ নতুন Process টা শুধু
                Port এ কান পাততে চাইছে, পুরনো চার সংখ্যার জোড়াগুলো ছুঁতে চাইছে
                না। তাই একটা Socket Option আছে যেটা দিয়ে Program বলতে পারে, আমি
                জানি এখানে TIME_WAIT এর পাতা আছে, তবু আমাকে বসতে দিন। Option টার
                নাম <strong>SO_REUSEADDR</strong>। এটা চালু থাকলে TIME_WAIT থাকা
                সত্ত্বেও Bind সফল হয়। কিন্তু ওই Port এ যদি সত্যিই আরেকটা জীবিত
                Process কান পেতে থাকে, তখন SO_REUSEADDR দিয়েও হবে না, আর সেটাই
                হওয়া উচিত।
              </ContentParagraph>
              <ContentParagraph>
                নিচের পরীক্ষাটা এই লেসন লেখার সময় চালানো। একটা ছোট Python Program
                একটা Port এ বসে, একটা Connection নেয়, Server হিসেবে নিজে আগে সেটা
                বন্ধ করে, তারপর থেমে গিয়ে সাথে সাথে আবার একই Port এ বসার চেষ্টা
                করে। একবার SO_REUSEADDR ছাড়া, একবার সহ। পুরো Program টা নিচের Lab
                এ আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "restart-result.sh",
          code: `LAB_PORT=47005 python3 rebind.py plain
# restart failed: [Errno 48] Address already in use

LAB_PORT=47006 python3 rebind.py reuse
# restart: OK

# তফাত শুধু এক লাইন:
#   s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ভালো খবর হলো, আপনাকে সাধারণত নিজে কিছু করতে হয় না। Node এর{" "}
                <code>net</code> আর <code>http</code> Module, Nginx, আর প্রায় সব
                আধুনিক Web Framework কান পাতার সময় নিজে থেকেই SO_REUSEADDR চালু
                করে নেয়। এই কারণেই Node Server থামিয়ে সাথে সাথে চালালে সাধারণত
                কোনো সমস্যা হয় না। সমস্যাটা দেখবেন নিজে নিচু স্তরের Socket Code
                লিখলে, কিছু পুরনো Program এ, আর Network Programming শেখার প্রথম
                দিনে।
              </ContentParagraph>
              <ContentParagraph>
                তাই এই Error দেখলে রোগ নির্ণয়ের ক্রমটা এই। প্রথমে দেখুন Port টা
                কোনো জীবিত Process ধরে আছে কি না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "who-holds-the-port.sh",
          code: `# macOS আর Linux দুইটাতেই চলে: Port 3000 এ কে কান পেতে আছে
lsof -nP -iTCP:3000 -sTCP:LISTEN
# COMMAND   PID     USER   FD   TYPE  ...  NAME
# node    20311 devripon   12u  IPv4  ...  TCP 127.0.0.1:3000 (LISTEN)

# Linux
ss -ltnp | grep ':3000'

# কোনো লাইন এলে: একটা জীবিত Process আছে। আগে তাকে থামান।
# কোনো লাইন না এলে, অথচ Error আসছে: এটা TIME_WAIT।
netstat -an -p tcp | grep '\\.3000 ' | grep TIME_WAIT`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "একই নামের কাছাকাছি আরেকটা Option, গুলিয়ে ফেলবেন না",
          content: (
            <p>
              SO_REUSEADDR এর পাশেই আরেকটা Option আছে, <strong>SO_REUSEPORT</strong>।
              নাম প্রায় এক, কাজ একদম আলাদা। SO_REUSEADDR বলে, TIME_WAIT এর পুরনো
              পাতা থাকলেও আমাকে বসতে দিন। SO_REUSEPORT বলে, একাধিক জীবিত Process
              কে একই সাথে একই Port এ কান পাততে দিন, আর Kernel নতুন Connection গুলো
              তাদের মধ্যে ভাগ করে দিক। দ্বিতীয়টা কাজে লাগে একটা যন্ত্রে একই
              Server এর অনেকগুলো Worker চালাতে। Restart এর Error সারাতে প্রথমটাই
              লাগে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "many-time-wait",
      subHeader: { index: "007", title: "TIME_WAIT at Scale" },
      title: <SectionTitle>হাজার হাজার TIME_WAIT, আর Port ফুরিয়ে যাওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কয়েকটা TIME_WAIT নিরীহ। কিন্তু একটা বিশেষ পরিস্থিতিতে এরা সত্যিই
                একটা System থামিয়ে দিতে পারে, আর সেটা কোথায় ঘটে তা জানা থাকলে
                আপনি আগেই ঠেকাতে পারবেন।
              </ContentParagraph>
              <ContentParagraph>
                ভাবুন একটা যন্ত্র যে নিজে অনেক Connection খোলে, সবগুলো একই
                গন্তব্যে। যেমন Island Tours এর App Server, যে প্রতিটা বুকিং এ
                Database এ যায়। অথবা একটা Reverse Proxy, যে প্রতিটা Request পেছনের
                App এ পাঠায়। এই যন্ত্রটা যদি প্রতি Request এ নতুন Connection খোলে
                আর কাজ শেষে নিজেই বন্ধ করে, তাহলে সে প্রতিবার Active Closer, আর
                প্রতিটা বন্ধ Connection একটা TIME_WAIT রেখে যায়।
              </ContentParagraph>
              <ContentParagraph>
                এবার হিসাবটা করি। চার সংখ্যার মধ্যে তিনটা এখানে স্থির: নিজের IP,
                Database এর IP, Database এর Port। বদলাতে পারে শুধু নিজের Ephemeral
                Port। Port & Socket লেসনে দেখেছেন, Linux এ Ephemeral Port এর সীমা
                সাধারণত 32768 থেকে 60999, মানে ২৮ হাজারের কিছু বেশি। প্রতিটা বন্ধ
                Connection তার Port টাকে ওই গন্তব্যের জন্য ৬০ সেকেন্ড আটকে রাখে।
                তাহলে ২৮ হাজারকে ৬০ দিয়ে ভাগ করুন। সেকেন্ডে মোটামুটি ৪৭০টার বেশি
                নতুন Connection টানা খুলতে থাকলে এক মিনিটের মাথায় সব Port
                TIME_WAIT এ আটকে যাবে। তখন নতুন Connection খুলতে গেলে Kernel বলবে
                দেওয়ার মতো Port নেই, আর Program দেখবে <code>EADDRNOTAVAIL</code>{" "}
                অথবা Cannot assign requested address।
              </ContentParagraph>
              <ContentParagraph>
                খেয়াল করুন, সমস্যাটা হয় যে যন্ত্র Connection খোলে তার, যে কান পেতে
                থাকে তার নয়। একটা Server এর Port 443 এ দশ লাখ TIME_WAIT থাকলেও সে
                নতুন Connection নিতে পারে, কারণ প্রতিটা নতুন Client এর IP আর Port
                আলাদা, তাই চার সংখ্যা আলাদা।
              </ContentParagraph>
              <ContentParagraph>
                সমাধান TIME_WAIT কমানো নয়, Connection খোলাই কমানো।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Connection আবার ব্যবহার করুন।</strong> এটাই আসল সমাধান।
                  Database এর জন্য <strong>Connection Pool</strong>, মানে কয়েকটা
                  Connection একবার খুলে রেখে সব Query তাদের দিয়ে ঘুরিয়ে ফিরিয়ে
                  চালানো। HTTP এর জন্য Keep-Alive। Three-way Handshake লেসনে
                  এগুলোকে Handshake এর খরচ বাঁচানোর উপায় হিসেবে দেখেছেন। এখন
                  দেখছেন একই জিনিস বন্ধ করার খরচও বাঁচায়। একটা Connection একশো
                  Request এ ব্যবহার হলে একশোটার বদলে একটা TIME_WAIT।
                </ListItem>
                <ListItem>
                  <strong>Linux এর tcp_tw_reuse।</strong> এটা একটা Kernel Setting,
                  যা চালু থাকলে নিজে খোলা নতুন Connection এর জন্য Kernel একটা
                  TIME_WAIT এ থাকা Port আবার ব্যবহার করতে পারে, যদি TCP Timestamp
                  দেখে নিশ্চিত হওয়া যায় যে পুরনো Segment গুলিয়ে যাবে না। এটা শুধু
                  বাইরের দিকে খোলা Connection এ খাটে। এটা একটা ব্যথা কমানোর উপায়,
                  রোগ সারানোর নয়।
                </ListItem>
                <ListItem>
                  <strong>যা করবেন না।</strong> পুরনো লেখায়{" "}
                  <code>tcp_tw_recycle</code> নামে আরেকটা Setting চালু করতে বলা
                  হয়। এটা NAT এর পেছনের Client দের Connection ভেঙে দিত, আর এই
                  কারণে Linux থেকে এটা সরিয়েই ফেলা হয়েছে। কোনো নির্দেশিকায় এটা
                  দেখলে বুঝবেন লেখাটা পুরনো।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "কাউকে বোঝাতে হলে এই এক লাইন",
          content: (
            <p>
              TIME_WAIT নিজে সমস্যা নয়, এটা একটা চিহ্ন। অনেক TIME_WAIT মানে অনেক
              Connection খোলা আর বন্ধ হচ্ছে। তাই প্রশ্নটা হওয়া উচিত TIME_WAIT
              কীভাবে সরাব তা নয়, বরং এত Connection খুলছি কেন। প্রায় সবসময় উত্তর
              হয়, কোথাও একটা Pool বা Keep-Alive চালু করা বাদ পড়েছে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "rst",
      subHeader: { index: "008", title: "RST" },
      title: <SectionTitle>RST, কথার মাঝখানে লাইন কেটে দেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ ভদ্র বিদায়ের গল্প বললাম। কিন্তু সব বিদায় ভদ্র হয় না। TCP
                Header এ আরেকটা Flag আছে, <strong>RST</strong>, Reset এর ছোট রূপ।
                RST এর মানে: এই Connection এখনই, এই মুহূর্তে শেষ, কোনো প্রশ্ন নয়।
                এটা কথার মাঝখানে ফোন আছড়ে রেখে দেওয়া।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FinVsRstSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                FIN আর RST এর তফাত তিন জায়গায়। FIN এর ACK লাগে, RST এর কোনো উত্তর
                লাগে না। FIN এর আগে পথে থাকা সব তথ্য পৌঁছে দেওয়া হয়, RST এ যা
                পাঠানো বাকি ছিল আর যা পৌঁছে গিয়েও পড়া হয়নি, সব ফেলে দেওয়া হয়। আর
                FIN এর পরে TIME_WAIT আছে, RST এর পরে কিছুই নেই, দুই পাশই সাথে সাথে
                পাতা ছিঁড়ে ফেলে।
              </ContentParagraph>
              <ContentParagraph>
                RST কে খারাপ ভাবার দরকার নেই। এটা TCP এর জরুরি বোতাম, আর কিছু
                পরিস্থিতিতে এটাই সঠিক উত্তর। কখন কখন একটা RST পাঠানো হয়, সেই
                তালিকাটা জানা থাকলে আপনি একটা RST দেখেই আন্দাজ করতে পারবেন কী
                ঘটেছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>যে Port এ কেউ কান পেতে নেই, সেখানে SYN এলে।</strong>{" "}
                  Three-way Handshake লেসনে এটা দেখেছেন। Kernel RST দিয়ে বলে এখানে
                  কেউ নেই, আর Client দেখে Connection refused, Node এ{" "}
                  <code>ECONNREFUSED</code>।
                </ListItem>
                <ListItem>
                  <strong>এমন Connection এর Segment এলে, যার পাতা খাতায় নেই।</strong>{" "}
                  যেমন Server টা Reboot হয়েছে আর আগের সব Connection ভুলে গেছে।
                  Client কিছু না জেনে পুরনো Connection এ তথ্য পাঠাল। Server এর
                  Kernel বলে এই Connection আমি চিনি না, আর RST দেয়।
                </ListItem>
                <ListItem>
                  <strong>বন্ধ করা Connection এ তথ্য এলে।</strong> আপনার Program
                  Socket পুরোপুরি বন্ধ করে দিয়েছে, অথচ ওপাশ আরও তথ্য পাঠাল। সেই
                  তথ্য নেওয়ার কেউ নেই, তাই Kernel RST দিয়ে জানায় এগুলো কোথাও
                  পৌঁছায়নি।
                </ListItem>
                <ListItem>
                  <strong>না পড়া তথ্য রেখে বন্ধ করলে।</strong> Kernel এর Buffer এ
                  ওপাশের পাঠানো কিছু তথ্য জমে আছে, যা আপনার Program পড়েনি, আর সেই
                  অবস্থায় Program টা close ডাকল। Kernel তখন FIN এর বদলে RST পাঠায়।
                  যুক্তিটা সৎ: ওপাশের জানা দরকার যে তার পাঠানো তথ্যের একটা অংশ কেউ
                  পড়েনি।
                </ListItem>
                <ListItem>
                  <strong>Program নিজে চাইলে।</strong> কিছু ক্ষেত্রে Program
                  ইচ্ছা করে RST পাঠায়, যেমন একটা সন্দেহজনক Client কে সাথে সাথে
                  বিদায় করতে। Node এ এর জন্য <code>socket.resetAndDestroy()</code>{" "}
                  আছে। নিচু স্তরে এটা করা হয় SO_LINGER নামের Option এ শূন্য সময়
                  বসিয়ে।
                </ListItem>
                <ListItem>
                  <strong>মাঝখানের কেউ পাঠালে।</strong> একটা Firewall, Load
                  Balancer বা NAT যন্ত্র যখন একটা Connection আর রাখতে চায় না, বা
                  তাকে ভুলে গেছে, সে এক বা দুই পাশে RST পাঠিয়ে দিতে পারে। দুই
                  প্রান্তের কেউ এটা পাঠায়নি, তবু দুইজনই পায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একটা সূক্ষ্ম কিন্তু জরুরি কথা। Program টা Crash করলে কী হয়? অনেকে
                ভাবেন তখন RST যায়। সাধারণত যায় না। Program মরলেও Kernel বেঁচে
                আছে, আর Kernel সেই মৃত Process এর সব Socket নিজে গুছিয়ে বন্ধ করে,
                মানে FIN পাঠায়। ওপাশ একটা স্বাভাবিক বিদায়ই দেখে। কিছুই যায় না
                শুধু তখন, যখন পুরো যন্ত্রটাই হঠাৎ হারিয়ে যায়: বিদ্যুৎ চলে গেল,
                তার খুলে গেল, Kernel নিজেই আটকে গেল। সেই ক্ষেত্রটা এগারো নম্বর
                সেকশনের বিষয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "FIN আর RST, দুই বাক্যে",
          content: (
            <p>
              FIN বলে, আমার বলা শেষ, আপনি আপনার কথা শেষ করুন। RST বলে, এই Connection
              বলে আমার কাছে কিছু নেই, বা আর থাকবে না। প্রথমটা একটা সম্মতি, দ্বিতীয়টা
              একটা ঘোষণা। আপনার Log এ প্রথমটা নীরব থাকে, কারণ ভদ্র বিদায় কোনো Error
              নয়। দ্বিতীয়টাই Error হয়ে দেখা দেয়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "errors",
      subHeader: { index: "009", title: "Error Messages" },
      title: <SectionTitle>ECONNRESET, EPIPE, socket hang up: বার্তাগুলো পড়তে শেখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার সেই Error গুলোর কাছে আসি, যেগুলো আপনি Log এ দেখবেন। এদের নাম
                ভয়ের মনে হলেও প্রতিটা একটা নির্দিষ্ট ঘটনার কথা বলে, আর ঘটনাগুলো
                আপনি এখন চেনেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ECONNRESET</strong>, অন্য ভাষায় Connection reset by
                  peer। মানে ওপাশ থেকে একটা RST এসেছে। Peer মানে Connection এর
                  অন্য প্রান্ত। আপনার Program তখন পড়ছিল বা লিখছিল, আর Kernel
                  জানাল এই Connection আর নেই। আগের সেকশনের ছয়টা কারণের যেকোনো
                  একটা ঘটেছে।
                </ListItem>
                <ListItem>
                  <strong>socket hang up</strong>। এটা Node এর HTTP Client এর
                  নিজস্ব বার্তা। মানে একটা Request পাঠানো হয়েছিল, কিন্তু পুরো
                  Response আসার আগেই Connection বন্ধ হয়ে গেছে। Node এই Error এর
                  Code হিসেবেও ECONNRESET ই দেয়। তাই এই দুইটাকে একই পরিবারের ধরুন।
                </ListItem>
                <ListItem>
                  <strong>EPIPE</strong>, অন্য ভাষায় Broken pipe। মানে আপনার
                  Program এমন একটা Connection এ লিখতে গেছে, যেটা যে বন্ধ তা Kernel
                  আগে থেকেই জানে। ECONNRESET এর সাথে তফাতটা সময়ের। প্রথমবার লেখার
                  উত্তরে RST আসে, সেটা ECONNRESET হিসেবে দেখা দিতে পারে। তারপরও
                  লিখতে থাকলে Kernel আর কিছু পাঠায়ই না, সোজা বলে দেয় এই নল ভাঙা,
                  সেটা EPIPE।
                </ListItem>
                <ListItem>
                  <strong>ETIMEDOUT</strong>। Three-way Handshake লেসনে এটা
                  দেখেছেন খোলার সময়, যখন SYN এর উত্তর আসে না। খোলা Connection এও
                  এটা আসতে পারে: পাঠানো তথ্যের ACK বারবার চেষ্টাতেও এলো না। মানে
                  ওপাশ বা মাঝের রাস্তা নীরবে হারিয়ে গেছে, কেউ FIN বা RST কিছুই
                  পাঠায়নি।
                </ListItem>
                <ListItem>
                  <strong>unexpected EOF</strong>, বা premature close। মানে একটা
                  FIN এসেছে, কিন্তু এমন জায়গায় যেখানে আপনার Program আরও তথ্য আশা
                  করছিল। ওপাশ ভদ্রভাবেই বন্ধ করেছে, কিন্তু কথা শেষ না করে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের Lab এ সাতটা উপসর্গ আছে, যার মধ্যে এই Error গুলো আর সামনের
                সেকশনের কয়েকটা সমস্যাও আছে। প্রতিটায় ক্লিক করে উল্টো দিকে হাঁটুন:
                বার্তা থেকে তারে কী ঘটেছিল, সেখান থেকে কী করতে হবে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CloseSymptomLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                EPIPE টা নিজের চোখে দেখা সহজ। নিচের ফলাফলটা একটা ছোট Node Program
                এর, যেখানে Server Connection পেয়েই বন্ধ করে দেয়, আর Client সেটা
                উপেক্ষা করে লিখতেই থাকে। প্রথম Write টা যায়, তার জবাবে RST আসে।
                দ্বিতীয় Write এ Kernel সোজা EPIPE দেয়। পুরো Program নিচের Lab এ
                আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "epipe-result.sh",
          code: `LAB_PORT=47007 node epipe.mjs
# client: server sent FIN, but I keep writing
# write 1
# write 2
# client error: EPIPE`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "এই Error গুলো না ধরলে পুরো Process পড়ে যায়",
          content: (
            <p>
              Node এ একটা Socket এর <code>error</code> ঘটনা যদি কেউ না শোনে, সেই
              একটা ECONNRESET পুরো Process টাকে থামিয়ে দেয়, আর তার সাথে সেই
              মুহূর্তে চলা বাকি সব পর্যটকের Request ও। একজন পর্যটকের ফোন সুড়ঙ্গে
              ঢুকে Network হারালে পুরো Server পড়ে যাওয়া উচিত নয়। তাই নিয়মটা সহজ:
              প্রতিটা Socket, প্রতিটা বাইরের Request আর প্রতিটা Stream এ Error
              ধরার ব্যবস্থা থাকবে। ওপাশ যেকোনো মুহূর্তে হারিয়ে যেতে পারে, এটা
              ব্যতিক্রম নয়, এটাই Network এর স্বাভাবিক আচরণ।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "close-wait",
      subHeader: { index: "010", title: "CLOSE_WAIT Leak" },
      title: <SectionTitle>CLOSE_WAIT জমছে মানে দোষটা নিজের Code এ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                চার নম্বর সেকশনে বলেছিলাম CLOSE_WAIT এর অপেক্ষাটা Network এর জন্য
                নয়, নিজের Program এর জন্য। এবার দেখি সেটা কেন এত গুরুত্বপূর্ণ।
              </ContentParagraph>
              <ContentParagraph>
                CLOSE_WAIT এ একটা Connection তখনই থাকে, যখন ওপাশ FIN পাঠিয়ে দিয়েছে,
                Kernel তার ACK দিয়ে দিয়েছে, আর এখন সবাই অপেক্ষা করছে আপনার Program
                কখন বলবে আমারও শেষ। সুস্থ একটা Program এ এই অপেক্ষা কয়েক
                মিলিসেকেন্ডের। Program টা EOF দেখে, হাতের কাজ গুছিয়ে close ডাকে,
                Kernel FIN পাঠায়, শেষ।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু Program যদি কখনোই close না ডাকে? তাহলে Connection টা
                CLOSE_WAIT এ বসে থাকবে যতদিন Process বেঁচে আছে। এর কোনো Timeout
                নেই। Kernel নিজে থেকে কখনো এটা বন্ধ করবে না, কারণ Kernel এর
                দৃষ্টিতে আপনার Program এর হয়তো এখনো কিছু পাঠানোর আছে। এভাবে একটা
                একটা করে জমতে থাকাকে বলে <strong>Leak</strong>, ফুটো দিয়ে পানি
                চুইয়ে পড়ার মতো। Module 01 এর Memory লেসনে Memory Leak দেখেছিলেন,
                এটা তারই ভাই, Socket Leak।
              </ContentParagraph>
              <ContentParagraph>
                ক্ষতিটা কোথায়? প্রতিটা খোলা Socket একটা{" "}
                <strong>File Descriptor</strong> ধরে রাখে, যেটা Port & Socket
                লেসনে দেখেছেন। একটা Process কতগুলো File Descriptor রাখতে পারবে
                তার একটা সীমা আছে, অনেক System এ ১০২৪। Leak চলতে থাকলে একদিন সেই
                সীমা ছুঁয়ে যায়, আর তখন Process টা নতুন কোনো Connection নিতে পারে
                না, ফাইলও খুলতে পারে না। Log এ দেখবেন <code>EMFILE</code>, অথবা
                Too many open files। সাইট তখন চালু, কিন্তু কাউকে উত্তর দিচ্ছে না।
              </ContentParagraph>
              <ContentParagraph>
                নিচের ফলাফলটা একটা ইচ্ছা করে ভুল লেখা Server এর। সে Client এর FIN
                শোনে, কিন্তু নিজের দিক বন্ধ করতে ভুলে যায়। তিনজন Client এসে বিদায়
                বলে চলে গেল। Server এর দিকে তিনটা CLOSE_WAIT পড়ে রইল, আর Client এর
                দিকে তিনটা FIN_WAIT_2, যারা Server এর FIN এর জন্য অপেক্ষা করছে যা
                কখনো আসবে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "close-wait-leak.sh",
          code: `netstat -an -p tcp | grep 47009
# tcp4  0  0  127.0.0.1.47009   127.0.0.1.57332   CLOSE_WAIT    <- Server এর দিক
# tcp4  0  0  127.0.0.1.47009   127.0.0.1.57331   CLOSE_WAIT
# tcp4  0  0  127.0.0.1.47009   127.0.0.1.57330   CLOSE_WAIT
# tcp4  0  0  127.0.0.1.57332   127.0.0.1.47009   FIN_WAIT_2    <- Client এর দিক
# tcp4  0  0  127.0.0.1.57331   127.0.0.1.47009   FIN_WAIT_2
# tcp4  0  0  127.0.0.1.57330   127.0.0.1.47009   FIN_WAIT_2
# tcp4  0  0  127.0.0.1.47009   *.*               LISTEN

# Production এ সন্দেহ হলে: কোন Process এর কত CLOSE_WAIT
# Linux
ss -tanp state close-wait | awk 'NR>1 {print $NF}' | sort | uniq -c | sort -rn
# একটা Process কতগুলো File Descriptor খুলে রেখেছে (PID বসিয়ে)
ls /proc/PID/fd | wc -l      # Linux
lsof -p PID | wc -l          # macOS আর Linux`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বাস্তবে এই Bug কোথায় লুকিয়ে থাকে? প্রায় সবসময় Error এর পথে।
                স্বাভাবিক পথে সবাই Connection বন্ধ করে, কিন্তু মাঝপথে একটা
                Exception উঠলে Code লাফ দিয়ে বেরিয়ে যায়, আর বন্ধ করার লাইনটা আর
                চলে না। আরও কয়েকটা চেনা জায়গা: একটা HTTP Response পাঠানো শুরু করে
                শেষ না করা, একটা বাইরের API এর উত্তরের Body না পড়ে ফেলে রাখা,
                একটা Database Connection Pool থেকে নিয়ে ফেরত না দেওয়া।
              </ContentParagraph>
              <ContentParagraph>
                আর Client এর দিকের FIN_WAIT_2 এর কী হয়? Client এর Program যদি
                Socket পুরোপুরি বন্ধ করে দিয়ে থাকে, তাহলে তার Kernel অনন্তকাল
                অপেক্ষা করে না। Linux এ <code>tcp_fin_timeout</code> নামের একটা
                Setting আছে, Default ৬০ সেকেন্ড, যার পরে Kernel এমন অনাথ Connection
                ফেলে দেয়। কিন্তু Server এর CLOSE_WAIT এর এমন কোনো রক্ষাকবচ নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "TIME_WAIT আর CLOSE_WAIT, দুইটা গুলিয়ে ফেলা সবচেয়ে চেনা ভুল",
          content: (
            <p>
              নাম কাছাকাছি, মানে পুরো উল্টো। <strong>TIME_WAIT</strong> থাকে Active
              Closer এর কাছে, নিজে থেকে সেরে যায়, এর জন্য আপনার Code দায়ী নয়, আর
              এটা সুস্থতার চিহ্ন। <strong>CLOSE_WAIT</strong> থাকে Passive Closer
              এর কাছে, নিজে থেকে কখনো সারে না, এর জন্য আপনার Code ই দায়ী, আর জমতে
              থাকলে এটা একটা Bug। কেউ যদি বলেন Server এ অনেক Connection ঝুলে আছে,
              আপনার প্রথম প্রশ্ন হবে, কোন State এ। উত্তরটাই বলে দেবে কোথায় খুঁজতে
              হবে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "half-open",
      subHeader: { index: "011", title: "Half-open and Keepalive" },
      title: <SectionTitle>ওপাশ হারিয়ে গেছে, অথচ কেউ জানায়নি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                FIN একটা ভদ্র খবর, RST একটা রূঢ় খবর, কিন্তু দুইটাই খবর। এবার
                সবচেয়ে বিরক্তিকর ক্ষেত্রটা: কোনো খবরই আসে না।
              </ContentParagraph>
              <ContentParagraph>
                পর্যটক বুকিং এর মাঝখানে লঞ্চে উঠলেন আর ফোনের Network চলে গেল।
                অথবা ফোনের চার্জ শেষ। অথবা Server এর Data Center এ বিদ্যুৎ গেল।
                এই সব ক্ষেত্রে হারিয়ে যাওয়া যন্ত্রটা FIN বা RST পাঠানোর সুযোগই
                পায় না। অন্য পাশের খাতায় Connection টা তখনো ESTABLISHED, খোলা আর
                সুস্থ। এক পাশে আছে, অন্য পাশে নেই, এমন Connection কে বলে{" "}
                <strong>Half-open Connection</strong>।
              </ContentParagraph>
              <ContentParagraph>
                নামটা Half Close এর সাথে গুলিয়ে ফেলবেন না। Half Close ইচ্ছাকৃত আর
                সুস্থ: একজন FIN পাঠিয়েছে, দুইজনই জানে। Half-open একটা দুর্ঘটনা:
                একজন নেই, অন্যজন জানে না।
              </ContentParagraph>
              <ContentParagraph>
                এখানে TCP এর একটা আচরণ প্রথম শুনলে অবাক লাগে। দুই পাশ চুপ থাকলে
                একটা TCP Connection এ কোনো Segment ই যায় না। একদম শূন্য। TCP
                নিজে থেকে মাঝে মাঝে আছেন তো জিজ্ঞেস করে না। তাই যে পাশ শুধু শুনছে
                আর কিছু পাঠাচ্ছে না, সে কোনোদিনই টের পাবে না যে ওপাশ নেই। একটা
                Half-open Connection ঘণ্টার পর ঘণ্টা, দিনের পর দিন বসে থাকতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                যে পাশ কিছু পাঠাতে যায়, সে একসময় টের পায়, তবে দুই রকমভাবে। ওপাশের
                যন্ত্র যদি Reboot হয়ে ফিরে এসে থাকে, সে অচেনা Segment দেখে RST
                দেয়, আর আপনি সাথে সাথে ECONNRESET পান। কিন্তু ওপাশ যদি একদমই না
                থাকে, কোনো উত্তরই আসে না। তখন আপনার Kernel TCP Deep Dive লেসনের
                নিয়মে বারবার আবার পাঠায়, প্রতিবার অপেক্ষা দ্বিগুণ করে, আর অনেক
                মিনিট পরে হাল ছেড়ে ETIMEDOUT দেয়। Linux এ এই হাল ছাড়ার সময়টা
                Default এ প্রায় পনেরো মিনিট। পনেরো মিনিট ধরে একটা Request ঝুলে
                থাকা, এটাই সেই ঘটনা যেখানে মানুষ বলে Server Hang করেছে।
              </ContentParagraph>
              <ContentParagraph>
                এর জন্য তিন স্তরের প্রতিরক্ষা আছে, আর ভালো System এ তিনটাই থাকে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>TCP Keepalive।</strong> TCP Deep Dive লেসনে এর নাম
                  শুনেছেন। এটা Kernel এর একটা সুবিধা, যা চালু করলে চুপ থাকা
                  Connection এ Kernel নিজে একটা ফাঁকা Probe পাঠিয়ে দেখে ওপাশ উত্তর
                  দেয় কি না। সমস্যা হলো এর Default সময়। Linux আর macOS দুইটাতেই
                  প্রথম Probe যায় দুই ঘণ্টা চুপ থাকার পর, তারপর ৭৫ সেকেন্ড পরপর
                  কয়েকবার। মানে Default এ একটা মরা Connection ধরা পড়তে দুই ঘণ্টার
                  বেশি লাগে। তাই কাজে লাগাতে হলে সময়টা কমিয়ে দিতে হয়, সাধারণত
                  প্রতি Socket এ আলাদা করে।
                </ListItem>
                <ListItem>
                  <strong>App এর নিজের Heartbeat।</strong> অনেক Protocol নিজেই
                  নিয়মিত একটা ছোট বার্তা আদান প্রদান করে, যাকে বলে Heartbeat বা
                  Ping আর Pong। WebSocket এ এটা আছে, Database Driver গুলোতে আছে।
                  এটা TCP Keepalive এর চেয়ে ভালো, কারণ এটা শুধু যন্ত্রটা বেঁচে আছে
                  কি না দেখে না, ওপাশের Program টা সাড়া দিচ্ছে কি না সেটাও দেখে।
                </ListItem>
                <ListItem>
                  <strong>Timeout, সব জায়গায়।</strong> সবচেয়ে সহজ আর সবচেয়ে জরুরি।
                  প্রতিটা বাইরের Request, প্রতিটা Database Query তে একটা সর্বোচ্চ
                  সময় বেঁধে দিন। উত্তর না এলে নিজে থেকে হাল ছাড়ুন আর Connection
                  টা ফেলে দিন। পনেরো মিনিট Kernel এর জন্য অপেক্ষা করার কোনো কারণ
                  নেই, যখন আপনি জানেন একটা বুকিং এর Query দুই সেকেন্ডের বেশি
                  লাগার কথা নয়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "keepalive-defaults.sh",
          code: `# macOS: Keepalive এর Default, মিলিসেকেন্ডে
sysctl net.inet.tcp.keepidle net.inet.tcp.keepintvl net.inet.tcp.keepcnt
# net.inet.tcp.keepidle: 7200000     প্রথম Probe এর আগে চুপ থাকার সময়, ২ ঘণ্টা
# net.inet.tcp.keepintvl: 75000      দুই Probe এর মাঝে, ৭৫ সেকেন্ড
# net.inet.tcp.keepcnt: 8            কয়টা Probe এর উত্তর না এলে মৃত ধরা হবে

# Linux: একই তিনটা, সেকেন্ডে
sysctl net.ipv4.tcp_keepalive_time net.ipv4.tcp_keepalive_intvl net.ipv4.tcp_keepalive_probes
# সাধারণত 7200, 75, 9`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "দুইটা Keep-Alive, নাম এক, জিনিস আলাদা",
          content: (
            <p>
              এই শব্দটা দুই জায়গায় দুই মানে নিয়ে আসে, আর এটা প্রায় সবাইকে
              একবার বিভ্রান্ত করে। <strong>TCP Keepalive</strong> হলো Kernel এর
              পাঠানো ফাঁকা Probe, যার কাজ মরা Connection ধরা। এটা Transport Layer
              এর জিনিস। <strong>HTTP Keep-Alive</strong> হলো একটা Request শেষ হলে
              Connection বন্ধ না করে পরের Request এর জন্য খোলা রেখে দেওয়া। এটা
              Application Layer এর জিনিস, আর এতে কোনো Probe যায় না। প্রথমটা
              জিজ্ঞেস করে আছেন তো, দ্বিতীয়টা বলে লাইনটা ধরে রাখছি, আবার লাগবে।
              পরের সেকশনের Timeout গুলো এই দ্বিতীয়টার।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "idle-timeouts",
      subHeader: { index: "012", title: "Idle Timeouts" },
      title: <SectionTitle>চুপ থাকা Connection কে মাঝপথে কারা মেরে ফেলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম সেকশনে বলেছিলাম Connection থাকে শুধু দুই প্রান্তের খাতায়,
                মাঝের Router রা কিছু মনে রাখে না। কথাটা সাধারণ Router এর জন্য
                সত্যি। কিন্তু পথে কয়েকটা যন্ত্র আছে যারা মনে রাখে, আর এদের আপনি
                আগেই চেনেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>NAT।</strong> Module 03 এর NAT লেসনে দেখেছেন, পর্যটকের
                  বাসার Router একটা টেবিল রাখে: ভেতরের 192.168.1.20 এর Port 51514
                  বাইরে 203.0.113.25 এর কোন Port হয়ে গেছে। এই টেবিলের জায়গা
                  সীমিত, তাই Router একটা লাইন অনেকক্ষণ ব্যবহার না হলে মুছে ফেলে।
                </ListItem>
                <ListItem>
                  <strong>Stateful Firewall।</strong> এটাও প্রতিটা চালু Connection
                  এর একটা হিসাব রাখে, যাতে শুধু চেনা Connection এর Packet ঢুকতে
                  দেয়। এরও মেয়াদ আছে।
                </ListItem>
                <ListItem>
                  <strong>Load Balancer আর Reverse Proxy।</strong> এরা দুই দিকে
                  দুইটা আলাদা Connection রাখে, একটা পর্যটকের সাথে, একটা আপনার App
                  এর সাথে। দুইটারই Idle Timeout আছে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই মেয়াদের নাম <strong>Idle Timeout</strong>, মানে একটা Connection
                কোনো তথ্য ছাড়া কতক্ষণ চুপ থাকলে যন্ত্রটা তাকে ফেলে দেবে। সংখ্যাগুলো
                যন্ত্রভেদে আলাদা, কয়েক সেকেন্ড থেকে কয়েক ঘণ্টা। অনেক Cloud Load
                Balancer এর Default ৬০ সেকেন্ড। Cloud এর NAT সেবাগুলোর সাধারণত
                কয়েক মিনিট। বাসার Router এর আরও অনিশ্চিত। আপনার নিজের Dashboard এ
                যে সংখ্যা লেখা, সেটাই আপনার জন্য সত্য।
              </ContentParagraph>
              <ContentParagraph>
                সমস্যা হলো মেয়াদ ফুরালে এরা সবাই ভদ্রভাবে জানায় না। কেউ কেউ RST
                পাঠায়। অনেকে কিছুই পাঠায় না, শুধু লাইনটা মুছে ফেলে। তখন আগের
                সেকশনের Half-open অবস্থা তৈরি হয়, কোনো যন্ত্র বন্ধ না হয়েও।
                সবচেয়ে চেনা উদাহরণ: একটা App রাতভর কোনো Query চালায়নি, সকালে
                প্রথম Query টা Pool এর একটা পুরনো Connection দিয়ে যায়, আর সেটা
                অনেকক্ষণ ঝুলে থেকে ব্যর্থ হয়। দ্বিতীয় Query নতুন Connection এ যায়
                আর ঠিকঠাক চলে। যে কেউ এটা একবার দেখেছেন, জানেন কতটা বিভ্রান্তিকর।
              </ContentParagraph>
              <ContentParagraph>
                এর চেয়েও বেশি দেখা যায় Load Balancer আর App এর মাঝের সমস্যাটা। নিচের
                ছবিতে দুইটা সাজানো পাশাপাশি।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <IdleTimeoutRaceDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ঘটনাটা ধীরে ধীরে দেখি। Load Balancer প্রতিটা Request এ App এর সাথে
                নতুন Connection খোলে না, কয়েকটা খুলে রেখে বারবার ব্যবহার করে। এটা
                HTTP Keep-Alive। App এর দিকেও একটা সংখ্যা আছে, একটা Connection
                কতক্ষণ চুপ থাকলে App সেটা বন্ধ করবে। Node এ এর নাম{" "}
                <code>server.keepAliveTimeout</code>, আর Default মাত্র ৫ সেকেন্ড।
              </ContentParagraph>
              <ContentParagraph>
                এখন ধরুন Load Balancer এর Idle Timeout ৬০ সেকেন্ড আর App এর ৫। একটা
                Connection ৫ সেকেন্ড চুপ থাকল, App বলল যথেষ্ট, আর FIN পাঠাল। ঠিক
                সেই মুহূর্তে, FIN টা তখনো পথে, একজন পর্যটকের Request এলো। Load
                Balancer এর দৃষ্টিতে Connection টা তখনো সুস্থ, কারণ তার নিজের ৬০
                সেকেন্ড হয়নি আর FIN এখনো এসে পৌঁছায়নি। সে Request টা ওই Connection
                এ পাঠিয়ে দিল। App এর কাছে সেটা পৌঁছাল একটা বন্ধ Socket এ, আর আট
                নম্বর সেকশনের নিয়মে জবাব গেল RST। Load Balancer পর্যটককে দিল{" "}
                <strong>502 Bad Gateway</strong>, যার মানে পেছনের Server এর কাছ
                থেকে ঠিকঠাক উত্তর পাইনি।
              </ContentParagraph>
              <ContentParagraph>
                এই Bug টা ধরা কঠিন তিন কারণে। এটা শুধু তখন ঘটে যখন একটা Request
                ঠিক ওই ছোট্ট ফাঁকে এসে পড়ে, তাই দিনে হয়তো হাজারে একবার। আবার
                চেষ্টা করলেই ঠিক হয়ে যায়। আর App এর Log এ কিছুই থাকে না, কারণ App
                তো Request টা দেখেইনি। নিচের Lab এ দুইটা সংখ্যা বদলে দেখুন লাল
                অংশটা কখন তৈরি হয় আর কখন মিলিয়ে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <IdleTimeoutLab /> },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "keep-alive-timeout.mjs",
          code: `import http from "node:http";

const port = Number(process.env.PORT);
const keepAliveMs = Number(process.env.KEEP_ALIVE_TIMEOUT_MS);
if (!port) throw new Error("PORT is not set");
if (!keepAliveMs) throw new Error("KEEP_ALIVE_TIMEOUT_MS is not set");

const server = http.createServer((req, res) => res.end("ok\\n"));

// সামনের Load Balancer এর Idle Timeout এর চেয়ে বেশি হতে হবে।
// Load Balancer ৬০ সেকেন্ড হলে এখানে যেমন 65000।
server.keepAliveTimeout = keepAliveMs;

// Header পড়ার সময়সীমা Keep-Alive এর চেয়ে একটু বেশি রাখা নিরাপদ।
server.headersTimeout = keepAliveMs + 1000;

server.listen(port);

// Default গুলো নিজে দেখে নিতে:
//   node -e 'const s=require("http").createServer();
//            console.log(s.keepAliveTimeout, s.headersTimeout)'
//   5000 60000`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা নিয়ম, যা পুরো শিকলে খাটে",
          content: (
            <p>
              একটা Request যত স্তর পার হয়ে আসে, প্রতিটা জোড়ায় একই নিয়ম: যে পেছনে
              আছে তার ধৈর্য সামনের জনের চেয়ে বেশি হবে। পর্যটক থেকে Load Balancer,
              Load Balancer থেকে Reverse Proxy, Reverse Proxy থেকে App। সামনের জন
              আগে বন্ধ করলে সে জানে ওটা বন্ধ, আর পরের বার নতুন Connection খোলে।
              পেছনের জন আগে বন্ধ করলে সামনের জন একটা মরা Connection হাতে নিয়ে বসে
              থাকে। আর যেখানে মাঝে একটা নীরব NAT বা Firewall আছে, সেখানে Keepalive
              বা Heartbeat এর বিরতি সেই যন্ত্রের Timeout এর চেয়ে ছোট রাখুন, যাতে
              Connection টা কখনো তার চোখে চুপ না থাকে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "graceful-shutdown",
      subHeader: { index: "013", title: "Graceful Shutdown" },
      title: <SectionTitle>Server থামানো, একটা বুকিং ও নষ্ট না করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ একটা Connection বন্ধ করার কথা বললাম। এবার একসাথে সব
                Connection বন্ধ করার পালা, কারণ প্রতিটা Deploy তে ঠিক এটাই ঘটে।
                নতুন Code চালু করতে হলে পুরনো Process টাকে থামাতে হয়। প্রশ্ন হলো,
                সেই মুহূর্তে যে পর্যটকরা বুকিং এর মাঝখানে, তাঁদের কী হবে?
              </ContentParagraph>
              <ContentParagraph>
                Module 01 এর How a Program Runs লেসনে Signal দেখেছিলেন। একটা
                Process কে থামতে বলার ভদ্র উপায় হলো <strong>SIGTERM</strong>,
                যার মানে অনুগ্রহ করে গুছিয়ে থামুন। Docker, Kubernetes, systemd,
                PM2, সবাই প্রথমে এটাই পাঠায়। তারপর একটা নির্দিষ্ট সময় অপেক্ষা
                করে। Process তখনো না থামলে পাঠায় <strong>SIGKILL</strong>, যা
                ধরা যায় না, উপেক্ষা করা যায় না, Kernel সোজা Process টা মুছে ফেলে।
                Docker এ এই অপেক্ষা Default এ ১০ সেকেন্ড, Kubernetes এ ৩০।
              </ContentParagraph>
              <ContentParagraph>
                আপনার Program যদি SIGTERM নিয়ে কিছুই না করে, Process টা সাথে সাথে
                মরে। Kernel তার সব Socket বন্ধ করে দেয়। যে পর্যটকের Request এর
                উত্তর অর্ধেক লেখা হয়েছিল, তিনি পান একটা কাটা Connection। সবচেয়ে
                খারাপ ক্ষেত্রটা ভাবুন: Payment কেটে গেছে, Database এ বুকিং লেখা
                হয়েছে, কিন্তু নিশ্চিতকরণের উত্তরটা পাঠানোর আগেই Process মরল।
                পর্যটক একটা Error দেখলেন, আর আবার চেষ্টা করলেন।
              </ContentParagraph>
              <ContentParagraph>
                এর উল্টোটাই <strong>Graceful Shutdown</strong>, গুছিয়ে থামা। ধারণাটা
                একটা দোকান বন্ধ করার মতো। দোকানদার প্রথমে দরজায় বন্ধ লেখা ঝুলিয়ে
                দেন যাতে নতুন কেউ না ঢোকে। ভেতরে যাঁরা আছেন তাঁদের বেচাকেনা শেষ
                করেন। তারপর বাতি নেভান। আর খুব দেরি হয়ে গেলে একটা সময়ের পর ভদ্রভাবে
                বাকিদের বেরিয়ে যেতে বলেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "নতুন Connection নেওয়া বন্ধ করুন",
              description:
                "কান পাতা Socket টা বন্ধ করুন। এরপর যে নতুন Connection আসবে সে পাবে Connection refused। এটা ইচ্ছাকৃত, কারণ Load Balancer এটা দেখেই বুঝবে এই App আর নিচ্ছে না, আর Request অন্য App এ পাঠাবে। Node এ এটা server.close()।",
            },
            {
              title: "চুপ থাকা Keep-Alive Connection গুলো বন্ধ করুন",
              description:
                "যেসব Connection খোলা কিন্তু এই মুহূর্তে কোনো Request চলছে না, সেগুলোর জন্য অপেক্ষার কিছু নেই। এগুলোতে FIN পাঠিয়ে দিন। না দিলে এরা Keep-Alive Timeout পর্যন্ত খোলা থাকবে আর Process থামতে দেবে না। Node এ এটা server.closeIdleConnections()।",
            },
            {
              title: "চলমান Request গুলো শেষ হতে দিন",
              description:
                "যে Request গুলোর কাজ চলছে, তাদের পুরো উত্তর পাঠানো পর্যন্ত অপেক্ষা করুন। প্রতিটা উত্তর শেষে সেই Connection বন্ধ হবে, ভদ্রভাবে, FIN দিয়ে।",
            },
            {
              title: "বাকি সম্পদ গুছিয়ে ছাড়ুন",
              description:
                "সব Request শেষ হলে Database এর Connection Pool, Queue এর Connection, খোলা ফাইল বন্ধ করুন। এরাও TCP Connection, এদেরও ভদ্র বিদায় প্রাপ্য, নইলে Database এর দিকে ওগুলো Half-open হয়ে পড়ে থাকবে।",
            },
            {
              title: "একটা শেষ সময় বেঁধে দিন",
              description:
                "কোনো Request যদি আটকে থাকে, অনন্তকাল অপেক্ষা করা চলবে না। একটা সময়সীমা রাখুন, যা Docker বা Kubernetes এর SIGKILL এর সময়ের চেয়ে কম। সেই সীমা পার হলে বাকিগুলো নিজে কেটে দিয়ে বেরিয়ে যান। নিজে থামা সবসময় SIGKILL খাওয়ার চেয়ে ভালো, কারণ তখনো আপনি Log লিখতে পারেন।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "graceful.mjs",
          code: `import http from "node:http";

const port = Number(process.env.PORT);
const graceMs = Number(process.env.SHUTDOWN_GRACE_MS);
if (!port) throw new Error("PORT is not set");
if (!graceMs) throw new Error("SHUTDOWN_GRACE_MS is not set");

const server = http.createServer((req, res) => {
  // একটা ধীর বুকিং: উত্তর দিতে দুই সেকেন্ড লাগে।
  setTimeout(() => res.end("booking confirmed\\n"), 2000);
});

server.listen(port, "127.0.0.1", () => console.log("listening on", port));

process.on("SIGTERM", () => {
  console.log("SIGTERM: no new connections, finishing what is in flight");

  // ধাপ ১ আর ৩: নতুন নেওয়া বন্ধ, চলমানগুলো শেষ হলে Callback চলবে।
  server.close(() => {
    console.log("all connections closed, exiting cleanly");
    process.exit(0);
  });

  // ধাপ ২: চুপ থাকা Keep-Alive Connection গুলোকে এখনই বিদায়।
  server.closeIdleConnections();

  // ধাপ ৫: সময়সীমা পার হলে বাকিগুলো কেটে দিয়ে বেরিয়ে যাওয়া।
  setTimeout(() => {
    console.log("grace period over, cutting what is left");
    server.closeAllConnections();
    process.exit(1);
  }, graceMs).unref();
});`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই Program টা এই লেসন লেখার সময় চালিয়ে পরীক্ষা করা হয়েছে। একটা
                Request পাঠানো হলো, আধা সেকেন্ড পরে Process কে SIGTERM দেওয়া হলো,
                আর তার পরপরই আরেকটা নতুন Request পাঠানোর চেষ্টা হলো। ফলাফল নিচে।
                চলমান Request টা তার পুরো উত্তর পেয়েছে, নতুনটা ঢুকতেই পারেনি, আর
                Process বেরিয়েছে Exit Code 0 দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "graceful-result.sh",
          code: `PORT=47008 SHUTDOWN_GRACE_MS=5000 node graceful.mjs &
SERVER=$!
sleep 0.5

curl -s http://127.0.0.1:47008/ &      # একটা ধীর বুকিং শুরু হলো
sleep 0.5
kill -TERM $SERVER                     # Deploy: থামতে বলা হলো
sleep 0.3
curl -s http://127.0.0.1:47008/ ; echo "new request exit code: $?"
wait $SERVER ; echo "server exit code: $?"

# listening on 47008
# SIGTERM: no new connections, finishing what is in flight
# new request exit code: 7              <- curl এর 7 মানে Connection refused
# booking confirmed                     <- চলমান বুকিং পুরো উত্তর পেল
# all connections closed, exiting cleanly
# server exit code: 0`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Node এ Connection বন্ধ করার কয়েকটা কাছাকাছি নামের Method আছে।
                কোনটা তারে কী পাঠায়, সেটা জানলে আর গুলিয়ে যাবে না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>socket.end()</strong>: আমার পাঠানো শেষ। যা লেখা বাকি ছিল
                  তা পাঠিয়ে তারপর FIN। এটাই ভদ্র বিদায়, আর প্রায় সবসময় আপনার
                  এটাই দরকার।
                </ListItem>
                <ListItem>
                  <strong>socket.destroy()</strong>: এই Socket টা এখনই ফেলে দিন।
                  লেখার অপেক্ষায় থাকা তথ্য ফেলে দেওয়া হয়, আর এরপর এই Socket এ আর
                  কোনো পড়া বা লেখা চলে না। তারে FIN যাবে নাকি RST, সেটা নির্ভর করে
                  তখন না পড়া তথ্য আছে কি না তার উপর। Error এর পরে গুছিয়ে ফেলতে
                  এটা ব্যবহার হয়।
                </ListItem>
                <ListItem>
                  <strong>socket.resetAndDestroy()</strong>: ইচ্ছা করে RST পাঠিয়ে
                  ফেলে দেওয়া। ওপাশ দেখবে ECONNRESET।
                </ListItem>
                <ListItem>
                  <strong>server.close()</strong>: নতুন Connection নেওয়া বন্ধ,
                  চলমানগুলো শেষ হওয়ার অপেক্ষা। খোলা Connection গুলোকে এটা নিজে
                  কাটে না।
                </ListItem>
                <ListItem>
                  <strong>server.closeIdleConnections()</strong>: যেসব Connection
                  এ এই মুহূর্তে কোনো Request চলছে না, সেগুলো বন্ধ। নতুন Node
                  সংস্করণে server.close() নিজেই এটা করে নেয়, তবু আলাদা করে ডাকলে
                  কোনো ক্ষতি নেই।
                </ListItem>
                <ListItem>
                  <strong>server.closeAllConnections()</strong>: চলমান সহ সব
                  Connection এখনই বন্ধ। এটা শেষ অস্ত্র, শুধু সময়সীমা পার হলে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "তিনটা ফাঁদ, যাতে Graceful Shutdown লিখেও কাজ হয় না",
          content: (
            <p>
              এক, Signal টা আপনার Program পর্যন্ত পৌঁছাচ্ছে তো? Container এ App
              যদি একটা Shell Script বা npm এর ভেতর দিয়ে চালু হয়, SIGTERM অনেক সময়
              সেই বাইরের Process এ আটকে যায় আর Node পর্যন্ত আসে না। তখন দশ সেকেন্ড
              পরে সবাই একসাথে SIGKILL খায়। দুই, আপনার সময়সীমা যদি Orchestrator এর
              সময়ের চেয়ে বেশি হয়, আপনি গুছিয়ে শেষ করার আগেই SIGKILL এসে যাবে।
              তিন, Load Balancer যদি থামতে থাকা App এ তখনো নতুন Request পাঠাতে
              থাকে, সেগুলো Connection refused পাবে। তাই ভালো সাজানোয় App আগে Health
              Check এ নিজেকে অসুস্থ বলে, কয়েক সেকেন্ড অপেক্ষা করে যাতে Load
              Balancer খবরটা পায়, তারপর কান পাতা বন্ধ করে। এই শেষ অংশটা Deployment
              এর Module এ আবার আসবে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "see-it",
      subHeader: { index: "014", title: "On the Wire" },
      title: <SectionTitle>তারের উপর বিদায়টা নিজের চোখে দেখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                State গুলো netstat এ দেখেছেন। এবার Segment গুলো। Three-way
                Handshake লেসনে <code>tcpdump</code> দিয়ে SYN ধরেছিলেন, একই
                যন্ত্র দিয়ে FIN আর RST ও ধরা যায়। tcpdump প্রতিটা Segment এর Flag
                গুলো ছোট অক্ষরে দেখায়, আর সেই অক্ষরগুলো চিনলে পুরো গল্পটা এক
                নজরে পড়া যায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>[S]</code> মানে SYN, <code>[S.]</code> মানে SYN আর ACK
                  একসাথে। বিন্দুটা সবসময় ACK।
                </ListItem>
                <ListItem>
                  <code>[.]</code> মানে শুধু ACK।
                </ListItem>
                <ListItem>
                  <code>[P.]</code> মানে PSH আর ACK, অর্থাৎ তথ্য বহন করা একটা
                  সাধারণ Segment।
                </ListItem>
                <ListItem>
                  <code>[F.]</code> মানে FIN আর ACK একসাথে। বাস্তবে FIN প্রায়
                  সবসময় এভাবেই আসে, কারণ Handshake এর পর থেকে প্রতিটা Segment এই
                  ACK Flag জ্বালানো থাকে।
                </ListItem>
                <ListItem>
                  <code>[R]</code> বা <code>[R.]</code> মানে RST।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের কমান্ডে প্রথম অংশটা শুধু সেই Segment গুলো ধরে যাদের FIN বা
                RST Flag জ্বালানো। tcpdump চালাতে প্রশাসকের অনুমতি লাগে, তাই{" "}
                <code>sudo</code>। নিচে যে লাইনগুলো দেখানো হয়েছে সেগুলো একটা ভদ্র
                বিদায়ের সাধারণ চেহারা, বোঝানোর জন্য সাজানো। আপনার যন্ত্রে Port,
                সময় আর সংখ্যা আলাদা হবে, কিন্তু Flag এর ক্রমটা এটাই থাকবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "watch-fin-rst.sh",
          code: `# এক Terminal এ: Port 80 এর সব FIN আর RST ধরুন
sudo tcpdump -n 'tcp port 80 and (tcp[tcpflags] & (tcp-fin|tcp-rst) != 0)'

# আরেক Terminal এ: একটা ছোট Request, যার পরে curl Connection বন্ধ করে
curl -s -o /dev/null http://example.com

# একটা ভদ্র বিদায় দেখতে এরকম (চেহারাটা, সংখ্যা আপনার আলাদা হবে):
#   IP 192.168.1.20.51514 > 103.94.135.2.80: Flags [F.], seq 75, ack 1257, ...
#   IP 103.94.135.2.80 > 192.168.1.20.51514: Flags [F.], seq 1257, ack 76, ...
# তৃতীয় লাইনটা (শেষ ACK) এই Filter এ আসবে না, কারণ তাতে FIN নেই।
# এখানে Server তার ACK আর FIN এক Segment এ জুড়ে দিয়েছে, তাই চারের বদলে তিন।

# পুরো Connection, শুরু থেকে শেষ, সব Segment সহ দেখতে Filter ছোট করুন
sudo tcpdump -n 'tcp port 80 and host example.com'

# নিজের যন্ত্রের ভেতরের Connection দেখতে Loopback Interface বেছে নিন
sudo tcpdump -n -i lo0 'tcp port 47001'     # macOS
sudo tcpdump -n -i lo  'tcp port 47001'     # Linux`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "sudo ছাড়া একই গল্প দেখার উপায়",
          content: (
            <p>
              tcpdump চালানোর অনুমতি না থাকলেও হতাশ হওয়ার কিছু নেই। নিচের Lab এর
              ছয়টা পরীক্ষার কোনোটাতেই sudo লাগে না। সেখানে Segment গুলো সরাসরি না
              দেখে তাদের ফলাফল দেখবেন: netstat এ State বদলানো, আর Node এর{" "}
              <code>end</code>, <code>close</code> আর <code>error</code> ঘটনা।
              আসলে প্রতিদিনের কাজে আপনি বেশিরভাগ সময় এভাবেই রোগ ধরবেন। tcpdump
              তখনই লাগে, যখন দুই পাশের গল্প মেলে না আর জানা দরকার তারে আসলে কী
              গেছে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours, দুপুরের একটা Deploy</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শুক্রবার দুপুর, ছুটির আগের দিন, Island Tours এ বুকিং এর ভিড়। ঠিক
                এই সময়ে একটা জরুরি Bug Fix চালু করতে হবে। পুরনো দিনে দল এই কাজ
                করত রাত তিনটায়, কারণ প্রতিটা Deploy তে কয়েকজন পর্যটক Error
                দেখতেন। এই লেসনের জিনিসগুলো ঠিকঠাক বসালে দুপুরেই করা যায়, কেউ
                টেরও পান না। Island Tours এ Connection বন্ধ করা নিয়ে যে পাঁচটা
                সিদ্ধান্ত নেওয়া হয়েছে, সেগুলো দেখি।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>App টা SIGTERM শোনে।</strong> Port 3000 এ চলা App টা
                  থামতে বললে আগে নতুন Connection নেওয়া বন্ধ করে, চলমান বুকিং
                  গুলো শেষ করে, তারপর Database এর Pool বন্ধ করে বেরোয়। সময়সীমা
                  আসে <code>SHUTDOWN_GRACE_MS</code> নামের Environment Variable
                  থেকে, আর সেটা সবসময় Container কে দেওয়া থামার সময়ের চেয়ে কম।
                </ListItem>
                <ListItem>
                  <strong>Keep-Alive Timeout সামনের জনের চেয়ে বেশি।</strong>{" "}
                  Reverse Proxy আর App এর মাঝে Connection গুলো বারবার ব্যবহার হয়।
                  App এর <code>KEEP_ALIVE_TIMEOUT_MS</code> টা Proxy এর Idle
                  Timeout এর চেয়ে কয়েক সেকেন্ড বেশি রাখা। এই একটা সংখ্যা ঠিক
                  করার পর দিনে কয়েকবার দেখা দেওয়া রহস্যময় 502 গুলো পুরো বন্ধ
                  হয়ে গিয়েছিল।
                </ListItem>
                <ListItem>
                  <strong>Database এ Pool, আর Pool এ মেয়াদ।</strong> প্রতি বুকিং
                  এ নতুন Connection খোলা হয় না, তাই TIME_WAIT জমে না আর Ephemeral
                  Port ফুরায় না। Pool এর প্রতিটা Connection এর একটা সর্বোচ্চ Idle
                  সময় আছে, যা মাঝের Firewall এর Timeout এর চেয়ে ছোট। তাই সকালের
                  প্রথম বুকিং কখনো একটা মরা Connection এ গিয়ে পড়ে না।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা বাইরের ডাকে Timeout।</strong> Payment Gateway
                  এর সাথে কথা বলার সময় একটা সর্বোচ্চ সময় বাঁধা। Gateway হারিয়ে
                  গেলে বুকিং পনেরো মিনিট ঝুলে থাকে না, কয়েক সেকেন্ডে পরিষ্কার
                  একটা বার্তা দেয়।
                </ListItem>
                <ListItem>
                  <strong>যা আবার পাঠানো নিরাপদ, শুধু সেটাই আবার পাঠানো হয়।</strong>{" "}
                  নৌকার তালিকা দেখার Request এ ECONNRESET এলে App নিজেই আরেকবার
                  চেষ্টা করে, পর্যটক টের পান না। কিন্তু Payment এর Request এ তা
                  করা হয় না, কারণ RST মানে শুধু এটুকু যে উত্তর আসেনি। ওপাশ টাকা
                  কেটেছে কি না, সেটা RST বলে না। এই ক্ষেত্রে App আগে জিজ্ঞেস করে
                  নেয় আগের চেষ্টাটার কী হয়েছিল।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                শেষ কথাটা আলাদা করে মনে রাখার মতো। একটা Connection ভেঙে গেলে
                আপনি জানেন শুধু যে উত্তরটা আসেনি। Request টা পৌঁছেছিল কি না, কাজটা
                হয়েছিল কি না, তা জানেন না। ভদ্র বিদায়ের পুরো আয়োজনটা, FIN, ACK,
                TIME_WAIT, Graceful Shutdown, আসলে এই অনিশ্চয়তাটা যতটা সম্ভব ছোট
                করার চেষ্টা।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "request-flow",
      subHeader: { index: "016", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা বুকিং এর শেষ কয়েক সেকেন্ড</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পর্যটকের বুকিং নিশ্চিত হয়ে গেছে। এরপর তাঁর ফোন আর Island Tours এর
              মাঝের Connection টার কী হয়, শুরু থেকে একদম শেষ পর্যন্ত।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "শেষ উত্তরটা পৌঁছায়",
              description:
                "Server নিশ্চিতকরণের পাতা পাঠাল, ফোনের Kernel প্রতিটা Segment এর ACK দিল। Connection টা 192.168.1.20:51514 থেকে 103.94.135.2:443, State দুই পাশেই ESTABLISHED।",
            },
            {
              title: "Connection চুপচাপ খোলা থাকে",
              description:
                "কেউ সাথে সাথে বন্ধ করে না। HTTP Keep-Alive এর কারণে Connection টা খোলা রাখা হয়, যদি পর্যটক আরেকটা পাতা খোলেন। এই সময়ে তারে একটা Segment ও যায় না।",
            },
            {
              title: "কারো ধৈর্য ফুরায়",
              description:
                "পর্যটক Tab বন্ধ করলেন, অথবা Browser বা Server এর Idle Timeout পার হলো। যার আগে হলো সে Active Closer। ধরি ফোন।",
            },
            {
              title: "ফোন FIN পাঠায়",
              description:
                "ফোনের Kernel FIN পাঠিয়ে FIN_WAIT_1 এ গেল। বাসার Router এই Segment এর Source কে 203.0.113.25 এ বদলে বাইরে পাঠাল, ঠিক আগের প্রতিটা Segment এর মতো।",
            },
            {
              title: "Server ACK দেয়, তারপর নিজের FIN",
              description:
                "Server এর Kernel ACK দিল আর CLOSE_WAIT এ গেল। Server এর Program EOF দেখে নিজের দিক বন্ধ করল, Kernel FIN পাঠিয়ে LAST_ACK এ গেল। ফোন এর মধ্যে FIN_WAIT_2 পার হয়েছে।",
            },
            {
              title: "ফোন শেষ ACK পাঠিয়ে TIME_WAIT এ দাঁড়ায়",
              description:
                "Server ACK পেয়ে পাতা ছিঁড়ে ফেলল, তার File Descriptor টা মুক্ত হলো। ফোন 2MSL অপেক্ষা করছে, যদি শেষ ACK হারিয়ে গিয়ে থাকে।",
            },
            {
              title: "ফোনও পাতা ছিঁড়ে ফেলে",
              description:
                "অপেক্ষা শেষ, কোনো FIN ফিরে আসেনি। ফোনের Kernel Connection টা মুছল। Port 51514 এখন এই Server এর জন্যও আবার ব্যবহার করা যাবে।",
            },
            {
              title: "বাসার Router তার টেবিলের লাইনটা মোছে",
              description:
                "NAT টেবিলে এই Connection এর যে লাইনটা ছিল, Router FIN গুলো দেখে বা কিছুক্ষণ পরে মেয়াদ শেষে সেটা মুছে ফেলে। এখন তিন জায়গার কোথাও এই Connection এর কোনো চিহ্ন নেই। বুকিংটা শুধু Database এ আছে, যেখানে থাকার কথা।",
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
                <strong>নিচের Lab টা আগে করুন</strong>, ছয়টা পরীক্ষায় FIN, RST,
                TIME_WAIT, CLOSE_WAIT আর Graceful Shutdown, সবগুলো নিজের যন্ত্রে
                ঘটিয়ে দেখবেন। এর কোনো ভিডিও বিকল্প নেই।
              </ListItem>
              <ListItem>
                <strong>RFC 9293</strong>, TCP এর বর্তমান মূল নিয়মের কাগজ। এর
                State Machine এর ছবিটা একবার দেখুন, এই লেসনের সব State এক পাতায়
                আছে।{" "}
                <a
                  href="https://www.rfc-editor.org/rfc/rfc9293"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  rfc-editor.org/rfc/rfc9293
                </a>
              </ListItem>
              <ListItem>
                <strong>Node.js এর net আর http নথি</strong>, socket.end, destroy,
                resetAndDestroy, server.close, closeIdleConnections আর
                keepAliveTimeout এর সঠিক আচরণ এখানে লেখা।{" "}
                <a
                  href="https://nodejs.org/api/net.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  nodejs.org/api/net.html
                </a>
                {" আর "}
                <a
                  href="https://nodejs.org/api/http.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  nodejs.org/api/http.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Linux এর tcp man page</strong>, tcp_fin_timeout,
                tcp_tw_reuse আর Keepalive এর তিনটা Setting এর সংজ্ঞা। Terminal এ{" "}
                <code>man 7 tcp</code>, অথবা{" "}
                <a
                  href="https://man7.org/linux/man-pages/man7/tcp.7.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  man7.org/linux/man-pages/man7/tcp.7.html
                </a>
              </ListItem>
              <ListItem>
                <strong>আপনার নিজের Load Balancer এর নথি</strong>, Idle Timeout
                কত আর কোথায় বদলাতে হয়, সেটা সেবাভেদে আলাদা। এই লেসনের ৬০ সেকেন্ড
                একটা প্রচলিত Default, আপনার Dashboard এ যা লেখা সেটাই ধরুন।
              </ListItem>
              <ListItem>
                <strong>Wireshark</strong>, tcpdump এর ধরা Segment গুলো রঙিন
                তালিকায় দেখার যন্ত্র। একটা Connection বেছে Follow TCP Stream করলে
                SYN থেকে শেষ ACK পর্যন্ত পুরোটা সাজানো পাবেন।{" "}
                <a
                  href="https://www.wireshark.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  wireshark.org
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
      title: <SectionTitle>৫ মিনিটে পুরো লেসন, আর পুরো Module</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>প্রথমে এই লেসনটা, আট লাইনে।</ContentParagraph>
              <ContentList>
                <ListItem>
                  Connection কোনো তার নয়, দুই Kernel এর খাতার দুইটা পাতা। বন্ধ
                  করা মানে দুইজনেরই একমত হয়ে পাতা ছিঁড়ে ফেলা।
                </ListItem>
                <ListItem>
                  একটা Connection দুইটা একমুখী রাস্তা। FIN মানে আমার পাঠানো শেষ,
                  আর কিছু নয়। প্রতিটা রাস্তা বন্ধ করতে একটা FIN আর একটা ACK, তাই
                  মোট চার ধাপ, কখনো তিন Segment এ।
                </ListItem>
                <ListItem>
                  যে আগে FIN পাঠায় সে Active Closer। তার পথ FIN_WAIT_1,
                  FIN_WAIT_2, TIME_WAIT। অন্য পাশের পথ CLOSE_WAIT, LAST_ACK।
                </ListItem>
                <ListItem>
                  TIME_WAIT শুধু Active Closer এর, 2MSL পর্যন্ত। এটা হারানো শেষ
                  ACK সামলায় আর পুরনো Segment কে নতুন Connection এ ঢুকতে দেয় না।
                  নিজে থেকে সারে।
                </ListItem>
                <ListItem>
                  RST মানে এখনই শেষ, উত্তর ছাড়া। আপনার Log এ এটা ECONNRESET, আর
                  বন্ধ Connection এ লিখলে EPIPE।
                </ListItem>
                <ListItem>
                  CLOSE_WAIT জমা মানে নিজের Code Socket বন্ধ করছে না। এটা নিজে
                  থেকে সারে না।
                </ListItem>
                <ListItem>
                  ওপাশ নীরবে হারিয়ে গেলে কেউ জানায় না। Timeout, Heartbeat আর
                  Keepalive দিয়ে নিজে ধরতে হয়। মাঝের NAT, Firewall আর Load
                  Balancer এর Idle Timeout আছে, আর পেছনের জনের ধৈর্য সামনের জনের
                  চেয়ে বেশি হতে হয়।
                </ListItem>
                <ListItem>
                  Server থামানোর ক্রম: নতুন নেওয়া বন্ধ, চুপ থাকাগুলো বন্ধ, চলমান
                  শেষ, সম্পদ ছাড়া, আর একটা সময়সীমা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার পুরো Module। আটটা লেসন আটটা আলাদা অধ্যায় মনে হতে পারে,
                কিন্তু আসলে আপনি আটবার একই ঘটনা দেখেছেন, আট দিক থেকে। ঘটনাটা হলো
                একজন পর্যটকের একটা বুকিং।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ModuleStoryDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                গল্পটা একবার টানা বলি, যেভাবে আপনি অন্য কাউকে বলবেন।
              </ContentParagraph>
              <ContentParagraph>
                পর্যটক ঢাকায় বসে ফোনে <code>islandtours.example</code> খুললেন।
                ফোনের প্রথম দরকার একটা IP, তাই সে একটা DNS প্রশ্ন পাঠাল। সেই
                প্রশ্নটা গেল <strong>UDP</strong> তে, কারণ একটা ছোট প্রশ্ন আর একটা
                ছোট উত্তরের জন্য Connection খোলার আয়োজন বাড়াবাড়ি (লেসন ০৪)। উত্তর
                এলো <code>103.94.135.2</code>।
              </ContentParagraph>
              <ContentParagraph>
                এবার বুকিং এর পালা, আর এখানে একটা Byte ও হারানো চলবে না। তাই
                Browser Kernel এর কাছে একটা TCP Socket চাইল। Kernel ফোনকে একটা
                Ephemeral Port দিল, <code>51514</code>, আর গন্তব্য ঠিক হলো Port{" "}
                <code>443</code>। এই চার সংখ্যাই এখন Connection টার পরিচয়, আর এই
                কারণেই একই Port 443 একসাথে হাজার পর্যটককে আলাদা রাখতে পারে (লেসন
                ০৭)। তারপর তিনটা Segment: SYN, SYN-ACK, ACK। দুই পাশ একে অপরের
                শুরুর Sequence Number জানল আর নিশ্চিত হলো দুই দিকেই রাস্তা খোলা
                (লেসন ০৫)।
              </ContentParagraph>
              <ContentParagraph>
                Browser বুকিং এর তথ্য দিল Kernel কে। সেই তথ্য নিচের দিকে নামতে
                নামতে মোড়কের ভেতর মোড়কে ঢুকল। TCP Header লেগে হলো Segment, IP
                Header লেগে হলো Packet, আর MAC Address লেগে হলো Frame (লেসন ০৬)।
                এই নামার সিঁড়িটাই চার তলার TCP/IP Model, যেখানে Browser থাকে
                Application তলায়, TCP আর IP থাকে Kernel এ, আর Frame বানায় Network
                Card (লেসন ০২)। আর এই তলাগুলোকে আরও সূক্ষ্ম করে সাত ভাগে ভাগ করা
                মানচিত্রটাই OSI Model, যার ভাষায় আমরা বলি Router Layer 3 এ কাজ
                করে আর Load Balancer Layer 4 বা Layer 7 এ (লেসন ০১)।
              </ContentParagraph>
              <ContentParagraph>
                Frame টা বাসার Router এ পৌঁছাল। Router পুরনো Frame খুলে ফেলে নতুন
                Frame বানাল, আর NAT এর নিয়মে Packet এর Source টা বদলে করল{" "}
                <code>203.0.113.25</code>। এরপর প্রতিটা Hop এ Frame নতুন হলো, কিন্তু
                ভেতরের Packet প্রায় একই রইল, আর Segment কেউ খুলেও দেখল না (লেসন
                ০৬)। সমুদ্রের নিচের কোথাও একটা Packet হারাল। কেউ ঘাবড়াল না। Server
                এর ACK দেখে ফোনের Kernel বুঝল কোন অংশটা পৌঁছায়নি আর শুধু সেটা আবার
                পাঠাল। Window ঠিক করল কত দ্রুত পাঠানো নিরাপদ (লেসন ০৩)।
              </ContentParagraph>
              <ContentParagraph>
                Server এ পৌঁছে পুরো ব্যাপারটা উল্টো দিকে ঘটল। মোড়ক একটা একটা করে
                খুলল, Kernel Port 443 দেখে তথ্যটা ঠিক Program এর হাতে দিল, বুকিং
                Database এ লেখা হলো, উত্তর একই পথে ফিরল। আর সবশেষে, যা আজ শিখলেন:
                FIN, ACK, FIN, ACK, কিছুক্ষণ TIME_WAIT, তারপর দুই খাতা থেকেই পাতাটা
                উধাও (লেসন ০৮)।
              </ContentParagraph>
              <ContentParagraph>
                এই একটা অনুচ্ছেদ যদি আপনি না দেখে বলতে পারেন, আর প্রতিটা বাক্যে
                কেউ কেন জিজ্ঞেস করলে উত্তর দিতে পারেন, তাহলে এই Module আপনার
                হয়ে গেছে। আর তখন আপনি এটা অন্যকে শেখাতেও পারবেন, কারণ শেখানো মানে
                আসলে এই কেন গুলোর উত্তর দেওয়া।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর Module 06, HTTP & HTTPS",
          content: (
            <p>
              পুরো এই Module এ একটা প্রশ্ন আমরা ইচ্ছা করে এড়িয়ে গেছি। TCP একটা
              নির্ভরযোগ্য রাস্তা বানিয়ে দিল, ঠিক আছে। কিন্তু সেই রাস্তা দিয়ে Browser
              আসলে কী বলল? বুকিং এর তথ্যটা কোন ভাষায় লেখা ছিল, Server কীভাবে বুঝল
              এটা একটা নতুন বুকিং আর তালিকা দেখার অনুরোধ নয়, আর উত্তরে সফল বা
              ব্যর্থ কীভাবে জানাল? TCP এর কাছে এই সবই শুধু Byte এর একটা ধারা। সেই
              Byte গুলোর অর্থ দেয় HTTP। পরের Module সেটা নিয়েই, আর শুরু হবে সবচেয়ে
              চেনা জিনিসটা দিয়ে, যেটা আপনি প্রতিদিন Address Bar এ দেখেন। প্রথম
              লেসন: URL vs URI।
            </p>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      ["Connection", "দুই Kernel এর খাতায় রাখা State, মাঝে কোনো তার নেই"],
      ["FIN", "আমার পাঠানো শেষ। Program এর কাছে এটা EOF, Node এ end ঘটনা"],
      ["Half Close", "এক রাস্তা বন্ধ, অন্যটা খোলা। ইচ্ছাকৃত আর সুস্থ"],
      ["চার ধাপ", "FIN, ACK, FIN, ACK। মাঝের দুইটা জুড়ে গেলে তিন Segment"],
      ["Active Closer", "যে আগে FIN পাঠায়। TIME_WAIT তার ঘাড়েই পড়ে"],
      ["TIME_WAIT", "2MSL অপেক্ষা (Linux এ ৬০ সেকেন্ড)। হারানো ACK আর পুরনো Segment সামলায়, নিজে সারে"],
      ["SO_REUSEADDR", "TIME_WAIT থাকলেও Port এ বসতে দেয়। Restart এর Address already in use সারায়"],
      ["RST", "এখনই শেষ, উত্তর ছাড়া, তথ্য ফেলে দিয়ে। Log এ ECONNRESET"],
      ["EPIPE", "যে Connection বন্ধ বলে Kernel জানে, সেখানে আবার লেখা"],
      ["CLOSE_WAIT", "ওপাশ বিদায় বলেছে, নিজের Program close ডাকেনি। জমলে Bug"],
      ["Half-open", "ওপাশ নীরবে হারিয়ে গেছে, এ পাশ জানে না। Timeout আর Heartbeat দিয়ে ধরা"],
      ["Idle Timeout", "NAT, Firewall, Load Balancer চুপ থাকা Connection ফেলে দেয়। পেছনের জনের ধৈর্য বেশি চাই"],
      ["Graceful Shutdown", "SIGTERM এ নতুন নেওয়া বন্ধ, চলমান শেষ, তারপর বেরোনো, সময়সীমা সহ"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "একটা TCP Segment এ FIN Flag জ্বালানো থাকার সঠিক মানে কোনটা?",
        options: [
          {
            key: "A",
            text: "এই Connection টা এখনই পুরোপুরি বন্ধ করুন",
            isCorrect: false,
            explanation:
              "এটা RST এর কাছাকাছি মানে। FIN শুধু এক দিকের রাস্তা বন্ধ করে।",
          },
          {
            key: "B",
            text: "আমার দিক থেকে আর কোনো তথ্য আসবে না, তবে আমি এখনো শুনতে পারি",
            isCorrect: true,
            explanation:
              "ঠিক। FIN এক দিকের ঘোষণা। অন্য পাশ এরপরও তথ্য পাঠাতে পারে, এটাই Half Close।",
          },
          {
            key: "C",
            text: "একটা Error ঘটেছে",
            isCorrect: false,
            explanation: "FIN কোনো Error নয়, এটা ভদ্র বিদায়। Log এ এটা নীরব থাকে।",
          },
        ],
      },
      {
        id: 2,
        text: "ফোন আগে FIN পাঠিয়েছে। চার ধাপ শেষে TIME_WAIT এ কে থাকবে?",
        options: [
          {
            key: "A",
            text: "ফোন, কারণ সে Active Closer",
            isCorrect: true,
            explanation:
              "ঠিক। যে আগে FIN পাঠায় সে শেষ ACK ও পাঠায়, আর সেই ACK পৌঁছাল কি না নিশ্চিত নয় বলে সে অপেক্ষা করে।",
          },
          {
            key: "B",
            text: "Server, কারণ সে Server",
            isCorrect: false,
            explanation:
              "TIME_WAIT Client বা Server হওয়ার সাথে বাঁধা নয়, কে আগে বন্ধ করল তার সাথে বাঁধা।",
          },
          {
            key: "C",
            text: "দুইজনই",
            isCorrect: false,
            explanation:
              "দুইজনই TIME_WAIT এ যায় শুধু বিরল Simultaneous Close এ, যখন দুইজন একই মুহূর্তে FIN পাঠায়।",
          },
        ],
      },
      {
        id: 3,
        text: "TIME_WAIT না থাকলে কোন বিপদটা হতে পারত?",
        options: [
          {
            key: "A",
            text: "Connection খুলতে বেশি সময় লাগত",
            isCorrect: false,
            explanation: "TIME_WAIT এর সাথে খোলার গতির সম্পর্ক নেই।",
          },
          {
            key: "B",
            text: "শেষ ACK হারালে আবার আসা FIN এর জবাবে RST যেত, আর পুরনো Segment একই চার সংখ্যার নতুন Connection এ ঢুকে পড়তে পারত",
            isCorrect: true,
            explanation:
              "ঠিক। এই দুইটাই TIME_WAIT এর কারণ, আর 2MSL সময়টা এই দুই বিপদ কাটার জন্য যথেষ্ট ধরা হয়।",
          },
          {
            key: "C",
            text: "Server এর File Descriptor ফুরিয়ে যেত",
            isCorrect: false,
            explanation: "File Descriptor ফুরানোর কারণ CLOSE_WAIT এর Leak, TIME_WAIT নয়।",
          },
        ],
      },
      {
        id: 4,
        text: "আপনার Server এ netstat চালিয়ে দেখলেন কয়েকশো CLOSE_WAIT, আর সংখ্যাটা প্রতি ঘণ্টায় বাড়ছে। সবচেয়ে সম্ভাব্য কারণ কী?",
        options: [
          {
            key: "A",
            text: "Network ধীর, তাই FIN পৌঁছাতে দেরি হচ্ছে",
            isCorrect: false,
            explanation:
              "CLOSE_WAIT মানে ওপাশের FIN ইতিমধ্যে এসে গেছে। অপেক্ষাটা Network এর নয়।",
          },
          {
            key: "B",
            text: "আপনার Program কোনো একটা পথে Socket বন্ধ করছে না",
            isCorrect: true,
            explanation:
              "ঠিক। CLOSE_WAIT এ Kernel অপেক্ষা করে নিজের Program এর close এর জন্য। এর কোনো Timeout নেই, তাই জমতে থাকা মানে Code এ Leak।",
          },
          {
            key: "C",
            text: "এটা স্বাভাবিক, ৬০ সেকেন্ডে নিজে সেরে যাবে",
            isCorrect: false,
            explanation: "নিজে সারে TIME_WAIT। CLOSE_WAIT Process বেঁচে থাকা পর্যন্ত থাকে।",
          },
        ],
      },
      {
        id: 5,
        text: "Log এ write EPIPE দেখা যাচ্ছে। তারে কী ঘটেছিল?",
        options: [
          {
            key: "A",
            text: "Program এমন একটা Connection এ লিখেছে, যেটা অন্য পাশ আগেই বন্ধ করেছে আর Kernel তা জানে",
            isCorrect: true,
            explanation:
              "ঠিক। সাধারণত আগের একটা Write এর জবাবে RST এসেছিল। এরপরের Write এ Kernel সোজা EPIPE দেয়।",
          },
          {
            key: "B",
            text: "DNS নামটা খুঁজে পায়নি",
            isCorrect: false,
            explanation: "সেটা হলে ENOTFOUND আসত, আর Connection খোলাই হতো না।",
          },
          {
            key: "C",
            text: "Port টা অন্য Process ধরে আছে",
            isCorrect: false,
            explanation: "সেটা EADDRINUSE, আর সেটা আসে কান পাতার সময়, লেখার সময় নয়।",
          },
        ],
      },
      {
        id: 6,
        text: "Load Balancer এর Idle Timeout ৬০ সেকেন্ড। মাঝে মাঝে 502 এড়াতে Node App এর keepAliveTimeout কত হওয়া উচিত?",
        options: [
          {
            key: "A",
            text: "৫ সেকেন্ড, Node এর Default",
            isCorrect: false,
            explanation:
              "তখন App আগে বন্ধ করে, আর Load Balancer মরা Connection এ Request পাঠাতে পারে। এটাই 502 এর কারণ।",
          },
          {
            key: "B",
            text: "ঠিক ৬০ সেকেন্ড",
            isCorrect: false,
            explanation: "সমান হলে দৌড়টা থেকেই যায়, কে আগে বন্ধ করবে নিশ্চিত নয়।",
          },
          {
            key: "C",
            text: "৬০ সেকেন্ডের চেয়ে কিছু বেশি, যেমন ৬৫",
            isCorrect: true,
            explanation:
              "ঠিক। পেছনের জনের ধৈর্য বেশি হলে সবসময় Load Balancer আগে বন্ধ করে, আর সে জানে ওটা বন্ধ।",
          },
        ],
      },
      {
        id: 7,
        text: "একটা Database Server এর বিদ্যুৎ হঠাৎ চলে গেল। App এর খাতায় সেই Connection গুলোর State কী থাকবে?",
        options: [
          {
            key: "A",
            text: "সাথে সাথে CLOSED, কারণ Server RST পাঠাবে",
            isCorrect: false,
            explanation: "বিদ্যুৎ চলে যাওয়া যন্ত্র কিছুই পাঠাতে পারে না।",
          },
          {
            key: "B",
            text: "ESTABLISHED, যতক্ষণ না App কিছু পাঠাতে গিয়ে Timeout খায় অথবা Keepalive ধরে ফেলে",
            isCorrect: true,
            explanation:
              "ঠিক। এটা Half-open Connection। চুপ থাকলে TCP কিছু পাঠায় না, তাই নিজে থেকে ধরা পড়ে না। এই কারণেই Timeout আর Heartbeat দরকার।",
          },
          {
            key: "C",
            text: "TIME_WAIT",
            isCorrect: false,
            explanation: "TIME_WAIT আসে শুধু পুরো চার ধাপের ভদ্র বিদায়ের পরে।",
          },
        ],
      },
      {
        id: 8,
        text: "Graceful Shutdown এ SIGTERM পাওয়ার পর সঠিক ক্রম কোনটা?",
        options: [
          {
            key: "A",
            text: "সাথে সাথে process.exit ডাকা",
            isCorrect: false,
            explanation: "এতে চলমান Request গুলোর Connection মাঝপথে কেটে যায়।",
          },
          {
            key: "B",
            text: "নতুন Connection নেওয়া বন্ধ, চুপ থাকা Connection বন্ধ, চলমান Request শেষ হতে দেওয়া, তারপর বেরোনো, আর একটা সময়সীমা রাখা",
            isCorrect: true,
            explanation:
              "ঠিক। আর সময়সীমাটা Docker বা Kubernetes এর SIGKILL এর সময়ের চেয়ে কম হতে হবে।",
          },
          {
            key: "C",
            text: "সব চলমান Request শেষ না হওয়া পর্যন্ত নতুন Request ও নিতে থাকা",
            isCorrect: false,
            explanation: "নতুন নিতে থাকলে চলমান কখনো শেষ হবে না, Process থামবেই না।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "বিদায়ের প্রতিটা রূপ নিজের যন্ত্রে ঘটান",
    subtitle: "ছয়টা পরীক্ষা, কোনোটাতেই sudo লাগে না",
    stepName: "LAB",
    steps: [
      {
        title: "FIN আর RST পাশাপাশি",
        description:
          "একই Program দুইভাবে চালান। একবার Client ভদ্রভাবে end ডাকে, একবার RST পাঠায়। Server কী দেখে মিলিয়ে নিন।",
      },
      {
        title: "TIME_WAIT ধরা আর মাপা",
        description:
          "একটা Connection খুলে নিজে আগে বন্ধ করুন, netstat এ TIME_WAIT দেখুন, আর ঘড়ি ধরে মাপুন কতক্ষণ থাকে।",
      },
      {
        title: "Address already in use, আর তার এক লাইনের সমাধান",
        description:
          "Server হিসেবে আগে বন্ধ করে সাথে সাথে একই Port এ বসার চেষ্টা, একবার SO_REUSEADDR ছাড়া আর একবার সহ।",
      },
      {
        title: "CLOSE_WAIT Leak তৈরি করা",
        description:
          "একটা Server যে বিদায়ের জবাব দিতে ভুলে যায়। কয়েকজন Client পাঠিয়ে দেখুন CLOSE_WAIT কীভাবে জমে।",
      },
      {
        title: "EPIPE ঘটানো",
        description:
          "যে Connection ওপাশ বন্ধ করে দিয়েছে সেখানে লিখতে থাকুন, আর দেখুন কততম Write এ Error আসে।",
      },
      {
        title: "Graceful Shutdown পরীক্ষা",
        description:
          "একটা ধীর Request চলার মাঝখানে Server কে SIGTERM দিন। চলমানটা শেষ হয় কি না আর নতুনটা ঢুকতে পারে কি না দেখুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-end-vs-reset.mjs",
        language: "javascript",
        code: `// চালান:  LAB_PORT=47001 node 1-end-vs-reset.mjs end
//         LAB_PORT=47001 node 1-end-vs-reset.mjs reset
import net from "node:net";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");
const mode = process.argv[2]; // "end" অথবা "reset"

const server = net.createServer((socket) => {
  socket.on("data", (chunk) => console.log("server got:", chunk.toString().trim()));
  socket.on("end", () => {
    console.log("server: client sent FIN, replying then closing my side");
    socket.end("bye from server\\n");
  });
  socket.on("error", (err) => console.log("server error:", err.code));
  socket.on("close", (hadError) => console.log("server: closed, hadError =", hadError));
});

server.listen(port, "127.0.0.1", () => {
  const client = net.connect(port, "127.0.0.1", () => {
    client.write("hello\\n");
    if (mode === "end") client.end();
    else setTimeout(() => client.resetAndDestroy(), 50);
  });
  client.on("data", (chunk) => console.log("client got:", chunk.toString().trim()));
  client.on("end", () => console.log("client: server sent FIN"));
  client.on("close", () => {
    console.log("client: closed");
    server.close();
  });
});

// end দিয়ে চালালে:
//   server got: hello
//   server: client sent FIN, replying then closing my side
//   server: closed, hadError = false
//   client got: bye from server      <- নিজে FIN পাঠানোর পরেও Client উত্তর পেল।
//   client: server sent FIN             এটাই Half Close।
//   client: closed
//
// reset দিয়ে চালালে:
//   server got: hello
//   server error: ECONNRESET          <- RST এর চেহারা
//   server: closed, hadError = true
//   client: closed`,
      },
      {
        filename: "2-time-wait.sh",
        language: "bash",
        code: `# আগে holder.mjs নামে এই ছোট Server টা বানিয়ে নিন (পরীক্ষা ২ আর ৪ এ লাগবে):
#   import net from "node:net";
#   const port = Number(process.env.LAB_PORT);
#   if (!port) throw new Error("LAB_PORT is not set");
#   net.createServer((s) => { s.on("end", () => s.end()); s.resume(); })
#     .listen(port, "127.0.0.1");

LAB_PORT=47002 node holder.mjs &
SERVER=$!
sleep 0.5

# nc এর Input শেষ হলেই সে আগে বন্ধ করে, তাই সে Active Closer
echo hi | nc 127.0.0.1 47002
netstat -an -p tcp | grep 47002
# tcp4  0  0  127.0.0.1.47002   *.*               LISTEN
# tcp4  0  0  127.0.0.1.57220   127.0.0.1.47002   TIME_WAIT
#             ^ Client এর দিক, কারণ সে আগে বন্ধ করেছে

# কতক্ষণ থাকে, মেপে দেখুন
T0=$(date +%s)
while netstat -an -p tcp | grep 47002 | grep -q TIME_WAIT; do sleep 1; done
echo "TIME_WAIT lasted $(( $(date +%s) - T0 ))s"
# macOS এ: TIME_WAIT lasted 31s      (2 x MSL, যেখানে MSL = ১৫ সেকেন্ড)
# Linux এ প্রায় ৬০ সেকেন্ড আসবে। Linux এ netstat এর বদলে:
#   ss -tan state time-wait | grep 47002

kill $SERVER`,
      },
      {
        filename: "3-rebind.py",
        language: "python",
        code: `# চালান:  LAB_PORT=47005 python3 3-rebind.py plain
#         LAB_PORT=47006 python3 3-rebind.py reuse
import os, socket, sys, time

port = int(os.environ["LAB_PORT"])
reuse = sys.argv[1] == "reuse"

def listen():
    s = socket.socket()
    if reuse:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind(("127.0.0.1", port))
    s.listen()
    return s

s = listen()
c = socket.create_connection(("127.0.0.1", port))
conn, _ = s.accept()
conn.close()          # Server আগে বন্ধ করল: Server এর দিক TIME_WAIT এ যাবে
time.sleep(0.2)
c.close()
s.close()             # Server থামল

try:
    listen()          # Server সাথে সাথে আবার চালু হতে চাইছে
    print("restart: OK")
except OSError as e:
    print("restart failed:", e)

# plain:  restart failed: [Errno 48] Address already in use
#         (Linux এ সংখ্যাটা 98, বার্তা একই)
# reuse:  restart: OK
#
# Node দিয়ে এটা দেখানো যায় না, কারণ Node নিজে থেকেই SO_REUSEADDR চালু রাখে।
# তাই এখানে Python, যেখানে Option টা নিজে চালু করতে হয়।`,
      },
      {
        filename: "4-close-wait-leak.mjs",
        language: "javascript",
        code: `// চালান:  LAB_PORT=47009 node 4-close-wait-leak.mjs &
import net from "node:net";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");

// Bug: Server Client এর FIN শোনে, কিন্তু নিজের দিক কখনো বন্ধ করে না।
// allowHalfOpen ছাড়া Node নিজেই বন্ধ করে দিত, তাই Bug টা দেখাতে এটা চালু।
const server = net.createServer({ allowHalfOpen: true }, (socket) => {
  socket.on("end", () => console.log("server: client sent FIN. I forget to call end()."));
  socket.resume();
});
server.listen(port, "127.0.0.1", () => console.log("leaky server on", port));

// আরেক Terminal এ তিনজন Client পাঠান, তারপর State দেখুন:
//   for i in 1 2 3; do echo hi | nc 127.0.0.1 47009 & done
//   sleep 1
//   netstat -an -p tcp | grep 47009
//
//   tcp4  0  0  127.0.0.1.47009   127.0.0.1.57332   CLOSE_WAIT
//   tcp4  0  0  127.0.0.1.47009   127.0.0.1.57331   CLOSE_WAIT
//   tcp4  0  0  127.0.0.1.47009   127.0.0.1.57330   CLOSE_WAIT
//   tcp4  0  0  127.0.0.1.57332   127.0.0.1.47009   FIN_WAIT_2
//   tcp4  0  0  127.0.0.1.57331   127.0.0.1.47009   FIN_WAIT_2
//   tcp4  0  0  127.0.0.1.57330   127.0.0.1.47009   FIN_WAIT_2
//   tcp4  0  0  127.0.0.1.47009   *.*               LISTEN
//
// এক মিনিট পরে আবার দেখুন। CLOSE_WAIT তিনটা তখনো আছে, যাবেও না।
// সারানোর উপায় এক লাইন: end ঘটনার ভেতরে socket.end() ডাকা।
// শেষে Server আর ঝুলে থাকা nc গুলো থামাতে ভুলবেন না:
//   kill %1 ; pkill -f "nc 127.0.0.1 47009"`,
      },
      {
        filename: "5-epipe.mjs",
        language: "javascript",
        code: `// চালান:  LAB_PORT=47007 node 5-epipe.mjs
import net from "node:net";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");

// Server Connection পাওয়া মাত্র ফোন রেখে দেয়।
const server = net.createServer((socket) => socket.destroy());

server.listen(port, "127.0.0.1", () => {
  // allowHalfOpen: Server এর FIN এলেও নিজের দিকটা খোলা রাখা।
  const client = net.connect({ port, host: "127.0.0.1", allowHalfOpen: true });
  client.on("end", () => console.log("client: server sent FIN, but I keep writing"));
  client.on("error", (err) => console.log("client error:", err.code));
  client.on("close", () => server.close());

  let n = 0;
  const timer = setInterval(() => {
    if (client.destroyed) return clearInterval(timer);
    n += 1;
    console.log("write", n);
    client.write("still talking\\n");
  }, 200);
});

// ফলাফল:
//   client: server sent FIN, but I keep writing
//   write 1          <- এটা তারে যায়, জবাবে RST আসে
//   write 2          <- Kernel এখন জানে নলটা ভাঙা
//   client error: EPIPE
//
// error ঘটনার লাইনটা মুছে আবার চালান। এবার Process টাই পড়ে যাবে।
// না ধরা একটা Socket Error পুরো Server থামিয়ে দেয়, এটা তার প্রমাণ।`,
      },
      {
        filename: "6-graceful.sh",
        language: "bash",
        code: `# তেরো নম্বর সেকশনের graceful.mjs ফাইলটা বানিয়ে নিন, তারপর:

PORT=47008 SHUTDOWN_GRACE_MS=5000 node graceful.mjs &
SERVER=$!
sleep 0.5

curl -s http://127.0.0.1:47008/ &          # ধীর বুকিং, দুই সেকেন্ড লাগবে
sleep 0.5
kill -TERM $SERVER                         # থামতে বলা
sleep 0.3
curl -s http://127.0.0.1:47008/ ; echo "new request exit code: $?"
wait $SERVER ; echo "server exit code: $?"

# listening on 47008
# SIGTERM: no new connections, finishing what is in flight
# new request exit code: 7
# booking confirmed
# all connections closed, exiting cleanly
# server exit code: 0

# এবার তিনটা বদল করে দেখুন কী হয়:
# ১. SHUTDOWN_GRACE_MS=1000 দিন। বুকিং এর দুই সেকেন্ড লাগে, সময়সীমা এক।
#    এবার কোন লাইনটা ছাপা হয়, আর curl কী পায়?
# ২. kill -TERM এর বদলে kill -KILL দিন। SIGTERM এর Handler কি চলার সুযোগ পায়?
# ৩. process.on("SIGTERM", ...) অংশটা পুরো মুছে দিন, আবার kill -TERM দিন।
#    চলমান বুকিং এর কী হলো?`,
      },
    ],
    tip: "পরীক্ষা ২ আর ৪ পাশাপাশি রেখে ভাবুন, কারণ পুরো লেসনের সবচেয়ে কাজের শিক্ষাটা এই দুইটার তফাতে। দুইটাতেই Connection ঝুলে আছে মনে হয়। কিন্তু TIME_WAIT টা আধা মিনিট পরে নিজে উধাও হয়ে গেল, আপনাকে কিছু করতে হয়নি। CLOSE_WAIT গুলো যতক্ষণ Process চলবে ততক্ষণ থাকবে, আর সারাতে হলে Code বদলাতে হবে। Production এ কেউ যখন বলবে Connection জমে যাচ্ছে, আপনি এখন জানেন প্রথম প্রশ্নটা কী: কোন State এ জমছে। সেই এক শব্দের উত্তরই বলে দেয় সমস্যাটা Network এর স্বাভাবিক আচরণ, নাকি নিজের Code এর ফুটো।",
  },
  assignment: {
    title: "Mini Project: my-tours এর জন্য Connection বন্ধ করার নিয়মপত্র",
    time: "৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>State গুনুন আর ব্যাখ্যা করুন:</strong> নিজের যন্ত্রে সব TCP
        Connection কে State অনুযায়ী গুনুন। প্রতিটা State এর পাশে এক লাইনে লিখুন
        এই মুহূর্তে সেটা থাকা স্বাভাবিক কি না, আর কেন। তারপর Browser এ দশটা সাইট
        খুলে সব Tab বন্ধ করুন, আবার গুনুন, আর দুই গোনার তফাতটা ব্যাখ্যা করুন।
      </span>,
      <span key="2">
        <strong>চার ধাপ এঁকে দেখান:</strong> কাগজে দুইটা ছবি আঁকুন। প্রথমটায় ফোন
        আগে বন্ধ করছে, দ্বিতীয়টায় Server। প্রতিটায় চারটা Segment, দুই পাশের
        প্রতিটা State, আর কে TIME_WAIT এ যায় তা দেখান। তারপর তৃতীয় একটা ছবি
        আঁকুন, যেখানে শেষ ACK টা হারিয়ে গেছে, আর দেখান এরপর কী ঘটে।
      </span>,
      <span key="3">
        <strong>Leak সারান:</strong> Lab এর চার নম্বর পরীক্ষার Server টা চালান,
        দশজন Client পাঠান, আর CLOSE_WAIT এর সংখ্যা লিখে রাখুন। তারপর Code এ
        ঠিক এক লাইন যোগ করে Bug টা সারান, আবার দশজন Client পাঠান, আর দেখান যে
        CLOSE_WAIT আর জমছে না। আগের আর পরের netstat এর ফলাফল দুইটাই জমা দিন।
      </span>,
      <span key="4">
        <strong>my-tours এ Graceful Shutdown বসান:</strong> আপনার নিজের my-tours
        Server এ SIGTERM এর Handler যোগ করুন, পাঁচ ধাপ মেনে। সময়সীমা আর
        Keep-Alive Timeout দুইটাই Environment Variable থেকে পড়ুন, আর না থাকলে
        Server যেন চালুই না হয়। একটা ইচ্ছা করে ধীর Route বানিয়ে প্রমাণ করুন যে
        চলমান Request শেষ হয়, নতুনটা ঢোকে না, আর সময়সীমা পার হলে Process নিজে
        বেরিয়ে যায়।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> দলের একজন নতুন সদস্য
        লিখেছেন, Log এ মাঝে মাঝে ECONNRESET আর দিনে কয়েকটা 502 দেখছি, Server তো
        ঠিকই চলছে, এগুলো কি উপেক্ষা করব? তাঁকে বোঝান এই দুইটা বার্তার মানে কী,
        তারে আসলে কী ঘটছে, কোন দুইটা সংখ্যা মিলিয়ে দেখতে হবে, আর কোন Request
        আবার পাঠানো নিরাপদ আর কোনটা নয়।
      </span>,
    ],
    deliverables: [
      <span key="1">দুইবারের State গণনা, প্রতিটা State এর এক লাইনের ব্যাখ্যা সহ</span>,
      <span key="2">তিনটা ছবি: ফোন আগে, Server আগে, আর হারানো শেষ ACK</span>,
      <span key="3">সারানোর এক লাইন, আর আগের ও পরের netstat ফলাফল</span>,
      <span key="4">my-tours এর Shutdown Code, আর তিনটা আচরণের প্রমাণ হিসেবে Terminal এর ফলাফল</span>,
      <span key="5">নতুন সদস্যের জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
