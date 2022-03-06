import React, { useEffect, useState, useContext } from "react";
import Message from "antd-message";
import { PlusCircle } from "react-feather";
import TopUserDetails from "../TopUserDetails";
import Navbar from "../Navbar";
import TriStateToggle from "../toggle/TriStateToggle";
import ScrollableList from "../ScrollableList";
import FallbackDiv from "../Utility/FallbackDiv";
import SubEventCard from "../Dashboard/Activity/SubEventCard";
import RegisteredUsers from "./RegisteredUsers";
import ActivityModal from "./ActivityModal";
import FullScreen from "../Utility/FullScreen";
import EditPaymentDetailsModal from "./EditPaymentDetailsModal";
import AdInstructor from "./AddinstructorModal";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {
  getOldEvents,
  getSubEventUsersList,
  getAllSubActivities,
  getEventRoleWiseList,
} from "../../services/challengeApi";
import axios from "axios";
import { urlPrefix } from "../../services/apicollection";
import ThemeContext from "../../context/ThemeContext";
import { PrimaryButton } from "../Form";
const Activities = () => {
  const [activityState, setActivityState] = useState({
    listOfEventsData: [],
    listOfSubEventsData: [],
    selectedToggle: "current",
    selectedSubEvent: undefined,
    currentSubEventObj: {},
    listOfSubEventUsers: { data: [] },
  });
  const [createActivityModal, setCreateActivityModal] = useState(false);
  const [editActivityObject, setEditActivityObject] = useState();

  const [paymentModalStatus, setPaymentModalStatus] = useState(false);
  const [editPaymentObject, setEditPaymentObject] = useState();
  const [tabSelection, setTabSelection] = useState("current");
  const [prog, setprog] = useState([]);
  const [eventCode, seteventCode] = useState("");
  const [check, setcheck] = useState("all");
  const [admin, setadmin] = useState();
  const getSubEventsByTabSelection = (data) => {
    let tempData = data.filter((item) => {
      if (tabSelection == "current") {
        return item.timePeriod == tabSelection.toUpperCase();
      }
      if (tabSelection == "old") {
        return item.timePeriod == "PAST";
      }
      if (tabSelection == "upcoming") {
        return item.timePeriod == "FUTURE";
      }
    });
    return tempData;
  };

  console.log(activityState.listOfEventsData, "yes");

  const fetchAllActivities = () => {
    setActivityState({
      listOfEventsData: [],
      listOfSubEventsData: [],
      selectedToggle: "current",
      selectedSubEvent: undefined,
      currentSubEventObj: {},
      listOfSubEventUsers: { data: [] },
    });
    window.message = Message;

    // getOldEvents().then((res) => {
    //   if (res.data.response.responseMessage === "SUCCESS") {
    //     let currentPresentEvents = res.data.response.responseData.events.filter(
    //       (item) => {
    //         return item.isActive == 1;
    //       }
    //     );
    //     setadmin(res.data.response.responseData.isAdmin);
    //     localStorage.setItem(
    //       "event",
    //       res.data.response.responseData.keyword.eventId
    //     );

    //     console.log(res.data.response.responseData.isModerator, "adminlog");
    //     setActivityState((prevState) => {
    //       return {
    //         ...prevState,
    //         listOfEventsData: currentPresentEvents,
    //       };
    //     });
    //   }
    // });
    getEventRoleWiseList().then((res) => {
      if (res.data.response.responseMessage === "SUCCESS") {
        let currentPresentEvents = res.data.response.responseData.filter(
          (item) => {
            return item.isActive == 1;
          }
        );
        // setadmin(res.data.response.responseData.isAdmin);
        // localStorage.setItem(
        //   'event',
        //   res.data.response.responseData.keyword.eventId
        // );

        // console.log(res.data.response.responseData.isModerator, 'adminlog');
        setActivityState((prevState) => {
          return {
            ...prevState,
            listOfEventsData: currentPresentEvents,
          };
        });
      }
    });

    getAllSubActivities(localStorage.getItem("event")).then((res) => {
      if (res.data.response.responseMessage === "SUCCESS") {
        let subEventData = res.data.response.responseData;

        setActivityState((prevState) => {
          return {
            ...prevState,
            listOfSubEventsData: subEventData,
            selectedSubEvent:
              getSubEventsByTabSelection(subEventData).length > 0
                ? getSubEventsByTabSelection(subEventData)[0]["id"]
                : undefined,
            currentSubEventObj:
              getSubEventsByTabSelection(subEventData).length > 0
                ? getSubEventsByTabSelection(subEventData)[0]
                : {},
          };
        });

        if (
          getSubEventsByTabSelection(subEventData).length > 0 &&
          getSubEventsByTabSelection(subEventData)[0]
        ) {
          getSubEventUsersList(
            getSubEventsByTabSelection(subEventData)[0]["id"],
            "WEB"
          ).then((subEventResponse) => {
            seteventCode(localStorage.getItem("eventCode"));
            if (
              subEventResponse.data.mhealthResponseMessage == "SUCCESS" &&
              subEventResponse.data.response &&
              subEventResponse.data.response.responseMessage == "SUCCESS" &&
              subEventResponse.data.response.responseData
            ) {
              {
                var marvelHeroes =
                  subEventResponse.data.response.responseData.filter(function (
                    hero
                  ) {
                    const x =
                      hero.eventRegistrationCode ==
                      localStorage.getItem("eventCode");

                    return x;
                  });
              }
              console.log(eventCode, "5 - listOfSubEventUsers");

              console.log(marvelHeroes, "5 - listOfSubEventUsers");

              setActivityState((prevState) => {
                return {
                  ...prevState,

                  listOfSubEventUsers: {
                    data: admin
                      ? subEventResponse.data.response.responseData
                      : marvelHeroes,
                  },
                };
              });
            } else {
              setActivityState((prevState) => {
                return {
                  ...prevState,
                  listOfSubEventUsers: {
                    data: [],
                  },
                };
              });
            }
          });
        }
      }
    });
  };

  const fetchSubEvents = () => {
    getAllSubActivities(localStorage.getItem("event"))
      .then((res) => {
        if (res.data.response.responseMessage === "SUCCESS") {
          let subEventData = res.data.response.responseData;

          setActivityState((prevState) => {
            return {
              ...prevState,
              listOfSubEventsData: subEventData,
              selectedSubEvent:
                subEventData.length > 0 ? subEventData[0]["id"] : undefined,
              currentSubEventObj:
                subEventData.length > 0 ? subEventData[0] : {},
            };
          });
          if (subEventData.length > 0 && subEventData[0]) {
            getSubEventUsersList(subEventData[0]["id"], "WEB").then(
              (subEventResponse) => {
                seteventCode(localStorage.getItem("eventCode"));
                if (
                  subEventResponse.data.mhealthResponseMessage == "SUCCESS" &&
                  subEventResponse.data.response &&
                  subEventResponse.data.response.responseMessage == "SUCCESS" &&
                  subEventResponse.data.response.responseData
                ) {
                  {
                    var marvelHeroes =
                      subEventResponse.data.response.responseData.filter(
                        function (hero) {
                          const x =
                            hero.eventRegistrationCode ==
                            localStorage.getItem("eventCode");

                          return x;
                        }
                      );
                  }
                  console.log(eventCode, "5 - listOfSubEventUsers");

                  console.log(marvelHeroes, "5 - listOfSubEventUsers");

                  setActivityState((prevState) => {
                    return {
                      ...prevState,
                      listOfSubEventUsers: {
                        data: admin
                          ? subEventResponse.data.response.responseData
                          : marvelHeroes,
                      },
                    };
                  });
                } else {
                  setActivityState((prevState) => {
                    return {
                      ...prevState,
                      listOfSubEventUsers: {
                        data: [],
                      },
                    };
                  });
                }
              }
            );
          }
        } else {
          setActivityState((prevState) => {
            return {
              ...prevState,
              listOfSubEventsData: [],
              selectedSubEvent: undefined,
              currentSubEventObj: {},
            };
          });
        }
      })
      .catch((err) => {
        setActivityState((prevState) => {
          return {
            ...prevState,
            listOfSubEventsData: [],
            selectedSubEvent: undefined,
            currentSubEventObj: {},
          };
        });
      });
  };

  const handleEvent = (e) => {
    console.log(e.target.value, "value");
    if (e.target.value !== "Select") {
      let URL = `${urlPrefix}v1.0/getAllSubActivities?challengerzoneId=${e.target.value}`;

      return axios
        .get(URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            timeStamp: "timestamp",
            accept: "*/*",
            "Access-Control-Allow-Origin": "*",
            withCredentials: true,
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
            "Access-Control-Allow-Headers":
              "accept, content-type, x-access-token, x-requested-with",
          },
        })
        .then((res) => {
          localStorage.setItem(
            "eventCode",
            res?.data?.response?.responseData[0]?.eventCode
          );
          {
            res?.data?.response?.responseData.length > 0
              ? setprog(res?.data?.response?.responseData)
              : res?.data?.response?.responseData.length == 0
              ? setcheck("nodata")
              : setprog([]);

            // console.log(res?.data?.response?.responseData.length);
          } // console.log("programs", res.data.response.responseData);

          {
            res?.data?.response?.responseData.length > 0 && setcheck("");
          }
        })
        .catch((err) => {
          setprog([]);
          setcheck("all");
        });
    }
  };

  useEffect(() => {
    fetchAllActivities();
  }, []);

  const handleSubEventEdit = (subEvntObj) => {
    setEditActivityObject(subEvntObj);
    setCreateActivityModal(true);
  };

  const handleSubEventSelection = (currActivityObj) => {
    setActivityState((prevState) => {
      return {
        ...prevState,
        selectedSubEvent: currActivityObj.id,
        currentSubEventObj: currActivityObj,
      };
    });
    getSubEventUsersList(currActivityObj.id, "WEB").then((subEventResponse) => {
      seteventCode(localStorage.getItem("eventCode"));
      if (
        subEventResponse.data.mhealthResponseMessage == "SUCCESS" &&
        subEventResponse.data.response &&
        subEventResponse.data.response.responseMessage == "SUCCESS" &&
        subEventResponse.data.response.responseData
      ) {
        {
          var marvelHeroes = subEventResponse.data.response.responseData.filter(
            function (hero) {
              const x =
                hero.eventRegistrationCode == localStorage.getItem("eventCode");

              return x;
            }
          );
        }
        console.log(eventCode, "5 - listOfSubEventUsers");

        console.log(marvelHeroes, "5 - listOfSubEventUsers");
        setActivityState((prevState) => {
          return {
            ...prevState,
            listOfSubEventUsers: {
              data: admin
                ? subEventResponse.data.response.responseData
                : marvelHeroes,
            },
          };
        });
      } else {
        setActivityState((prevState) => {
          return {
            ...prevState,
            listOfSubEventUsers: {
              data: [],
            },
          };
        });
      }
    });
  };

  const handleModalClose = () => {
    setEditPaymentObject();
    setPaymentModalStatus(false);

    if (activityState?.selectedSubEvent) {
      getSubEventUsersList(activityState?.selectedSubEvent, "WEB").then(
        (subEventResponse) => {
          seteventCode(localStorage.getItem("eventCode"));
          if (
            subEventResponse.data.mhealthResponseMessage == "SUCCESS" &&
            subEventResponse.data.response &&
            subEventResponse.data.response.responseMessage == "SUCCESS" &&
            subEventResponse.data.response.responseData
          ) {
            {
              var marvelHeroes =
                subEventResponse.data.response.responseData.filter(function (
                  hero
                ) {
                  const x =
                    hero.eventRegistrationCode ==
                    localStorage.getItem("eventCode");

                  return x;
                });
            }

            console.log(eventCode, "5 - listOfSubEventUsers");

            console.log(marvelHeroes, "5 - listOfSubEventUsers");
            setActivityState((prevState) => {
              return {
                ...prevState,

                listOfSubEventUsers: {
                  data: admin
                    ? subEventResponse.data.response.responseData
                    : marvelHeroes,
                },
              };
            });
          } else {
            setActivityState((prevState) => {
              return {
                ...prevState,
                listOfSubEventUsers: {
                  data: [],
                },
              };
            });
          }
        }
      );
    }
  };

  const renderSubEventList = () => {
    if (check == "all") {
      var subEventByTabSelection = getSubEventsByTabSelection(
        activityState.listOfSubEventsData
      );
    } else if (check == "nodata") {
      var subEventByTabSelection = getSubEventsByTabSelection([]);
    } else {
      var subEventByTabSelection = getSubEventsByTabSelection(prog);
    }
    if (subEventByTabSelection.length > 0) {
      // console.log(activityState, "activityState.selectedSubEvent");
      return (
        <>
          <ScrollableList>
            {subEventByTabSelection.map((subEventDetail) => (
              <SubEventCard
                subEventDetail={subEventDetail}
                type="manage"
                handleSubEventSelection={handleSubEventSelection}
                selectedSubEvent={activityState.selectedSubEvent}
                handleSubEventEdit={handleSubEventEdit}
              />
            ))}
          </ScrollableList>
        </>
      );
    } else {
      let list = [];
      for (let i = 0; i < 4; i++) {
        list.push(<div className="challenge-card" key={i}></div>);
      }
      return <ScrollableList>{list}</ScrollableList>;
    }
  };

  const handleToggleChange = (currTab) => {
    setTabSelection(currTab);
    let subEventByTabSelection = activityState.listOfSubEventsData.filter(
      (item) => {
        if (currTab == "current") {
          return item.timePeriod == currTab.toUpperCase();
        }
        if (currTab == "old") {
          return item.timePeriod == "PAST";
        }
        if (currTab == "upcoming") {
          return item.timePeriod == "FUTURE";
        }
      }
    );
    if (subEventByTabSelection.length > 0 && subEventByTabSelection[0]) {
      getSubEventUsersList(subEventByTabSelection[0]["id"], "WEB").then(
        (subEventResponse) => {
          seteventCode(localStorage.getItem("eventCode"));
          if (
            subEventResponse.data.mhealthResponseMessage == "SUCCESS" &&
            subEventResponse.data.response &&
            subEventResponse.data.response.responseMessage == "SUCCESS" &&
            subEventResponse.data.response.responseData
          ) {
            {
              var marvelHeroes =
                subEventResponse.data.response.responseData.filter(function (
                  hero
                ) {
                  const x =
                    hero.eventRegistrationCode ==
                    localStorage.getItem("eventCode");

                  return x;
                });
            }
            console.log(eventCode, "5 - listOfSubEventUsers");

            console.log(marvelHeroes, "5 - listOfSubEventUsers");
            setActivityState((prevState) => {
              return {
                ...prevState,
                listOfSubEventUsers: {
                  data: admin
                    ? subEventResponse.data.response.responseData
                    : marvelHeroes,
                },
                selectedSubEvent:
                  subEventByTabSelection.length > 0
                    ? subEventByTabSelection[0]["id"]
                    : undefined,
                currentSubEventObj:
                  subEventByTabSelection.length > 0
                    ? subEventByTabSelection[0]
                    : {},
              };
            });
          } else {
            setActivityState((prevState) => {
              return {
                ...prevState,
                listOfSubEventUsers: {
                  data: [],
                },
                selectedSubEvent:
                  subEventByTabSelection.length > 0
                    ? subEventByTabSelection[0]["id"]
                    : undefined,
                currentSubEventObj:
                  subEventByTabSelection.length > 0
                    ? subEventByTabSelection[0]
                    : {},
              };
            });
          }
        }
      );
    }
  };
  const condition = JSON.parse(localStorage.getItem("condition"));
  const { theme } = useContext(ThemeContext);
  return (
    <div className="Dasboard">
      <TopUserDetails />
      <Navbar />
      <div className="Main">
        <div
          className="Challenges"
          id="activities-management"
          style={{ marginBottom: "-30px" }}
        >
          <div className="display-row">
            <div className="challenges-heading" style={{ marginRight: 20 }}>
              Activities
            </div>
            <TriStateToggle
              values={["old", "current", "upcoming"]}
              selected={tabSelection}
              handleChange={(item) => handleToggleChange(item)}
            />

            {condition && condition.isAdmin === true ? (
              <div
                style={{
                  marginRight: "auto",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <PrimaryButton
                  mini
                  className="ml-3 text-sm p-0 m-0 h-8"
                  onClick={() => {
                    setCreateActivityModal(true);
                    setEditActivityObject();
                  }}
                >
                  <PlusCircle size="16" style={{ marginRight: 2 }} />
                  Create Program
                </PrimaryButton>

                <AdInstructor />
                <div>
                  <Select
                    style={{ width: "250px", marginLeft: 20 }}
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    onChange={handleEvent}
                  >
                    <MenuItem style={{ fontSize: 12 }} value="select">
                      Select
                    </MenuItem>
                    {activityState.listOfEventsData.map((curelem, index) => {
                      return (
                        <MenuItem style={{ fontSize: 12 }} value={curelem.id}>
                          {curelem.challengeName}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </div>
              </div>
            ) : (
              condition &&
              condition.isModerator === true && (
                <div style={{ marginRight: "auto", display: "flex" }}>
                  <PrimaryButton
                    mini
                    className="ml-3 text-sm p-0 m-0 h-8"
                    onClick={() => {
                      setCreateActivityModal(true);
                      setEditActivityObject();
                    }}
                  >
                    <PlusCircle
                      size="18"
                      style={{
                        marginRight: 2,
                        padding: "2px 8px",
                        borderRadius: 24,
                      }}
                    />
                    Create Program
                  </PrimaryButton>

                  <AdInstructor />
                  <div>
                    <Select
                      style={{ width: "250px", marginLeft: 20 }}
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      // open={open}
                      // onClose={handleClose}
                      // onOpen={handleOpen}
                      // value={age}
                      // onChange={handleChange}
                      onChange={handleEvent}
                    >
                      <MenuItem style={{ fontSize: 12 }} value="select">
                        Select
                      </MenuItem>
                      {activityState.listOfEventsData.map((curelem, index) => {
                        return (
                          <MenuItem style={{ fontSize: 12 }} value={curelem.id}>
                            {curelem.challengeName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </div>
                </div>
              )
            )}
          </div>
          <div style={{ width: "100%" }}>{renderSubEventList()}</div>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 40,
            height: 32,
          }}
        >
          <FullScreen id="activities-management" theme={theme} />
        </div>
        {activityState.selectedSubEvent &&
          activityState.listOfSubEventsData.length > 0 && (
            <RegisteredUsers
              defaultRegisteredUserList={activityState.listOfSubEventUsers}
              selectedSubEvent={activityState.currentSubEventObj}
              setEditPaymentObject={setEditPaymentObject}
              setPaymentModalStatus={setPaymentModalStatus}
            />
          )}
      </div>

      {createActivityModal && (
        <ActivityModal
          visible={createActivityModal}
          closeModal={() => {
            setCreateActivityModal(false);
            setEditActivityObject();
          }}
          editActivityObject={editActivityObject}
          setEditActivityObject={setEditActivityObject}
          fetchSubEvents={fetchSubEvents}
          eventsList={activityState.listOfEventsData}
        />
      )}

      {paymentModalStatus && (
        <EditPaymentDetailsModal
          visible={paymentModalStatus}
          closeModal={handleModalClose}
          editPaymentObject={editPaymentObject}
          setEditPaymentObject={setEditPaymentObject}
        />
      )}
    </div>
  );
};

export default Activities;
