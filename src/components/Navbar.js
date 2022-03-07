import {
  SLIDE_IN,
  SLIDE_OUT,
  SLIDE_IN_MOBILE,
  SLIDE_OUT_MOBILE,
} from "../animations";
import Expert from "./AppointmentExpert";
import SocialPost from "./SocialPost";
import SocialLink from "./SocialLink";
import React, { useState, useCallback, useRef, useEffect } from "react";
import * as Icon from "react-feather";
import { Link, useHistory } from "react-router-dom";
import { useSpring, useTransition, animated } from "react-spring";
import { useLockBodyScroll, useWindowSize } from "react-use";
import LogoPng from "../assets/logo.png";
import { getOldEvents } from "../services/challengeApi";

import SpeakerNotesIcon from "@material-ui/icons/SpeakerNotes";

import classNames from "classnames";
import { PrimaryButton } from "./Form";

function Navbar({ className }) {
  const condition = JSON.parse(localStorage.getItem("condition"));
  let history = useHistory();

  const pages =
    // (localStorage.getItem('role') &&
    //   localStorage.getItem('role') !== 'Customer')
    condition && condition.isAdmin === true
      ? [
          {
            pageLink: "/dashboard",
            displayName: "Dashboard",
            showInNavbar: true,
          },
          {
            pageLink: "/admin",
            // view: Admin,
            displayName: "Admin",
            showInNavbar: true,
          },
          {
            pageLink: "/marketplace",
            // view: MarketPlace,
            displayName: "Market Place",
            showInNavbar: true,
          },
          {
            pageLink: "/eventmanagement",
            displayName: "Event Management",
            showInNavbar: true,
          },
          {
            pageLink: "/activities",
            displayName: "Programs",
            showInNavbar: true,
          },
          {
            pageLink: "/report",
            displayName: "Reports",
            showInNavbar: true,
          },
          {
            pageLink: "/profile",
            displayName: "Profile",
            showInNavbar: true,
          },
          {
            pageLink: "/resetpin",
            displayName: "ResetPin",
            showInNavbar: true,
          },

          // {
          //   pageLink: "/source",
          //   displayName: "DataSource",
          //   showInNavbar: true,
          // },
          {
            pageLink: "/logout",
            displayName: "Logout",
            showInNavbar: true,
          },
        ]
      : condition && condition.isModerator === true
      ? [
          {
            pageLink: "/dashboard",
            displayName: "Dashboard",
            showInNavbar: true,
          },
          {
            pageLink: "/admin",
            // view: Admin,
            displayName: "Admin",
            showInNavbar: true,
          },
          {
            pageLink: "/marketplace",
            // view: MarketPlace,
            displayName: "Market Place",
            showInNavbar: true,
          },

          {
            pageLink: "/activities",
            displayName: "Programs",
            showInNavbar: true,
          },
          // {
          //   pageLink: '/report',
          //   displayName: 'Reports',
          //   showInNavbar: true,
          // },
          {
            pageLink: "/profile",
            displayName: "Profile",
            showInNavbar: true,
          },
          {
            pageLink: "/resetpin",
            displayName: "ResetPin",
            showInNavbar: true,
          },

          // {
          //   pageLink: "/source",
          //   displayName: "DataSource",
          //   showInNavbar: true,
          // },
          {
            pageLink: "/logout",
            displayName: "Logout",
            showInNavbar: true,
          },
        ]
      : [
          {
            pageLink: "/dashboard",
            displayName: "Dashboard",
            showInNavbar: true,
          },
          {
            pageLink: "/profile",
            displayName: "Profile",
            showInNavbar: true,
          },
          {
            pageLink: "/resetpin",
            displayName: "ResetPin",
            showInNavbar: true,
          },
          // {
          //   pageLink: "/source",
          //   displayName: "DataSource",
          //   showInNavbar: true,
          // },
          {
            pageLink: "/logout",
            displayName: "Logout",
            showInNavbar: true,
          },
        ];

  const [expand, setExpand] = useState(false);

  useLockBodyScroll(expand);
  const windowSize = useWindowSize();

  const [spring, set, stop] = useSpring(() => ({ opacity: 0 }));
  set({ opacity: 1 });
  stop();
  const [appointmentView, setAppointmentView] = useState(false);
  const [sociallink, setSocialLink] = useState(false);
  const [socialPost, setSocialPost] = useState(false);

  const transitions = useTransition(expand, null, {
    from: windowSize.width < 769 ? SLIDE_IN_MOBILE : SLIDE_IN,
    enter: windowSize.width < 769 ? SLIDE_OUT_MOBILE : SLIDE_OUT,
    leave: windowSize.width < 769 ? SLIDE_IN_MOBILE : SLIDE_IN,
    config: { mass: 1, tension: 210, friction: 26 },
  });

  const handleMouseEnter = useCallback(() => {
    if (windowSize.width > 769) {
      setExpand(true);
    }
  }, [windowSize.width]);

  return (
    <animated.div
      className={className ? classNames("Navbar", className) : "Navbar"}
      style={spring}
    >
      <div className="navbar-middle">
        <img src={LogoPng} />
        {/* <Link to="/" onClick={setExpand.bind(this, false)}> */}
        mHealth
        {/* </Link> */}
      </div>
      {windowSize.width < 769 && condition && condition.isCoach === true ? (
        <>
          <div>
            <PrimaryButton
              mini
              onClick={() => {
                setAppointmentView(true);
              }}
              className="mt-2"
            >
              Appointment
            </PrimaryButton>

            {appointmentView && (
              <Expert
                // type="program"
                modalView={appointmentView}
                setModalView={setAppointmentView}
                // setActivityModalView={setActivityModalView}
                // actualData={actualData}
              />
            )}
          </div>
        </>
      ) : (
        ""
      )}
      <div
        className="navbar-right"
        // style={{overflow:'scroll'}}
        onMouseEnter={handleMouseEnter}
        {...(windowSize.width < 769 && {
          onClick: setExpand.bind(this, !expand),
        })}
      >
        {windowSize.width < 769 && <span>{expand ? "Close" : "Menu"}</span>}

        {windowSize.width > 769 && (
          <React.Fragment>
            <Link to="/dashboard">
              <span>
                <Icon.Home {...activeNavIcon("/dashboard")} />
              </span>
            </Link>
            {condition && condition.isAdmin == true ? (
              <>
                <Link to="/admin">
                  <span>
                    <Icon.UserPlus {...activeNavIcon("/admin")} />
                  </span>
                </Link>
                <Link to="/marketplace">
                  <span>
                    <Icon.ShoppingCart {...activeNavIcon("/marketplace")} />
                  </span>
                </Link>
                <Link to="/eventmanagement">
                  <span>
                    <Icon.Archive {...activeNavIcon("/eventmanagement")} />
                  </span>
                </Link>
                <Link to="/activities">
                  <span>
                    <Icon.PlusSquare {...activeNavIcon("/activities")} />
                  </span>
                </Link>
                <Link to="/report">
                  <span>
                    <Icon.Book {...activeNavIcon("/report")} />
                  </span>
                </Link>
              </>
            ) : condition && condition.isModerator == true ? (
              <>
                {/* <Link to="/eventmanagement">
                      <span>
                        <Icon.Archive {...activeNavIcon('/eventmanagement')} />
                      </span>
                    </Link> */}
                <Link to="/admin">
                  <span>
                    <Icon.UserPlus {...activeNavIcon("/admin")} />
                  </span>
                </Link>
                <Link to="/marketplace">
                  <span>
                    <Icon.ShoppingCart {...activeNavIcon("/marketplace")} />
                  </span>
                </Link>
                <Link to="/activities">
                  <span>
                    <Icon.PlusSquare {...activeNavIcon("/activities")} />
                  </span>
                </Link>
                {/* <Link to="/report">
                  <span>
                    <Icon.Book {...activeNavIcon('/report')} />
                  </span>
                </Link> */}
              </>
            ) : (
              ""
            )}
            <Link
              to="/profile"
              onClick={(e) => {
                e.preventDefault();
                history.push("/profile");
              }}
            >
              <span>
                <Icon.User {...activeNavIcon("/profile")} />
              </span>
            </Link>

            <Link to="/resetpin">
              <span>
                <Icon.RefreshCcw {...activeNavIcon("/resetpin")} />
              </span>
            </Link>

            {/* <Link to="/source">
              <span>
                <Icon.Database {...activeNavIcon("/source")} />
              </span>
            </Link> */}
            <Link
              to="/logout"
              onClick={(e) => {
                e.preventDefault();
                localStorage.clear();
                history.push("/");
              }}
            >
              <span>
                <Icon.LogOut {...activeNavIcon("/logout")} />
              </span>
            </Link>

            {condition && condition.isModerator === true ? (
              <>
                <p className="mt-6">
                  <span>
                    <Icon.Navigation
                      onClick={() => setSocialPost(true)}
                      style={{ marginTop: 5 }}
                    />
                  </span>
                  {socialPost && (
                    <SocialPost
                      // type="program"
                      modalView={socialPost}
                      setModalView={setSocialPost}
                      // setActivityModalView={setActivityModalView}
                      // actualData={actualData}
                    />
                  )}
                </p>
                <p className="mt-6">
                  <span style={{}}>
                    <Icon.Link onClick={() => setSocialLink(true)} />
                  </span>
                  {sociallink && (
                    <SocialLink
                      // type="program"
                      modalView={sociallink}
                      setModalView={setSocialLink}
                      // setActivityModalView={setActivityModalView}
                      // actualData={actualData}
                    />
                  )}
                </p>
              </>
            ) : (
              ""
            )}
          </React.Fragment>
        )}
      </div>

      {transitions.map(({ item, key, props }) =>
        item ? (
          <animated.div key={key} style={props} className="h-full bg-[#f5f5f5]">
            <Expand {...{ pages, setExpand, windowSize, history }} />
          </animated.div>
        ) : (
          <animated.div key={key} style={props}></animated.div>
        )
      )}
    </animated.div>
  );
}

