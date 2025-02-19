# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Make port 5500 available to the world outside this container
EXPOSE 5500

# Run app.py when the container launches
CMD ["python", "backend/app.py"]
