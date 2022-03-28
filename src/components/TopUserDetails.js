import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import { withStyles } from "@material-ui/core/styles";
import * as Icon from "react-feather";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Expert from "./AppointmentExpert";
import SocialPost from "./SocialPost";
import SocialLink from "./SocialLink";
import { getOldEvents } from "../services/challengeApi";
import { SignalCellularNullRounded } from "@material-ui/icons";
import { PrimaryButton } from "./Form";
import HraReport from './HraReport'
const TopUserDetails = ({ updateAgain = false, subEventDetail }) => {
  let history = useHistory();
  const StyledMenu = withStyles({
    paper: {
      border: "1px solid #d3d4d5",
    },
  })((props) => {
    const [avatarImg, setAvatrImg] = useState("");

    return (
      <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        avatarImg={avatarImg}
        userDetails={userDetails}
        updateAgain={updateAgain}
        {...props}
      />
    );
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [appointmentView, setAppointmentView] = useState(false);
  const [sociallink, setSocialLink] = useState(false);
  const [socialPost, setSocialPost] = useState(false);
  const [hraModal,setHraModal]=useState(false)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    history.push("/");
  };
  const [admincondition, setAdminCondition] = useState();
  const [modiator, setmodiator] = useState();
  const [coach, setCoach] = useState();
  useEffect(() => {
    getOldEvents().then((res) => {
      // console.log({ res })
      localStorage.setItem(
        "condition",
        JSON.stringify(res?.data?.response?.responseData)
      );
      setAdminCondition(res?.data?.response?.responseData?.isAdmin);
      setmodiator(res?.data?.response?.responseData?.isModerator);
      setCoach(res?.data?.response?.responseData?.isCoach);
    });
  }, []);

  const [userDetails, setUserDetails] = useState({
    aliasName: "",
    avatarImg: "",
  });
  useEffect(() => {
    setUserDetails({
      aliasName: localStorage.aliasName,
      avatarImg: localStorage.avatarImg,
    });
  }, [localStorage.aliasName, localStorage.avatarImg, updateAgain]);
  return (
    <div>
      <div className="Avatar-Container">
        {coach === true ? (
          <>
            <div className="mr-2">
              <PrimaryButton
                mini
                onClick={() => {
                  setAppointmentView(true);
                }}
                className="mt-2"
              >
                Appointment
              </PrimaryButton>
              
              {appointmentView && (
                <Expert
                  challenge={subEventDetail}
                  // type="program"
                  modalView={appointmentView}
                  setModalView={setAppointmentView}
                  // setActivityModalView={setActivityModalView}
                  // actualData={actualData}
                />
              )}
            </div>
            <div className="mr-2">
              <PrimaryButton
                mini
                onClick={() => {
                  setHraModal(true);
                }}
                className="mt-2"
              >
                Report
              </PrimaryButton>
             
              {hraModal && (
                <HraReport
              
                  hraModal={hraModal}
                  setHraModal={setHraModal}
                
                />
              )}
            </div>
          </>
        ) : (
          ""
        )}
        <div className="dashboard-avatar" onClick={handleClick}>
          <Avatar
            src={userDetails.avatarImg}
            style={{
              width: 30,
              height: 30,
              border: "2px solid #f8f8f8",
            }}
          />
        </div>
        <div onClick={handleClick}>
          {localStorage.getItem("aliasName")
            ? userDetails.aliasName
            : `${localStorage.getItem("firstName")} ${localStorage.getItem(
                "lastName"
              )}`}
        </div>
        <Icon.ChevronDown onClick={handleClick} />
      </div>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {modiator === true ? (
          <>
            <div>
              <p onClick={() => setSocialPost(true)}>
                <span style={{ marginRight: 0, display: "flex" }}>
                  <Icon.Navigation />
                  Social Post
                </span>
              </p>

              {socialPost && (
                <SocialPost
                  challenge={subEventDetail}
                  modalView={socialPost}
                  setModalView={setSocialPost}
                />
              )}
            </div>
            <div>
              <p onClick={() => setSocialLink(true)}>
                <span
                  style={{ marginRight: 0, display: "flex", marginTop: "1rem" }}
                >
                  <Icon.Link />
                  Social Link
                </span>
              </p>

              {sociallink && (
                <SocialLink
                  challenge={subEventDetail}
                  // type="program"
                  modalView={sociallink}
                  setModalView={setSocialLink}
                  // setActivityModalView={setActivityModalView}
                  // actualData={actualData}
                />
              )}
            </div>
          </>
        ) : (
          ""
        )}
        <div
          style={{
            display: "flex",
            paddingLeft: 10,
            paddingRight: 10,
            marginTop: 10,
            width: 120,
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            outline: "none !important",
            // lineHeight:'20px'
          }}
          onClick={(e) => {
            handleLogout(e);
          }}
        >
          <span style={{ marginRight: 2 }}>
            <Icon.LogOut />
          </span>
          <ListItemText primary="Logout" />
        </div>
      </StyledMenu>
    </div>
  );
};

export default TopUserDetails;
