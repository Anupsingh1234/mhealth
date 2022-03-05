import React, { useContext } from "react";
import { Switch, SwitchLabel, SwitchRadio, SwitchSelection } from "./styles.js";
import ThemeContext from "../../context/ThemeContext.js";

const titleCase = (str) =>
  str
    .split(/\s+/)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

const ClickableLabel = ({ title, onChange, id, selected, theme }) => (
  <SwitchLabel
    onClick={() => onChange(title)}
    className={id}
    style={selected == title ? { color: theme.buttonTextColor } : {}}
  >
    {titleCase(title)}
  </SwitchLabel>
);

const ConcealedRadio = ({ value, selected }) => (
  <SwitchRadio type="radio" name="switch" defaultChecked={selected === value} />
);

const ToggleSwitch = ({ selected, handleChange, values }) => {
  const { theme } = useContext(ThemeContext);
  const selectionStyle = () => {
    return {
      left: `${(values.indexOf(selected) / 3) * 100}%`,
      background: theme.buttonBGColor,
    };
  };
  return (
    <Switch>
      {values.map((val) => {
        return (
          <span key={val}>
            <ConcealedRadio value={val} selected={selected} />
            <ClickableLabel
              title={val}
              onChange={handleChange}
              selected={selected}
              theme={theme}
            />
          </span>
        );
      })}
      <SwitchSelection style={selectionStyle()} />
    </Switch>
  );
};

export default ToggleSwitch;
