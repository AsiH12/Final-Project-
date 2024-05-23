from flask import Blueprint, Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt, jwt_required, get_jwt_identity

from db import close_db, get_db

app = Flask(__name__)
CORS(app)
jwt = JWTManager(app)

bp = Blueprint("usersRoutes", __name__, url_prefix="/users")


# Login route
@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT id FROM users WHERE username = ? AND password = ?",
        (data["username"], data["password"]),
    )
    user = cursor.fetchone()
    if user is None:
        return jsonify({"error": "Invalid username or password"}), 401
    else:
        access_token = create_access_token(identity=user["id"])
        return jsonify({"access_token": access_token, "user_id": user["id"]}), 200

# Logout route
@bp.route("/logout", methods=["POST"])
def logout():
    # You might want to implement token invalidation or blacklist here
    return jsonify({"message": "Successfully logged out"}), 200

# Protected route to get current user information
@bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    current_user_id = get_jwt_identity()
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT id, username, role, email, age FROM users WHERE id = ?", (current_user_id,)
    )
    user = cursor.fetchone()
    if user is None:
        return jsonify({"error": "User not found"}), 404
    else:
        return (
            jsonify(
                {
                    "id": user["id"],
                    "username": user["username"],
                    "role": user["role"],
                    "email": user["email"],
                    "age": user["age"],
                }
            ),
            200,
        )
        
# Get all users route
@bp.route("/", methods=["GET"])
def get_users():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id, username, role, email, age, password FROM users")
    users = cursor.fetchall()
    close_db()
    user_list = [
        {
            "id": user["id"],
            "username": user["username"],
            "role": user["role"],
            "email": user["email"],
            "age": user["age"],
            "password": user["password"],
        }
        for user in users
    ]
    return jsonify(users=user_list), 200

# Create new user route
@bp.route("/register", methods=["POST"])
def create_new_user():
    data = request.get_json()
    print(data)
    username = data.get("username")
    password = data.get("password")
    role = data.get("role")
    email = data.get("email")
    age = data.get("age")

    # Validate input data
    if not all([username, password, role, email, age]):
        return jsonify({"error": "Incomplete user data"}), 400

    db = get_db()
    cursor = db.cursor()

    # Check if the username or email already exists
    cursor.execute(
        "SELECT id FROM users WHERE username = ? OR email = ?", (username, email)
    )
    existing_user = cursor.fetchone()
    if existing_user:
        close_db()
        return jsonify({"error": "Username or email already exists"}), 400

    # Insert the new user into the database
    cursor.execute(
        "INSERT INTO users (username, password, role, email, age) VALUES (?, ?, ?, ?, ?)",
        (username, password, role, email, age),
    )
    db.commit()
    close_db()

    return jsonify({"message": "User created successfully"}), 201

# Get user by ID route
@bp.route("/<int:user_id>", methods=["GET"])
def get_user_by_id(user_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT id, username, role, email, age FROM users WHERE id = ?", (user_id,)
    )
    user = cursor.fetchone()
    close_db()
    if user is None:
        return jsonify({"error": "User not found"}), 404
    else:
        return (
            jsonify(
                {
                    "id": user["id"],
                    "username": user["username"],
                    "role": user["role"],
                    "email": user["email"],
                    "age": user["age"],
                }
            ),
            200,
        )

# Get available users by shop ID route
@bp.route("/shop/<int:shop_id>", methods=["GET"])
def get_available_users(shop_id):
    db = get_db()
    cursor = db.cursor()

    # Query to get users who are not owners and not managers of the specified shop
    cursor.execute("""
        SELECT u.id, u.username, u.email
        FROM users u
        WHERE u.id NOT IN (
            SELECT manager_id FROM managers WHERE shop_id = ?
        )
        AND u.id NOT IN (
            SELECT owner_id FROM shops WHERE id = ?
        )
    """, (shop_id, shop_id))

    users = cursor.fetchall()
    close_db()
    user_list = [{"id": user["id"], "username": user["username"], "email": user["email"]} for user in users]
    return jsonify(users=user_list), 200

# Get available users by shop name route
@bp.route("/shop_name/<string:shop_name>", methods=["GET"])
def get_available_users_by_shop_name(shop_name):
    db = get_db()
    cursor = db.cursor()

    # Query to get users who are not owners and not managers of the specified shop
    query = """
        SELECT u.id, u.username, u.email
        FROM users u
        WHERE u.id NOT IN (
            SELECT manager_id FROM managers m
            JOIN shops s ON m.shop_id = s.id
            WHERE s.name = ?
        )
        AND u.id NOT IN (
            SELECT owner_id FROM shops s
            WHERE s.name = ?
        )
    """
    cursor.execute(query, (shop_name, shop_name))

    users = cursor.fetchall()
    close_db()
    user_list = [{"id": user["id"], "username": user["username"], "email": user["email"]} for user in users]
    return jsonify(users=user_list), 200

# Delete user by ID route
@bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user_by_id(user_id):
    db = get_db()
    cursor = db.cursor()
    # Check if the user exists
    cursor.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    existing_user = cursor.fetchone()
    if existing_user is None:
        close_db()
        return jsonify({"error": "User not found"}), 404
    else:
        cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
        db.commit()
        close_db()
        return jsonify({"message": "User deleted successfully"}), 200

# Update user by ID route
@bp.route("/<int:user_id>", methods=["PATCH"])
def update_user_by_id(user_id):
    data = request.get_json()
    db = get_db()
    cursor = db.cursor()
    # Check if the user exists
    cursor.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    existing_user = cursor.fetchone()
    if existing_user is None:
        close_db()
        return jsonify({"error": "User not found"}), 404
    else:
        # Update user data
        cursor.execute(
            "UPDATE users SET username = ?, role = ?, email = ?, age = ? WHERE id = ?",
            (
                data.get("username"),
                data.get("role"),
                data.get("email"),
                data.get("age"),
                user_id,
            ),
        )
        db.commit()
        close_db()
        return jsonify({"message": "User updated successfully"}), 200

# Reset password route
@bp.route("/reset-password/<int:user_id>", methods=["PATCH"])
def reset_password(user_id):
    data = request.get_json()
    new_password = data.get("new_password")
    if not new_password:
        return jsonify({"error": "New password is required"}), 400

    db = get_db()
    cursor = db.cursor()

    # Check if the user exists
    cursor.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    existing_user = cursor.fetchone()
    if existing_user is None:
        close_db()
        return jsonify({"error": "User not found"}), 404

    # Update user's password
    cursor.execute(
        "UPDATE users SET password = ? WHERE id = ?", (new_password, user_id)
    )
    db.commit()
    close_db()

    return jsonify({"message": "Password reset successfully"}), 200

# Register the blueprint
app.register_blueprint(bp)

if __name__ == '__main__':
    app.run(debug=True)
