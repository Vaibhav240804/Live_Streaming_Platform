import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import StreamPage from "./pages/StreamPage";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/stream" component={StreamPage} />
      </Switch>
    </Router>
  );
}

export default App;
