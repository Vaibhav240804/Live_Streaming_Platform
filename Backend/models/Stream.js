const mongoose = require("mongoose");

const StreamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  playbackUrl: { type: String, required: true },
});

module.exports = mongoose.model("Stream", StreamSchema);
