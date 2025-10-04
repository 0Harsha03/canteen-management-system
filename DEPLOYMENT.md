# Deployment Guide

## Backend Deployment (Vercel)

### Prerequisites
1. MongoDB Atlas account (free tier works fine)
2. Vercel account

### Steps:

1. **Set up MongoDB Atlas:**
   - Create a free cluster at https://cloud.mongodb.com
   - Get your connection string
   - Whitelist Vercel IPs (or use 0.0.0.0/0 for all IPs)

2. **Deploy to Vercel:**
   ```bash
   cd backend
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/canteen-management
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   JWT_EXPIRE=30d
   NODE_ENV=production
   ```

4. **Seed Database (one-time):**
   - After deployment, run the seeder once:
   ```bash
   vercel dev
   node seeder.js
   ```

## Frontend Deployment (Vercel)

1. Connect your GitHub repo to Vercel
2. Set environment variables:
   ```
   REACT_APP_API_URL=https://your-backend.vercel.app/api
   ```
3. Deploy!

## Important Notes:

- **CORS**: Backend is configured to accept requests from any origin in development
- **Database**: Use MongoDB Atlas for production (free tier available)
- **Environment Variables**: Never commit .env files to GitHub
- **API Base URL**: Update frontend to use deployed backend URL

## API Endpoints Available:

- **Base URL**: `https://your-backend.vercel.app/api`
- **Health Check**: `GET /`
- **Auth**: `POST /auth/login`, `POST /auth/register`
- **Menu**: `GET /menu`, `GET /menu/category/:category`
- **Orders**: `POST /orders`, `GET /orders/my-orders`

## Test Accounts:
- Admin: admin@canteen.com / admin123
- Staff: staff@canteen.com / staff123
- Student: john@student.edu / student123