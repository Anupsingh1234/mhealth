import InfoDialog from "../Utility/InfoDialog";
import React,{useState,useEffect} from 'react'
import CancelIcon from "@material-ui/icons/Cancel";
import { urlPrefix } from "../../services/apicollection";
const EditInfo=(row,modalView,setModalView)=>{
    const [editData,setEditData]=useState(row.row)
    
    console.log(row,'edit row')
    const inputsOption=(e)=>{
        const name=e.target.name;
        const value=e.target.value;
        setEditData((values) => ({ ...values, [name]: value }));
    }
   
    return(<>
   <InfoDialog open={modalView} handleClose={()=>setModalView(false)}>
   <CancelIcon
              style={{
                // top: 50,
                right: 10,
                color: "#ef5350",
                cursor: "pointer",
                marginLeft: "93%",
                marginTop: "-5%",
              }}
              onClick={()=>setModalView(false)}
            />
       <div style={{width:'600px',height:'600px'}}>
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
                  value={editData.collAvail}
                  onChange={inputsOption}
                  name="bookingType"
                />
                  </div>
                  <div style={{width:'33%'}}>
                      <label>Lab Pin </label>
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
                  value={editData.labPin}
                  onChange={inputsOption}
                  name="labPin"
                />
                  </div>
                  <div style={{width:'33%'}}>
                      <label>Lab Person</label>
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
                  value={editData.labPerson}
                  onChange={inputsOption}
                  name="labPerson"
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
                      <label>Is Active</label>
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
                //   value={editData.additionalInfo}
                //   onChange={inputsOption}
                  name="additionalInfo"
                />
                  </div>
                  <div style={{width:'33%',marginTop:'30px'}}>
                  <button style={{width:'100px',float:'right'}}className="is-success" onClick={handleSubmit}>Save</button>
                  </div>
                  </div>
              
       </div>
   </InfoDialog>
    </>)
}
export default EditInfo;