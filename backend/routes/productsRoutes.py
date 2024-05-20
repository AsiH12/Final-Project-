from flask import Blueprint, Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt, jwt_required, get_jwt_identity

from db import close_db, get_db

app = Flask(__name__)
CORS(app)
jwt = JWTManager(app)

bp = Blueprint("productsRoutes", __name__, url_prefix="/products")

@bp.route("/", methods=["GET"])
def get_products():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT p.id, p.name, p.description, p.shop_id, s.name as shop_name, p.price, p.amount, p.maximum_discount, GROUP_CONCAT(c.category_name) AS categories
        FROM products p
        LEFT JOIN products_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        LEFT JOIN shops s ON p.shop_id = s.id
        GROUP BY p.id
    """)
    products = cursor.fetchall()
    product_list = [
        {
            "id": product["id"],
            "name": product["name"],
            "description": product["description"],
            "shop_id": product["shop_id"],
            "shop_name": product["shop_name"],
            "price": product["price"],
            "amount": product["amount"],
            "maximum_discount": product["maximum_discount"],
            "categories": product["categories"].split(",") if product["categories"] else []
        }
        for product in products
    ]
    return jsonify(products=product_list), 200

@bp.route("/<int:product_id>", methods=["GET"])
def get_product_by_id(product_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT p.id, p.name, p.description, p.shop_id, s.name as shop_name, p.price, p.amount, p.maximum_discount, GROUP_CONCAT(c.category_name) AS categories
        FROM products p
        LEFT JOIN products_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        LEFT JOIN shops s ON p.shop_id = s.id
        WHERE p.id = ?
        GROUP BY p.id
    """, (product_id,))
    product = cursor.fetchone()
    if product is None:
        return jsonify({"error": "Product not found"}), 404
    else:
        return jsonify({
            "id": product["id"],
            "name": product["name"],
            "description": product["description"],
            "shop_id": product["shop_id"],
            "shop_name": product["shop_name"],
            "price": product["price"],
            "amount": product["amount"],
            "maximum_discount": product["maximum_discount"],
            "categories": product["categories"].split(",") if product["categories"] else []
        }), 200

@bp.route("/category/<category_name>", methods=["GET"])
def get_products_by_category(category_name):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT p.id, p.name, p.description, p.shop_id, s.name as shop_name, p.price, p.amount, p.maximum_discount, GROUP_CONCAT(c.category_name) AS categories
        FROM products p
        LEFT JOIN products_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        LEFT JOIN shops s ON p.shop_id = s.id
        WHERE c.category_name = ?
        GROUP BY p.id
    """, (category_name,))
    products = cursor.fetchall()
    product_list = [
        {
            "id": product["id"],
            "name": product["name"],
            "description": product["description"],
            "shop_id": product["shop_id"],
            "shop_name": product["shop_name"],
            "price": product["price"],
            "amount": product["amount"],
            "maximum_discount": product["maximum_discount"],
            "categories": product["categories"].split(",") if product["categories"] else []
        }
        for product in products
    ]
    return jsonify(products=product_list), 200

@bp.route("/shop/<int:shop_id>", methods=["GET"])
def get_products_by_shop_id(shop_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT p.id, p.name, p.description, p.shop_id, s.name as shop_name, p.price, p.amount, p.maximum_discount, GROUP_CONCAT(c.category_name) AS categories
        FROM products p
        LEFT JOIN products_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        LEFT JOIN shops s ON p.shop_id = s.id
        WHERE p.shop_id = ?
        GROUP BY p.id
    """, (shop_id,))
    products = cursor.fetchall()
    product_list = [
        {
            "id": product["id"],
            "name": product["name"],
            "description": product["description"],
            "shop_id": product["shop_id"],
            "shop_name": product["shop_name"],
            "price": product["price"],
            "amount": product["amount"],
            "maximum_discount": product["maximum_discount"],
            "categories": product["categories"].split(",") if product["categories"] else []
        }
        for product in products
    ]
    return jsonify(products=product_list), 200

@bp.route("/owner/<int:owner_id>", methods=["GET"])
def get_products_by_owner_id(owner_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT p.id, p.name, p.description, p.shop_id, s.name as shop_name, p.price, p.amount, p.maximum_discount, GROUP_CONCAT(c.category_name) AS categories
        FROM products p
        LEFT JOIN shops s ON p.shop_id = s.id
        LEFT JOIN products_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        WHERE s.owner_id = ?
        GROUP BY p.id
    """, (owner_id,))
    products = cursor.fetchall()
    product_list = [
        {
            "id": product["id"],
            "name": product["name"],
            "description": product["description"],
            "shop_id": product["shop_id"],
            "shop_name": product["shop_name"],
            "price": product["price"],
            "amount": product["amount"],
            "maximum_discount": product["maximum_discount"],
            "categories": product["categories"].split(",") if product["categories"] else []
        }
        for product in products
    ]
    return jsonify(products=product_list), 200

@bp.route("/manager_owner/<int:user_id>", methods=["GET"])
def get_products_by_manager_or_owner(user_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT p.id, p.name, p.description, p.shop_id, s.name as shop_name, p.price, p.amount, p.maximum_discount, GROUP_CONCAT(c.category_name) AS categories
        FROM products p
        LEFT JOIN shops s ON p.shop_id = s.id
        LEFT JOIN products_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        LEFT JOIN managers m ON s.id = m.shop_id
        WHERE s.owner_id = ? OR m.manager_id = ?
        GROUP BY p.id
    """, (user_id, user_id))
    products = cursor.fetchall()
    close_db()
    product_list = [
        {
            "id": product["id"],
            "name": product["name"],
            "description": product["description"],
            "shop_id": product["shop_id"],
            "shop_name": product["shop_name"],
            "price": product["price"],
            "amount": product["amount"],
            "maximum_discount": product["maximum_discount"],
            "categories": product["categories"].split(",") if product["categories"] else []
        }
        for product in products
    ]
    return jsonify(products=product_list), 200


