import pytest
import sqlite3

# Global variables for tokens and user IDs
user3_token = None
new_user_token = None
new_user_id = None

# Set up the testing environment
@pytest.fixture(scope="module")
def test_client():
    import sys
    import os
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
    from main import app

    # Configure the Flask app for testing
    app.config["TESTING"] = True
    app.config["JWT_SECRET_KEY"] = "test_secret_key"

    with app.test_client() as testing_client:
        with app.app_context():
            # Initialize the database
            from db import init_db
            init_db()

        yield testing_client

# Test login and signup controllersa and save their JWT TOKENS for the next tests
@pytest.fixture(scope="module", autouse=True)
def setup_tokens(test_client):
    global user3_token, new_user_token, new_user_id

    # Login with user3 and get the token
    response = test_client.post("/users/login", json={"username": "user3", "password": "1234"})
    assert response.status_code == 200
    data = response.get_json()
    user3_token = data["access_token"]

    # Create a new user using user3's token
    headers = {"Authorization": f"Bearer {user3_token}"}
    new_user_data = {
        "username": "new_user55",
        "password": "password123",
        "email": "new_user55@example.com",
        "age": 30
    }
    response = test_client.post("/users/register", json=new_user_data, headers=headers)
    assert response.status_code == 201

    # Login with the new user and get the token
    response = test_client.post("/users/login", json={"username": "new_user55", "password": "password123"})
    assert response.status_code == 200
    data = response.get_json()
    print("data")
    print(data)
    new_user_token = data["access_token"]
    new_user_id = data["user_id"]

# def test_create_user(test_client):
#     global user3_token
#     headers = {"Authorization": f"Bearer {user3_token}"}
#     new_user_data = {
#         "username": "another_user55",
#         "password": "password123",
#         "email": "another_user55@example.com",
#         "age": 25
#     }

#     response = test_client.post("/users/register", json=new_user_data, headers=headers)
#     assert response.status_code == 201

#     # Check if the user is actually added to the database
#     db = sqlite3.connect("data.db")
#     cursor = db.cursor()
#     cursor.execute("SELECT * FROM users WHERE username = ?", (new_user_data["username"],))
#     user = cursor.fetchone()
#     db.close()

#     assert user is not None
#     assert user[1] == new_user_data["username"]
#     assert user[3] == new_user_data["email"]

def test_update_user(test_client):
    global new_user_token, new_user_id
    update_user_data = {
        "username": "updated_user555",
        "email": "updated_user555@example.com",
        "age": 35
    }

    headers = {"Authorization": f"Bearer {new_user_token}"}
    response = test_client.patch("/users", json=update_user_data, headers=headers)
    assert response.status_code == 200

    # Check if the user is actually updated in the database
    db = sqlite3.connect("data.db")
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (new_user_id,))
    user = cursor.fetchone()
    db.close()
    


    assert user is not None
    assert user[1] == update_user_data["username"]
    assert user[3] == update_user_data["email"]

def test_reset_password(test_client):
    global new_user_token, new_user_id
    reset_password_data = {
        "new_password": "new_password123"
    }

    headers = {"Authorization": f"Bearer {new_user_token}"}
    response = test_client.patch("/users/reset-password", json=reset_password_data, headers=headers)
    assert response.status_code == 200

    # Check if the password is actually updated in the database
    db = sqlite3.connect("data.db")
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (new_user_id,))
    user = cursor.fetchone()
    db.close()
    
    print("userrrr")
    print(user)

    assert user is not None
    assert user[2] == reset_password_data["new_password"]

def test_delete_user(test_client):
    global user3_token, new_user_id
    headers = {"Authorization": f"Bearer {user3_token}"}
    response = test_client.delete(f"/users/{new_user_id}", headers=headers)
    assert response.status_code == 200

    # Check if the user is actually deleted from the database
    db = sqlite3.connect("data.db")
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (new_user_id,))
    user = cursor.fetchone()
    db.close()

    assert user is None
