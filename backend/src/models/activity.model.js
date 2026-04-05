const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ["transportation", "electricity", "paper", "device"],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    emission: {
      type: Number,
      required: true
    },
    activity_date: {
      type: Date,
      required: true,
      index: true
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

activitySchema.index({ user: 1, activity_date: -1 });

module.exports = mongoose.model("Activity", activitySchema);
