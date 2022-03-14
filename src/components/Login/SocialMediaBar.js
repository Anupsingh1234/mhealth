import classNames from "classnames";
import React from "react";
import { icons } from "../../assets/icons/constants";

const SocialMediaBar = ({ socialLinks, className }) => {
  return (
    Array.isArray(socialLinks) &&
    socialLinks.length > 0 && (
      <div
        className={classNames(
          "p-4 bg-gray-100 h-[max-content] gap-4",
          className
        )}
      >
        {socialLinks.map(
          (data, index) =>
            icons[data.socialMedia] && (
              <a href={data.mediaLink} target="_blank" key={index}>
                <img
                  key={data.id}
                  src={icons[data.socialMedia]}
                  className="inline cursor-pointer"
                  width="22px"
                  height="22px"
                />
              </a>
            )
        )}
      </div>
    )
  );
};

export default SocialMediaBar;
