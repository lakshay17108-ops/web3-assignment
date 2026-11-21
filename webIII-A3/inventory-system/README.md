# Inventory and Data Management System

Node.js + Express + MongoDB (Mongoose) REST API.

## Setup
1. Install MongoDB locally (or use Atlas) and make sure it is running.
2. `npm install`
3. Copy `.env.example` to `.env` and set `MONGO_URI`.
4. `npm run seed` (optional, adds 12 sample products)
5. `npm start` (or `npm run dev`)

## Endpoints
| Method | URL | Description |
|---|---|---|
| POST | /api/products | Create product |
| GET | /api/products | List with filter / sort / pagination |
| GET | /api/products/:id | Get one product |
| PUT | /api/products/:id | Update product details |
| PATCH | /api/products/:id/stock | Body `{"change": 10}` restock, `{"change": -3}` sale |
| DELETE | /api/products/:id | Delete product |
| GET | /api/products/low-stock | Items where quantity <= reorderLevel |
| GET | /api/products/summary | Category-wise aggregation |

### Query params for GET /api/products
`category`, `supplier`, `search`, `minPrice`, `maxPrice`, `inStock=true|false`,
`sort=price,-quantity`, `page=1`, `limit=10`

Example: `/api/products?category=Electronics&minPrice=500&sort=-price&page=1&limit=5`

### Sample POST body
```json
{ "name": "Gel Pen Pack of 15", "sku": "STNY-PN-713", "category": "Stationery",
  "price": 120, "quantity": 40, "reorderLevel": 20, "supplier": "Cello Pens" }
```
