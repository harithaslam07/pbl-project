const dayjs = require("dayjs");
const Activity = require("../../models/activity.model");
const { calculateEmission } = require("../../services/carbonCalculator");
const { serializeActivity } = require("../../utils/serializers");

async function createActivity(req, res, next) {
  try {
    const { type, value, date } = req.body;
    const emission = await calculateEmission(type, value);

    const activity = await Activity.create({
      user: req.user.id,
      type,
      value,
      emission,
      activity_date: dayjs(date).startOf("day").toDate()
    });

    return res.status(201).json(serializeActivity(activity));
  } catch (error) {
    return next(error);
  }
}

async function getActivities(req, res, next) {
  try {
    const { startDate, endDate, type } = req.query;
    const filters = { user: req.user.id };

    if (startDate) {
      filters.activity_date = {
        ...(filters.activity_date || {}),
        $gte: dayjs(startDate).startOf("day").toDate()
      };
    }

    if (endDate) {
      filters.activity_date = {
        ...(filters.activity_date || {}),
        $lte: dayjs(endDate).endOf("day").toDate()
      };
    }

    if (type) {
      filters.type = type;
    }

    const activities = await Activity.find(filters).sort({ activity_date: -1, _id: -1 }).lean();
    return res.json(activities.map(serializeActivity));
  } catch (error) {
    return next(error);
  }
}

async function updateActivity(req, res, next) {
  try {
    const current = await Activity.findOne({ _id: req.params.id, user: req.user.id });
    if (!current) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const type = req.body.type || current.type;
    const value = req.body.value || current.value;
    const activityDate = req.body.date
      ? dayjs(req.body.date).format("YYYY-MM-DD")
      : dayjs(current.activity_date).format("YYYY-MM-DD");

    const emission = await calculateEmission(type, value);

    current.type = type;
    current.value = value;
    current.emission = emission;
    current.activity_date = dayjs(activityDate).startOf("day").toDate();
    await current.save();

    return res.json(serializeActivity(current));
  } catch (error) {
    return next(error);
  }
}

async function deleteActivity(req, res, next) {
  try {
    const deleted = await Activity.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: "Activity not found" });
    }

    return res.json({ message: "Activity deleted" });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createActivity, getActivities, updateActivity, deleteActivity };
