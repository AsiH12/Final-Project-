from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt, jwt_required,get_jwt_identity

from db import close_db, get_db

# Get all addresses route
@app.route("/addresses", methods=["GET"])
def get_addresses():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id, address, city, country, user_id FROM addresses")
    addresses = cursor.fetchall()
    address_list = [{
        "id": address["id"],
        "address": address["address"],
        "city": address["city"],
        "country": address["country"],
        "user_id": address["user_id"]
    } for address in addresses]
    return jsonify(addresses=address_list), 200

# Get address by ID route
@app.route("/addresses/<int:address_id>", methods=["GET"])
def get_address_by_id(address_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT id, address, city, country, user_id FROM addresses WHERE id = ?", (address_id,)
    )
    address = cursor.fetchone()
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

# Create new address route
@app.route("/addresses", methods=["POST"])
def create_new_address():
    data = request.get_json()
    address = data.get("address")
    city = data.get("city")
    country = data.get("country")
    user_id = data.get("user_id")

    # Validate input data
    if not all([address, city, country, user_id]):
        return jsonify({"error": "Incomplete address data"}), 400

    db = get_db()
    cursor = db.cursor()

    # Check if the user exists
    cursor.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    existing_user = cursor.fetchone()
    if existing_user is None:
        return jsonify({"error": "User not found"}), 404

    # Insert the new address into the database
    cursor.execute(
        "INSERT INTO addresses (address, city, country, user_id) VALUES (?, ?, ?, ?)",
        (address, city, country, user_id)
    )
    db.commit()

    return jsonify({"message": "Address created successfully"}), 201

# Update address by ID route
@app.route("/addresses/<int:address_id>", methods=["PATCH"])
def update_address_by_id(address_id):
    data = request.get_json()
    db = get_db()
    cursor = db.cursor()
    # Check if the address exists
    cursor.execute("SELECT id FROM addresses WHERE id = ?", (address_id,))
    existing_address = cursor.fetchone()
    if existing_address is None:
        return jsonify({"error": "Address not found"}), 404
    else:
        # Update address data
        cursor.execute(
            "UPDATE addresses SET address = ?, city = ?, country = ?, user_id = ? WHERE id = ?",
            (data.get("address"), data.get("city"), data.get("country"), data.get("user_id"), address_id)
        )
        db.commit()
        return jsonify({"message": "Address updated successfully"}), 200

# Delete address by ID route
@app.route("/addresses/<int:address_id>", methods=["DELETE"])
def delete_address_by_id(address_id):
    db = get_db()
    cursor = db.cursor()
    # Check if the address exists
    cursor.execute("SELECT id FROM addresses WHERE id = ?", (address_id,))
    existing_address = cursor.fetchone()
    if existing_address is None:
        return jsonify({"error": "Address not found"}), 404
    else:
        cursor.execute("DELETE FROM addresses WHERE id = ?", (address_id,))
        db.commit()
        return jsonify({"message": "Address deleted successfully"}), 200

