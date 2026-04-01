const express = require("express");
const { body, param, query } = require("express-validator");

const {
  createActivity,
  getActivities,
  updateActivity,
  deleteActivity
} = require("./activity.controller");
const { authMiddleware } = require("../../middleware/auth");
const { handleValidation } = require("../../middleware/validation");

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  [
    query("startDate").optional().isISO8601(),
    query("endDate").optional().isISO8601(),
    query("type").optional().isString()
  ],
  handleValidation,
  getActivities
);

router.post(
  "/",
  [
    body("type")
      .isIn(["transportation", "electricity", "paper", "device"])
      .withMessage("Invalid activity type"),
    body("value").isFloat({ gt: 0 }).withMessage("Value must be greater than zero"),
    body("date").isISO8601().withMessage("Date must be valid")
  ],
  handleValidation,
  createActivity
);

router.put(
  "/:id",
  [
    param("id").isInt({ gt: 0 }),
    body("type").optional().isIn(["transportation", "electricity", "paper", "device"]),
    body("value").optional().isFloat({ gt: 0 }),
    body("date").optional().isISO8601()
  ],
  handleValidation,
  updateActivity
);

router.delete("/:id", [param("id").isInt({ gt: 0 })], handleValidation, deleteActivity);

module.exports = router;
