"use client";

import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

/*
 * Labs for SQL Module 01, Lesson 04: the relational model.
 * The rows below are copied from the Island Tours sample database
 * (public/sql/island-tours.sql), and every error message is the exact text
 * PostgreSQL returned when the statement was run against that database.
 */

function Panel({
  label,
  title,
  children,
  footer,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <figure className="my-10 border border-border bg-card">
      <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-3 border-b border-border bg-muted/30">
        <span className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-primary">
          {label}
        </span>
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
          {title}
        </span>
      </figcaption>
      <div className="p-5 md:p-8">{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground leading-relaxed">
          {footer}
        </div>
      )}
    </figure>
  );
}

const BTN = "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors";
const BTN_ON = "border-primary bg-primary/10 text-primary";
const BTN_OFF = "border-border text-muted-foreground hover:text-foreground hover:border-primary/40";

/* ------------------------------------------------------------------------- */
/* 1. Key ধরে ধরে হাঁটা                                                          */
/* ------------------------------------------------------------------------- */

type Booking = { id: number; customer: number; departure: number; seats: number; status: string };
type Customer = { id: number; name: string; city: string };
type Departure = { id: number; tour: number; starts: string };
type Tour = { id: number; title: string; destination: number; guide: number | null };
type Destination = { id: number; name: string };
type Guide = { id: number; name: string };

const BOOKINGS: Booking[] = [
  { id: 2, customer: 2, departure: 1, seats: 4, status: "confirmed" },
  { id: 5, customer: 5, departure: 3, seats: 2, status: "cancelled" },
  { id: 13, customer: 2, departure: 8, seats: 2, status: "confirmed" },
  { id: 17, customer: 1, departure: 11, seats: 2, status: "pending" },
  { id: 20, customer: 9, departure: 14, seats: 2, status: "pending" },
  { id: 21, customer: 4, departure: 15, seats: 3, status: "confirmed" },
];
const CUSTOMERS: Customer[] = [
  { id: 1, name: "Rahim Uddin", city: "Dhaka" },
  { id: 2, name: "Nusrat Jahan", city: "Dhaka" },
  { id: 4, name: "Farhana Akter", city: "Sylhet" },
  { id: 5, name: "Sabbir Hossain", city: "Rajshahi" },
  { id: 9, name: "Priya Sharma", city: "Kolkata" },
];
const DEPARTURES: Departure[] = [
  { id: 1, tour: 1, starts: "2026-01-15" },
  { id: 3, tour: 2, starts: "2026-01-23" },
  { id: 8, tour: 1, starts: "2026-11-20" },
  { id: 11, tour: 3, starts: "2026-12-04" },
  { id: 14, tour: 6, starts: "2026-11-14" },
  { id: 15, tour: 7, starts: "2026-11-21" },
];
const TOURS: Tour[] = [
  { id: 1, title: "Saint Martin Island Escape", destination: 1, guide: 1 },
  { id: 2, title: "Cox's Bazar Beach Weekend", destination: 2, guide: 2 },
  { id: 3, title: "Sundarbans Mangrove Cruise", destination: 3, guide: 3 },
  { id: 6, title: "Sylhet Tea Garden Tour", destination: 6, guide: 2 },
  { id: 7, title: "Ratargul Swamp Boat Day", destination: 6, guide: null },
];
const DESTINATIONS: Destination[] = [
  { id: 1, name: "Saint Martin's Island" },
  { id: 2, name: "Cox's Bazar" },
  { id: 3, name: "Sundarbans" },
  { id: 6, name: "Sylhet" },
];
const GUIDES: Guide[] = [
  { id: 1, name: "Jamal Hossain" },
  { id: 2, name: "Shirin Akter" },
  { id: 3, name: "Rubel Mia" },
];

type TableName = "bookings" | "customers" | "departures" | "tours" | "destinations" | "guides";

type Hop = {
  table: TableName;
  /** The key value looked up in that table, or null when the key was NULL. */
  id: number | null;
  /** Which column of the previous row gave the number. */
  via: string;
  text: string;
};

