import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";  // Importation de Bootstrap CSS
import { BrowserRouter } from "react-router-dom";

import App from "./App";  // Vous n'avez pas besoin d'importer "Stages" si vous l'utilisez dans App

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
