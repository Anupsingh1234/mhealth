import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import DatePicker from "../DatePicker";
import CancelIcon from "@material-ui/icons/Cancel";
import { checkForFalsy } from "../../utils/commonFunctions";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import { PlusCircle, Copy, Bold, Plus } from "react-feather";
import InfoDialog from "../Utility/InfoDialog";
import {
  urlPrefix,
  getAllMobile,
  postChallenge,
} from "../../services/apicollection";
import Message from "antd-message";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";

import {
  createOrUpdateEvent,
  postEventImages,
} from "../../services/challengeApi";
import { baseUrl } from "../../services/apicollection";

import ReactLoadingWrapper from "../../components/loaders/ReactLoadingWrapper";
import { tsUndefinedKeyword } from "@babel/types";

function getModalStyle() {
  const top = 65;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "90%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    outline: "none",
    maxHeight: 1200,
    marginLeft: "195px",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const returnTransformedDate = (date) => {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};
const CreateEventModal = ({
  createEventModal,
  setCreateEventModal,
  setEditEventObject,
  editEventObject,
  initialFetchEvents,
  eventsList,
}) => {
  console.log(editEventObject?.id);
  const [loading, setLoading] = useState(false);
  const [eventObject, setEventObject] = useState({
    challengeName: undefined,
    challengeType: undefined,
    description: undefined,
    eligibility: undefined,
    rules: undefined,
    rewards: undefined,
    registrationStartDate: returnTransformedDate(Date.now()),
    registrationEndDate: returnTransformedDate(Date.now()),
    challengeStartDate: returnTransformedDate(Date.now()),
    challengeEndDate: returnTransformedDate(Date.now()),
    targetDays: undefined,
    targetDistance: undefined,
    registrationCode: undefined,
    eventView: "PUBLIC",
    moderator: 191,
    eventType: undefined,
    termAndCondition: undefined,
    datasourceChangeCount: undefined,
    dailyMinKm: undefined,
    dailyMaxKm: undefined,
    registrationFees: undefined,
    pinnedUserCount: undefined,
    linkedEvents: undefined,
    teamBuild: undefined,
    maxTeamMember: undefined,
    totalTeam: undefined,
    whitelabelKeyword: undefined,
    verificationRequired: undefined,
    forum: "NONE",
    buttonBGColor: null,
    buttonTextColor: null,
    primaryColor: null,
    secondaryColor: null,
    leaderboardRange: null,

    // subDomains: undefined,
  });
  // console.log(gmailList);
  // {editEventObject}
  //
  // var editone=[]
  // console.log(editgmail && editgmail[1]);
  console.log(eventObject);

  // console.log(eventObject.subDomains, 'setobject');
  const [mediaObj, setMediaObj] = useState({
    challengeBanner: undefined,
    eventLogo: undefined,
    sponsorLogo: undefined,
  });

  const [inputgmail, setInputGmail] = useState("");
  console.log(inputgmail, "inputgmail");

  const [gmailList, setGmailList] = useState([]);

  console.log((inputgmail.match(/[.]/gi) || []).length < 3);
  console.log(
    /^[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gi.test(inputgmail.toString())
  );
  const AddGmail = () => {
    if (
      inputgmail !== "" &&
      /[.]/gi.test(inputgmail.toString()) === true &&
      /[@]/gi.test(inputgmail.toString()) === false &&
      /[!]/gi.test(inputgmail.toString()) === false &&
      ('"' + inputgmail + '"').search(
        /[.][.]/i || /[.][A-Z][.]/i || /[A-Z][!][A-Z]/i
      ) === -1 &&
      (inputgmail.match(/[.]/gi) || []).length < 3 &&
      /^[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gi.test(inputgmail.toString())
    ) {
      setGmailList([...gmailList, inputgmail]);
      setRegMessage({
        type: "error",
        msg: "",
      });
      // setEventObject
      setInputGmail("");
    } else {
      setRegMessage({
        type: "error",
        msg: "Email Domains,invalid input",
      });
    }
  };

  // const editgmail = editEventObject.subDomains;

  // console.log(eventObject.subDomains, 'gmaillist');
  useEffect(() => {
    if (editEventObject) {
      let newObj = {
        buttonBGColor: editEventObject.buttonBGColor,
        buttonTextColor: editEventObject.buttonTextColor,
        primaryColor: editEventObject.primaryColor,
        secondaryColor: editEventObject.secondaryColor,
        leaderboardRange: editEventObject.leaderboardRange,
        verificationRequired: editEventObject.verificationRequired,
        forum: editEventObject.forum,
        whitelabelKeyword: editEventObject.whitelabelKeyword,
        challengeName: editEventObject.challengeName,
        challengeType: editEventObject.challengeType,
        description: editEventObject.description,
        eligibility: editEventObject.eligibility,
        rules: editEventObject.rules,
        rewards: editEventObject.rewards,

        registrationStartDate:
          editEventObject.registrationStartDate?.split(" ")[0],
        registrationEndDate: editEventObject.registrationEndDate?.split(" ")[0],
        challengeStartDate: editEventObject.challengeStartDate?.split(" ")[0],
        challengeEndDate: editEventObject.challengeEndDate?.split(" ")[0],
        targetDays: editEventObject.targetDays,
        targetDistance: editEventObject.targetDistance,
        registrationCode: editEventObject.registrationCode,
        eventView: editEventObject.eventView,
        moderator: 191,
        eventType: editEventObject.eventType,
        termAndCondition: editEventObject.termAndCondition,
        datasourceChangeCount: editEventObject.datasourceChangeCount,
        dailyMinKm: editEventObject.dailyMinKm,
        dailyMaxKm: editEventObject.dailyMaxKm,
        registrationFees: editEventObject.registrationFees,
        pinnedUserCount: editEventObject.pinnedUserCount,
        moderatorName: editEventObject.moderatorName,
        teamBuild: editEventObject.teamBuild,
        maxTeamMember: editEventObject.maxTeamMember,
        totalTeam: editEventObject.totalTeam,
        dataCompile: editEventObject.dataCompile,
        sponsorText: editEventObject.sponsorText,
        subDomains: editEventObject.subDomains,
      };
      if (editEventObject.eventView === "LINKED") {
        newObj["linkedEvents"] =
          editEventObject.linkedEvents &&
          Array.isArray(editEventObject.linkedEvents)
            ? editEventObject.linkedEvents.map((item) => {
                if (eventsList.filter((elm) => elm.id == item)[0]) {
                  return eventsList.filter((elm) => elm.id == item)[0][
                    "challengeName"
                  ];
                }
              })
            : [];
      }

      // if (editEventObject.subDomains && eventObject.subDomains) {
      //   newObj['subDomains'] =
      //     editEventObject.subDomains &&
      //     Array.isArray(editEventObject.subDomains)
      //       ? editEventObject.subDomains.map((item) => {
      //           console.log(item, 'itemlist');
      //         })
      //       : [];
      // }

      setEventObject(newObj);
      setMediaObj({
        challengeBanner: editEventObject.challegeBanner,
        eventLogo: editEventObject.eventLogo,
        sponsorLogo: editEventObject.sponsorLogo,
      });
    }
  }, []);

  // if (eventObject.verificationRequired === 0) {
  //   setGmailList([]);
  // }

  console.log(gmailList, "object");
  const bannerInputRef = React.createRef();
  const sponsorLogoInputRef = React.createRef();
  const eventLogoInputRef = React.createRef();

  const handleInputChange = (name, value) => {
    setEventObject((prevState) => {
      console.log(prevState);
      return { ...prevState, [name]: value };
    });
  };

  const [editgmail, setEditGmail] = useState(
    editEventObject ? editEventObject.subDomains : ""
  );

  // console.log(editEventObject.subDomains);
  const handleInputSubDomainChange = (name, value, index) => {
    let UpdatedValue = editEventObject.subDomains;
    UpdatedValue[index] = value;
    console.log("updatedvalue", UpdatedValue);
    setEventObject((prevState) => {
      console.log(prevState);
      return { ...prevState, [name]: UpdatedValue };
    });
  };
  const [editinputgmail, setEditInputGmail] = useState("");
  console.log(inputgmail, "inputgmail");

  const [editgmailList, setEditGmailList] = useState([]);
  // console.log([...editgmail ,...editgmailList], 'editgmail');
  // console.log(inputgmail.match('/./'));
  const EditAddGmail = () => {
    if (
      editinputgmail !== "" &&
      /[.]/gi.test(editinputgmail.toString()) === true &&
      /[@]/gi.test(editinputgmail.toString()) === false &&
      /[!]/gi.test(editinputgmail.toString()) === false &&
      ('"' + editinputgmail + '"').search(
        /[.][.]/i || /[.][A-Z][.]/i || /[A-Z][!][A-Z]/i
      ) === -1 &&
      (editinputgmail.match(/[.]/gi) || []).length < 3 &&
      /^[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gi.test(editinputgmail.toString())
    ) {
      setEditGmailList([...editgmailList, editinputgmail]);

      // setEventObject
      setEditInputGmail("");
    } else {
      setRegMessage({
        type: "error",
        msg: "Email Domains,invalid input",
      });
    }
  };

  const finaleditgmail =
    editgmail && editgmail.length > 0
      ? [...editgmail, ...editgmailList]
      : [...editgmailList];
  const findvalue = [];
  {
    finaleditgmail.length > 0 &&
      finaleditgmail.map((item) => {
        if (item !== "") {
          findvalue.push(item);
        }
      });
  }
  console.log(finaleditgmail, findvalue, "findvalue");
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [modId, setmodId] = useState(
    editEventObject ? editEventObject.moderatorId : ""
  );
  const [errorObj, setErrorObj] = useState({});
  const [activeStep, setActiveStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [eventCreated, setEventCreated] = useState(false);

  const getDisableStatus = () => {
    let disabled = false;
    if (activeStep == 1) {
      let checkObject = { ...eventObject };

      if (eventObject.eventView !== "LINKED") {
        delete checkObject["linkedEvents"];
      }

      disabled =
        Object.values(checkObject).includes(undefined) ||
        Object.values(checkObject).includes("");
    }

    if (activeStep == 2) {
      disabled =
        Object.values(mediaObj).includes(undefined) ||
        Object.values(mediaObj).includes("");
    }
    return disabled;
  };

  const [regMessage, setRegMessage] = useState({
    type: "error",
    msg: "",
  });

  const handleSubmit = () => {
    if (!getDisableStatus()) {
      setLoading(true);
      if (activeStep == 1) {
        let payload = {};
        payload = {
          // subDomains:gmailList,
          ...eventObject,
          datasourceChangeCount: parseInt(eventObject.datasourceChangeCount),
          targetDays: parseInt(eventObject.targetDays),
          targetDistance: parseFloat(eventObject.targetDistance),
          dailyMaxKm: parseFloat(eventObject.dailyMaxKm),
          dailyMinKm: parseFloat(eventObject.dailyMinKm),
          registrationFees: parseFloat(eventObject.registrationFees),
          moderator: parseFloat(modId),
          id: "null",
          sponsorLink: "null",
          subDomains: [...gmailList],
        };
        // if(eventObject.verificationRequired==1)
        // {
        //   payload = {

        //   };
        // }

        // payload["subDomains"]=gmailList;
        if (eventObject.eventView === "LINKED") {
          payload["linkedEvents"] = eventObject.linkedEvents.map((item) => {
            return eventsList.filter(
              (elm) =>
                elm.isActive == 1 &&
                elm.timePeriod !== "PAST" &&
                elm.challengeName == item
            )[0]["id"];
          });
        }

        if (editEventObject?.id) {
          payload["id"] = editEventObject?.id;
          payload["sponsorLink"] = editEventObject?.sponsorLink;

          // payload = {
          //   subDomains: [...gmailList],
          // };
          payload["subDomains"] = [...findvalue];
        }
        console.log(payload);
        createOrUpdateEvent(payload)
          .then((res) => {
            setLoading(false);
            if (
              res.data.mhealthResponseMessage == "SUCCESS" &&
              res.data.response &&
              res.data.response.responseMessage ==
                "Successfully Registered in Event" &&
              res.data.response.responseData
            ) {
              setRegMessage({
                type: "success",
                msg: res.data.response.responseMessage,
              });
              setEventCreated(true);
              setActiveStep(2);
              if (!payload?.id) {
                let newPayload = {
                  ...payload,
                  id: res.data.response.responseData?.id,
                };

                if (payload.eventView === "LINKED") {
                  newPayload["linkedEvents"] = payload.linkedEvents.map(
                    (item) => {
                      return eventsList.filter((elm) => elm.id == item)[0][
                        "challengeName"
                      ];
                    }
                  );
                }
                setEditEventObject(newPayload);
              }
            } else {
              setRegMessage({
                type: "error",
                msg: res.data.response.responseMessage,
              });
            }
            initialFetchEvents();
          })
          .catch((err) => {
            setLoading(false);
            setRegMessage({
              type: "error",
              msg: "Event cant be configured",
            });
          });
      }

      if (activeStep == 2) {
        let formData = new FormData();
        Object.entries(mediaObj).map((item) => {
          formData.append(item[0], item[1]);
        });
        postEventImages(formData, editEventObject?.id)
          .then((res) => {
            setLoading(false);
            if (
              res.data.mhealthResponseMessage == "SUCCESS" &&
              res.data.response &&
              res.data.response.responseMessage == "SUCCESS" &&
              res.data.response.responseData
            ) {
              setRegMessage({
                type: "success",
                msg: res.data.response.responseMessage,
              });
            } else {
              setRegMessage({
                type: "error",
                msg: res.data.response.responseMessage,
              });
            }
            initialFetchEvents();
          })
          .catch((err) => {
            setLoading(false);
            setRegMessage({
              type: "error",
              msg: "Images updation failed",
            });
          });
      }
    } else {
      let newErrorObj = {};
      Object.entries(eventObject).map((item) => {
        if (!item[1]) {
          newErrorObj[item[0]] = true;
        }
      });

      Object.entries(mediaObj).map((item) => {
        if (!item[1]) {
          newErrorObj[item[0]] = true;
        }
      });
      setErrorObj(newErrorObj);
    }
  };

  //NEW CODE ADDED HERE

  //MODERATOR BUTTON

  const [btn, setbtn] = useState("Set ");
  //MODERATOR CODE
  const [mobValue, setmobValue] = useState("");
  const [Reg, setReg] = useState("");
  const getres = async () => {
    const url = `${urlPrefix}${getAllMobile}?phoneNumber=${mobValue}`;
    const x = await fetch(url, {
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
    });
    const datares = await x.json();
    //  const len = (datares.response.responseData.length - 1 );

    const arr = datares.response.responseData;

    var marvelHeroes = arr.filter(function (hero) {
      const x = hero.mobileNumber == mobValue;
      return x;
    });

    if (marvelHeroes == 0) {
      setReg("Invalid phone number");
    } else {
      setReg(marvelHeroes[0].firstName + " " + marvelHeroes[0].lastName);
      window.value = marvelHeroes[0].id;
      setmodId(marvelHeroes[0].id);
    }
  };

  const moderateSet = () => {
    setUnsubModal(false);
    setbtn("Change");
    // console.log(typeof(modId))
  };

  const setModerator = (e) => {
    setmobValue(e.target.value);
  };
  useEffect(() => {
    if (mobValue.length == 10) {
      getres();
    }
  }, [mobValue]);
  const [modalView, setModalView] = useState(false);
  const [registerModalView, setRegisterModalView] = useState(false);
  const [showUnsubscribeModal, setUnsubModal] = useState(false);

  // NEW CODE ENDED HERE

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div>
        <InfoDialog
          handleClose={() => setUnsubModal(false)}
          open={showUnsubscribeModal}
          title="Enter mobile number"
        >
          <div class="main_div p-5">
            <div className="event-unsubscribe-modal pl-4 pr-4">
              <input
                type="text"
                maxLength="10"
                onChange={setModerator}
                style={{
                  height: "20px",
                  textAlign: "center",
                  fontSize: "15px",
                }}
                className="forn-control p-4"
                placeholder="Enter mobile number"
              />
            </div>
            <div>
              <p style={{ display: "flex", justifyContent: "center" }}>
                {" "}
                {Reg}{" "}
              </p>{" "}
            </div>

            <div className="event-unsubscribe-modal">
              <button
                className="is-success"
                onClick={moderateSet}
                style={{
                  background: "#F43F5E",
                  padding: "2px 10px",
                  width: "max-content",
                }}
              >
                Set Moderator
              </button>
            </div>
          </div>
        </InfoDialog>

        <div
          className="heading"
          style={{
            marginTop: 0,
            fontSize: 18,
            display: "flex",
            alignItems: "center",
          }}
        >
          Create Event {">"}
          <Stepper activeStep={activeStep} style={{ padding: 0 }}>
            <Step
              key={1}
              onClick={() => setActiveStep(1)}
              style={{ cursor: "pointer" }}
            >
              <StepLabel>Details</StepLabel>
            </Step>
            <Step
              key={2}
              onClick={() => {
                if (editEventObject?.id) {
                  setActiveStep(2);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <StepLabel>Event Media</StepLabel>
            </Step>
          </Stepper>
          {eventCreated || editEventObject?.id ? (
            <div
              style={{
                marginLeft: "auto",
                marginRight: 50,
                fontSize: 12,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  marginLeft: "auto",
                  marginRight: 50,
                  fontSize: 12,
                  display: "flex",
                }}
              >
                <Copy
                  size="12"
                  style={{ marginRight: 5, cursor: "pointer" }}
                  onClick={(e) => {
                    navigator.clipboard.writeText(
                      `${baseUrl}token=${window.btoa(
                        eventObject.registrationCode
                      )}`
                    );
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                    }, 1000);
                  }}
                />
                <span>
                  {baseUrl}token=
                  {window.btoa(eventObject.registrationCode)}
                </span>
              </div>
              {copied && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 400,
                    marginLeft: "auto",
                    marginRight: 50,
                    color: "green",
                  }}
                >
                  Copied!
                </span>
              )}
            </div>
          ) : null}
        </div>
        <div
          className="basic-info-container"
          style={{ overflowY: "scroll", maxHeight: 1500 }}
        >
          <div className="basic-info register-form">
            {activeStep == 1 && (
              <>
                <div
                  className="mhealth-input-box padding-025em"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "50%", display: "flex" }}>
                    <div style={{ width: "50%" }}>
                      <div>
                        <label
                          style={{
                            fontSize: 12,
                          }}
                        >
                          Event Name
                        </label>
                        {errorObj.challengeName &&
                        eventObject.challengeName === undefined ? (
                          <p className="error-text">Please input</p>
                        ) : (
                          ""
                        )}
                      </div>
                      <input
                        style={{
                          background: "#f3f4f6",
                          padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "85%",
                          border:
                            errorObj.challengeName &&
                            eventObject.challengeName === undefined
                              ? "1px solid red"
                              : 0,
                        }}
                        maxLength="30"
                        placeholder="Enter event name"
                        value={
                          checkForFalsy(eventObject.challengeName)
                            ? ""
                            : eventObject.challengeName
                        }
                        onChange={(e) =>
                          handleInputChange("challengeName", e.target.value)
                        }
                      />
                    </div>
                    <div style={{ width: "50%" }}>
                      <div>
                        <label style={{ fontSize: 12 }}>Event Category</label>
                        {errorObj.challengeType &&
                        eventObject.challengeType === undefined ? (
                          <p className="error-text">Please select</p>
                        ) : (
                          ""
                        )}
                      </div>
                      <select
                        name="type"
                        value={eventObject.challengeType}
                        style={{
                          background: "#f3f4f6",
                          padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "90%",
                          border:
                            errorObj.challengeType &&
                            eventObject.challengeType === undefined
                              ? "1px solid red"
                              : 0,
                        }}
                        onChange={(e) => {
                          handleInputChange("challengeType", e.target.value);
                        }}
                      >
                        <option value={undefined}>Select event category</option>
                        <option value="WALKING">Walking</option>
                        <option value="RUNNING">Running</option>
                        <option value="CYCLING">Cycling</option>
                        <option value="BIKING">Biking</option>
                        <option value="HIKING">Hiking</option>
                        <option value="SWIMMING">Swimming</option>
                        <option value="COOKING">Cooking</option>
                        <option value="ARTICLE">Article</option>
                      </select>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "50%",
                      display: "flex",
                      // marginLeft:"50px"
                    }}
                  >
                    <div style={{ width: "50%" }}>
                      <div>
                        <label style={{ fontSize: 12 }}>Target Distance</label>
                        {errorObj.targetDistance &&
                        eventObject.targetDistance === undefined ? (
                          <p className="error-text">Please input</p>
                        ) : (
                          ""
                        )}
                      </div>
                      <input
                        type="number"
                        style={{
                          border:
                            errorObj.emailId &&
                            eventObject.emailId === undefined
                              ? "1px solid red"
                              : 0,
                          background: "#f3f4f6",
                          padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "85%",
                        }}
                        placeholder="Enter target distance"
                        value={
                          checkForFalsy(eventObject.targetDistance)
                            ? ""
                            : eventObject.targetDistance
                        }
                        onChange={(e) =>
                          handleInputChange("targetDistance", e.target.value)
                        }
                      />
                    </div>
                    <div style={{ width: "50%" }}>
                      <div>
                        <label style={{ fontSize: 12 }}>Target Days</label>
                        {errorObj.targetDays &&
                        eventObject.targetDays === undefined ? (
                          <p className="error-text">Please input</p>
                        ) : (
                          ""
                        )}
                      </div>
                      <input
                        type="number"
                        style={{
                          border:
                            errorObj.emailId &&
                            eventObject.emailId === undefined
                              ? "1px solid red"
                              : 0,
                          background: "#f3f4f6",
                          padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "90%",
                        }}
                        placeholder="Enter target days"
                        value={
                          checkForFalsy(eventObject.targetDays)
                            ? ""
                            : eventObject.targetDays
                        }
                        onChange={(e) =>
                          handleInputChange("targetDays", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="mhealth-input-box padding-025em"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "50%", display: "flex" }}>
                    <div>
                      <div>
                        <label style={{ fontSize: 12 }}>
                          Registration Date (YYYY-MM-DD)
                        </label>
                        <div style={{ width: "50%" }}>
                          <span
                            style={{
                              display: "flex",
                              // alignItems: "center",
                              width: "85%",
                            }}
                          >
                            Start:
                            <DatePicker
                              placeholder="Enter event start date"
                              disabled={false}
                              disablePast={editEventObject ? false : true}
                              value={
                                checkForFalsy(eventObject.registrationStartDate)
                                  ? ""
                                  : eventObject.registrationStartDate
                              }
                              onChange={(e) =>
                                handleInputChange("registrationStartDate", e)
                              }
                              outlineVariantDisable={true}
                            />
                          </span>
                        </div>
                        <div style={{ width: "50%" }}>
                          <span
                            style={{
                              marginLeft: 290,
                              marginTop: -30,
                              display: "flex",
                              // alignItems: "center",
                              width: "90%",
                            }}
                          >
                            End:
                            <DatePicker
                              placeholder="Enter event start date"
                              disabled={false}
                              disablePast={editEventObject ? false : true}
                              value={
                                checkForFalsy(eventObject.registrationEndDate)
                                  ? ""
                                  : eventObject.registrationEndDate
                              }
                              onChange={(e) =>
                                handleInputChange("registrationEndDate", e)
                              }
                              outlineVariantDisable={true}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ width: "50%" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ width: "50%" }}>
                        <div>
                          <label style={{ fontSize: 12 }}>Privacy</label>
                          {errorObj.eventView && (
                            <p className="error-text">Please input</p>
                          )}
                        </div>

                        <RadioGroup
                          aria-label="eventView"
                          name="eventView"
                          value={
                            checkForFalsy(eventObject.eventView)
                              ? ""
                              : eventObject.eventView
                          }
                          onChange={(e) => {
                            handleInputChange("eventView", e.target.value);
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
                          />
                          <FormControlLabel
                            value="PRIVATE"
                            control={<Radio />}
                            label="Private"
                          />
                          <FormControlLabel
                            value="LINKED"
                            control={<Radio />}
                            label="Linked"
                          />
                        </RadioGroup>
                      </div>
                      {eventObject.eventView === "LINKED" && (
                        <div
                          style={{
                            width: "43%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <label style={{ width: "100%", fontSize: 12 }}>
                            Link Events
                          </label>
                          <Select
                            labelId="demo-mutiple-chip-label"
                            id="demo-mutiple-chip"
                            multiple
                            value={
                              eventObject.linkedEvents
                                ? eventObject.linkedEvents
                                : []
                            }
                            onChange={(event) => {
                              handleInputChange(
                                "linkedEvents",
                                event.target.value.length > 0
                                  ? event.target.value
                                  : undefined
                              );
                            }}
                            input={<Input id="select-multiple-chip" />}
                            renderValue={(selected) => (
                              <div className={classes.chips}>
                                {selected.map((value) => (
                                  <Chip
                                    key={value}
                                    label={value}
                                    className={classes.chip}
                                  />
                                ))}
                              </div>
                            )}
                            MenuProps={MenuProps}
                          >
                            {eventsList
                              .filter(
                                (item) =>
                                  item.isActive == 1 &&
                                  item.timePeriod !== "PAST"
                              )
                              .map((currEvent, index) => (
                                <MenuItem
                                  key={index}
                                  value={currEvent.challengeName}
                                >
                                  {currEvent.challengeName}
                                </MenuItem>
                              ))}
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="mhealth-input-box padding-025em"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "50%", display: "flex" }}>
                    <div style={{ width: "50%" }}>
                      <div>
                        <label style={{ fontSize: 12 }}>
                          Registration Code
                        </label>
                        {errorObj.registrationCode &&
                        eventObject.registrationCode === undefined ? (
                          <p className="error-text">Please input</p>
                        ) : (
                          ""
                        )}
                      </div>
                      <input
                        style={{
                          background: "#f3f4f6",
                          padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "85%",
                          border:
                            errorObj.registrationCode &&
                            eventObject.registrationCode === undefined
                              ? "1px solid red"
                              : 0,
                        }}
                        placeholder="Enter registration code"
                        value={
                          checkForFalsy(eventObject.registrationCode)
                            ? ""
                            : eventObject.registrationCode
                        }
                        onChange={(e) =>
                          handleInputChange("registrationCode", e.target.value)
                        }
                      />
                    </div>
                    <div style={{ width: "50%" }}>
                      <div>
                        <label> Set moderator </label>
                      </div>
                      <button
                        className="is-success"
                        onClick={() => setUnsubModal(true)}
                        style={{
                          marginTop: 0,
                          marginLeft: 0,
                          padding: "2px 10px",
                        }}
                      >
                        set moderator
                      </button>
                      <span style={{ marginLeft: "20px" }}>
                        {" "}
                        {eventObject.moderatorName}{" "}
                      </span>
                    </div>
                  </div>
                  <div></div>
                  <div style={{ width: "50%" }}>
                    <div
                      style={{
                        marginBottom: 10,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ width: "50%" }}>
                        <div>
                          <label style={{ fontSize: 12 }}>Min Daily (KM)</label>
                          {errorObj.dailyMinKm &&
                          eventObject.dailyMinKm === undefined ? (
                            <p className="error-text">Please input</p>
                          ) : (
                            ""
                          )}
                        </div>
                        <input
                          style={{
                            border:
                              errorObj.emailId &&
                              eventObject.dailyMinKm === undefined
                                ? "1px solid red"
                                : 0,
                            background: "#f3f4f6",
                            padding: "6px 10px",
                            borderRadius: 6,
                            fontSize: 12,
                            width: "85%",
                          }}
                          placeholder="Enter kms"
                          value={
                            checkForFalsy(eventObject.dailyMinKm)
                              ? ""
                              : eventObject.dailyMinKm
                          }
                          onChange={(e) =>
                            handleInputChange("dailyMinKm", e.target.value)
                          }
                        />
                      </div>
                      <div style={{ width: "50%" }}>
                        <div>
                          <label style={{ fontSize: 12 }}>Max Daily (KM)</label>
                          {errorObj.dailyMaxKm &&
                          eventObject.dailyMaxKm === undefined ? (
                            <p className="error-text">Please input</p>
                          ) : (
                            ""
                          )}
                        </div>

                        <input
                          style={{
                            border:
                              errorObj.emailId &&
                              eventObject.dailyMaxKm === undefined
                                ? "1px solid red"
                                : 0,
                            background: "#f3f4f6",
                            padding: "6px 10px",
                            borderRadius: 6,
                            fontSize: 12,
                            width: "90%",
                          }}
                          placeholder="Enter kms"
                          value={
                            checkForFalsy(eventObject.dailyMaxKm)
                              ? ""
                              : eventObject.dailyMaxKm
                          }
                          onChange={(e) =>
                            handleInputChange("dailyMaxKm", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* // MODERATOR CODE NEW HERE  */}

                <div
                  className="mhealth-input-box padding-025em"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "50%",
                      display: "flex",
                    }}
                  >
                    <div style={{ width: "50%" }}>
                      <div>
                        <label style={{ fontSize: 12 }}>Event Type</label>
                        {errorObj.eventType &&
                        eventObject.eventType === undefined ? (
                          <p className="error-text">Please select</p>
                        ) : (
                          ""
                        )}
                      </div>
                      <select
                        name="type"
                        value={eventObject.eventType}
                        onChange={(e) => {
                          handleInputChange("eventType", e.target.value);
                        }}
                        style={{
                          border:
                            errorObj.emailId &&
                            eventObject.eventType === undefined
                              ? "1px solid red"
                              : 0,
                          background: "#f3f4f6",
                          padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "90%",
                        }}
                      >
                        <option value={undefined}>Select event type</option>
                        <option value="DAY">Day</option>
                        <option value="KM">KM</option>
                      </select>
                    </div>

                    <div style={{ width: "50%" }}>
                      <div>
                        <label style={{ width: "100%", fontSize: 12 }}>
                          Pin User Count
                        </label>
                        {errorObj.pinnedUserCount &&
                        eventObject.pinnedUserCount === undefined ? (
                          <p className="error-text">Please input</p>
                        ) : (
                          ""
                        )}

                        <input
                          style={{
                            border:
                              errorObj.emailId &&
                              eventObject.pinnedUserCount === undefined
                                ? "1px solid red"
                                : 0,
                            background: "#f3f4f6",
                            padding: "6px 10px",
                            borderRadius: 6,
                            fontSize: 12,
                            width: "85%",
                          }}
                          type="number"
                          placeholder="Enter count"
                          value={
                            checkForFalsy(eventObject.pinnedUserCount)
                              ? ""
                              : eventObject.pinnedUserCount
                          }
                          onChange={(e) =>
                            handleInputChange("pinnedUserCount", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div style={{ width: "50%", display: "flex" }}>
                    <div>
                      <label style={{ fontSize: 12 }}>
                        Event Date (YYYY-MM-DD)
                      </label>
                      <div
                        style={{
                          display: "flex",
                          // flexDirection: "row"
                        }}
                      >
                        <div style={{ width: "50%" }}>
                          <span
                            style={{
                              display: "flex",
                              // alignItems: "center"
                              width: "90%",
                            }}
                          >
                            Start:
                            <DatePicker
                              placeholder="Enter event start date"
                              disabled={false}
                              disablePast={editEventObject ? false : true}
                              value={
                                checkForFalsy(eventObject.challengeStartDate)
                                  ? ""
                                  : eventObject.challengeStartDate
                              }
                              onChange={(e) =>
                                handleInputChange("challengeStartDate", e)
                              }
                              outlineVariantDisable={true}
                            />
                          </span>
                        </div>
                        <div style={{ width: "50%" }}>
                          <span
                            style={{
                              // marginLeft: 20,
                              display: "flex",
                              // alignItems: "center"
                              width: "90%",
                            }}
                          >
                            End:
                            <DatePicker
                              placeholder="Enter event start date"
                              disabled={false}
                              disablePast={editEventObject ? false : true}
                              value={
                                checkForFalsy(eventObject.challengeEndDate)
                                  ? ""
                                  : eventObject.challengeEndDate
                              }
                              onChange={(e) =>
                                handleInputChange("challengeEndDate", e)
                              }
                              label="End"
                              outlineVariantDisable={true}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div style={{ width: "50%" }}></div> */}
                </div>

                {/* 
// MODERATOR CODE ENDED HERE  */}

                <div
                  className="mhealth-input-box padding-025em"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "50%" }}>
                    <label>Description</label>
                    {errorObj.description &&
                    eventObject.description === undefined ? (
                      <p className="error-text">Please input</p>
                    ) : (
                      ""
                    )}

                    <TextField
                      id="standard-basic"
                      placeholder="Enter the description about the event"
                      style={{
                        width: "92%",
                        background: "#f3f4f6",
                        padding: "6px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        border:
                          errorObj.description &&
                          eventObject.description === undefined
                            ? "1px solid red"
                            : 0,
                      }}
                      variant="outlined"
                      multiline
                      value={
                        checkForFalsy(eventObject.description)
                          ? ""
                          : eventObject.description
                      }
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="event-text-field"
                    />
                  </div>
                  <div style={{ width: "50%", display: "flex" }}>
                    <div style={{ width: "50%" }}>
                      <div>
                        <label>Eligibility</label>
                      </div>
                      {errorObj.eligibility &&
                      eventObject.eligibility === undefined ? (
                        <p className="error-text">Please input</p>
                      ) : (
                        ""
                      )}

                      <TextField
                        id="standard-basic"
                        placeholder="Enter the eligiblity criteria for the event"
                        style={{
                          width: "90%",
                          border:
                            errorObj.eligibility &&
                            eventObject.eligibility === undefined
                              ? "1px solid red"
                              : 0,
                        }}
                        variant="outlined"
                        multiline
                        value={
                          checkForFalsy(eventObject.eligibility)
                            ? ""
                            : eventObject.eligibility
                        }
                        onChange={(e) =>
                          handleInputChange("eligibility", e.target.value)
                        }
                        className="event-text-field"
                      />
                    </div>
                    <div style={{ width: "50%" }}>
                      <div>
                        <label> Sponsor text </label>
                      </div>
                      <TextField
                        id="standard-basic"
                        placeholder="Enter text here"
                        style={{
                          background: "#f3f4f6",
                          // padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "95%",
                        }}
                        variant="outlined"
                        multiline
                        value={eventObject.sponsorText}
                        onChange={(e) =>
                          handleInputChange("sponsorText", e.target.value)
                        }
                        className="event-text-field"
                      />
                    </div>
                  </div>
                </div>

                {/* NEW FIELD ADDED  */}

                <div
                  className="mhealth-input-box padding-025em"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "50%", display: "flex" }}>
                    <div style={{ width: "50%" }}>
                      <div>
                        <label style={{ fontSize: 12 }}> Team build</label>
                      </div>
                      <select
                        name="teamBuild"
                        value={eventObject.teamBuild}
                        onChange={(e) => {
                          handleInputChange("teamBuild", e.target.value);
                        }}
                        style={{
                          background: "#f3f4f6",
                          padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "90%",
                        }}
                      >
                        <option value={undefined}>Select Team</option>
                        <option value="NA">NA</option>
                        <option value="MODTEAM">MODTEAM</option>
                      </select>
                    </div>

                    <div style={{ width: "50%" }}>
                      <label style={{ width: "100%" }}> Data Compile </label>

                      <select
                        name="dataCompile"
                        value={eventObject.dataCompile}
                        onChange={(e) => {
                          handleInputChange("dataCompile", e.target.value);
                        }}
                        style={{
                          background: "#f3f4f6",
                          padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "90%",
                        }}
                      >
                        <option value={undefined}>select type</option>
                        <option value="1">Yes </option>
                        <option value="0">No</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ width: "50%", display: "flex" }}>
                    <div style={{ width: "50%" }}>
                      <div>
                        <label style={{ fontSize: 12 }}> Team Member</label>
                      </div>
                      <input
                        style={{
                          border: 0,
                          background: "#f3f4f6",
                          padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "85%",
                        }}
                        type="number"
                        name="maxTeamMember"
                        placeholder="Enter count"
                        value={eventObject.maxTeamMember}
                        onChange={(e) =>
                          handleInputChange("maxTeamMember", e.target.value)
                        }
                      />
                    </div>

                    <div style={{ width: "50%" }}>
                      <div>
                        <label style={{ fontSize: 12 }}> Total Team </label>
                      </div>
                      <input
                        style={{
                          border: 0,
                          background: "#f3f4f6",
                          padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "90%",
                        }}
                        type="number"
                        name="totalTeam"
                        placeholder="Enter Total team"
                        value={eventObject.totalTeam}
                        onChange={(e) =>
                          handleInputChange("totalTeam", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="mhealth-input-box padding-025em"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                ></div>

                {/* NEW FIELDS ADDED TILL HERE  */}

                <div
                  className="mhealth-input-box padding-025em"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "50%" }}>
                    <label>Rules</label>
                    {errorObj.rules && eventObject.rules === undefined ? (
                      <p className="error-text">Please input</p>
                    ) : (
                      ""
                    )}

                    <TextField
                      id="standard-basic"
                      placeholder="Enter the rules for the event"
                      style={{
                        width: "95%",
                        border:
                          errorObj.rules && eventObject.rules === undefined
                            ? "1px solid red"
                            : 0,
                      }}
                      variant="outlined"
                      multiline
                      value={
                        checkForFalsy(eventObject.rules)
                          ? ""
                          : eventObject.rules
                      }
                      onChange={(e) =>
                        handleInputChange("rules", e.target.value)
                      }
                      className="event-text-field"
                    />
                  </div>
                  <div style={{ width: "50%" }}>
                    <label>Rewards</label>
                    {errorObj.rewards && eventObject.rewards === undefined ? (
                      <p className="error-text">Please input</p>
                    ) : (
                      ""
                    )}

                    <TextField
                      id="standard-basic"
                      placeholder="Enter the rewards for the event"
                      style={{
                        width: "98%",
                        border:
                          errorObj.rewards && eventObject.rewards === undefined
                            ? "1px solid red"
                            : 0,
                      }}
                      variant="outlined"
                      multiline
                      value={
                        checkForFalsy(eventObject.rewards)
                          ? ""
                          : eventObject.rewards
                      }
                      onChange={(e) =>
                        handleInputChange("rewards", e.target.value)
                      }
                      className="event-text-field"
                    />
                  </div>
                </div>

                <div
                  className="mhealth-input-box padding-025em"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "50%" }}>
                    <label>Terms and Conditions</label>
                    {errorObj.termAndCondition &&
                    eventObject.termAndCondition === undefined ? (
                      <p className="error-text">Please input</p>
                    ) : (
                      ""
                    )}

                    <TextField
                      id="standard-basic"
                      placeholder="Enter the terms and condition for the event"
                      style={{
                        width: "95%",
                        border:
                          errorObj.termAndCondition &&
                          eventObject.termAndCondition === undefined
                            ? "1px solid red"
                            : 0,
                        border: "0px",
                      }}
                      variant="outlined"
                      multiline
                      value={
                        checkForFalsy(eventObject.termAndCondition)
                          ? ""
                          : eventObject.termAndCondition
                      }
                      onChange={(e) =>
                        handleInputChange("termAndCondition", e.target.value)
                      }
                      className="event-text-field"
                    />
                  </div>
                  <div style={{ width: "25%" }}>
                    <label>Source Change count</label>
                    {errorObj.datasourceChangeCount &&
                    eventObject.datasourceChangeCount === undefined ? (
                      <p className="error-text">Please input</p>
                    ) : (
                      ""
                    )}

                    <input
                      type="number"
                      placeholder="Enter Source Change count"
                      value={
                        checkForFalsy(eventObject.datasourceChangeCount)
                          ? ""
                          : eventObject.datasourceChangeCount
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "datasourceChangeCount",
                          e.target.value
                        )
                      }
                      style={{ width: "85%" }}
                    />
                  </div>
                  <div style={{ width: "25%" }}>
                    <label>Registration Fees</label>
                    {errorObj.registrationFees &&
                    eventObject.registrationFees === undefined ? (
                      <p className="error-text">Please input</p>
                    ) : (
                      ""
                    )}

                    <input
                      type="number"
                      placeholder="Enter price"
                      value={eventObject.registrationFees}
                      onChange={(e) =>
                        handleInputChange("registrationFees", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div
                  className="mhealth-input-box padding-025em"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "50%", display: "flex" }}>
                    <div style={{ width: "50%" }}>
                      <div>
                        <label style={{ fontSize: 12 }}>
                          {" "}
                          Button Background color
                        </label>
                      </div>
                      <input
                        type="color"
                        style={{
                          border: 0,
                          background: "#f3f4f6",
                          padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "90%",
                        }}
                        name="buttonBGColor"
                        placeholder="Enter Button Background Color"
                        value={eventObject.buttonBGColor}
                        onChange={(e) =>
                          handleInputChange("buttonBGColor", e.target.value)
                        }
                      />
                    </div>

                    <div style={{ width: "50%" }}>
                      <div>
                        <label style={{ fontSize: 12 }}>
                          {" "}
                          Button Text color
                        </label>
                      </div>
                      <input
                        type="color"
                        style={{
                          border: 0,
                          background: "#f3f4f6",
                          padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "90%",
                        }}
                        name="buttonTextColor"
                        placeholder="Enter Button Text Color"
                        value={eventObject.buttonTextColor}
                        onChange={(e) =>
                          handleInputChange("buttonTextColor", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div style={{ width: "50%", display: "flex" }}>
                    <div style={{ width: "50%" }}>
                      <div>
                        <label style={{ fontSize: 12 }}> Primary Color</label>
                      </div>
                      <input
                        type="color"
                        style={{
                          border: 0,
                          background: "#f3f4f6",
                          padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "90%",
                        }}
                        name="primaryColor"
                        placeholder="Enter Primary Color"
                        value={eventObject.primaryColor}
                        onChange={(e) =>
                          handleInputChange("primaryColor", e.target.value)
                        }
                      />
                    </div>

                    <div style={{ width: "50%" }}>
                      <div>
                        <label style={{ fontSize: 12 }}> Secondary Color</label>
                      </div>
                      <input
                        type="color"
                        style={{
                          border: 0,
                          background: "#f3f4f6",
                          padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "90%",
                        }}
                        name="secondaryColor"
                        placeholder="Enter Secondary Color"
                        value={eventObject.secondaryColor}
                        onChange={(e) =>
                          handleInputChange("secondaryColor", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="mhealth-input-box padding-025em"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "50%" }}>
                    <label>Url</label>
                    <br />

                    <input
                      type="text"
                      placeholder="Enter url"
                      name="whitelabelKeyword"
                      value={eventObject.whitelabelKeyword}
                      onChange={(e) =>
                        handleInputChange("whitelabelKeyword", e.target.value)
                      }
                    />
                  </div>
                  <div style={{ width: "50%", display: "flex" }}>
                    <div style={{ width: "50%" }}>
                      <label>Email-Validation Required </label>
                    </div>
                    <div style={{ width: "50%" }}>
                      <input
                        type="radio"
                        style={{
                          cursor: "pointer",
                          height: "20px",
                          width: "20px",
                          marginRight: "5px",
                          // marginLeft: '20%',
                        }}
                        name="verificationRequired"
                        value={1}
                        onChange={(e) =>
                          handleInputChange(
                            "verificationRequired",
                            e.target.value
                          )
                        }
                        checked={eventObject?.verificationRequired == 1}
                      />
                      yes
                      <input
                        type="radio"
                        style={{
                          cursor: "pointer",
                          height: "20px",
                          width: "20px",
                          marginLeft: "20%",
                          marginRight: "5px",
                        }}
                        name="verificationRequired"
                        value={0}
                        onChange={(e) =>
                          handleInputChange(
                            "verificationRequired",
                            e.target.value
                          )
                        }
                        checked={eventObject?.verificationRequired == 0}
                      />
                      No
                    </div>
                  </div>
                </div>
                {eventObject.verificationRequired == 1 ? (
                  <div

                  // name="subDomains"
                  >
                    {eventCreated || editEventObject?.id ? (
                      <>
                        {finaleditgmail.length > 0 &&
                          finaleditgmail.map((item, index) => {
                            return (
                              <>
                                <div
                                  className="mhealth-input-box padding-025em"
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  {item !== "" ? (
                                    <div
                                      style={{ width: "50%", display: "flex" }}
                                    >
                                      <label style={{ fontSize: "12px" }}>
                                        subDomains
                                      </label>
                                      <br />
                                      <input
                                        type="text"
                                        // name='subDomains'
                                        style={{
                                          width: "90%",
                                          background: "#f3f4f6",
                                          padding: "6px 10px",
                                          borderRadius: 6,
                                          fontSize: 12,
                                          // border:
                                          //   errorObj.subDomains &&
                                          //   eventObject.subDomains === undefined
                                          //     ? '1px solid red'
                                          //     : 0,
                                        }}
                                        placeholder="Enter Email Domain"
                                        value={item}
                                        name="subDomains"
                                        // onChange={(e) =>
                                        //   setEditGmailList(e.target.value)
                                        // }
                                        onChange={(e) =>
                                          handleInputSubDomainChange(
                                            "subDomains",
                                            e.target.value,
                                            index
                                          )
                                        }
                                      />
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </>
                            );
                          })}
                        {findvalue.length !== 4 &&
                        eventObject.verificationRequired == 1 ? (
                          <>
                            <div
                              className="mhealth-input-box padding-025em"
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div style={{ width: "50%", display: "flex" }}>
                                <div style={{ width: "25%", display: "flex" }}>
                                  <div style={{ width: "80%" }}>
                                    <label>Email Domain</label>
                                    <br />
                                    <input
                                      type="text"
                                      style={{
                                        width: "90%",
                                        background: "#f3f4f6",
                                        padding: "6px 10px",
                                        borderRadius: 6,
                                        fontSize: 12,

                                        // border:
                                        //   errorObj.subDomains &&
                                        //   eventObject.subDomains === undefined
                                        //     ? '1px solid red'
                                        //     : 0,
                                      }}
                                      pattern="@."
                                      placeholder="Enter Email Domain"
                                      value={editinputgmail}
                                      onChange={(e) =>
                                        setEditInputGmail(e.target.value)
                                      }
                                    />
                                    {/[@]/gi.test(editinputgmail) === true ? (
                                      <p
                                        style={{
                                          color: "red",

                                          marginTop: "0%",
                                        }}
                                      >
                                        Sorry, @ is not allowed
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                    {/[!]/gi.test(editinputgmail) === true ? (
                                      <p
                                        style={{
                                          color: "red",

                                          marginTop: "0%",
                                        }}
                                      >
                                        Sorry, ! is not allowed
                                      </p>
                                    ) : (
                                      ""
                                    )}

                                    {editinputgmail.length > 1 &&
                                    /^[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gi.test(
                                      editinputgmail.toString()
                                    ) === false &&
                                    /[-]/gi.test(editinputgmail.toString()) ===
                                      false ? (
                                      <p
                                        style={{
                                          color: "red",

                                          marginTop: "0%",
                                        }}
                                      >
                                        Invalid input
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  {/* {eventObject.subDomains !== undefined ? (
                          <>
                            {eventObject.subDomains !== '' ? ( */}
                                  <div
                                    style={{
                                      width: "20%",
                                      marginTop: "15%",
                                      marginLeft: "10%",
                                    }}
                                  >
                                    <Plus
                                      onClick={EditAddGmail}
                                      style={{ cursor: "pointer" }}
                                    />
                                  </div>
                                  {/* ) : (
                              ''
                            )}
                          </>
                        ) : (
                          ''
                        )} */}
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </>
                    ) : (
                      <div>
                        <div
                          className="mhealth-input-box padding-025em"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div style={{ width: "50%", display: "flex" }}>
                            {gmailList.length !== 4 ? (
                              <>
                                <div style={{ width: "50%", display: "flex" }}>
                                  <div style={{ width: "80%" }}>
                                    <label>Email Domain</label>
                                    <br />

                                    <input
                                      type="text"
                                      style={{
                                        width: "90%",
                                        background: "#f3f4f6",
                                        padding: "6px 10px",
                                        borderRadius: 6,
                                        fontSize: 12,

                                        // border:
                                        //   errorObj.subDomains &&
                                        //   eventObject.subDomains === undefined
                                        //     ? '1px solid red'
                                        //     : 0,
                                      }}
                                      pattern="@."
                                      placeholder="Enter Email Domain"
                                      value={inputgmail}
                                      onChange={(e) =>
                                        setInputGmail(e.target.value)
                                      }
                                    />
                                    {/[@]/gi.test(inputgmail) === true ? (
                                      <p
                                        style={{
                                          color: "red",

                                          marginTop: "0%",
                                        }}
                                      >
                                        Sorry, @ is not allowed
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                    {/[!]/gi.test(inputgmail) === true ? (
                                      <p
                                        style={{
                                          color: "red",

                                          marginTop: "0%",
                                        }}
                                      >
                                        Sorry, ! is not allowed
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                    {inputgmail.length > 1 &&
                                    /^[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gi.test(
                                      inputgmail.toString()
                                    ) === false &&
                                    /[-]/gi.test(inputgmail.toString()) ===
                                      false ? (
                                      <p
                                        style={{
                                          color: "red",

                                          marginTop: "0%",
                                        }}
                                      >
                                        Invalid input
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  {/* {eventObject.subDomains !== undefined ? (
                          <>
                            {eventObject.subDomains !== '' ? ( */}
                                  <div
                                    style={{
                                      width: "20%",
                                      marginTop: "10%",
                                      marginLeft: "10%",
                                    }}
                                  >
                                    <Plus
                                      onClick={AddGmail}
                                      style={{ cursor: "pointer" }}
                                    />
                                  </div>
                                  {/* ) : (
                              ''
                            )}
                          </>
                        ) : (
                          ''
                        )} */}
                                </div>
                              </>
                            ) : (
                              <div style={{ width: "50%", display: "flex" }}>
                                <div style={{ width: "80%" }}>
                                  {gmailList[3]}
                                </div>
                              </div>
                            )}

                            {gmailList.length > 0 ? (
                              <>
                                <div style={{ width: "50%", display: "flex" }}>
                                  <div style={{ width: "80%" }}>
                                    {gmailList[0]}
                                  </div>
                                </div>
                              </>
                            ) : (
                              ""
                            )}
                          </div>

                          <div style={{ width: "50%", display: "flex" }}>
                            {gmailList.length > 0 ? (
                              <>
                                <div style={{ width: "50%", display: "flex" }}>
                                  <div style={{ width: "80%" }}>
                                    {gmailList[1]}
                                  </div>
                                </div>
                              </>
                            ) : (
                              ""
                            )}
                            {gmailList.length > 0 ? (
                              <>
                                <div style={{ width: "50%", display: "flex" }}>
                                  <div style={{ width: "80%" }}>
                                    {gmailList[2]}
                                  </div>
                                </div>
                              </>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  ""
                )}
                <div
                  className="mhealth-input-box padding-025em"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "50%", display: "flex" }}>
                    <div style={{ width: "50%" }}>
                      <label>Forum</label>
                      <br />
                      <select
                        value={eventObject.forum}
                        onChange={(e) =>
                          handleInputChange("forum", e.target.value)
                        }
                        style={{
                          background: "#f3f4f6",
                          padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "90%",
                        }}
                      >
                        <option value="NONE">None</option>
                        <option value="IDENTITY">Identity</option>
                        <option value="ALIAS">Alias</option>
                        <option value="ANONYMOUS">Anonymous</option>
                      </select>
                    </div>
                    <div style={{ width: "50%" }}>
                      <label>LeaderboardRange</label>
                      <br />
                      <select
                        value={eventObject.leaderboardRange}
                        onChange={(e) =>
                          handleInputChange("leaderboardRange", e.target.value)
                        }
                        style={{
                          background: "#f3f4f6",
                          padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "90%",
                        }}
                      >
                        <option value={null}>Select</option>
                        <option value="TILL_DATE">Till Date</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="WEEKLY">Weekly</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeStep == 2 && (
              <>
                <div
                  className="mhealth-input-box padding-025em"
                  style={{ marginTop: 10 }}
                >
                  <label
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    Event Banner
                    {mediaObj.challengeBanner && (
                      <span
                        style={{ cursor: "pointer", color: "red" }}
                        onClick={() => {
                          setMediaObj({
                            ...mediaObj,
                            challengeBanner: undefined,
                          });
                        }}
                      >
                        Delete
                      </span>
                    )}
                  </label>
                  {errorObj.challengeBanner && (
                    <p className="error-text">Please Upload</p>
                  )}
                  <div
                    className="create-event-banner"
                    style={{ border: "1px solid #eee" }}
                  >
                    {mediaObj.challengeBanner ? (
                      <>
                        <img
                          style={{ width: "100%", height: "100%" }}
                          src={
                            typeof mediaObj.challengeBanner == "object"
                              ? URL.createObjectURL(mediaObj.challengeBanner)
                              : mediaObj.challengeBanner
                          }
                        />
                      </>
                    ) : (
                      <div
                        className="create-event-banner-button"
                        onClick={() => bannerInputRef.current.click()}
                      >
                        <PlusCircle size={16} style={{ marginRight: 3 }} />{" "}
                        Upload Banner Image
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      ref={bannerInputRef}
                      style={{ display: "none" }}
                      onChange={(event) => {
                        setMediaObj({
                          ...mediaObj,
                          challengeBanner: event.target.files[0],
                        });
                      }}
                    />
                  </div>
                </div>
                <div
                  className="mhealth-input-box padding-025em"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginRight: 20,
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      Event Logo{" "}
                      {mediaObj.eventLogo && (
                        <span
                          style={{ cursor: "pointer", color: "red" }}
                          onClick={() => {
                            setMediaObj({ ...mediaObj, eventLogo: undefined });
                          }}
                        >
                          Delete
                        </span>
                      )}
                    </label>
                    {errorObj.eventLogo && (
                      <p className="error-text">Please Upload</p>
                    )}

                    <div
                      className="create-event-logo"
                      style={{ border: "1px solid #eee" }}
                    >
                      {mediaObj.eventLogo ? (
                        <>
                          <img
                            style={{ width: "100%", height: "100%" }}
                            src={
                              typeof mediaObj.eventLogo == "object"
                                ? URL.createObjectURL(mediaObj.eventLogo)
                                : mediaObj.eventLogo
                            }
                          />
                        </>
                      ) : (
                        <PlusCircle
                          size={30}
                          style={{ marginRight: 3, cursor: "pointer" }}
                          onClick={() => eventLogoInputRef.current.click()}
                        />
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      ref={eventLogoInputRef}
                      style={{ display: "none" }}
                      onChange={(event) => {
                        setMediaObj({
                          ...mediaObj,
                          eventLogo: event.target.files[0],
                        });
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      Sponsor Logo
                      {mediaObj.sponsorLogo && (
                        <span
                          style={{ cursor: "pointer", color: "red" }}
                          onClick={() => {
                            setMediaObj({
                              ...mediaObj,
                              sponsorLogo: undefined,
                            });
                          }}
                        >
                          Delete
                        </span>
                      )}
                    </label>
                    {errorObj.sponsorLogo && (
                      <p className="error-text">Please Upload</p>
                    )}
                    <div
                      className="create-event-logo"
                      style={{ border: "1px solid #eee" }}
                    >
                      {mediaObj.sponsorLogo ? (
                        <>
                          <img
                            style={{ width: "100%", height: "100%" }}
                            src={
                              typeof mediaObj.sponsorLogo == "object"
                                ? URL.createObjectURL(mediaObj.sponsorLogo)
                                : mediaObj.sponsorLogo
                            }
                          />
                        </>
                      ) : (
                        <PlusCircle
                          size={30}
                          style={{ marginRight: 3, cursor: "pointer" }}
                          onClick={() => sponsorLogoInputRef.current.click()}
                        />
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      ref={sponsorLogoInputRef}
                      style={{ display: "none" }}
                      onChange={(event) => {
                        setMediaObj({
                          ...mediaObj,
                          sponsorLogo: event.target.files[0],
                        });
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div
          className="submit-button"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 14,
              width: "max-content",
              color: regMessage.type == "success" ? "#069b3f" : "#d65151",
            }}
          >
            {regMessage.msg}
          </div>
          {loading ? (
            <span
              style={{
                marginTop: 0,
                marginBottom: 15,
                width: 100,
                height: 32,
              }}
            >
              <ReactLoadingWrapper
                color={"#518ad6"}
                height={32}
                width={32}
                type={"spin"}
              />
            </span>
          ) : (
            <button
              className="is-success"
              onClick={() => handleSubmit()}
              style={{
                marginTop: 0,
                marginLeft: 20,
                marginBottom: 20,
                padding: "2px 10px",
              }}
            >
              Submit
            </button>
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
          onClick={() => setCreateEventModal(false)}
        />
      </div>
    </div>
  );
  return (
    <Modal
      open={createEventModal}
      onClose={() => {
        setCreateEventModal(false);
        setEditEventObject();
      }}
      style={{ overflowY: "auto" }}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {body}
    </Modal>
  );
};

export default CreateEventModal;
