# Product Catalog Management System

A full-stack web application for managing a product catalog, built with **.NET 10**, **Angular v21**, and **MSSQL**. This application allows users to add, view, edit, and delete products through a clean and responsive interface.

---

<img width="1919" height="738" alt="Screenshot 2026-03-09 053450" src="https://github.com/user-attachments/assets/7a00ef9c-9810-4c44-b966-07ae414829ab" />
<img width="1919" height="790" alt="Screenshot 2026-03-09 053502" src="https://github.com/user-attachments/assets/e56af3d0-11bc-41e0-9465-68985bed4d7c" />
<img width="1902" height="355" alt="Screenshot 2026-03-09 053222" src="https://github.com/user-attachments/assets/801dd553-98ac-4739-a1fe-53790006995a" />

## Tech Stack

| Layer    | Technology               |
|----------|--------------------------|
| Backend  | .NET 10 Web API          |
| Frontend | Angular v21 (Standalone) |
| Database | Microsoft SQL Server     |
| ORM      | Entity Framework Core 10 |
| UI       | Bootstrap 5              |

---


## Project Structure

```
ProductManagement/
├── Server/                  # .NET 10 Web API
│   ├── Controllers/
│   │   └── ProductsController.cs
│   ├── Data/
│   │   └── AppDbContext.cs
│   ├── Models/
│   │   └── Product.cs
│   ├── appsettings.json
│   └── Program.cs
│
├── Client/                  # Angular v21 Frontend
│   └── src/
│       └── app/
│           ├── components/
│           │   ├── product-list/
│           │   └── product-form/
│           ├── models/
│           ├── services/
│           ├── app.ts
│           ├── app.html
│           ├── app.routes.ts
│           └── app.config.ts
│
└── database.sql             # SQL script to initialize the database
```

---

## Prerequisites

Make sure the following are installed on your machine:

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18 or later)
- [Angular CLI](https://angular.io/cli) v21
- [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or any MSSQL instance)
- [SQL Server Management Studio (SSMS)](https://aka.ms/ssmsfullsetup) *(optional, for database management)*

---

## Getting Started

### 1. Set Up the Database

1. Open **SQL Server Management Studio (SSMS)** and connect to your server using `.\SQLEXPRESS`.
2. Open a **New Query** window.
3. Run the `database.sql` script located in the root of this project.
4. This will create the `ProductDB` database and the `Products` table.

### 2. Configure the Backend

Open `Server/appsettings.json` and verify the connection string matches your SQL Server instance:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=ProductDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Update the `Server` value if your instance name is different.

### 3. Run the Backend

Open a terminal in the `Server` folder and run:

```bash
dotnet run --launch-profile http
```

The API will start at: **http://localhost:5286**

### 4. Run the Frontend

Open a second terminal in the `Client` folder and run:

```bash
npm install
npm start
```

The application will open at: **http://localhost:4200**

---

## API Endpoints

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | `/api/products`           | Get all products         |
| GET    | `/api/products/{id}`      | Get a product by ID      |
| POST   | `/api/products`           | Create a new product     |
| PUT    | `/api/products/{id}`      | Update an existing product |
| DELETE | `/api/products/{id}`      | Delete a product         |

---

## Features

- 📋 **Product List** — View all products in a table with ID, Title, Description, Price, Quantity, and last updated date.
- ➕ **Add Product** — Fill in a form to create a new product.
- ✏️ **Edit Product** — Update any product's details using the same form.
- 🗑️ **Delete Product** — Remove a product with a confirmation dialog.
- 🔎 **Search and Filter** — Quickly find products by title/description and stock status.
- 📊 **Dashboard Cards** — Instantly view total products, inventory value, and low-stock count.
- ✅ **Validation**
  - Frontend: Title and Price fields are mandatory.
  - Backend: Price must be greater than 0.

---

## Database Schema

```sql
CREATE TABLE Products (
    Id          INT PRIMARY KEY IDENTITY(1,1),
    Title       NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    Price       DECIMAL(18, 2) NOT NULL,
    Quantity    INT DEFAULT 0,
    UpdatedAt   DATETIME DEFAULT GETDATE()
);
```

---

## Deploy Frontend to GitHub Pages

This repository includes a workflow at:

`.github/workflows/deploy-client-pages.yml`

### One-time setup

1. In GitHub, open **Settings → Pages** for this repository.
2. Set **Source** to **GitHub Actions**.

### Deploy

- Push changes to the `main` or `master` branch, or run the workflow manually from the **Actions** tab.
- The workflow builds the Angular client and deploys it to GitHub Pages.
- The workflow sets `--base-href` from the current repository name automatically.

### Important Note for Hosted Demo

When running on `github.io`, the frontend automatically switches to **demo mode** and stores products in browser local storage.  
This keeps the deployed site fully interactive without requiring a local .NET API.
