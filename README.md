# Amazon Clone


A full-stack e-commerce web application inspired by Amazon, developed using the MERN stack. The project provides customer shopping functionality along with an administrator dashboard for managing products, users, orders, and inventory.


## 🚀 Features


### User Features


- User registration and login
- JWT-based authentication
- Secure password hashing using bcrypt
- User profile management
- Browse products
- Search and filter products
- View product details
- Add products to cart
- Update cart quantities
- Remove products from cart
- Checkout
- Place orders
- View order history
- Track order status
- Payment processing and verification


### Admin Features


- Admin authentication and authorization
- Admin dashboard
- Product management
- Create products
- Update products
- Delete products
- Product image upload
- User management
- Order management
- Inventory management
- Order status management
- Dashboard statistics
- Revenue and order information


## 🛠️ Technology Stack


### Frontend


- React.js
- JavaScript
- HTML5
- CSS3
- Vite


### Backend


- Node.js
- Express.js
- REST APIs
- JWT
- bcrypt
- Multer


### Database


- MongoDB
- Mongoose


### Tools


- Git
- GitHub
- Postman
- MongoDB Compass


## 🏗️ Project Architecture


```text
Amazon_clone/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
🔐 Authentication & Authorization

The application implements authentication and authorization using:

JWT authentication
bcrypt password hashing
Protected routes
Role-based authorization
Admin-only operations
User session handling

The backend verifies authenticated users before allowing access to protected resources.

🔄 Application Flow
User
  ↓
React Frontend
  ↓
REST API Request
  ↓
Express.js Server
  ↓
Middleware
  ↓
Authentication / Authorization
  ↓
Controller
  ↓
Mongoose
  ↓
MongoDB
  ↓
JSON Response
  ↓
React Frontend
🛒 Shopping Flow
Browse Products
      ↓
Product Details
      ↓
Add to Cart
      ↓
Update Cart
      ↓
Checkout
      ↓
Payment
      ↓
Create Order
      ↓
Order Confirmation
      ↓
Order History
👨‍💼 Admin Flow
Admin Login
     ↓
JWT Authentication
     ↓
Role Verification
     ↓
Admin Dashboard
     ↓
 ┌───────────────┬───────────────┐
 ↓               ↓               ↓
Products        Users           Orders
 ↓               ↓               ↓
CRUD          Management      Management
     \             |             /
      \            |            /
       └────── Inventory ───────┘
📡 REST API Modules

The backend provides REST APIs for:

Authentication
Register
Login
Logout
Profile
Email Verification
Password Reset
Products
Get Products
Get Product Details
Create Product
Update Product
Delete Product
Cart
Get Cart
Add Item
Update Quantity
Remove Item
Clear Cart
Orders
Create Order
Get Orders
Get Order Details
Update Order Status
Payments
Create Payment
Verify Payment
Admin
Dashboard Statistics
User Management
Product Management
Order Management
Inventory Management
🔒 Security

The backend includes security mechanisms such as:

JWT authentication
bcrypt password hashing
Role-based authorization
Protected API routes
Helmet security middleware
CORS configuration
Rate limiting
Input validation
Multer file validation
Centralized error handling
🗄️ Database Models

The application uses MongoDB with Mongoose.

Main models include:

User
Product
Cart
Order
User

Stores user authentication and profile information.

Product

Stores product information such as name, description, category, brand, price, stock and images.

Cart

Stores products selected by the user and their quantities.

Order

Stores order items, customer information, payment information and order status.

🧪 Testing

Backend APIs can be tested using Postman.

Testing includes:

User registration
User login
JWT authentication
Protected routes
Admin authorization
Product CRUD
Cart operations
Order creation
Payment APIs
Error responses
⚙️ Installation
1. Clone the repository
git clone https://github.com/NikhilTANWAR0202/Amazon_clone.git
2. Enter the project
cd Amazon_clone
3. Install frontend dependencies
cd client
npm install
4. Install backend dependencies
cd ../server
npm install
5. Configure environment variables

Create the required .env files based on the provided .env.example files.

Example:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
6. Start the backend
cd server
npm start
7. Start the frontend
cd client
npm run dev

👨‍💻 Developers

 Nikhil Tanwar
 Nikhil Gautam
 Nischay

📌 Project Purpose

This project was developed to understand and implement full-stack web application development using the MERN stack, including frontend development, REST API development, authentication, authorization, database integration, e-commerce functionality, and administrator operations.

📄 License

This project is developed for educational and academic purposes.
