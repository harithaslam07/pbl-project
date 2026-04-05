const mongoose = require("mongoose");

const emissionFactorSchema = new mongoose.Schema(
  {
    activity_type: {
      type: String,
      enum: ["transportation", "electricity", "paper", "device"],
      required: true,
      unique: true
    },
    factor: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

module.exports = mongoose.model("EmissionFactor", emissionFactorSchema);
