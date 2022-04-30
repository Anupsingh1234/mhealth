import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const SingleDateSelector = ({ value, onChange }) => {
  return (
    <DatePicker
      selected={value}
      onChange={(date) => {
        onChange(date);
      }}
      className="border p-2"
    />
  );
};

export default SingleDateSelector;
