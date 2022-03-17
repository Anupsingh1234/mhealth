import React, { useContext, useEffect } from "react";
import ActivityV2 from "./Dashboard/Activity/Activity.v2";
import GlobalStateContext from "../context/GlobalStateContext";
import "../styles/DashboardWithParam.css";
import { useHistory } from "react-router-dom";

const Programs = (props) => {
  // replace event from context
  const history = useHistory();
  const { globalState } = useContext(GlobalStateContext);
  // useEffect(() => {
  //   if (!globalState) {
  //     history.replace("/#/home")
  //     return
  //   }
  // }, [])

  return (
    <div className="Dasboard">
      <div className="flex flex-col min-h-[100vh] bg-white md:mx-12 mt-12 md:mt-8">
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
