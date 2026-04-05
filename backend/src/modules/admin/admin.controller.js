const Activity = require("../../models/activity.model");
const EmissionFactor = require("../../models/emissionFactor.model");
const User = require("../../models/user.model");
const { serializeFactor } = require("../../utils/serializers");

async function listUsers(req, res, next) {
  try {
    const rows = await User.aggregate([
      { $match: { role: { $in: ["student", "faculty", "admin"] } } },
      {
        $lookup: {
          from: "activities",
          localField: "_id",
          foreignField: "user",
          as: "activities"
        }
      },
      {
        $project: {
          id: { $toString: "$_id" },
          name: 1,
          email: 1,
          role: 1,
          created_at: 1,
          activityCount: { $size: "$activities" },
          totalEmission: { $sum: "$activities.emission" }
        }
      },
      { $sort: { created_at: -1 } }
    ]);
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Activity.deleteMany({ user: req.params.id });

    return res.json({ message: "User deleted" });
  } catch (error) {
    return next(error);
  }
}

async function institutionStats(req, res, next) {
  try {
    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      totalAdmins,
      totalActivities,
      emissions,
      byType,
      roleEmission
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "faculty" }),
      User.countDocuments({ role: "admin" }),
      Activity.countDocuments(),
      Activity.aggregate([{ $group: { _id: null, total: { $sum: "$emission" } } }]),
      Activity.aggregate([
        { $group: { _id: "$type", emission: { $sum: "$emission" } } },
        { $project: { _id: 0, type: "$_id", emission: 1 } },
        { $sort: { type: 1 } }
      ]),
      User.aggregate([
        { $match: { role: { $in: ["student", "faculty", "admin"] } } },
        {
          $lookup: {
            from: "activities",
            localField: "_id",
            foreignField: "user",
            as: "activities"
          }
        },
        {
          $project: {
            role: 1,
            emission: { $sum: "$activities.emission" }
          }
        },
        {
          $group: {
            _id: "$role",
            emission: { $sum: "$emission" }
          }
        },
        { $project: { _id: 0, role: "$_id", emission: 1 } }
      ])
    ]);

    return res.json({
      totalUsers,
      totalStudents,
      totalTeachers,
      totalAdmins,
      totalActivities,
      totalEmissions: Number(emissions[0]?.total || 0),
      byType,
      roleEmission
    });
  } catch (error) {
    return next(error);
  }
}

async function listFactors(req, res, next) {
  try {
    const rows = await EmissionFactor.find().sort({ activity_type: 1 }).lean();
    return res.json(rows.map(serializeFactor));
  } catch (error) {
    return next(error);
  }
}

async function upsertFactor(req, res, next) {
  try {
    const { activity_type, factor } = req.body;

    await EmissionFactor.findOneAndUpdate(
      { activity_type },
      { activity_type, factor },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );

    return res.json({ message: "Emission factor updated" });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listUsers, deleteUser, institutionStats, listFactors, upsertFactor };
