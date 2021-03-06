import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { updateSource, getDataCurrentSource } from "../services/challengeApi";
import Tooltip from "@material-ui/core/Tooltip";
import { getAuthLink } from "../services/challengeApi";
import { useAsync } from "react-use";
import Iframe from "react-iframe";
import CancelIcon from "@material-ui/icons/Cancel";
import InfoDialog from "./Utility/InfoDialog";
import { getUserDetailsHandler } from "../services/userprofileApi";
import { PrimaryButton } from "./Form/Button";
const dataSourceMapping = {
  WHATSAPP: "https://walkathon21.s3.ap-south-1.amazonaws.com/logo/whatsapp.svg",
  STRAVA: "https://walkathon21.s3.ap-south-1.amazonaws.com/logo/strava.svg",
  GOOGLE_FIT:
    "https://walkathon21.s3.ap-south-1.amazonaws.com/logo/googlefit.svg",
};

const UpdateDataSource = ({ dashboardState }) => {
  let currentEvent = dashboardState.listOfChallenges.filter(
    (item) => item.id == dashboardState.selectedChallenge
  )[0];

  const [currentDataSource, setCurrentDataSource] = useState();
  const [originalSource, setOriginalSource] = useState();
  const [mfinemodal, setmfinemodal] = useState(false);
  const [url, seturl] = useState();
  const [authorizedSources, setAuthorizedSource] = useState([]);
  const fetchCurrentDataSource = () => {
    if (currentEvent && currentEvent.id) {
      getDataCurrentSource(currentEvent.id).then((res) => {
        if (res.data.response.responseMessage === "SUCCESS") {
          setCurrentDataSource(res.data.response?.responseData?.datasource);
          setOriginalSource(res.data.response?.responseData?.datasource);
        }
      });
    }
  };

  useEffect(() => {
    setCurrentDataSource();
    setOriginalSource();
    fetchCurrentDataSource();
  }, [dashboardState.selectedChallenge]);

  useEffect(() => {
    getUserDetailsHandler().then((response) => {
      if (response.data.response.responseMessage === "SUCCESS") {
        localStorage.setItem(
          "authorizedDatasource",
          JSON.stringify(
            response.data.response.responseData.authorizedDatasource
          )
        );
        setAuthorizedSource(
          response.data.response.responseData.authorizedDatasource
        );
      }
      fetchCurrentDataSource();
      renderSources();
      setCurrentDataSource();
      setOriginalSource();
      //  fetchCurrentDataSource();
    });
  }, []);
  // let authorizedSources =
  //   localStorage.getItem("authorizedDatasource") != undefined &&
  //   localStorage.getItem("authorizedDatasource") != "undefined"
  //     ? JSON.parse(localStorage.getItem("authorizedDatasource"))
  //     : [];

  const handleDataSourceChange = (value, sourceActive) => {
    if (sourceActive || value === "WHATSAPP") {
      setCurrentDataSource(value);
    }
  };

  const updateDisable = !Object.entries(dataSourceMapping)
    .filter((item) => {
      return item[0] !== originalSource;
    })
    .map((item) => item[0])
    .includes(currentDataSource);

  const renderSources = (type) => {
    let sourcesArray = Object.entries(dataSourceMapping).filter((item) => {
      if (type == "current") {
        return item[0] == originalSource;
      }
      if (type == "change") {
        return item[0] !== originalSource;
      }
    });
    function isLoggedIn() {
      if (localStorage.getItem("token")) {
        return true;
      }
      return false;
    }

    const authoapi = () => {
      setInterval(() => {
        if (localStorage.getItem("selectTab") === "Source") {
          isLoggedIn()
            ? getUserDetailsHandler().then((response) => {
                if (response.data.response.responseMessage === "SUCCESS") {
                  localStorage.setItem(
                    "authorizedDatasource",
                    JSON.stringify(
                      response.data.response.responseData.authorizedDatasource
                    )
                  );
                  setAuthorizedSource(
                    response.data.response.responseData.authorizedDatasource
                  );
                }
                fetchCurrentDataSource();
                renderSources();
                setCurrentDataSource();
                setOriginalSource();
                //  fetchCurrentDataSource();
              })
            : "";
        }
      }, 10000);
    };

    return sourcesArray.map((item) => {
      let currentSource = authorizedSources.filter(
        (source) => source.dataSource === item[0]
      )[0];
      let currentSourceStatus =
        currentSource && currentSource["authorized"] ? "connected" : "connect";
      return (
        <Tooltip
          title={
            currentSourceStatus == "connect" && item[0] !== "WHATSAPP"
              ? "Source not authorized. Please update it in DataSource section"
              : ""
          }
        >
          <div
            style={{
              display: "flex",
              cursor:
                currentSourceStatus == "connect" && item[0] !== "WHATSAPP"
                  ? "not-allowed"
                  : "pointer",
              background:
                currentSourceStatus == "connect" && item[0] !== "WHATSAPP"
                  ? "#eeeeee"
                  : "#fff",
              padding: 3,
              borderRadius: 4,
              flexShrink: 0,
              alignItems: "center ",
              margin: 10,
              cursor:
                currentSourceStatus == "connect" && item[0] !== "WHATSAPP"
                  ? "not-allowed"
                  : "pointer",
              border:
                currentSourceStatus == "connect" && item[0] !== "WHATSAPP"
                  ? "none"
                  : "",
              userSelect: "none",
              height: 65,
            }}
            onClick={() => {
              if (type != "current") {
                handleDataSourceChange(
                  item[0],
                  currentSourceStatus != "connect"
                );
              }
            }}
            key={item[0]}
            className={
              currentDataSource === item[0] && type != "current"
                ? "datasource-image datasource-image-active"
                : type != "current"
                ? "datasource-image"
                : ""
            }
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 12 }}>
                {item[0] === "GOOGLE_FIT" ? "GOOGLE FIT" : item[0]}
              </div>
              <div style={{ fontSize: 10 }}>
                {currentSourceStatus == "connect" && item[0] !== "WHATSAPP" ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <p style={{ fontSize: 9 }}> Not authrized</p>
                    <button
                      style={{
                        fontSize: 9,
                        height: 20,
                        width: 100,
                        marginTop: 0,
                        background: "green",
                        color: "#fff",
                      }}
                      className="rounded-full"
                      onClick={() => {
                        getAuthLink(item[0]).then((res) => {
                          window.open(
                            res?.data?.response?.responseData?.authorizationLink
                          );
                          // setmfinemodal(true);
                        }),
                          authoapi();
                      }}
                    >
                      {" "}
                      Authorize{" "}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
            <img
              src={item[1]}
              key={item[0]}
              style={{
                marginLeft: 5,
                height: 25,
              }}
            />
          </div>
        </Tooltip>
      );
    });
  };

  return (
    <>
      <div
        style={{
          minHeight: 300,
          marginTop: 20,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {currentEvent && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 14 }}>
              {currentEvent["challengeName"]} ( Select to Update Your Data
              Source)
            </div>

            <div
              style={{
                marginTop: 30,
                fontSize: 14,
                display: "flex",
                alignItems: "center",
              }}
            >
              Current Source :
              <div style={{ display: "flex" }}>{renderSources("current")}</div>
            </div>

            <div
              style={{
                marginTop: 20,
                fontSize: 14,
                display: "flex",
                alignItems: "center",
              }}
            >
              Change Source :
              <div style={{ display: "flex" }}>{renderSources("change")}</div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 40,
              }}
            >
              <div style={{ width: 100 }}>
                <PrimaryButton
                  mini
                  onClick={() => {
                    if (!updateDisable) {
                      let payload = {
                        eventId: currentEvent?.id,
                        datasource: currentDataSource,
                      };
                      updateSource(payload).then((res) => {
                        message.success(res.data.response.responseMessage);
                        fetchCurrentDataSource();
                      });
                    }
                  }}
                  disabled={updateDisable}
                >
                  Update
                </PrimaryButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UpdateDataSource;
