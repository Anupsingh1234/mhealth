import React, { useCallback, useEffect, useState, useContext } from "react";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import classnames from "classnames";
import Chart from "react-apexcharts";
import Message from "antd-message";
import TriStateToggle from "./toggle/TriStateToggle";
import { lighten, makeStyles, useTheme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import EventGallery from "./EventGallery";
import DietPlan from "./Dietplan/DietPlan";
import HRA from "./HRA/Index";
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
import {
  faArrowDownWideShort,
  faDiamond,
  faHome,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
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
import { PrimaryButton } from "./Form/Button";
import GlobalStateContext from "../context/GlobalStateContext";

const Health = (props) => {
  const getDefaultTab = () => {
    if (!localStorage.dashboard_default_tab) {
      return "Gallery";
    }

    if (
      localStorage.getItem("dashboard_default_tab") !== undefined &&
      localStorage.getItem("dashboard_default_tab") !== null
    ) {
      switch (localStorage.getItem("dashboard_default_tab")) {
        case "event_gallery":
          return "Gallery";
        case "source":
          return "Source";
        case "dietplan":
          return "dietplan";
        case "quiz":
          return "quiz";
        case "hra":
          return "hra";
        default:
          return "Gallery";
      }
    }
  };
  const { globalState } = useContext(GlobalStateContext);
  const [dashboardState, setDashboardState] = useState({
    listOfChallenges: [],
    leaderBoardData: {
      data: {},
      loading: true,
      message: "",
    },
    selectedAction: getDefaultTab(),
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

  console.log("sA", dashboardState.selectedAction);
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
            console.log({ galleryResponse });
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
    getEventGalleryData(globalState.selectedChallengeObject.id).then(
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
            getEventGalleryData(globalState.selectedChallengeObject.id).then(
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
      await getEventGalleryData(globalState.selectedChallengeObject.id).then(
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
      case "Gallery":
        return (
          <EventGallery
            eventGalleryData={dashboardState.eventGalleryData}
            fetchEventGallery={fetchEventGallery}
          />
        );
      case "quiz":
        return (
          <Quiz
            eventId={globalState.selectedChallengeObject.id}
            challengeSwitch={dashboardState.listOfChallenges}
          />
        );
      case "hra":
        return (
          <HRA
            eventID={globalState.selectedChallengeObject.id}
            currentEventObj={globalState.selectedChallengeObject}
          />
        );
      case "myplan":
        return <DietPlan eventId={globalState.selectedChallengeObject.id} />;
    }
  };

  const renderActionBar = (id) => {
    return (
      <div className="gridCenter">
        <div className="flex md:gap-0 items-center md:justify-center max-w-sm md:max-w-[max-content] overflow-scroll">
          <ActionCard
            isProgramAvailable={dashboardState.isProgramAvailable}
            name="gallery"
            display={
              dashboardState.challengeSwitch !== "upcoming" &&
              dashboardState.listOfChallenges.length > 0 &&
              id === "health"
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
            selected={dashboardState.selectedAction === "Gallery"}
          />

          <ActionCard
            isProgramAvailable={dashboardState.isProgramAvailable}
            name="quiz"
            display={
              dashboardState.challengeSwitch !== "upcoming" &&
              dashboardState.listOfChallenges.length > 0 &&
              id === "health"
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
            selected={dashboardState.selectedAction === "quiz"}
          />
          <ActionCard
            isProgramAvailable={dashboardState.isProgramAvailable}
            name="hra"
            display={
              dashboardState.challengeSwitch !== "upcoming" &&
              dashboardState.listOfChallenges.length > 0 &&
              id === "health"
            }
            onClick={() => {
              setDashboardState((prevState) => {
                return {
                  ...prevState,
                  selectedAction: "hra",
                  listOfChallenges: getCurrentAllEvents(),
                };
              });
            }}
            selected={dashboardState.selectedAction === "hra"}
          />
          <ActionCard
            isProgramAvailable={dashboardState.isProgramAvailable}
            name="my plan"
            display={
              dashboardState.challengeSwitch !== "upcoming" &&
              dashboardState.listOfChallenges.length > 0 &&
              id === "health"
            }
            onClick={() => {
              setDashboardState((prevState) => {
                return {
                  ...prevState,
                  selectedAction: "myplan",
                  listOfChallenges: getCurrentAllEvents(),
                };
              });
            }}
            selected={dashboardState.selectedAction === "myplan"}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-white">
      {/* <Navbar /> */}
      <div className="flex flex-col overflow-x-scroll min-h-[13vh] max-h-[13vh]">
        {renderActionBar(id)}
      </div>
      <div className="mt-4 overflow-scroll max-h-[68vh]">
        {dashboardState.selectedAction === "Compare" && (
          <ListOfEvents
            handleChallengeCardClick={handleChallengeCardClick}
            fetchChallenges={fetchChallenges}
            data={dashboardState.listOfChallenges}
            dashboardState={dashboardState}
            setDashboardState={setDashboardState}
            selectedAction={dashboardState.selectedAction}
            listType="event"
            selectedChallengeArray={dashboardState.selectedChallengeArray}
            selectedChallenge={dashboardState.selectedChallenge}
          />
        )}
        <Actions
          setDashboardState={setDashboardState}
          dashboardState={dashboardState}
          getCurrentAllEvents={getCurrentAllEvents}
          handleCompare={handleCompare}
        >
          {renderViewByActionType(dashboardState)}
        </Actions>
      </div>

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

const ActionCard = ({ onClick, name, selected }) => {
  return (
    <div className="actions">
      <div
        className="actionButton"
        onClick={onClick}
        style={{
          background: selected ? "#e5e7eb" : "#000",
          color: selected ? "#000" : "#fff",
        }}
        // onClick={isProgramAvailable ? onClick : undefined}
      >
        <div style={{ display: "flex" }}>
          <FA
            icon={ACTION_ICONS[name]}
            size="1x"
            color={selected ? "#000" : "#fff"}
          />
        </div>
      </div>
      <div className="actionName capitalize">{name.replace("_", " ")}</div>
    </div>
  );
};

export default Health;