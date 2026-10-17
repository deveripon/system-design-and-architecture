-- Island Tours sample database for the SQL & Database Mastery track, MySQL 8.4 version.
-- Same tables and rows as island-tours.sql (the PostgreSQL original), translated:
--   identity -> AUTO_INCREMENT, text -> VARCHAR(255), numeric -> DECIMAL,
--   timestamptz -> DATETIME (Dhaka local time, MySQL DATETIME stores no time zone),
--   inline REFERENCES -> table level FOREIGN KEY (MySQL ignores the inline form).
-- Safe to run again: it drops and recreates every table.
-- Every person, email and phone number here is made up.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS reviews, payments, bookings, departures, tours, guides, destinations, customers;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE destinations (
  destination_id INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(255) NOT NULL UNIQUE,
  region         VARCHAR(255) NOT NULL,
  kind           VARCHAR(255) NOT NULL
);

CREATE TABLE guides (
  guide_id  INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone     VARCHAR(255) NOT NULL,
  language  VARCHAR(255) NOT NULL,
  hired_on  DATE NOT NULL
);

CREATE TABLE tours (
  tour_id        INT AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(255) NOT NULL,
  destination_id INT NOT NULL,
  guide_id       INT,
  duration_days  SMALLINT NOT NULL CHECK (duration_days > 0),
  price_bdt      DECIMAL(10, 2) NOT NULL CHECK (price_bdt >= 0),
  max_seats      SMALLINT NOT NULL CHECK (max_seats > 0),
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (destination_id) REFERENCES destinations (destination_id),
  FOREIGN KEY (guide_id) REFERENCES guides (guide_id)
);

CREATE TABLE customers (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name   VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  phone       VARCHAR(255),
  city        VARCHAR(255) NOT NULL,
  country     VARCHAR(255) NOT NULL DEFAULT 'Bangladesh',
  joined_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departures (
  departure_id INT AUTO_INCREMENT PRIMARY KEY,
  tour_id      INT NOT NULL,
  starts_on    DATE NOT NULL,
  seats_left   SMALLINT NOT NULL CHECK (seats_left >= 0),
  FOREIGN KEY (tour_id) REFERENCES tours (tour_id)
);

CREATE TABLE bookings (
  booking_id   INT AUTO_INCREMENT PRIMARY KEY,
  customer_id  INT NOT NULL,
  departure_id INT NOT NULL,
  seats        SMALLINT NOT NULL CHECK (seats > 0),
  status       VARCHAR(255) NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  total_bdt    DECIMAL(10, 2) NOT NULL,
  booked_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers (customer_id),
  FOREIGN KEY (departure_id) REFERENCES departures (departure_id)
);

CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  amount_bdt DECIMAL(10, 2) NOT NULL,
  method     VARCHAR(255) NOT NULL CHECK (method IN ('bkash', 'nagad', 'card', 'bank')),
  status     VARCHAR(255) NOT NULL CHECK (status IN ('paid', 'refunded', 'failed')),
  paid_at    DATETIME NOT NULL,
  FOREIGN KEY (booking_id) REFERENCES bookings (booking_id)
);