function hopsFor(b: Booking): Hop[] {
  const customer = CUSTOMERS.find((c) => c.id === b.customer)!;
  const departure = DEPARTURES.find((d) => d.id === b.departure)!;
  const tour = TOURS.find((t) => t.id === departure.tour)!;
  const destination = DESTINATIONS.find((d) => d.id === tour.destination)!;
  const guide = tour.guide === null ? null : GUIDES.find((g) => g.id === tour.guide)!;
  return [
    {
      table: "bookings",
      id: b.id,
      via: "booking_id",
      text: `bookings Table এ Primary Key ${b.id} এর Row টা পাওয়া গেল: ${b.seats} সিট, ${b.status}। এই Row এ আছে আরও দুটো নম্বর, customer_id ${b.customer} আর departure_id ${b.departure}।`,
    },
    {
      table: "customers",
      id: customer.id,
      via: `customer_id ${b.customer}`,
      text: `customer_id ${b.customer} নিয়ে customers Table এ গেলাম। Primary Key ${customer.id} এর Row: ${customer.name}, ${customer.city}।`,
    },
    {
      table: "departures",
      id: departure.id,
      via: `departure_id ${b.departure}`,
      text: `departure_id ${b.departure} নিয়ে departures Table এ গেলাম। রওনা ${departure.starts}, আর এই Row এ আরেকটা নম্বর, tour_id ${departure.tour}।`,
    },
    {
      table: "tours",
      id: tour.id,
      via: `tour_id ${departure.tour}`,
      text: `tour_id ${departure.tour} নিয়ে tours Table এ গেলাম: ${tour.title}। এখান থেকে দুটো পথ, destination_id ${tour.destination} আর guide_id ${tour.guide === null ? "NULL" : tour.guide}।`,
    },
    {
      table: "destinations",
      id: destination.id,
      via: `destination_id ${tour.destination}`,
      text: `destination_id ${tour.destination} নিয়ে destinations Table এ গেলাম: ${destination.name}।`,
    },
    guide
      ? {
          table: "guides",
          id: guide.id,
          via: `guide_id ${tour.guide}`,
          text: `guide_id ${tour.guide} নিয়ে guides Table এ গেলাম: ${guide.name}। পথ শেষ।`,
        }
      : {
          table: "guides",
          id: null,
          via: "guide_id NULL",
          text: "guide_id এর ঘরে কোনো নম্বর নেই, আছে NULL। মানে এই ট্যুরের Guide এখনো ঠিক হয়নি। খুঁজতে যাওয়ার মতো কোনো Row নেই, তাই এখানেই পথ শেষ।",
        },
  ];
}

const TABLE_ROWS: Record<TableName, { id: number; cells: string[] }[]> = {
  bookings: BOOKINGS.map((b) => ({
    id: b.id,
    cells: [String(b.id), String(b.customer), String(b.departure), b.status],
  })),
  customers: CUSTOMERS.map((c) => ({ id: c.id, cells: [String(c.id), c.name] })),
  departures: DEPARTURES.map((d) => ({ id: d.id, cells: [String(d.id), String(d.tour), d.starts] })),
  tours: TOURS.map((t) => ({
    id: t.id,
    cells: [String(t.id), t.title, String(t.destination), t.guide === null ? "NULL" : String(t.guide)],
  })),
  destinations: DESTINATIONS.map((d) => ({ id: d.id, cells: [String(d.id), d.name] })),
  guides: GUIDES.map((g) => ({ id: g.id, cells: [String(g.id), g.name] })),
};

const TABLE_HEADERS: Record<TableName, string[]> = {
  bookings: ["booking_id", "customer_id", "departure_id", "status"],
  customers: ["customer_id", "full_name"],
  departures: ["departure_id", "tour_id", "starts_on"],
  tours: ["tour_id", "title", "destination_id", "guide_id"],
  destinations: ["destination_id", "name"],
  guides: ["guide_id", "full_name"],
};

const TABLE_ORDER: TableName[] = ["bookings", "customers", "departures", "tours", "destinations", "guides"];

