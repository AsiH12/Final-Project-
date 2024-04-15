from flask import Blueprint, Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt, jwt_required,get_jwt_identity

from db import close_db, get_db
bp=Blueprint("shopsRoutes", __name__, url_prefix="/shops")

# Get all shops route
@bp.route("/", methods=["GET"])
def get_shops():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id, name, description, category, owner_id FROM shops")
    shops = cursor.fetchall()
    shop_list = [
        {
            "id": shop["id"],
            "name": shop["name"],
            "description": shop["description"],
            "category": shop["category"],
            "owner_id": shop["owner_id"],
        }
        for shop in shops
    ]
    return jsonify(shops=shop_list), 200


# Get shop by ID route
@bp.route("//<int:shop_id>", methods=["GET"])
def get_shop_by_id(shop_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT id, name, description, category, owner_id FROM shops WHERE id = ?",
        (shop_id,),
    )
    shop = cursor.fetchone()
    if shop is None:
        return jsonify({"error": "Shop not found"}), 404
    else:
        return (
            jsonify(
                {
                    "id": shop["id"],
                    "name": shop["name"],
                    "description": shop["description"],
                    "category": shop["category"],
                    "owner_id": shop["owner_id"],
                }
            ),
            200,
        )


# Create new shop route
@bp.route("/", methods=["POST"])
def create_new_shop():
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")
    category = data.get("category")
    owner_id = data.get("owner_id")

    # Validate input data
    if not all([name, category, owner_id]):
        return jsonify({"error": "Incomplete shop data"}), 400

    db = get_db()
    cursor = db.cursor()

    # Check if the owner exists
    cursor.execute("SELECT id FROM users WHERE id = ?", (owner_id,))
    existing_owner = cursor.fetchone()
    if existing_owner is None:
        return jsonify({"error": "Owner not found"}), 404

    # Insert the new shop into the database
    cursor.execute(
        "INSERT INTO shops (name, description, category, owner_id) VALUES (?, ?, ?, ?)",
        (name, description, category, owner_id),
    )
    db.commit()

    return jsonify({"message": "Shop created successfully"}), 201


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
        return (
            jsonify({"message": "Shop deleted successfully"}),
            200,
        )  # Get all managers route