const mongoose = require("mongoose");

const tipSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    link: String,
    useful: { type: Boolean, required: true },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tip", tipSchema);