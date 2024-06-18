from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_db, close_db

bp = Blueprint("discounts_productsRoutes", __name__,
               url_prefix="/discounts/products")

# Get all discounts for products route


@bp.route("/", methods=["GET"], endpoint='discounts_products_get_all')
@jwt_required()
def get_discounts_products():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            SELECT dp.id, dp.product_id, dp.discount_code, dp.discount, dp.expiration_date, dp.minimum_amount, dp.allow_others,
                   p.name AS product_name, s.name AS shop_name, GROUP_CONCAT(DISTINCT c.category_name) AS categories
            FROM discounts_products dp
            JOIN products p ON dp.product_id = p.id
            JOIN shops s ON p.shop_id = s.id
            LEFT JOIN products_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            GROUP BY dp.id
        """)
        discounts = cursor.fetchall()
        close_db()
        discounts_list = [{
            "id": discount["id"],
            "product_id": discount["product_id"],
            "discount_code": discount["discount_code"],
            "discount": discount["discount"],
            "expiration_date": discount["expiration_date"],
            "minimum_amount": discount["minimum_amount"],
            "allow_others": discount["allow_others"],
            "product_name": discount["product_name"],
            "shop_name": discount["shop_name"],
            "categories": discount["categories"].split(",") if discount["categories"] else []
        } for discount in discounts]
        return jsonify(discounts=discounts_list), 200
    except Exception as e:
        close_db()
        return jsonify({"error": str(e)}), 500

# Get discount for product by discount code route


@bp.route("/by-code/<string:discount_code>", methods=["GET"], endpoint='discounts_products_get_by_code')
@jwt_required()
def get_discount_by_code(discount_code):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            SELECT dp.id, dp.product_id, dp.discount_code, dp.discount, dp.expiration_date, dp.minimum_amount, dp.allow_others,
                   p.name AS product_name, s.name AS shop_name, GROUP_CONCAT(DISTINCT c.category_name) AS categories
            FROM discounts_products dp
            JOIN products p ON dp.product_id = p.id
            JOIN shops s ON p.shop_id = s.id
            LEFT JOIN products_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            WHERE dp.discount_code = ?
            GROUP BY dp.id
        """, (discount_code,))
        discount = cursor.fetchone()
        close_db()
        if discount is None:
            return jsonify({"error": "Discount not found"}), 404
        else:
            return jsonify({
                "id": discount["id"],
                "product_id": discount["product_id"],
                "discount_code": discount["discount_code"],
                "discount": discount["discount"],
                "expiration_date": discount["expiration_date"],
                "minimum_amount": discount["minimum_amount"],
                "allow_others": discount["allow_others"],
                "product_name": discount["product_name"],
                "shop_name": discount["shop_name"],
                "categories": discount["categories"].split(",") if discount["categories"] else []
            }), 200
    except Exception as e:
        close_db()
        return jsonify({"error": str(e)}), 500

# Get discount for product by ID route


@bp.route("/<int:discount_id>", methods=["GET"], endpoint='discounts_products_get_by_id')
@jwt_required()
def get_discount_product_by_id(discount_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            SELECT dp.id, dp.product_id, dp.discount_code, dp.discount, dp.expiration_date, dp.minimum_amount, dp.allow_others,
                   p.name AS product_name, s.name AS shop_name, GROUP_CONCAT(DISTINCT c.category_name) AS categories
            FROM discounts_products dp
            JOIN products p ON dp.product_id = p.id
            JOIN shops s ON p.shop_id = s.id
            LEFT JOIN products_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            WHERE dp.id = ?
            GROUP BY dp.id
        """, (discount_id,))
        discount = cursor.fetchone()
        close_db()
        if discount is None:
            return jsonify({"error": "Discount for product not found"}), 404
        else:
            return jsonify({
                "id": discount["id"],
                "product_id": discount["product_id"],
                "discount_code": discount["discount_code"],
                "discount": discount["discount"],
                "expiration_date": discount["expiration_date"],
                "minimum_amount": discount["minimum_amount"],
                "allow_others": discount["allow_others"],
                "product_name": discount["product_name"],
                "shop_name": discount["shop_name"],
                "categories": discount["categories"].split(",") if discount["categories"] else []
            }), 200
    except Exception as e:
        close_db()
        return jsonify({"error": str(e)}), 500

# Get discount for product by product ID route


@bp.route("/product/<int:product_id>", methods=["GET"], endpoint='discounts_products_get_by_product_id')
@jwt_required()
def get_discounts_by_product_id(product_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            SELECT dp.id, dp.product_id, dp.discount_code, dp.discount, dp.expiration_date, dp.minimum_amount, dp.allow_others,
                   p.name AS product_name, s.name AS shop_name, GROUP_CONCAT(DISTINCT c.category_name) AS categories
            FROM discounts_products dp
            JOIN products p ON dp.product_id = p.id
            JOIN shops s ON p.shop_id = s.id
            LEFT JOIN products_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            WHERE dp.product_id = ?
            GROUP BY dp.id
        """, (product_id,))
        discounts = cursor.fetchall()
        close_db()
        if not discounts:
            return jsonify(discounts=[]), 200
        discounts_list = [{
            "id": discount["id"],
            "product_id": discount["product_id"],
            "discount_code": discount["discount_code"],
            "discount": discount["discount"],
            "expiration_date": discount["expiration_date"],
            "minimum_amount": discount["minimum_amount"],
            "allow_others": discount["allow_others"],
            "product_name": discount["product_name"],
            "shop_name": discount["shop_name"],
            "categories": discount["categories"].split(",") if discount["categories"] else []
        } for discount in discounts]
        return jsonify(discounts=discounts_list), 200
    except Exception as e:
        close_db()
        return jsonify({"error": str(e)}), 500

