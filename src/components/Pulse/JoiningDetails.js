import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import CancelIcon from "@material-ui/icons/Cancel";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import InfoDialog from "../Utility/InfoDialog";
import Modal from "@material-ui/core/Modal";
import { PrimaryButton } from "../Form";
import axios from "axios";
import { urlPrefix } from "../../services/apicollection";
import message from "antd-message";
const JoiningDetails = ({ join, setJoin, bookingdetail1, cards }) => {
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelData, setCancelData] = useState({
    action: "",
    bookingId: "",
    text: "",
  });
  const handleCancel = (row) => {
    setCancelData({
      action: "CANCEL",
      bookingId: row.id,
    });
    setCancelModal(true);
  };
  console.log(cancelData, "canceldata");

  const UpdateBooking = () => {
    const URL = `${urlPrefix}v1.0/updateCheckupBooking?action=${
      cancelData.action
    }&bookingId=${cancelData.bookingId}&text=${
      cancelData.text ? cancelData.text : ""
    }`;
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
        message.success(res.data.response.responseData);
        setCancelModal(false);
        setJoin(false);
        cards();
      });
  };
  return (
    <div>
      {join && (
        <InfoDialog open={join} onClose={setJoin}>
          <CancelIcon
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              color: "#ef5350",
              cursor: "pointer",
            }}
            onClick={() => setJoin(false)}
          />
          <div
            style={{ width: "600px", minHeight: "300px", maxHeight: "600px" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <p style={{ fontSize: "15px", fontWeight: "800" }}>S.N.</p>
                  </TableCell>
                  <TableCell>
                    <p style={{ fontSize: "15px", fontWeight: "800" }}>
                      Lab Name
                    </p>
                  </TableCell>
                  <TableCell>
                    <p style={{ fontSize: "15px", fontWeight: "800" }}>Date</p>
                  </TableCell>
                  <TableCell>
                    <p style={{ fontSize: "15px", fontWeight: "800" }}>Time</p>
                  </TableCell>
                  <TableCell>
                    <p style={{ fontSize: "15px", fontWeight: "800" }}>
                      Status
                    </p>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookingdetail1 &&
                  bookingdetail1.map((item, ind) => {
                    return (
                      <>
                        <TableRow>
                          <TableCell align="center">
                            {" "}
                            <span style={{ fontSize: 12 }}>{ind + 1}</span>{" "}
                          </TableCell>
                          <TableCell align="left">
                            {" "}
                            <p
                              style={{
                                // whiteSpace: "nowrap",
                                // textOverflow: "ellipsis",
                                width: "150px",
                                display: "block",
                                overflow: "hidden",
                                fontSize: 12,
                                display: "flex",
                                flexDirection: "column",
                                textAlign: "justify",
                              }}
                            >
                              {" "}
                              <span style={{ fontSize: 12 }}>
                                {item.partnerLabName
                                  ? item.partnerLabName
                                  : "  -     "}
                                <br />
                                {item.labAddress} ,{item.labCity}
                              </span>{" "}
                            </p>{" "}
                          </TableCell>
                          <TableCell>
                            <span style={{ fontSize: 12 }}>
                              {item.date ? item.date : "  -     "}
                            </span>{" "}
                          </TableCell>
                          <TableCell>
                            <span style={{ fontSize: 12 }}>
                              {item.time ? item.time : "  -     "}
                            </span>{" "}
                          </TableCell>
                          <TableCell>
                            <span style={{ fontSize: 12 }}>
                              {item.status ? item.status : "  -     "}
                            </span>{" "}
                          </TableCell>
                          {item.status !== "CANCELLED" ? (
                            <TableCell style={{ width: "50px" }}>
                              <PrimaryButton onClick={() => handleCancel(item)}>
                                Cancel
                              </PrimaryButton>
                            </TableCell>
                          ) : (
                            ""
                          )}
                        </TableRow>
                      </>
                    );
                  })}
                <TableRow></TableRow>
              </TableBody>
            </Table>
            {cancelModal && (
              <InfoDialog
                open={cancelModal}
                onClose={() => setCancelModal(false)}
              >
                <CancelIcon
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    color: "#ef5350",
                    cursor: "pointer",
                  }}
                  onClick={() => setCancelModal(false)}
                />
                <div
                  style={{
                    width: "400px",
                    minHeight: "200px",
                    maxHeight: "600px",
                  }}
                >
                  <div style={{ marginLeft: "20px" }}>
                    <label>Instruction</label>
                    <br />
                    <textarea
                      autofocus="autofocus"
                      style={{
                        background: "#f3f4f6",
                        padding: "10px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        width: "95%",
                        border: "1px solid black",
                        minHeight: "100px",
                        maxHeight: "300px",
                      }}
                      placeholder="Assessment Name"
                      value={cancelData.text}
                      onChange={(e) =>
                        setCancelData({ ...cancelData, text: e.target.value })
                      }
                      name="sampleCollectionAddress"
                    />
                  </div>
                  <div
                    style={{ width: "80px", height: "10px", marginLeft: "75%" }}
                    className="absolute  right-2"
                  >
                    <PrimaryButton
                      onClick={UpdateBooking}
                      mini
                      className="w-[max-content] text-sm"
                    >
                      Submit
                    </PrimaryButton>
                  </div>
                </div>
              </InfoDialog>
            )}
          </div>
        </InfoDialog>
      )}
    </div>
  );
};
export default JoiningDetails;
