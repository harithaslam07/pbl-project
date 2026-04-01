const dayjs = require("dayjs");
const pool = require("../../config/db");

function mapTips(total) {
  if (total < 5) {
    return [
      "Great progress. Keep tracking your activities daily.",
      "Try mentoring classmates on low-carbon habits."
    ];
  }

  if (total < 15) {
    return [
      "Use public transportation for short trips.",
      "Reduce unnecessary printing by sharing PDFs."
    ];
  }

  return [
    "High footprint detected. Prefer shared transport or biking.",
    "Audit electricity usage and unplug idle devices.",
    "Set weekly paper usage limits."
  ];
}

async function getDashboardStats(req, res, next) {
  try {
    const userId = req.user.id;
    const startOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");

    const [totalRows] = await pool.query(
      "SELECT COALESCE(SUM(emission), 0) AS total FROM activities WHERE user_id = ?",
      [userId]
    );

    const [monthlyRows] = await pool.query(
      `SELECT DATE(activity_date) AS date, COALESCE(SUM(emission), 0) AS emission
       FROM activities
       WHERE user_id = ? AND activity_date >= ?
       GROUP BY DATE(activity_date)
       ORDER BY DATE(activity_date) ASC`,
      [userId, startOfMonth]
    );

    const [typeRows] = await pool.query(
      `SELECT type, COALESCE(SUM(emission), 0) AS emission
       FROM activities
       WHERE user_id = ?
       GROUP BY type`,
      [userId]
    );

    const total = Number(totalRows[0].total);

    return res.json({
      totalEmission: total,
      monthlySeries: monthlyRows,
      byType: typeRows,
      suggestions: mapTips(total)
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getDashboardStats };
