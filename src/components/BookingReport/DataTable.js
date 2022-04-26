import { Info, SpaRounded } from "@material-ui/icons";
import React,{useState,useEffect}from 'react' 
import classNames from "classnames";

import InfoDialog from "../Utility/InfoDialog";
import CancelIcon from "@material-ui/icons/Cancel";
import { Plus,Minus,X } from "react-feather";
import EditInfo from './EditInfo'
import { urlPrefix } from "../../services/apicollection";
import axios from "axios";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from '@material-ui/core/styles';
import {getAllMobile}from  "../../services/apicollection";
import Chip from "@material-ui/core/Chip";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import message from "antd-message";
// import { Plus } from "react-feather";
function rand() {
  return Math.round(Math.random() * 10) - 10;
}
function getModalStyle() {
  const top = 50 
  const left = 50 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const Days=[{id:'0',day:'SUN'},{id:'1',day:'MON'},{id:'2',day:'TUE'},{id:'3',day:'WED'},{id:'4',day:'THU'},{id:'5',day:'FRI'},{id:'6',day:'SAT'}]
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 1000,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
}));
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
export default function DataTable({ bookingDetail, updateStatus,selectedPartner }) {
  const classes = useStyles();
  const [openModal,setOpenModal]=useState(false)
  const [infoStatus,setEditStatus]=useState(false)
  const [mobValue, setmobValue] = useState("");
    const [Reg, setReg] = useState("");
    const [modId, setmodId] = useState("");
    console.log(Reg,modId,'reg')
  const [editData,setEditData]=useState([])
  const [errorobj, setErrorObj] = useState();
  const [addCapacityData,setAddCapacityData]=useState({
    capacity:'',
    workFromTime:'',
    workToTime:'',
    workingDays:[]
  })
  const [addCapacityModel,setAddCapacityModel]=useState(false)
  console.log(addCapacityData,'add capacity')
  const [modalStyle] = React.useState(getModalStyle);
  const [timeRange,setTimeRange]=useState([{'00:00 - 00:29':0},{'00:30 - 00:59':0},{'01:00 - 01:29':0},{'01:30 - 01:59':0},{'02:00 - 02:29':0},{'02:30 - 02:59':0}
  ,{'03:00 - 03:29':0},{'03:30 - 03:59':0},{'04:00 - 04:29':0},{'04:30 - 04:59':0},{'05:00 - 05:29':0},{'05:30 - 05:59':0}

  ,{'06:00 - 06:29':0},{'06:30 - 06:59':0},{'07:00 - 07:29':0},{'07:30 - 07:59':0},{'08:00 - 08:29':0},{'08:30 - 08:59':0}
  ,{'09:00 - 09:29':0},{'09:30 - 09:59':0},{'10:00 - 10:29':0},{'10:30 - 10:59':0},{'11:00 - 11:29':0},{'11:30 - 11:59':0}

  ,{'12:00 - 12:29':0},{'12:30 - 12:59':0},{'13:00 - 13:29':0},{'13:30 - 13:59':0},{'14:00 - 14:29':0},{'14:30 - 14:59':0}
  ,{'15:00 - 15:29':0},{'15:30 - 15:59':0},{'16:00 - 16:29':0},{'16:30 - 16:59':0},{'17:00 - 17:29':0},{'17:30 - 17:59':0}

  ,{'18:00 - 18:29':0},{'18:30 - 18:59':0},{'19:00 - 19:29':0},{'19:30 - 19:59':0},{'20:00 - 20:29':0},{'20:30 - 20:59':0}
  ,{'21:00 - 21:29':0},{'21:30 - 21:59':0},{'22:00 - 22:29':0},{'22:30 - 22:59':0},{'23:00 - 23:29':0},{'23:30 - 23:59':0}

 
])
console.log(timeRange,'timerange')
const handleCapacity=(e)=>{
const name=e.target.name
const value=e.target.value
setAddCapacityData((values) => ({ ...values, [name]: value }))
setErrorObj((values) => ({ ...values, [name]: value }));
}
useEffect(() => {
  if (mobValue.length == 10) {
    getres();
  }
}, [mobValue]);
const getres = async () => {
  const url = `${urlPrefix}${getAllMobile}?phoneNumber=${mobValue}`;
  const x = await fetch(url, {
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
  });
  const datares = await x.json();
  //  const len = (datares.response.responseData.length - 1 );

  const arr = datares.response.responseData;

  var marvelHeroes = arr.filter(function (hero) {
    const x = hero.mobileNumber == mobValue;
    return x;
  });

  if (marvelHeroes == 0) {
    setReg("Invalid phone number");
  } else {
    setReg(marvelHeroes[0].firstName + " " + marvelHeroes[0].lastName);
    window.value = marvelHeroes[0].id;
    setmodId(marvelHeroes[0].id);
  }
};
const AddUser=()=>{
editData.labUserIds.push(modId)
editData.idwiseName.push({id:modId,userName:Reg})
setmobValue("")
setReg("")
EditData()
}
const RemoveUser=()=>{
  setmobValue("")
  setReg("")
}
const [user,setUser]=useState([])
const EditData=(row)=>{
  // setEditData({...editData,labUserIds:Array.isArray(editData.labUserIds)
  //   ? editData.labUserIds?.map((item) => {
  //       if (editData.idwiseName.filter((elm) => elm.id == item)[0]) {
  //         return editData.idwiseName.filter((elm) => elm.id == item)[0][
  //           "userName"
  //         ];
  //       }
  //     })
  //   : [],})
  setUser(Array.isArray(editData.labUserIds)
  ? editData.labUserIds?.map((item) => {
       if (editData.idwiseName.filter((elm) => elm.id == item)[0]) {
           return editData.idwiseName.filter((elm) => elm.id == item)[0][
          "userName"
         ];
         }
      })
   : [])
  setEditStatus(true)
}

const [tRange,setTRange]=useState([])
const [valueCapacity,setValueCapacity]=useState(0)
const [s,setS]=useState({})
const IncDec=(item,plus)=>{

  if(plus==true){
  timeRange[timeRange.map((x, i) => [i, x]).filter(
    x => x[1] == item)[0][0]] = {[Object.keys(item)]:item[Object.keys(item)[0]]+1}
    console.log(timeRange,'time')
    setTimeRange([...timeRange])
  }
  else{
    timeRange[timeRange.map((x, i) => [i, x]).filter(
      x => x[1] == item)[0][0]] = {[Object.keys(item)]:item[Object.keys(item)[0]]-1}
      console.log(timeRange,'time')
      setTimeRange([...timeRange])
  }
}
console.log(s,'s')
const handleCheck=(value,checked,item)=>{
  console.log(item,value,'ite=m')
  // const {checked}=e.target
  console.log(item[Object.keys(item)[0]],timeRange);
 if(checked)
 {
  timeRange[timeRange.map((x, i) => [i, x]).filter(
    x => x[1] == item)[0][0]] = {[Object.keys(item)]:item[Object.keys(item)[0]]+1}
    console.log(timeRange,'time')
    setTimeRange([...timeRange])
setOpenModal(true)
  }
  else{
    if(timeRange.length>0)
    {
      timeRange[timeRange.map((x, i) => [i, x]).filter(
        x => x[1] == item)[0][0]] = {[Object.keys(item)]:0}
        setTimeRange([...timeRange])
    }
  }
  
 console.log(item[Object.keys(item)[0]],timeRange);


}
console.log(timeRange,'tRange')
const inputsOption=(e)=>{
  const name=e.target.name;
  const value=e.target.value;
  setEditData((values) => ({ ...values, [name]: value }));
}
const EditCapacity=()=>{
  const splitKeyValue = obj => {
    const keys = Object.keys(obj);
    const res = [];
    for(let i = 0; i < keys.length; i++){
       res.push({
        [keys[i]]: parseInt( obj[keys[i]]),
          
       });
    };
    return res;
 };
 console.log(splitKeyValue(editData.capacity.timeslots),'editslot');
  setTimeRange(splitKeyValue(editData.capacity.timeslots))
  setAddCapacityData({
    workFromTime:`${editData.workFromTime[0]}:${editData.workFromTime[1]}0`,
    workToTime:`${editData.workToTime[0]}:${editData.workToTime[1]}0`,
    workingDays:editData.workingDays &&
    Array.isArray(editData.workingDays)
      ? editData.workingDays?.map((item) => {
          if (Days.filter((elm) => elm.id == item)[0]) {
            return Days.filter((elm) => elm.id == item)[0][
              "day"
            ];
          }
        })
      : [],
  })
  setOpenModal(true)
}
console.log(editData,'edit Data list')
const handleSubmit = (e) => {
e.preventDefault();

let payload = {};
payload = {
 collAvail:editData.collAvail,
 diagPartnerId:editData.diagPartnerId,
 emailId:editData.emailId,
 isActive:1,
 labAddress:editData.labAddress,
 labCity:editData.labCity,
 labContact:editData.labContact,
 labName:editData.labName,
 labPerson:editData.labPerson,
 labPin:editData.labPin,
 labState:editData.labState,
 labUserIds:editData.labUserIds
};

  const adminurl = `${urlPrefix}v1.0/updateMstPartnerLab/basicDetails?id=${editData.id}`;
  return axios
    .post(adminurl, payload, {
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
      console.log(res,'res')
      message.success(res.data.response.responseMessage);
      getData()
      setEditStatus(false)

    });

};
const closeModal=()=>{
  setOpenModal(false)
  setAddCapacityData({
    
    workFromTime:'',
    workToTime:'',
    workingDays:[]
  })
}
const handleAddCapacity = (e) => {
  e.preventDefault();
  if(addCapacityData.workFromTime!==""&&addCapacityData.workToTime!==""&&addCapacityData.workingDays.length>0)
  {
  var object = timeRange.reduce(
    (obj, item) => Object.assign(obj, { [(Object.keys(item)).toString()]: item[Object.keys(item)[0]].toString() }), {});
  
  let payload = {};
  payload = {
   capacity:{timeslots:object},
   workFromTime:addCapacityData.workFromTime,
   workToTime:addCapacityData.workToTime,
   workingDays:addCapacityData.workingDays
   .filter((check) => check)
   .map((item) => {
     return Days.filter(
       (elm) =>
         
         elm.day == item
     )[0]["id"];
   }),
  };

    const adminurl = `${urlPrefix}v1.0/updateMstPartnerLab/capacityDetails?id=${selectedPartner}`;
    return axios
      .post(adminurl, payload, {
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
        console.log(res,'res')
        message.success(res.data.response.responseMessage);
        getData()
        setAddCapacityData({
    
          workFromTime:'',
          workToTime:'',
          workingDays:[]
        })
        setOpenModal(false)
  
      });
    }else{
      setErrorObj(addCapacityData);
    }
  };
useEffect(()=>{
  getData()
},[selectedPartner])
const getData = () => {
 
    const adminurl = `${urlPrefix}v1.0/getMstPartnerById?partnerId=${selectedPartner}`;
    return axios
      .get(adminurl, {
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
       console.log(res,'res')
       setEditData(res.data.response.responseData)
      });
    }
    const body=(<div style={modalStyle} className={classes.paper}>
       <CancelIcon
              style={{
                // top: 50,
                right: 10,
                color: "#ef5350",
                cursor: "pointer",
                marginLeft: "100%",
                marginTop: "-0%",
              }}
              onClick={closeModal}
            />
    {/* <div style={{width:'800px',height:'600px'}}> */}
    <div style={{padding:''}}>
     
    <div style={{display:'flex',flexDirection:'row'}}>
    <div style={{width:'25%'}}>
                      <label>From Time {errorobj !== undefined && (
              <>
                {errorobj.workFromTime == "" ? (
                  <p
                    style={{
                      color: "red",
                      marginLeft: "40%",
                      marginTop: "-10%",
                    }}
                  >
                   *
                  </p>
                ) : (
                  ""
                )}
              </>
            )}</label>
                      <input
                         type="time"
                  autofocus="autofocus"
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    width: "95%",
                    border: "1px solid black",
                    // minHeight: "auto",
                    // maxHeight: "90vh",
                  }}
                  // placeholder="Additional Information"
                  value={addCapacityData.workFromTime}
                  onChange={handleCapacity}
                  name="workFromTime"
                />
                  </div>
                  <div style={{width:'25%'}}>
                      <label>To Time  {errorobj !== undefined && (
              <>
                {errorobj.workToTime == "" ? (
                  <p
                    style={{
                      color: "red",
                      marginLeft: "40%",
                      marginTop: "-10%",
                    }}
                  >
                   *
                  </p>
                ) : (
                  ""
                )}
              </>
            )}</label>
                      <input
                         type="time"
                  autofocus="autofocus"
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    width: "95%",
                    border: "1px solid black",
                    // minHeight: "auto",
                    // maxHeight: "90vh",
                  }}
                  // placeholder="Additional Information"
                  value={addCapacityData.workToTime}
                  onChange={handleCapacity}
                  name="workToTime"
                />
                  </div>
                  <div style={{width:'25%'}}>
                  <label>Working Days  {errorobj !== undefined && (
              <>
                {errorobj.workingDays&&errorobj.workingDays.length===0 ? (
                  <p
                    style={{
                      color: "red",
                      marginLeft: "50%",
                      marginTop: "-10%",
                    }}
                  >
                    *
                  </p>
                ) : (
                  ""
                )}
              </>
            )}</label><br/>
                  <Select
                            labelId="demo-mutiple-chip-label"
                            id="demo-mutiple-chip"
                            multiple
                            name="workingDays"
                            value={
                              addCapacityData.workingDays
                              ?addCapacityData.workingDays
                              : []
                            }
                            onChange={handleCapacity}
                            input={<Input id="select-multiple-chip" />}
                            renderValue={(selected) => (
                              <div className={classes.chips}>
                                {selected.map((value) => (
                                  <Chip
                                    key={value}
                                    label={value}
                                    className={classes.chip}
                                  />
                                ))}
                              </div>
                            )}
                            MenuProps={MenuProps}
                          >
                            {Days.map((curr,index)=>(
                              <MenuItem
                              key={index}
                              value={curr.day}
                            >
                             {curr.day}
                            </MenuItem>
                            ))}
                                
                                
                             
                          </Select>
                  </div>
                  {/* <div style={{width:'20%',marginTop:'20px'}}>
                    <button style={{width:'100px',float:'right'}}className="is-success">Search</button>
                    </div> */}
          </div>
      
      <div style={{display:'flex',flexDirection:'row',marginTop:'10px'}}>
        <div style={{width:'50%',}}>
          <span><label>Time Range</label></span>
          <span style={{marginLeft:'20px'}}><label>Capacity</label></span>
      {timeRange&&timeRange.map((item,index)=>{
        console.log(item,'item')
        if(index<12)
        {
          return(<>
        <div key={index}>
          
      
         <label for={index}>
       {Object.keys(item)[0]}
       </label>

        <span style={{border:'0px outset black',marginLeft:'10px'}}>
          <span><button style={{width:'25px',height:'30px',background:'grey'}} ><Minus  onClick={()=>{item[Object.keys(item)[0]]>0&&IncDec(item,false)}}/></button></span>
          <span style={{textAlign:'center',marginLeft:'5px',fontSize:'20px',fontWeight:800}}>{item[Object.keys(item)[0]]}</span>
          <span><button style={{marginLeft:'5px',width:'25px',height:'30px',background:'grey'}} ><Plus  onClick={()=>{item[Object.keys(item)[0]]<15&&IncDec(item,true)}}/></button></span>
          </span> 
          </div>
        </>)
        }
    })}
