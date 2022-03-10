import React from "react";
import Divider from "../Form/Divider";
import SearchByCode from "./SearchByCode";

const DefaultDashboard = (props) => {
  const { children, handleSearchEvent } = props;
  return (
    <div>
      {children}
      <div className="mx-2">
        <SearchByCode handleSearchEvent={handleSearchEvent} />
      </div>
    </div>
  );
};

export default DefaultDashboard;
