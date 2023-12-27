--create extension if not exists "uuid-ossp";

CREATE TABLE carts (
	id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	user_id uuid NOT null REFERENCES users(id) ON DELETE NO ACTION,
	created_at date NOT NULL DEFAULT current_date,
	updated_at date DEFAULT NULL,
	status varchar(8) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'ORDERED'))
);
--DROP TABLE IF EXISTS carts;

CREATE TABLE cart_items (
	id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	cart_id uuid NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
	product_id uuid NOT null REFERENCES products(id) ON DELETE NO ACTION,
	count integer
);
--DROP TABLE IF EXISTS cart_items;

create table users (
  id UUID not null default uuid_generate_v4() primary key,
  name VARCHAR(255) not null,
  email VARCHAR(255),
  password VARCHAR(255) not null
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

CREATE TABLE products (
	id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	description text,
	price integer
);
--DROP TABLE IF EXISTS products;



INSERT
	INTO
	carts (user_id,
	status)
VALUES
('4bac85bf-32a4-4724-b900-590d23791b92',
'OPEN'),
('5786858a-c322-4b1f-bf98-e45e8c76dde1',
'ORDERED')

INSERT
	INTO
	cart_items (cart_id,
	product_id,
	count)
VALUES
('90f818ad-c559-48d5-84e1-78dd76b09247',
'49c71d7c-d3f7-4df6-a461-0469d3e8132c',
2),
('7418507f-feab-4b90-bc4a-22f5032e987e',
'90c6c6c1-7354-4731-9e78-56b5f665ac29',
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
  ('4bac85bf-32a4-4724-b900-590d23791b92',
'90f818ad-c559-48d5-84e1-78dd76b09247',
'{"type": "card", "creditCard": {"number": "1234567890123456", "expiry": "12/25"}}',
'{"type": "delivery", "address": {"street": "123 Random St", "city": "City 1", "zipcode": "12345"}}',
'Sample comment 1',
'OPEN',
2),
  ('4bac85bf-32a4-4724-b900-590d23791b92',
'90f818ad-c559-48d5-84e1-78dd76b09247',
'{"type": "paypal"}',
'{"type": "delivery", "address": {"street": "456 Elm St", "city": "City 2", "zipcode": "12346"}}',
'Sample comment 2',
'APPROVED',
3),
  ('5786858a-c322-4b1f-bf98-e45e8c76dde1',
'7418507f-feab-4b90-bc4a-22f5032e987e',
'{"type": "cash"}',
'{"type": "delivery", "address": {"street": "789 Oak St", "city": "City 3", "zipcode": "12347"}}',
'Sample comment 3',
'SENT',
1);

INSERT INTO users (name, email, password)
VALUES
  ('Will Smith', 'will@example.com', 'user123'),
  ('Johnny Depp', 'johnny@example.com', 'user456');
  
INSERT
	INTO
	products (title,
	description,
	price)
VALUES
('product1',
'description1',
2),
('product2',
'description2',
1),
('product3',
'description3',
3)