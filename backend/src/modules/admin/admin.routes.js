const express = require("express");
const { body, param } = require("express-validator");

const { authMiddleware, requireRole } = require("../../middleware/auth");
const { handleValidation } = require("../../middleware/validation");
const {
  listUsers,
  deleteUser,
  institutionStats,
  listFactors,
  upsertFactor
} = require("./admin.controller");

const router = express.Router();

router.use(authMiddleware, requireRole("admin"));

router.get("/users", listUsers);
router.delete("/users/:id", [param("id").isInt({ gt: 0 })], handleValidation, deleteUser);
router.get("/stats", institutionStats);
router.get("/factors", listFactors);
router.put(
  "/factors",
  [
    body("activity_type").isIn(["transportation", "electricity", "paper", "device"]),
    body("factor").isFloat({ gt: 0 })
  ],
  handleValidation,
  upsertFactor
);

module.exports = router;
