const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS Configuration (The Fix) ---
// This allows your frontend (e.g., http://localhost:8080) to access the API.
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:8081'], // Support both ports
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

// --- Middleware ---
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// MongoDB connection (will be configured later)
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Canteen Pre-Order and Management System API',
    version: '1.0.0',
    status: 'Server is running successfully!'
  });
});

// API routes
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));

// 404 handler - must come BEFORE error handling middleware
app.use((req, res, next) => {
  const error = new Error(`Cannot find ${req.originalUrl} on this server!`);
  error.status = 404;
  next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
});

module.exports = app;