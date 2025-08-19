# backend/Dockerfile

FROM python:3.13

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# System dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m appuser
USER appuser

# Set working directory
WORKDIR /app

# Copy project files
COPY --chown=appuser:appuser . .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Expose FastAPI default port
EXPOSE 8000

# Start the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
