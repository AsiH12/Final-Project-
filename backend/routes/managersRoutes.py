from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_db, close_db

bp = Blueprint("managersRoutes", __name__, url_prefix="/managers")

@bp.route("/", methods=["GET"], endpoint='managers_get_all')
@jwt_required()
def get_managers():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id, manager_id, shop_id FROM managers")
    managers = cursor.fetchall()
    close_db()
    manager_list = [
        {
            "id": manager["id"],
            "manager_id": manager["manager_id"],
            "shop_id": manager["shop_id"],
        }
        for manager in managers
    ]
    return jsonify(managers=manager_list), 200

# Get manager by ID route
@bp.route("/<int:manager_id>", methods=["GET"], endpoint='managers_get_by_id')
@jwt_required()
def get_manager_by_id(manager_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT id, manager_id, shop_id FROM managers WHERE id = ?", (manager_id,)
    )
    manager = cursor.fetchone()
    close_db()
    if manager is None:
        return jsonify({"error": "Manager not found"}), 404
    else:
        return (
            jsonify(
                {
                    "id": manager["id"],
                    "manager_id": manager["manager_id"],
                    "shop_id": manager["shop_id"],
                }
            ),
            200,
        )

# Get all managers of a specific shop by shop name
@bp.route("/shop_name/<string:shop_name>", methods=["GET"], endpoint='managers_get_by_shop_name')
@jwt_required()
def get_managers_by_shop_name(shop_name):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        """
        SELECT m.id, m.manager_id, m.shop_id, u.username, u.email, s.name as shop_name
        FROM managers m
        JOIN users u ON m.manager_id = u.id
        JOIN shops s ON m.shop_id = s.id
        WHERE s.name = ?
        """,
        (shop_name,)
    )
    managers = cursor.fetchall()
    close_db()
    if not managers:
        return jsonify({"error": "No managers found for this shop name"}), 404

    manager_list = [
        {
            "id": manager["id"],
            "manager_id": manager["manager_id"],
            "shop_id": manager["shop_id"],
            "username": manager["username"],
            "email": manager["email"],
            "shop_name": manager["shop_name"]
        }
        for manager in managers
    ]
    return jsonify(managers=manager_list), 200

@bp.route("/shop/<int:shop_id>", methods=["GET"], endpoint='managers_get_by_shop_id')
@jwt_required()
def get_managers_by_shop(shop_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        """
        SELECT m.id, m.manager_id, m.shop_id, u.username, u.email, s.name as shop_name
        FROM managers m
        JOIN users u ON m.manager_id = u.id
        JOIN shops s ON m.shop_id = s.id
        WHERE m.shop_id = ?
        """,
        (shop_id,)
    )
    managers = cursor.fetchall()
    close_db()
    if not managers:
        return jsonify({"error": "No managers found for this shop"}), 404

    manager_list = [
        {
            "id": manager["id"],
            "manager_id": manager["manager_id"],
            "shop_id": manager["shop_id"],
            "username": manager["username"],
            "email": manager["email"],
            "shop_name": manager["shop_name"]
        }
        for manager in managers
    ]
    return jsonify(managers=manager_list), 200

@bp.route("/owner", methods=["GET"], endpoint='managers_get_by_owner')
@jwt_required()
def get_managers_by_owner():
    db = get_db()
    cursor = db.cursor()
    user_id = get_jwt_identity()

    cursor.execute("SELECT id FROM shops WHERE owner_id = ?", (user_id,))
    shop_ids = [row["id"] for row in cursor.fetchall()]

    if not shop_ids:
        close_db()
        return jsonify({"error": "No shops found for this owner"}), 404

    query = """
        SELECT m.id, m.manager_id, m.shop_id, u.username, u.email, s.name as shop_name
        FROM managers m
        JOIN users u ON m.manager_id = u.id
        JOIN shops s ON m.shop_id = s.id
        WHERE s.id IN ({})
    """.format(','.join('?' for _ in shop_ids))
    cursor.execute(query, shop_ids)

    managers = cursor.fetchall()
    close_db()

    manager_list = [
        {
            "id": manager["id"],
            "manager_id": manager["manager_id"],
            "shop_id": manager["shop_id"],
            "username": manager["username"],
            "email": manager["email"],
            "shop_name": manager["shop_name"]
        }
        for manager in managers
    ]

    return jsonify(managers=manager_list), 200

# Create new manager route
@bp.route("", methods=["POST"], endpoint='managers_create')
@jwt_required()
def create_new_manager():
    data = request.get_json()
    manager_id = data.get("manager_id")
    shop_id = data.get("shop_id")

    if not all([manager_id, shop_id]):
        return jsonify({"error": "Incomplete manager data"}), 400

    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT id FROM users WHERE id = ?", (manager_id,))
    existing_manager = cursor.fetchone()
    cursor.execute("SELECT id FROM shops WHERE id = ?", (shop_id,))
    existing_shop = cursor.fetchone()
    if existing_manager is None or existing_shop is None:
        close_db()
        return jsonify({"error": "Manager or shop not found"}), 404

    cursor.execute(
        "INSERT INTO managers (manager_id, shop_id) VALUES (?, ?)",
        (manager_id, shop_id),
    )
    db.commit()
    close_db()

    return jsonify({"message": "Manager created successfully"}), 201

# Update manager by ID route
@bp.route("/<int:manager_id>", methods=["PATCH"], endpoint='managers_update_by_id')
@jwt_required()
def update_manager_by_id(manager_id):
    data = request.get_json()
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id FROM managers WHERE id = ?", (manager_id,))
    existing_manager = cursor.fetchone()
    if existing_manager is None:
        close_db()
        return jsonify({"error": "Manager not found"}), 404
    else:
        cursor.execute(
            "UPDATE managers SET manager_id = ?, shop_id = ? WHERE id = ?",
            (data.get("manager_id"), data.get("shop_id"), manager_id),
        )
        db.commit()
        close_db()
        return jsonify({"message": "Manager updated successfully"}), 200

# Delete manager by ID route
@bp.route("/<int:manager_id>", methods=["DELETE"], endpoint='managers_delete_by_id')
@jwt_required()
def delete_manager_by_id(manager_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id FROM managers WHERE id = ?", (manager_id,))
    existing_manager = cursor.fetchone()
    if existing_manager is None:
        close_db()
        return jsonify({"error": "Manager not found"}), 404
    else:
        cursor.execute("DELETE FROM managers WHERE id = ?", (manager_id,))
        db.commit()
        close_db()
        return jsonify({"message": "Manager deleted successfully"}), 200
