import { useState, useEffect } from "react";
import SelectedEventContext from "./SelectedEventContext";

const SelectedEventProvider = (props) => {
  const [selected, setSelected] = useState();
  useEffect(() => {
    setSelected(props.selectedEvent);
  }, [props.selectedEvent]);
  return (
    <SelectedEventContext.Provider value={{ selected, setSelected }}>
      {props.children}
    </SelectedEventContext.Provider>
  );
};

export default SelectedEventProvider;
