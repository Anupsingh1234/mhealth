import React from "react";
import { Download } from "react-feather";
import { CSVLink } from "react-csv";

const CSVExport = ({ data, filename, source }) => {
  let tempData = data.length > 0 ? [...data] : [];
  let newData = tempData.map((item) => {
    let newObj = {};

    if (source === "eventManagement") {
      newObj = {
        Name: item.name ? item.name : "",
        Email: item.email ? item.email : "",
        "Mobile Number": item.mobileNumber ? item.mobileNumber : "",
        Gender: item.gender ? item.gender : "",
        "D.O.B": item.dob ? item.dob.split(" ")[0] : "",
        Source: item.dataSource ? item.dataSource : "",
        "Active Days": item.daysActive ? item.daysActive : "",
        "Total kms": item.totalKms ? item.totalKms : "",
        "Payment Amount": item.paymentAmount ? item.paymentAmount : "",
        "Payment Status": item.paymentStatus ? item.paymentStatus : "",
        "Transaction ID": item.paymentTxnId ? item.paymentTxnId : "",
        "Registration Code": item.registrationCode ? item.registrationCode : "",
        "Registration Date": item.registrationDate ? item.registrationDate : "",
        "Registration Source": item.registrationSource
          ? item.registrationSource
          : "",
        Subscribed: item.isSubscribed,
      };
    }
    if (source === "dashboard") {
      newObj = {
        Rank: item.rank ? item.rank : "",
        Name: item.userName ? item.userName : "",
        Gender: item.gender ? item.gender : "",
        State: item.state ? item.state : "",
        City: item.city ? item.city : "",
        "Last Distance Covered (km)": item.lastDistanceCovered
          ? item.lastDistanceCovered
          : "",
        "Average Distance Covered (km)": item.averageDistanceCovered
          ? item.averageDistanceCovered
          : "",
        "Total Distance (km)": item.value ? item.value : "",
        Date: item.valueTillDate ? item.valueTillDate : "",
        "Active Days": item.totalParticipationDays
          ? item.totalParticipationDays
          : "",
        Source: item.dataSource ? item.dataSource : "",
        Subscribed: item.isSubscribed,
      };
    }

    if (source === "subEventManagement") {
      newObj = {
        Name: item.name ? item.name : "",
        Gender: item.gender ? item.gender : "",
        City: item.city ? item.city : "",
        "D.O.B": item.dob ? item.dob.split(" ")[0] : "",
        Email: item.email ? item.email : "",
        "Mobile Number": item.mobileNumber ? item.mobileNumber : "",
        ActivationCode: item.activationCode ? item.activationCode : "",
        "Registration Date": item.registrationDate ? item.registrationDate : "",
        "Registration Source": item.registrationSource
          ? item.registrationSource
          : "",
        Subscribed: item.isSubscribed,
      };
    }
    if (source === "quizreport") {
      newObj = {
        First_Name: item.name ? item.name : "",
        Last_Name: item.lastName ? item.lastName : "",
        Email: item.emailId ? item.emailId : "",
        Mobile: item.mobileNumber ? item.mobileNumber : "",
        Last_Attempt_Date: item.lastAttemptedDate ? item.lastAttemptedDate : "",
        Total_Attemp: item.totalAttemptedQue ? item.totalAttemptedQue : "",
        Total_Correction: item.totalCorrectAns ? item.totalCorrectAns : "",
      };
    }
    return newObj;
  });
  return (
    <CSVLink data={newData} filename={filename}>
      <button>
        <img
          src="https://walkathon21.s3.ap-south-1.amazonaws.com/logo/ReportDown.png"
          width="25px"
          height="25px"
        />
      </button>
    </CSVLink>
  );
};

export default CSVExport;
