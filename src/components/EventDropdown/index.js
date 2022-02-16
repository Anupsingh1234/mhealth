import React from "react";
import Dropdown from "../Form/Dropdown";

const EventDropdown = ({ className, eventNames, onSelect }) => {
  const options = [
    { key: "test1", value: "test1" },
    { key: "test2", value: "test2" },
  ];
  // const onSelect = (e) => {
  //     console.log(e);
  // }
  return (
    <Dropdown
      // label="Events"
      options={
        (eventNames &&
          eventNames.map((name) => {
            return { key: name, value: name };
          })) ||
        []
      }
      onSelect={onSelect}
      className={className}
    />
  );
};
export default EventDropdown;
