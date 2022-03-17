import React, { useState } from "react";
import ScrollableList from "./ScrollableList";

import EventCardCompare from "./EventCardCompare";

const ListOfEventsForCompare = ({
  handleChallengeCardClick,
  fetchChallenges,
  data,
  dashboardState,
  setDashboardState,
  selectedAction,
  listType,
  selectedChallengeArray,
  selectedChallenge,
}) => {
  const [compareList, setCompareList] = useState([]);
  const displayListOfChallenges = () => {
    let list = [];
    if (data && data.length > 0) {
      /** show public and private? */
      let tempList =
        selectedAction === "Leaderboard" || listType !== "subEvent"
          ? data
          : data.filter((item) => item.isParticipated);
      list = tempList.map((challenge) => {
        return (
          <EventCardCompare
            challenge={challenge}
            handleChallengeCardClick={handleChallengeCardClick}
            dashboardState={dashboardState}
            key={challenge.id}
            setDashboardState={setDashboardState}
            fetchChallenges={fetchChallenges}
            listType={listType}
            selectedChallenge={selectedChallenge}
            selectedChallengeArray={selectedChallengeArray}
            selectedAction={selectedAction}
            compareList={compareList}
            setCompareList={setCompareList}
          />
        );
      });
    } else {
      for (let i = 0; i < 4; i++) {
        list.push(
          <div
            className="challenge-card"
            style={{
              width: 320,
              height: 240,
            }}
            key={i}
          ></div>
        );
      }
    }
    if (list.length === 0) {
      for (let i = 0; i < 4; i++) {
        list.push(
          <div
            className="challenge-card"
            style={{
              width: 320,
              height: 240,
            }}
            key={i}
          ></div>
        );
      }
    }
    return list;
  };
  return (
    <div>
      <ScrollableList>{displayListOfChallenges()}</ScrollableList>
    </div>
  );
};

export default ListOfEventsForCompare;
