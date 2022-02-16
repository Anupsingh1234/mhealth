import {
  faComments,
  faUserFriends,
  faRunning,
  faDatabase,
  faPhotoVideo,
  faNotEqual,
  faAward,
  faCalendarWeek,
  faBullseye,
  faChess,
  faTrophy,
  faFileExcel,
  faHome,
  faKey,
  faBook,
  faAddressCard,
  faWalking,
  faHiking,
  faCog,
} from "@fortawesome/free-solid-svg-icons";

export const PROGRAMS = [
  {
    key: "programs",
    title: "Programs",
    onClick: () => {
      window.location.replace("/#/programs");
    },
    icon: faHiking,
    selected: window.location.hash === "#/programs",
  },
  {
    key: "walkathon",
    title: "Walkathon",
    onClick: () => {
      window.location.replace("/#/program/walkathon");
    },
    icon: faWalking,
    selected: window.location.hash === "#/program/walkathon",
  },
  {
    key: "quiz",
    title: "Quiz",
    onClick: () => {
      window.location.replace("/#/program/quiz");
    },
    icon: faComments,
    selected: window.location.hash === "#/program/quiz",
  },
  {
    key: "gallery",
    title: "Gallery",
    onClick: () => {
      window.location.replace("/#/program/gallery");
    },
    icon: faPhotoVideo,
    selected: window.location.hash === "#/program/gallery",
  },
  {
    key: "settings",
    title: "Settings",
    onClick: () => {
      window.location.replace("/#/program/settings");
    },
    icon: faCog,
    selected: window.location.hash === "#/program/settings",
  },
  {
    key: "report",
    title: "Report",
    onClick: () => {
      window.location.replace("/#/report");
    },
    icon: faBook,
    selected: window.location.hash === "#/program/report",
  },
  // { key: "manage", title: "Manage", onClick: () => { window.location.replace("/#/program/manage") }, icon: faChess, selected: window.location.hash === "#/program/manage" },
];

export const SETTINGS = [
  { key: "home", title: "Home", route: "/programs", icon: faHome },
  {
    key: "data_source",
    title: "Data Source",
    route: "/action/gallery",
    icon: faDatabase,
  },
  {
    key: "profile",
    title: "Profile",
    route: "/action/gallery",
    icon: faAddressCard,
  },
  {
    key: "reset_pin",
    title: "Reset Pin",
    route: "/action/gallery",
    icon: faKey,
  },
];

export const REPORT = [
  { key: "home", title: "Home", route: "/programs", icon: faHome },
  { key: "report", title: "Report", route: "/action/gallery", icon: faBook },
];

// export const MANAGE = [
//     { key: "home", title: "Home", route: "/programs", icon: faChess },
//     { key: "manage", title: "Manage", route: "/action/gallery", icon: faChess },
// ]
