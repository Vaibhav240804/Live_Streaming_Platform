import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, Button, Card, Row, Col, Typography } from "antd";
import { Link } from "react-router-dom";
const { Title } = Typography;

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
    <div style={{ padding: "20px" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Live Streams
      </Title>
      <Row gutter={[16, 16]}>
        {streams.map((stream) => (
          <Col key={stream._id} xs={24} sm={12} md={8} lg={6}>
            <Card
              title={stream.title}
              extra={
                <Link to={`/watch/${stream._id}`}>
                  <Button type="primary">Watch</Button>
                </Link>
              }
              style={{ borderRadius: "10px" }}
            >
              <p>{stream.description}</p>
            </Card>
          </Col>
        ))}
      </Row>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link to="/stream">
          <Button type="primary" size="large">
            Start Streaming
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
