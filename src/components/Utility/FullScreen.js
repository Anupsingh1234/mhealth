import React, { useState, useEffect } from "react";
import { Maximize2, Minimize2 } from "react-feather";

const FullScreen = ({ id, theme }) => {
  const [isMax, setMax] = useState(
    localStorage.getItem("dashboard_view_status") == 0 ? true : false
  );
  useEffect(() => {
    let defElem = document.getElementById(id);
    if (isMax) {
      defElem.classList.add("d-none");
    } else {
      defElem.classList.remove("d-none");
    }
  }, []);
  return (
    <div
      className="full-screen-button"
      style={{ background: theme.buttonBGColor, color: theme.buttonTextColor }}
      onClick={() => {
        let Element = document.getElementById(id);

        if (!Element.classList.contains("d-none")) {
          setMax(true);
          Element.classList.add("d-none");
        } else {
          setMax(false);
          Element.classList.remove("d-none");
        }
      }}
    >
      {isMax ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
    </div>
  );
};

export default FullScreen;
