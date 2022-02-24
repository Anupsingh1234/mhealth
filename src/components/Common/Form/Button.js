import React from "react";
import classNames from "classnames";

const Button = ({ type, id, className, text, onClick, loading = false }) => {
  return (
    <button
      id={id}
      className={classNames(
        "mt-1 relative rounded-md shadow-sm",
        "block w-full p-2 text-xs border-gray-300 rounded-md",
        "focus:ring-indigo-500 focus:border-indigo-500",
        "border border-slate-300",
        "text-slate-600 uppercase leading-relaxed",
        {
          "bg-indigo-600 hover:bg-indigo-800 text-white border-0":
            type === "primary",
        },
        { "bg-slate-200 hover:bg-slate-300 text-black": type === "default" },
        {
          "bg-red-600 hover:bg-red-800 text-white border-0": type === "danger",
        },
        className
      )}
      onClick={onClick}
    >
      {loading && <p className="text-xs text-black">Loading...</p>}
      {!loading && text}
    </button>
  );
};

export default Button;
