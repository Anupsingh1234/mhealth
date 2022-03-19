import React, { useState, useContext } from "react";
import Input from "../Form/Input";
import { PrimaryButton } from "../Form/Button";

import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import ThemeContext from "../../context/ThemeContext";

import "../../styles/SearchByCode.css";

const SearchByCode = ({ handleSearchEvent }) => {
  const { theme } = useContext(ThemeContext);
  const [keyword, setKeyword] = useState("");
  return (
    <div
      style={{ background: theme.primaryColor }}
      className="max-w-xl my-[1rem] md:my-[2rem] mx-auto rounded py-[1rem] md:py-[3rem] px-[2rem] flex h-auto items-center justify-center"
    >
      <div className="iconDiv">
        <FA icon={faQrcode} size="6x" />
      </div>
      <div className="inputC">
        <div>
          <div className="title">Do you have a code?</div>
          <div className="subTitle">You can search the event by code.</div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row mt-[2rem] items-center max-w-xs">
          <Input
            type="text"
            name="code"
            id="code"
            placeholder="Enter code"
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={() => handleSearchEvent(keyword)}
            className="rounded"
          />
          <div>
            <PrimaryButton
              mini
              className="ml-2"
              onClick={() => handleSearchEvent(keyword)}
            >
              Search
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchByCode;
