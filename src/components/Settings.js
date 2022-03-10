import React, { useState } from "react";
import {
  faKey,
  faAddressCard,
  faUserLock,
  faShoppingCart,
  faUserPlus,
  faLocationArrow,
  faLink,
  faArchive,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Profile from "./Profile";
import ResetPin from "./ResetPin";
import CreateQuiz from "./CreateQuizQuestion";
import MarketDashboard from "./MarketDashboard";
import SocialPostComponent from "./SocialPostComponent";
import SocialLinkComponent from "./SocialLinkComponent";
import EventManagement from "./EventManagement";
import classNames from "classnames";
import TopUserDetails from "./TopUserDetails";

const Settings = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const condition = JSON?.parse(localStorage.getItem("condition"));
  const isAdmin = condition && condition.isAdmin === true;
  const isModerator = condition && condition.isModerator === true;
  const actions = [
    {
      id: "profile",
      label: "Profile",
      icon: faAddressCard,
      onClick: () => {
        setSelectedTab("profile");
      },
      display: true,
    },
    {
      id: "reset_pin",
      label: "Reset Pin",
      icon: faKey,
      onClick: () => {
        setSelectedTab("reset_pin");
      },
      display: true,
    },
    {
      id: "admin",
      label: "Admin",
      icon: faUserPlus,
      onClick: () => {
        setSelectedTab("admin");
      },
      display: isAdmin || isModerator,
    },
    {
      id: "market_place",
      label: "Market Place",
      icon: faShoppingCart,
      onClick: () => {
        setSelectedTab("market_place");
      },
      display: isAdmin || isModerator,
    },
    {
      id: "social_post",
      label: "Social Post",
      icon: faLocationArrow,
      onClick: () => {
        setSelectedTab("social_post");
      },
      display: isModerator,
    },
    {
      id: "social_link",
      label: "Social Link",
      icon: faLink,
      onClick: () => {
        setSelectedTab("social_link");
      },
      display: isModerator,
    },
    {
      id: "eventmanagement",
      label: "Event Management",
      icon: faArchive,
      onClick: () => {
        setSelectedTab("eventmanagement");
      },
      display: isAdmin,
    },
  ];

  return (
    <div className="bg-white h-[100vh] w-[100vw] flex flex-col items-center">
      <TopUserDetails />
      <div
        className={classNames(
          "flex flex-col gap-4",
          "px-10 py-2 w-[max-content] rounded",
          "text-center mt-2"
        )}
      >
        <div className="flex">
          {actions
            .filter((action) => action.display)
            .map(({ icon, label, onClick, id, display }, index) => (
              <Actions
                {...{
                  icon,
                  label,
                  onClick,
                  index,
                  id,
                  display,
                  selectedTab,
                  setSelectedTab,
                }}
              />
            ))}
        </div>
      </div>
      <div>{renderComponent(selectedTab)}</div>
    </div>
  );
};

const Actions = ({
  icon,
  label,
  onClick,
  index,
  id,
  display,
  selectedTab,
  setSelectedTab,
}) => (
  <div className="flex flex-col items-center justify-center w-[80px] h-[auto]">
    <div className="h-[60px] flex items-center">
      <div
        key={index}
        role="button"
        tabIndex={index}
        onClick={onClick}
        className={classNames(
          "cursor-pointer flex flex-col items-center justify-center",
          "w-[50px] h-[50px] rounded-full text-sm",
          { "text-black bg-gray-200": id === selectedTab },
          { "text-white bg-black": id !== selectedTab }
        )}
      >
        <FontAwesomeIcon
          icon={icon}
          size="1x"
          color={id !== selectedTab ? "#fff" : "#000"}
        />
      </div>
    </div>
    <p className="text-xs mt-1 h-[40px]">{label}</p>
  </div>
);

const renderComponent = (selectedTab) => {
  switch (selectedTab) {
    case "profile":
      return <Profile />;
    case "reset_pin":
      return <ResetPin />;
    case "admin":
      return <CreateQuiz />;
    case "market_place":
      return <MarketDashboard />;
    case "social_link":
      return <SocialLinkComponent />;
    case "social_post":
      return <SocialPostComponent />;
    case "eventmanagement":
      return <EventManagement />;
    default:
      return "";
  }
};
export default Settings;
