import { Sketch, SketchBox, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* Small drawing helpers                                                      */
/* ------------------------------------------------------------------------- */

function Cell({
    x,
    y,
    w,
    h = 22,
    text,
    accent,
    muted,
    dashed,
    struck,
    bold,
}: {
    x: number;
    y: number;
    w: number;
    h?: number;
    text: string;
    accent?: boolean;
    muted?: boolean;
    dashed?: boolean;
    struck?: boolean;
    bold?: boolean;
}) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={accent ? 'var(--primary)' : 'var(--card)'}
                fillOpacity={accent ? 0.1 : 1}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 0.9 : muted ? 0.2 : 0.35}
                strokeDasharray={dashed ? '4 3' : undefined}
                strokeWidth='1'
            />
            <SketchText x={x + w / 2} y={y + h / 2 + 4} size={9.5} opacity={muted ? 0.4 : 1} accent={accent} bold={bold}>
                {text}
            </SketchText>
            {struck && (
                <line
                    x1={x + 5}
                    y1={y + h / 2}
                    x2={x + w - 5}
                    y2={y + h / 2}
                    stroke='var(--primary)'
                    strokeWidth='1.4'
                />
            )}
        </g>
    );
}

function Arrow({ id }: { id: string }) {
    return (
        <defs>
            <marker id={id} viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'>
                <path d='M0,0 L10,5 L0,10 z' fill='currentColor' fillOpacity='0.6' />
            </marker>
        </defs>
    );
}

/* ------------------------------------------------------------------------- */
/* 1. একটা Row এর চার রকম পরিণতি                                                 */
/* ------------------------------------------------------------------------- */

/**
 * Oliver Bennett's customer row and the four things a team can do when he
 * asks to be deleted. Values are the real ones from the lesson's query boxes:
 * customer 11, bookings 12 and 19, the anonymised email deleted-11.
 */
