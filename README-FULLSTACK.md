# Canteen Pre-Order and Management System

A comprehensive full-stack digital solution for college canteens designed to streamline food ordering processes and enhance the overall dining experience. Built with **React + TypeScript + Vite** frontend and **Node.js + Express + MongoDB** backend to provide a modern, scalable platform for customers, staff, and administrators.

## 🛠 Tech Stack

### Frontend (React + TypeScript)
- **React 18** with TypeScript
- **Vite** for fast development and building  
- **shadcn/ui** + **Radix UI** for beautiful, accessible UI components
- **Tailwind CSS** for modern styling
- **React Query** for efficient data fetching and caching
- **React Router** for client-side routing
- **React Hook Form** + **Zod** for form handling and validation
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend (Node.js + Express)
- **Express.js** web framework
- **MongoDB** with Mongoose ODM
- **JWT** authentication with bcryptjs
- **CORS** enabled for cross-origin requests
- **dotenv** for environment configuration
- **Comprehensive API** with role-based access control

## 🎯 Features

### Multi-Role System
- **Customer**: Browse menu, place orders, track order status, rate orders
- **Staff**: Manage orders, update order status, view today's orders, manage menu items
- **Admin**: Full access to all features, analytics, user management, menu management

### Core Functionality
- **Authentication & Authorization**: JWT-based authentication with role-based access
- **Menu Management**: Dynamic menu with categories, availability, pricing, and stock management
- **Order Management**: Complete order lifecycle from placement to completion
- **Real-time Updates**: Live order status tracking
- **Payment Processing**: Multiple payment methods support
- **Analytics**: Order analytics and reporting for staff and admins

## 📁 Project Structure

```
canteen-management-system/
├── backend/                    # Express.js API server
│   ├── config/                # Database and app configuration
│   ├── controllers/           # Route controllers  
│   ├── middleware/            # Authentication and validation middleware
│   ├── models/               # MongoDB models (User, Menu, Order)
│   ├── routes/               # API routes (auth, menu, orders)
│   ├── seeders/              # Database seeders for sample data
│   ├── server.js             # Main server entry point
│   ├── .env                  # Environment variables
│   └── package.json          # Backend dependencies
├── frontend-react/           # React + TypeScript + Vite frontend
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── contexts/       # React contexts (AuthContext)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   └── lib/           # Utilities and configurations
│   ├── .env               # Environment variables
│   ├── vite.config.ts     # Vite configuration
│   └── package.json       # Frontend dependencies
├── frontend/              # Legacy React frontend (Create React App)
├── frontend-new/          # Alternative frontend implementation
└── package.json          # Root package scripts
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd canteen-management-system
   ```

2. **Install all dependencies (recommended)**
   ```bash
   npm run install-deps-react
   ```

3. **Backend Setup**
   ```bash
   cd backend
   
   # Configure environment variables
   cp .env.example .env
   # Edit .env file with your MongoDB connection string and JWT secret
   
   # Seed the database with sample data (optional)
   npm run seed
   ```

4. **Frontend Setup**
   ```bash
   cd frontend-react
   
   # Environment variables are already configured in .env
   # API URL: http://localhost:5000/api
   ```

5. **Start Development Servers**
   ```bash
   # From root directory - starts both backend and frontend
   npm run dev-react
   
   # Or start individually:
   npm run server    # Backend only (port 5000)
   npm run client-react  # Frontend only (port 5173)
   ```

6. **Access the Application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:5000/api
   - **API Docs**: See `backend/API_DOCS.md`

## 🔧 Available Scripts

### Root Directory
```bash
npm run dev-react           # Start both backend and frontend
npm run server             # Start backend only
npm run client-react       # Start React frontend only
npm run build-react        # Build React frontend for production
npm run install-deps-react # Install all dependencies
npm run lint-react         # Lint React frontend
npm run preview-react      # Preview production build
```

### Backend (`cd backend`)
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
npm test           # Run tests (when implemented)
```

### Frontend (`cd frontend-react`)
```bash
npm run dev        # Start development server (Vite)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Lint TypeScript and React code
```

## 🔐 Authentication & API

### Sample Users (after seeding)
- **Admin**: admin@canteen.com
- **Staff**: staff@canteen.com
- **Students**: john@student.edu, sarah@student.edu
  
*Note: Check console output after running `npm run seed` for passwords*

### API Endpoints
- **Base URL**: `http://localhost:5000/api`
- **Auth**: `/api/auth` - Registration, login, logout
- **Menu**: `/api/menu` - Menu CRUD operations
- **Orders**: `/api/orders` - Order management

See `backend/API_DOCS.md` for detailed API documentation.

## 🎨 UI Components

The frontend uses **shadcn/ui** components built on **Radix UI** primitives:
- Forms, Dialogs, Dropdowns, Navigation
- Data tables, Charts, Cards
- Buttons, Inputs, Badges, Alerts
- Fully accessible and customizable
- Dark/Light theme support

## 🔄 Development Workflow

1. **Backend Development**
   - API routes in `backend/routes/`
   - Models in `backend/models/`
   - Controllers in `backend/controllers/`

2. **Frontend Development**
   - Pages in `frontend-react/src/pages/`
   - Components in `frontend-react/src/components/`
   - API calls in `frontend-react/src/services/api.ts`

3. **Database Changes**
   - Update models in `backend/models/`
   - Update seeders in `backend/seeders/`
   - Run `npm run seed` to update sample data

## 🧪 Testing & Quality

### Code Quality
```bash
# Frontend linting
npm run lint-react

# Type checking
cd frontend-react && npx tsc --noEmit
```

### Testing (Planned)
- **Backend**: Jest for API testing
- **Frontend**: Vitest + React Testing Library
- **E2E**: Playwright

## 🚀 Deployment

### Backend Deployment
- Environment variables for production
- MongoDB Atlas for database
- JWT secrets and secure configurations

### Frontend Deployment
- Build: `npm run build-react`
- Static hosting (Vercel, Netlify)
- Environment variables for API URL

## 📋 Development Status

### ✅ Completed
- [x] Full-stack project structure
- [x] Backend API with authentication
- [x] React + TypeScript frontend with shadcn/ui
- [x] MongoDB integration with sample data
- [x] Multi-role authentication system
- [x] Menu and order management APIs
- [x] Frontend-backend integration
- [x] Development workflow setup

### 🚧 In Progress
- [ ] Frontend page implementations
- [ ] Real-time order updates (WebSocket)
- [ ] Payment integration
- [ ] Advanced analytics dashboard

### 📅 Planned
- [ ] Unit and integration testing
- [ ] Performance optimization
- [ ] Mobile responsiveness enhancements
- [ ] Production deployment guides
- [ ] Advanced inventory management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📊 Project Goals

- **Efficiency**: Reduce canteen wait times by 60%
- **User Experience**: Modern, intuitive interface
- **Scalability**: Support multiple canteen locations  
- **Reliability**: 99.9% system uptime
- **Security**: Robust authentication and data protection

## 📞 Support

For questions, suggestions, or issues:
- Create an issue in the repository
- Check `WARP.md` for development context
- Review `backend/API_DOCS.md` for API details

## 📄 License

This project is licensed under the MIT License.

---

**Status**: 🚀 Full-Stack Ready | **Version**: 2.0.0 | **Last Updated**: October 2025