# Canteen Management API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## User Roles
- **Customer**: Can view menu, place orders, view own orders
- **Staff**: Can manage menu items, view and update orders
- **Admin**: Full access to all features

---

## Authentication Endpoints

### POST `/auth/register`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@student.edu",
  "password": "password123",
  "role": "customer",
  "phone": "9876543210",
  "studentId": "ST2024001"
}
```

### POST `/auth/login`
Login user
```json
{
  "email": "john@student.edu",
  "password": "password123"
}
```

### GET `/auth/me` (Protected)
Get current user info

### POST `/auth/logout`
Logout user

---

## Menu Endpoints

### GET `/menu`
Get all menu items (with optional filters)
- Query params: `category`, `available`, `vegetarian`, `vegan`, `glutenFree`, `search`
- Example: `/menu?category=breakfast&vegetarian=true`

### GET `/menu/:id`
Get single menu item

### GET `/menu/category/:category`
Get items by category (breakfast, lunch, dinner, snacks, beverages, desserts)

### POST `/menu` (Admin/Staff only)
Create new menu item
```json
{
  "name": "New Item",
  "description": "Delicious food item",
  "category": "lunch",
  "price": 50,
  "preparationTime": 10,
  "isVegetarian": true,
  "availability": {
    "isAvailable": true,
    "availableFrom": "12:00",
    "availableTo": "15:00",
    "daysOfWeek": ["monday", "tuesday", "wednesday"]
  },
  "stock": {
    "quantity": 100
  }
}
```

### PUT `/menu/:id` (Admin/Staff only)
Update menu item

### DELETE `/menu/:id` (Admin only)
Delete menu item

### PATCH `/menu/:id/stock` (Admin/Staff only)
Update stock quantity
```json
{
  "quantity": 50
}
```

### PATCH `/menu/:id/availability` (Admin/Staff only)
Toggle availability

### GET `/menu/reports/low-stock` (Admin/Staff only)
Get low stock items

---

## Order Endpoints

### POST `/orders` (Customer only)
Create new order
```json
{
  "items": [
    {
      "menuItem": "menu-item-id",
      "quantity": 2,
      "specialInstructions": "Extra spicy"
    }
  ],
  "paymentMethod": "cash",
  "specialRequests": "Please deliver to table 5"
}
```

### GET `/orders/my-orders` (Customer only)
Get customer's orders

### GET `/orders/:id`
Get single order (customers can only access their own)

### GET `/orders` (Admin/Staff only)
Get all orders (with optional filters)
- Query params: `status`, `date`, `customer`

### GET `/orders/today` (Admin/Staff only)
Get today's orders

### GET `/orders/status/:status` (Admin/Staff only)
Get orders by status (pending, confirmed, preparing, ready, completed, cancelled)

### PATCH `/orders/:id/status` (Admin/Staff only)
Update order status
```json
{
  "status": "confirmed",
  "notes": "Order confirmed by staff"
}
```

### PATCH `/orders/:id/cancel`
Cancel order (customers can cancel own orders)

### PATCH `/orders/:id/rate` (Customer only)
Rate completed order
```json
{
  "score": 5,
  "comment": "Great food!"
}
```

---

## Sample Data

### Categories Available:
- breakfast, lunch, dinner, snacks, beverages, desserts

### Order Status Flow:
pending → confirmed → preparing → ready → completed

### Payment Methods:
- cash, card, digital-wallet, student-credit

### Test Users (password: see seeder output):
- **Admin**: admin@canteen.com
- **Staff**: staff@canteen.com  
- **Student**: john@student.edu
- **Student**: sarah@student.edu

---

## Sample Menu Items:

**Breakfast** (7:00-10:00)
- Idli Sambar - ₹25
- Poha - ₹20
- Bread Omelette - ₹30

**Lunch** (12:00-15:00)
- Dal Rice - ₹40
- Chicken Biryani - ₹120
- Veg Thali - ₹80

**Snacks** (10:00-18:00)
- Samosa - ₹15
- Sandwich - ₹35
- Maggi - ₹25

**Beverages** (7:00-20:00)
- Chai - ₹10
- Coffee - ₹12
- Fresh Lime Water - ₹15

**Desserts** (12:00-20:00)
- Gulab Jamun - ₹20
- Ice Cream Cup - ₹25

---

## Error Handling

All endpoints return standardized error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## Success Responses

All successful responses follow this format:
```json
{
  "success": true,
  "data": {},
  "count": 0,
  "message": "Success message"
}
```

---

## Next Steps for Frontend Integration:

1. **Test Authentication**: Try login with the sample users
2. **Fetch Menu**: Get menu items by category for your frontend
3. **Place Orders**: Test the order creation flow
4. **Role-based UI**: Show different interfaces for customers vs staff/admin
5. **Real-time Updates**: We can add WebSocket support for live order status updates

**Your backend is fully functional and ready for frontend integration!** 🚀