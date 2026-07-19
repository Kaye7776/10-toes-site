// Minimal React bootstrap. The real experience lives in /public.
// React mounts into a hidden #root and renders nothing.
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
if (container) {
  ReactDOM.createRoot(container).render(<App />);
}
