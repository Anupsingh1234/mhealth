import React, { useState, useEffect } from "react";
import InfoIcon from "@material-ui/icons/Info";
import InfoDialog from "../Utility/InfoDialog";
import HraQuiz from "./HraQuiz";
import CancelIcon from "@material-ui/icons/Cancel";
import axios from "axios";
import { urlPrefix } from "../../services/apicollection";
import AssessmentInfo from "./AssessmentInfo";

import dataSource from "../../assets/dataSource.svg";

import { updateUserDetailsHandler } from "../../services/userprofileApi";
import SubEventCard from "../Dashboard/Activity/SubEventCard";
import { getSubEvent } from "../../services/apicollection";
import { Paper, TextField } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import { PrimaryButton } from "../Form";
const RecommendedProgram = ({ eventID, currentEventObj }) => {
  const [profileModal, setProfileModal] = useState(false);
  const arr = ["1"];
  const [quiz, setQuiz] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [cardDetails, setCardDetails] = useState();
  const [profilePayload, setProfilePayload] = useState();
  const [question, setquestion] = useState();
  const [programList1, setProgramList] = useState([]);
  const programList = [];
  const [optionId, setoptionId] = useState([]);
  const [score, setscore] = useState();
  const [isnext, setisnext] = useState(true);
  const [totalScore, settotalScore] = useState(0);
  const [textAns, settextAns] = useState(null);
  const [nextquestion, setnextquestion] = useState();
  const [scoreDetails, setscoreDetails] = useState();
  // const [cardDetails, setcardDetails] = useState();
  const [cardId, setcardId] = useState();
  const Assessment = () => {
    if (cardDetails.profileComplete === true) {
      // setQuiz(true);
      submitAnswer(localStorage.getItem("userId"), 0, 0, 0), setcardId(item.id);
    } else {
      setProfileModal(true);
    }
  };

  const handleCheck = (e) => {
    const { name, checked } = e.target;

    if (checked) {
      optionId.push(parseInt(name));
    } else {
      function arrayRemove(optionId, value) {
        return optionId.filter(function (ele) {
          return ele != value;
        });
      }
      const result = arrayRemove(optionId, name);
      setoptionId(result);
    }
  };
  useEffect(() => {
    nextquestion == false ? scoreCall() : "";
    // card(10);
  }, [nextquestion]);
  useEffect(() => {
    AssismentCard();
    startQuiz();
    scoreCall();
    getActivitySubEvent();
    console.log(optionId, "optionId");
  }, []);
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setProfilePayload((values) => ({ ...values, [name]: value }));
  };
  const updateProfile = () => {
    let payload = {
      dob: profilePayload.dob + " " + "12:00:00",
      gender: profilePayload.gender,
      city: profilePayload.location,
    };
    updateUserDetailsHandler(payload).then((res) => {
      AssismentCard();
      setProfileModal(false);
      setProfilePayload();
    });
  };
  console.log(profilePayload, "profile");
  const scoreCall = () => {
    const URL = `${urlPrefix}v1.0/getHRAScoreCard?hraId=1`;
    return axios
      .get(URL, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
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
        setscoreDetails(res?.data?.response?.responseData);
      });
  };
  const assest = () => {
    startQuiz();
  };
  const submitAnswer = (hraid, questionid, option, freetext) => {
    const URL = `${urlPrefix}v1.0/submitHraAnswer`;
    return axios
      .post(
        URL,
        {
          hraId: cardId,
          hraQuestionId: questionid,
          optionId: optionId,
          text: freetext,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
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
        res?.data?.response?.responseData
          ? setnextquestion(res?.data?.response?.responseData)
          : setnextquestion(false);
        if (res?.data?.response?.responseData == true) {
          settotalScore(totalScore + score), assest();
        } else {
          settotalScore(totalScore - score);
        }

        // setquestion(res?.data?.response?.responseData);
      });
  };

  const startQuiz = () => {
    const URL = `${urlPrefix}v1.0/getHRAQuestions?hraId=1`;
    return axios
      .get(URL, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
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
        setquestion(res?.data?.response?.responseData);
      });
  };
  const AssismentCard = () => {
    const adminurl = `${urlPrefix}v1.0/getAssistmentCard?challengerZoneId=${eventID}`;
    return axios
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
        console.log(res, "assment card");
        setCardDetails(res.data.response.responseData);
      });
  };

  const getActivitySubEvent = () => {
    let URL = `${urlPrefix}${getSubEvent}?eventId=${eventID}`;

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
        for (var i = 0; i < arr.length; i++) {
          console.log(arr[i], "arra");
          let data = arr[i];
          // setProgramList(
          setProgramList(
            res.data.response.responseData.filter((item) => {
              return item?.id == arr[i];
            })
          );
          // );
          // res.data.response.responseData;
          programList.push(programList1);
        }
      });
  };
  console.log(programList, programList1, "programlist");
  const handleSubscription = () => {
    getActivitySubEvent();
  };
  const selectOption = (val, id, mark) => {
    setscore(mark);
    optionId.push(parseInt(val));
  };
  return (
    <>
      {cardDetails && cardDetails.hac.length > 0 ? (
        <>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {cardDetails &&
              cardDetails.hac.map((curr) => {
                return (
                  <>
                    <div
                      className="challenge-card"
                      style={{
                        margin: "25px 5px",
                        height: "auto",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: 230,
                          height: 100,
                          borderRadius: "12px 12px 0px 0px",
                          background: "#fff",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <img
                          // src={subEventDetail.eventImage || eventGalleryNoData}
                          src={curr.imgPath}
                          style={{
                            width: 230,
                            height: 100,
                            objectFit: "cover",
                            borderRadius: "12px 12px 0px 0px",
                          }}
                          // onError={(e) => {
                          //   e.target.onerror = null;
                          //   e.target.src = eventGalleryNoData;
                          // }}
                        />
                      </div>
                      <div className="challenge-card-details">
                        <div className={"challenge-card-details-name"}>
                          {curr.assesmentName}
                        </div>
                        <div className="register-button">
                          <button
                            style={{ marginBottom: "10px" }}
                            onClick={Assessment}
                          >
                            Assessment
                          </button>
                        </div>
                        <div className="challenge-card-start-date1">
                          <InfoIcon
                            style={{ fontSize: 18, color: "#1e88e5" }}
                            onClick={() => setModalView(true)}
                          />
                        </div>
                      </div>

                      {profileModal && (
                        <InfoDialog
                          open={profileModal}
                          handleClose={() => setProfileModal(false)}
                        >
                          <CancelIcon
                            style={{
                              position: "absolute",
                              top: 5,
                              right: 5,
                              color: "#ef5350",
                              cursor: "pointer",
                            }}
                            onClick={() => setProfileModal(false)}
                          />
                          <div style={{ height: "200px", width: "500px" }}>
                            <div
                              style={{ display: "flex", marginLeft: "10px" }}
                            >
                              <div style={{ width: "50%" }}>
                                <label>DOB</label>
                                <input
                                  autofocus="autofocus"
                                  style={{
                                    background: "#f3f4f6",
                                    padding: "10px 10px",
                                    borderRadius: 6,
                                    fontSize: 12,
                                    width: "90%",
                                    border: "1px solid black",
                                  }}
                                  type="date"
                                  name="dob"
                                  onChange={handleChange}
                                  value={cardDetails.dob}
                                  disabled={
                                    cardDetails.dob !== null ? true : false
                                  }
                                />
                              </div>
                              <div style={{ width: "50%" }}>
                                <label>Gender</label>
                                <input
                                  autofocus="autofocus"
                                  style={{
                                    background: "#f3f4f6",
                                    padding: "10px 10px",
                                    borderRadius: 6,
                                    fontSize: 12,
                                    width: "90%",
                                    border: "1px solid black",
                                  }}
                                  name="gender"
                                  placeholder="Enter Your Gender"
                                  onChange={handleChange}
                                  value={cardDetails.gender}
                                  disabled={
                                    cardDetails.gender !== null ? true : false
                                  }
                                />
                              </div>
                            </div>
                            <div
                              style={{ display: "flex", marginLeft: "10px" }}
                            >
                              <div style={{ width: "50%" }}>
                                <label>City</label>
                                <input
                                  autofocus="autofocus"
                                  style={{
                                    background: "#f3f4f6",
                                    padding: "10px 10px",
                                    borderRadius: 6,
                                    fontSize: 12,
                                    width: "90%",
                                    border: "1px solid black",
                                  }}
                                  name="city"
                                  onChange={handleChange}
                                  value={cardDetails.location}
                                  disabled={
                                    cardDetails.location !== null ? true : false
                                  }
                                />
                              </div>
                              <div style={{ width: "50%" }}>
                                <button
                                  style={{
                                    backgroundColor: "green",
                                    color: "white",
                                    marginTop: "10%",
                                    marginLeft: "50%",
                                    borderRadius: "10px",
                                    height: "40px",
                                    width: "80px",
                                  }}
                                  onClick={updateProfile}
                                >
                                  {" "}
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        </InfoDialog>
                      )}

                      {modalView && (
                        <AssessmentInfo
                          modalView={modalView}
                          setModalView={setModalView}
                          details={cardDetails.hac}
                        />
                      )}
                    </div>

                    {quiz && (
                      <HraQuiz
                        modalView={quiz}
                        question={question}
                        setModalView={setQuiz}
                        startQuiz={startQuiz}
                      />
                    )}
                  </>
                );
              })}
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={dataSource} width={400} height={200} />
          <span style={{ margin: "1rem" }}>No Data</span>
        </div>
      )}
      {nextquestion == true ? (
        <Paper elevation={3} className="quizPart flex flex-col" style={{}}>
          <div
            className="question bg-slate-200 pt-3 pb-3 pl-1 pr-1 mt-8 ml-8"
            style={{
              width: "650px",
              padding: "20px",
              borderRadius: "20px",
              fontSize: "18px",
            }}
          >
            <span className="font-extrabold">
              {" "}
              {question && question.hraQuestionId} .{" "}
            </span>
            <span className=" font-semibold">
              {" "}
              {question && question.question}{" "}
            </span>
          </div>

          <div className="flex ">
            {" "}
            <div className="flex flex-col pb-4 ml-8">
              <div className="answers mt-3 p-2">
                {question && question.ansType == "SINGLE" ? (
                  question.hraOptions?.map((item, index) => {
                    return (
                      <div
                        style={{ width: "600px" }}
                        className="p-2 flex flex-col rounded-full bg-slate-50 mt-8 drop-shadow-md pointer"
                      >
                        {" "}
                        <div>
                          <input
                            type="radio"
                            name="teamselect"
                            value={item.optionScore}
                            onChange={(e) => {
                              selectOption(
                                e.target.value,
                                item.id,
                                item.optionScore
                              );
                            }}
                            style={{ marginRight: "15px" }}
                            id={index}
                          />
                          <label for={index} classNamem="p-3">
                            {item.optionText}
                          </label>
                        </div>
                      </div>
                    );
                  })
                ) : question && question.ansType == "MULTIPLE" ? (
                  question.hraOptions?.map((item, index) => {
                    return (
                      <div
                        style={{ width: "600px" }}
                        className="p-1 flex flex-col rounded-full bg-slate-50 mt-8 drop-shadow-md pointer"
                      >
                        {" "}
                        <div>
                          <Checkbox
                            id={index}
                            onChange={handleCheck}
                            name={item.id}
                            style={{ fontSize: 9 }}
                            inputProps={{
                              "aria-label": "uncontrolled-checkbox",
                            }}
                          />
                          <label for={index} classNamem="p-3">
                            {item.optionText}{" "}
                          </label>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ width: "600px" }}>
                    <TextField
                      style={{ width: "300px", marginTop: "20px" }}
                      type="text"
                      multiline
                      label="Write Your Answer"
                      onChange={(e) => {
                        settextAns(e.target.value);
                        setoptionId([0]);
                        // optionId.push(0);
                      }}
                    />
                  </div>
                )}
              </div>
              <div
                style={{
                  width: "140px",
                  height: "35px",
                  padding: "15px",
                }}
                className="drop-shadow-lg flex justify-end"
              >
                {isnext && (
                  <PrimaryButton
                    onClick={() => {
                      submitAnswer(
                        1,
                        question.hraQuestionId,
                        optionId,
                        textAns
                      );
                      setoptionId([]);
                    }}
                  >
                    Submit{" "}
                  </PrimaryButton>
                )}
              </div>
            </div>
          </div>
        </Paper>
      ) : nextquestion == false ? (
        <Paper
          elevation={3}
          style={{
            height: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {scoreDetails && (
            <div
              style={{
                marginTop: "30px",
                marginLeft: "30px",
                display: "flex",
                justifyContent: "space-around",
                background: "gray",
                color: "#fff",
                width: "600px",
                padding: "15px",
                borderRadius: "25px",
              }}
            >
              <h2> Assessment : {scoreDetails.assesmentName} </h2>{" "}
              <h2> Total score : {scoreDetails.totalScore} </h2>{" "}
            </div>
          )}
        </Paper>
      ) : (
        ""
      )}
      {/* <RecommededProgram /> */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {programList.map((subEventDetail) => (
          <>
            <SubEventCard
              subEventDetail={subEventDetail}
              currentEventObj={currentEventObj}
              handleSubscription={handleSubscription}
              type="view"
            />
          </>
        ))}
      </div>
      {/* <subEventCards subEventDetail={programList} /> */}
    </>
  );
};
export default RecommendedProgram;
