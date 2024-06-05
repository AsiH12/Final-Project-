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

# Test login and save JWT TOKEN for the next tests
@pytest.fixture(scope="module", autouse=True)
def setup_tokens(test_client):
    global user3_token

    # Login with user3 and get the token
    response = test_client.post("/users/login", json={"username": "user3", "password": "1234"})
    assert response.status_code == 200
    data = response.get_json()
    user3_token = data["access_token"]

# Test getting all shops
def test_get_shops(test_client):
    response = test_client.get("/shops/")
    assert response.status_code == 200
    data = response.get_json()
    assert "shops" in data
    assert isinstance(data["shops"], list)

# Test getting shop ID by name
def test_get_shop_id_by_name(test_client):
    response = test_client.get("/shops/getidbyname/shop1")
    assert response.status_code == 200
    data = response.get_json()
    assert "id" in data

# Test getting shop by ID
def test_get_shop_by_id(test_client):
    response = test_client.get("/shops/1")
    assert response.status_code == 200
    data = response.get_json()
    assert "id" in data
    assert data["id"] == 1

# Test getting shops by manager
def test_get_shops_by_manager(test_client):
    headers = {"Authorization": f"Bearer {user3_token}"}
    response = test_client.get("/shops/manager", headers=headers)
    assert response.status_code == 200
    data = response.get_json()
    assert "shops" in data
    assert isinstance(data["shops"], list)

# Test getting stores by owner
def test_get_stores_by_owner_id(test_client):
    headers = {"Authorization": f"Bearer {user3_token}"}
    response = test_client.get("/shops/owner", headers=headers)
    assert response.status_code == 200
    data = response.get_json()
    assert "stores" in data
    assert isinstance(data["stores"], list)

# Test getting my stores
def test_get_my_stores(test_client):
    headers = {"Authorization": f"Bearer {user3_token}"}
    response = test_client.get("/shops/my-stores", headers=headers)
    assert response.status_code == 200
    data = response.get_json()
    assert "stores" in data
    assert isinstance(data["stores"], list)

# Test creating a new shop
def test_create_new_shop(test_client):
    headers = {"Authorization": f"Bearer {user3_token}"}
    new_shop_data = {
        "name": "new_shop",
        "description": "A new shop",
        "categories": ["LifeStyle"],
        "managers": ["user4"]
    }
    response = test_client.post("/shops/new", json=new_shop_data, headers=headers)
    assert response.status_code == 201
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "Shop created successfully"

# Test updating a shop by ID
def test_update_shop_by_id(test_client):
    headers = {"Authorization": f"Bearer {user3_token}"}
    update_shop_data = {
        "name": "updated_shop",
        "description": "An updated shop",
        "owner_id": 1
    }
    response = test_client.patch("/shops/1", json=update_shop_data, headers=headers)
    assert response.status_code == 200
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "Shop updated successfully"

# Test deleting a shop by ID
def test_delete_shop_by_id(test_client):
    headers = {"Authorization": f"Bearer {user3_token}"}
    response = test_client.delete("/shops/1", headers=headers)
    assert response.status_code == 200
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "Shop deleted successfully"
