/**
 * What: The still pictures for the HTTP Headers lesson: a header line taken apart, the request and
 * response header families, content negotiation, the cache layers, ETag revalidation, origins,
 * the CORS preflight, who enforces CORS, and the headers a reverse proxy adds.
 *
 * Why: Headers are many small rules that are easier to see than to read. Each picture holds one
 * rule, uses the lesson's real Island Tours values, and draws with currentColor and the primary
 * token so it reads in both themes. Every marker id starts with "headers-" so two pictures on one
 * page never share an id.
 */
import { Sketch, SketchSplit, SketchText } from "../../sketch";

function Arrow({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        markerWidth={8}
        markerHeight={8}
        refX={7}
        refY={3.5}
        orient="auto"
        markerUnits="userSpaceOnUse"
      >
        <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--primary)" />
      </marker>
    </defs>
  );
}

function Box({
  x,
  y,
  w,
  h = 34,
  text,
  accent,
  size = 9.5,
  dashed,
  body,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  text: string;
  accent?: boolean;
  size?: number;
  dashed?: boolean;
  body?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={accent ? "var(--primary)" : "currentColor"}
        fillOpacity={accent ? 0.1 : 0.04}
        stroke={accent ? "var(--primary)" : "currentColor"}
        strokeOpacity={accent ? 1 : 0.45}
        strokeWidth="1.3"
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <SketchText x={x + w / 2} y={y + h / 2 + 4} size={size} bold accent={accent} body={body}>
        {text}
      </SketchText>
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. পার্সেলের লেবেল আর HTTP এর Header                                       */
/* ------------------------------------------------------------------------- */

const LABEL_ROWS = [
  { label: "ভেতরে কী আছে: একটা পাতা", header: "Content-Type: text/html; charset=utf-8" },
  { label: "ওজন: 400 Byte, চাপা অবস্থায়", header: "Content-Length: 400" },
  { label: "চাপ দিয়ে ছোট করা", header: "Content-Encoding: gzip" },
  { label: "কতদিন রাখা যাবে", header: "Cache-Control: max-age=60" },
  { label: "কবে প্যাক করা", header: "Last-Modified: Sat, 24 Oct 2026 ..." },
];

export function HeadersEnvelopeDiagram() {
  return (
    <Sketch
      label="Diagram: পার্সেলের লেবেল আর Response এর Header"
      height={330}
      minWidth={860}
      viewBox="0 0 860 330"
      caption="বাঁ দিকে একটা কুরিয়ারের পার্সেল। ভেতরের জিনিসটা না খুলেও লেবেল পড়ে সবাই জানে এটা কী, কত ভারী, কীভাবে রাখতে হবে। ডান দিকে একটা HTTP Response। উপরের লাইনগুলো Header, প্রতিটা একটা লেবেল। একটা ফাঁকা লাইনের পরে আসল জিনিস, মানে Body। Browser Body খোলার আগেই Header পড়ে ঠিক করে নেয় Body টা দিয়ে কী করবে: পাতা হিসেবে আঁকবে, ফাইল হিসেবে নামাবে, নাকি আগে Decompress করবে।"
    >
      <Arrow id="headers-env-a" />
      {/* parcel */}
      <rect x={24} y={40} width={300} height={250} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" />
      <line x1={24} y1={92} x2={324} y2={92} stroke="currentColor" strokeOpacity={0.3} />
      <SketchText x={174} y={72} size={11} bold body>
        কুরিয়ারের পার্সেল, উপরে লেবেল
      </SketchText>
      {LABEL_ROWS.map((r, i) => (
        <SketchText key={r.label} x={44} y={122 + i * 30} size={9.5} anchor="start" body>
          {r.label}
        </SketchText>
      ))}
      <rect x={44} y={262} width={260} height={18} fill="currentColor" fillOpacity={0.08} />
      <SketchText x={174} y={275} size={8.5} body opacity={0.75}>
        ভেতরের জিনিস, লেবেল পড়ার পরে খোলা হয়
      </SketchText>

      {/* response */}
      <rect x={470} y={40} width={366} height={250} fill="var(--primary)" fillOpacity={0.05} stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={490} y={66} size={10} anchor="start" bold accent>
        HTTP/1.1 200 OK
      </SketchText>
      {LABEL_ROWS.map((r, i) => (
        <SketchText key={r.header} x={490} y={122 + i * 30} size={9.5} anchor="start">
          {r.header}
        </SketchText>
      ))}
      <SketchText x={490} y={264} size={8.5} anchor="start" body opacity={0.7}>
        একটা ফাঁকা লাইন, তারপর Body
      </SketchText>
      <SketchText x={490} y={282} size={9.5} anchor="start" opacity={0.85}>
        {"<!doctype html><html>..."}
      </SketchText>

      {LABEL_ROWS.map((r, i) => (
        <line
          key={`l-${r.label}`}
          x1={330}
          y1={118 + i * 30}
          x2={482}
          y2={118 + i * 30}
          stroke="var(--primary)"
          strokeOpacity={0.6}
          strokeDasharray="3 3"
          markerEnd="url(#headers-env-a)"
        />
      ))}
      <SketchText x={404} y={104} size={8.5} body opacity={0.75}>
        একই কাজ
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. একটা Header লাইনের গঠন                                                  */
/* ------------------------------------------------------------------------- */

export function HeaderAnatomyDiagram() {
  return (
    <Sketch
      label="Diagram: একটা Header লাইনের প্রতিটা অংশ"
      height={330}
      minWidth={860}
      viewBox="0 0 860 330"
      caption="উপরের লাইনে একটা Header এর তিন অংশ: নাম, একটা কোলন, তারপর মান। মানের ভেতরে সেমিকোলনের পরে আসে Parameter, যা মূল মানটাকে আরও নির্দিষ্ট করে। নিচের লাইনে একটা তালিকা: কমা দিয়ে কয়েকটা পছন্দ আলাদা করা, আর q দিয়ে বলা কোনটা কতটা পছন্দ, 1 সবচেয়ে বেশি, 0 মানে একদম না। q না লিখলে ধরা হয় 1। নামের বড় ছোট হাত কোনো ব্যাপার না, Content-Type আর content-type একই Header।"
    >
      {/* line 1 */}
      <SketchText x={40} y={40} size={9} anchor="start" body opacity={0.7}>
        একটা মান, সাথে একটা Parameter
      </SketchText>
      <rect x={40} y={56} width={150} height={40} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={115} y={81} size={13} bold accent>
        Content-Type
      </SketchText>
      <SketchText x={202} y={81} size={13} bold>
        :
      </SketchText>
      <rect x={216} y={56} width={110} height={40} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" />
      <SketchText x={271} y={81} size={13} bold>
        text/html
      </SketchText>
      <SketchText x={336} y={81} size={13} bold>
        ;
      </SketchText>
      <rect x={348} y={56} width={156} height={40} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" strokeDasharray="4 3" />
      <SketchText x={426} y={81} size={13} bold>
        charset=utf-8
      </SketchText>
      <SketchText x={115} y={116} size={9} body>
        নাম
      </SketchText>
      <SketchText x={202} y={116} size={9} body>
        কোলন
      </SketchText>
      <SketchText x={271} y={116} size={9} body>
        মূল মান
      </SketchText>
      <SketchText x={426} y={116} size={9} body>
        Parameter: অক্ষরের Encoding
      </SketchText>
      <SketchText x={560} y={70} size={9} anchor="start" body opacity={0.8}>
        নামে বড় ছোট হাত সমান। HTTP/2 তে
      </SketchText>
      <SketchText x={560} y={86} size={9} anchor="start" body opacity={0.8}>
        তারের উপর সব নাম ছোট হাতে যায়।
      </SketchText>
      <SketchText x={560} y={102} size={9} anchor="start" body opacity={0.8}>
        মানের বড় ছোট হাত Header ভেদে আলাদা।
      </SketchText>

      {/* line 2 */}
      <SketchText x={40} y={176} size={9} anchor="start" body opacity={0.7}>
        একটা তালিকা, পছন্দের ওজন সহ
      </SketchText>
      <rect x={40} y={192} width={86} height={40} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={83} y={217} size={13} bold accent>
        Accept
      </SketchText>
      <SketchText x={136} y={217} size={13} bold>
        :
      </SketchText>
      {[
        { x: 150, w: 100, t: "text/html", q: "q=1, ধরে নেওয়া" },
        { x: 268, w: 200, t: "application/json;q=0.9", q: "একটু কম পছন্দ" },
        { x: 486, w: 92, t: "*/*;q=0.1", q: "যা হোক, শেষ উপায়" },
      ].map((item, i) => (
        <g key={item.t}>
          <rect x={item.x} y={192} width={item.w} height={40} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" />
          <SketchText x={item.x + item.w / 2} y={217} size={12} bold>
            {item.t}
          </SketchText>
          <SketchText x={item.x + item.w / 2} y={252} size={8.5} body opacity={0.8}>
            {item.q}
          </SketchText>
          {i < 2 && (
            <SketchText x={item.x + item.w + 9} y={217} size={13} bold accent>
              ,
            </SketchText>
          )}
        </g>
      ))}
      <SketchText x={600} y={206} size={9} anchor="start" body opacity={0.8}>
        কমা দিয়ে আলাদা করা প্রতিটা অংশ
      </SketchText>
      <SketchText x={600} y={222} size={9} anchor="start" body opacity={0.8}>
        একটা পছন্দ। Server এর মধ্য থেকে
      </SketchText>
      <SketchText x={600} y={238} size={9} anchor="start" body opacity={0.8}>
        সবচেয়ে বেশি q ওয়ালা যেটা পারে দেয়।
      </SketchText>
      <SketchText x={430} y={300} size={9} body opacity={0.75}>
        একই নামের Header দুইবার এলে প্রায় সব ক্ষেত্রে কমা দিয়ে জুড়ে একটা ধরা হয়। ব্যতিক্রম Set-Cookie, সেটা কখনো জোড়া লাগে না।
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Request আর Response Header এর পরিবার                                    */
/* ------------------------------------------------------------------------- */

const REQUEST_FAMILIES = [
  { q: "কাকে চাইছি, আমি কে", names: "Host, User-Agent" },
  { q: "কী রূপে পেলে খুশি", names: "Accept, Accept-Language, Accept-Encoding" },
  { q: "কোথা থেকে আসছি", names: "Origin, Referer, Sec-Fetch-Site" },
  { q: "আমার পরিচয়ের প্রমাণ", names: "Cookie, Authorization" },
  { q: "শর্ত দিয়ে চাওয়া", names: "If-None-Match, If-Modified-Since, Range" },
];

const RESPONSE_FAMILIES = [
  { q: "এটা কী, কত বড়", names: "Content-Type, Content-Length, Content-Encoding" },
  { q: "কতক্ষণ রাখা যাবে", names: "Cache-Control, ETag, Last-Modified, Age, Vary" },
  { q: "এরপর কোথায় যাবেন", names: "Location, Retry-After" },
  { q: "কে পড়তে পারবে", names: "Access-Control-Allow-Origin, ..." },
  { q: "নিরাপত্তার নিয়ম, আর মনে রাখা", names: "Strict-Transport-Security, CSP, Set-Cookie" },
];

export function HeaderFamiliesDiagram() {
  const rowY = (i: number) => 92 + i * 52;
  return (
    <Sketch
      label="Diagram: Header গুলো কোন প্রশ্নের উত্তর দেয়"
      height={380}
      minWidth={900}
      viewBox="0 0 900 380"
      caption="শত শত Header এর নাম মুখস্থ করার দরকার নেই। প্রতিটা Header আসলে একটা প্রশ্নের উত্তর, আর প্রশ্ন মাত্র কয়েকটা। বাঁ দিকে Browser যা বলে: কাকে চাইছে, কী রূপে চায়, কোথা থেকে আসছে, পরিচয় কী, আর কোন শর্তে চায়। ডান দিকে Server যা বলে: জিনিসটা কী, কতক্ষণ রাখা যাবে, এরপর কোথায় যেতে হবে, অন্য সাইট এটা পড়তে পারবে কি না, আর নিরাপত্তার নিয়ম কী। নতুন একটা Header দেখলে আগে ভাবুন এটা কোন প্রশ্নের উত্তর।"
    >
      <Box x={30} y={24} w={400} h={38} text="Request Header, Browser বলে" accent body size={11} />
      <Box x={470} y={24} w={400} h={38} text="Response Header, Server বলে" body size={11} />
      {REQUEST_FAMILIES.map((f, i) => (
        <g key={f.q}>
          <rect x={30} y={rowY(i)} width={400} height={42} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.3} />
          <SketchText x={46} y={rowY(i) + 17} size={9.5} anchor="start" body bold accent>
            {f.q}
          </SketchText>
          <SketchText x={46} y={rowY(i) + 33} size={9} anchor="start" opacity={0.85}>
            {f.names}
          </SketchText>
        </g>
      ))}
      {RESPONSE_FAMILIES.map((f, i) => (
        <g key={f.q}>
          <rect x={470} y={rowY(i)} width={400} height={42} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.3} />
          <SketchText x={486} y={rowY(i) + 17} size={9.5} anchor="start" body bold>
            {f.q}
          </SketchText>
          <SketchText x={486} y={rowY(i) + 33} size={9} anchor="start" opacity={0.85}>
            {f.names}
          </SketchText>
        </g>
      ))}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Content Negotiation: চাওয়া আর পাওয়ার জোড়া                               */
/* ------------------------------------------------------------------------- */

const NEGOTIATION_PAIRS = [
  { ask: "Accept: text/html, application/json;q=0.9", got: "Content-Type: application/json", note: "কোন রূপে" },
  { ask: "Accept-Encoding: gzip, deflate, br, zstd", got: "Content-Encoding: br", note: "কীভাবে ছোট করে" },
  { ask: "Accept-Language: bn-BD, bn;q=0.9, en;q=0.8", got: "Content-Language: bn", note: "কোন ভাষায়" },
];

export function NegotiationDiagram() {
  return (
    <Sketch
      label="Diagram: Content Negotiation, চাওয়া আর পাওয়ার জোড়া"
      height={320}
      minWidth={880}
      viewBox="0 0 880 320"
      caption="Browser প্রতিটা Accept Header এ নিজের পছন্দের তালিকা দেয়, আর Server নিজের সামর্থ্য দেখে একটা বেছে নিয়ে Content Header এ জানায় কোনটা দিল। তিনটা জোড়া: রূপ, Compression আর ভাষা। নিচের Vary লাইনটা সবচেয়ে বেশি ভুলে যাওয়া অংশ। একই URL এর উত্তর যদি কোনো Request Header এর উপর নির্ভর করে, Server কে Vary দিয়ে সেটা জানাতে হয়, নাহলে মাঝের কোনো Cache একজনের জন্য বানানো উত্তর আরেকজনকে দিয়ে দেবে।"
    >
      <Arrow id="headers-neg-a" />
      <SketchText x={190} y={30} size={11} bold accent body>
        Browser চায়
      </SketchText>
      <SketchText x={690} y={30} size={11} bold body>
        Server দেয়
      </SketchText>
      {NEGOTIATION_PAIRS.map((p, i) => {
        const y = 52 + i * 72;
        return (
          <g key={p.ask}>
            <rect x={20} y={y} width={340} height={44} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" strokeWidth="1.2" />
            <SketchText x={190} y={y + 27} size={9.5} bold>
              {p.ask}
            </SketchText>
            <line x1={364} y1={y + 22} x2={514} y2={y + 22} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#headers-neg-a)" />
            <SketchText x={440} y={y + 14} size={9} body opacity={0.8}>
              {p.note}
            </SketchText>
            <rect x={520} y={y} width={340} height={44} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.2" />
            <SketchText x={690} y={y + 27} size={9.5} bold>
              {p.got}
            </SketchText>
          </g>
        );
      })}
      <rect x={520} y={268} width={340} height={36} fill="currentColor" fillOpacity={0.04} stroke="var(--primary)" strokeDasharray="4 3" strokeWidth="1.2" />
      <SketchText x={690} y={291} size={9.5} bold accent>
        Vary: Accept-Encoding, Accept-Language
      </SketchText>
      <SketchText x={190} y={291} size={9} body opacity={0.8}>
        Cache কে বলা: এই দুইটা Header দেখে আলাদা আলাদা কপি রাখুন
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. Cache কোথায় কোথায় থাকে                                                  */
/* ------------------------------------------------------------------------- */

export function CacheLayersDiagram() {
  const boxes = [
    { x: 20, title: "Browser Cache", sub: "শুধু এই মানুষের", accent: true },
    { x: 240, title: "CDN Edge", sub: "সবার জন্য ভাগ করা", accent: false },
    { x: 460, title: "Caddy", sub: "103.94.135.2:443", accent: false },
    { x: 680, title: "App", sub: "127.0.0.1:3000", accent: false },
  ];
  return (
    <Sketch
      label="Diagram: একটা Response কোথায় কোথায় জমা থাকতে পারে"
      height={360}
      minWidth={900}
      viewBox="0 0 900 360"
      caption="একটা Response চারটা জায়গা পার হয়। Browser Cache একজন মানুষের নিজের, তাই একে বলে Private Cache। CDN এর Edge অনেক মানুষের মাঝে ভাগ করা, তাই Shared Cache। Island Tours এ Caddy নিজে কিছু Cache করে না, শুধু পার করে দেয়, আর App হলো আসল উৎস। নিচের চারটা লাইন দেখায় কোন Cache-Control শব্দ কোন Cache এর জন্য। max-age দুই ধরনের Cache ই মানে, s-maxage শুধু Shared Cache মানে, private মানে শুধু Browser রাখতে পারবে, আর no-store মানে কেউই রাখবে না।"
    >
      <Arrow id="headers-layers-a" />
      {boxes.map((b, i) => (
        <g key={b.title}>
          <rect x={b.x} y={30} width={200} height={62} fill={b.accent ? "var(--primary)" : "currentColor"} fillOpacity={b.accent ? 0.1 : 0.04} stroke={b.accent ? "var(--primary)" : "currentColor"} strokeOpacity={b.accent ? 1 : 0.45} strokeWidth="1.3" />
          <SketchText x={b.x + 100} y={56} size={11} bold accent={b.accent}>
            {b.title}
          </SketchText>
          <SketchText x={b.x + 100} y={76} size={9} body={i < 2} opacity={0.75}>
            {b.sub}
          </SketchText>
          {i < boxes.length - 1 && (
            <line x1={b.x + 202} y1={61} x2={b.x + 236} y2={61} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#headers-layers-a)" />
          )}
        </g>
      ))}
      {[
        { y: 140, text: "max-age=60", reach: [0, 1], note: "দুই Cache ই ৬০ সেকেন্ড রাখতে পারে" },
        { y: 190, text: "s-maxage=60", reach: [1], note: "শুধু CDN এর জন্য, Browser এর জন্য নয়" },
        { y: 240, text: "private", reach: [0], note: "শুধু Browser, CDN রাখবে না" },
        { y: 290, text: "no-store", reach: [], note: "কেউই জমা রাখবে না" },
      ].map((row) => (
        <g key={row.text}>
          <SketchText x={20} y={row.y + 4} size={10.5} anchor="start" bold accent>
            {row.text}
          </SketchText>
          {[0, 1].map((col) => {
            const on = row.reach.includes(col);
            const cx = boxes[col].x + 100;
            return (
              <g key={col}>
                <circle cx={cx} cy={row.y} r={9} fill={on ? "var(--primary)" : "transparent"} fillOpacity={on ? 0.85 : 0} stroke={on ? "var(--primary)" : "currentColor"} strokeOpacity={on ? 1 : 0.4} />
                {!on && (
                  <SketchText x={cx} y={row.y + 4} size={10} opacity={0.6}>
                    ✕
                  </SketchText>
                )}
              </g>
            );
          })}
          <SketchText x={480} y={row.y + 4} size={9.5} anchor="start" body opacity={0.85}>
            {row.note}
          </SketchText>
        </g>
      ))}
      <line x1={20} y1={318} x2={880} y2={318} stroke="currentColor" strokeOpacity={0.2} />
      <SketchText x={450} y={340} size={9} body opacity={0.75}>
        CDN থেকে আসা উত্তরে Age Header বলে দেয় জিনিসটা কত সেকেন্ড ধরে সেখানে জমা আছে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 6. ETag দিয়ে যাচাই আর 304                                                  */
/* ------------------------------------------------------------------------- */

const ETAG_STEPS = [
  { y: 96, dir: "right", text: "GET /api/tours/saint-martin", note: "প্রথমবার, হাতে কিছু নেই" },
  { y: 146, dir: "left", text: '200 OK, ETag: "TLA3YHQRl1KfW0Q0"', note: "পুরো Body, 75 Byte, max-age=10" },
  { y: 226, dir: "right", text: 'If-None-Match: "TLA3YHQRl1KfW0Q0"', note: "১০ সেকেন্ড পার, কপিটা বাসি, তাই জিজ্ঞেস" },
  { y: 276, dir: "left", text: "304 Not Modified", note: "Body নেই, পুরনো কপিটাই চলবে" },
  { y: 356, dir: "right", text: 'If-None-Match: "TLA3YHQRl1KfW0Q0"', note: "এর মধ্যে একটা আসন বুক হয়ে গেছে" },
  { y: 406, dir: "left", text: '200 OK, ETag: "bL6pwOGnAYzQQ4lP"', note: "জিনিস বদলেছে, নতুন Body আর নতুন ETag" },
];

export function EtagRevalidationDiagram() {
  const lx = 150;
  const rx = 730;
  return (
    <Sketch
      label="Diagram: ETag দিয়ে Cache যাচাই"
      height={450}
      minWidth={880}
      viewBox="0 0 880 450"
      caption="Lab এর চার নম্বর পরীক্ষার আসল ফলাফল, ছবিতে। Server প্রথম উত্তরের সাথে একটা ETag দেয়, যা আসলে Body এর একটা আঙুলের ছাপ। কপিটা বাসি হয়ে গেলে Browser পুরোটা আবার চায় না, শুধু ছাপটা দেখিয়ে জিজ্ঞেস করে, এটা কি এখনো ঠিক আছে? না বদলালে উত্তর 304, কোনো Body ছাড়া। একটা আসন বুক হয়ে Body বদলালে ছাপ ও বদলায়, তাই একই প্রশ্নের উত্তর তখন পুরো 200।"
    >
      <Arrow id="headers-etag-a" />
      <Box x={lx - 100} y={20} w={200} h={40} text="Browser" accent />
      <Box x={rx - 100} y={20} w={200} h={40} text="Island Tours App" />
      <line x1={lx} y1={64} x2={lx} y2={430} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <line x1={rx} y1={64} x2={rx} y2={430} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      {ETAG_STEPS.map((s) => {
        const from = s.dir === "right" ? lx + 4 : rx - 4;
        const to = s.dir === "right" ? rx - 6 : lx + 6;
        return (
          <g key={`${s.y}`}>
            <line x1={from} y1={s.y} x2={to} y2={s.y} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#headers-etag-a)" />
            <SketchText x={440} y={s.y - 8} size={10} bold accent>
              {s.text}
            </SketchText>
            <SketchText x={440} y={s.y + 15} size={8.5} body opacity={0.75}>
              {s.note}
            </SketchText>
          </g>
        );
      })}
      <line x1={lx - 60} y1={186} x2={rx + 60} y2={186} stroke="currentColor" strokeOpacity={0.15} />
      <line x1={lx - 60} y1={316} x2={rx + 60} y2={316} stroke="currentColor" strokeOpacity={0.15} />
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 7. Origin মেলানো                                                          */
/* ------------------------------------------------------------------------- */

const ORIGIN_ROWS: { url: string; same: boolean; why: string }[] = [
  { url: "https://islandtours.example/tours/saint-martin", same: true, why: "শুধু Path আলাদা, Path Origin এর অংশ নয়" },
  { url: "http://islandtours.example/", same: false, why: "Scheme আলাদা, http আর https" },
  { url: "https://islandtours.example:8443/", same: false, why: "Port আলাদা, 443 আর 8443" },
  { url: "https://blog.islandtours.example/", same: false, why: "Host আলাদা, Subdomain ও আলাদা Host" },
  { url: "https://api.islandtours.example/", same: false, why: "Host আলাদা" },
  { url: "https://seagulltours.example/", same: false, why: "পুরো অন্য সাইট" },
];

export function SameOriginDiagram() {
  return (
    <Sketch
      label="Diagram: কোন URL একই Origin, কোনটা নয়"
      height={420}
      minWidth={900}
      viewBox="0 0 900 420"
      caption="উপরে Island Tours এর পাতার Origin, তিন টুকরো: Scheme, Host আর Port। লেসন ০১ এ দেখেছেন, https লিখলে Port লেখা না থাকলেও সেটা 443। নিচের প্রতিটা URL এর সাথে মেলানো হয়েছে। তিনটা টুকরো হুবহু মিললে তবেই একই Origin। প্রথম লাইনটা মেলে, কারণ Path, Query আর Fragment Origin এর অংশই নয়। বাকি সবগুলো অন্তত একটা টুকরোয় আলাদা। খেয়াল করুন blog.islandtours.example ও আলাদা Origin, যদিও নামটা Island Tours এরই।"
    >
      {[
        { x: 170, w: 130, t: "https", s: "Scheme" },
        { x: 316, w: 270, t: "islandtours.example", s: "Host" },
        { x: 602, w: 110, t: "443", s: "Port, লেখা না থাকলেও" },
      ].map((p) => (
        <g key={p.s}>
          <rect x={p.x} y={24} width={p.w} height={40} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" strokeWidth="1.3" />
          <SketchText x={p.x + p.w / 2} y={49} size={12} bold accent>
            {p.t}
          </SketchText>
          <SketchText x={p.x + p.w / 2} y={80} size={8.5} body opacity={0.75}>
            {p.s}
          </SketchText>
        </g>
      ))}
      <line x1={20} y1={98} x2={880} y2={98} stroke="currentColor" strokeOpacity={0.2} />
      {ORIGIN_ROWS.map((r, i) => {
        const y = 124 + i * 48;
        return (
          <g key={r.url}>
            <rect x={20} y={y - 18} width={860} height={38} fill={r.same ? "var(--primary)" : "currentColor"} fillOpacity={r.same ? 0.08 : 0.02} stroke={r.same ? "var(--primary)" : "currentColor"} strokeOpacity={r.same ? 0.8 : 0.2} />
            <SketchText x={36} y={y + 5} size={10} anchor="start" bold accent={r.same}>
              {r.url}
            </SketchText>
            <SketchText x={520} y={y + 5} size={10} anchor="start" bold accent={r.same}>
              {r.same ? "একই Origin" : "আলাদা Origin"}
            </SketchText>
            <SketchText x={640} y={y + 5} size={9} anchor="start" body opacity={0.8}>
              {r.why}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 8. Preflight সহ CORS                                                        */
/* ------------------------------------------------------------------------- */

const PREFLIGHT_STEPS = [
  {
    y: 104,
    dir: "right",
    lines: ["OPTIONS /api/bookings/bk_7Q2M9X", "Origin: https://admin.islandtours.example", "Access-Control-Request-Method: PATCH", "Access-Control-Request-Headers: content-type"],
    note: "১. আগে অনুমতি চাওয়া, এখনো আসল কাজ নয়",
  },
  {
    y: 210,
    dir: "left",
    lines: ["204 No Content", "Access-Control-Allow-Origin: https://admin.islandtours.example", "Access-Control-Allow-Methods: GET, POST, PATCH, DELETE", "Access-Control-Allow-Credentials: true"],
    note: "২. Server বলে, এই Origin থেকে PATCH চলবে",
  },
  {
    y: 316,
    dir: "right",
    lines: ["PATCH /api/bookings/bk_7Q2M9X", "Origin: https://admin.islandtours.example", "Content-Type: application/json", "Cookie: __Host-session=..."],
    note: "৩. এবার আসল Request",
  },
  {
    y: 412,
    dir: "left",
    lines: ["200 OK", "Access-Control-Allow-Origin: https://admin.islandtours.example", "Access-Control-Allow-Credentials: true"],
    note: "৪. উত্তর, আর Browser আবার মিলিয়ে দেখে",
  },
];

export function CorsPreflightDiagram() {
  const lx = 110;
  const rx = 790;
  return (
    <Sketch
      label="Diagram: Preflight সহ একটা CORS Request"
      height={490}
      minWidth={900}
      viewBox="0 0 900 490"
      caption="Island Tours এর Admin প্যানেল চলে https://admin.islandtours.example এ, আর API চলে https://islandtours.example এ। দুইটা আলাদা Origin। Admin প্যানেলের JavaScript একটা বুকিং বদলাতে চায়, PATCH দিয়ে, JSON Body আর Cookie সহ। এমন Request এর আগে Browser নিজে থেকে একটা OPTIONS পাঠায়, যার নাম Preflight। Server হ্যাঁ বললে তবেই আসল PATCH যায়। Server না বললে আসল Request টা কখনো পাঠানোই হয় না, তাই বুকিংও বদলায় না। শেষ উত্তরেও Browser Allow-Origin মিলিয়ে দেখে, তারপর JavaScript কে পড়তে দেয়।"
    >
      <Arrow id="headers-pre-a" />
      <Box x={lx - 90} y={20} w={180} h={44} text="Browser, Admin পাতা" accent body />
      <Box x={rx - 90} y={20} w={180} h={44} text="API, islandtours.example" />
      <line x1={lx} y1={68} x2={lx} y2={470} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <line x1={rx} y1={68} x2={rx} y2={470} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      {PREFLIGHT_STEPS.map((s) => {
        const from = s.dir === "right" ? lx + 4 : rx - 4;
        const to = s.dir === "right" ? rx - 6 : lx + 6;
        return (
          <g key={s.y}>
            <SketchText x={450} y={s.y - 26} size={9} body bold opacity={0.85}>
              {s.note}
            </SketchText>
            <line x1={from} y1={s.y - 14} x2={to} y2={s.y - 14} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#headers-pre-a)" />
            {s.lines.map((line, j) => (
              <SketchText key={line} x={450} y={s.y + 2 + j * 15} size={9} bold={j === 0} accent={j === 0} opacity={j === 0 ? 1 : 0.85}>
                {line}
              </SketchText>
            ))}
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 9. CORS কে মানে, আর কে মানে না                                              */
/* ------------------------------------------------------------------------- */

function EnforcerPanel({ browser }: { browser: boolean }) {
  const id = browser ? "headers-who-a" : "headers-who-b";
  return (
    <>
      <Arrow id={id} />
      <Box x={10} y={14} w={110} h={34} text={browser ? "Browser" : "curl"} accent={browser} size={10} />
      <Box x={250} y={14} w={130} h={34} text="API Server" size={10} />
      <line x1={124} y1={44} x2={246} y2={44} stroke="var(--primary)" strokeWidth="1.4" markerEnd={`url(#${id})`} />
      <SketchText x={185} y={36} size={8} body opacity={0.8}>
        Request পৌঁছায়
      </SketchText>
      <line x1={246} y1={76} x2={124} y2={76} stroke="var(--primary)" strokeWidth="1.4" markerEnd={`url(#${id})`} />
      <SketchText x={185} y={92} size={8} body opacity={0.8}>
        উত্তর ও ফেরত আসে
      </SketchText>
      <rect x={10} y={112} width={370} height={92} fill={browser ? "var(--primary)" : "currentColor"} fillOpacity={browser ? 0.07 : 0.03} stroke={browser ? "var(--primary)" : "currentColor"} strokeOpacity={browser ? 0.8 : 0.3} strokeDasharray="4 3" />
      <SketchText x={195} y={136} size={9.5} body bold accent={browser}>
        {browser ? "Browser মিলিয়ে দেখে Allow-Origin" : "curl কিছুই মিলিয়ে দেখে না"}
      </SketchText>
      <SketchText x={195} y={160} size={9} body opacity={0.85}>
        {browser ? "না মিললে উত্তর JavaScript এর কাছে লুকানো" : "যা এলো, পুরোটা Terminal এ ছাপা"}
      </SketchText>
      <SketchText x={195} y={184} size={9} body opacity={0.85}>
        {browser ? "Console এ লাল CORS Error" : "কোনো CORS Error হয় না, কখনো"}
      </SketchText>
    </>
  );
}

export function CorsWhoEnforcesSplit() {
  return (
    <SketchSplit
      label="Diagram: CORS কে মানে, আর কে মানে না"
      caption="Lab এর পাঁচ নম্বর পরীক্ষায় attacker.example Origin লিখে curl দিয়ে চাইলেও Tour এর তালিকা পুরোটা চলে এসেছিল। কারণ CORS এর নিয়ম Server চাপায় না, Browser চাপায়। Server শুধু Header দিয়ে জানায় কাকে পড়তে দেওয়া হলো। নিয়মটা আছে Browser ব্যবহারকারী মানুষটাকে রক্ষা করতে, যাতে অন্য একটা সাইটের JavaScript তাঁর Cookie নিয়ে Island Tours থেকে তাঁর তথ্য পড়ে নিতে না পারে। Server এর তথ্য লুকানোর কাজ CORS করে না। সেটা করে Authentication, পরের দুই লেসনে।"
      panels={[
        { title: "Browser এর ভেতরে", sub: "fetch থেকে", viewBox: "0 0 390 214", height: 214, children: <EnforcerPanel browser /> },
        { title: "Browser এর বাইরে", sub: "curl, Postman, Server", viewBox: "0 0 390 214", height: 214, children: <EnforcerPanel browser={false} /> },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 10. Proxy যে Header গুলো যোগ করে                                             */
/* ------------------------------------------------------------------------- */

export function ForwardedHeadersDiagram() {
  const hops = [
    { x: 16, w: 170, title: "পর্যটকের ফোন", sub: "192.168.1.20" },
    { x: 226, w: 170, title: "বাসার Router, NAT", sub: "বাইরে 203.0.113.25" },
    { x: 436, w: 190, title: "Caddy", sub: "103.94.135.2:443" },
    { x: 676, w: 190, title: "App", sub: "127.0.0.1:3000" },
  ];
  return (
    <Sketch
      label="Diagram: Caddy যে Header যোগ করে, আর কেন"
      height={360}
      minWidth={900}
      viewBox="0 0 900 360"
      caption="Module 03 এর NAT এর কারণে Caddy পর্যটককে দেখে 203.0.113.25 হিসেবে, ফোনের ভেতরের 192.168.1.20 হিসেবে নয়। তারপর Caddy নিজে একটা নতুন TCP Connection খুলে App এর সাথে কথা বলে। তাই App এর Socket দেখে শুধু 127.0.0.1, মানে Caddy। আসল মানুষটার খবর App পায় Header থেকে: X-Forwarded-For বলে কে পাঠিয়েছিল, X-Forwarded-Proto বলে বাইরে Request টা https এ এসেছিল, X-Forwarded-Host বলে কোন নাম চাওয়া হয়েছিল। আর App নিজে প্রতিটা Request কে একটা X-Request-Id দেয়, একটা নম্বর যা দিয়ে এই একটা Request কে প্রতিটা Log এ খুঁজে পাওয়া যায়।"
    >
      <Arrow id="headers-fwd-a" />
      {hops.map((h, i) => (
        <g key={h.title}>
          <rect x={h.x} y={30} width={h.w} height={60} fill={i === 3 ? "var(--primary)" : "currentColor"} fillOpacity={i === 3 ? 0.1 : 0.04} stroke={i === 3 ? "var(--primary)" : "currentColor"} strokeOpacity={i === 3 ? 1 : 0.45} strokeWidth="1.3" />
          <SketchText x={h.x + h.w / 2} y={56} size={10.5} bold body={i < 2} accent={i === 3}>
            {h.title}
          </SketchText>
          <SketchText x={h.x + h.w / 2} y={76} size={9} opacity={0.75}>
            {h.sub}
          </SketchText>
          {i < hops.length - 1 && (
            <line x1={h.x + h.w + 3} y1={60} x2={hops[i + 1].x - 4} y2={60} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#headers-fwd-a)" />
          )}
        </g>
      ))}
      <SketchText x={651} y={112} size={8.5} body opacity={0.8}>
        নতুন Connection
      </SketchText>
      <rect x={436} y={140} width={430} height={150} fill="var(--primary)" fillOpacity={0.05} stroke="var(--primary)" strokeDasharray="4 3" strokeWidth="1.2" />
      <SketchText x={452} y={164} size={9} anchor="start" body bold accent>
        Caddy যা যোগ করে পাঠায়
      </SketchText>
      {[
        "X-Forwarded-For: 203.0.113.25",
        "X-Forwarded-Proto: https",
        "X-Forwarded-Host: islandtours.example",
      ].map((line, i) => (
        <SketchText key={line} x={452} y={196 + i * 28} size={10} anchor="start" bold>
          {line}
        </SketchText>
      ))}
      <rect x={16} y={140} width={380} height={150} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.3} />
      <SketchText x={32} y={164} size={9} anchor="start" body bold>
        App এর Socket যা দেখে
      </SketchText>
      <SketchText x={32} y={192} size={10} anchor="start">
        remoteAddress: 127.0.0.1
      </SketchText>
      <SketchText x={32} y={220} size={9} anchor="start" body opacity={0.85}>
        মানে Caddy। আসল পর্যটককে App কখনো সরাসরি দেখে না,
      </SketchText>
      <SketchText x={32} y={238} size={9} anchor="start" body opacity={0.85}>
        তাই Header না থাকলে প্রতিটা Log এ একই IP দেখা যেত।
      </SketchText>
      <SketchText x={450} y={330} size={9} body opacity={0.8}>
        X-Request-Id এর জন্ম App এ: না থাকলে App একটা বানায়, প্রতিটা Log লাইনে লেখে আর Response এ ফেরত দেয়
      </SketchText>
    </Sketch>
  );
}
