function errorHandler(err, req, res, next) {
  console.error(err);
  let status = err.status || 500;
  let message = err.message || "Internal server error";

  if (err.name === "CastError") {
    status = 400;
    message = "Invalid resource id";
  }

  if (err.code === 11000) {
    status = 409;
    message = "Duplicate value already exists";
  }

  res.status(status).json({
    message
  });
}

module.exports = { errorHandler };
