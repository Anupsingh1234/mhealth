import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
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

import axios from "axios";

import { urlPrefix, secretToken } from "../services/apicollection";
import InfoDialog from "./Utility/InfoDialog";
// import { Message } from '@material-ui/icons';

function getModalStyle() {
  return {
    position: "absolute",
    top: "50%",
    left: "50%",
    background: "#fff",
    transform: "translate(-50%, -50%)",
    width: "200px",
    outline: "none",
    padding: "15px",
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
  paper: {
    position: "absolute",
    width: 800,
    maxWidth: "100%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: "90vh",
    overflow: "scroll",
  },
  root: {
    width: "100%",
  },
  paper1: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 500,
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
    label: "Medium",

    id: "socialMedia",
    numeric: false,
    disablePadding: true,
  },
  {
    label: "Media Link",
    id: "mediaLink",
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
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [height1, width1] = useWindowSize();
  const handleClose = () => {
    setModalView(false);
  };
  const [errorObj, setErrorObj] = useState({});
  const [post, setPost] = useState({
    eventId: localStorage.getItem("selectEvent"),
    socialMedia: "",
    mediaLink: "",
  });
  const editVal = (id) => {
    var marvelHeroes = getsocialpost.filter(function (hero) {
      const x = hero.id == id;
      return x;
    });
    // setPosttpos(marvelHeroes && , 'marvels');
    setEdit(marvelHeroes && marvelHeroes[0], "marvels");
  };
  const [Edit, setEdit] = useState(post);
  console.log(Edit, "editttt");
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
  const inputsHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setPost((values) => ({ ...values, [name]: value }));
  };
  console.log(post);
  const delay = 5;
  const [posteditmessage, setPostEditMessage] = useState("");
  const [responsemessage, setResponseMessage] = useState("");
  const [show, setShow] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    let payload = {};
    payload = {
      id: null,
      eventId: localStorage.getItem("selectEvent"),
      socialMedia: post.socialMedia,
      mediaLink: post.mediaLink,
    };
    console.log(payload, "payload");
    if (post.socialMedia !== "" && post.mediaLink !== "") {
      const adminurl = `${urlPrefix}v1.0/createOrUpdateSocialLinks`;
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
          setPost({
            eventId: localStorage.getItem("selectEvent"),
            socialMedia: "",
            mediaLink: "",
          });
          if (res.data.mhealthResponseMessage === "SUCCESS") {
            console.log(res.data.response.responseMessage);
            Message.success(res.data.response.responseMessage);
            setResponseMessage(res.data.response.responseMessage);
          }
          setPostEditMessage("post");
        });
    } else {
      Message.error("Please fill all filled Carefully!");
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    let payload1 = {};
    payload1 = {
      id: Edit.id,
      eventId: localStorage.getItem("selectEvent"),
      socialMedia: Edit.socialMedia,
      mediaLink: Edit.mediaLink,
    };
    console.log(payload1, "payload1");
    //  if (Edit.socialMedia !== '' && Edit.mediaLink !== '') {

    const adminurl = `${urlPrefix}v1.0/createOrUpdateSocialLinks`;
    return axios
      .post(adminurl, payload1, {
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
        setPostEditMessage("edit");
        setPost({
          eventId: localStorage.getItem("selectEvent"),
          socialMedia: "",
          mediaLink: "",
        });
        console.log(res);
        if (res.data.mhealthResponseMessage === "SUCCESS") {
          console.log(res.data.response.responseMessage);

          setEditResponseMessage(res.data.response.responseMessage);
        }
      });
    //  } else {
    //    setErrorObj;
    //  }
  };

  console.log(posteditmessage);
  useEffect(() => {
    //  handleSubmit();
  }, []);
  useEffect(() => {
    setPage(0);
    setOrder("asc");
    setOrderBy("");

    setRowsPerPage(25);
  }, []);
  const [addupdatePost, setAddUpdatePost] = useState("addpost");
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
  const url = window.location.href;
  // const url = 'https://raja.mhealth.ai/#/';

  const word = url.indexOf("://");
  const lastword = url.indexOf(".mhealth");
  let b = lastword;
  let a = word + 3;
  window.key = url.substr(a, b - 8);
  const [getsocialpost, setGetSocialPost] = useState([]);
  const handle = () => {
    const adminurl = `${urlPrefix}clients/getSocialMediaLink?keyword=${window.key}`;
    console.log(adminurl);
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
        // console.log(res.data.response.responseData);
        setGetSocialPost(res?.data?.response?.responseData);
      });
  };
  // console.log(getsocialpost);

  const edithandle = (id) => {
    setEditModal(true);
  };
  // const edit = JSON.parse(localStorage.getItem('edittttt'));
  const modalBody = (
    <>
      {width1 < 769 ? (
        <div
          style={{
            width: "90%",
            position: "fixed",
            transform: "translate(5%,20%)",
          }}
        >
          <Paper>
            <center>
              <h3>
                <u>Social Link</u>
              </h3>
            </center>
            <div style={{ display: "flex" }}>
              <div style={{ width: "75%" }}></div>

              <div style={{}}>
                {addupdatePost === "addpost" || addupdatePost === "edit" ? (
                  <button
                    className="is-success"
                    // onClick={handleSubmit}
                    style={{
                      marginTop: 0,
                      width: 100,
                      height: 32,
                      // marginLeft: 20,
                    }}
                    onClick={() => {
                      setAddUpdatePost("updatepost"),
                        handle(),
                        setResponseMessage(""),
                        setEditResponseMessage("");
                    }}
                  >
                    Update Link
                  </button>
                ) : (
                  <button
                    className="is-success"
                    // onClick={handleSubmit}
                    style={{
                      marginTop: 0,
                      width: 100,
                      height: 32,
                      // marginLeft: 20,
                    }}
                    onClick={() => {
                      setAddUpdatePost("addpost"),
                        handle(),
                        setResponseMessage(""),
                        setEditResponseMessage("");
                    }}
                  >
                    Add Link
                  </button>
                )}
              </div>
            </div>

            {addupdatePost === "addpost" ? (
              <div style={{ width: "100%", marginLeft: "10%" }}>
                <form>
                  <div style={{ width: "100%" }}>
                    {/* {errorObj ? <p className="error-text">Please input</p> : ''} */}
                    <label style={{ fontSize: 12 }}>Social Media</label>
                    <br />
                    <select
                      autofocus="autofocus"
                      style={{
                        background: "#f3f4f6",
                        padding: "10px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        width: "80%",
                        border: "1px solid black",
                      }}
                      value={post.socialMedia}
                      onChange={inputsHandler}
                      name="socialMedia"
                    >
                      <option value={undefined}>Select...</option>
                      <option value="youtube">YOUTUBE</option>
                      <option value="facebook">FACEBOOK</option>
                      <option value="instagram">INSTAGRAM</option>
                      <option value="address">ADDRESS</option>
                      <option value="whatsapp">WHATSAPP</option>
                      <option value="snapchat">SNAPCHAT</option>
                      <option value="twitter">TWITTER</option>
                      <option value="linkedin">LINKEDIN</option>
                      <option value="reddit"> REDDIT</option>
                      <option value="pinterest">PINTEREST</option>
                      <option value="gmail">GMAIL</option>
                    </select>
                  </div>

                  <div style={{ width: "100%" }}>
                    <label style={{ fontSize: 12 }}>Link</label>
                    <br />
                    <input
                      autofocus="autofocus"
                      style={{
                        background: "#f3f4f6",
                        padding: "10px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        width: "77%",
                        border: "1px solid black",
                      }}
                      placeholder="media Link....."
                      name="mediaLink"
                      value={post.mediaLink}
                      onChange={inputsHandler}
                    />
                  </div>

                  <br />
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "60%" }}>
                      {post.mediaLink !== "" && post.socialMedia !== "" ? (
                        <p style={{ marginLeft: "10px", color: "green" }}>
                          {responsemessage}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div style={{ marginLeft: "" }}>
                      <button
                        className="is-success"
                        onClick={handleSubmit}
                        style={{
                          marginTop: 10,
                          width: 100,
                          height: 32,
                          // marginLeft: 20,
                        }}
                      >
                        Save Link
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              ""
            )}

            {addupdatePost === "edit" ? (
              <div style={{ width: "100%", marginLeft: "10%" }}>
                <form>
                  <div style={{ width: "100%" }}>
                    {/* {errorObj ? <p className="error-text">Please input</p> : ''} */}
                    <label style={{ fontSize: 12 }}>Social Media</label>
                    <br />
                    <input
                      autofocus="autofocus"
                      style={{
                        background: "#f3f4f6",
                        padding: "10px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        width: "77%",
                        border: "1px solid black",
                      }}
                      placeholder="YOUTUBE/ FACEBOOK/ INSTAGRAM/ NUTRIEXPERT/LINKEDIN"
                      // value={post.medium}
                      value={Edit.socialMedia}
                      // onChange={edithandler}
                      // name="socialMedia"
                    ></input>
                  </div>

                  <div style={{ width: "100%" }}>
                    <label style={{ fontSize: 12 }}>Link</label>
                    <br />
                    <input
                      autofocus="autofocus"
                      style={{
                        background: "#f3f4f6",
                        padding: "10px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        width: "77%",
                        border: "1px solid black",
                      }}
                      placeholder="Social Link....."
                      name="mediaLink"
                      // value={post.link}
                      value={Edit.mediaLink}
                      onChange={edithandler}
                    />
                  </div>

                  <br />
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "60%" }}>
                      {Edit.mediaLink !== "" && Edit.socialMedia !== "" ? (
                        <p style={{ marginLeft: "10px", color: "green" }}>
                          {editresponsemessage}
                        </p>
                      ) : (
                        <p style={{ marginLeft: "10px", color: "red" }}>
                          {editresponsemessage}
                        </p>
                      )}
                    </div>
                    <div style={{ marginLeft: "" }}>
                      <button
                        className="is-success"
                        onClick={handleUpdate}
                        style={{
                          marginTop: 0,
                          width: 100,
                          height: 32,
                          // marginLeft: 20,
                        }}
                      >
                        Save Link
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              ""
            )}

            {addupdatePost === "updatepost" ? (
              <>
                <div style={{ display: "flex" }}>
                  <TableContainer>
                    {getsocialpost && getsocialpost.length > 0 ? (
                      <TablePagination
                        rowsPerPageOptions={[25, 50, 75, 100]}
                        component="div"
                        count={getsocialpost && getsocialpost.length}
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
                        count={0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                      />
                    )}

                    {getsocialpost && getsocialpost.length > 0 ? (
                      <Table
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
                          {/* {radioValue === 'Daily' || radioValue === undefined ? (
                    <> */}
                          {getsocialpost &&
                            stableSort(
                              getsocialpost,
                              getComparator(order, orderBy)
                            )
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((row, index) => {
                                return (
                                  <TableRow
                                    hover
                                    tabIndex={-1}
                                    // key={row.userId + '' + index}
                                    className="performace-table-row"
                                  >
                                    <TableCell align="center">
                                      <div style={{ fontSize: 12 }}>
                                        {index + 1}
                                      </div>
                                    </TableCell>
                                    <TableCell align="left">
                                      <div style={{ fontSize: 12 }}>
                                        {row.socialMedia}
                                      </div>
                                    </TableCell>

                                    <TableCell align="left" width="20px">
                                      <div
                                        style={{
                                          whiteSpace: "nowrap",
                                          textOverflow: "ellipsis",
                                          width: "200px",
                                          display: "block",
                                          overflow: "hidden",
                                          fontSize: 12,
                                        }}
                                      >
                                        {row.mediaLink}
                                      </div>
                                    </TableCell>

                                    <TableCell align="center">
                                      <button
                                        className="is-success"
                                        style={{
                                          marginTop: 0,
                                          width: 70,
                                          height: 20,
                                          // marginLeft: 20,
                                        }}
                                        onClick={() => {
                                          editVal(row.id),
                                            setAddUpdatePost("edit");
                                        }}
                                      >
                                        Edit
                                      </button>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                          {/* </>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        style={{
                          position: 'relative',
                          height: 100,
                        }}
                      >
                        <p
                          style={{
                            textAlign: 'center',
                            margin: '100px 0',
                            color: '#8e8e8e',
                          }}
                        >
                          {data.message === 'SUCCESS'
                            ? 'Data is not present'
                            : data.message}
                        </p>
                      </TableCell>
                    </TableRow>
                  )} */}
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
                </div>
              </>
            ) : (
              ""
            )}
            <CancelIcon
              style={{
                position: "absolute",
                top: 10,
                right: 5,
                color: "#ef5350",
                cursor: "pointer",
              }}
              onClick={() => handleClose()}
            />
          </Paper>
        </div>
      ) : (
        <div
          style={{
            width: "40%",
            // position: 'fixed',
            transform: "translate(70%,40%)",
            height: "200px",
          }}
        >
          <Paper>
            <center>
              <h3>
                <u>Social Link</u>
              </h3>
            </center>
            <div style={{ display: "flex" }}>
              <div style={{ width: "75%" }}></div>

              <div style={{}}>
                {addupdatePost === "addpost" || addupdatePost === "edit" ? (
                  <button
                    className="is-success"
                    // onClick={handleSubmit}
                    style={{
                      marginTop: 0,
                      width: 100,
                      height: 32,
                      // marginLeft: 20,
                    }}
                    onClick={() => {
                      setAddUpdatePost("updatepost"),
                        handle(),
                        setResponseMessage(""),
                        setEditResponseMessage("");
                    }}
                  >
                    Update Link
                  </button>
                ) : (
                  <button
                    className="is-success"
                    // onClick={handleSubmit}
                    style={{
                      marginTop: 0,
                      width: 100,
                      height: 32,
                      // marginLeft: 20,
                    }}
                    onClick={() => {
                      setAddUpdatePost("addpost"),
                        handle(),
                        setResponseMessage(""),
                        setEditResponseMessage("");
                    }}
                  >
                    Add Link
                  </button>
                )}
              </div>
            </div>

            {addupdatePost === "addpost" ? (
              <div style={{ width: "100%", marginLeft: "10%" }}>
                <form>
                  <div style={{ width: "100%" }}>
                    {/* {errorObj ? <p className="error-text">Please input</p> : ''} */}
                    <label style={{ fontSize: 12 }}>Social Media</label>
                    <br />
                    <select
                      autofocus="autofocus"
                      style={{
                        background: "#f3f4f6",
                        padding: "10px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        width: "80%",
                        border: "1px solid black",
                      }}
                      value={post.socialMedia}
                      onChange={inputsHandler}
                      name="socialMedia"
                    >
                      <option value={undefined}>Select...</option>
                      <option value="youtube">YOUTUBE</option>
                      <option value="facebook">FACEBOOK</option>
                      <option value="instagram">INSTAGRAM</option>
                      <option value="address">ADDRESS</option>
                      <option value="whatsapp">WHATSAPP</option>
                      <option value="snapchat">SNAPCHAT</option>
                      <option value="twitter">TWITTER</option>
                      <option value="linkedin">LINKEDIN</option>
                      <option value="reddit"> REDDIT</option>
                      <option value="pinterest">PINTEREST</option>
                      <option value="gmail">GMAIL</option>
                    </select>
                  </div>

                  <div style={{ width: "100%" }}>
                    <label style={{ fontSize: 12 }}>Link</label>
                    <br />
                    <input
                      autofocus="autofocus"
                      style={{
                        background: "#f3f4f6",
                        padding: "10px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        width: "77%",
                        border: "1px solid black",
                      }}
                      placeholder="media Link....."
                      name="mediaLink"
                      value={post.mediaLink}
                      onChange={inputsHandler}
                    />
                  </div>

                  <br />
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "68%" }}>
                      {post.mediaLink !== "" && post.socialMedia !== "" ? (
                        <p style={{ marginLeft: "10px", color: "green" }}>
                          {responsemessage}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div style={{ marginLeft: "" }}>
                      <button
                        className="is-success"
                        onClick={handleSubmit}
                        style={{
                          marginTop: 10,
                          width: 100,
                          height: 32,
                          // marginLeft: 20,
                        }}
                      >
                        Save Link
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              ""
            )}

            {addupdatePost === "edit" ? (
              <div style={{ width: "100%", marginLeft: "10%" }}>
                <form>
                  <div style={{ width: "100%" }}>
                    {/* {errorObj ? <p className="error-text">Please input</p> : ''} */}
                    <label style={{ fontSize: 12 }}>Social Media</label>
                    <br />
                    <input
                      autofocus="autofocus"
                      style={{
                        background: "#f3f4f6",
                        padding: "10px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        width: "77%",
                        border: "1px solid black",
                      }}
                      placeholder="YOUTUBE/ FACEBOOK/ INSTAGRAM/ NUTRIEXPERT/LINKEDIN"
                      // value={post.medium}
                      value={Edit.socialMedia}
                      // onChange={edithandler}
                      // name="socialMedia"
                    ></input>
                  </div>

                  <div style={{ width: "100%" }}>
                    <label style={{ fontSize: 12 }}>Link</label>
                    <br />
                    <input
                      autofocus="autofocus"
                      style={{
                        background: "#f3f4f6",
                        padding: "10px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        width: "77%",
                        border: "1px solid black",
                      }}
                      placeholder="Social Link....."
                      name="mediaLink"
                      // value={post.link}
                      value={Edit.mediaLink}
                      onChange={edithandler}
                    />
                  </div>

                  <br />
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "68%" }}>
                      {Edit.mediaLink !== "" && Edit.socialMedia !== "" ? (
                        <p style={{ marginLeft: "10px", color: "green" }}>
                          {editresponsemessage}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div style={{ marginLeft: "" }}>
                      <button
                        className="is-success"
                        onClick={handleUpdate}
                        style={{
                          marginTop: 0,
                          width: 100,
                          height: 32,
                          // marginLeft: 20,
                        }}
                      >
                        Save Link
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              ""
            )}

            {addupdatePost === "updatepost" ? (
              <>
                <div>
                  <TableContainer>
                    {getsocialpost && getsocialpost.length > 0 ? (
                      <TablePagination
                        rowsPerPageOptions={[25, 50, 75, 100]}
                        component="div"
                        count={getsocialpost && getsocialpost.length}
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
                        count={0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                      />
                    )}

                    {getsocialpost && getsocialpost.length > 0 ? (
                      <Table
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
                          {/* {radioValue === 'Daily' || radioValue === undefined ? (
                    <> */}
                          {getsocialpost &&
                            stableSort(
                              getsocialpost,
                              getComparator(order, orderBy)
                            )
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((row, index) => {
                                return (
                                  <TableRow
                                    hover
                                    tabIndex={-1}
                                    // key={row.userId + '' + index}
                                    className="performace-table-row"
                                  >
                                    <TableCell align="center">
                                      <div style={{ fontSize: 12 }}>
                                        {index + 1}
                                      </div>
                                    </TableCell>
                                    <TableCell align="center">
                                      <div style={{ fontSize: 12 }}>
                                        {row.socialMedia}
                                      </div>
                                    </TableCell>

                                    <TableCell align="left" width="20%">
                                      <div
                                        // style={{
                                        //   fontSize: 12,

                                        // }}
                                        style={{
                                          whiteSpace: "nowrap",
                                          textOverflow: "ellipsis",
                                          width: "200px",
                                          display: "block",
                                          overflow: "hidden",
                                          fontSize: 12,
                                        }}
                                      >
                                        {row.mediaLink}
                                      </div>
                                    </TableCell>

                                    <TableCell align="center">
                                      <button
                                        className="is-success"
                                        style={{
                                          marginTop: 0,
                                          width: 70,
                                          height: 20,
                                          // marginLeft: 20,
                                        }}
                                        onClick={() => {
                                          editVal(row.id),
                                            setAddUpdatePost("edit");
                                        }}
                                      >
                                        Edit
                                      </button>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                          {/* </>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        style={{
                          position: 'relative',
                          height: 100,
                        }}
                      >
                        <p
                          style={{
                            textAlign: 'center',
                            margin: '100px 0',
                            color: '#8e8e8e',
                          }}
                        >
                          {data.message === 'SUCCESS'
                            ? 'Data is not present'
                            : data.message}
                        </p>
                      </TableCell>
                    </TableRow>
                  )} */}
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
                </div>
              </>
            ) : (
              ""
            )}
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
          </Paper>
        </div>
      )}
    </>
  );

  return (
    <div>
      <Modal
        open={modalView}
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
