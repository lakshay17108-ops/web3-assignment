const mongoose = require('mongoose');

// Rejects malformed ObjectIds before they reach the database
module.exports = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const err = new Error(`Invalid product id: ${req.params.id}`);
    err.statusCode = 400;
    return next(err);
  }
  next();
};
