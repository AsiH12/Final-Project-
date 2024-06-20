from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_db, close_db
import base64

bp = Blueprint("productsRoutes", __name__, url_prefix="/products")


def convert_image_to_base64(image):
    if image:
        return base64.b64encode(image).decode('utf-8')
    return None


@bp.route("/", methods=["GET"], endpoint='products_get_all')
def get_products():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT p.id, p.name, p.description, p.shop_id, s.name as shop_name, p.price, p.amount, p.maximum_discount, 
               GROUP_CONCAT(c.category_name) AS categories, pi.image
        FROM products p
        LEFT JOIN products_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        LEFT JOIN shops s ON p.shop_id = s.id
        LEFT JOIN product_images pi ON p.id = pi.product_id
        GROUP BY p.id
    """)
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
            "categories": product["categories"].split(",") if product["categories"] else [],
            "image": convert_image_to_base64(product["image"])
        }
        for product in products
    ]
    return jsonify(products=product_list), 200


@bp.route("/<int:product_id>", methods=["GET"], endpoint='products_get_by_id')
def get_product_by_id(product_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT p.id, p.name, p.description, p.shop_id, s.name as shop_name, p.price, p.amount, p.maximum_discount, 
               GROUP_CONCAT(c.category_name) AS categories, pi.image
        FROM products p
        LEFT JOIN products_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        LEFT JOIN shops s ON p.shop_id = s.id
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.id = ?
        GROUP BY p.id
    """, (product_id,))
    product = cursor.fetchone()
    close_db()
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
            "categories": product["categories"].split(",") if product["categories"] else [],
            "image": convert_image_to_base64(product["image"])
        }), 200


@bp.route("/category/<category_name>", methods=["GET"], endpoint='products_get_by_category')
def get_products_by_category(category_name):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT p.id, p.name, p.description, p.shop_id, s.name as shop_name, p.price, p.amount, p.maximum_discount, 
               GROUP_CONCAT(c.category_name) AS categories, pi.image
        FROM products p
        LEFT JOIN products_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        LEFT JOIN shops s ON p.shop_id = s.id
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE c.category_name = ?
        GROUP BY p.id
    """, (category_name,))
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
            "categories": product["categories"].split(",") if product["categories"] else [],
            "image": convert_image_to_base64(product["image"])
        }
        for product in products
    ]
    return jsonify(products=product_list), 200


@bp.route("/shop/<int:shop_id>", methods=["GET"], endpoint='products_get_by_shop_id')
def get_products_by_shop_id(shop_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT p.id, p.name, p.description, p.shop_id, s.name as shop_name, p.price, p.amount, p.maximum_discount, 
               GROUP_CONCAT(c.category_name) AS categories, pi.image
        FROM products p
        LEFT JOIN products_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        LEFT JOIN shops s ON p.shop_id = s.id
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.shop_id = ?
        GROUP BY p.id
    """, (shop_id,))
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
            "categories": product["categories"].split(",") if product["categories"] else [],
            "image": convert_image_to_base64(product["image"])
        }
        for product in products
    ]
    return jsonify(products=product_list), 200


