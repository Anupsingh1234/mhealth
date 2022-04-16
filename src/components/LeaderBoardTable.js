import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { lighten, makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FilterListIcon from "@material-ui/icons/FilterList";
import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";
import Popover from "@material-ui/core/Popover";
import LeaderBoardFilters from "./LeaderBoardFilters";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { pinUsersAction } from "../services/challengeApi";
import { APP } from "../utils/appConfig";
import CSVExport from "./CSVExport";
import TableDataSourceCarousel from "./TableDataSourceCarousel";
import ImageCarousel from "./ImageCarousel";
import { checkForFalsy } from "../utils/commonFunctions";
import NoData from "./NoData";
import ActiveButton from "./Utility/ActiveButton";
import { Calendar } from "react-feather";
import InfoDialog from "./Utility/InfoDialog";
import CancelIcon from "@material-ui/icons/Cancel";
import { urlPrefix } from "../services/apicollection";
import axios from "axios";
import moment from "moment";
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
  let firstValue =
    a[orderBy] == null
      ? "zzzzzzzzzzzzzzzz"
      : typeof a[orderBy] == "string"
      ? a[orderBy]?.toLowerCase()
      : a[orderBy];
  let secondValue =
    b[orderBy] == null
      ? "zzzzzzzzzzzzzzzz"
      : typeof b[orderBy] == "string"
      ? b[orderBy]?.toLowerCase()
      : b[orderBy];
  let modifiedFirst =
    orderBy == "userName"
      ? a["aliasName"]
        ? a["aliasName"]?.toLowerCase()
        : firstValue
      : firstValue;
  let modifiedSecond =
    orderBy == "userName"
      ? b["aliasName"]
        ? b["aliasName"]?.toLowerCase()
        : secondValue
      : secondValue;
  if (modifiedSecond < modifiedFirst) {
    return -1;
  }
  if (modifiedSecond > modifiedFirst) {
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

const headCells = [
  {
    label: "Rank",
    id: "rank",
    numeric: true,
    disablePadding: true,
  },
  {
    label: "Name",
    id: "userName",
    numeric: false,
    disablePadding: true,
  },

  {
    label: "Achievement",
    // id: 'valueTillDate',
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
    label: "City",
    id: "city",
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
    label: "Date",
    id: "valueTillDate",
    numeric: false,
    disablePadding: true,
  },

  {
    label: "Km",
    id: "lastDistanceCovered",
    numeric: true,
    disablePadding: true,
  },

  // {
  //   label: "verification status",
  //   id: "lastDistanceCovered",
  //   numeric: true,
  //   disablePadding: true
  // },
  {
    label: "Total.Km",
    id: "value",
    numeric: true,
    disablePadding: true,
  },
  {
    label: "Avg.Km",
    id: "averageDistanceCovered",
    numeric: true,
    disablePadding: true,
  },
  {
    label: "Lead",
    id: "leadBy",
    numeric: true,
    disablePadding: true,
  },
  {
    label: "Active.Day",
    id: "totalParticipationDays",
    numeric: true,
    disablePadding: true,
  },
  {
    label: "Category",
    // id: "totalParticipationDays",
    numeric: true,
    disablePadding: true,
  },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    pinActive,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {pinActive && (
          <TableCell padding="checkbox">
            <Checkbox
              inputProps={{ "aria-label": "select all desserts" }}
              disabled={true}
            />
          </TableCell>
        )}
        {headCells.map((headCell) => (
          <TableCell
            // style={{}}
            style={{ padding: 1 }}
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? "none" : "default"}
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

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: "#0277bd",
          // border: "1px solid #f5f5f5",
          minHeight: "34px",
          marginTop: "11px",
        }
      : {
          color: "#0277bd",
          // border: "1px solid #f5f5f5",
        },
  title: {
    flex: "1 1 100%",
  },
}));

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
    top: 0,
    width: 1,
  },
}));