function Expand({ pages, setExpand, windowSize, history }) {
  const expandElement = useRef(null);
  const [appointmentView, setAppointmentView] = useState(false);
  const [sociallink, setSocialLink] = useState(false);
  const [socialPost, setSocialPost] = useState(false);
  const condition = JSON.parse(localStorage.getItem("condition"));
  const handleMouseLeave = useCallback(() => {
    windowSize.width > 768 && setExpand(false);
  }, [setExpand, windowSize.width]);

  return (
    <div className="expand" ref={expandElement} onMouseLeave={handleMouseLeave}>
      {pages.map((page, i) => {
        if (page.showInNavbar === true) {
          return (
            <Link
              to={page.pageLink}
              key={i}
              onClick={(e) => {
                if (page.displayName == "Blog" || page.displayName == "About") {
                  e.preventDefault();
                }
                if (page.displayName === "Logout") {
                  localStorage.clear();
                  history.push("/");
                }
              }}
              {...(windowSize.width < 769 && {
                onClick: setExpand.bind(this, false),
              })}
              style={{ border: "0px solid", marginTop: "4px", marginLeft: 0 }}
            >
              <span
                style={{ border: "0px solid" }}
                {...navLinkProps(page.pageLink, page.animationDelayForNavbar)}
              >
                {page.displayName}
              </span>
            </Link>
          );
        }
        return null;
      })}

      {condition && condition.isModerator === true ? (
        <>
          <div>
            <p
              style={{
                fontSize: "13px",
                marginTop: "0px",
                cursor: "pointer",
              }}
              className="socialPosttext"
              onClick={() => setSocialPost(true)}
            >
              Social Post
            </p>

            {socialPost && (
              <SocialPost
                // type="program"
                modalView={socialPost}
                setModalView={setSocialPost}
                // setActivityModalView={setActivityModalView}
                // actualData={actualData}
              />
            )}
          </div>
          <div>
            <p
              style={{
                fontSize: "13px",
                marginTop: "0px",
                cursor: "pointer",
              }}
              className="socialLinktext"
              onClick={() => setSocialLink(true)}
            >
              Social Link
            </p>

            {sociallink && (
              <SocialLink
                // type="program"
                modalView={sociallink}
                setModalView={setSocialLink}
                // setActivityModalView={setActivityModalView}
                // actualData={actualData}
              />
            )}
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default Navbar;

const navLinkProps = (path, animationDelay) => ({
  className: `${window.location.pathname === path ? "focused" : ""}`,
});

const activeNavIcon = (path) => ({
  style: {
    stroke: window.location.pathname === path ? "#4c75f2" : "",
  },
});
