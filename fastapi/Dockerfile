# Use an official Python runtime as a parent image
FROM python:3.13.7-alpine3.22

# Set the working directory in the container
WORKDIR /src

# Copy the requirements file into the container
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose the port FastAPI will run on
EXPOSE 8888

# Command to run the FastAPI application with Uvicorn
# CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8888", "--log-level", "info", "--reload"]
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8888", "--log-level", "info", "--workers", "2"]
