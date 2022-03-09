import React, { useCallback, useEffect, useState } from "react";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import classnames from "classnames";
import Chart from "react-apexcharts";
import Message from "antd-message";
import TriStateToggle from "./toggle/TriStateToggle";
import { lighten, makeStyles, useTheme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import EventGallery from "./EventGallery";
import Navbar from "./Navbar";
import LeaderboardTable from "./LeaderBoardTable";
import ListOfEvents from "./ListOfEvents";
import UpdateDataSource from "./UpdateDataSource";
import ChallengeList from "./ChallengeList";
import ChallengeByInvite from "./ChallengeByInvite";
import PerformanceTab from "./PerformanceTab";
import CreateTeam from "./TeamForEvents/CreateOrUpdateTeam";
import { Achievments } from "./Achievments";
import SundayChallenge from "./SundayChallenge";
import { getLeaderBoardHeading } from "../utils/commonFunctions";
import {
  getLeaderBoardData,
  getChallengesByDate,
  getEventGalleryData,
  getOldEvents,
  getAchievements,
  challengeActionCall,
  getChallenges,
} from "../services/challengeApi";
import TopUserDetails from "./TopUserDetails";
import EventRegisterModal from "./EventRegisterModal";
import TargetSetting from "./TargetSetting";
import Activity from "./Dashboard/Activity/Activity";
import FullScreen from "./Utility/FullScreen";

import ChallengeStatus from "./Dashboard/ChallengeStatus";
import Badge from "@material-ui/core/Badge";
import Quiz from "./QuizForEvents/quiz";

import DefaultDashboard from "./DefaultDashboard";
import SelectBox from "./Form/Select";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import { faHome, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import EventInfoModal from "./EventInfoModal";
import Actions from "./Actions";
import { ACTION_ICONS } from "../constants/dashboardAction";
import { useHistory, useParams } from "react-router-dom";
import * as FOOTER_TABS from "../constants/footerTabs";
import {
  faComments,
  faUserFriends,
  faRunning,
  faDatabase,
  faPhotoVideo,
  faAward,
  faCalendarWeek,
  faBullseye,
  faChess,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

import "../styles/DashboardWithParam.css";

const Dashboard = (props) => {
  const [dashboardState, setDashboardState] = useState({
    listOfChallenges: [],
    leaderBoardData: {
      data: {},
      loading: true,
      message: "",
    },
    // selectedAction: getDefaultTab(),
    selectedAction: "Activities",
    selectedChallenge: "",
    selectedChallengeObject: {},
    selectedChallengeArray: [],
    compareData: { data: [], categories: [] },
    performanceData: {
      name: "",
      data: [],
      categories: [],
    },
    performanceTableData: {
      data: [],
      loading: true,
      message: "",
    },
    barToggle: false,
    eventGalleryData: {
      data: [],
      loading: true,
      message: "",
    },
    challengeSwitch: "current",
    allChallenge: [],
    instruction_details: undefined,
    isProgramAvailable: false,
    searchedEvent: [],
  });
  const [challengeStatusMsg, setChallengeStatusMsg] = useState("");
  const [displayChallengeStatus, setDisplayChallengeStatus] = useState(false);
  const [pendingInviteCount, setPendingCount] = useState(null);
  const [reloadChallengeAccepted, setReloadChallengeAccepted] = useState(false);
  const [eventId, seteventId] = useState([]);
  const [distancelogo, setdistancelogo] = useState({});
  const [showRegisterModal, setShowRegisterModal] = useState(
    localStorage.challengeIDRegister ? true : false
  );
  const [showDefaultView, setDefaultView] = useState(false);
  localStorage.setItem("selectTab", dashboardState.selectedAction);
  const { id } = useParams();
  const history = useHistory();

  // useEffect(() => {
  //   if (Array.isA(dashboardState.listOfChallenges) && dashboardState.listOfChallenges.length > 0) {
  //     const selected = dashboardState.listOfChallenges.find(d => parseInt(d.id) === parseInt(localStorage.selectEvent))

  //     setDashboardState({
  //       ...dashboardState,
  //       selectedChallengeObject: selected
  //     })
  //   }
  // }, [dashboardState.listOfChallenges])

  useEffect(() => {
    // Fetching challenges
    const { setFooterTabs } = props;

    if (id === "walkathon") {
      switch (dashboardState.selectedAction) {
        case "Leaderboard":
        case "Performance":
        case "Target":
        case "challenge":
        case "achievement":
        case "Challenge":
        case "team":
        case "Source":
          const WALKATHON_TABS = [
            {
              key: "home",
              title: "Home",
              onClick: () => {
                setDashboardState((prevState) => {
                  return {
                    ...prevState,
                    selectedAction: "Activities",
                    selectedChallengeArray: [],
                    compareData: { data: [], categories: [] },
                    listOfChallenges: getCurrentAllEvents(),
                  };
                });
              },
              icon: faHome,
              selected: false,
            },
            {
              key: "leaderboard",
              title: "Leaderboard",
              onClick: () => {
                setDashboardState((prevState) => {
                  return {
                    ...prevState,
                    selectedAction: "Leaderboard",
                    selectedChallengeArray: [],
                    compareData: { data: [], categories: [] },
                    listOfChallenges: getCurrentAllEvents(),
                  };
                });
              },
              icon: faTrophy,
              selected: dashboardState.selectedAction === "Leaderboard",
            },
            {
              key: "daily_score",
              title: "Daily Score",
              onClick: () => {
                handlePerformanceClick();
              },
              icon: faChess,
              selected: dashboardState.selectedAction === "Performance",
            },
            {
              key: "set_target",
              title: "Set Target",
              onClick: () => {
                setDashboardState((prevState) => {
                  return {
                    ...prevState,
                    selectedAction: "Target",
                    listOfChallenges: getCurrentAllEvents(),
                  };
                });
              },
              icon: faBullseye,
              selected: dashboardState.selectedAction === "Target",
            },
            {
              key: "sunday_challenge",
              title: "Sunday Challenge",
              onClick: () => {
                setDashboardState((prevState) => {
                  return {
                    ...prevState,
                    selectedAction: "challenge",
                    listOfChallenges: getCurrentAllEvents(),
                  };
                });
              },
              icon: faCalendarWeek,
              selected: dashboardState.selectedAction === "challenge",
            },
            {
              key: "achievement",
              title: "Achievement",
              onClick: () => {
                setDashboardState((prevState) => {
                  return {
                    ...prevState,
                    selectedAction: "achievement",
                    listOfChallenges: getCurrentAllEvents(),
                  };
                });
              },
              icon: faAward,
              selected: dashboardState.selectedAction === "achievement",
            },
            {
              key: "invite",
              title: "Invite",
              onClick: () => {
                setDashboardState((prevState) => {
                  return {
                    ...prevState,
                    selectedAction: "Challenge",
                    listOfChallenges: getCurrentAllEvents(),
                  };
                });
              },
              icon: faRunning,
              selected: dashboardState.selectedAction === "Challenge",
            },
            {
              key: "team",
              title: "Team",
              onClick: () => {
                setDashboardState((prevState) => {
                  return {
                    ...prevState,
                    selectedAction: "team",
                    listOfChallenges: getCurrentAllEvents(),
                  };
                });
              },
              icon: faUserFriends,
              selected: dashboardState.selectedAction === "team",
            },
            {
              key: "data_source",
              title: "Source",
              onClick: () => {
                setDashboardState((prevState) => {
                  return {
                    ...prevState,
                    selectedAction: "Source",
                    listOfChallenges: getCurrentAllEvents(),
                  };
                });
              },
              icon: faUserFriends,
              selected: dashboardState.selectedAction === "Source",
            },
          ];
          setFooterTabs(WALKATHON_TABS);
          return;
        default:
          setFooterTabs(FOOTER_TABS.PROGRAMS);
          setDashboardState((prevState) => {
            return {
              ...prevState,
              selectedAction: "Activities",
              selectedChallengeArray: [],
              compareData: { data: [], categories: [] },
              listOfChallenges: getCurrentAllEvents(),
            };
          });
      }
    } else if (id === "settings") {
      switch (dashboardState.selectedAction) {
        case "Source":
          const SETTINGS_TABS = [
            {
              key: "home",
              title: "Home",
              onClick: () => {
                setDashboardState((prevState) => {
                  return {
                    ...prevState,
                    selectedAction: "Activities",
                    selectedChallengeArray: [],
                    compareData: { data: [], categories: [] },
                    listOfChallenges: getCurrentAllEvents(),
                  };
                });
              },
              icon: faHome,
              selected: false,
            },
            {
              key: "data_source",
              title: "Source",
              onClick: () => {
                setDashboardState((prevState) => {
                  return {
                    ...prevState,
                    selectedAction: "Source",
                    selectedChallengeArray: [],
                    compareData: { data: [], categories: [] },
                    listOfChallenges: getCurrentAllEvents(),
                  };
                });
              },
              icon: faDatabase,
              selected: dashboardState.selectedAction === "Source",
            },
          ];
          setFooterTabs(SETTINGS_TABS);
          return;
        default:
          setFooterTabs(FOOTER_TABS.PROGRAMS);
          setDashboardState((prevState) => {
            return {
              ...prevState,
              selectedAction: "Activities",
              selectedChallengeArray: [],
              compareData: { data: [], categories: [] },
              listOfChallenges: getCurrentAllEvents(),
            };
          });
      }
    } else {
      switch (id) {
        case "quiz":
          setDashboardState((prevState) => {
            return {
              ...prevState,
              selectedAction: "quiz",
              listOfChallenges: getCurrentAllEvents(),
            };
          });
          const QUIZ_TABS = [
            {
              key: "home",
              title: "Home",
              onClick: () => {
                setDashboardState((prevState) => {
                  return {
                    ...prevState,
                    selectedAction: "Activities",
                    selectedChallengeArray: [],
                    compareData: { data: [], categories: [] },
                    listOfChallenges: getCurrentAllEvents(),
                  };
                });
                window.location.replace("/#/program/walkathon");
              },
              icon: faHome,
              selected: false,
            },
            {
              key: "quiz",
              title: "Quiz",
              onClick: () => {
                setDashboardState((prevState) => {
                  return {
                    ...prevState,
                    selectedAction: "quiz",
                    listOfChallenges: getCurrentAllEvents(),
                  };
                });
              },
              icon: faComments,
              selected: dashboardState.selectedAction === "quiz",
            },
          ];
          setFooterTabs(QUIZ_TABS);
          return;
        case "gallery":
          setDashboardState((prevState) => {
            return {
              ...prevState,
              selectedAction: "Gallery",
              listOfChallenges: getCurrentAllEvents(),
            };
          });
          const GALLERY_TABS = [
            {
              key: "home",
              title: "Home",
              onClick: () => {
                setDashboardState((prevState) => {
                  return {
                    ...prevState,
                    selectedAction: "Activities",
                    selectedChallengeArray: [],
                    compareData: { data: [], categories: [] },
                    listOfChallenges: getCurrentAllEvents(),
                  };
                });
                window.location.replace("/#/program/walkathon");
              },
              icon: faHome,
              selected: false,
            },
            {
              key: "gallery",
              title: "Gallery",
              onClick: () => {
                setDashboardState((prevState) => {
                  return {
                    ...prevState,
                    selectedAction: "Gallery",
                    listOfChallenges: getCurrentAllEvents(),
                  };
                });
              },
              icon: faPhotoVideo,
              selected: dashboardState.selectedAction === "Gallery",
            },
          ];
          setFooterTabs(GALLERY_TABS);
          return;
        case "report":
          setFooterTabs(FOOTER_TABS.REPORT);
          return;
      }
    }
  }, [id, dashboardState.selectedAction]);

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    // Fetch challenge/event based on code
    if (localStorage.cid && localStorage.time && localStorage.status) {
      const action = window.atob(localStorage.status);
      const challengeId = window.atob(localStorage.cid);
      challengeActionCall(action, challengeId)
        .then((res) => {
          setChallengeStatusMsg(res.data.response.responseMessage);
          setDisplayChallengeStatus(true);
        })
        .catch(() => {
          setChallengeStatusMsg("Something went wrong!");
          setDisplayChallengeStatus(true);
        });

      localStorage.removeItem("cid");
      localStorage.removeItem("time");
      localStorage.removeItem("status");
    }
  }, []);

  useEffect(() => {
    if (dashboardState.selectedChallenge) {
      localStorage.setItem("selectEvent", dashboardState.selectedChallenge);
      getChallenges("Receiver", dashboardState.selectedChallenge)
        .then((res) => {
          if (res.status === 200 && res.data.response.responseCode === 0) {
            setPendingCount(
              res.data.response.responseData.Receiver.filter(
                (rqs) => rqs.challengeStatus.toUpperCase() === "PENDING"
              ).length
            );
          } else {
            setPendingCount(null);
          }
        })
        .catch((err) => {
          setPendingCount(null);
        });
    } else {
      setPendingCount(null);
    }
  }, [dashboardState.selectedChallenge, reloadChallengeAccepted]);

  useEffect(() => {
    if (dashboardState.listOfChallenges.length > 0 && !showDefaultView) {
      const isAnyEventSubscribed = dashboardState.listOfChallenges.filter(
        (e) => e.isSubscribed == true
      ).length;
      setDefaultView(isAnyEventSubscribed === 0);
      localStorage.setItem("showDefaultView", isAnyEventSubscribed === 0);
    }
  }, [dashboardState.listOfChallenges]);

  const fetchChallenges = (eventTypeSwitch) => {
    setDashboardState((prevState) => {
      return {
        ...prevState,
        listOfChallenges: [],
        leaderBoardData: {
          data: { rankWiseBoard: [] },
          loading: true,
          message: "",
        },
        // selectedAction: !eventTypeSwitch
        //   ? getDefaultTab()
        //   : prevState.selectedAction,
        selectedAction: prevState.selectedAction,
        selectedChallenge: "",
        selectedChallengeObject: {},
        selectedChallengeArray: [],
        compareData: { data: [], categories: [] },
        performanceData: {
          name: "",
          data: [],
          categories: [],
        },
        performanceTableData: {
          data: [],
          loading: true,
          message: "",
        },
        barToggle: false,
        eventGalleryData: {
          data: [],
          loading: true,
          message: "",
        },
        challengeSwitch: "current",
        allChallenge: [],
      };
    });
    window.message = Message;

    getAchievements().then((res) => {
      setdistancelogo(res.data.response.responseData?.achievementIcons);
    });

    getOldEvents().then((res) => {
      if (res.data.response.responseMessage === "SUCCESS") {
        let event = [];
        event = res.data.response.responseData?.linkedEvents;
        seteventId(res.data.response.responseData?.linkedEvents);
        let selectedEventFromMainPage =
          res.data.response.responseData?.events?.filter(
            (item) => item.id == localStorage.challengeIDRegister
          )[0];
        let allChallengeData = res.data.response.responseData?.events?.filter(
          (item) => {
            if (
              !eventTypeSwitch &&
              selectedEventFromMainPage &&
              selectedEventFromMainPage["timePeriod"] == "FUTURE"
            ) {
              return item.isActive == 1 &&
                item.timePeriod === "FUTURE" &&
                item.isParticipated
                ? true
                : event !== null
                ? (item.eventView !== "LINKED" &&
                    item.eventView !== "PRIVATE") ||
                  (event.includes(item.id) && item.timePeriod === "FUTURE") ||
                  (event.includes(item.id) && item.timePeriod === "CURRENT")
                : item.eventView !== "PRIVATE" &&
                  item.eventView !== "LINKED" &&
                  item.timePeriod === "FUTURE";
            } else {
              //
              return item.isActive == 1 &&
                item.timePeriod !== "FUTURE" &&
                item.isParticipated
                ? true
                : event !== null
                ? (item.eventView !== "LINKED" &&
                    item.eventView !== "PRIVATE") ||
                  (event.includes(item.id) && item.timePeriod === "FUTURE") ||
                  (event.includes(item.id) && item.timePeriod === "CURRENT")
                : item.eventView !== "PRIVATE" &&
                  item.eventView !== "LINKED" &&
                  item.timePeriod !== "FUTURE";
            }
          }
        );

        setDashboardState((prevState) => {
          return {
            ...prevState,
            allChallenge: res.data.response.responseData.events,
            challengeSwitch:
              !eventTypeSwitch && selectedEventFromMainPage
                ? selectedEventFromMainPage["timePeriod"] == "CURRENT"
                  ? "current"
                  : "upcoming"
                : "current",
            selectedChallenge:
              !eventTypeSwitch && localStorage.challengeIDRegister
                ? localStorage.challengeIDRegister
                : allChallengeData[0]
                ? allChallengeData[0]["id"]
                : "",
            selectedChallengeObject:
              !eventTypeSwitch && localStorage.challengeIDRegister
                ? selectedEventFromMainPage
                : allChallengeData[0]
                ? allChallengeData[0]
                : {},
            listOfChallenges: allChallengeData,
            instruction_details:
              res?.data?.response?.responseData?.instruction_details,
          };
        });

        if (allChallengeData.length > 0 && allChallengeData[0]) {
          getLeaderBoardData(
            localStorage.challengeIDRegister && !eventTypeSwitch
              ? localStorage.challengeIDRegister
              : allChallengeData[0]["id"]
          )
            .then((res) => {
              if (
                res.data &&
                res.data.response &&
                res.data.response.responseMessage === "SUCCESS"
              ) {
                let data =
                  res.data.response.responseData.challengerWiseLeaderBoard;
                if (data && data[0]) {
                  setDashboardState((prevState) => {
                    return {
                      ...prevState,
                      leaderBoardData: {
                        data: data[0],
                        loading: false,
                        message: res.data.response.responseMessage,
                      },
                    };
                  });
                }
              } else {
                setDashboardState((prevState) => {
                  return {
                    ...prevState,
                    leaderBoardData: {
                      data: { rankWiseBoard: [] },
                      loading: false,
                      message:
                        res.data &&
                        res.data.response &&
                        res.data.response.responseMessage
                          ? res.data.response.responseMessage
                          : "No Data",
                    },
                  };
                });
              }
            })
            .catch((err) => {
              setDashboardState((prevState) => {
                return {
                  ...prevState,
                  leaderBoardData: {
                    data: { rankWiseBoard: [] },
                    loading: false,
                    message:
                      res.data &&
                      res.data.response &&
                      res.data.response.responseMessage
                        ? res.data.response.responseMessage
                        : "No Data",
                  },
                };
              });
            });
          getEventGalleryData(
            !eventTypeSwitch && localStorage.challengeIDRegister
              ? localStorage.challengeIDRegister
              : allChallengeData[0]["id"]
          ).then((galleryResponse) => {
            if (galleryResponse.data.response.responseMessage === "SUCCESS") {
              setDashboardState((prevState) => {
                return {
                  ...prevState,
                  eventGalleryData: {
                    data: galleryResponse.data.response.responseData,
                    loading: false,
                    message: galleryResponse.data.response.responseMessage,
                  },
                };
              });
            } else {
              setDashboardState((prevState) => {
                return {
                  ...prevState,
                  eventGalleryData: {
                    data: [],
                    loading: false,
                    message: galleryResponse.data.response.responseMessage,
                  },
                };
              });
            }
          });
        } else {
          setDashboardState((prevState) => {
            return {
              ...prevState,
              eventGalleryData: {
                data: [],
                loading: false,
                message: "No Data",
              },
              listOfChallenges: [],
              leaderBoardData: {
                data: { rankWiseBoard: [] },
                loading: false,
                message: "No Data",
              },
            };
          });
        }
      }
    });
  };

  const fetchEventGallery = () => {
    setDashboardState((prevState) => {
      return {
        ...prevState,
        eventGalleryData: {
          data: [],
          loading: true,
          message: "",
        },
      };
    });
    getEventGalleryData(dashboardState.selectedChallenge).then(
      (galleryResponse) => {
        if (galleryResponse.data.response.responseMessage === "SUCCESS") {
          setDashboardState((prevState) => {
            return {
              ...prevState,
              eventGalleryData: {
                data: galleryResponse.data.response.responseData,
                loading: false,
                message: galleryResponse.data.response.responseMessage,
              },
            };
          });
        } else {
          setDashboardState((prevState) => {
            return {
              ...prevState,
              eventGalleryData: {
                data: [],
                loading: false,
                message: galleryResponse.data.response.responseMessage,
              },
            };
          });
        }
      }
    );
  };

  const displayChart = () => {
    let linechartOptions = {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        type: "datetime",
        categories:
          dashboardState.selectedAction === "Performance"
            ? dashboardState.performanceData["categories"]
              ? dashboardState.performanceData["categories"]
              : []
            : dashboardState.compareData["categories"]
            ? dashboardState.compareData["categories"]
            : [],
      },
      toolbar: {
        show: false,
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
          customIcons: [],
        },
      },
      tooltip: {
        x: {
          format: "dd/MM/yy",
        },
      },
    };
    let barChartOptions = {
      chart: {
        height: 350,
        type: "bar",
      },
      toolbar: {
        show: false,
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
          customIcons: [],
        },
      },
      xaxis: {
        type: "datetime",
        categories:
          dashboardState.selectedAction === "Performance"
            ? dashboardState.performanceData["categories"]
              ? dashboardState.performanceData["categories"]
              : []
            : dashboardState.compareData["categories"]
            ? dashboardState.compareData["categories"]
            : [],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy",
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "25%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
      },

      fill: {
        opacity: 1,
      },
    };
    let lineState = {
      series:
        dashboardState.selectedAction === "Compare"
          ? dashboardState.compareData.data
            ? dashboardState.compareData.data
            : []
          : [
              {
                name: dashboardState.performanceData.name,
                data: dashboardState.performanceData.data
                  ? dashboardState.performanceData.data
                  : [],
              },
            ],
    };

    return (
      <div id="chart" className="performance-chart-container">
        <Chart
          options={barChartOptions}
          series={lineState.series}
          type={"bar"}
          height={350}
          style={{
            boxShadow:
              "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
            borderRadius: 12,
          }}
          className="performance-charts"
        />
        <Chart
          options={linechartOptions}
          series={lineState.series}
          type="line"
          height={350}
          style={{
            boxShadow:
              "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
            borderRadius: 12,
          }}
          className="performance-charts"
        />
      </div>
    );
  };

  const fetchCompareAndPerformaceData = (type, compareIds) => {
    if (type == "Performance") {
      getChallengesByDate(compareIds).then((res) => {
        let performanceData = {
          name: "",
          data: [],
          categories: [],
        };
        let performanceTableData = {
          data: [],
          loading: false,
          message: res.data.response.responseMessage,
        };
        if (
          res.data.response &&
          res.data.response.responseMessage === "SUCCESS" &&
          res.data.response.responseData
        ) {
          let responseData = res?.data?.response?.responseData;
          if (
            responseData.challengerWiseLeaderBoard &&
            responseData.challengerWiseLeaderBoard.length > 0
          ) {
            let respDateWiseBoard =
              responseData.challengerWiseLeaderBoard[0].dateWiseBoard &&
              responseData.challengerWiseLeaderBoard[0].dateWiseBoard.length > 0
                ? responseData.challengerWiseLeaderBoard[0].dateWiseBoard.sort(
                    function (a, b) {
                      return (
                        new Date(b.valueTillDate) - new Date(a.valueTillDate)
                      );
                    }
                  )
                : [];

            performanceData["name"] =
              responseData.challengerWiseLeaderBoard[0]["challengerZoneName"];
            performanceData["data"] = respDateWiseBoard.map(
              (item) => item.value
            );
            performanceData["categories"] = respDateWiseBoard.map(
              (item) => item.valueTillDate
            );
            performanceTableData = {
              loading: false,
              data: respDateWiseBoard.map((item, index) => {
                return {
                  ...item,
                  index: index,
                };
              }),
              message: res.data.response.responseMessage,
            };
          }
        }
        setDashboardState((prevState) => {
          return {
            ...prevState,
            selectedChallengeArray: [],
            performanceData: performanceData,
            performanceTableData: performanceTableData,
          };
        });
      });
    } else {
      if (compareIds.length > 0) {
        getChallengesByDate(compareIds).then((res) => {
          let respp = res.data.response;
          if (respp && respp.responseMessage === "SUCCESS") {
            let compareData = { data: [], categories: [] };
            let compareDataEntries = [];
            let compareCategories = [];
            if (respp.responseData) {
              let responseData = respp.responseData;
              if (
                responseData["challengerWiseLeaderBoard"] &&
                responseData["challengerWiseLeaderBoard"].length > 0
              ) {
                responseData["challengerWiseLeaderBoard"].map((item) => {
                  let data = [];
                  if (item.dateWiseBoard && item.dateWiseBoard.length > 0) {
                    item.dateWiseBoard
                      .sort(function (a, b) {
                        return (
                          new Date(b.valueTillDate) - new Date(a.valueTillDate)
                        );
                      })
                      .map((el) => {
                        data.push(el.value);
                        compareCategories.push(el.valueTillDate);
                      });
                  }
                  let name = item["challengerZoneName"];
                  compareDataEntries.push({
                    name: name,
                    data: data,
                  });
                });
              }
            }
            compareData["data"] = compareDataEntries;
            compareData["categories"] = [...new Set(compareCategories)];
            setDashboardState((prevState) => {
              return {
                ...prevState,
                compareData: compareData,
              };
            });
          }
        });
      }
    }
  };

  const handlePerformanceClick = () => {
    window.message = Message;
    setDashboardState((prevState) => {
      return {
        ...prevState,
        selectedAction: "Performance",
        selectedChallengeArray: [],
        compareData: { data: [], categories: [] },
        performanceData: {
          name: "",
          data: [],
          categories: [],
        },
        performanceTableData: {
          data: [],
          loading: true,
          message: "",
        },
        listOfChallenges: getCurrentAllEvents(),
      };
    });
    fetchCompareAndPerformaceData(
      "Performance",
      dashboardState.selectedChallenge
    );
  };

  const handleToggleStateChange = (value) => {
    setDashboardState((prevState) => {
      return {
        ...prevState,
        challengeSwitch: value,
        listOfChallenges: [],
        leaderBoardData: {
          data: { rankWiseBoard: [] },
          loading: true,
          message: "",
        },
        eventGalleryData: {
          data: [],
          loading: true,
          message: "",
        },
        compareData: { data: [], categories: [] },
        performanceData: {
          name: "",
          data: [],
          categories: [],
        },
        performanceTableData: {
          data: [],
          loading: true,
          message: "",
        },
        // selectedAction: value === "upcoming" ? "Leaderboard" : getDefaultTab(),
        selectedAction: "Activities",
        selectedChallengeObject: {},
      };
    });
    if (value === "current") {
      fetchChallenges(true);
    } else if (value === "old" || value === "upcoming") {
      getOldEvents().then((res) => {
        if (res.data.response.responseMessage === "SUCCESS") {
          let allChallengeData = res.data.response.responseData.events.filter(
            (item) => {
              return value === "old"
                ? item.isActive == 0 && item.isParticipated
                : item.isActive == 1 &&
                  item.timePeriod === "FUTURE" &&
                  item.isParticipated
                ? true
                : eventId !== null
                ? (item.eventView !== "LINKED" &&
                    item.eventView !== "PRIVATE") ||
                  (eventId.includes(item.id) && item.timePeriod === "FUTURE") ||
                  (eventId.includes(item.id) && item.timePeriod === "CURRENT")
                : item.eventView !== "PRIVATE" &&
                  item.eventView !== "LINKED" &&
                  item.timePeriod === "FUTURE";
            }
          );

          setDashboardState((prevState) => {
            return {
              ...prevState,
              listOfChallenges: allChallengeData,
            };
          });

          if (allChallengeData.length > 0 && allChallengeData[0]) {
            getLeaderBoardData(allChallengeData[0]["id"]).then((res) => {
              if (res.data.response.responseMessage === "SUCCESS") {
                let data =
                  res.data.response.responseData.challengerWiseLeaderBoard;
                if (data && data[0]) {
                  setDashboardState((prevState) => {
                    return {
                      ...prevState,
                      leaderBoardData: {
                        data: data[0],
                        loading: false,
                        message: res.data.response.responseMessage,
                      },
                      selectedChallenge: allChallengeData[0]["id"],
                      selectedChallengeObject: allChallengeData[0],
                    };
                  });
                }
              } else {
                setDashboardState((prevState) => {
                  return {
                    ...prevState,
                    leaderBoardData: {
                      data: { rankWiseBoard: [] },
                      loading: false,
                      message: res.data.response.responseMessage,
                    },
                    selectedChallenge: allChallengeData[0]["id"],
                    selectedChallengeObject: allChallengeData[0],
                  };
                });
              }
            });
            getEventGalleryData(allChallengeData[0]["id"]).then(
              (galleryResponse) => {
                const status = galleryResponse.data.response.responseMessage;

                setDashboardState((prevState) => {
                  return {
                    ...prevState,
                    eventGalleryData: {
                      data:
                        status === "SUCCESS"
                          ? galleryResponse.data.response.responseData
                          : [],
                      loading: false,
                      message: galleryResponse.data.response.responseMessage,
                    },
                  };
                });
              }
            );
          } else {
            setDashboardState((prevState) => {
              return {
                ...prevState,
                leaderBoardData: {
                  data: {
                    rankWiseBoard: [],
                  },
                  loading: false,
                  message: "Data Not Found",
                },
                eventGalleryData: {
                  data: [],
                  loading: false,
                  message: "Data Not Found",
                },
              };
            });
          }
        }
      });
    }
  };

  const getCurrentAllEvents = () => {
    let allChallengeData = dashboardState.allChallenge.filter((item) => {
      if (dashboardState.challengeSwitch == "current") {
        return item.isActive == 1 &&
          item.timePeriod !== "FUTURE" &&
          item.isParticipated
          ? true
          : eventId !== null
          ? (item.eventView !== "LINKED" && item.eventView !== "PRIVATE") ||
            (eventId.includes(item.id) && item.timePeriod === "FUTURE") ||
            (eventId.includes(item.id) && item.timePeriod === "CURRENT")
          : item.eventView !== "PRIVATE" &&
            item.eventView !== "LINKED" &&
            item.timePeriod !== "FUTURE";
      } else {
        return dashboardState.challengeSwitch === "old"
          ? item.isActive == 0 && item.isParticipated
          : item.isActive == 1 &&
            item.timePeriod === "FUTURE" &&
            item.isParticipated
          ? true
          : eventId !== null
          ? (item.eventView !== "LINKED" && item.eventView !== "PRIVATE") ||
            (eventId.includes(item.id) && item.timePeriod === "FUTURE") ||
            (eventId.includes(item.id) && item.timePeriod === "CURRENT")
          : item.eventView !== "PRIVATE" &&
            item.eventView !== "LINKED" &&
            item.timePeriod === "FUTURE";
      }
    });

    return allChallengeData;
  };

  const handleCompare = (updatedSelectedChallengeIds) => {
    fetchCompareAndPerformaceData("Compare", updatedSelectedChallengeIds);
  };

  const handleChallengeCardClick = async (eventObj) => {
    window.message = Message;

    let updatedObj = {
      ...dashboardState,
      moderatorDetails: {
        moderatorName: eventObj["moderatorName"]
          ? eventObj["moderatorName"]
          : "",
        moderatorMobileNumber: eventObj["moderatorMobileNumber"]
          ? eventObj["moderatorMobileNumber"]
          : "",
      },
    };
    if (dashboardState.selectedAction !== "Compare") {
      updatedObj["selectedChallengeObject"] =
        dashboardState.listOfChallenges.filter(
          (val) => val.id === eventObj.id
        )[0];
    }
    let existingChallendIds = [...dashboardState.selectedChallengeArray];
    let updatedSelectedChallenges = existingChallendIds.includes(eventObj.id)
      ? existingChallendIds.filter((item) => item != eventObj.id)
      : [
          ...existingChallendIds.filter((item) => item != eventObj.id),
          eventObj.id,
        ];
    if (dashboardState.selectedAction === "Compare") {
      updatedObj["selectedChallengeArray"] = updatedSelectedChallenges;
    } else {
      updatedObj["selectedChallenge"] = eventObj.id;
    }

    if (
      dashboardState.selectedAction === "Leaderboard" ||
      dashboardState.selectedAction === "Gallery" ||
      dashboardState.selectedAction === "Source" ||
      dashboardState.selectedAction === "Target" ||
      dashboardState.selectedAction === "Activities" ||
      dashboardState.selectedAction === "Challenge" ||
      dashboardState.selectedAction === "team" ||
      dashboardState.selectedAction === "achievement" ||
      dashboardState.selectedAction === "challenge" ||
      dashboardState.selectedAction === "quiz"
    ) {
      setDashboardState({
        ...updatedObj,
        eventGalleryData: { data: [], loading: true, message: "" },
        leaderBoardData: {
          data: { rankWiseBoard: [] },
          loading: true,
          message: "",
        },
      });
      await getLeaderBoardData(eventObj.id)
        .then((res) => {
          if (res.data.response.responseMessage === "SUCCESS") {
            let data = res.data.response.responseData.challengerWiseLeaderBoard;
            setDashboardState((prevState) => {
              return {
                ...prevState,
                leaderBoardData: {
                  data: data[0],
                  loading: false,
                  message: res.data.response.responseMessage,
                },
              };
            });
          } else {
            setDashboardState((prevState) => {
              return {
                ...prevState,
                leaderBoardData: {
                  data: { rankWiseBoard: [] },
                  loading: false,
                  message: res.data.response.responseMessage,
                },
              };
            });
          }
        })
        .catch((err) => {
          setDashboardState((prevState) => {
            return {
              ...prevState,
              leaderBoardData: {
                data: { rankWiseBoard: [] },
                loading: false,
                message: "No Data",
              },
            };
          });
        });
      await getEventGalleryData(eventObj.id).then((galleryResponse) => {
        if (galleryResponse.data.response.responseMessage === "SUCCESS") {
          setDashboardState((prevState) => {
            return {
              ...prevState,
              eventGalleryData: {
                data: galleryResponse.data.response.responseData,
                loading: false,
                message: galleryResponse.data.response.responseMessage,
              },
            };
          });
        } else {
          setDashboardState((prevState) => {
            return {
              ...prevState,
              eventGalleryData: {
                data: [],
                loading: false,
                message: galleryResponse.data.response.responseMessage,
              },
            };
          });
        }
      });
    } else if (dashboardState.selectedAction === "Performance") {
      updatedObj["performanceData"] = {
        name: "",
        data: [],
        categories: [],
      };
      updatedObj["performanceTableData"] = {
        data: [],
        loading: true,
        message: "",
      };
      setDashboardState(updatedObj);
      fetchCompareAndPerformaceData("Performance", eventObj.id);
    } else if (dashboardState.selectedAction === "Compare") {
      updatedObj["compareData"] = { data: [], categories: [] };
      setDashboardState(updatedObj);
      if (updatedSelectedChallenges && updatedSelectedChallenges.length > 0) {
        fetchCompareAndPerformaceData("Compare", updatedSelectedChallenges);
      } else {
        setDashboardState({
          ...updatedObj,
          compareData: { data: [], categories: [] },
        });
      }
    }
  };

  const renderViewByActionType = (state) => {
    switch (state.selectedAction) {
      case "Leaderboard":
        return (
          <LeaderboardTable
            leaderBoardData={dashboardState.leaderBoardData}
            currentEvent={dashboardState.selectedChallengeObject}
            challengeSwitch={dashboardState.challengeSwitch}
          />
        );
      case "Gallery":
        return (
          <EventGallery
            eventGalleryData={dashboardState.eventGalleryData}
            fetchEventGallery={fetchEventGallery}
          />
        );
      case "Compare":
        return displayChart();
      case "Challenge":
        return (
          <ChallengeByInvite
            eventId={dashboardState.selectedChallenge}
            {...{ reloadChallengeAccepted, setReloadChallengeAccepted }}
          />
        );
      case "team":
        return <CreateTeam eventId={dashboardState.selectedChallenge} />;
      case "achievement":
        return (
          <Achievments
            eventId={dashboardState.selectedChallenge}
            logos={distancelogo}
          />
        );
      case "challenge":
        return <SundayChallenge eventId={dashboardState.selectedChallenge} />;
      case "Performance":
        //daily scroe
        return (
          <PerformanceTab
            data={dashboardState.performanceTableData}
            eventId={dashboardState.selectedChallenge}
            handlePerformanceClick={handlePerformanceClick}
            challengeSwitch={dashboardState.challengeSwitch}
          />
        );
      case "quiz":
        return (
          <Quiz
            eventId={dashboardState.selectedChallenge}
            challengeSwitch={dashboardState.listOfChallenges}
          />
        );
      case "Target":
        return <TargetSetting dashboardState={dashboardState} />;
      case "Source":
        return <UpdateDataSource dashboardState={dashboardState} />;
    }
  };

  const renderActionsByType = (id) => {
    return (
      <div className="gridCenter">
        <div className="dashboardActionContainer">
          <ActionCard
            isProgramAvailable={dashboardState.isProgramAvailable}
            name="leaderboard"
            display={id === "walkathon"}
            onClick={() =>
              setDashboardState((prevState) => {
                return {
                  ...prevState,
                  selectedAction: "Leaderboard",
                  selectedChallengeArray: [],
                  compareData: { data: [], categories: [] },
                  listOfChallenges: getCurrentAllEvents(),
                };
              })
            }
          />

          <ActionCard
            isProgramAvailable={dashboardState.isProgramAvailable}
            name="daily_score"
            display={
              dashboardState.challengeSwitch !== "upcoming" &&
              dashboardState.listOfChallenges.length > 0 &&
              id === "walkathon"
            }
            onClick={() => handlePerformanceClick()}
          />

          <ActionCard
            isProgramAvailable={dashboardState.isProgramAvailable}
            name="set_target"
            display={
              dashboardState.challengeSwitch !== "upcoming" &&
              dashboardState.listOfChallenges.length > 0 &&
              id === "walkathon"
            }
            onClick={() => {
              setDashboardState((prevState) => {
                return {
                  ...prevState,
                  selectedAction: "Target",
                  listOfChallenges: getCurrentAllEvents(),
                };
              });
            }}
          />

          <ActionCard
            isProgramAvailable={dashboardState.isProgramAvailable}
            name="sunday_challenge"
            display={
              dashboardState.challengeSwitch !== "upcoming" &&
              dashboardState.listOfChallenges.length > 0 &&
              id === "walkathon"
            }
            onClick={() => {
              setDashboardState((prevState) => {
                return {
                  ...prevState,
                  selectedAction: "challenge",
                  listOfChallenges: getCurrentAllEvents(),
                };
              });
            }}
          />

          <ActionCard
            isProgramAvailable={dashboardState.isProgramAvailable}
            name="achievement"
            display={
              dashboardState.challengeSwitch !== "upcoming" &&
              dashboardState.listOfChallenges.length > 0 &&
              id === "walkathon"
            }
            onClick={() => {
              setDashboardState((prevState) => {
                return {
                  ...prevState,
                  selectedAction: "achievement",
                  listOfChallenges: getCurrentAllEvents(),
                };
              });
            }}
          />

          <ActionCard
            isProgramAvailable={dashboardState.isProgramAvailable}
            name="invite"
            display={
              dashboardState.listOfChallenges.length > 0 && id === "walkathon"
            }
            onClick={() => {
              setDashboardState((prevState) => {
                return {
                  ...prevState,
                  selectedAction: "Challenge",
                  listOfChallenges: getCurrentAllEvents(),
                };
              });
            }}
          />

          <ActionCard
            isProgramAvailable={dashboardState.isProgramAvailable}
            name="team"
            display={
              dashboardState.challengeSwitch !== "upcoming" &&
              dashboardState.listOfChallenges.length > 0 &&
              id === "walkathon"
            }
            onClick={() => {
              setDashboardState((prevState) => {
                return {
                  ...prevState,
                  selectedAction: "team",
                  listOfChallenges: getCurrentAllEvents(),
                };
              });
            }}
          />

          <ActionCard
            isProgramAvailable={dashboardState.isProgramAvailable}
            name="compare"
            display={dashboardState.challengeSwitch !== "upcoming" && false}
            onClick={() =>
              setDashboardState((prevState) => {
                let comparableEvents = dashboardState.allChallenge
                  ? dashboardState.allChallenge.filter(
                      (item) => item.isParticipated
                    )
                  : [];
                return {
                  ...prevState,
                  selectedAction: "Compare",
                  listOfChallenges: comparableEvents,
                };
              })
            }
          />

          <ActionCard
            isProgramAvailable={dashboardState.isProgramAvailable}
            name="data_source"
            display={
              (dashboardState.challengeSwitch === "current" ||
                dashboardState.challengeSwitch === "upcoming") &&
              dashboardState.listOfChallenges.length > 0 &&
              id === "walkathon"
            }
            onClick={() => {
              setDashboardState((prevState) => {
                return {
                  ...prevState,
                  selectedAction: "Source",
                  listOfChallenges: getCurrentAllEvents(),
                };
              });
            }}
          />

          <ActionCard
            isProgramAvailable={true}
            name="profile"
            display={id === "settings"}
            onClick={() => {
              setDashboardState((prevState) => {
                return {
                  ...prevState,
                  selectedAction: "Activities",
                  listOfChallenges: getCurrentAllEvents(),
                };
              });
              window.location.replace("/#/profile");
            }}
          />

          <ActionCard
            isProgramAvailable={true}
            name="resetpin"
            display={id === "settings"}
            onClick={() => {
              setDashboardState((prevState) => {
                return {
                  ...prevState,
                  selectedAction: "Activities",
                  listOfChallenges: getCurrentAllEvents(),
                };
              });
              window.location.replace("/#/resetpin");
            }}
          />

          <ActionCard
            isProgramAvailable={dashboardState.isProgramAvailable}
            name="gallery"
            display={
              dashboardState.challengeSwitch !== "upcoming" &&
              dashboardState.listOfChallenges.length > 0 &&
              id === "gallery"
            }
            onClick={() => {
              setDashboardState((prevState) => {
                return {
                  ...prevState,
                  selectedAction: "Gallery",
                  listOfChallenges: getCurrentAllEvents(),
                };
              });
            }}
          />

          <ActionCard
            isProgramAvailable={dashboardState.isProgramAvailable}
            name="quiz"
            display={
              dashboardState.challengeSwitch !== "upcoming" &&
              dashboardState.listOfChallenges.length > 0 &&
              id === "quiz"
            }
            onClick={() => {
              setDashboardState((prevState) => {
                return {
                  ...prevState,
                  selectedAction: "quiz",
                  listOfChallenges: getCurrentAllEvents(),
                };
              });
            }}
          />
        </div>
      </div>
    );
  };

  const { location } = useLocation();
  return (
    <div className="Dasboard">
      <Navbar />
      {dashboardState.selectedAction === "Activities" ? (
        <div className="Main">
          <TopUserDetails />
          <TopRow
            {...{
              history,
              dashboardState,
              handleToggleStateChange,
              handleChallengeCardClick,
            }}
          />
          <Activity
            eventId={dashboardState.selectedChallenge}
            currentEventObj={dashboardState.selectedChallengeObject}
            isProgramAvailable={(value) => {
              setDashboardState({
                ...dashboardState,
                isProgramAvailable: value,
              });
            }}
          />

          <div>{renderActionsByType(id)}</div>

          {/* Event Register Modal by localStorage */}
          {/* TODO: check if event are registered via sms link else remove */}
          {localStorage.challengeIDRegister &&
            localStorage.mobileNumber &&
            dashboardState.allChallenge.length > 0 && (
              <EventRegisterModal
                challenge={
                  dashboardState.allChallenge.filter(
                    (ch) => ch.id === parseInt(localStorage.challengeIDRegister)
                  )[0] ?? {}
                }
                modalView={showRegisterModal}
                setModalView={() => {
                  localStorage.removeItem("challengeIDRegister");
                  setShowRegisterModal(false);
                }}
                setDashboardState={setDashboardState}
                instruction_details={dashboardState?.instruction_details}
              />
            )}
        </div>
      ) : (
        <Actions
          setDashboardState={setDashboardState}
          dashboardState={dashboardState}
          getCurrentAllEvents={getCurrentAllEvents}
          handleCompare={handleCompare}
        >
          {renderViewByActionType(dashboardState)}
        </Actions>
      )}

      {/* Challenge Status */}
      {displayChallengeStatus && (
        <ChallengeStatus
          {...{
            challengeStatusMsg,
            setDisplayChallengeStatus,
            displayChallengeStatus,
          }}
        />
      )}
    </div>
  );
};

