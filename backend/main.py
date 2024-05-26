from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from datetime import timedelta
from db import close_db, get_db
from routes import (usersRoutes, apply_discountRoute, shopsRoutes, 
                    purchase_historyRoutes, productsRoutes, 
                    categoriesRoutes, managersRoutes, 
                    discounts_productsRoutes, discount_shopsRoutes, 
                    addressesRoutes)

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Load configuration from environment variables
if not app.config.from_prefixed_env():
    raise EnvironmentError("Failed to load configuration from environment variables")

# Set up CORS
FRONTEND_URL = os.getenv("FLASK_FRONTEND_URL")
if FRONTEND_URL:
    cors = CORS(app, origins=FRONTEND_URL, methods=["GET", "POST", "PATCH", "DELETE"])
else:
    raise EnvironmentError("FRONTEND_URL is not set in the environment variables")

# Set up JWT
SECRET_KEY = os.getenv("FLASK_SECRET_KEY")
if SECRET_KEY:
    print("JWT Secret Key: ", SECRET_KEY)
    app.config['JWT_SECRET_KEY'] = SECRET_KEY
else:
    raise EnvironmentError("FLASK_SECRET_KEY is not set in the environment variables")

# Set token expiration time to one week
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(weeks=1)

jwt = JWTManager(app)

# Close the database connection after each request
app.teardown_appcontext(close_db)

# Register blueprints
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

if __name__ == "__main__":
    app.run(debug=True)
