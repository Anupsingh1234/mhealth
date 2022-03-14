import React, { useEffect } from "react";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";

import classNames from "classnames";

const Footer = (props) => {
  const { tabs } = props;

  useEffect(() => {
    // TODO: Remove after testing
  }, [props.tabs]);

  return (
    <div
      className={classNames(
        "fixed left-0 bottom-0 w-full h-[75px] bg-[#f5f5f5] text-black text-center flex justify-center"
      )}
    >
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
      className={classNames(
        "flex flex-col justify-center items-center min-w-[125px] bg-[#f5f5f5] hover:bg-[#e5e5e5] cursor-pointer",
        { "bg-[#555] hover:bg-[#444]": getClass(tab) }
      )}
      onClick={() => tab.onClick()}
    >
      <FA
        icon={tab.icon}
        color="#737373"
        className="icon"
        color={getClass(tab) ? "#fff" : "#555"}
      />
      <p
        className={classNames(
          "m-0 mt-[0.25rem] p-0 font-semibold leading-snug text-[10px]",
          getClass(tab) ? "text-white" : "text-black"
        )}
      >
        {tab.title}
      </p>
    </div>
  );
};

export default Footer;
