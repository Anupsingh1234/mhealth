import React from "react";

export default function Button({ text, onClick }) {
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        style={{
          margin: "0 .5rem",
          borderRadius: "8px",
          height: "fit-content",
          padding: ".5rem 1rem",
          textTransform: "uppercase",
          background: "#518ad6",
          color: "white",
        }}
      >
        {text}
      </button>
    </div>
  );
}
