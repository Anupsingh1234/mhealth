import React from "react";
import Divider from "../Form/Divider";
import SearchByCode from "./SearchByCode";

const DefaultDashboard = (props) => {
  const { children, handleSearchEvent } = props;
  return (
    <div>
      {children}
      <SearchByCode handleSearchEvent={handleSearchEvent} />
    </div>
  );
};

export default DefaultDashboard;
