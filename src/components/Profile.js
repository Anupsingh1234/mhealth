import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import {
  getUserDetailsHandler,
  updateUserDetailsHandler,
  updateAvatarAndAliasHandler,
  validateAliasName,
  getDashboardTabs,
} from "../services/userprofileApi";
import { urlPrefix } from "../services/apicollection";
import axios from "axios";
import Message from "antd-message";
import Avatar from "@material-ui/core/Avatar";
import { APP } from "../utils/appConfig";
import TopUserDetails from "./TopUserDetails";
import DatePicker from "./DatePicker";
import message from "antd-message";
import * as Icon from "react-feather";
import InfoDialog from "./Utility/InfoDialog";
import CancelIcon from "@material-ui/icons/Cancel";
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
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import classNames from "classnames";
import { PrimaryButton, SecondaryButton } from "./Form";

import moment from "moment";
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
const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    country: "",
    emailId: "",
    gender: "",
    city: "",
    dob: "",
    avtarImg: "",
    avtarImgObject: "",
    aliasName: "",
    authorizedDatasource: [],
    state: "",
    pinCode: "",
    dashboard_default_tab: "",
    dashboard_view_status: "",
    emailVerified: "",
    address: "",
    defaultEvent:'',
  });

  const [isLoadingUserDetails, setLoadingUserDetails] = useState(false);
  const [isLoadingAvatar, setLoadingAvatar] = useState(false);
  const [isCheckingAlias, setCheckingAlias] = useState(false);
  const [aliasErrMessage, setAliasErrMessage] = useState("");
  const [profileUpdatedFlag, setProfileUpdatedFlag] = useState(false);
  const [listOfTabs, setListOfTabs] = useState([]);
  const [depenName, setDepenName] = useState();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [activeEventList,setActiveEventList]=useState([])
  const [emailValidVerifiedMessage, setEmailValidVerifiedMessage] =
    useState(false);

  const headCells = [
    {
      label: "S.No",
      id: "index",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Name",

      id: "firstName",
      numeric: false,
      disablePadding: true,
    },

    {
      label: "Relation",
      id: "dependantRelation",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "D.O.B.",
      id: "dob",
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
      label: "Contact Detail",
      id: "contactDetails",
      numeric: false,
      disablePadding: true,
    },
    {
      label: "Update",
      // id: 'contactDetails',
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
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };
  useEffect(() => {
    getActiveEvent()
    getDependent();
    getUserDetailsHandler()
      .then((res) => {
        setUserDetails({
          ...userDetails,
          firstName: res.data.response.responseData.firstName,
          lastName: res.data.response.responseData.lastName,
          country: res.data.response.responseData.country,
          emailId:
            res.data.response.responseData.emailId !== null
              ? res.data.response.responseData.emailId
              : "",
          gender: res.data.response.responseData.gender,
          city: res.data.response.responseData.city,
          dob: res.data.response.responseData.dob
            ? res.data.response.responseData.dob.split(" ")[0]
            : "",
          avtarImg: res.data.response.responseData.avtarImg,
          aliasName: res.data.response.responseData.aliasName,
          authorizedDatasource:
            res.data.response.responseData.authorizedDatasource,
          state: res.data.response.responseData.state,
          pinCode: res.data.response.responseData.pinCode,
          dashboard_default_tab:
            res.data.response.responseData.dashboard_default_tab,
          dashboard_view_status:
            res.data.response.responseData.dashboard_view_status,
          emailVerified: res.data.response.responseData.emailVerified,
          address: res.data.response.responseData.address,
          defaultEvent:res.data.response.responseData.defaultEvent
        });
        localStorage.setItem(
          "authorizedDatasource",
          JSON.stringify(res.data.response.responseData.authorizedDatasource)
        );

        localStorage.setItem(
          "emailVerified",
          res.data.response.responseData.emailVerified
        );
        localStorage.setItem(
          "dashboard_default_tab",
          res.data.response.responseData.dashboard_default_tab
        );
        localStorage.setItem(
          "dashboard_view_status",
          res.data.response.responseData.dashboard_view_status
        );
      })
      .catch((err) => {});

    getDashboardTabs()
      .then((res) => {
        console.log(res);
        if (res.data.response && res.data.response.responseData) {
          setListOfTabs(res.data.response.responseData);
        } else {
          setListOfTabs([]);
        }
      })
      .catch((err) => {
        setListOfTabs([]);
      });
  }, []);

  const handleInputChange = (type, value) => {
    setUserDetails({
      ...userDetails,
      [type]: value,
    });
  };
  const getDependent = () => {
    const adminurl = `${urlPrefix}v1.0/getUserDependents`;
    //  setDependentValue(true);
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
      })
      .then((res) => {
        console.log(res.data.response.responseData);
        setDepenName(res.data.response?.responseData);
      });
  };
  const getActiveEvent = () => {
    const adminurl = `${urlPrefix}v1.0/getUserActiveRegisterEvents`;
    //  setDependentValue(true);
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
      })
      .then((res) => {
        console.log(res.data.response.responseData);
        setActiveEventList(res.data.response?.responseData);
      });
  };
  const updateEmail = () => {
    const adminurl = `${urlPrefix}v1.0/validateProfileEmailId`;

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
        setEmailValidVerifiedMessage(true);
      });
  };
  const modalClose = () => {
    setEmailValidVerifiedMessage(false);
  };
  const [addDept, setAddDept] = useState({
    contactDetail: "",
    dependantRelation: "",
    firstName: "",
    dob: "",
    gender: "",
    lastName: "",
  });
  const [editDept, setEditDept] = useState(addDept);
  const editDependent = (id) => {
    var marvelHeroes = depenName.filter(function (hero) {
      const x = hero.id == id;
      return x;
    });

    setAddDept(marvelHeroes && marvelHeroes[0], "marvels");
  };
  console.log(addDept, "edit dept");
  const [error1, setError1] = useState(false);
  const inputDept = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setAddDept((values) => ({ ...values, [name]: value }));
    // setError1((values) => ({...values, [name]: value}));
  };
  const [message1, setMessage1] = useState("");
  console.log(userDetails);
  const submitdept = (e) => {
    e.preventDefault();
    if (
      addDept?.firstName !== "" &&
      addDept?.gender !== "" &&
      addDept?.dependantRelation !== ""
    ) {
      // setLoadingUserDetails(true);
      let payload = {
        id: null || addDept.id,
        contactDetail: addDept.contactDetail,
        dependantRelation: addDept.dependantRelation,
        firstName: addDept.firstName,
        dob: addDept.dob ? addDept.dob : null,
        gender: addDept.gender,
        lastName: addDept.lastName,
      };
      const adminurl = `${urlPrefix}v1.0/createOrUpdateDependent`;
      //  setDependentValue(true);
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
          getDependent();
          // , setDeptValue(false);
          setError1(false);
          setAddDept({
            contactDetail: "",
            dependentRelation: "",
            firstName: "",
            dob: "",
            gender: "",
            lastName: "",
          });
          Message.success(res.data.response.responseMessage);
        });
    } else {
      setError1(true);
    }
  };
  const handleUserDetailSubmit = () => {
    window.message = Message;
    const {
      country,
      firstName,
      lastName,
      emailId,
      gender,
      city,
      dob,
      state,
      pinCode,
      dashboard_default_tab,
      dashboard_view_status,
      emailVerified,
      address,
      defaultEvent,
    } = userDetails;

    if (!userDetails.country || userDetails.country === "") {
      message.error("Country cannot be empty");
      return;
    }
    if (dashboard_view_status === "" && dashboard_default_tab === "") {
      message.error("Default Tab and View cannot be empty");
      return;
    }
    if (!dashboard_default_tab || dashboard_default_tab === "") {
      message.error("Default Tab cannot be empty");
      return;
    }

    if (dashboard_view_status === "") {
      message.error("Default View cannot be empty");
      return;
    }
    if (emailId === "") {
      message.error("Default View cannot be empty");
      return;
    }

    setLoadingUserDetails(true);
    let payload = {};

    if (firstName && firstName !== "") {
      payload["firstName"] = firstName;
    }

    if (address && address !== "") {
      payload["address"] = address;
    }
    if (lastName && lastName !== "") {
      payload["lastName"] = lastName;
    }
    if (country && country !== "") {
      payload["country"] = APP.countryCode[country.toUpperCase()];
    }
    if (emailId && emailId !== "") {
      payload["emailId"] = emailId;
    }
    if (gender && gender !== "") {
      payload["gender"] = gender;
    }
    if (city && city !== "") {
      payload["city"] = city;
    }
    if (state && state !== "") {
      payload["state"] = state;
    }
    if (pinCode && pinCode !== "") {
      payload["pinCode"] = pinCode;
    }
    if(defaultEvent&&defaultEvent!=="")
    {
      payload["defaultEvent"]=defaultEvent
    }
    if (dob && dob !== "") {
      payload["dob"] = dob + " 12:00:00";
    }

    if (dashboard_default_tab && dashboard_default_tab != "") {
      payload["dashboard_default_tab"] = dashboard_default_tab;
    }
    if (dashboard_view_status == 0 || dashboard_view_status == 1) {
      payload["dashboard_view_status"] = dashboard_view_status;
    }
    // if (
    //   userDetails.emailVerified === null ||
    //   userDetails.emailVerified !== null
    // ) {
    //   payload['emailVerified'] = emailVerified;
    // }

    updateUserDetailsHandler(payload)
      .then((res) => {
        setLoadingUserDetails(false);
        setUpdateAgain(true);
        getUserDetailsHandler();
        setProfileUpdatedFlag(true);
        message.success("Profile Updated");
        console.log(emailVerified);
        localStorage.setItem("emailId", payload.emailId);
        localStorage.setItem("gender", payload.gender);
        localStorage.setItem("dob", payload.dob);
        localStorage.setItem("state", payload.state);
        localStorage.setItem("pinCode", payload.pinCode);
        localStorage.setItem(
          "dashboard_default_tab",
          payload.dashboard_default_tab
        );
        console.log(localStorage.setItem("emailVerified", emailVerified));
        localStorage.setItem(
          "dashboard_view_status",
          payload.dashboard_view_status
        );
      })
      .catch((err) => {
        setLoadingUserDetails(false);
        message.error("Something went wrong");
      });
  };
  console.log(localStorage.getItem("emailVerified") === null);
  const updateAvatrAndAlias = () => {
    window.message = Message;
    setCheckingAlias(true);
    validateAliasName(userDetails.aliasName)
      .then((res) => {
        setCheckingAlias(false);
        if (res.data.response.responseCode === 181) {
          setAliasErrMessage(res.data.response.responseMessage);
          message.warning("Failed to update");
          return false;
        } else {
          setAliasErrMessage("");
        }

        const { avtarImgObject, aliasName } = userDetails;
        setLoadingAvatar(true);
        const formData = new FormData();
        if (avtarImgObject && avtarImgObject !== "") {
          formData.append("avatar", avtarImgObject);
        }

        if (avtarImgObject || aliasName) {
          updateAvatarAndAliasHandler(aliasName, formData)
            .then((res) => {
              setLoadingAvatar(false);
              setProfileUpdatedFlag(true);
              if (res.data.response.responseCode === 0) {
                localStorage.setItem("aliasName", userDetails.aliasName);
                localStorage.setItem("avatarImg", userDetails.avtarImg);
                message.success("Updated Successfully!!!");
                setUpdateAgain(!updateAgain);
              }
            })
            .catch((err) => {
              setLoadingAvatar(false);
              message.error("Something went wrong");
            });
        }
      })
      .catch((err) => {
        message.error("Failed to save. Try again");
      });
  };

  const {
    firstName,
    lastName,
    country,
    emailId,
    gender,
    city,
    dob,
    state,
    pinCode,
    dashboard_default_tab,
    dashboard_view_status,
    address,
    defaultEvent,
  } = userDetails;

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
          setUserDetails({
            ...userDetails,
            avtarImgObject: files[0],
            avtarImg: res,
          });
        });
      }
    }
  };

  const [updateAgain, setUpdateAgain] = useState(false);
  return (
    <>
      <div className="Profile">
        <TopUserDetails updateAgain={updateAgain} />
        <Navbar />
        <div className="flex flex-col min-h-[100vh] bg-[#518ad6] justify-center items-center md:ml-20">
          <div className="basic-info flex-row gap-2 justify-center items-center">
            <div className="bg-white mr-2 rounded-md p-4">
              <div className="mhealth-input-box padding-05em">
                <label>Avatar</label>
                <div className="avatar-container">
                  <div className="avatar">
                    <Avatar
                      src={userDetails.avtarImg}
                      className="avatar-size"
                      style={{ border: "2px solid #fff" }}
                    />
                  </div>
                  {window.location.href !==
                  "https://weblite.mhealth.ai/#/profile" ? (
                    <>
                      <input
                        id="avatar-select-input"
                        className="select-avatar-input"
                        type="file"
                        onChange={(e) => {
                          onFileChange(e);
                        }}
                      />{" "}
                      {userDetails.avtarImg ? (
                        ""
                      ) : (
                        <span
                          className="space"
                          style={{ color: "red", fontSize: 11 }}
                        >
                          {" "}
                          Image size should not exceed 2 MB.{" "}
                        </span>
                      )}
                      <div className="w-full">
                        <SecondaryButton
                          mini
                          className="mt-2"
                          onClick={() => {
                            document
                              .getElementById("avatar-select-input")
                              .click();
                          }}
                        >
                          Select
                        </SecondaryButton>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div
                className="mhealth-input-box padding-05em"
                style={{ marginTop: "-4%" }}
              >
                <label>Alias Name</label>
                <input
                  placeholder="Enter your alias name"
                  value={userDetails.aliasName}
                  onChange={(e) =>
                    handleInputChange("aliasName", e.target.value)
                  }
                  style={{
                    background: aliasErrMessage ? "#FDA4AF" : null,
                  }}
                />
                <label className="input-error">{aliasErrMessage}</label>
              </div>
              <div className="avatarSave">
                <PrimaryButton
                  mini
                  className="flex ml-auto text-sm"
                  onClick={() => updateAvatrAndAlias()}
                >
                  {isCheckingAlias
                    ? "Checking Alias"
                    : isLoadingAvatar
                    ? "Saving..."
                    : "Save"}
                </PrimaryButton>
              </div>
            </div>

            <div className="bg-white mr-2 rounded-md p-4 flex flex-col gap-2">
              <div className="flex">
                <div className="mhealth-input-box padding-05em">
                  <label className="text-black">First name</label>
                  <input
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                  />
                </div>
                <div className="mhealth-input-box padding-05em">
                  <label>Last name</label>
                  <input
                    placeholder="Enter your last name"
                    value={lastName}
                    style={{ width: "90%" }}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex">
                <div style={{ width: "70%" }}>
                  <div className="mhealth-input-box padding-05em">
                    <label>Email ID</label>
                    <input
                      placeholder="Enter your email id"
                      value={emailId}
                      onChange={(e) =>
                        handleInputChange("emailId", e.target.value)
                      }
                    />
                  </div>
                  {(emailId.length > 1 &&
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gi.test(
                      emailId.toString()
                    ) === false) ||
                  (emailId.match(/[.]/gi) || []).length === 3 ? (
                    // /[-]/gi.test(emailId.toString()) === false ? (
                    <p
                      style={{
                        color: "red",

                        marginTop: "0%",
                      }}
                    >
                      Invalid input
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div style={{ width: "30%" }}>
                  <label>Validation</label>
                  <br />

                  {userDetails.emailVerified === null ? (
                    <>
                      <div className="flex items-center mt-3">
                        {" "}
                        <Icon.XCircle
                          style={{
                            color: "red",
                          }}
                        />{" "}
                        {emailId !== "" &&
                        /[.]/gi.test(emailId.toString()) === true &&
                        // /[@]/gi.test(emailId.toString()) === true &&
                        /[!]/gi.test(emailId.toString()) === false &&
                        ('"' + emailId + '"').search(
                          /[.][.]/i || /[.][A-Z][.]/i || /[A-Z][!][A-Z]/i
                        ) === -1 &&
                        (emailId.match(/[.]/gi) || []).length < 3 &&
                        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gi.test(
                          emailId.toString()
                        ) ? (
                          <div className="flex ml-1 items-center justify-center">
                            <PrimaryButton
                              mini
                              className="w-[max-content] text-xs px-2 py-2"
                              onClick={updateEmail}
                            >
                              {" "}
                              Validate
                            </PrimaryButton>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <Icon.CheckCircle
                        style={{
                          color: "green",
                          marginTop: "10%",
                          marginLeft: "10%",
                        }}
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="flex">
                <div className="mhealth-input-box padding-05em">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={gender}
                    width={"100%"}
                    onChange={(e) => {
                      handleInputChange("gender", e.target.value);
                    }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="mhealth-input-box padding-05em">
                  <label>Date of birth (YYYY-MM-DD)</label>
                  <DatePicker
                    placeholder="Enter your Date of birth"
                    value={dob}
                    onChange={(e) => handleInputChange("dob", e)}
                  />
                </div>
                <div className="mhealth-input-box padding-05em">
                  <label>Default Event</label>
                  <select
                    
                    value={defaultEvent}
                    width="100%"
                    onChange={(e) => {
                      handleInputChange("defaultEvent", e.target.value);
                    }}
                  >
                    <option value="">Select</option>
                    {activeEventList&&activeEventList.map((item)=>{
                      return(<>
                    
                    <option value={item.id}>{item.challengeName}</option>
                    </>)
                    })}
                  </select>
                </div>
              </div>
              <div className="flex">
                <div className="mhealth-input-box padding-05em">
                  <label>City</label>
                  <input
                    placeholder="Enter your city"
                    style={{ width: "100%" }}
                    value={city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
                <div className="mhealth-input-box padding-05em">
                  <label>State</label>
                  <input
                    placeholder="Enter your state"
                    value={state}
                    style={{ width: "100%" }}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                  />
                </div>
                <div className="mhealth-input-box padding-05em">
                  <label>Country</label>
                  <input
                    placeholder="Enter your country"
                    value={country}
                    style={{ width: "100%" }}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex">
                <div className="mhealth-input-box padding-05em">
                  <label>Pin Code</label>
                  <input
                    placeholder="Enter your pin code"
                    value={pinCode}
                    style={{ width: "80%" }}
                    onChange={(e) =>
                      handleInputChange("pinCode", e.target.value)
                    }
                  />
                </div>
                <div
                  className="mhealth-input-box padding-05em"
                  style={{ width: "95%" }}
                >
                  <label>Default Tab</label>
                  <select
                    name="dashboard_default_tab"
                    value={dashboard_default_tab}
                    // style={{width: '100%'}}
                    onChange={(e) => {
                      handleInputChange(
                        "dashboard_default_tab",
                        e.target.value
                      );
                    }}
                  >
                    <option value="">Select Tab</option>
                    {listOfTabs.map((tab) => (
                      <option value={tab.dashboardTabName} key={tab.id}>
                        {tab.dashboardTabName
                          .split("_")
                          .join(" ")
                          .toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  className="mhealth-input-box padding-05em"
                  style={{ width: "95%" }}
                >
                  <label>Default View</label>
                  <select
                    name="dashboard_view_status"
                    value={dashboard_view_status}
                    style={{ width: "90%" }}
                    onChange={(e) => {
                      handleInputChange(
                        "dashboard_view_status",
                        e.target.value
                      );
                    }}
                  >
                    <option value="">Select View</option>
                    <option value={"0"}>Minimize</option>
                    <option value={"1"}>Maximize</option>
                  </select>
                </div>
              </div>
              <div className="flex">
                <div
                  style={{ width: "70%" }}
                  className="mhealth-input-box padding-05em"
                >
                  <label>Address</label>
                  <textarea
                    style={{
                      height: "50px",
                      width: "100%",
                      border: 0.1,
                      background: " var(--input-box)",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      width: "90%",
                      fontWeight: 600,
                    }}
                    placeholder="Enter Address"
                    name="address"
                    value={address}
                    onChange={(e) => {
                      handleInputChange("address", e.target.value);
                    }}
                  />
                </div>
                <div
                  style={{ width: "30%" }}
                  className="flex justify-end items-center"
                >
                  <div className="avatarSave">
                    <PrimaryButton
                      mini
                      className="w-[max-content] text-sm border"
                      onClick={() => handleUserDetailSubmit()}
                    >
                      {isLoadingUserDetails ? "Saving" : "Save"}
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-md p-4 flex flex-col gap-2">
              <p className="text-black mb-4" style={{ marginTop: "-5%" }}>
                Add Dependent
              </p>
              <div
                className="mhealth-input-box padding-05em"
                style={{ marginTop: "-8%" }}
              >
                <span className="text-black">
                  Relation
                  <span style={{ color: "red", fontSize: "20px" }}>
                    {error1 === true ? (
                      <>{addDept.dependantRelation === "" ? <>*</> : ""}</>
                    ) : (
                      ""
                    )}
                  </span>
                </span>

                <select
                  value={addDept.dependantRelation}
                  onChange={inputDept}
                  name="dependantRelation"
                >
                  <option>SELECT...</option>
                  <option value="MOTHER">MOTHER</option>
                  <option value="FATHER">FATHER</option>
                  <option value="SON">SON</option>
                  <option value="DAUGHTER">DAUGHTER</option>
                  <option value="SPOUSE">SPOUSE</option>
                  <option value="GRANDFATHER">GRANDFATHER</option>
                  <option value="GRANDMOTHER">GRANDMOTHER</option>
                  <option value="BROTHER">BROTHER</option>
                  <option value="SISTER">SISTER</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
              <div
                className="mhealth-input-box padding-05em"
                style={{ marginTop: "-8%" }}
              >
                <span className="text-black">
                  First Name{" "}
                  <span style={{ color: "red", fontSize: "20px" }}>
                    {error1 === true ? (
                      <>{addDept.firstName === "" ? <>*</> : ""}</>
                    ) : (
                      ""
                    )}
                  </span>
                </span>

                <input
                  placeholder="Enter First Name"
                  value={addDept.firstName}
                  onChange={inputDept}
                  name="firstName"
                />
              </div>
              <div
                className="mhealth-input-box padding-05em"
                style={{ marginTop: "-8%" }}
              >
                <label>Last Name </label>
                <input
                  placeholder="Enter Last Name"
                  value={addDept.lastName}
                  onChange={inputDept}
                  name="lastName"
                />
              </div>
              <div
                className="mhealth-input-box padding-05em"
                style={{ marginTop: "-8%" }}
              >
                <label>D.O.B</label>
                <input
                  placeholder="Enter your country"
                  type="date"
                  value={addDept.dob}
                  onChange={inputDept}
                  name="dob"
                />
              </div>
              <div
                className="mhealth-input-box padding-05em"
                style={{ marginTop: "-8%" }}
              >
                <span className="text-black">
                  Gender
                  <span style={{ color: "red", fontSize: "20px" }}>
                    {error1 === true ? (
                      <>{addDept.gender === "" ? <>*</> : ""}</>
                    ) : (
                      ""
                    )}
                  </span>
                </span>
                <select
                  value={addDept.gender}
                  onChange={inputDept}
                  name="gender"
                >
                  <option>SELECT...</option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                  <option value="OTHERS">OTHERS</option>
                </select>
              </div>
              <div
                className="mhealth-input-box padding-05em"
                style={{ marginTop: "-8%" }}
              >
                <label>Contact Details</label>
                <textarea
                  placeholder="Enter Contact Details"
                  style={{
                    height: "40px",
                    border: 0.1,
                    background: " var(--input-box)",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    width: "90%",
                    // marginTop: '-10px',
                    fontWeight: 600,
                  }}
                  value={addDept.contactDetail}
                  onChange={inputDept}
                  name="contactDetail"
                />
              </div>

              {/* <p style={{color: 'green', marginLeft: '50%'}}>{message1}</p> */}
              <div className="avatarSave flex justify-end" >
                <PrimaryButton
                  mini
                  className="w-[max-content] text-sm"
                  onClick={submitdept}
                >
                  {/* {isLoadingUserDetails ? 'Saving' : 'Save'} */}
                  Save
                </PrimaryButton>
              </div>
            </div>
          </div>
          <div className="basic-info-container">
            <div className="basic-info flex-row flex mx-auto">
              {depenName && depenName.length > 0 ? (
                <>
                  <div className="bg-white rounded-md p-4 mt-4">
                    {depenName && depenName.length > 0 ? (
                      <TablePagination
                        rowsPerPageOptions={[4, 5, 10]}
                        component="div"
                        count={depenName && depenName.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                      />
                    ) : (
                      <TablePagination
                        rowsPerPageOptions={[4, 5, 10]}
                        component="div"
                        count={0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                      />
                    )}{" "}
                    {depenName && depenName.length > 0 ? (
                      <>
                        <Table
                          className={classNames(classes.table)}
                          aria-labelledby="tableTitle"
                          size={"small"}
                          aria-label="enhanced table"
                        >
                          <EnhancedTableHead
                            style={{ fontSize: "5px" }}
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                          />
                          <TableBody>
                            {depenName &&
                              stableSort(
                                depenName,
                                getComparator(order, orderBy)
                              )
                                .slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                                )
                                .map((item, ind) => {
                                  return (
                                    <>
                                      <TableRow className="performace-table-row">
                                        {" "}
                                        <TableCell align="left">
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
                                              width: "150px",
                                              display: "block",
                                              overflow: "hidden",
                                              fontSize: 12,
                                            }}
                                          >
                                            {" "}
                                            <span style={{ fontSize: 12 }}>
                                              {item.firstName
                                                ? item.firstName +
                                                  " " +
                                                  item.lastName
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
                                              width: "100px",
                                              display: "block",
                                              overflow: "hidden",
                                              fontSize: 12,
                                            }}
                                          >
                                            {" "}
                                            {item.dependantRelation
                                              ? item.dependantRelation
                                              : "  -     "}
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
                                              width: "100px",
                                              display: "block",
                                              overflow: "hidden",
                                              fontSize: 12,
                                            }}
                                          >
                                            {" "}
                                            {item.dob ? item.dob : "  -     "}
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
                                              width: "70px",
                                              display: "block",
                                              overflow: "hidden",
                                              fontSize: 12,
                                            }}
                                          >
                                            {item.gender
                                              ? item.gender
                                              : "  -     "}
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
                                              width: "100px",
                                              display: "block",
                                              overflow: "hidden",
                                              fontSize: 12,
                                            }}
                                          >
                                            {" "}
                                            {item.contactDetails
                                              ? item.contactDetails
                                              : "  -     "}
                                          </p>
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex justify-center items-center">
                                            <PrimaryButton
                                              mini
                                              className="w-[max-content] text-[10px]"
                                              onClick={() =>
                                                editDependent(item.id)
                                              }
                                            >
                                              Edit
                                            </PrimaryButton>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    </>
                                  );
                                })}
                          </TableBody>
                        </Table>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        {emailValidVerifiedMessage && (
          <InfoDialog
            handleClose={() => setEmailValidVerifiedMessage(false)}
            open={emailValidVerifiedMessage}
          >
            <div style={{ height: "auto" }} className="px-4 py-6">
              <div className="">
                <CancelIcon
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    color: "#ef5350",
                    cursor: "pointer",
                  }}
                  onClick={() => setEmailValidVerifiedMessage(false)}
                />
                <label>
                  {" "}
                  <p className="text-base font-semibold">
                    You will receive a validation link on your email-id, please
                    click on link to validate your email address.
                  </p>
                </label>
              </div>
              <PrimaryButton
                mini
                className="w-[max-content] text-sm ml-auto mr-4"
                onClick={modalClose}
              >
                Sure
              </PrimaryButton>
            </div>
          </InfoDialog>
        )}
      </div>
    </>
  );
};

export default Profile;
