from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_db, close_db

bp = Blueprint("manage_images", __name__, url_prefix="/images")


@bp.route('/product', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    product_id = request.form.get('product_id')
    if not product_id:
        return jsonify({"error": "No product_id provided"}), 400

    if file:
        file_data = file.read()
        try:
            db = get_db()
            cursor = db.cursor()

            # Check if the product already has an image
            cursor.execute("""
                SELECT id FROM product_images WHERE product_id = ?
            """, (product_id,))
            existing_image = cursor.fetchone()

            if existing_image:
                cursor.execute("""
                    UPDATE product_images SET image = ? WHERE product_id = ?
                """, (file_data, product_id))
            else:
                cursor.execute("""
                    INSERT INTO product_images (product_id, image)
                    VALUES (?, ?)
                """, (product_id, file_data))

            db.commit()
            return jsonify({"message": "Image uploaded successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "File type not allowed"}), 400


@bp.route('/product/<int:product_id>', methods=['GET'])
def get_product_images(product_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            SELECT image FROM product_images WHERE product_id = ?
        """, (product_id,))
        images = cursor.fetchall()
        if images:
            image_data = [image['image'] for image in images]
            return jsonify({"images": image_data}), 200
        else:
            return jsonify({"error": "No images found for this product"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route('/product/<int:product_id>', methods=['PATCH'])
def update_product_image(product_id):
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        file_data = file.read()
        try:
            db = get_db()
            cursor = db.cursor()
            cursor.execute("""
                UPDATE product_images SET image = ? WHERE product_id = ?
            """, (file_data, product_id))
            db.commit()
            return jsonify({"message": "Image updated successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "File type not allowed"}), 400


@bp.route('/product/<int:product_id>', methods=['DELETE'])
def delete_product_image(product_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "DELETE FROM product_images WHERE product_id = ?", (product_id,))
        db.commit()
        return jsonify({"message": "Image deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
