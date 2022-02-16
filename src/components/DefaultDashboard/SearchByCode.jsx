import React, { useState } from "react";
import Input from "../Form/Input";
import Button from "../Form/Button";

import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";

import "../../styles/SearchByCode.css";

const SearchByCode = ({ handleSearchEvent }) => {
  const [keyword, setKeyword] = useState("");
  return (
    <div className="SBCcontainer">
      <div className="iconDiv">
        <FA icon={faQrcode} size="6x" />
      </div>
      <div className="inputC">
        <div>
          <div className="title">Do you have a code?</div>
          <div className="subTitle">You can search the event by code.</div>
        </div>
        <div className="inputContainer">
          <Input
            type="text"
            name="code"
            id="code"
            placeholder="Enter code"
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={() => handleSearchEvent(keyword)}
          />
          <Button text="Search" onClick={() => handleSearchEvent(keyword)} />
        </div>
      </div>
    </div>
  );
};

export default SearchByCode;
