import React, { useState } from "react";
import {
  faKey,
  faAddressCard,
  faUserLock,
  faShoppingCart,
  faUserPlus,
  faLocationArrow,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Profile from "./Profile";
import ResetPin from "./ResetPin";
import CreateQuiz from "./CreateQuizQuestion";
import MarketDashboard from "./MarketDashboard";
import SocialPostComponent from "./SocialPostComponent";
import SocialLinkComponent from "./SocialLinkComponent";
import classNames from "classnames";

const Settings = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const actions = [
    {
      id: "profile",
      label: "Profile",
      icon: faAddressCard,
      onClick: () => {
        setSelectedTab("profile");
      },
    },
    {
      id: "reset_pin",
      label: "Reset Pin",
      icon: faKey,
      onClick: () => {
        setSelectedTab("reset_pin");
      },
    },
    {
      id: "admin",
      label: "Admin",
      icon: faUserPlus,
      onClick: () => {
        setSelectedTab("admin");
      },
    },
    {
      id: "market_place",
      label: "Market Place",
      icon: faShoppingCart,
      onClick: () => {
        setSelectedTab("market_place");
      },
    },
    {
      id: "social_post",
      label: "Social Post",
      icon: faLocationArrow,
      onClick: () => {
        setSelectedTab("social_post");
      },
    },
    {
      id: "social_link",
      label: "Social Link",
      icon: faLink,
      onClick: () => {
        setSelectedTab("social_link");
      },
    },
  ];
  return (
    <div className="bg-[#518ad6] h-[100vh] w-[100vw] flex flex-col items-center">
      <div
        className={classNames(
          "flex flex-col gap-4",
          "px-10 py-2 w-[max-content] rounded",
          "text-center mt-2"
        )}
      >
        <div className="flex gap-4">
          {actions.map(({ icon, label, onClick, id }, index) => (
            <Actions
              {...{
                icon,
                label,
                onClick,
                index,
                id,
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
  selectedTab,
  setSelectedTab,
}) => (
  <div>
    <div
      key={index}
      role="button"
      tabIndex={index}
      onClick={onClick}
      className={classNames(
        "cursor-pointer flex flex-col items-center justify-center",
        "w-[50px] h-[50px] rounded-full text-sm",
        { "text-black bg-white": id === selectedTab },
        { "text-white bg-black": id !== selectedTab }
      )}
    >
      <FontAwesomeIcon
        icon={icon}
        size="1x"
        color={id !== selectedTab ? "#fff" : "#000"}
      />
    </div>
    <p className="text-xs mt-1">{label}</p>
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
    default:
      return "";
  }
};
export default Settings;
