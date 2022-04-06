import React, { useEffect, useState, useRef } from "react";
import TableHead from "@material-ui/core/TableHead";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TextField from "@material-ui/core/TextField";
import TableCell from "@material-ui/core/TableCell";
import { Paper, TableRow } from "@material-ui/core";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { urlPrefix } from "../../services/apicollection";
import { PrimaryButton } from "../Form/Button";
import { jsPDF } from "jspdf";
import NoData from "../NoData";
const DietPlan = (props) => {
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
  ];

  useEffect(() => {
    getData();
  }, [props.eventId]);

  var date = new Date();
  var currentDate = date.getDate();

  var days = currentDate;

  var last = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
  var day = last.getDate();
  var month = last.getMonth() + 1;
  var year = last.getFullYear();
  var currentMos = date.getMonth() + 1;
  var currYear = date.getFullYear();

  var dates = currD[currentDate];
  var newDate = (parseInt(dates) - 7).toString();
  if (newDate && newDate.length == 1) {
    dates = "0" + newDate;
  } else {
    dates = newDate;
  }

  var to = currYear + "-" + currM[currentMos] + "-" + currD[currentDate];
  var from = year + "-" + currM[currentMos] + "-" + dates;
  const font = {
    fontWeight: "bolder",
  };
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
  console.log(earlyMorning, "earmorning");
  console.log(midMorning, "midmorning");
  console.log(breakfast, "breakfast");
  console.log(routineDates, "routineDates");
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

  const pdfDownload = () => {
    const doc = new jsPDF();
    earlyMorning?.forEach(({ itemDesc }, index) => {
      doc.text(itemDesc, 10, 10);
    });
    doc.save("a4.pdf");
  };
  // doc.text("Hello world!", 10, 10);

  const classes1 = useStyles1();
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
        {
          res.data.response.responseData.phc &&
            setdietplandata(res.data.response.responseData);
          setroutineDates(res.data.response.responseData.phc?.dates.reverse());
          setdinner(res.data.response.responseData.phc.plansMap._6.reverse());
          setbreakfast(
            res.data.response.responseData.phc.plansMap._2.reverse()
          );
          setearlyMorning(
            res.data.response.responseData.phc.plansMap._1.reverse()
          );
          setEvening(res.data.response.responseData.phc.plansMap._5.reverse());
          setmidMorning(
            res.data.response.responseData.phc.plansMap._3.reverse()
          );
          setLunch(res.data.response.responseData.phc.plansMap._4.reverse());
        }
      });
  };
  const head = ["Event", "Day1", "Day3", "Day4", "Day5", "Day6", "Day7"];
  const data1 = [
    "Tea and exercise",
    "Tea and exercise",
    "Tea and exercise",
    "Tea and exercise",
    "Tea and exercise",
    "Tea and exercise",
    "Tea and exercise",
  ];
  console.log(dietplandata, "sadksjah");
  return (
    <>
      <div style={{ display: "flex" }}>
        <div style={{ width: "20%" }}>
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
        </div>
        <div style={{ width: "20%" }}>
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
        </div>
        <div style={{ width: "40%", marginTop: "-1.5%" }}>
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
        {/* <div style={{width:'20%'}}>
           <PrimaryButton onClick={pdfDownload}> Download </PrimaryButton> 
        </div> */}
      </div>{" "}
      {/*
      <div style={width}>
        <Paper id="my-table" className="mt-5" elevation={3}>
          <div>
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
                  <h4 style={{ fontWeight: "bolder" }}> </h4>
                </div>
                {dietplandata && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <h4 style={{ fontWeight: "bolder" }}>
                      {" "}
                      Coach : {dietplandata && dietplandata?.phc?.coachName} |
                      Program : {dietplandata && dietplandata?.phc?.pname}
                    </h4>
                    {/* <h4>
                      {" "}
                      Mobile no.{" "}
                      {dietplandata && dietplandata?.phc?.phoneNumber}{" "}
                    </h4>
                    <h4>
                      Email id: {dietplandata && dietplandata?.phc?.emailId}
                    </h4>
                  </div>
                )}
                <div
                  style={
                    ({
                      display: "flex",

                      justifyContent: "center",
                    },
                    style)
                  }
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

          {dietplandata && routineDates && routineDates.length >= 0 ? (
            <Table
              style={{ marginTop: "30px", borderTop: "1px solid #ecf0f1" }}
            >
              <hr />
              <TableHead>
                {" "}
                <TableRow>
                  <TableCell align="Left" style={font}>
                    {" "}
                    Meal{" "}
                  </TableCell>

                  {routineDates &&
                    routineDates.reverse().map((item, index) => {
                      return (
                        <TableCell
                          align="center"
                          style={(font, { borderRight: "1px solid Black" })}
                        >
                          {" "}
                          {item}
                        </TableCell>
                      );
                    })}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="Left">
                    {" "}
                    {earlyMorning && earlyMorning[0]?.keyTemplate}{" "}
                  </TableCell>
                  {earlyMorning &&
                    earlyMorning?.map((item, index) => {
                      return (
                        <TableCell
                          align="center"
                          style={(font, { borderRight: "1px solid Black" })}
                        >
                          {" "}
                          {item.value}
                        </TableCell>
                      );
                    })}
                </TableRow>
                <TableRow>
                  <TableCell align="left">
                    {" "}
                    {breakfast && breakfast[0]?.keyTemplate}{" "}
                  </TableCell>
                  {breakfast &&
                    breakfast?.map((item, index) => {
                      return (
                        <TableCell
                          align="center"
                          style={(font, { borderRight: "1px solid Black" })}
                        >
                          {" "}
                          {item.value}
                        </TableCell>
                      );
                    })}
                </TableRow>
                <TableRow>
                  <TableCell align="left">
                    {" "}
                    {midMorning && midMorning[0]?.keyTemplate}{" "}
                  </TableCell>
                  {midMorning &&
                    midMorning?.map((item, index) => {
                      return (
                        <TableCell
                          align="center"
                          style={(font, { borderRight: "1px solid Black" })}
                        >
                          {" "}
                          {item.value}
                        </TableCell>
                      );
                    })}
                </TableRow>
                <TableRow>
                  <TableCell align="left">
                    {" "}
                    {Lunch && Lunch[0]?.keyTemplate}{" "}
                  </TableCell>
                  {Lunch &&
                    Lunch?.map((item, index) => {
                      return (
                        <TableCell
                          align="center"
                          style={(font, { borderRight: "1px solid Black" })}
                        >
                          {" "}
                          {item.value}
                        </TableCell>
                      );
                    })}
                </TableRow>
                <TableRow>
                  <TableCell align="left">
                    {" "}
                    {Evening && Evening[0]?.keyTemplate}{" "}
                  </TableCell>
                  {Evening &&
                    Evening?.map((item, index) => {
                      return (
                        <TableCell
                          align="center"
                          style={(font, { borderRight: "1px solid Black" })}
                        >
                          {" "}
                          {item.value}
                        </TableCell>
                      );
                    })}
                </TableRow>
                <TableRow>
                  <TableCell align="left">
                    {" "}
                    {dinner && dinner[0]?.keyTemplate}{" "}
                  </TableCell>
                  {dinner &&
                    dinner?.map((item, index) => {
                      return (
                        <TableCell
                          align="center"
                          style={(font, { borderRight: "1px solid Black" })}
                        >
                          {" "}
                          {item.value}
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
      </div>*/}
      {/* <div style={{width:'50%',textAlign:'center'}} className="center">
<Table >
  <TableRow style={{border:'1px outset black',height:'40px'}}>
    <TableHead style={{marginLeft:'10px'}}>Name: Raju</TableHead>
  </TableRow>
</Table>
</div>

<div style={{width:'100%',border:'1px outset black'}} className="center">
<Table >
  <TableRow>
    {head.map((item)=>{
      return(<>
    <TableHead style={{marginLeft:'10px'}}>{item.meal}</TableHead>
    </>)
    })}
  </TableRow>
</Table>
</div> */}
      {dietplandata && routineDates && routineDates.length >= 0 ? (
        <div style={{ boxShadow: "20px grey" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
              marginTop: "4%",
            }}
          >
            <div style={{ display: "none" }}>
              <h4 style={{ fontWeight: "bolder" }}> </h4>
            </div>
            {dietplandata && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <h4 style={{ fontWeight: "bolder" }}>
                  {" "}
                  Coach : {dietplandata && dietplandata?.phc?.coachName} |
                  Program : {dietplandata && dietplandata?.phc?.pname}
                </h4>

                <h4>Email id: {dietplandata && dietplandata?.phc?.emailId}</h4>
              </div>
            )}
          </div>
          <div
            className="target-container"
            style={{ border: "2px outset black" }}
          >
            <div className="target-table-row1">
              <div className="target-metric-column1">
                <div style={{ fontWeight: 800 }}>MEAL</div>
              </div>
              <div className="target-data-column1">
                {routineDates &&
                  routineDates.reverse().map((item) => {
                    return (
                      <>
                        <div className="target-data-inner-column2">
                          <div className="target-data-bold">{item}</div>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>

            <div className="target-table-row1">
              <div className="target-metric-column1">
                <div>{earlyMorning && earlyMorning[0]?.keyTemplate} </div>
              </div>
              <div className="target-data-column1">
                {earlyMorning &&
                  earlyMorning?.map((item) => {
                    return (
                      <>
                        <div className="target-data-inner-column2 ">
                          <div className="target-data-bold1">
                            <div>{item.value}</div>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
            <div className="target-table-row1">
              <div className="target-metric-column1">
                <div>{breakfast && breakfast[0]?.keyTemplate} </div>
              </div>
              <div className="target-data-column1">
                {breakfast &&
                  breakfast.map((item) => {
                    return (
                      <>
                        <div className="target-data-inner-column2 ">
                          <div className="target-data-bold1">
                            <div>{item.value}</div>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
            <div className="target-table-row1">
              <div className="target-metric-column1">
                <div> {midMorning && midMorning[0]?.keyTemplate}</div>
              </div>
              <div className="target-data-column1">
                {midMorning &&
                  midMorning.map((item) => {
                    return (
                      <>
                        <div className="target-data-inner-column2 ">
                          <div className="target-data-bold1">
                            <div>{item.value}</div>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
            <div className="target-table-row1">
              <div className="target-metric-column1">
                <div>{Lunch && Lunch[0]?.keyTemplate} </div>
              </div>
              <div className="target-data-column1">
                {Lunch &&
                  Lunch.map((item) => {
                    return (
                      <>
                        <div className="target-data-inner-column2 ">
                          <div className="target-data-bold1">
                            <div>{item.value}</div>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
            <div className="target-table-row1">
              <div className="target-metric-column1">
                <div>{Evening && Evening[0]?.keyTemplate} </div>
              </div>
              <div className="target-data-column1">
                {Evening &&
                  Evening.map((item) => {
                    return (
                      <>
                        <div className="target-data-inner-column2 ">
                          <div className="target-data-bold1">
                            <div>{item.value}</div>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
            <div className="target-table-row1">
              <div className="target-metric-column1">
                <div>{dinner && dinner[0]?.keyTemplate} </div>
              </div>
              <div className="target-data-column1">
                {dinner &&
                  dinner.map((item) => {
                    return (
                      <>
                        <div className="target-data-inner-column2 ">
                          <div className="target-data-bold1">
                            <div>{item.value}</div>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ marginTop: "3%" }}></div>
          <NoData />
        </>
      )}
    </>
  );
};

export default DietPlan;
