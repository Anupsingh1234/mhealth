import React, { useEffect, useState, useContext } from "react";
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
import Forum from "./Forum";
import ThemeContext from "../context/ThemeContext";
import DietPlan from "./Dietplan/DietPlan";
import HRA from "../components/HRA/Index";
function FacebookCircularProgress(props) {
  const useStylesFacebook = makeStyles((theme) => ({
    root: {
      position: "absolute",
      left: "50%",
      top: "50%",
    },
    bottom: {
      color: theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
    },
    top: {
      color: "#1a90ff",
      animationDuration: "550ms",
      position: "absolute",
      left: 0,
    },
    circle: {
      strokeLinecap: "round",
    },
  }));
  const classes = useStylesFacebook();

  return (
    <div className={classes.root}>
      <CircularProgress
        variant="determinate"
        className={classes.bottom}
        size={20}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={20}
        thickness={4}
        {...props}
      />
    </div>
  );
}
const Dashboard = () => {
  const getDefaultTab = () => {
    if (!localStorage.dashboard_default_tab) {
      return "Activities";
    }

    if (
      localStorage.getItem("dashboard_default_tab") !== undefined &&
      localStorage.getItem("dashboard_default_tab") !== null
    ) {
      switch (localStorage.getItem("dashboard_default_tab")) {
        case "leaderboard":
          return "Leaderboard";
        case "event_gallery":
          return "Gallery";
        case "invite":
          return "Challenge";
        case "program":
          return "Activities";
        case "performance":
          return "Performance";
        case "target":
          return "Target";
        case "source":
          return "Source";
        case "compare":
          return "Compare";
        case "team":
          return "team";
        case "dietplan":
          return "dietplan";
        case "achievement":
          return "achievement";
        case "challenge":
          return "challenge";
        case "quiz":
          return "quiz";
          case "hra":
            return "hra";
        default:
          return "Activities";
      }
    }
  };

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
  });
  console.log({ dashboardState });
  localStorage.setItem("selectTab", dashboardState.selectedAction);
  useEffect(() => {
    if (
      localStorage.getItem("dashboard_default_tab") !== undefined &&
      localStorage.getItem("dashboard_default_tab") !== null
    ) {
      setDashboardState((prevState) => {
        return {
          ...prevState,
          selectedAction: getDefaultTab(),
        };
      });
    }
  }, [localStorage.getItem("dashboard_default_tab")]);

  const [showRegisterModal, setShowRegisterModal] = useState(
    localStorage.challengeIDRegister ? true : false
  );

  const [challengeStatusMsg, setChallengeStatusMsg] = useState("");
  const [displayChallengeStatus, setDisplayChallengeStatus] = useState(false);
  const [pendingInviteCount, setPendingCount] = useState(null);
  const [reloadChallengeAccepted, setReloadChallengeAccepted] = useState(false);
  const [eventId, seteventId] = useState([]);
  const [distancelogo, setdistancelogo] = useState({});
  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
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
        selectedAction: !eventTypeSwitch
          ? getDefaultTab()
          : prevState.selectedAction,
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
        selectedAction: value === "upcoming" ? "Leaderboard" : getDefaultTab(),
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
      [
        "Leaderboard",
        "Gallery",
        "Source",
        "Target",
        "Activities",
        "Challenge",
        "team",
        "achievement",
        "challenge",
        "quiz",
        "forum",
        "dietplan",
        "hra",
      ].includes(dashboardState.selectedAction)
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

  const { theme } = useContext(ThemeContext);
  const remainingDays = dashboardState.selectedChallengeObject.remainingDay;
  return (
    <div className="Dasboard">
      <Navbar />
      <div className="Main">
        <ChallengeList>
          <TopUserDetails />
          <div className="display-row">
            <div className="challenges-heading" style={{ marginRight: 20 }}>
              Challenges
            </div>
            <TriStateToggle
              values={["old", "current", "upcoming"]}
              selected={dashboardState.challengeSwitch}
              handleChange={handleToggleStateChange}
            />
          </div>

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
        </ChallengeList>
        {remainingDays === 0 ? (
          <>
            <div className="Leaderboard" id="Leaderboard">
              <div className="leaderboard-header">
                <div
                  className="challenges-heading"
                  style={{ textTransform: "capitalize" }}
                >
                  {dashboardState.selectedAction !== "Compare" &&
                    dashboardState.selectedAction !== "Gallery" &&
                    dashboardState.selectedAction !== "Source" &&
                    getLeaderBoardHeading(
                      dashboardState.selectedChallengeObject,
                      dashboardState.selectedAction
                    )}
                </div>

                <div
                  className="d-flex j-c-sp-btn a-i-center cursor-pointer"
                  style={{ justifyContent: "flex-end" }}
                >
                  <div className="leaderboard-actions">
                    {dashboardState.listOfChallenges.length > 0 && (
                      <button
                        style={{
                          background:
                            dashboardState.selectedAction === "hra"
                              ? theme.buttonTextColor
                              : theme.buttonBGColor,
                          color:
                            dashboardState.selectedAction === "hra"
                              ? theme.buttonBGColor
                              : theme.buttonTextColor,
                          border:
                            dashboardState.selectedAction === "hra"
                              ? "1px solid"
                              : "1px transparent",
                          borderColor: theme.buttonBGColor,
                        }}
                        onClick={() => {
                          setDashboardState((prevState) => {
                            return {
                              ...prevState,
                              selectedAction: "hra",
                              listOfChallenges: getCurrentAllEvents(),
                            };
                          });
                        }}
                      >
                        HRA
                      </button>
                    )}

                    {dashboardState.listOfChallenges.length > 0 && (
                      <button
                        style={{
                          background:
                            dashboardState.selectedAction === "dietplan"
                              ? theme.buttonTextColor
                              : theme.buttonBGColor,
                          color:
                            dashboardState.selectedAction === "dietplan"
                              ? theme.buttonBGColor
                              : theme.buttonTextColor,
                          border:
                            dashboardState.selectedAction === "dietplan"
                              ? "1px solid"
                              : "1px transparent",
                          borderColor: theme.buttonBGColor,
                        }}
                        onClick={() => {
                          setDashboardState((prevState) => {
                            return {
                              ...prevState,
                              selectedAction: "dietplan",
                              listOfChallenges: getCurrentAllEvents(),
                            };
                          });
                        }}
                      >
                        My Plan
                      </button>
                    )}
                    {dashboardState.listOfChallenges.length > 0 && (
                      <button
                        style={{
                          background:
                            dashboardState.selectedAction === "forum"
                              ? theme.buttonTextColor
                              : theme.buttonBGColor,
                          color:
                            dashboardState.selectedAction === "forum"
                              ? theme.buttonBGColor
                              : theme.buttonTextColor,
                          border:
                            dashboardState.selectedAction === "forum"
                              ? "1px solid"
                              : "1px transparent",
                          borderColor: theme.buttonBGColor,
                        }}
                        onClick={() => {
                          setDashboardState((prevState) => {
                            return {
                              ...prevState,
                              selectedAction: "forum",
                              listOfChallenges: getCurrentAllEvents(),
                            };
                          });
                        }}
                      >
                        Community{" "}
                      </button>
                    )}
                    {dashboardState.challengeSwitch !== "upcoming" &&
                      dashboardState.listOfChallenges.length > 0 && (
                        <button
                          style={{
                            background:
                              dashboardState.selectedAction === "quiz"
                                ? theme.buttonTextColor
                                : theme.buttonBGColor,
                            color:
                              dashboardState.selectedAction === "quiz"
                                ? theme.buttonBGColor
                                : theme.buttonTextColor,
                            border:
                              dashboardState.selectedAction === "quiz"
                                ? "1px solid"
                                : "1px transparent",
                            borderColor: theme.buttonBGColor,
                          }}
                          onClick={() => {
                            setDashboardState((prevState) => {
                              return {
                                ...prevState,
                                selectedAction: "quiz",
                                listOfChallenges: getCurrentAllEvents(),
                              };
                            });
                          }}
                        >
                          Quiz{" "}
                        </button>
                      )}
                    {dashboardState.challengeSwitch !== "upcoming" &&
                      dashboardState.listOfChallenges.length > 0 && (
                        <button
                          style={{
                            background:
                              dashboardState.selectedAction === "team"
                                ? theme.buttonTextColor
                                : theme.buttonBGColor,
                            color:
                              dashboardState.selectedAction === "team"
                                ? theme.buttonBGColor
                                : theme.buttonTextColor,
                            border:
                              dashboardState.selectedAction === "team"
                                ? "1px solid"
                                : "1px transparent",
                            borderColor: theme.buttonBGColor,
                          }}
                          onClick={() => {
                            setDashboardState((prevState) => {
                              return {
                                ...prevState,
                                selectedAction: "team",
                                listOfChallenges: getCurrentAllEvents(),
                              };
                            });
                          }}
                        >
                          Team{" "}
                        </button>
                      )}
                    {dashboardState.listOfChallenges.length > 0 && (
                      <button
                        style={{
                          background:
                            dashboardState.selectedAction === "Challenge"
                              ? theme.buttonTextColor
                              : theme.buttonBGColor,
                          color:
                            dashboardState.selectedAction === "Challenge"
                              ? theme.buttonBGColor
                              : theme.buttonTextColor,
                          border:
                            dashboardState.selectedAction === "Challenge"
                              ? "1px solid"
                              : "1px transparent",
                          borderColor: theme.buttonBGColor,
                        }}
                        onClick={() => {
                          setDashboardState((prevState) => {
                            return {
                              ...prevState,
                              selectedAction: "Challenge",
                              listOfChallenges: getCurrentAllEvents(),
                            };
                          });
                        }}
                      >
                        {pendingInviteCount ? (
                          <div className="badge-invite">
                            <Badge
                              badgeContent={pendingInviteCount}
                              color="error"
                            >
                              Invite 
                            </Badge>
                          </div>
                        ) : (
                          "Invite "
                        )}
                      </button>
                    )}
                    {dashboardState.challengeSwitch !== "upcoming" &&
                      dashboardState.listOfChallenges.length > 0 && (
                        <button
                          style={{
                            background:
                              dashboardState.selectedAction === "Activities"
                                ? theme.buttonTextColor
                                : theme.buttonBGColor,
                            color:
                              dashboardState.selectedAction === "Activities"
                                ? theme.buttonBGColor
                                : theme.buttonTextColor,
                            border:
                              dashboardState.selectedAction === "Activities"
                                ? "1px solid"
                                : "1px transparent",
                            borderColor: theme.buttonBGColor,
                          }}
                          onClick={() => {
                            setDashboardState((prevState) => {
                              return {
                                ...prevState,
                                selectedAction: "Activities",
                                listOfChallenges: getCurrentAllEvents(),
                              };
                            });
                          }}
                        >
                          Programs
                        </button>
                      )}
                    {(dashboardState.challengeSwitch === "current" ||
                      dashboardState.challengeSwitch === "upcoming") &&
                      dashboardState.listOfChallenges.length > 0 && (
                        <button
                          style={{
                            background:
                              dashboardState.selectedAction === "Source"
                                ? theme.buttonTextColor
                                : theme.buttonBGColor,
                            color:
                              dashboardState.selectedAction === "Source"
                                ? theme.buttonBGColor
                                : theme.buttonTextColor,
                            border:
                              dashboardState.selectedAction === "Source"
                                ? "1px solid"
                                : "1px transparent",
                            borderColor: theme.buttonBGColor,
                          }}
                          onClick={() => {
                            setDashboardState((prevState) => {
                              return {
                                ...prevState,
                                selectedAction: "Source",
                                listOfChallenges: getCurrentAllEvents(),
                              };
                            });
                          }}
                        >
                          Data Source
                        </button>
                      )}
                    {dashboardState.challengeSwitch !== "upcoming" && (
                      <>
                        {dashboardState.listOfChallenges.length > 0 && (
                          <button
                            style={{
                              background:
                                dashboardState.selectedAction === "Gallery"
                                  ? theme.buttonTextColor
                                  : theme.buttonBGColor,
                              color:
                                dashboardState.selectedAction === "Gallery"
                                  ? theme.buttonBGColor
                                  : theme.buttonTextColor,
                              border:
                                dashboardState.selectedAction === "Gallery"
                                  ? "1px solid"
                                  : "1px transparent",
                              borderColor: theme.buttonBGColor,
                            }}
                            onClick={() => {
                              setDashboardState((prevState) => {
                                return {
                                  ...prevState,
                                  selectedAction: "Gallery",
                                  listOfChallenges: getCurrentAllEvents(),
                                };
                              });
                            }}
                          >
                            Gallery
                          </button>
                        )}
                        <button
                          style={{
                            background:
                              dashboardState.selectedAction === "Compare"
                                ? theme.buttonTextColor
                                : theme.buttonBGColor,
                            color:
                              dashboardState.selectedAction === "Compare"
                                ? theme.buttonBGColor
                                : theme.buttonTextColor,
                            border:
                              dashboardState.selectedAction === "Compare"
                                ? "1px solid"
                                : "1px transparent",
                            borderColor: theme.buttonBGColor,
                          }}
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
                        >
                          Compare
                        </button>
                        {dashboardState.challengeSwitch !== "upcoming" &&
                          dashboardState.listOfChallenges.length > 0 && (
                            <button
                              style={{
                                background:
                                  dashboardState.selectedAction ===
                                  "achievement"
                                    ? theme.buttonTextColor
                                    : theme.buttonBGColor,
                                color:
                                  dashboardState.selectedAction ===
                                  "achievement"
                                    ? theme.buttonBGColor
                                    : theme.buttonTextColor,
                                border:
                                  dashboardState.selectedAction ===
                                  "achievement"
                                    ? "1px solid"
                                    : "1px transparent",
                                borderColor: theme.buttonBGColor,
                              }}
                              onClick={() => {
                                setDashboardState((prevState) => {
                                  return {
                                    ...prevState,
                                    selectedAction: "achievement",
                                    listOfChallenges: getCurrentAllEvents(),
                                  };
                                });
                              }}
                            >
                              Achievement{" "}
                            </button>
                          )}
                        {dashboardState.challengeSwitch !== "upcoming" &&
                          dashboardState.listOfChallenges.length > 0 && (
                            <button
                              style={{
                                background:
                                  dashboardState.selectedAction === "challenge"
                                    ? theme.buttonTextColor
                                    : theme.buttonBGColor,
                                color:
                                  dashboardState.selectedAction === "challenge"
                                    ? theme.buttonBGColor
                                    : theme.buttonTextColor,
                                border:
                                  dashboardState.selectedAction === "challenge"
                                    ? "1px solid"
                                    : "1px transparent",
                                borderColor: theme.buttonBGColor,
                              }}
                              onClick={() => {
                                setDashboardState((prevState) => {
                                  return {
                                    ...prevState,
                                    selectedAction: "challenge",
                                    listOfChallenges: getCurrentAllEvents(),
                                  };
                                });
                              }}
                            >
                              Sunday Challenge{" "}
                            </button>
                          )}
                        {dashboardState.challengeSwitch !== "upcoming" &&
                          dashboardState.listOfChallenges.length > 0 && (
                            <button
                              style={{
                                background:
                                  dashboardState.selectedAction === "Target"
                                    ? theme.buttonTextColor
                                    : theme.buttonBGColor,
                                color:
                                  dashboardState.selectedAction === "Target"
                                    ? theme.buttonBGColor
                                    : theme.buttonTextColor,
                                border:
                                  dashboardState.selectedAction === "Target"
                                    ? "1px solid"
                                    : "1px transparent",
                                borderColor: theme.buttonBGColor,
                              }}
                              onClick={() => {
                                setDashboardState((prevState) => {
                                  return {
                                    ...prevState,
                                    selectedAction: "Target",
                                    listOfChallenges: getCurrentAllEvents(),
                                  };
                                });
                              }}
                            >
                              Set Target
                            </button>
                          )}
                        <button
                          style={{
                            background:
                              dashboardState.selectedAction === "Performance"
                                ? theme.buttonTextColor
                                : theme.buttonBGColor,
                            color:
                              dashboardState.selectedAction === "Performance"
                                ? theme.buttonBGColor
                                : theme.buttonTextColor,
                            border:
                              dashboardState.selectedAction === "Performance"
                                ? "1px solid"
                                : "1px transparent",
                            borderColor: theme.buttonBGColor,
                          }}
                          onClick={() => handlePerformanceClick()}
                        >
                          Daily Score
                        </button>
                      </>
                    )}
                    <button
                      style={{
                        background:
                          dashboardState.selectedAction === "Leaderboard"
                            ? theme.buttonTextColor
                            : theme.buttonBGColor,
                        color:
                          dashboardState.selectedAction === "Leaderboard"
                            ? theme.buttonBGColor
                            : theme.buttonTextColor,
                        border:
                          dashboardState.selectedAction === "Leaderboard"
                            ? "1px solid"
                            : "1px transparent",
                        borderColor: theme.buttonBGColor,
                      }}
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
                    >
                      Leaderboard
                    </button>
                    <div style={{ marginLeft: "1em" }}>
                      <FullScreen id="Challenges" theme={theme} />
                    </div>
                  </div>
                </div>
              </div>

              {dashboardState.selectedAction === "Challenge" && (
                <ChallengeByInvite
                  eventId={dashboardState.selectedChallenge}
                  {...{ reloadChallengeAccepted, setReloadChallengeAccepted }}
                />
              )}
              {dashboardState.selectedAction === "Leaderboard" &&
              dashboardState.leaderBoardData.loading === false ? (
                <LeaderboardTable
                  leaderBoardData={dashboardState.leaderBoardData}
                  currentEvent={dashboardState.selectedChallengeObject}
                  challengeSwitch={dashboardState.challengeSwitch}
                />
              ) : (
                dashboardState.selectedAction === "Leaderboard" && (
                  <FacebookCircularProgress />
                )
              )}

              {dashboardState.selectedAction === "team" && (
                <CreateTeam eventId={dashboardState.selectedChallenge} />
              )}

              {dashboardState.selectedAction === "dietplan" && (
                <DietPlan eventId={dashboardState.selectedChallenge} />
              )}

              {dashboardState.selectedAction === "achievement" && (
                <Achievments
                  eventId={dashboardState.selectedChallenge}
                  logos={distancelogo}
                />
              )}

              {dashboardState.selectedAction === "challenge" && (
                <SundayChallenge eventId={dashboardState.selectedChallenge} />
              )}

              {dashboardState.selectedAction === "Performance" && (
                <PerformanceTab
                  data={dashboardState.performanceTableData}
                  eventId={dashboardState.selectedChallenge}
                  handlePerformanceClick={handlePerformanceClick}
                  challengeSwitch={dashboardState.challengeSwitch}
                />
              )}

              {dashboardState.selectedAction === "quiz" && (
                <Quiz
                  eventId={dashboardState.selectedChallenge}
                  challengeSwitch={dashboardState.listOfChallenges}
                />
              )}

              {dashboardState.selectedAction === "Performance"}
              {dashboardState.selectedAction === "Compare" && displayChart()}
            </div>{" "}
            {dashboardState.selectedAction === "Gallery" && (
              <EventGallery
                eventGalleryData={dashboardState.eventGalleryData}
                fetchEventGallery={fetchEventGallery}
              />
            )}
            {dashboardState.selectedAction === "Target" && (
              <TargetSetting dashboardState={dashboardState} />
            )}
            {dashboardState.selectedAction === "Activities" && (
              <Activity
                eventId={dashboardState.selectedChallenge}
                currentEventObj={dashboardState.selectedChallengeObject}
              />
            )}
            {dashboardState.selectedAction.toUpperCase() === "FORUM" && (
              <Forum eventID={dashboardState.selectedChallenge} />
            )}
            {dashboardState.selectedAction.toUpperCase() === "HRA" && (
              <HRA
                eventID={dashboardState.selectedChallenge}
                currentEventObj={dashboardState.selectedChallengeObject}
              />
            )}
          </>
        ) : (
          <>
            <h1 style={{ textAlign: "center" }}>
              {remainingDays ? (
                <>{remainingDays} Days to GO....</>
              ) : (
                <FacebookCircularProgress />
              )}
            </h1>
          </>
        )}
        {dashboardState.selectedAction === "Source" &&
          (dashboardState.challengeSwitch === "current" ||
            dashboardState.challengeSwitch === "upcoming") && (
            <UpdateDataSource dashboardState={dashboardState} />
          )}
      </div>
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

export default Dashboard;
