import React, { useEffect, useState } from "react";
import { lighten, useTheme } from "@material-ui/core/styles";

// import ReactLoadingWrapper from "./loaders/ReactLoadingWrapper";
import Message from "antd-message";

import { Modal } from "react-responsive-modal";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";

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
import axios from "axios";
import "react-tabs/style/react-tabs.css";

import { urlPrefix } from "../services/apicollection";

const ActivityReport = () => {
  const [endDate, setendDate] = useState("");
  const [startDate, setstartDate] = useState("");
  const [result, setresult] = useState([]);

  const toDate = (e) => {
    setendDate(e.target.value);
  };
  const FromDate = (e) => {
    setstartDate(e.target.value);
  };

  const useStyles1 = makeStyles((theme) => ({
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
  const classes1 = useStyles1();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [searchText, setSearchText] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [team, setteam] = useState();
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  const teamHeads = [
    {
      label: "S.no",
      id: "name",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Mobile",
      id: "mobileNumber",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "In date",
      id: "inDate",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Out Date",
      id: "outDate",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Schedule Date",
      id: "scheduledDate",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Message",
      id: "waMessage",
      numeric: false,
      disablePadding: true,
    },
  ];

  const handleRequest = () => {
    const url = `${urlPrefix}v1.0/whatsScheduledMsgReport?endDate=${endDate}&startDate=${startDate}`;
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
          res?.data?.response?.responseData.length > 0
            ? setresult(res?.data?.response?.responseData)
            : Message.error("No data on this date..");
        }
      })
      .catch((err) => {
        err ? Message.err("No data on this date..") : "";
      });
  };
  console.log(result, "result");
  return (
    <>
      <div
        className="main_div"
        style={{ display: "flex", justifyContent: "space-around" }}
      >
        <div
          className="select_date"
          style={{
            width: "23%",
            justifyContent: "center",
            alignItems: "center",
            top: 20,
          }}
        >
          <fieldset>
            <legend>From Date:</legend>
            <form className={classes1.container} noValidate>
              <TextField
                style={{ fontSize: 12, width: "100%" }}
                id="date"
                type="date"
                defaultValue=""
                className={classes1.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={FromDate}
              />
            </form>
          </fieldset>
        </div>

        <div
          className="select_date"
          style={{
            width: "250px",
            justifyContent: "center",
            alignItems: "center",
            top: 20,
          }}
        >
          <fieldset>
            <legend>To Date:</legend>
            <form className={classes1.container} noValidate>
              <TextField
                style={{ fontSize: 12, maxWidth: "250px" }}
                id="date"
                type="date"
                defaultValue=""
                className={classes1.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={toDate}
              />
            </form>
          </fieldset>
        </div>
        <button
          style={{
            width: "130px",
            height: "30px",
            color: "#fff",
            background: "green",
            marginTop: 25,
          }}
          onClick={handleRequest}
        >
          {" "}
          Submit{" "}
        </button>
      </div>

      <hr></hr>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div className="d-flex a-i-center">
            <TablePagination
              rowsPerPageOptions={[50, 75, 100]}
              component="div"
              count={result.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </div>
        </div>

        <div style={{ height: "350px", padding: 30, overflowX: "scroll" }}>
          {result.length > 0 ? (
            <>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={"small"}
                aria-label="enhanced table"
                // style={{ position: "absolute" }}
              >
                <EnhancedTableHead
                  classes={classes}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />

                {stableSort(result, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, ind) => {
                    return (
                      <>
                        <TableRow className="teamLeaderboard" key={ind}>
                          <TableCell align="center">{ind + 1}</TableCell>
                          <TableCell align="left">
                            {item.mobileNumber}
                          </TableCell>{" "}
                          <TableCell align="left" style={{ width: "150px" }}>
                            {item.outDate}
                          </TableCell>
                          <TableCell align="left" style={{ width: "150px" }}>
                            {item.scheduledDate}
                          </TableCell>
                          <TableCell align="left">
                            {item.waMessage.substring(0, 150) + "......"}
                          </TableCell>
                          <TableCell align="left" style={{ width: "150px" }}>
                            {item.apiResponse}
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
              </Table>
            </>
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

export default ActivityReport;