# Get all product discounts by shop ID route


@bp.route("/by_shop/<int:shop_id>", methods=["GET"], endpoint='discounts_products_get_by_shop_id')
@jwt_required()
def get_discounts_by_shop_id(shop_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            SELECT dp.id, dp.product_id, dp.discount_code, dp.discount, dp.expiration_date, dp.minimum_amount, dp.allow_others,
                   p.name AS product_name, s.name AS shop_name, GROUP_CONCAT(DISTINCT c.category_name) AS categories
            FROM discounts_products dp
            JOIN products p ON dp.product_id = p.id
            JOIN shops s ON p.shop_id = s.id
            LEFT JOIN products_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            WHERE s.id = ?
            GROUP BY dp.id
        """, (shop_id,))
        discounts = cursor.fetchall()
        close_db()
        if not discounts:
            return jsonify(discounts=[]), 200
        discounts_list = [{
            "id": discount["id"],
            "product_id": discount["product_id"],
            "discount_code": discount["discount_code"],
            "discount": discount["discount"],
            "expiration_date": discount["expiration_date"],
            "minimum_amount": discount["minimum_amount"],
            "allow_others": discount["allow_others"],
            "product_name": discount["product_name"],
            "shop_name": discount["shop_name"],
            "categories": discount["categories"].split(",") if discount["categories"] else []
        } for discount in discounts]
        return jsonify(discounts=discounts_list), 200
    except Exception as e:
        close_db()
        return jsonify({"error": str(e)}), 500

# Get all product discounts by shop name route


@bp.route("/by_shop_name/<string:shop_name>", methods=["GET"], endpoint='discounts_products_get_by_shop_name')
@jwt_required()
def get_discounts_by_shop_name(shop_name):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            SELECT dp.id, dp.product_id, dp.discount_code, dp.discount, dp.expiration_date, dp.minimum_amount, dp.allow_others,
                   p.name AS product_name, s.name AS shop_name, GROUP_CONCAT(DISTINCT c.category_name) AS categories
            FROM discounts_products dp
            JOIN products p ON dp.product_id = p.id
            JOIN shops s ON p.shop_id = s.id
            LEFT JOIN products_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            WHERE s.name = ?
            GROUP BY dp.id
        """, (shop_name,))
        discounts = cursor.fetchall()
        close_db()
        if not discounts:
            return jsonify(discounts=[]), 200
        discounts_list = [{
            "id": discount["id"],
            "product_id": discount["product_id"],
            "discount_code": discount["discount_code"],
            "discount": discount["discount"],
            "expiration_date": discount["expiration_date"],
            "minimum_amount": discount["minimum_amount"],
            "allow_others": discount["allow_others"],
            "product_name": discount["product_name"],
            "shop_name": discount["shop_name"],
            "categories": discount["categories"].split(",") if discount["categories"] else []
        } for discount in discounts]
        return jsonify(discounts=discounts_list), 200
    except Exception as e:
        close_db()
        return jsonify({"error": str(e)}), 500

# Get all product discounts by user ID route


