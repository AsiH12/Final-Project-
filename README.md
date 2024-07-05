Before you read this readme click ctrl + shift + v to see this like a document

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
```

2. Change into the Repository Directory
Change into the directory of the cloned repository:

```bash
cd Final-Project-
```

3. To run it in development mode, you need to run the following command:

    make sure to add the necessery envs before u run it (at the end of this readme)

    First to run the server run this commands:

```bash
    cd backend

    pip install -r requirements.txt
```


    after you installed the requirements you can run the server:


```bash
    flask run
```

    Second to run the frontend run this commands:

```bash
    cd frontend

    npm install

    npm run dev
```
    

    Frontend: http://localhost:3000
    Backend: http://localhost:5000



4. Build the Docker Images - and run it on production mode

make sure to add the necessery envs before u run it (at the end of this readme)

Build the Docker images for both the frontend and backend applications. This step will download the necessary dependencies and prepare the images:

```bash
docker-compose build --no-cache
```

5. Start the Containers

Start the Docker containers for both the frontend and backend applications:

```bash
docker-compose up
```

This command will start both the frontend and backend services defined in the docker-compose.yml file.

5. Access the Application
Once the containers are up and running, you can access the application:

Frontend: http://localhost:3000
Backend: http://localhost:5000

6. Stopping the Containers

To stop the Docker containers, press Ctrl + C in the terminal where docker-compose up is running, or run the following command in another terminal:

```bash
docker-compose down
```

This command stops and removes the containers, networks, and volumes defined in the docker-compose.yml file.

Environment Variables
Ensure the following environment variables are set in your .env file located in the backend directory:


In Backend folder create the next environment files:

.env.development:

```bash
FLASK_ENV=development
FLASK_APP=app.py
FLASK_DEBUG=1
FLASK_SECRET_KEY=192b9bdd22ab9ed4d12e236c78afcb9a393ec15f71bbf5dc987d54727823bcbf
FLASK_FRONTEND_URL=http://localhost:5173
TEST_USERNAME=Ofer
TEST_PASSWORD=a206130940S8752SSSSaasasdxsa
```

.env.production:

```bash
FLASK_ENV=production
FLASK_APP=app.py
FLASK_DEBUG=0
FLASK_SECRET_KEY=192b9bdd22ab9ed4d12e236c78afcb9a393ec15f71bbf5dc987d54727823bcbf
FLASK_FRONTEND_URL=http://localhost:5173
TEST_USERNAME=new
TEST_PASSWORD=a206130940S8752SSSSaasasdxsa
```

In frontned folder create the next environment files:

.env.development:

```bash
VITE_BACKEND_URL=http://localhost:5000
VITE_APP_ENV=development
```

.env.production:
```bash
VITE_BACKEND_URL=http://localhost:5000
VITE_APP_ENV=production
```


Here are exists users you can use:

Owner of Nike and Adidad shops

```bash
username: Ofer
password: a206130940S8752SSSSaasasdxsa
```

Manager of Nike shop:

```bash
username: Asi
password: a206130940
```
Just a client:

```bash
username: Eyal
password: a206130940
```

to run the tests run this command:

```bash

cd backend

cd test

pytest {filename}.py
```


Additional Information

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