import React, {useState, useEffect} from 'react';
import TopUserDetails from './TopUserDetails';
import {lighten, useTheme} from '@material-ui/core/styles';
import Navbar from './Navbar';
import QuestionModal from './QuestionModal';

import Message from 'antd-message';

import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import Modal from '@material-ui/core/Modal';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import CancelIcon from '@material-ui/icons/Cancel';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import {makeStyles} from '@material-ui/core/styles';
import {
  urlPrefix,
  secretToken,
  getSubEvent,
  zoomreport,
} from '../services/apicollection';
import axios from 'axios';
import InfoDialog from './Utility/InfoDialog';
// import FormItem from 'antd/lib/form/FormItem';

const Admin123 = () => {
  // const [modalStyle] = React.useState(getModalStyle);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [duplicateModal, setDuplicateModal] = useState(false);
  const [addId, setaddId] = useState();
  const [errorobj, setErrorObj] = useState();
  console.log(addId);
  const [duplicate, setDuplicate] = useState({
    eventId: '',
    fromEventId: '',
    quizId: '',
  });
  console.log(duplicate, 'duplicate');
  const handleDuplicate = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setDuplicate((values) => ({...values, [name]: value}));
    setErrorObj((values) => ({...values, [name]: value}));
  };
  function EnhancedTableHead(props) {
    const {classes, order, orderBy, onRequestSort} = props;
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
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
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
    return order === 'desc'
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
    const {count, page, rowsPerPage, onChangePage} = props;

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
      <div className={classes.root} style={{display: 'flex'}}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
          style={{width: 30, padding: 0}}
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
          style={{width: 30, padding: 0}}
        >
          {theme.direction === 'rtl' ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
          style={{width: 30, padding: 0}}
        >
          {theme.direction === 'rtl' ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
          style={{width: 30, padding: 0}}
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }

  const teamHeads = [
    {
      label: 'S.no',
      id: 's_no',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'Quiz Name',
      id: 'quizDescription',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'Quiz Type',
      id: 'quizType',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'Quiz Start Date',
      id: 'quizStartDate',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'Quiz End Date',
      id: 'quizEndDate',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'Quiz Timer',
      id: 'quizTimer',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'Total Question',
      id: 'quizTimer',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'Add Question',
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
      width: '100%',
      // border: "1px solid black"
    },
    paper: {
      position: 'absolute',
      width: '90%',
      backgroundColor: '#fff',
      padding: 12,
      borderRadius: 12,
      outline: 'none',
      // maxHeight: 1200,
      marginLeft: '195px',
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  }));
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
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
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    button: {
      display: 'block',
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
      duplicate.eventId !== '' &&
      duplicate.fromEventId !== '' &&
      duplicate.quizId
    ) {
      const adminurl = `${urlPrefix}clients/duplicateQuizByProc?eventId=${duplicate.eventId}&fromEventId=${duplicate.fromEventId}&quizId=${duplicate.quizId}`;
      return axios
        .get(adminurl, {
          headers: {
            Authorization: `Bearer ${secretToken}`,
            timeStamp: 'timestamp',
            accept: '*/*',
            'Access-Control-Allow-Origin': '*',
            withCredentials: true,
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers':
              'accept, content-type, x-access-token, x-requested-with',
          },
        })
        .then((res) => {
          // ques(quiz.eventId);
          setDuplicate({
            eventId: '',
            quizId: '',
            fromEventId: '',
          });
          setDuplicateModal(false);
          setErrorObj();
        });
    } else {
      setErrorObj(duplicate);
    }
  };
  const [eventid, setEventid] = useState('');

  const [getQuiz, setGEtQuiz] = useState([]);
  console.log(getQuiz);
  const ques = (id) => {
    const adminurl = `${urlPrefix}v1.0/getEventQuiz?eventId=${id}`;
    console.log(adminurl);
    axios
      .get(adminurl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          timeStamp: 'timestamp',
          accept: '*/*',
          'Access-Control-Allow-Origin': '*',
          withCredentials: true,
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
          'Access-Control-Allow-Headers':
            'accept, content-type, x-access-token, x-requested-with',
        },
      })
      .then((res) => {
        setGEtQuiz(res.data.response.responseData);
      });
  };
  const [geteventId, setGetEventId] = useState();
  const getEvent = () => {
    const adminurl = `${urlPrefix}v1.0/getUserRoleWiseEvent`;
    console.log(adminurl);
    axios
      .get(adminurl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          timeStamp: 'timestamp',
          accept: '*/*',
          'Access-Control-Allow-Origin': '*',
          withCredentials: true,
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
          'Access-Control-Allow-Headers':
            'accept, content-type, x-access-token, x-requested-with',
        },
      })
      .then((res) => {
        setGetEventId(res.data.response.responseData);
      });
  };
  useEffect(() => {
    getEvent();
    console.log('APi Called');
  }, []);

  const condition = JSON.parse(localStorage.getItem('condition'));
  const eventName = condition.events;
  console.log(eventName);
  const [quiz, setQuiz] = useState({
    eventId: '',
    quizType: '',
    quizDescription: '',
    quizStartDate: '',
    quizEndDate: '',
    quizTimer: '',
  });

  // console.log(question);

  const [modalview, setModalView] = useState(false);
  const inputsHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQuiz((values) => ({...values, [name]: value}));
    setErrorObj((values) => ({...values, [name]: value}));
    if(name==="eventId")
    {
      ques(value)
    }
  };
  if (setModalView === false) {
    ques(addId);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let payload = {};
    payload = {
      id: null,
      eventId: quiz.eventId,
      quizType: quiz.quizType,
      quizDescription: quiz.quizDescription,
      quizStartDate: quiz.quizStartDate,
      quizEndDate: quiz.quizEndDate,
      quizTimer: quiz.quizTimer,
    };
    if (
      quiz.quizType !== '' &&
      quiz.eventId !== '' &&
      quiz.quizDescription !== '' &&
      quiz.quizStartDate !== '' &&
      quiz.quizEndDate !== '' &&
      quiz.quizTimer !== ''
    ) {
      const adminurl = `${urlPrefix}v1.0/createQuiz`;
      return axios
        .post(adminurl, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            timeStamp: 'timestamp',
            accept: '*/*',
            'Access-Control-Allow-Origin': '*',
            withCredentials: true,
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers':
              'accept, content-type, x-access-token, x-requested-with',
          },
        })
        .then((res) => {
          ques(quiz.eventId);
          setQuiz({
            eventId: '',
            quizType: '',
            quizDescription: '',
            quizStartDate: '',
            quizEndDate: '',
            quizTimer: '',
          });

          if (res.data.mhealthResponseMessage === 'SUCCESS') {
            console.log(res.data.response.responseMessage);
            Message.success(res.data.response.responseMessage);
            // setResponseMessage(res.data.response.responseMessage);
          }
        });
    } else {
      Message.error('Please fill all Mandatory fields Carefully!!');
      setErrorObj(quiz);
    }
  };
  if (errorobj !== undefined) {
    console.log(errorobj.eventId);
  }

  const [image, setImage] = useState('question');

  return (
    <div className="Profile" style={{height: 'auto', overflowX: 'hidden'}}>
      <TopUserDetails />
      <Navbar />
      <div className="profile-background" style={{overflowX: 'hidden'}}>
        <div
          className="form reset-form"
          style={{
            marginTop: 0,
            width: '90%',
            height: 'auto',
            // marginTop: 0,
            // marginTop: "20px"
            marginTop: '2%',
          }}
        >
          <Tabs style={{marginTop: 0}}>
            {' '}
            <div
              className="d-flex j-c-sp-btn a-i-center cursor-pointer"
              style={{justifyContent: 'flex-end'}}
            >
              <div className="leaderboard-actions ">
                {' '}
                <TabList style={{border: '0px'}}>
                  <Tab
                    style={{
                      fontSize: 12,
                      border: '0px',
                      background: '#e0f2fe',
                      height: 30,
                    }}
                  >
                    {' '}
                    <button
                      style={{
                        background: '#e0f2fe',
                        color: '#518ad6',
                        padding: 0,
                        height: 30,
                      }}
                    >
                      Quiz{' '}
                    </button>
                  </Tab>
                </TabList>
              </div>
            </div>
            <TabPanel>
              <div style={{}}>
                <button
                  className="is-success"
                  style={{width: '10%', marginLeft: '30px'}}
                  onClick={() => setDuplicateModal(true)}
                >
                  Duplicate
                </button>
                <div style={{display: 'flex', marginLeft: '30px'}}>
                  <div style={{width: '30%'}}>
                    <label style={{fontSize: 12}}>
                      Select Event
                      {errorobj !== undefined && (
                        <>
                          {errorobj.eventId == '' ? (
                            <p
                              style={{
                                color: 'red',
                                marginLeft: '22%',
                                marginTop: '-4%',
                              }}
                            >
                              Required
                            </p>
                          ) : (
                            ''
                          )}
                        </>
                      )}
                    </label>

                    <select
                      autofocus="autofocus"
                      style={{
                        background: '#f3f4f6',
                        padding: '10px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        width: '95%',
                        border: '1px solid black',
                      }}
                      value={quiz.eventId}
                      onChange={inputsHandler}
                     
                      name="eventId"
                    >
                      <option value="">Select</option>
                      {geteventId &&
                        geteventId.map((item) => {
                          // console.log(item.challengeName);
                          return (
                            <>
                              <option value={item.id}>
                                {item.challengeName}
                              </option>
                            </>
                          );
                        })}
                    </select>
                  </div>
                  <div style={{width: '30%'}}>
                    <label style={{fontSize: 12}}>
                      Quiz Type
                      {errorobj !== undefined && (
                        <>
                          {errorobj.quizType == '' ? (
                            <p
                              style={{
                                color: 'red',
                                marginLeft: '22%',
                                marginTop: '-4%',
                              }}
                            >
                              Required
                            </p>
                          ) : (
                            ''
                          )}
                        </>
                      )}
                    </label>

                    <select
                      autofocus="autofocus"
                      style={{
                        background: '#f3f4f6',
                        padding: '10px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        width: '95%',
                        border: '1px solid black',
                      }}
                      value={quiz.quizType}
                      onChange={inputsHandler}
                      name="quizType"
                    >
                      <option value="">Select</option>
                      <option value="ALL">ALL</option>
                      <option value="ALLWITHRESET">ALLWITHRESET</option>
                      <option value="PERDAY">PERDAY</option>
                      <option value="IFWRONG">IFWRONG</option>
                    </select>
                  </div>
                  <div style={{width: '30%'}}>
                    <label style={{fontSize: 12}}>
                      Quiz Name
                      {errorobj !== undefined && (
                        <>
                          {errorobj.quizDescription == '' ? (
                            <p
                              style={{
                                color: 'red',
                                marginLeft: '22%',
                                marginTop: '-4%',
                              }}
                            >
                              Required
                            </p>
                          ) : (
                            ''
                          )}
                        </>
                      )}
                    </label>

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
                      type="text"
                      value={quiz.quizDescription}
                      onChange={inputsHandler}
                      name="quizDescription"
                      placeholder="Quiz Name"
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    marginLeft: '30px',
                    marginTop: '10px',
                  }}
                >
                  <div style={{width: '30%'}}>
                    <label style={{fontSize: 12}}>
                      Quiz Start Date
                      {errorobj !== undefined && (
                        <>
                          {errorobj.quizStartDate == '' ? (
                            <p
                              style={{
                                color: 'red',
                                marginLeft: '28%',
                                marginTop: '-4%',
                              }}
                            >
                              Required
                            </p>
                          ) : (
                            ''
                          )}
                        </>
                      )}
                    </label>

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
                    />
                  </div>
                  <div style={{width: '30%'}}>
                    <label style={{fontSize: 12}}>
                      Quiz End Date
                      {errorobj !== undefined && (
                        <>
                          {errorobj.quizEndDate == '' ? (
                            <p
                              style={{
                                color: 'red',
                                marginLeft: '28%',
                                marginTop: '-4%',
                              }}
                            >
                              Required
                            </p>
                          ) : (
                            ''
                          )}
                        </>
                      )}
                    </label>

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
                      value={quiz.quizEndDate}
                      onChange={inputsHandler}
                      name="quizEndDate"
                    />
                  </div>
                  <div style={{width: '30%'}}>
                    <label style={{fontSize: 12}}>
                      Quiz Timer
                      {errorobj !== undefined && (
                        <>
                          {errorobj.quizTimer == '' ? (
                            <p
                              style={{
                                color: 'red',
                                marginLeft: '22%',
                                marginTop: '-4%',
                              }}
                            >
                              Required
                            </p>
                          ) : (
                            ''
                          )}
                        </>
                      )}
                    </label>

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
                      value={quiz.quizTimer}
                      onChange={inputsHandler}
                      name="quizTimer"
                      placeholder="30"
                    />
                  </div>
                </div>
                <div style={{display: 'flex', marginLeft: '10px'}}>
                  <div style={{width: '80%'}}></div>
                  <div style={{width: '20%'}}>
                    <button
                      className="is-success"
                      onClick={
                        handleSubmit
                        // Quizdata2(localStorage.getItem('selectEvent'));
                      }
                      style={{
                        marginTop: 50,
                        width: 100,
                        height: 32,
                        // marginLeft: 20,
                      }}
                    >
                      Save Quiz
                    </button>
                  </div>
                </div>

                <div style={{minWidth: '800px', overflowX: 'auto'}}>
                  {/* <Paper className={classes.paper}> */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    {/* <Tooltip title="Export data">
                      <CSVLink data={datas} headers={headers} separator={','}>
                        <SystemUpdateAltIcon />
                      </CSVLink>
                    </Tooltip> */}
                    <div className="d-flex a-i-center">
                      {getQuiz && getQuiz.length > 0 ? (
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 50, 75, 100]}
                          component="div"
                          count={getQuiz && getQuiz.length}
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

                  {getQuiz && getQuiz.length > 0 ? (
                    <div style={{padding: 20}}>
                      <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={'small'}
                        aria-label="enhanced table"
                      >
                        {' '}
                        <EnhancedTableHead
                          style={{fontSize: '5px'}}
                          classes={classes}
                          order={order}
                          orderBy={orderBy}
                          onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                          {getQuiz &&
                            stableSort(getQuiz, getComparator(order, orderBy))
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((item, ind) => {
                                return (
                                  <>
                                    <TableRow className="performace-table-row">
                                      {' '}
                                      <TableCell align="center">
                                        {' '}
                                        <span style={{fontSize: 12}}>
                                          {ind + 1}
                                        </span>{' '}
                                      </TableCell>
                                      <TableCell align="left">
                                        {' '}
                                        <p
                                          style={{
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            width: '200px',
                                            display: 'block',
                                            overflow: 'hidden',
                                            fontSize: 12,
                                          }}
                                        >
                                          {' '}
                                          <span style={{fontSize: 12}}>
                                            {item.quizDescription
                                              ? item.quizDescription
                                              : '  -     '}
                                          </span>{' '}
                                        </p>{' '}
                                      </TableCell>
                                      <TableCell align="left">
                                        {' '}
                                        <p style={{width: '100px'}}>
                                          <span style={{fontSize: 12}}>
                                            {item.quizType
                                              ? item.quizType
                                              : '  -     '}
                                          </span>{' '}
                                        </p>{' '}
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        style={{fontSize: 12}}
                                      >
                                        {' '}
                                        {item.quizStartDate
                                          ? item.quizStartDate
                                          : '  -     '}
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        style={{fontSize: 12}}
                                      >
                                        {' '}
                                        <p style={{width: ''}}>
                                          {' '}
                                          {item.quizEndDate
                                            ? item.quizEndDate
                                            : '  -     '}
                                        </p>
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        style={{fontSize: 12}}
                                      >
                                        {' '}
                                        {item.quizTimer
                                          ? item.quizTimer
                                          : '  -     '}
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        style={{fontSize: 12}}
                                      >
                                        {' '}
                                        {item.totalQuestion
                                          ? item.totalQuestion
                                          : '  -     '}
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        style={{fontSize: 12}}
                                      >
                                        <button
                                          className="is-success"
                                          // onClick={setModal(true)}
                                          onClick={() => {
                                            setaddId(item.idMstQuiz),
                                              localStorage.setItem(
                                                'Idquiz',
                                                item.idMstQuiz
                                              ),
                                              setModalView(true),
                                              setImage('editquestion');
                                          }}
                                          style={{
                                            marginTop: 10,
                                            width: 80,
                                            height: 20,
                                            // marginLeft: 20,
                                          }}
                                        >
                                          Add Question
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
                          padding: '5px',
                          marginTop: 30,
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          fontSize: 12,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        className=""
                      >
                        {' '}
                        <img
                          style={{width: 200, height: 200}}
                          src="https://w21.mhealth.ai/static/media/dataSource.11fba1d5.svg"
                        />
                        Data is not present
                      </div>{' '}
                    </>
                  )}
                </div>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
      <div>
        {modalview && (
          <QuestionModal modalView={modalview} setModalView={setModalView} />
        )}
        {
          <InfoDialog
            open={duplicateModal}
            onClose={() => setDuplicateModal(false)}
          >
            <CancelIcon
              style={{
                // top: 50,
                right: 10,
                color: '#ef5350',
                cursor: 'pointer',
                marginLeft: '95%',
                marginTop: '-5%',
              }}
              onClick={() => {
                setDuplicateModal(false),
                  setDuplicate({
                    eventId: '',
                    quizId: '',
                    fromEventId: '',
                  });
              }}
            />
            <div style={{height: '200px', width: '600px', marginLeft: '3%'}}>
              <div style={{display: 'flex'}}>
                <div style={{width: '50%'}}>
                  <label>
                    Select Event
                    {errorobj !== undefined && (
                      <>
                        {errorobj.eventId == '' ? (
                          <p
                            style={{
                              color: 'red',
                              marginLeft: '32%',
                              marginTop: '-6%',
                            }}
                          >
                            *
                          </p>
                        ) : (
                          ''
                        )}
                      </>
                    )}
                  </label>

                  <select
                    autofocus="autofocus"
                    style={{
                      background: '#f3f4f6',
                      padding: '10px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      width: '90%',
                      border: '1px solid black',
                    }}
                    value={duplicate.eventId}
                    onChange={handleDuplicate}
                    onClick={(e) => {
                      ques(e.target.value);
                    }}
                    name="eventId"
                  >
                    <option value="">select</option>
                    {geteventId &&
                      geteventId.map((item) => {
                        // console.log(item.challengeName);
                        return (
                          <>
                            <option value={item.id}>
                              {item.challengeName}
                            </option>
                          </>
                        );
                      })}
                  </select>
                </div>
                <div style={{width: '50%'}}>
                  <label>
                    Select Quiz{' '}
                    {errorobj !== undefined && (
                      <>
                        {errorobj.quizId == '' ? (
                          <p
                            style={{
                              color: 'red',
                              marginLeft: '30%',
                              marginTop: '-8%',
                            }}
                          >
                            *
                          </p>
                        ) : (
                          ''
                        )}
                      </>
                    )}
                  </label>

                  <select
                    autofocus="autofocus"
                    style={{
                      background: '#f3f4f6',
                      padding: '10px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      width: '90%',
                      border: '1px solid black',
                    }}
                    value={duplicate.quizId}
                    onChange={handleDuplicate}
                    name="quizId"
                  >
                    <option value="">select</option>
                    {getQuiz &&
                      getQuiz.map((item) => {
                        // console.log(item.challengeName);
                        return (
                          <>
                            <option value={item.idMstQuiz}>
                              {item.quizDescription}
                            </option>
                          </>
                        );
                      })}
                  </select>
                </div>
              </div>
              <div style={{display: 'flex', marginTop: '3%'}}>
                <div style={{width: '50%'}}>
                  <label>
                    Select Copied Event{' '}
                    {errorobj !== undefined && (
                      <>
                        {errorobj.fromEventId == '' ? (
                          <p
                            style={{
                              color: 'red',
                              marginLeft: '50%',
                              marginTop: '-8%',
                            }}
                          >
                            *
                          </p>
                        ) : (
                          ''
                        )}
                      </>
                    )}
                  </label>

                  <select
                    autofocus="autofocus"
                    style={{
                      background: '#f3f4f6',
                      padding: '10px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      width: '90%',
                      border: '1px solid black',
                    }}
                    value={duplicate.fromEventId}
                    onChange={handleDuplicate}
                    name="fromEventId"
                  >
                    <option value="">select</option>
                    {geteventId &&
                      geteventId.map((item) => {
                        if (duplicate.eventId !== item.id) {
                          // console.log(item.challengeName);
                          return (
                            <>
                              <option value={item.id}>
                                {item.challengeName}
                              </option>
                            </>
                          );
                        }
                      })}
                  </select>
                </div>
                <div style={{width: '18%'}}></div>
                <div style={{width: '20%', marginTop: '5%'}}>
                  <button className="is-success" onClick={saveDuplicate}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </InfoDialog>
        }
      </div>
    </div>
  );
};
export default Admin123;
