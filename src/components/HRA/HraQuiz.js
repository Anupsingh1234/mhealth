import { TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../Form";
import InfoDialog from "../Utility/InfoDialog";
import axios from "axios";
import { urlPrefix, secretToken } from "../../services/apicollection";

const HraQuiz = ({ modalView, setModalView, question, startQuiz }) => {
  const [questions, setquestions] = useState();
  useEffect(() => {
    setquestions(question);
  });

  const [optionId, setoptionId] = useState([]);
  const [score, setscore] = useState();
  const [isnext, setisnext] = useState(true);
  const [totalScore, settotalScore] = useState();
  const [textAns, settextAns] = useState("");
  console.log(questions && questions, optionId);

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
    console.log(optionId);
  };

  const submitAnswer = (hraid, questionid, option, freetext) => {
    const URL = `${urlPrefix}v1.0/submitHraAnswer`;
    return axios
      .post(
        URL,
        {
          hraId: hraid,
          hraQuestionId: questionid,
          optionId: [option],
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
        res?.data?.response?.responseData &&
        res?.data?.response?.responseData == true
          ? settotalScore(totalScore + score)
          : settotalScore(totalScore - score);
        // setquestion(res?.data?.response?.responseData);
      });
  };

  return (
    <div>
      {modalView && (
        <InfoDialog open={modalView}>
          <div
            className="quizPart flex justify-center items-center flex-col"
            style={{ width: "600px", height: "500px" }}
          >
            <div className="question bg-slate-200 pt-3 pb-3 pl-1 pr-1">
              <span className="font-extrabold">
                {" "}
                {questions && questions.hraQuestionId} .{" "}
              </span>
              <span className=" font-semibold">
                {" "}
                {questions && questions.question}{" "}
              </span>
            </div>

            <div className="answers mt-5 p-2">
              {questions && questions.ansType == "SINGLE" ? (
                questions.hraOptions?.map((item, index) => {
                  return (
                    <p
                      key={index}
                      className="p-2 rounded-full bg-slate-50 mt-3 drop-shadow-md pointer"
                      onClick={() => {
                        setoptionId(item.id);
                        setscore(item.optionScore);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {item.optionText}{" "}
                    </p>
                  );
                })
              ) : questions && questions.ansType == "MULTIPLE" ? (
                questions.hraOptions?.map((item, index) => {
                  return (
                    <div className="p-2 flex flex-col rounded-full bg-slate-50 mt-3 drop-shadow-md pointer">
                      {" "}
                      <div>
                        <input
                          id={index}
                          type="checkbox"
                          onChange={handleCheck}
                          name={item.id}
                        />
                        <label for={index} key={index} classNameml="p-3">
                          {item.optionText}{" "}
                        </label>
                      </div>
                    </div>
                  );
                })
              ) : (
                <TextField
                  type="text"
                  onChange={(e) => {
                    settextAns(e.target.value);
                  }}
                />
              )}
            </div>
            <div
              style={{
                width: "120px",
                height: "35px",
                padding: "15px",
                marginLeft: "300px",
              }}
              className="drop-shadow-lg"
            >
              {isnext && (
                <PrimaryButton
                  onClick={() => {
                    startQuiz();
                    submitAnswer(
                      questions.hraQuestionId,
                      questions.hraId,
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
        </InfoDialog>
      )}
    </div>
  );
};
export default HraQuiz;
