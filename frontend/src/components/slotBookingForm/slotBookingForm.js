import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import Image from "material-ui-image";
import useSWR from "swr";
import React from "react";
import { api_endpoint, api_endpoint1 } from "../constants";
import ActiveSlotCard from "../activeSlotCard/activeSlotCard";
import AvailableSlots from "../availableSlots/availableSlots";
import BookingCard from "../bookingCard/bookingCard";
import Swal from "sweetalert2";

import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@material-ui-new/core";
import Loader from "react-loader-spinner";

import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import BeneficiaryCard from "../beneficiaryCard/beneficiaryCard";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import PersonIcon from "@material-ui/icons/Person";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui-new/core/Chip";
import Navbar from "../navbar/Navbar";
import { CardHeader } from "@material-ui/core";
import BookingCardForm from "../bookingCardForm/bookingCardForm";
import BookingCardAdd from "../bookingCardForm/bookingCardAdd";
const SlotBookingForm = (props) => {
  //const navigate = useNavigate();
  const { match, history } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setLoading] = React.useState(true);
  const [userName, setUserName] = React.useState([""]);
  const [refId, setRefID] = React.useState([""]);
  const [vaccName, setVaccName] = React.useState([""]);
  const [ageGrp, setAgeGrp] = React.useState([""]);
  const [doseNo, setDoseNo] = React.useState([""]);
  const [slotInfo, setSlotInfo] = React.useState([]);

  const handleBook = () => {
    let doseObj = {};
    let benArr = [];
    let flag = 0;
    let leastOne = false;
    refId.forEach((refs, index) => {
      let benObj = {};
      leastOne = true;
      if (
        refId[index] === "" ||
        vaccName[index] === "" ||
        ageGrp[index] === "" ||
        doseNo[index] === "" ||
        userName[index] === ""
      ) {
        enqueueSnackbar("Please fill all the details", 2500);
        flag = 1;
      }
      benObj["beneficiary_reference_id"] = refs;
      benObj["name"] = userName[index];
      benObj["birth_year"] = ageGrp[index];
      benObj["vaccine"] = vaccName[index];
      doseObj[refs] = doseNo[index];
      benArr.push(benObj);
    });
    if (!leastOne) {
      flag = 1;
      enqueueSnackbar("Please select atleast one beneficiary", 3000);
    }
    let reqBody = {
      beneficiaries: benArr,
      phone_number: props.location.state.phoneNo,
      doses: doseObj,
    };
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    };
    // check if data is there;
    console.log(reqBody);
    if (flag == 0) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Book tokens!",
      })
        .then((result) => {
          if (result.isConfirmed) {
            return fetch(
              api_endpoint1 + "/apis/generateToken/",
              requestOptions
            );
          }
        })
        .then((response) => {
          if (response.status == 200) return response.json();
          else throw new Error("Tokens already booked");
        })
        .then((data) => {
          console.log(data);
          history.push({
            pathname: "/confirmPage",
            state: {
              qrPayload: data.qr_payload,
              response_tokens: data.response_tokens,
              fromApp: true,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Token already booked for one or more beneficiaries!",
          });
          //   enqueueSnackbar(err, 3000);
        });
    }
  };

  const handleUserName = (event, id) => {
    let tempArr = [...userName];
    tempArr[id] = event.target.value;
    setUserName(tempArr);
  };
  const handleRefID = (event, id) => {
    let tempArr = [...refId];
    tempArr[id] = event.target.value;
    setRefID(tempArr);
  };
  const handleVaccName = (event, id) => {
    let tempArr = [...vaccName];
    tempArr[id] = event.target.value;
    setVaccName(tempArr);
  };
  const handlesetAgeGrp = (event, id) => {
    let tempArr = [...ageGrp];
    tempArr[id] = event.target.value;
    setAgeGrp(tempArr);
  };
  const handleDoseNo = (event, id) => {
    let tempArr = [...doseNo];
    tempArr[id] = event.target.value;
    setDoseNo(tempArr);
  };
  const addCard = () => {
    if (userName.length < 4) {
      setUserName([...userName, ""]);
      setRefID([...refId, ""]);
      setVaccName([...vaccName, ""]);
      setAgeGrp([...ageGrp, ""]);
      setDoseNo([...doseNo, ""]);
      console.log(userName.length);
    } else {
      enqueueSnackbar("Maximum 4 tokens allowed at a time", 2000);
    }
  };

  const delCard = (id) => {
    let tempArr = [...userName];
    tempArr.splice(id, 1);
    setUserName(tempArr);
    tempArr = [...refId];
    tempArr.splice(id, 1);
    setRefID(tempArr);
    tempArr = [...vaccName];
    tempArr.splice(id, 1);
    setVaccName(tempArr);
    tempArr = [...ageGrp];
    tempArr.splice(id, 1);
    setAgeGrp(tempArr);
    tempArr = [...doseNo];
    tempArr.splice(id, 1);
    setDoseNo(tempArr);
    // console.log(userName);
  };
  React.useEffect(() => {
    console.log(userName);
  }, [userName]);
  const ggRef = React.useRef(null);
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      maxWidth: 450,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(2),
      borderRadius: "5px",
      boxShadow: "2px 4px 2px grey",
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    section1: {
      margin: theme.spacing(0.5),
    },
    section2: {
      margin: theme.spacing(2),
    },
    section3: {
      margin: theme.spacing(3, 1, 1),
    },
  }));
  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  React.useEffect(() => {
    // if (!props.location.state) {
    //   history.replace("/signinotp");
    //   return;
    // }
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(api_endpoint1 + "/apis/getSlots/", requestOptions)
      .then((response) => {
        if (response.status == 200) return response.json();
        else throw new Error("Failed to fetch slots, try again later");
      })
      .then((data) => {
        console.log(data);
        setSlotInfo(data.slots);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);

  const classes = useStyles();
  return (
    <>
      <Navbar />
      {!isLoading ? (
        <div style={{ margin: "0 auto", width: "80%" }}>
          <Card style={{ margin: "20px" }}>
            <CardHeader
              title="Available Slots"
              subheader="The numbers might update during the booking procedure."
            />
            <Divider />
            <CardContent>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gridColumnGap: "20px",
                  gridRowGap: "20px",
                }}
              >
                {slotInfo.map((slot) => (
                  <AvailableSlots
                    vaccine={slot.vaccine}
                    ageGrp={slot.age_group}
                    dose_choice={slot.dose_choice}
                    available={
                      parseInt(slot.availability) - parseInt(slot.booked) > 0
                        ? parseInt(slot.availability) - parseInt(slot.booked)
                        : 0
                    }
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card style={{ margin: "20px" }}>
            <CardHeader
              title="Book Slots"
              subheader="Failed to fetch beneficiaries, please enter the details manually, else try again later."
            />
            <Divider />
            <CardContent>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gridRowGap: "20px",
                  gridColumnGap: "25px",
                }}
              >
                {userName.map((val, index) => (
                  <BookingCardForm
                    index={index}
                    delCard={delCard}
                    handleUserName={handleUserName}
                    handleRefID={handleRefID}
                    handleDoseNo={handleDoseNo}
                    handlesetAgeGrp={handlesetAgeGrp}
                    handleVaccName={handleVaccName}
                    valUser={userName[index]}
                    valVacc={vaccName[index]}
                    valAge={ageGrp[index]}
                    valRef={refId[index]}
                    valDose={doseNo[index]}
                  />
                ))}

                <BookingCardAdd addCard={addCard} />
              </div>
              <Divider />
              <Box
                style={{
                  display: "flex",
                  padding: "8px",
                  justifyItems: "flex-end",
                }}
              >
                <div style={{ flexGrow: 1 }}></div>
                <Button
                  color="primary"
                  variant="contained"
                  style={{
                    marginRight: "15px",
                    marginLeft: "20px",
                    fontWeight: "bold",
                    background: "#0acb6a",
                    borderRadius: "20px",
                  }}
                  onClick={() => {
                    handleBook();
                    // history.push("/confirmPage");
                  }}
                >
                  Book Slot(s)
                </Button>
              </Box>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Loader
          type="Oval"
          color="#00BFFF"
          height={80}
          width={80}
          style={{ position: "fixed", left: "50%", top: "50%" }}
        />
      )}
    </>
  );
};

export default SlotBookingForm;
