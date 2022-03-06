import React from "react";
import logoPng from "../../../assets/logo.png";
import "./index.css";

const CenteredLoader = () => {
  return (
    <div className="loading">
      <div className="spinner">
        <img src={logoPng} />
        {/* <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
                <div class="rect4"></div>
                <div class="rect5"></div> */}
      </div>
    </div>
  );
};

export default CenteredLoader;
