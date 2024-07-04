# Shop Project

This project consists of a frontend and backend application running in Docker containers. The frontend is a React application, and the backend is a Flask application.

## Project Overview

This project demonstrates a simple e-commerce application with the following features:
- User authentication
- Product listing
- Shopping cart management
- Order placement
- Discount application

## Prerequisites

Before you begin, make sure you have the following software installed:

- Docker: [Download and install Docker](https://www.docker.com/get-started)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

Follow these instructions to get the application up and running.

### 1. Clone the Repository

First, clone the repository from GitHub to your local machine:

```bash
git clone https://github.com/AsiH12/Final-Project-.git

2. Change into the Repository Directory
Change into the directory of the cloned repository:


cd Final-Project-
3. Build the Docker Images
Build the Docker images for both the frontend and backend applications. This step will download the necessary dependencies and prepare the images:


docker-compose build --no-cache
4. Start the Containers
Start the Docker containers for both the frontend and backend applications:

docker-compose up
This command will start both the frontend and backend services defined in the docker-compose.yml file.

5. Access the Application
Once the containers are up and running, you can access the application:

Frontend: http://localhost:3000
Backend: http://localhost:5000
6. Stopping the Containers
To stop the Docker containers, press Ctrl + C in the terminal where docker-compose up is running, or run the following command in another terminal:


docker-compose down
This command stops and removes the containers, networks, and volumes defined in the docker-compose.yml file.

Environment Variables
Ensure the following environment variables are set in your .env file located in the backend directory:


FLASK_APP=main.py
FLASK_DEBUG=1
FLASK_SECRET_KEY=your_secret_key
FLASK_FRONTEND_URL=http://localhost:5173
TEST_USERNAME=new
TEST_PASSWORD=your_password

Additional Information
Make sure to replace your_secret_key and your_password with actual values for your setup.

This project is part of a school assignment and demonstrates the integration of a React frontend with a Flask backend, running together using Docker.

Using the app:
1. Start by creating a user
2. Login
3. Create a store or buy existing products
4. Use discounts or create your own
5. Appoint or edit managers
6. Create products or edit them
7. Navigate through diffrent categories
8. Edit your profile (change password, add or remove addresses)
9. View your purchase history
10. Manage your stores
11. View your orders
12. Log out 


