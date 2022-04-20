import React, { Suspense, lazy, useEffect, useState } from "react";
import { HashRouter as Router } from "react-router-dom";
import ReactDOM from "react-dom";
import "./index.css";
import { SnackbarProvider } from "notistack";
const App = lazy(() => import("./App"));
import ThemeProvider from "./context/ThemeProvider";
import ErrorBoundary from "./components/ErrorBoundary";

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div />}>
      <Router>
        <ThemeProvider>
          <SnackbarProvider maxSnack={3}>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </SnackbarProvider>
        </ThemeProvider>
      </Router>
    </Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);
