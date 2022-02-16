import React from "react";

export default function Input({
  label,
  type,
  name,
  id,
  placeholder,
  onChange,
  onKeyPress,
  className,
}) {
  return (
    <div>
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        onChange={onChange}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            onKeyPress();
          }
        }}
        style={{
          border: "0.5px solid #f5f5f5",
          fontSize: "16px",
          padding: ".4rem 1rem",
        }}
      />
    </div>
  );
}
