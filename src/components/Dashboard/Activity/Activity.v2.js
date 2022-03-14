import React, { useEffect, useState, useContext } from "react";
import SubEventCard from "./SubEventCard";
import FallbackDiv from "../../Utility/FallbackDiv";
import useActivity from "../hooks/useActivity";
import NoData from "../../NoData";
import DateRangePickerW from "./DateRangePickerW";
import TriStateToggle from "./TriStateToggle";
import "../../../styles/Activity.css";
import ThemeContext from "../../../context/ThemeContext";
import classNames from "classnames";

const ActivityV2 = ({ eventId, currentEventObj, isProgramAvailable }) => {
  const { theme } = useContext(ThemeContext);
  const [selval, setselval] = useState("");

  const [mystyle, setmystyle] = useState({
    display: "flex",
    flexWrap: "wrap",
  });
  const setcardstyle = { display: "flex", flexWrap: "wrap", display: "none" };
  const agsetcardstyle = { display: "flex", flexWrap: "wrap", display: "none" };
  const agcardstyle = { display: "flex", flexWrap: "wrap" };
  const [filterstyle, setfilterstyle] = useState({
    display: "flex",
    flexWrap: "wrap",
    display: "none",
  });
  const [dataarr, setdataarr] = useState([]);
  const [uniquearr, setuniquearr] = useState([]);
  const setfiltercardstyle = { display: "flex", flexWrap: "wrap" };

  function sel(e) {
    setmystyle(setcardstyle), setfilterstyle(setfiltercardstyle);
    setselval(e.target.value);
  }
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [filteredSubEvent, setFilteredSubEvent] = useState([]);
  const today = new Date();

  const [value, onChange] = useState([today, today]);
  const [subEventList, scheduledData, fetchSubEvents] = useActivity(
    eventId,
    value
  );

  useEffect(() => {
    isProgramAvailable(subEventList.length > 0);
  }, [subEventList]);

  const handleDateChange = (ob) => {
    onChange(ob);
  };

  const handleSubscription = () => {
    fetchSubEvents(value);
  };
  useEffect(() => {
    setSelectedFilter("all");
    setmystyle(agcardstyle), setfilterstyle(agsetcardstyle);
    setFilteredSubEvent([]);
  }, [eventId]);

  const renderSubEventList = () => {
    const data =
      selectedFilter !== "all"
        ? selectedFilter == "Schedule"
          ? scheduledData
          : filteredSubEvent
        : subEventList;

    useEffect(() => {
      let unique = [
        ...new Map(data.map((item) => [item["eventType"], item])).values(),
      ];
      setdataarr(unique);
    }, [data]);

    if (data.length) {
      var marvelHeroes = data.filter(function (hero) {
        const x = hero.eventType == selval;
        return x;
      });

      return (
        <>
          {selval === "" && (
            <>
              {data.map((subEventDetail) => (
                <>
                  {subEventDetail.timePeriod !== "PAST" ? (
                    <SubEventCard
                      subEventDetail={subEventDetail}
                      currentEventObj={currentEventObj}
                      handleSubscription={handleSubscription}
                      type="view"
                    />
                  ) : (
                    ""
                  )}
                </>
              ))}
            </>
          )}
          {selval === "all" && (
            <>
              {data.map((subEventDetail) => (
                <>
                  {subEventDetail.timePeriod !== "PAST" ? (
                    <SubEventCard
                      subEventDetail={subEventDetail}
                      currentEventObj={currentEventObj}
                      handleSubscription={handleSubscription}
                      type="view"
                    />
                  ) : (
                    ""
                  )}
                </>
              ))}
            </>
          )}
          {selectedFilter === "old" && (
            <>
              {data.map((subEventDetail) => (
                <>
                  {subEventDetail.timePeriod === "PAST" ? (
                    <SubEventCard
                      subEventDetail={subEventDetail}
                      currentEventObj={currentEventObj}
                      handleSubscription={handleSubscription}
                      type="view"
                    />
                  ) : (
                    ""
                  )}
                </>
              ))}
            </>
          )}
          {marvelHeroes.length > 0 && (
            <>
              {marvelHeroes.map((subEventDetail) => (
                <SubEventCard
                  subEventDetail={subEventDetail}
                  currentEventObj={currentEventObj}
                  handleSubscription={handleSubscription}
                  type="view"
                />
              ))}
            </>
          )}
        </>
      );
    } else {
      return (
        <div>
          <div className="noProgram">
            {currentEventObj.challengeName && (
              <div>
                No program available for&nbsp;
                <span
                  style={{
                    fontWeight: 800,
                  }}
                >
                  {`${currentEventObj.challengeName}`}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
  };
  useEffect(() => {
    if (selectedFilter.toUpperCase() !== "SCHEDULE") {
      setselval("");
      setFilteredSubEvent(
        subEventList.filter(
          (val) =>
            val?.otherStatus?.toUpperCase() === selectedFilter.toUpperCase()
          // val?.eventType?.toUpperCase() === 'YOGA'
        )
      );
    }
  }, [selectedFilter]);

  useEffect(() => {
    fetchSubEvents(value);
  }, [value]);

  const renderFilterButton = (type) => {
    return (
      <div
        className={
          type.toUpperCase() === selectedFilter.toUpperCase()
            ? "filter-button-program selected-filter-button"
            : "filter-button-program"
        }
        style={{
          background:
            type.toUpperCase() === selectedFilter.toUpperCase()
              ? theme.buttonBGColor
              : undefined,
          color:
            type.toUpperCase() === selectedFilter.toUpperCase()
              ? theme.buttonTextColor
              : undefined,
        }}
        onClick={() => {
          setSelectedFilter(type);
        }}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </div>
    );
  };
  const data =
    selectedFilter !== "all"
      ? selectedFilter == "Schedule"
        ? scheduledData
        : filteredSubEvent
      : subEventList;
  return (
    <>
      {/* Todo: Remove top filters if not needed */}
      <div className="flex flex-col mt-4 border border-[#f3f4f6] p-4 bg-[#f9fafb] md:mx-8 h-[95vh] md:h-[85vh] overflow-scroll">
        <div className="filterContainer">
          <div className="challenge-selector">
            <div className="ch-heading">Programs</div>
            <div className="w-[16.5rem] overflow-hidden">
              <TriStateToggle
                values={["all", "old", "Subscribed", "Available"]}
                selected={selectedFilter}
                handleChange={(value) => {
                  setSelectedFilter(value);
                }}
              />
            </div>
          </div>

          <div className="challenge-selector">
            <div>
              <DateRangePickerW {...{ value, handleDateChange }} />
            </div>
            <div>{renderFilterButton("Schedule")}</div>
          </div>

          <div>
            <select onChange={sel}>
              <option value="all"> select :- </option>
              {dataarr.map((curelem, index) => {
                return (
                  <>
                    <option> {curelem.eventType} </option>
                  </>
                );
              })}
            </select>
          </div>
        </div>
        <div className="programCardContainerv2">{renderSubEventList()}</div>
      </div>
    </>
  );
};
export default ActivityV2;
