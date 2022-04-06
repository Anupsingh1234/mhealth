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

  const updateStatus = (bookingDetail) => {
    setBookingIdForUpdate(bookingDetail);
    setStatusModal(true);
  };

  const updateBookingStatus = (selectedAction) => {
    updateBookingStatusAPI(
      bookingDetailForUpdate.id,
      statusUpdateReason,
      selectedAction
    )
      .then((res) => {
        setStatusModal(false);
        setBookingIdForUpdate(undefined);
        setReload(!reload);
        setStatusUpdateReason("");
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
      <div className="mx-2 md:ml-28 md:mt-7 flex flex-col md:flex-row gap-2 md:items-center">
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
      </div>
      <div className="md:ml-20 md:mt-0 mx-4 my-4 min-h-screen">
        <DataTable {...{ bookingDetail, updateStatus }} />
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
          }}
        />
      )}
    </div>
  );
};

export default BookingReport;