const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    patientName: {
      type: String,
      required: true
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    unitsRequired: {
      type: Number,
      required: true,
      min: 1
    },
    hospital: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    neededDate: {
      type: Date,
      required: true
    },
    urgency: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium"
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Completed", "Cancelled"],
      default: "Open"
    },
    notes: {
      type: String,
      default: ""
    },
    matchedDonors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donor"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
