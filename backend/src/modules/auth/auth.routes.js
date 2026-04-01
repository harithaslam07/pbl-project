const express = require("express");
const { body } = require("express-validator");

const { register, login, profile } = require("./auth.controller");
const { handleValidation } = require("../../middleware/validation");
const { authMiddleware } = require("../../middleware/auth");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
    body("role").optional().isIn(["student", "faculty", "admin"])
  ],
  handleValidation,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  handleValidation,
  login
);

router.get("/me", authMiddleware, profile);

module.exports = router;
