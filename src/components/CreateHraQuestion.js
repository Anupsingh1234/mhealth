import React, { useState, useEffect, useContext } from "react";
import TopUserDetails from "./TopUserDetails";
import { lighten, useTheme } from "@material-ui/core/styles";
import Navbar from "./Navbar";
import QuestionModal from "./QuestionModal";
import ThemeContext from "../context/ThemeContext";
import Message from "antd-message";
import { PlusCircle, Copy } from "react-feather";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Modal from "@material-ui/core/Modal";
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
import { makeStyles } from "@material-ui/core/styles";
import {
  urlPrefix,
  secretToken,
  getSubEvent,
  zoomreport,
} from "../services/apicollection";
import axios from "axios";
import InfoDialog from "./Utility/InfoDialog";
import { PrimaryButton } from "./Form";
// import FormItem from 'antd/lib/form/FormItem';
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import { Assessment } from "@material-ui/icons";
import NoData from "./NoData";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CreateAssisment = () => {
  // const [modalStyle] = React.useState(getModalStyle);
  const eventImageInputRef = React.createRef();
  const { theme } = useContext(ThemeContext);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [duplicateModal, setDuplicateModal] = useState(false);
  const [addId, setaddId] = useState();
  const [errorobj, setErrorObj] = useState();
  const [errorobj1, setErrorObj1] = useState();
  const [imageData, setImageData] = useState({
    image: "",
    image_obj: "",
  });
  const [imageModal, setImageModal] = useState(false);
  const [optionModal, setOptionModal] = useState(false);
  const [optionType, setOptionType] = useState();
  const [questionid, setQuestionId] = useState("");
  const [imgId, setImgId] = useState("");
  console.log(addId);
  const [duplicate, setDuplicate] = useState({
    eventId: "",
    fromEventId: "",
    quizId: "",
  });
  console.log(theme, "duplicate");
  const handleDuplicate = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setDuplicate((values) => ({ ...values, [name]: value }));
    setErrorObj((values) => ({ ...values, [name]: value }));
  };
  function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
    // if (radioValue === 'Daily') {
    return (
      <TableHead>
        <TableRow>
          {teamHeads.map((headCell) => (
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

  // const useStyles1 = makeStyles((theme) => ({
  //   root: {
  //     flexShrink: 0,
  //     marginLeft: theme.spacing(2.5),
  //   },
  // }));

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

  const teamHeads = [
    {
      label: "S.no",
      id: "s_no",
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
      label: "Answer Type",
      id: "ansType",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Description",
      id: "queDescription",
      numeric: false,
      disablePadding: true,
    },

    {
      label: "Edit",
      // id: 'durationInTime',
      numeric: false,
      disablePadding: true,
    },
  ];

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
      // maxHeight: 1200,
      marginLeft: "195px",
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

  const classes = useStyles();

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
  const evntiid = (id) => {
    setEventid(id);
  };
  const saveDuplicate = () => {
    if (
      duplicate.eventId !== "" &&
      duplicate.fromEventId !== "" &&
      duplicate.quizId
    ) {
      const adminurl = `${urlPrefix}clients/duplicateQuizByProc?eventId=${duplicate.eventId}&fromEventId=${duplicate.fromEventId}&quizId=${duplicate.quizId}`;
      return axios
        .get(adminurl, {
          headers: {
            Authorization: `Bearer ${secretToken}`,
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
          // ques(quiz.eventId);
          setDuplicate({
            eventId: "",
            quizId: "",
            fromEventId: "",
          });
          setDuplicateModal(false);
          setErrorObj();
        });
    } else {
      setErrorObj(duplicate);
    }
  };
  const [eventid, setEventid] = useState("");

  const [getQuiz, setGEtQuiz] = useState([]);
  const [getHra, setGetHra] = useState([]);
  const [getQuestion, setGetQuestion] = useState([]);
  console.log(getQuiz);
  const ques = (id) => {
    const adminurl = `${urlPrefix}v1.0/getAllEventHra?challengerZoneId=${id}`;
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
        setGetHra(res.data.response.responseData);
      });
  };
  const imageUpload = () => {
    const formData = new FormData();
    formData.append("image", imageData.image_obj);
    const adminurl = `${urlPrefix}v1.0/uploadHRAImage?id=${imgId}&key=QUESTION`;

    return axios
      .post(adminurl, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          timeStamp: "timestamp",
          accept: "*/*",
          "Content-type": "multipart/form-data; boundary=???",
          withCredentials: true,
        },
      })
      .then((res) => {
        if (res.data.response.responseMessage === "SUCCESS") {
          Message.success(res.data.response.responseData);
          setImageModal(false);
        }
      });
  };
  const question = (id) => {
    const adminurl = `${urlPrefix}v1.0/getHraAllQuestions?hraId=${id}`;
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
  const [getOptionData, setGetOptionData] = useState([]);
  const getOption = (id) => {
    const adminurl = `${urlPrefix}v1.0/getQuesWiseAllOption?questionId=${id}`;
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
        setGetOptionData(res.data.response.responseData);
      });
  };
  const [geteventId, setGetEventId] = useState([]);
  const getEvent = () => {
    const adminurl = `${urlPrefix}v1.0/getUserRoleWiseEvent`;
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
        setGetEventId(res.data.response.responseData);
      });
  };
  useEffect(() => {
    getEvent();
    console.log("APi Called");
  }, []);

  const condition = JSON.parse(localStorage.getItem("condition"));
  const eventName = condition.events;
  console.log(eventName);
  const [assessment, setAssessment] = useState({
    eventId: "",
    hraId: "",
    question: "",
    queDescription: "",
    answerType: "",
    id: "",
  });
  const [optionData, setOptionData] = useState({
    id: "",
    questionId: questionid,
    optionText: "",
    additionalInfo: "",
    optionScore: "",
  });
  console.log(assessment, optionData, "asseemme");

  const [modalview, setModalView] = useState(false);
  const inputsHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setAssessment((values) => ({ ...values, [name]: value }));
    setErrorObj((values) => ({ ...values, [name]: value }));
    if (name === "eventId") {
      ques(value);
    }
    if (name === "hraId") {
      question(value);
    }
  };
  const inputsOption = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setOptionData((values) => ({ ...values, [name]: value }));
    setErrorObj1((values) => ({ ...values, [name]: value }));
    // if (name === "op") {
    //   ques(value);
    // }
    // if (name === "hraId") {
    //   question(value);
    // }
  };
  if (setModalView === false) {
    ques(addId);
  }
  const hadleEdit = (row) => {
    setAssessment(row);
  };
  const optionEdit = (row) => {
    setOptionData({
      id: row.id,
      questionId: questionid,
      optionText: row.optionText,
      additionalInfo: row.additionalInfo,
      optionScore: row.optionScore,
    });
  };
  const optionClick = (item) => {
    setQuestionId(item.id);
    setOptionModal(true);
    setOptionType(item.answerType);
    getOption(item.id);
    setOptionData({ ...optionData, questionId: item.id });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    let payload = {};
    payload = {
      id: assessment.id !== "" ? assessment.id : "",
      hraId: assessment.hraId,
      question: assessment.question,
      queDescription: assessment.queDescription,
      answerType: assessment.answerType,
    };
    if (
      assessment.hraId !== "" &&
      assessment.question !== "" &&
      assessment.queDescription !== "" &&
      assessment.answerType !== ""
    ) {
      const adminurl = `${urlPrefix}v1.0/createUpdateHraQue`;
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
          question(assessment.hraId);
          setAssessment({
            eventId: assessment.eventId,
            hraId: assessment.hraId,
            question: "",
            queDescription: "",
            answerType: "",
          });

          if (res.data.mhealthResponseMessage === "SUCCESS") {
            console.log(res.data.response.responseMessage);
            Message.success(res.data.response.responseMessage);
            setImageModal(true);
            setImgId(res.data.response.responseData.id);
          }
        });
    } else {
      Message.error("Please fill all Mandatory fields Carefully!!");
      setErrorObj(assessment);
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const onFileChange = (event) => {
    if (event.target.files) {
      const { files } = event.target;
      if (files && files.length > 0) {
        getBase64(files[0]).then((res) => {
          setImageData({
            ...imageData,
            image_obj: files[0],
            image: res,
          });
        });
      }
    }
  };
  console.log(imageData.image_obj, "imgdd");
  const optionSubmit = (e) => {
    e.preventDefault();

    let payload = {};
    payload = {
      id: optionData.id !== "" ? optionData.id : null,
      optionText: optionData.optionText,
      additionalInfo: optionData.additionalInfo,
      optionScore: parseInt(optionData.optionScore),
      quetionId: questionid,
    };
    if (
      optionData.optionText !== "" &&
      optionData.optionScore !== "" &&
      optionData.questionId !== "" &&
      optionData.additionalInfo !== ""
    ) {
      const adminurl = `${urlPrefix}v1.0/createOrUdateOption`;
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
          getOption(optionData.questionId);
          setOptionData({
            questionId: optionData.questionId,
            optionText: "",
            additionalInfo: "",
            optionScore: "",
          });

          if (res.data.mhealthResponseMessage === "SUCCESS") {
            console.log(res.data.response.responseMessage);
            Message.success(res.data.response.responseMessage);
            // setResponseMessage(res.data.response.responseMessage);
          }
        });
    } else {
      Message.error("Please fill all Mandatory fields Carefully!!");
      setErrorObj(assessment);
    }
  };
  if (errorobj !== undefined) {
    console.log(errorobj.eventId);
  }

  const [image, setImage] = useState("question");

  return (
    <>
      <div style={{ display: "flex", marginLeft: "30px" }}>
        <div style={{ width: "30%" }}>
          <label style={{ fontSize: 12 }}>
            Select Event
            {errorobj !== undefined && (
              <>
                {errorobj.eventId == "" ? (
                  <p
                    style={{
                      color: "red",
                      marginLeft: "22%",
                      marginTop: "-4%",
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

          <select
            autofocus="autofocus"
            style={{
              background: "#f3f4f6",
              padding: "10px 10px",
              borderRadius: 6,
              fontSize: 12,
              width: "95%",
              border: "1px solid black",
            }}
            value={assessment.eventId}
            onChange={inputsHandler}
            name="eventId"
          >
            <option value="">Select</option>
            {geteventId.map((day, index) => {
              return (
                <>
                  <option key={index} value={day.id}>
                    {day.challengeName}
                  </option>
                </>
              );
            })}
          </select>
        </div>
        <div style={{ width: "30%" }}>
          <label style={{ fontSize: 12 }}>
            Select Hra
            {errorobj !== undefined && (
              <>
                {errorobj.hraId == "" ? (
                  <p
                    style={{
                      color: "red",
                      marginLeft: "22%",
                      marginTop: "-4%",
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

          <select
            autofocus="autofocus"
            style={{
              background: "#f3f4f6",
              padding: "10px 10px",
              borderRadius: 6,
              fontSize: 12,
              width: "95%",
              border: "1px solid black",
            }}
            value={assessment.hraId}
            onChange={inputsHandler}
            name="hraId"
          >
            <option value="">Select</option>
            {getHra &&
              getHra.map((day, index) => {
                return (
                  <>
                    <option value={day.id}>{day.assesmentName}</option>
                  </>
                );
              })}
          </select>
        </div>
        <div style={{ width: "30%" }}>
          <label style={{ fontSize: 12 }}>
            Answer Type
            {errorobj !== undefined && (
              <>
                {errorobj.answerType == "" ? (
                  <p
                    style={{
                      color: "red",
                      marginLeft: "22%",
                      marginTop: "-4%",
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

          <select
            autofocus="autofocus"
            style={{
              background: "#f3f4f6",
              padding: "10px 10px",
              borderRadius: 6,
              fontSize: 12,
              width: "95%",
              border: "1px solid black",
            }}
            value={assessment.answerType}
            onChange={inputsHandler}
            name="answerType"
          >
            <option value="">Select</option>
            <option value="SINGLE">SINGLE</option>
            <option value="MULTIPLE">MULTIPLE</option>
            <option value="TEXT">TEXT</option>
          </select>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          marginLeft: "30px",
          marginTop: "10px",
        }}
      >
        <div style={{ width: "30%" }}>
          <label style={{ fontSize: 12 }}>
            Question
            {errorobj !== undefined && (
              <>
                {errorobj.question == "" ? (
                  <p
                    style={{
                      color: "red",
                      marginLeft: "22%",
                      marginTop: "-4%",
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
              width: "95%",
              border: "1px solid black",
            }}
            value={assessment.question}
            onChange={inputsHandler}
            placeholder="Question"
            name="question"
          />
        </div>

        <div style={{ width: "30%" }}>
          <label style={{ fontSize: 12 }}>
            Description
            {/* {errorobj !== undefined && (
                        <>
                          {errorobj.reattemptAfterDays == "" ? (
                            <p
                              style={{
                                color: "red",
                                marginLeft: "22%",
                                marginTop: "-4%",
                              }}
                            >
                              Required
                            </p>
                          ) : (
                            ""
                          )}
                        </>
                      )} */}
          </label>

          <textarea
            autofocus="autofocus"
            style={{
              background: "#f3f4f6",
              padding: "10px 10px",
              borderRadius: 6,
              fontSize: 12,
              width: "95%",
              border: "1px solid black",
              minHeight: "auto",
              maxHeight: "90vh",
            }}
            placeholder="Question Description"
            value={assessment.queDescription}
            onChange={inputsHandler}
            name="queDescription"
          />
        </div>
        <div style={{ width: "30%", marginTop: "1.5%" }}>
          <PrimaryButton
            mini
            className="w-24 text-sm mt-4"
            onClick={handleSubmit}
          >
            Save Question
          </PrimaryButton>
        </div>
      </div>

      <div style={{ minWidth: "800px", overflowX: "auto" }}>
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
            {getQuestion && getQuestion.length > 0 ? (
              <TablePagination
                rowsPerPageOptions={[5, 10, 50, 75, 100]}
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

        <div style={{}}></div>

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
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                  width: "200px",
                                  display: "block",
                                  overflow: "hidden",
                                  fontSize: 12,
                                }}
                              >
                                {" "}
                                <span style={{ fontSize: 12 }}>
                                  {item.question ? item.question : "  -     "}
                                </span>{" "}
                              </p>{" "}
                            </TableCell>
                            <TableCell align="left">
                              {" "}
                              <p style={{ width: "100px" }}>
                                <span style={{ fontSize: 12 }}>
                                  {item.answerType
                                    ? item.answerType
                                    : "  -     "}
                                </span>{" "}
                              </p>{" "}
                            </TableCell>
                            <TableCell align="center" style={{ fontSize: 12 }}>
                              {" "}
                              {item.queDescription
                                ? item.queDescription
                                : "  -     "}
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{ fontSize: 12, width: "100px" }}
                            >
                              <PrimaryButton
                                mini
                                className="w-24 text-sm mx-auto"
                                onClick={() => {
                                  hadleEdit(item);
                                }}
                              >
                                Edit
                              </PrimaryButton>
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{ fontSize: 12, width: "120px" }}
                            >
                              <PrimaryButton
                                mini
                                className="w-24 text-sm mx-auto"
                                onClick={() => {
                                  optionClick(item);
                                }}
                                // onClick={() => {
                                //   setOptionData({...optionData,questionId:item.id}); setOptionModal(true);setOptionType(item.answerType);}}
                              >
                                Add Option
                              </PrimaryButton>
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
              {/* <img
                          style={{ width: 200, height: 200 }}
                          src="https://w21.mhealth.ai/static/media/dataSource.11fba1d5.svg"
                        /> */}
              <NoData />
              Data is not present
            </div>{" "}
          </>
        )}
      </div>

      <div>
        {modalview && (
          <QuestionModal modalView={modalview} setModalView={setModalView} />
        )}
        {
          <InfoDialog open={imageModal} onClose={() => setImageModal(false)}>
            <CancelIcon
              style={{
                // top: 50,
                right: 10,
                color: "#ef5350",
                cursor: "pointer",
                marginLeft: "95%",
                marginTop: "-5%",
              }}
              onClick={() => {
                setImageModal(false);
              }}
            />
            <div style={{ height: "250px", width: "400px", marginLeft: "15%" }}>
              <div
                className="mhealth-input-box padding-025em"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginRight: 20,
                  }}
                >
                  <label
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    Assessment Image{" "}
                    {/* {assessment.imgPath && (
                      <span
                        style={{ cursor: "pointer", color: "red" }}
                        onClick={() => {
                          setMediaObj({ ...mediaObj, eventImage: undefined });
                        }}
                      >
                        Delete
                      </span>
                    )} */}
                  </label>
                  {assessment.imgPath && (
                    <p className="error-text">Please Upload</p>
                  )}

                  <div
                    className="create-event-logo"
                    style={{ border: "1px solid #eee" }}
                  >
                    {imageData.image ? (
                      <>
                        <img
                          style={{ width: "100%", height: "100%" }}
                          src={imageData.image}
                        />
                      </>
                    ) : (
                      <PlusCircle
                        size={30}
                        style={{ marginRight: 3, cursor: "pointer" }}
                        onClick={() => eventImageInputRef.current.click()}
                      />
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    ref={eventImageInputRef}
                    style={{ display: "none" }}
                    onChange={onFileChange}
                  />
                  <div style={{ marginTop: "3%" }}>
                    <PrimaryButton onClick={imageUpload}>
                      Save Image
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            </div>
          </InfoDialog>
        }
      </div>
      {optionModal && (
        <InfoDialog open={optionModal} onClose={() => setOptionModal(false)}>
          <CancelIcon
            style={{
              // top: 50,
              right: 10,
              color: "#ef5350",
              cursor: "pointer",
              marginLeft: "95%",
              marginTop: "-5%",
            }}
            onClick={() => {
              setOptionModal(false);
            }}
          />
          <div style={{ height: "450px", width: "100%" }}>
            <div
              style={{
                display: "flex",
                marginLeft: "30px",
                marginTop: "10px",
              }}
            >
              <div style={{ width: "50%" }}>
                <label style={{ fontSize: 12 }}>
                  Option Text
                  {errorobj1 !== undefined && (
                    <>
                      {errorobj1.optionText == "" ? (
                        <p
                          style={{
                            color: "red",
                            marginLeft: "22%",
                            marginTop: "-4%",
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
                    width: "95%",
                    border: "1px solid black",
                  }}
                  value={optionData.optionText}
                  onChange={inputsOption}
                  placeholder="Type Option"
                  name="optionText"
                />
              </div>

              <div style={{ width: "50%" }}>
                <label style={{ fontSize: 12 }}>
                  Additional Information
                  {errorobj1 !== undefined && (
                    <>
                      {errorobj1.additionalInfo == "" ? (
                        <p
                          style={{
                            color: "red",
                            marginLeft: "22%",
                            marginTop: "-4%",
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
                    width: "95%",
                    border: "1px solid black",
                    minHeight: "auto",
                    maxHeight: "90vh",
                  }}
                  placeholder="Additional Information"
                  value={optionData.additionalInfo}
                  onChange={inputsOption}
                  name="additionalInfo"
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                marginLeft: "30px",
                marginTop: "10px",
              }}
            >
              <div style={{ width: "50%" }}>
                <label style={{ fontSize: 12 }}>
                  Option Score
                  {errorobj1 !== undefined && (
                    <>
                      {errorobj1.optionScore == "" ? (
                        <p
                          style={{
                            color: "red",
                            marginLeft: "22%",
                            marginTop: "-4%",
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

                <input
                  type="number"
                  autofocus="autofocus"
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    width: "95%",
                    border: "1px solid black",
                  }}
                  value={optionData.optionScore}
                  onChange={inputsOption}
                  placeholder="Option Score"
                  name="optionScore"
                />
              </div>
              <div style={{ width: "10%", marginTop: "1.5%" }}></div>
              <div style={{ width: "30%", marginTop: "1.5%" }}>
                <PrimaryButton
                  mini
                  className="w-24 text-sm mt-4"
                  onClick={optionSubmit}
                >
                  Save Option
                </PrimaryButton>
              </div>
            </div>
            <div style={{ minWidth: "800px", overflowX: "auto" }}>
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
                  {getOptionData && getOptionData.length > 0 ? (
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 50, 75, 100]}
                      component="div"
                      count={getOptionData && getOptionData.length}
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

              <div style={{}}></div>

              {getOptionData && getOptionData.length > 0 ? (
                <div style={{ padding: 20 }}>
                  <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size={"small"}
                    aria-label="enhanced table"
                  >
                    {" "}
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: "800px" }}>
                          S.N.
                        </TableCell>
                        <TableCell style={{ fontWeight: "800px" }}>
                          Option Text
                        </TableCell>
                        <TableCell style={{ fontWeight: "800px" }}>
                          Additional Info
                        </TableCell>
                        <TableCell style={{ fontWeight: "800px" }}>
                          Option Score
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getOptionData &&
                        stableSort(getOptionData, getComparator(order, orderBy))
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
                                        width: "200px",
                                        display: "block",
                                        overflow: "hidden",
                                        fontSize: 12,
                                      }}
                                    >
                                      {" "}
                                      <span style={{ fontSize: 12 }}>
                                        {item.optionText
                                          ? item.optionText
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
                                        width: "200px",
                                        display: "block",
                                        overflow: "hidden",
                                        fontSize: 12,
                                      }}
                                    >
                                      <span style={{ fontSize: 12 }}>
                                        {item.additionalInfo
                                          ? item.additionalInfo
                                          : "  -     "}
                                      </span>{" "}
                                    </p>{" "}
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    style={{ fontSize: 12 }}
                                  >
                                    {" "}
                                    {item.optionScore
                                      ? item.optionScore
                                      : "  -     "}
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    style={{ fontSize: 12, width: "100px" }}
                                  >
                                    <PrimaryButton
                                      mini
                                      className="w-24 text-sm mx-auto"
                                      onClick={() => {
                                        optionEdit(item);
                                      }}
                                    >
                                      Edit
                                    </PrimaryButton>
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
                    {/* <img
                          style={{ width: 200, height: 200 }}
                          src="https://w21.mhealth.ai/static/media/dataSource.11fba1d5.svg"
                        /> */}
                    <NoData />
                    Data is not present
                  </div>{" "}
                </>
              )}
            </div>
          </div>
        </InfoDialog>
      )}
    </>
  );
};
export default CreateAssisment;
