import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import Image from "material-ui-image";
import useSWR from "swr";
import React from "react";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { api_endpoint1 } from "../constants";
import ActiveSlotCard from "../activeSlotCard/activeSlotCard";
import Swal from "sweetalert2";
import AvailableSlots from "../availableSlots/availableSlots";
import BookingCard from "../bookingCard/bookingCard";
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

import { useTranslation } from 'react-i18next';

import {Howl, Howler} from 'howler';
import audio_hi from "../../audio/hi/select_vaccine.mp3"
import audio_en from "../../audio/en/select_vaccine.mp3" 


const SlotBooking = (props) => {
  //const navigate = useNavigate();
  const { match, history } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setLoading] = React.useState(true);
  const [slotInfo, setSlotInfo] = React.useState([]);
  const [benData, setBenData] = React.useState([
    { name: "Omkar", birth_year: 1960, vaccination_status: "Not Vaccinated" },
  ]);
  const [isChecked, setChecked] = React.useState([]);

  const { t, i18n } = useTranslation(["slotbooking","snack_bar","swal"]);

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

  const handleCheck = (id, status) => {
    let tempArr = [...isChecked];
    tempArr[id] = status ? 1 : -1;
    setChecked(tempArr);
  };
  const handleVaccine = (id, vaccineName) => {
    let tempArr = [...benData];
    tempArr[id].vaccine = vaccineName;
    setBenData(tempArr);
  };

  const handleBook = () => {
    let doseObj = {};
    let benArr = [];
    let flag = 0;
    let leastOne = false;
    benData.forEach((ben, index) => {
      if (isChecked[index] == 1) {
        leastOne = true;
        if (ben.vaccine === "") {
          enqueueSnackbar(
            t('snack_bar:choose_vaccine'),
            3000
          );
          flag = 1;
        }
        doseObj[ben.beneficiary_reference_id] =
          ben.vaccination_status === "Not Vaccinated" ? "dose1" : "dose2";
        benArr.push(benData[index]);
      }
    });
    if (!leastOne) {
      flag = 1;
      enqueueSnackbar(t('snack_bar:select_ben'), 3000);
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
        title: t("swal:slot_booking_1.title"),
        text: t("swal:slot_booking_1.text"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("swal:slot_booking_1.confirmButtonText"),
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
            title: t("swal:slot_booking_2.title"),
            text: t("swal:slot_booking_2.text"),
          });
          //   enqueueSnackbar(err, 3000);
        });
    }
  };

  React.useEffect(() => {
    console.log(i18n);
    var play;
    if(i18n.language =='en'){
      play = new Howl({
        src: audio_en,
        html5: true
      });      
    }
    else if(i18n.language =='hi'){
      play = new Howl({
        src: audio_hi,
        html5: true
      });  
    }
    else{

    }
    let timer = setTimeout(()=>{
      if(props.audio) {
        play.play();
      }
    },1000);
    return () => {
      play.stop();
      clearTimeout(timer);
    }
  },[])

  React.useEffect(() => {
    if (!props.location.state) {
      history.replace("/signinotp");
      return;
    }
    let tempArr = [...props.location.state.bens];
    tempArr.forEach((ben) => {
      ben.vaccine = "";
    });
    setBenData(tempArr);
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

  React.useEffect(() => {
    if (isChecked.length === 0) {
      let temp = benData.map(() => -1);
      setChecked(temp);
    }
  }, [benData]);

  const classes = useStyles();
  return (
    <>
      <Navbar {...props} />
      {!isLoading ? (
        <div style={{ margin: "0 auto", width: "80%" }}>
          <Card style={{ margin: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "0.5fr 20fr" }}>
              <div
                style={{
                  display: "grid",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => history.goBack()}
              >
                <ArrowBackIcon
                  style={{
                    marginLeft: "5px",
                    alignSelf: "center",
                    color: "red",
                  }}
                  fontSize="large"
                />
              </div>
              <CardHeader
                title={t("slotbooking:available_slots")}
                subheader={t("slotbooking:update_warning")}
              />
            </div>
            <Divider />
            <CardContent>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gridColumnGap: "15px",
                  gridRowGap: "15px",
                  padding: "10px",
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
            <Divider />
          </Card>
          <Card style={{ margin: "20px" }}>
            <CardHeader
              title={t("slotbooking:book_slots")}
              subheader={t("slotbooking:select_proceed")}
            />
            <Divider />
            <CardContent>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
                  gridColumnGap: "20px",
                  gridRowGap: "20px",
                  padding: "10px",
                }}
              >
                {benData.map((ben, id) => (
                  <BookingCard
                    name={ben.name}
                    vaccination_status={ben.vaccination_status}
                    birth_year={ben.birth_year}
                    ageGrp={
                      2021 - parseInt(ben.birth_year) > 45 ? "45+" : "18to45"
                    }
                    id={id}
                    handleCheck={handleCheck}
                    handleVaccine={handleVaccine}
                  />
                ))}
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
                  }}
                >
                  {t("slotbooking:book_slots")}
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

export default SlotBooking;
