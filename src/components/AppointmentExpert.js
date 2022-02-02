import React, { useState, useEffect } from "react";
import { lighten, makeStyles, useTheme } from "@material-ui/core/styles";
import Chart from "react-apexcharts";
import moment from "moment";
import CancelIcon from "@material-ui/icons/Cancel";
// import InfoDialog from './Utility/InfoDialog'
import Select from "@material-ui/core/Select";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { APP } from "../utils/appConfig";
import AddPastDetailForm from "./AddPastDetailForm";
import { urlPrefix, secretToken } from "../services/apicollection";
import ReactScrollToBottom from "react-scroll-to-bottom";
import Avatar from "@material-ui/core/Avatar";
import axios from "axios";

import {
  getDataCurrentSource,
  syncGFitAndStrava,
  getChallengesByDate,
} from "../services/challengeApi";
import { Paperclip } from "react-feather";
import Tooltip from "@material-ui/core/Tooltip";
import Message from "antd-message";
import Switch from "react-switch";
import Modal from "@material-ui/core/Modal";
// import Message12 from './Message';
import TriStateToggle from "./toggle/TriStateToggle";
// import socketIo from 'socket.io-client';
import InfoDialog from "./Utility/InfoDialog";
import { ListItemAvatar } from "@material-ui/core";
let socket;