@bp.route("", methods=["POST"])
def create_new_product():
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")
    shop_id = data.get("shop_id")
    price = data.get("price")
    amount = data.get("amount")
    maximum_discount = data.get("maximum_discount")
    categories = data.get("categories")

    # Validate input data
    if not all([name, shop_id, price, amount, categories, maximum_discount]):
        return jsonify({"error": "Incomplete product data"}), 400

    db = get_db()
    cursor = db.cursor()

    # Check if the shop exists
    cursor.execute("SELECT id FROM shops WHERE id = ?", (shop_id,))
    existing_shop = cursor.fetchone()
    if existing_shop is None:
        return jsonify({"error": "Shop not found"}), 404

    # Insert the new product into the database
    cursor.execute(
        "INSERT INTO products (name, description, shop_id, price, amount, maximum_discount) VALUES (?, ?, ?, ?, ?, ?)",
        (name, description, shop_id, price, amount, maximum_discount),
    )
    product_id = cursor.lastrowid

    # Insert product categories
    for category_id in categories:
        cursor.execute(
            "INSERT INTO products_categories (product_id, category_id) VALUES (?, ?)",
            (product_id, category_id),
        )

    db.commit()

    # Fetch the newly created product
    cursor.execute("""
        SELECT p.id, p.name, p.description, p.shop_id, s.name as shop_name, p.price, p.amount, p.maximum_discount, GROUP_CONCAT(c.category_name) AS categories
        FROM products p
        LEFT JOIN products_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        LEFT JOIN shops s ON p.shop_id = s.id
        WHERE p.id = ?
        GROUP BY p.id
    """, (product_id,))
    new_product = cursor.fetchone()

    product = {
        "id": new_product["id"],
        "name": new_product["name"],
        "description": new_product["description"],
        "shop_id": new_product["shop_id"],
        "shop_name": new_product["shop_name"],
        "price": new_product["price"],
        "amount": new_product["amount"],
        "maximum_discount": new_product["maximum_discount"],
        "categories": new_product["categories"].split(",") if new_product["categories"] else []
    }

    return jsonify(product), 201

@bp.route("/<int:product_id>", methods=["PATCH"])
def update_product_by_id(product_id):
    data = request.get_json()
    db = get_db()
    cursor = db.cursor()
    # Check if the product exists
    cursor.execute("SELECT id FROM products WHERE id = ?", (product_id,))
    existing_product = cursor.fetchone()
    if existing_product is None:
        return jsonify({"error": "Product not found"}), 404
    else:
        # Update product data
        cursor.execute(
            "UPDATE products SET name = ?, description = ?, shop_id = ?, price = ?, amount = ?, maximum_discount = ? WHERE id = ?",
            (
                data.get("name"),
                data.get("description"),
                data.get("shop_id"),
                data.get("price"),
                data.get("amount"),
                data.get("maximum_discount"),
                product_id,
            ),
        )

        # Update product categories
        cursor.execute("DELETE FROM products_categories WHERE product_id = ?", (product_id,))
        for category_id in data.get("categories", []):
            cursor.execute(
                "INSERT INTO products_categories (product_id, category_id) VALUES (?, ?)",
                (product_id, category_id),
            )

        db.commit()
        return jsonify({"message": "Product updated successfully"}), 200

@bp.route("/<int:product_id>", methods=["DELETE"])
def delete_product_by_id(product_id):
    db = get_db()
    cursor = db.cursor()
    # Check if the product exists
    cursor.execute("SELECT id FROM products WHERE id = ?", (product_id,))
    existing_product = cursor.fetchone()
    if existing_product is None:
        return jsonify({"error": "Product not found"}), 404
    else:
        cursor.execute("DELETE FROM products WHERE id = ?", (product_id,))
        cursor.execute("DELETE FROM products_categories WHERE product_id = ?", (product_id,))
        db.commit()
        return jsonify({"message": "Product deleted successfully"}), 200

# Register the blueprint
app.register_blueprint(bp)

if __name__ == '__main__':
    app.run(debug=True)
