import React, { useState } from "react";
import axios from "axios";
import { Input, Button, message } from "antd";
import { IVSBroadcastClient } from "@aws-sdk/client-ivs";

const StreamPage = () => {
  const [streamTitle, setStreamTitle] = useState("");
  const [streamKey, setStreamKey] = useState(null);
  const [playbackUrl, setPlaybackUrl] = useState(null);
  const [broadcasting, setBroadcasting] = useState(false);
  const [ingestep, setIngestep] = useState(null);

  const startStream = async () => {
    try {
      const backendUrl = process.env.BACKEND_URL;
      const response = await axios.post(`${backendUrl}/api/streams/create`, {
        streamTitle,
      });
      const { streamKey, playbackUrl, ingestEndpoint } = response.data;

      setStreamKey(streamKey);
      setPlaybackUrl(playbackUrl);
      setIngestep(ingestEndpoint);

      message.success("Stream setup successful! Start broadcasting.");
    } catch (error) {
      message.error("Failed to start streaming.");
      console.error(error);
    }
  };

  let broadcastClient = null;

  const handleBroadcastToggle = () => {
    if (!broadcasting) {
      if (streamKey && ingestep) {
        broadcastClient = IVSBroadcastClient.create({
          streamConfig: IVSBroadcastClient.BASIC_FULL_HD_LANDSCAPE,
          ingestEndpoint: ingestep,
        });

        const previewEl = document.getElementById("preview");
        broadcastClient.attachPreview(previewEl);

        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            broadcastClient.addVideoInputDevice(stream, "camera1", {
              index: 0,
            });
            broadcastClient.addAudioInputDevice(stream, "mic1");
          });

        broadcastClient
          .startBroadcast(streamKey)
          .then(() => {
            setBroadcasting(true);
            message.success("Broadcasting started!");
          })
          .catch((error) => {
            setBroadcasting(false);
            message.error("Broadcast failed!");
            console.error(error);
          });
      }
    } else {
      broadcastClient.stopBroadcast();
      setBroadcasting(false);
      message.info("Broadcast ended.");
    }
  };

  return (
    <div>
      <h1>Start Streaming</h1>
      <Input
        placeholder="Enter stream title"
        value={streamTitle}
        onChange={(e) => setStreamTitle(e.target.value)}
      />
      <Button onClick={startStream}>Start Streaming Setup</Button>

      {streamKey && <p>Stream Key: {streamKey}</p>}
      {playbackUrl && <p>Playback URL: {playbackUrl}</p>}

      <canvas id="preview" style={{ width: "800px", height: "450px" }}></canvas>

      <Button type="primary" onClick={handleBroadcastToggle}>
        {broadcasting ? "Stop Broadcasting" : "Start Broadcasting"}
      </Button>
    </div>
  );
};

export default StreamPage;
