require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('express-async-errors'); // simplifies async error handling
const apiRouter = require('./routes'); // your routes index
const { errorHandler } = require('./middleware/errorHandler');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

// Middlewares
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// CORS - lock down the allowed origins in production
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map(s=>s.trim()).filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true,
}));

// Rate limiter (very important for auth endpoints)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, try later.' }
});
app.use(limiter);

// Mount API
app.use('/api', apiRouter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Centralized error handler (must be after routes)
app.use(errorHandler);

// DB connect with retry
async function connectWithRetry(retries = 5, delayMs = 3000) {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(`MongoDB connection error. Retries left: ${retries}`, err.message || err);
    if (retries === 0) throw err;
    await new Promise(r => setTimeout(r, delayMs));
    return connectWithRetry(retries - 1, delayMs);
  }
}

connectWithRetry().then(() => {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}).catch(err => {
  console.error('Could not connect to DB, server not started', err);
  process.exit(1);
});
