import { useState, useEffect } from "react";
import { getClientTheme } from "../services/challengeApi";
import { getSocialLinks } from "../services/loginapi";
import { getClientHostName } from "../utils/commonFunctions";
const defaultPrimaryColor =
  "linear-gradient(to left, #0052d4, #65c7f7, #9cecfb)";

const defaultTheme = {
  buttonBGColor: "#66f",
  buttonTextColor: "#FFFFFF",
  primaryColor: defaultPrimaryColor,
  eventLogo:
    "https://walkathon21.s3.ap-south-1.amazonaws.com/event/status/3363e6a18c93968ea0d67e6d4bf14731107dbd9c",
  sponsorLogo:
    "https://walkathon21.s3.ap-south-1.amazonaws.com/event/master/529d1ca2b0343bb262e4bd95406d32357dcf4fee",
};
const useTheme = () => {
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("");
  useEffect(() => {
    setLoading(true);
    getClientTheme(getClientHostName())
      .then((res) => {
        setLoading(false);
        if (res.data.response.responseMessage === "SUCCESS") {
          const data = res.data.response.responseData;

          const theme = {
            ...data,
            buttonBGColor: data.buttonBGColor || defaultTheme.buttonBGColor,
            buttonTextColor:
              data.buttonTextColor || defaultTheme.buttonTextColor,
            primaryColor: data.primaryColor || defaultTheme.primaryColor,
            eventLogo: data.eventLogo || defaultTheme.eventLogo,
            sponsorLogo: data.sponsorLogo || defaultTheme.sponsorLogo,
          };
          setTheme(theme);
        }
      })
      .catch((err) => {
        setTheme(defaultTheme);
        setLoading(false);
      });

    setLoading(true);
  }, []);

  return { theme, loading };
};

export default useTheme;
