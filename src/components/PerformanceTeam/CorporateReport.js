import React, { useEffect, useState } from "react";
import { lighten, useTheme } from "@material-ui/core/styles";

// import ReactLoadingWrapper from "./loaders/ReactLoadingWrapper";
import Message from "antd-message";

import { Modal } from "react-responsive-modal";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import CancelIcon from "@material-ui/icons/Cancel";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
// import CSVExport from "../CSVExport";
import Tooltip from "@material-ui/core/Tooltip";
// import NoData from "../NoData";
// import ActiveButton from "../Utility/ActiveButton";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import AddIcon from "@material-ui/icons/Add";
import { Edit } from "react-feather";
import { CSVLink } from "react-csv";
import axios from "axios";
import { urlPrefix } from "../../services/apicollection";
import { PrimaryButton } from "../Form";

const CorporateReport = (props) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [searchText, setSearchText] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [team, setteam] = useState();
  const [eventId, seteventId] = useState();
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // console.log(team, "xyz");
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
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

  const classes = useStyles();

  console.log(eventId, "eventid");

  function TablePaginationActions(props) {
    const classes = useStyles();
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

  const teamHeads = [
    {
      label: "S.no",
      id: "s.no",
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
      label: "Number",
      id: "userPhone",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Email",
      id: "userEmail",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Date & time",
      id: "date",
      numeric: false,
      disablePadding: true,
    },

    {
      label: "Event name",
      id: "eventsName",
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
      label: "organization Name",
      id: "organizationName",
      numeric: false,
      disablePadding: true,
    },

    {
      label: "Designation",
      id: "designation",
      numeric: false,
      disablePadding: true,
    },

    {
      label: "Employe count",
      id: "employeeCount",
      numeric: false,
      disablePadding: true,
    },

    {
      label: "Message",
      id: "queryDescription",
      numeric: false,
      disablePadding: true,
    },

    // {
    //   label: "Active Days",
    //   id: "teamActiveDay",
    //   numeric: false,
    //   disablePadding: true
    // },
    // {
    //   label: "Details",
    //   id: "userstatus",
    //   numeric: false,
    //   disablePadding: true
    // }
  ];

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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // function coach(props)
  const EnhancedTableHead = (prop) => {
    const { classes, order, orderBy, onRequestSort } = prop;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      // <Paper className={classes.paper}>
      <TableHead style={{}}>
        <TableRow>
          {teamHeads.map((teamHead) => (
            <TableCell
              key={teamHead.id}
              align="center"
              padding="none"
              sortDirection={orderBy === teamHead.id ? order : false}
              style={{
                width: "max-content",
                paddingLeft: teamHead.id == "index" ? 5 : 0,
              }}
            >
              <TableSortLabel
                active={orderBy === teamHead.id}
                direction={orderBy === teamHead.id ? order : "asc"}
                onClick={createSortHandler(teamHead.id)}
                style={{ width: "max-content" }}
              >
                <span style={{ marginLeft: 30 }}> {teamHead.label} </span>
                {orderBy === teamHead.id ? (
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

  const useStyles3 = makeStyles((theme) => ({
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    button: {
      display: "block",
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }));

  const classes3 = useStyles3();

  const [date, setdate] = useState();
  const [data, setdata] = useState([]);

  //
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  const yesterday = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
  ];

  const yesterdayVal = yesterday[yesterday.indexOf(dd) - 1];
  console.log(yesterdayVal);
  const mos = today.getMonth();
  var mm = months[mos];
  var year = today.getFullYear();
  // setdate(year + "-" + mm + "-" + dd);

  const [yester, setyester] = useState(year + "-" + mm + "-" + yesterdayVal);
  const [currDate, setcurrDate] = useState(year + "-" + mm + "-" + dd);

  const getDate = (event) => {
    setcurrDate(event.target.value);
  };

  const handleChange = () => {
    let URL = `${urlPrefix}v1.0/getSubEventRaisedQuery?fromDate=${yester}&toDate=${currDate}
`;

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
        // setprograms(res.data.response.responseData);
        setdata(res?.data?.response?.responseData);
      });
  };
  console.log(data);

  const handle1 = (e) => {
    setyester(e.target.value);
  };

  const handle2 = (e) => {
    setcurrDate(e.target.value);
  };

  return (
    <>
      <div className="corpoReport">
        <fieldset>
          <legend>From Date:</legend>
          <form className={classes3.container} noValidate>
            <TextField
              id="date"
              type="date"
              defaultValue={year + "-" + mm + "-" + yesterdayVal}
              className={classes3.textField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handle1}
              //
            />
          </form>
        </fieldset>
        <fieldset>
          <legend>To Date:</legend>
          <form className={classes3.container} noValidate>
            <TextField
              id="date"
              type="date"
              defaultValue={year + "-" + mm + "-" + dd}
              className={classes3.textField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handle2}
              //
            />
          </form>
        </fieldset>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 50,
          }}
        >
          <PrimaryButton
            mini
            className="w-[max-content] text-sm"
            onClick={handleChange}
          >
            {" "}
            submit{" "}
          </PrimaryButton>
          <span
            style={{
              marginTop: 20,
              color: "red",
              marginLeft: 50,
            }}
          >
            {" "}
            {/* {resMessage}{" "} */}
          </span>
        </div>{" "}
      </div>
      <hr />

      <div style={{ height: 500 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {/* <Tooltip title="Export data">
            <CSVLink data={datas} headers={headers} separator={","}>
              <SystemUpdateAltIcon />
            </CSVLink>
          </Tooltip> */}
          <div className="d-flex a-i-center">
            <TablePagination
              rowsPerPageOptions={[50, 75, 100]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </div>
        </div>
        <div
          style={{
            height: 300,
            padding: 30,
            overflowX: "scroll",
          }}
        >
          {data.length > 0 ? (
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

              {stableSort(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, ind) => {
                  return (
                    <>
                      <TableRow>
                        <TableCell align="center"> {ind + 1} </TableCell>
                        <TableCell align="center"> {item.userName} </TableCell>

                        <TableCell align="center"> {item.userPhone} </TableCell>

                        <TableCell align="center"> {item.userEmail} </TableCell>
                        <TableCell align="center"> {item.date} </TableCell>
                        <TableCell align="center"> {item.eventName} </TableCell>
                        <TableCell align="center">
                          {" "}
                          {item.programName}{" "}
                        </TableCell>

                        <TableCell align="center">
                          {" "}
                          {item.organizationName}{" "}
                        </TableCell>

                        <TableCell align="center">
                          {" "}
                          {item.designation}{" "}
                        </TableCell>

                        <TableCell align="center">
                          {" "}
                          {item.employeeCount}{" "}
                        </TableCell>

                        <TableCell align="center">
                          {" "}
                          {item.queryDescription}{" "}
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
            </Table>
          ) : (
            <>
              <div
                style={{
                  // height: 400,
                  padding: "5px",
                  marginTop: 30,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  fontSize: 12,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className=""
              >
                {" "}
                <img
                  style={{ width: 200, height: 200 }}
                  src="https://w21.mhealth.ai/static/media/dataSource.11fba1d5.svg"
                />
                Data is not present
              </div>{" "}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CorporateReport;
