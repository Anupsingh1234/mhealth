import React, { useState } from "react";
import OtpInput from "react-otp-input";
import ReactLoadingWrapper from "../loaders/ReactLoadingWrapper";
import { getAllEvents } from "../../services/apicollection";
import { urlPrefix } from "../../services/apicollection";
import { secretToken } from "../../services/apicollection";
import axios from "axios";
const CodeMatch = (props) => {
  const [code, setcode] = useState("");
  const [email, setemail] = useState("");
  const [verify, setverify] = useState(0);
  const handleCode = () => {
    console.log(code);
    localStorage.setItem("webLite", "false");
    const url = `${urlPrefix}${getAllEvents}?others=all&userId=559`;
    return axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${secretToken}`,
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
        var marvelHeroes = res?.data?.response?.responseData?.events.filter(
          function (hero) {
            const x = hero.registrationCode == code;
            return x;
          }
        );

        localStorage.setItem("evid", marvelHeroes[0].id);

        setverify(marvelHeroes[0].verificationRequired);
        {
          marvelHeroes[0].verificationRequired == 0
            ? props.parenthandel("divyanshu")
            : "";
        }
      });
  };

  return (
    <>
      <div
        className="fadeInUp"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          className="login-form"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* new code from here  */}

          <div
            className="mhealth-input-box padding-025em"
            style={{
              marginTop: "90%",
              marginLeft: 10,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <input
              placeholder="Enter Event code"
              value={code}
              onChange={(e) => {
                setcode(e.target.value), code.length == 0 ? setverify(0) : "";
              }}
              style={{ width: "100%", height: "40px", marginLeft: "10px" }}
            />
            {verify == 1 && code.length > 0 ? (
              <input
                // style={{ }}
                placeholder="Enter verification email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                style={{
                  width: "100%",
                  height: "40px",
                  marginLeft: "10px",
                  marginTop: 15,
                }}
              />
            ) : (
              ""
            )}
          </div>

          {/* new code end here */}
        </div>
      </div>

      <div className="submit-button fadeInUp" style={{ margin: "1em 0" }}>
        {code.length == 0 ? (
          <div className="loader">
            <ReactLoadingWrapper
              color={"#518ad6"}
              height={"10%"}
              width={"10%"}
              type={"spin"}
            />
          </div>
        ) : verify == 0 ? (
          <button
            className={code.length !== 0 ? "is-success" : "is-disabled"}
            disabled={code.length !== 0 ? false : true}
            onClick={() => {
              handleCode();
            }}
          >
            Continue
          </button>
        ) : (
          <button
            className={email.length !== 0 ? "is-success" : "is-disabled"}
            disabled={email.length !== 0 ? false : true}
            onClick={() => {
              props.parenthandel("divyanshu");
            }}
          >
            Continue
          </button>
        )}
      </div>
    </>
  );
};

export default CodeMatch;
