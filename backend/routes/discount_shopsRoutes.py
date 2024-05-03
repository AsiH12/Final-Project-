from flask import Blueprint, Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt, jwt_required, get_jwt_identity
from db import close_db, get_db

bp = Blueprint("discount_shopsRoutes", __name__, url_prefix="/discount")

# Get all discounts for shops route
@bp.route("/shops", methods=["GET"])
def get_all_discounts_shops():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id, shop_id, discount_code, discount, expiration_date, minimum_amount, allow_others FROM discounts_shops")
    discounts = cursor.fetchall()
    discounts_list = [{
        "id": discount["id"],
        "shop_id": discount["shop_id"],
        "discount_code": discount["discount_code"],
        "discount": discount["discount"],
        "expiration_date": discount["expiration_date"],
        "minimum_amount": discount["minimum_amount"],
        "allow_others": discount["allow_others"]
    } for discount in discounts]
    return jsonify(discounts=discounts_list), 200

# Get discount for shop by discount_code route
@bp.route("/shops/by-code/<string:discount_code>", methods=["GET"])
def get_discount_shop_by_code(discount_code):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT id, shop_id, discount_code, discount, expiration_date, minimum_amount, allow_others FROM discounts_shops WHERE discount_code = ?", (discount_code,)
    )
    discount = cursor.fetchone()
    if discount is None:
        return jsonify({"error": "Discount not found"}), 404
    else:
        return jsonify({
            "id": discount["id"],
            "shop_id": discount["shop_id"],
            "discount_code": discount["discount_code"],
            "discount": discount["discount"],
            "expiration_date": discount["expiration_date"],
            "minimum_amount": discount["minimum_amount"],
            "allow_others": discount["allow_others"]
        }), 200


# Get a discount for shop by ID route
@bp.route("/shops/<int:discount_id>", methods=["GET"])
def get_discount_shop_by_id(discount_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id, shop_id, discount_code, discount, expiration_date, minimum_amount, allow_others FROM discounts_shops WHERE id = ?", (discount_id,))
    discount = cursor.fetchone()
    if discount is None:
        return jsonify({"error": "Discount not found"}), 404
    return jsonify({
        "id": discount["id"],
        "shop_id": discount["shop_id"],
        "discount_code": discount["discount_code"],
        "discount": discount["discount"],
        "expiration_date": discount["expiration_date"],
        "minimum_amount": discount["minimum_amount"],
        "allow_others": discount["allow_others"]
    }), 200

# Create a new discount for shop route
@bp.route("/shops", methods=["POST"])
@jwt_required()
def create_discount_shop():
    current_user_id = get_jwt_identity()
    if request.is_json:
        data = request.get_json()
        shop_id = data.get("shop_id")
        discount_code = data.get("discount_code")
        discount = data.get("discount")
        expiration_date = data.get("expiration_date")
        minimum_amount = data.get("minimum_amount")
        allow_others = data.get("allow_others")

        if not all([shop_id, discount_code, discount, expiration_date, minimum_amount, allow_others]):
            return jsonify({"error": "Incomplete discount data"}), 400

        db = get_db()
        cursor = db.cursor()
        cursor.execute("INSERT INTO discounts_shops (shop_id, discount_code, discount, expiration_date, minimum_amount, allow_others) VALUES (?, ?, ?, ?, ?, ?)", (shop_id, discount_code, discount, expiration_date, minimum_amount, allow_others))
        db.commit()
        return jsonify({"message": "Discount for shop created successfully"}), 201
    return jsonify({"error": "Request must be JSON"}), 400

# Update a discount for shop by ID route
@bp.route("/shops/<int:discount_id>", methods=["PATCH"])
@jwt_required()
def update_discount_shop(discount_id):
    current_user_id = get_jwt_identity()
    if request.is_json:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM discounts_shops WHERE id = ?", (discount_id,))
        discount = cursor.fetchone()
        if discount is None:
            return jsonify({"error": "Discount not found"}), 404

        if discount["shop_id"] != current_user_id:
            return jsonify({"error": "You are not authorized to update this discount"}), 403

        shop_id = data.get("shop_id", discount["shop_id"])
        discount_code = data.get("discount_code", discount["discount_code"])
        discount_value = data.get("discount", discount["discount"])
        expiration_date = data.get("expiration_date", discount["expiration_date"])
        minimum_amount = data.get("minimum_amount", discount["minimum_amount"])
        allow_others = data.get("allow_others", discount["allow_others"])

        cursor.execute("UPDATE discounts_shops SET shop_id = ?, discount_code = ?, discount = ?, expiration_date = ?, minimum_amount = ?, allow_others = ? WHERE id = ?", (shop_id, discount_code, discount_value, expiration_date, minimum_amount, allow_others, discount_id))
        db.commit()
        return jsonify({"message": "Discount for shop updated successfully"}), 200
    return jsonify({"error": "Request must be JSON"}), 400

# Delete a discount for shop by ID route
@bp.route("/shops/<int:discount_id>", methods=["DELETE"])
@jwt_required()
def delete_discount_shop(discount_id):
    current_user_id = get_jwt_identity()
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM discounts_shops WHERE id = ?", (discount_id,))
    discount = cursor.fetchone()
    if discount is None:
        return jsonify({"error": "Discount not found"}), 404

    if discount["shop_id"] != current_user_id:
        return jsonify({"error": "You are not authorized to delete this discount"}), 403

    cursor.execute("DELETE FROM discounts_shops WHERE id = ?", (discount_id,))
    db.commit()
    return jsonify({"message": "Discount for shop deleted successfully"}), 200