// const ENDPOINT = 'https://demo-cchat.herokuapp.com/';
const ENDPOINT = "http://localhost:5000";
function FacebookCircularProgress(props) {
  const useStylesFacebook = makeStyles((theme) => ({
    root: {
      position: "absolute",
      left: "50%",
      top: "50%",
    },
    bottom: {
      color: theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
    },
    top: {
      color: "#1a90ff",
      animationDuration: "550ms",
      position: "absolute",
      left: 0,
    },
    circle: {
      strokeLinecap: "round",
    },
  }));
  const classes = useStylesFacebook();

  return (
    <div className={classes.root}>
      <CircularProgress
        variant="determinate"
        className={classes.bottom}
        size={20}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={20}
        thickness={4}
        {...props}
      />
    </div>
  );
}
const headCells = [
  {
    label: "S.No",
    id: "index",
    numeric: false,
    disablePadding: true,
  },
  {
    label: "Date",

    id: "meetingDate",
    numeric: false,
    disablePadding: true,
  },
  {
    label: "Type",
    id: "programType",
    numeric: false,
    disablePadding: true,
  },
  {
    label: "Program Name",
    id: "programName",
    numeric: false,
    disablePadding: true,
  },
  {
    label: "Name",
    id: "userName",
    numeric: false,
    disablePadding: true,
  },
  {
    label: "Relation",
    id: "relation",
    numeric: false,
    disablePadding: true,
  },
  {
    label: "Dependent Name",
    id: "dependentName",
    numeric: false,
    disablePadding: true,
  },
  {
    label: "Notes",
    id: "notes",
    numeric: false,
    disablePadding: true,
  },

  {
    label: "Mobile",
    id: "mobilePhone",
    numeric: false,
    disablePadding: true,
  },
  {
    label: " Time",
    id: "meetingTime",
    numeric: false,
    disablePadding: true,
  },
  {
    label: "Chat",
    // id: 'addData',
    numeric: false,
    disablePadding: true,
  },
  {
    label: "Join",
    // id: 'addData',
    numeric: false,
    disablePadding: true,
  },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding="none"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
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

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
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

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    position: "absolute",
    width: 800,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(0, 4, 0),
    marginLeft: "-200px",
    maxHeight: 900,
    overflow: "scroll",
  },
  table: {
    minWidth: 750,
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

export default function AppointmentExpert({
  modalView,
  setModalView,
  eventId,
  challenge,
}) {
  const classes = useStyles();
  const handleClose = () => {
    setModalView(false);
  };

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [selectedDate, setSelectedDate] = useState("");
  const [displayModal, setDisplayModal] = useState(false);
  const [chatModal, setchatModal] = useState(false);
  const [coachbreakModal, setCoachBreakModal] = useState(false);
  const [weekMonth, setWeekMonth] = useState();
  const [radioValue, setRadioValue] = useState("current");
  const [options, setOptions] = useState([]);
  const [series, setSeries] = useState([]);
  const startdate = [];
  const weeksum = [];
  console.log(localStorage.getItem("selectEvent"));
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // const user="anup"

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const [expert, setExpert] = useState();
  const [culength, setCuLength] = useState();
  const [oldlength, setOldLength] = useState();
  const [greater, setGreater] = useState();
  const [active, setActive] = useState(1);
  const [chatUserDetail, setChatUserDetail] = useState([]);
  const [registrationId11, setRegistrationId11] = useState("");
  const [users, setUser] = useState("");
  console.log(culength, oldlength);

  const [chatData, setChatData] = useState({
    data: "",
    avatar: "",
    registrationId: 0,
    avtarImgObject: "",
  });
  const [BreakData, setBreakData] = useState({
    subEventId: "",
    offDate: null,
    offFromTime: null,
    offToTime: null,
  });

  const onFileChange = (e) => {
    console.log(e.target.files[0].name, "filesimage");

    let files = e.target.files;
    let render = new FileReader();
    const img = e.target.files[0].name;
    const formData = new FormData();
    render.readAsDataURL(files[0]);
    render.onload = (event) => {
      formData.append("avatar", files[0]);
      const adminurl = `${urlPrefix}v1.0/sendMsgCoachCustomer?data=${chatData.data}&registrationId=${registrationId11}&avatar=${img}`;
      return axios
        .post(adminurl, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            timeStamp: "timestamp",
            accept: "*/*",
            "Content-type": "multipart/form-data; boundary=???",
          },
        })
        .then((res) => {
          if (res.data.response.responseMessage === "SUCCESS") {
            handleChat(registrationId11);
            setChatId(res.data.response.responseData);
          }
        });
    };
  };

  console.log(chatData.avatar, "images path");
  const Open = () => {
    document.getElementById("get_file").onclick = function () {
      document.getElementById("input_file").click();
    };
  };
  const handleMeetingBreak = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setBreakData((values) => ({ ...values, [name]: value }));
  };
  const handleChatData = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setChatData((values) => ({ ...values, [name]: value }));
  };

  const [messageChat, setMessageChat] = useState([]);
  const [chatId, setChatId] = useState(chatModal === false ? 0 : 0);
  const [dateTimeMessage, setDateTimeMessage] = useState("");

  const handleCloseBreakModal = () => {
    setCoachBreakModal(false);
    setBreakData({
      subEventId: "",
      offDate: null,
      offFromTime: null,
      offToTime: null,
    });
    setDateTimeMessage("");
  };
  console.log(BreakData.offFromTime + ":00", "seccc");
  const BreakMeeting = () => {
    if (BreakData.subEventId !== "") {
      if (
        BreakData.offDate !== null ||
        (BreakData.offFromTime !== null && BreakData.offToTime !== null)
      ) {
        const payload = {
          id: null,
          subEventId: BreakData.subEventId,
          offDate: BreakData.offDate,
          offFromTime:
            BreakData.offFromTime !== null
              ? BreakData.offFromTime + ":00"
              : BreakData.offFromTime,
          offToTime:
            BreakData.offToTime !== null
              ? BreakData.offToTime + ":00"
              : BreakData.offToTime,
        };
        const adminurl = `${urlPrefix}v1.0/expertOffDays`;
        return axios
          .post(adminurl, payload, {
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
            setCoachBreakModal(false);
            handle();
            setBreakData({
              subEventId: "",
              offDate: null,
              offFromTime: null,
              offToTime: null,
            });
            setDateTimeMessage("");
          });
      } else {
        setDateTimeMessage("Date Or Time must be fill");
      }
    } else {
      setDateTimeMessage("Please Select Your Porgram");
    }
    // }
  };
  const endChat = (id) => {
    const adminurl = `${urlPrefix}v1.0/terminateChat?registrationId=${id}`;
    return axios
      .put(
        adminurl,
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
        handle();
        setchatModal(false), clearInterval(interval1);
      });
  };
  console.log(registrationId11, "idraeaeaeea");
  const handleChat = (id) => {
    console.log(id, "iddddddddddd");
    const adminurl = `${urlPrefix}v1.0/getCoachClientChat?lastChatId=${0}&registrationId=${id}`;
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
        console.log(res, "response");
        setRegistrationId11(id);
        setMessageChat(res.data.response.responseData);
      });
    // }
  };
  const [coachlist, setCoachlist] = useState([]);
  const CoachProgram = (id) => {
    const adminurl = `${urlPrefix}v1.0/coachWiseActivePrograms`;
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
        setCoachlist(res.data.response?.responseData);
      });
    // }
  };
  const ChatSendApi = (e) => {
    setChatData({
      data: "",
      avatar: "",
    });

    const adminurl = `${urlPrefix}v1.0/sendMsgCoachCustomer?data=${chatData.data}&registrationId=${registrationId11}&avatar=${chatData.avatar}`;
    return axios
      .post(
        adminurl,
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
              "accept,  x-access-token, x-requested-with",
            "Content-type": "multipart/form-data; boundary=???",
          },
        }
      )
      .then((res) => {
        if (res.data.response.responseMessage === "SUCCESS") {
          handleChat(registrationId11);
          setChatId(res.data.response.responseData);
        }
      });
  };
  const [interval1, setInterval111] = useState(null);
  const chatCustomer = (id, name) => {
    setRegistrationId11(id);
    setInterval111(setInterval(() => handleChat(id), 5000));
    var marvelHeroes = greater.filter(function (hero) {
      const x = hero.userName == name;
      return x;
    });
    setchatModal(true);
    setChatUserDetail(marvelHeroes && marvelHeroes[0], "marvels");
  };
  const oldchatCustomer = (id, name) => {
    setRegistrationId11(id);
    setInterval111(setInterval(() => handleChat(id), 5000));
    var marvelHeroes = oldlength.filter(function (hero) {
      const x = hero.userName == name;
      return x;
    });
    setchatModal(true);
    setChatUserDetail(marvelHeroes && marvelHeroes[0], "marvels");
  };
  const handleActive = () => {
    if (active === 0) {
      setActive(1);
      getCoachStatus(1);
    } else {
      setActive(0);
      getCoachStatus(0);
    }
  };
  console.log(users, chatUserDetail, "users");

  const getCoachStatus = (value) => {
    const adminurl = `${urlPrefix}v1.0/setCoachActiveStatus?status=${value}`;
    return axios.get(adminurl, {
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
  };
  const [FilterMeetingDate, setMeetingDate] = useState([]);
  const handle = () => {
    // const adminurl = `${urlPrefix}v1.0/getExpertMeetingDetail?subEventId=96`;
    const adminurl = `${urlPrefix}v1.0/getExpertMeetingDetail`;
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
        console.log(res?.data?.response);
        setExpert(res?.data?.response?.responseData);
        if (res.status === 200 && res.data.response.responseCode === 0) {
          setCuLength(
            res.data.response.responseData.filter(
              (rqs) => rqs.meetingDate === date
            ).length
          );
        } else {
          setCuLength(null);
        }
        if (res.status === 200 && res.data.response.responseCode === 0) {
          setGreater(
            res?.data?.response?.responseData
              ?.sort(function (a, b) {
                return new Date(b.meetingDate) - new Date(a.meetingDate);
              })
              .filter((rqs) => rqs.meetingDate >= date)
          );
          // setMeetingDate([...new Map() ])
        } else {
          setGreater(null);
        }
        if (res.status === 200 && res.data.response.responseCode === 0) {
          setOldLength(
            res.data.response.responseData.filter(
              (rqs) => rqs.meetingDate < date
            )
          );
        } else {
          setOldLength(null);
        }
      });
  };
  console.log(expert);

  const [id, setid] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getCoachStatus(1);
    handle();
    CoachProgram();
  }, []);

  const current = new Date();
  const date = moment(current).format("YYYY-MM-DD").toString();
  console.log(date);
  console.log(radioValue);
  const [displayAddButton, setDisplayAddButton] = useState(false);
  const [dataButtonType, setDataButtonType] = useState("");
  const [isCheckingData, setCheckingData] = useState(false);
  const [eventIDForSync, setEventIDForSync] = useState([]);
  useEffect(() => {
    setPage(0);
    setOrder("desc");
    setOrderBy("");

    setRowsPerPage(50);
  }, []);
  console.log(eventId);
  console.log(eventIDForSync);
  const [series1, setSeries1] = useState();
  const [options1, setOptions1] = useState();
  const valuestartdate = [];
  const valuevalue = [];
  console.log(expert, "expert");
  console.log(series, options);
  const [chatmessage, setChatMessage] = useState("");
  const [messageList, setViewMessageList] = useState([]);
  const viewmessage = [];
  const sendMessage = (message1) => {
    // setViewMessage(message1);
    // viewmessage.push(message1.toString());

    setViewMessageList([...messageList, message1]);
    setChatMessage("");
  };
  console.log(messageList, "message");
  const modalBody = (
    <div
      style={{
        width: "90%",
        // position: 'fixed',
        transform: "translate(5%,20%)",
        height: "200px",
      }}
    >
      <Paper>
        <div>
          <TableContainer>
            <div style={{ display: "flex" }}>
              <div
                style={{ width: "10%", marginLeft: "20px", marginTop: "10px" }}
              >
                <button
                  className="is-success"
                  // style={{width:'20px'}}
                  onClick={() => setCoachBreakModal(true)}
                >
                  Break
                </button>
              </div>
              <div style={{ width: "20%", marginLeft: "20px" }}></div>
              <div style={{ width: "40%", marginTop: "10px" }}>
                {active === 1 ? <span>Online</span> : <span>Offline</span>}
                <span style={{ marginLeft: "20px", marginTop: "20px" }}>
                  <Switch
                    height={22}
                    width={52}
                    onChange={handleActive}
                    className="toggle-switch-checkbox"
                    checked={active === 1 ? true : false}
                  />
                </span>
              </div>
              <div
                style={{ marginTop: "10px", width: "30%", marginLeft: "20px" }}
              >
                <b>Today's Appointment : </b>
                {radioValue === "current" || radioValue === "old"
                  ? culength
                  : 0}
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div
                style={{ width: "60%", display: "flex", marginLeft: "20px" }}
              >
                <div
                  className="first_div"
                  style={{ width: "80px", marginTop: "20px" }}
                  onChange={() => {
                    setRadioValue("old"), handle;
                  }}
                  value={radioValue}
                >
                  <input type="radio" id="old" name="radiobtn" />
                  <label for="old"> Old </label>
                </div>
                <div
                  className="first_div"
                  style={{ width: "400px", marginTop: "20px" }}
                  onChange={() => {
                    setRadioValue("current"), handle;
                  }}
                  value={radioValue}
                >
                  <input
                    type="radio"
                    id="current"
                    defaultChecked
                    name="radiobtn"
                  />
                  <label for="current"> Upcoming Appointment </label>
                </div>
              </div>

              {/* <div style={{width: '20%'}}>
                <p>Online /Offline</p>
                <Switch
                  height={22}
                  width={52}
                  onChange={handleActive}
                  checked={active === 1 ? true : false}
                />
              </div> */}
              <div style={{ width: "40%" }}>
                {radioValue === "current" ? (
                  <TablePagination
                    rowsPerPageOptions={[25, 50, 75, 100]}
                    component="div"
                    count={greater && greater.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                ) : "" || radioValue === "old" ? (
                  <TablePagination
                    rowsPerPageOptions={[25, 50, 75, 100]}
                    component="div"
                    count={oldlength && oldlength.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
            <div style={{ height: "500px", marginLeft: "20px" }}>
              {expert && expert.length > 0 ? (
                <Table
                  // className={classes.table}
                  aria-labelledby="tableTitle"
                  size={"small"}
                  aria-label="enhanced table"
                >
                  <EnhancedTableHead
                    classes={classes}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                  />

                  <TableBody>
                    {radioValue === "current" &&
                    greater &&
                    greater.length > 0 ? (
                      <>
                        {greater &&
                          stableSort(greater, getComparator(order, orderBy))
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row, index) => {
                              return (
                                <TableRow
                                  hover
                                  // tabIndex={-1}
                                  // key={row.userId + "" + index}
                                  className="performace-table-row"
                                >
                                  <TableCell align="left" width="2%">
                                    <div style={{ fontSize: 12 }}>
                                      {index + 1}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" width="10%">
                                    <div style={{ fontSize: 12 }}>
                                      {row.meetingDate ? row.meetingDate : "-"}
                                    </div>
                                  </TableCell>

                                  <TableCell align="left" width="10%">
                                    <div
                                      style={{
                                        fontSize: 12,
                                        display: "flex",
                                        // alignItems: 'center',
                                        // justifyContent: 'center',
                                      }}
                                    >
                                      {row.programType ? row.programType : "-"}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left">
                                    <div
                                      style={{
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                        width: "180px",
                                        display: "block",
                                        overflow: "hidden",
                                        fontSize: 12,
                                      }}
                                    >
                                      {row.programName ? row.programName : "-"}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" width="10%">
                                    <div
                                      style={{
                                        fontSize: 12,
                                        display: "flex",
                                        // alignItems: 'center',
                                        // justifyContent: 'center',
                                      }}
                                    >
                                      {row.userName ? row.userName : "-"}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" width="10%">
                                    <div
                                      style={{
                                        fontSize: 12,
                                        display: "flex",
                                        // alignItems: 'center',
                                        // justifyContent: 'center',
                                      }}
                                    >
                                      {row.relation ? row.relation : "-"}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" width="10%">
                                    <div
                                      style={{
                                        fontSize: 12,
                                        display: "flex",
                                        // alignItems: 'center',
                                        // justifyContent: 'center',
                                      }}
                                    >
                                      {row.dependentName
                                        ? row.dependentName
                                        : "-"}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" width="10%">
                                    <div
                                      style={{
                                        // whiteSpace: 'nowrap',
                                        // textOverflow: 'ellipsis',
                                        width: "120px",
                                        display: "flex",
                                        // overflow: 'hidden',
                                        fontSize: 12,
                                      }}
                                    >
                                      {row.notes ? row.notes : "-"}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" width="10%">
                                    <div
                                      style={{
                                        fontSize: 12,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      {row.mobilePhone ? row.mobilePhone : "-"}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" width="20%">
                                    <div
                                      style={{
                                        fontSize: 12,
                                        display: "flex",
                                        // alignItems: 'center',
                                        // justifyContent: 'center',
                                      }}
                                    >
                                      {row.meetingTime} - {row.sessionTime}
                                    </div>
                                  </TableCell>

                                  <TableCell align="left" width="5%">
                                    <div
                                      style={{
                                        fontSize: 12,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      {" "}
                                      {row.message === true &&
                                      row.id !== null ? (
                                        <button
                                          style={{
                                            color: "white",
                                            backgroundColor: "green",
                                            borderRadius: "25px",
                                            height: "20px",
                                            width: "40px",
                                          }}
                                          onClick={() => {
                                            handleChat(row.id),
                                              chatCustomer(
                                                row.id,
                                                row.userName
                                              );
                                          }}
                                        >
                                          Chat
                                        </button>
                                      ) : (
                                        "-"
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell align="center" width="5%">
                                    <div
                                      style={{
                                        fontSize: 12,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <button
                                        style={{
                                          color: "white",
                                          backgroundColor: "green",
                                          borderRadius: "25px",
                                          height: "20px",
                                          width: "40px",
                                        }}
                                        onClick={() => {
                                          return (
                                            <>
                                              {location.replace(
                                                `${row.expertZoomLink}`
                                              )}
                                            </>
                                          );
                                        }}
                                      >
                                        Join
                                      </button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                      </>
                    ) : radioValue === "old" &&
                      oldlength &&
                      oldlength.length > 0 ? (
                      <>
                        {oldlength &&
                          stableSort(oldlength, getComparator(order, orderBy))
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row, index) => {
                              // console.log(row);
                              return (
                                <TableRow
                                  hover
                                  // tabIndex={-1}
                                  // key={row.id}
                                  className="performace-table-row"
                                >
                                  <TableCell align="left" width="2%">
                                    <div style={{ fontSize: 12 }}>
                                      {index + 1}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" width="10%">
                                    <div style={{ fontSize: 12 }}>
                                      {row.meetingDate ? row.meetingDate : "-"}
                                    </div>
                                  </TableCell>

                                  <TableCell align="left" width="10%">
                                    <div
                                      style={{
                                        fontSize: 12,
                                        display: "flex",
                                        // alignItems: 'center',
                                        // justifyContent: 'center',
                                      }}
                                    >
                                      {row.programType ? row.programType : "-"}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" width="20%">
                                    <div
                                      style={{
                                        fontSize: 12,
                                        display: "flex",
                                        // alignItems: 'center',
                                        // justifyContent: 'center',
                                      }}
                                    >
                                      {row.programName ? row.programName : "-"}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" width="10%">
                                    <div
                                      style={{
                                        fontSize: 12,
                                        display: "flex",
                                        // alignItems: 'center',
                                        // justifyContent: 'center',
                                      }}
                                    >
                                      {row.userName ? row.userName : "-"}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" width="10%">
                                    <div
                                      style={{
                                        fontSize: 12,
                                        display: "flex",
                                        // alignItems: 'center',
                                        // justifyContent: 'center',
                                      }}
                                    >
                                      {row.relation ? row.relation : "-"}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" width="10%">
                                    <div
                                      style={{
                                        fontSize: 12,
                                        display: "flex",
                                        // alignItems: 'center',
                                        // justifyContent: 'center',
                                      }}
                                    >
                                      {row.dependentName
                                        ? row.dependentName
                                        : "-"}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" width="10%">
                                    <div
                                      style={{
                                        fontSize: 12,
                                        display: "flex",
                                        // alignItems: 'center',
                                        // justifyContent: 'center',
                                      }}
                                    >
                                      {row.notes ? row.notes : "-"}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" width="10%">
                                    <div
                                      style={{
                                        fontSize: 12,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      {row.mobilePhone ? row.mobilePhone : "-"}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" width="20%">
                                    <div
                                      style={{
                                        fontSize: 12,
                                        display: "flex",
                                        // alignItems: 'center',
                                        // justifyContent: 'center',
                                      }}
                                    >
                                      {row.meetingTime} - {row.sessionTime}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" width="5%">
                                    <div
                                      style={{
                                        fontSize: 12,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      {" "}
                                      {row.message === true &&
                                      row.id !== null ? (
                                        <button
                                          style={{
                                            color: "white",
                                            backgroundColor: "green",
                                            borderRadius: "25px",
                                            height: "20px",
                                            width: "40px",
                                          }}
                                          onClick={() => {
                                            handleChat(row.id),
                                              oldchatCustomer(
                                                row.id,
                                                row.userName
                                              );
                                          }}
                                        >
                                          Chat
                                        </button>
                                      ) : (
                                        "-"
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                      </>
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          style={{
                            // position: 'relative',
                            height: 400,
                            marginTop: "-20%",
                          }}
                        >
                          <p
                            style={{
                              textAlign: "center",
                              // margin: '100px 0',
                              color: "#8e8e8e",
                            }}
                          >
                            Data is not present
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : (
                <p
                  style={{
                    width: "100%",
                    height: "200px",
                    // display: 'flex',
                    // marginTop: '260px',
                    marginLeft: "500px",
                  }}
                >
                  {" "}
                  <div>
                    {" "}
                    <h2 style={{ marginTop: "10px" }}> No data present</h2>{" "}
                  </div>{" "}
                </p>
              )}
            </div>
          </TableContainer>
        </div>
      </Paper>
      {/* 
      {displayModal && (
        <AddPastDetailForm
          {...{
            selectedDate,
            displayModal,
            setDisplayModal,
            eventId,
            handlePerformanceClick,
          }}
        />
      )} */}
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
      {chatModal && (
        <InfoDialog open={chatModal} onClose={() => setchatModal(false)}>
          <CancelIcon
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              color: "#ef5350",
              cursor: "pointer",
            }}
            onClick={() => {
              setchatModal(false), clearInterval(interval1);
            }}
          />

          <div className="chatPage">
            <div className="chatContainer">
              <div className="header1">
                <p>
                  {" "}
                  <Avatar
                    // src={userDetails.avatarImg}
                    style={{
                      width: 40,
                      height: 40,
                      border: "2px solid #f8f8f8",
                      // marginTop: '10px',
                      marginLeft: 10,
                    }}
                  />
                </p>
                <h2 style={{ marginLeft: "" }}> {chatUserDetail.userName}</h2>

                {/* <a href="/">
                  {' '}
                  <img src={closeIcon} alt="Close" />
                </a> */}
                <div>
                  <button
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      // marginTop: '-30px',
                      width: "150px",
                      // float:'right'
                      marginLeft: "80%",
                    }}
                    onClick={() => endChat(chatUserDetail.id)}
                  >
                    End Session
                  </button>
                </div>
              </div>
              <ReactScrollToBottom className="chatBox">
                {messageChat &&
                  messageChat.length > 0 &&
                  messageChat.map((item, i) =>
                    // <Message12
                    //   user={item.id === id ? '' : item.user}
                    //   message={item.message}
                    //   classs={item.id === id ? 'right1' : 'left'}
                    // />
                    {
                      if (item.contentBy === "CUSTOMER") {
                        return (
                          <>
                            <br />{" "}
                            <p className=" messageBox left ">
                              {item.contentType === "text" ? (
                                <>
                                  {" "}
                                  <span>{item.content} </span>
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      marginTop: "20px",
                                      float: "right",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    {item.dateTime.substring(11, 16)}{" "}
                                  </span>
                                </>
                              ) : item.contentType === "image" ? (
                                <>
                                  <a
                                    target="_blank"
                                    href={item.content.substring(
                                      item.content.indexOf("http")
                                    )}
                                    style={{
                                      cursor: "pointer",
                                      width: "200px",
                                      height: "200px",
                                    }}
                                  >
                                    <span>
                                      {}

                                      <img
                                        src={item.content.substring(
                                          item.content.indexOf("https")
                                        )}
                                        height="200px"
                                        width="200px"
                                      />
                                    </span>
                                  </a>
                                  <div
                                    style={{ width: "200px", display: "flex" }}
                                  >
                                    {item.content.substring(
                                      0,
                                      item.content.indexOf("https")
                                    )}
                                  </div>
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      marginBootom: "10px",
                                      float: "right",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    {item.dateTime.substring(11, 16)}{" "}
                                  </span>
                                </>
                              ) : item.contentType === "document" ? (
                                <>
                                  <a
                                    target="_blank"
                                    href={item.content.substring(
                                      item.content.indexOf("http")
                                    )}
                                    style={{
                                      cursor: "pointer",
                                      width: "200px",
                                      height: "200px",
                                    }}
                                  >
                                    <span>
                                      <embed
                                        src={item.content.substring(
                                          item.content.indexOf("https")
                                        )}
                                        width="200"
                                        height="200"
                                      />
                                    </span>
                                  </a>

                                  <div
                                    style={{ width: "200px", display: "flex" }}
                                  >
                                    {item.content.substring(
                                      0,
                                      item.content.indexOf("https")
                                    )}
                                  </div>
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      marginBootom: "10px",
                                      float: "right",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    {item.dateTime.substring(11, 16)}{" "}
                                  </span>
                                </>
                              ) : item.contentType === "video" ? (
                                <>
                                  <span>
                                    <video width="200" height="200" controls>
                                      <source
                                        src={item.content.substring(
                                          item.content.indexOf("https")
                                        )}
                                        type="video/mp4"
                                      />
                                      Your browser does not support the video
                                      tag.
                                    </video>
                                  </span>
                                  <div
                                    style={{ width: "200px", display: "flex" }}
                                  >
                                    {item.content.substring(
                                      0,
                                      item.content.indexOf("https")
                                    )}
                                  </div>
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      marginBootom: "10px",
                                      float: "right",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    {item.dateTime.substring(11, 16)}{" "}
                                  </span>
                                </>
                              ) : item.contentType === "audio" ? (
                                <>
                                  <span>
                                    <audio width="200" height="200" controls>
                                      <source
                                        src={item.content.substring(
                                          item.content.indexOf("https")
                                        )}
                                        type="audio/mp4"
                                      />
                                      Your browser does not support the video
                                      tag.
                                    </audio>
                                  </span>
                                  <div
                                    style={{ width: "200px", display: "flex" }}
                                  >
                                    {item.content.substring(
                                      0,
                                      item.content.indexOf("https")
                                    )}
                                  </div>
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      marginBootom: "10px",
                                      float: "right",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    {item.dateTime.substring(11, 16)}{" "}
                                  </span>
                                </>
                              ) : (
                                ""
                              )}
                            </p>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <p className="messageBox right1">
                              {item.contentType === "text" ? (
                                <>
                                  {" "}
                                  <span>{item.content} </span>
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      marginTop: "20px",
                                      float: "right",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    {item.dateTime.substring(11, 16)}{" "}
                                  </span>
                                </>
                              ) : item.contentType.substring(
                                  0,
                                  item.contentType.indexOf("/")
                                ) === "image" ? (
                                <>
                                  <a
                                    target="_blank"
                                    href={item.content.substring(
                                      item.content.indexOf("http")
                                    )}
                                    style={{
                                      cursor: "pointer",
                                      width: "200px",
                                      height: "200px",
                                    }}
                                  >
                                    <span>
                                      {}

                                      <img
                                        src={item.content.substring(
                                          item.content.indexOf("https")
                                        )}
                                        height="200px"
                                        width="200px"
                                      />
                                    </span>
                                  </a>
                                  <div
                                    style={{ width: "200px", display: "flex" }}
                                  >
                                    {item.content.substring(
                                      0,
                                      item.content.indexOf("https")
                                    )}
                                  </div>
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      marginBootom: "10px",
                                      float: "right",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    {item.dateTime.substring(11, 16)}{" "}
                                  </span>
                                </>
                              ) : item.contentType.substring(
                                  0,
                                  item.contentType.indexOf("/")
                                ) === "application" ? (
                                <>
                                  <a
                                    target="_blank"
                                    href={item.content.substring(
                                      item.content.indexOf("http")
                                    )}
                                    style={{
                                      cursor: "pointer",
                                    }}
                                  >
                                    <span>
                                      <embed
                                        src={item.content.substring(
                                          item.content.indexOf("https")
                                        )}
                                        width="200"
                                        height="200"
                                      />
                                    </span>

                                    <div
                                      style={{
                                        width: "200px",
                                        display: "flex",
                                      }}
                                    >
                                      {item.content.substring(
                                        0,
                                        item.content.indexOf("https")
                                      )}
                                    </div>
                                    <span
                                      style={{
                                        fontSize: "11px",
                                        marginBootom: "10px",
                                        float: "right",
                                        marginLeft: "10px",
                                      }}
                                    >
                                      {item.dateTime.substring(11, 16)}{" "}
                                    </span>
                                  </a>
                                </>
                              ) : item.contentType.substring(
                                  0,
                                  item.contentType.indexOf("/")
                                ) === "video" ? (
                                <>
                                  <span>
                                    {}

                                    <iframe
                                      width="200"
                                      height="200"
                                      src={item.content.substring(
                                        item.content.indexOf("https")
                                      )}
                                      title="YouTube video player"
                                      frameborder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowfullscreen
                                    ></iframe>
                                  </span>
                                  <div
                                    style={{ width: "200px", display: "flex" }}
                                  >
                                    {item.content.substring(
                                      0,
                                      item.content.indexOf("https")
                                    )}
                                  </div>
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      marginBootom: "10px",
                                      float: "right",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    {item.dateTime.substring(11, 16)}{" "}
                                  </span>
                                </>
                              ) : item.contentType.substring(
                                  0,
                                  item.contentType.indexOf("/")
                                ) === "audio" ? (
                                <>
                                  <span>
                                    <audio width="200" height="200" controls>
                                      <source
                                        src={item.content.substring(
                                          item.content.indexOf("https")
                                        )}
                                        type="audio/mp4"
                                      />
                                      Your browser does not support the video
                                      tag.
                                    </audio>
                                  </span>
                                  <div
                                    style={{ width: "200px", display: "flex" }}
                                  >
                                    {item.content.substring(
                                      0,
                                      item.content.indexOf("https")
                                    )}
                                  </div>
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      marginBootom: "10px",
                                      float: "right",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    {item.dateTime.substring(11, 16)}{" "}
                                  </span>
                                </>
                              ) : (
                                ""
                              )}
                            </p>
                            <br />
                          </>
                        );
                      }
                    }
                  )}
              </ReactScrollToBottom>
              <div className="inputBox">
                <input
                  placeholder="Type Messsage"
                  type="text"
                  id="chatInput"
                  value={
                    /^[a-z0-9]+( [a-z0-9]+)*$/gi.test(chatData.data[0]) !==
                    false
                      ? chatData.data
                      : ""
                  }
                  onChange={handleChatData}
                  name="data"
                  onKeyPress={(event) =>
                    chatData.data.length > 0 &&
                    /^[a-z0-9]+( [a-z0-9]+)*$/gi.test(chatData.data[0]) !==
                      false &&
                    event.key === "Enter"
                      ? ChatSendApi(id)
                      : null
                  }
                />
                <div style={{ width: "10%", marginTop: "5%" }}>
                  <button
                    id="get_file"
                    variant="outlined"
                    onClick={() => Open()}
                  >
                    <Paperclip size={30} />
                  </button>
                  <input
                    type="file"
                    id="input_file"
                    accept=".jpg,.jpeg,.png"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      onFileChange(e);
                    }}
                    name="avatar"
                  />
                </div>
                {chatData.data.length > 0 &&
                /^[a-z0-9]+( [a-z0-9]+)*$/gi.test(chatData.data[0]) ? (
                  <button
                    onClick={() => ChatSendApi(id)}
                    // onSubmit={() => ChatSendApi(id)}
                    className="sendBtn"
                  >
                    <img
                      src="images/chat/send.png"
                      height="30px"
                      width="30px"
                      alt="Send"
                    />
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </InfoDialog>
      )}

      {coachbreakModal && (
        <InfoDialog open={coachbreakModal} onClose={handleCloseBreakModal}>
          <CancelIcon
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              color: "#ef5350",
              cursor: "pointer",
            }}
            onClick={handleCloseBreakModal}
          />
          <div style={{ width: "400px", height: "200px" }}>
            <div style={{ display: "flex" }}>
              <div style={{ width: "50%", marginLeft: "10px" }}>
                <label>Program</label>
                <br />
                <select
                  style={{
                    background: "#f3f4f6",
                    padding: "8px 12px",
                    borderRadius: 6,
                    fontSize: 15,
                    width: "92%",
                    height: "38px",
                    border: "1px solid black",
                  }}
                  value={BreakData.subEventId}
                  name="subEventId"
                  onChange={handleMeetingBreak}
                >
                  <option>select...</option>
                  {coachlist &&
                    coachlist.map((item) => {
                      return (
                        <>
                          <option value={item.id}>{item.eventName}</option>
                        </>
                      );
                    })}
                </select>
              </div>
              <div style={{ width: "50%" }}>
                <label>Date</label>
                <br />
                <input
                  type="date"
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 10px",
                    borderRadius: 6,
                    fontSize: 18,
                    width: "80%",
                    height: "15px",
                    border: "1px solid black",
                  }}
                  value={BreakData.offDate}
                  name="offDate"
                  onChange={handleMeetingBreak}
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "50%", marginLeft: "10px" }}>
                <label>From Time</label>
                <br />
                <input
                  type="time"
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 10px",
                    borderRadius: 6,
                    fontSize: 18,
                    width: "80%",
                    height: "15px",
                    border: "1px solid black",
                  }}
                  value={BreakData.offFromTime}
                  name="offFromTime"
                  onChange={handleMeetingBreak}
                />
              </div>
              <div style={{ width: "50%" }}>
                <label>End Time</label>
                <br />
                <input
                  type="time"
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 10px",
                    borderRadius: 6,
                    fontSize: 18,
                    width: "80%",
                    height: "15px",
                    border: "1px solid black",
                  }}
                  value={BreakData.offToTime}
                  name="offToTime"
                  onChange={handleMeetingBreak}
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  width: "65%",
                  marginLeft: "10px",
                  float: "right",
                  color: "red",
                  marginTop: "5%",
                }}
              >
                {" "}
                {dateTimeMessage}
              </div>
              <div style={{ width: "30%", marginTop: "5%" }}>
                <button
                  style={{
                    color: "white",
                    backgroundColor: "green",
                    borderRadius: "20px",
                  }}
                  onClick={BreakMeeting}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </InfoDialog>
      )}
    </div>
  );
}
