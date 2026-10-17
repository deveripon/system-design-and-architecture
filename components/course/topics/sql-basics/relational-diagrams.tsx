import { Sketch, SketchSplit, SketchText } from "../../sketch";

/*
 * Visuals for SQL Module 01, Lesson 04: the relational model.
 * Every value drawn here is a real row of the Island Tours sample database
 * (public/sql/island-tours.sql), so the reader can run a query and see the
 * same numbers in the query box.
 */

const PK_FILL = "var(--primary)";

/** One row of cells drawn left to right. */
function Cells({
  x,
  y,
  widths,
  values,
  h = 34,
  header,
  accentCols = [],
  fillCols = [],
  size = 11,
}: {
  x: number;
  y: number;
  widths: number[];
  values: string[];
  h?: number;
  header?: boolean;
  accentCols?: number[];
  fillCols?: number[];
  size?: number;
}) {
  return (
    <g>
      {values.map((value, i) => {
        const w = widths[i];
        const left = x + widths.slice(0, i).reduce((sum, width) => sum + width, 0);
        return (
          <g key={`${value}-${i}`}>
            <rect
              x={left}
              y={y}
              width={w}
              height={h}
              fill={fillCols.includes(i) ? PK_FILL : header ? "currentColor" : "transparent"}
              fillOpacity={fillCols.includes(i) ? 0.09 : header ? 0.06 : 0}
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeWidth="1"
            />
            <SketchText
              x={left + 10}
              y={y + h / 2 + 4}
              anchor="start"
              size={size}
              bold={header}
              accent={accentCols.includes(i)}
            >
              {value}
            </SketchText>
          </g>
        );
      })}
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. একটা Table এর অংশগুলো                                                      */
/* ------------------------------------------------------------------------- */

export function TableAnatomyDiagram() {
  const x = 230;
  const widths = [120, 170, 130, 130];
  const header = ["customer_id", "full_name", "city", "country"];
  const rows = [
    ["1", "Rahim Uddin", "Dhaka", "Bangladesh"],
    ["2", "Nusrat Jahan", "Dhaka", "Bangladesh"],
    ["3", "Tanvir Ahmed", "Chattogram", "Bangladesh"],
    ["9", "Priya Sharma", "Kolkata", "India"],
  ];
  const top = 60;
  const h = 34;
  const cityX = x + widths[0] + widths[1];
  const right = x + widths.reduce((a, b) => a + b, 0);
  return (
    <Sketch
      label="Anatomy of a Table: customers"
      height={330}
      minWidth={900}
      viewBox="0 0 900 330"
      caption={
        <>
          Island Tours এর <code className="font-mono">customers</code> Table এর চারটা Row আর চারটা
          Column। একটা Row মানে একজন Customer, একটা Column মানে সবার একই একটা বৈশিষ্ট্য, আর
          দুটো মিলে যে ঘর, তাতে থাকে ঠিক একটা মান। রং করা প্রথম Column টা Primary Key, প্রতিটা
          Row এর নিজস্ব নম্বর।
        </>
      }
    >
      <SketchText x={x} y={42} anchor="start" size={13} bold accent>
        customers
      </SketchText>
      <SketchText x={x + 100} y={42} anchor="start" size={11} body opacity={0.75}>
        একটা Table: শুধু Customer দের খাতা
      </SketchText>

      <Cells x={x} y={top} widths={widths} values={header} header accentCols={[0]} fillCols={[0]} />
      {rows.map((row, i) => (
        <Cells key={row[0]} x={x} y={top + h * (i + 1)} widths={widths} values={row} fillCols={[0]} />
      ))}

      {/* Row callout */}
      <rect
        x={x - 4}
        y={top + h * 2 - 3}
        width={right - x + 8}
        height={h + 6}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.4"
        strokeDasharray="5 3"
      />
      <line x1={150} y1={top + h * 2.5} x2={x - 6} y2={top + h * 2.5} stroke="var(--primary)" strokeWidth="1.2" />
      <SketchText x={20} y={top + h * 2.5 - 4} anchor="start" size={12} bold accent>
        Row
      </SketchText>
      <SketchText x={20} y={top + h * 2.5 + 14} anchor="start" size={10.5} body>
        একজন Customer
      </SketchText>

      {/* Primary key callout */}
      <line x1={150} y1={top + h / 2} x2={x - 6} y2={top + h / 2} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1" />
      <SketchText x={20} y={top + h / 2 - 4} anchor="start" size={12} bold accent>
        Primary Key
      </SketchText>
      <SketchText x={20} y={top + h / 2 + 14} anchor="start" size={10.5} body>
        প্রতিটা Row এর নম্বর
      </SketchText>

      {/* Column callout */}
      <rect
        x={cityX - 3}
        y={top - 3}
        width={widths[2] + 6}
        height={h * 5 + 6}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.7}
        strokeWidth="1.2"
        strokeDasharray="3 3"
      />
      <line
        x1={cityX + widths[2] / 2}
        y1={top + h * 5 + 4}
        x2={cityX + widths[2] / 2}
        y2={top + h * 5 + 34}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth="1"
      />
      <SketchText x={cityX + widths[2] / 2} y={top + h * 5 + 50} size={12} bold>
        Column: city
      </SketchText>
      <SketchText x={cityX + widths[2] / 2} y={top + h * 5 + 68} size={10.5} body>
        সবার একই বৈশিষ্ট্য, একই ধরনের মান
      </SketchText>

      {/* Cell callout */}
      <circle
        cx={x + widths[0] + widths[1] / 2}
        cy={top + h * 4.5}
        r={20}
        fill="none"
        stroke="var(--primary)"
        strokeOpacity={0.8}
        strokeWidth="1.2"
      />
      <line x1={right + 6} y1={top + h * 4.5} x2={right + 24} y2={top + h * 4.5} stroke="currentColor" strokeOpacity={0.5} />
      <SketchText x={right + 30} y={top + h * 4.5 - 4} anchor="start" size={12} bold accent>
        Cell
      </SketchText>
      <SketchText x={right + 30} y={top + h * 4.5 + 14} anchor="start" size={10.5} body>
        একটা ঘর, একটা মান
      </SketchText>
      <path
        d={`M ${x + widths[0] + widths[1] / 2 + 22} ${top + h * 4.5} H ${right + 4}`}
        stroke="var(--primary)"
        strokeOpacity={0.5}
        strokeDasharray="2 3"
        fill="none"
      />
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Foreign Key: একটা নম্বর, যা আরেক Table এর Row কে দেখায়                       */
/* ------------------------------------------------------------------------- */

export function ForeignKeyDiagram() {
  const bx = 190;
  const bw = [110, 110, 120, 70, 110];
  const bTop = 56;
  const h = 32;
  const custX = 40;
  const custW = [120, 170];
  const custTop = 230;
  const depX = 520;
  const depW = [120, 80, 120];
  const depTop = 230;
  const fkCustomerCx = bx + bw[0] + bw[1] / 2;
  const fkDepartureCx = bx + bw[0] + bw[1] + bw[2] / 2;
  return (
    <Sketch
      label="Foreign Key: booking 13 points at two other rows"
      height={400}
      minWidth={880}
      viewBox="0 0 880 400"
      caption={
        <>
          Booking 13 এর Row এ Customer এর নাম নেই, Tour এর তারিখও নেই। আছে শুধু দুটো নম্বর।{" "}
          <code className="font-mono">customer_id</code> এর 2 মানে <code className="font-mono">customers</code>{" "}
          Table এর যে Row এর Primary Key 2, আর <code className="font-mono">departure_id</code> এর 8 মানে{" "}
          <code className="font-mono">departures</code> এর Row 8। এমন নম্বরকে বলে Foreign Key, আরেক Table
          এর Primary Key এর একটা কপি।
        </>
      }
    >
      <defs>
        <marker
          id="relational-fk-arrow"
          markerWidth={9}
          markerHeight={9}
          refX={8}
          refY={4}
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--primary)" />
        </marker>
      </defs>

      <SketchText x={bx} y={bTop - 14} anchor="start" size={12.5} bold accent>
        bookings
      </SketchText>
      <Cells
        x={bx}
        y={bTop}
        h={h}
        widths={bw}
        values={["booking_id", "customer_id", "departure_id", "seats", "status"]}
        header
        size={10.5}
      />
      <Cells
        x={bx}
        y={bTop + h}
        h={h}
        widths={bw}
        values={["13", "2", "8", "2", "confirmed"]}
        fillCols={[1, 2]}
        accentCols={[1, 2]}
        size={10.5}
      />
      <SketchText x={fkCustomerCx} y={bTop + h * 2 + 18} size={9.5} bold accent>
        FK
      </SketchText>
      <SketchText x={fkDepartureCx} y={bTop + h * 2 + 18} size={9.5} bold accent>
        FK
      </SketchText>

      {/* customers */}
      <SketchText x={custX} y={custTop - 14} anchor="start" size={12.5} bold>
        customers
      </SketchText>
      <Cells x={custX} y={custTop} h={h} widths={custW} values={["customer_id", "full_name"]} header size={10.5} />
      <Cells x={custX} y={custTop + h} h={h} widths={custW} values={["1", "Rahim Uddin"]} size={10.5} />
      <Cells
        x={custX}
        y={custTop + h * 2}
        h={h}
        widths={custW}
        values={["2", "Nusrat Jahan"]}
        fillCols={[0, 1]}
        accentCols={[0, 1]}
        size={10.5}
      />
      <Cells x={custX} y={custTop + h * 3} h={h} widths={custW} values={["3", "Tanvir Ahmed"]} size={10.5} />
      <SketchText x={custX + custW[0] + custW[1] + 8} y={custTop + h * 2.5 + 4} anchor="start" size={9.5} bold accent>
        PK
      </SketchText>

      {/* departures */}
      <SketchText x={depX} y={depTop - 14} anchor="start" size={12.5} bold>
        departures
      </SketchText>
      <Cells x={depX} y={depTop} h={h} widths={depW} values={["departure_id", "tour_id", "starts_on"]} header size={10.5} />
      <Cells x={depX} y={depTop + h} h={h} widths={depW} values={["7", "6", "2026-04-10"]} size={10.5} />
      <Cells
        x={depX}
        y={depTop + h * 2}
        h={h}
        widths={depW}
        values={["8", "1", "2026-11-20"]}
        fillCols={[0, 1, 2]}
        accentCols={[0, 1, 2]}
        size={10.5}
      />
      <Cells x={depX} y={depTop + h * 3} h={h} widths={depW} values={["9", "1", "2026-12-18"]} size={10.5} />
      <SketchText x={depX - 8} y={depTop + h * 2.5 + 4} anchor="end" size={9.5} bold accent>
        PK
      </SketchText>

      {/* arrows */}
      <path
        d={`M ${fkCustomerCx} ${bTop + h * 2 + 26} V ${custTop + h * 2.5} H ${custX + custW[0] + custW[1] + 30}`}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#relational-fk-arrow)"
      />
      <path
        d={`M ${fkDepartureCx} ${bTop + h * 2 + 26} V ${depTop + h * 2.5 - 40} H ${depX - 50} V ${depTop + h * 2.5} H ${depX - 30}`}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#relational-fk-arrow)"
      />
      <SketchText x={fkCustomerCx - 10} y={custTop - 30} anchor="end" size={10.5} body>
        customer_id = 2
      </SketchText>
      <SketchText x={fkDepartureCx + 12} y={depTop - 52} anchor="start" size={10.5} body>
        departure_id = 8
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. One-to-Many: একদিকে এক, অন্যদিকে অনেক                                      */
/* ------------------------------------------------------------------------- */

function OneToManyPanel({
  oneLabel,
  oneTitle,
  manyLabel,
  many,
  markerId,
}: {
  oneLabel: string;
  oneTitle: string;
  manyLabel: string;
  many: string[];
  markerId: string;
}) {
  const oneY = 40 + (many.length * 46) / 2 - 26;
  return (
    <>
      <defs>
        <marker
          id={markerId}
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
      <rect
        x={10}
        y={oneY}
        width={170}
        height={52}
        fill="var(--primary)"
        fillOpacity={0.1}
        stroke="var(--primary)"
        strokeWidth="1.2"
      />
      <SketchText x={95} y={oneY + 22} size={10.5} bold accent>
        {oneLabel}
      </SketchText>
      <SketchText x={95} y={oneY + 40} size={9.5}>
        {oneTitle}
      </SketchText>
      <SketchText x={95} y={oneY - 10} size={11} bold accent>
        1
      </SketchText>
      {many.map((item, i) => {
        const y = 40 + i * 46;
        return (
          <g key={item}>
            <path
              d={`M ${288} ${y + 18} C ${236} ${y + 18}, ${236} ${oneY + 26}, ${184} ${oneY + 26}`}
              fill="none"
              stroke="var(--primary)"
              strokeOpacity={0.7}
              strokeWidth="1.2"
              markerEnd={`url(#${markerId})`}
            />
            <rect
              x={290}
              y={y}
              width={190}
              height={36}
              fill="transparent"
              stroke="currentColor"
              strokeOpacity={0.45}
              strokeWidth="1.1"
            />
            <SketchText x={300} y={y + 22} anchor="start" size={10}>
              {item}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={385} y={26} size={11} bold accent>
        N
      </SketchText>
      <SketchText x={385} y={52 + many.length * 46} size={10} body opacity={0.8}>
        {manyLabel}
      </SketchText>
    </>
  );
}

export function OneToManyDiagram() {
  return (
    <SketchSplit
      label="One-to-Many in Island Tours"
      caption={
        <>
          দুই দিকেই একই নিয়ম। একজন Customer এর অনেক Booking থাকতে পারে, কিন্তু প্রতিটা Booking
          ঠিক একজন Customer এর। একটা Tour অনেকবার রওনা দেয়, কিন্তু প্রতিটা Departure ঠিক একটা Tour
          এর। Foreign Key সবসময় বসে অনেক এর দিকের Table এ: <code className="font-mono">bookings</code>{" "}
          এ <code className="font-mono">customer_id</code>, <code className="font-mono">departures</code> এ{" "}
          <code className="font-mono">tour_id</code>।
        </>
      }
      panels={[
        {
          title: "customers to bookings",
          sub: "1 Customer, N Booking",
          viewBox: "0 0 490 160",
          height: 160,
          minWidth: 420,
          children: (
            <OneToManyPanel
              markerId="relational-one-many-a"
              oneLabel="customer_id 2"
              oneTitle="Nusrat Jahan"
              manyLabel="দুটো Row এই customer_id = 2"
              many={["booking 2  · customer_id 2", "booking 13 · customer_id 2"]}
            />
          ),
        },
        {
          title: "tours to departures",
          sub: "1 Tour, N Departure",
          viewBox: "0 0 490 260",
          height: 260,
          minWidth: 420,
          children: (
            <OneToManyPanel
              markerId="relational-one-many-b"
              oneLabel="tour_id 1"
              oneTitle="Saint Martin Island Escape"
              manyLabel="চারটা Row এই tour_id = 1"
              many={[
                "departure 1 · 2026-01-15",
                "departure 2 · 2026-02-12",
                "departure 8 · 2026-11-20",
                "departure 9 · 2026-12-18",
              ]}
            />
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 4. এক লম্বা Sheet বনাম আলাদা আলাদা Table                                        */
/* ------------------------------------------------------------------------- */

export function WideVsSplitDiagram() {
  const wideW = [44, 104, 176, 56];
  const wideRows = [
    ["1", "Rahim Uddin", "Saint Martin Island Escape", "12500"],
    ["2", "Nusrat Jahan", "Saint Martin Island Escape", "12500"],
    ["8", "Rahim Uddin", "Sajek Valley Cloud Trip", "9500"],
    ["13", "Nusrat Jahan", "Saint Martin Island Escape", "12500"],
  ];
  const h = 30;
  return (
    <SketchSplit
      label="One wide sheet vs separate tables"
      caption={
        <>
          বাঁদিকে Lesson 01 এর Spreadsheet এর মতো এক লম্বা Sheet: একই নাম, একই ট্যুরের নাম আর
          দাম বারবার লেখা (রং করা ঘরগুলো)। দাম বদলালে চারটা ঘর বদলাতে হবে, একটা ভুলে গেলেই দুটো
          আলাদা দাম। ডানদিকে একই তথ্য আলাদা Table এ: প্রতিটা নাম আর দাম ঠিক একবার লেখা, আর বাকি
          সবখানে শুধু নম্বর। এই চারটা Booking আসল Data থেকে নেওয়া।
        </>
      }
      panels={[
        {
          title: "One wide sheet",
          sub: "সবকিছু এক জায়গায়, বারবার",
          viewBox: "0 0 400 200",
          height: 200,
          minWidth: 380,
          children: (
            <g>
              <Cells x={10} y={20} h={h} widths={wideW} values={["#", "customer", "tour", "price"]} header size={9.5} />
              {wideRows.map((row, i) => (
                <Cells
                  key={row[0]}
                  x={10}
                  y={20 + h * (i + 1)}
                  h={h}
                  widths={wideW}
                  values={row}
                  size={9.5}
                  fillCols={row[2] === "Saint Martin Island Escape" ? [2, 3] : []}
                  accentCols={row[2] === "Saint Martin Island Escape" ? [2, 3] : []}
                />
              ))}
            </g>
          ),
        },
        {
          title: "Separate tables",
          sub: "প্রতিটা তথ্য একবার, বাকিটা নম্বর",
          viewBox: "0 0 460 300",
          height: 300,
          minWidth: 420,
          children: (
            <g>
              <SketchText x={10} y={16} anchor="start" size={10.5} bold accent>
                customers
              </SketchText>
              <Cells x={10} y={24} h={26} widths={[40, 110]} values={["id", "full_name"]} header size={9.5} />
              <Cells x={10} y={50} h={26} widths={[40, 110]} values={["1", "Rahim Uddin"]} size={9.5} />
              <Cells x={10} y={76} h={26} widths={[40, 110]} values={["2", "Nusrat Jahan"]} size={9.5} />

              <SketchText x={190} y={16} anchor="start" size={10.5} bold accent>
                tours
              </SketchText>
              <Cells x={190} y={24} h={26} widths={[34, 170, 56]} values={["id", "title", "price"]} header size={9.5} />
              <Cells
                x={190}
                y={50}
                h={26}
                widths={[34, 170, 56]}
                values={["1", "Saint Martin Island Escape", "12500"]}
                size={9.5}
                fillCols={[1, 2]}
              />
              <Cells
                x={190}
                y={76}
                h={26}
                widths={[34, 170, 56]}
                values={["4", "Sajek Valley Cloud Trip", "9500"]}
                size={9.5}
              />

              <SketchText x={10} y={146} anchor="start" size={10.5} bold accent>
                departures
              </SketchText>
              <Cells x={10} y={154} h={26} widths={[40, 64]} values={["id", "tour_id"]} header size={9.5} />
              <Cells x={10} y={180} h={26} widths={[40, 64]} values={["1", "1"]} size={9.5} />
              <Cells x={10} y={206} h={26} widths={[40, 64]} values={["5", "4"]} size={9.5} />
              <Cells x={10} y={232} h={26} widths={[40, 64]} values={["8", "1"]} size={9.5} />

              <SketchText x={190} y={146} anchor="start" size={10.5} bold accent>
                bookings
              </SketchText>
              <Cells
                x={190}
                y={154}
                h={26}
                widths={[34, 100, 110]}
                values={["id", "customer_id", "departure_id"]}
                header
                size={9.5}
              />
              <Cells x={190} y={180} h={26} widths={[34, 100, 110]} values={["1", "1", "1"]} size={9.5} />
              <Cells x={190} y={206} h={26} widths={[34, 100, 110]} values={["2", "2", "1"]} size={9.5} />
              <Cells x={190} y={232} h={26} widths={[34, 100, 110]} values={["8", "1", "5"]} size={9.5} />
              <Cells x={190} y={258} h={26} widths={[34, 100, 110]} values={["13", "2", "8"]} size={9.5} />
            </g>
          ),
        },
      ]}
    />
  );
}
