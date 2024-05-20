from flask import Blueprint, jsonify, request, g
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from db import get_db

bp = Blueprint("discounts_productsRoutes", __name__, url_prefix="/discounts/products")

# Get all discounts for products route
@bp.route("/", methods=["GET"])
def get_discounts_products():
    try:
        print("Attempting to fetch discounts from database")  # Debug print
        db = get_db()  # Get the database connection
        cursor = db.cursor()
        cursor.execute("SELECT id, product_id, discount_code, discount, expiration_date, minimum_amount, allow_others FROM discounts_products")
        discounts = cursor.fetchall()
        print("Discounts fetched successfully:", discounts)  # Debug print
        discounts_list = [{
            "id": discount["id"],
            "product_id": discount["product_id"],
            "discount_code": discount["discount_code"],
            "discount": discount["discount"],
            "expiration_date": discount["expiration_date"],
            "minimum_amount": discount["minimum_amount"],
            "allow_others": discount["allow_others"]
        } for discount in discounts]
        print("Discounts list:", discounts_list)  # Debug print
        return jsonify(discounts=discounts_list), 200
    except Exception as e:
        print("Error:", e)  # Debug print
        return jsonify({"error": str(e)}), 500

# Get discount for product by discount code route
@bp.route("/by-code/<string:discount_code>", methods=["GET"])
def get_discount_by_code(discount_code):
    try:
        db = get_db()  # Get the database connection
        cursor = db.cursor()
        cursor.execute(
            "SELECT id, product_id, discount_code, discount, expiration_date, minimum_amount, allow_others FROM discounts_products WHERE discount_code = ?",
            (discount_code,)
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
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get discount for product by ID route
@bp.route("/<int:discount_id>", methods=["GET"])
def get_discount_product_by_id(discount_id):
    try:
        db = get_db()  # Get the database connection
        cursor = db.cursor()
        cursor.execute(
            "SELECT id, product_id, discount_code, discount, expiration_date, minimum_amount, allow_others FROM discounts_products WHERE id = ?",
            (discount_id,)
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
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get discount for product by product ID route
@bp.route("/product/<int:product_id>", methods=["GET"])
def get_discounts_by_product_id(product_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "SELECT id, product_id, discount_code, discount, expiration_date, minimum_amount, allow_others FROM discounts_products WHERE product_id = ?",
            (product_id,)
        )
        discounts = cursor.fetchall()
        if not discounts:
            return jsonify({"error": "No discounts found for this product"}), 404
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
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get all product discounts by shop ID route
@bp.route("/by_shop/<int:shop_id>", methods=["GET"])
def get_discounts_by_shop_id(shop_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            """
            SELECT dp.id, dp.product_id, dp.discount_code, dp.discount, dp.expiration_date, dp.minimum_amount, dp.allow_others
            FROM discounts_products dp
            JOIN products p ON dp.product_id = p.id
            WHERE p.shop_id = ?
            """,
            (shop_id,)
        )
        discounts = cursor.fetchall()
        if not discounts:
            return jsonify({"error": "No discounts found for this shop"}), 404
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
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get all product discounts by shop name route
@bp.route("/by_shop_name/<string:shop_name>", methods=["GET"])
def get_discounts_by_shop_name(shop_name):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            """
            SELECT dp.id, dp.product_id, dp.discount_code, dp.discount, dp.expiration_date, dp.minimum_amount, dp.allow_others
            FROM discounts_products dp
            JOIN products p ON dp.product_id = p.id
            JOIN shops s ON p.shop_id = s.id
            WHERE s.name = ?
            """,
            (shop_name,)
        )
        discounts = cursor.fetchall()
        if not discounts:
            return jsonify({"error": "No discounts found for this shop"}), 404
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
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@bp.route("/user/<int:user_id>", methods=["GET"])
def get_discounts_for_user(user_id):
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
            return jsonify(discounts=[]), 200

        # Get all discount products for the relevant shops
        cursor.execute("""
            SELECT dp.id, dp.product_id, dp.discount_code, dp.discount, dp.expiration_date, dp.minimum_amount, dp.allow_others
            FROM discounts_products dp
            JOIN products p ON dp.product_id = p.id
            WHERE p.shop_id IN ({})
        """.format(','.join('?' for _ in shop_ids)), shop_ids)

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
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Check if a discount is applicable for the given cart
@bp.route("/check-discount", methods=["POST"])
@jwt_required()
def check_discount():
    try:
        data = request.get_json()
        discount_code = data.get("discount_code")
        cart = data.get("cart")

        print("Discount code:", discount_code)  # Debug print
        print("Cart:", cart)  # Debug print

        db = get_db()  # Get the database connection
        cursor = db.cursor()

        # Check if the discount code exists and is not expired
        cursor.execute("""
            SELECT * FROM discounts_products WHERE discount_code = ? AND expiration_date >= ?
        """, (discount_code, datetime.now().strftime("%Y-%m-%d")))
        discount = cursor.fetchone()

        print("Discount details:", discount)  # Debug print

        if discount is None:
            return jsonify({"discount_usable": False}), 200

        # Check if at least one product in the cart qualifies for the discount
        for product in cart:
            cursor.execute("""
                SELECT * FROM discounts_products WHERE product_id = ? AND discount_code = ?
            """, (product["id"], discount_code))
            matching_discount = cursor.fetchone()

            print("Matching discount for product", product["id"], ":", matching_discount)  # Debug print

            if matching_discount and product["price"] * product["amount"] >= matching_discount["minimum_amount"]:
                return jsonify({"discount_usable": True}), 200

        return jsonify({"discount_usable": False}), 200
    except Exception as e:
        print("Error:", e)  # Debug print
        return jsonify({"error": str(e)}), 500

# Create new discount for product route
@bp.route("", methods=["POST"])
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

        # Validate input data
        if not all([product_id, discount_code, discount, expiration_date, minimum_amount, allow_others]):
            return jsonify({"error": "Incomplete discount data"}), 400

        db = get_db()  # Get the database connection
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
    except Exception as e:
        print("Error:", e)  # Debug print
        return jsonify({"error": str(e)}), 500

# Update discount for product by ID route
@bp.route("/<int:discount_id>", methods=["PATCH"])
@jwt_required()
def update_discount_product_by_id(discount_id):
    try:
        data = request.get_json()
        # Check if the discount for product exists
        db = get_db()  # Get the database connection
        cursor = db.cursor()
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
    except Exception as e:
        print("Error:", e)  # Debug print
        return jsonify({"error": str(e)}), 500

# Delete discount for product by ID route
@bp.route("/<int:discount_id>", methods=["DELETE"])
@jwt_required()
def delete_discount_product_by_id(discount_id):
    try:
        # Check if the discount for product exists
        db = get_db()  # Get the database connection
        cursor = db.cursor()
        cursor.execute("SELECT id FROM discounts_products WHERE id = ?", (discount_id,))
        existing_discount = cursor.fetchone()
        if existing_discount is None:
            return jsonify({"error": "Discount for product not found"}), 404
        else:
            cursor.execute("DELETE FROM discounts_products WHERE id = ?", (discount_id,))
            db.commit()
            return jsonify({"message": "Discount for product deleted successfully"}), 200
    except Exception as e:
        print("Error:", e)  # Debug print
        return jsonify({"error": str(e)}), 500

# Function to get current user's ID
def get_current_user_id():
    return get_jwt_identity()["id"]
