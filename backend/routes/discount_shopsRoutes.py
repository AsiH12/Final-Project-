from flask import Blueprint, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_db, close_db

bp = Blueprint("discount_shopsRoutes", __name__, url_prefix="/discounts")
CORS(bp)

# Get all discounts for shops route
@bp.route("/shops", methods=["GET"])
def get_all_discounts_shops():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            SELECT ds.id, ds.shop_id, s.name as shop_name, ds.discount_code, ds.discount, ds.expiration_date, ds.minimum_amount, ds.allow_others,
                   GROUP_CONCAT(DISTINCT c.category_name) AS categories
            FROM discounts_shops ds
            LEFT JOIN shops s ON ds.shop_id = s.id
            LEFT JOIN products p ON s.id = p.shop_id
            LEFT JOIN products_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            GROUP BY ds.id
        """)
        discounts = cursor.fetchall()
        close_db()
        discounts_list = [{
            "id": discount["id"],
            "shop_id": discount["shop_id"],
            "shop_name": discount["shop_name"],
            "discount_code": discount["discount_code"],
            "discount": discount["discount"],
            "expiration_date": discount["expiration_date"],
            "minimum_amount": discount["minimum_amount"],
            "allow_others": discount["allow_others"],
            "categories": discount["categories"].split(",") if discount["categories"] else []
        } for discount in discounts]
        return jsonify(discounts=discounts_list), 200
    except Exception as e:
        close_db()
        return jsonify({"error": str(e)}), 500

# Get discount for shop by discount code route
@bp.route("/shops/<string:discount_code>", methods=["GET"])
def get_discount_shop_by_code(discount_code):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            SELECT ds.id, ds.shop_id, s.name as shop_name, ds.discount_code, ds.discount, ds.expiration_date, ds.minimum_amount, ds.allow_others,
                   GROUP_CONCAT(DISTINCT c.category_name) AS categories
            FROM discounts_shops ds
            LEFT JOIN shops s ON ds.shop_id = s.id
            LEFT JOIN products p ON s.id = p.shop_id
            LEFT JOIN products_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            WHERE ds.discount_code = ?
            GROUP BY ds.id
        """, (discount_code,))
        discount = cursor.fetchone()
        close_db()
        if discount is None:
            return jsonify({"error": "Discount not found"}), 404
        else:
            return jsonify({
                "id": discount["id"],
                "shop_id": discount["shop_id"],
                "shop_name": discount["shop_name"],
                "discount_code": discount["discount_code"],
                "discount": discount["discount"],
                "expiration_date": discount["expiration_date"],
                "minimum_amount": discount["minimum_amount"],
                "allow_others": discount["allow_others"],
                "categories": discount["categories"].split(",") if discount["categories"] else []
            }), 200
    except Exception as e:
        close_db()
        return jsonify({"error": str(e)}), 500

