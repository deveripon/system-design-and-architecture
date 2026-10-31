/**
 * What: Module 06 Lesson 06, Session vs JWT. How a server remembers a person
 * after login: a server session kept in Redis, or a signed JWT, how each one is
 * built, checked, expired and revoked, and which one Island Tours uses where.
 *
 * Why: Login bugs and token mistakes are among the most common security holes
 * a developer ships. The lesson builds both kinds of proof by hand in the lab,
 * so the reader can choose between them for a reason and explain that reason.
 */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  JwtVerifyLab,
  ProofChoiceLab,
  RefreshRotationLab,
  SessionScaleLab,
} from "../../../components/course/topics/http/session-animations";
import {
  FixationSplit,
  JwtAnatomyDiagram,
  LoginProofDiagram,
  ProofTypesSplit,
  RefreshTimelineDiagram,
  SessionLookupDiagram,
  SigningKeysSplit,
} from "../../../components/course/topics/http/session-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const mono = (text: string) => (
  <span className="font-mono font-bold text-primary">{text}</span>
);

const link = (href: string, text: string) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-primary underline underline-offset-4"
  >
    {text}
  </a>
);

export const sessionVsJwtContent: TopicData = {
  id: "session-vs-jwt",
  introduction: {
    badge: "MODULE 06 · LESSON 06",
    title: <SectionTitle>Login এর পরে Server আপনাকে মনে রাখে কীভাবে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          পর্যটক Island Tours এ নিজের email আর Password দিয়ে Login করলেন। তারপর
          তিনি সেন্ট মার্টিনের ট্যুরটা খুললেন, তারিখ বাছলেন, দুইটা আসন বুক করলেন,
          শেষে নিজের প্রোফাইলে গিয়ে বুকিংটা দেখলেন। প্রতিটা ক্লিক একটা আলাদা HTTP
          Request। আর লেসন ০২ এ দেখেছেন, HTTP নিজে কিছুই মনে রাখে না, প্রতিটা
          Request Server এর কাছে একদম নতুন একজন অচেনা মানুষ। তাহলে চতুর্থ Request
          এ Server কীভাবে জানল এটা সেই একই পর্যটক, usr_42? Password তো আর একবারও
          পাঠানো হয়নি।
        </ContentParagraph>
        <ContentParagraph>
          উত্তরটা সহজ শোনায়: Login এর সময় Server পর্যটকের হাতে একটা প্রমাণ তুলে দেয়,
          আর পরের প্রতিটা Request সেই প্রমাণটা সাথে নিয়ে আসে। কিন্তু প্রমাণটা কী দিয়ে
          বানানো, কে সেটা মনে রাখে, কতদিন চলে, হারালে বা চুরি হলে কী হয়, এই
          প্রশ্নগুলোর দুইটা বড় উত্তর আছে। একটার নাম Server Session, অন্যটার নাম JWT।
          Internet এ এই দুইটা নিয়ে অনেক তর্ক দেখবেন, আর তর্কের বেশিরভাগই ভুল ধারণা
          থেকে আসে।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন Authentication আর Authorization এর তফাত, Login
          এর মুহূর্তে ঠিক কী ঘটে, একটা Session Redis এ কীভাবে থাকে আর কীভাবে
          সাথে সাথে বাতিল হয়, Session Fixation কী, অনেকগুলো Server এ Session কেন
          হারিয়ে যায়, একটা JWT এর তিন অংশে কী লেখা থাকে, সই কীভাবে হয় আর
          কীভাবে যাচাই করতে হয়, কোন ফাঁদে মানুষ সবচেয়ে বেশি পড়ে, Token কোথায়
          রাখবেন, JWT বাতিল করার সমস্যা আর Refresh Token দিয়ে তার সমাধান, আর শেষে
          কোন পরিস্থিতিতে কোনটা বেছে নেবেন। Lab এ দুইটাই নিজের হাতে বানাবেন, কোনো
          Library ছাড়া।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "ক্লোকরুমের টোকেন নিজে কিছু বলে না, কাউন্টারের খাতা বলে। মেলার পাস নিজেই সব বলে, তাই খাতা লাগে না। কিন্তু খাতার লাইন যখন খুশি কেটে দেওয়া যায়, আর পাসে একবার সিল পড়ে গেলে মেয়াদ শেষ না হওয়া পর্যন্ত সেটা চলতেই থাকে।",
      author: "Session vs JWT",
      role: "Lesson 06",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "the-problem",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>প্রতিটা Request একজন নতুন অচেনা মানুষ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা দোকানের কথা ভাবুন, যেখানে দোকানদারের স্মৃতি প্রতি মিনিটে মুছে
                যায়। আপনি ঢুকে নিজের পরিচয়পত্র দেখালেন, তিনি আপনাকে চিনলেন। এক মিনিট
                পরে আরেকটা জিনিস চাইলেন, তিনি আবার জিজ্ঞেস করলেন আপনি কে। HTTP ঠিক এই
                দোকানদার। লেসন ০২ এ এর নাম শিখেছেন: Stateless। প্রতিটা Request নিজের
                ভেতরে সম্পূর্ণ, আগের Request এর কথা Server এর মনে থাকে না।
              </ContentParagraph>
              <ContentParagraph>
                এই দোকানে টিকে থাকার প্রথম উপায়টা সবার মাথায় আসে: প্রতিটা Request এর
                সাথে email আর Password পাঠিয়ে দিই। এটা কাজ করবে, কিন্তু চারটা বড়
                সমস্যা নিয়ে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Password হাজারবার রাস্তায় নামে।</strong> একটা সাধারণ সাইট
                  খুললেই কয়েক ডজন Request যায়। প্রতিটায় Password থাকা মানে প্রতিটা
                  Log, প্রতিটা Proxy, প্রতিটা ভুল জায়গায় Password ফাঁস হওয়ার একটা করে
                  সুযোগ।
                </ListItem>
                <ListItem>
                  <strong>Browser কে Password মনে রাখতে হয়।</strong> মানে JavaScript এর
                  কোথাও Password পড়ে থাকে, আর পাতায় কোনো দুষ্ট Script ঢুকলে সে সেটা
                  তুলে নিয়ে যেতে পারে।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা Request ধীর হয়ে যায়।</strong> Password যাচাই ইচ্ছা
                  করে ধীর রাখা হয়, একটা পরীক্ষায় কয়েক দশ মিলিসেকেন্ড, যাতে চোর লাখ
                  লাখ Password আন্দাজ করতে না পারে (একটু পরেই দেখবেন)। প্রতিটা Request
                  এ এই খরচ দেওয়া চলে না।
                </ListItem>
                <ListItem>
                  <strong>Logout বলে কিছু থাকে না।</strong> Password যতদিন না বদলান,
                  ততদিন যার হাতে সেটা আছে সে-ই আপনি।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তাই সব সাইট দ্বিতীয় উপায়টা নেয়। Password যায় শুধু একবার, Login এর
                মুহূর্তে। Server সেটা যাচাই করে পর্যটকের হাতে একটা প্রমাণ তুলে দেয়।
                তারপর থেকে প্রতিটা Request শুধু সেই প্রমাণটা দেখায়। প্রশ্ন হলো,
                প্রমাণটা দেখতে কেমন। দুইটা একদম আলাদা নকশা আছে, আর দুইটাই আপনি
                প্রতিদিনের জীবনে দেখেছেন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ProofTypesSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম নকশাটা ক্লোকরুমের টোকেন। টোকেনে লেখা শুধু একটা নম্বর, নিজে থেকে
                তার কোনো মানে নেই। মানেটা থাকে কাউন্টারের খাতায়। এই নকশার নাম Server
                Session। Server Login এর পর একটা এলোমেলো নম্বর বানায়, নিজের খাতায় লিখে
                রাখে যে এই নম্বরটা usr_42 এর, আর পর্যটকের হাতে শুধু নম্বরটা দেয়।
                নম্বরটাকে বলে Session id।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় নকশাটা মেলার প্রবেশ পাস। পাসের গায়েই লেখা কার পাস, কী ভূমিকা,
                কতক্ষণ চলবে, সাথে আয়োজকের সিল। প্রহরী কোনো খাতা খোলেন না, সিলটা আসল কি
                না দেখেই ঢুকতে দেন। এই নকশার সবচেয়ে প্রচলিত রূপটার নাম JWT, পুরো নাম
                JSON Web Token। সিলটা এখানে একটা Cryptographic Signature, যা শুধু Server
                এর কাছে থাকা একটা গোপন চাবি দিয়েই বানানো যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "আসল তফাতটা Cookie আর Header নয়",
          content: (
            <p>
              একটা ভুল ধারণা খুব চালু: Session মানে Cookie, আর JWT মানে Authorization
              Header। আসলে দুইটা আলাদা প্রশ্ন। প্রমাণটা কেমন, সেটা এক প্রশ্ন: একটা
              Reference, মানে খাতার নম্বর (Session id, যাকে Opaque Token ও বলে), নাকি
              Self-contained, মানে নিজের গায়েই সব লেখা (JWT)। প্রমাণটা কোন পথে যায়, সেটা
              আরেক প্রশ্ন: Cookie তে, নাকি Header এ। Session id কে Header এ পাঠানো যায়,
              JWT কে Cookie তে রাখা যায়। এই লেসনে দুইটা প্রশ্ন আলাদা রাখব, তাহলে বাকি
              সব পরিষ্কার থাকবে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "authn-authz",
      subHeader: { index: "002", title: "Authentication vs Authorization" },
      title: <SectionTitle>আপনি কে, আর আপনি কী করতে পারেন: দুইটা আলাদা প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                হোটেলের কথা ভাবুন। রিসেপশনে পরিচয়পত্র দেখিয়ে আপনি একটা চাবি কার্ড
                পেলেন। কার্ডটা প্রমাণ করে আপনি এই হোটেলের অতিথি। কিন্তু সেই কার্ড দিয়ে
                খোলে শুধু ৩০৪ নম্বর ঘর, পাশের ঘর নয়, রান্নাঘর নয়। এখানে দুইটা আলাদা
                প্রশ্নের উত্তর মিলছে, আর দুইটার আলাদা নাম আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Authentication</strong>, ছোট করে AuthN: আপনি কে? এর উত্তর
                  আসে প্রমাণ থেকে। Password, তারপর Session বা JWT।
                </ListItem>
                <ListItem>
                  <strong>Authorization</strong>, ছোট করে AuthZ: আপনি যা করতে চাইছেন,
                  সেটা করার অনুমতি কি আপনার আছে? এর উত্তর আসে নিয়ম আর Data থেকে: এই
                  বুকিংটা কার, এই ইউজারের ভূমিকা কী।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                লেসন ০৩ এর দুইটা Status Code ঠিক এই দুইটা প্রশ্নের ব্যর্থতা। 401
                Unauthorized নামটা বিভ্রান্তিকর, আসলে এর মানে আমি জানি না আপনি কে, আগে
                প্রমাণ দিন। 403 Forbidden মানে আমি জানি আপনি কে, কিন্তু এই কাজটা আপনার
                জন্য নয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Island Tours এ Request", "কোন প্রশ্ন", "উত্তর না মিললে"],
          rows: [
            [mono("GET /api/me"), "শুধু AuthN: কে?", "401, প্রমাণ নেই বা অচল"],
            [mono("GET /api/tours/saint-martin"), "কোনোটাই না, সবার জন্য খোলা", "কখনো 401 নয়"],
            [mono("PATCH /api/bookings/bk_7Q2M9X"), "AuthN, তারপর AuthZ: বুকিংটা কি তাঁর?", "অন্যের বুকিং হলে 403 বা 404"],
            [mono("DELETE /api/tours/sajek-valley"), "AuthN, তারপর AuthZ: ভূমিকা কি admin?", "সাধারণ পর্যটক হলে 403"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই লেসনের Session আর JWT শুধু প্রথম প্রশ্নের উত্তর দেয়: এই Request টা
                usr_42 এর। দ্বিতীয় প্রশ্নের উত্তর দিতে হয় আপনার নিজের Code কে, প্রতিটা
                Request এ, Database এর এই মুহূর্তের সত্য দেখে। নিচের ছোট অংশটা প্রতিটা
                Booking Route এর আসল চেহারা। দুইটা লাইন, দুইটা আলাদা পরীক্ষা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "booking-route-shape.js",
          code: `// চেহারাটা দেখানোর জন্য, যেকোনো Framework এ একই দুই ধাপ
const user = await requireUser(req);            // AuthN: কে? প্রমাণ না থাকলে 401
const booking = await findBooking(req.params.id);
if (!booking || booking.userId !== user.id) {   // AuthZ: এই বুকিং কি তাঁর?
  return res.status(404).json({ error: "booking not found" });
}
// এখানে পৌঁছালে তবেই বুকিং বদলানো`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "সবচেয়ে চালু নিরাপত্তা Bug টা এখানেই",
          content: (
            <p>
              অনেক App শুধু প্রথম লাইনটা লেখে, দ্বিতীয়টা ভুলে যায়। Login করা যেকোনো
              ইউজার তখন URL এর id বদলে অন্যের বুকিং দেখতে পারেন:{" "}
              <code>bk_7Q2M9X</code> এর জায়গায় <code>bk_7Q2M9Y</code>। এর নাম IDOR,
              Insecure Direct Object Reference, আর বাস্তবের Bug রিপোর্টে এটা প্রায় সবসময়
              উপরের দিকে থাকে। খেয়াল করুন উপরের Code অন্যের বুকিং এ 403 না দিয়ে 404
              দিয়েছে। এতে বাইরের কেউ জানতেও পারেন না যে ওই id তে আদৌ কোনো বুকিং আছে।
              দুইটাই চলে, শুধু নিজের API তে একটা নিয়ম ঠিক করে সব জায়গায় সেটাই মানুন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "login-moment",
      subHeader: { index: "003", title: "The Login Moment" },
      title: <SectionTitle>Login এর মুহূর্তে আসলে কী ঘটে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Session আর JWT এর ভেতরে ঢোকার আগে Login এর মুহূর্তটা ধাপে ধাপে দেখে
                নিই, কারণ এই অংশটা দুইটার জন্যই হুবহু এক। তফাত শুরু হয় একদম শেষ ধাপে,
                প্রমাণ বানানোর সময়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>১. Browser একটা POST পাঠায়।</strong>{" "}
                  <code>POST /api/auth/login</code>, Body তে email আর Password। এটা যায়
                  HTTPS দিয়ে, নইলে পথের যে কেউ Password টা পড়ে ফেলবে। কেন আর কীভাবে,
                  সেটা পরের লেসনের পুরো বিষয়।
                </ListItem>
                <ListItem>
                  <strong>২. Server ইউজার খোঁজে।</strong> email দিয়ে PostgreSQL এর{" "}
                  <code>users</code> টেবিলে।
                </ListItem>
                <ListItem>
                  <strong>৩. Server Password মেলায়, Hash দিয়ে।</strong> Database এ
                  Password কখনো সরাসরি থাকে না, থাকে তার Hash। নিচের বাক্সে এক অনুচ্ছেদে
                  এর মানে বলছি।
                </ListItem>
                <ListItem>
                  <strong>৪. ভুল হলে একটাই বার্তা।</strong> email ভুল হোক বা Password,
                  উত্তর একই: email বা Password ভুল। আলাদা বার্তা দিলে বাইরের কেউ জেনে
                  যান কোন email গুলো এই সাইটে আছে। আর বারবার ভুল চেষ্টা এলে Server উত্তর
                  দেয় 429 Too Many Requests, লেসন ০৩ এর সেই Code।
                </ListItem>
                <ListItem>
                  <strong>৫. ঠিক হলে প্রমাণ বানায়।</strong> Session হলে একটা এলোমেলো id
                  আর খাতায় একটা লাইন, JWT হলে একটা সই করা Token। তারপর Password আর কখনো
                  রাস্তায় নামে না।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LoginProofDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তারের উপর Island Tours এর Website এর Login টা দেখতে এরকম। Password এর
              জায়গায় তিনটা বিন্দু রেখেছি, কারণ আসল Password কখনো কোনো উদাহরণে বা
              Terminal এ লিখবেন না। উত্তরে কোনো Body নেই, তাই 204 No Content, আর আসল
              জিনিসটা আছে Set-Cookie Header এ। Cookie এর প্রতিটা Attribute এর মানে আগের
              লেসনে শিখেছেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "http",
          filename: "website-login.http",
          code: `POST /api/auth/login HTTP/1.1
Host: islandtours.example
Content-Type: application/json

{"email":"tourist@mail.example","password":"..."}

HTTP/1.1 204 No Content
Set-Cookie: __Host-session=hcxEFANEWLVqDT03_nxAR8lENp0O4CjdL75IzD4bGQ8; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=1209600`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আর Island Tours এর Mobile App এর Login একই Server এ যায়, শুধু উত্তরে Cookie
              এর বদলে JSON এ দুইটা Token আসে। দুইটার মানে এই লেসনের শেষের দিকে পরিষ্কার
              হবে। আপাতত শুধু খেয়াল করুন, প্রথম ধাপগুলো একই, তফাত শুধু প্রমাণের চেহারায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "http",
          filename: "mobile-login.http",
          code: `POST /api/auth/login HTTP/1.1
Host: api.islandtours.example
Content-Type: application/json

{"email":"tourist@mail.example","password":"..."}

HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store

{"accessToken":"eyJhbGciOiJFUzI1NiIs...","expiresIn":900,"refreshToken":"Qm9X..."}`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "Password কখনো সরাসরি জমা হয় না",
          content: (
            <p>
              Hash হলো একমুখী একটা হিসাব: Password দিলে একটা লম্বা ছাপ বের হয়, কিন্তু ছাপ
              থেকে Password ফেরত পাওয়া যায় না। Login এর সময় Server নতুন করে টাইপ করা
              Password এর ছাপ বানিয়ে জমা রাখা ছাপের সাথে মেলায়। Password এর জন্য সাধারণ
              দ্রুত Hash চলে না, লাগে ইচ্ছা করে ধীর আর Memory খাওয়া Hash, যেমন argon2id
              বা bcrypt, প্রতিটা ইউজারের জন্য আলাদা এলোমেলো Salt সহ। Database চুরি হলেও
              চোরকে তখন প্রতিটা আন্দাজের জন্য সেই ধীর খরচটা দিতে হয়। এর বেশি গভীরে এই
              লেসনে যাব না, তবে একটা নিয়ম মাথায় গেঁথে রাখুন: নিজে Hash বানাবেন না, প্রমাণিত
              Library ব্যবহার করবেন, আর Password কোনো Log এ কখনো লিখবেন না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "server-session",
      subHeader: { index: "004", title: "Server Session" },
      title: <SectionTitle>Server Session: খাতাটা থাকে Server এর কাছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার ক্লোকরুমের টোকেনটা আসলে বানাই। Login সফল হলে Server তিনটা কাজ
                করে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একটা এলোমেলো id বানায়।</strong> Node এ{" "}
                  <code>crypto.randomBytes(32).toString(&quot;base64url&quot;)</code>। ৩২
                  Byte মানে ২৫৬ Bit এলোমেলোতা। পৃথিবীর সব Computer মিলে কোটি বছর আন্দাজ
                  করলেও একটা চালু id মেলানোর সম্ভাবনা কার্যত শূন্য। base64url এ লিখলে
                  দাঁড়ায় ঠিক ৪৩ অক্ষর, আর তাতে এমন কোনো চিহ্ন থাকে না যা Cookie বা URL এ
                  ঝামেলা করে।
                </ListItem>
                <ListItem>
                  <strong>খাতায় একটা লাইন লেখে।</strong> Island Tours এর খাতা হলো
                  Redis, Memory তে চলা একটা দ্রুত Key Value Store। Key{" "}
                  <code>session:&lt;id&gt;</code>, Value তে ইউজারের id আর কখন বানানো
                  হলো, আর সাথে একটা TTL, মানে কত সেকেন্ড পরে Redis নিজেই লাইনটা মুছে
                  দেবে। এই TTL এর ধারণাটা DNS মডিউলের Cache লেসনের TTL এর মতোই।
                </ListItem>
                <ListItem>
                  <strong>id টা Cookie তে পাঠায়।</strong> Cookie তে থাকে শুধু id, আর
                  কিছু না। পর্যটক কে, তাঁর ভূমিকা কী, এসব Browser এ যায়ই না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এরপর প্রতিটা Request এ উল্টো কাজটা হয়: App Cookie থেকে id পড়ে, Redis
                এ খোঁজে, পেলে ইউজার চেনে, না পেলে 401 দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SessionLookupDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              id বানানোটা নিজের যন্ত্রে এক লাইনে দেখে নিন। প্রতিবার চালালে একদম আলাদা
              একটা id আসবে, আর দৈর্ঘ্য সবসময় ৪৩।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "make-session-id.sh",
          code: `node -e 'console.log(require("node:crypto").randomBytes(32).toString("base64url"))'
# 1wSofAgr7o5fNtdckdw0Vsu8JSg1Dun9d8yVa5HkLkI

node -e 'console.log(require("node:crypto").randomBytes(32).toString("base64url").length)'
# 43`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Redis এর ভেতরে লাইনটা কীভাবে লেখা, পড়া আর মোছা হয়, তার চেহারা নিচে।
              Redis এখনো আপনার যন্ত্রে নেই, Module 14 এ বসাবেন, তাই এটা চালানো ফলাফল
              নয়, কমান্ডগুলোর চেহারা। App এর Code ঠিক এই চারটা কাজই করে, শুধু একটা
              Library এর মাধ্যমে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "redis-session-shape.txt",
          code: `# Login: লাইন লেখা, ১৪ দিনের TTL সহ (14 x 24 x 3600 = 1209600)
SET session:hcxEFANEWLVqDT03_nxAR8lENp0O4CjdL75IzD4bGQ8 '{"userId":"usr_42","createdAt":1793428145}' EX 1209600

# প্রতিটা Request: লাইন পড়া
GET session:hcxEFANEWLVqDT03_nxAR8lENp0O4CjdL75IzD4bGQ8
# "{\\"userId\\":\\"usr_42\\",\\"createdAt\\":1793428145}"

# আর কত সেকেন্ড বাকি
TTL session:hcxEFANEWLVqDT03_nxAR8lENp0O4CjdL75IzD4bGQ8
# (integer) 1209543

# Logout: লাইন মোছা
DEL session:hcxEFANEWLVqDT03_nxAR8lENp0O4CjdL75IzD4bGQ8
# (integer) 1`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Session এ কী রাখবেন, আর কী রাখবেন না",
          content: (
            <p>
              রাখুন অল্প: ইউজারের id, কখন বানানো, কখন শেষবার ব্যবহার হলো, দরকার হলে
              একটা CSRF Token। পুরো ইউজারের তথ্য রাখবেন না, কারণ ইউজার নাম বা ভূমিকা
              বদলালে Session এর কপিটা পুরনো হয়ে যাবে, আর আপনি ভুল তথ্যে সিদ্ধান্ত নেবেন।
              id রাখুন, বাকিটা দরকার হলে Database থেকে আনুন। আরেকটা ভালো অভ্যাস: Redis এর
              Key হিসেবে id নিজে না রেখে তার SHA-256 Hash রাখা। তাহলে কেউ Redis এর একটা
              কপি হাতে পেলেও সেখান থেকে কোনো চালু Cookie বানাতে পারবেন না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "expiry-logout",
      subHeader: { index: "005", title: "Expiry and Revocation" },
      title: <SectionTitle>মেয়াদ, Logout, আর এখনই বাতিল করার ক্ষমতা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা Session চিরকাল চলতে পারে না। কতদিন চলবে, সেটা দুইটা আলাদা ঘড়ি দিয়ে
                ঠিক হয়, আর দুইটা ঘড়িরই দরকার আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Idle Timeout, বা Sliding Expiry।</strong> শেষবার ব্যবহারের পর
                  কতক্ষণ চুপ থাকলে Session মরে যাবে। পর্যটক প্রতিদিন সাইটে এলে ঘড়িটা
                  বারবার নতুন করে শুরু হয়। Redis এ এটা করা হয় ব্যবহারের সময় TTL আবার
                  বাড়িয়ে দিয়ে।
                </ListItem>
                <ListItem>
                  <strong>Absolute Timeout।</strong> যত ব্যবহারই হোক, বানানোর পর সর্বোচ্চ
                  কতদিন। এটা না থাকলে একটা চুরি যাওয়া Session প্রতিদিন একটু করে ব্যবহার
                  করলে অনন্তকাল চলত। Value তে রাখা <code>createdAt</code> এই কাজেই লাগে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Island Tours এ Website এর Session এর Idle Timeout ১৪ দিন, Absolute Timeout
                ৩০ দিন। Cookie এর Max-Age ও ১৪ দিন, যাতে Browser আর Server এর হিসাব
                মোটামুটি মেলে। তবে একটা কথা মনে রাখুন: Cookie এর মেয়াদ একটা অনুরোধ মাত্র,
                Browser এর সুবিধার জন্য। আসল সিদ্ধান্ত সবসময় Server এর খাতা নেয়।
              </ContentParagraph>
              <ContentParagraph>
                এবার Session এর সবচেয়ে বড় শক্তিটা দেখুন। Logout এ Server দুইটা কাজ করে:
                Redis থেকে লাইনটা মোছে, আর Set-Cookie দিয়ে Browser কে বলে Cookie টা ফেলে
                দিতে (<code>Max-Age=0</code>)। দুইটাই জরুরি, কিন্তু প্রথমটাই আসল। শুধু
                Cookie মুছলে, আর কেউ যদি id টার একটা কপি আগে রেখে থাকেন, সেটা চলতেই থাকত।
                লাইনটা মুছলে সেই কপি সাথে সাথে অচল। নিচের ফলাফলটা এই লেসনের Lab ২
                চালিয়ে পাওয়া, চুরি করা কপিটা দিয়ে Logout এর পরে চেষ্টা করা হয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "stolen-copy-after-logout.txt",
          code: `$ curl -s -b jar.txt $B/api/me
{"userId":"usr_42","secondsLeft":20}

$ curl -s -b jar.txt -c jar.txt -X POST $B/api/auth/logout
{"ok":true}

$ curl -s -i -H "Cookie: session=$STOLEN" $B/api/me
HTTP/1.1 401 Unauthorized
{"error":"not logged in"}`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই ক্ষমতা থেকে আরও তিনটা কাজের জিনিস বের হয়, যা প্রায় সব সত্যিকারের সাইটে
                লাগে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সব ডিভাইস থেকে বের করুন।</strong> প্রতিটা ইউজারের জন্য একটা
                  আলাদা তালিকা রাখা হয়, যেমন Redis এর Set{" "}
                  <code>user_sessions:usr_42</code>, যাতে তাঁর সব Session id থাকে। বোতাম
                  চাপলে তালিকার সব লাইন মুছে ফেলা হয়।
                </ListItem>
                <ListItem>
                  <strong>Password বদলালে বাকি সব Session শেষ।</strong> কেউ Password বদলান
                  সাধারণত সন্দেহ হলে। তখন যে ডিভাইসে বদলালেন সেটা বাদে বাকি সব Session মুছে
                  দেওয়াই ঠিক।
                </ListItem>
                <ListItem>
                  <strong>Ban সাথে সাথে কার্যকর।</strong> Support দল একজন প্রতারককে
                  আটকালে তাঁর Session গুলো মুছে দেন। পরের Request থেকেই 401।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই সেকশনটা মনে রাখুন, JWT এ এসে কাজে লাগবে",
          content: (
            <p>
              Session এর খাতা Server এর হাতে, তাই বাতিল করা মানে শুধু একটা লাইন মোছা।
              একটু পরেই দেখবেন, JWT এর কোনো খাতা নেই, তাই ঠিক এই কাজটাই সেখানে সবচেয়ে
              কঠিন। Session vs JWT তর্কের অর্ধেকটা আসলে এই একটা প্রশ্ন: কত দ্রুত একটা
              প্রমাণ বাতিল করতে হবে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "fixation",
      subHeader: { index: "006", title: "Session Fixation" },
      title: <SectionTitle>Login এর সময় id বদলানো কেন বাধ্যতামূলক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অনেক সাইট Login এর আগেই একটা Session খোলে, যেমন কেউ Login না করেই ট্যুর
                Cart এ রাখলে। ধরুন Login এর পরে Server নতুন id না বানিয়ে আগের id টাকেই
                Login করা বলে চিহ্নিত করে দিল। শুনতে নিরীহ, কিন্তু এখানে একটা পরিচিত
                আক্রমণের দরজা খোলে, যার নাম Session Fixation।
              </ContentParagraph>
              <ContentParagraph>
                আক্রমণকারী নিজে সাইট খুলে একটা Session id পেলেন, ধরা যাক X। তারপর কোনো
                ফাঁক দিয়ে সেই X টা পর্যটকের Browser এ বসিয়ে দিলেন। পুরনো সাইটে URL এ id
                রাখা হতো, তখন শুধু একটা Link পাঠালেই হতো। এখন পথ কঠিন, যেমন একই Site এর
                কোনো দুর্বল Subdomain থেকে Cookie বসানো, কিন্তু অসম্ভব নয়। পর্যটক
                নিজের Password দিয়ে Login করলেন। Server যদি X কেই Login করা বানায়, তাহলে
                আক্রমণকারীর হাতের X ও এখন পর্যটক।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FixationSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিরোধ এক লাইনের: প্রতিটা Login এ একদম নতুন id বানান, আর আগের id এর
                লাইনটা মুছে দিন। ক্ষমতা বাড়ার প্রতিটা মুহূর্তেও একই কাজ করুন, যেমন কেউ
                Admin Panel এ ঢোকার আগে আবার Password দিলেন। Lab ১ এর Server এ এই কাজটা এই
                দুই লাইনে হয়:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "rotate-on-login.js",
          code: `const old = findSession(req);
if (old) sessions.delete(old.id); // Login এ সবসময় নতুন id, পুরনোটা বাতিল
const id = randomBytes(32).toString("base64url");`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "আরও দুইটা নিয়ম, একই আক্রমণের আত্মীয়দের জন্য",
          content: (
            <p>
              প্রথমত, Session id কখনো URL এ রাখবেন না। লেসন ০১ এ দেখেছেন, URL চলে যায়
              Browser History তে, Server এর Log এ, আর Referer Header এ অন্য সাইটে।
              দ্বিতীয়ত, Server শুধু সেই id মানবে যা সে নিজে বানিয়েছে। বাইরে থেকে আসা
              অচেনা একটা id দেখে নতুন Session খুলে ফেলবেন না, নতুন id বানিয়ে দিন। আর
              Cookie টা অবশ্যই HttpOnly, যাতে পাতায় ঢুকে পড়া কোনো Script id টা পড়তে না
              পারে। এর বিস্তারিত আগের লেসনে, Cookies এ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "many-servers",
      subHeader: { index: "007", title: "Sessions on Many Servers" },
      title: <SectionTitle>একাধিক Server, আর হঠাৎ Logout হয়ে যাওয়া পর্যটক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম দিনে Island Tours এর App একটাই, আর খাতাটা App এর নিজের Memory তে
                একটা Map হলেও চলে। ঈদের ছুটির আগে ভিড় বাড়ল, দল ঠিক করল App এর দুইটা কপি
                চালাবে, A আর B, আর সামনে বসা Caddy পালা করে Request ভাগ করে দেবে। পরের দিন
                থেকে অভিযোগ আসতে লাগল: বুকিং করতে গেলেই মাঝে মাঝে Login পাতায় ফেরত পাঠায়।
              </ContentParagraph>
              <ContentParagraph>
                কারণটা সোজা। Login টা গিয়েছিল A তে, তাই Session এর লাইনটা আছে A এর
                Memory তে। পরের Request টা Caddy পাঠাল B তে। B এর খাতায় এই id নেই, তাই 401।
                নিচের Lab এ নিজে ঘটিয়ে দেখুন, তারপর দুইটা সমাধানও চালিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SessionScaleLab /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["সমাধান", "কীভাবে", "লাভ", "দাম"],
          rows: [
            ["Sticky Session", "Load Balancer একজন ইউজারকে সবসময় একই App এ পাঠায়, একটা Cookie বা IP দেখে", "Code বদলাতে হয় না", "Deploy বা Crash এ ওই App এর সবাই Logout, ভার অসমান, CGNAT এর পেছনের হাজার মানুষ এক IP তে"],
            ["Shared Store", "সব App একই Redis থেকে Session পড়ে আর লেখে", "যেকোনো App যেকোনো Request সামলায়, Deploy এ কিছু হারায় না", "Redis একটা নতুন জিনিস, যা চালু রাখতে আর দেখাশোনা করতে হয়"],
            ["JWT", "খাতাই নেই, প্রতিটা App নিজে Token যাচাই করে", "কোনো Store লাগে না", "বাতিল করা কঠিন, যা একটু পরেই দেখবেন"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Island Tours কোনটা নিল, আর কেন",
          content: (
            <p>
              Shared Store, মানে Redis। প্রকল্পের পাতায় দেখেছেন, Redis আগে থেকেই Tour এর
              তালিকা Cache করার জন্য চলছিল, তাই নতুন কিছু বসাতে হয়নি। একই যন্ত্রের Redis
              থেকে একটা ছোট Key পড়তে এক মিলিসেকেন্ডের অনেক কম সময় লাগে, পর্যটক টেরও
              পান না। Module 05 এর Connection Pool এর কথা মনে আছে? App আর Redis এর মাঝেও
              প্রতি Request এ নতুন Connection খোলা হয় না, Pool থেকে নেওয়া হয়, তাই এই
              খরচটা আরও কম। আর একটা জিনিস মাথায় রাখুন: Redis বন্ধ হলে কেউই Login থাকতে
              পারবেন না। তাই Redis এখন Island Tours এর এমন একটা অংশ, যার উপর নজর রাখতে
              হয়। কীভাবে, সেটা Database আর Observability মডিউলে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "jwt-anatomy",
      subHeader: { index: "008", title: "JWT Anatomy and Claims" },
      title: <SectionTitle>JWT এর তিন অংশ, আর মাঝেরটায় কী লেখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার মেলার পাস। একটা JWT দেখতে একটা লম্বা, অর্থহীন অক্ষরের সারি, যার মাঝে
                দুইটা বিন্দু। নিচেরটা এই লেসনের Lab ৩ চালিয়ে বানানো একটা আসল Token, একটা
                ফেলে দেওয়া Secret দিয়ে সই করা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "lab-3-output.txt",
          code: `$ node 3-make-jwt.mjs
token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FwaS5pc2xhbmR0b3Vycy5leGFtcGxlIiwic3ViIjoidXNyXzQyIiwiYXVkIjoiaXNsYW5kdG91cnMtbW9iaWxlIiwiaWF0IjoxNzkzNDI4MjE0LCJleHAiOjE3OTM0MjkxMTQsImp0aSI6IjVjMGVmNTJmLTg3ZTUtNDA0Mi04Mzk3LWYzYjczMDIxYjEwMyIsInJvbGUiOiJjdXN0b21lciJ9.X1eYLYCc8NrA3V-iu8wNbLGwTVUl0J6lo8s5n-Qp_YY

part 1, header  : {"alg":"HS256","typ":"JWT"}
part 2, payload : {"iss":"https://api.islandtours.example","sub":"usr_42","aud":"islandtours-mobile","iat":1793428214,"exp":1793429114,"jti":"5c0ef52f-87e5-4042-8397-f3b73021b103","role":"customer"}
part 3, signature is 32 raw bytes
whole token is 321 characters`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <JwtAnatomyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তিনটা অংশ, তিনটা কাজ। প্রথম অংশ Header, বলে কোন নিয়মে সই হয়েছে:{" "}
                <code>alg</code> মানে Algorithm, এখানে HS256। দ্বিতীয় অংশ Payload, আসল
                বক্তব্য। এর ভেতরের প্রতিটা দাবিকে বলে Claim। তৃতীয় অংশ Signature, সিল।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম দুইটা অংশ লেখা base64url এ। এটা একটা Encoding, মানে Byte গুলোকে
                এমন অক্ষরে লেখার নিয়ম যা URL আর Header এ নিরাপদে যায়। এটা কোনো তালা নয়।
                যে কেউ, কোনো চাবি ছাড়াই, এক লাইনে খুলে পড়তে পারেন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "decode-locally.sh",
          code: `# TOKEN এ একটা JWT রাখুন, তারপর প্রথম দুই অংশ খুলুন
node -e 'const [h, p] = process.argv[1].split("."); console.log(Buffer.from(h, "base64url").toString()); console.log(Buffer.from(p, "base64url").toString())' "$TOKEN"
# {"alg":"HS256","typ":"JWT"}
# {"iss":"https://api.islandtours.example","sub":"usr_42","aud":"islandtours-mobile","iat":1793428470,"exp":1793429370,"jti":"c5e01e27-5f39-486b-9945-865bb2689c16","role":"customer"}`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Claim", "পুরো নাম", "মানে", "Island Tours এ"],
          rows: [
            [mono("iss"), "Issuer", "কে Token টা দিল", "https://api.islandtours.example"],
            [mono("sub"), "Subject", "Token টা কার সম্পর্কে, সাধারণত ইউজারের id", "usr_42"],
            [mono("aud"), "Audience", "কার জন্য বানানো, কে এটা মানবে", "islandtours-mobile"],
            [mono("exp"), "Expiration Time", "এর পরে আর চলবে না", "iat থেকে 900 সেকেন্ড পরে"],
            [mono("iat"), "Issued At", "কখন বানানো", "Login বা Refresh এর মুহূর্ত"],
            [mono("nbf"), "Not Before", "এর আগে চলবে না", "সাধারণত দেওয়া হয় না"],
            [mono("jti"), "JWT ID", "এই Token এর নিজের আলাদা id", "একটা UUID, বাতিলের তালিকায় কাজে লাগে"],
            [mono("role"), "নিজের বানানো Claim", "যা খুশি, তবে অল্প আর গোপন নয় এমন", "customer, শুধু Screen সাজানোর জন্য"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সময়ের Claim গুলো লেখা হয় একটা সংখ্যায়: ১৯৭০ সালের ১ জানুয়ারি থেকে কত
              সেকেন্ড পার হয়েছে, যাকে Unix Time বলে। মিলিসেকেন্ড নয়, সেকেন্ড। JavaScript
              এর <code>Date.now()</code> মিলিসেকেন্ড দেয়, তাই হাজার দিয়ে ভাগ করতে হয়। এই
              ভুলটা খুব সাধারণ, আর এতে Token এর মেয়াদ হয়ে যায় পঞ্চাশ হাজার বছর।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Payload এ গোপন কিছু রাখবেন না",
          content: (
            <p>
              যেহেতু যে কেউ Payload পড়তে পারেন, তাই এতে email, ফোন নম্বর, ঠিকানা,
              Password, ভেতরের কোনো Secret বা বুকিং এর টাকার হিসাব রাখবেন না। Token টা যায়
              প্রতিটা Request এ, থাকে Mobile এর Storage এ, কখনো কখনো ভুল করে Log এ। আর
              মনে রাখুন দৈর্ঘ্য: উপরের Token টা ৩২১ অক্ষর, যেখানে Session id মাত্র ৪৩।
              প্রতিটা Claim যোগ করলে প্রতিটা Request ভারী হয়। Payload Encrypt করার একটা
              আলাদা মান আছে, JWE, কিন্তু বেশিরভাগ জায়গায় দরকার পড়ে না। সহজ নিয়ম হলো
              গোপন কিছু Token এ না রাখা।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "signing",
      subHeader: { index: "009", title: "Signing Algorithms" },
      title: <SectionTitle>সিলটা কীভাবে বানানো হয়: HS256, RS256 আর ES256</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                HS256 এর পুরো নাম HMAC with SHA-256। কাজটা এরকম: প্রথম দুই অংশ, মাঝে
                বিন্দু সহ, আর Server এর গোপন Secret, এই দুইটা মিশিয়ে একটা ৩২ Byte এর ছাপ
                বানানো হয়। Lab এর Code এ এটা এক লাইন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "hs256-in-one-line.js",
          code: `const signature = createHmac("sha256", secret).update(signingInput).digest("base64url");`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই ছাপের দুইটা গুণ পুরো ব্যবস্থাটাকে নিরাপদ করে। প্রথমত, Payload এর একটা
                অক্ষর বদলালেই ছাপ পুরো বদলে যায়, কাছাকাছিও থাকে না। দ্বিতীয়ত, Secret না
                জানলে কোনো Payload এর সঠিক ছাপ বানানো যায় না। তাই Server যখন একটা Token
                পায়, নিজের Secret দিয়ে ছাপটা আবার বানায়। মিললে বোঝে Token টা তারই বানানো
                আর কেউ ছোঁয়নি।
              </ContentParagraph>
              <ContentParagraph>
                HS256 এ যে চাবি দিয়ে সই হয়, যাচাই ও হয় সেই একই চাবি দিয়ে। এর নাম
                Symmetric। একটা App হলে এটাই সবচেয়ে সহজ। কিন্তু Island Tours এ Token যাচাই
                করে দুইজন: Booking API, আর পরের লেসনগুলোতে আসা Live Seat Service। HS256
                হলে দুইজনকেই Secret এর কপি দিতে হবে, আর যে যাচাই করতে পারে সে বানাতেও
                পারে। Seat Service এর কোনো ছোট Bug দিয়ে Secret ফাঁস হলে, যে কেউ যেকোনো
                ইউজারের নামে Token বানিয়ে ফেলবেন।
              </ContentParagraph>
              <ContentParagraph>
                এই সমস্যার সমাধান Asymmetric সই: RS256 (RSA দিয়ে) বা ES256 (Elliptic Curve
                দিয়ে)। এখানে চাবি দুইটা, একটা জোড়া। Private Key দিয়ে সই হয়, আর সেটা থাকে
                শুধু Login এর দায়িত্বে থাকা অংশের কাছে। Public Key দিয়ে শুধু যাচাই হয়, আর
                সেটা খোলাখুলি প্রকাশ করা যায়। চাবির জোড়া কীভাবে কাজ করে তার ভেতরের গল্প
                লেসন ০৮ এর বিষয়, Certificate এর সাথে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SigningKeysSplit /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["", "HS256", "RS256", "ES256"],
          rows: [
            ["চাবি", "একটা Secret", "RSA জোড়া, সাধারণত 2048 Bit", "P-256 Curve এর জোড়া"],
            ["কে যাচাই করতে পারে", "যার কাছে Secret", "যার কাছে Public Key", "যার কাছে Public Key"],
            ["কে বানাতে পারে", "যার কাছে Secret, মানে যাচাইকারীরাও", "শুধু Private Key ওয়ালা", "শুধু Private Key ওয়ালা"],
            ["Signature এর আকার", "32 Byte", "256 Byte", "64 Byte"],
            ["কখন", "একটাই App সই আর যাচাই করে", "পুরনো ব্যবস্থার সাথে মেলাতে", "অনেকে যাচাই করবে, ছোট Token চাই"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Public Key প্রকাশ করার প্রচলিত জায়গা একটা নির্দিষ্ট URL, যেমন{" "}
                <code>https://api.islandtours.example/.well-known/jwks.json</code>। JWKS
                মানে JSON Web Key Set, চাবিগুলোর একটা তালিকা। প্রতিটা চাবির একটা নাম থাকে,{" "}
                <code>kid</code>, আর Token এর Header এ লেখা থাকে কোন kid দিয়ে সই হয়েছে।
                চাবি বদলানোর সময় কিছুদিন দুইটা চাবিই তালিকায় রাখা হয়: নতুনগুলো সই হয় নতুন
                চাবিতে, পুরনোগুলো মেয়াদ শেষ হওয়া পর্যন্ত পুরনো চাবিতে যাচাই হয়।
              </ContentParagraph>
              <ContentParagraph>
                আর HS256 এর Secret বা ES256 এর Private Key, দুইটারই নিয়ম এক: Environment
                Variable বা Secret Manager থেকে আসবে, Git এ কখনো নয়, আর না থাকলে App চালুই
                হবে না। Lab এর প্রতিটা Script এই নিয়ম মানে। Secret ছাড়া বা ছোট Secret দিয়ে
                চালালে যা হয়, নিজের যন্ত্রে চালানো ফলাফল:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "secret-guard.txt",
          code: `$ node 3-make-jwt.mjs
Error: JWT_SECRET is not set

$ JWT_SECRET=short node 4-verify-jwt.mjs
Error: JWT_SECRET must be at least 32 bytes

# ঠিক উপায়: একটা এলোমেলো Secret বানিয়ে Environment এ রাখুন, হাতে টাইপ করবেন না
$ export JWT_SECRET="$(openssl rand -base64 32)"`,
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "verify",
      subHeader: { index: "010", title: "Verifying a JWT" },
      title: <SectionTitle>যাচাই, ধাপে ধাপে, আর যে ফাঁদগুলোতে মানুষ পড়ে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                JWT এর নিরাপত্তা পুরোটা নির্ভর করে যাচাইয়ের উপর। একটা ধাপ বাদ পড়লেই পুরো
                ব্যবস্থা ভেঙে যায়। Server একটা Token পেলে এই ক্রমে পরীক্ষা করে, আর প্রথম
                ব্যর্থতাতেই থেমে গিয়ে 401 দেয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>১. গঠন ঠিক আছে তো।</strong> দুইটা বিন্দু, তিনটা অংশ, প্রথম
                  দুইটা খুললে সঠিক JSON।
                </ListItem>
                <ListItem>
                  <strong>২. alg ঠিক সেটাই, যা Server আগে থেকে ঠিক করে রেখেছে।</strong>{" "}
                  Token এর Header যা বলে তা দেখে Algorithm বাছবেন না। Server এর নিজের একটা
                  তালিকা থাকবে, Island Tours এর Mobile Token এর জন্য শুধু ES256। তালিকার
                  বাইরে কিছু এলে বাতিল।
                </ListItem>
                <ListItem>
                  <strong>৩. Signature আবার হিসাব করে মেলানো।</strong> নিজের চাবি দিয়ে।
                  তুলনাটা করতে হয় সমান সময়ে, Node এ <code>timingSafeEqual</code> দিয়ে,
                  যাতে কত দ্রুত না মিলল সেটা মেপে কেউ ছাপ আন্দাজ করতে না পারেন।
                </ListItem>
                <ListItem>
                  <strong>৪. সময়।</strong> exp পার হয়নি, nbf থাকলে সেটা পার হয়েছে। দুই
                  যন্ত্রের ঘড়ি একদম মেলে না, তাই অল্প একটু ছাড় রাখা হয়, সাধারণত ৩০ থেকে ৬০
                  সেকেন্ড।
                </ListItem>
                <ListItem>
                  <strong>৫. iss আর aud।</strong> Token টা কি আমাদের দেওয়া, আর আমার জন্যই
                  বানানো? Partner App এর জন্য বানানো একটা সঠিক সই করা Token ও Mobile API তে
                  চলবে না।
                </ListItem>
                <ListItem>
                  <strong>৬. তারপর নিজের নিয়ম।</strong> দরকার হলে বাতিলের তালিকা, ইউজার
                  এখনো সক্রিয় কি না, আর অবশ্যই Authorization।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Lab ৪ ঠিক এই যাচাইটা হাতে লিখেছে, তারপর ছয় রকম Token দিয়ে পরীক্ষা করেছে।
                নিজের যন্ত্রে চালানো ফলাফল:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "lab-4-output.txt",
          code: `$ node 4-verify-jwt.mjs
good      accepted, sub=usr_42 role=customer
tampered  rejected, signature does not match
none      rejected, alg "none" is not allowed
wrongKey  rejected, signature does not match
expired   rejected, expired
wrongAud  rejected, wrong audience`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <JwtVerifyLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার বাস্তবের ফাঁদগুলো, যেগুলোতে সত্যিকারের কোম্পানি পড়েছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>decode আর verify গুলিয়ে ফেলা।</strong> প্রায় সব JWT Library তে
                  দুইটা Function থাকে। decode শুধু Payload খুলে দেয়, কিছু যাচাই করে না।
                  কেউ তাড়াহুড়োয় decode লিখলে যেকোনো জাল Token পাস। উপরের Lab এর শেষ বোতামটা
                  ঠিক এই ভুল।
                </ListItem>
                <ListItem>
                  <strong>alg none।</strong> JWT এর মানে একটা none Algorithm আছে, মানে সই
                  ছাড়া। পুরনো কিছু Library Header এ none দেখলে Signature না দেখেই মেনে
                  নিত। Algorithm এর নির্দিষ্ট তালিকা রাখলে এই দরজা বন্ধ।
                </ListItem>
                <ListItem>
                  <strong>Algorithm Confusion।</strong> Server RS256 ব্যবহার করে, তার
                  Public Key সবার জানা। আক্রমণকারী একটা HS256 Token বানালেন, আর HMAC এর
                  Secret হিসেবে ব্যবহার করলেন সেই Public Key টাই। যে Library Header দেখে
                  Algorithm বাছে, সে Public Key কে HMAC Secret ধরে যাচাই করে, আর মিলে যায়।
                  প্রতিরোধ আবারও সেই একই: Algorithm Server ঠিক করবে, Token নয়।
                </ListItem>
                <ListItem>
                  <strong>aud না দেখা।</strong> একই Issuer অনেক App এর জন্য Token দিলে,
                  একটা App এর Token আরেকটাতে চলে যায়।
                </ListItem>
                <ListItem>
                  <strong>exp নেই, বা বছরের পর বছর।</strong> তখন একটা চুরি যাওয়া Token
                  প্রায় একটা Password এর মতো।
                </ListItem>
                <ListItem>
                  <strong>kid দিয়ে যা খুশি খোঁজা।</strong> Header এর kid বাইরে থেকে আসা
                  লেখা। একে File এর Path বা SQL এর অংশ বানালে নতুন আক্রমণের দরজা খোলে। kid
                  দিয়ে শুধু নিজের চাবির তালিকা থেকে খুঁজুন, না পেলে বাতিল।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                ঘড়ির ছাড়ের ব্যাপারটা নিজের চোখে দেখার মতো। Lab ৫ এর Server এ Token এর আয়ু
                মাত্র ৫ সেকেন্ড রেখে চালানো হলো। ১০ সেকেন্ড পরেও Token চলল, কারণ ৩০ সেকেন্ডের
                ছাড় আছে। ৩৭ সেকেন্ডে আর চলল না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "clock-skew.txt",
          code: `$ LAB_PORT=47662 ACCESS_TTL_SECONDS=5 node 5-jwt-server.mjs plain
# অন্য Terminal এ Login করে TOKEN রাখা হলো, তারপর:
after 10s:
{"userId":"usr_42","role":"customer"}
after 37s:
{"error":"expired"}`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Production এ যাচাইয়ের Code নিজে লিখবেন না, একটা প্রমাণিত Library ব্যবহার
              করবেন। Node এ বহুল ব্যবহৃত একটা হলো <code>jose</code>। নিচের চেহারাটা তার
              বর্তমান নথি মিলিয়ে লেখা, কিন্তু এই লেসনে Package Install করে চালানো হয়নি।
              খেয়াল করুন, Lab ৪ এর প্রতিটা ধাপ এখানে একটা করে Option হয়ে বসে আছে, আর
              প্রতিটা মান আসছে Environment থেকে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "verify-with-jose.mjs",
          code: `// চেহারা দেখানোর জন্য, npm install jose করে নিজের Project এ ব্যবহার করবেন
import { createRemoteJWKSet, jwtVerify } from "jose";

const { JWT_ISSUER, JWT_AUDIENCE, JWKS_URL } = process.env;
if (!JWT_ISSUER || !JWT_AUDIENCE || !JWKS_URL) {
  throw new Error("JWT_ISSUER, JWT_AUDIENCE and JWKS_URL must be set");
}
const jwks = createRemoteJWKSet(new URL(JWKS_URL)); // Public Key গুলো এনে Cache করে

export async function verifyAccessToken(token) {
  const { payload } = await jwtVerify(token, jwks, {
    algorithms: ["ES256"],   // ধাপ ২: তালিকার বাইরে কিছু চলবে না
    issuer: JWT_ISSUER,      // ধাপ ৫
    audience: JWT_AUDIENCE,  // ধাপ ৫
    clockTolerance: 30,      // ধাপ ৪ এর ছাড়, সেকেন্ডে
  });
  return payload;            // ব্যর্থ হলে jwtVerify নিজেই Error ছোঁড়ে, তখন 401
}`,
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "where-to-keep",
      subHeader: { index: "011", title: "Where to Keep the Token" },
      title: <SectionTitle>প্রমাণটা রাখবেন কোথায়, আর পাঠাবেন কীভাবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রমাণটা যেটাই হোক, Session id বা JWT, Client কে সেটা কোথাও রাখতে হয়, আর
                প্রতিটা Request এ পাঠাতে হয়। পাঠানোর রাস্তা দুইটা। Cookie তে রাখলে Browser
                নিজে থেকে পাঠায়। আর JavaScript বা Mobile App নিজের হাতে একটা Header যোগ করতে
                পারে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "http",
          filename: "bearer.http",
          code: `GET /api/me HTTP/1.1
Host: api.islandtours.example
Authorization: Bearer eyJhbGciOiJFUzI1NiIs...`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Bearer শব্দটার মানে বাহক। যার হাতে Token, Server তাকেই মালিক মানে, ঠিক
                নগদ টাকার মতো। টাকা কার পকেট থেকে বের হলো, দোকানদার জিজ্ঞেস করেন না। তাই
                Bearer Token চুরি যাওয়া মানে সরাসরি পরিচয় চুরি, যতক্ষণ না মেয়াদ শেষ হয়।
                এই কারণেই প্রশ্নটা জরুরি: কোথায় রাখলে চুরি করা সবচেয়ে কঠিন।
              </ContentParagraph>
              <ContentParagraph>
                Browser এ সবচেয়ে বড় বিপদের নাম XSS, Cross-Site Scripting: কোনো ফাঁক দিয়ে
                অন্যের লেখা JavaScript আপনার পাতায় চলে গেল। আগের লেসনে দেখেছেন, সেই Script
                HttpOnly Cookie পড়তে পারে না। কিন্তু localStorage বা সাধারণ JavaScript এর
                Variable সে সহজেই পড়ে, আর Token টা নিজের Server এ পাঠিয়ে দেয়। তারপর
                আক্রমণকারী নিজের যন্ত্র থেকে, যতক্ষণ খুশি, আপনার নামে কাজ করেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কোথায়", "JavaScript পড়তে পারে?", "নিজে থেকে যায়?", "XSS হলে", "খেয়াল রাখুন"],
          rows: [
            ["HttpOnly Cookie", "না", "হ্যাঁ, প্রতিটা Request এ", "Token চুরি যায় না, তবে পাতা খোলা থাকতে Script আপনার নামে Request পাঠাতে পারে", "CSRF, তাই SameSite আর Origin পরীক্ষা"],
            ["localStorage", "হ্যাঁ", "না, Code কে Header যোগ করতে হয়", "Token চুরি, আক্রমণকারী পরে নিজের যন্ত্র থেকে ব্যবহার করেন", "Reload বা Browser বন্ধের পরেও থাকে"],
            ["sessionStorage", "হ্যাঁ", "না", "একই রকম চুরি", "Tab বন্ধ হলে মুছে যায়"],
            ["JavaScript এর Memory", "হ্যাঁ, শুধু সেই পাতার Code", "না", "চুরি করা একটু কঠিন, কিন্তু অসম্ভব নয়", "Reload এ হারায়, তাই সাথে Refresh এর ব্যবস্থা লাগে"],
            ["Mobile এর Secure Storage", "অন্য App পারে না", "না, App Header যোগ করে", "Browser এর XSS এখানে খাটে না", "Android Keystore, iOS Keychain, কখনো সাধারণ ফাইলে নয়"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সুপারিশটা তাহলে এরকম দাঁড়ায়। Website আর তার API যদি একই Site এ থাকে, যেমন{" "}
                <code>islandtours.example</code>, তাহলে প্রমাণ থাকুক HttpOnly, Secure,
                SameSite Cookie তে। ভেতরে Session id হোক বা JWT, Browser এর JavaScript
                সেটা ছুঁতেই পারবে না। Mobile App হলে Secure Storage আর Bearer Header।
              </ContentParagraph>
              <ContentParagraph>
                আর যদি Frontend আর API একদম আলাদা Domain এ থাকে, তখন একটা প্রচলিত নকশা আছে,
                নাম BFF, Backend for Frontend। Browser শুধু নিজের Domain এর একটা ছোট Server
                এর সাথে Cookie দিয়ে কথা বলে, আর আসল Token গুলো থাকে সেই Server এর কাছে।
                Browser এ কোনো Token ই পৌঁছায় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "আসল Token কোনো Website এ Paste করবেন না",
          content: (
            <p>
              JWT খুলে দেখার অনেক Website আছে। শেখার সময় Lab এর ফেলে দেওয়া Token দিয়ে
              চেষ্টা করতে পারেন। কিন্তু Production এর কোনো Token, নিজের বা সহকর্মীর, কোনো
              Website এ Paste করবেন না, Chat এ পাঠাবেন না, Ticket এ লিখবেন না। সেটা একটা
              চালু চাবি। খুলে দেখতে হলে আগের সেকশনের এক লাইনের Node কমান্ডটা ব্যবহার করুন,
              যা আপনার যন্ত্রের বাইরে কিছু পাঠায় না।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "revocation",
      subHeader: { index: "012", title: "Revocation and Refresh Tokens" },
      title: <SectionTitle>JWT বাতিল করা যায় না, তাহলে উপায় কী</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার সেই সমস্যাটা, যার কথা সেকশন ০০৫ এ বলে রেখেছিলাম। একটা JWT এর কোনো
                খাতা নেই। Server সই দেখে মেনে নেয়, কাউকে জিজ্ঞেস করে না। তাহলে পর্যটক
                Logout করলে Server কী মুছবে? কিছুই না। Lab ৫ এর Server এ নিজের যন্ত্রে
                চালানো ফলাফল দেখুন। Logout সফল বলল, কিন্তু Token টা তার পরেও চলছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "logout-does-not-kill.txt",
          code: `# Server: node 5-jwt-server.mjs plain
$ curl -s -H "Authorization: Bearer $TOKEN" $B/api/me
{"userId":"usr_42","role":"customer"}
$ curl -s -X POST -H "Authorization: Bearer $TOKEN" $B/api/auth/logout
{"ok":true}
$ curl -s -i -H "Authorization: Bearer $TOKEN" $B/api/me
HTTP/1.1 200 OK
{"userId":"usr_42","role":"customer"}

# Server: node 5-jwt-server.mjs denylist
$ curl -s -X POST -H "Authorization: Bearer $TOKEN" $B/api/auth/logout
{"ok":true}
$ curl -s -i -H "Authorization: Bearer $TOKEN" $B/api/me
HTTP/1.1 401 Unauthorized
{"error":"revoked"}`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় অংশে Server একটা বাতিলের তালিকা রেখেছে, যার নাম Denylist: Logout
                করা Token এর jti। কাজ করল, কিন্তু খেয়াল করুন কী হলো। এখন প্রতিটা Request এ
                Server একটা তালিকা দেখছে। মানে আপনি একটা খাতা ফেরত এনেছেন, আর JWT এর খাতা
                না লাগার সুবিধাটা আর নেই। তালিকাটা ছোট হলে আর মেয়াদ শেষে Token সরিয়ে দিলে
                এটা চলে, কিন্তু এটা মূল সমাধান নয়।
              </ContentParagraph>
              <ContentParagraph>
                মূল সমাধানটা দুইটা Token এর জোড়া। <strong>Access Token</strong> একটা
                ছোট আয়ুর JWT, Island Tours এ ১৫ মিনিট। প্রতিটা Request এ এটাই যায়, Server
                শুধু সই দেখে। <strong>Refresh Token</strong> একটা লম্বা আয়ুর এলোমেলো
                Opaque Token, ৩০ দিন পর্যন্ত, যা যায় শুধু একটা জায়গায়:{" "}
                <code>POST /api/auth/refresh</code>। আর এর হিসাব Server এর খাতায় থাকে, ঠিক
                Session এর মতো, তাই এটা সাথে সাথে বাতিল করা যায়।
              </ContentParagraph>
              <ContentParagraph>
                ফলটা হলো দুই দুনিয়ার ভালোটা। প্রতিটা সাধারণ Request খাতা ছাড়াই যাচাই হয়।
                আর Logout করলে Server Refresh Token বাতিল করে দেয়। হাতে থাকা Access Token টা
                তখনো কিছুক্ষণ চলে, কিন্তু বড়জোর ১৫ মিনিট, তারপর নতুন আর পাওয়া যায় না।
                বাতিল হতে কতটা দেরি মেনে নেবেন, সেটাই Access Token এর আয়ু।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RefreshTimelineDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখন Refresh Token টাই সবচেয়ে দামি জিনিস, ৩০ দিনের চাবি। তাই এর জন্য একটা
                বাড়তি নিয়ম: <strong>Rotation</strong>। প্রতিবার ব্যবহারে Server একটা নতুন
                Refresh Token দেয় আর পুরনোটাকে ব্যবহৃত বলে দাগ দেয়। একই Login থেকে জন্মানো
                সব Token মিলে একটা পরিবার। এখন কেউ যদি একটা ব্যবহৃত Token আবার দেখায়, তার
                একটাই মানে হতে পারে: কোথাও একটা কপি আছে। Server তখন পুরো পরিবার বাতিল করে
                দেয়। এর নাম <strong>Reuse Detection</strong>।
              </ContentParagraph>
              <ContentParagraph>
                এটা শুধু ভালো অভ্যাস নয়। OAuth এর নিরাপত্তার বর্তমান মান, RFC 9700 (২০২৫ এর
                জানুয়ারিতে প্রকাশিত), বলে Mobile App বা Browser এর মতো Public Client এর
                Refresh Token হয় Rotation করতে হবে, নয়তো সেই নির্দিষ্ট ডিভাইসের সাথে বাঁধা
                থাকতে হবে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RefreshRotationLab /> },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "lab-6-output.txt",
          code: `$ node 6-refresh-rotation.mjs app-first
login  usr_42, refresh zmXFQE... stored as a hash, 1 row

app    zmXFQE...  ok, new access token and new refresh O02XIE...
thief  zmXFQE...  REUSE DETECTED, whole family 8eeff8cf revoked
app    O02XIE...  rejected, family 8eeff8cf is revoked

$ node 6-refresh-rotation.mjs thief-first
login  usr_42, refresh m45B6e... stored as a hash, 1 row

thief  m45B6e...  ok, new access token and new refresh wuDKcT...
app    m45B6e...  REUSE DETECTED, whole family 62580901 revoked
thief  wuDKcT...  rejected, family 62580901 is revoked`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "বাস্তবের একটা ঝামেলা: হারিয়ে যাওয়া উত্তর",
          content: (
            <p>
              পর্যটক ফেরিতে, Network দুর্বল। App Refresh Token R1 পাঠাল, Server R2 বানিয়ে
              উত্তর দিল, কিন্তু উত্তরটা পথে হারাল, Module 05 এর সেই পরিচিত ঘটনা। App এর হাতে
              এখনো শুধু R1, তাই সে আবার R1 পাঠাল। Server এর চোখে এটা Reuse, আর পর্যটক বিনা
              দোষে Logout। তাই অনেক ব্যবস্থা একটা ছোট Grace Window রাখে, যেমন কয়েক সেকেন্ড,
              যার ভেতরে ঠিক আগের Token টা আবার এলে Reuse ধরা হয় না। এই সংখ্যাটাও Configuration
              এ রাখুন, Code এ নয়। আর Refresh Token খাতায় রাখুন Hash করে, Session id এর মতোই,
              যাতে খাতা চুরি হলেও চালু Token পাওয়া না যায়।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "tradeoffs",
      subHeader: { index: "013", title: "Trade-offs" },
      title: <SectionTitle>কোনটা কখন: সত্যিকারের Trade-off</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার দুইটাকে পাশাপাশি রাখি। কোনোটাই সবসময় ভালো নয়, প্রতিটা সারিতে কোনো একটা
              জিতছে আর কিছু একটা দিচ্ছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["প্রশ্ন", "Server Session", "JWT"],
          rows: [
            ["Client এর হাতে কী", "৪৩ অক্ষরের একটা অর্থহীন id", "কয়েকশো অক্ষরের সই করা দাবি, যে কেউ পড়তে পারে"],
            ["প্রতি Request এ Server এর কাজ", "Store এ একটা Lookup, Redis এ এক মিলিসেকেন্ডের কম", "সই যাচাই, কোনো Lookup নেই"],
            ["বাতিল করা", "সাথে সাথে, একটা লাইন মুছলেই", "মেয়াদ পর্যন্ত চলে, অথবা Denylist বা Refresh এর ব্যবস্থা লাগে"],
            ["অনেক App Server", "Shared Store লাগে", "কিছু লাগে না"],
            ["অনেক আলাদা Service যাচাই করবে", "সবাইকে Store এ যেতে হয়", "Public Key দিয়ে প্রত্যেকে নিজে যাচাই করে"],
            ["Mobile App, অন্য Domain", "চলে, তবে Cookie এর সুবিধা কম", "সহজ, Bearer Header"],
            ["তথ্য বদলালে", "Store থেকে সবসময় বর্তমান তথ্য", "Token এর Claim মেয়াদ পর্যন্ত পুরনো থাকতে পারে"],
            ["চাবির দেখাশোনা", "শুধু Store", "Secret বা চাবির জোড়া, বদলানোর পরিকল্পনা সহ"],
            ["সবচেয়ে চালু ভুল", "Login এ id না বদলানো, একাধিক Server এ Memory Store", "decode কে verify ভাবা, লম্বা মেয়াদ, alg না বাঁধা"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুইটা চালু কথা প্রায়ই শুনবেন, আর দুইটাই আধা সত্য। প্রথমটা: JWT Stateless,
                তাই Scale করে, Session করে না। আসলে একটা Redis থেকে ছোট একটা Key পড়া এত
                সস্তা যে Island Tours এর মতো সাইটে এটা কখনো Bottleneck হয় না। আর Refresh
                Token এর খাতা রাখলে JWT ও আর পুরোপুরি Stateless থাকে না। JWT এর আসল জোর
                অন্য জায়গায়: যখন যাচাইকারীরা একটা Store ভাগ করতে পারে না বা করা উচিত নয়,
                যেমন আলাদা আলাদা Service, অন্য কোম্পানির Server, বা Google এর মতো বাইরের
                কেউ।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয়টা: JWT মানেই বেশি নিরাপদ। নিরাপত্তা আসে সঠিক যাচাই, ছোট মেয়াদ আর
                সঠিক জায়গায় রাখা থেকে। ভুল করে বানানো JWT ব্যবস্থা একটা সাধারণ Session এর
                চেয়ে অনেক বেশি বিপজ্জনক, কারণ সেখানে ভুলটা চোখে পড়ে না, আর বাতিলও করা যায়
                না।
              </ContentParagraph>
              <ContentParagraph>
                এখন আপনার নিজের পরিস্থিতিতে কোনটা, নিচের Lab এ বেছে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ProofChoiceLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "OAuth 2.0 আর OpenID Connect, শুধু নামটা চিনে রাখুন",
          content: (
            <p>
              Sign in with Google বোতামের পেছনে এই দুইটা মান। OAuth 2.0 মূলত অনুমতি
              ধার দেওয়ার নিয়ম: একটা App কে আপনার হয়ে অন্য কোনো Service এ কিছু করার অনুমতি,
              Password না দিয়েই। OpenID Connect তার উপর Login যোগ করে: Google আপনার সাইটকে
              একটা ID Token দেয়, যা একটা JWT, Google এর Private Key দিয়ে সই করা। আপনার
              Server সেটা Google এর প্রকাশ করা Public Key দিয়ে যাচাই করে, এই লেসনের ঠিক
              একই ধাপে, তারপর সাধারণত নিজের একটা Session বা নিজের Token বানায়। পুরো
              প্রক্রিয়াটা একটা আলাদা বড় বিষয়, এখানে শুধু এটুকু জানলেই চলবে যে ভেতরে ঠিক
              এই লেসনের জিনিসগুলোই আছে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "see-it",
      subHeader: { index: "014", title: "Hands-on" },
      title: <SectionTitle>নিজের চোখে দেখুন: Browser আর Terminal এ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনি প্রতিদিন যে সাইটগুলোতে Login করে থাকেন, সেগুলো কোন পথ নিয়েছে, তা
                Browser এর DevTools এ মিনিট খানেকে দেখা যায়। নিচের কাজগুলো শুধু দেখার জন্য,
                কোনো মান কোথাও কপি করবেন না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Cookie দেখুন।</strong> যে সাইটে Login করা আছেন সেটা খুলে F12,
                  তারপর Application প্যানেলে Cookies। একটা নাম খুঁজুন যাতে session, sid
                  বা auth আছে। তার HttpOnly আর Secure কলামে টিক আছে কি না দেখুন। মানটা যদি
                  ছোট এলোমেলো লেখা হয়, সেটা সম্ভবত Session id। যদি eyJ দিয়ে শুরু হয় আর মাঝে
                  দুইটা বিন্দু থাকে, সেটা একটা JWT।
                </ListItem>
                <ListItem>
                  <strong>Request দেখুন।</strong> Network প্যানেলে যেকোনো API Request এ
                  ক্লিক করে Request Headers। হয় Cookie Header এ প্রমাণটা যাচ্ছে, নয়তো
                  Authorization Header এ Bearer সহ।
                </ListItem>
                <ListItem>
                  <strong>Logout এর পরে আবার দেখুন।</strong> Cookie টা মুছে গেল কি না, আর
                  Logout এর Response এ কোনো Set-Cookie আছে কি না, Max-Age=0 সহ।
                </ListItem>
                <ListItem>
                  <strong>Terminal এ curl এর Cookie Jar।</strong> Lab ১ এর Server চালিয়ে{" "}
                  <code>-c jar.txt</code> দিয়ে Login করুন, তারপর <code>cat jar.txt</code>।
                  curl যে Cookie মনে রাখল তা একটা সাধারণ লেখার ফাইল, আর HttpOnly Cookie এর
                  লাইনের শুরুতে একটা চিহ্ন বসায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "cookie-jar.txt",
          code: `$ curl -s -i -c jar.txt -X POST http://127.0.0.1:47661/api/auth/login
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: session=hcxEFANEWLVqDT03_nxAR8lENp0O4CjdL75IzD4bGQ8; Path=/; HttpOnly; SameSite=Lax; Max-Age=20

{"ok":true}

$ cat jar.txt
# Netscape HTTP Cookie File
# https://curl.se/docs/http-cookies.html
# This file was generated by libcurl! Edit at your own risk.

#HttpOnly_127.0.0.1	FALSE	/	FALSE	1793428165	session	hcxEFANEWLVqDT03_nxAR8lENp0O4CjdL75IzD4bGQ8`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Lab এর Cookie এর নাম কেন শুধু session",
          content: (
            <p>
              Island Tours এর আসল Cookie এর নাম <code>__Host-session</code>, আর তাতে Secure
              আছে। আগের লেসনে দেখেছেন, <code>__Host-</code> দিয়ে শুরু হওয়া Cookie Browser
              শুধু তখনই নেয় যখন সেটা Secure, Path=/ আর কোনো Domain ছাড়া, আর Secure Cookie এর
              জন্য HTTPS লাগে। Lab চলছে সাধারণ HTTP তে, নিজের যন্ত্রে, তাই সহজ রাখতে নাম শুধু{" "}
              <code>session</code> আর Secure বাদ। Production এ এই দুইটা ছাড় কখনো দেবেন না।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours: দুই রকম ইউজার, দুই রকম প্রমাণ</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours একটাই প্রমাণ সবার জন্য বেছে নেয়নি। Website আর Mobile App এর
                প্রয়োজন আলাদা, তাই দুইটার জন্য দুইটা পথ, আর দুইটাই একই Login থেকে শুরু। দলের
                নেওয়া সিদ্ধান্তগুলো এক এক করে দেখি।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Website এ Server Session।</strong> Cookie{" "}
                  <code>__Host-session</code>, HttpOnly, Secure, SameSite=Lax, Max-Age ১৪
                  দিন। খাতা Redis এ, Key হিসেবে id এর SHA-256 Hash। Idle Timeout ১৪ দিন,
                  Absolute Timeout ৩০ দিন। Website আর API একই Site এ, তাই Cookie ই সবচেয়ে
                  সহজ আর নিরাপদ।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা Login এ নতুন id।</strong> Admin Panel এ ঢোকার আগে আবার
                  Password চাওয়া হয়, তখনো নতুন id। Admin Session এর Idle Timeout মাত্র ৩০
                  মিনিট।
                </ListItem>
                <ListItem>
                  <strong>Mobile App এ JWT আর Refresh Token।</strong> Access Token ES256 এ সই
                  করা, iss <code>https://api.islandtours.example</code>, aud{" "}
                  <code>islandtours-mobile</code>, আয়ু ১৫ মিনিট। Refresh Token এলোমেলো
                  Opaque, ৩০ দিন, প্রতিবার Rotation, PostgreSQL এর একটা টেবিলে Hash আর পরিবারের
                  id সহ রাখা। ফোনে এটা থাকে Android Keystore বা iOS Keychain এ।
                </ListItem>
                <ListItem>
                  <strong>Seat Service শুধু যাচাই করে।</strong> পরের লেসনগুলোর Live Seat
                  Service একই Access Token মানে, Public Key এনে নিজে যাচাই করে। সে কখনো Token
                  বানাতে পারে না, কারণ Private Key আছে শুধু API এর Auth অংশে।
                </ListItem>
                <ListItem>
                  <strong>চাবি Environment থেকে।</strong> Private Key VPS এ একটা Secret ফাইল
                  থেকে পড়া হয়, যার পথ আসে Environment Variable এ, Git এ কখনো নয়। চাবি বদলানোর
                  সময় JWKS এ দুইটা kid কিছুদিন পাশাপাশি থাকে।
                </ListItem>
                <ListItem>
                  <strong>Authorization সবসময় Database থেকে।</strong> Token এর role Claim
                  শুধু App এর Screen সাজানোর জন্য, যেমন Admin বোতাম দেখানো। কে কোন বুকিং
                  বদলাতে পারবেন, বা কে Admin, সেই সিদ্ধান্ত প্রতিটা Request এ PostgreSQL দেখে
                  নেওয়া হয়।
                </ListItem>
                <ListItem>
                  <strong>সব ডিভাইস থেকে বের করার বোতাম।</strong> এটা চাপলে, বা Password
                  বদলালে, ইউজারের সব Redis Session মুছে যায় আর সব Refresh Token পরিবার বাতিল
                  হয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                গত শীতে একজন পর্যটক কক্সবাজারে ফোন হারিয়ে Support এ ফোন করলেন। Support দল
                তাঁর হয়ে সব ডিভাইস থেকে বের করার বোতাম চাপল। Website এর Session গুলো সাথে
                সাথে শেষ। হারানো ফোনের App এর হাতে তখনো একটা Access Token ছিল, সেটা পরের ১৫
                মিনিটের মধ্যে মরে গেল, আর তার Refresh Token আর কোনো নতুন Token আনতে পারল না।
                পুরো ঘটনায় কারো কোনো Code লিখতে হয়নি। এই লেসনের প্রতিটা সিদ্ধান্ত ঠিক এই
                রকম একটা দিনের জন্যই।
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
      title: <SectionTitle>Login থেকে বুকিং, তারপর Logout</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পর্যটক ফোনের Browser এ Island Tours এর Website খুলে Login করলেন, একটা বুকিং
              করলেন, তারপর Logout। আগের লেসনগুলোর Connection টা তো আছেই, 192.168.1.20:51514
              থেকে 103.94.135.2:443। এবার তার ভেতরে প্রমাণটা কীভাবে চলাফেরা করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "Login এর Request যায়",
              description:
                "Browser POST /api/auth/login পাঠাল, Body তে email আর Password। Request টা HTTPS এর ভেতরে Encrypt হয়ে 103.94.135.2:443 এ পৌঁছাল। Caddy সেটা খুলে 127.0.0.1:3000 এর App কে দিল।",
            },
            {
              title: "App পরিচয় যাচাই করে",
              description:
                "App PostgreSQL এর users টেবিলে email দিয়ে ইউজার খুঁজল, পেল usr_42। টাইপ করা Password এর Hash বানিয়ে জমা রাখা Hash এর সাথে মেলাল। মিলল। এটুকু হলো Authentication।",
            },
            {
              title: "পুরনো id বাতিল, নতুন id তৈরি",
              description:
                "Request এ আগের কোনো Session Cookie থাকলে App সেই লাইনটা Redis থেকে মুছল। তারপর randomBytes(32) দিয়ে নতুন একটা ৪৩ অক্ষরের id বানাল। এটাই Session Fixation এর প্রতিরোধ।",
            },
            {
              title: "খাতায় লাইন লেখা",
              description:
                "Redis এ id এর Hash কে Key করে লেখা হলো userId usr_42 আর createdAt, TTL 1209600 সেকেন্ড। user_sessions:usr_42 তালিকাতেও id টা যোগ হলো, যাতে পরে সব ডিভাইস থেকে বের করা যায়।",
            },
            {
              title: "Cookie ফেরত যায়",
              description:
                "App উত্তর দিল 204, সাথে Set-Cookie: __Host-session=... ; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=1209600। Browser Cookie টা জমা রাখল। পাতার JavaScript এটা কখনো পড়তে পারবে না।",
            },
            {
              title: "বুকিং এর Request, প্রমাণ সহ",
              description:
                "পর্যটক দুইটা আসন বেছে বুক করলেন। Browser POST /api/bookings পাঠাল, আর নিজে থেকেই Cookie Header এ id টা জুড়ে দিল। App Redis এ খুঁজে পেল usr_42, আসন খালি কি না দেখল, বুকিং লিখল, আর উত্তর দিল 201 সাথে Location: /api/bookings/bk_7Q2M9X।",
            },
            {
              title: "বুকিং দেখা, নিজের বলেই",
              description:
                "GET /api/bookings/bk_7Q2M9X এলো। App আগে Session থেকে জানল এটা usr_42, তারপর দেখল বুকিংটার userId ও usr_42। দুইটা পরীক্ষাই পাস, তাই 200। অন্য কেউ চাইলে 404 পেতেন। এটুকু হলো Authorization।",
            },
            {
              title: "Logout, আর খাতা থেকে মোছা",
              description:
                "পর্যটক Logout চাপলেন। App Redis থেকে লাইনটা মুছল আর Set-Cookie এ Max-Age=0 পাঠাল। এই মুহূর্ত থেকে সেই id এর কোনো কপি, কারো হাতে থাকলেও, অচল। পরের Request এ 401।",
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
                <strong>নিচের Lab টা আগে করুন</strong>, ছয়টা পরীক্ষায় Session আর JWT দুইটাই
                কোনো Library ছাড়া নিজে বানাবেন, ভাঙবেন আর বাতিল করবেন। এর কোনো ভিডিও
                বিকল্প নেই।
              </ListItem>
              <ListItem>
                <strong>OWASP Session Management Cheat Sheet</strong>, Session id এর দৈর্ঘ্য,
                Cookie এর Attribute, Timeout আর Fixation এর প্রতিরোধ, এক পাতায়।{" "}
                {link(
                  "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html",
                  "cheatsheetseries.owasp.org",
                )}
              </ListItem>
              <ListItem>
                <strong>OWASP Password Storage Cheat Sheet</strong>, argon2id আর bcrypt এর
                বর্তমান সুপারিশ, কোন Setting কেন।{" "}
                {link(
                  "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html",
                  "cheatsheetseries.owasp.org",
                )}
              </ListItem>
              <ListItem>
                <strong>RFC 7519</strong>, JWT এর মূল নিয়ম, প্রতিটা Claim এর সংজ্ঞা।{" "}
                {link("https://www.rfc-editor.org/rfc/rfc7519", "rfc-editor.org/rfc/rfc7519")}
              </ListItem>
              <ListItem>
                <strong>RFC 8725</strong>, JWT ব্যবহারের ভালো অভ্যাস। alg none, Algorithm
                Confusion আর aud এর ফাঁদগুলো এখানে নিয়ম হিসেবে লেখা।{" "}
                {link("https://www.rfc-editor.org/rfc/rfc8725", "rfc-editor.org/rfc/rfc8725")}
              </ListItem>
              <ListItem>
                <strong>RFC 9700</strong>, OAuth 2.0 এর নিরাপত্তার বর্তমান মান, Refresh Token
                Rotation আর Reuse Detection এর অংশটা পড়ুন।{" "}
                {link("https://www.rfc-editor.org/rfc/rfc9700", "rfc-editor.org/rfc/rfc9700")}
              </ListItem>
              <ListItem>
                <strong>jose Library এর নথি</strong>, Node এ JWT যাচাই আর JWKS এর জন্য।{" "}
                {link("https://github.com/panva/jose", "github.com/panva/jose")}
              </ListItem>
              <ListItem>
                <strong>Node.js এর crypto নথি</strong>, randomBytes, createHmac আর
                timingSafeEqual এর সঠিক আচরণ।{" "}
                {link("https://nodejs.org/api/crypto.html", "nodejs.org/api/crypto.html")}
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
                  HTTP কিছু মনে রাখে না। তাই Password যায় একবার, Login এ, আর তারপর প্রতিটা
                  Request বহন করে একটা প্রমাণ।
                </ListItem>
                <ListItem>
                  Authentication বলে আপনি কে, Authorization বলে আপনি কী পারেন। Session বা
                  JWT শুধু প্রথমটা দেয়, দ্বিতীয়টা প্রতিটা Request এ নিজের Code এ, Database
                  দেখে।
                </ListItem>
                <ListItem>
                  Server Session হলো ক্লোকরুমের টোকেন: ৩২ Byte এর এলোমেলো id Cookie তে, খাতা
                  Redis এ TTL সহ। একটা লাইন মুছলেই সাথে সাথে বাতিল।
                </ListItem>
                <ListItem>
                  প্রতিটা Login এ নতুন id, নইলে Session Fixation। একাধিক Server হলে খাতা
                  Shared Store এ, নইলে পর্যটক হঠাৎ Logout।
                </ListItem>
                <ListItem>
                  JWT হলো সিল মারা পাস: Header, Payload আর Signature। প্রথম দুইটা যে কেউ পড়তে
                  পারে, তাই গোপন কিছু নয়। সিল বানাতে Secret বা Private Key লাগে।
                </ListItem>
                <ListItem>
                  যাচাই মানে alg নির্দিষ্ট, Signature মেলানো, exp, iss আর aud। decode কখনো
                  verify নয়।
                </ListItem>
                <ListItem>
                  Browser এ প্রমাণ রাখুন HttpOnly Cookie তে, Mobile এ Secure Storage এ। Bearer
                  মানে যার হাতে সে-ই মালিক।
                </ListItem>
                <ListItem>
                  JWT নিজে বাতিল হয় না। তাই ছোট Access Token আর Rotation করা Refresh Token, যার
                  খাতা Server এ। Reuse ধরা পড়লে পুরো পরিবার বাতিল।
                </ListItem>
                <ListItem>
                  বাছাইয়ের তিন প্রশ্ন: প্রমাণ কে বহন করে, কে যাচাই করে, কত দ্রুত বাতিল করতে
                  হবে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর লেসন ০৭, HTTPS, TLS, and SSL",
          content: (
            <p>
              এই পুরো লেসনে একটা জিনিস চুপচাপ ধরে নিয়েছি। Login এর Password, Session এর
              Cookie, Bearer Token, সবই তারে যায়। আর Bearer মানে যার হাতে সে-ই মালিক। তাহলে
              ক্যাফের Wi-Fi এর পাশের টেবিলের কেউ, বা পথের কোনো Router, যদি Byte গুলো পড়তে
              পারেন, তাহলে এই লেসনের সব সাবধানতা এক মুহূর্তে শেষ। পথের কেউ যেন পড়তেও না
              পারেন, বদলাতেও না পারেন, আর আপনি যেন নিশ্চিত হন যে সত্যিই Island Tours এর
              সাথেই কথা বলছেন, এই তিনটা কাজ করে HTTPS। পরের লেসন সেটা নিয়েই: HTTPS, TLS, and
              SSL।
            </p>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      ["Authentication", "আপনি কে, প্রমাণ দিয়ে। ব্যর্থ হলে 401"],
      ["Authorization", "আপনি এটা পারেন কি না, নিয়ম আর Data দিয়ে। ব্যর্থ হলে 403 বা 404"],
      ["Server Session", "এলোমেলো id Cookie তে, খাতা Server এ, সাথে সাথে বাতিলযোগ্য"],
      ["Session id", "randomBytes(32), base64url এ ৪৩ অক্ষর, কোনো অর্থ নেই"],
      ["Idle আর Absolute Timeout", "চুপ থাকলে কতক্ষণ, আর সব মিলিয়ে সর্বোচ্চ কতদিন"],
      ["Session Fixation", "আগে থেকে জানা id Login করা হয়ে যাওয়া। প্রতিরোধ: Login এ নতুন id"],
      ["Shared Store", "সব App এক Redis থেকে Session পড়ে, তাই যেকোনো App যেকোনো Request নেয়"],
      ["JWT", "Header, Payload, Signature। নিজের গায়ে সব লেখা, সই করা, খাতা লাগে না"],
      ["base64url", "Encoding, তালা নয়। Payload যে কেউ পড়তে পারেন"],
      ["HS256 আর ES256", "এক Secret দিয়ে সই ও যাচাই, নাকি Private Key এ সই আর Public Key এ যাচাই"],
      ["JWKS", "Public Key এর প্রকাশিত তালিকা, kid দিয়ে চাবি বাছা"],
      ["alg allowlist", "Algorithm Server ঠিক করে, Token নয়। none আর Confusion এর প্রতিরোধ"],
      ["Bearer", "যার হাতে Token সে-ই মালিক, নগদ টাকার মতো"],
      ["Refresh Token Rotation", "প্রতিবার নতুন Refresh, পুরনোটা আবার এলে পুরো পরিবার বাতিল"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "usr_42 Login করা অবস্থায় PATCH /api/bookings/bk_9Z1A2B পাঠালেন, কিন্তু বুকিংটা আরেকজন পর্যটকের। Server এর সঠিক উত্তর কোনটা?",
        options: [
          {
            key: "A",
            text: "200, কারণ তিনি Login করা আছেন",
            isCorrect: false,
            explanation:
              "Login শুধু বলে তিনি কে। অন্যের বুকিং বদলানোর অনুমতি সেখান থেকে আসে না। এটাই IDOR Bug।",
          },
          {
            key: "B",
            text: "401, কারণ তাঁর প্রমাণ অচল",
            isCorrect: false,
            explanation:
              "তাঁর প্রমাণ ঠিকই আছে, Server জানে তিনি usr_42। 401 মানে পরিচয়ই জানা নেই।",
          },
          {
            key: "C",
            text: "403 বা 404, কারণ Authentication পাস কিন্তু Authorization ব্যর্থ",
            isCorrect: true,
            explanation:
              "ঠিক। তিনি কে তা জানা, কিন্তু বুকিংটা তাঁর নয়। 404 দিলে বাইরের কেউ জানতেও পারেন না যে বুকিংটা আছে।",
          },
          {
            key: "D",
            text: "500, কারণ Database এ ভুল Data",
            isCorrect: false,
            explanation:
              "কোনো কিছু ভাঙেনি, Server ঠিকঠাক একটা নিয়ম মেনে না বলছে। 500 মানে Server এর নিজের ব্যর্থতা।",
          },
        ],
      },
      {
        id: 2,
        text: "একটা Session id কী দিয়ে বানানো উচিত?",
        options: [
          {
            key: "A",
            text: "ইউজারের id, যেমন usr_42, যাতে খোঁজা সহজ হয়",
            isCorrect: false,
            explanation:
              "তাহলে যে কেউ usr_43 লিখে অন্যের Session বানিয়ে ফেলবেন। id আন্দাজ করা যাওয়া চলবে না।",
          },
          {
            key: "B",
            text: "Login এর সময়ের Timestamp",
            isCorrect: false,
            explanation:
              "সময় সহজে আন্দাজ করা যায়, এক সেকেন্ডে মাত্র কয়েক হাজার সম্ভাবনা।",
          },
          {
            key: "C",
            text: "নিরাপদ Random Generator থেকে অন্তত ৩২ Byte, যেমন crypto.randomBytes(32)",
            isCorrect: true,
            explanation:
              "ঠিক। ২৫৬ Bit এলোমেলোতা আন্দাজ করা কার্যত অসম্ভব, আর id এর নিজের কোনো অর্থ থাকে না।",
          },
          {
            key: "D",
            text: "email এর Hash",
            isCorrect: false,
            explanation:
              "email জানা থাকলে যে কেউ একই Hash বানাতে পারেন, আর প্রতিবার Login এ id একই থাকে।",
          },
        ],
      },
      {
        id: 3,
        text: "একটা JWT এর Payload সম্পর্কে কোন কথাটা সত্য?",
        options: [
          {
            key: "A",
            text: "এটা Encrypt করা, Secret ছাড়া পড়া যায় না",
            isCorrect: false,
            explanation:
              "সাধারণ JWT এ Payload শুধু base64url, যে কেউ এক লাইনে খুলে পড়তে পারেন।",
          },
          {
            key: "B",
            text: "যে কেউ পড়তে পারেন, কিন্তু বদলালে Signature আর মেলে না",
            isCorrect: true,
            explanation:
              "ঠিক। base64url একটা Encoding, তালা নয়। নিরাপত্তা আসে Signature থেকে, যা বদল ধরে ফেলে।",
          },
          {
            key: "C",
            text: "Server এর Database এ জমা থাকে",
            isCorrect: false,
            explanation:
              "JWT এর মূল সুবিধাই হলো Server কে কিছু জমা রাখতে হয় না। Payload থাকে Token এর ভেতরে।",
          },
          {
            key: "D",
            text: "এতে Password রাখা নিরাপদ, কারণ Token সই করা",
            isCorrect: false,
            explanation:
              "সই বদল আটকায়, পড়া নয়। Payload এ Password বা কোনো গোপন তথ্য রাখবেন না।",
          },
        ],
      },
      {
        id: 4,
        text: "Server এ একটা Token এলো যার Header এ alg none আর Signature খালি। ঠিক আচরণ কোনটা?",
        options: [
          {
            key: "A",
            text: "Signature নেই, তাই Payload পড়ে মেনে নেওয়া",
            isCorrect: false,
            explanation:
              "এটাই সেই পুরনো আক্রমণ। এতে যে কেউ নিজের পছন্দের Payload দিয়ে Admin হয়ে যেতেন।",
          },
          {
            key: "B",
            text: "Header এর alg অনুযায়ী যাচাই করা",
            isCorrect: false,
            explanation:
              "Algorithm Token থেকে নিলে none আর Algorithm Confusion দুইটার দরজাই খোলা থাকে।",
          },
          {
            key: "C",
            text: "বাতিল করা, কারণ Server শুধু নিজের ঠিক করা Algorithm এর তালিকা মানে",
            isCorrect: true,
            explanation:
              "ঠিক। Algorithm আগে থেকে Server ঠিক করে রাখে, যেমন শুধু ES256। তালিকার বাইরে কিছু এলে 401।",
          },
          {
            key: "D",
            text: "Token টা নতুন করে সই করে ফেরত দেওয়া",
            isCorrect: false,
            explanation:
              "তাহলে Server নিজেই আক্রমণকারীর জাল Payload কে আসল বানিয়ে দিত।",
          },
        ],
      },
      {
        id: 5,
        text: "একটা App শুধু JWT ব্যবহার করে, কোনো খাতা বা তালিকা নেই। ইউজার Logout করলে তাঁর Token এর কী হয়?",
        options: [
          {
            key: "A",
            text: "সাথে সাথে সব জায়গায় অচল হয়ে যায়",
            isCorrect: false,
            explanation:
              "Server এর কাছে মোছার মতো কিছুই নেই। Lab ৫ এর plain মোডে Logout এর পরেও 200 এসেছে।",
          },
          {
            key: "B",
            text: "Browser বা App থেকে মুছে যায়, কিন্তু কারো কাছে কপি থাকলে exp পর্যন্ত চলতে থাকে",
            isCorrect: true,
            explanation:
              "ঠিক। এটাই JWT বাতিলের সমস্যা। সমাধান ছোট আয়ুর Access Token আর Server এ খাতা রাখা Refresh Token।",
          },
          {
            key: "C",
            text: "Signature নিজে থেকে বদলে যায়",
            isCorrect: false,
            explanation: "একটা Token এর Byte কখনো নিজে বদলায় না।",
          },
          {
            key: "D",
            text: "Server এর Secret বদলে যায়",
            isCorrect: false,
            explanation:
              "Secret বদলালে সবার সব Token একসাথে বাতিল হতো, একজনের Logout এর জন্য কেউ এটা করে না।",
          },
        ],
      },
      {
        id: 6,
        text: "Rotation চালু আছে। Server দেখল একটা Refresh Token যা আগেই একবার ব্যবহার হয়েছে, আবার এসেছে। কী করা উচিত?",
        options: [
          {
            key: "A",
            text: "আগের মতোই নতুন Token দেওয়া",
            isCorrect: false,
            explanation:
              "তাহলে চোরও চালিয়ে যেত, আসল মানুষও, আর কেউ টেরও পেতেন না।",
          },
          {
            key: "B",
            text: "শুধু এই একটা Request বাতিল করা",
            isCorrect: false,
            explanation:
              "যে আগে এসেছে তার হাতে নতুন Token টা থেকে যায়, আর সে চোর হতে পারে।",
          },
          {
            key: "C",
            text: "ওই Login থেকে জন্মানো পুরো পরিবার বাতিল করা",
            isCorrect: true,
            explanation:
              "ঠিক। Server জানে না কে আসল, তাই সবাইকে বের করে দেয়। আসল মানুষ Password দিয়ে আবার ঢুকতে পারেন, চোর পারে না।",
          },
          {
            key: "D",
            text: "ইউজারের Account মুছে ফেলা",
            isCorrect: false,
            explanation:
              "Token চুরি ইউজারের দোষ নয়। পরিবার বাতিলই যথেষ্ট আর ঠিক মাপের।",
          },
        ],
      },
      {
        id: 7,
        text: "Login সফল হওয়ার পর Server নতুন Session id কেন বানায়, আগেরটা রেখে না দিয়ে?",
        options: [
          {
            key: "A",
            text: "নতুন id ছোট হয়, তাই দ্রুত",
            isCorrect: false,
            explanation: "দুইটা id এর দৈর্ঘ্য একই, ৪৩ অক্ষর।",
          },
          {
            key: "B",
            text: "আগে থেকে জানা কোনো id যেন Login করা হয়ে না যায়, মানে Session Fixation আটকাতে",
            isCorrect: true,
            explanation:
              "ঠিক। আক্রমণকারী আগে থেকে একটা id বসিয়ে রাখলে, id না বদলালে Login এর পরে সেটাও পর্যটক হয়ে যেত।",
          },
          {
            key: "C",
            text: "Redis পুরনো id মনে রাখতে পারে না",
            isCorrect: false,
            explanation: "Redis TTL পর্যন্ত ঠিকই মনে রাখে। কারণটা নিরাপত্তা।",
          },
          {
            key: "D",
            text: "Browser পুরনো Cookie পাঠাতে পারে না",
            isCorrect: false,
            explanation: "Browser মেয়াদ থাকা পর্যন্ত পুরনো Cookie পাঠাতে পারে।",
          },
        ],
      },
      {
        id: 8,
        text: "Island Tours দুইটা App চালু করল, Session রাখা হচ্ছে প্রতিটা App এর নিজের Memory তে। পর্যটকরা কী দেখবেন, আর সমাধান কী?",
        options: [
          {
            key: "A",
            text: "কিছুই না, Load Balancer নিজেই Session ভাগ করে",
            isCorrect: false,
            explanation: "Load Balancer শুধু Request পাঠায়, কোনো App এর Memory জানে না।",
          },
          {
            key: "B",
            text: "মাঝে মাঝে হঠাৎ Logout, কারণ Request অন্য App এ গেলে সে Session চেনে না। সমাধান সবার জন্য একটা Redis",
            isCorrect: true,
            explanation:
              "ঠিক। Lab এর Memory মোডে প্রতি দ্বিতীয় Request এ 401। Shared Store এ সব App একই খাতা দেখে।",
          },
          {
            key: "C",
            text: "Login ই করা যাবে না",
            isCorrect: false,
            explanation: "Login হয়, সমস্যা শুরু হয় পরের Request অন্য App এ গেলে।",
          },
          {
            key: "D",
            text: "Password বারবার চাইবে, সমাধান Cookie এর Max-Age বাড়ানো",
            isCorrect: false,
            explanation:
              "Cookie ঠিকই যাচ্ছে, সমস্যা Server এর খাতায়। Max-Age বাড়ালে কিছু বদলায় না।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "Session আর JWT নিজের হাতে বানান, ভাঙুন, বাতিল করুন",
    subtitle: "ছয়টা পরীক্ষা, শুধু Node আর curl, কোনো Package Install নেই",
    stepName: "LAB",
    steps: [
      {
        title: "Session Server চালু করুন",
        description:
          "একটা ছোট Server যার খাতা একটা Map, Redis এর জায়গায়। Login এ এলোমেলো id, /api/me তে খাতা দেখে চেনা, Logout এ লাইন মোছা।",
      },
      {
        title: "Session বাতিল করার ক্ষমতা পরীক্ষা",
        description:
          "curl এর Cookie Jar দিয়ে Login, তারপর Logout এর পরে চুরি করা কপি, মেয়াদ শেষ, আর Server Restart। তিনবারই 401 কেন, মিলিয়ে নিন।",
      },
      {
        title: "হাতে একটা JWT বানানো",
        description:
          "শুধু node:crypto দিয়ে Header, Payload আর HS256 Signature বানিয়ে জোড়া লাগান, তারপর প্রথম দুই অংশ খুলে পড়ুন।",
      },
      {
        title: "যাচাই লেখা আর জাল করার চেষ্টা",
        description:
          "ছয় ধাপের যাচাই হাতে লিখুন, তারপর ছয় রকম Token দিয়ে পরীক্ষা: আসল, বদলানো, alg none, অন্য Secret, মেয়াদোত্তীর্ণ আর ভুল aud।",
      },
      {
        title: "Logout করলেও JWT মরে না",
        description:
          "একটা JWT Server দুই মোডে চালান। plain এ Logout এর পরেও Token চলে, denylist এ চলে না। কোন দামে, সেটা ভাবুন।",
      },
      {
        title: "Refresh Token Rotation আর চোর ধরা",
        description:
          "Hash করে রাখা Refresh Token, পরিবার আর Reuse Detection এর একটা ছোট নকল। দুই ক্রমে চালিয়ে দেখুন যে দ্বিতীয়বার এলেই ধরা পড়ে।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-session-server.mjs",
        language: "javascript",
        code: `// চালান:  LAB_PORT=47661 SESSION_TTL_SECONDS=60 node 1-session-server.mjs
import http from "node:http";
import { randomBytes } from "node:crypto";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");
const ttlSeconds = Number(process.env.SESSION_TTL_SECONDS);
if (!ttlSeconds) throw new Error("SESSION_TTL_SECONDS is not set");

// Redis এর জায়গায় একটা Map। চাবি session id, মান { userId, expiresAt }
const sessions = new Map();

function readCookie(req, name) {
  for (const part of (req.headers.cookie ?? "").split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
}

function findSession(req) {
  const id = readCookie(req, "session");
  if (!id) return null;
  const session = sessions.get(id);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(id); // মেয়াদ শেষ, Redis এর TTL এর মতো
    return null;
  }
  return { id, ...session };
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json", ...headers });
  res.end(JSON.stringify(body) + "\\n");
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/auth/login") {
    // Password যাচাই এই Lab এ বাদ। আমরা দেখছি যাচাইয়ের পরে কী হয়।
    const old = findSession(req);
    if (old) sessions.delete(old.id); // Login এ সবসময় নতুন id, পুরনোটা বাতিল
    const id = randomBytes(32).toString("base64url");
    sessions.set(id, { userId: "usr_42", expiresAt: Date.now() + ttlSeconds * 1000 });
    console.log(\`login  usr_42  session \${id.slice(0, 6)}...  store size \${sessions.size}\`);
    return send(res, 200, { ok: true }, {
      "Set-Cookie": \`session=\${id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=\${ttlSeconds}\`,
    });
  }

  if (req.method === "GET" && req.url === "/api/me") {
    const session = findSession(req);
    console.log(\`me     \${session ? "found " + session.id.slice(0, 6) + "..." : "no session"}\`);
    if (!session) return send(res, 401, { error: "not logged in" });
    const secondsLeft = Math.round((session.expiresAt - Date.now()) / 1000);
    return send(res, 200, { userId: session.userId, secondsLeft });
  }

  if (req.method === "POST" && req.url === "/api/auth/logout") {
    const session = findSession(req);
    if (session) sessions.delete(session.id);
    console.log(\`logout store size \${sessions.size}\`);
    return send(res, 200, { ok: true }, {
      "Set-Cookie": "session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
    });
  }

  send(res, 404, { error: "not found" });
});

server.listen(port, "127.0.0.1", () => {
  console.log(\`session server on http://127.0.0.1:\${port}, TTL \${ttlSeconds}s\`);
});`,
      },
      {
        filename: "2-session-revoke.sh",
        language: "bash",
        code: `# Terminal ১ এ Server চালু থাকুক:
#   LAB_PORT=47661 SESSION_TTL_SECONDS=20 node 1-session-server.mjs
# সব কমান্ড চলবে Terminal ২ এ।
B=http://127.0.0.1:47661

# ১. Login, Cookie গুলো jar.txt নামের একটা ফাইলে জমা হবে
curl -s -i -c jar.txt -X POST $B/api/auth/login
#   HTTP/1.1 200 OK
#   Set-Cookie: session=hcxEFANEWLVqDT03_nxAR8lENp0O4CjdL75IzD4bGQ8; Path=/; HttpOnly; SameSite=Lax; Max-Age=20

# ২. jar.txt খুলে দেখুন curl কী মনে রেখেছে
cat jar.txt
#   #HttpOnly_127.0.0.1  FALSE  /  FALSE  1793428165  session  hcxEFANEWLVqDT03_nxAR8lENp0O4CjdL75IzD4bGQ8

# ৩. Cookie সহ /api/me, Server খাতা দেখে চিনল
curl -s -b jar.txt $B/api/me
#   {"userId":"usr_42","secondsLeft":20}

# ৪. ধরুন একজন চোর id টা কপি করে রেখেছে
STOLEN=$(awk '$6=="session"{print $7}' jar.txt)

# ৫. Logout, তারপর আবার /api/me
curl -s -b jar.txt -c jar.txt -X POST $B/api/auth/logout
curl -s -i -b jar.txt $B/api/me
#   HTTP/1.1 401 Unauthorized

# ৬. চুরি করা কপিটা দিয়ে চেষ্টা, খাতায় লাইন নেই, তাই অচল
curl -s -i -H "Cookie: session=$STOLEN" $B/api/me
#   HTTP/1.1 401 Unauthorized
#   {"error":"not logged in"}

# ৭. নতুন Login, id টা আলাদা করে রাখুন, তারপর ২১ সেকেন্ড অপেক্ষা
curl -s -c jar.txt -X POST $B/api/auth/login
ID=$(awk '$6=="session"{print $7}' jar.txt)
sleep 21
curl -s -H "Cookie: session=$ID" $B/api/me
#   {"error":"not logged in"}
# curl নিজেও Max-Age শেষে Cookie ফেলে দিত। এখানে id হাতে পাঠিয়ে দেখলেন,
# Server এর খাতাতেও মেয়াদ শেষ। আসল সিদ্ধান্ত সবসময় Server এর।

# ৮. আবার Login করুন, তারপর Terminal ১ এ Ctrl+C দিয়ে Server থামিয়ে আবার চালান
curl -s -c jar.txt -X POST $B/api/auth/login
#   (Server Restart এর পরে)
curl -s -i -b jar.txt $B/api/me
#   HTTP/1.1 401 Unauthorized, কারণ খাতা ছিল Memory তে, Restart এ মুছে গেছে`,
      },
      {
        filename: "3-make-jwt.mjs",
        language: "javascript",
        code: `// চালান:  export JWT_SECRET="$(openssl rand -base64 32)"
//         node 3-make-jwt.mjs
import { createHmac, randomUUID } from "node:crypto";

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET is not set");
if (Buffer.byteLength(secret) < 32) throw new Error("JWT_SECRET must be at least 32 bytes");

// JSON কে base64url এ মোড়ানো। এটা Encoding, কোনো তালা নয়।
const part = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");

const now = Math.floor(Date.now() / 1000); // JWT এর সময় সেকেন্ডে
const header = { alg: "HS256", typ: "JWT" };
const payload = {
  iss: "https://api.islandtours.example",
  sub: "usr_42",
  aud: "islandtours-mobile",
  iat: now,
  exp: now + 15 * 60,
  jti: randomUUID(),
  role: "customer",
};

const signingInput = \`\${part(header)}.\${part(payload)}\`;
const signature = createHmac("sha256", secret).update(signingInput).digest("base64url");
const token = \`\${signingInput}.\${signature}\`;

console.log("token:");
console.log(token);
console.log();

const [h, p, s] = token.split(".");
console.log("part 1, header  :", Buffer.from(h, "base64url").toString());
console.log("part 2, payload :", Buffer.from(p, "base64url").toString());
console.log("part 3, signature is", Buffer.from(s, "base64url").length, "raw bytes");
console.log("whole token is", token.length, "characters");`,
      },
      {
        filename: "4-verify-jwt.mjs",
        language: "javascript",
        code: `// চালান:  export JWT_SECRET="$(openssl rand -base64 32)"
//         node 4-verify-jwt.mjs
import { createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { fileURLToPath } from "node:url";

// যে Token আমরা মানব, তার নিয়ম। Token নিজে এগুলো ঠিক করে দেয় না।
export const EXPECTED = {
  alg: "HS256",
  iss: "https://api.islandtours.example",
  aud: "islandtours-mobile",
};
const CLOCK_SKEW_SECONDS = 30;

export function requireSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  if (Buffer.byteLength(secret) < 32) throw new Error("JWT_SECRET must be at least 32 bytes");
  return secret;
}

const part = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
const hmac = (input, secret) => createHmac("sha256", secret).update(input).digest();

export function signJwt(claims, secret, ttlSeconds) {
  const now = Math.floor(Date.now() / 1000);
  const payload = { iss: EXPECTED.iss, aud: EXPECTED.aud, iat: now, exp: now + ttlSeconds, jti: randomUUID(), ...claims };
  const input = \`\${part({ alg: "HS256", typ: "JWT" })}.\${part(payload)}\`;
  return \`\${input}.\${hmac(input, secret).toString("base64url")}\`;
}

export function verifyJwt(token, secret) {
  const pieces = token.split(".");
  if (pieces.length !== 3) return { ok: false, reason: "not three parts" };
  const [h, p, s] = pieces;

  let header;
  let payload;
  try {
    header = JSON.parse(Buffer.from(h, "base64url").toString());
    payload = JSON.parse(Buffer.from(p, "base64url").toString());
  } catch {
    return { ok: false, reason: "not valid JSON" };
  }

  // ১. alg আমরা আগে থেকে ঠিক করে রেখেছি। Token যা বলে তা মানি না।
  if (header.alg !== EXPECTED.alg) return { ok: false, reason: \`alg "\${header.alg}" is not allowed\` };

  // ২. Signature নিজে আবার হিসাব করে মেলানো, সমান সময়ে
  const expected = hmac(\`\${h}.\${p}\`, secret);
  const given = Buffer.from(s, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return { ok: false, reason: "signature does not match" };
  }

  // ৩. সময়, তারপর কে দিয়েছে আর কার জন্য
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== "number" || now > payload.exp + CLOCK_SKEW_SECONDS) return { ok: false, reason: "expired" };
  if (typeof payload.nbf === "number" && now + CLOCK_SKEW_SECONDS < payload.nbf) return { ok: false, reason: "not valid yet" };
  if (payload.iss !== EXPECTED.iss) return { ok: false, reason: "wrong issuer" };
  if (payload.aud !== EXPECTED.aud) return { ok: false, reason: "wrong audience" };

  return { ok: true, payload };
}

function runDemo() {
  const secret = requireSecret();
  const good = signJwt({ sub: "usr_42", role: "customer" }, secret, 15 * 60);
  const [h, p, s] = good.split(".");

  // জাল ১: payload খুলে role বদলে আবার মোড়ানো, Signature আগেরটাই
  const claims = JSON.parse(Buffer.from(p, "base64url").toString());
  const tampered = \`\${h}.\${part({ ...claims, role: "admin" })}.\${s}\`;

  // জাল ২: alg none, Signature খালি
  const none = \`\${part({ alg: "none", typ: "JWT" })}.\${part({ ...claims, role: "admin" })}.\`;

  // জাল ৩: আক্রমণকারী নিজের একটা Secret দিয়ে সই করলেন
  const attackerSecret = randomBytes(32).toString("base64");
  const wrongKey = signJwt({ sub: "usr_42", role: "admin" }, attackerSecret, 15 * 60);

  // মেয়াদ শেষ: ঠিকঠাক সই, কিন্তু exp দুই মিনিট আগে
  const expired = signJwt({ sub: "usr_42", role: "customer" }, secret, -120);

  // ভুল দর্শক: সঠিক সই, কিন্তু অন্য App এর জন্য বানানো
  const now = Math.floor(Date.now() / 1000);
  const input = \`\${part({ alg: "HS256", typ: "JWT" })}.\${part({ ...claims, aud: "islandtours-partner", exp: now + 900 })}\`;
  const wrongAud = \`\${input}.\${hmac(input, secret).toString("base64url")}\`;

  const cases = { good, tampered, none, wrongKey, expired, wrongAud };
  for (const [name, token] of Object.entries(cases)) {
    const result = verifyJwt(token, secret);
    console.log(name.padEnd(9), result.ok ? \`accepted, sub=\${result.payload.sub} role=\${result.payload.role}\` : \`rejected, \${result.reason}\`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) runDemo();`,
      },
      {
        filename: "5-jwt-server.mjs",
        language: "javascript",
        code: `// চালান:  export JWT_SECRET="$(openssl rand -base64 32)"
//         LAB_PORT=47662 ACCESS_TTL_SECONDS=60 node 5-jwt-server.mjs plain
//         LAB_PORT=47662 ACCESS_TTL_SECONDS=60 node 5-jwt-server.mjs denylist
// 4-verify-jwt.mjs একই ফোল্ডারে থাকতে হবে।
import http from "node:http";
import { requireSecret, signJwt, verifyJwt } from "./4-verify-jwt.mjs";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");
const ttlSeconds = Number(process.env.ACCESS_TTL_SECONDS);
if (!ttlSeconds) throw new Error("ACCESS_TTL_SECONDS is not set");
const mode = process.argv[2];
if (mode !== "plain" && mode !== "denylist") throw new Error('mode must be "plain" or "denylist"');
const secret = requireSecret();

// denylist মোডে Logout করা Token এর jti এখানে, মেয়াদ শেষ হওয়া পর্যন্ত
const revoked = new Map();

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body) + "\\n");
}

function bearer(req) {
  const value = req.headers.authorization ?? "";
  return value.startsWith("Bearer ") ? value.slice(7) : null;
}

function check(req) {
  const token = bearer(req);
  if (!token) return { ok: false, reason: "no token" };
  const result = verifyJwt(token, secret);
  if (!result.ok) return result;
  if (mode === "denylist" && revoked.has(result.payload.jti)) return { ok: false, reason: "revoked" };
  return result;
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/auth/login") {
    const accessToken = signJwt({ sub: "usr_42", role: "customer" }, secret, ttlSeconds);
    console.log("login  issued a token, server stored nothing");
    return send(res, 200, { accessToken, expiresIn: ttlSeconds });
  }

  if (req.method === "GET" && req.url === "/api/me") {
    const result = check(req);
    console.log(\`me     \${result.ok ? "valid" : "rejected, " + result.reason}\`);
    if (!result.ok) return send(res, 401, { error: result.reason });
    return send(res, 200, { userId: result.payload.sub, role: result.payload.role });
  }

  if (req.method === "POST" && req.url === "/api/auth/logout") {
    const result = check(req);
    if (result.ok && mode === "denylist") revoked.set(result.payload.jti, result.payload.exp);
    console.log(\`logout mode=\${mode}, denylist size \${revoked.size}\`);
    return send(res, 200, { ok: true });
  }

  send(res, 404, { error: "not found" });
});

server.listen(port, "127.0.0.1", () => {
  console.log(\`jwt server on http://127.0.0.1:\${port}, mode \${mode}, token life \${ttlSeconds}s\`);
});`,
      },
      {
        filename: "6-refresh-rotation.mjs",
        language: "javascript",
        code: `// চালান:  node 6-refresh-rotation.mjs app-first
//         node 6-refresh-rotation.mjs thief-first
// Refresh Token Rotation আর Reuse Detection, Server ছাড়া, এক ফাইলে।
import { createHash, randomBytes } from "node:crypto";

// Database এর টেবিলের জায়গায় একটা Map। Token নিজে নয়, তার Hash রাখা হয়।
const refreshTokens = new Map(); // hash -> { userId, family, used, revoked }

const hash = (token) => createHash("sha256").update(token).digest("hex");
const newOpaqueToken = () => randomBytes(32).toString("base64url");
const short = (token) => token.slice(0, 6) + "...";

function login(userId) {
  const family = randomBytes(4).toString("hex"); // এক Login থেকে জন্মানো সব Token এক পরিবার
  const refresh = newOpaqueToken();
  refreshTokens.set(hash(refresh), { userId, family, used: false, revoked: false });
  return refresh;
}

function refreshWith(token, who) {
  const row = refreshTokens.get(hash(token));
  if (!row) return console.log(\`\${who.padEnd(6)} \${short(token)}  rejected, unknown token\`);
  if (row.revoked) return console.log(\`\${who.padEnd(6)} \${short(token)}  rejected, family \${row.family} is revoked\`);

  if (row.used) {
    // একবার ব্যবহার হয়ে যাওয়া Token আবার এলো। কেউ একটা কপি রেখেছে।
    for (const other of refreshTokens.values()) {
      if (other.family === row.family) other.revoked = true;
    }
    return console.log(\`\${who.padEnd(6)} \${short(token)}  REUSE DETECTED, whole family \${row.family} revoked\`);
  }

  row.used = true;
  const next = newOpaqueToken();
  refreshTokens.set(hash(next), { userId: row.userId, family: row.family, used: false, revoked: false });
  console.log(\`\${who.padEnd(6)} \${short(token)}  ok, new access token and new refresh \${short(next)}\`);
  return next;
}

const order = process.argv[2];
if (order !== "app-first" && order !== "thief-first") throw new Error('order must be "app-first" or "thief-first"');

const r1 = login("usr_42");
console.log(\`login  usr_42, refresh \${short(r1)} stored as a hash, \${refreshTokens.size} row\\n\`);

const stolen = r1; // ধরা যাক কোনোভাবে R1 এর একটা কপি চোরের হাতে
if (order === "app-first") {
  const r2 = refreshWith(r1, "app");
  refreshWith(stolen, "thief");
  refreshWith(r2, "app");
} else {
  const r2 = refreshWith(stolen, "thief");
  refreshWith(r1, "app");
  refreshWith(r2, "thief");
}`,
      },
    ],
    tip: "পরীক্ষা ২ আর ৫ পাশাপাশি রেখে ভাবুন, কারণ পুরো লেসনের সবচেয়ে কাজের শিক্ষাটা এই দুইটার তফাতে। দুইটাতেই আপনি Logout করলেন, আর দুইটাতেই একটা কপি কারো হাতে রয়ে গেল। Session এ কপিটা সাথে সাথে অচল হলো, কারণ খাতাটা Server এর। JWT এ কপিটা মেয়াদ পর্যন্ত চলল, কারণ খাতাই নেই, আর খাতা ফেরত আনতেই সমস্যাটা মিটল। কেউ যখন বলবেন JWT আধুনিক তাই ভালো, আপনি এখন একটা প্রশ্ন জিজ্ঞেস করতে জানেন: একটা চুরি যাওয়া প্রমাণ কত দ্রুত বাতিল করতে হবে, আর সেটা কীভাবে করবেন। এই একটা প্রশ্নের উত্তরই বলে দেয় কোনটা বেছে নেওয়া উচিত।",
  },
  assignment: {
    title: "Mini Project: my-tours এর জন্য Login ব্যবস্থার নকশা আর প্রমাণ",
    time: "১২০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>সব ডিভাইস থেকে বের করুন:</strong> Lab ১ এর Server এ প্রতিটা ইউজারের
        Session id এর একটা তালিকা যোগ করুন, আর একটা নতুন Route{" "}
        <code>POST /api/auth/logout-all</code>। দুইটা আলাদা Cookie Jar দিয়ে দুইবার Login
        করুন, যেন দুইটা ডিভাইস, তারপর একটা থেকে logout-all ডাকুন আর প্রমাণ করুন দুইটা
        Jar এই 401 আসছে। সাথে একটা Absolute Timeout যোগ করুন, যার মান আসবে Environment
        Variable থেকে, আর না থাকলে Server চালুই হবে না।
      </span>,
      <span key="2">
        <strong>যাচাইয়ের সপ্তম পরীক্ষা:</strong> Lab ৪ এর verify এ nbf এর পরীক্ষা
        ইতিমধ্যে আছে, কিন্তু কোনো Token দিয়ে চালানো হয়নি। এমন একটা Token বানান যার nbf
        দুই মিনিট পরে, আর দেখান সেটা বাতিল হচ্ছে। তারপর একটা Token বানান যাতে exp নেই,
        আর ব্যাখ্যা করুন Lab এর Code সেটাকে কেন আর কোন লাইনে বাতিল করে।
      </span>,
      <span key="3">
        <strong>Grace Window যোগ করুন:</strong> Lab ৬ এ একটা ছোট Grace Window বসান, যার
        সেকেন্ড আসবে Environment Variable থেকে। ঠিক আগের Refresh Token টা Window এর ভেতরে
        আবার এলে সেটা Reuse ধরা হবে না। দুইটা পরীক্ষা দেখান: হারানো উত্তরের পর দ্রুত আবার
        চেষ্টা চলে, আর Window পার হলে পুরো পরিবার বাতিল হয়।
      </span>,
      <span key="4">
        <strong>my-tours এর সিদ্ধান্তপত্র:</strong> আপনার my-tours এর তিন রকম ব্যবহারকারীর
        জন্য একটা টেবিল বানান: Website, Mobile App আর একটা Partner এর Server। প্রতিটার জন্য
        লিখুন কোন প্রমাণ, কোথায় রাখা হবে, কোন পথে যাবে, আয়ু কত, কীভাবে বাতিল হবে, আর
        Authorization এর সিদ্ধান্ত কোথা থেকে আসবে। প্রতিটা ঘরের পাশে এক লাইনে কারণ।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> দলের একজন নতুন সদস্য প্রস্তাব
        দিয়েছেন: Session পুরনো জিনিস, চলুন সব জায়গায় JWT দিই, Payload এ ইউজারের email,
        ফোন নম্বর আর role রাখি, মেয়াদ ৩০ দিন, আর Token টা localStorage এ রাখি। তাঁকে বোঝান
        এই প্রস্তাবে অন্তত চারটা সমস্যা কোথায়, প্রতিটার কারণ কী, আর কী বদলালে প্রস্তাবটা
        নিরাপদ হয়।
      </span>,
    ],
    deliverables: [
      <span key="1">logout-all এর Code, আর দুইটা Jar এর আগের ও পরের curl ফলাফল</span>,
      <span key="2">nbf আর exp ছাড়া Token এর পরীক্ষার ফলাফল, আর এক লাইনের ব্যাখ্যা</span>,
      <span key="3">Grace Window সহ Lab ৬, আর দুইটা পরীক্ষার Terminal ফলাফল</span>,
      <span key="4">my-tours এর তিন সারির সিদ্ধান্তপত্র, প্রতিটা ঘরে কারণ সহ</span>,
      <span key="5">নতুন সদস্যের জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
