const pool = require("../config/db");

async function getEmissionFactor(activityType) {
  const [rows] = await pool.query(
    "SELECT factor FROM emission_factors WHERE activity_type = ? LIMIT 1",
    [activityType]
  );

  if (!rows.length) {
    throw Object.assign(new Error(`Emission factor not found for type: ${activityType}`), {
      status: 400
    });
  }

  return Number(rows[0].factor);
}

async function calculateEmission(activityType, value) {
  const factor = await getEmissionFactor(activityType);
  return Number(value) * factor;
}

module.exports = { getEmissionFactor, calculateEmission };
