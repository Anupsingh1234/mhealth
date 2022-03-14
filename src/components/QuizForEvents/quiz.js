import React, { useEffect, useState } from "react";
import axios from "axios";
import { urlPrefix } from "../../services/apicollection";
import Paper from "@material-ui/core/Paper";
import CancelIcon from "@material-ui/icons/Cancel";
// import CountdownTimer from 'timer-countdown';
import Button from "@material-ui/core/Button";
import "react-responsive-modal/styles.css";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { Modal } from "react-responsive-modal";
import { useTimer } from "react-timer-hook";
// import QuizLeaderBoard from './QuizLeaderboard';
import { lighten, makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TextField from "@material-ui/core/TextField";
// import axios from 'axios';
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import NoData from "../NoData";
import { PrimaryButton } from "../Form";
import nodata from "../../assets/nodata.svg";
// import CancelIcon from '@mui/icons-material/Cancel';
const Quiz = (props) => {
  const [question, setquestion] = useState("");
  const [Serial, setSerial] = useState();
  const [options, setoptions] = useState({});
  const [Hook, setHook] = useState();
  const [val, setval] = useState(0);
  const [open, setOpen] = useState(false);
  const [answer, setanswer] = useState();
  const [correctanswer, setcorrectanswer] = useState("");
  const [description, setdescription] = useState("");
  const [timer, settimer] = useState();
  const [isnext, setisnext] = useState(true);
  const [timesec, settimesec] = useState(false);
  const [desc, setdesc] = useState("");
  const [message, setmessage] = useState("");
  const [quizId, setquizId] = useState();
  const [questionNo, setquestionNo] = useState();
  const [total, settotal] = useState({});
  const [leaderboard, setleaderboard] = useState([]);
  const [session, setsession] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [modmobile, setmodmobile] = useState();
  const [modname, setmodname] = useState("");
  const [quizDescription1, setQuizDescription1] = useState("");
  // const [registeredUserList, setRegisteredUserList] = useState(LeaderboardData);
  const [isActive, setIsActive] = useState(true);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [info, setinfo] = useState(false);

  const onInfoModal = () => {
    setinfo(true);
  };
  const onInfoCloseModal = () => {
    setinfo(false);
  };

  const onOpenModal = () => {
    setOpen(true), settimesec(false);
  };
  const onCloseModal = () => {
    setOpen(false), getQuestion(), settimesec(false);
    setSerial();
    // getQuestion();
    setoptions({});
    setHook();
  };

  // console.log(leaderboard, 'leaderboard');
  const [expire, setexpire] = useState(false);
  const getQuestion = () => {
    const URL = `${urlPrefix}v1.0/getQuizQuestion?eventId=${props.eventId}`;
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
        if (res.data.response.responseCode == 0) {
          setquestion(res?.data?.response?.responseData?.question);
          setSerial(res?.data?.response?.responseData?.questionId);
          setQuizDescription1(
            res?.data?.response?.responseData?.quizDecription
          );
          settimer(res?.data?.response?.responseData?.timer);
          setmessage(res?.data?.response?.responseMessage);

          {
            props.eventId && leaderBoard(props.eventId),
              getDetails(props.eventId);
          }
          setquestionNo(res?.data?.response?.responseData?.questionIndex);
        } else {
          setdesc("");
          {
            props.eventId && leaderBoard(props.eventId),
              getDetails(props.eventId);
          }

          setsession({});
          setquestion("");
          setSerial();
          setmessage();
          setQuizDescription1("");
          // setisnext(true);
          settimer();
          // window.id = null;
        }
      });
  };
  console.log(quizDescription1, "descrj");
  const getDetails = (id) => {
    const url = `${urlPrefix}v1.0/getQuizDashboardByUser?eventId=${id}`;

    return axios
      .get(url, {
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
        if (res?.data?.response?.responseCode == 0) {
          settotal(res?.data?.response?.responseData);
          setdesc(res?.data?.response?.responseData?.quizDescription);
        }
      });
  };

  const leaderBoard = (id) => {
    const url = `${urlPrefix}v1.0/getLeadershipBoard?eventId=${id}`;
    return axios
      .get(url, {
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
        setleaderboard(res?.data?.response?.responseData?.rankWiseLeaderBoard);
        setsession(res?.data?.response?.responseData?.sessionUserRank);
      });
  };

  function MyTimer({ expiryTimestamp }) {
    const {
      seconds,
      minutes,
      hours,
      days,
      isRunning,
      start,
      pause,
      resume,
      restart,
    } = useTimer({
      expiryTimestamp,
      onExpire: () => {
        // setHook(0);
        lockAnswer();
        onOpenModal();
        // setSerial();
        // getQuestion();
        // setoptions({});
        setanswer();
        // setHook();
      },
    });
    settimer(seconds);
    return (
      <div style={{ textAlign: "right" }}>
        <div
          style={{
            fontSize: "15px",
            marginRight: 20,
            padding: 5,
            paddingRight: 5,
            background: "#ff9800",
            borderRadius: 10,
            color: "#fff",
          }}
        >
          <span>{minutes}</span>:<span>{seconds}</span>
        </div>
      </div>
    );
  }

  const moderator = () => {
    var marvelHeroes = props.challengeSwitch.filter(function (hero) {
      const x = hero.id == props.eventId;
      return x;
    });
    setmodname(marvelHeroes && marvelHeroes[0]?.moderatorName);
    setmodmobile(marvelHeroes && marvelHeroes[0]?.moderator);
  };

  console.log(modname, modmobile, "hookks");
  const time = new Date();
  // console.log(time, time.getSeconds(), 'timer');
  {
    // var a = time() + timer;
    timer && time.setSeconds(time.getSeconds() + timer);
    // console.log(a, 'yijh');
  } // 10 minutes timer
  // console.log(time, 'hook');
  // console.log(leaderboard.length, 'length');
  const lockAnswer = () => {
    const url = `${urlPrefix}v1.0/submitQuizAnswer`;
    let payload = {};
    if (Hook === undefined) {
      payload = {
        questionId: parseFloat(Serial),
        optionId: "0",
      };
    } else {
      payload = {
        questionId: parseFloat(Serial),
        optionId: Hook,
      };
    }

    axios
      .post(url, payload, {
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
        setanswer(res?.data?.response?.responseData?.answerId);
        setcorrectanswer(res?.data?.response?.responseData?.correctAnswer);
        setdescription(res?.data?.response?.responseData?.answerDescription);
        setisnext(res?.data?.response?.responseData?.isNext);
      });
  };

  const showOption = () => {
    const url = `${urlPrefix}v1.0/showOptions?questionId=${Serial}`;

    return axios
      .post(
        url,
        {},
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
        setoptions(res?.data?.response?.responseData?.quizOptions);
      });
  };

  const coachHeads = [
    {
      label: "Rank",
      id: "rank",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Name",
      id: "name",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Date",
      id: "lastAttemptedDate",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Time",
      id: "timeTaken",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Score",
      id: "totalAttemptedQue",
      numeric: false,
      disablePadding: true,
    },

    // {
    //   label: 'Languagees known',
    //   id: 'language',
    //   numeric: false,
    //   disablePadding: true,
    // },
  ];

  // function coach(props)

  function descendingComparator(a, b, orderBy) {
    let firstValue =
      a[orderBy] == null
        ? "zzzzzzzzzzzz"
        : typeof a[orderBy] == "string"
        ? a[orderBy]?.toLowerCase()
        : a[orderBy];
    let secondValue =
      b[orderBy] == null
        ? "zzzzzzzzzzzz"
        : typeof b[orderBy] == "string"
        ? b[orderBy]?.toLowerCase()
        : b[orderBy];
    if (secondValue < firstValue) {
      return -1;
    }
    if (secondValue > firstValue) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  // const handleRequestSort = (event, property) => {
  //   const isAsc = orderBy === property && order === 'asc';
  //   setOrder(isAsc ? 'desc' : 'asc');
  //   setOrderBy(property);
  // };

  const EnhancedTableHead = (prop) => {
    const { classes, order, orderBy, onRequestSort } = prop;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    console.log(isnext, "cancel");
    return (
      <TableHead>
        <TableRow>
          {coachHeads.map((coachTableHeads) => (
            <TableCell
              key={coachTableHeads.id}
              align="center"
              padding="none"
              sortDirection={orderBy === coachTableHeads.id ? order : false}
              style={{
                width: "max-content",
                padding: 0,
                paddingLeft: coachTableHeads.id == "index" ? 5 : 0,
              }}
            >
              <TableSortLabel
                active={orderBy === coachTableHeads.id}
                direction={orderBy === coachTableHeads.id ? order : "asc"}
                onClick={createSortHandler(coachTableHeads.id)}
                style={{ width: "max-content" }}
              >
                {coachTableHeads.label}
                {orderBy === coachTableHeads.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "70%",
    },
    paper: {
      width: "70%",
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 650,
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
  }));

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  console.log(answer, Hook, "hook", correctanswer);
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");

  const count = 0;
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

  useEffect(() => {
    getQuestion();
    // getDetails();
    moderator();

    // setInterval(function () {
    //   timer();
    // }, 1000);
  }, [props.eventId]);

  function TablePaginationActions(props) {
    // const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = (event) => {
      onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
      onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
      onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
      onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <div className={classes.root} style={{ display: "flex" }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
          style={{ width: 30, padding: 0 }}
        >
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
          style={{ width: 30, padding: 0 }}
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
          style={{ width: 30, padding: 0 }}
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
          style={{ width: 30, padding: 0 }}
        >
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
  return (
    <>
      <p style={{ fontSize: 12 }}>
        {modname && modname} , {modmobile && modmobile}
      </p>
      <Paper
        className="quizPaper"
        style={{
          display: "flex",
          marginTop: 15,
          overflowX: "scroll",
          // justifyContent: 'space-evenly',
          // width: '100%',
        }}
      >
        <div className="quizPaperOne">
          {message === "SUCCESS" ? (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  marginTop: "1rem",
                  // borderRight: '1px solid black',
                }}
              >
                {" "}
                {/* <b> {desc} </b> */}
                <b>{quizDescription1}</b>
                <img
                  src="https://walkathon21.s3.ap-south-1.amazonaws.com/logo/Info.png"
                  style={{
                    width: 25,
                    cursor: "pointer",
                    height: 25,
                    borderRadius: 100,
                    marginLeft: 20,
                  }}
                  onClick={() => {
                    onInfoModal();
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                  display: "flex",
                  justifyContent: "space-around",
                  width: "100%",
                  background: "#9e9e9e",
                  // borderRight: '1px solid black',
                }}
              >
                <Paper
                  elevation={0}
                  style={{ background: "#9e9e9e", color: "#fff", padding: 5 }}
                >
                  {" "}
                  Total Ques :{" "}
                  {Object.entries(total).length > 0 &&
                  total.totalQuestions !== null
                    ? total.totalQuestions
                    : 0}
                </Paper>
                <Paper
                  elevation={0}
                  style={{ background: "#9e9e9e", color: "#fff", padding: 5 }}
                >
                  {" "}
                  Attempted :{" "}
                  {Object.entries(total).length > 0 &&
                  total.totalAttemptedQuestions !== null
                    ? total.totalAttemptedQuestions
                    : 0}{" "}
                </Paper>
                <Paper
                  elevation={0}
                  style={{ background: "#9e9e9e", color: "#fff", padding: 5 }}
                >
                  {" "}
                  Correct :{" "}
                  {Object.entries(total).length > 0 &&
                  total.totalCorrectQuestions !== null
                    ? total.totalCorrectQuestions
                    : 0}{" "}
                </Paper>
                <Paper
                  elevation={0}
                  style={{ background: "#9e9e9e", color: "#fff", padding: 5 }}
                >
                  {" "}
                  Incorrect :{" "}
                  {Object.entries(total).length > 0 &&
                  total.totalIncorrectQuestions !== null
                    ? total.totalIncorrectQuestions
                    : 0}{" "}
                </Paper>
                {/* <Paper elevation={1}>
              {' '}
              Not attempted :{' '}
              {total.totalQuestions !== null ? total.totalQuestions : 0}{' '}
            </Paper> */}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "100%",
                  // borderRight: '1px solid black',
                }}
              >
                <Paper
                  Elevation={2}
                  style={{
                    width: "85%",
                    paddingBottom: 15,
                    padding: "2px 10px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        border: "1px solid gray",
                        background: "#f5d36c",
                        borderRadius: 15,
                      }}
                    >
                      {" "}
                      <p style={{ textAlign: "justify", padding: 10 }}>
                        {" "}
                        {questionNo}. <b> {question} </b>{" "}
                      </p>
                    </div>

                    <div
                      style={{
                        paddingBottom: 10,
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          marginTop: 25,
                          paddingBottom: 20,
                          width: "auto",
                          height: "auto",
                          display: "flex",
                          flexDirection: "column",
                          flexWrap: "wrap",
                          justifyContent: "space-around",
                        }}
                      >
                        {Object.keys(options).map((item, i) => {
                          // console.log(time, 'item');
                          return (
                            <>
                              {/* console.log(item); */}

                              <button
                                // for="optionId"
                                style={{
                                  marginTop: 5,
                                  boxShadow:
                                    "10px 6px 9px -5px rgba(0,0,0,0.75)",
                                  textAlign: "justify",
                                  paddingLeft: "20px",
                                  paddingBottom: "20px",
                                  paddingTop: "10px",
                                  paddingRight: "15px",
                                  height: "auto",
                                  // textAlign: 'justify',
                                  display: "flex",
                                  alignItems: "center",

                                  border:
                                    Hook == `${item}`
                                      ? "1px solid gray"
                                      : "1px solid gray",
                                  background:
                                    Hook == `${item}` ? "#15803d" : "",
                                  color: Hook == `${item}` ? "#fff" : "",
                                }}
                                className="travelcompany-input"
                                key={i}
                                onClick={(e) => {
                                  setHook(e.target.value);
                                  // console.log(e.target.value);
                                }}
                                value={item}
                              >
                                {i + 1} {options[item]}
                              </button>
                              {/* </label> */}
                            </>
                          );
                        })}
                      </div>
                      {/* {Example} */}
                    </div>
                  </div>
                </Paper>
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      textAlign: "right",
                    }}
                  >
                    {" "}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        textAlign: "right",
                      }}
                    >
                      <p style={{ marginLeft: 50 }}>
                        {timesec === true ? (
                          <MyTimer expiryTimestamp={time} />
                        ) : (
                          ""
                        )}
                      </p>
                    </div>
                    {Object.entries(options).length == 0 && question !== "" ? (
                      <PrimaryButton
                        mini
                        onClick={() => {
                          showOption();
                          settimesec(true);
                        }}
                      >
                        {" "}
                        Get options
                      </PrimaryButton>
                    ) : (
                      ""
                    )}
                    {Hook && (
                      <PrimaryButton
                        mini
                        onClick={() => {
                          lockAnswer(), onOpenModal();
                        }}
                        className="mt-2 text-sm"
                      >
                        {" "}
                        Lock Answer{" "}
                      </PrimaryButton>
                    )}
                  </div>
                </div>
              </div>

              <Modal
                open={open}
                styles={{
                  modal: { borderRadius: "10px" },
                }}
                onClose={onCloseModal}
                center
                closeIcon={closeIcon}
              >
                <div style={{ padding: 20 }}>
                  {/* {answer === Hook ? 'Your answer is correct' : ''} </h2> */}
                  {answer === undefined ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src="https://walkathon21.s3.ap-south-1.amazonaws.com/logo/out-of-time.png"
                        style={{ width: 50, height: 50, borderRadius: 100 }}
                      />
                      <h3 style={{ marginLeft: 15 }}>
                        {" "}
                        Oops Time over for the selected Question
                      </h3>{" "}
                    </div>
                  ) : (
                    ""
                  )}

                  {answer == Hook && answer !== undefined ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <CheckCircleOutlineIcon
                        style={{
                          marginTop: 10,
                          width: 35,
                          height: 35,
                          color: "green",
                        }}
                      />
                      <h2 style={{ marginLeft: 15 }}>
                        {" "}
                        Your answer is correct
                      </h2>
                    </div>
                  ) : answer != Hook && answer !== undefined ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <CancelIcon
                        style={{
                          marginTop: 10,
                          width: 35,
                          height: 35,
                          color: "red",
                        }}
                      />{" "}
                      <h2 style={{ marginLeft: 15 }}>
                        {" "}
                        Your answer is Incorrect
                      </h2>{" "}
                    </div>
                  ) : (
                    ""
                  )}
                  {answer != Hook ? (
                    <h2> Correct Answer : {correctanswer} </h2>
                  ) : (
                    ""
                  )}
                  <h3>
                    {" "}
                    <b>Description : </b>
                  </h3>
                  <h3 style={{ fontSize: 16 }}> {description}</h3>

                  {/* {expire == true ? onOpenModal() : ''} */}
                  {isnext == true ? (
                    <div className="w-[max-content] ml-auto">
                      <PrimaryButton
                        mini
                        onClick={() => {
                          onCloseModal();
                          setSerial();
                          getQuestion();
                          setoptions({});
                          setHook();
                        }}
                      >
                        Next Question
                      </PrimaryButton>
                    </div>
                  ) : (
                    <>
                      {" "}
                      <h3 style={{ color: "green" }}>
                        Congratulations! You have successfully completed the
                        Quiz. If you wish to get e-Certificate, please update
                        your e-mail-ID in profile section.
                      </h3>
                      <div className="w-[max-content]">
                        <PrimaryButton
                          mini
                          onClick={() => {
                            onCloseModal();
                          }}
                        >
                          Close
                        </PrimaryButton>
                      </div>
                    </>
                  )}
                </div>
              </Modal>
            </div>
          ) : (
            <div>
              {" "}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  marginTop: "1rem",
                  // borderRight: '1px solid black',
                }}
              >
                {" "}
                {/* <b> {desc} </b> */}
                <b>{quizDescription1}</b>
                {quizDescription1 && (
                  <img
                    src="https://walkathon21.s3.ap-south-1.amazonaws.com/logo/Info.png"
                    style={{
                      width: 25,
                      cursor: "pointer",
                      height: 25,
                      borderRadius: 100,
                      marginLeft: 20,
                    }}
                    onClick={() => {
                      onInfoModal();
                    }}
                  />
                )}
              </div>
              {quizDescription1 ? (
                <div
                  style={{
                    marginTop: 20,
                    marginBottom: 20,
                    display: "flex",
                    justifyContent: "space-around",
                    width: "100%",
                    background: "#9e9e9e",
                    // borderRight: '1px solid black',
                  }}
                >
                  <Paper
                    elevation={0}
                    style={{ background: "#9e9e9e", color: "#fff", padding: 5 }}
                  >
                    {" "}
                    Total Ques :{" "}
                    {Object.entries(total).length > 0 &&
                    total.totalQuestions !== null
                      ? total.totalQuestions
                      : 0}
                  </Paper>
                  <Paper
                    elevation={0}
                    style={{ background: "#9e9e9e", color: "#fff", padding: 5 }}
                  >
                    {" "}
                    Attempted :{" "}
                    {Object.entries(total).length > 0 &&
                    total.totalAttemptedQuestions !== null
                      ? total.totalAttemptedQuestions
                      : 0}{" "}
                  </Paper>
                  <Paper
                    elevation={0}
                    style={{ background: "#9e9e9e", color: "#fff", padding: 5 }}
                  >
                    {" "}
                    Correct :{" "}
                    {Object.entries(total).length > 0 &&
                    total.totalCorrectQuestions !== null
                      ? total.totalCorrectQuestions
                      : 0}{" "}
                  </Paper>
                  <Paper
                    elevation={0}
                    style={{ background: "#9e9e9e", color: "#fff", padding: 5 }}
                  >
                    {" "}
                    Incorrect :{" "}
                    {Object.entries(total).length > 0 &&
                    total.totalIncorrectQuestions !== null
                      ? total.totalIncorrectQuestions
                      : 0}{" "}
                  </Paper>
                  {/* <Paper elevation={1}>
              {' '}
              Not attempted :{' '}
              {total.totalQuestions !== null ? total.totalQuestions : 0}{' '}
            </Paper> */}
                </div>
              ) : (
                <div className=" max-w-sm md:max-w-full flex flex-col justify-center items-center">
                  <img src={nodata} className="w-60" />
                  <p>No data</p>
                </div>
              )}
            </div>
          )}
        </div>
        <Paper
          className="quizPapertwo"
          elevation={2}
          style={
            {
              // marginLeft: 15,
            }
          }
        >
          <h3 style={{ textAlign: "center", marginLeft: 18 }}>
            {" "}
            {leaderboard && <b> Leaderboard : </b>}{" "}
          </h3>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"small"}
            aria-label="enhanced table"
            style={{ width: "100%", padding: 10 }}
          >
            <TableContainer>
              {leaderboard && (
                <EnhancedTableHead
                  style={{ padding: 10 }}
                  classes={classes}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />
              )}

              <TableBody className="flex md:justify-center">
                {session && (
                  <TableRow style={{ background: "#e0f2fe" }} className="cells">
                    <TableCell align="center">
                      {session && session.rank}
                    </TableCell>
                    <TableCell align="left" className="cells">
                      {session && session.name}
                    </TableCell>{" "}
                    <TableCell align="center" className="cells">
                      {session && session.lastAttemptedDate}
                    </TableCell>
                    <TableCell align="center" className="cells">
                      {session && session.timeTaken}
                    </TableCell>
                    <TableCell align="left" className="cells">
                      {session && session.totalCorrectAns}
                    </TableCell>
                  </TableRow>
                )}
                {leaderboard ? (
                  stableSort(leaderboard, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, ind) => {
                      return (
                        <TableRow hover tabIndex={-1} className="cells">
                          <TableCell align="center">
                            {item && item.rank}
                          </TableCell>
                          <TableCell align="left" className="cells">
                            {item && item.name}
                          </TableCell>
                          <TableCell align="center" className="cells">
                            {" "}
                            {item && item.lastAttemptedDate}
                          </TableCell>
                          <TableCell align="center" className="cells">
                            {" "}
                            {item && item.timeTaken}
                          </TableCell>
                          <TableCell align="left" className="cells">
                            {" "}
                            {item && item.totalCorrectAns}
                          </TableCell>
                        </TableRow>
                      );
                    })
                ) : (
                  <div className="max-w-sm md:max-w-full flex flex-col justify-center items-center">
                    <img src={nodata} className="w-60" />
                    <p>No data</p>
                  </div>
                )}
                {/* );
            })} */}
              </TableBody>
            </TableContainer>
          </Table>
          {leaderboard && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "right",
                marginTop: 10,
              }}
            >
              <div className="d-flex a-i-center">
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50]}
                  component="div"
                  count={session ? leaderboard.length + 1 : leaderboard.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </div>
            </div>
          )}
        </Paper>
      </Paper>
      <Modal
        open={info}
        styles={{
          modal: { borderRadius: "10px" },
        }}
        onClose={onInfoCloseModal}
        center
        // closeIcon={closeIcon}
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
        <div style={{ padding: 20, textAlign: "justify", lineHeight: -5 }}>
          <div style={{ display: "flex", textAlign: "justify" }}>
            <h3>
              {" "}
              <b> 1.</b> To attempt each question, you will be provided with a
              fixed duration, and the timer will start once you click on the get
              options button, response needs to be locked before the timer
              stops.
            </h3>
          </div>
          <div style={{ display: "flex", textAlign: "justify" }}>
            <h3>
              {" "}
              <b> 2.</b> Each correct answer awards one point. There is no
              negative marking for wrong answer.
            </h3>
          </div>
          <div style={{ display: "flex", textAlign: "justify" }}>
            <h3>
              <b> 3. </b> Each question may have 2 or more options, selected
              option will be highlighted in green.
            </h3>
          </div>
          <div style={{ display: "flex", textAlign: "justify" }}>
            <h3>
              <b> 4. </b> Once an answer gets locked or on completion of
              allotted time, a pop up will appear with details about the correct
              answer.
            </h3>
          </div>
          <div style={{ display: "flex", textAlign: "justify" }}>
            <h3>
              <b> 5. </b>Leader Board: On attempting each question, you will see
              your score and rank get improved/updated on leader-board.
            </h3>
          </div>
          <div style={{ display: "flex", textAlign: "justify" }}>
            <h3>
              <b> 6. </b>Participation Certificate: Once quiz is completed, user
              will be eligible for an e-Certificate, which will be sent to their
              registered e-mail ID. To get your e-certificate, please update
              your email-id in the “Profile” section on left-hand side.
            </h3>
          </div>
          <div style={{ display: "flex", textAlign: "justify" }}>
            <h3>
              <b> 7. </b>User can complete the quiz in one go or can save it to
              be attempted/ completed later as per their convenience.
            </h3>
          </div>
          <div style={{ display: "flex", textAlign: "justify" }}>
            <h3>
              <b> 8. </b>Once completed, user will not be able to attempt it
              again.
            </h3>
          </div>

          <button
            style={{
              background: "gray",
              color: "#fff",
              float: "right",
              height: 25,
              width: 75,
              borderRadius: 15,
            }}
            onClick={() => {
              onInfoCloseModal();
            }}
          >
            {" "}
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Quiz;
