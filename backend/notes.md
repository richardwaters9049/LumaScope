# LumaScope Backend (FastAPI)

## 👀 Overview

This backend is a FastAPI-based REST API that powers user registration and authentication for the LumaScope application. It uses PostgreSQL as the database, SQLAlchemy for ORM, and JWT for secure token-based authentication.

---

## 📖 Features Implemented

### ✅ User Registration

- Endpoint: `POST /users/`
- Accepts `username`, `email`, `full_name`, and `password`.
- Passwords are hashed using `bcrypt` before being stored in the database.
- Validates uniqueness of `email` and `username`.

### ✅ User Authentication

- Endpoint: `POST /login`
- Accepts form data (`email`, `password`).
- Validates credentials against stored hashed passwords.
- Returns a JWT access token if successful.
- The token contains the user's email as the `sub` (subject).

### ✅ JWT Handling

- Access tokens are signed with a secret key and have an expiration time (`30 minutes` by default).
- Protected routes can use the `get_current_user` dependency to extract and validate the current user based on the token.

### ✅ CORS Configuration

- Cross-Origin Resource Sharing (CORS) is enabled for the frontend (`http://localhost:3000`).
- Allows `POST`, `GET`, `OPTIONS`, and credentials.

---

## 📁 File Structure

```bash
app/
├── auth.py        # Authentication logic, login route, token generation
├── crud.py        # (To be implemented) DB abstraction layer
├── database.py    # DB session handling
├── main.py        # FastAPI app instance, user creation, includes auth routes
├── models.py      # (To be implemented) SQLAlchemy ORM models
├── schemas.py     # (To be implemented) Pydantic request/response models

```

---

## ⛑️ How It Works

1. User Signup

- The user registers via the /users/ endpoint.

- Backend hashes the password and stores the user in PostgreSQL.

2. User Login

- The user logs in from the frontend via the /login endpoint.

- Backend verifies credentials and responds with a JWT.

- The frontend stores the token and uses it for future authenticated requests.

3. Token Validation

- The backend can decode and validate the token for protected routes using the get_current_user function in auth.py.

---

## 🛠️ Future Improvements

- Move SQLAlchemy models to a models.py module.

- Add a proper crud.py layer for database operations.

- Implement schema validation via schemas.py using Pydantic.

- Add refresh token support for longer sessions.

- Rate limit login attempts to prevent brute-force attacks.

- Add role-based access control (RBAC).

## 🔐 Security Improvements

- Use HTTPS in production.

- Store tokens in HttpOnly cookies for better XSS protection.

- Rotate and manage JWT secret keys securely.

## 🧪 Testing & Quality

- Add unit tests for authentication and routes.

- Integrate FastAPI's dependency injection in more places.

- Use Alembic for database migrations.
