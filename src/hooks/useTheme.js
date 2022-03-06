import { useState, useEffect } from "react";
import { getClientTheme } from "../services/challengeApi";
const defaultPrimaryColor =
  "linear-gradient(to left, #0052d4, #65c7f7, #9cecfb)";

const defaultTheme = {
  buttonBGColor: "#66f",
  buttonTextColor: "#FFFFFF",
  primaryColor: defaultPrimaryColor,
  eventLogo:
    "https://walkathon21.s3.ap-south-1.amazonaws.com/event/status/3363e6a18c93968ea0d67e6d4bf14731107dbd9c",
};
const useTheme = () => {
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const getClientHostName = () => {
    if (
      window !== undefined &&
      window?.location &&
      window.location?.hostname &&
      window.location.hostname !== "localhost"
    ) {
      return window.location.hostname.split(".")[0];
    } else {
      return "walkathon21";
    }
  };

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
          };
          setTheme(theme);
        }
      })
      .catch((err) => {
        setTheme(defaultTheme);
        setLoading(false);
      });
  }, []);

  return { theme, loading };
};

export default useTheme;
