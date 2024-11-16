const { IvsClient, CreateChannelCommand } = require("@aws-sdk/client-ivs");
const Stream = require("../models/Stream");

const ivsClient = new IvsClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.createStream = async (req, res) => {
  const { streamTitle } = req.body;

  if (!streamTitle) {
    return res.status(400).json({ error: "Stream title is required." });
  }

  try {
    // Step 1: Create the channel with the provided title
    const createChannelCommand = new CreateChannelCommand({
      name: streamTitle,
      latencyMode: "LOW",
      type: "BASIC",
    });
    const response = await ivsClient.send(createChannelCommand);

    const channelArn = response.channel.arn;
    const playbackUrl = response.channel.playbackUrl;
    const ingestEndpoint = response.channel.ingestEndpoint;
    const streamKey = response.streamKey.value;

    console.log("Stream created:", streamKey, playbackUrl, ingestEndpoint);

    // Step 2: Save the stream details in the database
    const newStream = new Stream({
      title: streamTitle,
      playbackUrl,
    });
    await newStream.save();

    res.status(201).json({
      message: "Stream created successfully.",
      streamKey,
      playbackUrl,
      ingestEndpoint,
    });
  } catch (error) {
    console.error("Error creating stream:", error);
    res
      .status(500)
      .json({ error: "Failed to create stream", details: error.message });
  }
};

exports.getStreams = async (req, res) => {
  try {
    const streams = await Stream.find({});
    res.json(streams);
  } catch (error) {
    console.error("Error retrieving streams:", error);
    res.status(500).json({ error: "Failed to retrieve streams" });
  }
};

exports.getStream = async (req, res) => {
  const { id } = req.params;
  try {
    const stream = await Stream.findById(id);
    if (!stream) {
      return res.status(404).json({ error: "Stream not found." });
    }

    res.json({ playbackUrl: stream.playbackUrl });
  } catch (error) {
    console.error("Error retrieving stream:", error);
    res.status(500).json({ error: "Failed to retrieve stream" });
  }
};
