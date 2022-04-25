import React, { useEffect, useState } from "react";
import {
  getPartners,
  fetchBooking,
  updateBookingStatusAPI,
} from "../../services/bookingApi";
import DataTable from "./DataTable";
import Navbar from "../Navbar";
import TopUserDetails from "../TopUserDetails";
import DateSelector from "./DateSelector";
import UpdateStatusModal from "./UpdateStatusModal";

const BookingReport = () => {
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState();
  var myCurrentDate = new Date();
  var myFutureDate = new Date(myCurrentDate);
  myFutureDate.setDate(myFutureDate.getDate() + 90);
  const [date, changeDate] = useState([new Date(), myFutureDate]);
  const [bookingDetail, setBookingDetail] = useState([]);
  const [statusModal, setStatusModal] = useState(false);
  const [bookingDetailForUpdate, setBookingIdForUpdate] = useState();
  const [reload, setReload] = useState(false);
  const [statusUpdateReason, setStatusUpdateReason] = useState("");
  const [filter, setFilter] = useState("");
  const [statusUpdateDate, setStatusUpdateDate] = useState(new Date());
  const [selectedAction, setSelectedAction] = useState();
  useEffect(() => {
    getPartners()
      .then((res) => {
        if (res?.status === 200 && res?.data?.response?.responseCode === 0) {
          setPartners(res.data.response.responseData);
          setSelectedPartner(res.data.response.responseData[0].id);
        } else {
          setPartners([]);
        }
      })
      .catch((err) => {
        setPartners([]);
      });
  }, []);
  console.log(selectedPartner,'prt id')
  useEffect(() => {
    fetchBooking(
      formatDate(date[0]),
      formatDate(date[1]),
      selectedPartner,
      filter === "All" ? "" : filter
    ).then((res) => {
      if (res?.status === 200 && res?.data?.response?.responseCode === 0) {
        setBookingDetail(res.data.response.responseData);
      } else {
        setBookingDetail([]);
      }
    });
  }, [selectedPartner, date, filter, reload]);

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    return yyyy + "-" + mm + "-" + dd;
  };
  const formatDateTime = (date) => {
    return (
      formatDate(date) +
      " " +
      [date.getHours(), date.getMinutes(), date.getSeconds()].join(":")
    );
  };

  const updateStatus = (bookingDetail) => {
    setBookingIdForUpdate(bookingDetail);
    setStatusModal(true);
  };

  const updateBookingStatus = (selectedAction) => {
    updateBookingStatusAPI(
      bookingDetailForUpdate.id,
      selectedAction === "SAMPLE"
        ? formatDateTime(statusUpdateDate)
        : statusUpdateReason,
      selectedAction
    )
      .then((res) => {
        setStatusModal(false);
        setBookingIdForUpdate(undefined);
        setReload(!reload);
        setStatusUpdateReason("");
        setStatusUpdateDate(new Date());
      })
      .catch((err) => {
        console.log({ err });
      });
  };
  const filterList = [
    "All",
    "Pending",
    "Open",
    "Acknowledge",
    "Sample",
    "Absent",
    "Complete",
  ];
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <TopUserDetails />
      <div className="mx-2 md:ml-28 md:mt-7 flex flex-col md:flex-row gap-2 md:items-start" style={{marginTop:50}}>
        <div className="md:w-56">
          <DateSelector
            value={date}
            handleDateChange={(dateRange) => {
              changeDate(dateRange);
            }}
          />
        </div>
        <select
          className="border border-gray-800 bg-white px-2 py-1.5 md:w-48"
          style={{ border: "1px solid lightgray", borderRadius: 0 }}
          onChange={(e) => {
            setSelectedPartner(e.target.value);
          }}
        >
          {partners.map((partner) => (
            <option key={partner.id} value={partner.id}>
              {partner.labName}
            </option>
          ))}
        </select>
        <select
          className="border border-gray-800 bg-white px-2 py-1.5 md:w-48"
          style={{ border: "1px solid lightgray", borderRadius: 0 }}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        >
          {filterList.map((filter) => (
            <option key={filter} value={filter}>
              {filter}
            </option>
          ))}
        </select>
        {Array.isArray(partners) && partners.length > 0 && (
          <LabAddress
            partner={partners.find(
              (p) => parseInt(p.id) === parseInt(selectedPartner)
            )}
          />
        )}
      </div>
      <div className="md:ml-20 md:mt-0 mx-4 my-4 min-h-screen">
        <DataTable {...{ bookingDetail, updateStatus,selectedPartner }} />
      </div>
      {statusModal && (
        <UpdateStatusModal
          {...{
            statusModal,
            setStatusModal,
            updateBookingStatus,
            setBookingIdForUpdate,
            setStatusUpdateReason,
            statusUpdateReason,
            bookingDetailForUpdate,
            setStatusUpdateDate,
            statusUpdateDate,
            selectedAction,
            setSelectedAction,
          }}
        />
      )}
    </div>
  );
};

const LabAddress = ({ partner }) => {
  return (
    <div className="border border-gray-300 p-1 text-sm md:max-w-[25rem]">
      <p>
        <span className="font-semibold">Lab details:</span> {partner?.labPerson}{" "}
        - ({partner?.labContact}) - {partner?.labAddress}, {partner?.labCity},{" "}
        {partner?.labState}, {partner?.labPin}
      </p>
    </div>
  );
};
export default BookingReport;
