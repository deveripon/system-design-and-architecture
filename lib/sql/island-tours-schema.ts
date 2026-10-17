/**
 * The Island Tours sample database, described for people. The tables
 * themselves are defined once, in `public/sql/island-tours.sql`; a spec checks
 * that every table and column named here matches that file, in order.
 */

export interface SchemaColumn {
    name: string;
    /** The type as written in the CREATE TABLE statement. */
    type: string;
    /** PK, FK or UNIQUE, when the column is a key. */
    key?: 'PK' | 'FK' | 'UNIQUE FK';
    /** Which table a foreign key points at. */
    references?: string;
    note: string;
}

export interface SchemaTable {
    name: string;
    about: string;
    columns: SchemaColumn[];
}

export const ISLAND_TOURS_TABLES: SchemaTable[] = [
    {
        name: 'destinations',
        about: 'যে জায়গাগুলোতে ট্যুর হয়: Saint Martin, Cox\'s Bazar, Sundarbans আর আরও কয়েকটা।',
        columns: [
            { name: 'destination_id', type: 'integer', key: 'PK', note: 'প্রতিটা জায়গার নিজস্ব নম্বর।' },
            { name: 'name', type: 'text', note: 'জায়গার নাম, দুটো জায়গার নাম কখনো এক হবে না।' },
            { name: 'region', type: 'text', note: 'কোন বিভাগে, যেমন Chattogram বা Khulna।' },
            { name: 'kind', type: 'text', note: 'জায়গার ধরন: island, beach, forest, hills, tea_garden।' },
        ],
    },
    {
        name: 'guides',
        about: 'যাঁরা ট্যুরে সাথে যান। একজন Guide এর এখনো কোনো ট্যুর নেই।',
        columns: [
            { name: 'guide_id', type: 'integer', key: 'PK', note: 'প্রতিটা Guide এর নম্বর।' },
            { name: 'full_name', type: 'text', note: 'পুরো নাম।' },
            { name: 'phone', type: 'text', note: 'ফোন নম্বর, সবগুলো বানানো।' },
            { name: 'language', type: 'text', note: 'যে ভাষায় ট্যুর করান।' },
            { name: 'hired_on', type: 'date', note: 'কবে কাজে যোগ দিয়েছেন।' },
        ],
    },
    {
        name: 'tours',
        about: 'বিক্রির জন্য ট্যুর প্যাকেজ। একটা ট্যুরের এখনো Guide নেই, একটা বন্ধ, আর একটার কোনো তারিখ নেই।',
        columns: [
            { name: 'tour_id', type: 'integer', key: 'PK', note: 'প্রতিটা ট্যুরের নম্বর।' },
            { name: 'title', type: 'text', note: 'ট্যুরের নাম।' },
            { name: 'destination_id', type: 'integer', key: 'FK', references: 'destinations', note: 'কোন জায়গায় যায়।' },
            { name: 'guide_id', type: 'integer', key: 'FK', references: 'guides', note: 'কে নিয়ে যান। খালি থাকতে পারে, মানে NULL।' },
            { name: 'duration_days', type: 'smallint', note: 'কত দিনের ট্যুর।' },
            { name: 'price_bdt', type: 'numeric(10, 2)', note: 'একজনের দাম, টাকায়।' },
            { name: 'max_seats', type: 'smallint', note: 'একটা তারিখে সর্বোচ্চ কতজন যেতে পারেন।' },
            { name: 'is_active', type: 'boolean', note: 'এখনো বিক্রি হচ্ছে কিনা।' },
            { name: 'created_at', type: 'timestamptz', note: 'কবে ট্যুরটা যোগ হয়েছিল।' },
        ],
    },
    {
        name: 'customers',
        about: 'যাঁরা Account খুলেছেন। কয়েকজন দেশের বাইরের, কয়েকজনের ফোন নম্বর নেই, আর একজন এখনো কিছু বুক করেননি।',
        columns: [
            { name: 'customer_id', type: 'integer', key: 'PK', note: 'প্রতিটা Customer এর নম্বর।' },
            { name: 'full_name', type: 'text', note: 'পুরো নাম।' },
            { name: 'email', type: 'text', note: 'Email, দুজনের Email কখনো এক হবে না।' },
            { name: 'phone', type: 'text', note: 'ফোন নম্বর, না থাকলে NULL।' },
            { name: 'city', type: 'text', note: 'কোন শহরে থাকেন।' },
            { name: 'country', type: 'text', note: 'কোন দেশে থাকেন, না বললে Bangladesh।' },
            { name: 'joined_at', type: 'timestamptz', note: 'কবে Account খুলেছেন।' },
        ],
    },
    {
        name: 'departures',
        about: 'প্রতিটা ট্যুরের নির্দিষ্ট তারিখ। একটা ট্যুর অনেকবার হয়, তাই তারিখগুলো আলাদা Table এ।',
        columns: [
            { name: 'departure_id', type: 'integer', key: 'PK', note: 'প্রতিটা তারিখের নম্বর।' },
            { name: 'tour_id', type: 'integer', key: 'FK', references: 'tours', note: 'কোন ট্যুরের তারিখ।' },
            { name: 'starts_on', type: 'date', note: 'কবে রওনা।' },
            { name: 'seats_left', type: 'smallint', note: 'এখনো কতগুলো সিট খালি।' },
        ],
    },
    {
        name: 'bookings',
        about: 'কোন Customer কোন তারিখে কতগুলো সিট নিয়েছেন। কিছু confirmed, কিছু pending, কিছু cancelled।',
        columns: [
            { name: 'booking_id', type: 'integer', key: 'PK', note: 'প্রতিটা Booking এর নম্বর।' },
            { name: 'customer_id', type: 'integer', key: 'FK', references: 'customers', note: 'কে বুক করেছেন।' },
            { name: 'departure_id', type: 'integer', key: 'FK', references: 'departures', note: 'কোন তারিখের জন্য।' },
            { name: 'seats', type: 'smallint', note: 'কতগুলো সিট।' },
            { name: 'status', type: 'text', note: 'pending, confirmed অথবা cancelled।' },
            { name: 'total_bdt', type: 'numeric(10, 2)', note: 'মোট দাম, সিট গুণ ট্যুরের দাম।' },
            { name: 'booked_at', type: 'timestamptz', note: 'কখন বুক করেছেন।' },
        ],
    },
    {
        name: 'payments',
        about: 'টাকা দেওয়ার প্রতিটা চেষ্টা। একটা ফেরত দেওয়া হয়েছে, একটা ব্যর্থ হয়েছে।',
        columns: [
            { name: 'payment_id', type: 'integer', key: 'PK', note: 'প্রতিটা Payment এর নম্বর।' },
            { name: 'booking_id', type: 'integer', key: 'FK', references: 'bookings', note: 'কোন Booking এর টাকা।' },
            { name: 'amount_bdt', type: 'numeric(10, 2)', note: 'কত টাকা।' },
            { name: 'method', type: 'text', note: 'bkash, nagad, card অথবা bank।' },
            { name: 'status', type: 'text', note: 'paid, refunded অথবা failed।' },
            { name: 'paid_at', type: 'timestamptz', note: 'কখন।' },
        ],
    },
    {
        name: 'reviews',
        about: 'ট্যুর শেষে Customer এর রেটিং। একটা Booking এ সর্বোচ্চ একটা Review।',
        columns: [
            { name: 'review_id', type: 'integer', key: 'PK', note: 'প্রতিটা Review এর নম্বর।' },
            { name: 'booking_id', type: 'integer', key: 'UNIQUE FK', references: 'bookings', note: 'কোন Booking এর Review, একটার বেশি হতে পারে না।' },
            { name: 'rating', type: 'smallint', note: '১ থেকে ৫।' },
            { name: 'comment', type: 'text', note: 'মন্তব্য, না লিখলে NULL।' },
            { name: 'created_at', type: 'timestamptz', note: 'কখন লেখা।' },
        ],
    },
];
