import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, Button } from "antd";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_API_URL;
        console.log("backendUrl", backendUrl);
        const response = await axios.get(`${backendUrl}/api/streams/all`);
        setStreams(response.data);
      } catch (error) {
        console.error("Error fetching streams:", error);
      }
    };

    fetchStreams();
  }, []);

  return (
    <div>
      <h1>Live Streams</h1>
      <List
        dataSource={streams}
        renderItem={(stream) => (
          <List.Item>
            <Link to={`/watch/${stream.playbackUrl}`}>
              <Button type="primary">Watch</Button>
            </Link>
          </List.Item>
        )}
      />
      <Link to="/stream">
        <Button type="primary">Start Streaming</Button>
      </Link>
    </div>
  );
};

export default Dashboard;