export default function EnhancedTable({
  leaderBoardData,
  currentEvent,
  challengeSwitch,
}) {
  const classes = useStyles();
  const [leaderboardList, setLeaderboardList] = useState(leaderBoardData);

  const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const {
      numSelected,
      leaderboardList,
      setPinActive,
      pinActive,
      selected,
      setTableRowData,
      setFilters,
      filters,
      currentEvent,
    } = props;

    const [filterPopoverAnchorEl, setFilterPopoverAnchorEl] =
      React.useState(null);

    const handleFilterPopoverClick = (event) => {
      setFilterPopoverAnchorEl(event.currentTarget);
    };

    const handlefilterPopoverClose = () => {
      setFilterPopoverAnchorEl(null);
    };

    const filterPopoverOpen = Boolean(filterPopoverAnchorEl);
    const filterPopoverId = filterPopoverOpen ? "simple-popover" : undefined;

    const handlePinSave = () => {
      setPinActive(false);
      let pinnedUsers = leaderboardList["data"]["rankWiseBoard"]
        .filter((item) => selected.includes(item.rank))
        .map((item) => item.userId);
      let payload = {
        challangerZoneId: leaderboardList.data.challengerZoneId,
        userIdsToPin: pinnedUsers,
      };
      pinUsersAction(payload);

      if (
        leaderboardList["data"]["rankWiseBoard"] &&
        leaderboardList["data"]["sessionUserRank"]
      ) {
        setTableRowData([
          leaderboardList["data"]["sessionUserRank"],
          ...leaderboardList["data"]["rankWiseBoard"].filter(
            (item) =>
              pinnedUsers.includes(item.userId) &&
              item.userId !==
                leaderboardList["data"]["sessionUserRank"]["userId"]
          ),
          ...leaderboardList["data"]["rankWiseBoard"].filter(
            (item) =>
              !pinnedUsers.includes(item.userId) &&
              item.userId !==
                leaderboardList["data"]["sessionUserRank"]["userId"]
          ),
        ]);
      }
    };

    return (
      <>
        <Toolbar
          className={clsx(classes.root, {
            [classes.highlight]: pinActive,
          })}
        >
          <div>
            {pinActive && currentEvent["id"] ? (
              <div
                className="leaderboard-table-title challenges-heading"
                style={{ width: "120px" }}
              >
                {numSelected}/
                {`${currentEvent.pinnedUserCount}\n friends pinned`}
              </div>
            ) : (
              ""
            )}
          </div>
          {pinActive && currentEvent["id"] ? (
            <>
              <button
                variant="contained"
                onClick={() => handlePinSave()}
                className="pin-users-save-button"
                style={{
                  background: "#DCFCE7",
                  color: "#166534",
                  borderRadius: 24,
                  fontSize: 12,
                  padding: "2px 10px",
                }}
              >
                SAVE
              </button>
            </>
          ) : (
            ""
          )}
          <Popover
            id={filterPopoverId}
            open={filterPopoverOpen}
            anchorEl={filterPopoverAnchorEl}
            onClose={handlefilterPopoverClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <div>
              <LeaderBoardFilters
                setTableRowData={setTableRowData}
                leaderboardList={leaderboardList}
                setFilters={setFilters}
                filters={filters}
                handlefilterPopoverClose={handlefilterPopoverClose}
              />
            </div>
          </Popover>
        </Toolbar>
        {props.children}
      </>
    );
  };
  const [tableRowData, setTableRowData] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [pinActive, setPinActive] = useState(false);
  const [filters, setFilters] = useState({
    gender: "",
    age: [0, 100],
    city: "",
    pinCode: "",
    state: "",
    activeDays: [0, 365],
  });
  const [isActive, setActive] = useState(true);

  const settingTableData = () => {
    if (leaderboardList && leaderboardList["data"] && currentEvent["id"]) {
      let pinnedUsers = leaderboardList["data"]["pinUserRank"]
        ? leaderboardList["data"]["pinUserRank"].map((item) => item.userId)
        : [];

      if (leaderboardList["data"]["rankWiseBoard"]) {
        if (leaderboardList["data"]["sessionUserRank"]) {
          let tableData = [
            leaderboardList["data"]["sessionUserRank"],
            ...leaderboardList["data"]["rankWiseBoard"].filter(
              (item) =>
                pinnedUsers.includes(item.userId) &&
                item.userId !==
                  leaderboardList["data"]["sessionUserRank"]["userId"]
            ),
            ...leaderboardList["data"]["rankWiseBoard"].filter((item) =>
              isActive
                ? !pinnedUsers.includes(item.userId) &&
                  item.userId !==
                    leaderboardList["data"]["sessionUserRank"]["userId"] &&
                  item.totalParticipationDays > 0
                : !pinnedUsers.includes(item.userId) &&
                  item.userId !==
                    leaderboardList["data"]["sessionUserRank"]["userId"]
            ),
          ];
          setTableRowData(tableData);
        } else {
          let tableData = [
            ...leaderboardList["data"]["rankWiseBoard"].filter((item) =>
              pinnedUsers.includes(item.userId)
            ),
            ...leaderboardList["data"]["rankWiseBoard"].filter((item) =>
              isActive
                ? !pinnedUsers.includes(item.userId) &&
                  item.totalParticipationDays > 0
                : !pinnedUsers.includes(item.userId)
            ),
          ];

          setTableRowData(tableData);
        }
      }

      if (leaderboardList["data"]["pinUserRank"]) {
        setSelected(
          leaderboardList["data"]["pinUserRank"].map((item) => item.rank)
        );
      }
    }
  };
  useEffect(() => {
    setPinActive(false);
    setSelected([]);
    settingTableData();
  }, [leaderBoardData]);

  useEffect(() => {
    settingTableData();
  }, [isActive]);

  useEffect(() => {
    if (challengeSwitch) {
      setActive(challengeSwitch == "upcoming" ? false : true);
    }
  }, [challengeSwitch]);
  useEffect(() => {
    setActive(true);
  }, [currentEvent]);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event, rank) => {
    if (
      selected.length < currentEvent.pinnedUserCount ||
      selected.includes(rank)
    ) {
      const selectedIndex = selected.indexOf(rank);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, rank);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }
      if (
        leaderboardList["data"] &&
        leaderboardList["data"]["sessionUserRank"]
      ) {
        if (leaderboardList["data"]["sessionUserRank"]["rank"] !== rank) {
          setSelected(newSelected);
        }
      } else {
        setSelected(newSelected);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedUserData, setSelectedUserData] = React.useState(undefined);

  const handleDataSrcClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setSelectedUserData(undefined);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [showCarousel, setShowCarousel] = useState(false);
  const [searchText, setSearchText] = useState("");

  const getFilterData = () => {
    const filterData = leaderboardList.data.rankWiseBoard.filter((v) =>
      !checkForFalsy(v.aliasName)
        ? v.aliasName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
        : v.userName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
    );
    setTableRowData(filterData);
  };

  const getStatusImg = (url) => {
    return (
      <div style={{ width: 30 }}>
        <img src={url} width={"100%"} />
      </div>
    );
  };
  const today = new Date();

  const weekMonth = new Date();
  const first = new Date(
    weekMonth.setDate(weekMonth.getDate() - weekMonth.getDay())
  );
  const last = new Date(
    weekMonth.setDate(weekMonth.getDate() - weekMonth.getDay() + 6)
  );
  const month = moment(today).format("YYYY-MM-DD");
  const lastweekstart = new Date(
    weekMonth.getFullYear(),
    weekMonth.getMonth(),
    weekMonth.getDate() - 14
  );
  const lastweekend = new Date(
    weekMonth.getFullYear(),
    weekMonth.getMonth(),
    weekMonth.getDate() - 7
  );
  const currdate = new Date();
  const prevStartDate = new Date(
    currdate.getFullYear(),
    currdate.getMonth() - 1,
    1
  );
  const preEndDate = new Date(
    currdate.getFullYear(),
    currdate.getMonth() - 1 + 1,
    0
  );
  const [dateRange, setDateRange] = useState(false);
  const [startDate, setStartDate] = useState(
    currentEvent.sdate!==undefined?currentEvent.sdate.substring(0, 10):''
  );
  const [endDate, setEndDate] = useState(
    moment(today).format("YYYY-MM-DD") >
      currentEvent.sdate!==undefined?currentEvent.edate.substring(0, 10):''
      ? currentEvent.sdate!==undefined?currentEvent.edate.substring(0, 10):''
      : moment(today).format("YYYY-MM-DD")
  );
  const [showStartDate, setShowStartDate] = useState(
    moment(startDate).format("DD-MM-YYYY")
  );
  const [showEndDate, setShowEndDate] = useState(
    moment(endDate).format("DD-MM-YYYY")
  );
  const handleChange = (selectedStartDate, selectedEndDate) => {
    setShowStartDate(moment(selectedStartDate).format("DD-MM-YYYY"));
    setShowEndDate(moment(selectedEndDate).format("DD-MM-YYYY"));
    const URL = `${urlPrefix}v1.0/getLeaderBoardData?challengerZoneId=${localStorage.getItem(
      "selectEvent"
    )}&endDate=${selectedEndDate}&startDate=${selectedStartDate}`;

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
        {
          // if (res?.data?.response?.responseMessage === 'SUCCESS') {
          //   res?.data?.response?.responseData &&
          //     setLeaderboardList([
          //      data[
          //       res?.data?.response?.responseData?.challengerWiseLeaderBoard[0]]

          //     ]);
          //   setDateRange(false);
          //   setStartDate(`${month.substring(0, 7)}-01`);
          //   setEndDate(moment(today).format('YYYY-MM-DD'));
          // }
          setActive(true);
          if (res.data.response.responseMessage === "SUCCESS") {
            setDateRange(false);
            setStartDate(currentEvent.challengeStartDate.substring(0, 10));
            setEndDate(
              moment(today).format("YYYY-MM-DD") >
                currentEvent.challengeEndDate.substring(0, 10)
                ? currentEvent.challengeEndDate.substring(0, 10)
                : moment(today).format("YYYY-MM-DD")
            );
            let data = res.data.response.responseData.challengerWiseLeaderBoard;
            setLeaderboardList({
              data: data[0],
              loading: false,
              message: res.data.response.responseMessage,
            });
            settingTableData();
            setActive(false);
          }
        }
      });
  };
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer style={{ marginTop: "-2px" }}>
          <div className="table-search-container" style={{ marginTop: "-2px" }}>
            <div>
              {pinActive && currentEvent["id"] ? (
                <EnhancedTableToolbar
                  numSelected={selected.length}
                  leaderboardList={leaderboardList}
                  setPinActive={setPinActive}
                  pinActive={pinActive}
                  selected={selected}
                  setTableRowData={setTableRowData}
                  setFilters={setFilters}
                  filters={filters}
                  currentEvent={currentEvent}
                />
              ) : (
                <div className="leaderboard-table-button-wrapper">
                  {currentEvent["id"] && (
                    <Tooltip title="Pin users">
                      <button
                        style={{
                          background: "#E0E7FF",
                          color: "#4338CA",
                          borderRadius: 24,
                          marginLeft: 10,
                          cursor: "pointer",
                          padding: "2px 10px",
                          fontSize: 12,
                        }}
                        onClick={() => setPinActive(!pinActive)}
                      >
                        Tag Friends
                      </button>
                    </Tooltip>
                  )}
                  {/* <Tooltip title="Filter list">
              <IconButton
                aria-label="filter list"
                style={{
                  width: 40,
                  marginLeft: 10,
                }}
                onClick={(event) => handleFilterPopoverClick(event)}
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip> */}
                </div>
              )}
            </div>
            {!pinActive && currentEvent["id"] ? (
              <div className=" challenges-heading" style={{ marginTop: "8px" }}>
                {/* {currentEvent && currentEvent["challengeName"]
              ? currentEvent["challengeName"]
              : "Table Title"} */}
                <span
                  style={{
                    marginLeft: 5,
                    color: "#000",
                    fontWeight: 700,
                    display: "flex",
                    width: "250px",
                  }}
                  // className="table-search-container"
                >
                  <span>
                    <img
                      src="https://walkathon21.s3.ap-south-1.amazonaws.com/logo/Support.png"
                      height="25px"
                      width="25px"
                      marginTop="-50px"
                    />
                  </span>
                  <span style={{ marginTop: "5px", marginLeft: "5px" }}>
                    {currentEvent
                      ? currentEvent["moderatorName"]
                        ? ` : ${currentEvent["moderatorName"]} ${
                            currentEvent["moderatorMobileNumber"]
                              ? " , " + currentEvent["moderatorMobileNumber"]
                              : " )"
                          }`
                        : ""
                      : ""}
                  </span>
                </span>
              </div>
            ) : (
              ""
            )}

            <div className="d-flex a-i-center">
              <input
                className="table-search"
                placeholder="Search by name"
                style={{ marginTop: "2px", width: "110px" }}
                onChange={(e) => {
                  if (e.target.value === "") {
                    settingTableData();
                    return;
                  }
                  setSearchText(e.target.value);
                  getFilterData();
                }}
              />
              <ActiveButton
                isActive={isActive}
                handleActive={() => {
                  setActive((isActive) => !isActive);
                }}
              />
              <TablePagination
                rowsPerPageOptions={[25, 50, 75, 100]}
                component="div"
                count={tableRowData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
              {leaderboardList?.data?.rankWiseBoard?.length > 0 &&
                currentEvent["id"] && (
                  <>
                    <p className="mx-1" title="Export data">
                      <CSVExport
                        data={
                          leaderboardList?.data?.rankWiseBoard?.length > 0
                            ? leaderboardList?.data?.rankWiseBoard
                            : []
                        }
                        filename={`${leaderboardList["data"]["challengerZoneName"]}.csv`}
                        source="dashboard"
                      />
                    </p>
                  </>
                )}
              {/* <Calendar size={20}  /> */}
              <img
                className="mx-1"
                src="https://walkathon21.s3.ap-south-1.amazonaws.com/logo/DateRange.png"
                height="25px"
                width="25px"
                onClick={() => setDateRange(true)}
                style={{ cursor: "pointer", marginTop: "-5px" }}
              />
              <span style={{ fontWeight: "800", marginLeft: "5px" }}>[</span>{" "}
              <span
                // type="date"

                style={{
                  // background: '#f3f4f6',
                  // padding: '6px 10px',
                  // borderRadius: 6,
                  fontSize: 12,

                  marginLeft: "2px",
                  fontWeight: "800",
                }}
              >
                {showStartDate.substring(0, 6)}
                {showStartDate.substring(8)}
              </span>
              <span style={{ fontWeight: "800", marginLeft: "8px" }}>-</span>{" "}
              <span
                // type="date"

                style={{
                  // background: '#f3f4f6',
                  // padding: '6px 10px',
                  // borderRadius: 6,
                  fontSize: 12,

                  marginLeft: "5px",
                  fontWeight: "800",
                }}
              >
                {showEndDate.substring(0, 6)}
                {showEndDate.substring(8)}
              </span>
              <span style={{ fontWeight: "800" }}>]</span>
            </div>
            <div></div>
          </div>

          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"small"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={tableRowData.length}
              pinActive={pinActive}
            />

            <TableBody>
              {leaderboardList?.loading ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    style={{
                      position: "relative",
                      height: 200,
                    }}
                  >
                    <FacebookCircularProgress />
                  </TableCell>
                </TableRow>
              ) : tableRowData.length > 0 && currentEvent["id"] ? (
                <>
                  {stableSort(tableRowData, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.rank);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => {
                            if (pinActive) {
                              handleClick(event, row.rank);
                            }
                          }}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.rank + "" + index}
                          selected={isItemSelected}
                          style={
                            leaderboardList["data"] &&
                            leaderboardList["data"]["sessionUserRank"] &&
                            row.rank ==
                              leaderboardList["data"]["sessionUserRank"]["rank"]
                              ? { background: "#e8f5e9" }
                              : isItemSelected
                              ? {
                                  backgroundColor: "#e0f2fe",
                                }
                              : {}
                          }
                        >
                          {pinActive && (
                            <TableCell padding="checkbox">
                              <Checkbox
                                onClick={(event) =>
                                  handleClick(event, row.rank)
                                }
                                checked={isItemSelected}
                                inputProps={{ "aria-labelledby": labelId }}
                                disabled={
                                  leaderboardList["data"] &&
                                  leaderboardList["data"]["sessionUserRank"] &&
                                  row.rank ==
                                    leaderboardList["data"]["sessionUserRank"][
                                      "rank"
                                    ]
                                }
                              />
                            </TableCell>
                          )}
                          <TableCell
                            style={{ padding: 2 }}
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            align="center"
                          >
                            <div style={{ fontSize: "12px" }}>
                              {row.rank ? row.rank : "-"}
                            </div>
                          </TableCell>
                          <TableCell align="center" style={{ padding: 5 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                fontSize: 12,
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  alignItems: "center",
                          
                                }}
                              >
                                <Avatar
                                  style={{
                                    width: 30,
                                    height: 30,
                                    marginRight: 5,
                                  }}
                                  src={row.avtarImg}
                                  className="avatar-component"
                                />
                                <div
                                  style={{
                                    width: "max-content",
                                    fontSize: "12px",
                                  }}
                                >
                                  {row.aliasName
                                    ? row.aliasName
                                    : row.userName
                                    ? row.userName
                                    : "-"}
                                </div>
                              </div>
                              <div>
                                <div style={{ marginLeft: "0.75em" }}>
                                  {row.toolTipMessage && (
                                    <Tooltip
                                      title={row.toolTipMessage}
                                      aria-label={row.toolTipMessage}
                                      placement="top"
                                    >
                                      {row.statusImageUrl &&
                                        getStatusImg(row.statusImageUrl)}
                                    </Tooltip>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell align="center" style={{ padding: 0 }}>
                            <div
                              style={{ fontSize: 12 }}
                              className="flex justify-center"
                            >
                              {row.achievementIcon ? (
                                <img
                                  style={{
                                    width: 35,
                                    height: 35,
                                    borderRadius: "100%",
                                  }}
                                  src={
                                    row.achievementIcon && row.achievementIcon
                                  }
                                />
                              ) : (
                                "-"
                              )}
                            </div>
                          </TableCell>{" "}
                          <TableCell align="center" style={{}}>
                            <div
                              style={{ fontSize: 12, padding: 5 }}
                              className="flex justify-center"
                            >
                              {(row.gender && row.gender === "Male") ||
                              row.gender === "male" ||
                              row.gender === "MALE" ? (
                                <img
                                  src="https://walkathon21.s3.ap-south-1.amazonaws.com/logo/Male.png"
                                  style={{
                                    objectFit: "cover",
                                    width: 25,
                                    height: 25,
                                  }}
                                />
                              ) : row.gender == "Female" ||
                                row.gender === "female" ||
                                row.gender === "FEMALE" ? (
                                <img
                                  src="https://walkathon21.s3.ap-south-1.amazonaws.com/logo/Female.png"
                                  style={{
                                    width: 25,
                                    height: 25,
                                  }}
                                />
                              ) : (
                                "-"
                              )}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <div style={{ fontSize: 12 }}>
                              {row.city ? row.city : "-"}
                            </div>
                          </TableCell>
                          <TableCell align="center" style={{ padding: 0 }}>
                            <div
                              style={{
                                fontSize: 12,
                                cursor:
                                  (row.dataSource === "WHATSAPP" ||
                                    row.dataSource === "WEB") &&
                                  row?.whatsappImageDataSet?.length > 0
                                    ? "pointer"
                                    : "default",
                              }}
                              className="flex justify-center"
                              aria-describedby={id}
                              onClick={(e) => {
                                if (
                                  (row.dataSource === "WHATSAPP" ||
                                    row.dataSource === "WEB") &&
                                  row?.whatsappImageDataSet?.length > 0
                                ) {
                                  setSelectedUserData(row);
                                  handleDataSrcClick(e);
                                }
                              }}
                            >
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
                            <div style={{ fontSize: 12, width: 70 }}>
                              {row.valueTillDate ? row.valueTillDate : "-"}
                            </div>
                          </TableCell>
                          <TableCell align="center" style={{ padding: 3 }}>
                            <div
                              style={{
                                // width: 40,
                                fontSize: 12,
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                {row.lastDistanceCovered
                                  ? row.lastDistanceCovered.toFixed(2)
                                  : "0"}{" "}
                              </div>
                              {row.verificationImage ? (
                                <Tooltip
                                  title="verified"
                                  aria-label={row.toolTipMessage}
                                  placement="top"
                                >
                                  <img
                                    // title="Verified"
                                    src={row.verificationImage}
                                    style={{
                                      // marginLeft: -7,
                                      height: 15,
                                      width: 15,
                                    }}
                                  />
                                </Tooltip>
                              ) : (
                                ""
                              )}
                            </div>
                          </TableCell>
                          <TableCell align="center" style={{ padding: 0 }}>
                            <div style={{ fontSize: 12 }}>
                              {row.value ? row.value.toFixed(2) : "0"}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <div style={{ fontSize: 12 }}>
                              {row.averageDistanceCovered
                                ? row.averageDistanceCovered.toFixed(2)
                                : "0"}
                            </div>
                          </TableCell>
                          <TableCell align="center" style={{ padding: 0 }}>
                            <div style={{ fontSize: 12 }}>
                              {row.leadBy ? row.leadBy : ""}
                            </div>
                          </TableCell>
                          <TableCell align="center" style={{ padding: 0 }}>
                            <div style={{ fontSize: 12 }}>
                              {row.totalParticipationDays
                                ? row.totalParticipationDays
                                : "0"}
                            </div>
                          </TableCell>
                          <TableCell align="center" style={{ padding: 0 }}>
                            <div style={{ fontSize: 12 }}>
                              {row.scount
                                ? <img src={row.scount}  style={{
                                  width: 35,
                                  height: 35,
                                  marginLeft:14,
                                }}/>
                                : ""}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={pinActive ? 11 : 10}
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
                      {leaderboardList.message === "SUCCESS" ? (
                        "Data is not present"
                      ) : (
                        <NoData />
                      )}
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <TableDataSourceCarousel
        {...{
          id,
          open,
          anchorEl,
          handleClose,
          selectedUserData,
        }}
      >
        {open &&
          selectedUserData &&
          selectedUserData.whatsappImageDataSet.length !== 0 && (
            <ImageCarousel {...{ selectedUserData }} />
          )}
      </TableDataSourceCarousel>
      {dateRange && (
        <InfoDialog
          open={dateRange}
          onClose={() => {
            setDateRange(false);
            setStartDate(currentEvent.challengeStartDate.substring(0, 10));
            setEndDate(
              moment(today).format("YYYY-MM-DD") >
                currentEvent.challengeEndDate.substring(0, 10)
                ? currentEvent.challengeEndDate.substring(0, 10)
                : moment(today).format("YYYY-MM-DD")
            );
          }}
        >
          <CancelIcon
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              color: "#ef5350",
              cursor: "pointer",
            }}
            onClick={() => {
              setDateRange(false);
              setStartDate(currentEvent.challengeStartDate.substring(0, 10));
              setEndDate(
                moment(today).format("YYYY-MM-DD") >
                  currentEvent.challengeEndDate.substring(0, 10)
                  ? currentEvent.challengeEndDate.substring(0, 10)
                  : moment(today).format("YYYY-MM-DD")
              );
            }}
          />
          <div className="leaderBoard-modal-date mb-6">
            <div style={{ width: "38%", marginLeft: "20px" }}>
              <button
                style={{
                  backgroundColor: "#4d88ff",
                  color: "white",
                  width: "88%",
                  height: "29px",
                }}
                onClick={() => {
                  // setStartDate(
                  //   currentEvent.challengeStartDate.substring(0, 10)
                  // ),
                  //   setEndDate(
                  //     moment(today).format('YYYY-MM-DD') >
                  //       currentEvent.challengeEndDate.substring(0, 10)
                  //       ? currentEvent.challengeEndDate.substring(0, 10)
                  //       : moment(today).format('YYYY-MM-DD')
                  //   ),
                  handleChange(
                    currentEvent.challengeStartDate.substring(0, 10),
                    moment(today).format("YYYY-MM-DD") >
                      currentEvent.challengeEndDate.substring(0, 10)
                      ? currentEvent.challengeEndDate.substring(0, 10)
                      : moment(today).format("YYYY-MM-DD")
                  );
                }}
              >
                As On Date
              </button>
              <button
                style={{
                  backgroundColor: "#4d88ff",
                  color: "white",
                  width: "88%",
                  marginTop: "2%",
                  height: "29px",
                }}
                onClick={() => {
                  // setStartDate(moment(first).format('YYYY-MM-DD')),
                  //   setEndDate(moment(last).format('YYYY-MM-DD')),
                  handleChange(
                    moment(first).format("YYYY-MM-DD"),
                    moment(last).format("YYYY-MM-DD")
                  );
                }}
              >
                Current Week
              </button>
              <button
                style={{
                  backgroundColor: "#4d88ff",
                  color: "white",
                  width: "88%",
                  marginTop: "2%",
                  height: "29px",
                }}
                onClick={() => {
                  // setStartDate(moment(lastweekstart).format('YYYY-MM-DD')),
                  //   setEndDate(moment(lastweekend).format('YYYY-MM-DD')),
                  handleChange(
                    moment(lastweekstart).format("YYYY-MM-DD"),
                    moment(lastweekend).format("YYYY-MM-DD")
                  );
                }}
              >
                Last Week
              </button>
              <button
                style={{
                  backgroundColor: "#4d88ff",
                  color: "white",
                  width: "88%",
                  marginTop: "2%",
                  height: "29px",
                }}
                onClick={() => {
                  // setStartDate(`${month.substring(0, 7)}-01`),
                  //   setEndDate(moment(today).format('YYYY-MM-DD')),
                  handleChange(
                    `${month.substring(0, 7)}-01`,
                    moment(today).format("YYYY-MM-DD")
                  );
                }}
              >
                Current Month
              </button>
              <button
                style={{
                  backgroundColor: "#4d88ff",
                  color: "white",
                  width: "88%",
                  marginTop: "2%",
                  height: "29px",
                }}
                onClick={() => {
                  // setStartDate(moment(prevStartDate).format('YYYY-MM-DD')),
                  //   setEndDate(moment(preEndDate).format('YYYY-MM-DD')),
                  handleChange(
                    moment(prevStartDate).format("YYYY-MM-DD"),
                    moment(preEndDate).format("YYYY-MM-DD")
                  );
                }}
              >
                Last Month
              </button>
            </div>
            <div style={{ width: "60%" }}>
              <div style={{ marginLeft: "5px" }}>
                <label>Start Date</label>
                <br />
                <input
                  type="date"
                  style={{
                    background: "#f3f4f6",
                    padding: "6px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    width: "70%",
                  }}
                  placeholder="DD/MM/YYYY"
                  min={currentEvent.challengeStartDate.substring(0, 9)}
                  max={month}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div style={{ marginLeft: "5px", marginTop: "10px" }}>
                <label>End Date</label>
                <br />
                <input
                  type="date"
                  style={{
                    background: "#f3f4f6",
                    padding: "6px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    width: "70%",
                  }}
                  placeholder="DD/MM/YYYY"
                  min={currentEvent.challengeEndDate.substring(0, 9)}
                  max={month}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <button
                style={{
                  backgroundColor: "green",
                  color: "white",
                  marginLeft: "40%",
                  marginTop: "2%",
                }}
                className="px-2 rounded-full"
                onClick={() => handleChange(startDate, endDate)}
              >
                Submit
              </button>
            </div>
          </div>
        </InfoDialog>
      )}
    </div>
  );
}
