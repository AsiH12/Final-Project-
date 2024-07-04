from flask import Flask, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, decode_token
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Function to load environment variables based on FLASK_ENV
def load_environment():
    environment = os.getenv("FLASK_ENV", "development")
    print(f"Environment: {environment}")
    if environment == "development":
        load_dotenv(".env.development", override=True)
    elif environment == "production":
        load_dotenv(".env.production", override=True)
    else:
        raise EnvironmentError("Unknown FLASK_ENV value")

# Load environment variables based on FLASK_ENV
load_environment()

# Set up CORS
FRONTEND_URL = os.getenv("FLASK_FRONTEND_URL")
if FRONTEND_URL:
    print(f"Frontend URL: {FRONTEND_URL}")
    cors = CORS(app, origins=[FRONTEND_URL], methods=["GET", "POST", "PATCH", "DELETE"])
else:
    raise EnvironmentError("FLASK_FRONTEND_URL is not set in the environment variables")

# Set up JWT
SECRET_KEY = os.getenv("FLASK_SECRET_KEY")
if SECRET_KEY:
    print(f"JWT Secret Key: {SECRET_KEY}")
    app.config['JWT_SECRET_KEY'] = SECRET_KEY
else:
    raise EnvironmentError("FLASK_SECRET_KEY is not set in the environment variables")

# Set token expiration time to one week
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=168)

jwt = JWTManager(app)

# Close the database connection after each request
@app.teardown_appcontext
def close_db(error):
    pass  # Replace with your actual database close logic

# Register blueprints
from routes import (
    usersRoutes, apply_discountRoute, shopsRoutes,
    purchase_historyRoutes, productsRoutes, categoriesRoutes,
    managersRoutes, discounts_productsRoutes, discount_shopsRoutes,
    addressesRoutes, imagesRoutes
)

app.register_blueprint(usersRoutes.bp)
app.register_blueprint(shopsRoutes.bp)
app.register_blueprint(categoriesRoutes.bp)
app.register_blueprint(purchase_historyRoutes.bp)
app.register_blueprint(productsRoutes.bp)
app.register_blueprint(managersRoutes.bp)
app.register_blueprint(discounts_productsRoutes.bp)
app.register_blueprint(discount_shopsRoutes.bp)
app.register_blueprint(addressesRoutes.bp)
app.register_blueprint(apply_discountRoute.bp)
app.register_blueprint(imagesRoutes.bp)

@app.route('/inspect_token', methods=['GET'])
def inspect_token():
    token = request.headers.get('Authorization').split()[1]
    decoded_token = decode_token(token)
    expiration_time = datetime.fromtimestamp(decoded_token['exp'])
    decoded_token['exp_readable'] = expiration_time
    return decoded_token

@app.route('/test', methods=['GET'])
def test():
    return "Backend is working!"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)
