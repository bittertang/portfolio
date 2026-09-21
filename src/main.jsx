import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import posthog from "posthog-js";
import "./index.css";
import App from "./App.jsx";

posthog.init("phc_zxozdedu43nyZzzXKhPvwe2Gu92HwTd9QyU5dcNvPudR", {
  api_host: "https://us.i.posthog.com",
  defaults: "2026-05-30",
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Analytics />
    </BrowserRouter>
  </StrictMode>,
);
