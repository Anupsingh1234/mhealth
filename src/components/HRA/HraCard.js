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
import moment from "moment";
const HraCard = (eventID, currentEventObj) => {
  const [profileModal, setProfileModal] = useState(false);
  const [arr, setArr] = useState([]);
  const [quiz, setQuiz] = useState(false);
  const [modalView, setModalView] = useState(false);
  //  const [cardDetails, setCardDetails] = useState();
  const [profilePayload, setProfilePayload] = useState();
  const [question, setquestion] = useState();
  const [programList1, setProgramList] = useState([]);
  const programList = [];
  const [dataList, setDataList] = useState([]);
  const [cardId, setcardId] = useState();
  const Assessment = (id) => {
    if (dataList.profileComplete === true) {
  
     localStorage.setItem("cardId",id)
      submitAnswer(localStorage.getItem("userId"), 0, 0, 0), id;
      startQuiz(id);
    } else {
      setProfileModal(true);
    }
  };
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
      card();
      setProfileModal(false);
      setProfilePayload();
    });
  };
  useEffect(()=>{
card()
setscoreDetails()
setcardDetails()
setProgramList()
  },[eventID])
  const [subcard, setsubcard] = useState(false);
  const [optionId, setoptionId] = useState([]);
  const [score, setscore] = useState();
  const [isnext, setisnext] = useState(true);
  const [totalScore, settotalScore] = useState(0);
  const [textAns, settextAns] = useState(null);
  const [nextquestion, setnextquestion] = useState();
  const [scoreDetails, setscoreDetails] = useState();
  const [cardDetails, setcardDetails] = useState();

  const [flag, setflag] = useState(false);
  const [Option, setOption] = useState();
 
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
  console.log(optionId);
  useEffect(() => {
    nextquestion == false ? scoreCall() : "";
    flag == false ? card() : "";
  }, [nextquestion]);

  const card = (e) => {
    const URL = `${urlPrefix}v1.0/getAssistmentCard?challengerZoneId=${localStorage.getItem(
      "selectEvent"
    )}`;
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
        console.log();
        {
          res.data.response.responseData &&
            setcardDetails(res.data.response.responseData.hac);
          setDataList(res.data.response.responseData);
          console.log(res.data.response.responseData);
        }

        // setscoreDetails(res?.data?.response?.responseData);
      });
  };

  const scoreCall = () => {
    const URL = `${urlPrefix}v1.0/getHRAScoreCard?hraId=${cardId}`;
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
        setArr(res?.data?.response?.responseData?.recommendProgram);
        getActivitySubEvent(
          res?.data?.response?.responseData?.recommendProgram
        );
      });
  };
  
  const submitAnswer = (hraid, questionid, option, freetext) => {
    settextAns(null);
    setflag(true);
    setoptionId([]);
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
          settotalScore(totalScore + score);
          startQuiz(cardId);
          settextAns("")
        } else {
          settotalScore(totalScore - score);
        }

        // setquestion(res?.data?.response?.responseData);
      });
  };
  const quizFunction = (id) => {
   
  };
  console.log(nextquestion,cardId,'cardid');
  const startQuiz = (id) => {
    const URL = `${urlPrefix}v1.0/getHRAQuestions?hraId=${localStorage.getItem("cardId")}`;
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
        if (res?.data?.response?.responseData.hraQuestionId != null) {
          setquestion(res?.data?.response?.responseData), setnextquestion(true);
        } else {
          setnextquestion(false);
        }
        res?.data?.response?.responseData.ansType == "TEXT"
          ? setOption(res?.data?.response?.responseData?.hraOptions)
          : "";
      });
  };
 
  const getActivitySubEvent = (arr) => {
    let URL = `${urlPrefix}${getSubEvent}?eventId=${localStorage.getItem(
      "selectEvent"
    )}`;

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
        const list=[]
        for (var i = 0; i < arr.length; i++) {
          console.log(arr[i], "arra");
         
        const data = res.data.response.responseData.filter((item) => {
              return item?.id == arr[i];
            })
           
            
            list.push(...data)
            console.log(data,list,'data')
         
        }
        setProgramList(list)
      
        setsubcard(true);
       
      });
  };
  const listed=(data)=>{
    programList.push(data);
  }
  console.log(programList1, programList,"list");
  const handleSubscription = () => {
    getActivitySubEvent();
  };
  const selectOption = (val, id, mark) => {
    setscore(mark);
    optionId.push(parseInt(val));
  };
  return (
    <>
      {cardDetails && cardDetails.length > 0 && dataList? (
        <>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <div
              // onClick={() => {
              //   localStorage.setItem("eventCode", subEventDetail.eventCode);
              // }}
              className="challenge-card"
              style={
                {
                  margin: "25px 5px",
                  height: "auto",
                  cursor: "pointer",
                }
                // : { height: "auto" }
              }
            >
              {cardDetails &&
                cardDetails.map((item, index) => {
                  return (
                    <>
                      {" "}
                      <div
                        key={index}
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
                          src={item.imgPath}
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
                          {/* {subEventDetail.eventName} */}
                          {item.assesmentName}
                        </div>
                        <div className="register-button">
                          <PrimaryButton
                            style={{ marginBottom: "10px" }}
                            onClick={()=>{Assessment(item.id);setcardId(item.id);}}
                          >
                            Assessment
                          </PrimaryButton>
                        </div>
                        <div className="challenge-card-start-date1">
                          <InfoIcon
                            style={{ fontSize: 18, color: "#1e88e5" }}
                            onClick={() => setModalView(true)}
                          />
                        </div>
                      </div>
                    </>
                  );
                })}

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
                    <div style={{ display: "flex", marginLeft: "10px" }}>
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
                          value={
                            dataList.dob !== null
                              ? dataList.dob.substring(0, 10)
                              : dataList.dob
                          }
                          disabled={dataList.dob !== null ? true : false}
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
                          value={dataList.gender}
                          disabled={dataList.gender !== null ? true : false}
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex", marginLeft: "10px" }}>
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
                          value={dataList.location}
                          disabled={dataList.location !== null ? true : false}
                        />
                      </div>
                      <div style={{ width: "50%" }}>
                        <PrimaryButton
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
                        </PrimaryButton>
                      </div>
                    </div>
                  </div>
                </InfoDialog>
              )}
              {modalView && (
                <AssessmentInfo
                  modalView={modalView}
                  setModalView={setModalView}
                  details={cardDetails}
                />
              )}
            </div>
          </div>
        
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
                            value={item.id}
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
                      value={textAns}
                      multiline
                      label="Write Your Answer"
                      onChange={(e) => {
                        settextAns(e.target.value);
                        setoptionId([Option && Option[0]?.id]);
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
                        localStorage.getItem("cardId"),
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
      ) : scoreDetails && nextquestion == false ? (
        <Paper
          elevation={3}
          style={{
            minHeight: "200px",
            maxHeight:'auto',
            // display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            
          }}
          
        >
                   
          <div style={{
                marginTop: "30px",
                marginLeft: "25%",
                display: "flex",
                justifyContent: "space-around",
                background: "gray",
                color: "#fff",
                width: "600px",
                padding: "15px",
                borderRadius: "25px",
                position:'relative'
                // margin:'10px 10px 10px'
              }}
            >
              <h2> Assessment : {scoreDetails.assesmentName} </h2>{" "}
              <h2> Total score : {scoreDetails.totalScore} </h2>{" "}

              
            </div>
            <div style={{
                marginTop: "30px",
                marginLeft: "30px",
                display: "flex",
                
                width: "90%",
                padding: "15px",
                borderRadius: "25px",
                textAlign:'justify'
              }}>  
              
              <div style={{width:'10%',fontWeight:'800',fontSize:'14px'}}>
              Assessments :
                </div>
                <div style={{width:'90%'}}>
                {scoreDetails.recommedations} 
                </div>
              </div>
           
    

        </Paper>
      ) : (
        ""
      )}
      {programList1&&programList1.length>0&&(<>
      <h1>Recommended Program</h1>
      
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {programList1.map((subEventDetail) => (
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
    </>)}</>
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
    </>
  );
};
export default HraCard;
