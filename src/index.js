import React, { Suspense, lazy, useEffect, useState } from "react";
import { HashRouter as Router } from "react-router-dom";
import ReactDOM from "react-dom";
import "./index.css";
import { SnackbarProvider } from "notistack";
const App = lazy(() => import("./App"));
import ThemeProvider from "./context/ThemeProvider";
import GlobalStateProvider from "./context/GlobalStateProvider";

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div />}>
      <Router>
        <ThemeProvider>
          <GlobalStateProvider>
            <SnackbarProvider maxSnack={3}>
              <App />
            </SnackbarProvider>
          </GlobalStateProvider>
        </ThemeProvider>
      </Router>
    </Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);
