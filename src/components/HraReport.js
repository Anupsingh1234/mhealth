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
import { PrimaryButton } from "./Form";
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
import { FormatListBulletedRounded } from "@material-ui/icons";
import MenuItem from "@material-ui/core/MenuItem";
import NoData from './NoData'

const headCells = [
    {
      label: "S.No",
      id: "index",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Question",
  
      id: "question",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Option",
      id: "option",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Option Score",
      id: "optionScore",
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
  
export default function HraReport({
 hraModal,setHraModal
  }) 
  {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [getProgramData,setGetProgramData]=useState([])
    const [programUser,setProgramUser]=useState([])
    const [hraData,setHraData]=useState([])
    const [attendUserDetail,setAttendUserDetails]=useState([])
    const [programId,setProgramId]=useState("")
    const [userId1,setUserId1]=useState("")
    const [hraId,setHraId]=useState("")
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
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
    border:'2px outset black'
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
      const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
   
    const getCoachWiseProgram=()=>{
      
            const adminurl = `${urlPrefix}v1.0/coachWiseActivePrograms`
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
              }).then((res)=>{
                setGetProgramData(res.data.response.responseData)
              })}
              const getRegisterUserList=(id)=>{
               
                const adminurl = `${urlPrefix}v1.0/getProgramRegisteredUser?subEventId=${id}`
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
                  }).then((res)=>{
                    setProgramUser(res.data.response.responseData)
                  })
    }
    const getHraList=(id)=>{
      
        const adminurl = `${urlPrefix}v1.0/userAttemptHra?hraId=${id}&userId=${localStorage.getItem("userId")}`
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
          }).then((res)=>{
            setHraData(res.data.response.responseData)
            // gHraReportDeatil(e.target.value)
          })
}
const gHraReportDeatil=(id)=>{
      
    const adminurl = `${urlPrefix}v1.0/getUserHraReport?hraId=${id}&userId=${localStorage.getItem("userId")}`
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
      }).then((res)=>{
        setAttendUserDetails(res.data.response.responseData)
      })
}

    const handleClose=()=>{
        setHraModal(false)
    }
    useEffect(() => {
      getCoachWiseProgram()  ;
    }, []);
    useEffect(() => {
      if(programId){
        // getRegisterUserList()
        getRegisterUserList(programId)  ;
      setHraData([])
      setAttendUserDetails([])
      setUserId1(""),
      setHraId("")
      }
      }, [programId]);
      useEffect(() => {
        if(userId1){
          // getRegisterUserList()
          getHraList(userId1)
          setHraData([])
          setAttendUserDetails([])
          // setUserId1(""),
          setHraId("")
        }
        }, [userId1]);
        useEffect(() => {
          if(hraId){
           
           gHraReportDeatil(hraId)
        
          setAttendUserDetails([])
          }
          }, [hraId]);
  const modalBody = (
    <div
      style={{
        width: "90%",
        // position: 'fixed',
        transform: "translate(5%,6%)",
        height: "400px",
      }}
    > 
      <Paper>
        <div>
          <TableContainer>
          <div
                  className="main_div"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      marginTop: 50,
                      display: "flex",
                      justifyContent: "space-around",
                      fontSize: 12,
                      height: "10vh",
                      // position: "absolute"
                    }}
                  >
                    {/* <Performance /> */}
                    <div
                      className="select_date"
                      style={{
                        maxWidth: "250px",
                        // overflowX: "scroll",
                        justifyContent: "center",
                        alignItems: "center",
                        top: 20,
                      }}
                    >
                      <fieldset>
                        <legend>Select Program:</legend>
                        <form>
                          <Select
                            style={{ width: "250px" }}
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            // open={open}
                            // onClose={handleClose}
                            // onOpen={handleOpen}
                            // value={age}
                            onChange={(e)=>setProgramId(e.target.value)}
                          >
                            {getProgramData.map((curelem, index) => {
                              return (
                                <MenuItem
                                  style={{ fontSize: 12 }}
                                  value={curelem.id}
                                >
                                  {curelem.eventName}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </form>
                      </fieldset>
                    </div>

                    <div
                      className="select_date"
                      style={{
                        maxWidth: "250px",
                        justifyContent: "center",
                        alignItems: "center",
                        top: 20,
                      }}
                    >
                      <fieldset>
                        <legend>Select User</legend>
                        <form>
                          <Select
                            style={{ width: "250px" }}
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            // open={open}
                            // onClose={handleClose}
                            // onOpen={handleOpen}
                            // value={age}
                            onChange={(e)=>setUserId1(e.target.value)}
                          >
                            {programUser &&
                              programUser.map((curelem, index) => {
                                return (
                                  <MenuItem
                                    style={{ fontSize: 12 }}
                                    value={curelem.id}
                                  >
                                    {curelem.firstName}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        </form>
                      </fieldset>
                    </div>
                    <div
                      className="select_date"
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        top: 20,
                      }}
                    >
                      <fieldset>
                        <legend>Select Hra</legend>
                        <form>
                          <Select
                            style={{ width: "250px" }}
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            // open={open}
                            // onClose={handleClose}
                            // onOpen={handleOpen}
                            value={hraId}
                            onChange={(e)=>setHraId(e.target.value)}
                          >
                            {hraData &&
                              hraData.map((curelem, index) => {
                                return (
                                  <MenuItem
                                    style={{ fontSize: 12 }}
                                    value={curelem.id}
                                  >
                                    {curelem.assesmentName}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        </form>
                      </fieldset>
                    </div>
                  </div>
                  {/* <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PrimaryButton
                      mini
                      className="w-24 mx-auto"
                    //   onClick={getData}
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
                      {/* {resMessage}{" "} 
                    </span>
                  </div> */}
                </div>
                {attendUserDetail.hraScoreCard?(
                <div style={{marginLeft:'30px',fontSize:'15px',fontWeight:'800'}}>Hra Name : {attendUserDetail.hraScoreCard.assesmentName}</div>
                ):''}
                <div   className="member"  style={{ width: "96%",height:'290px', overflowX: "auto",scrollBehavior: "smooth"}}>
                  {/* <Paper className={classes.paper}> */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    {/* <Tooltip title="Export data">
                      <CSVLink data={datas} headers={headers} separator={','}>
                        <SystemUpdateAltIcon />
                      </CSVLink>
                    </Tooltip> */}
                    <div className="d-flex a-i-center">
                      {attendUserDetail.hrQueAns && attendUserDetail.hrQueAns.length > 0 ? (
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 50, 75, 100]}
                          component="div"
                          count={attendUserDetail.hrQueAns && attendUserDetail.hrQueAns.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onChangePage={handleChangePage}
                          onChangeRowsPerPage={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                        />
                      ) : (
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 50, 75, 100]}
                          component="div"
                          count={0}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onChangePage={handleChangePage}
                          onChangeRowsPerPage={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                        />
                      )}
                    </div>
                  </div>
                  {/* <Modal open={modal} /> */}

                  <div  className="member" style={{ height: "200px",width:'97%', marginLeft: "20px",  overflow: "auto", scrollBehavior: "smooth"  }}>
                   

                  {attendUserDetail.hrQueAns && attendUserDetail.hrQueAns.length > 0 ? (
                    <div style={{ padding: 20}}>
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
                          {attendUserDetail.hrQueAns &&
                            stableSort(attendUserDetail.hrQueAns, getComparator(order, orderBy))
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
                                            width: "300px",
                                            display: "block",
                                            overflow: "hidden",
                                            fontSize: 12,
                                          }}
                                        >
                                          {" "}
                                          <span style={{ fontSize: 12 }}>
                                            {item.question
                                              ? item.question
                                              : "  -     "}
                                          </span>{" "}
                                        </p>{" "}
                                      </TableCell>
                                      <TableCell align="left">
                                        {" "}
                                        <p
                                          style={{
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                            width: "300px",
                                            display: "block",
                                            overflow: "hidden",
                                            fontSize: 12,
                                          }}
                                        >
                                          <span style={{ fontSize: 12 }}>
                                            {item.option
                                              ? item.option
                                              : "  -     "}
                                          </span>{" "}
                                        </p>{" "}
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        style={{ fontSize: 12 }}
                                      >
                                       
                                        {item.optionScore}
                                      </TableCell>
                                     
                                     
                                    </TableRow>
                                  </>
                                );
                              })}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          height: 100,
                          padding: "5px",
                          marginTop: 30,
                          width: "200px",
                          display: "flex",
                          flexDirection: "column",
                          fontSize: 12,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft:'40%'
                        }}
                        className=""
                      >
                        {" "}
                        {/* <img
                          style={{ width: 200, height: 200 }}
                          src="https://w21.mhealth.ai/static/media/dataSource.11fba1d5.svg"
                        /> */}
                        <NoData/>
                     
                      </div>{" "}
                    </>
                  )}
                   </div>
                </div>
                {attendUserDetail.hraScoreCard?(<>
                <div style={{marginLeft:'20px',fontWeight:'800px'}}>Total Score : {attendUserDetail.hraScoreCard.totalScore}</div>
   
                <div className="member" style={{width:'97%', overflowX: "auto",scrollBehavior: "smooth",minHeight:'50px',border:'2px outset black',marginLeft:'20px',marginBottom:'10px',textAlign:'justify',maxHeight:'100px'}}><span style={{fontWeight:'800px',fontSize:'20px',fontFamily:'sans-serif'}}><u>Assessment Report :</u></span>{attendUserDetail.hraScoreCard.description} <br/> {attendUserDetail.hraScoreCard.recommedations}</div>
                </> ):''}
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
        open={hraModal}
        onClose={() => {
          handleClose();
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        disableAutoFocus
      >
        <div style={{ outline: "none" }}>{modalBody}</div>
      </Modal>
      
    </div>
  );
}
