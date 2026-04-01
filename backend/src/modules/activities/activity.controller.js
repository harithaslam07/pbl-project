const dayjs = require("dayjs");
const pool = require("../../config/db");
const { calculateEmission } = require("../../services/carbonCalculator");

async function createActivity(req, res, next) {
  try {
    const { type, value, date } = req.body;
    const emission = await calculateEmission(type, value);

    const [result] = await pool.query(
      "INSERT INTO activities (user_id, type, value, emission, activity_date) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, type, value, emission, dayjs(date).format("YYYY-MM-DD")]
    );

    return res.status(201).json({
      id: result.insertId,
      user_id: req.user.id,
      type,
      value,
      emission,
      activity_date: dayjs(date).format("YYYY-MM-DD")
    });
  } catch (error) {
    return next(error);
  }
}

async function getActivities(req, res, next) {
  try {
    const { startDate, endDate, type } = req.query;

    let sql = "SELECT * FROM activities WHERE user_id = ?";
    const params = [req.user.id];

    if (startDate) {
      sql += " AND activity_date >= ?";
      params.push(dayjs(startDate).format("YYYY-MM-DD"));
    }

    if (endDate) {
      sql += " AND activity_date <= ?";
      params.push(dayjs(endDate).format("YYYY-MM-DD"));
    }

    if (type) {
      sql += " AND type = ?";
      params.push(type);
    }

    sql += " ORDER BY activity_date DESC, id DESC";

    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
}

async function updateActivity(req, res, next) {
  try {
    const activityId = Number(req.params.id);
    const [rows] = await pool.query("SELECT * FROM activities WHERE id = ? AND user_id = ?", [
      activityId,
      req.user.id
    ]);

    if (!rows.length) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const current = rows[0];
    const type = req.body.type || current.type;
    const value = req.body.value || current.value;
    const activityDate = req.body.date
      ? dayjs(req.body.date).format("YYYY-MM-DD")
      : dayjs(current.activity_date).format("YYYY-MM-DD");

    const emission = await calculateEmission(type, value);

    await pool.query(
      "UPDATE activities SET type = ?, value = ?, emission = ?, activity_date = ? WHERE id = ? AND user_id = ?",
      [type, value, emission, activityDate, activityId, req.user.id]
    );

    return res.json({
      id: activityId,
      user_id: req.user.id,
      type,
      value,
      emission,
      activity_date: activityDate
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteActivity(req, res, next) {
  try {
    const activityId = Number(req.params.id);
    const [result] = await pool.query("DELETE FROM activities WHERE id = ? AND user_id = ?", [
      activityId,
      req.user.id
    ]);

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Activity not found" });
    }

    return res.json({ message: "Activity deleted" });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createActivity, getActivities, updateActivity, deleteActivity };
