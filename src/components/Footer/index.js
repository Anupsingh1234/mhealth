import React, { useEffect, useState } from "react";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";

import classNames from "classnames";

const Footer = (props) => {
  const { tabs } = props;
  const [selectedTab, setSelectedTab] = useState();

  useEffect(() => {
    if (window.location.hash) {
      const tabNameArray = window.location.hash.split("/");
      const tabName = tabNameArray?.length > 1 ? tabNameArray[1] : "";
      setSelectedTab(tabName);
    }
  }, [window.location.hash]);

  return (
    <div
      className={classNames(
        "fixed left-0 bottom-0",
        "w-full h-[75px] bg-[#f5f5f5] text-black",
        "text-center flex md:justify-center",
        "md:max-w-full"
      )}
    >
      {tabs.map((tab) => (
        <Tab tab={tab} key={tab.key} selectedTab={selectedTab} />
      ))}
    </div>
  );
};

const Tab = ({ tab, selectedTab }) => {
  const isSelected = tab.key === selectedTab;
  return (
    <div
      className={classNames(
        "flex flex-col justify-center items-center flex-1 md:min-w-[125px] md:max-w-[125px] bg-[#f5f5f5] hover:bg-[#e5e5e5] cursor-pointer",
        { "bg-[#555] hover:bg-[#444]": isSelected }
      )}
      onClick={() => tab.onClick()}
    >
      <FA
        icon={tab.icon}
        color="#737373"
        className="icon"
        color={isSelected ? "#fff" : "#555"}
      />
      <p
        className={classNames(
          "m-0 mt-[0.25rem] p-0 font-semibold leading-snug text-[10px]",
          isSelected ? "text-white" : "text-black"
        )}
      >
        {tab.title}
      </p>
    </div>
  );
};

export default Footer;