const ActionCard = ({ onClick, name, display, isProgramAvailable }) => {
  return (
    display && (
      <div className="actions">
        <div
          className="actionButton"
          onClick={isProgramAvailable ? onClick : undefined}
        >
          <div style={{ display: "flex" }}>
            <FA icon={ACTION_ICONS[name]} size="1x" color="#fff" />
          </div>
        </div>
        <div className="actionName">{name.replace("_", " ")}</div>
      </div>
    )
  );
};

const TopRow = ({
  history,
  dashboardState,
  handleToggleStateChange,
  handleChallengeCardClick,
}) => {
  const [eventDetailModal, setEventDetailModal] = useState(false);
  const events = dashboardState.listOfChallenges.map((event) => ({
    label: event.challengeName,
    value: event.id,
  }));
  return (
    <div className="challengesContainer">
      <div className="challenge-selector">
        <div className="ch-heading">Challenges</div>
        <TriStateToggle
          values={["old", "current", "upcoming"]}
          selected={dashboardState.challengeSwitch}
          handleChange={handleToggleStateChange}
        />
      </div>
      <div className="eventDropdown">
        <SelectBox
          options={events || []}
          selectedValue={dashboardState.selectedChallengeObject.id}
          handleChange={(e) => {
            const eventObj = dashboardState.listOfChallenges.find(
              (ev) => ev.id === parseInt(e.target.value)
            );
            handleChallengeCardClick(eventObj);
          }}
        />
        <FA
          icon={faInfoCircle}
          color="#518ad6"
          onClick={() => {
            setEventDetailModal(true);
          }}
        />
        <div
          onClick={() => {
            history.push("/default-view");
          }}
          className="viewEventButton"
        >
          All Events
        </div>
      </div>

      {eventDetailModal && (
        <EventInfoModal
          challenge={dashboardState.selectedChallengeObject}
          modalView={eventDetailModal}
          setModalView={() => {
            setEventDetailModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
