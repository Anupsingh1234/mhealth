import React from "react";
import HraCard from "./HraCard";
const Index = ({ eventID, currentEventObj }) => {
  return (
    <div>
      <HraCard eventID={eventID} currentEventObj={currentEventObj} />
    </div>
  );
};
export default Index;
