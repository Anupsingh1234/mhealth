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
  faHeartPulse,
  faHiking,
  faCog,
  faArchive,
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
    key: "health",
    title: "Health",
    onClick: () => {
      window.location.replace("/#/program/health");
    },
    icon: faHeartPulse,
    selected: window.location.hash === "#/program/health",
  },
  {
    key: "settings",
    title: "Settings",
    onClick: () => {
      window.location.replace("/#/settings");
    },
    icon: faCog,
    selected: window.location.hash === "#/settings",
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
  // {
  //   key: "eventmanagement",
  //   title: "Event Management",
  //   onClick: () => {
  //     window.location.replace("/#/eventmanagement");
  //   },
  //   icon: faArchive,
  //   selected: window.location.hash === "#/eventmanagement",
  // },
  // { key: "manage", title: "Manage", onClick: () => { window.location.replace("/#/program/manage") }, icon: faChess, selected: window.location.hash === "#/program/manage" },
];

export const REPORT = [
  { key: "home", title: "Home", route: "/programs", icon: faHome },
  { key: "report", title: "Report", route: "/action/report", icon: faBook },
];

// export const MANAGE = [
//     { key: "home", title: "Home", route: "/programs", icon: faChess },
//     { key: "manage", title: "Manage", route: "/action/gallery", icon: faChess },
// ]
