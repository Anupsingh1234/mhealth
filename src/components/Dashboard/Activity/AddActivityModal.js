import React, { useEffect, useState } from "react";
import Modal from "@material-ui/core/Modal";
import CancelIcon from "@material-ui/icons/Cancel";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";

import {
  getProgramActivity,
  addProgramActivityData,
  getOldRecordingByProgram,
} from "../../../services/challengeApi";
import ReactLoadingWrapper from "../../loaders/ReactLoadingWrapper";
import ScrollableList from "../../ScrollableList";
import EventImageCard from "../../EventImageCard";
import TriStateToggle from "./TriStateToggle2";
import {
urlPrefix,
 } from "../../../services/apicollection";
 import axios from "axios";
 import moment from "moment";
 import message from "antd-message";
function formatDate(date) {
  if (!date) return "";
  var day = date.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  var month = date.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  var year = date.getFullYear();
  let formattedHours =
    `${date.getHours()}`.length == 2 ? date.getHours() : "0" + date.getHours();
  let formattedMins =
    `${date.getMinutes()}`.length == 2
      ? date.getMinutes()
      : "0" + date.getMinutes();
  let formattedDate =
    year +
    "-" +
    month +
    "-" +
    day +
    " " +
    formattedHours +
    ":" +
    formattedMins +
    ":" +
    "00";

  return formattedDate;
}

function getModalStyle() {
  return {
    position: "absolute",
    top: "50%",
    left: "50%",
    background: "#fff",
    transform: "translate(-50%, -50%)",
    outline: "none",
    padding: "15px",
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    minWidth: 300,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: "90vh",
    overflow: "scroll",
  },
}));

export default function EventInfoModal({
  modalView,
  setModalView,
  challenge,
  type,
}) {
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const [ActivityDeatils,setActivityDetails]=useState([])
  const handleClose = () => {
    setModalView({ status: false });
  };
  const [refernceUrl,setRefernceUrl]=useState([])
  console.log(refernceUrl,"url")
  const [state, setState] = useState({
    activityVisibility: "",
    activityId: "",
    actvityNote: "",
    media: "",
    mediaImg: "",
    activityStartDate: "",
    activityEndDate: "",
  });

  const [savedActivities, setSavedActivities] = useState({
    data: [],
    loading: true,
    message: "",
  });

  const [recordedData, setRecordedData] = useState({
    data: [],
    loading: true,
    message: "",
  });

  const [successMsg, setSuccessMsg] = useState();
  const [toggleView, setToggleView] = useState("Activities");

  const handleInputChange = (name, value) => {
    if(name=="activityId")
    {
      setRefernceUrl(ActivityDeatils.filter((item)=>{
      return item.id==value
    }))
  }
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  
  };
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const onFileChange = (event) => {
    if (event.target.files) {
      const { files } = event.target;
      if (files && files.length > 0) {
        getBase64(files[0]).then((res) => {
          handleInputChange("media", files[0]);
          handleInputChange("mediaImg", res);
        });
      }
    }
  };
  const getSubChallengerActivity = () => {
      
    const URL = `${urlPrefix}v1.0/getAllSubchallengerActivity?subEventId=${challenge.id}`;
    return axios
      .get(
        URL,{
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
        }
      )
      .then((res) => {
        console.log(res,'resActivity')
        setActivityDetails(res.data.response.responseData)
        // getData();
        // userRated();
        // blankStar();
        // // console.log(challenge.id);
        // localStorage.setItem("rated", challenge.id);
        // //  localStorage.setItem('rating', 4)
        // message.success("Rated succesfully ! Thank you");
      });
  };
  const disableSubmit =
    Object.values(state).filter((val) => val === "" || val === undefined)
      .length > 0;

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("media", state.media);
    const payload={
      activityVisibility: state.activityVisibility,
    activityId: state.activityId,
    actvityNote: state.actvityNote,
   activityStartDate:moment(state.activityStartDate).format("YYYY-MM-DD hh:mm:ss"),
    activityEndDate: moment(state.activityEndDate).format("YYYY-MM-DD hh:mm:ss"),
    }
    setSuccessMsg({ loading: true, msg: undefined });

    addProgramActivityData(payload,formData, challenge.id)
      .then((res) => {
        setSuccessMsg({
          loading: false,
          msg: res?.data?.response.responseMessage,
        });
        message.success(res.data.response.responseMessage)
        setModalView(false)
      })
      .catch((err) => {
        setSuccessMsg({
          loading: false,
          msg: "Something went wrong, Try Again.",
        });
      });
  };
