import pytest
import os

# Global variable for token
user3_token = None

shop_name_test = "testing_products_shop1"
shop_desc_test = "testing shop..."
shop_categories_test = [1, 2]
shop_id_test = None

product_name_test = "testing product..."
product_desc_test = "testing product description..."
product_price_test = 50
product_amount_test = 100
product_maximum_discount_test = 50
product_categories_test = [1, 2]

product_data = None

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

@pytest.fixture(scope="module", autouse=True)
def setup_tokens(test_client):
    global user3_token, shop_id_test, shop_name_test, shop_desc_test, shop_categories_test, product_data

    # Login with user3 and get the token
    response = test_client.post(
        "/users/login", json={"username": "new", "password": "a206130940A"})
    assert response.status_code == 200
    data = response.get_json()
    user3_token = data["access_token"]

    headers = {"Authorization": f"Bearer {user3_token}"}
    new_shop_data = {
        "name": shop_name_test,
        "description": shop_desc_test,
        "categories": shop_categories_test
    }
    response1 = test_client.post(
        "/shops/new", json=new_shop_data, headers=headers)
    assert response1.status_code == 201

    response2 = test_client.get(f'/shops/getidbyname/{shop_name_test}')
    assert response2.status_code == 200

    shop_data = response2.get_json()
    shop_id_test = shop_data["id"]

    new_product_data = {
        "name": product_name_test,
        "description": product_desc_test,
        "shop_id": shop_id_test,
        "price": product_price_test,
        "amount": product_amount_test,
        "maximum_discount": product_maximum_discount_test,
        "categories": product_categories_test
    }

    response3 = test_client.post(
        "/products", json=new_product_data, headers=headers)
    assert response3.status_code == 201

    product_data = response3.get_json()

def test_get_all_products(test_client):
    response = test_client.get("/products/")
    assert response.status_code == 200
    products = response.get_json()["products"]
    assert len(products) > 0

def test_get_product_by_id(test_client):
    headers = {"Authorization": f"Bearer {user3_token}"}
    product_id = product_data["id"]
    response = test_client.get(f"/products/{product_id}", headers=headers)
    assert response.status_code == 200
    product = response.get_json()
    assert product["id"] == product_id

def test_get_products_by_shop_id(test_client):
    headers = {"Authorization": f"Bearer {user3_token}"}
    response = test_client.get(f"/products/shop/{shop_id_test}", headers=headers)
    assert response.status_code == 200
    products = response.get_json()["products"]
    assert len(products) == 1  # Ensure there is only one product in this shop

def test_get_shop_id_by_product_id(test_client):
    headers = {"Authorization": f"Bearer {user3_token}"}
    product_id = product_data["id"]
    response = test_client.get(f"/products/getShopId/{product_id}", headers=headers)
    assert response.status_code == 200
    shop_id = response.get_json()["shop_id"]
    assert shop_id == shop_id_test

def test_update_product(test_client):
    headers = {"Authorization": f"Bearer {user3_token}"}
    product_id = product_data["id"]
    update_data = {
        "name": "updated product name",
        "description": "updated product description",
        "shop_id": shop_id_test,
        "price": 60,
        "amount": 150,
        "maximum_discount": 40,
        "categories": [1, 3]
    }
    response = test_client.patch(f"/products/{product_id}", json=update_data, headers=headers)
    assert response.status_code == 200
    updated_response = test_client.get(f"/products/{product_id}", headers=headers)
    assert updated_response.status_code == 200
    updated_product = updated_response.get_json()
    assert updated_product["name"] == update_data["name"]
    assert updated_product["description"] == update_data["description"]

def test_delete_product_and_shop(test_client):
    headers = {"Authorization": f"Bearer {user3_token}"}
    product_id = product_data["id"]
    response = test_client.delete(f"/products/{product_id}", headers=headers)
    assert response.status_code == 200

    response = test_client.delete(f"/shops/{shop_id_test}", headers=headers)
    assert response.status_code == 200
