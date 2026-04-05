const dayjs = require("dayjs");

function serializeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at
  };
}

function serializeActivity(activity) {
  return {
    id: activity._id.toString(),
    user_id: activity.user.toString(),
    type: activity.type,
    value: activity.value,
    emission: activity.emission,
    activity_date: dayjs(activity.activity_date).format("YYYY-MM-DD"),
    created_at: activity.created_at,
    updated_at: activity.updated_at
  };
}

function serializeFactor(factor) {
  return {
    id: factor._id.toString(),
    activity_type: factor.activity_type,
    factor: factor.factor,
    created_at: factor.created_at,
    updated_at: factor.updated_at
  };
}

module.exports = { serializeUser, serializeActivity, serializeFactor };
