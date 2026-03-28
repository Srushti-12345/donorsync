const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    age: {
      type: Number,
      min: 18,
      max: 65
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"]
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    lastDonationDate: {
      type: Date
    },
    medicalNotes: {
      type: String,
      default: ""
    },
    availableForEmergency: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donor", donorSchema);
