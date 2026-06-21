const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    companyName: {
      type: String,
      required: true,
    },

    jobTitle: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },

    location: {
      type: String,
    },

    salary: {
      type: Number,
    },

    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);