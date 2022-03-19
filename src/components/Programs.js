import React, { useContext, useEffect } from "react";
import ActivityV2 from "./Dashboard/Activity/Activity.v2";
import GlobalStateContext from "../context/GlobalStateContext";
import "../styles/DashboardWithParam.css";
import { useHistory } from "react-router-dom";

const Programs = (props) => {
  const { globalState } = useContext(GlobalStateContext);

  return (
    <div className="bg-[#fff] flex flex-col min-h-[100vh]">
      <div className="flex flex-col min-h-[100vh] bg-white md:mx-6 mt-12 md:mt-8">
        <ActivityV2
          eventId={
            globalState ? globalState?.selectedChallengeObject?.id : null
          }
          currentEventObj={
            globalState ? globalState?.selectedChallengeObject : {}
          }
        />
      </div>
    </div>
  );
};

export default Programs;
