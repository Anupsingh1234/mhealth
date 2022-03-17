import React, { useState } from "react";
import GlobalStateContext from "./GlobalStateContext";

const GlobalStateProvider = (props) => {
  const [globalState, setGlobalState] = useState();

  return (
    <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
      {props.children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;
