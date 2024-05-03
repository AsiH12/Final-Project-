CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT,
    age INTEGER,
    role TEXT NOT NULL DEFAULT 'user'
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
    discount INTEGER NOT NULL,
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

-- Inserting into users table
INSERT
    OR IGNORE INTO users (username, password, email, age, role)
VALUES
    ('user3', '1234', 'user3@mysite.com', 30, 'user'),
    ('user4', '1234', 'user4@mysite.com', 25, 'user'),
    ('user5', '1234', 'user5@mysite.com', 40, 'user');

-- Inserting into categories table
INSERT
    OR IGNORE INTO categories (category_name)
VALUES
    ('Home'),
    ('Outdoor'),
    ('Beauty');

-- Inserting into shops table
INSERT
    OR IGNORE INTO shops (name, description, owner_id)
VALUES
    ('Shop4', 'Home goods store', 2),
    ('Shop5', 'Outdoor equipment store', 1),
    ('Shop6', 'Beauty products store', 3);

-- Inserting into managers table
INSERT
    OR IGNORE INTO managers (manager_id, shop_id)
VALUES
    (1, 4),
    (2, 5),
    (3, 6);

-- Inserting into products table
INSERT
    OR IGNORE INTO products (
        name,
        description,
        shop_id,
        price,
        amount,
        maximum_discount
    )
VALUES
    (
        'Product4',
        'Home decoration item',
        4,
        40,
        150,
        10
    ),
    (
        'Product5',
        'Outdoor tent',
        5,
        200,
        30,
        NULL
    ),
    (
        'Product6',
        'Beauty face cream',
        6,
        25,
        100,
        5
    );

-- Inserting into discounts_products table
INSERT
    OR IGNORE INTO discounts_products (
        product_id,
        discount,
        expiration_date,
        minimum_amount,
        allow_others
    )
VALUES
    (4, '10%', '2024-06-01', 100, true),
    (5, '20%', '2024-07-01', 1, false),
    (6, '5%', '2024-05-01', 50, true);

-- Inserting into discounts_shops table
INSERT
    OR IGNORE INTO discounts_shops (
        shop_id,
        discount,
        expiration_date,
        minimum_amount,
        allow_others
    )
VALUES
    (4, '15%', '2024-06-01', 150, true),
    (5, '30%', '2024-07-01', 300, false),
    (6, '10%', '2024-05-01', 200, true);

-- Inserting into addresses table
INSERT
    OR IGNORE INTO addresses (address, city, country, user_id)
VALUES
    ('321 Pine St', 'San Francisco', 'USA', 4),
    ('654 Cedar St', 'Seattle', 'USA', 5),
    ('987 Birch St', 'Miami', 'USA', 6);

-- Inserting into purchase_history table
INSERT
    OR IGNORE INTO purchase_history (
        product_id,
        shop_id,
        user_id,
        quantity,
        product_price,
        purchase_date,
        city,
        country,
        shipping_address,
        shipping_completed,
        discount
    )
VALUES
    (
        4,
        4,
        5,
        1,
        40,
        '2024-04-13',
        'Seattle',
        'USA',
        '654 Cedar St',
        true,
        10
    ),
    (
        5,
        5,
        6,
        2,
        200,
        '2024-04-14',
        'Miami',
        'USA',
        '987 Birch St',
        true,
        20
    ),
    (
        6,
        6,
        4,
        3,
        25,
        '2024-04-15',
        'San Francisco',
        'USA',
        '321 Pine St',
        true,
        2
    );

-- Inserting into products_categories table
INSERT
    OR IGNORE INTO products_categories (product_id, category_id)
VALUES
    (4, 1),
    -- Home
    (5, 2),
    -- Outdoor
    (6, 3);

-- Beauty
-- Inserting into shops_categories table
INSERT
    OR IGNORE INTO shops_categories (shop_id, category_id)
VALUES
    (4, 1),
    -- Home
    (4, 3),
    -- Beauty
    (5, 2),
    -- Outdoor
    (5, 3),
    -- Beauty
    (6, 3),
    -- Beauty
    (6, 1);

-- Inserting into discounts_products table
INSERT
    OR IGNORE INTO discounts_products (
        product_id,
        discount_code,
        discount,
        expiration_date,
        minimum_amount,
        allow_others
    )
VALUES
    (1, 'ASI15', 15, '2024-06-10', 50, true),
    (2, 'SUMMER20', 20, '2024-07-15', 1, false),
    (3, 'FALL10', 10, '2024-05-20', 100, true),
    (4, 'SPRING25', 25, '2024-08-01', 150, true),
    (5, 'WINTER12', 12, '2024-09-01', 200, false);

-- Inserting into discounts_shops table
INSERT
    OR IGNORE INTO discounts_shops (
        shop_id,
        discount_code,
        discount,
        expiration_date,
        minimum_amount,
        allow_others
    )
VALUES
    (1, 'SHOP25', 25, '2024-06-10', 100, true),
    (2, 'BIGSALE30', 30, '2024-07-15', 200, false),
    (3, 'SAVINGS20', 20, '2024-05-20', 150, true),
    (4, 'MAYSALE35', 35, '2024-08-01', 200, true),
    (5, 'EARLYBIRD15', 15, '2024-09-01', 250, false);