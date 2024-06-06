from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_db, close_db

bp = Blueprint("addressesRoutes", __name__, url_prefix="/addresses")

# Get all addresses route
@bp.route("", methods=["GET"], endpoint='addresses_get_all')
@jwt_required()
def get_addresses():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id, address, city, country, user_id FROM addresses")
    addresses = cursor.fetchall()
    close_db()
    address_list = [{
        "id": address["id"],
        "address": address["address"],
        "city": address["city"],
        "country": address["country"],
        "user_id": address["user_id"]
    } for address in addresses]
    return jsonify(addresses=address_list), 200

# Get address by ID route
@bp.route("/<int:address_id>", methods=["GET"], endpoint='addresses_get_by_id')
@jwt_required()
def get_address_by_id(address_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT id, address, city, country, user_id FROM addresses WHERE id = ?", (
            address_id,)
    )
    address = cursor.fetchone()
    close_db()
    if address is None:
        return jsonify({"error": "Address not found"}), 404
    else:
        return jsonify({
            "id": address["id"],
            "address": address["address"],
            "city": address["city"],
            "country": address["country"],
            "user_id": address["user_id"]
        }), 200

# Get all addresses for a specific user
@bp.route("/user", methods=["GET"], endpoint='addresses_get_by_user_id')
@jwt_required()
def get_addresses_by_user_id():
    user_id = get_jwt_identity()
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT id, address, city, country, user_id FROM addresses WHERE user_id = ?",
        (user_id,)
    )
    addresses = cursor.fetchall()
    close_db()
    if addresses:
        address_list = [{
            "id": address["id"],
            "address": address["address"],
            "city": address["city"],
            "country": address["country"],
            "user_id": address["user_id"]
        } for address in addresses]
        return jsonify(addresses=address_list), 200
    else:
        return jsonify({"error": "No addresses found for this user"}), 404

# Create new address route
@bp.route("", methods=["POST"], endpoint='addresses_create')
@jwt_required()
def create_new_address():
    data = request.get_json()
    address = data.get("address")
    city = data.get("city")
    country = data.get("country")
    user_id = get_jwt_identity()

    # Validate input data
    if not all([address, city, country, user_id]):
        return jsonify({"error": "Incomplete address data"}), 400

    db = get_db()
    cursor = db.cursor()

    # Check if the user exists
    cursor.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    existing_user = cursor.fetchone()
    if existing_user is None:
        close_db()
        return jsonify({"error": "User not found"}), 404

    # Insert the new address into the database
    cursor.execute(
        "INSERT INTO addresses (address, city, country, user_id) VALUES (?, ?, ?, ?)",
        (address, city, country, user_id)
    )
    db.commit()
    close_db()

    return jsonify({"message": "Address created successfully"}), 201

# Update address by ID route
@bp.route("/<int:address_id>", methods=["PATCH"], endpoint='addresses_update_by_id')
@jwt_required()
def update_address_by_id(address_id):
    data = request.get_json()
    db = get_db()
    cursor = db.cursor()
    # Check if the address exists
    cursor.execute("SELECT id FROM addresses WHERE id = ?", (address_id,))
    existing_address = cursor.fetchone()
    if existing_address is None:
        close_db()
        return jsonify({"error": "Address not found"}), 404
    else:
        # Update address data
        cursor.execute(
            "UPDATE addresses SET address = ?, city = ?, country = ?, user_id = ? WHERE id = ?",
            (data.get("address"), data.get("city"), data.get("country"), get_jwt_identity(), address_id)
        )
        db.commit()
        close_db()
        return jsonify({"message": "Address updated successfully"}), 200

# Delete address by ID route
@bp.route("/<int:address_id>", methods=["DELETE"], endpoint='addresses_delete_by_id')
@jwt_required()
def delete_address_by_id(address_id):
    user_id = get_jwt_identity()  # Get the user ID from the JWT token
    db = get_db()
    cursor = db.cursor()
    
    # Check if the address exists and belongs to the user
    cursor.execute("SELECT id FROM addresses WHERE id = ? AND user_id = ?", (address_id, user_id))
    existing_address = cursor.fetchone()
    
    if existing_address is None:
        close_db()
        return jsonify({"error": "Address not found or doesn't belong to the user"}), 404
    else:
        cursor.execute("DELETE FROM addresses WHERE id = ?", (address_id,))
        db.commit()
        close_db()
        return jsonify({"message": "Address deleted successfully"}), 200

