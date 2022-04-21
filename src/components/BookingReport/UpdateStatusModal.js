import React, { useEffect, useState } from "react";
import { useMount } from "react-use";
import CenteredModal from "../CenteredModal/CenteredModal";
import { PrimaryButton } from "../Form";
import DateSelector from "./DateSelector";
import SingleDateSelector from "./SingleDateSelector";
import { urlPrefix, uploadImage } from "../../services/apicollection";
import axios from "axios";

const UpdateStatusModal = ({
  statusModal,
  updateBookingStatus,
  setBookingIdForUpdate,
  setStatusUpdateReason,
  statusUpdateReason,
  setStatusModal,
  bookingDetailForUpdate,
  setStatusUpdateDate,
  statusUpdateDate,
  selectedAction,
  setSelectedAction,
}) => {
  const [actionList, setActionList] = useState([]);
  useMount(() => {
    if (bookingDetailForUpdate?.bookingStatus) {
      switch (bookingDetailForUpdate.bookingStatus.toUpperCase()) {
        case "PENDING":
          setActionList([{ key: "SLOT", value: "ACKNOWLEDGE" }]);
          return;
        case "OPEN":
          setActionList([
            { key: "SAMPLE", value: "SAMPLE COLLECTION" },
            { key: "ABSENT", value: "ABSENT" },
          ]);
          return;
        case "SAMPLE":
          setActionList([{ key: "REPORT", value: "COMPLETED" }]);
          return;
      }
    }
  });

  useEffect(() => {
    setSelectedAction(actionList.length > 0 ? actionList[0].key : undefined);
  }, [actionList]);

  const onFileChange = (event) => {
    if (event.target.files) {
      const { files } = event.target;
      if (files && files.length > 0) {
        const formData = new FormData();
        formData.append("media", files[0]);

        axios
          .post(`${urlPrefix}${uploadImage}`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              timeStamp: "timestamp",
              accept: "*/*",
              "Content-type": "multipart/form-data; boundary=???",
            },
          })
          .then((res) => {
            if (res.data.response.responseCode === 0) {
              setStatusUpdateReason(res.data.response.responseData.image);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };
  return (
    <CenteredModal
      width={"auto"}
      isOpen={statusModal}
      className="flex flex-col m-4 md:h-[16rem] md:w-[32rem]"
      onRequestClose={() => {
        setBookingIdForUpdate(undefined);
        setStatusUpdateReason("");
        setStatusModal(false);
      }}
    >
      <div className="px-16 py-4 mt-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs">Change status to</p>
          <div className="flex flex-col gap-2">
            <select onChange={(e) => setSelectedAction(e.target.value)}>
              {actionList.map((status) => (
                <option key={status.key} value={status.key}>
                  {status.value}
                </option>
              ))}
            </select>
            {selectedAction &&
              ["SLOT"].includes(selectedAction?.toUpperCase()) && (
                <div className="flex flex-col gap-1 text-left">
                  <p className="text-xs">Please enter booking reference</p>
                  <input
                    style={{ border: "1px solid lightgray" }}
                    value={statusUpdateReason}
                    onChange={(e) => setStatusUpdateReason(e.target.value)}
                  />
                </div>
              )}
            {selectedAction &&
              ["ABSENT"].includes(selectedAction?.toUpperCase()) && (
                <div className="flex flex-col gap-1 text-left">
                  <p className="text-xs">Reason/Remarks</p>
                  <input
                    style={{ border: "1px solid lightgray" }}
                    value={statusUpdateReason}
                    onChange={(e) => setStatusUpdateReason(e.target.value)}
                  />
                </div>
              )}
            {selectedAction &&
              ["SAMPLE"].includes(selectedAction?.toUpperCase()) && (
                <div className="flex flex-col gap-1 text-left">
                  <p className="text-xs">Select Date</p>
                  <SingleDateSelector
                    value={statusUpdateDate}
                    onChange={(date) => setStatusUpdateDate(date)}
                  />
                </div>
              )}
          </div>
        </div>
        {["REPORT"].includes(selectedAction) && (
          <div className="mt-4">
            <label id="doc">
              <p className="text-xs">Select a document</p>
            </label>

            <input
              type="file"
              name="doc"
              accept="application/pdf"
              onChange={(e) => {
                onFileChange(e);
              }}
              style={{ fontSize: 12, marginTop: 10 }}
            />
          </div>
        )}
        <div className="flex space-x-2 mt-4">
          <PrimaryButton
            mini
            onClick={() => {
              updateBookingStatus(selectedAction);
            }}
          >
            Update
          </PrimaryButton>
        </div>
      </div>
    </CenteredModal>
  );
};

export default UpdateStatusModal;
