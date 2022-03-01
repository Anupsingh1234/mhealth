import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import EventInfoModal from "./EventInfoModal";
import EventRegisterModal from "./EventRegisterModal";
import InfoDialog from "./Utility/InfoDialog";
import InfoIcon from "@material-ui/icons/Info";
import { unsubscribeEvent, rejoinEvent } from "../services/challengeApi";
import Message from "antd-message";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  urlPrefix,
  secretToken,
  getSubEvent,
  zoomreport,
} from "../services/apicollection";
import axios from "axios";
let monthsObject = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "Aug",
  "09": "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

const EventCard = ({
  challenge,
  handleChallengeCardClick,
  dashboardState,
  setDashboardState,
  fetchChallenges,
  listType,
  selectedAction,
  selectedChallengeArray,
  selectedChallenge,
}) => {
  const [modalView, setModalView] = useState(false);
  const [registerModalView, setRegisterModalView] = useState(false);
  const [validateModalView, setValidateModalView] = useState(false);
  const [showUnsubscribeModal, setUnsubModal] = useState(false);
  const [emailVerifiedMessage, setEmailVerifiedMessage] = useState(false);
  const [emailValidVerifiedMessage, setEmailValidVerifiedMessage] =
    useState(false);
  const [sudomain, setSubdomain] = useState([]);
  const getValidEmail = (id) => {
    const adminurl = `${urlPrefix}v1.0/validateEmailId?eventId=${id}`;
    setSubdomain([...challenge.subDomains]);
    axios
      .get(adminurl, {
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
        if (res.data.response.responseMessage === "User is Already Verified") {
          setRegisterModalView(true);
        }
        if (res.data.response.responseMessage === "Email Not Found") {
          setValidateModalView(true);
        }
        if (res.data.response.responseMessage === "Not a Valid Email") {
          setEmailValidVerifiedMessage(true);
        }
        if (res.data.response.responseMessage === "Email Sent Successfully") {
          setEmailVerifiedMessage(true);
        }
        // setValidateModalView(true)\
      });
  };
  localStorage.setItem('ViewModal', registerModalView);
  const sentMail = () => {
    setEmailVerifiedMessage(false);
    if (challenge.isParticipated && challenge.isUserVerifiedInEvent === true) {
      setRegisterModalView(true);
    }
  };
  const [validinputEmail, setValidInputEmail] = useState(
    localStorage.getItem("emailId")
  );
  const [inputEmail, setInputEmail] = useState("");
  const word =
    validinputEmail !== null
      ? validinputEmail.indexOf("@")
      : "" || inputEmail !== null
      ? inputEmail.indexOf("@")
      : "";
  // const lastword = validinputEmail.indexOf('.');
  // let b = lastword;
  const a = word + 1;

  window.key =
    validinputEmail !== null
      ? validinputEmail.substring(a)
      : "" || inputEmail !== null
      ? inputEmail.substring(a)
      : "";
  const [message1, setMessage1] = useState("");
  const updateEmail = (id) => {
    if (
      (inputEmail !== "" &&
        (window.key == sudomain[0] ||
          window.key == sudomain[1] ||
          window.key == sudomain[2] ||
          window.key == sudomain[3]) &&
        /[.]/gi.test(inputEmail.toString()) === true &&
        // /[@]/gi.test(emailId.toString()) === true &&
        /[!]/gi.test(inputEmail.toString()) === false &&
        ('"' + inputEmail + '"').search(
          /[.][.]/i || /[.][A-Z][.]/i || /[A-Z][!][A-Z]/i
        ) === -1 &&
        (inputEmail.match(/[.]/gi) || []).length < 3 &&
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gi.test(
          inputEmail.toString()
        )) ||
      (validinputEmail !== "" &&
        (window.key === sudomain[0] ||
          window.key === sudomain[1] ||
          window.key === sudomain[2] ||
          window.key === sudomain[3]) &&
        /[.]/gi.test(validinputEmail.toString()) === true &&
        // /[@]/gi.test(emailId.toString()) === true &&
        /[!]/gi.test(validinputEmail.toString()) === false &&
        ('"' + validinputEmail + '"').search(
          /[.][.]/i || /[.][A-Z][.]/i || /[A-Z][!][A-Z]/i
        ) === -1 &&
        (validinputEmail.match(/[.]/gi) || []).length < 3 &&
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gi.test(
          validinputEmail.toString()
        ))
    ) {
      const adminurl = `${urlPrefix}v1.0/updateEmailId?email=${
        inputEmail || validinputEmail
      }`;

      axios
        .put(
          adminurl,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              // timeStamp: 'timestamp',
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
          getValidEmail(id);
          setValidateModalView(false);
          setEmailValidVerifiedMessage(false);
        });
    } else {
      setMessage1("Please input given domains ");
    }
  };
  // useEffect(() => {
  //   getValidEmail()
  // }, [])
  let startDate = challenge.challengeStartDate
    ? challenge.challengeStartDate.split(" ")
    : "";
  let endDate = challenge.challengeEndDate
    ? challenge.challengeEndDate.split(" ")
    : "";
  let startDay = startDate[0].split("-")[2];
  let endDay = endDate[0].split("-")[2];
  let startMonth = monthsObject[startDate[0].split("-")[1]];
  let endMonth = monthsObject[endDate[0].split("-")[1]];
  let startTime = startDate[1];

  const renderRegisterBtn = () => {
    if (listType == "event" && challenge.eventView !== "LINKED") {
      if (dashboardState.challengeSwitch !== "old") {
        if (dashboardState.challengeSwitch == "current") {
          if (challenge?.regOpen && !challenge?.isParticipated) {
            return (
              <div className="register-button">
                {challenge?.regOpen && challenge?.verificationRequired === 1 ? (
                  <button onClick={() => getValidEmail(challenge.id)}>
                    {/* Register */}
                    Subscribe
                  </button>
                ) : (
                  <button onClick={() => setRegisterModalView(true)}>
                    {/* Register */}
                    Subscribe
                  </button>
                )}
              </div>
            );
          }
          if (challenge.isParticipated && challenge.isSubscribed) {
            return (
              <div className="register-button">
                <button
                  onClick={() => setUnsubModal(true)}
                  style={{ background: "#F43F5E" }}
                >
                  Unsubscribe
                </button>
              </div>
            );
          }
          if (
            challenge.isParticipated &&
            !challenge.isSubscribed &&
            challenge.canRejoin
          ) {
            return (
              <div className="register-button">
                <button
                  onClick={() => {
                    rejoinEvent(challenge.id).then((res) => {
                      fetchChallenges();
                    });
                  }}
                  style={{ background: "#ffa726" }}
                >
                  Rejoin
                </button>
              </div>
            );
          }
        } else {
          return (
            <div className="register-button">
              {!challenge.isParticipated && (
                <button onClick={() => setRegisterModalView(true)}>
                  {/* Register */}
                  Subscribe
                </button>
              )}
              {challenge.isParticipated && challenge.isSubscribed && (
                <button
                  onClick={() => setUnsubModal(true)}
                  style={{ background: "#F43F5E" }}
                >
                  Usubscribe
                </button>
              )}
              {challenge.isParticipated &&
                !challenge.isSubscribed &&
                challenge.canRejoin && (
                  <button
                    onClick={() => {
                      rejoinEvent(challenge.id).then((res) => {
                        fetchChallenges();
                      });
                    }}
                    style={{ background: "#ffa726" }}
                  >
                    Rejoin
                  </button>
                )}
            </div>
          );
        }
      }
    }
  };
  return (
    <div
      className={
        selectedAction === "Compare"
          ? selectedChallengeArray.includes(challenge.id)
            ? "challenge-card challenge-card-first"
            : "challenge-card"
          : selectedChallenge == challenge.id
          ? "challenge-card challenge-card-first"
          : "challenge-card"
      }
      key={challenge.id}
    >
      <div onClick={() => handleChallengeCardClick(challenge)}>
        <div
          style={{
            width: 230,
            height: 100,
            borderRadius: "12px 12px 0px 0px",
            background: "#fff",
            overflow: "hidden",
          }}
        >
          <img
            src={
              challenge.eventLogo ||
              "https://walkathon21.s3.ap-south-1.amazonaws.com/logo/Background.png"
            }
            style={{
              width: 230,
              height: 100,
              objectFit: "cover",
              borderRadius: "12px 12px 0px 0px",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://walkathon21.s3.ap-south-1.amazonaws.com/logo/Background.png";
            }}
          />
        </div>
        <div className="challenge-card-details">
          <div
            className={
              selectedAction === "Compare"
                ? selectedChallengeArray.includes(challenge.id)
                  ? "challenge-card-details-name challenge-card-details-name-first"
                  : "challenge-card-details-name"
                : selectedChallenge == challenge.id
                ? "challenge-card-details-name challenge-card-details-name-first"
                : "challenge-card-details-name"
            }
          >
            {challenge.challengeName}
          </div>
          <div
            className={
              selectedAction === "Compare"
                ? selectedChallengeArray.includes(challenge.id)
                  ? "challenge-card-details-start-date-time challenge-card-details-start-date-time-first"
                  : "challenge-card-details-start-date-time"
                : selectedChallenge == challenge.id
                ? "challenge-card-details-start-date-time challenge-card-details-start-date-time-first"
                : "challenge-card-details-start-date-time"
            }
          >
            {/* starts at{' '}
            {startTime?.toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })} */}
          </div>
        </div>
        <div className="event-image-card-avatar-div">
          <div
            style={{
              fontSize: 9,
              color: "#000",
              marginRight: 3,
              marginTop: 27,
            }}
          >
            Powered by
          </div>
          <Avatar
            src={challenge.sponsorLogo}
            className="avatar-component sponser-logo"
          />
        </div>
      </div>

      {renderRegisterBtn()}
      <div className="challenge-card-start-date">
        <div className="challenge-card-start-date-month">
          {startMonth} - {endMonth}
        </div>
        <div className="challenge-card-start-date-day">
          {startDay} - {endDay}
        </div>
        <a
          onClick={() => setModalView(true)}
          style={{ position: "absolute", top: 5, right: 5 }}
        >
          <InfoIcon style={{ fontSize: 15, color: "#1e88e5" }} />
        </a>
      </div>
      {modalView && (
        <EventInfoModal
          challenge={challenge}
          modalView={modalView}
          setModalView={setModalView}
        />
      )}
      {registerModalView && (
        <EventRegisterModal
          challenge={challenge}
          modalView={registerModalView}
          setModalView={setRegisterModalView}
          setDashboardState={setDashboardState}
          currentViewTab={dashboardState.challengeSwitch}
          instruction_details={dashboardState?.instruction_details}
        />
      )}
      {showUnsubscribeModal && (
        <InfoDialog
          handleClose={() => setUnsubModal(false)}
          open={showUnsubscribeModal}
          title="Want to unsubscribe from the event?"
        >
          <div className="event-unsubscribe-modal">
            <button
              onClick={() => {
                window.message = Message;
                unsubscribeEvent(challenge.id)
                  .then((res) => {
                    if (res.data.response.responseCode === 0) {
                      message.success("Event unsubscribed.");
                      fetchChallenges();
                    } else {
                      message.error(res.data.response.responseMessage);
                      message.error(res.data.mhealthResponseMessage);
                    }
                    setUnsubModal(false);
                  })
                  .catch(() => {
                    message.success("Try Again.");
                    setUnsubModal(false);
                  });
              }}
            >
              Yes
            </button>
            <button onClick={() => setUnsubModal(false)}>No</button>
          </div>
        </InfoDialog>
      )}
      {emailValidVerifiedMessage && (
        <InfoDialog
          handleClose={() => setEmailValidVerifiedMessage(false)}
          open={emailValidVerifiedMessage}
          // title="Please Validate your Email here!"
        >
          <div style={{ height: "230px", marginLeft: "10%" }}>
            <div className="">
              <CancelIcon
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  color: "#ef5350",
                  cursor: "pointer",
                  fontFamily: "bold",
                  fontWeight: 50,
                  fontSize: "20px",
                }}
                onClick={() => setEmailValidVerifiedMessage(false)}
              />
              <label>
                Dear <b>{localStorage.getItem("firstName")},</b>
                <br />
                Your profile is not updated with approved domain(s) to register
                in this event. Please update your email-id with given domains{" "}
                <b>
                  ({sudomain[0] ? <>{sudomain[0]},</> : ""}
                  {sudomain[1] ? <>{sudomain[1]},</> : ""}
                  {sudomain[2] ? <>{sudomain[2]},</> : ""}
                  {sudomain[3] ? <>{sudomain[3]}</> : ""})
                </b>{" "}
                and validate to proceed with Registration process and validate
                in profile section.
              </label>
              <br />
              <div style={{ display: "flex" }}>
                <div style={{ width: "60%", marginTop: "8%" }}>
                  <input
                    autofocus="autofocus"
                    style={{
                      background: "#f3f4f6",
                      padding: "10px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      width: "98%",
                      border: "1px solid black",
                      top: 20,
                    }}
                    type="text"
                    value={validinputEmail}
                    onChange={(e) => setValidInputEmail(e.target.value)}
                    // name="quizDescription"
                    placeholder="Enter a valid Email"
                  />
                  {(validinputEmail.length > 1 &&
                    (window.key !== sudomain[0] ||
                      window.key !== sudomain[1] ||
                      window.key !== sudomain[2] ||
                      window.key !== sudomain[3]) &&
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gi.test(
                      validinputEmail.toString()
                    ) === false) ||
                  (validinputEmail.match(/[.]/gi) || []).length === 3 ? (
                    // /[-]/gi.test(emailId.toString()) === false ? (
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

                <div style={{ width: "30%", marginTop: "8%" }}>
                  <button
                    className="is-success"
                    onClick={() => updateEmail(challenge.id)}
                    style={{
                      // marginTop: 50,
                      marginLeft: "60%",
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
              {message1 !== "" ? (
                <p
                  style={{
                    color: "red",

                    marginTop: "0%",
                  }}
                >
                  {message1}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        </InfoDialog>
      )}
      {validateModalView && (
        <InfoDialog
          handleClose={() => setValidateModalView(false)}
          open={validateModalView}
          // title="Please Validate your Email here!"
        >
          <div style={{ height: "250px", marginLeft: "10%" }}>
            <div className="">
              <CancelIcon
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  color: "#ef5350",
                  cursor: "pointer",
                }}
                onClick={() => setValidateModalView(false)}
              />
              <label>
                Dear <b>{localStorage.getItem("firstName")},</b>
                <br />
                Your Email is not updated in your profile. Kindly update you
                Email with given authorized domains{" "}
                <b>
                  ({sudomain[0] ? <>{sudomain[0]},</> : ""}
                  {sudomain[1] ? <>{sudomain[1]},</> : ""}
                  {sudomain[2] ? <>{sudomain[2]},</> : ""}
                  {sudomain[3] ? <>{sudomain[3]}</> : ""})
                </b>{" "}
                and validate in profile section to proceed with Registration
                process.
              </label>
              <div style={{ display: "flex" }}>
                <div style={{ width: "60%", marginTop: "8%" }}>
                  <input
                    autofocus="autofocus"
                    style={{
                      background: "#f3f4f6",
                      padding: "10px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      width: "90%",
                      border: "1px solid black",
                      top: 20,
                    }}
                    type="text"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    // name="quizDescription"
                    placeholder="Enter a valid Email"
                  />
                  {(inputEmail.length > 1 &&
                    (window.key !== sudomain[0] ||
                      window.key !== sudomain[1] ||
                      window.key !== sudomain[2] ||
                      window.key !== sudomain[3]) &&
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gi.test(
                      inputEmail.toString()
                    ) === false) ||
                  (inputEmail.match(/[.]/gi) || []).length === 3 ? (
                    // /[-]/gi.test(emailId.toString()) === false ? (
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

                <div style={{ width: "30%", marginTop: "8%" }}>
                  <button
                    className="is-success"
                    onClick={() => updateEmail(challenge.id)}
                    style={{
                      marginTop: 50,
                      width: 100,
                      height: 32,
                      marginLeft: "60%",
                    }}
                  >
                    submit
                  </button>
                </div>
              </div>
              {message1 !== null ? (
                <p
                  style={{
                    color: "red",

                    marginTop: "0%",
                  }}
                >
                  {message1}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        </InfoDialog>
      )}
      {emailVerifiedMessage && (
        <InfoDialog
          handleClose={() => setEmailVerifiedMessage(false)}
          open={emailVerifiedMessage}
        >
          <div style={{ height: "180px", marginLeft: "8%" }}>
            <div className="">
              <CancelIcon
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  color: "#ef5350",
                  cursor: "pointer",
                }}
                onClick={() => setEmailVerifiedMessage(false)}
              />
              <label>
                {" "}
                Dear <b>{localStorage.getItem("firstName")},</b>
                <br />
                Your Email is not verified, Only verified profiles are allowed
                to register in the event. To proceed further with registration
                process, Please validate you Email in profile section.
                <b> {inputEmail || validinputEmail}</b>.
              </label>
            </div>
            <button
              className="is-success"
              onClick={sentMail}
              style={{
                marginTop: 20,
                width: 100,
                height: 32,
                marginLeft: "70%",
              }}
            >
              Sure
            </button>
          </div>
        </InfoDialog>
      )}
    </div>
  );
};

export default EventCard;