</div>
<div style={{width:'50%',}}>
<span><label>Time Range</label></span>
          <span style={{marginLeft:'20px'}}><label>Capacity</label></span>
{timeRange.map((item,index)=>{
        if(index>=12&&index<24)
        {
          return(<>
            <div key={index}>
          
      
          <label for={index}>
        {Object.keys(item)[0]}
        </label>
 
         <span style={{border:'0px outset black',marginLeft:'10px'}}>
           <span><button style={{width:'25px',height:'30px',background:'grey'}} ><Minus  onClick={()=>{item[Object.keys(item)[0]]>0&&IncDec(item,false)}}/></button></span>
           <span style={{textAlign:'center',marginLeft:'5px',fontSize:'20px',fontWeight:800}}>{item[Object.keys(item)[0]]}</span>
           <span><button style={{marginLeft:'5px',width:'25px',height:'30px',background:'grey'}} ><Plus  onClick={()=>{item[Object.keys(item)[0]]<15&&IncDec(item,true)}}/></button></span>
           </span> 
           </div>
        </>)
        }
    })}

</div>
<div style={{width:'50%',}}>
<span><label>Time Range</label></span>
          <span style={{marginLeft:'20px'}}><label>Capacity</label></span>
{timeRange.map((item,index)=>{
  const range=Object.keys(item)[0]
       if(index>=24&&index<36)
        {
          
          return(<>
           <div key={index}>
          <label for={index}>
        {Object.keys(item)[0]}
        </label>
 
         <span style={{border:'0px outset black',marginLeft:'10px'}}>
           <span><button style={{width:'25px',height:'30px',background:'grey'}} ><Minus  onClick={()=>{item[Object.keys(item)[0]]>0&&IncDec(item,false)}}/></button></span>
           <span style={{textAlign:'center',marginLeft:'5px',fontSize:'20px',fontWeight:800}}>{item[Object.keys(item)[0]]}</span>
           <span><button style={{marginLeft:'5px',width:'25px',height:'30px',background:'grey'}} ><Plus  onClick={()=>{item[Object.keys(item)[0]]<15&&IncDec(item,true)}}/></button></span>
           </span> 
           </div>
        </>)
        }
    })}

