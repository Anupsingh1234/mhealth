import React from "react";
import ReactLoadingWrapper from "../loaders/ReactLoadingWrapper";
import OtpInput from "react-otp-input";

const OTPVerifyForm = ({
  userData,
  loaderInfo,
  handleInput,
  handleOtpInputSubmit,
  YottaMatch,
}) => (
  <>
    <div className="heading center fadeInUp">OTP Verification</div>
    <div className="sub-heading center fadeInUp">
      <span>Enter OTP Code sent to &nbsp;</span>
      {`+${userData?.mobileNo?.value}`}
    </div>
    <div className="input-area fadeInUp">
      <OtpInput
        shouldAutoFocus={true}
        value={userData.otp}
        onChange={(otp) => handleInput("otp", otp)}
        numInputs={6}
        separator={<span>-</span>}
        isInputNum={true}
        inputStyle={{
          border: "1px solid",
          padding: "2px 4px",
          width: "25px",
          marginTop: "10px",
          borderRadius: "4px",
        }}
      />
    </div>
    <div className="submit-button fadeInUp" style={{ margin: "4em 0 0 0" }}>
      {loaderInfo.otpVerification ? (
        <div className="loader">
          <ReactLoadingWrapper
            color={"#518ad6"}
            height={"10%"}
            width={"10%"}
            type={"spin"}
          />
        </div>
      ) : (
        <button
          className={
            userData.otp?.length === 6
              ? YottaMatch
                ? "is-yotta-success"
                : "is-success"
              : "is-disabled"
          }
          disabled={userData.otp?.length !== 6}
          onClick={() => {
            handleOtpInputSubmit(),
              window.location.href == "https://weblite.mhealth.ai/#/login"
                ? localStorage.setItem("webLite", "true")
                : localStorage.setItem("webLite", "false");
          }}
        >
          Continue
        </button>
      )}
    </div>
  </>
);

export default OTPVerifyForm;
