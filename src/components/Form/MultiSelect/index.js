import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

export default function MultiSelect({ label, options, handleChange }) {
  const [selected, setSelected] = React.useState([]);

  const handleChangeP = (event) => {
    const {
      target: { value },
    } = event;
    setSelected(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    handleChange(value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 500 }}>
        <InputLabel id="demo-multiple-checkbox-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selected}
          onChange={handleChangeP}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => {
            const selectedValue = options
              .filter((op) => selected.includes(op.id))
              .map((op) => op.name);
            return selectedValue.join(", ");
          }}
          MenuProps={MenuProps}
        >
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              <Checkbox checked={selected.indexOf(option.id) > -1} />
              <ListItemText primary={option.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
