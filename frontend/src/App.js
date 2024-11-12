import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import StreamPage from "./pages/StreamPage";
import WatchStream from "./pages/WatchStream";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={Dashboard} />
        <Route path="/stream" element={StreamPage} />
        {/* here id is playbackURL */}
        <Route path="/watch/:id" element={WatchStream} />
      </Routes>
    </Router>
  );
}

export default App;