export function DelFourFatesDiagram() {
    const panels = [
        { x: 12, title: 'DELETE', sub: 'Row টাই নেই' },
        { x: 200, title: 'SOFT DELETE', sub: 'চিহ্ন দিয়ে লুকানো' },
        { x: 388, title: 'ARCHIVE', sub: 'অন্য Table এ সরানো' },
        { x: 576, title: 'ANONYMIZE', sub: 'মানুষটা মুছে, ইতিহাস রেখে' },
    ];
    const W = 172;
    return (
        <Sketch
            label='একটা Row, চার রকম পরিণতি'
            height={330}
            viewBox='0 0 760 330'
            caption={
                <>
                    Customer 11, Oliver Bennett, তার Account মুছে দিতে বলেছেন। DELETE Row টাকে পুরো সরায়, ফেরত আসে শুধু Backup থেকে। Soft
                    Delete Row টা রাখে, শুধু <code>deleted_at</code> এ সময় লিখে লুকায়। Archive Row টা আরেকটা Table এ সরিয়ে রাখে। Anonymize
                    নাম, Email আর ফোন মুছে দেয় কিন্তু Row টা রাখে, তাই তার Booking 12 আর 19 এর হিসাব অক্ষত থাকে।
                </>
            }>
            <Arrow id='del-fate-arrow' />
            <Cell x={250} y={14} w={60} text='11' bold />
            <Cell x={310} y={14} w={110} text='Oliver Bennett' />
            <Cell x={420} y={14} w={90} text='London' />
            <SketchText x={380} y={56} size={9} body opacity={0.75}>
                {'অনুরোধ: "আমার Account মুছে দিন"'}
            </SketchText>
            {panels.map(p => (
                <line
                    key={p.title}
                    x1={380}
                    y1={64}
                    x2={p.x + W / 2}
                    y2={92}
                    stroke='currentColor'
                    strokeOpacity='0.45'
                    strokeWidth='1.1'
                    markerEnd='url(#del-fate-arrow)'
                />
            ))}
            {panels.map(p => (
                <g key={`${p.title}-panel`}>
                    <rect
                        x={p.x}
                        y={98}
                        width={W}
                        height={220}
                        fill='none'
                        stroke='currentColor'
                        strokeOpacity='0.25'
                        strokeDasharray='3 3'
                    />
                    <SketchText x={p.x + W / 2} y={118} size={10.5} bold accent>
                        {p.title}
                    </SketchText>
                    <SketchText x={p.x + W / 2} y={134} size={9} body opacity={0.75}>
                        {p.sub}
                    </SketchText>
                </g>
            ))}

            {/* DELETE */}
            <Cell x={24} y={150} w={34} text='11' muted struck />
            <Cell x={58} y={150} w={102} text='Oliver Bennett' muted struck />
            <Cell x={24} y={186} w={136} h={40} text='কোনো Row নেই' dashed muted />
            <SketchText x={98} y={252} size={9} body>
                Booking থাকলে Error 23503
            </SketchText>
            <SketchText x={98} y={270} size={9} body>
                CASCADE থাকলে Booking ও শেষ
            </SketchText>
            <SketchText x={98} y={296} size={9} body opacity={0.7}>
                ফেরত শুধু Backup থেকে
            </SketchText>

            {/* SOFT DELETE */}
            <Cell x={212} y={150} w={34} text='11' />
            <Cell x={246} y={150} w={102} text='Oliver Bennett' />
            <Cell x={212} y={178} w={136} text='deleted_at' bold />
            <Cell x={212} y={200} w={136} text='2026-11-01 10:00' accent />
            <SketchText x={286} y={252} size={9} body>
                নাম আর Email রয়ে গেল
            </SketchText>
            <SketchText x={286} y={270} size={9} body>
                প্রতিটা Query তে Filter লাগবে
            </SketchText>
            <SketchText x={286} y={296} size={9} body opacity={0.7}>
                ফেরত: deleted_at = NULL
            </SketchText>

            {/* ARCHIVE */}
            <SketchBox x={400} y={150} w={64} h={40} title='live' sub='Table' />
            <SketchBox x={496} y={150} w={64} h={40} title='archive' sub='Table' accent />
            <line
                x1={466}
                y1={170}
                x2={492}
                y2={170}
                stroke='currentColor'
                strokeOpacity='0.55'
                strokeWidth='1.1'
                markerEnd='url(#del-fate-arrow)'
            />
            <Cell x={496} y={200} w={64} text='row 11' accent />
            <SketchText x={474} y={252} size={9} body>
                মূল Table হালকা থাকে
            </SketchText>
            <SketchText x={474} y={270} size={9} body>
                Booking দেখালে আবার 23503
            </SketchText>
            <SketchText x={474} y={296} size={9} body opacity={0.7}>
                পুরনো, বন্ধ ইতিহাসের জন্য
            </SketchText>

            {/* ANONYMIZE */}
            <Cell x={588} y={150} w={34} text='11' />
            <Cell x={622} y={150} w={114} text='Deleted customer' accent />
            <Cell x={588} y={172} w={148} text='deleted-11@mail.example' accent />
            <Cell x={588} y={200} w={70} text='12' />
            <Cell x={658} y={200} w={78} text='19 paid' />
            <SketchText x={662} y={252} size={9} body>
                নাম, Email, ফোন নেই
            </SketchText>
            <SketchText x={662} y={270} size={9} body>
                আয় 423600.00 অক্ষত
            </SketchText>
            <SketchText x={662} y={296} size={9} body opacity={0.7}>
                Payment থাকলে এটাই পথ
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. DELETE ... USING: আরেক Table দেখে মোছা                                     */
/* ------------------------------------------------------------------------- */

/**
 * The four pending bookings on the left, the three departures they point to
 * on the right. Departures starting before 2026-12-01 are marked, and the
 * bookings joined to them are the three rows DELETE ... USING removes.
 */
export function DelUsingDiagram() {
    const bookings = [
        { id: '14', dep: '8', gone: true },
        { id: '17', dep: '11', gone: false },
        { id: '20', dep: '14', gone: true },
        { id: '24', dep: '14', gone: true },
    ];
    const departures = [
        { id: '8', starts: '2026-11-20', hit: true },
        { id: '11', starts: '2026-12-04', hit: false },
        { id: '14', starts: '2026-11-14', hit: true },
    ];
    const by = (i: number) => 74 + i * 34;
    const dy = (dep: string) => 74 + departures.findIndex(d => d.id === dep) * 50 + 11;
    return (
        <Sketch
            label='DELETE ... USING departures'
            height={290}
            viewBox='0 0 760 290'
            caption={
                <>
                    বাঁ দিকে del_bookings এর চারটা pending Booking, ডান দিকে তাদের Departure। USING departures দুই Table কে জোড়ে,{' '}
                    <code>b.departure_id = d.departure_id</code> ঠিক করে কোন Booking কোন Departure এর। তারপর{' '}
                    <code>{"d.starts_on < DATE '2026-11-01' + 30"}</code> শুধু 1 December এর আগের Departure রাখে। যে Booking এমন
                    Departure এর সাথে জোড়া পেল, শুধু সেটাই মুছল: 14, 20 আর 24। Booking 17 এর Departure 4 December এ, তাই সে থাকল।
                </>
            }>
            <Arrow id='del-using-arrow' />
            <SketchText x={140} y={30} size={10.5} bold accent>
                del_bookings (pending)
            </SketchText>
            <Cell x={40} y={46} w={90} text='booking_id' bold />
            <Cell x={130} y={46} w={110} text='departure_id' bold />
            {bookings.map((b, i) => (
                <g key={b.id}>
                    <Cell x={40} y={by(i)} w={90} h={26} text={b.id} struck={b.gone} accent={b.gone} />
                    <Cell x={130} y={by(i)} w={110} h={26} text={b.dep} struck={b.gone} accent={b.gone} />
                    <line
                        x1={244}
                        y1={by(i) + 13}
                        x2={496}
                        y2={dy(b.dep)}
                        stroke={b.gone ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={b.gone ? 0.8 : 0.35}
                        strokeDasharray={b.gone ? undefined : '4 3'}
                        strokeWidth='1.1'
                        markerEnd='url(#del-using-arrow)'
                    />
                </g>
            ))}
            <SketchText x={600} y={30} size={10.5} bold accent>
                departures
            </SketchText>
            <Cell x={500} y={46} w={90} text='departure_id' bold />
            <Cell x={590} y={46} w={120} text='starts_on' bold />
            {departures.map((d, i) => (
                <g key={d.id}>
                    <Cell x={500} y={74 + i * 50} w={90} h={26} text={d.id} accent={d.hit} />
                    <Cell x={590} y={74 + i * 50} w={120} h={26} text={d.starts} accent={d.hit} />
                </g>
            ))}
            <SketchText x={380} y={236} size={10} body>
                {"শর্ত: b.status = 'pending' আর d.starts_on 2026-12-01 এর আগে"}
            </SketchText>
            <SketchText x={380} y={262} size={11} bold accent>
                DELETE 3: Booking 14, 20, 24 গেল, 17 থাকল
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. Foreign Key এর শিকল: আটকায়, নাকি সাথে নিয়ে যায়                               */
/* ------------------------------------------------------------------------- */

function ChainPanel({ marker, cascade }: { marker: string; cascade: boolean }) {
    const gone = cascade;
    return (
        <>
            <Arrow id={marker} />
            <SketchText x={150} y={20} size={9.5} body opacity={0.8}>
                DELETE FROM customers WHERE customer_id = 11
            </SketchText>
            <Cell x={60} y={34} w={180} h={28} text='customers: 11 Oliver Bennett' struck={gone} accent={!gone} />
            <line x1={150} y1={64} x2={150} y2={86} stroke='currentColor' strokeOpacity='0.5' markerEnd={`url(#${marker})`} />
            <Cell x={40} y={90} w={110} h={28} text='booking 12' struck={gone} muted={gone} />
            <Cell x={150} y={90} w={110} h={28} text='booking 19' struck={gone} muted={gone} />
            <line x1={205} y1={120} x2={205} y2={142} stroke='currentColor' strokeOpacity='0.5' markerEnd={`url(#${marker})`} />
            <Cell x={130} y={146} w={150} h={28} text='payment 16: 28000 paid' struck={gone} muted={gone} />
            {cascade ? (
                <>
                    <SketchText x={150} y={204} size={10} bold accent>
                        DELETE 1, কোনো Error নেই
                    </SketchText>
                    <SketchText x={150} y={224} size={9.5} body>
                        কিন্তু সাথে 2টা Booking আর 1টা Payment গেল
                    </SketchText>
                    <SketchText x={150} y={244} size={9.5} body>
                        paid 423600.00 থেকে 395600.00
                    </SketchText>
                </>
            ) : (
                <>
                    <SketchText x={150} y={204} size={10} bold accent>
                        ERROR 23503
                    </SketchText>
                    <SketchText x={150} y={224} size={9.5} body>
                        Key (customer_id)=(11) is still referenced
                    </SketchText>
                    <SketchText x={150} y={244} size={9.5} body>
                        কিছুই মুছল না, সব আগের মতো
                    </SketchText>
                </>
            )}
        </>
    );
}

/**
 * The same DELETE against two copies of customers, bookings and payments: one
 * with the default foreign key rule, one with ON DELETE CASCADE. Numbers come
 * from the lesson's boxes.
 */
export function DelChainSplit() {
    return (
        <SketchSplit
            label='একই DELETE, দুই রকম Foreign Key'
            caption={
                <>
                    বাঁ দিকে সাধারণ Foreign Key (NO ACTION): Oliver এর Booking এখনো তাকে দেখায়, তাই PostgreSQL মুছতেই দেয় না। ডান দিকে ON
                    DELETE CASCADE: একটা DELETE শিকল ধরে নিচে নামে, Booking আর Payment সব নিয়ে যায়, কোনো প্রশ্ন ছাড়াই। আয়ের Report
                    থেকে 28000 টাকা চুপচাপ উধাও।
                </>
            }
            panels={[
                {
                    title: 'NO ACTION (default)',
                    sub: 'আটকায়',
                    viewBox: '0 0 300 260',
                    height: 260,
                    children: <ChainPanel marker='del-chain-arrow-a' cascade={false} />,
                },
                {
                    title: 'ON DELETE CASCADE',
                    sub: 'সাথে নিয়ে যায়',
                    viewBox: '0 0 300 260',
                    height: 260,
                    children: <ChainPanel marker='del-chain-arrow-b' cascade />,
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 4. Soft Delete এর জীবনচক্র                                                    */
/* ------------------------------------------------------------------------- */

/**
 * A row's life under soft delete: live, then marked, then either restored or
 * purged by a scheduled job after a waiting period.
 */
export function DelSoftLifecycleDiagram() {
    return (
        <Sketch
            label='Soft Delete এর জীবনচক্র'
            height={250}
            viewBox='0 0 760 250'
            caption={
                <>
                    Soft Delete এ একটা Row তিন অবস্থার একটায় থাকে। শুরুতে <code>deleted_at</code> NULL, মানে জীবিত। মোছার অনুরোধে একটা
                    UPDATE সেখানে সময় লেখে। ভুল হলে আরেকটা UPDATE সেটা NULL করে ফিরিয়ে আনে। আর অনেক দল একটা নির্দিষ্ট সময় পরে, ধরুন 30
                    দিন, একটা নির্ধারিত Job চালায় যা সেই Row গুলো সত্যিই মুছে দেয় বা Archive এ সরায়।
                </>
            }>
            <Arrow id='del-life-arrow' />
            <SketchBox x={20} y={80} w={170} h={64} title='LIVE' sub='deleted_at = NULL' />
            <SketchBox x={300} y={80} w={170} h={64} title='SOFT DELETED' sub='deleted_at = 2026-11-01' accent />
            <SketchBox x={580} y={80} w={160} h={64} title='PURGED' sub='DELETE বা Archive' dashed />
            <line x1={192} y1={100} x2={296} y2={100} stroke='currentColor' strokeOpacity='0.55' markerEnd='url(#del-life-arrow)' />
            <SketchText x={244} y={70} size={9}>
                SET deleted_at = now()
            </SketchText>
            <path
                d='M 385 146 C 385 210, 105 210, 105 148'
                fill='none'
                stroke='currentColor'
                strokeOpacity='0.55'
                markerEnd='url(#del-life-arrow)'
            />
            <SketchText x={245} y={222} size={9}>
                Restore: SET deleted_at = NULL
            </SketchText>
            <line x1={472} y1={112} x2={576} y2={112} stroke='currentColor' strokeOpacity='0.55' markerEnd='url(#del-life-arrow)' />
            <SketchText x={524} y={102} size={9}>
                30 দিন পরে Job
            </SketchText>
            <SketchText x={105} y={40} size={9.5} body>
                সব Query তে দেখা যায়
            </SketchText>
            <SketchText x={385} y={40} size={9.5} body>
                Filter দেওয়া Query তে লুকানো
            </SketchText>
            <SketchText x={660} y={40} size={9.5} body>
                সত্যিই নেই
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 5. Soft Delete আর UNIQUE                                                      */
/* ------------------------------------------------------------------------- */

function AccountRows({ partial }: { partial: boolean }) {
    return (
        <>
            <Cell x={10} y={10} w={34} text='id' bold />
            <Cell x={44} y={10} w={150} text='email' bold />
            <Cell x={194} y={10} w={96} text='deleted_at' bold />
            <Cell x={10} y={34} w={34} text='1' muted={partial} />
            <Cell x={44} y={34} w={150} text='oliver.bennett@...' muted={partial} />
            <Cell x={194} y={34} w={96} text='2026-11-01' muted={partial} />
            <Cell x={10} y={58} w={34} text='2' accent={partial} />
            <Cell x={44} y={58} w={150} text='priya.sharma@...' accent={partial} />
            <Cell x={194} y={58} w={96} text='NULL' accent={partial} />
            <SketchText x={150} y={104} size={9.5} body opacity={0.8}>
                নতুন Sign up: oliver.bennett@mail.example
            </SketchText>
            <Cell x={10} y={116} w={34} text='3' accent={partial} dashed={!partial} />
            <Cell x={44} y={116} w={150} text='oliver.bennett@...' accent={partial} dashed={!partial} struck={!partial} />
            <Cell x={194} y={116} w={96} text='NULL' accent={partial} dashed={!partial} />
            {partial ? (
                <>
                    <SketchText x={150} y={164} size={10} bold accent>
                        INSERT 1
                    </SketchText>
                    <SketchText x={150} y={184} size={9.5} body>
                        Index এ শুধু জীবিত Row: 2 আর 3
                    </SketchText>
                    <SketchText x={150} y={202} size={9.5} body>
                        দুটো জীবিত priya হলে তবু 23505
                    </SketchText>
                </>
            ) : (
                <>
                    <SketchText x={150} y={164} size={10} bold accent>
                        ERROR 23505
                    </SketchText>
                    <SketchText x={150} y={184} size={9.5} body>
                        মুছে ফেলা Row 1 এখনো Email ধরে আছে
                    </SketchText>
                    <SketchText x={150} y={202} size={9.5} body>
                        Oliver আর কখনো ফিরতে পারবেন না
                    </SketchText>
                </>
            )}
        </>
    );
}

/**
 * The del_accounts table of the lesson under two rules: a plain UNIQUE on
 * email, and a partial unique index that only covers live rows.
 */
export function DelUniqueSplit() {
    return (
        <SketchSplit
            label='Soft Delete এর পরে একই Email'
            caption={
                <>
                    বাঁ দিকে সাধারণ UNIQUE: Database জানে না Row 1 মুছে ফেলা ধরা হয়, তাই নতুন Sign up আটকায়। ডান দিকে Partial Unique Index:{' '}
                    <code>WHERE deleted_at IS NULL</code> থাকায় Index এ শুধু জীবিত Row ঢোকে (রঙিন), মুছে ফেলা Row বাইরে থাকে। নতুন Oliver
                    ঢুকতে পারেন, কিন্তু দুজন জীবিত মানুষ একই Email নিতে পারেন না।
                </>
            }
            panels={[
                {
                    title: 'UNIQUE (email)',
                    sub: 'সব Row গোনে',
                    viewBox: '0 0 300 215',
                    height: 215,
                    children: <AccountRows partial={false} />,
                },
                {
                    title: 'UNIQUE ... WHERE deleted_at IS NULL',
                    sub: 'শুধু জীবিত Row গোনে',
                    viewBox: '0 0 300 215',
                    height: 215,
                    children: <AccountRows partial />,
                },
            ]}
        />
    );
}
