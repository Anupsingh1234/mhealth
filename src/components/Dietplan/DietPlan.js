import React, { useEffect, useState, useRef } from "react";
import TableHead from "@material-ui/core/TableHead";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TextField from "@material-ui/core/TextField";
import TableCell from "@material-ui/core/TableCell";
import { Paper, TableRow } from "@material-ui/core";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { urlPrefix, secretToken } from "../../services/apicollection";
import { PrimaryButton } from "../Form/Button";

const DietPlan = () => {
  var currD = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
  ];
  var currM = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  var date = new Date();
  var currentDate = date.getDate();

  var days = currentDate;

  var last = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
  var day = last.getDate();
  var month = last.getMonth() + 1;
  var year = last.getFullYear();
  var currentMos = date.getMonth() + 1;
  var currYear = date.getFullYear();

  var to = currYear + "-" + "0" + currentMos + "-" + "0" + currentDate;
  var from = year + "-" + "0" + month + "-" + day;
  const font = {
    fontWeight: "bolder",
  };
  // console.log(from, "from", to);
  const [dietplandata, setdietplandata] = useState();
  const [earlyMorning, setearlyMorning] = useState([]);
  const [midMorning, setmidMorning] = useState([]);
  const [breakfast, setbreakfast] = useState([]);
  const [dinner, setdinner] = useState([]);
  const [Lunch, setLunch] = useState([]);
  const [Evening, setEvening] = useState([]);
  const [postDinner, setpostDinner] = useState([]);
  const [routineDates, setroutineDates] = useState([]);
  const [style, setstyle] = useState({ display: "none" });
  const [width, setwidth] = useState({ width: "100%", height: "100%" });
  const [flag, setflag] = useState(true);
  const [fromdate, setfromDate] = useState(from);
  const [toDate, settoDate] = useState(to);
  const FromDate = (e) => {
    setfromDate(e.target.value);
  };

  const ToDate = (e) => {
    settoDate(e.target.value);
  };
  // flag == true ? "" : setstyle({ display: "none" });
  useEffect(() => {
    if (flag == false) {
      setstyle({ display: "none" });
      setwidth({ width: "100%", height: "100%" });
    }
  }, [flag]);

  const useStyles1 = makeStyles((theme) => ({
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    button: {
      display: "block",
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }));
  const classes1 = useStyles1();
  console.log(urlPrefix, "urlPrefix");
  const getData = () => {
    const URL = `${urlPrefix}v1.0/userhealthChart?fromDate=${fromdate}&toDate=${toDate}`;
    return axios
      .get(URL, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
          timeStamp: "timestamp",
          accept: "*/*",
          "Access-Control-Allow-Origin": "*",
          withCredentials: true,
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
          "Access-Control-Allow-Headers":
            "accept, content-type, x-access-token, x-requested-with",
        },
      })
      .then((res) => {
        // let x = 0;
        setdietplandata(res.data.response.responseData);
        {
          res.data.response.responseData.phc &&
            setroutineDates(res.data.response.responseData.phc?.dates);
          setdinner(res.data.response.responseData.phc.plansMap.Dinner);
          setbreakfast(res.data.response.responseData.phc.plansMap.Breakfast);
          setearlyMorning(
            res.data.response.responseData.phc.plansMap.Early_Morning
          );
          setEvening(res.data.response.responseData.phc.plansMap.Evening);
          setmidMorning(
            res.data.response.responseData.phc.plansMap.Mid_Morning
          );

          // setLunch(res.data.response.responseData.phc[0].plansMap.lunch);
          setLunch(res.data.response.responseData.phc.plansMap.AfterNoon);
        }
      });
  };
  console.log(routineDates);
  return (
    <>
      <div className="head">
        <div className="d-flex h-14">
          <fieldset>
            <legend>From Date:</legend>
            <form className={classes1.container} noValidate>
              <TextField
                style={{ fontSize: 12, width: "200px" }}
                id="date"
                type="date"
                value={fromdate}
                className={classes1.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={FromDate}
              />
            </form>
          </fieldset>

          <fieldset style={{ marginLeft: "40px" }}>
            <legend>To Date:</legend>
            <form className={classes1.container} noValidate>
              <TextField
                style={{ fontSize: 12, width: "200px" }}
                id="date"
                type="date"
                value={toDate}
                className={classes1.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={ToDate}
              />
            </form>
          </fieldset>
          <PrimaryButton
            className="w-28 ml-8 mt-6"
            style={{
              height: "35px",
              background: "green",
              color: "#fff",
              borderRadius: "25px",
            }}
            onClick={() => getData()}
          >
            {" "}
            Submit
          </PrimaryButton>
        </div>
      </div>
      <div style={width}>
        <Paper id="my-table" className="mt-5" elevation={3}>
          <div style={style}>
            {" "}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center",
                  marginTop: "30px",
                }}
              >
                <div style={{ display: "none" }}>
                  <h4 style={{ fontWeight: "bolder" }}>
                    {" "}
                    Diet shorts by nisha
                  </h4>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <h4 style={{ fontWeight: "bolder" }}> Nutritionist Nisha</h4>
                  <h4> Mobile no. 9999848574 </h4>
                  <h4>Email id: waytolife.dtnisha@gmail.com</h4>
                </div>
                <div
                  style={{
                    display: "flex",

                    justifyContent: "center",
                  }}
                >
                  <TableBody
                    style={{ fontWeight: "bolder", marginTop: "30px" }}
                  >
                    <TableRow>
                      <TableCell>
                        {" "}
                        Name :
                        {localStorage.getItem("firstName") +
                          " " +
                          localStorage.getItem("lastName")}
                      </TableCell>
                      <TableCell>
                        Mobile No : {localStorage.getItem("mobileNumber")}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        {" "}
                        DOB / SEX :
                        {dietplandata?.dob +
                          " " +
                          "/" +
                          localStorage.getItem("gender")}
                      </TableCell>
                      <TableCell>
                        Blood group :{dietplandata?.bloodGroup}
                        Food type : {dietplandata?.foodType}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        {" "}
                        DOB / SEX :
                        {dietplandata?.dob +
                          " " +
                          "/" +
                          localStorage.getItem("gender")}
                      </TableCell>
                      <TableCell>
                        Height :{dietplandata?.height}
                        Weight : {dietplandata?.weight}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </div>
              </div>{" "}
            </div>
          </div>
          <hr />
          {dietplandata && routineDates.length >= 0 ? (
            <Table style={{ marginTop: "10px" }}>
              <TableHead>
                {" "}
                <TableRow>
                  <TableCell align="Left" style={font}>
                    {" "}
                    Meal{" "}
                  </TableCell>

                  {routineDates?.map((item, index) => {
                    return (
                      <TableCell align="center" style={font}>
                        {" "}
                        {item}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="Left"> Early Morning </TableCell>
                  {earlyMorning?.map((item, index) => {
                    return (
                      <TableCell align="center" style={font}>
                        {" "}
                        {item}
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow>
                  <TableCell align="left"> Breakfast </TableCell>
                  {breakfast?.map((item, index) => {
                    return (
                      <TableCell align="center" style={font}>
                        {" "}
                        {item}
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow>
                  <TableCell align="left"> Mid Morning </TableCell>
                  {midMorning?.map((item, index) => {
                    return (
                      <TableCell align="center" style={font}>
                        {" "}
                        {item}
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow>
                  <TableCell align="left"> Lunch </TableCell>
                  {Lunch?.map((item, index) => {
                    return (
                      <TableCell align="center" style={font}>
                        {" "}
                        {item}
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow>
                  <TableCell align="left"> Evening </TableCell>
                  {Evening?.map((item, index) => {
                    return (
                      <TableCell align="center" style={font}>
                        {" "}
                        {item}
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow>
                  <TableCell align="left"> Dinner </TableCell>
                  {dinner?.map((item, index) => {
                    return (
                      <TableCell align="center" style={font}>
                        {" "}
                        {item}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "350px",
              }}
            >
              No Data Available
            </div>
          )}
        </Paper>
      </div>
    </>
  );
};

export default DietPlan;
