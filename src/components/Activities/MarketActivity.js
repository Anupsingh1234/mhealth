import React, { useEffect, useState } from "react";
// import SubEventCard from './SubEventCard';
import FallbackDiv from "../Utility/FallbackDiv";
// import useActivity from '../Dashboard/hooks/useActivity';
import NoData from "../NoData";
// import DateRangePickerW from '../Dashboard/Activity/DateRangePickerW';
// import TriStateToggle from '../Dashboard/Activity/TriStateToggle';
import MarketPlace from "../MarketPlace";
import TriStateToggle from "../toggle/TriStateToggle";
import Attached from "../AttachedMarketPlace";
import Select from "@material-ui/core/Select";
import {
  ratingProgramByUser,
  urlPrefix,
  getSubEvent,
} from "../../services/apicollection";
import axios from "axios";
const Activity = ({ eventId, currentEventObj }) => {
  const [selval, setselval] = useState("");

  const [mystyle, setmystyle] = useState({
    display: "flex",
    flexWrap: "wrap",
  });
  console.log(eventId, currentEventObj, "event");
  const [subEventDetail1, setSubEventDetail] = useState([]);
  const [enquiryList, setEnquiryList] = useState([]);
  const [subEventList, setSubEventList] = useState([]);
  const [FilteredList, setFilteredList] = useState([]);
  const [AttachedFilterList, setAttachedFilterList] = useState([]);
  console.log(FilteredList, "filterSEect");
  const ExtendDateEvent = () => {
    const adminurl = `${urlPrefix}v1.0/extendExpireEvent?eventId=${eventId}`;

    return axios.put(
      adminurl,
      {},
      {
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
      }
    );
  };

  const getprogram = () => {
    const adminurl = `${urlPrefix}v1.0/getAllPrograms?eventId=${eventId}`;

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
        // console.log(res.data.response.responseData);

        //  let unique = [
        //    ...new Map(data.map((item) => [item["eventType"], item])).values(),
        //  ];
        setSubEventDetail(res.data.response?.responseData);
        setFilteredList([
          ...new Map(
            res.data.response?.responseData.map((item) => {
              return [item["eventType"], item];
            })
          ).values(),
        ]);
        setEnquiryList(
          res.data.response?.responseData.filter((item) => {
            return item.queryRaised === true;
          })
        );

        getAttached();
      });
  };

  const getAttached = () => {
    const adminurl = `${urlPrefix}v1.0/getAttachedProgram?eventId=${eventId}`;

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
        // console.log(res.data.response.responseData);
        setSubEventList(res.data.response?.responseData);
        setAttachedFilterList([
          ...new Map(
            res.data.response?.responseData.map((item) => {
              return [item["eventType"], item];
            })
          ).values(),
        ]);
        // handleSubscription();
      });
  };

  useEffect(() => {
    ExtendDateEvent();
    getprogram();
    getAttached();
  }, [eventId]);

  console.log(enquiryList, "enquiry");
  const setcardstyle = { display: "flex", flexWrap: "wrap", display: "none" };
  const agsetcardstyle = { display: "flex", flexWrap: "wrap", display: "none" };
  const agcardstyle = { display: "flex", flexWrap: "wrap" };
  const [filterstyle, setfilterstyle] = useState({
    display: "flex",
    flexWrap: "wrap",
    display: "none",
  });

  const setfiltercardstyle = { display: "flex", flexWrap: "wrap" };

  function sel(e) {
    setmystyle(setcardstyle), setfilterstyle(setfiltercardstyle);
    setselval(e.target.value);
  }

  const today = new Date();

  const [value, onChange] = useState([today, today]);

  const handleSubscription = () => {
    getprogram();
    getAttached();
  };
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterData, setFilterData] = useState([]);
  const [toggle, setToggle] = useState("Available");
  const handleStatus = (value) => {
    setFilterStatus("ALL");
    setToggle(value);
  };
  console.log(toggle, "toggle");

  const filterList = (e) => {
    setFilterStatus(e.target.value);
    if (toggle === "Enquiry") {
      setFilterData(
        enquiryList.filter((item) => {
          return item.eventType === e.target.value;
        })
      );
    } else if (toggle === "Available") {
      setFilterData(
        subEventDetail1.filter((item) => {
          return item.eventType === e.target.value;
        })
      );
    } else if (toggle === "MyCart") {
      setFilterData(
        subEventList.filter((item) => {
          return item.eventType === e.target.value;
        })
      );
    }
  };
  const renderSubEventList = () => {
    if (subEventDetail1.length > 0) {
      return (
        <>
          <div style={{ backgroundColor: "white", height: "800px" }}>
            <div className="help">
              <div style={{ width: "20%", fontSize: "50px" }}>
                {/* <span> */}
                <TriStateToggle
                  values={["Available", "MyCart", "Enquiry"]}
                  selected={toggle}
                  handleChange={handleStatus}
                />
              </div>
              <div style={{ width: "55%" }}>
                {toggle === "Available" ? (
                  <>
                    <span style={{ fontSize: "13px" }}>Category </span>
                    <span style={{ marginLeft: "5px" }}>
                      <select onChange={filterList} defaultValue="ALL">
                        <option value="ALL">All</option>
                        {FilteredList.map((curelem, index) => {
                          return (
                            <>
                              <option> {curelem.eventType} </option>
                            </>
                          );
                        })}
                      </select>
                    </span>
                  </>
                ) : (
                  ""
                )}
                {toggle === "Enquiry" ? (
                  <>
                    <span style={{ fontSize: "13px" }}>Category </span>
                    <span style={{ marginLeft: "5px" }}></span>
                    <select onChange={filterList} defaultValue="ALL">
                      <option value="ALL">All</option>
                      {enquiryList.map((curelem, index) => {
                        return (
                          <>
                            <option> {curelem.eventType} </option>
                          </>
                        );
                      })}
                    </select>
                  </>
                ) : (
                  ""
                )}
                {toggle === "MyCart" ? (
                  <>
                    <span style={{ fontSize: "13px" }}>Category </span>
                    <span style={{ marginLeft: "5px" }}></span>
                    <select onChange={filterList} defaultValue="ALL">
                      <option value="ALL">All</option>
                      {AttachedFilterList.map((curelem, index) => {
                        return (
                          <>
                            <option> {curelem.eventType} </option>
                          </>
                        );
                      })}
                    </select>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
            {toggle === "Available" ? (
              <>
                <h1> Build Your Wellness Calender </h1>
                {filterStatus === "ALL" ? (
                  <>
                    {subEventDetail1.length > 0 ? (
                      <div style={mystyle}>
                        {subEventDetail1.map((subEventDetail) => (
                          <>
                            {subEventDetail.queryRaised === false ? (
                              <MarketPlace
                                subEventDetail={subEventDetail}
                                currentEventObj={currentEventObj}
                                handleSubscription={handleSubscription}
                                type="view"
                                eventId={eventId}
                              />
                            ) : (
                              ""
                            )}
                          </>
                        ))}
                      </div>
                    ) : (
                      <FallbackDiv
                        {...{
                          width: "100%",
                          padding: "20px",
                        }}
                      >
                        <NoData />
                      </FallbackDiv>
                    )}
                  </>
                ) : (
                  <div style={mystyle}>
                    {filterData.map((subEventDetail) => (
                      <>
                        {subEventDetail.queryRaised === false ? (
                          <MarketPlace
                            subEventDetail={subEventDetail}
                            currentEventObj={currentEventObj}
                            handleSubscription={handleSubscription}
                            type="view"
                            eventId={eventId}
                          />
                        ) : (
                          ""
                        )}
                      </>
                    ))}
                  </div>
                )}
              </>
            ) : (
              ""
            )}

            {toggle === "Enquiry" ? (
              <>
                <h1>Enquiry Submitted</h1>
                {filterStatus === "ALL" ? (
                  <>
                    {enquiryList && enquiryList.length > 0 ? (
                      <>
                        <div style={mystyle}>
                          {enquiryList.map((subEventDetail) => (
                            <>
                              {subEventDetail.queryRaised === true ? (
                                <MarketPlace
                                  subEventDetail={subEventDetail}
                                  currentEventObj={currentEventObj}
                                  handleSubscription={handleSubscription}
                                  type="view"
                                  eventId={eventId}
                                />
                              ) : (
                                ""
                              )}
                            </>
                          ))}
                        </div>
                      </>
                    ) : (
                      <FallbackDiv
                        {...{
                          width: "100%",
                          padding: "20px",
                        }}
                      >
                        <NoData />
                      </FallbackDiv>
                    )}
                  </>
                ) : (
                  <div style={mystyle}>
                    {filterData.map((subEventDetail) => (
                      <>
                        {/* {subEventDetail.queryRaised === false ? ( */}
                        <MarketPlace
                          subEventDetail={subEventDetail}
                          currentEventObj={currentEventObj}
                          handleSubscription={handleSubscription}
                          type="view"
                          eventId={eventId}
                        />
                        {/* // ) : (
                        //   ""
                        // )} */}
                      </>
                    ))}
                  </div>
                )}
              </>
            ) : (
              ""
            )}

            {toggle === "MyCart" ? (
              <>
                <h1>Added Program </h1>
                {filterStatus === "ALL" ? (
                  <>
                    {subEventList.length > 0 ? (
                      <div style={mystyle}>
                        {subEventList.map((subEventDetail) => (
                          <>
                            <Attached
                              subEventDetail={subEventDetail}
                              currentEventObj={currentEventObj}
                              handleSubscription={handleSubscription}
                              type="view"
                              eventId={eventId}
                            />
                          </>
                        ))}
                      </div>
                    ) : (
                      <FallbackDiv
                        {...{
                          width: "100%",
                          padding: "20px",
                        }}
                      >
                        <NoData />
                      </FallbackDiv>
                    )}
                  </>
                ) : (
                  <div style={mystyle}>
                    {filterData.map((subEventDetail) => (
                      <>
                        <Attached
                          subEventDetail={subEventDetail}
                          currentEventObj={currentEventObj}
                          handleSubscription={handleSubscription}
                          type="view"
                          eventId={eventId}
                        />
                      </>
                    ))}
                  </div>
                )}
              </>
            ) : (
              ""
            )}
          </div>
        </>
      );
    }

    return (
      <FallbackDiv
        {...{
          width: "100%",
          padding: "20px",
        }}
      >
        <NoData />
      </FallbackDiv>
    );
  };

  return (
    <>
      <div style={{ backgroundColor: "white" }}>
        <div
          style={{
            width: "80%",
            display: "flex",
            flexDirection: "column",
            marginLeft: "10%",
            marginTop: "1%",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          ></div>
          <div style={{ paddingBottom: 30 }}>{renderSubEventList()}</div>
        </div>
      </div>
    </>
  );
};
export default Activity;
