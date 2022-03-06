import React from "react";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

const Input = ({
  type = "text",
  label,
  placeholder,
  id,
  className,
  onChange,
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          type={type}
          name={name}
          id={id}
          placeholder={placeholder}
          className={classNames(
            "block w-full p-2 pr-10 sm:text-sm border-gray-300 rounded-md",
            "focus:ring-indigo-500 focus:border-indigo-500",
            "bg-slate-100 text-slate-800"
          )}
          onChange={onChange}
        />
        {type === "search" && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FA icon={faSearch} color="gray" size="1x" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
