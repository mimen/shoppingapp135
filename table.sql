DROP TABLE IF EXISTS states CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS new_orders CASCADE;
DROP TABLE IF EXISTS product_headers CASCADE;
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS state_headers CASCADE;

CREATE TABLE analytics(
    id          SERIAL PRIMARY KEY,
    state_id    INTEGER REFERENCES states (id) NOT NULL, 
    product_id  INTEGER REFERENCES products (id) NOT NULL, 
    total       FLOAT NOT NULL
);

CREATE TABLE product_headers( 
    id          SERIAL PRIMARY KEY, 
    product     TEXT NOT NULL, 
    product_id  INTEGER REFERENCES products (id) NOT NULL,  
    category_id INTEGER REFERENCES categories (id) NOT NULL,  
    total       FLOAT NOT NULL 
);

CREATE TABLE state_headers( 
    id          SERIAL PRIMARY KEY,  
    state       TEXT NOT NULL, 
    state_id    INTEGER REFERENCES states (id) NOT NULL,  
    category_id INTEGER REFERENCES categories (id) NOT NULL,  
    total       FLOAT NOT NULL 
);

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

CREATE TABLE new_orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id) NOT NULL,
    product_id INTEGER REFERENCES products (id) NOT NULL,
    quantity INTEGER NOT NULL,
    price FLOAT NOT NULL CHECK (price >= 0),
    is_cart BOOLEAN NOT NULL
);


CREATE INDEX index_orders_productid ON orders(product_id);
CREATE INDEX index_orders_userid ON orders(user_id);

CREATE INDEX index_users_stateid ON users(state_id);

CREATE INDEX index_norders_pid ON new_orders(product_id);
CREATE INDEX index_norders_uid ON new_orders(user_id);

CREATE INDEX index_products_cid ON products(category_id);

CREATE INDEX pheaders_cid ON orders(category_id);
CREATE INDEX pheaders_pid ON orders(product_id);

CREATE INDEX sheaders_cid ON orders(category_id);
CREATE INDEX sheaders_sid ON orders(state_id);

CREATE INDEX analytics_sid ON orders(state_id);
CREATE INDEX analytics_pid ON orders(product_id);