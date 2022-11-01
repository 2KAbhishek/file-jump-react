import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import FileJump from "./components/FileJump";

function App() {
  return (
    <div className="container" style={{ width: "600px" }}>
      <h1>File Jump</h1>
      <FileJump />
    </div>
  );
}

export default App;