# Get a discount for shop by ID route
@bp.route("/shops/<int:discount_id>", methods=["GET"])
def get_discount_shop_by_id(discount_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            SELECT ds.id, ds.shop_id, s.name as shop_name, ds.discount_code, ds.discount, ds.expiration_date, ds.minimum_amount, ds.allow_others,
                   GROUP_CONCAT(DISTINCT c.category_name) AS categories
            FROM discounts_shops ds
            LEFT JOIN shops s ON ds.shop_id = s.id
            LEFT JOIN products p ON s.id = p.shop_id
            LEFT JOIN products_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            WHERE ds.id = ?
            GROUP BY ds.id
        """, (discount_id,))
        discount = cursor.fetchone()
        close_db()
        if discount is None:
            return jsonify({"error": "Discount not found"}), 404
        return jsonify({
            "id": discount["id"],
            "shop_id": discount["shop_id"],
            "shop_name": discount["shop_name"],
            "discount_code": discount["discount_code"],
            "discount": discount["discount"],
            "expiration_date": discount["expiration_date"],
            "minimum_amount": discount["minimum_amount"],
            "allow_others": discount["allow_others"],
            "categories": discount["categories"].split(",") if discount["categories"] else []
        }), 200
    except Exception as e:
        close_db()
        return jsonify({"error": str(e)}), 500

# Get discounts for a specific shop by shop ID
@bp.route("/shops/by_shop/<int:shop_id>", methods=["GET"])
def get_discounts_by_shop_id(shop_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            SELECT ds.id, ds.shop_id, s.name as shop_name, ds.discount_code, ds.discount, ds.expiration_date, ds.minimum_amount, ds.allow_others,
                   GROUP_CONCAT(DISTINCT c.category_name) AS categories
            FROM discounts_shops ds
            LEFT JOIN shops s ON ds.shop_id = s.id
            LEFT JOIN products p ON s.id = p.shop_id
            LEFT JOIN products_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            WHERE ds.shop_id = ?
            GROUP BY ds.id
        """, (shop_id,))
        discounts = cursor.fetchall()
        close_db()
        if not discounts:
            return jsonify({"error": "No discounts found for this shop"}), 404
        discounts_list = [{
            "id": discount["id"],
            "shop_id": discount["shop_id"],
            "shop_name": discount["shop_name"],
            "discount_code": discount["discount_code"],
            "discount": discount["discount"],
            "expiration_date": discount["expiration_date"],
            "minimum_amount": discount["minimum_amount"],
            "allow_others": discount["allow_others"],
            "categories": discount["categories"].split(",") if discount["categories"] else []
        } for discount in discounts]
        return jsonify(discounts=discounts_list), 200
    except Exception as e:
        close_db()
        return jsonify({"error": str(e)}), 500

