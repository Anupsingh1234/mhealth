import React, { useState, useEffect } from "react";
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
import Paper from "@material-ui/core/Paper";
import Modal from "@material-ui/core/Modal";
import CancelIcon from "@material-ui/icons/Cancel";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import Message from "antd-message";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import axios from "axios";

import { urlPrefix, secretToken } from "../services/apicollection";
import InfoDialog from "./Utility/InfoDialog";
import message from "antd-message";
import { TextField } from "@material-ui/core";
import { EditAttributesSharp } from "@material-ui/icons";
function getModalStyle() {
  const top = "80%";
  const left = "65%";
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    marginTop: "2%",
    marginLeft: "5%",
  };
}
function useWindowSize() {
  const [size, setSize] = useState([window.innerHeight, window.innerWidth]);
  useEffect(() => {
    const handleResize = () => {
      setSize([window.innerHeight, window.innerWidth]);
    };
    window.addEventListener("resize", handleResize);
  }, []);
  return size;
}
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
    label: "Option1",
    id: "option1",
    numeric: false,
    disablePadding: true,
  },
  {
    label: "Option2",
    id: "option2",
    numeric: false,
    disablePadding: true,
  },
  {
    label: "Option3",
    id: "option3",
    numeric: false,
    disablePadding: true,
  },
  {
    label: "Option4",
    id: "option4",
    numeric: false,
    disablePadding: true,
  },

  {
    label: "Update",
    //  id: 'link',
    // numeric: false,
    // disablePadding: true,
  },
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
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
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

