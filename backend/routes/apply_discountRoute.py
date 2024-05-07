from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from datetime import datetime
from db import get_db

bp = Blueprint("apply_discount_route", __name__, url_prefix="/apply-discount")


# Function to check if a discount code is valid and applicable to the cart
def check_discount_validity(discount_code, cart, used_discounts):
    try:
        db = get_db()  # Get the database connection
        cursor = db.cursor()

        # Check if the discount code exists and is not expired
        cursor.execute(
            """
            SELECT * FROM discounts_products WHERE discount_code = ? AND expiration_date >= ?
        """,
            (discount_code, datetime.now().strftime("%Y-%m-%d")),
        )
        product_discount = cursor.fetchone()

        cursor.execute(
            """
            SELECT * FROM discounts_shops WHERE discount_code = ? AND expiration_date >= ?
        """,
            (discount_code, datetime.now().strftime("%Y-%m-%d")),
        )
        shop_discount = cursor.fetchone()

        if not product_discount and not shop_discount:
            raise ValueError("Discount code not found or expired")

        # Check if the discount code is already used
        if used_discounts and discount_code in used_discounts:
            raise ValueError("The code has already been used")

        # Check if the user can use this discount code for the given cart
        for item in cart:
            product_id = item.get("id")
            amount = item.get("amount")

            # Get the original price and maximum discount from the database
            cursor.execute(
                """
                SELECT price, maximum_discount FROM products WHERE id = ?
            """,
                (product_id,),
            )
            product = cursor.fetchone()

            if not product:
                raise ValueError(f"Product with ID {product_id} not found")

            original_price = product["price"]
            maximum_discount = product["maximum_discount"]

            # Check if discount applies to this product
            if product_discount and product_discount["id"] == product_id:
                # Apply product discount
                discount_value = product_discount["discount"]
                discounted_price = original_price - (
                    original_price * min(discount_value, maximum_discount) / 100
                )
            elif shop_discount:
                # Apply shop discount
                discount_value = shop_discount["discount"]
                discounted_price = original_price - (
                    original_price * min(discount_value, maximum_discount) / 100
                )
            else:
                # Discount not applicable, use the original price
                discounted_price = original_price

            # Update the cart item with the discounted price
            item["price"] = discounted_price * amount

        # Check if the discount code is allowed with used discounts
        if used_discounts:
            if product_discount and not product_discount["allow_others"]:
                if discount_code not in used_discounts:
                    raise ValueError("Double coupons aren't allowed")
            elif shop_discount and not shop_discount["allow_others"]:
                if discount_code not in used_discounts:
                    raise ValueError("Double coupons aren't allowed")

        return cart
    except ValueError as ve:
        raise ve  # Raise the ValueError to be handled in the calling function
    except Exception as e:
        print("Error:", e)
        return None


# API endpoint to apply discount to the cart
@bp.route("", methods=["POST"])
def apply_discount():
    try:
        data = request.get_json()
        discount_code = data.get("discount_code")
        cart = data.get("cart")
        used_discounts = data.get("used_discounts")

        if not discount_code or not cart:
            return jsonify({"error": "Discount code or cart data missing"}), 400

        # Check if the discount code is valid and applicable
        updated_cart = check_discount_validity(discount_code, cart, used_discounts)
        if updated_cart is None:
            return jsonify({"error": "Failed to apply discount"}), 400

        return jsonify({"updated_cart": updated_cart}), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400  # Return the error message to the frontend
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Internal server error"}), 500
