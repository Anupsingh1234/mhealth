import React, { useState, useEffect } from "react";
import { lighten, makeStyles, useTheme } from "@material-ui/core/styles";
import Chart from "react-apexcharts";
// import {Line} from 'react-chartjs-2';
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
import axios from "axios";
import { Modal } from "react-responsive-modal";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  getDataCurrentSource,
  syncGFitAndStrava,
  getChallengesByDate,
} from "../services/challengeApi";
import { AlertTriangle } from "react-feather";
import Tooltip from "@material-ui/core/Tooltip";
import Message from "antd-message";
import { PrimaryButton } from "./Form/Button";

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

const closeIcon = (
  <svg fill="white" viewBox="0 0 20 20" width={28} height={28}>
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      clipRule="evenodd"
    ></path>
  </svg>
);

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
    width: "100%",
    marginBottom: theme.spacing(2),
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

export default function PerformanceTable({
  data,
  eventId,
  handlePerformanceClick,
  challengeSwitch,
}) {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [selectedDate, setSelectedDate] = useState("");
  const [displayModal, setDisplayModal] = useState(false);
  const [weekMonth, setWeekMonth] = useState();
  const [radioValue, setRadioValue] = useState(false);
  const [imgborder, setimgborder] = useState(1);

  const [open, setOpen] = useState(false);
  const onOpenModal = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const [options, setOptions] = useState([]);
  const [series, setSeries] = useState([]);
  const startdate = [];
  const weeksum = [];

  const headCells = [
    {
      label: "S.No",
      id: "index",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Date",

      id: "valueTillDate",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Km",
      id: "value",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Source",
      id: "dataSource",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Action Required",
      id: "addData",
      numeric: false,
      disablePadding: true,
    },
  ];

  const headCells1 = [
    {
      label: "S.No",
      id: "index",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Date",

      id: "weekStartDate",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Km",
      id: "weekSum",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Source",
      id: "dataSource",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Action Required",
      id: "addData",
      numeric: false,
      disablePadding: true,
    },
  ];

  function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
    if (radioValue === "Daily") {
      return (
        <TableHead>
          <TableRow>
            {headCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                align="center"
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
            {headCells1.map((headCell) => (
              <TableCell
                key={headCell.id}
                align="center"
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
  }

  const handle = (val) => {
    const adminurl = `${urlPrefix}v1.0/getWeekWiseLeaderBoardData?challengerZoneId=${eventId}&value=${val}`;
    console.log(adminurl);
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
        console.log(res);
        {
          res?.data?.response?.responseData && res?.data?.response?.responseData
            ? res.data.response.responseData.map((e1) => {
                startdate.push(e1.weekStartDate);
                weeksum.push(e1.weekSum);
              })
            : "";

          setOptions(startdate);
          setSeries(weeksum);
          console.log(startdate, weeksum);

          setRadioValue(val);
          res?.data?.response?.responseData?.sort(function (a, b) {
            return new Date(b.weekStartDate) - new Date(a.weekStartDate);
          })
            ? setWeekMonth(res?.data?.response?.responseData)
            : message.error(res.data.response.responseMessage);
        }
      });
  };
  console.log(startdate, weeksum);
  // useEffect(() => {

  //     // handle('Daily');

  // }, [weekMonth]);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [displayAddButton, setDisplayAddButton] = useState(false);
  const [dataButtonType, setDataButtonType] = useState("");
  const [isCheckingData, setCheckingData] = useState(false);
  const [eventIDForSync, setEventIDForSync] = useState([]);
  useEffect(() => {
    setPage(0);
    setOrder("asc");
    setOrderBy("");

    setRowsPerPage(50);
  }, []);
  console.log(eventId);
  console.log(eventIDForSync);
  const [series1, setSeries1] = useState();
  const [options1, setOptions1] = useState();
  const valuestartdate = [];
  const valuevalue = [];
  console.log(series1, options1);
  console.log(series, options);
  if (radioValue === "Daily") {
  }
  useEffect(() => {
    if (eventId) {
      getChallengesByDate(eventId).then((res) => {
        console.log(
          res.data.response.responseData.challengerWiseLeaderBoard[0]
            .dateWiseBoard
        );
        res.data.response.responseData.challengerWiseLeaderBoard[0].dateWiseBoard.sort(
          function (a, b) {
            return new Date(a.valueTillDate) - new Date(b.valueTillDate);
          }
        )
          ? res.data.response.responseData.challengerWiseLeaderBoard[0].dateWiseBoard.map(
              (e2) => {
                valuestartdate.push(e2.valueTillDate);
                valuevalue.push(e2.value);
              }
            )
          : "";
        setOptions1(valuestartdate);
        setSeries1(valuevalue);
        console.log(valuestartdate, valuevalue);
      });
      setRadioValue("Daily");

      getDataCurrentSource(eventId)
        .then((res) => {
          console.log(res);
          if (
            res?.data?.response.responseCode === 0 &&
            (res?.data?.response.responseData.datasource === "WHATSAPP" ||
              res?.data?.response.responseData.datasource === "WEB")
          ) {
            setDataButtonType("WHATSAPP_WEB");
          } else if (
            res?.data?.response?.responseCode === 0 &&
            (res?.data?.response?.responseData?.datasource === "STRAVA" ||
              res?.data?.response?.responseData?.datasource === "GOOGLE_FIT")
          ) {
            setDataButtonType && setDataButtonType("STRAVA_GOOGLE_FIT");
          } else {
            setDataButtonType("");
          }
        })
        .catch((err) => {
          setDataButtonType("");
        });
    } else {
      setDataButtonType("");
    }
  }, [eventId]);

  // const closeIcon = (
  //   <svg fill="white" viewBox="0 0 20 20" width={28} height={28}>
  //     <path
  //       fillRule="evenodd"
  //       d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
  //       clipRule="evenodd"
  //     ></path>
  //   </svg>
  // );
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <div className="flex flex-col md:flex-row gap-2 mb-2 md:gap-5">
            <div className="flex items-center gap-2">
              <div className="flex gap-2 items-center">
                <div
                  className="first_div"
                  onChange={() => handle("Daily")}
                  value={radioValue}
                >
                  <input
                    type="radio"
                    defaultChecked
                    id="Daily"
                    name="radiobtn"
                    // checked={"true"}
                    // onChange={() => getChallengesByDate(eventId)}
                  />
                  <label for="Daily"> Daily</label>
                </div>

                <div
                  className="mid_div"
                  onChange={() => handle("Week")}
                  value={radioValue}
                >
                  <input
                    type="radio"
                    id="Week"
                    // value={radioValue}
                    name="radiobtn"
                  />
                  <label for="Week"> Weekly </label>
                </div>

                <div
                  className="last_div"
                  onChange={() => handle("Month")}
                  value={radioValue}
                >
                  <input type="radio" id="Month" name="radiobtn" />
                  <label for="Month"> Monthly </label>
                </div>
                <div>
                  {challengeSwitch !== "old" &&
                    dataButtonType === "WHATSAPP_WEB" && (
                      <div className="w-[max-content] text-sm flex items-center">
                        <PrimaryButton
                          mini
                          onClick={() => {
                            var today = new Date();
                            var dd = String(today.getDate()).padStart(2, "0");
                            var mm = String(today.getMonth() + 1).padStart(
                              2,
                              "0"
                            ); //January is 0!
                            var yyyy = today.getFullYear();

                            setSelectedDate(yyyy + "-" + mm + "-" + dd);
                            setDisplayModal(true);
                          }}
                        >
                          Add Today's Data
                        </PrimaryButton>
                      </div>
                    )}

                  {challengeSwitch !== "old" &&
                    dataButtonType === "STRAVA_GOOGLE_FIT" && (
                      <div className="w-[max-content] text-sm flex items-center">
                        <PrimaryButton
                          mini
                          style={{ marginLeft: 10 }}
                          onClick={() => {
                            window.message = Message;
                            /** api to sync**/
                            setCheckingData(true);
                            if (eventIDForSync.length === 0) {
                              syncGFitAndStrava("check", eventId)
                                .then((res) => {
                                  if (res.data.response.responseCode === 0) {
                                    setEventIDForSync(
                                      res.data.response.responseData
                                    );
                                  } else {
                                    message.success("No Data to sync");
                                    setEventIDForSync([]);
                                  }
                                  setCheckingData(false);
                                })
                                .catch((err) => {
                                  setEventIDForSync([]);
                                  setCheckingData(false);
                                });
                            }
                            if (eventIDForSync.length > 0) {
                              syncGFitAndStrava("fix", eventId).then((res) => {
                                if (res.data.response.responseCode === 0) {
                                  message.success("Synced");
                                  setEventIDForSync([]);
                                  setCheckingData(false);
                                }
                              });
                            }
                            if (eventIDForSync.length > 0) {
                              syncGFitAndStrava("fix", eventId)
                                .then((res) => {
                                  if (res.data.response.responseCode === 0) {
                                    message.success("Synced");
                                    setEventIDForSync([]);
                                    handlePerformanceClick();
                                  }
                                  setCheckingData(false);
                                })
                                .catch((err) => {
                                  setCheckingData(false);
                                });
                            }
                          }}
                        >
                          {isCheckingData
                            ? "In Progress.."
                            : eventIDForSync.length > 0
                            ? "Sync Data"
                            : "Validate"}
                        </PrimaryButton>
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div>
              <Modal
                open={open}
                styles={{ modal: { borderRadius: "10px", maxWidth: "1000px" } }}
                onClose={onClose}
                upper
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
                  onClick={onClose}
                />
                <div style={{ padding: 50 }}>
                  <h2 style={{ fontWeight: "bolder", textAlign: "center" }}>
                    {" "}
                    Choose your certificate
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src="images/img1.jpeg"
                      style={{
                        width: 150,
                        height: 200,
                        border: imgborder == 1 ? "5px solid blue" : "",
                      }}
                      onClick={() => {
                        setimgborder(1);
                      }}
                    />
                    <img
                      src="images/img2.jpeg"
                      style={{
                        width: 150,
                        height: 200,
                        marginLeft: 20,
                        border: imgborder == 2 ? "5px solid blue" : "",
                      }}
                      onClick={() => {
                        setimgborder(2);
                      }}
                    />
                    <img
                      src="images/img3.jpeg"
                      style={{
                        width: 150,
                        height: 200,
                        marginLeft: 20,
                        border: imgborder == 3 ? "5px solid blue" : "",
                      }}
                      onClick={() => {
                        setimgborder(3);
                      }}
                    />

                    <img
                      src="images/img4.jpeg"
                      style={{
                        width: 150,
                        height: 200,
                        marginLeft: 20,
                        border: imgborder == 4 ? "5px solid blue" : "",
                      }}
                      onClick={() => {
                        setimgborder(4);
                      }}
                    />

                    <img
                      src="images/img5.jpeg"
                      style={{
                        width: 150,
                        height: 200,
                        marginLeft: 20,
                        border: imgborder == 5 ? "5px solid blue" : "",
                      }}
                      onClick={() => {
                        setimgborder(5);
                      }}
                    />

                    <img
                      src="images/img6.jpeg"
                      style={{
                        width: 150,
                        height: 200,
                        marginLeft: 20,
                        border: imgborder == 6 ? "5px solid blue" : "",
                      }}
                      onClick={() => {
                        setimgborder(6);
                      }}
                    />
                  </div>
                  <button
                    style={{
                      marginTop: 15,
                      background: "green",
                      width: 150,
                      height: 30,
                      float: "right",
                      color: "#fff",
                    }}
                  >
                    Submit{" "}
                  </button>
                </div>
              </Modal>

              {radioValue === "Week" || radioValue === "Month" ? (
                <TablePagination
                  rowsPerPageOptions={[25, 50, 75, 100]}
                  component="div"
                  count={weekMonth && weekMonth.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              ) : (
                <TablePagination
                  rowsPerPageOptions={[25, 50, 75, 100]}
                  component="div"
                  count={data.data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              )}
            </div>
          </div>

          {data.data.length > 0 ? (
            <Table
              className={classes.table}
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
                {radioValue === "Daily" || radioValue === undefined ? (
                  <>
                    {data.data &&
                      data.data &&
                      stableSort(data.data, getComparator(order, orderBy))
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                          return (
                            <TableRow
                              hover
                              tabIndex={-1}
                              key={row.userId + "" + index}
                              className="performace-table-row"
                            >
                              <TableCell align="center">
                                <div style={{ fontSize: 12 }}>
                                  {row.index + 1}
                                </div>
                              </TableCell>
                              <TableCell align="center">
                                <div style={{ fontSize: 12 }}>
                                  {row.valueTillDate}
                                </div>
                              </TableCell>

                              <TableCell align="center">
                                <div
                                  style={{
                                    fontSize: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {row.value ? row.value : 0}
                                </div>
                              </TableCell>
                              <TableCell align="center">
                                <div style={{ fontSize: 12 }}>
                                  <img
                                    src={
                                      row.dataSource
                                        ? APP.dataSourceLogo[row.dataSource]
                                        : "https://walkathon21.s3.ap-south-1.amazonaws.com/logo/NotSet.svg"
                                    }
                                    style={{
                                      width: 30,
                                      height: 30,
                                    }}
                                  />
                                </div>
                              </TableCell>
                              <TableCell align="center">
                                <div style={{ fontSize: 12 }}>
                                  {challengeSwitch !== "old" &&
                                    row.value == 0 &&
                                    row.dataSource == "WHATSAPP" &&
                                    dataButtonType === "WHATSAPP_WEB" && (
                                      <button
                                        className="add-data-button rounded-full h-8 px-2"
                                        onClick={() => {
                                          setSelectedDate(row.valueTillDate);
                                          setDisplayModal(true);
                                        }}
                                      >
                                        Add Data
                                      </button>
                                    )}
                                  {challengeSwitch !== "old" &&
                                    dataButtonType === "STRAVA_GOOGLE_FIT" &&
                                    eventIDForSync &&
                                    eventIDForSync.includes(
                                      row.valueTillDate && row.valueTillDate
                                    ) && (
                                      <Tooltip title="Click on Sync button to sync the data">
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <AlertTriangle
                                            size={14}
                                            style={{
                                              marginLeft: "2px",
                                              marginRight: "2px",
                                              color: "red",
                                            }}
                                          />
                                          Sync Data
                                        </div>
                                      </Tooltip>
                                    )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                  </>
                ) : radioValue === "Week" ? (
                  <>
                    {weekMonth &&
                      weekMonth &&
                      stableSort(weekMonth, getComparator(order, orderBy))
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                          // console.log(row);
                          return (
                            <TableRow
                              hover
                              tabIndex={-1}
                              key={row.id}
                              className="performace-table-row"
                            >
                              <TableCell align="center">
                                <div style={{ fontSize: 12 }}>{index + 1}</div>
                              </TableCell>
                              <TableCell align="center">
                                <div style={{ fontSize: 12 }}>
                                  {row.weekStartDate} - {row.weekEndDate}
                                </div>
                              </TableCell>

                              <TableCell align="center">
                                <div
                                  style={{
                                    fontSize: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {row.weekSum ? row.weekSum : 0}
                                </div>
                              </TableCell>
                              <TableCell align="center">
                                <div style={{ fontSize: 12 }}>
                                  <img
                                    src={
                                      row.dataSource
                                        ? APP.dataSourceLogo[row.dataSource]
                                        : "https://walkathon21.s3.ap-south-1.amazonaws.com/logo/NotSet.svg"
                                    }
                                    style={{
                                      width: 30,
                                      height: 30,
                                    }}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                  </>
                ) : radioValue === "Month" ? (
                  <>
                    {weekMonth &&
                      weekMonth &&
                      stableSort(weekMonth, getComparator(order, orderBy))
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                          // console.log(row);
                          return (
                            <TableRow
                              hover
                              tabIndex={-1}
                              key={row.id}
                              className="performace-table-row"
                            >
                              <TableCell align="center">
                                <div style={{ fontSize: 12 }}>{index + 1}</div>
                              </TableCell>
                              <TableCell align="center">
                                <div style={{ fontSize: 12 }}>
                                  {row.weekStartDate} - {row.weekEndDate}
                                </div>
                              </TableCell>

                              <TableCell align="center">
                                <div
                                  style={{
                                    fontSize: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {row.weekSum ? row.weekSum : 0}
                                </div>
                              </TableCell>
                              <TableCell align="center">
                                <div style={{ fontSize: 12 }}>
                                  <img
                                    src={
                                      row.dataSource
                                        ? APP.dataSourceLogo[row.dataSource]
                                        : "https://walkathon21.s3.ap-south-1.amazonaws.com/logo/NotSet.svg"
                                    }
                                    style={{
                                      width: 30,
                                      height: 30,
                                    }}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                  </>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      style={{
                        position: "relative",
                        height: 100,
                      }}
                    >
                      <p
                        style={{
                          textAlign: "center",
                          margin: "100px 0",
                          color: "#8e8e8e",
                        }}
                      >
                        {data.message === "SUCCESS"
                          ? "Data is not present"
                          : data.message}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <Paper
              style={{
                width: "100%",
                height: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {" "}
              <div>
                {" "}
                <h2> No data present</h2>{" "}
              </div>{" "}
            </Paper>
          )}
        </TableContainer>
      </Paper>
      {radioValue === "Week" || radioValue === "Month" ? (
        <div className="flex flex-col md:flex-row gap-5">
          <div className="w-full md:[w-50%]">
            <Chart
              options={{
                tooltip: {
                  x: {
                    format: "dd/MM/yy",
                  },
                },
                chart: {
                  id: "weekmonth",
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  show: true,
                  width: 2,
                },

                fill: {
                  opacity: 1,
                },
                xaxis: {
                  type: "datetime",
                  categories: options,
                },
              }}
              series={[
                {
                  name: "Montly",
                  data: series,
                },
              ]}
              height={350}
              style={{
                boxShadow:
                  "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
                borderRadius: 12,
              }}
              type="bar"
              width="100%"
            />
          </div>
          <div className="w-full md:[w-50%]">
            <Chart
              options={{
                tooltip: {
                  x: {
                    format: "dd/MM/yy",
                  },
                },
                chart: {
                  id: "weekmonth",
                },
                xaxis: {
                  type: "datetime",
                  categories: options,
                },
              }}
              series={[
                {
                  name: "Monthly",
                  data: series,
                },
              ]}
              height={350}
              style={{
                boxShadow:
                  "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
                borderRadius: 12,
              }}
              type="line"
              width="100%"
            />
          </div>
        </div>
      ) : radioValue === "Daily" || radioValue !== undefined ? (
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-[50%] gap-5">
            <Chart
              options={{
                tooltip: {
                  x: {
                    format: "dd/MM/yy",
                  },
                },
                chart: {
                  id: "data.data",
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  show: true,
                  width: 2,
                },

                fill: {
                  opacity: 1,
                },
                xaxis: {
                  type: "datetime",
                  categories: options1,
                },
              }}
              series={[
                {
                  name: "Daily",
                  data: series1,
                },
              ]}
              height={350}
              style={{
                boxShadow:
                  "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
                borderRadius: 12,
              }}
              type="bar"
              width="100%"
            />
          </div>
          <div className="w-full md:w-[50%]">
            <Chart
              options={{
                toolbar: {
                  show: false,
                  tools: {
                    download: false,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false,
                    customIcons: [],
                  },
                },
                tooltip: {
                  x: {
                    format: "dd/MM/yy",
                  },
                },
                // stroke: {
                //   curve: 'straight',
                // },
                // chart: {
                //   id: 'Daily',
                // },
                // plotOptions: {
                //   bar: {
                //     horizontal: false,
                //     columnWidth: '25%',
                //   },
                // },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  curve: "smooth",
                  width: 2,
                  marginLeft: 10,
                },
                xaxis: {
                  type: "",
                  categories: options1,
                },
                grid: {
                  row: {
                    colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                    opacity: 0.5,
                  },
                },
              }}
              series={[
                {
                  name: "Daily",
                  data: series1,
                },
              ]}
              height={350}
              style={{
                boxShadow:
                  "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
                borderRadius: 12,
              }}
              type="line"
              width="100%"
            />
          </div>
        </div>
      ) : (
        "No Charts"
      )}
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
      )}
    </div>
  );
}
