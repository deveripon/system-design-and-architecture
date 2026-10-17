-- Island Tours sample database for the SQL & Database Mastery track.
-- PostgreSQL. Safe to run again: it drops and recreates every table.
-- Every person, email and phone number here is made up.

DROP TABLE IF EXISTS reviews, payments, bookings, departures, tours, guides, destinations, customers CASCADE;

CREATE TABLE destinations (
  destination_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name           text NOT NULL UNIQUE,
  region         text NOT NULL,
  kind           text NOT NULL
);

CREATE TABLE guides (
  guide_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name text NOT NULL,
  phone     text NOT NULL,
  language  text NOT NULL,
  hired_on  date NOT NULL
);

CREATE TABLE tours (
  tour_id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title          text NOT NULL,
  destination_id integer NOT NULL REFERENCES destinations (destination_id),
  guide_id       integer REFERENCES guides (guide_id),
  duration_days  smallint NOT NULL CHECK (duration_days > 0),
  price_bdt      numeric(10, 2) NOT NULL CHECK (price_bdt >= 0),
  max_seats      smallint NOT NULL CHECK (max_seats > 0),
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE customers (
  customer_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name   text NOT NULL,
  email       text NOT NULL UNIQUE,
  phone       text,
  city        text NOT NULL,
  country     text NOT NULL DEFAULT 'Bangladesh',
  joined_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE departures (
  departure_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tour_id      integer NOT NULL REFERENCES tours (tour_id),
  starts_on    date NOT NULL,
  seats_left   smallint NOT NULL CHECK (seats_left >= 0)
);

CREATE TABLE bookings (
  booking_id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id  integer NOT NULL REFERENCES customers (customer_id),
  departure_id integer NOT NULL REFERENCES departures (departure_id),
  seats        smallint NOT NULL CHECK (seats > 0),
  status       text NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  total_bdt    numeric(10, 2) NOT NULL,
  booked_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE payments (
  payment_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_id integer NOT NULL REFERENCES bookings (booking_id),
  amount_bdt numeric(10, 2) NOT NULL,
  method     text NOT NULL CHECK (method IN ('bkash', 'nagad', 'card', 'bank')),
  status     text NOT NULL CHECK (status IN ('paid', 'refunded', 'failed')),
  paid_at    timestamptz NOT NULL
);

CREATE TABLE reviews (
  review_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_id integer NOT NULL UNIQUE REFERENCES bookings (booking_id),
  rating     smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    text,
  created_at timestamptz NOT NULL
);

INSERT INTO destinations (name, region, kind) VALUES
  ('Saint Martin''s Island', 'Chattogram', 'island'),
  ('Cox''s Bazar', 'Chattogram', 'beach'),
  ('Sundarbans', 'Khulna', 'forest'),
  ('Sajek Valley', 'Chattogram', 'hills'),
  ('Bandarban', 'Chattogram', 'hills'),
  ('Sylhet', 'Sylhet', 'tea_garden'),
  ('Kuakata', 'Barishal', 'beach');

INSERT INTO guides (full_name, phone, language, hired_on) VALUES
  ('Jamal Hossain', '+8801000000201', 'Bangla', '2019-03-01'),
  ('Shirin Akter', '+8801000000202', 'English', '2020-07-15'),
  ('Rubel Mia', '+8801000000203', 'Bangla', '2021-11-10'),
  ('Ayesha Siddiqua', '+8801000000204', 'English', '2022-02-01'),
  ('Nazmul Karim', '+8801000000205', 'Bangla', '2024-09-01');

INSERT INTO tours (title, destination_id, guide_id, duration_days, price_bdt, max_seats, is_active, created_at) VALUES
  ('Saint Martin Island Escape', 1, 1, 3, 12500.00, 20, true, '2025-10-01 10:00:00+06'),
  ('Cox''s Bazar Beach Weekend', 2, 2, 2, 8500.00, 30, true, '2025-10-01 10:00:00+06'),
  ('Sundarbans Mangrove Cruise', 3, 3, 3, 18000.00, 16, true, '2025-10-05 10:00:00+06'),
  ('Sajek Valley Cloud Trip', 4, 1, 2, 9500.00, 18, true, '2025-10-12 10:00:00+06'),
  ('Bandarban Hill Trek', 5, 4, 4, 14000.00, 12, true, '2025-11-01 10:00:00+06'),
  ('Sylhet Tea Garden Tour', 6, 2, 2, 7800.00, 25, true, '2025-11-20 10:00:00+06'),
  ('Ratargul Swamp Boat Day', 6, NULL, 1, 3500.00, 15, true, '2026-08-15 10:00:00+06'),
  ('Saint Martin Luxury Stay', 1, 4, 4, 32000.00, 10, false, '2026-09-01 10:00:00+06'),
  ('Cox''s Bazar Family Package', 2, 3, 3, 15500.00, 24, true, '2026-10-01 10:00:00+06');

INSERT INTO customers (full_name, email, phone, city, country, joined_at) VALUES
  ('Rahim Uddin', 'rahim.uddin@mail.example', '+8801000000101', 'Dhaka', 'Bangladesh', '2025-11-02 10:12:00+06'),
  ('Nusrat Jahan', 'nusrat.jahan@mail.example', '+8801000000102', 'Dhaka', 'Bangladesh', '2025-11-20 21:40:00+06'),
  ('Tanvir Ahmed', 'tanvir.ahmed@mail.example', NULL, 'Chattogram', 'Bangladesh', '2025-12-05 09:05:00+06'),
  ('Farhana Akter', 'farhana.akter@mail.example', '+8801000000104', 'Sylhet', 'Bangladesh', '2025-12-18 18:30:00+06'),
  ('Sabbir Hossain', 'sabbir.hossain@mail.example', '+8801000000105', 'Rajshahi', 'Bangladesh', '2026-01-03 11:00:00+06'),
  ('Mitu Rahman', 'mitu.rahman@mail.example', NULL, 'Dhaka', 'Bangladesh', '2026-01-09 23:15:00+06'),
  ('Arif Chowdhury', 'arif.chowdhury@mail.example', '+8801000000107', 'Khulna', 'Bangladesh', '2026-01-21 08:45:00+06'),
  ('Sumaiya Islam', 'sumaiya.islam@mail.example', '+8801000000108', 'Dhaka', 'Bangladesh', '2026-02-02 16:20:00+06'),
  ('Priya Sharma', 'priya.sharma@mail.example', NULL, 'Kolkata', 'India', '2026-02-14 13:00:00+06'),
  ('Aiman Zulkifli', 'aiman.zulkifli@mail.example', NULL, 'Kuala Lumpur', 'Malaysia', '2026-03-01 07:55:00+06'),
  ('Oliver Bennett', 'oliver.bennett@mail.example', NULL, 'London', 'United Kingdom', '2026-03-15 15:10:00+06'),
  ('Kamal Hasan', 'kamal.hasan@mail.example', '+8801000000112', 'Barishal', 'Bangladesh', '2026-06-10 12:00:00+06'),
  ('Shuvo Das', 'shuvo.das@mail.example', '+8801000000113', 'Dhaka', 'Bangladesh', '2026-08-22 19:25:00+06'),
  ('Lamia Haque', 'lamia.haque@mail.example', '+8801000000114', 'Chattogram', 'Bangladesh', '2026-09-30 10:40:00+06'),
  ('Imran Kabir', 'imran.kabir@mail.example', '+8801000000115', 'Dhaka', 'Bangladesh', '2026-10-05 22:05:00+06');

INSERT INTO departures (tour_id, starts_on, seats_left) VALUES
  (1, '2026-01-15', 14),
  (1, '2026-02-12', 19),
  (2, '2026-01-23', 27),
  (3, '2026-02-05', 13),
  (4, '2026-03-06', 16),
  (5, '2026-03-19', 9),
  (6, '2026-04-10', 23),
  (1, '2026-11-20', 14),
  (1, '2026-12-18', 19),
  (2, '2026-11-27', 22),
  (3, '2026-12-04', 12),
  (4, '2026-12-11', 18),
  (5, '2027-01-08', 10),
  (6, '2026-11-14', 21),
  (7, '2026-11-21', 12),
  (8, '2027-02-14', 10);

INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt, booked_at) VALUES
  (1, 1, 2, 'confirmed', 25000.00, '2025-12-20 10:15:00+06'),
  (2, 1, 4, 'confirmed', 50000.00, '2025-12-28 20:02:00+06'),
  (3, 2, 1, 'confirmed', 12500.00, '2026-01-10 09:30:00+06'),
  (4, 3, 3, 'confirmed', 25500.00, '2026-01-05 18:45:00+06'),
  (5, 3, 2, 'cancelled', 17000.00, '2026-01-06 12:10:00+06'),
  (6, 4, 2, 'confirmed', 36000.00, '2026-01-25 22:40:00+06'),
  (7, 4, 1, 'confirmed', 18000.00, '2026-01-28 08:05:00+06'),
  (1, 5, 2, 'confirmed', 19000.00, '2026-02-20 11:20:00+06'),
  (8, 6, 2, 'confirmed', 28000.00, '2026-03-01 16:35:00+06'),
  (9, 6, 1, 'confirmed', 14000.00, '2026-03-02 14:00:00+06'),
  (10, 7, 2, 'confirmed', 15600.00, '2026-03-25 07:50:00+06'),
  (11, 2, 2, 'cancelled', 25000.00, '2026-01-30 15:30:00+06'),
  (2, 8, 2, 'confirmed', 25000.00, '2026-09-15 21:10:00+06'),
  (12, 8, 4, 'pending', 50000.00, '2026-10-01 12:25:00+06'),
  (13, 10, 3, 'confirmed', 25500.00, '2026-09-20 19:45:00+06'),
  (14, 11, 2, 'confirmed', 36000.00, '2026-10-02 10:05:00+06'),
  (1, 11, 2, 'pending', 36000.00, '2026-10-08 09:15:00+06'),
  (6, 12, 1, 'cancelled', 9500.00, '2026-09-28 23:30:00+06'),
  (11, 13, 2, 'confirmed', 28000.00, '2026-10-04 13:40:00+06'),
  (9, 14, 2, 'pending', 15600.00, '2026-10-10 17:20:00+06'),
  (4, 15, 3, 'confirmed', 10500.00, '2026-10-11 18:00:00+06'),
  (3, 9, 1, 'confirmed', 12500.00, '2026-10-12 08:30:00+06'),
  (8, 10, 5, 'confirmed', 42500.00, '2026-10-13 20:55:00+06'),
  (13, 14, 2, 'pending', 15600.00, '2026-10-14 11:05:00+06');

INSERT INTO payments (booking_id, amount_bdt, method, status, paid_at) VALUES
  (1, 25000.00, 'bkash', 'paid', '2025-12-20 10:21:00+06'),
  (2, 50000.00, 'card', 'paid', '2025-12-28 20:05:00+06'),
  (3, 12500.00, 'nagad', 'paid', '2026-01-10 09:42:00+06'),
  (4, 25500.00, 'bkash', 'paid', '2026-01-05 18:49:00+06'),
  (5, 17000.00, 'bkash', 'refunded', '2026-01-06 12:19:00+06'),
  (6, 36000.00, 'card', 'paid', '2026-01-25 22:42:00+06'),
  (7, 18000.00, 'bank', 'paid', '2026-01-29 08:05:00+06'),
  (8, 19000.00, 'bkash', 'paid', '2026-02-20 11:25:00+06'),
  (9, 28000.00, 'nagad', 'paid', '2026-03-01 16:43:00+06'),
  (10, 14000.00, 'card', 'paid', '2026-03-02 14:03:00+06'),
  (11, 15600.00, 'card', 'paid', '2026-03-25 07:54:00+06'),
  (13, 25000.00, 'bkash', 'paid', '2026-09-15 21:17:00+06'),
  (14, 50000.00, 'bkash', 'failed', '2026-10-01 12:27:00+06'),
  (15, 25500.00, 'card', 'paid', '2026-09-20 19:50:00+06'),
  (16, 36000.00, 'bank', 'paid', '2026-10-03 11:05:00+06'),
  (19, 28000.00, 'card', 'paid', '2026-10-04 13:46:00+06'),
  (21, 10500.00, 'nagad', 'paid', '2026-10-11 18:10:00+06'),
  (22, 12500.00, 'bkash', 'paid', '2026-10-12 08:34:00+06'),
  (23, 42500.00, 'card', 'paid', '2026-10-13 20:58:00+06');

INSERT INTO reviews (booking_id, rating, comment, created_at) VALUES
  (1, 5, 'Crystal clear water and a very caring guide.', '2026-01-20 20:00:00+06'),
  (2, 4, 'Lovely trip, the ship back was crowded.', '2026-01-21 20:00:00+06'),
  (3, 5, 'Worth every taka.', '2026-02-16 20:00:00+06'),
  (4, 4, NULL, '2026-01-26 20:00:00+06'),
  (6, 5, 'Saw a crocodile on the second day!', '2026-02-09 20:00:00+06'),
  (7, 3, 'The boat was two hours late.', '2026-02-10 20:00:00+06'),
  (8, 4, 'Sunrise above the clouds is unreal.', '2026-03-09 20:00:00+06'),
  (9, 5, NULL, '2026-03-25 20:00:00+06'),
  (10, 2, 'Too much walking for me.', '2026-03-24 20:00:00+06'),
  (11, 4, 'Tea gardens were beautiful, food was average.', '2026-04-13 20:00:00+06');
