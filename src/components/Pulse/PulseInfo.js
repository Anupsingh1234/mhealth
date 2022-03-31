import React from "react";
import InfoDialog from "../Utility/InfoDialog";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";

const PulseInfo = ({ open, setOpen, details }) => {
  return (
    <div>
      {" "}
      {open && (
        <InfoDialog open={open} handleClose={() => setOpen(false)}>
          <CancelIcon
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              color: "#ef5350",
              cursor: "pointer",
            }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              width: "500px",
              minHeight: "300px",
              maxHeight: "90vh",
              overflow: "scroll",
              padding: "10px 10px 10px 10px",
            }}
          >
            {/* {details.map((curr) => {
              return (
                <> */}
                  <div style={{ position: "" }}>
                    <img
                      src={
                        details.packageBanner ||
                        "https://walkathon21.s3.ap-south-1.amazonaws.com/logo/Background.png"
                      }
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: 4,
                        border: "1px solid #f5f5f5",
                        // objectFit: 'fill',
                      }}
                    />
                    <div style={{ fontWeight: 800 }}>Health Package Name</div>
                    <div style={{ fontSize: 12 }}>{details.healthPkgName}</div>
                    <div style={{ marginBottom: 5, marginTop: "0.5em" }}>
                      <div style={{ fontWeight: 800 }}> Health From Date</div>
                      <div style={{ fontSize: 12 }}>{details.pkgBookingFrom}</div>
                    </div>
                    <div style={{ marginBottom: 5, marginTop: "0.5em" }}>
                      <div style={{ fontWeight: 800 }}>  Health To Date</div>
                      <div style={{ fontSize: 12 }}>{details.pkgBookingTo}</div>
                    </div>
                    <div style={{ marginBottom: 5, marginTop: "0.5em" }}>
                      <div style={{ fontWeight: 800 }}> Test Package Name</div>
                      <div style={{ fontSize: 12 }}>{details.testPackageName.map((item)=>{
                          return(<>{item},{" "}</>)
                      })}</div>
                    </div>
                    <div style={{ marginBottom: 5, marginTop: "0.5em" }}>
                      <div style={{ fontWeight: 800 }}>Sample Collection</div>
                      <div style={{ fontSize: 12 }}>{details.sample}</div>
                    </div>
                  </div>
                {/* </>
              );
            })} */}
          </div>
        </InfoDialog>
      )}
    </div>
  );
};
export default PulseInfo;
