const {
  IvsClient
  CreateChannelCommand,
  CreateStreamKeyCommand,
} = require("@aws-sdk/client-ivs");
const Stream = require("../models/Stream");

const ivsClient = new IVSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
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
      latencyMode: "LOW", // or 'NORMAL'
      type: "BASIC", // Set to 'BASIC' or 'STANDARD' as needed
    });
    const channelResponse = await ivsClient.send(createChannelCommand);

    const channelArn = channelResponse.channel.arn;
    const playbackUrl = channelResponse.channel.playbackUrl;
    const ingestEndpoint = channelResponse.channel.ingestEndpoint;

    // Step 2: Create the stream key for the channel
    const createStreamKeyCommand = new CreateStreamKeyCommand({
      channelArn,
    });
    const streamKeyResponse = await ivsClient.send(createStreamKeyCommand);
    const streamKey = streamKeyResponse.streamKey.value;

    console.log("Stream created:", streamKey, playbackUrl, ingestEndpoint);

    // Step 3: Save the stream details in the database
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
