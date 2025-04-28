
# Mumtaz Backend API

🚀 This is the backend API for **Mumtaz Platform**, a SaaS system for managing subscriptions, accounts, stores, products, sales, and reports.

---

## ✨ Features

- User Authentication (Login/Register/Profile)
- Role-Based Access Control (AppOwner, AppAdmin, AccountOwner, etc.)
- Subscription Management (create/update/delete plans)
- Accounts & Stores Management
- Products CRUD operations + Image Uploads
- Copy products between stores
- Sales tracking and reports generation
- JWT Authentication for protected routes
- Full error handling and basic validation
- Seed data for easy testing

---

## 🛠 Requirements

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Postman (or any API testing tool)

---

## 📦 Installation Steps

1. Clone the repository:

```bash
git clone https://github.com/your-username/mumtaz-backend.git
```

2. Navigate into the project directory:

```bash
cd mumtaz-backend
```

3. Install all dependencies:

```bash
npm install
```

4. Create a `.env` file inside the project root based on the example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

5. Optionally seed initial test data:

```bash
node seeder.js
```

6. Start the development server:

```bash
npm run dev
```

✅ Your server will be available at:  
`http://localhost:5000`

---

## 📁 Project Structure

```
/backend
  /controllers
  /models
  /routes
  /middlewares
  /uploads
  config/
  server.js
  seeder.js
  README.md
```

---

## 📚 Main API Endpoints

| Method | Endpoint | Description |
|:------|:---------|:------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user and get token |
| GET | `/api/auth/profile` | Get logged-in user profile |
| CRUD | `/api/accounts` | Manage accounts |
| CRUD | `/api/stores` | Manage stores |
| CRUD | `/api/products` | Manage products |
| POST | `/api/products/copy` | Copy products between stores |
| CRUD | `/api/subscriptions` | Manage subscription plans |
| POST | `/api/sales` | Record sales |
| GET | `/api/reports/store/:storeId` | Get store sales report |
| GET | `/api/reports/product/:productId` | Get product sales report |
| POST | `/api/upload/product` | Upload product image |

---

## ⚡ Important Notes

- Ensure MongoDB is running before launching the backend server.
- All uploaded images are stored inside the `/uploads` directory.
- Use Postman or similar tool for testing APIs.
- Only authorized users with correct roles can access sensitive operations.

---

## 👨‍💻 Developer

Built with ❤️ by **Mujtaba Kamal** and **ChatGPT Assistant**.

---

## 📢 Future Enhancements

- Upgrade/Downgrade subscription plans.
- Advanced validation with libraries like Joi or express-validator.
- Add multi-image gallery support for products.
- Setup CI/CD pipelines for deployment.

---
