function errorHandler(err, req, res, next) {
  console.error(err.stack || err);
  const status = err.status || 500;
  const payload = {
    success: false,
    message: err.message || 'Internal Server Error',
    // in production do NOT expose stack
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  };
  res.status(status).json(payload);
}

module.exports = { errorHandler };
