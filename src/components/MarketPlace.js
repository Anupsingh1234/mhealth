import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import EventInfoModal from "./EventInfoModal";
import InfoIcon from "@material-ui/icons/Info";
import eventGalleryNoData from "../assets/eventGalleryNoData.jpeg";
import { getWeekDayByNumber } from "../utils/commonFunctions";
import InfoDialog from "./Utility/InfoDialog";
import Message from "antd-message";
import { CheckCircle } from "react-feather";
import ReactStars from "react-rating-stars-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, facebook } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import StarRatings from "react-star-ratings";
import Calendar from "react-calendar";
// import 'react-calendar/dist/Calendar.css';
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { PlusCircle, Copy } from "react-feather";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import Iframe from "react-iframe";
// import './Calender.css';
import moment from "moment";
import CancelIcon from "@material-ui/icons/Cancel";
// import calendly from 'react-calendly';
import {
  ratingProgramByUser,
  urlPrefix,
  getSubEvent,
} from "../services/apicollection";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import InstagramIcon from "@material-ui/icons/Instagram";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import {
  subscribeSubEventCall,
  unSubcribeSubEventCall,
} from "../services/challengeApi";
import message from "antd-message";
// import AddActivityModal from './AddActivityModal';
// import getcoach from '../../../services/apicollection';
import { ContactSupportOutlined } from "@material-ui/icons";
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

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(1, 1, 0, 0),
  },
  root: {
    width: "100%",
    // border: "1px solid black"
  },
  paper: {
    position: "absolute",
    width: "90%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    outline: "none",
    // maxHeight: 500,
    marginLeft: "195px",
  },
  table: {
    position: "relative",
    width: "100%",
    backgroundColor: "#fff",
    // padding: 12,
    borderRadius: 12,
    outline: "none",
    // maxHeight: 1200,
    // marginLeft: '195px',
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
// const [subEventDetail, setSubEventDetail] = useState([]);

const MarketPlace = ({
  subEventDetail,
  currentEventObj,
  handleSubscription,
  type,
  handleSubEventSelection = () => {},
  selectedSubEvent,
  handleSubEventEdit,
  eventId,
}) => {
  // const subEventDetail = [];
  // const getprogram = () => {
  //   const adminurl = `${urlPrefix}v1.0/getAllPrograms?eventId=10`;
  //   //  setDependentValue(true);
  //   return axios
  //     .get(adminurl, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         timeStamp: 'timestamp',
  //         accept: '*/*',
  //         'Access-Control-Allow-Origin': '*',
  //         withCredentials: true,
  //         'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
  //         'Access-Control-Allow-Headers':
  //           'accept, content-type, x-access-token, x-requested-with',
  //       },
  //     })
  //     .then((res) => {
  //       console.log(res.data.response.responseData);
  //       // setSubEventDetail(res.data.response?.responseData);
  //       res.data.response?.responseData &&
  //         res.data.response?.responseData.map((item) => {
  //           subEventDetail.push(item);
  //         });
  //     });
  // };
  // useEffect(() => {
  //   getprogram();
  // }, []);
  // console.log(subEventDetail,'program');
  const [modalView, setModalView] = useState(false);
  const [showUnsubscribeModal, setUnsubModal] = useState(false);
  const [mfinemodal, setmfinemodal] = useState(false);
  const [activityModalView, setActivityModalView] = useState();
  const [showBook, setBook] = useState(false);
  const [url, seturl] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  let startDate = subEventDetail.eventStartDate
    ? subEventDetail.eventStartDate.split(" ")
    : "";
  let endDate = subEventDetail.eventEndDate
    ? subEventDetail.eventEndDate.split(" ")
    : "";
  let startDay = startDate[0].split("-")[2];
  let endDay = endDate[0].split("-")[2];
  let startMonth = monthsObject[startDate[0].split("-")[1]];
  let endMonth = monthsObject[endDate[0].split("-")[1]];

  //GET API CALLING

  const [actualData, setactualData] = useState([]);
  const [coach, setcoach] = useState({});

  const setUserData = (id, evenId) => {
    const url = `${urlPrefix}v1.0/submitAssociatesDetail`;
    return axios.post(
      url,
      {
        associateReq: {
          associateName: subEventDetail?.associateName,
          eventId: evenId,
          mobileNumber: `${"91" + localStorage.getItem("mobileNumber")}`,
          reqUrl: subEventDetail?.auth_url,
          subEventId: id,
          userId: localStorage.getItem("userId"),
          userLastName: localStorage.getItem("firstName"),
          userfirstName: localStorage.getItem("lastName"),
        },
        associateResp: {
          response: url,
        },
      },
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
    );
  };

  const consultApi = () => {
    return axios
      .post(
        subEventDetail?.auth_url,
        {
          user_type: "patient",
          target_url: subEventDetail?.targetUrl,
          user_details: {
            mobile_number: `${"91" + localStorage.getItem("mobileNumber")}`,
            firstname: localStorage.getItem("firstName"),
            lastname: localStorage.getItem("lastName"),
          },
        },
        {
          headers: {
            secret_key: subEventDetail?.secretKey,
            client_id: "mhealth",
            Content_Type: "application/json",
          },
        }
      )
      .then((res) => {
        seturl(res?.data?.redirect_url);
        setmfinemodal(true);
        setUserData(subEventDetail?.id, subEventDetail?.eventId);
      });
  };

  const headCells = [
    {
      label: "",
      id: "index",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "S.No",
      id: "index",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Name",

      id: "firstName",
      numeric: false,
      disablePadding: true,
    },

    {
      label: "Relation",
      id: "dependantRelation",
      numeric: false,
      disablePadding: true,
    },

    {
      label: "Gender",
      id: "gender",
      numeric: false,
      disablePadding: true,
    },
    // {
    //   label: 'Option4',
    //   id: 'option4',
    //   numeric: false,
    //   disablePadding: true,
    // },

    // {
    //   label: 'Update',
    //   //  id: 'link',
    //   // numeric: false,
    //   // disablePadding: true,
    // },
  ];

  function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
    // if (radioValue === 'Daily') {
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
    // }
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
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 4));
    setPage(0);
  };
  const avg = () => {
    var str = window.location.href;
    var getval = "/#/activities";
    var result = str.match(getval);

    if (result != "/#/activities") {
      return (
        <>
          <span style={{ display: "flex" }}>
            <StarRatings
              rating={
                subEventDetail.programRating !== null
                  ? parseFloat(subEventDetail.programRating)
                  : 0
              }
              starRatedColor="#ffd700"
              starDimension="15px"
              numberOfStars={5}
              name="rating"
              starSpacing="0px"
            />
            <span
              style={{
                fontSize: 12,
                marginTop: "2px",
                fontWeight: "bolder",
                marginLeft: "5px",
              }}
            >
              {subEventDetail.programRating !== null
                ? subEventDetail.programRating.toFixed(1)
                : ""}
            </span>
          </span>
        </>
      );
    }
  };

  const renderRegisterBtn = () => {
    if (
      subEventDetail.timePeriod == "PAST" &&
      subEventDetail.eventNature === "INDIVIDUAL"
    ) {
      return (
        <div className="register-button">
          <button style={{ background: "#9e9e9e" }}>Expired</button>
        </div>
      );
    } else {
      if (!subEventDetail?.participated) {
        if (subEventDetail?.regOpen) {
          if (subEventDetail.eventNature === "INDIVIDUAL") {
            return (
              <div className="register-button">
                <button
                  style={{ marginBottom: "10px" }}
                  onClick={() => {
                    subEventDetail.addressRequired == 1 ||
                    subEventDetail.dependentRequired == 1
                      ? getaddress(
                          subEventDetail.id,
                          subEventDetail.addressRequired,
                          subEventDetail.dependentRequired
                        )
                      : changeDate1(subEventDetail.id);
                  }}
                >
                  Book Now
                </button>
              </div>
            );
          }
        }
      } else {
        if (
          subEventDetail.eventNature === "INDIVIDUAL" &&
          subEventDetail.userStatusInProgram === "SUBSCRIBED"
        ) {
          return (
            <div className="register-button">
              <button
                style={{ background: "#F43F5E", marginBottom: "10px" }}
                onClick={() => {
                  subEventDetail.addressRequired == 1 ||
                  subEventDetail.dependentRequired == 1
                    ? unSubcribeSubEventCall({
                        eventId: currentEventObj.id,
                        subEventId: subEventDetail.id,
                      }).then((res) => {
                        handleSubscription();
                        message.success("Booking Cancel Successfull.");
                        // setUnsubModal(false);
                      })
                    : cancelAppointment(
                        subEventDetail.eventId,
                        subEventDetail.id
                      );
                }}
              >
                Cancel
              </button>
            </div>
          );
        } else {
          if (
            subEventDetail.eventNature === "INDIVIDUAL" &&
            subEventDetail.userStatusInProgram == "UNSUBSCRIBED" &&
            subEventDetail.canRejoin
          ) {
            return (
              <div className="register-button">
                <button
                  style={{ background: "#ffa726", marginBottom: "10px" }}
                  onClick={() => {
                    subEventDetail.addressRequired == 1 ||
                    subEventDetail.dependentRequired == 1
                      ? getaddress(
                          subEventDetail.id,
                          subEventDetail.addressRequired,
                          subEventDetail.dependentRequired
                        )
                      : changeDate1(subEventDetail.id);
                  }}
                >
                  Rebook
                </button>
              </div>
            );
          }
        }
      }
    }

    if (subEventDetail.timePeriod == "PAST") {
      return (
        <div className="register-button">
          <button style={{ background: "#9e9e9e" }}>Expired</button>
        </div>
      );
    } else {
      if (
        !subEventDetail?.participated &&
        subEventDetail.eventNature !== "ASSOCIATE"
      ) {
        if (subEventDetail?.regOpen) {
          return (
            <div style={{ display: "flex" }}>
              <div className="register-button" style={{ width: "50%" }}>
                <button
                  style={{ marginBottom: "10px" }}
                  onClick={() =>
                    subscribeSubEventCall({
                      dataSource:
                        currentEventObj.dataSource === "WHATSAPP"
                          ? "WEB"
                          : currentEventObj.dataSource,
                      eventId: currentEventObj.id,
                      subEventId: subEventDetail.id,
                    }).then((res) => {
                      message.success("Program Subscribed");
                      handleSubscription();
                    })
                  }
                >
                  Attach
                </button>
              </div>
              <div className="register-button" style={{ width: "50%" }}>
                <button
                  style={{ marginBottom: "10px" }}
                  onClick={() =>
                    subscribeSubEventCall({
                      dataSource:
                        currentEventObj.dataSource === "WHATSAPP"
                          ? "WEB"
                          : currentEventObj.dataSource,
                      eventId: currentEventObj.id,
                      subEventId: subEventDetail.id,
                    }).then((res) => {
                      message.success("Program Subscribed");
                      handleSubscription();
                    })
                  }
                >
                  Query
                </button>
              </div>
            </div>
          );
        }
      } else if (
        !subEventDetail?.participated &&
        subEventDetail.eventNature === "ASSOCIATE"
      ) {
        if (!subEventDetail?.participated) {
          if (subEventDetail?.regOpen) {
            if (subEventDetail.eventNature === "ASSOCIATE") {
              return (
                <div className="register-button">
                  <button
                    style={{ marginBottom: "10px", background: "#ff9800" }}
                    onClick={() => consultApi()}
                  >
                    Consult Now
                  </button>
                </div>
              );
            }
          }
        }
      } else {
        if (subEventDetail.userStatusInProgram === "SUBSCRIBED") {
          return (
            <div className="register-button">
              <button
                onClick={() => setUnsubModal(true)}
                style={{ background: "#F43F5E", marginBottom: "10px" }}
              >
                Unsubscribe
              </button>
            </div>
          );
        }
        if (subEventDetail.userStatusInProgram === "PENDING") {
          return (
            <div className="register-button">
              <button style={{ background: "#ff9800", marginBottom: "10px" }}>
                Pending
              </button>
            </div>
          );
        }
        if (
          subEventDetail.userStatusInProgram == "UNSUBSCRIBED" &&
          subEventDetail.canRejoin
        ) {
          return (
            <div className="register-button">
              <button
                onClick={() =>
                  subscribeSubEventCall({
                    dataSource:
                      currentEventObj.dataSource === "WHATSAPP"
                        ? "WEB"
                        : currentEventObj.dataSource,
                    eventId: currentEventObj.id,
                    subEventId: subEventDetail.id,
                    rejoin: true,
                  }).then((res) => {
                    message.success(res?.data?.response?.responseMessage);
                    handleSubscription();
                  })
                }
                style={{ background: "#ffa726", marginBottom: "10px" }}
              >
                Rejoin
              </button>
            </div>
          );
        }
      }
    }
  };

  const renderJoinBtn = () => {
    if (subEventDetail.timePeriod == "PAST") {
      return;
    }

    if (subEventDetail.registrationFees == 0) {
      if (
        subEventDetail.userStatusInProgram === "SUBSCRIBED" &&
        subEventDetail.eventLink
      ) {
        return (
          <div
            style={{ width: "fit-content", fontSize: 12, marginBottom: "10px" }}
          >
            <a
              target="_blank"
              href={subEventDetail.eventLink}
              style={{
                color: "#fff",
                background: "#518ad6",
                borderRadius: 4,
                padding: "0px 4px",
              }}
            >
              Join
            </a>
          </div>
        );
      }
    } else {
      if (subEventDetail.userStatusInProgram === "SUBSCRIBED") {
        return (
          <div
            style={{ width: "fit-content", fontSize: 12, marginBottom: "10px" }}
          >
            <a
              target="_blank"
              href={subEventDetail.eventLink}
              style={{
                color: "#fff",
                background: "#518ad6",
                borderRadius: 4,
                padding: "0px 4px",
              }}
            >
              Join
            </a>
          </div>
        );
      } else {
        if (subEventDetail.userStatusInProgram === "PENDING") {
          return (
            <div
              style={{
                width: "fit-content",
                fontSize: 12,
                marginBottom: "10px",
              }}
            >
              <a
                target="_blank"
                href={subEventDetail.paymentLink}
                style={{
                  color: "#fff",
                  background: "#518ad6",
                  borderRadius: 4,
                  padding: "0px 4px",
                }}
              >
                Pay Here
              </a>
            </div>
          );
        }
      }
    }
  };
  const getTime = (time) => {
    return (time && time.substr(0, 5)) || "";
  };

  // NEW CODE ENDED

  const closeIcon = (
    <svg fill="white" viewBox="0 0 20 20" width={28} height={28}>
      <path
        fillRule="evenodd"
        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
  const [queryModal, setQueryModal] = useState(false);
  const [querySentModal, setQuerySetModal] = useState(false);
  const [atach, setatach] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const condition = JSON.parse(localStorage.getItem("condition"));

  const geAttached = (id) => {
    const adminurl = `${urlPrefix}v1.0/attachSubEvent?eventId=${eventId}&keyword=attach&subEventId=${id}`;
    //  setDependentValue(true);
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
        handleSubscription();
        setatach(false);
        Message.success(res.data.response.responseMessage);
      });
  };
  const postQuery = (event, id) => {
    event.preventDefault();
    const adminurl = `${urlPrefix}v1.0/queryRaised`;
    const payload = {
      id: null,
      createdBy: localStorage.getItem("userId"),
      createdOn: "",
      eventId: eventId,
      queryDescription: query,
      subEventId: id,
      isActive: 1,
    };
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
        // handleSubscription();
        setQueryModal(false);
        Message.success(res.data.response.responseMessage);
        handleSubscription();
      });
  };

  const onOpenModal = () => {
    setOpen(true);

    const getcdata = async () => {
      const url = `${urlPrefix}v1.0/searchAndViewCoachProfile?phoneNumber=${subEventDetail.coachPhoneNumber}`;
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
      console.log(datares);
      setcoach(datares.response.responseData);
    };

    getcdata();
  };
  const onCloseModal = () => setOpen(false);

  return (
    <div
      className="challenge-card"
      style={
        type == "view"
          ? { margin: "25px 5px", height: "auto", cursor: "default" }
          : { height: "auto" }
      }
    >
      {/* <div className="rate_us text-center" style={{ height: '22px', background: 'white', border: 'none' }}>
        {rateUs()}
      </div> */}

      {subEventDetail.id == selectedSubEvent && type == "manage" && (
        <CheckCircle
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1,
            color: "#518ad6",
          }}
        />
      )}
      <div key={subEventDetail.id}>
        <div onClick={() => handleSubEventSelection(subEventDetail)}>
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
              src={subEventDetail.eventImage || eventGalleryNoData}
              style={{
                width: 230,
                height: 100,
                objectFit: "cover",
                borderRadius: "12px 12px 0px 0px",
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = eventGalleryNoData;
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: 5,
                fontSize: 12,
                color: "#fff",
                left: 5,
              }}
            >
              <span
                style={{
                  background: "#43a047",
                  borderRadius: 4,
                  padding: "0px 4px",
                  marginLeft: 5,
                }}
              >
                {subEventDetail.registrationFees == 0
                  ? "Free"
                  : `Cost Per Person : ${subEventDetail.registrationFees}`}
              </span>
            </div>
          </div>
          <div className="challenge-card-details">
            <div className={"challenge-card-details-name"}>
              {subEventDetail.eventName}
            </div>

            <div className="d-flex" style={{ fontSize: 12 }}>
              <span>
                {" "}
                Coach/Partner:{" "}
                <span
                  onClick={() => {
                    onOpenModal(), (window.value = subEventDetail.id);
                  }}
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  {" "}
                  {subEventDetail.coach}
                </span>{" "}
              </span>
              <Modal
                open={open}
                styles={{ modal: { borderRadius: "10px", maxWidth: "600px" } }}
                onClose={onCloseModal}
                center
                closeIcon={closeIcon}
              >
                <CancelIcon
                  style={{
                    position: "absolute",
                    top: 15,
                    right: 5,
                    color: "#ef5350",
                    cursor: "pointer",
                  }}
                />
                <div
                  style={{
                    padding: "20px",
                    paddingLeft: "5px",
                    paddingBottom: "0px",
                    paddingTop: "10px",
                  }}
                >
                  <div
                    className="header"
                    style={{
                      display: "flex",
                      // justifyContent: "space-between",
                    }}
                  >
                    <div style={{ width: "60%" }}>
                      <img
                        src={coach.coachImage}
                        style={{
                          width: 90,
                          height: 90,
                          borderRadius: "100%",
                          marginTop: "20px",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        width: "40%",
                      }}
                    >
                      <h5
                        style={{
                          width: "95%",
                          marginTop: "50px",
                          lineHeight: "15px",
                        }}
                      >
                        {" "}
                        {coach.coachName}
                        <h6
                          style={{
                            marginTop: "10px",
                            fontWeight: "lighter",
                          }}
                        >
                          {" "}
                          Experience : {coach.totalExperience}{" "}
                        </h6>
                      </h5>
                    </div>
                  </div>
                </div>
                <hr />
                <div style={{ marginBottom: "20px" }}>
                  <div
                    className="specialization"
                    style={{ lineHeight: "5px", marginTop: "20px" }}
                  >
                    <h4 style={{ fontSize: "10px" }}> Specialization </h4>
                    <h5 style={{ fontWeight: "lighter" }}>
                      {" "}
                      {coach.specialization}{" "}
                    </h5>
                  </div>

                  <div
                    className="specialization"
                    style={{ lineHeight: "5px", marginTop: "20px" }}
                  >
                    {/* <h4> Total Experience </h4>
                  <h4 style={{fontWeight:'lighter' }}> {coach.totalExperience} </h4>
                  </div>  */}

                    <div
                      className="specialization"
                      style={{ lineHeight: "5px", marginTop: "20px" }}
                    >
                      <h4> Language Known </h4>
                      <h4 style={{ fontWeight: "200" }}>
                        {" "}
                        {coach.languagesKnow}{" "}
                      </h4>
                    </div>
                    <div
                      className="bio"
                      style={{
                        lineHeight: "5px",
                        marginTop: "20px",
                        maxWidth: "500px",
                      }}
                    >
                      <h4> Bio </h4>
                      <div
                        style={{ fontWeight: "lighter", lineHeight: "22px" }}
                      >
                        {" "}
                        {coach.shortBio}{" "}
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>
              </Modal>
            </div>

            <div className="d-flex" style={{ fontSize: 12, fontWeight: 700 }}>
              {subEventDetail.weekDays && Array.isArray(subEventDetail.weekDays)
                ? subEventDetail.weekDays.map((val, index) => (
                    <div
                      style={{
                        marginRight: "0.25em",
                      }}
                      key={index}
                    >
                      {getWeekDayByNumber(val)}
                      {index !== subEventDetail.weekDays.length - 1 && ","}
                    </div>
                  ))
                : null}
            </div>

            <div className="d-flex">
              <div
                className={"challenge-card-details-start-date-time"}
                style={{ color: "#000", fontWeight: 700 }}
              >
                {getTime(subEventDetail.eventStartTime)}-
                {getTime(subEventDetail.eventEndTime)}
              </div>
            </div>
            {avg()}
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
              src={subEventDetail.sponsorImage}
              className="avatar-component sponser-logo"
            />
          </div>
        </div>

        {subEventDetail.queryRaised === false ? (
          <div style={{ display: "flex", width: "80%" }}>
            <div className="register-button" style={{ width: "60%" }}>
              <button
                style={{ marginBottom: "10px" }}
                onClick={() => setatach(true)}
              >
                Add
              </button>{" "}
              <button
                style={{ marginBottom: "10px", marginLeft: "-2%" }}
                onClick={() => setQueryModal(true)}
              >
                Enquiry
              </button>
            </div>
          </div>
        ) : (
          <div className="register-button">
            <button
              style={{ background: "#ff9800", marginBottom: "10px" }}
              onClick={() => setQuerySetModal(true)}
            >
              Enquiry Submitted
            </button>{" "}
          </div>
        )}

        {((condition && condition.isAdmin === true) ||
          (condition && condition.isModerator === true)) &&
        type !== "view" ? (
          <div className="register-button">
            <button onClick={() => handleSubEventEdit(subEventDetail)}>
              Edit
            </button>
          </div>
        ) : null}

        <div className="challenge-card-start-date" style={{ width: "85px" }}>
          <div
            className="challenge-card-start-date-month"
            style={{ color: "#000" }}
          >
            {startMonth} - {endMonth}
          </div>
          <div className="challenge-card-start-date-day">
            {startDay} - {endDay}
          </div>
          <a
            onClick={() => setModalView(true)}
            style={{ position: "absolute", top: 0, right: -5 }}
          >
            <InfoIcon style={{ fontSize: 16, color: "#1e88e5" }} />
          </a>

          {/* {renderJoinBtn()} */}
        </div>

        {modalView && (
          <EventInfoModal
            challenge={subEventDetail}
            type="program"
            modalView={modalView}
            setModalView={setModalView}
            setActivityModalView={setActivityModalView}
            actualData={actualData}
          />
        )}

        {activityModalView?.status && (
          <AddActivityModal
            challenge={subEventDetail}
            type={activityModalView?.type}
            modalView={activityModalView?.status}
            setModalView={setActivityModalView}
          />
        )}
        <InfoDialog handleClose={() => setmfinemodal(false)} open={mfinemodal}>
          <CancelIcon
            onClick={() => setmfinemodal(false)}
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              color: "#ef5350",
              cursor: "pointer",
            }}
          />
          <Iframe
            url={url}
            width="450px"
            height="800px"
            id="myId"
            className="myClassname"
            display="initial"
            position="relative"
            style={{ marginTop: -20 }}
          />
        </InfoDialog>
        {atach && (
          <InfoDialog
            handleClose={() => setatach(false)}
            open={atach}
            title="Want to Add to Cart ?"
          >
            <div className="event-unsubscribe-modal">
              <button
                onClick={() => {
                  geAttached(subEventDetail.id, subEventDetail.eventId);
                }}
              >
                Yes
              </button>
              <button onClick={() => setatach(false)}>No</button>
            </div>
          </InfoDialog>
        )}
        {queryModal && (
          <InfoDialog
            handleClose={() => setQueryModal(false)}
            open={queryModal}
            // title="Want to unsubscribe from the event?"
          >
            <CancelIcon
              onClick={() => setQueryModal(false)}
              style={{
                position: "absolute",
                top: 5,
                right: 5,
                color: "#ef5350",
                cursor: "pointer",
              }}
            />
            <div style={{ width: "400px", height: "200px" }}>
              <div style={{ marginLeft: "5%" }}>
                {/* <label>Your Query</label> */}
                <textarea
                  autofocus="autofocus"
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    width: "90%",

                    border: "1px solid black",
                    height: "100px",
                  }}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  name="firstName"
                  placeholder="Write Your Query "
                />
              </div>
              <button
                style={{
                  // backgroundColor: 'green',
                  width: "70px",
                  height: "30px",
                  fontSize: "15px",
                  marginLeft: "70%",
                  color: "white",
                  marginTop: "5%",
                }}
                disabled={!query}
                className={
                  !query ? "searchUserByMobileDisabled" : "searchUserByMobile"
                }
                onClick={(e) =>
                  postQuery(e, subEventDetail.id, subEventDetail.eventId)
                }
              >
                Send
              </button>
            </div>
          </InfoDialog>
        )}
        {querySentModal && (
          <InfoDialog
            handleClose={() => setQuerySetModal(false)}
            open={querySentModal}
            // title="Want to unsubscribe from the event?"
          >
            <CancelIcon
              onClick={() => setQuerySetModal(false)}
              style={{
                position: "absolute",
                top: 5,
                right: 5,
                color: "#ef5350",
                cursor: "pointer",
              }}
            />
            <div style={{ width: "400px", height: "auto" }}>
              <div>
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: "800",
                    marginLeft: "5%",
                  }}
                >
                  Query Date & Time :
                </span>{" "}
                {subEventDetail?.queryDespDate}
              </div>
              <div style={{ marginLeft: "5%" }}>
                {/* <label>Your Query</label> */}
                <p style={{ fontSize: "15px", fontWeight: "800" }}>
                  {" "}
                  Your Query :
                </p>
                <p style={{ textAlign: "justify", padding: "0 1em 1em 0" }}>
                  {" "}
                  {subEventDetail.queryDesp}
                </p>
              </div>
            </div>
          </InfoDialog>
        )}
      </div>
    </div>
  );
};

export default MarketPlace;
