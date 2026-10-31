/**
 * What: Module 07 Lesson 05, Environment Variables. What a process's environment is, how a child
 * gets a copy of it, PATH, which startup files each kind of shell reads, how a systemd service gets
 * its values, how bash, systemd, Node and Next.js read the same .env file differently, a fail fast
 * config module, NEXT_PUBLIC_ values frozen at build time, and the places a secret leaks.
 *
 * Why: "It works in my terminal but not as a service" and "the secret was in git" are two of the
 * most common server problems, and both come from not knowing where a value really lives. Every
 * output block in this lesson was captured on an Ubuntu 24.04 practice server (or Node 25 where
 * the lesson says so), and every lab script was run as written. Unit file anatomy belongs to
 * Lesson 02, file permissions to Lesson 04, and reading the journal in depth to Lesson 07.
 */
import Link from "next/link";
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  EnvFileDialectLab,
  ExportLab,
  PathLookupLab,
  StartContextLab,
} from "../../../components/course/topics/linux/env-animations";
import {
  EnvBuildVsRuntimeSplit,
  EnvInheritanceDiagram,
  EnvPathLookupDiagram,
  EnvSameCodeDiagram,
  EnvSecretLeaksDiagram,
} from "../../../components/course/topics/linux/env-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const linkClass = "text-primary underline underline-offset-4";

