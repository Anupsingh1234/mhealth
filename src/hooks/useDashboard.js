import React, { useEffect, useState } from "react";
import {
  getLeaderBoardData,
  getEventGalleryData,
  getOldEvents,
  getAchievements,
} from "../services/challengeApi";

const useDashboard = () => {
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

  useEffect(() => {
    // Fetching challenges
    fetchChallenges();
  }, []);

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

  return { dashboardState };
};

export default useDashboard;
