import React, { useState, useEffect, useContext } from "react";
import { PlusCircle } from "react-feather";

import { getOldEvents } from "../../services/challengeApi";
import Navbar from "../Navbar";
import TopUserDetails from "../TopUserDetails";
import ScrollableList from "../ScrollableList";
import Message from "antd-message";
import RegisteredUserTable from "./RegisteredUserTable";
import { getUserDetailsByEventID } from "../../services/challengeApi";
import TriStateToggle from "../toggle/TriStateToggle";
import EventManagementCard from "./EventManagementCard";
import CreateEventModal from "./CreateEventModal";
import FullScreen from "../Utility/FullScreen";
import ThemeContext from "../../context/ThemeContext";
import { PrimaryButton } from "../Form";
import InfoDialog from "../Utility/InfoDialog";
import CancelIcon from "@material-ui/icons/Cancel";
import message from "antd-message";
import { urlPrefix } from "../../services/apicollection";
import axios from "axios";
const EventManagement = () => {
  const { theme } = useContext(ThemeContext);
  const [eventList, setEventList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [registeredUserList, setRegisteredUserList] = useState({
    data: [],
    message: "",
    loading: false,
  });
  const [currentSwitchSelection, setCurrentSwitchSelection] =
    useState("current");
  const [createEventModal, setCreateEventModal] = useState(false);
  const [editEventObject, setEditEventObject] = useState();
  const [importDataModal,setImportDataModal]=useState(false)
  const [state, setState] = useState({
 
    media: "",
    mediaImg: "",
   
  })
  const getUserDetailsWrapper = (currentEvent) => {
    setSelectedEvent(currentEvent);
    setRegisteredUserList({
      loading: true,
      message: "",
      data: [],
    });
    getUserDetailsByEventID(currentEvent)
      .then((res) => {
        if (res.data.response.responseCode === 0) {
          setRegisteredUserList({
            loading: false,
            message: res.data.response.responseMessage,
            data: res.data.response.responseData,
          });
        } else {
          setRegisteredUserList({
            loading: false,
            message: res.data.response.responseMessage,
            data: [],
          });
        }
      })
      .catch((err) => {
        setRegisteredUserList({
          loading: false,
          message: "",
          data: [],
        });
      });
  };
 

  const onFileChange = (e) => {
    let files = e.target.files;
    let render = new FileReader();
    const img = e.target.files[0].name;
    const type=e.target.files[0].type;
    console.log(type,selectedEvent,'type')
    const formData = new FormData();
    render.readAsDataURL(files[0]);
    formData.append("multipartFile",files[0]);
    formData.append("clientId",4);
    formData.append("eventId",selectedEvent.id);
    render.onload = (e) => {
      
      if(type=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
      const adminurl = `${urlPrefix}v1.0/saveExcelData`;
      return axios.post(adminurl, formData,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            timeStamp: "timestamp",
            Accept: '*/*',
            "Content-type": "multipart/form-data",
            
          },
        })
        .then((res) => {
          if (res.data.response.responseMessage == "SUCCESS") {
            message.success(res.data.response.responseMessage)
          }
          else{
            message.error(res.data.response.responseMessage)
          }
        }).catch((err)=>{
          console.log(err,'err')
        })
      }else{
        message.error("Only Excel File Upload Here !")
      }
    };
  };
  const handleEventEdit = (editObject) => {
    setEditEventObject(editObject);
    setCreateEventModal(true);
  };

  const initialFetchEvents = () => {
    window.message = Message;
    getOldEvents().then((res) => {
      if (res.data.response.responseCode === 0) {
        if (
          res.data.response.responseData &&
          res.data.response.responseData.events
        ) {
          setEventList(res.data.response.responseData.events);
        }
        if (
          res.data.response.responseData.events &&
          res.data.response.responseData.events[0]
        ) {
          let zerothUpcomingEvent =
            res.data.response.responseData.events.filter((item) => {
              return item.isActive == 1 && item.timePeriod === "CURRENT";
            })[0];

          if (zerothUpcomingEvent) {
            getUserDetailsWrapper(zerothUpcomingEvent);
          }
        }
      } else {
        setEventList([]);
      }
    });
  };

  useEffect(() => {
    initialFetchEvents();
  }, []);

  const displayListOfChallenges = (type) => {
    let list = [];

    let currentEventsList =
      currentSwitchSelection === "old"
        ? eventList.filter((item) => {
            return item.isActive == 0;
          })
        : currentSwitchSelection === "upcoming"
        ? eventList.filter((item) => {
            return item.isActive == 1 && item.timePeriod === "FUTURE";
          })
        : eventList.filter((item) => {
            return item.isActive == 1 && item.timePeriod === "CURRENT";
          });

    if (currentEventsList && currentEventsList.length > 0) {
      list = currentEventsList.map((challenge) => (
        <EventManagementCard
          challenge={challenge}
          getUserDetailsWrapper={getUserDetailsWrapper}
          selectedEvent={selectedEvent}
          key={challenge.id}
          handleEventEdit={handleEventEdit}
        />
      ));
    } else {
      for (let i = 0; i < 4; i++) {
        list.push(<div className="challenge-card" key={i}></div>);
      }
    }
    if (list.length === 0) {
      for (let i = 0; i < 4; i++) {
        list.push(<div className="challenge-card" key={i}></div>);
      }
    }
    return list;
  };
  return (
    <>
      <div style={{ minHeight: "100vh", width: "100vw", background: "#fff" }}>
        <TopUserDetails />
        <Navbar />

        <div className="Main">
          <div className="Challenges">
            <div className="event-list" id="event-list">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div className="challenges-heading" style={{ marginRight: 20 }}>
                  Events
                </div>
                <TriStateToggle
                  values={["old", "current", "upcoming"]}
                  selected={currentSwitchSelection}
                  handleChange={(value) => setCurrentSwitchSelection(value)}
                />
                {localStorage.getItem("role") &&
                  localStorage.getItem("role") !== "Customer" && (
                    <div style={{ marginRight: "auto" }}>
                      <PrimaryButton
                        mini
                        className="ml-3 text-sm"
                        onClick={() => {
                          setCreateEventModal(true);
                          setEditEventObject();
                        }}
                        style={{ width: "max-content" }}
                      >
                        <PlusCircle size="18" style={{ marginRight: 2 }} />
                        Create Event
                      </PrimaryButton>
                    </div>
                  )}
              </div>
              <ScrollableList>{displayListOfChallenges()}</ScrollableList>
            </div>
            <div
              className="d-flex j-c-sp-btn cursor-pointer"
              style={{ margin: "2em 0" }}
            >
              <div style={{ marginRight: "auto" }}>
              <input
                      id="avatar-select-excel"
                      className="select-avatar-input"
                      type="file"
                      onChange={onFileChange}
                      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      style={{
                        background: "#f3f4f6",
                        padding: "6px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        width: "80%",
                        display:'none'
                      }}
                    
                    />
                      <PrimaryButton
                        mini
                        className="ml-3 text-sm"
                        onClick={() => {
                          document.getElementById("avatar-select-excel").click();
                        }}
                        style={{ width: "max-content" }}
                      >
                      
                        Import Data
                      </PrimaryButton>
                    </div>
              <div className="challenges-heading">List of Participants</div>
              <FullScreen id="event-list" theme={theme} />
            </div>

            <RegisteredUserTable
              defaultRegisteredUserList={registeredUserList}
              selectedEvent={selectedEvent}
            />
          </div>
        </div>
      </div>

      {createEventModal && (
        <CreateEventModal
          createEventModal={createEventModal}
          setCreateEventModal={setCreateEventModal}
          setEditEventObject={setEditEventObject}
          editEventObject={editEventObject}
          initialFetchEvents={initialFetchEvents}
          eventsList={eventList}
        />
      )}
          </>
  );
};

export default EventManagement;
