import React, { useEffect } from "react";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";

import "./Footer.css";

const Footer = (props) => {
  const { tabs } = props;

  useEffect(() => {
    // TODO: Remove after testing
  }, [props.tabs]);

  return (
    <div className="footer">
      {tabs.map((tab) => (
        <Tab tab={tab} key={tab.key} />
      ))}
    </div>
  );
};

const Tab = ({ tab }) => {
  const selectedTab = window.location.hash.split("/");
  const getClass = (tab) => {
    if (
      ["programs", "walkathon", "manage", "settings", "report"].includes(
        tab.key
      )
    ) {
      return selectedTab[selectedTab.length - 1] === tab.key;
    } else {
      return tab.selected;
    }
  };
  return (
    <div
      className={getClass(tab) ? "tabContainerSelected" : "tabContainer"}
      onClick={() => tab.onClick()}
    >
      <FA
        icon={tab.icon}
        color="#737373"
        className="icon"
        color={getClass(tab) ? "#fff" : "#555"}
      />
      <p>{tab.title}</p>
    </div>
  );
};

export default Footer;
