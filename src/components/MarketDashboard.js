import React, { useState, useEffect } from "react";
import MarketActivity from "./Activities/MarketActivity";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {
  ratingProgramByUser,
  urlPrefix,
  getSubEvent,
} from "../services/apicollection";
import axios from "axios";
import TopUserDetails from "./TopUserDetails";

import Navbar from "./Navbar";
const MarketDashboard = () => {
  const [event, setEvent] = useState([]);
  const [eventValue, setEventValue] = useState();
  const data1 = [];
  const geEvent = () => {
    const adminurl = `${urlPrefix}v1.0/getUserRoleWiseEvent`;

    return axios
      .get(adminurl, {
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
      })
      .then((res) => {
        res.data.response.responseData.filter((item) => {
          if (item.timePeriod !== "PAST") {
            data1.push(item);
            setEvent(data1);
          }
          //  return item.timePeriod!=='PAST'
        });
        console.log(data1, "data");
        data1.map((curr, ind) => {
          if (ind == 0) {
            console.log(curr.id, "curenrt");
            setEventValue(curr.id);
          }
        });
      });
  };

  useEffect(() => {
    //    getprogram();
    geEvent();
    //  geAttached();
  }, []);
  const handleChange = (e) => {
    setEventValue(e.target.value);
  };

  return (
    <>
      {/* <Navbar /> */}
      <TopUserDetails />
      <div className="bg-white w-[80vw] max-h-[80vh] overflow-scroll border border-gray-100 rounded-lg">
        {event.length > 1 ? (
          <div
            className="select_date"
            style={{
              justifyContent: "center",
              alignItems: "center",
              top: 20,
              marginLeft: "10%",
            }}
          >
            <fieldset>
              <legend> Select Event </legend>
              <Select
                style={{ width: "250px" }}
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                onChange={handleChange}
                defaultValue={eventValue}
              >
                {event &&
                  event.map(function (ev, index) {
                    if (ev.timePeriod !== "PAST") {
                      return (
                        <MenuItem required value={ev.id}>
                          {ev.challengeName}
                        </MenuItem>
                      );
                    }
                  })}
              </Select>
            </fieldset>
          </div>
        ) : (
          ""
        )}
        {eventValue !== undefined ? (
          <MarketActivity eventId={eventValue} currentEventObj={eventValue} />
        ) : (
          ""
        )}
      </div>
    </>
  );
};
export default MarketDashboard;
