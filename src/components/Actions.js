import React from "react";
import Navbar from "./Navbar";
import TopUserDetails from "./TopUserDetails";

import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

import "../styles/Actions.css";

const actionName = {
  quiz: "Quiz",
  team: "Team",
  Challenge: "Invite Friends",
  Source: "Data Source",
  Gallery: "Gallery",
  Compare: "Compare",
  achievement: "Achievement",
  challenge: "Sunday Challenge",
  Target: "Set Target",
  Performance: "Daily Score",
  Leaderboard: "Leaderboard",
};

const Actions = ({
  setDashboardState,
  dashboardState,
  getCurrentAllEvents,
  handleCompare,
  children,
}) => {
  return (
    <div className="flex flex-col">
      <div className="actionContainer">
        {/* <Navbar /> */}
        {/* <TopUserDetails /> */}
        <div className="actionMain">{children}</div>
      </div>
    </div>
  );
};

export default Actions;
