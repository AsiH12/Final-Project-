import pytest
import sqlite3

# Global variable for token
user3_token = None

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


# post patch and delete
# get my-stores
# Get shops by manager