@bp.route("/user", methods=["GET"], endpoint='discounts_products_get_by_user_id')
@jwt_required()
def get_discounts_for_user():
    user_id = get_jwt_identity()
    try:
        db = get_db()
        cursor = db.cursor()

        # Get all shop IDs where the user is an owner or manager
        cursor.execute("""
            SELECT DISTINCT s.id AS shop_id
            FROM shops s
            LEFT JOIN managers m ON s.id = m.shop_id
            WHERE s.owner_id = ? OR m.manager_id = ?
        """, (user_id, user_id))

        shop_ids = [row["shop_id"] for row in cursor.fetchall()]

        if not shop_ids:
            close_db()
            return jsonify(discounts=[]), 200

        # Get all discount products for the relevant shops
        cursor.execute("""
            SELECT dp.id, dp.product_id, dp.discount_code, dp.discount, dp.expiration_date, dp.minimum_amount, dp.allow_others,
                   p.name AS product_name, s.name AS shop_name, GROUP_CONCAT(DISTINCT c.category_name) AS categories
            FROM discounts_products dp
            JOIN products p ON dp.product_id = p.id
            JOIN shops s ON p.shop_id = s.id
            LEFT JOIN products_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            WHERE p.shop_id IN ({})
            GROUP BY dp.id
        """.format(','.join('?' for _ in shop_ids)), shop_ids)

        discounts = cursor.fetchall()
        close_db()
        discounts_list = [{
            "id": discount["id"],
            "product_id": discount["product_id"],
            "discount_code": discount["discount_code"],
            "discount": discount["discount"],
            "expiration_date": discount["expiration_date"],
            "minimum_amount": discount["minimum_amount"],
            "allow_others": discount["allow_others"],
            "product_name": discount["product_name"],
            "shop_name": discount["shop_name"],
            "categories": discount["categories"].split(",") if discount["categories"] else []
        } for discount in discounts]

        return jsonify(discounts=discounts_list), 200
    except Exception as e:
        close_db()
        return jsonify({"error": str(e)}), 500

# Create new discount for product route


@bp.route("", methods=["POST"], endpoint='discounts_products_create')
@jwt_required()
def create_discount_product():
    try:
        data = request.get_json()
        product_id = data.get("product_id")
        discount_code = data.get("discount_code")
        discount = data.get("discount")
        expiration_date = data.get("expiration_date")
        minimum_amount = data.get("minimum_amount")
        allow_others = data.get("allow_others")

        if product_id is None or not discount_code or discount is None or not expiration_date or minimum_amount is None or allow_others is None:
            return jsonify({"error": "Incomplete discount data"}), 400

        db = get_db()
        cursor = db.cursor()

        cursor.execute("SELECT id FROM products WHERE id = ?", (product_id,))
        existing_product = cursor.fetchone()
        if existing_product is None:
            close_db()
            return jsonify({"error": "Product not found"}), 404

        cursor.execute(
            "INSERT INTO discounts_products (product_id, discount_code, discount, expiration_date, minimum_amount, allow_others) VALUES (?, ?, ?, ?, ?, ?)",
            (product_id, discount_code, discount,
             expiration_date, minimum_amount, allow_others)
        )
        db.commit()
        close_db()
        return jsonify({"message": "Discount for product created successfully"}), 201
    except Exception as e:
        close_db()
        return jsonify({"error": str(e)}), 500

# Update discount for product by ID route


@bp.route("/<int:discount_id>", methods=["PATCH"], endpoint='discounts_products_update_by_id')
@jwt_required()
def update_discount_product_by_id(discount_id):
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "SELECT id FROM discounts_products WHERE id = ?", (discount_id,))
        existing_discount = cursor.fetchone()
        if existing_discount is None:
            close_db()
            return jsonify({"error": "Discount for product not found"}), 404
        else:
            cursor.execute(
                "UPDATE discounts_products SET product_id = ?, discount_code = ?, discount = ?, expiration_date = ?, minimum_amount = ?, allow_others = ? WHERE id = ?",
                (data.get("product_id"), data.get("discount_code"), data.get("discount"), data.get(
                    "expiration_date"), data.get("minimum_amount"), data.get("allow_others"), discount_id)
            )
            db.commit()
            close_db()
            return jsonify({"message": "Discount for product updated successfully"}), 200
    except Exception as e:
        close_db()
        return jsonify({"error": str(e)}), 500

# Delete discount for product by ID route


@bp.route("/<int:discount_id>", methods=["DELETE"], endpoint='discounts_products_delete_by_id')
@jwt_required()
def delete_discount_product_by_id(discount_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "SELECT id FROM discounts_products WHERE id = ?", (discount_id,))
        existing_discount = cursor.fetchone()
        if existing_discount is None:
            close_db()
            return jsonify({"error": "Discount for product not found"}), 404
        else:
            cursor.execute(
                "DELETE FROM discounts_products WHERE id = ?", (discount_id,))
            db.commit()
            close_db()
            return jsonify({"message": "Discount for product deleted successfully"}), 200
    except Exception as e:
        close_db()
        return jsonify({"error": str(e)}), 500
