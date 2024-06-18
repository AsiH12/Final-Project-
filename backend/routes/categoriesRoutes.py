from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from flask_cors import cross_origin
from db import get_db, close_db

bp = Blueprint("categoryRoutes", __name__, url_prefix="/categories")

# Get all categories


@bp.route("/", methods=["GET"], endpoint='categories_get_all')
@cross_origin(origins="http://localhost:5173")
def get_all_categories():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM categories")
    categories = cursor.fetchall()
    close_db()
    category_list = [{"id": category["id"], "category_name": category["category_name"]}
                     for category in categories]
    return jsonify(categories=category_list), 200

# Get category by ID


@bp.route("/<int:category_id>", methods=["GET"], endpoint='categories_get_by_id')
@cross_origin(origins="http://localhost:5173")
def get_category_by_id(category_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM categories WHERE id = ?", (category_id,))
    category = cursor.fetchone()
    close_db()
    if category is None:
        return jsonify({"error": "Category not found"}), 404
    else:
        return jsonify({"id": category["id"], "category_name": category["category_name"]}), 200

# Create new category


@bp.route("/", methods=["POST"], endpoint='categories_create')
@cross_origin(origins="http://localhost:5173")
@jwt_required()
def create_category():
    data = request.get_json()
    category_name = data.get("category_name")

    if not category_name:
        return jsonify({"error": "required"}), 400

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute(
            "INSERT INTO categories (category_name) VALUES (?)", (category_name,))
        db.commit()
        close_db()
        return jsonify({"message": "Category created successfully"}), 201
    except db.IntegrityError:
        close_db()
        return jsonify({"error": "Category already exists"}), 409

# Update category by ID


@bp.route("/<int:category_id>", methods=["PATCH"], endpoint='categories_update_by_id')
@cross_origin(origins="http://localhost:5173")
@jwt_required()
def update_category(category_id):
    data = request.get_json()
    new_category_name = data.get("category_name")

    if not new_category_name:
        return jsonify({"error": "required"}), 400

    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM categories WHERE id = ?", (category_id,))
    category = cursor.fetchone()
    if category is None:
        close_db()
        return jsonify({"error": "Category not found"}), 404

    try:
        cursor.execute("UPDATE categories SET category_name = ? WHERE id = ?",
                       (new_category_name, category_id))
        db.commit()
        close_db()
        return jsonify({"message": "Category updated successfully"}), 200
    except db.IntegrityError:
        close_db()
        return jsonify({"error": "Category name already exists"}), 409

# Delete category by ID


@bp.route("/<int:category_id>", methods=["DELETE"], endpoint='categories_delete_by_id')
@cross_origin(origins="http://localhost:5173")
@jwt_required()
def delete_category(category_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM categories WHERE id = ?", (category_id,))
    category = cursor.fetchone()
    if category is None:
        close_db()
        return jsonify({"error": "Category not found"}), 404

    cursor.execute("DELETE FROM categories WHERE id = ?", (category_id,))
    db.commit()
    close_db()
    return jsonify({"message": "Category deleted successfully"}), 200