CREATE TABLE reviews (
  review_id  INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL UNIQUE,
  rating     SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    VARCHAR(255),
  created_at DATETIME NOT NULL,
  FOREIGN KEY (booking_id) REFERENCES bookings (booking_id)
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
  ('Saint Martin Island Escape', 1, 1, 3, 12500.00, 20, true, '2025-10-01 10:00:00'),
  ('Cox''s Bazar Beach Weekend', 2, 2, 2, 8500.00, 30, true, '2025-10-01 10:00:00'),
  ('Sundarbans Mangrove Cruise', 3, 3, 3, 18000.00, 16, true, '2025-10-05 10:00:00'),
  ('Sajek Valley Cloud Trip', 4, 1, 2, 9500.00, 18, true, '2025-10-12 10:00:00'),
  ('Bandarban Hill Trek', 5, 4, 4, 14000.00, 12, true, '2025-11-01 10:00:00'),
  ('Sylhet Tea Garden Tour', 6, 2, 2, 7800.00, 25, true, '2025-11-20 10:00:00'),
  ('Ratargul Swamp Boat Day', 6, NULL, 1, 3500.00, 15, true, '2026-08-15 10:00:00'),
  ('Saint Martin Luxury Stay', 1, 4, 4, 32000.00, 10, false, '2026-09-01 10:00:00'),
  ('Cox''s Bazar Family Package', 2, 3, 3, 15500.00, 24, true, '2026-10-01 10:00:00');

INSERT INTO customers (full_name, email, phone, city, country, joined_at) VALUES
  ('Rahim Uddin', 'rahim.uddin@mail.example', '+8801000000101', 'Dhaka', 'Bangladesh', '2025-11-02 10:12:00'),
  ('Nusrat Jahan', 'nusrat.jahan@mail.example', '+8801000000102', 'Dhaka', 'Bangladesh', '2025-11-20 21:40:00'),
  ('Tanvir Ahmed', 'tanvir.ahmed@mail.example', NULL, 'Chattogram', 'Bangladesh', '2025-12-05 09:05:00'),
  ('Farhana Akter', 'farhana.akter@mail.example', '+8801000000104', 'Sylhet', 'Bangladesh', '2025-12-18 18:30:00'),
  ('Sabbir Hossain', 'sabbir.hossain@mail.example', '+8801000000105', 'Rajshahi', 'Bangladesh', '2026-01-03 11:00:00'),
  ('Mitu Rahman', 'mitu.rahman@mail.example', NULL, 'Dhaka', 'Bangladesh', '2026-01-09 23:15:00'),
  ('Arif Chowdhury', 'arif.chowdhury@mail.example', '+8801000000107', 'Khulna', 'Bangladesh', '2026-01-21 08:45:00'),
  ('Sumaiya Islam', 'sumaiya.islam@mail.example', '+8801000000108', 'Dhaka', 'Bangladesh', '2026-02-02 16:20:00'),
  ('Priya Sharma', 'priya.sharma@mail.example', NULL, 'Kolkata', 'India', '2026-02-14 13:00:00'),
  ('Aiman Zulkifli', 'aiman.zulkifli@mail.example', NULL, 'Kuala Lumpur', 'Malaysia', '2026-03-01 07:55:00'),
  ('Oliver Bennett', 'oliver.bennett@mail.example', NULL, 'London', 'United Kingdom', '2026-03-15 15:10:00'),
  ('Kamal Hasan', 'kamal.hasan@mail.example', '+8801000000112', 'Barishal', 'Bangladesh', '2026-06-10 12:00:00'),
  ('Shuvo Das', 'shuvo.das@mail.example', '+8801000000113', 'Dhaka', 'Bangladesh', '2026-08-22 19:25:00'),
  ('Lamia Haque', 'lamia.haque@mail.example', '+8801000000114', 'Chattogram', 'Bangladesh', '2026-09-30 10:40:00'),
  ('Imran Kabir', 'imran.kabir@mail.example', '+8801000000115', 'Dhaka', 'Bangladesh', '2026-10-05 22:05:00');

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
  (1, 1, 2, 'confirmed', 25000.00, '2025-12-20 10:15:00'),
  (2, 1, 4, 'confirmed', 50000.00, '2025-12-28 20:02:00'),
  (3, 2, 1, 'confirmed', 12500.00, '2026-01-10 09:30:00'),
  (4, 3, 3, 'confirmed', 25500.00, '2026-01-05 18:45:00'),
  (5, 3, 2, 'cancelled', 17000.00, '2026-01-06 12:10:00'),
  (6, 4, 2, 'confirmed', 36000.00, '2026-01-25 22:40:00'),
  (7, 4, 1, 'confirmed', 18000.00, '2026-01-28 08:05:00'),
  (1, 5, 2, 'confirmed', 19000.00, '2026-02-20 11:20:00'),
  (8, 6, 2, 'confirmed', 28000.00, '2026-03-01 16:35:00'),
  (9, 6, 1, 'confirmed', 14000.00, '2026-03-02 14:00:00'),
  (10, 7, 2, 'confirmed', 15600.00, '2026-03-25 07:50:00'),
  (11, 2, 2, 'cancelled', 25000.00, '2026-01-30 15:30:00'),
  (2, 8, 2, 'confirmed', 25000.00, '2026-09-15 21:10:00'),
  (12, 8, 4, 'pending', 50000.00, '2026-10-01 12:25:00'),
  (13, 10, 3, 'confirmed', 25500.00, '2026-09-20 19:45:00'),
  (14, 11, 2, 'confirmed', 36000.00, '2026-10-02 10:05:00'),
  (1, 11, 2, 'pending', 36000.00, '2026-10-08 09:15:00'),
  (6, 12, 1, 'cancelled', 9500.00, '2026-09-28 23:30:00'),
  (11, 13, 2, 'confirmed', 28000.00, '2026-10-04 13:40:00'),
  (9, 14, 2, 'pending', 15600.00, '2026-10-10 17:20:00'),
  (4, 15, 3, 'confirmed', 10500.00, '2026-10-11 18:00:00'),
  (3, 9, 1, 'confirmed', 12500.00, '2026-10-12 08:30:00'),
  (8, 10, 5, 'confirmed', 42500.00, '2026-10-13 20:55:00'),
  (13, 14, 2, 'pending', 15600.00, '2026-10-14 11:05:00');

INSERT INTO payments (booking_id, amount_bdt, method, status, paid_at) VALUES
  (1, 25000.00, 'bkash', 'paid', '2025-12-20 10:21:00'),
  (2, 50000.00, 'card', 'paid', '2025-12-28 20:05:00'),
  (3, 12500.00, 'nagad', 'paid', '2026-01-10 09:42:00'),
  (4, 25500.00, 'bkash', 'paid', '2026-01-05 18:49:00'),
  (5, 17000.00, 'bkash', 'refunded', '2026-01-06 12:19:00'),
  (6, 36000.00, 'card', 'paid', '2026-01-25 22:42:00'),
  (7, 18000.00, 'bank', 'paid', '2026-01-29 08:05:00'),
  (8, 19000.00, 'bkash', 'paid', '2026-02-20 11:25:00'),
  (9, 28000.00, 'nagad', 'paid', '2026-03-01 16:43:00'),
  (10, 14000.00, 'card', 'paid', '2026-03-02 14:03:00'),
  (11, 15600.00, 'card', 'paid', '2026-03-25 07:54:00'),
  (13, 25000.00, 'bkash', 'paid', '2026-09-15 21:17:00'),
  (14, 50000.00, 'bkash', 'failed', '2026-10-01 12:27:00'),
  (15, 25500.00, 'card', 'paid', '2026-09-20 19:50:00'),
  (16, 36000.00, 'bank', 'paid', '2026-10-03 11:05:00'),
  (19, 28000.00, 'card', 'paid', '2026-10-04 13:46:00'),
  (21, 10500.00, 'nagad', 'paid', '2026-10-11 18:10:00'),
  (22, 12500.00, 'bkash', 'paid', '2026-10-12 08:34:00'),
  (23, 42500.00, 'card', 'paid', '2026-10-13 20:58:00');

INSERT INTO reviews (booking_id, rating, comment, created_at) VALUES
  (1, 5, 'Crystal clear water and a very caring guide.', '2026-01-20 20:00:00'),
  (2, 4, 'Lovely trip, the ship back was crowded.', '2026-01-21 20:00:00'),
  (3, 5, 'Worth every taka.', '2026-02-16 20:00:00'),
  (4, 4, NULL, '2026-01-26 20:00:00'),
  (6, 5, 'Saw a crocodile on the second day!', '2026-02-09 20:00:00'),
  (7, 3, 'The boat was two hours late.', '2026-02-10 20:00:00'),
  (8, 4, 'Sunrise above the clouds is unreal.', '2026-03-09 20:00:00'),
  (9, 5, NULL, '2026-03-25 20:00:00'),
  (10, 2, 'Too much walking for me.', '2026-03-24 20:00:00'),
  (11, 4, 'Tea gardens were beautiful, food was average.', '2026-04-13 20:00:00');