const getActivityData=()=>{
  getProgramActivity(challenge.id).then((res) => {
    let responseData = res?.data?.response?.responseData
      ? res?.data?.response?.responseData
      : [];
    let responseMsg = res?.data?.response?.responseMessage;
    setSavedActivities({
      data: responseData,
      loading: false,
      message: responseMsg,
    });
  });
}
  useEffect(() => {
    getSubChallengerActivity()
    if (type === "view") {
      setSavedActivities({
        data: [],
        loading: true,
        message: "",
      });
      setRecordedData({
        data: [],
        loading: true,
        message: "",
      });
      getActivityData();

      getOldRecordingByProgram(challenge.id).then((res) => {
        let responseData = res?.data?.response?.responseData
          ? res?.data?.response?.responseData
          : [];
        let responseMsg = res?.data?.response?.responseMessage;
        setRecordedData({
          data: responseData,
          loading: false,
          message: responseMsg,
        });
      });
    }
    if (type === "add") {
      setSuccessMsg();
      setState({
        activityVisibility: "PRIVATE",
        activityId: "",
        actvityNote: "",
        media: "",
        mediaImg: "",
        activityStartDate: new Date(),
        activityEndDate: new Date(),
      });
    }
  }, []);
console.log(state,'state')
  const modalBody = (
    <div
      style={modalStyle}
      className={`${classes.paper} event-info-modal ${
        type == "view" ? "add-activity-modal" : ""
      }`}
    >
      <div style={{ position: "relative" }}>
        {type == "add" && (
          <div>
            <div style={{ marginBottom: 10, fontWeight: 800 }}>
              Add Activity
            </div>
            <div className="activity-doc-container">
              <div className="activity-doc-container-upload">
                {state.mediaImg !== "" ? (
                  <>
                    <div
                      className="mhealth-input-box"
                      style={{
                        maxWidth: 145,
                        maxHeight: 200,
                        backgroundPosition: "50% 50%",
                        backgroundSize: "cover",
                      }}
                    >
                      <img src={state.mediaImg} width={150} height={150} />
                    </div>
                    <button
                      style={{ margin: 10, borderRadius: 24 }}
                      className="select-supporting-doc-button"
                      onClick={() => {
                        handleInputChange("media", "");
                        handleInputChange("mediaImg", "");
                      }}
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <div className="mhealth-input-box">
                    <input
                      id="avatar-select-input"
                      className="select-avatar-input"
                      type="file"
                      onChange={(e) => {
                        onFileChange(e);
                      }}
                      style={{
                        background: "#f3f4f6",
                        padding: "6px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        width: "80%",
                      }}
                    />
                    <button
                      className="select-avatar-button"
                      style={{
                        margin: 0,
                        marginTop: "1rem",
                        height: 170,
                        borderRadius: 4,
                        borderColor: "gray",
                      }}
                      onClick={() => {
                        document.getElementById("avatar-select-input").click();
                      }}
                    >
                      Select Media
                    </button>
                  </div>
                )}
                {refernceUrl[0]&&refernceUrl[0].activityReference!==""&&(<>
                <h5>Reference Link :-</h5>
                <a href={refernceUrl[0].activityReference} target="_blank">{refernceUrl[0].activityReference}</a>
                </>)}
              </div>

              <div className="activity-doc-text-details">
                <div className="mhealth-input-box" style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 12 }}>Select Activity </label>
                  <select
                    
                    style={{
                      background: "#f3f4f6",
                      padding: "6px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      width: "90%",
                    }}
                    value={state.activityId}
                    onChange={(e) =>
                      handleInputChange("activityId", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    {ActivityDeatils&&ActivityDeatils.map((item)=>{
                      return(<>
                      <option value={item.id}>{item.activityName} ({item.activityStartDate[2]}-{item.activityStartDate[1]}-{item.activityStartDate[0]} - {item.activityEndDate[2]}-{item.activityEndDate[1]}-{item.activityEndDate[0]})</option>
                      </>)
                    })}
                    </select>
                </div>
                <div className="mhealth-input-box" style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 12 }}> Visibility</label>

                  <RadioGroup
                    aria-label="activityVisibility"
                    name="activityVisibility"
                    value={state.activityVisibility}
                    onChange={(e) => {
                      handleInputChange("activityVisibility", e.target.value);
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <FormControlLabel
                      value="PUBLIC"
                      control={<Radio />}
                      label="Public"
                      style={{ width: "auto" }}
                    />
                    <FormControlLabel
                      value="PRIVATE"
                      control={<Radio />}
                      label="Private"
                      style={{ width: "auto" }}
                    />
                  </RadioGroup>
                </div>
                <div className="mhealth-input-box" style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 12 }}> Activity Note</label>

                  <TextField
                    id="standard-basic"
                    placeholder="Enter text"
                    style={{
                      width: "90%",
                      background: "#f3f4f6",
                      padding: "6px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                    variant="outlined"
                    multiline
                    value={state.actvityNote}
                    onChange={(e) =>
                      handleInputChange("actvityNote", e.target.value)
                    }
                    className="event-text-field"
                  />
                </div>

                <div className="mhealth-input-box">
                  <div>
                    <label
                      style={{ width: "100%", fontSize: 12, marginBottom: 10 }}
                    >
                      Activity Date (YYYY-MM-DD)
                    </label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: 12, width: 30 }}>Start:</span>

                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                        autoOk
                          variant="inline"
                          value={state.activityStartDate ?? ""}
                          onChange={(date) => {
                            handleInputChange("activityStartDate", date);
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: 12, width: 30 }}> End:</span>

                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                         autoOk
                          variant="inline"
                          value={state.activityEndDate ?? ""}
                          onChange={(date) => {
                            handleInputChange("activityEndDate", date);
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="mhealth-input-box"
              style={{
                width: "100%",
                marginTop: 40,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {successMsg?.loading ? (
                <div className="loader">
                  <ReactLoadingWrapper
                    color={"#518ad6"}
                    height={"10%"}
                    width={"25px"}
                    type={"spin"}
                  />
                </div>
              ) : successMsg?.msg ? (
                <div style={{ width: "max-content" }}>{successMsg?.msg}</div>
              ) : (
                <button
                  className={disableSubmit ? "is-disabled" : "is-success"}
                  onClick={handleSubmit}
                  disabled={disableSubmit}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        )}

        {type == "view" && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div style={{ marginRight: 10, fontWeight: 800 }}>
                View {toggleView}
              </div>
              <TriStateToggle
                values={["Activities", "Recordings"]}
                selected={toggleView}
                handleChange={(value) => setToggleView(value)}
              />
            </div>

            {toggleView == "Activities" ? (
              <div className="event-image-list-wrapper">
                {savedActivities?.loading ? (
                  <ScrollableList>
                    <div className="event-image-card"></div>
                    <div className="event-image-card"></div>
                    <div className="event-image-card"></div>
                    <div className="event-image-card"></div>
                  </ScrollableList>
                ) : savedActivities.data.length > 0 ? (
                  <ScrollableList scrollSource="event-gallery">
                    {savedActivities.data.map((item, index) => {
                      return (
                        <EventImageCard
                          data={item}
                          key={index}
                          type="program"
                          getActivityData={getActivityData}
                        />
                      );
                    })}
                  </ScrollableList>
                ) : (
                  <p
                    style={{
                      textAlign: "center",
                      margin: "100px 0",
                      color: "#8e8e8e",
                    }}
                  >
                    {savedActivities.message === "SUCCESS"
                      ? "Data is not present"
                      : savedActivities.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="event-image-list-wrapper">
                {recordedData?.loading ? (
                  <ScrollableList>
                    <div className="event-image-card"></div>
                    <div className="event-image-card"></div>
                    <div className="event-image-card"></div>
                    <div className="event-image-card"></div>
                  </ScrollableList>
                ) : recordedData.data.length > 0 ? (
                  <ScrollableList scrollSource="event-gallery">
                    {recordedData.data.map((item, index) => {
                      return (
                        <EventImageCard
                          data={{
                            activityLink: item.activityLink,
                            activityNotes: item.activityNotes,
                            activitySubmitDate: item.activityDate,
                          }}
                          key={index}
                          type="record"
                         
                          
                        />
                      );
                    })}
                  </ScrollableList>
                ) : (
                  <p
                    style={{
                      textAlign: "center",
                      margin: "100px 0",
                      color: "#8e8e8e",
                    }}
                  >
                    {recordedData.message === "SUCCESS"
                      ? "Data is not present"
                      : recordedData.message}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <CancelIcon
        style={{
          position: "absolute",
          top: 5,
          right: 5,
          color: "#ef5350",
          cursor: "pointer",
        }}
        onClick={() => handleClose()}
      />
    </div>
  );

  return (
    <div>
      <Modal
        open={modalView}
        onClose={() => {
          handleClose();
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        disableAutoFocus
      >
        <div style={{ outline: "none" }}>{modalBody}</div>
      </Modal>
    </div>
  );
}
