import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "@material-ui/core/styles";
import Popup from "./Popup";
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import InfoDialog from "./Utility/InfoDialog";
import CancelIcon from "@material-ui/icons/Cancel";
// import Event from './Event'
// import 'bootstrap/dist/css/bootstrap.rtl.min.css';
// import ImageViewer from 'react-simple-image-viewer';
// import ReactLoadingWrapper from "./loaders/ReactLoadingWrapper";
// import Message from "antd-message";

// import { Modal } from "react-responsive-modal";
import { makeStyles } from "@material-ui/core/styles";
// import TextField from "@material-ui/core/TextField";
// import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
// import FormControl from "@material-ui/core/FormControl";
// import Select from "@material-ui/core/Select";
// import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
// import CancelIcon from "@material-ui/icons/Cancel";
import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import axios from "axios";
import Select from "@material-ui/core/Select";

import Message from "antd-message";

// import Paper from "@material-ui/core/Paper";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import IconButton from "@material-ui/core/IconButton";
// import CircularProgress from "@material-ui/core/CircularProgress";
// import Avatar from "@material-ui/core/Avatar";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
// import CSVExport from "../CSVExport";
import Tooltip from "@material-ui/core/Tooltip";

import { Plus } from "react-feather";
import { CSVLink } from "react-csv";
import { urlPrefix, secretToken } from "../services/apicollection";
import { PrimaryButton } from "./Form";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
  },
  selectTableCell: {
    width: 120,
  },
  tableCell: {
    width: 130,
    height: 40,
  },
  input: {
    width: 120,
    height: 40,
  },
}));

