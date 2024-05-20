from flask import Blueprint, Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt, jwt_required,get_jwt_identity

from db import close_db, get_db
bp=Blueprint("purchase_historyRoutes", __name__, url_prefix="/purchase-history")

# Get all purchase history route
@bp.route("/", methods=["GET"])
def get_purchase_history():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM purchase_history")
    purchase_history = cursor.fetchall()

    # Convert Row objects to dictionaries
    purchase_history_list = []
    for purchase in purchase_history:
        purchase_dict = dict(purchase)
        purchase_history_list.append(purchase_dict)

    return jsonify(purchase_history=purchase_history_list), 200


# Get purchase history by ID route
@bp.route("/<int:purchase_id>", methods=["GET"])
def get_purchase_history_by_id(purchase_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM purchase_history WHERE id = ?", (purchase_id,))
    purchase = cursor.fetchone()
    if purchase is None:
        return jsonify({"error": "Purchase history not found"}), 404
    # Convert Row object to dictionary
    purchase_dict = dict(purchase)
    return jsonify(purchase_dict), 200

# Get all purchase history by user ID with user name
@bp.route("/user/<int:user_id>", methods=["GET"])
def get_purchase_history_by_user_id(user_id):
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
        WHERE ph.user_id = ?
    """
    cursor.execute(query, (user_id,))
    user_purchases = cursor.fetchall()
    purchases_list = [dict(purchase) for purchase in user_purchases]
    return jsonify(purchases_list), 200

# Get all purchase history by product ID with product name
@bp.route("/product/<int:product_id>", methods=["GET"])
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
    purchases_list = [dict(purchase) for purchase in product_purchases]
    return jsonify(purchases_list), 200

# Get all purchase history by shop ID with shop name
@bp.route("/shop/<int:shop_id>", methods=["GET"])
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

@bp.route("/manager_owner/<int:user_id>", methods=["GET"])
def get_user_purchases(user_id):
    try:
        db = get_db()
        cursor = db.cursor()
        
        # Get all shops where the user is an owner or manager
        cursor.execute("""
            SELECT DISTINCT s.id AS shop_id
            FROM shops s
            LEFT JOIN managers m ON s.id = m.shop_id
            WHERE s.owner_id = ? OR m.manager_id = ?
        """, (user_id, user_id))
        
        shop_ids = [row["shop_id"] for row in cursor.fetchall()]
        
        if not shop_ids:
            return jsonify(purchases=[]), 200

        # Get all purchases for the relevant shops
        cursor.execute("""
            SELECT p.*, prod.name as product_name, s.name as shop_name, u.username as user_name
            FROM purchase_history p
            LEFT JOIN products prod ON p.product_id = prod.id
            LEFT JOIN shops s ON p.shop_id = s.id
            LEFT JOIN users u ON p.user_id = u.id
            WHERE p.shop_id IN ({})
        """.format(','.join('?' for _ in shop_ids)), shop_ids)
        
        purchases = cursor.fetchall()
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
        return jsonify({"error": str(e)}), 500


# Get all purchase history by shop name
@bp.route("/shop_name/<string:shop_name>", methods=["GET"])
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
    purchases_list = [dict(purchase) for purchase in shop_purchases]
    return jsonify(purchases_list), 200

# Create new purchase history route
@bp.route("", methods=["POST"])
def create_purchase_history():
    data = request.get_json()
    print(data)
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO purchase_history (product_id, shop_id, user_id, quantity, product_price, purchase_date, city, country, shipping_address, shipping_completed, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            data.get("product_id"),
            data.get("shop_id"),
            data.get("user_id"),
            data.get("quantity"),
            data.get("product_price"),
            data.get("purchase_date"),
            data.get("city"),
            data.get("country"),
            data.get("shipping_address"),
            data.get("shipping_completed"),
            data.get("total_price")
        )
    )
    db.commit()
    close_db()
    return jsonify({"message": "Purchase history created successfully"}), 201

# Delete purchase history by ID route
@bp.route("/<int:purchase_id>", methods=["DELETE"])
def delete_purchase_history_by_id(purchase_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM purchase_history WHERE id = ?", (purchase_id,))
    db.commit()
    return jsonify({"message": "Purchase history deleted successfully"}), 200
