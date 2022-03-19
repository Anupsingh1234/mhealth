import React from "react";

const ChallengeList = (props) => {
  return (
    <div className="Challenges items-end" id="Challenges">
      <div>{props.children}</div>
    </div>
  );
};

export default ChallengeList;
