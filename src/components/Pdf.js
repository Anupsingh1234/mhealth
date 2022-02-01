import { React, useEffect } from "react";
import printHtmlToPDF from "print-html-to-pdf";
import { useHistory } from "react-router-dom";
import { HeightTwoTone, Translate } from "@material-ui/icons";
import { X } from "react-feather";

// import { overflow } from "html2canvas/dist/types/css/property-descriptors/overflow";

export const Pdf = () => {
  const history = useHistory();
  useEffect(() => {
    pdfCreate();
  }, []);

  const pdfCreate = async (event) => {
    const node = document.getElementById("print-me");
    const pdfOption = {
      jsPDF: {
        unit: "px",
        format: "a4",

        // height: "100%",
      },
      spin: true,
      fileName: "default",
    };
    await printHtmlToPDF.print(node, pdfOption);
    history.push("/dashboard");
  };
  return (
    <>
      <div
        id="print-me"
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
          <div>
            {" "}
            <img
              src="images/logo.png"
              style={{ height: 100, width: 100 }}
            />{" "}
          </div>
          <div>
            <div
              style={{
                color:
                  localStorage.getItem("certificateType") == 1 ||
                  localStorage.getItem("certificateType") == 2 ||
                  localStorage.getItem("certificateType") == 3
                    ? "#bdc3c7"
                    : "black",
                fontSize: 60,
                marginLeft: 20,
              }}
            >
              {" "}
              mHealth
            </div>{" "}
          </div>
        </div>

        <div
          className="second-stripe"
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
                fontSize: 80,
                marginLeft: 20,
              }}
            >
              {" "}
              PARTICIPATION{" "}
              <mark style={{ visibility: "hidden", marginLeft: -10 }}>~</mark>
              CERTIFICATE
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
                fontSize: 30,
                marginLeft: 20,
              }}
            >
              {" "}
              CONGRATULATIONS
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
                fontSize: 45,
                marginLeft: 20,
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
                fontSize: 30,
                marginLeft: 20,
              }}
            >
              {" "}
              ON{" "}
              <mark style={{ visibility: "hidden", marginLeft: -10 }}>~</mark>
              COMPLETING
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
                fontSize: 45,
                marginLeft: 20,
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
                fontSize: 30,
                marginLeft: 20,
              }}
            >
              ACTIVE
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
                fontSize: 45,
                marginLeft: 20,
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
                fontSize: 30,
                marginLeft: 20,
              }}
            >
              DISTANCE
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
                fontSize: 45,
                marginLeft: 20,
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
                fontSize: 40,
                marginLeft: 20,
              }}
            >
              {localStorage.getItem("endDate")}
            </div>{" "}
          </div>
        </div>
        <div style={{ height: 110, color: "#fff" }}></div>

        <div className="footer" style={{}}>
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
