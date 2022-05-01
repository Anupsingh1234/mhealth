import React, { useState, useEffect } from "react";
import { PrimaryButton } from "../Form";
import { getBMI } from "../../services/bmiApi";
import CenteredModal from "../CenteredModal";
import classNames from "classnames";
import SingleDateSelector from "../BookingReport/SingleDateSelector";
import Tooltip from "rc-tooltip";

const BMI = ({ onRequestClose }) => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [loading, setLoading] = useState("");
  const [data, setData] = useState("");
  var myCurrentDate = new Date();
  var myFutureDate = new Date(myCurrentDate);
  myFutureDate.setDate(myFutureDate.getDate() + 30);
  const [nextReminder, setNextReminder] = useState(myFutureDate);
  const [error, setError] = useState("");
  const handleSubmit = () => {
    var dd = nextReminder.getDate();

    var mm = nextReminder.getMonth() + 1;
    var yyyy = nextReminder.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    const payload = {
      idMstUser: localStorage.userId,
      heightInCm: height,
      weightInKg: weight,
      nextReminder: `${yyyy}-${mm}-${dd}`,
    };
    setLoading(true);
    setError("");

    getBMI(payload)
      .then((res) => {
        if (res.data.response.responseCode === 0) {
          setData(res.data.response.responseData);
        } else {
          setError(res?.data?.response?.responseMessage);
        }
        setLoading(false);
      })
      .catch((err) => {
        setData("");
        setLoading(false);
      });
  };
  return (
    <CenteredModal
      width={"auto"}
      isOpen
      onRequestClose={onRequestClose}
      className="flex flex-col m-4"
    >
      <div className="flex flex-col bg-white mx-auto my-auto px-6 py-4 gap-2 rounded-lg">
        <p className="text-xl font-semibold text-gray-800 text-center">
          BMI/BMR
        </p>
        <p>Enter Weight</p>
        <input
          value={weight}
          placeholder="weight in kgs"
          onChange={({ target }) => setWeight(target.value)}
          type="number"
          className="p-2 border"
        />
        <p>Enter Height</p>
        <input
          value={height}
          placeholder="height in cms"
          onChange={({ target }) => setHeight(target.value)}
          type="number"
          className="p-2 border"
        />
        <p>Next Reminder</p>
        <SingleDateSelector
          value={nextReminder}
          onChange={(date) => setNextReminder(date)}
        />
        {data && (
          <div className={classNames("flex flex-col gap-2")}>
            <p>Result</p>
            <p className={"text-black"}>
              BMI Classification : {data.bmiClassification}
            </p>
            <p className={"text-black"}>
              BMI Classification : {data.bmrClassification}
            </p>
            <p>BMI : {data.calculatedBmi}</p>
            <p>BMR : {data.calculatedBmr}</p>
            <p className="my-2">
              <p className="text-center">BMI class colour coding</p>
              <div className="w-56 h-8 mx-2 border flex">
                <BMIClass
                  text="Severe Thinness( < 16.0 )"
                  className="w-10 bg-red-600 cursor-pointer"
                  min=""
                  max="16"
                />
                <BMIClass
                  text="Moderate Thinness (16 - 17)"
                  className="w-10 bg-orange-600 cursor-pointer"
                  min=""
                  max="17"
                />
                <BMIClass
                  text="Mild Thinness	(17 - 18.5)"
                  className="w-10 bg-yellow-400 cursor-pointer"
                  min=""
                  max="18"
                />
                <BMIClass
                  text="Normal (18.5 - 25)"
                  className="w-10 bg-green-600 cursor-pointer"
                  min=""
                  max="25"
                />
                <BMIClass
                  text="Overweight (25 - 30)"
                  className="w-10 bg-yellow-400 cursor-pointer"
                  min=""
                  max="30"
                />
                <BMIClass
                  text="Obese Class I	(30 - 35)"
                  className="w-10 bg-orange-600 cursor-pointer"
                  min=""
                  max="35"
                />
                <BMIClass
                  text="Obese Class II (35 - 40)"
                  className="w-10 bg-red-600 cursor-pointer"
                  min=""
                  max="40"
                />
                <BMIClass
                  text="Obese Class III ( > 40)"
                  className="w-10 bg-red-700 cursor-pointer"
                  min=""
                  max="40+"
                />
              </div>
            </p>
          </div>
        )}
        {error && (
          <p className="text-red-600 text-xs text-center max-w-[12rem] break-words">
            {error}
          </p>
        )}
        {!data && (
          <PrimaryButton
            mini
            onClick={() => handleSubmit()}
            disabled={weight === "" || height === ""}
          >
            Submit
          </PrimaryButton>
        )}
      </div>
    </CenteredModal>
  );
};

const BMIClass = ({ text, className, min, max }) => {
  return (
    <Tooltip
      transitionName="rc-tooltip-zoom"
      trigger={["hover"]}
      overlay={<span>{text}</span>}
      mouseEnterDelay={0.2}
      placement={"top"}
    >
      <div className={classNames("flex text-xs relative", className)}>
        <p className="absolute bottom-0 right-0">{max}</p>
      </div>
    </Tooltip>
  );
};

export default BMI;
