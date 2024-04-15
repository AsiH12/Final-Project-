from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt, jwt_required,get_jwt_identity

from db import close_db, get_db

@app.route("/products", methods=["GET"])
def get_products():
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT id, name, description, category, shop_id, price, amount, maximum_discount FROM products"
    )
    products = cursor.fetchall()
    product_list = [
        {
            "id": product["id"],
            "name": product["name"],
            "description": product["description"],
            "category": product["category"],
            "shop_id": product["shop_id"],
            "price": product["price"],
            "amount": product["amount"],
            "maximum_discount": product["maximum_discount"],
        }
        for product in products
    ]
    return jsonify(products=product_list), 200


# Get product by ID route
@app.route("/products/<int:product_id>", methods=["GET"])
def get_product_by_id(product_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT id, name, description, category, shop_id, price, amount, maximum_discount FROM products WHERE id = ?",
        (product_id,),
    )
    product = cursor.fetchone()
    if product is None:
        return jsonify({"error": "Product not found"}), 404
    else:
        return (
            jsonify(
                {
                    "id": product["id"],
                    "name": product["name"],
                    "description": product["description"],
                    "category": product["category"],
                    "shop_id": product["shop_id"],
                    "price": product["price"],
                    "amount": product["amount"],
                    "maximum_discount": product["maximum_discount"],
                }
            ),
            200,
        )


# Create new product route
@app.route("/products", methods=["POST"])
def create_new_product():
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")
    category = data.get("category")
    shop_id = data.get("shop_id")
    price = data.get("price")
    amount = data.get("amount")
    maximum_discount = data.get("maximum_discount")

    # Validate input data
    if not all([name, category, shop_id, price, amount]):
        return jsonify({"error": "Incomplete product data"}), 400

    db = get_db()
    cursor = db.cursor()

    # Check if the shop exists
    cursor.execute("SELECT id FROM shops WHERE id = ?", (shop_id,))
    existing_shop = cursor.fetchone()
    if existing_shop is None:
        return jsonify({"error": "Shop not found"}), 404

    # Insert the new product into the database
    cursor.execute(
        "INSERT INTO products (name, description, category, shop_id, price, amount, maximum_discount) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (name, description, category, shop_id, price, amount, maximum_discount),
    )
    db.commit()

    return jsonify({"message": "Product created successfully"}), 201


# Update product by ID route
@app.route("/products/<int:product_id>", methods=["PATCH"])
def update_product_by_id(product_id):
    data = request.get_json()
    db = get_db()
    cursor = db.cursor()
    # Check if the product exists
    cursor.execute("SELECT id FROM products WHERE id = ?", (product_id,))
    existing_product = cursor.fetchone()
    if existing_product is None:
        return jsonify({"error": "Product not found"}), 404
    else:
        # Update product data
        cursor.execute(
            "UPDATE products SET name = ?, description = ?, category = ?, shop_id = ?, price = ?, amount = ?, maximum_discount = ? WHERE id = ?",
            (
                data.get("name"),
                data.get("description"),
                data.get("category"),
                data.get("shop_id"),
                data.get("price"),
                data.get("amount"),
                data.get("maximum_discount"),
                product_id,
            ),
        )
        db.commit()
        return jsonify({"message": "Product updated successfully"}), 200


# Delete product by ID route
@app.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product_by_id(product_id):
    db = get_db()
    cursor = db.cursor()
    # Check if the product exists
    cursor.execute("SELECT id FROM products WHERE id = ?", (product_id,))
    existing_product = cursor.fetchone()
    if existing_product is None:
        return jsonify({"error": "Product not found"}), 404
    else:
        cursor.execute("DELETE FROM products WHERE id = ?", (product_id,))
        db.commit()
        return jsonify({"message": "Product deleted successfully"}), 200