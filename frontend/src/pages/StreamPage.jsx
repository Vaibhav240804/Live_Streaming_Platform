import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, message } from "antd";
import { useRef } from "react";
import { Typography } from "antd";
import { Row, Col, Card, Space } from "antd";
const { Text, Title } = Typography;

const StreamPage = () => {
  const [streamTitle, setStreamTitle] = useState("");
  const [streamKey, setStreamKey] = useState(null);
  const [playbackUrl, setPlaybackUrl] = useState(null);
  const [broadcasting, setBroadcasting] = useState(false);
  const [ingestep, setIngestep] = useState(null);

  const IVSBroadcastClientRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://web-broadcast.live-video.net/1.3.3/amazon-ivs-web-broadcast.js";
    script.async = true;
    script.onload = () => {
      if (window.IVSBroadcastClient) {
        IVSBroadcastClientRef.current = window.IVSBroadcastClient;
      }
    };
    document.body.appendChild(script);
  }, []);

  const startStream = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_API_URL;
      console.log("backendUrl", backendUrl);
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

  const broadcastClientRef = useRef(null);

  const handleBroadcastToggle = () => {
    if (!broadcasting) {
      if (streamKey && ingestep) {
        broadcastClientRef.current = IVSBroadcastClientRef.current.create({
          streamConfig: IVSBroadcastClientRef.current.BASIC_FULL_HD_LANDSCAPE,
          ingestEndpoint: ingestep,
        });

        const previewEl = document.getElementById("preview");
        broadcastClientRef.current.attachPreview(previewEl);

        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            broadcastClientRef.current.addVideoInputDevice(stream, "camera1", {
              index: 0,
            });
            broadcastClientRef.current.addAudioInputDevice(stream, "mic1");
          });

        broadcastClientRef.current
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
      broadcastClientRef.current.stopBroadcast();
      setBroadcasting(false);
      message.info("Broadcast ended.");
    }
  };

  return (
    <Row justify="center" style={{ padding: "20px" }}>
      <Col xs={24} sm={20} md={16} lg={12}>
        <Card>
          <Title level={2}>Start Streaming</Title>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <h1>Start Streaming</h1>
              <Input
                placeholder="Enter stream title"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
              />
              <Button onClick={startStream}>Start Streaming Setup</Button>

              {streamKey && (
                <Text strong>
                  stream Key: <Text code>{streamKey}</Text>
                </Text>
              )}
              {playbackUrl && (
                <Text strong>
                  Playback URL: <Text code>{playbackUrl}</Text>
                </Text>
              )}

              <canvas
                id="preview"
                style={{ width: "800px", height: "450px" }}
              ></canvas>

              <Button type="primary" onClick={handleBroadcastToggle}>
                {broadcasting ? "Stop Broadcasting" : "Start Broadcasting"}
              </Button>
            </div>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default StreamPage;
