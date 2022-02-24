import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Chip from "@material-ui/core/Chip";
// import Stack from '@material-ui/core/Stack';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";
import FacebookOutlinedIcon from "@material-ui/icons/Facebook";
import PinterestIcon from "@material-ui/icons/Pinterest";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import InstagramIcon from "@material-ui/icons/Instagram";
import TwitterIcon from "@material-ui/icons/Twitter";
import YouTubeIcon from "@material-ui/icons/YouTube";
import { getOldEvents } from "../../services/challengeApi";
import ScrollableList from "../ScrollableList";
import StarRatings from "react-star-ratings";
import LogoPng from "../../assets/logo.png";
import HomePageCarousel from "../HomePageCarousel";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { urlPrefix, secretToken } from "../../services/apicollection";
import axios from "axios";
const UpcomingEvents = (props) => {
  const link = window.location.href;
  const f_link = link.substring(0, 22);

  useEffect(() => {
    if (f_link === "https://global.mhealth") {
      setCode("GLOBAL");
    }
  }, []);

  const [code, setCode] = useState("");
  const history = useHistory();
  const [upcomingEventListLoader, setUpcomingEventListLoader] = useState(false);
  const [upcomingEventList, setUpcomingEventList] = useState([]);
  const [registerModalView, setRegisterModalView] = useState(false);
  const [instructionDetails, setInstructionDetails] = useState();
  const [expert, setexpert] = useState([]);
  const [progs, setprogs] = useState([]);
  const [blogList, setblogList] = useState([]);
  const [key, setkey] = useState("");
  const [socialLinks, setsocialLinks] = useState([]);
  const [Addr, setAddr] = useState([]);
  const getWeekDayByNumber = (number) => {
    const WeekDay = {
      0: "Sun",
      1: "Mon",
      2: "Tues",
      3: "Wed",
      4: "Thurs",
      5: "Fri",
      6: "Sat",
    };
    return WeekDay[number] || number;
  };

  useEffect(() => {
    getOldEvents()
      .then((res) => {
        setUpcomingEventListLoader(true);
        if (res.data.response.responseMessage === "SUCCESS") {
          window.banner = res.data.response.responseData?.keyword.banner;
          const data = res.data.response.responseData.events.filter((item) => {
            return item.isActive == 1 && item.regOpen;
          });
          setUpcomingEventList(data);
          setInstructionDetails(
            res?.data?.response?.responseData?.instruction_details
          );
        }
        setUpcomingEventListLoader(false);
      })
      .catch((err) => {
        setUpcomingEventList([]);
        setUpcomingEventListLoader(false);
      });
  }, []);

  const keyword = () => {
    const url = window.location.href;

    const word = url.indexOf("://");
    const lastword = url.indexOf(".mhealth");
    let b = lastword;
    let a = word + 3;
    window.key = url.substr(a, b - 8);
    // console.log(url.substr(a, b - 8), b);
    //  window.key ='w21'
  };

  // console.log(Addr, ' key');
  const testiMoney = () => {
    const URL = `${urlPrefix}clients/getTestimonialsByEventKeyboard?keyword=${window.key}`;

    return axios
      .get(URL, {
        headers: {
          Authorization: `Bearer ${secretToken}`,
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
        if (res?.data?.response?.responseCode === 0) {
          setexpert(res?.data?.response?.responseData);
        }
      });
  };
  // console.log(expert && expert.length, 'expertlenfgths');
  const CommingProgs = () => {
    const URL = `${urlPrefix}clients/getSubEventByEventKeyboard?keyword=${window.key}`;

    return axios
      .get(URL, {
        headers: {
          Authorization: `Bearer ${secretToken}`,
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
        if (res?.data?.response?.responseCode === 0) {
          setprogs(res?.data?.response?.responseData);
        }
        // setexpert(res?.data?.response?.responseData);
      });
  };

  const blogs = () => {
    const URL = `${urlPrefix}clients/getSocialPosts?keyword=${window.key}`;

    return axios
      .get(URL, {
        headers: {
          Authorization: `Bearer ${secretToken}`,
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
        if (res?.data?.response.responseCode === 0) {
          setblogList(res?.data?.response?.responseData);
        }
        // setexpert(res?.data?.response?.responseData);
      });
  };

  const getsocialLinks = () => {
    const URL = `${urlPrefix}clients/getSocialMediaLink?keyword=${window.key}`;

    return axios
      .get(URL, {
        headers: {
          Authorization: `Bearer ${secretToken}`,
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
        var marvelHeroes = res?.data?.response?.responseData?.filter(function (
          hero
        ) {
          const x = hero.socialMedia !== "address";
          return x;
        });

        var marvelHero = res?.data?.response?.responseData?.filter(function (
          hero
        ) {
          const x = hero.socialMedia == "address";
          return x;
        });

        {
          marvelHero && setAddr(marvelHero);
        }

        {
          marvelHeroes && setsocialLinks(marvelHeroes);
        }
        // setexpert(res?.data?.response?.responseData);
      });
  };

  // const getAddr = () => {
  //   var marvelHeroes = socialLinks.filter(function (hero) {
  //     const x = hero.socialMedia == 'address';
  //     return x;
  //   });

  //   // console.log(marvelHeroes);
  //   setAddr(marvelHeroes);
  // };

  useEffect(() => {
    keyword();
    testiMoney();
    getsocialLinks();
    CommingProgs();
    blogs();
    // getAddr();
    getsocialLinks();
    // getAddr();
  }, []);

  // console.log(key);
  useEffect(() => {
    if (history.location.search) {
      let params = new URLSearchParams(history.location.search.substring(1));
      let token = params.get("token");
      setCode(window.atob(token));

      /** challenge accept/reject */
      if (params.get("cid") && params.get("time") && params.get("status")) {
        localStorage.setItem("cid", params.get("cid"));
        localStorage.setItem("time", params.get("time"));
        localStorage.setItem("status", params.get("status"));
        if (!localStorage.token) {
          window.location.replace("/#/login");
        } else {
          window.location.replace("/#/dashboard");
        }
      }
    }
  }, [history.location.search]);

  const handleChange = (event) => {
    localStorage.removeItem("b64_registration_in_url");
    setCode(event.target.value);
  };

  let heroImageArray = upcomingEventList
    .filter((item) => item.challegeBanner)
    .map((item) => item.challegeBanner);

  const getUpcomingEventList = () => {
    if (code == "") {
      return upcomingEventList
        .filter((item) => item.eventView === "PUBLIC")
        .map((eventDetail, index) => (
          <Card
            challenge={eventDetail}
            key={index}
            setUpcomingEventList={setUpcomingEventList}
            registerModalView={registerModalView}
            setRegisterModalView={setRegisterModalView}
            userPastedCode={false}
            instruction_details={instructionDetails}
          />
        ));
    } else {
      const eventSearched = upcomingEventList.filter(
        (item) => item.registrationCode === code
      );
      const userPastedCode =
        history.location.search &&
        history.location.search.indexOf("?token=") !== -1;

      return eventSearched.length > 0 ? (
        upcomingEventList
          .filter((item) => item.registrationCode === code)
          .map((eventDetail, index) => (
            <Card
              challenge={eventDetail}
              key={index}
              setUpcomingEventList={setUpcomingEventList}
              registerModalView={registerModalView}
              setRegisterModalView={setRegisterModalView}
              userPastedCode={userPastedCode}
              instruction_details={instructionDetails}
            />
          ))
      ) : (
        <div className="event-search-fallback">No event</div>
      );
    }
  };
  return (
    <div
      className="upcoming-event-container"
      style={{
        height: "100vh",
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        className="upcoming-event-navbar"
        style={{ display: "flex", justifyContent: "end" }}
      >
        <div className="right">
          {" "}
          <button
            style={{
              width: 150,
              color: "#fff",
              background: "green",
              borderRadius: "5px",
              padding: "3px 9px",
              fontSize: "12px",
            }}
            onClick={() => {
              history.push("/login");
            }}
          >
            {localStorage.getItem("token")
              ? history.push("/dashboard")
              : "LOGIN | REGISTER"}
          </button>
        </div>
      </header>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100vw",
          marginLeft: -17,
        }}
      >
        {" "}
        <div className="upcoming-event-hero" style={{ width: "100vw" }}>
          {
            // console.log(heroImageArray , 'image')
            window.banner != null ? (
              <div style={{ width: "100vw" }}>
                <img src={window.banner} style={{ width: "100vw" }} />
                {/* <img
                  style={{width: '100%'}}
                  src="images/Testimonials/bann.jpg"
                /> */}
              </div>
            ) : heroImageArray && heroImageArray.length > 0 ? (
              <Carousel
                showThumbs={false}
                style={{ width: "100%" }}
                autoPlay={true}
                swipeable={true}
                dynamicHeight={true}
                infiniteLoop={true}
                showArrows={false}
                interval={3000}
              >
                {heroImageArray.map((item) => {
                  return (
                    <div style={{ width: "100%" }}>
                      <img src={item} style={{ width: "100%" }} />
                    </div>
                  );
                })}
              </Carousel>
            ) : (
              <div style={{ width: "100%" }}>
                <img
                  src="https://walkathon21.s3.ap-south-1.amazonaws.com/logo/W21Banner.jpeg"
                  style={{ width: "100%" }}
                />
              </div>
            )
          }
          {/* <div className="upcoming-event-intro">
        <div className="upcoming-event-heading"></div>
      </div>
      <div className="upcoming-event-list">
        {upcomingEventListLoader ? (
          <ScrollableList source="home-page">
            <div className="challenge-card"></div>
            <div className="challenge-card"></div>
            <div className="challenge-card"></div>
            <div className="challenge-card"></div>
          </ScrollableList>
        ) : (
          <ScrollableList>
            {upcomingEventList.length > 0 ? (
              getUpcomingEventList()
            ) : (
              <div className="event-search-fallback">No event</div>
            )}
          </ScrollableList>
        )}
      </div> */}
          <div style={{ marginTop: "auto" }}>
            <div className="nextDi">
              <div className="testiMonials" style={{}}>
                <div
                  style={{
                    width: "300px",
                    height: 228,
                    border:
                      expert && expert.length === 0 ? " " : "2px solid black",
                    borderRadius: 8,
                  }}
                  className={expert && expert.lenghth > 0 ? "" : ""}
                >
                  {expert && expert.length > 0 && (
                    <h2
                      style={{
                        textAlign: "center",
                        background: "gray",
                        fontWeight: "bolder",
                        marginTop: "2px",
                        color: "white",
                      }}
                    >
                      {" "}
                      Testimonials
                    </h2>
                  )}
                  {expert && expert.length > 0 && (
                    <ScrollableList
                      style={{
                        width: "300px",
                      }}
                      source="testiMon"
                      source="home-page"
                    >
                      {expert &&
                        expert.map((item, index) => {
                          return (
                            <div>
                              <Card
                                style={{
                                  width: "300px",
                                  height: 190,
                                  overflow: "scroll",
                                  marginTop: "-10px",
                                  // borderRadius: 8,
                                }}
                              >
                                <CardContent style={{ paddingTop: 30 }}>
                                  <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <div style={{ display: "flex" }}>
                                      {" "}
                                      <img
                                        style={{
                                          height: 60,
                                          width: 60,
                                          objectFit: "cover",
                                          borderRadius: 100,
                                        }}
                                        src={item.profileImage}
                                      />{" "}
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                        }}
                                      >
                                        {" "}
                                        <span
                                          style={{
                                            marginLeft: 10,
                                            marginTop: 5,
                                          }}
                                        >
                                          {" "}
                                          {item.name}{" "}
                                        </span>
                                        <div
                                          style={{
                                            marginLeft: 10,
                                            marginTop: -12,
                                          }}
                                        >
                                          <StarRatings
                                            rating={
                                              item.starRating
                                                ? item.starRating
                                                : 0.0
                                            }
                                            starRatedColor="#ffd700"
                                            starDimension="15px"
                                            numberOfStars={5}
                                            name="rating"
                                            starSpacing="0px"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    style={{ fontSize: 18, marginTop: "-10px" }}
                                  >
                                    <p>
                                      {" "}
                                      <b> {item.programName} </b>
                                    </p>
                                    <q style={{ marginLeft: 20 }}>
                                      {" "}
                                      {item.comment}
                                    </q>
                                  </Typography>
                                </CardContent>
                                {/* <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions> */}
                              </Card>
                            </div>
                          );
                        })}
                    </ScrollableList>
                  )}{" "}
                </div>

                {progs && progs.length > 0 && (
                  <div
                    style={{
                      width: "300px",
                      height: 228,
                      border: "2px solid black",
                      borderRadius: 8,
                    }}
                    className={progs.lenghth === 0 ? "" : "testimonial_"}
                  >
                    <h2
                      style={{
                        textAlign: "center",
                        background: "gray",
                        fontWeight: "bolder",
                        marginTop: "2px",
                        color: "white",
                      }}
                    >
                      {" "}
                      Programs
                    </h2>
                    {progs && (
                      <ScrollableList
                        style={{
                          width: "300px",
                        }}
                        source="home-page"
                      >
                        {" "}
                        {progs &&
                          progs.map((item, index) => {
                            return (
                              <div>
                                <Card
                                  className="progCard"
                                  style={{
                                    width: "300px",
                                    height: 180,
                                    zIndex: 1,
                                    // borderRadius: 20,
                                    // overflow: 'scroll',
                                  }}
                                >
                                  <div>
                                    {" "}
                                    <img
                                      style={{
                                        height: 90,
                                        width: "100%",
                                        objectFit: "scale-down",
                                      }}
                                      src={
                                        item.eventImage
                                          ? item.eventImage
                                          : "https://walkathon21.s3.ap-south-1.amazonaws.com/event/master/21f7b46d3ba9311dee594229567840c78482d2c6"
                                      }
                                    />{" "}
                                  </div>
                                  <CardContent>
                                    <Typography
                                      gutterBottom
                                      variant="h5"
                                      component="div"
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <span style={{ marginBottom: -10 }}>
                                        {" "}
                                        {item.name}{" "}
                                      </span>
                                      <div
                                        style={{
                                          display: "flex",
                                          marginTop: -10,
                                        }}
                                      >
                                        <div
                                          style={{
                                            // position: 'absolute',
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
                                            {item.registrationFees == 0
                                              ? "Free"
                                              : `Fees : ${item.registrationFees}`}
                                          </span>
                                        </div>

                                        <div
                                          style={{
                                            // position: 'absolute',
                                            bottom: 5,
                                            fontSize: 12,
                                            color: "#fff",
                                            left: 5,
                                          }}
                                        >
                                          <span
                                            style={{
                                              background: "#d65151",
                                              borderRadius: 4,
                                              padding: "0px 4px",
                                              marginLeft: 5,
                                              width: 130,
                                              // pa/dding: 3,
                                            }}
                                          >
                                            {item.subEventMode}
                                          </span>
                                        </div>
                                        <div
                                          style={{
                                            // position: 'absolute',
                                            bottom: 5,
                                            fontSize: 12,
                                            color: "#fff",
                                            left: 5,
                                            marginLeft: 20,
                                          }}
                                        >
                                          <StarRatings
                                            rating={
                                              item.programRating !== null
                                                ? item.programRating
                                                : 0.0
                                            }
                                            starRatedColor="#ffd700"
                                            starDimension="15px"
                                            numberOfStars={5}
                                            name="rating"
                                            starSpacing="0px"
                                            style={{}}
                                          />
                                        </div>
                                      </div>
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      style={{ fontSize: 12 }}
                                    >
                                      <div
                                        style={{
                                          fontSize: 16,
                                          fontWeight: "bolder",
                                        }}
                                      >
                                        {item.eventName}
                                      </div>
                                      <>Coach : {item.coach}</>
                                      <div style={{ display: "flex" }}>
                                        <div
                                          className="d-flex"
                                          style={{
                                            fontSize: 12,
                                            fontWeight: 700,
                                            width: "30%",
                                          }}
                                        >
                                          <div style={{}}>
                                            <b>
                                              {" "}
                                              {item.eventStartTime} -{" "}
                                              {item.eventEndTime}{" "}
                                            </b>
                                          </div>
                                        </div>
                                        <div
                                          className="d-flex"
                                          style={{
                                            fontSize: 12,
                                            fontWeight: 700,
                                            marginLeft: "2%",
                                          }}
                                        >
                                          {item.weekDays &&
                                          Array.isArray(item.weekDays)
                                            ? item.weekDays.map(
                                                (val, index) => (
                                                  <div
                                                    style={{
                                                      marginRight: "0.25em",
                                                    }}
                                                    key={index}
                                                  >
                                                    {getWeekDayByNumber(val)}
                                                    {index !==
                                                      item.weekDays.length -
                                                        1 && ","}
                                                  </div>
                                                )
                                              )
                                            : null}
                                        </div>
                                      </div>
                                    </Typography>
                                  </CardContent>
                                  {/* <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions> */}
                                </Card>
                              </div>
                            );
                          })}
                      </ScrollableList>
                    )}
                  </div>
                )}

                {blogList && blogList.length > 0 && (
                  <div
                    style={{
                      width: "300px",
                      height: 228,
                      border: "2px solid black",
                      borderRadius: 8,
                      // boxShadow: '7px 4px 5px 0px rgba(0, 0, 0, 0.75)',
                    }}
                    className={blogList && blogList.lenghth == 0 ? "" : ""}
                  >
                    <h2
                      style={{
                        textAlign: "center",
                        background: "gray",
                        fontWeight: "bolder",
                        marginTop: "2px",
                        color: "white",
                      }}
                    >
                      Blogs
                    </h2>
                    {blogList && (
                      <ScrollableList
                        style={{
                          width: "300px",
                        }}
                        source="home-page"
                      >
                        {blogList &&
                          blogList.map((item, index) => {
                            return (
                              <div>
                                <Card
                                  className="progCard"
                                  style={{
                                    width: "300px",
                                    maxHeight: 180,
                                    overflow: "scroll",
                                    // borderRadius: 8,
                                  }}
                                >
                                  <div
                                    style={{
                                      height: 300,
                                      display: "flex",
                                      justifyContent: "center",
                                      // alignItems: 'center',
                                      width: "100%",
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "100%",

                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <h2
                                        style={{
                                          background: "#dedad9",
                                          textAlign: "center",
                                          width: "100%",
                                          display: "flex",
                                          justifyContent: "center",
                                          // flexWrap: "wrap",
                                        }}
                                      >
                                        {item.postTitle}
                                      </h2>
                                      <a
                                        href={item.link}
                                        target="_blank"
                                        style={{ marginTop: 25 }}
                                      >
                                        {" "}
                                        <h4
                                          style={{
                                            display: "inline",
                                            textAlign: "center",
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "center",
                                          }}
                                        >
                                          {" "}
                                          {item.source === "YOUTUBE" ? (
                                            <YouTubeIcon
                                              style={{
                                                color: "red",

                                                height: 25,
                                                width: 25,
                                                marginTop: -5,
                                              }}
                                            />
                                          ) : item.source === "TWITTER" ? (
                                            <TwitterIcon
                                              style={{
                                                color: "lightblue",
                                                height: 25,
                                                width: 25,
                                                marginTop: 20,
                                              }}
                                            />
                                          ) : item.source === "FACEBOOK" ? (
                                            <FacebookOutlinedIcon
                                              style={{
                                                color: "#2747a8",
                                                height: 25,
                                                width: 25,
                                              }}
                                            />
                                          ) : (
                                            ""
                                          )}
                                          {/* yutube Channel - follow us for all the
                                          latest updates */}
                                          {item.shortNote}
                                        </h4>
                                      </a>
                                    </div>
                                  </div>
                                </Card>
                              </div>
                            );
                          })}
                      </ScrollableList>
                    )}
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: socialLinks && socialLinks.length === 0 ? 50 : 10,
                  marginBottom: 10,
                  // marginTop: 'auto',
                }}
              >
                {socialLinks && (
                  <div
                    className="socialLinks"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",

                      position: "sticky",
                      // bottom: 70,
                      // position: 'fixed',
                    }}
                  >
                    {socialLinks &&
                      socialLinks.map((item, index) => {
                        return (
                          <div key={index} style={{ marginLeft: 5 }}>
                            {/* <a href={item.mediaLink}> */}{" "}
                            <img
                              onClick={() => {
                                window.open(item.mediaLink);
                              }}
                              style={{
                                cursor: "pointer",
                                height: 30,
                                width: 30,
                                borderRadius: 100,
                              }}
                              src={item.mediaImage}
                            />
                            {/* </a> */}
                          </div>
                        );
                      })}
                  </div>
                )}{" "}
              </div>

              <footer className="frontFooter" style={{}}>
                <div
                  className="address"
                  style={{
                    display: "flex",
                  }}
                >
                  {Addr.length > 0 && (
                    <img
                      src="https://walkathon21.s3.ap-south-1.amazonaws.com/logo/social/location.png"
                      style={{ width: 30, height: 30, borderRadius: 100 }}
                    />
                  )}
                  {Addr &&
                    Addr.map((item, ind) => {
                      // console.log(item.mediaLink);
                      return (
                        <address
                          style={{
                            marginLeft: 10,
                          }}
                        >
                          {" "}
                          {item.mediaLink}
                        </address>
                      );
                    })}
                </div>

                <div
                  className="poweredBy"
                  style={{
                    display: "flex",
                  }}
                >
                  {" "}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{}} className="poweredChild">
                      Powered By{" "}
                      <span>
                        {" "}
                        <img
                          src={LogoPng}
                          width={30}
                          height={30}
                          style={{ marginTop: 5 }}
                        />
                      </span>{" "}
                      <b> mHealth</b>
                    </div>
                    <div style={{}} className="powered2">
                      {" "}
                      &#169;2021 Created by steering lives India Pvt . Ltd.
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;
