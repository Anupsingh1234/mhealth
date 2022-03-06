import ThemeContext from "./ThemeContext";
import useTheme from "../hooks/useTheme";

const ThemeProvider = (props) => {
  const { theme, loading } = useTheme();
  return (
    <ThemeContext.Provider value={{ theme, loading }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
