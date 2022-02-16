import React from "react";

export default function SelectBox({ selectedValue, handleChange, options }) {
  return (
    <select value={selectedValue} label="Age" onChange={handleChange}>
      {options.map((option) => (
        <option value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}
