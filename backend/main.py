from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt, jwt_required

from db import close_db, get_db

app = Flask(__name__)
app.config.from_prefixed_env()
FRONTEND_URL = app.config.get("FRONTEND_URL")
cors = CORS(app, origins=FRONTEND_URL, methods=["GET", "POST", "DELETE"])
jwt = JWTManager(app)
app.teardown_appcontext(close_db)  # Close the database connection after each request

# Login route
@app.route("/login", methods=["POST"])
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
        return jsonify({"access_token": access_token}), 200

# Logout route
@app.route("/logout", methods=["POST"])
def logout():
    # You might want to implement token invalidation or blacklist here
    return jsonify({"message": "Successfully logged out"}), 200

# Get current user route
@app.route("/users/me")
@jwt_required()
def get_me():
    token_data = get_jwt()
    user_id = token_data["sub"]
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT id, username, role, email, age FROM users WHERE id = ?", (user_id,)
    )
    user = cursor.fetchone()
    if user is None:
        return jsonify({"error": "User not found"}), 404
    else:
        return jsonify({
            "id": user["id"],
            "username": user["username"],
            "role": user["role"],
            "email": user["email"],
            "age": user["age"],
        }), 200

# Get all users route
@app.route("/users", methods=["GET"])
def get_users():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id, username, role, email, age FROM users")
    users = cursor.fetchall()
    user_list = [{
        "id": user["id"],
        "username": user["username"],
        "role": user["role"],
        "email": user["email"],
        "age": user["age"],
    } for user in users]
    return jsonify(users=user_list), 200

# Get user by ID route
@app.route("/users/<int:user_id>", methods=["GET"])
def get_user_by_id(user_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT id, username, role, email, age FROM users WHERE id = ?", (user_id,)
    )
    user = cursor.fetchone()
    if user is None:
        return jsonify({"error": "User not found"}), 404
    else:
        return jsonify({
            "id": user["id"],
            "username": user["username"],
            "role": user["role"],
            "email": user["email"],
            "age": user["age"],
        }), 200

# Create new user route
@app.route("/users", methods=["POST"])
def create_new_user():
    data = request.get_json()
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
    cursor.execute("SELECT id FROM users WHERE username = ? OR email = ?", (username, email))
    existing_user = cursor.fetchone()
    if existing_user:
        return jsonify({"error": "Username or email already exists"}), 400

    # Insert the new user into the database
    cursor.execute(
        "INSERT INTO users (username, password, role, email, age) VALUES (?, ?, ?, ?, ?)",
        (username, password, role, email, age)
    )
    db.commit()

    return jsonify({"message": "User created successfully"}), 201

# Registration route
@app.route("/register", methods=["POST"])
def register_user():
    data = request.get_json()

    # Validate incoming data
    if not all(key in data for key in ("username", "password", "email", "age")):
        return jsonify({"error": "Incomplete user data"}), 400

    username = data["username"]
    password = data["password"]
    email = data["email"]
    age = data["age"]

    # Check if the username or email already exists
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id FROM users WHERE username = ? OR email = ?", (username, email))
    existing_user = cursor.fetchone()
    if existing_user:
        return jsonify({"error": "Username or email already exists"}), 400

    # Insert the new user into the database
    cursor.execute(
        "INSERT INTO users (username, password, email, age) VALUES (?, ?, ?, ?)",
        (username, password, email, age)
    )
    db.commit()

    return jsonify({"message": "User registered successfully"}), 201