@bp.route("/owner/<int:owner_id>", methods=["GET"], endpoint='products_get_by_owner_id')
@jwt_required()
def get_products_by_owner_id(owner_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT p.id, p.name, p.description, p.shop_id, s.name as shop_name, p.price, p.amount, p.maximum_discount, 
               GROUP_CONCAT(c.category_name) AS categories, pi.image
        FROM products p
        LEFT JOIN shops s ON p.shop_id = s.id
        LEFT JOIN products_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE s.owner_id = ?
        GROUP BY p.id
    """, (owner_id,))
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
            "categories": product["categories"].split(",") if product["categories"] else [],
            "image": convert_image_to_base64(product["image"])
        }
        for product in products
    ]
    return jsonify(products=product_list), 200


@bp.route("/manager_owner", methods=["GET"], endpoint='products_get_by_manager_or_owner')
@jwt_required()
def get_products_by_manager_or_owner():
    user_id = get_jwt_identity()
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT p.id, p.name, p.description, p.shop_id, s.name as shop_name, p.price, p.amount, p.maximum_discount, 
               GROUP_CONCAT(c.category_name) AS categories, pi.image
        FROM products p
        LEFT JOIN shops s ON p.shop_id = s.id
        LEFT JOIN products_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        LEFT JOIN managers m ON s.id = m.shop_id
        LEFT JOIN product_images pi ON p.id = pi.product_id
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
            "categories": product["categories"].split(",") if product["categories"] else [],
            "image": convert_image_to_base64(product["image"])
        }
        for product in products
    ]
    return jsonify(products=product_list), 200


@bp.route("/getShopId/<int:product_id>", methods=["GET"], endpoint='get_shop_id_by_product_id')
def get_shop_id_by_product_id(product_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT shop_id FROM products WHERE id = ?", (product_id,))
    shop_id = cursor.fetchone()
    close_db()
    if shop_id is None:
        return jsonify({"error": "Product not found"}), 404
    else:
        return jsonify({"shop_id": shop_id["shop_id"]}), 200


@bp.route("", methods=["POST"], endpoint='products_create')
@jwt_required()
def create_new_product():
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")
    shop_id = data.get("shop_id")
    price = data.get("price")
    amount = data.get("amount")
    maximum_discount = data.get("maximum_discount")
    categories = data.get("categories")

    if not all([name, shop_id, price, amount, categories, maximum_discount]):
        return jsonify({"error": "Incomplete product data"}), 400

    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT id FROM shops WHERE id = ?", (shop_id,))
    existing_shop = cursor.fetchone()
    if existing_shop is None:
        close_db()
        return jsonify({"error": "Shop not found"}), 404

    cursor.execute(
        "INSERT INTO products (name, description, shop_id, price, amount, maximum_discount) VALUES (?, ?, ?, ?, ?, ?)",
        (name, description, shop_id, price, amount, maximum_discount),
    )
    product_id = cursor.lastrowid

    for category_id in categories:
        cursor.execute(
            "INSERT INTO products_categories (product_id, category_id) VALUES (?, ?)",
            (product_id, category_id),
        )

    db.commit()

    cursor.execute("""
        SELECT p.id, p.name, p.description, p.shop_id, s.name as shop_name, p.price, p.amount, p.maximum_discount, 
               GROUP_CONCAT(c.category_name) AS categories, pi.image
        FROM products p
        LEFT JOIN products_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        LEFT JOIN shops s ON p.shop_id = s.id
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.id = ?
        GROUP BY p.id
    """, (product_id,))
    new_product = cursor.fetchone()
    close_db()

    product = {
        "id": new_product["id"],
        "name": new_product["name"],
        "description": new_product["description"],
        "shop_id": new_product["shop_id"],
        "shop_name": new_product["shop_name"],
        "price": new_product["price"],
        "amount": new_product["amount"],
        "maximum_discount": new_product["maximum_discount"],
        "categories": new_product["categories"].split(",") if new_product["categories"] else [],
        "image": convert_image_to_base64(new_product["image"])
    }

    return jsonify(product), 201


@bp.route("/<int:product_id>", methods=["PATCH"], endpoint='products_update_by_id')
@jwt_required()
def update_product_by_id(product_id):
    data = request.get_json()
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id FROM products WHERE id = ?", (product_id,))
    existing_product = cursor.fetchone()
    if existing_product is None:
        close_db()
        return jsonify({"error": "Product not found"}), 404
    else:
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

        cursor.execute(
            "DELETE FROM products_categories WHERE product_id = ?", (product_id,))
        for category_id in data.get("categories", []):
            cursor.execute(
                "INSERT INTO products_categories (product_id, category_id) VALUES (?, ?)",
                (product_id, category_id),
            )

        db.commit()

        cursor.execute("""
            SELECT p.id, p.name, p.description, p.shop_id, s.name as shop_name, p.price, p.amount, p.maximum_discount, 
                   GROUP_CONCAT(c.category_name) AS categories, pi.image
            FROM products p
            LEFT JOIN products_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            LEFT JOIN shops s ON p.shop_id = s.id
            LEFT JOIN product_images pi ON p.id = pi.product_id
            WHERE p.id = ?
            GROUP BY p.id
        """, (product_id,))
        updated_product = cursor.fetchone()
        close_db()

        product = {
            "id": updated_product["id"],
            "name": updated_product["name"],
            "description": updated_product["description"],
            "shop_id": updated_product["shop_id"],
            "shop_name": updated_product["shop_name"],
            "price": updated_product["price"],
            "amount": updated_product["amount"],
            "maximum_discount": updated_product["maximum_discount"],
            "categories": updated_product["categories"].split(",") if updated_product["categories"] else [],
            "image": convert_image_to_base64(updated_product["image"])
        }

        return jsonify(product), 200


@bp.route("/<int:product_id>", methods=["DELETE"], endpoint='products_delete_by_id')
@jwt_required()
def delete_product_by_id(product_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id FROM products WHERE id = ?", (product_id,))
    existing_product = cursor.fetchone()
    if existing_product is None:
        close_db()
        return jsonify({"error": "Product not found"}), 404
    else:
        cursor.execute("DELETE FROM products WHERE id = ?", (product_id,))
        cursor.execute(
            "DELETE FROM products_categories WHERE product_id = ?", (product_id,))
        cursor.execute(
            "DELETE FROM product_images WHERE product_id = ?", (product_id,))
        db.commit()
        close_db()
        return jsonify({"message": "Product deleted successfully"}), 200
