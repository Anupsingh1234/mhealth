import React, { useState, useEffect } from "react";
import InfoIcon from "@material-ui/icons/Info";
import InfoDialog from "../Utility/InfoDialog";
// import HraQuiz from "./HraQuiz";
import CancelIcon from "@material-ui/icons/Cancel";
import axios from "axios";
import { urlPrefix } from "../../services/apicollection";
// import AssessmentInfo from "./AssessmentInfo";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import dataSource from "../../assets/dataSource.svg";
import message from "antd-message";
import { updateUserDetailsHandler } from "../../services/userprofileApi";
import SubEventCard from "../Dashboard/Activity/SubEventCard";
import { getSubEvent } from "../../services/apicollection";
// import { Paper, TextField } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import { PrimaryButton } from "../Form";
import moment from "moment";
import { Package } from "react-feather";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import ReactCardFlip from "react-card-flip";
import { CheckCircle, ArrowLeftCircle } from "react-feather";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import { Message } from "@material-ui/icons";
import PulseInfo from "./PulseInfo";
import JoiningDetails from "./JoiningDetails";

let monthsObject = {
  "0": "SUN",
  "1": "MON",
  "2": "TUE",
  "3": "WED",
  "4": "THU",
  "5": "FRI",
  "6": "SAT",
  
};
const PackageCard = (eventID, currentEventObj) => {
    const [packageData,setPackageData]=useState([]);
    const [modalView,setModalView]=useState(false);
    const [packageId,setPackageId]=useState("")
    const [stateCheck,setStateStateCheck]=useState("")
    const [packageDetail,setPackageDetail]=useState([])
    const [packageLabDetails,setPackageLabDetails]=useState([])
    const [partnerLabId,setPartnerLabId]=useState("")
    const [status,setStatus]=useState("")
    const [slotModal,setSlotModal]=useState(false)
    const [slotData,setSlotData]=useState([])
    const [flip1, setFlip] = useState(false);
    const [open, setOpen] = useState(false);
    const steps = ["Instruction", "Book"];
    const [pkgSample,setPkgSample]=useState("")
    const [pkgId,setPkgId]=useState("")
    const [instruction,setInstruction]=useState({
      bookingInstructions:'',
      sampleCollectionAddress:'',
      bookingType:'VISIT',
    })
    const [joinInfo,setJoinInfo]=useState(false)
    const [cardInfoDetail,setCardInfoDetails]=useState({})
    const [digPartnerId,setDigPartnerId]=useState("")
    const [calender, setCalender] = useState([]);
    const [booking,setBooking]=useState([])
    const [activeStep, setActiveStep] = useState(0);
    const [dateState, setDateState] = useState("00-00-0000");
    const dtt = moment(dateState).format("YYYY-MM-DD").toString();
    const filterDate = moment(new Date()).format("YYYY-MM-DD").toString();
    const today = new Date();
    const tttt1 = today.getHours() + 1 + ":" + today.getMinutes() + ":" + "00";
    console.log(tttt1);
    const ddt = [];
    const [time, setTime] = useState();
    const mark = [];
    const tt = [];
    const changeDate = (e) => {
      setTime(false);
      setDateState(e);
    };
  
    const flipCard1 = () => {
      setFlip(false);
      setJoinTable(false);
    };
    {
      calender &&
        calender.map((item, index) => {
          // console.log(item);
          mark.push(item.date);
        });
    }
    console.log(dateState, time);
    const dateenable = [];
    {
      calender &&
        calender.map((item, index) => {
          console.log(item);
          dateenable.push(item.date);
          if (calender.length === index + 1) {
            ddt.push(item.date);
            console.log(ddt);
          }
        });
    }
    const handleInstruction=(e)=>{
      const name = e.target.name;
      const value = e.target.value;
      setInstruction((values) => ({ ...values, [name]: value }));
    }
    useEffect(() => {
        card();
        
      }, [eventID]);
      
    const card = (e) => {
        const URL = `${urlPrefix}v1.0/getEventHealthPackage?challengerZoneId=${localStorage.getItem(
            "selectEvent"
          )}`;
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
              console.log(res.data.response.responseData, "card");
              res.data.response.responseData &&
                // setcardDetails(res.data.response.responseData.hac);
                setPackageData(res.data.response.responseData);
            }
    
            // setscoreDetails(res?.data?.response?.responseData);
          });
      };
      const packageInfo = (value) => {
        const URL = `${urlPrefix}v1.0/getPackageWiseInfo?action=${value}&packageId=${packageId}`;
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
              console.log(res.data.response.responseData, "card");
              res.data.response.responseData &&
                // setcardDetails(res.data.response.responseData.hac);
                setPackageDetail(res.data.response.responseData);
            }
    
            // setscoreDetails(res?.data?.response?.responseData);
          });
      };
      const getLabDetails = (value) => {
        const URL = `${urlPrefix}v1.0/getPkgLabsDetail?action=${stateCheck}&data=${value}&packageId=${packageId}`;
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
              console.log(res.data.response.responseData, "card");
              res.data.response.responseData &&
                // setcardDetails(res.data.response.responseData.hac);
                setPackageLabDetails(res.data.response.responseData);
            }
    
            // setscoreDetails(res?.data?.response?.responseData);
          });
      };
      const getSlots = (id) => {
        const URL = `${urlPrefix}v1.0/getLabBookingSlots?packageId=${packageId}&partnerLabId=${id}`;
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
              console.log(res.data.response.responseData, "card");
              res.data.response.responseData &&
                // setcardDetails(res.data.response.responseData.hac);
                setCalender(res.data.response.responseData);
            }
    
            // setscoreDetails(res?.data?.response?.responseData);
          });
      };
      const saveBookingApi=()=>{
        if (dateState !== "" && time !== false) {
        let payload={
          healthPkgId:packageId,
          digPartnerId:digPartnerId,
          partnerLabId:partnerLabId,
          bookingType:instruction.bookingType?instruction.bookingType:"VISIT",
          bookingSlotDatetime:dtt+" "+time+":00",
          bookingInstructions:instruction.bookingInstructions!==""?instruction.bookingInstructions:'NA',
          sampleCollectionAddress:instruction.sampleCollectionAddress!==""?instruction.sampleCollectionAddress:'NA'
        }
        const adminurl = `${urlPrefix}v1.0/createCheckupBooking`;
          return axios
            .post(adminurl,payload, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, 
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
              if(res.data.response.responseMessage=="SUCCESS"){
                message.success(res.data.response.responseData)
                setSlotModal(false)
                setDateState("");
                setTime("")
                setActiveStep(0)
                setInstruction({
                  bookingInstructions:'',
                  sampleCollectionAddress:'',
                })
                card()
      setPackageDetail([])
      setPackageLabDetails([])
      setSlotData([])
                setModalView(false)
              }
            })
          }else{
            message.error("please Select Date and Time !")
          }
      }
      useEffect(() => {
        // packageInfo()
        setPackageLabDetails([])
        setStatus("")
      }, [stateCheck]);
      const handleChange=(e)=>{
        packageInfo(e.target.value)
        setStateStateCheck(e.target.value)
      }
  const handleClose=()=>{
      setModalView(false);
      setPackageDetail([])
      setPackageLabDetails([])
      setSlotData([])
  }
  const handleState=(e)=>{
    getLabDetails(e.target.value);
    setStatus(e.target.name)
  }
  const handleCloseSlot=()=>{
    setSlotModal(false)
    setActiveStep(0)
    setInstruction({
      bookingInstructions:'',
      sampleCollectionAddress:'',
    })
    setDateState("00-00-0000");
     setTime("")
  }
  return(<>
  {packageData && packageData.length > 0 ? (
        <>
         <ReactCardFlip isFlipped={flip1} flipDirection="horizontal">
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {packageData &&
              packageData.map((item, index) => {
                return (
                  <>
                    <div
                      // onClick={() => {
                      //   localStorage.setItem("eventCode", subEventDetail.eventCode);
                      // }}

                      className="challenge-card"
                      style={
                        {
                          margin: "25px 5px",
                          height: "auto",
                          cursor: "pointer",
                        }
                        // : { height: "auto" }
                      }
                    >
                      {" "}
                      <div
                        key={index}
                        style={{
                          width: 230,
                          height: 100,
                          borderRadius: "12px 12px 0px 0px",
                          background: "#fff",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <img
                          // src={subEventDetail.eventImage || eventGalleryNoData}
                          src={item.packageBanner}
                          style={{
                            width: 230,
                            height: 100,
                            objectFit: "cover",
                            borderRadius: "12px 12px 0px 0px",
                          }}
                          // onError={(e) => {
                          //   e.target.onerror = null;
                          //   e.target.src = eventGalleryNoData;
                          // }}
                        />
                        <div
                style={{
                  position: "absolute",
                  bottom: 5,
                  fontSize: 12,
                  color: "#fff",
                  left: 5,
                }}
              >
                <span
                  style={{
                    background: "#43a047",
                    borderRadius: 4,
                    padding: "0px 4px",
                    marginLeft: 5,
                  }}
                >
                  {item.packagePrice == 0
                    ? "Free"
                    : `Fees : ${item.packagePrice}`}
                </span>
              </div>
                      </div>
                      <div className="challenge-card-details">
                        <div className={"challenge-card-details-name"}>
                          {/* {subEventDetail.eventName} */}
                          {item.healthPkgName}
                        </div>
                        <div className="register-button">
                          <PrimaryButton
                            style={{ marginBottom: "10px" }}
                            onClick={() =>{setModalView(true);setPackageId(item.id);setPkgSample(item.sample)}}
                          >
                            Book Now
                          </PrimaryButton>
                        </div>
                        {/* <div className="challenge-card-start-date1">
                          <InfoIcon
                            style={{ fontSize: 18, color: "#1e88e5" }}
                            onClick={() =>{setModalView(true);}}
                          />
                        </div> */}
                        {item.joiningDetail===true?
                        <div className="challenge-card-start-date2" style={{}}>
             <div className="challenge-card-start-date-day">
              {(item.pkgBookingTo).substring(0,10)}
            </div>
            
            <a
              onClick={() => {setOpen(true);setCardInfoDetails(item)}}
              style={{ position: "absolute", top: 0, right: 0 }}
            >
              <InfoIcon style={{ fontSize: 18, color: "#1e88e5" }} />
            </a>

            <div
          style={{ width: "fit-content", fontSize: 12, marginBottom: "10px" }}
        >
          <a
            target="_blank"
            // href={subEventDetail.eventLink}
            style={{
              color: "#fff",
              background: "#518ad6",
              borderRadius: 4,
              padding: "0px 4px",
              cursor: "pointer",
              marginTop:'20px'
            }}
            onClick={() => {
              setBooking(item.bookings);setJoinInfo(true)}}
          >
            Joining Detail
          </a>
        </div>
          </div>:  <div className="challenge-card-start-date1">
                          <InfoIcon
                            style={{ fontSize: 18, color: "#1e88e5" }}
                          
                              onClick={() =>{ setOpen(true);setCardInfoDetails(item)}}
                        
                          />
                        </div>}
                      </div>
                      </div>
                      </>)})}
                      </div>
                      <div className="challenge-card1">
        <div className="challenge-card2">
          <button
            onClick={flipCard1}
            style={{
              // backgroundColor: '#ff66a3',
              borderRadius: "10px",
              // color: 'white',
              justifyContent: "center",
              width: "30px",
              height: "25px",
              marginTop: "10px",
            }}
          >
             <ArrowLeftCircle size={25} />{" "}
            </button>
            <div style={{marginTop:'10px'}}>
            {/* {booking.map((curr)=>{
              return(<>
            <span>{curr.partnerLabName}</span>
            <span>{curr.date}</span>
            <span>{curr.status}</span>
             <br/>
              </>)
            })} */}
            </div>
            </div>
            </div>
                      </ReactCardFlip>       
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={dataSource} width={400} height={200} />
          <span style={{ margin: "1rem" }}>No Data</span>
        </div>
      
      )}
      {/* {modalView&&(<Modal open={modalView} onClose={()=>setModalView(false)}>
      <div
      style={{
        width: "30%",
        maxWidth:'90%',
        // position: 'fixed',
        // transform: "translate(5%,20%)",
        height: "200px",
      }}
    > 
      <Paper>
        <div>
          <TableContainer>
            <div style={{ display: "flex" }}>
              <div
                style={{ width: "10%", marginLeft: "20px", marginTop: "10px" }}
              >
                <button
                  className="is-success"
                  // style={{width:'20px'}}
                  onClick={() => setCoachBreakModal(true)}
                >
                  Break
                </button>
              </div>
              </div>
              </TableContainer></div>
              </Paper></div>
      </Modal>)} */}
      {joinInfo&&(<JoiningDetails join={joinInfo} setJoin={setJoinInfo} bookingdetail1={booking}/>)}
      {open&&(<PulseInfo open={open} setOpen={setOpen}  details={cardInfoDetail}/>)}
      {modalView&&(<InfoDialog open={modalView} onClose={handleClose}>
      <CancelIcon
                            style={{
                              position: "absolute",
                              top: 5,
                              right: 5,
                              color: "#ef5350",
                              cursor: "pointer",
                            }}
                            onClick={handleClose}
                          />
          <div style={{width:'600px',minHeight:'100px',maxHeight:'600px'}}>
              <div style={{display:'flex',marginLeft:'20px'}}>
                  <div style={{width:'20%'}}>
              <input type="radio" id="state" name="state"style={{ marginRight: "15px",height:'15px',width:'15px',fontWeight:'bold' }} value="STATE" onChange={handleChange}/><label for="state" style={{fontSize:'18px',fontWeight:'bold'}}>State</label>
              </div>
              <div style={{width:'20%'}}>
              <input type="radio" id="city" name="state" style={{ marginRight: "15px" ,height:'15px',width:'15px'}}  value="CITY" onChange={handleChange}/><label for="city" style={{fontSize:'18px',fontWeight:'bold'}}>City</label>
              </div>
              <div style={{width:'20%'}}>
              <input type="radio" id="pin" name="state" style={{ marginRight: "15px" ,height:'15px',width:'15px'}}  value="PIN" onChange={handleChange}/><label for="pin" style={{fontSize:'18px',fontWeight:'bold'}}>Pin</label>
              </div>
              </div>
              <div style={{marginLeft:'20px'}}>
                  {status!=="teamselect"?(
                  <div style={{marginTop:'3%'}}>
             
             
           {packageDetail&&packageDetail.map((item)=>{
                return(<>
                <div key={item.id}>
                <input type="radio"    name="teamselect" value={item} id="item"style={{ marginRight: "15px",height:'15px',width:'15px' }} onChange={handleState}/>
                <label for="item" style={{fontSize:'15px',fontWeight:'bold'}}>{item}</label><br/></div></>)
            })}</div>
           ):<div style={{marginTop:'3%'}}>
            
             <div  className="member"  style={{minHeight:'50px',maxHeight:'400px',overflowX: "auto",scrollBehavior: "smooth",marginBottom:'10px',marginRight:'10px'}}>
            {packageLabDetails.map((item)=>{
                return(<>
                <div  style={{display:'flex',minHeight:'50px',maxHeight:'500px',}}>
                    <div style={{width:'10%'}}>
                    <input type="radio" name="selectLab" value={item.id} id={item.id} key={item.id} style={{ marginRight: "15px",height:'15px',width:'15px' }} onChange={(e)=>{setSlotModal(true);getSlots(item.id);setPartnerLabId(item.id);setDigPartnerId(item.diagPartnerId)}}/>
                </div>
                <div style={{width:'90%',border:'1px outset black'}}>
                <label for={item.id}  ><span style={{fontSize:'15px',fontWeight:'bold'}}>Lab Name : </span>{item.labName}</label> <br/>
                <label for={item.id}><span style={{fontSize:'15px',fontWeight:'bold'}}>Address :</span> {item.labAddress}</label><br/>
                <label for={item.id}><span style={{fontSize:'15px',fontWeight:'bold'}}>Days & Time : </span>({item.workingDays.map((curr)=>{return(<>{monthsObject[curr]},</>)})}) ({item.workFromTime.substring(0,5)} - {item.workToTime.substring(0,5)})</label><br/>
                <label for={item.id}><span style={{fontSize:'15px',fontWeight:'bold'}}>Sample Collection : </span>{item.homeSampleCollection==0?'No':'Yes'}</label><br/></div></div></>)
            })}</div>
            </div>
            }
              </div>

          </div>
      </InfoDialog>)}
   
      {slotModal&&(<InfoDialog open={slotModal} onClose={handleCloseSlot}>
      <CancelIcon
                            style={{
                              position: "absolute",
                              top: 5,
                              right: 5,
                              color: "#ef5350",
                              cursor: "pointer",
                            }}
                            onClick={handleCloseSlot}
                          /> 
                          <div style={{marginTop:'-10%'}}></div>
                          <Stepper activeStep={activeStep} alternativeLabel>
                          {steps.map((label) => (
                            <Step key={label}>
                              <StepLabel>{label}</StepLabel>
                            </Step>
                          ))}
                        </Stepper>
          <div style={{width:'400px',minHeight:'300px',maxHeight:'400px'}}> <form>
          {activeStep === 0 ? (
         <div style={{ width: "90%", marginLeft: "20px" }}>
           <div>
           <label>Booking Type</label><br/>
           <select autofocus="autofocus"
                      style={{
                        background: "#f3f4f6",
                        padding: "10px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        width: "95%",
                        border: "1px solid black",
                      }}
                      placeholder="Assessment Name"
                      value={instruction.bookingType}
                      
                      onChange={handleInstruction}
                      name="bookingType">
                        <option value="VISIT">VISIT</option>
                        <option value="COLLECTION">COLLECTION</option>
                        <option value="BOTH">BOTH</option>
                      </select>
           </div>
           <div>
           <label>Collection Address</label><br/>
           <textarea autofocus="autofocus"
                      style={{
                        background: "#f3f4f6",
                        padding: "10px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        width: "95%",
                        border: "1px solid black",
                      }}
                      placeholder="Assessment Name"
                      value={instruction.sampleCollectionAddress}
                      
                      onChange={handleInstruction}
                      name="sampleCollectionAddress"/>
           </div>
           <div>
           <label>Instruction</label><br/>
           <textarea autofocus="autofocus"
                      style={{
                        background: "#f3f4f6",
                        padding: "10px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        width: "95%",
                        border: "1px solid black",
                        height:'70px'
                      }}
                      placeholder="Assessment Name"
                      value={instruction.bookingInstructions}
                      onChange={handleInstruction}
                      name="bookingInstructions"/>
           </div>
           <div style={{width:'80px',height:'10px',marginLeft:'75%'}} className="absolute bottom-6 right-2" ><PrimaryButton onClick={()=>setActiveStep(1)}  mini
                        className="w-[max-content] text-sm">Next</PrimaryButton></div>
         </div>):(<>
                  <div
                    style={{
                      height: "400px",
                      display: "flex",
                      marginTop: "0",
                      overflowY: "auto",
                      // width:'70%',
                    }}
                  > 
                    <div style={{ width: "70%", marginLeft: "20px" }}>
                      {/* <p style={{fontSize: '20px', marginLeft: '80px'}}>
                  Booking Program
                </p> */}
                
                      <div
                        style={{
                          maxWidth: "250px",
                          boxShadow:
                            "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
                          borderRadius: 12,
                          backgroundColor: "#b3b3ff",
                          maxHeight: "500px",
                          background: "blue",
                        }}
                      >
                        <Calendar
                          style={{
                            backgroundColor: "white",
                            maxHeight: "400px",
                            backgroundColor: "yellow",
                          }}
                          required
                          selected={dateState}
                          onChange={changeDate}
                          tileClassName={({ date, view }) => {
                            if (
                              mark.find(
                                (x) => x === moment(date).format("YYYY-MM-DD")
                              )
                            ) {
                              return "highlight";
                            }
                          }}
                          beforeShowDay={({ date, view }) => {
                            if (dateenable.indexOf(mark(date)) < 0)
                              return {
                                enabled: false,
                              };
                            else
                              return {
                                enabled: true,
                              };
                          }}
                          maxDate={new Date(ddt)}
                          locale="us"
                          minDate={new Date()}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        width: "30%",
                        maxHeight: "300px",
                        overflow: "scroll",
                      }}
                    >
                      {calender.map((item) => {
                        if (item.date === dtt) {
                          // for(let i=1;i<=item.time.length;i++)

                          return (
                            <div
                              style={
                                {
                                  // dispaly: 'flex',
                                  // width: '0%',
                                  // textAlign: 'center',
                                }
                              }
                            >
                              <p style={{ textAlign: "center" }}>
                                <u>Timing</u>
                              </p>
                              <>
                                {item.slotTime.map((bb) => {
                                  if (filterDate === dtt) {
                                    {
                                      if (bb.time > tttt1)
                                        return (
                                          <div>
                                            <table>
                                              <div style={{ width: "100%" }}>
                                                <button
                                                  style={{
                                                    // fontSize: '20px',
                                                    // dispaly: 'flex',
                                                    // border: '1px outset black',
                                                    boxShadow:
                                                      "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
                                                    borderRadius: 5,
                                                    backgroundColor: "#ccfff5",
                                                    width: "100px",
                                                    height: "30px",
                                                    marginTop: "0px",
                                                    // marginLeft: '10px',
                                                    color: "black",
                                                  }}
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    setTime(e.target.value);
                                                  }}
                                                  value={bb.time.toString()}
                                                >
                                                  {bb.time.substring(0, 5)}-
                                                  {bb.sessionTime}
                                                  <br />
                                                </button>
                                              </div>
                                            </table>
                                          </div>
                                        );
                                    }
                                  } else {
                                    return (
                                      <div>
                                        <table>
                                          <div style={{ width: "100%" }}>
                                            <button
                                              style={{
                                                // fontSize: '20px',
                                                // dispaly: 'flex',
                                                // border: '1px outset black',
                                                boxShadow:
                                                  "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
                                                borderRadius: 5,
                                                backgroundColor: "#ccfff5",
                                                width: "100px",
                                                height: "30px",
                                                marginTop: "0px",
                                                // marginLeft: '10px',
                                                color: "black",
                                              }}
                                              onClick={(e) => {
                                                e.preventDefault();
                                                setTime(e.target.value);
                                              }}
                                              value={bb.time.toString()}
                                            >
                                              {bb.time.substring(0, 5)}-
                                              {bb.sessionTime}
                                              <br />
                                            </button>
                                          </div>
                                        </table>
                                      </div>
                                    );
                                  }
                                })}
                              </>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>

                  <div style={{ marginTop: "-100px", display: "flex" }}>
                    <div style={{ width: "70%" }}>
                      {/* <p className="error-text">Please select</p> */}
                      <p
                        style={{ marginLeft: "20px", fontSize: "15px" }}
                        className="mb-2"
                      >
                        <b> Your Booking: </b>
                      </p>
                      <p
                        style={{
                          boxShadow:
                            "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
                          borderRadius: 12,
                          borderRadius: "5px",
                          height: "auto",
                          width: "160px",
                          marginLeft: "20px",
                          fontSize: "15px",
                          marginTop: "-10px",
                        }}
                        className="p-1"
                      >
                        <b> Date: </b> {moment(dateState).format("DD-MM-YYYY")}
                        <br />
                        <b> Time: </b>
                        {calender.map((item) => {
                          if (item.date === dtt) {
                            return item.slotTime.map((e1) => {
                              if (e1.time === time) {
                                return (
                                  <>
                                    {e1.time.substring(0, 5)}-{e1.sessionTime}
                                  </>
                                );
                              }
                            });
                          }
                        })}
                      </p>
                    </div>
                    <div className="absolute bottom-6 right-2" style={{display:'flex'}}>
                        <div style={{width:''}}>
                      <PrimaryButton
                        mini
                        className="w-[max-content] text-sm"
                        onClick={(e) => {
                         setActiveStep(0);
                        }}
                        type="submit"
                      >
                        Prev
                      </PrimaryButton>
                      </div>
                      <div style={{width:''}}>
                      <PrimaryButton
                        mini
                        className="w-[max-content] text-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          saveBookingApi();
                        }}
                        type="submit"
                      >
                        Save
                      </PrimaryButton>
                      </div>
                      <div></div>
                    </div>
                    
                  </div></>)}
                </form></div>
      </InfoDialog>)}

  </>)
};
export default PackageCard;
