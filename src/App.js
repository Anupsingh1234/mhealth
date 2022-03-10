import "./App.css";

import React, { lazy, Suspense, useEffect, useState, useContext } from "react";
import { useMount } from "react-use";
import {
  Route,
  Redirect,
  Switch,
  useLocation,
  useHistory,
} from "react-router-dom";
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
  faWalking,
  faHiking,
  faBook,
  faCog,
  faArchive,
} from "@fortawesome/free-solid-svg-icons";

const Login = lazy(() => import("./components/Login/Login"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const DashboardLegacy = lazy(() => import("./components/DashboardLegacy"));
const DashboardWithParam = lazy(() =>
  import("./components/DashboardWithParam")
);
const Profile = lazy(() => import("./components/Profile"));
const ResetPin = lazy(() => import("./components/ResetPin"));
const DataSource = lazy(() => import("./components/DataSourceConnect"));
const EventManagement = lazy(() => import("./components/EventManagement"));
const UpcomingEvents = lazy(() => import("./components/UpcomingEvents"));
const Logout = lazy(() => import("./components/Logout"));
const Activities = lazy(() => import("./components/Activities/Activities"));
const MisReport = lazy(() => import("./components/MisReport"));
// const Admin=lazy(()=>import("./components/Admin"))
const CreateQuiz = lazy(() => import("./components/CreateQuizQuestion"));
const MarketPlace = lazy(() => import("./components/MarketDashboard"));
// const MarketPlace = lazy(() => import('./components/Activities/MarketActivity'));
const Pdf = lazy(() => import("./components/Pdf"));
const Actions = lazy(() => import("./components/Actions"));
const Programs = lazy(() => import("./components/Programs"));
const DefaultView = lazy(() => import("./components/DefaultView"));
const Footer = lazy(() => import("./components/Footer"));
const Forum = lazy(() => import("./components/Forum"));
const Settings = lazy(() => import("./components/Settings"));
const Messages = lazy(() => import("./components/Forum/components/Messages"));
import Modal from "react-modal";
import ThemeContext from "./context/ThemeContext";

import axios from "axios";
import classNames from "classnames";

Modal.setAppElement("#root");

const App = () => {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const history = useHistory();
  const defaultTabs = [
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
  const [footerTabs, setFooterTabs] = useState(defaultTabs);
  // const location = useLocation();
  const condition = JSON?.parse(localStorage.getItem("condition"));
  const pages =
    condition && condition.isAdmin === true
      ? [
          {
            pageLink: "/",
            view: Login,
            displayName: "Login",
            showInNavbar: true,
          },
          {
            pageLink: "/settings",
            view: Settings,
            displayName: "Settings",
            showInNavbar: true,
          },
          {
            pageLink: "/pdf",
            view: Pdf,
            displayName: "Pdf",
            showInNavbar: false,
          },
          // {
          //   pageLink: "/dashboard",
          //   view: DashboardLegacy,
          //   displayName: "Dashboard",
          //   showInNavbar: true,
          // },
          {
            pageLink: "/admin",
            view: CreateQuiz,
            displayName: "Admin",
            showInNavbar: true,
          },
          {
            pageLink: "/marketplace",
            view: MarketPlace,
            displayName: "Market Place",
            showInNavbar: true,
          },
          // {
          //   pageLink: '/admin',
          //   view: Admin,
          //   displayName: 'Admin',
          //   showInNavbar: true,
          // },
          {
            pageLink: "/eventmanagement",
            view: EventManagement,
            displayName: "Event Management",
            showInNavbar: true,
          },
          {
            pageLink: "/activities",
            view: Activities,
            displayName: "Activities",
            showInNavbar: true,
          },
          // { DEPRECATED: 4-MARCH-2022
          //   pageLink: "/",
          //   view: UpcomingEvents,
          //   displayName: "UpcomingEvents",
          //   showInNavbar: true,
          // },
          {
            pageLink: "/profile",
            view: Profile,
            displayName: "Profile",
            showInNavbar: true,
          },
          {
            pageLink: "/resetpin",
            view: ResetPin,
            displayName: "Reset Pin",
            showInNavbar: true,
          },
          {
            pageLink: "/report",
            view: MisReport,
            displayName: "Report",
            showInNavbar: true,
          },
          {
            pageLink: "/source",
            view: DataSource,
            displayName: "Data Source",
            showInNavbar: true,
          },
          {
            pageLink: "/logout",
            view: Logout,
            displayName: "Logout",
            showInNavbar: false,
          },
          {
            pageLink: "/program/:id",
            view: DashboardWithParam,
            displayName: "DashboardWithParam",
            showInNavbar: false,
          },
          {
            pageLink: "/programs",
            view: Programs,
            displayName: "Programs",
            showInNavbar: false,
          },
          {
            pageLink: "/default-view",
            view: DefaultView,
            displayName: "DashboardWithParam",
            showInNavbar: false,
          },
          {
            pageLink: "/forum",
            view: Forum,
            displayName: "Forum",
            showInNavbar: false,
          },
        ]
      : condition && condition.isModerator === true
      ? [
          {
            pageLink: "/",
            view: Login,
            displayName: "Login",
            showInNavbar: true,
          },
          {
            pageLink: "/settings",
            view: Settings,
            displayName: "Settings",
            showInNavbar: true,
          },
          {
            pageLink: "/pdf",
            view: Pdf,
            displayName: "Pdf",
            showInNavbar: false,
          },
          // {
          //   pageLink: "/dashboard",
          //   view: DashboardLegacy,
          //   displayName: "Dashboard",
          //   showInNavbar: true,
          // },
          {
            pageLink: "/admin",
            view: CreateQuiz,
            displayName: "Admin",
            showInNavbar: true,
          },
          {
            pageLink: "/marketplace",
            view: MarketPlace,
            displayName: "Market Place",
            showInNavbar: true,
          },
          // {
          //   pageLink: "/admin",
          //   view: Admin,
          //   displayName: "Admin",
          //   showInNavbar: true,
          // },
          // {
          //   pageLink: "/eventmanagement",
          //   view: EventManagement,
          //   displayName: "Event Management",
          //   showInNavbar: true,
          // },
          {
            pageLink: "/activities",
            view: Activities,
            displayName: "Activities",
            showInNavbar: true,
          },
          // { DEPRECATED: 4-MARCH-2022
          //   pageLink: "/",
          //   view: UpcomingEvents,
          //   displayName: "UpcomingEvents",
          //   showInNavbar: true,
          // },
          {
            pageLink: "/profile",
            view: Profile,
            displayName: "Profile",
            showInNavbar: true,
          },
          {
            pageLink: "/resetpin",
            view: ResetPin,
            displayName: "Reset Pin",
            showInNavbar: true,
          },
          {
            pageLink: "/report",
            view: MisReport,
            displayName: "Report",
            showInNavbar: true,
          },
          {
            pageLink: "/source",
            view: DataSource,
            displayName: "Data Source",
            showInNavbar: true,
          },
          {
            pageLink: "/logout",
            view: Logout,
            displayName: "Logout",
            showInNavbar: false,
          },
          {
            pageLink: "/action/:id",
            view: DashboardWithParam,
            displayName: "DashboardWithParam",
            showInNavbar: false,
          },
          {
            pageLink: "/programs",
            view: Programs,
            displayName: "Programs",
            showInNavbar: false,
          },
          {
            pageLink: "/default-view",
            view: DefaultView,
            displayName: "DefaultView",
            showInNavbar: false,
          },
          {
            pageLink: "/forum",
            view: Forum,
            displayName: "Forum",
            showInNavbar: false,
          },
        ]
      : [
          {
            pageLink: "/",
            view: Login,
            displayName: "Login",
            showInNavbar: true,
          },
          {
            pageLink: "/settings",
            view: Settings,
            displayName: "Settings",
            showInNavbar: true,
          },
          {
            pageLink: "/pdf",
            view: Pdf,
            displayName: "Pdf",
            showInNavbar: false,
          },
          // {
          //   pageLink: "/dashboard",
          //   view: DashboardLegacy,
          //   displayName: "Dashboard",
          //   showInNavbar: true,
          // },
          // { DEPRECATED: 4-MARCH-2022
          //   pageLink: "/",
          //   view: UpcomingEvents,
          //   displayName: "UpcomingEvents",
          //   showInNavbar: true,
          // },
          {
            pageLink: "/profile",
            view: Profile,
            displayName: "Profile",
            showInNavbar: true,
          },
          {
            pageLink: "/resetpin",
            view: ResetPin,
            displayName: "Reset Pin",
            showInNavbar: true,
          },
          {
            pageLink: "/source",
            view: DataSource,
            displayName: "Data Source",
            showInNavbar: true,
          },
          {
            pageLink: "/logout",
            view: Logout,
            displayName: "Logout",
            showInNavbar: false,
          },
          {
            pageLink: "/action/:id",
            view: DashboardWithParam,
            displayName: "DashboardWithParam",
            showInNavbar: false,
          },
          {
            pageLink: "/programs",
            view: Programs,
            displayName: "DashboardWithParam",
            showInNavbar: false,
          },
          {
            pageLink: "/default-view",
            view: DefaultView,
            displayName: "DashboardWithParam",
            showInNavbar: false,
          },
          {
            pageLink: "/forum",
            view: Forum,
            displayName: "Forum",
            showInNavbar: false,
          },
        ];

  function isLoggedIn() {
    if (localStorage.getItem("token")) {
      return true;
    }
    return false;
  }

  axios.interceptors.response.use(
    function (response) {
      const responseCode = response?.data?.response?.responseCode;
      if ([13, 14, 20, 21, 22].includes(responseCode)) {
        localStorage.clear();
        history.push("/");
      }
      return response;
    },
    function (error) {
      // Do something with response error
      return Promise.reject(error);
    }
  );

  // const [YottaMatch, setYottamatch] = useState(
  //   window.location.href == "https://yottacare.mhealth.ai/#/login"
  //     ? true
  //     : false
  // );

  // useMount(() => {
  //   console.log("test yotta on mount");
  //   if (window.location.href == "https://yottacare.mhealth.ai/#/login") {
  //     setYottamatch(true);
  //   } else {
  //     setYottamatch(false);
  //   }
  // });

  const isYotta =
    window.location.href == "https://yottacare.mhealth.ai/#/login" ||
    window.location.href === "https://yottacare.mhealth.ai/#/";
  const [YottaMatch, setYottamatch] = useState(isYotta);

  useMount(() => {
    console.log("test yotta on mount", window.location);
    if (isYotta) {
      setYottamatch(true);
    } else {
      setYottamatch(false);
    }
  });

  return (
    <div
      className={"flex flex-col min-h-[100vh]"}
      style={{ background: theme.primaryColor }}
    >
      <Suspense fallback={<div />}>
        <Switch location={location}>
          {pages.map((page, index) => {
            if (isLoggedIn()) {
              return (
                <Route
                  exact
                  path={page.pageLink}
                  render={() => <page.view setFooterTabs={setFooterTabs} />}
                  key={index}
                />
              );
            } else {
              return (
                <Route
                  exact
                  path={"/"}
                  render={() => <Login YottaMatch={YottaMatch} />}
                  key={0}
                />
              );
            }
          })}
          <Redirect to="/" />
        </Switch>
      </Suspense>
      {!["/", "/login", "/default-view"].includes(location.pathname) && (
        <Footer tabs={footerTabs} />
      )}
    </div>
  );
};

export default App;
