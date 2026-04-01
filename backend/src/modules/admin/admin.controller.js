const pool = require("../../config/db");

async function listUsers(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.created_at,
        COUNT(a.id) AS activityCount,
        COALESCE(SUM(a.emission), 0) AS totalEmission
      FROM users u
      LEFT JOIN activities a ON a.user_id = u.id
      WHERE u.role IN ('student', 'faculty', 'admin')
      GROUP BY u.id, u.name, u.email, u.role, u.created_at
      ORDER BY u.created_at DESC`
    );
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const userId = Number(req.params.id);
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [userId]);

    if (!result.affectedRows) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted" });
  } catch (error) {
    return next(error);
  }
}

async function institutionStats(req, res, next) {
  try {
    const [users] = await pool.query("SELECT COUNT(*) AS count FROM users");
    const [students] = await pool.query("SELECT COUNT(*) AS count FROM users WHERE role = 'student'");
    const [teachers] = await pool.query("SELECT COUNT(*) AS count FROM users WHERE role = 'faculty'");
    const [admins] = await pool.query("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'");
    const [activities] = await pool.query("SELECT COUNT(*) AS count FROM activities");
    const [emissions] = await pool.query("SELECT COALESCE(SUM(emission), 0) AS total FROM activities");
    const [byType] = await pool.query(
      "SELECT type, COALESCE(SUM(emission),0) AS emission FROM activities GROUP BY type"
    );
    const [roleEmission] = await pool.query(
      `SELECT u.role, COALESCE(SUM(a.emission), 0) AS emission
       FROM users u
       LEFT JOIN activities a ON a.user_id = u.id
       WHERE u.role IN ('student', 'faculty', 'admin')
       GROUP BY u.role`
    );

    return res.json({
      totalUsers: users[0].count,
      totalStudents: students[0].count,
      totalTeachers: teachers[0].count,
      totalAdmins: admins[0].count,
      totalActivities: activities[0].count,
      totalEmissions: Number(emissions[0].total),
      byType,
      roleEmission
    });
  } catch (error) {
    return next(error);
  }
}

async function listFactors(req, res, next) {
  try {
    const [rows] = await pool.query("SELECT * FROM emission_factors ORDER BY activity_type ASC");
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
}

async function upsertFactor(req, res, next) {
  try {
    const { activity_type, factor } = req.body;

    await pool.query(
      `INSERT INTO emission_factors (activity_type, factor)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE factor = VALUES(factor)`,
      [activity_type, factor]
    );

    return res.json({ message: "Emission factor updated" });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listUsers, deleteUser, institutionStats, listFactors, upsertFactor };