# Get discounts for a specific shop by shop name
@bp.route("/shops/by_shop_name/<string:shop_name>", methods=["GET"])
def get_discounts_by_shop_name(shop_name):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            SELECT ds.id, ds.shop_id, s.name as shop_name, ds.discount_code, ds.discount, ds.expiration_date, ds.minimum_amount, ds.allow_others,
                   GROUP_CONCAT(DISTINCT c.category_name) AS categories
            FROM discounts_shops ds
            JOIN shops s ON ds.shop_id = s.id
            LEFT JOIN products p ON s.id = p.shop_id
            LEFT JOIN products_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            WHERE s.name = ?
            GROUP BY ds.id
        """, (shop_name,))
        discounts = cursor.fetchall()
        close_db()
        if not discounts:
            return jsonify({"error": "No discounts found for this shop"}), 404
        discounts_list = [{
            "id": discount["id"],
            "shop_id": discount["shop_id"],
            "shop_name": discount["shop_name"],
            "discount_code": discount["discount_code"],
            "discount": discount["discount"],
            "expiration_date": discount["expiration_date"],
            "minimum_amount": discount["minimum_amount"],
            "allow_others": discount["allow_others"],
            "categories": discount["categories"].split(",") if discount["categories"] else []
        } for discount in discounts]
        return jsonify(discounts=discounts_list), 200
    except Exception as e:
        close_db()
        return jsonify({"error": str(e)}), 500

@bp.route("/shops/user/<int:user_id>", methods=["GET"])
def get_shop_discounts_for_user(user_id):
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

        # Get all shop discounts for the relevant shops
        cursor.execute("""
            SELECT ds.id, ds.shop_id, s.name as shop_name, ds.discount_code, ds.discount, ds.expiration_date, ds.minimum_amount, ds.allow_others,
                   GROUP_CONCAT(DISTINCT c.category_name) AS categories
            FROM discounts_shops ds
            LEFT JOIN shops s ON ds.shop_id = s.id
            LEFT JOIN products p ON s.id = p.shop_id
            LEFT JOIN products_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            WHERE ds.shop_id IN ({})
            GROUP BY ds.id
        """.format(','.join('?' for _ in shop_ids)), shop_ids)

        discounts = cursor.fetchall()
        close_db()
        discounts_list = [{
            "id": discount["id"],
            "shop_id": discount["shop_id"],
            "shop_name": discount["shop_name"],
            "discount_code": discount["discount_code"],
            "discount": discount["discount"],
            "expiration_date": discount["expiration_date"],
            "minimum_amount": discount["minimum_amount"],
            "allow_others": discount["allow_others"],
            "categories": discount["categories"].split(",") if discount["categories"] else []
        } for discount in discounts]

        return jsonify(discounts=discounts_list), 200
    except Exception as e:
        close_db()
        return jsonify({"error": str(e)}), 500

@bp.route("/shops", methods=["POST"])
@jwt_required()
def create_discount_shop():
    try:
        current_user_id = get_jwt_identity()
        if request.is_json:
            data = request.get_json()
            print("Received data:", data)  # Debugging statement
            shop_id = data.get("shop_id")
            discount_code = data.get("discount_code")
            discount = data.get("discount")
            expiration_date = data.get("expiration_date")
            minimum_amount = data.get("minimum_amount")
            allow_others = data.get("allow_others")

            # Check if any required field is missing
            if shop_id is None or not discount_code or discount is None or not expiration_date or minimum_amount is None or allow_others is None:
                return jsonify({"error": "Incomplete discount data"}), 400

            db = get_db()
            cursor = db.cursor()
            
            # Verify user is manager or owner of the shop
            cursor.execute("""
                SELECT s.id
                FROM shops s
                LEFT JOIN managers m ON s.id = m.shop_id
                WHERE s.id = ? AND (s.owner_id = ? OR m.manager_id = ?)
            """, (shop_id, current_user_id, current_user_id))
            shop = cursor.fetchone()

            if not shop:
                return jsonify({"error": "User is not authorized to create a discount for this shop"}), 403

            cursor.execute("INSERT INTO discounts_shops (shop_id, discount_code, discount, expiration_date, minimum_amount, allow_others) VALUES (?, ?, ?, ?, ?, ?)", (shop_id, discount_code, discount, expiration_date, minimum_amount, allow_others))
            db.commit()
            close_db()
            return jsonify({"message": "Discount for shop created successfully"}), 201
        return jsonify({"error": "Request must be JSON"}), 400
    except Exception as e:
        print("failed here:", str(e))  # Debugging statement
        close_db()
        return jsonify({"error": str(e)}), 500

# Update a discount for shop by ID route
@bp.route("/shops/<int:discount_id>", methods=["PATCH"])
@jwt_required()
def update_discount_shop(discount_id):
    try:
        current_user_id = get_jwt_identity()
        if request.is_json:
            data = request.get_json()
            db = get_db()
            cursor = db.cursor()
            cursor.execute("""
                SELECT ds.id, ds.shop_id, s.name as shop_name, ds.discount_code, ds.discount, ds.expiration_date, ds.minimum_amount, ds.allow_others,
                       GROUP_CONCAT(DISTINCT c.category_name) AS categories
                FROM discounts_shops ds
                LEFT JOIN shops s ON ds.shop_id = s.id
                LEFT JOIN products p ON s.id = p.shop_id
                LEFT JOIN products_categories pc ON p.id = pc.product_id
                LEFT JOIN categories c ON pc.category_id = c.id
                WHERE ds.id = ?
                GROUP BY ds.id
            """, (discount_id,))
            discount = cursor.fetchone()
            if discount is None:
                close_db()
                return jsonify({"error": "Discount not found"}), 404

            # Fetch all shops where the user is either an owner or a manager
            cursor.execute("""
                SELECT s.id, s.name, s.description, s.owner_id,
                    CASE
                        WHEN s.owner_id = ? THEN 'owner'
                        ELSE 'manager'
                    END as role
                FROM shops s
                LEFT JOIN managers m ON s.id = m.shop_id
                WHERE s.owner_id = ? OR m.manager_id = ?
                GROUP BY s.id
                """, (current_user_id, current_user_id, current_user_id))
            shops = cursor.fetchall()

            # Check if the user is authorized to update the discount
            authorized = any(shop["id"] == discount["shop_id"] for shop in shops)
            if not authorized:
                close_db()
                return jsonify({"error": "You are not authorized to update this discount"}), 403

            shop_id = data.get("shop_id", discount["shop_id"])
            discount_code = data.get("discount_code", discount["discount_code"])
            discount_value = data.get("discount", discount["discount"])
            expiration_date = data.get("expiration_date", discount["expiration_date"])
            minimum_amount = data.get("minimum_amount", discount["minimum_amount"])
            allow_others = data.get("allow_others", discount["allow_others"])

            cursor.execute("UPDATE discounts_shops SET shop_id = ?, discount_code = ?, discount = ?, expiration_date = ?, minimum_amount = ?, allow_others = ? WHERE id = ?", (shop_id, discount_code, discount_value, expiration_date, minimum_amount, allow_others, discount_id))
            db.commit()
            cursor.execute("""
                SELECT ds.id, ds.shop_id, s.name as shop_name, ds.discount_code, ds.discount, ds.expiration_date, ds.minimum_amount, ds.allow_others,
                       GROUP_CONCAT(DISTINCT c.category_name) AS categories
                FROM discounts_shops ds
                LEFT JOIN shops s ON ds.shop_id = s.id
                LEFT JOIN products p ON s.id = p.shop_id
                LEFT JOIN products_categories pc ON p.id = pc.product_id
                LEFT JOIN categories c ON pc.category_id = c.id
                WHERE ds.id = ?
                GROUP BY ds.id
            """, (discount_id,))
            updated_discount = cursor.fetchone()
            close_db()
            return jsonify({
                "id": updated_discount["id"],
                "shop_id": updated_discount["shop_id"],
                "shop_name": updated_discount["shop_name"],
                "discount_code": updated_discount["discount_code"],
                "discount": updated_discount["discount"],
                "expiration_date": updated_discount["expiration_date"],
                "minimum_amount": updated_discount["minimum_amount"],
                "allow_others": updated_discount["allow_others"],
                "categories": updated_discount["categories"].split(",") if updated_discount["categories"] else []
            }), 200
        return jsonify({"error": "Request must be JSON"}), 400
    except Exception as e:
        close_db()
        return jsonify({"error": str(e)}), 500

# Delete a discount for shop by ID route
@bp.route("/shops/<int:discount_id>", methods=["DELETE"])
@jwt_required()
def delete_discount_shop(discount_id):
    try:
        current_user_id = get_jwt_identity()
        db = get_db()
        cursor = db.cursor()

        # Fetch the discount details
        cursor.execute("""
            SELECT ds.id, ds.shop_id, s.name as shop_name, ds.discount_code, ds.discount, ds.expiration_date, ds.minimum_amount, ds.allow_others,
                   GROUP_CONCAT(DISTINCT c.category_name) AS categories
            FROM discounts_shops ds
            LEFT JOIN shops s ON ds.shop_id = s.id
            LEFT JOIN products p ON s.id = p.shop_id
            LEFT JOIN products_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            WHERE ds.id = ?
            GROUP BY ds.id
        """, (discount_id,))
        discount = cursor.fetchone()
        if discount is None:
            close_db()
            return jsonify({"error": "Discount not found"}), 404

        # Fetch all shops where the user is either an owner or a manager
        cursor.execute("""
            SELECT s.id, s.name, s.description, s.owner_id,
                   CASE
                       WHEN s.owner_id = ? THEN 'owner'
                       ELSE 'manager'
                   END as role
            FROM shops s
            LEFT JOIN managers m ON s.id = m.shop_id
            WHERE s.owner_id = ? OR m.manager_id = ?
            GROUP BY s.id
        """, (current_user_id, current_user_id, current_user_id))
        shops = cursor.fetchall()

        # Check if the user is authorized to delete the discount
        authorized = any(shop["id"] == discount["shop_id"] for shop in shops)
        if not authorized:
            close_db()
            return jsonify({"error": "You are not authorized to delete this discount"}), 403

        # Delete the discount
        cursor.execute("DELETE FROM discounts_shops WHERE id = ?", (discount_id,))
        db.commit()
        close_db()
        return jsonify({"message": "Discount for shop deleted successfully"}), 200
    except Exception as e:
        close_db()
        return jsonify({"error": str(e)}), 500
