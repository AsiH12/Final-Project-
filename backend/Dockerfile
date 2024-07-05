# Use an official Python runtime as a parent image
FROM python:3.12-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt /app/requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variables
ENV FLASK_DEBUG=0
ENV FLASK_ENV=production
ENV FLASK_APP=app.py
ENV GUNICORN_HOST=0.0.0.0
ENV GUNICORN_PORT=8080
ENV GUNICORN_WORKERS=4
ENV GUNICORN_CMD_ARGS="--bind=${GUNICORN_HOST}:${GUNICORN_PORT} --workers=${GUNICORN_WORKERS}"

# Copy the current directory contents into the container at /app
COPY . /app

# Make the specified port available to the world outside this container
EXPOSE ${GUNICORN_PORT}

# Run app.py using gunicorn when the container launches
CMD ["gunicorn", "app:app"]