export default function EventInfoModal({
  modalView,
  setModalView,
  // eventId,
  challenge,
  type,
  dat,

  setActivityModalView = () => {},
}) {
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [activeStep, setActiveStep] = useState(1);
  const [height1, width1] = useWindowSize();
  const handleClose = () => {
    setModalView(false);
  };
  const [getQuestion, setGetQuestion] = useState();
  const ques = () => {
    const adminurl = `${urlPrefix}v1.0/getAllQuestionByQuizId?idMstQuiz=${QuizId}`;
    console.log(adminurl);
    axios
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
        setGetQuestion(res.data.response.responseData);
      });
  };
  useEffect(() => {
    ques();
    console.log("APi Called");
  }, []);
  const [errorobj, setErrorObj] = useState();
  const [question1, setQuestion] = useState({
    question: "",
    questionHint: "",
    answerDescription: "",
    correctAns: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
  });
  const [Edit, setEdit] = useState(question1);
  const questionhandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQuestion((values) => ({ ...values, [name]: value }));
    setErrorObj((values) => ({ ...values, [name]: value }));
  };
  const questionSubmit = (e) => {
    e.preventDefault();
    setModalView(true);
    let payload = {};
    payload = {
      id: null,
      idMstQuiz: QuizId,
      question: question1.question,
      questionHint: question1.questionHint,
      answerDescription: question1.answerDescription,
      correctAns: question1.correctAns,
      option1: question1.option1,
      option2: question1.option2,
      option3: question1.option3,
      option4: question1.option4,
    };
    console.log(payload, "payload");
    if (
      question1.question !== "" &&
      question1.answerDescription !== "" &&
      question1.correctAns !== "" &&
      question1.option1 !== "" &&
      question1.option2 !== ""
    ) {
      const adminurl = `${urlPrefix}v1.0/createOrUpdateQuestion`;
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
          setQuestion({
            question: "",
            questionHint: "",
            answerDescription: "",
            correctAns: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
          });

          if (res.data.mhealthResponseMessage === "SUCCESS") {
            console.log(res.data.response.responseMessage);
            Message.success(res.data.response.responseMessage);
            // setResponseMessage(res.data.response.responseMessage);
          }
          // setModalView(false)
          //  setImage('image');
          ques();
        });
    } else {
      Message.error("Please fill all Mandatory fields Carefully!");
      setErrorObj(question1);
    }
  };

  //   const [errorObj, setErrorObj] = useState({});
  const QuizId = localStorage.getItem("Idquiz");

  console.log(Edit, "edit");
  console.log(challenge);
  // stableSort(getsocialpost, getComparator(order, orderBy));

  const edithandler = (event) => {
    //  console.log(id)

    const { name, value } = event.target;

    setEdit((prestate) => {
      console.warn(prestate);
      return {
        ...prestate,
        [name]: value,
      };
    });
  };

  const questionUpdate = (e) => {
    e.preventDefault();
    let payload = {};
    payload = {
      id: Edit.id,
      idMstQuiz: QuizId,
      question: Edit.question,
      questionHint: Edit.questionHint,
      answerDescription: Edit.answerDescription,
      correctAns: Edit.correctAns,
      option1: Edit.option1,
      option2: Edit.option2,
      option3: Edit.option3,
      option4: Edit.option4,
    };
    // if (
    //   Edit.postTitle !== '' &&
    //   Edit.medium !== '' &&
    //   Edit.shortNote !== '' &&
    //   Edit.link !== ''
    // ) {
    const adminurl = `${urlPrefix}v1.0/createOrUpdateQuestion`;
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
        //   setEdit({
        //     eventId: localStorage.getItem('selectEvent'),
        //     postTitle: '',
        //     medium: '',
        //     shortNote: '',
        //     link: '',
        //   });
        if (res.data.mhealthResponseMessage === "SUCCESS") {
          console.log(res.data.response.responseMessage);
          Message.success(res.data.response.responseMessage);
          setEditResponseMessage(res.data.response.responseMessage);
        }
        setImage("question");
        ques();
      });
  };

  const [image, setImage] = useState("question");
  const handleUpdate = (e) => {};
  console.log(question1);
  useEffect(() => {
    //  handleSubmit();
  }, []);
  useEffect(() => {
    setPage(0);
    setOrder("asc");
    setOrderBy("");

    setRowsPerPage(5);
  }, []);
  const [addupdatePost, setAddUpdatePost] = useState("addpost");
  const [responsemessage, setResponseMessage] = useState("");
  const [editresponsemessage, setEditResponseMessage] = useState("");
  console.log(addupdatePost);
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

  const [getsocialpost, setGetSocialPost] = useState([]);
  const editVal = (id) => {
    var marvelHeroes = getQuestion.filter(function (hero) {
      const x = hero.id == id;
      return x;
    });

    setEdit(marvelHeroes && marvelHeroes[0], "marvels");
  };

  const modalBody = (
    <div style={modalStyle} className={classes.paper}>
      <div
      // style={{
      //   width: '90%',
      //   // position: 'fixed',
      //   transform: 'translate(5%,2%)',
      //   // height: '300px',
      //   overflowY: 'scroll',
      //   maxHeight: '1800px',
      // }}
      >
        {/* <Paper> */}
        {/* {image === 'image' ? (
           <>
             <div
               className="heading"
               style={{
                 marginTop: 0,
                 fontSize: 18,
                 display: 'flex',
                 alignItems: 'center',
               }}
             >
               Create Question {'>'}
               <Stepper activeStep={activeStep} style={{padding: 0}}>
                 <Step
                   key={2}
                   onClick={() => setActiveStep(1)}
                   style={{cursor: 'pointer'}}
                 >
                   <StepLabel>Questions</StepLabel>
                 </Step>
                 <Step
                   // key={2}
                   key={1}
                   onClick={() => setActiveStep(1)}
                   style={{cursor: 'pointer'}}
                 >
                   <StepLabel>Upload Image</StepLabel>
                 </Step>
               </Stepper>
             </div>
             <div
               style={{
                 display: 'flex',
                 flexDirection: 'column',
                 marginRight: 20,
               }}
             >
               <label
                 style={{display: 'flex', justifyContent: 'space-between'}}
               >
                 Event Image{' '}
                 {/* {mediaObj.eventImage && (
                  <span
                    style={{cursor: 'pointer', color: 'red'}}
                    onClick={() => {
                      setMediaObj({...mediaObj, eventImage: undefined});
                    }}
                  >
                    Delete
                  </span>
                )} 
               </label>
               {/* {errorObj.eventImage && (
                <p className="error-text">Please Upload</p>
              )} 

               <div
                 className="create-event-logo"
                 style={{border: '1px solid #eee'}}
               >
                 <PlusCircle
                   size={30}
                   style={{marginRight: 3, cursor: 'pointer'}}
                   // onClick={() => eventImageInputRef.current.click()}
                 />
               </div>

               <input
                 type="file"
                 accept="image/*"
                 // ref={eventImageInputRef}
                 style={{display: 'none'}}
                 // onChange={(event) => {
                 //   setMediaObj({
                 //     ...mediaObj,
                 //     eventImage: event.target.files[0],
                 //   });
                 // }}
               />
             </div>
           </>
         ) : (
           ''
         )} */}
        {image === "question" ? (
          <>
            <div
              className="heading"
              style={{
                marginTop: 0,
                fontSize: 18,
                display: "flex",
                alignItems: "center",
              }}
            >
              Create Question {">"}
              <Stepper activeStep={activeStep} style={{ padding: 0 }}>
                <Step
                  key={2}
                  onClick={() => setActiveStep(1)}
                  style={{ cursor: "pointer" }}
                >
                  <StepLabel>Questions</StepLabel>
                </Step>
                <Step
                  // key={2}
                  key={1}
                  onClick={() => setActiveStep(1)}
                  style={{ cursor: "pointer" }}
                >
                  <StepLabel>Upload Image</StepLabel>
                </Step>
              </Stepper>
            </div>
            <CancelIcon
              style={{
                // position: 'relative',
                // top: 50,
                // right: 10,
                color: "#ef5350",
                cursor: "pointer",
                marginLeft: "97%",
                marginTop: "-10%",
              }}
              onClick={() => handleClose()}
            />

            <center>
              <u>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "200px",
                    // marginTop: '-20px',
                  }}
                >
                  Add Question
                </p>
              </u>
            </center>
            <div></div>
            <div
              style={{
                marginLeft: "20px",
                height: "500px",
                overflowX: "hidden",
              }}
            >
              <div style={{ display: "flex" }}>
                <div style={{ width: "50%" }}>
                  <label style={{ fontSize: 12 }}>
                    Question
                    {errorobj !== undefined && (
                      <>
                        {errorobj.question == "" ? (
                          <p
                            style={{
                              color: "red",
                              marginLeft: "11%",
                              marginTop: "-3%",
                            }}
                          >
                            Required
                          </p>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </label>
                  {/* <br /> */}
                  <textarea
                    autofocus="autofocus"
                    style={{
                      background: "#f3f4f6",
                      padding: "10px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      width: "90%",
                      border: "1px solid black",
                      height: "50px",
                    }}
                    type="text"
                    value={question1.question}
                    onChange={questionhandler}
                    name="question"
                    placeholder="Enter Question"
                  />
                </div>
                {/* <div style={{width: '50%', marginTop: '4%', display: 'flex'}}> */}
                <div style={{ marginTop: "0%", width: "40%" }}>
                  <label style={{ fontSize: 12 }}>
                    Option-1
                    {errorobj !== undefined && (
                      <>
                        {errorobj.option1 == "" ? (
                          <p
                            style={{
                              color: "red",
                              marginLeft: "11%",
                              marginTop: "-3%",
                            }}
                          >
                            Required
                          </p>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </label>

                  <textarea
                    autofocus="autofocus"
                    style={{
                      background: "#f3f4f6",
                      padding: "10px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      width: "100%",
                      border: "1px solid black",
                    }}
                    type="text"
                    value={question1.option1}
                    onChange={questionhandler}
                    name="option1"
                    placeholder="Option - 1"
                  />
                </div>{" "}
                <div
                  style={{
                    marginLeft: "5%",
                    marginTop: "-0%",
                    width: "10%",
                  }}
                >
                  {errorobj !== undefined && (
                    <>
                      {errorobj.correctAns == "" ? (
                        <p className="error-text">Required</p>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                  <label>
                    <p style={{ marginLeft: "0%", fontSize: 12 }}>
                      Correct Ans
                    </p>
                  </label>
                  <input
                    type="radio"
                    style={{
                      cursor: "pointer",
                      height: "20px",
                      width: "20px",
                      marginLeft: "20%",
                    }}
                    // id="1"
                    name="correctAns"
                    onChange={questionhandler}
                    value="1"
                  />
                </div>
              </div>

              <div style={{ display: "flex" }}>
                <div style={{ width: "50%", marginTop: "0%" }}>
                  <label style={{ fontSize: 12 }}>Question Hint</label>
                  <br />
                  <textarea
                    autofocus="autofocus"
                    style={{
                      background: "#f3f4f6",
                      padding: "10px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      width: "90%",
                      height: "20px",
                      border: "1px solid black",
                    }}
                    type="text"
                    value={question1.questionHint}
                    onChange={questionhandler}
                    name="questionHint"
                    placeholder="Question Hint"
                  />
                </div>

                <div style={{ width: "40%", marginTop: "-2%" }}>
                  <label style={{ fontSize: 12 }}>
                    Option-2
                    {errorobj !== undefined && (
                      <>
                        {errorobj.option2 == "" ? (
                          <p
                            style={{
                              color: "red",
                              marginLeft: "11%",
                              marginTop: "-3%",
                            }}
                          >
                            Required
                          </p>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </label>

                  <textarea
                    autofocus="autofocus"
                    style={{
                      background: "#f3f4f6",
                      padding: "10px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      width: "100%",
                      border: "1px solid black",
                    }}
                    type="text"
                    value={question1.option2}
                    onChange={questionhandler}
                    name="option2"
                    placeholder="Option - 2"
                  />
                </div>
                <div style={{ marginLeft: "5%", width: "10%" }}>
                  <input
                    type="radio"
                    style={{
                      cursor: "pointer",
                      height: "20px",
                      width: "20px",
                      marginLeft: "20%",
                    }}
                    value="2"
                    onChange={questionhandler}
                    name="correctAns"
                  />
                </div>
              </div>
              {/* </div> */}
              <div style={{ display: "flex", marginTop: "0%" }}>
                <div style={{ width: "50%" }}>
                  <label style={{ fontSize: 12, display: "flex" }}>
                    Question Description{" "}
                    {errorobj !== undefined && (
                      <>
                        {errorobj.answerDescription == "" ? (
                          <p
                            style={{
                              color: "red",
                              marginLeft: "2%",
                              marginTop: "0%",
                            }}
                          >
                            Required
                          </p>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </label>
                  {/* <br /> */}
                  <textarea
                    autofocus="autofocus"
                    style={{
                      background: "#f3f4f6",
                      padding: "10px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      width: "90%",
                      border: "1px solid black",
                      height: "80px",
                    }}
                    type="date"
                    value={question1.answerDescription}
                    onChange={questionhandler}
                    name="answerDescription"
                    placeholder="Something write about your Question...."
                  />
                </div>

                <div style={{ width: "40%", marginTop: "-1%" }}>
                  {" "}
                  <label style={{ fontSize: 12 }}>Option-3</label>
                  <br />
                  <textarea
                    autofocus="autofocus"
                    style={{
                      background: "#f3f4f6",
                      padding: "10px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      width: "100%",
                      border: "1px solid black",
                    }}
                    type="text"
                    value={question1.option3}
                    onChange={questionhandler}
                    name="option3"
                    placeholder="Option - 3"
                  />
                </div>
                <div style={{ width: "10%", marginLeft: "5%" }}>
                  <input
                    type="radio"
                    style={{
                      cursor: "pointer",
                      height: "20px",
                      width: "20px",
                      marginLeft: "20%",
                    }}
                    value="3"
                    onChange={questionhandler}
                    name="correctAns"
                  />
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div style={{ width: "50%" }}>
                  {/* <label style={{fontSize: 12}}>Question</label>
              <br />
              <input
                autofocus="autofocus"
                style={{
                  background: '#f3f4f6',
                  padding: '10px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  width: '90%',
                  border: '1px solid black',
                }}
                type="date"
                value={quiz.quizStartDate}
                onChange={inputsHandler}
                name="quizStartDate"
              /> */}
                </div>

                <div style={{ width: "40%", marginTop: "-5%" }}>
                  {" "}
                  <label style={{ fontSize: 12 }}>Option-4</label>
                  <br />
                  <textarea
                    autofocus="autofocus"
                    style={{
                      background: "#f3f4f6",
                      padding: "10px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      width: "100%",
                      border: "1px solid black",
                    }}
                    type="text"
                    value={question1.option4}
                    onChange={questionhandler}
                    name="option4"
                    placeholder="Option - 4"
                  />
                </div>
                <div
                  style={{ width: "10%", marginLeft: "5%", marginTop: "-4%" }}
                >
                  <input
                    type="radio"
                    style={{
                      cursor: "pointer",
                      height: "20px",
                      width: "20px",
                      marginLeft: "20%",
                    }}
                    value="4"
                    onChange={questionhandler}
                    name="correctAns"
                  />
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div style={{ width: "50%" }}>
                  {/* <label style={{fontSize: 12}}>Question</label>
              <br />
              <input
                autofocus="autofocus"
                style={{
                  background: '#f3f4f6',
                  padding: '10px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  width: '90%',
                  border: '1px solid black',
                }}
                type="date"
                value={quiz.quizStartDate}
                onChange={inputsHandler}
                name="quizStartDate"
              /> */}
                </div>

                <div style={{ width: "40%" }}></div>
                <div style={{ width: "10%" }}>
                  <button
                    className="is-success"
                    // onClick={handleSubmit}
                    style={{
                      marginTop: 0,
                      width: 100,
                      height: 32,
                      // marginLeft: 20,
                      marginLeft: "-20px",
                    }}
                    onClick={questionSubmit}
                  >
                    Save Question
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}

        {image === "Edit" ? (
          <>
            <div
              className="heading"
              style={{
                marginTop: 0,
                fontSize: 18,
                display: "flex",
                alignItems: "center",
              }}
            >
              Create Question {">"}
              <Stepper activeStep={activeStep} style={{ padding: 0 }}>
                <Step
                  key={2}
                  onClick={() => setActiveStep(1)}
                  style={{ cursor: "pointer" }}
                >
                  <StepLabel>Questions</StepLabel>
                </Step>
                <Step
                  // key={2}
                  key={1}
                  onClick={() => setActiveStep(1)}
                  style={{ cursor: "pointer" }}
                >
                  <StepLabel>Upload Image</StepLabel>
                </Step>
              </Stepper>
            </div>
            <CancelIcon
              style={{
                // position: 'relative',
                // top: 50,
                // right: 10,
                color: "#ef5350",
                cursor: "pointer",
                marginLeft: "97%",
                marginTop: "-10%",
              }}
              onClick={() => handleClose()}
            />

            <center>
              <u>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "200px",
                    // marginTop: '-20px',
                  }}
                >
                  Add Question
                </p>
              </u>
            </center>
            <div></div>
            <div
              style={{
                marginLeft: "20px",
                height: "500px",
                overflowX: "hidden",
              }}
            >
              <div style={{ display: "flex" }}>
                <div style={{ width: "50%" }}>
                  <label style={{ fontSize: 12 }}>Question</label>
                  <br />
                  <textarea
                    autofocus="autofocus"
                    style={{
                      background: "#f3f4f6",
                      padding: "10px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      width: "90%",
                      border: "1px solid black",
                      height: "50px",
                    }}
                    type="text"
                    value={Edit.question}
                    onChange={edithandler}
                    name="question"
                    placeholder="Enter Question"
                  />
                </div>
                {/* <div style={{width: '50%', marginTop: '4%', display: 'flex'}}> */}
                <div style={{ marginTop: "0%", width: "40%" }}>
                  <label style={{ fontSize: 12 }}>Option-1</label>
                  <br />

                  <textarea
                    autofocus="autofocus"
                    style={{
                      background: "#f3f4f6",
                      padding: "10px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      width: "100%",
                      border: "1px solid black",
                    }}
                    type="text"
                    value={Edit.option1}
                    onChange={edithandler}
                    name="option1"
                    placeholder="Option - 1"
                  />
                </div>{" "}
                <div
                  style={{
                    marginLeft: "5%",
                    marginTop: "-0%",
                    width: "10%",
                  }}
                >
                  <label>
                    <p style={{ marginLeft: "0%", fontSize: 12 }}>
                      Correct Ans
                    </p>
                  </label>
                  <input
                    type="radio"
                    style={{
                      cursor: "pointer",
                      height: "20px",
                      width: "20px",
                      marginLeft: "20%",
                    }}
                    // id="1"
                    name="correctAns"
                    onChange={edithandler}
                    value="1"
                  />
                </div>
              </div>

              <div style={{ display: "flex" }}>
                <div style={{ width: "50%", marginTop: "0%" }}>
                  <label style={{ fontSize: 12 }}>Question Hint</label>
                  <br />
                  <textarea
                    autofocus="autofocus"
                    style={{
                      background: "#f3f4f6",
                      padding: "10px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      width: "90%",
                      height: "20px",
                      border: "1px solid black",
                    }}
                    type="text"
                    value={Edit.questionHint}
                    onChange={edithandler}
                    name="questionHint"
                    placeholder="Question Hint"
                  />
                </div>

                <div style={{ width: "40%", marginTop: "-2%" }}>
                  <label style={{ fontSize: 12 }}>Option-2</label>
                  <br />

                  <textarea
                    autofocus="autofocus"
                    style={{
                      background: "#f3f4f6",
                      padding: "10px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      width: "100%",
                      border: "1px solid black",
                    }}
                    type="text"
                    value={Edit.option2}
                    onChange={edithandler}
                    name="option2"
                    placeholder="Option - 2"
                  />
                </div>
                <div style={{ marginLeft: "5%", width: "10%" }}>
                  <input
                    type="radio"
                    style={{
                      cursor: "pointer",
                      height: "20px",
                      width: "20px",
                      marginLeft: "20%",
                    }}
                    value="2"
                    onChange={edithandler}
                    name="correctAns"
                  />
                </div>
              </div>
              {/* </div> */}
              <div style={{ display: "flex", marginTop: "0%" }}>
                <div style={{ width: "50%" }}>
                  <label style={{ fontSize: 12 }}>Question Description</label>
                  <br />
                  <textarea
                    autofocus="autofocus"
                    style={{
                      background: "#f3f4f6",
                      padding: "10px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      width: "90%",
                      border: "1px solid black",
                      height: "80px",
                    }}
                    type="date"
                    value={Edit.answerDescription}
                    onChange={edithandler}
                    name="answerDescription"
                    placeholder="Something write about your Question...."
                  />
                </div>

                <div style={{ width: "40%", marginTop: "-2%" }}>
                  {" "}
                  <label style={{ fontSize: 12 }}>Option-3</label>
                  <br />
                  <textarea
                    autofocus="autofocus"
                    style={{
                      background: "#f3f4f6",
                      padding: "10px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      width: "100%",
                      border: "1px solid black",
                    }}
                    type="text"
                    value={Edit.option3}
                    onChange={edithandler}
                    name="option3"
                    placeholder="Option - 3"
                  />
                </div>
                <div style={{ width: "10%", marginLeft: "5%" }}>
                  <input
                    type="radio"
                    style={{
                      cursor: "pointer",
                      height: "20px",
                      width: "20px",
                      marginLeft: "20%",
                    }}
                    value="3"
                    onChange={edithandler}
                    name="correctAns"
                  />
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div style={{ width: "50%" }}>
                  {/* <label style={{fontSize: 12}}>Question</label>
              <br />
              <input
                autofocus="autofocus"
                style={{
                  background: '#f3f4f6',
                  padding: '10px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  width: '90%',
                  border: '1px solid black',
                }}
                type="date"
                value={quiz.quizStartDate}
                onChange={inputsHandler}
                name="quizStartDate"
              /> */}
                </div>

                <div style={{ width: "40%", marginTop: "-6%" }}>
                  {" "}
                  <label style={{ fontSize: 12 }}>Option-4</label>
                  <br />
                  <textarea
                    autofocus="autofocus"
                    style={{
                      background: "#f3f4f6",
                      padding: "10px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      width: "100%",
                      border: "1px solid black",
                    }}
                    type="text"
                    value={Edit.option4}
                    onChange={edithandler}
                    name="option4"
                    placeholder="Option - 4"
                  />
                </div>
                <div
                  style={{ width: "10%", marginLeft: "5%", marginTop: "-4%" }}
                >
                  <input
                    type="radio"
                    style={{
                      cursor: "pointer",
                      height: "20px",
                      width: "20px",
                      marginLeft: "20%",
                    }}
                    value="4"
                    onChange={edithandler}
                    name="correctAns"
                  />
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div style={{ width: "50%" }}>
                  {/* <label style={{fontSize: 12}}>Question</label>
              <br />
              <input
                autofocus="autofocus"
                style={{
                  background: '#f3f4f6',
                  padding: '10px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  width: '90%',
                  border: '1px solid black',
                }}
                type="date"
                value={quiz.quizStartDate}
                onChange={inputsHandler}
                name="quizStartDate"
              /> */}
                </div>

                <div style={{ width: "40%" }}></div>
                <div style={{ width: "10%" }}>
                  <button
                    className="is-success"
                    // onClick={handleSubmit}
                    style={{
                      marginTop: 0,
                      width: 100,
                      height: 32,
                      // marginLeft: 20,
                      marginLeft: "-20px",
                    }}
                    onClick={questionUpdate}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}

        <div
          style={{
            //  minWidth: '500px',
            //  height: '400px',
            marginTop: "-10%",
            //  overflowX: 'auto',
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <div className="d-flex a-i-center">
              {getQuestion && getQuestion.length > 0 ? (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={getQuestion && getQuestion.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              ) : (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
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

          <div style={{}}></div>
          <Paper>
            {getQuestion && getQuestion.length > 0 ? (
              <div style={{ padding: 20 }}>
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
                    {getQuestion &&
                      stableSort(getQuestion, getComparator(order, orderBy))
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
                                <TableCell
                                  align="left"
                                  style={{ fontSize: 12 }}
                                >
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
                                    {item.option1 ? item.option1 : "  -     "}
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
                                      width: "150px",
                                      display: "block",
                                      overflow: "hidden",
                                      fontSize: 12,
                                    }}
                                  >
                                    {item.option2 ? item.option2 : "  -     "}
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
                                      width: "150px",
                                      display: "block",
                                      overflow: "hidden",
                                      fontSize: 12,
                                    }}
                                  >
                                    {item.option3 ? item.option3 : "  -     "}
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
                                      width: "150px",
                                      display: "block",
                                      overflow: "hidden",
                                      fontSize: 12,
                                    }}
                                  >
                                    {item.option4 ? item.option4 : "  -     "}
                                  </p>
                                </TableCell>
                                <TableCell
                                  align="center"
                                  style={{ fontSize: 12 }}
                                >
                                  <button
                                    className="is-success"
                                    // onClick={setModal(true)}
                                    onClick={() => {
                                      editVal(item.id), setImage("Edit");
                                    }}
                                    style={{
                                      marginTop: 10,
                                      width: 80,
                                      height: 20,
                                      // marginLeft: 20,
                                    }}
                                  >
                                    Edit
                                  </button>
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
                    height: 250,
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
          </Paper>
        </div>

        {/* </Paper> */}
      </div>
    </div>
  );
  //    const handleClose = () => {
  //      setModalView(false);
  //    };

  return (
    <div>
      <Modal
        open={modalView}
        onClose={() => {
          handleClose();
        }}
        style={{ overflowY: "auto" }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        disableAutoFocus
      >
        <div style={{ outline: "none" }}>{modalBody}</div>
      </Modal>
    </div>
  );
}
