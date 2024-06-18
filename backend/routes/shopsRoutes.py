from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from db import get_db, close_db

bp = Blueprint("shopsRoutes", __name__, url_prefix="/shops")

# Get all shops route


@bp.route("/", methods=["GET"], endpoint='shops_get_all')
@cross_origin(origins="http://localhost:5173")
def get_shops():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT s.id, s.name, s.description, s.owner_id, GROUP_CONCAT(DISTINCT c.category_name) AS categories, 
               GROUP_CONCAT(DISTINCT m.username) AS managers
        FROM shops s
        LEFT JOIN shops_categories sc ON s.id = sc.shop_id
        LEFT JOIN categories c ON sc.category_id = c.id
        LEFT JOIN managers sm ON s.id = sm.shop_id
        LEFT JOIN users m ON sm.manager_id = m.id
        GROUP BY s.id
    """)
    shops = cursor.fetchall()
    close_db()
    shop_list = [
        {
            "id": shop["id"],
            "name": shop["name"],
            "description": shop["description"],
            "owner_id": shop["owner_id"],
            "categories": shop["categories"].split(",") if shop["categories"] else [],
            "managers": shop["managers"].split(",") if shop["managers"] else []
        }
        for shop in shops
    ]
    return jsonify(shops=shop_list), 200

# Get shop ID by name


@bp.route("/getidbyname/<string:shop_name>", methods=["GET"], endpoint='shops_get_id_by_name')
@cross_origin(origins="http://localhost:5173")
def get_shop_id_by_name(shop_name):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id FROM shops WHERE name = ?", (shop_name,))
    shop = cursor.fetchone()
    close_db()
    if shop is None:
        return jsonify({"error": "Shop not found"}), 404
    else:
        return jsonify({"id": shop["id"]}), 200

# Get shop by ID route


@bp.route("/<int:shop_id>", methods=["GET"], endpoint='shops_get_by_id')
@cross_origin(origins="http://localhost:5173")
def get_shop_by_id(shop_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT s.id, s.name, s.description, s.owner_id, GROUP_CONCAT(DISTINCT c.category_name) AS categories, 
               GROUP_CONCAT(DISTINCT m.username) AS managers
        FROM shops s
        LEFT JOIN shops_categories sc ON s.id = sc.shop_id
        LEFT JOIN categories c ON sc.category_id = c.id
        LEFT JOIN managers sm ON s.id = sm.shop_id
        LEFT JOIN users m ON sm.manager_id = m.id
        WHERE s.id = ?
        GROUP BY s.id
    """, (shop_id,))
    shop = cursor.fetchone()
    close_db()
    if shop is None:
        return jsonify({"error": "Shop not found"}), 404
    else:
        return jsonify({
            "id": shop["id"],
            "name": shop["name"],
            "description": shop["description"],
            "owner_id": shop["owner_id"],
            "categories": shop["categories"].split(",") if shop["categories"] else [],
            "managers": shop["managers"].split(",") if shop["managers"] else []
        }), 200

# Get shops by manager


@bp.route("/manager", methods=["GET"], endpoint='shops_get_by_manager')
@jwt_required()
@cross_origin(origins="http://localhost:5173")
def get_shops_by_manager():
    user_id = get_jwt_identity()
    db = get_db()
    cursor = db.cursor()
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
    """, (user_id, user_id, user_id))
    shops = cursor.fetchall()
    close_db()
    shop_list = [
        {
            "id": shop["id"],
            "name": shop["name"],
            "description": shop["description"],
            "owner_id": shop["owner_id"],
            "role": shop["role"]
        }
        for shop in shops
    ]
    return jsonify(shops=shop_list), 200

# Get stores by owner ID


@bp.route("/owner", methods=["GET"], endpoint='shops_get_by_owner')
@jwt_required()
@cross_origin(origins="http://localhost:5173")
def get_stores_by_owner_id():
    user_id = get_jwt_identity()
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT DISTINCT s.id, s.name, s.description
        FROM shops s
        LEFT JOIN managers m ON s.id = m.shop_id
        WHERE s.owner_id = ?
    """, (user_id,))
    stores = cursor.fetchall()
    close_db()
    store_list = [
        {
            "id": store["id"],
            "name": store["name"],
            "description": store["description"]
        }
        for store in stores
    ]
    return jsonify(stores=store_list), 200

# Get my stores


