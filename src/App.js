import "./App.css";

import React, { lazy, Suspense, useState } from "react";
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
import Modal from "react-modal";

import axios from "axios";
Modal.setAppElement("#root");

const App = () => {
  const location = useLocation();
  const history = useHistory();
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
            view: Dashboard,
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
    <div className={YottaMatch ? "Yotta-App" : "App"}>
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
              if (history.location.pathname === "/login") {
                return (
                  <Route
                    exact
                    path={"/login"}
                    render={() => <Login YottaMatch={YottaMatch} />}
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
    </div>
  );
};

export default App;