function MiniTable({
  name,
  activeId,
  reached,
  missing,
}: {
  name: TableName;
  activeId: number | null;
  reached: boolean;
  missing: boolean;
}) {
  return (
    <div
      className={cn(
        "border transition-colors duration-300",
        reached ? "border-primary/60" : "border-border",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between px-3 py-1.5 border-b font-mono text-[0.6875rem] font-bold",
          reached ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-muted/30 text-muted-foreground",
        )}
      >
        <span>{name}</span>
        {missing && <span className="text-[0.625rem] font-normal">কোনো Row নেই</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-[0.6875rem]">
          <thead>
            <tr className="text-muted-foreground">
              {TABLE_HEADERS[name].map((h) => (
                <th key={h} className="px-3 py-1 text-left font-normal whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS[name].map((row) => {
              const on = reached && row.id === activeId;
              return (
                <tr
                  key={row.id}
                  className={cn(
                    "border-t border-border/60 transition-colors duration-300",
                    on ? "bg-primary/15 text-primary font-bold" : "text-foreground/80",
                  )}
                >
                  {row.cells.map((cell, i) => (
                    <td
                      key={i}
                      className={cn("px-3 py-1 whitespace-nowrap", cell === "NULL" && "italic text-muted-foreground")}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function FollowTheKeysLab() {
  const reduce = useReducedMotion();
  const [bookingId, setBookingId] = useState(13);
  const [step, setStep] = useState(0);
  const booking = BOOKINGS.find((b) => b.id === bookingId)!;
  const hops = hopsFor(booking);
  const last = hops.length - 1;
  const done = step >= last;

  const reachedAt = (table: TableName) => {
    const index = hops.findIndex((h) => h.table === table);
    return index !== -1 && index <= step ? hops[index] : null;
  };

  const customer = CUSTOMERS.find((c) => c.id === booking.customer)!;
  const departure = DEPARTURES.find((d) => d.id === booking.departure)!;
  const tour = TOURS.find((t) => t.id === departure.tour)!;
  const destination = DESTINATIONS.find((d) => d.id === tour.destination)!;
  const guide = tour.guide === null ? null : GUIDES.find((g) => g.id === tour.guide)!;

  return (
    <Panel
      label="Interactive"
      title="একটা Booking এর Key ধরে ধরে হাঁটা"
      footer={
        <>
          প্রতিটা Table এ শুধু সেই Row গুলো দেখানো হয়েছে যেগুলো এই ছয়টা Booking এর পথে পড়ে। সংখ্যাগুলো আসল
          Island Tours Database এর। Booking 21 বেছে দেখুন, ট্যুরের Guide না থাকলে পথ কোথায় থামে।
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
          booking_id
        </span>
        {BOOKINGS.map((b) => (
          <button
            key={b.id}
            onClick={() => {
              setBookingId(b.id);
              setStep(0);
            }}
            className={cn(BTN, b.id === bookingId ? BTN_ON : BTN_OFF)}
            aria-pressed={b.id === bookingId}
            data-booking={b.id}
          >
            {b.id}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-5">
        {TABLE_ORDER.map((name) => {
          const hop = reachedAt(name);
          return (
            <MiniTable
              key={name}
              name={name}
              activeId={hop ? hop.id : null}
              reached={Boolean(hop)}
              missing={Boolean(hop) && hop?.id === null}
            />
          );
        })}
      </div>

      <ol className="space-y-2 mb-5" data-step={step}>
        {hops.slice(0, step + 1).map((hop, i) => (
          <motion.li
            key={`${bookingId}-${i}`}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex gap-3 text-[0.8125rem] leading-relaxed"
          >
            <span className="font-mono text-[0.6875rem] font-bold text-primary pt-0.5 shrink-0">
              {toBn(i + 1)}.
            </span>
            <span className="text-foreground/90">
              <span className="font-mono text-[0.6875rem] text-muted-foreground mr-2">{hop.via}</span>
              {hop.text}
            </span>
          </motion.li>
        ))}
      </ol>

      {done && (
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="border border-primary/50 bg-primary/5 p-4 mb-5 text-sm leading-relaxed"
          data-result
        >
          <span className="block font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-primary mb-1">
            ছয়টা Table থেকে জোড়া লাগানো উত্তর
          </span>
          Booking {booking.id}: {customer.name}, {tour.title} ({destination.name}), রওনা {departure.starts},{" "}
          {toBn(booking.seats)}টা সিট, {booking.status}। Guide: {guide ? guide.name : "এখনো ঠিক হয়নি (NULL)"}।
        </motion.div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStep((s) => Math.min(last, s + 1))}
          disabled={done}
          className={cn(BTN, done ? "border-border text-muted-foreground/50" : BTN_ON)}
          data-action="next"
        >
          পরের Key ধরুন
        </button>
        <button onClick={() => setStep(last)} disabled={done} className={cn(BTN, BTN_OFF)} data-action="all">
          পুরো পথ একবারে
        </button>
        <button onClick={() => setStep(0)} className={cn(BTN, BTN_OFF, "inline-flex items-center gap-1.5")}>
          <RotateCcw className="w-3 h-3" />
          আবার শুরু
        </button>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Database কোনটা মেনে নেয়, কোনটা ফিরিয়ে দেয়                                    */
/* ------------------------------------------------------------------------- */

type Attempt = {
  id: string;
  label: string;
  sql: string;
  accepted: boolean;
  rule: string;
  output: string[];
  why: string;
};

const ATTEMPTS: Attempt[] = [
  {
    id: "new-customer",
    label: "নতুন Customer যোগ",
    sql: "INSERT INTO customers (full_name, email, city)\nVALUES ('Tanjila Nur', 'tanjila.nur@mail.example', 'Dhaka')\nRETURNING customer_id;",
    accepted: true,
    rule: "Primary Key",
    output: [" customer_id ", "-------------", "          16", "(1 row)", "", "INSERT 0 1"],
    why: "customer_id আমরা লিখিনি। Database নিজেই পরের খালি নম্বর 16 দিয়েছে, আর country না বলায় Default Bangladesh বসিয়েছে। Primary Key এর নম্বর মানুষ বানায় না, Database বানায়, তাই দুজন কখনো একই নম্বর পায় না।",
  },
  {
    id: "unknown-customer",
    label: "অচেনা Customer এর Booking",
    sql: "INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)\nVALUES (99, 8, 1, 'pending', 12500.00);",
    accepted: false,
    rule: "Foreign Key",
    output: [
      'ERROR:  insert or update on table "bookings" violates foreign key constraint "bookings_customer_id_fkey"',
      'DETAIL:  Key (customer_id)=(99) is not present in table "customers".',
    ],
    why: "customer_id 99 এর কোনো Customer নেই। Foreign Key এর কাজই এটা: যে নম্বর আরেক Table এ নেই, সেই নম্বর এই Table এ ঢুকতে না দেওয়া। Spreadsheet এ এমন একটা ভুতুড়ে Booking চুপচাপ বসে যেত।",
  },
  {
    id: "delete-customer",
    label: "Booking আছে এমন Customer মোছা",
    sql: "DELETE FROM customers WHERE customer_id = 2;",
    accepted: false,
    rule: "Foreign Key",
    output: [
      'ERROR:  update or delete on table "customers" violates foreign key constraint "bookings_customer_id_fkey" on table "bookings"',
      'DETAIL:  Key (customer_id)=(2) is still referenced from table "bookings".',
    ],
    why: "Nusrat Jahan এর দুটো Booking এখনো তাঁর নম্বর ধরে আছে। তাঁকে মুছে ফেললে সেই Booking দুটো এমন এক Customer কে দেখাবে যিনি আর নেই। একই পাহারা, উল্টো দিক থেকে। মুছলে কী হবে সেটা আগে থেকে ঠিক করার উপায় Module 09 এ শিখবেন।",
  },
  {
    id: "same-email",
    label: "একই Email এ আরেকজন",
    sql: "INSERT INTO customers (full_name, email, city)\nVALUES ('Nusrat Jahan', 'nusrat.jahan@mail.example', 'Dhaka');",
    accepted: false,
    rule: "UNIQUE",
    output: [
      'ERROR:  duplicate key value violates unique constraint "customers_email_key"',
      "DETAIL:  Key (email)=(nusrat.jahan@mail.example) already exists.",
    ],
    why: "নাম মিলে যাওয়া সমস্যা না, দুজন মানুষের নাম এক হতেই পারে। কিন্তু email Column এ UNIQUE নিয়ম আছে, তাই একই Email দিয়ে দ্বিতীয় Account খোলা যায় না। Lesson 01 এ একই Customer তিন বানানে তিনবার লেখা হয়েছিল। এখানে একজন মানুষ একবারই Row পান, আর বাকি সবখানে থাকে শুধু তাঁর নম্বর।",
  },
  {
    id: "no-email",
    label: "Email ছাড়া Customer",
    sql: "INSERT INTO customers (full_name, city)\nVALUES ('Tanjila Nur', 'Dhaka');",
    accepted: false,
    rule: "NOT NULL",
    output: ['ERROR:  null value in column "email" of relation "customers" violates not-null constraint'],
    why: "email Column এ NOT NULL লেখা আছে, মানে এই ঘর খালি রাখা যাবে না। Error এ relation শব্দটা খেয়াল করুন। PostgreSQL Table কে relation বলে, এই লেসনের শুরুর সেই Codd এর শব্দ।",
  },
  {
    id: "change-pk",
    label: "Primary Key বদলানো",
    sql: "UPDATE customers SET customer_id = 50 WHERE customer_id = 3;",
    accepted: false,
    rule: "Primary Key",
    output: [
      'ERROR:  column "customer_id" can only be updated to DEFAULT',
      'DETAIL:  Column "customer_id" is an identity column defined as GENERATED ALWAYS.',
    ],
    why: "Primary Key হলো পরিচয়, আর পরিচয় বদলায় না। অন্য Table গুলো এই নম্বর ধরে আছে, নম্বর বদলালে সবার হাতের ঠিকানা ভুল হয়ে যেত। এই Database এ Column টা এমনভাবে বানানো যে কেউ চাইলেও হাত দিতে পারে না। কীভাবে, সেটা Module 09 এ।",
  },
  {
    id: "remove-guide",
    label: "ট্যুর থেকে Guide সরানো",
    sql: "UPDATE tours SET guide_id = NULL WHERE tour_id = 2;",
    accepted: true,
    rule: "Foreign Key, NULL",
    output: ["UPDATE 1"],
    why: "guide_id একটা Foreign Key, কিন্তু তাতে NOT NULL নেই। তাই সেখানে NULL রাখা চলে, যার মানে Guide এখনো ঠিক হয়নি। NULL কোনো Row কে দেখায় না, তাই পাহারা দেওয়ার কিছু নেই। Ratargul ট্যুর আগে থেকেই এই অবস্থায় আছে।",
  },
];

export function KeyRulesLab() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(ATTEMPTS[1].id);
  const attempt = ATTEMPTS.find((a) => a.id === active)!;

  return (
    <Panel
      label="Interactive"
      title="Database কোনটা মেনে নেয়, কোনটা ফিরিয়ে দেয়"
      footer={
        <>
          প্রতিটা Statement Island Tours Database এর একটা নতুন কপিতে চালানো হয়েছিল, আর Output হুবহু PostgreSQL
          এর। নিচের Query বক্সে এগুলো নিজেও চালিয়ে দেখতে পারবেন।
        </>
      }
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {ATTEMPTS.map((a) => (
          <button
            key={a.id}
            onClick={() => setActive(a.id)}
            className={cn(BTN, a.id === active ? BTN_ON : BTN_OFF)}
            aria-pressed={a.id === active}
            data-attempt={a.id}
          >
            {a.label}
          </button>
        ))}
      </div>

      <motion.div
        key={attempt.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        data-active={attempt.id}
      >
        <pre className="overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground mb-4">
          {attempt.sql}
        </pre>
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] gap-4 mb-4">
          <div
            className={cn(
              "border p-4",
              attempt.accepted ? "border-primary/50 bg-primary/5" : "border-destructive/40 bg-destructive/5",
            )}
          >
            <span
              className={cn(
                "block font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] mb-1",
                attempt.accepted ? "text-primary" : "text-destructive",
              )}
            >
              {attempt.accepted ? "মেনে নিল" : "ফিরিয়ে দিল"}
            </span>
            <span className="block text-sm font-bold">নিয়ম: {attempt.rule}</span>
          </div>
          <pre
            className={cn(
              "overflow-x-auto border px-4 py-3 font-mono text-[0.6875rem] leading-relaxed whitespace-pre-wrap break-words",
              attempt.accepted ? "border-border text-foreground/80" : "border-destructive/30 text-destructive",
            )}
          >
            {attempt.output.join("\n")}
          </pre>
        </div>
        <p className="text-[0.875rem] leading-relaxed text-muted-foreground">{attempt.why}</p>
      </motion.div>
    </Panel>
  );
}
