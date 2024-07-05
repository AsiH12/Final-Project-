import pytest
import sqlite3
import os
import bcrypt
from scripts.hash_passwords import hash_password, check_password

# Global variables for tokens and user IDs
user3_token = None
new_user_token = None
new_user_id = None


@pytest.fixture(scope="module")
def test_client():
    import sys
    sys.path.append(os.path.abspath(
        os.path.join(os.path.dirname(__file__), '..')))
    from backend.app import app

    # Configure the Flask app for testing
    app.config["TESTING"] = True
    app.config["JWT_SECRET_KEY"] = "test_secret_key"
    app.config["DATABASE"] = os.path.join(
        os.path.dirname(__file__), '../data.db')

    with app.test_client() as testing_client:
        with app.app_context():
            # Ensure the database exists
            from db import init_db
            init_db()

        yield testing_client

# Test login and signup controllers and save their JWT TOKENS for the next tests


@pytest.fixture(scope="module", autouse=True)
def setup_tokens(test_client):
    global user3_token, new_user_token, new_user_id

    test_username = os.getenv("TEST_USERNAME")
    test_password = os.getenv("TEST_PASSWORD")

    # Login with TEST_USER and get the token
    response = test_client.post(
        "/users/login", json={"username": test_username, "password": test_password})
    assert response.status_code == 200
    data = response.get_json()
    user3_token = data["access_token"]

    # Create a new user using user3's token
    headers = {"Authorization": f"Bearer {user3_token}"}
    new_user_data = {
        "username": "new_user100",
        "password": "password100",
        "email": "new_user100@example.com",
        "age": 30
    }
    response = test_client.post(
        "/users/register", json=new_user_data, headers=headers)
    assert response.status_code == 201

    # Login with the new user and get the token
    response = test_client.post(
        "/users/login", json={"username": "new_user100", "password": "password100"})
    assert response.status_code == 200
    data = response.get_json()
    new_user_token = data["access_token"]
    new_user_id = data["user_id"]


def test_create_user(test_client):
    global user3_token
    headers = {"Authorization": f"Bearer {user3_token}"}
    new_user_data = {
        "username": "anotheruser180",
        "password": "Password103",
        "email": "anotheruser180@example.com",
        "age": 25
    }

    response = test_client.post(
        "/users/register", json=new_user_data, headers=headers)
    assert response.status_code == 201

    # Check if the user is actually added to the database
    db = sqlite3.connect(os.path.join(os.path.dirname(__file__), '../data.db'))
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?",
                   (new_user_data["username"],))
    user = cursor.fetchone()
    db.close()

    assert user is not None
    assert user[1] == new_user_data["username"]
    # assert user[2] == hash_password(new_user_data["password"])
    assert user[3] == new_user_data["email"]
    assert user[4] == new_user_data["age"]


# def test_update_user(test_client):
#     global new_user_token, new_user_id
#     update_user_data = {
#         "username": "updated_user555",
#         "email": "updated_user555@example.com",
#         "age": 35
#     }

#     headers = {"Authorization": f"Bearer {new_user_token}"}
#     response = test_client.patch(f"/users/{new_user_id}", json=update_user_data, headers=headers)
#     assert response.status_code == 200

#     # Check if the user is actually updated in the database
#     db = sqlite3.connect(os.path.join(os.path.dirname(__file__), '../data.db'))
#     cursor = db.cursor()
#     cursor.execute("SELECT * FROM users WHERE id = ?", (new_user_id,))
#     user = cursor.fetchone()
#     db.close()

#     assert user is not None
#     assert user[1] == update_user_data["username"]
#     assert user[3] == update_user_data["email"]

def test_reset_password(test_client):
    global new_user_token, new_user_id
    reset_password_data = {
        "old_password": "password100",  # Add old password
        "new_password": "new_password100"
    }

    headers = {"Authorization": f"Bearer {new_user_token}"}
    response = test_client.patch(
        "/users/reset-password", json=reset_password_data, headers=headers)
    assert response.status_code == 200

    # Check if the password is actually updated in the database
    db = sqlite3.connect(os.path.join(os.path.dirname(__file__), '../data.db'))
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (new_user_id,))
    user = cursor.fetchone()
    db.close()

    assert user is not None
    assert check_password(user[2], reset_password_data["new_password"])


def test_delete_user(test_client):
    global user3_token, new_user_id
    headers = {"Authorization": f"Bearer {user3_token}"}

    # Delete the first user
    response = test_client.delete(f"/users/{new_user_id}", headers=headers)
    assert response.status_code == 200

    # Check if the first user is actually deleted from the database
    db = sqlite3.connect(os.path.join(os.path.dirname(__file__), '../data.db'))
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (new_user_id,))
    user = cursor.fetchone()
    assert user is None

    # Find and print the second user to delete
    cursor1 = db.cursor()
    cursor1.execute("SELECT * FROM users WHERE username = 'anotheruser180'")
    user_to_delete = cursor1.fetchone()

    if user_to_delete:
        print("User to delete:", user_to_delete)
        # Assuming the user ID is the first column
        response1 = test_client.delete(
            f"/users/{user_to_delete[0]}", headers=headers)
        assert response1.status_code == 200
    else:
        print("No user found with the username 'anotheruser180'")

    db.close()
