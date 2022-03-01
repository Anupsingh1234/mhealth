import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import classNames from "classnames";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
}));

const CircularSpinner = () => {
  const classes = useStyles();

  return (
    <div className={classNames(classes.root, "flex justify-center m-0 p-0")}>
      <CircularProgress />
    </div>
  );
};

export default CircularSpinner;
