<!-- Author: VIJAYKUMAR -->

# Backend Setup Guide

## Installation

1. **Navigate to server directory:**

   ```bash
   cd server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

You should see:

```
MongoDB Connected: cluster0.2gcxl00.mongodb.net
Server running on port 5000
Environment: development
```

---

## Using Postman

### Step 1: Import Collections

1. Open **Postman**
2. Click **Import** (top left)
3. Choose **Upload Files**
4. Select `E-commerce-API.postman_collection.json`

### Step 2: Import Environment

1. Click the **Settings icon** (gear icon, top right)
2. Go to **Environments**
3. Click **Import**
4. Select `E-commerce-API.postman_environment.json`
5. Select the environment from the dropdown (top right)

### Step 3: Get Authentication Token

1. Go to **Authentication → Signup**
2. Click **Send**
3. Copy the token from response
4. Go to **Settings → Environments → E-commerce API Environment**
5. Paste token in `token` variable
6. Save

---

## Testing Workflow

### 1. User Registration & Login

- **POST** `/api/auth/signup` - Create new account
- **POST** `/api/auth/login` - Login and get token

### 2. Browse Products

- **GET** `/api/products` - View all products
- **GET** `/api/products?category=Electronics` - Filter by category
- **GET** `/api/products/:id` - View product details

### 3. Shopping Cart

- **POST** `/api/cart/add` - Add item to cart
- **GET** `/api/cart` - View cart
- **PUT** `/api/cart/update` - Change quantity
- **POST** `/api/cart/remove` - Remove item

### 4. Create Order

- **POST** `/api/orders` - Place order
- **GET** `/api/orders/my-orders` - View your orders

### 5. Admin Functions (Requires admin token)

- **POST** `/api/products` - Add new product
- **PUT** `/api/products/:id` - Update product
- **DELETE** `/api/products/:id` - Delete product
- **PUT** `/api/orders/:id` - Update order status

---

## Database Setup

Your MongoDB Atlas connection is already configured:

```
MONGO_URI=mongodb+srv://vu241fa04814_db_user:vijaykumar@cluster0.2gcxl00.mongodb.net/?appName=Cluster0
```

### Collections Created Automatically:

- `users` - User accounts
- `products` - Product catalog
- `carts` - Shopping carts
- `orders` - Customer orders

---

## Error Troubleshooting

### Port Already in Use

```bash
# Change PORT in .env
PORT=5001
```

### MongoDB Connection Error

- Check internet connection
- Verify MONGO_URI in `.env`
- Check MongoDB Atlas IP whitelist

### Token Expired

- Get a new token by logging in again

### Admin Access Denied

- Make sure you're using admin account token
- Set role to "admin" in MongoDB User collection

---

## API Response Examples

### Success Response

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Error Response

```json
{
  "message": "Invalid credentials"
}
```

---

## Key Features

✅ **Authentication** - Secure login with JWT tokens
✅ **Products** - Full CRUD operations
✅ **Shopping Cart** - Add, remove, update items
✅ **Orders** - Track order status
✅ **Reviews** - Add product ratings
✅ **Admin Panel** - Manage products and orders
✅ **Password Hashing** - Secure bcryptjs hashing
✅ **Input Validation** - Server-side validation
✅ **Error Handling** - Comprehensive error messages

---

## Contact & Support

For issues or questions, check the README.md in the server folder.
