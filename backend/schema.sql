CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT,
    age INTEGER
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY NOT NULL,
    category_name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS shops (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    owner_id INTEGER NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    shop_id INTEGER NOT NULL,
    price INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    maximum_discount INTEGER,
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);

CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY NOT NULL,
    product_id INTEGER UNIQUE NOT NULL,
    image BLOB NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS managers (
    id INTEGER PRIMARY KEY NOT NULL,
    manager_id INTEGER NOT NULL,
    shop_id INTEGER NOT NULL,
    FOREIGN KEY (manager_id) REFERENCES users(id),
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);

CREATE TABLE IF NOT EXISTS discounts_products (
    id INTEGER PRIMARY KEY NOT NULL,
    product_id INTEGER NOT NULL,
    discount_code TEXT UNIQUE NOT NULL,
    discount INTEGER NOT NULL,
    expiration_date DATE NOT NULL,
    minimum_amount INTEGER NOT NULL,
    allow_others BOOLEAN NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS discounts_shops (
    id INTEGER PRIMARY KEY NOT NULL,
    shop_id INTEGER NOT NULL,
    discount_code TEXT UNIQUE NOT NULL,
    discount INTEGER NOT NULL,
    expiration_date DATE NOT NULL,
    minimum_amount INTEGER NOT NULL,
    allow_others BOOLEAN NOT NULL,
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);

CREATE TABLE IF NOT EXISTS addresses (
    id INTEGER PRIMARY KEY NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS purchase_history (
    id INTEGER PRIMARY KEY NOT NULL,
    product_id INTEGER NOT NULL,
    shop_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    product_price INTEGER NOT NULL,
    purchase_date DATE,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_completed BOOLEAN NOT NULL,
    total_price INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (shop_id) REFERENCES shops(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS products_categories (
    id INTEGER PRIMARY KEY NOT NULL,
    product_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS shops_categories (
    id INTEGER PRIMARY KEY NOT NULL,
    shop_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (shop_id) REFERENCES shops(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

INSERT
    OR IGNORE INTO categories (category_name)
VALUES
    ('LifeStyle'),
    ('Fashion'),
    ('Tech'),
    ('Cars');