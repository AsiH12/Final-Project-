from flask import Blueprint, Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt, jwt_required,get_jwt_identity
from datetime import datetime

from db import close_db, get_db
bp=Blueprint("discounts_productsRoutes", __name__, url_prefix="/discounts/products")

# Get all discounts for products route
@bp.route("/", methods=["GET"])
def get_discounts_products():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id, product_id, discount_code, discount, expiration_date, minimum_amount, allow_others FROM discounts_products")
    discounts = cursor.fetchall()
    discounts_list = [{
        "id": discount["id"],
        "product_id": discount["product_id"],
        "discount_code": discount["discount_code"],
        "discount": discount["discount"],
        "expiration_date": discount["expiration_date"],
        "minimum_amount": discount["minimum_amount"],
        "allow_others": discount["allow_others"]
    } for discount in discounts]
    return jsonify(discounts=discounts_list), 200

@bp.route("/by-code/<string:discount_code>", methods=["GET"])
def get_discount_by_code(discount_code):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT id, product_id, discount_code, discount, expiration_date, minimum_amount, allow_others FROM discounts_products WHERE discount_code = ?",
        (discount_code,),
    )
    discount = cursor.fetchone()
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
            "allow_others": discount["allow_others"]
        }), 200


# Get discount for product by ID route
@bp.route("/<int:discount_id>", methods=["GET"])
def get_discount_product_by_id(discount_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT id, product_id, discount_code, discount, expiration_date, minimum_amount, allow_others FROM discounts_products WHERE id = ?", (discount_id,)
    )
    discount = cursor.fetchone()
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
            "allow_others": discount["allow_others"]
        }), 200
    
@bp.route("/check-discount", methods=["POST"])
def check_discount():
    data = request.get_json()
    discount_code = data.get("discount_code")
    cart = data.get("cart")

    db = get_db()
    cursor = db.cursor()

    # Check if the discount code exists and is not expired
    cursor.execute("""
        SELECT * FROM discounts WHERE discount_code = ? AND expiration_date >= ?
    """, (discount_code, datetime.now().strftime("%Y-%m-%d")))
    discount = cursor.fetchone()
    if discount is None:
        return jsonify({"discount_usable": False}), 200

    # Check if at least one product in the cart qualifies for the discount
    for product in cart:
        cursor.execute("""
            SELECT * FROM discounts WHERE product_id = ? AND discount_code = ?
        """, (product["id"], discount_code))
        matching_discount = cursor.fetchone()
        if matching_discount and product["price"] * product["amount"] >= matching_discount["minimum_amount"]:
            return jsonify({"discount_usable": True}), 200

    return jsonify({"discount_usable": False}), 200


# Create new discount for product route
@bp.route("", methods=["POST"])
@jwt_required()
def create_discount_product():
    data = request.get_json()
    product_id = data.get("product_id")
    discount_code = data.get("discount_code")
    discount = data.get("discount")
    expiration_date = data.get("expiration_date")
    minimum_amount = data.get("minimum_amount")
    allow_others = data.get("allow_others")

    # Validate input data
    if not all([product_id, discount_code, discount, expiration_date, minimum_amount, allow_others]):
        return jsonify({"error": "Incomplete discount data"}), 400

    db = get_db()
    cursor = db.cursor()

    # Check if the product exists
    cursor.execute("SELECT id FROM products WHERE id = ?", (product_id,))
    existing_product = cursor.fetchone()
    if existing_product is None:
        return jsonify({"error": "Product not found"}), 404

    # Insert the new discount for product into the database
    cursor.execute(
        "INSERT INTO discounts_products (product_id, discount_code, discount, expiration_date, minimum_amount, allow_others) VALUES (?, ?, ?, ?, ?, ?)",
        (product_id, discount_code, discount, expiration_date, minimum_amount, allow_others)
    )
    db.commit()

    return jsonify({"message": "Discount for product created successfully"}), 201


# Update discount for product by ID route
@bp.route("/<int:discount_id>", methods=["PATCH"])
@jwt_required()
def update_discount_product_by_id(discount_id):
    data = request.get_json()
    db = get_db()
    cursor = db.cursor()
    # Check if the discount for product exists
    cursor.execute("SELECT id FROM discounts_products WHERE id = ?", (discount_id,))
    existing_discount = cursor.fetchone()
    if existing_discount is None:
        return jsonify({"error": "Discount for product not found"}), 404
    else:
        # Update discount for product data
        cursor.execute(
            "UPDATE discounts_products SET product_id = ?, discount_code = ?, discount = ?, expiration_date = ?, minimum_amount = ?, allow_others = ? WHERE id = ?",
            (data.get("product_id"), data.get("discount_code"), data.get("discount"), data.get("expiration_date"), data.get("minimum_amount"), data.get("allow_others"), discount_id)
        )
        db.commit()
        return jsonify({"message": "Discount for product updated successfully"}), 200

# Delete discount for product by ID route
@bp.route("/<int:discount_id>", methods=["DELETE"])
@jwt_required()
def delete_discount_product_by_id(discount_id):
    db = get_db()
    cursor = db.cursor()
    # Check if the discount for product exists
    cursor.execute("SELECT id FROM discounts_products WHERE id = ?", (discount_id,))
    existing_discount = cursor.fetchone()
    if existing_discount is None:
        return jsonify({"error": "Discount for product not found"}), 404
    else:
        cursor.execute("DELETE FROM discounts_products WHERE id = ?", (discount_id,))
        db.commit()
        return jsonify({"message": "Discount for product deleted successfully"}), 200

# Function to get current user's ID
def get_current_user_id():
    return get_jwt_identity()["id"]