</div>
<div style={{width:'50%',}}>
<span><label>Time Range</label></span>
          <span style={{marginLeft:'20px'}}><label>Capacity</label></span>
{timeRange.map((item,index)=>{
    if(index>=36&&index<48)
        {
          return(<>
          <div key={index}>
          
      
          <label for={index}>
        {Object.keys(item)[0]}
        </label>
 
         <span style={{border:'0px outset black',marginLeft:'10px'}}>
           <span><button style={{width:'25px',height:'30px',background:'grey'}} ><Minus  onClick={()=>{item[Object.keys(item)[0]]>0&&IncDec(item,false)}}/></button></span>
           <span style={{textAlign:'center',marginLeft:'5px',fontSize:'20px',fontWeight:800}}>{item[Object.keys(item)[0]]}</span>
           <span><button style={{marginLeft:'5px',width:'25px',height:'30px',background:'grey'}} ><Plus  onClick={()=>{item[Object.keys(item)[0]]<15&&IncDec(item,true)}}/></button></span>
           </span> 
           </div>
        </>)
        }
    })}

</div>

      </div>
      
      {/* <select  style={{height:'50px',background:''}}>
        <option>Select</option>
        {timeRange.map((item)=>{
          return(<>
          <option>{item.fTime} - {item.lTime}</option>
          </>)
        })}
      </select> */}
      
      {/* <div style={{width:'30%'}}>
        Add Capacity
        <div style={{width:'70%',border:'1px outset black'}}>
          <span><button style={{width:'30px',height:'50px',background:'grey'}}><Minus/></button></span>
          <span style={{textAlign:'center',marginLeft:'25px',fontSize:'20px',fontWeight:800}}>0</span>
          <span><button style={{width:'30px',height:'50px',background:'grey',float:'right'}}><Plus/></button></span>
          </div> 
          </div> */}
    </div>
    <div style={{float:'right',padding:'10px'}}><button style={{width:'100px'}}className="is-success" onClick={handleAddCapacity}>Save</button></div>
    </div>
    // </div>
    )
  return (
    <>
    <div style={{display:'flex',flexFlow:'row-reverse',marginRight:30,marginTop:20}}>
      <div> <button
                              style={{
                                background: "green",
                                color: "white",
                                padding: "2px 6px",
                                borderRadius: 24,
                               
                              }}
                              onClick={() =>setOpenModal(true)}
                            >
                              Add Capacity
                            </button></div>
                            <div style={{marginLeft:'40px'}}> <button
                              style={{
                                background: "green",
                                color: "white",
                                padding: "2px 6px",
                                borderRadius: 24,
                                marginRight:20,
                                width:100
                              }}
                              onClick={() =>EditData(true)}
                            >
                              Edit
                            </button></div>
    </div>
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full table-fixed divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="min-w-[12rem] px-3 py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Gender
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Phone Number
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Health Package Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Booking Instruction
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Booking Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Booking Time
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Booking Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Booking Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Action
                    </th>
                   
                  </tr>
                </thead>
                <tbody
                  className={classNames("divide-y divide-gray-200 bg-white")}
                >
                  {bookingDetail.map((person) => {
                    return (
                      <tr key={person.email}>
                        <td
                          className={classNames(
                            "px-3 py-4 pr-3 text-sm font-medium max-w-md break-words",
                            "text-gray-900",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" },
                            {
                              "bg-gray-200":
                                person.bookingStatus === "CANCELLED",
                            }
                          )}
                        >
                          {person.userDetail.firstName +
                            " " +
                            person.userDetail.lastName}
                        </td>
                        <td
                          className={classNames(
                            "px-3 py-4 text-sm text-gray-800 max-w-md break-words",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" },
                            {
                              "bg-gray-200":
                                person.bookingStatus === "CANCELLED",
                            }
                          )}
                        >
                          {person.userDetail.emailId}
                        </td>
                        <td
                          className={classNames(
                            "px-3 py-4 text-sm text-gray-800 max-w-md break-words",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" },
                            {
                              "bg-gray-200":
                                person.bookingStatus === "CANCELLED",
                            }
                          )}
                        >
                          {person.userDetail.gender}
                        </td>
                        <td
                          className={classNames(
                            "px-3 py-4 text-sm text-gray-800 max-w-md break-words",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" },
                            {
                              "bg-gray-200":
                                person.bookingStatus === "CANCELLED",
                            }
                          )}
                        >
                          {person.userDetail.mobileNumber}
                        </td>
                        <td
                          className={classNames(
                            "px-3 py-4 text-sm text-gray-800 max-w-md break-words",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" },
                            {
                              "bg-gray-200":
                                person.bookingStatus === "CANCELLED",
                            }
                          )}
                        >
                          {person.collAddress}
                        </td>
                        <td
                          className={classNames(
                            "px-3 py-4 text-sm text-gray-800 max-w-md break-words",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" },
                            {
                              "bg-gray-200":
                                person.bookingStatus === "CANCELLED",
                            }
                          )}
                        >
                          {person.healthPackageName}
                        </td>
                        <td
                          className={classNames(
                            "px-3 py-4 text-sm text-gray-800 max-w-md break-words",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" },
                            {
                              "bg-gray-200":
                                person.bookingStatus === "CANCELLED",
                            }
                          )}
                        >
                          {person.bookingInstruction}
                        </td>
                        <td
                          className={classNames(
                            "px-3 py-4 text-sm text-gray-800 max-w-md break-words",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" },
                            {
                              "bg-gray-200":
                                person.bookingStatus === "CANCELLED",
                            }
                          )}
                        >
                          {person.bookingDate}
                        </td>
                        <td
                          className={classNames(
                            "px-3 py-4 text-sm text-gray-800 max-w-md break-words",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" },
                            {
                              "bg-gray-200":
                                person.bookingStatus === "CANCELLED",
                            }
                          )}
                        >
                          {person.bookingTime}
                        </td>
                        <td
                          className={classNames(
                            "px-3 py-4 text-sm text-gray-800 max-w-md break-words",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" },
                            {
                              "bg-gray-200":
                                person.bookingStatus === "CANCELLED",
                            }
                          )}
                        >
                          {person.bookingType}
                        </td>
                        <td
                          className={classNames(
                            "px-3 py-4 text-sm text-gray-800 max-w-md break-words",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" },
                            {
                              "bg-gray-200":
                                person.bookingStatus === "CANCELLED",
                            }
                          )}
                        >
                          {person.bookingStatus}
                        </td>
                        <td
                          className={classNames(
                            "px-3 py-4 text-sm text-gray-800 w-[8rem]",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" },
                            {
                              "bg-gray-200":
                                person.bookingStatus === "CANCELLED",
                            }
                          )}
                        >
                          {!["COMPLETED", "CANCELLED", "ABSENT"].includes(
                            person.bookingStatus
                          ) && (
                            <button
                              style={{
                                background: "green",
                                color: "white",
                                padding: "2px 6px",
                                borderRadius: 24,
                              }}
                              onClick={() => updateStatus(person)}
                            >
                              Change status
                            </button>
                          )}
                        </td>
                        
                        
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    {openModal&&(<Modal open={openModal} onClose={closeModal}  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description">
   
      {body}
    </Modal>)}
    {infoStatus&&(<InfoDialog open={infoStatus} handleClose={()=>setEditStatus(false)}>
   <CancelIcon
              style={{
                // top: 50,
                right: 10,
                color: "#ef5350",
                cursor: "pointer",
                marginLeft: "93%",
                marginTop: "-5%",
              }}
              onClick={()=>setEditStatus(false)}
            />
       <div style={{width:'600px',height:'600px'}}>
       <div style={{marginLeft:'40px'}}> <button
                              style={{
                                background: "green",
                                color: "white",
                                padding: "2px 6px",
                                borderRadius: 24,
                                marginRight:20,
                                // width:100
                              }}
                              onClick={EditCapacity}
                            >
                              Edit Capacity
                            </button></div>
              <div style={{display:'flex',padding:'10px 10px 10px 10px'}}>
                  <div style={{width:'33%'}}>
                      <label>Lab Name</label>
                      <textarea
                  autofocus="autofocus"
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    width: "95%",
                    border: "1px solid black",
                    minHeight: "auto",
                    maxHeight: "90vh",
                  }}
                //   placeholder="Additional Information"
                  value={editData.labName}
                  onChange={inputsOption}
                  name="labName"
                />
                  </div>
                  <div style={{width:'33%'}}>
                      <label>Contact Number</label>
                      <textarea
                  autofocus="autofocus"
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    width: "95%",
                    border: "1px solid black",
                    minHeight: "auto",
                    maxHeight: "90vh",
                  }}
                //   placeholder="Additional Information"
                  value={editData.labContact}
                  onChange={inputsOption}
                  name="labContact"
                />
                  </div>
                  <div style={{width:'33%'}}>
                      <label>E-mail</label>
                      <textarea
                  autofocus="autofocus"
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    width: "95%",
                    border: "1px solid black",
                    minHeight: "auto",
                    maxHeight: "90vh",
                  }}
                //   placeholder="Additional Information"
                  value={editData.emailId}
                  onChange={inputsOption}
                  name="emailId"
                />
                  </div>
              </div>
              <div style={{display:'flex',padding:'10px 10px 10px 10px'}}>
                  <div style={{width:'33%'}}>
                      <label>Lab Address</label>
                      <textarea
                  autofocus="autofocus"
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    width: "95%",
                    border: "1px solid black",
                    minHeight: "auto",
                    maxHeight: "90vh",
                  }}
                //   placeholder="Additional Information"
                  value={editData.labAddress}
                  onChange={inputsOption}
                  name="labAddress"
                />
                  </div>
                  <div style={{width:'33%'}}>
                      <label>Lab City</label>
                      <textarea
                  autofocus="autofocus"
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    width: "95%",
                    border: "1px solid black",
                    minHeight: "auto",
                    maxHeight: "90vh",
                  }}
                //   placeholder="Additional Information"
                  value={editData.labCity}
                  onChange={inputsOption}
                  name="labCity"
                />
                  </div>
                  <div style={{width:'33%'}}>
                      <label>Lab State</label>
                      <textarea
                  autofocus="autofocus"
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    width: "95%",
                    border: "1px solid black",
                    minHeight: "auto",
                    maxHeight: "90vh",
                  }}
                //   placeholder="Additional Information"
                  value={editData.labState}
                  onChange={inputsOption}
                  name="labState"
                />
                  </div>
              </div>

              <div style={{display:'flex',padding:'10px 10px 10px 10px'}}>
                  <div style={{width:'33%'}}>
                      <label>Collection Available</label>
                      <select
                  autofocus="autofocus"
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    width: "95%",
                    border: "1px solid black",
                    minHeight: "auto",
                    maxHeight: "90vh",
                  }}
                //   placeholder="Additional Information"
                  value={editData.collAvail}
                  onChange={inputsOption}
                  name="bookingType"
                >
                  <option value={0}>Visit</option>
                  <option value={1}>Collection</option>
                  </select>
                  </div>
                  <div style={{width:'33%'}}>
                      <label>Lab Pin </label>
                      <input
                  autofocus="autofocus"
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    width: "95%",
                    border: "1px solid black",
                    // minHeight: "auto",
                    // maxHeight: "90vh",
                  }}
                //   placeholder="Additional Information"
                  value={editData.labPin}
                  onChange={inputsOption}
                  name="labPin"
                />
                  </div>
                  <div style={{width:'33%'}}>
                      <label>Lab Person</label>
                      <input
                  autofocus="autofocus"
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    width: "95%",
                    border: "1px solid black",
                    // minHeight: "auto",
                    // maxHeight: "90vh",
                  }}
                  // placeholder="Additional Information"
                  value={editData.labPerson}
                  onChange={inputsOption}
                  name="labPerson"
                />
                  </div>
              </div>
              

              <div style={{display:'flex',padding:'10px 10px 10px 10px'}}>
                
                  
              <div style={{width:'33%',display:'flex'}}>
              {!Reg?
                  <div style={{width:'80%'}}>
        
                      <label>Mobile Number</label>
                      <input
                  autofocus="autofocus"
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    width: "95%",
                    border: "1px solid black",
                    // minHeight: "auto",
                    // maxHeight: "90vh",
                  }}
                  placeholder="Search User by Mobile Number"
                  value={mobValue}
                  onChange={(e)=>setmobValue(e.target.value)}
                  // name="labPin"
                />
                </div>
                : <div style={{width:'80%', marginTop: "10%",border: "1px solid black",padding: "10px 10px",}}>{Reg}</div>}
                {Reg&&(<>
                <div style={{width:'20%', marginTop: "10%",
                                      marginLeft: "10%",}}> <Plus
            onClick={AddUser}
            style={{ cursor: "pointer" }}
               />
               <X
            onClick={RemoveUser}
            style={{ cursor: "pointer" }}
               />
               </div>
          
                </>)}

                  </div>
                  <div style={{width:'33%'}}>
                      <label>User List</label>
                      {/* <select
                  autofocus="autofocus"
                  multiple
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    width: "95%",
                    border: "1px solid black",
                    // minHeight: "auto",
                    // maxHeight: "90vh",
                  }}
                //   placeholder="Additional Information"
                  value={editData.labPerson}
                  onChange={inputsOption}
                  name="labPerson"
                  input={<Input id="select-multiple-chip" />}
                  renderValue={(selected) => (
                    <div className={classes.chips}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          className={classes.chip}
                        />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
              
               {editData.labUserIds.map((curr)=>{
                 return(<>
                  <option>
                    {curr}
                  </option>
                  </>)
               })}
                  </select> */}
 <Select
                            labelId="demo-mutiple-chip-label"
                            id="demo-mutiple-chip"
                            multiple
                            value={
                              user
                                ?user
                                : []
                            }
                            onChange={(event) => {
                              handleInputChange(
                                "labUserIds",
                                event.target.value.length > 0
                                  ? event.target.value
                                  : undefined
                              );
                            }}
                            input={<Input id="select-multiple-chip" />}
                            renderValue={(selected) => (
                              <div className={classes.chips}>
                                {selected.map((value) => (
                                  <Chip
                                    key={value}
                                    label={value}
                                    className={classes.chip}
                                  />
                                ))}
                              </div>
                            )}
                            MenuProps={MenuProps}
                          >
                            { editData.idwiseName .map((curr, index) => (
                                <MenuItem
                                  key={index}
                                  value={curr.userName}
                                >
                                  { curr.userName}
                                </MenuItem>
                              ))}
                          </Select>

                  </div>
                  <div style={{width:'33%',marginTop:'30px'}}>
                  <button style={{width:'100px',float:'right'}}className="is-success" onClick={handleSubmit}>Save</button>
                  </div>
                  </div>
                
       </div>
   </InfoDialog>)}
    {/* {infoStatus&&(<EditInfo {...{editData,infoStatus,setEditStatus,selectedPartner}}/>)} */}
    </>);
}
