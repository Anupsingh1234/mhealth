import cn from "classnames";
import React, { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";

export const PrimaryButton = ({
  className,
  children,
  disabled,
  loading,
  mini,
  style,
  ...props
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <button
      className={cn(
        "border-0 rounded-full outline-none focus:outline-none",
        "flex justify-center items-center w-full",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        mini ? "px-4 py-1" : "px-6 py-3",
        className
      )}
      style={{
        background: !disabled ? theme.buttonBGColor : "#e5e7eb",
        color: !disabled ? theme.buttonTextColor : "#000",
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export const SecondaryButton = ({
  className,
  children,
  disabled,
  loading,
  mini,
  style,
  ...props
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <button
      className={cn(
        "border-0 rounded-full outline-none focus:outline-none",
        "flex justify-center items-center w-full",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        mini ? "px-4 py-1" : "px-6 py-3",
        className
      )}
      style={{
        background: !disabled ? "#FFF" : "#e5e7eb",
        color: !disabled ? theme.buttonBGColor : "#000",
        border: "1px solid",
        borderColor: theme.buttonBGColor,
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
