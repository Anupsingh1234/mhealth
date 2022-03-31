import React from 'react'
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import CancelIcon from "@material-ui/icons/Cancel";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import InfoDialog from "../Utility/InfoDialog";
 const JoiningDetails = ({join,setJoin,bookingdetail1}) => {
  return (
    <div>
        {join&&(<InfoDialog open={join} onClose={setJoin}>
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
          <div style={{width:'600px',minHeight:'300px',maxHeight:'600px'}}>
              <Table>
              <TableHead>
                <TableRow>
                <TableCell>
                   <p style={{fontSize:'15px', fontWeight:'800'}}>S.N.</p>
                  </TableCell>
                  <TableCell>
                  <p style={{fontSize:'15px', fontWeight:'800'}}>Lab Name</p>
                  </TableCell>
                  <TableCell>
                  <p style={{fontSize:'15px', fontWeight:'800'}}>Date</p>
                  </TableCell>
                  <TableCell>
                  <p style={{fontSize:'15px', fontWeight:'800'}}>Status</p>
                  </TableCell>
                  {/* <TableCell>
                      Lab Name
                  </TableCell> */}
                  </TableRow>
                  </TableHead>
                  <TableBody>
                      {bookingdetail1&&bookingdetail1.map((item,ind)=>{
                          return(<>
                          <TableRow>
                           <TableCell align="center">
                                        {" "}
                                        <span style={{ fontSize: 12 }}>
                                          {ind + 1}
                                        </span>{" "}
                                      </TableCell>
                          <TableCell align="left">
                          {" "}
                          <p
                            style={{
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              width: "200px",
                              display: "block",
                              overflow: "hidden",
                              fontSize: 12,
                            }}
                          >
                            {" "}
                            <span style={{ fontSize: 12 }}>
                              {item.partnerLabName
                                ? item.partnerLabName
                                : "  -     "}
                            </span>{" "}
                          </p>{" "}
                        </TableCell>
                        <TableCell>
                        <span style={{ fontSize: 12 }}>
                              {item.date
                                ? item.date
                                : "  -     "}
                            </span>{" "}
                        </TableCell>
                        <TableCell>
                        <span style={{ fontSize: 12 }}>
                              {item.status
                                ? item.status
                                : "  -     "}
                            </span>{" "}
                        </TableCell>
                        </TableRow>
                        </>)})}
                      <TableRow>
                          
                      </TableRow>
                  </TableBody>
              </Table>
          </div>
        </InfoDialog>)}
    </div>
  )
}
export default JoiningDetails;
