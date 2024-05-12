from flask import Blueprint, Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt, jwt_required, get_jwt_identity

from db import close_db, get_db
bp = Blueprint("shopsRoutes", __name__, url_prefix="/shops")

# Get all shops route
@bp.route("/", methods=["GET"])
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


@bp.route("/byname/<string:shop_name>", methods=["GET"])
def get_shop_by_name(shop_name):
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
        WHERE s.name = ?
        GROUP BY s.id
    """, (shop_name,))
    shop = cursor.fetchone()
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



# Get shop by ID route
@bp.route("/<int:shop_id>", methods=["GET"])
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
        
        
        # Get shop by name route

# Create new shop route
@bp.route("/new", methods=["POST"])
def create_new_shop():
    print(request)
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")
    owner_id = data.get("owner_id")
    categories = data.get("categories", [])  # Get categories, default to empty list if not provided
    managers = data.get("managers", [])      # Get managers, default to empty list if not provided

    if not name or not owner_id:
        return jsonify({"error": "Name and owner ID are required"}), 400

    db = get_db()
    cursor = db.cursor()

    try:
        # Insert shop details into shops table
        cursor.execute("""
            INSERT INTO shops (name, description, owner_id)
            VALUES (?, ?, ?)
        """, (name, description, owner_id))
        shop_id = cursor.lastrowid  # Get the ID of the newly inserted shop

        # Insert categories into categories table if they don't exist already, and get their IDs
        category_ids = []
        for category_name in categories:
            cursor.execute("SELECT id FROM categories WHERE category_name = ?", (category_name,))
            category = cursor.fetchone()
            if category:
                category_ids.append(category["id"])
            else:
                cursor.execute("INSERT INTO categories (category_name) VALUES (?)", (category_name,))
                category_ids.append(cursor.lastrowid)

        # Insert category IDs into shops_categories table
        for category_id in category_ids:
            cursor.execute("INSERT INTO shops_categories (shop_id, category_id) VALUES (?, ?)", (shop_id, category_id))

        # Convert manager usernames to manager IDs
        manager_ids = []
        for manager_username in managers:
            cursor.execute("SELECT id FROM users WHERE username = ?", (manager_username,))
            manager = cursor.fetchone()
            if manager:
                manager_ids.append(manager["id"])

        # Insert manager IDs into managers table
        for manager_id in manager_ids:
            cursor.execute("INSERT INTO managers (manager_id, shop_id) VALUES (?, ?)", (manager_id, shop_id))

        db.commit()
        return jsonify({"message": "Shop created successfully"}), 201
    except db.IntegrityError:
        db.rollback()
        return jsonify({"error": "Shop name already exists"}), 409
    finally:
        cursor.close()


# Update shop by ID route
@bp.route("/<int:shop_id>", methods=["PATCH"])
def update_shop_by_id(shop_id):
    data = request.get_json()
    db = get_db()
    cursor = db.cursor()
    # Check if the shop exists
    cursor.execute("SELECT id FROM shops WHERE id = ?", (shop_id,))
    existing_shop = cursor.fetchone()
    if existing_shop is None:
        return jsonify({"error": "Shop not found"}), 404
    else:
        # Update shop data
        cursor.execute(
            "UPDATE shops SET name = ?, description = ?, category = ?, owner_id = ? WHERE id = ?",
            (
                data.get("name"),
                data.get("description"),
                data.get("category"),
                data.get("owner_id"),
                shop_id,
            ),
        )
        db.commit()
        return jsonify({"message": "Shop updated successfully"}), 200


# Delete shop by ID route
@bp.route("/<int:shop_id>", methods=["DELETE"])
def delete_shop_by_id(shop_id):
    db = get_db()
    cursor = db.cursor()
    # Check if the shop exists
    cursor.execute("SELECT id FROM shops WHERE id = ?", (shop_id,))
    existing_shop = cursor.fetchone()
    if existing_shop is None:
        return jsonify({"error": "Shop not found"}), 404
    else:
        cursor.execute("DELETE FROM shops WHERE id = ?", (shop_id,))
        db.commit()
        return jsonify({"message": "Shop deleted successfully"}), 200