@bp.route("/my-stores", methods=["GET"], endpoint='shops_get_my_stores')
@jwt_required()
@cross_origin(origins="http://localhost:5173")
def get_my_stores():
    current_user_id = get_jwt_identity()
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT DISTINCT s.id, s.name, s.description
        FROM shops s
        LEFT JOIN managers m ON s.id = m.shop_id
        WHERE s.owner_id = ? OR m.manager_id = ?
    """, (current_user_id, current_user_id))
    stores = cursor.fetchall()
    close_db()
    store_list = [
        {
            "id": store["id"],
            "name": store["name"],
            "description": store["description"]
        }
        for store in stores
    ]
    return jsonify(stores=store_list), 200

# Create new shop route


@bp.route("/new", methods=["POST"], endpoint='shops_create')
@jwt_required()
@cross_origin(origins="http://localhost:5173")
def create_new_shop():
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")
    owner_id = get_jwt_identity()
    categories = data.get("categories", [])
    managers = data.get("managers", [])

    if not name or not owner_id:
        return jsonify({"error": "Name and owner ID are required"}), 400

    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute("""
            INSERT INTO shops (name, description, owner_id)
            VALUES (?, ?, ?)
        """, (name, description, owner_id))
        shop_id = cursor.lastrowid

        category_ids = []
        for category_name in categories:
            cursor.execute(
                "SELECT id FROM categories WHERE category_name = ?", (category_name,))
            category = cursor.fetchone()
            if category:
                category_ids.append(category["id"])
            else:
                cursor.execute(
                    "INSERT INTO categories (category_name) VALUES (?)", (category_name,))
                category_ids.append(cursor.lastrowid)

        for category_id in category_ids:
            cursor.execute(
                "INSERT INTO shops_categories (shop_id, category_id) VALUES (?, ?)", (shop_id, category_id))

        manager_ids = []
        for manager_username in managers:
            cursor.execute(
                "SELECT id FROM users WHERE username = ?", (manager_username,))
            manager = cursor.fetchone()
            if manager:
                manager_ids.append(manager["id"])

        for manager_id in manager_ids:
            cursor.execute(
                "INSERT INTO managers (manager_id, shop_id) VALUES (?, ?)", (manager_id, shop_id))

        db.commit()
        close_db()
        return jsonify({"message": "Shop created successfully"}), 201
    except db.IntegrityError:
        db.rollback()
        close_db()
        return jsonify({"error": "Shop name already exists"}), 409

# Update shop by ID route


@bp.route("/<int:shop_id>", methods=["PATCH"], endpoint='shops_update')
@jwt_required()
@cross_origin(origins="http://localhost:5173")
def update_shop_by_id(shop_id):
    data = request.get_json()
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id FROM shops WHERE id = ?", (shop_id,))
    existing_shop = cursor.fetchone()
    if existing_shop is None:
        close_db()
        return jsonify({"error": "Shop not found"}), 404
    else:
        cursor.execute(
            "UPDATE shops SET name = ?, description = ?, owner_id = ? WHERE id = ?",
            (
                data.get("name"),
                data.get("description"),
                data.get("owner_id"),
                shop_id,
            ),
        )
        db.commit()
        close_db()
        return jsonify({"message": "Shop updated successfully"}), 200




@bp.route("/<int:shop_id>", methods=["DELETE"], endpoint='shops_delete')
@jwt_required()
@cross_origin(origins="http://localhost:5173")
def delete_shop_by_id(shop_id):
    user_id = get_jwt_identity()
    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT id, owner_id FROM shops WHERE id = ?", (shop_id,))
    existing_shop = cursor.fetchone()
    if existing_shop is None:
        close_db()
        return jsonify({"error": "Shop not found"}), 404

    if existing_shop["owner_id"] != user_id:
        close_db()
        return jsonify({"error": "You are not authorized to delete this shop"}), 403

    # Delete related rows from other tables
    cursor.execute("DELETE FROM discounts_shops WHERE shop_id = ?", (shop_id,))
    cursor.execute("DELETE FROM managers WHERE shop_id = ?", (shop_id,))
    
    # Get all products of the shop to delete related discount products and product categories
    cursor.execute("SELECT id FROM products WHERE shop_id = ?", (shop_id,))
    products = cursor.fetchall()
    product_ids = [product["id"] for product in products]

    if product_ids:
        # Delete related rows from discounts_products
        cursor.execute(
            "DELETE FROM discounts_products WHERE product_id IN ({})".format(','.join('?' for _ in product_ids)),
            product_ids
        )
        
        # Delete related rows from products_categories
        cursor.execute(
            "DELETE FROM products_categories WHERE product_id IN ({})".format(','.join('?' for _ in product_ids)),
            product_ids
        )
    
    # Delete the products themselves
    cursor.execute("DELETE FROM products WHERE shop_id = ?", (shop_id,))
    
    
    # Delete the shop itself
    cursor.execute("DELETE FROM shops_categories WHERE shop_id = ?", (shop_id,))
    
    cursor.execute("DELETE FROM shops WHERE id = ?", (shop_id,))
    

    db.commit()
    close_db()
    return jsonify({"message": "Shop and related data deleted successfully"}), 200
