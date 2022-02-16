import "./App.css";

import React, { lazy, Suspense, useEffect, useState } from "react";
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
import axios from "axios";

const App = () => {
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
  const [footerTabs, setFooterTabs] = useState(defaultTabs);
  const location = useLocation();
  const condition = JSON?.parse(localStorage.getItem("condition"));
  const pages =
    condition && condition.isAdmin === true
      ? [
          {
            pageLink: "/login",
            view: Login,
            displayName: "Login",
            showInNavbar: true,
          },
          {
            pageLink: "/pdf",
            view: Pdf,
            displayName: "Pdf",
            showInNavbar: false,
          },
          {
            pageLink: "/dashboard",
            view: DashboardLegacy,
            displayName: "Dashboard",
            showInNavbar: true,
          },
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
          {
            pageLink: "/",
            view: UpcomingEvents,
            displayName: "UpcomingEvents",
            showInNavbar: true,
          },
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
        ]
      : condition && condition.isModerator === true
      ? [
          {
            pageLink: "/login",
            view: Login,
            displayName: "Login",
            showInNavbar: true,
          },
          {
            pageLink: "/pdf",
            view: Pdf,
            displayName: "Pdf",
            showInNavbar: false,
          },
          {
            pageLink: "/dashboard",
            view: DashboardLegacy,
            displayName: "Dashboard",
            showInNavbar: true,
          },
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
          {
            pageLink: "/",
            view: UpcomingEvents,
            displayName: "UpcomingEvents",
            showInNavbar: true,
          },
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
        ]
      : [
          {
            pageLink: "/login",
            view: Login,
            displayName: "Login",
            showInNavbar: true,
          },
          {
            pageLink: "/pdf",
            view: Pdf,
            displayName: "Pdf",
            showInNavbar: false,
          },
          {
            pageLink: "/dashboard",
            view: DashboardLegacy,
            displayName: "Dashboard",
            showInNavbar: true,
          },
          {
            pageLink: "/",
            view: UpcomingEvents,
            displayName: "UpcomingEvents",
            showInNavbar: true,
          },
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

  return (
    <div className="App">
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
              if (history.location.pathname === "/login") {
                return (
                  <Route
                    exact
                    path={"/login"}
                    render={() => <Login />}
                    key={0}
                  />
                );
              } else {
                return (
                  <Route
                    exact
                    path={"/"}
                    render={() => <UpcomingEvents />}
                    key={0}
                  />
                );
              }
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
