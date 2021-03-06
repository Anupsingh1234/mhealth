import "./App.css";

import React, { lazy, Suspense, useState, useContext } from "react";
import { useMount } from "react-use";
import {
  Route,
  Redirect,
  Switch,
  useLocation,
  useHistory,
} from "react-router-dom";
const Login = lazy(() => import("./components/Login/Login"));
const Dashboard = lazy(() => import("./components/Dashboard"));
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
const Forum = lazy(() => import("./components/Forum"));
const Messages = lazy(() => import("./components/Forum/components/Messages"));
const BookingReport = lazy(() => import("./components/BookingReport"));
import Modal from "react-modal";
import ThemeContext from "./context/ThemeContext";

import axios from "axios";
import classNames from "classnames";
Modal.setAppElement("#root");

const App = () => {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const history = useHistory();
  const condition = JSON?.parse(localStorage.getItem("condition"));
  let pages =
    condition && condition.isAdmin === true
      ? [
          {
            pageLink: "/",
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
            view: Dashboard,
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
            pageLink: "/forum",
            view: Forum,
            displayName: "Forum",
            showInNavbar: false,
          },
          {
            pageLink: "/forum/:forumID",
            view: Messages,
            displayName: "Messages",
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
            pageLink: "/pdf",
            view: Pdf,
            displayName: "Pdf",
            showInNavbar: false,
          },
          {
            pageLink: "/dashboard",
            view: Dashboard,
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
          {
            pageLink: "/activities",
            view: Activities,
            displayName: "Activities",
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
            pageLink: "/forum",
            view: Forum,
            displayName: "Forum",
            showInNavbar: false,
          },
          {
            pageLink: "/forum/:forumID",
            view: Messages,
            displayName: "Messages",
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
            pageLink: "/pdf",
            view: Pdf,
            displayName: "Pdf",
            showInNavbar: false,
          },
          {
            pageLink: "/dashboard",
            view: Dashboard,
            displayName: "Dashboard",
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
            pageLink: "/forum",
            view: Forum,
            displayName: "Forum",
            showInNavbar: false,
          },
          {
            pageLink: "/forum/:forumID",
            view: Messages,
            displayName: "Messages",
            showInNavbar: false,
          },
        ];

  if (condition && condition.isLabotrary) {
    pages.push({
      pageLink: "/booking-report",
      view: BookingReport,
      displayName: "Booking Report",
      showInNavbar: true,
    });
  }
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
                  render={() => <page.view />}
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
    </div>
  );
};

export default App;
