const EmissionFactor = require("../models/emissionFactor.model");

async function getEmissionFactor(activityType) {
  const factorDoc = await EmissionFactor.findOne({ activity_type: activityType }).lean();

  if (!factorDoc) {
    throw Object.assign(new Error(`Emission factor not found for type: ${activityType}`), {
      status: 400
    });
  }

  return Number(factorDoc.factor);
}

async function calculateEmission(activityType, value) {
  const factor = await getEmissionFactor(activityType);
  return Number(value) * factor;
}

module.exports = { getEmissionFactor, calculateEmission };
