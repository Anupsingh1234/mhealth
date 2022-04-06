import axios from "axios";
import { urlPrefix } from "./apicollection";

export const getPartners = () => {
  // const URL = `${urlPrefix}v1.0/getLabotraryBookingReport?fromDate=2022-04-10&partnerLabId=10&toDate=2022-04-10`;
  const URL = `${urlPrefix}v1.0/getIdwiseLab`;
  return axios.get(URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      timeStamp: "timestamp",
      accept: "*/*",
      "Access-Control-Allow-Origin": "*",
      withCredentials: true,
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers":
        "accept, content-type, x-access-token, x-requested-with",
    },
  });
};

export const fetchBooking = (fromDate, toDate, partnerLabId, filter) => {
  // const URL = `${urlPrefix}v1.0/getLabotraryBookingReport?fromDate=2022-04-10&partnerLabId=10&toDate=2022-04-10`;
  let URL = `${urlPrefix}v1.0/getLabotraryBookingReport?fromDate=${fromDate}&partnerLabId=${partnerLabId}&toDate=${toDate}`;
  if (filter) {
    URL += `&filter=${filter}`;
  }
  return axios.get(URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      timeStamp: "timestamp",
      accept: "*/*",
      "Access-Control-Allow-Origin": "*",
      withCredentials: true,
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers":
        "accept, content-type, x-access-token, x-requested-with",
    },
  });
};

export const updateBookingStatusAPI = (bookingId, text, action) => {
  const URL = `${urlPrefix}v1.0/updateCheckupBooking?action=${action}&bookingId=${bookingId}&text=${text}`;
  return axios.get(URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      timeStamp: "timestamp",
      accept: "*/*",
      "Access-Control-Allow-Origin": "*",
      withCredentials: true,
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers":
        "accept, content-type, x-access-token, x-requested-with",
    },
  });
};
