import {
  faHome,
  faBook,
  faWalking,
  faHeartPulse,
  faHiking,
  faCog,
  faHouse,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";

export const PROGRAMS = [
  {
    key: "home",
    title: "Home",
    onClick: () => {
      window.location.replace("/#/home");
    },
    icon: faHouse,
  },
  {
    key: "programs",
    title: "Programs",
    onClick: () => {
      window.location.replace("/#/programs");
    },
    icon: faHiking,
  },
  {
    key: "walkathon",
    title: "Walkathon",
    onClick: () => {
      window.location.replace("/#/walkathon");
    },
    icon: faWalking,
  },
  {
    key: "health",
    title: "Health",
    onClick: () => {
      window.location.replace("/#/health");
    },
    icon: faHeartPulse,
  },
  {
    key: "settings",
    title: "Settings",
    onClick: () => {
      window.location.replace("/#/settings");
    },
    icon: faCog,
  },
  {
    key: "forum",
    title: "Community",
    onClick: () => {
      window.location.replace("/#/forum");
    },
    icon: faMessage,
  },
];
