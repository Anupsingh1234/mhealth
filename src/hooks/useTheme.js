import { useState, useEffect } from "react";
import { getClientTheme } from "../services/challengeApi";

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
      return "";
    }
  };

  useEffect(() => {
    setLoading(true);
    getClientTheme(getClientHostName())
      .then((res) => {
        setLoading(false);
        if (res.data.response.responseMessage === "SUCCESS") {
          const data = res.data.response.responseData;
          const defaultPrimaryColor =
            "linear-gradient(to left, #0052d4, #65c7f7, #9cecfb)";
          const theme = {
            ...data,
            buttonBGColor: data.buttonBgColor || "#66f",
            buttonTextColor: data.buttonTextColor || "#FFFFFF",
            primaryColor: data.primaryColor || defaultPrimaryColor,
            eventLogo: data.eventLogo,
          };
          setTheme(theme);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  return { theme, loading };
};

export default useTheme;
