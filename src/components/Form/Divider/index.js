import React from "react";

export default function Divider({ children }) {
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
        }}
        aria-hidden="true"
      >
        <div
          style={{
            width: "100%",
            border: "0.5px solid gray",
            opacity: 0.2,
          }}
        />
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span
          style={{
            padding: "1rem",
            background: "white",
          }}
        >
          {children}
        </span>
      </div>
    </div>
  );
}
