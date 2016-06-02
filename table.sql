DROP TABLE IF EXISTS states CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE states (
    id    SERIAL PRIMARY KEY,
    name  TEXT NOT NULL UNIQUE
);

CREATE TABLE users (
    id    SERIAL PRIMARY KEY,
    name  char(50) NOT NULL UNIQUE,
    role  char(8) NOT NULL,
    age   INTEGER NOT NULL,
    state_id INTEGER REFERENCES states (id) NOT NULL
);

CREATE TABLE categories (
    id  SERIAL PRIMARY KEY,
    name  char(50) NOT NULL UNIQUE,
    description  char(50) NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name char(50) NOT NULL,
    sku CHAR(10) NOT NULL UNIQUE,
    category_id INTEGER REFERENCES categories (id) NOT NULL,
    price FLOAT NOT NULL CHECK (price >= 0),
    is_delete BOOLEAN NOT NULL
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id) NOT NULL,
    product_id INTEGER REFERENCES products (id) NOT NULL,
    quantity INTEGER NOT NULL,
    price FLOAT NOT NULL CHECK (price >= 0),
    is_cart BOOLEAN NOT NULL
);



-- similar products indices
CREATE INDEX index_products_name ON products(name);
CREATE INDEX index_orders_userid ON orders(user_id);

-- analytics indices
CREATE INDEX index_products_price ON products(price);

