import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "./context/ChallengeContext";
import {
  getAllUserByMobile,
  getCountryListData,
} from "../../services/challengeApi";
import Invite from "./Invite";
import ReactLoadingWrapper from "../loaders/ReactLoadingWrapper";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
const SendChallenge = ({
  eventId,

  // countryCode,
}) => {
  const [countrylist, setCountrylist] = useState([]);
  useEffect(() => {
    getCountryListData().then((res) => {
      setCountrylist(
        res?.data.response?.responseData ? res?.data.response?.responseData : []
      );
    });
  }, []);
  const [mobileNo, setMobileNo] = useState("");
  const [number1, setNumber1] = useState();

  const [countryCode, setCountryCode] = useState();
  console.log(countryCode, number1, "countrycode");
  const { mobileDataList, changeState } = useContext(AppContext);
  const [userFound, setUserFound] = useState(undefined);
  useEffect(() => {
    // getAllUserByMobile(number1).then((res) => {
    //   console.log(res);
    //   if (res.status === 200 && res.data.response.responseCode === 0) {
    //     changeState({ mobileDataList: res.data.response.responseData });
    //   }
    // });
    // setUserFound();

    setMobileNo("+91");
  }, [eventId]);

  const filterCountry = [];
  {
    countrylist?.map((item) => {
      filterCountry.push(item.shortName);
    });
  }
  const [fcountry, setFCountry] = useState([]);
  console.log(filterCountry, "countrylist");

  const handleUserSearch = () => {
    getAllUserByMobile(number1).then((res) => {
      if (res.status === 200 && res.data.response.responseCode === 0) {
        res.data.response.responseData.filter(
          (mobileData) =>
            parseInt(mobileData.mobileNumber) === parseInt(number1)
        );
        setUserFound(res.data.response.responseData);

        if (res.data.response.responseMessage === "No Data Found" && !number1) {
          setUserFound([]);
        }
      } else {
        setUserFound([]);
      }
    });
    console.log(mobileDataList, "mobilelist");
  };

  console.log(eventId, "eventId");
  return (
    <>
      <div className="send-challenge-box">
        <div className="input-area input-mobile fadeInUp"></div>
        <div style={{ display: "flex" }}></div>
        <div className="input-container">
          <div style={{ display: "flex" }}>
            <div style={{ width: "80%" }}>
              {countrylist.length > 0 ? (
                <>
                  <PhoneInput
                    defaultcountry={"in"}
                    onlyCountries={countrylist?.map((item) => item.shortName)}
                    countryCodeEditable={false}
                    // autoFormat={true}

                    inputStyle={{
                      width: "90%",
                    }}
                    value={mobileNo}
                    onChange={(value, country, e) => {
                      //  setUserFound(undefined);
                      // mobilChange(e);
                      let dialCode = country.dialCode;
                      let phoneNumber =
                        value !== null ? value.substring(dialCode.length) : "";
                      let currLocalCountryObj = countrylist.filter(
                        (ctrItem) => ctrItem.shortName == country.countryCode
                      )[0];
                      setFCountry(currLocalCountryObj);
                      setNumber1(phoneNumber);
                      setCountryCode(dialCode);
                    }}
                  />
                </>
              ) : (
                ""
              )}
            </div>
            <div style={{ width: "20%" }}>
              <button
                name="searchUser"
                className={
                  !mobileNo
                    ? "searchUserByMobileDisabled"
                    : "searchUserByMobile"
                }
                onClick={handleUserSearch}
                disabled={!mobileNo}
              >
                Search
              </button>
            </div>
          </div>

          {userFound && (
            <Invite
              userFound={userFound}
              mobileNo={number1}
              eventId={eventId}
              countryCode={countryCode}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default SendChallenge;
