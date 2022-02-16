import React from "react";
import classNames from "classnames";

const Dropdown = ({ label, options, onSelect, className }) => {
  return (
    <div className={classNames(className)}>
      {label && (
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <select
        id="location"
        name="location"
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        defaultValue="Canada"
        onSelect={onSelect}
      >
        {options.map((value) => (
          <option key={value.key}>{value.value}</option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
