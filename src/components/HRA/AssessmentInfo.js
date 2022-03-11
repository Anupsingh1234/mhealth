import React from "react";
import InfoDialog from "../Utility/InfoDialog";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";

const AssessmentInfo = ({ modalView, setModalView, details }) => {
  return (
    <div>
      {" "}
      {modalView && (
        <InfoDialog open={modalView} handleClose={() => setModalView(false)}>
          <CancelIcon
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              color: "#ef5350",
              cursor: "pointer",
            }}
            onClick={() => setModalView(false)}
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
            {details.map((curr) => {
              return (
                <>
                  <div style={{ position: "" }}>
                    <img
                      src={
                        curr.imgPath ||
                        "https://thumbs.dreamstime.com/z/senior-female-woman-patient-hospital-bed-26133386.jpg"
                      }
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: 4,
                        border: "1px solid #f5f5f5",
                        // objectFit: 'fill',
                      }}
                    />
                    <div style={{ fontWeight: 800 }}>Assessment Name</div>
                    <div style={{ fontSize: 12 }}>{curr.assesmentName}</div>
                    <div style={{ marginBottom: 5, marginTop: "0.5em" }}>
                      <div style={{ fontWeight: 800 }}> Description</div>
                      <div style={{ fontSize: 12 }}>{curr.description}</div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </InfoDialog>
      )}
    </div>
  );
};
export default AssessmentInfo;
