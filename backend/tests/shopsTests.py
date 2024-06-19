import pytest
import sqlite3
import os

# Global variable for token
user3_token = None
shop_name_test = "testing_shops"
shop_desc_test = "testing shop..."
shop_categories_test = [1, 2]
shop_id_test = None

# Set up the testing environment
@pytest.fixture(scope="module")
def test_client():
    import sys
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
    from main import app

    # Configure the Flask app for testing
    app.config["TESTING"] = True
    app.config["JWT_SECRET_KEY"] = "test_secret_key"
    app.config["DATABASE"] = os.path.join(os.path.dirname(__file__), '../data.db')

    with app.test_client() as testing_client:
        with app.app_context():
            # Ensure the database exists
            from db import init_db
            init_db()

        yield testing_client

# Test login and signup controllers and save their JWT TOKENS for the next tests
@pytest.fixture(scope="module", autouse=True)
def setup_tokens(test_client):
    global user3_token, shop_id_test, shop_name_test, shop_desc_test, shop_categories_test

    # Login with user3 and get the token
    response = test_client.post("/users/login", json={"username": "new", "password": "a206130940A"})
    assert response.status_code == 200
    data = response.get_json()
    user3_token = data["access_token"]

    headers = {"Authorization": f"Bearer {user3_token}"}
    new_shop_data = {
        "name": shop_name_test,
        "description": shop_desc_test,
        "categories": shop_categories_test
    }
    response1 = test_client.post("/shops/new", json=new_shop_data, headers=headers)
    assert response1.status_code == 201

    response2 = test_client.get(f'/shops/getidbyname/{shop_name_test}')
    assert response2.status_code == 200

    shop_data = response2.get_json()
    shop_id_test = shop_data["id"]

# Test getting all shops
def test_get_shops(test_client):
    response = test_client.get("/shops/")
    assert response.status_code == 200
    data = response.get_json()
    assert "shops" in data
    assert isinstance(data["shops"], list)

# Test getting shop ID by name
def test_get_shop_id_by_name(test_client):
    response = test_client.get(f"/shops/getidbyname/{shop_name_test}")
    assert response.status_code == 200
    data = response.get_json()
    assert "id" in data

# Test getting shop by ID
def test_get_shop_by_id(test_client):
    response = test_client.get(f"/shops/{shop_id_test}")
    assert response.status_code == 200
    data = response.get_json()
    assert "id" in data
    assert data["id"] == shop_id_test

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

# Test updating a shop by ID
def test_update_shop_by_id(test_client):
    headers = {"Authorization": f"Bearer {user3_token}"}
    update_shop_data = {
        "name": "updated_shop",
        "description": "An updated shop",
        "owner_id": 1
    }
    response = test_client.patch(f"/shops/{shop_id_test}", json=update_shop_data, headers=headers)
    assert response.status_code == 200
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "Shop updated successfully"

# Test deleting a shop by ID
def test_delete_shop_by_id(test_client):
    headers = {"Authorization": f"Bearer {user3_token}"}
    response = test_client.delete(f"/shops/{shop_id_test}", headers=headers)
    assert response.status_code == 200
    data = response.get_json()
    assert "message" in data
