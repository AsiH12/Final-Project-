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
        purchase_history_list.bpend(purchase_dict)

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

# Create new purchase history route
@bp.route("/", methods=["POST"])
def create_purchase_history():
    data = request.get_json()
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO purchase_history (product_id, shop_id, user_id, quantity, product_price, purchase_date, city, country, shipping_address, shipping_completed, discount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
            data.get("discount")
        )
    )
    db.commit()
    return jsonify({"message": "Purchase history created successfully"}), 201

# Delete purchase history by ID route
@bp.route("/<int:purchase_id>", methods=["DELETE"])
def delete_purchase_history_by_id(purchase_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM purchase_history WHERE id = ?", (purchase_id,))
    db.commit()
    return jsonify({"message": "Purchase history deleted successfully"}), 200
