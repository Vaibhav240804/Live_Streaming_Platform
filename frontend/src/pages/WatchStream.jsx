import React, { useEffect, useRef } from "react";
import { Button, Spin } from "antd";
import Hls from "hls.js";
import { useParams, useNavigate } from "react-router-dom";

const WatchStream = () => {
  const { id } = useParams();
  const videoRef = useRef(null);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      const hls = new Hls();

      if (videoRef.current) {
        hls.loadSource(id); // `id` here is the playback URL
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setLoading(false);
          videoRef.current.play();
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("Error occurred while loading stream:", data);
          setLoading(false);
        });

        return () => {
          hls.destroy();
        };
      }
    }
  }, [id]);

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
