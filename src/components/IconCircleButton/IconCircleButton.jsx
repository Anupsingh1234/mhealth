import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import cn from "classnames";
import React from "react";

const IconCircleButton = ({
  onClick,
  icon,
  size = 20,
  iconSize = 12,
  className,
  active,
  darkMode,
  tooltip,
  tooltipId,
  tooltipConfig,
  children,
  ...props
}) => {
  return (
    <button
      type="button"
      className={cn(
        "icon-circle-button cursor-pointer outline-none flex items-center text-center justify-center",
        "border-0 bg-transparent rounded-full leading-none",
        className,
        { active }
      )}
      onClick={onClick}
      style={{ fontSize: iconSize, width: size, height: size }}
      data-tip={tooltip}
      data-for={tooltipId}
      {...props}
    >
      {icon && <FA icon={icon} />}
      {children}
    </button>
  );
};

export default IconCircleButton;
