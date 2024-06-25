from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import base64

from db import get_db, close_db

bp = Blueprint("purchase_historyRoutes", __name__,
               url_prefix="/purchase-history")

# Get all purchase history route


@bp.route("/", methods=["GET"], endpoint='purchase_history_get_all')
@jwt_required()
def get_purchase_history():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM purchase_history")
    purchase_history = cursor.fetchall()
    close_db()

    purchase_history_list = [dict(purchase) for purchase in purchase_history]
    return jsonify(purchase_history=purchase_history_list), 200

# Get purchase history by ID route


@bp.route("/<int:purchase_id>", methods=["GET"], endpoint='purchase_history_get_by_id')
@jwt_required()
def get_purchase_history_by_id(purchase_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT * FROM purchase_history WHERE id = ?", (purchase_id,))
    purchase = cursor.fetchone()
    close_db()
    if purchase is None:
        return jsonify({"error": "Purchase history not found"}), 404
    purchase_dict = dict(purchase)
    return jsonify(purchase_dict), 200

# Get all purchase history by user ID with user name


@bp.route("/user", methods=["GET"], endpoint='purchase_history_get_by_user_id')
@jwt_required()
def get_purchase_history_by_user_id():
    user_id = get_jwt_identity()
    db = get_db()
    cursor = db.cursor()
    query = """
        SELECT ph.id, p.name AS product_name, s.name AS shop_name, u.username AS user_name, 
               ph.quantity, ph.product_price, ph.purchase_date, ph.city, ph.country, 
               ph.shipping_address, ph.shipping_completed, ph.total_price,
               pi.image AS product_image
        FROM purchase_history ph
        JOIN products p ON ph.product_id = p.id
        JOIN shops s ON ph.shop_id = s.id
        JOIN users u ON ph.user_id = u.id
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE ph.user_id = ?
    """
    cursor.execute(query, (user_id,))
    user_purchases = cursor.fetchall()
    close_db()

    purchases_list = []
    for purchase in user_purchases:
        purchase_dict = dict(purchase)
        if purchase_dict['product_image']:
            purchase_dict['product_image'] = base64.b64encode(
                purchase_dict['product_image']).decode('utf-8')
        purchases_list.append(purchase_dict)

    return jsonify(purchases_list), 200
# Get all purchase history by product ID with product name


@bp.route("/product/<int:product_id>", methods=["GET"], endpoint='purchase_history_get_by_product_id')
@jwt_required()
def get_purchase_history_by_product_id(product_id):
    db = get_db()
    cursor = db.cursor()
    query = """
        SELECT ph.id, p.name AS product_name, s.name AS shop_name, u.username AS user_name, 
               ph.quantity, ph.product_price, ph.purchase_date, ph.city, ph.country, 
               ph.shipping_address, ph.shipping_completed, ph.total_price
        FROM purchase_history ph
        JOIN products p ON ph.product_id = p.id
        JOIN shops s ON ph.shop_id = s.id
        JOIN users u ON ph.user_id = u.id
        WHERE ph.product_id = ?
    """
    cursor.execute(query, (product_id,))
    product_purchases = cursor.fetchall()
    close_db()
    purchases_list = [dict(purchase) for purchase in product_purchases]
    return jsonify(purchases_list), 200

# Get all purchase history by shop ID with shop name


@bp.route("/shop/<int:shop_id>", methods=["GET"], endpoint='purchase_history_get_by_shop_id')
@jwt_required()
def get_purchase_history_by_shop_id(shop_id):
    db = get_db()
    cursor = db.cursor()
    query = """
        SELECT ph.id, p.name AS product_name, s.name AS shop_name, u.username AS user_name, 
               ph.quantity, ph.product_price, ph.purchase_date, ph.city, ph.country, 
               ph.shipping_address, ph.shipping_completed, ph.total_price
        FROM purchase_history ph
        JOIN products p ON ph.product_id = p.id
        JOIN shops s ON ph.shop_id = s.id
        JOIN users u ON ph.user_id = u.id
        WHERE ph.shop_id = ?
    """
    cursor.execute(query, (shop_id,))
    shop_purchases = cursor.fetchall()
    close_db()
    purchases_list = [dict(purchase) for purchase in shop_purchases]
    return jsonify(purchases_list), 200

# Get all user purchases where the user is an owner or manager


@bp.route("/manager_owner", methods=["GET"], endpoint='purchase_history_get_by_manager_owner')
@jwt_required()
def get_user_purchases():
    user_id = get_jwt_identity()
    try:
        db = get_db()
        cursor = db.cursor()

        cursor.execute("""
            SELECT DISTINCT s.id AS shop_id
            FROM shops s
            LEFT JOIN managers m ON s.id = m.shop_id
            WHERE s.owner_id = ? OR m.manager_id = ?
        """, (user_id, user_id))

        shop_ids = [row["shop_id"] for row in cursor.fetchall()]

        if not shop_ids:
            close_db()
            return jsonify(purchases=[]), 200

        cursor.execute("""
            SELECT p.*, prod.name as product_name, s.name as shop_name, u.username as user_name
            FROM purchase_history p
            LEFT JOIN products prod ON p.product_id = prod.id
            LEFT JOIN shops s ON p.shop_id = s.id
            LEFT JOIN users u ON p.user_id = u.id
            WHERE p.shop_id IN ({})
        """.format(','.join('?' for _ in shop_ids)), shop_ids)

        purchases = cursor.fetchall()
        close_db()
        purchase_list = [
            {
                "id": purchase["id"],
                "product_id": purchase["product_id"],
                "shop_id": purchase["shop_id"],
                "user_id": purchase["user_id"],
                "quantity": purchase["quantity"],
                "product_price": purchase["product_price"],
                "purchase_date": purchase["purchase_date"],
                "city": purchase["city"],
                "country": purchase["country"],
                "shipping_address": purchase["shipping_address"],
                "shipping_completed": purchase["shipping_completed"],
                "total_price": purchase["total_price"],
                "product_name": purchase["product_name"],
                "shop_name": purchase["shop_name"],
                "user_name": purchase["user_name"]
            }
            for purchase in purchases
        ]

        return jsonify(purchases=purchase_list), 200
    except Exception as e:
        close_db()
        return jsonify({"error": str(e)}), 500

# Get all purchase history by shop name


@bp.route("/shop_name/<string:shop_name>", methods=["GET"], endpoint='purchase_history_get_by_shop_name')
@jwt_required()
def get_purchase_history_by_shop_name(shop_name):
    db = get_db()
    cursor = db.cursor()
    query = """
        SELECT ph.id, p.name AS product_name, s.name AS shop_name, u.username AS user_name, 
               ph.quantity, ph.product_price, ph.purchase_date, ph.city, ph.country, 
               ph.shipping_address, ph.shipping_completed, ph.total_price
        FROM purchase_history ph
        JOIN products p ON ph.product_id = p.id
        JOIN shops s ON ph.shop_id = s.id
        JOIN users u ON ph.user_id = u.id
        WHERE s.name = ?
    """
    cursor.execute(query, (shop_name,))
    shop_purchases = cursor.fetchall()
    close_db()
    purchases_list = [dict(purchase) for purchase in shop_purchases]
    return jsonify(purchases_list), 200


@bp.route("", methods=["POST"], endpoint='purchase_history_create')
@jwt_required()
def create_purchase_history():
    data = request.get_json()
    user_id = get_jwt_identity()  # Get the user ID from the JWT token
    product_id = data.get("product_id")
    quantity = data.get("quantity")

    if not product_id or not quantity:
        return jsonify({"error": "Product ID and quantity are required"}), 400

    db = get_db()
    cursor = db.cursor()

    # Fetch the current amount of the product from the database
    cursor.execute("SELECT amount FROM products WHERE id = ?", (product_id,))
    product = cursor.fetchone()

    if not product:
        return jsonify({"error": "Product not found"}), 404

    available_amount = product["amount"]

    if quantity > available_amount:
        return jsonify({"error": "Requested quantity exceeds available stock"}), 400

    # Insert the purchase history record
    cursor.execute(
        "INSERT INTO purchase_history (product_id, shop_id, user_id, quantity, product_price, purchase_date, city, country, shipping_address, shipping_completed, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            data.get("product_id"),
            data.get("shop_id"),
            user_id,  # Use the user ID from the JWT token
            quantity,
            data.get("product_price"),
            data.get("purchase_date"),
            data.get("city"),
            data.get("country"),
            data.get("shipping_address"),
            data.get("shipping_completed"),
            data.get("total_price")
        )
    )

    # Deduct the purchased quantity from the product's available amount if shipping is completed
    new_amount = available_amount - quantity
    cursor.execute(
        "UPDATE products SET amount = ? WHERE id = ?", (new_amount, product_id))

    db.commit()
    close_db()
    return jsonify({"message": "Purchase history created successfully"}), 201
# Delete purchase history by ID route


@bp.route("/<int:purchase_id>", methods=["DELETE"], endpoint='purchase_history_delete_by_id')
@jwt_required()
def delete_purchase_history_by_id(purchase_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM purchase_history WHERE id = ?", (purchase_id,))
    db.commit()
    close_db()
    return jsonify({"message": "Purchase history deleted successfully"}), 200
