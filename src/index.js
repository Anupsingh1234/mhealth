import React, { Suspense, lazy, useEffect, useState } from "react";
import { HashRouter as Router } from "react-router-dom";
import ReactDOM from "react-dom";
import "./index.css";
import { SnackbarProvider } from "notistack";
const App = lazy(() => import("./App"));
import ThemeProvider from "./context/ThemeProvider";
import SelectedEventProvider from "./context/SelectedEventProvider";

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div />}>
      <Router>
        <ThemeProvider>
          <SelectedEventProvider>
            <SnackbarProvider maxSnack={3}>
              <App />
            </SnackbarProvider>
          </SelectedEventProvider>
        </ThemeProvider>
      </Router>
    </Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);
