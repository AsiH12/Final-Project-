from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from db import close_db, get_db
from routes import (usersRoutes, apply_discountRoute, shopsRoutes, 
                    purchase_historyRoutes, productsRoutes, 
                    categoriesRoutes, managersRoutes, 
                    discounts_productsRoutes, discount_shopsRoutes, 
                    addressesRoutes)

app = Flask(__name__)

# Load configuration from environment variables
if not app.config.from_prefixed_env():
    raise EnvironmentError("Failed to load configuration from environment variables")

# Set up CORS
FRONTEND_URL = app.config.get("FRONTEND_URL")
cors = CORS(app, origins=FRONTEND_URL, methods=["GET", "POST", "PATCH", "DELETE"])

# Set up JWT
SECRET_KEY = app.config.get("FLASK_SECRET_KEY")
print("JWT Secret Key: ", SECRET_KEY)
app.config['JWT_SECRET_KEY'] = SECRET_KEY
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
