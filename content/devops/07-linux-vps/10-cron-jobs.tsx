/**
 * What: Module 07, Lesson 10 of the DevOps track: Cron and Scheduled Tasks. It covers the cron
 * daemon, the five time fields and their traps, crontab, the system cron files, cron's small
 * environment, where output and logs go, time zones, overlapping runs with flock, systemd timers
 * with Persistent, OnFailure and the other options, how to choose between the two, and how to find
 * out why a job did not run. The hands-on part builds the my-tours nightly backup end to end.
 *
 * Why: A server has to do work when nobody is logged in, and a scheduled job fails quietly, often
 * weeks before anyone needs its result. Every output in the lesson comes from a real Ubuntu 24.04
 * practice server, including each trap triggered on purpose, so the reader learns the exact error
 * text before meeting it at work. Lesson 11 builds on the backup timer written here.
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
  CronExpressionLab,
  JobDebugLab,
  MissedRunLab,
  OverlapLab,
} from "../../../components/course/topics/linux/cron-animations";
import {
  CronEnvSplit,
  CronFieldsDiagram,
  CronPlacesDiagram,
  CronTimezoneDiagram,
  IslandScheduleDiagram,
  TimerPairDiagram,
} from "../../../components/course/topics/linux/cron-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

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

export const cronJobsContent: TopicData = {
  id: "cron-jobs",
  introduction: {
    badge: "MODULE 07 · LESSON 10",
    title: <SectionTitle>কেউ না জাগলেও যে কাজ ঠিক সময়ে হয়</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          শনিবার সকাল। my-tours এর একজন নতুন সদস্য রাতে একটা ভুল UPDATE চালিয়ে ফেলেছেন,
          পঞ্চাশটা বুকিংয়ের তারিখ বদলে গেছে। কেউ ঘাবড়ালেন না, কারণ তিন সপ্তাহ আগে দলের
          আরেকজন একটা রাতের Backup বসিয়েছিলেন। তিনি নিজের Terminal এ Script টা চালিয়ে
          দেখেছিলেন, সুন্দর একটা Archive তৈরি হয়েছিল, তারপর crontab এ একটা লাইন যোগ করে
          নিশ্চিন্তে ঘুমাতে গিয়েছিলেন।
        </ContentParagraph>
        <ContentParagraph>
          আজ Backup এর Folder খোলা হলো। Folder টা খালি। তিন সপ্তাহে একবারও চলেনি। কোনো
          Error দেখা যায়নি, কোনো Mail আসেনি, কেউ কিছু টের পাননি। পরে জানা গেল কারণটা ছিল
          একটা মাত্র চিহ্ন, Archive এর নামের তারিখে লেখা একটা <code>%</code>।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন সেই ধরনের কাজ নিয়ে, যা Server এ কেউ Login না থাকলেও নির্দিষ্ট সময়ে নিজে
          থেকে চলে: রাতের Backup, পুরনো File পরিষ্কার, প্রতি ঘণ্টার একটা রিপোর্ট। দুইটা
          যন্ত্র শিখবেন, পুরনো আর সব জায়গায় থাকা <strong>cron</strong>, আর নতুন আর বেশি
          যত্নশীল <strong>systemd Timer</strong>। শিখবেন সময়ের পাঁচটা ঘর কীভাবে পড়তে হয় আর
          কোন লাইন যা বলে তা করে না, cron এর ভেতরের দুনিয়া কেন আপনার Terminal এর মতো নয়,
          Server এর ঘড়ি UTC আর আপনার ঘড়ি ঢাকা হলে কী হয়, একই কাজ দুইবার একসাথে চলা কীভাবে
          থামাতে হয়, Server বন্ধ থাকলে ফসকে যাওয়া Run এর কী হয়, আর একটা Job চলেনি তো
          কোথায় খুঁজবেন। প্রতিটা ফাঁদ একটা আসল Ubuntu 24.04 Server এ ইচ্ছা করে ঘটানো হয়েছে,
          তাই Error এর লেখাগুলো আপনি কাজের জায়গায় দেখার আগেই চিনে রাখবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "যে কাজ মনে করে করতে হয়, সেটা একদিন বাদ পড়বেই। তাই কাজটা একজন পাহারাদারের হাতে দিন, যে কখনো ঘুমায় না। কিন্তু মনে রাখবেন, পাহারাদার শুধু সময় হলে দরজা খোলে, ভেতরে কাজটা ঠিকঠাক হলো কি না সেটা দেখার দায়িত্ব আপনার।",
      author: "cron",
      role: "Lesson 10",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-schedule",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Server এ কেউ না থাকলেও যে কাজ সময়মতো হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা হোটেলের রাতের পাহারাদারের কথা ভাবুন। তাঁর হাতে একটা খাতা, তাতে লেখা কোন
                সময়ে কী করতে হবে: রাত বারোটায় মূল দরজা বন্ধ, তিনটায় জেনারেটরের তেল দেখা, ভোর
                ছয়টায় পানির পাম্প চালু। হোটেলের মালিক ঘুমিয়ে থাকেন, কিন্তু কাজগুলো ঠিক সময়ে
                হয়। পাহারাদার প্রতি মিনিটে ঘড়ি দেখেন আর খাতা মেলান।
              </ContentParagraph>
              <ContentParagraph>
                একটা Server এর জীবনেও এমন কাজ অনেক, যেগুলো কোনো মানুষের Click এ শুরু হয় না,
                শুরু হয় ঘড়ির সময়ে। Island Tours এর মতো একটা সেবায় কয়েকটা উদাহরণ:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>রাতের Backup।</strong> প্রতিদিন ভোর সাড়ে তিনটায় Database এর একটা
                  কপি, যখন বুকিং প্রায় শূন্য।
                </ListItem>
                <ListItem>
                  <strong>পরিষ্কার করা।</strong> সাত দিনের পুরনো Backup মুছে ফেলা, যাতে Disk
                  ভরে না যায় (লেসন ০৮ এ দেখেছেন Disk ভরলে কী হয়)।
                </ListItem>
                <ListItem>
                  <strong>Log ঘোরানো।</strong> বড় হয়ে যাওয়া Log File কে প্রতিদিন নতুন করে শুরু
                  করা (লেসন ০৭)।
                </ListItem>
                <ListItem>
                  <strong>Security Update।</strong> প্রতিদিন নতুন Patch খুঁজে বসানো (লেসন ০৩)।
                </ListItem>
                <ListItem>
                  <strong>রিপোর্ট।</strong> প্রতি সোমবার সকালে আগের সপ্তাহের বুকিংয়ের একটা
                  হিসাব দলের কাছে পাঠানো।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Linux এ এই পাহারাদারের কাজ করার দুইটা যন্ত্র আছে। প্রথমটা{" "}
                <strong>cron</strong>, নামটা এসেছে গ্রিক শব্দ chronos থেকে, মানে সময়। এটা
                ১৯৭০ এর দশকের Unix থেকে আছে, আর আজও প্রায় প্রতিটা Linux এ পাবেন। দ্বিতীয়টা{" "}
                <strong>systemd Timer</strong>, লেসন ০২ এর সেই systemd এর একটা অংশ, যে Server
                চালু হলে সব Service চালু করে। দুইটাই একই প্রশ্নের উত্তর দেয়, কিন্তু ব্যর্থ
                হলে কী হবে, Server বন্ধ থাকলে কী হবে, Log কোথায় যাবে, এই জায়গাগুলোতে তাদের
                তফাত বড়।
              </ContentParagraph>
              <ContentParagraph>
                একটা মজার কথা দিয়ে শুরু করি। আপনি এখনো একটা কাজও Schedule করেননি, অথচ আপনার
                Server এ এই মুহূর্তে দশটা নির্ধারিত কাজ অপেক্ষা করছে। নিচের Output একটা নতুন
                Ubuntu 24.04 Practice Server এর, যেটা এই লেসনের জন্য চালানো হয়েছিল:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ systemctl list-timers --all
NEXT                            LEFT LAST PASSED UNIT                         ACTIVATES
Sat 2026-10-31 07:30:00 UTC     5min -         - sysstat-collect.timer        sysstat-collect.service
Sat 2026-10-31 07:39:08 UTC    14min -         - systemd-tmpfiles-clean.timer systemd-tmpfiles-clean.service
Sat 2026-10-31 12:20:17 UTC 4h 55min -         - motd-news.timer              motd-news.service
Sun 2026-11-01 00:00:00 UTC      16h -         - dpkg-db-backup.timer         dpkg-db-backup.service
Sun 2026-11-01 00:00:00 UTC      16h -         - logrotate.timer              logrotate.service
Sun 2026-11-01 00:06:18 UTC      16h -         - apt-daily.timer              apt-daily.service
Sun 2026-11-01 00:07:00 UTC      16h -         - sysstat-summary.timer        sysstat-summary.service
Sun 2026-11-01 03:10:00 UTC      19h -         - e2scrub_all.timer            e2scrub_all.service
Sun 2026-11-01 06:24:50 UTC      23h -         - apt-daily-upgrade.timer      apt-daily-upgrade.service
-                                  - -         - fstrim.timer                 fstrim.service

10 timers listed.`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা লাইন একটা কাজ। NEXT বলে পরের বার কখন চলবে, LEFT বলে আর কত দেরি, LAST আর
                PASSED বলে শেষ কবে চলেছিল (নতুন Server, তাই এখনো ফাঁকা), UNIT হলো Timer এর নাম,
                আর ACTIVATES বলে সময় হলে কোন Service চালু হবে। logrotate প্রতি মধ্যরাতে Log
                ঘোরায়, apt-daily নতুন Package এর তালিকা আনে, apt-daily-upgrade Security
                Update বসায়। sysstat এর দুইটা এসেছে কারণ এই Practice Server এ লেসন ০৮ এর জন্য
                sysstat বসানো আছে, আপনার Server এ তালিকাটা একটু আলাদা হতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                এই লেসনের শেষে আপনি এই তালিকার প্রতিটা শব্দ পড়তে পারবেন, নিজের একটা লাইন যোগ
                করতে পারবেন, আর জানবেন সেটা কোনো এক রাতে চুপচাপ ব্যর্থ হলে কীভাবে ধরবেন। শুরু
                করি পুরনো পাহারাদারটাকে দিয়ে, cron।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "cron-daemon",
      subHeader: { index: "002", title: "The Cron Daemon" },
      title: <SectionTitle>cron, যে প্রতি মিনিটে একবার ঘড়ি দেখে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                cron একটা <strong>Daemon</strong>। Daemon মানে এমন একটা Program যেটা পেছনে চুপচাপ
                চলতে থাকে, কোনো Terminal এর সাথে বাঁধা নয়, আর কেউ Login না থাকলেও থেমে যায় না।
                লেসন ০২ এ দেখেছেন এমন Program কে systemd একটা Service হিসেবে চালায়। cron ও তাই,
                তার Service এর নাম <code>cron.service</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ sudo systemctl status cron --no-pager
● cron.service - Regular background program processing daemon
     Loaded: loaded (/usr/lib/systemd/system/cron.service; enabled; preset: enabled)
     Active: active (running) since Sat 2026-10-31 07:24:13 UTC; 28s ago
       Docs: man:cron(8)
   Main PID: 81 (cron)
      Tasks: 1 (limit: 7039)
     Memory: 340.0K (peak: 1.4M)
        CPU: 22ms

Oct 31 07:24:13 island-vps-01 systemd[1]: Started cron.service - Regular background program processing daemon.`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                enabled মানে Server চালু হলেই systemd এটা চালু করবে, active (running) মানে এই
                মুহূর্তে চলছে। এখন cron আসলে কী করে, সেটা ধাপে ধাপে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রতি মিনিটের শুরুতে জাগে।</strong> ঠিক 07:26:00 না, 07:26:01 এর মতো,
                  মিনিটের প্রথম সেকেন্ডে। তাই cron এর সবচেয়ে ছোট একক এক মিনিট। প্রতি দশ সেকেন্ডে
                  কিছু চালাতে হলে cron ভুল যন্ত্র।
                </ListItem>
                <ListItem>
                  <strong>সব খাতা মেলায়।</strong> কাজের তালিকাকে বলে <strong>crontab</strong>, মানে
                  cron table। cron চার জায়গা থেকে crontab পড়ে, যেগুলো সেকশন ০০৬ এ দেখবেন। কোনো
                  File বদলেছে কি না সেটাও প্রতি মিনিটে দেখে নেয়, তাই নতুন লাইন যোগ করে cron
                  Restart করতে হয় না।
                </ListItem>
                <ListItem>
                  <strong>যে লাইনের সময় হয়েছে, সেটা চালায়।</strong> যার crontab, তার পরিচয়ে, মানে
                  deploy এর লাইন deploy হয়ে চলে, root এর লাইন root হয়ে। Command টা চালায়{" "}
                  <code>/bin/sh</code> দিয়ে, একটা নতুন Process হিসেবে।
                </ListItem>
                <ListItem>
                  <strong>Journal এ একটা লাইন লেখে।</strong> কে, কোন Command চালাল। লেসন ০৭ এ দেখা
                  journalctl দিয়ে এটা পড়বেন।
                </ListItem>
                <ListItem>
                  <strong>তারপর ভুলে যায়।</strong> Command সফল হলো কি না, কত সময় নিল, আগের Run
                  এখনো চলছে কি না, cron এর কিছুই দেখে না। এই একটা স্বভাব থেকেই এই লেসনের অর্ধেক
                  সমস্যা আসে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একটা লাইন চললে Journal এ এমন দেখায়। এটা পরে এই লেসনের Backup এর লাইন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "journalctl -t CRON",
          code: `2026-10-31T07:31:01+00:00 island-vps-01 CRON[692]: (mytours) CMD (/bin/bash -c "set -a; source /etc/my-tours/backup.env; set +a; exec flock -n /run/lock/my-tours-backup.lock /usr/local/bin/my-tours-backup" >> /var/log/my-tours/backup.log 2>&1)`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "cron এর কয়েকটা জাত আছে",
          content: (
            <p>
              Linux এ cron এর একাধিক রূপ আছে। Ubuntu আর Debian এ যেটা আসে সেটা পুরনো Vixie cron এর
              একটা Debian সংস্করণ, Package এর নাম শুধু <code>cron</code>, এই Server এ Version
              3.0pl1-184ubuntu2। Fedora আর Red Hat এ আসে <code>cronie</code>। বেশিরভাগ নিয়ম এক,
              কিন্তু কয়েকটা ছোট জিনিস আলাদা, যেমন সময় অঞ্চলের একটা Setting যা সেকশন ০০৯ এ দেখবেন।
              তাই কোনো Blog এ একটা কৌশল পড়লে মিলিয়ে নিন সেটা কোন cron এর কথা বলছে, আর নিজের Server
              এ পরীক্ষা করে নিন। এই লেসনের প্রতিটা আচরণ Ubuntu 24.04 এর cron এ যাচাই করা।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "five-fields",
      subHeader: { index: "003", title: "Five Fields" },
      title: <SectionTitle>পাঁচটা ঘর, তারপর Command</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              crontab এর প্রতিটা কাজ এক লাইনে। লাইনের শুরুতে পাঁচটা ঘর, ফাঁকা জায়গা দিয়ে আলাদা,
              যেগুলো বলে কখন। তারপর বাকি পুরো লাইনটা Command, যা চালানো হবে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CronFieldsDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                cron প্রতি মিনিটে নিজেকে পাঁচটা প্রশ্ন করে: এখনকার মিনিট কি প্রথম ঘরে আছে? ঘণ্টা কি
                দ্বিতীয় ঘরে আছে? মাসের দিন, মাস, সপ্তাহের দিন? সবগুলোর উত্তর হ্যাঁ হলে Command
                চলে। প্রতিটা ঘরে কী লেখা যায়:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একটা সংখ্যা</strong>, যেমন <code>30</code>। শুধু সেই মান।
                </ListItem>
                <ListItem>
                  <strong>তারকা</strong>, <code>*</code>। যেকোনো মান। ঘণ্টার ঘরে * মানে প্রতি ঘণ্টায়।
                </ListItem>
                <ListItem>
                  <strong>তালিকা</strong>, কমা দিয়ে, যেমন <code>0,30</code>। শূন্য বা ত্রিশ মিনিটে।
                </ListItem>
                <ListItem>
                  <strong>পরিসর</strong>, হাইফেন দিয়ে, যেমন <code>1-5</code>। সপ্তাহের দিনের ঘরে
                  এটা সোমবার থেকে শুক্রবার।
                </ListItem>
                <ListItem>
                  <strong>ধাপ</strong>, স্ল্যাশ দিয়ে, যেমন <code>*/15</code>। শূন্য থেকে শুরু করে
                  প্রতি পনেরো: 0, 15, 30, 45। পরিসরের সাথেও চলে, <code>9-17/2</code> মানে 9, 11,
                  13, 15, 17।
                </ListItem>
                <ListItem>
                  <strong>নাম</strong>, মাস আর সপ্তাহের দিনের ঘরে ইংরেজি তিন অক্ষর:{" "}
                  <code>jan</code> থেকে <code>dec</code>, <code>sun</code> থেকে <code>sat</code>।
                  বড় বা ছোট হাতের অক্ষর দুইটাই চলে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                সপ্তাহের দিনের ঘরে রবিবার 0, শনিবার 6, আর 7 ও রবিবার, যাতে কেউ সোমবার থেকে গুনলে
                রবিবারকে 7 লিখতে পারেন। Server এর নিজের <code>/etc/crontab</code> File এর মাথায়
                এই পাঁচটা ঘরের ব্যাখ্যা লেখা থাকে, একটু পরে দেখবেন। কয়েকটা লাইন পড়ে অভ্যাস করে
                নিন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লাইনের সময়ের অংশ", "মানে (Server এর ঘড়িতে)"],
          rows: [
            [<code key="a">30 21 * * *</code>, "প্রতিদিন 21:30"],
            [<code key="b">*/15 * * * *</code>, "প্রতি ১৫ মিনিটে: :00, :15, :30, :45"],
            [<code key="c">0 * * * *</code>, "প্রতি ঘণ্টার শুরুতে"],
            [<code key="d">0 9 * * 1-5</code>, "সোমবার থেকে শুক্রবার, সকাল 09:00"],
            [<code key="e">0 3 * * sun</code>, "প্রতি রবিবার 03:00"],
            [<code key="f">0 0 1 * *</code>, "প্রতি মাসের ১ তারিখ, মধ্যরাতে"],
            [<code key="g">15 2 1 1,7 *</code>, "জানুয়ারি আর জুলাইয়ের ১ তারিখ, 02:15"],
            [<code key="h">0 9-17 * * 1-5</code>, "কর্মদিবসে 09:00 থেকে 17:00, প্রতি ঘণ্টার শুরুতে"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কিছু প্রচলিত সময়ের জন্য পাঁচটা ঘরের বদলে একটা শব্দও লেখা যায়।{" "}
                <code>@hourly</code> মানে <code>0 * * * *</code>, <code>@daily</code> মানে{" "}
                <code>0 0 * * *</code>, <code>@weekly</code> মানে <code>0 0 * * 0</code>,{" "}
                <code>@monthly</code> মানে <code>0 0 1 * *</code>, আর <code>@yearly</code> মানে{" "}
                <code>0 0 1 1 *</code>। একটা শব্দ আলাদা: <code>@reboot</code> কোনো ঘড়ির সময় নয়,
                cron চালু হওয়ার সময় একবার চলে, মানে কার্যত Server Boot হলে। cron চালু হওয়ার সময়
                Journal এ ঠিক এই কথাটা লেখে: <code>(CRON) INFO (Running @reboot jobs)</code>। তবে Boot
                এ কিছু চালানোর আসল জায়গা লেসন ০২ এর systemd Service, @reboot শুধু ছোটখাটো কাজের জন্য।
              </ContentParagraph>
              <ContentParagraph>
                <code>@daily</code> সুবিধার, কিন্তু খেয়াল করুন সেটা Server এর মধ্যরাত। Island Tours
                এর Server এর ঘড়ি UTC তে, তাই @daily মানে ঢাকায় সকাল ছয়টা, ঠিক যখন প্রথম পর্যটকেরা
                জেগে বুকিং দেখা শুরু করেন। সময় অঞ্চলের পুরো গল্প সেকশন ০০৯ এ।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "schedule-traps",
      subHeader: { index: "004", title: "Schedule Traps" },
      title: <SectionTitle>যে লাইনগুলো যা বলে তা করে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পাঁচটা ঘর সরল দেখায়, কিন্তু কয়েকটা জায়গায় মানুষের পড়া আর cron এর পড়া আলাদা।
                প্রতিটা ফাঁদ একবার চিনে নিলে আর পড়বেন না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>মিনিটের ঘরে তারকা।</strong> কেউ রাত বারোটায় একবার চালাতে চেয়ে লিখলেন{" "}
                  <code>* 0 * * *</code>। ঘণ্টা ঠিক আছে, কিন্তু মিনিটের ঘরে * মানে যেকোনো মিনিট।
                  তাই 00:00 থেকে 00:59 পর্যন্ত প্রতি মিনিটে, মোট ষাটবার। সঠিক লাইন{" "}
                  <code>0 0 * * *</code>।
                </ListItem>
                <ListItem>
                  <strong>দুই দিনের ঘর একসাথে।</strong> মাসের দিন আর সপ্তাহের দিন, এই দুইটা ঘর
                  দুইটাই বাঁধা থাকলে cron এদের মাঝে এবং নয়, অথবা ধরে। <code>0 0 1 * 1</code> পড়ে মনে
                  হয় মাসের প্রথম দিন যদি সোমবার হয়। আসলে চলে প্রতি মাসের ১ তারিখে, আর প্রতি সোমবারেও।
                  একটা ঘর তারকা দিয়ে শুরু হলে এই নিয়ম খাটে না, তখন দুইটাই মিলতে হয়।
                </ListItem>
                <ListItem>
                  <strong>ধাপ যা সমানভাবে ভাগ হয় না।</strong> <code>*/7</code> মিনিটের ঘরে মানে 0,
                  7, 14, ... 56, তারপর ঘণ্টা বদলালে আবার 0 থেকে। 56 থেকে পরের 0 মাত্র চার মিনিট। ধাপ
                  প্রতি ঘণ্টায় নতুন করে গোনা হয়, তাই ৬০ কে ভাগ করে এমন সংখ্যাই নিরাপদ: 1, 2, 3, 4,
                  5, 6, 10, 12, 15, 20, 30।
                </ListItem>
                <ListItem>
                  <strong>যা একটা লাইনে লেখা যায় না।</strong> প্রতি ৯০ মিনিটে একবার cron এর এক
                  লাইনে হয় না। <code>*/90</code> লিখলে crontab বলে{" "}
                  <code>Warning: Step size 90 higher than possible maximum of 59</code>, তবুও লাইনটা বসিয়ে
                  নেয়। তারপর cron চালায় শূন্য থেকে ৯০ এর ধাপে, যার প্রথম মানটা ছাড়া বাকি সব ঘরের সীমার
                  বাইরে, তাই আসলে প্রতি ঘণ্টার শুরুতে একবার। Practice Server এ লাইনটা চলেছিল 08:00:01 এ,
                  তারপর পরের ঘণ্টার অপেক্ষায়। প্রতি ৯০ মিনিটের জন্য লাগে দুইটা লাইন, অথবা systemd Timer
                  এর <code>OnUnitActiveSec=90min</code>, যা সেকশন ০১২ তে দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>পরিসর ছাড়া ধাপ।</strong> <code>5/10</code> পড়ে মনে হয় পাঁচ মিনিট থেকে শুরু করে
                  প্রতি দশ মিনিট। Ubuntu এর crontab এটা কোনো আপত্তি ছাড়া মেনে নেয়, কিন্তু cron এমন লাইন
                  কখনো চালায় না, Journal এ কোনো Error ও লেখে না। Practice Server এ একটা{" "}
                  <code>0/2</code> লাইন পাঁচ মিনিট রাখা হয়েছিল, একবারও চলেনি, অথচ একই crontab এর পাশের লাইন
                  চলেছে। লিখতে হবে পরিসর সহ, <code>5-59/10</code>।
                </ListItem>
                <ListItem>
                  <strong>যে তারিখ নেই।</strong> <code>0 0 31 2 *</code> মানে ৩১ ফেব্রুয়ারি। cron
                  কোনো Error দেয় না, লাইনটা শুধু কখনো চলে না। ৩১ তারিখের কোনো মাসিক কাজ এপ্রিল,
                  জুন, সেপ্টেম্বর আর নভেম্বরে বাদ পড়ে, একই কারণে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের Lab এ যেকোনো লাইন লিখে পরের ছয়টা Run দেখুন, UTC আর ঢাকার ঘড়িতে পাশাপাশি।
                ফাঁদগুলো Preset হিসেবে রাখা আছে, প্রতিটা বেছে নিয়ে Run এর তালিকা আর সতর্কবার্তা
                মিলিয়ে নিন। তারপর Server এর ঘড়ি Asia/Dhaka করে দেখুন একই লাইন কীভাবে ছয় ঘণ্টা
                সরে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CronExpressionLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "সন্দেহ হলে মেশিনকে জিজ্ঞেস করুন",
          content: (
            <p>
              মাথায় হিসাব না করে একটা যন্ত্রকে দিয়ে যাচাই করানো ভালো অভ্যাস। cron এর লাইনের জন্য
              crontab.guru নামের একটা পাতা আছে, লাইন লিখলে সাধারণ ইংরেজিতে মানে বলে দেয়। Timer এর
              জন্য Server এই আছে <code>systemd-analyze calendar</code>, যা সেকশন ০১১ তে দেখবেন। একটা
              Schedule লিখে যাচাই না করে চলে যাওয়া মানে ভুলটা আবিষ্কার হবে সেই দিন, যেদিন কাজটার ফল
              দরকার।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "crontab-command",
      subHeader: { index: "005", title: "crontab" },
      title: <SectionTitle>crontab: নিজের তালিকা লেখা, দেখা, আর ভুল করে মুছে ফেলা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা User এর নিজের একটা crontab থাকতে পারে। সেটা হাতে খুলে লেখা হয় না, লেখা হয়{" "}
                <code>crontab</code> নামের Command দিয়ে। এর চারটা কাজ জানলেই চলে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>crontab -e</code>: নিজের তালিকা Editor এ খোলে। প্রথমবার জিজ্ঞেস করে কোন
                  Editor চান, nano বেছে নেওয়া সহজ (লেসন ০১)। পরে বদলাতে <code>select-editor</code>।
                  সেভ করে বের হলে crontab লাইনগুলো যাচাই করে। স্পষ্ট ভুল থাকলে, যেমন মিনিটের ঘরে 61, বলে{" "}
                  <code>errors in crontab file, can&apos;t install.</code> আর জিজ্ঞেস করে{" "}
                  <code>Do you want to retry the same edit? (y/n)</code>। তবে সব ভুল ধরে না: Practice Server এ
                  সপ্তাহের দিনের ঘরে <code>xyz</code> বা <code>5/10</code> এর মতো লাইন সে কোনো আপত্তি ছাড়াই
                  বসিয়ে নিয়েছে।
                </ListItem>
                <ListItem>
                  <code>crontab -l</code>: তালিকাটা দেখায়। এখনো কিছু না লিখলে বলে{" "}
                  <code>no crontab for deploy</code>।
                </ListItem>
                <ListItem>
                  <code>crontab -r</code>: পুরো তালিকা মুছে ফেলে। একটা লাইন নয়, পুরোটা, আর কিছু
                  জিজ্ঞেস না করেই। কীবোর্ডে e আর r পাশাপাশি, তাই -e টিপতে গিয়ে -r হয়ে যাওয়া খুব
                  পরিচিত দুর্ঘটনা।
                </ListItem>
                <ListItem>
                  <code>sudo crontab -u mytours -l</code>: অন্য User এর তালিকা দেখা বা বদলানো, sudo
                  দিয়ে। mytours এর মতো System User এর Login Shell নেই (লেসন ০৪), তবুও তার নিজের
                  crontab থাকতে পারে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                -r কতটা নীরব, নিজের চোখে দেখুন। প্রথমে <code>-i</code> সহ, যা মোছার আগে জিজ্ঞেস করে,
                তারপর শুধু -r:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "root@island-vps-01",
          code: `root@island-vps-01:~# echo "0 3 * * * true" | crontab -u mytours -
root@island-vps-01:~# crontab -u mytours -i -r
crontab: really delete mytours's crontab? (y/n) n
root@island-vps-01:~# crontab -u mytours -l
0 3 * * * true
root@island-vps-01:~# crontab -u mytours -r
root@island-vps-01:~# crontab -u mytours -l
no crontab for mytours`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় -r টা একটা শব্দও বলেনি। এই দুর্ঘটনা থেকে বাঁচার দুইটা অভ্যাস। এক, নিজের
                Shell এ <code>alias crontab=&apos;crontab -i&apos;</code> রাখুন, তাহলে -r সবসময় জিজ্ঞেস
                করবে। দুই, crontab এর আসল কপি Git এ একটা File হিসেবে রাখুন, আর বসান{" "}
                <code>crontab my-tours.cron</code> দিয়ে। crontab এর পরে একটা File এর নাম দিলে সেই File
                পুরো তালিকাটা বদলে দেয়, আর <code>crontab -</code> দিলে তালিকা পড়ে stdin থেকে। তালিকা
                হারালে File থেকে আবার বসিয়ে দিলেই হলো।
              </ContentParagraph>
              <ContentParagraph>
                crontab এর লেখাগুলো আসলে থাকে <code>/var/spool/cron/crontabs/</code> Folder এ, প্রতিটা
                User এর নামে একটা File, Mode 600। Folder টা সাধারণ User খুলতেই পারে না:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "root@island-vps-01",
          code: `root@island-vps-01:~# ls -ld /var/spool/cron/crontabs
drwx-wx--T 2 root crontab 4096 Mar 31  2024 /var/spool/cron/crontabs
root@island-vps-01:~# ls -l /var/spool/cron/crontabs/
total 4
-rw------- 1 deploy crontab 354 Oct 31 07:28 deploy`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই File গুলো সরাসরি Editor এ খুলে বদলাবেন না। crontab Command বদলানোর পর cron কে
                জানিয়ে দেয় আর লাইনগুলো যাচাই করে, হাতে বদলালে এর কোনোটাই হয় না। লেসন ০৪ এর
                Permission চোখে পড়ছে তো: Folder এর Group crontab, আর crontab Program টা setgid, তাই
                সাধারণ User নিজের File লিখতে পারেন, অন্যেরটা পড়তে পারেন না।
              </ContentParagraph>
              <ContentParagraph>
                crontab এর ভেতরে তিনটা লেখার নিয়ম, যা না জানলে লাইন ভেঙে যায়:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong># দিয়ে শুরু লাইন মন্তব্য।</strong> প্রতিটা কাজের উপরে এক লাইনে লিখে রাখুন কাজটা
                  কী, আর ঢাকার সময়ে কখন। ছয় মাস পরের আপনি ধন্যবাদ দেবেন।
                </ListItem>
                <ListItem>
                  <strong>নাম=মান লাইন একটা Variable বসায়</strong>, পরের সব লাইনের জন্য, যেমন{" "}
                  <code>SHELL=/bin/bash</code> বা <code>MAILTO=&quot;&quot;</code>। সেকশন ০০৭ আর ০০৮ এ এদের কাজ।
                </ListItem>
                <ListItem>
                  <strong>% চিহ্নটা বিশেষ।</strong> Command এর ভেতরে প্রথম % এর পরের সবকিছু cron
                  Command এর stdin হিসেবে পাঠায়, আর প্রতিটা % কে নতুন লাইনে বদলে দেয়। সাধারণ % লিখতে
                  হলে আগে একটা ব্যাকস্ল্যাশ: <code>\%</code>।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                শেষ নিয়মটাই লেসনের শুরুর গল্পের খলনায়ক। তারিখ দিয়ে File এর নাম বানাতে সবাই লেখেন{" "}
                <code>date +%F</code>, যা Terminal এ চমৎকার চলে। Practice Server এ দুইটা লাইন বসানো
                হয়েছিল, একটা % সহ, একটা <code>\%</code> সহ:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "crontab আর তার ফল",
          code: `# crontab এর দুইটা লাইন
* * * * * date +%F > /tmp/pct-raw.txt
* * * * * date +\\%F > /tmp/pct-escaped.txt

# এক মিনিট পরে Journal (journalctl -t CRON)
CRON[294]: (deploy) CMD (date +)
CRON[293]: (deploy) CMD (date +%F > /tmp/pct-escaped.txt)

# File দুইটার অবস্থা
/tmp/pct-raw.txt: নেই
/tmp/pct-escaped.txt: 2026-10-31`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রথম লাইনের Command টা Journal এ দেখাচ্ছে শুধু <code>date +</code>। বাকি{" "}
              <code>F &gt; /tmp/pct-raw.txt</code> চলে গেছে stdin এ, মানে Redirect টাই হারিয়ে গেছে,
              তাই কোনো File তৈরি হয়নি। কোনো Error ও কোথাও দেখা যায়নি, কারণটা সেকশন ০০৮ এ। দ্বিতীয়
              লাইনে cron নিজেই <code>\</code> টা সরিয়ে Command চালিয়েছে, তাই Journal এ সেটা সাধারণ{" "}
              <code>%F</code> হিসেবে দেখাচ্ছে। সবচেয়ে নিরাপদ পথ হলো crontab এ লম্বা Command না লিখে
              একটা Script File এর Path লেখা। Script এর ভেতরে % এর কোনো বিশেষ মানে নেই।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "system-crontabs",
      subHeader: { index: "006", title: "System Crontabs" },
      title: <SectionTitle>/etc/crontab, /etc/cron.d আর cron.daily: Server এর নিজের খাতা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              User দের নিজের crontab ছাড়াও cron আরও তিন জায়গা থেকে কাজ পড়ে। এগুলো কোনো একজন
              User এর নয়, পুরো Server এর, তাই এদের লাইনে একটা বাড়তি ঘর থাকে: কোন User হয়ে চলবে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CronPlacesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রথমে <code>/etc/crontab</code>। একটা নতুন Ubuntu 24.04 এ এটা দেখতে এমন:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "/etc/crontab",
          code: `# /etc/crontab: system-wide crontab
# Unlike any other crontab you don't have to run the \`crontab'
# command to install the new version when you edit this file
# and files in /etc/cron.d. These files also have username fields,
# that none of the other crontabs do.

SHELL=/bin/sh
# You can also override PATH, but by default, newer versions inherit it from the environment
#PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name command to be executed
17 *	* * *	root	cd / && run-parts --report /etc/cron.hourly
25 6	* * *	root	test -x /usr/sbin/anacron || { cd / && run-parts --report /etc/cron.daily; }
47 6	* * 7	root	test -x /usr/sbin/anacron || { cd / && run-parts --report /etc/cron.weekly; }
52 6	1 * *	root	test -x /usr/sbin/anacron || { cd / && run-parts --report /etc/cron.monthly; }
#`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মাথার মন্তব্যে পাঁচটা ঘরের সেই ছবিটা, আর তার পরে চারটা আসল লাইন। খেয়াল করুন সময়ের
                পরে <code>root</code> লেখা, এটাই সেই User এর ঘর। এই চারটা লাইন আসলে চারটা Folder এর
                পাহারাদার:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>/etc/cron.hourly/</code> এর সব Script চলে প্রতি ঘণ্টার ১৭ মিনিটে।
                </ListItem>
                <ListItem>
                  <code>/etc/cron.daily/</code> চলে প্রতিদিন 06:25 এ, Island Tours এর UTC ঘড়িতে, মানে
                  ঢাকায় দুপুর 12:25।
                </ListItem>
                <ListItem>
                  <code>/etc/cron.weekly/</code> প্রতি রবিবার 06:47 এ, <code>/etc/cron.monthly/</code>{" "}
                  প্রতি মাসের ১ তারিখ 06:52 এ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই Folder গুলোতে crontab এর লাইন থাকে না, থাকে আস্ত Script, যেগুলোকে একটা একটা করে
                চালায় <code>run-parts</code> নামের ছোট Program। লাইনের <code>test -x /usr/sbin/anacron ||</code>{" "}
                অংশের মানে: anacron বসানো থাকলে cron এগুলো চালায় না, তখন anacron নিজে চালায়। anacron কী, সেটা
                সেকশন ০১২ তে। Ubuntu Server এ সেটা থাকে না, এই Server এও নেই, তাই cron নিজেই চালায়।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় জায়গা <code>/etc/cron.d/</code>। Package গুলো নিজেদের কাজ এখানে একটা আলাদা
                File এ রেখে যায়, আর আপনিও আপনার App এর কাজ এখানে রাখতে পারেন। File এর ভেতরের লাইন{" "}
                <code>/etc/crontab</code> এর মতোই, User এর ঘর সহ। কিন্তু এই Folder এর চারটা নিয়ম আছে,
                আর ভাঙলে cron কখনো কিছু বলে, কখনো একদম চুপ থাকে। চারটা নিয়মই Practice Server এ
                ভেঙে দেখা হয়েছিল:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "চারটা File, প্রতিটায় প্রতি মিনিটের একটা লাইন",
          code: `root@island-vps-01:~# ls -l /etc/cron.d
-rw-r--r-- 1 root root 202 Apr  8  2024 e2scrub_all
-rw-r--r-- 1 root root  51 Oct 31 07:25 mytours-check        # ঠিকঠাক
-rw-rw-r-- 1 root root  51 Oct 31 07:25 mytours-loose        # Group লিখতে পারে
-rw-r--r-- 1 root root  49 Oct 31 07:25 mytours-nonewline    # শেষে Newline নেই
-rw-r--r-- 1 root root  48 Oct 31 07:25 mytours.cron         # নামে একটা ডট
-rw-r--r-- 1 root root 396 Jan  9  2024 sysstat

# এক মিনিট পরে Journal (journalctl -t cron -t CRON):
cron[81]: (*system*mytours-nonewline) ERROR (Missing newline before EOF, this crontab file will be ignored)
cron[81]: (*system*mytours-loose) INSECURE MODE (group/other writable) (/etc/cron.d/mytours-loose)
CRON[283]: (root) CMD (date -u +%T > /tmp/crond-nodot.txt)

# mytours.cron নিয়ে Journal এ একটা শব্দও নেই। File টা শুধু এড়িয়ে যাওয়া হয়েছে।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>চারটা থেকে চারটা নিয়ম:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>নামে ডট চলবে না।</strong> শুধু অক্ষর, সংখ্যা, হাইফেন আর আন্ডারস্কোর।{" "}
                  <code>mytours.cron</code> বা <code>backup.sh</code> নামের File cron চুপচাপ এড়িয়ে যায়,
                  কোনো Log ছাড়াই। এটাই সবচেয়ে বিপজ্জনক, কারণ দেখার মতো কিছুই থাকে না। নিয়মটা
                  রাখা হয়েছে যাতে Package Update এর সময় রেখে যাওয়া <code>.dpkg-old</code> এর মতো পুরনো
                  কপি ভুল করে চলে না যায়।
                </ListItem>
                <ListItem>
                  <strong>অন্য কেউ লিখতে পারবে না।</strong> Group বা অন্যদের Write Permission থাকলে
                  cron ধরে নেয় যে কেউ এই File এ লাইন ঢুকিয়ে root হয়ে কিছু চালাতে পারে, তাই চালায় না:
                  INSECURE MODE। Mode 644, মালিক root, এটাই ঠিক (লেসন ০৪)।
                </ListItem>
                <ListItem>
                  <strong>শেষ লাইনের পরে একটা Newline।</strong> না থাকলে পুরো File বাদ, শুধু শেষ লাইন নয়।
                  nano নিজে থেকে শেষে Newline যোগ করে, কিন্তু Script দিয়ে File বানালে খেয়াল রাখতে হয়।
                </ListItem>
                <ListItem>
                  <strong>User এর ঘর বাদ দেবেন না।</strong> নিজের crontab এর অভ্যাসে কেউ cron.d তে
                  লিখলেন <code>30 21 * * * /usr/local/bin/my-tours-backup</code>। cron তখন{" "}
                  <code>/usr/local/bin/my-tours-backup</code> কে User এর নাম ভাবে। Practice Server এ ঠিক এই
                  ভুলের পরে Journal এ এসেছিল <code>Error: bad username; while reading /etc/cron.d/mytours-nouser</code>{" "}
                  আর তার পরের লাইনে <code>ERROR (Syntax error, this crontab file will be ignored)</code>। মানে
                  শুধু ওই লাইন নয়, পুরো File টাই বাদ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                cron.daily এর মতো Folder গুলোর জন্যও নামের নিয়ম একই, কারণ সেখানে কোন Script চলবে তা ঠিক
                করে run-parts। কোনটা সত্যিই চলবে, তা না চালিয়েই দেখার উপায় <code>--test</code>।
                দুইটা Script রাখা হলো, একটা <code>my-tours.sh</code>, আরেকটা{" "}
                <code>my-tours-cleanup</code>:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "root@island-vps-01",
          code: `root@island-vps-01:~# run-parts --test /etc/cron.daily
/etc/cron.daily/apt-compat
/etc/cron.daily/dpkg
/etc/cron.daily/logrotate
/etc/cron.daily/my-tours-cleanup
/etc/cron.daily/sysstat`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              <code>my-tours.sh</code> তালিকায় নেই। আজ রাতে এটা চলবে না, কাল রাতেও না, আর কেউ জানবে
              না। cron.daily তে কিছু রাখলে প্রথম কাজ <code>run-parts --test</code> চালিয়ে নিজের নামটা
              খুঁজে পাওয়া, আর Script টার Execute Permission আছে কি না দেখা।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "cron-environment",
      subHeader: { index: "007", title: "Cron's Environment" },
      title: <SectionTitle>হাতে চললে cron এ কেন চলে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                cron এর নামে যত অভিযোগ, তার বেশিরভাগ এক বাক্যে: আমি হাতে চালালে চলে, cron এ চলে না।
                কারণটা লেসন ০৫ এর Environment। আপনি ssh করে ঢুকলে একটা Login Shell পান, যা{" "}
                <code>~/.profile</code> আর <code>~/.bashrc</code> পড়ে, PATH সাজায়, আপনার নিজের
                Variable বসায়। cron এর এসব কিছুই করে না। সে একটা প্রায় খালি পরিবেশে, একটা অন্য Shell
                দিয়ে, কোনো Terminal ছাড়া Command চালায়।
              </ContentParagraph>
              <ContentParagraph>
                অনুমান না করে দেখে নেওয়াই ভালো। deploy এর crontab এ একটা লাইন বসানো হলো{" "}
                <code>* * * * * env &gt; /tmp/cron-env-deploy.txt</code>, এক মিনিট পরে File টা খোলা হলো,
                আর পাশে রাখা হলো deploy এর Login Shell এর মান:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "দুইটা পরিবেশ, একই User",
          code: `# cron এর ভেতরে, /tmp/cron-env-deploy.txt
HOME=/home/deploy
LOGNAME=deploy
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
LANG=C.UTF-8
SHELL=/bin/sh
PWD=/home/deploy

# deploy এর Login Shell এ
PATH=/home/deploy/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
SHELL=/bin/bash
sh is /usr/bin/dash`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CronEnvSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>পাঁচটা তফাত, একটা একটা করে।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>PATH ছোট।</strong> অনেক বই আর Blog বলে cron এর PATH শুধু{" "}
                  <code>/usr/bin:/bin</code>। পুরনো সংস্করণে আর অনেক Distribution এ এখনো তাই। Ubuntu
                  24.04 এ cron PATH নেয় <code>/etc/environment</code> থেকে, PAM এর মাধ্যমে (PAM হলো
                  সেই অংশ যা কোনো User এর জন্য Session খোলার সময় পরিবেশ সাজায়), তাই{" "}
                  <code>/usr/local/bin</code> ও আছে। Practice Server এ <code>/usr/local/bin</code> এর
                  একটা Script cron থেকে ঠিকই চলেছে। কিন্তু <code>~/.local/bin</code>, nvm এর মতো
                  যন্ত্রের Node এর Folder, বা <code>.bashrc</code> এ যোগ করা যেকোনো Folder এখানে নেই। crontab এর মাথায়{" "}
                  <code>PATH=...</code> লাইন লিখে বদলানো যায়, কিন্তু পুরো মানটা লিখতে হয়: crontab এর Variable
                  লাইনে <code>$PATH</code> বা <code>~</code> খোলা হয় না, তাই <code>PATH=$HOME/bin:$PATH</code>{" "}
                  লিখলে PATH এ ঠিক ওই অক্ষরগুলোই বসে।
                </ListItem>
                <ListItem>
                  <strong>Shell টা bash নয়।</strong> <code>SHELL=/bin/sh</code>, আর Ubuntu তে{" "}
                  <code>/bin/sh</code> আসলে <code>dash</code>, একটা ছোট আর দ্রুত Shell যা bash এর
                  বাড়তি জিনিসগুলো চেনে না। <code>source</code>, <code>[[ ]]</code>, Array, এগুলো dash এ
                  চলে না।
                </ListItem>
                <ListItem>
                  <strong>.bashrc বা .profile পড়ে না।</strong> তাই সেখানে Export করা কোনো Variable,
                  যেমন একটা <code>DATABASE_URL</code>, cron এর Job পায় না।
                </ListItem>
                <ListItem>
                  <strong>শুরু হয় HOME থেকে।</strong> <code>PWD=/home/deploy</code>। Script এ{" "}
                  <code>./data</code> লিখলে সেটা খুঁজবে <code>/home/deploy/data</code> তে, আপনি যে
                  Folder থেকে হাতে চালিয়েছিলেন সেখানে নয়।
                </ListItem>
                <ListItem>
                  <strong>কোনো Terminal নেই।</strong> যে Program কিছু জিজ্ঞেস করে (একটা Password, একটা
                  y/n), সে উত্তরের অপেক্ষায় আটকে থাকে বা ব্যর্থ হয়। sudo ও এখানে Password চাইতে পারে না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                দুইটা তফাত ইচ্ছা করে ঘটানো হলো। deploy এর <code>.bashrc</code> এ{" "}
                <code>~/.local/bin</code> PATH এ যোগ করা, সেখানে <code>mt-report</code> নামের একটা Script,
                যা হাতে দিব্যি চলে। আর একটা লাইন যা bash এর <code>source</code> ব্যবহার করে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "হাতে চলে, cron এ চলে না",
          code: `# crontab
* * * * * mt-report > /tmp/bashrc-path.txt 2>&1
* * * * * source /etc/hostname > /tmp/dash.txt 2>&1

# এক মিনিট পরে
deploy@island-vps-01:~$ cat /tmp/bashrc-path.txt
/bin/sh: 1: mt-report: not found
deploy@island-vps-01:~$ cat /tmp/dash.txt
/bin/sh: 1: source: not found`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুইটা Error এর শুরুতেই লেখা <code>/bin/sh</code>। cron এর Error পড়লে সবসময় এই প্রথম
                শব্দটা দেখুন, কে চালাচ্ছে সেটা বলে দেয়। সমাধানের পাঁচটা অভ্যাস, যা মানলে এই পুরো
                সমস্যাটা আর আসে না:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>crontab এ শুধু একটা Script এর পুরো Path।</strong> লম্বা Command বা Pipe নয়।
                  <code>/usr/local/bin/my-tours-backup</code>, <code>my-tours-backup</code> নয়।
                </ListItem>
                <ListItem>
                  <strong>Script এর প্রথম লাইনে Shell বেছে নিন।</strong>{" "}
                  <code>#!/usr/bin/env bash</code> লিখলে cron যে Shell দিয়েই ডাকুক, Script চলবে bash এ।
                  পুরো crontab এর জন্য চাইলে উপরে <code>SHELL=/bin/bash</code> লেখা যায়।
                </ListItem>
                <ListItem>
                  <strong>Script এর ভেতরে Program এর পুরো Path</strong>, অথবা শুরুতে নিজেই{" "}
                  <code>PATH</code> বসিয়ে নিন। কোনো Program কোথায় আছে জানতে <code>command -v node</code>।
                </ListItem>
                <ListItem>
                  <strong>Variable আসবে একটা env File থেকে</strong>, লেসন ০৫ এর মতো।{" "}
                  <code>set -a; source /etc/my-tours/backup.env; set +a</code> মানে File এর প্রতিটা
                  লাইন Variable হিসেবে বসবে আর Export হবে, যাতে Script এর ভেতরের Program গুলোও পায়।
                  File টার Mode 640, মালিক root, Group mytours (লেসন ০৪)।
                </ListItem>
                <ListItem>
                  <strong>আপেক্ষিক Path নয়।</strong> হয় পুরো Path, নয়তো Script এর শুরুতে{" "}
                  <code>cd /srv/my-tours</code>।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর যাচাইয়ের সবচেয়ে ভালো উপায় হলো Script টা cron এর মতো একটা খালি পরিবেশে হাতে চালানো,
                যে User হয়ে চলবে সেই User হয়ে: <code>env -i</code> মানে সব Variable মুছে ফেলে শুরু।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ sudo -u mytours env -i PATH=/usr/bin:/bin /usr/local/bin/my-tours-backup
/usr/local/bin/my-tours-backup: line 8: BACKUP_DIR: BACKUP_DIR is not set
deploy@island-vps-01:~$ echo $?
1`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই পরীক্ষায় Script টা সাথে সাথে থেমে গেছে আর বলেছে ঠিক কী নেই। এটাই চাই। লেসন ০৫ এর
              নিয়ম এখানেও: দরকারি Setting না পেলে চুপচাপ ভুল কিছু করার চেয়ে জোরে থেমে যাওয়া ভালো।
              Script টা কীভাবে লেখা, পুরোটা সেকশন ০১৪ তে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "output-logs",
      subHeader: { index: "008", title: "Output and Logs" },
      title: <SectionTitle>Output কোথায় যায়, আর CMD লাইন আসলে কী প্রমাণ করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                হাতে চালালে Command এর Output আর Error আপনার পর্দায় আসে। cron এর কোনো পর্দা নেই। তাহলে
                Output যায় কোথায়? cron এর পুরনো নিয়ম: কোনো Job কিছু লিখলে cron সেটা একটা Mail করে
                crontab এর মালিককে, অথবা <code>MAILTO</code> Variable এ লেখা ঠিকানায়। এই Mail পাঠাতে
                লাগে একটা <strong>MTA</strong>, Mail Transfer Agent, মানে Server এর ভেতরের একটা
                ডাকঘর Program। আজকের প্রায় কোনো VPS এ সেটা বসানো থাকে না।
              </ContentParagraph>
              <ContentParagraph>
                তাহলে কী হয়, Practice Server এর Journal নিজেই বলে দিচ্ছে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "journalctl -t CRON",
          code: `CRON[281]: (deploy) CMD (echo "this line has nowhere to go")
CRON[277]: (CRON) info (No MTA installed, discarding output)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                discarding output, মানে ফেলে দেওয়া হলো। শুরুর গল্পের Backup এর আসল Error টাও এভাবেই
                প্রতি রাতে ফেলে দেওয়া হয়েছিল। তিন সপ্তাহে একুশটা Error, একটাও কেউ দেখেননি। তাই
                cron এর প্রতিটা লাইনের Output কোথাও পাঠাতে হবে। তিনটা উপায়:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একটা Log File এ।</strong> লাইনের শেষে{" "}
                  <code>&gt;&gt; /var/log/my-tours/backup.log 2&gt;&amp;1</code>। <code>&gt;&gt;</code> মানে
                  নতুন লেখা যোগ হবে File এর শেষে, আগের লেখা মুছবে না। <code>2&gt;&amp;1</code> মানে Error এর
                  ধারা (2) ও যাবে সেখানে, যেখানে সাধারণ Output (1) যাচ্ছে। এটা না দিলে Error টা আবার সেই
                  হারিয়ে যাওয়া Mail এ যায়। Folder টার মালিক Job এর User হতে হবে, আর File বড় হতে থাকবে,
                  তাই লেসন ০৭ এর logrotate এ একটা Rule যোগ করে নিন।
                </ListItem>
                <ListItem>
                  <strong>Journal এ।</strong> <code>2&gt;&amp;1 | logger -t my-tours-backup</code>।{" "}
                  <code>logger</code> একটা লাইন নিয়ে System Log এ লেখে, <code>-t</code> দিয়ে একটা নাম
                  জুড়ে দেয়। পরে <code>journalctl -t my-tours-backup</code> দিয়ে শুধু এগুলো পড়া যায়, সময়
                  আর বাকি Server এর ঘটনার পাশে।
                </ListItem>
                <ListItem>
                  <strong>systemd Timer এ যান।</strong> Timer এর Service এর সব Output নিজে থেকেই Journal
                  এ যায়, কিছু লিখতে হয় না। সেকশন ০১১ এ দেখবেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর <code>MAILTO=&quot;&quot;</code> crontab এর উপরে বসালে cron Mail পাঠানোর চেষ্টাই করে না।
                MTA না থাকলে এটা শুধু সেই info লাইনটা বন্ধ করে, সমস্যার সমাধান নয়। Output Redirect করাটাই
                আসল কাজ।
              </ContentParagraph>
              <ContentParagraph>
                cron এর Log পড়ার Command, লেসন ০৭ এর journalctl দিয়ে। Ubuntu তে cron দুইটা নামে লেখে:
                নিজের খবর (INSECURE MODE, Missing newline) ছোট হাতের <code>cron</code> নামে, আর প্রতিটা
                Job এর খবর বড় হাতের <code>CRON</code> নামে। দুইটা একসাথে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "cron এর Log",
          code: `# আজকের সব cron খবর, Session খোলা বন্ধের লাইনগুলো বাদ দিয়ে
sudo journalctl -t cron -t CRON --since today | grep -v pam_unix

# একটা নির্দিষ্ট Job এর CMD লাইন
sudo journalctl -t CRON --since "1 hour ago" | grep my-tours-backup

# rsyslog চালু থাকলে একই লাইন পুরনো ধাঁচের File এও
grep CRON /var/log/syslog | tail`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "deploy কেন sudo ছাড়া Journal পড়তে পারে না",
          content: (
            <p>
              Practice Server এ deploy হয়ে <code>journalctl</code> চালালে আসে{" "}
              <code>-- No entries --</code> আর একটা Hint: Users in groups &apos;adm&apos;,
              &apos;systemd-journal&apos; can see all messages। পুরো System এর Log পড়তে পারে root আর এই দুইটা
              Group এর সদস্য। Install এর সময় বানানো প্রথম User সাধারণত adm এ থাকে, কিন্তু পরে{" "}
              <code>adduser</code> দিয়ে বানানো deploy থাকে না। দুইটা পথ: প্রতিবার <code>sudo</code>, যা এই লেসন
              করে, অথবা একবার <code>sudo usermod -aG adm deploy</code> দিয়ে Group এ যোগ করে আবার Login
              (লেসন ০৪ আর ০৭)। sudo ছাড়া <code>systemctl status</code> ও Service এর অবস্থা দেখায়, কিন্তু নিচের
              Log এর লাইনগুলো বাদ দিয়ে।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "CMD লাইন মানে শুরু হয়েছিল, সফল হয়েছিল নয়",
          content: (
            <p>
              এই লেসনের সবচেয়ে কাজের বাক্য হয়তো এটা। Journal এ <code>(deploy) CMD (...)</code> দেখে
              অনেকে ধরে নেন কাজ হয়ে গেছে। ওই লাইন শুধু বলে cron Command টা চালু করেছিল। তারপর সেটা এক
              সেকেন্ডে Error দিয়ে থামল, নাকি এক ঘণ্টা চলে সফল হলো, cron জানে না, জানতে চায়ও না। Exit
              Code এর কোনো হিসাব cron রাখে না। কাজটা সত্যিই হয়েছে কি না জানার উপায় তিনটা: Job নিজে
              সফল বা ব্যর্থ লিখে যাবে (Log), ফলটা পরীক্ষা করবেন (Backup এর File আছে কি না, কত বড়), আর
              সবচেয়ে ভালো, সফল হলে একটা Heartbeat পাঠাবে, যা সেকশন ০১৫ তে দেখবেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "time-zones",
      subHeader: { index: "009", title: "Time Zones" },
      title: <SectionTitle>Server এর ঘড়ি UTC, আপনার ঘড়ি ঢাকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                cron Schedule পড়ে Server এর নিজের ঘড়িতে। তাই প্রথম প্রশ্ন, Server এর ঘড়ি কোন সময়
                অঞ্চলে? লেসন ০১ এ বলা হয়েছিল বেশিরভাগ VPS আসে UTC তে, আর Island Tours ও ইচ্ছা করে তাই
                রেখেছে। দেখার Command <code>timedatectl</code>:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ timedatectl
               Local time: Sat 2026-10-31 07:24:22 UTC
           Universal time: Sat 2026-10-31 07:24:22 UTC
                 RTC time: n/a
                Time zone: Etc/UTC (UTC, +0000)
System clock synchronized: yes
              NTP service: n/a
          RTC in local TZ: no
deploy@island-vps-01:~$ date
Sat Oct 31 07:24:22 UTC 2026
deploy@island-vps-01:~$ TZ=Asia/Dhaka date
Sat Oct 31 13:24:22 +06 2026`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Local time আর Universal time একই, কারণ Time zone হলো Etc/UTC। শেষ Command এ{" "}
                <code>TZ=Asia/Dhaka</code> শুধু ওই একটা Command এর জন্য সময় অঞ্চল বদলেছে (লেসন ০৫ এর
                এক Command এর Variable), Server এর ঘড়ি বদলায়নি। RTC আর NTP এর n/a এসেছে কারণ এটা
                একটা Container, আসল VPS এ NTP service active দেখাবে, মানে ঘড়ি Internet এর সময়ের সাথে
                মিলিয়ে রাখা হচ্ছে।
              </ContentParagraph>
              <ContentParagraph>
                Server কেন UTC তে রাখা ভালো? Log এর সময় সব Server এ এক হয়, অন্য দেশের Server বা
                Provider এর Support এর সাথে কথা বলতে হিসাব লাগে না, আর Daylight Saving Time এর ঝামেলা থাকে
                না। বাংলাদেশ এখন Daylight Saving মানে না, তাই ঢাকা সারা বছর UTC থেকে ঠিক ছয় ঘণ্টা আগে।
                কিন্তু যে দেশে বছরে দুইবার ঘড়ি সরে, সেখানে Server স্থানীয় সময়ে থাকলে একটা রাতে একটা
                ঘণ্টা দুইবার আসে আর আরেক রাতে একটা ঘণ্টা আসেই না। সেই ঘণ্টার Job হয় দুইবার চলে, নয়তো চলে না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CronTimezoneDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাহলে ঢাকার ভোর সাড়ে তিনটায় Backup চাইলে লিখতে হবে ঢাকার সময় থেকে ছয় ঘণ্টা বাদ দিয়ে:{" "}
                <code>30 21 * * *</code>। আর খেয়াল করুন, ঢাকার যে তারিখে Backup হলো, Server এর হিসাবে
                সেটা আগের দিন। Backup এর File এর নামে <code>2026-10-31</code> দেখে কেউ যদি ঢাকার ৩১
                অক্টোবর রাতের বুকিং খোঁজেন, পাবেন না, সেগুলো আছে পরের File এ।
              </ContentParagraph>
              <ContentParagraph>
                এখানে অনেকে একটা সহজ সমাধান খোঁজেন, crontab এর উপরে <code>CRON_TZ=Asia/Dhaka</code> লিখে
                দেওয়া। কিছু cron, যেমন cronie, এটা মানে। Ubuntu এর cron মানে কি না, পরীক্ষা করা হলো।
                একই মিনিটে দুইটা লাইন, একটার ঘণ্টা ঢাকার সময়ে, একটার UTC তে, উপরে CRON_TZ:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "CRON_TZ পরীক্ষা, Ubuntu 24.04 এর cron",
          code: `# root এর crontab, পরীক্ষার সময় UTC 07:25
CRON_TZ=Asia/Dhaka
27 13 * * * date -u +\\%T > /tmp/crontz-dhaka-hour.txt
27 07 * * * date -u +\\%T > /tmp/crontz-utc-hour.txt

# 07:27 এর পরে
/tmp/crontz-dhaka-hour.txt: নেই
/tmp/crontz-utc-hour.txt: 07:27:01

# একই পরীক্ষা TZ=Asia/Dhaka দিয়ে, mytours এর crontab এ: ফল একই, শুধু UTC র লাইন চলেছে`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                CRON_TZ লেখা থাকা সত্ত্বেও UTC র লাইনটা চলেছে, ঢাকারটা চলেনি। মানে Ubuntu এর cron এই
                লাইনটা চুপচাপ উপেক্ষা করে, কোনো Error ছাড়া। কোনো Blog এ CRON_TZ এর কৌশল পড়লে মনে
                রাখবেন সেটা হয়তো অন্য cron এর কথা।
              </ContentParagraph>
              <ContentParagraph>তিনটা অভ্যাস যা সময়ের ভুল প্রায় শূন্য করে:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Server UTC তেই থাক।</strong> শুধু cron এর সুবিধার জন্য পুরো Server এর ঘড়ি বদলাবেন
                  না। Log, Database এর সময়, সবকিছু তাতে বদলে যায়।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা লাইনের উপরে ঢাকার সময়টা মন্তব্যে।</strong>{" "}
                  <code># 21:30 UTC = 03:30 Dhaka</code>। পড়তে যিনি আসবেন তাঁকে হিসাব করতে হবে না।
                </ListItem>
                <ListItem>
                  <strong>সময় অঞ্চল সহ Schedule লাগলে systemd Timer।</strong> Timer এর{" "}
                  <code>OnCalendar</code> সময়ের সাথে একটা অঞ্চলের নাম নেয়, যেমন{" "}
                  <code>*-*-* 03:30:00 Asia/Dhaka</code>, আর সেটা সত্যিই মানে। সেকশন ০১১ এ যাচাই করে
                  দেখবেন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "overlap-flock",
      subHeader: { index: "010", title: "Overlap and flock" },
      title: <SectionTitle>আগের Run শেষ হওয়ার আগেই পরেরটা শুরু</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সেকশন ০০২ এ বলা হয়েছিল cron Command চালু করে দিয়ে ভুলে যায়। তার একটা ফল আছে যা প্রথম দিনে
                দেখা যায় না। ধরুন প্রতি ঘণ্টায় একটা রিপোর্ট বানানো হয়, শুরুতে সেটা দুই মিনিট নেয়। ছয় মাস
                পরে Database বড় হয়েছে, রিপোর্ট এখন নেয় সত্তর মিনিট। এক ঘণ্টা পরে cron পরের কপি চালু করে
                দেয়, আগেরটা তখনো চলছে। দুইটা একই Table পড়ছে, Server আরও ধীর, পরেরটা আরও বেশি সময় নেয়, আর
                কয়েক ঘণ্টায় একসাথে পাঁচটা কপি। Backup হলে আরও খারাপ: দুইটা কপি একই File এ লিখলে দুইটাই
                নষ্ট হতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                এটা ঘটিয়ে দেখা হলো। একটা Script যা ১৫০ সেকেন্ড ঘুমায়, প্রতি মিনিটে চালানো। একটা লাইন
                এমনি, আরেকটা <code>flock</code> এর ভেতর দিয়ে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "/tmp/slow.log, চার মিনিট পরে",
          code: `# crontab
* * * * * /usr/local/bin/slow-job nolock
* * * * * flock -n /run/lock/slow-job.lock /usr/local/bin/slow-job locked

# Log
07:29:01 start nolock pid 475
07:29:01 start locked pid 478
07:30:01 start nolock pid 524
07:31:01 start nolock pid 698
07:31:31 end   nolock pid 475
07:31:31 end   locked pid 478
07:32:01 start nolock pid 746
07:32:01 start locked pid 753
07:32:31 end   nolock pid 524
07:33:01 start nolock pid 898

# 07:33:11 এ যারা চলছে (ps -eo pid,etimes,args)
    698     129 /bin/sh /usr/local/bin/slow-job nolock
    746      69 /bin/sh /usr/local/bin/slow-job nolock
    753      69 /bin/sh /usr/local/bin/slow-job locked
    898       9 /bin/sh /usr/local/bin/slow-job nolock`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                nolock এর লাইনগুলো দেখুন: 07:31:01 এ তিনটা কপি একসাথে চলছিল (475, 524, 698), আর শেষ
                মুহূর্তেও তিনটা। locked এর লাইন চলেছে শুধু 07:29 আর 07:32 এ। মাঝের 07:30 আর 07:31 এ
                cron ঠিকই চালু করেছিল, কিন্তু flock সেগুলোকে সাথে সাথে বিদায় দিয়েছে, কারণ আগেরটা তখনো
                চলছিল। একসাথে কখনো একটার বেশি locked কপি ছিল না।
              </ContentParagraph>
              <ContentParagraph>
                flock কাজ করে একটা <strong>Lock File</strong> দিয়ে। Lock মানে একটা দরজার তালা: যে আগে
                এসে তালা নেয়, ঘর তার। flock প্রথমে File টার উপর Kernel এর কাছে একটা তালা চায়। পেলে
                Command চালায়, Command শেষ হলে তালা নিজে খুলে যায়, Process মরে গেলেও। না পেলে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>flock -n</code>: অপেক্ষা নয়, flock সাথে সাথে বেরিয়ে যায়। নির্ধারিত কাজের জন্য প্রায়
                  সবসময় এটাই ঠিক, কারণ পরের Run একটু পরে আবার আসবে।
                </ListItem>
                <ListItem>
                  <code>flock -w 300</code>: তালার জন্য সর্বোচ্চ ৩০০ সেকেন্ড অপেক্ষা। কাজ যদি নিয়মিত
                  Interval এর চেয়ে ধীর হয়, অপেক্ষার লাইন বাড়তেই থাকে। নিচের Lab এ এটা দেখবেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Lock File রাখার জায়গা <code>/run/lock/</code>, যা প্রতি Boot এ খালি হয় আর সবাই লিখতে
                পারে। একই কাজের জন্য সব জায়গায় একই Lock File এর নাম ব্যবহার করুন, তাহলে কেউ হাতে চালালেও
                (<code>flock -n /run/lock/my-tours-backup.lock /usr/local/bin/my-tours-backup</code>) cron
                এর কপির সাথে ধাক্কা লাগবে না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <OverlapLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Lab এর শেষ পছন্দটা লক্ষ করুন, systemd Timer। সেখানে কোনো Lock লাগেনি, তবুও একসাথে একটার
              বেশি চলেনি। কেন, সেটা এখন দেখার সময়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "systemd-timers",
      subHeader: { index: "011", title: "systemd Timers" },
      title: <SectionTitle>systemd Timer: একজোড়া Unit File</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লেসন ০২ এ systemd কে দেখেছেন Service চালু রাখার মালিক হিসেবে। systemd এর একই কাঠামোয়
                নির্ধারিত কাজও চলে, দুইটা Unit File দিয়ে। একটা <code>.service</code>, যা বলে কী চালাতে
                হবে, কে হয়ে, কোন পরিবেশে। আরেকটা একই নামের <code>.timer</code>, যা শুধু বলে কখন। সময়
                হলে Timer তার জোড়া Service টা Start করে, ঠিক যেমন আপনি হাতে{" "}
                <code>systemctl start</code> দিতেন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TimerPairDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              my-tours এর রাতের Backup এর জন্য দুইটা File। দুইটাই{" "}
              <code>/etc/systemd/system/</code> এ, যেখানে আপনার নিজের Unit থাকে (লেসন ০২)। প্রথমে Service:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "ini",
          filename: "/etc/systemd/system/my-tours-backup.service",
          code: `[Unit]
Description=my-tours nightly backup
OnFailure=my-tours-alert@%n.service

[Service]
Type=oneshot
User=mytours
Group=mytours
EnvironmentFile=/etc/my-tours/backup.env
ExecStart=/usr/local/bin/my-tours-backup
Nice=10
IOSchedulingClass=idle`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <code>Type=oneshot</code>: এটা সারাক্ষণ চলা কোনো Server নয়, একবার চলে শেষ হয়ে যায়।
                systemd Command শেষ হওয়া পর্যন্ত অপেক্ষা করে, তারপর ফল লিখে রাখে।
              </ListItem>
              <ListItem>
                <code>User</code> আর <code>Group</code>: কাজটা চলবে mytours হয়ে, root হয়ে নয় (লেসন
                ০৪)। Backup এর Folder এর মালিকও mytours।
              </ListItem>
              <ListItem>
                <code>EnvironmentFile</code>: Setting গুলো এই File থেকে (লেসন ০৫)। File টা পড়ে systemd
                নিজে, root হয়ে, তাই Script এর কিছু করতে হয় না।
              </ListItem>
              <ListItem>
                <code>ExecStart</code>: Script এর পুরো Path। এখানে Shell নেই, তাই Pipe বা{" "}
                <code>&gt;&gt;</code> লেখা যায় না, আর লাগেও না, কারণ Output নিজেই Journal এ যায়।
              </ListItem>
              <ListItem>
                <code>Nice=10</code> আর <code>IOSchedulingClass=idle</code>: CPU আর Disk এ এই কাজটা
                সবার পরে সুযোগ পাবে। ভোর রাতের দুই একজন পর্যটকের Request এর গতি Backup এর জন্য কমবে না
                (লেসন ০৮ এর Nice)।
              </ListItem>
              <ListItem>
                <code>OnFailure</code>: ব্যর্থ হলে systemd আরেকটা Unit চালায়। সেকশন ০১২ তে।
              </ListItem>
              <ListItem>
                কোনো <code>[Install]</code> অংশ নেই। এই Service কে কেউ Boot এ চালু করবে না, শুধু
                Timer চালাবে। তাই <code>systemctl status</code> এ এর পরিচয় <code>static</code>।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "ini",
          filename: "/etc/systemd/system/my-tours-backup.timer",
          code: `[Unit]
Description=Run the my-tours backup every night at 03:30 Dhaka time

[Timer]
OnCalendar=*-*-* 03:30:00 Asia/Dhaka
Persistent=true

[Install]
WantedBy=timers.target`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>OnCalendar</code> হলো systemd এর সময়ের ভাষা। গঠনটা{" "}
                <code>সপ্তাহের-দিন বছর-মাস-দিন ঘণ্টা:মিনিট:সেকেন্ড অঞ্চল</code>, যেকোনো জায়গায় * মানে
                যেকোনো। <code>*-*-* 03:30:00 Asia/Dhaka</code> মানে প্রতি বছরের প্রতি মাসের প্রতিদিন,
                ঢাকার 03:30 এ। cron এর মতো এখানেও তালিকা (<code>Mon,Wed</code>), পরিসর (
                <code>Mon..Fri</code>), ধাপ (<code>*:0/15</code>) চলে, আর ছোট নাম আছে:{" "}
                <code>hourly</code>, <code>daily</code>, <code>weekly</code>, <code>minutely</code>।
                <code>WantedBy=timers.target</code> মানে Boot এর সময় সব Timer এর সাথে এটাও চালু হবে।
              </ContentParagraph>
              <ContentParagraph>
                লেখার পরে যাচাই। <code>systemd-analyze calendar</code> একটা সময়ের লেখা নিয়ে বলে দেয়
                পরের বার কখন মিলবে। Server এর ঘড়ি UTC তে, দুইটা ভিন্ন লেখা দেওয়া হলো:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ systemd-analyze calendar "*-*-* 21:30:00" --iterations=2
Normalized form: *-*-* 21:30:00
    Next elapse: Sat 2026-10-31 21:30:00 UTC
       From now: 14h left
   Iteration #2: Sun 2026-11-01 21:30:00 UTC
       From now: 1 day 14h left
deploy@island-vps-01:~$ systemd-analyze calendar "*-*-* 03:30:00 Asia/Dhaka" --iterations=2
Normalized form: *-*-* 03:30:00 Asia/Dhaka
    Next elapse: Sat 2026-10-31 21:30:00 UTC
       From now: 14h left
   Iteration #2: Sun 2026-11-01 21:30:00 UTC
       From now: 1 day 14h left
deploy@island-vps-01:~$ systemd-analyze calendar "Mon..Fri 09:00"
  Original form: Mon..Fri 09:00
Normalized form: Mon..Fri *-*-* 09:00:00
    Next elapse: Mon 2026-11-02 09:00:00 UTC
       From now: 2 days left
deploy@island-vps-01:~$ systemd-analyze calendar "*-02-31 00:00"
  Original form: *-02-31 00:00
Normalized form: *-02-31 00:00:00
    Next elapse: never`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুইটা লেখা একই মুহূর্তে মিলেছে, 21:30 UTC। মানে systemd সত্যিই ঢাকার সময় বুঝে হিসাব
                করেছে, cron এর CRON_TZ এর মতো উপেক্ষা করেনি। আর ৩১ ফেব্রুয়ারি এখানে চুপ থাকেনি, সোজা
                বলেছে never। এবার File দুইটা বসানো, যাচাই, আর চালু করা:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ sudo systemd-analyze verify /etc/systemd/system/my-tours-backup.{service,timer}
deploy@island-vps-01:~$ sudo systemctl daemon-reload
deploy@island-vps-01:~$ sudo systemctl enable --now my-tours-backup.timer
Created symlink /etc/systemd/system/timers.target.wants/my-tours-backup.timer → /etc/systemd/system/my-tours-backup.timer.
deploy@island-vps-01:~$ systemctl list-timers my-tours-backup.timer
NEXT                        LEFT LAST PASSED UNIT                  ACTIVATES
Sat 2026-10-31 21:30:00 UTC  13h -         - my-tours-backup.timer my-tours-backup.service

1 timers listed.
deploy@island-vps-01:~$ systemctl status my-tours-backup.timer --no-pager
● my-tours-backup.timer - Run the my-tours backup every night at 03:30 Dhaka time
     Loaded: loaded (/etc/systemd/system/my-tours-backup.timer; enabled; preset: enabled)
     Active: active (waiting) since Sat 2026-10-31 07:30:12 UTC; 32ms ago
    Trigger: Sat 2026-10-31 21:30:00 UTC; 13h left
   Triggers: ● my-tours-backup.service`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <code>verify</code> কিছু না বলা মানে File দুইটায় কোনো ভুল পায়নি।
                </ListItem>
                <ListItem>
                  <code>daemon-reload</code>: systemd নতুন বা বদলানো Unit File আবার পড়ে। এটা ভুলে যাওয়া খুব
                  পরিচিত ভুল, তখন systemd পুরনো লেখাই মানতে থাকে।
                </ListItem>
                <ListItem>
                  <code>enable --now</code> দেওয়া হয়েছে <strong>Timer</strong> কে, Service কে নয়। enable
                  মানে Boot এ চালু হবে, <code>--now</code> মানে এখনই চালু। Service কে enable করলে কিছুই হয়
                  না, কারণ তার [Install] নেই। এটা নতুনদের সবচেয়ে প্রচলিত ভুল।
                </ListItem>
                <ListItem>
                  <code>active (waiting)</code>: Timer জেগে আছে আর অপেক্ষা করছে। Trigger বলে পরের বার কখন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                রাত পর্যন্ত অপেক্ষা না করে এখনই একবার চালানো যায়, Service টা হাতে Start করে। Timer এর
                কোনো ক্ষতি হয় না:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ sudo systemctl start my-tours-backup.service
deploy@island-vps-01:~$ sudo systemctl status my-tours-backup.service --no-pager
○ my-tours-backup.service - my-tours nightly backup
     Loaded: loaded (/etc/systemd/system/my-tours-backup.service; static)
     Active: inactive (dead) since Sat 2026-10-31 07:30:19 UTC; 35ms ago
TriggeredBy: ● my-tours-backup.timer
    Process: 622 ExecStart=/usr/local/bin/my-tours-backup (code=exited, status=0/SUCCESS)
   Main PID: 622 (code=exited, status=0/SUCCESS)
        CPU: 25ms

Oct 31 07:30:19 island-vps-01 systemd[1]: Starting my-tours-backup.service - my-tours nightly backup...
Oct 31 07:30:19 island-vps-01 my-tours-backup[622]: backup written: /var/backups/my-tours/my-tours-2026-10-31T0730Z.tar.gz (4.0K)
Oct 31 07:30:19 island-vps-01 my-tours-backup[622]: warning: BACKUP_HEARTBEAT_URL is not set, nobody will notice if this job stops running
Oct 31 07:30:19 island-vps-01 systemd[1]: my-tours-backup.service: Deactivated successfully.
Oct 31 07:30:19 island-vps-01 systemd[1]: Finished my-tours-backup.service - my-tours nightly backup.`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                cron এর সাথে তফাতগুলো এই একটা Output এই দেখা যায়। <code>status=0/SUCCESS</code>, মানে
                systemd Exit Code টা মনে রেখেছে। Script এর প্রতিটা লাইন Journal এ, সময় আর Process এর
                নম্বর সহ, কোনো Redirect ছাড়া। <code>inactive (dead)</code> শুনতে ভয়ের, কিন্তু oneshot
                Service এর জন্য এটাই সুস্থ অবস্থা: কাজ শেষ, এখন কিছু চলছে না। TriggeredBy বলে কে একে চালায়।
              </ContentParagraph>
              <ContentParagraph>
                আর সেই একসাথে দুইবার চলার প্রশ্ন। Timer এর সময় হলে systemd তার Service কে Start করতে বলে।
                Service আগের Run এ তখনো active থাকলে, একটা চলমান Unit কে আবার Start করার কোনো মানে নেই,
                তাই systemd নতুন কিছু শুরু করে না। একটা Unit এর একটাই কপি চলে, এটা systemd এর গঠনের
                অংশ। তাই Timer এ flock লাগে না।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "timer-options",
      subHeader: { index: "012", title: "Missed Runs and Timer Options" },
      title: <SectionTitle>Server বন্ধ ছিল: Persistent, আর Timer এর বাকি Option</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রাত 21:20 এ Provider একটা Kernel Update এর পর Server Reboot করল, ফিরল 21:45 এ। মাঝে 21:30
                এর Backup এর সময় পার হয়ে গেছে। কী হবে?
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>cron:</strong> কিছুই না। cron প্রতি মিনিটে শুধু সেই মিনিটটা মেলায়। যে মিনিট
                  সে চালু থাকা অবস্থায় দেখেনি, তার কোনো হিসাব রাখে না। আজ রাতের Backup নেই, পরেরটা কাল।
                </ListItem>
                <ListItem>
                  <strong>anacron:</strong> এই সমস্যার পুরনো সমাধান। anacron মিনিট বা ঘণ্টা বোঝে না, বোঝে
                  দিন: প্রতিদিন একবার, প্রতি সপ্তাহে একবার। শেষ কবে চলেছিল একটা File এ লিখে রাখে, আর চালু
                  হলে দেখে কোনোটা বাকি পড়েছে কি না। Laptop এর জন্য বানানো, যা রাতে বন্ধ থাকে। Ubuntu
                  Desktop এ থাকে, Server এ নয়: Practice Server এ <code>dpkg -l anacron</code> বলেছে{" "}
                  <code>un</code>, মানে বসানো নেই।
                </ListItem>
                <ListItem>
                  <strong>systemd Timer, Persistent ছাড়া:</strong> cron এর মতোই, ফসকে গেলে গেল।
                </ListItem>
                <ListItem>
                  <strong>systemd Timer, <code>Persistent=true</code>:</strong> Timer প্রতিবার চলার পর
                  একটা Stamp File এর সময় বদলে রাখে, <code>/var/lib/systemd/timers/</code> Folder এ। Timer
                  আবার চালু হলে হিসাব করে: শেষ Run এর পর এমন কোনো সময় কি পার হয়েছে যখন আমার চলার কথা
                  ছিল? হলে সাথে সাথে একবার চালায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এটা মুখের কথায় না মেনে মাপা হলো। দুইটা প্রতি মিনিটের Timer, একটা Persistent সহ, একটা
                ছাড়া। 07:29 এ দুইটাই একবার চলল, তারপর 07:29:43 এ দুইটাই থামানো হলো, যেন Server বন্ধ।
                07:30:00 এর Run দুইটারই ফসকে গেল। 07:30:28 এ আবার চালু:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "Persistent এর পরীক্ষা",
          code: `root@island-vps-01:~# ls -l /var/lib/systemd/timers/ | grep demo
-rw-r--r-- 1 root root 0 Oct 31 07:29 stamp-demo-persist.timer

# 07:30:28 এ দুইটা Timer আবার চালু, তিন সেকেন্ড পরে দুইটা Log:
persist log:   07:29:00 07:30:28
nopersist log: 07:29:00

# Journal
2026-10-31T07:30:28+00:00 island-vps-01 systemd[1]: Starting demo-persist.service - Demo job (persist)...
2026-10-31T07:30:28+00:00 island-vps-01 systemd[1]: Finished demo-persist.service - Demo job (persist).`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Stamp File আছে শুধু Persistent ওয়ালার। চালু করার সেকেন্ডেই সেটা ফসকানো Run টা চালিয়েছে,
              07:30:28 এ। অন্যটা কিছুই করেনি, পরের মিনিটের অপেক্ষায় ছিল। রাতের Backup, সাপ্তাহিক
              পরিষ্কার, এমন যেকোনো কাজে যেখানে একটা বাদ পড়া মানে ক্ষতি, Persistent=true দিন। Ubuntu
              নিজেও দিয়েছে: logrotate, apt-daily, fstrim, সবগুলোর Timer এ Persistent=true লেখা।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <MissedRunLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Persistent ছাড়াও Timer এর কয়েকটা Option আছে যা প্রায়ই কাজে লাগে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>AccuracySec</code>: systemd শক্তি বাঁচাতে কাছাকাছি সময়ের কয়েকটা Timer একসাথে
                  জাগায়। Default এ এক মিনিট পর্যন্ত দেরি করতে পারে। সেকেন্ডের হিসাবে কাঁটায় কাঁটায় দরকার
                  হলে <code>AccuracySec=1s</code>।
                </ListItem>
                <ListItem>
                  <code>RandomizedDelaySec</code>: নির্ধারিত সময়ের পরে একটা এলোমেলো দেরি যোগ করে। একটা
                  Server এ মানে নেই, কিন্তু একশটা Server একই রাত 00:00 এ একই Backup Storage এ ঝাঁপিয়ে
                  পড়লে বিপদ। Ubuntu র apt-daily তে এটা ১২ ঘণ্টা, যাতে পৃথিবীর সব Server একসাথে Update
                  Server এ না যায়। সেকশন ০০১ এর তালিকায় apt-daily এর অদ্ভুত সময়, 00:06:18, এই কারণেই।
                </ListItem>
                <ListItem>
                  <code>OnBootSec</code> আর <code>OnUnitActiveSec</code>: ঘড়ির সময় নয়, পার হওয়া সময়।{" "}
                  <code>OnBootSec=10min</code> মানে Boot এর দশ মিনিট পরে, <code>OnUnitActiveSec=90min</code>{" "}
                  মানে শেষবার চলার ৯০ মিনিট পরে আবার। সেকশন ০০৪ এর প্রতি ৯০ মিনিটের সমস্যার উত্তর।
                </ListItem>
                <ListItem>
                  <code>OnFailure=</code> (Service এর [Unit] এ): Service ব্যর্থ হলে systemd আরেকটা Unit চালায়। cron
                  এ এর কোনো সমান জিনিস নেই।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                OnFailure কীভাবে কাজ করে, দেখা যাক। একটা ছোট Template Service বানানো হলো,{" "}
                <code>my-tours-alert@.service</code>। নামের <code>@</code> মানে এটা একটা Template, যাকে ডাকার
                সময় একটা নাম দেওয়া যায়, আর ভেতরে <code>%i</code> সেই নামের জায়গা নেয়। Backup এর Service এ{" "}
                <code>OnFailure=my-tours-alert@%n.service</code>, যেখানে <code>%n</code> হলো ব্যর্থ Unit এর
                পুরো নাম।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "ini",
          filename: "/etc/systemd/system/my-tours-alert@.service",
          code: `[Unit]
Description=Tell a human that %i failed

[Service]
Type=oneshot
ExecStart=/usr/bin/logger -p user.err -t my-tours-alert "%i failed, see: journalctl -u %i"`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আসল জীবনে এই Service একটা Slack বা Email এ খবর পাঠাবে, এখানে শুধু Journal এ একটা Error
              লেখে। এবার ইচ্ছা করে ভাঙা হলো: env File থেকে <code>BACKUP_DIR</code> এর লাইনটা মুছে Backup
              চালানো হলো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ sudo systemctl start my-tours-backup.service
Job for my-tours-backup.service failed because the control process exited with error code.
See "systemctl status my-tours-backup.service" and "journalctl -xeu my-tours-backup.service" for details.
deploy@island-vps-01:~$ sudo systemctl status my-tours-backup.service --no-pager
× my-tours-backup.service - my-tours nightly backup
     Loaded: loaded (/etc/systemd/system/my-tours-backup.service; static)
     Active: failed (Result: exit-code) since Sat 2026-10-31 07:56:23 UTC; 25ms ago
TriggeredBy: ● my-tours-backup.timer
    Process: 1289 ExecStart=/usr/local/bin/my-tours-backup (code=exited, status=1/FAILURE)
   Main PID: 1289 (code=exited, status=1/FAILURE)
        CPU: 5ms

Oct 31 07:56:23 island-vps-01 systemd[1]: Starting my-tours-backup.service - my-tours nightly backup...
Oct 31 07:56:23 island-vps-01 my-tours-backup[1289]: /usr/local/bin/my-tours-backup: line 8: BACKUP_DIR: BACKUP_DIR is not set
Oct 31 07:56:23 island-vps-01 systemd[1]: my-tours-backup.service: Main process exited, code=exited, status=1/FAILURE
Oct 31 07:56:23 island-vps-01 systemd[1]: my-tours-backup.service: Failed with result 'exit-code'.
Oct 31 07:56:23 island-vps-01 systemd[1]: Failed to start my-tours-backup.service - my-tours nightly backup.
Oct 31 07:56:23 island-vps-01 systemd[1]: my-tours-backup.service: Triggering OnFailure= dependencies.
deploy@island-vps-01:~$ sudo journalctl -t my-tours-alert --no-pager -o short-iso
2026-10-31T07:56:23+00:00 island-vps-01 my-tours-alert[1294]: my-tours-backup.service failed, see: journalctl -u my-tours-backup.service
deploy@island-vps-01:~$ systemctl --failed --no-pager
  UNIT                    LOAD   ACTIVE SUB    DESCRIPTION
● my-tours-backup.service loaded failed failed my-tours nightly backup`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তিনটা জিনিস একসাথে ঘটল, যার কোনোটাই cron এ হতো না। systemd Exit Code 1 দেখে Service কে
                failed চিহ্ন দিল। Script এর Error এর লেখাটা Journal এ থেকে গেল, ঠিক কোন Variable নেই
                সহ। আর একই সেকেন্ডে Alert এর Service চলে একজন মানুষের জন্য খবর রাখল।{" "}
                <code>systemctl --failed</code> এখন সকালের প্রথম Command হতে পারে, কোন কাজ রাতে ভেঙেছে।
                সারানোর পরে <code>sudo systemctl reset-failed my-tours-backup.service</code> দিয়ে লাল দাগটা
                মুছে ফেলুন।
              </ContentParagraph>
              <ContentParagraph>
                শেষে একটা ছোট কিন্তু কাজের যন্ত্র: <code>systemd-run</code>। একবারের একটা কাজ কিছুক্ষণ পরে
                চালাতে কোনো File লিখতে হয় না, systemd নিজে একটা অস্থায়ী Timer বানিয়ে দেয়:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "root@island-vps-01",
          code: `root@island-vps-01:~# systemd-run --on-active=40s --unit=my-tours-once /bin/sh -c "echo transient ran at \\$(date -u +%T) >> /tmp/once.log"
Running timer as unit: my-tours-once.timer
Will run service as unit: my-tours-once.service
root@island-vps-01:~# systemctl list-timers --no-pager | head -2
NEXT                            LEFT LAST PASSED UNIT                         ACTIVATES
Sat 2026-10-31 07:29:52 UTC      39s -         - my-tours-once.timer          my-tours-once.service
root@island-vps-01:~# cat /tmp/once.log      # চল্লিশ সেকেন্ড পরে
transient ran at 07:30:12`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Deploy এর পরে দশ মিনিট বাদে একটা Cache খালি করা, বা রাত দুইটায় একবার একটা বড় Migration,
              এমন কাজের জন্য এটা crontab এ লাইন লিখে পরে মুছে ফেলার চেয়ে অনেক পরিষ্কার। কাজ শেষ হলে
              অস্থায়ী Timer নিজেই উধাও হয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "choosing-debugging",
      subHeader: { index: "013", title: "Choosing and Debugging" },
      title: <SectionTitle>cron না Timer, আর যে Job চলেনি তাকে খুঁজে বের করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দুইটা যন্ত্রই দেখা হলো। পাশাপাশি রাখলে:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["প্রশ্ন", "cron", "systemd Timer"],
          rows: [
            ["লিখতে কতটুকু", "এক লাইন", "দুইটা File"],
            ["সবচেয়ে ছোট একক", "এক মিনিট", "সেকেন্ড, তারও কম"],
            ["সময় অঞ্চল", "Server এর ঘড়ি, Ubuntu তে CRON_TZ চলে না", "OnCalendar এ অঞ্চলের নাম, সত্যিই মানে"],
            ["Output", "Mail এ, MTA না থাকলে হারায়", "নিজে থেকে Journal এ"],
            ["সফল না ব্যর্থ", "জানে না", "Exit Code মনে রাখে, systemctl --failed"],
            ["ব্যর্থ হলে খবর", "নিজে বানাতে হয়", "OnFailure="],
            ["একসাথে দুইবার", "হ্যাঁ, flock লাগে", "না, একটা Unit এর একটাই কপি"],
            ["Server বন্ধ থাকলে", "ফসকে যায়", "Persistent=true ধরে নেয়"],
            ["পরিবেশ", "ছোট আর অদ্ভুত, Shell dash", "Unit এ যা লেখা, EnvironmentFile"],
            ["সীমা আর অগ্রাধিকার", "nice দিয়ে হাতে", "Nice, IOSchedulingClass, MemoryMax"],
            ["পরের Run কখন", "হিসাব করতে হয়", "systemctl list-timers"],
            ["কোথায় পাবেন", "প্রায় সব Unix এ", "systemd ওয়ালা Linux এ"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিয়মটা সরল। নতুন Server এ নতুন কোনো কাজ, যার ব্যর্থ হওয়া মানে ক্ষতি, তার জন্য systemd
                Timer। ছোট, ক্ষতিহীন কাজ বা নিজের User এর একটা দ্রুত কাজ, যেমন প্রতি ঘণ্টায় একটা Cache
                File মোছা, তার জন্য cron চলে। আর cron কে চিনে রাখতেই হবে, কারণ পুরনো Server, Shared
                Hosting এর cPanel, আর অসংখ্য Blog আর Documentation আজও cron এর ভাষায় কথা বলে। GitHub
                Actions এর <code>schedule</code> আর Kubernetes এর CronJob ও এই পাঁচটা ঘরই পড়ে।
              </ContentParagraph>
              <ContentParagraph>
                একটা তৃতীয় জায়গাও আছে যেখানে লোকে নির্ধারিত কাজ রাখে: App এর নিজের ভেতরে, node-cron বা
                NestJS এর Schedule Module এর মতো Library দিয়ে। এটা সুবিধার, কারণ App এর Code আর Database
                এর Connection হাতের কাছেই থাকে। কিন্তু একটা ফাঁদ আছে। App এর যতগুলো কপি চলে, Schedule ও
                ততবার চলে। আজ my-tours এর একটা কপি, কাল ভিড় সামলাতে দুইটা হলে প্রতিটা রাতের ইমেইল দুইবার
                যাবে। তাই App এর ভেতরের Schedule শুধু এমন কাজের জন্য, যা দুইবার চললেও ক্ষতি নেই। এমন কাজকে
                বলে <strong>Idempotent</strong>, যেমন পনেরো মিনিটের পুরনো অপরিশোধিত আসন ছেড়ে দেওয়ার একটা
                UPDATE। App অনেক কপিতে চালানোর গল্পটা আসবে Scaling এর Module এ।
              </ContentParagraph>
              <ContentParagraph>
                আর যেদিন কোনো Job চলবে না, খোঁজার ক্রম এই লেসনের ফাঁদগুলোর উল্টো দিক থেকে। লক্ষণটা বেছে
                নিন, কারণ আর প্রমাণের Command দেখুন:
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <JobDebugLab /> },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "hands-on",
      subHeader: { index: "014", title: "Hands-on" },
      title: <SectionTitle>my-tours এর Backup: হাতে, তারপর cron এ, তারপর Timer এ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার পুরো লেসন এক জায়গায়, আপনার নিজের my-tours এর জন্য। লেসন ০১ এর Practice Server এ
                (systemd সহ) এটা চলবে, প্রতিটা ধাপ সেখানে চালিয়ে দেখা। এই মুহূর্তে my-tours এর Database
                Server এ নেই, তাই Backup নেবে দুইটা জিনিসের: <code>/etc/my-tours</code> এর Setting আর{" "}
                <code>/srv/my-tours/data</code> এর File। Database এর Backup Island Tours এর উদাহরণে
                সেকশন ০১৫ তে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ধাপ ১, Folder আর মালিকানা।</strong> Backup জমবে{" "}
                <code>/var/backups/my-tours</code> এ (লেসন ০১ এর <code>/var/backups</code>), মালিক mytours,
                Mode 700, কারণ Archive এর ভেতরে Secret থাকবে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ধাপ ২, Setting এর File।</strong> Script এর ভেতরে কোনো Path বা ঠিকানা লেখা থাকবে
                না, সব আসবে একটা env File থেকে, যাতে আরেকটা Server এ শুধু File বদলালেই চলে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "/etc/my-tours/backup.env (root:mytours, 640)",
          code: `# Read by my-tours-backup.service (EnvironmentFile=) and by the cron line (set -a; source).
BACKUP_DIR=/var/backups/my-tours
BACKUP_SOURCES="etc/my-tours srv/my-tours/data"`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>BACKUP_SOURCES</code> এর মানে ফাঁকা জায়গা আছে, তাই উদ্ধৃতিচিহ্ন। systemd আর bash
                দুইজনেই উদ্ধৃতিচিহ্নসহ মান ঠিকঠাক পড়ে, উদ্ধৃতি ছাড়া bash দ্বিতীয় শব্দটাকে একটা Command
                ভাবত। Path গুলো <code>/</code> ছাড়া লেখা ইচ্ছা করে, কারণটা Script এর মন্তব্যে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ধাপ ৩, Script।</strong> <code>/usr/local/bin/my-tours-backup</code>, Mode 755:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "/usr/local/bin/my-tours-backup",
          code: `#!/usr/bin/env bash
# my-tours nightly backup: one dated archive, the newest 7 days kept.
# Settings come from the environment, so the same script runs from cron or from a systemd timer.
set -euo pipefail
umask 077   # the archive holds api.env, so only the owner may read it
cd /        # find goes back to its starting folder at the end, so start where every user may enter

: "\${BACKUP_DIR:?BACKUP_DIR is not set}"
: "\${BACKUP_SOURCES:?BACKUP_SOURCES is not set}"

stamp="$(date -u +%Y-%m-%dT%H%MZ)"
target="$BACKUP_DIR/my-tours-$stamp.tar.gz"

# Paths in BACKUP_SOURCES are relative to /, so a restore never overwrites the live files by accident.
# shellcheck disable=SC2086  # a space separated list, split on purpose
tar --create --gzip --file "$target" --directory / $BACKUP_SOURCES
echo "backup written: $target ($(du -h "$target" | cut -f1))"

# -mtime +6 means at least 7 whole days old: today plus the 6 days before it stay.
find "$BACKUP_DIR" -name "my-tours-*.tar.gz" -mtime +6 -print -delete | sed "s/^/deleted: /"

if [ -n "\${BACKUP_HEARTBEAT_URL:-}" ]; then
  curl -fsS --max-time 10 --retry 3 "$BACKUP_HEARTBEAT_URL" > /dev/null
  echo "heartbeat sent"
else
  echo "warning: BACKUP_HEARTBEAT_URL is not set, nobody will notice if this job stops running"
fi`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <code>#!/usr/bin/env bash</code>: cron যে Shell দিয়েই ডাকুক, Script চলবে bash এ।
              </ListItem>
              <ListItem>
                <code>set -euo pipefail</code>: কোনো Command ব্যর্থ হলে Script থামে (-e), না বসানো Variable
                ব্যবহার করলে থামে (-u), আর Pipe এর মাঝের কোনো Command ব্যর্থ হলেও সেটা ধরা পড়ে (pipefail)। এটা না
                থাকলে tar ব্যর্থ হলেও Script খুশি মনে পরের লাইনে চলে যেত, আর শেষে বলত সব ঠিক আছে।
              </ListItem>
              <ListItem>
                <code>umask 077</code>: এই Script যা File বানাবে তা শুধু মালিক পড়তে পারবে (লেসন ০৪)। প্রথম
                পরীক্ষায় এই লাইন ছিল না, আর Archive টা তৈরি হয়েছিল Mode 664 এ, মানে অন্যরা পড়তে পারত,
                অথচ ভেতরে api.env এর Secret। একটা লাইনে সারানো।
              </ListItem>
              <ListItem>
                <code>cd /</code>: এই লাইনটাও পরীক্ষা থেকে এসেছে। এটা ছাড়া deploy এর Home Folder এ দাঁড়িয়ে
                হাতে চালাতেই Archive তৈরি হলো, তারপর find বলল{" "}
                <code>find: Failed to restore initial working directory: /home/deploy: Permission denied</code>।
                find কাজ শেষে যে Folder থেকে শুরু করেছিল সেখানে ফিরতে চায়, আর mytours deploy এর Folder এ
                ঢুকতেই পারে না (লেসন ০৪)। set -e সাথে সাথে Script থামিয়ে দিল, Heartbeat পর্যন্ত পৌঁছাল না।
                systemd Script চালায় <code>/</code> থেকে, তাই Timer এ এই ভুল কখনো দেখা যেত না। ধরা পড়ল ঠিক যে
                User হয়ে চলবে সেই User হয়ে হাতে চালানোর সময়।
              </ListItem>
              <ListItem>
                <code>{"${BACKUP_DIR:?...}"}</code>: Variable না থাকলে Script এই বার্তা দিয়ে থামে। কোনো বিকল্প
                মান ধরে নেওয়া নয় (লেসন ০৫)।
              </ListItem>
              <ListItem>
                <code>date -u +%Y-%m-%dT%H%MZ</code>: নামে UTC সময়, শেষে Z, যাতে কেউ ঢাকার সময় ভেবে ভুল না
                করেন। Script এর ভেতরে % এর কোনো বিশেষ মানে নেই, এটা crontab নয়।
              </ListItem>
              <ListItem>
                <code>--directory /</code> আর Path এর শুরুতে <code>/</code> না থাকা: Archive এর ভেতরে Path
                থাকে <code>etc/my-tours/...</code>, তাই কোনো Folder এ খুললে সেটা সেই Folder এর ভেতরেই খোলে,
                চলমান Server এর আসল File এর উপর নয়।
              </ListItem>
              <ListItem>
                <code>find ... -mtime +6 -delete</code>: পুরনো Archive মোছা। এর মানে পরীক্ষা করে নিচে দেখবেন।
              </ListItem>
              <ListItem>
                শেষে Heartbeat, যদি ঠিকানাটা দেওয়া থাকে। না থাকলে চুপ না থেকে একটা সতর্কবার্তা লেখে, যাতে
                Log পড়লেই বোঝা যায় নজরদারি বসানো হয়নি।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              <strong>ধাপ ৪, হাতে, ঠিক যেভাবে চলবে।</strong> mytours হয়ে, খালি পরিবেশে, শুধু env File নিয়ে:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ sudo -u mytours env -i PATH=/usr/bin:/bin bash -c \\
  'set -a; source /etc/my-tours/backup.env; set +a; /usr/local/bin/my-tours-backup'
backup written: /var/backups/my-tours/my-tours-2026-10-31T0755Z.tar.gz (4.0K)
warning: BACKUP_HEARTBEAT_URL is not set, nobody will notice if this job stops running
deploy@island-vps-01:~$ sudo ls -l /var/backups/my-tours/
total 4
-rw------- 1 mytours mytours 451 Oct 31 07:55 my-tours-2026-10-31T0755Z.tar.gz
deploy@island-vps-01:~$ sudo tar -tzf /var/backups/my-tours/my-tours-2026-10-31T0755Z.tar.gz
etc/my-tours/
etc/my-tours/backup.env
etc/my-tours/api.env
srv/my-tours/data/
srv/my-tours/data/seed.json`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Archive এর Mode 600, ভেতরে যা থাকার কথা সব আছে, Path গুলো <code>/</code> ছাড়া। এবার Retention
                এর হিসাব, যেটা আন্দাজে লিখলে প্রায় সবাই একদিন ভুল করেন। <code>-mtime +7</code> মানে কি সাত
                দিনের বেশি? বিভিন্ন বয়সের কয়েকটা খালি File বানিয়ে find কে জিজ্ঞেস করা হলো:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "find -mtime এর পরীক্ষা, 2026-10-31 07:28 এ",
          code: `root@island-vps-01:/tmp/agetest# ls -l --time-style=+%F_%T
-rw-r--r-- 1 root root 0 2026-10-22_07:28:55 islandtours-9d.dump
-rw-r--r-- 1 root root 0 2026-10-23_07:28:55 islandtours-8d.dump
-rw-r--r-- 1 root root 0 2026-10-23_19:28:55 islandtours-7d12h.dump
-rw-r--r-- 1 root root 0 2026-10-24_07:28:55 islandtours-7d.dump
-rw-r--r-- 1 root root 0 2026-10-24_08:28:55 islandtours-6d23h.dump
-rw-r--r-- 1 root root 0 2026-10-25_07:28:55 islandtours-6d.dump
-rw-r--r-- 1 root root 0 2026-10-26_07:28:55 islandtours-5d.dump
root@island-vps-01:/tmp/agetest# find . -name "*.dump" -mtime +7
./islandtours-8d.dump
./islandtours-9d.dump
root@island-vps-01:/tmp/agetest# find . -name "*.dump" -mtime +6
./islandtours-7d.dump
./islandtours-7d12h.dump
./islandtours-8d.dump
./islandtours-9d.dump`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                find বয়স গোনে পূর্ণ দিনে, ভগ্নাংশ ফেলে দিয়ে। সাড়ে সাত দিনের File এর বয়স তার হিসাবে
                সাত। আর <code>+7</code> মানে সাতের চেয়ে বেশি, মানে আট বা তার বেশি। তাই <code>-mtime +7</code>{" "}
                ধরে আট দিন বা তার বেশি পুরনো File, আর <code>-mtime +6</code> ধরে সাত দিন বা তার বেশি। প্রতি
                রাতে একটা Backup হলে আজকেরটা সহ শেষ সাতটা রাখতে চাই <code>+6</code>। Island Tours এর
                প্রথম Script এ <code>+7</code> ছিল, আর Disk এ সবসময় আটটা Backup পাওয়া যেত, কেউ বুঝত না কেন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ধাপ ৫, cron সংস্করণ।</strong> mytours এর crontab এ এক লাইন। এখানে env File টা নিজেই
                পড়তে হবে, Lock নিজেই নিতে হবে, Output নিজেই Log এ পাঠাতে হবে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "sudo crontab -u mytours -l",
          code: `# my-tours nightly backup. Server clock is UTC: 21:30 UTC is 03:30 in Dhaka.
30 21 * * * /bin/bash -c "set -a; source /etc/my-tours/backup.env; set +a; exec flock -n /run/lock/my-tours-backup.lock /usr/local/bin/my-tours-backup" >> /var/log/my-tours/backup.log 2>&1`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা অংশ এই লেসনের একটা সেকশনের উত্তর: bash কারণ dash source চেনে না (০০৭), env File
                কারণ cron এর পরিবেশ খালি (০০৭), flock কারণ cron আগের Run দেখে না (০১০), Log এ Redirect
                কারণ Mail হারিয়ে যায় (০০৮), আর উপরের মন্তব্য কারণ ঘড়ি UTC (০০৯)। লাইনে একটাও % নেই (০০৫)।{" "}
                <code>exec</code> মানে bash নিজে flock এ বদলে যায়, একটা বাড়তি Process ঝুলে থাকে না।
                পরীক্ষার জন্য সময়ের অংশ কিছুক্ষণের জন্য <code>* * * * *</code> করা হয়েছিল, আর Folder এ ৬, ৭
                আর ৮ দিন পুরনো তিনটা খালি Archive রেখে দেওয়া হয়েছিল। এক মিনিট পরে Log:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "/var/log/my-tours/backup.log",
          code: `backup written: /var/backups/my-tours/my-tours-2026-10-31T0756Z.tar.gz (4.0K)
deleted: /var/backups/my-tours/my-tours-2026-10-24T2130Z.tar.gz
deleted: /var/backups/my-tours/my-tours-2026-10-23T2130Z.tar.gz
warning: BACKUP_HEARTBEAT_URL is not set, nobody will notice if this job stops running`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                cron এর ভেতর দিয়ে একই Script, একই ফল, আর Retention ঠিক যা চাওয়া হয়েছিল: ৭ আর ৮ দিনের Archive
                মুছে গেছে, ৬ দিনেরটা আছে। তারপর সময়ের অংশ আবার 21:30 এ ফেরানো।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ধাপ ৬, Timer সংস্করণ।</strong> সেকশন ০১১ এর দুইটা File আর সেকশন ০১২ এর Alert। একই
                Script, কোনো বদল ছাড়া, কারণ Script নিজে জানে না কে তাকে ডাকছে। দুইটা সংস্করণ পাশাপাশি
                রেখে দেখুন: cron এর লাইনের পাঁচটা দায়িত্বের চারটা Timer নিজে নিয়ে নিয়েছে। একসাথে দুইটা
                বসিয়ে রাখবেন না, তাহলে প্রতি রাতে দুইটা Backup হবে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ধাপ ৭, Restore এর পরীক্ষা।</strong> যে Backup কখনো খুলে দেখা হয়নি, সেটা Backup নয়,
                একটা আশা। একটা খালি Folder এ খুলুন আর মিলিয়ে দেখুন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ mkdir -p /tmp/restore-test
deploy@island-vps-01:~$ latest="$(sudo sh -c 'ls -1t /var/backups/my-tours/*.tar.gz | head -1')"
deploy@island-vps-01:~$ sudo tar --extract --gzip --file "$latest" --directory /tmp/restore-test
deploy@island-vps-01:~$ sudo find /tmp/restore-test -type f
/tmp/restore-test/etc/my-tours/backup.env
/tmp/restore-test/etc/my-tours/api.env
/tmp/restore-test/srv/my-tours/data/seed.json
deploy@island-vps-01:~$ sudo diff /tmp/restore-test/srv/my-tours/data/seed.json /srv/my-tours/data/seed.json && echo same
same`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "একই Disk এর Backup, একই Disk এর সাথে মরে",
          content: (
            <p>
              <code>/var/backups/my-tours</code> আছে Server এর নিজের Disk এ। ভুল UPDATE বা মুছে ফেলা File
              থেকে এটা বাঁচাবে। কিন্তু Disk নষ্ট হলে, Provider Account এ সমস্যা হলে, বা কেউ পুরো Server মুছে
              দিলে Backup ও যাবে। তাই এটা প্রথম স্তর। দ্বিতীয় স্তর Provider এর Snapshot, যা লেসন ১১ তে
              চালু করবেন। তৃতীয় স্তর অন্য কোনো জায়গায় একটা কপি, যেমন Object Storage, যা আসবে Database আর
              Cloud এর Module এ।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours, ভোর সাড়ে তিনটার Backup</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর VPS এ নিজের লেখা নির্ধারিত কাজ মাত্র একটা, রাতের Database Backup। বাকি যা
                চলে, তা Ubuntu নিজে এনেছে। আর একটা কাজ, যা অনেকে Schedule করেন, এখানে নেই: Certificate
                নবীকরণ। Caddy নিজের ভেতরে Certificate এর মেয়াদ হিসাব রাখে আর সময়মতো নতুন করে (Module 06,
                লেসন ০৮), কোনো Timer লাগে না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <IslandScheduleDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Backup এর Timer আর Service, my-tours এর মতোই, শুধু Script টা PostgreSQL এর Dump নেয়।
                PostgreSQL চলে Docker এ, কিন্তু শুধু <code>127.0.0.1:5432</code> এ শোনে (লেসন ০৬, Port টা
                বাইরের জন্য বন্ধ), আর Server এ বসানো <code>pg_dump</code> সেই স্থানীয় ঠিকানায় যুক্ত হয়।
                এটা Island Tours এর Setting এর নমুনা, এই লেসনের Practice Server এ PostgreSQL চালানো হয়নি:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "ini",
          filename: "Island Tours এর Unit (নমুনা)",
          code: `# /etc/systemd/system/islandtours-backup.timer
[Unit]
Description=Island Tours database backup, 03:30 Dhaka time

[Timer]
OnCalendar=*-*-* 03:30:00 Asia/Dhaka
Persistent=true

[Install]
WantedBy=timers.target

# /etc/systemd/system/islandtours-backup.service
[Unit]
Description=Island Tours database backup
OnFailure=islandtours-alert@%n.service

[Service]
Type=oneshot
User=islandtours
Group=islandtours
EnvironmentFile=/etc/islandtours/backup.env
ExecStart=/usr/local/bin/islandtours-backup
Nice=10
IOSchedulingClass=idle`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "/usr/local/bin/islandtours-backup (নমুনা)",
          code: `#!/usr/bin/env bash
set -euo pipefail
umask 077

: "\${BACKUP_DIR:?BACKUP_DIR is not set}"
: "\${BACKUP_DATABASE_URL:?BACKUP_DATABASE_URL is not set}"
: "\${BACKUP_HEARTBEAT_URL:?BACKUP_HEARTBEAT_URL is not set}"

target="$BACKUP_DIR/islandtours-$(date -u +%Y-%m-%dT%H%MZ).dump"

# Custom format: compressed, and pg_restore can bring back one table on its own.
pg_dump --format=custom --file="$target" "$BACKUP_DATABASE_URL"
echo "dump written: $target ($(du -h "$target" | cut -f1))"

find "$BACKUP_DIR" -name "islandtours-*.dump" -mtime +6 -print -delete | sed "s/^/deleted: /"

# Only a finished, successful run reaches this line.
curl -fsS --max-time 10 --retry 3 "$BACKUP_HEARTBEAT_URL" > /dev/null`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                my-tours এর Script থেকে একটা তফাত লক্ষ করুন: এখানে Heartbeat বাধ্যতামূলক। কারণ এই Backup এর
                উপর একটা সত্যিকারের ব্যবসা দাঁড়িয়ে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Heartbeat</strong> বা <strong>Dead Man&apos;s Switch</strong> এর ধারণাটা পুরনো রেলগাড়ি
                থেকে: চালক একটা হাতল চেপে ধরে রাখেন, হাত সরে গেলে গাড়ি নিজে থামে। এখানে উল্টোটা ঘটে। একটা
                বাইরের নজরদারি সেবাকে বলা থাকে, প্রতি ২৪ ঘণ্টায় অন্তত একবার এই ঠিকানায় একটা Ping আসবে। Script
                এর একদম শেষ লাইন সেই Ping, আর <code>set -e</code> এর কারণে আগের কোনো ধাপ ব্যর্থ হলে Script
                সেখানে পৌঁছায়ই না। Ping না এলে, কারণ যাই হোক, সেবাটা Island Tours এর দলকে খবর দেয়।
              </ContentParagraph>
              <ContentParagraph>
                এর শক্তিটা হলো, এটা এমন ব্যর্থতাও ধরে যা Server নিজে কখনো জানাতে পারত না। OnFailure ধরে Script
                এর ভেতরের ব্যর্থতা। কিন্তু Timer টাই যদি কেউ ভুল করে Disable করে দেয়, Server যদি বন্ধ থাকে, বা
                Server টাই আর না থাকে, তাহলে OnFailure চলার কেউ নেই। Heartbeat এর নজরদারি Server এর বাইরে, তাই
                সে নীরবতাকেই খবর হিসেবে পড়ে। শুরুর গল্পের তিন সপ্তাহের খালি Folder, Heartbeat থাকলে প্রথম
                সকালেই ধরা পড়ত।
              </ContentParagraph>
              <ContentParagraph>Island Tours এর এই কাজ ঘিরে পাঁচটা সিদ্ধান্ত:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Timer, cron নয়।</strong> Persistent=true এর কারণে রাতের Reboot এ Backup বাদ পড়ে না,
                  আর OnFailure এর খবর সকালের আগেই দলের কাছে।
                </ListItem>
                <ListItem>
                  <strong>ভোর সাড়ে তিনটা, ঢাকার সময়ে লেখা।</strong> সারা দিনের মধ্যে বুকিং সবচেয়ে কম এই সময়ে।
                  OnCalendar এ ঢাকার নাম লেখা থাকায় পরে কেউ পড়ে ভুল বোঝেন না।
                </ListItem>
                <ListItem>
                  <strong>islandtours User, root নয়।</strong> Dump করার জন্য Database এ এই User এর শুধু পড়ার
                  অধিকার, লেখার নয়। Script এ ভুল থাকলেও Database বদলাতে পারবে না।
                </ListItem>
                <ListItem>
                  <strong>সাত দিন রাখা, তারপর মোছা।</strong> <code>-mtime +6</code>, ওপরের পরীক্ষার পরে ঠিক করা।
                  Disk এর মাপ লেসন ০৮ এর <code>df -h</code> দিয়ে প্রতি সপ্তাহে দেখা হয়।
                </ListItem>
                <ListItem>
                  <strong>মাসে একবার Restore এর মহড়া।</strong> একজন মানুষ, ক্যালেন্ডারের একটা Reminder ধরে, সর্বশেষ
                  Dump একটা আলাদা খালি Database এ <code>pg_restore</code> দিয়ে খুলে কয়েকটা বুকিং মিলিয়ে দেখেন।
                  এটা Schedule করা যায় না, কারণ যাচাইটাই মানুষের কাজ। লেসন ১১ এর মাসিক Checklist এ এটা আছে।
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
      title: <SectionTitle>আজ রাতের Backup, ঘড়ি থেকে Heartbeat পর্যন্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Island Tours এর Server এ আজ রাতে, কেউ জেগে নেই। ঢাকার ঘড়িতে ভোর 03:30 বাজার মুহূর্ত থেকে কী
              কী ঘটে:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "systemd এর ঘড়ি মেলে",
              description:
                "Server এর ঘড়িতে 21:30:00 UTC, মানে ঢাকায় 03:30। islandtours-backup.timer এর OnCalendar মিলে গেল। Timer Stamp File এর সময় বদলে রাখল, পরে Persistent এর হিসাবের জন্য।",
            },
            {
              title: "Service চালু হয়",
              description:
                "Timer তার জোড়া islandtours-backup.service কে Start করল। systemd root হয়ে /etc/islandtours/backup.env পড়ল, তারপর islandtours User হয়ে, Nice 10 আর idle Disk অগ্রাধিকার দিয়ে Script চালাল।",
            },
            {
              title: "Script নিজেকে পাহারা দেয়",
              description:
                "set -euo pipefail আর umask 077। তিনটা Variable আছে কি না দেখল, একটাও না থাকলে এখানেই থেমে যেত, Exit Code 1 নিয়ে।",
            },
            {
              title: "pg_dump Database এর সাথে কথা বলে",
              description:
                "127.0.0.1:5432 এ, Server এর ভেতরেই। এই Port বাইরে থেকে খোলা নয় (লেসন ০৬), আর Connection টা শুধু পড়ার অধিকারওয়ালা Database User এর।",
            },
            {
              title: "Dump লেখা হয়",
              description:
                "/var/backups/islandtours/islandtours-2026-10-31T2130Z.dump, Mode 600। নামে UTC তারিখ, তাই ঢাকার ১ নভেম্বর ভোরের Dump এর নামে ৩১ অক্টোবর।",
            },
            {
              title: "পুরনো Dump মোছে",
              description:
                "find -mtime +6 সাত দিন বা তার বেশি পুরনো Dump খুঁজে মুছল, আর প্রতিটার নাম deleted: দিয়ে লিখে রাখল। Disk এ এখন সাতটা Dump।",
            },
            {
              title: "Heartbeat বাইরে যায়",
              description:
                "curl দিয়ে নজরদারি সেবার ঠিকানায় একটা Ping। ufw বাইরে যাওয়া Connection আটকায় না (লেসন ০৬), DNS এর উত্তর আসে systemd-resolved থেকে (লেসন ০৯)।",
            },
            {
              title: "systemd ফলাফল লেখে",
              description:
                "Script Exit Code 0 দিয়ে বেরোল। systemd লিখল Deactivated successfully আর Finished। Script এর প্রতিটা লাইন Journal এ, journalctl -u islandtours-backup.service দিয়ে পড়া যায় (লেসন ০৭)।",
            },
            {
              title: "ব্যর্থ হলে দুইটা পাহারাদার",
              description:
                "কোনো ধাপ ব্যর্থ হলে Exit Code শূন্য নয়, OnFailure এর Alert Service সাথে সাথে খবর পাঠায়। আর Heartbeat না পৌঁছানোয় বাইরের সেবাও সকাল হওয়ার আগে খবর পাঠায়, Server নিজে যত চুপই থাকুক।",
            },
            {
              title: "সকালে একটা Command",
              description:
                "deploy ssh island দিয়ে ঢুকে systemctl list-timers islandtours-backup.timer চালান। LAST কলামে আজ রাতের সময়, PASSED এ কত ঘণ্টা আগে। systemctl --failed খালি। দিনের কাজ শুরু।",
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
                <strong>নিচের Lab টা আগে করুন।</strong> ছয়টা পরীক্ষায় এই লেসনের প্রতিটা ফাঁদ আপনি নিজের Server এ
                ঘটাবেন। কোনো ভিডিও এর বিকল্প নয়।
              </ListItem>
              <ListItem>
                <strong>Debian এর cron Package এর crontab(5) আর cron(8)</strong>, এই লেসনের cron এর আসল নিয়মের বই,
                কারণ Ubuntu র cron Debian থেকেই আসে। দুই দিনের ঘরের নিয়ম, Variable এর লাইন, PATH আর -P সব
                এখানে।{" "}
                {link("https://manpages.debian.org/trixie/cron/crontab.5.en.html", "manpages.debian.org crontab(5)")}
                {" আর "}
                {link("https://manpages.debian.org/trixie/cron/cron.8.en.html", "cron(8)")}। একটা ফাঁদ:
                manpages.ubuntu.com এ crontab(5) খুললে আসে cronie নামের অন্য cron এর পাতা, যেখানে CRON_TZ আর{" "}
                <code>crontab -T</code> আছে। Ubuntu র Default cron এ এর কোনোটাই নেই, পাতার উপরের Provided by
                লাইনটা দেখে নিন।
              </ListItem>
              <ListItem>
                <strong>systemd.timer আর systemd.time</strong>, Timer এর প্রতিটা Option আর OnCalendar এর পুরো
                ব্যাকরণ।{" "}
                {link("https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html", "systemd.timer")}
                {" আর "}
                {link("https://www.freedesktop.org/software/systemd/man/latest/systemd.time.html", "systemd.time")}
              </ListItem>
              <ListItem>
                <strong>Arch Wiki, systemd/Timers</strong>, উদাহরণসহ সবচেয়ে পড়ার মতো ব্যাখ্যা, আর cron থেকে Timer
                এ যাওয়ার একটা অংশ।{" "}
                {link("https://wiki.archlinux.org/title/Systemd/Timers", "wiki.archlinux.org/title/Systemd/Timers")}
              </ListItem>
              <ListItem>
                <strong>flock(1)</strong>, -n, -w আর Lock File এর আচরণ।{" "}
                {link("https://man7.org/linux/man-pages/man1/flock.1.html", "man7.org flock(1)")}
              </ListItem>
              <ListItem>
                <strong>crontab.guru</strong>, একটা cron লাইন লিখলে সাধারণ ইংরেজিতে মানে আর পরের Run। মনে রাখবেন
                এটাও Server এর সময় অঞ্চল জানে না।{" "}
                {link("https://crontab.guru", "crontab.guru")}
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
              <ContentParagraph>দশ লাইনে।</ContentParagraph>
              <ContentList>
                <ListItem>
                  cron একটা Daemon, প্রতি মিনিটের শুরুতে খাতা মেলায় আর যার লাইন তার পরিচয়ে /bin/sh দিয়ে
                  Command চালায়। তারপর আর কিছু দেখে না।
                </ListItem>
                <ListItem>
                  একটা লাইন: মিনিট, ঘণ্টা, মাসের দিন, মাস, সপ্তাহের দিন, তারপর Command। মিনিটে তারকা দিলে
                  ঘণ্টা ধরে প্রতি মিনিটে, আর দুই দিনের ঘর বাঁধা থাকলে যেকোনো একটা মিললেই চলে।
                </ListItem>
                <ListItem>
                  crontab -e লেখে, -l দেখায়, -r কিছু না জিজ্ঞেস করে সব মোছে। লাইনের % মানে নতুন লাইন, \% লিখুন,
                  অথবা একটা Script এর Path দিন।
                </ListItem>
                <ListItem>
                  /etc/crontab আর /etc/cron.d তে User এর ঘর লাগে। cron.d তে নামে ডট থাকলে চুপচাপ বাদ, অন্য কেউ
                  লিখতে পারলে INSECURE MODE, শেষে Newline না থাকলে পুরো File বাদ।
                </ListItem>
                <ListItem>
                  cron এর পরিবেশ ছোট: dash, .bashrc নেই, HOME থেকে শুরু, PATH এ ~/.local/bin নেই। Script এ
                  bash এর Shebang, পুরো Path, আর env File থেকে Variable।
                </ListItem>
                <ListItem>
                  Output যায় Mail এ, MTA নেই তো হারায়। Redirect করুন বা logger দিন। Journal এর CMD লাইন মানে
                  শুরু হয়েছিল, সফল হয়েছিল নয়।
                </ListItem>
                <ListItem>
                  cron চলে Server এর ঘড়িতে। Island Tours এর ঘড়ি UTC, ঢাকার 03:30 মানে 30 21। Ubuntu এর cron
                  CRON_TZ মানে না।
                </ListItem>
                <ListItem>
                  cron আগের Run এর অপেক্ষা করে না। flock -n দিয়ে একসাথে একটার বেশি নয়।
                </ListItem>
                <ListItem>
                  systemd Timer মানে .timer আর .service এর জোড়া। Enable করতে হয় Timer কে।{" "}
                  OnCalendar সময় অঞ্চল বোঝে, Output নিজে Journal এ যায়, Exit Code মনে থাকে, একসাথে দুইটা চলে
                  না, Persistent=true ফসকে যাওয়া Run ধরে, OnFailure খবর দেয়।
                </ListItem>
                <ListItem>
                  কাজটা হয়েছে কি না প্রমাণ করে ফল, Log আর Heartbeat, cron বা systemd নয়। আর খুলে না দেখা Backup
                  কোনো Backup নয়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর লেসন ১১, VPS Setup, End to End",
          content: (
            <p>
              এই Module এর দশটা লেসনে আপনি একটা Server এর দশটা আলাদা অংশ খুলে দেখেছেন: Folder, Process,
              ssh, Permission, Environment, Firewall, Log, নজরদারি, Network, আর আজ সময়ের কাজ। প্রতিটা
              আলাদাভাবে চলে। কিন্তু একটা খালি VPS কিনে, প্রথম Login থেকে শুরু করে, সঠিক ক্রমে সব বসিয়ে
              my-tours কে https দিয়ে Internet এ চালু করা, তারপর বাইরে থেকে প্রমাণ করা যে সব ঠিক আছে, সেটা
              একটা আলাদা দক্ষতা। পরের লেসনে ঠিক সেটাই, শুরু থেকে শেষ পর্যন্ত, আর আজকের রাতের Backup এর
              Timer টাও সেখানে বসবে। প্রথম থেকে পড়ুন:{" "}
              <Link href="/devops/topic/vps-setup" className="text-primary underline underline-offset-4">
                VPS Setup, End to End
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
      ["cron", "প্রতি মিনিটের শুরুতে খাতা মেলানো Daemon, cron.service, চালিয়ে দিয়ে ভুলে যায়"],
      ["cron লাইন", "মিনিট, ঘণ্টা, মাসের দিন, মাস, সপ্তাহের দিন, তারপর Command। Server এর ঘড়িতে পড়া"],
      ["দুই দিনের ঘর", "দুইটাই বাঁধা থাকলে যেকোনো একটা মিললেই চলে"],
      ["crontab", "-e লেখা, -l দেখা, -r সব মোছা কিছু না জিজ্ঞেস করে, -i জিজ্ঞেস করায়"],
      ["/etc/cron.d", "User এর ঘর লাগে। নামে ডট নয়, Mode 644 root, শেষে Newline"],
      ["%", "crontab এ নতুন লাইন আর stdin। \\% লিখতে হয়, অথবা Script এর Path"],
      ["cron এর পরিবেশ", "/bin/sh মানে dash, .bashrc নেই, শুরু HOME থেকে, PATH /etc/environment থেকে"],
      ["MTA", "Mail পাঠানোর Program। না থাকলে cron এর Output ফেলে দেওয়া হয়"],
      ["CMD লাইন", "Journal এ Command শুরু হওয়ার প্রমাণ, সফল হওয়ার নয়"],
      ["সময় অঞ্চল", "cron চলে Server এর ঘড়িতে। Ubuntu র cron CRON_TZ আর TZ মানে না"],
      ["flock -n", "Lock পেলে Command চলে, না পেলে সাথে সাথে বাদ। একসাথে একটার বেশি নয়"],
      ["systemd Timer", ".timer বলে কখন, .service বলে কী। Enable হয় Timer"],
      ["OnCalendar", "systemd এর সময়ের ভাষা, অঞ্চল সহ। systemd-analyze calendar দিয়ে যাচাই"],
      ["Persistent=true", "বন্ধ থাকার সময় ফসকানো Run চালু হওয়ার সাথে সাথে চালায়"],
      ["OnFailure=", "Service ব্যর্থ হলে আরেকটা Unit চালায়, মানুষকে খবর দিতে"],
      ["-mtime +6", "অন্তত সাত পূর্ণ দিন পুরনো। শেষ সাতটা রাখতে এটাই"],
      ["Heartbeat", "সফল Run এর শেষে একটা Ping। না এলে বাইরের সেবা খবর দেয়, নীরবতাও ধরা পড়ে"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "রাত বারোটায় একবার একটা Script চালাতে কেউ লিখলেন * 0 * * *। আসলে কী হবে?",
        options: [
          {
            key: "A",
            text: "প্রতিদিন 00:00 এ একবার চলবে",
            isCorrect: false,
            explanation: "একবারের জন্য মিনিটের ঘরে 0 লাগে। এখানে মিনিটের ঘরে তারকা।",
          },
          {
            key: "B",
            text: "প্রতিদিন 00:00 থেকে 00:59 পর্যন্ত প্রতি মিনিটে, মোট ষাটবার",
            isCorrect: true,
            explanation:
              "ঠিক। ঘণ্টার ঘর 0 তে বাঁধা, কিন্তু মিনিটের ঘরে * মানে সেই ঘণ্টার প্রতিটা মিনিট। সঠিক লাইন 0 0 * * *।",
          },
          {
            key: "C",
            text: "crontab লাইনটা ভুল বলে বাতিল করবে",
            isCorrect: false,
            explanation: "লাইনটা পুরোপুরি বৈধ, তাই কোনো সতর্কবার্তা আসে না। এটাই ফাঁদ।",
          },
          {
            key: "D",
            text: "প্রতি ঘণ্টার শুরুতে একবার",
            isCorrect: false,
            explanation: "প্রতি ঘণ্টার শুরু হলো 0 * * * *, ঘর দুইটা উল্টো।",
          },
        ],
      },
      {
        id: 2,
        text: "Server এর ঘড়ি UTC তে। দল চায় Backup চলুক প্রতিদিন ঢাকার সময় ভোর 03:30 এ, cron দিয়ে। কোন লাইন ঠিক?",
        options: [
          {
            key: "A",
            text: "30 3 * * *",
            isCorrect: false,
            explanation: "এটা Server এর 03:30, মানে UTC 03:30, ঢাকায় সকাল 09:30।",
          },
          {
            key: "B",
            text: "উপরে CRON_TZ=Asia/Dhaka, তারপর 30 3 * * *",
            isCorrect: false,
            explanation:
              "কিছু cron এটা মানে, Ubuntu এর cron মানে না। পরীক্ষায় CRON_TZ উপেক্ষা হয়ে লাইনটা UTC তেই চলেছে, কোনো Error ছাড়া।",
          },
          {
            key: "C",
            text: "30 21 * * *",
            isCorrect: true,
            explanation:
              "ঠিক। ঢাকা UTC থেকে ছয় ঘণ্টা আগে, তাই ঢাকার 03:30 মানে আগের দিনের 21:30 UTC। উপরে একটা মন্তব্যে ঢাকার সময়টা লিখে রাখুন।",
          },
          {
            key: "D",
            text: "30 9 * * *",
            isCorrect: false,
            explanation: "ছয় ঘণ্টা যোগ করা হয়েছে, বাদ দেওয়ার কথা। এটা ঢাকায় বিকেল 15:30।",
          },
        ],
      },
      {
        id: 3,
        text: "crontab এ লেখা ছিল date +%F > /tmp/x.txt, কিন্তু File টা কখনো তৈরি হয় না। Journal এ দেখা যাচ্ছে CMD (date +)। কারণ কী?",
        options: [
          {
            key: "A",
            text: "/tmp এ লেখার অনুমতি নেই",
            isCorrect: false,
            explanation: "/tmp সবাই লিখতে পারে। আর Journal এর Command টাই কাটা, সেটাই সূত্র।",
          },
          {
            key: "B",
            text: "crontab এ % মানে নতুন লাইন, তাই প্রথম % এর পরের সব, Redirect সহ, stdin হয়ে গেছে",
            isCorrect: true,
            explanation:
              "ঠিক। cron Command কেটেছে প্রথম % এ। লিখতে হতো date +\\%F, অথবা Command টা একটা Script এ রাখা, যেখানে % এর বিশেষ মানে নেই।",
          },
          {
            key: "C",
            text: "date Program টা cron এর PATH এ নেই",
            isCorrect: false,
            explanation: "date আছে /usr/bin এ, যা সব PATH এ থাকে। আর Command চলেছে, শুধু কাটা অবস্থায়।",
          },
          {
            key: "D",
            text: "cron একসাথে অনেক লাইন চালাতে পারে না",
            isCorrect: false,
            explanation: "একই মিনিটে অনেক লাইন cron স্বাচ্ছন্দ্যে চালায়।",
          },
        ],
      },
      {
        id: 4,
        text: "একটা Script হাতে চালালে চলে, cron থেকে ব্যর্থ হয়, আর Error এ লেখা /bin/sh: 1: source: not found। সবচেয়ে ভালো সমাধান কোনটা?",
        options: [
          {
            key: "A",
            text: "Script এর প্রথম লাইনে #!/usr/bin/env bash, আর crontab এ Script এর পুরো Path",
            isCorrect: true,
            explanation:
              "ঠিক। cron Command চালায় /bin/sh দিয়ে, যা Ubuntu তে dash, আর dash source চেনে না। Script এর Shebang bash বেছে নিলে cron যেভাবেই ডাকুক, ভেতরটা bash এ চলে।",
          },
          {
            key: "B",
            text: "cron Restart করা",
            isCorrect: false,
            explanation: "cron ঠিকঠাক চলছে, Restart এ Shell বদলায় না।",
          },
          {
            key: "C",
            text: "Script টা root এর crontab এ সরিয়ে নেওয়া",
            isCorrect: false,
            explanation: "root এর crontab ও /bin/sh দিয়ে চালায়। আর কাজের দরকারের চেয়ে বেশি অধিকার দেওয়া হলো।",
          },
          {
            key: "D",
            text: "deploy এর .bashrc এ export SHELL=/bin/bash যোগ করা",
            isCorrect: false,
            explanation: "cron .bashrc পড়েই না, তাই সেখানে যা লিখবেন cron তা দেখবে না।",
          },
        ],
      },
      {
        id: 5,
        text: "/etc/cron.d/backup.cron নামে একটা File রাখা হয়েছে, লাইনগুলো ঠিক, তবুও কিছু চলে না, আর Journal এ এই File নিয়ে কোনো শব্দই নেই। কেন?",
        options: [
          {
            key: "A",
            text: "cron.d এর File চালাতে cron Restart লাগে",
            isCorrect: false,
            explanation: "cron প্রতি মিনিটে File গুলোর বদল দেখে নেয়, Restart লাগে না।",
          },
          {
            key: "B",
            text: "File এর নামে ডট আছে, আর cron.d তে এমন নামের File cron চুপচাপ এড়িয়ে যায়",
            isCorrect: true,
            explanation:
              "ঠিক। নামে শুধু অক্ষর, সংখ্যা, হাইফেন আর আন্ডারস্কোর চলে। Practice Server এ mytours.cron নিয়ে Journal এ একটা লাইনও আসেনি, ঠিক এই অবস্থা। নাম বদলে backup-cron করুন।",
          },
          {
            key: "C",
            text: "File এ Group এর লেখার অনুমতি আছে",
            isCorrect: false,
            explanation: "সেক্ষেত্রেও File বাদ পড়ে, কিন্তু cron Journal এ INSECURE MODE লেখে। এখানে কোনো লাইনই নেই।",
          },
          {
            key: "D",
            text: "cron.d তে শুধু Package নিজের File রাখতে পারে",
            isCorrect: false,
            explanation: "নিজের File রাখা সম্পূর্ণ বৈধ, নিয়ম মানলে।",
          },
        ],
      },
      {
        id: 6,
        text: "প্রতি ঘণ্টায় চলা একটা রিপোর্ট এখন ৮০ মিনিট নেয়, আর Server এ একসাথে কয়েকটা কপি জমে যাচ্ছে। cron রেখেই সবচেয়ে সরল সমাধান কোনটা?",
        options: [
          {
            key: "A",
            text: "flock -n /run/lock/report.lock দিয়ে Command টা মুড়ে দেওয়া",
            isCorrect: true,
            explanation:
              "ঠিক। আগের কপি Lock ধরে আছে, তাই নতুনটা সাথে সাথে বেরিয়ে যায়। একসাথে কখনো একটার বেশি চলে না। Practice Server এ ঠিক এটাই মাপা হয়েছিল।",
          },
          {
            key: "B",
            text: "flock -w 3600 দেওয়া, যাতে নতুনটা অপেক্ষা করে",
            isCorrect: false,
            explanation:
              "কাজটা Interval এর চেয়ে ধীর, তাই অপেক্ষার লাইন বাড়তেই থাকবে। একসাথে না চললেও কাজগুলো জমে আর ঘড়ি থেকে পিছিয়ে পড়ে।",
          },
          {
            key: "C",
            text: "cron কে বলা আগের Run শেষ হলে তবে পরেরটা",
            isCorrect: false,
            explanation: "cron এর এমন কোনো Setting নেই। আগের Run এর খোঁজ রাখা তার স্বভাবেই নেই।",
          },
          {
            key: "D",
            text: "Script এর ভেতরে sleep 60 যোগ করা",
            isCorrect: false,
            explanation: "এতে কাজ আরও লম্বা হয়, জট আরও বাড়ে।",
          },
        ],
      },
      {
        id: 7,
        text: "রাত 21:20 থেকে 21:45 UTC পর্যন্ত Server Reboot এ ছিল। Backup এর সময় 21:30। কোন ব্যবস্থায় আজ রাতের Backup Server ফেরার পর চলবে?",
        options: [
          {
            key: "A",
            text: "cron এর 30 21 * * *",
            isCorrect: false,
            explanation: "cron বন্ধ থাকার সময়ের মিনিটগুলোর হিসাব রাখে না। আজ রাতেরটা গেল।",
          },
          {
            key: "B",
            text: "systemd Timer, OnCalendar সহ, Persistent ছাড়া",
            isCorrect: false,
            explanation: "Persistent ছাড়া Timer শুধু সামনের দিকে তাকায়, পরের Run কাল।",
          },
          {
            key: "C",
            text: "systemd Timer, Persistent=true সহ",
            isCorrect: true,
            explanation:
              "ঠিক। Timer এর Stamp File দেখে systemd বোঝে বন্ধ থাকার সময়ে একটা Run বাকি পড়েছে, আর চালু হতেই সেটা চালায়। Practice Server এ চালু করার সেকেন্ডেই চলেছিল।",
          },
          {
            key: "D",
            text: "cron এ @reboot এর একটা লাইন",
            isCorrect: false,
            explanation:
              "@reboot প্রতিটা Boot এ চালাবে, Backup এর সময় পার হোক বা না হোক। দিনে তিনবার Reboot হলে তিনটা বাড়তি Backup, আর বাদ পড়া রাতের হিসাবও রাখে না।",
          },
        ],
      },
      {
        id: 8,
        text: "my-tours-backup.service আর my-tours-backup.timer লিখে sudo systemctl enable my-tours-backup.service দেওয়া হলো। রাতে কিছুই চলল না। ভুলটা কোথায়?",
        options: [
          {
            key: "A",
            text: "Timer চালু করতে হয় .timer কে, যেমন systemctl enable --now my-tours-backup.timer",
            isCorrect: true,
            explanation:
              "ঠিক। Service এর [Install] নেই, তাই তাকে enable করে কিছু হয় না। সময় রাখে Timer, আর Timer চালুই হয়নি। systemctl list-timers এ দেখলেই ধরা পড়ত।",
          },
          {
            key: "B",
            text: "Service এর Type=oneshot এর বদলে simple হওয়া উচিত",
            isCorrect: false,
            explanation: "একবার চলে থামা কাজের জন্য oneshot ই ঠিক।",
          },
          {
            key: "C",
            text: "Timer এর জন্য crontab এও একটা লাইন লাগে",
            isCorrect: false,
            explanation: "Timer cron এর উপর নির্ভর করে না। দুই জায়গায় রাখলে বরং দুইবার চলবে।",
          },
          {
            key: "D",
            text: "OnCalendar এ সময় অঞ্চল লেখা যায় না",
            isCorrect: false,
            explanation: "লেখা যায়, আর systemd-analyze calendar দিয়ে যাচাইও হয়েছে: Asia/Dhaka এর 03:30 মানে 21:30 UTC।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "প্রতিটা ফাঁদ নিজের Server এ ঘটান, তারপর ঠিক Backup বানান",
    subtitle:
      "ছয়টা পরীক্ষা, লেসন ০১ এর Practice Server এ, systemd সহ। কয়েকটায় এক থেকে চার মিনিট অপেক্ষা করতে হবে, কারণ cron মিনিটের শুরুতে জাগে।",
    stepName: "LAB",
    steps: [
      {
        title: "Server এ আগে থেকে কী চলছে",
        description:
          "Timer এর তালিকা, /etc/crontab, cron.d আর cron.daily পড়ুন। প্রতিটা কাজ কখন চলবে, UTC আর ঢাকার সময়ে লিখে রাখুন।",
      },
      {
        title: "প্রথম Job, আর cron এর পরিবেশ",
        description:
          "প্রতি মিনিটে env একটা File এ লেখা একটা লাইন বসান। এক মিনিট পরে সেটা নিজের Terminal এর env এর পাশে রাখুন, আর Journal এ CMD লাইন খুঁজুন।",
      },
      {
        title: "তিনটা ভুল ইচ্ছা করে",
        description:
          "% ওয়ালা date, bash এর source, আর ~/.local/bin এর একটা Program। তিনটার Error নিজের চোখে পড়ুন, তারপর প্রতিটা সারিয়ে আবার চালান।",
      },
      {
        title: "একসাথে চলা আর flock",
        description:
          "আড়াই মিনিটের একটা কাজ প্রতি মিনিটে, একবার এমনি আর একবার flock -n দিয়ে। চার মিনিট পরে Log আর চলমান Process গুনুন।",
      },
      {
        title: "Persistent এর প্রমাণ",
        description:
          "দুইটা প্রতি মিনিটের Timer, একটায় Persistent=true। থামিয়ে একটা মিনিট পার হতে দিন, আবার চালু করুন, কে সাথে সাথে চলল দেখুন।",
      },
      {
        title: "my-tours এর আসল Backup",
        description:
          "env File, Script, হাতে পরীক্ষা, Service আর Timer, ইচ্ছাকৃত ব্যর্থতা আর Alert, শেষে Restore। Script আর Unit File গুলো সেকশন ০১১, ০১২ আর ০১৪ থেকে নিন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-look-around.sh",
        language: "bash",
        code: `# Server এ আগে থেকেই কী কী নির্ধারিত কাজ চলছে, সেটা দিয়ে শুরু
timedatectl | grep "Time zone"            # Server এর ঘড়ি কোন Zone এ
systemctl list-timers --all               # systemd Timer, পরের আর আগের Run সহ
cat /etc/crontab                          # Server এর নিজের crontab, User এর ঘর সহ
ls -l /etc/cron.d/ /etc/cron.daily/       # Package গুলোর রেখে যাওয়া কাজ
run-parts --test /etc/cron.daily          # cron.daily এর কোন Script সত্যিই চলবে
sudo ls -l /var/spool/cron/crontabs/      # কোন কোন User এর নিজের crontab আছে
crontab -l                                # আপনার নিজের, এখনো নেই`,
      },
      {
        filename: "2-first-job.sh",
        language: "bash",
        code: `# প্রথম Job: প্রতি মিনিটে cron এর ভেতরের পরিবেশটা একটা File এ লিখে রাখা।
# crontab - মানে নতুন তালিকা আসবে stdin থেকে। আগের লাইনগুলো রাখতে আগে -l দিয়ে পড়ে নেওয়া।
( crontab -l 2>/dev/null; echo '* * * * * env > /tmp/cron-env.txt' ) | crontab -
crontab -l

# পরের মিনিটের শুরু পর্যন্ত অপেক্ষা করুন, তারপর:
cat /tmp/cron-env.txt                      # cron এর পরিবেশ
env | grep -E '^(PATH|SHELL|HOME)='        # আপনার Terminal এর পরিবেশ, পাশাপাশি রাখুন
sudo journalctl -t CRON --since "10 min ago" | grep CMD`,
      },
      {
        filename: "3-break-it.sh",
        language: "bash",
        code: `# তিনটা ভুল, ইচ্ছা করে। প্রতিটা হাতে চালালে ঠিকই চলত।
mkdir -p ~/.local/bin
printf '#!/bin/sh\\necho report ok\\n' > ~/.local/bin/mt-report
chmod +x ~/.local/bin/mt-report
bash -lc mt-report                         # Login Shell এ চলে: report ok

crontab - <<'CRON'
* * * * * date +%F > /tmp/pct.txt
* * * * * source /etc/hostname > /tmp/dash.txt 2>&1
* * * * * mt-report > /tmp/path.txt 2>&1
CRON

# এক মিনিট পরে:
ls -l /tmp/pct.txt                         # No such file: Redirect টাই হারিয়ে গেছে
cat /tmp/dash.txt                          # /bin/sh: 1: source: not found
cat /tmp/path.txt                          # /bin/sh: 1: mt-report: not found
sudo journalctl -t CRON --since "5 min ago" | grep -E 'CMD \\(date|No MTA'

# সারানোর তিনটা উপায় নিজে বসিয়ে দেখুন: \\%F, . /etc/hostname, $HOME/.local/bin/mt-report
crontab -r                                 # পরীক্ষা শেষ, আপনার পুরো crontab মুছে যায়`,
      },
      {
        filename: "4-overlap.sh",
        language: "bash",
        code: `# প্রতি মিনিটে চলে এমন একটা কাজ, যেটা নিজে আড়াই মিনিট নেয়
cat > ~/slow-job <<'JOB'
#!/bin/sh
echo "$(date -u +%T) start $1 pid $$" >> /tmp/slow.log
sleep 150
echo "$(date -u +%T) end   $1 pid $$" >> /tmp/slow.log
JOB
chmod +x ~/slow-job

crontab - <<'CRON'
* * * * * $HOME/slow-job nolock
* * * * * flock -n /run/lock/slow-job-$LOGNAME.lock $HOME/slow-job locked
CRON

# চার মিনিট পরে:
cat /tmp/slow.log
pgrep -fa 'slow-job (nolock|locked)'       # এই মুহূর্তে কয়টা কপি চলছে

crontab -r; pkill -f 'slow-job (nolock|locked)'; rm -f /tmp/slow.log`,
      },
      {
        filename: "5-persistent.sh",
        language: "bash",
        code: `# একজোড়া Timer: একটা Persistent=true সহ, একটা ছাড়া। দুইটাই প্রতি মিনিটে।
for n in persist nopersist; do
sudo tee /etc/systemd/system/demo-$n.service > /dev/null <<UNIT
[Unit]
Description=Demo job ($n)

[Service]
Type=oneshot
ExecStart=/bin/sh -c 'date -u +%%T >> /tmp/demo-$n.log'
UNIT
done

sudo tee /etc/systemd/system/demo-persist.timer > /dev/null <<'UNIT'
[Timer]
OnCalendar=minutely
AccuracySec=1s
Persistent=true
UNIT
sudo tee /etc/systemd/system/demo-nopersist.timer > /dev/null <<'UNIT'
[Timer]
OnCalendar=minutely
AccuracySec=1s
UNIT

sudo systemctl daemon-reload
sudo systemctl start demo-persist.timer demo-nopersist.timer
systemctl list-timers 'demo-*'

# অন্তত একবার চলার পর দুইটাই থামান, যেন Server বন্ধ হয়ে গেল
sudo systemctl stop demo-persist.timer demo-nopersist.timer
# একটা পুরো মিনিটের শুরু পার হতে দিন, তারপর আবার চালু করুন:
sudo systemctl start demo-persist.timer demo-nopersist.timer
sleep 2                                     # Timer চালু হয়, Service চলে এক মুহূর্ত পরে
cat /tmp/demo-persist.log                   # শেষ লাইনটা এইমাত্র, চালু করার সেকেন্ডেই
cat /tmp/demo-nopersist.log                 # নতুন লাইন নেই, পরের মিনিটের অপেক্ষায়

# পরিষ্কার
sudo systemctl stop demo-persist.timer demo-nopersist.timer
sudo rm /etc/systemd/system/demo-*; sudo systemctl daemon-reload
sudo rm -f /var/lib/systemd/timers/stamp-demo-persist.timer   # নইলে পরের বার প্রথম Start এই ধরে নেবে একটা Run বাকি`,
      },
      {
        filename: "6-backup-timer.sh",
        language: "bash",
        code: `# my-tours এর রাতের Backup, শুরু থেকে শেষ। sudo লাগবে।
id mytours || sudo useradd --system --no-create-home --shell /usr/sbin/nologin mytours
sudo mkdir -p /srv/my-tours/data /etc/my-tours /var/backups/my-tours
echo '{"tours":3}' | sudo tee /srv/my-tours/data/seed.json > /dev/null
sudo chown -R mytours:mytours /srv/my-tours /var/backups/my-tours
sudo chmod 700 /var/backups/my-tours

# ১. Setting গুলো একটা File এ, অনুমতি 640 (লেসন ০৪, ০৫)
sudo tee /etc/my-tours/backup.env > /dev/null <<'ENV'
BACKUP_DIR=/var/backups/my-tours
BACKUP_SOURCES="etc/my-tours srv/my-tours/data"
ENV
sudo chown root:mytours /etc/my-tours/backup.env
sudo chmod 640 /etc/my-tours/backup.env

# ২. Script টা বসান (লেসনের Hands-on অংশ থেকে my-tours-backup নামে সেভ করে নিন)
sudo install -m 755 my-tours-backup /usr/local/bin/my-tours-backup

# ৩. আগে হাতে, ঠিক Service যেভাবে চালাবে: mytours হয়ে, শুধু env File নিয়ে
sudo -u mytours env -i PATH=/usr/bin:/bin bash -c \\
  'set -a; source /etc/my-tours/backup.env; set +a; /usr/local/bin/my-tours-backup'
sudo ls -l /var/backups/my-tours/

# ৪. Service আর Timer (দুইটা File লেসনে আছে), তারপর Alert এর Service
sudo cp my-tours-backup.service my-tours-backup.timer my-tours-alert@.service /etc/systemd/system/
sudo systemd-analyze verify /etc/systemd/system/my-tours-backup.{service,timer}
sudo systemctl daemon-reload
sudo systemctl enable --now my-tours-backup.timer
systemctl list-timers my-tours-backup.timer

# ৫. এখনই একবার, Timer এর অপেক্ষা না করে
sudo systemctl start my-tours-backup.service
sudo journalctl -u my-tours-backup.service -n 5 --no-pager

# ৬. ইচ্ছা করে ভাঙুন: BACKUP_DIR সরিয়ে দিন, Alert আসে কি না দেখুন, তারপর ফেরত আনুন
sudo cp /etc/my-tours/backup.env /tmp/backup.env.bak
sudo sed -i '/^BACKUP_DIR=/d' /etc/my-tours/backup.env
sudo systemctl start my-tours-backup.service
sudo journalctl -t my-tours-alert -n 1 --no-pager
sudo cp /tmp/backup.env.bak /etc/my-tours/backup.env && sudo rm /tmp/backup.env.bak
sudo systemctl reset-failed my-tours-backup.service

# ৭. Restore পরীক্ষা: একটা খালি Folder এ খুলে দেখুন সব আছে কি না
mkdir -p /tmp/restore-test
latest="$(sudo sh -c 'ls -1t /var/backups/my-tours/*.tar.gz | head -1')"
sudo tar --extract --gzip --file "$latest" --directory /tmp/restore-test
sudo find /tmp/restore-test -type f`,
      },
    ],
    tip: "পরীক্ষা ৩ শেষ করে এক মিনিট থেমে ভাবুন: তিনটা ভুলের একটাও আপনার Terminal এ ধরা পড়ত না, তিনটাই শুধু cron এর ভেতরে ঘটে। আর প্রথমটা, % এর, কোনো Error ই রেখে যায় না, শুধু একটা কাটা CMD লাইন। এই কারণেই নতুন কোনো Job বসানোর নিয়ম তিন ধাপের: আগে Script টা env -i দিয়ে খালি পরিবেশে চালান, তারপর Schedule কে প্রতি মিনিটে করে একবার আসল cron বা Timer এর ভেতর দিয়ে চালিয়ে Log পড়ুন, তারপরই আসল সময়ে ফেরান। আর পরীক্ষা ৬ এর ব্যর্থতার অংশটা বাদ দেবেন না, কারণ একটা Alert যা কখনো বাজতে দেখেননি, সেটা বাজবে কি না আপনি জানেন না।",
  },
  assignment: {
    title: "Mini Project: my-tours এর নির্ধারিত কাজের খাতা",
    time: "৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>Server এর সব নির্ধারিত কাজের তালিকা:</strong> নিজের Practice Server এর প্রতিটা নির্ধারিত কাজ
        খুঁজে বের করুন, systemd Timer, /etc/crontab, /etc/cron.d, cron.daily আর প্রতিটা User এর crontab
        (<code>sudo ls /var/spool/cron/crontabs</code>)। প্রতিটার পাশে এক লাইনে লিখুন কাজটা কী, আর পরের বার
        কখন চলবে, UTC আর ঢাকার সময়ে।
      </span>,
      <span key="2">
        <strong>Schedule পড়া আর লেখা:</strong> এই লেসনের CronExpressionLab আর{" "}
        <code>systemd-analyze calendar</code> দিয়ে যাচাই করে ছয়টা চাহিদার cron লাইন আর OnCalendar দুইটাই
        লিখুন: ঢাকার সময় প্রতি কর্মদিবস সকাল 10:00, প্রতি ১৫ মিনিট, প্রতি মাসের শেষ শুক্রবারের কাছাকাছি একটা
        সময় (কোনটা এক লাইনে হয় না তা ব্যাখ্যা সহ), প্রতি রবিবার ঢাকার রাত 02:00, প্রতি ছয় ঘণ্টায়, আর প্রতি
        বছর ১ জানুয়ারি ঢাকার মধ্যরাত। প্রতিটায় পরের তিনটা Run লিখুন।
      </span>,
      <span key="3">
        <strong>my-tours এর Backup Timer:</strong> সেকশন ০১৪ এর Script, Service, Timer আর Alert নিজের Server
        এ বসান। প্রমাণ জমা দিন: হাতে চালানোর Output, Archive এর Mode 600, ইচ্ছাকৃত ব্যর্থতায় Alert এর
        Journal লাইন, Persistent এর প্রমাণ (Timer থামিয়ে সময় পার করে আবার চালু), আর একটা Restore যেখানে
        একটা File আসলটার সাথে diff করে মেলানো।
      </span>,
      <span key="4">
        <strong>একটা cron Job কে Timer এ নেওয়া:</strong> নিজের crontab এ প্রতি ঘণ্টায়{" "}
        <code>/tmp</code> এর এক দিনের পুরনো my-tours এর File মোছার একটা লাইন লিখে এক দিন চলতে দিন। তারপর একই
        কাজ একটা Timer আর Service জোড়ায় নিন, cron এর লাইন মুছে দিন, আর তিনটা তফাত লিখুন যা আপনি নিজে Journal
        আর <code>systemctl list-timers</code> এ দেখেছেন।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> দলের একজন লিখেছেন, আমি crontab এ রাতের Backup বসিয়েছিলাম,
        হাতে চালালে চলে, কিন্তু সকালে কোনো File পাই না। আর লাইনটা তো ঢাকার সময়ে লেখা, ঠিক আছে না? তাঁকে
        সম্ভাব্য চারটা কারণ বোঝান, প্রতিটা কীভাবে এক Command এ প্রমাণ করবেন বলুন, আর শেষে বলুন কেন আপনি এই কাজ
        Persistent আর OnFailure ওয়ালা একটা Timer আর একটা Heartbeat দিয়ে করতে বলবেন।
      </span>,
    ],
    deliverables: [
      <span key="1">নির্ধারিত কাজের তালিকা, প্রতিটা কাজের UTC আর ঢাকার সময় সহ</span>,
      <span key="2">ছয়টা চাহিদার cron লাইন আর OnCalendar, পরের তিনটা Run সহ</span>,
      <span key="3">Backup Timer এর Unit File, Script আর পাঁচটা প্রমাণের Terminal Output</span>,
      <span key="4">cron থেকে Timer এ নেওয়া কাজের দুইটা সংস্করণ আর তিনটা দেখা তফাত</span>,
      <span key="5">সহকর্মীর জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
