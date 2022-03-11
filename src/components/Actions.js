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
    <div className="Dasboard">
      <div className="actionContainer">
        {/* <Navbar /> */}
        {/* <TopUserDetails /> */}
        <div className="actionMain">
          <div className="actionHeader">
            {/* <FA
                        icon={faArrowCircleLeft}
                        size="2x"
                        onClick={() => {
                            if (dashboardState.selectedAction === "Compare") {
                                setDashboardState({
                                    ...dashboardState,
                                    selectedAction: "Activities",
                                    listOfChallenges: getCurrentAllEvents(),
                                    compareData: {
                                        categories: [],
                                        data: []
                                    }
                                })
                            } else {
                                setDashboardState({
                                    ...dashboardState,
                                    selectedAction: "Activities",
                                })
                            }

                        }}
                        className="actionBackButton"
                    /> */}
            {/* <div style={{ marginLeft: "1rem" }}>
              {dashboardState.selectedAction === "Compare" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  Select events to compare
                  <MultiSelect
                    label="Events"
                    options={dashboardState.listOfChallenges.map((op) => ({
                      name: op.challengeName,
                      id: op.id,
                    }))}
                    handleChange={(value) => {
                      handleCompare(value);
                    }}
                  />
                </div>
              ) : (
                <div>
                  <div className="actionTitle">
                    {dashboardState.selectedChallengeObject.challengeName}
                  </div>
                  <div className="actionSubTitle">
                    {actionName[dashboardState.selectedAction]}
                  </div>
                </div>
              )}
            </div> */}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default Actions;
