import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import EventInfoModal from "../../EventInfoModal";
import InfoIcon from "@material-ui/icons/Info";
import eventGalleryNoData from "../../../assets/eventGalleryNoData.jpeg";
import { getWeekDayByNumber } from "../../../utils/commonFunctions";
import InfoDialog from "../../Utility/InfoDialog";
import Message from "antd-message";
import { CheckCircle, ArrowLeftCircle } from "react-feather";
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
import "./Calender.css";
import moment from "moment";
import CancelIcon from "@material-ui/icons/Cancel";
// import calendly from 'react-calendly';
import {
  ratingProgramByUser,
  urlPrefix,
  getSubEvent,
} from "../../../services/apicollection";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import InstagramIcon from "@material-ui/icons/Instagram";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import {
  subscribeSubEventCall,
  unSubcribeSubEventCall,
} from "../../../services/challengeApi";
import message from "antd-message";
import AddActivityModal from "./AddActivityModal";
import getcoach from "../../../services/apicollection";
import { ContactSupportOutlined } from "@material-ui/icons";
import ReactCardFlip from "react-card-flip";
import { PrimaryButton } from "../../Form";
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
const SubEventCard = ({
  subEventDetail,
  currentEventObj,
  handleSubscription,
  type,
  handleSubEventSelection = () => {},
  selectedSubEvent,
  handleSubEventEdit,
}) => {
  const [modalView, setModalView] = useState(false);
  const [showUnsubscribeModal, setUnsubModal] = useState(false);
  const [mfinemodal, setmfinemodal] = useState(false);
  const [activityModalView, setActivityModalView] = useState();
  const [showBook, setBook] = useState(false);
  const [subScribeModal, setSubSribeModal] = useState(false);
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
  const [joinTable, setJoinTable] = useState(false);
  const headCells1 = [
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
    {
      label: "Subscribe",
      // id: 'option4',
      numeric: false,
      disablePadding: true,
    },
  ];
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
    if (joinTable === true) {
      return (
        <TableHead>
          <TableRow>
            {headCells1.map((headCell) => (
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
    } else {
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
    }
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
          <button style={{ background: "#9e9e9e", borderRadius: 24 }}>
            Expired
          </button>
        </div>
      );
    } else {
      // if (!subEventDetail?.participated) {
      // if (subEventDetail?.regOpen) {
      if (
        subEventDetail.removeSubscribeButton === null &&
        subEventDetail.eventNature === "INDIVIDUAL"
      ) {
        return (
          <div className="register-button">
            <button
              style={{ borderRadius: 24 }}
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
        // }
        // }
      }
      // else {
      //   if (
      //     subEventDetail.eventNature === 'INDIVIDUAL' &&
      //     subEventDetail.userStatusInProgram === 'SUBSCRIBED'
      //   ) {
      //     return (
      //       <div className="register-button">
      //         <button
      //           style={{background: '#F43F5E', marginBottom: '10px'}}
      //           // onClick={() => {
      //           //   subEventDetail.addressRequired == 1 ||
      //           //   subEventDetail.dependentRequired == 1
      //           //     ? unSubcribeSubEventCall({
      //           //         eventId: currentEventObj.id,
      //           //         subEventId: subEventDetail.id,
      //           //       }).then((res) => {
      //           //         handleSubscription();
      //           //         message.success('Booking Cancel Successfull.');
      //           //         // setUnsubModal(false);
      //           //       })
      //           //     : cancelAppointment(
      //           //         subEventDetail.eventId,
      //           //         subEventDetail.id
      //           //       );
      //           // }}
      //           onClick={() =>
      //             cancelAppointment(

      //               subEventDetail.eventId,
      //               subEventDetail.id

      //             )
      //           }
      //         >
      //           Cancel
      //         </button>
      //       </div>
      //     );
      //   }
      //   else {
      //     if (
      //       subEventDetail.eventNature === 'INDIVIDUAL' &&
      //       subEventDetail.userStatusInProgram == 'UNSUBSCRIBED' &&
      //       subEventDetail.canRejoin
      //     ) {
      //       return (
      //         <div className="register-button">
      //           <button
      //             style={{background: '#ffa726', marginBottom: '10px'}}
      //             onClick={() => {
      //               subEventDetail.addressRequired == 1 ||
      //               subEventDetail.dependentRequired == 1
      //                 ? getaddress(
      //                     subEventDetail.id,
      //                     subEventDetail.addressRequired,
      //                     subEventDetail.dependentRequired
      //                   )
      //                 : changeDate1(subEventDetail.id);
      //             }}
      //           >
      //             Rebook
      //           </button>
      //         </div>
      //       );
      //     }
      //   }
      // }
    }

    if (subEventDetail.timePeriod == "PAST") {
      return (
        <div className="register-button">
          <button style={{ background: "#9e9e9e", borderRadius: 24 }}>
            Expired
          </button>
        </div>
      );
    } else {
      if (
        subEventDetail.removeSubscribeButton === null &&
        subEventDetail.eventNature !== "ASSOCIATE"
      ) {
        // if (subEventDetail?.regOpen) {
        return (
          <div className="register-button">
            <button
              style={{ borderRadius: 24 }}
              // onClick={() =>
              //   subscribeSubEventCall({
              //     dataSource:
              //       currentEventObj.dataSource === 'WHATSAPP'
              //         ? 'WEB'
              //         : currentEventObj.dataSource,
              //     eventId: currentEventObj.id,
              //     subEventId: subEventDetail.id,
              //   }).then((res) => {
              //     message.success('Program Subscribed');
              //     handleSubscription();
              //   })
              // }
              onClick={() => getDependantList(subEventDetail.id)}
            >
              Subscribe
            </button>
          </div>
        );
        // }
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
                    style={{ borderRadius: 24, background: "#ff9800" }}
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
        // if (
        //   subEventDetail.userStatusInProgram === 'SUBSCRIBED' &&
        //   subEventDetail.eventNature !== 'INDIVIDUAL'
        // ) {
        //   return (
        //     <div className="register-button">
        //       <button
        //         onClick={() => setUnsubModal(true)}
        //         style={{background: '#F43F5E', marginBottom: '10px'}}
        //       >
        //         Unsubscribe
        //       </button>
        //     </div>
        //   );
        // }
        // if (
        //   subEventDetail.userStatusInProgram === 'PENDING' &&
        //   subEventDetail.eventNature !== 'INDIVIDUAL'
        // ) {
        //   return (
        //     <div className="register-button">
        //       <button style={{background: '#ff9800', marginBottom: '10px'}}>
        //         Pending
        //       </button>
        //     </div>
        //   );
        // }
        // if (
        //   subEventDetail.userStatusInProgram == 'UNSUBSCRIBED' &&
        //   subEventDetail.canRejoin
        // ) {
        //   return (
        //     <div className="register-button">
        //       <button
        //         onClick={() =>
        //           subscribeSubEventCall({
        //             dataSource:
        //               currentEventObj.dataSource === 'WHATSAPP'
        //                 ? 'WEB'
        //                 : currentEventObj.dataSource,
        //             eventId: currentEventObj.id,
        //             subEventId: subEventDetail.id,
        //             rejoin: true,
        //           }).then((res) => {
        //             message.success(res?.data?.response?.responseMessage);
        //             handleSubscription();
        //           })
        //         }
        //         style={{background: '#ffa726', marginBottom: '10px'}}
        //       >
        //         Rejoin
        //       </button>
        //     </div>
        //   );
        // }
      }
    }
  };

  const renderJoinBtn = () => {
    if (subEventDetail.timePeriod == "PAST") {
      return;
    }

    if (
      subEventDetail.joinDetail === true &&
      subEventDetail.eventNature !== "ASSOCIATE"
    ) {
      return (
        <div
          style={{ width: "fit-content", fontSize: 12, marginBottom: "10px" }}
        >
          <a
            target="_blank"
            // href={subEventDetail.eventLink}
            style={{
              color: "#fff",
              background: "#518ad6",
              borderRadius: 4,
              padding: "0px 4px",
              cursor: "pointer",
            }}
            onClick={() => {
              setFlip(true),
                // setJoinTable(true),
                getBookingDetail(subEventDetail.id);
            }}
          >
            Joining Detail
          </a>
        </div>
      );
    }

    // if (subEventDetail.registrationFees == 0) {
    //   if (
    //     subEventDetail.userStatusInProgram === 'SUBSCRIBED' &&
    //     subEventDetail.eventLink &&
    //     subEventDetail.joinDetail === true
    //   ) {
    //     return (
    //       <div
    //         style={{width: 'fit-content', fontSize: 12, marginBottom: '10px'}}
    //       >
    //         {/* <button onClick={() => setFlip(true)}> */}{' '}
    //         <a
    //           target="_blank"
    //           // href={subEventDetail.eventLink}
    //           style={{
    //             color: '#fff',
    //             background: '#518ad6',
    //             borderRadius: 4,
    //             padding: '0px 4px',
    //             cursor: 'pointer',
    //           }}
    //           onClick={() => {
    //             setFlip(true),
    //               // setJoinTable(true),
    //               getBookingDetail(subEventDetail.id);
    //           }}
    //         >
    //           Joining Detail
    //         </a>
    //         {/* </button> */}
    //       </div>
    //     );
    //   }
    // } else {
    //   if (
    //     subEventDetail.userStatusInProgram === 'SUBSCRIBED' &&
    //     subEventDetail.joinDetail === true
    //   ) {
    //     return (
    //       <div
    //         style={{width: 'fit-content', fontSize: 12, marginBottom: '10px'}}
    //       >
    //         {/* <button onClick={() => setFlip(true)}> */}
    //         <a
    //           target="_blank"
    //           // href={subEventDetail.eventLink}
    //           style={{
    //             color: '#fff',
    //             background: '#518ad6',
    //             borderRadius: 4,
    //             padding: '0px 4px',
    //             cursor: 'pointer',
    //           }}
    //           onClick={() => {
    //             setFlip(true),
    //               // setJoinTable(true),
    //               getBookingDetail(subEventDetail.id);
    //           }}
    //         >
    //           Joining Detail
    //         </a>
    //         {/* </button> */}
    //       </div>
    //     );
    //   } else {
    //     if (subEventDetail.userStatusInProgram === 'PENDING') {
    //       return (
    //         <div
    //           style={{
    //             width: 'fit-content',
    //             fontSize: 12,
    //             marginBottom: '10px',
    //           }}
    //         >
    //           <a
    //             target="_blank"
    //             href={subEventDetail.paymentLink}
    //             style={{
    //               color: '#fff',
    //               background: '#518ad6',
    //               borderRadius: 4,
    //               padding: '0px 4px',
    //             }}
    //           >
    //             Pay Here
    //           </a>
    //         </div>
    //       );
    //     }
    //   }
    // }
  };
  const getTime = (time) => {
    return (time && time.substr(0, 5)) || "";
  };

  // NEW CODE ENDED

  const closeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width="18px"
      height="18px"
    >
      <path
        fill="#E04F5F"
        d="M504.1,256C504.1,119,393,7.9,256,7.9C119,7.9,7.9,119,7.9,256C7.9,393,119,504.1,256,504.1C393,504.1,504.1,393,504.1,256z"
      />
      <path
        fill="#FFF"
        d="M285,256l72.5-84.2c7.9-9.2,6.9-23-2.3-31c-9.2-7.9-23-6.9-30.9,2.3L256,222.4l-68.2-79.2c-7.9-9.2-21.8-10.2-31-2.3c-9.2,7.9-10.2,21.8-2.3,31L227,256l-72.5,84.2c-7.9,9.2-6.9,23,2.3,31c4.1,3.6,9.2,5.3,14.3,5.3c6.2,0,12.3-2.6,16.6-7.6l68.2-79.2l68.2,79.2c4.3,5,10.5,7.6,16.6,7.6c5.1,0,10.2-1.7,14.3-5.3c9.2-7.9,10.2-21.8,2.3-31L285,256z"
      />
    </svg>
  );
  const [flip1, setFlip] = useState(false);
  const [open, setOpen] = useState(false);
  const [calender, setCalender] = useState([]);
  // const [colorbtn, setColorbtn] = useState('blacmomentk');
  const [dateState, setDateState] = useState("00-00-0000");
  const dtt = moment(dateState).format("YYYY-MM-DD").toString();
  const filterDate = moment(new Date()).format("YYYY-MM-DD").toString();
  const today = new Date();
  const tttt1 = today.getHours() + 1 + ":" + today.getMinutes() + ":" + "00";
  console.log(tttt1);
  const ddt = [];
  const [time, setTime] = useState();
  const mark = [];
  const tt = [];
  const changeDate = (e) => {
    setTime(false);
    setDateState(e);
  };

  const flipCard1 = () => {
    setFlip(false);
    setJoinTable(false);
  };
  {
    calender &&
      calender.map((item, index) => {
        // console.log(item);
        mark.push(item.date);
      });
  }
  console.log(dateState, time);
  const dateenable = [];
  {
    calender &&
      calender.map((item, index) => {
        console.log(item);
        dateenable.push(item.date);
        if (calender.length === index + 1) {
          ddt.push(item.date);
          console.log(ddt);
        }
      });
  }
  console.log(calender);

  // const enabledate=(date)=>{
  //    if (dateenable.indexOf(formatDate(date)) < 0)
  //      return {
  //        enabled: false,
  //      };
  //    else
  //      return {
  //        enabled: true,
  //      };
  // }
  const [dependentvalue, setDependentValue] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  console.log(activeStep, "step");
  const [address, setAddress] = useState("");
  const [inputAddress, setInputAddress] = useState();
  const [inputDependent, setInputDependent] = useState();
  const [notes, setNotes] = useState();
  const [data, setData] = useState({
    address: "",
    depentdent: "0",
    note1: "",
  });
  const [addDept, setAddDept] = useState({
    contactDetail: "",
    dependantRelation: "",
    firstName: "",
    dob: "",
    gender: "",
    lastName: "",
  });
  console.log(addDept, data?.depentdent, "adddept");
  const inputhandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((values) => ({ ...values, [name]: value }));
    // setErrorObj((values) => ({...values, [name]: value}));
  };
  const [error1, setError1] = useState(false);
  const inputDept = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setAddDept((values) => ({ ...values, [name]: value }));
    // setError1((values) => ({...values, [name]: value}));
  };
  console.log(data, "daya");
  const [addressValue, setAddressValue] = useState("");
  const [subscribeList, setSubscribeList] = useState([]);
  const steps = ["Address", "Dependent", "Notes", "Book"];
  const getDependantList = (id) => {
    setSubSribeModal(true);
    setJoinTable(true);
    const adminurl = `${urlPrefix}v1.0/getUserDependants?subEventId=${id}`;
    //  setDependentValue(true);
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
        // console.log(res.data.response.responseData);
        setSubscribeList(res.data.response?.responseData);
      });
  };
  const subScribeApi = (deptId, eventId, id) => {
    // setSubSribeModal(true);
    // setJoinTable(true);
    const adminurl = `${urlPrefix}v1.0/subscribeInSubEvent?dependantId=${deptId}&eventId=${eventId}&subEventId=${id}`;
    //  setDependentValue(true);
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
              "accept, content-type, x-access-token, x-requested-with",
          },
        }
      )
      .then((res) => {
        getDependantList(id);
        handleSubscription();
      });
  };

  const rejoinSubscribe = (deptId, id) => {
    // setSubSribeModal(true);
    // setJoinTable(true);
    const adminurl = `${urlPrefix}v1.0/rejoinSubEvent?registrationId=${deptId}`;
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
        // getDependantList(id);
        // handleSubscription();
        getBookingDetail(id);
      });
  };
  const getaddress = (id, addrs, dept) => {
    const adminurl = `${urlPrefix}v1.0/getUserAddress?subEventId=${id}`;

    // setDependentValue(true);
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
        // console.log(res.data.response.responseData.dependentRequired);
        if (addrs === 1 && dept === 1) {
          setActiveStep(0);
          setDependentValue(true);
          setAddress(res.data.response.responseData.address);
        } else if (addrs === 1) {
          setActiveStep(0);
          setDependentValue(true);

          setAddress(res.data.response.responseData.address);
        } else if (dept === 1) {
          getDependent(id);
          setActiveStep(1);

          setDependentValue(true);
        } else if (addrs == 0 && dept == 0) {
          setActiveStep(2);
          setDependentValue(true);
        }
      });
  };
  const [depenName, setDepenName] = useState();
  const [dept, setDeptValue] = useState(false);
  const closeAddModal = () => {
    setDeptValue(false);
    setAddDept("");
    setError1(false);
  };
  const CloseDependetModal = () => {
    setDependentValue(false);
    setData({
      depentdent: "0",
    });
    setDeptValue(""), setAddressValue("");
    setAddDept("");
    setError1(false);
  };
  console.log(error1, "error");
  // console.log(addressValue, dependentValue1, notes,'dependentVaue');
  const getDependent = (id) => {
    if (subEventDetail.dependentRequired === 1) {
      setActiveStep(1);
      const adminurl = `${urlPrefix}v1.0/getUserDependants?subEventId=${id}`;
      //  setDependentValue(true);
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
          console.log(res.data.response.responseData);
          setDepenName(res.data.response?.responseData);
        });
    } else if (data?.address !== "") {
      setActiveStep(2);
    }
  };

  const [bookingList, setBookingList] = useState([]);
  const getBookingDetail = (id) => {
    const adminurl = `${urlPrefix}v1.0/getMultipleBookingDetails?subEventId=${id}`;
    //  setDependentValue(true);
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
        console.log(res.data.response.responseData);
        setBookingList(res.data.response?.responseData);
      });
  };

  const submitdept = (id, e) => {
    e.preventDefault();
    if (
      addDept.firstName !== "" &&
      addDept.gender !== "" &&
      addDept.dependantRelation !== ""
    ) {
      let payload = {
        id: null,
        contactDetail: addDept.contactDetail,
        dependantRelation: addDept.dependantRelation,
        firstName: addDept.firstName,
        dob: addDept.dob,
        gender: addDept.gender,
        lastName: addDept.lastName,
      };
      const adminurl = `${urlPrefix}v1.0/createOrUpdateDependent`;
      //  setDependentValue(true);
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
          getDependent(id);
          setAddDept(""), setDeptValue(false);
          Message.success(res.data.response.responseMessage);
        });
    } else {
      setError1(true);
    }
  };
  const finalSubmitBook = (e) => {
    e.preventDefault();
    if (dateState !== "" && time !== false) {
      let payload = {
        id: null,
        eventId: subEventDetail.eventId,
        subEventId: subEventDetail.id,
        receivingAddress: data?.address,
        dependentId:
          subEventDetail.dependentRequired !== 0 ? data?.depentdent : 0,
        notes: data?.notes1,
        date: dtt,
        time: time,
      };

      const adminurl = `${urlPrefix}v1.0/registerUserInDependentProgram`;
      //  setDependentValue(true);
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
          console.log(res);
          handleSubscription();
          setBook(false);
          setDependentValue(false);
          Message.success(res.data.response.responseMessage);
        });
    }
  };

  const changeDate1 = (id) => {
    setBook(true);
    const adminurl = `${urlPrefix}v1.0/userCalendar?subEventId=${id}`;
    console.log(`${urlPrefix}v1.0/userCalendar?subEventId=${id}`);
    // const adminurl = `https://testapi.mhealth.ai:8081/v1.0/userCalendar?subEventId=96`;

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
        setTime(false);
        setDateState();
        console.log(res?.data?.response?.responseData);

        setCalender(res?.data?.response?.responseData);
      });
  };
  console.log(subEventDetail.eventId);
  const handlesubmit = (e) => {
    e.preventDefault();
    if (dateState !== "" && time !== false) {
      setBook(false);
      const adminurl = `${urlPrefix}v1.0/bookCustomerAppointment?date=${dtt}&eventId=${subEventDetail.eventId}&subEventId=${subEventDetail.id}&time=${time}`;

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
                "accept, content-type, x-access-token, x-requested-with",
            },
          }
        )
        .then((res) => {
          console.log(res);
          handleSubscription();
          Message.success("Congrates! Your Appointment Booked Successful ");
        });
    } else {
      Message.error("Warning! Please Select slot date and time");
    }
  };
  const cancelAppointment = (eveid, id) => {
    const adminurl = `${urlPrefix}v1.0/cancelAppointment?eventId=${eveid}&subEventId=${id}`;

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
              "accept, content-type, x-access-token, x-requested-with",
          },
        }
      )
      .then((res) => {
        if (res.data.response.responseCode === 0) {
          getBookingDetail(id);
          handleSubscription();
          Message.success("Congrates! Your Appointment Cancelled Successful");

          // response
          //   ? Message.success(response.responseMessage)
          //   : '';
          setTime(false);
          setDateState();
          setBook(false);
        } else {
          Message.error("Something went wrong !");
        }
      });
  };

  const cancelAppointmentDependent = (registrationId, id) => {
    const adminurl = `${urlPrefix}v1.0/cancelAppointment?registrationId=${registrationId}`;

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
              "accept, content-type, x-access-token, x-requested-with",
          },
        }
      )
      .then((res) => {
        if (res.data.response.responseCode === 0) {
          handleSubscription();
          Message.success("Congrates! Your Appointment Cancelled Successful");
          getBookingDetail(id);
          // response
          //   ? Message.success(response.responseMessage)
          //   : '';
          setTime(false);
          setDateState();
          setBook(false);
        } else {
          Message.error("Something went wrong !");
        }
      });
  };

  const closeslot = () => {
    setTime(false);
    setDateState(false);
    setBook(false);
  };
  const condition = JSON.parse(localStorage.getItem("condition"));
  // useEffect(() => {
  //   if (subEventDetail.eventNature === 'INDIVIDUAL') {
  //     changeDate1();
  //   }
  // }, []);

  // const timeClose = () => {
  //   setTime(false);
  //   setBook(false);
  //   setDateState();
  // };
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
    <ReactCardFlip isFlipped={flip1} flipDirection="horizontal">
      <div
        onClick={() => {
          localStorage.setItem("eventCode", subEventDetail.eventCode);
        }}
        className="challenge-card"
        style={
          type == "view"
            ? { margin: "35px 5px", height: "auto", cursor: "default" }
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
        <div key={subEventDetail.id} style={{ transform: "roteteY(10deg)" }}>
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
                    : `Fees : ${subEventDetail.registrationFees}`}
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
                  styles={{
                    modal: { borderRadius: "10px", maxWidth: "600px" },
                  }}
                  onClose={onCloseModal}
                  center
                  closeIcon={closeIcon}
                >
                  {/* <CancelIcon
                    style={{
                      position: "absolute",
                      top: 15,
                      right: 5,
                      color: "red",
                      cursor: "pointer",
                    }}
                  /> */}
                  <div className="p-[20px] pl-[5px] pb-0 pt-[10px]">
                    <div
                      className="header"
                      style={{
                        display: "flex",
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
                    <div className="mt-[20px]">
                      <h4> Specialization </h4>
                      <h4 className="font-light text-sm">
                        {coach.specialization}
                      </h4>
                    </div>

                    <div className="mt-[20px]">
                      <div className="mt-[20px]">
                        <h4> Language Known </h4>
                        <h4 className="font-light text-sm">
                          {" "}
                          {coach.languagesKnow}{" "}
                        </h4>
                      </div>
                      <div className="mt-[20px]">
                        <h4>Bio</h4>
                        <h4 className="font-light text-sm">{coach.shortBio}</h4>
                      </div>
                    </div>
                    <hr />
                  </div>
                </Modal>
              </div>

              <div className="d-flex" style={{ fontSize: 12, fontWeight: 700 }}>
                {subEventDetail.weekDays &&
                Array.isArray(subEventDetail.weekDays)
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

          {type == "view" && renderRegisterBtn()}

          {((condition && condition.isAdmin === true) ||
            (condition && condition.isModerator === true)) &&
          type !== "view" ? (
            <div className="register-button">
              <button
                style={{ borderRadius: 24, fontSize: 13, padding: "2px 10px" }}
                onClick={() => handleSubEventEdit(subEventDetail)}
              >
                Edit
              </button>
            </div>
          ) : null}

          <div className="challenge-card-start-date">
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
              style={{ position: "absolute", top: 0, right: 0 }}
            >
              <InfoIcon style={{ fontSize: 18, color: "#1e88e5" }} />
            </a>

            {renderJoinBtn()}
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
          <InfoDialog
            handleClose={() => setmfinemodal(false)}
            open={mfinemodal}
          >
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
                    unSubcribeSubEventCall({
                      eventId: currentEventObj.id,
                      subEventId: subEventDetail.id,
                    }).then((res) => {
                      handleSubscription();
                      message.success("Program Unsubscribed.");
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
          {dependentvalue && (
            <InfoDialog handleClose={CloseDependetModal} open={dependentvalue}>
              <CancelIcon
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  color: "#ef5350",
                  cursor: "pointer",
                }}
                onClick={CloseDependetModal}
              />
              <div style={{ width: "500px", height: "400px" }}>
                <div
                  // className="heading"
                  style={{
                    marginTop: -20,
                    // fontSize: 18,
                    // display: 'flex',
                    // alignItems: 'center',
                  }}
                >
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </div>
                {activeStep === 0 ? (
                  <div style={{ marginLeft: "10%", marginTop: "0%" }}>
                    {/* <p style={{fontSize: '20px', fontWeight: 800}}>Address : -</p> */}
                    {address !== "" ? (
                      <div style={{ display: "flex" }}>
                        <div style={{ width: "10%" }}>
                          <input
                            type="radio"
                            style={{
                              cursor: "pointer",
                              height: "20px",
                              width: "20px",
                              // marginLeft: '20%',
                            }}
                            value={address}
                            onChange={inputhandler}
                            name="address"
                            checked={data?.address === address.toString()}
                          />
                        </div>
                        <div
                          style={{
                            width: "50%",
                            marginLeft: "1%",
                            display: "flex",
                          }}
                        >
                          {address}
                        </div>
                        {/* <div style={{width: '40%', marginTop: '-2%'}}>
                        <p style={{fontSize: '15px', fontWeight: 800}}>
                          {' '}
                          Default Address
                        </p>
                      </div> */}
                      </div>
                    ) : (
                      ""
                    )}

                    <div style={{ marginTop: "5%" }}>
                      <div style={{ display: "flex" }}>
                        <div style={{ width: "10%" }}>
                          <input
                            type="radio"
                            style={{
                              cursor: "pointer",
                              height: "20px",
                              width: "20px",
                              // marginLeft: '20%',
                            }}
                            value="alt"
                            onChange={(e) => setAddressValue(e.target.value)}
                            name="address"
                            // checked={data?.address === inputAddress}
                          />
                        </div>
                        <div style={{ width: "40%", marginTop: "-2%" }}>
                          <p style={{ fontSize: "15px", fontWeight: 800 }}>
                            {" "}
                            Alternate Address
                          </p>
                        </div>
                      </div>
                      {/* {addressValue=='alt'? */}
                      {addressValue === "alt" ? (
                        <div style={{ display: "flex" }}>
                          <div style={{ width: "80%", marginLeft: "8%" }}>
                            <textarea
                              autofocus="autofocus"
                              style={{
                                background: "#f3f4f6",
                                padding: "10px 10px",
                                borderRadius: 6,
                                fontSize: 12,
                                width: "70%",
                                border: "1px solid black",
                                height: "50px",
                              }}
                              type="text"
                              value={inputAddress}
                              onChange={inputhandler}
                              name="address"
                              placeholder="Enter Your Address"
                            />
                          </div>
                          {/* <div style={{width: '20%'}}>
                      <button
                        style={{
                          backgroundColor: 'green',
                          width: '50px',
                          height: '20px',
                        }}
                      >
                        Add
                      </button>
                    </div> */}
                        </div>
                      ) : (
                        ""
                      )}
                      {/* :''} */}

                      <button
                        style={{
                          // backgroundColor: 'green',
                          width: "70px",
                          height: "30px",
                          fontSize: "15px",
                          marginLeft: "70%",
                          color: "white",
                          // marginTop:'12%'
                        }}
                        className={
                          !data?.address
                            ? "searchUserByMobileDisabled"
                            : "searchUserByMobile"
                        }
                        onClick={() => getDependent(subEventDetail.id)}
                        disabled={!data?.address}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {activeStep == 1 ? (
                  <div style={{ marginLeft: "15%", marginTop: "-5%" }}>
                    {/* <div style={{width: '40%', marginTop: '-2%'}}>
                    <p style={{fontSize: '15px', fontWeight: 800}}>
                      {' '}
                      Dependent Relationship
                    </p>
                  </div> */}
                    {/* <p style={{fontSize: '20px', fontWeight: 800}}>Address : -</p> */}

                    <div style={{ display: "flex" }}>
                      <div style={{ width: "100%", marginLeft: "-10%" }}>
                        {depenName && depenName.length > 0 ? (
                          <TablePagination
                            rowsPerPageOptions={[3, 4]}
                            component="div"
                            count={depenName && depenName.length + 1}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                          />
                        ) : (
                          <TablePagination
                            rowsPerPageOptions={[3, 4]}
                            component="div"
                            count={0}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                          />
                        )}
                        <Table
                          className={classes.table}
                          aria-labelledby="tableTitle"
                          size={"small"}
                          aria-label="enhanced table"
                        >
                          {" "}
                          <EnhancedTableHead
                            style={{ fontSize: "5px" }}
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                          />
                          <TableBody>
                            {depenName && depenName.length > 0 ? (
                              <>
                                {depenName &&
                                  stableSort(
                                    depenName,
                                    getComparator(order, orderBy)
                                  )
                                    .slice(
                                      page * rowsPerPage,
                                      page * rowsPerPage + rowsPerPage
                                    )
                                    .map((item, ind) => {
                                      return (
                                        <>
                                          <TableRow className="performace-table-row">
                                            {" "}
                                            <TableCell align="center">
                                              <input
                                                type="radio"
                                                style={{
                                                  cursor: "pointer",
                                                  height: "20px",
                                                  width: "20px",
                                                  // marginLeft: '20%',
                                                }}
                                                value={item.id}
                                                onChange={inputhandler}
                                                name="depentdent"
                                                checked={
                                                  data?.depentdent ===
                                                  item.id.toString()
                                                }
                                              />
                                            </TableCell>
                                            <TableCell align="center">
                                              {" "}
                                              <span style={{ fontSize: 12 }}>
                                                {ind + 1}
                                              </span>{" "}
                                            </TableCell>
                                            <TableCell align="left">
                                              {" "}
                                              <p
                                                style={{
                                                  whiteSpace: "nowrap",
                                                  textOverflow: "ellipsis",
                                                  width: "150px",
                                                  display: "block",
                                                  overflow: "hidden",
                                                  fontSize: 12,
                                                }}
                                              >
                                                {" "}
                                                <span style={{ fontSize: 12 }}>
                                                  {item.firstName
                                                    ? item.firstName +
                                                      " " +
                                                      item.lastName
                                                    : "  -     "}
                                                </span>{" "}
                                              </p>{" "}
                                            </TableCell>
                                            <TableCell
                                              align="left"
                                              style={{ fontSize: 12 }}
                                            >
                                              {" "}
                                              <p
                                                style={{
                                                  whiteSpace: "nowrap",
                                                  textOverflow: "ellipsis",
                                                  width: "100px",
                                                  display: "block",
                                                  overflow: "hidden",
                                                  fontSize: 12,
                                                }}
                                              >
                                                {" "}
                                                {item.dependantRelation
                                                  ? item.dependantRelation
                                                  : "  -     "}
                                              </p>
                                            </TableCell>
                                            <TableCell
                                              align="left"
                                              style={{ fontSize: 12 }}
                                            >
                                              {" "}
                                              <p
                                                style={{
                                                  whiteSpace: "nowrap",
                                                  textOverflow: "ellipsis",
                                                  width: "70px",
                                                  display: "block",
                                                  overflow: "hidden",
                                                  fontSize: 12,
                                                }}
                                              >
                                                {item.gender
                                                  ? item.gender
                                                  : "  -     "}
                                              </p>
                                            </TableCell>
                                          </TableRow>
                                        </>
                                      );
                                    })}
                              </>
                            ) : (
                              ""
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div
                      style={{
                        width: "40%",
                        marginLeft: "8%",
                        display: "flex",
                      }}
                    >
                      {/* {depenName} */}
                    </div>

                    <div style={{ marginTop: "3%" }}>
                      <div style={{ display: "flex" }}>
                        {/* <div style={{width: '10%'}}>
                        <input
                          type="radio"
                          style={{
                            cursor: 'pointer',
                            height: '20px',
                            width: '20px',
                            // marginLeft: '20%',
                          }}
                          value="dept"
                          onClick={() => setDeptValue(true)}
                          name="depentdent"
                        />
                        {/* <p
                          style={{
                            fontSize: '20px',
                            fontWeight: '800',
                            cursor: 'pointer',
                          }}
                          onClick={() => setDeptValue(true)}
                        >
                          +
                        </p> 
                      </div> */}
                        <div style={{ width: "50%" }}>
                          <button
                            style={{
                              // backgroundColor: 'green',
                              width: "70px",
                              height: "30px",
                              fontSize: "15px",
                              // marginLeft: '70%',
                              color: "white",
                              // marginTop:'12%'
                            }}
                            className={
                              // !data?.depentdent
                              //   ? 'searchUserByMobileDisabled'
                              "searchUserByMobile"
                            }
                            onClick={() => setDeptValue(true)}
                          >
                            Add
                          </button>
                        </div>
                        <div style={{ width: "20%" }}>
                          {subEventDetail.addressRequired !== 0 ? (
                            <button
                              style={{
                                // backgroundColor: 'green',
                                width: "70px",
                                height: "30px",
                                fontSize: "15px",
                                // marginLeft: '70%',
                                color: "white",
                                // marginTop:'12%'
                              }}
                              className={
                                // !data?.depentdent
                                //   ? 'searchUserByMobileDisabled'
                                "searchUserByMobile"
                              }
                              onClick={() => setActiveStep(0)}
                            >
                              Prev
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                        <div style={{ width: "20%" }}>
                          <button
                            style={{
                              // backgroundColor: 'green',
                              width: "70px",
                              height: "30px",
                              fontSize: "15px",
                              // marginLeft: '70%',
                              color: "white",
                              // marginTop:'12%'
                            }}
                            className={
                              !data?.depentdent
                                ? "searchUserByMobileDisabled"
                                : "searchUserByMobile"
                            }
                            onClick={() => {
                              setActiveStep(2);
                            }}
                            disabled={!data?.depentdent}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                      {/* {addressValue=='alt'? */}

                      {/* :''} */}
                      <div style={{ display: "flex", marginTop: "5%" }}>
                        <div style={{ width: "30%" }}></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {activeStep == 2 ? (
                  <div>
                    {" "}
                    <div style={{ width: "80%", marginLeft: "8%" }}>
                      <p style={{ fontSize: "12px", fontWeight: "800" }}>
                        Please Share anything that will help us to prepare for
                        meeting
                      </p>
                      <textarea
                        autofocus="autofocus"
                        style={{
                          background: "#f3f4f6",
                          padding: "10px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "70%",
                          border: "1px solid black",
                          height: "80px",
                        }}
                        type="text"
                        value={notes}
                        onChange={inputhandler}
                        name="notes1"
                        placeholder="Write Some Notes..."
                      />
                    </div>
                    <div style={{ display: "flex" }}>
                      <div style={{ width: "50%" }}>
                        <button
                          style={{
                            // backgroundColor: 'green',
                            width: "70px",
                            height: "30px",
                            fontSize: "15px",
                            marginLeft: "10%",
                            color: "white",
                            // marginTop:'12%'
                          }}
                          className={
                            // !data?.depentdent
                            //   ? 'searchUserByMobileDisabled'
                            "searchUserByMobile"
                          }
                          onClick={() =>
                            subEventDetail.dependentRequired !== 0
                              ? setActiveStep(1)
                              : setActiveStep(0)
                          }
                        >
                          Prev
                        </button>
                      </div>
                      <div style={{ width: "50%" }}>
                        <button
                          style={{
                            // backgroundColor: 'green',
                            width: "120px",
                            height: "30px",
                            fontSize: "15px",
                            marginLeft: "40%",
                            color: "white",
                            marginTop: "-20%",
                          }}
                          className={
                            // !datanotes
                            //   ?
                            //  'searchUserByMobileDisabled'
                            // :
                            "searchUserByMobile"
                          }
                          onClick={() => changeDate1(subEventDetail.id)}
                        >
                          Next & Book
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </InfoDialog>
          )}
          {dept && (
            <InfoDialog
              handleClose={closeAddModal}
              open={dept}
              // onClose={timeClose}
            >
              <div style={{ width: "500px", height: "400px" }}>
                <CancelIcon
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    color: "#ef5350",
                    cursor: "pointer",
                  }}
                  onClick={closeAddModal}
                />
                <div style={{ marginLeft: "10%" }}>
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "20%", marginTop: "0%" }}>
                      <span>Relation </span>
                      <span
                        style={{
                          color: "red",
                          // marginTop: '-12%',
                          // marginLeft: '-200%',
                        }}
                      >
                        {" "}
                        {error1 === true ? (
                          <>{addDept?.dependantRelation === "" ? <>*</> : ""}</>
                        ) : (
                          ""
                        )}
                      </span>
                    </div>
                    <div style={{ width: "70%" }}>
                      {/* <label>Relationship</label> */}

                      {/* <br /> */}
                      <select
                        autofocus="autofocus"
                        style={{
                          background: "#f3f4f6",
                          padding: "10px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "90%",
                          border: "1px solid black",
                          // height: '50px',
                        }}
                        type="text"
                        value={addDept.dependantRelation}
                        onChange={inputDept}
                        name="dependantRelation"
                        placeholder="Enter Question"
                      >
                        <option value="">SELECT...</option>
                        <option value="MOTHER">MOTHER</option>
                        <option value="FATHER">FATHER</option>
                        <option value="SON">SON</option>
                        <option value="DAUGHTER">DAUGHTER</option>
                        <option value="SPOUSE">SPOUSE</option>
                        <option value="GRANDFATHER">GRANDFATHER</option>
                        <option value="GRANDMOTHER">GRANDMOTHER</option>
                        <option value="BROTHER">BROTHER</option>
                        <option value="SISTER">SISTER</option>
                        <option value="OTHER">OTHER</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginLeft: "0%", display: "flex" }}>
                    <div style={{ width: "40%" }}>
                      <label>First Name</label>
                      <br />
                      <input
                        autofocus="autofocus"
                        style={{
                          background: "#f3f4f6",
                          padding: "10px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "105%",
                          border: "1px solid black",
                          // height: '50px',
                        }}
                        type="text"
                        value={addDept.firstName}
                        onChange={inputDept}
                        name="firstName"
                        placeholder="First Name"
                      />
                    </div>
                    <div style={{ width: "10%" }}>
                      <p
                        style={{
                          color: "red",
                          marginTop: "-1%",
                          marginLeft: "-180%",
                        }}
                      >
                        {" "}
                        {error1 === true ? (
                          <>{addDept?.firstName === "" ? <>*</> : ""}</>
                        ) : (
                          ""
                        )}
                      </p>
                    </div>
                    <div style={{ width: "50%" }}>
                      <label>Last Name</label>
                      <br />
                      <input
                        autofocus="autofocus"
                        style={{
                          background: "#f3f4f6",
                          padding: "10px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "80%",
                          border: "1px solid black",
                          // height: '50px',
                        }}
                        type="text"
                        value={addDept.lastName}
                        onChange={inputDept}
                        name="lastName"
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                  <div style={{ marginLeft: "0%", display: "flex" }}>
                    <div style={{ width: "50%" }}>
                      <label>DOB</label>
                      <br />
                      <input
                        autofocus="autofocus"
                        style={{
                          background: "#f3f4f6",
                          padding: "10px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "85%",
                          border: "1px solid black",
                          // height: '50px',
                        }}
                        type="date"
                        value={addDept.dob}
                        onChange={inputDept}
                        name="dob"
                        placeholder="Enter Question"
                      />
                    </div>
                    <div style={{ width: "40%" }}>
                      <label>Gender</label>

                      <br />
                      <select
                        autofocus="autofocus"
                        style={{
                          background: "#f3f4f6",
                          padding: "10px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "110%",
                          border: "1px solid black",
                          // height: '50px',
                        }}
                        type="text"
                        value={addDept.gender}
                        onChange={inputDept}
                        name="gender"
                        // placeholder="Enter Question"
                      >
                        <option>SELECT...</option>
                        <option value="MALE">MALE</option>
                        <option value="FEMALE">FEMALE</option>
                        <option value="OTHERS">OTHERS</option>
                      </select>
                    </div>
                    <div style={{ width: "10%" }}>
                      <p
                        style={{
                          color: "red",
                          marginTop: "-1%",
                          marginLeft: "-200%",
                        }}
                      >
                        {" "}
                        {error1 === true ? (
                          <>{addDept?.gender === "" ? <>*</> : ""}</>
                        ) : (
                          ""
                        )}
                      </p>
                    </div>
                  </div>
                  <div style={{ marginLeft: "0%", display: "flex" }}>
                    <div style={{ width: "30%", marginTop: "10%" }}>
                      <label>Contact Detail</label>
                    </div>
                    <div style={{ width: "70%" }}>
                      <br />
                      <textarea
                        autofocus="autofocus"
                        style={{
                          background: "#f3f4f6",
                          padding: "10px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          width: "85%",
                          border: "1px solid black",
                          height: "50px",
                        }}
                        type="text"
                        value={addDept.contactDetail}
                        onChange={inputDept}
                        name="contactDetail"
                        placeholder="Enter  Dependent Details"
                      />
                    </div>
                  </div>
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
                  className={"searchUserByMobile"}
                  onClick={() => submitdept(subEventDetail.id)}
                >
                  Add
                </button>
              </div>
            </InfoDialog>
          )}

          {subScribeModal && (
            <InfoDialog
              handleClose={() => setSubSribeModal(false)}
              open={subScribeModal}
              // onClose={timeClose}
            >
              <CancelIcon
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  color: "#ef5350",
                  cursor: "pointer",
                }}
                onClick={() => setSubSribeModal(false)}
              />
              <div style={{ width: "600px", height: "300px" }}>
                <div>
                  <div>
                    {subscribeList && subscribeList.length > 0 ? (
                      <TablePagination
                        rowsPerPageOptions={[3, 4]}
                        component="div"
                        count={subscribeList && subscribeList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                      />
                    ) : (
                      <TablePagination
                        rowsPerPageOptions={[3, 4]}
                        component="div"
                        count={0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                      />
                    )}
                    <Table
                      className={classes.table}
                      aria-labelledby="tableTitle"
                      size={"small"}
                      aria-label="enhanced table"
                    >
                      {" "}
                      <EnhancedTableHead
                        style={{ fontSize: "5px" }}
                        classes={classes}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                      />
                      <TableBody>
                        {subscribeList && subscribeList.length > 0 ? (
                          <>
                            {subscribeList &&
                              stableSort(
                                subscribeList,
                                getComparator(order, orderBy)
                              )
                                .slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                                )
                                .map((item, ind) => {
                                  return (
                                    <>
                                      <TableRow className="performace-table-row">
                                        {" "}
                                        <TableCell align="center">
                                          {" "}
                                          <span style={{ fontSize: 12 }}>
                                            {ind + 1}
                                          </span>{" "}
                                        </TableCell>
                                        <TableCell align="left">
                                          {" "}
                                          <p
                                            style={{
                                              whiteSpace: "nowrap",
                                              textOverflow: "ellipsis",
                                              width: "150px",
                                              display: "block",
                                              overflow: "hidden",
                                              fontSize: 12,
                                            }}
                                          >
                                            {" "}
                                            <span style={{ fontSize: 12 }}>
                                              {item.firstName
                                                ? item.firstName +
                                                  " " +
                                                  item.lastName
                                                : "  -     "}
                                            </span>{" "}
                                          </p>{" "}
                                        </TableCell>
                                        <TableCell
                                          align="left"
                                          style={{ fontSize: 12 }}
                                        >
                                          {" "}
                                          <p
                                            style={{
                                              whiteSpace: "nowrap",
                                              textOverflow: "ellipsis",
                                              width: "100px",
                                              display: "block",
                                              overflow: "hidden",
                                              fontSize: 12,
                                            }}
                                          >
                                            {" "}
                                            {item.dependantRelation
                                              ? item.dependantRelation
                                              : "  -     "}
                                          </p>
                                        </TableCell>
                                        <TableCell
                                          align="left"
                                          style={{ fontSize: 12 }}
                                        >
                                          {" "}
                                          <p
                                            style={{
                                              whiteSpace: "nowrap",
                                              textOverflow: "ellipsis",
                                              width: "70px",
                                              display: "block",
                                              overflow: "hidden",
                                              fontSize: 12,
                                            }}
                                          >
                                            {item.gender
                                              ? item.gender
                                              : "  -     "}
                                          </p>
                                        </TableCell>
                                        <TableCell>
                                          <button
                                            style={{
                                              width: "80px",
                                              height: "30px",
                                              backgroundColor: "green",
                                              borderRadius: "24px",
                                              color: "white",
                                            }}
                                            onClick={() =>
                                              subScribeApi(
                                                item.id,
                                                subEventDetail.eventId,
                                                subEventDetail.id
                                              )
                                            }
                                          >
                                            Subscribe
                                          </button>
                                        </TableCell>
                                      </TableRow>
                                    </>
                                  );
                                })}
                          </>
                        ) : (
                          ""
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </InfoDialog>
          )}

          {showBook && (
            <InfoDialog
              handleClose={closeslot}
              open={showBook}
              // onClose={timeClose}
            >
              <div style={{ width: "400px", height: "400px" }}>
                <CancelIcon
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    color: "#ef5350",
                    cursor: "pointer",
                  }}
                  onClick={() => closeslot(false)}
                />
                <form>
                  <div
                    style={{
                      height: "400px",
                      display: "flex",
                      marginTop: "0",
                      overflowY: "auto",
                      // width:'70%',
                    }}
                  >
                    <div style={{ width: "70%", marginLeft: "20px" }}>
                      {/* <p style={{fontSize: '20px', marginLeft: '80px'}}>
                  Booking Program
                </p> */}
                      <div
                        style={{
                          maxWidth: "250px",
                          boxShadow:
                            "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
                          borderRadius: 12,
                          backgroundColor: "#b3b3ff",
                          maxHeight: "500px",
                          background: "blue",
                        }}
                      >
                        <Calendar
                          style={{ backgroundColor: "white" }}
                          required
                          selected={dateState}
                          onChange={changeDate}
                          tileClassName={({ date, view }) => {
                            if (
                              mark.find(
                                (x) => x === moment(date).format("YYYY-MM-DD")
                              )
                            ) {
                              return "highlight";
                            }
                          }}
                          beforeShowDay={({ date, view }) => {
                            if (dateenable.indexOf(mark(date)) < 0)
                              return {
                                enabled: false,
                              };
                            else
                              return {
                                enabled: true,
                              };
                          }}
                          // style={{
                          //   maxHeight: "400px",
                          //   backgroundColor: "yellow",
                          // }}
                          maxDate={new Date(ddt)}
                          locale="us"
                          minDate={new Date()}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        width: "30%",
                        maxHeight: "300px",
                        overflow: "scroll",
                      }}
                    >
                      {calender.map((item) => {
                        if (item.date === dtt) {
                          // for(let i=1;i<=item.time.length;i++)

                          return (
                            <div
                              style={
                                {
                                  // dispaly: 'flex',
                                  // width: '0%',
                                  // textAlign: 'center',
                                }
                              }
                            >
                              <p style={{ textAlign: "center" }}>
                                <u>Timing</u>
                              </p>
                              <>
                                {item.slotTime.map((bb) => {
                                  if (filterDate === dtt) {
                                    {
                                      if (bb.time > tttt1)
                                        return (
                                          <div>
                                            <table>
                                              <div style={{ width: "100%" }}>
                                                <button
                                                  style={{
                                                    // fontSize: '20px',
                                                    // dispaly: 'flex',
                                                    // border: '1px outset black',
                                                    boxShadow:
                                                      "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
                                                    borderRadius: 5,
                                                    backgroundColor: "#ccfff5",
                                                    width: "100px",
                                                    height: "30px",
                                                    marginTop: "0px",
                                                    // marginLeft: '10px',
                                                    color: "black",
                                                  }}
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    setTime(e.target.value);
                                                  }}
                                                  value={bb.time.toString()}
                                                >
                                                  {bb.time.substring(0, 5)}-
                                                  {bb.sessionTime}
                                                  <br />
                                                </button>
                                              </div>
                                            </table>
                                          </div>
                                        );
                                    }
                                  } else {
                                    return (
                                      <div>
                                        <table>
                                          <div style={{ width: "100%" }}>
                                            <button
                                              style={{
                                                // fontSize: '20px',
                                                // dispaly: 'flex',
                                                // border: '1px outset black',
                                                boxShadow:
                                                  "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
                                                borderRadius: 5,
                                                backgroundColor: "#ccfff5",
                                                width: "100px",
                                                height: "30px",
                                                marginTop: "0px",
                                                // marginLeft: '10px',
                                                color: "black",
                                              }}
                                              onClick={(e) => {
                                                e.preventDefault();
                                                setTime(e.target.value);
                                              }}
                                              value={bb.time.toString()}
                                            >
                                              {bb.time.substring(0, 5)}-
                                              {bb.sessionTime}
                                              <br />
                                            </button>
                                          </div>
                                        </table>
                                      </div>
                                    );
                                  }
                                })}
                              </>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>

                  <div style={{ marginTop: "-100px", display: "flex" }}>
                    <div style={{ width: "70%" }}>
                      {/* <p className="error-text">Please select</p> */}
                      <p
                        style={{ marginLeft: "20px", fontSize: "15px" }}
                        className="mb-2"
                      >
                        <b> Your Booking: </b>
                      </p>
                      <p
                        style={{
                          boxShadow:
                            "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
                          borderRadius: 12,
                          borderRadius: "5px",
                          height: "auto",
                          width: "160px",
                          marginLeft: "20px",
                          fontSize: "15px",
                          marginTop: "-10px",
                        }}
                        className="p-1"
                      >
                        <b> Date: </b> {moment(dateState).format("DD-MM-YYYY")}
                        <br />
                        <b> Time: </b>
                        {calender.map((item) => {
                          if (item.date === dtt) {
                            return item.slotTime.map((e1) => {
                              if (e1.time === time) {
                                return (
                                  <>
                                    {e1.time.substring(0, 5)}-{e1.sessionTime}
                                  </>
                                );
                              }
                            });
                          }
                        })}
                      </p>
                    </div>
                    <div className="absolute bottom-6 right-2">
                      <PrimaryButton
                        mini
                        className="w-[max-content] text-sm"
                        onClick={finalSubmitBook}
                        type="submit"
                      >
                        Save
                      </PrimaryButton>

                      <div></div>
                    </div>
                  </div>
                </form>
              </div>
            </InfoDialog>
          )}
        </div>
      </div>
      <div className="challenge-card1">
        <div className="challenge-card2">
          <button
            onClick={flipCard1}
            style={{
              // backgroundColor: '#ff66a3',
              borderRadius: "10px",
              // color: 'white',
              justifyContent: "center",
              width: "30px",
              height: "25px",
              marginTop: "10px",
            }}
          >
            <ArrowLeftCircle size={25} />{" "}
          </button>
          {bookingList &&
            bookingList.map((item) => {
              return (
                <>
                  {subEventDetail.eventNature === "INDIVIDUAL" ? (
                    <>
                      <div style={{ fontWeight: "800" }}>
                        {item.dependentName}
                      </div>
                      <div>
                        <span style={{ fontSize: "12px" }}>
                          {item.bookingDateTime}
                        </span>

                        {item.activeStatus === "PENDING" ? (
                          <span>
                            <a
                              target="_blank"
                              href={item.meetingLink}
                              style={{
                                color: "#fff",
                                background: "blue",
                                borderRadius: 10,
                                padding: "0px 10px ",
                                marginLeft: "10px",
                              }}
                              // onClick={}
                            >
                              Pay
                            </a>
                          </span>
                        ) : item.activeStatus === "SUBSCRIBE" ? (
                          <span>
                            <a
                              target="_blank"
                              href={item.meetingLink}
                              style={{
                                color: "#fff",
                                background: "green",
                                borderRadius: 10,
                                padding: "0px 10px ",
                                marginLeft: "10px",
                              }}
                              // onClick={}
                            >
                              Join
                            </a>
                          </span>
                        ) : (
                          ""
                        )}
                        <span>
                          {item.activeStatus === "UNSUBSCRIBE" &&
                          item.canRejoin === true ? (
                            <a
                              style={{
                                color: "#fff",
                                background: "#ff9800",
                                borderRadius: 10,
                                padding: "0px 10px ",
                                marginLeft: "10px",
                              }}
                              // onClick={() =>
                              //   cancelAppointmentDependent(
                              //     item.registrationId,
                              //     item.subEventId
                              //   )
                              // }
                            >
                              Rebook
                            </a>
                          ) : item.activeStatus === "SUBSCRIBE" ? (
                            <a
                              style={{
                                color: "#fff",
                                background: "#F43F5E",
                                borderRadius: 24,
                                padding: "0px 10px ",
                                marginLeft: "5px",
                              }}
                              onClick={() =>
                                cancelAppointmentDependent(
                                  item.registrationId,
                                  item.subEventId
                                )
                              }
                            >
                              Remove
                            </a>
                          ) : item.activeStatus === "PENDING" ? (
                            <a
                              style={{
                                color: "#fff",
                                background: "#ff9800",
                                borderRadius: 24,
                                padding: "0px 10px ",
                                marginLeft: "10px",
                              }}
                              // onClick={() =>
                              //   cancelAppointmentDependent(
                              //     item.registrationId,
                              //     item.subEventId
                              //   )
                              // }
                            >
                              Pending
                            </a>
                          ) : (
                            ""
                          )}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "800",
                          maxWidth: "150px",
                        }}
                      >
                        {item.dependentName}
                      </div>
                      <span style={{ fontSize: "12px" }}>
                        {item.bookingDateTime}
                      </span>
                      {item.activeStatus === "PENDING" ? (
                        <span>
                          <a
                            target="_blank"
                            href={item.meetingLink}
                            style={{
                              color: "#fff",
                              background: "blue",
                              borderRadius: 10,
                              padding: "0px 10px ",
                              marginLeft: "3px",
                            }}
                            // onClick={}
                          >
                            Pay
                          </a>
                        </span>
                      ) : item.activeStatus === "SUBSCRIBE" ? (
                        <span>
                          <a
                            target="_blank"
                            href={item.meetingLink}
                            style={{
                              color: "#fff",
                              background: "green",
                              borderRadius: 10,
                              padding: "0px 10px ",
                              marginLeft: "10px",
                            }}
                            // onClick={}
                          >
                            Join
                          </a>
                        </span>
                      ) : (
                        ""
                      )}
                      <span>
                        {item.activeStatus === "UNSUBSCRIBE" &&
                        item.canRejoin === true ? (
                          <a
                            style={{
                              color: "#fff",
                              background: "#ff9800",
                              borderRadius: 10,
                              padding: "0px 10px ",
                              marginLeft: "10px",
                            }}
                            onClick={() =>
                              rejoinSubscribe(
                                item.registrationId,
                                item.subEventId
                              )
                            }
                          >
                            Rejoin
                          </a>
                        ) : item.activeStatus === "SUBSCRIBE" ? (
                          <a
                            style={{
                              color: "#fff",
                              background: "#F43F5E",
                              borderRadius: 10,
                              padding: "0px 10px ",
                              marginLeft: "5px",
                            }}
                            onClick={() =>
                              cancelAppointmentDependent(
                                item.registrationId,
                                item.subEventId
                              )
                            }
                          >
                            Unsubscribe
                          </a>
                        ) : item.activeStatus === "PENDING" ? (
                          <a
                            style={{
                              color: "#fff",
                              background: "#ff9800",
                              borderRadius: 10,
                              padding: "0px 10px ",
                              marginLeft: "10px",
                            }}
                            // onClick={() =>
                            //   cancelAppointmentDependent(
                            //     item.registrationId,
                            //     item.subEventId
                            //   )
                            // }
                          >
                            Pending
                          </a>
                        ) : (
                          ""
                        )}
                      </span>
                    </div>
                  )}
                </>
              );
            })}
        </div>
      </div>
    </ReactCardFlip>
  );
};

export default SubEventCard;