const CustomTableCell = ({ item, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = item;
  return (
    <TableCell align="left" className={classes.tableCell}>
      {isEditMode && item.dataSource === "WHATSAPP" ? (
        <Input
          value={item[name]}
          name={name}
          onChange={(e) => onChange(e, item)}
          className={classes.input}
        />
      ) : (
        item[name]
      )}
    </TableCell>
  );
};

const AuditReport = (props) => {
  const [Event, setEvent] = useState();
  const [data, setData] = useState([]);

  const handleChange = (e) => {
    setEvent(e.target.value);
  };

  const [items, setItems] = useState([]);
  function submit(e) {
    e.preventDefault();

    axios
      .get(`${urlPrefix}v1.0/userActiveCountReport?value=${Event}`, {
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
        {
          res.data.response.responseData
            ? setItems(res.data.response.responseData)
            : Message.error(res.data.response.responseMessage);
        }
      });
  }

  const [EditId, setEditId] = useState();
  const [EditValue, setEditValue] = useState();

  const [previous, setPrevious] = React.useState({});
  const [eventname1, setEventName1] = useState("");
  const [viewDetail, setViewDetails] = useState([]);
  const [userList, setUserList] = useState([]);
  const [totalUser, setTotalUser] = useState();
  const [userListModal, setUserListModal] = useState(false);
  console.log(viewDetail);
  console.log(userList);
  const ViewUser = (name, img, tagline) => {
    setEventName1(name);
    //  setteamImg(img);
    //  settag(tagline);
    var marvelHeroes = items.filter(function (hero) {
      const x = hero.eventName == name;
      return x;
    });
    setViewDetails(marvelHeroes);
  };

  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    console.log(value);
    setEditValue(value);
    const name = e.target.name;
    console.log(name);
    const { id } = row;

    setEditId(id);
    const newRows = items.map((row) => {
      // alert('Success!')
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setItems(newRows);
  };
  const onModaluserDetail = () => {
    setUserListModal(true);
  };
  const closeModal = () => {
    setUserListModal(false);
  };
  const Success = () => {
    Message.success("Updated Successfully!");
  };
  const closeIcon = (
    <svg fill="white" viewBox="0 0 20 20" width={28} height={28}>
      <path
        fillRule="evenodd"
        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
  console.log(items);
  const [currentImage, setCurrentImage] = useState("");
  const [isViewerOpen, setIsViewerOpen] = useState([false]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = (whatsAppImage) => {
    setIsOpen(!isOpen);
    setCurrentImage(whatsAppImage);
  };

  //   const [searchText, setSearchText] = useState("");
  //   const [isActive, setIsActive] = useState(true);
  //   const [team, setteam] = useState();
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 50));
    setPage(0);
  };
  // console.log(team, "xyz");
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(2),
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

  const headers = [
    { label: "Source", key: "dataSorce" },
    { label: "Date", key: "date" },
    { label: "Active on", key: "activityStartDate" },
    { label: "Activity to", key: "activityEndDate" },
    { label: "Entry on", key: "entryDateTime" },
    { label: "Raw value", key: "rawValue" },
    { label: "Raw unit", key: "rawUnit" },
    { label: "LeederBoard value", key: "leaderBoardValue" },
  ];
  const datas = items;

  const teamHeads = [
    {
      label: "S.No",
      id: "index",

      numeric: false,
      disablePadding: true,
    },
    {
      label: "Event Name",
      id: "eventName",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Event Start Date",
      id: "eventStartDate",
      numeric: false,
      disablePadding: true,
    },

    {
      label: "Event End Date",
      id: "eventEndDate",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Total Active",
      id: "totalRegistration",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Day (1day)",
      id: "count",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Week (7days)",
      id: "count",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Month (30days)",
      id: "count",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Quarter (90days)",
      id: "count",
      numeric: false,
      disablePadding: true,
    },

    {
      label: "Half (180days)",
      id: "count",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Yearly (365days)",
      id: "count",
      numeric: false,
      disablePadding: true,
    },
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
                paddingLeft: teamHead.id === "index" ? 5 : 0,
              }}
            >
              <TableSortLabel
                active={orderBy === teamHead.id}
                direction={orderBy === teamHead.id ? order : "asc"}
                onClick={createSortHandler(teamHead.id)}
                // style={{ width: "max-content" }}
              >
                <span
                  style={{ marginLeft: 5, fontSize: 15, fontFamily: "bold" }}
                >
                  {" "}
                  {teamHead.label}{" "}
                </span>
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

  return (
    <>
      <div>
        <div class="container" style={{ marginTop: "10px" }}>
          <form onSubmit={(e) => submit(e)}>
            <div>
              <div className="p-4 flex flex-wrap md:flex-row gap-8 items-start w-full md:justify-center mb-4">
                <fieldset>
                  <legend>Event Details</legend>
                  <Select
                    style={{ width: "250px" }}
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    onChange={handleChange}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>InActive</option>
                  </Select>
                </fieldset>
              </div>
              <div className="flex justify-center mb-4">
                <PrimaryButton mini className="w-16">
                  Submit
                </PrimaryButton>
              </div>
            </div>
            <div style={{ justifyContent: "center" }}></div>
          </form>
        </div>
        {/* <Paper className={classes.paper}> */}
        <div className="flex items-center justify-start ml-4 md:ml-0 md:justify-center">
          {/* <Tooltip title="Export data">
            <CSVLink data={datas} headers={headers} separator={','}>
              <SystemUpdateAltIcon />
            </CSVLink>
          </Tooltip> */}
          <div className="d-flex a-i-center">
            <TablePagination
              rowsPerPageOptions={[50, 75, 100]}
              component="div"
              count={items && items.length}
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
            minHeight: "350px",
            fontSize: 12,
            overflowX: "auto",
            fontWeight: "bold",
          }}
        >
          {items && items.length > 0 ? (
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={"small"}
              aria-label="enhanced table"
              style={{}}
            >
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />

              <TableBody style={{}}>
                {items &&
                  stableSort(items, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, ind) => {
                      // console.log(items);
                      return (
                        <TableRow>
                          <TableCell align="center">
                            {" "}
                            <span style={{ fontSize: 12 }}>{ind + 1}</span>{" "}
                          </TableCell>
                          <TableCell align="left">
                            {" "}
                            <span style={{ fontSize: 12 }}>
                              {item.eventName}
                            </span>{" "}
                          </TableCell>
                          <TableCell align="center">
                            {" "}
                            <span style={{ fontSize: 12 }}>
                              {item.eventStartDate}
                            </span>{" "}
                          </TableCell>
                          <TableCell align="center">
                            {" "}
                            <span style={{ fontSize: 12 }}>
                              {item.eventEndDate}
                            </span>{" "}
                          </TableCell>
                          <TableCell align="center">
                            {" "}
                            <span style={{ fontSize: 12 }}>
                              {item.totalRegistration ? (
                                item.totalRegistration
                              ) : (
                                <>
                                  <p
                                    style={{
                                      fontSize: "15px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    -
                                  </p>
                                </>
                              )}
                            </span>{" "}
                          </TableCell>
                          {item.userCount.map((curr, index) => {
                            return (
                              <>
                                <TableCell align="center" width="10px">
                                  {" "}
                                  {item.userCount !== [] ? (
                                    <div style={{ display: "flex" }}>
                                      <span style={{ fontSize: 12 }}>
                                        {" "}
                                        {curr.count ? (
                                          curr.count
                                        ) : (
                                          <>
                                            <p
                                              style={{
                                                fontSize: "15px",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              -
                                            </p>
                                          </>
                                        )}
                                      </span>
                                      <span>
                                        {curr.count !== 0 ? (
                                          <div>
                                            <button
                                              style={{
                                                fontSize: "20px",
                                                fontWeight: "bold",
                                                marginTop: "-50%",
                                              }}
                                              onClick={() => {
                                                onModaluserDetail(),
                                                  ViewUser(item.eventName),
                                                  setUserList(
                                                    curr.activeMembers
                                                  ),
                                                  setTotalUser(curr.count);
                                              }}
                                            >
                                              +
                                            </button>
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                      </span>
                                    </div>
                                  ) : (
                                    "-"
                                  )}
                                </TableCell>
                              </>
                            );
                          })}
                        </TableRow>
                      );
                    })}
              </TableBody>
              {userListModal && (
                <InfoDialog
                  handleClose={closeModal}
                  open={userListModal}
                  center
                >
                  <div
                    style={{
                      width: "700px",
                      height: "auto",
                      paddingTop: 5,
                      paddingLeft: 10,
                      paddingRight: 10,
                      overscrollBehavior: "scroll",
                    }}
                  >
                    <CancelIcon
                      style={{
                        position: "absolute",
                        top: 15,
                        right: 15,
                        color: "#ef5350",
                        cursor: "pointer",
                      }}
                      onClick={closeModal}
                    />
                    <div style={{ display: "flex" }}>
                      <div style={{ width: "60%" }}>
                        {viewDetail.map((curr, index) => {
                          return <>Event Name: {curr.eventName}</>;
                        })}{" "}
                      </div>
                      <div style={{ width: "30%" }}>
                        Total User : {totalUser}
                      </div>
                    </div>
                    <div
                    // style={{
                    //   minHeight: '350px',
                    //   fontSize: 12,
                    //   overflowX: 'auto',
                    // }}
                    >
                      <Table
                        style={{ fontSize: 9 }}
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={"small"}
                        aria-label="enhanced table"
                      >
                        <TableHead style={{ background: "#ecf0f1" }}>
                          <TableRow style={{}}>
                            <TableCell align="center">S.No.</TableCell>
                            <TableCell align="left"> User Name</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {userList.map((user, ind) => {
                            return (
                              <TableRow
                              // style={user.memberRole == 'TL' ? highlightRow : highlight}
                              >
                                <TableCell align="center"> {ind + 1}</TableCell>

                                <TableCell align="left">
                                  {" "}
                                  {user.name}{" "}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </InfoDialog>
              )}
            </Table>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
export default AuditReport;
