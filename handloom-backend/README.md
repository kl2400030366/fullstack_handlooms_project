# 🧵 HandloomHub - Full Stack Application

A complete handloom e-commerce platform with role-based access for Admin, Artisan, Buyer, and Marketing Specialist.

---

## Tech Stack
- **Frontend**: React 18, React Router v6, Axios, React Toastify
- **Backend**: Spring Boot 3.2, Spring Security, JWT, JPA/Hibernate
- **Database**: MySQL 8+

---

## Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.8+
- MySQL 8+

---

## Database Setup

1. Start MySQL and run:
```sql
CREATE DATABASE handloom_db;
```
Or run the full schema:
```bash
mysql -u root -p < schema.sql
```

2. Update `src/main/resources/application.properties` with your MySQL credentials:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

---

## Backend Setup

```bash
cd handloom-backend
mvn clean install
mvn spring-boot:run
```

Backend runs on: `http://localhost:8080`

---

## Frontend Setup

```bash
cd full-handloom-frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

---

## Default Login Credentials

| Role               | Email                    | Password       |
|--------------------|--------------------------|----------------|
| Admin              | admin@handloom.com       | admin123       |
| Artisan            | artisan@handloom.com     | artisan123     |
| Buyer              | buyer@handloom.com       | buyer123       |
| Marketing          | marketing@handloom.com   | marketing123   |

---

## Features by Role

### Admin
- Dashboard with platform stats (users, products, orders, revenue)
- User management (activate/deactivate, change roles)
- Product approval/rejection
- Order management with status updates
- Revenue and sales reports

### Artisan
- Dashboard with personal sales stats
- Product listing with full CRUD (name, price, description, material, origin, image)
- Incoming order management (confirm, ship, cancel)
- Inventory management with low-stock alerts

### Buyer
- Browse and search products (filter by category, price range)
- Shopping cart with quantity management
- Checkout with delivery address
- Order tracking with status
- Wishlist management
- Post-delivery reviews and ratings

### Marketing Specialist
- Dashboard with campaign metrics
- Campaign management (create, edit, delete) with channels: Email, SMS, Social Media, Push
- Promotion/discount code management (percentage & flat discounts)
- Activate/deactivate promotions

---

## API Endpoints Summary

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Public
- `GET /api/products/public` - Browse approved products

### Admin (`/api/admin/*`)
- `GET /stats`, `GET /users`, `PUT /users/{id}/status`, `PUT /users/{id}/role`
- `GET /products`, `PUT /products/{id}/approve`, `DELETE /products/{id}`
- `GET /orders`, `PUT /orders/{id}/status`
- `GET /reports`

### Artisan (`/api/artisan/*`)
- `GET /stats`, `GET /products`, `POST /products`, `PUT /products/{id}`, `DELETE /products/{id}`
- `GET /orders`, `PUT /orders/{id}/status`
- `GET /inventory`, `PUT /inventory/{id}`

### Buyer (`/api/buyer/*`)
- `GET/POST /cart`, `PUT/DELETE /cart/{id}`
- `POST /orders`, `GET /orders`, `PUT /orders/{id}/cancel`, `POST /orders/{id}/review`
- `GET/POST /wishlist`, `DELETE /wishlist/{id}`

### Marketing (`/api/marketing/*`)
- `GET /stats`
- `GET/POST /campaigns`, `PUT/DELETE /campaigns/{id}`
- `GET/POST /promotions`, `PUT /promotions/{id}/toggle`
