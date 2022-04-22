import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import CenteredModal from "../CenteredModal/CenteredModal";
import ReportTable from "./ReportTable";
import { PrimaryButton } from "../Form";
import classNames from "classnames";
import { sendOTPHandler, verifyOTPHandler } from "../../services/loginapi";
import { getHealthReports } from "../../services/healthApi";

const ReportOtp = ({ onRequestClose }) => {
  const [isVerified, setVerified] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [availableReports, setAvailableReports] = useState([]);
  const [message, setMessage] = useState("Sending OTP");
  useEffect(() => {
    sendOTPHandler(
      {
        phoneNumber: localStorage.mobileNumber,
        dialCode: "+91",
      },
      "HEALTH"
    )
      .then((res) => {
        if (res.data.response.responseCode === 0) {
          setMessage(
            `OTP sent to +91-${localStorage.mobileNumber}. Please verify.`
          );
        } else {
          setMessage(`Error sending OTP. Please contact admin.`);
        }
      })
      .catch((err) => setMessage(`Error sending OTP. Please contact admin.`));
  }, []);

  const handleOTPVerify = () => {
    verifyOTPHandler({
      mobileNumber: localStorage.mobileNumber,
      otp: otpInput,
      otpTxnType: "HEALTH",
    })
      .then((res) => {
        if (res.data.response.responseCode === 0) {
          getHealthReports()
            .then((res) => {
              if (res.data.response.responseCode === 0) {
                setAvailableReports(res.data.response.responseData);
                setVerified(true);
              } else {
                setMessage("Error fetching reports. Please contact admin.");
              }
            })
            .catch((err) =>
              setMessage("Error fetching reports. Please contact admin.")
            );
        } else {
          setMessage("OTP verification failed. Pleae enter correct OTP.");
        }
      })
      .catch((err) => {
        setMessage("OTP verification failed. Pleae enter correct OTP.");
      });
  };

  return (
    <CenteredModal
      width={"auto"}
      isOpen={true}
      className={classNames(
        "flex flex-col m-4 transition-all ease-in-out duration-75",
        "px-4 py-8",
        { "md:h-[16rem] md:w-[32rem]": !isVerified },
        { "md:h-[32rem] md:w-[max-content] overflow-auto": isVerified }
      )}
      onRequestClose={() => {
        onRequestClose();
      }}
    >
      {!isVerified && (
        <div className="flex flex-col items-center justify-center gap-3">
          <p>{message}</p>
          <div id="otp-form">
            <OtpInput
              shouldAutoFocus={true}
              value={otpInput}
              onChange={(otp) => setOtpInput(otp)}
              numInputs={6}
              separator={<span>-</span>}
              isInputNum={true}
              inputStyle={{
                border: "1px solid",
                padding: "8px 4px",
                width: "40px",
                marginTop: "10px",
                borderRadius: "4px",
              }}
            />
          </div>
          <div className="text-center">
            <PrimaryButton
              mini
              onClick={() => {
                handleOTPVerify();
              }}
              disabled={!otpInput || (otpInput && otpInput.length < 6)}
            >
              Verify
            </PrimaryButton>
          </div>
        </div>
      )}
      {isVerified && (
        <div className="px-4 flex flex-col gap-2 overflow-auto">
          <div id="available-reports">
            {availableReports.length > 0 ? (
              <ReportTable data={availableReports} />
            ) : (
              <div className>
                <p className="font-semibold text-gray-800 text-lg">
                  No report available
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </CenteredModal>
  );
};

export default ReportOtp;
