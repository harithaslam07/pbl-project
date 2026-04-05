const dayjs = require("dayjs");
const mongoose = require("mongoose");
const Activity = require("../../models/activity.model");

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
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);
    const startOfMonth = dayjs().startOf("month").toDate();

    const fixedTotal = await Activity.aggregate([
      { $match: { user: userObjectId } },
      { $group: { _id: null, total: { $sum: "$emission" } } }
    ]);

    const fixedMonthly = await Activity.aggregate([
      { $match: { user: userObjectId, activity_date: { $gte: startOfMonth } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$activity_date" }
          },
          emission: { $sum: "$emission" }
        }
      },
      { $project: { _id: 0, date: "$_id", emission: 1 } },
      { $sort: { date: 1 } }
    ]);

    const fixedByType = await Activity.aggregate([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: "$type",
          emission: { $sum: "$emission" }
        }
      },
      { $project: { _id: 0, type: "$_id", emission: 1 } },
      { $sort: { type: 1 } }
    ]);

    const total = Number(fixedTotal[0]?.total || 0);

    return res.json({
      totalEmission: total,
      monthlySeries: fixedMonthly,
      byType: fixedByType,
      suggestions: mapTips(total)
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getDashboardStats };
