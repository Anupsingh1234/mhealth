import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { resetPasswordHandler } from "../services/loginapi";
import ReactLoadingWrapper from "./loaders/ReactLoadingWrapper";
import Message from "antd-message";
import TopUserDetails from "./TopUserDetails";
import ResetPin1 from "../assets/resetPin.svg";
import { faChess, faHome, faKey } from "@fortawesome/free-solid-svg-icons";
import { PrimaryButton } from "./Form";

const ResetPin = (props) => {
  const [userDetails, setUserDetails] = useState({
    oldPin: "",
    newPin: "",
    confirmPin: "",
  });

  const [isLoadingUserDetails, setLoadingUserDetails] = useState(false);
  const [profileUpdatedFlag, setProfileUpdatedFlag] = useState(false);

  const handleInputChange = (type, value) => {
    if (type === "oldPin") {
      setUserDetails({
        ...userDetails,
        oldPin: value,
      });
    }
    if (type === "newPin") {
      setUserDetails({
        ...userDetails,
        newPin: value,
      });
    }
    if (type === "confirmPin") {
      setUserDetails({
        ...userDetails,
        confirmPin: value,
      });
    }
  };
  const handleResetPin = () => {
    window.message = Message;
    setLoadingUserDetails(true);
    resetPasswordHandler({
      resetPin: {
        confirmPin: userDetails.confirmPin,
        newPin: userDetails.newPin,
        oldPin: userDetails.oldPin,
      },
      resetPassword: null,
    })
      .then((res) => {
        setLoadingUserDetails(false);
        setProfileUpdatedFlag(true);
        message.success("Pin Updated");
      })
      .catch((err) => {
        setLoadingUserDetails(false);
        message.error("Something went wrong");
      });
  };

  useEffect(() => {
    const { setFooterTabs } = props;
    const SETTINGS_TABS = [
      {
        key: "home",
        title: "Home",
        onClick: () => {
          window.location.replace("/#/program/settings");
        },
        selected: false,
        icon: faHome,
      },
      {
        key: "resetpin",
        title: "Reset Pin",
        onClick: () => {
          window.location.replace("/#/profile");
        },
        icon: faKey,
        selected: window.location.hash === "#/resetpin",
      },
    ];
    setFooterTabs(SETTINGS_TABS);
  }, []);

  const { oldPin, newPin, confirmPin } = userDetails;
  return (
    <div className="Profile">
      <TopUserDetails />
      <Navbar />
      <div className="profile-background">
        <div
          className="form reset-form"
          style={{
            minWidth: "30%",
          }}
        >
          <div className="heading ">Provide information to update PIN</div>
          <div className="basic-info-container ">
            <div className="basic-info">
              <div className="mhealth-input-box padding-05em">
                <label>Old Pin</label>
                <input
                  type="text"
                  maxlength="4"
                  size="4"
                  placeholder="Enter your 4 digits old pin"
                  value={oldPin}
                  onChange={(e) => handleInputChange("oldPin", e.target.value)}
                />
              </div>
              <div className="mhealth-input-box padding-05em">
                <label>New Pin</label>
                <input
                  type="text"
                  maxlength="4"
                  size="4"
                  placeholder="Enter your 4 digits new pin"
                  value={newPin}
                  onChange={(e) => handleInputChange("newPin", e.target.value)}
                />
              </div>
              <div className="mhealth-input-box padding-05em">
                <label>Confirm Pin</label>
                <input
                  type="text"
                  maxlength="4"
                  size="4"
                  placeholder="Confirm your 4 digits new pin"
                  value={confirmPin}
                  onChange={(e) =>
                    handleInputChange("confirmPin", e.target.value)
                  }
                />
              </div>

              <div className="submit-button" style={{ marginBottom: "1em" }}>
                {isLoadingUserDetails ? (
                  <div className="loader">
                    <ReactLoadingWrapper
                      color={"#518ad6"}
                      height={"10%"}
                      width={"10%"}
                      type={"spin"}
                    />
                  </div>
                ) : (
                  <PrimaryButton onClick={() => handleResetPin()}>
                    Update
                  </PrimaryButton>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="reset-pin-illustration">
          <img src={ResetPin1} width={"100%"} height={"100%"} />
        </div>
      </div>
    </div>
  );
};

export default ResetPin;
