import React, { useEffect, useRef } from "react";
import { Button, Spin } from "antd";
import Hls from "hls.js";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const WatchStream = () => {
  const { id } = useParams();
  const videoRef = useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [playbackUrl, setPlaybackUrl] = React.useState(null);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_API_URL;

  useEffect(() => {
    const fetchPlaybackUrl = async () => {
      if (id) {
        console.log("Fetching playback URL for stream from if statement:", id);
        setLoading(true);
        try {
          const response = await axios.get(`${backendUrl}/api/streams/${id}`);
          setPlaybackUrl(response.data.playbackUrl);
          console.log("Playback URL:", response.data.playbackUrl);
        } catch (error) {
          console.error("Error fetching playback URL:", error);
        }
        setLoading(false);
      }
    };
    console.log("Fetching playback URL for stream:", id);
    fetchPlaybackUrl();
  }, [id]);

  useEffect(() => {
    if (playbackUrl) {
      const hls = new Hls();
      console.log("Initializing HLS.js");
      console.log("ref ", videoRef.current);
      if (videoRef.current) {
        hls.loadSource(playbackUrl);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setLoading(false);
          console.log("Stream loaded successfully.");
          videoRef.current.play();
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          console.error("Error occurred while loading stream:", data);
          setLoading(false);
        });

        return () => {
          hls.destroy();
        };
      }
    }
  }, [playbackUrl, videoRef]);

  return (
    <div>
      <h1>Watch Stream</h1>

      {loading ? (
        <Spin size="large" />
      ) : (
        <div>
          <video
            ref={videoRef}
            style={{ width: "100%", height: "auto" }}
            controls
          >
            Your browser does not support the video tag.
          </video>

          <div style={{ marginTop: "20px" }}>
            <Button type="primary" onClick={() => navigate("/")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchStream;
