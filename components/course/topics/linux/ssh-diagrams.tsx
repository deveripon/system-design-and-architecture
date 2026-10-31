/**
 * What: The still diagrams for Module 07 Lesson 03, SSH and Security Keys. They show what SSH
 * does between a laptop and a server, how SSH trusts a server compared with HTTPS, how a key
 * login proves who you are, which key file lives on which machine, why the first sshd setting
 * wins, and how a tunnel reaches a database whose port is closed.
 *
 * Why: SSH is a conversation between two machines, and each idea is easier to see as a
 * picture than to read as a list of commands. Every marker id starts with "ssh-" so two
 * diagrams on one page never share an id.
 */
import { Sketch, SketchSplit, SketchText } from "../../sketch";

function Arrow({ id, muted }: { id: string; muted?: boolean }) {
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
        <path
          d="M0,0 L7,3.5 L0,7 Z"
          fill={muted ? "currentColor" : "var(--primary)"}
          fillOpacity={muted ? 0.55 : 1}
        />
      </marker>
    </defs>
  );
}

function Box({
  x,
  y,
  w,
  h = 40,
  text,
  sub,
  accent,
  dashed,
  faded,
  size = 9.5,
  mono,
  subMono,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  text: string;
  sub?: string;
  accent?: boolean;
  dashed?: boolean;
  faded?: boolean;
  size?: number;
  /** Main label in the mono font, for paths and commands. */
  mono?: boolean;
  /** Sub label in the mono font, for paths and commands. */
  subMono?: boolean;
}) {
  return (
    <g opacity={faded ? 0.55 : 1}>
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
      <SketchText
        x={x + w / 2}
        y={sub ? y + h / 2 - 3 : y + h / 2 + 4}
        size={size}
        bold
        body={!mono}
        accent={accent}
      >
        {text}
      </SketchText>
      {sub && (
        <SketchText x={x + w / 2} y={y + h / 2 + 12} size={8} body={!subMono} opacity={0.75}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

/** A small closed padlock, drawn from its top-left corner. */
function Padlock({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path
        d={`M${x + 3},${y + 8} L${x + 3},${y + 5} A5,5 0 0 1 ${x + 13},${y + 5} L${x + 13},${y + 8}`}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.4"
      />
      <rect
        x={x}
        y={y + 8}
        width={16}
        height={11}
        fill="var(--primary)"
        fillOpacity={0.25}
        stroke="var(--primary)"
        strokeWidth="1.3"
      />
    </g>
  );
}

/** One file on a machine: its path, its mode and what it is for. */
function FileRow({
  x,
  y,
  w,
  name,
  mode,
  desc,
  accent,
}: {
  x: number;
  y: number;
  w: number;
  name: string;
  mode: string;
  desc: string;
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={52}
        fill={accent ? "var(--primary)" : "currentColor"}
        fillOpacity={accent ? 0.1 : 0.03}
        stroke={accent ? "var(--primary)" : "currentColor"}
        strokeOpacity={accent ? 1 : 0.4}
        strokeWidth="1.2"
      />
      <SketchText x={x + 12} y={y + 20} size={9} bold anchor="start" accent={accent}>
        {name}
      </SketchText>
      <SketchText x={x + w - 12} y={y + 20} size={9} anchor="end" opacity={0.8}>
        {mode}
      </SketchText>
      <SketchText x={x + 12} y={y + 39} size={8.5} body anchor="start" opacity={0.8}>
        {desc}
      </SketchText>
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. SSH এর তিনটা কাজ                                                         */
/* ------------------------------------------------------------------------- */

export function SshOverviewDiagram() {
  return (
    <Sketch
      label="Diagram: আপনার Laptop থেকে দূরের Server এর Terminal"
      height={370}
      minWidth={860}
      viewBox="0 0 880 370"
      caption="বাঁ দিকে আপনার Laptop, ডান দিকে Island Tours এর VPS। মাঝখানে TCP Port 22 এর উপর একটা তালাবন্ধ পথ। আপনি Laptop এ যা লেখেন, সেটা তালাবন্ধ হয়ে Server এ যায়, সেখানে একটা Shell সেটা চালায়, আর Output আবার তালাবন্ধ হয়ে ফিরে আসে। নিচের সারিতে দেখুন ক্যাফের Wi-Fi এ বসে কেউ তারের দিকে তাকালে কী দেখে: পুরনো Telnet এ Password সহ সবকিছু খোলা, SSH এ শুধু অর্থহীন Byte।"
    >
      <Arrow id="ssh-ov-a" />

      <SketchText x={440} y={32} size={10.5} body bold accent>
        SSH এর তিনটা কাজ: কথা গোপন রাখা, Server কে চেনা, আপনাকে চেনা
      </SketchText>

      <Box x={30} y={80} w={200} h={64} text="আপনার Laptop" sub="you@laptop, ssh (Client)" />
      <Box x={650} y={80} w={200} h={64} text="island-vps-01" sub="103.94.135.2, sshd (Server)" accent />

      <rect
        x={244}
        y={95}
        width={392}
        height={34}
        fill="var(--primary)"
        fillOpacity={0.08}
        stroke="var(--primary)"
        strokeWidth="1.3"
      />
      <Padlock x={256} y={102} />
      <Padlock x={608} y={102} />
      <SketchText x={440} y={116} size={9.5} bold accent>
        Encrypted Channel, TCP Port 22
      </SketchText>

      <line x1={130} y1={146} x2={130} y2={176} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#ssh-ov-a)" />
      <line x1={750} y1={146} x2={750} y2={176} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#ssh-ov-a)" />
      <Box x={30} y={180} w={200} h={52} text="আপনি লিখছেন" sub="sudo systemctl restart caddy" subMono />
      <Box x={650} y={180} w={200} h={52} text="Server এ চলছে একটা Shell" sub="bash, deploy User হিসেবে" />

      <SketchText x={440} y={168} size={9} body opacity={0.85}>
        আপনার প্রতিটা অক্ষর তালাবন্ধ হয়ে যায়,
      </SketchText>
      <SketchText x={440} y={184} size={9} body opacity={0.85}>
        Command এর Output তালাবন্ধ হয়ে ফেরে
      </SketchText>

      <line x1={20} y1={256} x2={860} y2={256} stroke="currentColor" strokeOpacity={0.2} />
      <SketchText x={440} y={280} size={9.5} body bold>
        ক্যাফের Wi-Fi এ বসে কেউ তারের দিকে তাকালে যা দেখে
      </SketchText>

      <rect x={60} y={294} width={360} height={56} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.45} strokeDasharray="4 3" />
      <SketchText x={240} y={314} size={9} body bold>
        Telnet, SSH এর আগের যুগ
      </SketchText>
      <SketchText x={240} y={336} size={9}>
        login: deploy   password: ocean-view-2026
      </SketchText>

      <rect x={460} y={294} width={360} height={56} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" />
      <SketchText x={640} y={314} size={9} body bold accent>
        SSH
      </SketchText>
      <SketchText x={640} y={336} size={9}>
        9f 3a c1 7e 02 b4 e8 51 0d ... পড়ার মতো কিছু নেই
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. HTTPS এ জামিন দেয় CA, SSH এ জামিন দেন আপনি                                */
/* ------------------------------------------------------------------------- */

export function HostKeyTrustSplit() {
  return (
    <SketchSplit
      label="Diagram: Server কে চেনার দুই পদ্ধতি"
      caption="বাঁ দিকে Module 06 এর HTTPS: Browser Server কে আগে কখনো না দেখলেও বিশ্বাস করে, কারণ একটা CA Certificate এ সই করে জামিন দিয়েছে, আর সেই CA কে Browser আগে থেকে চেনে। ডান দিকে SSH: এখানে কোনো CA নেই। প্রথমবার Server তার Host Key এর Fingerprint দেখায়, আর মিলিয়ে নেওয়ার দায়িত্ব আপনার। আপনি yes বললে Laptop সেটা known_hosts ফাইলে লিখে রাখে, আর পরের প্রতিটা Connection এ মিলিয়ে দেখে।"
      panels={[
        {
          title: "HTTPS",
          sub: "Module 06, CA জামিন দেয়",
          viewBox: "0 0 400 270",
          height: 270,
          minWidth: 340,
          children: (
            <>
              <Arrow id="ssh-trust-a" />
              <Box x={130} y={14} w={140} h={40} text="CA" sub="যেমন Let's Encrypt" accent />
              <path d="M240,56 C270,90 300,110 318,146" fill="none" stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#ssh-trust-a)" />
              <SketchText x={286} y={96} size={8.5} body anchor="start" opacity={0.85}>
                সই করে
              </SketchText>
              <SketchText x={286} y={110} size={8.5} body anchor="start" opacity={0.85}>
                জামিন দেয়
              </SketchText>
              <Box x={14} y={150} w={130} h={44} text="Browser" />
              <Box x={256} y={150} w={130} h={44} text="Server" sub="Certificate সহ" />
              <line x1={254} y1={174} x2={148} y2={174} stroke="currentColor" strokeOpacity={0.6} strokeWidth="1.3" markerEnd="url(#ssh-trust-a)" />
              <SketchText x={200} y={166} size={8} body opacity={0.8}>
                দেখায়
              </SketchText>
              <SketchText x={200} y={228} size={9} body>
                Browser আগে থেকেই CA কে চেনে,
              </SketchText>
              <SketchText x={200} y={244} size={9} body>
                তাই অচেনা Server কেও বিশ্বাস করে
              </SketchText>
            </>
          ),
        },
        {
          title: "SSH",
          sub: "জামিন দেন আপনি নিজে",
          viewBox: "0 0 400 270",
          height: 270,
          minWidth: 340,
          children: (
            <>
              <Arrow id="ssh-trust-b" />
              <Box x={14} y={30} w={130} h={44} text="Laptop" sub="known_hosts" />
              <Box x={256} y={30} w={130} h={44} text="Server" sub="Host Key" accent />
              <line x1={254} y1={56} x2={148} y2={56} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#ssh-trust-b)" />
              <SketchText x={200} y={48} size={8} body opacity={0.85}>
                Fingerprint দেখায়
              </SketchText>
              <Box
                x={14}
                y={100}
                w={372}
                h={48}
                text="প্রথমবার: কেউ জামিন নেই, মিলিয়ে নেবেন আপনি"
                sub="Provider এর Console এ ssh-keygen -lf দিয়ে আসল Fingerprint"
                dashed
                size={9}
              />
              <Box
                x={14}
                y={164}
                w={372}
                h={48}
                text="পরের বার থেকে: known_hosts এর সাথে মিলিয়ে দেখে"
                sub="না মিললে থামিয়ে দেয়: HOST IDENTIFICATION HAS CHANGED"
                accent
                size={9}
              />
              <SketchText x={200} y={244} size={9.5} bold accent>
                এই পদ্ধতির নাম Trust On First Use
              </SketchText>
            </>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Key দিয়ে Login, ধাপে ধাপে                                                  */
/* ------------------------------------------------------------------------- */

export function KeyLoginDiagram() {
  const L = 170;
  const S = 690;
  return (
    <Sketch
      label="Diagram: Key দিয়ে Login, Private Key না পাঠিয়েই প্রমাণ"
      height={480}
      minWidth={860}
      viewBox="0 0 860 480"
      caption="Laptop প্রথমে জানায় কোন Public Key দিয়ে ঢুকতে চায়। Server দেখে deploy এর authorized_keys ফাইলে সেই Key আছে কি না। থাকলে Server বলে, এই Connection এর নিজস্ব তথ্যে সই করে দেখান। Laptop এর ভেতরে Agent Private Key দিয়ে সই করে পাঠায়। Server Public Key দিয়ে সইটা যাচাই করে, মিললে Shell খুলে দেয়। পুরো সময়ে Private Key একবারও Laptop ছেড়ে যায় না, যায় শুধু একটা সই, যা এই একটা Connection ছাড়া আর কোথাও কাজে লাগে না। Module 06 এর Lesson 08 এ যে Sign আর Verify দেখেছিলেন, এটা ঠিক সেটাই।"
    >
      <Arrow id="ssh-kl-a" />
      <Arrow id="ssh-kl-m" muted />

      <Box x={70} y={20} w={200} h={50} text="আপনার Laptop" sub="Agent এর ভেতরে Private Key" />
      <Box x={590} y={20} w={200} h={50} text="island-vps-01" sub="authorized_keys এ Public Key" accent />

      <line x1={L} y1={72} x2={L} y2={436} stroke="currentColor" strokeOpacity={0.3} strokeDasharray="4 4" />
      <line x1={S} y1={72} x2={S} y2={436} stroke="currentColor" strokeOpacity={0.3} strokeDasharray="4 4" />

      {/* 1 */}
      <line x1={L + 4} y1={112} x2={S - 6} y2={112} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#ssh-kl-a)" />
      <SketchText x={430} y={104} size={9} body>
        ১. deploy হিসেবে ঢুকতে চাই, এই Public Key দিয়ে
      </SketchText>
      <SketchText x={430} y={128} size={8} opacity={0.7}>
        ED25519 SHA256:iTjwJb0l...ZvJg
      </SketchText>

      {/* 2 */}
      <rect x={700} y={146} width={150} height={38} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.4} />
      <SketchText x={775} y={162} size={8.5} body>
        ২. authorized_keys এ
      </SketchText>
      <SketchText x={775} y={177} size={8.5} body>
        এই Key আছে? আছে।
      </SketchText>

      {/* 3 */}
      <line x1={S - 4} y1={218} x2={L + 6} y2={218} stroke="currentColor" strokeOpacity={0.6} strokeWidth="1.4" markerEnd="url(#ssh-kl-m)" />
      <SketchText x={430} y={210} size={9} body>
        ৩. তাহলে এই Connection এর তথ্যে সই করে প্রমাণ দিন
      </SketchText>

      {/* 4 */}
      <rect x={10} y={250} width={150} height={38} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" />
      <SketchText x={85} y={266} size={8.5} body>
        ৪. Private Key দিয়ে সই,
      </SketchText>
      <SketchText x={85} y={281} size={8.5} body>
        Laptop এর ভেতরেই
      </SketchText>

      {/* 5 */}
      <line x1={L + 4} y1={322} x2={S - 6} y2={322} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#ssh-kl-a)" />
      <SketchText x={430} y={314} size={9} body>
        ৫. এই নিন সই
      </SketchText>
      <SketchText x={430} y={338} size={8} body opacity={0.75}>
        Private Key নিজে কখনো যায় না, যায় শুধু সই
      </SketchText>

      {/* 6 */}
      <rect x={700} y={354} width={150} height={38} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.4} />
      <SketchText x={775} y={370} size={8.5} body>
        ৬. Public Key দিয়ে
      </SketchText>
      <SketchText x={775} y={385} size={8.5} body>
        যাচাই: মিলেছে
      </SketchText>

      {/* 7 */}
      <line x1={S - 4} y1={420} x2={L + 6} y2={420} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#ssh-kl-a)" />
      <SketchText x={430} y={412} size={9} body>
        ৭. Shell খুলে গেল: deploy@island-vps-01:~$
      </SketchText>

      <SketchText x={430} y={464} size={9} body bold accent>
        কেউ Public Key টা চুরি করলেও সই বানাতে পারবে না, তাই Public Key লুকানোর দরকার নেই
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. কোন ফাইল কোথায় থাকে                                                       */
/* ------------------------------------------------------------------------- */

export function KeyFilesDiagram() {
  return (
    <Sketch
      label="Diagram: দুই যন্ত্রের SSH ফাইল, আর কোনটা কোথায় যায়"
      height={390}
      minWidth={860}
      viewBox="0 0 880 390"
      caption="বাঁ দিকে আপনার Laptop এর ~/.ssh Folder, ডান দিকে Server। দুই দিকেই একটা করে Private Key আছে: আপনার id_ed25519, আর Server এর নিজের Host Key। দুইটাই নিজের যন্ত্র ছাড়ে না। যা এক যন্ত্র থেকে আরেক যন্ত্রে যায়, সেটা সবসময় Public Key: আপনার id_ed25519.pub একবার কপি হয়ে Server এর authorized_keys এ বসে, আর Server এর Host Key এর Public অংশ প্রথম Connection এ আপনার known_hosts এ লেখা হয়। ডানের সংখ্যাগুলো Permission, লেসন ০৪ এ এর পুরো অর্থ পাবেন।"
    >
      <Arrow id="ssh-files-a" />

      <SketchText x={200} y={28} size={10} bold>
        আপনার Laptop: ~/.ssh/
      </SketchText>
      <rect x={20} y={40} width={360} height={300} fill="none" stroke="currentColor" strokeOpacity={0.3} />
      <FileRow x={34} y={54} w={332} name="id_ed25519" mode="600" desc="Private Key: কোথাও যায় না, কাউকে দেখানো নয়" accent />
      <FileRow x={34} y={124} w={332} name="id_ed25519.pub" mode="644" desc="Public Key: যে কোনো Server এ রাখা যায়" />
      <FileRow x={34} y={194} w={332} name="known_hosts" mode="644" desc="চেনা Server দের Host Key, প্রথম দেখায় লেখা" />
      <FileRow x={34} y={264} w={332} name="config" mode="600" desc="ডাকনাম আর Setting: ssh island" />

      <SketchText x={680} y={28} size={10} bold accent>
        island-vps-01
      </SketchText>
      <rect x={500} y={40} width={360} height={300} fill="none" stroke="var(--primary)" strokeOpacity={0.5} />
      <FileRow x={514} y={54} w={332} name="/home/deploy/.ssh/authorized_keys" mode="600" desc="যাদের ঢুকতে দেওয়া হবে, তাদের Public Key" accent />
      <FileRow x={514} y={124} w={332} name="/etc/ssh/ssh_host_ed25519_key" mode="600" desc="Server এর নিজের Private Key, শুধু root পড়ে" />
      <FileRow x={514} y={194} w={332} name="/etc/ssh/ssh_host_ed25519_key.pub" mode="644" desc="এটার Fingerprint আপনি প্রথমবার মিলিয়ে নেন" />
      <FileRow x={514} y={264} w={332} name="/etc/ssh/sshd_config.d/10-hardening.conf" mode="644" desc="কে আর কীভাবে ঢুকতে পারবে, তার নিয়ম" />

      <path d="M368,150 C430,150 440,80 512,80" fill="none" stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#ssh-files-a)" />
      <SketchText x={448} y={150} size={8.5} body bold accent>
        একবার কপি
      </SketchText>
      <path d="M512,220 C450,220 430,220 370,220" fill="none" stroke="var(--primary)" strokeWidth="1.4" strokeDasharray="5 3" markerEnd="url(#ssh-files-a)" />
      <SketchText x={440} y={212} size={8.5} body bold accent>
        প্রথম Connection এ
      </SketchText>

      <SketchText x={440} y={372} size={9.5} body bold accent>
        Private Key দুইটাই নিজের যন্ত্র ছাড়ে না। যা পার হয়, তা সবসময় Public Key।
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. প্রথম মানটাই টেকে                                                         */
/* ------------------------------------------------------------------------- */

export function ConfigOrderDiagram() {
  return (
    <Sketch
      label="Diagram: sshd যে ক্রমে Setting পড়ে, আর কোনটা টেকে"
      height={350}
      minWidth={860}
      viewBox="0 0 860 350"
      caption="sshd তার মূল ফাইলের বারো নম্বর লাইনে এসে sshd_config.d Folder এর সব .conf ফাইল নামের বর্ণক্রমে পড়ে, তারপর মূল ফাইলের বাকিটা। একই Setting একাধিকবার পেলে sshd প্রথমটা রাখে, পরেরগুলো চুপচাপ উপেক্ষা করে। তাই 10-hardening.conf এর no আগে আসে আর টিকে যায়। একই লেখা 99-hardening.conf নামে রাখলে আগে পড়া হতো 50-cloud-init.conf এর yes, Password Login খোলাই থাকত, আর কোনো Error ও দেখাত না। এই কারণেই প্রতিটা পরিবর্তনের পরে sshd -T দিয়ে আসল মানটা দেখে নিতে হয়।"
    >
      <Arrow id="ssh-order-a" />
      <Arrow id="ssh-order-m" muted />

      <SketchText x={250} y={28} size={10} body bold>
        sshd যেভাবে পড়ে, উপর থেকে নিচে
      </SketchText>
      <Box x={40} y={44} w={420} h={40} text="sshd_config, লাইন 12: Include /etc/ssh/sshd_config.d/*.conf" size={9} />
      <line x1={250} y1={86} x2={250} y2={104} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#ssh-order-m)" />
      <Box x={40} y={108} w={420} h={48} text="১ম: 10-hardening.conf" sub="PasswordAuthentication no, প্রথম মান, এটাই টেকে" accent />
      <line x1={250} y1={158} x2={250} y2={170} stroke="currentColor" strokeOpacity={0.5} />
      <Box x={40} y={172} w={420} h={48} text="২য়: 50-cloud-init.conf" sub="PasswordAuthentication yes, মান আগেই ঠিক, তাই উপেক্ষা" dashed faded />
      <line x1={250} y1={222} x2={250} y2={234} stroke="currentColor" strokeOpacity={0.5} />
      <Box x={40} y={236} w={420} h={40} text="৩য়: sshd_config এর বাকি লাইন" faded />

      <line x1={462} y1={132} x2={536} y2={132} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#ssh-order-a)" />
      <Box x={540} y={108} w={290} h={48} text="sudo sshd -T বলে" sub="passwordauthentication no" accent />

      <rect x={540} y={180} width={290} height={96} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.45} strokeDasharray="4 3" />
      <SketchText x={685} y={202} size={9} body bold>
        নাম 99-hardening.conf হলে?
      </SketchText>
      <SketchText x={685} y={222} size={8.5} body opacity={0.85}>
        আগে পড়া হতো 50-cloud-init.conf,
      </SketchText>
      <SketchText x={685} y={240} size={8.5} body opacity={0.85}>
        টিকে যেত yes, Password খোলা থাকত,
      </SketchText>
      <SketchText x={685} y={258} size={8.5} body opacity={0.85}>
        আর কোনো Error ও দেখাত না
      </SketchText>

      <SketchText x={430} y={318} size={9} body bold accent>
        নিয়ম: একই Setting দুইবার থাকলে sshd প্রথমটা রাখে। নিজের ফাইলের নাম ছোট সংখ্যা দিয়ে শুরু করুন,
      </SketchText>
      <SketchText x={430} y={336} size={9} body bold accent>
        আর প্রতিবার sshd -T দিয়ে আসল মানটা মিলিয়ে নিন।
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 6. বন্ধ Port এর Database পর্যন্ত একটা সুড়ঙ্গ                                     */
/* ------------------------------------------------------------------------- */

export function TunnelDiagram() {
  return (
    <Sketch
      label="Diagram: ssh -L, বাইরে না খুলেও ভেতরের Port এ পৌঁছানো"
      height={330}
      minWidth={860}
      viewBox="0 0 860 330"
      caption="Island Tours এর PostgreSQL শোনে শুধু Server এর ভেতরের ঠিকানা 127.0.0.1:5432 এ, বাইরে থেকে সরাসরি গেলে Connection refused। ssh -L আপনার Laptop এ একটা নতুন Port খোলে, 127.0.0.1:5433। সেখানে যা পাঠাবেন, SSH সেটা তালাবন্ধ পথে Server এ নিয়ে যায়, আর Server এর ভেতর থেকে 127.0.0.1:5432 এ পৌঁছে দেয়। Database এর কাছে মনে হয় Request এসেছে Server এর ভেতর থেকেই। Firewall এ একটা নতুন Port ও খুলতে হলো না।"
    >
      <Arrow id="ssh-tun-a" />
      <Arrow id="ssh-tun-m" muted />

      <SketchText x={430} y={28} size={10} bold accent>
        ssh -N -L 5433:127.0.0.1:5432 island
      </SketchText>

      <rect x={20} y={60} width={230} height={120} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.45} />
      <SketchText x={135} y={82} size={9.5} body bold>
        আপনার Laptop
      </SketchText>
      <Box x={40} y={96} w={190} h={34} text="pg_isready বা psql" size={9} />
      <SketchText x={135} y={152} size={8.5} body opacity={0.8}>
        শুনছে SSH নিজে:
      </SketchText>
      <SketchText x={135} y={168} size={9} bold accent>
        127.0.0.1:5433
      </SketchText>

      <rect x={262} y={98} width={326} height={40} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" strokeWidth="1.3" />
      <Padlock x={274} y={108} />
      <Padlock x={560} y={108} />
      <SketchText x={425} y={122} size={9} bold accent>
        SSH Channel, Port 22 দিয়ে
      </SketchText>

      <rect x={600} y={60} width={240} height={120} fill="var(--primary)" fillOpacity={0.05} stroke="var(--primary)" strokeOpacity={0.7} />
      <SketchText x={720} y={82} size={9.5} bold accent>
        island-vps-01
      </SketchText>
      <Box x={612} y={104} w={84} h={34} text="sshd" size={9} />
      <line x1={698} y1={121} x2={718} y2={121} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#ssh-tun-a)" />
      <Box x={722} y={98} w={110} h={48} text="PostgreSQL" sub="127.0.0.1:5432" accent />

      <path d="M135,182 C135,262 720,262 720,182" fill="none" stroke="currentColor" strokeOpacity={0.45} strokeDasharray="5 4" strokeWidth="1.3" markerEnd="url(#ssh-tun-m)" />
      <SketchText x={428} y={247} size={14} bold accent>
        ✕
      </SketchText>
      <SketchText x={428} y={284} size={9}>
        সরাসরি 103.94.135.2:5432: Connection refused
      </SketchText>
      <SketchText x={428} y={304} size={8.5} body opacity={0.8}>
        Port টা বাইরে খোলাই নেই, Firewall এও না, আর থাকা উচিতও না
      </SketchText>
    </Sketch>
  );
}
