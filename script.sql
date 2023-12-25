--create extension if not exists "uuid-ossp";

CREATE TABLE carts (
	id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	user_id uuid NOT NULL,
	created_at date NOT NULL DEFAULT current_date,
	updated_at date NOT NULL DEFAULT NULL,
	status varchar(8) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'ORDERED'))
);
--DROP TABLE IF EXISTS carts;

CREATE TABLE cart_items (
	cart_id uuid NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
	product_id uuid NOT NULL,
	count integer,
  	PRIMARY KEY (cart_id, product_id)
);
--DROP TABLE IF EXISTS cart_items;

CREATE TABLE users (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  password VARCHAR(255) NOT NULL
);

--DROP TABLE IF EXISTS users;

CREATE TABLE orders (
	id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	user_id uuid NOT null REFERENCES users(id) ON DELETE NO ACTION,
	cart_id uuid NOT NULL REFERENCES carts(id) ON DELETE NO ACTION,
	payment JSONB,
	delivery JSONB,
	comments text,
	status varchar(10) CHECK (status IN ('OPEN', 'APPROVED', 'CONFIRMED', 'SENT', 'COMPLETED', 'CANCELLED')),
	total integer NOT NULL
);
--DROP TABLE IF EXISTS orders;

INSERT
	INTO
	carts (user_id,
	status)
VALUES
('00000000-0000-0000-0000-000000000000',
'OPEN'),
('00000000-0000-0000-0000-000000000001',
'ORDERED')

INSERT
	INTO
	cart_items (cart_id,
	product_id,
	count)
VALUES
('78fb1b7d-2205-4de7-ac63-1b09190ce075',
'1a2b3c4d-1234-5678-abcd-1234567890ab',
2),
('289740f9-c02e-4069-820d-a16a083ed334',
'3c4d5e6f-3456-7890-cdef-34567890abcd',
1),
('289740f9-c02e-4069-820d-a16a083ed334',
'2b3c4d5e-2345-6789-bcde-234567890abc',
3)

INSERT
	INTO
	orders (user_id,
	cart_id,
	payment,
	delivery,
	comments,
	status,
	total)
VALUES
  ('572990a5-56f0-4a1f-9d49-a260eb564c93',
'78fb1b7d-2205-4de7-ac63-1b09190ce075',
'{"type": "card", "creditCard": {"number": "1234567890123456", "expiry": "12/25"}}',
'{"type": "delivery", "address": {"street": "123 Random St", "city": "City 1", "zipcode": "12345"}}',
'Sample comment 1',
'OPEN',
2),
  ('572990a5-56f0-4a1f-9d49-a260eb564c93',
'78fb1b7d-2205-4de7-ac63-1b09190ce075',
'{"type": "paypal"}',
'{"type": "delivery", "address": {"street": "456 Elm St", "city": "City 2", "zipcode": "12346"}}',
'Sample comment 2',
'APPROVED',
3),
  ('e94f6481-aae7-4da0-aef1-0dfac9ac7ff5',
'289740f9-c02e-4069-820d-a16a083ed334',
'{"type": "cash"}',
'{"type": "delivery", "address": {"street": "789 Oak St", "city": "City 3", "zipcode": "12347"}}',
'Sample comment 3',
'SENT',
1);

INSERT INTO users (name, email, password)
VALUES
  ('Will Smith', 'will@example.com', 'user123'),
  ('Johnny Depp', 'johnny@example.com', 'user456');