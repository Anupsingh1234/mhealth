import React, { useEffect, useState } from "react";
import Imgshow from "./AchievementGrayFiles/Imgshow";
import { getAchievements } from "../services/challengeApi";

export const Achievments = (props) => {
  const [distanceLogo, setDistanceLogo] = useState({});
  useEffect(() => {
    getAchievements().then((res) => {
      setDistanceLogo(res.data.response.responseData?.achievementIcons);
    });
  }, []);

  return (
    <>
      <div style={{ lineheight: 10 }}>
        <Imgshow logo={distanceLogo} event={props.eventId} />
      </div>
    </>
  );
};
