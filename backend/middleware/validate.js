const validate = (schema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      const message = err.errors ? err.errors.map(e => e.message).join(', ') : err.message;
      next({ status: 400, message });
    }
  };
};

module.exports = { validate };