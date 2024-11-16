const express = require("express");
const {
  createStream,
  getStreams,
  getStream,
} = require("../controllers/streamController");

const router = express.Router();

router.post("/create", createStream);
router.get("/all", getStreams);
router.get("/:id", getStream);

module.exports = router;
