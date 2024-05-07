from flask import Blueprint, jsonify, request
from datetime import datetime
from db import get_db

bp = Blueprint("apply_discounts_route", __name__, url_prefix="/apply-discounts")

# Function to apply discounts to the cart
def apply_discounts(cart, used_discounts, new_discount_code):
    try:
        db = get_db()  # Get the database connection
        cursor = db.cursor()

        # Remove duplicates from used_discounts
        used_discounts = list(set(used_discounts))

        # Combine used discounts and the new discount code, but remove duplicates
        all_discounts = list(set(used_discounts + ([new_discount_code] if new_discount_code else [])))

        # Fetch all valid discounts from the database
        valid_discounts = []
        for discount_code in all_discounts:
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

            if product_discount or shop_discount:
                valid_discounts.append({
                    "code": discount_code,
                    "product_discount": product_discount,
                    "shop_discount": shop_discount,
                })
            else:
                # Raise an error if the discount code is not valid
                raise ValueError(f"Discount code '{discount_code}' is not valid or has expired")

        # Check if double discounts are allowed
        non_stackable_discounts = [
            discount
            for discount in valid_discounts
            if (
                discount["product_discount"]
                and not discount["product_discount"]["allow_others"]
            )
            or (discount["shop_discount"] and not discount["shop_discount"]["allow_others"])
        ]


        # Check and handle non-stackable discounts
        if (len(non_stackable_discounts) > 1 or
            (len(non_stackable_discounts) == 1 and len(used_discounts) > 0 and new_discount_code is not None) or
            (len(non_stackable_discounts) == 1 and len(used_discounts) > 1 and new_discount_code is None)):
            non_stackable_codes = [discount["code"] for discount in non_stackable_discounts]
            raise ValueError(f"Double discounts cannot be allowed with these codes: {', '.join(non_stackable_codes)}")



        # Initialize variables
        cart_items = []
        original_total_price = 0
        discounted_total_price = 0

        # Loop through cart items and apply discounts
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
            original_total_price += original_price * amount

            # Apply discounts to the item
            discounted_price = original_price
            for discount in valid_discounts:
                product_discount = discount["product_discount"]
                shop_discount = discount["shop_discount"]

                if product_discount and product_discount["id"] == product_id:
                    discount_value = product_discount["discount"]
                    discounted_price *= (1 - min(discount_value, maximum_discount) / 100)
                elif shop_discount:
                    discount_value = shop_discount["discount"]
                    discounted_price *= (1 - min(discount_value, maximum_discount) / 100)

            discounted_total_price += discounted_price * amount
            cart_items.append({
                "name": item.get("name"),
                "originalPrice": original_price,
                "discountedPrice": discounted_price,
                "amount": amount,
            })

        return {
            "cartItems": cart_items,
            "originalTotalPrice": original_total_price,
            "discountedTotalPrice": discounted_total_price,
        }
    except ValueError as ve:
        raise ve  # Raise the ValueError to be handled in the calling function
    except Exception as e:
        print("Error:", e)
        return None


# API endpoint to apply discounts to the cart
@bp.route("", methods=["POST"])
def apply_discounts_route():
    try:
        data = request.get_json()
        cart = data.get("cart")
        print(cart)
        used_discounts = data.get("used_discounts")
        new_discount_code = data.get("new_discount_code")

        if not cart or used_discounts is None:
            return jsonify({"error": "Cart, used discounts, or new discount code missing"}), 400

        # Ensure all values in used_discounts are unique
        if len(set(used_discounts)) != len(used_discounts):
            return jsonify({"error": "Cannot use the same discount code more than once"}), 400
        
        # Ensure new discount code is not in used_discounts
        if new_discount_code and new_discount_code in used_discounts:
            return jsonify({"error": "Cannot use the same discount code more than once"}), 400

        # Apply discounts to the cart
        discounted_cart = apply_discounts(cart, used_discounts, new_discount_code)
        if discounted_cart is None:
            return jsonify({"error": "Failed to apply discounts"}), 400

        return jsonify(discounted_cart), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400  # Return the error message to the frontend
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Internal server error"}), 500