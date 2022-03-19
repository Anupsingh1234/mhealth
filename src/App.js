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
const Login = lazy(() => import("./components/Login/Login"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const DashboardLegacy = lazy(() => import("./components/DashboardLegacy"));
const Walkathon = lazy(() => import("./components/Walkathon"));
const Health = lazy(() => import("./components/Health"));
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
const Home = lazy(() => import("./components/Home"));
const Footer = lazy(() => import("./components/Footer"));
const Forum = lazy(() => import("./components/Forum"));
const Settings = lazy(() => import("./components/Settings"));
const Messages = lazy(() => import("./components/Forum/components/Messages"));
import Modal from "react-modal";
import ThemeContext from "./context/ThemeContext";
import { PROGRAMS } from "./constants/footerTabs";

import axios from "axios";
import TopUserDetails from "./components/TopUserDetails";

Modal.setAppElement("#root");

const App = () => {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const history = useHistory();

  const [footerTabs, setFooterTabs] = useState(PROGRAMS);
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
            pageLink: "/walkathon",
            view: Walkathon,
            displayName: "Walkathon",
            showInNavbar: false,
          },
          {
            pageLink: "/health",
            view: Health,
            displayName: "Health",
            showInNavbar: false,
          },
          {
            pageLink: "/programs",
            view: Programs,
            displayName: "Programs",
            showInNavbar: false,
          },
          {
            pageLink: "/home",
            view: Home,
            displayName: "Home",
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
            pageLink: "/walkathon",
            view: Walkathon,
            displayName: "Walkathon",
            showInNavbar: false,
          },
          {
            pageLink: "/health",
            view: Health,
            displayName: "Health",
            showInNavbar: false,
          },
          {
            pageLink: "/programs",
            view: Programs,
            displayName: "Programs",
            showInNavbar: false,
          },
          {
            pageLink: "/home",
            view: Home,
            displayName: "Home",
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
            pageLink: "/walkathon",
            view: Walkathon,
            displayName: "Walkathon",
            showInNavbar: false,
          },
          {
            pageLink: "/health",
            view: Health,
            displayName: "Health",
            showInNavbar: false,
          },
          {
            pageLink: "/programs",
            view: Programs,
            displayName: "Programs",
            showInNavbar: false,
          },
          {
            pageLink: "/home",
            view: Home,
            displayName: "Home",
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

  const renderLogin = () => {
    return (
      <div
        className={"flex flex-col min-h-[100vh]"}
        style={{ background: theme.primaryColor }}
      >
        <Suspense fallback={<div />}>
          <Switch location={location}>
            <Route exact path={"/"} render={() => <Login />} key={0} />
          </Switch>
          <Redirect to="/" />
        </Suspense>
      </div>
    );
  };

  const renderPages = () => {
    return (
      <div className={"flex flex-col min-h-[100vh] bg-[#fff]"}>
        <div className="min-h-[5vh] max-h-[5vh] overflow-scroll items-center">
          <TopUserDetails />
        </div>
        <div className="min-h-[87vh] max-h-[87vh] overflow-scroll">
          <Suspense fallback={<div />}>
            <Switch location={location}>
              {pages.map((page, index) => {
                return (
                  <Route
                    exact
                    path={page.pageLink}
                    render={() => <page.view setFooterTabs={setFooterTabs} />}
                    key={index}
                  />
                );
              })}
              <Redirect to="/" />
            </Switch>
          </Suspense>
        </div>
        <div className="min-h-[8vh] max-h-[8vh] overflow-scroll">
          {!["/home"].includes(location.pathname) && (
            <Footer tabs={footerTabs} />
          )}
        </div>
      </div>
    );
  };

  return <div>{isLoggedIn() ? renderPages() : renderLogin()}</div>;
};

export default App;
