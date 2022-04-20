import React, { useState } from "react";
import { PrimaryButton } from "../Form";
import PulseCard from "./PackageCard";
import ReportOtp from "./ReportOtp";
export default function Index() {
  const [openModal, setModalState] = useState(false);
  const handleReportOTP = () => {
    setModalState(true);
  };
  return (
    <div id="pulse-card">
      <div is="pulse-action" style={{ float: "right" }}>
        <PrimaryButton mini onClick={() => handleReportOTP()} width={"6rem"}>
          Report
        </PrimaryButton>
      </div>
      <div className="mt-4">
        <PulseCard />
      </div>
      {openModal && <ReportOtp onRequestClose={() => setModalState(false)} />}
    </div>
  );
}
