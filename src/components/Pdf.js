import { React, useEffect, useRef } from "react";
import printHtmlToPDF from "print-html-to-pdf";
import { useHistory } from "react-router-dom";
import { HeightTwoTone, Translate } from "@material-ui/icons";
import { X } from "react-feather";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment";
// import { overflow } from "html2canvas/dist/types/css/property-descriptors/overflow";
import { renderToString } from "react-dom/server";
export const Pdf = () => {
  const history = useHistory();
  useEffect(() => {
    pdfCreate();
  }, []);
  const inputRef = useRef(null);
  const pdfCreate = async (event) => {
    // window.html2canvas = html2canvas;
    //  var doc = new jsPDF({
    //   //  orientation: 'landscape',
    //    unit: 'px',
    //    format:"a4"
    //  });
    //    var content = document.getElementById('print-me');
    //   const string = renderToString(content);
    //  const doc = new jsPDF('p', 'mm', 'a4');

    //  console.log('content', content);
    //  console.log('document.body', document.body);
    //  doc.html(content, {
    //    callback: function (doc) {
    //      console.log('in callback');
    //      doc.save();
    //       history.push('/dashboard');
    //    },
    //  });
    // doc.fromHTML(string);
    // doc.save('pdf');

    //   const node = document.getElementById("print-me");
    //   const pdfOption = {
    //     jsPDF: {
    //       unit: "px",
    //       format: "a4",

    //       // height: "100%",
    //     },
    //     spin: true,
    //     fileName: "default",
    //   };
    //   await window.print();
    //   // history.push("/dashboard");

    html2canvas(inputRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 5, 5, 200, 288);
      pdf.save("Certificate.pdf");
      history.push("/dashboard");
    });
  };

  return (
    <>
      <div
        id="print-me"
        ref={inputRef}
        style={{
          background:
            localStorage.getItem("certificateType") == 1 ||
            localStorage.getItem("certificateType") == 2 ||
            localStorage.getItem("certificateType") == 3
              ? "black"
              : "#bdc3c7",
          color: "black",
          width: "1590px",
          height: "2245px",
        }}
      >
        <div className="certificate-header" style={{ display: "flex" }}>
          <div style={{ display: "flex" }}>
            {" "}
            <div
              class="triangle-left"
              style={{
                borderRight:
                  localStorage.getItem("certificateType") == 1 ||
                  localStorage.getItem("certificateType") == 5
                    ? "250px solid green"
                    : localStorage.getItem("certificateType") == 2 ||
                      localStorage.getItem("certificateType") == 4
                    ? "250px solid blue"
                    : localStorage.getItem("certificateType") == 3 ||
                      localStorage.getItem("certificateType") == 6
                    ? "250px solid red"
                    : "250px solid red",
              }}
            ></div>
            <div
              class="rectangle"
              style={{
                background:
                  localStorage.getItem("certificateType") == 1 ||
                  localStorage.getItem("certificateType") == 5
                    ? "green"
                    : localStorage.getItem("certificateType") == 2 ||
                      localStorage.getItem("certificateType") == 4
                    ? "blue"
                    : localStorage.getItem("certificateType") == 3 ||
                      localStorage.getItem("certificateType") == 6
                    ? "red"
                    : "red",
              }}
            ></div>
          </div>
          <div style={{ display: "flex", marginLeft: "770px" }}>
            <div style={{}}>
              <img
                src={
                  localStorage.getItem("certificateType") == 1 ||
                  localStorage.getItem("certificateType") == 5
                    ? "images/green_stripe.png"
                    : localStorage.getItem("certificateType") == 2 ||
                      localStorage.getItem("certificateType") == 4
                    ? "images/blue_stripe.png"
                    : localStorage.getItem("certificateType") == 3 ||
                      localStorage.getItem("certificateType") == 6
                    ? "images/red_stripe.png"
                    : "images/red_stripe.png"
                }
                // "images/red_stripe.png"
                style={{
                  transform: "rotate(90deg)",
                  marginRight: "0px",
                  // user-select: 'auto';
                  height: "400px",
                  width: "400px",
                  marginTop: "-170px",
                }}
              />
            </div>

            <div class="" style={{}}>
              <img
                src={
                  localStorage.getItem("certificateType") == 1 ||
                  localStorage.getItem("certificateType") == 5
                    ? "images/green-flow.png"
                    : localStorage.getItem("certificateType") == 2 ||
                      localStorage.getItem("certificateType") == 4
                    ? "images/blue-flow.png"
                    : localStorage.getItem("certificateType") == 3 ||
                      localStorage.getItem("certificateType") == 6
                    ? "images/red-flow.png"
                    : "images/red-flow.png"
                }
                style={{ height: "230px", width: "230px" }}
              />
            </div>
          </div>
        </div>

        <div
          className="second-stripe"
          style={{ display: "flex", justifyContent: "center", marginTop: -300 }}
        >
          <div> </div>
          <div>
            <div
              style={{
                // color:
                //   localStorage.getItem('certificateType') == 1 ||
                //   localStorage.getItem('certificateType') == 2 ||
                //   localStorage.getItem('certificateType') == 3
                //     ? '#bdc3c7'
                //     : 'black',
                fontSize: 60,
                marginLeft: 20,
                // marginTop: '-50px',
              }}
            >
              {" "}
              {localStorage.getItem("certificateType") == 1 ||
              localStorage.getItem("certificateType") == 2 ||
              localStorage.getItem("certificateType") == 3 ? (
                <img
                  src="images/mHealthLogoWhite.png"
                  style={{ height: "200px", width: " 400px" }}
                />
              ) : (
                <img
                  src="images/mHealthLogo_black.png"
                  style={{ height: "200px", width: " 400px" }}
                />
              )}
            </div>{" "}
          </div>
        </div>

        <div
          className="second-stripe"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "50px",
          }}
        >
          <div>
            <div
              style={{
                color:
                  localStorage.getItem("certificateType") == 1 ||
                  localStorage.getItem("certificateType") == 2 ||
                  localStorage.getItem("certificateType") == 3
                    ? "#bdc3c7"
                    : "black",
                fontSize: 100,
                marginLeft: 20,
                fontFamily: "UnifrakturMaguntia",
              }}
            >
              {" "}
              Finisher{" "}
              <mark style={{ visibility: "hidden", marginLeft: -10 }}>~</mark>
              Certificate
            </div>{" "}
          </div>
        </div>

        <div
          className="congrats"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "80px",
          }}
        >
          <div>
            <div
              style={{
                color:
                  localStorage.getItem("certificateType") == 1 ||
                  localStorage.getItem("certificateType") == 2 ||
                  localStorage.getItem("certificateType") == 3
                    ? "#bdc3c7"
                    : "black",
                fontSize: 20,
                marginLeft: 20,
                fontWeight: "200",
              }}
            >
              {" "}
              THIS IS TO CERTIFY THAT
            </div>{" "}
          </div>
        </div>

        <div
          className="congrats"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "0px",
          }}
        >
          <div>
            <div
              style={{
                color:
                  localStorage.getItem("certificateType") == 1 ||
                  localStorage.getItem("certificateType") == 2 ||
                  localStorage.getItem("certificateType") == 3
                    ? "#bdc3c7"
                    : "black",
                fontSize: 50,
                marginLeft: 20,
                // fontFamily: 'Qwitcher Grypen',
                fontWeight: "800",
              }}
            >
              {" "}
              {localStorage.getItem("firstName")}{" "}
              <mark style={{ visibility: "hidden", marginLeft: -10 }}>~</mark>
              {localStorage.getItem("lastName")}
            </div>
            <p style={{ borderBottom: "1px solid gray", width: "120%" }}> </p>
          </div>
        </div>

        <div
          className="congrats"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "80px",
          }}
        >
          <div>
            <div
              style={{
                color:
                  localStorage.getItem("certificateType") == 1 ||
                  localStorage.getItem("certificateType") == 2 ||
                  localStorage.getItem("certificateType") == 3
                    ? "#bdc3c7"
                    : "black",
                fontSize: 20,
                marginLeft: 20,
                fontWeight: "200",
              }}
            >
              {" "}
              HAS SUCCESSFULLY COMPLETED
              <mark style={{ visibility: "hidden", marginLeft: -10 }}>~</mark>
            </div>{" "}
          </div>
        </div>

        <div
          className="congrats"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <div>
            <div
              style={{
                color:
                  localStorage.getItem("certificateType") == 1 ||
                  localStorage.getItem("certificateType") == 2 ||
                  localStorage.getItem("certificateType") == 3
                    ? "#bdc3c7"
                    : "black",
                fontSize: 50,
                marginLeft: 20,
                fontWeight: "800",
              }}
            >
              {localStorage.getItem("challengeName")}{" "}
            </div>
            <p style={{ borderBottom: "1px solid gray", width: "120%" }}> </p>
          </div>
        </div>

        <div
          className="congrats"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "80px",
          }}
        >
          <div>
            <div
              style={{
                color:
                  localStorage.getItem("certificateType") == 1 ||
                  localStorage.getItem("certificateType") == 2 ||
                  localStorage.getItem("certificateType") == 3
                    ? "#bdc3c7"
                    : "black",
                fontSize: 20,
                marginLeft: 20,
                fontWeight: "200",
              }}
            >
              WITH TOTAL ACTIVE
              <mark style={{ visibility: "hidden" }}>~</mark>
              DAYS
            </div>
          </div>
        </div>

        <div
          className="congrats"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <div>
            <div
              style={{
                color:
                  localStorage.getItem("certificateType") == 1 ||
                  localStorage.getItem("certificateType") == 2 ||
                  localStorage.getItem("certificateType") == 3
                    ? "#bdc3c7"
                    : "black",
                fontSize: 50,
                marginLeft: 20,
                fontWeight: "800",
              }}
            >
              {" "}
              {localStorage.getItem("activeDays")}
              <mark style={{ visibility: "hidden", marginLeft: -10 }}>
                ~
              </mark>{" "}
              DAYS
            </div>
            <p style={{ borderBottom: "1px solid gray", width: "120%" }}> </p>
          </div>
        </div>

        <div
          className="congrats"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "80px",
          }}
        >
          <div>
            <div
              style={{
                color:
                  localStorage.getItem("certificateType") == 1 ||
                  localStorage.getItem("certificateType") == 2 ||
                  localStorage.getItem("certificateType") == 3
                    ? "#bdc3c7"
                    : "black",
                fontSize: 20,
                marginLeft: 20,
                fontWeight: "200",
              }}
            >
              AND DISTANCE
              <mark style={{ visibility: "hidden" }}>~</mark>
              COVERED
            </div>
          </div>
        </div>

        <div
          className="congrats"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <div>
            <div
              style={{
                color:
                  localStorage.getItem("certificateType") == 1 ||
                  localStorage.getItem("certificateType") == 2 ||
                  localStorage.getItem("certificateType") == 3
                    ? "#bdc3c7"
                    : "black",
                fontSize: 50,
                marginLeft: 20,
                fontWeight: "800",
              }}
            >
              {localStorage.getItem("kmAchieve")} KM
            </div>
            <p style={{ borderBottom: "1px solid gray", width: "120%" }}> </p>
          </div>
        </div>

        <div
          className="congrats"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "80px",
          }}
        >
          <div>
            <div
              style={{
                color:
                  localStorage.getItem("certificateType") == 1 ||
                  localStorage.getItem("certificateType") == 2 ||
                  localStorage.getItem("certificateType") == 3
                    ? "#bdc3c7"
                    : "black",
                fontSize: 20,
                marginLeft: 20,
                fontWeight: "200",
              }}
            >
              ON OR
              <mark style={{ visibility: "hidden" }}>~</mark>
              BEFORE
            </div>
          </div>
        </div>
        <div
          className="congrats"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <div>
            <div
              style={{
                color:
                  localStorage.getItem("certificateType") == 1 ||
                  localStorage.getItem("certificateType") == 2 ||
                  localStorage.getItem("certificateType") == 3
                    ? "#bdc3c7"
                    : "black",
                fontSize: 40,
                marginLeft: 20,
                fontWeight: "800",
              }}
            >
              {moment(localStorage.getItem("endDate")).format("DD-MM-YYYY")}
              <p
                style={{
                  borderBottom: "1px solid gray",
                  width: "120%",
                  marginLeft: "-15px",
                }}
              >
                {" "}
              </p>
            </div>{" "}
          </div>
        </div>
        <div style={{ height: 110, color: "#fff" }}></div>

        <div className="footer" style={{ marginTop: "13%" }}>
          <div
            className="certificate-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              height: 375,
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", transform: "rotate(180deg)" }}>
              <div style={{}}>
                <img
                  src={
                    localStorage.getItem("certificateType") == 1 ||
                    localStorage.getItem("certificateType") == 5
                      ? "images/green_stripe.png"
                      : localStorage.getItem("certificateType") == 2 ||
                        localStorage.getItem("certificateType") == 4
                      ? "images/blue_stripe.png"
                      : localStorage.getItem("certificateType") == 3 ||
                        localStorage.getItem("certificateType") == 6
                      ? "images/red_stripe.png"
                      : "images/red_stripe.png"
                  }
                  style={{
                    transform: "rotate(270deg)",
                    marginRight: "0px",
                    // user-select: 'auto';
                    height: "400px",
                    width: "400px",
                    marginTop: "-170px",
                  }}
                />
              </div>

              <div class="" style={{}}>
                <img
                  src={
                    localStorage.getItem("certificateType") == 1 ||
                    localStorage.getItem("certificateType") == 5
                      ? "images/green-flow.png"
                      : localStorage.getItem("certificateType") == 2 ||
                        localStorage.getItem("certificateType") == 4
                      ? "images/blue-flow.png"
                      : localStorage.getItem("certificateType") == 3 ||
                        localStorage.getItem("certificateType") == 6
                      ? "images/red-flow.png"
                      : "images/red-flow.png"
                  }
                  // src=
                  style={{ height: "230px", width: "230px" }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                transform: "rotate(180deg)",
                marginLeft: "770px",
              }}
            >
              {" "}
              <div
                class="triangle-left"
                style={{
                  borderRight:
                    localStorage.getItem("certificateType") == 1 ||
                    localStorage.getItem("certificateType") == 5
                      ? "250px solid green"
                      : localStorage.getItem("certificateType") == 2 ||
                        localStorage.getItem("certificateType") == 4
                      ? "250px solid blue"
                      : localStorage.getItem("certificateType") == 3 ||
                        localStorage.getItem("certificateType") == 6
                      ? "250px solid red"
                      : "250px solid red",
                }}
              ></div>
              <div
                class="rectangle"
                style={{
                  background:
                    localStorage.getItem("certificateType") == 1 ||
                    localStorage.getItem("certificateType") == 5
                      ? "green"
                      : localStorage.getItem("certificateType") == 2 ||
                        localStorage.getItem("certificateType") == 4
                      ? "blue"
                      : localStorage.getItem("certificateType") == 3 ||
                        localStorage.getItem("certificateType") == 6
                      ? "red"
                      : "red",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pdf;
