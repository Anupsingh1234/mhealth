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
import message from "antd-message";
import { TextField } from "@material-ui/core";
import { EditAttributesSharp } from "@material-ui/icons";
import { PrimaryButton } from "./Form";
import classNames from "classnames";

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
    label: "PostTitle",

    id: "postTitle",
    numeric: false,
    disablePadding: true,
  },
  {
    label: "Medium",
    id: "source",
    numeric: false,
    disablePadding: true,
  },
  {
    label: "Description",
    id: "shortNote",
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

export default function SocialPostComponent() {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [post, setPost] = useState({
    eventId: localStorage.getItem("selectEvent"),
    postTitle: "",
    medium: "",
    shortNote: "",
    link: "",
  });
  const [Edit, setEdit] = useState(post);

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
  const handleSubmit = (e) => {
    e.preventDefault();
    let payload = {};
    payload = {
      id: null,
      eventId: localStorage.getItem("selectEvent"),
      postTitle: post.postTitle,
      medium: post.medium,
      shortNote: post.shortNote,
      link: post.link,
    };
    if (
      post.postTitle !== "" &&
      post.medium !== "" &&
      post.shortNote !== "" &&
      post.link !== ""
    ) {
      const adminurl = `${urlPrefix}v1.0/createAndUpdateSocialPosts`;
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
            postTitle: "",
            medium: "",
            shortNote: "",
            link: "",
          });

          if (res.data.mhealthResponseMessage === "SUCCESS") {
            console.log(res.data.response.responseMessage);
            Message.success(res.data.response.responseMessage);
            setResponseMessage(res.data.response.responseMessage);
          }
        });
    } else {
      Message.error("Please fill all filled Carefully!");
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    let payload = {};
    payload = {
      id: Edit.id,
      eventId: localStorage.getItem("selectEvent"),
      postTitle: Edit.postTitle,
      medium: Edit.medium,
      shortNote: Edit.shortNote,
      link: Edit.link,
    };
    // if (
    //   Edit.postTitle !== '' &&
    //   Edit.medium !== '' &&
    //   Edit.shortNote !== '' &&
    //   Edit.link !== ''
    // ) {
    const adminurl = `${urlPrefix}v1.0/createAndUpdateSocialPosts`;
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
        setEdit({
          eventId: localStorage.getItem("selectEvent"),
          postTitle: "",
          medium: "",
          shortNote: "",
          link: "",
        });
        if (res.data.mhealthResponseMessage === "SUCCESS") {
          console.log(res.data.response.responseMessage);
          Message.success(res.data.response.responseMessage);
          setEditResponseMessage(res.data.response.responseMessage);
        }
      });
  };

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
  const [responsemessage, setResponseMessage] = useState("");
  const [editresponsemessage, setEditResponseMessage] = useState("");
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
    var marvelHeroes = getsocialpost.filter(function (hero) {
      const x = hero.id == id;
      return x;
    });
    setEdit(marvelHeroes && marvelHeroes[0], "marvels");
  };
  const url = window.location.href;

  const word = url.indexOf("://");
  const lastword = url.indexOf(".mhealth");
  let b = lastword;
  let a = word + 3;
  window.key = url.substr(a, b - 8);

  const handle = () => {
    const adminurl = `${urlPrefix}clients/getSocialPosts?keyword=${window.key}`;

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
        // console.log(response.data.response.responseData);
        res.data ? setGetSocialPost(res?.data?.response?.responseData) : "";
      });
  };

  return (
    <div
      className={classNames(
        "bg-white w-[600px] flex flex-col items-center",
        "justify-center mt-2 rounded-lg border border-gray-200",
        "mt-12 px-4 py-2"
      )}
    >
      <h3>
        <u>Social Post</u>
      </h3>
      <div className="flex">
        <div>
          {addupdatePost === "addpost" || addupdatePost === "edit" ? (
            <PrimaryButton
              mini
              className="w-[max-content]"
              onClick={() => {
                setAddUpdatePost("updatepost"),
                  handle(),
                  setResponseMessage(""),
                  setEditResponseMessage("");
              }}
            >
              Update Post
            </PrimaryButton>
          ) : (
            <PrimaryButton
              mini
              className="w-[max-content]"
              onClick={() => {
                setAddUpdatePost("addpost"),
                  handle(),
                  setResponseMessage(""),
                  setEditResponseMessage("");
              }}
            >
              Add Post
            </PrimaryButton>
          )}
        </div>
      </div>

      {addupdatePost === "addpost" ? (
        <div style={{ width: "100%", marginLeft: "10%" }}>
          <form>
            <div>
              {/* {errorObj ? <p className="error-text">Please input</p> : ''} */}
              <label style={{ fontSize: 12 }}>Medium</label>
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
                value={post.medium}
                onChange={inputsHandler}
                name="medium"
              >
                <option value={undefined}>Select...</option>
                <option value="YOUTUBE">YOUTUBE</option>
                <option value="FACEBOOK">FACEBOOK</option>
                <option value="INSTAGRAM">INSTAGRAM</option>
                <option value="NUTRIEXPERT">NUTRIEXPERT</option>
                <option value="LINKEDIN">LINKEDIN</option>
              </select>
            </div>

            <div style={{ width: "100%" }}>
              <label style={{ fontSize: 12 }}>Post Title</label>
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
                name="postTitle"
                placeholder="Post Title...."
                value={post.postTitle}
                onChange={inputsHandler}
              />
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
                name="link"
                value={post.link}
                onChange={inputsHandler}
              />
            </div>
            <div style={{ width: "100%" }}>
              <label style={{ fontSize: 12 }}>Description</label>
              <br />
              <textarea
                // autofocus="autofocus"
                style={{
                  background: "#f3f4f6",
                  padding: "10px 10px",
                  borderRadius: 6,
                  fontSize: 12,
                  width: "77%",
                  border: "1px solid black",
                  // height: '50px',
                  color: "black",
                  height: "100px",
                }}
                name="shortNote"
                type="text"
                maxlength="500"
                placeholder="Write something about your post..."
                value={post.shortNote}
                onChange={inputsHandler}
              />
            </div>
            <br />
            <div style={{ display: "flex" }}>
              <div style={{ width: "65%" }}>
                {post.postTitle !== "" &&
                post.medium !== "" &&
                post.link !== "" &&
                post.shortNote !== "" ? (
                  <p style={{ marginLeft: "10px", color: "green" }}>
                    {responsemessage}
                  </p>
                ) : (
                  ""
                )}
              </div>
              <div style={{ marginLeft: "" }} className="mb-2">
                <PrimaryButton mini onClick={handleSubmit}>
                  Save Post
                </PrimaryButton>
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
            <div>
              {/* {errorObj ? <p className="error-text">Please input</p> : ''} */}
              <label style={{ fontSize: 12 }}>Medium</label>
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
                value={Edit.medium}
              ></input>
            </div>

            <div style={{ width: "100%" }}>
              <label style={{ fontSize: 12 }}>Post Title</label>
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
                name="postTitle"
                placeholder="Post Title...."
                // value={post.postTitle}
                value={Edit.postTitle}
                onChange={edithandler}
              />
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
                name="link"
                // value={post.link}
                value={Edit.link}
                onChange={edithandler}
              />
            </div>
            <div style={{ width: "100%" }}>
              <label style={{ fontSize: 12 }}>Description</label>
              <br />
              <textarea
                // autofocus="autofocus"
                style={{
                  background: "#f3f4f6",
                  padding: "10px 10px",
                  borderRadius: 6,
                  fontSize: 12,
                  width: "77%",
                  border: "1px solid black",
                  // height: '50px',
                  color: "black",
                  height: "100px",
                }}
                name="shortNote"
                type="text"
                maxlength="500"
                placeholder="Write something about your post..."
                value={Edit.shortNote}
                onChange={edithandler}
              />
            </div>
            <br />
            <div style={{ display: "flex" }}>
              <div style={{ width: "65%" }}>
                {Edit.postTitle !== "" ||
                Edit.medium !== "" ||
                Edit.link !== "" ||
                Edit.shortNote !== "" ? (
                  <p style={{ marginLeft: "10px", color: "green" }}>
                    {editresponsemessage}
                  </p>
                ) : (
                  ""
                )}
              </div>
              <div style={{ marginTop: "-10px" }}>
                <PrimaryButton
                  mini
                  className="w-[max-content] text-sm"
                  onClick={handleUpdate}
                >
                  Save Post
                </PrimaryButton>
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
            <Paper>
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
                        stableSort(getsocialpost, getComparator(order, orderBy))
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
                                    {row.postTitle}
                                  </div>
                                </TableCell>

                                <TableCell align="left">
                                  <div
                                    style={{
                                      fontSize: 12,
                                    }}
                                  >
                                    {row.medium}
                                  </div>
                                </TableCell>
                                <TableCell align="left">
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
                                    {row.shortNote}
                                  </div>
                                </TableCell>

                                <TableCell align="left">
                                  <PrimaryButton
                                    mini
                                    className="w-[max-content] text-sm"
                                    onClick={() => {
                                      editVal(row.id),
                                        setAddUpdatePost("edit"),
                                        setResponseMessage(""),
                                        setEditResponseMessage("");
                                    }}
                                  >
                                    Edit
                                  </PrimaryButton>
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
            </Paper>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
