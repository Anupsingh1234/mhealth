import React, { useState, useEffect, useContext } from "react";
import login from "../../assets/login.svg";
import "react-phone-input-2/lib/style.css";
import { useHistory } from "react-router-dom";
import UserInfoForm from "./UserInfoForm";
import MobileInputForm from "./MobileInputForm";
import OTPVerifyForm from "./OTPVerifyForm";
import SuccessForm from "./SuccessForm";
import PasswordVerifyForm from "./PasswordVerifyForm";
import Message from "antd-message";
import logoPng from "../../assets/logo.png";
import copyright from "../../assets/copyright.svg";
import facebookIcon from "../../assets/facebookIcon.svg";
import linkedInIcon from "../../assets/linkedInIcon.svg";
import twitterIcon from "../../assets/twitterIcon.svg";
import CompnyForm from "./Complog";
import DCompany from "./DCompanyForm";
import CenteredLoader from "../shared/CenteredLoader";
import {
  validateUserHandler,
  sendOTPHandler,
  verifyOTPHandler,
  registerUserHandler,
  loginUserHandler,
  forgetPasswordHandler,
} from "../../services/loginapi";
import { getUserDetailsHandler } from "../../services/userprofileApi";
import CodeMatch from "./CodeMatch";
import ThemeContext from "../../context/ThemeContext";
import classNames from "classnames";
import { icons } from "../../assets/icons/constants";

