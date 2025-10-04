# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a **Canteen Pre-Order and Management System** built with the MERN stack (MongoDB, Express.js, React, Node.js). The system aims to digitize traditional food ordering processes in college canteens with features for pre-ordering, menu management, order tracking, and administrative analytics.

**Current Status**: Early development phase with basic project structure established.

## Architecture

### Full Stack Structure
- **Frontend**: React 19.2.0 application (Create React App) running on port 3000
- **Backend**: Express.js 5.1.0 server with CORS enabled, running on port 5000
- **Database**: MongoDB (not yet connected, configuration commented out)
- **Authentication**: JWT-based (dependencies installed, implementation pending)

### Key Components (Planned)
- **Multi-role Authentication**: Customer, Staff, and Administrator roles
- **Menu Management**: Dynamic menu creation and real-time updates
- **Order Lifecycle**: Complete order management from placement to fulfillment
- **Real-time Features**: Live order status tracking and notifications
- **Analytics Dashboard**: Administrative reporting and insights
- **Payment Integration**: Digital payment processing
- **Inventory Management**: Stock tracking and management

### Project Structure
```
canteen-management-system/
├── backend/                 # Express.js API server
│   ├── server.js           # Main server entry point
│   └── package.json        # Backend dependencies
├── frontend/               # React application
│   ├── public/            # Static assets
│   ├── src/               # React components and logic
│   └── package.json       # Frontend dependencies
└── package.json           # Root project scripts
```

## Development Commands

### Initial Setup
```bash
# Install all dependencies (root, backend, frontend)
npm run install-deps

# Alternative manual installation
npm install && cd backend && npm install && cd ../frontend && npm install
```

### Development Workflow
```bash
# Start both frontend and backend concurrently
npm run dev

# Start backend only (port 5000)
npm run server

# Start frontend only (port 3000)
npm run client

# Start production server (backend only)
npm start
```

### Backend Commands
```bash
cd backend
npm start          # Production server
npm run dev        # Development with nodemon
npm test           # Run tests (not yet implemented)
```

### Frontend Commands
```bash
cd frontend
npm start          # Development server (port 3000)
npm run build      # Production build
npm test           # React tests
npm run eject      # Eject from CRA (use with caution)
```

### Testing & Quality Assurance
Currently no tests are implemented. When adding tests:
- Backend: Use Jest or Mocha for API testing
- Frontend: React Testing Library is already configured

## Development Phase Context

### Current State (Phase 1 - Complete)
- Basic Express.js server setup with CORS and middleware
- React frontend initialized with Create React App
- Project structure established
- Development scripts configured

### Next Development Steps (Phase 2)
- MongoDB connection setup (uncomment and configure in server.js)
- Environment variables configuration (.env file creation)
- User models creation (Customer, Staff, Admin roles)
- JWT authentication implementation
- Basic registration and login endpoints

### Planned API Routes Structure
```javascript
// Commented routes in server.js indicate planned structure:
// /api/auth     - Authentication endpoints
// /api/users    - User management
// /api/menu     - Menu CRUD operations
// /api/orders   - Order management
```

## Key Dependencies

### Backend
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **nodemon**: Development auto-restart

### Frontend
- **react**: UI library (v19.2.0)
- **react-dom**: DOM rendering
- **@testing-library**: Testing utilities
- **react-scripts**: Build and development tools

## Environment Configuration

The backend expects a `.env` file (not yet created) with:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
```

## Application URLs
- **Frontend Development**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Test Endpoint**: http://localhost:5000/ (returns server status)

## Development Notes

- The MongoDB connection is currently commented out in `server.js` and needs to be configured
- JWT authentication dependencies are installed but implementation is pending  
- The frontend is currently showing the default Create React App template
- Error handling middleware is already configured for development vs production environments
- The project uses CommonJS modules in the backend (`"type": "commonjs"`)