import { faTimes } from "@fortawesome/free-solid-svg-icons";
import cn from "classnames";
import React from "react";
import ReactModal from "react-modal";
import IconCircleButton from "../IconCircleButton";

const CenteredModal = ({
  children,
  className,
  containerClassName,
  removeClose = false,
  onRequestClose,
  noTransition,
  width = 400,
  maxWidth = 800,
  minWidth = "auto",
  disableScroll,
  background = "bg-white",
  style,
  ...props
}) => {
  return (
    <ReactModal
      style={{
        content: {
          width,
          maxWidth,
          minWidth,
          ...style,
        },
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          margin: "auto",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9000,
        },
      }}
      overlayClassName={cn("ReactModal__Overlay", {
        ReactModal__Overlay__Transition: !noTransition,
      })}
      className={cn(
        "max-h-full overflow-auto outline-none",
        disableScroll ? "overflow-hidden" : "overflow-auto",
        containerClassName
      )}
      onRequestClose={(e) => {
        e.stopPropagation();
        onRequestClose();
      }}
      {...props}
    >
      <div
        className={cn(
          `flex flex-col justify-center ${background} rounded-md relative`,
          className
        )}
      >
        {children}
        {!removeClose && (
          <IconCircleButton
            iconSize={20}
            size={30}
            icon={faTimes}
            className="right-4 top-4 absolute text-gray-400 bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onRequestClose();
            }}
          />
        )}
      </div>
    </ReactModal>
  );
};

export default CenteredModal;