export const environmentVariablesContent: TopicData = {
  id: "environment-variables",
  introduction: {
    badge: "MODULE 07 · LESSON 05",
    title: <SectionTitle>Terminal এ চলে, Service এ চলে না: মানটা আসলে কোথায় থাকে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          রাত এগারোটা। আপনি my-tours এর API টা Practice Server এ তুলেছেন। Terminal এ{" "}
          <code>node server.mjs</code> চালালেন, সুন্দর চলল, Database এর সাথে কথাও বলল। এবার
          ঠিক করলেন এটাকে একটা systemd Service বানাবেন, যাতে Server চালু হলেই App নিজে চালু হয়।
          Service চালু করলেন, আর দুই সেকেন্ড পরে সে মরে গেল। Log এ একটাই লাইন:{" "}
          <code>DATABASE_URL is not set</code>।
        </ContentParagraph>
        <ContentParagraph>
          আপনি অবাক। মানটা তো আছে! এই তো, <code>echo $DATABASE_URL</code> লিখলেই Terminal দেখাচ্ছে।
          অথচ একই যন্ত্রে, একই Code, একই User এর Folder থেকে চালানো App বলছে সে মানটা কখনো
          দেখেনি। দুইজনের কেউই মিথ্যা বলছে না। মানটা আছে আপনার Shell এর কাছে, ~/.bashrc File
          থেকে পড়া। আর systemd কোনোদিন সেই File খোলে না।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন ঠিক এই রহস্যটা খোলে। শেষে আপনি জানবেন Environment জিনিসটা আসলে কী আর কোথায়
          থাকে, একটা Process তার Child কে কীভাবে মান দেয় আর কোনটা দেয় না, PATH কীভাবে ঠিক করে
          কোন Program চলবে, কোন পথে চালু হলে কোন File পড়া হয়, systemd এর Service তার মান কোথা
          থেকে পায়, একই <code>.env</code> File bash, systemd, Node আর Next.js কীভাবে চারভাবে
          পড়ে, App চালু হওয়ার মুহূর্তেই ভুল মান ধরার নিয়ম, Next.js এর <code>NEXT_PUBLIC_</code>{" "}
          মান কেন Build এর সময় জমে যায়, আর একটা Secret কোন কোন পথে চুপচাপ বেরিয়ে যায়। প্রতিটা
          কথার পাশে থাকবে আসল Ubuntu 24.04 Server এর আসল Output।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "রেসিপিতে লেখা থাকে এক চামচ লবণ। কোন দোকানের লবণ, কোন কৌটা থেকে, সেটা রেসিপিতে লেখা থাকে না। লবণটা দেয় যে রান্নাঘরে রান্না হচ্ছে। Code হলো রেসিপি। কোন Database, কোন Port, কোন চাবি, সেটা দেয় যে যন্ত্রে Code চলছে।",
      author: "Environment Variable",
      role: "Lesson 05",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-env",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Code একটাই, জায়গা অনেক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                my-tours এর API আপনার জীবনে অন্তত তিন জায়গায় চলবে। প্রথমে আপনার Laptop এ, যেখানে
                আপনি Code লিখছেন আর পরীক্ষা করছেন। তারপর লেসন ০১ এ বানানো Practice Server এ। আর
                একদিন সত্যিকারের একটা VPS এ, যেমন Island Tours এর <code>island-vps-01</code>। তিন
                জায়গাতেই Code হুবহু এক হওয়া উচিত, কারণ যে Code আপনি পরীক্ষা করেছেন, Production এ
                ঠিক সেটাই যাওয়া দরকার।
              </ContentParagraph>
              <ContentParagraph>
                অথচ তিন জায়গায় কিছু জিনিস আলাদা হতেই হবে। Laptop এর Database আর Server এর
                Database এক নয়। Laptop এ Port 3000 খালি থাকতে পারে, Server এ হয়তো অন্য কেউ বসে আছে।
                Laptop এ ভুল হলে বিস্তারিত Error দেখা ভালো, Production এ পর্যটককে সেটা দেখানো খারাপ।
                আর Session এর গোপন চাবি তিন জায়গায় তিনটা আলাদা হওয়াই নিরাপদ। এই যে জিনিসগুলো
                জায়গাভেদে বদলায় অথচ Code বদলায় না, এদের একসাথে বলে Configuration।
              </ContentParagraph>
              <ContentParagraph>
                প্রশ্ন হলো, Configuration টা Code এর কাছে পৌঁছাবে কীভাবে। তিনটা রাস্তা চোখে পড়ে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Code এর ভেতরেই লিখে রাখা।</strong> <code>if (hostname === ...)</code>{" "}
                  দিয়ে Laptop আর Server আলাদা করা। প্রতিটা নতুন জায়গার জন্য Code বদলাতে হয়, আর
                  Production এর Password চলে যায় Git এ, যেখানে দলের সবাই, আর হয়তো একদিন সারা
                  দুনিয়া, সেটা পড়তে পারে।
                </ListItem>
                <ListItem>
                  <strong>Repository তে একটা Config File।</strong> একটু ভালো, কিন্তু Secret এর
                  সমস্যাটা একই থাকে। File টা Git এ, তাই Password ও Git এ।
                </ListItem>
                <ListItem>
                  <strong>যে জায়গায় চলছে, সেই জায়গা মান দেবে।</strong> Code শুধু নাম ধরে জিজ্ঞেস
                  করবে, DATABASE_URL কত? আর যে যন্ত্রে চলছে সেই যন্ত্র উত্তর দেবে। এই উত্তর দেওয়ার
                  ব্যবস্থার নাম Environment Variable।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তৃতীয় রাস্তাটাই আজকের Web এর প্রায় সব Framework আর Platform মেনে চলে। The
                Twelve-Factor App নামের একটা পরিচিত নির্দেশিকা এই নিয়মটাকে এক লাইনে বলে: Config
                থাকবে Environment এ, Code এ নয়। Vercel, Docker, systemd, GitHub Actions, সবাই
                একই ভাষায় কথা বলে। তাই এই লেসনটা একবার ভালো করে বুঝলে পরের প্রতিটা Module এ কাজে
                লাগবে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <EnvSameCodeDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা নিয়ম, পুরো Course জুড়ে: কোনো Fallback মান নয়",
          content: (
            <p>
              অনেক Code এ এরকম লাইন দেখবেন: <code>process.env.PORT ?? 3000</code>। মানে PORT
              না থাকলে App ধরে নেয় 3000। শুনতে নিরীহ, কিন্তু এটা সবচেয়ে বিপজ্জনক অভ্যাসগুলোর একটা।
              Server এ কেউ মানটা বসাতে ভুলে গেলে App কোনো অভিযোগ না করে ভুল মান নিয়ে চলতে থাকে,
              আর সবকিছু সফল দেখায়। এই Course এ নিয়ম হলো: মান না থাকলে App চালুই হবে না, পরিষ্কার
              একটা বার্তা দিয়ে থামবে। সেকশন ০১০ এ এর পুরো Code দেখবেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "what-is-env",
      subHeader: { index: "002", title: "What Is an Environment" },
      title: <SectionTitle>প্রতিটা Process এর সাথে একটা ছোট তালিকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 01 এ দেখেছিলেন, একটা Program চালালে Operating System তার জন্য একটা Process
                বানায়, যার নিজের Memory, নিজের PID, নিজের খোলা File এর তালিকা থাকে। ঠিক এরকমই আরেকটা
                জিনিস প্রতিটা Process জন্ম থেকে সাথে নিয়ে আসে: একটা ছোট তালিকা, যার প্রতিটা লাইন{" "}
                <code>NAME=value</code> আকারের। এই তালিকাটাই সেই Process এর Environment, আর তালিকার
                প্রতিটা লাইন একটা Environment Variable।
              </ContentParagraph>
              <ContentParagraph>
                দুইটা জিনিস শুরুতেই মনে রাখুন। প্রথমত, নাম আর মান দুইটাই সবসময় লেখা, মানে Text।
                <code>PORT=3000</code> এর 3000 কোনো সংখ্যা নয়, তিনটা অক্ষর 3, 0, 0, 0। সংখ্যা বানাতে
                হলে Program কে নিজে বদলে নিতে হয়। দ্বিতীয়ত, নামগুলো রীতি অনুযায়ী বড় হাতের অক্ষরে,
                শব্দের মাঝে Underscore: <code>DATABASE_URL</code>, <code>SESSION_SECRET</code>।
                Linux বড় আর ছোট হাতের অক্ষর আলাদা ধরে, তাই <code>port</code> আর <code>PORT</code>{" "}
                দুইটা আলাদা নাম।
              </ContentParagraph>
              <ContentParagraph>
                নিজের তালিকাটা দেখতে তিনটা Command লাগে। <code>printenv</code> পুরো তালিকা দেখায়,{" "}
                <code>printenv HOME</code> শুধু একটা নামের মান দেখায়, আর <code>{"echo \"$HOME\""}</code>{" "}
                একই কাজ করে Shell এর মাধ্যমে। নিচের Output টা Practice Server এর, deploy User হিসেবে
                SSH দিয়ে Login করার ঠিক পরে। এখানে Server এর ভেতর থেকেই নিজেকে{" "}
                <code>ssh localhost</code> করা হয়েছিল, তাই SSH এর লাইনে <code>::1</code> দেখছেন।
                আপনার Laptop থেকে ঢুকলে সেখানে থাকবে আপনার বাসার Public IP, যেমন Module 05 এর{" "}
                <code>203.0.113.25</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "printenv-after-login.txt",
          code: `deploy@island-vps-01:~$ ssh localhost
...
deploy@island-vps-01:~$ printenv | sort
HOME=/home/deploy
LANG=C.UTF-8
LESSCLOSE=/usr/bin/lesspipe %s %s
LESSOPEN=| /usr/bin/lesspipe %s
LOGNAME=deploy
LS_COLORS=
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
PWD=/home/deploy
SHELL=/bin/bash
SHLVL=1
SSH_CLIENT=::1 43700 22
SSH_CONNECTION=::1 43700 ::1 22
SSH_TTY=/dev/pts/0
USER=deploy
_=/usr/bin/printenv`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তালিকাটা ছোট, আর প্রায় প্রতিটা লাইনের একটা কাজ আছে। যেগুলো রোজ কাজে লাগবে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>HOME</code>, <code>USER</code>, <code>LOGNAME</code>: আপনি কে আর আপনার নিজের
                  Folder কোথায়। <code>~</code> চিহ্নটা আসলে HOME এর মান।
                </ListItem>
                <ListItem>
                  <code>SHELL</code>: Login এর পর কোন Shell চালু হয়, এখানে bash।
                </ListItem>
                <ListItem>
                  <code>PATH</code>: Command খোঁজার Folder এর তালিকা। সেকশন ০০৫ পুরোটা এর জন্য।
                </ListItem>
                <ListItem>
                  <code>LANG</code>: ভাষা আর অক্ষরের নিয়ম। <code>C.UTF-8</code> মানে UTF-8, তাই
                  বাংলা লেখাও ঠিকঠাক দেখায়।
                </ListItem>
                <ListItem>
                  <code>PWD</code>: এই মুহূর্তে কোন Folder এ আছেন। <code>SHLVL</code>: কতগুলো Shell
                  একটার ভেতরে আরেকটা চলছে।
                </ListItem>
                <ListItem>
                  <code>SSH_CLIENT</code>, <code>SSH_CONNECTION</code>, <code>SSH_TTY</code>: কোথা
                  থেকে, কোন Port দিয়ে ঢুকেছেন। Module 05 এর চার সংখ্যার পরিচয়টা এখানে আবার দেখছেন:
                  ওপাশের IP আর Port, এপাশের IP আর Port 22।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                প্রতিটা চলমান Process এর তালিকা Linux একটা File এর মতো করে দেখায়:{" "}
                <code>/proc/&lt;PID&gt;/environ</code>। লাইনগুলো সেখানে NUL অক্ষর দিয়ে আলাদা থাকে,
                তাই <code>tr</code> দিয়ে নতুন লাইনে বদলে পড়তে হয়। <code>$$</code> মানে এই Shell এর
                নিজের PID। একটা সূক্ষ্ম কথা: এই File দেখায় Process চালু হওয়ার মুহূর্তে যে তালিকা
                দেওয়া হয়েছিল সেটা। পরে Shell নিজে কিছু export করলে সেটা এখানে আসে না, কিন্তু তার
                Child দের কাছে ঠিকই যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "one-name-at-a-time.txt",
          code: `deploy@island-vps-01:~$ printenv HOME
/home/deploy
deploy@island-vps-01:~$ echo "$USER uses $SHELL"
deploy uses /bin/bash
deploy@island-vps-01:~$ echo "$PATH" | tr ":" "\\n"
/usr/local/sbin
/usr/local/bin
/usr/sbin
/usr/bin
/sbin
/bin
/usr/games
/usr/local/games
/snap/bin
deploy@island-vps-01:~$ printenv NO_SUCH_NAME; echo "exit code: $?"
exit code: 1
deploy@island-vps-01:~$ tr "\\0" "\\n" < /proc/$$/environ | sort | head -4
HOME=/home/deploy
LANG=C.UTF-8
LOGNAME=deploy
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "printenv বনাম echo",
          content: (
            <p>
              <code>printenv NAME</code> শুধু Environment এর তালিকায় খোঁজে, না পেলে কিছুই ছাপে না আর
              Exit Code দেয় 1। তাই Script এ পরীক্ষা করতে এটাই ভালো। <code>{"echo \"$NAME\""}</code> Shell
              এর নিজের খাতাতেও খোঁজে, যেখানে export না করা Variable ও থাকে। পরের সেকশনে দেখবেন এই
              দুইটা খাতা কেন আলাদা, আর সেই তফাতটাই কেন এত গুরুত্বপূর্ণ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "inheritance",
      subHeader: { index: "003", title: "Inheritance" },
      title: <SectionTitle>Parent থেকে Child: একটা কপি, শুধু একদিকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 01 এর How a Program Runs লেসনে দেখেছিলেন, একটা Process আরেকটা Process চালু
                করে নিজের একটা নকল বানিয়ে (fork), তারপর সেই নকলের ভেতরে নতুন Program বসিয়ে (exec)।
                আপনি Terminal এ <code>node server.mjs</code> লিখলে bash ঠিক এটাই করে। আর এই কাজের
                মাঝে একটা জিনিস হাতবদল হয়: bash এর Environment এর একটা কপি নতুন Process এর হাতে
                যায়। এটাই Environment এর পুরো রহস্যের চাবি। মান নিজে নিজে কোথাও ভেসে বেড়ায় না, প্রতিটা
                Process তার মান পায় শুধু তার Parent এর কাছ থেকে, জন্মের মুহূর্তে।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু bash এর কাছে আসলে দুইটা খাতা। একটায় থাকে সাধারণ Shell Variable, যেগুলো শুধু
                bash নিজে ব্যবহার করে। আরেকটায় থাকে Environment, যেটার কপি প্রতিটা Child পায়।{" "}
                <code>PORT=3000</code> লিখলে মানটা যায় প্রথম খাতায়। <code>export PORT</code> লিখলে
                মানটা দ্বিতীয় খাতায় ওঠে। আর <code>export PORT=3000</code> একসাথে দুইটা কাজই করে।
                কোন নামগুলো export করা আছে, দেখতে চাইলে <code>export -p</code>।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Script টা Practice Server এ চালানো হয়েছিল। প্রতিটা ধাপে একটা ছোট node Process
                চালু হয়ে শুধু বলে সে PORT এর কী মান দেখছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "1-inherit.sh, Output",
          code: `deploy@island-vps-01:~$ bash 1-inherit.sh
1. export এর আগে, child দেখে PORT = undefined
2. export এর পরে, child দেখে PORT = 3000
3. Parent এ এখন PORT = 4000
   চলমান Child এর নিজের কপি: PORT=3000
4. Child নিজে বদলাল, তার কাছে PORT = 9999
5. Parent এ ফিরে PORT = 4000
6. unset এর পরে, child দেখে PORT = undefined`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <EnvInheritanceDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Output থেকে তিনটা নিয়ম বেরিয়ে আসে, আর এই তিনটা মুখস্থ থাকলে Environment এর প্রায় সব
                ধাঁধা নিজেই খুলতে পারবেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>শুধু export করা নাম কপি হয়।</strong> প্রথম লাইনে PORT ছিল, কিন্তু শুধু
                  Shell এর খাতায়, তাই node দেখেছে undefined।
                </ListItem>
                <ListItem>
                  <strong>কপি হয় একবারই, জন্মের সময়।</strong> Child চালু হওয়ার পরে Parent এ মান
                  বদলালে চলমান Child সেটা জানতে পারে না। নতুন মান পেতে Child কে নতুন করে চালু করতে
                  হয়। এই কারণেই পরে দেখবেন, Environment File বদলানোর পর Service Restart করতে হয়।
                </ListItem>
                <ListItem>
                  <strong>Child এর বদল কখনো Parent এ ফেরে না।</strong> ভেতরের bash PORT=9999 করল,
                  বাইরের bash এ ফিরে দেখা গেল সেই 4000ই আছে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ExportLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তৃতীয় নিয়মের একটা মজার ফল আছে। ধরুন একটা Script লিখলেন যার কাজ PORT বসানো। সেটা{" "}
              <code>bash set-port.sh</code> দিয়ে চালালে নতুন একটা bash Child জন্মায়, PORT বসায়, আর
              মরে যায়। আপনার Shell এ কিছুই বদলায় না। মান আপনার নিজের Shell এ আনতে হলে Script টা
              Child হিসেবে নয়, নিজের Shell এর ভেতরেই চালাতে হয়, আর সেই কাজের Command হলো{" "}
              <code>source</code>, বা তার ছোট রূপ একটা বিন্দু <code>.</code>।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "bash-vs-source.txt",
          code: `deploy@island-vps-01:~$ cat set-port.sh
export PORT=3000
echo "inside the script: PORT=$PORT"
deploy@island-vps-01:~$ bash set-port.sh
inside the script: PORT=3000
deploy@island-vps-01:~$ echo "after: PORT=$PORT"
after: PORT=
deploy@island-vps-01:~$ source set-port.sh
inside the script: PORT=3000
deploy@island-vps-01:~$ echo "after: PORT=$PORT"
after: PORT=3000
deploy@island-vps-01:~$ export -p | tail -3
declare -x PORT="3000"
declare -x PWD="/home/deploy"
declare -x SHLVL="1"`,
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "one-command",
      subHeader: { index: "004", title: "One Command Only" },
      title: <SectionTitle>শুধু একটা Command এর জন্য মান, খালি Environment, আর sudo এর চালাকি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সবসময় export করে Shell ভরিয়ে ফেলার দরকার নেই। Command এর ঠিক আগে{" "}
                <code>NAME=value</code> লিখলে মানটা শুধু ওই একটা Command এর Environment এ যায়, আপনার
                Shell এ থাকে না। পরীক্ষার সময় এটা খুব কাজের: <code>PORT=3001 node server.mjs</code>{" "}
                দিয়ে একবার অন্য Port এ চালিয়ে দেখলেন, কিছু নোংরা হলো না।
              </ContentParagraph>
              <ContentParagraph>
                উল্টো দিকে, <code>env -i</code> একটা Command কে একদম খালি Environment দিয়ে চালায়।
                এটা আপনার App এর জন্য একটা চমৎকার পরীক্ষা: কিছুই না দিলে App কী বলে? ভালো App পরিষ্কার
                ভাষায় বলবে কী কী নেই। খারাপ App চুপচাপ ভুল মান নিয়ে চলবে। খেয়াল করুন, খালি
                Environment এ PATH ও নেই, তাই Program এর পুরো ঠিকানা লিখতে হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "one-command-and-empty.txt",
          code: `deploy@island-vps-01:~$ PORT=3000 node -e 'console.log(process.env.PORT)'
3000
deploy@island-vps-01:~$ node -e 'console.log(process.env.PORT)'
undefined
deploy@island-vps-01:~$ env -i /usr/bin/node -e 'console.log(Object.keys(process.env).length, process.env.PATH)'
0 undefined
deploy@island-vps-01:~$ env -i PORT=3000 /usr/bin/printenv
PORT=3000`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার Server এ রোজকার একটা ফাঁদ। আপনি deploy হিসেবে DATABASE_URL export করলেন, তারপর
                কোনো কাজ <code>sudo</code> দিয়ে চালালেন। sudo মানটা দেখতে পায় না। কারণটা নিরাপত্তা:
                sudo একটা Program কে root এর ক্ষমতা দেয়, আর আপনার Environment এ কী আছে তা ভরসা করে
                root এর হাতে তুলে দিলে কেউ চালাকি করে root এর Program এর আচরণ বদলে দিতে পারত। তাই
                Ubuntu এর <code>/etc/sudoers</code> এ দুইটা লাইন আছে: <code>env_reset</code> মানে
                sudo নতুন একটা ছোট Environment দিয়ে শুরু করে, আর <code>secure_path</code> মানে PATH
                হবে এই নির্দিষ্ট তালিকা, আপনার নিজেরটা নয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "sudo-and-environment.txt",
          code: `deploy@island-vps-01:~$ export DATABASE_URL="postgres://placeholder"
deploy@island-vps-01:~$ sudo printenv DATABASE_URL; echo "exit=$?"
exit=1
deploy@island-vps-01:~$ sudo -E printenv DATABASE_URL
postgres://placeholder
deploy@island-vps-01:~$ sudo DATABASE_URL="$DATABASE_URL" printenv DATABASE_URL
postgres://placeholder
deploy@island-vps-01:~$ sudo grep -E "env_reset|secure_path" /etc/sudoers
Defaults	env_reset
Defaults	secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin"
deploy@island-vps-01:~$ sudo printenv PATH
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লেখার ধরন", "কী হয়", "কখন ব্যবহার করবেন"],
          rows: [
            [<code key="a">sudo cmd</code>, "ছোট নতুন Environment, PATH হয় secure_path", "প্রায় সবসময়, এটাই Default"],
            [<code key="a">sudo NAME=value cmd</code>, "শুধু এই একটা নাম পার করে দেয়", "যখন root এর Command এর একটা নির্দিষ্ট মান লাগবে"],
            [<code key="a">sudo -E cmd</code>, "আপনার পুরো Environment root এর হাতে", "খুব কম। দরকারি একটা মানের জন্য সব Secret পার করে দেওয়ার মানে নেই"],
            [<code key="a">sudo -u mytours cmd</code>, "অন্য User হিসেবে চালায়, তারও ছোট Environment", "App এর User হিসেবে কিছু পরীক্ষা করতে, সেকশন ০০৭ এ দেখবেন"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "sudo: node: command not found",
          content: (
            <p>
              nvm এর মতো Tool দিয়ে Node বসালে সেটা থাকে আপনার Home Folder এর ভেতরে, আর Login Shell এর
              PATH এ সেই Folder যোগ হয়। sudo সেই PATH নেয় না, নেয় secure_path, যেখানে আপনার Home নেই।
              তাই <code>node</code> চলে, <code>sudo node</code> চলে না। সমাধান sudo -E নয়। সমাধান হলো
              Server এ Node বসানো সবার জন্য একটা জানা জায়গায়, যেমন <code>/usr/bin</code>, যেটা লেসন
              ১১ এ করবেন, অথবা সরাসরি পুরো ঠিকানা লেখা।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "path",
      subHeader: { index: "005", title: "PATH" },
      title: <SectionTitle>PATH: Shell কীভাবে ঠিক করে কোন Program চলবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Terminal এ <code>node</code> লিখলে bash জানে না node কোথায় আছে। Disk এ হাজার হাজার
                File, সবগুলো ঘেঁটে দেখা অসম্ভব। তাই bash শুধু কয়েকটা Folder দেখে, আর সেই Folder এর
                তালিকাটাই PATH নামের Environment Variable। তালিকার Folder গুলো কোলন দিয়ে আলাদা।
              </ContentParagraph>
              <ContentParagraph>
                খোঁজার নিয়ম তিনটা। bash বাম থেকে ডানে যায়। প্রতিটা Folder এ দেখে ওই নামের এমন একটা
                File আছে কি না যেটা Execute করা যায়। আর প্রথম যেখানে পায়, সেখানেই থামে। পরের Folder
                গুলো দেখাই হয় না। কোথাও না পেলে আসে পরিচিত সেই লাইন, <code>command not found</code>।
                Command এ একটা <code>/</code> থাকলে, যেমন <code>./server.mjs</code> বা{" "}
                <code>/usr/bin/node</code>, PATH এর খোঁজ হয়ই না, bash সরাসরি ওই ঠিকানায় যায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <EnvPathLookupDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কোন Program আসলে চলবে, আগে থেকে জানার তিনটা Command।{" "}
              <code>type -a node</code> সবচেয়ে বিশ্বাসযোগ্য: PATH এ যতগুলো node আছে সব দেখায়, প্রথমটা
              চলবে। <code>command -v node</code> শুধু প্রথমটা দেখায়, Script এ পরীক্ষার জন্য ভালো।{" "}
              <code>which</code> ও কাজ করে, তবে সে bash এর নিজের Builtin আর Alias জানে না। নিচের
              Output টা লেসনের Lab এর ২ নম্বর Script এর, একটা নতুন Practice Server এ চালানো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "2-path.sh, Output",
          code: `deploy@island-vps-01:~$ bash 2-path.sh
--- ১. File আছে, কিন্তু PATH এ নেই, আর Execute Permission ও নেই
2-path.sh: line 9: hello: command not found
--- ২. পুরো ঠিকানা দিলে PATH লাগেই না
hello, from ~/bin
--- ৩. ~/bin কে PATH এর সামনে বসাই
hello, from ~/bin
hello is /home/deploy/bin/hello
--- ৪. একই নামে আরেকটা Command, /usr/local/bin এ
hello is /home/deploy/bin/hello
hello is /usr/local/bin/hello
hello, from ~/bin
--- ৫. ~/bin কে PATH এর শেষে সরাই
hello, from /usr/local/bin
--- ৬. node আসলে কোনটা চলছে
node is /usr/bin/node
node is /bin/node
v18.19.1`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Output টা ধাপে ধাপে পড়ুন। প্রথমে File টা ছিল, কিন্তু তার Folder PATH এ ছিল না, তাই
                command not found। পুরো ঠিকানা দিতেই চলল, কারণ তখন PATH লাগেই না। ~/bin কে PATH এর
                সামনে বসাতেই নাম দিয়েও চলল। তারপর <code>/usr/local/bin</code> এ একই নামের আরেকটা
                এল, <code>type -a</code> দুইটাই দেখাল, কিন্তু চলল সামনেরটা। আর ~/bin কে পেছনে সরাতেই
                অন্যটা চলতে শুরু করল। একই নাম, একই File, শুধু ক্রম বদলে ভিন্ন Program। মাঝখানের{" "}
                <code>hash -r</code> bash কে বলে আগের খোঁজের ফল ভুলে যেতে, কারণ bash একবার পাওয়া
                ঠিকানা মনে রাখে।
              </ContentParagraph>
              <ContentParagraph>
                শেষ লাইনে node এর দুইটা ঠিকানা দেখে অবাক হবেন না। Ubuntu তে <code>/bin</code> আসলে{" "}
                <code>/usr/bin</code> এর দিকে তাক করা একটা Link, লেসন ০১ এর মানচিত্রে এটা দেখেছেন।
                তাই একই File দুই নামে দেখা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PathLookupLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিজের Folder PATH এ যোগ করার নিয়মটা হলো পুরনো মান রেখে নতুনটা জোড়া:{" "}
                <code>{"export PATH=\"$HOME/bin:$PATH\""}</code> মানে আপনার Folder সবার আগে, আর{" "}
                <code>{"export PATH=\"$PATH:$HOME/bin\""}</code> মানে সবার পরে। কখনো{" "}
                <code>{"export PATH=\"$HOME/bin\""}</code> লিখবেন না, তাহলে বাকি সব Folder হারিয়ে যায় আর{" "}
                <code>ls</code> পর্যন্ত চলে না। এই বদল Terminal বন্ধ করলেই হারায়। স্থায়ী করতে হলে
                লাইনটা রাখুন ~/.profile এ, কোনটা কখন পড়া হয় সেটা পরের সেকশনে। Ubuntu এর ~/.profile
                অবশ্য নিজেই ~/bin আর ~/.local/bin যোগ করে দেয়, যদি Login এর সময় Folder গুলো থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "PATH এর সামনে কখনো এমন Folder নয়, যেখানে অন্য কেউ লিখতে পারে",
          content: (
            <p>
              কেউ যদি PATH এর সামনে <code>.</code> (মানে এই মুহূর্তের Folder) বা <code>/tmp</code> এর
              মতো সবার লেখার Folder রাখে, তাহলে অন্য একজন সেখানে <code>ls</code> নামের একটা নকল
              Script ফেলে রাখলেই আপনার পরের ls আসলে তার Code চালাবে, আপনার ক্ষমতা নিয়ে। PATH এর
              প্রতিটা Folder এমন হওয়া চাই যেখানে শুধু আপনি বা root লিখতে পারেন। কে কোথায় লিখতে পারে,
              সেটা লেসন ০৪ এর বিষয়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "startup-files",
      subHeader: { index: "006", title: "Startup Files" },
      title: <SectionTitle>~/.bashrc, ~/.profile, /etc/environment: কে কখন পড়ে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ export করেছেন হাতে, Terminal বন্ধ হলেই সব গেল। স্থায়ী মান রাখার জায়গা কয়েকটা
                File, যেগুলো Shell চালু হওয়ার সময় পড়ে। সমস্যা হলো সব Shell সব File পড়ে না। কোনটা
                পড়বে, সেটা নির্ভর করে Shell টা কীভাবে চালু হলো তার উপর। দুইটা প্রশ্ন দিয়ে সেটা ঠিক হয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Login Shell কি না।</strong> আপনি পরিচয় দিয়ে ঢুকলেন কি না, যেমন SSH দিয়ে
                  Login, বা <code>su - deploy</code>। Login Shell পড়ে <code>/etc/profile</code>{" "}
                  (যেটা আবার <code>/etc/profile.d/*.sh</code> পড়ে) আর তারপর <code>~/.profile</code>।
                </ListItem>
                <ListItem>
                  <strong>Interactive কি না।</strong> একজন মানুষ Prompt এ বসে টাইপ করছে কি না। Login
                  নয় এমন Interactive Shell, যেমন Login এর পরে আবার <code>bash</code> লিখলেন, পড়ে
                  শুধু <code>~/.bashrc</code>। আর একটা Script বা <code>bash -c</code> Interactive ও
                  নয়, Login ও নয়, সে কোনো File ই পড়ে না, শুধু Parent এর কপি পায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এর বাইরে আরেকটা File আছে যেটা Shell এর নয়: <code>/etc/environment</code>। এটা পড়ে
                Linux এর Login ব্যবস্থা, যার নাম PAM, তাই SSH, su, sudo আর Cron, সবাই এটা পায়। কিন্তু
                এটা কোনো Script নয়। এখানে শুধু <code>NAME=value</code> লাইন চলে, <code>export</code>{" "}
                লেখা যায় না, আর <code>$HOME</code> এর মতো অন্য নামের মান টেনে আনা যায় না।
              </ContentParagraph>
              <ContentParagraph>
                আর সবচেয়ে বড় ফাঁদটা Ubuntu এর ~/.bashrc এর একদম শুরুতে, এই কয়েকটা লাইনে। এদের এই
                লেসনে বলব পাহারা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "~/.bashrc, প্রথম কয়েক লাইন (Ubuntu 24.04)",
          code: `# ~/.bashrc: executed by bash(1) for non-login shells.
# see /usr/share/doc/bash/examples/startup-files (in the package bash-doc)
# for examples

# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পাহারার কাজ একটাই: Shell টা Interactive না হলে bash এখানেই File থেকে ফিরে যায়, নিচের কিছু পড়ে না। তাহলে ~/.bashrc
              এর নিচের দিকে লেখা একটা export কোন কোন পথে পৌঁছায়? অনুমান না করে মেপে দেখা হয়েছে। ছয়টা
              জায়গায় ছয়টা আলাদা চিহ্ন বসানো হলো: /etc/environment, /etc/profile.d, ~/.profile, ~/.bashrc
              এর পাহারার আগে আর পরে। তারপর প্রতিটা পথে একটা Process চালিয়ে দেখা হলো কোন চিহ্ন তার
              কাছে পৌঁছেছে। এটাই Lab এর ৩ নম্বর Script, আর এটাই তার আসল Output।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "3-startup-files.sh, Output",
          code: `deploy@island-vps-01:~$ bash 3-startup-files.sh
bash -c:          (কিছুই না)
bash -ic:         FROM_BASHRC_TOP FROM_BASHRC_BOTTOM
bash -lc:         FROM_PROFILE_D FROM_PROFILE FROM_BASHRC_TOP
ssh command:      FROM_ETC_ENVIRONMENT FROM_BASHRC_TOP

এবার নিজে একবার ssh localhost দিয়ে ঢুকে show-markers login চালান, তারপর exit।
deploy@island-vps-01:~$ ssh localhost
deploy@island-vps-01:~$ show-markers login
login:            FROM_ETC_ENVIRONMENT FROM_PROFILE_D FROM_PROFILE FROM_BASHRC_TOP FROM_BASHRC_BOTTOM
deploy@island-vps-01:~$ exit

# একই ছয়টা চিহ্ন, আরও তিনটা পথে (একই Server এ আগের একটা পরীক্ষা):
root@island-vps-01:~# su - deploy -c "show-markers su-dash"
su-dash: FROM_ETC_ENVIRONMENT FROM_PROFILE_D FROM_PROFILE FROM_BASHRC_TOP
# deploy এর crontab এ: * * * * * /usr/local/bin/show-markers cron >> /tmp/cron-markers.txt 2>&1
deploy@island-vps-01:~$ cat /tmp/cron-markers.txt
cron: FROM_ETC_ENVIRONMENT
# একটা systemd Service, User=deploy, ExecStart=/usr/local/bin/show-markers systemd
deploy@island-vps-01:~$ sudo journalctl -u show-markers -o cat | grep systemd:
systemd: (none)`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <StartContextLab /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কীভাবে চালু হলো", "/etc/environment", "/etc/profile.d আর ~/.profile", "~/.bashrc পাহারার আগে", "~/.bashrc পাহারার পরে"],
          rows: [
            ["SSH দিয়ে Login", "হ্যাঁ", "হ্যাঁ", "হ্যাঁ", "হ্যাঁ"],
            ["Login এর ভেতরে নতুন bash", "না, কপি পায়", "না, কপি পায়", "হ্যাঁ", "হ্যাঁ"],
            [<code key="a">{"ssh island 'command'"}</code>, "হ্যাঁ", "না", "হ্যাঁ", "না"],
            [<code key="a">{"su - deploy -c '...'"}</code>, "হ্যাঁ", "হ্যাঁ", "হ্যাঁ", "না"],
            ["Script বা bash -c", "না", "না", "না", "না"],
            ["Cron Job", "হ্যাঁ", "না", "না", "না"],
            ["systemd Service", "না", "না", "না", "না"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                টেবিলটার শেষ দুইটা লাইন মন দিয়ে দেখুন, কারণ ভূমিকার সেই রাতের রহস্যের উত্তর ওখানেই।
                আপনি DATABASE_URL লিখেছিলেন ~/.bashrc এ। আপনার SSH Login সেটা পড়ল, তাই Terminal এ সব
                ঠিক। systemd Service কোনো Shell ই চালায় না, তাই কোনো File ই পড়ে না। এমনকি /etc/environment
                ও না। এই তালিকা থেকে চারটা অভ্যাস দাঁড়ায়:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>~/.bashrc</strong> শুধু মানুষের আরামের জন্য: Alias, Prompt এর রং, History এর
                  Setting।
                </ListItem>
                <ListItem>
                  <strong>~/.profile</strong> নিজের PATH বদলের জন্য, কারণ Login এ একবার পড়া হয় আর
                  সব Child কপি পায়।
                </ListItem>
                <ListItem>
                  <strong>/etc/environment</strong> খুব কম, যন্ত্রের সবার জন্য একই রকম নিরীহ মান। কোনো
                  Secret কখনো নয়, কারণ এই File সবাই পড়তে পারে।
                </ListItem>
                <ListItem>
                  <strong>App এর মান এদের কোনোটাতেই নয়।</strong> App যেভাবে চালু হয়, মান যাবে ঠিক
                  সেই পথে: Service হলে Unit এর EnvironmentFile এ, পরের সেকশনে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "systemd-env",
      subHeader: { index: "007", title: "systemd Services" },
      title: <SectionTitle>systemd Service এর মান: Environment আর EnvironmentFile</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লেসন ০২ এ দেখেছেন, Server চালু হলে systemd, যার PID 1, প্রতিটা Service কে নিজে চালু
                করে। মাঝে কোনো Login নেই, কোনো Shell নেই। তাহলে Service তার Environment পায় কোথা থেকে?
                তিন জায়গা থেকে। systemd নিজে একটা ছোট তালিকা দেয়। Unit File এর{" "}
                <code>Environment=</code> লাইনগুলো যোগ হয়। আর <code>EnvironmentFile=</code> এ
                দেওয়া File থেকে বাকিগুলো আসে। এর বাইরে কিছুই না।
              </ContentParagraph>
              <ContentParagraph>
                systemd নিজে কী দেয়, দেখতে একটা ছোট Service বানানো হয়েছিল, যে শুধু নিজের Environment
                ছেপে বেরিয়ে যায়, User=deploy হিসেবে। এটা তার Journal থেকে নেওয়া। দুইটা লাইন বাদ দেওয়া
                হয়েছে, <code>MEMORY_PRESSURE_WATCH</code> আর <code>MEMORY_PRESSURE_WRITE</code>, যারা
                এই Practice Server এর ভেতরের একটা লম্বা ঠিকানা দেখায় আর আমাদের কাজে লাগে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "a-service-environment.txt",
          code: `deploy@island-vps-01:~$ sudo journalctl -u show-markers -o cat
HOME=/home/deploy
INVOCATION_ID=a617894613664669a592e39df3cd4c2c
JOURNAL_STREAM=8:2290859
LANG=C.UTF-8
LOGNAME=deploy
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin
PWD=/
SHELL=/bin/bash
SHLVL=1
SYSTEMD_EXEC_PID=563
USER=deploy
_=/usr/bin/env`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                খেয়াল করুন PATH: Login Shell এর চেয়ে ছোট, শুধু চারটা Folder। আর আপনার ~/.bashrc এর
                কিছুই নেই। এবার ভূমিকার গল্পটা আসল যন্ত্রে ঘটাই। my-tours API এর জন্য একটা Unit File,
                যার Environment সংক্রান্ত দুইটা লাইন এই লেসনের বিষয়। বাকি প্রতিটা লাইনের মানে লেসন ০২
                এ আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "ini",
          filename: "/etc/systemd/system/my-tours-api.service",
          code: `[Unit]
Description=my-tours API
After=network.target

[Service]
User=mytours
Group=mytours
WorkingDirectory=/srv/my-tours
Environment=NODE_ENV=production
EnvironmentFile=/etc/my-tours/api.env
ExecStart=/usr/bin/node /srv/my-tours/server.mjs
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>Environment=NODE_ENV=production</code> একটা মান সরাসরি Unit File এ বসায়।{" "}
                <code>EnvironmentFile=/etc/my-tours/api.env</code> systemd কে বলে, এই File এর প্রতিটা লাইন পড়ে
                মান হিসেবে বসাতে। File টায় ইচ্ছা করে DATABASE_URL রাখা হয়নি। Service চালু করে Journal
                দেখলে এটা পাওয়া যায়:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "journalctl -u my-tours-api",
          code: `deploy@island-vps-01:~$ sudo journalctl -u my-tours-api -o short-iso
2026-10-31T07:28:32+00:00 island-vps-01 systemd[1]: Started my-tours-api.service - my-tours API.
2026-10-31T07:28:33+00:00 island-vps-01 node[688]: my-tours-api cannot start, the configuration is wrong:
2026-10-31T07:28:33+00:00 island-vps-01 node[688]:   - DATABASE_URL is not set
2026-10-31T07:28:33+00:00 island-vps-01 systemd[1]: my-tours-api.service: Main process exited, code=exited, status=1/FAILURE
2026-10-31T07:28:33+00:00 island-vps-01 systemd[1]: my-tours-api.service: Failed with result 'exit-code'.
2026-10-31T07:28:39+00:00 island-vps-01 systemd[1]: my-tours-api.service: Scheduled restart job, restart counter is at 1.
2026-10-31T07:28:39+00:00 island-vps-01 systemd[1]: Started my-tours-api.service - my-tours API.
2026-10-31T07:28:40+00:00 island-vps-01 node[703]: my-tours-api cannot start, the configuration is wrong:
2026-10-31T07:28:40+00:00 island-vps-01 node[703]:   - DATABASE_URL is not set
2026-10-31T07:28:40+00:00 island-vps-01 systemd[1]: my-tours-api.service: Main process exited, code=exited, status=1/FAILURE
2026-10-31T07:28:40+00:00 island-vps-01 systemd[1]: my-tours-api.service: Failed with result 'exit-code'.`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                App ঠিক কী নেই সেটা নাম ধরে বলল, তারপর থামল। systemd দেখল App Exit Code 1 দিয়ে বেরিয়েছে,
                পাঁচ সেকেন্ড অপেক্ষা করে আবার চেষ্টা করল, আবার একই। এই লুপের পুরো ব্যাখ্যা লেসন ০২ আর
                ০৭ এ। এখন File এ হারানো লাইনটা যোগ করে Restart করলে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "systemctl status my-tours-api",
          code: `deploy@island-vps-01:~$ echo 'DATABASE_URL=postgresql://mytours@127.0.0.1:5432/mytours' | sudo tee -a /etc/my-tours/api.env > /dev/null
deploy@island-vps-01:~$ sudo systemctl restart my-tours-api
deploy@island-vps-01:~$ sudo systemctl status my-tours-api
● my-tours-api.service - my-tours API
     Loaded: loaded (/etc/systemd/system/my-tours-api.service; disabled; preset: enabled)
     Active: active (running) since Sat 2026-10-31 07:29:02 UTC; 2s ago
   Main PID: 766 (node)
      Tasks: 11 (limit: 7039)
     Memory: 14.6M (peak: 14.8M)
        CPU: 638ms
     (CGroup এর দুইটা লাইন এখানে বাদ দেওয়া হয়েছে)

Oct 31 07:29:02 island-vps-01 systemd[1]: Started my-tours-api.service - my-tours API.
Oct 31 07:29:03 island-vps-01 node[766]: my-tours-api listening on 127.0.0.1:3000 (production)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার তিনটা প্রশ্ন, যেগুলোর উত্তর না জানলে Production এ বিপদ হতে পারে। Environment File
                টা কে পড়তে পারে, Unit File টা কে পড়তে পারে, আর চলমান Process এর মান কে দেখতে পারে।
                নিচে <code>mytours</code> হলো App এর নিজের User, আর <code>ubuntu</code> হলো যন্ত্রের
                আরেকজন সাধারণ User।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "who-can-see-what.txt",
          code: `deploy@island-vps-01:~$ sudo ls -l /etc/my-tours/api.env
-rw------- 1 root root 201 Oct 31 07:35 /etc/my-tours/api.env
deploy@island-vps-01:~$ curl -s 127.0.0.1:3000; echo
{"ok":true,"env":"production"}

# ১. App এর নিজের User কি File টা খুলতে পারে?
deploy@island-vps-01:~$ sudo -u mytours cat /etc/my-tours/api.env
cat: /etc/my-tours/api.env: Permission denied

# ২. যন্ত্রের অন্য একজন সাধারণ User কী দেখে?
deploy@island-vps-01:~$ sudo -u ubuntu systemctl show my-tours-api -p Environment -p EnvironmentFiles
Environment=NODE_ENV=production
EnvironmentFiles=/etc/my-tours/api.env (ignore_errors=no)
deploy@island-vps-01:~$ sudo -u ubuntu grep Environment /etc/systemd/system/my-tours-api.service
Environment=NODE_ENV=production
EnvironmentFile=/etc/my-tours/api.env

# ৩. চলমান Process এর তালিকা, root হিসেবে (চারটা লাইন রাখা, Secret ঢাকা)
deploy@island-vps-01:~$ sudo cat /proc/$(systemctl show -p MainPID --value my-tours-api)/environ | tr '\\0' '\\n'
NODE_ENV=production
PORT=3000
SESSION_SECRET=(এখানে ঢাকা)
DATABASE_URL=postgresql://mytours@127.0.0.1:5432/mytours`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তিনটা শিক্ষা এখান থেকে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>EnvironmentFile পড়ে systemd নিজে, root হিসেবে,</strong> App চালু করার আগেই।
                  তাই File টা <code>600</code>, মালিক root হলেও App সব মান পেয়েছে, অথচ mytours
                  নিজে File টা খুলতে গিয়ে Permission denied পেল। এটাই সবচেয়ে কড়া আর সবচেয়ে ভালো ব্যবস্থা।
                </ListItem>
                <ListItem>
                  <strong>Unit File আর <code>systemctl show</code> সবার জন্য খোলা।</strong> যেকোনো User{" "}
                  <code>Environment=</code> এর মান পড়ে ফেলল। তাই Unit File এ শুধু নিরীহ মান, যেমন
                  NODE_ENV। Secret সবসময় EnvironmentFile এ।
                </ListItem>
                <ListItem>
                  <strong>চলমান Process এর মান দেখতে পারে শুধু root আর সেই User নিজে,</strong>{" "}
                  <code>/proc/&lt;PID&gt;/environ</code> দিয়ে। এখানে SESSION_SECRET এর মান Lesson এর
                  জন্য ঢেকে দেওয়া হয়েছে, আসল Output এ পুরোটা ছিল।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর মনে রাখুন সেকশন ০০৩ এর দ্বিতীয় নিয়ম: কপি হয় একবার, জন্মের সময়। Environment File
                বদলালে চলমান App কিছুই জানে না। <code>reload</code> চলবে না, কারণ এই Service কে Reload
                শেখানো হয়নি, Restart করতে হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "change-needs-restart.txt",
          code: `deploy@island-vps-01:~$ sudo sed -i "s/^PORT=3000/PORT=3001/" /etc/my-tours/api.env
deploy@island-vps-01:~$ sudo systemctl reload my-tours-api
Failed to reload my-tours-api.service: Job type reload is not applicable for unit my-tours-api.service.
deploy@island-vps-01:~$ sudo ss -tlnp | grep node
LISTEN 0      511        127.0.0.1:3000      0.0.0.0:*    users:(("node",pid=707,fd=24))
deploy@island-vps-01:~$ sudo systemctl restart my-tours-api
deploy@island-vps-01:~$ sudo ss -tlnp | grep node
LISTEN 0      511        127.0.0.1:3001      0.0.0.0:*    users:(("node",pid=915,fd=24))
deploy@island-vps-01:~$ sudo journalctl -u my-tours-api -n 2 -o cat
Started my-tours-api.service - my-tours API.
my-tours-api listening on 127.0.0.1:3001 (production)`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "App এর মান দিয়ে একবারের একটা কাজ চালানো",
          content: (
            <div className="space-y-3">
              <p>
                কখনো App এর মান দিয়ে একটা আলাদা Script চালাতে হয়, যেমন Database Migration। sudo -u mytours
                দিয়ে চালালে মান আসে না, কারণ ওই পথে কেউ EnvironmentFile পড়ে না। File টা নিজে source
                করতেও পারবেন না, কারণ mytours তা পড়তে পারে না। সবচেয়ে পরিষ্কার উপায় হলো systemd কে দিয়েই
                চালানো, একই File দিয়ে, একই User হিসেবে।
              </p>
              <pre className="font-mono text-[0.75rem] whitespace-pre-wrap break-all">{`$ sudo -u mytours node -e 'console.log("DATABASE_URL set?", Boolean(process.env.DATABASE_URL))'
DATABASE_URL set? false
$ sudo systemd-run --quiet --wait --pipe --uid=mytours \\
    -p EnvironmentFile=/etc/my-tours/api.env \\
    /usr/bin/node -e 'console.log("DATABASE_URL set?", Boolean(process.env.DATABASE_URL))'
DATABASE_URL set? true`}</pre>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "env-files",
      subHeader: { index: "008", title: ".env Files" },
      title: <SectionTitle>একটা .env File, চারজন পাঠক, চার রকম পড়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>.env</code> File দেখতে খুব সহজ, প্রতি লাইনে একটা <code>NAME=value</code>। এই
                সরলতাই ফাঁদ। এই চেহারার কোনো একটা সর্বজনীন নিয়মের বই নেই। প্রতিটা Tool নিজের মতো করে
                File টা পড়ে, আর কিনারার দিকের লাইনে তারা একমত হয় না। একই File আপনার Laptop এ Next.js
                এক রকম পড়ল, Server এ systemd আরেক রকম, আর আপনি টেরই পেলেন না, কারণ কেউ Error দেয়নি।
              </ContentParagraph>
              <ContentParagraph>
                মেপে দেখতে একটা File এ নয়টা লাইন লেখা হলো, তারপর চারজন পাঠক দিয়ে পড়ানো হলো। bash এর{" "}
                <code>set -a; source</code>, systemd এর <code>EnvironmentFile</code>, Node 25 এর{" "}
                <code>--env-file</code>, আর Next.js নিজে যে <code>@next/env</code> দিয়ে .env পড়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "tricky.env, পরীক্ষার File",
          code: `NODE_ENV = production
export SHUTDOWN_GRACE_MS=10000
HOST_NAME=islandtours.example
PUBLIC_URL=https://$HOST_NAME/tours
REDIS_URL=redis://127.0.0.1:6379 # local redis
DB_PASSWORD=abc#123
APP_NAME=Island Tours
GREETING='hello $USER'
WELCOME="line one\\nline two"
SAFE_NAME="Island Tours"`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <EnvFileDialectLab /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লাইন", "bash source", "systemd", "Node --env-file", "Next.js"],
          rows: [
            [<code key="a">NODE_ENV = production</code>, "বসেনি, Error", "production", "production", "production"],
            [<code key="a">export SHUTDOWN_GRACE_MS=10000</code>, "10000", "বাদ, Journal এ সতর্কবার্তা", "10000", "10000"],
            [<code key="a">PUBLIC_URL=https://$HOST_NAME/tours</code>, "নাম বদলে মান বসল", "$HOST_NAME যেমন ছিল", "$HOST_NAME যেমন ছিল", "নাম বদলে মান বসল"],
            [<code key="a">REDIS_URL=... # local redis</code>, "মন্তব্য বাদ", "মন্তব্যটাও মানের অংশ", "মন্তব্য বাদ", "মন্তব্য বাদ"],
            [<code key="a">DB_PASSWORD=abc#123</code>, "abc#123", "abc#123", "abc", "abc"],
            [<code key="a">APP_NAME=Island Tours</code>, "বসেনি, Error", "Island Tours", "Island Tours", "Island Tours"],
            [<code key="a">{"GREETING='hello $USER'"}</code>, "hello $USER", "hello $USER", "hello $USER", "hello deploy"],
            [<code key="a">{"WELCOME=\"line one\\nline two\""}</code>, "উল্টো Slash আর n", "উল্টো Slash আর n", "সত্যিকারের নতুন লাইন", "সত্যিকারের নতুন লাইন"],
            [<code key="a">{"SAFE_NAME=\"Island Tours\""}</code>, "Island Tours", "Island Tours", "Island Tours", "Island Tours"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সবচেয়ে বিপজ্জনক লাইনগুলো সেগুলো, যেখানে কেউ Error দেয়নি অথচ মান বদলে গেছে। Password এর
                মাঝে একটা <code>#</code> থাকলে Node আর Next.js তার পরের অংশ মন্তব্য ধরে ফেলে দেয়।
                Database তখন বলবে Password ভুল, আর আপনি ঘণ্টাখানেক Database এর দোষ খুঁজবেন। systemd
                শেষের মন্তব্যটাকে মানের অংশ বানিয়ে Redis এর ঠিকানা নষ্ট করে দেয়। আর{" "}
                <code>export</code> শব্দটা systemd এ পুরো লাইনটাই বাতিল করে, শুধু Journal এ এক লাইনের
                একটা সতর্কবার্তা রেখে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "journalctl, systemd এর সতর্কবার্তা",
          code: `deploy@island-vps-01:~$ sudo journalctl -n 30 -o cat | grep Ignoring
run-u5.service: Ignoring invalid environment assignment 'export SHUTDOWN_GRACE_MS=10000': /tmp/d.env`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সমাধান কোনো একটা Tool এর নিয়ম মুখস্থ করা নয়। সমাধান হলো এমন একটা ছোট, সরল লেখার ধরন
                মেনে চলা, যেটায় চারজনই একমত। একে বলতে পারেন নিরাপদ উপভাষা।
              </ContentParagraph>
              <ContentList>
                <ListItem>প্রতি লাইনে একটা <code>NAME=value</code>, সমান চিহ্নের দুই পাশে কোনো Space নয়।</ListItem>
                <ListItem>সামনে <code>export</code> নয়।</ListItem>
                <ListItem>মন্তব্য নিজের আলাদা লাইনে, <code>#</code> দিয়ে শুরু। মানের পাশে কখনো নয়।</ListItem>
                <ListItem>মানে Space বা <code>#</code> থাকলে পুরো মান Double Quote এ।</ListItem>
                <ListItem>মানের ভেতরে <code>$</code> নয়। দরকারি ঠিকানা পুরোটা লিখে ফেলুন।</ListItem>
                <ListItem>
                  এক মান এক লাইনে। লম্বা চাবি যেমন <code>JWT_PRIVATE_KEY</code> রাখতে হলে Base64 করে
                  এক লাইনে রাখুন, আর App এ ফিরিয়ে নিন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই নিয়মে লেখা একটা File চারজনকে দিয়ে পড়ানো হয়েছিল, চারজনই হুবহু একই মান পেয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "safe.env, চারজনই একমত",
          code: `# Island Tours API, safe for every reader
PORT=3000
NODE_ENV=production
APP_NAME="Island Tours"
PASSWORD="abc#123"
PUBLIC_URL=https://islandtours.example/tours

# চারজন পাঠক, bash, systemd, Node 25 আর Next.js, প্রত্যেকে হুবহু এটাই পেল:
# PORT        "3000"
# NODE_ENV    "production"
# APP_NAME    "Island Tours"
# PASSWORD    "abc#123"
# PUBLIC_URL  "https://islandtours.example/tours"`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: ".env.example: নাম Git এ, মান Git এর বাইরে",
          content: (
            <p>
              আসল <code>.env</code> কখনো Git এ যায় না। কিন্তু দলের নতুন সদস্যকে তো জানতে হবে কোন কোন
              নাম লাগবে। তাই Repository তে থাকে <code>.env.example</code>: একই নামগুলো, পাশে নিরীহ
              উদাহরণ মান বা খালি, আর প্রতিটার উপরে এক লাইনের মন্তব্য, এটা কী আর কোথা থেকে পাবেন। নতুন
              একটা নাম Code এ যোগ হলে একই Commit এ .env.example ও বদলায়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "node",
      subHeader: { index: "009", title: "Node.js" },
      title: <SectionTitle>Node.js এ process.env, --env-file আর মান সবসময় Text</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Node এর ভেতরে Process এর Environment পাওয়া যায় <code>process.env</code> নামের একটা
                Object হিসেবে। নাম না থাকলে মান <code>undefined</code>। আর থাকলে মান সবসময় String, এই
                কথাটা সেকশন ০০২ এ বলেছিলাম, এখানে তার ফল দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "always-strings.txt",
          code: `you@laptop:~$ FEATURE_SEATS=false PORT=3000 node -e '
  const on = process.env.FEATURE_SEATS;
  console.log(typeof process.env.PORT, process.env.PORT + 1);
  console.log("if (\\"false\\") runs?", Boolean(on));
  console.log("correct check:", on === "true")'
string 30001
if ("false") runs? true
correct check: false`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>{"\"3000\" + 1"}</code> হলো <code>{"\"30001\""}</code>, যোগ নয়, পাশাপাশি বসানো। আর{" "}
                <code>{"\"false\""}</code> একটা খালি নয় এমন String, তাই JavaScript এর চোখে সত্য। Feature বন্ধ
                করতে FEATURE_SEATS=false লিখলেন, অথচ Feature চালুই থাকল। তাই Environment এর মান সবসময়
                একবার পড়ে ঠিক ধরনে বদলে নিন, সংখ্যার জন্য <code>Number()</code> আর যাচাই, সত্য মিথ্যার
                জন্য <code>{"=== \"true\""}</code>। সেকশন ০১০ এর Config Module ঠিক এই কাজটাই করে।
              </ContentParagraph>
              <ContentParagraph>
                এবার .env File। আগে এর জন্য <code>dotenv</code> নামের একটা Package লাগত। Node 20.6.0
                থেকে Node নিজেই পারে: <code>node --env-file=.env server.mjs</code>। Node এর নথি আর এই
                যন্ত্রে চালানো পরীক্ষা থেকে নিয়মগুলো:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "node-env-file-rules.txt (Node 25)",
          code: `you@laptop:~/my-tours$ node --version
v25.8.0
you@laptop:~/my-tours$ PORT=9999 node --env-file=safe.env -e 'console.log("PORT =", process.env.PORT)'
PORT = 9999
you@laptop:~/my-tours$ printf 'PORT=4000\\n' > override.env
you@laptop:~/my-tours$ node --env-file=safe.env --env-file=override.env -e 'console.log("PORT =", process.env.PORT)'
PORT = 4000
you@laptop:~/my-tours$ node --env-file=nope.env -e '1'; echo "exit=$?"
node: nope.env: not found
exit=9
you@laptop:~/my-tours$ node --env-file-if-exists=nope.env -e 'console.log("still runs")'
nope.env not found. Continuing without it.
still runs
you@laptop:~/my-tours$ node -e 'process.loadEnvFile("safe.env"); console.log("PORT =", process.env.PORT)'
PORT = 3000`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>আগে থেকে থাকা মানই জেতে।</strong> Environment এ PORT=9999 থাকলে File এর
                  PORT=3000 বসে না। ভালো নিয়ম, কারণ এতে Server বা Platform এর দেওয়া মান File কে
                  ছাপিয়ে যায়।
                </ListItem>
                <ListItem>
                  <strong>একাধিক File দিলে পরেরটা আগেরটাকে ছাপায়।</strong>
                </ListItem>
                <ListItem>
                  <strong>File না থাকলে Node চালুই হয় না</strong>, Exit Code 9। File টা ঐচ্ছিক হলে{" "}
                  <code>--env-file-if-exists</code>, তখন শুধু একটা সতর্কবার্তা।
                </ListItem>
                <ListItem>
                  <strong>Code এর ভেতর থেকে পড়তে চাইলে</strong> <code>process.loadEnvFile()</code>,
                  একই নিয়মে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একটা বাস্তব ধাক্কার কথা আগে থেকে জানিয়ে রাখি। Ubuntu 24.04 এর নিজের Repository থেকে{" "}
                <code>sudo apt install nodejs</code> দিলে আসে Node 18, আর সে এই Flag চেনেই না:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "node-18-on-ubuntu.txt",
          code: `deploy@island-vps-01:~$ node --version
v18.19.1
deploy@island-vps-01:~$ node --env-file=/tmp/safe.env /tmp/show-safe.mjs; echo "exit=$?"
node: bad option: --env-file=/tmp/safe.env
exit=9`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তাই Server এ Node এর নতুন LTS Version বসানোর সঠিক পথ লেসন ১১ এ দেখবেন। আর Production এ
              systemd দিয়ে চালালে <code>--env-file</code> এর দরকারই পড়ে না: systemd নিজে File পড়ে মান
              দেয়, আর তাতে App এর User কে File পড়ার অনুমতিও দিতে হয় না। --env-file সবচেয়ে কাজের
              Laptop এ, Development এর সময়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "fail-fast",
      subHeader: { index: "010", title: "Fail Fast" },
      title: <SectionTitle>চালু হওয়ার মুহূর্তেই যাচাই: একটা Config Module</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরুন Code এর বিশ জায়গায় <code>process.env.DATABASE_URL</code> সরাসরি লেখা। একটা
                জায়গায় বানান ভুল, <code>DATABASE_ULR</code>। App দিব্যি চালু হলো। তিন দিন পরে একজন
                পর্যটক এমন একটা পাতায় গেলেন যেটা ওই লাইনটা চালায়, আর তখন রহস্যময় একটা Error। ভুলটা ছিল
                প্রথম দিন থেকেই, ধরা পড়ল তিন দিন পরে, একজন পর্যটকের ঘাড়ে।
              </ContentParagraph>
              <ContentParagraph>
                এর ওষুধ একটা ছোট নিয়ম: Environment পড়বে শুধু একটা File, App চালু হওয়ার মুহূর্তে, একবার।
                সেই File প্রতিটা মান যাচাই করবে, ঠিক ধরনে বদলাবে, আর কিছু ভুল থাকলে সবগুলো ভুল একসাথে
                বলে App থামিয়ে দেবে। বাকি পুরো Code <code>process.env</code> ছোঁবে না, শুধু এই File থেকে
                তৈরি <code>config</code> ব্যবহার করবে। এটাই my-tours এর Config Module।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "/srv/my-tours/config.mjs",
          code: `// my-tours API এর প্রতিটা Setting, App চালু হওয়ার মুহূর্তে একবার পড়া আর যাচাই করা।
// কোনো মান ভুল বা অনুপস্থিত হলে App এখনই থামে, পরিষ্কার বার্তা দিয়ে।
// কোনো Fallback মান নেই: ভুল মান নিয়ে চলার চেয়ে না চলা ভালো।
const problems = [];

function read(name) {
  const value = process.env[name]?.trim();
  if (!value) problems.push(\`\${name} is not set\`);
  return value ?? "";
}

function oneOf(name, allowed) {
  const value = read(name);
  if (value && !allowed.includes(value)) {
    problems.push(\`\${name} must be one of \${allowed.join(", ")}, got "\${value}"\`);
  }
  return value;
}

function port(name) {
  const raw = read(name);
  const value = Number(raw);
  if (raw && !(Number.isInteger(value) && value >= 1 && value <= 65535)) {
    problems.push(\`\${name} must be a whole number from 1 to 65535, got "\${raw}"\`);
  }
  return value;
}

function url(name, protocols) {
  const raw = read(name);
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    if (!protocols.includes(parsed.protocol)) {
      problems.push(\`\${name} must start with \${protocols.join(" or ")}\`);
    }
    return parsed;
  } catch {
    // মানটা ছাপাই না, কারণ এর ভেতরে Password থাকতে পারে
    problems.push(\`\${name} is not a valid URL\`);
    return null;
  }
}

function secret(name, minLength) {
  const value = read(name);
  if (value && value.length < minLength) {
    problems.push(\`\${name} is too short, use at least \${minLength} characters\`);
  }
  return value;
}

const values = {
  nodeEnv: oneOf("NODE_ENV", ["development", "production", "test"]),
  port: port("PORT"),
  databaseUrl: url("DATABASE_URL", ["postgres:", "postgresql:"]),
  sessionSecret: secret("SESSION_SECRET", 32),
};

if (problems.length > 0) {
  console.error("my-tours-api cannot start, the configuration is wrong:");
  for (const problem of problems) console.error(\`  - \${problem}\`);
  process.exit(1);
}

export const config = Object.freeze(values);`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "/srv/my-tours/server.mjs",
          code: `// my-tours API এর সবচেয়ে ছোট রূপ: Config পড়ে, তারপর শুধু 127.0.0.1 এ শোনে।
import http from "node:http";
import { config } from "./config.mjs";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({ ok: true, env: config.nodeEnv }));
});

server.listen(config.port, "127.0.0.1", () => {
  // কোন Port আর কোন পরিবেশ, শুধু এটুকু। কোনো Secret কখনো Log এ নয়।
  console.log(\`my-tours-api listening on 127.0.0.1:\${config.port} (\${config.nodeEnv})\`);
});`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তিনবার চালিয়ে দেখা হলো, প্রথমবার কিছুই না দিয়ে, দ্বিতীয়বার সব ভুল মান দিয়ে, তৃতীয়বার শুধু
              Database এর ঠিকানা ভাঙা রেখে। <code>env -i</code> দিয়ে খালি Environment থেকে শুরু, যাতে
              আগে থেকে কোনো মান চুপচাপ ঢুকে না পড়ে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "three-wrong-starts.txt",
          code: `you@laptop:~/my-tours$ env -i PATH="$PATH" node server.mjs; echo "exit=$?"
my-tours-api cannot start, the configuration is wrong:
  - NODE_ENV is not set
  - PORT is not set
  - DATABASE_URL is not set
  - SESSION_SECRET is not set
exit=1
you@laptop:~/my-tours$ env -i PATH="$PATH" NODE_ENV=prod PORT=80a DATABASE_URL="mysql://u:p@h/db" SESSION_SECRET=short node server.mjs; echo "exit=$?"
my-tours-api cannot start, the configuration is wrong:
  - NODE_ENV must be one of development, production, test, got "prod"
  - PORT must be a whole number from 1 to 65535, got "80a"
  - DATABASE_URL must start with postgres: or postgresql:
  - SESSION_SECRET is too short, use at least 32 characters
exit=1
you@laptop:~/my-tours$ env -i PATH="$PATH" NODE_ENV=production PORT=47851 DATABASE_URL="not a url with p4ss" SESSION_SECRET="$(openssl rand -base64 32)" node server.mjs; echo "exit=$?"
my-tours-api cannot start, the configuration is wrong:
  - DATABASE_URL is not a valid URL
exit=1`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>এই Module এর প্রতিটা সিদ্ধান্তের পেছনে একটা কারণ আছে।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সব সমস্যা একসাথে।</strong> প্রথম ভুলে থেমে গেলে চারটা ভুল সারাতে চারবার Deploy
                  লাগে। তালিকা পেলে একবারেই সব।
                </ListItem>
                <ListItem>
                  <strong>আকার যাচাই, নির্দিষ্ট মান নয়।</strong> PORT একটা পূর্ণসংখ্যা কি না, URL টা
                  postgres দিয়ে শুরু কি না, Secret টা যথেষ্ট লম্বা কি না। কোন Database বা কোন Domain,
                  সেটা Code জানে না, জানার দরকারও নেই।
                </ListItem>
                <ListItem>
                  <strong>ভুল মান ছাপা হয় না, যদি সেটা গোপন হতে পারে।</strong> PORT এর ভুল মান দেখালে
                  ক্ষতি নেই। কিন্তু DATABASE_URL এর ভেতরে Password থাকতে পারে, তাই বার্তা শুধু বলে URL
                  টা ঠিক নয়, মানটা দেখায় না। তৃতীয় চেষ্টায় সেটাই দেখছেন।
                </ListItem>
                <ListItem>
                  <strong>কোনো Fallback নেই।</strong> একটা মানও আন্দাজে বসানো হয়নি। থাকলে ভুলটা চাপা
                  পড়ত।
                </ListItem>
                <ListItem>
                  <strong>Exit Code 1।</strong> systemd বুঝবে App ব্যর্থ হয়েছে, Journal এ লিখবে, আর
                  Restart এর নিয়ম মানবে। সেকশন ০০৭ এ ঠিক এটাই দেখেছেন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "Fallback কেন এত খারাপ, একটা সত্যি ধরনের গল্প",
          content: (
            <p>
              একটা App এর Cookie এর Domain আসত Environment থেকে, আর না পেলে Code এ লেখা একটা পুরনো
              Domain ধরে নিত। একদিন Server বদলানোর সময় কেউ মানটা বসাতে ভুলে গেল। App চালু হলো, কোনো
              Error নেই, Login করলে প্রতিবার সফল দেখায়। কিন্তু Cookie বসছিল পুরনো Domain এ, তাই Login এর
              পরের প্রতিটা Request এ ব্যবহারকারী অচেনা। কোনো Log এ কিছু নেই, কারণ App এর চোখে সবই ঠিক।
              Fallback না থাকলে প্রথম Deploy তেই App বলত, COOKIE_DOMAIN is not set, আর ব্যাপারটা পাঁচ
              মিনিটে শেষ হতো।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "nextjs",
      subHeader: { index: "011", title: "Next.js and Vercel" },
      title: <SectionTitle>Next.js: NEXT_PUBLIC_ মান Build এর সময় জমে যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Next.js নিজেই .env File পড়ে, আলাদা কিছু বসাতে হয় না। কোনো নাম কোথায় খোঁজা হবে, তার একটা
                নির্দিষ্ট ক্রম আছে, আর প্রথম যেখানে পাওয়া যায় সেখানেই থামে। Next.js এর নিজের নথি অনুযায়ী
                ক্রমটা:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>process.env</code>, মানে যে Environment নিয়ে Process টা চালু হয়েছে, Vercel বা
                  systemd যা দিয়েছে
                </ListItem>
                <ListItem>
                  <code>.env.$(NODE_ENV).local</code>, যেমন <code>.env.production.local</code>
                </ListItem>
                <ListItem>
                  <code>.env.local</code>, Test এর সময় বাদ
                </ListItem>
                <ListItem>
                  <code>.env.$(NODE_ENV)</code>, যেমন <code>.env.development</code>
                </ListItem>
                <ListItem>
                  <code>.env</code>
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নামের শেষে <code>.local</code> মানে এটা শুধু আপনার যন্ত্রের, কখনো Git এ নয়। আর আগের
                সেকশনের টেবিলে দেখেছেন, Next.js <code>$NAME</code> লিখলে অন্য নামের মান টেনে আনে, তাই
                মানে সত্যিকারের <code>$</code> রাখতে হলে <code>\$</code> লিখতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                এবার সবচেয়ে জরুরি কথা। Next.js এ Code চলে দুই জায়গায়, Server এ আর পর্যটকের Browser এ।
                সাধারণ নাম, যেমন DATABASE_URL, শুধু Server এর Code দেখতে পায়। Browser এর Code এ কোনো
                মান দরকার হলে নামের শুরুতে লাগাতে হয় <code>NEXT_PUBLIC_</code>। তখন{" "}
                <code>next build</code> Build এর মুহূর্তে Code এর প্রতিটা{" "}
                <code>process.env.NEXT_PUBLIC_...</code> খুঁজে তার জায়গায় মানটা সরাসরি লিখে দেয়। ফলে
                মানটা চলে যায় JavaScript File এর ভেতরে, যেটা প্রতিটা Browser নামায় আর যে কেউ খুলে পড়তে
                পারে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <EnvBuildVsRuntimeSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>এর থেকে তিনটা নিয়ম, যেগুলো ভুল হলে খুব দামি ভুল হয়।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>কোনো Secret কখনো NEXT_PUBLIC_ নয়।</strong> NEXT_PUBLIC_DATABASE_URL লিখলে সেটা
                  Browser এ যায়, আর সেটাই Database এর চাবি সারা দুনিয়াকে দেওয়া।
                </ListItem>
                <ListItem>
                  <strong>NEXT_PUBLIC_ মান বদলালে নতুন Build লাগে।</strong> পুরনো Build এ পুরনো মান
                  লেখা হয়ে গেছে। একই Build একাধিক পরিবেশে চালালে সবখানে Build এর সময়ের মানটাই থাকবে।
                </ListItem>
                <ListItem>
                  <strong>শুধু পুরো নাম লিখলেই কাজ করে।</strong> নথি বলে,{" "}
                  <code>process.env[varName]</code> এর মতো ঘুরিয়ে লেখা নাম Build খুঁজে পায় না, তাই
                  বসায়ও না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একটা সত্যি গল্প, এই সাইটেরই। আপনি এখন যে সাইটে পড়ছেন, সেটা Sitemap আর Canonical Link এর
                জন্য নিজের ঠিকানা পড়ে <code>NEXT_PUBLIC_SITE_URL</code> থেকে। আগে Code এ একটা Fallback
                ঠিকানা লেখা ছিল। এখন পুরো সাইটে মাত্র একটা File এই নামটা পড়ে, আর মান না থাকলে Build
                থেমে যায় এই বার্তা দিয়ে:
              </ContentParagraph>
              <pre className="font-mono text-[0.75rem] whitespace-pre-wrap break-all px-4 py-3 border border-border bg-muted/30">
                NEXT_PUBLIC_SITE_URL is not set. Set it to the public address of the site, such as https://example.com.
              </pre>
              <ContentParagraph>
                ফলে Vercel এ কেউ মানটা বসাতে ভুলে গেলে নতুন Deploy ব্যর্থ হয়, আর আগের ভালো Deploy টাই
                চলতে থাকে। চুপচাপ ভুল ঠিকানায় Sitemap তৈরির চেয়ে এটা অনেক ভালো।
              </ContentParagraph>
              <ContentParagraph>
                Vercel এ মান বসানো হয় Project এর Settings এ, প্রতিটা পরিবেশের জন্য আলাদা: Production,
                Preview আর Development। Vercel এর নথি অনুযায়ী মান বদলালে আগের Deployment গুলো বদলায় না,
                বদল লাগে শুধু নতুন Deployment এ, তাই বদলের পর Redeploy করতে হয়। Laptop এ একই মান আনতে{" "}
                <code>vercel env pull .env.local</code>, আর সেই File Git এর বাইরে রাখুন। Build এর Log এ
                ৩২ অক্ষর বা তার বেশি লম্বা কোনো Secret দেখা দিলে Vercel সেটা{" "}
                <code>[REDACTED]</code> দিয়ে ঢেকে দেয়, কিন্তু এটা শেষ রক্ষাকবচ, প্রথম নয়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "git",
      subHeader: { index: "012", title: "Secrets and Git" },
      title: <SectionTitle>Git কিছুই ভোলে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সবচেয়ে সাধারণ Secret ফাঁসের গল্পটা এরকম। প্রথম দিন তাড়াহুড়োয় .env File টা Commit হয়ে
                গেল। পরের দিন কেউ খেয়াল করলেন, Git থেকে File টা সরিয়ে দিলেন, .gitignore এ নাম লিখলেন, Commit করলেন।
                সবাই নিশ্চিন্ত। কিন্তু Git একটা ইতিহাসের খাতা। আজকের File এর তালিকায় .env নেই ঠিকই, অথচ
                প্রথম দিনের Commit এ সেটা আছে, আর থাকবে চিরকাল। নিচের পরীক্ষাটা ঠিক এই গল্প, একটা নকল
                Secret দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "git-remembers.txt",
          code: `you@laptop:~/demo$ git init -q -b main
you@laptop:~/demo$ echo 'console.log("my-tours")' > server.mjs
you@laptop:~/demo$ printf 'PORT=3000\\nSESSION_SECRET=not-a-real-secret-committed\\n' > .env
you@laptop:~/demo$ git add . && git commit -q -m "first version"
you@laptop:~/demo$ git rm -q --cached .env && echo ".env" > .gitignore
you@laptop:~/demo$ git add .gitignore && git commit -q -m "remove .env, ignore it"

you@laptop:~/demo$ git ls-files
.gitignore
server.mjs

you@laptop:~/demo$ git log -p -S SESSION_SECRET --format="commit %h %s"
commit 43433d4 remove .env, ignore it

diff --git a/.env b/.env
deleted file mode 100644
index 394b440..0000000
--- a/.env
+++ /dev/null
@@ -1,2 +0,0 @@
-PORT=3000
-SESSION_SECRET=not-a-real-secret-committed
commit addd7e5 first version

diff --git a/.env b/.env
new file mode 100644
index 0000000..394b440
--- /dev/null
+++ b/.env
@@ -0,0 +1,2 @@
+PORT=3000
+SESSION_SECRET=not-a-real-secret-committed

you@laptop:~/demo$ git check-ignore -v .env
.gitignore:1:.env	.env`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>git log -p -S SESSION_SECRET</code> পুরো ইতিহাস থেকে সেই Commit গুলো বের করে, যেখানে
                এই লেখাটা যোগ হয়েছে বা মুছেছে। আজকের File এ নেই, তবুও দুইটা Commit বেরিয়ে এল, আর মানটা
                পুরোটাই দেখা গেল। যে কেউ Repository টা Clone করেছে, তার কাছেও এই ইতিহাস আছে। GitHub এ
                একবার Push হয়ে গেলে ধরে নিন মানটা আর গোপন নেই।
              </ContentParagraph>
              <ContentParagraph>তাই নিয়মগুলো এই ক্রমে:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রথম Commit এর আগেই</strong> .gitignore এ <code>.env*</code> আর পাশে{" "}
                  <code>!.env.example</code>, যাতে উদাহরণ File টা যায় কিন্তু আসলগুলো না যায়।{" "}
                  <code>git check-ignore -v .env</code> দিয়ে মিলিয়ে নিন কোন লাইন File টাকে আটকাচ্ছে।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা Commit এর আগে</strong> <code>git status</code> আর{" "}
                  <code>git diff --cached</code> এক নজর দেখা।
                </ListItem>
                <ListItem>
                  <strong>ফাঁস হলে প্রথম কাজ মান বদলানো,</strong> ইতিহাস মোছা নয়। নতুন Secret বানান,
                  সব জায়গায় বসান, পুরনোটা বাতিল করুন। তারপর চাইলে ইতিহাস থেকে মুছতে পারেন{" "}
                  <code>git filter-repo</code> এর মতো Tool দিয়ে, কিন্তু সেটা শুধু ভবিষ্যতের জন্য
                  পরিষ্কার রাখা, যা ফাঁস হয়েছে তা ফেরত আনে না।
                </ListItem>
                <ListItem>
                  <strong>GitHub এর Secret Scanning আর Push Protection</strong> চালু রাখুন। পরিচিত
                  ধরনের চাবি Push করতে গেলে GitHub আটকে দেয়। কিন্তু নিজের বানানো Secret এর ধরন সে চেনে
                  না, তাই এটা অভ্যাসের বদলি নয়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "leaks",
      subHeader: { index: "013", title: "Other Leaks" },
      title: <SectionTitle>History, ps, Log, URL: Secret বেরিয়ে যাওয়ার বাকি পথ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Git একমাত্র পথ নয়। Server এ কাজ করার সময় আরও কয়েকটা জায়গা আছে, যেখানে একটা মান নিঃশব্দে
              জমা হয় বা অন্যের চোখে পড়ে। প্রথম তিনটা এই লেসনের Lab এ আপনি নিজের হাতে ঘটাবেন।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <EnvSecretLeaksDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>Shell History।</strong> Terminal এ যা টাইপ করেন, bash সেটা মনে রাখে আর
                Logout এর সময় <code>~/.bash_history</code> এ লিখে রাখে। <code>export SESSION_SECRET=...</code>{" "}
                টাইপ করলে মানটাও সেখানে চলে যায়। Ubuntu এর ~/.bashrc এ{" "}
                <code>HISTCONTROL=ignoreboth</code> লেখা থাকে, যার একটা মানে হলো শুরুতে Space দিয়ে
                লেখা লাইন History তে ওঠে না। SSH Login করে পরীক্ষা করা হয়েছিল:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "history-and-a-leading-space.txt",
          code: `deploy@island-vps-01:~$ export SESSION_SECRET=not-a-real-secret-typed
deploy@island-vps-01:~$  export SESSION_SECRET=not-a-real-secret-spaced
deploy@island-vps-01:~$ echo \${#SESSION_SECRET} characters
24 characters
deploy@island-vps-01:~$ history
    1  export SESSION_SECRET=not-a-real-secret-typed
    2  echo \${#SESSION_SECRET} characters
    3  history`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় লাইনের শুরুর Space টা খেয়াল করুন, History তে সেটা নেই। তবে শুরুর Space টা একটা
                বাঁচার কৌশল, অভ্যাস নয়। ভালো অভ্যাস হলো মানটা টাইপই না করা। দুইটা পথ:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>মান যন্ত্র বানাক।</strong> <code>openssl rand -base64 32</code> একটা নতুন
                  এলোমেলো মান বানায়, আর সেটা সরাসরি File এ চলে যায়, Lab এর ৪ নম্বর Script এ যেমন।
                </ListItem>
                <ListItem>
                  <strong>অন্য জায়গা থেকে আনা মান লুকিয়ে টাইপ করুন।</strong>{" "}
                  <code>{"read -rs -p \"SESSION_SECRET: \" SESSION_SECRET"}</code> একটা Prompt দেখায়, আপনি
                  Password Manager থেকে Paste করেন, পর্দায় কিছুই দেখা যায় না, History তেও যায় না। তারপর{" "}
                  <code>export SESSION_SECRET</code>।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                <strong>ps এর Argument।</strong> একটা Command এর পুরো লাইন, তার Argument সহ, যন্ত্রের যেকোনো
                User <code>ps</code> দিয়ে দেখতে পারে। Environment দেখতে পারে শুধু সেই User আর root। নিচের
                পরীক্ষায় deploy একটা Process চালিয়েছে, যার একটা নকল Password Environment এ আর আরেকটা
                Argument এ। তারপর অন্য একজন User, nobody, দুইটাই দেখার চেষ্টা করেছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "6-secret-leaks.sh, প্রথম অংশের Output",
          code: `deploy@island-vps-01:~$ bash 6-secret-leaks.sh
--- ১. Argument সবাই দেখে, Environment শুধু মালিক
  অন্য User (nobody) ps এ দেখে:
node -e setTimeout(() => {}, 60000) -- --db-password=not-a-real-password-arg
  অন্য User environ পড়তে চায়:
  cat: /proc/798/environ: Permission denied`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Argument এর Password সবাই দেখল, Environment এরটা কেউ না। তাই কোনো Tool যদি Password
                Argument হিসেবে চায়, যেমন <code>--password=...</code>, তার বদলে Environment বা একটা File
                এর পথ দেওয়ার উপায় খুঁজুন। প্রায় সব ভালো Tool সেটা দেয়, যেমন PostgreSQL এর Tool গুলো{" "}
                <code>PGPASSWORD</code> বা একটা File পড়ে। আর একটা লুকানো ফাঁদ:{" "}
                <code>{"ssh island 'SECRET=... node job.mjs'"}</code> বা{" "}
                <code>{"su -c \"SECRET=... cmd\""}</code> লিখলে পুরো লাইনটাই ভেতরের bash এর Argument হয়ে যায়,
                তখন Environment এর মানও ps এ দেখা যায়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Log আর Error পাতা।</strong> কখনো <code>console.log(process.env)</code> নয়,
                ডিবাগ করার তাড়াতেও নয়। কখনো পুরো DATABASE_URL Log করবেন না, ভেতরে Password আছে। দরকার হলে
                শুধু Host আর Database এর নাম। আর এমন কোনো Debug পাতা বা Endpoint রাখবেন না যেটা Environment
                ফেরত দেয়, লেসন ০৭ এ Log লেখার নিয়ম আরও বিস্তারিত।
              </ContentParagraph>
              <ContentParagraph>
                <strong>URL।</strong> Module 06 এর URL লেসনে দেখেছেন, Query তে রাখা চাবি Browser এর
                History, Server এর Access Log আর Referer Header এ ছড়িয়ে পড়ে। চাবি যায় Header এ, যেমন{" "}
                <code>Authorization</code>।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Chat, Ticket, Screenshot।</strong> দলের কাউকে বলতে হলে নাম বলুন, মান নয়: Server
                এ SESSION_SECRET বদলাতে হবে। মান লাগলে দলের Password Manager এর মাধ্যমে দিন। একটা
                Screenshot এ Terminal এর কোণে একটা Token থেকে যাওয়া খুব সাধারণ দুর্ঘটনা।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "on-the-server",
      subHeader: { index: "014", title: "On the Server" },
      title: <SectionTitle>Server এ মান কোথায় থাকবে, কে পড়বে, আর ফাঁস হলে কী করবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণের সব কথা জোড়া দিলে একটা Server এর জন্য পরিষ্কার একটা ব্যবস্থা দাঁড়ায়। প্রতিটা
                Service এর জন্য একটা Environment File, <code>/etc</code> এর ভেতরে তার নিজের Folder এ,
                যেমন <code>/etc/my-tours/api.env</code>। কে কী পড়বে, সেটা ঠিক হয় File এর অনুমতি দিয়ে,
                যার পুরো ব্যাখ্যা লেসন ০৪ এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["অবস্থা", "মালিক আর অনুমতি", "কেন"],
          rows: [
            ["systemd এর EnvironmentFile পড়ে, App নিজে পড়ে না", <code key="a">root:root 600</code>, "systemd root হিসেবে পড়ে মান দেয়, App এর User কে File দেখানোর দরকারই নেই"],
            ["App নিজেও File পড়ে, যেমন একবারের Script", <code key="a">root:mytours 640</code>, "Group এর সদস্য শুধু পড়তে পারে, লিখতে পারে শুধু root, বাকিরা কিছুই না"],
            ["কখনোই নয়", <code key="a">644</code>, "যন্ত্রের প্রতিটা User সব Secret পড়ে ফেলবে"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                File টা বানানোর সময়েই অনুমতি ঠিক রাখুন, পরে নয়, যাতে এক মুহূর্তের জন্যও খোলা না থাকে।{" "}
                <code>sudo install -m 600 -o root -g root /dev/null /etc/my-tours/api.env</code> একটা
                খালি File বানায়, শুরু থেকেই 600। তারপর মান লিখতে <code>sudoedit /etc/my-tours/api.env</code>,
                যেটা File টা একটা নিরাপদ কপিতে খোলে, আপনার পছন্দের Editor এ, আর সংরক্ষণ করলে আসল জায়গায়
                বসিয়ে দেয়। Editor এ Paste করা মান History তে যায় না। সব শেষে{" "}
                <code>sudo systemctl restart my-tours-api</code>।
              </ContentParagraph>
              <ContentParagraph>
                একটা Secret ফাঁস হয়েছে বা হয়ে থাকতে পারে, যেমন দলের কেউ চলে গেলেন বা Screenshot এ চলে
                এল। তখন ধাপগুলো এই ক্রমে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>নতুন মান বানান,</strong> <code>openssl rand -base64 32</code>, বা যে সেবার চাবি,
                  তার Dashboard থেকে নতুন একটা।
                </ListItem>
                <ListItem>
                  <strong>নতুন মান সব জায়গায় বসান,</strong> Server এর File, Vercel, CI, দলের Password
                  Manager।
                </ListItem>
                <ListItem>
                  <strong>Restart বা Redeploy করুন,</strong> যাতে প্রতিটা Process নতুন কপি নেয়।
                </ListItem>
                <ListItem>
                  <strong>পুরনোটা বাতিল করুন।</strong> Database এর User এর Password বদলান, সেবার পুরনো
                  চাবি Revoke করুন। এই ধাপ বাদ দিলে আগের তিনটার কোনো মানে নেই।
                </ListItem>
                <ListItem>
                  <strong>পরিণাম জেনে নিন।</strong> SESSION_SECRET বদলালে সবার চলমান Session বাতিল
                  হয়, সবাইকে আবার Login করতে হয়। কাজটা ব্যস্ত সময়ে না করাই ভালো।
                </ListItem>
                <ListItem>
                  <strong>Log দেখুন,</strong> ফাঁসের পর থেকে পুরনো চাবি দিয়ে অচেনা কোথাও থেকে কিছু
                  এসেছিল কি না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                দল আর Server বাড়লে একসময় File এ মান রাখা যথেষ্ট থাকে না। তখন আসে Secret Manager, যেমন
                HashiCorp Vault, Doppler, 1Password, বা AWS আর Google Cloud এর নিজের Secret Manager।
                এরা মান এক জায়গায় রাখে, কে কখন পড়ল তার হিসাব রাখে, আর Rotation সহজ করে। systemd এর
                নিজেরও একটা ব্যবস্থা আছে, <code>LoadCredential=</code>, যেখানে Secret Environment এ না
                গিয়ে একটা আলাদা File হিসেবে App এর হাতে পৌঁছায়, ফলে <code>/proc/&lt;PID&gt;/environ</code>{" "}
                এও দেখা যায় না। আর Docker এর <code>--env-file</code> এর একটা নিজস্ব সতর্কতা আছে, যেটা
                Docker Module এ দেখবেন। এখন শুধু নামগুলো চিনে রাখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["জায়গা", "মান কোথায় থাকে", "বদলালে কী করতে হয়"],
          rows: [
            ["আপনার Laptop", <code key="a">.env.local</code>, "Dev Server আবার চালু"],
            ["Practice Server", <code key="a">/etc/my-tours/api.env</code>, <code key="b">sudo systemctl restart my-tours-api</code>],
            ["Vercel", "Project Settings, প্রতি পরিবেশে আলাদা", "Redeploy"],
            ["Island Tours VPS", <code key="a">/etc/islandtours/api.env</code>, "API Restart, Deploy এর নিয়মে"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours এর api.env, আর তাকে ঘিরে ছয়টা সিদ্ধান্ত</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Island Tours এর VPS <code>island-vps-01</code> এ API এর সব মান থাকে একটা File এ,{" "}
              <code>/etc/islandtours/api.env</code>। File এর মালিক root, Group islandtours, অনুমতি 640।
              Group রাখা হয়েছে যাতে islandtours User হিসেবে চালানো একবারের Script, যেমন Database
              Migration, File টা নিজে পড়তে পারে। আর কেউ পারে না। নিচে File এর চেহারা, নামগুলো আসল,
              মানগুলো ঢাকা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "/etc/islandtours/api.env (চেহারা, মান ঢাকা)",
          code: `# Island Tours API, production
# মালিক root, Group islandtours, অনুমতি 640। এই File কখনো Git এ নয়।
# নামগুলো আসল, মানগুলো এখানে ঢাকা।

NODE_ENV=production
PORT=3000

# PostgreSQL আর Redis, দুইটাই শুধু 127.0.0.1 এ
DATABASE_URL=postgresql://islandtours:••••••••@127.0.0.1:5432/islandtours
REDIS_URL=redis://127.0.0.1:6379

# openssl rand -base64 32 দিয়ে বানানো
SESSION_SECRET=••••••••

# Mobile App এর JWT সই করার ES256 Private Key, PEM কে Base64 করে এক লাইনে
JWT_PRIVATE_KEY=••••••••

# Module 05 এর দুইটা সময়, মিলিসেকেন্ডে
SHUTDOWN_GRACE_MS=10000
KEEP_ALIVE_TIMEOUT_MS=65000`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>এই File এর চারপাশে দল ছয়টা সিদ্ধান্ত নিয়েছে।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>এক Service, এক File।</strong> API এর মান আর Backup Job এর মান আলাদা File এ,
                  যাতে Backup Job এর হাতে Session এর চাবি না থাকে।
                </ListItem>
                <ListItem>
                  <strong>Repository তে শুধু .env.example।</strong> প্রতিটা নামের উপরে এক লাইনের মন্তব্য।
                  নতুন নাম যোগ হলে একই Pull Request এ .env.example বদলায়, আর Review এ এটাই প্রথম দেখা হয়।
                </ListItem>
                <ListItem>
                  <strong>Config Module App চালুর মুহূর্তে সব যাচাই করে।</strong> একটা মান ভুল থাকলে
                  API ওঠেই না, Journal এ নাম ধরে কারণ লেখা থাকে, আর আগের Version টা চলতে থাকে।
                </ListItem>
                <ListItem>
                  <strong>Secret কেউ টাইপ করে না।</strong> openssl বানায়, sudoedit দিয়ে বসে, দলের
                  Password Manager এ একটা কপি থাকে। Chat এ কখনো মান যায় না।
                </ListItem>
                <ListItem>
                  <strong>Frontend এ শুধু প্রকাশ্য মান NEXT_PUBLIC_।</strong> Vercel এ সাইটের ঠিকানা আর
                  Analytics এর ID ছাড়া আর কিছু NEXT_PUBLIC_ নয়। API এর কোনো চাবি Frontend এর Build এ
                  ঢোকে না।
                </ListItem>
                <ListItem>
                  <strong>বছরে দুইবার, আর কেউ দল ছাড়লে সাথে সাথে, Rotation।</strong> SESSION_SECRET
                  বদলানো হয় ভোররাতে, কারণ তাতে সবাইকে আবার Login করতে হয়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "request-flow",
      subHeader: { index: "016", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা DATABASE_URL এর জীবন, File থেকে একটা বুকিং পর্যন্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              my-tours এর DATABASE_URL কীভাবে একটা File এর লাইন থেকে একজন পর্যটকের বুকিং এর কাজে লাগে,
              শুরু থেকে শেষ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "মানটা File এ বসে",
              description:
                "deploy sudoedit দিয়ে /etc/my-tours/api.env খোলেন, Password Manager থেকে মানটা Paste করেন, সংরক্ষণ করেন। File টা root এর, 600। কোনো Shell History তে কিছু ওঠেনি।",
            },
            {
              title: "Restart এর আদেশ",
              description:
                "deploy চালান sudo systemctl restart my-tours-api। systemd পুরনো Process কে SIGTERM পাঠিয়ে থামায়, কারণ পুরনো Process এর কপিতে পুরনো মান।",
            },
            {
              title: "systemd File পড়ে",
              description:
                "PID 1, root হিসেবে, Unit এর Environment=NODE_ENV=production নেয়, তারপর EnvironmentFile এর প্রতিটা লাইন। নিজের ছোট তালিকার সাথে মিলিয়ে নতুন Process এর জন্য একটা পুরো Environment বানায়।",
            },
            {
              title: "নতুন Process এর জন্ম",
              description:
                "systemd fork করে, User mytours এ নেমে আসে, তারপর exec করে /usr/bin/node /srv/my-tours/server.mjs। পুরো ঠিকানা লেখা, তাই PATH এর খোঁজের প্রশ্নই নেই। তালিকাটা এখন /proc/<PID>/environ এ, শুধু root আর mytours দেখতে পারে।",
            },
            {
              title: "Config Module যাচাই করে",
              description:
                "server.mjs প্রথমেই config.mjs আনে। সে একবার process.env পড়ে, DATABASE_URL একটা URL কি না আর postgresql দিয়ে শুরু কি না দেখে। সব ঠিক, তাই একটা জমাট config Object তৈরি হয়।",
            },
            {
              title: "App শুনতে শুরু করে",
              description:
                "Server বসে 127.0.0.1:3000 এ, আর Journal এ একটা লাইন লেখে: কোন Port, কোন পরিবেশ। Database এর ঠিকানা বা কোনো Secret সেই লাইনে নেই।",
            },
            {
              title: "একটা বুকিং আসে",
              description:
                "Module 06 এর পথ ধরে একটা POST /api/bookings Caddy হয়ে App এ পৌঁছায়। App এর Code config.databaseUrl দিয়ে PostgreSQL এ যায়। process.env আর কখনো ছোঁয়া হয় না।",
            },
            {
              title: "কিছু ভুল হলে",
              description:
                "Database উত্তর না দিলে App Log এ লেখে কোন Host এ যেতে পারেনি, পুরো URL নয়। পর্যটক দেখেন একটা ভদ্র বার্তা, Stack Trace নয়, কারণ NODE_ENV=production।",
            },
            {
              title: "পরের Rotation",
              description:
                "ছয় মাস পরে Password বদলায়। আবার প্রথম ধাপ থেকে: File বদলায়, Restart, নতুন Process নতুন কপি। পুরনো Password টা Database থেকেই বাতিল করা হয়।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও পড়তে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>নিচের Lab টা আগে করুন।</strong> ছয়টা Script এ এই লেসনের প্রতিটা নিয়ম নিজের
                Practice Server এ ঘটবে, আর ফলাফলগুলো ঠিক এই লেসনের Output এর সাথে মিলবে।
              </ListItem>
              <ListItem>
                <strong>Bash Startup Files, GNU Bash Manual</strong>, কোন Shell কোন File পড়ে তার
                আসল নিয়ম।{" "}
                <a href="https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files.html" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  gnu.org, Bash Startup Files
                </a>
              </ListItem>
              <ListItem>
                <strong>systemd.exec</strong>, Environment, EnvironmentFile, PassEnvironment আর
                LoadCredential এর পূর্ণ বিবরণ।{" "}
                <a href="https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  freedesktop.org, systemd.exec
                </a>
              </ListItem>
              <ListItem>
                <strong>Node.js, Environment Variables আর CLI</strong>, --env-file এর File এর
                নিয়ম আর process.loadEnvFile।{" "}
                <a href="https://nodejs.org/api/environment_variables.html" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  nodejs.org, environment variables
                </a>
                {" আর "}
                <a href="https://nodejs.org/api/cli.html" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  nodejs.org, CLI
                </a>
              </ListItem>
              <ListItem>
                <strong>Next.js, Environment Variables</strong>, Load Order আর NEXT_PUBLIC_ এর পুরো
                গল্প।{" "}
                <a href="https://nextjs.org/docs/app/guides/environment-variables" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  nextjs.org, environment variables
                </a>
              </ListItem>
              <ListItem>
                <strong>Vercel, Environment Variables</strong>, প্রতি পরিবেশে মান, Redeploy আর
                vercel env pull।{" "}
                <a href="https://vercel.com/docs/environment-variables" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  vercel.com/docs/environment-variables
                </a>
              </ListItem>
              <ListItem>
                <strong>The Twelve-Factor App, Config</strong>, Config কেন Environment এ, এক পাতায়।{" "}
                <a href="https://12factor.net/config" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  12factor.net/config
                </a>
              </ListItem>
              <ListItem>
                <strong>OWASP Secrets Management Cheat Sheet</strong>, Secret রাখা, ভাগ করা আর
                Rotation এর পরিণত নিয়ম।{" "}
                <a href="https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  cheatsheetseries.owasp.org
                </a>
              </ListItem>
              <ListItem>
                <strong>GitHub Secret Scanning</strong>, Push Protection কী ধরে আর কী ধরে না।{" "}
                <a href="https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  docs.github.com, secret scanning
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
                  Config মানে যা জায়গাভেদে বদলায় অথচ Code বদলায় না। সেটা থাকে Environment এ, Code এ নয়,
                  আর কখনো Fallback মান দিয়ে চাপা দেওয়া হয় না।
                </ListItem>
                <ListItem>
                  প্রতিটা Process এর সাথে <code>NAME=value</code> এর একটা তালিকা থাকে। মান সবসময় Text।{" "}
                  <code>printenv</code> দেখায়, <code>/proc/&lt;PID&gt;/environ</code> এ থাকে।
                </ListItem>
                <ListItem>
                  Child পায় Parent এর তালিকার একটা কপি, জন্মের সময়, শুধু export করা নামের। পরে Parent
                  বদলালে চলমান Child জানে না, আর Child এর বদল কখনো Parent এ ফেরে না।
                </ListItem>
                <ListItem>
                  PATH হলো Folder এর তালিকা, বাম থেকে ডানে খোঁজা হয়, প্রথম মিলটাই চলে।{" "}
                  <code>type -a</code> দিয়ে আগে দেখে নিন। sudo নিজের ছোট Environment আর secure_path নেয়।
                </ListItem>
                <ListItem>
                  কোন File পড়া হবে তা নির্ভর করে চালু হওয়ার পথের উপর। Login আর Interactive Shell সব পড়ে,
                  Script কিছুই পড়ে না, Cron শুধু /etc/environment, আর systemd কোনো Shell এর File ই না।
                </ListItem>
                <ListItem>
                  Service এর মান Unit এর <code>Environment=</code> আর <code>EnvironmentFile=</code> থেকে।
                  File টা root এর 600, systemd নিজে পড়ে। Unit File সবাই পড়তে পারে, তাই Secret সেখানে নয়।
                  মান বদলালে Restart।
                </ListItem>
                <ListItem>
                  একই .env চারজন পাঠক চারভাবে পড়ে। নিরাপদ উপভাষা মেনে চলুন: Space নয়, export নয়, পাশে
                  মন্তব্য নয়, $ নয়, Space বা # থাকলে Double Quote।
                </ListItem>
                <ListItem>
                  একটা Config Module চালুর মুহূর্তে সব যাচাই করে, সব ভুল একসাথে বলে, Secret ছাপে না, Exit
                  Code 1 দিয়ে থামে। NEXT_PUBLIC_ মান Build এ জমে Browser এ যায়, তাই সেখানে Secret কখনো নয়।
                </ListItem>
                <ListItem>
                  Secret ফাঁসের পথ: Git এর ইতিহাস, Shell History, ps এর Argument, Log, URL, Bundle, খোলা
                  File, Chat। ফাঁস হলে প্রথম কাজ নতুন মান বসানো আর পুরনোটা বাতিল করা।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর লেসন ০৬, Firewall Management (ufw)",
          content: (
            <p>
              আপনার my-tours API এখন একটা Service, নিজের মান নিয়ে, শুধু <code>127.0.0.1:3000</code> এ
              শুনছে। কিন্তু Server টা Internet এ খোলা, আর তার আরও অনেক Port আছে। কোনগুলো বাইরের দুনিয়া
              ছুঁতে পারবে আর কোনগুলো পারবে না, সেই সিদ্ধান্ত নেয় Firewall। কেন Database এর 5432 কখনো
              খোলা থাকে না, নিজেকে তালাবন্ধ না করে কীভাবে Firewall চালু করতে হয়, আর Docker কীভাবে চুপচাপ
              Firewall কে পাশ কাটায়, সব পরের লেসনে:{" "}
              <Link href="/devops/topic/firewall-ufw" className={linkClass}>
                Firewall Management (ufw)
              </Link>
              ।
            </p>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      ["Configuration", "যা জায়গাভেদে বদলায়, Code বদলায় না। থাকে Environment এ"],
      ["Environment", "প্রতিটা Process এর NAME=value তালিকা, মান সবসময় Text"],
      ["export", "নামটা Shell এর খাতা থেকে Environment এ তোলে, যাতে Child কপি পায়"],
      ["উত্তরাধিকার", "Child পায় কপি, জন্মের সময়। Child এর বদল Parent এ ফেরে না"],
      ["source", "Script কে Child না বানিয়ে নিজের Shell এ চালায়, তাই মান থেকে যায়"],
      ["env -i", "খালি Environment দিয়ে চালানো। App এর যাচাই পরীক্ষার ভালো উপায়"],
      ["sudo", "env_reset আর secure_path, আপনার মান root এর হাতে যায় না"],
      ["PATH", "Command খোঁজার Folder তালিকা, বাম থেকে ডানে, প্রথম মিলটাই চলে"],
      ["Startup Files", "Login পড়ে ~/.profile, Interactive পড়ে ~/.bashrc, Script কিছুই পড়ে না"],
      ["/etc/environment", "PAM পড়ে, SSH আর Cron পায়, systemd পায় না। Script নয়"],
      ["EnvironmentFile", "systemd root হিসেবে পড়ে Service কে মান দেয়। File টা 600"],
      ["Environment=", "Unit File এর ভেতরের মান, সবাই পড়তে পারে, শুধু নিরীহ মান"],
      ["নিরাপদ উপভাষা", "Space, export, পাশে মন্তব্য, $ ছাড়া। Space বা # থাকলে Double Quote"],
      ["--env-file", "Node 20.6 থেকে। আগে থাকা মান জেতে, File না থাকলে চালু হয় না"],
      ["Config Module", "চালুর মুহূর্তে একবার পড়া আর যাচাই, সব ভুল একসাথে, Fallback নেই"],
      ["NEXT_PUBLIC_", "Build এ Bundle এ লেখা হয়ে Browser এ যায়, Secret কখনো নয়"],
      ["Rotation", "নতুন মান বানানো, সব জায়গায় বসানো, Restart, পুরনোটা বাতিল"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Terminal এ PORT=3000 লিখে তারপর node server.mjs চালালেন। App এর process.env.PORT কী দেখাবে?",
        options: [
          { key: "A", text: "\"3000\"", isCorrect: false, explanation: "লাইনটা মান বসিয়েছে শুধু Shell এর নিজের খাতায়। export ছাড়া Child সেটা পায় না।" },
          { key: "B", text: "undefined", isCorrect: true, explanation: "ঠিক। PORT এখনো শুধু Shell Variable। Child পায় কেবল export করা নামের কপি।" },
          { key: "C", text: "3000, সংখ্যা হিসেবে", isCorrect: false, explanation: "Environment এর মান কখনো সংখ্যা নয়, আর এখানে তো মানটা পৌঁছায়ইনি।" },
          { key: "D", text: "Node নিজে থেকে 3000 ধরে নেবে", isCorrect: false, explanation: "Node কোনো Default Port ধরে না। আর এই Course এ আমরা App কেও এমন করতে দিই না।" },
        ],
      },
      {
        id: 2,
        text: "একটা Service চলছে। আপনি তার Environment File এ PORT বদলালেন। চলমান Process কী করবে?",
        options: [
          { key: "A", text: "কয়েক সেকেন্ডের মধ্যে নতুন Port এ চলে যাবে", isCorrect: false, explanation: "Process কখনো নিজের Environment File আবার পড়ে না। তার কাছে আছে জন্মের সময়ের কপি।" },
          { key: "B", text: "কিছুই না, পুরনো মানেই চলবে, Restart করলে নতুন মান পাবে", isCorrect: true, explanation: "ঠিক। কপি হয় একবার, জন্মের সময়। systemctl restart নতুন Process বানায়, সে নতুন কপি পায়।" },
          { key: "C", text: "systemctl reload দিলেই নতুন মান নেবে", isCorrect: false, explanation: "Reload তখনই কাজ করে যখন Service কে Reload শেখানো হয়েছে, আর তাতেও Environment বদলায় না। লেসনে দেখেছেন, reload ব্যর্থ হয়েছে।" },
          { key: "D", text: "Crash করবে", isCorrect: false, explanation: "File বদলানোয় চলমান Process এর কিছুই হয় না। সে জানতেই পারে না।" },
        ],
      },
      {
        id: 3,
        text: "~/.bashrc এর শেষে export DATABASE_URL=... লিখেছেন। কোন পথে চালু হওয়া Process এই মান পাবে?",
        options: [
          { key: "A", text: "systemd Service", isCorrect: false, explanation: "systemd কোনো Shell চালায় না, তাই কোনো Shell এর File ও পড়ে না।" },
          { key: "B", text: "Cron Job", isCorrect: false, explanation: "Ubuntu তে Cron শুধু /etc/environment পড়ে, আপনার ~/.bashrc নয়।" },
          { key: "C", text: "ssh island 'node migrate.mjs'", isCorrect: false, explanation: "এটা Interactive নয়। ~/.bashrc পড়া শুরু হলেও শুরুর পাহারায় থেমে যায়, শেষের লাইনে পৌঁছায় না।" },
          { key: "D", text: "SSH দিয়ে Login করে Terminal থেকে চালানো Program", isCorrect: true, explanation: "ঠিক। Interactive Login Shell পুরো ~/.bashrc পড়ে, আর তার Child রা কপি পায়। এই কারণেই Terminal এ কাজ করে, Service এ করে না।" },
        ],
      },
      {
        id: 4,
        text: "my-tours এর Unit File এ কোন লাইনটা রাখা ভুল?",
        options: [
          { key: "A", text: "Environment=NODE_ENV=production", isCorrect: false, explanation: "NODE_ENV গোপন কিছু নয়, Unit File এ রাখা ঠিক আছে।" },
          { key: "B", text: "EnvironmentFile=/etc/my-tours/api.env", isCorrect: false, explanation: "এটাই সঠিক জায়গা, File টা root এর 600।" },
          { key: "C", text: "Environment=SESSION_SECRET=...", isCorrect: true, explanation: "ঠিক। Unit File সবাই পড়তে পারে, আর systemctl show দিয়ে যেকোনো User এই মান দেখে ফেলে। Secret যায় EnvironmentFile এ।" },
          { key: "D", text: "ExecStart=/usr/bin/node /srv/my-tours/server.mjs", isCorrect: false, explanation: "পুরো ঠিকানা লেখাই ভালো, PATH এর উপর ভরসা করতে হয় না।" },
        ],
      },
      {
        id: 5,
        text: ".env File এ DB_PASSWORD=abc#123 লেখা। Node এর --env-file দিয়ে পড়লে মান কী হবে?",
        options: [
          { key: "A", text: "abc#123", isCorrect: false, explanation: "bash আর systemd এটাই পায়, কিন্তু Node # এর পরের অংশ মন্তব্য ধরে ফেলে দেয়।" },
          { key: "B", text: "abc", isCorrect: true, explanation: "ঠিক। Node আর Next.js # কে মন্তব্যের শুরু ধরে। নিরাপদ লেখা হলো DB_PASSWORD=\"abc#123\"।" },
          { key: "C", text: "Node চালু হবে না", isCorrect: false, explanation: "কোনো Error নেই, আর সেটাই বিপদ। মান চুপচাপ বদলে যায়।" },
          { key: "D", text: "খালি String", isCorrect: false, explanation: "# এর আগের অংশটুকু থাকে, তাই abc।" },
        ],
      },
      {
        id: 6,
        text: "একটা Tool এর Password দেওয়ার দুইটা উপায়: --password=... Argument, অথবা একটা Environment Variable। কোনটা ভালো আর কেন?",
        options: [
          { key: "A", text: "Argument, কারণ সেটা Environment এর চেয়ে দ্রুত", isCorrect: false, explanation: "গতির কোনো পার্থক্য নেই। প্রশ্নটা কে দেখতে পায়।" },
          { key: "B", text: "Environment, কারণ Argument যন্ত্রের যেকোনো User ps দিয়ে দেখতে পারে", isCorrect: true, explanation: "ঠিক। লেসনের পরীক্ষায় nobody User Argument এর Password দেখেছে, কিন্তু environ পড়তে গিয়ে Permission denied পেয়েছে।" },
          { key: "C", text: "দুইটাই সমান নিরাপদ", isCorrect: false, explanation: "না। /proc/<PID>/cmdline সবার জন্য খোলা, /proc/<PID>/environ শুধু মালিক আর root এর।" },
          { key: "D", text: "দুইটাই সমান অনিরাপদ, তাই Password Code এ লিখুন", isCorrect: false, explanation: "Code এ লেখা মানে Git এ যাওয়া, এটা সবচেয়ে খারাপ।" },
        ],
      },
      {
        id: 7,
        text: "Next.js App এ NEXT_PUBLIC_API_URL এর মান Vercel এ বদলালেন, কিন্তু সাইটে পুরনো মানই দেখা যাচ্ছে। কেন?",
        options: [
          { key: "A", text: "Browser এর Cache", isCorrect: false, explanation: "Cache হতে পারত, কিন্তু আসল কারণ আরও মৌলিক: মানটা Build এর সময় JavaScript এ লেখা হয়ে গেছে।" },
          { key: "B", text: "NEXT_PUBLIC_ মান Build এর সময় Bundle এ বসে যায়, নতুন মান পেতে Redeploy লাগে", isCorrect: true, explanation: "ঠিক। আর Vercel এও মান বদলানো শুধু নতুন Deployment এ লাগে।" },
          { key: "C", text: "Vercel Environment Variable সমর্থন করে না", isCorrect: false, explanation: "করে, প্রতিটা পরিবেশের জন্য আলাদা করে।" },
          { key: "D", text: "নামটা NEXT_PUBLIC_ দিয়ে শুরু হওয়ায় Server এটা পড়তে পারে না", isCorrect: false, explanation: "Server ও পারে। সমস্যা হলো Browser এর Code এ মানটা Build এর সময়েই জমে গেছে।" },
        ],
      },
      {
        id: 8,
        text: "দলের একজন ভুল করে SESSION_SECRET সহ .env Commit করে GitHub এ Push করেছেন। প্রথম কাজ কোনটা?",
        options: [
          { key: "A", text: "File টা মুছে নতুন একটা Commit করা", isCorrect: false, explanation: "আজকের File এর তালিকা থেকে যায়, ইতিহাস থেকে নয়। git log -S দিয়ে মান এখনো পাওয়া যায়।" },
          { key: "B", text: "git filter-repo দিয়ে ইতিহাস থেকে মুছে Force Push", isCorrect: false, explanation: "এটা পরে করা যায়, কিন্তু যারা ইতিমধ্যে Clone করেছে তাদের কাছে মান থেকে যায়। ফাঁস হওয়া মান ফেরত আসে না।" },
          { key: "C", text: "নতুন Secret বানিয়ে সব জায়গায় বসানো, Restart, আর পুরনোটা বাতিল", isCorrect: true, explanation: "ঠিক। ফাঁস হওয়া মান অকেজো করাই একমাত্র আসল সমাধান। মনে রাখবেন, এতে সবার Session বাতিল হবে।" },
          { key: "D", text: "Repository টা Private করে দেওয়া", isCorrect: false, explanation: "যারা দেখেছে বা Clone করেছে, তাদের কাছে তো মানটা আছেই।" },
        ],
      },
    ],
  },
  practicalLab: {
    title: "Environment এর প্রতিটা নিয়ম নিজের Server এ ঘটান",
    subtitle: "ছয়টা Script, লেসন ০১ এর Practice Server এ, deploy হিসেবে",
    stepName: "LAB",
    steps: [
      {
        title: "উত্তরাধিকার",
        description:
          "1-inherit.sh চালান। ছয়টা লাইনের প্রতিটার পাশে লিখুন কোন নিয়মে ওই মান এল: export ছিল কি না, কপি কখন হয়েছিল, কে কার মান বদলাল।",
      },
      {
        title: "PATH এর ক্রম",
        description:
          "2-path.sh চালান। দেখুন একই নামের দুইটা Command এর কোনটা চলে আর PATH এর ক্রম বদলালে কী হয়। তারপর Logout করে আবার ঢুকে echo $PATH দেখুন, ~/bin নিজে থেকেই সামনে চলে এসেছে।",
      },
      {
        title: "কে কোন File পড়ে",
        description:
          "3-startup-files.sh চালান, তারপর নিজে ssh localhost করে show-markers login দিন। লেসনের টেবিলের সাথে মিলিয়ে নিন, শেষে clean দিয়ে চিহ্নগুলো মুছুন।",
      },
      {
        title: "Service আর EnvironmentFile",
        description:
          "সেকশন ০১০ এর config.mjs টা ~/config.mjs এ রাখুন, তারপর 4-my-tours-service.sh চালান। প্রথম চেষ্টায় হারানো মানের বার্তা, দ্বিতীয় চেষ্টায় চালু App, দুইটাই দেখবেন।",
      },
      {
        title: "চারজন পাঠক",
        description:
          "5-env-dialects.sh চালান। Practice Server এর apt থেকে বসানো Node 18 হলে তৃতীয় পাঠক bad option বলবে, সেটাও একটা শিক্ষা। Node 20.6 বা নতুন থাকলে লেসনের টেবিলের সাথে মিলিয়ে নিন।",
      },
      {
        title: "Secret ফাঁস",
        description:
          "6-secret-leaks.sh চালান: nobody User আপনার Argument দেখবে কিন্তু Environment দেখবে না, আর Git পুরনো Secret খুঁজে দেবে। শেষে Script এর বলা তিনটা লাইন নিজে টাইপ করে History দেখুন।",
      },
    ],
    codeBlocks: [
      { filename: "1-inherit.sh", language: "bash", code: `#!/bin/bash
# চালান: bash 1-inherit.sh   (Practice Server এ, deploy হিসেবে)
# প্রশ্ন একটাই: Parent এর কোন মান Child দেখতে পায়, আর কখন।

PORT=3000
node -e 'console.log("1. export এর আগে, child দেখে PORT =", process.env.PORT)'

export PORT
node -e 'console.log("2. export এর পরে, child দেখে PORT =", process.env.PORT)'

# একটা Child চালু করে রাখি, তারপর Parent এ মান বদলাই
sleep 60 &
CHILD=$!
PORT=4000
echo "3. Parent এ এখন PORT = $PORT"
echo "   চলমান Child এর নিজের কপি: $(tr '\\0' '\\n' < /proc/$CHILD/environ | grep '^PORT=')"
kill $CHILD

bash -c 'export PORT=9999; echo "4. Child নিজে বদলাল, তার কাছে PORT = $PORT"'
echo "5. Parent এ ফিরে PORT = $PORT"

unset PORT
node -e 'console.log("6. unset এর পরে, child দেখে PORT =", process.env.PORT)'` },
      { filename: "2-path.sh", language: "bash", code: `#!/bin/bash
# চালান: bash 2-path.sh
# নিজের একটা Command বানিয়ে দেখি PATH কীভাবে খোঁজে।

mkdir -p ~/bin
printf '#!/bin/bash\\necho "hello, from ~/bin"\\n' > ~/bin/hello

echo "--- ১. File আছে, কিন্তু PATH এ নেই, আর Execute Permission ও নেই"
hello

chmod +x ~/bin/hello
echo "--- ২. পুরো ঠিকানা দিলে PATH লাগেই না"
~/bin/hello

echo "--- ৩. ~/bin কে PATH এর সামনে বসাই"
export PATH="$HOME/bin:$PATH"
hello
type -a hello

echo "--- ৪. একই নামে আরেকটা Command, /usr/local/bin এ"
printf '#!/bin/bash\\necho "hello, from /usr/local/bin"\\n' | sudo tee /usr/local/bin/hello > /dev/null
sudo chmod +x /usr/local/bin/hello
type -a hello
hello

echo "--- ৫. ~/bin কে PATH এর শেষে সরাই"
export PATH="\${PATH#"$HOME/bin:"}:$HOME/bin"
hash -r
hello

echo "--- ৬. node আসলে কোনটা চলছে"
type -a node
node --version

# পরিষ্কার করুন
sudo rm /usr/local/bin/hello` },
      { filename: "3-startup-files.sh", language: "bash", code: `#!/bin/bash
# চালান: bash 3-startup-files.sh          (চিহ্ন বসায় আর পরীক্ষা করে)
#        bash 3-startup-files.sh clean    (সব চিহ্ন মুছে দেয়)
# প্রতিটা শুরুর File এ একটা চিহ্ন বসাই, তারপর দেখি কোন পথে চালু হলে কোনটা পড়া হয়।
set -e

if [ "$1" = "clean" ]; then
  sudo sed -i '/^FROM_ETC_ENVIRONMENT=/d' /etc/environment
  sudo rm -f /etc/profile.d/zz-marker.sh /usr/local/bin/show-markers
  sed -i '/^export FROM_BASHRC_/d' ~/.bashrc
  sed -i '/^export FROM_PROFILE=/d' ~/.profile
  echo "চিহ্নগুলো মোছা হলো।"
  exit 0
fi

echo 'FROM_ETC_ENVIRONMENT=yes' | sudo tee -a /etc/environment > /dev/null
echo 'export FROM_PROFILE_D=yes' | sudo tee /etc/profile.d/zz-marker.sh > /dev/null
sed -i '1i export FROM_BASHRC_TOP=yes' ~/.bashrc
echo 'export FROM_BASHRC_BOTTOM=yes' >> ~/.bashrc
echo 'export FROM_PROFILE=yes' >> ~/.profile

sudo tee /usr/local/bin/show-markers > /dev/null <<'SCRIPT'
#!/bin/bash
found=""
for v in FROM_ETC_ENVIRONMENT FROM_PROFILE_D FROM_PROFILE FROM_BASHRC_TOP FROM_BASHRC_BOTTOM; do
  [ -n "\${!v}" ] && found="$found $v"
done
printf '%-16s %s\\n' "$1:" "\${found:- (কিছুই না)}"
SCRIPT
sudo chmod +x /usr/local/bin/show-markers

# ssh localhost এর জন্য নিজের যন্ত্রে নিজের চাবি (লেসন ০৩ এ বিস্তারিত)
[ -f ~/.ssh/id_ed25519 ] || ssh-keygen -q -t ed25519 -N "" -f ~/.ssh/id_ed25519
grep -qxFf ~/.ssh/id_ed25519.pub ~/.ssh/authorized_keys 2>/dev/null || cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

env -i HOME="$HOME" PATH=/usr/local/bin:/usr/bin:/bin bash -c 'show-markers "bash -c"'
env -i HOME="$HOME" PATH=/usr/local/bin:/usr/bin:/bin bash -ic 'show-markers "bash -ic"' 2>/dev/null
env -i HOME="$HOME" PATH=/usr/local/bin:/usr/bin:/bin bash -lc 'show-markers "bash -lc"'
ssh -o StrictHostKeyChecking=accept-new -o LogLevel=ERROR localhost 'show-markers "ssh command"'
echo
echo "এবার নিজে একবার ssh localhost দিয়ে ঢুকে show-markers login চালান, তারপর exit।"` },
      { filename: "4-my-tours-service.sh", language: "bash", code: `#!/bin/bash
# চালান: bash 4-my-tours-service.sh   (আগে সেকশন ০১০ এর config.mjs টা ~/config.mjs এ রাখুন)
# my-tours API কে systemd Service হিসেবে চালাই, আর Environment File থেকে মান দিই।
set -e
test -f ~/config.mjs || { echo "~/config.mjs নেই। সেকশন ০১০ থেকে কপি করুন।"; exit 1; }

# ১. App এর নিজের User, যে Login করতে পারে না (লেসন ০৪)
id mytours >/dev/null 2>&1 || sudo useradd --system --no-create-home --shell /usr/sbin/nologin mytours

# ২. Code এর জায়গা
sudo mkdir -p /srv/my-tours /etc/my-tours
sudo cp ~/config.mjs /srv/my-tours/config.mjs
sudo tee /srv/my-tours/server.mjs > /dev/null <<'JS'
import http from "node:http";
import { config } from "./config.mjs";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({ ok: true, env: config.nodeEnv }));
});

server.listen(config.port, "127.0.0.1", () => {
  console.log(\`my-tours-api listening on 127.0.0.1:\${config.port} (\${config.nodeEnv})\`);
});
JS

# ৩. Environment File: শুধু root পড়তে পারে। Secret টা কেউ টাইপ করে না, openssl বানায়।
#    ইচ্ছা করে DATABASE_URL বাদ রাখা হলো, App কী বলে দেখার জন্য।
sudo install -m 600 -o root -g root /dev/null /etc/my-tours/api.env
sudo tee /etc/my-tours/api.env > /dev/null <<ENV
# my-tours API, production. Owner root, mode 600. Never commit this file.
PORT=3000
SESSION_SECRET=$(openssl rand -base64 32)
ENV

# ৪. Unit File (লেসন ০২ এ প্রতিটা লাইন)। এখানে কোনো Secret নেই, এই File সবাই পড়তে পারে।
sudo tee /etc/systemd/system/my-tours-api.service > /dev/null <<'UNIT'
[Unit]
Description=my-tours API
After=network.target

[Service]
User=mytours
Group=mytours
WorkingDirectory=/srv/my-tours
Environment=NODE_ENV=production
EnvironmentFile=/etc/my-tours/api.env
ExecStart=/usr/bin/node /srv/my-tours/server.mjs
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
UNIT

sudo systemctl daemon-reload
sudo systemctl restart my-tours-api
sleep 2
echo "--- প্রথম চেষ্টা, DATABASE_URL ছাড়া:"
sudo journalctl -u my-tours-api -n 4 --no-pager -o cat

# ৫. হারানো মানটা যোগ করে আবার চালু
echo 'DATABASE_URL=postgresql://mytours@127.0.0.1:5432/mytours' | sudo tee -a /etc/my-tours/api.env > /dev/null
sudo systemctl restart my-tours-api
sleep 2
echo "--- দ্বিতীয় চেষ্টা:"
sudo journalctl -u my-tours-api -n 1 --no-pager -o cat
curl -s 127.0.0.1:3000; echo` },
      { filename: "5-env-dialects.sh", language: "bash", code: `#!/bin/bash
# চালান: bash 5-env-dialects.sh
# একটা .env File, তিনজন পাঠক। একই লাইন কে কীভাবে পড়ে দেখি।
cd "$(mktemp -d)"

cat > tricky.env <<'ENV'
NODE_ENV = production
export SHUTDOWN_GRACE_MS=10000
PUBLIC_URL=https://$HOST_NAME/tours
REDIS_URL=redis://127.0.0.1:6379 # local redis
PASSWORD=abc#123
UNQUOTED_SPACE=Island Tours
ENV

cat > show.sh <<'SH'
for k in NODE_ENV SHUTDOWN_GRACE_MS PUBLIC_URL REDIS_URL PASSWORD UNQUOTED_SPACE; do
  if [ -n "\${!k+x}" ]; then printf '  %-18s [%s]\\n' "$k" "\${!k}"; else printf '  %-18s (নেই)\\n' "$k"; fi
done
SH

echo "--- পাঠক ১: bash, set -a; source"
env -i PATH=/usr/bin:/bin HOST_NAME=islandtours.example bash -c 'set -a; source ./tricky.env; set +a; bash show.sh'

echo "--- পাঠক ২: systemd EnvironmentFile"
sudo systemd-run --quiet --wait --pipe --uid="$USER" -p EnvironmentFile="$PWD/tricky.env" \\
  -p Environment=HOST_NAME=islandtours.example /bin/bash "$PWD/show.sh"

echo "--- পাঠক ৩: node --env-file (Node 20.6 বা নতুন লাগে)"
node --env-file=tricky.env -e '
for (const k of ["NODE_ENV","SHUTDOWN_GRACE_MS","PUBLIC_URL","REDIS_URL","PASSWORD","UNQUOTED_SPACE"])
  console.log("  " + k.padEnd(18), k in process.env ? "[" + process.env[k] + "]" : "(নেই)")'` },
      { filename: "6-secret-leaks.sh", language: "bash", code: `#!/bin/bash
# চালান: bash 6-secret-leaks.sh
# একটা নকল Secret তিনটা পথে ফাঁস হয় কি না দেখি। কোনো আসল মান এখানে ব্যবহার করবেন না।

echo "--- ১. Argument সবাই দেখে, Environment শুধু মালিক"
DB_PASSWORD=not-a-real-password-env node -e 'setTimeout(() => {}, 60000)' -- --db-password=not-a-real-password-arg &
P=$!
sleep 1
echo "  অন্য User (nobody) ps এ দেখে:"
sudo -u nobody ps -o args= -p "$P"
echo "  অন্য User environ পড়তে চায়:"
sudo -u nobody cat /proc/$P/environ 2>&1 | sed 's/^/  /'
kill "$P"

echo "--- ২. Git ভোলে না"
cd "$(mktemp -d)" && git init -q -b main
git config user.name "lab" && git config user.email "lab@mail.example"
printf 'PORT=3000\\nSESSION_SECRET=not-a-real-secret-committed\\n' > .env
git add .env && git commit -q -m "first version"
git rm -q --cached .env && echo ".env" > .gitignore
git add .gitignore && git commit -q -m "remove .env, ignore it"
echo "  আজকের Git এ File গুলো:"; git ls-files | sed 's/^/    /'
echo "  পুরো ইতিহাসে খুঁজলে:"
git log -p -S SESSION_SECRET --format='    commit %h %s' | grep -E '^    commit|SESSION_SECRET'

echo "--- ৩. Shell History এর জন্য নিজে টাইপ করে দেখুন (এই Script পারবে না):"
echo "    export SESSION_SECRET=not-a-real-secret-typed"
echo "     export SESSION_SECRET=not-a-real-secret-spaced   # শুরুতে একটা Space"
echo "    history | tail -3"` },
    ],
    tip: "পরীক্ষা ৩ আর ৪ পাশাপাশি রেখে ভাবুন, কারণ ভূমিকার রাতের পুরো রহস্যটা এই দুইটার মাঝখানে। পরীক্ষা ৩ দেখায় আপনার Terminal কতগুলো File থেকে মান কুড়িয়ে আনে, আর systemd এর সারিতে একটাও নেই। পরীক্ষা ৪ দেখায় Service তাহলে মান পায় কোথা থেকে, আর মান না পেলে ভালো App কী বলে। Production এ কেউ বললে Terminal এ চলে কিন্তু Service এ চলে না, প্রথম প্রশ্নটা এখন আপনি জানেন: মানটা কোন File এ লেখা, আর এই Process টা কোন পথে চালু হয়েছে।",
  },
  assignment: {
    title: "Mini Project: my-tours এর জন্য Configuration এর পুরো ব্যবস্থা",
    time: "৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>নামের তালিকা আর .env.example:</strong> my-tours এর Code এ যত জায়গায় Environment পড়া
        হয় খুঁজে বের করুন (<code>{"grep -rn \"process.env\" ."}</code>)। প্রতিটা নামের জন্য ঠিক করুন সেটা
        Secret কি না, কোন জায়গায় কী মান হবে, আর না থাকলে কী হবে। তারপর Repository তে একটা{" "}
        <code>.env.example</code> বানান, প্রতিটা নামের উপরে এক লাইনের মন্তব্য, আর .gitignore এ{" "}
        <code>.env*</code> ও <code>!.env.example</code>। <code>git check-ignore -v</code> দিয়ে প্রমাণ
        দিন।
      </span>,
      <span key="2">
        <strong>Config Module বসান:</strong> সেকশন ০১০ এর config.mjs নিজের my-tours এ বসান, নিজের সব
        নাম যোগ করে। পুরো Code থেকে বাকি সব <code>process.env</code> সরিয়ে শুধু <code>config</code>{" "}
        ব্যবহার করুন। তারপর <code>env -i</code> দিয়ে তিনবার চালান, একবার কিছু না দিয়ে, একবার সব ভুল
        দিয়ে, একবার সব ঠিক দিয়ে, আর তিনটা Output জমা দিন। কোনো Output এ কোনো Secret এর মান থাকলে
        Module টা ঠিক করুন।
      </span>,
      <span key="3">
        <strong>Service আর File এর অনুমতি:</strong> Practice Server এ my-tours-api.service চালু করুন,
        EnvironmentFile সহ। প্রমাণ দিন তিনটা কথার: File টা root এর 600, App এর User নিজে File খুলতে
        পারে না অথচ App সব মান পায়, আর অন্য একজন User <code>systemctl show</code> দিয়ে কোনো Secret
        দেখতে পায় না। প্রতিটার জন্য একটা Command আর তার Output।
      </span>,
      <span key="4">
        <strong>একটা Secret Rotate করুন:</strong> my-tours এর SESSION_SECRET বদলান সেকশন ০১৪ এর ছয়
        ধাপ মেনে, কিন্তু মানটা একবারও টাইপ না করে। প্রতিটা ধাপে কোন Command চালালেন লিখুন, আর শেষে{" "}
        <code>history</code> এর শেষ বিশটা লাইন দেখিয়ে প্রমাণ দিন যে মানটা কোথাও নেই। Rotation এর পর
        আগের Login করা Browser এ কী ঘটল, সেটাও লিখুন।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> দলের নতুন একজন সদস্য লিখেছেন, Server এ
        ~/.bashrc এ DATABASE_URL লিখেছি, Terminal এ node চালালে চলে, কিন্তু systemctl start দিলে বলে
        DATABASE_URL is not set, systemd কি ভাঙা? তাঁকে বুঝিয়ে বলুন মানটা আসলে কোথায় ছিল, systemd কেন
        দেখেনি, মানটা কোথায় রাখা উচিত আর কেন সেই File এর অনুমতি 600, আর পরের বার এরকম কিছু হলে কোন
        দুইটা Command দিয়ে নিজেই ধরতে পারবেন।
      </span>,
    ],
    deliverables: [
      <span key="1">.env.example, .gitignore এর লাইন, আর git check-ignore এর Output</span>,
      <span key="2">নিজের config.mjs আর env -i দিয়ে তিনবার চালানোর Output</span>,
      <span key="3">তিনটা দাবির প্রতিটার জন্য Command আর Output</span>,
      <span key="4">Rotation এর ধাপগুলোর Command, history এর প্রমাণ, আর Session এর কী হলো</span>,
      <span key="5">নতুন সদস্যের জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
