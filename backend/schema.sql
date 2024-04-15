CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT,
    age INTEGER,
    role TEXT NOT NULL DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS shops (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL CHECK(category IN ('LifeStyle', 'Fashion', 'Tech')),
    owner_id INTEGER NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS managers (
    id INTEGER PRIMARY KEY NOT NULL,
    manager_id INTEGER NOT NULL,
    shop_id INTEGER NOT NULL,
    FOREIGN KEY (manager_id) REFERENCES users(id),
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('LifeStyle', 'Fashion', 'Tech')),
    shop_id INTEGER NOT NULL,
    price INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    maximum_discount INTEGER,
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);

CREATE TABLE IF NOT EXISTS discounts_products (
    id INTEGER PRIMARY KEY NOT NULL,
    product_id INTEGER NOT NULL,
    discount TEXT NOT NULL,
    expiration_date DATE NOT NULL,
    minimum_amount INTEGER NOT NULL,
    allow_others BOOLEAN NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS discounts_shops (
    id INTEGER PRIMARY KEY NOT NULL,
    shop_id INTEGER NOT NULL,
    discount TEXT NOT NULL,
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

-- Inserting into users table
INSERT INTO
    users (username, password, email, age, role)
VALUES
    (
        'admin2',
        '1234',
        'admin2@mysite.com',
        32,
        'admin'
    ),
    ('user2', '1234', 'user2@mysite.com', 28, 'user'),
    (
        'manager1',
        '1234',
        'manager1@mysite.com',
        35,
        'manager'
    );

-- Inserting into shops table
INSERT INTO
    shops (name, description, category, owner_id)
VALUES
    ('Shop1', 'Fashion store', 'Fashion', 1),
    ('Shop2', 'Tech gadgets store', 'Tech', 3),
    (
        'Shop3',
        'Lifestyle products store',
        'LifeStyle',
        2
    );

-- Inserting into managers table
INSERT INTO
    managers (manager_id, shop_id)
VALUES
    (3, 1),
    (3, 2),
    (3, 3);

-- Inserting into products table
INSERT INTO
    products (
        name,
        description,
        category,
        shop_id,
        price,
        amount,
        maximum_discount
    )
VALUES
    (
        'Product1',
        'Fashion product',
        'Fashion',
        1,
        50,
        100,
        20
    ),
    (
        'Product2',
        'Tech product',
        'Tech',
        2,
        100,
        50,
        NULL
    ),
    (
        'Product3',
        'Lifestyle product',
        'LifeStyle',
        3,
        30,
        200,
        15
    );

-- Inserting into discounts_products table
INSERT INTO
    discounts_products (
        product_id,
        discount,
        expiration_date,
        minimum_amount,
        allow_others
    )
VALUES
    (1, '10%', '2024-06-01', 50, true),
    (2, '15%', '2024-07-01', 1, false),
    (3, '5%', '2024-05-01', 100, true);

-- Inserting into discounts_shops table
INSERT INTO
    discounts_shops (
        shop_id,
        discount,
        expiration_date,
        minimum_amount,
        allow_others
    )
VALUES
    (1, '20%', '2024-06-01', 100, true),
    (2, '25%', '2024-07-01', 200, false),
    (3, '10%', '2024-05-01', 150, true);

-- Inserting into addresses table
INSERT INTO
    addresses (address, city, country, user_id)
VALUES
    ('123 Main St', 'New York', 'USA', 1),
    ('456 Elm St', 'Los Angeles', 'USA', 2),
    ('789 Oak St', 'Chicago', 'USA', 3);

-- Inserting into purchase_history table
INSERT INTO
    purchase_history (
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
        1,
        1,
        2,
        2,
        50,
        '2024-04-10',
        'Los Angeles',
        'USA',
        '456 Elm St',
        true,
        5
    ),
    (
        2,
        2,
        3,
        1,
        100,
        '2024-04-11',
        'Chicago',
        'USA',
        '789 Oak St',
        true,
        15
    ),
    (
        3,
        3,
        1,
        3,
        30,
        '2024-04-12',
        'New York',
        'USA',
        '123 Main St',
        true,
        2
    );