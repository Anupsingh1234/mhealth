import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { urlPrefix } from "../services/apicollection";
import axios from "axios";
import { Modal } from "react-responsive-modal";
import ReactTooltip from "react-tooltip";
import CancelIcon from "@material-ui/icons/Cancel";

const SundayChallenge = (props) => {
  const [streak, setstreak] = useState({});
  const [average, setaverage] = useState({});
  const [distance, setdistance] = useState({});
  const [value, setvalue] = useState("");
  const [action, setaction] = useState("");
  const [type, settype] = useState("");
  const [distanceTrack, setdistanceTrack] = useState({});
  const [averageTrack, setaverageTrack] = useState({});
  const [streakTrack, setstreakTrack] = useState({});
  const [joinModal, setjoinModal] = useState(false);
  const onjoinModal = (a, b, c) => {
    console.log(a, b, c);
    setaction(a);
    settype(b);
    setvalue(c);
    if (b === "DAY") {
      randomStreak(a, b, c, props.eventId);
    }
    if (b === "KM") {
      randomkm(a, b, c, props.eventId);
    }
    if (b === "AVG") {
      randomAvg(a, b, c, props.eventId);
    }
    setjoinModal(true);
  };
  const onclosejoinModal = () => {
    getData();
    setjoinModal(false);
  };

  let day = new Date();
  let currDay = day.getDay();
  console.log(currDay, "currDay");
  const getData = () => {
    const url = `${urlPrefix}v1.0/throwWeeklySundayChallenge?challengerZoneId=${props.eventId}
    `;

    return axios
      .get(url, {
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
        {
          res.data.response.responseData?.kmSundayChallenge
            ? setdistance(res.data.response.responseData?.kmSundayChallenge)
            : setdistance({});
        }
        {
          res.data.response.responseData?.weekAvgSundayChallenge
            ? setaverage(res.data.response.responseData.weekAvgSundayChallenge)
            : setaverage({});
        }
        {
          res.data.response.responseData?.streakSundayChallenge
            ? setstreak(res.data.response.responseData?.streakSundayChallenge)
            : setstreak({});
        }
      });
  };

  const acceptOrReject = (a, b, c, d) => {
    const url = `${urlPrefix}v1.0/acceptOrIgnoreSundayChallenge?challengeAction=${a}&challengeType=${b}&challengeValue=${c}&challengerZoneId=${d}`;

    return axios
      .post(
        url,
        {},
        {
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
      .then(() => {
        trackPerformance();
        onclosejoinModal();
      });
  };

  const closeIcon = (
    <svg
      fill="#000000"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 30"
      width="30px"
      height="30px"
    >
      {" "}
      <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z" />
    </svg>
  );

  const trackPerformance = () => {
    const url = `${urlPrefix}v1.0/trackPerformanceOfChallenge?challengerZoneId=${props.eventId}
`;
    return axios
      .put(
        url,
        {},
        {
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
        {
          res.data.response.responseData?.kmPerformance
            ? setdistanceTrack(res.data.response.responseData.kmPerformance)
            : setdistanceTrack({});
        }
        {
          res.data.response.responseData?.avgPerformance
            ? setaverageTrack(res.data.response.responseData.avgPerformance)
            : setaverageTrack({});
        }
        {
          res.data.response.responseData?.dayPerformance
            ? setstreakTrack(res.data.response.responseData.dayPerformance)
            : setstreakTrack({});
        }
      });
  };

  const randomAvg = (a, b, c, d) => {
    const url = `${urlPrefix}v1.0/throwChallengeAfterIgnoreOrRandom?challengeAction=${a}&challengeType=${b}&challengeValue=${c}&challengerZoneId=${d}
`;
    return axios
      .get(url, {
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
        {
          res.data.response.responseData &&
          res.data.response.responseData?.weekAvgSundayChallenge
            ? setaverage(res.data.response.responseData.weekAvgSundayChallenge)
            : setaverage({});
        }
      });
  };

  const randomStreak = (a, b, c, d) => {
    const url = `${urlPrefix}v1.0/throwChallengeAfterIgnoreOrRandom?challengeAction=${a}&challengeType=${b}&challengeValue=${c}&challengerZoneId=${d}
`;
    return axios
      .get(url, {
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
        {
          res.data.response.responseData &&
          res.data.response.responseData?.streakSundayChallenge
            ? setstreak(res.data.response.responseData?.streakSundayChallenge)
            : setstreak({});
        }
      });
  };

  const randomkm = (a, b, c, d) => {
    const url = `${urlPrefix}v1.0/throwChallengeAfterIgnoreOrRandom?challengeAction=${a}&challengeType=${b}&challengeValue=${c}&challengerZoneId=${d}
`;
    return axios
      .get(url, {
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
        {
          res.data.response.responseData &&
          res.data.response.responseData?.kmSundayChallenge
            ? setdistance(res.data.response.responseData?.kmSundayChallenge)
            : setdistance({});
        }
      });
  };

  let today = new Date().toISOString().slice(0, 10);
  useEffect(() => {
    getData();
    trackPerformance();
  }, [props.eventId]);

  return (
    <>
      <Modal
        open={joinModal}
        styles={{ modal: { borderRadius: "10px" } }}
        onClose={onclosejoinModal}
        center
        closeIcon={closeIcon}
      >
        {/* <CancelIcon
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            color: "#ef5350",
            cursor: "pointer",
          }}
        /> */}

        <div
          style={{
            padding: "20px",
            paddingLeft: "5px",
            paddingBottom: "0px",
            paddingTop: "10px",
          }}
        >
          {type === "DAY" ? (
            <Card
              style={{
                width: "370px",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <CardContent>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ width: "85%", marginLeft: -20 }}>
                    {" "}
                    <img
                      style={{ height: 100, width: 100 }}
                      src={streak && streak.streakLogo}
                    />
                  </div>
                  <div>
                    <>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{ marginLeft: 20, fontSize: 12 }}
                      >
                        Your Previous Best Streak was of{" "}
                        <strong> {streak && streak.eventHighestStreak} </strong>{" "}
                        Days. Achieved between{" "}
                        <strong> {streak && streak.streakToDate} </strong> and{" "}
                        <strong> {streak && streak.streakFromDate} </strong>
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{ marginTop: 5, marginLeft: 20, fontSize: 12 }}
                      >
                        Would you like to up the mark and accept a challenge for{" "}
                        <strong>
                          {" "}
                          {streak &&
                            streak.streakChallenge &&
                            streak.streakChallenge}{" "}
                        </strong>{" "}
                        Days?
                        <p>
                          {" "}
                          <strong>
                            {" "}
                            <span style={{ color: "red" }}>* </span>
                            Target to be achieved on or before{" "}
                            <strong>
                              {" "}
                              {streak && streak.targetedStreakDate}.{" "}
                            </strong>{" "}
                          </strong>{" "}
                        </p>
                      </Typography>
                    </>
                  </div>
                </div>
              </CardContent>
              <CardActions
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: -15,
                }}
              >
                {" "}
                <button
                  style={{
                    borderRadius: 24,
                    padding: "2px 8px",
                    marginRight: "0.5rem",
                  }}
                  className="is-success"
                  onClick={() => {
                    acceptOrReject(
                      "accept",
                      "DAY",
                      streak ? streak.streakChallenge : "",
                      props.eventId
                    );
                  }}
                >
                  Accept
                </button>
                <button
                  style={{
                    background: "#F43F5E",
                    color: "white",
                    borderRadius: 24,
                    padding: "2px 8px",
                  }}
                  onClick={() => {
                    acceptOrReject(
                      "ignore",
                      "DAY",
                      streak ? streak.streakChallenge : "",
                      props.eventId
                    );
                  }}
                >
                  Ignore
                </button>
              </CardActions>
            </Card>
          ) : type === "KM" ? (
            <Card
              style={{
                width: "370px",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <CardContent>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ width: "85%", marginLeft: -20 }}>
                    {" "}
                    <img
                      style={{ height: 100, width: 100 }}
                      src={distance && distance.kmLogo}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{ marginLeft: 20, fontSize: 12, wordSpacing: 3 }}
                      >
                        Your Previous Best Distance covered in a day was of{" "}
                        <strong> {distance && distance.eventMaxKM} </strong>
                        KMs.Achieved on
                        <strong> {distance && distance.maxKMDate} </strong>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{
                          marginLeft: 20,
                          fontSize: 12,
                          marginTop: 5,
                          wordSpacing: 3,
                        }}
                      >
                        {" "}
                        Would you like to up the mark and accept a challenge for{" "}
                        <strong> {distance && distance.kmchallenge} </strong>
                        KMs?
                        <p>
                          {" "}
                          <strong>
                            {" "}
                            <span style={{ color: "red" }}>* </span>
                            Target to be achieved on or before{" "}
                            <strong>
                              {" "}
                              {distance && distance.targetedKmDate}.{" "}
                            </strong>
                          </strong>{" "}
                        </p>
                      </Typography>
                    </>
                  </div>
                </div>
              </CardContent>
              <CardActions
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: -15,
                }}
              >
                {" "}
                <button
                  style={{
                    borderRadius: 24,
                    padding: "2px 8px",
                    marginRight: "0.5rem",
                  }}
                  className="is-success"
                  onClick={() => {
                    acceptOrReject(
                      "accept",
                      "KM",
                      distance ? distance.kmchallenge : "",
                      props.eventId
                    );
                  }}
                >
                  Accept
                </button>
                <button
                  style={{
                    background: "#F43F5E",
                    color: "white",
                    borderRadius: 24,
                    padding: "2px 8px",
                  }}
                  onClick={() => {
                    acceptOrReject(
                      "ignore",
                      "KM",
                      distance ? distance.kmchallenge : "",
                      props.eventId
                    );
                  }}
                >
                  Ignore
                </button>
              </CardActions>
            </Card>
          ) : type === "AVG" ? (
            <Card
              style={{
                width: "370px",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <CardContent>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ width: "85%", marginLeft: -20 }}>
                    {" "}
                    <img
                      style={{ height: 100, width: 100 }}
                      src={average && average.avgLogo}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ marginLeft: 20, fontSize: 12, wordSpacing: 3 }}
                    >
                      Your Previous Best Weekly average was of{" "}
                      {average && average.eventMaxWeekAverage} KMs/Week.
                      Achieved from {average && average.weekAvgFromDate} to{" "}
                      {average && average.weekAvgToDate}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{
                        marginLeft: 20,
                        marginTop: 5,
                        fontSize: 12,
                        wordSpacing: 3,
                      }}
                    >
                      Would you like to up the mark and accept a challenge for{" "}
                      {average && average.weekAvgChallenge}
                      KMs/Week?
                      <p>
                        {" "}
                        <strong>
                          {" "}
                          <span style={{ color: "red" }}>* </span>
                          Target to be achieved on or before{" "}
                          {average && average.targetedAvgDate}.{" "}
                        </strong>{" "}
                      </p>
                    </Typography>
                  </div>
                </div>
              </CardContent>
              <CardActions
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: -15,
                }}
              >
                <div>
                  <button
                    style={{
                      borderRadius: 24,
                      padding: "2px 8px",
                      marginRight: "0.5rem",
                    }}
                    className="is-success"
                    onClick={() => {
                      acceptOrReject(
                        "accept",
                        "AVG",
                        average ? average.weekAvgChallenge : "",
                        props.eventId
                      );
                    }}
                  >
                    Accept
                  </button>
                  <button
                    style={{
                      background: "#F43F5E",
                      color: "white",
                      borderRadius: 24,
                      padding: "2px 8px",
                    }}
                    // onClick={() =>
                    //   onjoinModal(
                    //     'ignore',
                    //     'AVG',
                    //     average ? average.weekAvgChallenge : ''
                    //   )
                    // }
                    onClick={() => {
                      acceptOrReject(
                        "ignore",
                        "AVG",
                        average ? average.weekAvgChallenge : "",
                        props.eventId
                      );
                    }}
                  >
                    Ignore
                  </button>{" "}
                </div>
              </CardActions>
            </Card>
          ) : (
            ""
          )}
        </div>
      </Modal>
      <div
        className="sundayCrds"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 25,
        }}
      >
        <Card
          style={{
            width: "370px",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        >
          <div>
            <div
              style={{
                color: "white",
                marginTop: "-10px",
                display: "flex",
                justifyContent: "center",
                background: "#95a5a6",
                height: 45,
              }}
            >
              <div style={{ display: "flex" }}>
                <h2 style={{ marginLeft: 150, marginTop: 16 }}> Streak </h2>
                <ReactTooltip multiline={true} className="reactTool" />{" "}
                <div
                  style={{ marginLeft: 130 }}
                  data-tip="Streak is defined as Number of days walked in continuation without taking any break.<br/>
                            Challenge will start from your accepted date and will continue till the target date. <br/>
                            You can see your progress on card, and on completion of target,<br/>
                             you will earn a badge which can be viewed in Achievement section of leaderboard."
                  data-multiline="true"
                >
                  <CardMedia
                    style={{ marginTop: 18, float: "right" }}
                    component="img"
                    height="20"
                    width="20"
                    image="https://walkathon21.s3.ap-south-1.amazonaws.com/logo/Info.png"
                  />
                </div>{" "}
              </div>
            </div>

            {(streak && streak.streakChallenge !== null) ||
            streakTrack.challengeAction === "IGNORE" ||
            streakTrack.challengeAction === "ACCEPT" ? (
              <CardContent>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ width: "85%", marginLeft: -20 }}>
                    {" "}
                    {(streakTrack &&
                      streakTrack.challengeAction === "IGNORE") ||
                    streakTrack.challengeAction === "NO_ACTION_PERFORM" ? (
                      <img
                        style={{ height: 100, width: 100 }}
                        src={streakTrack && streakTrack.errorImage}
                      />
                    ) : streakTrack.challengeAction === "ACCEPT" ? (
                      <img
                        style={{ height: 100, width: 100 }}
                        src={streakTrack.dayLogo}
                      />
                    ) : streakTrack.challengeAction === "NO_CHALLENGE" ? (
                      <img
                        style={{ height: 100, width: 100 }}
                        src={
                          streak ? streak.streakLogo : streakTrack.streakLogo
                        }
                      />
                    ) : (
                      <>
                        {" "}
                        <img
                          style={{ height: 100, width: 100 }}
                          src={
                            streak ? streak.streakLogo : streakTrack.streakLogo
                          }
                        />{" "}
                      </>
                    )}
                  </div>
                  {streakTrack &&
                  streakTrack.challengeAction === "NO_CHALLENGE" ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        wordSpacing: 3,
                      }}
                    >
                      <>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          style={{ marginLeft: 20, fontSize: 12 }}
                        >
                          Your Previous Best Streak was of{" "}
                          <strong>
                            {" "}
                            {streak && streak.eventHighestStreak}{" "}
                          </strong>{" "}
                          Days. Achieved between{" "}
                          <strong> {streak && streak.streakToDate} </strong> and{" "}
                          <strong> {streak && streak.streakFromDate} </strong>
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          style={{ marginTop: 5, marginLeft: 20, fontSize: 12 }}
                        >
                          Would you like to up the mark and accept a challenge
                          for{" "}
                          <strong>
                            {" "}
                            {streak &&
                              streak.streakChallenge &&
                              streak.streakChallenge}{" "}
                          </strong>{" "}
                          Days?
                          <p>
                            {" "}
                            <strong>
                              {" "}
                              <span style={{ color: "red" }}>* </span>
                              Target to be achieved on or before{" "}
                              <strong>
                                {" "}
                                {streak && streak.targetedStreakDate}.{" "}
                              </strong>{" "}
                            </strong>{" "}
                          </p>
                        </Typography>
                      </>
                    </div>
                  ) : (streakTrack &&
                      streakTrack.challengeAction === "IGNORE") ||
                    streakTrack.challengeAction === "NO_ACTION_PERFORM" ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        wordSpacing: 3,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{
                          marginLeft: 25,
                          fontSize: 15,
                          marginTop: 5,
                          wordSpacing: 3,
                        }}
                      >
                        {streakTrack.errorMsg}{" "}
                      </Typography>
                    </div>
                  ) : streakTrack &&
                    streakTrack.challengeAction === "ACCEPT" ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        wordSpacing: 3,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{
                          marginLeft: 25,
                          fontSize: 12,
                          marginTop: 5,
                          wordSpacing: 3,
                        }}
                      >
                        {streakTrack.streakStatus === "COMPLETED" ? (
                          <div>
                            WOW !! You have Succesfully achieved your target.
                          </div>
                        ) : streakTrack.streakStatus === "FAILED" ? (
                          <div>
                            Oops! Challenge is unachievable now. Better luck
                            next time
                          </div>
                        ) : (
                          <div>
                            <div>
                              {" "}
                              Challenge Accepted On:{" "}
                              {streakTrack.challengeThrowDate}{" "}
                            </div>
                            <div> Target Date: {streakTrack.targetDate} </div>
                            {/* Progress: Streak {Current Days}/{Target Days} */}
                            {/* Percentage Progress bar. */}
                          </div>
                        )}
                      </Typography>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </CardContent>
            ) : (
              <div
                style={{
                  // height: 400,
                  padding: "5px",

                  display: "flex",
                  flexDirection: "row",
                  fontSize: 12,

                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className=""
              >
                {" "}
                <div style={{ width: "30%" }}>
                  <img
                    style={{ height: 100, width: 100 }}
                    src="https://walkathon21.s3.ap-south-1.amazonaws.com/logo/Streak/S_0X_GreyScale_20210929.png"
                  />
                </div>
                <div>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ marginLeft: 20, fontSize: 12, wordSpacing: 3 }}
                  >
                    <h4 style={{ fontWeight: "lighter" }}>
                      {" "}
                      {/* Your random challenge is available */}
                      Your Previous Best Streak was of{" "}
                      {streak.eventHighestStreak} Days. Achieved between
                      {streak.streakFromDate} and {streak.streakToDate}
                    </h4>
                  </Typography>
                </div>
              </div>
            )}

            {(streak && streak.streakChallenge !== null) ||
            streakTrack.challengeAction === "IGNORE" ||
            streakTrack.challengeAction === "ACCEPT" ? (
              streakTrack &&
              streakTrack.challengeAction !== "NO_ACTION_PERFORM" ? (
                <CardActions
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    marginTop: -15,
                  }}
                >
                  {streakTrack &&
                  streakTrack.challengeAction === "NO_CHALLENGE" ? (
                    <div>
                      <button
                        style={{
                          borderRadius: 24,
                          padding: "2px 8px",
                          marginRight: "0.5rem",
                        }}
                        className="is-success"
                        onClick={() => {
                          acceptOrReject(
                            "accept",
                            "DAY",
                            streak ? streak.streakChallenge : "",
                            props.eventId
                          );
                        }}
                      >
                        Accept
                      </button>
                      <button
                        style={{
                          background: "#F43F5E",
                          color: "white",
                          borderRadius: 24,
                          padding: "2px 6px",
                        }}
                        onClick={() =>
                          onjoinModal(
                            "ignore",
                            "DAY",
                            streak ? streak.streakChallenge : ""
                          )
                        }
                      >
                        Change challenge
                      </button>
                    </div>
                  ) : streakTrack &&
                    streakTrack.challengeAction === "IGNORE" ? (
                    ""
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      {" "}
                      <div style={{ marginLeft: 20 }}>
                        {" "}
                        <ReactTooltip />
                        {streakTrack.streakStatus !== "COMPLETED" ? (
                          //
                          <div style={{ display: "flex" }}>
                            <progress
                              style={{ width: "280px" }}
                              id="file"
                              value={
                                streakTrack &&
                                parseInt(streakTrack.streakAverage)
                              }
                              max="100"
                              data-tip={Math.ceil(streakTrack.streakAverage)}
                            >
                              {" "}
                            </progress>
                            <p
                              style={{
                                fontSize: 12,
                                marginLeft: 15,
                                marginTop: -1,
                              }}
                            >
                              {" "}
                              {Math.ceil(streakTrack.streakAverage)}%
                            </p>
                          </div>
                        ) : (
                          <progress
                            style={{ width: "300px" }}
                            id="file"
                            value="100"
                            max="100"
                          />
                        )}
                      </div>{" "}
                    </div>
                  )}
                </CardActions>
              ) : (
                ""
              )
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: -15,
                }}
              >
                <button
                  style={{
                    borderRadius: 24,
                    padding: "2px 8px",
                    background: "green",
                    float: "right",
                    color: "white",
                  }}
                  className="is-success"
                  onClick={() => {
                    randomStreak("RANDOM", "DAY", "21", props.eventId);
                  }}
                >
                  Pick your challenge
                </button>
              </Typography>
            )}
          </div>
        </Card>
        <Card
          style={{
            width: "370px",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        >
          <div
            style={{
              color: "white",
              marginTop: "-10px",
              display: "flex",
              justifyContent: "center",
              background: "#95a5a6",
              height: 45,
            }}
          >
            <div style={{ display: "flex" }}>
              <h2 style={{ marginLeft: 150, marginTop: 16 }}> Distance </h2>{" "}
              <ReactTooltip multiline={true} />
              <div
                style={{ marginLeft: 110 }}
                data-tip="In this challenge you need to cover mentioned KM in a day,<br/> You will get 7 days to achieve the target, once you achieve it, <br/>you will earn a badge which can be seen in Achievement section of leaderboard."
                data-multiline="true"
              >
                <CardMedia
                  style={{ marginTop: 18, float: "right" }}
                  component="img"
                  height="20"
                  width="20"
                  image="https://walkathon21.s3.ap-south-1.amazonaws.com/logo/Info.png"
                />
              </div>{" "}
            </div>
          </div>
          {(distance && distance.kmchallenge !== null) ||
          distanceTrack.challengeAction === "IGNORE" ||
          distanceTrack.challengeAction === "ACCEPT" ? (
            <CardContent>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "85%", marginLeft: -20 }}>
                  {" "}
                  {(distanceTrack &&
                    distanceTrack.challengeAction === "IGNORE") ||
                  distanceTrack.challengeAction === "NO_ACTION_PERFORM" ? (
                    <img
                      style={{ height: 100, width: 100 }}
                      src={distanceTrack && distanceTrack.errorImage}
                    />
                  ) : distanceTrack.challengeAction === "ACCEPT" ? (
                    <img
                      style={{ height: 100, width: 100 }}
                      src={distanceTrack.kmLogo}
                    />
                  ) : distanceTrack.challengeAction === "NO_CHALLENGE" ? (
                    <img
                      style={{ height: 100, width: 100 }}
                      src={distance ? distance.kmLogo : distanceTrack.kmLogo}
                    />
                  ) : (
                    <>
                      {" "}
                      <img
                        style={{ height: 100, width: 100 }}
                        src={distance ? distance.kmLogo : distanceTrack.kmLogo}
                      />{" "}
                    </>
                  )}
                </div>
                {distanceTrack &&
                distanceTrack.challengeAction === "NO_CHALLENGE" ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      wordSpacing: 3,
                    }}
                  >
                    <>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{ marginLeft: 20, fontSize: 12, wordSpacing: 3 }}
                      >
                        Your Previous Best Distance covered in a day was of{" "}
                        <strong> {distance && distance.eventMaxKM} </strong>
                        KMs.Achieved on
                        <strong> {distance && distance.maxKMDate} </strong>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{
                          marginLeft: 20,
                          fontSize: 12,
                          marginTop: 5,
                          wordSpacing: 3,
                        }}
                      >
                        {" "}
                        Would you like to up the mark and accept a challenge for{" "}
                        <strong> {distance && distance.kmchallenge} </strong>
                        KMs?
                        <p>
                          {" "}
                          <strong>
                            {" "}
                            <span style={{ color: "red" }}>* </span>
                            Target to be achieved on or before{" "}
                            <strong>
                              {" "}
                              {distance && distance.targetedKmDate}.{" "}
                            </strong>
                          </strong>{" "}
                        </p>
                      </Typography>
                    </>
                  </div>
                ) : (distanceTrack &&
                    distanceTrack.challengeAction === "IGNORE") ||
                  distanceTrack.challengeAction === "NO_ACTION_PERFORM" ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      wordSpacing: 3,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{
                        marginLeft: 25,
                        fontSize: 15,
                        marginTop: 5,
                        wordSpacing: 3,
                      }}
                    >
                      {distanceTrack.errorMsg}{" "}
                    </Typography>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      wordSpacing: 3,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{
                        marginLeft: 25,
                        fontSize: 15,
                        marginTop: 5,
                        wordSpacing: 3,
                        fontSize: 12,
                      }}
                    >
                      {distanceTrack.kmStatus === "COMPLETED" ? (
                        <div>
                          WOW !! You have Succesfully achieved your target.
                        </div>
                      ) : (
                        <div>
                          <div>
                            {" "}
                            Challenge accepted on :{" "}
                            {distanceTrack.challengeThrowDate}{" "}
                          </div>
                          <div> Target date : {distanceTrack.targetDate} </div>
                          {/* <div> Status : {distanceTrack.kmStatus} </div> */}
                        </div>
                      )}
                    </Typography>
                  </div>
                )}
              </div>
            </CardContent>
          ) : (
            <>
              {distance.kmchallenge !== null ? (
                <div
                  style={{
                    // height: 400,
                    padding: "5px",

                    display: "flex",
                    flexDirection: "row",
                    fontSize: 12,

                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  className=""
                >
                  {" "}
                  <div style={{ width: "30%" }}>
                    <img
                      style={{ height: 100, width: 100 }}
                      src="https://walkathon21.s3.ap-south-1.amazonaws.com/logo/Distance/D_0K_GreyScale_20210929.png"
                    />
                  </div>
                  <div style={{ width: "80%" }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ marginLeft: 20, fontSize: 12, wordSpacing: 3 }}
                    >
                      {" "}
                      <h4 style={{ width: "80%", fontWeight: "lighter" }}>
                        {/* Your random challenge is available */}
                        Your Previous Best Distance covered in a day was of{" "}
                        {distance.eventMaxKM} KMs. Achieved on{" "}
                        {distance.maxKMDate}.{" "}
                      </h4>
                    </Typography>{" "}
                  </div>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      // height: 400,
                      padding: "5px",

                      display: "flex",
                      flexDirection: "row",
                      fontSize: 12,

                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    className=""
                  >
                    {" "}
                    <div style={{ width: "30%" }}>
                      <img
                        style={{ height: 100, width: 100 }}
                        src="https://walkathon21.s3.ap-south-1.amazonaws.com/logo/Distance/D_0K_GreyScale_20210929.png"
                      />
                    </div>
                    <div style={{ width: "80%" }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{ marginLeft: 20, fontSize: 12, wordSpacing: 3 }}
                      >
                        {" "}
                        <h4 style={{ width: "80%", fontWeight: "lighter" }}>
                          {distanceTrack.errorMsg}
                        </h4>
                      </Typography>{" "}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          {(distance && distance.kmchallenge !== null) ||
          distanceTrack.challengeAction === "IGNORE" ||
          distanceTrack.challengeAction === "ACCEPT" ? (
            distanceTrack &&
            distanceTrack.challengeAction !== "NO_ACTION_PERFORM" ? (
              <CardActions
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: -15,
                }}
              >
                {distanceTrack &&
                distanceTrack.challengeAction === "NO_CHALLENGE" ? (
                  <div>
                    <button
                      style={{
                        borderRadius: 24,
                        padding: "2px 8px",
                        marginRight: "0.5rem",
                      }}
                      className="is-success"
                      onClick={() => {
                        acceptOrReject(
                          "accept",
                          "KM",
                          distance ? distance.kmchallenge : "",
                          props.eventId
                        );
                      }}
                    >
                      Accept
                    </button>
                    <button
                      style={{
                        background: "#F43F5E",
                        color: "white",
                        borderRadius: 24,
                        padding: "2px 6px",
                      }}
                      onClick={() =>
                        onjoinModal(
                          "ignore",
                          "KM",
                          distance ? distance.kmchallenge : ""
                        )
                      }
                      // onClick={() => {
                      //   acceptOrReject(
                      //     'ignore',
                      //     'KM',
                      //     distance ? distance.kmchallenge : '',
                      //     props.eventId
                      //   );
                      // }}
                    >
                      Change challenge
                    </button>
                  </div>
                ) : distanceTrack &&
                  distanceTrack.challengeAction === "IGNORE" ? (
                  ""
                ) : (
                  <>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {/* <p style={{textAlign: 'right'}}>
                        {' '}
                        {distanceTrack && distanceTrack.kmStatus}{' '}
                      </p> */}
                      {distanceTrack.kmStatus == "NOT YET COMPLETED" ? (
                        <progress style={{ width: "300px" }} />
                      ) : (
                        <progress
                          style={{ width: "300px" }}
                          value="100"
                          max="100"
                        />
                      )}{" "}
                    </div>{" "}
                  </>
                )}
              </CardActions>
            ) : (
              ""
            )
          ) : (
            <>
              {currDay == 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    marginTop: -15,
                  }}
                >
                  <button
                    style={{
                      borderRadius: 24,
                      padding: "2px 8px",
                      background: "green",
                      float: "right",
                      color: "white",
                    }}
                    className="is-success"
                    onClick={() => {
                      randomkm("RANDOM", "KM", "21", props.eventId);
                    }}
                  >
                    Pick your challenge
                  </button>
                </Typography>
              ) : (
                ""
              )}
            </>
          )}
        </Card>{" "}
        <Card
          style={{
            width: "370px",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        >
          <div
            style={{
              color: "white",
              marginTop: "-10px",
              display: "flex",
              justifyContent: "center",
              background: "#95a5a6",
              height: 45,
            }}
          >
            <div style={{ display: "flex" }}>
              <h2 style={{ marginLeft: 150, marginTop: 16 }}> Average </h2>{" "}
              <ReactTooltip multiline={true} />{" "}
              <div
                style={{ marginLeft: 110 }}
                data-tip="This challenge comprise of Average of distance covered in 7 days <br/> Starting from date of acceptance to till the end of challenge date. <br/>
Once achieved, you will earn a badge which can be seen in Achievement<br/> section of leaderboard."
                data-multiline="true"
              >
                <CardMedia
                  style={{ marginTop: 18, float: "right" }}
                  component="img"
                  height="20"
                  width="20"
                  image="https://walkathon21.s3.ap-south-1.amazonaws.com/logo/Info.png"
                />
              </div>{" "}
            </div>{" "}
          </div>
          {(average && average.weekAvgChallenge !== null) ||
          averageTrack.challengeAction === "IGNORE" ||
          averageTrack.challengeAction === "ACCEPT" ? (
            <CardContent>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "85%", marginLeft: -20 }}>
                  {" "}
                  {(averageTrack &&
                    averageTrack.challengeAction === "IGNORE") ||
                  averageTrack.challengeAction === "NO_ACTION_PERFORM" ? (
                    <img
                      style={{ height: 100, width: 100 }}
                      src={averageTrack && averageTrack.errorImage}
                    />
                  ) : averageTrack.challengeAction === "ACCEPT" ? (
                    <img
                      style={{ height: 100, width: 100 }}
                      src={averageTrack.avgLogo}
                    />
                  ) : averageTrack.challengeAction === "NO_CHALLENGE" ? (
                    <img
                      style={{ height: 100, width: 100 }}
                      src={average ? average.avgLogo : averageTrack.avgLogo}
                    />
                  ) : (
                    <>
                      {" "}
                      <img
                        style={{ height: 100, width: 100 }}
                        src={average ? average.avgLogo : averageTrack.avgLogo}
                      />{" "}
                    </>
                  )}
                </div>
                {averageTrack &&
                averageTrack.challengeAction === "NO_CHALLENGE" ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ marginLeft: 20, fontSize: 12, wordSpacing: 3 }}
                    >
                      Your Previous Best Weekly average was of{" "}
                      {average && average.eventMaxWeekAverage} KMs/Week.
                      Achieved from {average && average.weekAvgFromDate} to{" "}
                      {average && average.weekAvgToDate}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{
                        marginLeft: 20,
                        marginTop: 5,
                        fontSize: 12,
                        wordSpacing: 3,
                      }}
                    >
                      Would you like to up the mark and accept a challenge for{" "}
                      {average && average.weekAvgChallenge}
                      KMs/Week?
                      <p>
                        {" "}
                        <strong>
                          {" "}
                          <span style={{ color: "red" }}>* </span>
                          Target to be achieved on or before{" "}
                          {average && average.targetedAvgDate}.{" "}
                        </strong>{" "}
                      </p>
                    </Typography>
                  </div>
                ) : averageTrack.challengeAction === "IGNORE" ||
                  averageTrack.challengeAction === "NO_ACTION_PERFORM" ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      wordSpacing: 3,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{
                        marginLeft: 25,
                        fontSize: 15,
                        marginTop: 5,
                        wordSpacing: 3,
                      }}
                    >
                      {averageTrack.errorMsg}{" "}
                    </Typography>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      wordSpacing: 3,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{
                        marginLeft: 25,
                        fontSize: 12,
                        marginTop: 5,
                        wordSpacing: 3,
                      }}
                    >
                      {/* Challenge Accepted On: {Date} */}
                      {averageTrack.avgWeekStatus === "COMPLETED" ? (
                        <div>
                          WOW !! You have Succesfully achieved your target.
                        </div>
                      ) : averageTrack.avgWeekStatus === "FAILED" ? (
                        <div>
                          Oops! Challenge is unachievable now. Better luck next
                          time
                        </div>
                      ) : (
                        <div style={{ marginLeft: 20, fontSize: 12 }}>
                          {" "}
                          <div> Target Date: {averageTrack.targetDate}</div>
                          {/* <div>
                            {' '}
                            Progress:{' '}
                            <b> {averageTrack.progressPercentage} %</b>
                          </div> */}
                          <div>
                            {" "}
                            Remaining Days :{" "}
                            <b> {averageTrack.remainingDay} </b>
                          </div>
                          <div>
                            {" "}
                            Now Required Average:{" "}
                            <b>
                              {" "}
                              {averageTrack.remainAvgPercentage}{" "}
                            </b> KM/Day{" "}
                          </div>
                        </div>
                      )}
                    </Typography>
                  </div>
                )}
              </div>
            </CardContent>
          ) : (
            <div
              style={{
                // height: 400,
                padding: "5px",

                display: "flex",
                flexDirection: "row",
                fontSize: 12,

                justifyContent: "space-between",
                alignItems: "center",
              }}
              className=""
            >
              {" "}
              <div style={{ width: "30%" }}>
                <img
                  style={{ height: 100, width: 100 }}
                  src="https://walkathon21.s3.ap-south-1.amazonaws.com/logo/Average/A_0K_GreyScale_20210929.png"
                />
              </div>
              <div>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{ marginLeft: 20, fontSize: 12, wordSpacing: 3 }}
                >
                  {" "}
                  <h4 style={{ width: "80%", fontWeight: "lighter" }}>
                    {" "}
                    Your random challenge is available Your Previous Best Weekly
                    average was of {average.eventMaxWeekAverage} KMs/Week.
                    Achieved from {average.weekAvgFromDate} to{" "}
                    {average.weekAvgToDate}
                  </h4>
                </Typography>
              </div>
            </div>
          )}
          {(average && average.weekAvgChallenge !== null) ||
          averageTrack.challengeAction === "IGNORE" ||
          averageTrack.challengeAction === "ACCEPT" ? (
            averageTrack &&
            averageTrack.challengeAction !== "NO_ACTION_PERFORM" ? (
              <CardActions
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: -15,
                }}
              >
                {averageTrack &&
                averageTrack.challengeAction === "NO_CHALLENGE" ? (
                  <div>
                    <button
                      style={{
                        borderRadius: 24,
                        padding: "2px 8px",
                        marginRight: "0.5rem",
                      }}
                      className="is-success"
                      onClick={() => {
                        acceptOrReject(
                          "accept",
                          "AVG",
                          average ? average.weekAvgChallenge : "",
                          props.eventId
                        );
                      }}
                    >
                      Accept
                    </button>
                    <button
                      style={{
                        background: "#F43F5E",
                        color: "white",
                        borderRadius: 24,
                        padding: "2px 6px",
                      }}
                      onClick={() =>
                        onjoinModal(
                          "ignore",
                          "AVG",
                          average ? average.weekAvgChallenge : ""
                        )
                      }
                      // onClick={() => {
                      //   acceptOrReject(
                      //     'ignore',
                      //     'AVG',
                      //     average ? average.weekAvgChallenge : '',
                      //     props.eventId
                      //   );
                      // }}
                    >
                      Change challenge
                    </button>{" "}
                  </div>
                ) : averageTrack.challengeAction === "IGNORE" ? (
                  ""
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    {" "}
                    <div
                      style={{
                        marginLeft: 20,
                        display: "flex",
                        flexDirection: "column",
                        fontSize: 13,
                      }}
                    >
                      {" "}
                      <ReactTooltip />
                      {averageTrack.avgWeekStatus !== "COMPLETED" ? (
                        <div style={{ display: "flex" }}>
                          <progress
                            style={{ width: "300px" }}
                            id="file"
                            value={averageTrack.progressPercentage}
                            max="100"
                            data-tip={Math.ceil(
                              averageTrack.progressPercentage
                            )}
                          >
                            {" "}
                          </progress>
                          <p
                            style={{
                              fontSize: 12,
                              marginLeft: 15,
                              marginTop: -1,
                            }}
                          >
                            {" "}
                            {Math.ceil(averageTrack.progressPercentage)}%
                          </p>
                        </div>
                      ) : (
                        <progress
                          style={{ width: "300px" }}
                          id="file"
                          value="100"
                          max="100"
                        />
                      )}
                    </div>{" "}
                  </div>
                )}
              </CardActions>
            ) : (
              ""
            )
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: -15,
              }}
            >
              <button
                style={{
                  borderRadius: 24,
                  padding: "2px 8px",
                  background: "green",
                  color: "white",
                  float: "right",
                }}
                className="is-success"
                onClick={() => {
                  randomAvg("RANDOM", "AVG", "21", props.eventId);
                }}
              >
                Pick your challenge
              </button>
            </Typography>
          )}
        </Card>{" "}
      </div>
    </>
  );
};
export default SundayChallenge;
