const express = require("express");
const { query } = require("express-validator");

const { authMiddleware } = require("../../middleware/auth");
const { handleValidation } = require("../../middleware/validation");
const { getMonthlyReport, downloadCsv, downloadPdf } = require("./report.controller");

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/monthly",
  [query("month").optional().isInt({ min: 1, max: 12 }), query("year").optional().isInt({ min: 2000 })],
  handleValidation,
  getMonthlyReport
);

router.get(
  "/csv",
  [query("month").optional().isInt({ min: 1, max: 12 }), query("year").optional().isInt({ min: 2000 })],
  handleValidation,
  downloadCsv
);

router.get(
  "/pdf",
  [query("month").optional().isInt({ min: 1, max: 12 }), query("year").optional().isInt({ min: 2000 })],
  handleValidation,
  downloadPdf
);

module.exports = router;
