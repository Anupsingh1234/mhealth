import axios from "axios";
import { urlPrefix } from "./apicollection";

export const getBMI = (payload) => {
  const URL = `${urlPrefix}v1.0/calculateAndAddBMIBMR`;
  return axios.post(URL, payload, {
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
