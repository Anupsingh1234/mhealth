import React, { useEffect, useState, useContext } from "react";
import Message from "antd-message";
import TriStateToggle from "./toggle/TriStateToggle";
import ListOfEvents from "./ListOfEvents";
import ChallengeList from "./ChallengeList";
import {
  getLeaderBoardData,
  getEventGalleryData,
  getOldEvents,
} from "../services/challengeApi";
import TopUserDetails from "./TopUserDetails";
import EventRegisterModal from "./EventRegisterModal";
import ChallengeStatus from "./Dashboard/ChallengeStatus";
import DefaultDashboard from "./DefaultDashboard";
import EventInfoModal from "./EventInfoModal";
import { PrimaryButton } from "./Form/Button";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import GlobalStateContext from "../context/GlobalStateContext";
import SearchByCode from "./DefaultDashboard/SearchByCode";

const Home = () => {
  const getDefaultTab = () => {
    if (!localStorage.dashboard_default_tab) {
      return "Leaderboard";
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
          return "Leaderboard";
      }
    }
  };
  const { globalState, setGlobalState } = useContext(GlobalStateContext);
  const initialState = {
    listOfChallenges: [],
    selectedChallengeObject: {},
    challengeSwitch: "current",
    allChallenge: [],
    instruction_details: undefined,
    searchedEvent: [],
  };

  const [dashboardState, setDashboardState] = useState(initialState);

  const [challengeStatusMsg, setChallengeStatusMsg] = useState("");
  const [displayChallengeStatus, setDisplayChallengeStatus] = useState(false);
  const [eventId, seteventId] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(
    localStorage.challengeIDRegister ? true : false
  );
  const [eventDetailModal, setEventDetailModal] = useState(false);
  localStorage.setItem("selectTab", dashboardState.selectedAction);
  const history = useHistory();

  const resetState = () => {
    setGlobalState({ ...globalState, initialState });
  };

  useEffect(() => {
    resetState();
    fetchChallenges();
  }, []);

  const fetchChallenges = (eventTypeSwitch) => {
    window.message = Message;

    getOldEvents().then((res) => {
      const {
        status,
        data: { response },
      } = res;
      if (status === 200) {
        let event = [];
        event = response.responseData?.linkedEvents;
        seteventId(response.responseData?.linkedEvents);
        let selectedEventFromMainPage = response.responseData?.events?.filter(
          (item) => item.id == localStorage.challengeIDRegister
        )[0];
        let allChallengeData = response.responseData?.events?.filter((item) => {
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
              ? (item.eventView !== "LINKED" && item.eventView !== "PRIVATE") ||
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
              ? (item.eventView !== "LINKED" && item.eventView !== "PRIVATE") ||
                (event.includes(item.id) && item.timePeriod === "FUTURE") ||
                (event.includes(item.id) && item.timePeriod === "CURRENT")
              : item.eventView !== "PRIVATE" &&
                item.eventView !== "LINKED" &&
                item.timePeriod !== "FUTURE";
          }
        });

        setGlobalState({
          ...globalState,
          allChallenge: res.data.response.responseData.events,
          listOfChallenges: allChallengeData,
          instruction_details:
            res?.data?.response?.responseData?.instruction_details,
          selectedChallengeObject: globalState?.selectedChallengeObject
            ? globalState.selectedChallengeObject
            : allChallengeData.length > 0
            ? allChallengeData[0]
            : {},
        });
        setDashboardState((prevState) => {
          return {
            ...prevState,
            allChallenge: res.data.response.responseData.events,
            listOfChallenges: allChallengeData,
            instruction_details:
              res?.data?.response?.responseData?.instruction_details,
            selectedChallengeObject: globalState?.selectedChallengeObject
              ? globalState.selectedChallengeObject
              : allChallengeData.length > 0
              ? allChallengeData[0]
              : {},
          };
        });
      }
    });
  };

  const handleToggleStateChange = (value) => {
    setGlobalState({
      ...globalState,
      challengeSwitch: value,
      listOfChallenges: [],
      // selectedAction: value === "upcoming" ? "Leaderboard" : getDefaultTab(),
      selectedChallengeObject: {},
    });
    setDashboardState((prevState) => {
      return {
        ...prevState,
        challengeSwitch: value,
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
        }
      });
    }
  };

  const handleChallengeCardClick = async (eventObj) => {
    window.message = Message;

    const defaultTab = getDefaultTab();
    setGlobalState({
      ...globalState,
      selectedChallengeObject: eventObj,
    });

    switch (defaultTab) {
      case "Leaderboard":
      case "Challenge":
      case "Activities":
      case "Performance":
      case "Target":
      case "Source":
      case "Compare":
      case "team":
      case "achievement":
      case "challenge":
        window.location.replace("#/walkathon");
        return;
      case "Gallery":
      case "dietplan":
      case "quiz":
      case "hra":
        window.location.replace("#/health");
        return;
    }
  };

  const handleSearchEvent = (keyword) => {
    const searchedEvent = dashboardState.listOfChallenges.filter(
      (event) => event.registrationCode === keyword
    );
    if (keyword !== "") {
      if (searchedEvent.length === 0) {
        message.error("No Event Found!");
        return;
      } else {
        setDashboardState({
          ...dashboardState,
          searchedEvent: searchedEvent.length > 0 ? searchedEvent : [],
        });
      }
    } else {
      setDashboardState({
        ...dashboardState,
        searchedEvent: [],
      });
    }
  };

  const [displaySearch, setDisplaySearch] = useState(false);

  return (
    <div className={classNames("bg-white flex flex-col", "md:px-12 md:gap-4")}>
      <div className="gap-2 flex justify-between mx-4 flex-col md:flex-row-reverse items-end">
        <TriStateToggle
          values={["old", "current", "upcoming"]}
          selected={dashboardState.challengeSwitch}
          handleChange={handleToggleStateChange}
        />
        <div>
          Click on challenge card to see actions or{" "}
          <span
            className="text-blue-600 underline cursor-pointer"
            onClick={() => setDisplaySearch(true)}
          >
            search by code
          </span>
        </div>
      </div>

      <div className="mx-2 mt-2 mb-12">
        <ListOfEvents
          handleChallengeCardClick={handleChallengeCardClick}
          fetchChallenges={fetchChallenges}
          data={
            dashboardState.searchedEvent.length > 0
              ? dashboardState.searchedEvent
              : dashboardState.listOfChallenges
          }
          dashboardState={dashboardState}
          setDashboardState={setDashboardState}
          selectedAction={dashboardState.selectedAction}
          listType="event"
          selectedChallengeArray={dashboardState.selectedChallengeArray}
          selectedChallenge={dashboardState.selectedChallenge}
        />
      </div>
      {displaySearch && (
        <div className="mx-2">
          <SearchByCode
            handleSearchEvent={handleSearchEvent}
            setDisplaySearch={setDisplaySearch}
          />
        </div>
      )}

      {/* Event Register Modal by localStorage */}
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

export default Home;
