from flask import Blueprint, jsonify, request
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

from db import get_db, close_db

bp = Blueprint("apply_discounts_route", __name__,
               url_prefix="/apply-discounts")


def get_shop_id_by_product_id(cursor, product_id):
    cursor.execute("SELECT shop_id FROM products WHERE id = ?", (product_id,))
    shop = cursor.fetchone()
    print("shop_id: ", shop)

    if shop:
        return shop["shop_id"]
    else:
        raise ValueError(
            f"Failed to get the shop ID for product ID {product_id}")


def apply_discounts(cart, used_discounts, new_discount_code):
    db = get_db()
    cursor = db.cursor()

    used_discounts = list(set(used_discounts))
    all_discounts = list(
        set(used_discounts + ([new_discount_code] if new_discount_code else [])))
    valid_discounts = []

    for discount_code in all_discounts:
        cursor.execute("SELECT * FROM discounts_products WHERE discount_code = ? AND expiration_date >= ?",
                       (discount_code, datetime.now().strftime("%Y-%m-%d")))
        product_discount = cursor.fetchone()

        cursor.execute("SELECT * FROM discounts_shops WHERE discount_code = ? AND expiration_date >= ?",
                       (discount_code, datetime.now().strftime("%Y-%m-%d")))
        shop_discount = cursor.fetchone()

        if product_discount or shop_discount:
            valid_discounts.append({
                "code": discount_code,
                "product_discount": product_discount,
                "shop_discount": shop_discount,
            })
        else:
            raise ValueError(
                f"Discount code '{discount_code}' is not valid or has expired")

    cart_items = []
    original_total_price = 0
    discounted_total_price = 0

    for item in cart:
        product_id = item.get("product_id")
        shop_id = get_shop_id_by_product_id(
            cursor, product_id)  # Convert shop name to shop ID
        quantity = item.get("amount")
        cursor.execute(
            "SELECT price, maximum_discount FROM products WHERE id = ?", (product_id,))
        product = cursor.fetchone()
        if not product:
            close_db()
            raise ValueError(f"Product with ID {product_id} not found")

        original_price = product["price"]
        maximum_discount = product["maximum_discount"]
        original_total_price += original_price * quantity

        discounted_price = original_price
        for discount in valid_discounts:
            product_discount = discount["product_discount"]
            shop_discount = discount["shop_discount"]

            if product_discount and product_discount["product_id"] == product_id:
                if quantity < product_discount["minimum_amount"]:
                    close_db()
                    raise ValueError(
                        f"Product discount '{discount['code']}' requires a minimum quantity of {product_discount['minimum_amount']}")
                discount_value = product_discount["discount"]
                discounted_price *= (1 - min(discount_value,
                                     maximum_discount) / 100)

            if shop_discount and shop_discount["shop_id"] == shop_id:
                if quantity < shop_discount["minimum_amount"]:
                    close_db()
                    raise ValueError(
                        f"Shop discount '{discount['code']}' requires a minimum quantity of {shop_discount['minimum_amount']}")
                discount_value = shop_discount["discount"]
                discounted_price *= (1 - min(discount_value,
                                     maximum_discount) / 100)

        discounted_total_price += discounted_price * quantity
        cart_items.append({
            "product_id": product_id,
            "shop_id": shop_id,
            "name": item.get("name"),
            "image": item.get("image"),
            "amount": quantity,
            "discountedPrice": discounted_price,
            "originalPrice": original_price,
        })

    close_db()

    if (original_total_price == discounted_total_price):
        raise ValueError(
            f"Discount Code {new_discount_code} doesn't affect this cart.")

    else:
        return {
            "cartItems": cart_items,
            "originalTotalPrice": original_total_price,
            "discountedTotalPrice": discounted_total_price,
        }


@bp.route("", methods=["POST"])
@jwt_required()
def apply_discounts_route():
    data = request.get_json()
    cart = data.get("cart")
    used_discounts = data.get("used_discounts")
    new_discount_code = data.get("new_discount_code")

    if not cart or used_discounts is None:
        return jsonify({"error": "Cart, used discounts, or new discount code missing"}), 400

    if len(set(used_discounts)) != len(used_discounts):
        return jsonify({"error": "Cannot use the same discount code more than once"}), 400

    if new_discount_code and new_discount_code in used_discounts:
        return jsonify({"error": "Cannot use the same discount code more than once"}), 400

    try:
        discounted_cart = apply_discounts(
            cart, used_discounts, new_discount_code)
        return jsonify(discounted_cart), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500