const Login = ({ YottaMatch }) => {
  window.message = Message;
  const { theme, loading: loadingTheme } = useContext(ThemeContext);
  const history = useHistory();
  const [userData, setUserData] = useState({
    mobileNo: "",
    ismobileNoVerified: false,
    otp: "",
    isOtpVerified: false,
    isOtpVerifiedForReset: false,
    firstname: "",
    displaylastName: false,
    lastname: "",
    displayPin: false,
    pin: "",
    confirmPin: "",
    isUserRegistered: false,
    isExistingUser: false,
    userToken: "",
    isPasswordForgotten: false,
    gender: "",
    city: "",
    companyName: "",
    employeeId: "",
  });
  const [loaderInfo, setLoaderInfo] = useState({
    mobileVerification: false,
    otpVerification: false,
    userVerification: false,
    loginVerification: false,
    gettingOTP: false,
  });

  const [match, setmatch] = useState(
    window.location.href == "https://weblite.mhealth.ai/#/login"
      ? "true"
      : "false"
  );

  const parenthandel = (name) => {
    setmatch("false");
  };

  function isLoggedIn() {
    if (localStorage.getItem("token")) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    isLoggedIn() && history.push("/programs");
  }, []);

  const handleInput = (type, value) => {
    if (type === "mobile") {
      setUserData({
        ...userData,
        mobileNo: value,
      });
    }

    if (type === "companyName") {
      setUserData({
        ...userData,
        companyName: value,
      });
    }

    if (type === "employeeId") {
      setUserData({
        ...userData,
        employeeId: value,
      });
    }

    if (type === "otp") {
      setUserData({
        ...userData,
        otp: value,
      });
    }

    if (type === "firstname") {
      setUserData({
        ...userData,
        firstname: value,
      });
    }

    if (type === "lastname") {
      setUserData({
        ...userData,
        lastname: value,
      });
    }

    if (type === "pin") {
      setUserData({
        ...userData,
        pin: value,
      });
    }

    if (type === "confirmPin") {
      setUserData({
        ...userData,
        confirmPin: value,
      });
    }
    if (type === "gender") {
      setUserData({
        ...userData,
        gender: value,
      });
    }
    if (type === "city") {
      setUserData({
        ...userData,
        city: value,
      });
    }
  };

  const OTPRequestHandler = (type, callback = () => {}) => {
    setLoaderInfo({
      ...loaderInfo,
      mobileVerification: true,
      gettingOTP: true,
    });
    sendOTPHandler(userData.mobileNo, type)
      .then((res) => {
        if (type === "FORGET_PASSWORD") {
          callback(true);
          if (res.data.response.responseMessage === "SUCCESS") {
            setLoaderInfo({
              ...loaderInfo,
              mobileVerification: false,
              gettingOTP: false,
            });
          } else {
            callback(false);
            message.error("something went wrong!");
          }
          return;
        }

        if (res.data.response.responseMessage === "SUCCESS") {
          setUserData({ ...userData, ismobileNoVerified: true });
          setLoaderInfo({
            ...loaderInfo,
            mobileVerification: false,
            gettingOTP: false,
          });
        } else {
          message.error("something went wrong!");
        }
      })
      .catch((err) => {
        message.error("something went wrong!");
        setLoaderInfo({
          ...loaderInfo,
          mobileVerification: false,
          gettingOTP: false,
        });
        if (type === "FORGET_PASSWORD") callback(false);
      });
  };
  const handleMobileInputSubmit = () => {
    window.message = Message;
    if (userData?.mobileNo?.phoneNumber === "") {
      message.error("Please input Mobile");
      return;
    }
    setLoaderInfo({ ...loaderInfo, mobileVerification: true });
    validateUserHandler(userData.mobileNo)
      .then((res) => {
        if (res.data.response.responseCode === 0) {
          // if (res.data.response.responseData.status === 'PARTIALLY_VERIFIED') {
          if (res.data.response.responseData.status !== "ACTIVE") {
            OTPRequestHandler("REGISTRATION");
          } else {
            setUserData({
              ...userData,
              ismobileNoVerified: true,
              isExistingUser: true,
            });
            setLoaderInfo({ ...loaderInfo, mobileVerification: false });
          }
        } else {
          message.error(res.data.response.responseMessage);
          setLoaderInfo({ ...loaderInfo, mobileVerification: false });
        }
      })
      .catch((err) => {
        message.error("something went wrong!");
        setLoaderInfo({ ...loaderInfo, mobileVerification: false });
      });
  };

  const handleOtpInputSubmit = (type = "REGISTRATION") => {
    setLoaderInfo({ ...loaderInfo, otpVerification: true });
    verifyOTPHandler({
      mobileNumber: userData?.mobileNo?.phoneNumber,
      otp: userData.otp,
      otpTxnType: type,
    })
      .then((res) => {
        if (res.data.response.responseMessage === "SUCCESS") {
          if (type === "FORGET_PASSWORD") {
            setUserData({
              ...userData,
              isOtpVerifiedForReset: true,
              userToken: res.data.response.responseData.userToken,
            });
            localStorage.setItem(
              "token",
              res.data.response.responseData.userToken
            );
          } else {
            setUserData({
              ...userData,
              isOtpVerified: true,
              userToken: res.data.response.responseData.userToken,
            });
            localStorage.setItem(
              "token",
              res.data.response.responseData.userToken
            );
          }
        }
        setLoaderInfo({ ...loaderInfo, otpVerification: false });
      })
      .catch((err) => {
        message.error("something went wrong!");
        setLoaderInfo({ ...loaderInfo, otpVerification: false });
      });
  };

  const handleInfoSubmit = () => {
    setLoaderInfo({ ...loaderInfo, userVerification: true });
    registerUserHandler(
      {
        firstName: userData.firstname,
        lastName: userData.lastname,
        mobileNumber: userData?.mobileNo?.phoneNumber,
        pin: userData.pin,
        password: "pass@1",
        roleType: 1,
        gender: userData.gender,
        city: userData.city,
        companyName: userData.companyName,
        employeeId: userData.employeeId,
      },
      userData.userToken
    )
      .then((res) => {
        // change
        if (res.data.response.responseData.status === "ACTIVE") {
          setUserData({
            ...userData,
            isUserRegistered: true,
          });
          if (res.data.response.responseData.userId) {
            localStorage.setItem(
              "userId",
              res.data.response.responseData.userId
            );

            getUserDetailsHandler().then((response) => {
              if (response.data.response.responseMessage === "SUCCESS") {
                localStorage.setItem(
                  "firstName",
                  response.data.response.responseData.firstName
                );
                localStorage.setItem(
                  "lastName",
                  response.data.response.responseData.lastName
                );
                localStorage.setItem(
                  "mobileNumber",
                  response.data.response.responseData.mobileNumber
                );
              }
            });
          }
          setLoaderInfo({ ...loaderInfo, userVerification: false });
        }
      })
      .catch((err) => {
        message.error("something went wrong!");
        setLoaderInfo({ ...loaderInfo, userVerification: false });
      });
  };

  const handleUserLoginSubmit = () => {
    setLoaderInfo({ ...loaderInfo, loginVerification: true });
    loginUserHandler(userData.mobileNo, userData.pin)
      .then((res) => {
        if (res.data.responseMessage === "SUCCESS") {
          localStorage.setItem("token", res.data.responseData.authToken);
          localStorage.setItem("clientId", res.data.responseData.clientId);
          localStorage.setItem("firstName", res.data.responseData.firstName);
          localStorage.setItem("lastName", res.data.responseData.lastName);
          localStorage.setItem("userId", res.data.responseData.userId);
          localStorage.setItem("role", res.data.responseData.userType);
          if (res.data.responseData.aliasName) {
            localStorage.setItem("aliasName", res.data.responseData.aliasName);
          }
          if (res.data.responseData.avtarImg) {
            localStorage.setItem("avatarImg", res.data.responseData.avtarImg);
          }

          getUserDetailsHandler().then((response) => {
            if (response.data.response.responseMessage === "SUCCESS") {
              localStorage.setItem(
                "gender",
                response.data.response.responseData.gender
              );
              localStorage.setItem(
                "emailId",
                response.data.response.responseData.emailId
              );
              localStorage.setItem(
                "dob",
                response.data.response.responseData.dob
              );
              localStorage.setItem(
                "city",
                response.data.response.responseData.city
              );

              localStorage.setItem(
                "authorizedDatasource",
                JSON.stringify(
                  response.data.response.responseData.authorizedDatasource
                )
              );
              localStorage.setItem(
                "state",
                response.data.response.responseData.state
              );
              localStorage.setItem(
                "pinCode",
                response.data.response.responseData.pinCode
              );

              localStorage.setItem(
                "mobileNumber",
                response.data.response.responseData.mobileNumber
              );

              localStorage.setItem(
                "dashboard_default_tab",

                response.data.response.responseData.dashboard_default_tab
              );
              localStorage.setItem(
                "dashboard_view_status",

                response.data.response.responseData.dashboard_view_status
              );
            }
          });

          history.push("./programs");
        } else {
          message.error(res.data.response.responseMessage);
        }
        setLoaderInfo({ ...loaderInfo, loginVerification: false });
      })
      .catch((err) => {
        message.error("something went wrong!");
        setLoaderInfo({ ...loaderInfo, loginVerification: false });
      });
  };

  const userInfo = () => {
    if (window.location.href == "https://global.mhealth.ai/#/login") {
      return (
        <CompnyForm
          {...{
            userData,
            loaderInfo,
            handleInput,
            handleInfoSubmit,
          }}
        />
      );
    } else if (
      window.location.href == "https://druvacares.mhealth.ai/#/login" ||
      window.location.href == "https://druvacarespartners.mhealth.ai/#/login"
    ) {
      return (
        <DCompany
          {...{
            userData,
            loaderInfo,
            handleInput,
            handleInfoSubmit,
          }}
        />
      );
    } else if (match == "true") {
      return <CodeMatch parenthandel={parenthandel} />;
    } else {
      return (
        <UserInfoForm
          {...{
            userData,
            loaderInfo,
            handleInput,
            handleInfoSubmit,
          }}
        />
      );
    }
  };

  const handleSettingNewPassword = () => {
    forgetPasswordHandler(
      {
        forgetPin: {
          confirmPin: parseInt(userData.confirmPin),
          newPin: parseInt(userData.pin),
        },
      }
      /*userData.userToken*/
    )
      .then((res) => {
        if (res.data.response.responseCode === 0) {
          setUserData({
            ...userData,
            ismobileNoVerified: false,
            isExistingUser: false,
            isForgetPassSuccess: true,
            isOtpVerifiedForReset: false,
            isPasswordForgotten: false,
            otp: "",
            pin: "",
            confirmPin: "",
          });
        } else {
          message.error(res.data.response.responseMessage);
        }
      })
      .catch((err) => {
        message.error(err);
      });
  };

  const {
    ismobileNoVerified,
    isOtpVerified,
    isUserRegistered,
    isExistingUser,
  } = userData;

  return loadingTheme ? (
    <CenteredLoader />
  ) : (
    <div className="Login">
      <div className="illustration relative">
        <div>
          <img src={theme?.eventLogo || login} width={400} height={597} />
          <div className="absolute left-0 top-[28%] p-4 bg-gray-100 h-[max-content] flex flex-col gap-4">
            {Object.entries(icons).map((data) => (
              <img
                key={data[0]}
                src={data[1]}
                className="inline cursor-pointer"
                width="22px"
                height="22px"
              />
            ))}
          </div>
          <div
            className={classNames(
              "absolute bottom-4 left-0 px-4",
              "text-xs font-semibold tracking-wide text-gray-800",
              "flex justify-between w-full items-center"
            )}
          >
            <p className="flex gap-1 items-center">
              Powered by
              <img src={logoPng} width={20} height={20} />
              mHealth
            </p>
            <p className="flex items-center gap-1">
              <img
                src={copyright}
                className="inline"
                width="18px"
                height="18px"
              />
              <span>{new Date().getFullYear()}</span>
              created by Steering Lives India Pvt. Ltd.
            </p>
          </div>
        </div>
      </div>
      <div className="Logo">
        <img src={theme.sponsorLogo} width="36px" height="36px" />
        {/* <div className="logo-text">mHealth.ai</div> */}
      </div>
      <div className="form-container">
        <div className={"form"}>
          {!ismobileNoVerified && (
            <MobileInputForm
              {...{
                userData,
                handleInput,
                loaderInfo,
                handleMobileInputSubmit,
                YottaMatch,
              }}
            />
          )}
          {ismobileNoVerified && isExistingUser && (
            <PasswordVerifyForm
              {...{
                userData,
                setUserData,
                loaderInfo,
                handleInput,
                handleUserLoginSubmit,
                handleOtpInputSubmit,
                OTPRequestHandler,
                handleSettingNewPassword,
                YottaMatch,
              }}
            />
          )}
          {ismobileNoVerified && !isExistingUser && !isOtpVerified && (
            <OTPVerifyForm
              {...{
                userData,
                loaderInfo,
                handleInput,
                handleOtpInputSubmit,
                YottaMatch,
              }}
            />
          )}

          {ismobileNoVerified &&
            isOtpVerified &&
            !isUserRegistered &&
            userInfo()}
          {ismobileNoVerified && isOtpVerified && isUserRegistered && (
            <SuccessForm />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
