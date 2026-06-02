<!-- Author: VIJAYKUMAR -->

# E-commerce Store Backend

A full-featured e-commerce backend built with Express.js and MongoDB.

## Features

- **User Authentication** - Signup, Login with JWT
- **Product Management** - CRUD operations (Admin only)
- **Shopping Cart** - Add, remove, update items
- **Orders** - Create orders, track status
- **Reviews** - Add product reviews and ratings
- **Admin Dashboard** - Manage products and orders

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables** (`.env`):

   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

## Postman

Import the API collection and environment from the `server/` folder to test the backend with Postman.

1. Open Postman
2. Click **Import** and select `E-commerce-API.postman_collection.json`
3. Click **Import** again and select `E-commerce-API.postman_environment.json`
4. Use the `token` environment variable for protected requests

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/review` - Add review (Protected)

### Cart

- `GET /api/cart` - Get cart (Protected)
- `POST /api/cart/add` - Add to cart (Protected)
- `POST /api/cart/remove` - Remove from cart (Protected)
- `PUT /api/cart/update` - Update quantity (Protected)
- `DELETE /api/cart/clear` - Clear cart (Protected)

### Orders

- `POST /api/orders` - Create order (Protected)
- `GET /api/orders/my-orders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get order details (Protected)
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id` - Update order status (Admin)

## Authentication

Include JWT token in headers:

```
Authorization: Bearer <token>
```

## Response Format

Success:

```json
{
  "message": "Success message",
  "data": {}
}
```

Error:

```json
{
  "message": "Error message"
}
```
