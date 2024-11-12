const express = require("express");
const { createStream, getStreams } = require("../controllers/streamController");

const router = express.Router();

router.post("/create", createStream);
router.get("/all", getStreams);

module.exports = router;
