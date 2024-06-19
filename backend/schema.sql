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

-- -- Inserting into users table
-- INSERT
--     OR IGNORE INTO users (username, password, email, age)
-- VALUES
--     ('user3', '1234', 'user3@mysite.com', 30),
--     ('user4', '1234', 'user4@mysite.com', 25),
--     ('user5', '1234', 'user5@mysite.com', 40);
-- -- Inserting into categories table
INSERT
    OR IGNORE INTO categories (category_name)
VALUES
    ('LifeStyle'),
    ('Fashion'),
    ('Tech'),
    ('Cars');

-- -- Inserting into shops table
-- INSERT
--     OR IGNORE INTO shops (name, description, owner_id)
-- VALUES
--     ('shop1', 'Home shop', 2),
--     ('shop2', 'Outdoor equipment ', 1),
--     ('shop3', 'Beauty  store', 3),
--     ('Shop4', 'Home goods store', 2),
--     ('Shop5', 'Outdoor equipment store', 1),
--     ('Shop6', 'Beauty products store', 3);
-- -- Inserting into managers table
-- INSERT
--     OR IGNORE INTO managers (manager_id, shop_id)
-- VALUES
--     (1, 4),
--     (2, 5),
--     (3, 6);
-- -- Inserting into products table
-- INSERT
--     OR IGNORE INTO products (
--         name,
--         description,
--         shop_id,
--         price,
--         amount,
--         maximum_discount
--     )
-- VALUES
--     (
--         'Product1',
--         'Home decoration item',
--         4,
--         40,
--         150,
--         10
--     ),
--     (
--         'Product2',
--         'Home decoration item',
--         4,
--         40,
--         150,
--         10
--     ),
--     (
--         'Product3',
--         'Home decoration item',
--         4,
--         40,
--         150,
--         10
--     ),
--     (
--         'Product4',
--         'Home decoration item',
--         4,
--         40,
--         150,
--         10
--     ),
--     ('Product5', 'Outdoor tent', 5, 200, 30, NULL),
--     ('Product6', 'Beauty face cream', 6, 25, 100, 5);
-- -- Inserting into addresses table
-- INSERT
--     OR IGNORE INTO addresses (address, city, country, user_id)
-- VALUES
--     ('321 Pine St', 'San Francisco', 'USA', 1),
--     ('654 Cedar St', 'Seattle', 'USA', 2),
--     ('Eliakim 55 b', 'Eliakim', 'Israel', 1),
--     ('654 Cedar St', 'Seattle', 'USA', 2),
--     ('987 Birch St', 'Miami', 'USA', 3);
-- -- Inserting into products_categories table
-- INSERT
--     OR IGNORE INTO products_categories (product_id, category_id)
-- VALUES
--     (1, 1),
--     (2, 2),
--     (3, 3),
--     (1, 2),
--     (4, 2),
--     (2, 3);
-- -- Inserting into shops_categories table
-- INSERT
--     OR IGNORE INTO shops_categories (shop_id, category_id)
-- VALUES
--     (4, 1),
--     (4, 3),
--     (5, 2),
--     (5, 3),
--     (6, 3),
--     (6, 1);
-- -- Inserting into discounts_products table
-- INSERT
--     OR IGNORE INTO discounts_products (
--         product_id,
--         discount_code,
--         discount,
--         expiration_date,
--         minimum_amount,
--         allow_others
--     )
-- VALUES
--     (1, 'ASI15', 15, '2024-06-10', 50, true),
--     (2, 'SUMMER20', 20, '2024-07-15', 1, false),
--     (3, 'FALL10', 10, '2024-05-20', 100, true),
--     (4, 'SPRING25', 25, '2024-08-01', 150, true),
--     (5, 'WINTER12', 12, '2024-09-01', 200, false);
-- -- Inserting into discounts_shops table
-- INSERT
--     OR IGNORE INTO discounts_shops (
--         shop_id,
--         discount_code,
--         discount,
--         expiration_date,
--         minimum_amount,
--         allow_others
--     )
-- VALUES
--     (1, 'SHOP25', 25, '2024-06-10', 100, true),
--     (2, 'BIGSALE30', 30, '2024-07-15', 200, false),
--     (3, 'SAVINGS20', 20, '2024-05-20', 150, true),
--     (4, 'MAYSALE35', 35, '2024-08-01', 200, true),
--     (5, 'EARLYBIRD15', 15, '2024-09-01', 250, false);