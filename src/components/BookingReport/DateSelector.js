import React from "react";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
const DateSelector = ({ value, handleDateChange }) => {
  return (
    <DateRangePicker
      onChange={handleDateChange}
      value={value}
      clearIcon={null}
      className="booking-date-picker"
    />
  );
};

export default DateSelector;
