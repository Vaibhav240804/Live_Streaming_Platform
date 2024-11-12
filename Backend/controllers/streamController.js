const AWS = require("aws-sdk");
const Stream = require("../models/Stream");

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const ivs = new AWS.IVS({ apiVersion: "2020-07-14" });

exports.createStream = async (req, res) => {
  try {
    const { streamTitle } = req.body;

    const params = {
      name: streamTitle,
      type: "BASIC",
    };

    const stream = await ivs.createChannel(params).promise();
    const { streamKey, playbackUrl, ingestEndpoint } = stream.channel;

    const newStream = new Stream({ title: streamTitle, playbackUrl });
    await newStream.save();

    res
      .status(201)
      .json({ streamKey: streamKey.value, playbackUrl, ingestEndpoint });
  } catch (error) {
    console.error("Error creating stream:", error);
    res.status(500).json({ error: "Failed to create stream" });
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
