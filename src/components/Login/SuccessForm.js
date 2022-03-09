import React, { useEffect } from "react";
import { celebrate } from "../../utils/commonFunctions";
import confetti from "canvas-confetti";
import { useHistory } from "react-router-dom";
import { registerEvent } from "../../services/challengeApi";

const SuccessForm = () => {
  celebrate();
  const history = useHistory();

  const payload = {
    eventId: parseInt(localStorage.getItem("evid")),
    dataSource: "WHATSAPP",
    // healthGoal: registerDetails.healthGoal,

    registrationSource: "WEB",
    // dob: registerDetails.dob,
    // gender: registerDetails.gender,
    // city: registerDetails.city,
    // pinCode: parseInt(registerDetails.pinCode),
    // emailId: registerDetails.emailId,
    // state: registerDetails.state,
  };

  useEffect(() => {
    registerEvent(payload).then((res) => {
      console.log(res);
    });
    setTimeout(() => {
      history.push("/programs");
      // history.push("/dashboard");
    }, 2000);
  }, []);
  return (
    <div className="registration-success">
      <div className="heading center fadeInUp">Woo Hoo!</div>
      <div className="sub-heading center fadeInUp">
        <h2 className={"fadeInUp"}>Welcome aboard</h2>
      </div>
    </div>
  );
};

export default SuccessForm;
